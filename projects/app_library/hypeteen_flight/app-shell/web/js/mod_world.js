/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* WORLD MODULE: walkable places (the RK clubhouse room, generalized and data-driven).
   A rendition describes its places in G.WORLD (a js data file loaded BEFORE this one) - see FORMAT below.
   Drag on the floor for a thumb-stick, or tap the floor to walk there (A* steers around furniture); tap a station or a person to walk over and use it,
   arrow keys walk, ENTER uses what you're next to. Doors lead to other rooms. A tab bar at the bottom jumps
   between places; the BAG button opens the dashboard as a quick menu. Set CONFIG.homeScene:'world'.

   FORMAT
   G.WORLD = {
     start: 'lounge',                          // first room
     bag: true,                                // show the BAG (dashboard) button in the tab bar
     tabs: ['lounge', {id:'map',label:'MAP',icon:'map',scene:'map',home:true}],  // optional: pick the tabs (default: every room with `tab`)
     fab: {label, icon, fn(roomKey)},          // optional: a floating button over every room (a room sets fab:false to hide it)
     mapBtn: {icon, scene, args},               // optional: a round button in the room's top corner that opens a scene (a map overlay)
     useBtn: true,                              // optional: an Among Us style USE button (bottom right) that lights up beside anything you can use
     stickHint: true,                           // optional: a resting thumb-stick drawn bottom left (drag there or anywhere on the floor)
     fab.round: true                            // the fab becomes a round button under the map button (fab.short = its little label)
     WALKING: drag anywhere on the floor for a thumb-stick (it appears where you touch); a short tap on a thing walks over and uses it;
              a short tap on the floor walks there; arrow keys work too. The scene keeps this.joy for the stick's state.
     roomFx(c, R, phase, L),                   // optional: draw lighting/effects in room space. phase 'floor' (after the floor), 'over' (after people)
     onRoom(key, first), onTalk(npc, first), onOpen(station)   // optional hooks (XP, badges...)
     crowd(roomKey) -> [{id,name,av,sub}]       // optional: other people standing around (e.g. other accounts)
     rooms: { key: {
       name, tab:{label, icon}, w, h, wall,     // size in world units; `wall` = height of the back wall; viewH/viewW = how much shows
       wallStyle: 'panel'|'windows'|'hangar'|'sky'|'open',  floor: 'wood'|'concrete'|'deck'|'grass'|'tile',
       windows:[[x,w],...], opening:[x0,x1], runway:{y0,y1,num,lights,inset}, palette:{wall,floor,trim}, viewH: 300,
       music: 'songName', ambience: 'bedName',  // optional: this room's song (AUDIO.addSongs) and sound bed (AUDIO.addAmbience)
       spawn:[x,y], crowdSpots:[[x,y],...],
       stations:[ {key, label, icon, art, go,  and ONE placement:
                     wall:true, x, w            -> on the back wall
                     foot:[x0,y0,x1,y1], h      -> standing in the room (solid)
                     side:'L'|'R', y0, y1        -> an opening in a side wall (a door) } ],
       decor:[ {art, foot:[x0,y0,x1,y1], h} ],   // solid furniture with no action
       npcs:[ {id, name, role, x, y, av, lines:[...], first:[...]} ] } }
   go = {scene, args} | {page} | {room, at} | {talk:npcId} | {toast} | {fn(station)}
   art (wall):  board chalk cork case map poster door stairs window
   art (floor): couch table desk locker plane cart cone scope windsock sign radio crate plant counter bench
   sign: {text, sign:"location"|"info"|"direction"|"mandatory"} - FAA airfield sign colors (location = yellow on black)

   THE VIEW (v1.4): every place is a 3/4 diorama. Rooms are still described in flat world units (x across, y = depth,
   the back wall at y<wall, the floor from y=wall to y=h), and G.V projects them: the floor is sheared and compressed
   (proj:{sh,kd} per room, default .38/.8), the back wall stands upright, the right wall shows its inside, the left wall
   is seen edge-on, and everything standing on the floor is drawn upright at its projected feet. Floor art gets a
   projected footprint; G.V.box / G.V.top / G.V.plane draw real volumes and floor-plane markings in world units. */
(function(){
const VW=G.VW, C=G.C;
const PR=7;                                  // footprint radius of a walker
const Wd=()=>G.WORLD||(G.CFG.world)||{rooms:{}};

/* ---------------- people ---------------- */
/* a person standing with feet at (x,y), about 34*s tall. av = {skin, hair, style, suit, suit2, hat, hatCol, vest, wands} */
G.drawPerson=G.drawPerson||function(c,x,y,s,av,dir,walk,o){
 av=av||{}; dir=dir||1; s=s||1; o=o||{};
 const sk=av.skin||'#e0b080', hr=av.hair||'#4a3020', su=av.suit||'#3a6ea5', su2=av.suit2||G.shade(su,.72);
 const sw=walk?Math.sin(walk):0, bob=walk?Math.abs(Math.cos(walk))*.8:0;
 c.save(); c.translate(x,y-bob*s); c.scale(s,s);
 if(!o.noShadow){ const sg=c.createRadialGradient(0,bob,1,0,bob,9); sg.addColorStop(0,'rgba(0,0,0,.4)'); sg.addColorStop(1,'rgba(0,0,0,0)'); c.save(); c.scale(1,.32); c.fillStyle=sg; c.beginPath(); c.arc(0,bob/.32,9,0,7); c.fill(); c.restore(); }
 const suG=c.createLinearGradient(-6,0,6,0); suG.addColorStop(0,G.shade(su,.78)); suG.addColorStop(.45,G.shade(su,1.12)); suG.addColorStop(1,G.shade(su,.82));
 const skG=c.createRadialGradient(-1.8,-32,1,0,-30.5,6); skG.addColorStop(0,G.shade(sk,1.1)); skG.addColorStop(1,G.shade(sk,.8));
 // legs + shoes
 c.fillStyle=su2; c.fillRect(-3.8+sw*1.2,-12,3.4,11); c.fillRect(.4-sw*1.2,-12,3.4,11);
 c.fillStyle='#222'; c.fillRect(-4.4+sw*1.2,-2,4.2,2.4); c.fillRect(.2-sw*1.2,-2,4.2,2.4);
 // arms (behind the body on the far side)
 c.fillStyle=su; G.rrect(-8.4,-23-sw*1.2,3.2,10,1.6); c.fill(); G.rrect(5.2,-23+sw*1.2,3.2,10,1.6); c.fill();
 c.fillStyle=sk; c.beginPath(); c.arc(-6.8,-12.6-sw*1.2,1.7,0,7); c.fill(); c.beginPath(); c.arc(6.8,-12.6+sw*1.2,1.7,0,7); c.fill();
 if(av.wands){ c.fillStyle='#ff7a1a'; c.save(); c.translate(-6.8,-12.6-sw*1.2); c.rotate(-.5+sw*.3); c.fillRect(-.9,-9,1.8,9); c.restore(); c.save(); c.translate(6.8,-12.6+sw*1.2); c.rotate(.5-sw*.3); c.fillRect(-.9,-9,1.8,9); c.restore(); }
 // body
 G.rrect(-6,-25,12,14.5,3); c.fillStyle=suG; c.fill();
 c.fillStyle=su2; c.fillRect(-6,-14.5,12,1.6);                       // belt
 if(av.vest){ c.fillStyle='#d7ff3a'; G.rrect(-6,-24.5,12,10,2.5); c.fill(); c.fillStyle='#f4f4f4'; c.fillRect(-6,-19.5,12,1.3); }
 else { c.fillStyle='#ffd23a'; c.fillRect(dir>0?.8:-4.2,-22.4,3.4,1.2); }   // a little wings pin
 // head
 c.fillStyle=sk; c.fillRect(-1.6,-27,3.2,2.6);
 c.fillStyle=skG; c.beginPath(); c.arc(0,-30.5,5.6,0,7); c.fill();
 // hair
 c.fillStyle=hr; const st=av.style||'short';
 if(st!=='buzz'){ c.beginPath(); c.arc(0,-31,5.9,Math.PI*1.02,Math.PI*1.98); c.fill(); c.fillRect(-5.9,-32,11.8,2); }
 else { c.beginPath(); c.arc(0,-31,5.8,Math.PI*1.1,Math.PI*1.9); c.fill(); }
 if(st==='long'){ c.fillRect(-6,-32,2.4,9); c.fillRect(3.6,-32,2.4,9); }
 if(st==='curly') for(const [hx,hy] of [[-5,-31],[-3,-35],[0,-36.4],[3,-35],[5,-31]]){ c.beginPath(); c.arc(hx,hy,2.4,0,7); c.fill(); }
 if(st==='bun'){ c.beginPath(); c.arc(-dir*2,-37,2.8,0,7); c.fill(); }
 if(st==='pony'){ c.beginPath(); c.ellipse(-dir*6.4,-29,1.8,4.2,dir*.4,0,7); c.fill(); }
 // face
 c.fillStyle='#1d1a22'; c.beginPath(); c.arc(dir*1.4-2,-30.2,.75,0,7); c.fill(); c.beginPath(); c.arc(dir*1.4+2,-30.2,.75,0,7); c.fill();
 c.strokeStyle='rgba(60,30,30,.7)'; c.lineWidth=.6; c.beginPath(); c.arc(dir*1.4,-28.4,1.5,.2,Math.PI-.2); c.stroke();
 // headgear
 const hc=av.hatCol||'#1d3a6a';
 if(av.hat==='cap'){ c.fillStyle=hc; c.beginPath(); c.arc(0,-31.6,5.9,Math.PI,0); c.fill(); c.fillRect(dir>0?2:-9,-32.4,7,1.8); c.fillStyle='#ffd23a'; c.fillRect(-1,-35.2,2,1.4); }
 if(av.hat==='headset'){ c.strokeStyle='#2a2a30'; c.lineWidth=1.4; c.beginPath(); c.arc(0,-31,6.6,Math.PI*1.05,Math.PI*1.95); c.stroke(); c.fillStyle='#2a2a30'; c.fillRect(-7.4,-32,2.6,4.6); c.fillRect(4.8,-32,2.6,4.6); c.strokeStyle='#2a2a30'; c.lineWidth=.8; c.beginPath(); c.moveTo(dir*6,-28); c.quadraticCurveTo(dir*5,-25,dir*1.5,-26.4); c.stroke(); }
 if(av.hat==='aviator'){ c.fillStyle='#6b4226'; c.beginPath(); c.arc(0,-31,6.3,Math.PI,0); c.fill(); c.fillRect(-6.3,-31,2.4,6); c.fillRect(3.9,-31,2.4,6); c.fillStyle='#9fd6ff'; c.beginPath(); c.arc(-2.4,-34,1.6,0,7); c.fill(); c.beginPath(); c.arc(2.4,-34,1.6,0,7); c.fill(); }
 if(av.hat==='helmet'){ c.fillStyle=hc; c.beginPath(); c.arc(0,-31.4,6.6,Math.PI*.95,Math.PI*2.05); c.fill(); c.fillStyle='rgba(160,220,255,.75)'; c.fillRect(dir>0?0:-6,-31.5,6,2.2); }
 c.restore();
};
/* just the head + shoulders, in a circle (portraits, lists) */
G.drawPortrait=function(c,x,y,d,av,ring){
 c.save(); c.beginPath(); c.arc(x+d/2,y+d/2,d/2,0,7); c.fillStyle=G.rgba(C.accent,.16); c.fill(); c.clip();
 G.drawPerson(c,x+d/2,y+d*1.71,d/23,av,1,0,{noShadow:true});   // framed on the face: head centered high, shoulders at the bottom
 c.restore();
 c.beginPath(); c.arc(x+d/2,y+d/2,d/2,0,7); c.strokeStyle=ring||'rgba(255,255,255,.25)'; c.lineWidth=1.3; c.stroke();
};

/* ---------------- rooms: geometry + pathfinding ---------------- */
const GC=8, CACHE={};
function prep(key){
 if(CACHE[key]) return CACHE[key];
 const R=Wd().rooms[key]; if(!R) return null;
 R.key=key; R.wall=R.wall||110; R.w=R.w||520; R.h=R.h||420;
 for(const s of R.stations||[]){
  if(s.wall){ s.w=s.w||56; s.u=s.u||[s.x,R.wall+16]; }
  else if(s.side){ s.u=s.u||[s.side==='L'?28:R.w-28,(s.y0+s.y1)/2]; }
  else if(s.foot){ s.u=s.u||[(s.foot[0]+s.foot[2])/2,s.foot[3]+15]; }
 }
 const solids=[].concat((R.stations||[]).filter(s=>s.foot).map(s=>s.foot),(R.decor||[]).map(d=>d.foot),(R.npcs||[]).map(n=>[n.x-6,n.y-4,n.x+6,n.y+3]))
  .map(f=>[f[0]-PR,f[1]-PR,f[2]+PR,f[3]+PR]);
 const free=(x,y)=>{
  if(x<14+PR||x>R.w-14-PR||y<R.wall+8||y>R.h-6) return false;
  for(const f of solids) if(x>f[0]&&x<f[2]&&y>f[1]&&y<f[3]) return false;
  return true;
 };
 const cols=Math.ceil(R.w/GC), rows=Math.ceil(R.h/GC), g=new Uint8Array(cols*rows);
 for(let r=0;r<rows;r++) for(let q=0;q<cols;q++) g[r*cols+q]=free((q+.5)*GC,(r+.5)*GC)?1:0;
 return CACHE[key]={R,free,g,cols,rows};
}
function los(P,x0,y0,x1,y1){ const n=Math.ceil(Math.hypot(x1-x0,y1-y0)/3); for(let i=1;i<=n;i++){ const t=i/n; if(!P.free(x0+(x1-x0)*t,y0+(y1-y0)*t)) return false; } return true; }
/* A* on an 8-unit grid, trimmed to the corners you actually need */
function findPath(P,x0,y0,x1,y1){
 const {g,cols,rows}=P, cell=(x,y)=>[Math.max(0,Math.min(cols-1,Math.floor(x/GC))),Math.max(0,Math.min(rows-1,Math.floor(y/GC)))];
 const [sq,sr]=cell(x0,y0); let [tq,tr]=cell(x1,y1);
 if(!P.free(x1,y1)){
  let best=null,bd=1e9; for(let r=0;r<rows;r++) for(let q=0;q<cols;q++) if(g[r*cols+q]){ const d=(q-tq)*(q-tq)+(r-tr)*(r-tr); if(d<bd){ bd=d; best=[q,r]; } }
  if(!best) return null; [tq,tr]=best; x1=(tq+.5)*GC; y1=(tr+.5)*GC;
 }
 if(los(P,x0,y0,x1,y1)) return [[x1,y1]];
 const N=cols*rows, gs=new Float32Array(N).fill(1e9), fs=new Float32Array(N).fill(1e9), from=new Int32Array(N).fill(-1), closed=new Uint8Array(N);
 const start=sr*cols+sq, goal=tr*cols+tq, open=[start];
 const h=i=>{ const dq=Math.abs(i%cols-tq), dr=Math.abs(Math.floor(i/cols)-tr); return Math.max(dq,dr)+.414*Math.min(dq,dr); };
 gs[start]=0; fs[start]=h(start);
 while(open.length){
  let bi=0; for(let i=1;i<open.length;i++) if(fs[open[i]]<fs[open[bi]]) bi=i;
  const cur=open[bi]; open[bi]=open[open.length-1]; open.pop();
  if(cur===goal) break;
  if(closed[cur]) continue; closed[cur]=1;
  const cq=cur%cols, cr=Math.floor(cur/cols);
  for(let dr=-1;dr<=1;dr++) for(let dq=-1;dq<=1;dq++){
   if(!dq&&!dr) continue;
   const q=cq+dq, r=cr+dr; if(q<0||r<0||q>=cols||r>=rows) continue;
   const ni=r*cols+q; if(!g[ni]||closed[ni]) continue;
   if(dq&&dr&&(!g[cr*cols+q]||!g[r*cols+cq])) continue;
   const ng=gs[cur]+(dq&&dr?1.414:1);
   if(ng<gs[ni]){ gs[ni]=ng; fs[ni]=ng+h(ni); from[ni]=cur; open.push(ni); }
  }
 }
 if(goal!==start&&from[goal]<0) return null;
 const pts=[]; for(let i=goal;i!==start&&i>=0;i=from[i]) pts.push([(i%cols+.5)*GC,(Math.floor(i/cols)+.5)*GC]);
 pts.reverse(); if(!pts.length) return [[x1,y1]]; pts[pts.length-1]=[x1,y1];
 const out=[]; let ax=x0, ay=y0, i=0;
 while(i<pts.length){ let j=pts.length-1; while(j>i&&!los(P,ax,ay,pts[j][0],pts[j][1])) j--; out.push(pts[j]); ax=pts[j][0]; ay=pts[j][1]; i=j+1; }
 return out;
}

/* ---------------- art: walls, floors, things (world units) ---------------- */
const ART=G.worldArt=G.worldArt||{};
function skyRect(c,x,y,w,h,seed){
 const g=c.createLinearGradient(0,y,0,y+h); g.addColorStop(0,'#2f6fc0'); g.addColorStop(.6,'#7fb6ea'); g.addColorStop(1,'#d8ecff'); c.fillStyle=g; c.fillRect(x,y,w,h);
 c.save(); c.beginPath(); c.rect(x,y,w,h); c.clip();
 const sg=c.createRadialGradient(x+w*.8,y+h*.2,0,x+w*.8,y+h*.2,w*.5); sg.addColorStop(0,'rgba(255,245,210,.9)'); sg.addColorStop(.12,'rgba(255,235,180,.4)'); sg.addColorStop(1,'rgba(255,235,180,0)'); c.fillStyle=sg; c.fillRect(x,y,w,h);
 const t=G.rm()?0:G.time;
 for(let i=0;i<4;i++){ const cx=x+((i*97+seed*31+t*(4+i))%(w+80))-40, cy=y+10+((i*23+seed*7)%Math.max(8,h*.45)), r=14+i*3; const cg=c.createLinearGradient(0,cy-6,0,cy+6); cg.addColorStop(0,'rgba(255,255,255,.95)'); cg.addColorStop(1,'rgba(200,212,228,.8)'); c.fillStyle=cg; c.beginPath(); c.ellipse(cx,cy,r,5.5,0,0,7); c.ellipse(cx+10,cy-3,r*.65,5.5,0,0,7); c.ellipse(cx-8,cy-2,r*.5,4.5,0,0,7); c.fill(); }
 // a little plane crossing now and then
 const span=w+120, px=x+((t*18+seed*53)%(span*2))-60, py=y+h*.32+((seed*13)%10);
 if(px<x+w+60){ c.fillStyle='#f4f6fa'; c.beginPath(); c.ellipse(px,py,7,1.8,0,0,7); c.fill(); c.fillRect(px-2,py-4.5,2.4,9); c.fillRect(px-7,py-3,1.8,3); }
 c.restore();
}
function horizon(c,x,y,w,h){   // distant airfield seen through an opening: sky, grass, a strip
 skyRect(c,x,y,w,h*.7,x|0);
 c.fillStyle='#6a9a4a'; c.fillRect(x,y+h*.7,w,h*.3);
 c.fillStyle='#4a4d52'; c.fillRect(x,y+h*.8,w,h*.08); c.fillStyle='#f0f0f0'; for(let i=x+4;i<x+w;i+=14) c.fillRect(i,y+h*.835,7,1);
}
const WALLS={
 panel(c,R,P){ c.fillStyle=P.wall||'#4a3a5a'; c.fillRect(0,0,R.w,R.wall); c.fillStyle='rgba(255,255,255,.05)'; for(let x=0;x<R.w;x+=40) c.fillRect(x,0,1.5,R.wall); },
 windows(c,R,P){
  c.fillStyle=P.wall||'#6b4a33'; c.fillRect(0,0,R.w,R.wall);
  c.fillStyle='rgba(0,0,0,.12)'; for(let x=0;x<R.w;x+=26) c.fillRect(x,0,1.2,R.wall);
  for(const [x,w] of R.windows||[]){ c.fillStyle=P.trim||'#e8e2d6'; c.fillRect(x-3,12,w+6,R.wall-34); horizon(c,x,15,w,R.wall-40); c.fillStyle=P.trim||'#e8e2d6'; c.fillRect(x+w/2-1.5,15,3,R.wall-40); }
 },
 hangar(c,R,P){
  c.fillStyle=P.wall||'#5b6472'; c.fillRect(0,0,R.w,R.wall);
  c.fillStyle='rgba(255,255,255,.07)'; for(let x=0;x<R.w;x+=8) c.fillRect(x,0,2,R.wall);
  const o=R.opening; if(o){ c.fillStyle='#2a2f38'; c.fillRect(o[0]-6,4,o[1]-o[0]+12,R.wall-4); horizon(c,o[0],8,o[1]-o[0],R.wall-8); c.fillStyle='#ffc21a'; for(let x=o[0]-6;x<o[1]+6;x+=12){ c.fillRect(x,R.wall-4,6,4); } }
  c.fillStyle='rgba(255,250,220,.9)'; for(let x=60;x<R.w;x+=120){ c.fillRect(x-10,2,20,3); }
 },
 sky(c,R,P){
  skyRect(c,0,0,R.w,R.wall-18,3);
  c.fillStyle='#6a9a4a'; c.fillRect(0,R.wall-18,R.w,18); c.fillStyle='#4a4d52'; c.fillRect(0,R.wall-11,R.w,5);
  c.fillStyle='#f0f0f0'; for(let x=6;x<R.w;x+=18) c.fillRect(x,R.wall-9,9,1);
 },
 open(c,R,P){
  skyRect(c,0,0,R.w,R.wall-26,7);
  c.fillStyle='#3f6b3a'; for(let x=0;x<R.w;x+=14){ c.beginPath(); c.arc(x+7,R.wall-26,9+((x*7)%5),Math.PI,0); c.fill(); }
  c.fillStyle='#6a9a4a'; c.fillRect(0,R.wall-26,R.w,26);
  if(R.tower!=null){ const x=R.tower; c.fillStyle='#cfd4dc'; c.fillRect(x-5,R.wall-80,10,56); c.fillStyle='#2a3a4a'; c.fillRect(x-12,R.wall-96,24,16); c.fillStyle='#8fd0ff'; c.fillRect(x-10,R.wall-93,20,9); c.fillStyle='#cfd4dc'; c.fillRect(x-14,R.wall-99,28,4); }
 }
};
const FLOORS={
 wood(c,R,P){ for(let y=R.wall,i=0;y<R.h;y+=12,i++){ c.fillStyle=i%2?(P.floor||'#7a5236'):G.shade(P.floor||'#7a5236',.92); c.fillRect(0,y,R.w,12); c.fillStyle='rgba(0,0,0,.18)'; for(let x=(i*37)%90;x<R.w;x+=90) c.fillRect(x,y,1.2,12); } },
 concrete(c,R,P){ c.fillStyle=P.floor||'#8a8f96'; c.fillRect(0,R.wall,R.w,R.h-R.wall); c.fillStyle='rgba(0,0,0,.1)'; for(let x=60;x<R.w;x+=60) c.fillRect(x,R.wall,1.4,R.h-R.wall); for(let y=R.wall+60;y<R.h;y+=60) c.fillRect(0,y,R.w,1.4);
  if(R.leadLine){ c.strokeStyle='#ffc21a'; c.lineWidth=4; c.beginPath(); const L=R.leadLine; c.moveTo(L[0],L[1]); for(let i=2;i<L.length;i+=2) c.lineTo(L[i],L[i+1]); c.stroke(); } },
 deck(c,R,P){ for(let x=0,i=0;x<R.w;x+=14,i++){ c.fillStyle=i%2?(P.floor||'#7b6a58'):G.shade(P.floor||'#7b6a58',.9); c.fillRect(x,R.wall,14,R.h-R.wall); } },
 tile(c,R,P){ for(let y=R.wall,i=0;y<R.h;y+=24,i++) for(let x=0,j=0;x<R.w;x+=24,j++){ c.fillStyle=(i+j)%2?(P.floor||'#cfd6de'):G.shade(P.floor||'#cfd6de',.9); c.fillRect(x,y,24,24); } },
 grass(c,R,P){
  c.fillStyle=P.floor||'#5a8a44'; c.fillRect(0,R.wall,R.w,R.h-R.wall);
  const rw=R.runway; if(rw){
   c.fillStyle='#3a3d42'; c.fillRect(0,rw.y0,R.w,rw.y1-rw.y0);
   c.fillStyle='#f2f2f2'; c.fillRect(0,rw.y0+3,R.w,2); c.fillRect(0,rw.y1-5,R.w,2);
   const mid=(rw.y0+rw.y1)/2; for(let x=120;x<R.w-130;x+=36) c.fillRect(x,mid-1.2,20,2.4);
   const ins=rw.inset==null?26:rw.inset;   // keep the ends clear of the side walls/doors
   for(let y=rw.y0+9;y<rw.y1-12;y+=7){ c.fillRect(ins+12,y,26,3.6); c.fillRect(R.w-ins-38,y,26,3.6); }   // threshold "piano keys" at both ends
   if(rw.num){   // a runway is numbered from both ends: the end you land toward heading east (01-18) is on the left (west)
    const n=parseInt(rw.num,10), r=((n+17)%36)+1, west=n<=18?n:r, east=n<=18?r:n;
    c.save(); c.translate(ins+60,mid); c.rotate(Math.PI/2); G.txt(String(west),0,-8,16,'#f2f2f2','center',undefined,800); c.restore();
    c.save(); c.translate(R.w-ins-60,mid); c.rotate(-Math.PI/2); G.txt(String(east),0,-8,16,'#f2f2f2','center',undefined,800); c.restore();
   }
   if(rw.lights!==false){   // FAA colors: runway edge white, threshold green (seen from outside), runway end red (seen from the runway)
    const dot=(x,y,col)=>{ c.fillStyle=col; c.beginPath(); c.arc(x,y,1.6,0,7); c.fill(); };
    for(let x=24;x<R.w-20;x+=40){ dot(x,rw.y0-2,'#fffbe6'); dot(x,rw.y1+2,'#fffbe6'); }
    for(let y=rw.y0+6;y<rw.y1-4;y+=9){ dot(ins+3,y,'#3fdc7c'); dot(ins+7,y,'#ff3b30'); dot(R.w-ins-3,y,'#3fdc7c'); dot(R.w-ins-7,y,'#ff3b30'); }
   }
  }
  if(R.apron){ const a=R.apron; c.fillStyle='#55585e'; c.fillRect(a[0],a[1],a[2]-a[0],a[3]-a[1]); c.strokeStyle='#ffc21a'; c.lineWidth=3; c.beginPath(); c.moveTo(a[0]+10,a[1]+12); c.lineTo(a[2]-10,a[1]+12); c.stroke();
   if(rw&&rw.lights!==false){ c.fillStyle='#3d7bff'; for(let x=a[0]+4;x<=a[2]-4;x+=30){ c.beginPath(); c.arc(x,a[1]-2,1.6,0,7); c.fill(); } }   // taxiway/apron edge lights are blue
  }
 }
};
/* wall art: drawn on the back wall around s.x (s.w wide) */
const WALLART={
 board(c,s,R,col){ const w=s.w, x=s.x-w/2; c.fillStyle='#2a2730'; c.fillRect(x-2,24,w+4,R.wall-50); c.fillStyle=col||'#3a4a5c'; c.fillRect(x,26,w,R.wall-54); G.icon(s.icon||'grid',c,s.x,26+(R.wall-54)/2-4,18,'#f4f4f4'); },
 chalk(c,s,R){ const w=s.w, x=s.x-w/2; c.fillStyle='#8a6a3a'; c.fillRect(x-3,22,w+6,R.wall-46); c.fillStyle='#244a36'; c.fillRect(x,25,w,R.wall-52);
  c.strokeStyle='rgba(255,255,255,.75)'; c.lineWidth=1.2; const cy=25+(R.wall-52)/2;
  c.beginPath(); c.moveTo(s.x-16,cy); c.lineTo(s.x+16,cy); c.moveTo(s.x-3,cy-10); c.lineTo(s.x+1,cy); c.lineTo(s.x-3,cy+10); c.moveTo(s.x+10,cy-5); c.lineTo(s.x+14,cy); c.lineTo(s.x+10,cy+5); c.stroke();
  c.beginPath(); c.moveTo(x+6,30); c.lineTo(x+24,30); c.moveTo(x+w-26,cy+14); c.lineTo(x+w-8,cy+14); c.stroke(); },
 cork(c,s,R){ const w=s.w, x=s.x-w/2; c.fillStyle=vgrad(c,22,R.wall-24,'#7a5632','#4e3419'); c.fillRect(x-3,22,w+6,R.wall-46); c.fillStyle=vgrad(c,25,R.wall-27,'#d8a467','#b8834a'); c.fillRect(x,25,w,R.wall-52); c.fillStyle='rgba(0,0,0,.08)'; for(let i=0;i<30;i++) c.fillRect(x+((i*37)%w),25+((i*53)%(R.wall-54)),1.5,1.5);
  const notes=['#fff7a8','#a8e6ff','#ffc0d8','#c8ffb0','#ffffff']; for(let i=0;i<5;i++){ const nx=x+5+(i*17)%(w-18), ny=29+(i*13)%(R.wall-70); c.fillStyle=notes[i]; c.fillRect(nx,ny,13,11); c.fillStyle='#d03030'; c.beginPath(); c.arc(nx+6.5,ny+1.5,1.4,0,7); c.fill(); } },
 case(c,s,R){ const w=s.w, x=s.x-w/2; c.fillStyle='#5a4030'; c.fillRect(x-2,20,w+4,R.wall-36); c.fillStyle='rgba(170,220,255,.25)'; c.fillRect(x,22,w,R.wall-40); c.fillStyle='#6a4a36'; c.fillRect(x,22+(R.wall-40)/2,w,2);
  for(let i=0;i<3;i++){ G.icon(i===1?'star':'trophy',c,x+w*(i+.5)/3,22+(R.wall-40)/4,10,'#ffd23a'); G.icon('medal',c,x+w*(i+.5)/3,22+(R.wall-40)*.72,9,'#cfd6e0'); } },
 map(c,s,R){ const w=s.w, x=s.x-w/2; c.fillStyle='#2a2730'; c.fillRect(x-2,24,w+4,R.wall-50); c.fillStyle='#e9e2c4'; c.fillRect(x,26,w,R.wall-54); c.fillStyle='#bcd9a0'; c.fillRect(x+4,30,w*.5,R.wall-62);
  c.strokeStyle='#4a76c8'; c.lineWidth=1.2; c.beginPath(); c.arc(s.x+6,26+(R.wall-54)/2,10,0,7); c.stroke(); c.strokeStyle='#b03a8a'; c.beginPath(); c.arc(s.x-10,40,6,0,7); c.stroke();
  c.strokeStyle='#d03030'; c.setLineDash([3,2]); c.beginPath(); c.moveTo(x+8,R.wall-34); c.lineTo(s.x+6,26+(R.wall-54)/2); c.stroke(); c.setLineDash([]); },
 poster(c,s,R,col){ const w=s.w, x=s.x-w/2; c.fillStyle='#f4f0e6'; c.fillRect(x,22,w,R.wall-44); c.fillStyle=col||G.C.accent; c.fillRect(x+4,26,w-8,R.wall-62); G.icon(s.icon||'star',c,s.x,26+(R.wall-62)/2,16,'#ffffff'); },
 none(){},
 window(c,s,R){ const w=s.w, x=s.x-w/2; c.fillStyle='#e8e2d6'; c.fillRect(x-3,14,w+6,R.wall-32); horizon(c,x,17,w,R.wall-38); },
 door(c,s,R){ const w=s.w, x=s.x-w/2; c.fillStyle=hgrad(c,x-4,x+w+4,'#1e1a15','#3a3328','#1e1a15'); c.fillRect(x-4,R.wall-78,w+8,78); c.fillStyle=vgrad(c,R.wall-74,R.wall,'#0f0e14','#1c1a24'); c.fillRect(x,R.wall-74,w,74); const g=c.createRadialGradient(s.x,R.wall-10,4,s.x,R.wall-10,w); g.addColorStop(0,'rgba(255,220,140,.3)'); g.addColorStop(1,'rgba(255,220,140,0)'); c.fillStyle=g; c.fillRect(x,R.wall-74,w,74); G.icon(s.icon||'play',c,s.x,R.wall-40,14,'rgba(255,255,255,.75)'); },
 stairs(c,s,R){ const w=s.w, x=s.x-w/2; c.fillStyle='#2b2620'; c.fillRect(x-4,R.wall-84,w+8,84); c.fillStyle='#1a1820'; c.fillRect(x,R.wall-80,w,80); c.fillStyle='#6a6a74'; for(let i=0;i<7;i++) c.fillRect(x+2+i*2,R.wall-12-i*10,w-4-i*4,4); }
};
/* little materials for props (rounded rect on this context; gradients) */
function rr(c,x,y,w,h,r){ r=Math.max(0,Math.min(r,w/2,h/2)); c.beginPath(); c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath(); }
function vgrad(c,y0,y1,a,b){ const g=c.createLinearGradient(0,y0,0,y1); g.addColorStop(0,a); g.addColorStop(1,b); return g; }
function hgrad(c,x0,x1,a,b,m){ const g=c.createLinearGradient(x0,0,x1,0); g.addColorStop(0,a); if(m){ g.addColorStop(.5,m); } g.addColorStop(1,b); return g; }
/* ---------------- G.V: the 3/4 projection and a volume kit (world units in, projected drawing out) ----------------
   V.set(R) before drawing a room. V.P(x,y) -> projected floor point. V.unP(X,Y) -> floor point.
   V.plane(c,z,fn) runs fn with the floor-plane transform at height z (draw markings, light pools, table tops in world units).
   V.box(c,f,h,col,o) a lit box on footprint f, h tall (o.h0 lifts the bottom). V.top/V.front/V.side build its faces.
   V.shadow(c,f,h,a) a soft cast shadow on the floor. V.fp(f) the projected footprint [X0,Y0,X1,Y1] (feet at the near edge). */
const V=G.V=Object.assign(G.V||{},{sh:.32,kd:.8,wall:110,R:null,
 set(R){ const p=R.proj||{}; V.sh=p.sh==null?.32:p.sh; V.kd=p.kd==null?.8:p.kd; V.wall=R.wall; V.R=R; V.D=R.h-R.wall; V.W=R.w+V.D*V.sh; V.H=R.wall+V.D*V.kd; V.outdoor=!!(R.outdoor||R.wallStyle==='sky'||R.wallStyle==='open'); },
 P(x,y){ return [x+(y-V.wall)*V.sh,V.wall+(y-V.wall)*V.kd]; },
 unP(X,Y){ const y=V.wall+(Y-V.wall)/V.kd; return [X-(y-V.wall)*V.sh,y]; },
 xf(c,z){ c.transform(1,0,V.sh,V.kd,-V.wall*V.sh,V.wall*(1-V.kd)-(z||0)); },
 plane(c,z,fn){ c.save(); V.xf(c,z); fn(c); c.restore(); },
 fp(f){ const dx=(f[3]-V.wall)*V.sh; return [f[0]+dx,V.wall+(f[1]-V.wall)*V.kd,f[2]+dx,V.wall+(f[3]-V.wall)*V.kd]; },
 quad(c,p){ c.beginPath(); c.moveTo(p[0][0],p[0][1]); for(let i=1;i<p.length;i++) c.lineTo(p[i][0],p[i][1]); c.closePath(); },
 top(c,f,h){ V.quad(c,[V.P(f[0],f[1]),V.P(f[2],f[1]),V.P(f[2],f[3]),V.P(f[0],f[3])].map(q=>[q[0],q[1]-h])); },
 front(c,f,h,h0){ const a=V.P(f[0],f[3]), b=V.P(f[2],f[3]); h0=h0||0; V.quad(c,[[a[0],a[1]-h],[b[0],b[1]-h],[b[0],b[1]-h0],[a[0],a[1]-h0]]); },
 side(c,f,h,h0){ const a=V.P(f[2],f[1]), b=V.P(f[2],f[3]); h0=h0||0; V.quad(c,[[a[0],a[1]-h],[b[0],b[1]-h],[b[0],b[1]-h0],[a[0],a[1]-h0]]); },
 box(c,f,h,col,o){ o=o||{}; const h0=o.h0||0, a=V.P(f[0],f[3]), b=V.P(f[2],f[3]);
  V.side(c,f,h,h0); c.fillStyle=o.sideCol||G.shade(col,.58); c.fill();
  V.front(c,f,h,h0); const fg=c.createLinearGradient(0,a[1]-h,0,a[1]-h0); fg.addColorStop(0,G.shade(col,1.0)); fg.addColorStop(1,G.shade(col,.7)); c.fillStyle=o.frontCol||fg; c.fill();
  V.top(c,f,h); const tg=c.createLinearGradient(a[0],0,b[0],0); tg.addColorStop(0,G.shade(col,1.28)); tg.addColorStop(1,G.shade(col,1.1)); c.fillStyle=o.topCol||tg; c.fill();
  if(!o.noEdge){ c.strokeStyle='rgba(255,255,255,.22)'; c.lineWidth=.8; c.beginPath(); c.moveTo(a[0],a[1]-h); c.lineTo(b[0],b[1]-h); c.stroke(); }
  if(o.rim){ c.strokeStyle='rgba(0,0,0,.28)'; c.lineWidth=.8; V.top(c,f,h); c.stroke(); } },
 cyl(c,x,y,r,h,col){ // an upright cylinder (pots, drums, posts): a sheared disc on top, a shaded body
  const [X,Y]=V.P(x,y); const ry=r*V.kd*.55; const g=c.createLinearGradient(X-r,0,X+r,0); g.addColorStop(0,G.shade(col,.6)); g.addColorStop(.4,G.shade(col,1.15)); g.addColorStop(1,G.shade(col,.7)); c.fillStyle=g; c.fillRect(X-r,Y-h,r*2,h); c.beginPath(); c.ellipse(X,Y,r,ry,0,0,7); c.fill();
  c.fillStyle=G.shade(col,1.3); c.beginPath(); c.ellipse(X,Y-h,r,ry,0,0,7); c.fill(); },
 shadow(c,f,h,a){ // a soft cast shadow, light from the upper left: it falls right and a little toward you
  const w=f[2]-f[0], d=f[3]-f[1], cx=(f[0]+f[2])/2+Math.min(16,h*.3), cy=(f[1]+f[3])/2+2, rx=w/2+6+Math.min(10,h*.15), ry=Math.max(6,d/2+4);
  c.save(); V.xf(c,0); c.translate(cx,cy); c.scale(1,ry/rx); const g=c.createRadialGradient(0,0,rx*.25,0,0,rx); g.addColorStop(0,'rgba(0,0,0,'+(a==null?.38:a)+')'); g.addColorStop(1,'rgba(0,0,0,0)'); c.fillStyle=g; c.beginPath(); c.arc(0,0,rx,0,7); c.fill(); c.restore(); },
 sprite(c,f,h,fn){ // draw an upright billboard in local units: its feet at the projected near edge, (0,0) = bottom-left corner
  const p=V.fp(f); c.save(); c.translate(p[0],p[3]); fn(c,p[2]-p[0],h,p[3]-p[1]); c.restore(); }
});
/* the old name: a soft shadow under anything standing on the floor (world footprint) */
function contact(c,f,k){ V.shadow(c,f,16,k); }
G.worldArt.contact=contact;
/* floor art(c, f, h, col, s, wf): f is the PROJECTED footprint [X0,Y0,X1,Y1] (feet on the near edge: sprites draw between
   f[0]..f[2] with their base at f[3], h tall), wf is the flat WORLD footprint for volumes (V.box) and floor markings (V.plane). */
const FLOORART={
 couch(c,f,h,col,s,wf){ wf=wf||f; col=col||'#3a5a8a'; const d=wf[3]-wf[1];
  V.box(c,[wf[0],wf[1],wf[2],wf[1]+Math.min(9,d*.35)],h,G.shade(col,.9),{noEdge:true});                 // the back
  V.box(c,[wf[0],wf[1]+Math.min(9,d*.35)-2,wf[0]+7,wf[3]],h*.62,col,{noEdge:true}); V.box(c,[wf[2]-7,wf[1]+Math.min(9,d*.35)-2,wf[2],wf[3]],h*.62,col,{noEdge:true});   // arms
  const sy0=wf[1]+Math.min(9,d*.35), w=wf[2]-wf[0]-14;                                             // two cushions
  for(const k of [0,1]){ const cf=[wf[0]+7+k*w/2+1,sy0,wf[0]+7+(k+1)*w/2-1,wf[3]-1]; V.box(c,cf,h*.42,G.shade(col,1.08),{noEdge:true}); V.top(c,cf,h*.42); c.fillStyle='rgba(255,255,255,.12)'; c.fill(); }
  const a=V.P(wf[0],wf[3]); c.fillStyle='rgba(0,0,0,.25)'; c.fillRect(a[0]+2,a[1]-1,wf[2]-wf[0]-4,1.5); },
 table(c,f,h,col,s,wf){ wf=wf||f; col=col||'#8a6040'; const t=Math.max(4,h*.18);
  for(const [lx,ly] of [[wf[0]+2,wf[3]-6],[wf[2]-6,wf[3]-6],[wf[2]-6,wf[1]+1]]){ V.box(c,[lx,ly,lx+4,ly+4],h-t,'#3a2a20',{noEdge:true}); }
  V.box(c,wf,h,col,{h0:h-t,rim:true}); V.top(c,wf,h); c.fillStyle='rgba(255,255,255,.1)'; c.fill();
  c.save(); V.top(c,wf,h); c.clip(); V.plane(c,h,q=>{ q.strokeStyle='rgba(0,0,0,.16)'; q.lineWidth=.8; for(let y=wf[1]+4;y<wf[3];y+=5){ q.beginPath(); q.moveTo(wf[0],y); q.lineTo(wf[2],y); q.stroke(); } }); c.restore(); },
 desk(c,f,h,col,s,wf){ wf=wf||f; col=col||'#5a6a7a'; V.box(c,wf,h,col,{rim:true}); V.front(c,wf,h-5,2); c.fillStyle='rgba(0,0,0,.14)'; c.fill(); },
 counter(c,f,h,col,s,wf){ wf=wf||f; FLOORART.desk(c,f,h,col||'#7a5a40',s,wf); },
 bench(c,f,h,col,s,wf){ wf=wf||f; FLOORART.table(c,f,h,'#7a6a5a',s,wf); },
 locker(c,f,h,col,s,wf){ wf=wf||f; col=col||'#4a6a9a'; V.box(c,wf,h,col,{noEdge:true}); const a=V.P(wf[0],wf[3]), b=V.P(wf[2],wf[3]), w=b[0]-a[0], n=Math.max(1,Math.round(w/16)), lw=w/n;
  for(let i=0;i<n;i++){ const x=a[0]+i*lw; c.fillStyle='rgba(0,0,0,.28)'; c.fillRect(x+lw-1,a[1]-h,1,h); c.fillStyle='rgba(0,0,0,.3)'; for(let k=0;k<3;k++) c.fillRect(x+3,a[1]-h+6+k*3,lw-7,1.2); c.fillStyle='#e9edf2'; c.fillRect(x+lw-5,a[1]-h*.5,1.6,6); c.fillStyle='rgba(255,255,255,.1)'; c.fillRect(x,a[1]-h,lw-1,1); } },
 crate(c,f,h,col,s,wf){ wf=wf||f; V.box(c,wf,h,'#a8783f',{rim:true}); const a=V.P(wf[0],wf[3]), b=V.P(wf[2],wf[3]);
  c.strokeStyle='rgba(60,35,15,.55)'; c.lineWidth=1.2; c.strokeRect(a[0]+1,a[1]-h+1,b[0]-a[0]-2,h-2); c.beginPath(); c.moveTo(a[0]+1,a[1]-h+1); c.lineTo(b[0]-1,a[1]-1); c.stroke();
  c.strokeStyle='rgba(0,0,0,.16)'; c.lineWidth=.8; for(let y=a[1]-h+5;y<a[1];y+=5){ c.beginPath(); c.moveTo(a[0]+1,y); c.lineTo(b[0]-1,y+.5); c.stroke(); } },
 plant(c,f,h,col,s,wf){ wf=wf||f; const cx=(wf[0]+wf[2])/2, cy=(wf[1]+wf[3])/2, r=Math.max(5,(wf[2]-wf[0])/2); V.cyl(c,cx,cy,r,r*1.5,'#8a5a3a'); const [X,Y]=V.P(cx,cy); const top=Y-r*1.5;
  for(const [dx,dy,rr] of [[0,-h+r*1.5,7],[-6,-h+8+r*1.5,6],[6,-h+8+r*1.5,6],[0,-h+12+r*1.5,6]]){ const g=c.createRadialGradient(X+dx-rr*.3,top+dy-rr*.4,rr*.1,X+dx,top+dy,rr); g.addColorStop(0,'#6fc46a'); g.addColorStop(1,'#2d6a32'); c.fillStyle=g; c.beginPath(); c.arc(X+dx,top+dy,rr,0,7); c.fill(); } },
 cone(c,f,h,col,s,wf){ wf=wf||f; const n=Math.max(1,Math.round((wf[2]-wf[0])/18)); for(let i=0;i<n;i++){ const wx=wf[0]+9+i*18, [cx,b]=V.P(wx,wf[3]); V.plane(c,0,q=>{ q.fillStyle='#2a2d33'; q.beginPath(); q.ellipse(wx,wf[3]-2,7.5,4.5,0,0,7); q.fill(); });
  c.fillStyle=hgrad(c,cx-6,cx+6,'#c24a10','#d8581a','#ff8a3a'); c.beginPath(); c.moveTo(cx-6,b-2); c.lineTo(cx-1.2,b-h); c.lineTo(cx+1.2,b-h); c.lineTo(cx+6,b-2); c.closePath(); c.fill(); c.fillStyle='rgba(255,255,255,.9)'; c.fillRect(cx-3.4,b-h*.55,6.8,2.4); c.fillStyle='rgba(255,255,255,.35)'; c.fillRect(cx-2.8,b-h*.55,2,2.4); } },
 cart(c,f,h,col,s,wf){ wf=wf||f; col=col||'#c03030'; V.box(c,[wf[0],wf[1],wf[2],wf[3]],h,col,{h0:5,noEdge:true}); const a=V.P(wf[0],wf[3]), b=V.P(wf[2],wf[3]), w=b[0]-a[0];
  c.fillStyle='rgba(0,0,0,.3)'; for(let k=1;k<4;k++) c.fillRect(a[0]+2,a[1]-h+k*h*.2,w-4,1.4); c.fillStyle='#d8dde4'; for(let k=1;k<4;k++) c.fillRect(a[0]+w/2-3,a[1]-h+k*h*.2-2,6,1.2);
  c.fillStyle='#222'; c.beginPath(); c.arc(a[0]+5,a[1]-1,2.8,0,7); c.arc(b[0]-5,a[1]-1,2.8,0,7); c.fill(); c.fillStyle='#8d96a2'; c.beginPath(); c.arc(a[0]+5,a[1]-1,1,0,7); c.arc(b[0]-5,a[1]-1,1,0,7); c.fill(); },
 sign(c,f,h,col,s,wf){   // airfield signs, FAA AC 150/5340-18 colors. s.sign: 'location' (default: yellow on black, yellow border) | 'info' or 'direction' (black on yellow) | 'mandatory' (white on red, black outline on the legend)
  const p=f, w=p[2]-p[0], cx=(p[0]+p[2])/2, kind=(s&&s.sign)||'location', Y='#ffc21a', b=p[3];
  c.fillStyle='#555'; c.fillRect(p[0]+4,b-8,3,8); c.fillRect(p[2]-7,b-8,3,8);
  const bg={location:'#111',info:Y,direction:Y,mandatory:'#c8102e'}[kind]||'#111', ink={location:Y,info:'#111',direction:'#111',mandatory:'#fff'}[kind]||Y;
  c.fillStyle='rgba(0,0,0,.35)'; c.fillRect(p[0]+2,b-h+2,w,h-6); c.fillStyle=bg; c.fillRect(p[0],b-h,w,h-6);
  if(kind==='location'){ c.strokeStyle=Y; c.lineWidth=1.2; c.strokeRect(p[0]+1.5,b-h+1.5,w-3,h-9); }
  if(s&&s.text){ const ty=b-h+(h-6)/2-5;
   if(kind==='mandatory'){ c.save(); c.font=G.font(7,800); c.textAlign='center'; c.textBaseline='top'; c.lineWidth=1.6; c.strokeStyle='#111'; c.strokeText(s.text,cx,ty); c.restore(); }
   G.txt(s.text,cx,ty,7,ink,'center',w-6,800); }
 },
 scope(c,f,h,col,s,wf){ const p=f, cx=(p[0]+p[2])/2, b=p[3]; c.fillStyle=hgrad(c,cx-2,cx+2,'#3a4250','#6a7280'); c.fillRect(cx-2,b-h+12,4,h-10); c.fillStyle='#4a5260'; c.fillRect(cx-7,b-3,14,3); c.fillStyle=hgrad(c,cx-9,cx+9,'#1f4a80','#3a80d0'); G.rrect(cx-9,b-h,18,13,4); c.fill(); c.fillStyle='#111'; c.beginPath(); c.arc(cx-4,b-h+6,2.6,0,7); c.arc(cx+4,b-h+6,2.6,0,7); c.fill(); },
 windsock(c,f,h,col,s,wf){ const p=f, x=(p[0]+p[2])/2, top=p[3]-h, a=G.rm()?0:Math.sin(G.time*1.7)*.12; c.fillStyle=hgrad(c,x-1.5,x+1.5,'#9aa3ad','#d8dde4','#f4f6f8'); c.fillRect(x-1.5,top,3,h); c.save(); c.translate(x+1.5,top+4); c.rotate(a);
  for(let i=0;i<5;i++){ const w0=7-i*.9; c.fillStyle=vgrad(c,-w0/2-3,w0/2-3,i%2?'#ffffff':'#ff8a3a',i%2?'#c9ced6':'#c24a10'); c.fillRect(i*7,-w0/2-3,7.2,w0); } c.restore(); },
 radio(c,f,h,col,s,wf){ FLOORART.desk(c,f,h,'#46505e',s,wf); const p=f, w=p[2]-p[0], b=p[3]; c.fillStyle='#1a1e24'; c.fillRect(p[0]+6,b-h-14,w-12,14); c.fillStyle='#3aff8a'; c.fillRect(p[0]+10,b-h-10,14,4); c.fillStyle='#ffc21a'; for(let i=0;i<4;i++){ c.beginPath(); c.arc(p[0]+34+i*8,b-h-7,2,0,7); c.fill(); } },
 plane(c,f,h,col,s,wf){   // a high-wing trainer, side view, nose toward +x
  const p=f, x0=p[0], w=p[2]-p[0], b=p[3], k=w/150; col=col||G.C.accent;
  c.save(); c.translate(x0,b); c.scale(k,k);
  c.fillStyle='rgba(0,0,0,.25)'; c.beginPath(); c.ellipse(75,0,70,5,0,0,7); c.fill();
  c.strokeStyle='#333'; c.lineWidth=2; c.beginPath(); c.moveTo(98,-14); c.lineTo(94,-4); c.moveTo(60,-14); c.lineTo(56,-4); c.moveTo(16,-12); c.lineTo(14,-3); c.stroke();
  c.fillStyle='#222'; for(const wx of [94,56]){ c.beginPath(); c.arc(wx,-3.5,4.2,0,7); c.fill(); } c.beginPath(); c.arc(14,-2.5,2.6,0,7); c.fill();
  c.fillStyle='#f6f7f9'; c.beginPath(); c.moveTo(4,-26); c.lineTo(24,-22); c.lineTo(108,-24); c.quadraticCurveTo(130,-22,134,-16); c.lineTo(130,-12); c.quadraticCurveTo(100,-10,24,-14); c.lineTo(6,-20); c.closePath(); c.fill();
  c.beginPath(); c.moveTo(2,-48); c.lineTo(14,-48); c.lineTo(26,-24); c.lineTo(6,-24); c.closePath(); c.fill();   // fin
  c.fillStyle=col; c.fillRect(24,-21,104,3); c.beginPath(); c.moveTo(3,-46); c.lineTo(12,-46); c.lineTo(15,-40); c.lineTo(5,-40); c.closePath(); c.fill();
  c.fillStyle='#8fd0ff'; c.beginPath(); c.moveTo(78,-34); c.lineTo(104,-34); c.lineTo(112,-25); c.lineTo(78,-25); c.closePath(); c.fill();
  c.fillStyle='#e4e7ec'; c.fillRect(60,-36,64,3.5); c.fillStyle='#f6f7f9'; c.fillRect(72,-38,58,4);   // wing (high wing)
  c.strokeStyle='#aab'; c.lineWidth=1.4; c.beginPath(); c.moveTo(84,-34); c.lineTo(92,-22); c.stroke();
  c.fillStyle='#555'; c.fillRect(133,-22,3,8); c.fillStyle='#2a2a2a'; c.fillRect(135,-34,2,32);   // spinner + prop
  c.restore();
 }
};
G.worldArt.walls=WALLS; G.worldArt.floors=FLOORS; G.worldArt.wall=WALLART; G.worldArt.floor=FLOORART;

/* ---------------- the scene ---------------- */
const ST={room:null,px:null,py:null,dir:1};   // where you were, kept across visits
G.scenes.world={
 enter(a){
  a=a||{};
  const W=Wd(), save=(G.save.mod.world=G.save.mod.world||{});
  let key=a.room||ST.room||save.room||W.start||Object.keys(W.rooms)[0];
  if(!W.rooms[key]) key=W.start;
  const changed=key!==ST.room;
  this.P=prep(key); const R=this.P.R;
  ST.room=key; save.room=key;
  if(a.at){ const s=(R.stations||[]).find(q=>q.key===a.at); if(s){ ST.px=s.u[0]; ST.py=s.u[1]; } }
  else if(changed||ST.px==null){ ST.px=(R.spawn||[R.w/2,R.h-30])[0]; ST.py=(R.spawn||[R.w/2,R.h-30])[1]; }
  if(!this.P.free(ST.px,ST.py)){ const s=R.spawn||[R.w/2,R.h-30]; ST.px=s[0]; ST.py=s[1]; }
  this.walk=0; this.walked=0; this.path=null; this.tgt=null; this.dlg=null; this.exitM=null; this.tst={f:0}; this._labels=[];
  this.npcDir={};
  this.crowd=W.crowd?(W.crowd(key)||[]).slice(0,(R.crowdSpots||[]).length).map((p,i)=>Object.assign({x:R.crowdSpots[i][0],y:R.crowdSpots[i][1],crowd:true},p)):[];
  this.snapCam(this.layout());
  const visited=(save.visited=save.visited||{}), first=!visited[key]; visited[key]=Date.now(); G.persist();
  if(W.onRoom) W.onRoom(key,first);
  const mus=R.music||W.music; if(mus&&AUDIO.curName!==mus) AUDIO.play(mus); else if(!mus&&AUDIO.curName!==AUDIO.menuMusic()) AUDIO.play(AUDIO.menuMusic());
  if(AUDIO.ambience) AUDIO.ambience(R.ambience||W.ambience||null);   // a looping sound bed per room (AUDIO.addAmbience)
 },
 exit(){ if(AUDIO.ambience) AUDIO.ambience(null); },
 layout(){
  const VH=G.VH, R=this.P.R, roomY=42, barH=56, RH=VH-roomY-barH; V.set(R);
  const Z=Math.max(.9,Math.min(1.4,RH/(R.viewH||300),VW/(R.viewW||230)));   // fit the room's view height, but always show ~230 units across
  return {roomY,RH,barY:VH-barH,barH,Z,vw:VW/Z,vh:RH/Z};
 },
 /* screen <-> room (projected) <-> world (flat) */
 toRoom(sx,sy,L){ return [sx/L.Z+this.camX,(sy-L.roomY)/L.Z+this.camY]; },
 roomToScreen(X,Y,L){ return [(X-this.camX)*L.Z,L.roomY+(Y-this.camY)*L.Z]; },
 toWorld(sx,sy,L){ const [X,Y]=this.toRoom(sx,sy,L); V.set(this.P.R); return Y>=V.wall?V.unP(X,Y):[X,Y]; },
 toScreen(wx,wy,L,z){ V.set(this.P.R); const p=wy>=V.wall?V.P(wx,wy):[wx,wy]; return this.roomToScreen(p[0],p[1]-(z||0),L); },
 camTarget(L){ const R=this.P.R; V.set(R); const pY=V.P(ST.px,ST.py)[1], pX=ST.px+V.D*V.sh*.5, Wp=V.W, Hp=V.H;   // center on the player's column at mid-depth, so the sheared back wall stays in view
  const cx=Wp<=L.vw?(Wp-L.vw)/2:Math.max(0,Math.min(Wp-L.vw,pX-L.vw/2)); const cy=Hp<=L.vh?(Hp-L.vh)/2:Math.max(0,Math.min(Hp-L.vh,pY-L.vh*.62)); return [cx,cy]; },
 snapCam(L){ const t=this.camTarget(L); this.camX=t[0]; this.camY=t[1]; },
 followCam(L,dt){ const t=this.camTarget(L), k=Math.min(1,dt*6); this.camX+=(t[0]-this.camX)*k; this.camY+=(t[1]-this.camY)*k; },
 /* the tab bar: every room with a `tab`, or W.tabs = ['roomKey', {id, label, icon, scene, args, home:true}, ...]
    (a scene tab with home:true, e.g. a map, lights up while you're in a room that has no tab of its own) */
 tabList(){
  const W=Wd(), R=W.rooms;
  if(W.tabs) return W.tabs.map(t=>typeof t==='string'?(R[t]?{room:t,label:(R[t].tab||{}).label||R[t].name,icon:(R[t].tab||{}).icon}:null):t).filter(Boolean);
  return Object.keys(R).filter(k=>R[k].tab).map(k=>({room:k,label:R[k].tab.label,icon:R[k].tab.icon}));
 },
 tabs(L){
  const W=Wd(), list=this.tabList(), bag=W.bag!==false, n=list.length+(bag?1:0);
  const gap=4, w=(VW-12-gap*(n-1))/n, inTabs=list.some(t=>t.room===ST.room);
  const T=list.map((t,i)=>({id:t.room?'room:'+t.room:'tab:'+(t.id||i),room:t.room,scene:t.scene,args:t.args,label:t.label,icon:t.icon,on:t.room?t.room===ST.room:(!!t.home&&!inTabs),x:6+i*(w+gap),y:L.barY+6,w,h:L.barH-12}));
  if(bag) T.push({id:'bag',label:W.bagLabel||'BAG',icon:W.bagIcon||'grid',x:6+list.length*(w+gap),y:L.barY+6,w,h:L.barH-12});
  return T;
 },
 /* an optional round map button in the room's top-right corner (W.mapBtn = {icon, scene, args}) */
 mapBtn(L){ const W=Wd(), M=W.mapBtn; if(!M||this.dlg) return null; return {x:VW-44,y:L.roomY+8,w:36,h:36,M}; },
 /* an optional floating button over the room (W.fab = {label, icon, fn(roomKey)}; a room sets fab:false to hide it) */
 fabRect(L){
  const W=Wd(), F=W.fab; if(!F||this.P.R.fab===false||this.dlg) return null;
  if(F.round) return {x:VW-44,y:L.roomY+(W.mapBtn?54:8),w:36,h:36,F,round:true};
  const w=G.tw(F.label,6,800)+34; return {x:VW-8-w,y:L.roomY+L.RH-32,w,h:24,F};
 },
 /* the USE button (W.useBtn): bottom right, lit when something usable is in reach */
 useRect(L){ const W=Wd(); if(!W.useBtn||this.dlg) return null; return {x:VW-72,y:L.roomY+L.RH-72,w:64,h:64,near:this.nearThing()}; },
 /* the resting thumb-stick (W.stickHint: true, or a function the rendition answers per frame, e.g. only for touch input): bottom left */
 stickRest(L){ const W=Wd(), on=typeof W.stickHint==='function'?W.stickHint():W.stickHint; if(!on||this.dlg) return null; return {x:50,y:L.roomY+L.RH-50,r:34}; },
 /* keyboard hints (W.keyHints() -> {use:'E', walk:'W A S D'} or null): a keycap on USE, and a walk legend where the stick would rest */
 keyHints(){ const W=Wd(); return W.keyHints?W.keyHints():null; },
 /* what is under a tap (X,Y in projected room units). Everything the point touches is collected with its depth and the thing
    drawn in FRONT wins: people and floor stations by how near they stand, then the side doors, then the back wall. A crew
    member standing behind a table never takes a tap meant for the table, and the whole drawn shape answers (a door its full
    height, an aircraft wingtip to wingtip), not just its footprint. Stations with nothing to do are left out. */
 hitThing(X,Y){
  const R=this.P.R; V.set(R); const hits=[];
  const person=(x,y)=>{ const [pX,pY]=V.P(x,y); return Math.abs(X-pX)<11&&Y>pY-42&&Y<pY+5; };
  for(const n of R.npcs||[]) if(person(n.x,n.y)) hits.push({z:n.y,t:{npc:n}});
  for(const p of this.crowd) if(person(p.x,p.y)) hits.push({z:p.y,t:{crowd:p}});
  for(const s of R.stations||[]){ if(!s.go) continue;
   if(s.foot){ const b=this.footBox(s); if(X>b[0]&&X<b[2]&&Y>b[1]&&Y<b[3]) hits.push({z:s.foot[3],t:{st:s}}); }
   else if(s.side){ if(this.inDoor(s,X,Y)) hits.push({z:-5000,t:{st:s}}); }
   else if(s.wall){ if(Y<R.wall+6&&Y>2&&Math.abs(X-s.x)<s.w/2+4) hits.push({z:-1e4,t:{st:s}}); } }
  hits.sort((a,b)=>b.z-a.z);
  return hits.length?hits[0].t:null;
 },
 /* the screen box a floor station's art covers (projected room units): its footprint and height, or what the art says it draws
    (an art function may carry bounds(p, h, s) -> [x0, y0, x1, y1] when it paints beyond its footprint, like a parked aircraft) */
 footBox(s){ V.set(this.P.R); const p=V.fp(s.foot), far=V.P(s.foot[0],s.foot[1]), art=FLOORART[s.art];
  const b=art&&art.bounds?art.bounds(p,s.h||20,s):null;
  return b||[Math.min(p[0],far[0])-2,p[1]-(s.h||20),p[2]+2,p[3]+2]; },
 /* a door in a side wall answers across its whole opening and its height (outdoors: the gate posts), plus the glow on the floor */
 inDoor(s,X,Y){
  const R=this.P.R, L=s.side==='L', wx=L?0:R.w, a=V.P(wx,s.y0-4), b=V.P(wx,s.y1+4), dh=V.outdoor?34:78;
  const x0=Math.min(a[0],b[0])-(L?10:4), x1=Math.max(a[0],b[0])+(L?30:6);
  if(X>=x0&&X<=x1){ const k=Math.max(0,Math.min(1,(X-a[0])/((b[0]-a[0])||1))), yb=a[1]+(b[1]-a[1])*k; if(Y<=yb+8&&Y>=yb-dh) return true; }
  const [fx,fy]=Y>=V.wall?V.unP(X,Y):[X,Y];
  return (L?fx<34:fx>R.w-34)&&fy>s.y0-8&&fy<s.y1+6;
 },
 /* how far a station is from being in reach (null = out of reach). A station answers anywhere along its front, not only at its
    centre: a floor station within 18 units of its footprint (or 22 of its use point), a wall station anywhere in front of its
    width, a door anywhere across its opening. */
 reachOf(s){
  const R=this.P.R, px=ST.px, py=ST.py; let d=Math.hypot(px-s.u[0],py-s.u[1]);
  if(s.foot){ const f=s.foot, dx=Math.max(f[0]-px,0,px-f[2]), dy=Math.max(f[1]-py,0,py-f[3]), de=Math.hypot(dx,dy); if(de<18) d=Math.min(d,de+3); }
  else if(s.wall){ const dx=Math.max(0,Math.abs(px-s.x)-s.w/2+4), dy=Math.max(0,py-(R.wall+16)); d=Math.min(d,Math.hypot(dx,dy)+2); }
  else if(s.side){ const wx=s.side==='L'?14:R.w-14, dx=Math.max(0,Math.abs(px-wx)-16), dy=Math.max(0,s.y0-py,py-s.y1); d=Math.min(d,Math.hypot(dx,dy)+2); }
  return d<22?d:null;
 },
 /* what USE acts on: the NEAREST thing in reach. People and things compete on distance alone, so a crew member answers USE
    only when they are the closest thing (never because they happen to stand beside a tool cart or a door); a near tie goes to
    what the cadet is facing. People are in reach within 27 units of their feet. */
 nearThing(){
  const R=this.P.R; let best=null, bd=1e9;
  const consider=(d,t,x)=>{ if(d==null) return; const sc=d+((x-ST.px)*ST.dir>=-2?0:2.5); if(sc<bd){ bd=sc; best=t; } };
  for(const n of R.npcs||[]){ const d=Math.hypot(ST.px-n.x,ST.py-n.y); if(d<27) consider(d,{npc:n},n.x); }
  for(const p of this.crowd){ const d=Math.hypot(ST.px-p.x,ST.py-p.y); if(d<27) consider(d,{crowd:p},p.x); }
  for(const s of R.stations||[]) if(s.go) consider(this.reachOf(s),{st:s},s.u[0]);
  return best;
 },
 /* the labels and name tags drawn last frame (screen units) answer taps too: a label is part of what it names */
 labelAt(x,y){ for(const l of this._labels||[]) if(x>=l.x-2&&x<=l.x+l.w+2&&y>=l.y-2&&y<=l.y+l.h+2) return l.t; return null; },
 /* head-on into furniture: which way along its edge reaches open floor sooner (furniture is axis-aligned boxes) */
 probeAxis(mx,my,vert){ const P=this.P, opts=vert?[[1,0],[-1,0]]:[[0,1],[0,-1]], fx=vert?0:Math.sign(mx)*8, fy=vert?Math.sign(my)*8:0; let best=null,bd=1e9;
  for(const o of opts){ for(let off=4;off<=140;off+=4){ const px=ST.px+o[0]*off, py=ST.py+o[1]*off; if(!P.free(px,py)) break; if(P.free(px+fx,py+fy)){ if(off<bd){ bd=off; best=o; } break; } } }
  if(!best){ const pref=(vert?Math.sign(mx):Math.sign(my))||1; best=vert?[pref,0]:[0,pref]; } return best; },
 walkTo(x,y,thing){
  if(Math.hypot(ST.px-x,ST.py-y)<3){ this.path=null; this.tgt=null; if(thing) this.interact(thing); return; }
  const p=findPath(this.P,ST.px,ST.py,x,y);
  this.path=p&&p.length?p:null; this.tgt=this.path?(thing||null):null;
 },
 interact(t){
  if(t.npc) return this.talk(t.npc);
  if(t.crowd){ const p=t.crowd; this.dlg={npc:{name:p.name,av:p.av,role:p.sub||''},lines:[p.line||('THIS IS '+p.name+'.')],i:0,t:0}; AUDIO.sfx('blip'); return; }
  const s=t.st, g=s.go, W=Wd(); if(!g) return;
  if(W.onOpen&&W.onOpen(s)===false) return;
  AUDIO.sfx('ok');
  if(g.room){ AUDIO.sfx('swish'); G.go('world',{room:g.room,at:g.at}); return; }
  if(g.talk){ const n=(this.P.R.npcs||[]).find(q=>q.id===g.talk); if(n) this.talk(n); return; }
  if(g.page){ G.go('page',{id:g.page,back:'world'}); return; }
  if(g.scene){ G.go(g.scene,Object.assign({back:'world',card:s.key,station:s},g.args||{})); return; }
  if(g.toast){ G.toast(g.toast,C.warn); return; }
  if(g.fn) g.fn(s);
 },
 talk(n){
  const W=Wd(), met=(G.save.mod.world.met=G.save.mod.world.met||{}), first=!met[n.id];
  met[n.id]=(met[n.id]||0)+1; G.persist();
  let lines=first&&n.first?n.first:n.lines||['HI THERE!'];
  if(!first&&n.lines&&n.lines.length>1&&!n.inOrder){ const i=(met[n.id]-2)%n.lines.length; lines=[n.lines[i]]; }   // one fresh line per visit
  this.dlg={npc:n,lines:lines.map(l=>typeof l==='function'?l():l),i:0,t:0,onDone:()=>{ if(W.onTalk) W.onTalk(n,first); }};
  this.npcDir[n.id]=ST.px>=n.x?1:-1;
  AUDIO.sfx('blip');
 },
 promptRect(L){
  if(this.dlg) return null;
  const near=this.nearThing(); if(!near) return null;
  const who=near.npc||near.crowd, [nx,ny]=who?this.toScreen(who.x,who.y,L,48):this.toScreen(ST.px,ST.py,L,46);
  const label=near.npc?'TALK TO '+near.npc.name:(near.crowd?'SAY HI TO '+near.crowd.name:near.st.label);
  const small=!!Wd().useBtn, sz=small?5.6:7, w=Math.min(VW-12,G.tw((small?'':'▶ ')+label,sz,800)+(small?14:22));
  return {x:Math.max(6,Math.min(VW-6-w,nx-w/2)),y:Math.max(L.roomY+4,Math.min(L.roomY+L.RH-22,ny-(small?8:12))),w,h:small?13:18,label,near,small};
 },
 dlgRect(){ const VH=G.VH, d=this.dlg, n=d?G.wrap(d.lines[d.i],7,VW-40,600).length:3, h=62+n*10.5; return {x:8,y:VH-56-6-h,w:VW-16,h}; },
 update(dt){
  if(this.exitM){
   const r=this.exitM.update();
   if(r==='no'||(r==null&&G.pressed.b)){ this.exitM=null; return; }
   if(r==='yes'){ G.toast(G.word('loggedOut'),C.info); G.go('title'); }
   return;
  }
  if(this.dlg){
   const d=this.dlg; d.t+=dt;
   const full=d.lines[d.i], shown=Math.floor(d.t*48);
   if(G.pressed.b){ G.pressed.b=false; this.dlg=null; AUDIO.sfx('back'); if(d.onDone) d.onDone(); return; }   // Escape closes the talk at once
   if(G.ptr.click||G.pressed.a||G.pressed.use){
    G.ptr.click=false;
    if(shown<full.length&&!G.rm()) d.t=full.length/48+1;
    else if(d.i<d.lines.length-1){ d.i++; d.t=0; AUDIO.sfx('blip'); }
    else { this.dlg=null; if(d.onDone) d.onDone(); }
   }
   return;
  }
  const L=this.layout(), CFG=G.CFG;
  if(G.backHit()){
   if(CFG.accounts&&CFG.accounts.enabled===false) return;
   if(G.activeAcct) this.exitM=G.confirm({title:G.word('logout')+'?',lines:['YOU’LL NEED YOUR PIN TO GET BACK IN.'],yes:G.word('logout'),no:'STAY'});
   else G.go('title');
   return;
  }
  if(G.gearHit()){ G.go('settings',{back:'world'}); return; }
  const TB=this.tabs(L), tab=G.navList(this.tst,TB,{noKeys:true});
  if(tab==='bag'){ G.go('dash',{back:'world'}); return; }
  if(tab&&tab.indexOf('room:')===0){ const k=tab.slice(5); if(k!==ST.room){ AUDIO.sfx('swish'); G.go('world',{room:k}); } return; }
  if(tab&&tab.indexOf('tab:')===0){ const t=TB.find(q=>q.id===tab); if(t&&t.scene){ AUDIO.sfx('swish'); G.go(t.scene,Object.assign({back:'world',from:ST.room},t.args||{})); } return; }
  const fr=this.fabRect(L); if(fr&&G.clicked(fr.x-2,fr.y-2,fr.w+4,fr.h+4)){ AUDIO.sfx('ok'); fr.F.fn(ST.room); return; }
  const mb=this.mapBtn(L); if(mb&&G.clicked(mb.x-2,mb.y-2,mb.w+4,mb.h+4)){ AUDIO.sfx('ok'); G.go(mb.M.scene,Object.assign({back:'world',from:ST.room},mb.M.args||{})); return; }
  const ub=this.useRect(L); if(ub&&G.clicked(ub.x,ub.y,ub.w,ub.h)){ if(ub.near){ this.path=null; this.tgt=null; this.interact(ub.near); } else { AUDIO.sfx('thud'); this.useNudge=.5; } return; }
  // walking: keys anywhere; a thumb-stick wherever you press and drag on the floor; a short tap walks to a spot or over to a thing
  let vx=0,vy=0;
  if(G.keys.left) vx=-1; if(G.keys.right) vx=1; if(G.keys.up) vy=-1; if(G.keys.down) vy=1;
  if(vx||vy){ this.path=null; this.tgt=null; }
  if(G.pressed.a||G.pressed.use){ const near=this.nearThing(); if(near){ this.path=null; this.tgt=null; this.interact(near); return; } else if(G.pressed.use){ AUDIO.sfx('thud'); this.useNudge=.5; } }
  const pr=this.promptRect(L);
  if(pr&&G.clicked(pr.x-4,pr.y-4,pr.w+8,pr.h+8)){ this.interact(pr.near); return; }
  const J=this.joy||(this.joy={on:false,active:false,dx:0,dy:0,dist:0});
  if(G.ptr.click&&G.ptr.sy>=L.roomY&&G.ptr.sy<=L.roomY+L.RH){ J.on=true; J.active=false; J.ox=G.ptr.sx; J.oy=G.ptr.sy; const sr=this.stickRest(L); if(sr&&Math.hypot(J.ox-sr.x,J.oy-sr.y)<sr.r+8){ J.ox=sr.x; J.oy=sr.y; J.anchored=true; } else J.anchored=false; J.kx=J.ox; J.ky=J.oy; J.dx=0; J.dy=0; }
  if(J.on){
   if(G.ptr.down){ const dx=G.ptr.x-J.ox, dy=G.ptr.y-J.oy, d=Math.hypot(dx,dy); if(!J.active&&(d>10||J.anchored)){ J.active=true; this.path=null; this.tgt=null; AUDIO.sfx('tick'); }
    if(J.active){ const R=34, k=Math.min(1,d/R); J.dx=d?dx/d*k:0; J.dy=d?dy/d*k:0; J.kx=J.ox+J.dx*R; J.ky=J.oy+J.dy*R; } }
   else {   // released: a short tap walks there, or over to the thing you tapped
    if(!J.active&&!J.anchored&&G.ptr.released&&G.ptr.rsy>=L.roomY&&G.ptr.rsy<=L.roomY+L.RH){
     const [X,Y]=this.toRoom(G.ptr.rx,G.ptr.ry,L), hit=this.labelAt(G.ptr.rx,G.ptr.ry)||this.hitThing(X,Y), [wx,wy]=this.toWorld(G.ptr.rx,G.ptr.ry,L);
     if(hit&&(hit.npc||hit.crowd)){ const n=hit.npc||hit.crowd, side=ST.px<n.x?-1:1; this.walkTo(n.x+side*17,n.y+4,hit); }
     else if(hit&&hit.st&&hit.st.go) this.walkTo(hit.st.u[0],hit.st.u[1],{st:hit.st});
     else this.walkTo(wx,Math.max(this.P.R.wall+10,wy),null);
     AUDIO.sfx('tick'); }
    J.on=false; J.active=false; J.anchored=false; J.dx=0; J.dy=0; }
  }
  const px0=ST.px, py0=ST.py; let mx=vx,my=vy, sp=110;
  if(J.active&&(J.dx||J.dy)){ const k=Math.hypot(J.dx,J.dy); mx=J.dx/k; my=J.dy/k; sp=110*(.45+.55*Math.min(1,k)); J.dist+=sp*dt; }
  if(!mx&&!my&&this.path){
   const t=this.path[0], dx=t[0]-ST.px, dy=t[1]-ST.py, d=Math.hypot(dx,dy);
   if(d<2.5){ ST.px=t[0]; ST.py=t[1]; this.path.shift();
    if(!this.path.length){ this.path=null; const th=this.tgt; this.tgt=null; if(th){ this.walk=0; this.interact(th); return; } } }
   else { mx=dx/d; my=dy/d; }
  } else if(mx&&my&&!J.active){ mx*=.7071; my*=.7071; }
  if(mx||my){
   const SP=sp, nx=ST.px+mx*SP*dt, ny=ST.py+my*SP*dt, P=this.P;
   if(P.free(nx,ny)){ ST.px=nx; ST.py=ny; this.slide=null; }
   else if(!this.path){   // steering (stick or keys) into furniture: if the main direction is open, keep going that way;
    // if it is blocked, slide along the edge the way the stick leans (head-on: toward the nearer end), and stick with that choice until clear
    const step=SP*dt, ax=Math.abs(mx), ay=Math.abs(my), vert=this.slide?(this.slide.vert?ay*1.5>=ax:ay>=ax*1.5):ay>=ax, into=vert?Math.sign(my):Math.sign(mx), xOk=P.free(nx,ST.py), yOk=P.free(ST.px,ny);   // a wobbly thumb keeps its slide (hysteresis)
    if(vert?yOk:xOk){ if(vert) ST.py=ny; else ST.px=nx; this.slide=null; }
    else { if(this.slide&&(this.slide.vert!==vert||this.slide.into!==into)) this.slide=null;
     if(!this.slide) this.slide={vert,into,dir:vert?((ax>.12&&xOk)?[Math.sign(mx),0]:this.probeAxis(mx,my,true)):((ay>.12&&yOk)?[0,Math.sign(my)]:this.probeAxis(mx,my,false))};
     const d=this.slide.dir, tx=ST.px+d[0]*step*.85, ty=ST.py+d[1]*step*.85; if(P.free(tx,ty)){ ST.px=tx; ST.py=ty; } else this.slide.dir=[-d[0],-d[1]]; } }
   else if(P.free(nx,ST.py)) ST.px=nx; else if(P.free(ST.px,ny)) ST.py=ny; else { this.path=null; this.tgt=null; }
   if(Math.abs(mx)>.25) ST.dir=mx>0?1:-1;
   this.walk+=dt*11;
  } else this.walk=0;
  this.walked=(this.walked||0)+Math.hypot(ST.px-px0,ST.py-py0);   // how far the cadet has walked here, by any means (the first briefing reads it)
  this.followCam(L,dt); if(this.useNudge>0) this.useNudge-=dt;
 },
 draw(c){
  const L=this.layout(), R=this.P.R, P=R.palette||{}, VH=G.VH, W=Wd(); V.set(R);
  const D=V.D, sh=V.sh, kd=V.kd, t=G.rm()?0:G.time;
  // the backdrop the diorama floats in
  const bd=c.createLinearGradient(0,L.roomY,0,L.roomY+L.RH); bd.addColorStop(0,P.back||'#070a12'); bd.addColorStop(1,P.back2||'#02030a'); c.fillStyle=bd; c.fillRect(0,L.roomY,VW,L.RH);
  c.save(); c.beginPath(); c.rect(0,L.roomY,VW,L.RH); c.clip();
  c.translate(0,L.roomY); c.scale(L.Z,L.Z); c.translate(-this.camX,-this.camY);
  // the slab the floor sits on (the diorama's cut edge), then the floor in its own plane
  const nl=V.P(0,R.h), nr=V.P(R.w,R.h), outdoor=V.outdoor;
  if(outdoor){ const gg=c.createLinearGradient(0,R.wall,0,nl[1]+40); gg.addColorStop(0,G.shade(P.ground||'#4f7a3e',.9)); gg.addColorStop(1,G.shade(P.ground||'#4f7a3e',.45)); c.fillStyle=gg; c.fillRect(-D*sh-600,R.wall-1,R.w+D*sh+1200,D*kd+60);   // the ground goes on past the edges
   c.fillStyle='rgba(0,0,0,.25)'; V.quad(c,[[nl[0]+6,nl[1]+4],[nr[0]+8,nr[1]+4],[nr[0]+8,nr[1]+14],[nl[0]+6,nl[1]+14]]); c.fill(); }
  else { c.fillStyle='rgba(0,0,0,.5)'; V.quad(c,[[nl[0]-14,nl[1]+8],[nr[0]+10,nr[1]+8],[nr[0]+10,nr[1]+30],[nl[0]-14,nl[1]+30]]); c.fill();   // the diorama's drop shadow
   c.fillStyle=P.slab||'#15131a'; V.quad(c,[[nl[0],nl[1]],[nr[0],nr[1]],[nr[0],nr[1]+9],[nl[0],nl[1]+9]]); c.fill(); c.fillStyle='rgba(0,0,0,.35)'; c.fillRect(nl[0],nl[1]+9,nr[0]-nl[0],2); }
  c.save(); V.quad(c,[[0,R.wall],[R.w,R.wall],[nr[0],nr[1]],[nl[0],nl[1]]]); c.clip();
  V.plane(c,0,q=>{ if(G.ART&&G.ART.draw(q,'room:'+R.key+':floor',0,R.wall,R.w,D)){ if(R.leadLine){ q.strokeStyle='#ffc21a'; q.lineWidth=4; q.beginPath(); const L=R.leadLine; q.moveTo(L[0],L[1]); for(let i=2;i<L.length;i+=2) q.lineTo(L[i],L[i+1]); q.stroke(); } }   // a painted floor plate keeps the room's lead-in line (a marking, so drawn by code)
   else (FLOORS[R.floor]||FLOORS.wood)(q,R,P);
   q.fillStyle=vgrad(q,R.wall,R.wall+26,'rgba(0,0,0,.42)','rgba(0,0,0,0)'); q.fillRect(0,R.wall,R.w,26);                 // the back wall's shadow on the floor
   q.fillStyle=hgrad(q,R.w-30,R.w,'rgba(0,0,0,0)','rgba(0,0,0,.34)'); q.fillRect(R.w-30,R.wall,30,D);                    // and the right wall's
   q.fillStyle=hgrad(q,0,22,'rgba(0,0,0,.22)','rgba(0,0,0,0)'); q.fillRect(0,R.wall,22,D);
   if(W.roomFx) W.roomFx(q,R,'floor',L); });
  c.restore();
  // the back wall, its base shadow, and the wall art
  { const RW=outdoor?Object.assign({},R,{w:Math.ceil(V.W)+60}):R;   // outdoors the sky runs past the edges of the floor
    c.save(); c.beginPath(); c.rect(outdoor?-200:0,-40,RW.w+(outdoor?200:0),R.wall+40); c.clip(); if(outdoor){ if(!(G.ART&&G.ART.draw(c,'room:'+R.key+':wall',-200,0,RW.w+200,R.wall))){ c.save(); c.translate(-200,0); (WALLS[R.wallStyle]||WALLS.panel)(c,Object.assign({},RW,{w:RW.w+200,tower:RW.tower!=null?RW.tower+200:null}),P); c.restore(); } } else if(!(G.ART&&G.ART.draw(c,'room:'+R.key+':wall',0,0,R.w,R.wall))) (WALLS[R.wallStyle]||WALLS.panel)(c,R,P); c.restore(); }
  c.fillStyle=vgrad(c,R.wall-6,R.wall,'rgba(0,0,0,0)','rgba(0,0,0,.45)'); c.fillRect(0,R.wall-6,R.w,6);
  for(const s of R.stations||[]) if(s.wall){ const k=G.ART&&(G.ART.has('station:'+R.key+':'+s.key)?'station:'+R.key+':'+s.key:(G.ART.has('wall:'+s.art)?'wall:'+s.art:null)); if(!(k&&G.ART.draw(c,k,s.x-s.w/2,0,s.w,R.wall))) (WALLART[s.art]||WALLART.board)(c,s,R,s.col); }
  // the right wall shows its inside; the left wall is seen edge-on; a wall end-cap on both (outdoor places have no walls)
  const rw=P.wall||'#4a3a5a', far=V.P(R.w,R.wall), near=V.P(R.w,R.h);
  if(!outdoor){
  const rg=c.createLinearGradient(far[0],0,near[0],0); rg.addColorStop(0,G.shade(rw,.55)); rg.addColorStop(1,G.shade(rw,.78)); c.fillStyle=rg; V.quad(c,[[far[0],0],[near[0],near[1]-R.wall],[near[0],near[1]],[far[0],far[1]]]); c.fill();
  c.fillStyle='rgba(255,255,255,.05)'; for(let d=20;d<D;d+=40){ const a=V.P(R.w,R.wall+d); c.fillRect(a[0],a[1]-R.wall,1.2,R.wall); }
  c.fillStyle=P.trim?G.rgba(P.trim,.5):'rgba(0,0,0,.35)'; V.quad(c,[[far[0],far[1]-5],[near[0],near[1]-5],[near[0],near[1]],[far[0],far[1]]]); c.fill();   // baseboard
  for(const s of R.stations||[]) if(s.side&&s.side==='R'){ const a=V.P(R.w,s.y0), b=V.P(R.w,s.y1), dh=72;   // a door in the right wall
   c.fillStyle='#0c0b10'; V.quad(c,[[a[0],a[1]-dh],[b[0],b[1]-dh],[b[0],b[1]],[a[0],a[1]]]); c.fill();
   const g=c.createLinearGradient(a[0],0,b[0],0); g.addColorStop(0,'rgba(255,220,140,.28)'); g.addColorStop(1,'rgba(255,220,140,0)'); c.fillStyle=g; V.quad(c,[[a[0],a[1]-dh+4],[b[0],b[1]-dh+4],[b[0],b[1]],[a[0],a[1]]]); c.fill();
   c.fillStyle=G.rgba(C.accent,.6); V.quad(c,[[a[0],a[1]-dh],[a[0]+1.5,a[1]-dh],[a[0]+1.5,a[1]],[a[0],a[1]]]); c.fill(); G.icon(s.icon||'play',c,(a[0]+b[0])/2,(a[1]+b[1])/2-dh*.55,12,'rgba(255,255,255,.7)'); }
  const lf=V.P(0,R.wall), ln=V.P(0,R.h); const eg=c.createLinearGradient(0,0,0,ln[1]); eg.addColorStop(0,G.shade(rw,1.15)); eg.addColorStop(1,G.shade(rw,.7));
  c.fillStyle=eg; V.quad(c,[[lf[0]-6,0],[lf[0],0],[ln[0],ln[1]-R.wall],[ln[0]-6,ln[1]-R.wall]]); c.fill();   // the left wall's cut edge (top)
  c.fillStyle=G.shade(rw,.45); V.quad(c,[[lf[0]-6,0],[ln[0]-6,ln[1]-R.wall],[ln[0]-6,ln[1]+9],[lf[0]-6,R.wall+9]]); c.fill();   // its face
  c.fillStyle=G.shade(rw,.9); c.fillRect(far[0],-2,2,R.wall+2); c.fillRect(-6,-2,8,R.wall+2);
  }
  for(const s of R.stations||[]) if(outdoor&&s.side){ const a=V.P(s.side==='L'?0:R.w,s.y0), b=V.P(s.side==='L'?0:R.w,s.y1);   // outdoors: a gate post and a glow on the ground
   V.plane(c,0,q=>{ const x0=s.side==='L'?0:R.w-40, g=q.createLinearGradient(x0,0,x0+40,0); g.addColorStop(0,s.side==='L'?'rgba(255,220,140,.35)':'rgba(255,220,140,0)'); g.addColorStop(1,s.side==='L'?'rgba(255,220,140,0)':'rgba(255,220,140,.35)'); q.fillStyle=g; q.fillRect(x0,s.y0,40,s.y1-s.y0); });
   for(const q of [a,b]){ c.fillStyle='#cfd4dc'; c.fillRect(q[0]-1.5,q[1]-26,3,26); c.fillStyle=G.rgba(C.accent,.9); c.fillRect(q[0]-2.5,q[1]-30,5,5); } }
  for(const s of R.stations||[]) if(!outdoor&&s.side&&s.side==='L'){ const a=V.P(0,s.y0), b=V.P(0,s.y1);   // a doorway through the left edge: a glow on the floor and a frame
   V.plane(c,0,q=>{ const g=q.createLinearGradient(0,0,40,0); g.addColorStop(0,'rgba(255,220,140,.35)'); g.addColorStop(1,'rgba(255,220,140,0)'); q.fillStyle=g; q.fillRect(0,s.y0,40,s.y1-s.y0); });
   c.fillStyle='#0c0b10'; V.quad(c,[[a[0]-6,a[1]-72],[a[0],a[1]-72],[b[0],b[1]],[b[0]-6,b[1]]]); c.fill(); c.fillStyle=G.rgba(C.accent,.6); V.quad(c,[[a[0]-1,a[1]-72],[a[0]+1,a[1]-72],[b[0]+1,b[1]],[b[0]-1,b[1]]]); c.fill(); G.icon(s.icon||'play',c,a[0]-2,(a[1]+b[1])/2-40,12,'rgba(255,255,255,.7)'); }
  // everything standing on the floor, back to front
  const items=[];
  const painted=(key,art)=>G.ART&&(G.ART.has(key)?key:(G.ART.has('prop:'+art)?'prop:'+art:null));
  for(const s of R.stations||[]) if(s.foot) items.push({y:s.foot[3],d:()=>{ if(!s.noShadow&&(s.h||20)>4) V.shadow(c,s.foot,s.h||20); const k=painted('station:'+R.key+':'+s.key,s.art); if(!(k&&G.ART.sprite(c,k,V.fp(s.foot),s.h||20))) (FLOORART[s.art]||FLOORART.desk)(c,V.fp(s.foot),s.h||20,s.col,s,s.foot); }});
  for(const d of R.decor||[]) items.push({y:d.foot[3],d:()=>{ if(!d.noShadow&&(d.h||16)>4) V.shadow(c,d.foot,d.h||16,.3); const k=painted('decor:'+R.key+':'+d.art,d.art); if(!(k&&G.ART.sprite(c,k,V.fp(d.foot),d.h||16))) (FLOORART[d.art]||FLOORART.crate)(c,V.fp(d.foot),d.h||16,d.col,d,d.foot); }});
  for(const n of R.npcs||[]){ const dir=this.npcDir[n.id]||(n.dir||1); items.push({y:n.y,d:()=>{ const [X,Y]=V.P(n.x,n.y); if(!(G.ART&&G.ART.person(c,'npc:'+n.id,X,Y+Math.sin(t*2+n.x)*.3))) G.drawPerson(c,X,Y+Math.sin(t*2+n.x)*.3,1,n.av,dir,0); }}); }
  for(const p of this.crowd) items.push({y:p.y,d:()=>{ const [X,Y]=V.P(p.x,p.y); G.drawPerson(c,X,Y,1,p.av,ST.px>=p.x?1:-1,0); }});
  items.push({y:ST.py,d:()=>{ const [X,Y]=V.P(ST.px,ST.py); G.drawPerson(c,X,Y,1,G.playerAv?G.playerAv():{},ST.dir,this.walk); }});
  items.sort((a,b)=>a.y-b.y).forEach(i=>i.d());
  if(W.roomFx) W.roomFx(c,R,'over',L);
  // the thing in reach glows (Among Us style), when the USE button is on
  if(W.useBtn&&!this.dlg){ const nr=this.nearThing(); if(nr){ const pulse=G.rm()?.7:.55+Math.sin(G.time*5)*.25; c.save(); c.strokeStyle=G.rgba(C.accentHi,pulse); c.lineWidth=2; c.shadowColor=C.accentHi; c.shadowBlur=G.rm()?0:8;
   if(nr.npc||nr.crowd){ const n=nr.npc||nr.crowd, [X,Y]=V.P(n.x,n.y); c.beginPath(); c.ellipse(X,Y,11,4.5,0,0,7); c.stroke(); }
   else if(nr.st.foot){ const f=nr.st.foot; V.plane(c,0,q=>{ G.rrect(f[0]-4,f[1]-4,f[2]-f[0]+8,f[3]-f[1]+8,5); q.stroke(); }); }
   else if(nr.st.wall){ const s2=nr.st; G.rrect(s2.x-s2.w/2-3,14,s2.w+6,R.wall-34,6); c.stroke(); }
   else if(nr.st.side){ const s2=nr.st, a=V.P(s2.side==='L'?0:R.w,s2.y0), b=V.P(s2.side==='L'?0:R.w,s2.y1); c.beginPath(); c.moveTo(a[0],a[1]); c.lineTo(b[0],b[1]); c.lineTo(b[0],b[1]-60); c.lineTo(a[0],a[1]-60); c.closePath(); c.stroke(); }
   c.restore(); } }
  // where you're walking to
  if(this.path&&this.path.length){ const e=this.path[this.path.length-1]; V.plane(c,0,q=>{ q.strokeStyle=G.rgba(C.accentHi,.8); q.lineWidth=1.4; q.beginPath(); q.ellipse(e[0],e[1],6+Math.sin(G.time*8),4,0,0,7); q.stroke(); }); }
  c.restore();
  // labels (screen space, so they stay readable at any zoom)
  const pr0=this.promptRect(L), PB=pr0&&pr0.small?{x0:pr0.x-4,x1:pr0.x+pr0.w+4,y0:pr0.y-5,y1:pr0.y+pr0.h+5}:null, placed=[];   // labels that would overlap an earlier one step up a row
  const LB=this._labels=[];   // what was drawn where: labels and name tags answer taps (labelAt)
  for(const s of R.stations||[]){
   if(!s.label||s.noLabel||(pr0&&pr0.near.st===s)) continue;   // the prompt already names the station in reach
   let X,Y; if(s.wall){ X=s.x; Y=R.wall-8; } else if(s.side){ const a=V.P(s.side==='L'?0:R.w,(s.y0+s.y1)/2); X=a[0]+(s.side==='L'?26:-26); Y=a[1]-78; } else { const p=V.fp(s.foot), far=V.P((s.foot[0]+s.foot[2])/2,s.foot[1]); X=(p[0]+p[2])/2-(p[3]-p[1])*sh*.5; Y=far[1]-(s.h||20)-6; }
   let [sx,sy]=this.roomToScreen(X,Y,L); if(sy<L.roomY+2||sy>L.roomY+L.RH-12) continue;
   const w=G.tw(s.label,5.4,800)+10; if(sx<-w*.3||sx>VW+w*.3) continue; sx=Math.max(4+w/2,Math.min(VW-4-w/2,sx));   // a label half off the edge slides back on screen
   let guard=0; while(guard++<4&&placed.some(p=>Math.abs(p.y-sy)<(p.h+12)/2+1&&sx-w/2<p.x+p.w/2+2&&sx+w/2>p.x-p.w/2-2)) sy-=13;
   if(PB&&sx+w/2>PB.x0&&sx-w/2<PB.x1&&sy+6>PB.y0&&sy-6<PB.y1) continue;   // the prompt over a person wins: a label crowding it waits until you walk on
   placed.push({x:sx,y:sy,w,h:12}); if(s.go) LB.push({x:sx-w/2,y:sy-6,w,h:12,t:{st:s}});
   G.rrect(sx-w/2,sy-6,w,12,6); c.fillStyle='rgba(10,10,16,.78)'; c.fill(); G.txt(s.label,sx,sy-3.6,5.4,s.go?'#fff':C.dim,'center',undefined,800);
  }
  const pr=this.promptRect(L), prWho=pr&&(pr.near.npc||pr.near.crowd);
  for(const n of (R.npcs||[]).concat(this.crowd)){ if(n===prWho) continue; let [sx,sy]=this.toScreen(n.x,n.y,L,44); if(sy<L.roomY) continue; const hw=G.tw(n.name,5.4,800)/2+3; if(sx<4||sx>VW-4) continue; sx=Math.max(hw,Math.min(VW-hw,sx));   // only for people on screen
   if(placed.some(p=>Math.abs(p.y-(sy+3.5))<(p.h+9)/2&&sx-hw<p.x+p.w/2&&sx+hw>p.x-p.w/2)) continue;   // a name tag gives way to a station label
   LB.push({x:sx-hw,y:sy-1,w:hw*2,h:8,t:n.crowd?{crowd:n}:{npc:n}}); G.txt(n.name,sx,sy,5.4,n.crowd?C.info:C.title,'center',undefined,800); }
  if(pr&&pr.small){ G.rrect(pr.x,pr.y,pr.w,pr.h,6.5); c.fillStyle='rgba(10,10,16,.85)'; c.fill(); c.strokeStyle=G.rgba(C.accentHi,.9); c.lineWidth=1; c.stroke(); G.txt(pr.label,pr.x+pr.w/2,pr.y+3.4,5.6,C.accentHi,'center',pr.w-6,800); c.fillStyle=G.rgba(C.accentHi,.9); c.beginPath(); c.moveTo(pr.x+pr.w/2-3,pr.y+pr.h); c.lineTo(pr.x+pr.w/2+3,pr.y+pr.h); c.lineTo(pr.x+pr.w/2,pr.y+pr.h+3.5); c.closePath(); c.fill(); }
  else if(pr){ c.save(); if(!G.rm()){ c.shadowColor=C.accentHi; c.shadowBlur=8+Math.sin(G.time*5)*3; } G.rrect(pr.x,pr.y,pr.w,pr.h,9); c.fillStyle=C.accentHi; c.fill(); c.restore(); G.txt('▶ '+pr.label,pr.x+pr.w/2,pr.y+4,7,C.onAccent,'center',pr.w-8,800); }
  const sr=this.stickRest(L), Jr=this.joy; if(sr&&!(Jr&&Jr.active)){ c.save(); c.globalAlpha=.5; c.beginPath(); c.arc(sr.x,sr.y,sr.r,0,7); c.fillStyle='rgba(10,12,20,.4)'; c.fill(); c.strokeStyle='rgba(255,255,255,.3)'; c.lineWidth=1.5; c.stroke(); for(let k=0;k<4;k++){ const a=k*Math.PI/2; c.fillStyle='rgba(255,255,255,.45)'; c.beginPath(); c.moveTo(sr.x+Math.cos(a)*(sr.r-5),sr.y+Math.sin(a)*(sr.r-5)); c.lineTo(sr.x+Math.cos(a+.25)*(sr.r-11),sr.y+Math.sin(a+.25)*(sr.r-11)); c.lineTo(sr.x+Math.cos(a-.25)*(sr.r-11),sr.y+Math.sin(a-.25)*(sr.r-11)); c.closePath(); c.fill(); } c.beginPath(); c.arc(sr.x,sr.y,13,0,7); c.fillStyle='rgba(255,255,255,.35)'; c.fill(); c.restore(); }
  const ub=this.useRect(L);
  if(ub){ const on=!!ub.near, press=G.held(ub.x,ub.y,ub.w,ub.h), cx=ub.x+ub.w/2, cy=ub.y+ub.h/2+(press?1:0)+(this.useNudge>0?Math.sin(this.useNudge*40)*2:0), r=ub.w/2;
   c.save(); if(on&&!G.rm()){ c.shadowColor=C.accentHi; c.shadowBlur=10+Math.sin(G.time*5)*4; } c.beginPath(); c.arc(cx,cy,r,0,7); const ug=c.createRadialGradient(cx-r*.3,cy-r*.35,r*.1,cx,cy,r); if(on){ ug.addColorStop(0,G.shade(C.accentHi,1.25)); ug.addColorStop(1,G.shade(C.accentHi,.75)); } else { ug.addColorStop(0,'rgba(60,64,76,.75)'); ug.addColorStop(1,'rgba(30,32,40,.75)'); } c.fillStyle=ug; c.fill(); c.restore();
   c.beginPath(); c.arc(cx,cy,r,0,7); c.strokeStyle=on?'rgba(0,0,0,.35)':'rgba(255,255,255,.18)'; c.lineWidth=1.5; c.stroke();
   const n=ub.near, ic=n?(n.npc||n.crowd?'chat':(n.st.icon||'play')):'play'; G.icon(ic,c,cx,cy-8,18,on?C.onAccent:'rgba(255,255,255,.35)'); G.txt('USE',cx,cy+9,7.4,on?C.onAccent:'rgba(255,255,255,.35)','center',undefined,800);
   const KH=this.keyHints(); if(KH&&KH.use){ const kw=Math.max(11,G.tw(KH.use,5.4,800)+7), kx=ub.x+ub.w-kw+2, ky=ub.y-2; G.rrect(kx,ky,kw,11,3); c.fillStyle=on?'#F4E3B4':'rgba(30,34,44,.92)'; c.fill(); c.strokeStyle=on?'rgba(0,0,0,.45)':'rgba(255,255,255,.35)'; c.lineWidth=1; c.stroke(); G.txt(KH.use,kx+kw/2,ky+2.6,5.4,on?'#10263D':'rgba(255,255,255,.8)','center',undefined,800); } }
  if(!sr&&!this.dlg){ const KH=this.keyHints(); if(KH&&KH.walk){ const t1=KH.walk, w1=Math.min(VW*.62,G.tw(t1,5.2,800)+16), x1=8, y1=L.roomY+L.RH-26; G.rrect(x1,y1,w1,15,7.5); c.fillStyle='rgba(10,12,20,.62)'; c.fill(); c.strokeStyle='rgba(255,255,255,.18)'; c.lineWidth=1; c.stroke(); G.txt(t1,x1+w1/2,y1+4.2,5.2,'rgba(255,255,255,.82)','center',w1-10,800); } }
  const mb=this.mapBtn(L);
  if(mb&&G.ART&&G.ART.disc(c,'map',mb.x+mb.w/2,mb.y+mb.h/2+(G.held(mb.x,mb.y,mb.w,mb.h)?1:0),mb.w+6)){ G.txt('MAP',mb.x+mb.w/2,mb.y+mb.h-8.5,5,C.accentText,'center',undefined,800); }
  else if(mb){ const press=G.held(mb.x,mb.y,mb.w,mb.h); c.save(); if(!G.rm()){ c.shadowColor='rgba(0,0,0,.5)'; c.shadowBlur=8; c.shadowOffsetY=3; } c.beginPath(); c.arc(mb.x+mb.w/2,mb.y+mb.h/2+(press?1:0),mb.w/2,0,7); c.fillStyle=G.rgba(C.bg,.9); c.fill(); c.restore(); c.beginPath(); c.arc(mb.x+mb.w/2,mb.y+mb.h/2+(press?1:0),mb.w/2,0,7); c.strokeStyle=G.rgba(C.accentHi,.85); c.lineWidth=1.4; c.stroke(); G.icon(mb.M.icon||'map',c,mb.x+mb.w/2,mb.y+mb.h/2-2+(press?1:0),15,C.accentHi); G.txt(mb.M.label||'MAP',mb.x+mb.w/2,mb.y+mb.h-10,3.8,C.ink,'center',undefined,800); }
  const fr=this.fabRect(L);
  if(fr&&fr.round&&G.ART&&G.ART.disc(c,'tower',fr.x+fr.w/2,fr.y+fr.h/2+(G.held(fr.x,fr.y,fr.w,fr.h)?1:0),fr.w+6)){ G.txt('TOWER',fr.x+fr.w/2,fr.y+fr.h-8.5,5,C.accentText,'center',undefined,800); }
  else if(fr&&fr.round){ const press=G.held(fr.x,fr.y,fr.w,fr.h), cx=fr.x+fr.w/2, cy=fr.y+fr.h/2+(press?1:0); c.save(); if(!G.rm()){ c.shadowColor='rgba(0,0,0,.5)'; c.shadowBlur=8; c.shadowOffsetY=3; } c.beginPath(); c.arc(cx,cy,fr.w/2,0,7); c.fillStyle=G.rgba(C.bg,.9); c.fill(); c.restore(); c.beginPath(); c.arc(cx,cy,fr.w/2,0,7); c.strokeStyle=G.rgba(C.accentHi,.85); c.lineWidth=1.4; c.stroke(); G.icon(fr.F.icon||'chat',c,cx,cy-2,14,C.accentHi); G.txt(fr.F.short||'',cx,fr.y+fr.h-10+(press?1:0),3.8,C.ink,'center',undefined,800); }
  else if(fr){ const press=G.held(fr.x,fr.y,fr.w,fr.h); G.rrect(fr.x,fr.y+(press?1:0),fr.w,fr.h,12); c.fillStyle=G.rgba(C.bg,.88); c.fill(); c.strokeStyle=G.rgba(C.accentHi,.85); c.lineWidth=1.4; c.stroke();
   G.icon(fr.F.icon||'chat',c,fr.x+14,fr.y+12+(press?1:0),12,C.accentHi); G.txt(fr.F.label,fr.x+25,fr.y+8.4+(press?1:0),6,C.ink,'left',undefined,800); }
  if(this.dlg) this.drawDlg(c);
  // tab bar
  c.fillStyle=G.rgba(C.bg,.96); c.fillRect(0,L.barY,VW,L.barH); c.fillStyle=G.rgba(C.accent,.5); c.fillRect(0,L.barY,VW,1);
  this.tabs(L).forEach(t=>{
   const on=t.on, press=G.held(t.x,t.y,t.w,t.h), cx=t.x+t.w/2, cy=t.y+15+(press?1:0), r=12.5;
   if(on){ G.rrect(t.x,t.y,t.w,t.h,10); c.fillStyle=G.rgba(C.accent,.14); c.fill(); }
   /* the board's painted disc when the rendition ships one (icon:<name>); otherwise a gold disc with a navy glyph */
   const dn=t.room?({lounge:'lounge',classroom:'class',hangar:'hangar'})[t.room]:(t.id==='bag'?'flightbag':(t.id==='tab:path'?'path':null));
   if(on&&G.ART&&dn){ c.save(); c.shadowColor=G.rgba(C.accentHi,.55); c.shadowBlur=10; c.beginPath(); c.arc(cx,cy,r+1,0,7); c.fillStyle=G.rgba(C.accentHi,.35); c.fill(); c.restore(); }
   if(!(G.ART&&dn&&G.ART.disc(c,dn,cx,cy,2*r+4,!on))){
    c.beginPath(); c.arc(cx,cy,r,0,7); if(on){ const g=c.createLinearGradient(0,cy-r,0,cy+r); g.addColorStop(0,C.accentHi); g.addColorStop(.55,C.accent); g.addColorStop(1,C.accentLo); c.fillStyle=g; } else c.fillStyle=G.rgba(C.bg,.9); c.fill();
    c.strokeStyle=on?G.rgba('#FFF2C8',.85):G.rgba(C.accent,.55); c.lineWidth=on?1.4:1; c.stroke();
    G.icon(t.icon||'grid',c,cx,cy,13,on?C.bg:C.accentText); }
   G.txt(t.label,cx,t.y+t.h-11,5.4,on?C.accentText:C.dim,'center',t.w-4,800);
  });
  G.topBar(R.name,{backLabel:G.activeAcct?G.word('exit'):'BACK',back:!(G.CFG.accounts&&G.CFG.accounts.enabled===false),sub:W.sub?W.sub():G.who(),gear:true});
  if(this.exitM) this.exitM.draw(c);
  this.drawStick(c);
 },
 /* the thumb-stick, drawn last so it rides over everything (a tutorial overlay calls it again after itself) */
 drawStick(c){ const J=this.joy; if(J&&J.active&&!G.rm()){ c.save(); c.globalAlpha=.75; c.beginPath(); c.arc(J.ox,J.oy,34,0,7); c.fillStyle='rgba(10,12,20,.35)'; c.fill(); c.strokeStyle='rgba(255,255,255,.35)'; c.lineWidth=1.5; c.stroke(); c.beginPath(); c.arc(J.kx,J.ky,15,0,7); const kg=c.createRadialGradient(J.kx-4,J.ky-5,2,J.kx,J.ky,15); kg.addColorStop(0,G.shade(C.accentHi,1.2)); kg.addColorStop(1,G.shade(C.accentHi,.7)); c.fillStyle=kg; c.fill(); c.strokeStyle='rgba(0,0,0,.4)'; c.lineWidth=1; c.stroke(); c.restore(); } },
 drawDlg(c){
  const d=this.dlg, r=this.dlgRect(), n=d.npc;
  G.panel(r.x,r.y,r.w,r.h,{r:14});
  G.drawPortrait(c,r.x+10,r.y+10,40,n.av,C.accent);
  G.txt(n.name,r.x+58,r.y+11,8.6,C.title,'left',r.w-70,800);
  if(n.role) G.txt(n.role,r.x+58,r.y+25,5.8,C.dim,'left',r.w-70,700);
  const full=d.lines[d.i], txt=G.rm()?full:full.slice(0,Math.floor(d.t*48));
  G.para(txt,r.x+12,r.y+54,7,C.ink,'left',r.w-24,10.5,600);
  G.txt((d.i<d.lines.length-1?'TAP FOR MORE ':'TAP TO CLOSE ')+(d.i+1)+'/'+d.lines.length,r.x+r.w-10,r.y+r.h-12,5.4,C.accentText,'right',undefined,800);
 }
};
G.world={state:ST,prep,findPath,room:()=>ST.room};
})();
