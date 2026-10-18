/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* THE QUIZ ENGINE + FLASHCARDS (round 6): the fast "affirm my knowledge" side of the academy.
   Lessons are the escorted side (hfq_lessons.js: briefing, takeoff, challenges, landing). This file is the snappy one:
     G.go('quiz', {title, sub, qs, timer, pass, mode, uid, ret, onDone})   mc / true-false / fill questions, one at a time, optional per-question clock
     G.go('flash', {title, cards, uid, ret})                                 flip cards: question on the front, answer + why on the back
   H.Q builds question pools from the lessons (mc, tf, fill only: no figures needed) and from the library's book quizzes.
   A normalized question: {q, opts:[{t}], ok (index), why, src:'lesson'|'book', unit, id} */
(function(){
const H=G.HFQ, C=G.C, VW=G.VW, PI=Math.PI;
/* r7.4: after a miss, the instructor points to where it is taught (the briefing card or the book chapter): the why says what is
   right; this says where to look again. Built from the academy's own text by hfq_crewtalk.js. */
function review(q){ try{
 if(q.src==='lesson'&&H.clueSource&&H.qIndex[q.id]){ const S=H.clueSource(H.qIndex[q.id]); if(S) return 'REVIEW: “'+S.card.t+'” in “'+S.lesson.t+'”'; }
 if(q.src==='book'&&H.bookSection){ const S=H.bookSection(q.book,q.q+' '+(q.okT||'')+' '+(q.why||'')); if(S) return 'REVIEW: “'+S.h+'” in '+S.book; }
 }catch(e){} return null; }
const Q=H.Q={
 /* a lesson challenge -> a text question, or null if it needs a figure */
 fromLesson(q){
  if(q.k==='mc'){ const opts=q.a.map(t=>({t})); const ok=opts[0]; return {q:q.q,opts:G.shuffle(opts),ok:null,okT:ok.t,why:q.why,src:'lesson',id:q.id,unit:q.unit}; }
  if(q.k==='tf') return {q:q.q,opts:[{t:'TRUE'},{t:'FALSE'}],ok:q.t?0:1,why:q.why,src:'lesson',id:q.id,unit:q.unit};
  if(q.k==='fill'){ const opts=q.a.map(t=>({t:String(t).toUpperCase()})); return {q:q.q.replace('___','_____'),opts:G.shuffle(opts.slice()),okT:opts[0].t,ok:null,why:q.why,src:'lesson',id:q.id,unit:q.unit}; }
  return null;
 },
 fromBook(b,k){ const o=b.quiz[k]; const opts=o.a.map(t=>({t})); const okT=o.a[o.ok]; return {q:o.q,opts:G.shuffle(opts),ok:null,okT,why:o.why,src:'book',id:b.id+'#'+k,unit:b.unit,book:b.id}; },
 /* finish normalizing: find the right index after the shuffle */
 fix(n){ if(n.ok==null) n.ok=n.opts.findIndex(o=>o.t===n.okT); return n; },
 unitPool(uid,o){ o=o||{}; const out=[]; for(const l of H.lessons[uid]||[]) for(const q of l.qs||[]){ const n=Q.fromLesson(q); if(n){ n.unit=uid; out.push(Q.fix(n)); } }
  if(o.books!==false&&H.BOOKS) for(const b of H.BOOKS) if(b.unit===uid) b.quiz.forEach((x,k)=>out.push(Q.fix(Q.fromBook(b,k))));
  return out; },
 pick(pool,n){ return G.shuffle(pool.slice()).slice(0,n); },
 /* flashcards from a unit: question on the front, the right answer and the why on the back */
 cards(uid){ return Q.unitPool(uid).map(n=>({f:n.q,b:n.opts[n.ok].t,why:n.why,id:n.id})); }
};

/* ============================ THE QUIZ SCENE ============================ */
const NICE=['NICE!','ROGER THAT!','CLEARED!','ON COURSE!','SHARP!','GOOD READ!'];
const TRACK={drill:1,trivia:1,testout:1};   // modes whose misses count (not the placement check, not book quizzes)
G.scenes.quiz={
 enter(a){
  this.a=a; this.qs=(a.qs||[]).map(n=>Q.fix(Object.assign({},n,{opts:n.opts.slice()}))); this.title=a.title||'QUIZ'; this.sub=a.sub||''; this.timer=a.timer||0; this.pass=a.pass==null?.8:a.pass;
  this.qi=0; this.right=0; this.streak=0; this.best=0; this.score=0; this.fb=null; this.clock=0; this.over=null; this.t=0; this.perUnit={}; this.missed=[]; this.noted=false; this.m=null;
  this.ret=a.ret||{scene:'world'}; if(AUDIO.curName!=='classroom'&&AUDIO.curName!=='arcade') AUDIO.play('classroom');
  if(!this.qs.length) this.finish();
 },
 cur(){ return this.qs[this.qi]; },
 /* one label size per question, the largest at which every answer fits, so the choices read as a set */
 optSize(q){ if(q._sz) return q._sz; const w=VW-24-20; for(const z of [7.6,7.2,6.8,6.4,6]) if(q.opts.every(o=>G.tw(o.t,z,800)<=w)) return (q._sz=z); return (q._sz=6); },
 btns(){ const VH=G.VH, q=this.cur(); if(!q) return []; const n=q.opts.length, h=n>2?40:48, y0=VH-18-n*(h+6), size=this.optSize(q);
  return q.opts.map((o,i)=>({id:'o:'+i,label:o.t,x:12,y:y0+i*(h+6),w:VW-24,h,size,kind:this.fb?(i===q.ok?'success':(this.fb.pick===i?'danger':'secondary')):'secondary'})); },
 answer(i){ const q=this.cur(), ok=i===q.ok; let pts=0;
  if(ok){ this.right++; this.streak++; this.best=Math.max(this.best,this.streak); pts=100+(this.timer?Math.round(Math.max(0,1-this.clock/this.timer)*50):0)+(this.streak>=3?25:0); AUDIO.sfx(this.streak>=3?'bigpoint':'point'); }
  else { this.streak=0; this.missed.push(q); AUDIO.sfx('thud'); }
  const u=q.unit||'_'; const pu=this.perUnit[u]=this.perUnit[u]||{n:0,ok:0}; pu.n++; if(ok) pu.ok++;
  // a lesson question missed in a drill, a trivia round or a test-out comes back in HANGAR FLYING; answered right later, it clears
  if(q.src==='lesson'&&q.id&&H.noteMiss&&TRACK[this.a.mode]){ if(ok) H.noteHit(q); else H.noteMiss(q); this.noted=true; }
  this.score+=pts; this.fb={ok,pick:i,pts,t:0,review:ok?null:review(q)}; },
 next(){ this.qi++; this.fb=null; this.clock=0; if(this.qi>=this.qs.length) this.finish(); },
 finish(){ if(this.noted) G.persist(); const n=this.qs.length, pct=n?this.right/n:0, passed=pct>=this.pass, perfect=n>0&&this.right===n;
  this.over={t:0,n,right:this.right,pct,passed,perfect,score:this.score,best:this.best,perUnit:this.perUnit,missed:this.missed};
  const res=this.a.onDone?this.a.onDone(this.over,this):null; this.over.res=res||{};
  if(H.recQuiz&&this.a.mode) H.recQuiz(this.a.mode,{unit:this.a.uid||null,book:this.a.book||null,right:this.over.right,n:this.over.n,passed:!!this.over.passed,perfect:!!this.over.perfect,score:this.over.score});
  AUDIO.jingle(perfect?'fanfare':(passed?'win':'lose')); },
 overBtns(){ const VH=G.VH, B=[]; const r=this.over.res||{};
  if(r.again!==false) B.push({id:'again',label:r.againLabel||'TRY AGAIN',kind:'primary',x:24,y:VH-104,w:VW-48,h:38});
  B.push({id:'back',label:r.backLabel||'DONE',kind:r.again===false?'primary':'secondary',x:24,y:VH-60,w:VW-48,h:36}); return B; },
 update(dt){ this.t+=dt;
  if(this.m){ const r=this.m.update(); if(r==='yes'){ this.m=null; G.go(this.ret.scene,this.ret.args||{}); } else if(r==='no'||(r==null&&G.pressed.b)){ this.m=null; } return; }
  if(this.over){ this.over.t+=dt; if(this.over.t<.5) return;
   for(const b of this.overBtns()) if(G.clicked(b.x,b.y,b.w,b.h)){ AUDIO.sfx('ok'); if(b.id==='again') G.go('quiz',Object.assign({},this.a,{qs:this.a.reroll?this.a.reroll():this.a.qs})); else G.go(this.ret.scene,this.ret.args||{}); return; }
   if(G.pressed.a){ G.go(this.ret.scene,this.ret.args||{}); } return; }
  if(G.backHit()){ if(this.qi>0||this.fb){ this.m=G.confirm({title:'LEAVE THE '+(this.a.mode==='drill'?'DRILL':(this.a.mode==='testout'?'TEST':'QUIZ'))+'?',lines:['YOUR ANSWERS SO FAR','WON’T COUNT.'],yes:'LEAVE',no:'KEEP GOING'}); return; } G.go(this.ret.scene,this.ret.args||{}); return; }
  if(this.fb){ this.fb.t+=dt; if(this.fb.t>.5&&(G.ptr.click||G.pressed.a)){ G.ptr.click=false; this.next(); } return; }
  this.clock+=dt; if(this.timer&&this.clock>=this.timer){ this.answer(-1); this.fb.slow=true; AUDIO.sfx('buzzer'); return; }
  for(const b of this.btns()) if(G.clicked(b.x,b.y,b.w,b.h)){ this.answer(+b.id.slice(2)); return; }
 },
 draw(c){ const VH=G.VH, q=this.cur();
  const bg=c.createLinearGradient(0,0,0,VH); bg.addColorStop(0,'#0f1a2b'); bg.addColorStop(1,'#0a0e16'); c.fillStyle=bg; c.fillRect(0,0,VW,VH);
  G.topBar(this.title,{back:true,backLabel:'LEAVE',sub:this.sub});
  if(this.over) return this.drawOver(c);
  if(!q) return;
  // progress + streak
  const n=this.qs.length, pw=VW-24; G.rrect(12,48,pw,6,3); c.fillStyle='rgba(255,255,255,.1)'; c.fill(); G.rrect(12,48,pw*((this.qi+(this.fb?1:0))/n),6,3); c.fillStyle=C.accent; c.fill();
  G.txt((this.qi+1)+' OF '+n,12,58,5.4,C.sub,'left',undefined,800); G.txt(this.score+' PTS',VW-12,58,5.4,C.accentHi,'right',undefined,800);
  if(this.streak>=3) G.txt('🔥 '+this.streak+' IN A ROW',VW/2,58,5.4,C.warn,'center',undefined,800);
  // the clock
  let y=78; if(this.timer){ const p=1-Math.min(1,this.clock/this.timer); c.beginPath(); c.arc(VW/2,y+14,13,-PI/2,-PI/2+PI*2*p); c.lineTo(VW/2,y+14); c.closePath(); c.fillStyle=p<.3?G.rgba(C.bad,.8):G.rgba(C.accent,.7); c.fill(); c.beginPath(); c.arc(VW/2,y+14,13,0,PI*2); c.strokeStyle='rgba(255,255,255,.2)'; c.lineWidth=1.5; c.stroke(); G.txt(String(Math.ceil(this.timer-this.clock)),VW/2,y+9,7,C.ink,'center',undefined,800); y+=36; }
  const bt=this.btns(), top=bt.length?bt[0].y:VH-100, qs0=q.q.length>110?7.4:8.6, qlh=q.q.length>110?10.5:12.4, qH=G.wrap(q.q,qs0,VW-30,800).length*qlh, spare=top-y-12-12-qH-78;
  if(spare>0) y+=Math.min(70,spare*.45);   // the question settles toward the answers on a tall phone (room for the feedback stays below it)
  const u=q.unit&&H.units.find(x=>x.id===q.unit); if(u) G.txt(u.t,VW/2,y,5.2,C.dim,'center',VW-30,800); y+=12;
  const room=top-y-12;
  const qh=G.para(q.q,VW/2,y+6,q.q.length>110?7.4:8.6,C.ink,'center',VW-30,q.q.length>110?10.5:12.4,800);
  if(this.fb){ const rvw=this.fb.review, fy=y+8+qh+8, wl=G.wrap(q.why||'',5.8,VW-44,700).length, fh=Math.max(34,Math.min(room-qh-16,28+wl*8+(rvw?11:0))); G.rrect(12,fy,VW-24,fh,10); c.fillStyle=this.fb.ok?'rgba(18,61,38,.95)':'rgba(70,16,16,.95)'; c.fill(); c.strokeStyle=this.fb.ok?C.good:C.bad; c.lineWidth=1.2; c.stroke();
   G.txt(this.fb.slow?'TIME!':(this.fb.ok?NICE[this.qi%NICE.length]+' +'+this.fb.pts:'NOT QUITE'),VW/2,fy+6,7.4,this.fb.ok?C.good:C.bad,'center',VW-40,800);
   G.para(q.why||'',VW/2,fy+20,5.8,C.ink,'center',VW-44,8,700); if(rvw) G.txt(rvw,VW/2,fy+fh-11,5,C.accentText,'center',VW-40,800); if(this.fb.t>.5) G.txt('TAP TO CONTINUE',VW/2,top-12,5.2,C.accentText,'center',undefined,800); }
  G.drawBtns(bt);
  if(this.m) this.m.draw(c);
 },
 drawOver(c){ const VH=G.VH, o=this.over, r=o.res||{}, B=this.overBtns(), lim=B[0].y-10, W2=VW-50;
  // measure first, so the panel fits what it holds: the verdict, the line, the tiles, the XP, then the misses worth another look
  const lineL=r.line?G.wrap(r.line,6.6,W2,700):[], xl=r.lines||[];
  const miss=this.missed.slice(0,3).map(q=>{ const L=G.wrap(q.q,5.6,VW-60,700); return {q:L.length>2?[L[0],L[1].replace(/[\s,;:]*\S*$/,'')+'…']:L,a:q.opts[q.ok]?q.opts[q.ok].t:''}; });
  let h=16+22+(lineL.length?lineL.length*9.6+6:0)+50+xl.length*13+8;
  const missH=14+miss.reduce((t,m)=>t+m.q.length*8+15,0), showMiss=miss.length&&h+missH<=lim-70; if(showMiss) h+=missH;
  h=Math.min(Math.max(h,120),lim-70);
  G.panel(14,70,VW-28,h,{r:16,border:G.rgba(o.passed?C.good:C.accent,.6)});
  let y=86; G.txt(r.head||(o.perfect?'PERFECT!':(o.passed?'PASSED':'KEEP STUDYING')),VW/2,y,12,o.passed?C.title:C.ink,'center',VW-40,800); y+=22;
  if(lineL.length){ G.para(r.line,VW/2,y,6.6,C.sub,'center',W2,9.6,700); y+=lineL.length*9.6+6; }
  const cw=(VW-48)/3; [['RIGHT',o.right+' / '+o.n],['SCORE',String(o.score)],['STREAK',String(o.best)]].forEach(([k,v],i)=>{ const x=24+i*cw; G.rrect(x+2,y,cw-4,40,10); c.fillStyle='rgba(255,255,255,.05)'; c.fill(); G.txt(v,x+cw/2,y+7,9,C.ink,'center',cw-8,800); G.txt(k,x+cw/2,y+27,4.8,C.dim,'center',cw-8,800); }); y+=50;
  for(const [l,v] of xl){ G.txt(l,30,y,6,C.sub,'left',VW-110,800); if(v) G.txt('+'+v+' XP',VW-30,y,6,C.accentHi,'right',undefined,800); y+=13; }
  if(showMiss){ y+=4; G.txt('WORTH ANOTHER LOOK',30,y,5,C.accentText,'left',undefined,800); y+=12;
   for(const m of miss){ m.q.forEach((l,i)=>G.txt(l,30,y+i*8,5.6,C.sub,'left',VW-60,700)); y+=m.q.length*8+1; G.txt('✓ '+m.a,30,y,6,C.good,'left',VW-60,800); y+=14; } }
  if(o.t>.5) G.drawBtns(B);
 }
};

/* ============================ FLASHCARDS ============================ */
G.scenes.flash={
 enter(a){ this.a=a; this.cards=G.shuffle((a.cards||[]).slice()); this.title=a.title||'FLASHCARDS'; this.i=0; this.flip=0; this.up=false; this.known=0; this.again=[]; this.round=1; this.ret=a.ret||{scene:'practice'}; this.t=0; this.done=false; this.swipe=0;
  if(AUDIO.curName!=='classroom') AUDIO.play('classroom'); if(!this.cards.length) this.done=true; },
 card(){ return this.cards[this.i]; },
 rect(){ const VH=G.VH; return {x:16,y:92,w:VW-32,h:VH-92-140}; },
 btns(){ const VH=G.VH, w=(VW-36)/2; return [{id:'again',label:'STUDY AGAIN',kind:'danger',x:12,y:VH-96,w,h:40},{id:'got',label:'GOT IT',kind:'success',x:24+w,y:VH-96,w,h:40},{id:'flip',label:this.up?'SHOW THE QUESTION':'FLIP THE CARD',kind:'ghost',x:12,y:VH-50,w:VW-24,h:36}]; },
 rate(ok){ const k=this.card(); if(ok){ this.known++; AUDIO.sfx('point'); } else { this.again.push(k); AUDIO.sfx('thud'); }
  this.swipe=ok?1:-1; this.i++; this.up=false; this.flip=0;
  if(this.i>=this.cards.length){ if(this.again.length){ this.cards=G.shuffle(this.again); this.again=[]; this.i=0; this.round++; G.toast('ROUND '+this.round+': '+this.cards.length+' TO REVIEW',C.info); } else { this.done=true; if(this.a.onDone) this.a.onDone(this); AUDIO.jingle('win'); } } },
 update(dt){ this.t+=dt; this.flip+=((this.up?1:0)-this.flip)*Math.min(1,dt*9); this.swipe*=Math.max(0,1-dt*6);
  if(G.backHit()){ G.go(this.ret.scene,this.ret.args||{}); return; }
  if(this.done){ const VH=G.VH; if(G.clicked(24,VH-60,VW-48,36)||G.pressed.a){ AUDIO.sfx('ok'); G.go(this.ret.scene,this.ret.args||{}); } return; }
  const R=this.rect(); if(G.clicked(R.x,R.y,R.w,R.h)){ this.up=!this.up; AUDIO.sfx('card'); return; }
  for(const b of this.btns()) if(G.clicked(b.x,b.y,b.w,b.h)){ if(b.id==='flip'){ this.up=!this.up; AUDIO.sfx('card'); } else if(this.up||b.id==='again') this.rate(b.id==='got'); else { this.up=true; AUDIO.sfx('card'); } return; } },
 draw(c){ const VH=G.VH, R=this.rect(), k=this.card();
  const bg=c.createLinearGradient(0,0,0,VH); bg.addColorStop(0,'#101a2b'); bg.addColorStop(1,'#0a0e16'); c.fillStyle=bg; c.fillRect(0,0,VW,VH);
  G.topBar(this.title,{back:true,backLabel:'DONE',sub:this.a.sub||'FLASHCARDS'});
  if(this.done){ const msg='You got every card in '+this.round+(this.round>1?' rounds.':' round.')+' Flashcards are a great warm-up before a drill or a checkride.', ml=G.wrap(msg,6.8,VW-60,700).length*10; G.panel(14,90,VW-28,72+ml+30,{r:16,border:G.rgba(C.good,.6)}); G.txt('DECK COMPLETE',VW/2,106,12,C.title,'center',undefined,800); G.para(msg,VW/2,130,6.8,C.sub,'center',VW-60,10,700); G.txt(this.known+' CARDS KNOWN',VW/2,136+ml,9,C.good,'center',undefined,800); G.button({x:24,y:VH-60,w:VW-48,h:36,label:'BACK',kind:'primary'}); return; }
  G.txt('CARD '+(this.i+1)+' OF '+this.cards.length+(this.round>1?' • ROUND '+this.round:''),12,52,5.4,C.sub,'left',undefined,800); G.txt(this.known+' KNOWN',VW-12,52,5.4,C.good,'right',undefined,800);
  G.rrect(12,64,VW-24,5,2.5); c.fillStyle='rgba(255,255,255,.1)'; c.fill(); G.rrect(12,64,(VW-24)*(this.i/this.cards.length),5,2.5); c.fillStyle=C.accent; c.fill();
  // the card, flipping around its vertical axis
  const f=this.flip, sx=Math.abs(1-2*f), back=f>.5; c.save(); c.translate(R.x+R.w/2+this.swipe*18,R.y+R.h/2); c.scale(Math.max(.04,sx),1);
  c.shadowColor='rgba(0,0,0,.5)'; c.shadowBlur=18; c.shadowOffsetY=8; G.rrect(-R.w/2,-R.h/2,R.w,R.h,16); const cg=c.createLinearGradient(0,-R.h/2,0,R.h/2); if(back){ cg.addColorStop(0,'#143a2a'); cg.addColorStop(1,'#0d2a1e'); } else { cg.addColorStop(0,'#1c2a48'); cg.addColorStop(1,'#121c33'); } c.fillStyle=cg; c.fill(); c.shadowBlur=0; c.shadowOffsetY=0;
  c.strokeStyle=back?G.rgba(C.good,.7):G.rgba(C.accent,.6); c.lineWidth=1.6; c.stroke();
  G.txt(back?'ANSWER':'QUESTION',0,-R.h/2+12,5.4,back?C.good:C.accentText,'center',undefined,800);
  if(back){ // the question stays on top in small print, so the answer always reads in context
   const qh=G.wrap(k.f,6,R.w-36,700).length*8.6; G.para(k.f,0,-R.h/2+26,6,C.dim,'center',R.w-36,8.6,700);
   let y=-R.h/2+26+qh+6; c.fillStyle='rgba(255,255,255,.12)'; c.fillRect(-R.w/2+24,y,R.w-48,1); y+=10;
   const big=k.b.length>40, as=big?9:12, al=big?12:15; G.para(k.b,0,y,as,C.ink,'center',R.w-30,al,800); y+=G.wrap(k.b,as,R.w-30,800).length*al+8;
   G.para(k.why||'',0,y,6.4,C.sub,'center',R.w-34,9,700); }
  else { G.para(k.f,0,-R.h/2+40,k.f.length>120?7.4:8.8,C.ink,'center',R.w-30,k.f.length>120?10.5:12.5,800); G.txt('TAP TO FLIP',0,R.h/2-18,5.2,C.dim,'center',undefined,800); }
  c.restore();
  G.drawBtns(this.btns());
 }
};
})();
