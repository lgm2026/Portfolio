/* BEER PONG vs SPARKS (CUP PONG with root beer in the family tone) - picnic yard.
   6 cups a side in a 3-2-1 rack. Pull back from the ball like a slingshot: sideways aims, the length of the pull is
   the distance. Two throws a turn; sink both and you get BALLS BACK. Clear Sparks' rack first. Points only. */
(function(){
const VW=G.VW, K=G.gameKit;
const CAM={CH:.62,ZC:.55,F:700}, TH=14*Math.PI/180, SN=Math.sin(TH), CS=Math.cos(TH);
const TW=.305, TL=2.44, RIM=.0475, CUPH=.12, BALL=.02, G9=9.81;
const PULL=140;                       // full power pull (game px)
const zOf=p=>1.95+p*.6;               // power 0..1 -> landing distance (m)
const XPP=.0033;                      // metres of aim per px of sideways pull
function rack(){
 const zb=TL-.06, dz=RIM*2*.866;
 return [{x:0,z:zb-2*dz},{x:-RIM,z:zb-dz},{x:RIM,z:zb-dz},{x:-2*RIM,z:zb},{x:0,z:zb},{x:2*RIM,z:zb}].map((c,i)=>Object.assign(c,{i,up:true,t:0}));
}
const title=()=>G.T({g:'BEER PONG',f:'CUP PONG'});
G.scenes.pong={
 enter(){
  this.cups=rack(); this.mine=[1,1,1,1,1,1];   // my rack (Sparks shoots at it): shown in the panel
  this.state='tut'; this.turn='me'; this.left=2; this.made=0; this.ball=null; this.drag=null;
  this.lastP=null; this.lastMark=null; this.msg=''; this.msgT=0; this.parts=[]; this.sT=0; this.sparksQ=0;
  this.thrown=0; this.sunk=0; this.ghost=null; this.flashCup=-1; this.flashT=0; this.kb=null; this.sp=null; this.sMade=0; this.endWin=false;
  this.pause=G.Pause({restart:['pong'],quit:['picnicselect'],quitLabel:'QUIT TO PICNIC YARD'});
  const fam=G.save.tone==='family';
  this.modal=K.tutModal(title()+' VS SPARKS',['6 CUPS A SIDE • CLEAR HIS RACK FIRST','PULL BACK FROM THE BALL, LET GO TO THROW','SIDEWAYS AIMS • LONGER PULL = FARTHER',['SINK BOTH THROWS = BALLS BACK','#ffd060',7.5],[fam?'ROOT BEER IN EVERY CUP':'NEVER DRINK AND RIDE','#80d8f0',7]],'GAME ON');
  this.onModal=()=>{ if(this.state==='tut'){ this.state='play'; this.say('YOUR SHOT','#ffd060'); } };
  AUDIO.play('game');
 },
 say(m,col,t){ this.msg=m; this.msgCol=col||'#ffd060'; this.msgT=t||1.4; },
 cy(){ return 46+(G.VH-112-46)*.36; },
 P(x,y,z){ const dy=y-CAM.CH, dz=z+CAM.ZC, depth=-dy*SN+dz*CS, up=dy*CS+dz*SN, s=CAM.F/Math.max(.15,depth); return [VW/2+x*s,this.cy()-up*s,s]; },
 ballXY(){ return [VW/2,G.VH-140]; },
 panelY(){ return G.VH-104; },
 /* ---------- throws ---------- */
 aimFrom(pull){   // pull = finger offset from where the drag started (down = positive)
  const p=Math.max(0,Math.min(1,pull.dy/PULL)), x=Math.max(-.4,Math.min(.4,-pull.dx*XPP));
  return {p,x};
 },
 launch(tx,tz,mine){
  const T=.62+tz*.12, x0=mine?0:0, y0=mine?.3:.32, z0=mine?-.12:TL+.12;
  const tzz=mine?tz:tz;
  this.ball={x0,y0,z0,tx,tz:tzz,T,t:0,mine,vx:(tx-x0)/T,vz:(tzz-z0)/T,vy:(CUPH-y0+G9*T*T/2)/T};
  AUDIO.sfx('swish');
 },
 throwMine(a){
  this.thrown++;
  const tz=zOf(a.p)+(Math.random()-.5)*.03, tx=a.x+(Math.random()-.5)*.02;
  this.lastP=a.p; this.launch(tx,tz,true); this.left--;
 },
 sparksThrow(){
  // Sparks: a steady hand, a little hotter when he's behind
  const mine=this.mine.map((v,i)=>v?i:-1).filter(i=>i>=0);
  const behind=this.cups.filter(c=>!c.up).length-(6-mine.length);
  const pIn=Math.min(.5,.3+Math.max(0,behind)*.04);
  const target=mine[Math.floor(Math.random()*mine.length)];
  const r=Math.random(), res=r<pIn?'in':(r<pIn+.12?'rim':'miss');
  this.sp={target,res};
  // he throws toward us: the ball sails up and over the camera
  this.ball={x0:(Math.random()-.5)*.1,y0:.34,z0:TL+.15,T:.9,t:0,mine:false,vx:(Math.random()-.5)*.25,vz:-2.6,vy:3.2};
  AUDIO.sfx('swish');
 },
 landMine(b){
  // where it comes down at rim height, against the live cups
  let best=null, bd=1e9;
  for(const c of this.cups) if(c.up){ const d=Math.hypot(b.tx-c.x,b.tz-c.z); if(d<bd){ bd=d; best=c; } }
  this.lastMark={x:b.tx,z:b.tz,t:G.time};
  if(best&&bd<RIM-BALL*.6) return this.sink(best,'SPLASH!');
  if(best&&bd<RIM+BALL*.75){
   if(Math.random()<.4) return this.sink(best,'RIM… AND IN!');
   AUDIO.sfx('board'); this.say('OFF THE RIM!','#ffb070'); this.bounce(b,(b.tx-best.x)*14,1.1,(b.tz-best.z)*14); return this.afterMine(false);
  }
  AUDIO.sfx('thud'); this.bounce(b,b.vx*.4,1.2,b.vz*.35);
  const lr=b.tx<-TW-.02||b.tx>TW+.02, ln=b.tz>TL+.02;
  this.say(lr?'WIDE!':(ln?'LONG!':(best&&b.tz<best.z-RIM?'SHORT!':'MISS!')),'#ff9a80');
  this.afterMine(false);
 },
 bounce(b,vx,vy,vz){ this.ghost={x:b.tx,y:CUPH,z:b.tz,vx,vy,vz,t:0}; },
 sink(c,why){
  c.up=false; c.t=G.time; this.made++; this.sunk++;
  AUDIO.sfx('hole'); G.shake=Math.max(G.shake,2);
  const [px,py,s]=this.P(c.x,CUPH,c.z);
  const col=G.save.tone==='family'?'#7a3a1a':'#e8b440';
  for(let k=0;k<18;k++) this.parts.push({x:px,y:py,vx:(Math.random()-.5)*90,vy:-40-Math.random()*90,t:.7+Math.random()*.4,col:k%3?col:'#fff6dc',r:1+Math.random()*1.6});
  const left=this.cups.filter(q=>q.up).length;
  this.say(left?why+' '+left+' LEFT':'LAST CUP!','#80ffa0');
  this.afterMine(true);
 },
 afterMine(sank){
  this.ball=null;
  if(!this.cups.some(c=>c.up)){ this.sT=.9; this.state='ending'; this.endWin=true; return; }
  if(this.left>0) return;
  if(this.made>=2){ this.left=2; this.made=0; this.say('BALLS BACK!','#ffd060',1.6); AUDIO.sfx('bigpoint'); return; }
  this.turn='sparks'; this.sparksQ=2; this.sMade=0; this.sT=1.1; this.made=0;
 },
 landSparks(){
  const sp=this.sp; this.ball=null;
  if(sp.res==='in'){ this.mine[sp.target]=0; this.sMade++; AUDIO.sfx('hole'); this.say('SPARKS SINKS ONE','#ff9a80'); this.flashCup=sp.target; this.flashT=1; }
  else if(sp.res==='rim'){ AUDIO.sfx('board'); this.say('SPARKS RIMS OUT','#cfc4b0'); }
  else { AUDIO.sfx('thud'); this.say('SPARKS MISSES','#cfc4b0'); }
  if(!this.mine.some(v=>v)){ this.sT=.9; this.state='ending'; this.endWin=false; return; }
  this.sparksQ--;
  if(this.sparksQ<=0){
   if(this.sMade>=2){ this.sparksQ=2; this.sMade=0; this.sT=1.4; this.say('SPARKS GETS BALLS BACK','#ff9a80',1.6); return; }
   this.turn='me'; this.left=2; this.made=0; this.sT=0;
   setTimeout(()=>{ if(this.turn==='me'&&this.state==='play') this.say('YOUR SHOT','#ffd060'); },500);
   return;
  }
  this.sT=1.0;
 },
 finish(){
  const win=this.endWin; this.state='over';
  const mineLeft=this.mine.filter(v=>v).length, his=this.cups.filter(c=>!c.up).length;
  const pts=win?300+mineLeft*30:60+his*15;
  G.award(pts,win?title()+' CHAMP':'GOOD GAME, SPARKS WINS');
  if(win) G.ach('pong_w');
  G.save.plays.pong=(G.save.plays.pong||0)+1;
  if(pts>(G.save.best.pong||0)) G.save.best.pong=pts;
  G.updateBoard(); G.persist();
  AUDIO.jingle(win?'win':'lose');
  const S=DATA.NPC.sparks, q=G.T((win?S.pong_lose:S.pong_win)[Math.floor(Math.random()*2)]);
  this.modal=K.endModal({title:win?'YOU RUN THE TABLE!':'SPARKS TAKES IT',titleCol:win?'#80ffa0':'#ff8a60',hub:'picnicselect',hubLabel:'PICNIC YARD',
   lines:[['YOUR CUPS LEFT: '+mineLeft+' • HIS LEFT: '+(6-his),'#ffd060',9],['SUNK '+this.sunk+' OF '+this.thrown+' THROWS','#cfc4b0',7.5],['+'+pts+' PTS','#80ffa0',8.5],...G.wrap('SPARKS: “'+q+'”',6.5,216).slice(0,2).map(l=>[l,'#cfc4b0',6.5])]});
 },
 /* ---------- update ---------- */
 update(dt){
  if(this.msgT>0) this.msgT-=dt;
  for(let i=this.parts.length-1;i>=0;i--){ const p=this.parts[i]; p.t-=dt; p.vy+=260*dt; p.x+=p.vx*dt; p.y+=p.vy*dt; if(p.t<=0) this.parts.splice(i,1); }
  if(this.flashT>0) this.flashT-=dt;
  if(this.ghost){ const g=this.ghost; g.t+=dt; g.vy-=G9*dt; g.x+=g.vx*dt; g.y+=g.vy*dt; g.z+=g.vz*dt;
   if(g.y<0&&Math.abs(g.x)<TW&&g.z<TL&&g.z>.35){ g.y=0; g.vy=Math.abs(g.vy)*.45; } if(g.t>1.1) this.ghost=null; }
  if(K.gameFrame(this,'pong','picnicselect')) return;
  if(this.state==='ending'){ this.sT-=dt; if(this.sT<=0) this.finish(); return; }
  if(this.state!=='play') return;
  const b=this.ball;
  if(b){
   b.t+=dt;
   if(b.mine){ if(b.t>=b.T) this.landMine(b); }
   else if(b.t>=b.T) this.landSparks();
   return;
  }
  if(this.turn==='sparks'){ this.sT-=dt; if(this.sT<=0) this.sparksThrow(); return; }
  // my throw: pull back anywhere in the scene and let go
  const py=this.panelY(), p=G.ptr;
  if(G.ptr.click&&p.y>44&&p.y<py) this.drag={sx:p.x,sy:p.y};
  if(this.drag&&p.down){ this.drag.dx=p.x-this.drag.sx; this.drag.dy=p.y-this.drag.sy; }
  if(this.drag&&!p.down){
   const d=this.drag; this.drag=null;
   if((d.dy||0)>14) this.throwMine(this.aimFrom(d)); else if(Math.hypot(d.dx||0,d.dy||0)>4) this.say('PULL DOWN, THEN LET GO','#cfc4b0');
  }
  // keyboard: arrows aim / power, A throws
  if(G.kbMode){
   const k=this.kb||(this.kb={dx:0,dy:70});
   if(G.keys.left) k.dx=Math.min(60,k.dx+60*dt); if(G.keys.right) k.dx=Math.max(-60,k.dx-60*dt);
   if(G.keys.up) k.dy=Math.max(0,k.dy-50*dt); if(G.keys.down) k.dy=Math.min(PULL,k.dy+50*dt);
   if(G.pressed.a) this.throwMine(this.aimFrom(k));
  }
 },
 /* ---------- drawing ---------- */
 drawCup(c,cup,mineSide){
  const [x,y,s]=this.P(cup.x,CUPH,cup.z), [bx,by,bs]=this.P(cup.x*.82,0,cup.z);
  const rx=RIM*s, ry=rx*.34, brx=RIM*.72*bs;
  const fam=G.save.tone==='family';
  c.fillStyle='rgba(0,0,0,.35)'; c.beginPath(); c.ellipse(bx+2,by+1,brx*1.3,brx*.4,0,0,7); c.fill();
  const g=c.createLinearGradient(x-rx,0,x+rx,0); g.addColorStop(0,'#8a0f1c'); g.addColorStop(.35,'#e2283a'); g.addColorStop(.6,'#c41a2c'); g.addColorStop(1,'#6a0a14');
  c.fillStyle=g; c.beginPath(); c.moveTo(x-rx,y); c.lineTo(bx-brx,by); c.ellipse(bx,by,brx,brx*.3,0,Math.PI,0,true); c.lineTo(x+rx,y); c.closePath(); c.fill();
  c.strokeStyle='rgba(255,255,255,.12)'; c.lineWidth=Math.max(.5,s*.004);
  for(const f of [.35,.62]){ const yy=y+(by-y)*f, ww=rx+(brx-rx)*f; c.beginPath(); c.ellipse(x+(bx-x)*f,yy,ww,ww*.32,0,0,Math.PI); c.stroke(); }
  c.fillStyle='#f4efe6'; c.beginPath(); c.ellipse(x,y,rx,ry,0,0,7); c.fill();
  c.fillStyle=fam?'#5a2a10':'#d99a2a'; c.beginPath(); c.ellipse(x,y+ry*.1,rx*.84,ry*.72,0,0,7); c.fill();
  c.fillStyle=fam?'rgba(255,220,180,.25)':'rgba(255,250,210,.45)'; c.beginPath(); c.ellipse(x-rx*.2,y-ry*.05,rx*.4,ry*.25,0,0,7); c.fill();
 },
 drawBall(c,x,y,r){
  c.fillStyle='rgba(0,0,0,.3)'; c.beginPath(); c.arc(x+r*.25,y+r*.3,r,0,7); c.fill();
  const g=c.createRadialGradient(x-r*.35,y-r*.35,r*.1,x,y,r); g.addColorStop(0,'#ffffff'); g.addColorStop(1,'#ff9a3a');
  c.fillStyle=g; c.beginPath(); c.arc(x,y,r,0,7); c.fill();
 },
 drawScene(c){
  const VH=G.VH, py=this.panelY();
  // night sky + string lights + pavilion
  const sky=c.createLinearGradient(0,42,0,py); sky.addColorStop(0,'#0e1426'); sky.addColorStop(.55,'#22192a'); sky.addColorStop(1,'#120d0a');
  c.fillStyle=sky; c.fillRect(0,42,VW,py-42);
  c.fillStyle='rgba(255,255,255,.5)'; for(let i=0;i<22;i++){ const x=(i*67)%VW, y=50+((i*37)%60); c.fillRect(x,y,1,1); }
  const hz=this.P(0,0,9)[1];
  c.fillStyle='#0a0d12'; c.beginPath(); c.moveTo(0,hz);
  for(let x=0;x<=VW;x+=9) c.lineTo(x,hz-10-Math.abs(Math.sin(x*.05))*12-((x*7)%5)); c.lineTo(VW,hz+4); c.lineTo(0,hz+4); c.closePath(); c.fill();
  c.fillStyle='#16120c'; c.fillRect(0,hz,VW,py-hz);
  c.strokeStyle='rgba(20,14,10,.9)'; c.lineWidth=1; c.beginPath();
  for(let x=0;x<=VW;x+=6){ const y=58+Math.sin(x/VW*Math.PI*2.5)*6; if(x) c.lineTo(x,y); else c.moveTo(x,y); } c.stroke();
  for(let i=0;i<16;i++){ const x=8+i*17, y=58+Math.sin(x/VW*Math.PI*2.5)*6+3; c.fillStyle=['#ffd060','#ff7030','#80ffa0'][i%3]; c.beginPath(); c.arc(x,y,2,0,7); c.fill(); }
  // Sparks behind the far end
  { const [sx,sy,ss]=this.P(.2,0,TL+1.1), sc=ss*.011;
    c.save(); c.translate(sx,sy-21*sc); c.scale(sc,sc);
    const arm=this.turn==='sparks'&&!this.ball&&this.sT<.35?1:0;
    G.scenes.club.drawDude(c,0,0,{shirt:'#24303e',vest:'#15151d',skin:'#c88c60',trim:'#80c8ff'},-1,arm,null); c.restore();
    G.txtO('SPARKS',sx,sy-44*sc-10,6,'#80c8ff','center'); }
  // the table
  const fl=this.P(-TW,0,.35), fr=this.P(TW,0,.35), br=this.P(TW,0,TL), bl=this.P(-TW,0,TL);
  const flg=this.P(-TW,-.05,.35), frg=this.P(TW,-.05,.35), blg=this.P(-TW,-.05,TL), brg=this.P(TW,-.05,TL);
  c.fillStyle='#0e0b08'; c.beginPath(); c.moveTo(flg[0],flg[1]); c.lineTo(fl[0],fl[1]); c.lineTo(bl[0],bl[1]); c.lineTo(blg[0],blg[1]); c.closePath(); c.fill();
  c.beginPath(); c.moveTo(frg[0],frg[1]); c.lineTo(fr[0],fr[1]); c.lineTo(br[0],br[1]); c.lineTo(brg[0],brg[1]); c.closePath(); c.fill();
  const tg=c.createLinearGradient(0,bl[1],0,fl[1]); tg.addColorStop(0,'#1a1a22'); tg.addColorStop(1,'#2a2a36');
  c.fillStyle=tg; c.beginPath(); c.moveTo(fl[0],fl[1]); c.lineTo(fr[0],fr[1]); c.lineTo(br[0],br[1]); c.lineTo(bl[0],bl[1]); c.closePath(); c.fill();
  // flame stripes + crest painted on the table
  c.save(); c.clip();
  for(const sx of [-1,1]){ c.fillStyle='rgba(240,120,24,.55)'; c.beginPath();
   for(let z=.35;z<=TL;z+=.08){ const p=this.P(sx*(TW-.03),0,z); if(z===.35) c.moveTo(p[0],p[1]); else c.lineTo(p[0],p[1]); }
   for(let z=TL;z>=.35;z-=.08){ const p=this.P(sx*(TW-.06-.015*Math.sin(z*14)),0,z); c.lineTo(p[0],p[1]); } c.closePath(); c.fill(); }
  { const [x,y,s]=this.P(0,0,1.25), w=s*.36; c.globalAlpha=.85; c.translate(x,y); c.scale(1,.3); c.drawImage(G.img.crest_sm,-w/2,-w*.53,w,w*1.06); }
  c.restore();
  c.strokeStyle='rgba(255,180,90,.35)'; c.lineWidth=1; c.beginPath(); c.moveTo(fl[0],fl[1]); c.lineTo(bl[0],bl[1]); c.moveTo(fr[0],fr[1]); c.lineTo(br[0],br[1]); c.stroke();
  // last landing mark
  if(this.lastMark&&G.time-this.lastMark.t<4&&this.lastMark.z<TL&&Math.abs(this.lastMark.x)<TW){ const [x,y,s]=this.P(this.lastMark.x,0,this.lastMark.z); c.globalAlpha=Math.max(0,1-(G.time-this.lastMark.t)/4); c.strokeStyle='#ffffff'; c.lineWidth=1; c.beginPath(); c.ellipse(x,y,s*.02,s*.007,0,0,7); c.stroke(); c.globalAlpha=1; }
  // aim guide while pulling
  const d=this.drag&&this.drag.dy>0?this.drag:(G.kbMode&&this.kb&&this.turn==='me'&&!this.ball?this.kb:null);
  if(d&&this.state==='play'&&!this.ball){
   const a=this.aimFrom(d);
   c.setLineDash([3,5]); c.strokeStyle='rgba(255,208,96,.75)'; c.lineWidth=1.4; c.beginPath();
   for(let z=.6;z<=TL;z+=.1){ const p=this.P(a.x*z/2.3,0,z); if(z===.6) c.moveTo(p[0],p[1]); else c.lineTo(p[0],p[1]); } c.stroke(); c.setLineDash([]);
  }
 },
 draw(c){
  const VH=G.VH, py=this.panelY();
  c.save(); c.beginPath(); c.rect(0,0,VW,py); c.clip();
  this.drawScene(c);
  const b=this.ball;
  const cups=this.cups.filter(q=>q.up||G.time-q.t<.35).sort((a,b2)=>b2.z-a.z);
  let ballDrawn=false;
  const drawB=()=>{ if(!b||!b.mine||ballDrawn) return; ballDrawn=true; const t=b.t, x=b.x0+b.vx*t, y=b.y0+b.vy*t-G9*t*t/2, z=b.z0+b.vz*t; const [bx,by,bs]=this.P(x,y,z); if(by<-20) return; this.drawBall(c,bx,by,Math.max(2,BALL*bs)); };
  for(const q of cups){
   if(b&&b.mine&&!ballDrawn){ const z=b.z0+b.vz*b.t; if(z>q.z) drawB(); }
   if(!q.up){ c.save(); c.globalAlpha=Math.max(0,1-(G.time-q.t)/.35); c.translate(0,(G.time-q.t)*30); this.drawCup(c,q); c.restore(); }
   else this.drawCup(c,q);
  }
  drawB();
  if(this.ghost){ const g=this.ghost, [gx,gy,gs]=this.P(g.x,Math.max(-.6,g.y),g.z); c.globalAlpha=Math.max(0,1-g.t/1.1); this.drawBall(c,gx,gy,Math.max(2,BALL*gs)); c.globalAlpha=1; }
  // Sparks' ball flies at us
  if(b&&!b.mine){ const t=b.t, x=b.x0+b.vx*t, y=b.y0+b.vy*t-G9*t*t/2, z=Math.max(.2,b.z0+b.vz*t); const [bx,by,bs]=this.P(x,y,z); this.drawBall(c,bx,Math.min(by,py-10),Math.min(16,Math.max(2,BALL*bs))); }
  for(const p of this.parts){ c.globalAlpha=Math.min(1,p.t*2); c.fillStyle=p.col; c.beginPath(); c.arc(p.x,p.y,p.r,0,7); c.fill(); }
  c.globalAlpha=1;
  // my ball, pulled back like a slingshot
  if(this.state==='play'&&this.turn==='me'&&!b){
   const [hx,hy]=this.ballXY(), d=this.drag||{dx:0,dy:0}, k=Math.min(1,Math.max(0,(d.dy||0))/PULL);
   const ox=Math.max(-30,Math.min(30,(d.dx||0)*.35)), oy=Math.min(40,Math.max(0,(d.dy||0)*.3));
   if(this.drag&&d.dy>0){ c.strokeStyle='rgba(255,255,255,.35)'; c.lineWidth=1.5; c.beginPath(); c.moveTo(hx-16,hy); c.lineTo(hx+ox,hy+oy); c.lineTo(hx+16,hy); c.stroke(); }
   this.drawBall(c,hx+ox,hy+oy,9+k*1.5);
  }
  c.restore();
  // HUD
  const his=this.cups.filter(q=>q.up).length, mine=this.mine.filter(v=>v).length;
  K.gameBar(c,title(),'YOU '+mine+' • SPARKS '+his);
  if(this.msgT>0){ c.globalAlpha=Math.min(1,this.msgT*2); G.txtO(this.msg,VW/2,92,10,this.msgCol,'center',VW-20); c.globalAlpha=1; }
  // panel: power meter, throws left, my rack
  c.fillStyle='rgba(11,10,16,.97)'; c.fillRect(0,py,VW,VH-py); c.fillStyle='rgba(240,120,24,.5)'; c.fillRect(0,py,VW,1);
  const mx=14, mw=150, my=py+16, mh=14;
  const dd=this.drag&&this.drag.dy>0?this.drag:(G.kbMode&&this.kb?this.kb:null), pw=dd?this.aimFrom(dd).p:0;
  G.rrect(mx,my,mw,mh,7); c.fillStyle='rgba(255,255,255,.08)'; c.fill();
  if(pw){ G.rrect(mx,my,Math.max(10,mw*pw),mh,7); c.fillStyle='#ffb040'; c.fill(); }
  if(this.lastP!=null){ const x=mx+mw*this.lastP; c.fillStyle='#fff'; c.fillRect(x-1,my-3,2,mh+6); G.txt('LAST',x,my+mh+3,5.2,'#cfc4b0','center',undefined,700); }
  G.txt('POWER',mx+6,my+2.5,6,pw?'#16100a':'#9a8f80','left',undefined,800);
  const bl=this.turn==='me'?this.left:0;
  G.txt(this.turn==='me'?'YOUR THROWS':'SPARKS SHOOTING',mx,my+34,6,'#cfc4b0','left',undefined,700);
  for(let i=0;i<2;i++){ c.beginPath(); c.arc(mx+80+i*14,my+38,5,0,7); c.fillStyle=i<bl?'#ffb040':'rgba(255,255,255,.1)'; c.fill(); }
  // my rack (what Sparks shoots at)
  const rx=VW-56, ry=py+20, P6=[[0,0],[-1,1],[1,1],[-2,2],[0,2],[2,2]];
  G.txt('YOUR CUPS',rx,py+6,5.6,'#ff9a80','center',undefined,800);
  P6.forEach(([a,r],i)=>{ const x=rx+a*9, y=ry+8+r*14, on=this.mine[i], fl=this.flashCup===i&&this.flashT>0;
   c.beginPath(); c.arc(x,y,7,0,7); c.fillStyle=on?'#d8202f':(fl&&Math.sin(G.time*30)>0?'#ffd060':'rgba(255,255,255,.08)'); c.fill();
   if(on){ c.beginPath(); c.arc(x,y,4.6,0,7); c.fillStyle=G.save.tone==='family'?'#5a2a10':'#d99a2a'; c.fill(); } });
  G.txt(this.turn==='me'&&this.state==='play'?'PULL DOWN FROM ANYWHERE • LET GO TO THROW':'SPARKS IS UP',VW/2,VH-18,5.8,'#8a7f70','center',VW-16,700);
  if(this.modal) this.modal.draw(c);
  if(this.pause.open) this.pause.draw(c);
 }
};
})();
