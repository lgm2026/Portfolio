/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* HYPETEEN FLIGHT ACADEMY - FIGURES: the diagrams Ground School draws (airplane parts, instruments, FAA signs,
   charts, weather...). No images: everything is drawn on the canvas so it stays sharp and themeable.
   Every figure draws in a 240 x 120 box:
     G.FIG.draw(c, spec, x, y, w, h, marks)   fits the figure into a screen box. spec = 'name' or {f:'name', ...options}
     G.FIG.hit(spec, px, py, x, y, w, h)       which tap zone (if any) a screen point lands in
     G.FIG.zones(spec)                         [[id, x, y, w, h], ...] in box units (tap questions use these)
   marks = [{id, col}] outlines zones (the cadet's pick, the right answer). */
(function(){
const C=G.C, PI=Math.PI;
const F={}, Z={};
const INK='#e9edf2', MID='#aab3bf', DIM='#5d6672', BODY='#d5dbe2', SURF='#b9c2cc', DARK='#2a2e35', GLASS='#5b8fc7';
const ACC=()=>C.accent;
const T=(s,x,y,size,col,al,wt)=>G.txt(s,x,y,size||6,col||INK,al||'center',undefined,wt||800);
function arrow(c,x0,y0,x1,y1,col,w,head){
 head=head||5; const a=Math.atan2(y1-y0,x1-x0);
 c.strokeStyle=col; c.fillStyle=col; c.lineWidth=w||2; c.lineCap='round';
 c.beginPath(); c.moveTo(x0,y0); c.lineTo(x1-Math.cos(a)*head,y1-Math.sin(a)*head); c.stroke();
 c.beginPath(); c.moveTo(x1,y1); c.lineTo(x1-Math.cos(a-.5)*head*1.7,y1-Math.sin(a-.5)*head*1.7); c.lineTo(x1-Math.cos(a+.5)*head*1.7,y1-Math.sin(a+.5)*head*1.7); c.closePath(); c.fill();
}
function poly(c,pts,fill,stroke,lw){ c.beginPath(); pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1])); c.closePath(); if(fill){ c.fillStyle=fill; c.fill(); } if(stroke){ c.strokeStyle=stroke; c.lineWidth=lw||1; c.stroke(); } }
function circ(c,x,y,r,fill,stroke,lw){ c.beginPath(); c.arc(x,y,r,0,PI*2); if(fill){ c.fillStyle=fill; c.fill(); } if(stroke){ c.strokeStyle=stroke; c.lineWidth=lw||1; c.stroke(); } }
function line(c,x0,y0,x1,y1,col,w,dash){ c.strokeStyle=col; c.lineWidth=w||1; c.lineCap='round'; if(dash) c.setLineDash(dash); c.beginPath(); c.moveTo(x0,y0); c.lineTo(x1,y1); c.stroke(); if(dash) c.setLineDash([]); }
function rr(c,x,y,w,h,r,fill,stroke,lw){ G.rrect(x,y,w,h,r); if(fill){ c.fillStyle=fill; c.fill(); } if(stroke){ c.strokeStyle=stroke; c.lineWidth=lw||1; c.stroke(); } }
function glow(c,x,y,r,col){ c.save(); c.shadowColor=col; c.shadowBlur=6; circ(c,x,y,r,col); c.restore(); }
const has=(o,k)=>o&&o.hl&&(o.hl===k||(Array.isArray(o.hl)&&o.hl.indexOf(k)>=0));
/* small labels with a leader line: [px,py, tx,ty, text, align] */
function labels(c,list,col){
 for(const L of list){ const [px,py,tx,ty,s,al]=L; line(c,px,py,tx,ty+(ty<py?6:0),G.rgba(col||C.accent,.8),.8); circ(c,px,py,1.4,col||C.accent); T(s,tx,ty-(ty<py?2:0),5.2,col||C.accentHi,al||'center'); }
}

/* ============ the trainer, side view (nose right) ============ */
function planeSide(c,o){
 o=o||{}; const P=k=>has(o,k)?ACC():null;
 // fin + rudder
 poly(c,[[72,56],[49,24],[39,24],[39,56]],P('fin')||SURF,DIM,.8);
 poly(c,[[39,24],[31,25],[29,61],[39,62]],P('rudder')||G.shade(SURF,.88),DIM,.8);
 // fuselage
 c.beginPath(); c.moveTo(37,55); c.lineTo(112,46); c.lineTo(119,42); c.lineTo(166,42); c.lineTo(180,52); c.lineTo(203,56);
 c.quadraticCurveTo(210,64,203,72); c.lineTo(180,78); c.lineTo(118,80); c.lineTo(37,63); c.closePath();
 c.fillStyle=P('fuselage')||BODY; c.fill(); c.strokeStyle=DIM; c.lineWidth=.8; c.stroke();
 // cowling (engine)
 c.beginPath(); c.moveTo(180,52); c.lineTo(203,56); c.quadraticCurveTo(210,64,203,72); c.lineTo(180,78); c.closePath();
 c.fillStyle=P('engine')||'#c3cad3'; c.fill(); c.stroke();
 for(let i=0;i<3;i++) line(c,186+i*5,60,186+i*5,70,G.rgba('#000000',.25),1);
 // windows + stripe
 poly(c,[[166,44],[177,52],[169,52],[160,45]],GLASS); rr(c,123,46,17,9,2,GLASS); rr(c,143,46,19,9,2,GLASS);
 line(c,44,60,178,68,'#3d6fb0',1.6);
 // horizontal stabilizer + elevator (seen edge-on)
 rr(c,34,57,30,3.6,1.6,P('hstab')||SURF,DIM,.6); rr(c,23,57.6,12,2.6,1.2,P('elevator')||G.shade(SURF,.85),DIM,.6);
 // wing (high wing, edge-on) + strut
 c.beginPath(); c.moveTo(110,42); c.quadraticCurveTo(112,35,124,35); c.lineTo(176,36); c.lineTo(178,41); c.lineTo(110,42.5); c.closePath();
 c.fillStyle=P('wing')||SURF; c.fill(); c.strokeStyle=DIM; c.stroke();
 line(c,138,78,124,42,'#8d96a2',2);
 // landing gear
 const g=P('gear');
 line(c,140,79,147,93,g||'#7d8590',2.6); circ(c,147,96,6.5,g||DARK); circ(c,147,96,2.2,'#9aa3ad');
 line(c,192,77,194,93,g||'#7d8590',2.2); circ(c,194,97,5.5,g||DARK); circ(c,194,97,1.8,'#9aa3ad');
 // propeller + spinner
 const p=P('prop');
 rr(c,207,37,4.4,54,2.2,p||'#3a3f48'); if(!p){ c.fillStyle='#f4f4f4'; c.fillRect(207,37,4.4,4); c.fillRect(207,87,4.4,4); }
 c.beginPath(); c.ellipse(206,64,4.4,5,0,-PI/2,PI/2); c.fillStyle=p||'#d0322a'; c.fill();
 if(o.labels){
  const L={prop:[209,40,224,14,'PROPELLER','right'],engine:[192,58,196,30,'ENGINE','center'],wing:[150,36,150,16,'WING','center'],
   fuselage:[100,62,96,100,'FUSELAGE','center'],gear:[147,102,166,112,'LANDING GEAR','left'],fin:[48,34,58,10,'VERTICAL STABILIZER','left'],
   rudder:[32,40,16,26,'RUDDER','center'],hstab:[50,59,60,84,'HORIZONTAL STABILIZER','center'],elevator:[26,59,18,76,'ELEVATOR','center'],
   tail:[50,44,40,10,'EMPENNAGE (TAIL)','center']};
  labels(c,(o.labels===true?['prop','wing','fuselage','gear','fin']:o.labels).map(k=>L[k]).filter(Boolean));
 }
}
Z.planeSide=[['prop',199,34,20,60],['engine',176,50,28,30],['rudder',24,22,16,42],['fin',40,22,34,32],['hstab',19,54,48,10],['wing',108,32,72,13],['gear',126,82,82,24],['fuselage',64,44,114,38]];

