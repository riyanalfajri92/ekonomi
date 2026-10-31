import {fetchInflationHistory,appendInflationHistory} from './inflation-history.mjs';
import {BI_HEADLINES_URL,parseBIHeadlines} from './bi-headlines.mjs';
import {PAUSED_SOURCES} from './access-policy.mjs';
import {FISCAL_WEB_INDEX,discoverFiscalWeb,parseFiscalWeb} from './fiscal-web.mjs';
import {changeLog,fiscalHistory} from './change-log.mjs';
import {BPS_URL,parseBPSHome} from './market-social.mjs';
import {collectExtended} from './extended.mjs';
import {fiscalDetails,fiscalComparisons} from './fiscal-detail.mjs';
import {contentFingerprint} from './integrity.mjs';
import {BI,WB,GAPS,EXTRA} from './catalog.mjs';
import {parseBI,parseWorldBank,parseNews,parseAPBN} from './parsers.mjs';
import {BANKS,parseBank,parseLPSDisclosure,parseAPBNPages,parseIndicators,articleDate,discoverReport,reportPDF,parseConsumerPDF,parsePMI} from './extensions.mjs';
import {inflationForecast} from './forecast.mjs';
export async function pdfPages(url,fetcher=fetch){
 const r=await fetcher(url,{signal:AbortSignal.timeout(15000)});if(!r.ok)throw Error('PDF HTTP '+r.status);
 const bytes=new Uint8Array(await r.arrayBuffer());if(bytes.length>8*1024*1024||bytes.length<10)throw Error('Ukuran PDF di luar batas');
 if(new TextDecoder().decode(bytes.slice(0,5))!=='%PDF-')throw Error('Sumber bukan PDF');
 const {PDFParse}=await import('pdf-parse');PDFParse.setWorker(new URL('../node_modules/pdf-parse/dist/pdf-parse/esm/pdf.worker.mjs',import.meta.url).href);const parser=new PDFParse({data:bytes});try{return (await parser.getText()).pages;}finally{await parser.destroy();}
}
export const NEWS_URL='https://www.bi.go.id/id/publikasi/ruang-media/news-release/default.aspx';
export const APBN_URL='https://api-djppr.kemenkeu.go.id/web/api/v1/page?url=paparanapbnkita';
export async function download(url,fetcher=fetch){
 const timeoutMs=new URL(url).hostname==='paskerid.kemnaker.go.id'?25000:new URL(url).hostname==='www.bi.go.id'?20000:10000;
 const request=()=>fetcher(url,{signal:AbortSignal.timeout(timeoutMs),headers:{'Accept':'text/html,application/json;q=0.9,*/*;q=0.1','User-Agent':'NadiEconomicDashboard/1.0 (public economic data; cached requests)'}});
 let response;try{response=await request();}catch(e){if(!['TimeoutError','AbortError','TypeError'].includes(e.name))throw e;response=await request();}
 if(!response.ok)throw Error('Sumber merespons HTTP '+response.status);
 const reader=response.body?.getReader();if(!reader)return await response.text();
 const decoder=new TextDecoder();let total=0,result='';
 try{while(true){const {done,value}=await reader.read();if(done)break;total+=value.length;if(total>4*1024*1024)throw Error('Respons sumber terlalu besar');result+=decoder.decode(value,{stream:true});}const body=result+decoder.decode();if((body.length<5000&&/_Incapsula_Resource/i.test(body))||/Request unsuccessful.*Incapsula|The URL you requested has been blocked/i.test(body))throw Error('Sumber membatasi akses otomatis; data terakhir dipertahankan');return body;}finally{await reader.cancel().catch(()=>{});}
}
function errorText(e){return String(e?.message||'Koneksi sumber gagal').slice(0,150);}
export function mergeMetric(def,points,prior,now,error=null,extra={}){
 const checkedAt=now.toISOString();let history=points||[];let fallback=false;if(points?.length&&prior?.history?.length){const map=new Map(prior.history.map(p=>[p.period,p]));for(const p of points)map.set(p.period,p);history=[...map.values()].sort((a,b)=>b.period.localeCompare(a.period)).slice(0,def.id==='inflation'?240:120);}
 if(!history.length){history=prior?.history||[];fallback=history.length>0;}
 if(points?.length&&prior?.history?.length&&points[0].period<prior.history[0].period){history=prior.history;fallback=true;error='Sumber mengembalikan periode lebih lama; mempertahankan observasi sebelumnya';}
 const latest=history[0]||null;const periodDate=latest?new Date(latest.period.length===4?latest.period+'-12-31':latest.period.length===7?latest.period+'-01':latest.period):null;
 const tooOld=periodDate&&(now-periodDate)/86400000>def.maxAgeDays;
 const previous=history[1];
 const delta=latest&&previous?latest.value-previous.value:null;
 return {...def,...extra,header:undefined,min:undefined,max:undefined,history,period:latest?.period||null,value:latest?.value??null,
  delta:def.suppressDelta?null:delta,previousPeriod:previous?.period||null,deltaUnit:def.unit.includes('%')?'poin persentase':'nilai',
  publishedAt:extra.publishedAt??(fallback?prior?.publishedAt:null)??null,rangeStart:extra.rangeStart??(fallback?prior?.rangeStart:null)??null,officialForecast:extra.officialForecast??(fallback?prior?.officialForecast:null)??null,pdfUrl:extra.pdfUrl??(fallback?prior?.pdfUrl:null)??null,url:fallback?(prior?.url||def.url):def.url,checkedAt,fetchedAt:points?.length&&!fallback?checkedAt:prior?.fetchedAt||null,
  historySources:prior?.historySources||[],historyNote:prior?.historyNote||null,datasetUpdated:extra.datasetUpdated||prior?.datasetUpdated||null,
  status:!latest?'unavailable':fallback?'fallback':tooOld?'old_observation':'ok',error,
  observationOld:Boolean(tooOld),note:def.frequency==='annual'?'Data tahunan struktural; bukan kondisi hari ini.':def.frequency==='decision'?'Tanggal keputusan terakhir yang terbaca; bukan jaminan belum ada keputusan lain.':'Tanggal mengacu pada observasi sumber, bukan waktu halaman dibuka.'};
}
export async function collect(prior={}, {fetcher=fetch,now=new Date(),extended=false,sourceIds=null}={}){
 const checkedAt=now.toISOString();let metrics=[],checks=[],headlines=[];let news=prior.news||[],publications=prior.publications||[];let deposits=prior.deposits||[],lps=prior.lps||null,fiscal=prior.fiscal||null,target=prior.inflationTarget||null;
 const run=async(id,fn)=>{if(sourceIds&&!sourceIds.includes(id))return;if(PAUSED_SOURCES.has(id)){checks.push({id,status:'blocked',checkedAt:checkedAt,error:PAUSED_SOURCES.get(id)});return;}try{await fn();checks.push({id,status:'ok',checkedAt,error:null});}catch(e){checks.push({id,status:'error',checkedAt,error:errorText(e)});}};
 const jobs=Object.values(BI).map(def=>run(def.id,async()=>{let points;let used=def;try{points=parseBI(await download(def.url,fetcher),def,now);}catch(e){if(def.id==='inflation'){try{const rows=parseBPSHome(await download(BPS_URL,fetcher)),p=rows.find(x=>x.id==='bpsInflation');if(!p||new Date(p.period+'-01')>now)throw Error('Inflasi BPS belum terbaca');points=[{period:p.period,value:p.value}];used={...def,url:BPS_URL,source:'BPS · inflasi nasional yoy'};}catch{metrics.push(mergeMetric(def,null,prior.metrics?.find(m=>m.id===def.id),now,errorText(e)));throw e;}}else{metrics.push(mergeMetric(def,null,prior.metrics?.find(m=>m.id===def.id),now,errorText(e)));throw e;}}metrics.push(mergeMetric(used,points,prior.metrics?.find(m=>m.id===def.id),now));}));
 jobs.push(run('worldbank',async()=>{
  const codes=WB.map(d=>d.code).join(';');const url=`https://api.worldbank.org/v2/country/IDN/indicator/${codes}?source=2&format=json&per_page=1000&date=${now.getUTCFullYear()-15}:${now.getUTCFullYear()}`;
  try{const data=parseWorldBank(JSON.parse(await download(url,fetcher)),WB,now);for(const d of data)metrics.push(mergeMetric(d,d.history,prior.metrics?.find(m=>m.id===d.id),now,d.history.length?null:'Seri tidak memiliki observasi valid',{datasetUpdated:d.datasetUpdated}));}
  catch(e){for(const d of WB)metrics.push(mergeMetric(d,null,prior.metrics?.find(m=>m.id===d.id),now,errorText(e)));throw e;}
 }));
 jobs.push(run('news',async()=>{
  news=parseNews(await download(NEWS_URL,fetcher));
  news=await Promise.all(news.map(async n=>{try{const html=await download(n.url,fetcher);return {...n,publishedAt:articleDate(html)};}catch{return n;}}));
  const pmi=news.find(n=>/Prompt Manufacturing Index/.test(n.title));
  const def=EXTRA.find(d=>d.id==='manufacturing');
  if(pmi){try{const html=await download(pmi.url,fetcher),point=parsePMI(html);metrics.push(mergeMetric({...def,url:pmi.url},[point],prior.metrics?.find(m=>m.id===def.id),now,null,{officialForecast:point.officialForecast,publishedAt:articleDate(html)}));}catch(e){metrics.push(mergeMetric(def,null,prior.metrics?.find(m=>m.id===def.id),now,errorText(e)));}}
  else metrics.push(mergeMetric(def,null,prior.metrics?.find(m=>m.id===def.id),now,'Artikel PMI-BI tidak ditemukan pada daftar terbaru'));
 }));
 jobs.push(run('apbn',async()=>{
  publications=parseAPBN(JSON.parse(await download(APBN_URL,fetcher)));
  try{const latest=publications[0];if(fiscal?.url===latest.url&&fiscal.details?.length&&now-new Date(fiscal.fetchedAt)<86400000){fiscal={...fiscal,status:'ok',checkedAt};checks.push({id:'apbn-pdf',status:'ok',checkedAt,note:'Dokumen yang sama: menggunakan ekstraksi tersimpan; fetchedAt tidak diubah'});return;}const pages=await pdfPages(latest.url,fetcher),data=parseAPBNPages(pages);data.details=fiscalDetails(pages,data.period);data.comparisons=fiscalComparisons(pages);if(new Date(data.period+'-01')>now)throw Error('Periode APBN di masa depan');fiscal={...data,url:latest.url,edition:latest.edition,fetchedAt:checkedAt,status:'ok'};checks.push({id:'apbn-pdf',status:'ok',checkedAt,error:null});}catch(e){checks.push({id:'apbn-pdf',status:'error',checkedAt,error:errorText(e)});fiscal=fiscal?{...fiscal,status:'fallback',error:errorText(e)}:{status:'unavailable',error:errorText(e)};}
 }));
 jobs.push(run('bi-extra',async()=>{const defs=EXTRA.filter(d=>['fxreserves','indonia','srbiflow'].includes(d.id));try{const html=await download(BI_HEADLINES_URL,fetcher),parsed=parseIndicators(html);headlines=parseBIHeadlines(html,now);target=parsed.target;for(const def of defs){const point=parsed.points.find(p=>p.id===def.id);if(point&&new Date(point.period.length===7?point.period+'-01':point.period)>now)throw Error('Periode indikator di masa depan');metrics.push(mergeMetric(def,point?[point]:null,prior.metrics?.find(m=>m.id===def.id),now,point?null:'Nilai tidak ditemukan',{rangeStart:point?.rangeStart||null}));}}catch(e){for(const d of defs)if(!metrics.some(m=>m.id===d.id))metrics.push(mergeMetric(d,null,prior.metrics?.find(m=>m.id===d.id),now,errorText(e)));throw e;}}));
 jobs.push(run('consumer-survey',async()=>{const def=EXTRA.find(d=>d.id==='confidence');try{const index=await download(def.url,fetcher),report=discoverReport(index),html=await download(report.url,fetcher),url=reportPDF(html);const point=parseConsumerPDF(await pdfPages(url,fetcher),report.period);if(new Date(point.period+'-01')>now)throw Error('Survei berada di masa depan');metrics.push(mergeMetric({...def,url:report.url},[point],prior.metrics?.find(m=>m.id===def.id),now,null,{publishedAt:articleDate(html),pdfUrl:url}));}catch(e){metrics.push(mergeMetric(def,null,prior.metrics?.find(m=>m.id===def.id),now,errorText(e)));throw e;}}));
 for(const bank of BANKS)jobs.push(run('deposit-'+bank.id,async()=>{try{const data=parseBank(await download(bank.url,fetcher),bank);deposits=deposits.filter(d=>d.id!==bank.id).concat({...data,fetchedAt:checkedAt,status:'ok'});}catch(e){deposits=deposits.map(d=>d.id===bank.id?{...d,status:'fallback',error:errorText(e)}:d);throw e;}}));
 jobs.push(run('lps-disclosure',async()=>{try{lps={...parseLPSDisclosure(await download('https://www.bankmandiri.co.id/en/tingkat-bunga-penjamin',fetcher)),fetchedAt:checkedAt,status:'ok'};}catch(e){lps=lps?{...lps,status:'fallback',error:errorText(e)}:null;throw e;}}));
 await Promise.allSettled(jobs);
 for(const point of headlines){if(metrics.find(x=>x.id===point.id)?.status==='ok')continue;const def={...BI[point.id],url:BI_HEADLINES_URL,source:'Bank Indonesia · halaman indikator resmi'},old=prior.metrics?.find(x=>x.id===point.id),merged=mergeMetric(def,[point],old,now);metrics=metrics.filter(x=>x.id!==point.id).concat(merged);checks.push({id:point.id+'-alternative',status:merged.status==='ok'?'ok':'error',checkedAt,note:'Sumber alternatif resmi; definisi indikator dan periode yang sama. Histori valid sebelumnya dipertahankan.'});}

 await run('inflation-history',async()=>{const current=metrics.find(x=>x.id==='inflation')||prior.metrics?.find(x=>x.id==='inflation');const meta=current?.historySources?.find(x=>x.source?.startsWith('World Bank'));if(meta&&now-new Date(meta.fetchedAt)<14*864e5){if(!metrics.some(x=>x.id==='inflation'))metrics.push(current);return;}const archive=await fetchInflationHistory(fetcher,now),next=appendInflationHistory(current,archive);metrics=metrics.filter(x=>x.id!=='inflation').concat(next);});

 if((!sourceIds||sourceIds.includes('apbn'))&&checks.find(x=>x.id==='apbn-pdf')?.status!=='ok')await run('apbn-web',async()=>{const doc=discoverFiscalWeb(await download(FISCAL_WEB_INDEX,fetcher)),parsed=parseFiscalWeb(await download(doc.url,fetcher),doc.url,now);if(fiscal?.period>parsed.period)throw Error('Alternatif HTML memiliki periode lebih lama');fiscal=parsed;});
 const extras=extended?await collectExtended(prior,{download:url=>download(url,fetcher),pdfPages:url=>pdfPages(url,fetcher),requestJSON:async(url,body)=>{const r=await fetcher(url,{method:'POST',headers:{'Accept':'application/json','Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(12000)});if(!r.ok)throw Error('Indeks dokumen HTTP '+r.status);return r.json();},now,sourceIds}):{bondMarket:prior.bondMarket||null,bankHealth:prior.bankHealth||[],social:prior.social||[],agencyNews:prior.agencyNews||[],checks:prior.extendedChecks||[]};
 if((!sourceIds||sourceIds.includes('apbn'))&&checks.find(c=>c.id==='apbn')?.status!=='ok'&&checks.find(c=>c.id==='apbn-web')?.status!=='ok'&&fiscal?.period)fiscal={...fiscal,status:'fallback'};
 if(sourceIds){for(const old of prior.metrics||[])if(!metrics.some(x=>x.id===old.id))metrics.push(old);checks=[...checks,...(prior.checks||[]).filter(x=>!checks.some(c=>c.id===x.id))];}
 if(!metrics.some(m=>m.id==='manufacturing')){const d=EXTRA.find(d=>d.id==='manufacturing');metrics.push(mergeMetric(d,null,prior.metrics?.find(m=>m.id===d.id),now,'Daftar berita tidak tersedia'));}
 const order=[...Object.keys(BI),...EXTRA.map(x=>x.id),...WB.map(x=>x.id)];metrics.sort((a,b)=>order.indexOf(a.id)-order.indexOf(b.id));checks.sort((a,b)=>a.id.localeCompare(b.id));
 const digest=contentFingerprint({drivers:extras.drivers??prior.drivers,structural:extras.structural??prior.structural,bondQuotes:extras.bondQuotes??prior.bondQuotes,metrics,news,publications,fiscal,deposits,lps,bondMarket:extras.bondMarket,bankHealth:extras.bankHealth,social:extras.social,agencyNews:extras.agencyNews});
 const changed=prior.snapshotId!==digest;
 return {drivers:extras.drivers??prior.drivers??[],changeLog:changeLog(prior,{metrics,social:extras.social,structural:extras.structural??prior.structural,fiscal},checkedAt),fiscalHistory:fiscalHistory(prior,fiscal),structural:extras.structural??prior.structural??[],bondQuotes:extras.bondQuotes??prior.bondQuotes,bondMarket:extras.bondMarket,bankHealth:extras.bankHealth,social:extras.social,agencyNews:extras.agencyNews,extendedChecks:extras.checks,schemaVersion:1,snapshotId:digest,dataChangedAt:changed?checkedAt:prior.dataChangedAt||checkedAt,checkedAt,metrics,news,publications,checks,deposits:deposits.sort((a,b)=>a.id.localeCompare(b.id)),lps,fiscal,inflationTarget:target,forecast:inflationForecast(metrics.find(m=>m.id==='inflation'),now),gaps:GAPS.filter(g=>!['Realisasi APBN terstruktur','Deposito bank & TBP LPS'].includes(g.name)),
  newsFetchedAt:checks.find(c=>c.id==='news')?.status==='ok'?checkedAt:prior.newsFetchedAt||null,
  publicationsFetchedAt:checks.find(c=>c.id==='apbn')?.status==='ok'?checkedAt:prior.publicationsFetchedAt||null,
  coverage:'BI, APBN Kita, sepuluh bank pembanding, laporan kondisi bank, kurva yield ADB, statistik BPS awal, penggerak ekonomi/distribusi historis dan seri struktural World Bank. Cakupan dan keberhasilan koneksi berbeda; lihat checks dan extendedChecks. Bukan terminal pasar real-time.'};
}
