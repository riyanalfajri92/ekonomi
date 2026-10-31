import http from 'node:http';import {readFile} from 'node:fs/promises';import {resolve,extname} from 'node:path';import {fileURLToPath} from 'node:url';import handler from '../api/economy.js';
const root=fileURLToPath(new URL('../public/',import.meta.url));
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8'};
const portArg=process.argv.indexOf('--port');
const port=Number(portArg>=0?process.argv[portArg+1]:process.env.PORT)||3000;
http.createServer(async(req,res)=>{try{const u=new URL(req.url,'http://localhost');if(u.pathname==='/api/economy'){res.status=c=>{res.statusCode=c;return res};res.json=d=>res.end(JSON.stringify(d));await handler(req,res);return;}const path=resolve(root,'.'+decodeURIComponent(u.pathname==='/'?'/index.html':u.pathname));if(!path.startsWith(root)){res.writeHead(403);res.end();return;}const body=await readFile(path);res.setHeader('Content-Type',types[extname(path)]||'application/octet-stream');res.end(body);}catch{res.writeHead(404);res.end('Tidak ditemukan');}}).listen(port,'0.0.0.0',()=>console.log('Local preview: http://localhost:'+port));
