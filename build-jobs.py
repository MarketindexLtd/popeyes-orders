# Usage: python -I build-jobs.py jobs.xlsx [jobs-other.xlsx ...]  -> jobs-data.json
import openpyxl,re,json,sys,datetime as dt,collections
E=json.load(open('ecwid-orders.json'));by={o['orderNumber']:o for o in E}
jobs=[];lines=collections.defaultdict(list)
for path in (sys.argv[1:] or ['jobs.xlsx']):
  wb=openpyxl.load_workbook(path,read_only=True,data_only=True)
  H=None
  for r in wb['Jobs'].iter_rows(values_only=True):
    if H is None: H={k:i for i,k in enumerate(r)};continue
    jobs.append((dict(H),r))
  LH=None
  for r in wb['Lines'].iter_rows(values_only=True):
    if LH is None: LH={k:i for i,k in enumerate(r)};continue
    lines[r[LH['Job No']]].append([str(r[LH['Description']] or '').strip(),r[LH['Qty']] or 0,round(r[LH['Unit Price']] or 0,2),round(r[LH['Line Total']] or 0,2)])
lab=re.compile(r'\bweb?\s*order\b',re.I)
storeNum=re.compile(r'^\s*[A-Za-z][A-Za-z .\'&-]+\s+\d{2,3}\s*$')
ECWID_START=dt.datetime(2024,10,1)
def g(r,k): v=r[H[k]] if k in H else None;return '' if v is None else str(v).strip()
out=[];why=collections.Counter()
seen=set()
for H,r in jobs:
  if r[H['Job No']] in seen: continue
  seen.add(r[H['Job No']])
  note,ob,desc=g(r,'Store / Order note'),g(r,'Ordered by'),g(r,'Job description')
  total=r[H['Total']] or 0
  online=None
  if lab.search(note+' '+desc+' '+ob): online='label'
  else:
    for x in re.findall(r'(?<![\dx.])(\d{2,3})(?![\dmx.])',note+' | '+desc):
      o=by.get(int(x))
      if o and abs((o['total'] or 0)-total)<0.02: online='match';break
  if not online and r[H['Date']]>=ECWID_START and (storeNum.match(note) or storeNum.match(ob)): online='storenum'
  why[online or 'direct']+=1
  ref=''
  m=re.search(r'(?i)web?\s*order\s*#?\s*(\d+)',note+' '+desc) or (online and re.search(r'(\d{2,3})\s*$',note or ob))
  if m: ref=m.group(1)
  out.append({'j':r[H['Job No']],'d':r[H['Date']].strftime('%Y-%m-%d'),'ob':ob,'nt':note,'ds':desc,
    'g':round(r[H['Goods']] or 0,2),'c':round(r[H['Carrier']] or 0,2),'sub':round(r[H['Sub Total']] or 0,2),'tx':round(r[H['VAT']] or 0,2),'tot':round(total,2),
    'on':1 if online else 0,'ac':g(r,'Customer'),'ref':ref,'l':lines.get(r[H['Job No']],[])})
out.sort(key=lambda x:(x['d'],x['j']),reverse=True)
json.dump(out,open('jobs-data.json','w'),separators=(',',':'))
on=[x for x in out if x['on']];di=[x for x in out if not x['on']]
print(why,'| online',len(on),round(sum(x['tot'] for x in on),2),'| direct',len(di),round(sum(x['tot'] for x in di),2))
print('range',out[-1]['d'],out[0]['d'],'| no lines',sum(1 for x in out if not x['l']))
