import fs from 'fs';
let t=fs.readFileSync('template.html','utf8');
const css=`
/* ===== FORMAL OVERRIDES ===== */
:root{--ink:#1C2430;--navy:#1F3A5F;--navy-soft:#EEF2F7;--paper:#FFFFFF;--canvas:#F5F6F8;--rule:#DADFE6;--sub:#5B6573;--faint:#8A93A0}
body{background:var(--canvas);color:var(--ink)}
:focus-visible{outline-color:var(--navy)}
nav{border-bottom:1px solid var(--rule)}
.nav-meta{color:var(--faint);letter-spacing:.08em}
.hero{padding:44px 0 28px}
.kicker{color:var(--faint);letter-spacing:.2em;margin-bottom:14px}
.hero h1{font-family:'Source Serif 4',Georgia,'Times New Roman',serif;font-weight:600;font-size:clamp(32px,3.6vw,44px);letter-spacing:-.5px;line-height:1.15}
.hero h1 .or{color:var(--ink)}
.hero-desc{font-size:15px;color:var(--sub);margin-top:14px}
.hero-grid{border-top:2px solid var(--ink);padding-top:22px;align-items:start}
.fact{border-color:var(--rule)}.fact:first-child{border-top:0}
.fact .l{color:var(--sub)}
.filters{border-color:var(--rule)}
.f label,.lock-l{color:var(--sub)}
input[type=search],input[type=date],select{border-color:var(--rule);background:var(--paper);border-radius:2px}
input[type=search]:focus,select:focus,input[type=date]:focus{border-color:var(--navy)}
.btn{border-radius:2px;border-color:var(--rule);letter-spacing:.06em}
.btn:hover{border-color:var(--navy);color:var(--navy)}
.btn.solid{background:var(--navy);border-color:var(--navy)}
.btn.solid:hover{background:#16304F;color:#fff}
.chip{border-radius:2px;border-color:var(--rule);color:var(--sub)}
.chip:hover{border-color:var(--navy);color:var(--navy)}
.chip[aria-pressed=true]{background:var(--navy);border-color:var(--navy)}
.custom input{border-radius:2px}
.stat-row{border-color:var(--rule);background:var(--rule);border-radius:2px}
.stat-cell::before{display:none}
.stat-cell{padding:22px 24px}
.stat-cell .stat-n,.stat-cell:nth-child(n) .stat-n{color:var(--ink);font-family:'Source Serif 4',Georgia,serif;font-weight:600;letter-spacing:-.5px;font-size:clamp(26px,2.8vw,34px)}
.stat-l{color:var(--sub);order:-1}
.stat-cell{display:flex;flex-direction:column;gap:6px}
.stat-n{margin-bottom:0}
.stat-h{color:var(--faint);margin-top:0}
.panel{border-color:var(--rule);border-radius:2px}
.panel-h h2{font-family:'Source Serif 4',Georgia,serif;font-weight:600;font-size:20px;letter-spacing:0}
.panel-h h2 .or{color:var(--ink)}
.seg{border-radius:2px;border-color:var(--rule)}
.seg button[aria-pressed=true]{background:var(--navy)}
.bar{fill:var(--navy)}.bar:hover{fill:#2C5283}.bar.dim{fill:#E3E7EC}
.grid{stroke:var(--rule)}
.tabs{border-color:var(--rule)}
.tab[aria-selected=true]{border-bottom-color:var(--navy);color:var(--ink)}
.tab .n{color:var(--faint)}
th{background:#F8F9FB;color:var(--sub);border-color:var(--rule)}
th .ar{color:var(--navy)}
td{border-color:#E8EBEF}
.row:hover td{background:#F8F9FB}
.row.open td{background:var(--navy-soft)}
.ono{font-weight:700;color:var(--navy)}
.store{font-weight:600}
.detail td{background:#FAFBFC}
.det{border-left:3px solid var(--navy)}
.det h3{color:var(--navy)}
.note{border-left-color:var(--navy)}
.link{font-weight:600}.link:hover{color:var(--navy);text-decoration:underline}
.meter{border-radius:0;background:#EDF0F3}.meter i{background:var(--navy);border-radius:0}
.more{border-color:var(--rule)}
footer{background:var(--ink)}
footer p{color:rgba(255,255,255,.65)}
.lock{background:var(--canvas)}
.lock-card{border-color:var(--rule);border-radius:2px}
.lock-card::before{background:var(--navy)}
.lock-card h2{font-family:'Source Serif 4',Georgia,serif;font-weight:600;letter-spacing:-.3px}
.lock-card h2 .or{color:var(--ink)}
.lock-card input[type=password]{border-radius:2px;background:var(--paper)}
.lock-card input[type=password]:focus{border-color:var(--navy)}
.rem input{accent-color:var(--navy)}
`;
t=t.replace('</style>',css+'</style>')
 .replace('family=Inter:wght@400;500;600;700;800;900','family=Inter:wght@400;500;600;700;800;900&family=Source+Serif+4:opsz,wght@8..60,600')
 .replace('<span class="kicker">Order report · popeyes-marketing.com</span>','<span class="kicker">Popeyes UK · Marketing Materials</span>')
 .replace('<h1>Every store order, <span class="or">in one place.</span></h1>','<h1>Store Order Report</h1>')
 .replace('<p class="hero-desc">All marketing, POS and training material orders placed by UK restaurants. Filter by date, store or product, and click any order to see exactly what was ordered.</p>','<p class="hero-desc">Orders for marketing, point-of-sale and training materials placed by UK restaurants through popeyes-marketing.com. Use the filters to narrow by period, store or product; select an order to view its full contents.</p>')
 .replace("'Spend <span class=\"or\">by month</span>':'Orders <span class=\"or\">by month</span>'","'Monthly spend':'Monthly orders'")
 .replace('Enter the password to <span class="or">view orders.</span>','Store Order Report')
 .replace('<span class="kicker">Order report · Confidential</span>','<span class="kicker">Confidential · Authorised access only</span>');
fs.writeFileSync('template-formal.html',t);
