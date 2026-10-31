import {text,dateID,numberID} from './parsers.mjs';
export const LABOUR_URL='https://paskerid.kemnaker.go.id/';
// Public official republication. Administrative vacancies are never treated as national employment.
export function parseLabourPublic(html,now=new Date()){
 const full=text(html),start=full.indexOf('Highlight Pasar Kerja');if(start<0)throw Error('Bagian indikator Kemnaker tidak ditemukan');const s=full.slice(start,start+5000);
 const specs=[
 ['labourForce',/Angkatan Kerja\s*([\d.]+)\s*Orang\s*Jumlah Penduduk 15 tahun ke atas yang merupakan angkatan kerja per\s+(\w+)\s+(20\d{2})/i,'Angkatan kerja','Labour force','orang'],
 ['bpsJobs',/Tingkat Pengangguran Terbuka\s*\(TPT\)\s*([\d.,]+)\s*%\s*Tingkat pengangguran terbuka per\s+(\w+)\s+(20\d{2})/i,'Tingkat pengangguran terbuka','Unemployment rate','%'],
 ['labourParticipation',/Tingkat partisipasi angkatan kerja\s*\(TPAK\)\s*([\d.,]+)\s*%\s*Tingkat partisipasi angkatan kerja per\s+(\w+)\s+(20\d{2})/i,'Partisipasi angkatan kerja','Labour-force participation','%'],
 ['employedPeople',/Penduduk Bekerja\s*([\d.]+)\s*Orang\s*Jumlah penduduk bekerja per\s+(\w+)\s+(20\d{2})/i,'Penduduk bekerja','Employed people','orang'],
 ['unemployedPeople',/Pengangguran Terbuka\s*([\d.]+)\s*Orang\s*Jumlah Pengangguran Terbuka per\s+(\w+)\s+(20\d{2})/i,'Penduduk menganggur','Unemployed people','orang']
 ];
 const rows=specs.flatMap(([id,re,label,labelEn,unit])=>{const m=s.match(re);if(!m)return [];const value=numberID(m[1]),period=dateID(m[2]+' '+m[3]);if(!period||new Date(period+'-01T00:00:00Z')>now||!Number.isFinite(value)||value<0||(unit==='%'?value>100:value>3e8))throw Error('Nilai/periode ketenagakerjaan tidak valid');return [{id,value,period,label,labelEn,unit,url:LABOUR_URL,source:'Kemnaker · Pasker ID · indikator ketenagakerjaan',sourceEn:'Ministry of Manpower · Pasker ID · labour indicators',upstream:'BPS/Sakernas; publikasi ulang resmi Kemnaker',definition:'National labour indicator; not administrative job vacancies',history:[{period,value}]}];});
 const a=rows.find(x=>x.id==='labourForce'),e=rows.find(x=>x.id==='employedPeople'),u=rows.find(x=>x.id==='unemployedPeople');if(a&&e&&u&&a.period===e.period&&e.period===u.period&&Math.abs(a.value-e.value-u.value)>1000)throw Error('Jumlah bekerja + menganggur tidak cocok dengan angkatan kerja');
 if(!rows.some(x=>x.id==='bpsJobs'))throw Error('TPT nasional tidak terbaca; lowongan administratif tidak dipakai sebagai pengganti');return rows;
}
