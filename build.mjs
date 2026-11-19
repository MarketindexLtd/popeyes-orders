// Refresh: node ecwid-orders.mjs && node build-data.mjs && node build.mjs
// Password lives in .password (gitignored). Salt is fixed in salt.txt so saved devices stay unlocked across refreshes.
import fs from 'fs';
import { webcrypto as crypto } from 'crypto';
const pass=fs.readFileSync('.password','utf8').trim();
if(!fs.existsSync('salt.txt'))fs.writeFileSync('salt.txt',Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString('base64'));
const salt=Buffer.from(fs.readFileSync('salt.txt','utf8').trim(),'base64');
const it=310000;
const base=await crypto.subtle.importKey('raw',new TextEncoder().encode(pass),'PBKDF2',false,['deriveKey']);
const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:it,hash:'SHA-256'},base,{name:'AES-GCM',length:256},false,['encrypt']);
const iv=crypto.getRandomValues(new Uint8Array(12));
const ct=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,new TextEncoder().encode(fs.readFileSync('orders-data.json','utf8')));
const b=x=>Buffer.from(x).toString('base64');
const enc=JSON.stringify({salt:b(salt),iv:b(iv),it,ct:b(ct)});
let t=fs.readFileSync(process.argv[2]||'template.html','utf8');
t=t.replace('/*ENC*/null',()=>enc).replace('/*SNAP*/',new Date().toISOString());
fs.writeFileSync(process.argv[3]||'index.html',t);
new Function(t.split('<script>')[1].split('</script>')[0]);
console.log('index.html',(t.length/1024|0)+'KB');
