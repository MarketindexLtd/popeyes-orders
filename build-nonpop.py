# Usage: python -I build-nonpop.py "Popeyes .xlsx"  -> nonpop-data.json
# Sheet layout (no header): A account, B description ("Popeyes <store> - Ordered by <name>"),
# C price of the item named in B (0 if none), then item/price pairs. Prices are line totals ex VAT.
import openpyxl,re,json,sys
FIX={'Notthingam':'Nottingham','Gatehead':'Gateshead','Rotheram':'Rotherham','Dartfort':'Dartford','Picadilly':'Piccadilly','Revew':'Review'}
def fix(s):
  for a,b in FIX.items(): s=re.sub(r'\b'+a+r'\b',b,s)
  return re.sub(r'\s+',' ',s).strip()
def item(name,price):
  name=fix(str(name))
  m=re.match(r'^(.*?)\s+x\s*(\d+)$',name,re.I)
  q,n=(int(m.group(2)),m.group(1).strip()) if m else (1,name)
  return [n,q,None if price is None else round(float(price),2)]
out=[]
wb=openpyxl.load_workbook(sys.argv[1] if len(sys.argv)>1 else 'Popeyes .xlsx',data_only=True)
for i,r in enumerate(wb.active.iter_rows(values_only=True),1):
  v=list(r)
  while v and v[-1] is None: v.pop()
  if len(v)<2 or not v[1]: continue
  d=fix(str(v[1]))
  ob=''; m=re.search(r'\s*-?\s*Ordered by\s+(.+)$',d,re.I)
  if m: ob=m.group(1).strip(); head=d[:m.start()].strip(' -')
  else: head=d
  kind='Order'
  m=re.match(r'^(Print|Training) Pack for\s+(.*)$',head,re.I)
  if m: kind=m.group(1).title()+' pack'; rest=m.group(2)
  else: rest=re.sub(r'^Popeyes\s+','',head)
  parts=[p.strip() for p in re.split(r'\s+-\s+|-\s+',rest,maxsplit=1)]
  store=parts[0]; extra=parts[1] if len(parts)>1 else ''
  lines=[];carrier=0;miss=False
  if isinstance(v[2],(int,float)) and v[2]>0 and extra: lines.append(item(extra,v[2])); extra=''
  for k in range(3,len(v),2):
    nm=v[k]; pr=v[k+1] if k+1<len(v) else None
    if nm is None: continue
    if re.fullmatch(r'\s*carrier\s*',str(nm),re.I):
      if pr is None: miss=True
      else: carrier+=pr
      continue
    it=item(nm,pr); miss|=pr is None; lines.append(it)
  goods=round(sum(l[2] or 0 for l in lines),2)
  out.append({'r':i,'s':store,'k':kind,'ob':ob,'x':extra,'ds':d,'l':lines,'g':goods,'c':round(carrier,2),'tot':round(goods+carrier,2),'m':1 if miss else 0})
json.dump(out,open('nonpop-data.json','w'),separators=(',',':'))
print(len(out),'orders | total',round(sum(o['tot'] for o in out),2),'| stores',len({o['s'] for o in out}),'| incomplete',[o['r'] for o in out if o['m']])
for o in out: print(o['r'],'|',o['s'],'|',o['k'],'|',o['ob'],'|',o['x'],'|',len(o['l']),o['g'],o['c'])
