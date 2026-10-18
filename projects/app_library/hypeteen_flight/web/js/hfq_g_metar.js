/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* METAR DECODER (the Tower): crack the code of a METAR, the hourly weather report pilots read before every flight.
   10 questions on freshly made reports (hfq_radio.js H.wx). Some ask you to TAP a piece of the report, some to
   pick what it means. The DECODER card (first play, or the ? button) explains every piece. */
(function(){
const H=G.HFQ, C=G.C, VW=G.VW, MG=G.MG, WX=()=>H.wx;
const KN={station:'THE AIRPORT',time:'THE TIME',wind:'THE WIND',vis:'THE VISIBILITY',temp:'THE TEMPERATURE + DEW POINT',alt:'THE ALTIMETER SETTING'};
const pad=(n,k)=>String(Math.abs(Math.round(n))).padStart(k,'0');
function shuffleUnique(ok,bad){ const out=[ok]; for(const b of bad) if(!out.includes(b)) out.push(b); return G.shuffle(out.slice(0,4)); }
function makeQ(r,k){
 const w=WX().make(r), P=WX().parts(w), ceil=WX().ceiling(w);
 const kinds=['tap:wind','tap:vis','tap:alt','tap:temp','tap:sky','mc:wdir','mc:wspd','mc:vis','mc:ceil','mc:temp','mc:alt','mc:wx','tap:time'];
 let kind=kinds[k%kinds.length]; if(kind==='mc:wx'&&!w.wx) kind='mc:ceil'; if(kind==='tap:sky'&&ceil==null) kind='mc:ceil'; if((kind==='mc:wdir'||kind==='mc:wspd')&&w.wspd===0) kind='tap:wind';
 const q={w,P,kind};
 if(kind.indexOf('tap:')===0){ const want=kind.slice(4);
  if(want==='sky'){ q.text='TAP THE CEILING (THE LOWEST BROKEN OR OVERCAST LAYER)'; q.ans=P.findIndex(p=>p.k==='sky'&&p.l&&(p.l.c==='BKN'||p.l.c==='OVC')); }
  else { q.text='TAP '+KN[want]; q.ans=P.findIndex(p=>p.k===want); }
  q.explain=WX().explain(P[q.ans],w); return q; }
 const ip=P.findIndex(p=>p.k===({wdir:'wind',wspd:'wind',vis:'vis',ceil:'sky',temp:'temp',alt:'alt',wx:'wx'})[kind.slice(3)]);
 q.hl=ip;
 switch(kind){
  case 'mc:wdir': { const d=pad(w.wdir,3); q.text='WHICH WAY IS THE WIND BLOWING FROM?'; q.ok='FROM '+d+'°'; q.opts=shuffleUnique(q.ok,['FROM '+pad((w.wdir+180)%360||360,3)+'°','FROM '+pad(w.wspd*10%360||90,3)+'°','FROM '+pad((w.wdir+90)%360||360,3)+'°']); break; }
  case 'mc:wspd': q.text='HOW STRONG IS THE WIND?'; q.ok=w.wspd+' KNOTS'+(w.gust?', GUSTS '+w.gust:''); q.opts=shuffleUnique(q.ok,[(w.wspd*10)+' KNOTS',pad(w.wdir,3)+' KNOTS',(w.wspd+5)+' KNOTS',w.gust?w.gust+' KNOTS, GUSTS '+w.wspd:(w.wspd+2)+' KNOTS']); break;
  case 'mc:vis': { const v=P[ip].t.replace('SM',''); q.text='HOW FAR CAN YOU SEE?'; q.ok=v+' STATUTE MILE'+(v==='1'?'':'S'); q.opts=shuffleUnique(q.ok,[(parseFloat(v)>=3?'1/2':'10')+' STATUTE MILES',v+' KILOMETERS',v+' NAUTICAL MILES']); break; }
  case 'mc:ceil': q.text='WHAT IS THE CEILING?'; q.ok=ceil==null?'NO CEILING':ceil.toLocaleString('en-US')+' FEET'; { const f=w.clouds[0]; q.opts=shuffleUnique(q.ok,[ceil==null?(f?f.h.toLocaleString('en-US')+' FEET':'12,000 FEET'):'NO CEILING',(ceil||3000)/100+' FEET',((ceil||2500)*10).toLocaleString('en-US')+' FEET']); } break;
  case 'mc:temp': q.text='WHAT IS THE TEMPERATURE?'; q.ok=w.temp+'°C'; q.opts=shuffleUnique(q.ok,[w.dew+'°C',(-w.temp||w.temp+5)+'°C',(w.temp+10)+'°C']); break;
  case 'mc:alt': { const a=String(w.alt); q.text='WHAT IS THE ALTIMETER SETTING?'; q.ok=a.slice(0,2)+'.'+a.slice(2); q.opts=shuffleUnique(q.ok,['29.92',a.slice(0,1)+'.'+a.slice(1),(w.alt-30)/100+'']); break; }
  case 'mc:wx': q.text='WHAT DOES '+w.wx+' MEAN?'; q.ok=({BR:'MIST',FG:'FOG','-RA':'LIGHT RAIN',RA:'RAIN',HZ:'HAZE','-SN':'LIGHT SNOW'})[w.wx]; q.opts=shuffleUnique(q.ok,['MIST','FOG','LIGHT RAIN','HAZE','RAIN','LIGHT SNOW'].filter(x=>x!==q.ok).slice(0,3)); break;
 }
 q.explain=WX().explain(P[ip],w); return q;
}
G.scenes.g_metar={
 enter(a){ MG.start(this,'metar',a); this.N=10; this.n=0; this.score=0; this.streak=0; this.right=0; const r=H.rng(Date.now()%100000+7); this.qs=[]; const ks=G.shuffle([0,1,2,3,4,5,6,7,8,9,10,11,12]); for(let i=0;i<this.N;i++) this.qs.push(makeQ(r,ks[i%ks.length]));
  this.help=!H.gameRec('metar'); if(this.help) this.tipT=0; this.start(); if(AUDIO.curName!=='tower') AUDIO.play('tower'); },
 start(){ this.q=this.qs[this.n]; this.clock=0; this.fb=null; },
 chips(){ const P=this.q.P, out=[]; let x=16, y=96; for(let i=0;i<P.length;i++){ const w=G.tw(P[i].t,8.4,800)+14; if(x+w>VW-16){ x=16; y+=30; } out.push({i,x,y,w,h:24}); x+=w+6; } return out; },
 btns(){ if(!this.q.opts) return []; const VH=G.VH, y0=VH-188; return this.q.opts.map((t,i)=>({id:'o:'+i,label:t,x:12,y:y0+i*42,w:VW-24,h:36,size:7.4,kind:this.fb?(t===this.q.ok?'success':(this.fb.pick===i?'danger':'secondary')):'secondary'})); },
 update(dt){
  if(MG.update(this,dt)) return;
  if(this.help){ if(G.ptr.click||G.pressed.a){ G.ptr.click=false; this.help=false; this.tipT=2.4; AUDIO.sfx('ok'); } return; }
  const hb={x:VW-50,y:48,w:42,h:20}; if(!this.fb&&G.clicked(hb.x,hb.y,hb.w,hb.h)){ this.help=true; return; }
  if(this.fb){ this.fb.t+=dt; if(this.fb.t>.6&&(G.ptr.click||G.pressed.a)){ G.ptr.click=false; this.n++; if(this.n>=this.N) return this.finish(); this.start(); } return; }
  this.clock+=dt;
  if(this.q.kind.indexOf('tap:')===0){ for(const ch of this.chips()) if(G.clicked(ch.x-2,ch.y-2,ch.w+4,ch.h+4)) return this.answer(ch.i===this.q.ans,ch.i); }
  else for(const b of this.btns()) if(G.clicked(b.x,b.y,b.w,b.h)) return this.answer(this.q.opts[+b.id.slice(2)]===this.q.ok,+b.id.slice(2));
 },
 answer(ok,pick){ let pts=0; if(ok){ pts=60+Math.max(0,Math.round(40-this.clock*3)); this.streak++; if(this.streak>=3) pts+=10; this.right++; AUDIO.sfx(this.streak>=3?'bigpoint':'point'); } else { this.streak=0; AUDIO.sfx('thud'); }
  this.score+=pts; this.fb={ok,pick,pts,t:0}; },
 finish(){ MG.end(this,this.score,{head:this.right>=9?'WEATHER WIZARD':(this.right>=6?'DECODED!':'KEEP DECODING'),line:'You got '+this.right+' of '+this.N+' right. Pilots read a METAR before every flight.'}); },
 draw(c){
  const VH=G.VH, q=this.q;
  c.fillStyle='#0f1318'; c.fillRect(0,42,VW,VH-42);
  G.txt('REPORT '+Math.min(this.N,this.n+1)+' OF '+this.N,12,52,6,C.ink,'left',undefined,800);
  const hb={x:VW-50,y:48,w:42,h:20}; G.rrect(hb.x,hb.y,hb.w,hb.h,8); c.fillStyle='rgba(11,11,12,.7)'; c.fill(); c.strokeStyle=G.rgba(C.accent,.6); c.lineWidth=1; c.stroke(); G.txt('CARD',hb.x+hb.w/2,hb.y+6,5.4,C.accentText,'center',undefined,800);
  // the teletype screen
  const ch=this.chips(), bot=ch[ch.length-1].y+34; G.rrect(8,72,VW-16,bot-72+4,12); c.fillStyle='#061209'; c.fill(); c.strokeStyle='rgba(63,220,124,.35)'; c.lineWidth=1; c.stroke();
  G.txt('METAR',16,78,5.4,'#3fdc7c','left',undefined,800);
  for(const k of ch){ const tap=q.kind.indexOf('tap:')===0, isAns=this.fb&&k.i===(tap?q.ans:q.hl), isPick=this.fb&&tap&&k.i===this.fb.pick&&!this.fb.ok;
   G.rrect(k.x,k.y,k.w,k.h,6); c.fillStyle=isAns?'rgba(63,220,124,.3)':(isPick?'rgba(255,74,61,.3)':(tap&&!this.fb?'rgba(63,220,124,.08)':'rgba(0,0,0,0)')); c.fill(); if(tap&&!this.fb){ c.strokeStyle='rgba(63,220,124,.35)'; c.lineWidth=1; c.stroke(); }
   G.txt(q.P[k.i].t,k.x+k.w/2,k.y+6,8.4,'#9fffc4','center',undefined,800); }
  // the question
  G.para(q.text,VW/2,bot+14,7.6,C.title,'center',VW-30,10,800);
  G.drawBtns(this.btns());
  if(this.fb){ const h=62, y=q.opts?VH-188-h-8:bot+44; G.rrect(12,y,VW-24,h,12); c.fillStyle=this.fb.ok?'rgba(18,61,38,.95)':'rgba(70,16,16,.95)'; c.fill(); c.strokeStyle=this.fb.ok?C.good:C.bad; c.lineWidth=1.2; c.stroke();
   G.txt(this.fb.ok?'DECODED! +'+this.fb.pts:'NOT QUITE',VW/2,y+8,8,'#fff','center',VW-40,800); G.para(q.explain,VW/2,y+24,6.4,C.ink,'center',VW-44,9,700);
   if(this.fb.t>.6&&!this.over) G.txt('TAP TO CONTINUE',VW/2,VH-24,5.6,C.accentText,'center',undefined,800); }
  if(this.help) drawCard(c);
  MG.hud(this,c,this.score+' PTS',{sub:'READ THE WEATHER REPORT',tip:'Tap the right piece of the report, or pick what it means.'});
 }
};
function drawCard(c){ const VH=G.VH; G.dim(.8); const y0=50; G.panel(10,y0,VW-20,VH-y0-12,{r:14,border:G.rgba(C.accent,.6)});
 G.txt('THE METAR DECODER CARD',VW/2,y0+12,8.6,C.title,'center',undefined,800);
 G.txt('KHFQ 131553Z 27010G18KT 10SM BKN025 24/12 A3002',VW/2,y0+28,6,'#9fffc4','center',VW-30,800);
 const R=[['KHFQ','The airport. K = United States.'],['131553Z','Day 13, 15:53 Zulu (UTC) time.'],['27010G18KT','Wind FROM 270° at 10 knots, gusts 18.'],['10SM','Visibility: 10 statute miles.'],['BR  FG  -RA','Mist, fog, light rain (- = light).'],['FEW  SCT','Few or scattered clouds: not a ceiling.'],['BKN025  OVC008','Broken 2,500 ft, overcast 800 ft: a CEILING.'],['24/12','Temperature 24°C, dew point 12°C.'],['A3002','Altimeter setting 30.02 inches.']];
 let y=y0+46; const rh=Math.min(30,(VH-y0-110)/R.length); for(const [k,d] of R){ G.txt(k,22,y,6.6,'#3fdc7c','left',92,800); G.para(d,118,y,5.8,C.ink,'left',VW-136,7.6,700); y+=rh; }
 G.para('Cloud heights are in HUNDREDS of feet: 025 = 2,500.',VW/2,y+4,6,C.accentHi,'center',VW-40,8,800);
 G.txt('TAP TO START',VW/2,VH-30,6.4,C.accentText,'center',undefined,800); }
})();
