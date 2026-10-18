/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* THE ACADEMY HUB (r7, Gate 4): the direct-access way through the academy. Turned on per profile in Settings (ACADEMY HUB
   MODE); the walkable airfield stays the default. Every lesson, game, book, place, crew member and tool is one tap away, and
   every one of them runs through the activity registry (hfq_registry.js), so nothing differs from walking there: the same
   scenes, the same scores, the same XP and badges. Visiting a place's page counts as visiting it; meeting the crew here is
   meeting them there. Views: home, search, pathlist, unit, games, airfield, place, achievements, settings, briefing. */
(function(){
const H=G.HFQ, UI=H.UI, h=UI.h, R=H.REG;
const T=UI.title;
const sfx=n=>{ try{ AUDIO.sfx(n); }catch(e){} };
UI.host('hub',a=>a&&a.view?{view:a.view,args:a.args||{},back:a.back||null}:{view:'home',root:true,back:a&&a.back||null});   // no view: the Hub's home

/* ---------- small building blocks ---------- */
const PLATES={path:'env-runway',games:'env-night',library:'env-lounge2',explorer:'env-terminal',record:'env-hangar2',achievements:'env-tower',airfield:'env-runway',practice:'env-classroom2',radio:'env-tower',fleet:'env-hangar2',crew:'env-lounge2'};
const DISC={path:'path',games:null,book:null,compass:'map',record:null,trophy:'achievements',pin:'tower',cards:'class',headset:'tower',plane:'hangar',users:'crewboard',gear:'settings'};
const disc=icon=>{ const n=DISC[icon], e=n&&G.ART&&G.ART.entry&&G.ART.entry('icon:'+n); return e?h('span',{class:'ti art'},h('img',{src:e.src,alt:'',width:'48',height:'48'})):h('span',{class:'ti'},UI.icon(icon)); };
const tile=(icon,label,sub,on,plate)=>{ const t=h('button',{class:'tile'+(plate?' img':''),type:'button',onclick:on},disc(icon),h('b',{text:label}),sub?h('span',{text:sub}):null);
 if(plate) t.style.backgroundImage='linear-gradient(180deg, rgba(10,24,40,.18) 0%, rgba(10,24,40,.55) 45%, rgba(10,24,40,.93) 100%), url("assets/art/'+plate+'.webp")'; return t; };
const item=(icon,title,sub,end,on,o)=>{ o=o||{}; const b=h(on?'button':'div',{class:'item',type:on?'button':null,onclick:on||null,'aria-disabled':o.disabled?'true':null},
  icon?h('span',{class:(icon.classList&&(icon.classList.contains('spine')||icon.classList.contains('badgeart')))?'lead':'badge-ic'},typeof icon==='string'?UI.icon(icon):icon):null, h('span',{class:'grow'},h('b',{text:title}),sub?h('small',{text:sub}):null), end?h('span',{class:'end',text:end}):null, on?UI.icon('right'):null); return b; };
UI.tile=tile; UI.item=item;
const launch=(id,back)=>{ sfx('ok'); const cur=UI.scroller(); if(cur) UI.stack(); return R.launch(id,back||'hub'); };
UI.launch=launch;
const tierDot=t=>h('span',{class:'tier'+(t?' t'+t:''),'aria-hidden':'true'});
const tierName=t=>['Not started','Bronze','Silver','Gold'][t]||'';
function heroCard(){
 const rk=H.rank(G.save.points), next=rk.next, pct=next?Math.round(100*(G.save.points-rk.min)/(next-rk.min)):100;
 const logo=h('img',{src:(G.CFG.assets.find(a=>a.name==='logo')||{}).src||'',alt:'',width:'120',height:'96'});
 const sec=h('section',{class:'hero','aria-label':'Your cadet'},logo,h('div',{style:{flex:'1',minWidth:'0'}},
  h('div',{class:'brand'},h('small',{text:'HypeTeen'}),'Flight Academy'),
  h('p',{class:'muted',style:{margin:'8px 0 6px'}},h('b',{style:{color:'var(--cream)'},text:G.who()}),' • Phase '+(rk.phase+1)+': '+T(rk.phaseN)+' • Step '+rk.stepN),
  h('div',{class:'meter',role:'progressbar','aria-valuemin':'0','aria-valuemax':'100','aria-valuenow':String(pct),'aria-label':'XP to the next step'},h('i',{style:{width:pct+'%'}})),
  h('p',{class:'small muted',style:{margin:'6px 0 0'},text:G.save.points+' XP'+(next?' • '+(next-G.save.points)+' XP to '+T(rk.nextN):' • the top step')})));
 const plate=G.ART&&G.ART.entry&&(G.ART.entry('screen:hero')||G.ART.entry('screen:title')); if(plate){ sec.classList.add('plate'); sec.style.backgroundImage='linear-gradient(90deg, rgba(16,38,61,.97) 0%, rgba(16,38,61,.9) 50%, rgba(16,38,61,.35) 100%), url("'+plate.src+'")'; }
 return sec;
}
function nextLesson(){ const u=H.nextUnit(); if(!u) return null; const ui=H.units.indexOf(u); const n=H.unitNodes(u,ui).find(x=>x.k==='lesson'&&x.open&&!x.done)||H.unitNodes(u,ui).find(x=>x.k==='check'&&x.open&&!x.done); return n?{u,n}:{u,n:null}; }
UI.nextLesson=nextLesson;

/* ============================ HOME ============================ */
UI.define('home',{ back:false, title:'Academy Hub', sub:()=>G.who(), music:null,
 actions:()=>[{icon:'search',label:'Search everything',onClick:()=>UI.show('search',{q:''})},{icon:'gear',label:'Settings',onClick:()=>UI.show('settings')}],
 render(){
  const M=h('main',{});
  M.appendChild(heroCard());
  if(H.renameNotice&&G.save.mod.migratedAt&&!G.save.mod.renameSeen){ H.renameNotice(); M.appendChild(h('div',{class:'note',role:'note',style:{marginTop:'12px'}},'HypeTeen Flight Quarters is now ',h('b',{text:'HypeTeen Flight Academy'}),'. Every lesson, badge, flight and setting came with you.')); }
  const tut=(G.save.mod.tut||{});
  if(!tut.done) M.appendChild(h('section',{class:'card hi',style:{marginTop:'14px'}},h('span',{class:'eyebrow',text:'Your first briefing'}),h('h3',{style:{marginTop:'6px'},text:'A two-minute tour of the Academy Hub'}),h('p',{class:'muted small',text:'Where everything is, and how the Hub and the airfield fit together. Finishing it earns FIRST BRIEFING (+20 XP), the same as the tour on the airfield.'}),h('div',{class:'row'},h('button',{class:'btn primary',type:'button',onclick:()=>UI.show('briefing',{i:0})},'Start the briefing'),h('button',{class:'btn ghost',type:'button',onclick:()=>{ H.tut.finish(true); UI.refresh(); }},'Skip'))));
  // continue
  const nx=nextLesson(), C=h('div',{class:'continue',style:{marginTop:'14px'}});
  if(nx&&nx.n){ const L=nx.n.k==='lesson'?(H.lessons[nx.u.id]||[])[nx.n.i]:null;
   C.appendChild(h('section',{class:'card hi'},h('span',{class:'eyebrow',text:'Up next on your Flight Path'}),h('h3',{style:{margin:'6px 0 2px',fontSize:'1.2em'},text:L?L.t:'Checkride: '+T(nx.u.t)}),h('p',{class:'muted small',text:T(nx.u.t)+(L?' • Lesson '+(nx.n.i+1)+' of '+(H.lessons[nx.u.id]||[]).length:' • the unit patch')}),
    h('div',{class:'row'},h('button',{class:'btn primary',type:'button',onclick:()=>launch(L?'lesson:'+L.id:'check:'+nx.u.id)},UI.icon('plane'),L?'Fly the lesson':'Take the checkride'),h('button',{class:'btn',type:'button',onclick:()=>UI.show('unit',{unit:nx.u.id})},'Unit details')))); }
  else C.appendChild(h('section',{class:'card hi'},h('span',{class:'eyebrow',text:'Flight Path'}),h('h3',{style:{marginTop:'6px'},text:'Every open unit is at SILVER or better.'}),h('p',{class:'muted small',text:'Go for GOLD with drills and book quizzes, or explore BEYOND.'}),h('button',{class:'btn primary',type:'button',onclick:()=>UI.show('pathlist')},'Open the Flight Path')));
  const d=H.today(), miss=H.totals().missed;
  C.appendChild(h('section',{class:'card'},h('span',{class:'eyebrow',text:'Today'}),h('div',{class:'stats',style:{marginTop:'8px'}},
   h('div',{class:'stat'},h('b',{text:String(H.streak())}),h('span',{text:'Flight days'})),h('div',{class:'stat'},h('b',{text:Math.min(2,d.n)+' / 2'}),h('span',{text:'Today’s plan'})),h('div',{class:'stat'},h('b',{text:String(miss)}),h('span',{text:'To practice'}))),
   miss?h('button',{class:'btn block',type:'button',style:{marginTop:'10px'},onclick:()=>launch('review')},UI.icon('chat'),'Hangar Flying: clear '+UI.plural(miss,'missed question')):null));
  M.appendChild(C);
  // search
  const q=h('input',{type:'search',placeholder:'Search lessons, games, books, places…','aria-label':'Search the academy',enterkeyhint:'search',onkeydown:e=>{ if(e.key==='Enter'){ e.preventDefault(); UI.show('search',{q:q.value}); } }});
  M.appendChild(h('form',{role:'search',onsubmit:e=>{ e.preventDefault(); UI.show('search',{q:q.value}); },style:{marginTop:'16px'}},h('div',{class:'search'},UI.icon('search'),q)));
  // sections
  M.appendChild(h('h2',{text:'The academy'}));
  const V=H.verified(), lib=H.lib.totals(), games=(H.GAMES||[]).filter(g=>g.built), played=games.filter(g=>H.gameRec&&H.gameRec(g.id)&&H.gameRec(g.id).plays).length, T2=H.totals();
  const vis=Object.keys((G.save.mod.world||{}).visited||{}).length;
  M.appendChild(h('div',{class:'grid tiles'},
   tile('path','Flight Path',T2.done+' of '+T2.lessons+' lessons • '+T2.patches+' patches',()=>UI.show('pathlist'),PLATES.path),
   tile('games','Games',played+' of '+games.length+' played',()=>UI.show('games'),PLATES.games),
   tile('book','Library',lib.read+' of '+lib.books+' read • the book series',()=>UI.go('library',{back:'hub'}),PLATES.library),
   tile('compass','Explorer','Real aviation places to visit',()=>UI.go('explorer',{back:'hub'}),PLATES.explorer),
   tile('record','Flight Record','What you learned, and what you did',()=>UI.go('record',{back:'hub'}),PLATES.record),
   tile('trophy','Achievements',V.badges.length+' of '+(G.CFG.badges||[]).length+' badges',()=>UI.show('achievements'),PLATES.achievements),
   tile('pin','The Airfield',vis+' of '+Object.keys(G.WORLD.rooms).length+' places • the crew',()=>UI.show('airfield'),PLATES.airfield),
   tile('cards','Practice Hub','Flashcards, trivia, drills',()=>UI.go('practice',{back:'hub'}),PLATES.practice),
   tile('headset','Call the Tower','Weather and the radio',()=>launch('radio'),PLATES.radio),
   tile('plane','My Hangar','Your aircraft',()=>launch('fleet'),PLATES.fleet),
   tile('users','Crew Board','Kudos and cadets',()=>launch('crewboard'),PLATES.crew),
   tile('gear','Settings','Mode, text size, backup',()=>UI.show('settings'))));
  M.appendChild(h('h2',{text:'Prefer to walk?'}));
  M.appendChild(h('div',{class:'card flat'},h('p',{class:'muted',text:'The academy is also a walkable airfield with a thumb-stick. Both ways reach the same lessons, scores and badges, and you can switch back any time in Settings.'}),
   h('button',{class:'btn',type:'button',onclick:async()=>{ if(await UI.confirm('Walk the airfield?',['Your progress stays exactly as it is. Settings > Academy Hub mode brings the Hub back.'],'Walk the airfield')){ H.setMode('airfield'); G.go('world',{}); } }},UI.icon('walk'),'Switch to the walkable airfield')));
  M.appendChild(h('p',{class:'tiny muted',style:{marginTop:'24px',textAlign:'center'},text:H.VERSION.name+' '+H.VERSION.version+' • Everything stays on this device'}));
  return M; }
});

/* ============================ SEARCH ============================ */
const KIND_LABEL={unit:'Unit',lesson:'Lesson',test:'Test out',drill:'Drill',check:'Checkride',flash:'Flashcards',practice:'Practice',book:'Book',series:'Book series',game:'Game',place:'Place',crew:'Crew',tool:'Tool',dest:'Explorer'};
UI.define('search',{ title:'Search', sub:a=>a.q?'“'+a.q+'”':'Everything in the academy',
 render(a){ const M=h('main',{}); let cat=a.cat||'';
  const q=h('input',{type:'search',value:a.q||'',placeholder:'Try “stall”, “METAR”, “museum” or “radio”','aria-label':'Search',autofocus:true});
  const out=h('div',{class:'list','aria-live':'polite'}), count=h('p',{class:'count'});
  const cats=['','Ground School','Practice','Library','Games','The Airfield','Explorer','Tools'];
  const F=h('div',{class:'filters scroll',role:'group','aria-label':'Show'});
  const draw=()=>{ a.q=q.value; a.cat=cat; UI.clear(out); const res=R.search(q.value,{cat:cat||null}).slice(0,80);
   count.textContent=q.value?(res.length?UI.plural(res.length,'result')+(res.length===80?' (first 80)':''):'Nothing found. Try a shorter word.'):'Type to search '+R.list().length+' activities.';
   if(!q.value&&!cat) return;
   res.forEach(x=>{ const st=x.status(), av=x.avail(); out.appendChild(item(x.icon&&UI.hasIcon(x.icon)?x.icon:'star',x.title,(KIND_LABEL[x.kind]||x.kind)+' • '+(x.sub||''),av.ok?st.label:'LOCKED',()=>{ if(x.kind==='unit') UI.show('unit',{unit:x.unit}); else if(x.kind==='place') UI.show('place',{room:x.place}); else if(x.kind==='dest') UI.go('explorer',{back:'hub',dest:x.dest}); else if(x.kind==='series') UI.go('library',{back:'hub',series:x.n}); else if(!av.ok){ UI.toast(av.why); } else launch(x.id); },{disabled:!av.ok})); }); };
  cats.forEach(c=>{ const b=h('button',{type:'button',class:'chip','aria-pressed':String(c===cat),onclick:()=>{ cat=c; [...F.children].forEach(x=>x.setAttribute('aria-pressed',String(x===b))); draw(); }},c||'All'); F.appendChild(b); });
  q.addEventListener('input',draw);
  M.appendChild(h('div',{class:'search'},UI.icon('search'),q)); M.appendChild(F); M.appendChild(count); M.appendChild(out); draw();
  return M; }
});

/* ============================ THE FLIGHT PATH (list form) ============================ */
UI.define('pathlist',{ title:'Flight Path', sub:()=>{ const t=H.totals(); return t.done+' / '+t.lessons+' lessons • '+UI.plural(t.patches,'patch','patches'); },
 actions:()=>[{icon:'map',label:'Open the drawn Flight Path',text:'Drawn path',onClick:()=>UI.go('path',{back:'hub'})}],
 render(){ const M=h('main',{});
  M.appendChild(h('p',{class:'lede',text:'The whole course in order. Each unit: lessons (or TEST OUT), a book, a practice game, a timed drill and the checkride. BRONZE when the lessons are done, SILVER with the checkride patch, GOLD with a perfect drill and the unit’s book quizzes.'}));
  for(const sg of H.stages||[]){ const us=H.units.filter(u=>u.stage===sg.id&&H.lessons[u.id]); if(!us.length) continue; const p=H.stageProg(sg.id);
   M.appendChild(h('h2',{text:T(sg.t)}));
   M.appendChild(h('p',{class:'muted small',text:T(sg.s)+' • '+p.patches+' of '+p.units+' patches'+(sg.note?' • '+sg.note.toLowerCase():'')}));
   const L=h('div',{class:'list'});
   us.forEach(u=>{ const t=H.tier(u.id), P=H.unitProg(u.id), open=H.unitOpen(u.id);
    L.appendChild(item(tierDot(t.t),T(u.t),T(u.s)+' • '+P.done+'\u00a0of\u00a0'+P.total+'\u00a0lessons',open?tierName(t.t).toUpperCase():'LOCKED',()=>UI.show('unit',{unit:u.id}),{})); });
   M.appendChild(L); }
  return M; }
});
const NODE_ICON={test:'right',lesson:'plane',read:'book',play:'games',drill:'clock',check:'medal'};
UI.define('unit',{ title:a=>{ const u=H.units.find(x=>x.id===a.unit); return u?T(u.t):'Unit'; }, sub:a=>{ const u=H.units.find(x=>x.id===a.unit); return u?T(u.s):''; },
 render(a){ const u=H.units.find(x=>x.id===a.unit), ui=H.units.indexOf(u), M=h('main',{}); if(!u) return h('p',{text:'Unit not found.'});
  if(H.unitOpen(u.id)&&G.scenes.groundschool&&G.scenes.groundschool.seen) G.scenes.groundschool.seen(u);   // opening a unit, same as on the airfield
  const t=H.tier(u.id), P=H.unitProg(u.id), act=R.get('unit:'+u.id);
  M.appendChild(h('section',{class:'card hi'},h('div',{class:'row'},tierDot(t.t),h('b',{text:tierName(t.t)}),t.tested?h('span',{class:'chip info',text:'Tested out'}):null),
   h('p',{style:{marginTop:'8px'},text:act?act.objective:''}),h('div',{class:'meter','aria-hidden':'true'},h('i',{style:{width:Math.round(100*P.done/Math.max(1,P.total))+'%'}})),h('p',{class:'small muted',style:{marginTop:'6px'},text:P.done+' of '+P.total+' lessons • '+P.stars+' of '+P.max+' stars'+(P.patch?' • patch earned':'')})));
  if(!H.unitOpen(u.id)) M.appendChild(h('div',{class:'note warn',style:{marginTop:'12px'},text:'This unit opens when the unit before it reaches BRONZE.'}));
  M.appendChild(h('h2',{text:'Your steps'}));
  const L=h('div',{class:'list'});
  for(const n of H.unitNodes(u,ui)){
   const id=n.k==='lesson'?'lesson:'+n.l.id:(n.k==='read'?'book:'+n.id:(n.k==='play'?'game:'+n.id:n.k+':'+u.id));
   const label=n.k==='lesson'?'Lesson '+(n.i+1)+': '+n.sub:(n.k==='read'?'Read: '+T((H.bookById(n.id)||{}).t||''):(n.k==='play'?'Practice: '+T((H.gameById(n.id)||{}).name||''):T(n.label)));
   const bk=n.k==='read'&&H.bookById(n.id), gm=n.k==='play'&&H.gameById(n.id);
   const sub=bk?bk.sub+' • '+(bk.min||Math.max(3,Math.round(bk.sec.length*.8)))+' min, then its quiz':(gm?gm.desc:(n.k==='test'?'Already know it? '+H.TESTOUT_N+' questions; '+Math.round(H.TESTOUT_PASS*100)+'% skips the lessons.':n.sub));
   const end=n.done?(n.k==='lesson'&&n.rec?(n.rec.tested?'TESTED OUT':n.rec.stars+' ★'):'DONE'):(n.open?(n.k==='test'?H.testOutLeft(u.id)+' TRIES TODAY':'GO'):'LOCKED');
   L.appendChild(item(NODE_ICON[n.k]||'star',label,n.k==='lesson'?'':sub,end,n.open?()=>{ if(n.k==='read'){ UI.go('book',{id:n.id,back:'hub'}); return; } if(n.k==='play'){ launch('game:'+n.id); return; } sfx('ok'); H.openNode(n,u,{scene:'hub',args:{}},'hub'); }:null,{disabled:!n.open}));
  }
  M.appendChild(L);
  const fl=R.get('flash:'+u.id); if(fl) M.appendChild(h('div',{class:'row',style:{marginTop:'14px'}},h('button',{class:'btn',type:'button',onclick:()=>launch('flash:'+u.id)},UI.icon('cards'),'Flashcards')));
  return M; }
});

/* ============================ GAMES: the directory ============================ */
const DIFF=['','Easy','Medium','Hard'];
UI.define('games',{ title:'Games', sub:()=>{ const g=(H.GAMES||[]).filter(x=>x.built); return g.length+' games'; },
 render(a){ const M=h('main',{}); let f=a.f||'all';
  M.appendChild(h('p',{class:'lede',text:'Every game in the academy, in one place. Learning games practice a Ground School unit; the Game Room ones are just for fun. Game XP tops out at 40 a day, so lessons always earn the most.'}));
  const q=h('input',{type:'search',value:a.q||'',placeholder:'Find a game','aria-label':'Find a game'});
  const F=h('div',{class:'filters scroll',role:'group','aria-label':'Filter games'}), out=h('div',{class:'grid wide'}), count=h('p',{class:'count','aria-live':'polite'});
  const opts=[['all','All'],['learn','Learning'],['fun','Just for fun'],['new','Not played yet']];
  const draw=()=>{ a.q=q.value; a.f=f; UI.clear(out); let L=R.search(q.value,{kind:'game'});
   if(f==='learn') L=L.filter(x=>!x.fun); if(f==='fun') L=L.filter(x=>x.fun); if(f==='new') L=L.filter(x=>!x.status().plays);
   count.textContent=UI.plural(L.length,'game');
   L.forEach(x=>{ const st=x.status(), u=x.unit&&H.units.find(z=>z.id===x.unit);
    out.appendChild(h('article',{class:'card'},h('div',{class:'spread'},h('h3',{text:x.title}),h('span',{class:'chip'+(st.plays?' good':''),text:st.label})),
     h('p',{class:'small muted',style:{margin:'2px 0 6px'},text:x.sub}),
     h('p',{class:'small',style:{margin:'0 0 10px'}},h('span',{class:'chip info',style:{marginRight:'8px'},text:u?'Practices: '+T(u.t):'Just for fun'}),'About '+x.est+' min • '+DIFF[x.diff]+(x.where?' • '+T(x.where):'')),
     h('button',{class:'btn primary',type:'button',onclick:()=>launch(x.id)},UI.icon('games'),'Play'))); }); };
  opts.forEach(([k,l])=>{ const b=h('button',{type:'button',class:'chip','aria-pressed':String(k===f),onclick:()=>{ f=k; [...F.children].forEach(c=>c.setAttribute('aria-pressed',String(c===b))); draw(); }},l); F.appendChild(b); });
  q.addEventListener('input',draw);
  M.appendChild(h('div',{class:'search'},UI.icon('search'),q)); M.appendChild(F); M.appendChild(count); M.appendChild(out); draw();
  return M; }
});

/* ============================ THE AIRFIELD: places and crew ============================ */
H.visitPlace=function(k){ const W=G.WORLD; if(!W.rooms[k]) return false; const save=G.save.mod.world=G.save.mod.world||{}; const v=(save.visited=save.visited||{}), first=!v[k]; v[k]=Date.now(); G.persist(); if(W.onRoom) W.onRoom(k,first); return first; };
H.meetCrew=function(k,id,done){ const W=G.WORLD, R0=W.rooms[k], n=R0&&(R0.npcs||[]).find(q=>q.id===id); if(!n) return;
 const met=(G.save.mod.world.met=G.save.mod.world.met||{}), first=!met[id]; met[id]=(met[id]||0)+1; G.persist();
 let lines=first&&n.first?n.first:(n.lines||['Hi there!']); if(!first&&n.lines&&n.lines.length>1&&!n.inOrder){ const i=(met[id]-2)%n.lines.length; lines=[n.lines[i]]; }
 lines=lines.map(l=>typeof l==='function'?l():l);
 UI.dialog({title:T(n.name)+(n.role?' • '+T(n.role):''),body:h('div',{},lines.map(l=>h('p',{text:l}))),actions:[{label:'Thanks!',kind:'primary'}],onClose:()=>{ if(W.onTalk) W.onTalk(n,first); if(done) done(); }});
 sfx('blip'); };
H.useStation=function(k,key){ const W=G.WORLD, R0=W.rooms[k], s=R0&&(R0.stations||[]).find(q=>q.key===key); if(!s||!s.go) return false; const g=s.go;
 if(W.onOpen&&W.onOpen(s)===false) return false; sfx('ok');
 if(g.room){ UI.show('place',{room:g.room}); return true; }
 if(g.talk){ H.meetCrew(k,g.talk,()=>UI.refresh()); return true; }
 if(g.page){ UI.go('page',{id:g.page,back:'hub'}); return true; }
 if(g.scene){ UI.go(g.scene,Object.assign({back:'hub',card:s.key,station:s},g.args||{})); return true; }
 if(g.toast){ G.toast(g.toast,G.C.warn); return true; }
 if(g.fn){ g.fn(s); UI.refresh(); return true; }
 return false; };
UI.define('airfield',{ title:'The Airfield', sub:()=>{ const v=Object.keys((G.save.mod.world||{}).visited||{}).length; return v+' of '+Object.keys(G.WORLD.rooms).length+' places visited'; },
 render(){ const M=h('main',{}), W=G.WORLD;
  M.appendChild(h('p',{class:'lede',text:'Nine places around the academy’s field. Open a place to see what is there, use its stations and meet its crew. A first visit is worth the same XP as walking in.'}));
  const L=h('div',{class:'grid wide'});
  for(const k in W.rooms){ const r=W.rooms[k], mp=(H.mapPlaces||[]).find(p=>p.room===k), v=((G.save.mod.world||{}).visited||{})[k];
   L.appendChild(h('button',{class:'card',type:'button',onclick:()=>UI.show('place',{room:k})},h('div',{class:'spread'},h('h3',{text:T(r.name)}),h('span',{class:'chip'+(v?' good':''),text:v?'Visited':'New'})),h('p',{class:'small muted',text:mp?mp.blurb:''}),h('p',{class:'small',style:{margin:0},text:UI.plural((r.stations||[]).length,'station')+' • '+UI.plural((r.npcs||[]).length,'crew member')}))); }
  M.appendChild(L);
  M.appendChild(h('div',{class:'row',style:{marginTop:'16px'}},h('button',{class:'btn',type:'button',onclick:()=>UI.go('map',{back:'hub'})},UI.icon('map'),'The drawn airfield map')));
  return M; }
});
UI.define('place',{ title:a=>{ const r=G.WORLD.rooms[a.room]; return r?T(r.name):'Place'; }, sub:()=>'The Airfield',
 render(a){ const W=G.WORLD, r=W.rooms[a.room], M=h('main',{}); if(!r) return h('p',{text:'Place not found.'});
  const first=H.visitPlace(a.room); if(first) UI.toast('New place: +'+H.xp.place+' XP');
  if(a.talk){ const t=a.talk; a.talk=null; setTimeout(()=>H.meetCrew(a.room,t,()=>UI.refresh()),60); }
  const mp=(H.mapPlaces||[]).find(p=>p.room===a.room);
  if(mp) M.appendChild(h('p',{class:'lede',text:mp.blurb}));
  if((r.npcs||[]).length){ M.appendChild(h('h2',{text:'Crew'})); const L=h('div',{class:'list'}); for(const n of r.npcs){ const met=((G.save.mod.world||{}).met||{})[n.id]; L.appendChild(item('user',T(n.name),T(n.role||''),met?'TALK AGAIN':'MEET',()=>H.meetCrew(a.room,n.id,()=>UI.refresh()))); } M.appendChild(L); }
  M.appendChild(h('h2',{text:'Stations'}));
  const L=h('div',{class:'list'});
  for(const s of r.stations||[]){ if(!s.go) continue; const g=s.go; const door=!!g.room;
   L.appendChild(item(door?'right':(g.scene&&g.scene.indexOf('g_')===0?'games':(g.talk?'user':'star')),T(s.label||s.key),door?'Door to '+T((W.rooms[g.room]||{}).name||g.room):(g.scene&&g.scene.indexOf('g_')===0?(((H.gameById(g.scene.slice(2))||{}).desc)||''):''),door?'GO':'OPEN',()=>H.useStation(a.room,s.key))); }
  M.appendChild(L);
  return M; }
});

/* ============================ ACHIEVEMENTS ============================ */
UI.define('achievements',{ title:'Achievements', sub:()=>{ const B=G.CFG.badges||[]; return B.filter(b=>G.save.ach[b.id]).length+' of '+B.length+' badges'; },
 render(){ const M=h('main',{}), rk=H.rank(G.save.points);
  M.appendChild(h('h2',{text:'Academy phases'}));
  M.appendChild(h('p',{class:'muted small',text:'The seven phases are named for the seven HypeTeen Flight Academy books. They are academy stages, not real pilot certificates.'}));
  const P=h('div',{class:'list'});
  H.phases.forEach((p,i)=>{ const here=rk.phase===i, done=rk.phase>i; P.appendChild(item(h('span',{text:String(i+1),style:{font:'700 16px var(--font-ui)'}}),T(p.n),'From '+p.xp+' XP • Book '+p.book,here?'STEP '+rk.stepN:(done?'DONE':''),null)); });
  M.appendChild(P);
  M.appendChild(h('h2',{text:'Badges'}));
  const earned=(G.CFG.badges||[]).filter(b=>G.save.ach[b.id]), todo=(G.CFG.badges||[]).filter(b=>!G.save.ach[b.id]);
  const art=(b,dim)=>{ const src=H.badgeSrc&&H.badgeSrc(b.id); return src?h('img',{class:'badgeart'+(dim?' dim':''),src,alt:'',width:'44',height:'44'}):UI.icon(dim?'lock':'medal'); };
  M.appendChild(earned.length?h('div',{class:'list'},earned.map(b=>item(art(b),T(b.n),b.d?UI.title(b.d):'',UI.date(G.save.ach[b.id]),null))):h('div',{class:'empty',text:'Your first badge is one lesson away.'}));
  if(todo.length){ M.appendChild(h('h3',{style:{margin:'18px 0 8px',fontSize:'.86em',letterSpacing:'.1em',textTransform:'uppercase',color:'var(--dim)'},text:'Still to earn • '+todo.length})); M.appendChild(h('div',{class:'list'},todo.map(b=>{ const r=item(art(b,true),T(b.n),b.d?UI.title(b.d):'','',null); r.style.opacity='.8'; return r; }))); }
  /* r7.4: the reward history: every badge, patch, phase, step and new aircraft, newest first (the notices are brief; this keeps them) */
  const hist=H.noteHistory?H.noteHistory():[];
  M.appendChild(h('h2',{text:'Recent rewards'}));
  M.appendChild(hist.length?h('div',{class:'list'},hist.slice(0,24).map(n=>item(n.kind==='badge'?(n.id&&H.badgeSrc&&H.badgeSrc(n.id)?h('img',{class:'badgeart',src:H.badgeSrc(n.id),alt:'',width:'44',height:'44'}):'medal'):({phase:'book',step:'star',aircraft:'plane',patch:'medal'}[n.kind]||'star'),UI.title(n.msg.replace(/^(BADGE|NEW PHASE|STEP UP|NEW AIRCRAFT|PATCH): /,'')),{badge:'Badge',phase:'New academy phase',step:'Step up',aircraft:'New aircraft',patch:'Unit patch'}[n.kind]||'',UI.date(n.at),null))):h('div',{class:'empty',text:'Your rewards will be listed here as you earn them.'}));
  M.appendChild(h('h2',{text:'Unit patches'}));
  const done=(G.save.mod.gs||{}).done||{}; const got=H.units.filter(u=>done[u.id]);
  M.appendChild(got.length?h('div',{class:'list'},got.map(u=>item('medal',T(u.t),'Checkride passed',H.tier(u.id).name,()=>UI.show('unit',{unit:u.id})))):h('div',{class:'empty',text:'Pass a unit’s checkride to earn its patch.'}));
  return M; }
});

/* ============================ SETTINGS ============================ */
UI.define('settings',{ title:'Settings', sub:()=>G.who(),
 render(){ const M=h('main',{}), s=G.save.settings;
  const seg=(label,opts,val,on)=>{ const g=h('div',{class:'seg',role:'group','aria-label':label}); opts.forEach(([v,l])=>{ const b=h('button',{type:'button','aria-pressed':String(v===val),onclick:()=>{ on(v); [...g.children].forEach(c=>c.setAttribute('aria-pressed',String(c===b))); sfx('ok'); }},l); g.appendChild(b); }); return g; };
  const sw=(label,on,set,hint)=>{ const id='sw-'+label.replace(/\W+/g,'').toLowerCase(); const c=h('input',{type:'checkbox',id,checked:!!on,onchange:()=>{ set(c.checked); sfx('ok'); },style:{width:'22px',height:'22px',accentColor:'#D9B25E'}}); return h('div',{class:'item',style:{cursor:'default'}},h('label',{for:id,class:'grow',style:{cursor:'pointer'}},h('b',{text:label}),hint?h('small',{text:hint}):null),c); };
  M.appendChild(h('h2',{text:'How you get around'}));
  const modeSeg=seg('Interface',[['airfield','Walkable airfield'],['hub','Academy Hub']],H.mode(),v=>{ H.setMode(v); }); modeSeg.classList.add('full');
  M.appendChild(h('div',{class:'card flat'},modeSeg,h('p',{class:'small muted',style:{marginTop:'10px'},text:'Both reach the same lessons, scores, badges and records. The Hub is quicker to move around and works with screen readers; the airfield is the walkable world. Changing it never changes your progress.'}),
   h('button',{class:'btn primary',type:'button',style:{marginTop:'6px'},onclick:()=>{ G.go(G.homeScene(),{}); }},'Go to '+'my home screen')));
  /* r7.4: controls. The thumb-stick follows the input actually used (touch shows it; a mouse or the keyboard hides it), or can be pinned */
  M.appendChild(h('h2',{text:'Controls'}));
  const IN=H.input; M.appendChild(h('div',{class:'card flat stack'},h('div',{},h('b',{text:'On-screen thumb-stick'}),h('div',{style:{marginTop:'8px'}},seg('On-screen thumb-stick',[['auto','Automatic'],['on','Always show'],['off','Never show']],IN?IN.pref():'auto',v=>{ if(IN) IN.setPref(v); })),
    h('p',{class:'small muted',style:{margin:'8px 0 0'},text:'Automatic shows the stick when you touch the screen and hides it when you use a mouse or a keyboard. Dragging on the floor always steers, and the USE button is always there.'})),
   h('div',{},h('b',{text:'Keyboard'}),h('ul',{class:'plain',style:{marginTop:'8px'}},h('li',{text:'W A S D or the arrow keys: walk'}),h('li',{text:'E, Enter or Space: use what you are next to, or talk to someone'}),h('li',{text:'Esc: close a conversation, go back, or pause a game'}),h('li',{text:'Tab and Enter work on every screen like this one'})))));
  M.appendChild(h('h2',{text:'Reading and motion'}));
  M.appendChild(h('div',{class:'card flat stack'},h('div',{},h('b',{text:'Text size'}),h('div',{style:{marginTop:'8px'}},seg('Text size',[[0,'Standard'],[1,'Large'],[2,'Larger'],[3,'Largest']],UI.prefs().text||0,v=>UI.setPref('text',v))),h('p',{class:'small muted',style:{margin:'8px 0 0'},text:'For the Hub, the Library, the Explorer and the Flight Record. Books have their own text size in the reader.'})),
   sw('Reduced motion',s.rm,v=>{ s.rm=v; G.persist(); UI.applyPrefs(); },'Less animation everywhere. New profiles start from your device’s setting.')));
  M.appendChild(h('h2',{text:'Sound'}));
  M.appendChild(h('div',{class:'list'},sw('Music',s.music,v=>{ s.music=v; AUDIO.setMusic(v); if(v) AUDIO.play(AUDIO.menuMusic()); G.persist(); }),sw('Sound effects',s.sfx,v=>{ s.sfx=v; AUDIO.setSfx(v); G.persist(); }),sw('Tower voice',G.setting('voice'),v=>{ s.voice=v; G.persist(); },'The tower speaks with this device’s own voice. Nothing is sent anywhere.')));
  M.appendChild(h('h2',{text:'Your records'}));
  M.appendChild(h('div',{class:'list'},item('download','Backup and restore','Save a backup file, restore one, or go back to a restore point','',()=>UI.go('backup',{back:'hub'})),item('record','Flight Record','Verified learning and your own experiences','',()=>UI.go('record',{back:'hub'}))));
  M.appendChild(h('h2',{text:'About and privacy'}));
  M.appendChild(h('div',{class:'list'},item('shield','Terms of Use and privacy','Read the Terms your Family Lead accepted','',()=>UI.go('termsRead',{back:'hub'})),item('info','About the academy','How it works, for families','',()=>UI.go('page',{id:'about',back:'hub'}))));
  M.appendChild(h('div',{class:'note',style:{marginTop:'14px'}},'About PINs: a 4-digit PIN keeps family members out of each other’s profiles on this device. It is not a security lock. Everything is stored on this device only.'));
  M.appendChild(h('div',{class:'row',style:{marginTop:'16px'}},h('button',{class:'btn',type:'button',onclick:()=>UI.go('settings',{back:'hub'})},UI.icon('gear'),'Account settings (PIN reset, sign out)')));
  return M; }
});

/* ============================ THE FIRST BRIEFING (Hub version) ============================ */
const BRIEF=[
 ['hub','Welcome to the Academy Hub','Everything in the academy, one tap away. The big card on the home screen is always your next lesson.'],
 ['path','The Flight Path','Your whole course, unit by unit: lessons, a book, a practice game, a drill and the checkride. BRONZE, SILVER, GOLD.'],
 ['games','Games and the Library',()=>((H.GAMES||[]).filter(g=>g.built).length)+' games and every book have their own sections. Search finds anything: try “METAR” or “stall”.'],
 ['compass','The Explorer and your Flight Record','Real museums, airfields and memorials across North America, and a record of what you learned and what you did.'],
 ['walk','The airfield is still there','Prefer to walk? Settings switches to the walkable airfield, and everything comes with you.']];
UI.define('briefing',{ title:'Your first briefing', sub:a=>'Step '+(a.i+1)+' of '+BRIEF.length,
 render(a){ const i=Math.max(0,Math.min(BRIEF.length-1,a.i|0)), b=BRIEF[i], M=h('main',{});
  M.appendChild(h('section',{class:'card hi',style:{maxWidth:'640px',margin:'10px auto'}},h('div',{class:'tile',style:{minHeight:'0',padding:'0',border:'0',background:'none',boxShadow:'none'}},h('span',{class:'ti'},UI.icon(b[0]))),
   h('h3',{style:{fontSize:'1.35em',marginTop:'10px'},text:b[1]}),h('p',{class:'lede',text:typeof b[2]==='function'?b[2]():b[2]}),
   h('div',{class:'meter','aria-hidden':'true',style:{margin:'14px 0'}},h('i',{style:{width:Math.round(100*(i+1)/BRIEF.length)+'%'}})),
   h('div',{class:'row'},i>0?h('button',{class:'btn',type:'button',onclick:()=>UI.replace('briefing',{i:i-1})},'Back'):null,
    h('button',{class:'btn primary',type:'button',onclick:()=>{ if(i<BRIEF.length-1){ UI.replace('briefing',{i:i+1}); sfx('chime2'); } else { H.tut.finish(false); UI.back(); } }},i<BRIEF.length-1?'Next':'Finish the briefing'),
    h('button',{class:'btn ghost',type:'button',onclick:()=>{ H.tut.finish(true); UI.back(); }},'Skip'))));
  return M; }
});
/* the Flight Bag's TUTORIAL card and the replay: in Hub mode they open this briefing */
const tutEnter=G.scenes.tutorial.enter; G.scenes.tutorial.enter=function(a){ if(H.isHub()){ G.go('hub',{view:'briefing',args:{i:0}},true); return; } return tutEnter.call(this,a); };
})();
