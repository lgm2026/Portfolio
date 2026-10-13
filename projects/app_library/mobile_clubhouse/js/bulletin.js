/* ANNOUNCEMENTS (with an audience on every post), PAYMENTS / DONATE and the RKFFMC SHOP (open to everyone).
   ANNOUNCEMENTS: a battalion's POC posts to their battalion; club officers and the club admin can post to any battalion
   or to ALL BATTALIONS. Each post is PUBLIC (everyone - supporters and guests too), MEMBERS (approved members) or
   OFFICERS (admin, officers, POCs and confirmed position holders). Members see their battalion's posts plus club-wide
   ones they're allowed to see; supporters and guests see only PUBLIC posts.
   PAYMENTS / SHOP: open the club's payment link (e.g. Venmo) and, once it exists, the club's e-shop. Approved members
   see the club-wide and battalion dues links; everyone else gets DONATE (the club-wide link). Only the club admin can
   set these links (enforced by the arcade's sharing rules); the payment itself happens on the linked site. */
(function(){
const VW=G.VW, CL=G.CL;
const fmtAgo=ts=>G.club.ago(ts);
function wrapBody(text,size,w){ const out=[]; String(text||'').split(/\n/).forEach(p=>{ const L=p.trim()?G.wrap(p,size,w,600):['']; L.forEach(l=>out.push(l)); }); while(out.length&&!out[out.length-1]) out.pop(); return out; }

/* ============================ ANNOUNCEMENTS ============================ */
G.scenes.news={
 enter(){
  this.list=CL.List(); this.mode='list'; this.confirm=null; this.cache=null; this.busy=false;
  this.seenAt=((G.save.seen||{}).ann)||0;
  G.club.markAnnSeen();
 },
 items(){
  const C=G.club, key=[C.ver,Math.floor(Date.now()/30000),C.loaded.anns,G.clubAccess().ok].join('|');
  if(this.cache&&this.cache.key===key) return this.cache.items;
  const it=[], me=G.activeAcct;
  if(!C.db) it.push(CL.note(['ANNOUNCEMENTS NEED THE CLUB NETWORK.'],'#ffd27a'));
  else if(!C.loaded.anns) it.push(CL.note(['LOADING ANNOUNCEMENTS…']));
  else {
   const member=G.clubAccess().ok;
   if(C.canAnnounce()) it.push(CL.action('+ POST AN ANNOUNCEMENT',{kind:'compose'},'primary'));
   const A=C.myAnns();
   if(!A.length) it.push(CL.note(C.canAnnounce()?['NO ANNOUNCEMENTS YET.','POST ONE TO REACH YOUR '+(C.canManage()?'MEMBERS':(G.bn(me.battalion)||'BATTALION')+' MEMBERS')+'.']:(member?['NO ANNOUNCEMENTS YET.','YOUR BATTALION POC POSTS NEWS HERE.']:['NO PUBLIC NEWS RIGHT NOW.','CHECK BACK SOON!'])));
   for(const a of A) it.push(this.card(a));
   if(member) it.push(CL.note([(G.bn(me.battalion)||'YOUR BATTALION')+' + CLUB-WIDE NEWS • POSTED BY POCS AND OFFICERS']));
   else it.push(CL.note(G.activeAcct&&G.activeAcct.type==='sup'?['SUPPORTERS SEE THE CLUB’S PUBLIC NEWS.','THANKS FOR BACKING THE RAGING KNIGHTS!']:['PUBLIC NEWS FROM THE RAGING KNIGHTS FFMC.','MEMBERS SEE MORE AFTER THEY LOG IN.']));
  }
  CL.layout(it);
  this.cache={key,items:it};
  return it;
 },
 card(a){
  const C=G.club, W=254, inner=W-24;
  const tl=G.wrap(a.t,8.6,inner,800).slice(0,3), bl=wrapBody(a.body,7,inner);
  const H=40+tl.length*13+(bl.length?bl.length*11.5+6:0)+24, del=C.canDeleteAnn(a), unread=a.at>this.seenAt&&a.byId!==(G.activeAcct&&G.activeAcct.id);
  return {h:H+8,focus:true,a,
   draw(c,x,y,w,foc){
    G.rrect(x,y,w,H,12); c.fillStyle='rgba(30,28,40,.95)'; c.fill();
    c.strokeStyle=foc?'#ffd060':(unread?'rgba(255,200,90,.7)':'rgba(255,255,255,.1)'); c.lineWidth=foc||unread?1.6:1; c.stroke();
    if(unread){ G.rrect(x,y+10,4,H-20,2); c.fillStyle='#ffb040'; c.fill(); }
    const all=a.bk==='ALL', au=C.audOf(a);
    const cw=G.chip(all?'ALL BATTALIONS':G.bl(a.b||a.bk),x+12,y+10,{size:5.6,col:all?'#20100a':'#06202c',bg:all?'#ffd060':'#80e0ff'});
    G.chip(au.v==='off'?'OFFICERS ONLY':au.t,x+16+cw,y+10,{size:5.6,col:au.col,bg:'rgba(0,0,0,.35)',border:au.col});
    G.txt(fmtAgo(a.at),x+w-12,y+12,6,'#9a8f80','right',90,700);
    let yy=y+32;
    tl.forEach(l=>{ G.txt(l,x+12,yy,8.6,'#ffd060','left',w-24,800); yy+=13; });
    if(bl.length){ yy+=4; bl.forEach(l=>{ G.txt(l,x+12,yy,7,'#ece2d2','left',w-24,600); yy+=11.5; }); }
    G.txt('— '+a.by+(a.role?' • '+a.role:''),x+12,y+H-17,6,'#b8ad9c','left',w-90,700);
    if(del) G.txt('✕ DELETE',x+w-12,y+H-17,6,'#ff9a80','right',undefined,800);
   },
   tap(lx,ly,w){ if(del&&lx>w-70&&ly>H-26) return {kind:'delete',a}; return null; }};
 },
 /* ---- compose ---- */
 startCompose(){
  const C=G.club; this.mode='compose'; this.err=''; this.targets=C.annTargets(); this.tg=this.targets[0]; this.aud='mem';
  if(C.canManage()){ const mine=this.targets.find(t=>t.bk===C.myBk()); if(mine) this.tg=mine; }
  const L=this.CL();
  G.field('at',{x:12,y:L.ty,w:246,h:34,max:60,align:'left',placeholder:'e.g. Ride Saturday 9AM',enterHint:'next',onEnter:()=>G.focusField('ab'),onInput:()=>{ this.err=''; }});
  G.field('ab',{x:12,y:L.by,w:246,h:L.bh,max:600,multiline:true,align:'left',placeholder:'Details for your members…',primary:false,onEnter:()=>this.post(),onInput:()=>{ this.err=''; }});
  G.focusField('at');
  AUDIO.sfx('ok');
 },
 audRects(){ const w=(246-12)/3, R=this.chipRects(), y=(R.length?R[R.length-1].y:66)+36; return G.club.AUDS.map((a,i)=>({x:12+i*(w+6),y,w,h:22,a})); },
 chipRects(){
  const R=[]; let x=12, y=66;
  for(const t of this.targets||[]){ const label=t.bk==='ALL'?'ALL BATTALIONS':G.bn(t.b); const w=G.tw(label,6.4,700)+18; if(x+w>VW-12){ x=12; y+=24; } R.push({x,y,w,h:20,t,label}); x+=w+6; }
  return R;
 },
 CL(){
  const R=this.chipRects(), cb=(R.length?R[R.length-1].y+20:66)+46;
  const ty=cb+22, by=ty+34+22, bh=Math.max(84,Math.min(150,G.VH-by-110));
  return {ty,by,bh,post:{id:'post',label:'POST ANNOUNCEMENT',kind:'primary',x:22,y:by+bh+12,w:226,h:40,size:8.5},cancel:{id:'cancel',label:'CANCEL',x:22,y:by+bh+60,w:226,h:32,size:7.5}};
 },
 topPost(){ const t='POST', w=G.tw(t,7,800)+24; return {x:VW-6-w,y:8,w,h:25,t}; },
 async post(){
  if(this.busy) return;
  const t=G.fieldVal('at').trim(), body=G.fieldVal('ab').trim();
  if(t.length<3){ this.err='ADD A HEADLINE (3+ CHARACTERS)'; AUDIO.sfx('buzzer'); G.focusField('at'); return; }
  this.busy=true;
  const ok=await G.club.postAnn(this.tg,t,body,this.aud);
  this.busy=false;
  if(!ok){ this.err='COULDN’T POST - CHECK YOUR CONNECTION'; AUDIO.sfx('buzzer'); return; }
  G.toast('POSTED TO '+(this.tg.bk==='ALL'?'ALL BATTALIONS':G.bl(this.tg.b))+' • '+G.club.audOf({v:this.aud}).t,'#80ffa0'); AUDIO.sfx('cheer');
  G.removeField('at'); G.removeField('ab'); this.mode='list'; this.cache=null; this.list.reset();
  G.club.markAnnSeen();
 },
 cancelCompose(){ G.removeField('at'); G.removeField('ab'); this.mode='list'; this.err=''; },
 update(){
  if(this.mode==='compose'&&!G.club.canAnnounce()) this.cancelCompose();
  if(this.confirm){
   const r=this.confirm.update();
   if(r==='no'||(r==null&&G.pressed.b)){ this.confirm=null; return; }
   if(r==='yes'){ const a=this.confirm.a; this.confirm=null;
    G.club.deleteAnn(a).then(ok=>{ this.cache=null; G.toast(ok?'ANNOUNCEMENT DELETED':'COULDN’T DELETE',ok?'#ffd27a':'#ff7030'); }); }
   return;
  }
  if(this.mode==='compose'){
   if(G.backHit()){ this.cancelCompose(); return; }
   const tp=this.topPost(); if(G.clicked(tp.x,tp.y,tp.w,tp.h)){ this.post(); return; }
   for(const r of this.chipRects()) if(G.clicked(r.x,r.y-2,r.w,r.h+4)){ this.tg=r.t; AUDIO.sfx('blip'); return; }
   for(const r of this.audRects()) if(G.clicked(r.x,r.y-2,r.w,r.h+4)){ this.aud=r.a.v; AUDIO.sfx('blip'); return; }
   const L=this.CL(), id=G.navList(this.st||(this.st={f:0}),[L.post,L.cancel],{noKeys:true});
   if(id==='post') this.post(); else if(id==='cancel') this.cancelCompose();
   return;
  }
  if(G.backHit()){ G.go('club'); return; }
  this.list.update(this.items(),{x:0,y:48,w:VW,h:G.VH-54},a=>{
   if(!a) return;
   if(a.kind==='compose') this.startCompose();
   else if(a.kind==='delete'){ this.confirm=G.Modal({title:'DELETE THIS ANNOUNCEMENT?',titleCol:'#ff8060',lines:[[a.a.t.slice(0,40),'#cfc4b0',7]],btns:[{id:'yes',label:'DELETE',kind:'danger'},{id:'no',label:'KEEP IT'}]}); this.confirm.a=a.a; }
  });
 },
 draw(c){
  const VH=G.VH;
  G.cover(G.img.bg_charity,0,0,VW,VH); G.dim(.88);
  if(this.mode==='compose'){
   const L=this.CL();
   G.txt('POST TO',12,50,6.4,'#b8ad9c','left',undefined,700);
   for(const r of this.chipRects()){ const on=r.t===this.tg;
    G.rrect(r.x,r.y,r.w,r.h,10); c.fillStyle=on?'#80e0ff':'rgba(255,255,255,.07)'; c.fill(); c.strokeStyle=on?'#80e0ff':'rgba(255,255,255,.2)'; c.lineWidth=1; c.stroke();
    G.txt(r.label,r.x+r.w/2,r.y+5,6.4,on?'#06202c':'#e0d6c4','center',undefined,800); }
   if(!G.club.canManage()) G.txt('POCS POST TO THEIR OWN BATTALION',VW-12,50,5.6,'#8a7f70','right',undefined,700);
   { const A=this.audRects(), au=G.club.audOf({v:this.aud});
     G.txt('WHO CAN SEE IT',12,A[0].y-12,6.4,'#b8ad9c','left',undefined,700);
     G.txt(au.d,VW-12,A[0].y-12,5.6,au.col,'right',150,700);
     for(const r of A){ const on=r.a.v===this.aud; G.rrect(r.x,r.y,r.w,r.h,11); c.fillStyle=on?r.a.col:'rgba(255,255,255,.07)'; c.fill(); c.strokeStyle=on?r.a.col:'rgba(255,255,255,.2)'; c.lineWidth=1; c.stroke();
      G.txt(r.a.t,r.x+r.w/2,r.y+6,6.6,on?'#10141a':'#e0d6c4','center',r.w-6,800); } }
   G.txt('HEADLINE',12,L.ty-13,6.4,'#b8ad9c','left',undefined,700);
   G.rrect(12,L.ty,246,34,14); c.fillStyle='rgba(0,0,0,.4)'; c.fill();
   G.txt('DETAILS (OPTIONAL)',12,L.by-13,6.4,'#b8ad9c','left',undefined,700);
   G.rrect(12,L.by,246,L.bh,14); c.fillStyle='rgba(0,0,0,.4)'; c.fill();
   G.drawBtns([L.post,L.cancel],this.st);
   if(this.err) G.txt(this.err,VW/2,L.cancel.y+L.cancel.h+8,7,'#ff7a60','center',VW-20,700);
   G.topBar('NEW ANNOUNCEMENT',{size:7.8});
   const tp=this.topPost(), press=G.held(tp.x,tp.y,tp.w,tp.h); G.glowFill(tp.x,tp.y+(press?1:0),tp.w,tp.h,12.5); G.txt(tp.t,tp.x+tp.w/2,tp.y+7.5+(press?1:0),7,'#16100a','center',undefined,800);
   return;
  }
  this.list.draw(c,this.items(),{x:0,y:48,w:VW,h:VH-54});
  G.topBar('ANNOUNCEMENTS',{size:8.6});
  if(this.confirm) this.confirm.draw(c);
 }
};

/* ============================ link editor (club admin) ============================ */
function LinkEditor(scene){
 return {
  open(kind,bk,label,cur){
   this.on=true; this.kind=kind; this.bk=bk||''; this.label=label; this.err=''; this.st={f:0};
   G.field('url',{x:16,y:118,w:238,h:38,max:300,align:'left',placeholder:kind==='shop'?'https://shop.example.com':'https://venmo.com/u/YourClub',value:cur||'',enterHint:'done',onEnter:()=>this.save(),onInput:()=>{ this.err=''; }});
   G.focusField('url');
  },
  close(){ this.on=false; G.removeField('url'); if(scene.onEditClose) scene.onEditClose(); },
  btns(){ const B=[{id:'save',label:'SAVE LINK',kind:'primary',x:16,y:166,w:238,h:40,size:8.5}];
   if(G.club.link(this.kind,this.bk)) B.push({id:'remove',label:'REMOVE LINK',kind:'danger',x:16,y:214,w:116,h:32,size:7.2},{id:'cancel',label:'CANCEL',x:138,y:214,w:116,h:32,size:7.2});
   else B.push({id:'cancel',label:'CANCEL',x:16,y:214,w:238,h:32,size:7.2});
   return B; },
  async save(remove){
   const C=G.club, url=remove?'':C.cleanUrl(G.fieldVal('url'));
   if(url===null||(!remove&&!url)){ this.err='ENTER A WEB LINK (E.G. VENMO.COM/U/YOURCLUB)'; AUDIO.sfx('buzzer'); return; }
   const ok=await C.setLink(this.kind,url,this.bk);
   if(!ok){ this.err='ONLY THE CLUB ADMIN CAN CHANGE LINKS'; AUDIO.sfx('buzzer'); return; }
   G.toast(remove?'LINK REMOVED':'LINK SAVED','#80ffa0'); AUDIO.sfx('cheer'); this.close();
  },
  update(){
   if(G.backHit()){ this.close(); return; }
   const id=G.navList(this.st,this.btns(),{noKeys:true});
   if(id==='save') this.save(); else if(id==='remove') this.save(true); else if(id==='cancel') this.close();
  },
  draw(c){
   G.dim(.7);
   G.panel(8,52,254,206,{border:'rgba(255,176,96,.8)'});
   G.txt(this.label,VW/2,64,8.4,'#ffd060','center',236,800);
   G.txt('PASTE THE LINK MEMBERS SHOULD OPEN',VW/2,82,6.2,'#cfc4b0','center',236,700);
   G.txt('VENMO, PAYPAL, CASH APP, SQUARE OR ANY SECURE WEB PAGE',VW/2,96,5.6,'#9a8f80','center',236,700);
   G.rrect(16,118,238,38,14); c.fillStyle='rgba(0,0,0,.45)'; c.fill();
   G.drawBtns(this.btns(),this.st);
   if(this.err) G.txt(this.err,VW/2,250,6.4,'#ff7a60','center',236,700);
  }
 };
}
/* a big "open this link" button that is a real link under the hood (so phones open it reliably) */
function linkBtn(id,url,b){
 const f=G.fields[id];
 if(!url){ if(f) G.removeField(id); return; }
 if(!f||f.o.href!==url||f.rect.y!==b.y||f.rect.x!==b.x) G.linkField(id,{href:url,x:b.x,y:b.y,w:b.w,h:b.h,label:b.label,onTap:()=>AUDIO.sfx('ok')});
}

/* ============================ PAYMENTS ============================ */
/* approved members: club-wide + battalion dues links. Everyone else (supporters, guests, the waitlist): DONATE through
   the club-wide link. */
G.scenes.pay={
 enter(){ this.ed=LinkEditor(this); this.list=CL.List(); this.manage=false; },
 donBtn(){ const y=Math.round(G.VH*.56); return {x:30,y,w:210,h:46,label:'DONATE'}; },
 rows(){
  const C=G.club, me=G.activeAcct, b=G.bl(me.battalion)||'MY BATTALION';
  return [{key:'club',title:'RKFFMC (CLUB-WIDE)',sub:'DUES, DONATIONS AND CLUB EVENTS',url:C.link('pay'),bk:''},
          {key:'batt',title:b,sub:'YOUR BATTALION’S DUES AND EVENTS',url:C.link('pay',C.myBk()),bk:C.myBk()}];
 },
 cardY(i){ return 92+i*112; },
 btnRect(i){ return {x:22,y:this.cardY(i)+58,w:G.club.admin?150:226,h:38,label:'PAY'}; },
 editRect(i){ return {x:180,y:this.cardY(i)+58,w:68,h:38}; },
 otherItems(){
  const C=G.club, it=[], seen=new Set([String(C.myBk()).replace(/-/g,'')]);
  it.push(CL.hdr('BATTALION PAYMENT LINKS',null,'#ffd060'));
  for(const g of C.people()){ if(g.st!=='approved') continue; const k=String(g.r.bk).replace(/-/g,''); if(seen.has(k)) continue; seen.add(k);
   const url=C.link('pay',g.r.bk), bk=g.r.bk, name=g.r.b||bk;
   it.push({h:52,focus:true,draw(c,x,y,w,foc){ G.rrect(x,y,w,46,10); c.fillStyle='rgba(30,28,40,.94)'; c.fill(); c.strokeStyle=foc?'#ffd060':'rgba(255,255,255,.1)'; c.lineWidth=1; c.stroke();
     G.txt(G.bl(name),x+12,y+9,8,'#f4ede2','left',150,800); G.txt(url?C.linkLabel(url):'NOT SET UP YET',x+12,y+27,6,url?'#9fd8ff':'#9a8f80','left',160,700);
     G.button({x:x+w-74,y:y+8,w:66,h:30,label:url?'CHANGE':'SET',kind:'ghost',size:7}); },
    tap:()=>({kind:'edit',bk,label:G.bl(name)+' PAYMENT LINK'}),enter:()=>({kind:'edit',bk,label:G.bl(name)+' PAYMENT LINK'})});
  }
  if(it.length===1) it.push(CL.note(['NO OTHER BATTALIONS ON THE ROSTER YET.']));
  it.push(CL.action('DONE',{kind:'done'},'secondary'));
  return it;
 },
 onEditClose(){ this.lastKey=''; },
 update(){
  const C=G.club;
  if(!G.clubAccess().ok){
   if(this.ed.on) this.ed.close();
   this.manage=false; G.removeField('pay1');
   if(G.backHit()){ G.removeField('pay0'); G.go('club'); return; }
   linkBtn('pay0',C.link('pay'),this.donBtn());
   return;
  }
  if(this.ed.on){ G.removeField('pay0'); G.removeField('pay1'); this.ed.update(); return; }
  if(this.manage){
   G.removeField('pay0'); G.removeField('pay1');
   if(G.backHit()){ this.manage=false; return; }
   this.list.update(this.otherItems(),{x:0,y:48,w:VW,h:G.VH-54},a=>{ if(!a) return; if(a.kind==='done'){ this.manage=false; return; } if(a.kind==='edit') this.ed.open('pay',a.bk,a.label,C.link('pay',a.bk)); });
   return;
  }
  if(G.backHit()){ G.go('club'); return; }
  const R=this.rows();
  R.forEach((r,i)=>linkBtn('pay'+i,r.url,this.btnRect(i)));
  if(C.admin){
   R.forEach((r,i)=>{ const e=this.editRect(i); if(G.clicked(e.x,e.y,e.w,e.h)){ AUDIO.sfx('ok'); this.ed.open('pay',r.bk,r.title+' PAYMENT LINK',r.url); } });
   const m=this.manageBtn(); if(G.clicked(m.x,m.y,m.w,m.h)){ AUDIO.sfx('ok'); this.manage=true; this.list.reset(); }
  }
 },
 manageBtn(){ return {id:'manage',label:'OTHER BATTALIONS’ LINKS',kind:'ghost',x:22,y:this.cardY(2)+4,w:226,h:32,size:7.4}; },
 draw(c){
  const VH=G.VH, C=G.club;
  G.cover(G.img.bg_dining,0,0,VW,VH); G.dim(.88);
  if(!G.clubAccess().ok){ this.drawDonate(c); return; }
  if(this.manage){ this.list.draw(c,this.otherItems(),{x:0,y:48,w:VW,h:VH-54}); G.topBar('PAYMENT LINKS'); if(this.ed.on) this.ed.draw(c); return; }
  G.txt('PAY CLUB DUES, DONATIONS AND EVENT FEES',VW/2,52,7,'#e8dcc8','center',VW-20,800);
  G.txt('THROUGH THE CLUB’S OFFICIAL LINKS',VW/2,66,6.4,'#b8ad9c','center',VW-20,700);
  this.rows().forEach((r,i)=>{
   const y=this.cardY(i);
   G.panel(12,y,246,104,{border:r.url?'rgba(128,255,160,.45)':'rgba(255,255,255,.14)'});
   G.icon('wallet',c,30,y+22,18,r.url?'#80ffa0':'#9a8f80');
   G.txt(r.title,46,y+12,8.6,'#ffd060','left',200,800);
   G.txt(r.sub,46,y+28,5.8,'#b8ad9c','left',200,700);
   G.txt(r.url?'OPENS '+C.linkLabel(r.url):'NOT SET UP YET'+(C.admin?' • TAP SET LINK':''),24,y+44,6,r.url?'#9fd8ff':'#9a8f80','left',222,700);
   const b=this.btnRect(i);
   if(r.url) G.button({x:b.x,y:b.y,w:b.w,h:b.h,label:'PAY ↗',kind:'primary',size:9});
   else G.button({x:b.x,y:b.y,w:b.w,h:b.h,label:'NOT AVAILABLE YET',kind:'secondary',size:7.4,disabled:true});
   if(C.admin){ const e=this.editRect(i); G.button({x:e.x,y:e.y,w:e.w,h:e.h,label:r.url?'CHANGE':'SET LINK',kind:'ghost',size:6.8}); }
  });
  let ny=this.cardY(2)+8;
  if(C.admin){ G.button(this.manageBtn()); ny+=44; }
  ['PAYMENTS HAPPEN ON THE LINKED SITE. THE ARCADE NEVER','SEES OR STORES CARD OR BANK DETAILS.','ONLY THE CLUB ADMIN CAN SET OR CHANGE THESE LINKS.','ARCADE POINTS ARE NEVER MONEY.']
   .forEach((l,i)=>G.txt(l,VW/2,ny+i*13,5.8,i===3?'#80ffa0':'#8a7f70','center',VW-20,700));
  G.topBar('PAYMENTS');
  if(this.ed.on) this.ed.draw(c);
 },
 drawDonate(c){
  const VH=G.VH, C=G.club, url=C.link('pay'), cw=Math.min(150,VH*.26), ch=cw*1.068, cy=Math.round(VH*.1);
  if(G.img.crest){ c.save(); c.shadowColor='rgba(255,120,30,.45)'; c.shadowBlur=20; c.drawImage(G.img.crest,VW/2-cw/2,cy,cw,ch); c.restore(); }
  const ty=cy+ch+14, b=this.donBtn();
  G.txtO('SUPPORT THE CLUB',VW/2,ty,13,'#ffd060','center',VW-30);
  G.txt('DONATE TO THE RAGING KNIGHTS FFMC',VW/2,ty+24,7,'#e8dcc8','center',VW-30,700);
  G.txt('THROUGH THE CLUB’S OFFICIAL PAYMENT LINK',VW/2,ty+38,6.4,'#b8ad9c','center',VW-30,700);
  if(url){
   G.button({x:b.x,y:b.y,w:b.w,h:b.h,label:'DONATE ↗',kind:'primary',size:9.5});
   G.txt('OPENS '+C.linkLabel(url),VW/2,b.y-14,6,'#9fd8ff','center',VW-30,700);
  } else G.button({x:b.x,y:b.y,w:b.w,h:b.h,label:'NOT SET UP YET',kind:'secondary',size:8,disabled:true});
  ['DONATIONS HAPPEN ON THE LINKED SITE. THE APP NEVER','SEES OR STORES CARD OR BANK DETAILS.','ARCADE POINTS ARE NEVER MONEY.']
   .forEach((l,i)=>G.txt(l,VW/2,b.y+b.h+18+i*13,5.8,i===2?'#80ffa0':'#8a7f70','center',VW-20,700));
  G.topBar('DONATE');
 }
};

/* ============================ RKFFMC SHOP (open to everyone) ============================ */
G.scenes.shop={
 enter(){ this.ed=LinkEditor(this); },
 btn(){ const y=Math.round(G.VH*.56); return {x:30,y,w:210,h:46,label:'OPEN THE SHOP'}; },
 editBtn(){ const b=this.btn(); return {id:'edit',label:G.club.link('shop')?'CHANGE SHOP LINK':'SET SHOP LINK',kind:'ghost',x:30,y:b.y+58,w:210,h:34,size:7.6}; },
 update(){
  const adm=G.club.admin&&G.clubAccess().ok;   // the club admin, signed in to their member account
  if(this.ed.on&&!adm) this.ed.close();
  if(this.ed.on){ G.removeField('shop0'); this.ed.update(); return; }
  if(G.backHit()){ G.go('club'); return; }
  linkBtn('shop0',G.club.link('shop'),this.btn());
  if(adm){ const e=this.editBtn(); if(G.clicked(e.x,e.y,e.w,e.h)){ AUDIO.sfx('ok'); this.ed.open('shop','','RKFFMC SHOP LINK',G.club.link('shop')); } }
 },
 draw(c){
  const VH=G.VH, C=G.club;
  G.cover(G.img.bg_convoy,0,0,VW,VH,.35); G.dim(.82);
  const url=C.link('shop'), cw=Math.min(150,VH*.26), ch=cw*1.068, cy=Math.round(VH*.1);
  if(G.img.crest){ c.save(); c.shadowColor='rgba(255,120,30,.45)'; c.shadowBlur=20; c.drawImage(G.img.crest,VW/2-cw/2,cy,cw,ch); c.restore(); }
  const ty=cy+ch+14;
  G.txtO('RKFFMC SHOP',VW/2,ty,13,'#ffd060','center',VW-30);
  if(url){
   G.txt('OFFICIAL CLUB GEAR, PATCHES AND MORE',VW/2,ty+24,7,'#e8dcc8','center',VW-30,700);
   const b=this.btn(); G.button({x:b.x,y:b.y,w:b.w,h:b.h,label:'OPEN THE SHOP ↗',kind:'primary',size:9.5});
   G.txt('OPENS '+C.linkLabel(url),VW/2,b.y-14,6,'#9fd8ff','center',VW-30,700);
  } else {
   G.chip('COMING SOON',VW/2,ty+24,{align:'center',size:7,col:'#20100a',bg:'#ffd060'});
   G.txt('THE CLUB’S ONLINE SHOP WILL OPEN RIGHT HERE',VW/2,ty+50,6.8,'#e8dcc8','center',VW-30,700);
   G.txt('AS SOON AS IT’S READY.',VW/2,ty+64,6.8,'#e8dcc8','center',VW-30,700);
  }
  if(C.admin&&G.clubAccess().ok) G.button(this.editBtn());
  G.txt('PURCHASES HAPPEN ON THE SHOP’S OWN SITE • POINTS ARE NEVER MONEY',VW/2,VH-20,5.6,'#8a7f70','center',VW-16,700);
  G.topBar('RKFFMC SHOP');
  if(this.ed.on) this.ed.draw(c);
 }
};
})();
