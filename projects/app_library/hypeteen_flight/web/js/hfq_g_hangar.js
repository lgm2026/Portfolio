/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* ROUND 5, GAME ROOM GAMES (first built for the Hangar; both live in the Game Room now)
   CONE BOWLING   pull back and roll at ten orange traffic cones. 5 frames, 2 rolls each, strikes and spares.
   HANGAR HOOPS   a hoop on the hangar wall, 45 seconds on the clock, long shots are worth 3. */
(function(){
const H=G.HFQ, C=G.C, VW=G.VW, PI=Math.PI, MG=G.MG;

/* ============================ CONE BOWLING ============================ */
function cone(c,x,y,h,down,ang){ // an orange traffic cone, standing or knocked over
 c.save(); c.translate(x,y); if(down) c.rotate(ang);
 c.fillStyle='rgba(0,0,0,.28)'; c.beginPath(); c.ellipse(1,2,h*.42,h*.16,0,0,PI*2); c.fill();
 c.fillStyle='#2a2d33'; c.beginPath(); c.ellipse(0,0,h*.46,h*.17,0,0,PI*2); c.fill();
 const g=c.createLinearGradient(-h*.3,0,h*.3,0); g.addColorStop(0,'#b84a10'); g.addColorStop(.45,'#ff7a2a'); g.addColorStop(1,'#a6400c'); c.fillStyle=g;
 c.beginPath(); c.moveTo(-h*.3,0); c.lineTo(-h*.08,-h); c.lineTo(h*.08,-h); c.lineTo(h*.3,0); c.closePath(); c.fill();
 c.fillStyle='rgba(255,255,255,.85)'; c.beginPath(); c.moveTo(-h*.2,-h*.42); c.lineTo(-h*.15,-h*.62); c.lineTo(h*.15,-h*.62); c.lineTo(h*.2,-h*.42); c.closePath(); c.fill();
 c.restore(); }
G.scenes.g_bowling={
 enter(a){ MG.start(this,'bowling',a); this.FR=5; this.frame=0; this.roll=0; this.frames=[]; this.score=0; this.sl={}; this.ball=null; this.L=this.lane(); this.rack(); this.msg=null; if(AUDIO.curName!=='hangar') AUDIO.play('hangar'); },
 lane(){ const VH=G.VH; return {x:40,w:VW-80,top:70,bot:VH-64,cx:VW/2}; },
 rack(){ const L=this.L; this.cones=[]; const rows=[[0],[-1,1],[-2,0,2],[-3,-1,1,3]]; rows.forEach((r,i)=>r.forEach(k=>this.cones.push({x:L.cx+k*11,y:L.top+58-i*12,up:true,t:0,ang:0,row:i}))); },
 update(dt){ if(MG.update(this,dt)) return; const L=this.L;
  if(this.msg){ this.msg.t-=dt; if(this.msg.t<=0){ const m=this.msg; this.msg=null; if(this.frame>=this.FR) return this.finish(); if(m.next==='rack') this.rack(); } return; }
  for(const k of this.cones) if(!k.up&&k.t<1) k.t=Math.min(1,k.t+dt*4);
  if(this.ball){ const b=this.ball; b.y-=b.v*dt; b.x+=b.vx*dt; b.vx+=b.curve*dt; b.spin+=dt*12;
   if(b.x<L.x+8){ b.x=L.x+8; b.vx=Math.abs(b.vx)*.4; } if(b.x>L.x+L.w-8){ b.x=L.x+L.w-8; b.vx=-Math.abs(b.vx)*.4; }
   if(b.x<L.x+16||b.x>L.x+L.w-16) b.gutter=true;
   for(const k of this.cones){ if(!k.up) continue; const d=Math.hypot(k.x-b.x,(k.y-b.y)*1.3); if(d<13){ this.knock(k,(k.x-b.x)/13,b.v); b.v*=.94; } }
   if(b.y<L.top-20||b.v<40){ this.ball=null; this.score_roll(); } return; }
  const r=MG.sling(this.sl,L.cx,L.bot-18,110,(x,y)=>y>L.bot-80); this.aim=r.active?r:null;
  if(r.fired){ const v=300+r.power*260, ang=Math.max(-.45,Math.min(.45,Math.atan2(r.fired.dx,-r.fired.dy))); this.ball={x:L.cx,y:L.bot-18,v,vx:Math.sin(ang)*v*.55,curve:(Math.random()-.5)*18,spin:0}; AUDIO.sfx('throw'); } },
 knock(k,side,v){ if(!k.up) return; k.up=false; k.t=0; k.ang=(side>=0?1:-1)*(.9+Math.random()*.9); AUDIO.sfx('clack');
  // a falling cone can tip the ones behind it
  for(const o of this.cones){ if(!o.up||o===k) continue; if(o.y<k.y-2&&o.y>k.y-16&&Math.abs(o.x-k.x)<=14&&Math.random()<.65) this.knock(o,(o.x-k.x)||side,v*.7); } },
 score_roll(){ const down=this.cones.filter(k=>!k.up).length, prev=this.roll===1?this.frames[this.frame].r[0]:0, now=down-prev; const f=this.frames[this.frame]||(this.frames[this.frame]={r:[],pts:0}); f.r.push(now);
  let line; if(this.roll===0&&down===10){ f.pts=15; line='STRIKE! +15'; AUDIO.sfx('cheer'); } else if(this.roll===1&&down===10){ f.pts=13; line='SPARE! +13'; AUDIO.sfx('bigpoint'); } else if(this.roll===1||down===10){ f.pts=down; line=down?down+' CONES':'GUTTER BALL'; AUDIO.sfx(down?'point':'thud'); } else { line=now?now+' DOWN':'MISSED THEM ALL'; AUDIO.sfx(now?'point':'thud'); }
  const frameDone=this.roll===1||down===10; if(frameDone){ this.score+=f.pts; this.frame++; this.roll=0; this.msg={t:1.3,line,next:'rack'}; } else { this.roll=1; this.msg={t:.9,line}; } },
 finish(){ MG.end(this,this.score,{head:this.score>=60?'STRIKE MACHINE':(this.score>=35?'GOOD ROLLING':'THE CONES WIN THIS ONE'),line:'5 frames. Orange cones mark the parts of an apron that are closed to aircraft.'}); },
 draw(c){ const VH=G.VH, L=this.L; MG.floor(c,0,42,VW,VH-42,'hangar');
  // the lane: a stripe of apron with painted edge lines and gutters
  c.fillStyle='rgba(0,0,0,.35)'; c.fillRect(L.x-14,L.top-30,L.w+28,L.bot-L.top+30);
  const lg=c.createLinearGradient(0,L.top,0,L.bot); lg.addColorStop(0,'#4d5056'); lg.addColorStop(1,'#6a6e76'); c.fillStyle=lg; c.fillRect(L.x,L.top-30,L.w,L.bot-L.top+30);
  c.fillStyle='rgba(0,0,0,.25)'; c.fillRect(L.x,L.top-30,16,L.bot-L.top+30); c.fillRect(L.x+L.w-16,L.top-30,16,L.bot-L.top+30);
  c.fillStyle='#ffc21a'; c.fillRect(L.x+16,L.top-30,1.5,L.bot-L.top+30); c.fillRect(L.x+L.w-17.5,L.top-30,1.5,L.bot-L.top+30);
  c.fillStyle='rgba(255,255,255,.35)'; for(let y=L.top+90;y<L.bot-40;y+=26) c.fillRect(L.cx-1,y,2,12);
  MG.spot(c,L.cx,L.top+40,L.w*.8,70,.16);
  // cones (back row first)
  const ks=this.cones.slice().sort((a,b)=>a.y-b.y); for(const k of ks){ const dy=k.up?0:k.t*3; cone(c,k.x+(k.up?0:k.t*k.ang*6),k.y+dy,k.up?14:12,!k.up,k.ang*k.t*1.3); }
  // the ball
  if(this.ball){ const b=this.ball; c.fillStyle='rgba(0,0,0,.35)'; c.beginPath(); c.ellipse(b.x,b.y+3,9,4,0,0,PI*2); c.fill(); MG.sphere(c,b.x,b.y,8,'#1f3a6a'); c.save(); c.translate(b.x,b.y); c.rotate(b.spin); c.fillStyle='rgba(255,255,255,.35)'; for(const a of [0,2.1,4.2]) { c.beginPath(); c.arc(Math.cos(a)*3.5,Math.sin(a)*3.5,1.1,0,PI*2); c.fill(); } c.restore(); }
  else if(!this.msg){ MG.sphere(c,L.cx,L.bot-18,8,'#1f3a6a'); if(this.aim) MG.aimLine(c,L.cx,L.bot-18,this.aim.dx,this.aim.dy,this.aim.power,80,C.accent); }
  // the scoreboard
  const bw=(VW-24)/this.FR; for(let i=0;i<this.FR;i++){ const x=12+i*bw, f=this.frames[i], cur=i===this.frame; G.rrect(x+1,VH-54,bw-2,38,6); c.fillStyle=cur?G.rgba(C.accent,.18):'rgba(0,0,0,.45)'; c.fill(); c.strokeStyle=cur?G.rgba(C.accent,.7):'rgba(255,255,255,.12)'; c.lineWidth=1; c.stroke();
   G.txt(f?f.r.map((v,j)=>(j===0&&v===10)?'X':((j===1&&f.r[0]+v===10)?'/':String(v))).join(' '):'',x+bw/2,VH-50,6,C.sub,'center',undefined,800); G.txt(f&&f.pts!=null&&(f.r.length===2||f.r[0]===10)?String(f.pts):'',x+bw/2,VH-36,8,C.ink,'center',undefined,800); }
  if(this.msg) G.txt(this.msg.line,VW/2,L.top+110,11,/STRIKE|SPARE/.test(this.msg.line)?C.good:C.title,'center',VW-30,800);
  G.txt('FRAME '+Math.min(this.FR,this.frame+1)+' • ROLL '+(this.roll+1),VW/2,L.bot-6,5.6,C.sub,'center',undefined,800);
  MG.hud(this,c,this.score+' PTS',{sub:'TEN CONES, FIVE FRAMES',tip:'Pull back from the ball and let go. Aim slightly off center to take out the whole rack.'}); }
};

/* ============================ HANGAR HOOPS ============================ */
G.scenes.g_hoops={
 enter(a){ MG.start(this,'hoops',a); this.T=45; this.clock=this.T; this.score=0; this.makes=0; this.shots=0; this.sl={}; this.ball=null; this.streak=0; this.L=this.lay(); this.newSpot(); this.fx=[]; if(AUDIO.curName!=='hangar') AUDIO.play('hangar'); },
 lay(){ const VH=G.VH; return {bot:VH-60,top:92,cx:VW/2}; },
 newSpot(){ const far=Math.random()<.4; this.hoop={x:VW/2+(Math.random()-.5)*110,d:far?.85+Math.random()*.15:.45+Math.random()*.3,far}; },
 shotY(d){ const L=this.L; return L.bot-30-(L.bot-30-L.top)*d; },
 update(dt){ if(MG.update(this,dt)) return; const L=this.L;
  for(const f of this.fx){ f.t+=dt; } this.fx=this.fx.filter(f=>f.t<.8);
  if(this.clock<=0){ if(!this.ball) return this.finish(); }
  else this.clock-=dt;
  if(this.ball){ const b=this.ball; b.t+=dt; const k=Math.min(1,b.t/b.dur); b.d=b.D*k; b.x=b.x0+(b.x1-b.x0)*k; b.z=Math.sin(k*PI)*b.h;
   if(k>=1){ const hoop=this.hoop, hit=Math.abs(b.D-hoop.d)<.07&&Math.abs(b.x1-hoop.x)<14; this.shots++;
    if(hit){ const pts=hoop.far?3:2; this.score+=pts; this.makes++; this.streak++; this.fx.push({x:hoop.x,y:this.shotY(hoop.d),t:0,txt:'+'+pts+(this.streak>=3?' HOT':'')}); AUDIO.sfx(hoop.far?'bigpoint':'point'); if(this.streak>=3) AUDIO.sfx('cheer'); this.newSpot(); }
    else { this.streak=0; const rim=Math.abs(b.D-hoop.d)<.14&&Math.abs(b.x1-hoop.x)<26; AUDIO.sfx(rim?'clack':'thud'); this.fx.push({x:b.x1,y:this.shotY(b.D),t:0,txt:rim?'RIM':'MISS'}); }
    this.ball=null; } return; }
  if(this.clock<=0) return;
  const r=MG.sling(this.sl,L.cx,L.bot-16,120,(x,y)=>y>L.bot-70); this.aim=r.active?r:null;
  if(r.fired){ const ang=Math.max(-.6,Math.min(.6,Math.atan2(r.fired.dx,-r.fired.dy))); const D=Math.min(1.05,r.fired.power*1.1); this.ball={t:0,dur:.55+D*.45,D,x0:L.cx,x1:L.cx+Math.sin(ang)*180*D,h:30+D*40,x:L.cx,d:0,z:0}; AUDIO.sfx('throw'); } },
 finish(){ MG.end(this,this.score,{head:this.score>=24?'ON FIRE':(this.score>=12?'NICE SHOOTING':'KEEP PRACTICING'),line:this.makes+' of '+this.shots+' shots. Far hoops are worth 3.'}); },
 draw(c){ const VH=G.VH, L=this.L; MG.floor(c,0,42,VW,VH-42,'hangar');
  // the back wall of the hangar with the hoop mounted on it, the floor in front
  const wy=L.top-14; const wg=c.createLinearGradient(0,42,0,wy+20); wg.addColorStop(0,'#2b2e34'); wg.addColorStop(1,'#43474f'); c.fillStyle=wg; c.fillRect(0,42,VW,wy+20-42);
  c.fillStyle='rgba(255,255,255,.06)'; for(let x=0;x<VW;x+=36) c.fillRect(x,42,1,wy+20-42);
  c.fillStyle='rgba(0,0,0,.35)'; c.fillRect(0,wy+18,VW,4);
  // the floor runs away toward the wall: converging lines, the 3-point arc drawn in perspective
  c.strokeStyle='rgba(255,255,255,.08)'; c.lineWidth=1; for(let i=-4;i<=4;i++){ c.beginPath(); c.moveTo(VW/2+i*70,L.bot+10); c.lineTo(VW/2+i*22,wy+20); c.stroke(); }
  c.strokeStyle='rgba(255,194,26,.55)'; c.lineWidth=1.5; c.beginPath(); c.ellipse(VW/2,this.shotY(.62),72,16,0,0,PI*2); c.stroke(); c.beginPath(); c.moveTo(0,this.shotY(.3)); c.lineTo(VW,this.shotY(.3)); c.stroke();
  G.txt('3 PT',VW/2-72,this.shotY(.62)-12,4.8,'rgba(255,194,26,.75)','center',undefined,800);
  // the hoop on its rolling stand: smaller the farther away it is
  const hp=this.hoop, hy=this.shotY(hp.d), hs=1.15-hp.d*.45;
  c.fillStyle='rgba(0,0,0,.3)'; c.beginPath(); c.ellipse(hp.x+2,hy+3,18*hs,6*hs,0,0,PI*2); c.fill();
  MG.metal(c,hp.x-16*hs,hy-6*hs,32*hs,8*hs,'#3a3f48',2); c.fillStyle='#1a1c20'; for(const k of [-12,12]){ c.beginPath(); c.arc(hp.x+k*hs,hy+2,2.6*hs,0,PI*2); c.fill(); }
  c.fillStyle='#2a2d33'; c.fillRect(hp.x-1.6*hs,hy-66*hs,3.2*hs,60*hs);
  c.fillStyle='rgba(0,0,0,.3)'; c.fillRect(hp.x-15*hs+2,hy-88*hs+2,30*hs,22*hs); c.fillStyle='#f4f4f2'; c.fillRect(hp.x-15*hs,hy-88*hs,30*hs,22*hs); c.strokeStyle='#c8102e'; c.lineWidth=1.6; c.strokeRect(hp.x-7*hs,hy-82*hs,14*hs,11*hs);
  c.strokeStyle='#ff7a2a'; c.lineWidth=2.6*hs; c.beginPath(); c.ellipse(hp.x,hy-70*hs,11*hs,4.2*hs,0,0,PI*2); c.stroke();
  c.strokeStyle='rgba(255,255,255,.6)'; c.lineWidth=.8; for(let i=-2;i<=2;i++){ c.beginPath(); c.moveTo(hp.x+i*4.6*hs,hy-68*hs); c.lineTo(hp.x+i*2.6*hs,hy-54*hs); c.stroke(); }
  if(hp.far) G.txt('3',hp.x,hy-102*hs,7,C.accentHi,'center',undefined,800);
  // the ball
  if(this.ball){ const b=this.ball, y=this.shotY(b.d), s=1-b.d*.35; c.fillStyle='rgba(0,0,0,.35)'; c.beginPath(); c.ellipse(b.x,y+3,9*s,4*s,0,0,PI*2); c.fill(); MG.sphere(c,b.x,y-b.z,9*s,'#e8692b'); c.strokeStyle='rgba(0,0,0,.4)'; c.lineWidth=.8; c.beginPath(); c.arc(b.x,y-b.z,9*s,0,PI*2); c.moveTo(b.x-9*s,y-b.z); c.lineTo(b.x+9*s,y-b.z); c.moveTo(b.x,y-b.z-9*s); c.lineTo(b.x,y-b.z+9*s); c.stroke(); }
  else if(this.clock>0){ MG.sphere(c,L.cx,L.bot-16,9,'#e8692b'); if(this.aim) MG.aimLine(c,L.cx,L.bot-16,this.aim.dx,this.aim.dy,this.aim.power,90,C.accent); }
  for(const f of this.fx){ c.globalAlpha=1-f.t/.8; G.txt(f.txt,f.x,f.y-50-f.t*30,f.txt[0]==='+'?10:7,f.txt[0]==='+'?C.good:C.sub,'center',undefined,800); c.globalAlpha=1; }
  // the clock
  const cw=70; G.rrect(VW/2-cw/2,L.bot+8,cw,22,8); c.fillStyle='rgba(0,0,0,.55)'; c.fill(); c.strokeStyle=this.clock<10?C.bad:G.rgba(C.accent,.6); c.lineWidth=1; c.stroke(); G.txt(this.clock<=0?'TIME!':Math.ceil(this.clock)+' SEC',VW/2,L.bot+15,7,this.clock<10?C.bad:C.ink,'center',undefined,800);
  G.txt(this.streak>=3?'HOT HAND! ':'','',0,0);
  MG.hud(this,c,this.score+' PTS',{sub:'45 SECOND SHOOTOUT',tip:'Pull back and let go. Pull farther for a longer shot. Hit the hoop at the 3 mark for 3.'}); }
};
})();
