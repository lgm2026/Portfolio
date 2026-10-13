/* Arcade cabinet (portrait): PATCH MATCH (match-3), BURNOUT BREAKER (brick breaker),
   BOULEVARD RUN (frogger), ROAD NEVER ENDS (endless runner) + the trivia machine.
   Club-themed throughout; the Raging Knights crest is always the top-ranking piece. */
(function(){
const VW=G.VW;
const K=G.gameKit;

/* ============================ ARCADE SELECT ============================ */
const GAMES=[
 {id:'trivia',name:'MOTORCYCLE TRIVIA',tag:'10 QUESTIONS • BEAT THE CLOCK',best:'trivia'},
 {id:'match3',name:'PATCH MATCH',tag:'SWAP PARTS • MATCH 3',best:'match3'},
 {id:'breaker',name:'BURNOUT BREAKER',tag:'BOUNCE THE TIRE • BUST THE RACK',best:'breaker'},
 {id:'frogger',name:'BOULEVARD RUN',tag:'CROSS OCEAN BLVD ON BIKE WEEK',best:'frogger'},
 {id:'runner',name:'ROAD NEVER ENDS',tag:'ENDLESS THROTTLE • ONE MISTAKE',best:'runner'}
];
function thumb(c,id,x,y,s){
 c.save(); G.rrect(x,y,s,s,10); c.clip();
 c.fillStyle='#14121c'; c.fillRect(x,y,s,s);
 if(id==='trivia'){
  c.fillStyle='#2a2440'; c.fillRect(x,y,s,s);
  c.beginPath(); c.arc(x+s/2,y+s/2,s*.32,0,7); c.fillStyle='#f08a2a'; c.fill();
  G.txt('?',x+s/2,y+s/2-s*.2,s*.26,'#16100a','center',undefined,800);
 } else if(id==='match3'){
  const cols=['#c02030','#f07818','#2258c8','#2a9a4a'];
  for(let i=0;i<9;i++){ const cx=x+6+(i%3)*(s-12)/3, cy=y+6+Math.floor(i/3)*(s-12)/3, w=(s-12)/3-3;
   if(i===4){ c.drawImage(G.img.crest_sm,cx,cy,w,w*1.06); continue; }
   G.rrect(cx,cy,w,w,4); c.fillStyle=cols[i%4]; c.fill(); }
 } else if(id==='breaker'){
  const cols=['#ffd060','#2a6a4a','#8a5a2a','#8a5a2a'];
  for(let r=0;r<4;r++) for(let k=0;k<4;k++){ c.fillStyle=cols[r]; c.fillRect(x+4+k*(s-8)/4,y+6+r*8,(s-8)/4-2,6); }
  c.fillStyle='#c8ccd4'; c.fillRect(x+s/2-12,y+s-10,24,4);
  c.fillStyle='#15151c'; c.beginPath(); c.arc(x+s*.62,y+s*.62,4,0,7); c.fill(); c.strokeStyle='#9a9ea8'; c.lineWidth=1; c.stroke();
 } else if(id==='frogger'){
  c.fillStyle='#38383f'; c.fillRect(x,y+s*.2,s,s*.6);
  c.fillStyle='#d8d060'; for(let k=0;k<4;k++) c.fillRect(x+k*s/4+2,y+s/2-1,s/8,2);
  c.fillStyle='#b03030'; G.rrect(x+4,y+s*.26,s*.34,s*.16,3); c.fill();
  c.fillStyle='#3a68b0'; G.rrect(x+s*.55,y+s*.58,s*.34,s*.16,3); c.fill();
  c.fillStyle='#ffd060'; c.beginPath(); c.arc(x+s/2,y+s*.9,4,0,7); c.fill();
 } else {
  c.fillStyle='#1d3a28'; c.fillRect(x,y,s,s);
  c.fillStyle='#3c3c44'; c.beginPath(); c.moveTo(x+s*.42,y); c.lineTo(x+s*.58,y); c.lineTo(x+s*.9,y+s); c.lineTo(x+s*.1,y+s); c.closePath(); c.fill();
  c.fillStyle='#f07818'; G.rrect(x+s/2-4,y+s*.6,8,16,3); c.fill();
 }
 c.restore();
 G.rrect(x,y,s,s,10); c.strokeStyle='rgba(255,255,255,.14)'; c.lineWidth=1; c.stroke();
}
G.scenes.arcadeselect={
 enter(){ this.st={f:0}; },
 cards(){
  const VH=G.VH, top=52, gap=8, h=Math.min(74,(VH-top-12-gap*4)/5);
  return GAMES.map((g,i)=>Object.assign({},g,{x:8,y:top+i*(h+gap),w:254,h}));
 },
 update(){
  if(G.backHit()){ G.go(G.gamesBack()); return; }
  const id=G.navList(this.st,this.cards());
  if(id) G.go(id);
 },
 draw(c){
  const VH=G.VH;
  G.cover(G.img.bg_dining,0,0,VW,VH); G.dim(.84);
  G.topBar('ARCADE CABINET');
  const story=G.save.story===5&&!G.isInfo()?'trivia':null;
  this.cards().forEach((b,i)=>{
   const press=G.held(b.x,b.y,b.w,b.h), y=b.y+(press?1:0), glow=b.id===story;
   if(glow) G.glowFill(b.x,y,b.w,b.h,14);
   else { G.rrect(b.x,y,b.w,b.h,14); c.fillStyle=press?'rgba(56,48,66,.96)':'rgba(28,26,36,.95)'; c.fill(); c.strokeStyle=this.st.f===i&&G.kbMode?'#ffd060':'rgba(255,255,255,.12)'; c.lineWidth=this.st.f===i&&G.kbMode?2:1; c.stroke(); }
   const ts=b.h-14;
   thumb(c,b.id,b.x+7,y+7,ts);
   const tx=b.x+ts+16, dark=glow;
   G.txt(b.name,tx,y+b.h/2-17,8.5,dark?'#16100a':'#f4ede2','left',b.w-ts-30,800);
   G.txt(b.tag,tx,y+b.h/2-1,5.9,dark?'#3a1c06':'#9a8f80','left',b.w-ts-30,700);
   const best=G.save.best[b.best]||0;
   G.txt(glow?'STORY: PLAY NOW':(best?'BEST '+best.toLocaleString():'NOT PLAYED YET'),tx,y+b.h/2+12,6.2,dark?'#3a1c06':'#ffd060','left',b.w-ts-30,700);
   G.txt('›',b.x+b.w-12,y+b.h/2-10,14,dark?'#16100a':'#ffb060','center');
  });
 }
};

/* ============================ PATCH MATCH (match-3) ============================ */
const M3={W:7,H:8,CELL:36,TYPES:5,CREST:9};
G.scenes.match3={
 enter(){
  this.g=[]; this.state='tut'; this.moves=25; this.score=0; this.chain=1;
  this.cx=3; this.cy=3; this.sel=null; this.timer=0; this.flash=[]; this.swapG=-1;
  for(let y=0;y<M3.H;y++){ this.g[y]=[]; for(let x=0;x<M3.W;x++) this.g[y][x]=this.safeType(x,y); }
  this.pause=G.Pause({restart:['match3'],quit:['arcadeselect'],quitLabel:'QUIT TO ARCADE'});
  this.modal=K.tutModal('PATCH MATCH',['SWAP NEIGHBORING PARTS TO MATCH 3','TAP TWO TILES, OR SWIPE A TILE','MATCH 4+ TO MINT A CREST PIECE',['THE CREST IS THE TOP-RANKING PATCH','#ffd060',7.5]],'START • 25 MOVES');
  this.onModal=()=>{ this.state='idle'; };
  AUDIO.play('game');
 },
 X0(){ return (VW-M3.W*M3.CELL)/2; },
 Y0(){ return Math.max(96,Math.round((G.VH-M3.H*M3.CELL)/2)+8); },
 safeType(x,y){
  let t;
  do{ t=Math.floor(Math.random()*M3.TYPES); }
  while((x>=2&&this.g[y][x-1]===t&&this.g[y][x-2]===t)||(y>=2&&this.g[y-1][x]===t&&this.g[y-2][x]===t));
  return t;
 },
 findMatches(){
  const m=new Set();
  for(let y=0;y<M3.H;y++) for(let x=0;x<M3.W;x++){
   const t=this.g[y][x]; if(t==null||t===M3.CREST) continue;
   if(x<=M3.W-3&&this.g[y][x+1]===t&&this.g[y][x+2]===t){ let k=x; while(k<M3.W&&this.g[y][k]===t){ m.add(y*M3.W+k); k++; } }
   if(y<=M3.H-3&&this.g[y+1][x]===t&&this.g[y+2][x]===t){ let k=y; while(k<M3.H&&this.g[k][x]===t){ m.add(k*M3.W+x); k++; } }
  }
  return m;
 },
 hasMove(){
  for(let y=0;y<M3.H;y++) for(let x=0;x<M3.W;x++){
   if(this.g[y][x]===M3.CREST) return true;
   for(const[dx,dy] of [[1,0],[0,1]]){
    const nx=x+dx,ny=y+dy; if(nx>=M3.W||ny>=M3.H) continue;
    [this.g[y][x],this.g[ny][nx]]=[this.g[ny][nx],this.g[y][x]];
    const ok=this.findMatches().size>0;
    [this.g[y][x],this.g[ny][nx]]=[this.g[ny][nx],this.g[y][x]];
    if(ok) return true;
   }
  }
  return false;
 },
 trySwap(x1,y1,x2,y2){
  const a=this.g[y1][x1], b=this.g[y2][x2];
  if(a===M3.CREST||b===M3.CREST){ // crest bomb: clears every tile of the partner type
   this.moves--;
   const target=a===M3.CREST?b:a;
   let n=0;
   for(let y=0;y<M3.H;y++) for(let x=0;x<M3.W;x++)
    if(this.g[y][x]===target||this.g[y][x]===M3.CREST){ this.flash.push([x,y]); this.g[y][x]=null; n++; }
   this.score+=n*25; AUDIO.sfx('cheer');
   this.state='resolve'; this.timer=.3; this.chain=1;
   return;
  }
  [this.g[y1][x1],this.g[y2][x2]]=[b,a];
  const m=this.findMatches();
  if(m.size===0){ [this.g[y1][x1],this.g[y2][x2]]=[a,b]; AUDIO.sfx('buzzer'); this.nope=.3; this.nopeCells=[[x1,y1],[x2,y2]]; return; }
  this.moves--; this.chain=1;
  this.swapCell=[x2,y2];
  this.clearSet(m);
 },
 clearSet(m){
  const big=m.size>=4;
  for(const id of m){ const x=id%M3.W, y=(id-x)/M3.W; this.flash.push([x,y]); this.g[y][x]=null; }
  this.score+=m.size*15*this.chain;
  AUDIO.sfx(this.chain>1?'bigpoint':'point');
  if(this.chain>1) this.chainT=.8;
  if(big&&this.swapCell){ const[sx,sy]=this.swapCell; this.g[sy][sx]=M3.CREST; this.swapCell=null; G.toast('CREST PIECE! SWAP IT TO DETONATE','#ffd060'); }
  this.state='resolve'; this.timer=.28;
 },
 gravity(){
  for(let x=0;x<M3.W;x++){
   let write=M3.H-1;
   for(let y=M3.H-1;y>=0;y--) if(this.g[y][x]!=null){ this.g[write][x]=this.g[y][x]; if(write!==y) this.g[y][x]=null; write--; }
   for(let y=write;y>=0;y--) this.g[y][x]=Math.floor(Math.random()*M3.TYPES);
  }
 },
 cellAt(px,py){ const x=Math.floor((px-this.X0())/M3.CELL), y=Math.floor((py-this.Y0())/M3.CELL); return (x>=0&&x<M3.W&&y>=0&&y<M3.H)?[x,y]:null; },
 update(dt){
  if(this.nope>0) this.nope-=dt;
  if(this.chainT>0) this.chainT-=dt;
  if(K.gameFrame(this,'match3','arcadeselect')) return;
  if(this.state==='resolve'){
   this.timer-=dt;
   if(this.timer<=0){
    this.flash=[];
    this.gravity();
    const m=this.findMatches();
    if(m.size){ this.chain++; this.clearSet(m); }
    else {
     this.state='idle';
     if(this.moves<=0){ this.finish(); return; }
     if(!this.hasMove()){ G.toast('NO MOVES - RESHUFFLE','#80d8f0');
      for(let y=0;y<M3.H;y++) for(let x=0;x<M3.W;x++) this.g[y][x]=null;
      for(let y=0;y<M3.H;y++) for(let x=0;x<M3.W;x++) this.g[y][x]=this.safeType(x,y);
     }
    }
   }
   return;
  }
  // keyboard
  if(G.pressed.left&&this.cx>0){ this.cx--; AUDIO.sfx('tick'); }
  if(G.pressed.right&&this.cx<M3.W-1){ this.cx++; AUDIO.sfx('tick'); }
  if(G.pressed.up&&this.cy>0){ this.cy--; AUDIO.sfx('tick'); }
  if(G.pressed.down&&this.cy<M3.H-1){ this.cy++; AUDIO.sfx('tick'); }
  const pick=(x,y)=>{
   if(this.sel&&Math.abs(this.sel[0]-x)+Math.abs(this.sel[1]-y)===1){ this.trySwap(this.sel[0],this.sel[1],x,y); this.sel=null; this.swapG=G.gestureId; }
   else if(this.sel&&this.sel[0]===x&&this.sel[1]===y) this.sel=null;
   else { this.sel=[x,y]; this.cx=x; this.cy=y; AUDIO.sfx('blip'); }
  };
  if(G.ptr.click){ const cell=this.cellAt(G.ptr.x,G.ptr.y); if(cell) pick(cell[0],cell[1]); }
  if(G.swipe&&this.swapG!==G.gestureId&&this.state==='idle'){
   const cell=this.cellAt(G.swipe.x0,G.swipe.y0);
   if(cell){
    const s=G.swipe, horiz=Math.abs(s.dx)>Math.abs(s.dy);
    const nx=cell[0]+(horiz?Math.sign(s.dx):0), ny=cell[1]+(horiz?0:Math.sign(s.dy));
    if(nx>=0&&nx<M3.W&&ny>=0&&ny<M3.H){ this.sel=null; this.trySwap(cell[0],cell[1],nx,ny); }
   }
  }
  if(G.pressed.a) pick(this.cx,this.cy);
 },
 finish(){
  this.state='over';
  const pts=Math.round(this.score/8);
  G.award(pts,'PATCH MATCH');
  if(this.score>=5000) G.ach('match3');
  if(this.score>(G.save.best.match3||0)) G.save.best.match3=this.score;
  G.updateBoard();
  AUDIO.jingle(this.score>=3000?'win':'lose');
  const rank=this.score>=7000?'CHAPTER PRESIDENT':this.score>=5000?'ROAD CAPTAIN':this.score>=3000?'FULL MEMBER':'PROSPECT';
  this.modal=K.endModal({title:'OUT OF MOVES!',hub:'arcadeselect',hubLabel:'ARCADE',lines:[[this.score.toLocaleString(),'#ffd060',12],['RANK: '+rank,'#80d8f0',8],['+'+pts+' PTS','#80ffa0',8]]});
 },
 drawIcon(c,t,px,py,s){
  const cx=px+s/2, cy=py+s/2, k=s/36;
  c.save(); c.translate(cx,cy); c.scale(k,k);
  switch(t){
   case 0: // wheel
    c.fillStyle='#15151c'; c.beginPath(); c.arc(0,0,13,0,7); c.fill();
    c.fillStyle='#9a9ea8'; c.beginPath(); c.arc(0,0,7,0,7); c.fill();
    c.strokeStyle='#5a5e68'; c.lineWidth=1.6; for(let i=0;i<5;i++){ const a=i*Math.PI*2/5; c.beginPath(); c.moveTo(Math.cos(a)*2,Math.sin(a)*2); c.lineTo(Math.cos(a)*7,Math.sin(a)*7); c.stroke(); }
    c.fillStyle='#2a2e36'; c.beginPath(); c.arc(0,0,2.2,0,7); c.fill(); break;
   case 1: // flame
    c.fillStyle='#f07818'; c.beginPath(); c.moveTo(0,-13); c.quadraticCurveTo(11,0,7,8); c.quadraticCurveTo(0,15,-7,8); c.quadraticCurveTo(-11,0,0,-13); c.fill();
    c.fillStyle='#ffd060'; c.beginPath(); c.moveTo(0,-3); c.quadraticCurveTo(6,4,3,9); c.quadraticCurveTo(0,12,-3,9); c.quadraticCurveTo(-6,4,0,-3); c.fill(); break;
   case 2: // wrench
    c.rotate(-Math.PI/4); c.fillStyle='#c8ccd4'; G.rrect(-2.6,-2,5.2,16,2.5); c.fill();
    c.beginPath(); c.arc(0,-6,7,0,7); c.fill(); c.fillStyle='#262434'; c.fillRect(-2.5,-15,5,8); break;
   case 3: // piston
    c.fillStyle='#c8ccd4'; G.rrect(-8,-12,16,11,3); c.fill();
    c.fillStyle='#8a8e98'; c.fillRect(-2.5,-1,5,13); c.fillStyle='#55565e'; c.fillRect(-8,-8,16,2); c.fillRect(-8,-4.5,16,2);
    c.beginPath(); c.arc(0,12,3.5,0,7); c.fillStyle='#8a8e98'; c.fill(); break;
   case 4: // shield
    c.fillStyle='#d8b020'; c.beginPath(); c.moveTo(-10,-11); c.lineTo(10,-11); c.lineTo(10,0); c.quadraticCurveTo(10,9,0,13); c.quadraticCurveTo(-10,9,-10,0); c.closePath(); c.fill();
    c.fillStyle='#8a2a1a'; c.beginPath(); c.moveTo(-5,-6); c.lineTo(5,-6); c.lineTo(5,0); c.quadraticCurveTo(5,5,0,7); c.quadraticCurveTo(-5,5,-5,0); c.closePath(); c.fill(); break;
   case M3.CREST: c.drawImage(G.img.crest_sm,-14,-15,28,30); break;
  }
  c.restore();
 },
 draw(c){
  const VH=G.VH, X0=this.X0(), Y0=this.Y0(), C=M3.CELL;
  c.fillStyle='#17121d'; c.fillRect(0,0,VW,VH);
  for(let y=0;y<VH;y+=16){ c.fillStyle=(y/16|0)%2?'#1a1522':'#17121d'; c.fillRect(0,y,VW,8); }
  K.gameBar(c,'PATCH MATCH','MOVES '+this.moves);
  // stats row
  const sy=Y0-44;
  [['SCORE',this.score.toLocaleString(),'#ffd060'],['MOVES',String(this.moves),this.moves<=5?'#ff6a50':'#80ffa0'],['CHAIN','×'+this.chain,'#80d8f0']].forEach((r,i)=>{
   const x=8+i*86; G.rrect(x,sy,82,34,10); c.fillStyle='rgba(255,255,255,.06)'; c.fill();
   G.txt(r[0],x+41,sy+5,5.8,'#9a8f80','center',undefined,700); G.txt(r[1],x+41,sy+15,9.5,r[2],'center',76,800);
  });
  // board
  G.panel(X0-6,Y0-6,M3.W*C+12,M3.H*C+12,{border:'#6a5430'});
  for(let y=0;y<M3.H;y++) for(let x=0;x<M3.W;x++){
   const px=X0+x*C, py=Y0+y*C;
   G.rrect(px+1,py+1,C-2,C-2,7); c.fillStyle=(x+y)%2?'#25222f':'#211e2a'; c.fill();
   const t=this.g[y][x];
   if(t!=null) this.drawIcon(c,t,px,py,C);
  }
  for(const[x,y] of this.flash){ G.rrect(X0+x*C+1,Y0+y*C+1,C-2,C-2,7); c.fillStyle='rgba(255,220,120,.55)'; c.fill(); }
  if(this.nope>0&&this.nopeCells) for(const[x,y] of this.nopeCells){ G.rrect(X0+x*C+1,Y0+y*C+1,C-2,C-2,7); c.fillStyle='rgba(255,90,70,.35)'; c.fill(); }
  if(this.sel){ G.rrect(X0+this.sel[0]*C+1.5,Y0+this.sel[1]*C+1.5,C-3,C-3,7); c.strokeStyle='#80ffa0'; c.lineWidth=2.5; c.stroke(); }
  if(this.state==='idle'&&G.kbMode){ G.rrect(X0+this.cx*C+1.5,Y0+this.cy*C+1.5,C-3,C-3,7); c.strokeStyle='#ffd060'; c.lineWidth=2; c.stroke(); }
  if(this.chainT>0&&this.chain>1) G.txtO('CHAIN ×'+this.chain+'!',VW/2,Y0+M3.H*C/2-12,14,'#80d8f0','center');
  const by=Y0+M3.H*C+14;
  if(by+12<VH){
   c.drawImage(G.img.crest_sm,VW/2-74,by-2,14,15);
   G.txt('= TOP RANK • MATCH 4+ TO EARN IT',VW/2+8,by,6.3,'#cfc4b0','center',VW-60,700);
  }
  if(by+30<VH) G.txt('TAP TWO NEIGHBORS OR SWIPE A TILE',VW/2,by+18,6,'#8a7f70','center');
  if(this.modal) this.modal.draw(c);
  if(this.pause.open) this.pause.draw(c);
 }
};

/* ============================ BURNOUT BREAKER ============================ */
const BR={L:8,R:262,T:66};
G.scenes.breaker={
 enter(){
  this.state='tut'; this.level=1; this.lives=3; this.score=0;
  this.padW=56; this.padX=VW/2; this.wideT=0;
  this.buildLevel();
  this.pause=G.Pause({restart:['breaker'],quit:['arcadeselect'],quitLabel:'QUIT TO ARCADE'});
  this.modal=K.tutModal('BURNOUT BREAKER',['DRAG ANYWHERE TO SLIDE THE DRAG BAR','BOUNCE THE TIRE • BUST EVERY CRATE','CREST BRICKS ON TOP PAY 150',['TOP RANK, TOP ROW. ALWAYS.','#ffd060',7.5]],'LIGHT IT UP');
  this.onModal=()=>{ this.state='play'; this.launch(); AUDIO.sfx('rev'); };
  AUDIO.play('game');
 },
 padY(){ return G.VH-52; },
 buildLevel(){
  this.bricks=[];
  const L=this.level, cols=8, bw=29, gap=3, x0=(VW-(cols*bw+(cols-1)*gap))/2;
  for(let r=0;r<5;r++) for(let col=0;col<cols;col++){
   let t=0;
   if(r===0) t=3;                                   // crest row: top-ranking
   else if(L===1) t=r<3?1:(col%2?1:0);
   else if(L===2) t=(r+col)%2?1:2;
   else t=r<2?2:(col%3===1?0:1);
   if(t) this.bricks.push({x:x0+col*(bw+gap),y:BR.T+26+r*17,w:bw,h:14,t,hp:t===2?2:1});
  }
  this.ball=null; this.pows=[];
 },
 launch(){ this.ball={x:this.padX,y:this.padY()-8,vx:(Math.random()<.5?-1:1)*95,vy:-215,sp:1}; },
 update(dt){
  if(K.gameFrame(this,'breaker','arcadeselect')) return;
  const PY=this.padY();
  if(G.keys.left) this.padX-=260*dt;
  if(G.keys.right) this.padX+=260*dt;
  if(G.ptr.down&&G.ptr.y>50) this.padX+=(G.ptr.x-this.padX)*Math.min(1,dt*16);
  const hw=this.padW/2;
  this.padX=Math.max(BR.L+hw,Math.min(BR.R-hw,this.padX));
  if(this.wideT>0){ this.wideT-=dt; if(this.wideT<=0) this.padW=56; }
  for(const p of this.pows) p.y+=70*dt;
  this.pows=this.pows.filter(p=>{
   if(p.y>PY-6&&p.y<PY+12&&Math.abs(p.x-this.padX)<hw+8){
    AUDIO.sfx('pickup');
    if(p.k==='W'){ this.padW=86; this.wideT=10; G.toast('APE HANGERS! WIDE BAR','#80ffa0'); }
    else { this.lives++; G.toast('SPARE TIRE +1','#80ffa0'); }
    return false;
   }
   return p.y<G.VH;
  });
  if(!this.bricks.length){
   this.level++;
   if(this.level>3){ this.finish(true); return; }
   G.toast('RACK '+this.level+' - BURN IT DOWN','#80ffa0'); AUDIO.sfx('cheer');
   this.buildLevel();
  }
  const b=this.ball;
  if(!b){ if(G.pressed.a||G.ptr.click) this.launch(); return; }
  const n=3, h=dt/n;
  for(let i=0;i<n;i++){
   b.x+=b.vx*b.sp*h; b.y+=b.vy*b.sp*h;
   if(b.x<BR.L+5){ b.x=BR.L+5; b.vx=Math.abs(b.vx); AUDIO.sfx('tick'); }
   if(b.x>BR.R-5){ b.x=BR.R-5; b.vx=-Math.abs(b.vx); AUDIO.sfx('tick'); }
   if(b.y<BR.T+5){ b.y=BR.T+5; b.vy=Math.abs(b.vy); AUDIO.sfx('tick'); }
   if(b.vy>0&&b.y>PY-5&&b.y<PY+8&&Math.abs(b.x-this.padX)<hw+5){
    b.vy=-Math.abs(b.vy);
    b.vx=((b.x-this.padX)/hw)*170;
    b.sp=Math.min(1.8,b.sp+.02);
    AUDIO.sfx('board');
   }
   for(const br of this.bricks){
    if(br.dead) continue;
    if(b.x>br.x-5&&b.x<br.x+br.w+5&&b.y>br.y-5&&b.y<br.y+br.h+5){
     const fromSide=Math.min(Math.abs(b.x-br.x),Math.abs(b.x-(br.x+br.w)))<Math.min(Math.abs(b.y-br.y),Math.abs(b.y-(br.y+br.h)));
     if(fromSide) b.vx=-b.vx; else b.vy=-b.vy;
     br.hp--;
     if(br.hp<=0){
      br.dead=true;
      const pts=br.t===3?150:(br.t===2?50:20);
      this.score+=pts;
      AUDIO.sfx(br.t===3?'hole':'thud');
      if(br.t===3) G.toast('CREST BRICK +150','#ffd060');
      if(br.t===1&&Math.random()<.18) this.pows.push({x:br.x+br.w/2,y:br.y,k:Math.random()<.7?'W':'L'});
     } else AUDIO.sfx('tick');
     break;
    }
   }
  }
  this.bricks=this.bricks.filter(br=>!br.dead);
  if(b.y>G.VH+10){
   this.lives--; AUDIO.sfx('hurt'); this.ball=null;
   if(this.lives<=0) this.finish(false);
  }
 },
 finish(win){
  this.state='over'; this.win=win;
  const pts=Math.round(this.score/4)+(win?300:0);
  G.award(pts,'BURNOUT BREAKER');
  if(win) G.ach('breaker');
  if(this.score>(G.save.best.breaker||0)) G.save.best.breaker=this.score;
  G.updateBoard();
  AUDIO.jingle(win?'win':'lose');
  this.modal=K.endModal({title:win?'ALL RACKS CLEARED!':'OUT OF TIRES',titleCol:win?'#80ffa0':'#ff8a60',hub:'arcadeselect',hubLabel:'ARCADE',lines:[[this.score.toLocaleString(),'#ffd060',12],['+'+pts+' PTS','#80ffa0',8]]});
 },
 draw(c){
  const VH=G.VH, PY=this.padY();
  c.fillStyle='#14121c'; c.fillRect(0,0,VW,VH);
  G.rrect(BR.L-2,BR.T-2,BR.R-BR.L+4,VH-BR.T+10,10); c.fillStyle='#1c1926'; c.fill(); c.strokeStyle='rgba(240,120,24,.75)'; c.lineWidth=2; c.stroke();
  for(const br of this.bricks){
   if(br.t===3){ G.rrect(br.x,br.y,br.w,br.h,4); c.fillStyle='#2a2238'; c.fill(); c.strokeStyle='#ffd060'; c.lineWidth=1.2; c.stroke(); c.drawImage(G.img.crest_sm,br.x+br.w/2-7,br.y,13,14); }
   else if(br.t===2){ G.rrect(br.x,br.y,br.w,br.h,4); c.fillStyle=br.hp>1?'#2a7a50':'#1d4a34'; c.fill(); G.txt('66',br.x+br.w/2,br.y+2.5,6.3,'#e8e8f0','center',undefined,800); }
   else { G.rrect(br.x,br.y,br.w,br.h,3); c.fillStyle='#8a5a2a'; c.fill(); c.fillStyle='#6a4420'; c.fillRect(br.x+3,br.y+3,br.w-6,2); c.fillRect(br.x+3,br.y+9,br.w-6,2); }
  }
  for(const p of this.pows){ G.rrect(p.x-8,p.y-8,16,16,5); c.fillStyle=p.k==='W'?'#80ffa0':'#80d8f0'; c.fill(); G.txt(p.k,p.x,p.y-5,7.5,'#111','center',undefined,800); }
  const hw=this.padW/2;
  G.rrect(this.padX-hw,PY,this.padW,7,3.5); c.fillStyle='#c8ccd4'; c.fill();
  G.rrect(this.padX-hw,PY-2,9,11,3); c.fillStyle='#f07818'; c.fill(); G.rrect(this.padX+hw-9,PY-2,9,11,3); c.fill();
  if(this.ball){ c.fillStyle='#15151c'; c.beginPath(); c.arc(this.ball.x,this.ball.y,5.5,0,7); c.fill(); c.strokeStyle='#9a9ea8'; c.lineWidth=1.5; c.beginPath(); c.arc(this.ball.x,this.ball.y,2.6,0,7); c.stroke(); }
  else if(this.state==='play') G.txtO('TAP TO LAUNCH',VW/2,PY-60,9,'#80ffa0','center');
  K.gameBar(c,'BURNOUT BREAKER','RACK '+Math.min(3,this.level)+'/3');
  G.txt(this.score.toLocaleString()+' PTS',12,47,7.5,'#ffd060','left',undefined,800);
  for(let i=0;i<this.lives;i++){ c.fillStyle='#15151c'; c.beginPath(); c.arc(VW-16-i*16,54,6,0,7); c.fill(); c.strokeStyle='#9a9ea8'; c.lineWidth=1.5; c.beginPath(); c.arc(VW-16-i*16,54,2.6,0,7); c.stroke(); }
  if(this.modal) this.modal.draw(c);
  if(this.pause.open) this.pause.draw(c);
 }
};

/* ============================ BOULEVARD RUN (frogger) ============================ */
const FR={COLS:11,CW:24,X0:3,Y0:64};
G.scenes.frogger={
 enter(){
  this.state='tut'; this.lives=3; this.score=0; this.home=[];
  this.doors=[1,3,5,7,9]; this.crestDoor=this.doors[Math.floor(Math.random()*5)];
  this.timer=25;
  this.lanes=[
   {r:2,dir:1,sp:57,kind:'bike',gap:96},
   {r:3,dir:-1,sp:72,kind:'bike',gap:110},
   {r:4,dir:1,sp:48,kind:'bike',gap:90},
   {r:6,dir:-1,sp:33,kind:'car',gap:92},
   {r:7,dir:1,sp:26,kind:'truck',gap:124},
   {r:8,dir:-1,sp:40,kind:'car',gap:86},
   {r:9,dir:1,sp:30,kind:'car',gap:100}
  ];
  for(const l of this.lanes){
   l.cars=[]; let x=-40;
   while(x<VW+80){ l.cars.push({x:x+Math.random()*24,col:['#b03030','#3a68b0','#c8c8d0','#d8a030','#2a9a4a'][Math.floor(Math.random()*5)]}); x+=l.gap; }
   l.w=l.kind==='truck'?50:(l.kind==='car'?32:20);
  }
  this.reset();
  this.pause=G.Pause({restart:['frogger'],quit:['arcadeselect'],quitLabel:'QUIT TO ARCADE'});
  this.modal=K.tutModal('BOULEVARD RUN',['BIKE WEEK ON OCEAN BLVD. CROSS IT.','STEP WITH THE PAD, A SWIPE, OR ARROWS','GET 4 RIDERS TO THE CLUBHOUSE DOORS',['THE CREST DOOR PAYS DOUBLE','#ffd060',7.5]],'WALK IT');
  this.onModal=()=>{ this.state='play'; };
  AUDIO.play('game');
 },
 RH(){ return Math.max(21,Math.min(34,Math.floor((G.VH-FR.Y0-108)/12))); },
 reset(){ this.px=5; this.py=11; this.timer=25; },
 rowY(r){ return FR.Y0+r*this.RH(); },
 pad(){
  const VH=G.VH, y=VH-98;
  return {up:{x:78,y,w:114,h:46},left:{x:8,y,w:64,h:92},right:{x:198,y,w:64,h:92},down:{x:78,y:y+52,w:114,h:40}};
 },
 update(dt){
  if(K.gameFrame(this,'frogger','arcadeselect')) return;
  for(const l of this.lanes) for(const car of l.cars){
   car.x+=l.dir*l.sp*dt;
   if(l.dir>0&&car.x>VW+40) car.x-=VW+80;
   if(l.dir<0&&car.x<-40) car.x+=VW+80;
  }
  this.timer-=dt;
  if(this.timer<=0){ this.die('TIME! THE LIGHT CHANGED.'); return; }
  let mx=0,my=0;
  if(G.pressed.left) mx=-1; if(G.pressed.right) mx=1;
  if(G.pressed.up) my=-1; if(G.pressed.down) my=1;
  const P=this.pad();
  if(G.clicked(P.up.x,P.up.y,P.up.w,P.up.h)) my=-1;
  else if(G.clicked(P.down.x,P.down.y,P.down.w,P.down.h)) my=1;
  else if(G.clicked(P.left.x,P.left.y,P.left.w,P.left.h)) mx=-1;
  else if(G.clicked(P.right.x,P.right.y,P.right.w,P.right.h)) mx=1;
  if(G.swipe&&G.swipe.y0<P.up.y-6){ if(Math.abs(G.swipe.dx)>Math.abs(G.swipe.dy)) mx=Math.sign(G.swipe.dx); else my=Math.sign(G.swipe.dy); }
  else if(G.tapped(0,FR.Y0,VW,P.up.y-6-FR.Y0)){
   const dx=G.ptr.rsx-(FR.X0+this.px*FR.CW+FR.CW/2), dy=G.ptr.rsy-(this.rowY(this.py)+this.RH()/2);
   if(Math.abs(dx)>Math.abs(dy)) mx=dx>0?1:-1; else my=dy>0?1:-1;
  }
  if(mx||my){
   const nx=this.px+mx, ny=this.py+my;
   if(nx>=0&&nx<FR.COLS&&ny>=0&&ny<=11){
    if(ny===0){
     if(this.doors.includes(nx)&&!this.home.includes(nx)){
      this.home.push(nx);
      const bonus=nx===this.crestDoor?300:150;
      this.score+=bonus; AUDIO.sfx('cheer');
      G.toast(nx===this.crestDoor?'CREST DOOR +300':'RIDER HOME +150','#80ffa0');
      if(this.home.length>=4){ this.finish(true); return; }
      this.reset();
     } else AUDIO.sfx('buzzer');
    } else {
     this.px=nx; this.py=ny;
     if(my<0) this.score+=5;
     AUDIO.sfx('tick');
    }
   }
  }
  const lane=this.lanes.find(l=>l.r===this.py);
  if(lane){
   const x=FR.X0+this.px*FR.CW+FR.CW/2;
   for(const car of lane.cars)
    if(x>car.x-lane.w/2-7&&x<car.x+lane.w/2+7){ this.die(G.T({g:'FLATTENED! Kevin dragged you back to the curb.',f:'So close! Kevin pulled you back to the curb.'})); return; }
  }
 },
 die(msg){
  this.lives--; AUDIO.sfx('crash'); G.shake=5;
  G.toast(msg,'#ff7030');
  if(this.lives<=0){ this.finish(false); return; }
  this.reset();
 },
 finish(win){
  this.state='over'; this.win=win;
  const pts=this.score+(win?250:0);
  G.award(Math.round(pts/2),'BOULEVARD RUN');
  if(win) G.ach('frogger');
  if(this.score>(G.save.best.frogger||0)) G.save.best.frogger=this.score;
  G.updateBoard();
  AUDIO.jingle(win?'win':'lose');
  this.modal=K.endModal({title:win?'EVERYBODY’S HOME!':'ROUGH CROSSING',titleCol:win?'#80ffa0':'#ff8a60',hub:'arcadeselect',hubLabel:'ARCADE',lines:[[this.score.toLocaleString(),'#ffd060',12],['RIDERS HOME '+this.home.length+'/4','#cfc4b0',8],['+'+Math.round(pts/2)+' PTS','#80ffa0',8]]});
 },
 draw(c){
  const VH=G.VH, RH=this.RH(), dude={shirt:'#3a2410',vest:'#191921',skin:'#dca878',trim:'#f07818'};
  c.fillStyle='#14121c'; c.fillRect(0,0,VW,VH);
  const ry=r=>this.rowY(r);
  c.fillStyle='#2b1d12'; c.fillRect(0,ry(0)-8,VW,RH+8);
  for(const d of this.doors){ const x=FR.X0+d*FR.CW; c.fillStyle='#55381e'; G.rrect(x-3,ry(0)-5,FR.CW+6,RH+3,4); c.fill(); c.fillStyle=this.home.includes(d)?'#3a5a3a':'#1e1208'; G.rrect(x,ry(0)-2,FR.CW,RH,3); c.fill(); }
  c.drawImage(G.img.crest_sm,FR.X0+this.crestDoor*FR.CW+FR.CW/2-9,ry(0)-12,18,19);
  c.fillStyle='#6a5a40'; c.fillRect(0,ry(1),VW,RH);
  c.fillStyle='rgba(0,0,0,.15)'; for(let x=0;x<VW;x+=12) c.fillRect(x,ry(1),1,RH);
  c.fillStyle='#3c3c44'; c.fillRect(0,ry(2),VW,RH*3);
  c.fillStyle='#2a5a3a'; c.fillRect(0,ry(5),VW,RH);
  c.fillStyle='#38383f'; c.fillRect(0,ry(6),VW,RH*4);
  c.fillStyle='#8a8a7a'; c.fillRect(0,ry(10),VW,RH*2);
  c.fillStyle='#d8d060';
  for(const r of [3,4,7,8,9]) for(let x=0;x<VW;x+=28) c.fillRect(x,ry(r)-1,14,2);
  for(const h of this.home){ G.scenes.club.drawDude(c,FR.X0+h*FR.CW+FR.CW/2,ry(0)+3,dude,1,0,null,G.save.avatar); }
  for(const l of this.lanes){
   const y=ry(l.r), mid=y+RH/2;
   for(const car of l.cars){
    if(l.kind==='bike'){
     c.fillStyle='#15151c'; c.beginPath(); c.arc(car.x-7,mid+4,3.5,0,7); c.arc(car.x+7,mid+4,3.5,0,7); c.fill();
     c.fillStyle=car.col; G.rrect(car.x-9,mid-2,18,6,3); c.fill();
     c.fillStyle='#23232d'; c.beginPath(); c.arc(car.x-1,mid-5,3.5,0,7); c.fill();
    } else {
     const w=l.w, hh=RH-8;
     c.fillStyle='rgba(0,0,0,.3)'; G.rrect(car.x-w/2+1,mid-hh/2+2,w,hh,4); c.fill();
     c.fillStyle=l.kind==='truck'?'#d0d0d8':car.col; G.rrect(car.x-w/2,mid-hh/2,w,hh,4); c.fill();
     c.fillStyle='rgba(18,28,44,.85)'; const wx=l.dir>0?car.x+w/2-11:car.x-w/2+4; G.rrect(wx,mid-hh/2+2,7,hh-4,2); c.fill();
     c.fillStyle='#ffeaa8'; c.fillRect(l.dir>0?car.x+w/2-2:car.x-w/2,mid-hh/2+2,2,3); c.fillRect(l.dir>0?car.x+w/2-2:car.x-w/2,mid+hh/2-5,2,3);
    }
   }
  }
  G.scenes.club.drawDude(c,FR.X0+this.px*FR.CW+FR.CW/2,ry(this.py)+3,dude,1,0,null,G.save.avatar);
  K.gameBar(c,'BOULEVARD RUN','HOME '+this.home.length+'/4');
  G.rrect(46,36,VW-52,4,2); c.fillStyle='rgba(255,255,255,.1)'; c.fill();
  G.rrect(46,36,(VW-52)*Math.max(0,this.timer)/25,4,2); c.fillStyle=this.timer<6?'#ff6a50':'#80ffa0'; c.fill();
  G.txt(this.score.toLocaleString()+' PTS',12,45,6.5,'#ffd060','left',undefined,800);
  G.hearts(VW-48,45,this.lives,3,9);
  // D-pad
  const P=this.pad();
  c.fillStyle='rgba(11,10,16,.96)'; c.fillRect(0,P.up.y-6,VW,VH-P.up.y+6);
  const pb=(r,label)=>{ const on=G.held(r.x,r.y,r.w,r.h), y=r.y+(on?1:0);
   G.rrect(r.x,y,r.w,r.h,14); c.fillStyle=on?'#ffa648':'#262434'; c.fill(); c.strokeStyle='rgba(255,255,255,.14)'; c.lineWidth=1.2; c.stroke();
   G.txt(label,r.x+r.w/2,y+r.h/2-9,13,on?'#16100a':'#ffb060','center',r.w-6,800); };
  pb(P.up,'▲'); pb(P.down,'▼'); pb(P.left,'◀'); pb(P.right,'▶');
  if(this.modal) this.modal.draw(c);
  if(this.pause.open) this.pause.draw(c);
 }
};

/* ============================ ROAD NEVER ENDS (endless runner) ============================ */
const RN={LANES:[85,135,185]};
G.scenes.runner={
 enter(){
  this.state='tut';
  this.lane=1; this.x=RN.LANES[1]; this.speed=150; this.dist=0;
  this.air=0; this.slideT=0; this.coins=0; this.crests=0;
  this.obs=[]; this.nextAt=120; this.t=0;
  this.pause=G.Pause({restart:['runner'],quit:['arcadeselect'],quitLabel:'QUIT TO ARCADE'});
  this.modal=K.tutModal('ROAD NEVER ENDS',['ENDLESS THROTTLE. ONE MISTAKE.','◀ ▶ OR SWIPE TO CHANGE LANES','JUMP BARRIERS • DODGE CARS • SKIP OIL',['CREST TOKENS ARE TOP RANK: +100','#ffd060',7.5]],'THROTTLE UP');
  this.onModal=()=>{ this.state='play'; AUDIO.sfx('rev'); AUDIO.engineStart(); };
  AUDIO.play('ride');
 },
 exit(){ AUDIO.engineStop(); },
 PY(){ return G.VH-150; },
 btns(){ const VH=G.VH, y=VH-66; return {left:{x:8,y,w:76,h:56},jump:{x:90,y,w:90,h:56},right:{x:186,y,w:76,h:56}}; },
 spawn(){
  const lane=Math.floor(Math.random()*3), r=Math.random();
  if(r<.3) this.obs.push({k:'bar',lane,y:-30});
  else if(r<.52) this.obs.push({k:'car',lane,y:-40,sp:this.speed*.45});
  else if(r<.64) this.obs.push({k:'oil',lane,y:-30});
  else if(r<.7) this.obs.push({k:'crest',lane,y:-30});
  else { for(let i=0;i<4;i++) this.obs.push({k:'coin',lane,y:-30-i*30}); }
  this.nextAt=100+Math.random()*130-Math.min(60,this.speed*.1);
 },
 update(dt){
  if(K.gameFrame(this,'runner','arcadeselect')){ if(this.pause.open) AUDIO.engineSet(0); return; }
  this.t+=dt;
  this.speed=Math.min(430,150+this.t*6.5);
  AUDIO.engineSet(Math.min(1,(this.speed-120)/320));
  this.dist+=this.speed*dt*.12;
  if(this.slideT>0) this.slideT-=dt;
  let lx=0, jump=false;
  if(G.pressed.left) lx=-1;
  if(G.pressed.right) lx=1;
  if(G.pressed.up||G.pressed.a) jump=true;
  const B=this.btns();
  if(G.clicked(B.left.x,B.left.y,B.left.w,B.left.h)) lx=-1;
  if(G.clicked(B.right.x,B.right.y,B.right.w,B.right.h)) lx=1;
  if(G.clicked(B.jump.x,B.jump.y,B.jump.w,B.jump.h)) jump=true;
  if(G.swipe&&G.swipe.y0<B.left.y-6){ if(Math.abs(G.swipe.dx)>Math.abs(G.swipe.dy)) lx=Math.sign(G.swipe.dx); else if(G.swipe.dy<0) jump=true; }
  this.lBtn=Math.max(0,(this.lBtn||0)-dt); this.rBtn=Math.max(0,(this.rBtn||0)-dt); this.jBtn=Math.max(0,(this.jBtn||0)-dt);
  if(lx&&this.slideT<=0){ this.lane=Math.max(0,Math.min(2,this.lane+lx)); AUDIO.sfx('blip'); if(lx<0) this.lBtn=.15; else this.rBtn=.15; }
  if(jump&&this.air<=0){ this.air=.55; this.jBtn=.15; AUDIO.sfx('swish'); }
  if(this.air>0) this.air-=dt;
  this.x+=(RN.LANES[this.lane]-this.x)*Math.min(1,dt*12);
  this.nextAt-=this.speed*dt;
  if(this.nextAt<=0) this.spawn();
  for(const o of this.obs) o.y+=(this.speed-(o.sp||0))*dt;
  const py=this.PY();
  for(const o of this.obs){
   if(o.dead||o.lane!==this.lane) continue;
   if(o.y>py-18&&o.y<py+16){
    if(o.k==='coin'){ o.dead=true; this.coins++; AUDIO.sfx('pickup'); }
    else if(o.k==='crest'){ o.dead=true; this.crests++; AUDIO.sfx('hole'); G.toast('CREST TOKEN +100','#ffd060'); }
    else if(o.k==='oil'){ if(this.air<=0&&!o.hit){ o.hit=true; this.slideT=.6; G.shake=3; AUDIO.sfx('swish'); G.toast('OIL! HOLD ON','#b0a0ff'); } }
    else if(o.k==='bar'){ if(this.air<=0){ this.crash(); return; } }
    else if(o.k==='car'){ this.crash(); return; }
   }
  }
  this.obs=this.obs.filter(o=>!o.dead&&o.y<G.VH+60);
 },
 crash(){
  AUDIO.sfx('crash'); G.shake=7; AUDIO.engineStop();
  this.state='over';
  const sc=Math.round(this.dist)+this.coins*10+this.crests*100;
  this.finalScore=sc;
  const pts=Math.round(this.dist/4)+this.coins*5+this.crests*50;
  G.award(pts,'ROAD NEVER ENDS');
  if(this.dist>=2000) G.ach('runner');
  if(sc>(G.save.best.runner||0)) G.save.best.runner=sc;
  G.updateBoard();
  AUDIO.jingle(this.dist>=800?'win':'lose');
  this.modal=K.endModal({title:'THE ROAD WON. TODAY.',titleCol:'#ff8a60',hub:'arcadeselect',hubLabel:'ARCADE',
   lines:[[Math.round(this.dist).toLocaleString()+' YARDS','#80ffa0',11],['PISTONS '+this.coins+' • CRESTS '+this.crests,'#cfc4b0',7.5],['SCORE '+sc.toLocaleString()+' • +'+pts+' PTS','#ffd060',7.5]]});
 },
 draw(c){
  const VH=G.VH, t=this.dist*8, py=this.PY();
  c.fillStyle='#1d3a28'; c.fillRect(0,0,VW,VH);
  c.fillStyle='#17301f';
  for(let y=-40+(t%80);y<VH;y+=80){ c.beginPath(); c.arc(28,y,14,0,7); c.fill(); c.beginPath(); c.arc(VW-28,y+40,14,0,7); c.fill(); }
  c.fillStyle='#d8c890'; c.fillRect(54,0,6,VH); c.fillRect(210,0,6,VH);
  c.fillStyle='#3c3c44'; c.fillRect(60,0,150,VH);
  c.fillStyle='#d8d060';
  for(let y=-20+(t%44);y<VH;y+=44){ c.fillRect(108,y,3,20); c.fillRect(159,y,3,20); }
  for(const o of this.obs){
   const x=RN.LANES[o.lane];
   if(o.k==='coin'){ c.fillStyle='#c8ccd4'; G.rrect(x-6,o.y-8,12,8,2); c.fill(); c.fillStyle='#8a8e98'; c.fillRect(x-2,o.y,4,7); }
   else if(o.k==='crest'){ if(!G.rm()){ c.fillStyle='rgba(255,220,120,'+(.25+.2*Math.sin(G.time*6))+')'; c.beginPath(); c.arc(x,o.y,15,0,7); c.fill(); } c.drawImage(G.img.crest_sm,x-11,o.y-12,22,23); }
   else if(o.k==='bar'){ G.rrect(x-22,o.y-5,44,10,3); c.fillStyle='#f07818'; c.fill(); c.fillStyle='#fff'; c.fillRect(x-22,o.y-5,8,10); c.fillRect(x-4,o.y-5,8,10); c.fillRect(x+14,o.y-5,8,10); }
   else if(o.k==='oil'){ c.fillStyle='#121219'; c.beginPath(); c.ellipse(x,o.y,16,8,0,0,7); c.fill(); c.strokeStyle='rgba(140,120,255,.5)'; c.lineWidth=1.4; c.beginPath(); c.ellipse(x-2,o.y-1,9,4,0,3.4,5.8); c.stroke(); }
   else if(o.k==='car'){
    c.fillStyle='rgba(0,0,0,.3)'; G.rrect(x-14,o.y-20,30,44,6); c.fill();
    G.rrect(x-15,o.y-22,30,44,6); c.fillStyle='#b03040'; c.fill();
    c.fillStyle='rgba(18,28,44,.88)'; G.rrect(x-11,o.y+8,22,8,2); c.fill(); G.rrect(x-11,o.y-14,22,6,2); c.fill();
    c.fillStyle='#ff3a3a'; c.fillRect(x-13,o.y-22,5,2); c.fillRect(x+8,o.y-22,5,2);
   }
  }
  // player (top-down, avatar colors)
  const av=G.save.avatar, lift=this.air>0?Math.sin(Math.PI*(1-this.air/.55))*12:0;
  const wob=this.slideT>0&&!G.rm()?Math.sin(G.time*30)*3:0;
  c.fillStyle='rgba(0,0,0,.35)'; c.beginPath(); c.ellipse(this.x+2,py+4,10,18,0,0,7); c.fill();
  const x=this.x+wob, y=py-lift, sc=1+lift/40;
  AV.top(c,x,y,av,sc,{noShadow:true});
  K.gameBar(c,null);
  G.txt(Math.round(this.dist).toLocaleString()+' YD',VW/2,8,11,'#80ffa0','center',undefined,800);
  G.txt('PISTONS '+this.coins,VW-10,8,6.5,'#c8ccd4','right',undefined,700);
  c.drawImage(G.img.crest_sm,VW-46,20,11,12); G.txt('×'+this.crests,VW-10,22,6.5,'#ffd060','right',undefined,700);
  // controls
  const B=this.btns();
  c.fillStyle='rgba(11,10,16,.94)'; c.fillRect(0,B.left.y-8,VW,VH-B.left.y+8);
  const pb=(r,label,on,col)=>{ const y=r.y+(on?1:0);
   G.rrect(r.x,y,r.w,r.h,14); c.fillStyle=on?col:'#262434'; c.fill(); c.strokeStyle='rgba(255,255,255,.14)'; c.lineWidth=1.2; c.stroke();
   G.txt(label,r.x+r.w/2,y+r.h/2-(label.length>2?6.5:9),label.length>2?10:14,on?'#16100a':'#ffb060','center',r.w-6,800); };
  pb(B.left,'◀',this.lBtn>0||G.held(B.left.x,B.left.y,B.left.w,B.left.h),'#ffa648');
  pb(B.jump,'JUMP',this.jBtn>0||G.held(B.jump.x,B.jump.y,B.jump.w,B.jump.h),'#8affaa');
  pb(B.right,'▶',this.rBtn>0||G.held(B.right.x,B.right.y,B.right.w,B.right.h),'#ffa648');
  if(this.modal) this.modal.draw(c);
  if(this.pause.open) this.pause.draw(c);
 }
};
})();