/* ============ the trainer, top view (nose up) ============ */
function planeTop(c,o){
 o=o||{}; const P=k=>has(o,k)?ACC():null;
 // wings
 for(const s of [1,-1]){
  const X=x=>120+s*(x-120);
  poly(c,[[X(113),34],[X(22),36],[X(20),48],[X(113),50]],P('wing')||SURF,DIM,.8);
  poly(c,[[X(22),44],[X(64),43.6],[X(64),48.6],[X(20.4),48]],P('aileron')||G.shade(SURF,.82),DIM,.7);
  poly(c,[[X(68),43.4],[X(111),43],[X(111),49.8],[X(68),48.8]],P('flap')||G.shade(SURF,.9),DIM,.7);
  // tail
  poly(c,[[X(118),92],[X(88),94],[X(88),100],[X(118),100]],P('hstab')||SURF,DIM,.7);
  poly(c,[[X(88),100],[X(118),100],[X(118),105.5],[X(90),105]],P('elevator')||G.shade(SURF,.84),DIM,.7);
 }
 // fuselage
 c.beginPath(); c.moveTo(114,15); c.quadraticCurveTo(120,6,126,15); c.lineTo(127.5,40); c.lineTo(126,62); c.lineTo(122.5,104); c.lineTo(117.5,104); c.lineTo(114,62); c.lineTo(112.5,40); c.closePath();
 c.fillStyle=P('fuselage')||BODY; c.fill(); c.strokeStyle=DIM; c.lineWidth=.8; c.stroke();
 poly(c,[[114.5,22],[125.5,22],[124.5,29],[115.5,29]],GLASS);
 rr(c,118.4,95,3.2,17,1.4,P('rudder')||'#8d96a2');
 rr(c,101,4,38,3.4,1.7,P('prop')||'#3a3f48'); circ(c,120,7.5,2.6,P('prop')||'#d0322a');
 if(o.labels){
  const L={aileron:[44,46,30,66,'AILERON','center'],flap:[90,47,82,66,'FLAP','center'],elevator:[104,103,72,114,'ELEVATOR','center'],
   rudder:[120,110,150,116,'RUDDER','left'],hstab:[140,96,176,90,'HORIZONTAL STABILIZER','left'],wing:[180,40,198,24,'WING','center'],
   fuselage:[120,70,150,74,'FUSELAGE','left'],prop:[132,5,160,10,'PROPELLER','left']};
  labels(c,(o.labels===true?['aileron','flap','elevator','rudder']:o.labels).map(k=>L[k]).filter(Boolean));
 }
}
Z.planeTop=[['rudder',115,104,10,10],['elevator',86,99,32,9],['elevator',122,99,32,9],['hstab',86,89,68,11],['aileron',18,41,48,10],['aileron',174,41,48,10],
 ['flap',66,41,46,11],['flap',128,41,46,11],['wing',18,31,95,11],['wing',127,31,95,11],['prop',99,0,42,10],['fuselage',111,10,18,94]];
F.planeSide=planeSide; F.planeTop=planeTop;

/* ============ four forces ============ */
F.forces=function(c,o){
 c.save(); c.translate(120,64); c.scale(.56,.56); c.translate(-122,-64); planeSide(c,{}); c.restore();
 const hide=k=>o&&o.hide&&o.hide.indexOf(k)>=0, Lb=(k,s)=>hide(k)?'?':s;
 arrow(c,120,48,120,8,'#3fdc7c',3); T(Lb('lift','LIFT'),132,8,6.4,'#3fdc7c','left');
 arrow(c,120,74,120,114,'#ff6a5a',3); T(Lb('weight','WEIGHT'),132,104,6.4,'#ff6a5a','left');
 arrow(c,178,62,228,62,'#ffc21a',3); T(Lb('thrust','THRUST'),210,46,6.4,'#ffc21a','center');
 arrow(c,64,62,14,62,'#5b9bff',3); T(Lb('drag','DRAG'),30,46,6.4,'#5b9bff','center');
};
Z.forces=[['lift',104,2,40,46],['weight',104,74,40,46],['thrust',176,44,64,30],['drag',0,44,66,30]];

/* ============ wing / airfoil: o.aoa (degrees), o.stall, o.angle (show the angle) ============ */
F.wing=function(c,o){
 o=o||{}; const a=(o.aoa==null?5:o.aoa)*PI/180, cx=132, cy=64;
 // relative wind
 for(let i=0;i<4;i++){ const y=34+i*20; arrow(c,6,y,50,y,'#5b9bff',1.6,3.4); }
 if(!o.quiz) T('RELATIVE WIND',28,20,5,'#5b9bff');   // quiz: unlabeled, for 'tap the relative wind'
 c.save(); c.translate(cx,cy); c.rotate(-a);
 // airflow lines over/under
 if(!o.stall){ c.strokeStyle=G.rgba('#5b9bff',.55); c.lineWidth=1;
  for(const k of [-1,1]){ c.beginPath(); c.moveTo(-90,k*20); c.bezierCurveTo(-60,k*20,-40,k*(k<0?28:14),0,k*(k<0?24:13)); c.bezierCurveTo(40,k*(k<0?18:10),70,k*14,96,k*16); c.stroke(); } }
 // airfoil
 c.beginPath(); c.moveTo(-62,0); c.bezierCurveTo(-62,-14,-30,-16,0,-12); c.bezierCurveTo(30,-8,52,-3,66,0); c.bezierCurveTo(40,3,0,6,-30,6); c.bezierCurveTo(-52,6,-62,4,-62,0); c.closePath();
 c.fillStyle=SURF; c.fill(); c.strokeStyle=INK; c.lineWidth=1; c.stroke();
 // chord line
 line(c,-70,0,76,0,G.rgba(INK,.7),.8,[3,3]);
 if(o.stall){ c.strokeStyle=G.rgba('#5b9bff',.55); c.lineWidth=1; c.beginPath(); c.moveTo(-90,-16); c.bezierCurveTo(-70,-18,-62,-20,-50,-16); c.stroke();
  c.beginPath(); c.moveTo(-90,16); c.bezierCurveTo(-40,14,20,10,96,14); c.stroke();
  c.strokeStyle='#ff6a5a'; c.lineWidth=1.2;
  c.beginPath(); for(let x=-46;x<=90;x+=2){ const y=-18-(x+46)*.22+Math.sin(x*.32)*3.2; x===-46?c.moveTo(x,y):c.lineTo(x,y); } c.stroke();
  for(const [x,y,r] of [[-14,-20,4.5],[12,-22,5.5],[40,-20,6],[66,-16,5]]){ c.beginPath(); for(let k=0;k<=24;k++){ const a=k/24*PI*3.2, rr2=r*(1-k/30); c.lineTo(x+Math.cos(a)*rr2,y+Math.sin(a)*rr2*.8); } c.stroke(); } }
 c.restore();
 if(o.angle){ line(c,cx-70,cy,cx+70,cy,G.rgba('#5b9bff',.7),.8,[2,3]);
  c.strokeStyle=C.accent; c.lineWidth=1.4; c.beginPath(); c.arc(cx,cy,48,-a,0); c.stroke();
  T('ANGLE OF ATTACK',cx+70,cy+8,5,C.accentHi,'right'); }
 if(o.labels){ T('LEADING EDGE',cx-74,cy+(o.aoa||5)*1.1+10,5,INK,'center'); T('TRAILING EDGE',cx+72,cy-(o.aoa||5)*1.1-16,5,INK,'center'); }
};
Z.wing=o=>{ const a=((o&&o.aoa)==null?5:o.aoa)*PI/180, cx=132, cy=64, lx=cx-62*Math.cos(a), ly=cy+62*Math.sin(a), tx=cx+66*Math.cos(a), ty=cy-66*Math.sin(a);
 return [['lead',lx-14,ly-14,26,28],['trail',tx-14,ty-14,28,28],['top',cx-48,cy-40-Math.sin(a)*10,90,24],['wind',0,26,56,72]]; };

/* ============ the three axes: o.quiz hides every label ============ */
F.axes=function(c,o){
 o=o||{}; const k=id=>has(o,id), col=id=>k(id)?C.accent:'#5b9bff', T=(...a)=>{ if(!o.quiz) G.txt(a[0],a[1],a[2],a[3]||6,a[4]||INK,a[5]||'center',undefined,800); };
 c.save(); c.translate(120,58); c.scale(.62,.62); c.translate(-120,-58); planeTop(c,{}); c.restore();
 line(c,120,2,120,118,col('long'),k('long')?2.4:1.4,[4,3]); T('ROLL',126,2,6,col('long'),'left'); T('LONGITUDINAL',126,110,4.6,MID,'left');
 line(c,6,50,234,50,col('lat'),k('lat')?2.4:1.4,[4,3]); T('PITCH',232,36,6,col('lat'),'right'); T('LATERAL',8,36,4.6,MID,'left');
 circ(c,120,50,4,col('vert')); c.strokeStyle=col('vert'); c.lineWidth=1.4; c.beginPath(); c.arc(120,50,12,PI*.15,PI*1.6); c.stroke();
 arrow(c,120+12*Math.cos(PI*1.45),50+12*Math.sin(PI*1.45),120+12*Math.cos(PI*1.62),50+12*Math.sin(PI*1.62),col('vert'),1.4,2.6);
 T('YAW',138,56,6,col('vert'),'left'); T('VERTICAL',138,66,4.6,MID,'left');
};
Z.axes=[['vert',104,36,32,30],['long',110,0,20,32],['long',110,78,20,42],['lat',0,40,44,20],['lat',196,40,44,20]];

