/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* THE HALL OF FLIGHT, redrawn from real dimensions (r7.4), plus eight new rotorcraft. Kit: hfq_profiles.js (meters: x aft from
   the nose, y up from the ground). dims: published length, height and span (or rotor diameter); Lx = the drawn horizontal
   extent when a rotor reaches past the fuselage. Taildraggers sit in their three-point attitude (att). Military aircraft are
   shown as aircraft: no weapons, no turrets' guns, no insignia. The B-2 is drawn from below (its outline), the way a spotter
   sees it overhead; in a side view it is a featureless sliver. */
(function(){
const H=G.HFQ, PR=H.ACP, OUT='rgba(20,22,26,.55)', STEEL='#8d96a2', DARK='#2a2d33';
const sh=(c,k)=>G.shade(c,k);
const GL={tint:'#9fc6ea',tint2:'#46719e'};

/* ============================ PIONEERS ============================ */
/* WRIGHT FLYER (1903): L 6.4, H 2.8, span 12.3. Canard elevator in FRONT (right), pusher propellers behind the wings, twin rudders aft */
PR.wright={dims:{L:6.4,H:2.8,span:12.3},draw(K){ const cloth=K.body, wood=K.stripe;
 // the skids and the outriggers to the elevator
 K.open([[4.7,.06],[2.2,.06],[.9,.12],[.35,.42],[.25,.9]],wood,.06);
 K.strut(2.55,.82,.75,1.42,.035,wood); K.strut(2.55,2.62,.75,1.98,.035,wood); K.strut(4.6,.82,5.95,1.3,.035,wood); K.strut(4.6,2.62,5.95,1.95,.035,wood);
 // twin rudders (aft) and the biplane elevator (front)
 K.poly([[5.85,.95],[6.4,.95],[6.4,2.35],[5.85,2.35]],cloth,OUT,.6); K.line(6.12,.95,6.12,2.35,sh(cloth,.8),.02);
 K.foil(.3,.9,1.42,.08,cloth); K.foil(.3,.9,1.98,.08,cloth); K.strut(.75,1.42,.75,1.98,.03,wood);
 // main wings: chord 1.98, gap 1.83
 K.foil(2.55,1.98,.82,.12,cloth); K.foil(2.55,1.98,2.65,.12,cloth);
 for(const x of [2.62,4.45]) K.strut(x,.84,x,2.62,.035,wood);
 K.strut(2.62,.84,4.45,2.62,.012,'#5d4a32'); K.strut(2.62,2.62,4.45,.84,.012,'#5d4a32');   // bracing wires
 // engine, pilot (lying prone), chains and the two pusher propellers
 K.shape([[3.55,.95,1],[3.95,.95,1],[3.95,1.32,1],[3.55,1.32,1]],'#4a4f57',OUT,.5);
 K.shape([[2.75,.98],[3.45,1.0],[3.45,1.1],[2.75,1.1]],'#6b5a44',null); K.circ(2.68,1.05,.1,'#c9a27a');
 K.line(3.9,1.25,5.0,1.72,'#3a3f48',.02); K.prop(5.0,1.72,1.3,2);
}};

/* BLÉRIOT XI (1909): L 7.62, H 2.69, span 7.79. Anzani engine in the nose, cabane pylon above the wing, open-frame rear fuselage */
PR.bleriot={dims:{L:7.62,H:2.69,span:7.79},att:7,main:[1.0,.34],draw(K){ const cloth=K.body, wood=K.stripe;
 // the tail: rudder at the very end, tailplane with elevator tips
 K.shape([[6.95,1.05],[7.25,1.8],[7.5,1.9],[7.62,1.6],[7.55,1.05]],cloth,OUT,.6); K.foil(6.2,1.0,1.38,.06,cloth);
 // the open girder (rear fuselage)
 K.strut(2.4,1.95,7.0,1.5,.035,wood); K.strut(2.4,1.25,7.0,1.3,.035,wood);
 for(let i=0;i<=8;i++){ const x=2.6+i*.55, k=(x-2.4)/4.6; K.strut(x,1.95-.45*k,x,1.25+.05*k,.02,wood); if(i<8) K.strut(x,1.25+.05*k,x+.55,1.95-.45*((x+.55-2.4)/4.6),.012,'#7a6a52'); }
 // the covered front fuselage, pilot, wing
 K.hull([[.42,1.95],[1.0,2.0],[2.45,1.98,1],[2.45,1.22,1],[1.0,1.25],[.42,1.32]],{fill:cloth});
 K.circ(2.1,2.15,.13,'#6b4226'); K.wing({le:.75,c:2.0,y:1.88,t:.1});
 // cabane pylon + wires, landing frame, bicycle-style wheels, tail skid
 K.strut(1.25,1.98,1.4,2.69,.04,wood); K.strut(1.75,1.98,1.4,2.69,.04,wood);
 for(const x of [.85,2.6]) K.strut(1.4,2.69,x,1.9,.01,'#5d5d5d');
 K.strut(.75,1.25,1.0,.33,.045,wood); K.strut(1.65,1.25,1.0,.33,.045,wood); K.strut(.75,1.25,1.65,1.25,.04,wood);
 K.circ(1.0,.34,.34,null,'#2a2d33',1.4); for(let i=0;i<8;i++){ const a=i*Math.PI/4; K.line(1.0,.34,1.0+Math.cos(a)*.32,.34+Math.sin(a)*.32,'#8d96a2',.008); }
 K.tailskid(6.1,1.36,.3);
 // the three-cylinder fan engine and the propeller
 K.circ(.3,1.65,.28,'#5d6672',OUT,.6); for(let i=0;i<3;i++){ const a=-Math.PI/2+i*2*Math.PI/3; K.line(.3,1.65,.3+Math.cos(a)*.26,1.65+Math.sin(a)*.26,'#3a3f48',.06); }
 K.prop(.08,1.65,1.04,2);
}};

/* ============================ LIGHTER THAN AIR ============================ */
/* MONTGOLFIER BALLOON (1783): about 23 m tall, 15 m across; a gallery for the two aeronauts around the open neck */
PR.montgolfier={dims:{L:15.2,H:23.0},box:100,draw(K){ const blue=K.body, gold=K.stripe, cx=7.6;
 const env=[[cx,23.0],[cx-4.6,22.2],[cx-7.2,19.0],[cx-7.6,15.2],[cx-6.6,10.6],[cx-4.4,6.4],[cx-2.6,3.4,1],[cx+2.6,3.4,1],[cx+4.4,6.4],[cx+6.6,10.6],[cx+7.6,15.2],[cx+7.2,19.0],[cx+4.6,22.2]];
 K.hull(env,{fill:blue,inner:()=>{
  for(const [y,th] of [[19.4,.55],[15.5,.7],[11.0,.55],[7.2,.45]]) K.shape(K.band([[cx-8,y],[cx+8,y]],th),gold,null);
  for(let i=0;i<6;i++){ const x=cx-5+i*2; K.circ(x,13.2,.42,sh(gold,1.15)); K.circ(x,17.4,.36,sh(gold,1.1)); }
  for(let i=0;i<8;i++){ const x=cx-5.6+i*1.6; K.poly([[x-.45,9.6],[x+.45,9.6],[x,8.6]],sh(gold,.95),null); } }});
 K.poly([[cx-3.0,3.4],[cx+3.0,3.4],[cx+3.2,2.6],[cx-3.2,2.6]],'#8a6a3a',OUT,.6);   // the gallery
 K.poly([[cx-2.6,2.6],[cx+2.6,2.6],[cx+2.2,2.2],[cx-2.2,2.2]],'#6b5232',null);
 K.circ(cx-1.9,3.9,.28,'#6b4226'); K.circ(cx+1.9,3.9,.28,'#6b4226');
 K.ell(cx,3.0,.7,.35,'#ffb347'); K.ell(cx,3.25,.4,.3,'#ffe08a');
}};

/* LZ 129 HINDENBURG (1936): L 245, diameter 41.2. Cruciform fins, control car forward, four engine cars, passenger windows */
PR.hindenburg={dims:{L:245,H:44.7,dia:41.2},draw(K){ const sk=K.body, cl=23.5, R=20.6;
 const hull=[[0,cl],[3,cl+8.5],[12,cl+15.5],[30,cl+19.6],[60,cl+R],[120,cl+R],[160,cl+19.4],[195,cl+15.2],[225,cl+8.5],[245,cl,1],[225,cl-8.5],[195,cl-15.2],[160,cl-19.4],[120,cl-R],[60,cl-R],[30,cl-19.6],[12,cl-15.5],[3,cl-8.5]];
 // the upper and lower fins (the side fins are seen edge-on)
 K.poly([[193,cl+15.4],[204,cl+20.0],[236,cl+20.0],[243,cl+15.0],[244,cl+3.0],[228,cl+8.0]],sh(sk,.95),OUT,.6); K.poly([[193,cl-15.4],[204,cl-22.6],[236,cl-22.6],[243,cl-17.0],[244,cl-3.0],[228,cl-8.0]],sh(sk,.92),OUT,.6);
 K.hull(hull,{fill:sk,inner:()=>{ for(let x=15;x<240;x+=15) K.line(x,0,x,cl*2,'rgba(0,0,0,.07)',.4); for(let y=-16;y<=16;y+=6) K.line(0,cl+y,245,cl+y,'rgba(255,255,255,.07)',.3);
  K.windows(78,96,cl-17.6,1.0,1.3,10,'#3a5578'); }});
 K.poly([[193,cl+.5],[236,cl+.6],[244,cl+.2],[244,cl-.6],[193,cl-.9]],sh(sk,.88),OUT,.5);   // the near side fin, edge-on
 // control car + engine cars
 K.shape([[40,cl-R+.6],[42,cl-R-2.2],[55,cl-R-2.4],[57,cl-R-.2]],sh(sk,.85),OUT,.6); K.windows(43.5,53.5,cl-R-1.8,.9,.9,6,'#3a5578');
 for(const [x,y] of [[96,cl-19.2],[150,cl-18.0]]){ K.strut(x+2,y,x+3,y-3.4,.25,'#8d96a2'); K.shape([[x,y-3.4],[x+2,y-2.2],[x+7,y-2.4],[x+8.5,y-3.6],[x+7,y-4.8],[x+2,y-4.8]],sh(sk,.88),OUT,.5); K.prop(x-.6,y-3.6,2.6,2); }
 K.mark(60,cl+R,'beacon');
}};

/* ============================ WORLD WAR I ============================ */
/* SOPWITH CAMEL (1916): L 5.72, H 2.59, span 8.53. Rotary engine in a round cowl, the "hump", staggered wings. ~13 degrees on the ground */
PR.camel={dims:{L:5.72,H:2.59,span:8.53},att:13,main:[.95,.35],draw(K){ const b=K.body, st=K.stripe;
 K.shape([[4.75,1.3],[5.05,1.62],[5.35,1.95],[5.6,1.92],[5.72,1.55],[5.66,1.18,1],[5.1,1.15,1]],b,OUT,.6); K.foil(4.65,.95,1.3,.06,sh(b,.92));
 K.hull([[.3,1.78],[.85,1.95],[1.05,2.08],[1.55,2.06,1],[2.4,1.86],[5.3,1.38,1],[5.32,1.2,1],[3.0,1.0],[1.6,.92],[.8,.98],[.3,1.0]],{inner:()=>{ K.shape(K.band([[2.6,1.75],[5.3,1.35]],.06),st,null); }});
 K.circ(2.05,1.98,.12,'#6b4226');
 K.foil(1.2,1.37,.98,.12,sh(b,.82)); K.line(1.2,1.05,2.57,1.04,'rgba(255,255,255,.35)',.02);   // lower wing
 K.strut(1.95,1.9,1.65,2.36,.03); K.strut(1.6,1.95,1.25,2.36,.03);   // cabane
 K.foil(.78,1.37,2.42,.12,sh(b,.86)); K.line(.78,2.49,2.15,2.48,'rgba(255,255,255,.4)',.02);   // upper wing, staggered forward
 K.strut(1.45,1.25,1.05,2.38,.035); K.strut(2.35,1.22,2.0,2.38,.035); K.strut(1.45,1.25,2.0,2.38,.01,'#5d5d5d');
 K.strut(.55,1.0,.95,.35,.04); K.strut(1.35,.95,.95,.35,.04); K.wheel(.95,.35);
 K.tailskid(5.0,1.12,.22);
 K.shape([[.18,1.38],[.25,1.85],[.52,1.98],[.78,1.92],[.82,1.0],[.5,.92],[.25,1.0]],sh(b,.9),OUT,.6);   // the round cowl
 K.spinner(.02,.2,1.45,.12,'#5d6672'); K.prop(.12,1.45,1.3,2);
}};

/* FOKKER DR.I (1917): L 5.77, H 2.95, span 7.19. THREE wings, an "axle wing" between the wheels, comma-shaped rudder */
PR.dr1={dims:{L:5.77,H:2.95,span:7.19},att:12,main:[.98,.35],draw(K){ const b=K.body, st=K.stripe;
 K.shape([[5.1,1.25],[5.25,1.75],[5.5,2.05],[5.72,1.9],[5.77,1.4],[5.68,1.12,1],[5.15,1.1,1]],b,OUT,.6); K.foil(4.7,.85,1.26,.07,sh(b,.9));
 K.hull([[.32,1.86],[1.0,1.96],[1.7,1.94],[2.45,1.86],[5.2,1.32,1],[5.22,1.16,1],[3.0,.98],[1.6,.9],[.7,.95],[.32,1.04]],{});
 K.circ(2.0,2.02,.12,'#6b4226');
 K.foil(1.25,1.0,.9,.16,sh(b,.72)); K.line(1.25,.98,2.25,.97,'rgba(255,255,255,.4)',.025);   // lower wing
 K.foil(1.05,1.0,2.02,.16,sh(b,.74)); K.line(1.05,2.1,2.05,2.09,'rgba(255,255,255,.4)',.025);   // middle wing on top of the fuselage
 K.strut(1.3,2.1,1.18,2.62,.035); K.strut(1.8,2.1,1.68,2.62,.035);
 K.foil(.9,1.0,2.7,.16,sh(b,.78)); K.line(.9,2.78,1.9,2.77,'rgba(255,255,255,.45)',.025);    // upper wing
 K.strut(1.55,.95,1.25,2.66,.05,sh(b,.8));   // the I-strut
 K.strut(.6,1.0,.98,.4,.04); K.strut(1.35,.95,.98,.4,.04); K.foil(.75,.55,.35,.12,sh(b,.9)); K.wheel(.98,.35);
 K.tailskid(5.05,1.12,.2);
 K.shape([[.18,1.42],[.24,1.9],[.5,2.02],[.8,1.98],[.82,1.15],[.58,1.1]],sh(b,.85),OUT,.6);   // cowl, open at the bottom
 K.spinner(.02,.2,1.5,.11,'#5d6672'); K.prop(.12,1.5,1.3,2);
}};

/* SPAD S.XIII (1917): L 6.25, H 2.60, span 8.25. A flat round radiator face on the nose, two bays of struts */
PR.spad={dims:{L:6.25,H:2.6,span:8.25},att:11,main:[1.05,.36],draw(K){ const b=K.body, st=K.stripe;
 K.shape([[5.4,1.3],[5.6,1.75],[5.85,2.0],[6.1,1.95],[6.25,1.6],[6.2,1.2,1],[5.6,1.15,1]],b,OUT,.6); K.foil(5.2,1.0,1.3,.06,sh(b,.9));
 K.hull([[.12,1.95],[.8,2.05],[1.9,2.02],[2.7,1.9],[5.72,1.36,1],[5.75,1.18,1],[3.3,1.0],[1.8,.92],[.9,.98],[.12,1.1,1]],{inner:()=>{ for(let i=0;i<5;i++) K.line(.5+i*.12,1.3,.5+i*.12,1.85,'rgba(0,0,0,.25)',.02); }});
 K.shape([[.02,1.12,1],[.14,1.12,1],[.14,1.95,1],[.02,1.95,1]],'#7d8590',OUT,.5);   // the radiator face
 K.circ(2.3,2.06,.12,'#6b4226');
 K.wing({le:1.35,c:1.45,y:1.0,t:.1,tle:1.45,tc:1.4,ty:1.22});
 K.foil(1.0,1.5,2.48,.1,sh(b,.97));
 for(const [x0,x1] of [[1.55,1.25],[2.55,2.25],[1.95,1.65],[2.95,2.65]]) K.strut(x0,1.22,x1,2.5,.03,sh(b,.75));
 K.strut(.7,1.0,1.05,.36,.045); K.strut(1.55,.95,1.05,.36,.045); K.wheel(1.05,.36);
 K.tailskid(5.5,1.14,.2);
 K.prop(.0,1.55,1.25,2);
}};

/* ============================ WORLD WAR II ============================ */
/* SUPERMARINE SPITFIRE Mk I (1936): L 9.12, H 3.48, span 11.23. Long pointed Merlin nose, teardrop canopy, elliptical fin;
   its oval wing is best seen from below. Three-point attitude about 12 degrees */
PR.spitfire={dims:{L:9.12,H:3.48,span:11.23},att:12,main:[2.25,.33],draw(K){ const b=K.body, st=K.stripe;
 K.shape([[7.85,1.95],[8.1,2.5],[8.42,2.98],[8.72,3.06],[9.0,2.82],[9.12,2.2],[9.05,1.75,1],[8.3,1.72,1]],b,OUT,.6); K.line(8.75,3.0,8.85,1.78,sh(b,.75),.025);
 K.foil(7.9,1.15,1.78,.08,sh(b,.92));
 K.hull([[.62,1.62],[1.3,1.92],[2.6,1.98,1],[3.15,2.06],[4.2,2.0],[5.5,1.9],[8.9,1.82,1],[8.92,1.64,1],[6.0,1.25],[4.2,.98],[3.0,.95],[1.8,1.1],[.9,1.25],[.62,1.38]],{inner:()=>{
  K.shape(K.band([[3.0,1.42],[8.8,1.68]],.06),st,null); for(let i=0;i<6;i++) K.shape([[1.15+i*.2,1.62],[1.27+i*.2,1.62],[1.27+i*.2,1.52],[1.15+i*.2,1.52]],'#3a3f48',null); }});
 K.glass([[2.95,2.02,1],[3.15,2.36],[3.6,2.42],[4.05,2.32],[4.3,2.02,1]],GL);
 K.shape([[3.05,.98],[3.2,.72],[4.1,.72],[4.25,.96]],sh(b,.85),OUT,.5);   // radiator under the wing
 K.wing({le:2.0,c:2.5,y:1.06,t:.32,tle:2.6,tc:1.3,ty:1.42});
 K.strut(2.45,1.0,2.25,.4,.07); K.wheel(2.25,.33);
 K.tailwheel(8.45,1.55,.1);
 K.spinner(0,.7,1.62,.32,'#3a3f48'); K.prop(.5,1.62,1.64,2);
}};

/* HAWKER HURRICANE Mk I (1935): L 9.58, H 4.0, span 12.19. Humped back, canopy set high and far back, a big radiator scoop
   under the middle, fabric over the rear fuselage. About 11 degrees on the ground */
PR.hurricane={dims:{L:9.58,H:4.0,span:12.19},att:11,main:[2.4,.36],draw(K){ const b=K.body, st=K.stripe;
 K.shape([[7.9,2.2],[8.2,2.95],[8.6,3.45],[9.05,3.45],[9.45,3.0],[9.58,2.2],[9.5,1.8,1],[8.5,1.82,1]],b,OUT,.6); K.line(9.0,3.4,9.12,1.85,sh(b,.75),.025);
 K.foil(8.0,1.3,1.95,.1,sh(b,.92));
 K.hull([[.58,1.7],[1.3,2.08],[2.9,2.24,1],[3.5,2.5],[4.9,2.62],[6.0,2.45],[9.2,2.0,1],[9.22,1.8,1],[6.2,1.35],[4.5,1.1],[3.0,1.05],[1.8,1.12],[.9,1.3],[.58,1.46]],{inner:()=>{
  for(let i=0;i<9;i++) K.line(5.0+i*.45,2.55-i*.06,5.0+i*.45,1.2+i*.06,'rgba(0,0,0,.12)',.02);   // fabric over stringers
  K.shape(K.band([[3.2,1.62],[9.2,1.9]],.06),st,null); for(let i=0;i<6;i++) K.shape([[1.2+i*.22,1.78],[1.33+i*.22,1.78],[1.33+i*.22,1.68],[1.2+i*.22,1.68]],'#3a3f48',null); }});
 K.glass([[3.55,2.5,1],[3.75,2.86],[4.25,2.96],[4.85,2.86],[5.0,2.6,1]],GL);
 K.shape([[3.6,1.08],[3.75,.66],[4.75,.66],[4.95,1.12]],sh(b,.85),OUT,.5);   // the radiator scoop under the middle
 K.wing({le:2.1,c:2.6,y:1.15,t:.4,tle:2.6,tc:1.6,ty:1.55});
 K.strut(2.6,1.05,2.4,.42,.08); K.wheel(2.4,.36);
 K.tailwheel(8.75,1.7,.11);
 K.spinner(0,.62,1.7,.34,'#3a3f48'); K.prop(.45,1.7,1.7,3);
}};

/* AVRO LANCASTER (1941): L 21.18, H 6.25 (tail down), span 31.09. Four Merlins, TWIN oval fins, glazed nose and turrets (no guns) */
PR.lancaster={dims:{L:21.18,H:6.25,span:31.09},hTop:[20.3,6.75],main:[7.1,.86],draw(K){ const b=K.body, st=K.stripe;
 const fin=(x,dy,f)=>K.shape([[x,3.0+dy],[x+.3,5.0+dy],[x+.85,6.75+dy],[x+1.5,6.75+dy],[x+2.0,5.0+dy],[x+2.0,3.0+dy],[x+1.6,2.2+dy],[x+.6,2.25+dy]],f,OUT,.6);
 fin(19.15,.1,sh(b,.85));
 K.foil(17.6,3.2,3.95,.3,sh(b,.9));
 K.hull([[.2,2.95],[.9,3.6],[2.6,4.0],[4.2,4.2],[13,4.28],[17.8,4.15],[20.6,4.05,1],[20.62,3.4,1],[17.5,3.1],[13,2.4],[6,2.1],[2,2.2],[.6,2.5]],{inner:()=>{ K.shape(K.band([[0,3.25],[20.7,3.55]],.08),st,null); }});
 K.glass([[3.6,4.18,1],[4.1,4.78],[5.4,4.86],[6.2,4.6],[6.4,4.22,1]],GL);
 K.glass([[.1,2.9],[.25,3.4],[.8,3.6,1],[.9,2.55,1],[.4,2.4]],GL); K.circ(1.2,3.92,.42,GL.tint2,OUT,.5);
 K.circ(11.6,4.48,.48,GL.tint2,OUT,.5); K.ell(20.9,3.72,.5,.36,GL.tint2,OUT);
 K.wing({le:5.6,c:4.6,y:3.05,t:.75,tle:7.6,tc:2.2,ty:3.65});
 for(const [x0,yc,dy] of [[4.1,3.05,0],[4.8,3.3,.35]]){ K.shape([[x0,yc+.45],[x0+.8,yc+.62],[x0+3.4,yc+.5],[x0+4.2,yc+.1],[x0+3.4,yc-.4],[x0+.8,yc-.56],[x0,yc-.42]],sh(b,.95),OUT,.6); K.spinner(x0-.55,x0,yc,.3,'#3a3f48'); K.prop(x0-.2,yc,1.65+dy*.1,3); }
 K.strut(7.0,2.6,7.1,.9,.12); K.wheel(7.1,.86);
 K.tailwheel(19.4,3.15,.32,.08);
 fin(19.25,-.15,b);
}};

/* BOEING B-17G FLYING FORTRESS (1935): L 22.66, H 5.82 (tail down), span 31.62. Four radials and the huge dorsal fin (no guns shown) */
PR.b17={dims:{L:22.66,H:5.82,span:31.62},hTop:[20.6,7.42],main:[7.0,.71],draw(K){ const b=K.body, st=K.stripe;
 K.shape([[11.0,4.45],[16.0,4.85],[19.2,6.6],[20.3,7.38],[21.0,7.42],[21.8,7.1],[22.35,5.8],[22.3,3.95,1],[19.0,3.95,1]],b,OUT,.6); K.line(21.3,7.3,21.9,4.0,sh(b,.75),.03);
 K.foil(19.4,3.3,3.75,.3,sh(b,.92));
 K.hull([[0,2.95],[.6,3.5],[2.4,3.85],[4.3,4.05],[5.2,4.42,1],[6.6,4.55],[13,4.5],[19.2,4.2],[22.4,3.95,1],[22.66,3.6,1],[22.4,3.25,1],[19,3.0],[13,2.45],[6,2.15],[2,2.3],[.4,2.55]],{inner:()=>{ K.shape(K.band([[2.6,3.42],[13,3.5],[22.4,3.62]],.07),st,null); K.windows(13.2,13.9,3.3,.5,.48,2,'#2b4a6e'); }});
 K.glass([[0,2.95],[.15,3.4],[.65,3.7],[1.3,3.72,1],[1.3,2.45,1],[.5,2.4]],GL); K.circ(1.4,2.3,.35,sh(b,.85),OUT,.5);
 K.glass([[4.35,4.06,1],[4.95,4.45],[6.2,4.5,1],[6.2,4.1,1]],GL); K.circ(7.0,4.72,.42,GL.tint2,OUT,.5); K.circ(11.5,2.18,.55,sh(b,.8),OUT,.5); K.ell(22.4,3.6,.4,.3,GL.tint2,OUT);
 K.wing({le:5.4,c:5.2,y:2.75,t:.85,tle:8.1,tc:2.3,ty:3.45});
 for(const [x0,yc] of [[4.0,2.95],[4.9,3.25]]){ K.shape([[x0,yc+.55],[x0+1.0,yc+.65],[x0+3.6,yc+.4],[x0+4.4,yc+.05],[x0+3.6,yc-.42],[x0+1.0,yc-.6],[x0,yc-.55]],sh(b,.95),OUT,.6); K.circ(x0+.1,yc,.55,'#3a3f48',OUT,.4); K.prop(x0-.25,yc,1.75,3); }
 K.strut(6.9,2.4,7.0,.75,.12); K.wheel(7.0,.71);
 K.tailwheel(20.0,3.0,.3,.08);
}};

/* BOEING B-29 SUPERFORTRESS (1942): L 30.18, H 8.46, span 43.05. Round glazed nose with no step, four radials in long nacelles,
   tricycle gear, tall fin */
PR.b29={dims:{L:30.18,H:8.46,span:43.05},draw(K){ const b=K.body, st=K.stripe;
 K.shape([[19.5,4.85],[24.5,5.3],[27.3,8.2],[28.0,8.46,1],[29.0,8.4,1],[29.7,7.2],[30.0,5.2,1],[27.0,5.0,1]],b,OUT,.6); K.line(28.8,8.3,29.4,5.2,sh(b,.75),.035);
 K.wing({le:26.3,c:3.6,y:4.95,t:.35,tle:28.6,tc:1.5,ty:5.6});
 K.hull([[0,3.6],[.5,4.5],[2.0,5.1],[4.0,5.3],[26,5.3],[29.6,5.1,1],[30.18,4.75,1],[29.8,4.35,1],[26,3.95],[8.0,2.55],[3.0,2.6],[.8,2.95]],{inner:()=>{ K.shape(K.band([[0,3.75],[30,4.6]],.09),st,null); K.windows(15.0,16.2,3.6,.5,.5,2,'#2b4a6e'); }});
 K.glass([[0,3.6],[.4,4.55],[1.6,5.1],[2.9,5.22,1],[2.9,3.0,1],[1.0,2.9],[.25,3.2]],GL); K.line(1.5,5.1,1.5,2.95,sh(b,.7),.03); K.line(.7,4.75,2.9,4.1,sh(b,.7),.025);
 for(const [x,y] of [[7.5,5.45],[17.0,5.42],[18.0,2.75],[27.2,5.15]]) K.circ(x,y,.38,GL.tint2,OUT,.4);   // sighting blisters and turret domes
 K.wing({le:10.8,c:5.6,y:3.35,t:.75,tle:13.7,tc:2.3,ty:4.1});
 for(const [x0,yc] of [[8.6,3.35],[9.5,3.62]]){ K.shape([[x0,yc+.6],[x0+1.2,yc+.72],[x0+6.4,yc+.45],[x0+7.6,yc+.05],[x0+6.4,yc-.48],[x0+1.2,yc-.68],[x0,yc-.6]],sh(b,.96),OUT,.6); K.circ(x0+.1,yc,.6,'#3a3f48',OUT,.4); K.prop(x0-.3,yc,2.5,4); }
 K.strut(3.6,2.7,3.6,.5,.14); K.wheel(3.4,.48); K.wheel(3.8,.48);
 K.strut(14.4,2.9,14.4,.8,.18); K.wheel(14.0,.72); K.wheel(14.8,.72);
}};

/* DOUGLAS DC-3 (1935) and C-47 SKYTRAIN (1941): L 19.66, H 5.16 (tail down), span 28.96. Two radials, a tailwheel; the C-47
   adds an astrodome and the big cargo door. Drawn level, then rested on its tailwheel at the angle the published height gives */
function dc3(K,mil){ const b=K.body, st=K.stripe;
 const fin=[[13.6,3.95],[15.6,4.3],[17.2,5.6],[18.0,6.28],[18.7,6.35],[19.3,5.6],[19.6,4.2],[19.55,3.4,1],[17.0,3.38,1]];
 K.shape(fin,b,OUT,.6); K.line(18.6,6.3,19.25,3.45,sh(b,.75),.03);
 K.foil(16.5,3.0,3.5,.26,sh(b,.92));
 const hull=[[0,2.45],[.35,3.05],[1.2,3.55],[2.3,3.84,1],[3.3,4.06],[5.0,4.12],[12,4.05],[16,3.78],[19.0,3.45,1],[19.66,3.18,1],[19.3,2.9,1],[16,2.55],[11,1.85],[7,1.58],[3,1.62],[1.2,1.9],[.3,2.2]];
 K.hull(hull,{inner:()=>{
  K.shape(K.band([[0,2.62],[8,2.68],[19.6,3.2]],.13),st,null);
  if(mil){ for(let i=0;i<5;i++){ const x=6.0+i*1.1; K.shape([[x-.24,2.95,1],[x+.24,2.95,1],[x+.24,3.42,1],[x-.24,3.42,1]],'#2b4a6e',null); }
   K.poly([[12.9,3.72],[14.8,3.66],[14.8,2.18],[12.9,2.3]],null,'rgba(20,22,26,.55)',.6); K.line(13.85,3.7,13.85,2.25,'rgba(20,22,26,.55)',.04); }
  else { for(let i=0;i<7;i++){ const x=5.6+i*1.17; K.shape([[x-.3,2.92,1],[x+.3,2.92,1],[x+.3,3.45,1],[x-.3,3.45,1]],'#2b4a6e',null); } K.line(14.4,3.72,14.4,2.3,'rgba(20,22,26,.5)',.04); } }});
 K.glass([[1.45,3.45,1],[2.25,3.8,1],[2.4,3.8,1],[2.4,3.3,1],[1.6,3.25,1]],GL); K.glass([[2.5,3.8,1],[3.2,3.82,1],[3.2,3.35,1],[2.5,3.32,1]],GL);
 if(mil) K.ell(4.9,4.2,.32,.18,GL.tint2,OUT);
 K.wing({le:3.6,c:4.4,y:1.86,t:.62,tle:7.0,tc:1.6,ty:2.95});
 K.shape([[1.9,2.95],[2.6,3.2],[5.6,3.05],[6.9,2.55],[5.6,1.95],[2.6,1.85],[1.9,2.1]],sh(b,.95),OUT,.6);   // the near nacelle
 K.circ(1.92,2.52,.66,'#3a3f48',OUT,.4); K.circ(1.92,2.52,.42,'#5d6672'); K.prop(1.62,2.52,1.76,3);
 K.strut(4.5,1.9,4.6,.66,.13); K.wheel(4.6,.62);
 K.tailwheel(17.6,2.75,.26,.07);
}
PR.dc3={dims:{L:19.66,H:5.16,span:28.96},hTop:[18.7,6.35],main:[4.6,.62],draw:K=>dc3(K,false)};
PR.c47={dims:{L:19.43,H:5.16,span:28.96},hTop:[18.7,6.35],main:[4.6,.62],draw:K=>dc3(K,true)};

/* ============================ AIRLINERS ============================ */
/* a jet airliner hull: fuselage radius r, centre height yc, nose to tail length L; tail cone sweeps up to yt */
function liner(K,o){ const b=K.body, st=K.stripe, L=o.L, yc=o.yc, r=o.r, top=yc+r, bot=yc-r, t0=o.taper;
 const pts=[[0,yc-r*.25],[r*.18,yc+r*.32],[r*.8,yc+r*.72],[r*1.9,top-.05],[r*3,top],[t0,top],[L-r*.5,o.yt+r*.32,1],[L,o.yt,1],[L-r*.2,o.yt-r*.2,1],[L-r*2.4,o.yt-r*.55],[t0-r*1.2,bot+r*.05],[t0-r*3,bot],[r*3,bot],[r*1.2,bot+r*.18],[r*.4,bot+r*.5]];
 K.hull(pts,{inner:()=>{ K.shape(K.band([[0,yc+r*.05],[t0,yc+r*.05],[L,o.yt+r*.05]],r*.14),st,null); K.shape(K.band([[0,yc-r*.25],[t0-r*2,yc-r*.25],[L,o.yt-r*.3]],r*.07),sh(st,1.3),null); if(o.inner) o.inner(); }});
 K.glass([[r*.95,yc+r*.6,1],[r*1.6,yc+r*.84,1],[r*2.25,yc+r*.84,1],[r*2.25,yc+r*.56,1]],{tint:'#3a5578',tint2:'#1e2c40',shine:false});
}
/* BOEING 707-320B (1957): L 46.61, H 12.93, span 44.42. Four engines on pylons, a thin HF antenna probe ahead of the fin tip */
PR.b707={dims:{L:46.61,H:12.93,span:44.42},draw(K){ const b=K.body, st=K.stripe;
 K.shape([[32.0,5.6],[37.6,6.2],[43.6,12.5],[44.3,12.75,1],[45.6,12.7,1],[46.4,6.8],[45.6,5.3,1],[39.0,5.3,1]],st,OUT,.7); K.line(45.4,12.6,46.2,6.4,sh(st,.75),.06);
 K.line(44.0,12.78,41.6,12.92,'#5d6672',.1);   // the HF probe
 K.wing({le:39.5,c:5.2,y:5.05,t:.5,tle:43.6,tc:1.8,ty:6.4,fill:sh(b,.92)});
 liner(K,{L:46.61,yc:3.65,r:1.88,taper:33,yt:5.2,inner:()=>{ K.line(4.8,5.0,4.8,2.2,sh(b,.72),.06); K.line(38.0,5.0,38.0,3.4,sh(b,.72),.06); }});
 K.windows(7.0,36.0,3.85,.26,.36,44);
 K.wing({le:16.8,c:8.6,y:2.35,t:.95,tle:27.6,tc:2.2,ty:4.0});
 K.poly([[14.0,2.0],[17.0,2.25],[18.0,1.7],[15.0,1.6]],sh(b,.9),OUT,.5); K.pod(12.3,17.4,1.5,.72,{rear:.7});
 K.poly([[19.5,2.9],[22.3,3.2],[23.2,2.6],[20.5,2.45]],sh(b,.9),OUT,.5); K.pod(17.9,22.9,2.35,.72,{rear:.7});
 K.strut(6.5,1.85,6.5,.5,.18); K.wheel(6.3,.47); K.wheel(6.7,.47);
 K.strut(24.0,1.8,24.0,.8,.22); K.wheel(23.2,.58); K.wheel(24.8,.58);
}};

/* BOEING 747-100 (1969): L 70.6, H 19.3, span 59.6. The hump of the upper deck, four big fanjets */
PR.b747={dims:{L:70.6,H:19.3,span:59.6},draw(K){ const b=K.body, st=K.stripe;
 K.shape([[50.5,9.2],[57.5,10.0],[65.8,18.9],[66.6,19.3,1],[68.6,19.2,1],[70.2,10.4],[69.0,8.6,1],[60.0,8.4,1]],st,OUT,.7); K.line(68.3,19.0,69.8,10.2,sh(st,.75),.08);
 K.wing({le:61.0,c:7.4,y:8.3,t:.7,tle:66.6,tc:2.6,ty:10.6,fill:sh(b,.92)});
 liner(K,{L:70.6,yc:5.8,r:3.25,taper:52,yt:8.4,inner:()=>{ K.line(7.0,8.2,7.0,3.6,sh(b,.72),.08); K.line(57.0,8.6,57.0,5.8,sh(b,.72),.08); }});
 // the upper deck: the hump
 K.hull([[4.0,8.0],[6.2,9.95],[9.5,10.9],[16.0,11.0],[21.5,10.4],[25.5,9.05,1],[25.0,8.5,1],[4.0,8.5,1]],{inner:()=>{ K.shape(K.band([[3,9.52],[26,9.52]],.25),st,null); }});
 K.glass([[5.6,9.55,1],[6.9,10.3,1],[8.0,10.3,1],[8.0,9.55,1]],{tint:'#3a5578',tint2:'#1e2c40',shine:false}); K.windows(10.5,17.5,9.95,.4,.5,6);
 K.windows(10.0,55.0,5.95,.38,.52,58);
 K.wing({le:25.0,c:13.0,y:3.7,t:1.3,tle:42.0,tc:3.8,ty:6.6});
 K.poly([[21.5,3.4],[26.0,3.7],[27.2,2.7],[23.0,2.5]],sh(b,.9),OUT,.5); K.pod(18.8,25.6,2.35,1.3,{rear:.62});
 K.poly([[29.5,4.7],[33.4,5.0],[34.6,4.1],[31.0,3.9]],sh(b,.9),OUT,.5); K.pod(26.8,33.6,3.7,1.3,{rear:.62});
 K.strut(7.8,2.7,7.8,.7,.25); K.wheel(7.5,.6); K.wheel(8.1,.6);
 K.strut(33.6,2.9,33.6,1.2,.32); K.wheel(32.7,.62); K.wheel(34.5,.62);
 K.strut(37.8,2.6,37.8,1.2,.32); K.wheel(36.9,.62); K.wheel(38.7,.62);
}};

/* AIRBUS A320 (1987): L 37.57, H 11.76, span 34.10 (wingtip fences). Rounded nose, two fanjets slung low and forward */
PR.a320={dims:{L:37.57,H:11.76,span:34.1},draw(K){ const b=K.body, st=K.stripe;
 K.shape([[25.6,5.15],[29.6,5.75],[34.4,11.5],[34.8,11.76,1],[36.4,11.7,1],[37.2,6.3],[36.6,5.0,1],[31.0,4.95,1]],st,OUT,.7); K.line(36.0,11.6,36.9,6.0,sh(st,.75),.06);
 K.wing({le:31.8,c:4.0,y:4.65,t:.4,tle:34.9,tc:1.5,ty:6.2,fill:sh(b,.92)});
 liner(K,{L:37.57,yc:3.25,r:2.05,taper:25.5,yt:4.75,inner:()=>{ K.line(4.6,4.9,4.6,1.7,sh(b,.72),.05); K.line(33.0,5.0,33.0,3.0,sh(b,.72),.05); }});
 K.windows(6.4,29.0,3.48,.26,.38,32);
 K.wing({le:13.4,c:6.4,y:1.7,t:.72,tle:20.5,tc:1.3,ty:3.6});
 K.poly([[20.9,3.2],[21.4,4.6],[21.9,4.6],[22.0,3.3],[21.6,2.7],[21.2,2.7]],sh(b,.94),OUT,.5);   // the wingtip fence
 K.poly([[11.6,2.0],[14.6,2.2],[15.6,1.6],[12.2,1.55]],sh(b,.9),OUT,.5); K.pod(9.4,14.4,1.55,1.05,{rear:.62});
 K.strut(5.0,1.3,5.0,.4,.15); K.wheel(4.8,.37); K.wheel(5.2,.37);
 K.strut(17.6,1.3,17.6,.6,.2); K.wheel(17.2,.58); K.wheel(18.0,.58);
}};

/* CONCORDE (1969): L 61.66, H 12.2, span 25.6. Needle nose (shown drooped for taxiing), slender delta wing, engines in two
   boxes under it, no horizontal tail, a tall fin */
PR.concorde={dims:{L:61.66,H:12.2,span:25.6},draw(K){ const b=K.body, st=K.stripe, yc=5.6, r=1.45;
 K.shape([[48.0,yc+1.2],[51.5,yc+1.6],[57.6,12.0],[58.4,12.2,1],[59.6,12.15,1],[61.4,yc+1.8],[60.5,yc+.9,1],[54.0,yc+.9,1]],b,OUT,.7); K.line(59.4,12.0,60.9,yc+1.8,sh(b,.75),.06);
 K.stripeIn([[48.0,yc+1.2],[51.5,yc+1.6],[57.6,12.0],[58.4,12.2,1],[59.6,12.15,1],[61.4,yc+1.8],[60.5,yc+.9,1],[54.0,yc+.9,1]],[[50,yc+3.3],[62,yc+3.3]],.5,st);
 const hull=[[0,yc-.75,1],[2.6,yc+.25],[6.0,yc+.95],[8.4,yc+1.3],[9.6,yc+1.42],[14,yc+r],[50,yc+r],[58,yc+1.1],[61.66,yc+.6,1],[61.4,yc+.2,1],[56,yc-.9],[48,yc-r],[14,yc-r],[9.0,yc-1.3],[5.0,yc-1.0]];
 K.hull(hull,{inner:()=>{ K.shape(K.band([[6,yc+.2],[61,yc+.2]],.18),st,null); K.windows(13.5,46.0,yc+.05,.2,.32,40); K.line(10.6,yc+1.4,10.6,yc-1.2,sh(b,.72),.05); }});
 K.glass([[7.6,yc+1.05,1],[8.6,yc+1.36,1],[9.6,yc+1.38,1],[9.6,yc+1.06,1]],{tint:'#3a5578',tint2:'#1e2c40',shine:false});
 K.shape([[22.0,yc-1.4],[36.0,yc-1.25],[52.0,yc-1.05],[58.6,yc-.85,1],[58.4,yc-1.2,1],[50.0,yc-1.65],[34.0,yc-1.75],[22.0,yc-1.5]],sh(b,.92),OUT,.6);   // the delta, edge-on
 K.poly([[37.0,yc-1.6],[51.6,yc-1.55],[52.8,yc-2.3],[51.6,yc-2.85],[37.8,yc-2.85],[36.6,yc-2.6]],sh(b,.9),OUT,.6);   // the engine boxes
 K.shape([[36.6,yc-1.65,1],[37.4,yc-1.65,1],[37.4,yc-2.75,1],[36.6,yc-2.75,1]],'#2a2d33',null); K.shape([[52.6,yc-2.0,1],[53.5,yc-2.1,1],[53.5,yc-2.6,1],[52.6,yc-2.55,1]],'#5d6672',OUT,.4);
 K.strut(15.5,yc-1.3,15.5,.55,.18); K.wheel(15.3,.5); K.wheel(15.7,.5);
 K.strut(37.5,yc-2.8,37.5,.7,.25); K.wheel(36.8,.6); K.wheel(38.2,.6);
}};

/* ============================ JETS ============================ */
/* MIG-21 (1955): L 15.0, H 4.13, span 7.15. Round nose intake with a cone, a delta wing, a tall swept fin, a dorsal spine */
PR.mig21={dims:{L:15.0,H:4.13,span:7.15},draw(K){ const b=K.body, st=K.stripe, yc=2.05;
 K.shape([[9.6,yc+.65],[11.6,yc+.95],[13.4,4.0],[13.65,4.13,1],[14.25,4.13,1],[14.6,yc+1.0],[14.5,yc+.5,1],[12.5,yc+.5,1]],b,OUT,.7); K.line(14.15,4.08,14.42,yc+.85,sh(b,.75),.03);
 K.shape([[12.7,yc-.55],[13.4,yc-.75],[14.1,yc-1.25],[14.4,yc-1.2],[14.3,yc-.5]],sh(b,.9),OUT,.5);   // ventral fin
 K.wing({le:12.4,c:1.9,y:yc-.25,t:.1,tle:13.9,tc:.75,ty:yc-.25,fill:sh(b,.9)});
 K.hull([[0,yc+.35,1],[.6,yc+.48],[3.0,yc+.6],[3.4,yc+.62],[5.2,yc+.85],[9.5,yc+.75],[14.6,yc+.48,1],[14.65,yc-.45,1],[12.0,yc-.55],[8.0,yc-.68],[3.0,yc-.6],[.6,yc-.48],[0,yc-.35,1]],{inner:()=>{ K.shape(K.band([[3,yc-.05],[14.7,yc+.02]],.06),st,null); }});
 K.shape([[0,yc+.35,1],[.02,yc-.35,1],[-.06,yc,1]],'#2a2d33',null); K.shape([[-.05,yc+.2],[-.45,yc+.05],[-.6,yc,1],[-.45,yc-.05],[-.05,yc-.2]],'#9aa3ad',OUT,.5);   // the intake and its shock cone
 K.glass([[3.25,yc+.6,1],[3.6,yc+1.02],[4.4,yc+1.1],[5.0,yc+.92],[5.2,yc+.82,1]],GL);
 K.shape([[14.6,yc+.4,1],[15.0,yc+.32,1],[15.0,yc-.32,1],[14.6,yc-.4,1]],'#3a3f48',OUT,.4);
 K.wing({le:5.6,c:6.2,y:yc-.4,t:.22,tle:10.8,tc:1.1,ty:yc-.55});
 K.strut(2.8,yc-.55,2.8,.3,.08); K.wheel(2.8,.27);
 K.strut(8.4,yc-.6,8.4,.38,.1); K.wheel(8.4,.33);
}};

/* F-4 PHANTOM II (1958): L 19.2, H 5.0, span 11.7. Two seats, side intakes, the stabilator droops 23 degrees, the outer wing
   panels tilt up 12 degrees */
PR.f4={dims:{L:19.2,H:5.0,span:11.7},draw(K){ const b=K.body, st=K.stripe, yc=2.35;
 K.shape([[13.2,yc+.8],[15.4,yc+1.05],[17.4,4.85],[17.75,5.0,1],[18.5,5.0,1],[18.9,yc+1.0],[18.7,yc+.5,1],[16.0,yc+.6,1]],b,OUT,.7); K.line(18.4,4.95,18.75,yc+.9,sh(b,.75),.035);
 K.wing({le:16.4,c:2.3,y:yc+.25,t:.14,tle:17.7,tc:1.0,ty:yc-1.1,fill:sh(b,.9)});   // the drooping stabilator
 K.hull([[0,yc+.05],[1.0,yc+.45],[3.6,yc+.68],[5.2,yc+.85],[8.6,yc+.95],[12.0,yc+.85],[17.0,yc+.55],[18.9,yc+.45,1],[19.2,yc+.15,1],[18.9,yc-.42,1],[15.5,yc-.55],[11.0,yc-.82],[7.0,yc-.92],[3.6,yc-.75],[1.0,yc-.45]],{inner:()=>{ K.shape(K.band([[0,yc],[19,yc+.1]],.06),st,null); }});
 K.glass([[4.6,yc+.82,1],[5.1,yc+1.38],[6.2,yc+1.5],[7.6,yc+1.42],[8.2,yc+.92,1]],GL); K.line(6.3,yc+1.48,6.35,yc+.9,sh(b,.7),.035);
 K.shape([[7.2,yc+.72,1],[7.6,yc+.72],[9.4,yc+.62],[9.4,yc-.75],[7.6,yc-.72],[7.2,yc-.72,1]],sh(b,.9),OUT,.6); K.shape([[7.2,yc+.66,1],[7.45,yc+.66,1],[7.45,yc-.66,1],[7.2,yc-.66,1]],'#2a2d33',null);   // the near intake and splitter
 K.shape([[18.9,yc+.35,1],[19.2,yc+.3,1],[19.2,yc-.35,1],[18.9,yc-.4,1]],'#3a3f48',OUT,.4);
 K.wing({le:9.0,c:5.6,y:yc-.6,t:.28,tle:12.0,tc:2.6,ty:yc-.28});
 K.poly([[12.6,yc-.25],[13.9,yc+.65],[15.0,yc+.62],[14.4,yc-.3]],sh(b,.95),OUT,.5);   // the upturned outer panel
 K.strut(2.4,yc-.55,2.35,.32,.1); K.wheel(2.25,.3); K.wheel(2.45,.3);
 K.strut(11.2,yc-.7,11.2,.45,.12); K.wheel(11.2,.42);
}};

/* F-16 (1974): L 15.06, H 4.88, span 9.96. The intake under the cockpit like an open mouth, a one-piece bubble canopy */
PR.f16={dims:{L:15.06,H:4.88,span:9.96},draw(K){ const b=K.body, st=K.stripe, yc=2.2;
 K.shape([[10.2,yc+.6],[11.8,yc+.85],[13.6,4.7],[13.85,4.88,1],[14.45,4.88,1],[14.75,yc+.95],[14.6,yc+.5,1],[12.6,yc+.55,1]],b,OUT,.7); K.line(14.35,4.82,14.6,yc+.88,sh(b,.75),.03);
 K.wing({le:12.0,c:2.6,y:yc-.1,t:.12,tle:13.6,tc:1.0,ty:yc-.25,fill:sh(b,.9)});
 K.hull([[0,yc+.12],[.8,yc+.4],[2.4,yc+.6],[6.0,yc+.82],[10.0,yc+.72],[14.2,yc+.5,1],[14.6,yc+.3,1],[14.6,yc-.4,1],[13.0,yc-.55],[9.0,yc-.82],[6.2,yc-.92],[4.6,yc-.95],[3.1,yc-.6],[1.2,yc-.38]],{inner:()=>{ K.shape(K.band([[0,yc+.05],[14.6,yc+.08]],.05),st,null); }});
 K.shape([[3.6,yc-.55,1],[3.4,yc-1.2,1],[5.8,yc-1.25],[6.6,yc-.95],[6.2,yc-.62]],sh(b,.88),OUT,.6); K.shape([[3.4,yc-.6,1],[3.62,yc-.58,1],[3.45,yc-1.18,1],[3.25,yc-1.18,1]],'#2a2d33',null);   // the chin intake
 K.glass([[2.4,yc+.6,1],[2.9,yc+1.08],[4.0,yc+1.22],[5.2,yc+1.08],[5.7,yc+.82,1]],GL);
 K.shape([[14.6,yc+.38,1],[15.06,yc+.3,1],[15.06,yc-.42,1],[14.6,yc-.48,1]],'#3a3f48',OUT,.4);
 K.poly([[12.3,yc-.7],[13.4,yc-.75],[13.6,yc-1.25],[12.9,yc-1.22]],sh(b,.9),OUT,.4);   // ventral fins
 K.wing({le:6.4,c:4.6,y:yc-.35,t:.22,tle:9.8,tc:1.2,ty:yc-.3});
 K.strut(5.4,yc-1.2,5.4,.3,.08); K.wheel(5.4,.27);
 K.strut(9.2,yc-.8,9.2,.38,.1); K.wheel(9.2,.36);
}};

/* F-22 RAPTOR (1997): L 18.92, H 5.08, span 13.56. Chined nose, gold-tinted canopy, side intakes, two canted fins, flat nozzles.
   F-35 (2006): L 15.7, H 4.38, span 10.7. Chunkier, the intake bumps, ONE round nozzle */
function stealth(K,o){ const b=K.body, st=K.stripe, L=o.L, yc=o.yc;
 const fin=(dx,dy,f)=>K.shape([[L*.72+dx,yc+.7+dy],[L*.8+dx,yc+.75+dy],[L*.9+dx,o.H+dy],[L*.95+dx,o.H+dy],[L*.97+dx,yc+1.0+dy],[L*.92+dx,yc+.6+dy]].map(q=>[q[0],q[1],1]),f,OUT,.6);
 fin(.5,-.15,sh(b,.85));
 K.wing({le:L*.79,c:L*.13,y:yc-.05,t:.12,tle:L*.86,tc:L*.06,ty:yc-.1,fill:sh(b,.9)});
 K.hull([[0,yc,1],[L*.06,yc+.35],[L*.2,yc+.62],[L*.45,yc+.8],[L*.75,yc+.75],[L*.97,yc+.55,1],[L*.98,yc-.3,1],[L*.8,yc-.55],[L*.45,yc-.82],[L*.22,yc-.62],[L*.06,yc-.3]],{inner:()=>{ K.shape(K.band([[0,yc-.02],[L,yc+.05]],.06),st,null); }});
 K.glass([[L*.14,yc+.5,1],[L*.19,yc+.98],[L*.27,yc+1.08],[L*.34,yc+.92],[L*.38,yc+.68,1]],o.gold?{tint:'#e6c56e',tint2:'#8a6a2a'}:{tint:'#a8b8c8',tint2:'#4a5a6a'});
 K.shape([[L*.31,yc+.45,1],[L*.37,yc+.4,1],[L*.37,yc-.5,1],[L*.3,yc-.45,1]],sh(b,.8),OUT,.5); K.shape([[L*.305,yc+.4,1],[L*.325,yc+.38,1],[L*.315,yc-.4,1],[L*.295,yc-.4,1]],'#2a2d33',null);   // the intake
 if(o.round){ K.shape([[L*.97,yc+.45],[L,yc+.3,1],[L,yc-.3,1],[L*.97,yc-.45]],'#4a4f57',OUT,.5); for(let i=0;i<5;i++) K.line(L*.985,yc-.3+i*.15,L,yc-.3+i*.15,'#2a2d33',.02); }
 else K.shape([[L*.95,yc+.42,1],[L,yc+.3,1],[L,yc-.18,1],[L*.95,yc-.28,1]],'#4a4f57',OUT,.5);
 K.wing({le:L*.42,c:L*.36,y:yc-.35,t:.22,tle:L*.62,tc:L*.1,ty:yc-.4});
 fin(0,0,b);
 K.strut(L*.24,yc-.55,L*.24,.3,.09); K.wheel(L*.24,.3);
 K.strut(L*.58,yc-.7,L*.58,.4,.11); K.wheel(L*.58,.38);
}
PR.f22={dims:{L:18.92,H:5.08,span:13.56},draw:K=>stealth(K,{L:18.92,H:5.08,yc:2.35,gold:1})};
PR.f35={dims:{L:15.7,H:4.38,span:10.7},draw:K=>stealth(K,{L:15.7,H:4.38,yc:2.2,round:1})};

/* ENGLISH ELECTRIC LIGHTNING (1954): L 16.84, H 5.97, span 10.61. Nose intake with a cone, two engines stacked one above the
   other (two nozzles), a big fuel tank under the belly, very swept wing, tall fin */
PR.lightning={dims:{L:16.84,H:5.97,span:10.61},draw(K){ const b=K.body, st=K.stripe, yc=3.0;
 K.shape([[10.6,yc+1.0],[13.0,yc+1.3],[15.6,5.85],[15.9,5.97,1],[16.5,5.95,1],[16.7,yc+1.4],[16.6,yc+1.0,1],[14.0,yc+1.0,1]],b,OUT,.7); K.line(16.4,5.9,16.6,yc+1.3,sh(b,.75),.035);
 K.wing({le:14.3,c:2.1,y:yc-1.0,t:.12,tle:15.6,tc:.8,ty:yc-1.15,fill:sh(b,.9)});
 K.hull([[0,yc+.55,1],[1.0,yc+.75],[3.0,yc+.95],[4.0,yc+1.08],[9.0,yc+1.18],[16.6,yc+1.05,1],[16.62,yc-1.12,1],[13.0,yc-1.12],[6.0,yc-1.0],[2.0,yc-.8],[0,yc-.55,1]],{inner:()=>{ K.shape(K.band([[3,yc+.05],[16.6,yc+.05]],.07),st,null); }});
 K.shape([[0,yc+.55,1],[.04,yc-.55,1],[-.08,yc,1]],'#2a2d33',null); K.shape([[-.05,yc+.2],[-.45,yc+.05],[-.62,yc,1],[-.45,yc-.05],[-.05,yc-.2]],'#9aa3ad',OUT,.5);
 K.glass([[3.4,yc+1.0,1],[3.8,yc+1.48],[4.8,yc+1.56],[5.4,yc+1.3],[5.6,yc+1.12,1]],GL);
 K.shape([[16.6,yc+.95,1],[16.84,yc+.9,1],[16.84,yc+.1,1],[16.6,yc+.05,1]],'#3a3f48',OUT,.4); K.shape([[16.6,yc-.1,1],[16.84,yc-.15,1],[16.84,yc-.95,1],[16.6,yc-1.0,1]],'#3a3f48',OUT,.4);   // the stacked nozzles
 K.shape([[5.6,yc-1.0],[6.3,yc-1.75],[11.4,yc-1.85],[12.6,yc-1.2]],sh(b,.9),OUT,.6);   // the belly tank
 K.wing({le:7.0,c:6.4,y:yc-.15,t:.22,tle:12.6,tc:1.6,ty:yc-.4});
 K.strut(4.2,yc-.9,4.2,.33,.09); K.wheel(4.2,.32);
 K.strut(10.4,yc-.3,10.5,.42,.1); K.wheel(10.5,.4);
}};

/* FAIRCHILD REPUBLIC A-10 (1972): L 16.26, H 4.47, span 17.53. Two engine pods high on the back, straight wings, twin fins.
   (Its nose gun is left out: no weapons in the academy.) */
PR.a10={dims:{L:16.26,H:4.47,span:17.53},draw(K){ const b=K.body, st=K.stripe, yc=1.95;
 const fin=f=>K.shape([[14.2,2.0],[14.5,4.2],[14.8,4.47,1],[15.9,4.47,1],[16.26,3.9],[16.2,1.65],[15.6,1.25,1],[14.6,1.35,1]],f,OUT,.6);
 fin(sh(b,.85)); K.foil(14.0,2.2,2.6,.16,sh(b,.9));
 K.hull([[0,yc+.1],[.5,yc+.62],[1.6,yc+.95],[3.6,yc+1.0],[9.0,yc+1.05],[13.0,yc+.85],[15.4,yc+.75,1],[15.45,yc+.3,1],[12.0,yc-.4],[8.0,yc-.82],[3.0,yc-.82],[.8,yc-.5]],{inner:()=>{ K.shape(K.band([[0,yc],[15.5,yc+.35]],.06),st,null); }});
 K.glass([[1.75,yc+.92,1],[2.2,yc+1.48],[3.0,yc+1.62],[3.8,yc+1.45],[4.2,yc+1.0,1]],GL);
 K.poly([[11.0,yc+1.0],[12.4,yc+1.0],[12.6,yc+1.35],[11.2,yc+1.35]],sh(b,.9),OUT,.5); K.pod(9.4,13.2,yc+1.8,.62,{rear:.72});
 K.wing({le:6.2,c:3.0,y:yc-.55,t:.45,tle:6.7,tc:1.9,ty:yc-.1});
 K.shape([[5.6,yc-.55],[6.0,yc-.95],[8.0,yc-1.0],[8.4,yc-.6]],sh(b,.88),OUT,.5); K.wheel(6.9,.43);   // gear pod; the wheel stays partly out
 K.strut(1.1,yc-.55,1.1,.35,.09); K.wheel(1.1,.33);
 fin(b);
}};

/* ROCKWELL B-1B LANCER (1984): L 44.5, H 10.4, span 41.8 spread / 24.1 swept. Long blended body, wings swept back, engines in
   pairs under the wing roots, the tailplane low on the fin */
PR.b1b={dims:{L:44.5,H:10.4,span:41.8},draw(K){ const b=K.body, st=K.stripe, yc=3.6;
 K.shape([[32.0,yc+1.4],[37.0,yc+2.0],[41.6,10.1],[42.2,10.4,1],[43.6,10.3,1],[44.3,yc+2.4],[44.0,yc+1.3,1],[38.0,yc+1.3,1]],b,OUT,.7); K.line(43.4,10.2,44.1,yc+2.2,sh(b,.75),.06);
 K.wing({le:38.6,c:4.8,y:yc+2.3,t:.3,tle:42.0,tc:1.6,ty:yc+2.2,fill:sh(b,.9)});
 K.hull([[0,yc,1],[2.0,yc+.9],[5.0,yc+1.6],[9.0,yc+1.85],[20,yc+2.0],[34,yc+1.7],[43.8,yc+1.2,1],[44.0,yc+.2,1],[36.0,yc-.6],[24,yc-1.2],[12,yc-1.3],[5.0,yc-1.1],[1.4,yc-.6]],{inner:()=>{ K.shape(K.band([[0,yc+.1],[44,yc+.5]],.12),st,null); }});
 K.glass([[3.8,yc+1.25,1],[4.6,yc+1.62,1],[6.0,yc+1.66,1],[6.0,yc+1.3,1]],{tint:'#3a5578',tint2:'#1e2c40',shine:false});
 K.wing({le:16.0,c:12.0,y:yc+.8,t:.5,tle:33.0,tc:2.4,ty:yc+.9});
 K.poly([[20.0,yc-1.0],[30.5,yc-.9],[31.6,yc-2.3],[21.2,yc-2.5],[19.6,yc-2.2]],sh(b,.88),OUT,.6); K.shape([[19.6,yc-1.1,1],[20.4,yc-1.1,1],[20.4,yc-2.2,1],[19.6,yc-2.2,1]],'#2a2d33',null);   // engine nacelle (a pair)
 K.shape([[31.6,yc-1.0,1],[32.4,yc-1.1,1],[32.4,yc-2.2,1],[31.6,yc-2.3,1]],'#5d6672',OUT,.4);
 K.strut(5.0,yc-1.0,5.0,.5,.18); K.wheel(4.8,.45); K.wheel(5.2,.45);
 K.strut(22.5,yc-2.3,22.5,.7,.25); K.wheel(21.8,.6); K.wheel(23.2,.6);
}};

/* NORTHROP B-2 SPIRIT (1989): seen from below. Span 52.4, length 21.0. One huge wing, no tail, a zigzag (double-W) trailing edge */
PR.b2={dims:{L:52.4,H:21.0,span:52.4,plan:true},draw(K){ const b=K.body, w=26.2, v=y=>y+1.0;   // x = across the span, y = nose-to-tail
 const pts=[[w,v(21.0),1],[w+26.2,v(4.0),1],[w+26.2,v(2.6),1],[w+19.4,v(6.6),1],[w+12.0,v(.6),1],[w+6.0,v(4.6),1],[w,v(0),1],[w-6.0,v(4.6),1],[w-12.0,v(.6),1],[w-19.4,v(6.6),1],[w-26.2,v(2.6),1],[w-26.2,v(4.0),1]];
 K.hull(pts,{inner:()=>{ K.shape([[w,v(19.0)],[w+5.5,v(14.0)],[w+6.6,v(9.0)],[w,v(7.0)],[w-6.6,v(9.0)],[w-5.5,v(14.0)]],sh(b,1.08),null);
  for(const s of [-1,1]){ K.poly([[w+s*7.4,v(10.6)],[w+s*10.0,v(9.6)],[w+s*10.4,v(8.4)],[w+s*7.6,v(9.2)]],sh(b,.8),null); K.poly([[w+s*8.4,v(3.4)],[w+s*10.6,v(2.6)],[w+s*10.4,v(1.9)],[w+s*8.6,v(2.6)]],sh(b,.7),null); }
  K.line(w-26,v(3.6),w,v(20.4),'rgba(255,255,255,.12)',.15); K.line(w+26,v(3.6),w,v(20.4),'rgba(255,255,255,.12)',.15); }});
 K.mark(w,v(10),'beacon');
}};

/* BOEING B-52H STRATOFORTRESS (1952): L 48.5, H 12.4, span 56.4. Eight engines in four pairs, a high swept wing that droops on
   the ground, little outrigger wheels near the tips, bicycle main gear */
PR.b52={dims:{L:48.5,H:12.4,span:56.4},draw(K){ const b=K.body, st=K.stripe, yc=4.1, r=1.55;
 K.shape([[37.0,yc+1.3],[41.0,yc+1.6],[45.2,12.2],[45.6,12.4,1],[47.2,12.3,1],[48.2,yc+2.0],[48.0,yc+1.1,1],[43.0,yc+1.1,1]],b,OUT,.7); K.line(47.0,12.2,48.0,yc+1.9,sh(b,.75),.07);
 K.wing({le:42.6,c:5.0,y:yc+1.0,t:.4,tle:46.4,tc:1.8,ty:yc+1.3,fill:sh(b,.9)});
 K.hull([[0,yc-.2],[.8,yc+.85],[3.0,yc+1.45],[6.0,yc+r],[38,yc+r],[47.8,yc+1.0,1],[48.5,yc+.6,1],[48.2,yc-.2,1],[42,yc-.9],[30,yc-r],[6.0,yc-r],[1.6,yc-1.2],[.3,yc-.8]],{inner:()=>{ K.shape(K.band([[0,yc],[48,yc+.3]],.12),st,null); }});
 K.glass([[2.4,yc+1.25,1],[3.4,yc+1.68,1],[5.0,yc+1.7,1],[5.0,yc+1.3,1]],{tint:'#3a5578',tint2:'#1e2c40',shine:false});
 K.wing({le:16.5,c:8.5,y:yc+1.35,t:.85,tle:34.0,tc:2.6,ty:yc+.15});   // high wing, drooping toward the tip
 for(const [x0,yc2] of [[14.8,yc-1.2],[22.4,yc-1.55]]){ K.poly([[x0+1.8,yc2+.7],[x0+3.2,yc+1.1],[x0+4.8,yc+1.0],[x0+4.6,yc2+.6]],sh(b,.9),OUT,.5); K.pod(x0,x0+5.4,yc2,.8,{rear:.66}); }
 K.strut(34.6,yc+.0,34.6,.25,.06); K.wheel(34.6,.22);   // outrigger at the tip
 K.strut(12.5,yc-r,12.5,.6,.25); K.wheel(12.0,.52); K.wheel(13.0,.52);
 K.strut(27.5,yc-r,27.5,.6,.25); K.wheel(27.0,.52); K.wheel(28.0,.52);
}};

/* ============================ ROTORCRAFT ============================ */
/* SIKORSKY UH-60 BLACK HAWK (1974): overall 19.76, fuselage 15.26, H 5.13, rotor 16.36. Four blades, wheels, a big stabilator,
   the tail rotor canted on the right side of the pylon */
PR.uh60={dims:{L:19.76,H:5.13,rotor:16.36},draw(K){ const b=K.body, st=K.stripe;
 K.trotor(14.85,3.53,1.6,4);   // on the far (right) side: drawn first, behind the pylon
 K.shape([[7.0,2.85],[12.8,2.6],[13.4,2.2],[7.0,1.55]],b,OUT,.6);   // tail boom
 K.shape([[12.3,2.55],[13.4,2.75],[14.2,4.1],[14.9,4.15,1],[15.26,3.3],[14.6,2.2,1],[13.0,2.0]],b,OUT,.6);   // the tail pylon
 K.foil(13.3,1.9,2.1,.2,sh(b,.88));   // stabilator
 K.hull([[0,1.35],[.3,2.0],[1.5,2.55],[2.8,2.75],[7.4,2.85],[7.6,1.6],[6.2,.95],[1.6,.92],[.4,1.05]],{inner:()=>{ K.shape(K.band([[0,1.55],[8,1.6]],.1),st,null); K.line(4.4,2.7,4.4,1.0,sh(b,.72),.04); K.line(6.4,2.7,6.4,1.05,sh(b,.72),.04); }});
 K.shape([[2.8,2.75],[3.4,3.35],[7.2,3.4],[7.8,2.85]],sh(b,.95),OUT,.6); K.shape([[4.2,3.35],[4.6,3.75],[6.6,3.72],[7.0,3.35]],sh(b,.9),OUT,.6);   // engines + transmission
 K.glass([[.1,1.45],[.35,2.02],[1.4,2.48],[2.3,2.55,1],[2.2,1.45,1],[.8,1.22]],GL); K.glass([[2.5,2.45,1],[3.6,2.45,1],[3.6,1.75,1],[2.5,1.75,1]],GL); K.glass([[4.65,2.45,1],[5.4,2.45,1],[5.4,1.95,1],[4.65,1.95,1]],GL);
 K.strut(5.1,3.62,5.1,3.78,.18,'#5d6672');
 K.strut(1.6,1.0,1.7,.38,.08); K.strut(2.2,1.0,1.7,.38,.06); K.wheel(1.7,.38);
 K.strut(12.6,2.0,12.7,.2,.06); K.wheel(12.7,.2);
 K.mark(13.5,2.3,'beacon');
 K.rotor(5.1,3.8,8.18,4,{chord:.53});
}};

/* BOEING AH-64 APACHE (1975): overall 17.73, H 3.87, rotor 14.63. Stepped tandem cockpits, a nose sensor turret, stub wings
   (left clean: no weapons), engines on the sides, a tailwheel */
PR.ah64={dims:{L:17.73,H:3.87,rotor:14.63},draw(K){ const b=K.body, st=K.stripe;
 K.shape([[6.5,2.1],[13.6,2.15],[14.0,1.85],[6.5,1.35]],b,OUT,.6);
 K.shape([[13.0,2.1],[13.7,2.4],[14.3,3.55],[14.8,3.6,1],[15.0,2.9],[14.7,1.7,1],[13.6,1.75]],b,OUT,.6);
 K.foil(14.1,1.4,1.25,.14,sh(b,.88));
 K.hull([[.55,1.2],[1.2,1.75],[2.6,2.15],[3.5,2.5],[6.8,2.45],[7.2,1.55],[5.5,.95],[2.0,.85],[.8,.95]],{inner:()=>{ K.shape(K.band([[.5,1.25],[7.2,1.35]],.08),st,null); }});
 K.glass([[1.25,1.75,1],[1.7,2.15],[2.5,2.3,1],[2.5,1.75,1]],GL); K.glass([[2.65,2.3,1],[3.1,2.72],[4.1,2.78,1],[4.1,2.25,1]],GL);
 K.shape([[4.8,2.55],[5.1,2.95],[6.9,2.95],[7.3,2.5]],sh(b,.92),OUT,.6);
 K.shape([[5.2,1.95],[5.4,2.35],[7.6,2.3],[7.9,2.0],[7.6,1.7],[5.4,1.7]],sh(b,.9),OUT,.6);   // the near engine nacelle
 K.foil(4.7,1.3,1.62,.16,sh(b,.9));   // stub wing
 K.circ(.45,.95,.42,'#3a3f48',OUT,.5); K.circ(.3,.95,.2,'#1e2c40');   // the nose sensor turret
 K.strut(3.9,.95,4.2,.42,.08); K.strut(4.6,.95,4.2,.42,.06); K.wheel(4.2,.42);
 K.strut(13.6,1.75,13.7,.18,.05); K.wheel(13.7,.18);
 K.trotor(14.6,2.6,1.4,4);
 K.strut(5.5,2.95,5.5,3.72,.18,'#5d6672');
 K.rotor(5.5,3.78,7.32,4,{chord:.53});
}};

/* BELL 206B JETRANGER (206A first flew 1966): overall 11.82, fuselage 9.5, H 2.91, rotor 10.16. Teardrop cabin, two blades, skids */
PR.b206={dims:{L:11.82,H:2.85,rotor:10.16},draw(K){ const b=K.body, st=K.stripe;
 K.skid(-.1,3.3,.04,.28); K.strut(.6,.06,.7,.62,.05); K.strut(2.7,.06,2.6,.66,.05);
 K.shape([[3.4,1.92],[8.6,1.6],[8.7,1.38],[3.4,1.28]],b,OUT,.6);
 K.poly([[6.6,1.68],[7.6,1.6],[7.6,1.5],[6.6,1.52]],sh(b,.9),OUT,.4);   // horizontal stabilizer
 K.shape([[8.2,1.55],[8.9,2.4],[9.25,2.42,1],[9.4,1.45,1],[9.1,.92],[8.7,.98],[8.6,1.4]],b,OUT,.6);
 K.hull([[0,1.05],[.18,1.55],[.9,1.98],[2.4,2.08],[3.6,1.95],[3.75,1.25],[3.2,.68],[1.0,.62],[.2,.78]],{inner:()=>{ K.shape(K.band([[0,1.0],[3.8,1.05]],.1),st,null); K.line(1.85,2.0,1.85,.66,sh(b,.72),.03); }});
 K.shape([[1.6,2.08],[1.9,2.32],[3.4,2.3],[3.85,1.95]],sh(b,.95),OUT,.6); K.shape([[3.3,2.28,1],[3.5,2.55,1],[3.7,2.55,1],[3.75,2.2,1]],'#5d6672',OUT,.4);   // fairing + exhaust
 K.glass([[.06,1.1],[.22,1.55],[.85,1.95],[1.6,2.0,1],[1.45,1.05,1],[.4,.92]],GL); K.glass([[1.95,1.9,1],[2.95,1.9,1],[2.95,1.35,1],[1.95,1.35,1]],GL);
 K.strut(2.76,2.3,2.76,2.82,.1,'#5d6672');
 K.trotor(8.8,1.46,.82,2); K.mark(9.3,2.42,'beacon');
 K.rotor(2.76,2.86,5.08,2,{chord:.33});
}};

/* CIERVA C.30A (1933): L 6.01, H 3.38, rotor 11.28. An autogyro: a free-spinning three-blade rotor on a pylon, an ordinary
   propeller on the nose, no wings. A taildragger */
PR.cierva={dims:{L:6.01,H:3.38,rotor:11.28,Lx:11.4},att:8,main:[1.05,.3],draw(K){ const b=K.body, st=K.stripe;
 K.shape([[5.3,1.15],[5.55,1.6],[5.85,1.72],[6.01,1.4],[5.95,1.05,1],[5.4,1.02,1]],b,OUT,.6);
 K.foil(4.9,1.0,1.1,.07,sh(b,.9)); K.poly([[5.6,1.12],[5.85,1.12],[5.95,1.42],[5.75,1.42]],sh(b,.85),OUT,.4);   // tailplane with its up-turned tip
 K.hull([[.3,1.48],[.9,1.62],[2.5,1.6],[5.4,1.2,1],[5.42,1.02,1],[3.0,.82],[1.5,.78],[.6,.88],[.3,1.0]],{inner:()=>{ K.shape(K.band([[.4,1.25],[5.4,1.1]],.05),st,null); }});
 K.circ(1.65,1.72,.12,'#6b4226'); K.circ(2.55,1.66,.12,'#6b4226');
 K.strut(1.35,1.6,1.6,2.95,.035); K.strut(1.95,1.6,1.6,2.95,.035); K.strut(1.6,1.6,1.6,2.95,.03);   // the rotor pylon
 K.strut(.7,.9,1.05,.3,.045); K.strut(1.55,.85,1.05,.3,.045); K.wheel(1.05,.3);
 K.tailwheel(5.2,1.0,.1);
 K.circ(.3,1.26,.36,'#5d6672',OUT,.5); K.circ(.24,1.26,.2,'#3a3f48');
 K.prop(.08,1.26,1.05,2);
 K.rotor(1.6,3.02,5.64,3,{chord:.25});
}};

/* ============================ TRAINERS ============================ */
/* PILATUS PC-21 (2002): L 11.23, H 3.75, span 9.11. Five-blade propeller, a long canopy over two stepped seats */
PR.pc21={dims:{L:11.23,H:3.75,span:9.11},draw(K){ const b=K.body, st=K.stripe;
 K.shape([[7.6,2.25],[9.0,2.45],[10.4,3.65],[10.6,3.75,1],[11.0,3.72,1],[11.23,3.1],[11.15,2.05,1],[10.0,2.0,1]],b,OUT,.6); K.stripeIn([[7.6,2.25],[9.0,2.45],[10.4,3.65],[10.6,3.75,1],[11.0,3.72,1],[11.23,3.1],[11.15,2.05,1],[10.0,2.0,1]],[[9,3.0],[11.4,3.0]],.18,st);
 K.wing({le:9.6,c:1.3,y:2.05,t:.12,tle:10.4,tc:.6,ty:2.25,fill:sh(b,.9)});
 K.hull([[.4,1.62],[1.0,1.8],[2.6,1.92],[3.6,2.12],[7.0,2.2],[10.9,2.08,1],[10.95,1.85,1],[8.0,1.5],[5.5,.98],[3.0,.95],[1.4,1.1],[.5,1.35]],{inner:()=>{ K.shape(K.band([[.4,1.5],[11,1.9]],.1),st,null); }});
 K.shape([[1.2,1.42,1],[1.6,1.42,1],[1.6,1.32,1],[1.2,1.32,1]],'#3a3f48',null);
 K.glass([[2.75,1.95,1],[3.2,2.42],[4.6,2.62],[6.0,2.62],[6.9,2.3],[7.1,2.15,1]],GL); K.line(4.65,2.6,4.6,2.05,sh(b,.8),.03);
 K.wing({le:3.9,c:2.1,y:1.02,t:.3,tle:4.4,tc:1.0,ty:1.42});
 K.strut(1.9,1.05,1.9,.25,.07); K.wheel(1.9,.22);
 K.strut(4.7,.95,4.75,.3,.08); K.wheel(4.75,.28);
 K.spinner(0,.5,1.6,.24); K.prop(.38,1.6,1.2,5);
}};

/* NORTH AMERICAN T-6 TEXAN (1935): L 8.84, H 3.56, span 12.81. A round engine, a long framed canopy, a triangular rudder, a
   tailwheel. About 11 degrees on the ground */
PR.t6={dims:{L:8.84,H:3.56,span:12.81},att:11,main:[1.9,.34],draw(K){ const b=K.body, st=K.stripe;
 K.poly([[7.4,1.7],[8.05,2.95],[8.45,2.95],[8.84,1.75],[8.6,1.4],[7.8,1.42]],b,OUT,.6); K.line(8.45,2.92,8.4,1.45,sh(b,.75),.025);
 K.foil(7.35,1.4,1.55,.09,sh(b,.92));
 K.hull([[.5,1.62],[1.3,1.85],[2.3,1.88,1],[5.5,1.95],[8.5,1.62,1],[8.52,1.42,1],[5.0,1.15],[3.0,.95],[1.6,.95],[.8,1.12],[.5,1.3]],{inner:()=>{ K.shape(K.band([[.5,1.5],[8.5,1.55]],.07),st,null); }});
 K.glass([[2.4,1.88,1],[2.75,2.25],[3.5,2.38],[5.0,2.38],[5.6,2.2],[5.75,1.95,1]],GL); for(const x of [3.25,3.95,4.6,5.2]) K.line(x,2.37,x,1.92,sh(b,.65),.025);
 K.wing({le:2.0,c:2.3,y:1.0,t:.34,tle:2.6,tc:1.2,ty:1.42});
 K.strut(1.95,1.0,1.9,.4,.08); K.wheel(1.9,.34);
 K.tailwheel(7.95,1.4,.12);
 K.circ(.5,1.45,.62,sh(b,.88),OUT,.6); K.circ(.42,1.45,.42,'#3a3f48'); K.prop(.2,1.45,1.37,2);
}};

/* SCHLEICHER ASK 21 (first flight 1979): L 8.35, H 1.55, span 17.0. A two-seat fiberglass glider: T-tail, nose + main + tail wheels */
PR.ask21={dims:{L:8.35,H:1.55,span:17.0},draw(K){ const b=K.body, st=K.stripe;
 K.shape([[6.95,.98],[7.5,1.02],[7.98,1.5,1],[8.3,1.5,1],[8.35,1.1],[8.28,.72,1],[7.6,.74,1]],b,OUT,.6); K.stripeIn([[6.95,.98],[7.5,1.02],[7.98,1.5,1],[8.3,1.5,1],[8.35,1.1],[8.28,.72,1],[7.6,.74,1]],[[7.4,1.3],[8.5,1.3]],.1,st);
 K.foil(7.8,.62,1.5,.06,sh(b,.95));
 K.hull([[0,.62],[.3,.86],[1.0,1.0],[3.3,1.02],[4.3,.92],[7.6,.8,1],[7.62,.66,1],[4.5,.58],[3.0,.36],[1.2,.3],[.3,.4]],{inner:()=>{ K.shape(K.band([[0,.62],[4,.62],[7.6,.74]],.05),st,null); }});
 K.glass([[.42,.9],[1.0,1.12],[2.0,1.22],[3.1,1.16],[3.4,1.0,1],[1.1,.95,1]],GL); K.line(1.9,1.2,1.9,.98,sh(b,.8),.03);
 K.wing({le:3.0,c:1.05,y:.95,t:.16});
 K.wheel(.62,.14); K.wheel(2.75,.2); K.wheel(7.4,.1);
}};

/* ============================ UNCREWED ============================ */
/* MQ-1 PREDATOR (1994): L 8.22, H 2.1, span 14.8. A bulging nose (satellite antenna), a sensor ball, long thin wings, an
   upside-down V tail, a pusher propeller */
PR.mq1={dims:{L:8.22,H:2.1,span:14.8},draw(K){ const b=K.body, st=K.stripe;
 K.poly([[7.1,1.32],[7.6,1.3],[8.0,.68],[7.7,.68]],sh(b,.85),OUT,.5);   // the far tail surface
 K.hull([[0,1.12],[.3,1.52],[1.1,1.7],[2.2,1.64],[3.4,1.42],[7.4,1.35,1],[7.55,1.12,1],[4.0,.98],[1.4,.92],[.3,.95]],{inner:()=>{ K.shape(K.band([[0,1.2],[7.5,1.25]],.05),st,null); }});
 K.circ(.65,.86,.24,'#3a3f48',OUT,.5); K.circ(.58,.86,.12,'#1e2c40');   // the sensor ball
 K.wing({le:3.5,c:.85,y:1.5,t:.12,tc:.55,tle:3.65,ty:1.62});
 K.poly([[7.05,1.3],[7.5,1.28],[8.0,.55],[7.65,.55]],sh(b,.95),OUT,.5); K.poly([[7.3,1.15],[7.6,1.15],[7.75,.62],[7.5,.62]],sh(b,.9),OUT,.4);   // inverted V + ventral fin
 K.strut(1.6,.95,1.65,.12,.03); K.wheel(1.65,.1); K.strut(4.0,1.0,4.6,.13,.03); K.wheel(4.6,.12);
 K.prop(7.62,1.24,.86,2);
}};

/* BAYRAKTAR TB2 (2014): L 6.5, H 2.2, span 12. Two thin booms carry an upside-down V tail; a pusher propeller behind the body */
PR.tb2={dims:{L:6.5,H:2.2,span:12.0},draw(K){ const b=K.body, st=K.stripe;
 K.strut(3.4,1.42,6.0,1.62,.06,sh(b,.8));   // far boom
 K.poly([[5.7,1.62],[6.3,1.62],[6.5,1.2],[6.0,1.2]],sh(b,.85),OUT,.5);
 K.hull([[0,1.2],[.3,1.55],[1.0,1.75],[2.8,1.74],[4.4,1.5,1],[4.42,1.18,1],[3.0,1.0],[1.2,.98],[.3,1.02]],{inner:()=>{ K.shape(K.band([[0,1.3],[4.4,1.32]],.05),st,null); }});
 K.circ(.65,.92,.2,'#3a3f48',OUT,.5); K.circ(.6,.92,.1,'#1e2c40');
 K.wing({le:2.5,c:.8,y:1.72,t:.12,tc:.5,tle:2.65,ty:1.86});
 K.strut(3.0,1.62,6.1,1.66,.07,sh(b,.95));   // the near boom
 K.poly([[5.8,1.66],[6.35,1.66],[6.5,1.15],[6.05,1.15]],sh(b,.95),OUT,.5);
 K.strut(1.1,1.0,1.15,.12,.03); K.wheel(1.15,.1); K.strut(3.0,1.05,3.3,.12,.03); K.wheel(3.3,.12);
 K.prop(4.5,1.34,.82,2);
}};

/* ============================ NEW ROTORCRAFT (r7.4) ============================ */
/* BELL 47G (1945): fuselage 9.63 (nose to the tail rotor), H 2.84, rotor 11.33; overall about 13.3 (the FAA heliport design table
   lists 44 ft, with the tail 25 ft behind the rotor hub and a 5.1 ft tail rotor 3.5 ft off the ground). The goldfish-bowl
   bubble, an open steel-tube tail boom, the engine out in the open, a two-blade rotor with a stabilizer bar */
PR.bell47={dims:{L:13.3,H:2.84,rotor:11.33,body:9.63,approx:true},draw(K){ const b=K.body, st=K.stripe;
 K.skid(-.15,3.0,.04,.3); K.strut(.5,.06,.6,.58,.05); K.strut(2.5,.06,2.4,.6,.05);
 // the open truss tail boom
 const T=(x)=>{ const k=(x-2.2)/6.7; return [1.45+.25*k,1.05+.35*k]; };
 K.strut(2.2,1.45,8.9,1.7,.04,sh(b,.8)); K.strut(2.2,1.05,8.9,1.4,.04,sh(b,.8));
 for(let i=0;i<=9;i++){ const x=2.4+i*.7, a=T(x); K.strut(x,a[0],x,a[1],.025,sh(b,.8)); if(i<9){ const n=T(x+.7); K.strut(x,a[1],x+.7,n[0],.015,sh(b,.75)); } }
 K.poly([[8.65,1.75],[9.0,2.3],[9.15,2.3],[9.08,1.35],[8.75,1.3]],b,OUT,.5);
 K.trotor(8.85,1.85,.78,2);
 // engine and fuel tanks (saddle) behind the bubble
 K.shape([[1.8,1.3],[2.6,1.3],[2.65,.7],[1.8,.68]],'#7d8590',OUT,.5); for(let i=0;i<4;i++) K.line(1.85,.78+i*.14,2.6,.78+i*.14,'#4a4f57',.03);
 K.shape([[1.55,1.7],[1.7,1.95],[2.75,1.95],[2.9,1.7],[2.75,1.45],[1.7,1.45]],st,OUT,.6);
 K.strut(2.0,1.9,2.0,2.62,.07,'#5d6672');
 // the bubble
 K.glass([[0,1.1],[.15,1.6],[.65,1.98],[1.3,2.05],[1.85,1.82],[1.95,1.2],[1.8,.68],[1.0,.6],[.25,.72]],{tint:'#b9dcf5',tint2:'#6a96c2'});
 K.shape([[.2,.72],[1.0,.6],[1.85,.68],[1.85,.9],[.3,.95]],st,OUT,.5); K.circ(1.25,1.2,.16,'#6b4226');
 K.strut(1.2,2.66,2.8,2.66,.03,'#3a3f48'); K.circ(1.2,2.66,.06,'#3a3f48'); K.circ(2.8,2.66,.06,'#3a3f48');   // stabilizer bar
 K.rotor(2.0,2.74,5.66,2,{chord:.3});
}};

/* BELL UH-1H "HUEY" (first flight 1956): overall 17.62, fuselage 12.77, H 4.39, rotor 14.63. Two blades with a stabilizer bar,
   a long cabin with big sliding doors, skids, the tail rotor high on the fin */
PR.uh1={dims:{L:17.4,H:4.39,rotor:14.63},draw(K){ const b=K.body, st=K.stripe;
 K.skid(-.4,6.0,.05,.32); K.strut(.9,.08,1.0,.85,.07); K.strut(5.0,.08,4.9,.88,.07);
 K.shape([[5.6,2.4],[11.4,2.15],[11.5,1.7],[5.6,1.3]],b,OUT,.6);
 K.poly([[8.6,1.95],[9.6,1.9],[9.6,1.78],[8.6,1.8]],sh(b,.9),OUT,.4);   // synchronized elevator
 K.shape([[11.0,2.1],[11.6,2.6],[12.2,3.7],[12.6,3.7,1],[12.77,2.4],[12.4,1.6,1],[11.4,1.7]],b,OUT,.6);
 K.hull([[0,1.5],[.25,2.05],[1.1,2.42],[2.4,2.5],[5.9,2.45],[6.2,1.6],[5.5,.92],[1.3,.88],[.25,1.05]],{inner:()=>{ K.shape(K.band([[0,1.4],[6.2,1.45]],.12),st,null); K.line(2.5,2.45,2.5,.95,sh(b,.72),.04); K.line(4.6,2.45,4.6,.95,sh(b,.72),.04); K.line(2.5,2.45,4.6,2.45,sh(b,.72),.04); }});
 K.shape([[2.4,2.5],[2.9,2.95],[5.6,2.95],[6.2,2.4]],sh(b,.94),OUT,.6); K.shape([[5.4,2.9,1],[5.9,2.9,1],[6.2,2.55,1],[5.6,2.55,1]],'#5d6672',OUT,.4);
 K.glass([[.05,1.55],[.3,2.06],[1.1,2.38],[1.9,2.42,1],[1.85,1.55,1]],GL); K.glass([[.25,1.0],[.9,.98],[1.0,1.4],[.15,1.42]],GL); K.glass([[2.75,2.3,1],[3.4,2.3,1],[3.4,1.8,1],[2.75,1.8,1]],GL); K.glass([[3.6,2.3,1],[4.3,2.3,1],[4.3,1.8,1],[3.6,1.8,1]],GL);
 K.strut(3.4,2.95,3.4,4.2,.16,'#5d6672'); K.strut(2.6,4.12,4.2,4.12,.04,'#3a3f48');
 K.trotor(12.45,3.09,1.3,2); K.mark(12.6,3.75,'beacon');
 K.rotor(3.4,4.25,7.32,2,{chord:.53});
}};

/* AIRBUS H125 / AS350 ÉCUREUIL (first flight 1974): overall 12.94, fuselage 10.93, H 3.34, rotor 10.69. A tall rounded cabin,
   three blades, high skids; the tail rotor is on the far (right) side */
PR.h125={dims:{L:12.94,H:3.34,rotor:10.69},draw(K){ const b=K.body, st=K.stripe;
 K.trotor(10.0,1.63,.93,2);   // far side
 K.skid(-.2,3.9,.05,.32); K.strut(.8,.08,.9,.9,.06); K.strut(3.4,.08,3.3,.92,.06);
 K.shape([[4.2,2.45],[9.9,2.08],[10.0,1.8],[4.2,1.55]],b,OUT,.6);
 K.poly([[8.0,2.05],[9.0,2.0],[9.0,1.88],[8.0,1.9]],sh(b,.9),OUT,.4); K.poly([[8.7,2.3],[9.0,2.3],[9.0,1.65],[8.7,1.65]],sh(b,.85),OUT,.4);   // stabilizer + end fin
 K.shape([[9.6,2.05],[10.2,2.95],[10.6,2.98,1],[10.93,2.0],[10.7,1.35,1],[10.2,1.4],[9.8,1.8]],b,OUT,.6);
 K.hull([[0,1.55],[.2,2.15],[.9,2.62],[2.2,2.75],[4.2,2.62],[4.5,1.8],[4.0,1.08],[1.5,1.0],[.3,1.15]],{inner:()=>{ K.shape(K.band([[0,1.62],[4.6,1.68]],.12),st,null); K.line(2.35,2.7,2.35,1.05,sh(b,.72),.035); }});
 K.shape([[2.4,2.72],[2.9,3.02],[4.6,2.95],[5.0,2.55],[4.3,2.5]],sh(b,.94),OUT,.6);
 K.glass([[.05,1.6],[.25,2.18],[.95,2.6],[1.75,2.66,1],[1.7,1.55,1]],GL); K.glass([[1.9,2.6,1],[2.25,2.6,1],[2.25,1.7,1],[1.85,1.7,1]],GL); K.glass([[2.5,2.55,1],[3.3,2.55,1],[3.3,1.85,1],[2.5,1.85,1]],GL);
 K.strut(3.3,3.0,3.3,3.28,.12,'#5d6672');
 K.mark(10.5,2.98,'beacon');
 K.rotor(3.3,3.3,5.35,3,{chord:.35});
}};

/* BOEING CH-47 CHINOOK (first flight 1961): overall 30.1, fuselage 15.8, H 5.7, two rotors of 18.29 turning opposite ways:
   no tail rotor needed */
PR.ch47={dims:{L:30.1,H:5.7,rotor:18.29},draw(K){ const b=K.body, st=K.stripe;
 K.hull([[0,1.6],[.4,2.5],[1.6,3.1],[3.0,3.25],[12.0,3.3],[15.4,3.6,1],[15.8,3.0,1],[15.6,1.5,1],[14.2,1.05],[12,.85],[3.0,.82],[.6,1.0]],{inner:()=>{ K.shape(K.band([[0,2.3],[15.8,2.4]],.12),st,null); K.line(13.6,3.25,15.5,1.2,sh(b,.72),.05); }});
 K.shape([[4.0,1.62],[4.6,1.85],[11.8,1.85],[12.4,1.6],[11.8,1.1],[4.6,1.1]],sh(b,.9),OUT,.6);   // fuel sponson
 K.glass([[.15,1.75],[.45,2.55],[1.4,3.0],[2.3,3.05,1],[2.2,1.85,1]],GL); K.windows(4.6,10.6,2.55,.35,.42,7);
 K.shape([[1.0,3.1],[1.3,3.8],[3.6,3.85],[4.0,3.2]],sh(b,.94),OUT,.6);   // the forward pylon
 K.shape([[11.0,3.3],[11.6,4.6],[13.6,5.2],[15.2,5.2],[15.8,4.4],[15.4,3.4]],sh(b,.94),OUT,.6);   // the aft pylon
 K.shape([[12.4,3.6],[13.0,4.0],[14.2,4.0],[14.4,3.5]],sh(b,.85),OUT,.5);   // engine
 K.strut(3.0,1.0,3.0,.42,.12); K.wheel(2.8,.4); K.wheel(3.2,.4);
 K.strut(10.4,1.0,10.4,.42,.12); K.wheel(10.4,.4);
 K.strut(2.0,3.8,2.0,4.6,.18,'#5d6672'); K.strut(13.9,5.2,13.9,5.45,.18,'#5d6672');
 K.rotor(2.0,4.65,9.14,3,{chord:.64}); K.rotor(13.9,5.5,9.14,3,{chord:.64});
}};

/* KAMOV KA-32 (first flight 1973): fuselage 11.3, H 5.4, two stacked (coaxial) rotors of 15.9 turning opposite ways, twin fins */
PR.ka32={dims:{L:15.9,H:5.4,rotor:15.9,body:11.3},draw(K){ const b=K.body, st=K.stripe;
 K.shape([[6.6,2.9],[10.4,2.75],[10.5,2.3],[6.6,1.8]],b,OUT,.6);
 K.poly([[9.5,2.8],[10.6,2.75],[10.6,2.6],[9.5,2.62]],sh(b,.9),OUT,.4); K.poly([[10.2,3.6],[10.9,3.6],[11.3,2.05],[10.6,2.0]],sh(b,.9),OUT,.5);   // stabilizer + end fin
 K.hull([[0,1.35],[.3,2.1],[1.2,2.65],[2.6,2.8],[6.8,2.85],[7.2,1.9],[6.4,1.1],[2.0,.95],[.4,1.05]],{inner:()=>{ K.shape(K.band([[0,1.6],[7.2,1.7]],.14),st,null); K.line(3.4,2.75,3.4,1.1,sh(b,.72),.04); K.line(4.6,2.75,4.6,1.1,sh(b,.72),.04); }});
 K.shape([[2.4,2.8],[2.9,3.35],[6.4,3.35],[6.9,2.85]],sh(b,.94),OUT,.6);
 K.glass([[.05,1.42],[.32,2.12],[1.2,2.6],[2.1,2.66,1],[2.0,1.45,1]],GL); K.glass([[3.55,2.5,1],[4.45,2.5,1],[4.45,1.9,1],[3.55,1.9,1]],GL);
 K.strut(1.2,1.0,1.2,.4,.09); K.wheel(1.2,.38); K.strut(5.6,1.05,5.6,.42,.1); K.wheel(5.6,.42);
 K.strut(4.4,3.35,4.4,5.25,.16,'#5d6672');
 K.rotor(4.4,4.35,7.95,3,{chord:.48}); K.rotor(4.4,5.3,7.95,3,{chord:.48});
 K.mark(10.9,3.6,'beacon');
}};

/* MD 520N (first flight 1990): fuselage 7.8, H 3.0, rotor 8.33. NO tail rotor: air blown out of the tail boom (NOTAR) and a
   steerable jet thruster at its end keep the nose straight. Five blades, an egg-shaped cabin */
PR.md520n={dims:{L:9.78,H:2.74,rotor:8.33},draw(K){ const b=K.body, st=K.stripe;
 K.skid(-.05,2.6,.04,.26); K.strut(.6,.06,.7,.62,.05); K.strut(2.2,.06,2.1,.66,.05);
 K.shape([[2.6,1.82],[6.9,1.7],[7.0,1.4],[2.6,1.25]],b,OUT,.6);
 K.shape([[6.9,1.82,1],[7.6,1.72,1],[7.62,1.4,1],[6.9,1.3,1]],sh(b,.85),OUT,.5); for(let i=0;i<3;i++) K.line(7.0+i*.2,1.75,7.0+i*.2,1.36,'rgba(0,0,0,.3)',.02);   // the thruster
 K.poly([[6.0,1.72],[6.9,1.68],[6.9,1.58],[6.0,1.6]],sh(b,.9),OUT,.4); K.poly([[6.6,2.25],[6.9,2.25],[6.95,1.25],[6.65,1.25]],st,OUT,.5);   // stabilizer + end fin
 K.hull([[0,1.15],[.15,1.65],[.75,2.08],[1.6,2.2],[2.6,2.05],[2.9,1.4],[2.4,.68],[.9,.6],[.2,.78]],{inner:()=>{ K.shape(K.band([[0,1.05],[3,1.1]],.1),st,null); }});
 K.glass([[.06,1.2],[.2,1.66],[.8,2.04],[1.4,2.1,1],[1.35,1.05,1],[.4,.92]],GL); K.glass([[1.55,1.98,1],[2.3,1.95,1],[2.3,1.25,1],[1.55,1.25,1]],GL);
 K.strut(1.85,2.15,1.85,2.62,.1,'#5d6672');
 K.rotor(1.85,2.66,4.165,5,{chord:.2});
}};

/* BELL BOEING V-22 OSPREY (first flight 1989): L 17.5, H 6.73, rotors 11.6. A tiltrotor: the engine nacelles at the wingtips
   point up to hover like a helicopter and tilt forward to fly like an airplane. Shown hovering-ready on the ground. H-tail */
PR.v22={dims:{L:17.5,H:6.73,rotor:11.6},draw(K){ const b=K.body, st=K.stripe;
 const fin=f=>K.poly([[14.9,3.0],[15.8,5.35],[16.8,5.45],[17.5,4.9],[17.45,2.7],[16.2,2.6]],f,OUT,.6);
 fin(sh(b,.85)); K.foil(14.9,2.4,3.1,.2,sh(b,.9));
 K.hull([[0,1.5],[.4,2.3],[1.6,2.9],[3.0,3.15],[12.0,3.2],[15.6,3.1,1],[15.7,2.6,1],[14.6,1.7],[12.0,1.0],[3.0,.9],[.6,1.05]],{inner:()=>{ K.shape(K.band([[0,2.1],[15.7,2.4]],.12),st,null); }});
 K.shape([[5.0,1.5],[5.6,1.8],[10.0,1.8],[10.6,1.4],[10.0,1.0],[5.6,1.0]],sh(b,.9),OUT,.6);   // sponson
 K.glass([[.12,1.6],[.42,2.3],[1.4,2.8],[2.3,2.9,1],[2.2,1.65,1]],GL); K.windows(3.6,4.6,2.25,.32,.42,2);
 K.wing({le:6.4,c:2.6,y:3.55,t:.5});
 K.shape([[6.2,3.2],[6.1,5.2],[6.4,5.65],[7.6,5.65],[7.9,5.2],[7.8,3.2],[7.0,3.0]],sh(b,.95),OUT,.6);   // the near nacelle, pointing up
 K.strut(7.0,5.65,7.0,6.55,.2,'#5d6672');
 K.strut(1.8,1.0,1.8,.38,.09); K.wheel(1.8,.36); K.strut(8.6,1.0,8.6,.45,.12); K.wheel(8.6,.42);
 fin(b);
 K.rotor(7.0,6.6,5.8,3,{chord:.6});
}};

/* SIKORSKY S-64 SKYCRANE (first flight 1962): fuselage 21.41, H 7.75, rotor 21.95. A flying crane: a thin spine with nothing under
   the middle (loads hang there), long legs, a six-blade rotor */
PR.s64={dims:{L:26.97,H:7.75,rotor:21.95},draw(K){ const b=K.body, st=K.stripe;
 K.shape([[4.4,5.4],[17.5,5.1],[17.6,4.3],[4.4,4.1]],b,OUT,.6);   // the spine
 K.shape([[16.8,4.6],[18.6,5.1],[19.6,6.15],[20.3,6.2,1],[21.0,5.3],[21.41,4.6],[20.6,4.0,1],[17.4,4.1]],b,OUT,.6);   // tail pylon
 K.trotor(20.2,5.31,2.44,4);
 K.hull([[0,3.6],[.3,4.5],[1.4,5.15],[3.2,5.3],[5.6,5.35],[5.8,3.6],[4.8,2.75],[1.2,2.75],[.2,3.05]],{inner:()=>{ K.shape(K.band([[0,3.9],[5.8,3.95]],.14),st,null); }});
 K.shape([[5.5,5.4],[5.9,6.1],[9.4,6.1],[10.2,5.3]],sh(b,.94),OUT,.6);   // engines + gearbox
 K.glass([[.1,3.65],[.4,4.5],[1.4,5.05],[2.4,5.12,1],[2.3,3.55,1]],GL); K.glass([[3.2,5.0,1],[4.6,5.0,1],[4.6,4.2,1],[3.2,4.2,1]],GL);
 // the long legs
 K.strut(2.0,2.8,2.0,.45,.14); K.wheel(2.0,.45);
 K.strut(9.0,4.2,10.4,.5,.16); K.strut(11.0,4.2,10.4,.5,.12); K.wheel(10.4,.5);
 K.strut(6.65,6.1,6.65,7.6,.24,'#5d6672');
 K.mark(20.0,6.2,'beacon');
 K.rotor(6.65,7.65,10.98,6,{chord:.66});
}};

/* the eight new Hall of Flight rotorcraft (facts verified; see js/content/aircraft/cards.js for sources) */
const P=(body,stripe)=>({body,stripe});
const NEW=[
 {id:'bell47',name:'BELL 47',cat:'ROTORCRAFT',year:1945,role:'LIGHT HELICOPTER',seats:3,paint:P('#e9edf2','#c8102e'),
  facts:['In 1946 it became the first helicopter certified for civilian use.','Its bubble canopy and open tail boom made it easy to recognize.'],clue:'A big glass bubble, an open metal-frame tail and skids.'},
 {id:'uh1',name:'BELL UH-1 IROQUOIS (HUEY)',cat:'ROTORCRAFT',year:1956,role:'UTILITY HELICOPTER',seats:14,paint:P('#4f5a3f','#2f3326'),
  facts:['Nicknamed the Huey, from its first Army name, HU-1.','One of the first helicopters powered by a turbine engine.'],clue:'Two wide blades, a long boxy cabin with sliding doors, and skids.'},
 {id:'h125',name:'AIRBUS H125 (ÉCUREUIL)',cat:'ROTORCRAFT',year:1974,role:'LIGHT HELICOPTER',seats:7,paint:P('#f4f4f2','#d9731a'),
  facts:['On May 14, 2005, one landed on the summit of Mount Everest.','It is also called the AS350, or Écureuil: French for squirrel.'],clue:'A tall, rounded cabin, three blades and high skids.'},
 {id:'ch47',name:'BOEING CH-47 CHINOOK',cat:'ROTORCRAFT',year:1961,role:'HEAVY-LIFT HELICOPTER',seats:36,paint:P('#4a4f3a','#2f3326'),
  facts:['Two big rotors turn in opposite directions, so it needs no tail rotor.','It can lift and carry very heavy loads hanging underneath.'],clue:'A long body with a rotor at EACH end.'},
 {id:'ka32',name:'KAMOV KA-32',cat:'ROTORCRAFT',year:1980,role:'COAXIAL HELICOPTER',seats:15,paint:P('#e46a1a','#f4f4f2'),
  facts:['Two rotors are stacked on one mast and turn in opposite directions (a coaxial rotor), so it has no tail rotor.','It is used for firefighting, rescue and lifting loads.'],clue:'Two rotors stacked one above the other, and no tail rotor.'},
 {id:'md520n',name:'MD 520N (NOTAR)',cat:'ROTORCRAFT',year:1990,role:'LIGHT HELICOPTER',seats:5,paint:P('#1f3a6a','#f4f4f2'),
  facts:['NOTAR means NO TAil Rotor: air blown along the tail boom does the tail rotor’s job.','Without a spinning tail rotor it is quieter and safer around people on the ground.'],clue:'An egg-shaped cabin and a smooth tail boom with NO tail rotor.'},
 {id:'v22',name:'BELL BOEING V-22 OSPREY',cat:'ROTORCRAFT',year:1989,role:'TILTROTOR',seats:27,paint:P('#7f878f','#5d656d'),
  facts:['A tiltrotor: it takes off like a helicopter, then tilts its rotors forward to fly like an airplane.','Its wing and rotors can fold up to fit on a ship.'],clue:'Huge rotors on engines at the wingtips, and two tail fins.'},
 {id:'s64',name:'SIKORSKY S-64 SKYCRANE',cat:'ROTORCRAFT',year:1962,role:'FLYING CRANE',seats:3,paint:P('#e46a1a','#f4f4f2'),
  facts:['A flying crane: there is no cabin under its middle, so loads can hang right below the rotor.','Today many fight wildfires with a big water tank fitted underneath.'],clue:'A thin, skeleton-like body on long legs, with nothing in the middle.'}
];
for(const m of NEW){ if(H.HALL.some(x=>x.id===m.id)) continue; m.hall=true; m.kind='custom'; m.req=0; m.sub=m.year+' • '+m.role; m.isNew=true; H.HALL.push(m); }
/* fact fixes after the r7.4 review (see the change log): years and wording checked against primary sources */
const fix=(id,f)=>{ const m=H.HALL.find(x=>x.id===id); if(m) f(m); };
fix('b206',m=>{ m.year=1966; m.sub=m.year+' • '+m.role; });
fix('ask21',m=>{ m.year=1979; m.sub=m.year+' • '+m.role; });
fix('hurricane',m=>{ m.facts=['In 1940 there were more Hurricanes than Spitfires defending Britain.','Its rear fuselage was fabric stretched over a metal frame, and early ones had fabric-covered wings too.']; });
fix('a320',m=>{ m.facts=['One of the best-selling airliners ever, built by the European company Airbus.','It was the first airliner with digital fly-by-wire controls, flown with a side-stick.']; });
fix('lancaster',m=>{ m.facts=['A big four-engine British bomber from World War II.','Of more than 7,000 built, only two are still kept flying: one in Britain and one in Canada.']; });
fix('dr1',m=>{ m.facts=['A triplane: three wings stacked one above the other.','The famous “Red Baron,” Manfred von Richthofen, flew one painted bright red.']; });
H.useProfiles();
})();
