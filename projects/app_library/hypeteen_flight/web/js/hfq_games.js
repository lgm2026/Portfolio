/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* HYPETEEN FLIGHT ACADEMY - THE GAMES: the shared kit every mini game uses, the full slate (built + coming),
   and the GAMES list in the Flight Bag.
   A game scene calls:
     MG.start(this, id, a)        in enter()   (pause menu, music, back target)
     if(MG.update(this, dt)) return;   first thing in update()   (handles pause + the results screen)
     MG.end(this, score, {line})  when a round is over  -> best score, XP, badges, the results screen
     MG.hud(this, c, right)       last thing in draw() (top bar with pause + score; results + pause on top)
   XP from games is small and capped per day, so learning stays the main way to climb the phases.
   Progress per cadet: G.save.mod.games = {id:{best, plays, at}}, plus {day:{d, xp}} */
(function(){
const H=G.HFQ, C=G.C, VW=G.VW, PI=Math.PI;

/* ============================ THE SLATE ============================
   built: playable now. best: 'high' or 'low' (golf strokes, pool shots). learn: the Ground School unit it practices. */
H.GAMES=[
 {id:'landing',name:'LANDING CHALLENGE',where:'RUNWAY',icon:'plane',built:1,best:'high',unit:'PTS',learn:'airports',desc:'Fly the glide path by the PAPI lights, flare, and grease the landing.'},
 {id:'marshal',name:'MARSHALLER SIGNALS',where:'PARKING STAND',icon:'flag',built:1,best:'high',unit:'PTS',learn:'airports',desc:'Read the marshaller’s wands and taxi into your parking spot.'},
 {id:'paper',name:'PAPER PLANE TOSS',where:'VIEWING PLATFORM',icon:'plane',built:1,best:'high',unit:'FT',learn:'flight',desc:'Launch a paper airplane off the platform. Too steep and it stalls!'},
 {id:'bags',name:'BAG TOSS',where:'THE GAME ROOM',icon:'flag',built:1,best:'high',unit:'PTS',learn:'weather',desc:'Cornhole with a crosswind: read the windsock and aim into the wind.'},
 {id:'golf',name:'HANGAR MINI GOLF',where:'THE GAME ROOM',icon:'flag',built:1,best:'low',unit:'STROKES',desc:'Six holes around propellers, hangar doors and baggage carts.'},
 {id:'pong',name:'PROP PONG',where:'THE GAME ROOM',icon:'joy',built:1,best:'high',unit:'MARGIN',desc:'Ping-pong on a runway-striped table. First to 7.'},
 {id:'pool',name:'POOL',where:'THE GAME ROOM',icon:'joy',built:1,best:'low',unit:'SHOTS',learn:'radio',desc:'Sink ALFA through GOLF in as few shots as you can.'},
 {id:'cargo',name:'CARGO STACK',where:'THE GAME ROOM ARCADE',icon:'grid',built:1,best:'high',unit:'PTS',learn:'perf',desc:'Load the cargo hold. Clear rows, and keep the load balanced.'},
 {id:'spot',name:'PLANE SPOTTER',where:'VIEWING PLATFORM',icon:'search',built:1,best:'high',unit:'PTS',learn:'types',desc:'Name the aircraft flying past. Every one you spot joins your hangar.'},
 {id:'metar',name:'METAR DECODER',where:'THE TOWER',icon:'cloud',built:1,best:'high',unit:'PTS',learn:'weather',desc:'Crack the code of real-style weather reports: wind, visibility, clouds.'},
 {id:'wx',name:'WEATHER CALL',where:'THE TOWER',icon:'cloud',built:1,best:'high',unit:'PTS',learn:'weather',desc:'VFR, MVFR, IFR or LIFR? Read the sky and make the call.'},
 {id:'lightgun',name:'LIGHT GUN SIGNALS',where:'THE TOWER',icon:'flag',built:1,best:'high',unit:'PTS',learn:'airports',desc:'Your radio is out: read the tower’s green, red and white light signals.'},
 {id:'depart',name:'DEPARTURE',where:'THE TOWER + RUNWAY',icon:'headset',built:1,best:'high',unit:'PTS',learn:'radio',desc:'ATIS, ground, tower: make every radio call from the parking stand to takeoff.'},
 {id:'arrive',name:'ARRIVAL',where:'THE TOWER + RUNWAY',icon:'headset',built:1,best:'high',unit:'PTS',learn:'radio',desc:'Call the tower, fly the pattern, land and clear the runway.'},
 {id:'taxi',name:'TAXI MAZE',where:'THE TOWER + RUNWAY',icon:'pin',built:1,best:'high',unit:'PTS',learn:'airports',desc:'Follow your taxi clearance by the signs, and stop at the hold-short line.'},
 {id:'preflight',name:'PREFLIGHT RACE',where:'PARKING STAND',icon:'check',built:1,best:'high',unit:'PTS',learn:'decisions',desc:'Walk around your airplane and find what’s wrong before you fly.'},
 {id:'wash',name:'WASH DAY',where:'WASH RACK',icon:'drop',built:1,best:'high',unit:'PTS',learn:'instruments',desc:'Wash your aircraft the right way. Cover the pitot tube first!'},
 /* -------- Round 5 -------- */
 {id:'cloud',name:'CLOUD SPOTTER',where:'VIEWING PLATFORM',icon:'cloud',built:1,best:'high',unit:'PTS',learn:'weather',desc:'Name the clouds and what each one means for your flight.'},
 {id:'pairs',name:'PHONETIC PAIRS',where:'CLASSROOM',icon:'chat',built:1,best:'high',unit:'PTS',learn:'radio',desc:'Flip cards to match letters with ALFA, BRAVO, CHARLIE.'},
 {id:'gauges',name:'GAUGE READER',where:'CLASSROOM',icon:'gauge',built:1,best:'high',unit:'PTS',learn:'instruments',desc:'Read the six-pack instruments against the clock.'},
 {id:'words',name:'WORD HUNT',where:'CLASSROOM',icon:'docs',built:1,best:'high',unit:'PTS',learn:'parts',desc:'Find aviation words hidden in the grid.'},
 {id:'darts',name:'COMPASS DARTS',where:'THE GAME ROOM',icon:'pin',built:1,best:'high',unit:'PTS',learn:'nav',desc:'Hit the headings the tower calls out.'},
 {id:'hockey',name:'AIR HOCKEY',where:'THE GAME ROOM',icon:'joy',built:1,best:'high',unit:'MARGIN',desc:'Fast table hockey against the crew. First to 5.'},
 {id:'radar4',name:'RADAR FOUR',where:'THE GAME ROOM ARCADE',icon:'grid',built:1,best:'high',unit:'PTS',desc:'Four in a row on a radar screen, against the crew.'},
 {id:'skee',name:'SKEE-BALL',where:'THE GAME ROOM',icon:'star',built:1,best:'high',unit:'PTS',desc:'Roll for the rings. The runway centerline is 50.'},
 {id:'bowling',name:'CONE BOWLING',where:'THE GAME ROOM',icon:'star',built:1,best:'high',unit:'PTS',learn:'airports',desc:'Bowl over ten orange traffic cones. Strikes and spares count.'},
 {id:'hoops',name:'HANGAR HOOPS',where:'THE GAME ROOM',icon:'star',built:1,best:'high',unit:'PTS',desc:'45 seconds, a hoop on the hangar wall, long shots are worth 3.'}
];
H.gameById=id=>H.GAMES.find(g=>g.id===id);
H.gamePlace=g=>/GAME ROOM/.test(g.where)?'THE GAME ROOM':/LOUNGE/.test(g.where)?'PILOT’S LOUNGE':/CLASSROOM/.test(g.where)?'THE CLASSROOM':/HANGAR/.test(g.where)?'THE HANGAR':/PLATFORM/.test(g.where)?'VIEWING PLATFORM':/TOWER/.test(g.where)?'THE TOWER':/RUNWAY/.test(g.where)?'THE RUNWAY':/PARKING/.test(g.where)?'PARKING STAND':'WASH RACK';
H.xp=Object.assign(H.xp||{},{gameFirst:15,gameBest:5,gameDaily:40});

/* ============================ SCORES + XP ============================ */
const GS=()=>{ const m=G.save.mod; m.games=m.games||{}; return m.games; };
H.gameRec=id=>GS()[id]||null;
H.gameDone=function(id,score,o){
 o=o||{}; const g=H.gameById(id), all=GS(), r=all[id]||{plays:0,best:null}, low=g&&g.best==='low';
 const better=r.best==null||(low?score<r.best:score>r.best);
 const first=!r.plays;
 r.plays++; r.at=Date.now(); if(better&&o.counts!==false) r.best=score; all[id]=r;
 // XP: first play of each game, then personal bests, capped per day
 const d=H.dayKey?H.dayKey(0):'', day=(all.day&&all.day.d===d)?all.day:(all.day={d,xp:0});
 let xp=0; const lines=[];
 if(first){ xp+=H.xp.gameFirst; lines.push(['FIRST TIME PLAYING',H.xp.gameFirst]); }
 else if(better&&o.counts!==false){ xp+=H.xp.gameBest; lines.push(['NEW PERSONAL BEST',H.xp.gameBest]); }
 const room=Math.max(0,H.xp.gameDaily-day.xp); if(xp>room){ let left=room; for(const L of lines){ const give=Math.min(L[1],left); L[1]=give; left-=give; } xp=room; lines.push(['DAILY GAME XP REACHED • LESSONS STILL EARN XP',0]); }
 day.xp+=xp;
 G.ach('arcade'); const played=H.GAMES.filter(x=>x.built&&all[x.id]&&all[x.id].plays).length; if(played>=8) G.ach('arcade8'); if(played>=17) G.ach('games17'); if(played>=H.GAMES.filter(x=>x.built).length) G.ach('games27');
 G.persist(); if(xp) G.award(xp,g?g.name:'GAME');
 return {first,better:better&&o.counts!==false&&!first,best:r.best,xp,lines};
};
H.fmtScore=(id,v)=>{ const g=H.gameById(id); if(v==null) return '—'; return v+(g&&g.unit?' '+g.unit:''); };

/* one label size for a set of choices: the largest (from max down to min) at which every label fits w */
H.fitSize=function(labels,w,max,min){ max=max||7.6; min=min||6; for(let z=max;z>=min-1e-9;z-=.4) if(labels.every(t=>G.tw(String(t),z,800)<=w)) return Math.round(z*10)/10; return min; };
/* ============================ THE KIT ============================ */
const MG=G.MG={
 start(sc,id,a){
  a=a||{}; sc.gid=id; sc.g=H.gameById(id); sc.back=a.back||sc.back||'world'; sc.over=null; sc.t=sc.t||0; sc.lr=null; sc.lrUsed=0;   // lr: the learn-for-a-retry panel (hfq_retry.js)
  sc.pause=G.Pause({restart:['g_'+id,{back:sc.back}],quit:[sc.back==='world'?'world':sc.back,{}],quitLabel:'QUIT GAME'});
  if(AUDIO.curName!=='arcade') AUDIO.play('arcade');
  sc.tipT=a.noTip?0:3.2;
 },
 update(sc,dt){
  sc.t=(sc.t||0)+dt; if(sc.tipT>0) sc.tipT-=dt;
  if(sc.pause.open){ sc.pause.update(); return true; }
  if(sc.over){ sc.over.t+=dt; if(sc.over.t<.5) return true;
   for(const b of MG.overBtns(sc)) if(G.clicked(b.x,b.y,b.w,b.h)){ AUDIO.sfx('ok');
    if(b.id==='again') G.go('g_'+sc.gid,{back:sc.back}); else if(b.id==='learn') G.go('route',{unit:sc.g.learn,back:sc.back}); else G.go(sc.back);
    return true; }
   if(G.pressed.a){ G.go('g_'+sc.gid,{back:sc.back}); return true; }
   if(G.pressed.b){ G.go(sc.back); return true; }
   return true; }
  if(sc.lr&&MG.lrUpdate){ if(G.clicked(G.PAUSE.x,G.PAUSE.y,G.PAUSE.w,G.PAUSE.h)||G.pressed.pause){ G.ptr.click=false; sc.pause.show(); return true; } MG.lrUpdate(sc,dt); return true; }   // the game waits behind the panel; Escape there means "no thanks"
  if(G.clicked(G.PAUSE.x,G.PAUSE.y,G.PAUSE.w,G.PAUSE.h)||G.pressed.b||G.pressed.pause){ G.ptr.click=false; sc.pause.show(); return true; }
  return false;
 },
 end(sc,score,o){
  o=o||{}; if(sc.over) return;
  const res=H.gameDone(sc.gid,score,o);
  sc.over=Object.assign({t:0,score,head:o.head||'GAME OVER',line:o.line||'',sub:o.sub||''},res);
  AUDIO.jingle(o.lose?'lose':(res.better||res.first?'fanfare':'win'));
 },
 overBtns(sc){ const VH=G.VH, B=[]; const learn=sc.g&&sc.g.learn&&H.lessons&&H.lessons[sc.g.learn];
  B.push({id:'again',label:'PLAY AGAIN',kind:'primary',x:24,y:VH-150,w:VW-48,h:40});
  if(learn) B.push({id:'learn',label:'LEARN IT: '+H.units.find(u=>u.id===sc.g.learn).t,kind:'ghost',x:24,y:VH-104,w:VW-48,h:36,size:6.6});
  B.push({id:'back',label:'BACK',kind:'secondary',x:24,y:VH-62,w:VW-48,h:36});
  return B; },
 hud(sc,c,right,o){
  o=o||{};
  c.fillStyle=G.rgba(C.bg,.9); c.fillRect(0,0,VW,41); c.fillStyle=G.rgba(C.accent,.5); c.fillRect(0,41,VW,1);
  G.pauseBtnDraw();
  G.txt(sc.g?sc.g.name:'',VW/2,o.sub?7:13,8.6,C.title,'center',VW-130,800);
  if(o.sub) G.txt(o.sub,VW/2,24,5.6,C.sub,'center',VW-130,700);
  if(right) G.txt(right,VW-10,13,7,C.accentHi,'right',96,800);
  if(sc.tipT>0&&sc.g&&!sc.over&&!sc.lr){ const a=Math.min(1,sc.tipT); c.globalAlpha=a; G.rrect(14,48,VW-28,30,10); c.fillStyle=G.rgba(C.bg,.88); c.fill(); c.strokeStyle=G.rgba(C.accent,.5); c.lineWidth=1; c.stroke();
   G.para(o.tip||sc.g.desc,VW/2,53,6.2,C.ink,'center',VW-44,9,700); c.globalAlpha=1; }
  if(sc.lr&&MG.lrDraw) MG.lrDraw(sc,c);
  if(sc.over) MG.drawOver(sc,c);
  if(sc.pause.open) sc.pause.draw(c);
 },
 drawOver(sc,c){
  const o=sc.over, VH=G.VH, k=Math.min(1,o.t*3);
  G.dim(.82*k);
  const y0=Math.max(60,VH*.14), lineN=o.line?G.wrap(o.line,6.8,VW-50,700).length:0;
  const fit=16+22+(lineN?lineN*10+6:0)+50+(o.better&&!o.lines.some(l=>/PERSONAL BEST/.test(l[0]))?14:0)+o.lines.length*13+10;   // the panel fits what it holds
  G.panel(14,y0,VW-28,Math.max(120,Math.min(VH-y0-170+12,fit)),{r:16,border:G.rgba(C.accent,.6)});
  let y=y0+16;
  G.txt(o.head,VW/2,y,12,o.better||o.first?C.title:C.ink,'center',VW-40,800); y+=22;
  if(o.line){ G.para(o.line,VW/2,y,6.8,C.sub,'center',VW-50,10,700); y+=G.wrap(o.line,6.8,VW-50,700).length*10+6; }
  const cw=(VW-48)/3; [['SCORE',H.fmtScore(sc.gid,o.score)],['BEST',H.fmtScore(sc.gid,o.best)],['XP','+'+o.xp]].forEach(([k2,v],i)=>{ const x=24+i*cw; G.rrect(x+2,y,cw-4,40,10); c.fillStyle='rgba(255,255,255,.05)'; c.fill(); c.strokeStyle='rgba(255,255,255,.1)'; c.lineWidth=1; c.stroke(); G.txt(v,x+cw/2,y+7,v.length>9?7:9,C.ink,'center',cw-8,800); G.txt(k2,x+cw/2,y+27,4.8,C.dim,'center',cw-8,800); });
  y+=50;
  if(o.better&&!o.lines.some(l=>/PERSONAL BEST/.test(l[0]))) { G.txt('NEW PERSONAL BEST!',VW/2,y,7.4,C.good,'center',undefined,800); y+=14; }
  for(const [l,v] of o.lines){ const cap=/^DAILY GAME XP/.test(l); G.txt(l,30,y,cap?5.2:6,cap?C.dim:C.sub,'left',VW-100,800); if(v) G.txt('+'+v+' XP',VW-30,y,6,C.accentHi,'right',undefined,800); y+=13; }
  if(o.t>.5) G.drawBtns(MG.overBtns(sc));
 },
 /* drag-to-aim helper: pull back from a point and let go (slingshot). Returns {active, dx, dy, power 0-1, fired:{dx,dy,power}} */
 sling(st,ox,oy,maxLen,within){
  const out={active:false,fired:null};
  if(G.ptr.click&&(!within||within(G.ptr.x,G.ptr.y))){ st.on=true; st.sx=G.ptr.x; st.sy=G.ptr.y; }
  if(st.on&&G.ptr.down){ const dx=G.ptr.x-st.sx, dy=G.ptr.y-st.sy, L=Math.hypot(dx,dy); out.active=L>4; out.dx=-dx; out.dy=-dy; out.power=Math.min(1,L/maxLen); }
  if(st.on&&!G.ptr.down){ st.on=false; const dx=(G.ptr.rx!=null?G.ptr.rx:G.ptr.x)-st.sx, dy=(G.ptr.ry!=null?G.ptr.ry:G.ptr.y)-st.sy, L=Math.hypot(dx,dy); if(L>8) out.fired={dx:-dx,dy:-dy,power:Math.min(1,L/maxLen)}; }
  return out;
 },
 aimLine(c,x,y,dx,dy,power,len,col){ const L=Math.hypot(dx,dy)||1, ux=dx/L, uy=dy/L, n=Math.round(6+power*10);
  for(let i=1;i<=n;i++){ const t=i/n*len*(.4+power*.6); c.beginPath(); c.arc(x+ux*t,y+uy*t,1.6+(1-i/n)*.8,0,PI*2); c.fillStyle=G.rgba(col||C.accent,.9-i/n*.6); c.fill(); }
  const bw=40, bx=x-bw/2, by=y+14; G.rrect(bx,by,bw,4,2); c.fillStyle='rgba(255,255,255,.15)'; c.fill(); G.rrect(bx,by,bw*power,4,2); c.fillStyle=power>.85?C.bad:(power>.55?C.warn:C.good); c.fill(); }
};

/* ============================ MATERIALS: shared looks for tables, props and backdrops ============================
   MG.felt(c,x,y,w,h,col,r)        cloth with a soft lit center
   MG.wood(c,x,y,w,h,col,r,vert)   polished wood with grain
   MG.metal(c,x,y,w,h,col,r)       brushed metal
   MG.sphere(c,x,y,r,col)          a shaded ball with a highlight
   MG.block(c,x,y,w,h,col)         a glossy crate / tile
   MG.floor(c,x,y,w,h,kind)        a lit backdrop: 'concrete' | 'wood' | 'hangar' | 'ramp'
   MG.spot(c,x,y,rx,ry,a)          a pool of light
   MG.vignette(c,x,y,w,h,a) */
const FX={
 felt(c,x,y,w,h,col,r){ G.rrect(x,y,w,h,r||4); const g=c.createRadialGradient(x+w/2,y+h/2,Math.min(w,h)*.1,x+w/2,y+h/2,Math.max(w,h)*.7); g.addColorStop(0,G.shade(col,1.18)); g.addColorStop(.6,col); g.addColorStop(1,G.shade(col,.72)); c.fillStyle=g; c.fill();
  c.save(); G.rrect(x,y,w,h,r||4); c.clip(); c.fillStyle='rgba(255,255,255,.035)'; for(let yy=y;yy<y+h;yy+=3) c.fillRect(x,yy,w,1); c.restore(); },
 wood(c,x,y,w,h,col,r,vert){ G.rrect(x,y,w,h,r||6); const g=vert?c.createLinearGradient(x,0,x+w,0):c.createLinearGradient(0,y,0,y+h); g.addColorStop(0,G.shade(col,1.2)); g.addColorStop(.5,col); g.addColorStop(1,G.shade(col,.7)); c.fillStyle=g; c.fill();
  c.save(); G.rrect(x,y,w,h,r||6); c.clip(); c.strokeStyle='rgba(0,0,0,.14)'; c.lineWidth=1; for(let i=0;i<Math.max(w,h)/7;i++){ c.beginPath(); if(vert){ const xx=x+i*7+((i*13)%5); c.moveTo(xx,y); c.bezierCurveTo(xx+3,y+h*.3,xx-3,y+h*.7,xx,y+h); } else { const yy=y+i*7+((i*13)%5); c.moveTo(x,yy); c.bezierCurveTo(x+w*.3,yy+3,x+w*.7,yy-3,x+w,yy); } c.stroke(); }
  c.fillStyle='rgba(255,255,255,.14)'; c.fillRect(x,y,w,2); c.restore(); },
 metal(c,x,y,w,h,col,r){ G.rrect(x,y,w,h,r||4); const g=c.createLinearGradient(0,y,0,y+h); g.addColorStop(0,G.shade(col,1.35)); g.addColorStop(.45,col); g.addColorStop(.5,G.shade(col,.85)); g.addColorStop(1,G.shade(col,1.1)); c.fillStyle=g; c.fill();
  c.save(); G.rrect(x,y,w,h,r||4); c.clip(); c.fillStyle='rgba(255,255,255,.06)'; for(let yy=y;yy<y+h;yy+=2) c.fillRect(x,yy,w,.6); c.restore(); },
 sphere(c,x,y,r,col){ const g=c.createRadialGradient(x-r*.35,y-r*.4,r*.1,x,y,r); g.addColorStop(0,G.shade(col,1.6)); g.addColorStop(.35,col); g.addColorStop(1,G.shade(col,.5)); c.fillStyle=g; c.beginPath(); c.arc(x,y,r,0,PI*2); c.fill();
  c.fillStyle='rgba(255,255,255,.7)'; c.beginPath(); c.ellipse(x-r*.38,y-r*.42,r*.22,r*.14,-.6,0,PI*2); c.fill(); },
 block(c,x,y,w,h,col){ const g=c.createLinearGradient(x,y,x+w,y+h); g.addColorStop(0,G.shade(col,1.35)); g.addColorStop(.5,col); g.addColorStop(1,G.shade(col,.65)); c.fillStyle=g; c.fillRect(x,y,w,h); c.fillStyle='rgba(255,255,255,.35)'; c.fillRect(x,y,w,1.5); c.fillRect(x,y,1.5,h); c.fillStyle='rgba(0,0,0,.35)'; c.fillRect(x,y+h-1.5,w,1.5); c.fillRect(x+w-1.5,y,1.5,h); },
 spot(c,x,y,rx,ry,a,col){ c.save(); c.translate(x,y); c.scale(1,ry/rx); const g=c.createRadialGradient(0,0,0,0,0,rx); g.addColorStop(0,'rgba('+(col||'255,220,150')+','+a+')'); g.addColorStop(.6,'rgba('+(col||'255,220,150')+','+(a*.35)+')'); g.addColorStop(1,'rgba('+(col||'255,220,150')+',0)'); c.fillStyle=g; c.beginPath(); c.arc(0,0,rx,0,PI*2); c.fill(); c.restore(); },
 vignette(c,x,y,w,h,a){ const g=c.createRadialGradient(x+w/2,y+h/2,Math.min(w,h)*.35,x+w/2,y+h/2,Math.max(w,h)*.75); g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(1,'rgba(0,0,0,'+(a==null?.4:a)+')'); c.fillStyle=g; c.fillRect(x,y,w,h); },
 floor(c,x,y,w,h,kind){
  if(kind==='wood'){ const g=c.createLinearGradient(0,y,0,y+h); g.addColorStop(0,'#4a3326'); g.addColorStop(1,'#6a4a34'); c.fillStyle=g; c.fillRect(x,y,w,h); c.fillStyle='rgba(0,0,0,.18)'; for(let yy=y;yy<y+h;yy+=12) c.fillRect(x,yy,w,1); FX.spot(c,x+w/2,y+h*.4,w*.9,h*.6,.14); }
  else if(kind==='hangar'){ const g=c.createLinearGradient(0,y,0,y+h); g.addColorStop(0,'#4a525e'); g.addColorStop(1,'#6b737e'); c.fillStyle=g; c.fillRect(x,y,w,h); c.fillStyle='rgba(255,255,255,.05)'; for(let xx=x;xx<x+w;xx+=8) c.fillRect(xx,y,2,h*.25); c.fillStyle='rgba(0,0,0,.1)'; for(let xx=x;xx<x+w;xx+=48) c.fillRect(xx,y+h*.25,1,h); FX.spot(c,x+w*.3,y+h*.3,w*.7,h*.5,.16); FX.spot(c,x+w*.8,y+h*.3,w*.6,h*.4,.12); }
  else if(kind==='ramp'){ const g=c.createLinearGradient(0,y,0,y+h); g.addColorStop(0,'#6a6f76'); g.addColorStop(1,'#8f949b'); c.fillStyle=g; c.fillRect(x,y,w,h); c.fillStyle='rgba(0,0,0,.08)'; for(let i=0;i<12;i++){ c.beginPath(); c.ellipse(x+((i*97)%w),y+((i*61)%h),12+(i%3)*6,2.4,(i%4)*.5,0,7); c.fill(); } FX.spot(c,x+w*.5,y+h*.2,w,h*.5,.14); }
  else { const g=c.createLinearGradient(0,y,0,y+h); g.addColorStop(0,'#737980'); g.addColorStop(1,'#959ba2'); c.fillStyle=g; c.fillRect(x,y,w,h); c.fillStyle='rgba(0,0,0,.08)'; for(let xx=x;xx<x+w;xx+=40) c.fillRect(xx,y,1,h); FX.spot(c,x+w*.5,y+h*.25,w*.8,h*.5,.14); }
  FX.vignette(c,x,y,w,h,.35);
 }
};
Object.assign(MG,FX);

/* ============================ THE GAMES LIST (Flight Bag) ============================ */
function gameRow(g){
 const r=H.gameRec(g.id);
 return {h:58,focus:!!g.built,t:g.name,
  draw(c,x,y,w,foc){
   G.rrect(x,y+2,w,52,12); c.fillStyle=g.built?C.card:'rgba(255,255,255,.03)'; c.fill(); c.strokeStyle=foc?C.title:'rgba(255,255,255,.1)'; c.lineWidth=foc?2:1; c.stroke();
   c.beginPath(); c.arc(x+26,y+28,16,0,PI*2); c.fillStyle=g.built?G.rgba(C.accent,.15):'rgba(255,255,255,.05)'; c.fill(); G.icon(g.icon||'joy',c,x+26,y+28,15,g.built?C.accentText:C.dim);
   G.txt(g.name,x+50,y+10,7.6,g.built?C.ink:C.dim,'left',w-130,800);
   G.txt(g.where,x+50,y+24,5.4,g.built?C.sub:C.dim,'left',w-130,800);
   G.txt(g.built?(r&&r.best!=null?'BEST '+H.fmtScore(g.id,r.best):'NEW'):'COMING SOON',x+w-10,y+12,6,g.built?(r?C.accentHi:C.good):C.dim,'right',undefined,800);
   if(r&&r.plays) G.txt('PLAYED '+r.plays+'×',x+w-10,y+28,5,C.dim,'right',undefined,800);
   if(g.built) G.txt(g.desc,x+50,y+37,5,C.dim,'left',w-60,600);
  },
  tap(){ return g.built?{play:g.id}:{soon:g.id}; }, enter(){ return g.built?{play:g.id}:null; }};
}
G.scenes.games={
 enter(a){ this.back=a.back||G.homeScene(); this.list=G.CL.List(); if(AUDIO.curName!=='arcade') AUDIO.play('arcade'); },
 area(){ return {x:4,y:46,w:VW-8,h:G.VH-50}; },
 items(){ const I=[], b=H.GAMES.filter(g=>g.built), s=H.GAMES.filter(g=>!g.built);
  I.push(G.CL.text('The just-for-fun games fill the Game Room; the learning games live where they belong on the airfield. Walk to them, or play from here. Game XP is capped each day, so learning stays the fastest way up.',{size:6.4,col:C.sub}));
  const PL=['THE GAME ROOM','THE CLASSROOM','VIEWING PLATFORM','THE TOWER','THE RUNWAY','PARKING STAND','WASH RACK','PILOT’S LOUNGE','THE HANGAR'];
  for(const pl of PL){ const gs=b.filter(g=>H.gamePlace(g)===pl); if(gs.length){ I.push(G.CL.hdr(pl,gs.length+(gs.length>1?' GAMES':' GAME'))); gs.forEach(g=>I.push(gameRow(g))); } }
  if(s.length){ I.push(G.CL.hdr('COMING TO THE CLUBHOUSE',s.length+' MORE')); s.forEach(g=>I.push(gameRow(g))); }
  return I; },
 update(){ if(G.backHit()){ G.go(this.back); return; }
  this.list.update(this.items(),this.area(),a=>{ if(a.play) G.go('g_'+a.play,{back:'games'}); else if(a.soon){ const g=H.gameById(a.soon); G.toast(g.name+': COMING SOON TO THE '+g.where,C.warn); } }); },
 draw(c){ G.backdrop(.9); this.list.draw(c,this.items(),this.area()); const n=H.GAMES.filter(g=>g.built).length; G.topBar('GAMES',{sub:n+' TO PLAY'+(H.GAMES.length>n?' • '+(H.GAMES.length-n)+' ON THE WAY':'')}); }
};
})();
