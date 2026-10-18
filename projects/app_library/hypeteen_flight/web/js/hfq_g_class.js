/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* ROUND 5, THE CLASSROOM + PLATFORM GAMES
   CLOUD SPOTTER  (Platform)   clouds drift past the platform; name the type, then what it means for a pilot
   PHONETIC PAIRS (Classroom)  a memory game: match letters to ALFA, BRAVO, CHARLIE...
   GAUGE READER   (Classroom)  read the six-pack instruments against the clock
   WORD HUNT      (Classroom)  aviation words hidden in a letter grid
   Facts: cloud types and what they mean follow the Pilot's Handbook of Aeronautical Knowledge (ch. 12): cumulus = fair
   weather and bumps, stratus = steady low cloud and drizzle, cirrus = high ice crystals (a change may be coming),
   cumulonimbus = a thunderstorm (stay on the ground), fog = cloud on the ground (no VFR flying). */
(function(){
const H=G.HFQ, C=G.C, VW=G.VW, PI=Math.PI, MG=G.MG;
const fbBox=(c,y,h,ok,head,body,t)=>{ G.rrect(12,y,VW-24,h,12); c.fillStyle=ok?'rgba(18,61,38,.96)':'rgba(70,16,16,.96)'; c.fill(); c.strokeStyle=ok?C.good:C.bad; c.lineWidth=1.2; c.stroke(); G.txt(head,VW/2,y+8,8,'#fff','center',VW-40,800); G.para(body,VW/2,y+24,6.2,C.ink,'center',VW-44,8.8,700); if(t>.6) G.txt('TAP TO CONTINUE',VW/2,y+h-12,5.4,C.accentText,'center',undefined,800); };

/* ============================ CLOUD SPOTTER ============================ */
const CLOUDS=[
 {id:'cumulus',n:'CUMULUS',fig:'cu',means:'FAIR WEATHER, BUT BUMPY UNDERNEATH',why:'Puffy, flat-bottomed cotton balls. Warm air rising makes them, and the same rising air makes bumps.'},
 {id:'stratus',n:'STRATUS',fig:'st',means:'A LOW GRAY BLANKET: DRIZZLE, LOW CEILINGS',why:'Flat, gray and featureless. It can sit low enough to make a ceiling that keeps VFR pilots on the ground.'},
 {id:'cirrus',n:'CIRRUS',fig:'ci',means:'HIGH ICE CRYSTALS: A CHANGE MAY BE COMING',why:'Thin, wispy and very high. Made of ice. Often the first sign of a front on its way.'},
 {id:'cumulonimbus',n:'CUMULONIMBUS',fig:'cb',means:'A THUNDERSTORM: STAY ON THE GROUND',why:'A towering cloud with an anvil top. Lightning, hail and violent winds. Pilots stay far away.'},
 {id:'fog',n:'FOG',fig:'fog',means:'CLOUD ON THE GROUND: NO VFR FLYING',why:'A cloud sitting on the ground. You can’t see the runway, so nobody flies VFR until it lifts.'}
];
function drawCloud(c,x,y,w,h,kind,t){
 c.save(); c.beginPath(); c.rect(x,y,w,h); c.clip();
 H.sky(c,x,y,w,h,{mode:kind==='cumulonimbus'?'overcast':(kind==='stratus'?'overcast':'day'),sun:[.8,.15],t,flare:kind!=='fog'});
 const gy=y+h*.84; const gg=c.createLinearGradient(0,gy,0,y+h); gg.addColorStop(0,'#5d8a47'); gg.addColorStop(1,'#3f6a34'); c.fillStyle=gg; c.fillRect(x,gy,w,h-gy);
 if(kind==='fog'){ const fg=c.createLinearGradient(0,y+h*.45,0,y+h); fg.addColorStop(0,'rgba(225,230,236,0)'); fg.addColorStop(.5,'rgba(225,230,236,.85)'); fg.addColorStop(1,'rgba(215,220,226,.95)'); c.fillStyle=fg; c.fillRect(x,y+h*.45,w,h*.55); for(let i=0;i<4;i++){ H.cloud(c,x+((i*120+t*5)%(w+100))-50,y+h*.72+i*4,w*.5,.35,i); } }
 else if(kind==='cumulus'){ for(let i=0;i<3;i++) H.cloud(c,x+w*.2+i*w*.3+Math.sin(t*.3+i)*4,y+h*.42+(i%2)*h*.1,w*.34,.95,i); }
 else if(kind==='stratus'){ for(let i=0;i<7;i++) H.cloud(c,x+((i*70+t*4)%(w+80))-40,y+h*.3+(i%3)*5,w*.5,.8,i); const sh=c.createLinearGradient(0,y+h*.2,0,y+h*.5); sh.addColorStop(0,'rgba(120,130,145,0)'); sh.addColorStop(1,'rgba(120,130,145,.35)'); c.fillStyle=sh; c.fillRect(x,y+h*.2,w,h*.3); }
 else if(kind==='cirrus'){ c.strokeStyle='rgba(255,255,255,.85)'; c.lineCap='round'; for(let i=0;i<9;i++){ const cx=x+((i*53+t*3)%(w+60))-30, cy=y+h*.12+(i%4)*h*.07; c.lineWidth=1.2+(i%3)*.5; c.beginPath(); c.moveTo(cx,cy); c.bezierCurveTo(cx+18,cy-6,cx+30,cy+4,cx+52,cy-3); c.stroke(); } }
 else { // cumulonimbus: a tower with an anvil, a dark base, lightning now and then
  const cx=x+w*.5; for(let i=0;i<4;i++) H.cloud(c,cx+(i%2?14:-10),y+h*.62-i*h*.14,w*.46-i*8,.95,i); H.cloud(c,cx+20,y+h*.1,w*.75,.9,1); H.cloud(c,cx-30,y+h*.14,w*.5,.85,2);
  const db=c.createLinearGradient(0,y+h*.5,0,y+h*.8); db.addColorStop(0,'rgba(60,70,85,0)'); db.addColorStop(1,'rgba(50,58,72,.75)'); c.fillStyle=db; c.fillRect(x,y+h*.5,w,h*.3);
  if(!G.rm()&&(t*1.3)%3<.12){ c.strokeStyle='#fff7c0'; c.lineWidth=1.6; c.shadowColor='#fff'; c.shadowBlur=8; c.beginPath(); c.moveTo(cx-6,y+h*.6); c.lineTo(cx-12,y+h*.7); c.lineTo(cx-4,y+h*.72); c.lineTo(cx-10,y+h*.84); c.stroke(); c.shadowBlur=0; }
  c.strokeStyle='rgba(120,140,170,.35)'; c.lineWidth=1; for(let i=0;i<18;i++){ const rx=x+w*.3+((i*17+t*80)%(w*.4)), ry=y+h*.72+((i*23+t*120)%(h*.12)); c.beginPath(); c.moveTo(rx,ry); c.lineTo(rx-1.5,ry+5); c.stroke(); } }
 c.restore();
}
G.scenes.g_cloud={
 enter(a){ MG.start(this,'cloud',a); this.N=8; this.n=0; this.score=0; this.right=0; this.streak=0; const seq=[]; while(seq.length<this.N) seq.push(...G.shuffle(CLOUDS.slice())); this.seq=seq.slice(0,this.N); this.start(); if(AUDIO.curName!=='platform') AUDIO.play('platform'); },
 start(){ this.k=this.seq[this.n]; this.stage=this.n%2?'means':'name'; this.clock=0; this.fb=null;
  if(this.stage==='name') this.opts=G.shuffle([this.k.n].concat(G.shuffle(CLOUDS.filter(q=>q!==this.k).map(q=>q.n)).slice(0,3))), this.ok=this.k.n;
  else this.opts=G.shuffle([this.k.means].concat(G.shuffle(CLOUDS.filter(q=>q!==this.k).map(q=>q.means)).slice(0,3))), this.ok=this.k.means; },
 btns(){ const VH=G.VH, y0=VH-196; const size=H.fitSize(this.opts,VW-44,7.2,5.8); return this.opts.map((t,i)=>({id:'o:'+i,label:t,x:12,y:y0+i*46,w:VW-24,h:40,size,kind:this.fb?(t===this.ok?'success':(this.fb.pick===i?'danger':'secondary')):'secondary'})); },
 update(dt){ if(MG.update(this,dt)) return;
  if(this.fb){ this.fb.t+=dt; if(this.fb.t>.6&&(G.ptr.click||G.pressed.a)){ G.ptr.click=false; this.n++; if(this.n>=this.N) return this.finish(); this.start(); } return; }
  this.clock+=dt; for(const b of this.btns()) if(G.clicked(b.x,b.y,b.w,b.h)){ const i=+b.id.slice(2), ok=this.opts[i]===this.ok; let pts=0;
   if(ok){ pts=60+Math.max(0,Math.round(40-this.clock*4)); this.streak++; if(this.streak>=3) pts+=10; this.right++; AUDIO.sfx(this.streak>=3?'bigpoint':'point'); } else { this.streak=0; AUDIO.sfx('thud'); } this.score+=pts; this.fb={ok,pick:i,pts,t:0}; return; } },
 finish(){ MG.end(this,this.score,{head:this.right>=7?'CLOUD WHISPERER':(this.right>=5?'NICE SPOTTING':'KEEP LOOKING UP'),line:'You called '+this.right+' of '+this.N+'. Clouds are the sky’s weather report.'}); },
 draw(c){ const VH=G.VH, y0=72, h=Math.min(190,VH-300);
  c.fillStyle='#10151b'; c.fillRect(0,42,VW,VH-42);
  c.save(); G.rrect(10,y0,VW-20,h,12); c.clip(); drawCloud(c,10,y0,VW-20,h,this.k.id,this.t); c.restore(); c.strokeStyle=G.rgba(C.accent,.4); c.lineWidth=1; G.rrect(10,y0,VW-20,h,12); c.stroke();
  G.txt('CLOUD '+Math.min(this.N,this.n+1)+' OF '+this.N,12,52,6,C.ink,'left',undefined,800);
  G.txt(this.stage==='name'?'WHAT KIND OF CLOUD IS THIS?':'IT’S '+this.k.n+'. WHAT DOES IT MEAN FOR A PILOT?',VW/2,y0+h+10,this.stage==='name'?8:6.6,C.title,'center',VW-30,800);
  G.drawBtns(this.btns());
  if(this.fb) fbBox(c,y0+h+26,Math.max(40,VH-196-(y0+h+26)-6),this.fb.ok,this.fb.ok?'RIGHT! +'+this.fb.pts:this.k.n,this.k.why,this.fb.t);
  MG.hud(this,c,this.score+' PTS',{sub:'NAME THE CLOUDS',tip:'Name the cloud, then say what it means for a pilot. Quick answers score more.'}); }
};

/* ============================ PHONETIC PAIRS ============================ */
G.scenes.g_pairs={
 enter(a){ MG.start(this,'pairs',a); const L=G.shuffle(H.PHONETIC.map((w,i)=>[String.fromCharCode(65+i),w])).slice(0,8); const cards=[]; L.forEach(([l,w],i)=>{ cards.push({t:l,p:i,letter:true}); cards.push({t:w,p:i}); }); this.cards=G.shuffle(cards).map(k=>Object.assign(k,{up:false,done:false,flip:0}));
  this.open=[]; this.moves=0; this.matched=0; this.clock=0; this.lock=0; if(AUDIO.curName!=='classroom') AUDIO.play('classroom'); },
 grid(){ const VH=G.VH, cols=4, rows=4, gap=6, w=(VW-24-gap*(cols-1))/cols, h=Math.min(78,(VH-150-gap*(rows-1))/rows), y0=96; return this.cards.map((k,i)=>({k,x:12+(i%cols)*(w+gap),y:y0+Math.floor(i/cols)*(h+gap),w,h})); },
 update(dt){ if(MG.update(this,dt)) return; this.clock+=dt; for(const k of this.cards) k.flip+=(((k.up||k.done)?1:0)-k.flip)*Math.min(1,dt*10);
  if(this.lock>0){ this.lock-=dt; if(this.lock<=0){ for(const k of this.open) k.up=false; this.open=[]; } return; }
  for(const g of this.grid()) if(!g.k.up&&!g.k.done&&G.clicked(g.x,g.y,g.w,g.h)){ g.k.up=true; this.open.push(g.k); AUDIO.sfx('card'); if(!g.k.letter&&H.say) H.say(g.k.t.toLowerCase(),'pilot');
   if(this.open.length===2){ this.moves++; const [a,b]=this.open; if(a.p===b.p){ a.done=b.done=true; this.open=[]; this.matched++; AUDIO.sfx('point'); if(this.matched===8) this.finish(); } else { this.lock=.9; AUDIO.sfx('thud'); } } return; } },
 finish(){ const score=Math.max(0,Math.round(1000-this.moves*25-this.clock*4)); MG.end(this,score,{head:this.moves<=12?'RADIO READY':'ALL EIGHT MATCHED',line:this.moves+' moves in '+Math.round(this.clock)+' seconds. The phonetic alphabet keeps letters clear on a scratchy radio.'}); },
 draw(c){ const VH=G.VH; c.fillStyle='#10151b'; c.fillRect(0,42,VW,VH-42); MG.spot(c,VW/2,120,220,120,.1,'120,180,255');
  G.txt('MATCH EACH LETTER TO ITS WORD',VW/2,56,7,C.title,'center',VW-20,800); G.txt('MOVES '+this.moves+' • '+this.matched+' / 8 • '+Math.floor(this.clock)+'s',VW/2,72,5.6,C.sub,'center',undefined,800);
  for(const g of this.grid()){ const k=g.k, f=k.flip, sx=Math.abs(1-2*f), face=f>.5; c.save(); c.translate(g.x+g.w/2,g.y+g.h/2); c.scale(Math.max(.04,sx),1);
   G.rrect(-g.w/2,-g.h/2,g.w,g.h,10); if(face){ c.fillStyle=k.done?G.rgba(C.good,.2):G.rgba(C.accent,.16); c.fill(); c.strokeStyle=k.done?C.good:C.accentHi; c.lineWidth=1.6; c.stroke(); G.txt(k.t,0,k.letter?-14:-4,k.letter?18:(k.t.length>7?5.6:6.6),k.done?C.good:C.ink,'center',g.w-8,800); if(k.letter) G.txt('LETTER',0,13,4.2,C.dim,'center',undefined,800); }
   else { const bg=c.createLinearGradient(0,-g.h/2,0,g.h/2); bg.addColorStop(0,'#2a3a5a'); bg.addColorStop(1,'#172238'); c.fillStyle=bg; c.fill(); c.strokeStyle='rgba(255,255,255,.14)'; c.lineWidth=1; c.stroke(); G.icon('headset',c,0,-2,16,G.rgba(C.accentHi,.45)); } c.restore(); }
  MG.hud(this,c,this.moves+' MOVES',{sub:'ALFA, BRAVO, CHARLIE…',tip:'Flip two cards. Match the letter with its radio word. Fewer moves, more points.'}); }
};

/* ============================ GAUGE READER ============================ */
const GQ={asi:{n:'AIRSPEED',unit:' KNOTS',gen:r=>Math.round((40+r()*120)/5)*5,fmt:v=>v+' KNOTS',near:v=>[v+10,v-10,v+20]},
 alt:{n:'ALTITUDE',gen:r=>Math.round((500+r()*9000)/100)*100,fmt:v=>v.toLocaleString('en-US')+' FT',near:v=>[v+1000,v-1000,v+500]},
 hi:{n:'HEADING',gen:r=>Math.round(r()*35)*10,fmt:v=>String(v).padStart(3,'0')+'°',near:v=>[(v+180)%360,(v+90)%360,(v+30)%360]},
 vsi:{n:'VERTICAL SPEED',gen:r=>Math.round((r()*2-1)*1500/100)*100,fmt:v=>(v>0?'+':'')+v+' FPM'+(v>0?' (CLIMB)':(v<0?' (DESCENT)':' (LEVEL)')),near:v=>[-v||500,v+500,v-500]}};
G.scenes.g_gauges={
 enter(a){ MG.start(this,'gauges',a); this.N=10; this.n=0; this.score=0; this.right=0; this.streak=0; const r=H.rng(Date.now()%9973+5); this.qs=[]; const kinds=['asi','alt','hi','vsi'];
  for(let i=0;i<this.N;i++){ const k=kinds[i%4], Q=GQ[k], v=Q.gen(r); const cand=Q.near(v).concat(k==='hi'?[v+60,v+120,v+270]:[v*2+100,Math.round(v/2),v+300]).map(x=>k==='hi'?(((x%360)+360)%360):(k==='vsi'?x:Math.max(0,x))).filter((x,j,a)=>x!==v&&a.indexOf(x)===j), opts=G.shuffle([v].concat(cand.slice(0,3))); this.qs.push({k,v,opts,fmt:Q.fmt,n:Q.n}); }
  this.start(); if(AUDIO.curName!=='classroom') AUDIO.play('classroom'); },
 start(){ this.q=this.qs[this.n]; this.clock=0; this.limit=8; this.fb=null; },
 btns(){ const VH=G.VH, y0=VH-192; return this.q.opts.map((v,i)=>({id:'o:'+i,label:this.q.fmt(v),x:12,y:y0+i*44,w:VW-24,h:38,size:7.4,kind:this.fb?(v===this.q.v?'success':(this.fb.pick===i?'danger':'secondary')):'secondary'})); },
 update(dt){ if(MG.update(this,dt)) return;
  if(this.fb){ this.fb.t+=dt; if(this.fb.t>.6&&(G.ptr.click||G.pressed.a)){ G.ptr.click=false; this.n++; if(this.n>=this.N) return this.finish(); this.start(); } return; }
  this.clock+=dt; if(this.clock>this.limit){ this.streak=0; this.fb={ok:false,pick:-1,pts:0,t:0,slow:true}; AUDIO.sfx('buzzer'); return; }
  for(const b of this.btns()) if(G.clicked(b.x,b.y,b.w,b.h)){ const i=+b.id.slice(2), ok=this.q.opts[i]===this.q.v; let pts=0; if(ok){ pts=60+Math.round((1-this.clock/this.limit)*40); this.streak++; if(this.streak>=3) pts+=10; this.right++; AUDIO.sfx(this.streak>=3?'bigpoint':'point'); } else { this.streak=0; AUDIO.sfx('thud'); } this.score+=pts; this.fb={ok,pick:i,pts,t:0}; return; } },
 finish(){ MG.end(this,this.score,{head:this.right>=9?'INSTRUMENT RATED (ALMOST)':(this.right>=6?'GOOD SCAN':'KEEP SCANNING'),line:this.right+' of '+this.N+' read right. Pilots scan the six-pack every few seconds.'}); },
 draw(c){ const VH=G.VH, q=this.q, size=Math.min(VW-40,VH-330), gx=(VW-size)/2, gy=74;
  c.fillStyle='#10151b'; c.fillRect(0,42,VW,VH-42); MG.spot(c,VW/2,gy+size/2,size,size*.7,.12,'120,180,255');
  G.FIG.draw(c,{f:'gauge',g:q.k,v:q.v},gx,gy,size,size*.5+20);
  G.txt('GAUGE '+Math.min(this.N,this.n+1)+' OF '+this.N,12,52,6,C.ink,'left',undefined,800);
  const p=1-Math.min(1,this.clock/this.limit); G.rrect(VW-80,52,68,6,3); c.fillStyle='rgba(255,255,255,.12)'; c.fill(); G.rrect(VW-80,52,68*p,6,3); c.fillStyle=p<.3?C.bad:C.accent; c.fill();
  G.txt('WHAT '+q.n+' DOES IT SHOW?',VW/2,gy+size*.5+26,7.6,C.title,'center',VW-30,800);
  G.drawBtns(this.btns());
  if(this.fb) G.txt(this.fb.slow?'TOO SLOW! IT SHOWED '+q.fmt(q.v):(this.fb.ok?'RIGHT! +'+this.fb.pts:'IT SHOWED '+q.fmt(q.v)),VW/2,gy+size*.5+44,6.6,this.fb.ok?C.good:C.warn,'center',VW-30,800);
  if(this.fb&&this.fb.t>.6&&!this.over) G.txt('TAP TO CONTINUE',VW/2,VH-10,5,C.accentText,'center',undefined,800);
  MG.hud(this,c,this.score+' PTS',{sub:'READ THE SIX-PACK',tip:'Read the instrument before the bar runs out. Airspeed, altitude, heading, vertical speed.'}); }
};

/* ============================ WORD HUNT ============================ */
const WORDS=['RUDDER','AILERON','FLAPS','PITOT','RUNWAY','TAXIWAY','ALTITUDE','HEADING','THROTTLE','ELEVATOR','WINDSOCK','HANGAR','CEILING','KNOTS','SPINNER','COMPASS','TOWER','GLIDER','ROTOR','STALL','LIFT','DRAG','THRUST','YOKE','FLARE','BEACON'];
G.scenes.g_words={
 enter(a){ MG.start(this,'words',a); this.N=8; const r=H.rng(Date.now()%7919+11); this.build(r); this.found=[]; this.sel=null; this.clock=0; this.hint=0; if(AUDIO.curName!=='classroom') AUDIO.play('classroom'); },
 build(r){ const N=this.N, g=[]; for(let y=0;y<N;y++){ g.push([]); for(let x=0;x<N;x++) g[y].push(''); }
  const dirs=[[1,0],[0,1],[1,1],[-1,1]], placed=[]; const pool=G.shuffle(WORDS.filter(w=>w.length<=N));
  for(const w of pool){ if(placed.length>=6) break; let ok=false; for(let tries=0;tries<60&&!ok;tries++){ const [dx,dy]=dirs[Math.floor(r()*4)], x0=Math.floor(r()*N), y0=Math.floor(r()*N), x1=x0+dx*(w.length-1), y1=y0+dy*(w.length-1); if(x1<0||x1>=N||y1<0||y1>=N) continue; let fits=true; for(let i=0;i<w.length;i++){ const ch=g[y0+dy*i][x0+dx*i]; if(ch&&ch!==w[i]){ fits=false; break; } } if(!fits) continue; for(let i=0;i<w.length;i++) g[y0+dy*i][x0+dx*i]=w[i]; placed.push({w,x0,y0,x1,y1}); ok=true; } }
  const AB='ABCDEFGHIKLMNOPRSTUVWY'; for(let y=0;y<N;y++) for(let x=0;x<N;x++) if(!g[y][x]) g[y][x]=AB[Math.floor(r()*AB.length)];
  this.grid=g; this.words=placed; },
 cell(){ const VH=G.VH, s=Math.min((VW-24)/this.N,(VH-250)/this.N); return {s,x0:(VW-s*this.N)/2,y0:96}; },
 update(dt){ if(MG.update(this,dt)) return; this.clock+=dt;
  const hb={x:VW-62,y:50,w:54,h:20}; if(G.clicked(hb.x,hb.y,hb.w,hb.h)){ const left=this.words.filter(w=>!this.found.includes(w.w)); if(left.length){ this.hint=2.2; this.hintW=left[0]; this.score=Math.max(0,(this.score||0)-20); AUDIO.sfx('card'); } return; }
  if(this.hint>0) this.hint-=dt;
  const K=this.cell(); if(G.ptr.click&&G.ptr.y>=K.y0&&G.ptr.y<K.y0+K.s*this.N&&G.ptr.x>=K.x0&&G.ptr.x<K.x0+K.s*this.N){ const cx=Math.floor((G.ptr.x-K.x0)/K.s), cy=Math.floor((G.ptr.y-K.y0)/K.s);
   if(!this.sel){ this.sel=[cx,cy]; AUDIO.sfx('blip'); return; }
   const [sx,sy]=this.sel; this.sel=null; const w=this.words.find(q=>!this.found.includes(q.w)&&((q.x0===sx&&q.y0===sy&&q.x1===cx&&q.y1===cy)||(q.x0===cx&&q.y0===cy&&q.x1===sx&&q.y1===sy)));
   if(w){ this.found.push(w.w); AUDIO.sfx('point'); if(H.say) H.say(w.w.toLowerCase(),'pilot'); if(this.found.length===this.words.length) this.finish(); } else AUDIO.sfx('thud'); } },
 finish(){ const score=Math.max(0,(this.score||0)+this.words.length*100+Math.max(0,Math.round((180-this.clock)*2))); MG.end(this,score,{head:'ALL WORDS FOUND',line:this.words.length+' aviation words in '+Math.round(this.clock)+' seconds.'}); },
 draw(c){ const VH=G.VH, K=this.cell(), N=this.N; c.fillStyle='#10151b'; c.fillRect(0,42,VW,VH-42);
  G.txt('FIND '+this.words.length+' AVIATION WORDS',12,52,6.4,C.title,'left',undefined,800); G.txt(Math.floor(this.clock)+'s',12,64,5.4,C.sub,'left',undefined,800);
  const hb={x:VW-62,y:50,w:54,h:20}; G.rrect(hb.x,hb.y,hb.w,hb.h,8); c.fillStyle='rgba(11,11,12,.7)'; c.fill(); c.strokeStyle=G.rgba(C.accent,.6); c.lineWidth=1; c.stroke(); G.txt('HINT (−20)',hb.x+hb.w/2,hb.y+6,5,C.accentText,'center',undefined,800);
  G.rrect(K.x0-4,K.y0-4,K.s*N+8,K.s*N+8,10); c.fillStyle='#161c26'; c.fill();
  const inFound=(x,y)=>this.words.some(w=>this.found.includes(w.w)&&onLine(w,x,y)), onLine=(w,x,y)=>{ const dx=Math.sign(w.x1-w.x0), dy=Math.sign(w.y1-w.y0), n=Math.max(Math.abs(w.x1-w.x0),Math.abs(w.y1-w.y0)); for(let i=0;i<=n;i++) if(w.x0+dx*i===x&&w.y0+dy*i===y) return true; return false; };
  for(let y=0;y<N;y++) for(let x=0;x<N;x++){ const px=K.x0+x*K.s, py=K.y0+y*K.s, f=inFound(x,y), s=this.sel&&this.sel[0]===x&&this.sel[1]===y, h=this.hint>0&&this.hintW&&(x===this.hintW.x0&&y===this.hintW.y0);
   G.rrect(px+1,py+1,K.s-2,K.s-2,5); c.fillStyle=f?G.rgba(C.good,.25):(s?G.rgba(C.accent,.35):(h?G.rgba(C.warn,.35):'rgba(255,255,255,.04)')); c.fill(); G.txt(this.grid[y][x],px+K.s/2,py+K.s/2-K.s*.26,K.s*.5,f?C.good:C.ink,'center',undefined,800); }
  let ly=K.y0+K.s*N+12, lx=12; for(const w of this.words){ const f=this.found.includes(w.w), tw=G.tw(w.w,5.6,800)+10; if(lx+tw>VW-12){ lx=12; ly+=16; } G.rrect(lx,ly,tw,12,6); c.fillStyle=f?G.rgba(C.good,.2):'rgba(255,255,255,.06)'; c.fill(); G.txt(w.w,lx+tw/2,ly+3,5.6,f?C.good:C.sub,'center',undefined,800); lx+=tw+6; }
  G.txt(this.sel?'NOW TAP THE LAST LETTER':'TAP THE FIRST LETTER OF A WORD, THEN ITS LAST',VW/2,ly+22,5.6,C.accentText,'center',VW-24,800);
  MG.hud(this,c,this.found.length+' / '+this.words.length,{sub:'WORDS HIDDEN IN THE GRID',tip:'Tap the first letter, then the last. Words run across, down and diagonal.'}); }
};
})();
