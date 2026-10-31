// Operational tolerances are editorial monitoring rules, not official release calendars.
const DAY=86400000;
const POLICIES={
 jisdor:{cadence:'business-daily',observationDays:5,checkHours:18},indonia:{cadence:'business-daily',observationDays:5,checkHours:18},
 inflation:{cadence:'monthly',observationDays:70,checkHours:18},rate:{cadence:'decision',observationDays:55,checkHours:18},
 fxreserves:{cadence:'monthly',observationDays:70,checkHours:18},srbiflow:{cadence:'weekly-window',observationDays:15,checkHours:18},confidence:{cadence:'monthly',observationDays:70,checkHours:18},manufacturing:{cadence:'quarterly',observationDays:140,checkHours:18},
 bpsGrowth:{cadence:'quarterly',observationDays:170,checkHours:18},bpsWage:{cadence:'semester',observationDays:280,checkHours:18},bpsJobs:{cadence:'semester',observationDays:280,checkHours:18},bpsPoverty:{cadence:'semester',observationDays:310,checkHours:18},bpsGini:{cadence:'semester',observationDays:310,checkHours:18},
 fiscal:{cadence:'monthly',observationDays:80,checkHours:18},bondMarket:{cadence:'business-daily',observationDays:5,checkHours:18},bondQuotes:{cadence:'business-daily',observationDays:5,checkHours:18},deposits:{cadence:'product',observationDays:null,checkHours:18},bankHealth:{cadence:'quarterly',observationDays:190,checkHours:18}
};
export function periodEnd(period){if(!/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/.test(period||''))return NaN;let [y,m,d]=period.split('-').map(Number);const full=period.length===4?`${period}-01-01`:period.length===7?`${period}-01`:period;const start=Date.parse(full);if(!Number.isFinite(start)||new Date(start).toISOString().slice(0,10)!==full)return NaN;return period.length===4?Date.UTC(y+1,0,1)-1:period.length===7?Date.UTC(y,m,1)-1:Date.UTC(y,m-1,d,23,59,59,999);}
export function freshness(row,key=row?.id,now=new Date()){
 if(key==='bondQuotes'&&!row?.period&&row?.rows?.length)row={...row,period:row.rows.map(x=>x.period).sort()[0]};
 const policy=POLICIES[key]||{cadence:'annual',observationDays:1100,checkHours:18},last=Date.parse(row?.fetchedAt||''),end=periodEnd(row?.period),ageDays=Number.isFinite(end)?Math.max(0,(+now-end)/DAY):null,retrievalHours=Number.isFinite(last)?Math.max(0,(+now-last)/3600000):null;
 const initial=row?.status==='initial_verified',failed=['fallback','unavailable'].includes(row?.status),aged=policy.observationDays!==null&&ageDays!==null&&ageDays>policy.observationDays,unchecked=retrievalHours===null||retrievalHours>policy.checkHours;
 return {cadence:policy.cadence,ageDays,retrievalHours,observationLimitDays:policy.observationDays,checkLimitHours:policy.checkHours,initial,aged,unchecked,failed,state:initial?'initial':aged?'aged':failed?'retained':unchecked?'unchecked':'within-window',note:'Operational tolerance, not confirmation that a newer official release does not exist.'};
}
export function pipelineHealth(data,now=new Date()){
 const checked=Date.parse(data?.pipeline?.finishedAt||data?.checkedAt||''),ageHours=Number.isFinite(checked)?Math.max(0,(+now-checked)/3600000):null;
 return {state:(!data?.pipeline?.runId||data.pipeline.environment!=='github-actions'||data.pipeline.scope!=='all-sources')?'unverified':data?.pipeline?.status==='failed'?'failed':ageHours===null||ageHours>18?'overdue':ageHours>9?'late':'on-time',ageHours,warningHours:9,overdueHours:18,lastRun:data?.pipeline?.runId||null,finishedAt:data?.pipeline?.finishedAt||data?.checkedAt||null,nextExpectedAt:Number.isFinite(checked)?new Date(checked+6*3600000).toISOString():null};
}
export function sourceInventory(data,now=new Date()){
 const scalar=(rows,key)=>Array.isArray(rows)?rows.map(r=>({key:key||r.id,id:r.id||key,period:r.period||null,status:r.status||'unavailable',fetchedAt:r.fetchedAt||null,url:r.url||null,available:Number.isFinite(r.value)||r.tiers?.some(t=>Object.values(t.rates||{}).some(Number.isFinite))||Object.values(r.metrics||{}).some(x=>Number.isFinite(x.value)),quality:freshness(r,key||r.id,now)})):[];
 return [...scalar(data?.metrics),...scalar(data?.social),...scalar(data?.structural),...scalar(data?.drivers),...scalar(data?.deposits,'deposits'),...scalar(data?.bankHealth,'bankHealth'),...['fiscal','bondMarket','bondQuotes'].filter(k=>data?.[k]).map(key=>({key,id:key,period:data[key].period||null,status:data[key].status,fetchedAt:data[key].fetchedAt,url:data[key].url,available:key==='fiscal'?Number.isFinite(data[key].revenue):key==='bondMarket'?data[key].points?.length===3:data[key].rows?.length>0,quality:freshness(data[key],key,now)}))];
}
export function releaseReadiness(data,now=new Date()){
 const inventory=sourceInventory(data,now),pipeline=pipelineHealth(data,now),critical=['inflation','bpsWage','bpsJobs','bpsPoverty','bpsGrowth','fiscal'];
 const blockers=critical.flatMap(id=>{const row=inventory.find(x=>x.id===id);return !row||!row.available?[{id,reason:'missing'}]:row.quality.state!=='within-window'?[{id,reason:row.quality.state}]:[];});
 if(!data?.pipeline||data.pipeline.environment!=='github-actions'||data.pipeline.scope!=='all-sources')blockers.push({id:'production-pipeline',reason:'not-verified'});
 if(['failed','overdue','late'].includes(pipeline.state))blockers.push({id:'pipeline-heartbeat',reason:pipeline.state});
 const capabilities=[{id:'core-story',ready:blockers.filter(x=>critical.includes(x.id)).length===0},{id:'deposit-offers',ready:(data?.deposits||[]).length===10&&(data.deposits||[]).every(x=>freshness(x,'deposits',now).state==='within-window')},{id:'bank-reports',ready:(data?.bankHealth||[]).length===10&&(data.bankHealth||[]).every(x=>Number.isFinite(x.metrics?.car?.value)&&Number.isFinite(x.metrics?.npl?.value)&&freshness(x,'bankHealth',now).state==='within-window')},{id:'bond-quotes',ready:data?.bondQuotes?.status==='ok'&&freshness(data.bondQuotes,'bondQuotes',now).state==='within-window'}];
 return {ready:blockers.length===0,blockers,capabilities,claim:'Readiness concerns data operations, not certification of analysis quality or investment suitability.'};
}
