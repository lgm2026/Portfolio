/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* HYPETEEN FLIGHT ACADEMY - HELICOPTER FIGURES (r7.4): the diagrams for the HELICOPTERS unit. Same 240 x 120 box and the
   same spec rules as every Ground School figure (see hfq_figs.js); each one registers with G.FIG.add(name, draw, zones).
     heli        a light helicopter, side view, nose right. o.labels (true or a list), o.hl = 'rotor' | 'mast' | 'engine' | 'cabin' | 'boom' | 'tailrotor' | 'skids'
     heliCtl     the three controls. o.labels; o.hl = 'cyclic' | 'collective' | 'pedals' also shows which way that control moves
     heliDisk    hover vs forward flight: the rotor's lift points square out of the rotor disk
     heliTorque  seen from above: the rotor turns one way, torque turns the body the other, the tail rotor pushes back
     heliTypes   ways to cancel torque. o.list of 'single' | 'tandem' | 'coaxial' | 'notar' | 'fenestron'; o.labels
     heliGround  hovering in ground effect vs out of ground effect
     heliETL     hovering in its own swirling air vs moving into clean air (translational lift)
     heliDissym  the advancing and retreating sides of the rotor disk in forward flight (seen from above)
     heliAuto    autorotation: air flows up through the rotor and keeps it turning, then the flare
     heliRoll    dynamic rollover: the helicopter pivots around a skid that is stuck on the ground (seen from the front)
     heliSafe    where to walk around a running helicopter
     ac          any aircraft in the fleet or the Hall, drawn from its profile: {f:'ac', id:'b737'} (Library covers)
   The drawings are diagrams, not any one model. Rotors turn counterclockwise seen from above, the way most American
   helicopters do, so the advancing blade is on the pilot's right.
   Facts: FAA Helicopter Flying Handbook (FAA-H-8083-21B, 2019); FAA Advisory Circular 91-32B, Safety In and Around Helicopters. */
