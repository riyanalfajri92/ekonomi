export const DRIVER_SERIES=[
 ['household','NE.CON.PRVT.KD.ZG','Konsumsi rumah tangga & nirlaba','Household & NPISH consumption','% pertumbuhan riil/tahun',-100,200],
 ['investment','NE.GDI.FTOT.KD.ZG','Investasi aset tetap (PMTB)','Gross fixed capital formation','% pertumbuhan riil/tahun',-100,200],
 ['government','NE.CON.GOVT.KD.ZG','Konsumsi akhir pemerintah','Government final consumption','% pertumbuhan riil/tahun',-100,200],
 ['exports','NE.EXP.GNFS.KD.ZG','Ekspor barang & jasa','Exports of goods & services','% pertumbuhan riil/tahun',-100,200],
 ['imports','NE.IMP.GNFS.KD.ZG','Impor barang & jasa','Imports of goods & services','% pertumbuhan riil/tahun',-100,200],
 ['consumptionPerCapita','NE.CON.PRVT.PC.KD.ZG','Konsumsi rumah tangga per kapita','Household consumption per capita','% pertumbuhan riil/tahun',-100,200],
 ['agriculture','NV.AGR.TOTL.KD.ZG','Pertanian, kehutanan & perikanan','Agriculture, forestry & fishing','% pertumbuhan riil/tahun',-100,200],
 ['industry','NV.IND.TOTL.KD.ZG','Industri termasuk konstruksi','Industry including construction','% pertumbuhan riil/tahun',-100,200],
 ['services','NV.SRV.TOTL.KD.ZG','Jasa','Services','% pertumbuhan riil/tahun',-100,200],
 ['gini','SI.POV.GINI','Indeks Gini · World Bank/PIP','Gini index · World Bank/PIP','indeks 0–100',0,100]
].map(([id,code,label,labelEn,unit,min,max])=>({id,code,label,labelEn,unit,min,max,frequency:'annual',source:'World Bank · WDI/PIP',url:`https://data.worldbank.org/indicator/${code}?locations=ID`,role:'historical-drivers'}));
export function driversURL(now=new Date()){return `https://api.worldbank.org/v2/country/IDN/indicator/${DRIVER_SERIES.map(x=>x.code).join(';')}?source=2&format=json&per_page=1000&date=${now.getUTCFullYear()-20}:${now.getUTCFullYear()}`;}
export function parseDrivers(json,prior=[],now=new Date()){
 if(!Array.isArray(json?.[1])||!json[1].some(x=>x.countryiso3code==='IDN'&&DRIVER_SERIES.some(d=>d.code===x.indicator?.id)&&Number.isFinite(x.value)))throw Error('Respons penggerak ekonomi tidak valid atau tidak berisi observasi Indonesia');const stamp=now.toISOString();
 return DRIVER_SERIES.map(def=>{const rows=json[1].filter(x=>x.countryiso3code==='IDN'&&x.indicator?.id===def.code&&x.value!==null);if(rows.some(x=>!Number.isFinite(x.value)||x.value<def.min||x.value>def.max))throw Error('Nilai penggerak di luar batas: '+def.id);const history=[...new Map(rows.filter(x=>/^\d{4}$/.test(x.date)&&Number(x.date)<=now.getUTCFullYear()).map(x=>[x.date,{period:x.date,value:x.value}])).values()].sort((a,b)=>b.period.localeCompare(a.period));const old=prior.find(x=>x.id===def.id);if(!history.length)return {...def,...old,status:old?'fallback':'unavailable',error:'Belum ada observasi valid',checkedAt:stamp};if(old?.period>history[0].period)return {...old,status:'fallback',error:'Periode sumber mundur',checkedAt:stamp};return {...def,...history[0],history:history.slice(0,21),previous:history[1]?.value??null,previousPeriod:history[1]?.period??null,fetchedAt:stamp,checkedAt:stamp,datasetUpdated:json[0]?.lastupdated||null,status:'ok'};});
}
