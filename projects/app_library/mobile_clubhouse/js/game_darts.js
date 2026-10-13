/* DARTS vs CHIEF - 301, straight out (finish on exactly zero; going under is a BUST and the turn doesn't count).
   Touch and hold to bring up the sight (it sits above your finger), drag it onto your target, and let go when your
   hand is steady. Hold too long and the arm starts to shake. Points only. */
(function(){
const VW=G.VW, K=G.gameKit;
const ORDER=[20,1,18,4,13,6,10,15,2,17,3,19,7,16,8,11,14,9,12,5];
const RMM={bull:6.35,obull:15.9,tin:99,tout:107,din:162,dout:170};
const START=301, MAXTURNS=12;
const CHIEF={shirt:'#20202a',vest:'#15151d',skin:'#caa078',trim:'#ffb040'};
G.scenes.darts={
 enter(){
  this.state='tut'; this.turn='me'; this.score={me:START,ch:START}; this.darts=[]; this.inTurn=0; this.turnStart=START;
  this.turnN=1; this.hold=null; this.fly=null; this.msg=''; this.msgT=0; this.log=[]; this.cT=0; this.cQ=0;
  this.stats={darts:0,best:0,bulls:0}; this.pauseT=0; this.nextTurn=null; this.fly=null; this.hold=null; this.kb=null; this.endWin=false; this.sT=0;
  this.pause=G.Pause({restart:['darts'],quit:['picnicselect'],quitLabel:'QUIT TO PICNIC YARD'});
  this.modal=K.tutModal('DARTS VS CHIEF',['301 • FIRST TO EXACTLY ZERO','3 DARTS A TURN • UNDER ZERO = BUST','HOLD TO AIM, LET GO WHEN YOU’RE STEADY',['THE SIGHT SITS ABOVE YOUR FINGER','#ffd060',7.5]],'OCHE UP');
  this.onModal=()=>{ if(this.state==='tut'){ this.state='play'; this.say('YOUR THROW','#ffd060'); } };
  AUDIO.play('game');
 },
 say(m,col,t){ this.msg=m; this.msgCol=col||'#ffd060'; this.msgT=t||1.5; },
 B(){ const VH=G.VH, top=82, bot=VH-108, R=Math.min(112,(bot-top)/2-14); return {cx:VW/2,cy:(top+bot)/2,R,k:R/RMM.dout}; },
 /* ---------- scoring ---------- */
 scoreAt(x,y){
  const B=this.B(), dx=(x-B.cx)/B.k, dy=(y-B.cy)/B.k, r=Math.hypot(dx,dy);
  if(r<=RMM.bull) return {v:50,lab:'BULL',m:2,n:25};
  if(r<=RMM.obull) return {v:25,lab:'25',m:1,n:25};
  if(r>RMM.dout) return {v:0,lab:'MISS',m:0,n:0};
  let a=Math.atan2(dx,-dy)*180/Math.PI; if(a<0) a+=360;
  const n=ORDER[Math.floor(((a+9)%360)/18)];
  if(r>=RMM.tin&&r<=RMM.tout) return {v:n*3,lab:'T'+n,m:3,n};
  if(r>=RMM.din) return {v:n*2,lab:'D'+n,m:2,n};
  return {v:n,lab:String(n),m:1,n};
 },
 spot(n,ring){   // centre of a target area on screen
  const B=this.B(); if(n===25) return [B.cx,B.cy];
  const i=ORDER.indexOf(n), a=i*18*Math.PI/180, r={t:(RMM.tin+RMM.tout)/2,d:(RMM.din+RMM.dout)/2,s:135,si:60}[ring]*B.k;
  return [B.cx+Math.sin(a)*r,B.cy-Math.cos(a)*r];
 },
 /* ---------- my throws ---------- */
 sway(t){   // hand wobble: settles after a moment, then the arm tires
  const amp=t<.85?9-6*(t/.85):(t<2.2?3:Math.min(14,3+(t-2.2)*6));
  const T=G.time;
  return [amp*(Math.sin(T*1.7+.3)*.7+Math.sin(T*3.9+1.1)*.3),amp*(Math.cos(T*1.3+.8)*.7+Math.sin(T*3.1)*.3),amp];
 },
 throwAt(x,y,who){
  this.fly={x,y,who,t:0}; AUDIO.sfx('swish');
 },
 land(){
  const f=this.fly; this.fly=null;
  const s=this.scoreAt(f.x,f.y);
  this.darts.push({x:f.x,y:f.y,who:f.who,s});
  AUDIO.sfx(s.v?'board':'thud');
  const who=f.who, cur=this.score[who]-s.v;
  if(who==='me'){ this.stats.darts++; if(s.n===25) this.stats.bulls++; if(s.v===50) G.ach('darts_bull'); }
  if(cur<0){ this.bust(who); return; }
  this.score[who]=cur; this.inTurn++;
  this.say(s.v?(s.lab==='BULL'?'BULLSEYE! 50':s.lab+(s.m>1?' = '+s.v:'')):'MISS',s.v?(s.m===3||s.v>=50?'#80ffa0':'#ffd060'):'#ff9a80',1);
  if(cur===0){ this.state='ending'; this.endWin=who==='me'; this.sT=1.1; AUDIO.sfx('cheer'); this.say(who==='me'?'GAME SHOT!':'CHIEF CHECKS OUT','#80ffa0',2); return; }
  if(this.inTurn>=3) this.endTurn();
 },
 bust(who){
  this.score[who]=this.turnStart; this.say('BUST! BACK TO '+this.turnStart,'#ff8a70',1.6); AUDIO.sfx('buzzer');
  this.inTurn=3; this.endTurn();
 },
 endTurn(){
  const who=this.turn, got=this.turnStart-this.score[who];
  if(who==='me'&&got>this.stats.best) this.stats.best=got;
  this.log.unshift({who,got,left:this.score[who]}); this.log=this.log.slice(0,4);
  this.pauseT=1.2; this.nextTurn=who==='me'?'ch':'me';
  if(who==='ch'){ this.turnN++; if(this.turnN>MAXTURNS){ this.state='ending'; this.endWin=this.score.me<this.score.ch; this.sT=1.2; this.say(this.score.me===this.score.ch?'TIE GOES TO THE CHIEF':'OUT OF TURNS - LOWEST WINS','#ffd060',1.8); } }
 },
 startTurn(who){
  this.turn=who; this.inTurn=0; this.turnStart=this.score[who]; this.darts=[];
  if(who==='ch'){ this.cQ=3; this.cT=.9; this.say('CHIEF’S THROW','#ffb040'); }
  else this.say('YOUR THROW • '+this.score.me+' TO GO','#ffd060');
 },
 /* the Chief: aims for treble 20 until he can check out, then goes for the finish */
 chiefAim(){
  const left=this.score.ch;
  let n=20, ring='t';
  if(left===50){ n=25; ring='b'; }
  else if(left<=20){ n=left; ring='s'; }
  else if(left===25){ n=5; ring='s'; }
  else if(left<=40){ if(left%2===0){ n=left/2; ring='d'; } else { n=left-20; ring='s'; } }
  else if(left<=60){ if(left%3===0){ n=left/3; ring='t'; } else { n=20; ring='s'; } }
  const [x,y]=ring==='b'?this.spot(25):this.spot(n,ring);
  const sd=this.B().k*18.4, g=()=>{ let u=0; for(let i=0;i<6;i++) u+=Math.random(); return u-3; };   // ~13 mm of spread (sd of g is .71)
  return [x+g()*sd,y+g()*sd];
 },
 finish(){
  const win=this.endWin; this.state='over';
  const pts=win?350+Math.round(this.score.ch/2):80+Math.round((START-this.score.me)/4);
  G.award(pts,win?'DARTS CHAMP':'GOOD GAME, CHIEF WINS');
  if(win) G.ach('darts_w');
  G.save.plays.darts=(G.save.plays.darts||0)+1;
  if(pts>(G.save.best.darts||0)) G.save.best.darts=pts;
  G.updateBoard(); G.persist();
  AUDIO.jingle(win?'win':'lose');
  const C=DATA.NPC.chief, q=G.T((win?C.darts_lose:C.darts_win)[Math.floor(Math.random()*2)]);
  this.modal=K.endModal({title:win?'YOU OUT-THREW THE CHIEF!':'CHIEF WINS THE LEG',titleCol:win?'#80ffa0':'#ff8a60',hub:'picnicselect',hubLabel:'PICNIC YARD',
   lines:[['YOU '+this.score.me+' • CHIEF '+this.score.ch+' LEFT','#ffd060',9],['BEST TURN '+this.stats.best+(this.stats.bulls?' • BULLS '+this.stats.bulls:''),'#cfc4b0',7.5],['+'+pts+' PTS','#80ffa0',8.5],...G.wrap('CHIEF: “'+q+'”',6.5,216).slice(0,2).map(l=>[l,'#cfc4b0',6.5])]});
 },
 /* ---------- update ---------- */
 update(dt){
  if(this.msgT>0) this.msgT-=dt;
  if(K.gameFrame(this,'darts','picnicselect')) return;
  if(this.state==='ending'){ this.sT-=dt; if(this.sT<=0) this.finish(); return; }
  if(this.state!=='play') return;
  if(this.fly){ this.fly.t+=dt; if(this.fly.t>=.2) this.land(); return; }
  if(this.pauseT>0){ this.pauseT-=dt; if(this.pauseT<=0) this.startTurn(this.nextTurn); return; }
  if(this.turn==='ch'){
   this.cT-=dt;
   if(this.cT<=0&&this.cQ>0&&this.inTurn<3){ this.cQ--; const [x,y]=this.chiefAim(); this.throwAt(x,y,'ch'); this.cT=.75; }
   return;
  }
  // me: hold, aim, release
  const p=G.ptr, py=G.VH-104;
  if(G.ptr.click&&p.y>44&&p.y<py&&!this.hold) this.hold={t0:G.time};
  if(this.hold){
   const ox=p.x, oy=p.y-46, [sx,sy]=this.sway(G.time-this.hold.t0);
   this.hold.x=ox+sx; this.hold.y=oy+sy;
   if(!p.down){ const h=this.hold; this.hold=null; this.throwAt(h.x+(Math.random()-.5)*2.4,h.y+(Math.random()-.5)*2.4,'me'); }
  }
  // keyboard: arrows move the sight, A throws
  if(G.kbMode){
   const B=this.B(), k=this.kb||(this.kb={x:B.cx,y:B.cy-60*B.k*1.4,t0:G.time});
   const v=70*dt; if(G.keys.left) k.x-=v; if(G.keys.right) k.x+=v; if(G.keys.up) k.y-=v; if(G.keys.down) k.y+=v;
   if(G.keys.left||G.keys.right||G.keys.up||G.keys.down) k.t0=G.time;
   if(G.pressed.a){ const [sx,sy]=this.sway(G.time-k.t0); this.throwAt(k.x+sx,k.y+sy,'me'); k.t0=G.time; }
  }
 },
 /* ---------- drawing ---------- */
 drawBoard(c){
  const B=this.B(), k=B.k, cx=B.cx, cy=B.cy;
  // cabinet + surround
  c.fillStyle='#1a120a'; G.rrect(cx-B.R-22,cy-B.R-22,B.R*2+44,B.R*2+44,10); c.fill();
  c.strokeStyle='#4a3018'; c.lineWidth=3; c.stroke();
  c.fillStyle='#111'; c.beginPath(); c.arc(cx,cy,B.R+16,0,7); c.fill();
  const seg=(r0,r1,col,i)=>{ const a0=(i*18-9-90)*Math.PI/180, a1=a0+18*Math.PI/180; c.beginPath(); c.arc(cx,cy,r1*k,a0,a1); c.arc(cx,cy,r0*k,a1,a0,true); c.closePath(); c.fillStyle=col; c.fill(); };
  for(let i=0;i<20;i++){
   const dark=i%2===0;
   seg(RMM.obull,RMM.tin,dark?'#1b1b1b':'#efe2c0',i);
   seg(RMM.tin,RMM.tout,dark?'#c8243a':'#1f8a4a',i);
   seg(RMM.tout,RMM.din,dark?'#1b1b1b':'#efe2c0',i);
   seg(RMM.din,RMM.dout,dark?'#c8243a':'#1f8a4a',i);
  }
  c.fillStyle='#1f8a4a'; c.beginPath(); c.arc(cx,cy,RMM.obull*k,0,7); c.fill();
  c.fillStyle='#c8243a'; c.beginPath(); c.arc(cx,cy,RMM.bull*k,0,7); c.fill();
  // wires
  c.strokeStyle='rgba(200,200,210,.55)'; c.lineWidth=.6;
  for(const r of [RMM.obull,RMM.tin,RMM.tout,RMM.din,RMM.dout]){ c.beginPath(); c.arc(cx,cy,r*k,0,7); c.stroke(); }
  for(let i=0;i<20;i++){ const a=(i*18-9-90)*Math.PI/180; c.beginPath(); c.moveTo(cx+Math.cos(a)*RMM.obull*k,cy+Math.sin(a)*RMM.obull*k); c.lineTo(cx+Math.cos(a)*RMM.dout*k,cy+Math.sin(a)*RMM.dout*k); c.stroke(); }
  // numbers
  for(let i=0;i<20;i++){ const a=(i*18-90)*Math.PI/180, r=B.R+8.5; G.txt(String(ORDER[i]),cx+Math.cos(a)*r,cy+Math.sin(a)*r-4.6,6.6,'#f4ede2','center',undefined,800); }
  // checkout help: light up a one-dart finish
  if(this.turn==='me'&&this.state==='play'){
   const left=this.score.me; let hl=null;
   if(left===50) hl={bull:2}; else if(left===25) hl={bull:1};
   else if(left<=20) hl={n:left,m:1}; else if(left<=40&&left%2===0) hl={n:left/2,m:2}; else if(left<=60&&left%3===0) hl={n:left/3,m:3};
   if(hl){
    c.save(); c.globalAlpha=.35+.25*Math.sin(G.time*5); c.fillStyle='#ffe070';
    if(hl.bull){ c.beginPath(); c.arc(cx,cy,(hl.bull===2?RMM.bull:RMM.obull)*k,0,7); c.fill(); }
    else { const i=ORDER.indexOf(hl.n), R=hl.m===3?[RMM.tin,RMM.tout]:(hl.m===2?[RMM.din,RMM.dout]:[RMM.obull,RMM.tin]); seg(R[0],R[1],'#ffe070',i); if(hl.m===1) seg(RMM.tout,RMM.din,'#ffe070',i); }
    c.restore();
   }
  }
 },
 drawDart(c,x,y,who,s){
  s=s||1;
  const col=who==='me'?'#ff7a30':'#ffd060';
  c.fillStyle='rgba(0,0,0,.4)'; c.beginPath(); c.ellipse(x+3*s,y+4*s,3*s,1.6*s,.6,0,7); c.fill();
  c.strokeStyle='#c8ccd4'; c.lineWidth=1.6*s; c.beginPath(); c.moveTo(x,y); c.lineTo(x+4*s,y+6*s); c.stroke();
  c.fillStyle=col; c.beginPath(); c.moveTo(x+4*s,y+6*s); c.lineTo(x+9*s,y+5*s); c.lineTo(x+6*s,y+11*s); c.closePath(); c.fill();
  c.fillStyle=who==='me'?'#16100a':'#3a2a10'; c.beginPath(); c.arc(x,y,1.3*s,0,7); c.fill();
 },
 draw(c){
  const VH=G.VH, py=VH-104;
  // pub wall
  const g=c.createLinearGradient(0,42,0,py); g.addColorStop(0,'#2a1c12'); g.addColorStop(1,'#1a110a'); c.fillStyle=g; c.fillRect(0,42,VW,py-42);
  c.fillStyle='rgba(0,0,0,.14)'; for(let y=50;y<py;y+=11){ c.fillRect(0,y,VW,1.2); for(let x=((y-50)/11)%2?0:18;x<VW;x+=36) c.fillRect(x,y-11,1.2,11); }
  const B=this.B();
  const lg=c.createRadialGradient(B.cx,B.cy,10,B.cx,B.cy,B.R*1.9); lg.addColorStop(0,'rgba(255,210,140,.16)'); lg.addColorStop(1,'rgba(255,210,140,0)'); c.fillStyle=lg; c.fillRect(0,42,VW,py-42);
  this.drawBoard(c);
  for(const d of this.darts) this.drawDart(c,d.x,d.y,d.who);
  if(this.fly){ const f=this.fly, k=f.t/.2, s=1+(1-k)*3.2, sx=VW/2+(f.x-VW/2)*k, sy=py+20+(f.y-py-20)*k; this.drawDart(c,sx,sy,f.who,s); }
  // the Chief at the oche when it's his turn
  if(this.turn==='ch'&&this.state!=='over'){ c.save(); c.translate(VW-28,py-30); c.scale(1.7,1.7); G.scenes.club.drawDude(c,0,0,CHIEF,-1,this.fly&&this.fly.who==='ch'?1:0,null); c.restore(); }
  // the sight
  const h=this.hold||(G.kbMode&&this.turn==='me'&&this.state==='play'&&this.kb?(()=>{ const k=this.kb, [sx,sy,a]=this.sway(G.time-k.t0); return {x:k.x+sx,y:k.y+sy,t0:k.t0}; })():null);
  if(h&&h.x!=null&&this.turn==='me'){
   const amp=this.sway(G.time-h.t0)[2], steady=amp<=3.2;
   c.strokeStyle=steady?'#80ffa0':'#ffffff'; c.lineWidth=1.3;
   c.beginPath(); c.arc(h.x,h.y,5,0,7); c.stroke();
   c.beginPath(); c.moveTo(h.x-9,h.y); c.lineTo(h.x-3,h.y); c.moveTo(h.x+3,h.y); c.lineTo(h.x+9,h.y); c.moveTo(h.x,h.y-9); c.lineTo(h.x,h.y-3); c.moveTo(h.x,h.y+3); c.lineTo(h.x,h.y+9); c.stroke();
   c.fillStyle=steady?'#80ffa0':'#fff'; c.beginPath(); c.arc(h.x,h.y,.9,0,7); c.fill();
   const sc=this.scoreAt(h.x,h.y); G.chip(sc.lab+(sc.m>1?' • '+sc.v:''),h.x,h.y-26,{align:'center',size:6,col:steady?'#16100a':'#f4ede2',bg:steady?'#80ffa0':'rgba(0,0,0,.6)'});
  }
  // HUD: scoreboard
  K.gameBar(c,'DARTS • 301','TURN '+Math.min(this.turnN,MAXTURNS)+'/'+MAXTURNS);
  const sb=(x,lab,v,on,col)=>{ G.rrect(x,46,120,30,8); c.fillStyle=on?'rgba(240,120,24,.22)':'rgba(0,0,0,.45)'; c.fill(); c.strokeStyle=on?'#ffb050':'rgba(255,255,255,.12)'; c.lineWidth=1; c.stroke();
   G.txt(lab,x+10,52,6.2,col,'left',undefined,800); G.txt(String(v),x+110,49,12,'#f4ede2','right',undefined,800); };
  sb(10,'YOU',this.score.me,this.turn==='me','#ff9a60'); sb(140,'CHIEF',this.score.ch,this.turn==='ch','#ffb040');
  if(this.msgT>0){ c.globalAlpha=Math.min(1,this.msgT*2); G.txtO(this.msg,VW/2,B.cy+B.R+20,9.5,this.msgCol,'center',VW-20); c.globalAlpha=1; }
  // panel
  c.fillStyle='rgba(11,10,16,.97)'; c.fillRect(0,py,VW,VH-py); c.fillStyle='rgba(240,120,24,.5)'; c.fillRect(0,py,VW,1);
  const mine=this.darts.filter(d=>d.who===this.turn);
  G.txt(this.turn==='me'?'THIS TURN':'CHIEF’S TURN',14,py+10,6,'#cfc4b0','left',undefined,800);
  for(let i=0;i<3;i++){ const d=mine[i]; G.rrect(14+i*44,py+24,40,24,7); c.fillStyle=d?'rgba(240,120,24,.18)':'rgba(255,255,255,.06)'; c.fill();
   G.txt(d?d.s.lab:'•',34+i*44,py+30,7.5,d?(d.s.v?'#f4ede2':'#ff9a80'):'#5a5a66','center',36,800); }
  const got=this.turnStart-this.score[this.turn];
  G.txt('= '+Math.max(0,got),150,py+29,9,'#ffd060','left',undefined,800);
  this.log.slice(0,3).forEach((l,i)=>G.txt((l.who==='me'?'YOU ':'CHIEF ')+l.got+' → '+l.left,VW-14,py+10+i*12,5.8,l.who==='me'?'#ff9a60':'#ffb040','right',undefined,700));
  G.txt(this.turn==='me'?'HOLD TO AIM • LET GO WHEN THE SIGHT TURNS GREEN':'WATCH THE CHIEF',VW/2,VH-20,5.8,'#8a7f70','center',VW-16,700);
  if(this.modal) this.modal.draw(c);
  if(this.pause.open) this.pause.draw(c);
 }
};
})();
