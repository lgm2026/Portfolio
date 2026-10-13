/* Minigames (portrait): Cornhole vs Kevin, Motorcycle Trivia, Chili Cook-off, Garage Tune-up.
   Every game: pause button (top-left) -> RESUME / RESTART / QUIT, and a results card with
   PLAY AGAIN / BACK TO <hub> / CLUBHOUSE. */
(function(){
const VW=G.VW;

/* small helper: custom tone for garage notes */
AUDIO.note=function(f,dur,vol){
 if(!this.ac||!this.sfxOn) return;
 const t=this.ac.currentTime,o=this.ac.createOscillator(),g=this.ac.createGain();
 o.type='square'; o.frequency.value=f;
 g.gain.setValueAtTime(vol||.14,t); g.gain.exponentialRampToValueAtTime(.001,t+(dur||.22));
 o.connect(g); g.connect(this.sfxG); o.start(t); o.stop(t+(dur||.22)+.02);
};

/* ---------- shared game chrome ---------- */
function gameBar(c,title,right){
 c.fillStyle='rgba(11,10,16,.95)'; c.fillRect(0,0,VW,41);
 c.fillStyle='rgba(240,120,24,.55)'; c.fillRect(0,41,VW,1);
 G.pauseBtnDraw();
 let cw=0;
 if(right) cw=G.chip(right,VW-6,11,{align:'right',size:6.5,col:'#ffd060',bg:'rgba(255,208,96,.12)',border:'rgba(255,208,96,.4)'});
 if(title){
  if(right){ const avail=VW-6-cw-8-48; G.txt(title,48+avail/2,13,9,'#ffd060','center',avail,800); }
  else G.txt(title,VW/2,13,9,'#ffd060','center',170,800);
 }
}
function tutModal(title,lines,go){
 return G.Modal({title,lines:lines.map(l=>Array.isArray(l)?l:[l,'#e8dcc8',7.5]),btns:[{id:'go',label:go,kind:'primary'}]});
}
function endModal(o){
 const btns=[{id:'again',label:'PLAY AGAIN',kind:'primary'}];
 if(o.hub!=='club') btns.push({id:'hub',label:o.hubLabel});
 btns.push({id:'club',label:'CLUBHOUSE'});
 return G.Modal({title:o.title,titleCol:o.titleCol,lines:o.lines,btns});
}
/* standard frame logic: pause, modal, results. Returns true when the game body should NOT update. */
function gameFrame(self,scene,hub){
 if(self.pause.open){ self.pause.update(); return true; }
 if(self.state==='over'){
  const r=self.modal&&self.modal.update();
  if(r==='again') G.go(scene); else if(r==='hub') G.go(hub); else if(r==='club') G.go('club');
  else if(G.pressed.b){ AUDIO.sfx('back'); G.go(hub); }
  return true;
 }
 if(G.pauseHit()){ self.pause.show(); return true; }
 if(self.modal){ const r=self.modal.update(); if(r){ self.modal=null; self.onModal&&self.onModal(r); } return true; }
 return false;
}

G.gameKit={gameBar,tutModal,endModal,gameFrame};

/* ============================ CORNHOLE (forward view, bar-room boards) ============================ */
const CAM={CH:2.6,ZC:3.5,F:900}, TH=16*Math.PI/180, SN=Math.sin(TH), CS=Math.cos(TH);
const BZ0=5.0,BZ1=6.2,BHW=.45,HZ=5.9,HR=.14,WALLZ=9,ROOMW=2.2;
function surfY(z){ return .08+(z-BZ0)/(BZ1-BZ0)*.22; }
G.scenes.cornhole={
 enter(){
  this.pScore=0; this.hScore=0; this.inning=1;
  this.state='tut'; this.turn=0; this.bags=[]; this.bag=null; this.slide=null;
  this.roundP=0; this.roundH=0; this.newWind();
  this.aimN=0; this.aimDir=1; this.pow=0; this.powDir=1; this.phase='aim';
  this.msg=''; this.msgT=0; this.msgCol='#ffd060'; this.kTick=0;
  this.pause=G.Pause({restart:['cornhole'],quit:['picnicselect'],quitLabel:'QUIT TO PICNIC YARD'});
  this.modal=tutModal('CORNHOLE VS KEVIN',['PLAY TO 21 • CANCEL SCORING','IN THE HOLE = 3 • ON THE BOARD = 1','TAP ONCE TO LOCK AIM, AGAIN FOR POWER',['THE CEILING FAN PUSHES BAGS SIDEWAYS','#ffd060',7.5]],'RACK ’EM');
  this.onModal=r=>{ if(this.state==='tut'){ this.state='play'; this.startTurn(); } else if(this.state==='roundend') this.nextRound(); };
  AUDIO.play('game');
 },
 newWind(){ this.wind=(Math.random()*2-1)*.4; },
 cy(){ const top=44, bot=G.VH-104; return top+(bot-top)*.40; },
 P(x,y,z){ const dy=y-CAM.CH, dz=z+CAM.ZC, depth=-dy*SN+dz*CS, up=dy*CS+dz*SN, s=CAM.F/Math.max(.2,depth); return [135+x*s,this.cy()-up*s,s]; },
 startTurn(){
  if(this.turn>=8){ this.endRound(); return; }
  if(this.turn%2===0){ this.phase='aim'; this.aimN=Math.random()*2-1; this.pow=0; this.powDir=1; }
  else { this.phase='kevin'; this.kTick=.7; }
 },
 say(m,col){ this.msg=m; this.msgT=1.5; this.msgCol=col||'#ffd060'; },
 controlBtn(){
  const VH=G.VH;
  const live=this.state==='play'&&(this.phase==='aim'||this.phase==='power');
  return {id:'act',label:this.phase==='power'?'THROW!':(this.phase==='aim'?'LOCK AIM':(this.phase==='kevin'?'KEVIN’S THROW...':'...')),kind:live?'primary':'secondary',disabled:!live,x:60,y:VH-70,w:202,h:44,size:9.5};
 },
 throwBag(){
  // the green band (30-64) lands on the board; the bright sweet spot (52-62) lands at the hole or slides into it
  const a=38*Math.PI/180, aim=this.aimN*.16+(Math.random()-.5)*.02, v=6.9+(this.pow-50)*.022+(Math.random()-.5)*.08;
  const h=v*Math.cos(a);
  this.bag={x:-.12,y:1.0,z:0,vx:h*Math.sin(aim),vy:v*Math.sin(a),vz:h*Math.cos(aim),rot:0,p:true};
  this.phase='fly'; AUDIO.sfx('swish');
 },
 land(b,sc,why){
  const isP=b.p;
  if(sc===3){ AUDIO.sfx('hole'); this.say(isP?(why||'CORNHOLE! +3'):'KEVIN: CORNHOLE!',isP?'#80ffa0':'#80b8ff');
   if(isP){ G.save.holes=(G.save.holes||0)+1; G.persist(); if(G.save.holes>=4) G.ach('cornhole_hole'); } }
  else if(sc===1){ AUDIO.sfx('board'); this.say(isP?'ON THE BOARD +1':'KEVIN: BOARD +1',isP?'#ffd060':'#80b8ff'); }
  else { AUDIO.sfx('thud'); this.say(isP?why:'KEVIN MISSED!',isP?'#ff8a70':'#cfc4b0'); }
  this.bags.push({x:b.x,y:b.y,z:b.z,p:isP,sc,hole:sc===3});
  if(isP) this.roundP+=sc; else this.roundH+=sc;
  this.bag=null; this.turn++;
  this.phase='wait'; this.kTick=.75;
 },
 resolveBoard(b){
  if(Math.hypot(b.x,b.z-HZ)<HR*1.05){ b.y=surfY(HZ); b.z=HZ; this.land(b,3,'SWISH! STRAIGHT IN +3'); return; }
  const s=Math.max(0,Math.min(.4,b.vz*.035*(.9+Math.random()*.2)));
  this.slide={b,z0:b.z,z1:b.z+s,t:0};
  this.phase='slide';
 },
 resolveMiss(b){
  b.y=0;
  let why='WIDE!';
  if(Math.abs(b.x)>BHW+.25) why='WIDE!';
  else if(b.z<BZ0) why='SHORT!';
  else if(b.z>BZ1) why='LONG! SAILED THE BOARD';
  this.land(b,0,why);
 },
 kevinThrow(){
  const lead=this.pScore-this.hScore;
  const pHole=.16+(lead>4?.09:0), pBoard=.5, r=Math.random();
  let tx,tz,ty,sc;
  if(r<pHole){ sc=3; tx=(Math.random()-.5)*.08; tz=HZ+(Math.random()-.5)*.06; ty=surfY(HZ); }
  else if(r<pHole+pBoard){ sc=1; do{ tx=(Math.random()*2-1)*.36; tz=BZ0+.1+Math.random()*1.0; }while(Math.hypot(tx,tz-HZ)<HR+.06); ty=surfY(tz); }
  else { sc=0; const m=Math.random(); ty=0;
   if(m<.5){ tx=(Math.random()*2-1)*.4; tz=4.1+Math.random()*.8; }
   else if(m<.75){ tx=(Math.random()*2-1)*.4; tz=6.5+Math.random()*1.2; }
   else { tx=(Math.random()<.5?-1:1)*(.62+Math.random()*.3); tz=5+Math.random()*1.2; } }
  const T=1.05, x0=.35, y0=1.0, z0=0;
  this.bag={x:x0,y:y0,z:z0,vx:(tx-x0)/T,vz:(tz-z0)/T,vy:(ty-y0+4.9*T*T)/T,rot:0,p:false,t:0,T,tx,ty,tz,sc};
  this.phase='kfly'; AUDIO.sfx('swish');
 },
 endRound(){
  const d=this.roundP-this.roundH;
  if(d>0) this.pScore+=d; else this.hScore-=d;
  AUDIO.sfx(d>0?'ok':(d<0?'buzzer':'blip'));
  if(this.pScore>=21||this.hScore>=21){ this.finish(); return; }
  this.state='roundend';
  const cancel=d===0?'WASH • NOBODY SCORES':(d>0?'CANCEL SCORING: YOU +'+d:'CANCEL SCORING: KEVIN +'+(-d));
  this.modal=G.Modal({title:'ROUND '+this.inning,lines:[['YOU +'+this.roundP+'  •  KEVIN +'+this.roundH,'#f4ede2',8.5],[cancel,d>0?'#80ffa0':(d<0?'#80b8ff':'#cfc4b0'),7.5],[this.pScore+' – '+this.hScore,'#ffd060',12]],btns:[{id:'next',label:'NEXT ROUND',kind:'primary'}]});
 },
 nextRound(){
  this.state='play'; this.inning++; this.newWind();
  this.bags=[]; this.turn=0; this.roundP=0; this.roundH=0;
  this.startTurn(); AUDIO.sfx('ok');
 },
 finish(){
  const win=this.pScore>=21&&this.pScore>this.hScore;
  this.win=win; this.state='over';
  const pts=win?400+(this.pScore-this.hScore)*10:120;
  G.award(pts,win?'CORNHOLE CHAMP':'GOOD GAME, KEVIN WINS');
  if(win) G.ach('cornhole_w');
  G.save.plays.cornhole=(G.save.plays.cornhole||0)+1;
  const best=G.save.best.cornhole||0; if(pts>best) G.save.best.cornhole=pts;
  G.storyEvent('cornhole');
  G.updateBoard();
  AUDIO.jingle(win?'win':'lose');
  const quote=G.T(win?DATA.NPC.kevin.cornhole_win[0]:DATA.NPC.kevin.cornhole_lose[0]);
  this.modal=endModal({title:win?'YOU TAKE THE CROWN!':'KEVIN HOLDS THE CROWN',titleCol:win?'#80ffa0':'#ff8a60',hub:'picnicselect',hubLabel:'PICNIC YARD',
   lines:[[this.pScore+' – '+this.hScore,'#ffd060',12],['+'+pts+' PTS','#80ffa0',8.5],...G.wrap('KEVIN: “'+quote+'”',6.5,216).slice(0,3).map(l=>[l,'#cfc4b0',6.5])]});
 },
 update(dt){
  if(gameFrame(this,'cornhole','picnicselect')) return;
  if(this.msgT>0) this.msgT-=dt;
  const ph=this.phase, VH=G.VH;
  const b=this.controlBtn();
  const tap=G.clicked(b.x,b.y,b.w,b.h)||G.clicked(0,44,VW,VH-104-44)||G.pressed.a;
  if(ph==='aim'){
   this.aimN+=this.aimDir*1.7*dt; if(this.aimN>1){this.aimN=1;this.aimDir=-1;} if(this.aimN<-1){this.aimN=-1;this.aimDir=1;}
   if(tap){ this.phase='power'; this.pow=0; this.powDir=1; AUDIO.sfx('blip'); }
  } else if(ph==='power'){
   this.pow+=this.powDir*85*dt; if(this.pow>100){this.pow=100;this.powDir=-1;} if(this.pow<0){this.pow=0;this.powDir=1;}
   if(tap) this.throwBag();
  } else if(ph==='fly'){
   const bg=this.bag, n=4, h=dt/n;
   for(let i=0;i<n;i++){
    bg.vx+=this.wind*h; bg.vy-=9.8*h;
    bg.x+=bg.vx*h; bg.y+=bg.vy*h; bg.z+=bg.vz*h; bg.rot+=h*9;
    if(bg.z>WALLZ-.12){ bg.z=WALLZ-.12; bg.vz*=-.15; }
    if(bg.vy<0&&bg.z>=BZ0&&bg.z<=BZ1&&Math.abs(bg.x)<=BHW&&bg.y<=surfY(bg.z)){ bg.y=surfY(bg.z); this.resolveBoard(bg); return; }
    if(bg.y<=0){ this.resolveMiss(bg); return; }
   }
  } else if(ph==='slide'){
   const s=this.slide; s.t+=dt/.28;
   const k=Math.min(1,s.t), e=1-(1-k)*(1-k);
   s.b.z=s.z0+(s.z1-s.z0)*e; s.b.y=surfY(Math.min(BZ1,s.b.z));
   if(Math.abs(s.b.x)<HR*.85&&Math.abs(s.b.z-HZ)<HR*.6){ this.slide=null; s.b.z=HZ; s.b.y=surfY(HZ); this.land(s.b,3,'SLID IN! CORNHOLE +3'); return; }
   if(k>=1){
    this.slide=null;
    if(s.z1>BZ1){ s.b.z=BZ1+.18; s.b.y=0; this.land(s.b,0,'SLID OFF THE BACK'); }
    else this.land(s.b,1);
   }
  } else if(ph==='kevin'){
   this.kTick-=dt; if(this.kTick<=0) this.kevinThrow();
  } else if(ph==='kfly'){
   const bg=this.bag; bg.t+=dt;
   const t=Math.min(bg.t,bg.T);
   bg.x=.35+bg.vx*t; bg.z=bg.vz*t; bg.y=1.0+bg.vy*t-4.9*t*t; bg.rot+=dt*9;
   if(bg.t>=bg.T){ bg.x=bg.tx; bg.y=bg.ty; bg.z=bg.tz; this.land(bg,bg.sc); }
  } else if(ph==='wait'){
   this.kTick-=dt; if(this.kTick<=0) this.startTurn();
  }
 },
 /* ---------- drawing ---------- */
 drawBag(c,b,flying){
  const [x,y,s]=this.P(b.x,b.y,b.z);
  if(flying){
   const gy=(b.z>=BZ0&&b.z<=BZ1&&Math.abs(b.x)<=BHW)?surfY(b.z):0;
   const [sx,sy,ss]=this.P(b.x,gy,b.z);
   c.fillStyle='rgba(0,0,0,.28)'; c.beginPath(); c.ellipse(sx,sy,ss*.1,ss*.035,0,0,7); c.fill();
  }
  const w=Math.max(4,s*.17), h=flying?w:w*.55;
  c.save(); c.translate(x,y); if(flying) c.rotate(b.rot);
  G.rrect(-w/2,-h/2,w,h,Math.min(3,h/3)); c.fillStyle=b.p?'#c8243a':'#2458c8'; c.fill();
  c.strokeStyle=b.p?'#ff8090':'#90b8ff'; c.lineWidth=Math.max(.6,w*.06); G.rrect(-w/2+w*.12,-h/2+h*.14,w*.76,h*.72,Math.min(2,h/4)); c.stroke();
  c.restore();
 },
 drawRoom(c){
  const VH=G.VH, P=(x,y,z)=>this.P(x,y,z), sceneBot=VH-104;
  c.fillStyle='#2a1c12'; c.fillRect(0,0,VW,sceneBot);
  // back wall (only its lower part is in view from the thrower's line)
  const [lx,wty]=P(-ROOMW,2.6,WALLZ), [rx,wby]=P(ROOMW,0,WALLZ);
  const wg=c.createLinearGradient(0,Math.max(0,wty),0,wby); wg.addColorStop(0,'#2a1c10'); wg.addColorStop(1,'#3e2a18');
  c.fillStyle=wg; c.fillRect(0,Math.max(0,wty),VW,wby-Math.max(0,wty)+1);
  c.fillStyle='rgba(0,0,0,.14)'; for(let y=Math.max(0,wty);y<wby;y+=7) c.fillRect(0,y,VW,1);
  // floor
  const [flx,fly]=P(-6,0,.6), [frx]=P(6,0,.6), [blx]=P(-6,0,WALLZ), [brx]=P(6,0,WALLZ);
  const fg=c.createLinearGradient(0,wby,0,sceneBot); fg.addColorStop(0,'#3a2816'); fg.addColorStop(1,'#5a3e22');
  c.fillStyle=fg; c.beginPath(); c.moveTo(blx,wby); c.lineTo(brx,wby); c.lineTo(frx,fly); c.lineTo(flx,fly); c.closePath(); c.fill();
  c.strokeStyle='rgba(0,0,0,.18)'; c.lineWidth=1;
  for(let x=-6;x<=6.01;x+=.3){ const [ax,ay]=P(x,0,.6), [bx,by2]=P(x,0,WALLZ); c.beginPath(); c.moveTo(ax,ay); c.lineTo(bx,by2); c.stroke(); }
  for(let z=1.2;z<WALLZ;z+=1.15){ const [ax,ay]=P(-6,0,z), [bx]=P(6,0,z); c.fillStyle='rgba(0,0,0,.07)'; c.fillRect(ax,ay,bx-ax,1); }
  // bar counter along the back wall, bottles on top, stools in front
  { const [x0,y0]=P(-ROOMW,1.0,WALLZ-.6), [x1,y1]=P(-.35,0,WALLZ-.6);
    c.fillStyle='#3a2512'; c.fillRect(x0,y0,x1-x0,y1-y0);
    c.fillStyle='#6a4524'; c.fillRect(x0,y0-3,x1-x0,4);
    const cols=['#2a7a4a','#b02a30','#c8882a','#3a5ab0','#7a3ac8','#d8d0b8'];
    for(let i=0;i<9;i++){ const [bx,by,bs]=P(-ROOMW+.15+i*.2,1.0,WALLZ-.65); c.fillStyle=cols[i%cols.length]; c.fillRect(bx,by-bs*.26,Math.max(2,bs*.07),bs*.26); }
    for(let i=0;i<4;i++){ const [sx,sy,ss]=P(-1.9+i*.45,0,WALLZ-1.2); c.fillStyle='#1c120a'; c.fillRect(sx-1,sy-ss*.62,2,ss*.62); c.fillStyle='#8a2a1a'; c.beginPath(); c.ellipse(sx,sy-ss*.64,ss*.15,ss*.05,0,0,7); c.fill(); } }
  // warm light pool on the board
  { const [cx,cy,s]=P(0,0,5.6); const g=c.createRadialGradient(cx,cy,2,cx,cy,s*1.5); g.addColorStop(0,'rgba(255,210,120,.18)'); g.addColorStop(1,'rgba(255,210,120,0)'); c.fillStyle=g; c.fillRect(cx-s*1.6,cy-s*1.2,s*3.2,s*2.4); }
  // string lights + hanging neon (foreground, below the score bar)
  c.strokeStyle='rgba(20,14,10,.8)'; c.lineWidth=1; c.beginPath();
  for(let x=0;x<=VW;x+=6){ const y=47+Math.sin(x/VW*Math.PI*3)*4; if(x) c.lineTo(x,y); else c.moveTo(x,y); } c.stroke();
  for(let i=0;i<16;i++){ const x=8+i*17, y=47+Math.sin(x/VW*Math.PI*3)*4+3; c.fillStyle=['#ffd060','#ff7030','#80ffa0'][i%3]; c.beginPath(); c.arc(x,y,2,0,7); c.fill(); }
  { const x=10, y=60, w=86, h=32;
    c.save(); if(!G.rm()){ c.shadowColor='#ff5040'; c.shadowBlur=10; }
    c.strokeStyle='#ff5a48'; c.lineWidth=1.6; G.rrect(x,y,w,h,5); c.stroke(); c.restore();
    G.txt('RAGING',x+w/2,y+4,7,'#ff6a50','center',w-6,800); G.txt('KNIGHTS',x+w/2,y+16,7,'#ffd060','center',w-6,800); }
 },
 drawBoard(c){
  const P=(x,y,z)=>this.P(x,y,z);
  const fl=P(-BHW,surfY(BZ0),BZ0), fr=P(BHW,surfY(BZ0),BZ0), br=P(BHW,surfY(BZ1),BZ1), bl=P(-BHW,surfY(BZ1),BZ1);
  const flg=P(-BHW,0,BZ0), frg=P(BHW,0,BZ0), blg=P(-BHW,0,BZ1), brg=P(BHW,0,BZ1);
  // shadow + legs
  c.fillStyle='rgba(0,0,0,.35)'; c.beginPath(); c.moveTo(flg[0]-2,flg[1]+2); c.lineTo(frg[0]+2,frg[1]+2); c.lineTo(brg[0]+3,brg[1]); c.lineTo(blg[0]-3,blg[1]); c.closePath(); c.fill();
  c.strokeStyle='#5a3a1a'; c.lineWidth=Math.max(1.5,br[2]*.03);
  c.beginPath(); c.moveTo(bl[0]+2,bl[1]); c.lineTo(blg[0]+2,blg[1]); c.moveTo(br[0]-2,br[1]); c.lineTo(brg[0]-2,brg[1]); c.stroke();
  // front lip
  c.fillStyle='#6a4420'; c.beginPath(); c.moveTo(fl[0],fl[1]); c.lineTo(fr[0],fr[1]); c.lineTo(frg[0],frg[1]); c.lineTo(flg[0],flg[1]); c.closePath(); c.fill();
  // top surface
  const g=c.createLinearGradient(0,bl[1],0,fl[1]); g.addColorStop(0,'#b07a40'); g.addColorStop(1,'#c88c4a');
  c.fillStyle=g; c.beginPath(); c.moveTo(fl[0],fl[1]); c.lineTo(fr[0],fr[1]); c.lineTo(br[0],br[1]); c.lineTo(bl[0],bl[1]); c.closePath(); c.fill();
  c.strokeStyle='#f07818'; c.lineWidth=1.2; c.stroke();
  // crest decal
  { const [x,y,s]=P(0,surfY(5.35),5.35), w=s*.34; c.save(); c.globalAlpha=.85; c.translate(x,y); c.scale(1,.5); c.drawImage(G.img.crest_sm,-w/2,-w*.53,w,w*1.06); c.restore(); }
  // hole
  c.fillStyle='#120c08'; c.beginPath();
  for(let i=0;i<=18;i++){ const a=i/18*Math.PI*2, z=HZ+Math.sin(a)*HR, p=P(Math.cos(a)*HR,surfY(z)+.001,z); if(i) c.lineTo(p[0],p[1]); else c.moveTo(p[0],p[1]); }
  c.fill();
 },
 drawFan(c){
  const spin=G.rm()?0:G.time*(2+Math.abs(this.wind)*12);
  c.save(); c.translate(VW/2,66);
  c.fillStyle='#55565e'; c.fillRect(-1,-14,2,10);
  for(let i=0;i<4;i++){ c.save(); c.rotate(spin+i*Math.PI/2); c.scale(1,.35); c.fillStyle='#8a6a40'; G.rrect(3,-3.5,24,7,3); c.fill(); c.restore(); }
  c.fillStyle='#55565e'; c.beginPath(); c.arc(0,0,3.5,0,7); c.fill();
  c.restore();
  const w=this.wind, s=Math.abs(w)/.6;
  G.rrect(VW-88,62,82,24,12); c.fillStyle='rgba(11,10,16,.8)'; c.fill(); c.strokeStyle='rgba(128,216,240,.4)'; c.lineWidth=1; c.stroke();
  G.txt('FAN',VW-82,68.5,6,'#cfc4b0','left',undefined,700);
  const ax=VW-36, len=8+s*16, dir=w>=0?1:-1;
  c.strokeStyle='#80d8f0'; c.fillStyle='#80d8f0'; c.lineWidth=2;
  c.beginPath(); c.moveTo(ax-dir*len/2,74); c.lineTo(ax+dir*len/2,74); c.stroke();
  c.beginPath(); c.moveTo(ax+dir*(len/2+4),74); c.lineTo(ax+dir*(len/2-1),70); c.lineTo(ax+dir*(len/2-1),78); c.closePath(); c.fill();
 },
 draw(c){
  const VH=G.VH, sceneBot=VH-104;
  c.save(); c.beginPath(); c.rect(0,0,VW,sceneBot); c.clip();
  this.drawRoom(c);
  // Kevin by the board
  { const [kx,ky,ks]=this.P(1.0,0,6.15), sc=ks*.03; c.save(); c.translate(kx,ky-21*sc); c.scale(sc,sc);
    G.scenes.club.drawDude(c,0,0,{shirt:'#20342a',vest:'#15151d',skin:'#d9a070',trim:'#60d080'},-1,this.phase==='kfly'?1:0,null); c.restore();
    G.txtO('KEVIN',kx,ky-36*sc-12,6,'#80d0a0','center'); }
  // bags behind the board's back edge first, then the board, then bags on/in front
  const behind=this.bags.filter(b=>b.z>BZ1&&!b.hole), rest=this.bags.filter(b=>b.z<=BZ1&&!b.hole);
  behind.sort((a,b)=>b.z-a.z).forEach(b=>this.drawBag(c,b,false));
  this.drawBoard(c);
  rest.sort((a,b)=>b.z-a.z).forEach(b=>this.drawBag(c,b,false));
  if(this.slide) this.drawBag(c,this.slide.b,false);
  // aim guide
  if(this.state==='play'&&(this.phase==='aim'||this.phase==='power')){
   // where a middle-power throw goes, fan drift included
   const aim=this.aimN*.16, vz=7.07*Math.cos(38*Math.PI/180)*Math.cos(aim);   // a sweet-spot throw
   c.setLineDash([3,5]); c.strokeStyle='rgba(255,208,96,.7)'; c.lineWidth=1.5; c.beginPath();
   for(let z=1.2;z<=5.7;z+=.3){ const t=z/vz, p=this.P(-.12+Math.tan(aim)*z+.5*this.wind*t*t,0,z); if(z===1.2) c.moveTo(p[0],p[1]); else c.lineTo(p[0],p[1]); }
   c.stroke(); c.setLineDash([]);
  }
  this.drawFan(c);
  c.restore();
  // flying bag over everything (it can arc above the score bar)
  if(this.bag&&(this.phase==='fly'||this.phase==='kfly')) this.drawBag(c,this.bag,true);
  // score bar
  c.fillStyle='rgba(11,10,16,.95)'; c.fillRect(0,0,VW,41); c.fillStyle='rgba(240,120,24,.55)'; c.fillRect(0,41,VW,1);
  G.pauseBtnDraw();
  G.txt('YOU',86,6,6,'#ff8a90','center',undefined,700); G.txt(String(this.pScore),86,16,12,'#ff6a70','center',undefined,800);
  G.txt('KEVIN',232,6,6,'#90b8ff','center',undefined,700); G.txt(String(this.hScore),232,16,12,'#70a0ff','center',undefined,800);
  G.txt('ROUND '+this.inning+' • TO 21',159,8,6.5,'#cfc4b0','center',undefined,700);
  G.txt('THIS ROUND '+this.roundP+'–'+this.roundH,159,23,6.2,'#9a8f80','center',undefined,700);
  if(this.bag&&this.phase==='fly'&&this.P(this.bag.x,this.bag.y,this.bag.z)[1]<44) this.drawBag(c,this.bag,true);
  // message
  if(this.msgT>0){ c.globalAlpha=Math.min(1,this.msgT*2); G.txtO(this.msg,VW/2,100,10,this.msgCol,'center',VW-20); c.globalAlpha=1; }
  // control panel
  const py=sceneBot;
  c.fillStyle='rgba(11,10,16,.97)'; c.fillRect(0,py,VW,VH-py); c.fillStyle='rgba(240,120,24,.5)'; c.fillRect(0,py,VW,1);
  // bags left
  const pLeft=4-Math.ceil(this.turn/2), kLeft=4-Math.floor(this.turn/2);
  G.txt('YOU',30,py+10,5.8,'#ff8a90','center',undefined,700);
  for(let i=0;i<4;i++){ G.rrect(10+(i%2)*21,py+22+Math.floor(i/2)*13,17,10,3); c.fillStyle=i<pLeft?'#c8243a':'rgba(255,255,255,.08)'; c.fill(); }
  G.txt('KEV',30,py+52,5.8,'#90b8ff','center',undefined,700);
  for(let i=0;i<4;i++){ G.rrect(10+(i%2)*21,py+64+Math.floor(i/2)*13,17,10,3); c.fillStyle=i<kLeft?'#2458c8':'rgba(255,255,255,.08)'; c.fill(); }
  // meter
  const mx=60, mw=202, my=py+10, mh=16;
  if(this.phase==='power'){
   G.rrect(mx,my,mw,mh,8); c.fillStyle='rgba(255,255,255,.08)'; c.fill();
   c.fillStyle='rgba(128,255,160,.2)'; c.fillRect(mx+mw*.30,my,mw*.34,mh);      // lands on the board
   c.fillStyle='rgba(128,255,160,.42)'; c.fillRect(mx+mw*.52,my,mw*.10,mh);      // sweet spot: at the hole
   G.rrect(mx,my,mw*this.pow/100,mh,8); c.fillStyle=this.pow>64?'#ff7a50':(this.pow>=30?'#80ffa0':'#ffd060'); c.fill();
   G.txt('POWER',mx+6,my+3.5,6.5,'#16100a','left',undefined,800);
  } else {
   G.rrect(mx,my,mw,mh,8); c.fillStyle='rgba(255,255,255,.08)'; c.fill();
   c.fillStyle='rgba(255,255,255,.25)'; c.fillRect(mx+mw/2-.5,my,1,mh);
   const nx=mx+mw/2+this.aimN*(mw/2-6);
   G.rrect(nx-5,my-2,10,mh+4,4); c.fillStyle=this.phase==='aim'?'#ffd060':'rgba(255,208,96,.5)'; c.fill();
   G.txt('AIM',mx+6,my+3.5,6.5,'#cfc4b0','left',undefined,800);
  }
  G.button(this.controlBtn(),true);
  G.txt(this.phase==='aim'?'TAP ANYWHERE TO LOCK AIM':(this.phase==='power'?'TAP AGAIN TO THROW':' '),161,VH-20,6,'#8a7f70','center');
  if(this.modal) this.modal.draw(c);
  if(this.pause.open) this.pause.draw(c);
 }
};

/* ============================ TRIVIA ============================ */
G.scenes.trivia={
 enter(){
  const pool=[...DATA.TRIVIA];
  this.qs=[];
  for(let i=0;i<10;i++) this.qs.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]);
  this.i=0; this.t=15; this.state='tut'; this.correct=0; this.streak=0; this.pts=0; this.reveal=0; this.st={f:0}; this.pick=-1;
  this.pause=G.Pause({restart:['trivia'],quit:['arcadeselect'],quitLabel:'QUIT TO ARCADE'});
  this.modal=tutModal('TRIVIA NIGHT',['10 QUESTIONS • 15 SECONDS EACH','RIGHT: 50 PTS + STREAK + TIME BONUS',['6 OR MORE RIGHT MAKES CHIEF PROUD','#ffd060',7.5]],'START');
  this.onModal=()=>{ this.state='q'; };
  AUDIO.play('game');
 },
 ansRects(){
  const VH=G.VH, h=44, gap=8, top=Math.max(196,VH-14-4*(h+gap)-50);
  return [0,1,2,3].map(k=>({id:'a'+k,x:10,y:top+k*(h+gap),w:250,h}));
 },
 nextBtn(){ const VH=G.VH; return {id:'next',label:this.i>=9?'SEE RESULTS':'NEXT QUESTION ›',kind:'primary',x:40,y:VH-50,w:190,h:38,size:8}; },
 update(dt){
  if(gameFrame(this,'trivia','arcadeselect')) return;
  const q=this.qs[this.i];
  if(this.state==='q'){
   this.t-=dt;
   if(this.t<5&&this.t>0&&Math.floor(this.t*2)!==Math.floor((this.t+dt)*2)) AUDIO.sfx('tick');
   let pick=-1;
   const id=G.navList(this.st,this.ansRects());
   if(id) pick=+id.slice(1);
   if(this.t<=0) pick=-2;
   if(pick!==-1){
    this.state='reveal'; this.reveal=2.6; this.timedOut=(pick===-2); this.pick=pick;
    if(pick===q.a){ this.correct++; this.streak++; const add=50+(this.streak-1)*10+Math.ceil(Math.max(0,this.t))*2; this.pts+=add; this.win=true; this.lastAdd=add; AUDIO.sfx('ok'); }
    else { this.streak=0; this.win=false; this.lastAdd=0; AUDIO.sfx('buzzer'); }
   }
  } else if(this.state==='reveal'){
   this.reveal-=dt;
   const b=this.nextBtn();
   if(this.reveal<=0||G.clicked(b.x,b.y,b.w,b.h)||G.pressed.a){
    this.i++; this.t=15; this.st={f:0}; this.pick=-1;
    if(this.i>=10) this.finish(); else this.state='q';
   }
  }
 },
 finish(){
  this.state='over';
  G.award(this.pts,'TRIVIA NIGHT');
  if(this.correct===10) G.ach('trivia_ace');
  if(this.correct>=6) G.storyEvent('trivia6');
  const best=G.save.best.trivia||0; if(this.pts>best) G.save.best.trivia=this.pts;
  G.save.plays.trivia=(G.save.plays.trivia||0)+1;
  G.updateBoard();
  AUDIO.jingle(this.correct>=6?'win':'lose');
  const ok=this.correct>=6;
  this.modal=endModal({title:ok?'SHARP AS A NEW BLADE!':'HIT THE BOOKS, PROSPECT',titleCol:ok?'#80ffa0':'#ff8a60',hub:'arcadeselect',hubLabel:'ARCADE',
   lines:[[this.correct+' / 10 CORRECT','#ffd060',12],['+'+this.pts+' PTS','#80ffa0',8.5],...(this.correct===10?[['PERFECT! BADGE EARNED','#80e0ff',7]]:[])]});
 },
 draw(c){
  const VH=G.VH;
  G.cover(G.img.bg_dining,0,0,VW,VH); G.dim(.82);
  gameBar(c,'TRIVIA NIGHT','Q '+Math.min(10,this.i+1)+'/10');
  const q=this.qs[Math.min(this.i,9)];
  // timer
  const tf=Math.max(0,this.t)/15;
  G.rrect(8,47,VW-16,6,3); c.fillStyle='rgba(255,255,255,.1)'; c.fill();
  G.rrect(8,47,(VW-16)*(this.state==='q'?tf:(this.state==='reveal'?tf:1)),6,3); c.fillStyle=this.t<5?'#ff6a50':'#80ffa0'; c.fill();
  const A=this.ansRects(), room=A[0].y-30-62, ph=Math.min(room,170), qTop=62+(room-ph)/2, qBot=qTop+ph;
  G.panel(8,qTop,VW-16,qBot-qTop,{border:'rgba(255,170,90,.5)'});
  const L=G.wrap(q.q,9,VW-40), lh=15.5, th=L.length*lh;
  L.forEach((l,i)=>G.txt(l,VW/2,qTop+(qBot-qTop-th)/2+i*lh,9,'#f4ede2','center',undefined,700));
  G.txt('STREAK ×'+this.streak+'  •  '+this.pts+' PTS',VW/2,A[0].y-22,7,'#ffd060','center',undefined,700);
  q.o.forEach((o,k)=>{
   const r=A[k], press=this.state==='q'&&G.held(r.x,r.y,r.w,r.h), y=r.y+(press?1:0);
   let bg='rgba(30,28,40,.95)', bd='rgba(255,255,255,.14)', tc='#f0e8dc';
   if(this.state==='reveal'){
    if(k===q.a){ bg='#3fa060'; bd='#a8ffc0'; tc='#08140c'; }
    else if(k===this.pick){ bg='#a83a30'; bd='#ffb0a0'; tc='#fff'; }
    else { tc='#8a8278'; }
   } else if(this.st.f===k&&G.kbMode) bd='#ffd060';
   G.rrect(r.x,y,r.w,r.h,12); c.fillStyle=bg; c.fill(); c.strokeStyle=bd; c.lineWidth=1.3; c.stroke();
   c.beginPath(); c.arc(r.x+20,y+r.h/2,10,0,7); c.fillStyle='rgba(255,255,255,.1)'; c.fill();
   G.txt(String.fromCharCode(65+k),r.x+20,y+r.h/2-5.5,8,tc,'center',undefined,800);
   G.txt(o,r.x+38,y+r.h/2-5.5,8,tc,'left',r.w-48,700);
  });
  if(this.state==='reveal'){
   const msg=this.timedOut?'OUT OF TIME!':(this.win?'RIGHT! +'+this.lastAdd:'NOT QUITE');
   G.txtO(msg,VW/2,qBot-24,9,this.win?'#80ffa0':'#ff8a70','center');
   G.txt('SOURCE: '+q.src,VW/2,A[3].y+A[3].h+6,5.8,'#8a8a98','center',VW-20);
   G.button(this.nextBtn(),true);
  }
  if(this.modal) this.modal.draw(c);
  if(this.pause.open) this.pause.draw(c);
 }
};

