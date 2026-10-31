const median=v=>{const a=[...v].sort((a,b)=>a-b);return a[Math.floor(a.length/2)];};
export function inflationForecast(metric){
 if(!metric||metric.status!=='ok'||!metric.history?.length)return {status:'unavailable',reason:'Memerlukan seri inflasi bulanan yang baru diperiksa dan cukup panjang.',reasonEn:'A recently checked monthly inflation series with sufficient history is required.'};
 const series=[...metric.history].filter(p=>/^\d{4}-\d{2}$/.test(p.period)).sort((a,b)=>a.period.localeCompare(b.period));
 if(series.length<8)return {status:'unavailable',reason:'Minimal delapan observasi bulanan diperlukan.',reasonEn:'At least eight monthly observations are required.'};
 for(let i=1;i<series.length;i++){const a=series[i-1].period.split('-').map(Number),b=series[i].period.split('-').map(Number);if(b[0]*12+b[1]!==a[0]*12+a[1]+1)return {status:'unavailable',reason:'Ada celah bulan pada seri.',reasonEn:'The monthly series contains a gap.'};}
 const errors=[];
 for(let i=5;i<series.length;i++){const train=series.slice(0,i),actual=series[i].value,naive=train.at(-1).value,med=median(train.slice(-3).map(p=>p.value));errors.push({period:series[i].period,actual,naive,median3:med,naiveError:Math.abs(actual-naive),medianError:Math.abs(actual-med)});}
 const mae=key=>errors.reduce((s,e)=>s+e[key],0)/errors.length;
 const naiveMAE=mae('naiveError'),medianMAE=mae('medianError'),method=medianMAE<naiveMAE?'median3':'lastValue';
 const point=method==='median3'?median(series.slice(-3).map(p=>p.value)):series.at(-1).value;
 let [year,month]=series.at(-1).period.split('-').map(Number);month++;if(month===13){year++;month=1;}
 return {status:'experimental',horizon:`${year}-${String(month).padStart(2,'0')}`,basePeriod:series.at(-1).period,point,method,mae:Math.min(naiveMAE,medianMAE),naiveMAE,medianMAE,testCount:errors.length,trainCount:series.length,errors,unit:'poin persentase',note:'Eksperimen satu bulan ke depan atas inflasi yoy. Model dipilih dari hasil uji bergulir yang sama; ini bukan evaluasi independen setelah pemilihan model. Data revisi terkini, bukan vintage waktu nyata. Galat historis bukan interval probabilitas. Tidak dipakai sebagai rekomendasi investasi.',noteEn:'An experimental one-month-ahead projection of year-on-year inflation. Selection uses the same rolling tests, so this is not independent post-selection evaluation. It uses currently revised data, not real-time vintages. Historical error is not a probability interval or investment recommendation.'};
}
