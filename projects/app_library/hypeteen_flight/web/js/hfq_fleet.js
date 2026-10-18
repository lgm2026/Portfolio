/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* HYPETEEN FLIGHT ACADEMY - MY AIRCRAFT: pick your trainer (at enrollment), and MY HANGAR (the whole fleet,
   what each phase unlocks, the paint shop). The same screen is the Hangar's AIRCRAFT GALLERY.
   Drawings and data live in hfq_aircraft.js. */
(function(){
const H=G.HFQ, C=G.C, CL=G.CL, VW=G.VW, PI=Math.PI;
const cad=()=>(G.save.mod.cadet=G.save.mod.cadet||{});

/* a preview card: the aircraft, its name, role and facts */
function preview(c,x,y,w,h,id,paint,t,o){
 o=o||{}; const m=H.acById(id);
 G.panel(x,y,w,h,{r:14,border:G.rgba(C.accent,.5)});
 const ah=Math.min(h-(o.facts?58:34),(w-20)/2);
 c.save(); G.rrect(x+1,y+1,w-2,h-2,13); c.clip();
 const sky=c.createLinearGradient(0,y,0,y+ah+10); sky.addColorStop(0,'rgba(70,120,210,.28)'); sky.addColorStop(1,'rgba(91,155,255,0)'); c.fillStyle=sky; c.fillRect(x,y,w,ah+10);
 const sg=c.createRadialGradient(x+w*.78,y+6,0,x+w*.78,y+6,w*.5); sg.addColorStop(0,'rgba(255,220,150,.3)'); sg.addColorStop(1,'rgba(255,220,150,0)'); c.fillStyle=sg; c.fillRect(x,y,w,ah+10);
 const fl=c.createLinearGradient(0,y+ah*.86,0,y+ah+8); fl.addColorStop(0,'rgba(60,70,90,0)'); fl.addColorStop(1,'rgba(60,70,90,.35)'); c.fillStyle=fl; c.fillRect(x,y+ah*.86,w,ah*.14+8);   // the apron under it
 c.restore();
 const ph=G.img&&G.img['ac_'+id];   // a real photo, once you add one (see README: Aircraft photos)
 if(ph&&!o.locked){ c.save(); G.rrect(x+8,y+6,w-16,ah+2,10); c.clip(); G.cover(ph,x+8,y+6,w-16,ah+2); c.restore();
  G.rrect(x+w-78,y+ah-22,66,30,8); c.fillStyle='rgba(11,11,12,.7)'; c.fill(); H.drawAC(c,id,x+w-76,y+ah-20,62,26,paint,{ground:false}); }
 else { c.save(); G.rrect(x+1,y+1,w-2,ah+9,13); c.clip(); H.drawAC(c,id,x+10,y+8,w-20,ah,paint,{prop:'spin',t,scale:1,fly:!o.locked,reflect:!o.locked&&!m.noReflect,lights:!o.locked}); c.restore(); }
 let yy=y+8+ah+2;
 G.txt(m.name,x+w/2,yy,9,C.title,'center',w-16,800); yy+=13;
 G.txt((m.sub||m.role)+' • '+(m.seats===0?'NO CREW ON BOARD':m.seats+(m.seats===1?' SEAT':' SEATS')),x+w/2,yy,5.8,C.sub,'center',w-16,800); yy+=11;
 if(o.facts){ for(const f of m.facts.slice(0,o.facts)){ const L=G.wrap(f,6.2,w-28,600).slice(0,2); L.forEach((s,i)=>G.txt(s,x+w/2,yy+i*9,6.2,C.ink,'center',w-24,600)); yy+=L.length*9+3; } }
}

/* ============================ PICK YOUR TRAINER ============================ */
G.scenes.trainer={
 enter(a){ this.first=!!a.first; this.back=a.back||'locker'; this.t=0; this.trainers=H.AC.filter(m=>m.trainer); const cur=H.myAC().id; this.sel=this.trainers.some(m=>m.id===cur)?cur:'c172'; },
 layout(){
  const VH=G.VH, top=48, ph=Math.min(178,VH-292), gy=top+ph+8, cw=(VW-30)/2, ch=Math.min(58,(VH-gy-60-12)/3);
  const cards=this.trainers.map((m,i)=>({m,x:12+(i%2)*(cw+6),y:gy+Math.floor(i/2)*(ch+6),w:cw,h:ch}));
  return {top,ph,cards,btn:{id:'go',x:12,y:VH-50,w:VW-24,h:40}};
 },
 update(dt){
  this.t+=dt;
  if(!this.first&&G.backHit()){ G.go(this.back); return; }
  const L=this.layout();
  for(const k of L.cards) if(G.clicked(k.x,k.y,k.w,k.h)){ this.sel=k.m.id; AUDIO.sfx('blip'); }
  if(G.clicked(L.btn.x,L.btn.y,L.btn.w,L.btn.h)||G.pressed.a){ AUDIO.sfx('engine'); H.setMyAC(this.sel); G.toast('YOUR TRAINER: '+H.acById(this.sel).name,C.good);
   if(this.first){ G.ach('mytrainer'); G.go(G.scenes.placement?'placement':'world',G.scenes.placement?{}:{room:H.firstRoom||'lounge'}); } else G.go(this.back); }
 },
 draw(c){
  G.backdrop(.9); const L=this.layout(), cur=H.myAC();
  preview(c,12,L.top,VW-24,L.ph,this.sel,this.sel===cur.id?cur.paint:null,this.t,{facts:L.ph>150?1:0});
  for(const k of L.cards){ const on=k.m.id===this.sel;
   G.rrect(k.x,k.y,k.w,k.h,10); c.fillStyle=on?G.rgba(C.accent,.16):C.card; c.fill(); c.strokeStyle=on?C.accent:'rgba(255,255,255,.12)'; c.lineWidth=on?2:1; c.stroke();
   H.drawAC(c,k.m.id,k.x+4,k.y+3,k.w-8,k.h-16,null,{ground:false});
   G.txt(k.m.name.replace('CESSNA ','CESSNA ').replace(' SKYHAWK',''),k.x+k.w/2,k.y+k.h-12,5.4,on?C.accentHi:C.sub,'center',k.w-8,800); }
  G.button(Object.assign({},L.btn,{label:this.first?'THIS ONE! REPORT TO CLASS':'FLY THIS ONE',kind:'primary',size:8.4}),false);
  G.topBar('PICK YOUR TRAINER',{back:!this.first,sub:'THE AIRPLANE YOU’LL LEARN IN • CHANGE IT ANYTIME'});
 }
};

/* ============================ MY HANGAR / AIRCRAFT GALLERY ============================ */
function acRow(m,sel){
 const un=H.acUnlocked(m.id), mine=H.myAC().id===m.id;
 const need=un?'':(m.hall?'SPOT IT IN PLANE SPOTTER':(()=>{ const r=H.ranks[m.req]; return 'UNLOCKS AT '+r.n; })());
 return {h:64,focus:true,t:m.name,
  draw(c,x,y,w,foc){
   G.rrect(x,y+2,w,58,12); c.fillStyle=sel?G.rgba(C.accent,.14):C.card; c.fill(); c.strokeStyle=foc?C.title:(sel?G.rgba(C.accent,.6):'rgba(255,255,255,.1)'); c.lineWidth=foc||sel?2:1; c.stroke();
   if(un) H.drawAC(c,m.id,x+4,y+8,96,46,mine?H.myAC().paint:null,{ground:false});
   else { c.save(); c.globalAlpha=.35; H.drawAC(c,m.id,x+4,y+8,96,46,{body:'#3a3f48',stripe:'#2a2d33'},{ground:false}); c.restore(); G.icon('lock',c,x+52,y+30,14,'rgba(255,255,255,.55)'); }
   G.txt(m.name,x+106,y+11,7.4,un?C.ink:C.dim,'left',w-116,800);
   G.txt((m.sub||m.role)+(m.trainer?' • PICK AT ENROLLMENT':''),x+106,y+25,5.4,un?C.sub:C.dim,'left',w-116,800);
   G.txt(mine?'✓ MY AIRCRAFT':(un?'UNLOCKED':need),x+106,y+40,5.4,mine?C.good:(un?C.accentHi:C.dim),'left',w-116,800);
  },
  tap(){ return {ac:m.id}; }, enter(){ return {ac:m.id}; }};
}
G.scenes.fleet={
 enter(a){ this.back=a.back||G.homeScene(); this.gallery=!!a.gallery; this.list=CL.List(); this.t=0; this.sel=H.myAC().id; this.paint=Object.assign({},H.myAC().paint); this.m=null; cad().newAC=0; G.persist(); },
 head(){ return Math.min(210,G.VH*.4); },
 area(){ const h=this.head(); return {x:4,y:46+h+4,w:VW-8,h:G.VH-50-h-4}; },
 items(){
  const I=[], un=H.AC.filter(m=>H.acUnlocked(m.id)).length;
  I.push(CL.hdr('THE FLEET',un+' / '+H.AC.length+' UNLOCKED'));
  I.push(CL.text('Pick from the six trainers when you enroll. Every academy phase unlocks new aircraft, all the way to jets, airliners and helicopters.',{size:6.4,col:C.sub}));
  for(const m of H.AC) I.push(acRow(m,m.id===this.sel));
  const sp=H.HALL.filter(m=>H.isSpotted(m.id)).length;   // the Hall of Flight: history's key aircraft, unlocked by spotting them
  I.push(CL.hdr('HALL OF FLIGHT',sp+' / '+H.HALL.length+' SPOTTED'));
  I.push(CL.text('Aviation history, from the Wright Flyer to stealth jets. Name one in PLANE SPOTTER on the Viewing Platform and it joins your hangar.',{size:6.4,col:C.sub}));
  I.push(CL.action('PLAY PLANE SPOTTER',{play:'spot'},'primary'));
  I.push(CL.action('SPOTTER’S GUIDE: EVERY ID CARD',{guide:1},'ghost'));
  for(const cat of H.HALL_CATS){ const L=H.HALL.filter(m=>m.cat===cat); if(!L.length) continue; I.push(CL.hdr(cat,L.filter(m=>H.isSpotted(m.id)).length+' / '+L.length)); for(const m of L) I.push(acRow(m,m.id===this.sel)); }
  I.push(CL.action('KINDS OF AIRCRAFT (CATEGORIES)',{page:'aircraft'},'ghost'));
  I.push(CL.note(H.AC.some(m=>G.img&&G.img['ac_'+m.id])?['PHOTOS + DRAWINGS OF REAL KEY AIRCRAFT. NO LOGOS.']:['DRAWINGS SHOW EACH MODEL’S SHAPE. NO LOGOS.','REAL PHOTOS ARE COMING.']));
  return I;
 },
 strip(){ const h=this.head(); return {x:8,y:48+h-44,w:VW-16,h:44}; },
 swatches(){ const S=this.strip(), out=[]; const rows=[['body',H.acPaints.body],['stripe',H.acPaints.stripe]];
  rows.forEach(([k,list],r)=>{ const d=13, gap=3, w=list.length*d+(list.length-1)*gap, x0=S.x+S.w-8-w; list.forEach((col,i)=>out.push({k,col,x:x0+i*(d+gap),y:S.y+5+r*19,d})); }); return out; },
 canPaint(){ return H.acUnlocked(this.sel)&&H.acById(this.sel).kind!=='airliner'; },
 update(dt){
  this.t+=dt;
  if(G.backHit()){ G.go(this.back); return; }
  const h=this.head();
  const ib=this.cardBtn(); if(ib&&G.clicked(ib.x,ib.y,ib.w,ib.h)){ AUDIO.sfx('ok'); G.go('idcard',{id:this.sel,back:'fleet'}); return; }
  // paint shop + MAKE IT MINE
  if(H.acUnlocked(this.sel)){
   for(const s of this.swatches()) if(G.clicked(s.x-2,s.y-2,s.d+4,s.d+4)){ this.paint[s.k]=s.col; AUDIO.sfx('blip'); if(H.myAC().id===this.sel){ H.setMyAC(this.sel,Object.assign({},this.paint)); } return; }
   const b=this.mineBtn(); if(b&&G.clicked(b.x,b.y,b.w,b.h)){ H.setMyAC(this.sel,Object.assign({},this.paint)); AUDIO.sfx('engine'); G.toast('MY AIRCRAFT: '+H.acById(this.sel).name,C.good); G.ach('mytrainer'); return; }
  }
  this.list.update(this.items(),this.area(),a=>{
   if(a.page){ G.go('page',{id:a.page,back:'fleet'}); return; }
   if(a.guide){ G.go('spotguide',{back:'fleet'}); return; }
   if(a.play){ G.go('g_'+a.play,{back:'fleet'}); return; }
   if(a.ac){ this.sel=a.ac; const mine=H.myAC(); this.paint=Object.assign({},a.ac===mine.id?mine.paint:H.acById(a.ac).paint); if(!H.acUnlocked(a.ac)) AUDIO.sfx('buzzer'); }
  });
 },
 mineBtn(){ if(!H.acUnlocked(this.sel)||H.myAC().id===this.sel) return null; const S=this.strip(); return {x:S.x+6,y:S.y+8,w:82,h:28}; },
 cardBtn(){ if(!(H.ACINFO&&H.ACINFO[this.sel])) return null; return {x:VW-70,y:54,w:56,h:20}; },   // the aircraft's ID card
 draw(c){
  G.backdrop(.9);
  this.list.draw(c,this.items(),this.area());
  const h=this.head(), m=H.acById(this.sel), un=H.acUnlocked(this.sel);
  c.fillStyle=C.bg; c.fillRect(0,42,VW,h+8);
  const ph=h-48;
  if(un) preview(c,8,48,VW-16,ph,this.sel,this.paint,this.t,{facts:ph>150?1:0});
  else preview(c,8,48,VW-16,ph,this.sel,{body:'#3a3f48',stripe:'#2a2d33'},this.t,{facts:0,locked:true});
  const S=this.strip(); G.panel(S.x,S.y,S.w,S.h,{r:12});
  if(!un) G.txt(m.hall?'LOCKED • NAME IT IN PLANE SPOTTER':'LOCKED • REACH '+H.ranks[m.req].n,VW/2,S.y+(m.hall?8:16),6.4,C.warn,'center',S.w-16,800);
  if(!un&&m.hall) G.para('CLUE: '+m.clue,VW/2,S.y+20,5,C.sub,'center',S.w-16,7,700);
  if(un){
   const sw=this.swatches();
   G.txt('BODY',sw[0].x-5,sw[0].y+4,4.8,C.dim,'right',undefined,800); G.txt('STRIPE',sw[8].x-5,sw[8].y+4,4.8,C.dim,'right',undefined,800);
   for(const s of sw){ const on=this.paint[s.k]===s.col; c.beginPath(); c.arc(s.x+s.d/2,s.y+s.d/2,s.d/2,0,PI*2); c.fillStyle=s.col; c.fill(); c.lineWidth=on?2.2:1; c.strokeStyle=on?C.accentHi:'rgba(255,255,255,.3)'; c.stroke(); }
   const b=this.mineBtn(); if(b) G.button(Object.assign({},b,{label:'MAKE IT MINE',kind:'primary',size:6.8}),false);
   else G.txt('✓ MINE',S.x+12,S.y+17,7,C.good,'left',undefined,800);
  }
  const ib=this.cardBtn(); if(ib){ G.rrect(ib.x,ib.y,ib.w,ib.h,8); c.fillStyle='rgba(11,11,12,.6)'; c.fill(); c.strokeStyle=G.rgba(C.accent,.7); c.lineWidth=1; c.stroke(); G.txt('ID CARD ▸',ib.x+ib.w/2,ib.y+6.5,5.6,C.accentHi,'center',ib.w-4,800); }
  G.topBar(this.gallery?'AIRCRAFT GALLERY':'MY HANGAR',{sub:this.gallery?'KEY AIRCRAFT • YOUR PICKS':'YOUR AIRCRAFT + THE FLEET'});
 }
};
})();
