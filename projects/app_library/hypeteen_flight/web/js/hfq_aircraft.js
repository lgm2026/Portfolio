/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* HYPETEEN FLIGHT ACADEMY - AIRCRAFT: drawn side views of real key models, and each cadet's own aircraft.
   Every airplane comes from one parametric side view (wing position, struts, gear, tail, engines, canopy, paint),
   so new models are a few lines of data. Helicopters, the glider and the airliner have their own builders.
   No logos or brand marks: simple shapes and the cadet's own paint.
   API:  H.AC                       the models, in fleet order (6 trainers, then one unlock per phase step)
         H.drawAC(c,id,x,y,w,h,paint,o)   fit a side view into a box. paint={body,stripe}. o={prop:'spin', t, ground:false, scale}
         H.myAC()                   {id, paint} for the signed-in cadet;  H.setMyAC(id, paint)
         H.acUnlocked(id[, xp])     is this model unlocked at this XP?
   Progress per cadet: G.save.mod.cadet.ac = {id, paint:{body,stripe}}  (copied onto the account for the Squadron) */
(function(){
const H=G.HFQ, C=G.C, PI=Math.PI;
const GLASS='#7fb2e0', GLASS2='#4e7fb3', DARK='#23262c', TIRE='#1a1c20', HUB='#c9ced6', STEEL='#8d96a2', PROP='#2a2d33';

/* ============================ THE FLEET ============================
   req: the rank (phase-step) index that unlocks it (0 = from the start). Facts are short and checkable. */
H.AC=[
 /* -------- the six trainers: pick one when you enroll -------- */
 {id:'c172',name:'CESSNA 172 SKYHAWK',kind:'plane',role:'TRAINER',seats:4,req:0,trainer:true,paint:{body:'#f4f4f2',stripe:'#2f6fb5'},
  g:{wing:'high',strut:1,gear:'tri',fin:'swept'},
  facts:['The most-built airplane in history: more Skyhawks have been made than any other airplane.','High wing, four seats, first flew in 1955.']},
 {id:'c152',name:'CESSNA 152',kind:'plane',role:'TRAINER',seats:2,req:0,trainer:true,paint:{body:'#f4f4f2',stripe:'#c23a3a'},
  g:{wing:'high',strut:1,gear:'tri',fin:'swept',len:.86,h:.94},
  facts:['A small two-seat trainer built from 1977 to 1985.','Thousands of pilots took their first lessons in one.']},
 {id:'pa28',name:'PIPER PA-28 WARRIOR',kind:'plane',role:'TRAINER',seats:4,req:0,trainer:true,paint:{body:'#f4f4f2',stripe:'#1f3a6a'},
  g:{wing:'low',gear:'tri',pants:1,fin:'swept2'},
  facts:['Part of the Cherokee family, first flown in 1960.','Low wing: you climb onto the wing to get in.']},
 {id:'da40',name:'DIAMOND DA40 STAR',kind:'plane',role:'TRAINER',seats:4,req:0,trainer:true,paint:{body:'#f4f4f2',stripe:'#3a6fd0'},
  g:{wing:'low',gear:'tri',pants:1,fin:'T',canopy:'bubble',len:1.04,slim:1},
  facts:['A smooth composite airplane with a T-tail and a big bubble canopy.','First flew in 1997, designed in Austria.']},
 {id:'sr20',name:'CIRRUS SR20',kind:'plane',role:'TRAINER',seats:4,req:0,trainer:true,paint:{body:'#f4f4f2',stripe:'#8a96a8'},
  g:{wing:'low',gear:'tri',pants:1,fin:'swept2',slim:1,len:1.02},
  facts:['Carries a parachute for the whole airplane.','Flown with a side yoke: a handle beside the pilot instead of a wheel in front.']},
 {id:'j3',name:'PIPER J-3 CUB',kind:'plane',role:'CLASSIC TRAINER',seats:2,req:0,trainer:true,paint:{body:'#f6c21c',stripe:'#1a1a1a'},
  g:{wing:'high',strut:1,gear:'tail',fin:'round',len:.9},
  facts:['The famous yellow taildragger, first built in 1938.','Trained huge numbers of pilots in World War II. Two seats, one behind the other.']},
 /* -------- unlocked by the academy phases -------- */
 {id:'supercub',name:'PIPER SUPER CUB',kind:'plane',role:'BUSH PLANE',seats:2,req:3,phase:1,paint:{body:'#f6c21c',stripe:'#c23a3a'},
  g:{wing:'high',strut:1,gear:'tail',fin:'round',len:.92,tundra:1},
  facts:['A bush plane, often fitted with big soft tundra tires for rough, short strips.','Taildraggers teach careful crosswind landings.']},
 {id:'float',name:'FLOATPLANE',kind:'plane',role:'SEAPLANE',seats:4,req:5,phase:1,paint:{body:'#f4f4f2',stripe:'#d9731a'},
  g:{wing:'high',strut:1,gear:'floats',fin:'swept'},
  facts:['Floats instead of wheels: lakes and rivers become runways.','A seaplane rating is its own class: single-engine sea.']},
 {id:'sr22',name:'CIRRUS SR22',kind:'plane',role:'TRAVELER',seats:4,req:6,phase:2,paint:{body:'#f4f4f2',stripe:'#b0287f'},
  g:{wing:'low',gear:'tri',pants:1,fin:'swept2',slim:1,len:1.04,prop3:1},
  facts:['The best-selling piston airplane for many years in a row.','Glass-cockpit screens help pilots fly in the clouds (IFR).']},
 {id:'bonanza',name:'BEECHCRAFT BONANZA',kind:'plane',role:'TRAVELER',seats:6,req:8,phase:2,paint:{body:'#f4f4f2',stripe:'#2f8a4a'},
  g:{wing:'low',gear:'tri',fin:'swept2',len:1.08,prop3:1},
  facts:['In production since 1947: longer than any other airplane.','Its landing gear folds up in flight to cut drag.']},
 {id:'seminole',name:'PIPER SEMINOLE',kind:'plane',role:'TWIN TRAINER',seats:4,req:9,phase:3,paint:{body:'#f4f4f2',stripe:'#c23a3a'},
  g:{wing:'low',gear:'tri',fin:'T',engine:'twin',len:1.06},
  facts:['A twin-engine trainer with a T-tail.','Its propellers turn opposite ways, which makes an engine failure easier to handle.']},
 {id:'pc12',name:'PILATUS PC-12',kind:'plane',role:'TURBOPROP',seats:9,req:11,phase:3,paint:{body:'#f4f4f2',stripe:'#1f3a6a'},
  g:{wing:'low',gear:'tri',fin:'T',engine:'turbo',len:1.2,h:1.05,windows:3},
  facts:['A Swiss single-engine turboprop that carries up to nine passengers.','Flying doctors use them as air ambulances in remote places.']},
 {id:'glider',name:'SCHWEIZER 2-33 GLIDER',kind:'glider',role:'GLIDER',seats:2,req:12,phase:4,paint:{body:'#f4f4f2',stripe:'#d9731a'},
  facts:['A two-seat training glider used for decades, even at the U.S. Air Force Academy.','No engine: a tow plane pulls it up, then it rides rising air.']},
 {id:'r22',name:'ROBINSON R22',kind:'heli',role:'TRAINING HELICOPTER',seats:2,req:14,phase:4,paint:{body:'#c23a3a',stripe:'#f4f4f2'},
  facts:['A light two-seat helicopter, a very common trainer.','The pedals work the tail rotor; the collective and cyclic do the rest.']},
 {id:'citation',name:'CESSNA CITATION CJ',kind:'plane',role:'BUSINESS JET',seats:8,req:15,phase:5,paint:{body:'#f4f4f2',stripe:'#3a3f48'},
  g:{wing:'low',gear:'tri',fin:'swept3',engine:'jetRear',len:1.22,h:1.04,windows:4,nose:'jet'},
  facts:['A family of small business jets flown by one or two pilots.','Its two jet engines sit on the back of the fuselage.']},
 {id:'b737',name:'BOEING 737',kind:'airliner',role:'AIRLINER',seats:170,req:16,phase:5,paint:{body:'#f4f4f2',stripe:'#2f6fb5'},
  facts:['One of the most common airliners in the world; it first flew in 1967.','Two pilots, a big crew and about 150 to 200 passengers.']},
 {id:'ems',name:'AIR MEDICAL HELICOPTER',kind:'heli',role:'MEDICAL FLIGHT',seats:4,req:17,phase:5,ems:1,paint:{body:'#f4f4f2',stripe:'#c8102e'},
  facts:['Twin-engine helicopters like the Airbus H135 fly patients straight to hospitals.','A covered tail rotor, called a Fenestron, keeps the crew safer on the ground.']}
];
H.HALL=H.HALL||[];   // the Hall of Flight (hfq_aircraft2.js): history's key aircraft, unlocked by spotting them
H.acById=id=>H.AC.find(a=>a.id===id)||H.HALL.find(a=>a.id===id)||H.AC[0];
H.allAC=()=>H.AC.concat(H.HALL);
H.acPaints={body:['#f4f4f2','#f6c21c','#c23a3a','#1f3a6a','#2f6fb5','#2f8a4a','#8a96a8','#1a1a1a'],stripe:['#2f6fb5','#c23a3a','#1f3a6a','#f6c21c','#2f8a4a','#d9731a','#b0287f','#1a1a1a']};

/* ============================ DRAWING ============================ */
/* a rounded rect on ANY context (G.rrect only draws on the main canvas; models also render offscreen) */
function rr(c,x,y,w,h,r){ r=Math.max(0,Math.min(r,w/2,h/2)); c.beginPath(); c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath(); }
/* the render in progress: scale (device px per model unit) and the aircraft lights the model marked */
const CUR={k:1,lights:[]};
function mark(c,x,y,type){ const T=c.getTransform(); CUR.lights.push({x:(T.a*x+T.c*y+T.e-2)/CUR.k,y:(T.b*x+T.d*y+T.f-2)/CUR.k,type}); }
const circ=(c,x,y,r,f,s,lw)=>{ c.beginPath(); c.arc(x,y,r,0,PI*2); if(f){ c.fillStyle=f; c.fill(); } if(s){ c.strokeStyle=s; c.lineWidth=lw||1; c.stroke(); } };
const poly=(c,pts,f,s,lw)=>{ c.beginPath(); pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1])); c.closePath(); if(f){ c.fillStyle=f; c.fill(); } if(s){ c.strokeStyle=s; c.lineWidth=lw||1; c.stroke(); } };
const line=(c,x0,y0,x1,y1,col,w)=>{ c.strokeStyle=col; c.lineWidth=w||1; c.lineCap='round'; c.beginPath(); c.moveTo(x0,y0); c.lineTo(x1,y1); c.stroke(); };
const shade=(h,k)=>G.shade(h,k);
const OUT='rgba(20,22,26,.55)';
function wheel(c,x,y,r){ const g=c.createRadialGradient(x-r*.3,y-r*.3,r*.1,x,y,r); g.addColorStop(0,'#3a3d44'); g.addColorStop(.75,TIRE); g.addColorStop(1,'#0c0d10'); circ(c,x,y,r,g);
 const h=c.createRadialGradient(x-r*.15,y-r*.15,0,x,y,r*.46); h.addColorStop(0,'#eef1f5'); h.addColorStop(.7,HUB); h.addColorStop(1,'#8d96a2'); circ(c,x,y,r*.46,h); circ(c,x,y,r*.14,'#5d6672'); }
