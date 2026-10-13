/* OFFICIAL POSITIONS and BROTHERS FOR LIFE. Approved members get everything below; supporters and members still on the
   waitlist get a read-only view built from the pos / b4l docs (road names, titles, battalions, dates - never the roster).
   POSITIONS: each battalion's President, Vice President, Road Captain, Sgt at Arms, Secretary and Treasurer.
   A position picked at sign-up (or under MY POSITION) shows once the battalion's POC, a club officer or the club admin
   confirms it. Any member can NOMINATE someone for a position anonymously - the nominator is never saved anywhere.
   The club admin, club officers and the nominee's battalion POC review claims and nominations, and can appoint,
   replace or remove holders (one holder per position per battalion). Titles are not app permissions.
   B4L: brothers who earned the title "Brother for Life", with the date it was granted; tap one for their profile
   card. Only the club admin grants, re-dates or removes the title (enforced by the arcade's sharing rules). */
(function(){
const VW=G.VW, CL=G.CL;
const LIST_Y=84;
const byName=(a,b)=>String(a.r.n).localeCompare(String(b.r.n));
const PT=(b,k)=>((G.bn(b)||'')+' '+G.club.posTitle(k)).trim();   // e.g. BATTALION 7 PRESIDENT

/* battalions that have approved members (or position holders), mine first */
function battList(){
 const C=G.club, m=new Map();
 const add=(bk,b)=>{ const k=String(bk||'NONE').replace(/-/g,''); if(!m.has(k)) m.set(k,{k,bk,b:b||bk}); };
 for(const g of C.people()) if(g.st==='approved'){ add(g.r.bk,g.r.b); if(g.pos) add(g.posBk,g.posd.b); }
 const mine=String(C.myBk()).replace(/-/g,'');
 if(!m.has(mine)&&G.activeAcct) add(C.myBk(),G.activeAcct.battalion);
 return [...m.values()].sort((a,b)=>a.k===mine?-1:(b.k===mine?1:String(a.b).localeCompare(String(b.b))));
}

/* a wrapping row of tappable chips inside a list (o.title above it) */
function chipItem(opts,isSel,mk,o){
 o=o||{};
 const size=6.4, ch=20, gap=6, top=o.title?15:0;
 const lay=w=>{ const R=[]; let x=0, y=top; for(const p of opts){ const cw=G.tw(p.label,size,700)+18; if(x+cw>w&&x>0){ x=0; y+=ch+6; } R.push({x,y,w:cw,h:ch,p}); x+=cw+gap; } return {R,h:y+ch}; };
 return {h:lay(254).h+12,
  draw(c,x,y,w){
   const L=lay(w);
   if(o.title) G.txt(o.title,x+2,y,6.2,'#b8ad9c','left',w,800);
   for(const r of L.R){ const on=isSel(r.p.id), col=o.col||'#80e0ff';
    G.rrect(x+r.x,y+r.y,r.w,r.h,10); c.fillStyle=on?col:'rgba(255,255,255,.07)'; c.fill();
    c.strokeStyle=on?col:'rgba(255,255,255,.22)'; c.lineWidth=1; c.stroke();
    G.txt(r.p.label,x+r.x+r.w/2,y+r.y+5,size,on?'#10161c':'#e0d6c4','center',undefined,800); }
  },
  tap(lx,ly,w){ for(const r of lay(w).R) if(lx>=r.x-3&&lx<=r.x+r.w+3&&ly>=r.y-4&&ly<=r.y+r.h+4) return mk(r.p.id); return null; }};
}

/* one position in a battalion: holder (tap = profile card) or VACANT (tap = nominate someone) */
function posRow(k,holders,bk,b,rev){
 const C=G.club, t=C.posTitle(k), H=52, h0=holders[0]||null;
 return {h:H+6,focus:true,
  draw(c,x,y,w,foc){
   const press=G.held(x,y,w,H), bw=rev?72:0;
   G.rrect(x,y,w,H,12); c.fillStyle=press?'rgba(60,52,72,.96)':(h0?'rgba(30,28,40,.95)':'rgba(30,28,40,.62)'); c.fill();
   c.strokeStyle=foc?'#ffd060':(h0?'rgba(255,208,96,.3)':'rgba(255,255,255,.08)'); c.lineWidth=foc?2:1; c.stroke();
   if(h0) G.drawFace(CL.faceSrc(h0),x+9,y+9,34,h0.r.n,'#ffd060');
   else { c.beginPath(); c.arc(x+26,y+26,17,0,7); c.fillStyle='rgba(255,255,255,.04)'; c.fill(); c.save(); c.setLineDash([3,3]); c.strokeStyle='rgba(255,255,255,.24)'; c.lineWidth=1.1; c.stroke(); c.restore(); }
   const nx=x+52;
   G.txt(t,nx,y+7,6.2,'#ffb060','left',w-62-bw,800);
   if(h0){
    G.txt(holders.map(g=>g.r.n).join(' • '),nx,y+18,9,'#f4ede2','left',w-62-bw,800);
    G.txt([G.nameLine(h0.r),G.bn(h0.r.b)].filter(Boolean).join(' • '),nx,y+34,6.2,'#cfc4b0','left',w-62-bw,700);
   } else {
    G.txt('VACANT',nx,y+19,8,'#8a7f70','left',undefined,800);
    G.txt(rev?'APPOINT SOMEONE OR WAIT FOR NOMINATIONS':'TAP TO NOMINATE SOMEONE',nx,y+34,5.8,'#7f7668','left',w-62-bw,700);
   }
   if(rev) G.button({x:x+w-74,y:y+12,w:66,h:28,label:h0?'CHANGE':'APPOINT',kind:'ghost',size:6.6});
  },
  enter(){ return h0?{open:h0}:{kind:'nominate',k,bk,b}; },
  tap(lx,ly,w){
   if(rev&&lx>=w-80&&ly>=6&&ly<=46) return h0?{kind:'change',k,bk,b,g:h0}:{kind:'appoint',k,bk,b};
   return h0?{open:h0}:{kind:'nominate',k,bk,b};
  }};
}

/* read-only: a confirmed position and who holds it (supporters + the waitlist) */
function posRowV(k,names){
 const t=G.club.posTitle(k), H=40;
 return {h:H+6,draw(c,x,y,w){
  G.rrect(x,y,w,H,12); c.fillStyle='rgba(30,28,40,.95)'; c.fill(); c.strokeStyle='rgba(255,208,96,.28)'; c.lineWidth=1; c.stroke();
  c.beginPath(); c.arc(x+21,y+H/2,13,0,7); c.fillStyle='rgba(240,120,24,.14)'; c.fill();
  G.icon('chevrons',c,x+21,y+H/2,14,'#ffb060');
  G.txt(t,x+42,y+7,6,'#ffb060','left',w-52,800);
  G.txt(names.join(' • '),x+42,y+18,8.6,'#f4ede2','left',w-52,800);
 }};
}
/* the signed-in member's own position (confirmed, waiting on confirmation, or none) */
function myPosItem(){
 const C=G.club, g=C.myGroup(), cur=g&&g.pos, claim=g&&g.claim, H=44;
 let t, sub, col;
 if(claim){ t=C.posTitle(claim); sub='WAITING FOR YOUR POC OR AN OFFICER TO CONFIRM'+(cur?' • NOW '+C.posTitle(cur):''); col='#ffd27a'; }
 else if(cur){ t=C.posTitle(cur)+' • '+G.bn(g.posd.b||g.posBk); sub='✓ CONFIRMED'+(g.posd.by?' BY '+g.posd.by:''); col='#a8ffc0'; }
 else { t='NONE'; sub='HOLD AN OFFICIAL POSITION? TAP TO ADD IT'; col='#9a8f80'; }
 return {h:H+8,focus:true,
  draw(c,x,y,w,foc){
   const press=G.held(x,y,w,H);
   G.rrect(x,y,w,H,12); c.fillStyle=press?'rgba(60,52,72,.96)':'rgba(240,120,24,.1)'; c.fill();
   c.strokeStyle=foc?'#ffd060':'rgba(255,150,60,.42)'; c.lineWidth=foc?2:1; c.stroke();
   G.txt('MY POSITION',x+12,y+6,5.8,'#b8ad9c','left',undefined,800);
   G.txt(t,x+12,y+17,8.4,'#ffd060','left',w-78,800);
   G.txt(sub,x+12,y+31,5.6,col,'left',w-78,700);
   G.txt(cur||claim?'CHANGE ›':'SET ›',x+w-12,y+16,7,'#ffb060','right',undefined,800);
  },
  enter:()=>({kind:'mypos'}), tap:()=>({kind:'mypos'})};
}

/* reviewer cards */
function claimCard(g){
 const C=G.club, H=94, holders=C.posHolders(g.r.bk).filter(h=>h.pos===g.claim&&h.key!==g.key);
 return {h:H+6,g,focus:true,
  draw(c,x,y,w,foc){
   G.rrect(x,y,w,H,12); c.fillStyle='rgba(40,32,14,.95)'; c.fill();
   c.strokeStyle=foc?'#ffd060':'rgba(255,208,96,.5)'; c.lineWidth=foc?2:1.2; c.stroke();
   G.drawFace(CL.faceSrc(g),x+8,y+8,38,g.r.n,'#ffd060');
   G.txt(g.r.n,x+54,y+7,9,'#f4ede2','left',w-64,800);
   G.txt([G.nameLine(g.r),G.bn(g.r.b),C.ago(g.pca)].filter(Boolean).join(' • '),x+54,y+22,6.2,'#cfc4b0','left',w-64,700);
   G.txt('SAYS THEY’RE '+PT(g.r.b,g.claim),x+54,y+34,6.6,'#ffd060','left',w-64,800);
   G.txt(holders.length?'NOW HELD BY '+holders.map(h=>h.r.n).join(', ')+' • CONFIRMING REPLACES THEM':(g.pos?'CURRENTLY '+C.posTitle(g.pos):'THE POSITION IS OPEN'),x+12,y+52,5.8,'#9a8f80','left',w-24,700);
   const by=y+H-32, bw=(w-24)/2;
   G.button({x:x+8,y:by,w:bw,h:26,label:'✓ CONFIRM',kind:'success',size:7.2});
   G.button({x:x+16+bw,y:by,w:bw,h:26,label:'DECLINE',kind:'danger',size:7.2});
  },
  tap(lx,ly,w){ if(ly>=H-34&&ly<=H-4) return {kind:lx<w/2?'confirmclaim':'declineclaim',g}; return {open:g}; }};
}
function nomCard(x){
 const C=G.club, g=x.g, ql=[];
 x.list.map(n=>n.why).filter(Boolean).slice(0,3).forEach(q=>G.wrap('“'+q+'”',6.4,222,600).slice(0,2).forEach(l=>ql.push(l)));
 const H=84+ql.length*10.5, can=!!g&&C.canSetPos(g);
 const holders=g?C.posHolders(x.bk).filter(h=>h.pos===x.p&&h.key!==g.key):[];
 return {h:H+6,focus:true,
  draw(c,xx,y,w,foc){
   G.rrect(xx,y,w,H,12); c.fillStyle='rgba(16,36,48,.95)'; c.fill();
   c.strokeStyle=foc?'#ffd060':'rgba(128,224,255,.5)'; c.lineWidth=foc?2:1.2; c.stroke();
   G.drawFace(g?CL.faceSrc(g):null,xx+8,y+8,38,x.nn,'#80e0ff');
   G.txt(x.nn,xx+54,y+7,9,'#f4ede2','left',w-64,800);
   G.txt('NOMINATED FOR '+PT(x.b||x.bk,x.p),xx+54,y+22,6.6,'#80e0ff','left',w-64,800);
   G.txt(x.list.length+' NOMINATION'+(x.list.length===1?'':'S')+' • LATEST '+C.ago(x.at)+(holders.length?' • HELD BY '+holders.map(h=>h.r.n).join(', '):''),xx+54,y+35,5.8,'#9a8f80','left',w-64,700);
   let qy=y+54; ql.forEach(l=>{ G.txt(l,xx+14,qy,6.4,'#e8dcc8','left',w-28,600); qy+=10.5; });
   const by=y+H-30, bw=(w-24)/2;
   if(can){ G.button({x:xx+8,y:by,w:bw,h:24,label:'APPOINT',kind:'success',size:7}); G.button({x:xx+16+bw,y:by,w:bw,h:24,label:'DISMISS',kind:'ghost',size:7}); }
   else G.button({x:xx+8,y:by,w:w-16,h:24,label:'DISMISS',kind:'ghost',size:7});
  },
  tap(lx,ly,w){ if(ly>=H-32&&ly<=H-4) return can&&lx<w/2?{kind:'appointnom',x}:{kind:'dismissnom',x}; return g?{open:g}:null; }};
}

/* choose a position (2 columns) */
function PosPicker(o){
 return { st:{f:0}, o,
  rects(){
   const O=(o.none?[{k:'',t:'NONE'}]:[]).concat(G.club.POSITIONS);
   const W=246, X=(VW-W)/2, bw=(W-28-8)/2, bh=30, rows=Math.ceil(O.length/2), top=o.sub?50:36;
   const h=top+rows*(bh+6)+48, y=Math.max(46,Math.round((G.VH-h)/2));
   const B=O.map((p,i)=>({id:'k:'+p.k,label:p.t,kind:p.k===o.cur?'selected':'secondary',x:X+14+(i%2)*(bw+8),y:y+top+Math.floor(i/2)*(bh+6),w:bw,h:bh,size:6.8}));
   B.push({id:'cancel',label:'CANCEL',kind:'ghost',x:X+14,y:y+top+rows*(bh+6)+4,w:W-28,h:32,size:7.5});
   return {x:X,y,w:W,h,B};
  },
  update(){
   const R=this.rects(), id=G.navList(this.st,R.B,{both:true});
   if(id) return id;
   if(G.pressed.b||(G.ptr.click&&!G.hit(R.x,R.y,R.w,R.h))) return 'cancel';
   return null;
  },
  draw(c){
   G.dim(.66); const R=this.rects();
   G.panel(R.x,R.y,R.w,R.h);
   G.txtO(o.title,VW/2,R.y+11,9.5,'#ffd060','center',R.w-20);
   if(o.sub) G.txt(o.sub,VW/2,R.y+30,6.2,'#b8ad9c','center',R.w-20,700);
   G.drawBtns(R.B,this.st);
  }
 };
}

/* ============================ OFFICIAL POSITIONS ============================ */
G.scenes.positions={
 enter(a){
  a=a||{};
  this.back=a.back||'club';
  this.lock=G.LockPanel('view'); this.list=CL.List(); this.cache=null;
  if(this.scope==null) this.scope=0;          // 0 = my battalion, 1 = entire club
  this.fromReview=!!a.review;
  this.mode=a.review?'review':'list';
  this.nom=null; this.ap=null; this.picker=null; this.modal=null; this.busy=false; this.err=''; this.wst={f:0};
  this.card=G.MemberCard({hide:()=>G.hideFields(true),show:()=>G.hideFields(false),changed:()=>{ this.cache=null; }});
 },
 exit(){ this.card=null; },
 setMode(m){ if(m!=='nomwhy') G.removeField('why'); this.mode=m; this.list.reset(); this.cache=null; this.err=''; },
 area(){ const y=this.mode==='list'&&!G.club.viewOnly()?LIST_Y:48; return {x:0,y,w:VW,h:G.VH-y-6}; },
 items(){
  const C=G.club, vo=C.viewOnly();
  const key=[C.ver,Math.floor(Date.now()/20000),this.mode,this.scope,vo,C.rosterState,C.loaded.pos,C.loaded.noms,
   this.nom?this.nom.k+'|'+this.nom.bk:'',this.ap?this.ap.k+'|'+this.ap.bk:''].join('|');
  if(this.cache&&this.cache.key===key) return this.cache.items;
  const it=[];
  if(!C.db) it.push(CL.note(['POSITIONS NEED THE CLUB NETWORK.','GAMES AND YOUR RIDE LOG STILL WORK.'],'#ffd27a'));
  else if(vo){ if(!C.loaded.pos) it.push(CL.note(['LOADING POSITIONS…'],'#cfc4b0')); else this.viewItems(it); }
  else if(C.rosterState!=='live'||!C.loaded.pos) it.push(CL.note(['LOADING POSITIONS…'],'#cfc4b0'));
  else if(this.mode==='review') this.reviewItems(it);
  else if(this.mode==='nom') this.nomItems(it);
  else if(this.mode==='appoint') this.apItems(it);
  else this.listItems(it);
  CL.layout(it);
  this.cache={key,items:it};
  return it;
 },
 listItems(it){
  const C=G.club, me=G.activeAcct;
  if(C.isAdminish()){
   const nc=C.posClaims().length, nn=C.nomGroups().length;
   if(nc||nn) it.push(CL.action('REVIEW '+[nc?nc+' CLAIM'+(nc===1?'':'S'):'',nn?nn+' NOMINATION'+(nn===1?'':'S'):''].filter(Boolean).join(' • ')+' ›',{kind:'review'},'primary'));
  }
  it.push(myPosItem());
  it.push(CL.action('✎ NOMINATE SOMEONE • ANONYMOUS',{kind:'nominate'},'ghost'));
  if(this.scope===0){
   const bk=C.myBk(), b=G.bn(me.battalion||bk), H=C.posHolders(bk), rev=C.canReviewBatt(bk);
   it.push(CL.hdr(b+' OFFICIAL POSITIONS',C.POSITIONS.filter(p=>H.some(h=>h.pos===p.k)).length+' OF '+C.POSITIONS.length+' FILLED','#ffd060'));
   for(const p of C.POSITIONS) it.push(posRow(p.k,H.filter(h=>h.pos===p.k),bk,b,rev));
  } else {
   for(const bt of battList()){
    const H=C.posHolders(bt.bk), rev=C.canReviewBatt(bt.bk), filled=C.POSITIONS.filter(p=>H.some(h=>h.pos===p.k));
    it.push(CL.hdr(G.bn(bt.b)+' OFFICIAL POSITIONS',filled.length?filled.length+' OF '+C.POSITIONS.length:'NONE YET','#ffd060'));
    filled.forEach(p=>it.push(posRow(p.k,H.filter(h=>h.pos===p.k),bt.bk,bt.b,rev)));
    if(!filled.length) it.push(CL.note(['NO CONFIRMED POSITIONS IN '+G.bn(bt.b)+' YET.']));
    if(rev) it.push(CL.action('+ APPOINT A '+G.bn(bt.b)+' POSITION',{kind:'appointb',bk:bt.bk,b:bt.b}));
   }
  }
  it.push(CL.note(['POSITIONS ARE CLUB TITLES. APP PERMISSIONS (POCS AND','CLUB OFFICERS) ARE SET IN THE ADMIN CONSOLE.']));
 },
 /* read-only (supporters + the waitlist): every battalion's confirmed positions, no profiles or nominations */
 viewItems(it){
  const C=G.club, B=C.posBoard(), sup=G.activeAcct&&G.activeAcct.type==='sup';
  for(const bt of B){
   const filled=C.POSITIONS.filter(p=>bt.H[p.k]);
   it.push(CL.hdr(G.bn(bt.b)+' OFFICIAL POSITIONS',filled.length+' OF '+C.POSITIONS.length,'#ffd060'));
   filled.forEach(p=>it.push(posRowV(p.k,bt.H[p.k])));
  }
  if(!B.length) it.push(CL.note(['NO CONFIRMED POSITIONS YET.','THEY SHOW UP HERE ONCE THE CLUB CONFIRMS THEM.']));
  it.push(CL.note(sup?['THE RAGING KNIGHTS’ CONFIRMED POSITIONS,','BATTALION BY BATTALION.']:['NOMINATING AND CLAIMING A POSITION','OPEN UP ONCE YOU’RE APPROVED.']));
 },
 reviewItems(it){
  const C=G.club, Cl=C.posClaims(), N=C.nomGroups();
  if(Cl.length){ it.push(CL.hdr('POSITION CLAIMS • CONFIRM OR DECLINE',Cl.length,'#ffd060')); Cl.forEach(g=>it.push(claimCard(g))); }
  if(N.length){ it.push(CL.hdr('NOMINATIONS • ANONYMOUS',N.length,'#80e0ff')); N.forEach(x=>it.push(nomCard(x))); }
  if(!Cl.length&&!N.length) it.push(CL.note(['NOTHING TO REVIEW RIGHT NOW.','NEW CLAIMS AND NOMINATIONS SHOW UP HERE.'],'#a8ffc0'));
  it.push(CL.note(['CONFIRMING OR APPOINTING REPLACES WHOEVER HOLDS','THAT POSITION IN THE BATTALION. THE CLUB NEVER','SAVES WHO SENT A NOMINATION.']));
 },
 nomItems(it){
  const C=G.club, n=this.nom, B=battList();
  const sel=B.find(b=>C.sameBatt(b.bk,n.bk))||B[0];
  if(sel&&!C.sameBatt(sel.bk,n.bk)){ n.bk=sel.bk; n.b=sel.b; }
  it.push(chipItem(C.POSITIONS.map(p=>({id:p.k,label:p.t})),id=>id===n.k,id=>({kind:'nomk',k:id}),{title:'1. WHICH POSITION?'}));
  it.push(chipItem(B.map(b=>({id:b.bk,label:G.bn(b.b)})),id=>C.sameBatt(id,n.bk),id=>({kind:'nombk',bk:id}),{title:'2. WHICH BATTALION?',col:'#ffd060'}));
  const M=C.people().filter(g=>g.st==='approved'&&C.sameBatt(g.r.bk,n.bk)&&!C.isMine(g)).sort(byName);
  it.push(CL.hdr('3. WHO? TAP A '+G.bn(n.b)+' MEMBER',M.length,'#80e0ff'));
  M.forEach(g=>it.push(CL.member(g,{pick:{kind:'nompick',g}})));
  if(!M.length) it.push(CL.note(['NO OTHER APPROVED '+G.bn(n.b)+' MEMBERS YET.']));
  it.push(CL.note(['ANONYMOUS: YOUR NAME IS NEVER SAVED WITH IT.','THE CLUB ADMIN, OFFICERS AND THE '+(G.bn(n.b)||'BATTALION')+' POC SEE IT.'],'#a8ffc0'));
 },
 apItems(it){
  const C=G.club, a=this.ap, cur=C.posHolders(a.bk).filter(h=>h.pos===a.k);
  it.push(CL.hdr('APPOINT '+PT(a.b,a.k),null,'#ffd060'));
  if(cur.length) it.push(CL.note(['NOW: '+cur.map(h=>h.r.n).join(', ')+' • APPOINTING SOMEONE ELSE REPLACES THEM.'],'#ffd27a'));
  const M=C.people().filter(g=>g.st==='approved'&&C.sameBatt(g.r.bk,a.bk)&&cur.indexOf(g)<0&&C.canSetPos(g)).sort(byName);
  M.forEach(g=>it.push(CL.member(g,{pick:{kind:'appick',g}})));
  if(!M.length) it.push(CL.note(['NO OTHER APPROVED '+G.bn(a.b)+' MEMBERS YET.']));
  it.push(CL.action('CANCEL',{kind:'cancel'},'secondary'));
 },
 /* ---- actions ---- */
 startNom(k,bk,b){
  const C=G.club;
  this.nom={k:k||'',bk:bk||C.myBk(),b:b||(G.activeAcct&&G.activeAcct.battalion)||C.myBk(),g:null};
  this.setMode('nom'); AUDIO.sfx('ok');
 },
 startAppoint(k,bk,b){ this.ap={k,bk,b}; this.setMode('appoint'); AUDIO.sfx('ok'); },
 nomKey(g,k){ return G.pinHash(g.key+'#'+k); },   // this device remembers what it nominated, hashed (no names)
 whyL(){ const y=52; return {y,fx:18,fy:y+132,fw:234,fh:64,B:[{id:'send',label:'SUBMIT ANONYMOUSLY',kind:'primary',x:18,y:y+208,w:234,h:40,size:8.5},{id:'back',label:'BACK',x:18,y:y+256,w:234,h:32,size:7.5}]}; },
 openWhy(g){
  const C=G.club, n=this.nom, was=((G.save.nomd||{})[this.nomKey(g,n.k)]||0);
  if(Date.now()-was<30*86400000){ G.toast('YOU ALREADY NOMINATED '+g.r.n+' FOR '+C.posTitle(n.k),'#ffd27a'); AUDIO.sfx('buzzer'); return; }
  n.g=g; this.mode='nomwhy'; this.err=''; this.wst={f:0};
  const L=this.whyL();
  G.field('why',{x:L.fx,y:L.fy,w:L.fw,h:L.fh,max:200,multiline:true,align:'left',placeholder:'Optional: why are they a good fit?',onEnter:()=>this.submitNom(),onInput:()=>{ this.err=''; }});
  AUDIO.sfx('ok');
 },
 async submitNom(){
  const C=G.club, n=this.nom; if(this.busy||!n||!n.g) return;
  this.busy=true;
  const ok=await C.nominate(n.g,n.k,G.fieldVal('why'));
  this.busy=false;
  if(!ok){ this.err='COULDN’T SEND - CHECK YOUR CONNECTION'; AUDIO.sfx('buzzer'); return; }
  if(!G.save.nomd) G.save.nomd={};
  G.save.nomd[this.nomKey(n.g,n.k)]=Date.now();
  const K=Object.keys(G.save.nomd); if(K.length>80) K.sort((a,b)=>G.save.nomd[a]-G.save.nomd[b]).slice(0,K.length-80).forEach(k=>delete G.save.nomd[k]);
  G.persist();
  this.nom=null; this.setMode('list');
  G.toast('NOMINATION SENT • ANONYMOUSLY','#80ffa0'); AUDIO.sfx('cheer');
 },
 askAppoint(g,k,claim){
  const C=G.club, cur=C.posHolders(g.r.bk).filter(h=>h.pos===k&&h.key!==g.key);
  const lines=[[PT(g.r.b,k),'#ffd060',7.6]];
  if(cur.length) lines.push(['REPLACES '+cur.map(h=>h.r.n).join(', '),'#ffb0a0',7]);
  if(g.pos&&g.pos!==k) lines.push(['NO LONGER '+C.posTitle(g.pos),'#9a8f80',6.6]);
  this.modal=G.Modal({title:(claim?'CONFIRM ':'APPOINT ')+g.r.n+'?',lines,btns:[{id:'yes',label:claim?'✓ CONFIRM':'APPOINT',kind:'primary'},{id:'no',label:'CANCEL'}]});
  Object.assign(this.modal,{kind:'appoint',g,k});
 },
 async run(fn,msg,col,after){
  if(this.busy) return; this.busy=true;
  const ok=await fn(); this.busy=false; this.cache=null;
  if(!ok){ G.toast('COULDN’T SAVE - CHECK YOUR CONNECTION','#ff7030'); AUDIO.sfx('buzzer'); return; }
  G.toast(msg,col||'#80ffa0'); AUDIO.sfx('cheer');
  if(after) after();
 },
 onAct(a){
  if(!a) return;
  const C=G.club;
  if(a.open){ this.card.open(a.open); return; }
  switch(a.kind){
   case 'review': this.setMode('review'); AUDIO.sfx('ok'); return;
   case 'mypos': { const g=C.myGroup(); this.picker=PosPicker({title:'MY POSITION',sub:'YOUR POC OR AN OFFICER CONFIRMS IT',none:true,cur:(g&&(g.claim||g.pos))||''}); this.picker.kind='mypos'; AUDIO.sfx('ok'); return; }
   case 'nominate': this.startNom(a.k,a.bk,a.b); return;
   case 'nomk': this.nom.k=a.k; this.cache=null; AUDIO.sfx('blip'); return;
   case 'nombk': { const bt=battList().find(b=>C.sameBatt(b.bk,a.bk)); this.nom.bk=a.bk; this.nom.b=bt?bt.b:a.bk; this.cache=null; AUDIO.sfx('blip'); return; }
   case 'nompick':
    if(!this.nom.k){ G.toast('PICK A POSITION FIRST','#ffd27a'); AUDIO.sfx('buzzer'); this.list.sc.scroll=0; return; }
    this.openWhy(a.g); return;
   case 'appoint': this.startAppoint(a.k,a.bk,a.b); return;
   case 'appointb': this.picker=PosPicker({title:'APPOINT IN '+a.b,sub:'WHICH POSITION?'}); Object.assign(this.picker,{kind:'appointb',bk:a.bk,b:a.b}); AUDIO.sfx('ok'); return;
   case 'change':
    this.modal=G.Modal({title:PT(a.b,a.k),sub:'HELD BY '+a.g.r.n,btns:[{id:'replace',label:'APPOINT SOMEONE ELSE',kind:'primary'},{id:'remove',label:'REMOVE '+a.g.r.n,kind:'danger'},{id:'profile',label:'OPEN PROFILE'},{id:'no',label:'CANCEL',kind:'ghost'}]});
    Object.assign(this.modal,{kind:'change',a}); return;
   case 'appick': this.askAppoint(a.g,this.ap.k,false); return;
   case 'cancel': this.setMode('list'); AUDIO.sfx('back'); return;
   case 'confirmclaim': this.askAppoint(a.g,a.g.claim,true); return;
   case 'declineclaim': this.run(()=>C.declineClaim(a.g),a.g.r.n+'’S CLAIM DECLINED','#ffd27a'); return;
   case 'appointnom': if(a.x.g) this.askAppoint(a.x.g,a.x.p,false); return;
   case 'dismissnom':
    this.modal=G.Modal({title:'DISMISS?',titleCol:'#ff8060',lines:[[a.x.nn+' FOR '+C.posTitle(a.x.p),'#cfc4b0',7.4],[a.x.list.length+' NOMINATION'+(a.x.list.length===1?'':'S')+' WILL BE REMOVED.','#9a8f80',6.6]],btns:[{id:'yes',label:'DISMISS',kind:'danger'},{id:'no',label:'KEEP'}]});
    Object.assign(this.modal,{kind:'dismiss',x:a.x}); return;
  }
 },
 /* ---- update ---- */
 update(){
  const C=G.club;
  if(!G.clubAccess().ok){
   if(this.card.active()) this.card.close();
   if(this.mode!=='list'){ this.picker=null; this.modal=null; this.setMode('list'); }
   if(G.backHit()){ G.go(this.back); return; }
   if(C.viewOnly()) this.list.update(this.items(),this.area(),()=>{});
   else this.lock.update(56);
   return;
  }
  if(this.card.update()) return;
  if(this.modal){
   const r=this.modal.update();
   if(r==='no'||(r==null&&G.pressed.b)){ this.modal=null; return; }
   if(!r) return;
   const m=this.modal; this.modal=null;
   if(m.kind==='appoint'&&r==='yes') this.run(()=>C.setPosition(m.g,m.k),m.g.r.n+' IS NOW '+PT(m.g.r.b,m.k),'#80ffa0',()=>{ if(this.mode==='appoint') this.setMode('list'); });
   else if(m.kind==='change'){
    if(r==='replace') this.startAppoint(m.a.k,m.a.bk,m.a.b);
    else if(r==='profile') this.card.open(m.a.g);
    else if(r==='remove'){
     this.modal=G.Modal({title:'REMOVE '+m.a.g.r.n+'?',titleCol:'#ff8060',lines:[['AS '+PT(m.a.b,m.a.k),'#cfc4b0',7.4],['THE POSITION BECOMES VACANT.','#9a8f80',6.6]],btns:[{id:'yes',label:'REMOVE',kind:'danger'},{id:'no',label:'KEEP'}]});
     Object.assign(this.modal,{kind:'remove',g:m.a.g,k:m.a.k});
    }
   }
   else if(m.kind==='remove'&&r==='yes') this.run(()=>C.setPosition(m.g,''),m.g.r.n+' REMOVED AS '+C.posTitle(m.k),'#ffd27a');
   else if(m.kind==='dismiss'&&r==='yes') this.run(()=>C.clearNoms(n=>m.x.list.indexOf(n)>=0),'NOMINATION DISMISSED','#ffd27a');
   return;
  }
  if(this.picker){
   const r=this.picker.update(); if(!r) return;
   const p=this.picker; this.picker=null;
   if(r==='cancel'){ AUDIO.sfx('back'); return; }
   const k=r.slice(2);
   if(p.kind==='mypos'){
    const g=C.myGroup(), title=C.posTitle(k);
    const msg=k?(g&&g.pos===k?'YOU’RE ALREADY CONFIRMED AS '+title:title+': SENT TO YOUR POC TO CONFIRM'):(g&&g.pos?'YOU STEPPED DOWN AS '+C.posTitle(g.pos):'POSITION CLEARED');
    this.run(()=>C.claimPosition(k),msg,k?'#ffd060':'#ffd27a');
   } else if(p.kind==='appointb') this.startAppoint(k,p.bk,p.b);
   return;
  }
  if(this.mode==='nomwhy'){
   if(G.backHit()){ this.setMode('nom'); return; }
   const id=G.navList(this.wst,this.whyL().B,{noKeys:true});
   if(id==='send') this.submitNom(); else if(id==='back') this.setMode('nom');
   return;
  }
  if(G.backHit()){
   if(this.mode==='review'&&this.fromReview){ G.go(this.back); return; }
   if(this.mode!=='list'){ this.setMode('list'); return; }
   G.go(this.back); return;
  }
  if(this.mode==='list'){
   const t=G.segHit(8,48,254,30,2);
   if(t>=0&&t!==this.scope){ this.scope=t; this.list.reset(); this.cache=null; AUDIO.sfx('blip'); }
   if(G.pressed.left||G.pressed.right){ this.scope=1-this.scope; this.list.reset(); this.cache=null; AUDIO.sfx('blip'); }
  }
  this.list.update(this.items(),this.area(),a=>this.onAct(a));
 },
 /* ---- draw ---- */
 drawWhy(c){
  const C=G.club, n=this.nom, g=n.g, L=this.whyL(), y=L.y, bb=L.B[1];
  G.panel(10,y,250,bb.y+bb.h+40-y,{border:'rgba(128,224,255,.7)'});
  G.drawFace(CL.faceSrc(g),VW/2-29,y+12,58,g.r.n,'#80e0ff');
  G.txtO(g.r.n,VW/2,y+76,11,'#ffd060','center',230);
  G.txt('FOR '+PT(g.r.b,n.k),VW/2,y+96,7.6,'#80e0ff','center',230,800);
  G.txt('WHY THEM? (OPTIONAL)',18,y+118,6.2,'#b8ad9c','left',undefined,700);
  G.rrect(L.fx,L.fy,L.fw,L.fh,14); c.fillStyle='rgba(0,0,0,.4)'; c.fill();
  G.drawBtns(L.B,this.wst);
  const ny=bb.y+bb.h+10;
  if(this.err) G.txt(this.err,VW/2,ny,7,'#ff7a60','center',VW-24,700);
  else { G.txt('ANONYMOUS: YOUR NAME IS NEVER SAVED WITH IT.',VW/2,ny,6,'#a8ffc0','center',VW-24,700);
   G.txt('REVIEWERS SEE WHO, WHICH POSITION AND WHY.',VW/2,ny+13,6,'#9a8f80','center',VW-24,700); }
 },
 draw(c){
  const VH=G.VH;
  G.cover(G.img.bg_bikerdown,0,0,VW,VH); G.dim(.88);
  const T={list:'OFFICIAL POSITIONS',review:'REVIEW POSITIONS',nom:'NOMINATE',nomwhy:'NOMINATE',appoint:'APPOINT'}[this.mode];
  if(!G.clubAccess().ok){
   if(G.club.viewOnly()) this.list.draw(c,this.items(),this.area()); else this.lock.draw(c,56);
   G.topBar('OFFICIAL POSITIONS',{size:8.2}); return;
  }
  if(this.mode==='list'){ const me=G.activeAcct; G.seg(8,48,254,30,[G.bl(me.battalion)||'MY BATTALION','ENTIRE CLUB'],this.scope,7); }
  if(this.mode==='nomwhy') this.drawWhy(c);
  else this.list.draw(c,this.items(),this.area());
  G.topBar(T,{size:8.2});
  if(this.picker) this.picker.draw(c);
  if(this.modal) this.modal.draw(c);
  this.card.draw(c);
 }
};

/* ============================ BROTHERS FOR LIFE (B4L) ============================ */
function plaqueItem(n){
 return {h:84,draw(c,x,y,w){
  G.rrect(x,y+2,w,74,14);
  const gr=c.createLinearGradient(0,y,0,y+76); gr.addColorStop(0,'#3c2612'); gr.addColorStop(1,'#22150a'); c.fillStyle=gr; c.fill();
  c.strokeStyle='#d8a838'; c.lineWidth=1.6; c.stroke();
  G.rrect(x+5,y+7,w-10,64,10); c.strokeStyle='rgba(216,168,56,.35)'; c.lineWidth=1; c.stroke();
  G.txtO('B4L',x+w/2,y+11,19,'#ffd060','center');
  G.txt('BROTHERS FOR LIFE',x+w/2,y+40,8,'#f4e2b8','center',w-20,800);
  G.txt(n?n+(n===1?' BROTHER HAS':' BROTHERS HAVE')+' EARNED THE TITLE':'NO BROTHERS LISTED YET',x+w/2,y+56,6.2,'#c8a868','center',w-20,700);
 }};
}
function b4lRow(x){
 const C=G.club, g=C.b4lPerson(x), H=54;
 return {h:H+6,focus:true,x,
  draw(c,xx,y,w,foc){
   const press=G.held(xx,y,w,H);
   G.rrect(xx,y,w,H,12); c.fillStyle=press?'rgba(60,52,72,.96)':'rgba(36,26,14,.94)'; c.fill();
   c.strokeStyle=foc?'#ffd060':'rgba(255,208,96,.36)'; c.lineWidth=foc?2:1; c.stroke();
   G.drawFace(g?CL.faceSrc(g):null,xx+9,y+8,38,x.n,'#ffd060');
   G.txt(x.n,xx+55,y+8,9,'#ffd060','left',w-150,800);
   G.txt([G.nameLine(x),G.bn(x.b)].filter(Boolean).join(' • '),xx+55,y+24,6.4,'#e8dcc8','left',w-150,700);
   G.txt(g?'TAP FOR PROFILE':'NOT ON THE APP',xx+55,y+37,5.6,'#9a8f80','left',w-150,700);
   G.txt('B4L SINCE',xx+w-10,y+13,5.4,'#c8a868','right',undefined,800);
   G.txt(C.b4lDate(x.d),xx+w-10,y+24,7,'#f4ede2','right',90,800);
  },
  enter:()=>({kind:'b4l',x}), tap:()=>({kind:'b4l',x})};
}
/* read-only row (supporters + the waitlist): road name, battalion and the date - no profile */
function b4lRowV(x){
 const C=G.club, H=46;
 return {h:H+6,draw(c,xx,y,w){
  G.rrect(xx,y,w,H,12); c.fillStyle='rgba(36,26,14,.94)'; c.fill(); c.strokeStyle='rgba(255,208,96,.36)'; c.lineWidth=1; c.stroke();
  c.beginPath(); c.arc(xx+23,y+H/2,15,0,7); c.fillStyle='rgba(216,168,56,.16)'; c.fill();
  G.icon('medal',c,xx+23,y+H/2,17,'#ffd060');
  G.txt(x.n,xx+46,y+9,9,'#ffd060','left',w-150,800);
  G.txt(G.bn(x.b)||'BROTHER FOR LIFE',xx+46,y+25,6.4,'#e8dcc8','left',w-150,700);
  G.txt('B4L SINCE',xx+w-10,y+10,5.4,'#c8a868','right',undefined,800);
  G.txt(C.b4lDate(x.d),xx+w-10,y+21,7,'#f4ede2','right',90,800);
 }};
}
G.scenes.b4l={
 enter(a){
  a=a||{};
  this.back=a.back||'club';
  this.lock=G.LockPanel('view'); this.list=CL.List(); this.cache=null;
  this.mode='list'; this.dm=null; this.dmFrom='list'; this.modal=null; this.err=''; this.busy=false;
  this.card=G.MemberCard({hide:()=>G.hideFields(true),show:()=>G.hideFields(false)});
 },
 exit(){ this.card=null; },
 setMode(m){
  this.mode=m; this.list.reset(); this.cache=null; this.err='';
  if(m==='grant') G.field('bq',{x:8,y:52,w:254,h:32,fs:.32,max:24,upper:true,strip:/[^A-Z0-9 \-'.]/g,align:'left',placeholder:'SEARCH A MEMBER',enterHint:'search',
   onInput:()=>{ this.list.reset(); this.cache=null; },onEnter:()=>G.blurFields()});
  else G.removeField('bq');
 },
 area(){ const y=this.mode==='grant'?92:48; return {x:0,y,w:VW,h:G.VH-y-6}; },
 items(){
  const C=G.club, q=this.mode==='grant'?G.fieldVal('bq').trim().toUpperCase():'', vo=C.viewOnly();
  const key=[C.ver,Math.floor(Date.now()/20000),this.mode,vo,C.rosterState,C.loaded.b4l,q].join('|');
  if(this.cache&&this.cache.key===key) return this.cache.items;
  const it=[];
  if(!C.db) it.push(CL.note(['B4L NEEDS THE CLUB NETWORK.','GAMES AND YOUR RIDE LOG STILL WORK.'],'#ffd27a'));
  else if(vo){
   if(!C.loaded.b4l) it.push(CL.note(['LOADING…'],'#cfc4b0'));
   else {
    const L=C.b4lList();
    it.push(plaqueItem(L.length));
    L.forEach(x=>it.push(b4lRowV(x)));
    it.push(CL.note(L.length?['THE CLUB’S BROTHERS FOR LIFE AND THE','DAY EACH ONE EARNED THE TITLE.']:['NO BROTHERS FOR LIFE LISTED YET.']));
   }
  }
  else if(C.rosterState!=='live'||!C.loaded.b4l) it.push(CL.note(['LOADING…'],'#cfc4b0'));
  else if(this.mode==='grant'){
   it.push(CL.action('+ A BROTHER WHO ISN’T ON THE APP',{kind:'manual'},'ghost'));
   const M=C.people().filter(g=>g.st==='approved'&&!g.b4l&&(!q||[g.r.n,g.r.f,g.r.b].some(s=>String(s||'').toUpperCase().indexOf(q)>=0))).sort(byName);
   it.push(CL.hdr('PICK THE BROTHER',M.length,'#ffd060'));
   M.forEach(g=>it.push(CL.member(g,{pick:{kind:'gpick',g}})));
   if(!M.length) it.push(CL.note([q?'NO MEMBERS MATCH “'+q+'”.':'EVERY APPROVED MEMBER IS ALREADY B4L.']));
  } else {
   const L=C.b4lList();
   it.push(plaqueItem(L.length));
   if(C.admin) it.push(CL.action('+ GRANT B4L',{kind:'grant'},'primary'));
   L.forEach(x=>it.push(b4lRow(x)));
   if(!L.length) it.push(CL.note(C.admin?['NO BROTHERS FOR LIFE LISTED YET.','TAP + GRANT B4L TO ADD THE FIRST.']:['NO BROTHERS FOR LIFE LISTED YET.','THE CLUB ADMIN ADDS THEM HERE.']));
   else it.push(CL.note(['TAP A BROTHER FOR THEIR PROFILE CARD.','ONLY THE CLUB ADMIN GRANTS THE B4L TITLE.']));
  }
  CL.layout(it);
  this.cache={key,items:it};
  return it;
 },
 dateL(){
  const m=this.dm&&this.dm.manual, y0=60, dy=m?y0+170:y0+150;
  return {y0,dy,B:[{id:'save',label:this.dm&&this.dm.x?'SAVE DATE':'GRANT B4L',kind:'primary',x:18,y:dy+50,w:234,h:40,size:8.5},{id:'back',label:'BACK',x:18,y:dy+98,w:234,h:32,size:7.5}]};
 },
 openDate(o){
  const C=G.club;
  this.dmFrom=this.mode==='grant'?'grant':'list';
  G.removeField('bq');
  this.dm=Object.assign({st:{f:0}},o); this.mode='date'; this.err='';
  const L=this.dateL(), y0=L.y0;
  if(o.manual){
   G.field('mr',{x:18,y:y0+12,w:234,h:32,fs:.4,max:14,upper:true,strip:/[^A-Z0-9 \-'.]/g,align:'left',placeholder:'ROAD NAME',enterHint:'next',onEnter:()=>G.focusField('mf'),onInput:()=>{ this.err=''; }});
   G.field('mf',{x:18,y:y0+60,w:168,h:32,fs:.4,max:12,upper:true,strip:/[^A-Z \-'.]/g,align:'left',placeholder:'FIRST NAME',enterHint:'next',primary:false,onEnter:()=>G.focusField('ml')});
   G.field('ml',{x:194,y:y0+60,w:58,h:32,fs:.4,max:1,upper:true,strip:/[^A-Z]/g,align:'center',placeholder:'A-Z',enterHint:'next',primary:false,onEnter:()=>G.focusField('mb')});
   G.field('mb',{x:18,y:y0+108,w:234,h:32,fs:.4,max:1,digits:true,align:'left',placeholder:'BATTALION NUMBER (1-9)',enterHint:'next',primary:false,onEnter:()=>G.focusField('bd'),onInput:()=>{ this.err=''; }});
  }
  G.field('bd',{x:18,y:L.dy,w:234,h:36,type:'date',maxDate:C.today(),value:(o.x&&o.x.d)||C.today(),align:'left',primary:!o.manual,onEnter:()=>this.saveDate(),onInput:()=>{ this.err=''; }});
  if(o.manual) G.focusField('mr');
  AUDIO.sfx('ok');
 },
 closeDate(){ for(const id of ['mr','mf','ml','mb','bd']) G.removeField(id); this.dm=null; },
 async saveDate(){
  const C=G.club, dm=this.dm; if(this.busy||!dm) return;
  const d=G.fieldVal('bd');
  if(!C.validDay(d)){ this.err='PICK THE DATE IT WAS GRANTED (NOT IN THE FUTURE)'; AUDIO.sfx('buzzer'); return; }
  let e;
  if(dm.manual){
   const n=G.fieldVal('mr').trim(), b=G.fieldVal('mb').trim();
   if(n.length<2){ this.err='ENTER THEIR ROAD NAME'; AUDIO.sfx('buzzer'); G.focusField('mr'); return; }
   if(!/^[1-9]$/.test(b)){ this.err='ENTER THEIR BATTALION NUMBER (1-9)'; AUDIO.sfx('buzzer'); G.focusField('mb'); return; }
   e={n,f:G.fieldVal('mf').trim(),li:G.fieldVal('ml').trim(),b,d};
  } else if(dm.x){ const x=dm.x; e={id:x.id,g:C.b4lPerson(x),n:x.n,f:x.f,li:x.li,b:x.b,nk:x.nk,aid:x.aid,d}; }
  else e={g:dm.g,d};
  this.busy=true;
  const ok=await C.grantB4L(e);
  this.busy=false;
  if(!ok){ this.err=C.admin?'COULDN’T SAVE - CHECK YOUR CONNECTION':'ONLY THE CLUB ADMIN CAN GRANT B4L'; AUDIO.sfx('buzzer'); return; }
  const name=dm.x?dm.x.n:(dm.g?dm.g.r.n:String(e.n).toUpperCase());
  G.toast(dm.x?'B4L DATE UPDATED':name+' IS A BROTHER FOR LIFE','#ffd060'); AUDIO.sfx('cheer');
  this.closeDate(); this.setMode('list');
 },
 onAct(a){
  if(!a) return;
  const C=G.club;
  if(a.open){ this.card.open(a.open); return; }
  if(a.kind==='grant'){ this.setMode('grant'); AUDIO.sfx('ok'); return; }
  if(a.kind==='manual'){ this.openDate({manual:true}); return; }
  if(a.kind==='gpick'){ this.openDate({g:a.g}); return; }
  if(a.kind==='b4l'){
   const x=a.x, g=C.b4lPerson(x);
   if(C.admin){
    const B=[]; if(g) B.push({id:'profile',label:'OPEN PROFILE',kind:'primary'});
    B.push({id:'date',label:'CHANGE THE DATE'},{id:'remove',label:'REMOVE B4L TITLE',kind:'danger'},{id:'no',label:'CANCEL',kind:'ghost'});
    this.modal=G.Modal({title:x.n,sub:'B4L SINCE '+C.b4lDate(x.d),btns:B}); Object.assign(this.modal,{kind:'admin',x,g}); return;
   }
   if(g){ this.card.open(g); return; }
   this.modal=G.Modal({title:x.n,sub:[G.nameLine(x),G.bn(x.b)].filter(Boolean).join(' • '),lines:[['BROTHER FOR LIFE','#ffd060',8],['SINCE '+C.b4lDate(x.d),'#f4ede2',7.4],['NOT ON THE APP','#9a8f80',6.4]],btns:[{id:'no',label:'CLOSE'}]});
   this.modal.kind='info'; AUDIO.sfx('ok');
  }
 },
 update(){
  const C=G.club;
  if(!G.clubAccess().ok){
   if(this.card.active()) this.card.close();
   if(this.mode!=='list'){ this.closeDate(); this.modal=null; this.setMode('list'); }
   this.modal=null;
   if(G.backHit()){ G.go(this.back); return; }
   if(C.viewOnly()) this.list.update(this.items(),this.area(),()=>{});
   else this.lock.update(56);
   return;
  }
  if(this.card.update()) return;
  if(this.modal){
   const r=this.modal.update();
   if(r==='no'||(r==null&&G.pressed.b)){ this.modal=null; return; }
   if(!r) return;
   const m=this.modal; this.modal=null;
   if(m.kind==='admin'){
    if(r==='profile'&&m.g) this.card.open(m.g);
    else if(r==='date') this.openDate({x:m.x,g:m.g});
    else if(r==='remove'){ this.modal=G.Modal({title:'REMOVE B4L?',titleCol:'#ff8060',lines:[[m.x.n+' COMES OFF THE B4L LIST.','#cfc4b0',7.2]],btns:[{id:'yes',label:'REMOVE TITLE',kind:'danger'},{id:'no',label:'KEEP IT'}]}); Object.assign(this.modal,{kind:'remove',x:m.x}); }
   } else if(m.kind==='remove'&&r==='yes'){
    C.removeB4L(m.x).then(ok=>{ this.cache=null; G.toast(ok?'B4L TITLE REMOVED':'COULDN’T SAVE - ONLY THE CLUB ADMIN CAN CHANGE B4L',ok?'#ffd27a':'#ff7030'); });
   }
   return;
  }
  if(this.mode==='date'){
   if(G.backHit()){ const to=this.dmFrom; this.closeDate(); this.setMode(to); return; }
   const id=G.navList(this.dm.st,this.dateL().B,{noKeys:true});
   if(id==='save') this.saveDate(); else if(id==='back'){ const to=this.dmFrom; this.closeDate(); this.setMode(to); }
   return;
  }
  if(G.backHit()){ if(this.mode==='grant'){ this.setMode('list'); return; } G.go(this.back); return; }
  this.list.update(this.items(),this.area(),a=>this.onAct(a));
 },
 drawDate(c){
  const C=G.club, dm=this.dm, L=this.dateL(), y0=L.y0;
  if(dm.manual){
   G.txt('A BROTHER WHO ISN’T ON THE APP',VW/2,y0-12,6.6,'#ffd060','center',VW-20,800);
   [['ROAD NAME',18,y0],['FIRST NAME',18,y0+48],['LAST INITIAL',194,y0+48],['BATTALION NUMBER',18,y0+96]].forEach(t=>G.txt(t[0],t[1],t[2],6,'#b8ad9c','left',undefined,700));
   [[18,y0+12,234],[18,y0+60,168],[194,y0+60,58],[18,y0+108,234]].forEach(r=>{ G.rrect(r[0],r[1],r[2],32,13); c.fillStyle='rgba(0,0,0,.4)'; c.fill(); });
  } else {
   const g=dm.g, x=dm.x, n=g?g.r.n:x.n, line=g?[G.nameLine(g.r),G.bn(g.r.b)].filter(Boolean).join(' • '):[G.nameLine(x),G.bn(x.b)].filter(Boolean).join(' • ');
   G.drawFace(g?CL.faceSrc(g):null,VW/2-30,y0+2,60,n,'#ffd060');
   G.txtO(n,VW/2,y0+70,12,'#ffd060','center',VW-30);
   G.txt(line,VW/2,y0+92,7,'#e8dcc8','center',VW-30,700);
   G.txt(x?'B4L SINCE '+C.b4lDate(x.d):'BROTHER FOR LIFE',VW/2,y0+108,6.6,'#c8a868','center',VW-30,800);
  }
  G.txt('DATE THE TITLE WAS GRANTED',18,L.dy-13,6.2,'#b8ad9c','left',undefined,700);
  G.rrect(18,L.dy,234,36,14); c.fillStyle='rgba(0,0,0,.4)'; c.fill();
  G.drawBtns(L.B,dm.st);
  const by=L.B[1].y+L.B[1].h;
  if(this.err) G.txt(this.err,VW/2,by+10,6.8,'#ff7a60','center',VW-20,700);
  else G.txt('ONLY THE CLUB ADMIN CAN GRANT OR CHANGE B4L',VW/2,by+10,6,'#8a7f70','center',VW-20,700);
 },
 draw(c){
  const VH=G.VH;
  G.cover(G.img.bg_convoy,0,0,VW,VH,.35); G.dim(.86);
  const T=this.mode==='list'?'BROTHERS FOR LIFE':(this.dm&&this.dm.x?'CHANGE B4L DATE':'GRANT B4L');
  if(!G.clubAccess().ok){
   if(G.club.viewOnly()) this.list.draw(c,this.items(),this.area()); else this.lock.draw(c,56);
   G.topBar('BROTHERS FOR LIFE',{size:8.2}); return;
  }
  if(this.mode==='date') this.drawDate(c);
  else {
   if(this.mode==='grant'){ G.rrect(8,52,254,32,14); c.fillStyle='rgba(0,0,0,.35)'; c.fill(); }
   this.list.draw(c,this.items(),this.area());
  }
  G.topBar(T,{size:8.2});
  if(this.modal) this.modal.draw(c);
  this.card.draw(c);
 }
};
})();
