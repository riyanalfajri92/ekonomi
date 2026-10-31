import {createHash} from 'node:crypto';
import {BI,WB,GAPS} from './catalog.mjs';
import {parseBI,parseWorldBank,parseNews,parseAPBN} from './parsers.mjs';
export const NEWS_URL='https://www.bi.go.id/id/publikasi/ruang-media/news-release/default.aspx';
export const APBN_URL='https://api-djppr.kemenkeu.go.id/web/api/v1/page?url=paparanapbnkita';
export async function download(url,fetcher=fetch){
 const response=await fetcher(url,{signal:AbortSignal.timeout(12000),headers:{'Accept':'text/html,application/json;q=0.9,*/*;q=0.1','User-Agent':'NadiEconomicDashboard/1.0 (public economic data; cached requests)'}});
 if(!response.ok)throw Error('Sumber merespons HTTP '+response.status);
 const reader=response.body?.getReader();if(!reader)return await response.text();
 const decoder=new TextDecoder();let total=0,result='';
 try{while(true){const {done,value}=await reader.read();if(done)break;total+=value.length;if(total>4*1024*1024)throw Error('Respons sumber terlalu besar');result+=decoder.decode(value,{stream:true});}return result+decoder.decode();}finally{await reader.cancel().catch(()=>{});}
}
function errorText(e){return String(e?.message||'Koneksi sumber gagal').slice(0,150);}
export function mergeMetric(def,points,prior,now,error=null,extra={}){
 const checkedAt=now.toISOString();let history=points||[];let fallback=false;
 if(!history.length){history=prior?.history||[];fallback=history.length>0;}
 if(history.length&&prior?.history?.length&&history[0].period<prior.history[0].period){history=prior.history;fallback=true;error='Sumber mengembalikan periode lebih lama; mempertahankan observasi sebelumnya';}
 const latest=history[0]||null;const periodDate=latest?new Date(latest.period.length===4?latest.period+'-12-31':latest.period.length===7?latest.period+'-01':latest.period):null;
 const tooOld=periodDate&&(now-periodDate)/86400000>def.maxAgeDays;
 const previous=history[1];
 const delta=latest&&previous?latest.value-previous.value:null;
 return {...def,...extra,header:undefined,min:undefined,max:undefined,history,period:latest?.period||null,value:latest?.value??null,
  delta,previousPeriod:previous?.period||null,deltaUnit:def.unit.includes('%')?'poin persentase':'nilai',
  publishedAt:null,checkedAt,fetchedAt:points?.length&&!fallback?checkedAt:prior?.fetchedAt||null,
  datasetUpdated:extra.datasetUpdated||prior?.datasetUpdated||null,
  status:!latest?'unavailable':fallback?'fallback':tooOld?'old_observation':'ok',error,
  observationOld:Boolean(tooOld),note:def.frequency==='annual'?'Data tahunan struktural; bukan kondisi hari ini.':def.frequency==='decision'?'Tanggal keputusan terakhir yang terbaca; bukan jaminan belum ada keputusan lain.':'Tanggal mengacu pada observasi sumber, bukan waktu halaman dibuka.'};
}
export async function collect(prior={}, {fetcher=fetch,now=new Date()}={}){
 const checkedAt=now.toISOString();let metrics=[],checks=[];let news=prior.news||[],publications=prior.publications||[];
 const run=async(id,fn)=>{try{await fn();checks.push({id,status:'ok',checkedAt,error:null});}catch(e){checks.push({id,status:'error',checkedAt,error:errorText(e)});}};
 const jobs=Object.values(BI).map(def=>run(def.id,async()=>{let points;try{points=parseBI(await download(def.url,fetcher),def,now);}catch(e){metrics.push(mergeMetric(def,null,prior.metrics?.find(m=>m.id===def.id),now,errorText(e)));throw e;}metrics.push(mergeMetric(def,points,prior.metrics?.find(m=>m.id===def.id),now));}));
 jobs.push(run('worldbank',async()=>{
  const codes=WB.map(d=>d.code).join(';');const url=`https://api.worldbank.org/v2/country/IDN/indicator/${codes}?source=2&format=json&per_page=1000&date=${now.getUTCFullYear()-15}:${now.getUTCFullYear()}`;
  try{const data=parseWorldBank(JSON.parse(await download(url,fetcher)),WB,now);for(const d of data)metrics.push(mergeMetric(d,d.history,prior.metrics?.find(m=>m.id===d.id),now,d.history.length?null:'Seri tidak memiliki observasi valid',{datasetUpdated:d.datasetUpdated}));}
  catch(e){for(const d of WB)metrics.push(mergeMetric(d,null,prior.metrics?.find(m=>m.id===d.id),now,errorText(e)));throw e;}
 }));
 jobs.push(run('news',async()=>{news=parseNews(await download(NEWS_URL,fetcher));}));
 jobs.push(run('apbn',async()=>{publications=parseAPBN(JSON.parse(await download(APBN_URL,fetcher)));}));
 await Promise.allSettled(jobs);
 const order=[...Object.keys(BI),...WB.map(x=>x.id)];metrics.sort((a,b)=>order.indexOf(a.id)-order.indexOf(b.id));checks.sort((a,b)=>a.id.localeCompare(b.id));
 const digest=createHash('sha256').update(JSON.stringify({metrics:metrics.map(m=>[m.id,m.value,m.period,m.history]),news:news.map(n=>n.url),publications:publications.map(n=>n.url)})).digest('hex').slice(0,16);
 const changed=prior.snapshotId!==digest;
 return {schemaVersion:1,snapshotId:digest,dataChangedAt:changed?checkedAt:prior.dataChangedAt||checkedAt,checkedAt,metrics,news,publications,checks,gaps:GAPS,
  newsFetchedAt:checks.find(c=>c.id==='news')?.status==='ok'?checkedAt:prior.newsFetchedAt||null,
  publicationsFetchedAt:checks.find(c=>c.id==='apbn')?.status==='ok'?checkedAt:prior.publicationsFetchedAt||null,
  coverage:'BI harian/bulanan/keputusan + indikator tahunan World Bank + tautan publikasi resmi. Bukan seluruh kondisi ekonomi atau terminal pasar real-time.'};
}