(function(){
const C=G.C, PI=Math.PI, K=G.FIG.kit;
const {arrow,poly,circ,line,rr,labels,T,has,INK,MID,DIM,BODY,SURF,DARK,GLASS}=K;
const ACC=()=>C.accent, BLADE='#3a3f48', STRUT='#7d8590', AIR='#7cc7ff', GROUND='#33404f';
const hiFill=on=>on?G.rgba(C.accent,.35):null;

/* an arc with an arrowhead at its end (canvas angles: anticlockwise=true turns the way a clock does not) */
function arcArrow(c,cx,cy,r,a0,a1,acw,col,w){
 c.strokeStyle=col; c.lineWidth=w||1.6; c.lineCap='round'; c.beginPath(); c.arc(cx,cy,r,a0,a1,!!acw); c.stroke();
 const ex=cx+Math.cos(a1)*r, ey=cy+Math.sin(a1)*r, d=acw?-1:1, tx=-Math.sin(a1)*d, ty=Math.cos(a1)*d, h=4.2;
 c.fillStyle=col; c.beginPath(); c.moveTo(ex+tx*h,ey+ty*h); c.lineTo(ex-ty*h*.62,ey+tx*h*.62); c.lineTo(ex+ty*h*.62,ey-tx*h*.62); c.closePath(); c.fill();
}
function ground(c,y){ c.fillStyle=GROUND; c.fillRect(-2,y,244,124-y); line(c,-2,y,242,y,'#56657a',1); }

/* ============ the helicopter, side view (nose right, skids at y=106.5, mast at x=123) ============ */
function heliSide(c,o){
 o=o||{}; const P=k=>has(o,k)?ACC():null;
 // skids + cross tubes
 const sk=P('skids')||STRUT; c.strokeStyle=sk; c.lineCap='round'; c.lineWidth=2.4;
 c.beginPath(); c.moveTo(101,92); c.quadraticCurveTo(97,100,96,106); c.stroke();
 c.beginPath(); c.moveTo(151,93); c.quadraticCurveTo(155,100,155,106); c.stroke();
 c.lineWidth=2.8; c.beginPath(); c.moveTo(70,103.6); c.quadraticCurveTo(70,106.5,74,106.5); c.lineTo(166,106.5); c.quadraticCurveTo(175,106.5,178,99.5); c.stroke();
 // tail boom, stabilizer, fins
 poly(c,[[95,63],[26,57.5],[26,62.5],[95,76]],P('boom')||BODY,DIM,.7);
 c.beginPath(); c.moveTo(38,61.6); c.quadraticCurveTo(41,59.6,47,59.8); c.lineTo(57,61.2); c.lineTo(57,62.2); c.lineTo(41,63.4); c.quadraticCurveTo(38,63.2,38,61.6); c.fillStyle=P('boom')||SURF; c.fill(); c.strokeStyle=DIM; c.lineWidth=.5; c.stroke();
 poly(c,[[33,58],[19,35],[13,36],[22,62]],SURF,DIM,.7);
 poly(c,[[24,62],[17,73],[21,74],[30,62.5]],SURF,DIM,.6);
 // tail rotor
 const tr=P('tailrotor');
 circ(c,20,47,11,hiFill(tr)||'rgba(170,179,191,.16)',tr||MID,.8);
 c.save(); c.translate(20,47); c.rotate(-.5); rr(c,-11,-1.3,22,2.6,1.2,tr||BLADE); c.restore(); circ(c,20,47,2,DARK);
 // engine + transmission fairing (with the intake louvers and the exhaust)
 c.beginPath(); c.moveTo(92,60); c.quadraticCurveTo(94,47,104,45); c.lineTo(134,44); c.quadraticCurveTo(144,45,146,55); c.closePath();
 c.fillStyle=P('engine')||SURF; c.fill(); c.strokeStyle=DIM; c.lineWidth=.7; c.stroke();
 for(let i=0;i<3;i++) line(c,101+i*4,48.5,101+i*4,54,G.rgba('#000000',.25),1);
 rr(c,87.5,50,7,4,1.5,'#4a505a');
 // cabin
 c.beginPath(); c.moveTo(90,62); c.quadraticCurveTo(92,55,104,54); c.lineTo(142,52); c.bezierCurveTo(166,52,186,66,187,80); c.quadraticCurveTo(187,90,176,93); c.lineTo(104,95); c.quadraticCurveTo(90,94,89,82); c.closePath();
 c.fillStyle=P('cabin')||BODY; c.fill(); c.strokeStyle=DIM; c.lineWidth=.8; c.stroke();
 c.beginPath(); c.moveTo(146,54); c.bezierCurveTo(166,55,183,67,185,79); c.lineTo(166,79); c.quadraticCurveTo(160,64,146,58); c.closePath(); c.fillStyle=GLASS; c.fill();
 rr(c,118,61,22,15,3,GLASS); line(c,145,60,145,93,G.rgba('#000000',.18),.8);
 line(c,92,85,184,85,'#3d6fb0',1.6);
 // mast, swashplate, hub
 const ms=P('mast');
 rr(c,121,29,4,17,1,ms||'#5d6672');
 c.beginPath(); c.ellipse(123,40,7,1.8,0,0,PI*2); c.fillStyle=ms||'#8d96a2'; c.fill();
 rr(c,116,26.5,14,4.5,2,ms||DARK);
 // main rotor: two blades, seen edge-on
 const rb=P('rotor')||BLADE; c.fillStyle=rb;
 c.beginPath(); c.moveTo(118,27.6); c.lineTo(14,30.4); c.lineTo(14,32); c.lineTo(118,30.2); c.closePath(); c.fill();
 c.beginPath(); c.moveTo(128,27.6); c.lineTo(232,30.4); c.lineTo(232,32); c.lineTo(128,30.2); c.closePath(); c.fill();
 if(o.labels){
  const L={rotor:[66,30,66,13,'MAIN ROTOR','center'],mast:[125,38,166,13,'MAST + SWASHPLATE','center'],tailrotor:[12,52,14,94,'TAIL ROTOR','left'],
   boom:[60,62,50,104,'TAIL BOOM','center'],cabin:[160,72,212,90,'CABIN','center'],skids:[150,106.5,182,112,'SKIDS','left'],engine:[138,50,196,40,'ENGINE + GEARBOX','center']};
  labels(c,(o.labels===true?['rotor','mast','tailrotor','boom','cabin','skids']:o.labels).map(k=>L[k]).filter(Boolean));
 }
}
G.FIG.add('heli',heliSide,[['tailrotor',6,34,30,28],['boom',36,56,54,13],['mast',113,22,20,22],['rotor',10,18,100,15],['rotor',136,18,100,15],['engine',94,44,50,11],['cabin',88,56,100,40],['skids',66,97,116,13]]);
/* the same helicopter, small: centered on (x,y), turned by rot (nose down is +) */
function mini(c,x,y,s,rot,o){ c.save(); c.translate(x,y); if(rot) c.rotate(rot); c.scale(s,s); c.translate(-123,-66); heliSide(c,o||{}); c.restore(); }
/* where a point of the big drawing lands in a mini one */
function at(x,y,s,rot,px,py){ const dx=(px-123)*s, dy=(py-66)*s, cs=Math.cos(rot||0), sn=Math.sin(rot||0); return [x+dx*cs-dy*sn,y+dx*sn+dy*cs]; }

/* ============ the controls ============ */
G.FIG.add('heliCtl',function(c,o){
 o=o||{}; const P=k=>has(o,k)?ACC():null;
 rr(c,4,2,232,30,7,'#1b1f26','#3a404a');
 for(let i=0;i<5;i++){ const x=72+i*24; circ(c,x,17,7,'#0b0d10','#5d6672',.8); line(c,x,17,x+4.5*Math.cos(i*1.2+.3),17-4.5*Math.sin(i*1.2+.8),INK,1); }
 // anti-torque pedals
 for(const x of [80,134]){ rr(c,x,92,26,20,4,P('pedals')||'#3a3f48','#5d6672',.8); for(let i=0;i<3;i++) line(c,x+5,97+i*5,x+21,97+i*5,'#262a31',1.2); }
 // collective: a lever beside the seat on the pilot's left, twist-grip throttle on the end
 const cl=P('collective');
 c.strokeStyle=cl||'#454b55'; c.lineWidth=5; c.lineCap='round'; c.beginPath(); c.moveTo(18,114); c.lineTo(62,88); c.stroke();
 c.save(); c.translate(70,83.5); c.rotate(-.53); rr(c,-10,-4.2,20,8.4,3.5,cl?G.shade(C.accent,.8):'#2a2e35'); for(let i=0;i<4;i++) line(c,-6+i*4,-4,-6+i*4,4,'rgba(255,255,255,.12)',1); c.restore();
 circ(c,18,114,4,'#2a2e35','#5d6672',.8);
 // cyclic: the stick between the pilot's knees
 const cy=P('cyclic');
 rr(c,112,106,16,10,4,'#20242b');
 c.strokeStyle=cy||'#454b55'; c.lineWidth=4.4; c.beginPath(); c.moveTo(120,108); c.quadraticCurveTo(121,84,120,62); c.stroke();
 rr(c,113.5,48,13,17,5,cy?G.shade(C.accent,.8):'#2a2e35'); circ(c,120,51.5,1.8,'#d0322a'); circ(c,116.8,56,1.3,'#f2c14e');
 if(has(o,'cyclic')){ const a=C.accentHi; arrow(c,120,45,120,36,a,1.4,3); arrow(c,109,56,99,56,a,1.4,3); arrow(c,131,56,141,56,a,1.4,3); arrow(c,120,67,120,74,a,1.4,3); T('TILTS THE ROTOR DISK',146,42,4.8,a,'left'); T('ANY WAY YOU PUSH IT',146,50,4.4,MID,'left'); }
 if(has(o,'collective')){ const a=C.accentHi; c.save(); c.globalAlpha=.45; c.strokeStyle=a; c.lineWidth=4; c.setLineDash([3,3]); c.beginPath(); c.moveTo(18,114); c.lineTo(50,66); c.stroke(); c.restore();
  arcArrow(c,18,114,64,-.6,-.93,true,a,1.6); T('RAISE: MORE PITCH, CLIMB',8,38,4.8,a,'left'); T('LOWER: LESS PITCH, DESCEND',8,46,4.8,a,'left'); }
 if(has(o,'pedals')){ const a=C.accentHi; arrow(c,93,104,93,90,a,1.4,3); arrow(c,147,104,147,90,a,1.4,3); T('NOSE LEFT',93,80,4.6,a); T('NOSE RIGHT',147,80,4.6,a); }
 if(o.labels){ T('CYCLIC',132,62,5.4,MID,'left'); T('COLLECTIVE',10,94,5.4,MID,'left'); T('THROTTLE GRIP',46,70,4.6,MID,'center'); T('ANTI-TORQUE PEDALS',166,98,5,MID,'left'); }
},[['cyclic',108,36,26,56],['collective',8,72,74,44],['pedals',78,90,84,26]]);

/* ============ hover vs forward: lift points square out of the rotor disk ============ */
G.FIG.add('heliDisk',function(c,o){
 o=o||{}; const s=.4;
 line(c,120,6,120,114,'rgba(255,255,255,.12)',1,[3,3]);
 // hover
 mini(c,60,74,s,0); const h0=at(60,74,s,0,123,28);
 arrow(c,h0[0],h0[1]-2,h0[0],22,C.good,2,3.4); T('LIFT',h0[0]+4,24,5,C.good,'left');
 arrow(c,60,92,60,108,C.bad,2,3.4); T('WEIGHT',64,104,5,C.bad,'left');
 T('HOVER: DISK LEVEL',60,4,5.4,INK);
 // forward flight
 const r=.26; mini(c,180,74,s,r); const h1=at(180,74,s,r,123,28), ux=Math.sin(r), uy=-Math.cos(r);
 arrow(c,h1[0]+ux*2,h1[1]+uy*2,h1[0]+ux*36,h1[1]+uy*36,C.good,2,3.4); T('LIFT',h1[0]+ux*36+4,h1[1]+uy*36-2,5,C.good,'left');
 line(c,h1[0],h1[1],h1[0],h1[1]-34,'rgba(255,255,255,.35)',.8,[2,2]);
 arrow(c,h1[0]+ux*36-1,h1[1]+uy*36+6,h1[0]+ux*36+20,h1[1]+uy*36+6,C.accentHi,1.4,3);
 T('DISK TILTED FORWARD',180,4,5.4,INK); T('PULLS FORWARD',214,40,4.6,C.accentHi,'center');
},[['hover',2,2,116,116],['fwd',122,2,116,116]]);

/* ============ seen from above (nose right). R = rotor radius in drawing units ============ */
function heliTop(c,x,y,s,o){
 o=o||{}; const R=o.R||60;
 c.save(); c.translate(x,y); c.scale(s,s);
 line(c,-22,-14,28,-14,STRUT,2.4); line(c,-22,14,28,14,STRUT,2.4);
 poly(c,[[-14,-4.5],[-92,-2],[-92,2],[-14,4.5]],BODY,DIM,.6);
 rr(c,-80,-10,6,20,2,SURF,DIM,.5);
 rr(c,-98,-2.5,12,5,2,SURF,DIM,.5);
 rr(c,-100,-7.4,16,2.6,1.2,o.tr||BLADE);
 c.beginPath(); c.ellipse(4,0,26,13,0,0,PI*2); c.fillStyle=BODY; c.fill(); c.strokeStyle=DIM; c.lineWidth=.7; c.stroke();
 c.beginPath(); c.ellipse(16,0,13,10,0,-PI/2,PI/2); c.fillStyle=GLASS; c.fill();
 c.save(); c.rotate(o.blade==null?.5:o.blade); rr(c,-R,-2.2,R*2,4.4,2.2,BLADE); c.restore(); circ(c,0,0,3.2,DARK);
 c.restore();
}

/* ============ torque ============ */
G.FIG.add('heliTorque',function(c,o){
 o=o||{}; const cx=134, cy=60, s=.92;
 circ(c,cx,cy,54,'rgba(170,179,191,.07)','rgba(170,179,191,.25)',.8);
 heliTop(c,cx,cy,s,{R:58,tr:has(o,'tail')?ACC():null});
 arcArrow(c,cx,cy,50,-.15,-1.25,true,AIR,2); T('ROTOR TURNS',206,8,5,AIR,'center');
 arcArrow(c,cx+4,cy,20,-.9,.9,false,C.bad,2.2); T('TORQUE TURNS',236,90,4.8,C.bad,'right'); T('THE BODY',236,97,4.8,C.bad,'right'); line(c,cx+20,cy+12,200,90,G.rgba(C.bad,.6),.7);
 const tx=cx-93*s; arrow(c,tx,cy+2,tx,cy+26,C.good,2.4,3.6); T('TAIL ROTOR',tx,cy+30,4.8,C.good); T('PUSHES BACK',tx,cy+37,4.8,C.good);
 T('SEEN FROM ABOVE',4,4,5,MID,'left');
},[['tail',14,40,50,40],['body',110,44,56,32],['rotor',176,2,62,24]]);

/* ============ ways to cancel torque ============ */
const TY={};
TY.single=function(c,o){ mini(c,0,2,.44,0,o); };
TY.fenestron=function(c,o){ c.save(); c.translate(0,2); c.scale(.44,.44); c.translate(-123,-66);
  heliSide(c,o); poly(c,[[40,58],[16,30],[6,32],[10,66]],SURF,DIM,.8); circ(c,19,50,10,'#2a2e35',DIM,.8); circ(c,19,50,7.5,null,'#5d6672',.8);
  for(let i=0;i<8;i++){ const a=i*PI/4; line(c,19,50,19+Math.cos(a)*7,50+Math.sin(a)*7,'#8d96a2',1); } c.restore(); };
TY.tandem=function(c){
 rr(c,-32,-6,62,18,7,BODY,DIM,.6); poly(c,[[30,-4],[37,2],[30,12]],BODY,DIM,.6); poly(c,[[25,-3],[34,1],[32,5],[23,5]],GLASS);
 for(let i=0;i<5;i++) rr(c,-20+i*9,-1,5,4,1.2,GLASS);
 poly(c,[[-32,-6],[-30,-21],[-20,-21],[-15,-6]],SURF,DIM,.6); poly(c,[[18,-6],[20,-13],[28,-13],[30,-4]],SURF,DIM,.6);
 rr(c,-50,-23.2,48,2.4,1.2,BLADE); rr(c,2,-15.2,48,2.4,1.2,BLADE); circ(c,-26,-22,2,DARK); circ(c,24,-14,2,DARK);
 circ(c,-22,15,3.2,DARK); circ(c,-14,15,3.2,DARK); circ(c,22,15,3.2,DARK);
};
TY.coaxial=function(c){
 c.beginPath(); c.moveTo(-16,-8); c.lineTo(20,-10); c.quadraticCurveTo(32,-6,32,6); c.lineTo(28,14); c.lineTo(-14,14); c.closePath(); c.fillStyle=BODY; c.fill(); c.strokeStyle=DIM; c.lineWidth=.6; c.stroke();
 poly(c,[[22,-8],[31,-2],[31,4],[20,2]],GLASS); rr(c,-6,-4,8,7,1.5,GLASS); rr(c,5,-4,8,7,1.5,GLASS);
 poly(c,[[-14,-4],[-44,-2],[-44,3],[-14,8]],BODY,DIM,.6); rr(c,-50,-12,4,18,1.5,SURF,DIM,.5); rr(c,-41,-12,4,18,1.5,SURF,DIM,.5); rr(c,-50,-2,13,2.4,1,SURF);
 rr(c,-1,-18,14,8,3,SURF,DIM,.5); rr(c,4.5,-34,3,18,1,'#5d6672');
 rr(c,-34,-25,80,2.4,1.2,BLADE); rr(c,-34,-34,80,2.4,1.2,BLADE); circ(c,6,-24,2,DARK); circ(c,6,-33,2,DARK);
 circ(c,-6,18,3.2,DARK); circ(c,22,18,3.2,DARK);
};
TY.notar=function(c){
 c.beginPath(); c.ellipse(8,4,20,12,0,0,PI*2); c.fillStyle=BODY; c.fill(); c.strokeStyle=DIM; c.lineWidth=.6; c.stroke();
 c.beginPath(); c.ellipse(17,1,10,9,0,-PI/2,PI/2); c.fillStyle=GLASS; c.fill();
 poly(c,[[-8,-3],[-42,-1],[-42,6],[-8,11]],BODY,DIM,.6); rr(c,-48,-1.5,7,6,2,'#8d96a2',DIM,.5);
 rr(c,-41,-11,3,9,1,SURF,DIM,.4); rr(c,-41,6,3,7,1,SURF,DIM,.4); rr(c,-41,-2.5,9,2.4,1,SURF);
 for(let i=0;i<3;i++) arrow(c,-12-i*10,13,-15-i*10,19,AIR,1,2.2);
 arrow(c,-48,1.5,-55,1.5,AIR,1,2.2);
 rr(c,4,-14,4,6,1,'#5d6672'); rr(c,-30,-16,72,2.4,1.2,BLADE); circ(c,6,-15,2,DARK);
 line(c,-4,15,-6,21,STRUT,1.4); line(c,20,15,22,21,STRUT,1.4); line(c,-14,21,30,21,STRUT,1.8);
};
const TYN={single:'MAIN + TAIL ROTOR',fenestron:'FENESTRON',tandem:'TANDEM ROTORS',coaxial:'COAXIAL ROTORS',notar:'NOTAR'};
const tyList=o=>(o&&o.list)||['single','tandem','coaxial','notar'];
G.FIG.add('heliTypes',function(c,o){
 o=o||{}; const L=tyList(o), n=L.length, w=240/n;
 L.forEach((t,i)=>{ const cx=w*i+w/2, k=Math.min(1.1,w/104); c.save(); c.translate(cx,58); c.scale(k,k); (TY[t]||TY.single)(c,{}); c.restore();
  if(o.labels) G.wrap(TYN[t]||'',5,w-6,800).forEach((ln,j)=>T(ln,cx,96+j*7,5,MID)); });
},o=>tyList(o).map((t,i,a)=>{ const w=240/a.length; return [t,w*i+2,4,w-4,112]; }));

/* ============ ground effect ============ */
G.FIG.add('heliGround',function(c,o){
 o=o||{}; const s=.38, gy=100;
 ground(c,gy);
 line(c,120,4,120,gy-2,'rgba(255,255,255,.12)',1,[3,3]);
 // in ground effect: the downwash hits the ground and spreads out, a cushion
 if(has(o,'ige')){ rr(c,2,2,116,gy-4,6,G.rgba(C.accent,.12)); }
 if(has(o,'oge')){ rr(c,122,2,116,gy-4,6,G.rgba(C.accent,.12)); }
 for(const x of [28,92]){ arrow(c,x,60,x,90,AIR,1.6,2.8); }
 arrow(c,26,95,8,95,AIR,1.6,2.8); arrow(c,94,95,112,95,AIR,1.6,2.8);
 mini(c,60,74,s,0);
 T('IN GROUND EFFECT',60,103,5.2,INK); T('LOW: AN AIR CUSHION, LESS POWER',60,111,4.4,C.good);
 // out of ground effect: the downwash streams away; no cushion
 for(const x of [146,214]){ arrow(c,x,40,x,90,AIR,1.6,2.8); }
 for(const x of [140,220]){ c.strokeStyle=G.rgba(AIR,.8); c.lineWidth=1.1; c.beginPath(); c.arc(x,30,4.5,PI*.2,PI*1.8); c.stroke(); }
 mini(c,180,40,s,0);
 T('OUT OF GROUND EFFECT',180,103,5.2,INK); T('HIGH: NO CUSHION, MORE POWER',180,111,4.4,C.warn);
},[['ige',2,2,116,116],['oge',122,2,116,116]]);

/* ============ translational lift ============ */
G.FIG.add('heliETL',function(c,o){
 o=o||{}; const s=.38;
 line(c,120,4,120,114,'rgba(255,255,255,.12)',1,[3,3]);
 if(has(o,'hover')) rr(c,2,2,116,116,6,G.rgba(C.accent,.12));
 if(has(o,'fwd')) rr(c,122,2,116,116,6,G.rgba(C.accent,.12));
 // hover: the rotor keeps meeting the swirls it just made
 mini(c,60,60,s,0);
 c.strokeStyle=G.rgba(AIR,.85); c.lineWidth=1.2;
 for(const [x,d] of [[18,-1],[102,1]]){ c.beginPath(); c.ellipse(x,52,7,11,0,0,PI*2); c.stroke(); arrow(c,x+d*1,41,x+d*6,44,AIR,1.1,2.2); }
 for(const x of [40,80]) arrow(c,x,52,x,72,G.rgba(AIR,.7),1.2,2.4);
 T('HOVER',60,90,5.6,INK); T('THE ROTOR SITS IN ITS OWN',60,99,4.4,MID); T('SWIRLING AIR',60,106,4.4,MID);
 // moving forward: clean, undisturbed air flows in from ahead
 mini(c,174,60,s,.18);
 for(const y of [24,34,44]) arrow(c,236,y,218,y,AIR,1.4,2.6);
 T('16–24 KNOTS',180,90,5.6,INK); T('CLEAN AIR FROM AHEAD:',180,99,4.4,C.good); T('MORE LIFT, SAME POWER',180,106,4.4,C.good);
},[['hover',2,2,116,116],['fwd',122,2,116,116]]);

/* ============ dissymmetry of lift (seen from above, flying to the right; the advancing side is the pilot's right = the bottom) ============ */
G.FIG.add('heliDissym',function(c,o){
 o=o||{}; const cx=118, cy=60, R=50;
 if(has(o,'retreat')){ c.save(); c.beginPath(); c.arc(cx,cy,R,PI,PI*2); c.closePath(); c.fillStyle=G.rgba(C.accent,.25); c.fill(); c.restore(); }
 if(has(o,'advance')){ c.save(); c.beginPath(); c.arc(cx,cy,R,0,PI); c.closePath(); c.fillStyle=G.rgba(C.accent,.25); c.fill(); c.restore(); }
 circ(c,cx,cy,R,'rgba(170,179,191,.07)','rgba(170,179,191,.3)',.8);
 heliTop(c,cx,cy,.62,{R:R/.62,blade:.2});
 arcArrow(c,cx,cy,R-4,-.75,-2.35,true,C.warn,2);    // top half: blades sweeping back
 arcArrow(c,cx,cy,R-4,2.35,.75,true,C.good,2);      // bottom half: blades sweeping forward
 T('RETREATING SIDE',4,6,5.2,C.warn,'left'); T('BLADE MOVES BACK',4,14,4.4,MID,'left'); T('400 − 100 = 300 KT',4,21,4.6,INK,'left');
 T('ADVANCING SIDE',4,94,5.2,C.good,'left'); T('BLADE MOVES FORWARD',4,102,4.4,MID,'left'); T('400 + 100 = 500 KT',4,109,4.6,INK,'left');
 arrow(c,176,60,206,60,C.accentHi,2,3.4); T('FLYING',214,52,4.8,C.accentHi,'center'); T('100 KT',214,64,4.8,C.accentHi,'center');
 T('EXAMPLE: BLADE TIPS',236,96,4.2,MID,'right'); T('TURN AT 400 KT',236,103,4.2,MID,'right');
},[['retreat',2,2,236,56],['advance',2,62,236,56]]);

/* ============ autorotation ============ */
G.FIG.add('heliAuto',function(c,o){
 o=o||{}; const gy=108;
 ground(c,gy);
 line(c,40,40,196,98,'rgba(255,255,255,.25)',1,[3,3]);
 if(has(o,'flow')) rr(c,38,24,86,54,6,G.rgba(C.accent,.14));
 for(const x of [46,60,74,90,106]) arrow(c,x,76,x,30,G.rgba(AIR,.9),1.6,3);   // drawn first, so the body hides their middles
 mini(c,80,50,.36,.06);
 T('ENGINE OFF: AIR FLOWS UP',120,4,5.2,AIR); T('AND KEEPS THE ROTOR TURNING',120,11,5.2,AIR);
 mini(c,196,90,.26,-.32);
 T('FLARE',212,58,5.2,C.accentHi,'center'); T('THEN CUSHION',212,65,4.6,C.accentHi,'center');
 T('GLIDE',150,58,4.8,MID,'center');
},[['flow',38,24,86,54],['flare',160,70,78,38]]);

/* ============ dynamic rollover (seen from the front; the right skid is stuck) ============ */
G.FIG.add('heliRoll',function(c,o){
 o=o||{}; const px=152, py=104, th=.2, P=k=>has(o,k)?ACC():null;
 ground(c,py+1);
 c.save(); c.translate(px,py); c.rotate(th);
 // skids, cross tubes
 c.strokeStyle=STRUT; c.lineWidth=2.4; c.lineCap='round';
 c.beginPath(); c.moveTo(-1,-3); c.quadraticCurveTo(-4,-16,-16,-22); c.stroke(); c.beginPath(); c.moveTo(-55,-3); c.quadraticCurveTo(-52,-16,-40,-22); c.stroke();
 circ(c,-56,-3,3.4,'#5d6672'); circ(c,0,-3,3.4,P('pivot')||'#5d6672');
 // body, from the front
 rr(c,-48,-64,40,44,14,P('body')||BODY,DIM,.8);
 c.beginPath(); c.moveTo(-44,-50); c.quadraticCurveTo(-28,-66,-12,-50); c.lineTo(-14,-40); c.lineTo(-42,-40); c.closePath(); c.fillStyle=GLASS; c.fill();
 line(c,-28,-64,-28,-40,G.rgba('#000000',.25),1);
 rr(c,-31,-74,6,11,1.5,'#5d6672'); rr(c,-35,-77,14,4.6,2,DARK);
 rr(c,-118,-77,180,2.6,1.3,P('rotor')||BLADE);
 c.restore();
 // the pivot and the roll
 circ(c,px,py-3,4.4,null,C.bad,1.6);
 T('PIVOT: A STUCK SKID',px+8,py-12,4.8,C.bad,'left');
 arcArrow(c,px,py,94,-2.2,-1.75,false,C.bad,2.2); T('ROLL',100,6,5.2,C.bad,'center');
 T('SEEN FROM THE FRONT',4,112,4.6,MID,'left');
},[['pivot',138,90,28,22],['body',108,34,48,44],['rotor',40,0,62,22]]);

/* ============ safety around a running helicopter (FAA AC 91-32B) ============ */
G.FIG.add('heliSafe',function(c,o){
 o=o||{}; const cx=112, cy=60, s=.62, R=48;
 // the safe way in: the front and sides, where the pilot can see you
 c.save(); c.beginPath(); c.moveTo(cx,cy); c.arc(cx,cy,58,-PI*.62,PI*.62); c.closePath(); c.fillStyle=G.rgba(C.good,has(o,'safe')?.32:.16); c.fill(); c.restore();
 // the danger zone: everything near the tail
 const tx=cx-92*s;
 c.save(); c.beginPath(); c.moveTo(cx-18,cy); c.arc(cx-18,cy,64,PI*.8,PI*1.2); c.closePath(); c.fillStyle=G.rgba(C.bad,has(o,'tail')?.42:.24); c.fill(); c.restore();
 circ(c,tx,cy,18,G.rgba(C.bad,.25),G.rgba(C.bad,.8),1.2);
 circ(c,cx,cy,R,'rgba(170,179,191,.08)','rgba(170,179,191,.3)',.8);
 heliTop(c,cx,cy,s,{R:R/s,blade:.6});
 // a cadet walking in from the front, crouched
 circ(c,206,50,3.4,'#f2c14e'); rr(c,203,54,6,9,2.5,'#f2c14e'); arrow(c,198,58,178,60,'#f2c14e',1.4,2.8);
 T('APPROACH FROM THE FRONT',236,6,4.8,C.good,'right'); T('OR SIDE, IN THE PILOT’S VIEW,',236,13,4.6,C.good,'right'); T('AFTER THE PILOT SIGNALS',236,20,4.6,C.good,'right');
 T('CROUCH UNDER THE ROTOR',236,104,4.6,C.good,'right');
 T('NEVER NEAR',4,6,5.2,C.bad,'left'); T('THE TAIL ROTOR',4,13,5.2,C.bad,'left');
},[['tail',4,30,62,60],['safe',160,24,78,72]]);

/* ============ any aircraft by id (the same drawing as the hangar and the ID cards) ============ */
G.FIG.add('ac',function(c,o){
 const H=G.HFQ; if(!o||!o.id||!H.drawAC||!H.acById||H.acById(o.id).id!==o.id) return;
 try{ H.drawAC(c,o.id,0,0,240,120,null,{ground:true}); }catch(e){}
},[['ac',0,0,240,120]]);
})();
