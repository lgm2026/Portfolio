/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* AIRCRAFT PROFILES (r7.4): every aircraft side view, redrawn from its real dimensions.
   Until r7.3 most aircraft came from one generic parametric airplane, so a Warrior, a Cirrus and a Bonanza looked the same,
   fuselages were too deep, landing gear far too tall and taildraggers far too nose-high. Each profile is drawn in METERS
   (x aft from the tip of the nose, y up from the ground) from the type's published length, height and span and the
   positions of its wing, tail, gear, engines and cockpit; the kit fits it into the shared 240 x 120 box (nose right, wheels
   on y=104). Proportions therefore come from the aircraft, not from the box: qa/hfq_ac_audit.js measures every drawing
   against the length and height it claims (H.ACP[id].dims).
   A taildragger is drawn in its three-point attitude (att, degrees nose-up, about the main axle), and its tailwheel is put on
   the ground under the tail. Paint: p.body and p.stripe are the cadet's colours (the paint shop); everything else is fixed.
   House rules (as in hfq_aircraft2.js): no logos, no national markings, no weapons.
   API: H.ACP[id] = {dims:{L,H,span|rotor}, att?, main?:[x,r], draw(K)}  (profiles: hfq_profiles_fleet.js,
   hfq_profiles_hall.js). The kit K is built by H.makeProfileKit; H.drawAC uses a profile through the model's draw(). */
