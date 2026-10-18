/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* PROFILES, MODES AND THE VERIFIED RECORD (r7, Gate 3).
   1. MODE. Each profile chooses how it gets around: the walkable AIRFIELD (the default) or the ACADEMY HUB (direct access,
      HTML, screen-reader friendly). The choice lives in that profile's settings (G.save.settings.hub). Both modes launch the
      same scenes through the same functions, so the same answers always give the same scores, XP, badges and tiers
      (qa/hfq_r7_parity.js proves it). Switching mode never touches progress.
   2. SCHEMA + MIGRATION. Saves carry mod.v. v1 (r6.x) -> v2 (r7) is purely additive: a verified-record log, reader and
      interface preferences, the Flight Record journal, and record fields on flight-log entries. A restore point of the raw
      saves is written to the device store before the first v2 migration. Older apps ignore the new fields.
   3. THE VERIFIED RECORD. What the app itself witnessed, with provenance: lessons, checkrides, test-outs, drills, book
      quizzes, trivia, game results and badges, each with the date, the result and the mode it happened in. It is not a
      certificate and it cannot be tamper-proof (there is no server); it is an honest diary the app keeps.
      G.save.mod.rec = {v:1, log:[{t, k, a, r, m}]}  (k kind, a activity id, r result, m mode), newest last, capped. */
