/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* LIGHT GUN SIGNALS (the Tower): your radio has failed, so the tower talks to you with a light gun.
   Meanings from 14 CFR 91.125 (and the AIM, 4-3-13):
     signal                  on the ground                         in the air
     steady green            cleared for takeoff                   cleared to land
     flashing green          cleared to taxi                       return for landing (then a steady green)
     steady red              stop                                  give way to other aircraft and keep circling
     flashing red            taxi clear of the runway in use       airport unsafe: do not land
     flashing white          return to your starting point         (not used)
     alternating red+green   exercise extreme caution              exercise extreme caution */
(function(){
const H=G.HFQ, C=G.C, VW=G.VW, PI=Math.PI, MG=G.MG;
const SIG={
 sg:{n:'STEADY GREEN',col:['#3fdc7c'],flash:0,gnd:'CLEARED FOR TAKEOFF',air:'CLEARED TO LAND'},
 fg:{n:'FLASHING GREEN',col:['#3fdc7c'],flash:1,gnd:'CLEARED TO TAXI',air:'RETURN FOR LANDING'},
 sr:{n:'STEADY RED',col:['#ff3b30'],flash:0,gnd:'STOP',air:'GIVE WAY TO OTHER AIRCRAFT AND KEEP CIRCLING'},
 fr:{n:'FLASHING RED',col:['#ff3b30'],flash:1,gnd:'TAXI CLEAR OF THE RUNWAY IN USE',air:'AIRPORT UNSAFE: DO NOT LAND'},
 fw:{n:'FLASHING WHITE',col:['#f4f4f4'],flash:1,gnd:'RETURN TO YOUR STARTING POINT',air:null},
 rg:{n:'ALTERNATING RED + GREEN',col:['#ff3b30','#3fdc7c'],flash:2,gnd:'EXERCISE EXTREME CAUTION',air:'EXERCISE EXTREME CAUTION'}
};
const KEYS=Object.keys(SIG);
function lampCol(s,t){ if(s.flash===2) return s.col[Math.floor(t*2.2)%2]; if(s.flash===1) return (t*2.4)%1<.55?s.col[0]:null; return s.col[0]; }
G.scenes.g_lightgun={
 enter(a){ MG.start(this,'lightgun',a); this.N=12; this.n=0; this.score=0; this.streak=0; this.right=0;
  const q=[]; KEYS.forEach(k=>q.push({k,ctx:'gnd'})); KEYS.filter(k=>SIG[k].air).forEach(k=>q.push({k,ctx:'air'})); this.qs=G.shuffle(q).concat(G.shuffle(q)).slice(0,this.N);
  this.help=!H.gameRec('lightgun'); if(this.help) this.tipT=0; this.start(); if(AUDIO.curName!=='tower') AUDIO.play('tower'); },
 start(){ this.q=this.qs[this.n]; const ctx=this.q.ctx, ok=SIG[this.q.k][ctx];
  const pool=G.shuffle(KEYS.filter(k=>SIG[k][ctx]&&SIG[k][ctx]!==ok).map(k=>SIG[k][ctx]));
  if(ctx==='air'&&Math.random()<.5) pool.unshift(SIG[this.q.k].gnd);   // the classic mix-up: the ground meaning in the air
  this.opts=G.shuffle([ok].concat([...new Set(pool)].filter(x=>x!==ok).slice(0,3))); this.ok=ok; this.clock=0; this.fb=null; AUDIO.sfx('lamp'); },
 btns(){ const VH=G.VH, y0=VH-200; const size=H.fitSize(this.opts,VW-44,7.2,6); return this.opts.map((t,i)=>({id:'o:'+i,label:t,x:12,y:y0+i*46,w:VW-24,h:40,size,kind:this.fb?(t===this.ok?'success':(this.fb.pick===i?'danger':'secondary')):'secondary'})); },
 update(dt){
  if(MG.update(this,dt)) return;
  if(this.help){ if(G.ptr.click||G.pressed.a){ G.ptr.click=false; this.help=false; this.tipT=2.4; AUDIO.sfx('ok'); } return; }
  const hb={x:VW-50,y:48,w:42,h:20}; if(!this.fb&&G.clicked(hb.x,hb.y,hb.w,hb.h)){ this.help=true; return; }
  if(this.fb){ this.fb.t+=dt; if(this.fb.t>.6&&(G.ptr.click||G.pressed.a)){ G.ptr.click=false; this.n++; if(this.n>=this.N) return this.finish(); this.start(); } return; }
  this.clock+=dt;
  for(const b of this.btns()) if(G.clicked(b.x,b.y,b.w,b.h)){ const i=+b.id.slice(2), ok=this.opts[i]===this.ok; let pts=0;
   if(ok){ pts=60+Math.max(0,Math.round(40-this.clock*4)); this.streak++; if(this.streak>=3) pts+=10; this.right++; AUDIO.sfx(this.streak>=3?'bigpoint':'point'); } else { this.streak=0; AUDIO.sfx('thud'); }
   this.score+=pts; this.fb={ok,pick:i,pts,t:0}; return; }
 },
 finish(){ MG.end(this,this.score,{head:this.right>=11?'LIGHT GUN PRO':(this.right>=8?'SIGNALS RECEIVED':'KEEP YOUR EYES ON THE TOWER'),line:'You read '+this.right+' of '+this.N+' signals. Same colors, different meanings on the ground and in the air!'}); },
 draw(c){
  const VH=G.VH, q=this.q, s=SIG[q.k], t=this.t, air=q.ctx==='air';
  const y0=72, h=Math.min(190,VH-300);
  // the scene: the tower on the left, you on the right
  c.save(); G.rrect(10,y0,VW-20,h,12); c.clip();
  H.sky(c,10,y0,VW-20,h,{mode:'dusk',sun:[.88,.5],t,flare:false}); H.clouds(c,10,y0,VW-20,h*.5,{t,n:3,seed:4,speed:3,alpha:.6});
  const gy=y0+h-28; const gg=c.createLinearGradient(0,gy,0,gy+28); gg.addColorStop(0,'#4f7a3e'); gg.addColorStop(1,'#2f4f28'); c.fillStyle=gg; c.fillRect(10,gy,VW-20,28); c.fillStyle='#45484e'; c.fillRect(10,gy+8,VW-20,12); c.fillStyle='#ffc21a'; c.fillRect(10,gy+13.5,VW-20,1);
  const tx=46; c.fillStyle='#cfd4dc'; c.fillRect(tx-6,gy-70,12,70); c.fillStyle='#2a3a4a'; c.fillRect(tx-16,gy-90,32,20); c.fillStyle='#8fd0ff'; c.fillRect(tx-13,gy-87,26,12); c.fillStyle='#cfd4dc'; c.fillRect(tx-18,gy-94,36,5);
  const px=VW-80, py=air?y0+h*.32:gy+6, col=lampCol(s,t);
  if(col){ c.save(); c.globalAlpha=.28; c.fillStyle=col; c.beginPath(); c.moveTo(tx+12,gy-82); c.lineTo(px-24,py-20); c.lineTo(px-24,py+16); c.lineTo(tx+12,gy-76); c.closePath(); c.fill(); c.restore();
   c.save(); c.shadowColor=col; c.shadowBlur=14; c.fillStyle=col; c.beginPath(); c.arc(tx+12,gy-80,4.5,0,7); c.fill(); c.restore(); }
  const a=H.myAC?H.myAC():{id:'c172'}; H.drawAC(c,a.id,px-40,py-30,80,40,a.paint,{ground:false,prop:'spin',t,fly:air});
  c.restore(); c.strokeStyle=G.rgba(C.accent,.4); c.lineWidth=1; G.rrect(10,y0,VW-20,h,12); c.stroke();
  G.txt('SIGNAL '+Math.min(this.N,this.n+1)+' OF '+this.N,12,52,6,C.ink,'left',undefined,800);
  const hb={x:VW-50,y:48,w:42,h:20}; G.rrect(hb.x,hb.y,hb.w,hb.h,8); c.fillStyle='rgba(11,11,12,.7)'; c.fill(); c.strokeStyle=G.rgba(C.accent,.6); c.lineWidth=1; c.stroke(); G.txt('CHART',hb.x+hb.w/2,hb.y+6,5.4,C.accentText,'center',undefined,800);
  G.rrect(18,y0+8,86,18,9); c.fillStyle='rgba(11,11,12,.75)'; c.fill(); G.txt(air?'IN THE AIR':'ON THE GROUND',61,y0+13,6,air?C.info:C.good,'center',undefined,800);
  G.txt(this.fb?s.n:'WHAT DOES IT MEAN?',VW/2,y0+h+10,8,C.title,'center',VW-30,800);
  G.drawBtns(this.btns());
  if(this.fb){ G.txt(this.fb.ok?'ROGER! +'+this.fb.pts:(s.n+' '+(air?'IN THE AIR':'ON THE GROUND')+' = '+this.ok),VW/2,y0+h+26,this.fb.ok?7:5.6,this.fb.ok?C.good:C.warn,'center',VW-24,800);
   if(this.fb.t>.6&&!this.over) G.txt('TAP TO CONTINUE',VW/2,VH-14,5.4,C.accentText,'center',undefined,800); }
  if(this.help) drawChart(c,t);
  MG.hud(this,c,this.score+' PTS',{sub:'NO RADIO? WATCH THE TOWER',tip:'Your radio failed! Read the tower’s light. Check: are you on the ground or in the air?'});
 }
};
function drawChart(c,t){ const VH=G.VH; G.dim(.82); const y0=50; G.panel(8,y0,VW-16,VH-y0-12,{r:14,border:G.rgba(C.accent,.6)});
 G.txt('LIGHT GUN SIGNALS',VW/2,y0+12,9,C.title,'center',undefined,800);
 G.txt('SIGNAL',20,y0+30,5,C.dim,'left',undefined,800); G.txt('ON THE GROUND',108,y0+30,5,C.good,'left',undefined,800); G.txt('IN THE AIR',190,y0+30,5,C.info,'left',undefined,800);
 const rh=Math.min(54,(VH-y0-100)/6); let y=y0+42;
 for(const k of KEYS){ const s=SIG[k], col=lampCol(s,t); c.beginPath(); c.arc(26,y+10,6,0,7); c.fillStyle=col||'#2a2d33'; c.fill(); c.strokeStyle='rgba(255,255,255,.3)'; c.lineWidth=1; c.stroke();
  G.para(s.n,36,y+2,5.2,C.ink,'left',66,7,800); G.para(s.gnd,108,y+2,5.2,C.ink,'left',78,7,700); G.para(s.air||'—',190,y+2,5.2,C.ink,'left',VW-206,7,700); y+=rh; }
 G.txt('TAP TO START',VW/2,VH-28,6.4,C.accentText,'center',undefined,800); }
})();
