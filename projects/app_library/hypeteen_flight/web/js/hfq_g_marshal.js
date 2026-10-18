/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* MARSHALLER SIGNALS (the Parking Stand): the marshaller guides your airplane into its parking spot with lighted wands.
   Read each signal and tap the matching response. Signals follow the FAA AIM (4-3-26) / ICAO marshalling signals,
   always from the PILOT's point of view (the marshaller faces you, so their right arm is on your left):
     STRAIGHT AHEAD  both arms bent, wands moving up and down from chest to head
     TURN LEFT       marshaller's right arm (your left) straight out; the other arm waves "come ahead"
     TURN RIGHT      marshaller's left arm (your right) straight out; the other arm waves "come ahead"
     SLOW DOWN       arms down, wands patting down and up between waist and knees
     STOP            arms out to the sides, raised until the wands cross above the head
     CUT ENGINES     a wand drawn across the throat */
(function(){
const H=G.HFQ, C=G.C, VW=G.VW, PI=Math.PI, MG=G.MG;
const SIG={
 ahead:{n:'STRAIGHT AHEAD',d:'Both arms bent, wands bobbing up and down from chest to head.'},
 left:{n:'TURN LEFT',d:'Their right arm (on YOUR left) points out. The other arm waves you ahead.'},
 right:{n:'TURN RIGHT',d:'Their left arm (on YOUR right) points out. The other arm waves you ahead.'},
 slow:{n:'SLOW DOWN',d:'Arms down low, wands patting down toward the knees.'},
 stop:{n:'STOP',d:'Arms swing up from the sides until the wands cross above the head.'},
 cut:{n:'CUT ENGINES',d:'A wand drawn across the throat: shut it down.'}
};
const ORDER=['ahead','left','right','slow','stop','cut'];
/* the marshaller, front view. pose returns arm angles (radians from straight down, + toward the figure's own left = screen right) */
function pose(sig,t){
 const w=Math.sin(t*6), up=(w+1)/2;
 // [upperL, foreL, upperR, foreR] for the figure's LEFT arm (screen right) and RIGHT arm (screen left); angle 0 = down, PI/2 = out sideways, PI = straight up
 switch(sig){
  case 'ahead': return {L:[.55,PI*.85+up*.6],R:[.55,PI*.85+up*.6]};
  case 'left':  return {R:[PI/2,PI/2],L:[.55,PI*.85+up*.6]};           // figure's right arm (screen left) straight out
  case 'right': return {L:[PI/2,PI/2],R:[.55,PI*.85+up*.6]};
  case 'slow':  return {L:[.3+up*.25,.35+up*.35],R:[.3+up*.25,.35+up*.35]};
  case 'stop': { const k=(Math.sin(t*2.2)+1)/2; const a=PI/2+k*(PI*.42); return {L:[a,a+k*.5],R:[a,a+k*.5]}; }
  case 'cut': { const k=(Math.sin(t*4)+1)/2; return {R:[PI*.62,PI*.62+1.9-k*.2,'cut',k],L:[.25,.3]}; }
 }
 return {L:[.2,.2],R:[.2,.2]};
}
function drawMarshaller(c,cx,cy,s,sig,t,lit){
 c.save(); c.translate(cx,cy); c.scale(s,s);
 const P=pose(sig,t), skin='#e8c098';
 // legs + body + vest
 c.fillStyle='#2a3a5a'; c.fillRect(-9,18,7,30); c.fillRect(2,18,7,30); c.fillStyle='#1a1a1a'; c.fillRect(-10,46,9,4); c.fillRect(1,46,9,4);
 c.fillStyle='#2a3a5a'; G.rrect(-12,-14,24,34,5); c.fill();
 c.fillStyle='#d8f23a'; G.rrect(-11,-12,22,30,4); c.fill(); c.fillStyle='#e9edf2'; c.fillRect(-11,2,22,3); c.fillRect(-11,10,22,3);
 // head + ear defenders
 c.fillStyle=skin; c.beginPath(); c.arc(0,-22,8,0,PI*2); c.fill(); c.fillStyle='#2a2d33'; c.beginPath(); c.arc(0,-24,8.6,PI,0); c.lineWidth=2.4; c.strokeStyle='#2a2d33'; c.stroke(); c.fillStyle='#ff6a1a'; c.fillRect(-11,-25,4,7); c.fillRect(7,-25,4,7);
 c.fillStyle='#1a1a1a'; c.fillRect(-3,-23,1.6,1.6); c.fillRect(2,-23,1.6,1.6);
 // arms: shoulders at (+-12,-10). screen-right = figure's left arm (L), screen-left = figure's right arm (R)
 const arm=(side,a)=>{ const sx=side*12, sy=-10, u=13, f=12;
  const ax=sx+side*Math.sin(a[0])*u, ay=sy+Math.cos(a[0])*u;
  let hx, hy;
  if(a[2]==='cut'){ hx=-8+a[3]*16; hy=-15; } else { hx=ax+side*Math.sin(a[1])*f; hy=ay+Math.cos(a[1])*f; }
  c.strokeStyle='#2a3a5a'; c.lineWidth=5; c.lineCap='round'; c.beginPath(); c.moveTo(sx,sy); c.lineTo(ax,ay); c.lineTo(hx,hy); c.stroke();
  c.fillStyle=skin; c.beginPath(); c.arc(hx,hy,2.6,0,PI*2); c.fill();
  // the lighted wand continues along the forearm
  const dx=hx-ax, dy=hy-ay, L=Math.hypot(dx,dy)||1, wx=hx+dx/L*13, wy=hy+dy/L*13;
  c.save(); if(lit){ c.shadowColor='#ff8a1a'; c.shadowBlur=8; } c.strokeStyle='#ff7a1a'; c.lineWidth=3.4; c.beginPath(); c.moveTo(hx,hy); c.lineTo(wx,wy); c.stroke(); c.restore(); };
 arm(-1,P.R); arm(1,P.L);
 c.restore();
}

G.scenes.g_marshal={
 enter(a){ MG.start(this,'marshal',a); this.n=0; this.N=10; this.score=0; this.streak=0; this.help=!H.gameRec('marshal'); if(this.help) this.tipT=0; this.seq=this.makeSeq(); this.cur=null; this.next(); this.ac={x:0,y:0,h:0,tx:0,ty:0,th:0}; this.fb=null; },
 makeSeq(){ const s=[]; const pool=['ahead','left','right','ahead','slow','ahead','left','right'];
  for(let i=0;i<this.N-2;i++){ let k; do{ k=pool[Math.floor(Math.random()*pool.length)]; }while(s.length&&k===s[s.length-1]&&k!=='ahead'); s.push(k); }
  s.push('stop'); s.push('cut'); return s; },
 next(){ this.cur=this.seq[this.n]; this.clock=0; this.limit=Math.max(2.6,5-this.n*.18); this.sigT=0; },
 btns(){ const VH=G.VH, y0=VH-104, w=(VW-36)/3, B=[]; ORDER.forEach((k,i)=>B.push({id:k,label:SIG[k].n,x:12+(i%3)*(w+6),y:y0+Math.floor(i/3)*48,w,h:42,size:6.4})); return B; },
 update(dt){
  if(MG.update(this,dt)) return;
  this.sigT+=dt;
  if(this.help){ if(G.ptr.click||G.pressed.a){ G.ptr.click=false; this.help=false; this.tipT=2.5; this.clock=0; AUDIO.sfx('ok'); } return; }
  const hb={x:VW-58,y:48,w:50,h:20}; if(G.clicked(hb.x,hb.y,hb.w,hb.h)){ this.help=true; G.ptr.click=false; return; }
  // the airplane eases toward where the last signal sent it
  const A=this.ac; A.x+=(A.tx-A.x)*Math.min(1,dt*3); A.y+=(A.ty-A.y)*Math.min(1,dt*3); A.h+=(A.th-A.h)*Math.min(1,dt*3);
  if(this.fb){ this.fb.t-=dt; if(this.fb.t<=0){ const ok=this.fb.ok; this.fb=null; if(ok){ this.n++; if(this.n>=this.N) return this.finish(); this.next(); } else this.clock=0; } return; }
  this.clock+=dt;
  if(this.clock>this.limit){ this.fb={ok:false,t:.9,msg:'TOO SLOW: WATCH THE WANDS'}; this.streak=0; AUDIO.sfx('thud'); return; }
  for(const b of this.btns()) if(G.clicked(b.x,b.y,b.w,b.h)) return this.answer(b.id);
 },
 answer(k){
  if(k===this.cur){
   const bonus=Math.max(0,Math.round((1-this.clock/this.limit)*10)); this.streak++; this.score+=10+bonus+(this.streak>=3?5:0);
   this.fb={ok:true,t:.6,msg:SIG[k].n+(bonus>=7?' • QUICK!':'')}; AUDIO.sfx(this.streak>=3?'bigpoint':'point');
   const A=this.ac; if(k==='ahead'){ A.ty-=26; } else if(k==='left'){ A.th-=PI/2; A.tx-=22; A.ty-=8; } else if(k==='right'){ A.th+=PI/2; A.tx+=22; A.ty-=8; } else if(k==='slow'){ A.ty-=10; } else if(k==='stop'){ AUDIO.sfx('gear'); }
   if(k==='left'||k==='right'){ /* come back to facing the marshaller */ setTimeout(()=>{ A.th=0; },500); }
  } else { this.streak=0; this.score=Math.max(0,this.score-5); this.fb={ok:false,t:.9,msg:'SAY AGAIN? THAT WAS '+SIG[this.cur].n}; AUDIO.sfx('thud'); G.shake=2; }
 },
 finish(){ MG.end(this,this.score,{head:this.score>=170?'PARKED LIKE A PRO':'ENGINES OFF, CHOCKS IN',line:'You followed '+this.N+' signals into the parking spot.'}); },
 draw(c){
  const VH=G.VH;
  // ramp background
  MG.floor(c,0,42,VW,VH-42,'ramp');
  c.fillStyle='rgba(255,255,255,.04)'; for(let y=60;y<VH;y+=40) c.fillRect(0,y,VW,1);
  // the marshaller, big, on the parking line
  const my=Math.min(170,VH*.3)+42;
  c.fillStyle='#ffc21a'; c.fillRect(VW/2-50,my+56,100,3); c.fillRect(VW/2-1.5,my+59,3,VH-my-180);
  drawMarshaller(c,VW/2,my,2.2,this.help?'stop':(this.fb&&!this.fb.ok?this.cur:this.cur),this.sigT,true);
  // your airplane (top view) creeping toward the line
  const A=this.ac, ay=VH-150+A.y*.5; c.save(); c.translate(VW/2+A.x*.6,ay); c.rotate(A.h); c.scale(.32,.32); c.translate(-120,-60);
  if(G.FIG&&G.FIG.has('planeTop')) G.FIG.draw(c,'planeTop',0,0,240,120); c.restore();
  // timer bar
  if(!this.help&&!this.fb){ const p=1-this.clock/this.limit; G.rrect(14,VH-114,VW-28,4,2); c.fillStyle='rgba(255,255,255,.12)'; c.fill(); G.rrect(14,VH-114,(VW-28)*Math.max(0,p),4,2); c.fillStyle=p<.3?C.bad:C.accent; c.fill(); }
  // answer buttons
  for(const b of this.btns()){ let kind='secondary'; if(this.fb){ if(b.id===this.cur) kind=this.fb.ok?'success':'success'; } G.button(Object.assign({},b,{kind}),false); }
  if(this.fb) { G.rrect(20,my+64,VW-40,22,10); c.fillStyle='rgba(11,11,12,.8)'; c.fill(); G.txt(this.fb.msg,VW/2,my+70,6.6,this.fb.ok?C.good:C.warn,'center',VW-50,800); }
  // help card
  const hb={x:VW-58,y:48,w:50,h:20}; G.rrect(hb.x,hb.y,hb.w,hb.h,8); c.fillStyle='rgba(11,11,12,.7)'; c.fill(); c.strokeStyle=G.rgba(C.accent,.6); c.lineWidth=1; c.stroke(); G.txt('SIGNALS',hb.x+hb.w/2,hb.y+6,5.4,C.accentText,'center',undefined,800);
  G.txt('SIGNAL '+Math.min(this.N,this.n+1)+' OF '+this.N,12,52,6,C.ink,'left',undefined,800);
  if(this.help){ G.dim(.7); const y0=56; G.panel(10,y0,VW-20,VH-y0-14,{r:14,border:G.rgba(C.accent,.6)}); G.txt('MARSHALLER SIGNALS',VW/2,y0+12,9,C.title,'center',undefined,800);
   G.txt('THE MARSHALLER FACES YOU: THEIR RIGHT ARM IS ON YOUR LEFT',VW/2,y0+28,5,C.sub,'center',VW-40,800);
   const rowH=(VH-y0-80)/6; ORDER.forEach((k,i)=>{ const y=y0+40+i*rowH; drawMarshaller(c,36,y+rowH*.48,.62,k,this.t,false); G.txt(SIG[k].n,62,y+rowH*.2,7.2,C.accentHi,'left',VW-80,800); G.para(SIG[k].d,62,y+rowH*.2+12,5.8,C.ink,'left',VW-82,8.4,600); });
   G.txt('TAP TO START',VW/2,VH-30,6.4,C.accentText,'center',undefined,800); }
  MG.hud(this,c,this.score+' PTS',{sub:'FOLLOW THE WANDS',tip:'Watch the wands and tap what they mean. Quick answers earn bonus points.'});
 }
};
})();
