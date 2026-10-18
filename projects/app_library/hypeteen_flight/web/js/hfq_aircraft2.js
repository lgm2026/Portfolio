/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* HYPETEEN FLIGHT ACADEMY - THE HALL OF FLIGHT: key aircraft from aviation history, drawn from the author's
   illustrated reference guide (Stage 1, 39 records; the Cessna 172 and PA-28 are already in the academy fleet).
   Cadets unlock each one by naming it in the PLANE SPOTTER game (Viewing Platform), then fly it as their avatar.
   House rules for these drawings: side views in the same 240 x 120 box as hfq_aircraft.js (nose right, wheels
   on y=104), simple shapes, gently animated (propellers, rotors, flames). NO national insignia, NO logos and
   NO weapons on any aircraft; military types are shown as aircraft, not as weapons.
   Each model: {id, name, cat, year, role, seats, paint, facts:[2], clue, draw(c,m,p,o,K)}.
   Facts are short and checkable; the clue is what a spotter looks for. */
(function(){
const H=G.HFQ, PI=Math.PI;
const K=H.acKit, {circ,poly,line,wheel,propDisc,shade,mark,OUT,GLASS,GLASS2,DARK,STEEL,PROP}=K;
const T=o=>(o&&o.t)||0;
/* ---------- little builders ---------- */
function path(c,pts,fill,stroke,lw){ c.beginPath(); pts.forEach((q,i)=>{ if(q.length===4) c.quadraticCurveTo(q[0],q[1],q[2],q[3]); else if(q.length===6) c.bezierCurveTo(...q); else if(i) c.lineTo(q[0],q[1]); else c.moveTo(q[0],q[1]); }); c.closePath(); if(fill){ c.fillStyle=fill; c.fill(); } if(stroke!==null){ c.strokeStyle=stroke||OUT; c.lineWidth=lw||.7; c.stroke(); } }
function rr(c,x,y,w,h,r){ r=Math.max(0,Math.min(r,w/2,h/2)); c.beginPath(); c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath(); }
/* a taildragger rests on its main wheels (center mx,my) and tailwheel (center tx,ty, radius r): find the nose-up angle */
function tdAngle(mx,my,tx,ty,r){ let a=0; for(;a>-.5;a-=.002){ if(my+(tx-mx)*Math.sin(a)+(ty-my)*Math.cos(a)+r>=104) break; } return a; }
function foil(c,xl,xt,y,th,col){ path(c,[[xl,y],[xl,y-th*.6,xl-8,y-th*.7],[xt,y-th*.2],[xt,y+th*.2],[xl-6,y+th*.5],[xl,y+th*.3,xl,y]],col); }   // a wing seen edge-on, leading edge at xl (right)
function gearLeg(c,x0,y0,x1,y1,r){ line(c,x0,y0,x1,y1,STEEL,1.8); wheel(c,x1,y1,r); }
function radialNose(c,x,y,r,col){ circ(c,x,y,r,shade(col,.85),OUT,.7); circ(c,x+1,y,r*.62,'#2a2d33'); for(let i=0;i<7;i++){ const a=i*PI*2/7; line(c,x+1,y,x+1+Math.cos(a)*r*.58,y+Math.sin(a)*r*.58,'#5d6672',.8); } }
function glassRow(c,x0,x1,y,n,col){ const dx=(x1-x0)/(n-1); for(let i=0;i<n;i++){ c.fillStyle=col||GLASS2; rr(c,x0+i*dx-1.6,y,3.2,4.2,1.4); c.fill(); } }
function canopyBubble(c,x0,x1,yb,hgt,tint){ path(c,[[x1,yb],[x1-2,yb-hgt,x0+(x1-x0)*.45,yb-hgt],[x0,yb-hgt*.4,x0-2,yb],[x0,yb+1],[x1,yb+1]],tint||GLASS,OUT,.6); c.fillStyle='rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(x0+(x1-x0)*.55,yb-hgt*.6,(x1-x0)*.18,hgt*.18,-.2,0,7); c.fill(); }
function pilotHead(c,x,y){ circ(c,x,y,3.4,'#6b4226'); c.fillStyle='#9fd6ff'; c.fillRect(x-1,y-2.4,3,1.6); }
function tilted(c,ang,px,py,fn){ c.save(); c.translate(px,py); c.rotate(ang); c.translate(-px,-py); fn(); c.restore(); }
function rotor(c,x,y,len,o,blades){ const t=T(o); if(o.prop==='spin'){ c.save(); c.translate(x,y); c.scale(1,.045); const g=c.createRadialGradient(0,0,len*.1,0,0,len); g.addColorStop(0,'rgba(225,230,238,.05)'); g.addColorStop(.7,'rgba(225,230,238,.18)'); g.addColorStop(.94,'rgba(240,244,250,.5)'); g.addColorStop(1,'rgba(240,244,250,0)'); c.fillStyle=g; c.beginPath(); c.arc(0,0,len,0,7); c.fill(); c.restore();
  for(let i=0;i<3;i++){ const k=Math.cos(t*28+i*PI/(blades||2)); line(c,x-len*k,y,x+len*k,y,'rgba(40,44,52,'+(.55-i*.15)+')',1.8-i*.4); } c.fillStyle='rgba(255,255,255,.8)'; c.fillRect(x-len-.5,y-.6,1.4,1.2); c.fillRect(x+len-.9,y-.6,1.4,1.2); }
 else { const g=c.createLinearGradient(0,y-2,0,y+2); g.addColorStop(0,'#3a3f48'); g.addColorStop(1,'#1b1d22'); c.strokeStyle=g; c.lineWidth=2.2; c.lineCap='round'; c.beginPath(); c.moveTo(x-len,y+1.5); c.lineTo(x+len,y-1.5); c.stroke(); c.fillStyle='#ffd24d'; c.fillRect(x-len,y+.6,3,1.4); c.fillRect(x+len-3,y-2,3,1.4); } circ(c,x,y,2.6,'#3a3f48'); circ(c,x-.6,y-.6,1,'#8d96a2'); }
function tailRotor(c,x,y,r,o){ if(o.prop==='spin'){ c.save(); c.globalAlpha=.3; circ(c,x,y,r,'#cfd6de'); c.restore(); const a=T(o)*30; line(c,x-Math.cos(a)*r,y-Math.sin(a)*r,x+Math.cos(a)*r,y+Math.sin(a)*r,'rgba(40,44,52,.6)',1.2); } else { line(c,x,y-r,x,y+r,PROP,1.6); line(c,x-r*.6,y,x+r*.6,y,PROP,1.2); } circ(c,x,y,1.6,'#3a3f48'); }
function jetGear(c,nx,mx,top,dy){ dy=dy||0; line(c,nx,top,nx,98-dy,STEEL,1.6); wheel(c,nx,99-dy,4.4); line(c,mx,top,mx,97-dy,STEEL,2); wheel(c,mx,98.5-dy,5.6); }

/* ============================ PIONEERS ============================ */
function wright(c,m,p,o){
 const wd=p.body, wood=p.stripe;
 // skids
 c.strokeStyle=wood; c.lineWidth=2.2; c.beginPath(); c.moveTo(60,102); c.lineTo(196,102); c.quadraticCurveTo(212,100,214,90); c.stroke();
 // the canard elevator out front on its booms
 line(c,170,78,208,52,wood,1.2); line(c,170,46,208,52,wood,1.2); foil(c,214,190,50,3,wd); foil(c,214,190,60,3,wd); line(c,200,50,200,60,wood,1);
 // wings + struts
 foil(c,152,86,40,4,wd); foil(c,152,86,78,4,wd); for(const x of [92,108,124,140]) line(c,x,41,x,77,wood,1);
 line(c,92,41,140,77,'rgba(80,60,40,.5)',.5); line(c,140,41,92,77,'rgba(80,60,40,.5)',.5);
 for(const x of [100,130]) line(c,x,80,x+4,102,wood,1.2);
 // the pilot lying on the lower wing + the engine
 c.fillStyle='#3a3f48'; rr(c,110,72,22,4,2); c.fill(); circ(c,132,72,2.6,'#e0b080'); c.fillStyle='#5d6672'; c.fillRect(116,66,9,6);
 // twin rudders behind, pusher propellers behind the wings
 line(c,86,46,26,52,wood,1.1); line(c,86,72,26,66,wood,1.1); poly(c,[[20,42],[30,42],[30,74],[20,74]],wd,OUT,.6); line(c,25,42,25,74,wood,.8);
 propDisc(c,78,59,17,o,2);
}
function bleriot(c,m,p,o){
 const b=p.body, w=p.stripe;
 // the open truss tail
 c.strokeStyle=w; c.lineWidth=1.3; c.beginPath(); c.moveTo(150,48); c.lineTo(44,56); c.moveTo(150,70); c.lineTo(44,62); c.stroke();
 c.lineWidth=.6; c.beginPath(); for(let x=56,k=0;x<150;x+=13,k++){ const yt=48+(150-x)/106*8, yb=70-(150-x)/106*8; c.moveTo(x,yt); c.lineTo(x+13,yb); c.moveTo(x,yt); c.lineTo(x,yb); } c.stroke();
 // tail surfaces
 poly(c,[[34,56],[62,57],[62,61],[34,61]],b,OUT,.6); path(c,[[44,58],[40,40,26,40],[22,52,28,66],[44,64]],b);
 // covered front + cockpit
 path(c,[[196,54],[204,56,204,64],[196,72],[150,70],[150,48]],b); pilotHead(c,152,44);
 // the wing, wires to the pylon above
 line(c,160,26,140,52,'rgba(60,60,60,.7)',.5); line(c,160,26,186,52,'rgba(60,60,60,.7)',.5); line(c,160,26,160,48,w,1.4);
 foil(c,190,134,52,3.4,shade(b,1.04));
 // landing gear frame + big bicycle wheels, tail skid
 line(c,186,70,178,94,w,1.5); line(c,166,70,178,94,w,1.5); circ(c,178,95,9,null,'#2a2a2a',2); circ(c,178,95,1.6,'#888'); for(let i=0;i<8;i++){ const a=i*PI/4; line(c,178,95,178+Math.cos(a)*8,95+Math.sin(a)*8,'#999',.4); }
 line(c,58,62,52,102,w,1.2);
 radialNose(c,202,62,6,'#8a8a8a'); propDisc(c,207,62,19,o,2);
}
function montgolfier(c,m,p,o){
 const b=p.body, g=p.stripe, t=T(o);
 c.save(); c.translate(0,o.fly?0:4);
 path(c,[[120,2],[160,2,168,40],[168,62,140,82],[134,88,130,93],[110,93],[106,88,100,82],[72,62,72,40],[80,2,120,2]],b,OUT,.9);
 c.save(); c.clip(); c.fillStyle=g; for(const y of [26,48,70]) c.fillRect(0,y,240,4); c.fillStyle=shade(b,1.25); for(let i=0;i<7;i++){ c.beginPath(); c.arc(80+i*13,37,2.6,0,7); c.fill(); c.beginPath(); c.arc(84+i*12,60,2.4,0,7); c.fill(); }
 c.fillStyle='rgba(255,255,255,.12)'; c.beginPath(); c.ellipse(100,30,14,22,-.3,0,7); c.fill(); c.restore();
 c.fillStyle=g; for(let x=86;x<156;x+=8){ c.beginPath(); c.moveTo(x,84); c.lineTo(x+4,90); c.lineTo(x+8,84); c.fill(); }
 // the gallery around the neck + the fire
 c.fillStyle='#7a5a34'; rr(c,100,94,40,8,3); c.fill(); c.strokeStyle='#5a3f22'; c.lineWidth=.6; for(let x=103;x<138;x+=4){ c.beginPath(); c.moveTo(x,94); c.lineTo(x,102); c.stroke(); }
 const f=G.rm()?0:Math.sin(t*14)*1.5; c.fillStyle='#ff8a1a'; c.beginPath(); c.moveTo(114,94); c.quadraticCurveTo(120,82+f,126,94); c.fill(); c.fillStyle='#ffd24d'; c.beginPath(); c.moveTo(117,94); c.quadraticCurveTo(120,87-f,123,94); c.fill();
 c.restore();
}
function hindenburg(c,m,p,o){
 const b=p.body, d=p.stripe, t=T(o); mark(c,120,26,'beacon'); mark(c,10,51,'strobe');
 // fins (cruciform)
 poly(c,[[54,34],[16,16],[10,20],[22,40]],shade(b,.9)); poly(c,[[54,68],[16,86],[10,82],[22,62]],shade(b,.9)); poly(c,[[60,49],[6,48],[6,54],[60,53]],shade(b,.82));
 // the envelope
 path(c,[[232,51],[232,30,190,26],[60,28],[12,38,8,51],[12,64,60,74],[190,76],[232,72,232,51]],b,OUT,.9);
 c.save(); c.clip(); const gr=c.createLinearGradient(0,26,0,76); gr.addColorStop(0,'rgba(255,255,255,.25)'); gr.addColorStop(.5,'rgba(0,0,0,0)'); gr.addColorStop(1,'rgba(0,0,0,.2)'); c.fillStyle=gr; c.fillRect(0,0,240,120);
 c.strokeStyle='rgba(60,66,76,.18)'; c.lineWidth=.6; for(let x=24;x<230;x+=12){ c.beginPath(); c.moveTo(x,20); c.lineTo(x,80); c.stroke(); } for(const y of [38,51,64]){ c.beginPath(); c.moveTo(0,y); c.lineTo(240,y); c.stroke(); }
 c.fillStyle='rgba(30,40,60,.55)'; for(let x=150;x<196;x+=5) c.fillRect(x,66,3,2.4); c.restore();
 // the control car + engine cars with pusher props
 path(c,[[188,74],[190,84,180,86],[164,86],[160,76]],shade(b,1.05)); glassRow(c,166,184,77,4,GLASS2);
 for(const ex of [110,74]){ path(c,[[ex+14,76],[ex+16,82,ex+8,82],[ex,82],[ex,77]],d); propDisc(c,ex-2,79,6,o,4); }
}

/* ============================ WORLD WAR I ============================ */
function biplane(c,m,p,o,cf){
 const b=p.body, s=p.stripe;
 tilted(c,tdAngle(160,95,40,74,0),160,95,()=>{
  // tail
  poly(c,[[30,58],[64,59],[64,63],[30,63]],shade(b,.9),OUT,.6);
  if(cf.rudder==='comma') path(c,[[44,60],[40,40,28,36],[18,40,22,58],[30,66,44,64]],s==='#f4f4f2'?b:shade(b,.85));
  else path(c,[[46,60],[44,40,32,36],[22,38,24,58],[28,66,46,64]],b);
  // fuselage
  const nx=cf.nose==='inline'?202:198;
  path(c,[[nx,50],[nx+2,62],[nx,72],[150,76],[44,64],[40,60],[44,56],[150,46]],b);
  c.save(); c.clip(); c.fillStyle=s; c.fillRect(120,58,40,3); c.restore();
  if(cf.hump) path(c,[[184,48],[178,40,168,41],[160,44],[160,48]],shade(b,.9));
  if(cf.nose==='inline'){ path(c,[[204,50],[208,51],[208,73],[204,74],[196,72],[196,50]],shade(b,.75)); c.fillStyle='#2a2d33'; for(let y=53;y<71;y+=3) c.fillRect(204,y,3,1.4); }
  else { path(c,[[196,48],[206,50,206,62],[206,74,196,76],[188,74],[188,48]],shade(b,.82)); }
  pilotHead(c,150,44); c.fillStyle='#2a2a2a'; rr(c,142,45,16,3,1.5); c.fill();
  // wings
  const up=cf.wings===3?28:34, low=74;
  if(cf.wings===3){ foil(c,178,138,up,4,shade(b,1.02)); foil(c,176,140,51,4,shade(b,1.02)); foil(c,174,142,low,4,shade(b,1.02)); line(c,150,30,150,72,s,1.4); line(c,166,30,166,72,s,1.4); foil(c,166,148,94,3,shade(b,.95)); }
  else { foil(c,182,124,up,4.4,shade(b,1.02)); foil(c,176,128,low,4.4,shade(b,1.02)); line(c,134,36,130,72,s,1.4); line(c,170,36,166,72,s,1.4); line(c,134,36,166,72,'rgba(40,40,40,.4)',.5); line(c,170,36,130,72,'rgba(40,40,40,.4)',.5); line(c,176,36,184,48,s,1.2); line(c,160,36,166,48,s,1.2); }
  // gear + tail skid
  line(c,170,76,160,92,s,1.6); line(c,150,74,160,92,s,1.6); wheel(c,160,95,8); line(c,46,64,40,74,s,1.3);
  propDisc(c,cf.nose==='inline'?211:208,62,21,o,2);
 });
}
const camel=(c,m,p,o)=>biplane(c,m,p,o,{wings:2,nose:'rotary',hump:1});
const dr1=(c,m,p,o)=>biplane(c,m,p,o,{wings:3,nose:'rotary',rudder:'comma'});
const spad=(c,m,p,o)=>biplane(c,m,p,o,{wings:2,nose:'inline'});

/* ============================ WORLD WAR II PROPS ============================ */
function fighter(c,m,p,o,cf){
 const b=p.body, s=p.stripe, deep=cf.deep?4:0; mark(c,30,28,'beacon');
 tilted(c,tdAngle(150,96,40,76,3),150,96,()=>{
  // tail
  poly(c,[[30,58],[62,58],[64,62],[30,63]],shade(b,.9),OUT,.6);
  path(c,[[56,56],[46,30,32,26],[20,26,22,52],[24,64,40,64]],b);
  // fuselage
  const N=cf.radial?204:214;
  path(c,[[N,56],[N-6,48-deep],[cf.canopyX+12,46-deep],[cf.hump?cf.canopyX-30:cf.canopyX-14,46-deep-(cf.hump?2:0)],[40,54],[30,58],[40,64],[120,76+deep],[180,72],[N-4,66]],b);
  c.save(); c.clip(); c.fillStyle=shade(b,.8); c.fillRect(0,70+deep,240,20); c.fillStyle=s; c.fillRect(0,66,240,3); if(cf.fabric){ c.strokeStyle='rgba(0,0,0,.14)'; c.lineWidth=.6; for(let x=50;x<cf.canopyX-24;x+=8){ c.beginPath(); c.moveTo(x,40); c.lineTo(x,80); c.stroke(); } } c.restore();
  if(cf.canopy==='long'){ path(c,[[cf.canopyX+16,48],[cf.canopyX+10,38,cf.canopyX-10,38],[cf.canopyX-40,39],[cf.canopyX-46,47]],GLASS); for(let x=cf.canopyX-36;x<cf.canopyX+10;x+=10) line(c,x,39,x,47,shade(b,.7),1); }
  else canopyBubble(c,cf.canopyX-16,cf.canopyX+12,47-deep,9);
  if(cf.radial) radialNose(c,N,58,11,b);
  else { if(cf.scoop) path(c,[[140,76],[136,82],[118,82],[116,76]],shade(b,.8)); c.fillStyle='#2a2d33'; for(let i=0;i<3;i++) c.fillRect(196-i*7,52,4,2); }
  foil(c,176,112,72+deep,5,shade(b,.95));
  // gear
  gearLeg(c,156,76,150,96,7); line(c,42,63,40,76,STEEL,1.2); wheel(c,40,76,3);
  c.fillStyle=s; c.beginPath(); c.ellipse(N+2,57,5,6,0,-PI/2,PI/2); c.fill();
  propDisc(c,N+6,57,cf.radial?22:24,o,cf.blades||3);
 });
}
const spitfire=(c,m,p,o)=>fighter(c,m,p,o,{canopyX:150,scoop:1});
const hurricane=(c,m,p,o)=>fighter(c,m,p,o,{canopyX:138,hump:1,deep:1,fabric:1});
const t6=(c,m,p,o)=>fighter(c,m,p,o,{canopyX:150,radial:1,canopy:'long',blades:2});

function bomber(c,m,p,o,cf){
 const b=p.body, s=p.stripe; mark(c,cf.tail==='twin'?26:26,cf.tail==='twin'?34:16,'beacon'); mark(c,18,57,'strobe');
 const draw=()=>{
  // tail
  if(cf.tail==='twin'){ poly(c,[[20,56],[60,56],[62,60],[20,61]],shade(b,.9),OUT,.6); c.fillStyle=b; c.beginPath(); c.ellipse(26,54,9,22,0,0,7); c.fill(); c.strokeStyle=OUT; c.lineWidth=.7; c.stroke(); }
  else if(cf.tail==='curve'){ path(c,[[120,46],[66,44,46,16],[36,10,26,14],[18,30,20,54]],b); poly(c,[[14,56],[52,57],[54,61],[14,61]],shade(b,.9),OUT,.6); }
  else { path(c,[[64,46],[40,14],[22,14],[22,52]],b); poly(c,[[12,54],[52,56],[54,60],[12,60]],shade(b,.9),OUT,.6); }
  // fuselage
  path(c,[[222,58],[220,46,204,44],[60,44],[20,54],[20,60],[60,72],[204,72],[222,70,222,58]],b);
  c.save(); c.clip(); if(s) { c.fillStyle=s; c.fillRect(0,cf.belly?64:60,240,cf.belly?20:2.4); } c.restore();
  if(cf.nose==='round'){ path(c,[[223,58],[222,46,206,45],[206,71],[222,70,223,58]],GLASS); for(const x of [210,215]) line(c,x,46,x,70,'rgba(40,50,70,.5)',.6); line(c,206,58,223,58,'rgba(40,50,70,.5)',.6); }
  else { path(c,[[224,60],[224,52,214,50],[212,64],[222,68]],GLASS); path(c,[[194,44],[190,36,176,36],[170,44]],GLASS); }
  glassRow(c,90,160,50,6,'rgba(30,40,60,.5)');
  // wing + engines (the near two show)
  foil(c,176,112,cf.wingY||64,6,shade(b,.94));
  for(const [ex,ey] of [[186,66],[164,62]]){ path(c,[[ex,ey-5],[ex+4,ey-5,ex+4,ey],[ex+4,ey+5,ex,ey+5],[ex-34,ey+3],[ex-34,ey-2]],shade(b,.9)); circ(c,ex+1,ey,4.6,'#2a2d33'); propDisc(c,ex+5,ey,14,o,3); }
  // gear
  if(cf.gear==='tri'){ line(c,200,72,200,98,STEEL,1.6); wheel(c,200,99,4.6); gearLeg(c,158,68,156,96,8); }
  else { gearLeg(c,162,68,160,95,9); line(c,38,60,36,76,STEEL,1.2); wheel(c,36,76,3.4); }
 };
 if(cf.gear==='tri') draw(); else tilted(c,tdAngle(160,95,36,76,3.4),160,95,draw);
}
const lancaster=(c,m,p,o)=>bomber(c,m,p,o,{tail:'twin',nose:'step',belly:1,wingY:60});
const b17=(c,m,p,o)=>bomber(c,m,p,o,{tail:'curve',nose:'step'});
const b29=(c,m,p,o)=>bomber(c,m,p,o,{tail:'tall',nose:'round',gear:'tri',wingY:62});

function dc3(c,m,p,o,mil){
 const b=p.body, s=p.stripe;
 tilted(c,tdAngle(170,95,40,74,3.2),170,95,()=>{
  path(c,[[90,44],[60,40,40,16],[24,16],[22,50]],b); poly(c,[[14,54],[54,56],[56,60],[14,61]],shade(b,.9),OUT,.6);
  path(c,[[222,60],[220,46,200,44],[70,44],[24,52],[22,58],[70,72],[200,73],[222,70,222,60]],b);
  c.save(); c.clip(); c.fillStyle=s; c.fillRect(0,mil?66:55,240,mil?20:3); if(!mil){ c.fillRect(0,59,240,1.2); } c.restore();
  path(c,[[220,52],[214,47],[204,47],[204,53]],GLASS2,null);
  if(mil){ c.strokeStyle=shade(b,.7); c.lineWidth=.8; c.strokeRect(62,50,18,18); line(c,71,50,71,68,shade(b,.7),.8); glassRow(c,96,176,52,5,GLASS2); }
  else glassRow(c,78,190,52,11,GLASS2);
  foil(c,174,112,72,6,shade(b,.94));
  const ex=190, ey=66; path(c,[[ex,ey-6],[ex+4,ey-6,ex+4,ey],[ex+4,ey+6,ex,ey+6],[ex-30,ey+4],[ex-30,ey-3]],shade(b,.92)); radialNose(c,ex+1,ey,6,b); propDisc(c,ex+5,ey,17,o,3);
  gearLeg(c,176,72,170,95,8.5); line(c,42,62,40,74,STEEL,1.2); wheel(c,40,74,3.2);
 });
}

/* ============================ AIRLINERS ============================ */
function jetliner(c,m,p,o,cf){
 const b=p.body, s=p.stripe, L=cf.len||1, X=x=>120+(x-120)*L;
 mark(c,X(cf.fin==='a320'?34:30),14,'beacon'); mark(c,X(16),57,'strobe'); mark(c,X(226),60,'strobe');
 // fin + stab
 if(cf.fin==='a320') path(c,[[X(70),48],[X(42),14],[X(26),14],[X(26),54]],s);
 else path(c,[[X(66),48],[X(38),12],[X(24),12],[X(24),54]],s);
 if(cf.probe) line(c,X(38),12,X(54),10,'#5d6672',1.2);
 poly(c,[[X(16),54],[X(54),56],[X(56),60],[X(18),60]],shade(b,.86),OUT,.6);
 // tube (+ the 747's hump)
 path(c,[[X(228),62],[X(228),47,X(208),45],[X(60),45],[X(26),46,X(14),56],[X(14),59],[X(40),72,X(70),73],[X(206),73],[X(228),72,X(228),62]],b);
 if(cf.hump) path(c,[[X(222),52],[X(214),36,X(190),36],[X(150),37],[X(140),45],[X(218),46]],b,null);
 c.save(); path(c,[[X(228),62],[X(228),47,X(208),45],[X(60),45],[X(26),46,X(14),56],[X(14),59],[X(40),72,X(70),73],[X(206),73],[X(228),72,X(228),62]],null,null); c.clip();
 const gr=c.createLinearGradient(0,45,0,73); gr.addColorStop(0,'rgba(255,255,255,.2)'); gr.addColorStop(1,'rgba(0,0,0,.18)'); c.fillStyle=gr; c.fillRect(0,0,240,120);
 c.fillStyle=s; c.fillRect(0,61,240,3); c.restore();
 if(cf.hump){ glassRow(c,X(156),X(208),41,6,GLASS2); path(c,[[X(222),50],[X(216),44],[X(208),43],[X(208),50]],GLASS2,null); }
 else path(c,[[X(224),53],[X(216),48],[X(208),48],[X(208),54]],GLASS2,null);
 glassRow(c,X(200),X(58),52,Math.round(22*L),GLASS2);
 // wing + engines
 poly(c,[[X(152),70],[X(108),70],[X(94),76],[X(148),75]],shade(b,.9),OUT,.6);
 if(cf.winglet) poly(c,[[X(100),73],[X(94),62],[X(91),62],[X(95),74]],s);
 const pods=cf.engines===4?[[X(150),75,11],[X(124),79,10]]:[[X(146),76,12]];
 for(const [ex,ey,r] of pods){ c.fillStyle=shade(b,.94); rr(c,ex-28,ey-r/2,30,r,r/2); c.fill(); c.strokeStyle=OUT; c.lineWidth=.6; c.stroke(); circ(c,ex,ey,r/2-1,'#3a3f48'); poly(c,[[ex-20,ey-r/2],[ex-10,ey-r/2],[ex-12,ey-r/2-3],[ex-22,ey-r/2-3]],shade(b,.85)); }
 line(c,X(204),73,X(204),98,STEEL,1.6); wheel(c,X(204),99,4.6); line(c,X(122),73,X(122),97,STEEL,2.2); wheel(c,X(118),99,5.2); wheel(c,X(127),99,5.2);
}
function concorde(c,m,p,o){
 const b=p.body, s=p.stripe; mark(c,28,16,'beacon'); mark(c,20,52,'strobe');
 path(c,[[70,46],[34,14],[20,14],[22,52]],b);
 c.fillStyle=s; c.fillRect(20,16,8,30);
 // long slim body with the nose drooped for landing
 path(c,[[206,52],[214,53],[234,60],[232,62],[210,60],[60,58],[18,56],[22,48],[60,46],[200,46]],b);
 path(c,[[206,52],[214,53],[234,60],[232,62],[210,60]],shade(b,.97));
 c.fillStyle=GLASS2; c.fillRect(200,47,6,3); glassRow(c,80,190,49,14,GLASS2); c.fillStyle=s; c.fillRect(40,53,170,1.4);
 // the delta wing and the engine boxes under it
 poly(c,[[170,58],[40,56],[30,64],[120,62]],shade(b,.92),OUT,.6);
 c.fillStyle=shade(b,.85); rr(c,44,62,62,10,3); c.fill(); c.strokeStyle=OUT; c.lineWidth=.6; c.stroke(); c.fillStyle='#2a2d33'; c.fillRect(104,63,3,8); c.fillRect(42,64,3,6);
 // tall gear
 line(c,190,60,190,98,STEEL,1.6); wheel(c,190,99,4.2); line(c,86,70,86,96,STEEL,2.2); wheel(c,82,98.5,5.2); wheel(c,91,98.5,5.2);
}

/* ============================ JETS ============================ */
function mig21(c,m,p,o){ const b=p.body, s=p.stripe; mark(c,36,16,'beacon'); c.save(); c.translate(0,10);
 path(c,[[70,46],[46,14],[34,14],[32,50]],b); poly(c,[[28,58],[52,58],[54,62],[28,62]],shade(b,.88),OUT,.6);
 path(c,[[212,50],[214,62],[212,70],[60,66],[26,62],[24,52],[60,48]],b);
 c.save(); c.clip(); c.fillStyle=shade(b,.82); c.fillRect(0,64,240,10); c.restore();
 circ(c,212,60,6,'#2a2d33'); path(c,[[224,60],[212,56],[212,64]],'#8d96a2');
 canopyBubble(c,162,188,49,7);
 poly(c,[[140,64],[70,62],[60,70],[96,68]],shade(b,.94),OUT,.6);
 c.fillStyle='#3a3f48'; c.fillRect(22,53,4,8); jetGear(c,192,110,66,10); c.restore(); }
function f4(c,m,p,o){ const b=p.body, s=p.stripe; mark(c,38,22,'beacon'); c.save(); c.translate(0,10);
 path(c,[[74,48],[52,20],[36,20],[34,52]],b); poly(c,[[26,58],[56,58],[56,62],[20,72],[18,70]],shade(b,.88),OUT,.6);
 path(c,[[224,60],[200,52],[150,46],[60,48],[26,54],[24,64],[60,68],[180,70],[204,66]],b);
 c.save(); c.clip(); c.fillStyle=shade(b,.82); c.fillRect(0,66,240,10); c.restore();
 path(c,[[184,49],[180,40,166,40],[148,40],[142,46]],GLASS); line(c,163,40,163,47,shade(b,.7),1.2);
 path(c,[[150,52],[150,66],[124,66],[124,54]],shade(b,.92)); c.fillStyle='#2a2d33'; c.fillRect(148,54,3,11);
 poly(c,[[140,66],[84,66],[74,72],[96,72],[80,64]],shade(b,.94),OUT,.6);
 c.fillStyle='#3a3f48'; c.fillRect(20,56,5,10); jetGear(c,196,118,68,10); c.restore(); }
function f16(c,m,p,o){ const b=p.body, s=p.stripe; mark(c,36,12,'beacon'); c.save(); c.translate(0,9);
 path(c,[[74,48],[46,10],[34,10],[34,52]],b); poly(c,[[26,58],[58,58],[58,62],[26,62]],shade(b,.88),OUT,.6);
 path(c,[[226,60],[204,54],[180,50],[100,50],[34,52],[30,60],[34,66],[100,68],[186,66],[204,64]],b);
 path(c,[[172,66],[166,76],[140,76],[138,68]],shade(b,.85)); c.fillStyle='#2a2d33'; c.fillRect(165,68,4,8);
 canopyBubble(c,166,198,51,9);
 poly(c,[[140,62],[82,60],[70,66],[110,66]],shade(b,.94),OUT,.6);
 c.fillStyle='#3a3f48'; circ(c,30,60,5,'#3a3f48'); jetGear(c,196,114,70,9); c.restore(); }
function f22(c,m,p,o,f35){ const b=p.body, s=p.stripe, tall=f35?3:0; mark(c,36,22+tall*2,'beacon'); c.save(); c.translate(0,9);
 path(c,[[78,50],[58,22+tall*2],[42,22+tall*2],[38,52]],shade(b,.92)); path(c,[[70,50],[50,20+tall*2],[34,20+tall*2],[30,52]],b);
 poly(c,[[24,58],[56,58],[58,62],[24,62]],shade(b,.88),OUT,.6);
 path(c,[[226,60],[200,54-tall],[160,48-tall],[90,48-tall],[36,52],[32,60],[36,66+tall],[120,70+tall],[200,66]],b);
 c.save(); c.clip(); c.fillStyle=shade(b,.85); c.fillRect(0,64+tall,240,12); c.restore();
 path(c,[[158,54-tall],[156,66+tall],[130,66+tall],[132,56-tall]],shade(b,.8));
 canopyBubble(c,162,194,50-tall,8,f35?'#9fb8d0':'#d8b64a');
 poly(c,[[150,62],[86,60],[74,68],[118,66]],shade(b,.94),OUT,.6);
 if(f35) circ(c,30,60,6,'#3a3f48'); else { c.fillStyle='#3a3f48'; c.fillRect(24,54,8,5); c.fillRect(24,61,8,5); }
 jetGear(c,198,116,70,9); c.restore(); }
function lightning(c,m,p,o){ const b=p.body, s=p.stripe; mark(c,34,16,'beacon'); c.save(); c.translate(0,6);
 path(c,[[70,40],[44,14],[32,14],[30,46]],b); poly(c,[[26,62],[58,60],[58,64],[26,66]],shade(b,.88),OUT,.6);
 path(c,[[214,46],[216,58],[214,68],[180,74],[60,74],[26,70],[24,42],[60,38],[180,38]],b);
 path(c,[[160,74],[150,88],[100,88],[92,74]],shade(b,.92));
 circ(c,214,57,10,'#2a2d33'); path(c,[[228,57],[214,51],[214,63]],'#8d96a2');
 canopyBubble(c,170,196,40,8);
 poly(c,[[140,58],[70,54],[52,64],[96,62]],shade(b,.94),OUT,.6);
 c.fillStyle='#3a3f48'; c.fillRect(19,46,6,9); c.fillRect(19,60,6,9); jetGear(c,192,108,76,6); c.restore(); }
function a10(c,m,p,o){ const b=p.body, s=p.stripe; mark(c,20,28,'beacon'); c.save(); c.translate(0,8);
 poly(c,[[16,52],[60,52],[60,56],[16,56]],shade(b,.88),OUT,.6); path(c,[[38,52],[30,26],[18,26],[18,72],[30,72]],b);
 path(c,[[214,60],[212,50,196,48],[90,50],[40,54],[38,60],[90,70],[196,70],[214,68]],b);
 c.save(); c.clip(); c.fillStyle=shade(b,.85); c.fillRect(0,64,240,10); c.restore();
 canopyBubble(c,178,200,50,9);
 // the engines on the back
 line(c,84,52,86,44,shade(b,.7),4); c.fillStyle=shade(b,.82); rr(c,60,30,50,16,8); c.fill(); c.strokeStyle=OUT; c.lineWidth=.8; c.stroke(); circ(c,109,38,6.4,'#2a2d33'); circ(c,109,38,2.4,'#8d96a2'); c.fillStyle='#3a3f48'; c.fillRect(58,33,4,10);
 poly(c,[[150,70],[104,70],[100,76],[148,76]],shade(b,.94),OUT,.6);
 c.fillStyle=shade(b,.9); rr(c,122,72,22,8,4); c.fill(); jetGear(c,200,132,70,8); c.restore(); }
function b1b(c,m,p,o){ const b=p.body, s=p.stripe; mark(c,20,12,'beacon'); c.save(); c.translate(0,8);
 path(c,[[60,46],[34,10],[18,10],[18,52]],b); poly(c,[[16,40],[50,40],[52,44],[16,44]],shade(b,.88),OUT,.6);
 path(c,[[232,62],[210,52],[150,48],[40,50],[14,54],[14,62],[60,68],[200,66]],b);
 path(c,[[200,51],[192,46],[182,47],[182,52]],GLASS2,null);
 poly(c,[[150,58],[90,58],[66,62],[120,62]],shade(b,.92),OUT,.6);
 for(const ex of [128,104]){ c.fillStyle=shade(b,.85); rr(c,ex-26,66,30,12,4); c.fill(); c.strokeStyle=OUT; c.lineWidth=.6; c.stroke(); c.fillStyle='#2a2d33'; c.fillRect(ex+2,68,2.4,8); }
 jetGear(c,196,110,78,8); c.restore(); }
function b2(c,m,p,o){ const b=p.body, s=p.stripe;   // the one top-down view: a flying wing has no side to show
 path(c,[[120,26],[232,72],[230,78],[198,72],[172,86],[146,74],[120,84],[94,74],[68,86],[42,72],[10,78],[8,72]],b,OUT,.9);
 c.save(); c.clip(); const gr=c.createLinearGradient(0,26,0,86); gr.addColorStop(0,'rgba(255,255,255,.14)'); gr.addColorStop(1,'rgba(0,0,0,.2)'); c.fillStyle=gr; c.fillRect(0,0,240,120); c.restore();
 path(c,[[120,32],[128,40],[124,44],[116,44],[112,40]],shade(b,1.4),null); path(c,[[112,44],[128,44],[136,60],[104,60]],shade(b,1.12),null);
 c.fillStyle='#1c1f24'; for(const x of [100,140]) { c.beginPath(); c.ellipse(x,56,6,2,x<120?-.35:.35,0,7); c.fill(); } }
function b52(c,m,p,o){ const b=p.body, s=p.stripe; mark(c,14,10,'beacon');
 path(c,[[48,46],[26,8],[12,8],[12,52]],b); poly(c,[[8,54],[46,56],[48,60],[8,60]],shade(b,.88),OUT,.6);
 path(c,[[230,60],[226,48,210,46],[40,46],[10,52],[10,60],[40,66],[210,68],[230,66]],b);
 path(c,[[222,52],[216,48],[206,48],[206,53]],GLASS2,null);
 poly(c,[[150,48],[90,48],[60,54],[120,52]],shade(b,.9),OUT,.6);
 for(const [ex,ey] of [[138,60],[108,64]]){ line(c,ex-12,52,ex-12,ey-2,shade(b,.8),2); for(const dy of [-3,3]){ c.fillStyle=shade(b,.93); rr(c,ex-24,ey+dy-3,26,6,3); c.fill(); c.strokeStyle=OUT; c.lineWidth=.5; c.stroke(); } }
 line(c,160,66,160,96,STEEL,2); wheel(c,156,98,5); wheel(c,165,98,5); line(c,84,66,84,96,STEEL,2); wheel(c,80,98,5); wheel(c,89,98,5);
 line(c,64,54,62,96,STEEL,1); wheel(c,62,99,3); }

/* ============================ ROTORCRAFT ============================ */
function uh60(c,m,p,o){ const b=p.body, s=p.stripe; mark(c,30,26,'beacon'); mark(c,150,40,'strobe');
 path(c,[[46,60],[36,24],[26,24],[30,64]],b); tailRotor(c,40,34,11,o); poly(c,[[40,62],[66,62],[66,65],[40,65]],shade(b,.85),OUT,.5);
 path(c,[[120,52],[44,58],[40,64],[120,72]],b);
 path(c,[[212,80],[214,66,200,58],[180,52],[118,50],[110,66],[112,84],[190,88],[208,88]],b);
 c.save(); c.clip(); c.fillStyle=shade(b,.82); c.fillRect(0,82,240,10); c.restore();
 path(c,[[212,74],[206,60],[192,58],[192,74]],GLASS,OUT,.6); poly(c,[[150,58],[132,58],[132,72],[150,72]],GLASS2,OUT,.5); c.strokeStyle=shade(b,.7); c.lineWidth=.8; c.strokeRect(156,56,26,26);
 c.fillStyle=shade(b,.9); rr(c,124,40,56,12,5); c.fill(); c.strokeStyle=OUT; c.lineWidth=.6; c.stroke(); line(c,150,40,150,30,'#5d6672',3);
 gearLeg(c,180,86,182,97,6); line(c,74,66,72,98,STEEL,1.2); wheel(c,72,99,3.4);
 rotor(c,150,30,86,o,4); }
function ah64(c,m,p,o){ const b=p.body, s=p.stripe; mark(c,30,28,'beacon');
 path(c,[[44,60],[36,26],[26,26],[28,64]],b); tailRotor(c,34,34,10,o); line(c,24,30,44,38,o.prop==='spin'?'rgba(0,0,0,0)':PROP,1.2); poly(c,[[28,68],[54,68],[54,71],[28,71]],shade(b,.85),OUT,.5);
 path(c,[[120,56],[42,58],[40,64],[120,70]],b);
 path(c,[[210,70],[204,60],[186,50],[160,42],[132,46],[116,56],[118,74],[180,78],[206,76]],b);
 path(c,[[206,62],[198,52],[186,52],[186,62]],GLASS,OUT,.5); path(c,[[182,52],[176,42],[162,42],[160,52]],GLASS,OUT,.5);
 circ(c,214,70,6,'#2a2d33'); circ(c,214,70,3,'#5d6672');
 c.fillStyle=shade(b,.88); rr(c,124,46,32,12,5); c.fill(); poly(c,[[160,64],[130,64],[128,68],[158,68]],shade(b,.9),OUT,.5);
 line(c,142,42,142,28,'#5d6672',2.6);
 gearLeg(c,176,76,178,97,5.6); line(c,44,64,44,98,STEEL,1.2); wheel(c,44,99,3.2);
 rotor(c,142,28,86,o,4); }
function b206(c,m,p,o){ const b=p.body, s=p.stripe; mark(c,34,42,'beacon'); mark(c,140,44,'strobe');
 line(c,112,104,196,104,STEEL,2); c.beginPath(); c.moveTo(196,104); c.quadraticCurveTo(204,104,204,99); c.strokeStyle=STEEL; c.lineWidth=2; c.stroke(); line(c,130,104,134,88,STEEL,1.6); line(c,180,104,176,88,STEEL,1.6);
 line(c,138,62,40,60,shade(b,.95),4); poly(c,[[44,58],[34,40],[30,40],[34,62]],b,OUT,.6); poly(c,[[38,62],[32,72],[36,74],[42,62]],b,OUT,.6); poly(c,[[64,58],[82,58],[82,62],[64,62]],shade(b,.85),OUT,.5); tailRotor(c,36,50,9,o);
 path(c,[[206,78],[206,58,182,52],[146,50],[136,58],[134,84],[160,90],[196,90]],b);
 c.save(); c.clip(); c.fillStyle=s; c.fillRect(120,78,100,4); c.restore();
 path(c,[[204,74],[200,58],[184,55],[180,74]],GLASS,OUT,.6); poly(c,[[174,57],[156,56],[156,72],[174,72]],GLASS2,OUT,.5);
 c.fillStyle=shade(b,.9); rr(c,132,44,34,9,4); c.fill(); line(c,150,44,150,38,'#5d6672',2.6);
 rotor(c,150,38,80,o,2); }
function cierva(c,m,p,o){ const b=p.body, s=p.stripe; const a=tdAngle(170,95,60,78,3);
 tilted(c,a,170,95,()=>{
  poly(c,[[46,58],[82,58],[82,62],[46,62]],shade(b,.9),OUT,.6); poly(c,[[46,56],[40,50],[44,50],[50,58]],shade(b,.9)); path(c,[[60,58],[54,40,44,40],[40,56],[44,64]],b);
  path(c,[[196,52],[200,62],[196,72],[150,74],[56,64],[52,60],[56,56],[150,48]],b);
  c.save(); c.clip(); c.fillStyle=s; c.fillRect(0,60,240,3); c.restore();
  pilotHead(c,148,44); pilotHead(c,124,46);
  line(c,138,48,140,24,STEEL,1.6); line(c,154,48,140,24,STEEL,1.6); line(c,128,50,140,24,STEEL,1.2);
  radialNose(c,198,62,10,b); propDisc(c,204,62,18,o,2);
  gearLeg(c,176,72,170,95,7.5); line(c,60,63,60,78,STEEL,1.2); wheel(c,60,78,3);
  rotor(c,140,22,88,o,3);
 }); }

/* ============================ TRAINERS + GLIDER ============================ */
function pc21(c,m,p,o){ K.plane(c,{g:{wing:'low',gear:'tri',fin:'swept3',engine:'turbo',canopy:'bubble',len:1.08,slim:1,blades:5}},p,o); }
function ask21(c,m,p,o){ const b=p.body, s=p.stripe;
 path(c,[[60,54],[40,20],[28,20],[26,56]],b); poly(c,[[18,20],[56,20],[56,23],[18,23]],shade(b,.9),OUT,.6); c.fillStyle=s; c.fillRect(24,20,10,3);
 path(c,[[214,64],[212,52,190,50],[150,48],[40,54],[24,58],[40,62],[150,74],[200,74],[214,72,214,64]],b);
 c.save(); c.clip(); c.fillStyle=s; c.fillRect(200,0,40,120); c.restore();
 path(c,[[200,56],[188,46],[150,46],[144,56]],GLASS,OUT,.6); line(c,170,46,170,56,b,1.4);
 c.fillStyle='rgba(230,234,240,.95)'; c.beginPath(); c.moveTo(150,60); c.lineTo(234,48); c.lineTo(236,51); c.lineTo(112,62); c.closePath(); c.fill(); c.strokeStyle=OUT; c.lineWidth=.5; c.stroke(); c.fillStyle=s; c.fillRect(226,48,8,3);
 c.beginPath(); c.moveTo(140,60); c.lineTo(6,48); c.lineTo(4,51); c.lineTo(112,62); c.closePath(); c.fillStyle='rgba(205,211,218,.9)'; c.fill(); c.stroke();
 wheel(c,150,80,7); wheel(c,196,78,4); line(c,40,60,40,66,'#3a3f48',2); }

/* ============================ UNCREWED ============================ */
function mq1(c,m,p,o){ const b=p.body, s=p.stripe;
 poly(c,[[64,58],[30,86],[24,84],[54,58]],shade(b,.9),OUT,.6); poly(c,[[56,56],[36,42],[32,44],[50,58]],shade(b,.85),OUT,.5);
 path(c,[[214,58],[212,44,192,42],[180,50],[60,54],[52,58],[60,62],[180,66],[208,68]],b);
 c.save(); c.clip(); c.fillStyle=shade(b,.85); c.fillRect(0,62,240,10); c.restore();
 circ(c,194,72,5,'#3a3f48'); circ(c,196,72,2,'#7fb2e0');
 c.fillStyle='rgba(230,234,240,.92)'; c.beginPath(); c.moveTo(146,54); c.lineTo(232,46); c.lineTo(232,49); c.lineTo(120,56); c.closePath(); c.fill(); c.strokeStyle=OUT; c.lineWidth=.5; c.stroke();
 c.beginPath(); c.moveTo(136,56); c.lineTo(8,50); c.lineTo(8,53); c.lineTo(120,58); c.closePath(); c.fillStyle='rgba(205,211,218,.88)'; c.fill(); c.stroke();
 propDisc(c,48,58,14,o,3); line(c,196,66,196,97,STEEL,1.2); wheel(c,196,98.5,3.4); line(c,132,62,140,97,STEEL,1.2); wheel(c,140,98.5,4); }
function tb2(c,m,p,o){ const b=p.body, s=p.stripe;
 line(c,140,58,40,56,shade(b,.9),2.6); poly(c,[[46,56],[28,76],[24,74],[38,55]],shade(b,.9),OUT,.6); poly(c,[[46,55],[30,40],[26,42],[38,56]],shade(b,.85),OUT,.5);
 path(c,[[214,60],[212,48,196,46],[110,48],[94,56],[110,66],[196,68],[212,68]],b);
 circ(c,192,72,4.4,'#3a3f48'); circ(c,193,72,1.8,'#7fb2e0');
 c.fillStyle='rgba(230,234,240,.92)'; c.beginPath(); c.moveTo(160,52); c.lineTo(234,44); c.lineTo(234,47); c.lineTo(130,54); c.closePath(); c.fill(); c.strokeStyle=OUT; c.lineWidth=.5; c.stroke();
 c.beginPath(); c.moveTo(150,54); c.lineTo(6,46); c.lineTo(6,49); c.lineTo(130,56); c.closePath(); c.fillStyle='rgba(205,211,218,.88)'; c.fill(); c.stroke();
 propDisc(c,90,57,13,o,2); line(c,196,66,196,97,STEEL,1.2); wheel(c,196,98.5,3.4); line(c,140,60,146,97,STEEL,1.2); wheel(c,146,98.5,4); }

/* ============================ THE HALL ============================ */
const P=(body,stripe)=>({body,stripe});
H.HALL=[
 {id:'wright',name:'WRIGHT FLYER',cat:'PIONEERS',year:1903,role:'FIRST AIRPLANE',seats:1,paint:P('#e8dcc0','#8a6a3a'),draw:wright,
  facts:['On December 17, 1903, at Kitty Hawk, North Carolina, it made the first controlled, powered airplane flights.','The very first flight lasted 12 seconds and covered 120 feet.'],clue:'Two long wings, a little elevator out in FRONT, and propellers behind the wings.'},
 {id:'bleriot',name:'BLÉRIOT XI',cat:'PIONEERS',year:1909,role:'EARLY MONOPLANE',seats:1,paint:P('#e0cf9e','#7a5a34'),draw:bleriot,
  facts:['In 1909 Louis Blériot flew one across the English Channel, the first airplane to do it.','Its tail section is an open frame of wood and wire.'],clue:'One wing, an open skeleton for a tail, and bicycle-style wheels.'},
 {id:'montgolfier',name:'MONTGOLFIER BALLOON',cat:'LIGHTER THAN AIR',year:1783,role:'HOT-AIR BALLOON',seats:2,paint:P('#2f4f9a','#d9a520'),draw:montgolfier,
  facts:['In 1783 a Montgolfier hot-air balloon carried the first people into the sky.','It floats because hot air is lighter than the cooler air around it.'],clue:'A huge decorated balloon and no wings at all.'},
 {id:'hindenburg',name:'LZ 129 HINDENBURG',cat:'LIGHTER THAN AIR',year:1936,role:'RIGID AIRSHIP',seats:50,paint:P('#c9ced6','#8d96a2'),draw:hindenburg,
  facts:['One of the largest aircraft ever built: longer than three Boeing 747s end to end.','It carried passengers across the Atlantic in 1936. A fire destroyed it in 1937.'],clue:'A giant silver cigar shape with fins at the back and no wings.'},
 {id:'camel',name:'SOPWITH CAMEL',cat:'WORLD WAR I',year:1916,role:'BIPLANE FIGHTER',seats:1,paint:P('#6b6a3a','#e8dcb0'),draw:camel,
  facts:['A famous British biplane from World War I.','It was named for the hump on its back, just in front of the cockpit.'],clue:'Two wings, a round engine cowl and a hump in front of the pilot.'},
 {id:'dr1',name:'FOKKER DR.I',cat:'WORLD WAR I',year:1917,role:'TRIPLANE FIGHTER',seats:1,paint:P('#c8261e','#8a1a14'),draw:dr1,
  facts:['A triplane: three wings stacked one above the other.','The famous "Red Baron," Manfred von Richthofen, flew an all-red one.'],clue:'THREE wings stacked up.'},
 {id:'spad',name:'SPAD S.XIII',cat:'WORLD WAR I',year:1917,role:'BIPLANE FIGHTER',seats:1,paint:P('#b49a6a','#5a6a3a'),draw:spad,
  facts:['A tough, fast French biplane from World War I.','Many American pilots flew it, including Eddie Rickenbacker.'],clue:'Two wings and a flat, square radiator on the nose.'},
 {id:'spitfire',name:'SUPERMARINE SPITFIRE',cat:'WORLD WAR II',year:1936,role:'FIGHTER',seats:1,paint:P('#5f6b4a','#b8b49a'),draw:spitfire,
  facts:['A British fighter famous for its curved, oval-shaped wings.','It helped defend Britain in 1940.'],clue:'A long pointed nose, a curvy tail fin and a teardrop canopy.'},
 {id:'hurricane',name:'HAWKER HURRICANE',cat:'WORLD WAR II',year:1935,role:'FIGHTER',seats:1,paint:P('#6a6040','#a9a98f'),draw:hurricane,
  facts:['In 1940 there were more Hurricanes than Spitfires defending Britain.','Early ones had a back half covered in fabric.'],clue:'Like a Spitfire, but chunkier, with a humped back.'},
 {id:'lancaster',name:'AVRO LANCASTER',cat:'WORLD WAR II',year:1941,role:'HEAVY BOMBER',seats:7,paint:P('#3d4a33','#1a1a1a'),draw:lancaster,
  facts:['A big four-engine British bomber from World War II.','A few are still flying today at air shows.'],clue:'Four engines and TWO oval tail fins.'},
 {id:'b17',name:'BOEING B-17 FLYING FORTRESS',cat:'WORLD WAR II',year:1935,role:'HEAVY BOMBER',seats:10,paint:P('#6b6a45','#9aa0a8'),draw:b17,
  facts:['Four engines and a crew of ten.','Its huge tail fin curves up from halfway along its back.'],clue:'Four engines and one giant curved tail fin.'},
 {id:'b29',name:'BOEING B-29 SUPERFORTRESS',cat:'WORLD WAR II',year:1942,role:'HEAVY BOMBER',seats:11,paint:P('#c9ced6','#3a3f48'),draw:b29,
  facts:['One of the first airplanes with pressurized crew cabins, so the crew could fly high without oxygen masks.','Its rounded glass nose has no step for the cockpit.'],clue:'Four engines, shiny silver, and a round glass nose.'},
 {id:'c47',name:'DOUGLAS C-47 SKYTRAIN',cat:'WORLD WAR II',year:1941,role:'TRANSPORT',seats:28,paint:P('#6b6a45','#9aa0a8'),draw:(c,m,p,o)=>dc3(c,m,p,o,true),
  facts:['The military version of the DC-3. It carried troops, cargo and paratroopers.','Some are still flying today, more than 80 years later.'],clue:'Two round engines, a tailwheel and a big cargo door.'},
 {id:'dc3',name:'DOUGLAS DC-3',cat:'AIRLINERS',year:1935,role:'AIRLINER',seats:28,paint:P('#c9ced6','#c23a3a'),draw:(c,m,p,o)=>dc3(c,m,p,o,false),
  facts:['The airliner that made flying popular in the 1930s.','It was one of the first airliners that could make money just by carrying passengers.'],clue:'Two round engines, a tailwheel and a row of passenger windows.'},
 {id:'b707',name:'BOEING 707',cat:'AIRLINERS',year:1957,role:'JET AIRLINER',seats:180,paint:P('#f4f4f2','#2f6fb5'),draw:(c,m,p,o)=>jetliner(c,m,p,o,{engines:4,probe:1,len:1.02}),
  facts:['Boeing’s first jet airliner. It helped start the Jet Age for travelers in 1958.','A thin antenna sticks forward from the top of its tail.'],clue:'Four jet engines hanging under swept wings, and a spike on the tail.'},
 {id:'b747',name:'BOEING 747',cat:'AIRLINERS',year:1969,role:'JUMBO JET',seats:400,paint:P('#f4f4f2','#c23a3a'),draw:(c,m,p,o)=>jetliner(c,m,p,o,{engines:4,hump:1,len:1.04}),
  facts:['The original jumbo jet, first flown in 1969.','The hump on top holds an upper deck.'],clue:'A hump on top of the front, and four engines.'},
 {id:'a320',name:'AIRBUS A320',cat:'AIRLINERS',year:1987,role:'AIRLINER',seats:170,paint:P('#f4f4f2','#1f3a6a'),draw:(c,m,p,o)=>jetliner(c,m,p,o,{engines:2,fin:'a320',winglet:1,len:.98}),
  facts:['One of the best-selling airliners ever, built by the European company Airbus.','It was the first airliner flown with a side-stick and computer “fly-by-wire” controls.'],clue:'Two engines, a rounded nose, and wingtips that turn up.'},
 {id:'concorde',name:'CONCORDE',cat:'AIRLINERS',year:1969,role:'SUPERSONIC AIRLINER',seats:100,paint:P('#f8f8f6','#1f3a6a'),draw:concorde,
  facts:['A supersonic airliner that cruised at about twice the speed of sound.','Its nose drooped down for takeoff and landing so the pilots could see the runway.'],clue:'A needle nose, a triangle wing, and no tail wings.'},
 {id:'mig21',name:'MIKOYAN-GUREVICH MIG-21',cat:'JETS',year:1955,role:'JET FIGHTER',seats:1,paint:P('#9aa3ad','#5a6370'),draw:mig21,
  facts:['More were built than any other supersonic jet.','Air goes in through a round intake right in its nose.'],clue:'A round intake in the nose with a cone inside, and a triangle wing.'},
 {id:'f4',name:'MCDONNELL DOUGLAS F-4 PHANTOM II',cat:'JETS',year:1958,role:'JET FIGHTER',seats:2,paint:P('#8a939c','#5a6370'),draw:f4,
  facts:['A big two-seat jet flown by the U.S. Navy, Air Force and Marines.','Its tail wings tilt down and its wingtips tilt up.'],clue:'Two seats, droopy tail wings and upturned wingtips.'},
 {id:'f16',name:'GENERAL DYNAMICS F-16',cat:'JETS',year:1974,role:'JET FIGHTER',seats:1,paint:P('#9aa3ad','#6f7882'),draw:f16,
  facts:['Nicknamed the Viper, it is one of the most common jet fighters in the world.','Its air intake sits under the cockpit like an open mouth.'],clue:'One tall fin and a big intake under the cockpit.'},
 {id:'f22',name:'LOCKHEED MARTIN F-22 RAPTOR',cat:'JETS',year:1997,role:'STEALTH FIGHTER',seats:1,paint:P('#6f7882','#4f5862'),draw:(c,m,p,o)=>f22(c,m,p,o,false),
  facts:['A stealth fighter: its shape helps it hide from radar.','Its engine nozzles tilt up and down to help it turn.'],clue:'Sharp angles, two slanted tail fins, flat exhausts and a gold-tinted canopy.'},
 {id:'f35',name:'LOCKHEED MARTIN F-35',cat:'JETS',year:2006,role:'STEALTH FIGHTER',seats:1,paint:P('#6a737c','#4a535c'),draw:(c,m,p,o)=>f22(c,m,p,o,true),
  facts:['A stealth fighter built in three versions. One can take off from a short runway and land straight down.','It is flown by many countries.'],clue:'Like an F-22 but chunkier, with ONE round exhaust.'},
 {id:'lightning',name:'ENGLISH ELECTRIC LIGHTNING',cat:'JETS',year:1954,role:'JET INTERCEPTOR',seats:1,paint:P('#c9ced6','#3a3f48'),draw:lightning,
  facts:['A British jet with its two engines stacked one on top of the other.','It could climb incredibly fast.'],clue:'A tall, skinny body, a round nose intake and two exhausts, one above the other.'},
 {id:'a10',name:'FAIRCHILD REPUBLIC A-10',cat:'JETS',year:1972,role:'JET',seats:1,paint:P('#7f878f','#5d656d'),draw:a10,
  facts:['Nicknamed the Warthog, it is built to be extremely tough.','Its two engines sit high on its back, and it has two tail fins.'],clue:'Two engine pods on its back, straight wings and two tail fins.'},
 {id:'b1b',name:'ROCKWELL B-1B LANCER',cat:'JETS',year:1984,role:'JET BOMBER',seats:4,paint:P('#5a6168','#3a4148'),draw:b1b,
  facts:['Its wings swing forward for takeoff and sweep back for speed.','Nicknamed the “Bone,” from B-One.'],clue:'Long and slim, with wings that swing back.'},
 {id:'b2',name:'NORTHROP B-2 SPIRIT',cat:'JETS',year:1989,role:'STEALTH BOMBER',seats:2,paint:P('#4a4f56','#2e3238'),draw:b2,
  facts:['Shaped like one giant wing, with no tail at all.','Its zigzag back edge helps it hide from radar.'],clue:'One huge wing, no tail and a zigzag back edge.'},
 {id:'b52',name:'BOEING B-52 STRATOFORTRESS',cat:'JETS',year:1952,role:'JET BOMBER',seats:5,paint:P('#8a929a','#5d656d'),draw:b52,
  facts:['Eight jet engines, in four pairs under the wings.','It first flew in 1952 and is still flying today.'],clue:'Very long, eight engines, and little wheels near the wingtips.'},
 {id:'uh60',name:'SIKORSKY UH-60 BLACK HAWK',cat:'ROTORCRAFT',year:1974,role:'HELICOPTER',seats:13,paint:P('#3f4436','#2a2d26'),draw:uh60,
  facts:['Flown by the U.S. Army to carry soldiers and cargo and for rescues.','Its tail rotor is tilted so it helps lift the tail.'],clue:'Four rotor blades, wheels instead of skids, and a tilted tail rotor.'},
 {id:'ah64',name:'BOEING AH-64 APACHE',cat:'ROTORCRAFT',year:1975,role:'HELICOPTER',seats:2,paint:P('#4a4f3a','#2f3326'),draw:ah64,
  facts:['The two pilots sit one behind the other in stepped cockpits.','A sensor in its nose lets the crew see in the dark.'],clue:'A skinny body, two stepped cockpits and short stub wings.'},
 {id:'b206',name:'BELL 206 JETRANGER',cat:'ROTORCRAFT',year:1962,role:'LIGHT HELICOPTER',seats:5,paint:P('#f4f4f2','#2f6fb5'),draw:b206,
  facts:['A light helicopter used for news, police work, tours and training.','Its main rotor has just two blades.'],clue:'Two rotor blades, skids and a teardrop-shaped cabin.'},
 {id:'cierva',name:'CIERVA C.30',cat:'ROTORCRAFT',year:1933,role:'AUTOGYRO',seats:2,paint:P('#c9ced6','#1f3a6a'),draw:cierva,
  facts:['An autogyro: its rotor spins freely in the passing air while a normal propeller pulls it forward.','Autogyros flew years before practical helicopters.'],clue:'A rotor on top AND a propeller on the nose.'},
 {id:'pc21',name:'PILATUS PC-21',cat:'TRAINERS',year:2002,role:'MILITARY TRAINER',seats:2,paint:P('#f4f4f2','#c8102e'),draw:pc21,
  facts:['A modern Swiss trainer that teaches military pilots before they move on to jets.','Its cockpit screens work like a fighter jet’s.'],clue:'A low wing, a long bubble canopy and a five-blade propeller.'},
 {id:'t6',name:'NORTH AMERICAN T-6 TEXAN',cat:'TRAINERS',year:1935,role:'CLASSIC TRAINER',seats:2,paint:P('#f6c21c','#1f3a6a'),draw:t6,
  facts:['Thousands of World War II pilots trained in it before flying fighters.','In Britain and Canada it was called the Harvard.'],clue:'A round engine, a long glass canopy and a tailwheel.'},
 {id:'ask21',name:'SCHLEICHER ASK 21',cat:'TRAINERS',year:1978,role:'TRAINING GLIDER',seats:2,paint:P('#f8f8f6','#d9731a'),draw:ask21,
  facts:['A two-seat fiberglass glider used to train glider pilots.','It has a T-tail and can even fly aerobatics.'],clue:'Very long thin wings, no engine and a T-tail.'},
 {id:'mq1',name:'GENERAL ATOMICS MQ-1 PREDATOR',cat:'UNCREWED',year:1994,role:'UNCREWED AIRCRAFT',seats:0,paint:P('#9aa3ad','#6f7882'),draw:mq1,
  facts:['An uncrewed aircraft: its pilot flies it from a station on the ground.','The bulge on its nose holds a satellite antenna.'],clue:'No cockpit, a bulgy nose, a pusher propeller and an upside-down V tail.'},
 {id:'tb2',name:'BAYRAKTAR TB2',cat:'UNCREWED',year:2014,role:'UNCREWED AIRCRAFT',seats:0,paint:P('#a8b0b8','#6f7882'),draw:tb2,
  facts:['An uncrewed aircraft from Türkiye, flown by a crew on the ground.','Its tail is held up by two thin booms.'],clue:'No cockpit, two thin tail booms and a pusher propeller.'}
];
H.HALL.forEach(m=>{ m.hall=true; m.kind='custom'; m.req=0; m.sub=m.year+' • '+m.role; if(m.cat==='LIGHTER THAN AIR') m.noReflect=true; });
/* the guide's Cessna 172 and Piper PA-28 are already in the academy fleet */
H.HALL_CATS=['PIONEERS','LIGHTER THAN AIR','WORLD WAR I','WORLD WAR II','AIRLINERS','JETS','ROTORCRAFT','TRAINERS','UNCREWED'];
})();
