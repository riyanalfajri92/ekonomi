// Fixed protocol v1. No selection of the winning model on its own evaluation sample.
const finite=Number.isFinite,mi=p=>Number(p.slice(0,4))*12+Number(p.slice(5))-1;
const period=i=>`${Math.floor(i/12)}-${String(i%12+1).padStart(2,'0')}`;
function sequence(metric){return [...new Map((metric?.history||[]).filter(x=>/^\d{4}-(?:0[1-9]|1[0-2])$/.test(x.period)&&finite(x.value)).map(x=>[x.period,x])).values()].sort((a,b)=>a.period.localeCompare(b.period));}
export function fitAR1(history){
 const h=history.slice(-61),pairs=h.slice(1).flatMap((x,i)=>mi(x.period)-mi(h[i].period)===1?[[h[i].value,x.value]]:[]);if(pairs.length<24)return null;
 const mx=pairs.reduce((s,x)=>s+x[0],0)/pairs.length,my=pairs.reduce((s,x)=>s+x[1],0)/pairs.length,den=pairs.reduce((s,x)=>s+(x[0]-mx)**2,0),raw=den?pairs.reduce((s,x)=>s+(x[0]-mx)*(x[1]-my),0)/den:0,phi=Math.max(-.98,Math.min(.98,raw));
 return {phi,intercept:my-phi*mx,pairs:pairs.length,window:60};
}
export function predictAR1(history,horizon){const fit=fitAR1(history);if(!fit)return null;let point=history.at(-1).value;for(let j=0;j<horizon;j++)point=fit.intercept+fit.phi*point;return {point,fit};}
function radius(errors){if(errors.length<24)return null;const x=errors.slice(-36).map(x=>Math.abs(x.error)).sort((a,b)=>a-b);return x[Math.min(x.length-1,Math.ceil((x.length+1)*.8)-1)];}
export function forecastSuite(metric,now=new Date()){
 const history=sequence(metric),last=history.at(-1),fail=reason=>({available:false,reason,protocol:'ar1-60-v1'});
 if(!last||last.period!==metric?.period||last.value!==metric?.value)return fail('mismatch');
 const current=new Date(+now+7*3600000).toISOString().slice(0,7);if(last.period>current)return fail('future');if(mi(current)-mi(last.period)>1)return fail('expired');
 if(history.length<37)return fail('short');
 const gaps=history.slice(1).flatMap((x,i)=>mi(x.period)-mi(history[i].period)>1?[{after:history[i].period,before:x.period,missing:mi(x.period)-mi(history[i].period)-1}]:[]);
 const horizons=[1,3,6].map(horizon=>{
  const errors=[];for(let i=35;i<history.length-horizon;i++){
   if(mi(history[i+horizon].period)-mi(history[i].period)!==horizon)continue;
   const train=history.slice(0,i+1),prediction=predictAR1(train,horizon);if(!prediction)continue;
   const known=errors.filter(x=>x.period<=history[i].period),r=radius(known),actual=history[i+horizon].value,baseline=history[i].value,tail=train.slice(-3).map(x=>x.value).sort((a,b)=>a-b),median=tail[1];
   errors.push({basePeriod:history[i].period,period:history[i+horizon].period,point:prediction.point,actual,error:actual-prediction.point,naiveError:actual-baseline,medianError:actual-median,band:r===null?null:{low:prediction.point-r,high:prediction.point+r}});
  }
  const prediction=predictAR1(history,horizon),r=radius(errors),bands=errors.filter(x=>x.band),mae=key=>errors.length?errors.reduce((s,x)=>s+Math.abs(x[key]),0)/errors.length:null,modelMAE=mae('error'),naiveMAE=mae('naiveError');
  return {months:horizon,target:period(mi(last.period)+horizon),point:prediction?.point??null,fit:prediction?.fit??null,tests:errors.length,mae:modelMAE,naiveMAE,medianMAE:mae('medianError'),rmse:errors.length?Math.sqrt(errors.reduce((s,x)=>s+x.error*x.error,0)/errors.length):null,skill:naiveMAE>0?1-modelMAE/naiveMAE:null,band80:r===null||!prediction?null:{low:prediction.point-r,high:prediction.point+r,calibration:Math.min(36,errors.length)},coverage:bands.length?bands.filter(x=>x.actual>=x.band.low&&x.actual<=x.band.high).length/bands.length:null,coverageTests:bands.length,errors};
 });
 return {available:horizons.every(x=>finite(x.point)),protocol:'ar1-60-v1',basePeriod:last.period,historyCount:history.length,gaps,horizons,historySources:metric.historySources||[],sourceStatus:metric.status};
}