/* ============ cockpit controls ============ */
F.cockpit=function(c,o){
 o=o||{}; const P=k=>has(o,k)?ACC():null;
 rr(c,4,4,232,46,7,'#1b1f26','#3a404a');
 for(let i=0;i<6;i++){ const x=50+(i%3)*28, y=i<3?18:38; circ(c,x,y,8.5,'#0b0d10','#5d6672',.8); line(c,x,y,x+5*Math.cos(i*1.3),y-5*Math.sin(i*1.3+.6),INK,1); }
 rr(c,150,12,70,26,4,'#0b0d10','#5d6672',.8); T('RADIO 121.5',185,20,4.4,'#3fdc7c');
 // yoke
 rr(c,114,50,12,20,2,'#2b2f36');
 c.strokeStyle=P('yoke')||'#454b55'; c.lineWidth=7; c.lineCap='round'; c.lineJoin='round';
 c.beginPath(); c.moveTo(94,54); c.lineTo(98,70); c.lineTo(142,70); c.lineTo(146,54); c.stroke();
 rr(c,88,46,10,18,4,P('yoke')||'#2a2e35'); rr(c,142,46,10,18,4,P('yoke')||'#2a2e35');
 // throttle + mixture
 line(c,178,76,178,90,'#6b7380',2.6); circ(c,178,72,6.5,P('throttle')||'#141414','#5d6672',1);
 line(c,200,76,200,90,'#6b7380',2.6); circ(c,200,72,6.5,P('mixture')||'#d0322a','#5d6672',1);
 if(o.labels){ T('THROTTLE',168,68,4.6,MID,'right'); T('MIXTURE',210,68,4.6,MID,'left'); T('YOKE',120,76,5,MID); }
 // pedals
 for(const x of [84,130]){ rr(c,x,96,26,19,4,P('pedals')||'#3a3f48','#5d6672',.8); for(let i=0;i<3;i++) line(c,x+5,101+i*5,x+21,101+i*5,'#262a31',1.2); }
 if(o.labels) T('RUDDER PEDALS',78,102,4.6,MID,'right');
};
Z.cockpit=[['throttle',168,62,20,24],['mixture',190,62,20,24],['yoke',84,44,72,32],['pedals',78,92,84,26]];

/* ============ instruments ============ */
function bezel(c,cx,cy,r){ const m=c.createLinearGradient(cx-r,cy-r,cx+r,cy+r); m.addColorStop(0,'#8d96a2'); m.addColorStop(.5,'#3a4250'); m.addColorStop(1,'#9aa3ad'); circ(c,cx,cy,r+r*.05,m); const f=c.createRadialGradient(cx,cy,r*.2,cx,cy,r); f.addColorStop(0,'#15181d'); f.addColorStop(1,'#07080a'); circ(c,cx,cy,r*.94,f); }
function glass(c,cx,cy,r){ const g=c.createRadialGradient(cx-r*.4,cy-r*.45,r*.05,cx-r*.3,cy-r*.3,r*1.1); g.addColorStop(0,'rgba(255,255,255,.28)'); g.addColorStop(.35,'rgba(255,255,255,.07)'); g.addColorStop(1,'rgba(255,255,255,0)'); circ(c,cx,cy,r*.94,g); c.strokeStyle='rgba(0,0,0,.35)'; c.lineWidth=r*.04; c.beginPath(); c.arc(cx,cy,r*.94,0,PI*2); c.stroke(); }
function needle(c,cx,cy,a,len,w,col){ c.save(); c.translate(cx,cy); c.rotate(a); c.fillStyle=col||'#f4f4f4'; c.beginPath(); c.moveTo(-len*.12,-w); c.lineTo(len,0); c.lineTo(-len*.12,w); c.closePath(); c.fill(); c.restore(); }
const G_={};
G_.asi=function(c,cx,cy,r,o){
 const ang=v=>-PI/2+(v/200)*PI*2*.9, arc=(a,b,rr2,col,w)=>{ c.beginPath(); c.arc(cx,cy,rr2,ang(a),ang(b)); c.strokeStyle=col; c.lineWidth=w; c.stroke(); };
 arc(40,85,r*.70,'#f2f2f2',r*.07); arc(48,129,r*.80,'#2fbf5a',r*.1); arc(129,163,r*.80,'#f2c21a',r*.1);
 c.save(); c.translate(cx,cy); c.rotate(ang(163)); c.fillStyle='#e5332a'; c.fillRect(r*.66,-r*.035,r*.26,r*.07); c.restore();
 for(let v=40;v<=200;v+=10){ const a=ang(v), l=v%20?r*.08:r*.14; line(c,cx+Math.cos(a)*(r*.9-l),cy+Math.sin(a)*(r*.9-l),cx+Math.cos(a)*r*.9,cy+Math.sin(a)*r*.9,INK,Math.max(.6,r*.025)); }
 if(r>20) for(let v=40;v<=180;v+=20){ const a=ang(v); T(String(v),cx+Math.cos(a)*r*.52,cy+Math.sin(a)*r*.52-r*.07,r*.1,INK); }
 if(r>20) T('KNOTS',cx,cy-r*.42,r*.085,MID);
 needle(c,cx,cy,ang(o.v==null?100:o.v),r*.82,r*.055); circ(c,cx,cy,r*.08,'#333');
};
G_.alt=function(c,cx,cy,r,o){
 const v=o.v==null?2500:o.v;
 for(let i=0;i<50;i++){ const a=-PI/2+i/50*PI*2, l=i%5?r*.07:r*.14; line(c,cx+Math.cos(a)*(r*.9-l),cy+Math.sin(a)*(r*.9-l),cx+Math.cos(a)*r*.9,cy+Math.sin(a)*r*.9,INK,Math.max(.6,r*.025)); }
 for(let i=0;i<10;i++){ const a=-PI/2+i/10*PI*2; T(String(i),cx+Math.cos(a)*r*.63,cy+Math.sin(a)*r*.63-r*.09,r*.13,INK); }
 if(r>20){ rr(c,cx+r*.18,cy-r*.08,r*.36,r*.16,1,'#1d2128'); T('29.92',cx+r*.36,cy-r*.06,r*.065,INK); T('ALT',cx-r*.36,cy-r*.07,r*.085,MID); }
 needle(c,cx,cy,-PI/2+(v/100000)*PI*2,r*.86,r*.025,'#cfd6de');
 needle(c,cx,cy,-PI/2+((v%10000)/10000)*PI*2,r*.5,r*.1,'#f4f4f4');
 needle(c,cx,cy,-PI/2+((v%1000)/1000)*PI*2,r*.8,r*.055,'#f4f4f4');
 circ(c,cx,cy,r*.08,'#333');
};
G_.ai=function(c,cx,cy,r,o){
 const bank=(o.bank||0)*PI/180, pitch=(o.pitch||0);
 c.save(); c.beginPath(); c.arc(cx,cy,r*.92,0,PI*2); c.clip();
 c.translate(cx,cy); c.rotate(-bank); c.translate(0,pitch*r*.03);
 c.fillStyle='#3d8bd8'; c.fillRect(-r*2,-r*2,r*4,r*2); c.fillStyle='#8a5a32'; c.fillRect(-r*2,0,r*4,r*2);
 line(c,-r*2,0,r*2,0,'#f4f4f4',Math.max(1,r*.04));
 for(const d of [-20,-10,10,20]){ const y=-d*r*.03, w=Math.abs(d)===10?r*.28:r*.4; line(c,-w/2,y,w/2,y,'#f4f4f4',Math.max(.6,r*.02)); }
 c.fillStyle='#f4f4f4'; c.beginPath(); c.moveTo(0,-r*.74); c.lineTo(-r*.06,-r*.64); c.lineTo(r*.06,-r*.64); c.closePath(); c.fill();
 c.restore();
 for(const d of [-60,-45,-30,-20,-10,0,10,20,30,45,60]){ const a=-PI/2+d*PI/180, l=Math.abs(d)%30===0?r*.14:r*.08; line(c,cx+Math.cos(a)*(r*.9-l),cy+Math.sin(a)*(r*.9-l),cx+Math.cos(a)*r*.9,cy+Math.sin(a)*r*.9,'#f4f4f4',Math.max(.6,r*.03)); }
 const O='#ff8a1a', w=Math.max(1.2,r*.07);
 line(c,cx-r*.5,cy,cx-r*.16,cy,O,w); line(c,cx+r*.16,cy,cx+r*.5,cy,O,w); line(c,cx-r*.16,cy,cx-r*.16,cy+r*.08,O,w); line(c,cx+r*.16,cy,cx+r*.16,cy+r*.08,O,w); circ(c,cx,cy,r*.05,O);
};
G_.tc=function(c,cx,cy,r,o){
 const turn=o.turn||0, ball=o.ball||0;
 for(const a of [0,PI*20/180,PI,PI*160/180]) line(c,cx+Math.cos(a)*r*.72,cy+Math.sin(a)*r*.72,cx+Math.cos(a)*r*.9,cy+Math.sin(a)*r*.9,'#f4f4f4',Math.max(1,r*.05));
 if(r>20){ T('L',cx-r*.72,cy+r*.3,r*.11,INK); T('R',cx+r*.72,cy+r*.3,r*.11,INK); T('2 MIN',cx,cy-r*.52,r*.075,MID); T('TURN COORDINATOR',cx,cy-r*.36,r*.055,MID); }
 c.save(); c.translate(cx,cy); c.rotate(turn*20*PI/180);
 line(c,-r*.7,0,r*.7,0,'#f4f4f4',Math.max(1.2,r*.08)); circ(c,0,0,r*.13,'#f4f4f4'); line(c,0,-r*.12,0,-r*.26,'#f4f4f4',Math.max(1,r*.06));
 c.restore();
 rr(c,cx-r*.42,cy+r*.44,r*.84,r*.2,r*.1,'#e8e2c8'); line(c,cx-r*.1,cy+r*.44,cx-r*.1,cy+r*.64,'#222',Math.max(.6,r*.02)); line(c,cx+r*.1,cy+r*.44,cx+r*.1,cy+r*.64,'#222',Math.max(.6,r*.02));
 circ(c,cx+ball*r*.3,cy+r*.54,r*.085,'#111');
};
G_.hi=function(c,cx,cy,r,o){
 const hdg=(o.v||0)*PI/180, labs=['N','3','6','E','12','15','S','21','24','W','30','33'];
 c.save(); c.translate(cx,cy); c.rotate(-hdg);
 for(let d=0;d<360;d+=5){ c.save(); c.rotate(d*PI/180); line(c,0,-r*.88,0,-r*.88+(d%30===0?r*.14:(d%10===0?r*.09:r*.05)),'#f4f4f4',Math.max(.5,r*.02)); c.restore(); }
 if(r>14) labs.forEach((s,i)=>{ c.save(); c.rotate(i*PI/6); T(s,0,-r*.7,i%3===0?r*.14:r*.1,i%3===0?'#f4f4f4':INK); c.restore(); });
 c.restore();
 c.fillStyle='#ff8a1a'; c.beginPath(); c.moveTo(cx,cy-r*.9); c.lineTo(cx-r*.06,cy-r*.98); c.lineTo(cx+r*.06,cy-r*.98); c.closePath(); c.fill();
 c.save(); c.translate(cx,cy); c.fillStyle='#ff8a1a';
 c.fillRect(-r*.04,-r*.3,r*.08,r*.5); c.fillRect(-r*.28,-r*.08,r*.56,r*.07); c.fillRect(-r*.12,r*.16,r*.24,r*.05); c.restore();
};
G_.vsi=function(c,cx,cy,r,o){
 const ang=v=>PI+(Math.max(-2000,Math.min(2000,v))/2000)*PI*.95;
 for(let v=-2000;v<=2000;v+=100){ const a=ang(v), l=v%500?r*.07:r*.14; line(c,cx+Math.cos(a)*(r*.9-l),cy+Math.sin(a)*(r*.9-l),cx+Math.cos(a)*r*.9,cy+Math.sin(a)*r*.9,'#f4f4f4',Math.max(.5,r*.022)); }
 if(r>20){ for(const v of [0,500,1000,1500,-500,-1000,-1500]){ const a=ang(v); T(String(Math.abs(v)/100),cx+Math.cos(a)*r*.6,cy+Math.sin(a)*r*.6-r*.08,r*.12,INK); }
  T('UP',cx-r*.06,cy-r*.34,r*.09,MID); T('DOWN',cx-r*.06,cy+r*.22,r*.09,MID); T('100 FT/MIN',cx+r*.28,cy-r*.06,r*.06,MID); }
 needle(c,cx,cy,ang(o.v||0),r*.82,r*.055); circ(c,cx,cy,r*.08,'#333');
};
function gauge(c,kind,cx,cy,r,o){ bezel(c,cx,cy,r); (G_[kind]||G_.asi)(c,cx,cy,r,o||{}); glass(c,cx,cy,r); }
F.gauge=function(c,o){ gauge(c,o.g,120,60,56,o); };
const SIX=[['asi',60,30],['ai',120,30],['alt',180,30],['tc',60,90],['hi',120,90],['vsi',180,90]];
const SIXN={asi:'AIRSPEED',ai:'ATTITUDE',alt:'ALTIMETER',tc:'TURN COORD.',hi:'HEADING',vsi:'VERTICAL SPEED'};
F.sixpack=function(c,o){
 o=o||{}; const vals=Object.assign({asi:{v:105},ai:{},alt:{v:3500},tc:{},hi:{v:90},vsi:{v:0}},o.vals||{});
 { const pg=c.createLinearGradient(0,0,0,120); pg.addColorStop(0,'#2a2f37'); pg.addColorStop(1,'#111419'); rr(c,24,0,192,120,8,pg); c.fillStyle='rgba(255,255,255,.05)'; for(let yy=2;yy<118;yy+=3) c.fillRect(26,yy,188,1); }
 for(const [k,x,y] of SIX){ gauge(c,k,x,y,26,vals[k]); if(has(o,k)){ circ(c,x,y,28,null,C.accent,2); } if(o.labels) T(SIXN[k],x,y+26,3.8,C.accentHi); }
};
Z.sixpack=SIX.map(([k,x,y])=>[k,x-28,y-29,56,58]);

