import {text,dateID} from './parsers.mjs';
const n=s=>Number(s.replace(',','.'));
export function parseBPSRelease(record,now=new Date()){
 const title=text(record.title),s=text(record.abstract),points=[];let m;
 const add=(id,value,month,year)=>{const period=dateID(month+' '+year);if(!period||new Date(period+'-01')>now||!Number.isFinite(value))return;points.push({id,value,period,source:'BPS · Berita Resmi Statistik',url:'https://www.bps.go.id/id/pressrelease',publishedAt:record.rl_date||null,title});};
 m=s.match(/Tingkat Pengangguran Terbuka\s*\(TPT\)\s+pada\s+(\w+)\s+(20\d{2})\s+sebesar\s+([\d.,]+)\s+persen/i);if(m)add('bpsJobs',n(m[3]),m[1],m[2]);
 m=s.match(/Rata-rata upah buruh pada\s+(\w+)\s+(20\d{2})\s+sebesar\s+([\d.,]+)\s+juta/i);if(m)add('bpsWage',n(m[3]),m[1],m[2]);
 m=s.match(/Persentase penduduk miskin pada\s+(\w+)\s+(20\d{2})\s+sebesar\s+([\d.,]+)\s+persen/i);if(m)add('bpsPoverty',n(m[3]),m[1],m[2]);
 m=title.match(/Ekonomi Indonesia Triwulan\s+(IV|III|II|I)[–-](20\d{2})\s+Tumbuh\s+([\d.,]+)\s+Persen\s*\(Y-on-Y\)/i);if(m){const quarter={I:1,II:2,III:3,IV:4}[m[1].toUpperCase()],period=`${m[2]}-${String(quarter*3).padStart(2,'0')}`;if(new Date(period+'-01')<=now)points.push({id:'bpsGrowth',value:n(m[3]),period,source:'BPS · PDB triwulanan yoy',url:'https://www.bps.go.id/id/pressrelease',publishedAt:record.rl_date||null,title});}
 // Only an explicitly reported percentage-point change with the same observation month/year
 // may supply a comparator; changes against the other semester are not year-on-year.
 for(const row of points.filter(x=>['bpsJobs','bpsPoverty'].includes(x.id))){
  const lead=row.id==='bpsJobs'?/Tingkat Pengangguran Terbuka\s*\(TPT\)\s+pada/i:/Persentase penduduk miskin pada/i;
  const start=s.search(lead),sentence=start>=0?s.slice(start).split(/\.(?:\s|$)/)[0]:'';
  for(const m of sentence.matchAll(/(turun|menurun|naik|meningkat)\s+([\d,]+)\s+(?:persen\s+poin|poin\s+persentase)\s+(?:terhadap|dibanding(?:kan)?)\s+(\w+)\s+(20\d{2})/gi)){
   const period=dateID(m[3]+' '+m[4]),target=`${Number(row.period.slice(0,4))-1}${row.period.slice(4)}`;
   if(period!==target)continue;const delta=n(m[2])*(/turun|menurun/i.test(m[1])?-1:1),value=Math.round((row.value-delta)*100)/100;
   if(value<0||value>100)continue;row.history=[{period,value},{period:row.period,value:row.value}];row.comparisonMethod='derived-from-reported-percentage-point-change';row.comparisonUrl=row.url;
  }
 }
 if(!points.length)throw Error('Format rilis BPS belum dapat divalidasi');return points;
}
export async function fetchBPSSocial({key,fetcher=fetch,now=new Date()}){if(!key)throw Error('BPS_API_KEY belum diatur; angka awal tidak dianggap pembaruan otomatis');
 const get=async path=>{try{const r=await fetcher('https://webapi.bps.go.id'+path,{signal:AbortSignal.timeout(12000)});if(!r.ok)throw Error();const data=await r.json();if(data.status!=='OK')throw Error();return data;}catch{throw Error('Permintaan Web API BPS gagal; periksa koneksi dan konfigurasi kunci tanpa menampilkannya');}};
 const result=[];for(const keyword of ['pengangguran','kemiskinan','ekonomi Indonesia']){let rows=[];for(const year of [now.getUTCFullYear(),now.getUTCFullYear()-1]){const list=await get(`/v1/api/list/model/pressrelease/domain/0000/key/${encodeURIComponent(key)}?lang=ind&year=${year}&keyword=${encodeURIComponent(keyword)}`);rows=(list.data?.[1]||[]).filter(r=>r.rl_date&&new Date(r.rl_date)<=now).sort((a,b)=>b.rl_date.localeCompare(a.rl_date));if(rows.length)break;}let accepted=false;for(const row of rows.slice(0,3)){try{const id=row.brs_id;const detail=await get(`/v1/api/view/domain/0000/model/pressrelease/lang/ind/id/${encodeURIComponent(id)}/key/${encodeURIComponent(key)}`);const current=parseBPSRelease(detail.data,now);const prior=[];
 // Match the observation year, not simply the preceding release, for real-income comparisons.
 if(keyword==='pengangguran'){try{const year=Number(current[0].period.slice(0,4))-1;const list=await get(`/v1/api/list/model/pressrelease/domain/0000/key/${encodeURIComponent(key)}?lang=ind&year=${year}&keyword=${encodeURIComponent(keyword)}`);for(const previous of (list.data?.[1]||[]).filter(x=>x.rl_date&&new Date(x.rl_date)<=now).sort((a,b)=>b.rl_date.localeCompare(a.rl_date)).slice(0,3)){try{const d=await get(`/v1/api/view/domain/0000/model/pressrelease/lang/ind/id/${encodeURIComponent(previous.brs_id)}/key/${encodeURIComponent(key)}`);prior.push(...parseBPSRelease(d.data,now));}catch{}}}catch{}}
 result.push(...current.map(p=>({...p,history:prior.filter(x=>x.id===p.id).map(x=>({period:x.period,value:x.value})).concat({period:p.period,value:p.value})})));accepted=true;break;}catch{}}if(!accepted)throw Error('Rilis BPS terbaru belum berhasil dipetakan: '+keyword);}
 return result;
}
