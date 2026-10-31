import {readFile,writeFile,mkdir,appendFile,rename} from 'node:fs/promises';
import {collect} from '../lib/collect.mjs';import {inflationForecast,forecastLedger,forecastSuite,suiteLedger} from '../lib/forecast.mjs';import {validateSnapshot} from '../lib/validate.mjs';import {admitSnapshot} from '../lib/admission.mjs';import {contentFingerprint} from '../lib/integrity.mjs';import {changeLog,fiscalHistory} from '../lib/change-log.mjs';import {monitoringReport} from '../public/data-health.js';
const base=new URL('../public/data/',import.meta.url),path=new URL('snapshot.json',base);let prior={};try{prior=JSON.parse(await readFile(path,'utf8'));}catch{}
const selector=process.argv.find(x=>x.startsWith('--sources=')),sourceIds=selector?selector.slice(10).split(',').filter(Boolean):null;if(sourceIds?.some(x=>!/^[-a-z]+$/.test(x)))throw Error('Invalid source selector');
const startedAt=new Date().toISOString();let result,failed=false;
try{result=admitSnapshot(prior,await collect(prior,{extended:true,sourceIds}));const errors=validateSnapshot(result);if(errors.length)throw Error('Snapshot validation failed');}catch{result={...prior,checks:[{id:'pipeline',status:'error',checkedAt:new Date().toISOString(),error:'Koleksi/validasi gagal; snapshot valid terakhir dipertahankan'}]};failed=true;}
const checks=[...(result.checks||[]),...(result.extendedChecks||[])],finishedAt=new Date().toISOString(),hasSuccess=checks.some(x=>x.status==='ok'&&x.checkedAt>=startedAt);
failed=failed||!hasSuccess;
result.pipeline={environment:process.env.GITHUB_ACTIONS==='true'?'github-actions':'local-verification',runId:process.env.GITHUB_RUN_ID?`${process.env.GITHUB_RUN_ID}-${process.env.GITHUB_RUN_ATTEMPT||1}`:startedAt,scope:sourceIds?'selected-sources':'all-sources',sourceIds,status:failed?'failed':checks.some(x=>x.status!=='ok')||result.rejections?.length?'partial':'ok',startedAt,finishedAt};
result.snapshotId=contentFingerprint(result);result.dataChangedAt=result.snapshotId!==prior.snapshotId?finishedAt:prior.dataChangedAt||finishedAt;result.changeLog=changeLog(prior,result,finishedAt);result.fiscalHistory=fiscalHistory(prior,result.fiscal);
result.forecast=inflationForecast(result.metrics?.find(x=>x.id==='inflation'),new Date(finishedAt));result.forecastArchive=forecastLedger(prior.forecastArchive,result.forecast,result.metrics?.find(x=>x.id==='inflation'),finishedAt,result.pipeline.environment);
result.forecastSuite=forecastSuite(result.metrics?.find(x=>x.id==='inflation'),new Date(finishedAt));result.forecastArchive=suiteLedger(result.forecastArchive,result.forecastSuite,result.metrics?.find(x=>x.id==='inflation'),finishedAt,result.pipeline.environment);
const report=monitoringReport(result,finishedAt);await mkdir(base,{recursive:true});
const atomic=async(name,value)=>{const dest=new URL(name,base),temp=new URL(name+'.tmp',base);await writeFile(temp,JSON.stringify(value,null,2)+'\n');await rename(temp,dest);};
// Write only validated data. A failed run still records operational evidence without inventing observations.
if(validateSnapshot(result).length===0)await atomic('snapshot.json',result);
await atomic('health.json',report);
let runs=[];try{runs=JSON.parse(await readFile(new URL('runs.json',base),'utf8'));}catch{}
await atomic('runs.json',[{...result.pipeline,snapshotId:result.snapshotId,succeeded:checks.filter(x=>x.status==='ok').length,failed:checks.filter(x=>x.status!=='ok').length,rejected:result.rejections?.length||0},...runs].slice(0,120));
console.log(JSON.stringify({pipeline:result.pipeline,snapshotId:result.snapshotId,checks,rejections:result.rejections||[]},null,2));
if(process.env.GITHUB_STEP_SUMMARY){const esc=s=>String(s).replace(/[|\r\n]/g,' ');await appendFile(process.env.GITHUB_STEP_SUMMARY,`## Nadi — ${result.pipeline.status}\n\nRun: ${esc(result.pipeline.runId)} · Snapshot: ${result.snapshotId}\n\n| Sumber | Status | Keterangan |\n|---|---|---|\n`+checks.map(x=>`| ${esc(x.id)} | ${esc(x.status)} | ${esc(x.error||'Periode asli tetap dicatat')} |`).join('\n')+`\n\nData ditolak: ${result.rejections?.length||0}. Pengambilan berhasil tidak membuktikan ada rilis baru.\n`);}
if(failed)process.exitCode=1;
