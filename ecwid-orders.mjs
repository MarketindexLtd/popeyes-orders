import fs from 'fs';
const token = fs.readFileSync('C:/Users/Admin/.marketindex-ecwid-token','utf8').trim();
const base = 'https://app.ecwid.com/api/v3/100929014/orders';
let all=[], offset=0, total=0;
do {
  const r = await fetch(`${base}?offset=${offset}&limit=100`, {headers:{Authorization:`Bearer ${token}`}});
  if(!r.ok){console.error(r.status, await r.text()); process.exit(1);}
  const j = await r.json(); total=j.total; all.push(...j.items); offset+=j.count;
  if(!j.count) break;
} while(offset<total);
fs.writeFileSync('ecwid-orders.json', JSON.stringify(all,null,1));
const esc=v=>`"${String(v??'').replace(/"/g,'""')}"`;
const rows=[['Order','Date','Customer','Email','Store/Company','Payment status','Fulfilment status','Items','Subtotal','Shipping','Tax','Total']];
for(const o of all){
  const sp=o.shippingPerson||o.billingPerson||{};
  rows.push([o.id,o.createDate,sp.name,o.email,sp.companyName,o.paymentStatus,o.fulfillmentStatus,
    (o.items||[]).map(i=>`${i.quantity}x ${i.name}`).join('; '),o.subtotal,o.shippingOption?.shippingRate,o.tax,o.total]);
}
fs.writeFileSync('ecwid-orders.csv', rows.map(r=>r.map(esc).join(',')).join('\n'));
console.log('total',total,'fetched',all.length);
const dates=all.map(o=>o.createDate).sort(); console.log('range',dates[0],'->',dates.at(-1));
const sum=all.reduce((a,o)=>a+(o.total||0),0); console.log('sum total',sum.toFixed(2));
const byStatus={}; all.forEach(o=>byStatus[o.fulfillmentStatus]=(byStatus[o.fulfillmentStatus]||0)+1); console.log(byStatus);
