import {access} from 'node:fs/promises';
await access(new URL('../public/index.html',import.meta.url));
await access(new URL('../public/app.js',import.meta.url));
await access(new URL('../public/data/snapshot.json',import.meta.url));
console.log('Aset statis siap. Vercel menjalankan /api/economy sebagai fungsi Node.js.');