function propDisc(c,x,y,len,o,blades){
 if(o.prop==='spin'){
  c.save(); c.translate(x+1,y); c.scale(.13,1);
  const g=c.createRadialGradient(0,0,len*.15,0,0,len); g.addColorStop(0,'rgba(225,230,238,0)'); g.addColorStop(.7,'rgba(225,230,238,.16)'); g.addColorStop(.93,'rgba(235,240,246,.45)'); g.addColorStop(1,'rgba(235,240,246,0)');
  c.fillStyle=g; c.beginPath(); c.arc(0,0,len,0,PI*2); c.fill(); c.restore();
  const a=(o.t||0)*40, n=blades||2; for(let i=0;i<3;i++){ const k=Math.cos(a+i*PI/n), al=.5-i*.15; c.strokeStyle='rgba(40,44,52,'+al+')'; c.lineWidth=1.6-i*.4; c.beginPath(); c.moveTo(x+1,y-k*len); c.lineTo(x+1,y+k*len); c.stroke(); }
  c.fillStyle='rgba(255,255,255,.8)'; c.fillRect(x+.4,y-len-.6,1.4,1.4); c.fillRect(x+.4,y+len-.8,1.4,1.4); return; }
 const n=blades||2; for(let i=0;i<n;i++){ const a=i*PI*2/n+.35, dy=Math.cos(a)*len; const g=c.createLinearGradient(x-1,y,x+3,y); g.addColorStop(0,'#1b1d22'); g.addColorStop(.5,'#3a3f48'); g.addColorStop(1,'#1b1d22'); c.fillStyle=g; c.beginPath(); c.ellipse(x+1,y+dy/2,1.6,Math.abs(dy)/2+.6,0,0,PI*2); c.fill(); c.fillStyle='#ffd24d'; c.fillRect(x,y+dy-(dy>0?2:0),2,2); }
}