/* ============================ CHILI COOK-OFF ============================ */
G.scenes.chili={
 enter(){
  this.state='tut'; this.st={f:0}; this.picked=[];
  this.stirT=0; this.stirs=0; this.misses=0; this.zone=.5; this.zoneV=.13; this.marker=0; this.attempts=0;
  this.judge=0; this.scores=null;
  this.pause=G.Pause({restart:['chili'],quit:['picnicselect'],quitLabel:'QUIT TO PICNIC YARD'});
  this.modal=tutModal('CHILI COOK-OFF',['PICK 5 INGREDIENTS','STIR WHEN THE SPOON HITS THE ZONE','3 JUDGES SCORE THE POT',['MAWMAW SAYS: NO FEAR.','#ff9ad0',7.5]],'APRON ON');
  this.onModal=()=>{ this.state='pick'; };
  AUDIO.play('ladies');
 },
 tiles(){
  const top=94;
  return DATA.CHILI.ingredients.map((ing,k)=>({id:'i'+k,x:10+(k%2)*128,y:top+Math.floor(k/2)*52,w:122,h:46}));
 },
 cookBtn(){ const VH=G.VH, n=this.picked.length; return {id:'cook',label:'COOK IT!',sub:n===5?'LIGHT THE BURNER':'PICK '+(5-n)+' MORE',kind:n===5?'primary':'secondary',x:22,y:VH-56,w:226,h:44}; },
 stirBtn(){ const VH=G.VH; return {id:'stir',label:'STIR!',kind:'primary',x:22,y:VH-60,w:226,h:48,size:11}; },
 judgeBtn(){ const VH=G.VH; return {id:'next',label:this.judge>=2?'FINAL SCORE':'NEXT JUDGE ›',kind:'primary',x:22,y:VH-58,w:226,h:44}; },
 update(dt){
  if(gameFrame(this,'chili','picnicselect')) return;
  const ING=DATA.CHILI.ingredients;
  if(this.state==='pick'){
   const T=this.tiles(), n=T.length, st=this.st;
   if(G.pressed.left||G.pressed.right){ if(st.f<n){ st.f=st.f%2===0?st.f+1:st.f-1; AUDIO.sfx('blip'); } }
   if(G.pressed.up){ st.f=st.f===n?n-2:(st.f-2<0?n:st.f-2); AUDIO.sfx('blip'); }
   if(G.pressed.down){ st.f=st.f===n?0:(st.f+2>n-1?n:st.f+2); AUDIO.sfx('blip'); }
   let act=-1;
   T.forEach((t,k)=>{ if(G.clicked(t.x,t.y,t.w,t.h)){ st.f=k; act=k; } });
   const cb=this.cookBtn();
   if(G.clicked(cb.x,cb.y,cb.w,cb.h)){ st.f=n; act=n; }
   if(G.pressed.a) act=st.f;
   if(act<0) return;
   if(act===n){
    if(this.picked.length===5){ this.state='stir'; this.stirT=0; AUDIO.sfx('ok'); AUDIO.sfx('rev'); }
    else AUDIO.sfx('buzzer');
   } else if(this.picked.includes(act)){ this.picked=this.picked.filter(x=>x!==act); AUDIO.sfx('back'); }
   else if(this.picked.length<5){ this.picked.push(act); AUDIO.sfx('blip'); }
   else AUDIO.sfx('buzzer');
  } else if(this.state==='stir'){
   this.stirT+=dt;
   this.marker=(Math.sin(this.stirT*3.4)+1)/2;
   this.zone+=this.zoneV*dt; if(this.zone>.82){this.zone=.82;this.zoneV*=-1;} if(this.zone<.18){this.zone=.18;this.zoneV*=-1;}
   const b=this.stirBtn();
   if(G.clicked(b.x,b.y,b.w,b.h)||G.clicked(0,44,VW,b.y-50)||G.pressed.a){
    this.attempts++;
    if(Math.abs(this.marker-this.zone)<.11){ this.stirs++; AUDIO.sfx('stir'); this.fb='NICE STIR!'; this.fbOk=true; }
    else { this.misses++; AUDIO.sfx('thud'); G.shake=2; this.fb='SLOPPED IT!'; this.fbOk=false; }
    this.fbT=.7;
    if(this.attempts>=10) this.beginJudge();
   }
   if(this.fbT>0) this.fbT-=dt;
   if(this.stirT>18) this.beginJudge();
  } else if(this.state==='judge'){
   const b=this.judgeBtn();
   if(G.clicked(b.x,b.y,b.w,b.h)||G.pressed.a){ AUDIO.sfx('blip'); if(++this.judge>=3) this.finish(); }
  }
 },
 beginJudge(){
  const ING=DATA.CHILI.ingredients;
  let heat=0,flav=0,chaos=0;
  for(const i of this.picked){ heat+=ING[i].heat; flav+=ING[i].flav; chaos+=ING[i].chaos; }
  heat+=this.misses*6; flav+=this.stirs*3; chaos+=this.misses*3;
  this.pot={heat,flav,chaos};
  this.scores=DATA.CHILI.judges.map(j=>{
   let hs;
   if(heat>=j.likeHeat[0]&&heat<=j.likeHeat[1]) hs=20;
   else hs=Math.max(2,20-Math.ceil(Math.min(Math.abs(heat-j.likeHeat[0]),Math.abs(heat-j.likeHeat[1]))/3));
   const fs=Math.min(10,Math.round(flav/9));
   const cs=j.bonus==='chaos'?Math.min(5,Math.round(chaos/6)):Math.max(-5,-Math.round(Math.max(0,chaos-18)/6));
   const tot=Math.max(0,Math.min(35,hs+fs+cs));
   const line=heat>j.likeHeat[1]?j.lines.hi:(heat<j.likeHeat[0]?j.lines.lo:j.lines.good);
   return {j,tot,line:G.T(line)};
  });
  this.total=Math.min(99,this.scores.reduce((a,s)=>a+s.tot,0));
  this.state='judge'; this.judge=0;
  AUDIO.play('game');
 },
 finish(){
  this.state='over';
  const pts=this.total*3;
  G.award(pts,'CHILI COOK-OFF');
  if(this.total>=90) G.ach('chili_gold');
  const best=G.save.best.chili||0; if(this.total>best) G.save.best.chili=this.total;
  G.save.plays.chili=(G.save.plays.chili||0)+1;
  G.updateBoard();
  AUDIO.jingle(this.total>=70?'win':'lose');
  this.modal=endModal({title:this.total>=90?'BLUE RIBBON BOWL!':(this.total>=70?'CROWD PLEASER!':'THE DOG LIKED IT.'),titleCol:this.total>=70?'#80ffa0':'#ff8a60',hub:'picnicselect',hubLabel:'PICNIC YARD',
   lines:[[this.total+' / 99','#ffd060',12],['+'+pts+' PTS','#80ffa0',8.5]]});
 },
 drawPot(c,cx,cy,w){
  const h=w*.55;
  c.fillStyle='rgba(0,0,0,.4)'; c.beginPath(); c.ellipse(cx,cy+h*.55,w*.55,w*.1,0,0,7); c.fill();
  // flame
  if(!G.rm()) for(let i=0;i<7;i++){ const fx=cx-w*.36+i*w*.12, fh=w*.1+Math.sin(G.time*12+i)*w*.03; c.fillStyle=i%2?'#ff9a30':'#ff5a20'; c.beginPath(); c.moveTo(fx-5,cy+h*.52); c.quadraticCurveTo(fx,cy+h*.52-fh*2,fx+5,cy+h*.52); c.fill(); }
  const g=c.createLinearGradient(cx-w/2,0,cx+w/2,0); g.addColorStop(0,'#2a2a32'); g.addColorStop(.5,'#5a5a66'); g.addColorStop(1,'#2a2a32');
  G.rrect(cx-w/2,cy-h*.3,w,h*.8,w*.12); c.fillStyle=g; c.fill();
  c.fillStyle='#6a6a76'; G.rrect(cx-w*.56,cy-h*.36,w*1.12,h*.12,4); c.fill();
  c.fillStyle='#8a2a1a'; c.beginPath(); c.ellipse(cx,cy-h*.3,w*.47,h*.14,0,0,7); c.fill();
  c.fillStyle='#c04020'; for(let i=0;i<7;i++){ const bx=cx-w*.4+((G.time*30+i*37)%(w*.8)); c.beginPath(); c.arc(bx,cy-h*.3+Math.sin(G.time*4+i)*h*.04,3+i%3,0,7); c.fill(); }
  if(!G.rm()){ c.fillStyle='rgba(240,240,255,.2)'; for(let i=0;i<5;i++){ const sy=(G.time*30+i*25)%70; c.beginPath(); c.arc(cx-w*.3+i*w*.15+Math.sin(G.time*2+i)*6,cy-h*.4-sy,5,0,7); c.fill(); } }
  // spoon follows the marker
  const sx=cx-w*.42+this.marker*w*.84;
  c.strokeStyle='#c8a060'; c.lineWidth=4; c.lineCap='round'; c.beginPath(); c.moveTo(sx,cy-h*.3); c.lineTo(sx+w*.1,cy-h*1.05); c.stroke();
 },
 draw(c){
  const VH=G.VH, ING=DATA.CHILI.ingredients;
  G.cover(G.img.bg_charity,0,0,VW,VH); G.dim(.84);
  gameBar(c,'CHILI COOK-OFF',this.state==='pick'?(this.picked.length+'/5 PICKED'):(this.state==='stir'?(10-this.attempts)+' STIRS LEFT':null));
  if(this.state==='pick'||this.state==='tut'){
   const T=this.tiles(), st=this.st;
   const di=st.f<ING.length?st.f:-1;
   G.rrect(8,48,VW-16,38,10); c.fillStyle='rgba(0,0,0,.4)'; c.fill();
   if(di>=0){ G.txt(ING[di].n,VW/2,53,8,'#ffd060','center',VW-30,800); G.txt(ING[di].d,VW/2,69,6.6,'#d8c8a8','center',VW-30); }
   else G.txt(this.picked.length===5?'READY! LIGHT THE BURNER':'TAP 5 INGREDIENTS',VW/2,60,8,'#ffd060','center',VW-30,800);
   T.forEach((t,k)=>{
    const on=this.picked.includes(k), press=G.held(t.x,t.y,t.w,t.h), y=t.y+(press?1:0);
    G.rrect(t.x,y,t.w,t.h,12); c.fillStyle=on?'rgba(240,120,24,.28)':'rgba(30,28,40,.94)'; c.fill();
    c.strokeStyle=on?'#ffb050':(st.f===k&&G.kbMode?'#ffd060':'rgba(255,255,255,.12)'); c.lineWidth=on||st.f===k&&G.kbMode?1.8:1; c.stroke();
    c.beginPath(); c.arc(t.x+16,y+t.h/2,8,0,7); c.fillStyle=on?'#f08a2a':'rgba(255,255,255,.08)'; c.fill();
    if(on){ c.strokeStyle='#16100a'; c.lineWidth=2; c.beginPath(); c.moveTo(t.x+12,y+t.h/2); c.lineTo(t.x+15,y+t.h/2+3.5); c.lineTo(t.x+20.5,y+t.h/2-3.5); c.stroke(); }
    const ing=ING[k];
    G.txt(ing.n,t.x+30,y+9,6.8,on?'#ffd8a8':'#f0e8dc','left',t.w-34,800);
    G.txt('HEAT '+ing.heat+' • FLAV '+ing.flav,t.x+30,y+26,5.6,'#9a8f80','left',t.w-34,700);
   });
   // pot preview bars
   let h=0,f=0,x=0; for(const i of this.picked){ h+=ING[i].heat; f+=ING[i].flav; x+=ING[i].chaos; }
   const by=T[T.length-1].y+T[T.length-1].h+10, cb=this.cookBtn();
   if(cb.y-by>40){
    [['HEAT',h,140,'#ff7a50'],['FLAVOR',f,120,'#ffd060'],['CHAOS',x,60,'#b0a0ff']].forEach((r,i)=>{
     const yy=by+i*12; G.txt(r[0],14,yy,5.8,'#cfc4b0','left',undefined,700);
     G.rrect(62,yy+1,180,6,3); c.fillStyle='rgba(255,255,255,.08)'; c.fill();
     G.rrect(62,yy+1,180*Math.min(1,r[1]/r[2]),6,3); c.fillStyle=r[3]; c.fill();
     G.txt(String(r[1]),VW-12,yy,5.8,r[3],'right',undefined,700);
    });
   }
   G.button(cb,st.f===ING.length);
  }
  if(this.state==='stir'){
   const b=this.stirBtn();
   G.txt('STIRS '+this.stirs+'  •  SLOPS '+this.misses,VW/2,52,8,'#f4ede2','center',undefined,800);
   G.txt('TAP WHEN THE SPOON IS IN THE GREEN ZONE',VW/2,70,6.6,'#80e0ff','center',VW-16,700);
   const potY=Math.min(250,(b.y-130+90)/2+40);
   this.drawPot(c,VW/2,potY,200);
   const barY=b.y-46;
   G.rrect(20,barY,230,18,9); c.fillStyle='rgba(255,255,255,.1)'; c.fill();
   const zx=20+this.zone*230; G.rrect(zx-.11*230,barY,.22*230,18,9); c.fillStyle='rgba(128,255,160,.45)'; c.fill();
   const mx=20+this.marker*230; G.rrect(mx-4,barY-4,8,26,4); c.fillStyle='#ffd060'; c.fill();
   if(this.fbT>0) G.txtO(this.fb,VW/2,barY-26,10,this.fbOk?'#80ffa0':'#ff8a70','center');
   G.button(b,true);
  }
  if(this.state==='judge'){
   const s=this.scores[this.judge], b=this.judgeBtn();
   const top=56, bh=b.y-14-top;
   G.panel(10,top,VW-20,bh,{border:'#ff9ad0'});
   G.txt('JUDGE '+(this.judge+1)+' OF 3',VW/2,top+12,7,'#ff9ad0','center',undefined,800);
   G.txt(s.j.n,VW/2,top+28,12,'#ffd060','center',undefined,800);
   const L=G.wrap('“'+s.line+'”',8.5,VW-56);
   L.forEach((l,i)=>G.txt(l,VW/2,top+66+i*15,8.5,'#f4ede2','center',undefined,700));
   G.txt(s.tot+' / 35',VW/2,top+bh-70,16,'#80ffa0','center',undefined,800);
   G.txt('HEAT '+this.pot.heat+' • FLAVOR '+this.pot.flav+' • CHAOS '+this.pot.chaos,VW/2,top+bh-24,6.2,'#9a8f80','center',VW-30,700);
   G.button(b,true);
  }
  if(this.modal) this.modal.draw(c);
  if(this.pause.open) this.pause.draw(c);
 }
};

