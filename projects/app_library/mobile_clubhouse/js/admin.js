/* WAITLIST and ADMIN CONSOLE.
   WAITLIST: approved members see the riders waiting in their battalion and tap ACKNOWLEDGE for riders they know
   (3 acknowledgments approve someone). A rider still on the waitlist sees their own card and progress.
   Cell numbers of waitlisted riders stay hidden from everyone except the people who can approve them.
   ADMIN CONSOLE (battalion POCs, club officers, the club admin): QUEUE of sign-ups to approve or deny,
   POCS by battalion, club OFFICERS (appointed by the club admin only), and DENIED accounts. */
(function(){
const VW=G.VW, CL=G.CL;

/* ============================ WAITLIST ============================ */
G.scenes.waitlist={
 enter(a){
  a=a||{};
  this.back=a.back||'club';
  this.lock=G.LockPanel(); this.list=CL.List(); this.cache=null;
  this.card=G.MemberCard({changed:()=>{ this.cache=null; }});
 },
 mode(){ const acc=G.clubAccess(); return acc.ok?'member':(acc.reason==='tentative'?'self':'locked'); },
 batt(){ return G.bn(G.activeAcct&&G.activeAcct.battalion)||'YOUR BATTALION'; },
 items(){
  const C=G.club, key=[C.ver,Math.floor(Date.now()/20000),C.rosterState,C.loaded.acks].join('|');
  if(this.cache&&this.cache.key===key) return this.cache.items;
  const it=[], b=this.batt();
  if(!C.db) it.push(CL.note(['THE WAITLIST NEEDS THE CLUB NETWORK.','GAMES AND YOUR RIDE LOG STILL WORK.'],'#ffd27a'));
  else if(C.readOnly) it.push(CL.note(['YOUR ACCESS TO THIS ARCADE IS VIEW-ONLY.','ASK THE CLUB ADMIN FOR MEMBER ACCESS.'],'#ffd27a'));
  else if(C.rosterState!=='live'||!C.loaded.acks) it.push(CL.note(['LOADING THE WAITLIST…'],'#cfc4b0'));
  else {
   it.push(CL.note(['ACKNOWLEDGE RIDERS YOU KNOW. '+C.ACKS+' ACKNOWLEDGMENTS FROM',b+' MEMBERS APPROVE A RIDER. THE POC CAN ALSO','DECIDE, OR IT’S AUTOMATIC AFTER 72 HOURS.'],'#cfc4b0'));
   const W=C.people().filter(g=>g.st==='tentative'&&C.sameBatt(g.r.bk,C.myBk())&&!C.isMine(g)).sort((x,y)=>(x.ca||0)-(y.ca||0));
   if(W.length){ it.push(CL.hdr(b+' WAITLIST',W.length,'#80e0ff')); W.forEach(g=>it.push(CL.applicant(g,C.canDecide(g)?'decide':'ack'))); }
   else it.push(CL.note(['NO ONE IS WAITING IN '+b+' RIGHT NOW.'],'#a8ffc0'));
   if(C.isAdminish()){ const n=C.myPending().length; it.push(CL.action('OPEN THE ADMIN CONSOLE'+(n?' ('+n+' TO DECIDE)':''),{kind:'console'},'secondary')); }
  }
  CL.layout(it);
  this.cache={key,items:it};
  return it;
 },
 consoleBtn(){ const t='CONSOLE', w=G.tw(t,7,800)+22; return {x:VW-6-w,y:8,w,h:25,t}; },
 update(){
  const m=this.mode();
  if(m!=='member'){
   if(G.backHit()){ G.go(this.back); return; }
   if(m==='locked') this.lock.update(56);
   return;
  }
  if(this.card.update()) return;
  if(G.backHit()){ G.go(this.back); return; }
  if(G.club.isAdminish()){ const b=this.consoleBtn(); if(G.clicked(b.x,b.y,b.w,b.h)){ AUDIO.sfx('ok'); G.go('console',{back:'waitlist'}); return; } }
  this.list.update(this.items(),{x:0,y:48,w:VW,h:G.VH-54},a=>{ if(a&&a.kind==='console'){ AUDIO.sfx('ok'); G.go('console',{back:'waitlist'}); return; } this.card.act(a); });
 },
 draw(c){
  const VH=G.VH, C=G.club, m=this.mode();
  G.cover(G.img.bg_convoy,0,0,VW,VH); G.dim(.88);
  if(m==='locked'){ G.topBar('WAITLIST'); this.lock.draw(c,56); return; }
  if(m==='self'){ this.drawSelf(c); G.topBar('WAITLIST'); return; }
  this.list.draw(c,this.items(),{x:0,y:48,w:VW,h:VH-54});
  G.topBar('WAITLIST');
  if(C.isAdminish()){ const b=this.consoleBtn(), press=G.held(b.x,b.y,b.w,b.h);
   G.rrect(b.x,b.y+(press?1:0),b.w,b.h,12.5); c.fillStyle='rgba(255,176,96,.16)'; c.fill(); c.strokeStyle='rgba(255,170,90,.8)'; c.lineWidth=1.2; c.stroke();
   G.txt(b.t,b.x+b.w/2,b.y+7.5+(press?1:0),7,'#ffc080','center',undefined,800); }
  this.card.draw(c);
 },
 /* the rider's own view while they wait */
 drawSelf(c){
  const C=G.club, me=G.activeAcct, acc=G.clubAccess(), b=this.batt(), VH=G.VH;
  const n=C.myAckCount(), names=[...new Set(C.acks.filter(k=>k.a===me.id&&k.v!==me.id).map(k=>k.vn).filter(Boolean))];
  const pocs=C.pocs.filter(p=>C.sameBatt(p.bk,C.myBk())).map(p=>p.n);
  const h=Math.min(VH-70,344), y=Math.max(52,(VH-h)/2+10);
  G.panel(12,y,VW-24,h,{border:'rgba(128,224,255,.7)'});
  G.drawFace(me.photo||null,VW/2-46,y+16,92,me.roadName,'#80e0ff');
  G.txtO(me.roadName,VW/2,y+116,12,'#ffd060','center',VW-50);
  G.txt('YOU’RE ON THE '+b+' WAITLIST',VW/2,y+138,7.6,'#80e0ff','center',VW-40,800);
  const dx=VW/2-(C.ACKS-1)*13;
  for(let i=0;i<C.ACKS;i++){ c.beginPath(); c.arc(dx+i*26,y+170,9,0,7); c.fillStyle=i<n?'#80ffa0':'rgba(255,255,255,.12)'; c.fill();
   if(i<n) G.icon('star',c,dx+i*26,y+170,10,'#10301a'); }
  G.txt(n+' OF '+C.ACKS+' MEMBERS HAVE ACKNOWLEDGED YOU',VW/2,y+186,7,n?'#a8ffc0':'#cfc4b0','center',VW-40,800);
  if(names.length) G.txt(names.join(' • '),VW/2,y+201,6.4,'#9a8f80','center',VW-44,700);
  const rows=[['YOUR POC',pocs.length?pocs.join(', '):'NONE YET (A CLUB OFFICER CAN APPROVE YOU)'],['AUTOMATIC APPROVAL','IN '+C.fmtLeft(acc.left||0)]];
  rows.forEach((r,i)=>{ const ry=y+222+i*19; G.rrect(24,ry-4,VW-48,17,7); c.fillStyle='rgba(255,255,255,.05)'; c.fill();
   G.txt(r[0],32,ry,6.2,'#9a8f80','left',undefined,700); G.txt(r[1],VW-32,ry,6.6,'#f4ede2','right',VW-150,800); });
  ['ASK '+C.ACKS+' '+b+' MEMBERS WHO KNOW YOU TO OPEN THE','WAITLIST IN THEIR CLUBHOUSE AND TAP ACKNOWLEDGE','ON YOUR CARD. YOUR POC CAN APPROVE YOU ANY TIME.']
   .forEach((l,i)=>G.txt(l,VW/2,y+270+i*14,6.3,'#cfc4b0','center',VW-40,700));
  if(!me.photo) G.txt('TIP: ADD A HEADSHOT (GEAR › HEADSHOT) SO MEMBERS RECOGNIZE YOU',VW/2,y+h-26,5.8,'#ffd27a','center',VW-40,700);
  else G.txt('YOU CAN KEEP PLAYING WHILE YOU WAIT.',VW/2,y+h-26,6,'#9a8f80','center',VW-40,700);
 }
};

/* ============================ ADMIN CONSOLE ============================ */
const TABS=['QUEUE','POCS','OFFICERS','DENIED'];
G.scenes.console={
 enter(a){
  a=a||{};
  this.back=a.back||'club';
  if(this.tab==null) this.tab=0;
  if(a.tab!=null) this.tab=a.tab;
  this.pick=null; this.cache=null;
  this.lock=G.LockPanel(); this.list=CL.List(); this.st={f:0};
  this.card=G.MemberCard({changed:()=>{ this.cache=null; this.pick=null; }});
 },
 allowed(){ return G.clubAccess().ok&&G.club.isAdminish(); },
 setTab(t){ if(t===this.tab) return; this.tab=t; this.pick=null; this.list.reset(); this.cache=null; AUDIO.sfx('blip'); },
 scopeLine(){
  const C=G.club, me=G.activeAcct, n=C.myPending().length;
  return C.roleLabel()+' • '+(C.canManage()?'EVERY BATTALION':(G.bn(me.battalion)||'YOUR BATTALION')+' ONLY')+' • '+n+' WAITING';
 },
 battalions(){
  const C=G.club, m=new Map();
  const add=(bk,b)=>{ const k=String(bk||'NONE').replace(/-/g,''); if(!m.has(k)) m.set(k,{k,bk,b:b||bk,members:0}); return m.get(k); };
  for(const g of C.people()) if(g.st==='approved') add(g.r.bk,g.r.b).members++;
  for(const p of C.pocs) add(p.bk,p.b);
  return [...m.values()].sort((a,b)=>String(a.b).localeCompare(String(b.b)));
 },
 items(){
  const C=G.club, me=G.activeAcct;
  const key=[C.ver,Math.floor(Date.now()/20000),this.tab,this.pick?this.pick.pk+this.pick.bk:'',C.rosterState].join('|');
  if(this.cache&&this.cache.key===key) return this.cache.items;
  const it=[], mgr=C.canManage(), byName=(a,b)=>String(a.r.n).localeCompare(String(b.r.n));
  if(!C.db||C.rosterState!=='live') it.push(CL.note([C.db?'LOADING…':'THE CONSOLE NEEDS THE CLUB NETWORK.'],'#ffd27a'));
  else if(this.tab===0){
   const P=C.myPending();
   if(P.length){ it.push(CL.hdr('WAITING ON A DECISION • OLDEST FIRST',P.length,'#80e0ff')); P.forEach(g=>it.push(CL.applicant(g,'decide'))); }
   else it.push(CL.note(['NOBODY IS WAITING ON A DECISION.','NEW SIGN-UPS SHOW UP HERE RIGHT AWAY.'],'#a8ffc0'));
   it.push(CL.note(['APPROVE OR DENY AT ANY TIME. A DENY ALWAYS WINS.',C.ACKS+' ACKNOWLEDGMENTS FROM THEIR BATTALION OR 72 HOURS','WITH NO DECISION ALSO APPROVES A RIDER.']));
  }
  else if(this.tab===1){
   if(this.pick&&this.pick.pk==='poc'){
    const b=this.pick.b;
    it.push(CL.hdr('PICK THE NEW '+b+' POC',null,'#80e0ff'));
    const M=C.people().filter(g=>g.st==='approved'&&!g.poc&&C.sameBatt(g.r.bk,this.pick.bk)).sort(byName);
    M.forEach(g=>it.push(CL.member(g,{pick:{kind:'poc',g}})));
    if(!M.length) it.push(CL.note(['NO OTHER APPROVED '+b+' MEMBERS YET.']));
    it.push(CL.action('CANCEL',{kind:'cancelpick'},'secondary'));
   } else {
    const B=this.battalions();
    if(!B.length) it.push(CL.note(['NO BATTALIONS ON THE ROSTER YET.']));
    for(const bt of B){
     const pocs=C.people().filter(g=>g.poc&&C.sameBatt(g.r.bk,bt.bk)).sort(byName);
     it.push(CL.hdr(G.bn(bt.b)+' • '+bt.members+' MEMBER'+(bt.members===1?'':'S'),pocs.length?pocs.length+' POC'+(pocs.length===1?'':'S'):'NO POC',pocs.length?'#ff9a50':'#ffd27a'));
     pocs.forEach(g=>it.push(CL.member(g,mgr&&!C.isMine(g)?{btn:{label:'REMOVE',kind:'danger',act:{kind:'unpoc',g}}}:{})));
     if(mgr) it.push(CL.action('+ NAME A '+G.bn(bt.b)+' POC',{kind:'startpick',pk:'poc',bk:bt.bk,b:bt.b}));
     else if(!pocs.length) it.push(CL.note(['A CLUB OFFICER OR THE CLUB ADMIN APPROVES '+G.bn(bt.b)+' SIGN-UPS.']));
    }
    if(!mgr) it.push(CL.note(['CLUB OFFICERS AND THE CLUB ADMIN NAME POCS.']));
   }
  }
  else if(this.tab===2){
   if(this.pick&&this.pick.pk==='officer'){
    it.push(CL.hdr('APPOINT A CLUB OFFICER',null,'#ffb060'));
    const M=C.people().filter(g=>g.st==='approved'&&!g.off&&!g.adm&&!C.isMine(g)).sort(byName);
    M.forEach(g=>it.push(CL.member(g,{pick:{kind:'officer',g}})));
    if(!M.length) it.push(CL.note(['NO OTHER APPROVED MEMBERS YET.']));
    it.push(CL.action('CANCEL',{kind:'cancelpick'},'secondary'));
   } else {
    it.push(CL.note(['CLUB OFFICERS APPROVE OR DENY ANY BATTALION','AND NAME POCS. ONLY THE CLUB ADMIN (THE','ARCADE’S OWNER) APPOINTS OR REMOVES OFFICERS.']));
    const A=C.people().filter(g=>g.adm);
    if(A.length){ it.push(CL.hdr('CLUB ADMIN',null,'#ffd060')); A.forEach(g=>it.push(CL.member(g))); }
    const O=C.people().filter(g=>g.off).sort(byName);
    it.push(CL.hdr('CLUB OFFICERS',O.length,'#ffb060'));
    O.forEach(g=>it.push(CL.member(g,C.admin?{btn:{label:'REMOVE',kind:'danger',act:{kind:'unofficer',g}}}:{})));
    if(!O.length) it.push(CL.note(['NO OFFICERS APPOINTED YET.']));
    if(C.admin) it.push(CL.action('+ APPOINT AN OFFICER',{kind:'startpick',pk:'officer'}));
   }
  }
  else {
   const D=C.people().filter(g=>g.st==='denied'&&(mgr||C.sameBatt(g.r.bk,C.myBk()))).sort(byName);
   if(D.length){ it.push(CL.hdr('NOT APPROVED',D.length,'#ff8a70')); D.forEach(g=>it.push(CL.member(g,C.canDecide(g)?{denied:true,btn:{label:'APPROVE',kind:'success',act:{kind:'approve',g}}}:{denied:true}))); }
   else it.push(CL.note(['NO DENIED ACCOUNTS.'],'#a8ffc0'));
  }
  CL.layout(it);
  this.cache={key,items:it};
  return it;
 },
 onAct(a){
  if(!a) return;
  if(a.kind==='startpick'){ this.pick={pk:a.pk,bk:a.bk,b:a.b}; this.list.reset(); this.cache=null; AUDIO.sfx('ok'); return; }
  if(a.kind==='cancelpick'){ this.pick=null; this.list.reset(); this.cache=null; AUDIO.sfx('back'); return; }
  this.card.act(a);
 },
 update(){
  if(!this.allowed()){
   if(G.backHit()){ G.go(this.back); return; }
   if(!G.clubAccess().ok){ this.lock.update(56); return; }
   const id=G.navList(this.st,[this.waitBtn()]);
   if(id==='wait') G.go('waitlist',{back:'console'});
   return;
  }
  if(this.card.update()) return;
  if(G.backHit()){ if(this.pick){ this.pick=null; this.cache=null; return; } G.go(this.back); return; }
  const t=G.segHit(8,48,254,30,4);
  if(t>=0) this.setTab(t);
  if(G.pressed.left) this.setTab((this.tab+3)%4);
  if(G.pressed.right) this.setTab((this.tab+1)%4);
  this.list.update(this.items(),{x:0,y:100,w:VW,h:G.VH-106},a=>this.onAct(a));
 },
 waitBtn(){ return {id:'wait',label:'OPEN THE WAITLIST',kind:'primary',x:28,y:Math.round(G.VH*.58),w:214,h:40,size:8.5}; },
 draw(c){
  const VH=G.VH, C=G.club;
  G.cover(G.img.bg_bikerdown,0,0,VW,VH); G.dim(.88);
  if(!this.allowed()){
   G.topBar('ADMIN CONSOLE',{col:'#ff9050'});
   if(!G.clubAccess().ok){ this.lock.draw(c,56); return; }
   const y=Math.round(VH*.24);
   G.panel(14,y,242,150,{border:'rgba(255,255,255,.16)'});
   c.beginPath(); c.arc(VW/2,y+36,21,0,7); c.fillStyle='rgba(255,255,255,.07)'; c.fill();
   G.icon('lock',c,VW/2,y+37,24,'#ffb060');
   G.txt('POCS AND OFFICERS ONLY',VW/2,y+66,10,'#ffb060','center',220,800);
   ['MEMBERS HELP BY ACKNOWLEDGING RIDERS','THEY KNOW ON THE WAITLIST.'].forEach((l,i)=>G.txt(l,VW/2,y+92+i*15,6.6,'#e0d6c4','center',220,700));
   G.drawBtns([this.waitBtn()],this.st);
   return;
  }
  const P=C.myPending().length;
  G.seg(8,48,254,30,TABS.map((t,i)=>i===0&&P?t+' '+P:t),this.tab,6.6);
  G.txt(this.scopeLine(),VW/2,86,6,'#b8ad9c','center',VW-20,700);
  this.list.draw(c,this.items(),{x:0,y:100,w:VW,h:VH-106});
  G.topBar('ADMIN CONSOLE',{col:'#ff9050'});
  this.card.draw(c);
 }
};
})();
