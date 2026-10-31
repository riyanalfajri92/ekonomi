// Prints configuration presence only, never secret values. Optional public probe makes no mutations.
import {readFile} from 'node:fs/promises';import {releaseReadiness} from '../public/source-policy.js';import {validateSnapshot} from '../lib/validate.mjs';
const data=JSON.parse(await readFile(new URL('../public/data/snapshot.json',import.meta.url),'utf8')),errors=validateSnapshot(data),ready=releaseReadiness(data),rows=[
 ['snapshot-valid',!errors.length,errors.join('; ')||'Valid'],
 ['bps-key-present',!!process.env.BPS_API_KEY,'BPS_API_KEY required for remaining authenticated BPS series; no value printed'],
 ['public-url-present',!!process.env.PUBLIC_SITE_URL,'PUBLIC_SITE_URL is required for end-to-end verification'],
 ['scheduled-production-proven',data.pipeline?.environment==='github-actions'&&data.pipeline?.scope==='all-sources','Local runs do not establish production'],
 ...ready.capabilities.map(x=>[x.id,x.ready,'Data capability gate; not investment certification'])];
if(process.env.PUBLIC_SITE_URL){try{const url=new URL('/api/health',process.env.PUBLIC_SITE_URL);if(url.protocol!=='https:'||url.username||url.password)throw Error();const r=await fetch(url,{signal:AbortSignal.timeout(10000)}),body=await r.json();rows.push(['production-version',body.snapshotId===data.snapshotId&&body.runId===data.pipeline?.runId,'Expected run and snapshot identities'],['production-data-health',r.ok,'Health endpoint status']);}catch{rows.push(['production-probe',false,'Cannot verify public HTTPS endpoint']);}}
console.log(JSON.stringify({checks:rows.map(([id,passed,note])=>({id,passed,note})),ready:ready.ready,blockers:ready.blockers},null,2));if(rows.some(x=>!x[1]))process.exitCode=1;
