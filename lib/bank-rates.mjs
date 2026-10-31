import {text} from './parsers.mjs';
export const MORE_BANKS=[
 {id:'bni',name:'BNI',url:'https://bni.co.id/id-id/individu/simpanan-berjangka-dplk/bni-deposito',tenors:[1,3,6,12,24],minimum:5e6,tier:[0,1e8,1e9,5e9,50e9,100e9],product:'Deposito Rupiah reguler',productEn:'Regular IDR deposit',selector:'Rupiah',expected:6},
 {id:'btn',name:'BTN',url:'https://www.btn.co.id/id/Individual/Produk-Dana/Produk-Investasi/Deposito-BTN-Ritel-Rupiah',tenors:[1,3,6,12,24],minimum:1e6,tier:[1e6,5e6,1e8,5e8,2e9],product:'eDeposito Rupiah · balé',productEn:'IDR eDeposit · balé',selector:'Rp1 juta',expected:5},
 {id:'cimb',name:'CIMB Niaga',url:'https://www.cimbniaga.co.id/id/personal/tabungan/deposito-berjangka',tenors:[1,3,6,12],minimum:8e6,tier:[8e6,1e8,5e8],product:'Deposito Rupiah · OCTO',productEn:'IDR deposit · OCTO',selector:'Nominal (Rp)',expected:3},
 {id:'danamon',name:'Danamon',url:'https://www.danamon.co.id/Personal/Lainnya/Suku-Bunga',tenors:[1,3,6,9,12],minimum:1e6,tier:[1e6,5e6,8e6,1e8,2.5e8,5e8,1e9,2e9,10e9],product:'Deposito Online Rupiah',productEn:'Online IDR deposit',selector:'Rp1.000.000',expected:9},
 {id:'ocbc',name:'OCBC Indonesia',url:'https://www.ocbc.id/id/suku-bunga-dasar',tenors:[1,3,6,12],minimum:8e6,tier:[8e6],product:'Deposito Rupiah · cabang',productEn:'IDR deposit · branch',selector:'Minimum 8 Juta',expected:1},
 {id:'maybank',name:'Maybank Indonesia',url:'https://www.maybank.co.id/savings/Rates/suku-bunga-deposito',tenors:[1,3,6,12,24],minimum:1e7,tier:[1e7],product:'Deposito Rupiah · counter',productEn:'IDR deposit · counter',selector:'Min. Rp10 juta',expected:1},
 {id:'mega',name:'Bank Mega',url:'https://bankmega.com/id/personal/simpanan-individual/mega-depo/',tenors:[1,3,6,12,24],minimum:8e6,tier:[0,1e8,5e8],product:'Mega Depo Rupiah · reguler',productEn:'Mega Depo IDR · regular',selector:'Tier Nominal (IDR) 1 Bulan',expected:3},
 {id:'panin',name:'PaninBank',url:'https://www.panin.co.id/sites/default/files/interest/interest-deposito.json',tenors:[1,3,6,12],minimum:null,tier:[0],product:'Deposito Rupiah · counter',productEn:'IDR deposit · counter',expected:1}
];
const clean=s=>text(s).replace(/&(lt|gt|ge|le|ndash);/g,(_,k)=>({lt:'<',gt:'>',ge:'≥',le:'≤',ndash:'–'}[k])).replace(/\s+/g,' ').trim();
export function parseMoreBank(html,b){let tiers=[];
 if(b.id==='panin'){const rows=JSON.parse(html).depoInterestRatesIDR?.rates;if(!rows)throw Error('Data Panin berubah');const rates={};for(const term of b.tenors){const r=rows.find(x=>x.displayNames.name.some(y=>y['#text']===`${term} Bulan`));const v=Number(r?.counter);if(!Number.isFinite(v)||v<0||v>30)throw Error('Tarif Panin tidak valid');rates[term]=v;}tiers=[{label:'Counter · konfirmasi minimum ke bank',min:0,max:null,rates}];}
 else{const tables=[...html.matchAll(/<table\b[^>]*>[\s\S]*?<\/table>/gi)].map(x=>x[0]);let table=tables.find(h=>clean(h).includes(b.selector)&&(b.id==='ocbc'||(/1\s*Bulan/i.test(clean(h))&&/12\s*Bulan/i.test(clean(h)))));if(!table)throw Error('Tabel Rupiah spesifik tidak ditemukan');
 for(const row of table.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)){const cells=[...row[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(x=>clean(x[1]));let rr=cells.map((x,i)=>({i,m:x.match(/^(\d{1,2}[.,]\d{1,3})\s*%/)})).filter(x=>x.m);if(!rr.length)continue;
 if(b.id==='maybank'&&rr.length===1&&/colspan=["']?5/i.test(row[1]))rr=Array.from({length:5},()=>rr[0]);
 if(rr.length!==b.tenors.length)continue;let label=cells.slice(0,rr[0].i).join(' ');if(!label||/^Suku Bunga|^Bunga$/.test(label))continue;const vals=rr.map(x=>Number(x.m[1].replace(',','.')));if(vals.some(v=>v<0||v>30))throw Error('Tarif di luar batas');tiers.push({label,min:b.tier[tiers.length],max:b.tier[tiers.length+1]??null,rates:Object.fromEntries(b.tenors.map((t,i)=>[t,vals[i]]))});}
 if(tiers.length!==b.expected||tiers.some(x=>x.min===undefined))throw Error('Struktur tier berubah; perlu verifikasi');
 // Validate tier numbers as well as row count; a changed nominal boundary must not be silently reused.
 for(let i=0;i<tiers.length;i++){
  const label=tiers[i].label;const nums=[];
  for(const m of label.matchAll(/(\d+(?:[.,]\d+)*)\s*(juta|miliar|ribu|jt|m)\b/gi)){const number=Number(m[1].replace(/\./g,'').replace(',','.'));nums.push(number*(/juta|jt/i.test(m[2])?1e6:/ribu/i.test(m[2])?1e3:1e9));}
  for(const m of label.matchAll(/Rp\s*([\d.]+)/gi))nums.push(Number(m[1].replace(/\./g,'')));
  if(b.tier[i]>0&&!nums.includes(b.tier[i]))throw Error('Batas bawah tier '+b.name+' berubah');
  if(b.tier[i+1]&&!nums.includes(b.tier[i+1]))throw Error('Batas atas tier '+b.name+' berubah');
  tiers[i].minInclusive=!/^\s*>\s*(?![=])/.test(label);tiers[i].maxInclusive=/≤|<=/.test(label);
 }

 }
 return {...b,tiers,conditions:'Tarif sesuai kanal dan nominal yang tertulis; konfirmasi biaya, penalti dan syarat pembukaan. Bukan penawaran personal.',conditionsEn:'Rates follow the stated channel and amount tier; confirm fees, penalties and opening conditions. Not a personalised offer.',effectiveAt:null,sourceUpdated:null};}

export function selectDepositTier(tiers,amount){return tiers.find(q=>(q.minInclusive===false?amount>q.min:amount>=q.min)&&(q.max===null||(q.maxInclusive?amount<=q.max:amount<q.max)));}
