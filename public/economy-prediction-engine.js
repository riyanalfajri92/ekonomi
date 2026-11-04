import {PREDICTION_TARGETS} from './prediction-catalog.js';
export const PREDICTION_PROTOCOL='rolling-ar1-naive-v1';
const finite=Number.isFinite;
const month=p=>Number(p.slice(0,4))*12+Number(p.slice(5,7))-1;
export const monthPeriod=i=>`${Math.floor(i/12)}-${String(i%12+1).padStart(2,'0')}`;
const step=f=>f==='quarterly'?3:f==='semiannual'?6:1;
const mean=a=>a.length?a.reduce((s,x)=>s+x,0)/a.length:null;
const quantile=a=>{if(a.length<12)return null;const s=a.slice(-48).map(Math.abs).sort((a,b)=>a-b);return s[Math.min(s.length-1,Math.ceil((s.length+1)*.8)-1)];};
export function cleanPredictionSeries(input,def,now=new Date()){
 const rows=input?.history||[],seen=new Map(),current=new Date(+now+7*3600000).toISOString().slice(0,7);
 for(const x of rows){if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(x.period)||!finite(x.value)||x.value<def.min||x.value>def.max||x.period>current)throw Error('invalid-observation');if(def.frequency==='quarterly'&&Number(x.period.slice(5))%3!==0)throw Error('frequency-mismatch');if(def.frequency==='semiannual'&&![2,8].includes(Number(x.period.slice(5))))throw Error('frequency-mismatch');if(seen.has(x.period)&&seen.get(x.period).value!==x.value)throw Error('conflicting-observation');seen.set(x.period,{...x});}
 return [...seen.values()].sort((a,b)=>a.period.localeCompare(b.period));
}
function contiguousTail(history,frequency){const d=step(frequency);let i=history.length-1;while(i>0&&month(history[i].period)-month(history[i-1].period)===d)i--;return history.slice(i);}
export function arPrediction(train,horizon,def){const h=train.slice(-90),pairs=h.slice(1).flatMap((x,i)=>month(x.period)-month(h[i].period)===step(def.frequency)?[[h[i].value,x.value]]:[]).slice(-60);if(pairs.length<12)return null;const mx=mean(pairs.map(x=>x[0])),my=mean(pairs.map(x=>x[1])),den=pairs.reduce((s,x)=>s+(x[0]-mx)**2,0),phi=Math.max(-.98,Math.min(.98,den?pairs.reduce((s,x)=>s+(x[0]-mx)*(x[1]-my),0)/den:0)),c=my-phi*mx;let p=h.at(-1).value;for(let i=0;i<horizon;i++)p=c+phi*p;if(!finite(p)||p<def.min||p>def.max)return null;return p;}
function choice(known){if(known.length<12)return 'naive';return mean(known.slice(-36).map(x=>Math.abs(x.arError)))<mean(known.slice(-36).map(x=>Math.abs(x.naiveError)))?'ar1':'naive';}
export function predictTarget(def,input,now=new Date()){
 const fail=(reason,extra={})=>({id:def.id,available:false,reason,protocol:PREDICTION_PROTOCOL,...extra});
 if(!input?.history?.length)return fail('missing-series',{sourceError:input?.error||null});
 let history;try{history=cleanPredictionSeries(input,def,now);}catch(e){return fail(e.message);}
 const contiguous=contiguousTail(history,def.frequency),tail=history,last=history.at(-1),d=step(def.frequency),minTrain=def.frequency==='semiannual'?12:def.frequency==='quarterly'?20:24,minTests=def.frequency==='monthly'?12:6;
 const detail={historyCount:history.length,contiguousCount:contiguous.length,required:minTrain+minTests,basePeriod:last?.period,last:last?.value,history:history.slice(-96),source:input.source||def.source,url:input.url||def.url,fetchedAt:input.fetchedAt||null,checkedAt:input.checkedAt||null,sourceStatus:input.status||'unverified',definition:input.definition||null,sourceNote:input.note||null};
 if(!last)return fail('missing-series',detail);
 const age=month(new Date(+now+7*3600000).toISOString().slice(0,7))-month(last.period);
 if(age>(def.frequency==='quarterly'?8:def.frequency==='semiannual'?10:3))return fail('outdated',detail);
 if(tail.length<minTrain+minTests||contiguous.length<3)return fail('short-history',detail);
 const horizons=(def.frequency==='quarterly'?[1,2,4]:def.frequency==='semiannual'?[1,2]:[1,3,6]).map(h=>{
  const errors=[];
  for(let origin=minTrain-1;origin<tail.length-h;origin++){
   if(month(tail[origin+h].period)-month(tail[origin].period)!==h*d)continue;
   const train=tail.slice(0,origin+1),ar=arPrediction(train,h,def),naive=tail[origin].value;if(ar===null)continue;
   // Only errors whose target was observable at this origin can select/calibrate this forecast.
   const known=errors.filter(x=>x.targetIndex<=origin),model=choice(known),point=model==='ar1'?ar:naive,r=quantile(known.map(x=>x.error)),actual=tail[origin+h].value;
   errors.push({origin:tail[origin].period,target:tail[origin+h].period,targetIndex:origin+h,model,point,actual,error:actual-point,arError:actual-ar,naiveError:actual-naive,band80:r===null?null:{low:Math.max(def.min,point-r),high:Math.min(def.max,point+r)}});
  }
  const model=choice(errors),ar=arPrediction(tail,h,def),point=model==='ar1'&&ar!==null?ar:last.value,r=quantile(errors.map(x=>x.error)),evals=errors.slice(-60),bands=evals.filter(x=>x.band80),mae=mean(evals.map(x=>Math.abs(x.error))),naiveMAE=mean(evals.map(x=>Math.abs(x.naiveError)));
  return {steps:h,months:h*d,target:monthPeriod(month(last.period)+h*d),point,model,tests:evals.length,mae,naiveMAE,arMAE:mean(evals.map(x=>Math.abs(x.arError))),rmse:Math.sqrt(mean(evals.map(x=>x.error*x.error))??0),skill:naiveMAE>0?1-mae/naiveMAE:null,band80:r===null?null:{low:Math.max(def.min,point-r),high:Math.min(def.max,point+r),calibration:Math.min(48,errors.length)},coverage:bands.length?bands.filter(x=>x.actual>=x.band80.low&&x.actual<=x.band80.high).length/bands.length:null,coverageTests:bands.length,errors:evals.map(({targetIndex,...x})=>x)};
 });
 if(horizons[0].tests<minTests)return fail('few-tests',detail);
 return {...detail,id:def.id,available:true,protocol:PREDICTION_PROTOCOL,experimental:true,horizons,method:'AR(1) is used only after 12 previously resolved rolling errors beat persistence; otherwise last-value baseline. Evaluation is prequential, using revised historical data, not real-time vintages.'};
}
export function predictionInputsFromSnapshot(data){
 const inputs=new Map((data?.predictionInputs?.series||[]).map(x=>[x.id,x]));
 for(const [id,key]of [['inflation','inflation'],['core','coreInflation'],['food','foodInflation']]){const m=data?.metrics?.find(x=>x.id===key);if(!m)continue;const old=inputs.get(id),merged=new Map((old?.history||[]).map(x=>[x.period,x]));for(const x of m.history||[])if(/^\d{4}-\d{2}$/.test(x.period)&&finite(x.value))merged.set(x.period,x);inputs.set(id,{...old,source:m.source,url:m.url,fetchedAt:m.fetchedAt,status:m.status,history:[...merged.values()].sort((a,b)=>a.period.localeCompare(b.period))});}
 for(const [id,key]of [['unemployment','bpsJobs']]){const m=data?.social?.find(x=>x.id===key);if(m?.history?.length&&!inputs.get(id)?.history?.length)inputs.set(id,{...m,id,history:m.history.filter(x=>['02','08'].includes(x.period?.slice(5)))});}
 const wage=data?.social?.find(x=>x.id==='bpsWage');if(wage?.history?.length){const levels=new Map(wage.history.map(x=>[x.period,x.value])),inflation=inputs.get('inflation'),prices=new Map((inflation?.history||[]).map(x=>[x.period,x.value]));const nominal=[],real=[];for(const [period,value]of levels){const prev=levels.get(`${Number(period.slice(0,4))-1}${period.slice(4)}`);if(!(prev>0)||!['02','08'].includes(period.slice(5)))continue;const growth=100*(value/prev-1);nominal.push({period,value:growth});if(prices.has(period))real.push({period,value:100*((1+growth/100)/(1+prices.get(period)/100)-1)});}for(const [id,history]of [['wage',nominal],['realWage',real]])if(history.length&&!inputs.get(id)?.history?.length)inputs.set(id,{id,source:wage.source,url:wage.url,fetchedAt:wage.fetchedAt,status:wage.status,history});}
 return inputs;
}
export function buildEconomyPredictions(data,now=new Date()){
 const inputs=predictionInputsFromSnapshot(data),targets=PREDICTION_TARGETS.map(def=>predictTarget(def,inputs.get(def.id),now));return {protocol:PREDICTION_PROTOCOL,computedAt:now.toISOString(),total:targets.length,available:targets.filter(x=>x.available).length,targets};
}
export function updatePredictionLedger(prior,suite,stamp,origin){const rows=[...(prior||[])];for(const s of suite.targets){for(const row of rows.filter(x=>x.id===s.id)){const a=s.history?.find(x=>x.period===row.target);if(a){row.firstActual??=a.value;row.firstEvaluatedAt??=stamp;row.latestRevisedActual=a.value;row.error=row.firstActual-row.point;}}if(!s.available)continue;for(const h of s.horizons){if(rows.some(x=>x.id===s.id&&x.protocol===s.protocol&&x.basePeriod===s.basePeriod&&x.target===h.target&&x.origin===origin))continue;rows.unshift({id:s.id,protocol:s.protocol,basePeriod:s.basePeriod,target:h.target,point:h.point,band80:h.band80,model:h.model,issuedAt:stamp,origin});}}return rows.slice(0,1600);}
