import {readFile} from 'node:fs/promises';
import {collect} from '../lib/collect.mjs';
let last=null,flight=null,expires=0;
async function baseline(){try{return JSON.parse(await readFile(new URL('../public/data/snapshot.json',import.meta.url),'utf8'));}catch{return {};}}
export async function getSnapshot(){
 if(last&&Date.now()<expires)return last;
 if(flight)return flight;
 flight=(async()=>{last=await collect(last||await baseline());expires=Date.now()+15*60*1000;return last;})();
 try{return await flight;}finally{flight=null;}
}
export default async function handler(req,res){
 if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'Metode tidak didukung'});}
 try{const data=await getSnapshot();res.setHeader('Cache-Control','public, max-age=0, s-maxage=900, stale-while-revalidate=60');return res.status(200).json(data);}
 catch{res.setHeader('Cache-Control','no-store');return res.status(503).json({error:'Layanan sementara tidak tersedia; gunakan snapshot cadangan dengan tanggal aslinya.'});}
}
