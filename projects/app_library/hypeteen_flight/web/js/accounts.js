/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* ACCOUNTS + TITLE + SETTINGS
   - title:    the sign-in screen (LOG IN / CREATE ACCOUNT / CONTINUE AS GUEST)
   - login:    pick your name on this device, then your 4-digit PIN
   - signup:   name -> PIN -> confirm PIN. The first account on a device is its OWNER (see data.js)
   - settings: headshot, music, sound, reduced motion, log out / delete account
   Accounts live in localStorage (CONFIG.id+'_roster_v1'); PINs are hashed (G.pinHash). Each account has its own save. */
(function(){
const VW=G.VW, C=G.C, CFG=G.CFG, ACC=CFG.accounts||{}, W=G.word;

/* ---------- shared PIN entry: native numeric field (masked) + on-screen keypad backup ---------- */
const PIN_W=150, PIN_H=46;
const PIN={
 y(){ return Math.max(132,Math.min(G.oskTop('num')-90,G.VH*.34)); },
 open(onDone){
  G.field('pin',{x:(VW-PIN_W)/2,y:PIN.y(),w:PIN_W,h:PIN_H,digits:true,max:4,secret:true,placeholder:'••••',enterHint:'go',
   onEnter:()=>{ if(G.fieldVal('pin').length===4) onDone(); else AUDIO.sfx('buzzer'); }});
  G.focusField('pin');
 },
 update(onDone){
  const r=G.osk('pin','num');
  if(r==='DONE'){ if(G.fieldVal('pin').length===4) return onDone(); AUDIO.sfx('buzzer'); }
  if(G.fieldVal('pin').length===4) onDone();
 },
 draw(c,err,shake){
  const y=PIN.y(), sx=shake>0&&!G.rm()?Math.sin(shake*60)*6*shake/.4:0;
  G.rrect((VW-PIN_W)/2-6+sx,y-6,PIN_W+12,PIN_H+12,18); c.fillStyle='rgba(0,0,0,.4)'; c.fill();
  if(err) G.txt(err,VW/2,y+PIN_H+12,7,C.bad,'center',VW-20,700);
  G.oskDraw(c,'num',{doneLabel:'OK',ready:G.fieldVal('pin').length===4,hint:'TYPE WITH YOUR KEYBOARD • OR TAP THE KEYPAD'});
 }
};
G.PIN=PIN;

/* ============================ TITLE ============================ */
G.scenes.title={
 enter(){
  G.logout(); G.loadRoster();   // the door always asks for a PIN
  this.tick=0; this.st={f:0};
  AUDIO.play(AUDIO.menuMusic());
 },
 plate(){ const im=G.ART&&G.ART.has('screen:title')?G.ART.img('screen:title'):null; return im&&im.naturalHeight>im.naturalWidth*.8?im:null; },   // a tall painting replaces the logo block; a wide strip (see draw) only decorates the bottom
 /* how much of a tall painting is picture: a portrait plate may end in a flat pad of one colour (it lets the welcome page run
    long on tall phones). Measured once from the image itself; the canvas plate stops just past the picture and fades into
    the backdrop, so the pad never meets the backdrop in a hard line. Unreadable (a file:// image) -> the whole height. */
 picFrac(im){ if(im._picFrac!=null) return im._picFrac; let f=1;
  try{ const n=200, cw=16, cv=document.createElement('canvas'); cv.width=cw; cv.height=n; const x=cv.getContext('2d'); x.drawImage(im,0,0,cw,n);
   const d=x.getImageData(0,0,cw,n).data, at=(r,col)=>(r*cw+col)*4, b=at(n-1,cw>>1); let r=n-1;
   for(;r>n*.4;r--){ let diff=0; for(let col=0;col<cw;col++){ const i=at(r,col); diff=Math.max(diff,Math.abs(d[i]-d[b])+Math.abs(d[i+1]-d[b+1])+Math.abs(d[i+2]-d[b+2])); } if(diff>18) break; }
   f=Math.min(1,(r+2)/n); }catch(e){ f=1; }
  return (im._picFrac=f); },
 /* the painting, scaled to the screen width and cut at the plate height, with its last 30 units faded to transparent
    (an offscreen copy at the screen's pixel scale; rebuilt only when the size changes) */
 plateCanvas(im,ph){ const k=G.k||1, key=k+'|'+ph; if(this._pc&&this._pc.key===key&&this._pc.im===im) return this._pc.cv;
  const cv=document.createElement('canvas'), w=Math.ceil(VW*k), h=Math.ceil(ph*k); cv.width=w; cv.height=h; const x=cv.getContext('2d');
  const s=Math.max(VW/im.naturalWidth,ph/im.naturalHeight), sw=VW/s, sh=ph/s; x.imageSmoothingQuality='high'; x.drawImage(im,(im.naturalWidth-sw)/2,0,sw,sh,0,0,w,h);
  x.globalCompositeOperation='destination-in'; const g=x.createLinearGradient(0,h-30*k,0,h); g.addColorStop(0,'rgba(0,0,0,1)'); g.addColorStop(1,'rgba(0,0,0,0)'); x.fillStyle=g; x.fillRect(0,0,w,h);
  this._pc={key,im,cv}; return cv; },
 layout(){
  const VH=G.VH, has=G.roster.accounts.length>0, plate=this.plate(), logo=plate?null:(CFG.logo&&G.img[CFG.logo]);
  const lw=logo?Math.min(150,120+(VH-480)*.4):0, lh=logo?lw*logo.height/logo.width:0;
  const main=[];
  if(has) main.push({id:'login',label:W('login'),sub:W('loginSub'),kind:'primary',h:46});
  main.push(has?{id:'signup',label:W('signup'),h:40}:{id:'signup',label:W('signup'),sub:W('signupSub'),kind:'primary',h:46});
  if(ACC.guest!==false) main.push({id:'guest',label:W('guest'),sub:has?null:W('guestSub'),h:has?40:44});
  // center the whole block (logo + name + buttons + settings) in the screen
  const total=lh+(logo?16:40)+44+main.reduce((s,b)=>s+b.h+9,0)+34;
  if(plate){ const bh=main.reduce((s,b)=>s+b.h+9,0)+34+22, full=VW*plate.naturalHeight/plate.naturalWidth, ph=Math.min(full,full*this.picFrac(plate)+26,VH-bh-8); const btns=[]; let y=ph+Math.max(8,(VH-ph-bh)/2);
   for(const b of main){ btns.push(Object.assign({x:24,y,w:222,size:9},b)); y+=b.h+9; } btns.push({id:'settings',label:'SETTINGS',kind:'ghost',x:70,y:y+2,w:130,h:28,size:7});
   // the painting keeps its top third as sky for the name: a small insignia, the name and the subtitle sit there, typeset
   const pl=CFG.logo&&G.img[CFG.logo], plw=pl?Math.min(64,ph*.19):0, plh=pl?plw*pl.height/pl.width:0, ply=Math.max(10,ph*.03);
   return {logo:pl||null,lw:plw,lh:plh,ly:ply,ny:ply+plh+27,plateH:ph,btns}; }
  const ly=Math.max(24,(VH-24-total)/2);
  let y=ly+lh+(logo?16:40)+44;
  const btns=[];
  for(const b of main){ btns.push(Object.assign({x:24,y,w:222,size:9},b)); y+=b.h+9; }
  btns.push({id:'settings',label:'SETTINGS',kind:'ghost',x:70,y:y+6,w:130,h:28,size:7});
  return {logo,lw,lh,ly,ny:ly+lh+(logo?12:30),btns};
 },
 update(dt){
  this.tick+=dt;
  const id=G.navList(this.st,this.layout().btns);
  if(id==='login') G.go('login');
  else if(id==='signup') G.go('signup',{},true);
  else if(id==='guest') G.home();
  else if(id==='settings') G.go('settings',{back:'title'});
 },
 draw(c){
  const L=this.layout();
  G.backdrop(.6);
  /* a painted hero plate, when the rendition provides one (art slot 'screen:title'): a tall painting fills the top of the
     screen behind the name and fades into the backdrop above the buttons; a wide strip decorates the bottom instead. */
  if(G.ART&&G.ART.has('screen:title')){ const im=G.ART.img('screen:title'); if(im){ const VH=G.VH, w=VW, h=w*im.naturalHeight/im.naturalWidth;
   if(L.plateH){ c.drawImage(this.plateCanvas(im,L.plateH),0,0,w,L.plateH);   // the painting, top-anchored, cut just past the picture and faded into the backdrop
    const t=c.createLinearGradient(0,0,0,L.ny+40); t.addColorStop(0,G.rgba(C.bg,.55)); t.addColorStop(1,G.rgba(C.bg,0)); c.fillStyle=t; c.fillRect(0,0,w,L.ny+40); }   // a quiet darkening behind the name
   else c.drawImage(im,0,Math.max(L.ny+40,VH-h-4),w,h); } }
  const bob=G.rm()?0:Math.sin(this.tick*2)*3;
  if(L.logo){ c.save(); c.shadowColor=G.rgba(L.plateH?'#000000':C.accentHi,.45); c.shadowBlur=L.plateH?10:24; c.drawImage(L.logo,VW/2-L.lw/2,L.ly+(L.plateH?0:bob),L.lw,L.lh); c.restore(); }
  if(L.plateH){ c.save(); c.shadowColor='rgba(0,0,0,.6)'; c.shadowBlur=8; c.shadowOffsetY=1.5; G.txtO(CFG.name,VW/2,L.ny,15,C.titleGold||C.title,'center',VW-24); if(CFG.subtitle) G.txtO(CFG.subtitle,VW/2,L.ny-17,6.6,C.ink,'center',VW-40); c.restore(); }
  else { G.txtO(CFG.name,VW/2,L.ny,15,C.ink,'center',VW-24);
  if(CFG.subtitle) G.txt(CFG.subtitle,VW/2,L.ny+24,6.6,C.accentText,'center',VW-40,800); }
  L.btns.forEach((b,i)=>G.button(b,this.st.f===i));
  G.txt('DATA: '+G.data.label(),VW/2,G.VH-16,5.8,C.faint,'center',VW-16,700);
 }
};

/* ============================ LOGIN ============================ */
G.scenes.login={
 enter(){ G.loadRoster(); this.mode='list'; this.ls={f:0,scroll:0}; this.tries=0; this.err=''; this.sel=null; this.shake=0; },
 area(){ return {x:10,y:62,w:250,h:G.VH-62-62}; },
 btn(){ return {id:'new',label:W('newAccount'),kind:'ghost',x:10,y:G.VH-50,w:250,h:38,size:7.5}; },
 openPin(a){ this.sel=a; this.mode='pin'; this.err=''; this.tries=0; this.shake=0; this.fresh=a.pinH?null:''; PIN.open(()=>this.check()); AUDIO.sfx('ok'); },
 check(){
  const v=G.fieldVal('pin'); if(v.length!==4) return;
  if(this.fresh!=null){   // the owner reset this PIN: pick a new one, twice
   if(!this.fresh){ this.fresh=v; G.setField('pin',''); this.err=''; AUDIO.sfx('ok'); return; }
   if(v!==this.fresh){ this.fresh=''; G.setField('pin',''); this.err='PINS DIDN’T MATCH - PICK ONE AGAIN'; this.shake=.4; AUDIO.sfx('buzzer'); return; }
   this.sel.pinH=G.pinHash(v); G.saveRoster(); G.blurFields(); AUDIO.sfx('cheer'); G.loginAs(this.sel);
   G.toast('NEW PIN SAVED',C.good); G.home(); return;
  }
  if(G.pinHash(v)===this.sel.pinH){
   G.blurFields(); AUDIO.sfx('cheer'); G.loginAs(this.sel);
   G.toast(W('welcomeBack')+this.sel.name,C.good);
   G.home();
  } else {
   this.tries++; G.setField('pin',''); this.shake=.4;
   this.err=this.tries>=3?'WRONG PIN - FORGOT IT? THE '+W('owner')+' CAN RESET IT IN SETTINGS':'WRONG PIN - TRY AGAIN';
   AUDIO.sfx('buzzer');
  }
 },
 update(dt){
  if(this.shake>0) this.shake=Math.max(0,this.shake-dt);
  if(this.mode==='pin'){
   if(G.backHit()){ G.removeField('pin'); this.mode='list'; this.err=''; return; }
   PIN.update(()=>this.check()); return;
  }
  if(G.backHit()){ G.go('title'); return; }
  const A=G.roster.accounts, b=this.btn();
  if(G.clicked(b.x,b.y,b.w,b.h)){ AUDIO.sfx('ok'); G.go('signup',{},true); return; }
  const i=G.listNav(this.ls,this.area(),A.length,54,6,1);
  if(i<0) return;
  if(i>=A.length){ AUDIO.sfx('ok'); G.go('signup',{},true); return; }
  this.openPin(A[i]);
 },
 draw(c){
  G.backdrop(); G.topBar(W('login'));
  if(this.mode==='pin'){
   const a=this.sel, d=Math.max(54,Math.min(84,PIN.y()-120));
   if(G.drawAcct) G.drawAcct(c,a,VW/2-d/2,52,d,C.accent); else G.drawFace(a.photo,VW/2-d/2,52,d,a.name,C.accent);
   G.txt(a.name,VW/2,60+d,11,C.title,'center',VW-30,800);
   G.txt(this.fresh==null?'ENTER YOUR 4-DIGIT PIN':(this.fresh?'TYPE THE NEW PIN AGAIN':'PICK A NEW 4-DIGIT PIN'),VW/2,80+d,7,this.fresh==null?C.sub:C.warn,'center');
   PIN.draw(c,this.err,this.shake); return;
  }
  const A=G.roster.accounts, ar=this.area();
  G.txt(W('pickName'),VW/2,48,7,C.sub,'center');
  c.save(); c.beginPath(); c.rect(ar.x-4,ar.y,ar.w+8,ar.h); c.clip();
  A.forEach((a,i)=>{
   const y=ar.y+i*60-this.ls.scroll; if(y>ar.y+ar.h||y+54<ar.y) return;
   const foc=this.ls.f===i&&G.kbMode, press=G.held(ar.x,y,ar.w,54);
   G.rrect(ar.x,y+(press?1:0),ar.w,54,12); c.fillStyle=press?C.cardPress:C.card; c.fill();
   c.strokeStyle=foc?C.title:'rgba(255,255,255,.12)'; c.lineWidth=foc?2:1; c.stroke();
   if(G.drawAcct) G.drawAcct(c,a,ar.x+8,y+7,40); else G.drawFace(a.photo,ar.x+8,y+7,40,a.name);
   G.txt(a.name,ar.x+56,y+10,9.5,C.ink,'left',150,800);
   G.txt((a.owner?W('owner')+' • ':'')+(a.pinH?'LAST IN '+G.ago(a.lastLogin):'PIN WAS RESET - PICK A NEW ONE'),ar.x+56,y+31,6.2,a.pinH?C.dim:C.warn,'left',150,700);
   G.txt('›',ar.x+ar.w-14,y+19,12,C.accentText,'center',undefined,800);
  });
  c.restore();
  G.scrollBar(ar,this.ls.contentH||0,this.ls.scroll);
  G.button(this.btn(),this.ls.f===A.length);
 }
};

/* ============================ SIGN UP: name -> PIN -> confirm ============================ */
G.scenes.signup={
 enter(){ this.step='name'; this.name=''; this.pin=''; this.err=''; this.shake=0; this.openName(); },
 openName(){
  G.field('name',{x:20,y:118,w:230,h:44,upper:true,max:ACC.nameMax||16,placeholder:'TYPE HERE',value:this.name,enterHint:'next',strip:/[^A-Za-z0-9 '\-.]/g,onEnter:()=>this.nextName()});
  G.focusField('name');
 },
 /* a module can offer made-up names: G.nameSuggest = () => 'SWIFT FALCON' */
 suggestBtn(){ return G.nameSuggest?{id:'suggest',label:W('suggest'),kind:'ghost',x:20,y:226,w:230,h:34,size:7.5}:null; },
 nextBtn(){ return {id:'next',label:'NEXT',kind:'primary',x:20,y:178,w:230,h:42,size:9}; },
 nextName(){
  const n=G.fieldVal('name').trim().replace(/\s+/g,' ');
  if(n.length<2){ this.err='AT LEAST 2 CHARACTERS'; AUDIO.sfx('buzzer'); return; }
  if(G.roster.accounts.some(a=>a.name===n)){ this.err='THAT NAME IS TAKEN ON THIS DEVICE'; AUDIO.sfx('buzzer'); return; }
  this.name=n; this.err=''; this.step='pin'; G.removeField('name'); AUDIO.sfx('ok');
  PIN.open(()=>this.gotPin());
 },
 gotPin(){
  const v=G.fieldVal('pin'); if(v.length!==4) return;
  if(this.step==='pin'){ this.pin=v; this.step='pin2'; G.setField('pin',''); this.err=''; AUDIO.sfx('ok'); return; }
  if(v!==this.pin){ this.step='pin'; this.pin=''; G.setField('pin',''); this.err='PINS DIDN’T MATCH - PICK ONE AGAIN'; this.shake=.4; AUDIO.sfx('buzzer'); return; }
  G.blurFields();
  const R=G.roster, a={id:G.data.newId(),name:this.name,pinH:G.pinHash(v),created:Date.now(),lastLogin:Date.now(),owner:!R.accounts.length};
  R.accounts.push(a); G.saveRoster(); G.loginAs(a);
  AUDIO.sfx('cheer'); G.toast(W('welcome')+a.name+(a.owner?' • '+W('owner'):''),C.good);
  if(G.afterSignup) G.afterSignup(a); else G.home();   // a module can take over, e.g. an avatar builder
 },
 update(dt){
  if(this.shake>0) this.shake=Math.max(0,this.shake-dt);
  if(G.backHit()){
   if(this.step==='name'){ G.go(G.roster.accounts.length?'login':'title'); return; }
   G.removeField('pin'); this.step='name'; this.err=''; this.openName(); return;
  }
  if(this.step==='name'){
   const b=this.nextBtn(), s=this.suggestBtn();
   if(G.clicked(b.x,b.y,b.w,b.h)) this.nextName();
   else if(s&&G.clicked(s.x,s.y,s.w,s.h)){ AUDIO.sfx('ok'); let n=G.nameSuggest(), k=0; while(G.roster.accounts.some(a=>a.name===n)&&k++<20) n=G.nameSuggest(); G.setField('name',n); this.err=''; }
   return;
  }
  PIN.update(()=>this.gotPin());
 },
 draw(c){
  G.backdrop(); G.topBar(W('signup'),{sub:'STEP '+({name:1,pin:2,pin2:3})[this.step]+' OF 3'});
  if(this.step==='name'){
   G.txt(ACC.nameLabel||'YOUR NAME',VW/2,72,10,C.title,'center',VW-30,800);
   G.txt(W('nameHint'),VW/2,92,6.6,C.sub,'center',VW-30);
   G.button(this.nextBtn());
   const s=this.suggestBtn(); if(s) G.button(s);
   if(this.err) G.txt(this.err,VW/2,s?270:230,7,C.bad,'center',VW-20,700);
   return;
  }
  G.txt(this.step==='pin'?'PICK A 4-DIGIT PIN':'TYPE IT AGAIN',VW/2,62,10,C.title,'center',VW-30,800);
  G.txt(this.name,VW/2,84,7.5,C.sub,'center',VW-30,700);
  PIN.draw(c,this.err,this.shake);
 }
};

/* ============================ SETTINGS ============================ */
let back='title';
/* read an on/off setting, including the rendition's extra toggles (CONFIG.settingsToggles: [{id, label, def}]) */
G.setting=function(id){ const s=G.save.settings; if(id in s) return !!s[id]; const t=(G.CFG.settingsToggles||[]).find(q=>q.id===id); return t?t.def!==false:false; };
G.scenes.settings={
 enter(a){ if(a&&a.back) back=a.back; this.st={f:0}; this.m=null; this.prk=''; },
 rows(){
  const R=[]; let y=58;
  if(G.activeAcct&&ACC.photo!==false){ R.push({id:'photo',y,h:50}); y+=58; }
  for(const id of ['music','sfx','rm']){ R.push({id,y,h:30}); y+=36; }
  for(const t of G.CFG.settingsToggles||[]){ R.push({id:'x:'+t.id,tg:t,y,h:30}); y+=36; }   // extra on/off settings from the rendition: [{id, label, def}]
  y+=8; R.push({id:'data',y,h:30,info:true}); y+=42;
  for(const l of G.CFG.settingsLinks||[]){ R.push({id:'l:'+l.id,ln:l,y,h:36}); y+=44; }   // extra pages from the rendition or a module: [{id, label, scene}]
  if(G.activeAcct&&G.data.isOwner()&&G.roster.accounts.length>1){ R.push({id:'pins',y,h:36}); y+=44; }
  if(G.activeAcct){ R.push({id:'logout',y,h:36}); y+=44; R.push({id:'delete',y,h:36}); }
  else R.push({id:'wipe',y,h:36});
  return R.map(r=>Object.assign({x:12,w:246},r));
 },
 placePhoto(R){
  const r=R.find(q=>q.id==='photo'); if(!r) return;
  const k=r.y+','+G.VH; if(k===this.prk&&G.fields.photo) return; this.prk=k;
  G.fileField('photo',{x:r.x,y:r.y,w:r.w,h:r.h,accept:'image/*',onFile:f=>{
   G.photoFromFile(f,192).then(src=>{ const a=G.activeAcct; if(!a) return; a.photo=src; G.saveRoster(); G.toast('PHOTO UPDATED',C.good); AUDIO.sfx('cheer'); })
    .catch(()=>{ G.toast('THAT PHOTO COULDN’T BE OPENED',C.bad); AUDIO.sfx('buzzer'); });
  }});
 },
 update(){
  const s=G.save.settings;
  if(this.m){
   const r=this.m.update();
   if(r==='no'||(r==null&&G.pressed.b)){ this.m=null; G.hideFields(false); return; }
   if(this.mk==='pins'&&r&&r.indexOf('rp_')===0){
    const a=G.roster.accounts.find(q=>'rp_'+q.id===r); if(a){ a.pinH=null; G.saveRoster(); G.toast(a.name+' PICKS A NEW PIN AT '+W('login'),C.good); }
    this.m=null; G.hideFields(false); return;
   }
   if(r==='yes'){
    if(this.mk==='delete'){ const id=G.activeAcct.id; G.roster.accounts=G.roster.accounts.filter(a=>a.id!==id); G.saveRoster(); try{ localStorage.removeItem(G.KEYS.acct(id)); }catch(e){} G.toast('ACCOUNT DELETED',C.info); G.go('title'); }
    else if(this.mk==='wipe'){ G.resetSave(); this.m=null; G.hideFields(false); G.toast('GUEST DATA CLEARED',C.info); }
    else { G.toast(W('loggedOut'),C.info); G.go('title'); }
   }
   return;
  }
  if(G.backHit()){ G.persist(); G.go(back==='home'?G.homeScene():back); return; }
  const R=this.rows(), st=this.st, n=R.length;
  this.placePhoto(R);
  if(G.pressed.up){ st.f=(st.f+n-1)%n; AUDIO.sfx('blip'); }
  if(G.pressed.down){ st.f=(st.f+1)%n; AUDIO.sfx('blip'); }
  let act=null;
  for(let i=0;i<n;i++){ const r=R[i]; if(r.id!=='photo'&&!r.info&&G.clicked(r.x,r.y,r.w,r.h)){ st.f=i; act=r.id; } }
  if(!act&&G.pressed.a&&!R[st.f].info) act=R[st.f].id;
  if(!act) return;
  if(act.indexOf('x:')===0){ const t=R.find(q=>q.id===act).tg; s[t.id]=!G.setting(t.id); AUDIO.sfx('ok'); if(t.on) t.on(s[t.id]); G.persist(); return; }
  switch(act){
   case 'music': s.music=!s.music; AUDIO.setMusic(s.music); if(s.music) AUDIO.play(AUDIO.menuMusic()); AUDIO.sfx('ok'); break;
   case 'sfx': s.sfx=!s.sfx; AUDIO.setSfx(s.sfx); AUDIO.sfx('ok'); break;
   case 'rm': s.rm=!s.rm; AUDIO.sfx('ok'); break;
   default: if(act&&act.indexOf('l:')===0){ const l=(G.CFG.settingsLinks||[]).find(q=>'l:'+q.id===act); if(l){ AUDIO.sfx('ok'); G.persist(); G.go(l.scene,{back:'settings'}); return; } }
   case 'logout': this.mk='logout'; this.m=G.confirm({title:W('logout')+'?',lines:['YOU’LL NEED YOUR PIN TO GET BACK IN.'],yes:W('logout')}); G.hideFields(true); return;
   case 'pins': {
    const others=G.roster.accounts.filter(a=>a.id!==G.activeAcct.id).slice(0,6);
    this.mk='pins'; G.hideFields(true);
    this.m=G.Modal({title:'RESET WHOSE PIN?',sub:'THEY PICK A NEW ONE AT '+W('login'),btns:others.map(a=>({id:'rp_'+a.id,label:a.name})).concat([{id:'no',label:'CANCEL',kind:'ghost'}]),btnH:32});
    return;
   }
   case 'delete': this.mk='delete'; this.m=G.confirm({title:'DELETE '+G.activeAcct.name+'?',lines:['REMOVES THIS ACCOUNT AND ITS SAVE','FROM THIS DEVICE. SHARED POSTS STAY.'],yes:'DELETE',danger:true}); G.hideFields(true); return;
   case 'wipe': this.mk='wipe'; this.m=G.confirm({title:'CLEAR GUEST DATA?',lines:['RESETS SETTINGS AND POINTS','FOR GUEST MODE ON THIS DEVICE.'],yes:'CLEAR',danger:true}); return;
  }
  G.persist();
 },
 draw(c){
  const s=G.save.settings, R=this.rows();
  G.backdrop(); G.topBar('SETTINGS');
  const lab={music:['MUSIC',s.music],sfx:['SOUND EFFECTS',s.sfx],rm:['REDUCED MOTION',s.rm]};
  R.forEach((r,i)=>{
   const foc=this.st.f===i&&G.kbMode;
   if(r.id==='photo'){
    const a=G.activeAcct, press=G.held(r.x,r.y,r.w,r.h);
    G.rrect(r.x,r.y,r.w,r.h,12); c.fillStyle=press?C.cardPress:C.card; c.fill(); c.strokeStyle=foc?C.title:'rgba(255,255,255,.1)'; c.lineWidth=foc?2:1; c.stroke();
    if(G.drawAcct) G.drawAcct(c,a,r.x+8,r.y+7,36); else G.drawFace(a.photo,r.x+8,r.y+7,36,a.name);
    G.txt(a.photo?'CHANGE PHOTO':'ADD A PHOTO',r.x+54,r.y+12,8.4,C.ink,'left',170,800);
    G.txt('CAMERA OR PHOTO LIBRARY',r.x+54,r.y+28,6,C.dim,'left',170,700);
    return;
   }
   if(r.tg) lab[r.id]=[r.tg.label,G.setting(r.tg.id)];
   if(lab[r.id]){
    const [t,on]=lab[r.id];
    if(foc){ G.rrect(r.x-2,r.y-2,r.w+4,r.h+4,10); c.strokeStyle=C.title; c.lineWidth=2; c.stroke(); }
    G.txt(t,r.x+4,r.y+8,8,C.ink,'left',180,700); G.toggleDraw(r.x+r.w-42,r.y+4,on); return;
   }
   if(r.id==='data'){
    G.txt('SHARED DATA',r.x+4,r.y+2,6.4,C.dim,'left',undefined,800);
    G.txt(G.data.label()+(G.data.isOwner()?' • YOU ARE THE OWNER':''),r.x+4,r.y+14,7.4,C.sub,'left',r.w-8,700);
    return;
   }
   const b={x:r.x,y:r.y,w:r.w,h:r.h,size:8,label:r.ln?r.ln.label:{logout:W('logout'),delete:W('deleteAcct'),wipe:'CLEAR GUEST DATA',pins:'RESET SOMEONE’S PIN'}[r.id],kind:r.id==='delete'||r.id==='wipe'?'danger':(r.id==='pins'||r.ln?'ghost':'secondary')};
   G.button(b,foc);
  });
  if(this.m) this.m.draw(c);
 }
};
})();
