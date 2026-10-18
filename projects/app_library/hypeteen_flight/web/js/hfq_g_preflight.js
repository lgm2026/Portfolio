/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* PREFLIGHT RACE (the Parking Stand): walk around your airplane before flight. Tap each glowing check, look at the
   close-up, and decide: GOOD TO GO, or SQUAWK IT (report a problem). Some checks hide a real problem.
   What pilots look for (FAA Airplane Flying Handbook ch. 2; AOPA fuel-sampling guidance):
   control lock removed; propeller free of nicks; oil in the safe range; air intake clear (birds love to nest there);
   tires properly inflated; fuel sample BLUE (100LL) with no water (water is heavier and sinks to the bottom) and
   not clear/straw-colored (that could be jet fuel); fuel caps on tight; pitot tube cover off; static port clear;
   ailerons, elevator and rudder moving freely; tie-down ropes untied. */
(function(){
const H=G.HFQ, C=G.C, VW=G.VW, PI=Math.PI, MG=G.MG;
/* close-up drawings, in a 120 x 80 box */
const DRAW={
 lock(c,b){ c.fillStyle='#2a2d33'; G.rrect(20,46,80,26,6); c.fill(); c.strokeStyle='#1a1c20'; c.lineWidth=6; c.beginPath(); c.moveTo(36,28); c.lineTo(84,28); c.stroke(); c.lineWidth=4; c.beginPath(); c.moveTo(60,28); c.lineTo(60,46); c.stroke();
  if(b){ c.fillStyle='#c8102e'; c.fillRect(57,12,6,40); c.fillRect(63,12,22,10); G.txt('LOCK',74,13.5,4.4,'#fff','center',undefined,800); } },
 prop(c,b){ c.fillStyle='#2a2d33'; c.beginPath(); c.moveTo(60,40); c.quadraticCurveTo(64,20,60,4); c.quadraticCurveTo(54,20,56,40); c.closePath(); c.fill(); c.beginPath(); c.moveTo(60,40); c.quadraticCurveTo(64,60,62,76); c.quadraticCurveTo(54,60,56,40); c.fill(); c.fillStyle='#c23a3a'; c.beginPath(); c.arc(58,40,7,0,7); c.fill();
  c.fillStyle='#f6c21c'; c.fillRect(55,4,6,3); c.fillRect(56,73,6,3); if(b){ c.fillStyle='#10151b'; c.beginPath(); c.moveTo(62,16); c.lineTo(58,19); c.lineTo(62,21); c.closePath(); c.fill(); c.strokeStyle='#ff4a3d'; c.lineWidth=1.4; c.beginPath(); c.arc(61,18,7,0,7); c.stroke(); } },
 oil(c,b){ c.fillStyle='#c9ced6'; c.fillRect(56,6,8,70); c.fillStyle='#ffc21a'; c.beginPath(); c.arc(60,6,7,0,7); c.fill(); for(let i=0;i<5;i++){ c.fillStyle='#3a3f48'; c.fillRect(64,24+i*10,6,1.4); G.txt(String(8-i),74,21.5+i*10,4.4,'#cfd6de','left',undefined,800); }
  const lvl=b?66:30; c.fillStyle='#8a5a1a'; c.fillRect(56,lvl,8,76-lvl); G.txt(b?'TOO LOW':'',34,60,5,'#ff8a7a','center',undefined,800); },
 intake(c,b){ c.fillStyle='#e9edf2'; G.rrect(14,14,92,52,18); c.fill(); c.fillStyle='#10151b'; G.rrect(30,30,26,22,6); c.fill(); G.rrect(64,30,26,22,6); c.fill();
  if(b){ c.fillStyle='#8a6a3a'; c.beginPath(); c.ellipse(43,46,12,7,0,0,7); c.fill(); c.strokeStyle='#5a3f22'; c.lineWidth=.8; for(let i=0;i<8;i++){ c.beginPath(); c.moveTo(33+i*2.6,42); c.lineTo(35+i*2.4,50); c.stroke(); } c.fillStyle='#f4f4f2'; c.beginPath(); c.ellipse(42,43,2.4,1.8,0,0,7); c.ellipse(47,44,2.4,1.8,0,0,7); c.fill(); } },
 tire(c,b){ c.fillStyle='#1a1c20'; if(b){ c.beginPath(); c.ellipse(60,48,30,22,0,0,7); c.fill(); c.fillStyle='#55585e'; c.fillRect(20,68,80,4); } else { c.beginPath(); c.arc(60,40,28,0,7); c.fill(); c.fillStyle='#55585e'; c.fillRect(20,68,80,4); }
  c.fillStyle='#c9ced6'; c.beginPath(); c.arc(60,b?48:40,10,0,7); c.fill(); },
 fuel(c,b,kind){ c.fillStyle='rgba(220,235,255,.25)'; c.beginPath(); c.moveTo(36,10); c.lineTo(84,10); c.lineTo(80,70); c.lineTo(40,70); c.closePath(); c.fill(); c.strokeStyle='#cfd6de'; c.lineWidth=1.4; c.stroke();
  const col=b&&kind==='jet'?'rgba(240,220,150,.65)':'rgba(70,130,235,.75)'; c.fillStyle=col; c.beginPath(); c.moveTo(37.6,30); c.lineTo(82.4,30); c.lineTo(80,70); c.lineTo(40,70); c.closePath(); c.fill();
  if(b&&kind!=='jet'){ c.fillStyle='rgba(210,230,255,.95)'; c.beginPath(); c.ellipse(55,64,8,4.5,0,0,7); c.ellipse(68,65,6,3.8,0,0,7); c.fill(); G.txt('WATER?',60,73.5,4.6,'#cfe6ff','center',undefined,800); }
  if(b&&kind==='jet') G.txt('CLEAR + SMELLS LIKE KEROSENE',60,73.5,4.2,'#f0dc96','center',100,800); },
 cap(c,b){ c.fillStyle='#e9edf2'; c.fillRect(0,40,120,40); c.fillStyle='#8d96a2'; c.beginPath(); c.arc(60,50,14,0,7); c.fill();
  if(b){ c.fillStyle='#10151b'; c.beginPath(); c.arc(60,50,9,0,7); c.fill(); c.fillStyle='#8d96a2'; c.save(); c.translate(88,30); c.rotate(.5); c.fillRect(-12,-4,24,8); c.restore(); } else { c.fillStyle='#5d6672'; c.fillRect(50,47,20,6); } },
 pitot(c,b){ c.fillStyle='#e9edf2'; c.fillRect(0,0,120,24); c.fillStyle='#8d96a2'; c.fillRect(56,24,6,18); c.fillRect(30,40,40,7); c.fillStyle='#2a2d33'; c.beginPath(); c.arc(30,43.5,2,0,7); c.fill();
  if(b){ c.fillStyle='#ff4a1a'; c.fillRect(24,37,24,13); const w=Math.sin(G.time*6)*2; c.beginPath(); c.moveTo(26,50); c.lineTo(22+w,76); c.lineTo(30+w,76); c.lineTo(32,50); c.fill(); G.txt('REMOVE',26+w,64,3.2,'#fff','center',undefined,800); } },
 static(c,b){ c.fillStyle='#e9edf2'; c.fillRect(0,0,120,80); c.fillStyle='#c9ced6'; c.beginPath(); c.arc(60,40,12,0,7); c.fill(); c.fillStyle='#3a3f48'; c.beginPath(); c.arc(60,40,3,0,7); c.fill();
  if(b){ c.fillStyle='#4a3020'; c.beginPath(); c.ellipse(60,40,5,3.4,0,0,7); c.fill(); c.strokeStyle='#4a3020'; c.lineWidth=.7; for(const s of [-1,1]) for(let i=0;i<3;i++){ c.beginPath(); c.moveTo(60+s*3,38+i*2); c.lineTo(60+s*8,36+i*3); c.stroke(); } } },
 hinge(c,b){ c.fillStyle='#e9edf2'; c.fillRect(0,10,120,34); c.fillStyle='#d8dde4'; c.fillRect(0,46,120,24); c.fillStyle='#8d96a2'; c.fillRect(0,44,120,2);
  for(const x of [24,60,96]){ if(b&&x===60){ c.strokeStyle='#ff4a3d'; c.lineWidth=1.2; c.beginPath(); c.arc(x,45,7,0,7); c.stroke(); continue; } c.fillStyle='#5d6672'; c.beginPath(); c.arc(x,45,3,0,7); c.fill(); }
  if(b){ c.save(); c.translate(0,3); c.rotate(.04); c.fillStyle='rgba(216,221,228,.0)'; c.restore(); G.txt('BOLT MISSING?',60,72,4.6,'#ff8a7a','center',undefined,800); } },
 tie(c,b){ c.fillStyle='#7c8087'; c.fillRect(0,56,120,24); c.fillStyle='#e9edf2'; c.fillRect(0,6,120,18); c.fillStyle='#8d96a2'; c.fillRect(56,22,8,8); c.strokeStyle='#cfd6de'; c.lineWidth=1.4; c.beginPath(); c.arc(60,66,4,0,7); c.stroke();
  if(b){ c.strokeStyle='#e8cf8a'; c.lineWidth=2.2; c.beginPath(); c.moveTo(60,30); c.quadraticCurveTo(66,48,60,62); c.stroke(); } else { c.strokeStyle='#e8cf8a'; c.lineWidth=2.2; c.beginPath(); c.moveTo(64,66); c.quadraticCurveTo(84,70,100,64); c.stroke(); } },
 tail(c,b){ c.fillStyle='#e9edf2'; c.beginPath(); c.moveTo(20,70); c.lineTo(46,14); c.lineTo(66,14); c.lineTo(80,70); c.closePath(); c.fill(); c.fillStyle='#d8dde4'; c.beginPath(); c.moveTo(80,70); c.lineTo(66,14); c.lineTo(76,14); c.lineTo(96,70); c.closePath(); c.fill();
  if(b){ c.fillStyle='rgba(60,70,90,.35)'; c.beginPath(); c.ellipse(52,46,9,6,.3,0,7); c.fill(); c.strokeStyle='#ff4a3d'; c.lineWidth=1.2; c.beginPath(); c.arc(52,46,12,0,7); c.stroke(); G.txt('DENT',52,62,4.6,'#ff8a7a','center',undefined,800); } }
};
/* the checks: where on the airplane (planeTop figure units: nose up at the top), what's good, what's wrong */
const CHECKS=[
 {id:'lock',n:'COCKPIT: CONTROL LOCK',x:120,y:27,art:'lock',good:'The control lock is out. The controls move freely.',bad:'The control lock is still in! You can’t steer the airplane with it in.'},
 {id:'prop',n:'PROPELLER',x:120,y:4,art:'prop',good:'Smooth blades, no nicks.',bad:'A nick in the blade can grow into a crack. A mechanic must check it.'},
 {id:'oil',n:'ENGINE OIL',x:140,y:14,art:'oil',good:'Oil is in the safe range.',bad:'The oil is too low. Add oil before flight.'},
 {id:'intake',n:'AIR INTAKE',x:100,y:14,art:'intake',good:'The air intake is clear.',bad:'A bird’s nest in the air intake! Birds love warm engines. Clear it out first.'},
 {id:'tiren',n:'NOSE TIRE',x:144,y:32,art:'tire',good:'Properly inflated.',bad:'The tire is low. It needs air before flight.'},
 {id:'tirel',n:'LEFT MAIN TIRE',x:98,y:64,art:'tire',good:'Properly inflated.',bad:'The tire is low. It needs air before flight.'},
 {id:'fuell',n:'FUEL SAMPLE (LEFT TANK)',x:80,y:54,art:'fuel',good:'Blue 100LL avgas, clean, no water.',bad:'Water at the bottom of the cup! Water is heavier than fuel and sinks. Keep sampling until it’s gone.'},
 {id:'fuelr',n:'FUEL SAMPLE (RIGHT TANK)',x:164,y:50,art:'fuel',kind:'jet',good:'Blue 100LL avgas, clean, no water.',bad:'Clear and smells like kerosene: that could be JET FUEL. Wrong fuel can stop the engine. Don’t fly!'},
 {id:'capl',n:'FUEL CAP (LEFT)',x:72,y:34,art:'cap',good:'On tight.',bad:'The fuel cap is off! Fuel can be sucked out in flight.'},
 {id:'pitot',n:'PITOT TUBE',x:52,y:52,art:'pitot',good:'Cover off, tube clear.',bad:'The pitot cover is still on! The airspeed indicator won’t work.'},
 {id:'static',n:'STATIC PORT',x:110,y:84,art:'static',good:'The little hole is clear.',bad:'A bug is blocking the static port. The altimeter and airspeed could read wrong.'},
 {id:'aill',n:'LEFT AILERON',x:40,y:46,art:'hinge',good:'Moves freely, hinges secure.',bad:'A hinge bolt looks missing. Ask a mechanic before flying.'},
 {id:'tiel',n:'LEFT WING TIE-DOWN',x:26,y:56,art:'tie',good:'Untied.',bad:'Still tied down! Untie every rope before you taxi.'},
 {id:'tier',n:'RIGHT WING TIE-DOWN',x:214,y:56,art:'tie',good:'Untied.',bad:'Still tied down! Untie every rope before you taxi.'},
 {id:'tail',n:'ELEVATOR + RUDDER',x:120,y:100,art:'tail',good:'Both move freely. No damage.',bad:'There’s a dent in the tail. Get a mechanic to look at it.'}
];
G.scenes.g_preflight={
 enter(a){ MG.start(this,'preflight',a); const pick=G.shuffle(CHECKS.slice()).slice(0,10), bad=G.shuffle(pick.slice()).slice(0,4).map(q=>q.id);
  this.list=pick.map(q=>Object.assign({},q,{prob:bad.includes(q.id),done:null})); this.open=null; this.clock=0; this.score=0; this.found=0; this.missed=0; this.falseAlarm=0; this.fb=null; if(AUDIO.curName!=='ramp') AUDIO.play('ramp'); },
 box(){ const VH=G.VH, w=VW-16, h=w/2; return {x:8,y:Math.max(86,(VH-h)/2-40),w,h}; },
 spot(q){ const B=this.box(), s=B.w/240; return [B.x+q.x*s,B.y+q.y*s]; },
 card(){ const VH=G.VH; return {x:12,y:VH-222,w:VW-24,h:212}; },
 btns(){ const K=this.card(), w=(K.w-30)/2; return [{id:'ok',label:'GOOD TO GO',kind:'success',x:K.x+10,y:K.y+K.h-50,w,h:40,size:7.6},{id:'bad',label:'SQUAWK IT!',kind:'danger',x:K.x+20+w,y:K.y+K.h-50,w,h:40,size:7.6}]; },
 update(dt){
  if(MG.update(this,dt)) return;
  this.clock+=dt;
  if(this.fb){ this.fb.t-=dt; if(this.fb.t<=0||(G.ptr.click&&this.fb.t<2.4)){ G.ptr.click=false; this.fb=null; this.open=null; if(this.list.every(q=>q.done)) this.finish(); } return; }
  if(this.open){ for(const b of this.btns()) if(G.clicked(b.x,b.y,b.w,b.h)) return this.answer(b.id==='bad'); if(G.pressed.b){ this.open=null; } return; }
  if(G.ptr.click){ let best=null, bd=16; for(const q of this.list){ if(q.done) continue; const [x,y]=this.spot(q), d=Math.hypot(G.ptr.x-x,G.ptr.y-y); if(d<bd){ bd=d; best=q; } }
   if(best){ this.open=best; AUDIO.sfx('card'); } }
 },
 answer(squawk){ const q=this.open, right=squawk===q.prob; q.done=right?'ok':'x';
  if(right){ this.score+=100; if(q.prob) this.found++; AUDIO.sfx(q.prob?'bigpoint':'point'); }
  else { this.score=Math.max(0,this.score-50); if(q.prob) this.missed++; else this.falseAlarm++; AUDIO.sfx('thud'); }
  this.fb={t:3.2,ok:right,msg:(right?(q.prob?'GOOD CATCH! ':'CHECKED. '):(q.prob?'MISSED IT: ':'IT WAS FINE: '))+(q.prob?q.bad:q.good)};
 },
 finish(){ const tb=Math.max(0,Math.round((100-this.clock)*3)); this.score+=tb; MG.end(this,this.score,{head:this.missed===0?'SHARP-EYED PILOT':'SAFE TO FLY? NOT YET!',line:'You found '+this.found+' of 4 problems in '+Math.round(this.clock)+' seconds (+'+tb+' time bonus).'+(this.missed?' Every missed problem is a reason a real pilot would stay on the ground.':'')}); },
 draw(c){
  const VH=G.VH, B=this.box(), t=this.t;
  c.fillStyle='#7c8087'; c.fillRect(0,42,VW,VH-42); c.fillStyle='rgba(0,0,0,.08)'; for(let x=0;x<VW;x+=40) c.fillRect(x,42,1,VH); c.strokeStyle='#ffc21a'; c.lineWidth=3; c.beginPath(); c.moveTo(VW/2,42); c.lineTo(VW/2,VH); c.stroke();
  G.FIG.draw(c,'planeTop',B.x,B.y,B.w,B.h);
  for(const q of this.list){ const [x,y]=this.spot(q), pulse=q.done?0:(Math.sin(t*5+q.x)+1)/2;
   c.beginPath(); c.arc(x,y,7+pulse*2,0,7); c.fillStyle=q.done==='ok'?G.rgba(C.good,.85):(q.done==='x'?G.rgba(C.bad,.85):G.rgba(C.accent,.35+pulse*.4)); c.fill(); c.strokeStyle='#fff'; c.lineWidth=1.2; c.stroke();
   G.txt(q.done==='ok'?'✓':(q.done==='x'?'✕':'?'),x,y-3.6,7,q.done?'#fff':'#111','center',undefined,800); }
  const left=this.list.filter(q=>!q.done).length;
  G.txt(left?left+' CHECKS LEFT • TAP A GLOWING SPOT':'ALL CHECKED',VW/2,52,6.4,C.ink,'center',VW-20,800);
  G.txt('TIME '+Math.floor(this.clock)+'s',VW-12,66,6,C.accentHi,'right',undefined,800);
  if(this.open){ const K=this.card(), q=this.open; G.dim(.45); G.panel(K.x,K.y,K.w,K.h,{r:14,border:G.rgba(C.accent,.6)});
   G.txt(q.n,K.x+K.w/2,K.y+10,8,C.title,'center',K.w-20,800);
   c.save(); c.translate(K.x+K.w/2-60*1.05,K.y+28); c.scale(1.05,1.05); G.rrect(0,0,120,80,8); c.fillStyle='#2a3240'; c.fill(); c.save(); G.rrect(0,0,120,80,8); c.clip(); (DRAW[q.art]||DRAW.tie)(c,q.prob,q.kind); c.restore(); c.restore();
   if(!this.fb){ G.txt('GOOD TO GO, OR IS SOMETHING WRONG?',K.x+K.w/2,K.y+120,6,C.sub,'center',K.w-20,800); G.drawBtns(this.btns()); }
   else { G.rrect(K.x+10,K.y+116,K.w-20,K.h-124,10); c.fillStyle=this.fb.ok?'rgba(18,61,38,.96)':'rgba(70,16,16,.96)'; c.fill(); c.strokeStyle=this.fb.ok?C.good:C.bad; c.lineWidth=1.2; c.stroke(); G.para(this.fb.msg,K.x+K.w/2,K.y+124,6.4,'#fff','center',K.w-36,9,800); } }
  MG.hud(this,c,this.score+' PTS',{sub:'WALK AROUND YOUR AIRPLANE',tip:'Tap each glowing spot. Is it good to go, or should you squawk it? Find all the problems, fast!'});
 }
};
})();