/* ============ runway end (top-down) ============ */
F.runway=function(c,o){
 o=o||{}; const num=String(o.num==null?'27':o.num);
 rr(c,0,0,240,120,6,'#4f7a3e');
 c.fillStyle='#3a3d42'; c.fillRect(78,0,84,120);
 c.fillStyle='#f2f2f2'; c.fillRect(81,0,2,120); c.fillRect(157,0,2,120);
 for(let i=0;i<8;i++){ const x=86+i*9+(i>3?4:0); c.fillRect(x,102,5.5,15); }
 G.txt(num,120,62,num.length>2?17:21,'#f2f2f2','center',72,800);
 for(let y=-4;y<54;y+=20) c.fillRect(118.8,y,2.4,12);
 if(o.labels){ T('THRESHOLD',196,106,5,INK); T('RUNWAY NUMBER',196,72,5,INK); T('CENTERLINE',196,22,5,INK); }
};

/* ============ FAA airfield signs: o.s = [{k:'mandatory'|'location'|'direction'|'destination', t, arrow:'l'|'r'|'u'}] ============ */
function signLayout(o){
 const list=(o&&o.s)||[{k:'mandatory',t:'9-27'}], gap=12, h=28, rows=list.map(s=>{ const w=G.tw(s.t,11,800)+18+(s.arrow?18:0); return {s,w}; });
 const tot=rows.reduce((a,r)=>a+r.w,0)+gap*(rows.length-1); let x=120-tot/2;
 return rows.map(r=>{ const R={s:r.s,x,y:46-h/2+4,w:r.w,h}; x+=r.w+gap; return R; });
}
function arrowGlyph(c,x,y,dir,col){ c.save(); c.translate(x,y); c.rotate({r:0,l:PI,u:-PI/2,d:PI/2,ur:-PI/4,ul:-PI*3/4}[dir]||0); arrow(c,-6,0,7,0,col,2.4,3.4); c.restore(); }
F.sign=function(c,o){
 for(const R of signLayout(o)){
  const {s,x,y,w,h}=R, k=s.k;
  c.fillStyle='#6b7380'; c.fillRect(x+6,y+h,3,12); c.fillRect(x+w-9,y+h,3,12);
  const bg={mandatory:'#c8102e',location:'#111',direction:'#ffc21a',destination:'#ffc21a'}[k], ink={mandatory:'#fff',location:'#ffc21a'}[k]||'#111';
  rr(c,x,y,w,h,2,bg,'#000',1);
  if(k==='location'){ c.strokeStyle='#ffc21a'; c.lineWidth=1.4; c.strokeRect(x+3,y+3,w-6,h-6); }
  let tx=x+w/2; if(s.arrow==='l'||s.arrow==='ul') tx+=8; else if(s.arrow) tx-=8;
  if(k==='mandatory'){ c.save(); c.font=G.font(11,800); c.textAlign='center'; c.textBaseline='top'; c.lineWidth=2; c.strokeStyle='#000'; c.strokeText(s.t,tx,y+5); c.restore(); }
  G.txt(s.t,tx,y+5,11,ink,'center',undefined,800);
  if(s.arrow) arrowGlyph(c,(s.arrow==='l'||s.arrow==='ul')?x+13:x+w-13,y+h/2,s.arrow,ink);
  if(o.labels) T({mandatory:'MANDATORY',location:'LOCATION',direction:'DIRECTION',destination:'DESTINATION'}[k],x+w/2,y+h+16,5,MID);
 }
};
Z.sign=o=>signLayout(o).map(R=>[R.s.id||R.s.k,R.x-4,R.y-6,R.w+8,R.h+20]);

