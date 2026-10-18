/* HFQ Round 6: the 3/4 diorama renderer, the Game Room, the Library (24 books + quizzes), the quiz engine and flashcards,
   the Flight Path (mastery tiers, test-out, drills, checkrides), the placement check and the Practice Hub.
   Run: cd web && python3 -m http.server 8777   then   node qa/hfq_r6_smoke.js */
const { chromium } = require('playwright');
const fs=require('fs'), path=require('path');
const BASE=process.env.BASE_URL||'http://localhost:8777/';
const S=path.join(__dirname,'shots')+'/'; fs.mkdirSync(S,{recursive:true});
const results=[], errors=[]; const ok=(c,l)=>{ results.push((c?'OK   ':'FAIL ')+l); if(process.env.VERBOSE) console.log(results[results.length-1]); };
(async()=>{
 const b=await chromium.launch();
 const ctx=await b.newContext({viewport:{width:390,height:800},deviceScaleFactor:2,hasTouch:true,isMobile:true});
 const page=await ctx.newPage();
 page.on('pageerror',e=>errors.push('PAGEERROR: '+e.message+' '+(e.stack||'').split('\n')[1]));
 page.on('console',m=>{ if(m.type()==='error'&&!/fonts\.g|ERR_|favicon/.test(m.text())) errors.push('CONSOLE: '+m.text()); });
 const wait=ms=>page.waitForTimeout(ms), ev=(f,a)=>page.evaluate(f,a), shot=n=>page.screenshot({path:S+n+'.png'});
 const tapV=async(x,y)=>{ const [cx,cy]=await ev(([x,y])=>{ const r=G.canvas.getBoundingClientRect(); return [r.left+x*r.width/G.VW,r.top+y*r.height/G.VH]; },[x,y]); await page.touchscreen.tap(cx,cy); await wait(120); };
 const tapR=async r=>{ if(!r) return false; await tapV(r.x+r.w/2,r.y+r.h/2); return true; };
 // drive the quiz engine: answer every question (right or wrong), straight to the results
 const runQuiz=(right)=>ev(right=>{ const s=G.scene; let guard=0; while(!s.over&&guard++<60){ const q=s.cur(); s.answer(right?q.ok:(q.ok+1)%q.opts.length); s.next(); } return s.over&&{right:s.over.right,n:s.over.n,passed:s.over.passed,perfect:s.over.perfect,res:s.over.res}; },right);
 await page.goto(BASE); await page.waitForFunction(()=>document.getElementById('tapstart').style.display==='block');
 await wait(400); await page.evaluate(()=>{ const b=document.getElementById('tapstart'); if(b&&b.offsetParent) b.click(); }); await page.waitForFunction(()=>G.sceneName==='terms'||G.sceneName==='title',null,{timeout:15000}); await page.evaluate(()=>{ if(G.sceneName==='terms'){ G.HFQ.acceptTerms('QA','lead'); G.go('title',{gateSeen:true},true); } }); await wait(500);
 await tapR(await ev(()=>G.scene.layout().btns.find(b=>b.id==='signup'))); await wait(300);
 await ev(()=>{ if(G.sceneName==='terms'){ G.HFQ.acceptTerms('QA','lead'); G.HFQ.recordPledge('QA'); G.go('signup',{termsOk:true,pledged:true},true); } }); await wait(200);   // pass the Terms gate (tested in hfq_arch_smoke)
 await page.locator('input.gfield').fill('ECHO SCOUT'); await tapR(await ev(()=>G.scene.nextBtn())); await wait(200);
 await page.locator('input.gfield').fill('5937'); await wait(300); await page.locator('input.gfield').fill('5937'); await wait(900);
 await tapR(await ev(()=>G.scene.layout().btns.find(b=>b.id==='done'))); await wait(500);
 await tapR(await ev(()=>G.scene.layout().cards[0])); await wait(150); await tapR(await ev(()=>G.scene.layout().btn)); await wait(900);

 /* ---------------- PLACEMENT (right after enrolling) ---------------- */
 ok(await ev(()=>G.sceneName==='placement'),'E1 after the trainer pick, the placement screen asks if you have studied flying before');
 await shot('R6_01_placement');
 await tapR(await ev(()=>G.scene.btns().find(b=>b.id==='place'))); await wait(500);
 ok(await ev(()=>G.sceneName==='quiz'&&G.scene.qs.length===12&&!G.scene.timer),'E2 the placement check is 12 untimed questions from the first four units');
 const pl=await runQuiz(true);
 ok(pl&&pl.right===12&&await ev(()=>{ const H=G.HFQ; return H.units.slice(0,4).every(u=>H.tier(u.id).bronze&&H.tier(u.id).tested)&&H.fl().placed===1; }),'E3 acing it tests out of the first four units (BRONZE, marked tested out)');
 await wait(700); await ev(()=>G.clearToasts()); await tapR(await ev(()=>G.scene.overBtns().find(b=>b.id==='back'))); await wait(1800);   // r7.4: testing out of four units earns a milestone card that takes the first tap; close it first
 ok(await ev(()=>G.sceneName==='world'&&G.world.room()==='classroom'),'E4 then into the Classroom');
 // reset the placement for the rest of the run
 await ev(()=>{ const H=G.HFQ, f=H.fl(); for(const u of H.units) for(const l of H.lessons[u.id]||[]) delete f.l[l.id]; G.persist(); });

 /* ---------------- THE DIORAMA ---------------- */
 ok(await ev(()=>{ const V=G.V, R=G.WORLD.rooms.lounge; V.set(R); const [X,Y]=V.P(100,300), [x,y]=V.unP(X,Y); return Math.abs(x-100)<1e-6&&Math.abs(y-300)<1e-6&&X>100&&Y<300; }),'D1 G.V projects floor points (sheared right, compressed) and unprojects them back');
 ok(await ev(()=>{ const V=G.V; V.set(G.WORLD.rooms.lounge); return !V.outdoor&&(V.set(G.WORLD.rooms.runway),V.outdoor)&&(V.set(G.WORLD.rooms.platform),V.outdoor); }),'D2 indoor places get walls; the runway and the platform are open ground');
 ok(await ev(()=>{ const s=G.scene, R=s.P.R, V=G.V; V.set(R); const st=R.stations.find(q=>q.key==='desk'); const p=V.fp(st.foot); const h=s.hitThing((p[0]+p[2])/2,p[3]-4); return h&&h.st&&h.st.key==='desk'; }),'D3 tapping a station at its projected footprint hits it');
 ok(await ev(()=>{ const V=G.V, R=G.WORLD.rooms.classroom; V.set(R); const L=G.scene.layout(); const t=G.scene.camTarget(L); return t[0]>=0&&t[0]<=V.W-L.vw+1&&(V.H<=L.vh?Math.abs(t[1]-(V.H-L.vh)/2)<1:t[1]>=0); }),'D4 the camera clamps to the projected room (centered when the room is shorter than the view)');
 ok(await ev(()=>['box','top','front','side','plane','shadow','cyl','fp'].every(k=>typeof G.V[k]==='function')),'D5 the volume kit: box, top, front, side, plane, shadow, cyl, fp');
 ok(await ev(()=>{ const A=G.worldArt; return ['pool','hockey','pingpong','skee','cardtable','jukebox','rug','workbench','drum','puzzledesk'].every(k=>A.floor[k])&&['neon','scores'].every(k=>A.wall[k]); }),'D6 the new props exist (volumes + the neon sign + the high-scores board)');
 await ev(()=>G.go('world',{room:'gameroom',at:'pong'},true)); await wait(500); await shot('R6_02_gameroom');
 await ev(()=>G.go('world',{room:'runway',at:'toHangar'},true)); await wait(500); await shot('R6_03_runway');

 /* ---------------- THE GAME ROOM ---------------- */
 ok(await ev(()=>{ const R=G.WORLD.rooms; return !!R.gameroom&&R.lounge.stations.some(s=>s.key==='toGame'&&s.go.room==='gameroom')&&R.gameroom.stations.some(s=>s.key==='toLounge'&&s.go.room==='lounge'); }),'G1 the Game Room is off the Lounge, with a door each way');
 ok(await ev(()=>{ const R=G.WORLD.rooms, fun=['pool','cargo','radar4','hockey','skee','darts','bags','golf','pong','bowling','hoops']; const inGame=fun.every(k=>R.gameroom.stations.some(s=>s.key===k)); const notElsewhere=!['lounge','hangar'].some(r=>R[r].stations.some(s=>fun.includes(s.key))); return inGame&&notElsewhere; }),'G2 all eleven fun games are in the Game Room and nowhere else');
 ok(await ev(()=>{ const R=G.WORLD.rooms; const learn=[['tower','g_metar'],['tower','g_wx'],['tower','g_lightgun'],['ramp','g_preflight'],['ramp','g_marshal'],['wash','g_wash'],['platform','g_spot'],['platform','g_cloud'],['classroom','g_pairs'],['classroom','g_gauges'],['classroom','g_words'],['runway','g_landing']]; return learn.every(([r,sc])=>R[r].stations.some(s=>s.go&&s.go.scene===sc)); }),'G3 the learning games stay where they belong on the airfield');
 ok(await ev(()=>G.WORLD.rooms.gameroom.npcs.some(n=>n.id==='host')&&G.HFQ.mapPlaces.some(p=>p.room==='gameroom')),'G4 the Game Room has a host and a pin on the map');
 ok(await ev(()=>{ G.go('world',{room:'lounge',at:'jukebox'},true); const before=AUDIO.curName; const n=G.HFQ.jukebox(); return n!==before&&AUDIO.curName===n; }),'G5 the Lounge jukebox changes the song');

 /* ---------------- THE LIBRARY ---------------- */
 ok(await ev(()=>{ const H=G.HFQ; return H.BOOKS.length===32&&H.SHELVES.length===7&&H.SHELVES.every(s=>H.shelfBooks(s.id).length>=4); }),'L1 32 books on 7 shelves, at least 4 a shelf');
 ok(await ev(()=>{ const H=G.HFQ; return H.BOOKS.every(b=>b.sec.length>=6&&b.quiz.length>=6&&b.quiz.every(q=>q.a.length===4&&q.ok>=0&&q.ok<4&&q.why)&&H.units.some(u=>u.id===b.unit)); }),'L2 every book has 6+ chapters, a 6+ question quiz with four options and a why, and a unit');
 ok(await ev(()=>{ const H=G.HFQ; const words=H.BOOKS.reduce((n,b)=>n+b.sec.reduce((m,s)=>m+s.p.join(' ').split(/\s+/).length,0),0); return words>13000; }),'L3 more than 13,000 words of reading (the first 24 books grew to 8 chapters)');
 ok(await ev(()=>{ const H=G.HFQ; return H.BOOKS.every(b=>!b.fig||G.FIG.has(b.fig.f))&&H.BOOKS.every(b=>b.sec.every(s=>!s.fig||G.FIG.has(s.fig.f))); }),'L4 every figure a book asks for exists');
 /* r7: the Library and the reader are HTML now (hfq_reader.js); the same rules, checked through the new screens */
 await ev(()=>G.go('library',{back:'world'},true)); await wait(600); await shot('R6_04_library');
 ok(await ev(()=>G.sceneName==='library'&&document.querySelectorAll('#ui.on main .list .item').length===32&&document.querySelectorAll('#ui.on .shelf button').length===7),'L5 the Library lists all 32 books (and the seven-book series)');
 const top=()=>ev(()=>{ const s=G.HFQ.UI.stack(), t=s[s.length-1]; return t?{view:t.view,doc:t.args.doc,ch:t.args.ch}:null; });
 const nextCh=async()=>{ await page.locator('#ui.on .reader nav.chapnav button').filter({hasText:'Next chapter'}).click(); await wait(250); };
 await ev(()=>G.go('book',{id:'runways',back:'library'},true)); await wait(500);
 ok(await (async()=>{ const t=await top(); return t&&t.view==='read'&&t.doc==='gs:runways'&&t.ch===0&&await ev(()=>G.sceneName==='book'&&G.HFQ.readerDoc('gs:runways').chapters.length===8&&['Back','Contents and bookmarks','Text and page settings'].every(l=>!!document.querySelector('#ui.on .reader header button[aria-label="'+l+'"]'))&&!!document.querySelector('#ui.on .reader nav.chapnav')); })(),'L6a the reader opens a book on chapter 1 of 8, with BACK, CONTENTS and the chapter buttons');
 for(let k=0;k<3;k++) await nextCh();
 ok((await top()).ch===3&&await ev(()=>G.HFQ.lib.pos('runways')===3),'L6b turning pages remembers where you are');
 await ev(()=>G.go('library',{back:'world'},true)); await wait(300); await ev(()=>G.go('book',{id:'runways',back:'library'},true)); await wait(400);
 ok((await top()).ch===3,'L6c reopening the book resumes on that page');
 const xp0=await ev(()=>G.save.points);
 for(let k=0;k<4;k++) await nextCh();
 await ev(()=>{ const sc=G.HFQ.UI.scroller(); sc.scrollTop=sc.scrollHeight; sc.dispatchEvent(new Event('scroll')); }); await wait(1900);
 ok(await ev(()=>G.HFQ.lib.isRead('runways')&&!!G.save.ach.reader)&&(await ev(()=>G.save.points))===xp0+15,'L6 reading the last chapter to the end marks the book read: +15 XP (8 chapters) and the PAGE ONE badge');
 await shot('R6_05_book');
 await ev(()=>G.HFQ.lib.quiz('runways',{scene:'book',args:{id:'runways'}})); await wait(300);
 ok(await ev(()=>G.sceneName==='quiz'&&G.scene.qs.length===8&&Math.abs(G.scene.pass-7/8)<1e-9&&G.scene.qs.every(q=>q.opts[q.ok].t===G.HFQ.bookById('runways').quiz.find(x=>x.q===q.q).a[G.HFQ.bookById('runways').quiz.find(x=>x.q===q.q).ok])),'L7 the book quiz: eight questions, 7 to pass, the right answer survives the shuffle');
 const bq=await runQuiz(true);
 ok(bq&&bq.perfect&&await ev(()=>{ const r=G.HFQ.lib.rec('runways'); return r&&r.passed&&r.aced&&r.best===8; }),'L8 acing the quiz records passed + aced');
 await shot('R6_06_quiz_over');
 ok(await ev(()=>{ const H=G.HFQ; ['signs','pattern','wind','metar','clouds','fronts','vfr'].forEach(id=>H.lib.quizDone(id,7,8)); return !!G.save.ach.bookworm&&H.lib.totals().passed===8; }),'L9 eight quizzes passed earns BOOKWORM');
 ok(await ev(()=>{ const H=G.HFQ, n0=H.BOOKS.length; H.addShelves([{id:'stories',t:'STORIES',icon:'star',kind:'story'}]); H.addBooks([{id:'_t',shelf:'stories',kind:'story',by:'Test',t:'A TEST STORY',sub:'',sec:[{h:'ONE',p:['Once.']},{h:'TWO',p:['Twice.']}]}]); H.extendBook('_t',[{h:'THREE',p:['Thrice.']}]); const b=H.bookById('_t'); const ok=H.BOOKS.length===n0+1&&b.sec.length===3&&!H.lib.quizzable(b)&&H.SHELVES.some(s=>s.id==='stories'); G.go('book',{id:'_t',page:2},true); const d=H.readerDoc('gs:_t'); const ok2=d&&d.chapters.length===3&&!document.querySelector('#ui.on .endcard .btn.primary'); /* a story with no quiz: no quiz button at the end */ H.BOOKS.splice(H.BOOKS.findIndex(x=>x.id==='_t'),1); H.SHELVES.splice(H.SHELVES.findIndex(x=>x.id==='stories'),1); return ok&&ok2; }),'L10 the Library scales: addShelves / addBooks / extendBook from any file; a story shelf has chapters and no quiz');
 ok(await ev(()=>new Promise(res=>{ const A=G.ART; if(!A||!A.ready) return res(false); const cv=document.createElement('canvas'); cv.width=8; cv.height=8; const q=cv.getContext('2d'); q.fillStyle='#f0f'; q.fillRect(0,0,8,8); A.add({'prop:_test':cv.toDataURL(),'book:_t2':{src:cv.toDataURL(),w:10,h:10}}); const im=A.img('prop:_test'); const check=()=>{ const c2=document.createElement('canvas'); c2.width=20; c2.height=20; const k=c2.getContext('2d'); const drew=A.sprite(k,'prop:_test',[2,2,12,18],10); const d=k.getImageData(7,12,1,1).data; res(drew&&A.has('book:_t2')&&!A.has('prop:nothing')&&d[0]>200&&d[2]>200); }; if(im) check(); else setTimeout(check,200); })),'L11 the painted-art slots: a manifest entry becomes an image that draws in place of the code art (a missing key falls back)');
 ok(await ev(()=>new Promise(res=>{ const A=G.ART; const cv=document.createElement('canvas'); cv.width=16; cv.height=8; const q=cv.getContext('2d'); q.fillStyle='#f0f'; q.fillRect(0,0,16,8); A.add({'room:runway:wall':cv.toDataURL()}); A.img('room:runway:wall'); G.go('world',{room:'runway'},true);
  setTimeout(()=>{ const orig=A.draw; let hit=null; A.draw=function(c,key,x,y,w,h){ const r=orig.apply(this,arguments); if(key==='room:runway:wall') hit={x,w,r}; return r; }; try{ G.scene.draw(G.ctx); }catch(e){} A.draw=orig; delete A.man['room:runway:wall']; delete A.imgs['room:runway:wall']; res(!!(hit&&hit.r&&hit.x===-200&&hit.w>G.WORLD.rooms.runway.w)); },250); })),'L12 an outdoor place takes a painted sky: room:runway:wall draws across the whole sky band');
 ok(await ev(()=>{ const H=G.HFQ; const names=['instruments','radio','weather','airports'].map(u=>H.unitGame(u).id); return names.join()==='gauges,pairs,wx,taxi'&&H.unitGame('flight').id==='paper'&&!H.unitGame('airspace')&&G.save.mod.v===H.PROFILE.SCHEMA; }),'U1 each unit practices with its own game (Gauge Reader for instruments, Phonetic Pairs for the radio, Weather Call, Taxi Maze), and the save carries a version');

 /* ---------------- THE QUIZ ENGINE + FLASHCARDS ---------------- */
 ok(await ev(()=>{ const Q=G.HFQ.Q; const mc=Q.fix(Q.fromLesson({k:'mc',q:'q',a:['right','w1','w2','w3'],why:'w',id:'x'})), tf=Q.fix(Q.fromLesson({k:'tf',q:'q',t:false,why:'w',id:'y'})), fl=Q.fix(Q.fromLesson({k:'fill',q:'the ___ is',a:['drag','lift'],why:'w',id:'z'})); return mc.opts[mc.ok].t==='right'&&tf.opts[tf.ok].t==='FALSE'&&fl.opts[fl.ok].t==='DRAG'&&Q.fromLesson({k:'tap',q:'q'})===null; }),'Q1 lesson challenges normalize: mc, true/false and fill-in; figure challenges are left out');
 ok(await ev(()=>{ const Q=G.HFQ.Q; const p=Q.unitPool('flight'); return p.length>=20&&p.some(q=>q.src==='book')&&p.every(q=>q.opts.length>=2&&q.ok>=0); }),'Q2 a unit pool mixes lesson questions and its book questions');
 await ev(()=>G.HFQ.startDrill('flight',{scene:'world'})); await wait(300);
 ok(await ev(()=>G.sceneName==='quiz'&&G.scene.timer===8&&G.scene.qs.length===10),'Q3 a drill is 10 questions with an 8-second clock');
 ok(await ev(()=>{ const s=G.scene; s.update(8.2); return !!(s.fb&&s.fb.slow&&!s.fb.ok); }),'Q4 the clock running out counts as a miss');
 await ev(()=>G.HFQ.startFlash('flight',{scene:'practice'})); await wait(300);
 ok(await ev(()=>G.sceneName==='flash'&&G.scene.cards.length>=20&&!G.scene.up),'Q5 flashcards: a deck per unit, question side first');
 await ev(()=>{ G.scene.up=true; }); await wait(400); await shot('R6_07_flashcard');
 const fx=await ev(()=>G.save.points);
 ok(await ev(()=>{ const s=G.scene; let g=0; while(!s.done&&g++<200) s.rate(true); return s.done&&s.known===s.cards.length; })&&(await ev(()=>G.save.points))===fx+5,'Q6 knowing every card completes the deck: +5 XP once');

 /* ---------------- THE FLIGHT PATH ---------------- */
 await ev(()=>G.go('path',{back:'world'},true)); await wait(500); await shot('R6_08_path');
 ok(await ev(()=>{ const s=G.scene, g=s.geo(); return g.stages.length===G.HFQ.units.length&&g.stages[0].open&&!g.stages[1].open; }),'F1 one stage per unit; unit 1 open, unit 2 locked until unit 1 is BRONZE');
 ok(await ev(()=>{ const n=G.scene.geo().stages[0].nodes.map(x=>x.k); return n[0]==='test'&&n.filter(k=>k==='lesson').length===4&&n.includes('read')&&n.includes('play')&&n.includes('drill')&&n.includes('check'); }),'F2 a stage: TEST OUT, the lessons, READ, PRACTICE, DRILL, CHECKRIDE');
 ok(await ev(()=>{ const s=G.scene, c=s.current(); return c&&c.k==='lesson'&&c.i===0; }),'F3 the current node is lesson 1');
 await ev(()=>{ const s=G.scene, st=s.geo().stages[0]; s.sheet={n:st.nodes[0],u:st.u,st}; }); await wait(300); await shot('R6_09_sheet');
 await ev(()=>{ const s=G.scene; s.open(s.sheet.n,s.sheet.u); }); await wait(300);
 ok(await ev(()=>G.sceneName==='quiz'&&G.scene.a.mode==='testout'&&G.scene.qs.length===10),'F4 TEST OUT opens a 10-question quiz');
 const to=await runQuiz(true);
 ok(to&&to.passed&&await ev(()=>{ const H=G.HFQ, T=H.tier('flight'); return T.bronze&&T.tested&&!T.silver&&H.unitOpen('parts')&&!!G.save.ach.testout; }),'F5 passing it makes unit 1 BRONZE (tested out) and opens unit 2');
 await wait(700); await tapR(await ev(()=>G.scene.overBtns().find(b=>b.id==='back'))); await wait(1200);
 ok(await ev(()=>G.sceneName==='path'&&G.scene.geo().stages[0].nodes[0].k==='lesson'),'F6 back on the Path, the TEST OUT node is gone from unit 1');
 ok(await ev(()=>{ const s=G.scene, st=s.geo().stages[0], d=st.nodes.find(n=>n.k==='drill'), c=st.nodes.find(n=>n.k==='check'); return d.open&&c.open; }),'F7 the drill and the checkride are open at BRONZE');
 await ev(()=>{ const s=G.scene, st=s.geo().stages[0]; s.open(st.nodes.find(n=>n.k==='drill'),st.u); }); await wait(300);
 const dr=await runQuiz(true);
 ok(dr&&dr.perfect&&await ev(()=>{ const T=G.HFQ.tier('flight'); return T.drill&&T.drill.gold&&!T.gold; }),'F8 a perfect drill is recorded, but GOLD still needs the checkride and the unit’s book quizzes');
 ok(await ev(()=>{ const H=G.HFQ; ['forces','wing','stall'].forEach(id=>H.lib.quizDone(id,6,6)); G.groundSchool.complete('flight',10); const T=H.tier('flight'); return T.silver&&T.booksOk&&T.gold&&T.t===3&&!!G.save.ach.gold1; }),'F9 checkride + book quizzes + perfect drill = GOLD, and the GOLD WINGS badge');
 await ev(()=>G.go('path',{back:'world'},true)); await wait(400); await shot('R6_10_path_gold');
 ok(await ev(()=>{ const s=G.scene, st=s.geo().stages[0]; return st.tier.t===3&&st.nodes.every(n=>n.done||n.k==='play'); }),'F10 the Path shows unit 1 at GOLD with every node done');
 ok(await ev(()=>{ const s=G.scene; s.sc.scroll=0; const st=s.geo().stages[1]; return st.open&&st.nodes[0].k==='test'; }),'F11 unit 2 is open with its own TEST OUT');
 ok(await ev(()=>{ G.go('route',{unit:'parts',back:'path'},true); const P=G.scene.practice(); return P.some(p=>p.name==='TEST OUT'); }),'F12 the unit page offers TEST OUT too');
 ok(await ev(()=>{ G.go('groundschool',{back:'world'},true); const I=G.scene.items(); const rows=I.filter(i=>i.tap); const locked=rows.map(r=>r.tap()).filter(a=>a.locked); const H=G.HFQ; const exp=H.units.filter(u=>!H.unitOpen(u.id)).length; return exp>=30&&locked.length>=exp-1&&locked.length<=exp; }),'F13 the Ground School board locks the units after the next open one');

 /* ---------------- THE PRACTICE HUB ---------------- */
 await ev(()=>G.go('practice',{back:'path'},true)); await wait(400); await shot('R6_11_practice');
 ok(await ev(()=>{ const I=G.scene.items().filter(i=>i.t).map(i=>i.t); return I.includes('FLIGHT TRIVIA')&&I.includes('HANGAR FLYING')&&I.includes('THE LIBRARY')&&I.filter(t=>t==='HOW AIRPLANES FLY').length===2&&I.filter(t=>t==='PARTS OF AN AIRPLANE').length===2; }),'H1 the hub lists trivia, missed questions, the Library, and a flashcard deck + a drill for each open unit');
 await ev(()=>G.HFQ.startTrivia({scene:'practice'})); await wait(300);
 ok(await ev(()=>G.sceneName==='quiz'&&G.scene.timer===10&&G.scene.qs.length===10&&new Set(G.scene.qs.map(q=>q.unit)).size>=1),'H2 Flight Trivia: 10 timed questions from the open units');
 const tx=await ev(()=>G.save.points); const tr=await runQuiz(true);
 ok(tr&&tr.perfect&&(await ev(()=>G.save.points))===tx+15&&await ev(()=>G.HFQ.fl().trivia.best>0),'H3 a perfect round: +10 first-of-the-day, +5 perfect, a best score kept');

 /* ---------------- THE BAG + THE BAR ---------------- */
 ok(await ev(()=>{ const ids=CONFIG.cards.map(c=>c.id); return ['path','practice','library'].every(k=>ids.includes(k)); }),'B1 Flight Bag cards: FLIGHT PATH, PRACTICE HUB, THE LIBRARY');
 ok(await ev(()=>{ G.go('world',{room:'lounge'},true); const t=G.scene.tabs(G.scene.layout()); return t[0].label==='PATH'&&t[0].scene==='path'&&!t.some(x=>x.id==='tab:map'); }),'B2 PATH is the first tab on the airfield bar; the map left the bar');
 ok(await ev(()=>{ const m=G.scene.mapBtn(G.scene.layout()); return m&&m.M.scene==='map'&&m.w===36; }),'B5 the round MAP button sits in the room’s top corner');
 /* ---------------- CALL SIGNS, THE STICK, THE TUTORIAL ---------------- */
 ok(await ev(()=>{ const H=G.HFQ, set=new Set(); for(let i=0;i<40;i++) set.add(G.nameSuggest()); return H.callSigns.length>=100&&H.callSigns.every(n=>/^[A-Z]+$/.test(n)&&n.length<=12)&&[...set].every(n=>H.callSigns.includes(n))&&set.size>10; }),'N1 call signs are one fun word from a list of 100+, never the real name');
 await ev(()=>G.go('world',{room:'classroom'},true)); await wait(300);
 ok(await ev(()=>{ const s=G.scene, L=s.layout(), S=G.world.state, x0=S.px; G.ptr.sx=120; G.ptr.sy=L.roomY+200; G.ptr.x=120; G.ptr.y=G.ptr.sy; G.ptr.click=true; G.ptr.down=true; s.update(1/60); G.ptr.click=false; G.ptr.x=150; G.ptr.y=G.ptr.sy-10; for(let i=0;i<30;i++) s.update(1/60); const moved=S.px-x0; G.ptr.down=false; G.ptr.released=false; s.update(1/60); return s.joy&&moved>15&&!s.joy.on; }),'W1 press-and-drag on the floor is a thumb-stick: the cadet walks the way you drag, and stops when you let go');
 ok(await ev(()=>{ const s=G.scene, S=G.world.state, L=s.layout(); s.path=null; const st=s.P.R.stations.find(q=>q.key==='desk'); const p=s.toScreen((st.foot[0]+st.foot[2])/2,st.foot[3]-4,L); G.ptr.sx=p[0]; G.ptr.sy=p[1]; G.ptr.x=p[0]; G.ptr.y=p[1]; G.ptr.click=true; G.ptr.down=true; s.update(1/60); G.ptr.click=false; G.ptr.down=false; G.ptr.released=true; G.ptr.rx=p[0]; G.ptr.ry=p[1]; G.ptr.rsx=p[0]; G.ptr.rsy=p[1]; s.update(1/60); G.ptr.released=false; return !!(s.tgt&&s.tgt.st&&s.tgt.st.key==='desk'); }),'W2 a short tap on a thing still walks over to use it');
 ok(await ev(()=>{ const T=G.HFQ.tut; return T&&T.N===8&&T.start(true)&&T.active&&T.i===0&&T.shows('world')&&!T.shows('path'); }),'T1 the first briefing (8 steps) starts on the airfield, and can be replayed');
 ok(await ev(()=>{ const T=G.HFQ.tut, s=G.scene; s.joy={on:false,active:false,dx:0,dy:0,dist:100}; for(let i=0;i<4;i++) s.update(.2); return T.i===1; }),'T2 step 1 completes when the cadet walks with the stick');
 ok(await ev(()=>{ const T=G.HFQ.tut, s=G.scene; s.talk(s.P.R.npcs[0]); const hidden=!T.shows('world'); for(let i=0;i<4;i++) s.update(.2); s.dlg=null; return T.i===2&&hidden; }),'T3 step 2 completes by talking to the instructor (the briefing card steps aside while they talk)');
 ok(await ev(()=>{ const T=G.HFQ.tut; G.go('map',{back:'world'},true); G.go('world',{},true); for(let i=0;i<4;i++) G.scene.update(.2); return T.i===3&&T.visited.map; }),'T4 step 3 completes by opening the map pop-up');
 ok(await ev(()=>{ const T=G.HFQ.tut, tap=()=>{ const K=T.card(); G.ptr.x=K.next.x+5; G.ptr.y=K.next.y+5; G.ptr.click=true; G.scene.update(1/60); G.ptr.click=false; }; const t1=T.targets()[0], f=G.scene.fabRect(G.scene.layout()); tap(); const t2=T.targets()[0], bag=G.scene.tabs(G.scene.layout()).find(q=>q.id==='bag'); tap(); return T.i===5&&t1.x===f.x&&t2.x===bag.x; }),'T5 steps 4 and 5 spotlight the TOWER button and the FLIGHT BAG, then NEXT');
 ok(await ev(()=>{ const T=G.HFQ.tut; G.go('path',{back:'world'},true); for(let i=0;i<4;i++) G.scene.update(.2); return T.i===6&&T.shows('path'); }),'T6 step 6 completes by opening the Flight Path, where the briefing continues');
 await wait(300); await shot('R6_12_tutorial_path');
 ok(await ev(()=>{ const T=G.HFQ.tut, s=G.scene, st=s.geo().stages[0]; s.sheet={n:s.current(),u:st.u,st}; for(let i=0;i<4;i++) s.update(.2); return T.i===7; }),'T7 step 7 completes by opening a node’s sheet');
 ok(await ev(()=>{ const T=G.HFQ.tut, s=G.scene, st=s.geo().stages[0]; const keep=s.sheet; s.sheet=null; s.update(.2); const back=T.i===6; s.sheet=keep; for(let i=0;i<4;i++) s.update(.2); return back&&T.i===7; }),'T8 closing the sheet steps the briefing back; opening it again picks up');
 ok(await ev(()=>{ const T=G.HFQ.tut, s=G.scene; s.open(s.sheet.n,s.sheet.u); return !T.active&&G.save.mod.tut.done>0&&!!G.save.ach.briefed; }),'T9 starting the lesson ends the briefing: FIRST BRIEFING badge, and the cadet is in Lesson 1');
 ok(await ev(()=>CONFIG.cards.some(c=>c.id==='tutorial')&&!!G.scenes.tutorial),'T10 the Flight Bag has a TUTORIAL card to replay it');
 ok(await ev(()=>{ G.go('world',{room:'classroom'},true); const s=G.scene, L=s.layout(), u=s.useRect(L), f=s.fabRect(L), m=s.mapBtn(L), sr=s.stickRest(L); return u&&u.w===64&&f&&f.round&&m&&f.y>m.y&&sr&&sr.x<80; }),'W3 Among Us layout: resting stick bottom left, USE bottom right, MAP and TOWER round buttons top right');
 ok(await ev(()=>{ const s=G.scene, S=G.world.state, n=s.P.R.npcs[0]; S.px=n.x+15; S.py=n.y+4; const L=s.layout(), u=s.useRect(L); if(!u||!u.near||!u.near.npc) return false; G.ptr.x=u.x+20; G.ptr.y=u.y+20; G.ptr.click=true; s.update(1/60); G.ptr.click=false; const ok=!!s.dlg; s.dlg=null; return ok; }),'W4 beside the instructor the USE button lights up, and tapping it talks');
 ok(await ev(()=>{ const s=G.scene, S=G.world.state; S.px=182; S.py=262; s.path=null; s.slide=null; s.joy={on:true,active:true,ox:150,oy:400,kx:150,ky:400,dx:0,dy:0,dist:0}; G.ptr.down=true; G.ptr.x=150; G.ptr.y=370; for(let i=0;i<150;i++) s.update(1/60); G.ptr.down=false; s.update(1/60); return S.py<229; }),'W5 pushing the stick straight into a desk slides you around it (no sticking on furniture)');
 ok(await ev(()=>['reader','bookworm','librarian','testout','gold1','goldall','trivia10'].every(id=>CONFIG.badges.some(b=>b.id===id))),'B3 the new badges are defined');
 ok(await ev(()=>{ const R=G.HFQ.feedRows?G.HFQ.feedRows():[]; return R.some(r=>/tested out of/.test(r.text))&&R.some(r=>/read .* in the Library/.test(r.text)); }),'B4 the Crew Board tells the story: tested out, read a book');
 /* ---------------- 6.2: what the end-to-end playthrough turned up ---------------- */
 ok(await ev(()=>{ const H=G.HFQ, f=H.fl(), q=H.Q.unitPool('flight',{books:false})[0], wrong=()=>G.scene.cur().ok===0?1:0; delete f.miss[q.id];
   G.go('quiz',{qs:[q],timer:0,mode:'drill',ret:{scene:'world'}},true); G.scene.answer(wrong()); const missed=!!f.miss[q.id];
   G.go('quiz',{qs:[q],timer:0,mode:'drill',ret:{scene:'world'}},true); G.scene.answer(G.scene.cur().ok); const cleared=!f.miss[q.id];
   G.go('quiz',{qs:[q],timer:0,mode:'placement',ret:{scene:'world'}},true); G.scene.answer(wrong()); const notPlacement=!f.miss[q.id];
   return missed&&cleared&&notPlacement; }),'Q7 a lesson question missed in a drill lands in HANGAR FLYING and clears when answered right later; placement misses do not count');
 ok(await ev(()=>{ G.go('path',{back:'world'},true); const s=G.scene, st=s.geo().stages[1]; s.sc.scroll=300; s.open(st.nodes[0],st.u); G.go('path',{},true); return G.scene.sc.scroll===300; }),'P1 back from a node, the Flight Path stays where you were');
 ok(await ev(()=>{ G.go('path',{back:'world',jump:false},true); const s=G.scene, st=s.geo().stages[0], hOf=k=>{ s.sheet={n:st.nodes.find(n=>n.k===k),u:st.u,st}; return s.sheetRect().h; }; const hD=hOf('drill'), hR=hOf('read'), hL=hOf('lesson'); s.sheet=null; return hD<hR&&hD<hL&&hD>=132&&Math.max(hR,hL)<=240; }),'P2 a node’s sheet sizes itself to what it holds (a drill sheet is shorter than a lesson or book sheet)');
 ok(await ev(()=>{ const f=G.HFQ.fl(); f.miss={}; G.go('practice',{back:'path'},true); return true; })&&await (async()=>{ const r=await ev(()=>{ const s=G.scene, A=s.area(), I=s.items(); s.list.prep(I,A); const it=I.find(i=>i.t==='HANGAR FLYING'); return {x:A.x+10,y:A.y+it.y-s.list.sc.scroll+6,w:A.w-20,h:36}; }); await ev(()=>G.clearToasts()); await tapR(r); await wait(250); return ev(()=>G.sceneName==='practice'&&G.toasts.some(t=>/NO MISSED QUESTIONS/.test(t.msg))); })(),'H4 HANGAR FLYING with nothing to review says so, instead of opening an empty flight');
 ok(await ev(()=>{ G.go('path',{back:'world'},true); const s=G.scene, A=s.area(), n=s.current(); if(!n) return 'no node'; let st=null; for(const q of s.geo().stages) for(const m of q.nodes) if(m.k===n.k&&m.x===n.x&&m.y===n.y) st=q;
   const y=A.y+n.y-s.sc.scroll; if(st.tier.silver&&['read','play','drill'].includes(n.k)) return 'glow stuck on '+n.k; return y>A.y&&y<A.y+A.h?true:'off screen '+y; })===true,'P3 the Path opens on the glowing node; a SILVER unit’s books, game and drill (the road to GOLD) no longer hold the glow');
 ok(await ev(()=>{ const T=G.HFQ.tut; G.go('path',{back:'world',jump:false},true); const s=G.scene; s.sc.scroll=0; T.start(true); T.i=5; T.t=1; T.visited.path=true; s.update(.2); const n=s.current(), A=s.area(), y=n?A.y+n.y-s.sc.scroll:-1, good=T.i===6&&y>A.y&&y<A.y+A.h; T.skip(); return good; }),'T11 replaying the briefing, the Path scrolls to the glowing node for step 7');
 /* ---------------- 6.3: the fine tune ---------------- */
 ok(await ev(()=>{ const H=G.HFQ; H.flog.add({k:'pax',d:'2026-07-04',fr:'KMCO',to:'KBOS',ac:{t:'BOEING 737',d:'b737'},seat:'window',saw:[]}); H.flog.add({k:'dual',d:'2026-08-01',fr:'KMYR',to:'KMYR',ac:{t:'CESSNA 172 SKYHAWK',d:'c172'},min:50,ldg:2,did:[],role:'dual'}); H.simFlight({title:'LESSON: TEST',min:7,ldg:1});
   G.go('flightlog',{back:'logbook'},true); const s=G.scene, fl=s.entries(); s.book='sim'; const sim=s.entries(); const T=H.flog.totals();
   return fl.length>0&&fl.every(e=>e.k!=='sim')&&sim.length>0&&sim.every(e=>e.k==='sim')&&T.min===H.flog.all().filter(e=>e.k==='dual').reduce((a,e)=>a+e.min,0); }),'FL1 the Flight Log keeps two books: FLIGHTS has only real flights, SIM SESSIONS only sim; sim time never adds to training time');
 ok(await ev(()=>{ const s=G.scene, sim=G.HFQ.flog.all().find(e=>e.k==='sim'), real=G.HFQ.flog.all().find(e=>e.k!=='sim'); return !s.sheet(sim).del&&!!s.sheet(real).del&&s.sheet(sim).h<G.VH-100; }),'FL2 a sim session’s sheet has no REMOVE (it is a record of practice); a real flight’s does; sheets fit their content');
 ok(await ev(()=>{ G.go('flightlog',{tab:'pax'},true); const a=G.scene.book==='fl'&&G.scene.filter==='pax'; G.go('flightlog',{tab:'sim'},true); return a&&G.scene.book==='sim'; }),'FL3 the log opens on the book (and filter) asked for');
 ok(await ev(()=>{ G.go('logbook',{back:'world'},true); const s=G.scene, I=s.items(), B=G.CFG.badges.length; const tiles=I.filter(i=>i.tap&&i.h===64), grid=I.filter(i=>i.h===62); s.list.prep(I,s.area());
   const row=grid[0]; const a=row.tap(5,10,s.area().w-16); return tiles.length===1&&grid.length===Math.ceil(B/4)&&a&&a.badge===G.CFG.badges[0].id; }),'LB1 My Logbook: the two books as tiles, badges as a grid of medals (tap one for what it is)');
 ok(await ev(()=>{ const c=G.canvas.getContext('2d'); G.txt('A VERY LONG TITLE THAT DOES NOT FIT',0,0,10,'#fff','left',60,800); const px=parseFloat(c.font.split(' ')[1]); return px<13*0.99&&px>=13*0.79; }),'TX1 text too wide for its space gets smaller first (to 80%), instead of being squashed');
 ok(await ev(()=>{ const H=G.HFQ, d=G.save.mod.games.day||{}; G.save.mod.games.day={d:H.dayKey(0),xp:H.xp.gameDaily}; const r=H.gameDone('darts',99999,{}); const ok1=r.xp===0&&r.lines.some(l=>/DAILY GAME XP REACHED/.test(l[0]))&&r.lines.every(l=>l[1]===0); return ok1; }),'GX1 when the daily game XP is reached, the results say so and no line promises XP that was not given');
 ok(await ev(()=>{ const H=G.HFQ; return ['pool','darts','hockey','skee','bowling','hoops','bags','golf','pong','cargo','radar4'].every(id=>H.gamePlace(H.gameById(id))==='THE GAME ROOM'); }),'GR1 every just-for-fun game is listed in THE GAME ROOM');
 ok(await ev(()=>{ const H=G.HFQ; return H.an('AIRBUS A320')==='an'&&H.an('BOEING 737')==='a'&&H.an(8)==='an'&&H.an(6)==='a'&&H.an(11)==='an'; }),'C1 “an AIRBUS”, “a BOEING”, “an 8-question quiz”');
 await b.close();
 console.log(results.join('\n')); if(errors.length) console.log('\nERRORS:\n'+[...new Set(errors)].join('\n'));
 const f=results.filter(r=>r.startsWith('FAIL')).length; console.log('\n'+(results.length-f)+'/'+results.length+' passed'+(errors.length?', '+errors.length+' page errors':''));
 process.exit(f||errors.length?1:0);
})();
