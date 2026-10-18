/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* HANGAR MINI GOLF (the Game Room): six holes laid out on the hangar floor. Pull back from anywhere and let go to putt.
   Hazards: a spinning propeller, hangar doors that slide open and shut, runway-light bumpers and a baggage cart.
   Lowest total strokes wins (8 strokes max per hole). */
(function(){
const H=G.HFQ, C=G.C, VW=G.VW, PI=Math.PI, MG=G.MG;
const BR=3.6, CUP=5.6;
/* each hole in a 240 x 380 box: walls (closed polygon), tee, cup, par, and extras */
const HOLES=[
 {name:'RUNWAY 1',par:2,poly:[[70,20],[170,20],[170,360],[70,360]],tee:[120,330],cup:[120,52],paint:'runway'},
 {name:'TAXIWAY BRAVO',par:3,poly:[[30,20],[120,20],[120,240],[210,240],[210,360],[30,360]],tee:[180,330],cup:[75,52],bends:1},
 {name:'THE PROPELLER',par:3,poly:[[60,20],[180,20],[180,360],[60,360]],tee:[120,334],cup:[120,46],prop:{x:120,y:190,r:52,w:1.4}},
 {name:'HANGAR DOORS',par:3,poly:[[40,20],[200,20],[200,360],[40,360]],tee:[120,334],cup:[120,46],door:{y:190,gap:44,span:[40,200],speed:.7}},
 {name:'RUNWAY LIGHTS',par:2,poly:[[40,20],[200,20],[200,360],[40,360]],tee:[120,334],cup:[120,50],bumpers:[[80,120],[160,120],[120,170],[80,220],[160,220],[120,270]]},
 {name:'BAGGAGE CART',par:3,poly:[[30,20],[210,20],[210,360],[30,360]],tee:[120,334],cup:[70,48],cart:{y:200,w:54,h:22,span:[30,210],speed:60}}
];
function segs(poly){ const s=[]; for(let i=0;i<poly.length;i++){ const a=poly[i], b=poly[(i+1)%poly.length]; s.push([a[0],a[1],b[0],b[1]]); } return s; }
function collideSeg(b,x0,y0,x1,y1,rest){ const dx=x1-x0, dy=y1-y0, L2=dx*dx+dy*dy||1; let t=((b.x-x0)*dx+(b.y-y0)*dy)/L2; t=Math.max(0,Math.min(1,t));
 const px=x0+dx*t, py=y0+dy*t, ex=b.x-px, ey=b.y-py, d=Math.hypot(ex,ey);
 if(d<BR&&d>0){ const nx=ex/d, ny=ey/d, vn=b.vx*nx+b.vy*ny; if(vn<0){ b.vx-=(1+rest)*vn*nx; b.vy-=(1+rest)*vn*ny; } b.x=px+nx*BR; b.y=py+ny*BR; return Math.abs(vn); } return 0; }
G.scenes.g_golf={
 enter(a){ MG.start(this,'golf',a); this.hi=0; this.strokes=[]; this.sl={}; this.load(); },
 load(){ const h=HOLES[this.hi]; this.h=h; this.ball={x:h.tee[0],y:h.tee[1],vx:0,vy:0}; this.n=0; this.state='aim'; this.ht=0; this.flash=null; },
 box(){ const VH=G.VH, top=48, s=Math.min((VW-12)/240,(VH-top-18)/380); return {s,ox:(VW-240*s)/2,oy:top+4}; },
 walls(){ const h=this.h, S=segs(h.poly); if(h.extra&&h.extra.block) S.push([...h.extra.block[0],...h.extra.block[1]]);
  if(h.door){ const d=h.door, mid=d.span[0]+(d.span[1]-d.span[0])/2+Math.sin(this.ht*d.speed)*((d.span[1]-d.span[0])/2-d.gap/2-6); S.push([d.span[0],d.y,mid-d.gap/2,d.y]); S.push([mid+d.gap/2,d.y,d.span[1],d.y]); this.doorMid=mid; }
  if(h.prop){ const p=h.prop, a=this.ht*p.w; for(const k of [0,PI]){ S.push([p.x,p.y,p.x+Math.cos(a+k)*p.r,p.y+Math.sin(a+k)*p.r]); } }
  if(h.cart){ const k=h.cart, x=k.span[0]+(k.span[1]-k.span[0]-k.w)*(Math.sin(this.ht*k.speed/90)+1)/2; this.cartX=x; S.push(...segs([[x,k.y],[x+k.w,k.y],[x+k.w,k.y+k.h],[x,k.y+k.h]])); }
  return S; },
 update(dt){
  if(MG.update(this,dt)) return;
  this.ht+=dt; const B=this.box(), b=this.ball, h=this.h;
  const toW=(x,y)=>[(x-B.ox)/B.s,(y-B.oy)/B.s];
  if(this.state==='aim'){
   const s=MG.sling(this.sl,0,0,90,(x,y)=>y>44);
   this.aim=s.active?s:null;
   if(s.fired){ const sp=60+s.fired.power*300, L=Math.hypot(s.fired.dx,s.fired.dy)||1; b.vx=s.fired.dx/L*sp; b.vy=s.fired.dy/L*sp; this.n++; this.state='roll'; AUDIO.sfx('putt'); }
  } else if(this.state==='roll'){
   const sub=6, st=Math.min(dt,.05)/sub;
   for(let i=0;i<sub;i++){
    b.x+=b.vx*st; b.y+=b.vy*st; const fr=Math.pow(.32,st); b.vx*=fr; b.vy*=fr;
    for(const w of this.walls()){ const hit=collideSeg(b,...w,.72); if(hit>40) AUDIO.sfx('wall'); }
    for(const p of h.bumpers||[]){ const dx=b.x-p[0], dy=b.y-p[1], d=Math.hypot(dx,dy); if(d<BR+5&&d>0){ const nx=dx/d, ny=dy/d, vn=b.vx*nx+b.vy*ny; if(vn<0){ b.vx-=1.9*vn*nx; b.vy-=1.9*vn*ny; AUDIO.sfx('clack'); } b.x=p[0]+nx*(BR+5); b.y=p[1]+ny*(BR+5); } }
    const cd=Math.hypot(b.x-h.cup[0],b.y-h.cup[1]), sp=Math.hypot(b.vx,b.vy);
    if(cd<CUP&&sp<150){ this.sink(); return; }
    if(cd<CUP*1.4&&sp<150){ b.vx+=(h.cup[0]-b.x)*st*30; b.vy+=(h.cup[1]-b.y)*st*30; }
   }
   if(Math.hypot(b.vx,b.vy)<5){ b.vx=b.vy=0; this.state='aim'; if(this.n>=8){ this.flash={t:1.4,txt:'PICK UP: 8 STROKES'}; this.strokes.push(8); this.state='holed'; this.wt=0; } }
  } else if(this.state==='holed'){ this.wt+=dt; if(this.flash) this.flash.t-=dt; if(this.wt>1.4){ this.hi++; if(this.hi>=HOLES.length) return this.finish(); this.load(); } }
 },
 sink(){ const h=this.h, d=this.n-h.par; this.strokes.push(this.n); this.state='holed'; this.wt=0;
  const name=this.n===1?'HOLE IN ONE!':d<=-2?'EAGLE!':d===-1?'BIRDIE!':d===0?'PAR':d===1?'BOGEY':'+'+d;
  this.flash={t:1.4,txt:name}; AUDIO.sfx('cup'); if(this.n===1) AUDIO.sfx('cheer'); },
 finish(){ const tot=this.strokes.reduce((a,b)=>a+b,0), par=HOLES.reduce((a,h)=>a+h.par,0);
  this.state='over'; MG.end(this,tot,{head:tot<=par?'UNDER PAR!':'ROUND COMPLETE',line:tot+' strokes on a par-'+par+' course ('+(tot-par>0?'+':'')+(tot-par)+').'}); },
 draw(c){
  const VH=G.VH, B=this.box(), h=this.h, s=B.s;
  MG.floor(c,0,42,VW,VH-42,'hangar');
  c.save(); c.translate(B.ox,B.oy); c.scale(s,s);
  // the green
  c.save(); c.shadowColor='rgba(0,0,0,.5)'; c.shadowBlur=10; c.shadowOffsetY=4; c.fillStyle='#3f8a3a'; c.beginPath(); h.poly.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1])); c.closePath(); c.fill(); c.restore();
  { const gg=c.createRadialGradient(120,200,20,120,200,260); gg.addColorStop(0,'#58a64a'); gg.addColorStop(1,'#2f6e2c'); c.fillStyle=gg; c.beginPath(); h.poly.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1])); c.closePath(); c.fill(); }
  c.save(); c.clip(); c.fillStyle='rgba(255,255,255,.04)'; for(let y=0;y<400;y+=20) c.fillRect(0,y,240,10);
  if(h.paint==='runway'){ c.fillStyle='rgba(58,61,66,.85)'; c.fillRect(96,24,48,332); c.fillStyle='#f2f2f2'; for(let y=60;y<320;y+=30) c.fillRect(119,y,2,16); for(let x=100;x<142;x+=6) c.fillRect(x,330,3,14); G.txt('1',120,300,14,'#f2f2f2','center',undefined,800); }
  if(h.bends){ c.strokeStyle='#ffc21a'; c.lineWidth=2.4; c.beginPath(); c.moveTo(180,350); c.lineTo(180,300); c.lineTo(75,300); c.lineTo(75,60); c.stroke(); }
  c.restore();
  c.strokeStyle='#5a3a24'; c.lineWidth=5; c.lineJoin='round'; c.beginPath(); h.poly.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1])); c.closePath(); c.stroke();
  if(h.extra&&h.extra.block){ c.beginPath(); c.moveTo(...h.extra.block[0]); c.lineTo(...h.extra.block[1]); c.stroke(); }
  // hazards
  if(h.door){ const d=h.door, mid=this.doorMid||((d.span[0]+d.span[1])/2); c.fillStyle='#9aa3ad'; c.fillRect(d.span[0],d.y-4,mid-d.gap/2-d.span[0],8); c.fillRect(mid+d.gap/2,d.y-4,d.span[1]-mid-d.gap/2,8); c.fillStyle='#ffc21a'; for(let x=d.span[0];x<d.span[1];x+=12){ if(x>mid-d.gap/2&&x<mid+d.gap/2) continue; c.fillRect(x,d.y-4,6,8); } }
  if(h.prop){ const p=h.prop, a=this.ht*p.w; c.save(); c.translate(p.x,p.y); c.rotate(a); c.fillStyle='#2a2d33'; c.beginPath(); c.ellipse(p.r/2,0,p.r/2,5,0,0,PI*2); c.fill(); c.beginPath(); c.ellipse(-p.r/2,0,p.r/2,5,0,0,PI*2); c.fill(); c.fillStyle='#ffc21a'; c.fillRect(p.r-6,-4,6,8); c.fillRect(-p.r,-4,6,8); c.restore(); c.fillStyle='#c23a3a'; c.beginPath(); c.arc(p.x,p.y,7,0,PI*2); c.fill(); }
  for(const p of h.bumpers||[]){ c.fillStyle='#3a3f48'; c.beginPath(); c.arc(p[0],p[1],5,0,PI*2); c.fill(); c.fillStyle=(Math.floor(this.ht*2)+p[0])%2?'#fffbe6':'#3d7bff'; c.beginPath(); c.arc(p[0],p[1],2.6,0,PI*2); c.fill(); }
  if(h.cart){ const k=h.cart, x=this.cartX||k.span[0]; c.fillStyle='#c23a3a'; G.rrect(x,k.y,k.w,k.h,4); c.fill(); c.fillStyle='#8a5a32'; c.fillRect(x+6,k.y+4,14,10); c.fillStyle='#2f6fb5'; c.fillRect(x+24,k.y+5,12,9); c.fillStyle='#1a1a1a'; c.fillRect(x+4,k.y+k.h-2,8,4); c.fillRect(x+k.w-12,k.y+k.h-2,8,4); }
  // cup + flag
  c.fillStyle='#0b0b0c'; c.beginPath(); c.arc(h.cup[0],h.cup[1],CUP,0,PI*2); c.fill(); c.fillStyle='#e9edf2'; c.fillRect(h.cup[0]-.8,h.cup[1]-26,1.6,26); c.fillStyle='#ff4a3d'; c.beginPath(); c.moveTo(h.cup[0]+.8,h.cup[1]-26); c.lineTo(h.cup[0]+12,h.cup[1]-22); c.lineTo(h.cup[0]+.8,h.cup[1]-18); c.fill();
  // tee + ball
  c.fillStyle='rgba(255,255,255,.25)'; c.fillRect(h.tee[0]-8,h.tee[1]-2,16,4);
  if(this.state!=='holed'||this.n>=8){ c.fillStyle='rgba(0,0,0,.25)'; c.beginPath(); c.arc(this.ball.x+1,this.ball.y+1.4,BR,0,PI*2); c.fill(); c.fillStyle='#f8f8f6'; c.beginPath(); c.arc(this.ball.x,this.ball.y,BR,0,PI*2); c.fill(); }
  c.restore();
  if(this.state==='aim'&&this.aim){ const bx=B.ox+this.ball.x*s, by=B.oy+this.ball.y*s; MG.aimLine(c,bx,by,this.aim.dx,this.aim.dy,this.aim.power,80,C.accent); }
  if(this.flash&&this.flash.t>0){ G.rrect(40,VH/2-20,VW-80,34,10); c.fillStyle='rgba(11,11,12,.82)'; c.fill(); G.txt(this.flash.txt,VW/2,VH/2-12,11,C.title,'center',VW-90,800); }
  const tot=this.strokes.reduce((a,b)=>a+b,0)+(this.state==='holed'?0:this.n);
  G.txt('HOLE '+(this.hi+1)+': '+h.name+' • PAR '+h.par,12,50,5.8,C.ink,'left',VW-24,800); G.txt('STROKE '+this.n,VW-12,50,5.8,C.accentHi,'right',undefined,800);
  MG.hud(this,c,tot+' STROKES',{sub:'HOLE '+Math.min(6,this.hi+1)+' OF 6',tip:'Pull back from anywhere and let go to putt. Time the propeller, the doors and the cart.'});
 }
};
})();