(function(){
const H=G.HFQ, PI=Math.PI, AK=H.acKit, shade=AK.shade, OUT=AK.OUT, STEEL=AK.STEEL;
const GLASS='#8cbce6', GLASS2='#3f6c9e';
H.ACP=H.ACP||{};

/* a context that draws nothing: the first pass of a profile only measures it */
const NOOP_GRAD={addColorStop(){}};
const NOOP=new Proxy({},{get:(t,k)=>k==='createLinearGradient'||k==='createRadialGradient'?()=>NOOP_GRAD:(k==='getTransform'?()=>({a:1,b:0,c:0,d:1,e:0,f:0}):()=>{}),set:()=>true});

function makeKit(c,p,o,fit,att){
 o=o||{}; const measure=!fit, s=fit?fit.s:1, B={x0:1e9,x1:-1e9,y0:1e9,y1:-1e9};
 const K={c,p,o,t:o.t||0,spin:o.prop==='spin',body:p.body,stripe:p.stripe,shade,s,measure,GLASS,GLASS2,OUT,STEEL};
 const A=att&&att.a?att:{a:0,px:0,py:0}, ca=Math.cos(A.a), sa=Math.sin(A.a); K.att=A;
 const rot=(x,y)=>{ if(!A.a) return [x,y]; const dx=x-A.px, dy=y-A.py; return [A.px+dx*ca+dy*sa, A.py+dy*ca-dx*sa]; };
 const scr=(x,y)=>{ if(measure){ if(x<B.x0) B.x0=x; if(x>B.x1) B.x1=x; if(y<B.y0) B.y0=y; if(y>B.y1) B.y1=y; return [0,0]; } return [fit.ox-x*s,104-y*s]; };
 K.rot=rot;
 K.oy=0;   // lifts the whole airframe (a floatplane sits on its floats)
 K.P=(x,y)=>{ const r=rot(x,y+K.oy); return scr(r[0],r[1]); };   // a point on the airframe (follows the attitude)
 K.G=(x,y)=>scr(x,y);                                       // a point fixed to the ground
 K.px=v=>measure?v:Math.max(.5,v*s);                         // a width in meters -> box units (never thinner than half a unit)
 K.bounds=()=>B;
 /* a smooth outline through points [x,y] (or [x,y,1] for a sharp corner); tangents from the neighbours, handles a third of
    the segment long, so uneven spacing never overshoots */
 K.trace=function(pts,closed,frame){ const T=frame==='g'?K.G:K.P, P=pts.map(q=>{ const r=T(q[0],q[1]); return {x:r[0],y:r[1],k:!!q[2]}; }), n=P.length; if(!n) return;
  c.beginPath(); c.moveTo(P[0].x,P[0].y); if(measure) return;
  const at=i=>P[(i+n)%n], tan=i=>{ const q=at(i); if(q.k||(!closed&&(i===0||i===n-1))) return null; const a=at(i-1), b=at(i+1), dx=b.x-a.x, dy=b.y-a.y, L=Math.hypot(dx,dy)||1; return {x:dx/L,y:dy/L}; };
  const segs=closed?n:n-1;
  for(let i=0;i<segs;i++){ const a=at(i), b=at(i+1), d=Math.hypot(b.x-a.x,b.y-a.y)/3, ta=tan(i), tb=tan(i+1);
   const c1=ta?[a.x+ta.x*d,a.y+ta.y*d]:[a.x+(b.x-a.x)/3,a.y+(b.y-a.y)/3], c2=tb?[b.x-tb.x*d,b.y-tb.y*d]:[b.x-(b.x-a.x)/3,b.y-(b.y-a.y)/3];
   c.bezierCurveTo(c1[0],c1[1],c2[0],c2[1],b.x,b.y); }
  if(closed) c.closePath(); };
 K.shape=function(pts,fill,stroke,lw,frame){ K.trace(pts,true,frame); if(measure) return; if(fill){ c.fillStyle=fill; c.fill(); } if(stroke!==null){ c.strokeStyle=stroke||OUT; c.lineWidth=lw||.7; c.stroke(); } };
 K.open=function(pts,col,w,frame){ K.trace(pts,false,frame); if(measure) return; c.strokeStyle=col||OUT; c.lineWidth=K.px(w||.03); c.lineCap='round'; c.stroke(); };
 K.poly=(pts,fill,stroke,lw)=>K.shape(pts.map(q=>[q[0],q[1],1]),fill,stroke,lw);
 K.line=function(x0,y0,x1,y1,col,w,frame){ const T=frame==='g'?K.G:K.P, a=T(x0,y0), b=T(x1,y1); if(measure) return; c.strokeStyle=col||OUT; c.lineWidth=K.px(w||.04); c.lineCap='round'; c.beginPath(); c.moveTo(a[0],a[1]); c.lineTo(b[0],b[1]); c.stroke(); };
 K.strut=(x0,y0,x1,y1,w,col)=>K.line(x0,y0,x1,y1,col||STEEL,w||.05);
 K.clip=function(pts,fn){ if(measure) return; c.save(); K.trace(pts,true); c.clip(); fn(); c.restore(); };
 /* the main body: the outline in the body colour, a soft top-light/belly-shade, then anything clipped inside (stripes, panels) */
 K.hull=function(pts,o2){ o2=o2||{}; K.shape(pts,o2.fill||K.body,OUT,.8); if(measure) return;
  let y0=1e9,y1=-1e9; for(const q of pts){ const r=K.P(q[0],q[1]); y0=Math.min(y0,r[1]); y1=Math.max(y1,r[1]); }
  K.clip(pts,()=>{ const g=c.createLinearGradient(0,y0,0,y1); g.addColorStop(0,'rgba(255,255,255,.2)'); g.addColorStop(.45,'rgba(255,255,255,0)'); g.addColorStop(.7,'rgba(0,0,0,0)'); g.addColorStop(1,'rgba(0,0,0,.22)'); c.fillStyle=g; c.fillRect(0,0,240,120);
   if(o2.inner) o2.inner(); }); };
 /* a band of constant thickness th hanging under a polyline of [x,y] (cheat lines, stripes) */
 K.band=(line,th)=>line.map(q=>[q[0],q[1]]).concat(line.slice().reverse().map(q=>[q[0],q[1]-th])).map((q,i,a)=>[q[0],q[1],(i===0||i===line.length-1||i===line.length||i===a.length-1)?1:0]);
 K.stripeIn=(pts,line,th,col)=>K.clip(pts,()=>K.shape(K.band(line,th),col||K.stripe,null));
 /* an airfoil seen edge-on: leading edge at le, chord ch, chord line at height y, thickness t (fattest near 30%) */
 K.foilPts=(le,ch,y,t)=>[[le,y,1],[le+ch*.05,y+t*.5],[le+ch*.3,y+t*.62],[le+ch*.72,y+t*.38],[le+ch,y+t*.05,1],[le+ch,y-t*.04,1],[le+ch*.62,y-t*.3],[le+ch*.25,y-t*.4],[le+ch*.05,y-t*.3]];
 K.foil=(le,ch,y,t,fill)=>K.shape(K.foilPts(le,ch,y,t),fill||shade(K.body,.93),OUT,.6);
 /* the near wing seen from the side: the root section, the tip section (higher with dihedral, further aft with sweep) and
    the surface between them */
 K.wing=function(w){ const t=w.t==null?w.c*.13:w.t, tc=w.tc==null?w.c:w.tc, tt=w.tt==null?t*tc/w.c:w.tt, tle=w.tle==null?w.le:w.tle, ty=w.ty==null?w.y:w.ty, f=w.fill||shade(K.body,.93);
  if(Math.abs(tle-w.le)>.01||Math.abs(ty-w.y)>.01){   // the surface between root and tip: lit at the leading edge, in shade toward the trailing edge
   const pts=[[w.le,w.y+t*.4,1],[tle,ty+tt*.4,1],[tle+tc,ty,1],[w.le+w.c,w.y,1]];
   K.trace(pts,true); if(!K.measure){ const a=K.P(w.le,w.y), b2=K.P(w.le+w.c,w.y), g=c.createLinearGradient(a[0],0,b2[0],0); g.addColorStop(0,shade(f,1.06)); g.addColorStop(1,shade(f,.84)); c.fillStyle=g; c.fill(); c.strokeStyle='rgba(20,22,26,.32)'; c.lineWidth=.45; c.stroke(); }
   K.line(w.le,w.y+t*.4,tle,ty+tt*.4,'rgba(255,255,255,.55)',Math.max(.02,t*.12)); }
  if(w.tipFirst!==false) K.shape(K.foilPts(tle,tc,ty,tt),shade(f,1.02),'rgba(20,22,26,.45)',.45);
  if(!w.noRoot) K.shape(K.foilPts(w.le,w.c,w.y,t),f,OUT,.6); };
 /* wheels: on the ground at x (radius r), or at an airframe point */
 K.wheel=function(x,r){ if(measure){ K.G(x-r,0); K.G(x+r,2*r); return; } const q=K.G(x,r); AK.wheel(c,q[0],q[1],r*s); };
 K.wheelAt=function(x,y,r){ if(measure){ K.P(x-r,y-r); K.P(x+r,y+r); return; } const q=K.P(x,y); AK.wheel(c,q[0],q[1],r*s); };
 /* a speed fairing around a ground wheel at x (radius r) */
 K.pant=function(x,r,col){ const L=r*3.2, h=r*1.18; K.shape([[x-L*.62,r+h*.02,1],[x-L*.38,r+h*.7],[x+L*.1,r+h*.86],[x+L*.38,r+h*.5],[x+L*.45,r-h*.1],[x+L*.2,r-h*.62],[x-L*.3,r-h*.5]],col||K.body,OUT,.6,'g');
  K.shape([[x-L*.5,r-h*.08,1],[x+L*.36,r-h*.08,1],[x+L*.36,r-h*.22,1],[x-L*.48,r-h*.22,1]],shade(col||K.body,.8),null,0,'g'); };
 /* a propeller: plane of rotation at x, hub height y, radius R, n blades */
 K.prop=function(x,y,R,n){ if(measure){ K.P(x,y); if(!o.noProp){ K.P(x,y+R); K.P(x,y-R); } return; } const q=K.P(x,y); c.save(); c.translate(q[0],q[1]); c.rotate(-A.a); AK.propDisc(c,0,0,R*s,o,n||2); c.restore(); };
 K.spinner=(x0,x1,y,r,fill)=>K.shape([[x0,y,1],[x0+(x1-x0)*.3,y+r*.72],[x0+(x1-x0)*.75,y+r*.98],[x1,y+r,1],[x1,y-r,1],[x0+(x1-x0)*.75,y-r*.98],[x0+(x1-x0)*.3,y-r*.72]],fill||K.stripe,OUT,.6);
 /* glass: a windshield, canopy or window, with a sky-to-dark gradient and a soft highlight */
 K.glass=function(pts,o2){ o2=o2||{}; K.trace(pts,true); if(measure) return; let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9; for(const q of pts){ const r=K.P(q[0],q[1]); x0=Math.min(x0,r[0]); x1=Math.max(x1,r[0]); y0=Math.min(y0,r[1]); y1=Math.max(y1,r[1]); }
  const g=c.createLinearGradient(0,y0,0,y1); g.addColorStop(0,o2.tint||GLASS); g.addColorStop(1,o2.tint2||GLASS2); c.fillStyle=g; c.fill(); c.strokeStyle=o2.frame||OUT; c.lineWidth=.6; c.stroke();
  if(o2.shine!==false&&y1-y0>1.2){ c.save(); c.clip(); c.fillStyle='rgba(255,255,255,.3)'; c.beginPath(); c.ellipse(x0+(x1-x0)*.55,y0+(y1-y0)*.3,(x1-x0)*.28,(y1-y0)*.16,-.18,0,PI*2); c.fill(); c.restore(); } };
 /* a row of n rounded windows, centres from x0 to x1, bottom at y, each w x h (meters) */
 K.windows=function(x0,x1,y,w,h,n,col){ for(let i=0;i<n;i++){ const x=n>1?x0+(x1-x0)*i/(n-1):x0; K.shape([[x-w/2,y+h*.2],[x-w/2,y+h*.8],[x,y+h],[x+w/2,y+h*.8],[x+w/2,y+h*.2],[x,y]],col||GLASS2,null); } };
 /* a jet engine pod: intake at x0 (front), exhaust at x1, centre height yc, radius r */
 K.pod=function(x0,x1,yc,r,o2){ o2=o2||{}; const L=x1-x0, f=o2.fill||shade(K.body,.95), rr=o2.rear==null?.6:o2.rear, fl=o2.flat||1;
  K.shape([[x0,yc+r*.94],[x0+L*.3,yc+r],[x0+L*.75,yc+r*.86],[x1,yc+r*rr,1],[x1,yc-r*rr,1],[x0+L*.75,yc-r*.86*fl],[x0+L*.3,yc-r*fl],[x0,yc-r*.94*fl]],f,OUT,.6);
  K.shape([[x0,yc+r*.9],[x0+Math.min(.15,L*.05),yc+r*.84],[x0+Math.min(.15,L*.05),yc-r*.84*fl],[x0,yc-r*.9*fl]],'#2a2d33',null);
  if(o2.core!==false) K.shape([[x1,yc+r*rr*.8,1],[x1+L*.1,yc+r*rr*.3],[x1+L*.14,yc,1],[x1+L*.1,yc-r*rr*.3],[x1,yc-r*rr*.8,1]],o2.coreCol||'#6d7680',OUT,.5);
  if(o2.lip!==false) K.shape([[x0,yc+r*.94,1],[x0+L*.07,yc+r*.99],[x0+L*.07,yc-r*.99*fl],[x0,yc-r*.94*fl,1]],shade(f,1.08),OUT,.4); };
 /* rotors: a main rotor seen edge-on (hub x,y, radius R, n blades), a tail rotor seen face-on (a disc) */
 K.rotor=function(x,y,R,n,o2){ o2=o2||{}; const hub=K.P(x,y), q0=K.P(x+R,y), q1=K.P(x-R,y); if(measure) return;
  if(K.spin){ c.save(); c.translate(hub[0],hub[1]); c.rotate(-A.a); c.scale(1,.055); const L=R*s, g=c.createRadialGradient(0,0,L*.08,0,0,L); g.addColorStop(0,'rgba(225,230,238,.05)'); g.addColorStop(.7,'rgba(225,230,238,.2)'); g.addColorStop(.95,'rgba(240,244,250,.5)'); g.addColorStop(1,'rgba(240,244,250,0)'); c.fillStyle=g; c.beginPath(); c.arc(0,0,L,0,PI*2); c.fill(); c.restore();
   for(let i=0;i<Math.min(3,n||2);i++){ const k=Math.cos(K.t*24+i*PI/(n||2)); c.strokeStyle='rgba(40,44,52,'+(.5-i*.14)+')'; c.lineWidth=1.5-i*.35; c.beginPath(); c.moveTo(hub[0]+(q0[0]-hub[0])*k,hub[1]+(q0[1]-hub[1])*k); c.lineTo(hub[0]-(q0[0]-hub[0])*k,hub[1]-(q0[1]-hub[1])*k); c.stroke(); } }
  else { const g=c.createLinearGradient(0,hub[1]-2,0,hub[1]+2); g.addColorStop(0,'#3a3f48'); g.addColorStop(1,'#1b1d22'); c.strokeStyle=g; c.lineWidth=Math.max(1.3,(o2.chord||.3)*s*.5); c.lineCap='round'; c.beginPath(); c.moveTo(q0[0],q0[1]+(o2.cone||.6)); c.lineTo(hub[0],hub[1]); c.lineTo(q1[0],q1[1]+(o2.cone||.6)); c.stroke(); c.fillStyle='#ffd24d'; c.fillRect(q0[0]-2.2,q0[1]+(o2.cone||.6)-.6,2.2,1.2); c.fillRect(q1[0],q1[1]+(o2.cone||.6)-.6,2.2,1.2); }
  AK.circ(c,hub[0],hub[1],Math.max(1.3,(o2.hub||.18)*s),'#3a3f48'); };
 K.trotor=function(x,y,R,n){ if(measure){ K.P(x-R,y-R); K.P(x+R,y+R); return; } const q=K.P(x,y), r=R*s;
  if(K.spin){ c.save(); c.globalAlpha=.32; AK.circ(c,q[0],q[1],r,'#cfd6de'); c.restore(); const a=K.t*30; c.strokeStyle='rgba(40,44,52,.55)'; c.lineWidth=1.1; c.beginPath(); c.moveTo(q[0]-Math.cos(a)*r,q[1]-Math.sin(a)*r); c.lineTo(q[0]+Math.cos(a)*r,q[1]+Math.sin(a)*r); c.stroke(); }
  else { c.strokeStyle='#2a2d33'; c.lineWidth=Math.max(1,r*.16); c.lineCap='round'; const nb=n||2; for(let i=0;i<nb;i++){ const a=.5+i*2*PI/nb; c.beginPath(); c.moveTo(q[0],q[1]); c.lineTo(q[0]+Math.cos(a)*r,q[1]+Math.sin(a)*r); c.stroke(); } }
  AK.circ(c,q[0],q[1],Math.max(1,r*.15),'#3a3f48'); };
 K.mark=(x,y,type)=>{ const q=K.P(x,y); if(!measure) AK.mark(c,q[0],q[1],type); };
 K.circ=(x,y,r,fill,stroke,lw)=>{ if(measure){ K.P(x-r,y-r); K.P(x+r,y+r); return; } const q=K.P(x,y); AK.circ(c,q[0],q[1],r*s,fill,stroke,lw); };
 K.ell=(x,y,rx,ry,fill,stroke,rotDeg)=>{ if(measure){ K.P(x-rx,y-ry); K.P(x+rx,y+ry); return; } const q=K.P(x,y); c.beginPath(); c.ellipse(q[0],q[1],rx*s,ry*s,-A.a-(rotDeg||0)*PI/180,0,PI*2); if(fill){ c.fillStyle=fill; c.fill(); } if(stroke){ c.strokeStyle=stroke; c.lineWidth=.6; c.stroke(); } };
 /* a taildragger's tailwheel: on the ground under the airframe point (x,y), with its fork */
 K.tailwheel=function(x,y,r,w){ const a=rot(x,y+K.oy); K.line(a[0],a[1],a[0]+r*.4,r,STEEL,w||.04,'g'); K.wheel(a[0]+r*.4,r); };
 /* a tail skid: from the airframe point (x,y) down and back to the ground */
 K.tailskid=function(x,y,len){ const a=rot(x,y+K.oy); K.line(a[0],a[1],a[0]+(len||.25),.02,'#6b5a44',.05,'g'); };
 /* a helicopter skid tube along the ground from x1 (rear) to x0 (front), tube radius r, curling up at the front */
 K.skid=function(x0,x1,r,up){ const u=up==null?.28:up; if(measure){ K.G(x0-u*.8,r+u); K.G(x1,0); return; } const a=K.G(x1,r), b=K.G(x0,r), e=K.G(x0-u*.8,r+u), m=K.G(x0-u*.75,r);
  c.strokeStyle=STEEL; c.lineWidth=Math.max(1.1,r*2*s); c.lineCap='round'; c.beginPath(); c.moveTo(a[0],a[1]); c.lineTo(b[0],b[1]); c.quadraticCurveTo(m[0],m[1],e[0],e[1]); c.stroke(); };
 return K;
}
H.makeProfileKit=makeKit;

/* ---------------- drawing a profile into the 240 x 120 box ---------------- */
function attOf(P){ const m=P.main||[0,0];
 if(P.hTop&&P.att==null){   // solve: rm + (y-rm)cos a - (x-xm) sin a = H  (the published three-point height)
  const [x,y]=P.hTop, H=P.dims.H; let lo=0, hi=.4; for(let i=0;i<40;i++){ const a=(lo+hi)/2, h=m[1]+(y-m[1])*Math.cos(a)-(x-m[0])*Math.sin(a); if(h>H) lo=a; else hi=a; } P.att=(lo+hi)/2*180/PI; }
 if(!P.att) return null; return {a:P.att*PI/180,px:m[0],py:m[1]}; }
H.profileExt=function(id,opt){ const P=H.ACP[id]; if(!P) return null; if(P._ext&&!opt) return P._ext;
 const K=makeKit(NOOP,{body:'#fff',stripe:'#000'},opt||{},null,attOf(P)); P.draw(K); const b=K.bounds(), e={x0:b.x0,x1:b.x1,y0:Math.min(0,b.y0),y1:b.y1};
 if(!opt) P._ext=e; return e; };   // opt.noProp: the airframe alone, without the propeller disc (qa/hfq_ac_audit.js)
H.drawProfile=function(c,id,p,o){ const P=H.ACP[id], e=H.profileExt(id), W=e.x1-e.x0, Hh=e.y1-Math.min(0,e.y0);
 const s=Math.min(226/W,(P.box||96)/Hh), ox=120+(e.x0+e.x1)/2*s;
 const K=makeKit(c,p,o,{s,ox},attOf(P)); P.draw(K); return K; };
/* every model with a profile draws through it (hfq_aircraft.js model(): m.draw wins) */
H.useProfiles=function(){ for(const m of H.allAC()) if(H.ACP[m.id]) m.draw=(c,mm,p,o)=>H.drawProfile(c,mm.id,p,o); };
})();
