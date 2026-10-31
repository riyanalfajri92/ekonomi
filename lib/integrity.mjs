import {createHash} from 'node:crypto';
// A retrieval timestamp or transient failure is not a change in the underlying observations.
export function contentFingerprint(s){return createHash('sha256').update(JSON.stringify({
 drivers:(s.drivers||[]).map(x=>[x.id,x.period,x.value,x.history]),
 structural:(s.structural||[]).map(x=>[x.id,x.period,x.value,x.history]),
 metrics:(s.metrics||[]).map(m=>[m.id,m.value,m.period,(m.history||[]).map(p=>[p.period,p.value])]),
 news:(s.news||[]).map(n=>[n.url,n.publishedAt]),publications:(s.publications||[]).map(n=>n.url),
 fiscal:s.fiscal?.period?[s.fiscal.period,s.fiscal.revenue,s.fiscal.spending,s.fiscal.balance,s.fiscal.details,s.fiscal.comparisons]:null,
 deposits:(s.deposits||[]).map(d=>[d.id,d.tiers,d.effectiveAt]),lps:s.lps?[s.lps.rate,s.lps.from,s.lps.until]:null,
 quotes:s.bondQuotes?.rows?.map(r=>[r.id,r.period,r.ask,r.bid,r.coupon,r.maturity]),
 market:s.bondMarket?[s.bondMarket.period,s.bondMarket.points]:null,
 health:(s.bankHealth||[]).map(r=>[r.id,r.period,r.scope,r.metrics]).sort((a,b)=>a[0].localeCompare(b[0])),
 social:(s.social||[]).map(r=>[r.id,r.period,r.value,r.previous,r.history]).sort((a,b)=>a[0].localeCompare(b[0])),
 agencyNews:(s.agencyNews||[]).map(n=>[n.url,n.publishedAt]).sort((a,b)=>a[0].localeCompare(b[0]))
})).digest('hex').slice(0,16);}