/* ---------- the parametric airplane (nose right, wheels on y=104) ---------- */
function plane(c,m,p,o){
 const g=m.g||{}, L=g.len||1, Hh=g.h||1;
 const bx=x=>120+(x-120)*L, by=y=>62+(y-62)*Hh;     // stretch around the middle
 const N=bx(214), F=bx(182), Ce=bx(124), Tx=bx(32), cy=by(62);
 const isTD=g.gear==='tail', T0=by(g.slim?52:50), B0=by(g.slim?74:76), R=by(g.slim?42:40), Bc=by(g.slim?78:80), tTop=by(isTD?56:52), tBot=by(isTD?64:59);
 const body=p.body, stripe=p.stripe, dark=shade(body,.78);
 const isTail=g.gear==='tail', nose=g.nose||(g.engine==='twin'?'pointed':'prop');
 // tilt a taildragger back onto its tailwheel
 let tilt=0; const mainX=isTail?F-6:bx(150), wr=g.tundra?8.5:6, gyW=104-wr, twR=2.6, twLeg=12;
 if(isTail){ const qx=Tx+10, qy=tBot+twLeg; for(let a=0;a>-.4;a-=.002){ const yy=gyW+(qx-mainX)*Math.sin(a)+(qy-gyW)*Math.cos(a); tilt=a; if(yy+twR>=104) break; } }
 c.save();
 if(tilt){ c.translate(mainX,gyW); c.rotate(tilt); c.translate(-mainX,-gyW); }
 // horizontal tail (conventional) behind the fin
 const T=g.fin==='T';
 if(!T) poly(c,[[Tx-6,tTop+2],[Tx+34,tTop+3.5],[Tx+36,tTop+6],[Tx-5,tTop+6]],shade(body,.86),OUT,.6);
 // fin
 const fins={
  swept:[[Tx+42,tTop+1],[Tx+16,tTop-30],[Tx+3,tTop-31],[Tx-2,tTop+3]],
  swept2:[[Tx+40,tTop+1],[Tx+20,tTop-28],[Tx+5,tTop-29],[Tx-1,tTop+3]],
  swept3:[[Tx+46,tTop+1],[Tx+22,tTop-30],[Tx+8,tTop-31],[Tx-2,tTop+3]],
  T:[[Tx+36,tTop+1],[Tx+18,tTop-32],[Tx+6,tTop-33],[Tx,tTop+3]]};
 mark(c,Tx-1,(tTop+tBot)/2,'strobe'); if(g.fin==='round') mark(c,Tx+5,tTop-25,'beacon'); else mark(c,(fins[g.fin]||fins.swept)[2][0]+2,(fins[g.fin]||fins.swept)[2][1]+1,'beacon');
 if(g.fin==='round'){ c.beginPath(); c.moveTo(Tx+34,tTop+1); c.bezierCurveTo(Tx+22,tTop-6,Tx+16,tTop-27,Tx+4,tTop-26); c.bezierCurveTo(Tx-6,tTop-25,Tx-4,tTop-8,Tx-2,tTop+3); c.closePath(); c.fillStyle=body; c.fill(); c.strokeStyle=OUT; c.lineWidth=.7; c.stroke(); line(c,Tx+6,tTop-24,Tx+4,tTop+3,shade(body,.7),.8); }
 else { const f=fins[g.fin]||fins.swept; poly(c,f,body,OUT,.7); line(c,f[2][0]+4,f[2][1]+1,f[3][0]+5,f[3][1],shade(body,.72),.8);
  c.save(); c.beginPath(); c.moveTo(f[0][0],f[0][1]); f.forEach(q=>c.lineTo(q[0],q[1])); c.closePath(); c.clip(); c.fillStyle=stripe; c.fillRect(Tx-10,f[2][1]+4,70,5); c.restore(); }
 if(T){ const f=fins.T; poly(c,[[f[2][0]-8,f[2][1]-1],[f[1][0]+12,f[1][1]],[f[1][0]+12,f[1][1]+3],[f[2][0]-8,f[2][1]+3]],shade(body,.9),OUT,.6); }
 // the fuselage
 c.beginPath();
 if(nose==='prop'){ c.moveTo(N-6,cy-1); c.quadraticCurveTo(N-8,T0+1,N-14,T0); }
 else if(nose==='jet'){ c.moveTo(N+4,cy+3); c.quadraticCurveTo(N+2,T0-2,N-18,T0-3); }
 else { c.moveTo(N+2,cy+2); c.quadraticCurveTo(N,T0,N-16,T0-1); }
 c.lineTo(F,T0-2); c.lineTo(F-16,R); c.lineTo(Ce,R); c.lineTo(Tx+6,tTop);
 c.quadraticCurveTo(Tx-3,tTop+1,Tx-2,(tTop+tBot)/2); c.quadraticCurveTo(Tx-1,tBot,Tx+8,tBot);
 c.lineTo(Ce-6,Bc); c.lineTo(F-2,Bc-1);
 if(nose==='prop'){ c.quadraticCurveTo(F+18,B0+2,N-12,B0-2); c.quadraticCurveTo(N-6,cy+8,N-6,cy+1); }
 else { c.quadraticCurveTo(F+20,B0+2,N-6,B0-4); c.quadraticCurveTo(N+(nose==='jet'?4:2),cy+8,N+(nose==='jet'?4:2),cy+2); }
 c.closePath(); c.fillStyle=body; c.fill(); c.strokeStyle=OUT; c.lineWidth=.8; c.stroke();
 // belly shade + the stripe (clipped to the body)
 c.save(); c.clip();
 const gr=c.createLinearGradient(0,R,0,Bc); gr.addColorStop(0,'rgba(255,255,255,.18)'); gr.addColorStop(.55,'rgba(0,0,0,0)'); gr.addColorStop(1,'rgba(0,0,0,.18)'); c.fillStyle=gr; c.fillRect(0,0,240,120);
 c.fillStyle=stripe; c.beginPath(); c.moveTo(N+6,cy+2); c.lineTo(Tx-4,tTop+3); c.lineTo(Tx-4,tTop+6.5); c.lineTo(N+6,cy+7.5); c.closePath(); c.fill();
 c.fillStyle=shade(stripe,1.25); c.globalAlpha=.6; c.beginPath(); c.moveTo(N+6,cy+9); c.lineTo(Tx-4,tTop+8); c.lineTo(Tx-4,tTop+9.4); c.lineTo(N+6,cy+10.6); c.closePath(); c.fill(); c.globalAlpha=1;
 c.restore();
 // windows
 if(g.canopy==='bubble'){ c.beginPath(); c.moveTo(F+1,T0-1); c.quadraticCurveTo(F-12,R-12,F-34,R-9); c.quadraticCurveTo(Ce+4,R-6,Ce-2,R+1); c.lineTo(Ce,R+12); c.lineTo(F-6,R+12); c.closePath();
  const gg=c.createLinearGradient(0,R-12,0,R+12); gg.addColorStop(0,GLASS); gg.addColorStop(1,GLASS2); c.fillStyle=gg; c.fill(); c.strokeStyle=OUT; c.lineWidth=.7; c.stroke(); }
 else if(g.windows>2){ poly(c,[[F-1,T0-1],[F-15,R+2],[F-22,R+2],[F-22,T0+2]],GLASS2,OUT,.5);
  const n=g.windows*2, x0=F-30, x1=Ce+4, dx=(x0-x1)/(n-1); for(let i=0;i<n;i++){ c.fillStyle=GLASS2; rr(c,x0-i*dx-2.6,R+4,5.2,6,2.4); c.fill(); } }
 else { poly(c,[[F-2,T0-1],[F-15,R+2.5],[F-19,R+2.5],[F-12,T0+1]],GLASS2,null);
  poly(c,[[F-19,R+3],[Ce+3,R+3],[Ce+8,R+14],[F-6,R+14]],GLASS,OUT,.6); line(c,(F+Ce)/2-6,R+3,(F+Ce)/2-4,R+14,body,1.6);
  c.fillStyle='rgba(255,255,255,.35)'; poly(c,[[F-17,R+4],[F-25,R+4],[F-31,R+13],[F-23,R+13]],'rgba(255,255,255,.28)'); }
 // engines on the wing / tail
 if(g.engine==='jetRear'){ const ex=Tx+44; poly(c,[[ex+18,R+12],[ex+30,R+10],[ex+30,R+14],[ex+18,R+15]],shade(body,.8)); c.fillStyle=shade(body,.95); rr(c,ex-4,R+4,36,14,7); c.fill(); c.strokeStyle=OUT; c.lineWidth=.6; c.stroke(); c.fillStyle=DARK; rr(c,ex-5,R+6,4,10,2); c.fill(); c.fillStyle=stripe; c.fillRect(ex+4,R+10,22,2); }
 // the wing
 if(g.wing==='high'){ c.fillStyle=shade(body,.94); c.beginPath(); c.moveTo(F-8,R-1); c.quadraticCurveTo(F-6,R-6,F-14,R-6); c.lineTo(F-50,R-5); c.lineTo(F-52,R-1); c.closePath(); c.fill(); c.strokeStyle=OUT; c.lineWidth=.6; c.stroke();
  if(g.strut) line(c,F-20,Bc-3,F-34,R-2,STEEL,1.6); }
 else { c.fillStyle=shade(body,.94); c.beginPath(); c.moveTo(F-4,Bc-2); c.quadraticCurveTo(F-2,Bc-7,F-12,Bc-7); c.lineTo(F-52,Bc-5); c.lineTo(F-54,Bc-1); c.lineTo(F-6,Bc+1); c.closePath(); c.fill(); c.strokeStyle=OUT; c.lineWidth=.6; c.stroke(); }
 if(g.engine==='twin'){ const nx=F-6, ny=Bc-6; c.fillStyle=shade(body,.97); c.beginPath(); c.moveTo(nx+12,ny-7); c.quadraticCurveTo(nx+22,ny-7,nx+22,ny); c.quadraticCurveTo(nx+22,ny+7,nx+12,ny+7); c.lineTo(nx-34,ny+4); c.lineTo(nx-36,ny-3); c.closePath(); c.fill(); c.strokeStyle=OUT; c.lineWidth=.7; c.stroke(); c.fillStyle=stripe; c.fillRect(nx-22,ny-1,34,2.4);
  c.fillStyle=stripe; c.beginPath(); c.ellipse(nx+22,ny,4.5,4.5,0,-PI/2,PI/2); c.fill(); propDisc(c,nx+26,ny,16,o,2); }
 // gear
 const gy=104-wr;
 if(g.gear==='floats'){ line(c,F-8,Bc-1,F-4,92,STEEL,1.4); line(c,Ce+12,Bc,Ce+16,92,STEEL,1.4); line(c,F-30,Bc,F-24,92,STEEL,1.2);
  c.fillStyle='#e9edf2'; c.beginPath(); c.moveTo(N-4,92); c.quadraticCurveTo(N+4,92,N+2,96); c.quadraticCurveTo(N-6,103,N-26,103); c.lineTo(Ce-14,103); c.lineTo(Ce-22,99); c.lineTo(Ce-46,97); c.lineTo(Ce-46,93); c.closePath(); c.fill(); c.strokeStyle=OUT; c.lineWidth=.7; c.stroke(); c.fillStyle=stripe; c.fillRect(Ce-40,95,N-Ce+36,1.6); }
 else if(isTail){ line(c,F-14,Bc-2,mainX,gy,STEEL,1.8); line(c,F-26,Bc-1,mainX,gy,STEEL,1.2); wheel(c,mainX,gy,wr);
  line(c,Tx+8,tBot,Tx+10,tBot+twLeg,STEEL,1.4); wheel(c,Tx+10,tBot+twLeg,twR); }
 else { const nwx=N-(nose==='jet'?22:18), mx=g.engine==='twin'||g.engine==='turbo'||g.engine==='jetRear'?F-46:F-38;
  line(c,nwx,B0-3,nwx,gy,STEEL,1.6); wheel(c,nwx,gy,wr*.9);
  line(c,mx+8,Bc-1,mx,gy,STEEL,1.8); wheel(c,mx,gy,wr);
  if(g.pants){ const pant=(x,r)=>{ c.fillStyle=body; c.beginPath(); c.moveTo(x+r*1.2,gy-1); c.quadraticCurveTo(x+r*1.1,gy-r*1.15,x,gy-r*1.1); c.lineTo(x-r*1.9,gy-r*.35); c.quadraticCurveTo(x-r*2,gy+r*.1,x-r*1.2,gy+r*.2); c.lineTo(x+r*.3,gy+r*.2); c.quadraticCurveTo(x+r*1.2,gy+r*.15,x+r*1.2,gy-1); c.closePath(); c.fill(); c.strokeStyle=OUT; c.lineWidth=.6; c.stroke(); c.fillStyle=stripe; c.fillRect(x-r*1.5,gy-r*.2,r*2.4,1.2); };
   pant(mx,wr); pant(nwx,wr*.9); } }
 // the nose: spinner + propeller
 if(nose==='prop'){ const tx=N-(g.engine==='turbo'?2:6); if(g.engine==='turbo'){ c.fillStyle=DARK; rr(c,F+6,cy+2,8,4,2); c.fill(); }
  c.fillStyle=stripe; c.beginPath(); c.ellipse(tx-2,cy,6.5,6.5,0,-PI/2,PI/2); c.fill(); c.strokeStyle=OUT; c.lineWidth=.6; c.stroke();
  propDisc(c,tx+4,cy,g.engine==='turbo'?20:(g.prop3?19:18),o,g.blades||(g.engine==='turbo'?4:(g.prop3?3:2))); }
 c.restore();
}

