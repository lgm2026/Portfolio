/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* THE LIBRARY (round 6): a shelf of readable books in the Classroom, each with a quiz. Content: hfq_books.js.
   Progress per cadet: G.save.mod.lib = {read:{bookId:time}, quiz:{bookId:{best, plays, passed, aced}}}
   XP: readFirst 10 (first time a book is read to the end), quizPass 15 (first pass: 7 of 8, 5 of 6), quizAce 10 (first perfect score).
   Badges: reader (first book), bookworm (8 quizzes passed), librarian (every quiz passed). */
(function(){
const H=G.HFQ, C=G.C, CL=G.CL, VW=G.VW;
H.xp=Object.assign(H.xp||{},{readFirst:10,quizPass:15,quizAce:10});
const LB=()=>{ const m=G.save.mod; m.lib=m.lib||{read:{},quiz:{},pos:{}}; m.lib.read=m.lib.read||{}; m.lib.quiz=m.lib.quiz||{}; m.lib.pos=m.lib.pos||{}; return m.lib; };
const passN=n=>Math.max(1,n-Math.floor(n/6));   // 5 of 6, 7 of 8, 10 of 12
H.lib={
 rec(id){ return LB().quiz[id]||null; },
 isRead(id){ return !!LB().read[id]; },
 passed(id){ const r=LB().quiz[id]; return !!(r&&r.passed); },
 pos(id){ return LB().pos[id]||0; }, setPos(id,i){ LB().pos[id]=i; G.persist(); },
 quizzable(b){ return b.kind!=='story'&&b.quiz&&b.quiz.length>0; },
 totals(){ const L=LB(); let read=0,passed=0,aced=0,quizzes=0; for(const b of H.BOOKS){ if(L.read[b.id]) read++; if(H.lib.quizzable(b)) quizzes++; const r=L.quiz[b.id]; if(r&&r.passed) passed++; if(r&&r.aced) aced++; } return {books:H.BOOKS.length,quizzes,read,passed,aced}; },
 markRead(id){ const L=LB(); if(L.read[id]||!H.bookById(id)) return 0; L.read[id]=Date.now(); G.persist(); const b=H.bookById(id), xp=H.xp.readFirst+(b.sec.length>=8?5:0); G.award(xp,'BOOK READ'); G.ach('reader'); if(H.feed) H.feed('read:'+id,'read '+b.t+' in the Library',{icon:'book'}); return xp; },
 quizDone(id,right,n){ const L=LB(), r=L.quiz[id]||(L.quiz[id]={best:0,plays:0,passed:false,aced:false}), b=H.bookById(id), lines=[]; let xp=0;
  r.plays++; r.best=Math.max(r.best,right); const passed=right>=passN(n), aced=right===n;
  if(passed&&!r.passed){ r.passed=true; xp+=H.xp.quizPass; lines.push(['QUIZ PASSED',H.xp.quizPass]); }
  if(aced&&!r.aced){ r.aced=true; xp+=H.xp.quizAce; lines.push(['PERFECT SCORE',H.xp.quizAce]); if(H.feed) H.feed('ace:'+id,'aced the quiz on '+b.t,{icon:'book'}); }
  const T=H.lib.totals(); if(T.passed>=8) G.ach('bookworm'); if(T.passed>=T.quizzes) G.ach('librarian');
  G.persist(); if(xp) G.award(xp,'LIBRARY QUIZ'); if(H.tickDay) H.tickDay(passed&&xp>0); if(H.checkGold&&b.unit) H.checkGold(b.unit);
  return {xp,lines,passed,aced}; },
 /* open a book's quiz (from the reader or from the Flight Path) */
 quiz(id,ret){ const b=H.bookById(id); const mk=()=>b.quiz.map((x,k)=>H.Q.fix(H.Q.fromBook(b,k)));
  const n=b.quiz.length; G.go('quiz',{title:'BOOK QUIZ',sub:b.t+' • '+passN(n)+' OF '+n+' TO PASS',qs:mk(),reroll:mk,pass:passN(n)/n,mode:'book',uid:b.unit,book:b.id,ret:ret||{scene:'book',args:{id}},
   onDone:o=>{ const r=H.lib.quizDone(id,o.right,o.n); return {head:o.perfect?'ACED IT!':(o.passed?'QUIZ PASSED':'READ IT AGAIN'),line:o.passed?'You know '+b.t+'. Every quiz you pass counts toward GOLD on the Flight Path.':passN(o.n)+' of '+o.n+' passes. The answers are all in the book.',lines:r.lines,againLabel:'TAKE IT AGAIN',backLabel:'BACK TO THE BOOK'}; }}); }
};
G.cardSub.library=()=>{ const T=H.lib.totals(); return T.read+' / '+T.books+' READ'; };

/* ============================ THE LIBRARY (the shelves) ============================ */
function bookRow(b){
 const read=H.lib.isRead(b.id), r=H.lib.rec(b.id), col=H.unitColors[Math.max(0,H.units.findIndex(u=>u.id===b.unit))]||C.accent, story=b.kind==='story', nq=b.quiz.length, pos=H.lib.pos(b.id);
 return {h:60,focus:true,t:b.t,enter:()=>({book:b.id}),tap:()=>({book:b.id}),
  draw(c,x,y,w,foc){
   G.rrect(x,y+2,w,54,12); c.fillStyle=C.card; c.fill(); c.strokeStyle=foc?C.title:(r&&r.aced?G.rgba(C.good,.6):'rgba(255,255,255,.1)'); c.lineWidth=foc?2:1; c.stroke();
   // the book's spine
   const g=c.createLinearGradient(x+8,0,x+34,0); g.addColorStop(0,G.shade(col,1.25)); g.addColorStop(.5,col); g.addColorStop(1,G.shade(col,.7)); c.fillStyle=g; G.rrect(x+8,y+8,26,42,3); c.fill(); c.fillStyle='rgba(255,255,255,.35)'; c.fillRect(x+10,y+12,22,1.2); c.fillRect(x+10,y+44,22,1.2);
   if(G.ART&&G.ART.has('book:'+b.id)){ c.save(); G.rrect(x+8,y+8,26,42,3); c.clip(); G.ART.draw(c,'book:'+b.id,x+8,y+8,26,42); c.restore(); }
   if(read){ G.icon('check',c,x+21,y+29,10,'#fff'); }
   G.txt(b.t,x+42,y+9,7.2,C.ink,'left',w-110,800); G.txt(story&&b.by?'BY '+b.by.toUpperCase():b.sub,x+42,y+22,5,C.dim,'left',w-110,700);
   G.txt((b.min||Math.max(3,Math.round(b.sec.length*.8)))+' MIN • '+b.sec.length+(story?' CHAPTERS':' SECTIONS')+(pos&&!read?' • PAGE '+(pos+1):''),x+42,y+40,4.8,C.sub,'left',w-110,800);
   const st=story?(read?'READ':(pos?'CONTINUE':'NEW')):(r&&r.aced?'ACED':(r&&r.passed?'QUIZ PASSED':(r?'QUIZ '+r.best+' / '+nq:(read?'TAKE THE QUIZ':(pos?'CONTINUE':'NEW')))));
   G.txt(st,x+w-10,y+10,5.4,r&&r.passed?C.good:(read?C.accentHi:C.dim),'right',66,800);
   G.txt('›',x+w-12,y+30,12,C.accentText,'center',undefined,800);
  }};
}
G.scenes.library={
 enter(a){ this.back=a.back||'world'; this.list=CL.List(); if(AUDIO.curName!=='classroom') AUDIO.play('classroom'); },
 area(){ return {x:4,y:46,w:VW-8,h:G.VH-50}; },
 items(){ const I=[], T=H.lib.totals();
  I.push({h:70,draw(c,x,y,w){ const cw=(w-12)/3; [[T.read+' / '+T.books,'BOOKS READ'],[T.passed+' / '+T.quizzes,'QUIZZES PASSED'],[String(T.aced),'ACED']].forEach(([v,l],i)=>{ const cx=x+i*(cw+6); G.rrect(cx,y+4,cw,58,12); c.fillStyle='rgba(255,255,255,.05)'; c.fill(); c.strokeStyle='rgba(255,255,255,.1)'; c.lineWidth=1; c.stroke(); G.txt(v,cx+cw/2,y+18,10,C.ink,'center',cw-8,800); G.txt(l,cx+cw/2,y+40,4.8,C.dim,'center',cw-8,800); }); }});
  I.push(CL.text('Real ground school, written for cadets. Read a book, then take its quiz. Passing counts toward GOLD on the Flight Path; every book goes with a unit.',{size:6.4,col:C.sub}));
  for(const s of H.SHELVES){ const bs=H.shelfBooks(s.id); if(!bs.length) continue; I.push(CL.hdr(s.t,bs.length+(bs.length===1?' BOOK':' BOOKS'),s.kind==='story'?C.info:undefined)); bs.forEach(b=>I.push(bookRow(b))); }
  return I; },
 update(){ if(G.backHit()){ G.go(this.back); return; } this.list.update(this.items(),this.area(),a=>{ if(a&&a.book) G.go('book',{id:a.book,back:'library'}); }); },
 draw(c){ const VH=G.VH; c.fillStyle='#0f151e'; c.fillRect(0,0,VW,VH); this.list.draw(c,this.items(),this.area()); G.topBar('THE LIBRARY',{back:true,backLabel:'BACK',sub:'READ, THEN PROVE IT'}); }
};

/* ============================ THE READER: one chapter a page ============================ */
G.scenes.book={
 enter(a){ this.b=H.bookById(a.id); this.back=a.back||'library'; this.list=CL.List(); this.pg=a.page!=null?a.page:Math.min(H.lib.pos(this.b.id),this.b.sec.length-1); this.toc=false; this.endT=0; this.marked=H.lib.isRead(this.b.id); this.t=0; if(AUDIO.curName!=='classroom') AUDIO.play('classroom'); },
 n(){ return this.b.sec.length; },
 area(){ const VH=G.VH; return {x:4,y:this.pg===0?46:72,w:VW-8,h:VH-(this.pg===0?46:72)-60}; },
 story(){ return this.b.kind==='story'; },
 items(){ const b=this.b, I=[], col=H.unitColors[Math.max(0,H.units.findIndex(u=>u.id===b.unit))]||C.accent, u=H.units.find(x=>x.id===b.unit), s=b.sec[this.pg], last=this.pg===this.n()-1, story=this.story();
  if(this.pg===0) I.push({h:96,draw(c,x,y,w){ G.rrect(x,y+2,w,88,14); const g=c.createLinearGradient(x,y,x+w,y+88); g.addColorStop(0,G.shade(col,.55)); g.addColorStop(1,G.shade(col,.3)); c.fillStyle=g; c.fill();
   const hasCover=G.ART&&G.ART.has('book:'+b.id); if(hasCover||(b.fig&&G.FIG&&G.FIG.has(b.fig.f))){ c.save(); G.rrect(x+w-96,y+8,88,76,8); c.clip(); c.fillStyle='rgba(255,255,255,.08)'; c.fillRect(x+w-96,y+8,88,76); if(!(hasCover&&G.ART.draw(c,'book:'+b.id,x+w-96,y+8,88,76))) G.FIG.draw(c,b.fig,x+w-94,y+14,84,64); c.restore(); }
   G.txt(b.t,x+12,y+12,9.4,'#fff','left',w-116,800); G.para(story&&b.by?'by '+b.by:b.sub,x+12,y+30,5.6,'rgba(255,255,255,.8)','left',w-116,8,700); G.txt((u&&!story?u.t+' • ':'')+(b.min||'')+(b.min?' MIN • ':'')+b.sec.length+(story?' CHAPTERS':' SECTIONS'),x+12,y+72,4.8,'rgba(255,255,255,.65)','left',w-116,800); }});
  I.push(CL.hdr((story?'CHAPTER '+(this.pg+1)+': ':'')+s.h,null,C.title));
  for(const p of s.p) I.push(CL.text(p,{size:7.2,col:C.ink,wt:600,gap:6}));
  if(s.fig&&G.FIG&&G.FIG.has(s.fig.f)){ const f=s.fig; I.push({h:132,draw(c,x,y,w){ G.rrect(x+6,y+4,w-12,120,10); c.fillStyle='rgba(255,255,255,.06)'; c.fill(); c.strokeStyle='rgba(255,255,255,.1)'; c.lineWidth=1; c.stroke(); G.FIG.draw(c,f,x+10,y+8,w-20,112); }}); }
  if(last){ const r=H.lib.rec(b.id), nq=b.quiz.length;
   if(story) I.push(CL.note(['THE END'],C.title)); else I.push(CL.note([r&&r.passed?'QUIZ PASSED: BEST '+r.best+' OF '+nq:'READY? '+nq+' QUESTIONS, '+passN(nq)+' TO PASS.'],r&&r.passed?C.good:C.accentText));
   if(H.lib.quizzable(b)) I.push(CL.action(r&&r.passed?'TAKE THE QUIZ AGAIN':'TAKE THE QUIZ',{quiz:1},'primary'));
   I.push(CL.action('BACK TO THE SHELVES',{back:1},story?'primary':'secondary')); }
  return I; },
 goPage(i){ this.pg=Math.max(0,Math.min(this.n()-1,i)); this.list.reset(); H.lib.setPos(this.b.id,this.pg); this.endT=0; AUDIO.sfx('card'); },
 bar(){ const VH=G.VH, last=this.pg===this.n()-1; return [{id:'prev',label:'◀ BACK',x:8,y:VH-50,w:70,h:40,off:this.pg===0},{id:'toc',label:'CONTENTS',x:84,y:VH-50,w:VW-168,h:40},{id:'next',label:last?'DONE ▶':'NEXT ▶',x:VW-78,y:VH-50,w:70,h:40}]; },
 update(dt){ this.t+=dt; const VH=G.VH, n=this.n();
  if(G.backHit()){ G.go(this.back); return; }
  if(this.toc){ const R=this.tocRect(); if(G.clicked(R.close.x,R.close.y,R.close.w,R.close.h)||G.pressed.b){ this.toc=false; AUDIO.sfx('back'); return; }
   for(let i=0;i<n;i++){ const r=this.tocRow(i,R); if(G.clicked(r.x,r.y,r.w,r.h)){ this.toc=false; this.goPage(i); return; } } return; }
  for(const b of this.bar()) if(!b.off&&G.clicked(b.x,b.y,b.w,b.h)){ if(b.id==='prev') this.goPage(this.pg-1); else if(b.id==='next'){ if(this.pg<n-1) this.goPage(this.pg+1); else G.go(this.back); } else { this.toc=true; AUDIO.sfx('blip'); } return; }
  if(G.pressed.right&&this.pg<n-1){ this.goPage(this.pg+1); return; } if(G.pressed.left&&this.pg>0){ this.goPage(this.pg-1); return; }
  const I=this.items(), A=this.area(); this.list.update(I,A,a=>{ if(a&&a.quiz){ if(!this.marked){ this.marked=true; H.lib.markRead(this.b.id); } AUDIO.sfx('ok'); H.lib.quiz(this.b.id,{scene:'book',args:{id:this.b.id,back:this.back,page:this.pg}}); } else if(a&&a.back) G.go(this.back); });
  // the last page, read to the end, marks the book read
  if(!this.marked&&this.pg===n-1){ const H2=this.list.prep(I,A); if(H2<=A.h||this.list.sc.scroll>=H2-A.h-30){ this.endT+=dt; if(this.endT>1.2){ this.marked=true; H.lib.markRead(this.b.id); } } } },
 tocRect(){ const VH=G.VH, n=this.n(), rh=Math.min(30,(VH-150)/n), h=Math.min(VH-80,70+n*rh); return {x:10,y:VH-h-8,w:VW-20,h,rh,close:{x:VW-44,y:VH-h-4,w:30,h:26}}; },
 tocRow(i,R){ return {x:R.x+8,y:R.y+36+i*R.rh,w:R.w-16,h:R.rh-2}; },
 draw(c){ const VH=G.VH, n=this.n(), A=this.area(); c.fillStyle='#0f151e'; c.fillRect(0,0,VW,VH);
  this.list.draw(c,this.items(),A);
  if(this.pg>0){ c.fillStyle='#0f151e'; c.fillRect(0,42,VW,30); G.txt((this.story()?'CHAPTER ':'')+(this.pg+1)+' OF '+n,12,50,5.4,C.sub,'left',undefined,800); G.txt(this.b.t,VW-12,50,5.4,C.dim,'right',VW-110,800); }
  // page dots
  const dy=this.pg>0?66:44; for(let i=0;i<n;i++){ const dw=Math.min(14,(VW-24)/n-2), x=12+i*(dw+2); G.rrect(x,dy-6,dw,3,1.5); c.fillStyle=i<this.pg?G.rgba(C.good,.7):(i===this.pg?C.accent:'rgba(255,255,255,.15)'); c.fill(); }
  // the bottom bar
  c.fillStyle=G.rgba(C.bg,.96); c.fillRect(0,VH-58,VW,58); c.fillStyle=G.rgba(C.accent,.5); c.fillRect(0,VH-58,VW,1);
  for(const b of this.bar()){ G.rrect(b.x,b.y,b.w,b.h,10); c.fillStyle=b.id==='next'?G.rgba(C.accent,.22):'rgba(255,255,255,.05)'; c.fill(); c.strokeStyle=b.id==='next'?G.rgba(C.accentHi,.8):'rgba(255,255,255,.12)'; c.lineWidth=1; c.stroke(); G.txt(b.label,b.x+b.w/2,b.y+14,6,b.off?C.dim:C.ink,'center',b.w-6,800); }
  if(this.toc){ const R=this.tocRect(); G.dim(.6); G.panel(R.x,R.y,R.w,R.h,{r:14,border:G.rgba(C.accent,.6)}); G.txt('CONTENTS',R.x+14,R.y+12,8.6,C.title,'left',R.w-70,800); G.rrect(R.close.x,R.close.y+4,R.close.w,R.close.h-8,8); c.fillStyle='rgba(255,255,255,.08)'; c.fill(); G.txt('✕',R.close.x+R.close.w/2,R.close.y+8,8,C.ink,'center',undefined,800);
   for(let i=0;i<n;i++){ const r=this.tocRow(i,R), cur=i===this.pg; G.rrect(r.x,r.y,r.w,r.h,6); c.fillStyle=cur?G.rgba(C.accent,.2):'rgba(255,255,255,.04)'; c.fill(); G.txt((i+1)+'. '+this.b.sec[i].h,r.x+10,r.y+r.h/2-4,Math.min(6.4,r.h*.3),cur?C.ink:C.sub,'left',r.w-40,800); if(i<this.pg||this.marked) G.icon('check',c,r.x+r.w-14,r.y+r.h/2,9,C.good); } }
  G.topBar(this.b.t,{back:true,backLabel:'BACK',sub:'THE LIBRARY'}); }
};
})();
