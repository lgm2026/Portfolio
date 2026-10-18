/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* PAPER PLANE TOSS (the Viewing Platform): pull back and let go to launch a paper airplane off the platform.
   A small glider model: lift and drag grow with airspeed squared, lift with angle of attack up to about 15°,
   then the wing STALLS (lift drops, the nose falls, it dives, then glides again). Headwinds and tailwinds change the
   distance. Three throws: your score is the total distance, plus bonuses for landing in the target rings.
   r7.4 LEARN FOR A RETRY: after the third throw, a quick lesson about what just happened (a stall, the wind...) and one
   question can earn a bonus throw. It re-throws the shortest throw and only replaces it if it scores more (hfq_retry.js). */
(function(){
const H=G.HFQ, C=G.C, VW=G.VW, PI=Math.PI, MG=G.MG;
const DEG=PI/180, K=.075, CD0=.022, KI=.3, TRIM=5*DEG, STALL=17*DEG, GRAV=32.2, PLAT=34;
G.scenes.g_paper={
 enter(a){ MG.start(this,'paper',a); this.throwN=0; this.total=0; this.dists=[]; this.scores=[]; this.winds=[]; this.stallN=0; this.bonus=null; this.newThrow(); this.sl={}; },
 newThrow(){ this.state='aim'; this.p=null; this.trail=[]; this.wind=Math.round(Math.random()*8-4); this.targets=[60,95,130].map(v=>v+Math.round(Math.random()*16-8)); this.cam=0; this.msg=null; this.stalled=0; },
 launchPt(){ return {x:30,y:this.groundY()-PLAT*this.ppf()}; },
 ppf(){ return 1.55; }, groundY(){ return G.VH-130; },
 update(dt){
  if(MG.update(this,dt)) return;
  if(this.state==='aim'){
   const L=this.launchPt(), s=MG.sling(this.sl,L.x,L.y,90,(x,y)=>y>44);
   this.aim=s.active?s:null;
   if(s.fired){ const ang=Math.atan2(-s.fired.dy,s.fired.dx), v=10+s.fired.power*30; // ft/s
    if(s.fired.dx<0){ this.msg='THROW IT FORWARD, OUT OVER THE FIELD'; return; }
    this.p={x:0,y:PLAT,vx:Math.cos(ang)*v,vy:Math.sin(ang)*v,th:ang}; this.state='fly'; AUDIO.sfx('throw'); this.msg=null; }
  } else if(this.state==='fly'){
   const P=this.p, h=1/240; let left=Math.min(dt,.05);
   while(left>0){ const st=Math.min(h,left); left-=st;
    const ax=P.vx-this.wind*1.688, az=P.vy, v=Math.hypot(ax,az)||.01, gam=Math.atan2(az,ax);
    let aoa=P.th-gam; while(aoa>PI) aoa-=2*PI; while(aoa<-PI) aoa+=2*PI;
    const stall=Math.abs(aoa)>STALL; let CL=stall?Math.sign(aoa)*.45:2*PI*aoa; const CD=CD0+KI*CL*CL+(stall?.6:0);
    if(stall&&!this.stalled){ this.stalled=1; this.msg='STALL! THE NOSE DROPS'; AUDIO.sfx('stall'); }
    const q=K*v*v, L=q*CL, D=q*CD, ux=ax/v, uz=az/v;
    P.vx+=(-D*ux-L*uz)*st; P.vy+=(-D*uz+L*ux-GRAV)*st;
    P.th+=((gam+TRIM)-P.th)*Math.min(1,st*(stall?6:5));     // the tail weathervanes the nose back toward a glide
    P.x+=P.vx*st; P.y+=P.vy*st;
    if(P.y<=0){ P.y=0; this.land(); break; }
   }
   if(this.trail.length===0||Math.abs(this.trail[this.trail.length-1][0]-P.x)>2) this.trail.push([P.x,P.y]);
   this.cam+=(Math.max(0,P.x-70)-this.cam)*Math.min(1,dt*4);
  } else if(this.state==='landed'){ this.lt+=dt; if(this.lt>1.6){ if(this.bonus) return this.end(); this.throwN++; if(this.throwN>=3) this.finish(); else this.newThrow(); } }
 },
 land(){ const d=Math.max(0,Math.round(this.p.x)); let bonus=0, hit=null;
  this.targets.forEach((t,i)=>{ const off=Math.abs(d-t); if(off<=3){ bonus=Math.max(bonus,30); hit='BULLSEYE'; } else if(off<=8&&bonus<15){ bonus=15; hit='IN THE RING'; } });
  const B=this.bonus;
  if(B){ B.d=d; B.s=d+bonus; if(B.s>this.scores[B.i]){ B.better=1; this.scores[B.i]=B.s; this.dists[B.i]=d; } }   // the bonus throw only ever replaces the shortest one
  else { this.dists.push(d); this.scores.push(d+bonus); this.winds.push(this.wind); if(this.stalled) this.stallN++; }
  this.total=this.scores.reduce((a,b)=>a+b,0); this.state='landed'; this.lt=0;
  this.res=d+' FT'+(hit?' • '+hit+' +'+bonus:'')+(B?(B.better?' • BEATS '+B.was+' FT':' • '+B.was+' FT STAYS'):''); AUDIO.sfx(hit?'hole':'drop'); },
 /* three throws in: offer the learn-for-a-retry (once per game), else the results */
 finish(){ const lo=Math.min(...this.scores), i=this.scores.indexOf(lo), tags=[];
  if(this.stallN) tags.push('stall'); if(this.winds.some(w=>w<0)) tags.push('head'); if(this.winds.some(w=>w>0)) tags.push('tail'); if(Math.max(...this.dists)>=100) tags.push('long');
  this.state='offer';
  if(MG.offerRetry(this,{title:'ONE MORE THROW?',what:'re-throw your shortest throw ('+this.dists[i]+' FT). If the new one scores more, it takes its place',go:'THROW IT!',tags,
   onEarn:()=>{ this.bonus={i,was:this.dists[i]}; this.newThrow(); },onSkip:()=>this.end()})) return;
  this.end(); },
 end(){ const B=this.bonus, extra=B&&B.d!=null?(B.better?' Bonus throw: '+B.d+' ft beat your '+B.was+' ft throw.':' Bonus throw: '+B.d+' ft, so your '+B.was+' ft throw stays.'):'';
  MG.end(this,this.total,{head:'NICE GLIDES!',line:'Throws: '+this.dists.join(', ')+' ft.'+extra+' Shallow, smooth launches glide farthest. Steep ones stall.'}); this.state='over'; },
 draw(c){
  const VH=G.VH, gy=this.groundY(), ppf=this.ppf(), cam=this.cam;
  H.sky(c,0,42,VW,gy-42,{mode:'day',sun:[.15,.16],t:this.t}); H.clouds(c,-cam*.15,42,VW+cam*.15+60,(gy-42)*.5,{t:this.t,n:4,seed:1,speed:4,alpha:.85});
  const sx=fx=>30+(fx-cam)*ppf, sy=fz=>gy-fz*ppf;
  // the field: grass, distance boards, target rings
  c.fillStyle='#5a8a44'; c.fillRect(0,gy,VW,VH-gy);
  for(let d=0;d<=400;d+=10){ const x=sx(d); if(x<-10||x>VW+10) continue; c.fillStyle=d%50?'rgba(255,255,255,.35)':'#fff'; c.fillRect(x,gy,1.2,d%50?4:8); if(d%50===0) G.txt(d+' FT',x,gy+10,5,'#fff','center',undefined,800); }
  for(const t of this.targets){ const x=sx(t); c.strokeStyle='#ffc21a'; c.lineWidth=2; c.beginPath(); c.ellipse(x,gy+2,8*ppf,3,0,0,PI*2); c.stroke(); c.strokeStyle='#ff4a3d'; c.beginPath(); c.ellipse(x,gy+2,3*ppf,1.6,0,0,PI*2); c.stroke(); }
  // the platform
  const px=sx(0); c.fillStyle='#7b6a58'; c.fillRect(px-60,sy(PLAT),62,6); c.fillStyle='#5a4a3a'; c.fillRect(px-50,sy(PLAT)+6,6,PLAT*ppf); c.fillRect(px-12,sy(PLAT)+6,6,PLAT*ppf);
  c.fillStyle='#d8dde4'; c.fillRect(px-60,sy(PLAT)-12,62,2); for(let x=px-58;x<px;x+=10) c.fillRect(x,sy(PLAT)-12,1.6,12);
  // wind
  G.rrect(VW-94,48,86,26,8); c.fillStyle='rgba(11,11,12,.7)'; c.fill();
  G.txt(this.wind===0?'WIND CALM':(this.wind>0?'TAILWIND ':'HEADWIND ')+Math.abs(this.wind)+' KT',VW-51,53,5.6,C.ink,'center',undefined,800);
  if(this.wind){ const dir=this.wind>0?1:-1; c.strokeStyle='#5b9bff'; c.lineWidth=1.6; c.beginPath(); c.moveTo(VW-51-dir*16,67); c.lineTo(VW-51+dir*16,67); c.stroke(); c.beginPath(); c.moveTo(VW-51+dir*16,67); c.lineTo(VW-51+dir*11,64); c.moveTo(VW-51+dir*16,67); c.lineTo(VW-51+dir*11,70); c.stroke(); }
  // trail + plane
  c.strokeStyle='rgba(255,255,255,.5)'; c.setLineDash([2,3]); c.lineWidth=1; c.beginPath(); this.trail.forEach((p,i)=>i?c.lineTo(sx(p[0]),sy(p[1])):c.moveTo(sx(p[0]),sy(p[1]))); c.stroke(); c.setLineDash([]);
  const P=this.p||{x:0,y:PLAT,th:0}, X=sx(P.x), Y=sy(P.y)-2;
  c.save(); c.translate(X,Y); c.rotate(-P.th); c.fillStyle='#f8f8f6'; c.beginPath(); c.moveTo(9,0); c.lineTo(-8,-4); c.lineTo(-5,0); c.lineTo(-8,3); c.closePath(); c.fill(); c.strokeStyle='#9aa3ad'; c.lineWidth=.7; c.stroke(); c.beginPath(); c.moveTo(9,0); c.lineTo(-5,0); c.stroke(); c.restore();
  // aiming
  if(this.state==='aim'){ const L=this.launchPt(); if(this.aim) MG.aimLine(c,L.x,L.y,this.aim.dx,this.aim.dy,this.aim.power,90,C.accent);
   else G.txt('PULL BACK, AIM, AND LET GO',VW/2,gy-60,7,C.ink,'center',undefined,800); }
  if(this.msg) G.txt(this.msg,VW/2,92,7.4,this.stalled?C.bad:C.warn,'center',VW-20,800);
  if(this.state==='landed'){ G.rrect(30,110,VW-60,30,10); c.fillStyle='rgba(11,11,12,.8)'; c.fill(); G.txt(this.res,VW/2,117,8.6,C.title,'center',VW-70,800); }
  G.txt(this.bonus?'BONUS THROW':'THROW '+Math.min(3,this.throwN+1)+' OF 3',12,52,6,this.bonus?C.accentHi:C.ink,'left',undefined,800);
  MG.hud(this,c,this.total+' FT',{sub:'GLIDE OFF THE PLATFORM',tip:'Pull back from anywhere and let go. A gentle angle glides farthest; too steep and it stalls.'});
 }
};
})();
