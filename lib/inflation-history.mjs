import {inflateRawSync} from 'node:zlib';import {text} from './parsers.mjs';
export const INFLATION_ARCHIVE_URL='https://thedocs.worldbank.org/en/doc/1ad246272dbbc437c74323719506aa0c-0350012021/original/Inflation-data.xlsx';
// Bounded, read-only OOXML extraction. No formulas, macros, external relationships or paths are executed.
export function zipXML(bytes,name){
 const b=Buffer.from(bytes);if(b.length>20e6)throw Error('Workbook terlalu besar');let end=-1;
 for(let i=b.length-22;i>=Math.max(0,b.length-65558);i--)if(b.readUInt32LE(i)===0x06054b50){end=i;break;}
 if(end<0)throw Error('Workbook bukan ZIP biasa');let offset=b.readUInt32LE(end+16),count=b.readUInt16LE(end+10);if(count>500)throw Error('Terlalu banyak bagian workbook');
 for(let i=0;i<count;i++){if(offset+46>b.length||b.readUInt32LE(offset)!==0x02014b50)throw Error('Direktori workbook rusak');const method=b.readUInt16LE(offset+10),size=b.readUInt32LE(offset+20),expanded=b.readUInt32LE(offset+24),n=b.readUInt16LE(offset+28),extra=b.readUInt16LE(offset+30),comment=b.readUInt16LE(offset+32),local=b.readUInt32LE(offset+42),path=b.subarray(offset+46,offset+46+n).toString('utf8');offset+=46+n+extra+comment;if(path!==name)continue;
  if(expanded>12e6||local+30>b.length||b.readUInt32LE(local)!==0x04034b50)throw Error('Bagian workbook di luar batas');const start=local+30+b.readUInt16LE(local+26)+b.readUInt16LE(local+28);if(start+size>b.length)throw Error('Bagian workbook terpotong');const raw=b.subarray(start,start+size),out=method===0?raw:method===8?inflateRawSync(raw,{maxOutputLength:12e6}):null;if(!out||out.length!==expanded)throw Error('Kompresi workbook tidak didukung');return out.toString('utf8');
 }throw Error('Bagian workbook tidak ditemukan: '+name);
}
export function parseInflationWorkbook(bytes,now=new Date()){
 const strings=[...zipXML(bytes,'xl/sharedStrings.xml').matchAll(/<si\b[^>]*>([\s\S]*?)<\/si>/g)].map(x=>text(x[1]));
 const workbook=zipXML(bytes,'xl/workbook.xml'),sheet=workbook.match(/<sheet\b[^>]*name="hcpi_m"[^>]*r:id="([^"]+)"/);if(!sheet)throw Error('Sheet CPI bulanan tidak ditemukan');
 const rels=zipXML(bytes,'xl/_rels/workbook.xml.rels'),rel=[...rels.matchAll(/<Relationship\b[^>]*>/g)].find(x=>x[0].includes('Id="'+sheet[1]+'"'))?.[0],target=rel?.match(/Target="([^"]+)"/)?.[1];if(!target||!/^worksheets\/sheet\d+\.xml$/.test(target))throw Error('Referensi worksheet tidak valid');
 const rows=[...zipXML(bytes,'xl/'+target).matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g)].map(r=>Object.fromEntries([...r[1].matchAll(/<c\b([^>]*)>([\s\S]*?)<\/c>/g)].flatMap(c=>{const ref=c[1].match(/\br="([A-Z]+)\d+"/)?.[1],v=c[2].match(/<v[^>]*>([\s\S]*?)<\/v>/)?.[1];return ref&&v!==undefined?[[ref,/\bt="s"/.test(c[1])?strings[Number(v)]:v]]:[];})));
 const header=rows.find(r=>r.A==='Country Code'),row=rows.find(r=>r.A==='IDN'&&r.C==='Indonesia');if(!header||row?.D!=='Index'||row.E!=='Headline Consumer Price Index')throw Error('Negara/definisi CPI tidak sesuai');
 const indices=new Map(Object.entries(header).flatMap(([col,period])=>/^20\d{4}$/.test(period)&&row[col]!==undefined&&Number(row[col])>0?[[period.slice(0,4)+'-'+period.slice(4),Number(row[col])]]:[]));
 const history=[];for(const [period,index]of indices){const previous=indices.get(`${Number(period.slice(0,4))-1}${period.slice(4)}`);if(!previous||period<'2010-01'||new Date(period+'-01T00:00:00Z')>now)continue;const value=Math.round((index/previous-1)*10000)/100;if(value<=-99||value>100)throw Error('CPI turunan di luar batas');history.push({period,value,source:'World Bank inflation database · CPI index → yoy',url:INFLATION_ARCHIVE_URL});}
 if(history.length<60)throw Error('Histori inflasi terlalu pendek');return history.sort((a,b)=>b.period.localeCompare(a.period));
}
export async function fetchInflationHistory(fetcher=fetch,now=new Date()){
 const r=await fetcher(INFLATION_ARCHIVE_URL,{signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error('Arsip inflasi HTTP '+r.status);const bytes=new Uint8Array(await r.arrayBuffer());return {history:parseInflationWorkbook(bytes,now),url:INFLATION_ARCHIVE_URL,source:'World Bank · Ha, Kose & Ohnsorge (2023)',method:'100 × (CPI_t/CPI_t−12 − 1), rounded to 2 decimals',fetchedAt:now.toISOString()};
}
export function appendInflationHistory(metric,archive){
 if(!metric||!Number.isFinite(metric.value))throw Error('Inflasi terkini belum tersedia');const source=new Map(archive.history.map(x=>[x.period,x]));
 // Keep domestic published values at overlapping periods; flag material conflicts instead of splicing them.
 for(const x of metric.history||[]){const a=source.get(x.period);if(a&&Math.abs(a.value-x.value)>.05)throw Error('Histori CPI tidak cocok dengan seri domestik pada '+x.period);source.set(x.period,x);}
 const history=[...source.values()].filter(x=>x.period<=metric.period).sort((a,b)=>b.period.localeCompare(a.period)).slice(0,240);
 return {...metric,history,historySources:[{url:archive.url,source:archive.source,method:archive.method,fetchedAt:archive.fetchedAt,from:archive.history.at(-1).period,until:archive.history[0].period}],historyNote:'Older CPI-derived archive and domestic published yoy observations; gaps are not imputed. Current-value retrieval status/time is unchanged.'};
}
