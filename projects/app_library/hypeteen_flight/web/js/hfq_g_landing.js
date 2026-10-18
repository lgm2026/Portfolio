/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* LANDING CHALLENGE (the Runway): three approaches in your own aircraft.
   Hold the screen for power, let go to come down. Stay on the 3° glide path using the PAPI lights
   (2 white + 2 red = on path, AIM 2-1-2), flare near the ground, and touch down softly near the aiming point.
   Hold the flare too long and the airspeed bleeds off: the stall horn sounds.
   r7.4 LEARN FOR A RETRY: after the third landing, a quick lesson (PAPI, the flare, the go-around...) and one question can
   earn one more approach, flown in the same wind as the lowest-scoring one. It replaces that one only if it scores more. */
(function(){
const H=G.HFQ, C=G.C, VW=G.VW, PI=Math.PI, MG=G.MG;
const TAN3=Math.tan(3*PI/180), START=-2000, AIM=1000, RWY_END=4200;
const ROUNDS=[{name:'CALM WIND',hw:0,gust:0},{name:'10-KNOT HEADWIND',hw:10,gust:0},{name:'GUSTY WIND',hw:6,gust:1}];
function papi(alt,x){ const d=Math.max(1,AIM-x), a=Math.atan2(alt,d)*180/PI; return a>3.5?4:a>3.17?3:a>2.83?2:a>2.5?1:0; }   // how many WHITE lights

G.scenes.g_landing={
 enter(a){ MG.start(this,'landing',a); this.round=0; this.total=0; this.results=[]; this.flags={}; this.redo=null; this.newApproach(); },
 newApproach(){ const R=ROUNDS[this.redo?this.redo.i:this.round];
  this.x=START; this.alt=(AIM-START)*TAN3+20; this.vs=-340; this.pw=.6; this.ias=65; this.state='ready'; this.st=0; this.msg=null; this.gust=0; this.stallT=0; this.horn=0; this.wind=R; this.roll=0;
  AUDIO.sfx('radio'); this.call=G.who()+', RUNWAY 27, CLEARED TO LAND. WIND '+(R.hw?'270 AT '+R.hw:'CALM')+'.';
  if(H.say&&H.R){ const Q=H.R; H.sayStop(); H.say(Q.rt(Q.cs(),', RUNWAY ',Q.D('27'),', CLEARED TO LAND. ',R.hw?Q.rt('WIND ',Q.D('270'),' AT ',Q.D(R.hw)):'WIND CALM','.'),'atc'); } },
 exit(){ if(H.sayStop) H.sayStop(); },
 update(dt){
  if(MG.update(this,dt)) return;
  const sim=Math.min(dt,.05);
  if(this.state==='ready'){ if(G.ptr.down&&G.ptr.y>44){ this.state='fly'; this.tipT=0; } return; }
  if(this.state==='fly'){
   const hold=G.ptr.down&&G.ptr.y>44;
   this.pw+=(hold?1:-1)*sim*.75; this.pw=Math.max(0,Math.min(1,this.pw));
   const gs=(this.ias-this.wind.hw)*1.688;                  // ground speed, ft/s
   // flare zone: holding near the ground trades speed for a gentler descent
   const low=this.alt<18;
   if(low&&hold) this.ias-=sim*5; else if(!low) this.ias+=(65-this.ias)*sim*.8;
   let target=-1300+this.pw*1600;                         // feet per minute
   if(low&&hold) target=Math.max(target,-150);
   if(this.ias<52){ this.horn+=sim; if(this.horn>.5){ AUDIO.sfx('stall'); this.horn=0; } }
   if(this.ias<46){ target=-900; this.msg='STALL! LOWER THE NOSE'; this.flags.stall=1; }
   if(this.wind.gust){ this.gust+=(Math.random()-.5)*sim*900; this.gust*=Math.pow(.2,sim); }
   this.vs+=(target-this.vs)*Math.min(1,sim*1.6); this.vs+=this.gust*sim*3;
   this.x+=gs*sim*1.7; this.alt+=this.vs/60*sim*1.7;
   if(this.alt>600) this.alt=600;
   if(this.alt<=0){ this.touchdown(); }
   else if(this.x>AIM+1800){ this.alt=Math.max(this.alt,0); this.flags.long=1; this.finish(10,'GO-AROUND: TOO LONG','You floated past the touchdown zone. Real pilots go around and try again.'); }
  } else if(this.state==='roll'){
   this.roll+=sim; this.x+=Math.max(0,(this.ias-this.roll*20))*1.688*sim*1.7*.5;
   if(this.roll>2.2){ if(this.redo) return this.done(); this.round++; if(this.round>=ROUNDS.length) this.offer(); else this.newApproach(); }
  }
 },
 touchdown(){
  this.alt=0; const vs=-this.vs, x=this.x;
  let pts, head, line;
  if(x<0){ pts=5; head='LANDED SHORT'; this.flags.short=1; line='You touched down before the runway. Stay on the PAPI: two white, two red.'; AUDIO.sfx('thud'); }
  else { const soft=vs<=150?60:vs<=350?45:vs<=600?25:5, zone=Math.abs(x-AIM)<500?40:Math.abs(x-AIM)<1000?25:10, stall=this.ias<46?-20:0;
   pts=Math.max(5,soft+zone+stall); head=vs<=150?'GREASED IT!':vs<=350?'SMOOTH LANDING':vs<=600?'FIRM LANDING':'HARD LANDING';
   line=Math.round(vs)+' FPM DOWN • '+Math.round(x)+' FT PAST THE THRESHOLD'; AUDIO.sfx(vs>600?'thud':'chirp'); if(vs>600){ G.shake=4; this.flags.hard=1; } if(Math.abs(x-AIM)>=1000) this.flags.long=1; }
  this.finish(pts,head,line);
 },
 finish(pts,head,line){ const R=this.redo;
  if(R){ R.pts=pts; if(pts>this.results[R.i]){ R.better=1; this.results[R.i]=pts; } }   // the bonus approach only ever replaces the lowest one
  else this.results.push(pts);
  this.total=this.results.reduce((a,b)=>a+b,0); this.msg=null; this.res={pts,head,line}; this.state='roll'; this.roll=0; },
 /* three landings in: offer the learn-for-a-retry (once per game; not when every landing was already perfect), else the results */
 offer(){ const lo=Math.min(...this.results), i=this.results.indexOf(lo), F=this.flags, tags=Object.keys(F); tags.push('wind'); if(ROUNDS[i].gust) tags.push('gust');
  this.state='offer';
  if(lo<100&&MG.offerRetry(this,{title:'ONE MORE APPROACH?',what:'fly one more approach in the same wind as your lowest landing ('+lo+' PTS). If it scores more, it takes its place',go:'FLY IT!',tags,
   onEarn:()=>{ this.redo={i,was:lo}; this.newApproach(); },onSkip:()=>this.done()})) return;
  this.done(); },
 done(){ const best=Math.max(...this.results), R=this.redo; if(H.simFlight) H.simFlight({title:'LANDING CHALLENGE',min:R?8:6,ldg:R?4:3});
  const extra=R&&R.pts!=null?(R.better?' Bonus approach: '+R.pts+' beat your '+R.was+'.':' Bonus approach: '+R.pts+', so your '+R.was+' stays.'):'';
  MG.end(this,this.total,{head:this.total>=300?'ACE APPROACHES!':'ALL THREE DOWN',line:'Approaches: '+this.results.join(' + ')+' points.'+extra+' Best single landing: '+best+'.'}); this.state='over'; },
 draw(c){
  const VH=G.VH, top=42, bot=VH-74, horizon=top+(bot-top)*.42;
  // sky + ground
  H.sky(c,0,top,VW,horizon-top,{mode:this.round===2?'golden':'day',sun:[.86,.22],t:this.t,flare:true}); H.clouds(c,0,top,VW,(horizon-top)*.7,{t:this.t,n:4,seed:9,speed:3,alpha:.8});
  const gg=c.createLinearGradient(0,horizon,0,bot); gg.addColorStop(0,'#6a9a52'); gg.addColorStop(1,'#3f6a34'); c.fillStyle=gg; c.fillRect(0,horizon,VW,bot-horizon);
  // world -> screen: the airplane stays at a fixed x; altitude scales so the last 300 ft fill the view
  const ax=VW*.3, gy=bot-28, altPx=(gy-top-30)/320;
  const sx=wx=>{ const d=wx-this.x, k=Math.abs(d); return ax+Math.sign(d)*k*.13/(1+k/1600); }, syAlt=alt=>gy-alt*altPx;
  // runway (seen from the side, a long strip) with threshold bars, aiming point and the PAPI
  c.fillStyle='#3a3d42'; c.fillRect(sx(0),gy-3,sx(RWY_END)-sx(0),8); c.fillStyle='#f2f2f2';
  for(let i=0;i<6;i++) c.fillRect(sx(20+i*14),gy-2,Math.max(1,sx(28+i*14)-sx(20+i*14)),2);
  c.fillRect(sx(AIM-75),gy-2.5,Math.max(2,sx(AIM+75)-sx(AIM-75)),3); for(let wx=300;wx<RWY_END-100;wx+=200) c.fillRect(sx(wx),gy,Math.max(1,sx(wx+60)-sx(wx)),1.4);
  const pw=papi(this.alt,this.x); for(let i=0;i<4;i++){ c.beginPath(); c.arc(sx(AIM-120-i*14),gy+8,1.8,0,PI*2); c.fillStyle=i<pw?'#fffbe6':'#ff3b30'; c.fill(); }
  // approach lights + distance boards
  for(let wx=-800;wx<0;wx+=100){ c.fillStyle='#fffbe6'; c.beginPath(); c.arc(sx(wx),gy+1,1.2,0,PI*2); c.fill(); }
  // the glide path, faint
  c.strokeStyle='rgba(255,255,255,.18)'; c.setLineDash([4,4]); c.lineWidth=1; c.beginPath(); c.moveTo(sx(AIM),syAlt(0)); c.lineTo(sx(AIM-3000),syAlt(3000*TAN3)); c.stroke(); c.setLineDash([]);
  // the airplane
  const a=H.myAC(), py=syAlt(Math.max(0,this.alt)), pitch=this.state==='fly'||this.state==='ready'?Math.max(-.12,Math.min(.18,-this.vs/3000+(this.alt<18?.08:0))):-.02;
  c.save(); c.translate(ax,py); c.rotate(-pitch); H.drawAC(c,a.id,-38,-34,76,38,a.paint,{ground:false,prop:'spin',t:this.t}); c.restore();
  if(this.alt>0&&this.alt<120){ c.fillStyle='rgba(0,0,0,.2)'; c.beginPath(); c.ellipse(ax,gy+1,18*(1-this.alt/150),2,0,0,PI*2); c.fill(); }
  // instruments
  const ix=8, iy=top+6;
  G.rrect(ix,iy,118,44,8); c.fillStyle='rgba(11,11,12,.75)'; c.fill();
  G.txt('ALT '+Math.max(0,Math.round(this.alt))+' FT',ix+8,iy+6,6.4,C.ink,'left',undefined,800);
  G.txt('VS '+(this.vs>0?'+':'')+Math.round(this.vs)+' FPM',ix+8,iy+18,6.4,this.vs<-700?C.bad:C.ink,'left',undefined,800);
  G.txt('SPEED '+Math.round(this.ias)+' KT',ix+8,iy+30,6.4,this.ias<52?C.bad:C.ink,'left',undefined,800);
  // big PAPI readout
  const px0=VW-96; G.rrect(px0,iy,88,44,8); c.fillStyle='rgba(11,11,12,.75)'; c.fill(); G.txt('PAPI',px0+44,iy+5,5.4,C.dim,'center',undefined,800);
  for(let i=0;i<4;i++){ c.beginPath(); c.arc(px0+17+i*18,iy+25,6,0,PI*2); c.fillStyle=i<pw?'#fffbe6':'#ff3b30'; c.fill(); if(i<pw){ c.save(); c.shadowColor='#fffbe6'; c.shadowBlur=6; c.fill(); c.restore(); } }
  G.txt(pw===2?'ON GLIDE PATH':pw>2?'TOO HIGH':'TOO LOW',px0+44,iy+34,4.8,pw===2?C.good:C.warn,'center',undefined,800);
  // power bar + the big hold pad
  const by=bot+6; G.rrect(10,by,VW-20,VH-by-8,12); c.fillStyle=G.ptr.down&&this.state==='fly'?G.rgba(C.accent,.22):'rgba(255,255,255,.05)'; c.fill(); c.strokeStyle=G.rgba(C.accent,.5); c.lineWidth=1; c.stroke();
  G.txt(this.alt<18&&this.state==='fly'?'HOLD TO FLARE • LET GO TO SETTLE':'HOLD FOR POWER • LET GO TO DESCEND',VW/2,by+10,6.6,C.ink,'center',VW-40,800);
  G.rrect(30,by+30,VW-60,10,5); c.fillStyle='rgba(255,255,255,.12)'; c.fill(); G.rrect(30,by+30,(VW-60)*this.pw,10,5); c.fillStyle=C.accent; c.fill(); G.txt('POWER',VW/2,by+44,4.8,C.dim,'center',undefined,800);
  // messages: the tower's call, the landing grade
  if(this.state==='ready'){ G.rrect(24,horizon-40,VW-48,34,12); c.fillStyle='rgba(11,11,12,.82)'; c.fill(); G.txt('HOLD THE PAD BELOW TO FLY',VW/2,horizon-34,8,C.title,'center',VW-60,800); G.txt('THEN WATCH THE PAPI LIGHTS',VW/2,horizon-20,5.6,C.sub,'center',undefined,800); }
  if((this.state==='fly'||this.state==='ready')&&this.x<START+700){ G.rrect(14,iy+52,VW-28,30,10); c.fillStyle='rgba(11,11,12,.8)'; c.fill(); G.para('TOWER: '+this.call,VW/2,iy+57,5.8,C.ink,'center',VW-40,8.5,800); }
  if(this.msg){ G.txt(this.msg,VW/2,horizon-24,8.6,C.bad,'center',VW-20,800); }
  if(this.state==='roll'&&this.res){ G.rrect(20,horizon-46,VW-40,48,12); c.fillStyle='rgba(11,11,12,.82)'; c.fill(); G.txt(this.res.head,VW/2,horizon-40,11,this.res.pts>=80?C.good:C.title,'center',VW-50,800); G.txt(this.res.line,VW/2,horizon-22,5.4,C.sub,'center',VW-50,700); G.txt('+'+this.res.pts+' PTS',VW/2,horizon-12,6.4,C.accentHi,'center',undefined,800); }
  MG.hud(this,c,this.total+' PTS',{sub:(this.redo?'BONUS APPROACH • '+ROUNDS[this.redo.i].name:'APPROACH '+Math.min(3,this.round+1)+' OF 3 • '+ROUNDS[Math.min(2,this.round)].name),tip:'Hold anywhere for power. Keep the PAPI at two white, two red, then flare just above the runway.'});
 }
};
})();