/* ---------- the glider (high wing, strut, one main wheel + nose skid) ---------- */
function glider(c,m,p){
 const body=p.body, stripe=p.stripe;
 poly(c,[[24,52],[66,54],[68,57],[25,57]],shade(body,.86),OUT,.6);
 c.beginPath(); c.moveTo(60,54); c.bezierCurveTo(44,48,40,24,28,24); c.bezierCurveTo(18,24,20,44,22,56); c.closePath(); c.fillStyle=body; c.fill(); c.strokeStyle=OUT; c.lineWidth=.7; c.stroke();
 c.save(); c.beginPath(); c.moveTo(60,54); c.bezierCurveTo(44,48,40,24,28,24); c.bezierCurveTo(18,24,20,44,22,56); c.closePath(); c.clip(); c.fillStyle=stripe; c.fillRect(10,30,60,6); c.restore();
 c.beginPath(); c.moveTo(210,66); c.quadraticCurveTo(212,54,190,50); c.lineTo(150,46); c.lineTo(28,54); c.lineTo(24,58); c.lineTo(28,61); c.lineTo(140,74); c.quadraticCurveTo(196,78,210,66); c.closePath(); c.fillStyle=body; c.fill(); c.strokeStyle=OUT; c.lineWidth=.8; c.stroke();
 c.save(); c.clip(); c.fillStyle=stripe; c.beginPath(); c.moveTo(214,64); c.lineTo(26,57); c.lineTo(26,60); c.lineTo(214,69); c.closePath(); c.fill(); c.restore();
 poly(c,[[200,56],[186,49],[150,47],[146,57],[192,60]],GLASS,OUT,.6); line(c,168,48,168,58,body,1.4);
 c.fillStyle=shade(body,.94); c.beginPath(); c.moveTo(164,46); c.quadraticCurveTo(166,41,158,41); c.lineTo(112,42); c.lineTo(110,46); c.closePath(); c.fill(); c.strokeStyle=OUT; c.lineWidth=.6; c.stroke();
 line(c,150,70,130,45,STEEL,1.4);
 wheel(c,160,82,7); poly(c,[[208,70],[212,78],[196,80],[194,74]],'#3a3f48');
 // the long wing, seen at a slight angle so you can tell it's a glider
 c.fillStyle='rgba(230,234,240,.92)'; c.beginPath(); c.moveTo(160,44); c.lineTo(234,30); c.lineTo(236,33); c.lineTo(112,46); c.closePath(); c.fill(); c.strokeStyle=OUT; c.lineWidth=.5; c.stroke();
 c.beginPath(); c.moveTo(150,45); c.lineTo(6,30); c.lineTo(4,33); c.lineTo(112,46); c.closePath(); c.fillStyle='rgba(205,211,218,.85)'; c.fill(); c.stroke();
}

