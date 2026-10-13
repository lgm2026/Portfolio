/* ON THE HORIZON: the club's live calendar of real-life events - rides, benefits, fundraisers, meetings, key dates and
   anniversaries. It follows the shared events collection, so a new or changed event shows up on every phone right away.
   Who sees an event follows its audience (PUBLIC / MEMBERS / OFFICERS), exactly like announcements. Members also get
   every Brother-for-Life anniversary automatically. POCs (for their battalion), club officers and the club admin add,
   edit and remove events. */
(function(){
const VW=G.VW, CL=G.CL;
const pad=n=>String(n).padStart(2,'0');
const MONTHS=['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
const MON=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const DOW=['SUN','MON','TUE','WED','THU','FRI','SAT'];
const ymd=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const parse=s=>{ const [y,m,d]=String(s).split('-').map(Number); return new Date(y,m-1,d); };
const today=()=>ymd(new Date());
const dayDiff=(a,b)=>Math.round((parse(b)-parse(a))/86400000);
const leap=y=>(y%4===0&&y%100!==0)||y%400===0;
function onYear(e,y){ const p=String(e.d).split('-').map(Number); let d=p[2]; if(p[1]===2&&d===29&&!leap(y)) d=28; return y+'-'+pad(p[1])+'-'+pad(d); }
/* the dates an event falls on between from..to (inclusive) - yearly events repeat from their first date on */
function occs(e,from,to){
 if(!e.rep) return e.d>=from&&e.d<=to?[e.d]:[];
 const out=[], y0=+from.slice(0,4), y1=+to.slice(0,4), first=+String(e.d).slice(0,4);
 for(let y=Math.max(y0,first);y<=y1;y++){ const o=onYear(e,y); if(o>=from&&o<=to&&o>=e.d) out.push(o); }
 return out;
}
function nextOcc(e,from){ if(!e.rep) return e.d; const y=+from.slice(0,4); let o=onYear(e,y); if(o<from) o=onYear(e,y+1); return o<e.d?e.d:o; }
function fmtTime(tm){ if(!tm) return ''; let [h,m]=tm.split(':').map(Number); const ap=h>=12?'PM':'AM'; h=h%12||12; return h+(m?':'+pad(m):'')+' '+ap; }
function fmtDate(s,long){ const d=parse(s); return (long?DOW[d.getDay()]+', ':'')+MON[d.getMonth()]+' '+d.getDate()+(long?', '+d.getFullYear():''); }
function until(o,tm){
 const n=dayDiff(today(),o);
 if(n<0) return {t:(-n)+(n===-1?' DAY AGO':' DAYS AGO'),col:'#9a8f80'};
 if(n===0){
  if(tm){ const [h,m]=tm.split(':').map(Number), now=new Date(), mins=h*60+m-(now.getHours()*60+now.getMinutes());
   if(mins>90) return {t:'IN '+Math.round(mins/60)+' HRS',col:'#80ffa0'};
   if(mins>0) return {t:'IN '+mins+' MIN',col:'#80ffa0'};
   if(mins>-180) return {t:'HAPPENING NOW',col:'#ff8a50'}; }
  return {t:'TODAY',col:'#80ffa0'};
 }
 if(n===1) return {t:'TOMORROW',col:'#80ffa0'};
 if(n<14) return {t:'IN '+n+' DAYS',col:'#ffd060'};
 if(n<60) return {t:'IN '+Math.floor(n/7)+' WEEKS',col:'#e8dcc8'};
 return {t:'IN '+Math.round(n/30.4)+' MONTHS',col:'#b8ad9c'};
}
const titleOf=(e,o)=>{ const yrs=e.since?(+String(o).slice(0,4)-e.since):0; return e.t+(yrs>0?' • '+yrs+(yrs===1?' YEAR':' YEARS'):''); };
const byWhen=(a,b)=>a.o<b.o?-1:(a.o>b.o?1:((a.e.tm||'99')<(b.e.tm||'99')?-1:((a.e.tm||'99')>(b.e.tm||'99')?1:0)));
G.horizon={occs,nextOcc,until,fmtDate,fmtTime,today,ymd,titleOf,
 /* what's coming up next for this viewer */
 upcoming(n){ const C=G.club, t=today(); return C.visibleEvents().map(e=>({e,o:nextOcc(e,t)})).filter(x=>x.o>=t).sort(byWhen).slice(0,n||5); }
};

G.scenes.horizon={
 enter(a){
  a=a||{};
  if(a.back) this.back=a.back; else if(!this.back) this.back='club';
  const t=new Date(); this.ym=[t.getFullYear(),t.getMonth()]; this.sel=null;
  this.list=CL.List(); this.cache=null; this.det=null; this.ed=null; this.confirm=null; this.st={f:0};
  G.club.markEvSeen();
 },
 exit(){ if(this.ed) this.closeEditor(); },
 L(){
  const VH=G.VH, top=46, cellH=VH>=560?26:22, gridY=top+42;
  return {top,cellH,gridY,listY:gridY+6*cellH+6,cw:254/7,x0:8};
 },
 monthCells(){
  const [y,m]=this.ym, first=new Date(y,m,1), off=first.getDay(), cells=[];
  for(let i=0;i<42;i++){ const d=new Date(y,m,1-off+i); cells.push({s:ymd(d),d:d.getDate(),inM:d.getMonth()===m}); }
  return cells;
 },
 byDay(from,to){
  const m={};
  for(const e of G.club.visibleEvents()) for(const o of occs(e,from,to)) (m[o]=m[o]||[]).push({e,o});
  for(const k in m) m[k].sort(byWhen);
  return m;
 },
 /* ---------- the agenda under the calendar ---------- */
 items(){
  const C=G.club, key=[C.ver,Math.floor(Date.now()/30000),this.sel,C.loaded.events,G.clubAccess().ok].join('|');
  if(this.cache&&this.cache.key===key) return this.cache.items;
  const it=[], t=today();
  if(!C.db) it.push(CL.note(['THE HORIZON NEEDS THE CLUB NETWORK.'],'#ffd27a'));
  else if(!C.loaded.events) it.push(CL.note(['LOADING WHAT’S COMING UP…']));
  else if(this.sel){
   const L=(this.byDay(this.sel,this.sel)[this.sel])||[];
   it.push(CL.hdr(fmtDate(this.sel,true),L.length?L.length+(L.length===1?' EVENT':' EVENTS'):'','#ffd060'));
   for(const x of L) it.push(this.evItem(x));
   if(!L.length) it.push(CL.note(['NOTHING ON THE CALENDAR THIS DAY.'].concat(C.canPostEvent()?['TAP + ADD TO PUT SOMETHING HERE.']:[])));
   it.push(CL.action('SHOW EVERYTHING COMING UP',{kind:'all'},'ghost'));
  } else {
   const U=C.visibleEvents().map(e=>({e,o:nextOcc(e,t)})).filter(x=>x.o>=t).sort(byWhen).slice(0,40);
   let last='';
   for(const x of U){
    if(x.o!==last){ const n=dayDiff(t,x.o); it.push(CL.hdr((n===0?'TODAY • ':(n===1?'TOMORROW • ':''))+fmtDate(x.o,true),null,n<=1?'#80ffa0':'#ff9a50')); last=x.o; }
    it.push(this.evItem(x));
   }
   if(!U.length) it.push(CL.note(['NOTHING ON THE HORIZON YET.'].concat(C.canPostEvent()?['TAP + ADD TO LOG A RIDE, BENEFIT OR KEY DATE.']:['RIDES, BENEFITS AND KEY DATES SHOW UP HERE.'])));
   const sup=G.activeAcct&&G.activeAcct.type==='sup';
   it.push(CL.note(G.clubAccess().ok?['LIVE • UPDATES THE MOMENT AN EVENT IS ADDED','POSTED BY POCS, OFFICERS AND THE CLUB ADMIN']:[sup?'PUBLIC EVENTS FROM THE RAGING KNIGHTS FFMC':'PUBLIC EVENTS • MEMBERS SEE MORE AFTER LOGGING IN','LIVE • UPDATES THE MOMENT AN EVENT IS ADDED']));
  }
  CL.layout(it);
  this.cache={key,items:it};
  return it;
 },
 evItem(x){
  const C=G.club, e=x.e, T=C.evType(e.ty), title=titleOf(e,x.o);
  return {h:58,focus:true,x,
   draw(c,x0,y,w,foc){
    const u=until(x.o,e.tm);
    G.rrect(x0,y,w,52,10); c.fillStyle='rgba(30,28,40,.95)'; c.fill(); c.strokeStyle=foc?'#ffd060':'rgba(255,255,255,.1)'; c.lineWidth=foc?1.6:1; c.stroke();
    G.rrect(x0+6,y+8,4,36,2); c.fillStyle=T.col; c.fill();
    const cw=G.chip(u.t,x0+w-8,y+7,{align:'right',size:5.6,col:u.col,bg:'rgba(0,0,0,.45)'});
    G.txt(title,x0+18,y+8,7.6,'#f4ede2','left',w-34-cw,800);
    G.txt([fmtDate(x.o)+(e.tm?' • '+fmtTime(e.tm):''),e.loc].filter(Boolean).join(' • '),x0+18,y+22,6,'#b8ad9c','left',w-28,700);
    let cx=x0+18;
    cx+=G.chip(T.t,cx,y+34,{size:5.2,col:T.col,bg:'rgba(0,0,0,.35)'})+4;
    if(e.v!=='pub'){ const au=C.audOf(e); cx+=G.chip(au.v==='off'?'OFFICERS ONLY':'MEMBERS',cx,y+34,{size:5.2,col:au.col,bg:'rgba(0,0,0,.35)'})+4; }
    if(e.bk&&e.bk!=='ALL') cx+=G.chip(G.bs(e.b||e.bk),cx,y+34,{size:5.2,col:'#06202c',bg:'#80e0ff'})+4;
    if(e.rep) G.chip('YEARLY',cx,y+34,{size:5.2,col:'#cfc4b0',bg:'rgba(255,255,255,.08)'});
   },
   tap:()=>({kind:'open',x}),enter:()=>({kind:'open',x})};
 },
 /* ---------- event card ---------- */
 open(x){
  const C=G.club, e=x.e, T=C.evType(e.ty), au=C.audOf(e), u=until(x.o,e.tm);
  const tl=G.wrap(titleOf(e,x.o),10,214,800).slice(0,3), nl=e.note?G.wrap(e.note,6.8,214,600).slice(0,7):[];
  const rows=[['WHEN',fmtDate(x.o,true)+(e.tm?' • '+fmtTime(e.tm):'')],e.loc?['WHERE',e.loc]:null,['WHO SEES IT',au.v==='pub'?'EVERYONE (PUBLIC)':(au.v==='off'?'OFFICERS ONLY':'MEMBERS')+(e.bk&&e.bk!=='ALL'?' • '+G.bn(e.b||e.bk):'')]].filter(Boolean);
  const bodyH=26+tl.length*14+rows.length*14+(nl.length?nl.length*11+8:0)+18;
  const btns=[{id:'close',label:'CLOSE',kind:'primary'}];
  if(C.canEditEvent(e)) btns.push({id:'edit',label:'EDIT EVENT'},{id:'del',label:'DELETE',kind:'danger'});
  this.det=G.Modal({btns,bodyH,btnH:34,
   drawBody:(c,x0,y,w)=>{
    let cx=x0+14;
    cx+=G.chip(T.t,cx,y,{size:5.8,col:T.col,bg:'rgba(0,0,0,.4)',border:T.col})+5;
    if(e.rep) G.chip('EVERY YEAR',cx,y,{size:5.8,col:'#cfc4b0',bg:'rgba(255,255,255,.08)'});
    G.chip(u.t,x0+w-14,y,{align:'right',size:5.8,col:u.col,bg:'rgba(0,0,0,.4)'});
    let yy=y+24;
    tl.forEach(l=>{ G.txt(l,x0+14,yy,10,'#ffd060','left',w-28,800); yy+=14; });
    yy+=2;
    rows.forEach(r=>{ G.txt(r[0],x0+14,yy,5.8,'#9a8f80','left',undefined,800); G.txt(r[1],x0+70,yy,6.4,'#ece2d2','left',w-84,700); yy+=14; });
    if(nl.length){ yy+=4; nl.forEach(l=>{ G.txt(l,x0+14,yy,6.8,'#e0d6c4','left',w-28,600); yy+=11; }); yy+=4; }
    G.txt(e.auto?'ADDED AUTOMATICALLY FROM THE B4L LIST':'POSTED BY '+e.by+(e.role?' • '+e.role:''),x0+14,yy+2,5.8,'#9a8f80','left',w-28,700);
   }});
  this.det.e=e; this.det.x=x;
  AUDIO.sfx('ok');
 },
 /* ---------- add / edit ---------- */
 EL(){
  const VH=G.VH, t=56;
  return {typeY:t,titleY:t+60,dateY:t+108,locY:t+156,noteY:t+204,noteH:Math.max(40,Math.min(70,VH-t-204-130)),
   get audY(){ return this.noteY+this.noteH+22; }, get optY(){ return this.audY+34; }, saveY:VH-48};
 },
 typeRects(){ const E=this.EL(), w=(246-3*5)/4; return G.club.EVTYPES.map((t,i)=>({x:12+(i%4)*(w+5),y:E.typeY+Math.floor(i/4)*24,w,h:20,t})); },
 audRects(){ const E=this.EL(), w=(246-10)/3; return G.club.AUDS.map((a,i)=>({x:12+i*(w+5),y:E.audY,w,h:22,a})); },
 scopeRect(){ const E=this.EL(); return {x:12,y:E.optY,w:150,h:24}; },
 repRect(){ const E=this.EL(); return {x:170,y:E.optY,w:88,h:24}; },
 openEditor(e){
  const C=G.club, targets=C.annTargets(); if(!targets.length) return;
  this.det=null; this.list.reset();
  const f=e?{t:e.t,d:e.d,tm:e.tm||'',loc:e.loc||'',note:e.note||'',ty:e.ty,v:e.v,rep:!!e.rep,bk:e.bk}
           :{t:'',d:this.sel||today(),tm:'',loc:'',note:'',ty:'ride',v:'mem',rep:false,bk:(targets.find(x=>x.bk===C.myBk())||targets[0]).bk};
  if(!targets.some(x=>x.bk===f.bk)) f.bk=targets[0].bk;
  this.ed={id:e?e.id:null,f,targets,err:'',busy:false};
  const E=this.EL();
  G.field('et',{x:12,y:E.titleY,w:246,h:32,max:60,align:'left',placeholder:'e.g. Toy Run',value:f.t,enterHint:'next',onEnter:()=>G.focusField('el'),onInput:()=>{ this.ed.err=''; }});
  G.field('ed',{x:12,y:E.dateY,w:128,h:32,fs:.36,type:'date',align:'left',value:f.d,primary:false,onInput:()=>{ this.ed.err=''; }});
  G.field('etm',{x:146,y:E.dateY,w:112,h:32,fs:.36,type:'time',align:'left',value:f.tm,primary:false});
  G.field('el',{x:12,y:E.locY,w:246,h:32,max:60,align:'left',placeholder:'e.g. the clubhouse',value:f.loc,enterHint:'next',primary:false,onEnter:()=>G.focusField('en')});
  G.field('en',{x:12,y:E.noteY,w:246,h:E.noteH,max:400,multiline:true,align:'left',placeholder:'Details: meet time, route, what to bring…',value:f.note,primary:false});
  if(!e) G.focusField('et');
  AUDIO.sfx('ok');
 },
 closeEditor(){ for(const id of ['et','ed','etm','el','en']) G.removeField(id); this.ed=null; this.cache=null; },
 async saveEditor(){
  const ed=this.ed; if(!ed||ed.busy) return;
  const f=ed.f;
  f.t=G.fieldVal('et').trim(); f.d=G.fieldVal('ed').trim(); f.tm=G.fieldVal('etm').trim(); f.loc=G.fieldVal('el').trim(); f.note=G.fieldVal('en').trim();
  if(f.t.length<3){ ed.err='GIVE IT A NAME (3+ CHARACTERS)'; AUDIO.sfx('buzzer'); G.focusField('et'); return; }
  if(!/^\d{4}-\d{2}-\d{2}$/.test(f.d)){ ed.err='PICK A DATE'; AUDIO.sfx('buzzer'); return; }
  ed.busy=true;
  const id=await G.club.saveEvent(f,ed.id);
  ed.busy=false;
  if(!id){ ed.err='COULDN’T SAVE - CHECK YOUR CONNECTION'; AUDIO.sfx('buzzer'); return; }
  G.toast((ed.id?'UPDATED: ':'ON THE HORIZON: ')+f.t.toUpperCase(),'#80ffa0'); AUDIO.sfx('cheer');
  const d=parse(f.d); this.ym=[d.getFullYear(),d.getMonth()]; this.sel=f.d;
  this.closeEditor(); G.club.markEvSeen();
 },
 updEditor(){
  const ed=this.ed, f=ed.f;
  if(G.backHit()){ this.closeEditor(); return; }
  const ap=this.addBtn(); if(ap&&G.clicked(ap.x,ap.y,ap.w,ap.h)){ this.saveEditor(); return; }
  for(const r of this.typeRects()) if(G.clicked(r.x,r.y-2,r.w,r.h+4)){ f.ty=r.t.k; if(r.t.k==='anniv'||r.t.k==='key') f.rep=true; AUDIO.sfx('blip'); return; }
  for(const r of this.audRects()) if(G.clicked(r.x,r.y-2,r.w,r.h+4)){ f.v=r.a.v; AUDIO.sfx('blip'); return; }
  { const r=this.scopeRect(); if(ed.targets.length>1&&G.clicked(r.x,r.y,r.w,r.h)){ const i=ed.targets.findIndex(t=>t.bk===f.bk); f.bk=ed.targets[(i+1)%ed.targets.length].bk; AUDIO.sfx('blip'); return; } }
  { const r=this.repRect(); if(G.clicked(r.x,r.y,r.w,r.h)){ f.rep=!f.rep; AUDIO.sfx('blip'); return; } }
  const E=this.EL(), B=[{id:'save',label:ed.busy?'SAVING…':(ed.id?'SAVE CHANGES':'ADD TO THE HORIZON'),kind:'primary',x:12,y:E.saveY,w:170,h:38,size:8},{id:'cancel',label:'CANCEL',x:188,y:E.saveY,w:70,h:38,size:7.2}];
  const id=G.navList(this.st,B,{noKeys:true});
  if(id==='save') this.saveEditor(); else if(id==='cancel') this.closeEditor();
 },
 drawEditor(c){
  const ed=this.ed, f=ed.f, E=this.EL(), C=G.club, VH=G.VH;
  G.cover(G.img.bg_charity,0,0,VW,VH); G.dim(.9);
  G.txt('WHAT KIND OF EVENT',12,E.typeY-10,6.2,'#b8ad9c','left',undefined,700);
  for(const r of this.typeRects()){ const on=r.t.k===f.ty; G.rrect(r.x,r.y,r.w,r.h,10); c.fillStyle=on?r.t.col:'rgba(255,255,255,.07)'; c.fill(); c.strokeStyle=on?r.t.col:'rgba(255,255,255,.18)'; c.lineWidth=1; c.stroke();
   G.txt(r.t.t,r.x+r.w/2,r.y+5,5.8,on?'#14100c':'#e0d6c4','center',r.w-4,800); }
  const lab=(t,y,x)=>G.txt(t,x||12,y-12,6.2,'#b8ad9c','left',undefined,700);
  lab('NAME',E.titleY); G.rrect(12,E.titleY,246,32,14); c.fillStyle='rgba(0,0,0,.4)'; c.fill();
  lab('DATE',E.dateY); lab('TIME (OPTIONAL)',E.dateY,146);
  lab('WHERE (OPTIONAL)',E.locY); lab('DETAILS (OPTIONAL)',E.noteY);
  { const A=this.audRects(), au=C.audOf({v:f.v});
    lab('WHO CAN SEE IT',A[0].y); G.txt(au.d,258,A[0].y-12,5.6,au.col,'right',150,700);
    for(const r of A){ const on=r.a.v===f.v; G.rrect(r.x,r.y,r.w,r.h,11); c.fillStyle=on?r.a.col:'rgba(255,255,255,.07)'; c.fill(); c.strokeStyle=on?r.a.col:'rgba(255,255,255,.2)'; c.lineWidth=1; c.stroke();
     G.txt(r.a.t,r.x+r.w/2,r.y+6,6.6,on?'#10141a':'#e0d6c4','center',r.w-6,800); } }
  { const r=this.scopeRect(), tg=ed.targets.find(t=>t.bk===f.bk)||ed.targets[0], many=ed.targets.length>1;
    G.rrect(r.x,r.y,r.w,r.h,12); c.fillStyle='rgba(128,224,255,.12)'; c.fill(); c.strokeStyle='rgba(128,224,255,.6)'; c.lineWidth=1; c.stroke();
    G.txt((tg.bk==='ALL'?'ALL BATTALIONS':G.bn(tg.b))+(many?'  ▸':''),r.x+r.w/2,r.y+7,6.6,'#bff0ff','center',r.w-8,800); }
  { const r=this.repRect();
    G.txt('YEARLY',r.x+4,r.y+7,6.4,'#e0d6c4','left',undefined,800); G.toggleDraw(r.x+r.w-40,r.y+1,f.rep); }
  const B=[{id:'save',label:ed.busy?'SAVING…':(ed.id?'SAVE CHANGES':'ADD TO THE HORIZON'),kind:'primary',x:12,y:E.saveY,w:170,h:38,size:8},{id:'cancel',label:'CANCEL',x:188,y:E.saveY,w:70,h:38,size:7.2}];
  G.drawBtns(B,this.st);
  if(ed.err) G.txt(ed.err,VW/2,E.saveY-14,6.6,'#ff7a60','center',VW-20,700);
  G.topBar(ed.id?'EDIT EVENT':'NEW EVENT',{size:8.6});
  const ap=this.addBtn(); if(ap){ const press=G.held(ap.x,ap.y,ap.w,ap.h); G.glowFill(ap.x,ap.y+(press?1:0),ap.w,ap.h,12.5); G.txt(ap.t,ap.x+ap.w/2,ap.y+7.5+(press?1:0),7,'#16100a','center',undefined,800); }
 },
 /* top-right: + ADD (list) or SAVE (editor) */
 addBtn(){
  if(this.ed){ const t='SAVE', w=G.tw(t,7,800)+24; return {x:VW-6-w,y:8,w,h:25,t}; }
  if(!G.club.canPostEvent()) return null;
  const t='+ ADD', w=G.tw(t,7,800)+24; return {x:VW-6-w,y:8,w,h:25,t};
 },
 /* ---------- update ---------- */
 update(){
  const C=G.club;
  if(this.ed){ if(!C.canPostEvent()){ this.closeEditor(); return; } this.updEditor(); return; }
  if(this.confirm){
   const r=this.confirm.update();
   if(r==='no'||(r==null&&G.pressed.b)){ this.confirm=null; return; }
   if(r==='yes'){ const e=this.confirm.e; this.confirm=null;
    C.deleteEvent(e).then(ok=>{ this.cache=null; G.toast(ok?'EVENT REMOVED':'COULDN’T REMOVE IT',ok?'#ffd27a':'#ff7030'); }); }
   return;
  }
  if(this.det){
   const r=this.det.update();
   if(r==='close'||(r==null&&G.pressed.b)){ this.det=null; return; }
   if(r==='edit'){ const e=this.det.e; this.openEditor(e); return; }
   if(r==='del'){ const e=this.det.e; this.det=null; this.confirm=G.Modal({title:'REMOVE THIS EVENT?',titleCol:'#ff8060',lines:[[e.t.slice(0,40),'#cfc4b0',7]],btns:[{id:'yes',label:'REMOVE',kind:'danger'},{id:'no',label:'KEEP IT'}]}); this.confirm.e=e; }
   return;
  }
  if(G.backHit()){ G.go(this.back); return; }
  const ap=this.addBtn(); if(ap&&G.clicked(ap.x,ap.y,ap.w,ap.h)){ this.openEditor(); return; }
  const L=this.L();
  // month arrows + day taps
  if(G.clicked(8,L.top,44,26)){ this.shift(-1); return; }
  if(G.clicked(VW-52,L.top,44,26)){ this.shift(1); return; }
  if(G.clicked(60,L.top,150,26)){ const t=new Date(); this.ym=[t.getFullYear(),t.getMonth()]; this.sel=null; this.cache=null; this.list.reset(); AUDIO.sfx('blip'); return; }
  if(G.ptr.click&&G.ptr.y>=L.gridY&&G.ptr.y<L.gridY+6*L.cellH&&G.ptr.x>=L.x0&&G.ptr.x<L.x0+254){
   const i=Math.floor((G.ptr.y-L.gridY)/L.cellH)*7+Math.floor((G.ptr.x-L.x0)/L.cw), cell=this.monthCells()[i];
   if(cell){ this.sel=this.sel===cell.s?null:cell.s; if(!cell.inM){ const d=parse(cell.s); this.ym=[d.getFullYear(),d.getMonth()]; } this.cache=null; this.list.reset(); AUDIO.sfx('blip'); }
   return;
  }
  this.list.update(this.items(),{x:0,y:L.listY,w:VW,h:G.VH-L.listY-6},a=>{
   if(!a) return;
   if(a.kind==='open') this.open(a.x);
   else if(a.kind==='all'){ this.sel=null; this.cache=null; this.list.reset(); }
  });
 },
 shift(d){ let [y,m]=this.ym; m+=d; if(m<0){ m=11; y--; } if(m>11){ m=0; y++; } this.ym=[y,m]; this.sel=null; this.cache=null; this.list.reset(); AUDIO.sfx('blip'); },
 /* ---------- drawing ---------- */
 draw(c){
  const VH=G.VH, C=G.club;
  if(this.ed){ this.drawEditor(c); return; }
  G.cover(G.img.bg_charity,0,0,VW,VH); G.dim(.9);
  const L=this.L(), cells=this.monthCells(), map=this.byDay(cells[0].s,cells[41].s), t=today();
  // month header
  G.panel(6,L.top,VW-12,L.listY-L.top-2,{r:12,border:'rgba(255,170,90,.35)'});
  G.txt('‹',30,L.top+3,12,'#ffb060','center',undefined,800); G.txt('›',VW-30,L.top+3,12,'#ffb060','center',undefined,800);
  G.txt(MONTHS[this.ym[1]]+' '+this.ym[0],VW/2,L.top+6,9,'#ffd060','center',150,800);
  { const live=C.db&&C.loaded.events; c.beginPath(); c.arc(VW/2+62,L.top+12.5,2.6,0,7); c.fillStyle=live?(G.rm()||Math.sin(G.time*4)>-.3?'#80ffa0':'rgba(128,255,160,.3)'):'#9a8f80'; c.fill();
    G.txt(live?'LIVE':'…',VW/2+67,L.top+9.4,5.2,live?'#80ffa0':'#9a8f80','left',undefined,800); }
  for(let i=0;i<7;i++) G.txt(DOW[i].slice(0,1),L.x0+i*L.cw+L.cw/2,L.top+26,5.6,i===0||i===6?'#ffb060':'#9a8f80','center',undefined,800);
  cells.forEach((cl,i)=>{
   const x=L.x0+(i%7)*L.cw, y=L.gridY+Math.floor(i/7)*L.cellH, ev=map[cl.s]||[], sel=this.sel===cl.s, isT=cl.s===t;
   G.rrect(x+1,y+1,L.cw-2,L.cellH-2,6);
   c.fillStyle=sel?'rgba(240,120,24,.55)':(ev.length?'rgba(255,255,255,.07)':'rgba(255,255,255,.025)'); c.fill();
   if(isT){ c.strokeStyle='#ffb050'; c.lineWidth=1.4; c.stroke(); }
   G.txt(String(cl.d),x+L.cw/2,y+3.5,6.2,!cl.inM?'rgba(232,220,200,.25)':(sel?'#16100a':(isT?'#ffd060':'#e8dcc8')),'center',undefined,isT||sel?800:600);
   const n=Math.min(3,ev.length);
   for(let k=0;k<n;k++){ c.beginPath(); c.arc(x+L.cw/2+(k-(n-1)/2)*6,y+L.cellH-5.5,2,0,7); c.fillStyle=C.evType(ev[k].e.ty).col; c.globalAlpha=cl.inM?1:.35; c.fill(); c.globalAlpha=1; }
   if(ev.length>3) G.txt('+',x+L.cw-6,y+L.cellH-10,5,'#cfc4b0','center',undefined,800);
  });
  this.list.draw(c,this.items(),{x:0,y:L.listY,w:VW,h:VH-L.listY-6});
  G.topBar('ON THE HORIZON',{size:8.6});
  const ap=this.addBtn(); if(ap){ const press=G.held(ap.x,ap.y,ap.w,ap.h); G.glowFill(ap.x,ap.y+(press?1:0),ap.w,ap.h,12.5); G.txt(ap.t,ap.x+ap.w/2,ap.y+7.5+(press?1:0),7,'#16100a','center',undefined,800); }
  if(this.det) this.det.draw(c);
  if(this.confirm) this.confirm.draw(c);
 }
};
})();
