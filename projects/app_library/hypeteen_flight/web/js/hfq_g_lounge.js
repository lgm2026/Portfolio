/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* ROUND 5, GAME ROOM GAMES (first built for the Lounge; all three live in the Game Room now)
   COMPASS DARTS  the tower calls a heading; stop the sweeping needle on it (headings, compass points). r7.4: after the
                  eighth dart, a quick lesson and one question can earn a bonus dart (hfq_retry.js)
   AIR HOCKEY     drag your mallet, first to 5 against the crew
   RADAR FOUR     four in a row on a radar screen, against the crew
   SKEE-BALL      roll for the rings; the center ring is the runway */
(function(){
const H=G.HFQ, C=G.C, VW=G.VW, PI=Math.PI, MG=G.MG;
const rad=d=>(d-90)*PI/180;

/* ============================ COMPASS DARTS ============================ */
const PTS=[['NORTH',0],['NORTHEAST',45],['EAST',90],['SOUTHEAST',135],['SOUTH',180],['SOUTHWEST',225],['WEST',270],['NORTHWEST',315]];
G.scenes.g_darts={
 enter(a){ MG.start(this,'darts',a); this.N=8; this.n=0; this.score=0; this.hits=[]; this.extra=null; this.start(); if(AUDIO.curName!=='lounge') AUDIO.play('lounge'); },
 start(){ const byName=this.n%3===2, p=PTS[Math.floor(Math.random()*8)]; this.target=byName?p[1]:Math.floor(Math.random()*36)*10; this.call=byName?'FLY '+p[0]:'FLY HEADING '+String(this.target).padStart(3,'0');
  this.ang=Math.random()*360; this.speed=140+this.n*16; this.state='sweep'; this.fb=null; this.wob=0; AUDIO.sfx('radio'); if(H.say&&this.n<3) H.say(this.call.toLowerCase().replace(/(\d)(\d)(\d)/,'$1 $2 $3'),'atc'); },
 rose(){ const VH=G.VH, r=Math.min(VW*.4,(VH-250)*.42); return {cx:VW/2,cy:84+r+10,r}; },
 update(dt){ if(MG.update(this,dt)) return;
  if(this.fb){ this.fb.t+=dt; if(this.fb.t>.7&&(G.ptr.click||G.pressed.a)){ G.ptr.click=false; if(this.extra) return this.end(); this.n++; if(this.n>=this.N) return this.finish(); this.start(); } return; }
  if(this.state==='offer') return;
  this.ang=(this.ang+this.speed*dt)%360; this.wob+=dt;
  if(G.ptr.click||G.pressed.a){ G.ptr.click=false; const thrown=(this.ang+Math.sin(this.wob*7)*4+360)%360; let d=Math.abs(thrown-this.target)%360; if(d>180) d=360-d;
   const pts=d<=5?100:(d<=10?70:(d<=20?40:(d<=45?15:0))), X=this.extra;
   if(X){ X.pts=pts; if(pts>this.hits[X.i].pts){ X.better=1; this.hits[X.i]={a:thrown,pts}; } } else this.hits.push({a:thrown,pts});   // the bonus dart only ever replaces the lowest one
   this.score=this.hits.reduce((a,h)=>a+h.pts,0); this.fb={t:0,d:Math.round(d),pts,thrown:Math.round(thrown)}; AUDIO.sfx(pts>=70?'bigpoint':(pts?'point':'thud')); if(pts>=70) AUDIO.sfx('clack'); } },
 /* eight darts in: offer the learn-for-a-retry (once per game; not when every dart scored 100), else the results */
 finish(){ const lo=Math.min(...this.hits.map(h=>h.pts)), i=this.hits.findIndex(h=>h.pts===lo); this.state='offer';
  if(lo<100&&MG.offerRetry(this,{title:'ONE MORE DART?',what:'throw one bonus dart at a new heading. If it scores more than your lowest dart ('+lo+' PTS), it takes its place',go:'THROW IT!',tags:['any'],
   onEarn:()=>{ this.extra={i,was:lo}; this.start(); },onSkip:()=>this.end()})) return;
  this.end(); },
 end(){ const X=this.extra, extra=X&&X.pts!=null?(X.better?' Bonus dart: '+X.pts+' beat your '+X.was+'.':' Bonus dart: '+X.pts+', so your '+X.was+' stays.'):'';
  this.state='over'; MG.end(this,this.score,{head:this.score>=600?'DEAD ON HEADING':(this.score>=350?'ON COURSE':'A LITTLE OFF COURSE'),line:'Headings are degrees from north: 090 is east, 180 south, 270 west.'+extra}); },
 draw(c){ const VH=G.VH, R=this.rose(), {cx,cy,r}=R; MG.floor(c,0,42,VW,VH-42,'wood');
  // the board: a compass rose
  c.save(); c.shadowColor='rgba(0,0,0,.6)'; c.shadowBlur=16; c.shadowOffsetY=6; c.beginPath(); c.arc(cx,cy,r+10,0,PI*2); c.fillStyle='#2a1c12'; c.fill(); c.restore();
  const wg=c.createRadialGradient(cx-r*.3,cy-r*.3,r*.2,cx,cy,r+10); wg.addColorStop(0,'#7a5634'); wg.addColorStop(1,'#3d2814'); c.beginPath(); c.arc(cx,cy,r+10,0,PI*2); c.fillStyle=wg; c.fill();
  const fg=c.createRadialGradient(cx,cy,0,cx,cy,r); fg.addColorStop(0,'#f4efe2'); fg.addColorStop(1,'#d9cfb6'); c.beginPath(); c.arc(cx,cy,r,0,PI*2); c.fillStyle=fg; c.fill();
  for(const [rr,col] of [[r*.78,'#c8102e'],[r*.56,'#1f3a6a'],[r*.3,'#c8102e'],[r*.12,'#111']]){ c.beginPath(); c.arc(cx,cy,rr,0,PI*2); c.strokeStyle=col; c.lineWidth=r*.035; c.stroke(); }
  for(let d=0;d<360;d+=10){ const a=rad(d), L=d%30?r*.06:r*.11; c.strokeStyle=d%90?'#3a3f48':'#c8102e'; c.lineWidth=d%30?1:1.8; c.beginPath(); c.moveTo(cx+Math.cos(a)*(r-L),cy+Math.sin(a)*(r-L)); c.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r); c.stroke();
   if(d%30===0) G.txt(d%90?String(d/10):{0:'N',90:'E',180:'S',270:'W'}[d],cx+Math.cos(a)*(r*.88),cy+Math.sin(a)*(r*.88)-4,d%90?5:8,d%90?'#3a3f48':'#c8102e','center',undefined,800); }
  // the target wedge
  if(!this.fb||true){ const a=rad(this.target); c.fillStyle='rgba(63,220,124,.25)'; c.beginPath(); c.moveTo(cx,cy); c.arc(cx,cy,r,a-5*PI/180,a+5*PI/180); c.closePath(); c.fill(); }
  // darts that landed
  for(const h of this.hits){ const a=rad(h.a), x=cx+Math.cos(a)*r*.7, y=cy+Math.sin(a)*r*.7; c.fillStyle=h.pts>=70?C.good:(h.pts?C.accentHi:C.bad); c.beginPath(); c.arc(x,y,3,0,PI*2); c.fill(); }
  // the needle
  const na=rad(this.fb?this.fb.thrown:(this.ang+Math.sin(this.wob*7)*4)); c.save(); c.translate(cx,cy); c.rotate(na); c.fillStyle='#c8102e'; c.beginPath(); c.moveTo(r*.92,0); c.lineTo(-r*.1,-r*.05); c.lineTo(-r*.18,0); c.lineTo(-r*.1,r*.05); c.closePath(); c.fill(); c.fillStyle='#e9edf2'; c.beginPath(); c.arc(0,0,r*.06,0,PI*2); c.fill(); c.restore();
  // the call
  G.rrect(14,48,VW-28,26,10); c.fillStyle=G.rgba(C.accent,.12); c.fill(); c.strokeStyle=G.rgba(C.accent,.5); c.lineWidth=1; c.stroke(); G.icon('headset',c,30,61,12,C.accentText); G.txt('TOWER: '+this.call,46,56,7.4,C.ink,'left',VW-70,800);
  G.txt((this.extra?'BONUS DART':'THROW '+Math.min(this.N,this.n+1)+' OF '+this.N)+' • TAP TO THROW WHEN THE NEEDLE IS ON IT',VW/2,cy+r+24,5.6,this.extra?C.accentHi:C.sub,'center',VW-24,800);
  if(this.fb){ const f=this.fb; G.txt(f.pts>=70?'BULLSEYE! '+f.thrown+'° (+'+f.pts+')':(f.pts?f.thrown+'°: '+f.d+'° OFF (+'+f.pts+')':f.thrown+'°: '+f.d+'° OFF. WAY OFF COURSE!'),VW/2,cy+r+40,7.4,f.pts>=70?C.good:(f.pts?C.accentHi:C.bad),'center',VW-24,800); if(f.t>.7&&!this.over) G.txt('TAP TO CONTINUE',VW/2,VH-16,5.4,C.accentText,'center',undefined,800); }
  MG.hud(this,c,this.score+' PTS',{sub:'HIT THE HEADING',tip:'The tower calls a heading. Tap when the sweeping needle points at it. Within 5° is a bullseye.'}); }
};

/* ============================ AIR HOCKEY ============================ */
G.scenes.g_hockey={
 enter(a){ MG.start(this,'hockey',a); this.me=0; this.cpu=0; this.T=this.table(); this.px=VW/2; this.py=this.T.y+this.T.h-30; this.cx=VW/2; this.cy=this.T.y+30; this.pvx=0; this.pvy=0; this.serve(-1); this.msg=null; this.goalT=0; if(AUDIO.curName!=='arcade') AUDIO.play('arcade'); },
 table(){ const VH=G.VH; return {x:18,y:62,w:VW-36,h:VH-120,goal:70}; },
 surface(){ // the playing surface (gradient, air holes, lines, goals) drawn once at device scale
  const T=this.T, k=Math.max(1,Math.min(3,window.devicePixelRatio||1)); if(this.sf&&this.sf.k===k&&this.sf.w===T.w&&this.sf.h===T.h) return this.sf.cv;
  const cv=document.createElement('canvas'); cv.width=Math.ceil(T.w*k); cv.height=Math.ceil(T.h*k); const c=cv.getContext('2d'); c.scale(k,k);
  const rr=(x,y,w,h,r)=>{ c.beginPath(); c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath(); };
  const tg=c.createRadialGradient(T.w/2,T.h/2,20,T.w/2,T.h/2,T.h*.7); tg.addColorStop(0,'#f6f8fb'); tg.addColorStop(1,'#cfd6de'); rr(0,0,T.w,T.h,10); c.fillStyle=tg; c.fill();
  c.fillStyle='rgba(255,255,255,.5)'; for(let y=8;y<T.h;y+=12) for(let x=8;x<T.w;x+=12) c.fillRect(x,y,1,1);   // the air holes
  c.strokeStyle='#c8102e'; c.lineWidth=2; c.beginPath(); c.moveTo(0,T.h/2); c.lineTo(T.w,T.h/2); c.stroke(); c.beginPath(); c.arc(T.w/2,T.h/2,26,0,PI*2); c.stroke();
  for(const yy of [0,T.h]){ c.fillStyle='#1a1c20'; c.fillRect(T.w/2-T.goal/2,yy-3,T.goal,6); }
  this.sf={cv,k,w:T.w,h:T.h}; return cv; },
 serve(dir){ const T=this.T; this.puck={x:VW/2,y:T.y+T.h/2+dir*40,vx:(Math.random()-.5)*60,vy:dir*120}; },
 update(dt){ if(MG.update(this,dt)) return; const T=this.T, p=this.puck, MR=14, PR=9;
  if(this.goalT>0){ this.goalT-=dt; if(this.goalT<=0){ this.msg=null; if(this.me>=5||this.cpu>=5) return this.finish(); } return; }
  // your mallet follows the finger (bottom half only)
  if(G.ptr.down){ const nx=Math.max(T.x+MR,Math.min(T.x+T.w-MR,G.ptr.x)), ny=Math.max(T.y+T.h/2+MR,Math.min(T.y+T.h-MR,G.ptr.y)); this.pvx=(nx-this.px)/dt; this.pvy=(ny-this.py)/dt; this.px=nx; this.py=ny; } else { this.pvx*=.5; this.pvy*=.5; }
  // the crew's mallet: tracks the puck, lunges when it's near
  const tx=p.y<T.y+T.h/2?p.x:VW/2, ty=p.y<T.y+T.h/2?Math.min(p.y-4,T.y+T.h/2-MR):T.y+30, sp=p.y<T.y+T.h/2?240:140; this.cx+=Math.max(-sp*dt,Math.min(sp*dt,tx-this.cx)); this.cy+=Math.max(-sp*dt,Math.min(sp*dt,ty-this.cy));
  p.x+=p.vx*dt; p.y+=p.vy*dt; p.vx*=Math.pow(.985,dt*60); p.vy*=Math.pow(.985,dt*60);
  if(p.x<T.x+PR){ p.x=T.x+PR; p.vx=Math.abs(p.vx); AUDIO.sfx('wall'); } if(p.x>T.x+T.w-PR){ p.x=T.x+T.w-PR; p.vx=-Math.abs(p.vx); AUDIO.sfx('wall'); }
  const inGoal=Math.abs(p.x-VW/2)<T.goal/2;
  if(p.y<T.y+PR){ if(inGoal){ this.me++; this.msg='GOAL!'; this.goalT=1.2; AUDIO.sfx('cheer'); this.serve(-1); return; } p.y=T.y+PR; p.vy=Math.abs(p.vy); AUDIO.sfx('wall'); }
  if(p.y>T.y+T.h-PR){ if(inGoal){ this.cpu++; this.msg='THE CREW SCORES'; this.goalT=1.2; AUDIO.sfx('thud'); this.serve(1); return; } p.y=T.y+T.h-PR; p.vy=-Math.abs(p.vy); AUDIO.sfx('wall'); }
  for(const [mx,my,vx,vy] of [[this.px,this.py,this.pvx,this.pvy],[this.cx,this.cy,0,0]]){ const dx=p.x-mx, dy=p.y-my, d=Math.hypot(dx,dy); if(d<MR+PR&&d>0){ const nx=dx/d, ny=dy/d; p.x=mx+nx*(MR+PR); p.y=my+ny*(MR+PR); const rel=(p.vx-vx*.6)*nx+(p.vy-vy*.6)*ny; if(rel<0){ p.vx-=2*rel*nx; p.vy-=2*rel*ny; } p.vx+=vx*.25; p.vy+=vy*.25; const s=Math.hypot(p.vx,p.vy); if(s>520){ p.vx*=520/s; p.vy*=520/s; } AUDIO.sfx('clack'); } } },
 finish(){ MG.end(this,this.me-this.cpu,{head:this.me>this.cpu?'YOU WIN THE FACE-OFF':'THE CREW TAKES IT',line:this.me+' to '+this.cpu+'. Score = your margin.'}); },
 draw(c){ const VH=G.VH, T=this.T, p=this.puck; MG.floor(c,0,42,VW,VH-42,'wood');
  c.save(); c.shadowColor='rgba(0,0,0,.55)'; c.shadowBlur=14; c.shadowOffsetY=6; G.rrect(T.x-6,T.y-6,T.w+12,T.h+12,14); c.fillStyle='#2a2d33'; c.fill(); c.restore();
  c.drawImage(this.surface(),T.x,T.y,T.w,T.h);
  G.txt(String(this.cpu),T.x+12,T.y+T.h/2-30,16,'rgba(0,0,0,.25)','left',undefined,800); G.txt(String(this.me),T.x+12,T.y+T.h/2+10,16,'rgba(200,16,46,.6)','left',undefined,800);
  if(!G.rm()){ const s=Math.hypot(p.vx,p.vy); if(s>150){ c.fillStyle='rgba(20,22,26,.18)'; c.beginPath(); c.arc(p.x-p.vx*.03,p.y-p.vy*.03,9,0,PI*2); c.fill(); } }
  MG.sphere(c,p.x,p.y,9,'#1a1c20'); c.fillStyle='#c8102e'; c.beginPath(); c.arc(p.x,p.y,4,0,PI*2); c.fill();
  for(const [mx,my,col] of [[this.cx,this.cy,'#2f6fb5'],[this.px,this.py,'#ffc21a']]){ c.fillStyle='rgba(0,0,0,.25)'; c.beginPath(); c.arc(mx+1.5,my+2,14,0,PI*2); c.fill(); MG.sphere(c,mx,my,14,col); MG.sphere(c,mx,my-3,6,G.shade(col,1.2)); }
  if(this.msg) G.txt(this.msg,VW/2,T.y+T.h/2-40,12,C.title,'center',undefined,800);
  MG.hud(this,c,this.me+' – '+this.cpu,{sub:'FIRST TO 5',tip:'Drag your yellow mallet on the bottom half. Shoot the puck into the crew’s goal.'}); }
};

/* ============================ RADAR FOUR ============================ */
G.scenes.g_radar4={
 enter(a){ MG.start(this,'radar4',a); this.COLS=7; this.ROWS=6; this.bd=[]; for(let y=0;y<6;y++) this.bd.push(new Array(7).fill(0)); this.turn=1; this.moves=0; this.over=null; this.won=0; this.think=0; this.drop=null; if(AUDIO.curName!=='arcade') AUDIO.play('arcade'); },
 cell(){ const VH=G.VH, s=Math.min((VW-24)/7,(VH-180)/6); return {s,x0:(VW-s*7)/2,y0:Math.max(96,(VH-s*6)/2+10)}; },
 lowest(x){ for(let y=5;y>=0;y--) if(!this.bd[y][x]) return y; return -1; },
 win(p){ const g=this.bd; for(let y=0;y<6;y++) for(let x=0;x<7;x++){ if(g[y][x]!==p) continue; for(const [dx,dy] of [[1,0],[0,1],[1,1],[1,-1]]){ let k=1; while(k<4){ const nx=x+dx*k, ny=y+dy*k; if(nx<0||nx>=7||ny<0||ny>=6||g[ny][nx]!==p) break; k++; } if(k===4) return [[x,y],[x+dx*3,y+dy*3]]; } } return null; },
 place(x,p){ const y=this.lowest(x); if(y<0) return false; this.bd[y][x]=p; this.moves++; this.drop={x,y,t:0,p}; AUDIO.sfx('drop'); const w=this.win(p); if(w){ this.line=w; this.won=p; this.end(); } else if(this.moves>=42){ this.won=0; this.end(); } else this.turn=3-p; return true; },
 end(){ this.endT=1.6; },
 cpuMove(){ const g=this.bd, free=[]; for(let x=0;x<7;x++) if(this.lowest(x)>=0) free.push(x);
  const tryWin=p=>{ for(const x of free){ const y=this.lowest(x); g[y][x]=p; const w=!!this.win(p); g[y][x]=0; if(w) return x; } return -1; };
  let x=tryWin(2); if(x<0) x=tryWin(1); if(x<0){ const pref=[3,2,4,1,5,0,6].filter(q=>free.includes(q)); x=Math.random()<.75?pref[0]:pref[Math.floor(Math.random()*Math.min(3,pref.length))]; } this.place(x,2); },
 update(dt){ if(MG.update(this,dt)) return; if(this.drop) this.drop.t+=dt;
  if(this.endT!=null){ this.endT-=dt; if(this.endT<=0) return this.finish(); return; }
  if(this.turn===2){ this.think+=dt; if(this.think>.6){ this.think=0; this.cpuMove(); } return; }
  const K=this.cell(); if(G.ptr.click&&G.ptr.y>K.y0-30&&G.ptr.y<K.y0+K.s*6+10){ const x=Math.floor((G.ptr.x-K.x0)/K.s); if(x>=0&&x<7){ if(!this.place(x,1)) AUDIO.sfx('buzzer'); } } },
 finish(){ const score=this.won===1?100+Math.max(0,(42-this.moves)*5):(this.won===2?10:40); MG.end(this,score,{head:this.won===1?'FOUR ON THE SCOPE!':(this.won===2?'THE CREW GOT FOUR':'A FULL SCREEN: DRAW'),line:this.moves+' contacts on the radar.'}); },
 draw(c){ const VH=G.VH, K=this.cell(), t=this.t; const bg=c.createRadialGradient(VW/2,VH/2,10,VW/2,VH/2,VH*.7); bg.addColorStop(0,'#0f2a1c'); bg.addColorStop(1,'#060d09'); c.fillStyle=bg; c.fillRect(0,42,VW,VH-42);
  c.strokeStyle='rgba(63,220,124,.12)'; c.lineWidth=1; for(let r=30;r<VH;r+=40){ c.beginPath(); c.arc(VW/2,K.y0+K.s*3,r,0,PI*2); c.stroke(); }
  if(!G.rm()){ c.save(); c.translate(VW/2,K.y0+K.s*3); c.rotate(t*1.2); const sw=c.createLinearGradient(0,0,0,-VH); c.fillStyle='rgba(63,220,124,.12)'; c.beginPath(); c.moveTo(0,0); c.arc(0,0,VH,-PI/2-.5,-PI/2); c.closePath(); c.fill(); c.restore(); }
  G.rrect(K.x0-6,K.y0-6,K.s*7+12,K.s*6+12,10); c.fillStyle='rgba(6,20,12,.8)'; c.fill(); c.strokeStyle='rgba(63,220,124,.5)'; c.lineWidth=1.2; c.stroke();
  for(let y=0;y<6;y++) for(let x=0;x<7;x++){ const cx=K.x0+x*K.s+K.s/2, cy=K.y0+y*K.s+K.s/2, v=this.bd[y][x]; c.beginPath(); c.arc(cx,cy,K.s*.4,0,PI*2); c.fillStyle='rgba(63,220,124,.06)'; c.fill(); c.strokeStyle='rgba(63,220,124,.25)'; c.lineWidth=.8; c.stroke();
   if(v){ let dy=0; if(this.drop&&this.drop.x===x&&this.drop.y===y&&this.drop.t<.3&&!G.rm()) dy=-(1-this.drop.t/.3)*K.s*(y+1); MG.sphere(c,cx,cy+dy,K.s*.36,v===1?'#ffc21a':'#3d7bff'); G.icon('plane',c,cx,cy+dy,K.s*.4,v===1?'#5a4300':'#0d2b5a'); } }
  if(this.line){ const [a,b]=this.line; c.strokeStyle=this.won===1?C.good:C.bad; c.lineWidth=4; c.lineCap='round'; c.beginPath(); c.moveTo(K.x0+a[0]*K.s+K.s/2,K.y0+a[1]*K.s+K.s/2); c.lineTo(K.x0+b[0]*K.s+K.s/2,K.y0+b[1]*K.s+K.s/2); c.stroke(); }
  if(this.turn===1&&this.endT==null){ const x=Math.max(0,Math.min(6,Math.floor((G.ptr.x-K.x0)/K.s))); G.txt('▼',K.x0+x*K.s+K.s/2,K.y0-22,12,C.accentHi,'center',undefined,800); }
  G.txt(this.endT!=null?'':(this.turn===1?'YOUR MOVE: TAP A COLUMN':'THE CREW IS THINKING…'),VW/2,56,7,C.title,'center',undefined,800);
  G.txt('YOU ● GOLD    CREW ● BLUE',VW/2,70,5.4,C.sub,'center',undefined,800);
  MG.hud(this,c,this.moves+' MOVES',{sub:'FOUR IN A ROW',tip:'Drop your gold contacts. Get four in a row across, down or diagonal before the crew does.'}); }
};

/* ============================ SKEE-BALL ============================ */
const RINGS=[[10,'TAXIWAY'],[20,'APRON'],[30,'RUNWAY'],[40,'HOLD LINE'],[50,'CENTERLINE']], RR=[92,68,46,27,11], EF=1.7;
G.scenes.g_skee={
 enter(a){ MG.start(this,'skee',a); this.N=9; this.n=0; this.score=0; this.ball=null; this.sl={}; this.last=null; this.lane=this.layout(); if(AUDIO.curName!=='arcade') AUDIO.play('arcade'); },
 layout(){ const VH=G.VH; return {x:24,w:VW-48,top:66,ramp:VH-150,bot:VH-70,cx:VW/2,cy:160}; },
 update(dt){ if(MG.update(this,dt)) return; const L=this.lane;
  if(this.ball){ const b=this.ball; b.t+=dt; if(b.phase==='roll'){ b.y-=b.v*dt; b.x+=b.vx*dt; if(b.y<=L.ramp){ b.phase='fly'; b.vz=b.v*.74; b.z=0; b.vy=-b.v*.8; AUDIO.sfx('swish'); } }
   else if(b.phase==='fly'){ b.z+=b.vz*dt; b.vz-=900*dt; b.y+=b.vy*dt; b.x+=b.vx*dt; if(b.z<=0){ b.phase='done'; const d=Math.hypot(b.x-L.cx,(b.y-L.cy)*EF); let ring=-1; for(let i=RR.length-1;i>=0;i--) if(d<RR[i]){ ring=i; break; } const pts=ring>=0?RINGS[ring][0]:0; this.score+=pts; this.last={pts,name:ring>=0?RINGS[ring][1]:'MISSED THE RINGS'}; AUDIO.sfx(pts>=40?'bigpoint':(pts?'point':'thud')); b.hold=1.1; } }
   else { b.hold-=dt; if(b.hold<=0){ this.ball=null; this.n++; if(this.n>=this.N) this.finish(); } } return; }
  const r=MG.sling(this.sl,L.cx,L.bot-16,120,(x,y)=>y>L.ramp-10); this.aim=r.active?r:null;
  if(r.fired){ const v=260+r.power*300, ang=Math.max(-.5,Math.min(.5,Math.atan2(r.fired.dx,-r.fired.dy))); this.ball={x:L.cx,y:L.bot-16,v,vx:Math.sin(ang)*v*.6,phase:'roll',t:0,z:0}; AUDIO.sfx('throw'); } },
 finish(){ MG.end(this,this.score,{head:this.score>=300?'HIGH ROLLER':(this.score>=180?'NICE ROLLING':'KEEP ROLLING'),line:this.N+' balls. The center ring is the runway centerline: 50 each.'}); },
 draw(c){ const VH=G.VH, L=this.lane; MG.floor(c,0,42,VW,VH-42,'wood');
  // the machine: a lane up to a ramp, the target board at the top
  c.save(); c.shadowColor='rgba(0,0,0,.6)'; c.shadowBlur=14; c.shadowOffsetY=6; G.rrect(L.x-8,L.top-10,L.w+16,L.bot-L.top+20,12); c.fillStyle='#2a1c12'; c.fill(); c.restore();
  MG.wood(c,L.x-8,L.top-10,L.w+16,L.bot-L.top+20,'#5a3a22',12);
  const lg=c.createLinearGradient(0,L.ramp,0,L.bot); lg.addColorStop(0,'#c9a26a'); lg.addColorStop(1,'#a67c48'); c.fillStyle=lg; c.fillRect(L.x,L.ramp,L.w,L.bot-L.ramp); c.fillStyle='rgba(0,0,0,.14)'; for(let x=L.x+10;x<L.x+L.w;x+=14) c.fillRect(x,L.ramp,1,L.bot-L.ramp);
  const rg=c.createLinearGradient(0,L.ramp-30,0,L.ramp); rg.addColorStop(0,'#8f6a3a'); rg.addColorStop(1,'#c9a26a'); c.fillStyle=rg; c.beginPath(); c.moveTo(L.x,L.ramp); c.lineTo(L.x+L.w,L.ramp); c.lineTo(L.x+L.w-10,L.ramp-30); c.lineTo(L.x+10,L.ramp-30); c.closePath(); c.fill();
  // the board: an airfield seen from above with the rings
  G.rrect(L.x+4,L.top,L.w-8,L.ramp-40-L.top,8); c.fillStyle='#3f6a34'; c.fill();
  RR.forEach((rr,i)=>{ c.beginPath(); c.ellipse(L.cx,L.cy,rr,rr/EF,0,0,PI*2); c.fillStyle=['#55585e','#7c8087','#3d4046','#ffc21a','#f2f2f2'][i]; c.fill(); c.strokeStyle='rgba(0,0,0,.35)'; c.lineWidth=1; c.stroke(); if(i<4){ const inner=RR[i+1]/EF, outer=rr/EF, ly=i%2?L.cy+(inner+outer)/2-3:L.cy-(inner+outer)/2-3; G.txt(String(RINGS[i][0]),L.cx,ly,5,'#fff','center',undefined,800); } });
  c.fillStyle='#f2f2f2'; for(let x=L.cx-40;x<L.cx+40;x+=8) if(Math.abs(x-L.cx)>10) c.fillRect(x,L.cy-.6,4,1.2); G.txt('50',L.cx,L.cy-3,4.6,'#111','center',undefined,800);
  // the ball
  if(this.ball){ const b=this.ball, sc=1-Math.min(.5,b.z/300); c.fillStyle='rgba(0,0,0,.3)'; c.beginPath(); c.ellipse(b.x,b.y+2,9*sc,4*sc,0,0,PI*2); c.fill(); MG.sphere(c,b.x,b.y-b.z*.5,9*sc,'#c9a26a'); }
  else { MG.sphere(c,L.cx,L.bot-16,9,'#c9a26a'); if(this.aim) MG.aimLine(c,L.cx,L.bot-16,this.aim.dx,this.aim.dy,this.aim.power,80,C.accent); }
  if(this.last&&this.ball&&this.ball.phase==='done') G.txt(this.last.pts?this.last.name+' +'+this.last.pts:this.last.name,VW/2,L.cy+70,9,this.last.pts>=40?C.good:C.ink,'center',undefined,800);
  G.txt('BALL '+Math.min(this.N,this.n+1)+' OF '+this.N,VW/2,L.bot+4,5.6,C.sub,'center',undefined,800);
  MG.hud(this,c,this.score+' PTS',{sub:'ROLL FOR THE RINGS',tip:'Pull back and let go. Harder rolls fly farther up the board. The runway centerline is 50.'}); }
};
})();