/* ============ runway holding position marking ============ */
F.holdshort=function(c,o){
 o=o||{};
 rr(c,0,0,240,120,6,'#4f7a3e');
 c.fillStyle='#3a3d42'; c.fillRect(0,4,240,42); c.fillStyle='#f2f2f2'; c.fillRect(0,6,240,1.6); c.fillRect(0,42.4,240,1.6);
 for(let x=4;x<240;x+=26) c.fillRect(x,24.2,14,1.8);
 c.fillStyle='#3a3d42'; c.fillRect(88,46,64,74);
 c.fillStyle='#ffc21a'; c.fillRect(119,64,2,56);
 for(let x=88;x<152;x+=8){ c.fillRect(x+1,50,5,2); c.fillRect(x+1,55,5,2); }
 c.fillRect(88,61,64,2); c.fillRect(88,66,64,2);
 rr(c,160,56,40,18,2,'#c8102e','#000',1); c.save(); c.font=G.font(7.6,800); c.textAlign='center'; c.textBaseline='top'; c.lineWidth=1.6; c.strokeStyle='#000'; c.strokeText('9-27',180,59.5); c.restore(); T('9-27',180,59.5,7.6,'#fff');
 c.fillStyle='#6b7380'; c.fillRect(165,74,2,8); c.fillRect(193,74,2,8);
 if(o.labels){ T('RUNWAY',40,30,6,'#fff'); T('TAXIWAY',120,104,5.6,'#ffc21a'); T('DASHED: RUNWAY SIDE',84,50,4.4,INK,'right'); T('SOLID: STOP HERE',84,62,4.4,C.accentHi,'right'); }
};
Z.holdshort=[['run',60,0,120,58],['hold',60,70,120,50]];

/* ============ airport lighting at night ============ */
F.lights=function(c,o){
 o=o||{};
 rr(c,0,0,240,120,6,'#070a12');
 c.fillStyle='#22252b'; c.fillRect(20,38,200,32); c.fillRect(140,70,26,50);
 for(let x=30;x<=210;x+=18){ glow(c,x,35,1.8,'#fffbe6'); glow(c,x,73,1.8,'#fffbe6'); }
 for(let y=41;y<=67;y+=6.5){ glow(c,15,y,1.8,'#3fdc7c'); glow(c,225,y,1.8,'#ff3b30'); }
 for(let y=80;y<=116;y+=9){ glow(c,136,y,1.7,'#3d7bff'); glow(c,170,y,1.7,'#3d7bff'); glow(c,153,y+3,1.4,'#3fdc7c'); }
 if(o.labels){ T('EDGE: WHITE',70,22,5,'#fffbe6'); T('START: GREEN',30,82,5,'#3fdc7c'); T('END: RED',210,82,5,'#ff3b30'); T('TAXIWAY EDGE: BLUE',96,100,5,'#5b9bff'); }
};
Z.lights=[['thresh',6,36,18,36],['end',216,36,18,36],['tedge',128,74,52,46],['redge',26,28,190,12],['redge',26,66,108,12]];

/* ============ the traffic pattern ============ */
F.pattern=function(c,o){
 o=o||{}; const hide=o.hide||[], Lb=(k,s)=>hide.indexOf(k)>=0?'?':s, col=k=>has(o,k)?C.accent:'#5b9bff';
 c.fillStyle='#3a3d42'; c.fillRect(70,56,100,9); c.fillStyle='#f2f2f2'; for(let x=76;x<166;x+=14) c.fillRect(x,59.6,8,1.6);
 const leg=(k,x0,y0,x1,y1)=>{ arrow(c,x0,y0,x1,y1,col(k),has(o,k)?2.6:1.8,3.4); };
 leg('upwind',172,60,204,60); leg('crosswind',206,58,206,16); leg('downwind',204,12,40,12); leg('base',36,14,36,56); leg('final',38,60,68,60);
 T(Lb('upwind','UPWIND'),190,66,5.4,col('upwind')); T(Lb('crosswind','CROSSWIND'),200,32,5.4,col('crosswind'),'right');
 T(Lb('downwind','DOWNWIND'),120,17,5.4,col('downwind')); T(Lb('base','BASE'),42,32,5.4,col('base'),'left'); T(Lb('final','FINAL'),52,66,5.4,col('final'));
 if(o.wind!==false){ arrow(c,214,104,160,104,MID,1.6,3); T('WIND',187,92,5,MID); }
 T('RUNWAY',120,68,4.6,MID);
};
Z.pattern=[['upwind',168,50,30,18],['final',30,50,40,18],['crosswind',196,8,22,52],['base',26,8,20,52],['downwind',40,4,160,18]];

/* ============ windsock: o.kts (0-15+), o.from 'left'|'right', o.arrows ============ */
F.sock=function(c,o){
 o=o||{}; const kts=o.kts==null?10:o.kts, dir=o.from==='right'?-1:1, px=o.from==='right'?170:70, py=26;
 c.fillStyle='#8d96a2'; c.fillRect(px-1.6,py,3.2,90); c.fillRect(px-8,114,16,4);
 const th=.12+Math.min(kts,15)/15*(PI/2-.14), ax=dir*Math.sin(th), ay=Math.cos(th), nx=ay, ny=-ax, L=96;
 for(let i=0;i<5;i++){
  const t0=i/5, t1=(i+1)/5, r0=12-7*t0, r1=12-7*t1, sag=kts<6?(1-kts/6)*6:0;
  const p0=[px+ax*L*t0,py+ay*L*t0+sag*t0*t0], p1=[px+ax*L*t1,py+ay*L*t1+sag*t1*t1];
  poly(c,[[p0[0]+nx*r0,p0[1]+ny*r0],[p1[0]+nx*r1,p1[1]+ny*r1],[p1[0]-nx*r1,p1[1]-ny*r1],[p0[0]-nx*r0,p0[1]-ny*r0]],i%2?'#f4f4f4':'#ff6a1a');
 }
 circ(c,px,py,2.4,'#8d96a2');
 if(o.arrows){ for(let i=0;i<3;i++){ const y=36+i*16; if(dir>0) arrow(c,6,y,40,y,'#5b9bff',1.6,3); else arrow(c,234,y,200,y,'#5b9bff',1.6,3); } T('WIND',dir>0?22:218,86,5,'#5b9bff'); }
 if(o.labels) T(kts>=15?'15+ KNOTS':(kts<3?'CALM':'ABOUT '+kts+' KNOTS'),px+dir*60,104,5.4,MID);
};

/* ============ clouds ============ */
function cu(c,x,y,s){ c.save(); c.translate(x,y); c.scale(s,s); c.fillStyle='#f2f4f7';
 for(const [a,b,r] of [[-14,4,9],[-4,-5,12],[9,-1,10],[18,5,7],[-22,7,6]]) circ(c,a,b,r,'#f2f4f7'); c.fillRect(-26,4,50,9); c.fillStyle='#c9ced6'; c.fillRect(-26,10,50,3); c.restore(); }
function st(c,x,y,s){ c.save(); c.translate(x,y); c.scale(s,s); rr(c,-30,-6,60,9,4,'#b8bec7'); rr(c,-24,1,54,8,4,'#9ea5b0'); c.restore(); }
function ci(c,x,y,s){ c.save(); c.translate(x,y); c.scale(s,s); c.strokeStyle='rgba(242,244,247,.9)'; c.lineWidth=1.5; c.lineCap='round';
 for(let i=0;i<4;i++){ c.beginPath(); c.moveTo(-24+i*4,-6+i*5); c.quadraticCurveTo(0+i*3,-12+i*5,22+i*2,-4+i*5); c.stroke(); } c.restore(); }
function cb(c,x,y,s){ c.save(); c.translate(x,y); c.scale(s,s);
 const g=c.createLinearGradient(0,-40,0,36); g.addColorStop(0,'#f2f4f7'); g.addColorStop(.55,'#c3c9d2'); g.addColorStop(1,'#5f6773');
 c.fillStyle=g;
 c.beginPath(); c.moveTo(-46,-30); c.quadraticCurveTo(0,-44,48,-31); c.lineTo(40,-26); c.quadraticCurveTo(10,-30,14,-22); c.lineTo(-12,-22); c.quadraticCurveTo(-14,-30,-40,-25); c.closePath(); c.fill();
 c.fillRect(-14,-24,28,30);
 for(const [a,b,r] of [[-10,-16,9],[9,-12,10],[-4,-2,11],[12,4,11],[-14,8,11],[0,14,14],[-24,22,11],[24,22,11],[-12,26,10],[12,26,10]]) circ(c,a,b,r,g);
 c.fillStyle='#5f6773'; c.fillRect(-32,30,64,5);
 poly(c,[[2,35],[-5,47],[0,47],[-5,58],[8,43],[3,43],[8,35]],'#ffd23a');
 c.strokeStyle='rgba(120,170,230,.6)'; c.lineWidth=1; for(let i=0;i<6;i++){ c.beginPath(); c.moveTo(-24+i*9,37); c.lineTo(-27+i*9,50); c.stroke(); }
 c.restore(); }
