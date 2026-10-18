/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* THE FLIGHT PATH (round 6): the academy's spine, Duolingo-style. One winding path through all the units, in four stages.
   Every unit is a stage of nodes: TEST OUT (skip ahead if you already know it), the LESSONS (escorted learning),
   READ (its Library book), PRACTICE (the clubhouse game that drills it), the DRILL (10 timed questions) and the CHECKRIDE.
   Mastery tiers per unit: BRONZE = every lesson done (or tested out), SILVER = checkride passed (the patch),
   GOLD = a perfect drill AND every book quiz for the unit passed. Units unlock in order (the next one opens at Bronze).
   Also here: the PLACEMENT CHECK at enrollment, and the PRACTICE HUB (flashcards, trivia, drills, missed questions).
   Progress: G.save.mod.fl.l[lessonId] (lessons, incl. tested:1), .drill[uid]={best,gold,plays}, .trivia={best,plays,day,n}, .placed */
(function(){
const H=G.HFQ, C=G.C, CL=G.CL, VW=G.VW, PI=Math.PI;
H.xp=Object.assign(H.xp||{},{testOut:30,drillFirst:15,drillGold:20,triviaDay:10,triviaPerfect:5,flashDeck:5});
H.DRILL_N=10; H.DRILL_T=8; H.TRIVIA_N=10; H.TRIVIA_T=10; H.TESTOUT_N=10; H.TESTOUT_PASS=.8; H.TESTOUT_TRIES=2; H.PLACE_N=3;
/* test-out tries today for a unit: f.tries[uid]={d:'YYYY-MM-DD', n} (r7, docs/02_AUDIT_REGISTER.md D09) */
H.testOutTries=function(uid){ const f=FL(), d=H.dayKey(0), t=(f.tries||{})[uid]; return t&&t.d===d?t.n:0; };
H.testOutLeft=function(uid){ return Math.max(0,H.TESTOUT_TRIES-H.testOutTries(uid)); };
const noteTry=uid=>{ const f=FL(), d=H.dayKey(0); f.tries=f.tries||{}; const t=f.tries[uid]; f.tries[uid]=t&&t.d===d?{d,n:t.n+1}:{d,n:1}; G.persist(); };
const FL=()=>H.fl();
const TIER_COL=['rgba(255,255,255,.18)','#c97a3a','#c9ced6','#ffd24d'], TIER_NAME=['','BRONZE','SILVER','GOLD'];

/* ============================ MASTERY ============================ */
H.unitBooks=uid=>(H.BOOKS||[]).filter(b=>b.unit===uid);
H.unitGame=uid=>{ const u=H.units.find(x=>x.id===uid), p=u&&u.practice&&(H.GAMES||[]).find(g=>g.id===u.practice&&g.built); return p||(H.GAMES||[]).find(g=>g.learn===uid&&g.built); };   // the unit's own pick first, then any game that lists it
H.tier=function(uid){
 const P=H.unitProg(uid), f=FL(), d=(f.drill||{})[uid], books=H.unitBooks(uid);
 const bronze=P.total>0&&P.all, silver=bronze&&P.patch, booksOk=books.every(b=>H.lib&&H.lib.passed(b.id)), gold=silver&&!!(d&&d.gold)&&booksOk;
 const tested=(H.lessons[uid]||[]).some(l=>f.l[l.id]&&f.l[l.id].tested);
 return {t:gold?3:(silver?2:(bronze?1:0)),bronze,silver,gold,tested,drill:d||null,booksOk,name:TIER_NAME[gold?3:(silver?2:(bronze?1:0))]};
};
H.stageOf=u=>(H.stages||[]).find(s=>s.id===u.stage);
H.unitOpen=function(uid){ const i=H.units.findIndex(u=>u.id===uid); if(i<=0) return true; const u=H.units[i], sg=H.stageOf(u); if(sg&&sg.free) return true;   // a free stage (BEYOND) is open from day one
 const prev=H.units[i-1]; return !H.lessons[prev.id]||H.tier(prev.id).bronze; };   // otherwise the unit before it (the last of the stage before, for a stage's first unit) must be BRONZE
H.stageProg=function(sid){ const us=H.units.filter(u=>u.stage===sid&&H.lessons[u.id]), p=(G.save.mod.gs||{}).done||{}; return {units:us.length,patches:us.filter(u=>p[u.id]).length,bronze:us.filter(u=>H.tier(u.id).bronze).length}; };
H.nextUnit=function(){ for(const u of H.units) if(H.lessons[u.id]&&H.unitOpen(u.id)&&!H.tier(u.id).silver) return u; return null; };
H.testOut=function(uid){ const f=FL(); let n=0; for(const l of H.lessons[uid]||[]) if(!f.l[l.id]){ f.l[l.id]={stars:2,tested:1,at:Date.now()}; n++; }
 if(n){ G.persist(); G.award(H.xp.testOut,'TESTED OUT'); if(H.tickDay) H.tickDay(true); const u=H.units.find(x=>x.id===uid); if(H.feed) H.feed('testout:'+uid,'tested out of '+u.t,{icon:'medal'}); G.ach('testout'); } return n; };
H.drillDone=function(uid,right,n){ const f=FL(); f.drill=f.drill||{}; const d=f.drill[uid]||(f.drill[uid]={best:0,gold:false,plays:0}), lines=[]; let xp=0;
 const first=!d.plays; d.plays++; d.best=Math.max(d.best,right); if(first){ xp+=H.xp.drillFirst; lines.push(['FIRST DRILL',H.xp.drillFirst]); }
 if(right===n&&!d.gold){ d.gold=true; xp+=H.xp.drillGold; lines.push(['PERFECT DRILL',H.xp.drillGold]); const u=H.units.find(x=>x.id===uid); if(H.feed) H.feed('gold:'+uid,'drilled '+u.t+' perfectly',{icon:'star'}); }
 G.persist(); if(xp) G.award(xp,'DRILL'); if(H.tickDay) H.tickDay(right>=n*.8);
 H.checkGold(uid);
 return {xp,lines}; };
H.checkGold=function(uid){ const T=H.tier(uid); if(T.gold) G.ach('gold1'); if(H.units.filter(u=>H.lessons[u.id]).every(u=>H.tier(u.id).gold)) G.ach('goldall'); return T; };
H.drawMedal=function(c,x,y,r,t){ const col=TIER_COL[t]||TIER_COL[0]; c.beginPath(); c.arc(x,y,r,0,PI*2); if(t){ const g=c.createRadialGradient(x-r*.3,y-r*.35,r*.1,x,y,r); g.addColorStop(0,G.shade(col,1.3)); g.addColorStop(1,G.shade(col,.7)); c.fillStyle=g; } else c.fillStyle=col; c.fill(); c.strokeStyle='rgba(0,0,0,.35)'; c.lineWidth=1; c.stroke(); if(t){ c.fillStyle='rgba(255,255,255,.55)'; c.beginPath(); c.arc(x-r*.3,y-r*.3,r*.22,0,PI*2); c.fill(); } };

/* ---------- launchers ---------- */
H.startDrill=function(uid,ret){ const u=H.units.find(x=>x.id===uid), mk=()=>H.Q.pick(H.Q.unitPool(uid,{books:false}),H.DRILL_N);
 G.go('quiz',{title:'DRILL',sub:u.t+' • '+H.DRILL_N+' QUESTIONS • '+H.DRILL_T+'S EACH',qs:mk(),reroll:mk,timer:H.DRILL_T,pass:.8,mode:'drill',uid,ret:ret||{scene:'path'},
  onDone:o=>{ const r=H.drillDone(uid,o.right,o.n), T=H.tier(uid); return {head:o.perfect?'GOLD DRILL!':(o.passed?'SOLID':'KEEP DRILLING'),line:o.perfect?(T.gold?u.t+' is GOLD.':'Perfect! Pass the unit’s book quiz too and '+u.t+' goes GOLD.'):'A perfect drill is one of the two steps to GOLD. Flashcards help.',lines:r.lines,againLabel:'DRILL AGAIN',backLabel:'BACK'}; }}); };
H.startTestOut=function(uid,ret){ const u=H.units.find(x=>x.id===uid), mk=()=>H.Q.pick(H.Q.unitPool(uid,{books:false}),H.TESTOUT_N);
 if(!H.testOutLeft(uid)){ G.toast('TWO TEST-OUT TRIES A DAY. THE LESSONS ARE OPEN, OR TRY TOMORROW',C.warn); AUDIO.sfx('buzzer'); return false; }
 G.go('quiz',{title:'TEST OUT',sub:u.t+' • '+Math.round(H.TESTOUT_PASS*100)+'% TO SKIP AHEAD',qs:mk(),reroll:mk,timer:0,pass:H.TESTOUT_PASS,mode:'testout',uid,ret:ret||{scene:'path'},
  onDone:o=>{ if(!o.passed) noteTry(uid); if(o.passed){ H.testOut(uid); return {head:'YOU KNOW THIS ONE',line:u.t+' is BRONZE: its lessons are marked done. The checkride and the drill are still there for SILVER and GOLD.',lines:[['TESTED OUT',H.xp.testOut]],again:false,backLabel:'BACK TO THE PATH'}; }
   const left=H.testOutLeft(uid); return {head:'NOT YET',line:'You need '+Math.ceil(o.n*H.TESTOUT_PASS)+' of '+o.n+'. The lessons are quick, and they are fun.'+(left?' One more try today.':' Test out again tomorrow.'),again:left>0,againLabel:'TRY AGAIN',backLabel:'DO THE LESSONS'}; }}); return true; };
H.startTrivia=function(ret){ const open=H.units.filter(u=>H.lessons[u.id]&&H.unitOpen(u.id)), pool=[].concat(...open.map(u=>H.Q.unitPool(u.id))), mk=()=>H.Q.pick(pool,H.TRIVIA_N);
 G.go('quiz',{title:'FLIGHT TRIVIA',sub:open.length+(open.length===1?' UNIT':' UNITS')+' • '+H.TRIVIA_T+' SECONDS A QUESTION',qs:mk(),reroll:mk,timer:H.TRIVIA_T,pass:.7,mode:'trivia',ret:ret||{scene:'practice'},
  onDone:o=>{ const f=FL(), tv=f.trivia=f.trivia||{best:0,plays:0,day:null,n:0}, d=H.dayKey(0), lines=[]; let xp=0; if(tv.day!==d){ tv.day=d; tv.n=0; } tv.n++; tv.plays++; const better=o.score>tv.best; tv.best=Math.max(tv.best,o.score);
   if(tv.n===1){ xp+=H.xp.triviaDay; lines.push(['FIRST TRIVIA TODAY',H.xp.triviaDay]); } if(o.perfect){ xp+=H.xp.triviaPerfect; lines.push(['PERFECT ROUND',H.xp.triviaPerfect]); }
   G.persist(); if(xp) G.award(xp,'TRIVIA'); if(H.tickDay) H.tickDay(false); if(tv.plays>=10) G.ach('trivia10');
   return {head:better?'NEW HIGH SCORE!':(o.perfect?'PERFECT!':'TRIVIA NIGHT'),line:'Best: '+tv.best+' points. Questions come from every unit you have opened, lessons and books alike.',lines,againLabel:'ANOTHER ROUND',backLabel:'DONE'}; }}); };
H.startFlash=function(uid,ret){ const u=H.units.find(x=>x.id===uid), cards=H.Q.cards(uid);
 G.go('flash',{title:'FLASHCARDS',sub:u.t+' • '+cards.length+' CARDS',cards,uid,ret:ret||{scene:'practice'},onDone:s=>{ const f=FL(); f.flash=f.flash||{}; if(!f.flash[uid]){ f.flash[uid]=Date.now(); G.persist(); G.award(H.xp.flashDeck,'FLASHCARDS'); } if(H.tickDay) H.tickDay(false); }}); };

/* ============================ THE PATH ============================ */
const NODE_R=21, GAP=66, STAGE_COL=['#2f6fb5','#2f8a4a','#d9731a','#6a3fa0'], STAGE_SHORT=['DISCOVERY','STUDENT','PRIVATE','BEYOND'];
function nodesFor(u,ui){
 const L=H.lessons[u.id]||[], f=FL(), T=H.tier(u.id), open=H.unitOpen(u.id), P=H.unitProg(u.id), out=[];
 const done=i=>!!f.l[L[i].id];
 if(!T.bronze&&L.length) out.push({k:'test',label:'TEST OUT',icon:'chevrons',open,done:false,sub:'Already know '+u.t+'? '+H.TESTOUT_N+' questions, '+Math.round(H.TESTOUT_PASS*100)+'% skips the lessons. '+(H.testOutLeft(u.id)?H.testOutLeft(u.id)+(H.testOutLeft(u.id)===1?' try':' tries')+' left today.':'No tries left today.')});
 L.forEach((l,i)=>out.push({k:'lesson',i,label:'LESSON '+(i+1),icon:null,open:open&&(i===0||done(i-1)),done:done(i),rec:f.l[l.id],sub:l.t||l.title||'',l}));
 for(const b of H.unitBooks(u.id)) out.push({k:'read',id:b.id,label:'READ',icon:'book',open,done:H.lib&&H.lib.passed(b.id),half:H.lib&&H.lib.isRead(b.id),sub:b.t+': '+b.min+' min, then '+H.an(b.quiz.length)+' '+b.quiz.length+'-question quiz.'});
 const g=H.unitGame(u.id); if(g) out.push({k:'play',id:g.id,label:'PRACTICE',icon:g.icon||'joy',open,done:!!(H.gameRec&&H.gameRec(g.id)),sub:g.name+' ('+g.where+'): '+g.desc});
 if(L.length) out.push({k:'drill',label:'DRILL',icon:'gauge',open:open&&T.bronze,done:!!(T.drill&&T.drill.gold),half:!!(T.drill&&T.drill.plays),sub:H.DRILL_N+' questions, '+H.DRILL_T+' seconds each. A perfect drill is half of GOLD.'});
 if(L.length) out.push({k:'check',label:'CHECKRIDE',icon:'medal',open:open&&P.all,done:P.patch,sub:'The unit checkride: '+H.checkN+' questions, '+H.checkPass+' to pass. Earns the patch (SILVER).'});
 return out;
}
/* the same nodes and the same launch for every way in: the Flight Path here, and the Academy Hub (hfq_hub.js) through the activity registry */
H.unitNodes=nodesFor;
H.openNode=function(n,u,ret,back){
 if(n.k==='lesson') G.go('lesson',{unit:u.id,lesson:n.i,ret}); else if(n.k==='check') G.go('lesson',{unit:u.id,mode:'check',ret}); else if(n.k==='test') return H.startTestOut(u.id,ret)!==false; else if(n.k==='drill') H.startDrill(u.id,ret);
 else if(n.k==='read') G.go('book',{id:n.id,back}); else if(n.k==='play') G.go('g_'+n.id,{back});
 return true; };
G.scenes.path={
 enter(a){ a=a||{}; this.back=a.back||'world'; this.sc={scroll:0}; this.sheet=null; this.t=0; this.built=null; this._g=null; if(AUDIO.curName!=='classroom'&&AUDIO.curName!=='lounge') AUDIO.play('classroom');
  // back from a node (a lesson, a book, a drill...): land where you left off, not at the top
  const R=H._pathAt; H._pathAt=null; if(R&&Date.now()-R.at<30*60e3){ this.sc.scroll=R.scroll; return; }
  if(a.jump===false) return; const C2=this.current(true), A=this.area();   // open on the glowing node, with its unit banner in view when both fit
  if(C2){ const n=C2.n, top=C2.st.y-8; this.sc.scroll=Math.max(0,(n.y+NODE_R+24-top<=A.h)?top:n.y-A.h*.42); return; }
  const n=H.nextUnit(); if(n){ const st=this.geo().stages.find(s=>s.u.id===n.id); if(st) this.sc.scroll=Math.max(0,st.y-150); } },
 area(){ return {x:0,y:112,w:VW,h:G.VH-112-56}; },
 geo(){ // units laid out top to bottom: a STAGE header where a stage begins, then each unit's banner and its nodes on a winding line (built once per visit)
  if(this._g) return this._g;
  let y=16; const stages=[], heads=[];
  H.units.forEach((u,ui)=>{ if(!H.lessons[u.id]) return;
   if(!ui||H.units[ui-1].stage!==u.stage){ const sg=H.stageOf(u); if(sg){ heads.push({y,h:46,sg,si:heads.length}); y+=58; } }
   const nodes=nodesFor(u,ui), st={u,ui,y,nodes,open:H.unitOpen(u.id),tier:H.tier(u.id)}; y+=76;
   nodes.forEach((n,i)=>{ n.x=VW/2+Math.sin((i+ui)*1.1+.6)*62; n.y=y+NODE_R+6; y+=GAP; }); st.h=y-st.y; stages.push(st); y+=18; });
  return this._g={stages,heads,contentH:y+40};
 },
 /* the glowing node: the next step in order. Once a unit is SILVER its optional nodes (books, game, drill: the road to GOLD) stop holding the glow, so it moves on to the next unit */
 current(withStage){ for(const st of this.geo().stages) for(const n of st.nodes) if(n.open&&!n.done&&n.k!=='test'&&!(st.tier.silver&&(n.k==='read'||n.k==='play'||n.k==='drill'))) return withStage?{n,st}:n; return null; },
 open(n,u){ const ret={scene:'path',args:{back:this.back,jump:false}}; AUDIO.sfx('ok'); H._pathAt={scroll:this.sc.scroll,at:Date.now()}; H.openNode(n,u,ret,'path'); },
 update(dt){ this.t+=dt; const VH=G.VH, A=this.area(), G2=this.geo();
  if(G.backHit()){ G.go(this.back); return; }
  if(G.gearHit()){ G.go('settings',{back:'path'}); return; }
  if(this.sheet){ const S=this.sheetRect(), n=this.sheet.n; if(G.clicked(S.close.x,S.close.y,S.close.w,S.close.h)||G.pressed.b){ this.sheet=null; AUDIO.sfx('back'); return; }
   if(n.open&&(G.clicked(S.btn.x,S.btn.y,S.btn.w,S.btn.h)||G.pressed.a)){ this.open(n,this.sheet.u); return; } if(G.ptr.click&&G.ptr.y<S.y){ this.sheet=null; } return; }
  // the bottom bar: PRACTICE HUB + CLASSROOM
  for(const b of this.bar()) if(G.clicked(b.x,b.y,b.w,b.h)){ AUDIO.sfx('ok'); if(b.id==='practice') G.go('practice',{back:'path'}); else if(b.id==='class') G.go('world',{room:'classroom'}); else if(b.id==='library') G.go('library',{back:'path'}); return; }
  for(const ch of this.chips()) if(G.clicked(ch.x,ch.y,ch.w,ch.h)){ const hd=G2.heads[ch.i]; if(hd){ this.sc.scroll=Math.max(0,Math.min(hd.y-6,G2.contentH-A.h)); AUDIO.sfx('blip'); } return; }
  CL.scrollArea(this.sc,A,G2.contentH);
  if(G.tapped(A.x,A.y,A.w,A.h)){ const ty=G.ptr.rsy-A.y+this.sc.scroll, tx=G.ptr.rsx;
   for(const st of G2.stages){ for(const n of st.nodes) if(Math.hypot(tx-n.x,ty-n.y)<NODE_R+8){ this.sheet={n,u:st.u,st}; AUDIO.sfx(n.open?'blip':'thud'); return; }
    if(ty>st.y&&ty<st.y+64){ if(!st.open){ G.toast('FINISH THE UNIT BEFORE IT',C.warn); AUDIO.sfx('thud'); } else { AUDIO.sfx('blip'); G.go('route',{unit:st.u.id,back:'path'}); } return; } } }
 },
 chips(){ const w=(VW-20-9)/4; return (H.stages||[]).map((sg,i)=>({i,sg,x:10+i*(w+3),y:88,w,h:20})); },
 stageNow(){ const hs=this.geo().heads; let k=0; hs.forEach((h,i)=>{ if(h.y<=this.sc.scroll+60) k=i; }); return k; },
 bar(){ const VH=G.VH, w=(VW-24)/3; return [{id:'practice',label:'PRACTICE',icon:'cards',x:8,y:VH-48,w:w,h:40},{id:'library',label:'LIBRARY',icon:'book',x:12+w,y:VH-48,w,h:40},{id:'class',label:H.isHub&&H.isHub()?'ACADEMY HUB':'CLASSROOM',icon:'docs',x:16+w*2,y:VH-48,w,h:40}]; },
 sheetRect(){ const VH=G.VH, h=this.sheet?this.sheetLayout().h:206; return {x:8,y:VH-h-8,w:VW-16,h,btn:{x:22,y:VH-56,w:VW-44,h:38},close:{x:VW-44,y:VH-h,w:30,h:26}}; },
 /* the sheet sizes itself to what it holds: the blurb, the fact chips, what you'll learn, a status line, the button */
 sheetLayout(){ const n=this.sheet.n, u=this.sheet.u, T=this.sheet.st.tier, w=VW-16, f=sheetFacts(n,u,T);
  const sh=G.wrap(n.sub||'',6.4,w-28,700).length*9.2; let fx=14, fy=34+sh; const chips=[];
  for(const t of f.chips){ const tw=G.tw(t,5,800)+12; if(fx+tw>w-14){ fx=14; fy+=15; } chips.push({t,x:fx,y:fy,w:tw}); fx+=tw+5; }
  let cb=chips.length?fy+12:34+sh; const learn=(f.learn||[]).slice(0,3), learnY=fy+18; if(learn.length) cb=learnY+10+learn.length*10;
  const info=n.k==='lesson'&&n.rec?('DONE'+(n.rec.tested?' (TESTED OUT)':' • '+(n.rec.stars||0)+' STARS')):(n.k==='drill'&&T.drill?'BEST '+T.drill.best+' / '+H.DRILL_N+(T.drill.gold?' • GOLD':''):(n.k==='check'&&T.silver?'PASSED • PATCH EARNED':''));
  const status=!n.open?{t:n.k==='check'?'FINISH EVERY LESSON FIRST':(n.k==='drill'?'REACH BRONZE FIRST (LESSONS OR TEST OUT)':'LOCKED: FINISH THE ONE BEFORE'),col:C.warn}:(info?{t:info,col:C.good}:null);
  return {sh,chips,learn,learnY,status,h:Math.max(132,Math.round(cb+(status?80:60)))}; },
 draw(c){ const VH=G.VH, A=this.area(), G2=this.geo(), t=this.t;
  const bg=c.createLinearGradient(0,0,0,VH); bg.addColorStop(0,'#0e1a2e'); bg.addColorStop(1,'#070a12'); c.fillStyle=bg; c.fillRect(0,0,VW,VH);
  // header: streak, today's plan, XP
  const d=H.today(), sk=H.streak(), T=H.totals(), cw=(VW-24)/3;
  [[String(sk),'FLIGHT DAYS',sk?'#ff8a1a':C.dim],[Math.min(d.n,H.dailyGoal)+' / '+H.dailyGoal,'TODAY’S PLAN',d.n>=H.dailyGoal?C.good:C.accentHi],[String(G.save.points||0),'XP',C.title]].forEach(([v,l,col],i)=>{ const x=10+i*(cw+2); G.rrect(x,46,cw,40,10); c.fillStyle='rgba(255,255,255,.05)'; c.fill(); G.txt(v,x+cw/2,52,9,col,'center',cw-6,800); G.txt(l,x+cw/2,70,4.6,C.dim,'center',cw-6,800); });
  // the stage tabs: tap one to jump there
  const now=this.stageNow(); this.chips().forEach(ch=>{ const sp=H.stageProg(ch.sg.id), col=STAGE_COL[ch.i]||C.accent, on=ch.i===now; G.rrect(ch.x,ch.y,ch.w,ch.h,7); c.fillStyle=on?G.shade(col,.7):'rgba(255,255,255,.05)'; c.fill(); c.strokeStyle=on?col:'rgba(255,255,255,.12)'; c.lineWidth=on?1.6:1; c.stroke();
   G.txt(STAGE_SHORT[ch.i]||ch.sg.t,ch.x+ch.w/2,ch.y+3.4,4.8,on?'#fff':C.ink,'center',ch.w-4,800); G.txt(sp.patches+' / '+sp.units+' PATCHES',ch.x+ch.w/2,ch.y+12.2,3.6,on?'rgba(255,255,255,.8)':C.dim,'center',ch.w-4,700); });
  c.save(); c.beginPath(); c.rect(A.x,A.y,A.w,A.h); c.clip(); c.translate(0,A.y-this.sc.scroll);
  // the winding line
  const all=[].concat(...G2.stages.map(s=>s.nodes)); c.strokeStyle='rgba(255,255,255,.12)'; c.lineWidth=10; c.lineCap='round'; c.beginPath(); all.forEach((n,i)=>{ if(i) c.lineTo(n.x,n.y); else c.moveTo(n.x,n.y); }); c.stroke();
  const cur=this.current(), top=this.sc.scroll-90, bot=this.sc.scroll+A.h+90;
  for(const hd of G2.heads){ if(hd.y+hd.h<top||hd.y>bot) continue; const sg=hd.sg, sc=STAGE_COL[hd.si]||C.accent, sp=H.stageProg(sg.id), y=hd.y;
   G.rrect(8,y,VW-16,hd.h,12); const gg=c.createLinearGradient(8,y,VW-8,y); gg.addColorStop(0,sc); gg.addColorStop(1,G.shade(sc,.45)); c.fillStyle=gg; c.fill();
   G.txt('STAGE '+(hd.si+1),20,y+7,4.8,'rgba(255,255,255,.75)','left',undefined,800); G.txt(sg.t,20,y+15,10,'#fff','left',VW-110,800); G.txt(sg.note||sg.s,20,y+34,4.6,sg.note?C.accentHi:'rgba(255,255,255,.8)','left',VW-100,800);
   G.txt(sp.patches+' / '+sp.units,VW-20,y+8,9,'#fff','right',undefined,800); G.txt('PATCHES',VW-20,y+22,4.2,'rgba(255,255,255,.75)','right',undefined,800); }
  for(const st of G2.stages){ if(st.y+st.h<top||st.y>bot) continue; const u=st.u, col=H.unitColors[st.ui]||C.accent, y=st.y;
   // the stage banner
   G.rrect(12,y,VW-24,64,14); const g=c.createLinearGradient(12,y,VW-12,y+64); g.addColorStop(0,G.shade(col,st.open?.75:.35)); g.addColorStop(1,G.shade(col,st.open?.45:.22)); c.fillStyle=g; c.fill(); c.strokeStyle=st.tier.t?TIER_COL[st.tier.t]:'rgba(255,255,255,.12)'; c.lineWidth=st.tier.t?2:1; c.stroke();
   if(H.drawPatch) H.drawPatch(c,40,y+32,18,u,st.tier.silver); G.txt('UNIT '+(st.ui+1),68,y+9,5,'rgba(255,255,255,.7)','left',undefined,800); G.txt(u.t,68,y+19,8.4,'#fff','left',VW-150,800); G.txt(st.open?(st.tier.t?st.tier.name+(st.tier.tested?' • TESTED OUT':''):u.s):'LOCKED • FINISH THE UNIT BEFORE',68,y+37,5.2,'rgba(255,255,255,.75)','left',VW-150,700);
   [1,2,3].forEach(k=>H.drawMedal(c,VW-60+(k-1)*16,y+32,6,st.tier.t>=k?k:0)); G.txt(st.open?'OPEN ▸':'🔒',VW-22,y+46,5,'rgba(255,255,255,.7)','right',undefined,800);
   for(const n of st.nodes){ const isCur=n===cur, r=NODE_R+(isCur?Math.sin(t*4)*1.5:0);
    c.fillStyle='rgba(0,0,0,.35)'; c.beginPath(); c.arc(n.x+2,n.y+4,r,0,PI*2); c.fill();
    const nc=n.done?C.good:(n.open?(n.k==='test'?'#6a3fa0':col):'#2a2f3a'); const ng=c.createRadialGradient(n.x-r*.3,n.y-r*.35,r*.1,n.x,n.y,r); ng.addColorStop(0,G.shade(nc,1.3)); ng.addColorStop(1,G.shade(nc,.75)); c.beginPath(); c.arc(n.x,n.y,r,0,PI*2); c.fillStyle=ng; c.fill();
    c.strokeStyle=isCur?C.accentHi:(n.done?C.good:'rgba(255,255,255,.18)'); c.lineWidth=isCur?2.5:1.2; c.stroke();
    if(n.half&&!n.done){ c.save(); c.beginPath(); c.arc(n.x,n.y,r,-PI/2,PI/2); c.lineTo(n.x,n.y); c.closePath(); c.fillStyle='rgba(63,220,124,.35)'; c.fill(); c.restore(); }
    if(n.k==='lesson') G.txt(String(n.i+1),n.x,n.y-8,13,n.open?'#fff':'rgba(255,255,255,.35)','center',undefined,800); else G.icon(n.icon,c,n.x,n.y,16,n.open?'#fff':'rgba(255,255,255,.35)');
    if(n.done&&n.k==='lesson'&&n.rec&&H.stars) H.stars(c,n.x,n.y+r+8,3.2,n.rec.stars||0);
    G.txt(n.label,n.x+(n.x>VW/2?-r-6:r+6),n.y-4,5.2,n.open?C.ink:C.dim,n.x>VW/2?'right':'left',90,800);
    if(!n.open) G.icon('lock',c,n.x+r*.7,n.y-r*.7,9,'rgba(255,255,255,.6)');
   }
  }
  c.restore();
  // the bottom bar
  c.fillStyle=G.rgba(C.bg,.96); c.fillRect(0,VH-56,VW,56); c.fillStyle=G.rgba(C.accent,.5); c.fillRect(0,VH-56,VW,1);
  for(const b of this.bar()){ G.rrect(b.x,b.y,b.w,b.h,10); c.fillStyle='rgba(255,255,255,.05)'; c.fill(); c.strokeStyle='rgba(255,255,255,.12)'; c.lineWidth=1; c.stroke(); G.icon(b.icon,c,b.x+b.w/2,b.y+13,12,C.accentHi); G.txt(b.label,b.x+b.w/2,b.y+26,5,C.ink,'center',b.w-4,800); }
  if(this.sheet) this.drawSheet(c);
  G.topBar('FLIGHT PATH',{back:true,backLabel:H.isHub&&H.isHub()?'HUB':'AIRFIELD',sub:T.done+' / '+T.lessons+' LESSONS • '+T.patches+(T.patches===1?' PATCH':' PATCHES'),gear:true});
 },
 drawSheet(c){ const S=this.sheetRect(), n=this.sheet.n, u=this.sheet.u, K=this.sheetLayout();
  G.panel(S.x,S.y,S.w,S.h,{r:14,border:G.rgba(C.accent,.6)});
  G.txt(n.label+(n.k==='lesson'?' • '+u.t:''),S.x+14,S.y+12,8.6,C.title,'left',S.w-60,800);
  G.rrect(S.close.x,S.close.y+4,S.close.w,S.close.h-8,8); c.fillStyle='rgba(255,255,255,.08)'; c.fill(); G.txt('✕',S.close.x+S.close.w/2,S.close.y+8,8,C.ink,'center',undefined,800);
  G.para(n.sub||'',S.x+14,S.y+30,6.4,C.ink,'left',S.w-28,9.2,700);
  // what's inside: chips of facts, and for a lesson or a book, what you'll learn
  for(const f of K.chips){ G.rrect(S.x+f.x,S.y+f.y,f.w,12,6); c.fillStyle='rgba(255,255,255,.07)'; c.fill(); G.txt(f.t,S.x+f.x+f.w/2,S.y+f.y+3.2,5,C.sub,'center',undefined,800); }
  if(K.learn.length){ let ly=S.y+K.learnY; G.txt('YOU’LL LEARN',S.x+14,ly,4.8,C.accentText,'left',undefined,800); ly+=10; for(const t of K.learn){ c.fillStyle=C.accentHi; c.beginPath(); c.arc(S.x+18,ly+3.4,1.6,0,7); c.fill(); G.txt(t,S.x+24,ly,5.8,C.ink,'left',S.w-40,700); ly+=10; } }
  if(K.status) G.txt(K.status.t,S.x+14,S.y+S.h-70,5.4,K.status.col,'left',S.w-28,800);
  G.button({x:S.btn.x,y:S.btn.y,w:S.btn.w,h:S.btn.h,label:!n.open?'LOCKED':(n.k==='lesson'?(n.done?'FLY IT AGAIN':'START THE LESSON'):(n.k==='test'?'TAKE THE TEST':(n.k==='drill'?'START THE DRILL':(n.k==='check'?(n.done?'FLY IT AGAIN':'TAKE THE CHECKRIDE'):(n.k==='read'?'OPEN THE BOOK':'PLAY'))))),kind:n.open?'primary':'secondary'});
 }
};

/* the facts on a node's sheet */
function sheetFacts(n,u,T){ const chips=[]; let learn=null;
 if(n.k==='lesson'&&n.l){ const l=n.l, nc=(l.cards||[]).length, nq=(l.qs||[]).length; chips.push(nc+' BRIEFING CARD'+(nc===1?'':'S'),nq+' CHALLENGES','ABOUT '+Math.max(2,Math.round((nc*.5+nq*.35)))+' MIN','+'+H.xp.lesson+' XP • UP TO 3 ★'); learn=(l.cards||[]).map(cd=>cd.t).filter(Boolean); }
 else if(n.k==='test') chips.push(H.TESTOUT_N+' QUESTIONS','NO CLOCK',Math.round(H.TESTOUT_PASS*100)+'% TO PASS','+'+H.xp.testOut+' XP');
 else if(n.k==='drill') chips.push(H.DRILL_N+' QUESTIONS',H.DRILL_T+'S EACH','PERFECT = HALF OF GOLD');
 else if(n.k==='check') chips.push(H.checkN+' QUESTIONS',H.checkPass+' TO PASS','THE UNIT PATCH','+100 XP');
 else if(n.k==='read'){ const b=H.bookById(n.id); if(b){ chips.push(b.sec.length+' CHAPTERS','ABOUT '+(b.min||5)+' MIN',b.quiz.length+'-QUESTION QUIZ'); learn=b.sec.map(x=>x.h.charAt(0)+x.h.slice(1).toLowerCase()); } }
 else if(n.k==='play'){ const g=H.gameById(n.id); if(g) chips.push(g.where,'BEST SCORE COUNTS','GAME XP IS CAPPED DAILY'); }
 return {chips,learn}; }

/* ============================ PLACEMENT CHECK (after enrolling) ============================ */
G.scenes.placement={
 enter(a){ this.a=a||{}; this.t=0; if(AUDIO.curName!=='classroom') AUDIO.play('classroom'); },
 btns(){ const VH=G.VH; return [{id:'new',label:'I’M NEW: START AT THE BEGINNING',kind:'primary',x:20,y:VH-124,w:VW-40,h:42,size:6.8},{id:'place',label:'I KNOW SOME: PLACEMENT CHECK',kind:'ghost',x:20,y:VH-74,w:VW-40,h:42,size:6.8}]; },
 go(){ const f=FL(); f.placed=1; G.persist(); G.go('world',{room:H.firstRoom||'classroom'}); },
 update(dt){ this.t+=dt; for(const b of this.btns()) if(G.clicked(b.x,b.y,b.w,b.h)){ AUDIO.sfx('ok'); if(b.id==='new') return this.go();
   const units=H.units.filter(u=>H.lessons[u.id]).slice(0,4), qs=[].concat(...units.map(u=>H.Q.pick(H.Q.unitPool(u.id,{books:false}),H.PLACE_N)));
   G.go('quiz',{title:'PLACEMENT CHECK',sub:qs.length+' QUESTIONS • NO CLOCK',qs,timer:0,pass:.5,mode:'placement',ret:{scene:'placement',args:{done:1}},
    onDone:o=>{ const got=[]; for(const u of units){ const pu=o.perUnit&&o.perUnit[u.id]; if(pu&&pu.n>=H.PLACE_N&&pu.ok===pu.n&&H.unitOpen(u.id)){ H.testOut(u.id); got.push(u.t); } } FL().placed=1; G.persist();
     return {head:got.length?'WELCOME ABOARD, CADET':'WELCOME ABOARD',line:got.length?'You tested out of: '+got.join(', ')+'. The Flight Path starts you after '+(got.length>1?'them':'it')+'.':'Everyone starts at the beginning, and the first lessons are the most fun.',again:false,backLabel:'INTO THE ACADEMY'}; }});
   return; }
  if(this.a.done){ G.go('world',{room:H.firstRoom||'classroom'}); } },
 draw(c){ const VH=G.VH; const bg=c.createLinearGradient(0,0,0,VH); bg.addColorStop(0,'#0e1a2e'); bg.addColorStop(1,'#070a12'); c.fillStyle=bg; c.fillRect(0,0,VW,VH);
  G.topBar('WELCOME',{back:false,sub:'ONE QUESTION BEFORE YOU START'});
  if(H.sky){ c.save(); G.rrect(14,54,VW-28,120,14); c.clip(); H.sky(c,14,54,VW-28,120,{mode:'golden',sun:[.8,.3],t:this.t}); if(H.clouds) H.clouds(c,14,54,VW-28,70,{t:this.t,n:3,seed:2,speed:6,alpha:.8}); c.restore(); }
  G.txt('HAVE YOU STUDIED FLYING BEFORE?',VW/2,190,9,C.title,'center',VW-40,800);
  G.para('The FLIGHT PATH takes you through '+H.units.length+' units in four stages, from your first look at flying to life after the private pilot certificate, lesson by lesson. If you already know some of it, a quick 12-question placement check can skip you past the first units. Either way, every unit can be tested out of later, and nothing is ever locked for good.',VW/2,212,6.6,C.ink,'center',VW-50,9.8,600);
  G.drawBtns(this.btns()); }
};

/* ============================ THE PRACTICE HUB ============================ */
G.scenes.practice={
 enter(a){ this.back=(a||{}).back||'path'; this.list=CL.List(); if(AUDIO.curName!=='classroom') AUDIO.play('classroom'); },
 area(){ return {x:4,y:46,w:VW-8,h:G.VH-50}; },
 items(){ const I=[], f=FL(), T=H.totals(), tv=f.trivia||{best:0,plays:0}, open=H.units.filter(u=>H.lessons[u.id]&&H.unitOpen(u.id));
  I.push(CL.text('Affirm what you know, any way you like: flip through flashcards, play a timed trivia round, or drill a unit for GOLD. Nothing here needs the escort of a lesson.',{size:6.4,col:C.sub}));
  I.push(CL.hdr('QUICK PLAY'));
  I.push(CL.row('FLIGHT TRIVIA','10 MIXED QUESTIONS, '+H.TRIVIA_T+'S EACH • BEST '+tv.best,{icon:'star',act:{trivia:1},right:tv.plays?tv.plays+' PLAYED':'NEW',rightCol:C.accentHi}));
  I.push(CL.row('HANGAR FLYING',T.missed?T.missed+(T.missed===1?' MISSED QUESTION TO CLEAR':' MISSED QUESTIONS TO CLEAR'):'NO MISSED QUESTIONS',{icon:'chat',act:{review:1},right:T.missed?'REVIEW':'CLEAR',rightCol:T.missed?C.warn:C.good}));
  I.push(CL.row('THE LIBRARY',H.lib?(H.lib.totals().read+' OF '+H.lib.totals().books+' BOOKS READ'):'',{icon:'book',act:{library:1}}));
  I.push(CL.hdr('FLASHCARDS',open.length+(open.length===1?' DECK':' DECKS')));
  for(const u of open){ const n=H.Q.cards(u.id).length, done=!!(f.flash&&f.flash[u.id]); I.push(CL.row(u.t,n+' CARDS',{icon:'cards',act:{flash:u.id},right:done?'DONE':'',rightCol:C.good})); }
  I.push(CL.hdr('DRILLS',open.length+(open.length===1?' UNIT':' UNITS')));
  for(const u of open){ const T2=H.tier(u.id), d=T2.drill; I.push(CL.row(u.t,T2.bronze?(d?'BEST '+d.best+' / '+H.DRILL_N:H.DRILL_N+' TIMED QUESTIONS'):'REACH BRONZE TO UNLOCK',{icon:'gauge',act:T2.bronze?{drill:u.id}:null,right:d&&d.gold?'GOLD':(T2.bronze?'':'LOCKED'),rightCol:d&&d.gold?'#ffd24d':C.dim})); }
  return I; },
 update(){ if(G.backHit()){ G.go(this.back); return; }
  this.list.update(this.items(),this.area(),a=>{ if(!a) return; const ret={scene:'practice',args:{back:this.back}}; if(a.trivia) H.startTrivia(ret); else if(a.review){ if(H.totals().missed) H.startReview(ret); else { G.toast('NO MISSED QUESTIONS. NICE FLYING!',C.good); AUDIO.sfx('chime2'); } } else if(a.library) G.go('library',{back:'practice'}); else if(a.flash) H.startFlash(a.flash,ret); else if(a.drill) H.startDrill(a.drill,ret); }); },
 draw(c){ const VH=G.VH; c.fillStyle='#0f151e'; c.fillRect(0,0,VW,VH); this.list.draw(c,this.items(),this.area()); G.topBar('PRACTICE HUB',{back:true,backLabel:'BACK',sub:'FLASHCARDS • TRIVIA • DRILLS'}); }
};
G.cardSub.path=()=>{ const n=H.nextUnit(); return n?'UNIT '+(H.units.indexOf(n)+1)+' OF '+H.units.length:'ALL UNITS SILVER'; };
G.cardSub.practice=()=>{ const f=FL(), tv=f.trivia; return tv&&tv.best?'TRIVIA BEST '+tv.best:'FLASHCARDS • TRIVIA • DRILLS'; };
})();
