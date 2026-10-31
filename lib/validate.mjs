function periodTime(period){
 if(!/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/.test(period||''))return NaN;
 const full=period.length===4?period+'-01-01':period.length===7?period+'-01':period,time=Date.parse(full);
 return Number.isFinite(time)&&new Date(time).toISOString().slice(0,10)===full?time:NaN;
}
export function validateSnapshot(s,now=new Date()){
 const errors=[];if(s.schemaVersion!==1||!Array.isArray(s.metrics))return ['Schema snapshot tidak dikenal'];
 for(const r of [...s.metrics,...(s.social||[]),...(s.structural||[]),...(s.drivers||[])]){
  if(r.value==null)continue;
  if(!Number.isFinite(r.value))errors.push('Nilai bukan angka: '+r.id);
  const limits={jisdor:[1,1e6],inflation:[-99,100],rate:[0,100],bpsGrowth:[-100,100],bpsJobs:[0,100],bpsPoverty:[0,100],bpsWage:[0,1000]},bounds=limits[r.id];if(bounds&&(r.value<bounds[0]||r.value>bounds[1]))errors.push('Nilai di luar batas: '+r.id);
  if(!Number.isFinite(periodTime(r.period)))errors.push('Periode tidak valid: '+r.id);
  else if(periodTime(r.period)>now.getTime())errors.push('Periode masa depan: '+r.id);
  const seen=new Map();for(const p of r.history||[]){if(!Number.isFinite(p.value)||!Number.isFinite(periodTime(p.period))||periodTime(p.period)>+now||bounds&&(p.value<bounds[0]||p.value>bounds[1]))errors.push('Histori tidak valid: '+r.id);if(seen.has(p.period)&&seen.get(p.period)!==p.value)errors.push('Histori berkonflik: '+r.id);seen.set(p.period,p.value);}
 }
 for(const r of s.bankHealth||[]){if(!Number.isFinite(periodTime(r.period))||periodTime(r.period)>+now)errors.push('Periode laporan bank tidak valid: '+r.id);for(const [key,m]of Object.entries(r.metrics||{}))if(!Number.isFinite(m.value)||m.value<0||m.value>10000)errors.push('Rasio bank invalid: '+r.id+'/'+key);}
 if(s.fiscal?.period){const f=s.fiscal;if(!Number.isFinite(periodTime(f.period))||periodTime(f.period)>+now)errors.push('Periode fiskal tidak valid');if(![f.revenue,f.spending,f.balance].every(Number.isFinite)||Math.abs(f.revenue-f.spending-f.balance)>.2)errors.push('Rekonsiliasi fiskal gagal');}
 for(const r of s.deposits||[])for(const tier of r.tiers||[])for(const [term,value] of Object.entries(tier.rates||{}))if(!Number.isFinite(value)||value<0||value>100||Number(term)<1||Number(term)>120)errors.push('Tarif deposito invalid: '+r.id);
 if(s.bondMarket){const r=s.bondMarket;if(!Number.isFinite(periodTime(r.period))||periodTime(r.period)>+now||r.points?.length!==3||new Set(r.points?.map(x=>x.tenor)).size!==3||r.points?.some(x=>![2,5,10].includes(x.tenor)||!Number.isFinite(x.yield)||x.yield<0||x.yield>100))errors.push('Kurva obligasi invalid');}
 for(const r of s.bondQuotes?.rows||[])if(!Number.isFinite(r.ask)||!Number.isFinite(r.bid)||r.ask<r.bid||r.bid<=0||!Number.isFinite(periodTime(r.period))||periodTime(r.period)>+now||!Number.isFinite(periodTime(r.maturity))||periodTime(r.maturity)<=periodTime(r.period)||!Number.isFinite(r.coupon)||r.coupon<0||r.coupon>100)errors.push('Harga obligasi silang/invalid: '+r.id);
 return [...new Set(errors)];
}