F.clouds=function(c,o){
 o=o||{}; const one=({cirrus:'ci',cumulus:'cu',stratus:'st',cumulonimbus:'cb'})[o.only]||o.only, fns={cu,st,ci,cb};
 line(c,4,116,236,116,'#4f7a3e',2);
 if(one){ fns[one](c,120,one==='cb'?50:56,one==='cb'?1.1:1.8); return; }
 ci(c,36,22,1); cu(c,96,64,1); st(c,156,86,1); cb(c,206,60,.8);
 if(o.labels){ T('CIRRUS',36,44,5,MID); T('CUMULUS',96,84,5,MID); T('STRATUS',156,100,5,MID); T('CUMULONIMBUS',206,106,5,MID); }
};
Z.clouds=[['ci',6,4,60,36],['cu',66,40,58,40],['st',122,72,68,26],['cb',172,20,68,86]];

/* ============ weather fronts ============ */
function front(c,pts,col,kind){
 c.strokeStyle=col; c.lineWidth=2.4; c.lineJoin='round'; c.beginPath(); pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1])); c.stroke();
 let acc=0;
 for(let i=1;i<pts.length;i++){
  const [x0,y0]=pts[i-1],[x1,y1]=pts[i], L=Math.hypot(x1-x0,y1-y0), ux=(x1-x0)/L, uy=(y1-y0)/L;
  let nx=-uy, ny=ux; if(nx<0){ nx=-nx; ny=-ny; }
  for(let d=(18-acc%18);d<L;d+=18){ const x=x0+ux*d, y=y0+uy*d;
   if(kind==='cold') poly(c,[[x-ux*5,y-uy*5],[x+ux*5,y+uy*5],[x+nx*8,y+ny*8]],col);
   else { c.beginPath(); c.arc(x,y,5,Math.atan2(uy,ux),Math.atan2(uy,ux)+PI,ny*ux-nx*uy>0); c.fillStyle=col; c.fill(); } }
  acc+=L;
 }
}
F.fronts=function(c,o){
 o=o||{};
 front(c,[[80,6],[68,40],[62,74],[52,114]],'#3d7bff','cold');
 front(c,[[172,6],[182,40],[176,74],[186,114]],'#e5332a','warm');
 if(o.labels){ T('COLD FRONT',62,108,5.4,'#5b9bff','right'); T('WARM FRONT',188,4,5.4,'#ff6a5a','left'); }
};
Z.fronts=[['cold',30,0,74,120],['warm',150,0,74,120]];

/* ============ compass rose: o.hdg draws an arrow ============ */
F.compass=function(c,o){
 o=o||{}; const cx=120, cy=60, r=54;
 circ(c,cx,cy,r,'#101318','#5d6672',1);
 for(let d=0;d<360;d+=10){ const a=-PI/2+d*PI/180, l=d%30?4:8; line(c,cx+Math.cos(a)*(r-l),cy+Math.sin(a)*(r-l),cx+Math.cos(a)*r,cy+Math.sin(a)*r,INK,.8); }
 [['N',0],['E',90],['S',180],['W',270]].forEach(([s,d])=>{ const a=-PI/2+d*PI/180; T(s,cx+Math.cos(a)*(r-17),cy+Math.sin(a)*(r-17)-6,8,s==='N'?'#ff6a5a':INK); });
 [30,60,120,150,210,240,300,330].forEach(d=>{ const a=-PI/2+d*PI/180; T(String(d/10),cx+Math.cos(a)*(r-15),cy+Math.sin(a)*(r-15)-4,5,MID); });
 if(o.hdg!=null){ const a=-PI/2+o.hdg*PI/180; arrow(c,cx,cy,cx+Math.cos(a)*(r-24),cy+Math.sin(a)*(r-24),C.accent,2.6,4); circ(c,cx,cy,3,C.accent); }
 if(o.labels){ T('360°',cx+28,cy-r+2,5,MID,'left'); T('090°',cx+r+2,cy+6,5,MID,'left'); T('180°',cx+28,cy+r-10,5,MID,'left'); T('270°',cx-r-2,cy+6,5,MID,'right'); }
};
Z.compass=[['N',104,4,32,24],['E',196,44,32,32],['S',104,94,32,24],['W',12,44,32,32]];

/* ============ a sectional chart, simplified ============ */
F.sectional=function(c,o){
 o=o||{};
 rr(c,0,0,240,120,4,'#e9e2c6');
 c.fillStyle='#d5e3bd'; c.beginPath(); c.ellipse(60,96,70,30,.2,0,PI*2); c.fill(); c.beginPath(); c.ellipse(210,20,50,24,-.3,0,PI*2); c.fill();
 c.beginPath(); c.moveTo(120,8); c.bezierCurveTo(150,4,162,26,150,40); c.bezierCurveTo(138,54,112,40,120,8); c.fillStyle='#a8cfe9'; c.fill(); c.strokeStyle='#5f9fcb'; c.lineWidth=1; c.stroke();
 c.strokeStyle='#5f9fcb'; c.lineWidth=1.2; c.beginPath(); c.moveTo(150,40); c.bezierCurveTo(170,70,140,90,170,120); c.stroke();
 line(c,0,84,240,70,'#333',1.2); line(c,20,0,40,120,'#333',.8);
 for(let t=0;t<1;t+=.06){ const x=20+20*t, y=120*t; line(c,x-2,y,x+2,y,'#333',.7); }
 // Class D (dashed blue) + towered airport (blue)
 c.strokeStyle='#2a5bd7'; c.lineWidth=1.2; c.setLineDash([4,3]); c.beginPath(); c.arc(78,58,28,0,PI*2); c.stroke(); c.setLineDash([]);
 circ(c,78,58,7.5,'#2a5bd7'); line(c,73,61,83,55,'#fff',2);
 // Class E vignette + non-towered (magenta)
 c.strokeStyle='rgba(176,40,127,.28)'; c.lineWidth=9; c.beginPath(); c.arc(184,62,24,0,PI*2); c.stroke();
 circ(c,184,62,7,'#b0287f'); line(c,179,65,189,59,'#fff',1.8);
 // obstruction tower
 poly(c,[[132,102],[136,92],[140,102]],null,'#1d2a5a',1.2); circ(c,136,91,1.2,'#1d2a5a'); T('1049',148,98,3.8,'#1d2a5a','left');
 if(o.labels){ T('TOWER: BLUE',78,90,5,'#2a5bd7'); T('NO TOWER: MAGENTA',184,92,5,'#b0287f'); }
};
Z.sectional=[['towered',62,42,32,32],['nontowered',168,46,32,32]];

/* ============ airspace cross-section: o.hl highlights classes, o.quiz hides the letters ============ */
F.airspace=function(c,o){
 o=o||{}; const hl=k=>has(o,k);
 rr(c,0,0,240,120,4,'#0f141c');
 const q=!!o.quiz, Tq=(...a)=>{ if(!q) T(...a); };   // quiz: hide the letters so a tap question doesn't give itself away
 c.fillStyle=hl('A')?G.rgba(C.accent,.35):'rgba(140,150,165,.22)'; c.fillRect(0,0,240,18); Tq('A',10,5,7,INK,'left'); Tq('18,000 FT MSL AND UP',230,6,4.8,MID,'right');
 c.fillStyle=hl('E')?G.rgba(C.accent,.18):'rgba(208,74,168,.06)'; c.fillRect(0,18,240,80); Tq('E',216,30,7,'#d68ac0');
 c.fillStyle=hl('G')?G.rgba(C.accent,.3):'rgba(255,255,255,.04)'; c.fillRect(0,98,240,14); Tq('G',128,100,7,MID);
 line(c,0,98,240,98,'rgba(208,74,168,.45)',.8,[3,3]);
 const B='#3d7bff', blk=(x,y,w,h,col,dash,on)=>{ c.fillStyle=G.rgba(on?C.accent:col,on?.4:.22); c.fillRect(x,y,w,h); c.strokeStyle=on?C.accent:col; c.lineWidth=1.2; if(dash) c.setLineDash([3,2]); c.strokeRect(x,y,w,h); c.setLineDash([]); };
 blk(15,22,120,18,B,0,hl('B')); blk(35,40,80,26,B,0,hl('B')); blk(58,66,34,46,B,0,hl('B')); Tq('B',75,26,8,'#9cc0ff');
 blk(140,66,50,20,'#d04aa8',0,hl('C')); blk(152,86,26,26,'#d04aa8',0,hl('C')); Tq('C',165,70,7.6,'#f2a6dc');
 blk(200,90,32,22,B,1,hl('D')); Tq('D',216,94,7,'#9cc0ff');
 c.fillStyle='#6b4a2a'; c.fillRect(0,112,240,8);
 for(const x of [75,165,216]){ c.fillStyle='#d0d4da'; c.fillRect(x-6,110,12,2); }
};
Z.airspace=[['D',198,88,36,26],['C',138,64,54,24],['C',150,84,30,30],['B',13,20,124,22],['B',33,38,84,30],['B',56,64,38,50],['A',0,0,240,18],['G',0,99,240,14],['E',0,18,240,80]];   // one box per cake layer, so the corners fall through to E and G

