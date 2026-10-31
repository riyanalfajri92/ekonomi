import {reportModel,dependencyState} from './report-model.js';
const finite=Number.isFinite;
// No invented observations or interpolation. Changes in rates use percentage points.
export function priorObservation(row,{annual=false}={}){
 if(!row||!finite(row.value)||!row.period)return null;
 const target=annual?`${Number(row.period.slice(0,4))-1}${row.period.slice(4)}`:null;
 const history=[...(row.history||[])].filter(x=>finite(x.value)&&x.period<row.period&&(!target||x.period===target)).sort((a,b)=>b.period.localeCompare(a.period));
 const previous=history[0]||(annual&&row.previousPeriod===target&&finite(row.previous)?{period:target,value:row.previous}:null);
 return previous?{period:row.period,value:row.value,previous:previous.value,previousPeriod:previous.period,change:row.value-previous.value}:null;
}
export function changeBrief(data,now=new Date()){
 const r=reportModel(data,now),e=r.economy;
 const definitions=[['inflation',e.inflation,false],['jobs',e.jobs,true],['poverty',e.poverty,true],['consumption',r.driver('consumptionPerCapita'),true],['inequality',r.gini,true]];
 const rows=definitions.map(([id,row,annual])=>({id,row,comparison:priorObservation(row,{annual}),state:dependencyState([row],now)}));
 const f=e.fiscal,c=f?.comparisons?.central;
 rows.push({id:'public',row:f,comparison:c?.comparison==='same-period-prior-year'&&finite(c.previous)&&c.previous>0&&finite(c.value)?{period:f.period,value:c.value,previous:c.previous,previousPeriod:`${Number(f.period.slice(0,4))-1}${f.period.slice(4)}`,change:100*(c.value/c.previous-1),relative:true}:null,state:r.states.fiscal});
 rows.unshift({id:'income',row:e.wage,real:e.realWage,state:r.states.purchasing});
 return rows;
}
export function forecastAudit(data,now=new Date()){
 const p=reportModel(data,now).prospect.projection;
 const valid=(data?.forecastArchive||[]).filter(x=>x.model==='median3-v1'&&x.origin==='github-actions'&&finite(x.point)&&finite(x.actual)&&finite(Date.parse(x.issuedAt))&&Date.parse(x.firstEvaluatedAt)>Date.parse(x.issuedAt)&&/^\d{4}-\d{2}$/.test(x.horizon)&&x.issuedAt.slice(0,7)<=x.horizon&&Date.parse(x.firstEvaluatedAt)<=+now);
 const unique=[...new Map(valid.map(x=>[x.horizon,x])).values()];
 const skill=p.available&&p.naiveMAE>0?1-p.mae/p.naiveMAE:null;
 const reasons=[];
 if(!p.available)reasons.push('unavailable');
 if((p.tests||0)<24)reasons.push('short');
 if(skill===null||skill<=0)reasons.push('benchmark');
 if(unique.length<12)reasons.push('prospective');
 const source=dependencyState([data?.metrics?.find(x=>x.id==='inflation')],now);
 if(source!=='supported')reasons.push('source');
 return {projection:p,skill,prospective:unique.length,prospectiveMAE:unique.length?unique.reduce((s,x)=>s+Math.abs(x.actual-x.point),0)/unique.length:null,rmse:p.available?Math.sqrt(p.errors.reduce((s,x)=>s+x.error*x.error,0)/p.tests):null,reasons,eligible:reasons.length===0,minimumTests:24,minimumProspective:12};
}
