export function text(html){return String(html).replace(/<!--[\s\S]*?-->/g,' ').replace(/<script\b[\s\S]*?<\/script>/gi,' ').replace(/<style\b[\s\S]*?<\/style>/gi,' ').replace(/<[^>]*>/g,' ').replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16))).replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n))).replace(/&nbsp;|\u00a0/gi,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/[\u200b-\u200d\ufeff]/g,'').replace(/\s+/g,' ').trim();}
export function numberID(s){const raw=text(s).replace(/Rp|%/g,'').replace(/\s/g,'');if(!/^-?\d+(?:\.\d{3})*(?:,\d+)?$/.test(raw)&&! /^-?\d+(?:,\d+)?$/.test(raw))return NaN;return Number(raw.replace(/\./g,'').replace(',','.'));}
const months=['januari','februari','maret','april','mei','juni','juli','agustus','september','oktober','november','desember'];
export function dateID(s){let m=text(s).toLowerCase().match(/^(?:(\d{1,2})\s+)?([a-z]+)\s+(\d{4})$/);if(!m)return null;let month=months.indexOf(m[2]);if(month<0)return null;let day=Number(m[1]||1),year=Number(m[3]);let date=new Date(Date.UTC(year,month,day));if(date.getUTCMonth()!==month||year<1990||year>2200)return null;return `${year}-${String(month+1).padStart(2,'0')}${m[1]?'-'+String(day).padStart(2,'0'):''}`;}
export function parseBI(html,def,now=new Date()){
 const tables=[...html.matchAll(/<table\b[^>]*>([\s\S]*?)<\/table>/gi)].map(m=>m[1]);
 const table=tables.find(t=>{const h=[...t.matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>/gi)].map(x=>text(x[1])).join(' ');return h.includes(def.header);});
 if(!table)throw Error('Tabel sumber berubah / header tidak ditemukan');
 const points=[];
 for(const row of table.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)){
  const cells=[...row[1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map(x=>text(x[1]));
  const index=cells.findIndex(c=>dateID(c));if(index<0)continue;
  const period=dateID(cells[index]), value=numberID(cells[index+1]||'');
  if(!Number.isFinite(value)||value<def.min||value>def.max)throw Error('Nilai sumber di luar batas validasi');
  if(new Date(period.length===7?period+'-01':period)>now)throw Error('Periode sumber berada di masa depan');
  points.push({period,value});
 }
 const unique=[...new Map(points.map(p=>[p.period,p])).values()].sort((a,b)=>b.period.localeCompare(a.period));
 if(!unique.length)throw Error('Tidak ditemukan observasi valid');
 return unique;
}
export function parseWorldBank(payload,definitions,now=new Date()){
 if(!Array.isArray(payload)||!Array.isArray(payload[1]))throw Error('Respons World Bank tidak valid');
 if(Number(payload[0]?.pages)>1)throw Error('Respons terpotong; perlu pagination');
 const updated=payload[0]?.lastupdated;
 return definitions.map(def=>{
  let points=payload[1].filter(r=>r.countryiso3code==='IDN'&&r.indicator?.id===def.code&&r.value!==null).map(r=>({period:String(r.date),value:r.value}));
  points=points.filter(r=>/^\d{4}$/.test(r.period)&&Number(r.period)<=now.getUTCFullYear());
  if(points.some(r=>typeof r.value!=='number'||!Number.isFinite(r.value)||r.value<def.min||r.value>def.max))throw Error('Nilai World Bank di luar batas validasi');
  points.sort((a,b)=>b.period.localeCompare(a.period));
  return {...def,history:points.slice(0,12),datasetUpdated:/^\d{4}-\d{2}-\d{2}$/.test(updated||'')?updated:null};
 });
}
export function parseNews(html,base='https://www.bi.go.id'){
 const out=new Map();
 for(const m of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)){
  const title=text(m[2]);let url;try{url=new URL(m[1],base)}catch{continue}
  if(url.hostname!=='www.bi.go.id'||!/^\/id\/publikasi\/ruang-media\/news-release\/Pages\/[^/]+\.aspx$/i.test(url.pathname)||title.length<25||title.length>400)continue;
  if(!out.has(url.href))out.set(url.href,{title,url:url.href,publishedAt:null,source:'Bank Indonesia',note:'Judul dari daftar siaran pers resmi; tanggal publikasi belum diekstrak. Urutan mengikuti halaman sumber.'});
 }
 if(!out.size)throw Error('Tautan siaran pers tidak ditemukan');return [...out.values()].slice(0,8);
}
export function safeOfficialURL(value,base,allowed){try{const u=new URL(value,base);return u.protocol==='https:'&&allowed.some(h=>u.hostname===h||u.hostname.endsWith('.'+h))?u.href:null}catch{return null}}
export function parseAPBN(payload){
 const raw=payload?.Data?.PageContentLive;if(typeof raw!=='string')throw Error('Struktur publikasi DJPPR berubah');
 const tree=JSON.parse(raw),items=[];
 function walk(o){if(!o||typeof o!=='object')return;if(Array.isArray(o)){o.forEach(walk);return;}
  if(Array.isArray(o.modules)){
   const labels=o.modules.filter(m=>m.widgetType==='text').map(m=>text(m.text||''));
   const label=labels.find(t=>dateID(t));
   if(label)for(const m of o.modules){const link=safeOfficialURL(m.propertyJSON?.linkUrl,'https://djppr.kemenkeu.go.id',['kemenkeu.go.id']);if(m.widgetType==='button'&&link)items.push({title:'APBN Kita · '+label,edition:dateID(label),url:link,source:'DJPPR Kementerian Keuangan',publishedAt:null,note:'Periode edisi, bukan periode realisasi. Angka PDF belum diekstrak otomatis.'});}
  }
  Object.values(o).forEach(walk);
 }
 walk(tree);const out=[...new Map(items.map(i=>[i.url,i])).values()].sort((a,b)=>b.edition.localeCompare(a.edition));
 if(!out.length)throw Error('Edisi dan tautan APBN tidak dapat dipasangkan secara pasti');return out.slice(0,6);
}
