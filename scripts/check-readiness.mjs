import {readFile} from 'node:fs/promises';import {releaseReadiness} from '../public/source-policy.js';
const data=JSON.parse(await readFile(new URL('../public/data/snapshot.json',import.meta.url),'utf8')),report=releaseReadiness(data);console.log(JSON.stringify(report,null,2));if(!report.ready&&!process.argv.includes('--report-only'))process.exitCode=1;
