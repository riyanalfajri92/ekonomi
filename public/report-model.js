import {economyModel,commonPeriodPair,observationTrend} from './analysis-model.js';
import {freshness,pipelineHealth} from './source-policy.js';
import {fiscalExecutionModel} from './fiscal-reading.js';
import {prospectModel} from './prospect-model.js';
const finite=Number.isFinite;
export function dependencyState(rows,now=new Date()){
 if(!rows.length||rows.some(x=>!x||(!finite(x.value)&&!finite(x.revenue)&&!x.points?.length)))return 'missing';
 if(rows.some(x=>freshness(x,x.policyKey||x.id,now).aged))return 'historical';
 if(rows.some(x=>x.status!=='ok'||freshness(x,x.policyKey||x.id,now).unchecked))return 'limited';
 return 'supported';
}
export function commonYear(rows,ids){
 const selected=ids.map(id=>rows?.find(x=>x.id===id));if(selected.some(x=>!x))return null;
 const histories=selected.map(r=>[...(r.history||[]),...(finite(r.value)?[{period:r.period,value:r.value}]:[])].filter(x=>/^\d{4}$/.test(x.period)&&finite(x.value)));
 const periods=[...new Set(histories[0].map(x=>x.period))].filter(p=>histories.every(h=>h.some(x=>x.period===p))).sort().reverse();
 if(!periods.length)return null;const period=periods[0];return {period,rows:selected.map((r,i)=>({...r,...histories[i].find(x=>x.period===period)}))};
}
export function reportModel(data={},now=new Date()){
 data??={};const economy=economyModel(data),metric=id=>data.metrics?.find(x=>x.id===id),driver=id=>data.drivers?.find(x=>x.id===id),struct=id=>data.structural?.find(x=>x.id===id);
 const matchedInflation=economy.realWage?{...economy.inflation,period:economy.realWage.period,value:economy.realWage.inflation,policyKey:'bpsWage'}:null;
 const demand=commonYear([...(data.drivers||[]),...(data.metrics||[])],['gdp','household','investment','government','exports','imports']);
 const sectors=commonYear(data.drivers,['agriculture','industry','services']);
 const consumption=commonYear(data.drivers,['household','consumptionPerCapita']);
 const states={activity:dependencyState([economy.gdp],now),purchasing:dependencyState([economy.wage,matchedInflation],now),fiscal:dependencyState([{...economy.fiscal,policyKey:'fiscal'}],now),market:dependencyState([{...data.bondMarket,policyKey:'bondMarket'}],now)};
 const fx=metric('jisdor'),h=[...(fx?.history||[])].filter(x=>finite(x.value)).sort((a,b)=>a.period.localeCompare(b.period)),previous=h.at(-2),fxChange=previous&&fx?.value>0?100*(fx.value/previous.value-1):null;
 const gini=driver('gini'),giniTrend=observationTrend(gini),fiscal=fiscalExecutionModel(economy.fiscal),p=prospectModel(data,now);
 const labour=economy.jobs?.history?.find(x=>x.period===`${Number(economy.jobs.period.slice(0,4))-1}${economy.jobs.period.slice(4)}`),jobsDelta=labour?economy.jobs.value-labour.value:economy.jobsDelta;
 return {economy,matchedInflation,metric,driver,struct,demand,sectors,consumption,states,fxChange,fxPrevious:previous,gini,giniTrend,fiscal,prospect:p,jobsDelta,water:commonPeriodPair(data.structural,'waterUrban','waterRural'),gender:commonPeriodPair(data.structural,'neetFemale','neetMale'),pipeline:pipelineHealth(data,now),news:[...(data.news||[]),...(data.agencyNews||[])].filter((x,i,a)=>a.findIndex(y=>y.url===x.url)===i).sort((a,b)=>(b.publishedAt||'').localeCompare(a.publishedAt||''))};
}
export function outlookQuestions(data,now=new Date()){
 const r=reportModel(data,now),{economy:e,prospect:p}=r,pmi=e.pmi,expectation=pmi?.officialForecast;
 const quarter=expectation?`${expectation.year}-${String(expectation.quarter*3).padStart(2,'0')}`:null,current=new Date(+now+7*3600000).toISOString().slice(0,7),futureSurvey=quarter&&quarter>=current;
 return [
 {id:'income',kind:'observation',state:r.states.purchasing,period:e.realWage?.period,value:e.realWage?.real??null,deps:[e.wage,r.matchedInflation],direction:e.realWage?Math.sign(e.realWage.real):null},
 {id:'activity',kind:futureSurvey?'survey':'observation',state:dependencyState([pmi],now),period:futureSurvey?quarter:pmi?.period,value:futureSurvey?expectation.value:pmi?.value??null,deps:[pmi],direction:(futureSurvey?expectation.value:pmi?.value)>50?1:-1},
 {id:'public',kind:'observation',state:r.states.fiscal,period:e.fiscal?.period,value:e.interestShare,deps:[e.fiscal],direction:null},
 {id:'prices',kind:'experimental',state:p.projection.available?dependencyState([e.inflation],now):'missing',period:p.projection.horizon,value:p.projection.available?p.projection.point:null,deps:[e.inflation],direction:p.projection.available?Math.sign(p.projection.point-p.projection.base):null},
 {id:'finance',kind:'sensitivity',state:r.states.market,period:data?.bondMarket?.period,value:data?.bondMarket?.points?.find(x=>x.tenor===10)?.yield??null,deps:[data?.bondMarket],direction:null}
 ];
}

export function indexFromGrowth(row,baseYear=2019){const observations=new Map((row?.history||[]).map(x=>[Number(x.period),x.value]));if(!observations.size)return null;const last=Math.max(...observations.keys());if(last<=baseYear)return null;let level=100;const history=[{period:String(baseYear),value:level}];for(let year=baseYear+1;year<=last;year++){const growth=observations.get(year);if(!Number.isFinite(growth)||growth<=-100)return null;level*=1+growth/100;history.push({period:String(year),value:level});}return {period:String(last),value:level,history,change:level-100,baseYear};}
