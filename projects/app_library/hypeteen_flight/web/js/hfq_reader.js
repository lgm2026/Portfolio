/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* THE LIBRARY, VERSION 2 (r7): one Library for both kinds of book, in real HTML so it reads like an e-reader.
   - THE SERIES: the seven HypeTeen Flight Academy novels (content/series.js), free to read start to finish. A book's
     text loads on demand from js/content/lazy/series/<id>.js the first time it is opened (then it is cached offline).
     Any book still marked status:'soon' shows COMING SOON instead.
   - GROUND SCHOOL BOOKS: the 32 short books (content/books/), each with its quiz. Same rules as before: reaching the end
     marks a book read (+XP), its quiz counts toward GOLD, and the page a cadet stopped on is kept (H.lib.pos, unchanged).
   The reader: one chapter at a time, resume where you left off, bookmarks, contents, text size, line spacing, serif or sans,
   night / sepia / day pages, keyboard and screen-reader friendly, works offline. Nothing is gated behind owning a book.
   Progress: G.save.mod.read[docId] = {ch, f (0-1 through the chapter), at, done, bm:[{ch, f, at}]}; reader preferences in
   G.save.mod.ui.reader. Replaces the canvas Library scenes (kept as library_r6 / book_r6 for reference). */
(function(){
const H=G.HFQ, UI=H.UI, h=UI.h, T=UI.title;
const sfx=n=>{ try{ AUDIO.sfx(n); }catch(e){} };
const NUM=['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine'];
G.scenes.library_r6=G.scenes.library; G.scenes.book_r6=G.scenes.book;
UI.host('library',a=>({view:a.series?'series':'library',args:a.series?{n:a.series}:{},back:a.back||(H.isHub()?'hub':'world')}));
UI.host('book',a=>({view:'read',args:{doc:'gs:'+a.id,ch:a.page!=null?a.page:undefined},back:a.back||(H.isHub()?'hub':'library')}));
UI.host('reader',a=>({view:'read',args:{doc:a.doc,ch:a.ch},back:a.back||(H.isHub()?'hub':'library')}));

/* ---------------- lazy content: <script> injection (works offline once cached, and from file://) ---------------- */
const loading={};
H.loadContent=function(path){
 if(loading[path]) return loading[path];
 loading[path]=new Promise((res,rej)=>{ const s=document.createElement('script'); s.src=path; s.async=true; s.onload=()=>res(true); s.onerror=()=>{ delete loading[path]; rej(new Error('could not load '+path)); }; document.head.appendChild(s); });
 return loading[path];
};

/* ---------------- documents: a ground school book or a novel, as chapters of blocks ---------------- */
function docOf(id){
 if(!id) return null;
 if(id.indexOf('gs:')===0){ const b=H.bookById(id.slice(3)); if(!b) return null;
  return {id, kind:'guide', book:b, title:T(b.t), sub:b.sub, accent:(H.unitColors&&H.unitColors[Math.max(0,H.units.findIndex(u=>u.id===b.unit))])||'#183B5A',
   chapters:b.sec.map(s=>({t:T(s.h),blocks:s.p.map(p=>({p})).concat(s.fig?[{fig:s.fig}]:[])}))}; }
 const sb=H.seriesBook(id), tx=H.SERIES_TEXT[id];
 if(!sb||!tx) return null;
 return {id, kind:'novel', series:sb, title:sb.t||'Book '+NUM[sb.n], sub:'HypeTeen Flight Academy • Book '+NUM[sb.n], accent:sb.accent, chapters:tx.chapters};
}
H.readerDoc=docOf;
const RS=()=>{ const m=G.save.mod; m.read=m.read||{}; return m.read; };
const rstate=id=>{ const r=RS(); r[id]=r[id]||{ch:0,f:0,at:0,bm:[]}; r[id].bm=r[id].bm||[]; return r[id]; };
const prefs=()=>{ const p=UI.prefs(), d={size:20,lh:1.65,face:'serif',theme:'night'}; p.reader=p.reader||{}; for(const k in d) if(!(k in p.reader)) p.reader[k]=d[k]; return p.reader; };
const words=doc=>doc.chapters.reduce((n,c)=>n+c.blocks.reduce((m,b)=>m+String(b.p||b.q||b.note||'').split(/\s+/).filter(Boolean).length,0),0);
const minutes=n=>Math.max(1,Math.round(n/200));   // about 200 words a minute for a young reader

/* ---------------- the covers: the real front cover when the book has one, otherwise painted art + a typeset title ---------------- */
function cover(sb,small){
 const c=h('div',{class:'cover'+(sb.cover?' real':''),'aria-hidden':'true',style:{'--c':sb.accent}});
 if(sb.cover){ c.appendChild(h('img',{src:sb.cover,alt:'',loading:'lazy',decoding:'async'})); return c; }
 if(sb.art){ const a=h('div',{class:'art'}); a.style.backgroundImage='url("'+sb.art+'")'; c.appendChild(a); }
 c.appendChild(h('div',{class:'band'},h('div',{class:'ser',text:'HypeTeen Flight Academy'}),h('div',{class:'num',text:'Book '+NUM[sb.n]})));
 c.appendChild(h('div',{class:'title',text:sb.t||'Title coming soon',style:small?{}:{fontSize:'clamp(18px,5vw,30px)'}}));
 return c;
}
/* inline *emphasis* and **strong** from the manuscripts, rendered as runs: the text is never parsed as HTML */
function inline(s){ s=String(s); if(s.indexOf('*')<0) return document.createTextNode(s); const f=document.createDocumentFragment(); const re=/\*\*([^*]+)\*\*|\*([^*]+)\*/g; let i=0, m;
 while((m=re.exec(s))){ if(m.index>i) f.appendChild(document.createTextNode(s.slice(i,m.index))); f.appendChild(h(m[1]!=null?'strong':'em',{text:m[1]!=null?m[1]:m[2]})); i=m.index+m[0].length; }
 if(i<s.length) f.appendChild(document.createTextNode(s.slice(i))); return f; }
UI.inline=inline;
UI.cover=cover;

/* ============================ THE LIBRARY ============================
   r7.4 order: general ground school first, the novels last. 1) the ground school books, shelf by shelf from how flight works to
   the airport, the sky, aircraft of every kind and history; 2) quizzes and practice; 3) the seven-book HypeTeen Flight
   Academy series, in its own order with its own covers, at the bottom (a link at the top jumps straight to it). */
const SHELF_ORDER=['flight','airplane','airport','weather','sky','types','history'];
const shelvesInOrder=()=>H.SHELVES.slice().sort((a,b)=>{ const i=SHELF_ORDER.indexOf(a.id), j=SHELF_ORDER.indexOf(b.id); return (i<0?99:i)-(j<0?99:j)||H.SHELVES.indexOf(a)-H.SHELVES.indexOf(b); });
H.libraryShelves=shelvesInOrder;   // QA + the Hub
UI.define('library',{ title:'The Library', sub:()=>{ const t=H.lib.totals(); return t.read+' of '+t.books+' books read'; }, music:'classroom',
 actions:()=>[{icon:'search',label:'Search the Library',onClick:()=>UI.show('search',{q:'',cat:'Library'})}],
 render(){ const M=h('main',{}), t=H.lib.totals();
  const toSeries=()=>{ const el=document.getElementById('lib-series'); if(el){ el.scrollIntoView({behavior:G.rm()?'auto':'smooth',block:'start'}); const hh=document.getElementById('lib-series-h'); if(hh) hh.focus({preventScroll:true}); } };
  M.appendChild(h('div',{class:'row',style:{justifyContent:'space-between',alignItems:'center',gap:'8px',flexWrap:'wrap'}},
   h('p',{class:'small muted',style:{margin:'0'},text:'Ground school books first. The HypeTeen Flight Academy novels are at the bottom.'}),
   h('button',{class:'btn ghost',type:'button',onclick:toSeries},UI.icon('book'),'The seven-book series')));
  /* 1) ground school books */
  M.appendChild(h('h2',{text:'Ground school books'}));
  M.appendChild(h('div',{class:'stats'},h('div',{class:'stat'},h('b',{text:t.read+' / '+t.books}),h('span',{text:'Books read'})),h('div',{class:'stat'},h('b',{text:t.passed+' / '+t.quizzes}),h('span',{text:'Quizzes passed'})),h('div',{class:'stat'},h('b',{text:String(t.aced)}),h('span',{text:'Aced'}))));
  M.appendChild(h('p',{class:'muted small',style:{marginTop:'10px'},text:'Real ground school, written for cadets. Read a book, then take its quiz. Passing counts toward GOLD on the Flight Path.'}));
  for(const sh of shelvesInOrder()){ const bs=H.shelfBooks(sh.id); if(!bs.length) continue;
   M.appendChild(h('h3',{style:{margin:'18px 0 8px',letterSpacing:'.08em',textTransform:'uppercase',fontSize:'.86em',color:'var(--brass-ink)'},text:T(sh.t)+' • '+UI.plural(bs.length,'book')}));
   const L=h('div',{class:'list'});
   for(const b of bs){ const r=H.lib.rec(b.id), read=H.lib.isRead(b.id), pos=H.lib.pos(b.id), col=(H.unitColors&&H.unitColors[Math.max(0,H.units.findIndex(u=>u.id===b.unit))])||'#183B5A';
    const st=r&&r.aced?'ACED':(r&&r.passed?'QUIZ PASSED':(read?'TAKE THE QUIZ':(pos?'CONTINUE':'NEW')));
    L.appendChild(UI.item(h('span',{class:'spine',style:{'--c':col}}),T(b.t),b.sub+' • '+(b.min||Math.max(3,Math.round(b.sec.length*.8)))+' min',st,()=>UI.show('bookinfo',{id:b.id}))); }
   M.appendChild(L); }
  /* 2) quizzes and practice */
  M.appendChild(h('h2',{text:'Quizzes + practice'}));
  M.appendChild(h('p',{class:'muted small',text:'Every book above ends with a quiz. For more, the Practice Hub has flashcards for every unit, timed Flight Trivia and drills, and HANGAR FLYING brings back every question you have missed until you get it right.'}));
  M.appendChild(h('div',{class:'row'},h('button',{class:'btn',type:'button',onclick:()=>UI.go('practice',{back:'library'})},UI.icon('cards'),'Open the Practice Hub')));
  /* 3) the series, last */
  const sec=h('section',{id:'lib-series','aria-labelledby':'lib-series-h',style:{marginTop:'26px'}});
  sec.appendChild(h('h2',{id:'lib-series-h',tabindex:'-1',text:'HypeTeen Flight Academy: the seven-book series'}));
  const nAvail=H.SERIES.filter(b=>b.status==='available').length;
  sec.appendChild(h('p',{class:'lede',text:(nAvail===H.SERIES.length?'All seven books, free to read right here, start to finish.':nAvail+' of seven books are free to read right here; the rest arrive as they are released.')+' The academy’s phases are named after them.'}));
  const S=h('div',{class:'shelf'});
  for(const sb of H.SERIES){ const avail=sb.status==='available', st=rstate(sb.id);
   S.appendChild(h('button',{type:'button','aria-label':'Book '+NUM[sb.n]+': '+(sb.t||'title coming soon')+(avail?'':'. Coming soon'),onclick:()=>UI.show('series',{n:sb.n})},cover(sb,true),
    h('div',{class:'meta'},h('b',{text:sb.t||'Book '+NUM[sb.n]}),h('small',{text:avail?(st.at?'Chapter '+(st.ch+1)+(st.done?' • finished':''):(sb.age?sb.age+' • free to read':'Free to read')):'Coming soon'})))); }
  sec.appendChild(S); M.appendChild(sec);
  return M; }
});

/* ============================ ONE BOOK OF THE SERIES ============================ */
UI.define('series',{ title:a=>{ const sb=H.seriesBook(a.n); return sb?(sb.t||'Book '+NUM[sb.n]):'The series'; }, sub:a=>'The series • Book '+(NUM[a.n]||''),
 render(a){ const sb=H.seriesBook(a.n), M=h('main',{}); if(!sb) return h('p',{text:'Book not found.'});
  const avail=sb.status==='available', st=rstate(sb.id), phase=H.phases[sb.n-1];
  const wrap=h('div',{class:'bookhead'});
  wrap.appendChild(h('div',{},cover(sb)));
  const info=h('div',{});
  info.appendChild(h('div',{class:'row'},h('span',{class:'chip '+(avail?'good':'warn'),text:avail?'Free to read':'Coming soon'}),h('span',{class:'chip',text:'Book '+NUM[sb.n]+' of 7'})));
  if(avail){
   if(sb.tagline) info.appendChild(h('p',{class:'eyebrow',style:{marginTop:'12px'},text:sb.tagline}));
   info.appendChild(h('p',{class:'lede',style:{marginTop:'8px'}},inline(sb.blurb||'')));
   info.appendChild(h('p',{class:'small muted',text:(sb.age?sb.age+' • ':'')+(sb.chapters?UI.plural(sb.chapters,'chapter')+' • ':'')+(sb.words?'about '+minutes(sb.words)+' min of reading':'')}));
   info.appendChild(h('p',{class:'small muted',text:'The story comes first. Ground School Notes at the end of the book link to the academy units they belong to, so nothing is spoiled.'}));
   info.appendChild(h('div',{class:'row'},h('button',{class:'btn primary',type:'button',onclick:()=>openNovel(sb)},UI.icon('book'),st.at?'Continue reading':'Start reading'),st.at?h('span',{class:'small muted',text:'Chapter '+(st.ch+1)+(st.done?' • finished':'')}):null));
  } else {
   info.appendChild(h('p',{class:'lede',style:{marginTop:'12px'},text:sb.t?'This book will be free to read here, start to finish, as soon as it is released.':'The seventh book’s title has not been announced yet. It will be free to read here when it is released.'}));
   info.appendChild(h('p',{class:'small muted',text:'Nothing in the academy needs the books: every lesson, game and badge is open to every cadet. When a book arrives, any Ground School topics that go with its chapters will show up at the end of each chapter, after you have read it, so nothing is spoiled.'}));
  }
  if(phase) info.appendChild(h('div',{class:'note',style:{marginTop:'12px'}},'Academy phase '+sb.n+' is named for this book: ',h('b',{text:T(phase.n)}),'. It starts at '+phase.xp+' XP.'));
  wrap.appendChild(info); M.appendChild(wrap);
  M.appendChild(h('h2',{text:'The whole series'}));
  const S=h('div',{class:'list'}); for(const b of H.SERIES) S.appendChild(UI.item(h('span',{class:'spine',style:{'--c':b.accent}}),'Book '+NUM[b.n]+': '+(b.t||'Title coming soon'),b.status==='available'?'Free to read':'Coming soon',b.n===sb.n?'THIS BOOK':'',b.n===sb.n?null:()=>UI.replace('series',{n:b.n})));
  M.appendChild(S);
  return M; }
});
function openNovel(sb){ if(!sb.file){ UI.toast('This book is not in the app yet.'); return; } UI.toast('Opening the book…'); H.loadContent(sb.file).then(()=>{ if(!H.SERIES_TEXT[sb.id]) throw new Error('empty'); UI.show('read',{doc:sb.id}); }).catch(()=>UI.dialog({title:'The book could not open',body:h('p',{text:'It needs the internet the first time, then it works offline. Check your connection and try again.'})})); }
H.openNovel=openNovel;

/* ============================ A GROUND SCHOOL BOOK'S PAGE ============================ */
UI.define('bookinfo',{ title:a=>{ const b=H.bookById(a.id); return b?T(b.t):'Book'; }, sub:a=>{ const b=H.bookById(a.id); const u=b&&H.units.find(x=>x.id===b.unit); return u?'Ground School • '+T(u.t):'Ground School'; },
 render(a){ const b=H.bookById(a.id), M=h('main',{}); if(!b) return h('p',{text:'Book not found.'});
  const r=H.lib.rec(b.id), read=H.lib.isRead(b.id), pos=H.lib.pos(b.id), nq=b.quiz.length, pass=Math.max(1,nq-Math.floor(nq/6));
  M.appendChild(h('p',{class:'lede',text:b.sub}));
  M.appendChild(h('div',{class:'row',style:{margin:'4px 0 14px'}},h('span',{class:'chip',text:(b.min||Math.max(3,Math.round(b.sec.length*.8)))+' min'}),h('span',{class:'chip',text:UI.plural(b.sec.length,'chapter')}),read?h('span',{class:'chip good',text:'Read'}):null,r&&r.passed?h('span',{class:'chip good',text:'Quiz passed • best '+r.best+' / '+nq}):null));
  M.appendChild(h('div',{class:'row'},h('button',{class:'btn primary',type:'button',onclick:()=>UI.show('read',{doc:'gs:'+b.id})},UI.icon('book'),pos&&!read?'Continue at chapter '+(pos+1):(read?'Read again':'Start reading')),
   H.lib.quizzable(b)?h('button',{class:'btn',type:'button',onclick:()=>quiz(b)},UI.icon('check'),(r&&r.passed?'Quiz again':'Take the quiz')+' ('+pass+' of '+nq+')'):null));
  M.appendChild(h('h2',{text:'Contents'}));
  const L=h('ol',{class:'list',style:{listStyle:'none',padding:0,margin:0}});
  b.sec.forEach((s,i)=>L.appendChild(h('li',{},UI.item(h('span',{text:String(i+1),style:{font:'700 15px var(--font-ui)'}}),T(s.h),'',i<pos||read?'✓':'',()=>UI.show('read',{doc:'gs:'+b.id,ch:i})))));
  M.appendChild(L);
  const u=H.units.find(x=>x.id===b.unit); if(u) M.appendChild(h('div',{class:'row',style:{marginTop:'14px'}},h('button',{class:'btn',type:'button',onclick:()=>{ if(H.isHub()) UI.show('unit',{unit:u.id}); else UI.go('route',{unit:u.id,back:'library'}); }},UI.icon('path'),'Its unit: '+T(u.t))));
  return M; }
});
/* the quiz is the canvas quiz engine; coming back restores this screen (an empty-args return to the host scene) */
UI.bookQuiz=function(b){ sfx('ok'); const sc=UI.scroller(); H.lib.quiz(b.id,{scene:G.sceneName||'library',args:{}}); };
const quiz=b=>UI.bookQuiz(b);

/* ============================ THE READER ============================ */
let readT=null;
UI.define('read',{ bare:true, className:'reader-host',
 title:a=>{ const d=docOf(a.doc); return d?d.title:'Reader'; },
 onHide:a=>{ saveNow(); }, onLeave:a=>{ saveNow(); },
 render(a,ctx){ const d=docOf(a.doc), P=prefs();
  if(!d) return h('div',{class:'reader','data-theme':P.theme},h('header',{class:'bar'},h('div',{class:'side'},h('button',{class:'iconbtn',type:'button','aria-label':'Back',onclick:()=>UI.back()},UI.icon('back'),h('span',{class:'lbl',text:'Back'}))),h('div',{class:'ttl'},h('h1',{id:'ui-title',tabindex:'-1',text:'Reader'})),h('div',{class:'side r'})),
   h('main',{},h('div',{class:'note bad',role:'alert',text:'This book is not available on this device. Go back and choose another.'})));
  const st=rstate(d.id); let ch=a.ch!=null?Math.max(0,Math.min(d.chapters.length-1,a.ch|0)):Math.max(0,Math.min(d.chapters.length-1,st.ch|0));
  if(d.kind==='guide'&&a.ch==null){ const p=H.lib.pos(d.book.id); if(p&&p!==st.ch) ch=Math.min(d.chapters.length-1,p); }
  const C=d.chapters[ch], last=ch===d.chapters.length-1, total=words(d);
  const root=h('div',{class:'reader','data-theme':P.theme,'data-face':P.face,style:{'--read-size':P.size+'px','--read-lh':String(P.lh)}});
  const prog=h('i',{});
  const bar=h('header',{class:'bar'},h('div',{class:'side'},h('button',{class:'iconbtn',type:'button','aria-label':'Back',onclick:()=>{ saveNow(); UI.back(); }},UI.icon('back'),h('span',{class:'lbl',text:'Back'}))),
   h('div',{class:'ttl'},h('h1',{id:'ui-title',tabindex:'-1',text:d.title}),h('span',{class:'sub',text:'Chapter '+(ch+1)+' of '+d.chapters.length})),
   h('div',{class:'side r'},h('button',{class:'iconbtn',type:'button','aria-label':'Contents and bookmarks',onclick:()=>tocDialog(d,ch)},UI.icon('list')),h('button',{class:'iconbtn',type:'button','aria-label':'Add a bookmark here',onclick:()=>addBookmark(d)},UI.icon('bookmark')),h('button',{class:'iconbtn',type:'button','aria-label':'Text and page settings',onclick:()=>prefsDialog(a)},UI.icon('text'))));
  root.appendChild(bar);
  root.appendChild(h('div',{class:'progress','aria-hidden':'true'},prog));
  const art=h('article',{lang:'en','aria-labelledby':'ch-title'});
  const named=/^(prologue|chapter|epilogue|part)\b/i.test(C.t||'');   // novels number their own chapters; guides get the eyebrow
  if(!named) art.appendChild(h('span',{class:'chno',text:'Chapter '+(ch+1)}));
  const tt=String(C.t||('Chapter '+(ch+1))).split(/\s+—\s+/);   // 'Chapter One — The Photograph': the number as the eyebrow, the title big
  if(named&&tt.length>1){ art.appendChild(h('span',{class:'chno',text:tt[0]})); art.appendChild(h('h2',{id:'ch-title',text:tt.slice(1).join(' — ')})); }
  else art.appendChild(h('h2',{id:'ch-title',text:C.t||('Chapter '+(ch+1))}));
  for(const b of C.blocks){
   if(b.p!=null) art.appendChild(h('p',{},inline(b.p)));
   else if(b.h) art.appendChild(h('h3',{},inline(b.h)));
   else if(b.brk) art.appendChild(h('div',{class:'brk','aria-hidden':'true',text:'✦'}));
   else if(b.q) art.appendChild(h('blockquote',{},inline(b.q)));
   else if(b.note) art.appendChild(h('div',{class:'notecard',role:'note',text:b.note}));
   else if(b.img) art.appendChild(h('figure',{},h('img',{src:b.img,alt:b.alt||'',loading:'lazy'}),b.cap?h('figcaption',{text:b.cap}):null));
   else if(b.fig&&G.FIG&&G.FIG.has(b.fig.f)) art.appendChild(figure(b.fig));
  }
  root.appendChild(art);
  // the end of the chapter: links (only after reading it), quiz, next
  const end=h('div',{class:'endcard'});
  if(C.links&&C.links.length){ const L=h('div',{class:'card'},h('span',{class:'eyebrow',text:'In the academy'}),h('p',{class:'small muted',text:'Topics from this chapter you can fly in Ground School.'}));
   C.links.forEach(l=>{ const act=H.REG.get(l.a); if(act) L.appendChild(h('button',{class:'btn',type:'button',style:{margin:'4px 6px 0 0'},onclick:()=>{ saveNow(); H.REG.launch(l.a,G.sceneName); }},l.t||act.title)); }); end.appendChild(L); }
  if(last){
   if(d.kind==='guide'){ const b=d.book, r=H.lib.rec(b.id), nq=b.quiz.length, pass=Math.max(1,nq-Math.floor(nq/6));
    end.appendChild(h('div',{class:'card'},h('h3',{text:'The end'}),h('p',{class:'muted small',text:r&&r.passed?'Quiz passed: best '+r.best+' of '+nq+'.':'Ready? '+nq+' questions, '+pass+' to pass. Passing counts toward GOLD.'}),
     H.lib.quizzable(b)?h('button',{class:'btn primary',type:'button',onclick:()=>{ markEnd(d); saveNow(); UI.bookQuiz(b); }},UI.icon('check'),r&&r.passed?'Take the quiz again':'Take the quiz'):null));
   } else { const nx=H.seriesBook(d.series.n+1); end.appendChild(h('div',{class:'card'},h('h3',{text:'The end of Book '+NUM[d.series.n]}),h('p',{class:'muted small',text:nx?'Book '+NUM[nx.n]+(nx.t?', '+nx.t+',':'')+(nx.status==='available'?' is next, and it is right here.':' is next in the series.'):'That is the whole series. Thank you for flying with Lincoln and his friends.'}),
     nx&&nx.status==='available'?h('button',{class:'btn primary',type:'button',onclick:()=>{ markEnd(d); saveNow(); UI.replace('series',{n:nx.n}); }},UI.icon('book'),'Open Book '+NUM[nx.n]):null)); }
  }
  root.appendChild(end);
  const nav=h('nav',{class:'chapnav','aria-label':'Chapters'},
   h('button',{class:'btn',type:'button',disabled:ch===0,onclick:()=>goCh(a,d,ch-1)},UI.icon('back'),'Previous'),
   last?h('button',{class:'btn primary',type:'button',onclick:()=>{ markEnd(d); saveNow(); UI.back(); }},'Done'):h('button',{class:'btn primary',type:'button',onclick:()=>goCh(a,d,ch+1)},'Next chapter',UI.icon('right')));
  root.appendChild(nav);
  root.appendChild(h('p',{class:'tiny',style:{textAlign:'center',color:'var(--rmuted)',padding:'0 16px 30px'},text:d.title+' • about '+minutes(total)+' min • your place is saved on this device'}));
  // remember where we are
  st.ch=ch; st.at=Date.now(); if(d.kind==='guide') H.lib.setPos(d.book.id,ch); else G.persist();
  a.ch=ch; cur={a,d,ch,prog,st};
  return root; },
 after(a,sc){ if(!cur) return; const st=cur.st;
  const f=(a.f!=null?a.f:(st.ch===cur.ch?st.f:0))||0; a.f=null;
  requestAnimationFrame(()=>{ const max=sc.scrollHeight-sc.clientHeight; if(f>0&&max>0) sc.scrollTop=f*max; onScroll(); });
  sc.onscroll=()=>{ clearTimeout(readT); readT=setTimeout(()=>{ onScroll(); },120); requestAnimationFrame(paint); };
  const t=document.getElementById('ui-title'); if(t) t.focus({preventScroll:true});
 }
});
let cur=null, endT=null;
function frac(){ const sc=UI.scroller(); if(!sc) return 0; const max=sc.scrollHeight-sc.clientHeight; return max>0?Math.max(0,Math.min(1,sc.scrollTop/max)):1; }
function paint(){ if(cur&&cur.prog) cur.prog.style.width=Math.round(frac()*100)+'%'; }
function onScroll(){ if(!cur) return; paint(); cur.st.f=frac(); cur.st.at=Date.now();
 // the last chapter, read to the end, marks the book read (the same rule as before: the end, then a moment)
 if(cur.ch===cur.d.chapters.length-1&&frac()>=.98){ clearTimeout(endT); const d=cur.d; endT=setTimeout(()=>{ if(cur&&cur.d===d&&frac()>=.98) markEnd(d); },1200); } }
function saveNow(){ if(!cur) return; cur.st.f=frac(); cur.st.at=Date.now(); G.persist(); }
function markEnd(d){ const st=rstate(d.id); if(d.kind==='guide'){ if(H.bookById(d.book.id)&&!H.lib.isRead(d.book.id)) H.lib.markRead(d.book.id); } else if(!st.done){ st.done=Date.now(); G.persist(); H.rec('readseries',{n:d.series.n},'series:'+d.series.n); G.persist(); } }
function goCh(a,d,i){ saveNow(); sfx('card'); const st=rstate(d.id); st.ch=i; st.f=0; UI.replace('read',{doc:d.id,ch:i}); }
function figure(spec){
 const W=480, Hh=240, cv=h('canvas',{width:String(W*2),height:String(Hh*2),role:'img','aria-label':'Figure: '+(spec.alt||spec.f)});
 const ctx=cv.getContext('2d');
 try{ ctx.setTransform(2,0,0,2,0,0); ctx.fillStyle='#10263D'; ctx.fillRect(0,0,W,Hh); G.withCtx(ctx,()=>G.FIG.draw(ctx,spec,8,8,W-16,Hh-16)); }catch(e){ console.warn('figure',e); }
 return h('figure',{style:{background:'#10263D'}},cv);
}
function addBookmark(d){ const st=rstate(d.id); const f=frac(); if(st.bm.some(b=>b.ch===st.ch&&Math.abs(b.f-f)<.02)){ UI.toast('Already bookmarked here'); return; } st.bm.push({ch:st.ch,f,at:Date.now()}); st.bm=st.bm.slice(-50); G.persist(); UI.toast('Bookmark added: chapter '+(st.ch+1)); sfx('ok'); }
function tocDialog(d,ch){
 const st=rstate(d.id), body=h('div',{class:'toc'});
 const L=h('div',{class:'list'}); d.chapters.forEach((c,i)=>L.appendChild(UI.item(h('span',{text:String(i+1),style:{font:'700 14px var(--font-ui)'}}),c.t||'Chapter '+(i+1),'',i===ch?'HERE':(i<st.ch?'✓':''),()=>{ dlg.close(); goCh(cur.a,d,i); })));
 body.appendChild(h('h3',{style:{margin:'0 0 8px'},text:'Chapters'})); body.appendChild(L);
 body.appendChild(h('h3',{style:{margin:'16px 0 8px'},text:'Bookmarks'}));
 if(!st.bm.length) body.appendChild(h('p',{class:'muted small',text:'None yet. The bookmark button marks the spot you are reading.'}));
 else { const B=h('div',{class:'list'}); st.bm.slice().reverse().forEach(b=>{ const row=h('div',{class:'row'},UI.item('bookmark','Chapter '+(b.ch+1)+' • '+Math.round(b.f*100)+'% through',UI.date(b.at),'',()=>{ dlg.close(); saveNow(); st.ch=b.ch; st.f=b.f; UI.replace('read',{doc:d.id,ch:b.ch,f:b.f}); }),h('button',{class:'iconbtn',type:'button','aria-label':'Remove this bookmark',onclick:()=>{ st.bm=st.bm.filter(x=>x!==b); G.persist(); row.remove(); }},UI.icon('trash'))); row.firstChild.style.flex='1'; B.appendChild(row); }); body.appendChild(B); }
 const dlg=UI.dialog({title:d.title,body,actions:[{label:'Close',kind:'ghost'}]});
}
function prefsDialog(a){
 const P=prefs(), body=h('div',{class:'readpanel stack'});
 const seg=(label,opts,val,set)=>{ const g=h('div',{class:'seg',role:'group','aria-label':label}); opts.forEach(([v,l])=>{ const b=h('button',{type:'button','aria-pressed':String(v===val),onclick:()=>{ set(v); [...g.children].forEach(c=>c.setAttribute('aria-pressed',String(c===b))); apply(); }},l); g.appendChild(b); }); return h('div',{},h('b',{class:'small',text:label}),h('div',{style:{marginTop:'6px'}},g)); };
 const apply=()=>{ G.persist(); const el=document.querySelector('#ui .reader'); if(el){ el.dataset.theme=P.theme; el.dataset.face=P.face; el.style.setProperty('--read-size',P.size+'px'); el.style.setProperty('--read-lh',String(P.lh)); } };
 body.appendChild(seg('Text size',[[16,'A−'],[18,'A'],[20,'A+'],[23,'A++'],[27,'A+++']],P.size,v=>{ P.size=v; }));
 body.appendChild(seg('Line spacing',[[1.45,'Tight'],[1.65,'Normal'],[1.9,'Airy']],P.lh,v=>{ P.lh=v; }));
 body.appendChild(seg('Typeface',[['serif','Book'],['sans','Clean']],P.face,v=>{ P.face=v; }));
 body.appendChild(seg('Page',[['night','Night'],['sepia','Sepia'],['day','Day']],P.theme,v=>{ P.theme=v; }));
 UI.dialog({title:'Reading settings',body,actions:[{label:'Done',kind:'primary'}]});
}
/* old entry points keep working: the Classroom bookshelf, the Flight Path READ node, the quiz's way back */
G.cardSub.library=()=>{ const T2=H.lib.totals(); return T2.read+' / '+T2.books+' READ • THE SERIES'; };
/* the series in search */
H.REG.extra.push(()=>H.SERIES.map(sb=>({id:'series:'+sb.n,kind:'series',n:sb.n,title:'Book '+NUM[sb.n]+': '+(sb.t||'title coming soon'),sub:sb.status==='available'?'Free to read':'Coming soon',cat:'Library',icon:'book',objective:'Read the HypeTeen Flight Academy, book '+sb.n+'.',prereq:'None. Free.',assess:'None: reading for fun.',est:sb.words?minutes(sb.words):null,diff:1,
 words:'hypeteen flight academy novel series book '+(sb.t||'')+' '+(sb.blurb||''),avail:()=>({ok:true,why:''}),status:()=>({done:!!rstate(sb.id).done,label:sb.status==='available'?'FREE':'SOON'}),launch:back=>{ G.go('library',{series:sb.n,back}); return true; }})));
})();
