// Annual structural context supplements, and never replaces, BPS household/labour releases.
export const STRUCTURAL_SERIES=[
 ['water','SH.H2O.BASW.ZS','Akses air minum dasar','Basic drinking-water access','WHO/UNICEF JMP','% penduduk',0,100],
 ['waterUrban','SH.H2O.BASW.UR.ZS','Akses air minum dasar · perkotaan','Basic water · urban','WHO/UNICEF JMP','% penduduk perkotaan',0,100],
 ['waterRural','SH.H2O.BASW.RU.ZS','Akses air minum dasar · perdesaan','Basic water · rural','WHO/UNICEF JMP','% penduduk perdesaan',0,100],
 ['sanitation','SH.STA.BASS.ZS','Akses sanitasi dasar','Basic sanitation access','WHO/UNICEF JMP','% penduduk',0,100],
 ['healthOOP','SH.XPD.OOPC.CH.ZS','Pembayaran langsung dalam belanja kesehatan','Out-of-pocket share of health expenditure','WHO GHED','% belanja kesehatan nasional berjalan',0,100],
 ['neet','SL.UEM.NEET.ZS','Pemuda di luar pendidikan, pekerjaan dan pelatihan','Youth outside education, employment and training','ILO · LFS','% penduduk usia 15–24',0,100],
 ['neetFemale','SL.UEM.NEET.FE.ZS','NEET · perempuan','NEET · female','ILO · LFS','% perempuan usia 15–24',0,100],
 ['neetMale','SL.UEM.NEET.MA.ZS','NEET · laki-laki','NEET · male','ILO · LFS','% laki-laki usia 15–24',0,100],
 ['vulnerableWork','SL.EMP.VULN.ZS','Pekerjaan rentan menurut status · model ILO','Vulnerable employment by status · ILO model','ILO · modelled estimates','% penduduk bekerja',0,100],
 ['schoolCompletion','SE.SEC.CMPT.LO.ZS','Proksi penyelesaian pendidikan menengah pertama','Lower-secondary completion proxy','UNESCO UIS','% kelompok umur terkait',0,150]
].map(([id,code,label,labelEn,producer,unit,min,max])=>({id,code,label,labelEn,producer,unit,min,max,url:`https://data.worldbank.org/indicator/${code}?locations=ID`,frequency:'annual',role:'structural-context'}));
export function structuralURL(now=new Date()){return `https://api.worldbank.org/v2/country/IDN/indicator/${STRUCTURAL_SERIES.map(x=>x.code).join(';')}?source=2&format=json&per_page=1000&date=${now.getUTCFullYear()-15}:${now.getUTCFullYear()}`;}
export function parseStructural(json,prior=[],now=new Date()){
 if(!Array.isArray(json)||!Array.isArray(json[1]))throw Error('Respons indikator sosial tidak valid');const stamp=now.toISOString();
 return STRUCTURAL_SERIES.map(def=>{const raw=json[1].filter(x=>x.countryiso3code==='IDN'&&x.indicator?.id===def.code&&x.value!==null);if(raw.some(x=>!Number.isFinite(x.value)||x.value<def.min||x.value>def.max))throw Error('Nilai seri sosial di luar batas: '+def.id);const history=[...new Map(raw.filter(x=>/^\d{4}$/.test(x.date)&&Number(x.date)<=now.getUTCFullYear()).map(x=>[x.date,{period:String(x.date),value:x.value}])).values()].sort((a,b)=>b.period.localeCompare(a.period));const old=prior.find(x=>x.id===def.id);if(!history.length)return {...def,...old,status:'unavailable',checkedAt:stamp,error:'Belum ada observasi pada jendela data'};if(old?.period>history[0].period)return {...old,status:'fallback',checkedAt:stamp,error:'Periode sumber mundur'};const prev=history[1];return {...def,...history[0],history:history.slice(0,16),previous:prev?.value??null,previousPeriod:prev?.period??null,delta:prev?history[0].value-prev.value:null,datasetUpdated:json[0]?.lastupdated||null,fetchedAt:stamp,checkedAt:stamp,status:'ok'};});
}
