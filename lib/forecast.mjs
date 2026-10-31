import {forecastSuite} from '../public/forecast-engine.js';
import {monthlyProjection} from '../public/prospect-model.js';
// One implementation for the collector and the UI; fixed median3, never selected on its own test results.
export function inflationForecast(metric,now=new Date()){
 const p=monthlyProjection(metric,now);if(!p.available)return {status:'unavailable',reason:p.reason,asOf:now.toISOString()};
 return {...p,status:'experimental',method:'median3',testCount:p.tests,trainCount:p.history.length,unit:'poin persentase',asOf:now.toISOString(),note:'Median tiga observasi ditetapkan sebelum evaluasi. Uji bergulir memakai data revisi terkini, bukan vintage. Sampel kecil dan galat historis bukan interval probabilitas.'};
}
export function forecastLedger(prior,forecast,metric,stamp,origin='unspecified'){
 const rows=[...(prior||[])];if(forecast?.status==='experimental'&&!rows.some(x=>x.model==='median3-v1'&&x.basePeriod===forecast.basePeriod))rows.unshift({model:'median3-v1',basePeriod:forecast.basePeriod,horizon:forecast.horizon,point:forecast.point,issuedAt:stamp,origin});
 return rows.map(row=>{const actual=metric?.history?.find(x=>x.period===row.horizon);if(!actual)return row;return {...row,actual:row.actual??actual.value,firstEvaluatedAt:row.firstEvaluatedAt??stamp,error:(row.actual??actual.value)-row.point,latestRevisedActual:actual.value};}).slice(0,120);
}

export {forecastSuite};
export function suiteLedger(prior,suite,metric,stamp,origin='unspecified'){
 const rows=[...(prior||[])];if(suite?.available)for(const h of suite.horizons)if(!rows.some(x=>x.model===suite.protocol&&x.basePeriod===suite.basePeriod&&x.horizon===h.target))rows.unshift({model:suite.protocol,basePeriod:suite.basePeriod,horizon:h.target,horizonMonths:h.months,point:h.point,band80:h.band80,issuedAt:stamp,origin});
 return rows.map(row=>{const actual=metric?.history?.find(x=>x.period===row.horizon);if(!actual)return row;return {...row,actual:row.actual??actual.value,firstEvaluatedAt:row.firstEvaluatedAt??stamp,error:(row.actual??actual.value)-row.point,latestRevisedActual:actual.value};}).slice(0,180);
}