/* ============ little top-view airplane icon ============ */
function planeIcon(c,x,y,rot,s,col){ c.save(); c.translate(x,y); c.rotate(rot); c.scale(s,s); c.fillStyle=col;
 rr(c,-2.2,-12,4.4,24,2.2,col); rr(c,-14,-4,28,5,2,col); rr(c,-6,8,12,3.4,1.5,col); c.restore(); }
F.row=function(c,o){
 rr(c,0,0,240,120,4,'#3d6e9e');
 line(c,110,78,110,26,'rgba(255,255,255,.6)',1.2,[4,4]); line(c,180,40,124,40,'rgba(255,255,255,.6)',1.2,[4,4]);
 circ(c,110,40,7,null,'#ff6a5a',1.6); T('!',110,34,7,'#ff6a5a');
 planeIcon(c,110,92,0,1.2,'#f4f4f4'); T('YOU',110,108,5.4,'#fff');
 planeIcon(c,198,40,-PI/2,1.2,'#ffd27a'); T('OTHER PLANE',198,54,4.6,'#fff');
};
Z.row=[['me',90,74,40,40],['other',176,20,44,40]];

/* ============ position lights ============ */
F.navlights=function(c,o){
 o=o||{}; rr(c,0,0,240,120,4,'#070a12');
 c.save(); c.globalAlpha=.85; planeTop(c,{}); c.restore();
 const pts=[['left',18,42,'#ff3b30'],['right',222,42,'#34e07a'],['tail',120,113,'#ffffff']];
 for(const [k,x,y,col] of pts){ if(o.quiz){ circ(c,x,y,6,'#1d2128','#aab3bf',1); T('?',x,y-4.6,5.6,INK); } else { glow(c,x,y,4,col); } }
 if(o.labels&&!o.quiz){ T('RED (LEFT)',26,58,5,'#ff6a5a'); T('GREEN (RIGHT)',214,58,5,'#34e07a'); T('WHITE (TAIL)',160,106,5,'#fff'); }
};
Z.navlights=[['left',2,26,34,34],['right',204,26,34,34],['tail',102,100,36,20]];

/* ============ center of gravity seesaw: o.shift 'ok'|'aft'|'fwd', o.quiz hides the verdict ============ */
F.cg=function(c,o){
 o=o||{}; const sh=o.shift||'ok', tilt=sh==='aft'?.12:(sh==='fwd'?-.12:0);
 poly(c,[[120,74],[106,104],[134,104]],'#8d96a2'); c.fillStyle='#4f5661'; c.fillRect(70,104,100,4);
 c.save(); c.translate(120,72); c.rotate(tilt);
 rr(c,-96,-4,192,7,2,'#c9a36a','#7a5c34',1);
 const box=(x,w,h,s)=>{ rr(c,x-w/2,-4-h,w,h,2,'#5b8fc7','#2a4a70',1); T(s,x,-4-h/2-3.5,4.6,'#fff'); };
 if(sh==='ok'){ box(-56,30,20,'PILOT'); box(56,30,20,'BAGS'); }
 else if(sh==='aft'){ box(-56,22,14,'PILOT'); box(80,34,30,'BAGS'); }
 else { box(-80,34,30,'BAGS'); box(56,22,14,'PILOT'); }
 T('NOSE',-84,8,5,MID); T('TAIL',84,8,5,MID);
 c.restore();
 if(!o.quiz) T(sh==='ok'?'BALANCED':(sh==='aft'?'TAIL-HEAVY':'NOSE-HEAVY'),120,8,6,sh==='ok'?'#3fdc7c':'#ffd27a');
};

/* ============ hot + high ============ */
F.hothigh=function(c,o){
 rr(c,0,0,240,120,4,'#16202e');
 circ(c,206,24,12,'#ffd23a'); for(let i=0;i<8;i++){ const a=i*PI/4; line(c,206+Math.cos(a)*16,24+Math.sin(a)*16,206+Math.cos(a)*22,24+Math.sin(a)*22,'#ffd23a',1.6); }
 poly(c,[[10,118],[96,30],[124,30],[176,82],[200,118]],'#6b5a48'); poly(c,[[96,30],[110,18],[124,30]],'#e8eef4');
 c.fillStyle='#d0d4da'; c.fillRect(98,28,24,2.4);
 planeIcon(c,140,20,PI/2,.7,'#f4f4f4');
 rr(c,222,52,8,46,4,'#e8eef4'); circ(c,226,100,7,'#e5332a'); c.fillStyle='#e5332a'; c.fillRect(224.5,58,3,40);
 T('95°F',212,62,5.4,'#ff8a6a','right');
 c.strokeStyle='rgba(255,140,90,.55)'; c.lineWidth=1.2; for(let i=0;i<3;i++){ c.beginPath(); for(let x=0;x<=26;x+=2) c.lineTo(150+x,52+i*8+Math.sin(x*.6+i)*2); c.stroke(); }
 T('HIGH',74,40,6,INK); T('HOT',186,44,6,'#ff8a6a');
};

/* ============ IMSAFE ============ */
F.imsafe=function(c,o){
 const L=[['I','ILLNESS'],['M','MEDICATION'],['S','STRESS'],['A','ALCOHOL'],['F','FATIGUE'],['E','EMOTION']];
 L.forEach(([l,w],i)=>{ const x=i<3?20:130, y=10+(i%3)*36; rr(c,x,y,24,24,4,C.accent); T(l,x+12,y+4,10,C.onAccent); T(w,x+32,y+7,7,INK,'left'); });
};

/* ============ aircraft types ============ */
const CR={};
CR.airplane=function(c){ c.save(); c.scale(.4,.4); c.translate(-122,-66); planeSide(c,{}); c.restore(); };
CR.heli=function(c,o){
 const hl=k=>o&&has(o,k);
 c.fillStyle=BODY; c.beginPath(); c.ellipse(8,4,19,12,0,0,PI*2); c.fill(); c.strokeStyle=DIM; c.lineWidth=.6; c.stroke();
 c.beginPath(); c.ellipse(18,0,9,8,0,-PI/2,PI/2); c.fillStyle=GLASS; c.fill();
 rr(c,-46,0,46,4.2,2,BODY,DIM,.6); poly(c,[[-46,2],[-50,-8],[-44,-8],[-40,2]],SURF,DIM,.6);
 circ(c,-46,-2,8,hl('tail')?G.rgba(C.accent,.6):'rgba(170,179,191,.25)',hl('tail')?C.accent:MID,1);
 line(c,6,-8,6,-14,'#7d8590',2.4); rr(c,-40,-17,86,3,1.5,hl('main')?C.accent:'#3a3f48');
 line(c,-12,16,-14,22,'#7d8590',1.6); line(c,22,16,24,22,'#7d8590',1.6); line(c,-20,22,32,22,'#7d8590',2);
};
CR.glider=function(c){ rr(c,-48,-3,96,6,3,SURF,DIM,.6); c.fillStyle=BODY; c.beginPath(); c.ellipse(0,2,3.2,22,0,0,PI*2); c.fill(); rr(c,-12,20,24,3.4,1.5,SURF,DIM,.6); poly(c,[[-1.6,-12],[1.6,-12],[1.4,-6],[-1.4,-6]],GLASS); };
CR.balloon=function(c){
 c.save(); c.beginPath(); c.arc(0,-12,22,PI*.85,PI*2.15); c.lineTo(8,15); c.lineTo(-8,15); c.closePath(); c.clip();
 const cols=['#e5332a','#ffc21a','#3d7bff','#ffc21a','#e5332a','#3fdc7c'];
 for(let i=0;i<6;i++){ c.fillStyle=cols[i]; c.fillRect(-22+i*7.4,-36,7.6,54); } c.restore();
 line(c,-7,15,-5,21,'#8d96a2',.8); line(c,7,15,5,21,'#8d96a2',.8); rr(c,-6,21,12,8,1.5,'#8a5a32'); poly(c,[[0,13],[-2,18],[2,18]],'#ffb23a');
};
CR.airship=function(c){ c.fillStyle='#c9d0d8'; c.beginPath(); c.ellipse(2,-4,40,12,0,0,PI*2); c.fill(); c.strokeStyle=DIM; c.lineWidth=.6; c.stroke();
 poly(c,[[-30,-8],[-44,-20],[-40,-6]],SURF); poly(c,[[-30,0],[-44,12],[-40,-2]],SURF); rr(c,-6,8,18,6,2,'#8d96a2'); line(c,-40,-4,30,-4,'#3d6fb0',1.4); };
