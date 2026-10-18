/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* WASH DAY (the Wash Rack): wash your airplane the way the line crew does (AOPA "Washing an airplane"):
   1 COVER the pitot tube and the static port first (water in them can make the airspeed indicator and the
     altimeter read wrong); 2 BUG REMOVER on the leading edges and the nose; 3 SOAP the dirt, then 4 HOSE it off;
   5 a SOFT CLOTH on the windshield (it's plastic: paper towels scratch it); 6 take the covers OFF before flight.
   Swipe across the airplane with a tool. Using water before the covers are on, paper towels on the windshield,
   or finishing with the covers still on all cost points, with a short explanation. */
(function(){
const H=G.HFQ, C=G.C, VW=G.VW, PI=Math.PI, MG=G.MG;
const TOOLS=[{id:'cover',n:'COVERS',col:'#ff4a1a'},{id:'bug',n:'BUG REMOVER',col:'#3fdc7c'},{id:'soap',n:'SOAP',col:'#5b9bff'},{id:'hose',n:'HOSE',col:'#8fd0ff'},{id:'cloth',n:'SOFT CLOTH',col:'#ffd24d'},{id:'paper',n:'PAPER TOWEL',col:'#e9edf2'}];
G.scenes.g_wash={
 enter(a){ MG.start(this,'wash',a);
  const my=H.myAC?H.myAC():{id:'c172'}, m=H.acById(my.id), plane=m.kind==='plane'&&m.g&&m.g.gear==='tri'&&!m.g.engine;   // tricycle singles share one layout; anything else washes the club Skyhawk
  this.ac=plane?my:{id:'c172',paint:null}; this.high=plane?m.g.wing==='high':true; this.club=!plane;
  const S=[]; const rnd=(a,b)=>a+Math.random()*(b-a);
  for(let i=0;i<9;i++) S.push({k:'dirt',x:rnd(50,190),y:rnd(56,76),r:rnd(6,9),hp:1});
  for(let i=0;i<5;i++) S.push({k:'bug',x:rnd(204,214),y:rnd(52,70),r:3.4,hp:1});
  for(let i=0;i<4;i++) S.push({k:'bug',x:rnd(150,172),y:this.high?rnd(32,36):rnd(76,80),r:3.2,hp:1});
  S.push({k:'smudge',x:174,y:this.high?50:52,r:10,hp:1});
  this.spots=S; this.covers={pitot:false,static:false}; this.tool='cover'; this.pen={water:0,paper:0}; this.drops=[]; this.scratch=0; this.msg=null; this.clock=0; this.score=0; this.coveredFirst=null; this.coverHint=false;
  this.score=0; if(AUDIO.curName!=='ramp') AUDIO.play('ramp'); },
 box(){ const w=VW-8, h=w/2; return {x:4,y:96,w,h,s:w/240}; },
 hot(){ return {pitot:this.high?[150,44]:[160,84],static:[110,64]}; },
 toS(x,y){ const B=this.box(); return [B.x+x*B.s,B.y+y*B.s]; },
 toolBtns(){ const VH=G.VH, w=(VW-24-12)/3; return TOOLS.map((t,i)=>({id:t.id,t,x:12+(i%3)*(w+6),y:VH-118+Math.floor(i/3)*40,w,h:34})); },
 doneBtn(){ return {id:'done',label:'DONE: FINAL CHECK',kind:'primary',x:12,y:G.VH-40,w:VW-24,h:32,size:7.4}; },
 say(t,bad){ this.msg={t,bad,k:3.2}; AUDIO.sfx(bad?'thud':'ok'); },
 update(dt){
  if(MG.update(this,dt)) return;
  this.clock+=dt; if(this.msg){ this.msg.k-=dt; if(this.msg.k<=0) this.msg=null; }
  for(const d of this.drops){ d.x+=d.vx*dt; d.y+=d.vy*dt; d.vy+=220*dt; d.t-=dt; } this.drops=this.drops.filter(d=>d.t>0);
  for(const b of this.toolBtns()) if(G.clicked(b.x,b.y,b.w,b.h)){ this.tool=b.id; AUDIO.sfx('blip'); return; }
  const D=this.doneBtn(); if(G.clicked(D.x,D.y,D.w,D.h)) return this.finish();
  const B=this.box(); const inBox=G.ptr.y>B.y-10&&G.ptr.y<B.y+B.h+10;
  // covers: tap the pitot tube or the static port
  if(this.tool==='cover'&&G.ptr.click&&inBox){ const H2=this.hot(); for(const k of ['pitot','static']){ const [x,y]=this.toS(...H2[k]); if(Math.hypot(G.ptr.x-x,G.ptr.y-y)<16){ this.covers[k]=!this.covers[k]; AUDIO.sfx('cover');
    if(this.covers.pitot&&this.covers.static&&this.coveredFirst==null) this.coveredFirst=!this.pen.water; return; } } this.say('TAP THE PITOT TUBE OR THE STATIC PORT TO COVER THEM.',false); return; }
  if(!G.ptr.down||!inBox||this.tool==='cover') return;
  const px=(G.ptr.x-B.x)/B.s, py=(G.ptr.y-B.y)/B.s, R=9/B.s+2;
  const wet=this.tool==='soap'||this.tool==='hose'||this.tool==='bug';
  if(wet&&!(this.covers.pitot&&this.covers.static)&&!this.pen.water){ const H2=this.hot(); for(const k of ['pitot','static']){ const p=H2[k]; if(!this.covers[k]&&Math.hypot(px-p[0],py-p[1])<26){ this.pen.water=1; this.score-=150; G.shake=2; this.say('WATER IN THE '+(k==='pitot'?'PITOT TUBE':'STATIC PORT')+'! COVER THEM BEFORE YOU WASH.',true); break; } } }
  if(this.tool==='hose'&&Math.random()<.6){ this.drops.push({x:G.ptr.x,y:G.ptr.y,vx:(Math.random()-.5)*60,vy:-30-Math.random()*40,t:.5}); if(Math.random()<.08) AUDIO.sfx('spray'); }
  for(const s of this.spots){ if(s.hp<=0) continue; if(Math.hypot(px-s.x,py-s.y)>s.r+R) continue;
   const use=(k,next)=>{ s.hp-=dt*3.2; if(Math.random()<.06) AUDIO.sfx('scrub'); if(s.hp<=0){ if(next){ s.k=next; s.hp=1; } else { this.score+=20; AUDIO.sfx('drip'); } } };
   if(s.k==='bug'){ if(this.tool==='bug') use('bug'); else if(!this._bh){ this._bh=1; this.say('BUGS NEED BUG REMOVER.',false); } }
   else if(s.k==='dirt'){ if(this.tool==='soap') use('dirt','suds'); else if(this.tool==='hose'&&!this._dh){ this._dh=1; this.say('SOAP IT FIRST, THEN RINSE.',false); } }
   else if(s.k==='suds'){ if(this.tool==='hose') use('suds'); }
   else if(s.k==='smudge'){ if(this.tool==='cloth') use('smudge'); else if(this.tool==='paper'){ if(!this.pen.paper){ this.pen.paper=1; this.score-=100; this.scratch=1; this.say('SCRATCH! WINDSHIELDS ARE PLASTIC. PAPER TOWELS SCRATCH THEM. USE A SOFT CLOTH.',true); } } }
  }
 },
 finish(){
  const left=this.spots.filter(s=>s.hp>0).length, total=this.spots.length; let line=[];
  if(this.covers.pitot||this.covers.static){ this.score-=200; line.push('You left a cover on! Never fly with the pitot or static port covered.'); }
  else if(this.coveredFirst){ this.score+=150; line.push('Covers on first, off at the end: perfect.'); }
  if(this.coveredFirst==null&&!this.covers.pitot) line.push('Next time, cover the pitot tube and the static port before washing.');
  if(!this.pen.paper) this.score+=60;
  const tb=Math.max(0,Math.round((90-this.clock)*2)); if(left===0) this.score+=tb;
  this.score=Math.max(0,this.score);
  MG.end(this,this.score,{head:left===0&&!this.covers.pitot&&!this.covers.static&&!this.pen.water?'SPARKLING!':(left===0?'CLEAN, BUT…':'STILL A LITTLE DIRTY'),line:(total-left)+' of '+total+' spots cleaned'+(left===0?' (+'+tb+' time bonus)':'')+'. '+line.join(' ')});
 },
 draw(c){
  const VH=G.VH, B=this.box(), t=this.t, s=B.s;
  c.fillStyle='#8e949b'; c.fillRect(0,42,VW,VH-42); c.fillStyle='rgba(40,70,110,.15)'; c.beginPath(); c.ellipse(VW/2,B.y+B.h-10,VW*.48,20,0,0,7); c.fill();
  H.drawAC(c,this.ac.id,B.x,B.y,B.w,B.h,this.ac.paint,{ground:true});
  // dirt, bugs, suds, smudges
  for(const sp of this.spots){ if(sp.hp<=0) continue; const [x,y]=this.toS(sp.x,sp.y), r=sp.r*s, a=Math.max(.25,sp.hp);
   if(sp.k==='dirt'){ c.fillStyle='rgba(110,80,45,'+(.55*a)+')'; c.beginPath(); c.ellipse(x,y,r,r*.7,.3,0,7); c.fill(); c.fillStyle='rgba(90,64,36,'+(.5*a)+')'; c.beginPath(); c.arc(x+r*.3,y-r*.2,r*.35,0,7); c.fill(); }
   if(sp.k==='bug'){ c.fillStyle='rgba(30,30,24,'+a+')'; c.beginPath(); c.arc(x,y,r,0,7); c.fill(); c.strokeStyle='rgba(120,140,60,'+a*.8+')'; c.lineWidth=1; for(let i=0;i<4;i++){ const an=i*1.6; c.beginPath(); c.moveTo(x,y); c.lineTo(x+Math.cos(an)*r*1.8,y+Math.sin(an)*r*1.8); c.stroke(); } }
   if(sp.k==='suds'){ c.fillStyle='rgba(255,255,255,'+(.9*a)+')'; for(const [dx,dy,rr] of [[0,0,.5],[.45,-.2,.4],[-.4,-.15,.38],[.1,-.45,.32]]){ c.beginPath(); c.arc(x+dx*r*1.4,y+dy*r*1.4,rr*r,0,7); c.fill(); } }
   if(sp.k==='smudge'){ c.fillStyle='rgba(90,80,70,'+(.4*a)+')'; c.beginPath(); c.ellipse(x,y,r,r*.6,0,0,7); c.fill(); } }
  if(this.scratch){ const [x,y]=this.toS(174,this.high?50:52); c.strokeStyle='rgba(255,255,255,.7)'; c.lineWidth=.7; for(let i=0;i<4;i++){ c.beginPath(); c.moveTo(x-10+i*4,y-5); c.lineTo(x-4+i*4,y+4); c.stroke(); } }
  // covers + their streamers, or a hint ring
  const H2=this.hot(); for(const k of ['pitot','static']){ const [x,y]=this.toS(...H2[k]);
   if(this.covers[k]){ c.fillStyle='#ff4a1a'; G.rrect(x-6,y-4,12,8,2); c.fill(); const w=Math.sin(t*6+x)*2; c.beginPath(); c.moveTo(x-2,y+4); c.lineTo(x-4+w,y+22); c.lineTo(x+2+w,y+22); c.lineTo(x+2,y+4); c.fill(); }
   else if(this.tool==='cover'){ c.beginPath(); c.arc(x,y,9+Math.sin(t*6)*1.5,0,7); c.strokeStyle=C.accentHi; c.lineWidth=1.6; c.stroke(); G.txt(k==='pitot'?'PITOT':'STATIC',x,y-20,5,C.accentHi,'center',undefined,800); } }
  for(const d of this.drops){ c.fillStyle='rgba(140,200,255,.8)'; c.fillRect(d.x,d.y,1.6,3); }
  // the clean meter + messages
  const done=this.spots.filter(q=>q.hp<=0).length, tot=this.spots.length;
  G.txt('CLEAN '+Math.round(done/tot*100)+'%',12,52,6.4,C.ink,'left',undefined,800); G.txt('TIME '+Math.floor(this.clock)+'s',VW-12,52,6.4,C.accentHi,'right',undefined,800);
  G.rrect(12,64,VW-24,5,2.5); c.fillStyle='rgba(255,255,255,.15)'; c.fill(); G.rrect(12,64,(VW-24)*done/tot,5,2.5); c.fillStyle=C.good; c.fill();
  if(this.club) G.txt('TODAY: WASHING THE CLUB SKYHAWK',VW/2,76,5.4,C.sub,'center',undefined,800);
  const ty=B.y+B.h+8; const tl=TOOLS.find(q=>q.id===this.tool);
  G.para(this.msg?this.msg.t:({cover:'Tap the PITOT TUBE and the STATIC PORT to cover them. Tap again to take the covers off.',bug:'Swipe over the bugs on the wings and the nose.',soap:'Swipe soap over the dirt.',hose:'Rinse the suds away.',cloth:'Gently clean the windshield.',paper:'Paper towels… on an airplane?'})[this.tool],VW/2,ty,6.2,this.msg&&this.msg.bad?'#ffb0a8':C.ink,'center',VW-30,8.6,800);
  for(const b of this.toolBtns()){ const on=b.id===this.tool, press=G.held(b.x,b.y,b.w,b.h); G.rrect(b.x,b.y+(press?1:0),b.w,b.h,10); c.fillStyle=on?G.rgba(b.t.col,.3):C.card; c.fill(); c.strokeStyle=on?b.t.col:'rgba(255,255,255,.14)'; c.lineWidth=on?2:1; c.stroke();
   c.beginPath(); c.arc(b.x+12,b.y+b.h/2,5,0,7); c.fillStyle=b.t.col; c.fill(); G.txt(b.t.n,b.x+21,b.y+b.h/2-3.6,5.8,C.ink,'left',b.w-24,800); }
  G.drawBtns([this.doneBtn()]);
  MG.hud(this,c,(this.score>0?this.score:0)+' PTS',{sub:'COVERS FIRST, THEN SUDS',tip:'Pick a tool, then swipe across the airplane. Cover the pitot tube and static port FIRST!'});
 }
};
})();
