/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* BAG TOSS (the Game Room): cornhole with a crosswind. Pull back and let go: pull farther for a longer toss, pull to the
   side to aim. The windsock shows the wind (a windsock is fully stretched out at about 15 knots), and the wind pushes
   the bag sideways, so aim a little INTO the wind, just like a crosswind landing.
   Board 27 ft away (front edge), 2 ft x 4 ft, 6-inch hole. In the hole: 3 points. On the board: 1. Three rounds of 4 bags.
   r7.4 LEARN FOR A RETRY: after the twelfth bag, a quick wind lesson and one question can earn one bonus bag, tossed in a new
   wind. It replaces your lowest-scoring bag only if it scores more (hfq_retry.js). */
(function(){
const H=G.HFQ, C=G.C, VW=G.VW, PI=Math.PI, MG=G.MG;
const BZ0=27, BZ1=31, BW=1, HOLE={x:0,z:30.25,r:.25}, GRAV=32.2;
const boardH=z=>.25+(z-BZ0)/(BZ1-BZ0)*.75;     // front edge 3 in high, back 12 in
G.scenes.g_bags={
 enter(a){ MG.start(this,'bags',a); this.round=0; this.bag=0; this.score=0; this.bags=[]; this.pts=[]; this.extra=null; this.sl={}; this.newRound(); this.state='aim'; },
 newRound(){ this.wind=(Math.random()<.5?-1:1)*(3+Math.round(Math.random()*9)); this.bags=[]; this.bag=0; },
 proj(x,y,z){ const f=VW*3.8, cz=z+5, hor=G.VH*.22; return [VW/2+f*x/cz, hor+f*(5-y)/cz*.62]; },
 update(dt){
  if(MG.update(this,dt)) return;
  if(this.state==='aim'){
   const s=MG.sling(this.sl,VW/2,G.VH-70,110,(x,y)=>y>G.VH*.45);
   this.aim=s.active?s:null;
   if(s.fired&&s.fired.dy<0){ /* pulled down = throw forward */ const pow=s.fired.power, side=Math.max(-1,Math.min(1,s.fired.dx/80));
    const v=22+pow*11, el=36*PI/180, dir=side*.14;
    this.b={x:0,y:3,z:0,vx:Math.sin(dir)*v*Math.cos(el),vy:Math.sin(el)*v,vz:Math.cos(dir)*v*Math.cos(el),spin:0,state:'air'}; this.state='fly'; AUDIO.sfx('throw'); }
  } else if(this.state==='fly'){
   const b=this.b, h=1/240; let left=Math.min(dt,.05);
   while(left>0){ const st=Math.min(h,left); left-=st;
    if(b.state==='air'){
     b.vx+=this.wind*.22*st; b.vy-=GRAV*st; b.x+=b.vx*st; b.y+=b.vy*st; b.z+=b.vz*st; b.spin+=st*8;
     const onBoard=b.z>=BZ0&&b.z<=BZ1&&Math.abs(b.x)<=BW;
     if(onBoard&&b.y<=boardH(b.z)){ b.y=boardH(b.z); b.state='slide'; b.vz*=.32; b.vx*=.3; AUDIO.sfx('board'); }
     else if(b.y<=0){ b.y=0; b.state='rest'; b.pts=0; AUDIO.sfx('bag'); }
    } else if(b.state==='slide'){
     b.z+=b.vz*st; b.x+=b.vx*st; b.vz*=Math.pow(.02,st); b.vx*=Math.pow(.02,st); b.y=boardH(Math.min(BZ1,b.z));
     if(Math.hypot(b.x-HOLE.x,b.z-HOLE.z)<HOLE.r+.06){ b.state='rest'; b.pts=3; b.inHole=1; AUDIO.sfx('hole'); }
     else if(b.z>BZ1||Math.abs(b.x)>BW){ b.state='rest'; b.pts=0; b.y=0; AUDIO.sfx('bag'); }
     else if(Math.abs(b.vz)<.4&&Math.abs(b.vx)<.4){ b.state='rest'; b.pts=1; }
    }
    if(b.state==='rest'){ this.bags.push(b); const X=this.extra;
     if(X){ X.pts=b.pts; if(b.pts>this.pts[X.i]){ X.better=1; this.pts[X.i]=b.pts; } } else this.pts.push(b.pts);   // the bonus bag only ever replaces the lowest one
     this.score=this.pts.reduce((a,v)=>a+v,0); this.flash={t:1,txt:(b.pts===3?'IN THE HOLE! +3':b.pts===1?'ON THE BOARD +1':'MISS')+(X?(X.better?' • IT COUNTS':' • NO CHANGE'):'')}; this.state='wait'; this.wt=0; break; }
   }
  } else if(this.state==='wait'){ this.wt+=dt; if(this.flash) this.flash.t-=dt;
   if(this.wt>.9){ if(this.extra) return this.end(); this.bag++; if(this.bag>=4){ this.round++; if(this.round>=3) return this.finish(); this.newRound(); this.flash={t:1.4,txt:'ROUND '+(this.round+1)+': NEW WIND'}; } this.state='aim'; } }
 },
 /* twelve bags in: offer the learn-for-a-retry (once per game; not after a perfect 36), else the results */
 finish(){ const lo=Math.min(...this.pts), i=this.pts.indexOf(lo); this.state='offer';
  if(lo<3&&MG.offerRetry(this,{title:'ONE MORE BAG?',what:'toss one bonus bag in a new wind. If it scores more than your lowest bag ('+(lo?lo+' POINT':'A MISS')+'), it takes its place',go:'TOSS IT!',tags:['wind'],
   onEarn:()=>{ this.extra={i,was:lo}; this.newRound(); this.bag=3; this.flash={t:1.4,txt:'BONUS BAG: NEW WIND'}; this.state='aim'; },onSkip:()=>this.end()})) return;
  this.end(); },
 end(){ const X=this.extra, extra=X&&X.pts!=null?(X.better?' Your bonus bag scored '+X.pts+' and replaced '+(X.was?'a '+X.was:'a miss')+'.':' Your bonus bag didn’t beat your lowest bag, so your score stays.'):'';
  this.state='over'; MG.end(this,this.score,{head:this.score>=20?'CORNHOLE ACE!':'GOOD TOSSING',line:'12 bags, '+this.score+' points.'+extra+' The wind pushes the bag: aim into it, like a crosswind landing.'}); },
 draw(c){
  const VH=G.VH, hor=VH*.22;
  // hangar floor in perspective
  { const wg=c.createLinearGradient(0,42,0,hor); wg.addColorStop(0,'#3e4652'); wg.addColorStop(1,'#59626f'); c.fillStyle=wg; c.fillRect(0,42,VW,hor-42); c.fillStyle='rgba(255,255,255,.05)'; for(let x=10;x<VW;x+=8) c.fillRect(x,50,2,hor-60); }
  MG.floor(c,0,hor,VW,VH-hor,'ramp');
  c.strokeStyle='rgba(0,0,0,.12)'; c.lineWidth=1; for(let z=0;z<40;z+=4){ const [x0,y0]=this.proj(-30,0,z), [x1]=this.proj(30,0,z); c.beginPath(); c.moveTo(x0,y0); c.lineTo(x1,y0); c.stroke(); }
  // the board
  const P=(x,y,z)=>this.proj(x,y,z), q=[P(-BW,.25,BZ0),P(BW,.25,BZ0),P(BW,1,BZ1),P(-BW,1,BZ1)];
  c.fillStyle='#3a2a20'; c.beginPath(); c.moveTo(...P(-BW,0,BZ0)); c.lineTo(...P(BW,0,BZ0)); c.lineTo(...q[1]); c.lineTo(...q[0]); c.closePath(); c.fill();
  { const bgd=c.createLinearGradient(0,q[0][1],0,q[2][1]); bgd.addColorStop(0,'#c9a26a'); bgd.addColorStop(1,'#8f6a3a'); c.fillStyle=bgd; c.beginPath(); q.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1])); c.closePath(); c.fill(); c.save(); c.clip(); c.strokeStyle='rgba(0,0,0,.12)'; c.lineWidth=1; for(let i=0;i<14;i++){ const yy=q[0][1]+(q[2][1]-q[0][1])*(i/14); c.beginPath(); c.moveTo(0,yy); c.lineTo(VW,yy+1.5); c.stroke(); } c.restore(); }
  // runway paint on the board: a center stripe + threshold bars
  c.fillStyle='#3a3d42'; c.beginPath(); [P(-.35,.25,BZ0),P(.35,.25,BZ0),P(.35,1,BZ1),P(-.35,1,BZ1)].forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1])); c.closePath(); c.fill();
  c.fillStyle='#f2f2f2'; for(let z=BZ0+.2;z<BZ1-.4;z+=.5){ const a=P(-.03,boardH(z),z), b=P(.03,boardH(z+.25),z+.25); c.fillRect(a[0],b[1],Math.max(1,b[0]-a[0]),a[1]-b[1]); }
  const hc=P(0,boardH(HOLE.z),HOLE.z), hr=P(HOLE.r,boardH(HOLE.z),HOLE.z)[0]-hc[0]; c.fillStyle='#0b0b0c'; c.beginPath(); c.ellipse(hc[0],hc[1],hr,hr*.45,0,0,PI*2); c.fill();
  // bags that landed (drawn back to front)
  const all=this.bags.concat(this.state==='fly'?[this.b]:[]).slice().sort((a,b)=>b.z-a.z);
  for(const b of all){ if(b.inHole) continue; const p=P(b.x,b.y,b.z), s=Math.max(2,(P(.25,0,b.z)[0]-P(0,0,b.z)[0]));
   if(b.state==='air'){ const sh=P(b.x,0,b.z); c.fillStyle='rgba(0,0,0,.2)'; c.beginPath(); c.ellipse(sh[0],sh[1],s,s*.35,0,0,PI*2); c.fill(); }
   c.save(); c.translate(p[0],p[1]); c.rotate(b.state==='air'?b.spin:0); c.fillStyle=this.bags.indexOf(b)%2?'#2f6fb5':'#c23a3a'; G.rrect(-s,-s*.55,s*2,s*1.1,s*.3); c.fill(); c.restore(); }
  // the windsock on a pole beside the board
  if(G.FIG) G.FIG.draw(c,{f:'sock',kts:Math.abs(this.wind),from:this.wind>0?'left':'right'},VW-110,hor-62,100,50);
  G.rrect(8,48,96,30,8); c.fillStyle='rgba(11,11,12,.72)'; c.fill();
  G.txt('WIND '+Math.abs(this.wind)+' KT',56,52,6.4,C.ink,'center',undefined,800); G.txt('PUSHING '+(this.wind>0?'RIGHT ▸':'◂ LEFT'),56,64,5.4,C.accentText,'center',undefined,800);
  // bags left this round
  for(let i=0;i<4;i++){ c.fillStyle=i<this.bag?'rgba(255,255,255,.12)':(i%2?'#2f6fb5':'#c23a3a'); G.rrect(VW/2-38+i*20,VH-26,14,9,3); c.fill(); }
  // aiming
  if(this.state==='aim'){ if(this.aim) MG.aimLine(c,VW/2,VH-70,this.aim.dx,this.aim.dy,this.aim.power,120,C.accent); else G.txt('PULL DOWN AND LET GO • SIDEWAYS TO AIM',VW/2,VH-60,6.4,C.ink,'center',VW-20,800); }
  if(this.flash&&this.flash.t>0) G.txt(this.flash.txt,VW/2,hor+30,10,this.flash.txt.indexOf('+3')>=0?C.good:C.title,'center',VW-20,800);
  MG.hud(this,c,this.score+' PTS',{sub:this.extra?'BONUS BAG • NEW WIND':'ROUND '+Math.min(3,this.round+1)+' OF 3 • BAG '+Math.min(4,this.bag+1)+' OF 4',tip:'Pull down to throw, sideways to aim. Read the windsock: aim into the wind.'});
 }
};
})();
