/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* THE ACTIVITY REGISTRY (r7, Gate 3): one canonical list of everything a cadet can do, with a stable id, and ONE launch
   function per activity. The walkable airfield, the Flight Path, the Flight Bag and the Academy Hub all end up calling the
   same scenes and functions, so results are identical whichever way a cadet arrives.
   An activity: {id, kind, title, sub, cat, unit?, stage?, place? (airfield room), objective, prereq, assess, est (minutes),
                 diff (1-3), icon, words (search terms), avail() -> {ok, why}, status() -> {done, label}, launch(back) -> bool}
   Ids are stable across releases: lesson:<lessonId>, unit:<unitId>, test:<unit>, drill:<unit>, check:<unit>,
   flash:<unit>, book:<bookId>, series:<n>, game:<gameId>, place:<room>, crew:<npcId>, trivia, review, and tool ids
   (radio, flightlog, fleet, gallery, crewboard, news, locker, logbook, explorer, record, achievements, settings, backup).
   Docs: docs/ACTIVITY_REGISTRY.md is generated from this file by qa/hfq_r7_registry_export.js. */
(function(){
const H=G.HFQ;
const R=H.REG={};
const GAME_META={   // about how long a round takes, and how hard it is (1 easy, 3 hard). Estimates from playing, not measurements.
 landing:[3,2],marshal:[3,1],paper:[2,1],bags:[2,1],golf:[5,1],pong:[4,2],pool:[5,2],cargo:[5,2],spot:[3,2],metar:[4,3],wx:[4,3],lightgun:[3,2],
 depart:[5,3],arrive:[5,3],taxi:[4,2],preflight:[4,2],wash:[4,1],cloud:[3,2],pairs:[3,1],gauges:[3,2],words:[4,1],darts:[2,2],hockey:[3,1],radar4:[4,2],skee:[2,1],bowling:[3,1],hoops:[1,1]};
const lc=s=>String(s||'').toLowerCase();
const ok={ok:true,why:''};
const unitOf=id=>H.units.find(u=>u.id===id);
const objectiveOf=u=>{ const t=(u.topics||[]).slice(0,5).map(x=>x.charAt(0).toLowerCase()+x.slice(1)); return t.length?'Explain '+(t.length>1?t.slice(0,-1).join(', ')+' and '+t[t.length-1]:t[0])+'.':u.s; };
let cache=null, cacheKey='';
/* where each game lives on the airfield (its stations), worked out from the world data rather than typed twice */
function gamePlaces(){ const out={}; for(const k in G.WORLD.rooms){ for(const s of G.WORLD.rooms[k].stations||[]){ const g=s.go&&s.go.scene; if(g&&g.indexOf('g_')===0){ const id=g.slice(2); (out[id]=out[id]||[]).indexOf(k)<0&&out[id].push(k); } } } return out; }
const roomName=k=>{ const r=G.WORLD.rooms[k]; return r?(r.name||r.title||k):k; };
R.roomName=roomName;

function build(){
 const A=[], add=a=>{ a.words=lc([a.title,a.sub,a.cat,a.kind,a.objective,(a.words||'')].join(' ')); A.push(a); return a; };
 const gp=gamePlaces();
 /* ---- Ground School: every unit, and every node on its Flight Path stage (same rules as the Flight Path) ---- */
 H.units.forEach((u,ui)=>{ const L=H.lessons[u.id]||[]; if(!L.length) return; const stage=(H.stages||[]).find(s=>s.id===u.stage);
  const node=k=>H.unitNodes(u,ui).find(n=>n.k===k), UT=UI_T(u.t);
  add({id:'unit:'+u.id,kind:'unit',title:UT,sub:UI_T(u.s),cat:'Ground School',unit:u.id,stage:u.stage,place:'classroom',icon:'path',objective:objectiveOf(u),
   prereq:ui===0||(stage&&stage.free)?'Open from the start.':'Opens when the unit before it is BRONZE.',assess:'Lessons, then a checkride ('+H.checkN+' questions, '+H.checkPass+' to pass) for the patch.',est:L.length*4,diff:u.stage==='discovery'?1:(u.stage==='student'?2:3),
   avail:()=>H.unitOpen(u.id)?ok:{ok:false,why:'Finish the unit before it to BRONZE first.'},
   status:()=>{ const T=H.tier(u.id), P=H.unitProg(u.id); return {done:T.silver,label:T.name||(P.done?P.done+' / '+P.total+' LESSONS':'NEW'),tier:T.t}; },
   launch:back=>{ G.go('route',{unit:u.id,back}); return true; }});
  L.forEach((l,i)=>add({id:'lesson:'+l.id,kind:'lesson',title:l.t,sub:UT+' • Lesson '+(i+1)+' of '+L.length,cat:'Ground School',unit:u.id,stage:u.stage,place:'classroom',icon:'plane',objective:l.t+' ('+(l.qs||[]).length+' challenges)',
   prereq:i===0?'Opens with the unit.':'Opens after lesson '+i+'.',assess:'Tap-only challenges; every miss comes back before landing. 3 stars for no misses.',est:Math.max(3,Math.round(((l.cards||[]).length*25+(l.qs||[]).length*20)/60)),diff:1,
   avail:()=>{ const n=H.unitNodes(u,ui).find(x=>x.k==='lesson'&&x.i===i); return n&&n.open?ok:{ok:false,why:H.unitOpen(u.id)?'Fly lesson '+i+' first.':'This unit is not open yet.'}; },
   status:()=>{ const r=H.fl().l[l.id]; return {done:!!r,label:r?(r.tested?'TESTED OUT':r.stars+' ★'):'NEW'}; },
   launch:back=>{ const n=H.unitNodes(u,ui).find(x=>x.k==='lesson'&&x.i===i); if(!n||!n.open) return false; H.openNode(n,u,{scene:back||'hub',args:{}},back); return true; }}));
  const nodeAct=(k,id,title,sub,icon,assess,est)=>add({id,kind:k,title,sub,cat:'Ground School',unit:u.id,stage:u.stage,place:'classroom',icon,objective:objectiveOf(u),prereq:k==='check'?'Every lesson in the unit done.':(k==='drill'?'The unit at BRONZE.':'The unit open.'),assess,est,diff:2,
   avail:()=>{ const n=node(k); if(!n) return {ok:false,why:k==='test'?'Already BRONZE: nothing left to test out of.':'Not available.'}; if(k==='test'&&!H.testOutLeft(u.id)) return {ok:false,why:'Two test-out tries a day. The lessons are open.'}; return n.open?ok:{ok:false,why:k==='check'?'Finish every lesson first.':(k==='drill'?'Reach BRONZE first.':'This unit is not open yet.')}; },
   status:()=>{ const n=node(k); return {done:!!(n&&n.done),label:n&&n.done?'DONE':(k==='test'?H.testOutLeft(u.id)+' TRIES LEFT TODAY':'')}; },
   launch:back=>{ const n=node(k); if(!n||!n.open) return false; return H.openNode(n,u,{scene:back||'hub',args:{}},back)!==false; }});
  nodeAct('test','test:'+u.id,'Test out: '+UT,'Already know it? '+H.TESTOUT_N+' questions','chevrons','10 questions, 80% to pass, two tries a day. Passing marks the lessons done (BRONZE).',4);
  nodeAct('drill','drill:'+u.id,'Drill: '+UT,H.DRILL_N+' timed questions','clock','10 questions, 8 seconds each. A perfect drill is half of GOLD.',3);
  nodeAct('check','check:'+u.id,'Checkride: '+UT,'The unit patch','medal','Practice checkride: '+H.checkN+' questions, '+H.checkPass+' to pass. Earns the unit patch (SILVER). Not an FAA test.',6);
  add({id:'flash:'+u.id,kind:'flash',title:'Flashcards: '+UT,sub:H.Q?H.Q.cards(u.id).length+' cards':'',cat:'Practice',unit:u.id,stage:u.stage,place:'classroom',icon:'cards',objective:objectiveOf(u),prereq:'The unit open.',assess:'Self-rated: GOT IT or STUDY AGAIN until the deck is clear. No score.',est:4,diff:1,
   avail:()=>H.unitOpen(u.id)?ok:{ok:false,why:'This unit is not open yet.'}, status:()=>({done:!!((H.fl().flash||{})[u.id]),label:''}),
   launch:back=>{ H.startFlash(u.id,{scene:back||'hub',args:{}}); return true; }});
 });
 add({id:'trivia',kind:'practice',title:'Flight Trivia',sub:H.TRIVIA_N+' mixed questions, '+H.TRIVIA_T+' seconds each',cat:'Practice',place:'classroom',icon:'star',objective:'Recall facts from every open unit.',prereq:'Any unit open.',assess:'Points for right answers and speed; best score kept.',est:3,diff:2,avail:()=>ok,status:()=>({done:false,label:'BEST '+(((H.fl().trivia)||{}).best||0)}),launch:back=>{ H.startTrivia({scene:back||'hub',args:{}}); return true; }});
 add({id:'review',kind:'practice',title:'Hangar Flying',sub:'Every question you missed, until it is right',cat:'Practice',place:'classroom',icon:'chat',objective:'Clear every missed question.',prereq:'A missed question.',assess:'Each missed question comes back until answered right.',est:3,diff:1,
  avail:()=>H.totals().missed?ok:{ok:false,why:'No missed questions right now.'},status:()=>({done:!H.totals().missed,label:H.totals().missed?H.totals().missed+' TO CLEAR':'CLEAR'}),launch:back=>{ if(!H.totals().missed) return false; H.startReview({scene:back||'hub',args:{}}); return true; }});
 /* ---- the Library: ground school books (the series is added by hfq_reader.js) ---- */
 for(const b of H.BOOKS||[]){ const u=unitOf(b.unit);
  add({id:'book:'+b.id,kind:'book',title:UI_T(b.t),sub:b.sub,cat:'Library',unit:b.unit,place:'classroom',icon:'book',objective:'Read '+UI_T(b.t)+', then pass its quiz ('+Math.max(1,b.quiz.length-Math.floor(b.quiz.length/6))+' of '+b.quiz.length+').',prereq:'None. Every book is open.',assess:b.quiz.length?'Book quiz: '+b.quiz.length+' questions. Passing counts toward GOLD for '+(u?UI_T(u.t):'its unit')+'.':'No quiz.',est:b.min||Math.max(3,Math.round(b.sec.length*.8)),diff:1,
   avail:()=>ok,status:()=>{ const r=H.lib.rec(b.id); return {done:H.lib.passed(b.id),label:r&&r.aced?'ACED':(r&&r.passed?'QUIZ PASSED':(H.lib.isRead(b.id)?'READ':(H.lib.pos(b.id)?'CONTINUE':'NEW')))}; },
   launch:back=>{ G.go('book',{id:b.id,back}); return true; }}); }
 /* ---- games ---- */
 for(const g of (H.GAMES||[]).filter(x=>x.built)){ const m=GAME_META[g.id]||[3,2], u=g.learn&&unitOf(g.learn), places=gp[g.id]||[];
  add({id:'game:'+g.id,kind:'game',title:UI_T(g.name),sub:g.desc,cat:'Games',unit:g.learn||null,place:places[0]||null,places,where:g.where,icon:g.icon||'joy',fun:!g.learn,objective:u?'Practice '+UI_T(u.t)+': '+g.desc:g.desc,prereq:'None. Every game is open.',assess:'Score: '+(g.best==='low'?'lowest':'highest')+' '+(g.unit||'points')+' is your best. Game XP: 15 the first time, 5 for a new best, up to 40 a day.',est:m[0],diff:m[1],
   avail:()=>ok,status:()=>{ const r=H.gameRec?H.gameRec(g.id):null; return {done:!!(r&&r.plays),label:r&&r.best!=null?'BEST '+H.fmtScore(g.id,r.best):'NEW',best:r&&r.best,plays:r?r.plays:0}; },
   launch:back=>{ G.go('g_'+g.id,{back}); return true; }}); }
 /* ---- the airfield: places and crew (in the Hub a place page counts as a visit, exactly like walking in) ---- */
 for(const k in G.WORLD.rooms){ const r=G.WORLD.rooms[k];
  const mp=(H.mapPlaces||[]).find(p=>p.room===k);
  add({id:'place:'+k,kind:'place',title:UI_T(roomName(k)),sub:(mp&&mp.blurb)||'',cat:'The Airfield',place:k,icon:'pin',objective:'Visit the '+UI_T(roomName(k))+'.',prereq:'None.',assess:'First visit: +'+H.xp.place+' XP. All nine: AIRFIELD EXPLORER.',est:1,diff:1,
   avail:()=>ok,status:()=>{ const v=((G.save.mod.world||{}).visited||{})[k]; return {done:!!v,label:v?'VISITED':'NEW'}; },
   launch:back=>{ G.go('hub',{view:'place',args:{room:k}}); return true; }});
  for(const n of r.npcs||[]) add({id:'crew:'+n.id,kind:'crew',title:UI_T(n.name),sub:(n.role||'')+' • '+UI_T(roomName(k)),cat:'The Airfield',place:k,icon:'user',objective:'Meet the '+UI_T(n.name)+'.',prereq:'None.',assess:'First meeting: +'+H.xp.crew+' XP. Everyone: MET THE CREW.',est:1,diff:1,
   avail:()=>ok,status:()=>{ const m=((G.save.mod.world||{}).met||{})[n.id]; return {done:!!m,label:m?'MET':'NEW'}; },
   launch:back=>{ G.go('hub',{view:'place',args:{room:k,talk:n.id}}); return true; }});
 }
 /* ---- tools ---- */
 const tool=(id,title,sub,icon,scene,args,place)=>add({id,kind:'tool',title,sub,cat:'Tools',place:place||null,icon,objective:sub,prereq:'None.',assess:'',est:2,diff:1,avail:()=>ok,status:()=>({done:false,label:''}),launch:back=>{ G.go(scene,Object.assign({back},args||{})); return true; }});
 tool('radio','Call the Tower','Weather, the ATIS, and real radio calls','headset','radio',{},'tower');
 tool('flightlog','Flight Log','Real flights and sim sessions, kept apart','cal','flightlog',{},'lounge');
 tool('logflight','Log a Flight','A flight you took, as a passenger or a student','plus','logflight',{},'lounge');
 tool('fleet','My Hangar','Your aircraft, its paint and the unlocks','plane','fleet',{},'hangar');
 tool('gallery','Aircraft Gallery','Every kind of aircraft','search','fleet',{gallery:true},'hangar');
 tool('crewboard','Crew Board','What your crew did, and one-tap kudos','users','crew',{},'lounge');
 tool('news','Hangar News','Announcements from your Family Lead','chat','board',{},'lounge');
 tool('locker','My Locker','Your cadet’s look','user','locker',{},'lounge');
 tool('logbook','My Logbook','Pilot card, phases, badges and patches','trophy','logbook',{},'lounge');
 tool('practice','Practice Hub','Flashcards, trivia, drills and Hangar Flying','cards','practice',{},'classroom');
 tool('path','Flight Path','The whole course, unit by unit','path','path',{},'classroom');
 return A;
}
function UI_T(s){ return H.UI?H.UI.title(s):s; }
R.list=function(){ const key=H.units.length+':'+Object.keys(H.lessons).length+':'+(H.BOOKS||[]).length+':'+(H.GAMES||[]).length+':'+(R.extra.length); if(!cache||key!==cacheKey){ cache=build().concat(R.extra.map(f=>f()).flat()); cacheKey=key; } return cache; };
R.extra=[];   // other files add their activities here: R.extra.push(()=>[...])
R.invalidate=()=>{ cache=null; };
R.get=id=>R.list().find(a=>a.id===id)||null;
R.avail=id=>{ const a=R.get(id); return a?a.avail():{ok:false,why:'Unknown activity.'}; };
/* launch: the one way in. back = the scene to return to ('hub', 'world', 'path'...) */
R.launch=function(id,back){ const a=R.get(id); if(!a) return false; const v=a.avail(); if(!v.ok){ G.toast(v.why.toUpperCase(),G.C.warn); return false; } return a.launch(back||G.homeScene())!==false; };
/* search: every word must match somewhere; titles weigh most */
R.search=function(q,f){ f=f||{}; const words=lc(q).split(/\s+/).filter(Boolean); let L=R.list();
 if(f.cat) L=L.filter(a=>a.cat===f.cat); if(f.kind) L=L.filter(a=>(Array.isArray(f.kind)?f.kind:[f.kind]).indexOf(a.kind)>=0);
 if(!words.length) return L;
 const scored=[]; for(const a of L){ if(!words.every(w=>a.words.indexOf(w)>=0)) continue; const t=lc(a.title); let s=0; for(const w of words){ if(t.indexOf(w)===0) s+=6; else if(t.indexOf(' '+w)>=0) s+=4; else if(t.indexOf(w)>=0) s+=3; else s+=1; } if(a.kind==='unit'||a.kind==='game'||a.kind==='book') s+=1; scored.push([s,a]); }
 return scored.sort((x,y)=>y[0]-x[0]).map(x=>x[1]);
};
/* the inventory, as plain data (docs and tests) */
R.inventory=()=>R.list().map(a=>({id:a.id,kind:a.kind,title:a.title,cat:a.cat,unit:a.unit||null,stage:a.stage||null,place:a.place||null,objective:a.objective||'',prereq:a.prereq||'',assess:a.assess||'',est:a.est||null,diff:a.diff||null}));
})();
