import {validateSnapshot} from './validate.mjs';
const LISTS=['metrics','social','structural','drivers','deposits','bankHealth'];
// Reject invalid observations locally so one damaged source cannot erase other valid updates.
export function admitSnapshot(prior,candidate,now=new Date()){
 const out={...candidate},rejections=[];
 const reject=(group,row,old,reason)=>{rejections.push({group,id:row?.id||group,period:row?.period||null,reason,checkedAt:now.toISOString()});return old?{...old,status:'fallback',error:reason}:null;};
 for(const group of LISTS){const next=[];for(const row of candidate[group]||[]){const old=prior[group]?.find(x=>x.id===row.id);const probe={schemaVersion:1,metrics:[],[group]:[row]};const errors=validateSnapshot(probe,now);if(old?.period&&row.period&&row.period<old.period)errors.push('Periode sumber mundur');const accepted=errors.length?reject(group,row,old,errors.join('; ')):row;if(accepted)next.push(accepted);}for(const old of prior[group]||[])if(!next.some(x=>x.id===old.id))next.push({...old,status:'fallback',error:'Seri tidak dikembalikan pada pemeriksaan terakhir'});out[group]=next;}
 for(const group of ['fiscal','bondQuotes','bondMarket','worldContext']){const row=candidate[group],old=prior[group];if(!row){if(old)out[group]={...old,status:'fallback'};continue;}const errors=validateSnapshot({schemaVersion:1,metrics:[],[group]:row},now);if(old?.period&&row.period&&row.period<old.period)errors.push('Periode sumber mundur');if(errors.length)out[group]=reject(group,row,old,errors.join('; '));}
 out.rejections=rejections;return out;
}