/* ============================ GARAGE TUNE-UP ============================ */
G.scenes.garage={
 enter(){
  this.state='tut'; this.round=1; this.seq=[]; this.showI=0; this.showT=0;
  this.inputI=0; this.strikes=0; this.cur=0; this.flash=-1; this.flashT=0;
  this.pause=G.Pause({restart:['garage'],quit:['club'],quitLabel:'QUIT TO CLUBHOUSE'});
  this.modal=tutModal('CHIEF’S 6-POINT RITUAL',['WATCH THE PADS LIGHT UP','TAP THEM BACK IN THE SAME ORDER','ONE STEP IS ADDED EVERY ROUND',['3 STRIKES AND CHIEF SIGHS LOUDLY','#ffd060',7.5]],'START');
  this.onModal=()=>this.startRound();
  AUDIO.play('game');
 },
 NOTES:[262,330,392,440,523,587],
 pads(){
  const VH=G.VH, h=66, gap=10, top=Math.max(184,VH-26-3*(h+gap));
  return DATA.GARAGE.map((g,k)=>({id:'p'+k,x:10+(k%2)*130,y:top+Math.floor(k/2)*(h+gap),w:120,h}));
 },
 startRound(){
  this.seq=[]; for(let i=0;i<3;i++) this.seq.push(Math.floor(Math.random()*6));
  this.state='show'; this.showI=0; this.showT=.5;
 },
 update(dt){
  if(this.flashT>0){ this.flashT-=dt; if(this.flashT<=0) this.flash=-1; }
  if(gameFrame(this,'garage','club')) return;
  if(this.state==='show'){
   this.showT-=dt;
   if(this.showT<=0){
    if(this.showI<this.seq.length){
     const s=this.seq[this.showI];
     this.flash=s; this.flashT=.32; AUDIO.note(this.NOTES[s],.26);
     this.showI++; this.showT=.52;
    } else { this.state='input'; this.inputI=0; }
   }
   return;
  }
  if(this.state==='input'){
   if(G.pressed.left||G.pressed.right){ this.cur=this.cur%2===0?this.cur+1:this.cur-1; AUDIO.sfx('tick'); }
   if(G.pressed.up){ this.cur=(this.cur+4)%6; AUDIO.sfx('tick'); }
   if(G.pressed.down){ this.cur=(this.cur+2)%6; AUDIO.sfx('tick'); }
   let pick=-1;
   this.pads().forEach((p,k)=>{ if(G.clicked(p.x,p.y,p.w,p.h)){ this.cur=k; pick=k; } });
   if(G.pressed.a) pick=this.cur;
   if(pick<0) return;
   this.flash=pick; this.flashT=.22;
   if(pick===this.seq[this.inputI]){
    AUDIO.note(this.NOTES[pick],.2); AUDIO.sfx('wrench');
    this.inputI++;
    if(this.inputI>=this.seq.length){
     G.award(this.round*60,'ROUND '+this.round+' CHECK');
     if(this.round===3) G.storyEvent('garage');
     if(this.round>=7) G.ach('wrench');
     if(this.round>=8){ this.finish(true); return; }
     this.round++;
     this.seq.push(Math.floor(Math.random()*6)); // Simon-style: the sequence grows each round
     this.state='show'; this.showI=0; this.showT=.9; AUDIO.sfx('ok');
    }
   } else {
    this.strikes++; AUDIO.sfx('buzzer'); G.shake=3;
    if(this.strikes>=3){ this.finish(false); return; }
    this.state='show'; this.showI=0; this.showT=.9;
    G.toast('WATCH AGAIN - STRIKE '+this.strikes,'#ff7030');
   }
  }
 },
 finish(gold){
  this.state='over'; this.gold=gold;
  const best=G.save.best.garage||0; if(this.round>best) G.save.best.garage=this.round;
  G.save.plays.garage=(G.save.plays.garage||0)+1;
  G.updateBoard();
  AUDIO.jingle(gold?'win':'lose');
  this.modal=endModal({title:gold?'MASTER MECHANIC!':'TUNE-UP DONE',titleCol:gold?'#80ffa0':'#ffd060',hub:'club',
   lines:[['REACHED ROUND '+this.round,'#f4ede2',9],[gold?'ALL 8 ROUNDS CLEARED':'BEST '+Math.max(best,this.round),'#ffd060',7.5]]});
 },
 drawIcon(c,ic,x,y,col,lit){
  c.save(); c.translate(x,y); c.fillStyle=col; c.strokeStyle=col; c.lineWidth=2.4; c.lineCap='round'; c.lineJoin='round';
  const bg=lit?'#f07818':'#23232d';
  switch(ic){
   case 'tire': c.beginPath(); c.arc(0,0,11,0,7); c.fill(); c.fillStyle=bg; c.beginPath(); c.arc(0,0,5,0,7); c.fill(); c.fillStyle=col; for(let i=0;i<8;i++){ c.save(); c.rotate(i*Math.PI/4); c.fillRect(-1.2,-12.5,2.4,3); c.restore(); } break;
   case 'lever': c.beginPath(); c.moveTo(-11,4); c.lineTo(6,4); c.stroke(); c.beginPath(); c.moveTo(-6,0); c.quadraticCurveTo(4,-8,11,-6); c.stroke(); c.beginPath(); c.arc(-11,4,3,0,7); c.fill(); break;
   case 'light': c.beginPath(); c.arc(0,-2,8,0,7); c.fill(); c.fillRect(-4,6,8,4); c.lineWidth=1.6; for(const a of [-.9,-.45,0,.45,.9]){ c.beginPath(); c.moveTo(Math.sin(a)*11,-2-Math.cos(a)*11); c.lineTo(Math.sin(a)*14,-2-Math.cos(a)*14); c.stroke(); } break;
   case 'oil': c.beginPath(); c.moveTo(0,-11); c.quadraticCurveTo(9,1,6,6); c.quadraticCurveTo(0,13,-6,6); c.quadraticCurveTo(-9,1,0,-11); c.fill(); break;
   case 'bolt': c.beginPath(); for(let i=0;i<6;i++){ const a=i*Math.PI/3; c.lineTo(Math.cos(a)*10,Math.sin(a)*10); } c.closePath(); c.fill(); c.fillStyle=bg; c.beginPath(); c.arc(0,0,4,0,7); c.fill(); break;
   case 'stand': c.beginPath(); c.moveTo(-2,-11); c.lineTo(2,6); c.stroke(); c.beginPath(); c.moveTo(-6,8); c.lineTo(9,8); c.stroke(); break;
  }
  c.restore();
 },
 draw(c){
  const VH=G.VH, P=this.pads();
  c.fillStyle='#24242c'; c.fillRect(0,0,VW,VH);
  for(let y=42;y<P[0].y-14;y+=12){ c.fillStyle=(y/12|0)%2?'#2a2a33':'#26262e'; c.fillRect(0,y,VW,6); }
  c.fillStyle='#1c1c24'; c.fillRect(0,P[0].y-24,VW,6);
  c.fillStyle='#33333d'; c.fillRect(0,P[0].y-18,VW,VH);
  // parked bike on a lift (fits between the top bar and the status pill)
  const area=P[0].y-48-8-48, bh=Math.max(60,Math.min(150,area)), bw=Math.min(200,bh/.773), bx=VW/2-bw/2, by=48+(area-bh)/2;
  c.fillStyle='#4a4a56'; c.fillRect(bx+bw*.1,by+bh-6,bw*.8,8);
  G.flipImg('rider_orange',bx,by,bw,bh);
  gameBar(c,'GARAGE TUNE-UP','ROUND '+this.round);
  // status
  const sy=P[0].y-48;
  let status='', col='#cfc4b0';
  if(this.state==='show'){ status='WATCH THE SEQUENCE...'; col='#80e0ff'; }
  else if(this.state==='input'){ status='YOUR TURN: '+this.inputI+' / '+this.seq.length; col='#80ffa0'; }
  if(status){ G.rrect(VW/2-90,sy,180,22,11); c.fillStyle='rgba(11,10,16,.85)'; c.fill(); G.txt(status,VW/2,sy+6,7.5,col,'center',170,800); }
  for(let i=0;i<3;i++){ G.icon('wrench',c,VW-20-i*18,P[0].y-36,13,i<this.strikes?'#ff6a50':'rgba(255,255,255,.18)'); }
  DATA.GARAGE.forEach((g,k)=>{
   const p=P[k], lit=this.flash===k, press=this.state==='input'&&G.held(p.x,p.y,p.w,p.h), y=p.y+(press?1:0);
   if(lit) G.glowFill(p.x,y,p.w,p.h,14);
   else { G.rrect(p.x,y,p.w,p.h,14); c.fillStyle='#23232d'; c.fill(); c.strokeStyle=this.state==='input'&&this.cur===k&&G.kbMode?'#ffd060':'rgba(255,255,255,.14)'; c.lineWidth=1.5; c.stroke(); }
   this.drawIcon(c,g.icon,p.x+p.w/2,y+24,lit?'#16100a':'#9ad0ff',lit);
   G.txt(g.k,p.x+p.w/2,y+44,7,lit?'#16100a':'#cfc4b0','center',p.w-8,800);
  });
  G.txt('FICTIONAL PRE-RIDE RITUAL • NOT MAINTENANCE ADVICE',VW/2,VH-16,5.6,'#77758a','center',VW-16);
  if(this.modal) this.modal.draw(c);
  if(this.pause.open) this.pause.draw(c);
 }
};
})();