/* ---------- the airliner (long tube, engines under the wings) ---------- */
function airliner(c,m,p){
 const body=p.body, stripe=p.stripe;
 // fin + stab
 poly(c,[[64,50],[34,14],[20,14],[22,54]],stripe,OUT,.7); poly(c,[[14,54],[52,56],[54,60],[16,60]],shade(body,.86),OUT,.6);
 // tube
 c.beginPath(); c.moveTo(226,62); c.quadraticCurveTo(226,47,206,45); c.lineTo(60,45); c.quadraticCurveTo(26,46,14,56); c.lineTo(14,59); c.quadraticCurveTo(40,72,70,73); c.lineTo(206,73); c.quadraticCurveTo(226,72,226,62); c.closePath();
 c.fillStyle=body; c.fill(); c.strokeStyle=OUT; c.lineWidth=.8; c.stroke();
 c.save(); c.clip(); const gr=c.createLinearGradient(0,45,0,73); gr.addColorStop(0,'rgba(255,255,255,.2)'); gr.addColorStop(1,'rgba(0,0,0,.18)'); c.fillStyle=gr; c.fillRect(0,0,240,120);
 c.fillStyle=stripe; c.fillRect(0,61,240,3); c.fillStyle=shade(stripe,.75); c.fillRect(0,66,240,7); c.restore();
 for(let x=196;x>58;x-=6.6){ c.fillStyle=GLASS2; rr(c,x-1.6,52,3.2,4.4,1.5); c.fill(); }
 poly(c,[[222,53],[214,48],[206,48],[206,54]],GLASS2,null); c.fillStyle=shade(body,.9); rr(c,186,51,5,12,1.5); c.fill();
 mark(c,28,16,'beacon'); mark(c,16,57,'strobe'); mark(c,225,58,'strobe');
 // wing + engine
 poly(c,[[150,70],[108,70],[96,76],[146,75]],shade(body,.9),OUT,.6);
 c.fillStyle=shade(body,.94); rr(c,132,72,30,12,6); c.fill(); c.strokeStyle=OUT; c.lineWidth=.6; c.stroke(); circ(c,161,78,5,'#3a3f48'); poly(c,[[140,72],[148,72],[146,70],[138,70]],shade(body,.85));
 // gear
 line(c,204,73,204,98,STEEL,1.6); wheel(c,204,99,4.8); line(c,122,73,122,97,STEEL,2.2); wheel(c,119,99,5.2); wheel(c,127,99,5.2);
}

