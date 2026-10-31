import {text,dateID,numberID} from './parsers.mjs';
export const BI_HEADLINES_URL='https://www.bi.go.id/id/statistik/indikator/default.aspx';
const aliases={Jan:'Januari',Feb:'Februari',Mar:'Maret',Apr:'April',Mei:'Mei',Jun:'Juni',Jul:'Juli',Agt:'Agustus',Agu:'Agustus',Sep:'September',Okt:'Oktober',Nov:'November',Des:'Desember'};
export function parseBIHeadlines(html,now=new Date()){
 const s=text(html),definitions=[['rate',/BI-Rate\s+([\d.,]+)\s*%\s+(\d{1,2})\s+(\w+)\s+(20\d{2})/i,0,100],['inflation',/Inflasi IHK\s*\(yoy\)\s+(-?[\d.,]+)\s*%\s+(\d{1,2})\s+(\w+)\s+(20\d{2})/i,-99,100],['jisdor',/JISDOR\s+Rp\s*([\d.,]+)\s+(\d{1,2})\s+(\w+)\s+(20\d{2})/i,100,1e6]],out=[];
 for(const [id,re,min,max]of definitions){const m=s.match(re);if(!m)continue;const month=Object.entries(aliases).find(([key])=>key.toLowerCase()===m[3].toLowerCase())?.[1]||m[3],date=dateID(`${m[2]} ${month} ${m[4]}`),value=numberID(m[1]);if(!date||new Date(date)>now||!Number.isFinite(value)||value<min||value>max)continue;out.push({id,value,period:id==='inflation'?date.slice(0,7):date});}
 return out;
}
