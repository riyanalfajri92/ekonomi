import {text,dateID,numberID} from './parsers.mjs';
export const FISCAL_WEB_INDEX='https://www.kemenkeu.go.id/informasi-publik/realisasi-apbn/';
export function discoverFiscalWeb(html){
 const rows=[];for(const m of html.matchAll(/href=["']([^"']+)["']/gi)){let u;try{u=new URL(m[1].replace(/&amp;/g,'&'),FISCAL_WEB_INDEX);}catch{continue;}if(u.protocol!=='https:'||!['www.kemenkeu.go.id','kemenkeu.go.id'].includes(u.hostname))continue;const match=u.pathname.match(/^\/APBNKita([A-Za-z]+)(20\d{2})\/?$/i),edition=match?dateID(match[1]+' '+match[2]):null;if(edition&&!rows.some(x=>x.url===u.href))rows.push({url:u.href,edition});}if(!rows.length)throw Error('Tautan edisi APBN pada indeks resmi belum terbaca');return rows.sort((a,b)=>b.edition.localeCompare(a.edition))[0];
}
export function parseFiscalWeb(html,url,now=new Date()){
 const s=text(html),match=s.match(/Realisasi\s*#?APBNKiTa\s*\(s\.d\.\s*(\d{1,2}\s+[A-Za-z]+\s+20\d{2})\)/i),full=match?dateID(match[1]):null;if(!full||new Date(full)>now)throw Error('Periode realisasi HTML tidak valid');const period=full.slice(0,7);
 const field=label=>{const m=s.match(new RegExp(label+'\\s+Rp\\s*([\\d.,]+)\\s*T','i'));if(!m)throw Error('Label fiskal HTML tidak ditemukan');return numberID(m[1]);};
 const revenue=field('Pendapatan Negara'),spending=field('Belanja Negara'),primary=field('Surplus Keseimbangan Primer'),balance=revenue-spending;
 const deficit=s.match(/Defisit APBN\s+([\d.,]+)\s*%/i);if(!deficit||balance>=0||![revenue,spending,primary].every(Number.isFinite))throw Error('Ringkasan fiskal HTML tidak konsisten');
 const specs=[['social','Realisasi Bantuan Sosial','Social assistance','components'],['subsidy','Realisasi Subsidi dan Kompensasi','Subsidies and compensation','components'],['transfers','Transfer ke Daerah','Transfers to regions','aggregate'],['education','Realisasi Anggaran Pendidikan','Education thematic spending','thematic'],['health','Realisasi Anggaran Kesehatan','Health thematic spending','thematic'],['infrastructure','Realisasi Anggaran Pembangunan infrastruktur','Infrastructure thematic spending','thematic'],['food','Realisasi Anggaran Ketahanan Pangan','Food-security thematic spending','thematic']];
 const details=specs.flatMap(([id,label,labelEn,group])=>{try{return [{id,label,labelEn,value:field(label),period,group,url,page:null,locator:label}];}catch{return [];}});
 return {period,revenue,spending,balance,primary,deficitGDP:-numberID(deficit[1]),source:'Kemenkeu · APBN Kita HTML',url,fetchedAt:now.toISOString(),checkedAt:now.toISOString(),status:'ok',details,comparisons:{},method:'structured-official-html',note:'Saldo dihitung dari pendapatan dikurangi belanja. Kelompok tematik beririsan. HTML tidak menggantikan tabel pembanding yang belum tersedia.'};
}
