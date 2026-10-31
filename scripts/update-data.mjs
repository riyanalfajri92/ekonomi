import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {collect} from '../lib/collect.mjs';
const path=new URL('../public/data/snapshot.json',import.meta.url);
let prior={};try{prior=JSON.parse(await readFile(path,'utf8'));}catch{}
const result=await collect(prior,{extended:true});
if(!result.checks.some(c=>c.status==='ok')){console.error('Semua sumber gagal. Snapshot lama tidak ditimpa.');process.exitCode=1;}
else{await mkdir(new URL('../public/data/',import.meta.url),{recursive:true});await writeFile(path,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({snapshotId:result.snapshotId,checkedAt:result.checkedAt,metrics:result.metrics.filter(m=>m.value!==null).length,checks:result.checks},null,2));}
