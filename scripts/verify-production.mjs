// Optional end-to-end check: proves the deployed API serves this scheduled run, not just an old 200 response.
import {readFile} from 'node:fs/promises';
const input=process.env.PUBLIC_SITE_URL;if(!input){console.log('Production verification not configured: set repository variable PUBLIC_SITE_URL.');process.exit(0);}
const url=new URL('/api/health',input);if(url.protocol!=='https:'||url.username||url.password)throw Error('PUBLIC_SITE_URL must be a public HTTPS origin');
const expected=JSON.parse(await readFile(new URL('../public/data/snapshot.json',import.meta.url),'utf8'));
for(let attempt=0;attempt<18;attempt++){
 try{const response=await fetch(url,{signal:AbortSignal.timeout(8000),headers:{'Cache-Control':'no-cache'}}),data=await response.json();if(data.snapshotId===expected.snapshotId&&data.runId===expected.pipeline?.runId){console.log(JSON.stringify({verified:true,status:data.state,snapshotId:data.snapshotId,runId:data.runId}));process.exit(response.ok?0:1);}}catch{}
 await new Promise(resolve=>setTimeout(resolve,10000));
}
console.error('Production does not yet serve the expected run. Check Vercel deployment/integration.');process.exitCode=1;