/* ---------- helicopters: the R22 trainer and the air medical helicopter ---------- */
function heli(c,m,p,o){
 const body=p.body, stripe=p.stripe, ems=!!m.ems, t=o.t||0, spin=o.prop==='spin';
 // skids
 line(c,96,104,186,104,STEEL,2); c.beginPath(); c.moveTo(186,104); c.quadraticCurveTo(194,104,194,99); c.strokeStyle=STEEL; c.lineWidth=2; c.stroke();
 line(c,112,104,116,90,STEEL,1.6); line(c,168,104,164,90,STEEL,1.6);
 if(ems){
  // tail boom to a Fenestron
  poly(c,[[110,62],[44,58],[40,64],[110,74]],body,OUT,.7); c.fillStyle=stripe; c.fillRect(44,63,66,3);
  poly(c,[[30,42],[46,42],[52,74],[30,78]],body,OUT,.7); circ(c,40,62,9,'#2a2d33'); circ(c,40,62,6.5,'#5d6672'); poly(c,[[54,70],[66,70],[66,73],[54,73]],shade(body,.85));
  // body
  c.beginPath(); c.moveTo(200,80); c.quadraticCurveTo(206,62,186,52); c.lineTo(130,48); c.quadraticCurveTo(108,50,104,62); c.lineTo(104,84); c.quadraticCurveTo(120,92,180,92); c.quadraticCurveTo(198,90,200,80); c.closePath();
  c.fillStyle=body; c.fill(); c.strokeStyle=OUT; c.lineWidth=.8; c.stroke();
  c.save(); c.clip(); c.fillStyle=stripe; c.fillRect(90,74,120,7); c.fillStyle='#1f3a6a'; c.fillRect(90,82,120,3); c.restore();
  poly(c,[[200,72],[194,56],[178,54],[176,72]],GLASS,OUT,.6); poly(c,[[170,56],[148,55],[148,70],[170,70]],GLASS2,OUT,.5); poly(c,[[142,55],[122,56],[122,70],[142,70]],GLASS2,OUT,.5);
  c.fillStyle=shade(body,.9); rr(c,124,40,52,10,4); c.fill(); c.strokeStyle=OUT; c.lineWidth=.6; c.stroke();
  line(c,150,40,150,32,'#5d6672',3);
 } else {
  // thin boom, little tail rotor
  line(c,124,66,44,58,shade(body,.95),3.4); poly(c,[[46,57],[38,40],[34,40],[36,62]],body,OUT,.6); poly(c,[[40,62],[34,70],[38,72],[44,62]],body,OUT,.6);
  if(spin){ c.save(); c.globalAlpha=.28; circ(c,38,56,11,'#cfd6de'); c.restore(); } else { line(c,38,46,38,66,PROP,1.6); }
  // engine + mast
  c.fillStyle='#8d96a2'; rr(c,118,58,26,14,3); c.fill(); line(c,140,52,140,34,'#5d6672',2.6);
  // bubble cabin
  c.beginPath(); c.ellipse(158,70,26,20,0,0,PI*2); c.fillStyle=body; c.fill(); c.strokeStyle=OUT; c.lineWidth=.8; c.stroke();
  c.beginPath(); c.ellipse(164,66,20,15,-.15,-PI*.95,PI*.35); c.fillStyle=GLASS; c.fill(); c.strokeStyle=OUT; c.lineWidth=.6; c.stroke();
  c.fillStyle=stripe; c.fillRect(134,80,48,3);
 }
 mark(c,ems?60:48,ems?56:56,'beacon'); mark(c,ems?200:184,ems?66:70,'strobe');
 // main rotor
 const rx=ems?150:140, ry=ems?31:33, rl=ems?92:84;
 if(spin){ c.save(); c.globalAlpha=.3; c.fillStyle='#cfd6de'; c.beginPath(); c.ellipse(rx,ry,rl,3,0,0,PI*2); c.fill(); c.restore(); const k=Math.cos(t*30); line(c,rx-rl*k,ry,rx+rl*k,ry,'rgba(40,44,52,.6)',1.6); }
 else { line(c,rx-rl,ry+1.5,rx+rl,ry-1.5,PROP,2); }
 circ(c,rx,ry,2.4,'#3a3f48');
}

