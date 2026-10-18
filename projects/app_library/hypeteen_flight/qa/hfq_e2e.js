/* HFQ end to end: one brand-new cadet plays the whole loop by tapping, the way a kid would on a phone.
   Enroll with a fun call sign → placement (I'M NEW) → the first briefing with the real thumb-stick, USE, the MAP pop-up and the tabs
   → Lesson 1 (3 stars) → Lesson 2 with a go-around → TEST OUT → a perfect DRILL → the CHECKRIDE → the unit's three books, read
   cover to cover, and their quizzes → GOLD → the Practice Hub (trivia, flashcards, Hangar Flying) → the MAP to the Game Room, walk
   to a game with the stick, USE, play it to the end → the TOWER button (ATIS) → the Classroom bookshelf → the Library → a Flight Log
   entry → reload + sign in: everything kept, and the briefing does not start again. No page errors anywhere.
   Every move is a real touch: taps through page.touchscreen, the stick through CDP touch events. Nothing is set behind the UI's back.
   Run: cd web && python3 -m http.server 8777   then   node qa/hfq_e2e.js */
const { chromium } = require('playwright');
const fs=require('fs'), path=require('path');
const BASE=process.env.BASE_URL||'http://localhost:8777/';
const S=path.join(__dirname,'shots')+'/'; fs.mkdirSync(S,{recursive:true});
const results=[], errors=[]; const ok=(c,l)=>results.push((c?'OK   ':'FAIL ')+l);
(async()=>{
 const b=await chromium.launch();
 const ctx=await b.newContext({viewport:{width:390,height:800},deviceScaleFactor:2,hasTouch:true,isMobile:true});
 const page=await ctx.newPage();
 page.on('pageerror',e=>errors.push('PAGEERROR: '+e.message+' '+(e.stack||'').split('\n')[1]));
 page.on('console',m=>{ if(m.type()==='error'&&!/fonts\.g|ERR_|favicon/.test(m.text())) errors.push('CONSOLE: '+m.text()); });
 const wait=ms=>page.waitForTimeout(ms), ev=(f,a)=>page.evaluate(f,a), scene=()=>ev(()=>G.sceneName);
 const shot=async(n,keep)=>{ if(!keep) await ev(()=>G.clearToasts&&G.clearToasts()); await page.screenshot({path:S+n+'.png'}); };
 const V=(x,y)=>ev(([x,y])=>{ const r=G.canvas.getBoundingClientRect(); return [r.left+x*r.width/G.VW,r.top+y*r.height/G.VH]; },[x,y]);
 /* r7.4: a milestone card (tier 3) takes the tap that closes it, as it does for a cadet; so when one is up, tap it away first and then tap the target */
 const closeCel=async()=>{ if(!(await ev(()=>!!(G.HFQ.notices&&G.HFQ.notices.cel)))) return; await wait(700); const p=await V(G_VW/2,200); await page.touchscreen.tap(p[0],p[1]); await wait(450); };
 const G_VW=270;
 const tapV=async(x,y,ms)=>{ await closeCel(); const p=await V(x,y); await page.touchscreen.tap(p[0],p[1]); await wait(ms==null?150:ms); };
 const tapR=async(r,ms)=>{ if(!r) return false; await tapV(r.x+r.w/2,r.y+r.h/2,ms); return true; };
 const until=async(f,ms,a)=>{ const t0=Date.now(); while(Date.now()-t0<(ms||4000)){ if(await ev(f,a)) return true; await wait(60); } return false; };
 const cdp=await ctx.newCDPSession(page);
 const touch=(type,p)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:p?[{x:p[0],y:p[1]}]:[]});
 /* a real finger swipe (lists and the Flight Path scroll by drag) */
 const swipe=async(x,y0,y1)=>{ const a=await V(x,y0), z=await V(x,y1); await touch('touchStart',a); for(let i=1;i<=10;i++){ await touch('touchMove',[a[0],a[1]+(z[1]-a[1])*i/10]); await wait(28); } await touch('touchEnd'); await wait(140); };

 /* ---- the thumb-stick: hold the resting stick and steer along the walkable route, the way a player steers around desks ---- */
 const walk=async(target,ms)=>{ // target: {npc:id} or {st:key}
  const L=await ev(()=>{ const s=G.scene; return s.stickRest(s.layout()); }); const c0=await V(L.x,L.y);
  await touch('touchStart',c0); let got=false; const t0=Date.now();
  while(Date.now()-t0<(ms||20000)){
   const g=await ev(t=>{ const s=G.scene, S=G.world.state, R=s.P.R, nt=s.nearThing(), hitIt=nt&&((t.npc&&nt.npc&&nt.npc.id===t.npc)||(t.st&&nt.st&&nt.st.key===t.st));
    if(hitIt) return {near:true};
    const goal=t.npc?(()=>{ const p=R.npcs.find(q=>q.id===t.npc); return [p.x,p.y+6]; })():R.stations.find(q=>q.key===t.st).u;
    const wp=G.world.findPath(s.P,S.px,S.py,goal[0],goal[1])||[goal]; let a=wp[0]; if(wp.length>1&&Math.hypot(a[0]-S.px,a[1]-S.py)<6) a=wp[1];
    const dx=a[0]-S.px, dy=a[1]-S.py, d=Math.hypot(dx,dy)||1; return {dx:dx/d,dy:dy/d}; },target);
   if(g.near){ got=true; break; }
   await touch('touchMove',await V(L.x+g.dx*28,L.y+g.dy*28)); await wait(60);
  }
  await touch('touchEnd'); await wait(200); return got; };

 /* ---- the quiz scene: tap the right (or a wrong) answer, then tap to go on ---- */
 const quizOne=async right=>{ await until(()=>G.sceneName==='quiz'&&!G.scene.fb&&!G.scene.over&&!!G.scene.cur(),3000);
  const bt=await ev(r=>{ const s=G.scene, q=s.cur(), i=r?q.ok:q.opts.findIndex((o,k)=>k!==q.ok); return Object.assign({qid:q.id,src:q.src},s.btns()[i]); },right); await tapR(bt,80);
  await until(()=>G.scene.fb&&G.scene.fb.t>.55,2000); await tapV(135,150,120); return bt; };
 /* policy: nothing = all right; a function(i) -> right?; 'lesson1' = miss the first question that came from a lesson */
 const quizAll=async policy=>{ const miss=[];
  for(let i=0;i<40;i++){ await until(()=>G.sceneName!=='quiz'||G.scene.over||(!G.scene.fb&&!!G.scene.cur()),3000); if(await ev(()=>G.sceneName!=='quiz'||!!G.scene.over)) break;
   let right=true; if(typeof policy==='function') right=policy(i); else if(policy==='lesson1'&&!miss.length) right=!(await ev(()=>G.scene.cur().src==='lesson'));
   const bt=await quizOne(right); if(!right) miss.push(bt.qid); }
  await until(()=>G.scene.over&&G.scene.over.t>.55,3000); return ev(m=>{ const o=G.scene.over; return {n:o.n,right:o.right,passed:o.passed,perfect:o.perfect,head:(o.res||{}).head,mode:G.scene.a.mode,timer:G.scene.timer,miss:m}; },miss); };
 const quizBack=async()=>tapR(await ev(()=>G.scene.overBtns().find(b=>b.id==='back')),400);

 /* ---- a lesson: the briefing cards, the takeoff, every challenge by tapping ---- */
 const answer=async right=>{
  const k=await ev(()=>G.scene.cur().q.k);
  if(k==='mc'||k==='fill'||k==='tf'){ await tapR(await ev(r=>{ const it=G.scene.cur(), L=G.scene.layout(), i=it.opts.findIndex(o=>r?o.ok:!o.ok); return L.btns.find(b=>b.i===i); },right),110); }
  else if(k==='tap'){ const p=await ev(r=>{ const q=G.scene.cur().q, L=G.scene.layout(), z=r?q.z:G.FIG.zones(q.fig).map(z=>z[0]).find(id=>id!==q.z); return G.FIG.center(q.fig,z,L.fig.x+2,L.fig.y+2,L.fig.w-4,L.fig.h-4); },right); await tapV(p[0],p[1],110); }
  else if(k==='order'){ const n=await ev(()=>G.scene.cur().q.s.length);
   if(!right){ for(let j=0;j<n;j++) await tapR(await ev(()=>G.scene.layout().btns.slice(-1)[0]),110); }
   else for(let j=0;j<n;j++) await tapR(await ev(()=>{ const it=G.scene.cur(), L=G.scene.layout(), need=it.placed.length, i=it.bank.findIndex(x=>x.i===need); return L.btns.find(b=>b.i===i); }),110); }
  else if(k==='match'){ const n=await ev(()=>G.scene.cur().q.p.length);
   if(!right){ await tapR(await ev(()=>{ const it=G.scene.cur(), L=G.scene.layout(); return L.btns.find(b=>b.side==='L'&&it.left[b.i].i===0); }),110); await tapR(await ev(()=>{ const it=G.scene.cur(), L=G.scene.layout(); return L.btns.find(b=>b.side==='R'&&it.right[b.i].i===1); }),110); }
   for(let i=0;i<n;i++){ await tapR(await ev(i=>{ const it=G.scene.cur(), L=G.scene.layout(); return L.btns.find(b=>b.side==='L'&&it.left[b.i].i===i); },i),110); await tapR(await ev(i=>{ const it=G.scene.cur(), L=G.scene.layout(); return L.btns.find(b=>b.side==='R'&&it.right[b.i].i===i); },i),110); }
   return k; }
  await tapR(await ev(()=>G.scene.layout().check),110); return k; };
 const cont=async()=>{ await tapR(await ev(()=>G.scene.fb?G.scene.sheet().btn:null),130); };
 const fly=async o=>{ o=o||{}; let missed=null;
  for(let g=0;g<30&&await ev(()=>G.scene.phase==='brief');g++){ await tapR(await ev(()=>G.scene.briefBtns().find(b=>b.id==='next')),170); if(g===0&&o.shotBrief) await shot(o.shotBrief); }
  for(let g=0;g<20&&await ev(()=>G.scene.phase==='takeoff');g++){ if(g===0&&o.shotTakeoff) await shot(o.shotTakeoff); await tapV(135,300,250); }
  for(let g=0;g<90&&await ev(()=>G.scene.phase==='q');g++){
   const miss=o.miss&&!missed&&await ev(()=>!G.scene.cur().retry);
   if(g===0&&o.shotQ) await shot(o.shotQ);
   if(miss) missed=await ev(()=>({id:G.scene.cur().q.id,n:G.scene.queue.length}));
   await answer(!miss);
   if(miss&&o.onMiss){ await wait(150); await o.onMiss(missed); }
   await cont(); }
  await until(()=>G.scene.phase==='done'&&G.scene.t>.5,4000); await wait(500);
  return {res:await ev(()=>G.scene.result),missed}; };
 const lessonGo=async()=>tapR(await ev(()=>G.scene.doneBtns().find(b=>b.id==='go')),500);

 /* ---- the Flight Path: find a node, swipe it into view, tap it ---- */
 const node=async sp=>{ for(let g=0;g<14;g++){
   const r=await ev(sp=>{ const s=G.scene, A=s.area(); for(const st of s.geo().stages){ if(st.u.id!==sp.u) continue; const n=st.nodes.find(n=>n.k===sp.k&&(sp.i==null||n.i===sp.i)&&(sp.id==null||n.id===sp.id)); if(!n) return {none:1};
     const y=A.y+n.y-s.sc.scroll; return {x:n.x-11,y:y-11,w:22,h:22,vis:y>A.y+30&&y<A.y+A.h-30,dy:y-(A.y+A.h/2),Ay:A.y,Ah:A.h,open:n.open,done:n.done}; } return {none:1}; },sp);
   if(r.none) return null; if(r.vis) return r;
   const d=Math.max(-(r.Ah-80),Math.min(r.Ah-80,r.dy)), mid=r.Ay+r.Ah/2; await swipe(18,mid+d/2,mid-d/2); }
  return null; };
 const openNode=async sp=>{ const r=await node(sp); await tapR(r,300); return ev(()=>!!G.scene.sheet); };
 const sheetGo=async()=>tapR(await ev(()=>G.scene.sheetRect().btn),500);

 /* ---- a CL list (Library, Practice Hub, pickers): swipe the item into view and tap it ---- */
 const listTap=async(pick,arg)=>{ for(let g=0;g<20;g++){
   const r=await ev(([pick,arg])=>{ const s=G.scene, A=(s.area&&!s.pick)?s.area():{x:4,y:46,w:G.VW-8,h:G.VH-50}, list=s.list, I=s.pick||s.items(); list.prep(I,A);
     const it=I.find(i=>pick==='t'?i.t===arg:(pick==='act'?(i.tap&&JSON.stringify(i.tap())===arg):false)); if(!it) return {none:1};
     const y=A.y+it.y-list.sc.scroll; return {x:A.x+10,y:y+4,w:A.w-20,h:Math.min(it.h-10,40),vis:y>=A.y-1&&y+it.h<=A.y+A.h+1,dy:y+it.h/2-(A.y+A.h/2),Ay:A.y,Ah:A.h}; },[pick,arg]);
   if(r.none) return false; if(r.vis){ await tapR(r,350); return true; }
   const d=Math.max(-(r.Ah-80),Math.min(r.Ah-80,r.dy)), mid=r.Ay+r.Ah/2; await swipe(G_VW_MID,mid+d/2,mid-d/2); }
  return false; };
 const G_VW_MID=135;

 /* ======================= A. ENROLL ======================= */
 await page.goto(BASE); await page.waitForFunction(()=>document.getElementById('tapstart').style.display==='block'); await wait(500);
 await page.evaluate(()=>{ const b=document.getElementById('tapstart'); if(b&&b.offsetParent) b.click(); }); await page.waitForFunction(()=>G.sceneName==='terms'||G.sceneName==='title',null,{timeout:15000}); await page.evaluate(()=>{ if(G.sceneName==='terms'){ G.HFQ.acceptTerms('QA','lead'); G.go('title',{gateSeen:true},true); } }); await wait(600);
 ok(await scene()==='title','A1 the title screen');
 await tapR(await ev(()=>G.scene.layout().btns.find(b=>b.id==='signup')),300);
 await ev(()=>{ if(G.sceneName==='terms'){ G.HFQ.acceptTerms('QA','lead'); G.HFQ.recordPledge('QA'); G.go('signup',{termsOk:true,pledged:true},true); } }); await wait(200);   // the Terms gate itself is tested in hfq_arch_smoke
 await tapR(await ev(()=>G.scene.suggestBtn()),200); const cs1=await ev(()=>G.fieldVal('name'));
 await tapR(await ev(()=>G.scene.suggestBtn()),200); const cs=await ev(()=>G.fieldVal('name'));
 ok(/^[A-Z]+$/.test(cs1)&&/^[A-Z]+$/.test(cs)&&cs!==cs1&&await ev(n=>G.HFQ.callSigns.includes(n),cs),'A2 GIVE ME A FUN ONE: a one-word call sign, a new one each tap ('+cs1+', then '+cs+')');
 await shot('E2E_01_callsign');
 await tapR(await ev(()=>G.scene.nextBtn()),250);
 await page.locator('input.gfield').fill('2580'); await wait(300); await page.locator('input.gfield').fill('2580'); await wait(900);
 ok(await scene()==='locker'&&await ev(n=>G.activeAcct&&G.activeAcct.name===n,cs),'A3 a PIN, twice, and the cadet is enrolled as '+cs);
 await tapR(await ev(()=>G.scene.layout().btns.find(b=>b.id==='done')),700);
 ok(await scene()==='trainer','A4 the locker leads to PICK YOUR TRAINER');
 await tapR(await ev(()=>G.scene.layout().cards[0]),200); await tapR(await ev(()=>G.scene.layout().btn),900);
 ok(await scene()==='placement','A5 then one question: new, or a placement check');
 await shot('E2E_02_placement');
 const xp0=await ev(()=>G.save.points);
 await tapR(await ev(()=>G.scene.btns().find(b=>b.id==='new')),300);
 ok(await until(()=>G.sceneName==='world'&&G.world.room()==='classroom'&&G.HFQ.tut.active&&G.HFQ.tut.i===0,3000),'A6 I’M NEW lands in the Classroom and the first briefing starts by itself');

 /* ======================= B. THE FIRST BRIEFING ======================= */
 await wait(400); await shot('E2E_03_brief1');
 const sr=await ev(()=>{ const s=G.scene; return s.stickRest(s.layout()); });
 ok(!!sr&&await ev(()=>{ const s=G.scene, u=s.useRect(s.layout()); return !!u&&!u.near; }),'B1 a resting stick bottom-left, a dark USE button bottom-right');
 { const c0=await V(sr.x,sr.y); await touch('touchStart',c0); for(let i=1;i<=12;i++){ await touch('touchMove',await V(sr.x+Math.min(1,i/4)*14,sr.y-Math.min(1,i/4)*26)); await wait(55); }
  await shot('E2E_04_stick'); await touch('touchEnd'); await wait(500); }
 ok(await ev(()=>G.HFQ.tut.i===1),'B2 step 1: a drag on the stick walks the cadet, and the briefing moves on');
 const gotI=await walk({npc:'instructor'});
 ok(gotI&&await ev(()=>{ const s=G.scene; return s.useRect(s.layout()).near; }),'B3 step 2: steered to the instructor with the stick; USE lights up');
 await shot('E2E_05_use_lit');
 await tapR(await ev(()=>{ const s=G.scene; return s.useRect(s.layout()); }),500);
 ok(await ev(()=>!!G.scene.dlg),'B4 USE talks to the instructor');
 for(let i=0;i<16&&await ev(()=>!!G.scene.dlg);i++) await tapV(135,200,160);
 await wait(500);
 ok(await ev(()=>G.HFQ.tut.i===2),'B5 step 3: the MAP button is next');
 await tapR(await ev(()=>G.scene.mapBtn(G.scene.layout())),700);
 ok(await scene()==='map','B6 the round MAP button pops the airfield map up over the room');
 await shot('E2E_06_map_popup');
 await tapR(await ev(()=>G.scene.box().close),800);
 ok(await ev(()=>G.sceneName==='world'&&G.HFQ.tut.i===3),'B7 ✕ closes it, back where you stood; step 4: the TOWER button');
 await tapR(await ev(()=>G.HFQ.tut.card().next),350);
 ok(await ev(()=>G.HFQ.tut.i===4),'B8 NEXT: step 5, the FLIGHT BAG');
 await tapR(await ev(()=>G.HFQ.tut.card().next),350);
 ok(await ev(()=>G.HFQ.tut.i===5),'B9 NEXT: step 6, the PATH tab');
 await tapR(await ev(()=>G.scene.tabs(G.scene.layout()).find(t=>t.scene==='path')),1000);
 ok(await ev(()=>G.sceneName==='path'&&G.HFQ.tut.i===6),'B10 PATH opens the Flight Path; step 7: tap the glowing node');
 await shot('E2E_07_path_node');
 await tapR(await ev(()=>{ const s=G.scene, n=s.current(), A=s.area(); return {x:n.x-10,y:A.y+n.y-s.sc.scroll-10,w:20,h:20}; }),500);
 ok(await ev(()=>!!G.scene.sheet&&G.scene.sheet.n.k==='lesson'&&G.scene.sheet.n.i===0&&G.HFQ.tut.i===7),'B11 the node opens Lesson 1’s sheet; step 8: START');
 await shot('E2E_08_path_sheet');
 await sheetGo(); await wait(300);
 ok(await ev(()=>G.sceneName==='lesson'&&!G.HFQ.tut.active&&G.save.mod.tut.done>0&&!!G.save.ach.briefed),'B12 START opens Lesson 1 for real: the briefing is complete, FIRST BRIEFING badge');

 /* ======================= C. ESCORTED LEARNING: UNIT 1 ======================= */
 const r1=await fly({shotBrief:'E2E_09_lesson_brief',shotTakeoff:'E2E_10_takeoff',shotQ:'E2E_11_challenge'});
 ok(r1.res&&r1.res.kind==='lesson'&&r1.res.stars===3,'C1 Lesson 1: the briefing cards, the takeoff, every challenge by tapping: 3 stars');
 await until(()=>G.scene.t>2.6,4000); await shot('E2E_12_landing');
 const xp1=await ev(()=>G.save.points);
 ok(xp1-xp0>=20+10+15,'C2 XP so far: the briefing + the lesson + the stars (+'+(xp1-xp0)+')');
 await lessonGo();
 ok(await ev(()=>G.sceneName==='path'&&G.scene.current()&&G.scene.current().k==='lesson'&&G.scene.current().i===1),'C3 CONTINUE: back on the Flight Path, Lesson 2 glowing');
 await openNode({u:'flight',k:'lesson',i:1}); await sheetGo();
 let goaround=false;
 const r2=await fly({miss:true,onMiss:async m=>{ goaround=await ev(m=>G.scene.fb&&!G.scene.fb.ok&&G.scene.fb.again&&G.scene.queue.length===m.n+1,m); await shot('E2E_13_goaround'); }});
 ok(goaround,'C4 Lesson 2: a wrong answer shows the explanation, and the question comes back at the end (GO-AROUND)');
 ok(r2.res&&r2.res.stars===2,'C5 one miss lands with 2 stars');
 ok(await ev(id=>!!G.HFQ.fl().miss[id],r2.missed.id),'C6 the missed question is saved for HANGAR FLYING');
 await lessonGo();

 /* ======================= D. AFFIRM MY KNOWLEDGE ======================= */
 ok(await openNode({u:'flight',k:'test'})&&await ev(()=>G.scene.sheet.n.k==='test'),'D1 the TEST OUT node opens its sheet');
 await shot('E2E_14_testout_sheet');
 await sheetGo();
 ok(await ev(()=>G.sceneName==='quiz'&&G.scene.a.mode==='testout'&&G.scene.qs.length===10&&!G.scene.timer),'D2 TAKE THE TEST: 10 questions, no clock');
 await shot('E2E_15_quiz');
 const to=await quizAll();
 ok(to.passed&&to.head==='YOU KNOW THIS ONE','D3 passing it: YOU KNOW THIS ONE');
 await shot('E2E_16_testout_pass');
 await quizBack();
 ok(await ev(()=>{ const H=G.HFQ, T=H.tier('flight'), L=H.lessons.flight, f=H.fl(); return G.sceneName==='path'&&T.bronze&&T.tested&&f.l[L[2].id].tested&&f.l[L[3].id].tested&&!f.l[L[0].id].tested&&H.unitOpen(H.units[1].id); }),'D4 unit 1 is BRONZE: the two lessons left are marked tested out (the flown ones keep their stars); unit 2 opens');
 await openNode({u:'flight',k:'drill'}); await sheetGo();
 ok(await ev(()=>G.sceneName==='quiz'&&G.scene.a.mode==='drill'&&G.scene.timer===8),'D5 the DRILL: 10 questions on an 8-second clock');
 const dr=await quizAll();
 ok(dr.perfect&&dr.head==='GOLD DRILL!','D6 a perfect drill: GOLD DRILL!');
 await quizBack();
 ok(await ev(()=>{ const T=G.HFQ.tier('flight'); return T.drill&&T.drill.gold&&!T.gold; }),'D7 GOLD still needs the checkride and the unit’s books');
 ok(await openNode({u:'flight',k:'check'})&&await ev(()=>G.scene.sheet.n.open),'D8 the CHECKRIDE is open');
 await sheetGo();
 ok(await ev(()=>G.sceneName==='lesson'&&G.scene.mode==='check'),'D9 TAKE THE CHECKRIDE starts it');
 const rc=await fly();
 ok(rc.res&&rc.res.kind==='check'&&rc.res.pass,'D10 every answer right: passed');
 await until(()=>G.scene.t>2.2,4000); await shot('E2E_17_patch');
 await lessonGo();
 ok(await ev(()=>G.sceneName==='path'&&G.HFQ.tier('flight').silver&&!!G.save.ach.checkride),'D11 SILVER: the unit patch, FIRST PATCH badge');

 /* ======================= E. READ: THE UNIT'S BOOKS, THEN THEIR QUIZZES ======================= */
 const books=await ev(()=>G.HFQ.unitBooks('flight').map(b=>({id:b.id,n:b.sec.length,q:b.quiz.length})));
 ok(books.length===3,'E1 unit 1 has three books on its path ('+books.map(b=>b.id).join(', ')+')');
 /* r7: the reader is HTML (hfq_reader.js). Same rules as before, driven through real clicks on the new screen. */
 const rtop=()=>ev(()=>{ const s=G.HFQ.UI.stack(), t=s[s.length-1]; return t?{view:t.view,doc:t.args.doc,ch:t.args.ch}:null; });
 const uiClick=async(text,sel)=>{ const l=page.locator('#ui.on').locator(sel||'button').filter({hasText:text}).first(); await l.scrollIntoViewIfNeeded(); await l.click(); await wait(350); };
 for(let k=0;k<books.length;k++){ const bk=books[k];
  await openNode({u:'flight',k:'read',id:bk.id}); if(k===0) await shot('E2E_18_read_sheet');
  await sheetGo(); await wait(300);
  ok(await ev(id=>G.sceneName==='book'&&!!document.querySelector('#ui.on .reader'),bk.id)&&(await rtop()).doc==='gs:'+bk.id&&(await rtop()).ch===0,'E2.'+(k+1)+' OPEN THE BOOK: '+bk.id+', chapter 1 of '+bk.n);
  if(k===0) await shot('E2E_19_book_p1');
  for(let p=1;p<bk.n;p++) await uiClick('Next chapter','nav.chapnav button');
  ok((await rtop()).ch===bk.n-1,'E3.'+(k+1)+' NEXT through every chapter to the last one');
  // read to the bottom of the last chapter: it counts as read
  for(let g=0;g<12&&await ev(()=>{ const sc=G.HFQ.UI.scroller(); return sc.scrollTop<sc.scrollHeight-sc.clientHeight-2; });g++){ await page.mouse.move(195,500); await page.mouse.wheel(0,1400); await wait(160); }
  ok(await until(id=>G.HFQ.lib.isRead(id),3500,bk.id),'E4.'+(k+1)+' reading to the end marks it READ');
  if(k===0) await shot('E2E_20_book_end',true);
  await uiClick('Take the quiz','.endcard button'); ok(await until(()=>G.sceneName==='quiz',3000),'E5.'+(k+1)+' TAKE THE QUIZ');
  const bq=await quizAll();
  ok(bq.n===bk.q&&bq.perfect&&bq.head==='ACED IT!','E6.'+(k+1)+' the book quiz: '+bq.right+' / '+bq.n+', ACED IT!');
  if(k===0) await shot('E2E_21_book_quiz');
  await quizBack(); await wait(400);
  ok(await ev(()=>G.sceneName==='book'&&!!document.querySelector('#ui.on .reader'))&&(await rtop()).doc==='gs:'+bk.id,'E7.'+(k+1)+' back to the book, where we left it');
  await page.locator('#ui.on .reader header button[aria-label="Back"]').click(); await wait(600);
  ok(await scene()==='path','E8.'+(k+1)+' BACK returns to the Flight Path');
 }
 ok(await ev(()=>{ const T=G.HFQ.tier('flight'); return T.gold&&T.t===3&&!!G.save.ach.gold1; }),'E9 a perfect drill + the patch + all three book quizzes: unit 1 is GOLD (GOLD WINGS badge)');
 await openNode({u:'flight',k:'check'}); await tapR(await ev(()=>G.scene.sheetRect().close),300);
 await shot('E2E_22_path_gold');

 /* ======================= F. THE PRACTICE HUB ======================= */
 await tapR(await ev(()=>G.scene.bar().find(x=>x.id==='practice')),500);
 ok(await ev(()=>{ const t=G.scene.items().filter(i=>i.t).map(i=>i.t); return G.sceneName==='practice'&&t.includes('FLIGHT TRIVIA')&&t.includes('HANGAR FLYING')&&t.includes('THE LIBRARY')&&t.filter(x=>x==='HOW AIRPLANES FLY').length===2; }),'F1 the Practice Hub: trivia, Hangar Flying, the Library, flashcards + a drill per open unit');
 await shot('E2E_23_practice');
 await listTap('t','FLIGHT TRIVIA');
 ok(await ev(()=>G.sceneName==='quiz'&&G.scene.a.mode==='trivia'&&G.scene.timer===10),'F2 FLIGHT TRIVIA: 10 questions, 10 seconds each');
 const tv=await quizAll('lesson1');
 ok(tv.n===10&&tv.right===9&&tv.miss.length===1,'F3 9 of 10, one lesson question missed on purpose: '+tv.head);
 await quizBack();
 ok(await ev(()=>G.sceneName==='practice'&&G.HFQ.fl().trivia.plays===1&&G.HFQ.fl().trivia.best>0),'F4 back at the hub; the trivia best is kept');
 await listTap('act',JSON.stringify({flash:'flight'}));
 const nCards=await ev(()=>G.sceneName==='flash'?G.scene.cards.length:0);
 ok(nCards>=10,'F5 a flashcard deck: '+nCards+' cards, question side up');
 await tapR(await ev(()=>G.scene.rect()),250);
 ok(await ev(()=>G.scene.up===true),'F6 tapping the card flips it');
 await shot('E2E_24_flashcard');
 await tapR(await ev(()=>G.scene.btns().find(x=>x.id==='again')),200);
 for(let i=0;i<120&&await ev(()=>!G.scene.done);i++){ await tapR(await ev(()=>G.scene.btns().find(x=>x.id==='flip')),90); await tapR(await ev(()=>G.scene.btns().find(x=>x.id==='got')),90); }
 ok(await ev(()=>G.scene.done&&G.scene.round===2),'F7 STUDY AGAIN puts a card in round 2; GOT IT on the rest: DECK COMPLETE');
 await tapV(135,await ev(()=>G.VH-42),400);
 ok(await scene()==='practice','F8 back to the hub');
 const missed=await ev(()=>G.HFQ.totals().missed);
 ok(missed>=1&&await ev(id=>!!G.HFQ.fl().miss[id],tv.miss[0]),'F9 the question missed in trivia waits in HANGAR FLYING ('+missed+' to clear)');
 await listTap('t','HANGAR FLYING');
 ok(await ev(()=>G.sceneName==='lesson'&&G.scene.mode==='review'),'F10 HANGAR FLYING replays the missed questions');
 const rv=await fly();
 ok(rv.res&&rv.res.kind==='review'&&rv.res.cleared>=1&&await ev(([m,id])=>G.HFQ.totals().missed<m&&!G.HFQ.fl().miss[id],[missed,tv.miss[0]]),'F11 answered right: cleared ('+(rv.res&&rv.res.cleared)+')');
 await lessonGo();

 /* ======================= G. THE AIRFIELD: GAME ROOM, TOWER, CLASSROOM, LIBRARY, FLIGHT LOG ======================= */
 await tapV(30,20,500);   // BACK from the hub (or Ground School) toward the path
 if(await scene()==='groundschool') await tapV(30,20,500);
 if(await scene()!=='path') await ev(()=>G.go('path',{back:'world'}));
 await wait(400);
 await tapR(await ev(()=>G.scene.bar().find(x=>x.id==='class')),900);
 ok(await ev(()=>G.sceneName==='world'&&G.world.room()==='classroom'),'G1 CLASSROOM from the path bar walks back in');
 await wait(700);
 ok(await ev(()=>!G.HFQ.tut.active),'G2 the briefing does not start again');
 await tapR(await ev(()=>G.scene.mapBtn(G.scene.layout())),700);
 const pin=await ev(()=>{ const B=G.scene.box(), p=G.HFQ.mapPlaces.find(q=>q.room==='gameroom'), [px,py]=G.HFQ.mapProject(p.x,p.z); return {x:B.x+px*B.s-4,y:B.y+py*B.s-4,w:8,h:8}; });
 await tapR(pin,300);
 ok(await ev(()=>G.sceneName==='map'&&G.scene.sel==='gameroom'),'G3 the map: tap the GAME ROOM');
 await shot('E2E_25_map_gameroom');
 await tapR(await ev(()=>G.scene.btns().find(x=>x.id==='go')),900);
 ok(await ev(()=>G.sceneName==='world'&&G.world.room()==='gameroom'),'G4 GO THERE: in the Game Room');
 await shot('E2E_26_gameroom');
 const gotD=await walk({st:'darts'});
 ok(gotD,'G5 walked to COMPASS DARTS with the stick; USE lights up');
 await shot('E2E_27_darts_near');
 const xpG=await ev(()=>G.save.points);
 await tapR(await ev(()=>{ const s=G.scene; return s.useRect(s.layout()); }),600);
 ok(await scene()==='g_darts','G6 USE starts the game');
 // throw when the needle swings onto the tower's heading (8 throws), then tap on
 for(let n=0;n<8&&await ev(()=>G.sceneName==='g_darts'&&!G.scene.over);n++){
  for(let g=0;g<200;g++){ const d=await ev(()=>{ const s=G.scene; let d=(s.target-s.ang+360)%360; return {d,sp:s.speed}; }); if(d.d<d.sp*.09&&d.d>d.sp*.02){ break; } await wait(16); }
  await tapV(135,300,80); await until(()=>G.scene.over||(G.scene.fb&&G.scene.fb.t>.75),2000); if(await ev(()=>!G.scene.over)) await tapV(135,300,100); }
 // r7.4: when a dart scored under 100, the game offers LEARN FOR A RETRY first; this cadet says no thanks (the offer itself is tested in hfq_games_smoke)
 if(await until(()=>!!G.scene.lr||!!G.scene.over,3000)&&await ev(()=>!!G.scene.lr&&!G.scene.over)){ await wait(500); await tapR(await ev(()=>G.MG.lrLayout(G.scene).btns.find(x=>x.id==='skip')),600); }
 await until(()=>G.scene.over&&G.scene.over.t>.6,4000);
 const dg=await ev(()=>({over:!!G.scene.over,score:G.scene.score,hits:G.scene.hits.length,xp:G.save.points}));
 ok(dg.over&&dg.hits===8,'G7 eight throws by tapping, played to the results screen: '+dg.score+' points');
 ok(dg.xp>xpG,'G8 first time playing earns XP (+'+(dg.xp-xpG)+')');
 await shot('E2E_28_darts_over');
 await tapR(await ev(()=>G.MG.overBtns(G.scene).find(x=>x.id==='back')),700);
 ok(await ev(()=>G.sceneName==='world'&&G.world.room()==='gameroom'),'G9 BACK: still in the Game Room');
 await tapR(await ev(()=>G.scene.fabRect(G.scene.layout())),700);
 ok(await scene()==='radio','G10 the round TOWER button calls the tower');
 await tapR(await ev(()=>G.HFQ.drawRadioHead.__btns.find(x=>x.id==='f:atis')),400);
 ok(await until(()=>G.scene.flow&&G.scene.flow.log.some(l=>l.who.indexOf('ATIS')===0),4000),'G11 tuning ATIS plays today’s weather broadcast');
 await shot('E2E_29_radio');
 await tapV(30,20,700);
 ok(await ev(()=>G.sceneName==='world'),'G12 BACK to the airfield');
 await tapR(await ev(()=>G.scene.tabs(G.scene.layout()).find(t=>t.room==='classroom')),900);
 ok(await ev(()=>G.world.room()==='classroom'),'G13 the CLASS tab');
 const gotB=await walk({st:'library'});
 ok(gotB,'G14 walked to the bookshelf; USE lights up');
 await tapR(await ev(()=>{ const s=G.scene; return s.useRect(s.layout()); }),600);
 ok(await until(()=>G.sceneName==='library'&&document.querySelectorAll('#ui.on main .list .item').length===32,3000),'G15 USE opens the Library: all 32 books (and the seven-book series shelf)');
 await shot('E2E_30_library');
 await uiClick(await ev(()=>G.HFQ.UI.title(G.HFQ.bookById('heli').t)),'main .list .item'); await wait(300);
 ok((await rtop()).view==='bookinfo','G16 a book from another shelf (helicopters): its page');
 await uiClick('Start reading','main .btn'); await wait(400);
 const hb=await ev(()=>({id:'heli',n:G.HFQ.bookById('heli').sec.length,q:G.HFQ.bookById('heli').quiz.length}));
 ok((await rtop()).doc==='gs:heli','G17 the reader opens it');
 for(let p=1;p<hb.n;p++) await uiClick('Next chapter','nav.chapnav button');
 for(let g=0;g<12&&await ev(()=>{ const sc=G.HFQ.UI.scroller(); return sc.scrollTop<sc.scrollHeight-sc.clientHeight-2; });g++){ await page.mouse.move(195,500); await page.mouse.wheel(0,1400); await wait(160); }
 await until(id=>G.HFQ.lib.isRead(id),3500,'heli');
 await uiClick('Take the quiz','.endcard button'); await until(()=>G.sceneName==='quiz',3000);
 const hq=await quizAll(i=>i!==2);
 ok(hq.passed&&hq.right===hq.n-1,'G18 its quiz: '+hq.right+' / '+hq.n+', one missed on purpose, still passed');
 await quizBack(); await wait(400); await page.locator('#ui.on .reader header button[aria-label="Back"]').click(); await wait(500); await page.locator('#ui.on header.bar button[aria-label="Back"]').click(); await wait(500);
 ok(await ev(()=>G.sceneName==='library'&&G.HFQ.lib.passed('heli')&&G.HFQ.lib.isRead('heli')),'G19 back on the shelves: read + QUIZ PASSED');
 await page.locator('#ui.on header.bar button[aria-label="Back"]').click(); await wait(700);
 ok(await ev(()=>G.sceneName==='world'&&G.world.room()==='classroom'),'G20 BACK: in the Classroom again');
 await tapR(await ev(()=>G.scene.tabs(G.scene.layout()).find(t=>t.id==='bag')),700);
 ok(await scene()==='dash','G21 the FLIGHT BAG tab');
 await tapR(await ev(()=>G.scene.layout().find(c=>c.id==='flightlog')),600);
 ok(await scene()==='flightlog','G22 FLIGHT LOG');
 await tapR(await ev(()=>G.scene.addBtn()),500);
 await tapR(await ev(()=>{ const k=G.scene.kinds()[0]; return {x:12,y:k.y,w:G.VW-24,h:k.h}; }),400);
 await tapR(await ev(()=>G.scene.fields().ac),400);
 await listTap('t','BOEING 737');
 ok(await ev(()=>G.scene.e.ac&&G.scene.e.ac.t==='BOEING 737'),'G23 a passenger flight: the aircraft picked from the list');
 for(const [f,v] of [['fr','KMCO'],['to','KBOS']]){ await tapR(await ev(f=>G.scene.fields()[f],f),200); await page.keyboard.type(v,{delay:30}); await wait(150); }
 ok(await ev(()=>G.scene.e.fr==='KMCO'&&G.scene.e.to==='KBOS'),'G24 FROM and TO typed with the keyboard');
 await tapR(await ev(()=>G.scene.fields().next),400);
 ok(await ev(()=>G.scene.step===2),'G25 NEXT: what did you see');
 await tapR(await ev(()=>G.scene.step2().chips[1]),150); await tapR(await ev(()=>G.scene.step2().chips[4]),150);
 await shot('E2E_31_flightlog_form');
 await tapR(await ev(()=>G.scene.step2().save),700);
 ok(await ev(()=>{ const T=G.HFQ.flog.totals(); return G.sceneName==='flightlog'&&T.flights===1&&T.airports===2&&!!G.save.ach.flightlog; }),'G26 SAVE: 1 flight, 2 airports, LOGBOOK OPENED badge');

 /* ======================= H. IT IS ALL STILL THERE TOMORROW ======================= */
 const before=await ev(()=>{ const H=G.HFQ; return {xp:G.save.points,tier:H.tier('flight').t,lessons:H.totals().done,read:H.lib.totals().read,passed:H.lib.totals().passed,flights:H.flog.totals().flights,badges:Object.keys(G.save.ach).length,tut:G.save.mod.tut.done}; });
 await page.reload(); await page.waitForFunction(()=>document.getElementById('tapstart').style.display==='block'); await wait(500);
 await page.evaluate(()=>{ const b=document.getElementById('tapstart'); if(b&&b.offsetParent) b.click(); }); await page.waitForFunction(()=>G.sceneName==='terms'||G.sceneName==='title',null,{timeout:15000}); await page.evaluate(()=>{ if(G.sceneName==='terms'){ G.HFQ.acceptTerms('QA','lead'); G.go('title',{gateSeen:true},true); } }); await wait(600);
 await tapR(await ev(()=>G.scene.layout().btns.find(x=>x.id==='login')),500);
 ok(await scene()==='login','H1 after a reload: SIGN IN');
 await tapV(135,62+27,400);
 await page.locator('input.gfield').fill('2580'); await wait(900);
 ok(await ev(n=>G.sceneName==='world'&&G.activeAcct&&G.activeAcct.name===n,cs),'H2 the PIN signs '+cs+' back in, onto the airfield');
 await wait(1500);
 const after=await ev(()=>{ const H=G.HFQ; return {xp:G.save.points,tier:H.tier('flight').t,lessons:H.totals().done,read:H.lib.totals().read,passed:H.lib.totals().passed,flights:H.flog.totals().flights,badges:Object.keys(G.save.ach).length,tut:G.save.mod.tut.done,active:H.tut.active}; });
 ok(after.xp===before.xp&&after.tier===3&&after.lessons===before.lessons&&after.read===before.read&&after.passed===before.passed&&after.flights===1&&after.badges===before.badges,'H3 everything kept: '+after.xp+' XP, unit 1 GOLD, '+after.lessons+' lessons, '+after.read+' books read, '+after.passed+' quizzes passed, the flight log, '+after.badges+' badges');
 ok(after.tut===before.tut&&!after.active,'H4 the briefing does not start again');
 await shot('E2E_32_back_tomorrow');
 ok(errors.length===0,'H5 no page errors, start to finish');

 await b.close();
 console.log(results.join('\n'));
 if(errors.length) console.log('\nERRORS:\n'+errors.slice(0,20).join('\n'));
 const fails=results.filter(r=>r.startsWith('FAIL')).length;
 console.log('\n'+(results.length-fails)+' / '+results.length+' passed');
 process.exit(fails?1:0);
})();