CR.gyro=function(c){ c.fillStyle=BODY; c.beginPath(); c.ellipse(4,6,16,9,0,0,PI*2); c.fill(); c.beginPath(); c.ellipse(12,3,7,6,0,-PI/2,PI/2); c.fillStyle=GLASS; c.fill();
 line(c,2,-3,0,-16,'#7d8590',2.2); c.save(); c.translate(0,-17); c.rotate(-.08); rr(c,-40,-1.5,80,3,1.5,'#3a3f48'); c.restore();
 rr(c,-24,4,14,3,1.5,BODY); c.beginPath(); c.ellipse(-12,6,2.2,11,0,0,PI*2); c.fillStyle='rgba(58,63,72,.85)'; c.fill(); poly(c,[[-26,6],[-30,-6],[-24,-6],[-22,6]],SURF);
 circ(c,-2,18,3.6,DARK); circ(c,14,18,3.6,DARK); };
CR.tiltrotor=function(c){ rr(c,-40,-2,78,13,6,'#9aa3ad',DIM,.6); poly(c,[[38,0],[48,4],[38,10]],'#9aa3ad'); poly(c,[[30,0],[36,2],[36,6],[28,6]],GLASS);
 rr(c,-12,-7,30,5,2,'#8d96a2'); rr(c,0,-24,7,19,3,'#7d8590'); rr(c,-26,-27,58,2.6,1.3,'#3a3f48'); circ(c,3.5,-26,2,'#3a3f48');
 rr(c,-46,-10,4,14,1.5,'#8d96a2'); rr(c,-50,-11,12,3,1.5,'#8d96a2'); };
CR.trike=function(c){ poly(c,[[-46,-10],[0,-24],[46,-10],[0,-15]],'#3d7bff',DIM,.6); line(c,0,-15,0,8,'#7d8590',1.8); poly(c,[[-10,0],[10,0],[0,-15]],null,'#aab3bf',1.2);
 rr(c,-14,6,26,9,4,'#c9d0d8',DIM,.6); circ(c,-12,20,3.4,DARK); circ(c,10,20,3.4,DARK); circ(c,18,16,3,DARK); };
CR.ppc=function(c){ c.strokeStyle='#ff6a1a'; c.lineWidth=7; c.beginPath(); c.arc(0,10,42,PI*1.2,PI*1.8); c.stroke();
 c.strokeStyle='rgba(200,206,214,.6)'; c.lineWidth=.6; for(const a of [1.22,1.36,1.5,1.64,1.78]){ c.beginPath(); c.moveTo(Math.cos(a*PI)*40,10+Math.sin(a*PI)*40); c.lineTo(0,10); c.stroke(); }
 rr(c,-10,8,22,9,3,'#c9d0d8',DIM,.6); c.beginPath(); c.ellipse(-12,10,2,9,0,0,PI*2); c.fillStyle='rgba(58,63,72,.85)'; c.fill(); circ(c,-6,20,3,DARK); circ(c,8,20,3,DARK); };
const CRN={airplane:'AIRPLANE',heli:'HELICOPTER',glider:'GLIDER',balloon:'BALLOON',airship:'AIRSHIP',gyro:'GYROPLANE',tiltrotor:'TILTROTOR',trike:'WEIGHT-SHIFT TRIKE',ppc:'POWERED PARACHUTE'};
F.craft=function(c,o){
 o=o||{};
 if(o.list){ const n=o.list.length, w=240/n; o.list.forEach((t,i)=>{ const cx=w*i+w/2; c.save(); c.translate(cx,56); c.scale(Math.min(.9,w/104),Math.min(.9,w/104)); CR[t](c,o); c.restore(); if(o.labels) G.wrap(CRN[t],4.6,w-6,800).forEach((ln,k)=>T(ln,cx,96+k*7,4.6,MID)); }); return; }
 c.save(); c.translate(120,62); c.scale(1.6,1.6); CR[o.t||'airplane'](c,o); c.restore();
 if(o.labels) T(CRN[o.t||'airplane'],120,110,5.6,MID);
};
Z.craft=o=>{
 if(o&&o.list){ const n=o.list.length, w=240/n; return o.list.map((t,i)=>[t,w*i+2,4,w-4,112]); }
 if(o&&o.t==='heli') return [['tail',30,34,34,34],['main',54,28,140,16],['body',80,44,90,50]];
 return [];
};

/* ============ PAPI (r7.4): o.white = how many of the four lights show white (AIM 2-1-2): 4 high, 3 slightly high, 2 on the
   glide path, 1 slightly low, 0 low. The units sit left of the runway; the ones nearest the runway turn red first. ============ */
F.papi=function(c,o){
 o=o||{}; const n=Math.max(0,Math.min(4,o.white==null?2:o.white));
 rr(c,0,0,240,120,6,'#1d2b3d');
 const g=c.createLinearGradient(0,0,0,70); g.addColorStop(0,'#2c4a6e'); g.addColorStop(1,'#8a6a5a'); c.fillStyle=g; G.rrect(0,0,240,70,6); c.fill();   // dusk sky
 poly(c,[[0,70],[240,70],[240,120],[0,120]],'#2f4a2a');
 poly(c,[[150,70],[166,70],[236,120],[118,120]],'#3a3d42'); line(c,158,72,177,118,'#f2f2f2',1.2,[4,4]);   // the runway, running away from you
 for(let i=0;i<4;i++){ const x=40+i*22, y=94, white=i<n; rr(c,x-8,y-2,16,12,2,'#4f5661');
  c.save(); c.shadowColor=white?'#fffbe6':'#ff3b30'; c.shadowBlur=8; circ(c,x,y-5,4.4,white?'#fffbe6':'#ff3b30'); c.restore(); }
 const say=['TOO LOW','SLIGHTLY LOW','ON THE GLIDE PATH','SLIGHTLY HIGH','TOO HIGH'][n];
 T(say,73,20,7,n===2?'#3fdc7c':'#ffd27a'); T(n+' WHITE • '+(4-n)+' RED',73,34,5.2,INK);
};

/* ============ public API ============ */
const norm=spec=>typeof spec==='string'?{f:spec}:(spec||{});
function fit(x,y,w,h){ const s=Math.min(w/240,h/120); return {s,ox:x+(w-240*s)/2,oy:y+(h-120*s)/2}; }
G.FIG={
 names:()=>Object.keys(F),
 add(name,fn,z){ F[name]=fn; if(z) Z[name]=z; },   // r7.4: figure packs in their own files (hfq_figs_heli.js) register here
 kit:{arrow,poly,circ,line,rr,glow,labels,T,has,INK,MID,DIM,BODY,SURF,DARK,GLASS},
 drawPlane(c,o){ planeSide(c,o||{}); },   // the trainer, side view, in box units (wheels at about y=103)
 has:name=>!!F[name],
 zones(spec){ const o=norm(spec), z=Z[o.f]; return typeof z==='function'?z(o):(z||[]); },
 draw(c,spec,x,y,w,h,marks){
  const o=norm(spec), fn=F[o.f]; if(!fn) return;
  const t=fit(x,y,w,h);
  c.save(); c.translate(t.ox,t.oy); c.scale(t.s,t.s);
  c.save(); c.beginPath(); c.rect(-2,-2,244,124); c.clip(); fn(c,o); c.restore();
  for(const m of marks||[]) for(const z of this.zones(o)) if(z[0]===m.id){ rr(c,z[1],z[2],z[3],z[4],4,m.fill||null,m.col,2/t.s+.6); }
  c.restore();
 },
 hit(spec,px,py,x,y,w,h){
  const t=fit(x,y,w,h), lx=(px-t.ox)/t.s, ly=(py-t.oy)/t.s;
  for(const z of this.zones(spec)) if(lx>=z[1]&&lx<=z[1]+z[3]&&ly>=z[2]&&ly<=z[2]+z[4]) return z[0];
  return null;
 },
 center(spec,id,x,y,w,h){ const t=fit(x,y,w,h); const z=this.zones(spec).find(q=>q[0]===id); return z?[t.ox+(z[1]+z[3]/2)*t.s,t.oy+(z[2]+z[4]/2)*t.s]:null; }
};
})();
