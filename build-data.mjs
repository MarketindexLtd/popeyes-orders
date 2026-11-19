import fs from 'fs';
const a=JSON.parse(fs.readFileSync(process.argv[2]||'ecwid-orders.json','utf8'));
const s=JSON.parse(fs.readFileSync('stores.json','utf8'));
const pc=o=>((o.shippingPerson||{}).postalCode||'').toUpperCase().replace(/\s/g,'');
const r2=n=>Math.round((n||0)*100)/100;
const out=a.filter(o=>s[pc(o)]).map(o=>{
  const p=o.shippingPerson||{};
  return {n:o.orderNumber,t:o.createTimestamp,s:s[pc(o)],c:(p.name||'').trim(),e:o.email.toLowerCase(),
    ph:p.phone||'',a:[p.street,p.city,p.postalCode].filter(Boolean).join(', ').replace(/\s+/g,' '),
    i:(o.items||[]).map(i=>[i.name.trim(),i.quantity,r2(i.price*i.quantity),
      (i.selectedOptions||[]).filter(x=>x.value&&String(x.value).trim()).map(x=>x.name+': '+String(x.value).trim()).join(' · ')]),
    sub:r2(o.subtotal),sh:r2(o.shippingOption?.shippingRate),tx:r2(o.tax),tot:r2(o.total),st:o.fulfillmentStatus,
    nt:(o.orderComments||'').trim()};
}).sort((x,y)=>y.t-x.t);
fs.writeFileSync('orders-data.json',JSON.stringify(out));
console.log(out.length, (fs.statSync('orders-data.json').size/1024).toFixed(0)+'KB', out.filter(o=>o.nt).length,'with notes');
