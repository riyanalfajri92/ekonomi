import {MORE_BANKS,parseMoreBank} from './bank-rates.mjs';
import {text,numberID,dateID,safeOfficialURL} from './parsers.mjs';
export const BANKS=[...MORE_BANKS,
 {id:'bca',name:'BCA',url:'https://www.bca.co.id/individu/produk/simpanan/deposito-berjangka',tenors:[1,3,6,12],minimum:8000000,tier:[0,10000000,100000000,500000000,2000000000,5000000000,10000000000,25000000000,100000000000],product:'Deposito Rupiah reguler',productEn:'Regular IDR term deposit'},
 {id:'mandiri',name:'Bank Mandiri',url:'https://www.bankmandiri.co.id/web/guest/suku-bunga-dana',tenors:[1,3,6,12,24],minimum:null,tier:[0,100000000,1000000000,2000000000,5000000000],product:'Deposito Rupiah · bunga bulanan/jatuh tempo',productEn:'IDR deposit · monthly/at-maturity interest'}
];
export function parseBank(html,bank){if(MORE_BANKS.some(b=>b.id===bank.id))return parseMoreBank(html,bank);
 const tables=[...html.matchAll(/<table\b[^>]*>[\s\S]*?<\/table>/gi)].map(m=>({html:m[0],offset:m.index}));
 const target=tables.find(t=>{const label=text(t.html);return bank.id==='bca'?label.includes('Nominal Penempatan')&&label.includes('12')&&!label.includes('Khusus')&&!label.includes('USD'):label.startsWith('Tier Suku Bunga')&&label.includes('Rp 100 Juta');});
 if(!target)throw Error('Tabel deposito reguler Rupiah tidak ditemukan');
 const rows=[];
 for(const m of target.html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)){
  const cells=[...m[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(c=>text(c[1]).replace(/&lt;/g,'<').replace(/&gt;/g,'>'));
  if(cells.length!==bank.tenors.length+1||!/[Rr]p/.test(cells[0]))continue;
  const values=cells.slice(1).map(s=>{const cleaned=s.replace(/%/g,'').trim();return /^\d+(?:[.,]\d+)?$/.test(cleaned)?Number(cleaned.replace(',','.')):NaN});
  if(values.some(x=>!Number.isFinite(x)||x<0||x>30))throw Error('Nilai bunga di luar validasi');
  rows.push({label:cells[0],values});
 }
 if(rows.length!==bank.tier.length)throw Error('Jumlah tier bank berubah; perlu meninjau pemetaan nominal');
 // Fail closed if the numeric tier boundaries change, even when row count stays the same.
 for(let i=0;i<rows.length;i++){
  const upper=bank.tier[i+1];const label=rows[i].label.toLowerCase();
  const tokens=[...label.matchAll(/(\d+(?:[.,]\d+)?)\s*(jt|juta|miliar|m)\b/g)].map(m=>Number(m[1].replace(',','.'))*(m[2]==='jt'||m[2]==='juta'?1e6:1e9));
  if(bank.tier[i]!==0&&!tokens.includes(bank.tier[i]))throw Error('Batas bawah tier berubah');
  if(upper&&!tokens.includes(upper))throw Error('Batas atas tier berubah');
 }
 const tail=text(html.slice(target.offset+target.html.length,target.offset+target.html.length+1500));
 let effective=null,sourceUpdated=null;
 if(bank.id==='bca'){let m=tail.match(/Berlaku efektif\s*:\s*(\d{1,2}\s+[A-Za-z]+\s+\d{4})/i);effective=m?dateID(m[1]):null;}
 else {const m=text(html).match(/Terakhir diperbarui\s+(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/i);const names={jan:'Januari',feb:'Februari',mar:'Maret',apr:'April',mei:'Mei',may:'Mei',jun:'Juni',jul:'Juli',agu:'Agustus',aug:'Agustus',sep:'September',okt:'Oktober',oct:'Oktober',nov:'November',des:'Desember',dec:'Desember'};if(m)sourceUpdated=dateID(`${m[1]} ${names[m[2].toLowerCase()]||m[2]} ${m[3]}`);}
 return {...bank,effectiveAt:effective,sourceUpdated,tiers:rows.map((r,i)=>({label:r.label,min:bank.tier[i],max:bank.tier[i+1]??null,rates:Object.fromEntries(bank.tenors.map((t,k)=>[t,r.values[k]]))})),conditions:'Tarif reguler Rupiah. Promo, negosiasi, kanal khusus, penalti dan biaya tidak tercakup. Verifikasi syarat pembukaan langsung ke bank.',conditionsEn:'Regular IDR rates only. Promotions, negotiated rates, special channels, penalties and fees are excluded. Confirm opening requirements with the bank.'};
}
export function parseLPSDisclosure(html){const t=text(html);const m=t.match(/Lembaga Penjamin Simpanan\s*\(LPS\)\s*(\d{1,2}\s+\w+\s+\d{4})\s*s\.d\.\s*(\d{1,2}\s+\w+\s+\d{4})\.?\s*Bank Umum\s*Rupiah\s*([\d,]+)%\s*Valas\s*([\d,]+)%/i);if(!m)throw Error('Pengungkapan TBP pada halaman bank berubah');const from=dateID(m[1]),until=dateID(m[2]);if(!from||!until)throw Error('Tanggal TBP tidak terbaca');return {rate:Number(m[3].replace(',','.')),fxRate:Number(m[4].replace(',','.')),from,until,bankType:'Bank umum konvensional',currency:'IDR',source:'Pengungkapan Bank Mandiri tentang TBP LPS',sourceEn:'Bank Mandiri disclosure of LPS coverage rates',url:'https://www.bankmandiri.co.id/en/tingkat-bunga-penjamin',scope:'Bukan verifikasi seluruh syarat penjaminan.'};}
export function parseAPBNPages(pages){
 for(const p of pages){let t=text(p.text);if(!/KINERJA APBN PER/i.test(t))continue;
  const period=t.match(/KINERJA APBN PER\s+(\w+)\s+(\d{4})/i);const rev=t.match(/PENDAPATAN NEGARA\s+Rp\s*([\d.,]+)\s*T/i),spend=t.match(/BELANJA NEGARA\s+Rp\s*([\d.,]+)\s*T/i),def=t.match(/DEFISIT APBN\s+Rp\s*([\d.,]+)\s*T\s*\(\s*(-?[\d.,]+)%\s*PDB\)/i),primary=t.match(/KESEIMBANGAN PRIMER\s+Rp\s*([\d.,]+)\s*T/i);
  if(!period||!rev||!spend||!def)throw Error('Template ringkasan APBN berubah; angka tidak diterbitkan');
  let revenue=numberID(rev[1]),spending=numberID(spend[1]),deficit=numberID(def[1]),deficitGDP=numberID(def[2]);
  if([revenue,spending,deficit,deficitGDP].some(v=>!Number.isFinite(v))||revenue<0||spending<0||Math.abs(spending-revenue-deficit)>1||deficitGDP>0)throw Error('Rekonsiliasi APBN gagal');
  const periodValue=dateID(period[1]+' '+period[2]);if(!periodValue)throw Error('Periode APBN tidak valid');
  return {period:periodValue,revenue,spending,balance:-deficit,deficitGDP,primary:primary&&/keseimbangan primer positif|primer surplus/i.test(t)?numberID(primary[1]):null,page:p.num,unit:'Rp triliun',basis:'Realisasi kumulatif sejak Januari',basisEn:'Cumulative realisation from January',note:'Ekstraksi template ringkasan; harus cocok pendapatan − belanja = saldo. Defisit dalam % PDB mengikuti angka sumber.',noteEn:'Summary-template extraction; revenue minus spending must reconcile to the balance. Deficit/GDP follows the source.'};
 }throw Error('Halaman ringkasan APBN tidak ditemukan pada awal PDF');
}
const months={Jan:'Januari',Feb:'Februari',Mar:'Maret',Apr:'April',Mei:'Mei',May:'Mei',Jun:'Juni',Jul:'Juli',Agu:'Agustus',Aug:'Agustus',Sep:'September',Okt:'Oktober',Oct:'Oktober',Nov:'November',Des:'Desember',Dec:'Desember'};
export function parseIndicators(html){const t=text(html),result=[];
 const reserves=t.match(/Cadangan Devisa\s*\(Dalam Juta\)\s*\$\s*([\d.]+)\s+(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/i);
 if(reserves){const period=dateID(`${reserves[2]} ${months[reserves[3]]||reserves[3]} ${reserves[4]}`);if(period)result.push({id:'fxreserves',period:period.slice(0,7),value:numberID(reserves[1])/1000});}
 const overnight=t.match(/INDONIA\s+([\d.,]+)%\s+(\d{1,2}\s+\w+\s+\d{4})/);if(overnight){const period=dateID(overnight[2]);if(period)result.push({id:'indonia',period,value:numberID(overnight[1])});}
 const srbi=t.match(/SRBI\s*\(Transaksi Neto Nonresiden\)\s*(-?)Rp\s*([\d.,]+)\s*Triliun\s*\(periode\s+(\d{1,2})\s*[–-]\s*(\d{1,2})\s+(\w+)\s+(\d{4})\)/i);if(srbi){let end=dateID(`${srbi[4]} ${srbi[5]} ${srbi[6]}`),start=dateID(`${srbi[3]} ${srbi[5]} ${srbi[6]}`);if(end&&start)result.push({id:'srbiflow',period:end,value:numberID(srbi[2])*(srbi[1]?-1:1),rangeStart:start});}
 const target=t.match(/Target Inflasi\s*([\d.,]+)\s*±\s*([\d.,]+)%\s*(\d{4})/i);
 if(!result.length)throw Error('Indikator tambahan BI tidak ditemukan');
 return {points:result,target:target?{mid:numberID(target[1]),width:numberID(target[2]),year:Number(target[3]),url:'https://www.bi.go.id/id/statistik/indikator/default.aspx'}:null};
}
export function articleDate(html){const m=html.match(/id=["']layout-date["'][^>]*>([\s\S]*?)<\/div>/i);const s=m?text(m[1]):'';const v=s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);if(!v)return null;let mm=+v[1],dd=+v[2];if(mm<1||mm>12||dd<1||dd>31)return null;return `${v[3]}-${String(mm).padStart(2,'0')}-${String(dd).padStart(2,'0')}`;}
export function discoverReport(html){for(const m of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)){let label=text(m[2]),url=safeOfficialURL(m[1],'https://www.bi.go.id',['bi.go.id']);if(url&&/^Laporan Survei Konsumen\s*-/.test(label)){const p=label.match(/-\s*(\w+)\s+(\d{4})/);if(p)return {url,period:dateID(p[1]+' '+p[2]),title:label};}}throw Error('Laporan survei konsumen tidak ditemukan');}
export function reportPDF(html){for(const m of html.matchAll(/href=["']([^"']+\.pdf)["']/gi)){const url=safeOfficialURL(m[1],'https://www.bi.go.id',['bi.go.id']);if(url&&/\/publikasi\/laporan\/Documents\/SK-/i.test(url))return url;}throw Error('Lampiran PDF survei tidak ditemukan');}
export function parseConsumerPDF(pages,period){let t=pages.map(p=>p.text).join(' ').replace(/\s+/g,' ');const expected=new Date(period+'-01T00:00:00Z').toLocaleDateString('id-ID',{month:'long',year:'numeric',timeZone:'UTC'});if(!t.toLowerCase().includes(expected.toLowerCase()))throw Error('Periode PDF survei tidak cocok dengan judul laporan');const m=t.match(/Indeks Keyakinan Konsumen\s*\(IKK\)[\s\S]{0,220}?(\d{3}[.,]\d)/i);if(!m)throw Error('Indeks keyakinan konsumen tidak terbaca');let value=Number(m[1].replace(',','.'));if(value<0||value>200)throw Error('IKK di luar rentang');return {id:'confidence',period,value};}
export function parsePMI(html){const raw=text(html);const start=raw.indexOf('Page Content');const end=start>=0?raw.indexOf('Lampiran',start):-1;const t=start>=0?raw.slice(start,end>start?end:undefined):raw;const q=t.match(/triwulan\s+(I{1,3}|IV)\s+(\d{4})[\s\S]{0,220}?PMI-BI sebesar\s+([\d,]+)%/i);if(!q)throw Error('PMI-BI aktual tidak ditemukan');const quarters={I:1,II:2,III:3,IV:4};const quarter=quarters[q[1].toUpperCase()],year=Number(q[2]);const forecast=[...t.matchAll(/Pada triwulan\s+(I{1,3}|IV)\s+(\d{4})[\s\S]{0,160}?PMI-BI sebesar\s+([\d,]+)%/gi)].find(m=>Number(m[2])*4+quarters[m[1].toUpperCase()]>year*4+quarter);let value=numberID(q[3]);if(value<0||value>100)throw Error('PMI di luar rentang');return {id:'manufacturing',period:`${year}-${String(quarter*3).padStart(2,'0')}`,quarter,value,officialForecast:forecast?{quarter:quarters[forecast[1].toUpperCase()],year:Number(forecast[2]),value:numberID(forecast[3]),publishedAt:articleDate(html)}:null};}
