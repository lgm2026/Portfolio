/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* TAXI MAZE (the Tower's ground control console, the Runway sign): follow your taxi clearance by the airport signs,
   then stop before the hold-short line. Three clearances, each with real phraseology:
     1  "RUNWAY 27, TAXI VIA ALPHA, HOLD SHORT OF RUNWAY 27"            (parking stand -> Alpha 4)
     2  "RUNWAY 9, TAXI VIA ALPHA, HOLD SHORT OF RUNWAY 9"              (parking stand -> Alpha 1)
     3  "RUNWAY 9, TAXI VIA BRAVO, ALPHA, HOLD SHORT OF RUNWAY 9"       (hangar -> Alpha 1)
   FAA markings + signs (AC 150/5340-1, -18): yellow taxiway centerlines; the holding position marking has its two
   solid lines on the holding side; location signs are yellow on black; direction signs black on yellow with arrows;
   the runway holding position sign is white on red and lists the runway end on your LEFT first (here: 27-9).
   At each junction the airplane stops: tap the way to go. Near the runway, HOLD THE BRAKES to stop short. */
(function(){
const H=G.HFQ, C=G.C, VW=G.VW, PI=Math.PI, MG=G.MG;
const HOLD=234, RWY0=246, RWY1=262;
const N={ramp:[120,150],rx:[120,190],a1:[18,190],a2:[70,190],a3:[164,190],bj:[200,190],a4:[226,190],hang:[200,124],
 r1:[18,RWY0],r2:[70,RWY0],r3:[164,RWY0],r4:[226,RWY0]};
const E=[['ramp','rx','P'],['a1','a2','A'],['a2','rx','A'],['rx','a3','A'],['a3','bj','A'],['bj','a4','A'],['a1','r1','A1'],['a2','r2','A2'],['a3','r3','A3'],['a4','r4','A4'],['hang','bj','B']];
const ADJ={}; for(const [a,b,n] of E){ (ADJ[a]=ADJ[a]||[]).push({to:b,n}); (ADJ[b]=ADJ[b]||[]).push({to:a,n}); }
const LEVELS=[
 {rwy:'27',route:['ramp','rx','a3','bj','a4','r4'],via:'ALPHA',from:'THE PARKING STAND'},
 {rwy:'9',route:['ramp','rx','a2','a1','r1'],via:'ALPHA',from:'THE PARKING STAND'},
 {rwy:'9',route:['hang','bj','a3','rx','a2','a1','r1'],via:'BRAVO, ALPHA',from:'THE HANGAR'}
];
function turnName(hx,hy,dx,dy){ const cr=hx*dy-hy*dx, dot=hx*dx+hy*dy; if(dot>.7) return 'STRAIGHT'; return cr>0?'RIGHT':'LEFT'; }   // screen coords: y down, so a positive cross product is a right turn
const ARROW={LEFT:'◀',RIGHT:'▶',STRAIGHT:'▲'};
function drawField(c,lv){
 c.fillStyle='#5f8f47'; c.fillRect(-40,-40,320,380);
 c.fillStyle='#3d4046'; c.fillRect(6,RWY0,234,RWY1-RWY0); c.fillStyle='#f2f2f2'; for(let x=40;x<210;x+=16) c.fillRect(x,(RWY0+RWY1)/2-.6,8,1.2);
 for(let y=RWY0+2;y<RWY1-1;y+=2.4){ c.fillRect(9,y,8,1.2); c.fillRect(229,y,8,1.2); }
 c.save(); c.translate(22,(RWY0+RWY1)/2); c.rotate(PI/2); G.txt('9',0,-3.6,6.4,'#f2f2f2','center',undefined,800); c.restore();
 c.save(); c.translate(222,(RWY0+RWY1)/2); c.rotate(-PI/2); G.txt('27',0,-3.6,6.4,'#f2f2f2','center',undefined,800); c.restore();
 // ramp + hangar
 c.fillStyle='#7c8087'; c.fillRect(70,128,106,56); c.fillStyle='#8d9aaa'; c.fillRect(176,92,48,30); c.fillStyle='#7c8087'; c.fillRect(184,122,32,12);
 G.txt('PARKING STAND',123,132,4.4,'#fff','center',undefined,800); G.txt('HANGAR',200,100,4.4,'#fff','center',undefined,800);
 // taxiways
 c.strokeStyle='#55585e'; c.lineWidth=9; c.lineCap='butt'; for(const [a,b] of E){ const p=N[a], q=N[b]; c.beginPath(); c.moveTo(p[0],p[1]); c.lineTo(q[0],q[1]); c.stroke(); }
 c.strokeStyle='#ffc21a'; c.lineWidth=.9; for(const [a,b] of E){ const p=N[a], q=N[b]; c.beginPath(); c.moveTo(p[0],p[1]); c.lineTo(q[0],q[1]); c.stroke(); }
 c.fillStyle='#3d7bff'; for(let x=10;x<236;x+=10){ c.beginPath(); c.arc(x,184.5,.7,0,7); c.arc(x,195.5,.7,0,7); c.fill(); }
 // hold-short markings on every connector (solid on the taxiway side) + the red runway sign
 for(const k of ['a1','a2','a3','a4']){ const x=N[k][0]; c.fillStyle='#ffc21a'; c.fillRect(x-4.5,HOLD-3,9,.8); c.fillRect(x-4.5,HOLD-1.4,9,.8); for(let xx=x-4.5;xx<x+4.5;xx+=2.2){ c.fillRect(xx,HOLD+.6,1.2,.8); c.fillRect(xx,HOLD+2.2,1.2,.8); }
  c.fillStyle='#c8102e'; c.fillRect(x+6,HOLD-6,14,6); G.txt('27-9',x+13,HOLD-5.4,3.4,'#fff','center',undefined,800); }
 // location signs (yellow on black) on each taxiway segment
 const loc=(x,y,t)=>{ c.fillStyle='#111'; c.fillRect(x,y,9,6); c.strokeStyle='#ffc21a'; c.lineWidth=.5; c.strokeRect(x+.3,y+.3,8.4,5.4); G.txt(t,x+4.5,y+.8,3.6,'#ffc21a','center',undefined,800); };
 loc(40,176,'A'); loc(140,176,'A'); loc(206,152,'B'); loc(10,214,'A1'); loc(60,214,'A2'); loc(154,214,'A3'); loc(214,214,'A4'); loc(108,166,'P');
}
function dirSign(c,x,y,items){ let xx=x; for(const it of items){ const t=(it.dir==='LEFT'?'← ':(it.dir==='STRAIGHT'?'↑ ':''))+it.n+(it.dir==='RIGHT'?' →':''), w=G.tw(t,3.6,800)+4; c.fillStyle='#ffc21a'; c.fillRect(xx,y,w,6); G.txt(t,xx+w/2,y+.8,3.6,'#111','center',undefined,800); xx+=w+1; } }
G.scenes.g_taxi={
 enter(a){ MG.start(this,'taxi',a); this.L=0; this.score=0; this.turnsOK=0; this.wrong=0; this.incursions=0; this.startLevel(); if(AUDIO.curName!=='tower') AUDIO.play('tower'); },
 exit(){ H.sayStop(); },
 startLevel(){ const lv=this.lv=LEVELS[this.L]; this.ri=0; this.at=lv.route[0]; this.to=lv.route[1]; this.k=0; this.v=0; this.state='clear'; this.clock=0; this.fb=null; this.stopD=null;
  const p=N[this.at], q=N[this.to]; this.hx=q[0]-p[0]; this.hy=q[1]-p[1]; const d=Math.hypot(this.hx,this.hy); this.hx/=d; this.hy/=d;
  const {rt,D,cs}=H.R; this.clr=rt(cs(),', '+H.FIELD.call+' GROUND, RUNWAY ',D(lv.rwy),', TAXI VIA ',lv.via,', HOLD SHORT OF RUNWAY ',D(lv.rwy),'.'); H.sayStop(); H.say(this.clr,'atc'); this.tipT=0; },
 pos(){ const p=N[this.at], q=N[this.to]; return [p[0]+(q[0]-p[0])*this.k,p[1]+(q[1]-p[1])*this.k]; },
 exits(){ const prev=this.at; return (ADJ[this.to]||[]).filter(e=>e.to!==prev).map(e=>{ const p=N[this.to], q=N[e.to]; let dx=q[0]-p[0], dy=q[1]-p[1]; const d=Math.hypot(dx,dy); dx/=d; dy/=d; return Object.assign({dir:turnName(this.hx,this.hy,dx,dy),dx,dy},e); }); },
 choiceBtns(){ if(this.state!=='choose') return []; const ex=this.exits(), VH=G.VH, w=(VW-24-(ex.length-1)*6)/ex.length;
  return ex.sort((a,b)=>['LEFT','STRAIGHT','RIGHT'].indexOf(a.dir)-['LEFT','STRAIGHT','RIGHT'].indexOf(b.dir)).map((e,i)=>({id:e.to,label:(e.dir==='RIGHT'?'':ARROW[e.dir]+' ')+e.dir+' ON '+e.n+(e.dir==='RIGHT'?' '+ARROW.RIGHT:''),x:12+i*(w+6),y:VH-60,w,h:48,size:7,kind:'secondary',e})); },
 brakeBtn(){ return {x:12,y:G.VH-64,w:VW-24,h:54}; },
 onConnector(){ return this.to[0]==='r'; },
 update(dt){
  if(MG.update(this,dt)) return;
  if(this.state==='clear'){ this.clock+=dt; if(this.clock>1.2&&(G.ptr.click||G.pressed.a)){ G.ptr.click=false; this.state='roll'; this.clock=0; AUDIO.sfx('engine'); } return; }
  if(this.fb){ this.fb.t-=dt; if(this.fb.t<=0) this.fb=null; }
  if(this.state==='done'){ this.clock+=dt; if(this.clock>2.2&&(G.ptr.click||G.pressed.a)){ G.ptr.click=false; this.L++; if(this.L>=LEVELS.length) return this.finish(); this.startLevel(); } return; }
  if(this.state==='choose'){ for(const b of this.choiceBtns()) if(G.clicked(b.x,b.y,b.w,b.h)) return this.choose(b); return; }
  this.clock+=dt;
  // rolling: accelerate to taxi speed (slower on the connector to the runway), brake near the runway
  const conn=this.onConnector(), vmax=conn?17:30, B=this.brakeBtn(), braking=conn&&G.ptr.down&&G.ptr.x>=B.x&&G.ptr.x<=B.x+B.w&&G.ptr.y>=B.y&&G.ptr.y<=B.y+B.h;
  if(braking){ this.v=Math.max(0,this.v-60*dt); if(!this._sq){ this._sq=1; AUDIO.sfx('brake'); } } else { this._sq=0; this.v=Math.min(vmax,this.v+(this.v>vmax?-40:24)*dt); }
  const p=N[this.at], q=N[this.to], len=Math.hypot(q[0]-p[0],q[1]-p[1]); this.k+=this.v*dt/len;
  if(conn){ const y=this.pos()[1];
   if(y>=HOLD){ this.incursions++; this.v=0; this.stopD=-1; this.state='done'; this.clock=0; AUDIO.sfx('buzzer'); G.shake=3; this.fb={t:3,ok:false,msg:'RUNWAY INCURSION! YOU CROSSED THE HOLD-SHORT LINE.'}; const {rt,cs}=H.R; H.say(rt(cs(),', HOLD POSITION. YOU CROSSED THE HOLD SHORT LINE.'),'atc'); return; }
   if(this.v<=0&&this.k>.05){ const d=HOLD-y; this.stopD=d; const pts=d<=5?200:(d<=12?130:70); this.score+=pts; this.score+=Math.max(0,Math.round((40-this.clock)*2));
    this.state='done'; this.clock=0; AUDIO.sfx('chime2'); this.fb={t:3,ok:true,msg:d<=5?'PERFECT STOP! +'+pts:(d<=12?'NICE STOP +'+pts:'STOPPED A LITTLE EARLY +'+pts)};
    const {rt,D,cs}=H.R, w=H.wx.today(); H.say(rt(cs(),', '+H.FIELD.call+' TOWER, RUNWAY ',D(this.lv.rwy),', CLEARED FOR TAKEOFF.'),'atc'); return; } }
  if(this.k>=1){ this.k=1; this.arrive(); }
 },
 arrive(){ this.ri++; const ex=this.exits(); if(ex.length===1){ this.take(ex[0]); return; } this.state='choose'; this.v=0; AUDIO.sfx('brake'); },
 take(e){ this.at=this.to; this.to=e.to; this.k=0; this.hx=e.dx; this.hy=e.dy; this.state='roll'; },
 choose(b){ const want=this.lv.route[this.ri+1];
  if(b.id===want){ this.turnsOK++; this.score+=100; AUDIO.sfx('point'); this.take(b.e); }
  else { this.wrong++; this.score=Math.max(0,this.score-50); AUDIO.sfx('thud'); const nm=(ADJ[this.to].find(e=>e.to===want)||{}).n;
   this.fb={t:2.4,ok:false,msg:'NOT THAT WAY: YOUR CLEARANCE SAYS '+this.lv.via+'. LOOK FOR '+(nm||'THE SIGN')+'.'}; const {rt,cs}=H.R; H.sayStop(); H.say(rt(cs(),', GROUND, CHECK YOUR TAXI ROUTE. VIA ',this.lv.via,'.'),'atc'); }
 },
 finish(){ MG.end(this,this.score,{head:this.incursions?'WATCH THOSE HOLD LINES':(this.wrong?'MADE IT TO THE RUNWAY':'PERFECT TAXI'),line:this.turnsOK+' right turns, '+this.wrong+' wrong, '+this.incursions+' runway incursion'+(this.incursions===1?'':'s')+'. Always stop at a hold-short line until you’re cleared.'}); },
 draw(c){
  const VH=G.VH, [px,py]=this.pos(), Z=2.3, top=96, bot=VH-74, vh=(bot-top)/Z, vw=VW/Z;
  c.fillStyle='#10151b'; c.fillRect(0,42,VW,VH-42);
  // the map, following your airplane
  const cx=Math.max(vw/2-10,Math.min(250-vw/2,px)), cy=Math.max(vh/2+60,Math.min(290-vh/2,py+vh*.1));
  c.save(); c.beginPath(); c.rect(0,top,VW,bot-top); c.clip(); c.translate(VW/2,top+(bot-top)/2); c.scale(Z,Z); c.translate(-cx,-cy);
  drawField(c,this.lv);
  // direction signs at the junction ahead
  if(this.state==='choose'){ const n=N[this.to]; dirSign(c,n[0]+6,n[1]-16,this.exits()); }
  // the route ahead? no: you read the signs. Your airplane:
  c.save(); c.translate(px,py); c.rotate(Math.atan2(this.hy,this.hx)+PI/2); c.scale(.085,.085); c.translate(-120,-4); if(G.FIG.has('planeTop')) G.FIG.draw(c,'planeTop',0,0,240,120); c.restore();
  c.restore();
  c.strokeStyle=G.rgba(C.accent,.35); c.lineWidth=1; c.strokeRect(0,top,VW,bot-top);
  // the clearance
  G.rrect(8,48,VW-16,44,10); c.fillStyle=G.rgba(C.accent,.1); c.fill(); c.strokeStyle=G.rgba(C.accent,.5); c.stroke();
  G.icon('headset',c,22,70,12,C.accentText); G.txt('GROUND • CLEARANCE '+Math.min(LEVELS.length,this.L+1)+' OF '+LEVELS.length,36,52,4.8,C.accentText,'left',undefined,800); G.para(this.clr.t,36,62,6.2,C.ink,'left',VW-52,8.4,800);
  // controls
  if(this.state==='clear'){ G.rrect(20,VH-66,VW-40,56,12); c.fillStyle='rgba(11,11,12,.85)'; c.fill(); G.para('Read your clearance. Then tap to start taxiing. At each junction, pick the way the signs and your clearance say.',VW/2,VH-60,6.2,C.ink,'center',VW-56,8.6,700); }
  G.drawBtns(this.choiceBtns());
  if(this.state==='roll'&&this.onConnector()){ const B=this.brakeBtn(), on=G.ptr.down&&G.held(B.x,B.y,B.w,B.h); G.rrect(B.x,B.y,B.w,B.h,14); c.fillStyle=on?'#a00c22':'#c8102e'; c.fill(); c.strokeStyle='#fff'; c.lineWidth=1.4; c.stroke();
   G.txt('HOLD FOR BRAKES',VW/2,B.y+12,10,'#fff','center',undefined,800); G.txt('STOP BEFORE THE YELLOW HOLD-SHORT LINE',VW/2,B.y+32,5.6,'#ffd6d6','center',undefined,800); }
  else if(this.state==='roll'){ G.txt('TAXIING… WATCH FOR THE NEXT JUNCTION',VW/2,VH-40,6,C.dim,'center',undefined,800); }
  if(this.state==='done'&&this.clock>2.2) G.txt(this.L<LEVELS.length-1?'TAP FOR THE NEXT CLEARANCE':'TAP TO FINISH',VW/2,VH-40,6.4,C.accentText,'center',undefined,800);
  if(this.fb){ const h=34, y=top+8; G.rrect(14,y,VW-28,h,10); c.fillStyle=this.fb.ok?'rgba(18,61,38,.95)':'rgba(70,16,16,.95)'; c.fill(); c.strokeStyle=this.fb.ok?C.good:C.bad; c.lineWidth=1.2; c.stroke(); G.para(this.fb.msg,VW/2,y+6,6.4,'#fff','center',VW-44,9,800); }
  MG.hud(this,c,this.score+' PTS',{sub:'FOLLOW THE SIGNS'});
 }
};
})();
