const finite=Number.isFinite;
const median=a=>[...a].sort((a,b)=>a-b)[Math.floor(a.length/2)];
export function monthlyProjection(metric,now=new Date()){
 const fail=reason=>({available:false,reason});
 if(!metric||!finite(metric.value))return fail('missing');
 const series=[...new Map((metric.history||[]).filter(p=>/^\d{4}-\d{2}$/.test(p.period)&&finite(p.value)).map(p=>[p.period,p])).values()].sort((a,b)=>a.period.localeCompare(b.period));
 if(series.length<8)return fail('short');
 for(let i=1;i<series.length;i++){const ix=p=>Number(p.slice(0,4))*12+Number(p.slice(5));if(ix(series[i].period)-ix(series[i-1].period)!==1)return fail('gap');}
 const last=series.at(-1);if(last.period>new Date(now.getTime()+7*3600000).toISOString().slice(0,7))return fail('future');if(last.period!==metric.period||last.value!==metric.value)return fail('mismatch');
 const target=new Date(last.period+'-01T00:00:00Z');target.setUTCMonth(target.getUTCMonth()+1);const horizon=target.toISOString().slice(0,7);
 if(horizon<new Date(now.getTime()+7*3600000).toISOString().slice(0,7))return fail('expired');
 const errors=[];for(let i=5;i<series.length;i++){const p=median(series.slice(i-3,i).map(x=>x.value));errors.push({period:series[i].period,actual:series[i].value,predicted:p,error:series[i].value-p,naiveError:series[i].value-series[i-1].value});}
 const mae=key=>errors.reduce((a,e)=>a+Math.abs(e[key]),0)/errors.length;
 return {available:true,point:median(series.slice(-3).map(p=>p.value)),base:last.value,basePeriod:last.period,horizon,mae:mae('error'),naiveMAE:mae('naiveError'),tests:errors.length,errors,history:series,weak:errors.length<12,sourceStatus:metric.status};
}
export function prospectModel(data,now=new Date()){
 const get=id=>data?.metrics?.find(x=>x.id===id),inf=get('inflation'),fx=get('jisdor'),f=data?.fiscal,rate=get('rate'),pmi=get('manufacturing');
 const hist=[...(fx?.history||[])].filter(p=>finite(p.value)&&p.value>0&&/^\d{4}-\d{2}-\d{2}$/.test(p.period)).sort((a,b)=>a.period.localeCompare(b.period));
 const prior=hist.length>5?hist.at(-6):hist[0],age=fx?.period?(now-new Date(fx.period+'T00:00:00Z'))/864e5:Infinity;
 const currency=fx&&finite(fx.value)&&age<=14&&age>=-1?{value:fx.value,period:fx.period,previous:prior,change:prior?100*(fx.value/prior.value-1):null,intervals:Math.min(5,hist.length-1),metric:fx}:null;
 const fiscal=f&&finite(f.revenue)&&f.revenue>0&&finite(f.spending)&&finite(f.balance)&&Math.abs(f.revenue-f.spending-f.balance)<.2?{...f,interest:finite(f.primary)?f.primary-f.balance:null,interestShare:finite(f.primary)?100*(f.primary-f.balance)/f.revenue:null,execution:Object.entries(f.comparisons||{}).flatMap(([id,x])=>{const month=Number(f.period?.slice(5,7));if(!finite(x.budget)||!finite(x.value)||month<1||month>=12)return [];return [{id,...x,remaining:x.budget-x.value,monthlyNeeded:(x.budget-x.value)/(12-month),monthlySoFar:x.value/month,progress:100*x.value/x.budget,samePeriodGrowth:x.previous>0?100*(x.value/x.previous-1):null}];})}:null;
 return {inflation:inf,projection:monthlyProjection(inf,now),currency,fiscal,rate,pmi,market:data?.bondMarket,jobs:data?.social?.find(x=>x.id==='bpsJobs'),poverty:data?.social?.find(x=>x.id==='bpsPoverty')};
}
export function payment(principal,annual,months){if(principal===0)return 0;const r=annual/1200;return r===0?principal/months:principal*r/(1-(1+r)**-months);}
export function householdImpact(v,annualInflation){
 if(Object.values(v).some(x=>!finite(x)))throw Error('input');
 if(v.income<=0||v.cost<0||v.reserves<0||v.principal<0||v.months<1||!Number.isInteger(v.months)||v.months>600||v.loanRate<0||v.loanRate>100||v.rateShock<0||v.rateShock>20||v.incomeGrowth<=-100||v.incomeGrowth>100||v.incomeShock<0||v.incomeShock>100||v.inflationShock<0||v.inflationShock>30||v.dollars<0||v.duration<0||v.duration>30||v.bondAmount<0||v.fxShock<0||v.fxShock>100||v.yieldShock<0||v.yieldShock>20||!finite(annualInflation)||annualInflation<=-100)throw Error('input');
 const debt=payment(v.principal,v.loanRate,v.months),stressedDebt=payment(v.principal,v.loanRate+v.rateShock,v.months),futureIncome=v.income*(1+v.incomeGrowth/100),futureCost=v.cost*(1+annualInflation/100),stressIncome=futureIncome*(1-v.incomeShock/100),stressCost=v.cost*(1+(annualInflation+v.inflationShock)/100),gap=stressCost+stressedDebt-stressIncome;
 return {debt,stressedDebt,extraDebt:stressedDebt-debt,currentFree:v.income-v.cost-debt,futureIncome,futureCost,futureFree:futureIncome-futureCost-debt,realIncome:100*((1+v.incomeGrowth/100)/(1+annualInflation/100)-1),stressIncome,stressCost,stressFree:-gap,runway:gap>0?v.reserves/gap:null,reserveMonths:(v.cost+debt)>0?v.reserves/(v.cost+debt):null,fxExtraFactor:v.dollars*v.fxShock/100,bondChange:-v.bondAmount*v.duration*v.yieldShock/100};
}
