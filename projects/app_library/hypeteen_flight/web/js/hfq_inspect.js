/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* CLOSE-UPS (r7.4): the Hangar's Tool Cart and Workbench and the Parking Stand's Fuel Truck each open their own close-up.
   Until r7.3 those three stations started the Crew Chief's (or the Line Crew's) talk instead of doing anything themselves.
   A close-up is a picture of the object with every part tappable: tap a part (or arrow to it and press Enter) and the crew
   member who works with it says what it is for. QUICK CHECK asks three questions about it (the quiz engine); passing it the
   first time is worth a little XP, once per object. Content (names, words, questions): js/content/inspect.js (H.addInspect).
   Scene: G.go('inspect', {id:'toolcart'|'workbench'|'fueltruck', back}). Progress: G.save.mod.inspect = {id:{seen:{item:1}, passed:time}}. */
(function(){
const H=G.HFQ, C=G.C, VW=G.VW, PI=Math.PI;
H.INSPECT=H.INSPECT||[];
H.addInspect=function(list){ for(const o of list){ const i=H.INSPECT.findIndex(x=>x.id===o.id); if(i<0) H.INSPECT.push(o); else H.INSPECT[i]=o; } };
H.xp=Object.assign(H.xp||{},{inspect:10});
const REC=()=>{ const m=G.save.mod; m.inspect=m.inspect||{}; return m.inspect; };
const rec=id=>{ const r=REC(); r[id]=r[id]||{seen:{}}; return r[id]; };

/* ---------------- the art: a background per object, then each part drawn inside its own box ---------------- */
const rr=(c,x,y,w,h,r)=>{ r=Math.max(0,Math.min(r,w/2,h/2)); c.beginPath(); c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath(); };
const lg=(c,x0,y0,x1,y1,stops)=>{ const g=c.createLinearGradient(x0,y0,x1,y1); stops.forEach((s,i)=>g.addColorStop(i/(stops.length-1),s)); return g; };
const metal=(c,x,y,w,h,col)=>{ c.fillStyle=lg(c,0,y,0,y+h,[G.shade(col,1.35),col,G.shade(col,.7)]); c.fillRect(x,y,w,h); };
const BG={
 toolcart(c,B){ // a red roll-around chest, top drawer pulled open: black foam with a cut-out for every tool
  c.fillStyle=lg(c,0,B.y,0,B.y+B.h,['#b8262a','#8e1b1f']); rr(c,B.x,B.y,B.w,B.h,10); c.fill();
  c.fillStyle='rgba(255,255,255,.08)'; c.fillRect(B.x+6,B.y+4,B.w-12,3);
  c.fillStyle='#16181d'; rr(c,B.x+8,B.y+12,B.w-16,B.h-24,6); c.fill();   // the foam
  c.strokeStyle='rgba(255,255,255,.06)'; c.lineWidth=1; for(let x=B.x+14;x<B.x+B.w-14;x+=9){ c.beginPath(); c.moveTo(x,B.y+14); c.lineTo(x,B.y+B.h-14); c.stroke(); }
  metal(c,B.x+B.w*.35,B.y+B.h-9,B.w*.3,5,'#c9ced6'); },   // the drawer pull
 workbench(c,B){ // a wooden bench top with a grey rubber mat
  c.fillStyle=lg(c,0,B.y,0,B.y+B.h,['#8a5f38','#6b4526']); rr(c,B.x,B.y,B.w,B.h,10); c.fill();
  c.strokeStyle='rgba(0,0,0,.14)'; c.lineWidth=1; for(let y=B.y+8;y<B.y+B.h;y+=9){ c.beginPath(); c.moveTo(B.x+4,y); c.bezierCurveTo(B.x+B.w*.3,y+2,B.x+B.w*.6,y-2,B.x+B.w-4,y+1); c.stroke(); }
  c.fillStyle='rgba(52,58,66,.92)'; rr(c,B.x+10,B.y+10,B.w-20,B.h-20,6); c.fill();
  c.strokeStyle='rgba(255,255,255,.05)'; for(let x=B.x+16;x<B.x+B.w-16;x+=12){ c.beginPath(); c.moveTo(x,B.y+12); c.lineTo(x,B.y+B.h-12); c.stroke(); } },
 fueltruck(c,B){ // the side of a refueler on the ramp: the tank, a hose cabinet, and the apron
  c.fillStyle=lg(c,0,B.y,0,B.y+B.h,['#7fa6cc','#b9cfe2']); rr(c,B.x,B.y,B.w,B.h,10); c.fill();
  c.fillStyle='#8f949b'; c.fillRect(B.x,B.y+B.h*.9,B.w,B.h*.1);
  c.fillStyle=lg(c,0,B.y+6,0,B.y+B.h*.88,['#f4f6f8','#cfd6de']); rr(c,B.x+6,B.y+6,B.w-12,B.h*.84,8); c.fill(); c.strokeStyle='rgba(20,22,26,.3)'; c.lineWidth=1; c.stroke();
  c.fillStyle='#2f6fb5'; c.fillRect(B.x+6,B.y+B.h*.36,B.w-12,4); }
};
const ITEM={
 /* ---- the tool cart ---- */
 torque(c,x,y,w,h){ const cy=y+h/2; metal(c,x+8,cy-3,w*.62,6,'#9aa3ad'); c.fillStyle='#1f2228'; rr(c,x+w*.66,cy-5,w*.3,10,5); c.fill();   // shaft + grip
  c.fillStyle='#c9ced6'; c.beginPath(); c.arc(x+8,cy,7,0,7); c.fill(); c.fillStyle='#5d6672'; c.fillRect(x+5,cy-3,6,6);                              // the square drive head
  c.fillStyle='#f4f4f2'; rr(c,x+w*.4,cy-6,22,12,3); c.fill(); c.strokeStyle='#1f2228'; c.lineWidth=.8; c.stroke(); c.fillStyle='#c23a3a'; c.fillRect(x+w*.4+10,cy-5,1.4,10);   // the scale window
  G.txt('FT-LB',x+w*.4+11,cy+7,3.4,'#c9ced6','center',undefined,800); },
 pliers(c,x,y,w,h){ const cy=y+h/2; c.strokeStyle='#c23a3a'; c.lineWidth=5; c.lineCap='round'; c.beginPath(); c.moveTo(x+w*.5,cy); c.lineTo(x+w*.95,cy-6); c.moveTo(x+w*.5,cy); c.lineTo(x+w*.95,cy+6); c.stroke();
  c.strokeStyle='#9aa3ad'; c.lineWidth=3; c.beginPath(); c.moveTo(x+6,cy-1); c.lineTo(x+w*.5,cy); c.moveTo(x+6,cy+2); c.lineTo(x+w*.5,cy); c.stroke(); c.fillStyle='#5d6672'; c.beginPath(); c.arc(x+w*.5,cy,3.4,0,7); c.fill();
  c.strokeStyle='#c9ced6'; c.lineWidth=.8; c.beginPath(); for(let i=0;i<6;i++){ c.moveTo(x+4+i*3,cy-5); c.lineTo(x+7+i*3,cy+5); } c.stroke(); c.lineCap='butt'; },
 mirror(c,x,y,w,h){ const cy=y+h/2; metal(c,x+18,cy-1.5,w*.42,3,'#9aa3ad'); c.fillStyle='#c9ced6'; c.beginPath(); c.arc(x+12,cy,9,0,7); c.fill(); c.fillStyle=lg(c,x+4,cy-8,x+20,cy+8,['#e9f4ff','#7fb2e0']); c.beginPath(); c.arc(x+12,cy,7,0,7); c.fill();
  c.fillStyle='#2a2d33'; rr(c,x+w*.66,cy-5,w*.3,10,4); c.fill(); c.fillStyle='#ffd24d'; c.beginPath(); c.arc(x+w*.96,cy,4.2,-PI/2,PI/2); c.fill(); },
 gauge(c,x,y,w,h){ const cx=x+w/2, cy=y+h/2; c.fillStyle='#2a2d33'; rr(c,cx-4,cy+2,8,h*.42,3); c.fill(); c.fillStyle='#c9ced6'; c.beginPath(); c.arc(cx,cy-2,10,0,7); c.fill(); c.fillStyle='#f4f4f2'; c.beginPath(); c.arc(cx,cy-2,8,0,7); c.fill();
  c.strokeStyle='#1f2228'; c.lineWidth=.6; for(let i=0;i<9;i++){ const a=PI*.8+i*PI*1.4/8; c.beginPath(); c.moveTo(cx+Math.cos(a)*6,cy-2+Math.sin(a)*6); c.lineTo(cx+Math.cos(a)*7.6,cy-2+Math.sin(a)*7.6); c.stroke(); }
  c.strokeStyle='#c23a3a'; c.lineWidth=1.2; c.beginPath(); c.moveTo(cx,cy-2); c.lineTo(cx+4,cy-6); c.stroke(); },
 sampler(c,x,y,w,h){ const cx=x+w*.42, cy=y+h/2; c.fillStyle='rgba(220,236,255,.35)'; rr(c,cx-9,cy-12,18,24,4); c.fill(); c.strokeStyle='rgba(220,236,255,.9)'; c.lineWidth=1; c.stroke();
  c.fillStyle='rgba(70,140,255,.75)'; rr(c,cx-8,cy-2,16,13,3); c.fill(); c.fillStyle='rgba(225,240,255,.9)'; rr(c,cx-8,cy+7,16,4,2); c.fill();   // blue fuel, a clear water layer at the bottom
  c.strokeStyle='#c9ced6'; c.lineWidth=2.2; c.beginPath(); c.moveTo(cx,cy-12); c.lineTo(cx,cy-18); c.stroke(); c.fillStyle='#ffd24d'; c.fillRect(cx+12,cy-4,w*.3,3); },
 shadow(c,x,y,w,h){ const cy=y+h/2; c.fillStyle='#0b0c0f'; c.strokeStyle='#ffc21a'; c.lineWidth=1.2;   // an empty cut-out: a combination wrench is missing
  c.beginPath(); c.arc(x+16,cy,8,0,7); c.rect(x+16,cy-3.5,w*.55,7); c.arc(x+16+w*.55,cy,7,0,7); c.fill(); c.setLineDash([3,2]); c.stroke(); c.setLineDash([]);
  G.txt('?',x+16+w*.27,cy-3.2,6,'#ffc21a','center',undefined,800);
  for(let i=0;i<3;i++){ const bx=x+w*.78+i*(w*.07); c.fillStyle='#9aa3ad'; rr(c,bx,cy-9,w*.045,18,2); c.fill(); } },
 /* ---- the workbench ---- */
 plug(c,x,y,w,h){ for(const k of [0,1]){ const px=x+w*(.28+k*.42), py=y+h*.5; c.fillStyle='#e9edf2'; rr(c,px-4,py-14,8,13,3); c.fill(); c.strokeStyle='#9aa3ad'; c.lineWidth=.6; for(let i=0;i<4;i++){ c.beginPath(); c.moveTo(px-4,py-12+i*3); c.lineTo(px+4,py-12+i*3); c.stroke(); }
  metal(c,px-5.5,py-1,11,6,'#9aa3ad'); metal(c,px-3,py+5,6,7,'#c9ced6'); c.fillStyle='#5d6672'; c.fillRect(px-.6,py+12,1.2,3); } },
 filter(c,x,y,w,h){ const cx=x+w/2, cy=y+h/2; c.fillStyle='#2f6fb5'; rr(c,cx-w*.36,cy-h*.36,w*.72,h*.72,6); c.fill();
  c.fillStyle='#f0e6c8'; c.beginPath(); c.ellipse(cx,cy,w*.27,h*.27,0,0,7); c.fill(); c.strokeStyle='#c9b98a'; c.lineWidth=1; for(let i=0;i<14;i++){ const a=i*PI*2/14; c.beginPath(); c.moveTo(cx+Math.cos(a)*w*.08,cy+Math.sin(a)*h*.08); c.lineTo(cx+Math.cos(a)*w*.26,cy+Math.sin(a)*h*.26); c.stroke(); }
  c.fillStyle='#c9ced6'; for(const [dx,dy] of [[.1,-.05],[.13,.08],[-.06,.12]]){ c.fillRect(cx+dx*w,cy+dy*h,1.6,1.2); } },
 prop(c,x,y,w,h){ const cy=y+h/2; c.fillStyle=lg(c,0,cy-6,0,cy+6,['#3a3f48','#1b1d22','#3a3f48']); c.beginPath(); c.moveTo(x+6,cy-3); c.quadraticCurveTo(x+w*.5,cy-8,x+w*.92,cy-3); c.quadraticCurveTo(x+w,cy,x+w*.92,cy+3); c.quadraticCurveTo(x+w*.5,cy+6,x+6,cy+3); c.closePath(); c.fill();
  c.fillStyle='#ffd24d'; c.fillRect(x+w*.9,cy-3,w*.06,6);   // the painted tip
  c.fillStyle='#c9ced6'; c.beginPath(); c.arc(x+8,cy,6,0,7); c.fill();
  c.strokeStyle='#ff6b4a'; c.lineWidth=1.2; c.beginPath(); c.arc(x+w*.62,cy-5.6,3.4,0,7); c.stroke(); c.fillStyle='#ff6b4a'; c.fillRect(x+w*.62-.5,cy-6.6,1,2); },   // the nick, circled
 brake(c,x,y,w,h){ const cx=x+w/2, cy=y+h/2, r=Math.min(w,h)*.42; c.fillStyle='#9aa3ad'; c.beginPath(); c.arc(cx,cy,r,0,7); c.fill(); c.fillStyle='#5d6672'; c.beginPath(); c.arc(cx,cy,r*.5,0,7); c.fill(); c.fillStyle='#2a2d33'; c.beginPath(); c.arc(cx,cy,r*.22,0,7); c.fill();
  c.fillStyle='#c9ced6'; for(let i=0;i<6;i++){ const a=i*PI/3; c.beginPath(); c.arc(cx+Math.cos(a)*r*.36,cy+Math.sin(a)*r*.36,1.6,0,7); c.fill(); }
  c.fillStyle='#c23a3a'; rr(c,cx+r*.55,cy-r*.45,r*.4,r*.9,2); c.fill(); },   // the caliper
 seal(c,x,y,w,h){ const cx=x+w*.5, cy=y+h/2; metal(c,x+4,cy-4,w-8,8,'#8d96a2'); c.fillStyle='#c9ced6'; c.beginPath(); for(let i=0;i<6;i++){ const a=i*PI/3+PI/6; c[i?'lineTo':'moveTo'](cx+Math.cos(a)*8,cy+Math.sin(a)*8); } c.closePath(); c.fill(); c.fillStyle='#5d6672'; c.beginPath(); c.arc(cx,cy,3,0,7); c.fill();
  c.strokeStyle='#ff7a1a'; c.lineWidth=2.4; c.beginPath(); c.moveTo(cx-4,cy-8); c.lineTo(cx+12,cy+6); c.stroke(); },
 logbook(c,x,y,w,h){ const cx=x+w/2, cy=y+h/2; c.fillStyle='#f4efe2'; c.beginPath(); c.moveTo(cx,cy-h*.38); c.lineTo(cx-w*.3,cy-h*.32); c.lineTo(cx-w*.3,cy+h*.36); c.lineTo(cx,cy+h*.3); c.lineTo(cx+w*.3,cy+h*.36); c.lineTo(cx+w*.3,cy-h*.32); c.closePath(); c.fill();
  c.strokeStyle='#9aa3ad'; c.lineWidth=.6; for(let i=0;i<4;i++){ const yy=cy-h*.2+i*h*.12; c.beginPath(); c.moveTo(cx-w*.26,yy); c.lineTo(cx-w*.04,yy+1); c.moveTo(cx+w*.04,yy+1); c.lineTo(cx+w*.26,yy); c.stroke(); }
  c.strokeStyle='#1f3a6a'; c.lineWidth=1; c.beginPath(); c.moveTo(cx+w*.12,cy+h*.2); c.quadraticCurveTo(cx+w*.16,cy+h*.1,cx+w*.2,cy+h*.2); c.quadraticCurveTo(cx+w*.22,cy+h*.26,cx+w*.25,cy+h*.18); c.stroke(); c.fillStyle='#9aa3ad'; c.fillRect(cx-.6,cy-h*.38,1.2,h*.68); },
 /* ---- the fuel truck ---- */
 blue(c,x,y,w,h){ c.fillStyle='#1a1c20'; G.txt('100LL',x+w*.32,y+h*.18,10,'#1f3a6a','center',w*.6,800); G.txt('AVGAS',x+w*.32,y+h*.6,6,'#1f3a6a','center',w*.6,800);
  c.fillStyle='rgba(220,236,255,.4)'; rr(c,x+w*.72,y+h*.15,w*.16,h*.7,4); c.fill(); c.strokeStyle='#9aa3ad'; c.lineWidth=.8; c.stroke(); c.fillStyle='rgba(70,140,255,.8)'; rr(c,x+w*.72+1,y+h*.4,w*.16-2,h*.44,3); c.fill(); },
 ground(c,x,y,w,h){ const cx=x+w*.3, cy=y+h/2; c.fillStyle='#3a3f48'; c.beginPath(); c.arc(cx,cy,h*.36,0,7); c.fill(); c.fillStyle='#c9ced6'; c.beginPath(); c.arc(cx,cy,h*.12,0,7); c.fill();
  c.strokeStyle='#2f8a4a'; c.lineWidth=1.6; c.beginPath(); c.moveTo(cx,cy+h*.2); c.quadraticCurveTo(x+w*.6,y+h*.95,x+w*.84,cy); c.stroke(); c.fillStyle='#c23a3a'; rr(c,x+w*.8,cy-6,w*.12,6,2); c.fill(); c.fillStyle='#9aa3ad'; c.fillRect(x+w*.86,cy,2,5); },
 nozzle(c,x,y,w,h){ const cy=y+h/2; for(const k of [0,1]){ const nx=x+6+k*w*.5, ny=cy-4+k*4; c.fillStyle=k?'#1a1c20':'#c23a3a'; rr(c,nx,ny-6,w*.22,12,4); c.fill(); c.fillStyle='#9aa3ad';
   if(k){ c.fillRect(nx+w*.22,ny-4,w*.16,8); G.txt('JET',nx+w*.11,ny+8,4.2,'#e9edf2','center',undefined,800); }   // the wide, flat jet spout
   else { c.fillRect(nx+w*.22,ny-1.5,w*.16,3); G.txt('AVGAS',nx+w*.11,ny+8,4.2,'#1a1c20','center',undefined,800); } } },
 placard(c,x,y,w,h){ const cx=x+w*.28, cy=y+h/2; c.fillStyle='#c9ced6'; c.beginPath(); c.arc(cx,cy,h*.3,0,7); c.fill(); c.fillStyle='#8d96a2'; c.beginPath(); c.arc(cx,cy,h*.2,0,7); c.fill();
  c.fillStyle='#f4f4f2'; rr(c,x+w*.5,y+h*.18,w*.46,h*.64,3); c.fill(); c.strokeStyle='#1a1c20'; c.lineWidth=.6; c.stroke(); G.txt('AVGAS',x+w*.73,y+h*.24,4.6,'#c23a3a','center',w*.4,800); G.txt('100LL',x+w*.73,y+h*.44,4.6,'#1a1c20','center',w*.4,800); G.txt('28 GAL',x+w*.73,y+h*.62,4,'#1a1c20','center',w*.4,800); },
 ext(c,x,y,w,h){ const cx=x+w*.3, b=y+h*.92; c.fillStyle=lg(c,cx-7,0,cx+7,0,['#8e1b1f','#d8323a','#8e1b1f']); rr(c,cx-7,b-h*.66,14,h*.66,5); c.fill(); c.fillStyle='#1a1c20'; c.fillRect(cx-3,b-h*.78,6,h*.12); c.fillRect(cx+2,b-h*.8,10,2);
  c.fillStyle='#f4f4f2'; rr(c,cx-5,b-h*.46,10,8,1.5); c.fill(); G.txt('NO SMOKING',x+w*.72,y+h*.38,4.4,'#c23a3a','center',w*.5,800); G.txt('WITHIN 50 FT',x+w*.72,y+h*.56,3.8,'#1a1c20','center',w*.5,800); },
 settle(c,x,y,w,h){ const cx=x+w*.24, cy=y+h/2, r=h*.34; c.fillStyle='#f4f4f2'; c.beginPath(); c.arc(cx,cy,r,0,7); c.fill(); c.strokeStyle='#1a1c20'; c.lineWidth=1; c.stroke(); c.beginPath(); c.moveTo(cx,cy); c.lineTo(cx,cy-r*.75); c.moveTo(cx,cy); c.lineTo(cx+r*.55,cy+r*.2); c.stroke();
  const tx=x+w*.6; c.fillStyle='rgba(220,236,255,.4)'; rr(c,tx,y+h*.12,w*.14,h*.76,4); c.fill(); c.strokeStyle='#9aa3ad'; c.lineWidth=.8; c.stroke(); c.fillStyle='rgba(70,140,255,.8)'; rr(c,tx+1,y+h*.3,w*.14-2,h*.42,3); c.fill(); c.fillStyle='rgba(235,245,255,.95)'; rr(c,tx+1,y+h*.72,w*.14-2,h*.14,2); c.fill();
  G.txt('WATER',tx+w*.24,y+h*.72,3.8,'#1f3a6a','left',undefined,800); }
};

/* ---------------- the scene ---------------- */
G.scenes.inspect={
 enter(a){ a=a||{}; this.a=a; this.o=H.INSPECT.find(x=>x.id===a.id)||H.INSPECT[0]; this.back=a.back||'world'; this.backArgs=a.backArgs||{}; this.sel=-1; this.t=0; this.kb=false;
  if(AUDIO.curName!=='hangar'&&this.o&&this.o.crew==='chief') AUDIO.play('hangar'); else if(AUDIO.curName!=='ramp'&&this.o&&this.o.crew!=='chief') AUDIO.play('ramp');
  if(this.o) G.announce(this.o.t+'. '+this.o.hello); },
 crew(){ const W=G.WORLD; for(const k in W.rooms) for(const n of W.rooms[k].npcs||[]) if(n.id===this.o.crew) return n; return {name:'CREW',av:{}}; },
 /* the card is as tall as the longest thing it will ever say (so it never jumps between parts); the picture gets the rest */
 TS:6.9, cardNeed(){ const o=this.o, TS=this.TS; if(this._need&&this._need.o===o) return this._need.h;
  const n=Math.max(...[o.hello,...o.items.map(i=>i.b)].map(t=>G.wrap(t,TS,VW-44,650).length)); this._need={o,h:50+n*TS*1.42+24}; return this._need.h; },
 layout(){ const VH=G.VH, btnY=VH-50, need=this.cardNeed(), art={x:10,y:48,w:VW-20,h:Math.round(Math.max(190,Math.min(320,btnY-16-need-48)))};
  const items=this.o.items.map((it,i)=>({i,it,x:art.x+it.at[0]*art.w,y:art.y+it.at[1]*art.h,w:it.at[2]*art.w,h:it.at[3]*art.h}));
  const cardY=art.y+art.h+8, card={x:10,y:cardY,w:VW-20,h:btnY-cardY-8};
  const r=rec(this.o.id), bw=(VW-30)/2;
  const btns=[{id:'back',label:'BACK',kind:'secondary',x:10,y:btnY,w:bw,h:38,size:7.4},{id:'quiz',label:r.passed?'QUICK CHECK AGAIN':'QUICK CHECK +'+H.xp.inspect+' XP',kind:'primary',x:20+bw,y:btnY,w:bw,h:38,size:r.passed?6.6:6.8}];
  return {art,items,card,btns,k:Math.max(1,Math.min(1.3,art.h/220))}; },
 pick(i){ const L=this.layout(), n=L.items.length; this.sel=(i+n)%n; const it=this.o.items[this.sel]; rec(this.o.id).seen[it.id]=1; G.persist(); AUDIO.sfx('card'); G.announce(it.t+'. '+it.b); },
 quiz(){ const o=this.o, r=rec(o.id), back={scene:'inspect',args:{id:o.id,back:this.back,backArgs:this.backArgs}};
  const mk=()=>o.quiz.map((q,k)=>({q:q.q,opts:G.shuffle(q.a.map(t=>({t}))),okT:q.a[0],why:q.why,src:'inspect',id:'inspect:'+o.id+'#'+k}));
  G.go('quiz',{title:'QUICK CHECK',sub:o.t,qs:mk(),reroll:mk,pass:.66,mode:'inspect',uid:o.id,ret:back,
   onDone:over=>{ const lines=[]; if(over.passed&&!r.passed){ r.passed=Date.now(); G.persist(); G.award(H.xp.inspect,'QUICK CHECK'); lines.push(['FIRST QUICK CHECK PASSED',H.xp.inspect]); }
    return {head:over.perfect?'SHARP EYES!':(over.passed?'CHECKED OUT':'TAKE ANOTHER LOOK'),line:over.passed?'You know what everything on '+o.t.toLowerCase().replace(/^the /,'the ')+' is for.':'Tap each part again and read what it is for, then try once more.',lines,againLabel:'TRY AGAIN',backLabel:'BACK TO '+o.t}; }}); },
 update(dt){ this.t+=dt; const L=this.layout();
  if(G.backHit()){ G.go(this.back,this.backArgs); return; }
  const n=L.items.length;
  if(G.pressed.right||G.pressed.down){ this.kb=true; this.pick(this.sel<0?0:this.sel+1); return; }
  if(G.pressed.left||G.pressed.up){ this.kb=true; this.pick(this.sel<0?n-1:this.sel-1); return; }
  for(const R of L.items) if(G.clicked(R.x,R.y,R.w,R.h)){ this.kb=false; this.pick(R.i); return; }
  for(const b of L.btns) if(G.clicked(b.x,b.y,b.w,b.h)){ AUDIO.sfx('ok'); if(b.id==='back') G.go(this.back,this.backArgs); else this.quiz(); return; }
  if(G.pressed.a&&this.sel<0){ this.pick(0); return; }
 },
 draw(c){
  const L=this.layout(), o=this.o, A=L.art, VH=G.VH;
  G.backdrop(.92);
  c.save(); c.shadowColor='rgba(0,0,0,.45)'; c.shadowBlur=14; c.shadowOffsetY=5; (BG[o.id]||BG.workbench)(c,A); c.restore();
  const pulse=G.rm()?.8:.55+Math.sin(this.t*4)*.25;
  L.items.forEach((R,i)=>{ const on=i===this.sel;
   c.save(); c.translate(R.x,R.y); c.scale(L.k,L.k); (ITEM[R.it.id]||(()=>{}))(c,0,0,R.w/L.k,R.h/L.k); c.restore();   // a taller picture draws every part a little bigger
   if(on){ c.save(); if(!G.rm()){ c.shadowColor=C.accentHi; c.shadowBlur=10; } rr(c,R.x-2,R.y-2,R.w+4,R.h+4,6); c.strokeStyle=G.rgba(C.accentHi,pulse); c.lineWidth=1.8; c.stroke(); c.restore(); }
   const seen=rec(o.id).seen[R.it.id], bx=R.x+R.w-6, by=R.y+5;   // a numbered marker on every part; a check once it has been read
   c.beginPath(); c.arc(bx,by,5.2,0,7); c.fillStyle=on?C.accentHi:(seen?G.rgba(C.good,.9):'rgba(10,12,20,.82)'); c.fill(); c.strokeStyle='rgba(255,255,255,.55)'; c.lineWidth=.8; c.stroke();
   G.txt(seen&&!on?'✓':String(i+1),bx,by-3,5,on?C.onAccent:'#fff','center',undefined,800); });
  // the card: the crew member says what the selected part is for (or hello)
  const K=L.card, it=this.sel>=0?o.items[this.sel]:null, who=this.crew(), body=it?it.b:o.hello;
  G.panel(K.x,K.y,K.w,K.h,{r:14,border:G.rgba(C.accent,.55)});
  G.drawPortrait(c,K.x+10,K.y+10,34,who.av,C.accent);
  G.txt(it?it.t:who.name,K.x+52,K.y+12,it?7.6:7,C.title,'left',K.w-62,800);
  G.txt(it?('PART '+(this.sel+1)+' OF '+o.items.length+' • '+who.name):who.role||'',K.x+52,K.y+25,5,C.dim,'left',K.w-62,800);
  const size=this.TS; G.para(body,K.x+12,K.y+50,size,C.ink,'left',K.w-24,size*1.42,650);
  const seenN=Object.keys(rec(o.id).seen).filter(k=>o.items.some(x=>x.id===k)).length;
  G.txt(this.kb||G.HFQ.input&&G.HFQ.input.cur()!=='touch'?'ARROWS: NEXT PART • ESC: BACK':'TAP ANY PART',K.x+12,K.y+K.h-12,5,C.accentText,'left',K.w*.6,800);
  G.txt(seenN+' OF '+o.items.length+' READ',K.x+K.w-12,K.y+K.h-12,5,seenN===o.items.length?C.good:C.dim,'right',undefined,800);
  G.drawBtns(L.btns);
  G.topBar(o.t,{back:true,sub:o.sub});
 }
};
/* in the activity registry too (search, the Hub): one activity per close-up, launched the same way the station launches it */
const register=()=>{ if(!(H.REG&&H.REG.extra)||register.done) return; register.done=1; H.REG.extra.push(()=>H.INSPECT.map(o=>{ const st=(()=>{ for(const k in G.WORLD.rooms) for(const s of G.WORLD.rooms[k].stations||[]) if(s.go&&s.go.scene==='inspect'&&s.go.args&&s.go.args.id===o.id) return {room:k,s}; return null; })();
 return {id:'inspect:'+o.id,kind:'tool',title:H.UI?H.UI.title(o.t):o.t,sub:o.sub,cat:'The Airfield',place:st?st.room:null,icon:'wrench',objective:'Learn what each part of '+o.t.toLowerCase()+' is for.',prereq:'None.',assess:'Quick check: 3 questions, 2 to pass. First pass +'+H.xp.inspect+' XP.',est:3,diff:1,
  words:o.items.map(i=>i.t).join(' ')+' tools maintenance fuel',avail:()=>({ok:true,why:''}),status:()=>{ const r=rec(o.id); return {done:!!r.passed,label:r.passed?'CHECKED':(Object.keys(r.seen).length?'STARTED':'NEW')}; },
  launch:back=>{ G.go('inspect',{id:o.id,back}); return true; }}; })); if(H.REG.invalidate) H.REG.invalidate(); };
if(H.REG) register(); else window.addEventListener('load',register);   // the registry loads after this file
})();
