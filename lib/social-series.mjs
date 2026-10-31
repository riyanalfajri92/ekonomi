// Merge like-for-like observation periods. A newer release is not itself a comparator.
export function mergeSocial(row,old,stamp){
 const history=[...new Map([...(old?.history||[]),...(row.history||[]),{period:row.period,value:row.value}].filter(x=>Number.isFinite(x.value)).map(x=>[x.period,x])).values()].sort((a,b)=>b.period.localeCompare(a.period)).slice(0,60);
 const previousPeriod=`${Number(row.period.slice(0,4))-1}${row.period.slice(4)}`,previous=history.find(x=>x.period===previousPeriod);
 return {...row,history,previous:previous?.value??(old?.period===row.period?old.previous:null),previousPeriod:previous?.period??(old?.period===row.period?old.previousPeriod:null),comparison:previous?'same-period-prior-year':old?.period===row.period?old.comparison:null,comparisonUrl:row.comparisonUrl??(old?.period===row.period?old.comparisonUrl:null),fetchedAt:stamp,status:'ok'};
}
