import {readFile} from 'node:fs/promises';
import {validateSnapshot} from '../lib/validate.mjs';
let snapshot=null;
export async function getSnapshot(){
 if(!snapshot){const data=JSON.parse(await readFile(new URL('../public/data/snapshot.json',import.meta.url),'utf8'));const errors=validateSnapshot(data);if(errors.length)throw Error('Snapshot tidak lolos validasi');snapshot=data;}
 // Visitor requests never scrape sources or change the successful-retrieval timestamp.
 return snapshot;
}
export default async function handler(req,res){
 if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'Metode tidak didukung'});}
 try{const data=await getSnapshot();res.setHeader('Cache-Control','public, max-age=0, s-maxage=60, stale-while-revalidate=30');res.setHeader('X-Nadi-Snapshot',data.snapshotId);return res.status(200).json({...data,servedAt:new Date().toISOString()});}
 catch{res.setHeader('Cache-Control','no-store');return res.status(503).json({error:'Snapshot tidak tersedia; gunakan cadangan dengan tanggal aslinya.'});}
}
