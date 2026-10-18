/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* CARGO STACK (the Game Room arcade): a falling-block puzzle in a cargo hold. Fill a row edge to edge to load it
   (it clears). The BALANCE needle shows whether the load leans left or right; clearing rows while the load is balanced
   scores a bonus, the way pilots keep weight balanced (Ground School: Weight + Performance).
   Controls: the arrow buttons (or swipe): move, turn, drop. */
(function(){
const H=G.HFQ, C=G.C, VW=G.VW, PI=Math.PI, MG=G.MG;
const COLS=10, ROWS=18;
const SHAPES={I:[[0,1],[1,1],[2,1],[3,1]],O:[[1,0],[2,0],[1,1],[2,1]],T:[[1,0],[0,1],[1,1],[2,1]],S:[[1,0],[2,0],[0,1],[1,1]],Z:[[0,0],[1,0],[1,1],[2,1]],J:[[0,0],[0,1],[1,1],[2,1]],L:[[2,0],[0,1],[1,1],[2,1]]};
const TINT={I:'#5b9bff',O:'#ffc21a',T:'#b0287f',S:'#3fdc7c',Z:'#ff4a3d',J:'#2f6fb5',L:'#e07a1a'};
const KEYS=Object.keys(SHAPES);
G.scenes.g_cargo={
 enter(a){ MG.start(this,'cargo',a); this.grid=[...Array(ROWS)].map(()=>Array(COLS).fill(null)); this.score=0; this.lines=0; this.level=1; this.bag=[]; this.fallT=0; this.spawn(); this.nextK=this.draw1(); this.dead=false; this.flash=null; this.rep={}; },
 draw1(){ if(!this.bag.length) this.bag=[...KEYS].sort(()=>Math.random()-.5); return this.bag.pop(); },
 spawn(){ const k=this.nextK||this.draw1(); this.nextK=this.draw1(); this.p={k,cells:SHAPES[k].map(c=>[...c]),x:3,y:0};
  if(this.hits(this.p.cells,this.p.x,this.p.y)){ this.dead=true; MG.end(this,this.score,{head:'HOLD IS FULL',line:this.lines+' rows loaded • level '+this.level+'.'}); } },
 hits(cells,x,y){ return cells.some(([cx,cy])=>{ const gx=x+cx, gy=y+cy; return gx<0||gx>=COLS||gy>=ROWS||(gy>=0&&this.grid[gy][gx]); }); },
 rot(){ const p=this.p; if(p.k==='O') return; const r=p.cells.map(([x,y])=>[2-y,x]); for(const kick of [0,-1,1,-2,2]) if(!this.hits(r,p.x+kick,p.y)){ p.cells=r; p.x+=kick; AUDIO.sfx('rotate'); return; } },
 move(dx){ if(!this.hits(this.p.cells,this.p.x+dx,this.p.y)){ this.p.x+=dx; AUDIO.sfx('tick'); } },
 step(){ const p=this.p; if(!this.hits(p.cells,p.x,p.y+1)){ p.y++; return true; } this.lock(); return false; },
 drop(){ let n=0; while(!this.hits(this.p.cells,this.p.x,this.p.y+1)){ this.p.y++; n++; } this.score+=n*2; this.lock(); },
 balance(){ let m=0, w=0; for(let y=0;y<ROWS;y++) for(let x=0;x<COLS;x++) if(this.grid[y][x]){ m+=x-(COLS-1)/2; w++; } return w?m/w/((COLS-1)/2):0; },
 lock(){ const p=this.p; for(const [cx,cy] of p.cells){ const gy=p.y+cy; if(gy>=0) this.grid[gy][p.x+cx]=TINT[p.k]; } AUDIO.sfx('drop');
  const full=[]; for(let y=0;y<ROWS;y++) if(this.grid[y].every(v=>v)) full.push(y);
  if(full.length){ const bal=Math.abs(this.balance())<.12; full.forEach(y=>{ this.grid.splice(y,1); this.grid.unshift(Array(COLS).fill(null)); });
   const pts=[0,100,300,500,800][full.length]*this.level+(bal?50*full.length:0); this.score+=pts; this.lines+=full.length;
   this.flash={t:1,txt:(full.length>1?full.length+' ROWS LOADED':'ROW LOADED')+' +'+pts+(bal?' • BALANCED!':'')}; AUDIO.sfx(full.length>1?'line':'line');
   const lv=1+Math.floor(this.lines/8); if(lv>this.level){ this.level=lv; G.toast('LEVEL '+lv+': FASTER LOADING',C.info); } }
  this.spawn(); },
 btns(){ const VH=G.VH, y=VH-52, w=(VW-24-18)/4; return ['left','rot','right','drop'].map((id,i)=>({id,x:12+i*(w+6),y,w,h:44})); },
 update(dt){
  if(MG.update(this,dt)||this.dead) return;
  if(this.flash) this.flash.t-=dt;
  for(const b of this.btns()){ if(G.clicked(b.x,b.y,b.w,b.h)){ this.act(b.id); this.rep[b.id]=-.25; } else if(G.held(b.x,b.y,b.w,b.h)&&(b.id==='left'||b.id==='right')){ this.rep[b.id]=(this.rep[b.id]||0)+dt; if(this.rep[b.id]>.09){ this.rep[b.id]=0; this.act(b.id); } } }
  if(G.pressed.left) this.act('left'); if(G.pressed.right) this.act('right'); if(G.pressed.up) this.act('rot'); if(G.pressed.down||G.pressed.a) this.act('drop');
  if(G.swipe&&G.swipe.dy>40&&Math.abs(G.swipe.dy)>Math.abs(G.swipe.dx)) this.act('drop');
  this.fallT+=dt; const every=Math.max(.08,.75-this.level*.07);
  if(this.fallT>every){ this.fallT=0; this.step(); }
 },
 act(id){ if(id==='left') this.move(-1); else if(id==='right') this.move(1); else if(id==='rot') this.rot(); else if(id==='drop') this.drop(); },
 draw(c){
  const VH=G.VH, cs=Math.floor(Math.min((VW-90)/COLS,(VH-58-70)/ROWS)), gw=cs*COLS, gh=cs*ROWS, gx=14, gy=52;
  const bg=c.createLinearGradient(0,42,0,VH); bg.addColorStop(0,'#1b2738'); bg.addColorStop(1,'#0e1420'); c.fillStyle=bg; c.fillRect(0,42,VW,VH-42); MG.spot(c,VW*.35,80,180,90,.12,'120,180,255');
  // the cargo hold: a fuselage cross-section around the grid
  c.strokeStyle='#8d96a2'; c.lineWidth=3; c.beginPath(); c.moveTo(gx-6,gy+gh+4); c.lineTo(gx-6,gy+20); c.quadraticCurveTo(gx-6,gy-6,gx+gw/2,gy-6); c.quadraticCurveTo(gx+gw+6,gy-6,gx+gw+6,gy+20); c.lineTo(gx+gw+6,gy+gh+4); c.stroke();
  c.fillStyle='#0d131c'; c.fillRect(gx,gy,gw,gh); c.fillStyle='rgba(255,255,255,.03)'; for(let x=0;x<=COLS;x++) c.fillRect(gx+x*cs,gy,1,gh); for(let y=0;y<=ROWS;y++) c.fillRect(gx,gy+y*cs,gw,1);
  const crate=(x,y,col,ghost)=>{ const px=gx+x*cs, py=gy+y*cs; if(ghost){ c.strokeStyle=G.rgba(col,.5); c.lineWidth=1; c.strokeRect(px+1.5,py+1.5,cs-3,cs-3); return; }
   MG.block(c,px+1,py+1,cs-2,cs-2,col);
   c.strokeStyle='rgba(0,0,0,.28)'; c.lineWidth=.8; c.beginPath(); c.moveTo(px+3,py+3); c.lineTo(px+cs-3,py+cs-3); c.moveTo(px+cs-3,py+3); c.lineTo(px+3,py+cs-3); c.stroke(); };
  for(let y=0;y<ROWS;y++) for(let x=0;x<COLS;x++) if(this.grid[y][x]) crate(x,y,this.grid[y][x]);
  const p=this.p; if(p&&!this.dead){ let gy2=p.y; while(!this.hits(p.cells,p.x,gy2+1)) gy2++; for(const [cx,cy] of p.cells) crate(p.x+cx,gy2+cy,TINT[p.k],true); for(const [cx,cy] of p.cells) if(p.y+cy>=0) crate(p.x+cx,p.y+cy,TINT[p.k]); }
  // side panel: next, rows, level, balance needle
  const sx=gx+gw+16, sw=VW-sx-10;
  G.txt('NEXT',sx+sw/2,gy+2,5.6,C.dim,'center',undefined,800);
  if(this.nextK){ const ns=Math.min(10,sw/4.5); for(const [cx,cy] of SHAPES[this.nextK]){ c.fillStyle=TINT[this.nextK]; c.fillRect(sx+sw/2-2*ns+cx*ns,gy+16+cy*ns,ns-1,ns-1); } }
  G.txt('ROWS',sx+sw/2,gy+50,5.6,C.dim,'center',undefined,800); G.txt(String(this.lines),sx+sw/2,gy+60,10,C.ink,'center',undefined,800);
  G.txt('LEVEL',sx+sw/2,gy+82,5.6,C.dim,'center',undefined,800); G.txt(String(this.level),sx+sw/2,gy+92,10,C.ink,'center',undefined,800);
  const bal=this.balance(), bx=sx+sw/2, by=gy+150; G.txt('BALANCE',bx,gy+114,5.6,C.dim,'center',undefined,800);
  c.strokeStyle='rgba(255,255,255,.25)'; c.lineWidth=2; c.beginPath(); c.arc(bx,by,sw/2-2,PI,0); c.stroke();
  c.strokeStyle=C.good; c.beginPath(); c.arc(bx,by,sw/2-2,-PI/2-.2,-PI/2+.2); c.stroke();
  const ang=-PI/2+Math.max(-1,Math.min(1,bal))*PI/2.2; c.strokeStyle=Math.abs(bal)<.12?C.good:C.warn; c.lineWidth=2.4; c.beginPath(); c.moveTo(bx,by); c.lineTo(bx+Math.cos(ang)*(sw/2-6),by+Math.sin(ang)*(sw/2-6)); c.stroke();
  G.txt(Math.abs(bal)<.12?'BALANCED':(bal<0?'LEFT HEAVY':'RIGHT HEAVY'),bx,by+6,4.6,Math.abs(bal)<.12?C.good:C.warn,'center',sw,800);
  // buttons
  const lab={left:'◀',rot:'⟳',right:'▶',drop:'▼'}; for(const b of this.btns()) G.button(Object.assign({},b,{label:lab[b.id],kind:b.id==='drop'?'primary':'secondary',size:12}),false);
  if(this.flash&&this.flash.t>0) G.txt(this.flash.txt,gx+gw/2,gy+gh/2-30,6.4,C.title,'center',gw,800);
  MG.hud(this,c,this.score+' PTS',{sub:'LOAD THE CARGO HOLD',tip:'Fill a row to load it. Clear rows while BALANCED for a bonus.'});
 }
};
})();