/* ---------- fit + draw: every aircraft in the app comes through here ----------
   The model is drawn flat into an offscreen canvas, then LIT in place (source-atop, so only the aircraft is painted):
   cylindrical shading top to belly, a warm key light from upper left, a cool fill from below, a specular streak.
   Then it lands on the real canvas over a soft shadow (or water), with an optional reflection (o.reflect), and its
   lights on top: a red beacon, white tail strobes (animated with o.t). o.flat:true skips all of it (tiny icons). */
function model(c,m,p,o){ if(m.draw) m.draw(c,m,p,o,KIT); else if(m.kind==='heli') heli(c,m,p,o); else if(m.kind==='glider') glider(c,m,p,o); else if(m.kind==='airliner') airliner(c,m,p,o); else plane(c,m,p,o); }
function light(oc,k){
 oc.save(); oc.setTransform(1,0,0,1,0,0); oc.translate(2,2); oc.scale(k,k); oc.globalCompositeOperation='source-atop';
 let g=oc.createLinearGradient(0,14,0,104); g.addColorStop(0,'rgba(255,255,255,.34)'); g.addColorStop(.3,'rgba(255,255,255,.08)'); g.addColorStop(.58,'rgba(0,0,0,0)'); g.addColorStop(1,'rgba(0,0,0,.36)'); oc.fillStyle=g; oc.fillRect(0,0,240,120);
 g=oc.createLinearGradient(30,0,210,120); g.addColorStop(0,'rgba(255,226,170,.26)'); g.addColorStop(.55,'rgba(255,226,170,0)'); g.addColorStop(1,'rgba(40,70,130,.22)'); oc.fillStyle=g; oc.fillRect(0,0,240,120);
 g=oc.createLinearGradient(0,30,0,58); g.addColorStop(0,'rgba(255,255,255,0)'); g.addColorStop(.45,'rgba(255,255,255,.17)'); g.addColorStop(1,'rgba(255,255,255,0)'); oc.fillStyle=g; oc.fillRect(0,0,240,120);
 g=oc.createLinearGradient(0,90,0,112); g.addColorStop(0,'rgba(255,200,120,0)'); g.addColorStop(1,'rgba(255,200,120,.1)'); oc.fillStyle=g; oc.fillRect(0,0,240,120);   // bounce light off the ground
 oc.restore();
}
/* the cache of lit renders: key = model + paint + pixel scale + propeller phase. Small LRU. */
const CACHE=new Map(), MAXC=36;
function lit(m,p,o,k){
 const spin=o.prop==='spin', ph=spin?Math.floor((((o.t||0)*40)%PI)/PI*8):-1, key=m.id+'|'+p.body+p.stripe+'|'+k.toFixed(2)+'|'+ph;
 let E=CACHE.get(key); if(E){ CACHE.delete(key); CACHE.set(key,E); return E; }
 const W=Math.ceil(240*k)+4, Hh=Math.ceil(120*k)+4, cv=document.createElement('canvas'); cv.width=W; cv.height=Hh; const oc=cv.getContext('2d');
 oc.save(); oc.translate(2,2); oc.scale(k,k); CUR.k=k; CUR.lights=[]; model(oc,m,p,Object.assign({},o,{t:spin?(ph+.5)*PI/8/40:0,fly:false})); oc.restore();
 light(oc,k);
 E={cv,W,Hh,lights:CUR.lights.slice()}; CACHE.set(key,E); if(CACHE.size>MAXC){ const first=CACHE.keys().next().value; CACHE.delete(first); }
 return E;
}
function drawLights(c,t,o){
 const anim=o.t!=null;
 for(const L of CUR.lights){ let col, a, r;
  if(L.type==='beacon'){ const ph=anim?((t*1.1)%1):.2; a=ph<.3?1-ph/.3:0; col='255,40,40'; r=8; if(!anim) a=.45; }
  else { const ph=anim?((t*.9)%1):.5; a=(ph<.06||(ph>.14&&ph<.2))?1:0; col='245,250,255'; r=7; if(!anim) a=.3; }
  if(a<=0) continue;
  const g=c.createRadialGradient(L.x,L.y,0,L.x,L.y,r); g.addColorStop(0,'rgba('+col+','+a+')'); g.addColorStop(.25,'rgba('+col+','+(a*.5)+')'); g.addColorStop(1,'rgba('+col+',0)'); c.fillStyle=g; c.beginPath(); c.arc(L.x,L.y,r,0,PI*2); c.fill();
  c.fillStyle='rgba(255,255,255,'+Math.min(1,a)+')'; c.beginPath(); c.arc(L.x,L.y,1.1,0,PI*2); c.fill(); }
}
H.drawAC=function(c,id,x,y,w,h,paint,o){ if(G.ART&&G.ART.has('ac:'+id)){ const e=G.ART.entry('ac:'+id); c.save(); if(o&&o.fly&&!G.rm()){ c.translate(x+w/2,y+h/2); c.rotate(Math.sin((o.t||0)*1.3)*.03); c.translate(-x-w/2,-y-h/2); } if(G.ART.draw(c,'ac:'+id,x,y,w,h)){ c.restore(); return; } c.restore(); }

 o=o||{}; const m=H.acById(id), p=Object.assign({},m.paint,paint||{});
 const s=Math.min(w/240,h/120)*(o.scale||1), ox=x+(w-240*s)/2, oy=y+(h-120*s)/2, t=o.t||0, floats=m.g&&m.g.gear==='floats';
 c.save(); c.translate(ox,oy); c.scale(s,s);
 if(o.fly&&!G.rm()){ c.translate(0,Math.sin(t*1.7)*2.4); c.translate(120,60); c.rotate(Math.sin(t*1.1)*.02); c.translate(-120,-60); }
 if(o.ground!==false){
  if(floats){ c.fillStyle='rgba(91,155,255,.25)'; c.fillRect(0,102,240,10); c.fillStyle='rgba(255,255,255,.3)'; for(let i=0;i<6;i++) c.fillRect(20+i*38+Math.sin(t*2+i)*3,105,16,1.2); }
  else { c.save(); c.translate(124,105); c.scale(1,.055); const g=c.createRadialGradient(0,0,10,0,0,100); g.addColorStop(0,'rgba(0,0,0,.42)'); g.addColorStop(.6,'rgba(0,0,0,.22)'); g.addColorStop(1,'rgba(0,0,0,0)'); c.fillStyle=g; c.beginPath(); c.arc(0,0,100,0,PI*2); c.fill(); c.restore(); } }
 if(o.flat){ CUR.lights=[]; CUR.k=1; model(c,m,p,o); c.restore(); return; }
 // render the model offscreen at the real pixel density, then light it (cached: static renders, and 8 propeller phases)
 const T=c.getTransform(), k=Math.max(.5,Math.min(6,Math.hypot(T.a,T.b)));
 const E=lit(m,p,o,k), cv=E.cv, W=E.W, Hh=E.Hh; CUR.lights=E.lights;
 const u=1/k;   // offscreen px -> model units
 if(o.reflect&&!floats&&!m.noReflect){   // a wet-apron reflection under the aircraft, fading with depth
  if(!E.rv){ const rv=document.createElement('canvas'); rv.width=W; rv.height=Hh; const rc=rv.getContext('2d'); rc.drawImage(cv,0,0);
   rc.globalCompositeOperation='destination-in'; const g=rc.createLinearGradient(0,2+104*k,0,2+40*k); g.addColorStop(0,'rgba(0,0,0,.22)'); g.addColorStop(1,'rgba(0,0,0,0)'); rc.fillStyle=g; rc.fillRect(0,0,W,Hh); E.rv=rv; }
  c.save(); c.translate(0,2*104+1); c.scale(1,-1); c.drawImage(E.rv,0,0,W,Hh,-2*u,-2*u,W*u,Hh*u); c.restore(); }
 c.drawImage(cv,0,0,W,Hh,-2*u,-2*u,W*u,Hh*u);
 if(o.lights!==false) drawLights(c,t,o);
 c.restore();
};
/* the drawing kit, shared with the Hall of Flight models (hfq_aircraft2.js) */
const KIT=H.acKit={circ,poly,line,wheel,propDisc,shade,plane,heli,glider,airliner,mark,rr,OUT,GLASS,GLASS2,DARK,TIRE,HUB,STEEL,PROP};