(function(){
const H=G.HFQ;
const P=H.PROFILE={ SCHEMA:2, LOG_MAX:1500 };

/* ---------------- mode ---------------- */
H.isHub=()=>!!(G.save&&G.save.settings&&G.save.settings.hub);
H.mode=()=>H.isHub()?'hub':'airfield';
H.setMode=function(m){ const on=m==='hub'; if(!!G.save.settings.hub===on) return; G.save.settings.hub=on; G.persist(); if(H.UI) H.UI.reset(); H.rec('mode',{to:H.mode()}); };
(G.CFG.settingsToggles=G.CFG.settingsToggles||[]).push({id:'hub',label:'ACADEMY HUB MODE',def:false,on:v=>{ if(H.UI) H.UI.reset(); H.rec('mode',{to:v?'hub':'airfield'}); }});
const engineHome=G.homeScene;
G.homeScene=function(){ return H.isHub()&&G.scenes.hub?'hub':engineHome(); };
/* in Hub mode the walkable world and the Flight Bag hand over to the Hub (nothing is lost: the Hub reaches every activity) */
const goPrev=G.go;
G.go=function(name,args,instant){
 if(!H.isHub()&&(name==='world'||name==='dash')&&G.save&&G.save.mod&&G.save.mod.migratedAt&&!G.save.mod.renameSeen) setTimeout(()=>{ if(H.renameNotice()) G.toast('NEW NAME: HYPETEEN FLIGHT ACADEMY. ALL YOUR PROGRESS CAME WITH YOU.',G.C.good); },1400);
 if(H.isHub()&&G.scenes.hub&&(name==='world'||name==='dash')){
  if(args&&args.room&&G.WORLD.rooms[args.room]&&args.place!==false) return goPrev.call(G,'hub',{view:'place',args:{room:args.room}},instant);
  return goPrev.call(G,'hub',{},instant);
 }
 return goPrev.call(G,name,args,instant);
};

/* ---------------- the verified record ---------------- */
const REC=()=>{ const m=G.save.mod; m.rec=m.rec||{v:1,log:[]}; return m.rec; };
H.rec=function(k,r,a){ try{ const L=REC().log; L.push({t:Date.now(),k,a:a||(r&&r.a)||'',r:r||{},m:H.mode()}); if(L.length>P.LOG_MAX) L.splice(0,L.length-P.LOG_MAX); }catch(e){} };
H.recLog=()=>REC().log.slice();
/* hooks: wrap the existing functions, never re-implement them */
const oAch=G.ach; G.ach=function(id){ const had=!!(G.save.ach&&G.save.ach[id]); const out=oAch.apply(G,arguments); if(!had&&G.save.ach&&G.save.ach[id]){ H.rec('badge',{id},'badge:'+id); G.persist(); } return out; };
const wrapLater=()=>{
 if(H.gameDone&&!H.gameDone._rec){ const og=H.gameDone; H.gameDone=function(id,score,o){ const res=og.apply(H,arguments); H.rec('game',{score,best:res&&res.best,xp:res&&res.xp},'game:'+id); G.persist(); return res; }; H.gameDone._rec=1; }
 if(H.lib&&H.lib.markRead&&!H.lib.markRead._rec){ const om=H.lib.markRead; H.lib.markRead=function(id){ const had=H.lib.isRead(id); const xp=om.apply(H.lib,arguments); if(!had) { H.rec('read',{xp},'book:'+id); G.persist(); } return xp; }; H.lib.markRead._rec=1; }
 if(H.testOut&&!H.testOut._rec){ const ot=H.testOut; H.testOut=function(uid){ const n=ot.apply(H,arguments); if(n) { H.rec('testout',{lessons:n},'test:'+uid); G.persist(); } return n; }; H.testOut._rec=1; }
};
/* lessons, checkrides and quizzes report through H.recLesson / H.recQuiz (called from hfq_lessons.js and hfq_quiz.js) */
H.recLesson=function(kind,o){ H.rec(kind,o,(kind==='checkride'?'check:':'lesson:')+(kind==='checkride'?o.unit:o.lesson)); };
H.recQuiz=function(mode,o){ const a=mode==='book'?'quiz:'+o.book:(mode==='drill'?'drill:'+o.unit:(mode==='testout'?'testtry:'+o.unit:(mode==='inspect'?'inspect:'+o.unit:mode))); H.rec('quiz',Object.assign({mode},o),a); };

/* ---------------- schema v2 migration ---------------- */
const addV2=function(save){ const m=save.mod;
 m.rec=m.rec||{v:1,log:[]}; m.ui=m.ui||{}; m.journal=m.journal||{v:1,e:[]}; m.visits=m.visits||{}; m.read=m.read||{};
 if(save.settings&&!('hub' in save.settings)) save.settings.hub=false; };
/* a brand-new save starts at the current schema: nothing to migrate, no restore point, no rename notice */
P.fresh=function(save){ if(!save||!save.mod||(save.mod.v||1)>=P.SCHEMA) return false; addV2(save); save.mod.v=P.SCHEMA; return true; };
P.migrate=function(save,key){
 if(!save||!save.mod) return false;
 const m=save.mod, from=m.v||1; if(from>=P.SCHEMA) return false;
 if(from<2){
  addV2(save);
  if(m.flog&&Array.isArray(m.flog.e)) for(const e of m.flog.e){ if(!e.v){ e.v=1; e.src=e.k==='sim'?'app':'self'; e.cr=e.cr||e.at||Date.now(); e.up=e.up||e.cr; } }
  m.rec.log.push({t:Date.now(),k:'migrate',a:'schema:1-2',r:{from:1,to:2,key:key||''},m:'airfield'});
 }
 m.v=P.SCHEMA; m.migratedAt=Date.now();
 return true;
};
/* every save that loads is brought up to date; the first time a device sees v2, a restore point of the raw data is kept */
const stored=key=>{ try{ return localStorage.getItem(key)!=null; }catch(e){ return false; } };
const bringUp=function(existed){
 const raw=G.save&&G.save.mod&&(G.save.mod.v||1)<P.SCHEMA; if(!raw) return;
 if(!existed){ P.fresh(G.save); return; }   // persisted on the first real change, like any new save
 if(H.store&&H.store.ok&&!P._snapped){ P._snapped=true; H.store.snapshot('Before the r7 update (schema 1 to 2)'); }
 if(P.migrate(G.save,G.saveKey)) G.persist();
};
const prevLoad=G.loadSave;
G.loadSave=function(key){
 const existed=stored(key||G.KEYS.guest);
 prevLoad.call(G,key);
 try{ bringUp(existed); }catch(e){ console.warn('migration skipped',e); }
 wrapLater();
};
if(G.save) { try{ bringUp(stored(G.saveKey)); }catch(e){} }
setTimeout(wrapLater,0);

/* ---------------- a one-time notice for families coming from Flight Quarters ---------------- */
H.renameNotice=function(){ const m=G.save&&G.save.mod; if(!m||!m.migratedAt||m.renameSeen) return false; m.renameSeen=Date.now(); G.persist(); return true; };

/* ---------------- the verified summary (both modes read this) ---------------- */
H.verified=function(){
 const f=H.fl(), lessons=[], units=[], quizzes=[], badges=[];
 for(const u of H.units){ const L=H.lessons[u.id]||[]; if(!L.length) continue; const T=H.tier(u.id), P2=H.unitProg(u.id);
  units.push({id:u.id,t:u.t,stage:u.stage,tier:T.t,tierName:T.name,tested:T.tested,done:P2.done,total:P2.total,stars:P2.stars,patch:P2.patch,drill:T.drill});
  L.forEach(l=>{ const r=f.l[l.id]; if(r) lessons.push({id:l.id,t:l.t,unit:u.id,stars:r.stars,best:r.best,runs:r.runs,at:r.at,tested:!!r.tested}); }); }
 const L=(G.save.mod.lib||{}).quiz||{}; for(const b of H.BOOKS||[]){ const r=L[b.id]; if(r) quizzes.push({id:b.id,t:b.t,best:r.best,n:b.quiz.length,passed:r.passed,aced:r.aced,plays:r.plays}); }
 for(const b of G.CFG.badges||[]){ const at=G.save.ach[b.id]; if(at) badges.push({id:b.id,n:b.n,at}); }
 badges.sort((a,b)=>a.at-b.at);
 return {lessons,units,quizzes,badges,xp:G.save.points,rank:H.rank(G.save.points),log:H.recLog()};
};
/* topics to practice: missed questions waiting in Hangar Flying, grouped by unit */
H.toPractice=function(){ const f=H.fl(), by={}; for(const qid in f.miss||{}){ const q=H.qIndex[qid]; if(!q) continue; const l=(H.allLessons().find(x=>x.id===q.lesson)); const u=l&&l.unit; if(!u) continue; by[u]=(by[u]||0)+1; }
 return Object.keys(by).map(u=>({unit:u,t:(H.units.find(x=>x.id===u)||{}).t||u,n:by[u]})).sort((a,b)=>b.n-a.n); };
})();
