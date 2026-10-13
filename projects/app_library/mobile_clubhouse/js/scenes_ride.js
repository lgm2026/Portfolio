/* Ride engine (portrait): top-down highway with on-screen GAS / BRAKE / lane buttons.
   10 routes: traffic, hazards, Road Captain formation, curve gates, poker stops, scenic overlooks,
   crosswinds, the memorial roadside assist, and the Biker Down event. */
(function(){
const VW=G.VW;
const K=.9;                                   // screen px per road unit
const LANE_X=[70.5,113.5,156.5,199.5];        // lane centers on a straight road
const ROAD_L=49, ROAD_W=172, LANE_W=43;
const HUD_H=44, CTRL_H=88;
function hsh(n){ const x=Math.sin(n*127.1+311.7)*43758.5453; return x-Math.floor(x); }

/* ---------- poker helpers ---------- */
const RANKS=['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
function newDeck(){
 const d=[]; for(let s=0;s<4;s++) for(let r=0;r<13;r++) d.push({r,s});
 for(let i=d.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [d[i],d[j]]=[d[j],d[i]]; }
 return d;
}
function evalHand(cards){ // returns [payIndex, label]
 const rs=cards.map(c=>c.r).sort((a,b)=>a-b);
 const cnt={}; rs.forEach(r=>cnt[r]=(cnt[r]||0)+1);
 const groups=Object.values(cnt).sort((a,b)=>b-a);
 const flush=cards.every(c=>c.s===cards[0].s);
 let straight=groups[0]===1&&rs.every((r,i)=>i===0||r===rs[i-1]+1);
 if(!straight&&rs.join()==='0,1,2,3,12') straight=true; // A-2-3-4-5
 const royal=straight&&flush&&rs[0]===8;
 if(royal) return [0,'ROYAL FLUSH'];
 if(straight&&flush) return [1,'STRAIGHT FLUSH'];
 if(groups[0]===4) return [2,'FOUR OF A KIND'];
 if(groups[0]===3&&groups[1]===2) return [3,'FULL HOUSE'];
 if(flush) return [4,'FLUSH'];
 if(straight) return [5,'STRAIGHT'];
 if(groups[0]===3) return [6,'THREE OF A KIND'];
 if(groups[0]===2&&groups[1]===2) return [7,'TWO PAIR'];
 if(groups[0]===2) return [8,'PAIR'];
 return [9,'HIGH CARD'];
}
function drawSuit(c,s,cx,cy,sz,col){
 c.fillStyle=col; c.beginPath();
 if(s===1){
  c.moveTo(cx,cy+sz*.42);
  c.bezierCurveTo(cx-sz*.66,cy-sz*.05, cx-sz*.36,cy-sz*.56, cx,cy-sz*.18);
  c.bezierCurveTo(cx+sz*.36,cy-sz*.56, cx+sz*.66,cy-sz*.05, cx,cy+sz*.42);
  c.fill();
 } else if(s===2){
  c.moveTo(cx,cy-sz*.45); c.lineTo(cx+sz*.34,cy); c.lineTo(cx,cy+sz*.45); c.lineTo(cx-sz*.34,cy);
  c.closePath(); c.fill();
 } else if(s===0){
  c.moveTo(cx,cy-sz*.46);
  c.bezierCurveTo(cx+sz*.44,cy-sz*.04, cx+sz*.4,cy+sz*.26, cx+sz*.06,cy+sz*.12);
  c.lineTo(cx-sz*.06,cy+sz*.12);
  c.bezierCurveTo(cx-sz*.4,cy+sz*.26, cx-sz*.44,cy-sz*.04, cx,cy-sz*.46);
  c.fill();
  c.fillRect(cx-sz*.05,cy+sz*.08,sz*.1,sz*.26);
  c.beginPath(); c.moveTo(cx-sz*.2,cy+sz*.42); c.quadraticCurveTo(cx,cy+sz*.28,cx+sz*.2,cy+sz*.42); c.closePath(); c.fill();
 } else {
  c.arc(cx,cy-sz*.2,sz*.2,0,7); c.fill(); c.beginPath();
  c.arc(cx-sz*.2,cy+sz*.06,sz*.2,0,7); c.fill(); c.beginPath();
  c.arc(cx+sz*.2,cy+sz*.06,sz*.2,0,7); c.fill();
  c.fillRect(cx-sz*.05,cy+sz*.06,sz*.1,sz*.28);
  c.beginPath(); c.moveTo(cx-sz*.2,cy+sz*.42); c.quadraticCurveTo(cx,cy+sz*.28,cx+sz*.2,cy+sz*.42); c.closePath(); c.fill();
 }
}
function drawCard(c,x,y,w,h,card,faceUp){
 const r=Math.max(3,w*.12);
 c.save();
 c.shadowColor='rgba(0,0,0,.45)'; c.shadowBlur=5; c.shadowOffsetY=2;
 G.rrect(x,y,w,h,r); c.fillStyle=faceUp?'#fdfaf1':'#9c2436'; c.fill();
 c.restore();
 G.rrect(x+.5,y+.5,w-1,h-1,r); c.strokeStyle='rgba(20,14,18,.5)'; c.lineWidth=1; c.stroke();
 if(!faceUp){
  G.rrect(x+w*.1,y+w*.1,w*.8,h-w*.2,r*.6);
  c.strokeStyle='#e8c87a'; c.lineWidth=1.4; c.stroke();
  c.save(); G.rrect(x+w*.14,y+w*.14,w*.72,h-w*.28,r*.4); c.clip();
  c.strokeStyle='rgba(255,255,255,.22)'; c.lineWidth=1;
  for(let i=-h;i<w+h;i+=w*.22){
   c.beginPath(); c.moveTo(x+i,y); c.lineTo(x+i+h,y+h); c.stroke();
   c.beginPath(); c.moveTo(x+i+h,y); c.lineTo(x+i,y+h); c.stroke();
  }
  c.restore();
  return;
 }
 const red=card.s===1||card.s===2, col=red?'#cf2438':'#232836';
 if(w<26){
  c.font='800 '+Math.round(w*.52)+'px Rubik, sans-serif';
  c.textAlign='center'; c.textBaseline='top'; c.fillStyle=col;
  c.fillText(RANKS[card.r],x+w/2,y+h*.08);
  drawSuit(c,card.s,x+w/2,y+h*.68,w*.5,col);
  return;
 }
 c.font='800 '+Math.max(8,Math.round(w*.3))+'px Rubik, sans-serif';
 c.textAlign='center'; c.textBaseline='top';
 c.fillStyle=col;
 const ix=x+w*.22, iy=y+h*.05;
 c.fillText(RANKS[card.r],ix,iy);
 drawSuit(c,card.s,ix,iy+h*.26,w*.2,col);
 c.save();
 c.translate(x+w,y+h); c.rotate(Math.PI);
 c.fillStyle=col; c.fillText(RANKS[card.r],w*.22,h*.05);
 drawSuit(c,card.s,w*.22,h*.05+h*.26,w*.2,col);
 c.restore();
 drawSuit(c,card.s,x+w*.62,y+h*.6,w*.42,col);
}

/* ---------- top-down art ---------- */
/* top-down bike + rider (the member's own build from BUILD YOUR RIDE) */
function bikeTop(c,x,y,av,s,opts){ AV.top(c,x,y,av,s,opts); }
function carTop(c,o,x,y){
 const len=o.w*K, wid=o.t==='semi'?30:(o.t==='truck'?27:24);
 const x0=x-wid/2, y0=y-len/2;
 c.fillStyle='rgba(0,0,0,.33)'; G.rrect(x0+2.5,y0+3.5,wid,len,6); c.fill();
 if(o.t==='semi'){
  const cab=Math.min(24,len*.27);
  G.rrect(x0,y0+cab+3,wid,len-cab-3,3); c.fillStyle=o.col; c.fill();
  c.strokeStyle='rgba(0,0,0,.14)'; c.lineWidth=1;
  for(let yy=y0+cab+10;yy<y0+len-4;yy+=8){ c.beginPath(); c.moveTo(x0+2,yy); c.lineTo(x0+wid-2,yy); c.stroke(); }
  G.rrect(x0+2,y0,wid-4,cab,6); c.fillStyle=o.cab||'#3a68b0'; c.fill();
  c.fillStyle='rgba(18,28,44,.9)'; G.rrect(x0+5,y0+3.5,wid-10,6,2); c.fill();
  c.fillStyle='rgba(255,255,255,.18)'; c.fillRect(x0+5,y0+12,wid-10,2);
 } else if(o.t==='truck'){
  const cab=len*.44;
  G.rrect(x0,y0,wid,cab,7); c.fillStyle=o.col; c.fill();
  c.fillStyle='rgba(18,28,44,.9)'; G.rrect(x0+3,y0+cab*.2,wid-6,cab*.26,3); c.fill();
  c.fillStyle='rgba(255,255,255,.22)'; G.rrect(x0+4,y0+cab*.55,wid-8,cab*.3,3); c.fill();
  G.rrect(x0+1,y0+cab+1,wid-2,len-cab-1,3); c.fillStyle=G.shade(o.col,.62); c.fill();
  c.strokeStyle='rgba(255,255,255,.28)'; c.lineWidth=1.2; G.rrect(x0+2.5,y0+cab+2.5,wid-5,len-cab-4,2); c.stroke();
 } else {
  const g=c.createLinearGradient(x0,0,x0+wid,0); g.addColorStop(0,G.shade(o.col,.7)); g.addColorStop(.5,G.shade(o.col,1.18)); g.addColorStop(1,G.shade(o.col,.7));
  G.rrect(x0,y0,wid,len,7); c.fillStyle=g; c.fill();
  c.fillStyle='rgba(18,28,44,.9)'; G.rrect(x0+3,y0+len*.2,wid-6,len*.19,3); c.fill();
  c.fillStyle=G.shade(o.col,1.32); G.rrect(x0+4,y0+len*.41,wid-8,len*.3,3); c.fill();
  c.fillStyle='rgba(18,28,44,.85)'; G.rrect(x0+4,y0+len*.73,wid-8,len*.1,2); c.fill();
 }
 c.fillStyle='#ffeaa8'; c.fillRect(x0+3,y0+1,4,2); c.fillRect(x0+wid-7,y0+1,4,2);
 c.fillStyle='#ff3a3a'; c.fillRect(x0+2,y0+len-3,5,2.4); c.fillRect(x0+wid-7,y0+len-3,5,2.4);
}
function hazardTop(c,o,x,y){
 if(o.t==='pot'){
  c.fillStyle='#55555e'; c.beginPath(); c.ellipse(x,y,11,8,0,0,7); c.fill();
  c.fillStyle='#16161b'; c.beginPath(); c.ellipse(x,y+.5,8.5,6,0,0,7); c.fill();
 } else if(o.t==='sand'){
  c.fillStyle='rgba(214,186,120,.92)'; c.beginPath(); c.ellipse(x,y,18,12,0,0,7); c.fill();
  c.fillStyle='rgba(240,214,150,.9)'; for(let i=0;i<7;i++){ c.fillRect(x-12+i*4,y-6+((i*7)%11),2,2); }
 } else if(o.t==='oil'){
  c.fillStyle='#121219'; c.beginPath(); c.ellipse(x,y,15,10,.3,0,7); c.fill();
  c.strokeStyle='rgba(140,120,255,.55)'; c.lineWidth=1.5; c.beginPath(); c.ellipse(x-2,y-1,8,5,.3,3.6,5.6); c.stroke();
  c.strokeStyle='rgba(90,220,200,.45)'; c.beginPath(); c.ellipse(x+1,y+1,10,6,.3,.4,2); c.stroke();
 } else if(o.t==='cone'){
  c.fillStyle='rgba(0,0,0,.3)'; c.beginPath(); c.arc(x+1.5,y+2,6,0,7); c.fill();
  c.fillStyle='#e8690e'; c.beginPath(); c.arc(x,y,6,0,7); c.fill();
  c.strokeStyle='#fff'; c.lineWidth=1.8; c.beginPath(); c.arc(x,y,3.6,0,7); c.stroke();
  c.fillStyle='#ff9a40'; c.beginPath(); c.arc(x,y,1.6,0,7); c.fill();
 }
}

/* ============================ RIDE INTRO (route briefing) ============================ */
G.scenes.rideintro={
 enter(a){ this.R=DATA.ROUTES[a&&a.route]||DATA.ROUTES.r501; this.st={f:0}; },
 btn(){ return {id:'go',label:'KICKSTANDS UP',sub:'START THE RIDE',kind:'primary',x:22,y:G.VH-58,w:226,h:46}; },
 update(){
  if(G.backHit()){ G.go('rideselect'); return; }
  if(G.navList(this.st,[this.btn()])) G.go('ride',{route:this.R.id});
 },
 draw(c){
  const VH=G.VH, R=this.R;
  c.fillStyle='#120d09'; c.fillRect(0,0,VW,VH);
  const lines=G.wrap(R.intro.join(' '),7.3,VW-36);
  const tipLines=G.wrap(R.tips,6.6,VW-60);
  const below=22+16+10+lines.length*12.4+10+(tipLines.length*10+14)+12+54+18+16;
  const heroH=Math.max(70,Math.min(190,VH-58-14-44-below));
  c.save(); c.beginPath(); c.rect(0,44,VW,heroH); c.clip();
  G.cover(G.img[R.bg]||G.img.bg_convoy,0,44,VW,heroH,.45);
  const g=c.createLinearGradient(0,44+heroH*.4,0,44+heroH); g.addColorStop(0,'rgba(18,13,9,0)'); g.addColorStop(1,'rgba(18,13,9,1)');
  c.fillStyle=g; c.fillRect(0,44,VW,heroH);
  c.restore();
  let y=44+heroH+4;
  G.txt(R.name,VW/2,y,10.5,'#ffd060','center',VW-20,800); y+=22;
  G.txt(R.sub,VW/2,y,6.6,'#ff9a50','center',VW-20,700); y+=16+6;
  lines.forEach((l,i)=>G.txt(l,VW/2,y+i*12.4,7.3,'#efe6d8','center')); y+=lines.length*12.4+8;
  const th=tipLines.length*10+12;
  G.rrect(18,y,VW-36,th,10); c.fillStyle='rgba(128,255,160,.08)'; c.fill(); c.strokeStyle='rgba(128,255,160,.35)'; c.lineWidth=1; c.stroke();
  tipLines.forEach((l,i)=>G.txt(l,VW/2,y+6+i*10,6.6,'#a8ffc0','center',undefined,700)); y+=th+10;
  // controls legend
  const pill=(x,yy,w,t,col)=>{ G.rrect(x,yy,w,20,8); c.fillStyle='rgba(255,255,255,.08)'; c.fill(); c.strokeStyle=col; c.lineWidth=1; c.stroke(); G.txt(t,x+w/2,yy+5,6.5,col,'center',w-4,800); };
  pill(40,y,30,'◀','#ffb060'); pill(74,y,30,'▶','#ffb060');
  G.txt('CHANGE LANE',72,y+25,5.8,'#cfc4b0','center');
  pill(156,y,44,'BRAKE','#ff8a80'); pill(204,y,40,'GAS','#80ffa0');
  G.txt('SLOW / SPEED UP',200,y+25,5.8,'#cfc4b0','center');
  y+=38;
  G.txt('SWIPES AND ARROW KEYS WORK TOO',VW/2,y,5.8,'#8a7f70','center');
  y+=16;
  const best=G.save.best[R.id]||0, plays=G.save.plays[R.id]||0;
  G.txt(plays?('BEST '+best.toLocaleString()+' PTS • RIDDEN '+plays+'×'):'FIRST TIME ON THIS ROUTE',VW/2,y,6.6,'#ffd060','center',VW-20,700);
  G.button(this.btn(),true);
  G.topBar('ROUTE BRIEFING');
 }
};

/* ============================ RIDE ============================ */
G.scenes.ride={
 enter(a){
  const R=this.R=DATA.ROUTES[a&&a.route];
  if(!R){ G.go('rideselect',{},true); return; }
  this.mode='count'; this.count=3; this.cTick=0;
  this.dist=0; this.speed=R.baseSpeed; this.lane=1; this.px=LANE_X[1];
  this.hearts=3; this.inv=0; this.score=0; this.nearMiss=0; this.wob=0; this.slide=0; this.gustFx=0;
  this.obs=[]; this.nextSpawn=380; this.landmark=-1;
  this.cap=null; this.capSegs=R.curves?0:3; this.capDone=0; this.capNextAt=R.len*.22;
  this.gates=[]; this.cleanGates=0; this.totGates=0;
  if(R.curves){ for(let d=R.len*.1; d<R.len*.96; d+=R.len*.075){ this.gates.push({d,lim:130+Math.random()*40|0,hit:false,ok:false}); this.totGates++; } }
  this.deck=newDeck(); this.hand=[]; this.stopIdx=0;
  const nStops=R.stops||R.vistas||0;
  this.stops=nStops?Array.from({length:nStops},(_,i)=>({d:R.len*(i+1)/(nStops+(R.stops?.3:1)),done:false,kind:R.stops?'card':'vista'})):[];
  this.nextGust=R.gusts?R.len*.14:Infinity;
  this.assist=R.assist?{at:R.len*.55,fired:false}:null;
  this.bd=(R.id==='r501'&&!G.save.bdDone)?{at:R.len*.58,fired:false}:null;
  this.bdState=null; this.crashedOnce=false; this.mst={f:0}; this.modalT=0;
  this.pause=G.Pause({restart:['ride',{route:R.id}],quit:['rideselect'],quitLabel:'QUIT TO ROUTE BOARD'});
  AUDIO.play(R.theme); AUDIO.engineStart();
 },
 exit(){ AUDIO.engineStop(); },
 g(){ const VH=G.VH, ctrlY=VH-CTRL_H; return {VH,ctrlY,PY:ctrlY-74,top:HUD_H}; },
 bend(d){ const a=this.R.curves?1:.22; return a*(22*Math.sin(d*.0045)+9*Math.sin(d*.0123+1.3)); },
 yOf(d){ return this.g().PY-(d-this.dist)*K; },
 ahead(){ const g=this.g(); return (g.PY-g.top)/K; },
 ctrl(){
  const g=this.g(), y=g.ctrlY+10, h=CTRL_H-20;
  return {left:{x:6,y,w:58,h},right:{x:68,y,w:58,h},brake:{x:136,y,w:62,h},gas:{x:202,y,w:62,h}};
 },
 /* ---------- spawning ---------- */
 spawn(){
  const R=this.R, p=this.dist/R.len;
  const density=R.traffic*(0.75+p*.6);
  this.nextSpawn=this.dist+(140+Math.random()*260)/Math.max(.25,density);
  const d=this.dist+this.ahead()+50;
  const vehAt=l=>this.obs.some(o=>o.lane===l&&Math.abs(o.d-d)<130);
  const blocked=[0,1,2,3].filter(l=>this.obs.some(o=>o.lane===l&&Math.abs(o.d-d)<95&&(o.t==='car'||o.t==='truck'||o.t==='semi'))).length;
  let lane=Math.floor(Math.random()*4);
  for(let k=0;k<4&&vehAt(lane);k++) lane=(lane+1)%4;
  if(vehAt(lane)) return;
  // never close the whole road: some lane always stays open around anything new (so the captain - and you - can get through)
  { const occ=new Set(this.obs.filter(o=>Math.abs(o.d-d)<160).map(o=>o.lane)); occ.add(lane); if(occ.size>=4) return; }
  const roll=Math.random();
  if(roll<R.traffic*.52){
   if(blocked>=3) return; // never wall off the whole road
   const kind=Math.random(), spd=R.baseSpeed*(.35+Math.random()*.3);
   if(kind<.5) this.obs.push({t:'car',d,lane,w:46,spd,col:['#b03030','#3a68b0','#c8c8d0','#d8a030','#508050','#7a4ab0'][Math.floor(Math.random()*6)]});
   else if(kind<.8) this.obs.push({t:'truck',d,lane,w:58,spd:spd*.9,col:['#d0d0d8','#8a2a2a','#2a4a6a'][Math.floor(Math.random()*3)]});
   else this.obs.push({t:'semi',d,lane,w:92,spd:spd*.85,col:'#e8e8f0',cab:['#3a68b0','#b03030','#2a7a4a'][Math.floor(Math.random()*3)]});
  }
  else if(roll<R.traffic*.52+R.potholes*.28) this.obs.push({t:'pot',d,lane,w:20,spd:0});
  else if(roll<R.traffic*.52+R.potholes*.28+R.sand*.2) this.obs.push({t:'sand',d,lane,w:34,spd:0});
  else if(roll<R.traffic*.52+R.potholes*.28+R.sand*.2+.12) this.obs.push({t:'cone',d,lane,w:12,spd:0});
  else this.obs.push({t:'oil',d,lane,w:28,spd:0});
 },
 /* ---------- update ---------- */
 update(dt){
  const R=this.R;
  if(this.pause.open){ this.pause.update(); if(!this.pause.open) AUDIO.engineSet(.2); return; }
  if(this.mode!=='results'&&G.pauseHit()){ this.pause.show(); AUDIO.engineSet(.04); return; }
  this.modalT+=dt;
  if(this.mode==='count'){
   this.cTick+=dt;
   AUDIO.engineSet(.2+this.cTick*.1);
   if(this.cTick>1){ this.cTick=0; if(--this.count<=0){ this.mode='ride'; AUDIO.sfx('rev'); } else AUDIO.sfx('tick'); }
   return;
  }
  if(this.mode==='results'){ this.updResults(); return; }
  if(this.mode==='bd'){ this.updBD(); return; }
  if(this.mode==='stop'){ this.updStop(); return; }
  if(this.mode==='assist'){
   const id=this.modalT>.4?G.navList(this.mst,this.assistBtns()):null;
   if(id){ this.score+=150; AUDIO.sfx('cheer'); G.toast('NOBODY RIDES ALONE +150','#80ffa0'); this.mode='ride'; }
   return;
  }
  const g=this.g(), C=this.ctrl();
  // speed: GAS / BRAKE (held buttons or up/down keys)
  const gas=G.keys.up||G.held(C.gas.x,C.gas.y,C.gas.w,C.gas.h);
  const brk=G.keys.down||G.held(C.brake.x,C.brake.y,C.brake.w,C.brake.h);
  this.gasOn=gas; this.brkOn=brk;
  if(gas) this.speed+=160*dt;
  else if(brk) this.speed-=240*dt;
  else this.speed+=(R.baseSpeed-this.speed)*dt*.7;
  this.speed=Math.max(46,Math.min(R.maxSpeed,this.speed));
  AUDIO.engineSet((this.speed-40)/(R.maxSpeed-40));
  // lanes: lane buttons, arrow keys, swipe, or tap left/right of the bike
  if(this.slide>0) this.slide-=dt;
  let lt=G.pressed.left, rt=G.pressed.right;
  if(G.clicked(C.left.x,C.left.y,C.left.w,C.left.h)) lt=true;
  if(G.clicked(C.right.x,C.right.y,C.right.w,C.right.h)) rt=true;
  if(G.swipe&&G.swipe.y0>g.top&&G.swipe.y0<g.ctrlY&&Math.abs(G.swipe.dx)>Math.abs(G.swipe.dy)){ if(G.swipe.dx<0) lt=true; else rt=true; }
  else if(G.tapped(0,g.top,VW,g.ctrlY-g.top)){ if(G.ptr.rsx<this.px-14) lt=true; else if(G.ptr.rsx>this.px+14) rt=true; }
  this.lBtn=Math.max(0,(this.lBtn||0)-dt); this.rBtn=Math.max(0,(this.rBtn||0)-dt);
  if(this.slide<=0){
   if(lt&&this.lane>0){ this.lane--; AUDIO.sfx('blip'); this.lBtn=.15; }
   if(rt&&this.lane<3){ this.lane++; AUDIO.sfx('blip'); this.rBtn=.15; }
  }
  const tx=LANE_X[this.lane];
  this.px+=(tx-this.px)*Math.min(1,dt*10);
  if(this.wob>0) this.wob-=dt;
  if(this.gustFx>0) this.gustFx-=dt;

  this.dist+=this.speed*dt;
  this.score+=this.speed*dt*.05;
  if(this.inv>0) this.inv-=dt;

  const li=Math.floor(this.dist/R.len*R.landmarks.length);
  if(li!==this.landmark&&li<R.landmarks.length){ this.landmark=li; G.toast(R.landmarks[li],'#80e0ff'); }

  if(this.dist>this.nextSpawn) this.spawn();
  for(const o of this.obs){ if(o.spd) o.d+=o.spd*dt; }
  const behind=(g.VH-g.PY)/K+80;
  this.obs=this.obs.filter(o=>o.d>this.dist-behind&&o.d<this.dist+1600);

  // Road Captain formation (non-curve routes)
  if(this.capDone<this.capSegs&&!this.cap&&this.dist>this.capNextAt){
   const cd=this.dist+Math.min(260,this.ahead()-40);
   this.cap={d:cd,t:9,zone:0,lane:1,x:LANE_X[1],prev:null,since:9,want:null,sigT:0};
   // he starts on whichever line is clearest
   const cl=[1,2,0,3].map(l=>({l,t:this.capThreat(l,this.dist-30,cd+230)})).sort((a,b)=>b.t-a.t)[0];
   this.cap.lane=cl.l; this.cap.x=LANE_X[cl.l];
   G.toast('ROAD CAPTAIN AHEAD - HOLD HIS LINE!','#ffd060'); AUDIO.sfx('horn');
  }
  if(this.cap){
   const cp=this.cap;
   cp.d+=R.baseSpeed*1.02*dt; cp.t-=dt; cp.since+=dt;
   // he signals, then moves over a lane to get the formation around trouble
   if(cp.sigT>0){ cp.sigT-=dt; if(cp.sigT<=0&&cp.want!=null){ cp.prev=cp.lane; cp.lane=cp.want; cp.want=null; cp.since=0; } }
   else if(cp.since>.45) this.capSteer(cp);
   cp.x+=(LANE_X[cp.lane]-cp.x)*Math.min(1,dt*6);
   for(const o of this.obs) if(o.lane===cp.lane&&Math.abs(o.d-cp.d)<o.w/2+20) o.capFault=true;   // nowhere to go: his call
   const gap=cp.d-this.dist;
   cp.online=this.lane===cp.lane||(cp.prev!=null&&this.lane===cp.prev&&cp.since<1);   // a beat to follow him over
   cp.inzone=gap>40&&gap<150&&cp.online;
   if(cp.inzone) cp.zone+=dt;
   if(cp.t<=0){
    if(cp.zone>=4.5){ this.score+=120; this.capDone++; G.toast('FORMATION BONUS +120','#80ffa0'); AUDIO.sfx('bigpoint'); }
    else G.toast('FORMATION BROKE UP','#9a8f80');
    this.cap=null; this.capNextAt=this.dist+R.len*.24;
    if(this.capDone>=3) G.ach('formation');
   }
  }
  for(const gt of this.gates){
   if(!gt.hit&&this.dist>gt.d){
    gt.hit=true;
    if(this.speed<=gt.lim+6){ gt.ok=true; this.cleanGates++; this.score+=40; G.toast('SMOOTH CURVE +40','#80ffa0'); AUDIO.sfx('point'); }
    else { this.wob=.8; G.shake=4; G.toast('WIDE! EASE OFF IN CURVES','#ff7030'); AUDIO.sfx('nearmiss'); }
   }
  }
  if(this.stops[this.stopIdx]&&this.dist>this.stops[this.stopIdx].d){
   this.mode='stop'; this.modalT=0; this.stopCard=null; this.mst={f:0};
   if(this.stops[this.stopIdx].kind==='vista'){ this.score+=75; AUDIO.sfx('pickup'); } else AUDIO.sfx('horn');
   AUDIO.engineSet(.08);
  }
  if(this.dist>this.nextGust){
   this.nextGust=this.dist+R.len*(.1+Math.random()*.1);
   this.wob=1; this.slide=.5; this.gustFx=.7; G.shake=3; AUDIO.sfx('swish');
   const push=Math.random()<.5?-1:1;
   this.gustDir=push;
   if(this.cap&&this.cap.inzone) G.toast('CROSSWIND - THE FORMATION HOLDS YOU STEADY','#80d8f0');   // riding tucked in behind the captain shelters you
   else { this.lane=Math.max(0,Math.min(3,this.lane+push)); G.toast('CROSSWIND GUST!','#80d8f0'); }
  }
  if(this.assist&&!this.assist.fired&&this.dist>this.assist.at){
   this.assist.fired=true; this.mode='assist'; this.modalT=0; this.mst={f:0}; AUDIO.engineSet(.06);
  }
  if(this.bd&&!this.bd.fired&&this.dist>this.bd.at){
   this.bd.fired=true; this.mode='bd'; this.modalT=0; this.mst={f:0};
   this.bdState={ph:'intro',i:0,step:0,good:0,showR:null,ord:DATA.BIKERDOWN.steps.map(s=>G.order(s.opts.length))};
   AUDIO.play('somber'); AUDIO.engineSet(.05);
  }
  // collisions (road units; the bike is ~44 units long)
  for(const o of this.obs){
   if(o.lane!==this.lane){
    if(!o.nm&&Math.abs(o.d-this.dist)<30&&Math.abs(o.lane-this.lane)===1&&this.speed>R.baseSpeed*1.1&&(o.t==='car'||o.t==='truck'||o.t==='semi')){
     o.nm=true; this.nearMiss++; this.score+=15; AUDIO.sfx('nearmiss');
    }
    continue;
   }
   if(Math.abs(o.d-this.dist)>o.w/2+22) continue;
   if(!o.used&&this.cap&&this.cap.inzone){
    // you held the captain's line (including the beat it takes to follow him over): anything in it is on him
    o.used=true; o.nm=true; this.score+=20; AUDIO.sfx('nearmiss'); G.toast('CAPTAIN\u2019S LINE - NO PENALTY','#ffd060'); continue;
   }
   if(o.t==='pot'){ if(!o.used){ o.used=true; this.wob=.7; this.speed*=.72; G.shake=3; AUDIO.sfx('thud'); G.toast('POTHOLE!','#ff7030'); } }
   else if(o.t==='sand'){ if(!o.used){ o.used=true; this.wob=1; this.speed*=.8; AUDIO.sfx('swish'); G.toast('SAND - EASY NOW','#d8c080'); } }
   else if(o.t==='oil'){ if(!o.used){ o.used=true; this.slide=.9; this.wob=1; AUDIO.sfx('swish'); G.toast('OIL SLICK!','#b0a0ff'); } }
   else if(o.t==='cone'){ if(!o.used){ o.used=true; this.speed*=.85; AUDIO.sfx('thud'); } }
   else if(this.inv<=0){ this.crash(); o.nm=true; }
  }
  if(this.dist>=R.len) this.finish(false);
 },
 /* the nearest obstacle (front edge, road units from 'from') on a lane between from and to; Infinity = clear */
 capThreat(lane,from,to){
  let best=Infinity;
  for(const o of this.obs){ if(o.lane!==lane||o.used) continue; const a=o.d-o.w/2, b=o.d+o.w/2; if(b<from||a>to) continue; best=Math.min(best,Math.max(0,a-from)); }
  return best;
 },
 /* the Road Captain keeps the whole formation line clear: from the member (who follows) to what he can see ahead */
 capSteer(cp){
  const ahead=cp.d+230, cur=this.capThreat(cp.lane,this.dist+25,ahead);
  if(cur===Infinity) return;
  let best=null;
  for(const l of [cp.lane-1,cp.lane+1]){
   if(l<0||l>3) continue;
   const t=this.capThreat(l,this.dist-30,ahead);   // the new line must be clear beside the member too
   const score=t===Infinity?1e6-Math.abs(l-1.5):t;   // clear beats close; prefer the middle of the road
   if(t>cur+40&&(!best||score>best.score)) best={l,score};
  }
  if(!best) return;
  cp.want=best.l; cp.sigT=.4; AUDIO.sfx('blip');
 },
 crash(){
  this.hearts--; this.inv=2; this.crashedOnce=true;
  G.shake=7; AUDIO.sfx('crash');
  this.speed=Math.max(60,this.speed*.4);
  if(this.hearts<=0) this.finish(true);
  else { AUDIO.sfx('hurt'); G.toast('EASY, PROSPECT! '+this.hearts+' LEFT','#ff4050'); }
 },
 /* ---------- modal panels (stop / assist / biker down) ---------- */
 panelRect(h){ const VH=G.VH; h=Math.min(h,VH-60); return {x:12,y:Math.max(50,Math.round((VH-h)/2)),w:VW-24,h}; },
 assistBtns(){ const P=this.panelRect(250); return [{id:'help',label:'PULL OVER & HELP',sub:'+150 PTS',kind:'primary',x:P.x+16,y:P.y+P.h-58,w:P.w-32,h:44}]; },
 stopBtns(){
  const st=this.stops[this.stopIdx], P=this.panelRect(st.kind==='vista'?280:330);
  const last=this.stopIdx+1>=this.stops.length;
  let label='KICKSTANDS UP';
  if(st.kind==='card'&&!this.stopCard) label='DRAW A CARD';
  else if(st.kind==='card'&&last) label='SHOW YOUR HAND';
  return [{id:'go',label,kind:'primary',x:P.x+16,y:P.y+P.h-58,w:P.w-32,h:44}];
 },
 updStop(){
  if(this.modalT<.4) return;
  const st=this.stops[this.stopIdx];
  const id=G.navList(this.mst,this.stopBtns());
  if(!id) return;
  if(st.kind==='card'&&!this.stopCard){ this.stopCard=this.deck.pop(); this.hand.push(this.stopCard); this.score+=50; AUDIO.sfx('card'); this.modalT=.2; return; }
  st.done=true; this.stopIdx++; this.stopCard=null; this.mode='ride';
  if(st.kind==='card'&&this.stopIdx>=this.stops.length) this.finish(false);
 },
 bdBtns(){
  const B=this.bdState, D=DATA.BIKERDOWN, VH=G.VH;
  if(B.ph==='quiz'&&!B.showR){
   const opts=D.steps[B.step].opts, ord=(B.ord&&B.ord[B.step])||opts.map((o,k)=>k), h=50, gap=8, y0=VH-14-opts.length*(h+gap);
   return ord.map((k,j)=>({id:'o'+k,label:'',text:opts[k].t,x:14,y:y0+j*(h+gap),w:VW-28,h}));   // shuffled: the right call moves around
  }
  let label='CONTINUE';
  if(B.ph==='prompt') label='PULL OVER - ALWAYS';
  return [{id:'next',label,kind:'primary',x:22,y:VH-62,w:226,h:46}];
 },
 updBD(){
  if(this.modalT<.35) return;
  const B=this.bdState, D=DATA.BIKERDOWN;
  const id=G.navList(this.mst,this.bdBtns());
  if(!id) return;
  this.modalT=0;
  if(B.ph==='intro'){ if(++B.i>=D.intro.length) B.ph='prompt'; }
  else if(B.ph==='prompt'){ B.ph='quiz'; this.mst={f:0}; }
  else if(B.ph==='quiz'){
   if(B.showR){ B.showR=null; this.mst={f:0}; if(++B.step>=D.steps.length){ B.ph='outro'; B.i=0; } }
   else { const o=D.steps[B.step].opts[+id.slice(1)]; B.lastOk=o.ok; if(o.ok){ B.good++; this.score+=100; AUDIO.sfx('ok'); } else AUDIO.sfx('buzzer'); B.showR=o.r; this.mst={f:0}; }
  }
  else if(B.ph==='outro'){
   if(++B.i>=D.outro.length){
    this.score+=250;
    if(B.good===3){ this.score+=500; G.ach('brothers'); G.toast(D.perfect,'#80ffa0'); }
    G.save.bdDone=true; G.persist();
    this.mode='ride'; AUDIO.play(this.R.theme);
   }
  }
 },
 /* ---------- finish / results ---------- */
 finish(wiped){
  AUDIO.engineStop();
  const R=this.R, p=Math.min(1,this.dist/R.len);
  const rows=[];
  rows.push(['ROAD SCORE',Math.round(this.score)]);
  rows.push(['NEAR MISSES ×'+this.nearMiss,this.nearMiss*15]);
  if(!wiped) rows.push(['ROUTE COMPLETE',300]);
  if(!wiped&&!this.crashedOnce){ rows.push(['CLEAN RIDE',250]); G.ach('no_crash'); }
  if(R.curves&&this.totGates){ rows.push(['CURVES '+this.cleanGates+'/'+this.totGates,this.cleanGates*10]);
   if(!wiped&&this.cleanGates===this.totGates) G.ach('dragon_clean'); }
  if(R.stops){
   while(this.hand.length<5) this.hand.push(this.deck.pop());
   const [pi,label]=evalHand(this.hand.slice(0,5));
   rows.push(['HAND: '+label,DATA.POKER_PAY[pi][1]]);
   if(pi<=3) G.ach('poker_fh');
  }
  let total=0; rows.forEach(r=>total+=Math.max(0,Math.round(r[1])));
  if(wiped) total=Math.round(total*(.4+p*.3));
  this.resRows=rows; this.resTotal=total; this.wiped=wiped;
  this.mode='results'; this.mst={f:0}; this.modalT=0;
  const prevBest=G.save.best[R.id]||0;
  this.newBest=total>prevBest;
  if(total>prevBest) G.save.best[R.id]=total;
  G.save.plays[R.id]=(G.save.plays[R.id]||0)+1;
  G.award(total,R.name);
  G.ach('first_ride');
  if(!wiped){
   if(R.id==='r501') G.storyEvent('r501');
   if(R.id==='poker') G.storyEvent('poker');
   if(R.id==='memorial') G.ach('memorial');
   if(DATA.ROUTE_ORDER.every(k=>(G.save.plays[k]||0)>0)) G.ach('all_routes');
  }
  G.updateBoard();
  G.clearToasts(true);
  AUDIO.jingle(wiped?'lose':'win');
 },
 resBtns(){
  const VH=G.VH, y=VH-104;
  return [{id:'again',label:'RIDE AGAIN',kind:'primary',x:22,y,w:226,h:42},
   {id:'board',label:'ROUTE BOARD',x:22,y:y+50,w:110,h:38,size:7.5},
   {id:'club',label:'CLUBHOUSE',x:138,y:y+50,w:110,h:38,size:7.5}];
 },
 updResults(){
  if(this.modalT<.5) return;
  const id=G.navList(this.mst,this.resBtns(),{both:true});
  if(id==='again') G.go('ride',{route:this.R.id});
  else if(id==='board') G.go('rideselect');
  else if(id==='club') G.go('club');
 },
 /* ================= drawing ================= */
 draw(c){
  const R=this.R; if(!R) return;
  this.drawWorld(c);
  this.drawHUD(c);
  this.drawControls(c);
  if(this.mode==='count') this.drawCount(c);
  else if(this.mode==='bd') this.drawBD(c);
  else if(this.mode==='stop') this.drawStop(c);
  else if(this.mode==='assist') this.drawAssist(c);
  else if(this.mode==='results') this.drawResults(c);
  if(this.pause.open) this.pause.draw(c);
 },
 drawWorld(c){
  const R=this.R, g=this.g(), t=this.dist;
  const top=g.top, bot=g.ctrlY;
  c.save(); c.beginPath(); c.rect(0,top,VW,bot-top); c.clip();
  // shoulders
  const scn=R.scn||'palms';
  const sh=scn==='water'?'#2a86b8':(R.shoulder||'#c8b088');
  c.fillStyle=sh; c.fillRect(0,top,VW,bot-top);
  const dTop=t+(g.PY-top)/K+60, dBot=t-(bot-g.PY)/K-60;
  this.drawScenery(c,scn,dBot,dTop,true);
  // road surface
  const step=6;
  c.beginPath();
  for(let y=top-step;y<=bot+step;y+=step){ const d=t+(g.PY-y)/K; c.lineTo(ROAD_L+this.bend(d)-4,y); }
  for(let y=bot+step;y>=top-step;y-=step){ const d=t+(g.PY-y)/K; c.lineTo(ROAD_L+ROAD_W+this.bend(d)+4,y); }
  c.closePath();
  c.fillStyle=scn==='water'?'#bfc4cc':'#8a8478'; c.fill();
  c.beginPath();
  for(let y=top-step;y<=bot+step;y+=step){ const d=t+(g.PY-y)/K; c.lineTo(ROAD_L+this.bend(d),y); }
  for(let y=bot+step;y>=top-step;y-=step){ const d=t+(g.PY-y)/K; c.lineTo(ROAD_L+ROAD_W+this.bend(d),y); }
  c.closePath();
  const rg=c.createLinearGradient(ROAD_L,0,ROAD_L+ROAD_W,0); rg.addColorStop(0,'#34343c'); rg.addColorStop(.5,'#3e3e47'); rg.addColorStop(1,'#34343c');
  c.fillStyle=rg; c.fill();
  // edge lines
  c.strokeStyle='rgba(240,236,220,.85)'; c.lineWidth=2;
  for(const off of [5,ROAD_W-5]){
   c.beginPath();
   for(let y=top-step;y<=bot+step;y+=step){ const d=t+(g.PY-y)/K; c.lineTo(ROAD_L+off+this.bend(d),y); }
   c.stroke();
  }
  // lane dashes
  c.strokeStyle='rgba(240,236,220,.75)'; c.lineWidth=2;
  for(let i=1;i<4;i++){
   const xb=ROAD_L+LANE_W*i;
   for(let d=Math.floor(dBot/36)*36; d<dTop; d+=36){
    c.beginPath(); c.moveTo(xb+this.bend(d),this.yOf(d)); c.lineTo(xb+this.bend(d+18),this.yOf(d+18)); c.stroke();
   }
  }
  // curve gates
  for(const gt of this.gates){
   const y=this.yOf(gt.d); if(y<top-40||y>bot+40) continue;
   const b=this.bend(gt.d), col=gt.hit?(gt.ok?'#80ffa0':'#ff7a50'):'#ffd060';
   c.fillStyle=gt.hit?(gt.ok?'rgba(128,255,160,.16)':'rgba(255,110,80,.16)'):'rgba(255,208,96,.14)';
   c.fillRect(ROAD_L+b,y-5,ROAD_W,10);
   c.fillStyle=col; for(let x=ROAD_L+b+6;x<ROAD_L+b+ROAD_W-6;x+=16){ c.beginPath(); c.moveTo(x,y+4); c.lineTo(x+6,y-3); c.lineTo(x+12,y+4); c.lineTo(x+9,y+4); c.lineTo(x+6,y); c.lineTo(x+3,y+4); c.fill(); }
   const sx=ROAD_L+ROAD_W+b+22;
   c.save(); c.translate(sx,y); c.rotate(Math.PI/4); c.fillStyle='#ffc020'; c.fillRect(-10,-10,20,20); c.strokeStyle='#1a1a20'; c.lineWidth=1.5; c.strokeRect(-8,-8,16,16); c.restore();
   G.txt(String(Math.round(gt.lim*.38)),sx,y-5,6.5,'#1a1a20','center',undefined,800);
   G.txtO(gt.hit?(gt.ok?'✓ SMOOTH':'✗ WIDE'):'CURVE ≤'+Math.round(gt.lim*.38)+' MPH',ROAD_L+b+ROAD_W/2,y-17,6.3,col,'center');
  }
  // stops: poker tents / overlook signs (right shoulder)
  for(let i=0;i<this.stops.length;i++){
   const s=this.stops[i], y=this.yOf(s.d); if(y<top-60||y>bot+60) continue;
   const xr=ROAD_L+ROAD_W+this.bend(s.d);
   if(s.kind==='vista'){
    c.fillStyle='#5a6070'; G.rrect(xr+2,y-22,40,44,6); c.fill();
    c.fillStyle=s.done?'#405a48':'#2a5a8a'; G.rrect(xr+6,y-10,34,20,3); c.fill();
    G.txt('VIEW',xr+23,y-5,6,'#e8f0f8','center',undefined,800);
   } else {
    c.fillStyle='rgba(240,120,24,.25)'; c.fillRect(xr-LANE_W,y-26,LANE_W,52);
    c.fillStyle=s.done?'#405040':'#b04030';
    c.beginPath(); c.moveTo(xr+4,y+16); c.lineTo(xr+24,y-18); c.lineTo(xr+44,y+16); c.closePath(); c.fill();
    c.fillStyle='#f2ead8'; G.rrect(xr+10,y-2,28,12,3); c.fill();
    G.txt('STOP '+(i+1),xr+24,y,5.6,'#201828','center',26,800);
   }
  }
  // memorial: rider stopped on the shoulder
  if(this.assist&&!this.assist.fired){
   const y=this.yOf(this.assist.at);
   if(y>top-60&&y<bot+60){
    const xr=ROAD_L+ROAD_W+this.bend(this.assist.at)+20;
    bikeTop(c,xr,y,{type:'bike',seat:1,body:'#5a5a6a',gender:'m',hair:'#333'},.8,{rot:.5});
    c.fillStyle=(Math.sin(G.time*8)>0)?'#ff5030':'#ffb040'; c.beginPath(); c.arc(xr-10,y+22,2.5,0,7); c.fill();
    G.txtO('RIDER STOPPED',xr-6,y-34,6,'#ffd060','center');
   }
  }
  // obstacles
  for(const o of this.obs){
   const y=this.yOf(o.d); if(y<top-70||y>bot+70) continue;
   const x=LANE_X[o.lane]+this.bend(o.d);
   if(o.t==='car'||o.t==='truck'||o.t==='semi') carTop(c,o,x,y); else hazardTop(c,o,x,y);
  }
  // Road Captain
  if(this.cap){
   const cp=this.cap, y=this.yOf(cp.d), x=cp.x+this.bend(cp.d);
   const z0=this.yOf(cp.d-40), z1=this.yOf(cp.d-150), zx=LANE_X[cp.lane]-LANE_W/2+this.bend(cp.d-95)+2;
   c.fillStyle=cp.inzone?'rgba(128,255,160,.22)':'rgba(255,208,96,.12)';
   c.fillRect(zx,z0,LANE_W-4,z1-z0);
   c.strokeStyle=cp.inzone?'rgba(128,255,160,.7)':'rgba(255,208,96,.5)'; c.setLineDash([4,4]); c.lineWidth=1.2;
   c.strokeRect(zx,z0,LANE_W-4,z1-z0); c.setLineDash([]);
   bikeTop(c,x,y,{type:'trike',seat:1,body:'#f07818',gender:'m',hair:'#333'},1,{rot:(LANE_X[cp.lane]-cp.x)*.012});
   const dir=cp.want!=null?Math.sign(cp.want-cp.lane):0;
   if(dir&&(G.rm()||Math.sin(G.time*18)>0)){   // turn signal
    c.fillStyle='#ffb020'; c.beginPath(); c.moveTo(x+dir*20,y); c.lineTo(x+dir*12,y-6); c.lineTo(x+dir*12,y+6); c.closePath(); c.fill();
   }
   const msg=dir?(dir<0?'\u25C0 MOVING LEFT - FOLLOW ME':'FOLLOW ME - MOVING RIGHT \u25B6'):(cp.inzone?'HOLDING THE LINE':'CAPTAIN: TUCK IN BEHIND ME');
   G.txtO(msg,Math.max(70,Math.min(VW-70,x)),y-36,6.2,dir?'#ffd060':(cp.inzone?'#80ffa0':'#ffd060'),'center');
  }
  // gust streaks
  if(this.gustFx>0&&!G.rm()){
   c.strokeStyle='rgba(220,240,255,'+(this.gustFx*.6)+')'; c.lineWidth=1.5;
   for(let i=0;i<7;i++){ const y=top+20+i*((bot-top-40)/7)+((G.time*200)%30); const x=((G.time*400*(this.gustDir||1)+i*90)%(VW+80)+VW+80)%(VW+80)-40;
    c.beginPath(); c.moveTo(x,y); c.lineTo(x+30*(this.gustDir||1),y-2); c.stroke(); }
  }
  // player
  if(this.inv<=0||Math.sin(G.time*20)>0){
   const wob=this.wob>0&&!G.rm()?Math.sin(G.time*30)*2:0;
   const lean=(LANE_X[this.lane]-this.px)*.012;
   bikeTop(c,this.px+this.bend(this.dist)+wob,g.PY,G.save.avatar,1.12,{beam:true,rot:lean});
  }
  c.restore();
 },
 drawScenery(c,scn,dBot,dTop){
  const SP=46, k0=Math.floor(dBot/SP), k1=Math.ceil(dTop/SP), t=this.dist;
  for(let k=k0;k<=k1;k++){
   const h1=hsh(k), h2=hsh(k+999), h3=hsh(k*3+7);
   const d=k*SP+h1*20, y=this.yOf(d), b=this.bend(d);
   const left=h2<.5;
   const edge=left?ROAD_L+b:ROAD_L+ROAD_W+b;
   const room=left?edge-6:VW-edge-6;
   if(room<10) continue;
   const off=8+h3*(room-12);
   const x=left?edge-off:edge+off;
   switch(scn){
    case 'palms':
     if(h1<.12&&!left){ c.fillStyle='#4a3522'; c.fillRect(x-14,y-2,28,4); c.fillStyle='#f2ead8'; G.rrect(x-16,y-12,32,12,2); c.fill(); G.txt('BEACH',x,y-10,5,'#d04020','center',30,800); break; }
     c.fillStyle='rgba(0,0,0,.18)'; c.beginPath(); c.arc(x+3,y+3,9,0,7); c.fill();
     c.fillStyle='#2f8a4a';
     for(let i=0;i<6;i++){ const a=i*Math.PI/3+h1; c.beginPath(); c.ellipse(x+Math.cos(a)*6,y+Math.sin(a)*6,7,2.6,a,0,7); c.fill(); }
     c.fillStyle='#7a5a2a'; c.beginPath(); c.arc(x,y,2.6,0,7); c.fill();
     break;
    case 'pines':
     c.fillStyle='rgba(0,0,0,.2)'; c.beginPath(); c.arc(x+3,y+3,10,0,7); c.fill();
     c.fillStyle='#1d4a30'; c.beginPath(); c.arc(x,y,10,0,7); c.fill();
     c.fillStyle='#2a6a40'; c.beginPath(); c.arc(x-1.5,y-1.5,6.5,0,7); c.fill();
     c.fillStyle='#3a8a52'; c.beginPath(); c.arc(x-2.5,y-2.5,3,0,7); c.fill();
     break;
    case 'farm':
     if(h1<.25){ c.fillStyle='#8a2a2a'; G.rrect(x-10,y-8,20,16,2); c.fill(); c.fillStyle='#e8e0d0'; c.fillRect(x-1,y-8,2,16); break; }
     c.fillStyle='rgba(90,120,50,.55)'; for(let i=-2;i<=2;i++) c.fillRect(x-12,y+i*4,24,1.6);
     if(h3>.7){ c.fillStyle='#d8b050'; c.beginPath(); c.arc(x,y,4.5,0,7); c.fill(); c.strokeStyle='#a88030'; c.lineWidth=1; c.stroke(); }
     break;
    case 'ridge':
     c.fillStyle='rgba(0,0,0,.18)'; c.beginPath(); c.arc(x+3,y+3,9,0,7); c.fill();
     c.fillStyle=h3>.5?'#3a7a4a':'#5a8a3a'; c.beginPath(); c.arc(x,y,9,0,7); c.fill();
     c.fillStyle='rgba(255,255,255,.12)'; c.beginPath(); c.arc(x-2.5,y-2.5,4,0,7); c.fill();
     break;
    case 'water':
     c.fillStyle='rgba(255,255,255,.35)'; c.fillRect(x-6,y,12,1.6);
     if(h1<.06){ c.fillStyle='#f4f0e8'; G.rrect(x-4,y-9,8,18,4); c.fill(); c.fillStyle='#2a5a8a'; c.fillRect(x-2,y-3,4,5); }
     break;
    case 'memorial':
     c.fillStyle='#b8bcc8'; c.beginPath(); c.arc(x,y,2,0,7); c.fill();
     c.fillStyle='#b02a30'; c.fillRect(x+2,y-8,12,8); c.fillStyle='#e8e8f0'; c.fillRect(x+2,y-6,12,1.4); c.fillRect(x+2,y-3.4,12,1.4);
     c.fillStyle='#20306a'; c.fillRect(x+2,y-8,5,4);
     break;
   }
  }
  if(scn==='water'){ // bridge rails along the road
   const g=this.g();
   c.strokeStyle='#c8ccd4'; c.lineWidth=2;
   for(const off of [-8,ROAD_W+8]){ c.beginPath(); for(let y=g.top-6;y<=g.ctrlY+6;y+=6){ const d=t+(g.PY-y)/K; c.lineTo(ROAD_L+off+this.bend(d),y); } c.stroke(); }
  }
 },
 drawHUD(c){
  const R=this.R;
  c.fillStyle='rgba(11,10,16,.95)'; c.fillRect(0,0,VW,HUD_H);
  c.fillStyle='rgba(240,120,24,.5)'; c.fillRect(0,HUD_H,VW,1);
  G.pauseBtnDraw();
  G.hearts(46,6,this.hearts,3,11);
  G.txt(Math.round(this.score).toLocaleString()+' PTS',46,21,7,'#ffd060','left',100,800);
  // speedometer chip
  const mph=Math.round(this.speed*.38);
  const nextGate=this.gates.find(gt=>!gt.hit&&gt.d-this.dist<300&&gt.d>this.dist);
  const over=nextGate&&this.speed>nextGate.lim+6;
  G.rrect(VW-84,5,78,27,10); c.fillStyle=over?'rgba(255,80,60,.25)':'rgba(255,255,255,.07)'; c.fill();
  c.strokeStyle=over?'#ff6a50':'rgba(255,255,255,.14)'; c.lineWidth=1; c.stroke();
  G.txt(String(mph),VW-50,7.5,12,over?'#ff8a70':'#f4ede2','right',undefined,800);
  G.txt('MPH',VW-46,16,6,'#9a8f80','left',undefined,700);
  // gauge arc
  const sp=(this.speed-40)/(R.maxSpeed-40);
  G.rrect(VW-140,12,48,6,3); c.fillStyle='rgba(255,255,255,.1)'; c.fill();
  G.rrect(VW-140,12,48*Math.max(.05,Math.min(1,sp)),6,3); c.fillStyle=sp>.8?'#ff6a50':(this.gasOn?'#80ffa0':'#ffb050'); c.fill();
  // progress
  const p=Math.min(1,this.dist/R.len), px0=46, pw=VW-46-8;
  G.rrect(px0,36,pw,4,2); c.fillStyle='rgba(255,255,255,.12)'; c.fill();
  G.rrect(px0,36,pw*p,4,2); c.fillStyle='#f07818'; c.fill();
  for(const s of this.stops){ c.fillStyle=s.done?'#80ffa0':'#ffd060'; c.beginPath(); c.arc(px0+pw*s.d/R.len,38,2.6,0,7); c.fill(); }
  c.drawImage(G.img.crest_sm,px0+pw*p-6,31,12,13);
  // poker hand
  if(R.stops&&this.hand.length){
   G.rrect(4,HUD_H+4,8+this.hand.length*18,30,8); c.fillStyle='rgba(11,10,16,.75)'; c.fill();
   this.hand.forEach((cd,i)=>drawCard(c,8+i*18,HUD_H+7,16,23,cd,true));
  }
 },
 drawControls(c){
  const g=this.g(), C=this.ctrl();
  c.fillStyle='rgba(11,10,16,.97)'; c.fillRect(0,g.ctrlY,VW,CTRL_H);
  c.fillStyle='rgba(240,120,24,.5)'; c.fillRect(0,g.ctrlY,VW,1);
  const btn=(r,label,sub,on,col,glow)=>{
   const y=r.y+(on?1:0);
   if(on&&glow){ c.save(); if(!G.rm()){ c.shadowColor=glow; c.shadowBlur=14; } G.rrect(r.x,y,r.w,r.h,14); c.fillStyle=col; c.fill(); c.restore(); }
   else { G.rrect(r.x,y,r.w,r.h,14); c.fillStyle=on?col:'#22202c'; c.fill(); }
   c.strokeStyle=on?'rgba(255,255,255,.5)':'rgba(255,255,255,.12)'; c.lineWidth=1.2; G.rrect(r.x,y,r.w,r.h,14); c.stroke();
   const tc=on?'#16100a':'#f0e8dc';
   G.txt(label,r.x+r.w/2,y+r.h/2-(sub?15:9),sub?11:15,tc,'center',r.w-6,800);
   if(sub) G.txt(sub,r.x+r.w/2,y+r.h/2+6,5.6,on?'#2a1a08':'#9a8f80','center',r.w-6,700);
  };
  const live=this.mode==='ride';
  btn(C.left,'◀','LANE',live&&(this.lBtn>0||G.held(C.left.x,C.left.y,C.left.w,C.left.h)),'#ffa648','#ff8c2a');
  btn(C.right,'▶','LANE',live&&(this.rBtn>0||G.held(C.right.x,C.right.y,C.right.w,C.right.h)),'#ffa648','#ff8c2a');
  btn(C.brake,'BRAKE','SLOW DOWN',live&&!!this.brkOn,'#ff8a7a','#ff5a4a');
  btn(C.gas,'GAS','SPEED UP',live&&!!this.gasOn,'#8affaa','#3ae070');
 },
 drawCount(c){
  const g=this.g(), C=this.ctrl(), R=this.R;
  c.fillStyle='rgba(0,0,0,.45)'; c.fillRect(0,g.top,VW,g.ctrlY-g.top);
  G.txtO(this.count>0?String(this.count):'GO!',VW/2,g.top+40,30,'#ffd060','center');
  G.wrap(R.tips,7.5,VW-40).forEach((l,i)=>G.txt(l,VW/2,g.top+100+i*13,7.5,'#f4ede2','center',undefined,700));
  const y=g.ctrlY-44;
  G.txtO('CHANGE LANE',(C.left.x+C.right.x+C.right.w)/2,y,7,'#ffb060','center');
  G.txtO('↓',(C.left.x+C.right.x+C.right.w)/2,y+14,10,'#ffb060','center');
  G.txtO('SLOW / SPEED',(C.brake.x+C.gas.x+C.gas.w)/2,y,7,'#a8ffc0','center');
  G.txtO('↓',(C.brake.x+C.gas.x+C.gas.w)/2,y+14,10,'#a8ffc0','center');
 },
 drawAssist(c){
  G.dim(.6);
  const P=this.panelRect(250);
  G.panel(P.x,P.y,P.w,P.h,{border:'#ffd060'});
  bikeTop(c,VW/2,P.y+52,{type:'bike',seat:1,body:'#5a5a6a',gender:'m',hair:'#333'},1.1,{rot:.6});
  G.txt('A RIDER FROM ANOTHER CREW',VW/2,P.y+90,8,'#f4ede2','center',P.w-20,800);
  G.txt('IS STOPPED ON THE SHOULDER.',VW/2,P.y+106,8,'#f4ede2','center',P.w-20,800);
  G.txt('NO COLORS YOU KNOW. DOESN’T MATTER.',VW/2,P.y+130,7,'#cfc4b0','center',P.w-20);
  G.txt('NOBODY RIDES ALONE.',VW/2,P.y+148,7,'#ffd060','center',P.w-20,700);
  G.drawBtns(this.assistBtns(),this.mst);
 },
 drawStop(c){
  G.dim(.6);
  const i=this.stopIdx, st=this.stops[i];
  if(st.kind==='vista'){
   const P=this.panelRect(280);
   G.panel(P.x,P.y,P.w,P.h,{border:'#80d8f0'});
   G.txt('SCENIC OVERLOOK '+(i+1)+'/'+this.stops.length,VW/2,P.y+14,8.5,'#80d8f0','center',P.w-20,800);
   G.txt(this.R.landmarks[Math.min(i+1,this.R.landmarks.length-1)],VW/2,P.y+34,8,'#ffd060','center',P.w-20,800);
   const px=P.x+28, py=P.y+56, pw=P.w-56, ph=110;
   c.save(); G.rrect(px,py,pw,ph,8); c.clip();
   const sg=c.createLinearGradient(0,py,0,py+ph); sg.addColorStop(0,this.R.sky[0]); sg.addColorStop(1,this.R.sky[1]);
   c.fillStyle=sg; c.fillRect(px,py,pw,ph);
   c.fillStyle='rgba(60,90,130,.6)'; c.beginPath(); c.moveTo(px,py+ph*.75); c.quadraticCurveTo(px+pw*.3,py+ph*.25,px+pw*.6,py+ph*.7); c.quadraticCurveTo(px+pw*.8,py+ph*.4,px+pw,py+ph*.6); c.lineTo(px+pw,py+ph); c.lineTo(px,py+ph); c.fill();
   c.fillStyle='#2e5a40'; c.beginPath(); c.moveTo(px,py+ph); c.quadraticCurveTo(px+pw/2,py+ph*.55,px+pw,py+ph); c.fill();
   c.fillStyle='#ffd060'; c.beginPath(); c.arc(px+pw-26,py+22,9,0,7); c.fill();
   c.restore();
   G.rrect(px,py,pw,ph,8); c.strokeStyle='rgba(255,255,255,.6)'; c.lineWidth=2; c.stroke();
   G.txt('+75 PTS • PICTURE TAKEN',VW/2,py+ph+10,7.5,'#80ffa0','center',P.w-20,800);
   G.drawBtns(this.stopBtns(),this.mst);
   return;
  }
  const P=this.panelRect(330);
  G.panel(P.x,P.y,P.w,P.h,{border:'#ffd060'});
  G.txt('POKER RUN • STOP '+(i+1)+' OF '+this.stops.length,VW/2,P.y+14,8.5,'#ffd060','center',P.w-20,800);
  G.txt('HOSTED BY A VISITING CLUB',VW/2,P.y+32,7,'#cfc4b0','center',P.w-20);
  G.txt('(NO NAMES ON A POKER RUN)',VW/2,P.y+46,6,'#8a8a98','center',P.w-20);
  G.flipImg('rider_couple',P.x+18,P.y+70,96,76);
  G.txt('YOUR HOSTS',P.x+66,P.y+150,6,'#9a9aa8','center');
  const cx=P.x+P.w-70, cy=P.y+66, cw=58, ch=84;
  drawCard(c,cx-cw/2,cy,cw,ch,this.stopCard,!!this.stopCard);
  if(this.stopCard) G.txt('+50 PTS',cx,cy+ch+8,8,'#ffd060','center',undefined,800);
  else G.txt('FACE DOWN',cx,cy+ch+8,6.5,'#9a8f80','center');
  if(this.hand.length){
   const hw=this.hand.length*24;
   G.txt('YOUR HAND',VW/2,P.y+182,6,'#9a8f80','center');
   this.hand.forEach((cd,k)=>drawCard(c,VW/2-hw/2+k*24+1,P.y+196,22,32,cd,true));
  }
  G.txt('POINTS ONLY • NO WAGERING',VW/2,P.y+P.h-74,6,'#8a8a98','center');
  G.drawBtns(this.stopBtns(),this.mst);
 },
 drawBD(c){
  const B=this.bdState, D=DATA.BIKERDOWN, VH=G.VH;
  c.fillStyle='#120a0e'; c.fillRect(0,0,VW,VH);
  const bh=Math.round(Math.min(260,VH*.42));
  G.cover(G.img.bg_bikerdown,0,0,VW,bh,.5,.42);
  const fg=c.createLinearGradient(0,bh*.55,0,bh); fg.addColorStop(0,'rgba(18,10,14,0)'); fg.addColorStop(1,'rgba(18,10,14,1)');
  c.fillStyle=fg; c.fillRect(0,0,VW,bh);
  G.txtO('BIKER DOWN',VW/2,bh-34,15,'#ff5a48','center');
  const btns=this.bdBtns(), btnTop=btns[0].y;
  let text='', sub='', col='#f4ede2';
  if(B.ph==='intro'){ text=D.intro[B.i]; sub=(B.i+1)+' / '+D.intro.length; }
  else if(B.ph==='prompt'){ text=D.prompt; col='#ffd060'; }
  else if(B.ph==='quiz'){ text=B.showR||D.steps[B.step].q; sub='STEP '+(B.step+1)+' OF '+D.steps.length; if(B.showR) col=B.lastOk?'#a8ffc0':'#ffb0a0'; }
  else { text=D.outro[B.i]; sub=(B.i+1)+' / '+D.outro.length; }
  const lines=G.wrap(text,9,VW-52);
  const ph=lines.length*16+(sub?30:18)+16, py=Math.max(bh+4,btnTop-ph-16);
  G.panel(14,py,VW-28,ph,{border:'#ff5a48'});
  if(sub) G.txt(sub,VW/2,py+10,6.5,'#ffb0a0','center',undefined,700);
  lines.forEach((l,i)=>G.txt(l,VW/2,py+(sub?28:16)+i*16,9,col,'center',VW-44,700));
  if(B.ph==='quiz'&&B.showR) G.txt(B.lastOk?'✓ RIGHT CALL':'✗ NOT QUITE',VW/2,py-18,8,B.lastOk?'#80ffa0':'#ff8a70','center',undefined,800);
  btns.forEach((b,k)=>{
   if(b.text!=null){
    const press=G.held(b.x,b.y,b.w,b.h), y=b.y+(press?1:0), foc=this.mst.f===k&&G.kbMode;
    G.rrect(b.x,y,b.w,b.h,12); c.fillStyle=press?'rgba(90,60,40,.95)':'rgba(30,26,36,.96)'; c.fill();
    c.strokeStyle=foc?'#ffd060':'rgba(255,170,90,.55)'; c.lineWidth=foc?2:1.2; c.stroke();
    const L=G.wrap(b.text,7.6,b.w-24).slice(0,2);
    L.forEach((l,i)=>G.txt(l,b.x+b.w/2,y+b.h/2-(L.length*11)/2+i*11+.5,7.6,'#f4ede2','center',b.w-16,700));
   } else G.button(b,this.mst.f===k);
  });
 },
 drawResults(c){
  const VH=G.VH, R=this.R;
  G.dim(.75);
  const P={x:10,y:50,w:VW-20,h:VH-50-8};
  G.panel(P.x,P.y,P.w,P.h,{border:this.wiped?'#ff7a50':'#80ffa0'});
  const hdr=R.id==='memorial'&&!this.wiped?'LAST ALARM • NEVER FORGET':(this.wiped?'THE CREW CIRCLED BACK':'RIDE COMPLETE!');
  G.txtO(hdr,VW/2,P.y+12,11,this.wiped?'#ff8a60':(R.id==='memorial'?'#ffd060':'#80ffa0'),'center',P.w-16);
  G.txt(this.wiped?'BROTHERS ALWAYS PICK UP BROTHERS':R.name,VW/2,P.y+34,6.6,'#cfc4b0','center',P.w-20,700);
  let y=P.y+56;
  for(const r of this.resRows){
   G.txt(r[0],P.x+16,y,7.3,'#e0d6c4','left',170,700);
   G.txt('+'+Math.max(0,Math.round(r[1])).toLocaleString(),P.x+P.w-16,y,7.3,'#ffd060','right',undefined,800);
   y+=17;
  }
  if(R.stops){ const cw=36, hw=5*(cw+6)-6; this.hand.slice(0,5).forEach((cd,k)=>drawCard(c,VW/2-hw/2+k*(cw+6),y+2,cw,50,cd,true)); y+=58; }
  c.fillStyle='rgba(240,120,24,.7)'; c.fillRect(P.x+16,y+2,P.w-32,1.5); y+=10;
  G.txt('TOTAL',P.x+16,y,9,'#f4ede2','left',undefined,800);
  G.txt('+'+this.resTotal.toLocaleString()+' PTS',P.x+P.w-16,y,9,'#80ffa0','right',undefined,800);
  y+=22;
  G.txt((this.newBest?'NEW ROUTE BEST! • ':'')+'LIFETIME '+G.save.points.toLocaleString(),VW/2,y,7,'#ffd060','center',P.w-20,700);
  G.drawBtns(this.resBtns(),this.mst);
 }
};
})();