/* ============================ MY AIRCRAFT ============================ */
const cad=()=>(G.save.mod.cadet=G.save.mod.cadet||{});
H.acUnlocked=function(id,xp){ const m=H.acById(id); if(m.hall) return H.isSpotted(id); xp=xp==null?G.save.points:xp; return H.rank(xp).i>=m.req; };
/* Hall of Flight aircraft unlock when you name them in the Plane Spotter game */
H.isSpotted=id=>!!((cad().spotted||{})[id]);
H.spot=function(id){ const sp=(cad().spotted=cad().spotted||{}); if(sp[id]) return false; sp[id]=Date.now(); G.persist();
 const n=Object.keys(sp).length; if(n>=10) G.ach('spotter'); if(H.HALL.length&&H.HALL.every(m=>sp[m.id])) G.ach('spotall'); return true; };
H.myAC=function(){ const a=cad().ac; return a&&a.id?{id:a.id,paint:Object.assign({},H.acById(a.id).paint,a.paint||{})}:{id:'c172',paint:Object.assign({},H.AC[0].paint)}; };
H.hasPickedAC=()=>!!(cad().ac&&cad().ac.id);
H.setMyAC=function(id,paint){
 const prev=cad().ac||{}; const m=H.acById(id);
 cad().ac={id,paint:paint||(prev.id===id&&prev.paint)||Object.assign({},m.paint)}; G.persist();
 if(G.activeAcct){ G.activeAcct.ac=cad().ac; G.saveRoster(); }
};
H.acForAcct=a=>{ const v=a&&a.ac; return v&&v.id?{id:v.id,paint:Object.assign({},H.acById(v.id).paint,v.paint||{})}:null; };
/* new aircraft unlock as the cadet climbs the phases */
const prevAward=G.onAward;
G.onAward=function(pts){
 const now=G.save.points, before=now-pts, a=H.rank(before).i, b=H.rank(now).i;
 if(prevAward) prevAward(pts);
 for(const m of H.AC) if(m.req>a&&m.req<=b){ G.toast('NEW AIRCRAFT: '+m.name,C.info,{kind:'aircraft',tier:2,id:m.id,title:'NEW AIRCRAFT UNLOCKED',sub:m.name+' • open MY HANGAR to fly it',icon:'plane'}); cad().newAC=(cad().newAC||0)+1; G.persist(); }
};
})();
