/* HFQ Round 7: TWO-MODE PARITY. The brief's testable invariant: an identical attempt + answer sequence yields identical scores,
   mastery, milestones and achievements whether a cadet walks the airfield or uses the Academy Hub.
   Two brand-new cadets on one device. ALPHA uses the walkable airfield (Flight Path nodes, the room's stations, the stick).
   BRAVO switches to the Academy Hub (lists and buttons). Both do the same things with the same answers:
     Lesson 1 of unit 1 with one miss -> the unit's first book, read through, its quiz with one wrong answer -> the Tower
     (first visit + meeting the controller) -> Paper Plane Toss ended with the same score -> a flashcard deck.
   Math.random is seeded per scene in both sessions, so both cadets see the same questions in the same order.
   Then the two saves are compared field by field (timestamps and the mode flag removed): they must be identical.
   Also: every activity in the registry is launchable in both modes, and the Hub exposes all of them.
   Run: cd web && python3 -m http.server 8777   then   node qa/hfq_r7_parity.js */
const { chromium } = require('playwright');
const fs=require('fs'), path=require('path');
const drive=require('./lib/drive.js');
const BASE=process.env.BASE_URL||'http://localhost:8777/';
const S=path.join(__dirname,'shots')+'/'; fs.mkdirSync(S,{recursive:true});
const results=[], errors=[]; const ok=(c,l)=>{ results.push((c?'OK   ':'FAIL ')+l); if(process.env.VERBOSE) console.log(results[results.length-1]); };
(async()=>{
 const b=await chromium.launch();
 const ctx=await b.newContext({viewport:{width:390,height:800},deviceScaleFactor:2,hasTouch:true,isMobile:true});
 await ctx.addInitScript(drive.SEEDED_RANDOM+drive.SEED_SCENES);
 const page=await ctx.newPage();
 page.on('pageerror',e=>errors.push('PAGEERROR: '+e.message+' '+(e.stack||'').split('\n')[1]));
 page.on('console',m=>{ if(m.type()==='error'&&!/fonts\.g|ERR_|favicon/.test(m.text())) errors.push('CONSOLE: '+m.text()); });
 const D=drive(page,ctx,{base:BASE}); const {ev,wait,until,tapR,tapV}=D;

 /* the comparable part of a save: everything that is progress, nothing that is a clock or the mode itself */
 const digest=()=>ev(()=>{ const s=JSON.parse(JSON.stringify(G.save)), m=s.mod;
  const strip=(o,keys)=>{ if(!o||typeof o!=='object') return o; for(const k of Object.keys(o)){ if(keys.includes(k)) delete o[k]; else strip(o[k],keys); } return o; };
  const fl=m.fl||{}; const lessons={}; for(const id in fl.l||{}) lessons[id]=strip(Object.assign({},fl.l[id]),['at','day']);
  const games={}; for(const id in m.games||{}) if(id!=='day') games[id]=strip(Object.assign({},m.games[id]),['at']);
  return {points:s.points,ach:Object.keys(s.ach||{}).sort(),lessons,gs:(()=>{ const g=JSON.parse(JSON.stringify(m.gs||{})); g.seen=Object.keys(g.seen||{}).sort(); return strip(g,['at','t']); })(),tiers:G.HFQ.units.slice(0,3).map(u=>G.HFQ.tier(u.id).name),
   lib:(()=>{ const L=JSON.parse(JSON.stringify(m.lib||{})); L.read=Object.keys(L.read||{}).sort(); return strip(L,['at','t','pos']); })(),games,visited:Object.keys((m.world||{}).visited||{}).sort(),met:Object.keys((m.world||{}).met||{}).sort(),
   miss:Object.keys(fl.miss||{}).sort(),flash:Object.keys(fl.flash||{}).sort(),read:Object.keys(m.read||{}).sort(),
   rec:(m.rec?m.rec.log:[]).filter(x=>x.k!=='mode'&&x.k!=='migrate').map(x=>x.k+'|'+x.a+'|'+JSON.stringify(strip(Object.assign({},x.r),['t','at','day','xpToday']))),
   tut:!!(m.tut&&m.tut.done)}; });

 const stepsCommon=async(name)=>{ // what both cadets do once they are in a lesson / reader / quiz: the SAME taps
  const r=await D.fly({miss:1}); ok(r.res&&r.missed.length===1,name+' flew Lesson 1 with one miss, then landed ('+(r.res&&r.res.stars)+' stars)');
  await D.lessonGo(); await wait(500); return r; };
 const readAndQuiz=async(name)=>{ // in the reader: through every chapter, then the quiz with the second answer wrong
  ok(await until(()=>G.sceneName==='book'&&!!document.querySelector('#ui.on .reader'),4000),name+' opened the unit’s first book in the reader');
  for(let g=0;g<12&&await ev(()=>!!document.querySelector('#ui.on .reader nav.chapnav .btn.primary')&&document.querySelector('#ui.on .reader nav.chapnav .btn.primary').textContent.indexOf('Next')>=0);g++) await D.click('Next chapter',{sel:'nav.chapnav button',ms:220});
  await D.click('Take the quiz',{sel:'.endcard button'}); ok(await until(()=>G.sceneName==='quiz',3000),name+' took the book quiz');
  const q=await D.quizAll(i=>i!==1); ok(q&&q.n>0&&q.right===q.n-1&&q.passed&&!q.perfect,name+' answered one wrong: '+q.right+' / '+q.n+', passed, not aced');
  await D.quizBack(); await wait(400); };

 /* ============================ ALPHA: the walkable airfield ============================ */
 await D.enroll('ALPHA','1111'); ok(await D.scene()==='placement','A0 ALPHA enrolled');
 await tapR(await ev(()=>G.scene.btns().find(b=>b.id==='new')),400); ok(await until(()=>G.sceneName==='world',3000),'A1 I’M NEW: into the Classroom');
 await ev(()=>G.HFQ.tut.finish(true)); await wait(200);   // skip the briefing (the same skip the Hub offers)
 await ev(()=>G.go('path',{back:'world'},true)); await wait(600);
 await tapV(135,await ev(()=>{ const s=G.scene, st=s.geo().stages[0]; return s.area().y+st.y+30-s.sc.scroll; }),600);   // the unit banner opens the unit (Ground School), as the Hub's unit page does
 ok(await ev(()=>G.sceneName==='route'),'A1b the unit banner opens Ground School for the unit'); await tapV(30,20,600);
 if(await D.scene()!=='path'){ await ev(()=>G.go('path',{back:'world'},true)); await wait(500); }
 ok(await D.pathGo({u:'flight',k:'lesson',i:0}),'A2 Flight Path: Lesson 1 node, GO');
 await stepsCommon('A3');
 if(await D.scene()!=='path'){ await ev(()=>G.go('path',{back:'world'},true)); await wait(500); }
 ok(await D.pathGo({u:'flight',k:'read',id:(await ev(()=>G.HFQ.unitBooks('flight')[0].id))}),'A4 Flight Path: READ node, GO');
 await readAndQuiz('A5');
 await ev(()=>G.go('world',{room:'tower'},true)); await wait(800);
 ok(await ev(()=>G.sceneName==='world'&&G.world.room()==='tower'),'A6 walked into the Tower');
 ok(await D.walk({npc:'tower'})&&await D.use(),'A7 steered to the controller and pressed USE'); await D.talkThrough();
 await ev(()=>G.go('world',{room:'platform'},true)); await wait(800);
 const stKey=await ev(()=>(G.WORLD.rooms.platform.stations.find(s=>s.go&&s.go.scene==='g_paper')||{}).key);
 ok(!!stKey&&await D.walk({st:stKey})&&await D.use(),'A8 Viewing Platform: walked to Paper Plane Toss and pressed USE');
 ok(await until(()=>G.sceneName==='g_paper',3000),'A9 the game opened'); await wait(600);
 await ev(()=>G.MG.end(G.scene,31,{head:'QA'})); await wait(900);   // the same final score for both cadets (the scoring service is what is under test)
 await ev(()=>G.go('practice',{back:'world'},true)); await wait(500);
 ok(await D.listTap('HOW AIRPLANES FLY'),'A10 Practice Hub: the unit’s flashcards'); ok(await until(()=>G.sceneName==='flash',3000),'A11 the deck opened');
 await ev(()=>{ const s=G.scene; let g=0; while(!s.done&&g++<200) s.rate(true); }); await wait(400);
 const A=await digest(); await D.shot(S+'R7P_01_alpha_path.png');
 ok(A.points>0&&A.ach.length>=2&&Object.keys(A.lessons).length===1,'A12 ALPHA’s save: '+A.points+' XP, '+A.ach.length+' badges, lesson recorded');
 await ev(()=>{ G.logout(); G.go('title',{},true); }); await wait(400);

 /* ============================ BRAVO: the Academy Hub ============================ */
 await tapR(await ev(()=>G.scene.layout().btns.find(b=>b.id==='signup')),300);
 await ev(()=>{ if(G.sceneName==="terms"){ G.HFQ.acceptTerms("QA","lead"); G.HFQ.recordPledge("QA"); G.go("signup",{termsOk:true,pledged:true},true); } }); await wait(200);
 await page.locator('input.gfield').fill('BRAVO'); await tapR(await ev(()=>G.scene.nextBtn()),200);
 await page.locator('input.gfield').fill('2222'); await wait(300); await page.locator('input.gfield').fill('2222'); await wait(900);
 await tapR(await ev(()=>G.scene.layout().btns.find(b=>b.id==='done')),500);
 await tapR(await ev(()=>G.scene.layout().cards[0]),150); await tapR(await ev(()=>G.scene.layout().btn),900);
 ok(await D.scene()==='placement'&&await ev(()=>G.activeAcct&&G.activeAcct.name==='BRAVO'),'B0 BRAVO enrolled on the same device');
 await tapR(await ev(()=>G.scene.btns().find(b=>b.id==='new')),400); await until(()=>G.sceneName==='world',3000);
 await ev(()=>{ G.HFQ.tut.finish(true); G.HFQ.setMode('hub'); G.go('hub',{},true); }); await wait(800);
 ok(await ev(()=>G.sceneName==='hub'&&G.HFQ.isHub()&&G.homeScene()==='hub'),'B1 Academy Hub mode: the Hub is home'); await D.shot(S+'R7P_02_bravo_hub.png');
 ok(await D.click('Flight Path',{sel:'.tile'}),'B2 Hub: Flight Path tile'); ok(await D.click('How Airplanes Fly',{sel:'.item'}),'B3 the unit page');
 ok(await D.click('Lesson 1',{sel:'.item'}),'B4 Lesson 1, GO'); ok(await until(()=>G.sceneName==='lesson',3000),'B4b the same lesson scene');
 await stepsCommon('B5');
 ok(await until(()=>G.sceneName==='hub'&&G.HFQ.UI.stack().slice(-1)[0].view==='unit',4000),'B6 back on the unit page where BRAVO left it');
 ok(await D.click('Read: The Four Forces',{sel:'.item'}),'B7 the unit’s first book');
 await readAndQuiz('B8');
 await ev(()=>G.go('hub',{view:'place',args:{room:'tower'}},true)); await wait(700);
 ok(await ev(()=>G.sceneName==='hub'&&(G.save.mod.world.visited||{}).tower),'B9 the Tower’s page counts as a visit');
 ok(await D.click('Tower',{sel:'.item'}),'B10 MEET the controller'); await D.click('Thanks!');
 await ev(()=>G.go('hub',{view:'place',args:{room:'platform'}},true)); await wait(700);
 ok(await D.click('Paper Plane',{sel:'.item',re:true}),'B11 the Viewing Platform’s page: its Paper Plane Toss station, OPEN'); ok(await until(()=>G.sceneName==='g_paper',3000),'B11b the game opened'); await wait(600);
 await ev(()=>G.MG.end(G.scene,31,{head:'QA'})); await wait(900);
 await ev(()=>G.go('hub',{view:'unit',args:{unit:'flight'}},true)); await wait(600);
 ok(await D.click('Flashcards'),'B12 the unit page: Flashcards'); ok(await until(()=>G.sceneName==='flash',3000),'B13 the deck opened');
 await ev(()=>{ const s=G.scene; let g=0; while(!s.done&&g++<200) s.rate(true); }); await wait(400);
 const Bd=await digest(); await D.shot(S+'R7P_03_bravo_unit.png');

 /* ============================ THE INVARIANT ============================ */
 const same=JSON.stringify(A)===JSON.stringify(Bd);
 ok(same,'P1 PARITY: identical answers in both modes gave identical XP, badges, stars, tiers, quiz records, game records, visits and verified log');
 if(!same){ const keys=Object.keys(A); for(const k of keys) if(JSON.stringify(A[k])!==JSON.stringify(Bd[k])) results.push('       differs: '+k+'\n         airfield: '+JSON.stringify(A[k]).slice(0,300)+'\n         hub:      '+JSON.stringify(Bd[k]).slice(0,300)); }
 ok(A.points===Bd.points&&A.points>0,'P2 same XP in both modes ('+A.points+'), nothing earned for navigation alone');
 ok(await ev(()=>{ const R=G.HFQ.REG, L=R.list(); return L.length>800&&L.every(a=>typeof a.launch==='function'&&typeof a.avail==='function'&&typeof a.status==='function'&&a.id&&a.title&&a.cat); }),'P3 the registry: 800+ activities, each with avail/status/launch');
 ok(await ev(()=>{ const R=G.HFQ.REG, ids=new Set(R.list().map(a=>a.id)); return ids.size===R.list().length; }),'P4 every activity id is unique');
 ok(await ev(()=>{ const R=G.HFQ.REG; const kinds=new Set(R.list().map(a=>a.kind)); return ['unit','lesson','test','drill','check','flash','book','series','game','place','crew','tool','practice','dest'].every(k=>kinds.has(k)); }),'P5 the Hub reaches every kind of activity: lessons, tests, drills, checkrides, flashcards, books, the series, games, places, crew, tools, the Explorer');
 ok(await ev(()=>{ const R=G.HFQ.REG; return R.search('metar').some(a=>a.kind==='game')&&R.search('stall').some(a=>a.kind==='lesson')&&R.search('museum').some(a=>a.kind==='dest')&&R.search('tower').some(a=>a.kind==='crew'||a.kind==='place'); }),'P6 direct search returns the right activities (a game, a lesson, a place, the crew)');
 // mode switching never touches progress
 const before=await digest(); await ev(()=>{ G.HFQ.setMode('airfield'); G.go(G.homeScene(),{},true); }); await wait(600); await ev(()=>{ G.HFQ.setMode('hub'); G.go(G.homeScene(),{},true); }); await wait(600);
 ok(JSON.stringify(before)===JSON.stringify(await digest())&&await ev(()=>G.sceneName==='hub'),'P7 switching modes back and forth changes nothing in the save');

 console.log(results.join('\n')); const fails=results.filter(r=>r.startsWith('FAIL')).length;
 if(errors.length) console.log('ERRORS:\n'+errors.slice(0,8).join('\n'));
 console.log('\n'+(results.length-fails)+'/'+results.length+' passed'+(errors.length?', '+errors.length+' page errors':''));
 await b.close(); process.exit(fails||errors.length?1:0);
})().catch(e=>{ console.error(e); console.log(results.join('\n')); process.exit(1); });
