/* HFQ r7.4: THE ROUND'S CHANGES, PLAYED IN A REAL BROWSER (touch phone + a mouse-and-keyboard desktop).
   H  hangar: USE at the tool cart and the workbench opens their close-ups, never the Crew Chief's talk; the chief talks when he is the target
   C  controls: a finger shows the thumb-stick, a movement key hides it and walks; a mouse desktop starts without it and shows an E keycap; Escape closes a talk
   N  notices: routine XP and first-day badges share one quiet ticker line, a real badge is a tier-2 card, a milestone is tier 3, and the history keeps them
   R  learn for a retry (Paper Plane Toss): one offer per game, a right answer earns one bonus throw that can only replace the shortest, no second offer,
      a wrong answer keeps the score, questions are not repeated until all are seen
   S  Plane Spotter ID cards: one right answer counts once, the card has a second page, the Spotter's Guide shows every card, the hangar opens an ID card
   V  HELICOPTERS: the unit, its 12 lessons and figures, the book that goes with it
   L  the clue ladder: clue 1, clue 2, then the answer; SHOW ME; true/false and checkrides show the answer; HINT never gives it away; the quiz points to the card
   W  the crew: progress lines first, no repeats until every line is heard, the first meeting unchanged; the stuck card escalates and never covers a talk
   B  the Library: ground school first, the seven-book series last
   Run: cd web && python3 -m http.server 8777   then   node qa/hfq_r74_smoke.js */
const { chromium } = require('playwright');
const fs=require('fs'), path=require('path');
const drive=require('./lib/drive.js');
const BASE=process.env.BASE_URL||'http://localhost:8777/';
const S=path.join(__dirname,'shots')+'/'; fs.mkdirSync(S,{recursive:true});
const results=[], errors=[]; const ok=(c,l)=>{ results.push((c?'OK   ':'FAIL ')+l); if(process.env.VERBOSE) console.log(results[results.length-1]); };
const watch=page=>{ page.on('pageerror',e=>errors.push('PAGEERROR: '+e.message+' '+(e.stack||'').split('\n')[1])); page.on('console',m=>{ if(m.type()==='error'&&!/fonts\.g|ERR_|favicon/.test(m.text())) errors.push('CONSOLE: '+m.text()); }); };
(async()=>{
 const b=await chromium.launch();
 /* ============================ the phone ============================ */
 const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,hasTouch:true,isMobile:true});
 await ctx.addInitScript(drive.SEEDED_RANDOM);
 const page=await ctx.newPage(); watch(page);
 const D=drive(page,ctx,{base:BASE}); const {ev,wait,until}=D;
 await D.enroll('ROTOR KITE','4747'); await ev(()=>{ if(G.HFQ.tut&&G.HFQ.tut.finish) G.HFQ.tut.finish(true); G.save.mod.tut={done:1}; G.persist(); });

 /* ---------- H: the hangar ---------- */
 await ev(()=>G.go('world',{room:'hangar'},true)); await wait(700);
 for(const [key,id] of [['cart','toolcart'],['bench','workbench']]){
  await ev(()=>G.go('world',{room:'hangar'},true)); await wait(500);
  let near=await D.walk({st:key},20000); if(!near){ await ev(()=>G.go('world',{room:'hangar'},true)); await wait(500); near=await D.walk({st:key},25000); }   // one more go when the browser is starved (run_all runs suites in parallel)
  await D.use(); await wait(500);
  const h1=await ev(id=>{ const s=G.scene, S=G.world.state, n=s.nearThing&&s.nearThing(); return {ok:G.sceneName==='inspect'&&!!s.o&&s.o.id===id,scene:G.sceneName,o:s.o&&s.o.id,at:[Math.round(S.px),Math.round(S.py)],near:n?(n.st?n.st.key:n.npc?n.npc.id:'?'):null,dlg:!!s.dlg,cel:!!(G.HFQ.notices&&G.HFQ.notices.cel)}; },id);
  ok(near&&h1.ok,'H1 USE at the '+key.toUpperCase()+' opens its close-up ('+id+'), not the Crew Chief'+(near&&h1.ok?'':' (walked='+near+' '+JSON.stringify(h1)+')'));
  await ev(()=>G.go('world',{room:'hangar'},true)); await wait(400); }
 { let near=await D.walk({npc:'chief'},20000); if(!near){ await ev(()=>G.go('world',{room:'hangar'},true)); await wait(500); near=await D.walk({npc:'chief'},25000); } await D.use(); await wait(400);
  const h2=await ev(()=>{ const s=G.scene, S=G.world.state, n=s.nearThing&&s.nearThing(); return {scene:G.sceneName,dlg:!!(s.dlg&&s.dlg.npc&&s.dlg.npc.id==='chief'),at:[Math.round(S.px),Math.round(S.py)],near:n?(n.st?n.st.key:n.npc?n.npc.id:'?'):null,cel:!!(G.HFQ.notices&&G.HFQ.notices.cel)}; });
  ok(near&&h2.scene==='world'&&h2.dlg,'H2 the Crew Chief talks when he is the one in reach'+(near&&h2.dlg?'':' (walked='+near+' '+JSON.stringify(h2)+')'));
  /* C3: Escape closes the talk */
  await page.keyboard.press('Escape'); await wait(300); ok(await ev(()=>!G.scene.dlg),'C3 Escape closes a conversation'); }

 /* ---------- Z: activation zones (the brief's item 5): what is drawn is what answers ---------- */
 await ev(()=>G.go('world',{room:'hangar'},true)); await wait(500);
 ok(await ev(()=>{ const s=G.scene, R=s.P.R, st=R.stations.find(q=>q.key==='toWash'); G.V.set(R); const a=G.V.P(R.w,(st.y0+st.y1)/2); const hi=s.hitThing(a[0]-1,a[1]-50), lo=s.hitThing(a[0]-1,a[1]-2); return !!(hi&&hi.st&&hi.st.key==='toWash'&&lo&&lo.st&&lo.st.key==='toWash'); }),'Z1 a side door answers across its whole height, not only at the floor glow');
 ok(await ev(()=>{ const s=G.scene, R=s.P.R, st=R.stations.find(q=>q.key==='preflight'), b=s.footBox(st); const tip=s.hitThing(b[0]+6,(b[1]+b[3])/2), top=s.hitThing((b[0]+b[2])/2,b[1]+6); return !!(tip&&tip.st&&tip.st.key==='preflight'&&top&&top.st&&top.st.key==='preflight'&&(b[2]-b[0])>150); }),'Z2 a parked aircraft answers from wingtip to wingtip and up to its tail, not just at its wheels');
 ok(await ev(()=>{ const s=G.scene, R=s.P.R, st=R.stations.find(q=>q.key==='bench'), n=R.npcs[0], keep=[n.x,n.y]; n.x=(st.foot[0]+st.foot[2])/2; n.y=st.foot[1]-6;   // the chief steps behind the bench
   G.V.set(R); const p=G.V.P((st.foot[0]+st.foot[2])/2,st.foot[3]-2); const h=s.hitThing(p[0],p[1]-4); const q=G.V.P(n.x,n.y); const hp=s.hitThing(q[0],q[1]-30); n.x=keep[0]; n.y=keep[1];
   return !!(h&&h.st&&h.st.key==='bench'&&hp&&hp.npc); }),'Z3 a tap on a table lands on the table even with a crew member standing behind it (and a tap on his head still finds him)');
 ok(await ev(()=>{ const s=G.scene, R=s.P.R, st=R.stations.find(q=>q.key==='bench'), S=G.world.state, keep=[S.px,S.py]; S.px=st.foot[0]+4; S.py=st.foot[3]+10; const near=s.nearThing(); const far=Math.hypot(S.px-st.u[0],S.py-st.u[1]); S.px=keep[0]; S.py=keep[1]; return !!(near&&near.st&&near.st.key==='bench'&&far>40); }),'Z4 a station is in reach anywhere along its front, not only at its centre');

 /* ---------- C: controls on a touch phone ---------- */
 { const L0=await ev(()=>({mode:G.HFQ.input.cur(),stick:!!G.scene.stickRest(G.scene.layout())}));
  ok(L0.mode==='touch'&&L0.stick,'C1 on a phone the thumb-stick is shown (mode '+L0.mode+')');
  const p0=await ev(()=>[G.world.state.px,G.world.state.py]);
  await page.keyboard.down('KeyD'); await wait(500); await page.keyboard.up('KeyD'); await wait(200);
  const L1=await ev(()=>({mode:G.HFQ.input.cur(),stick:!!G.scene.stickRest(G.scene.layout()),p:[G.world.state.px,G.world.state.py]}));
  ok(L1.mode==='keys'&&!L1.stick&&Math.hypot(L1.p[0]-p0[0],L1.p[1]-p0[1])>4,'C2 a movement key walks the cadet and hides the stick (a keyboard case on a tablet)');
  await page.touchscreen.tap(195,500); await wait(200); ok(await ev(()=>G.HFQ.input.cur()==='touch'),'C2b the next touch brings the stick back'); }

 /* ---------- N: notices ---------- */
 { const r=await ev(()=>{ G.clearToasts(); G.award(20,'QA'); G.toast('+30 XP',undefined,{kind:'xp'}); G.ach('briefed');
   const t1=G.toasts.map(t=>t.meta.tier); G.ach('checkride'); const t2=G.toasts[G.toasts.length-1].meta.tier; G.toast('A NEW PHASE',undefined,{kind:'phase',tier:3}); const t3=G.toasts[G.toasts.length-1].meta.tier;
   const hist=G.HFQ.noteHistory().map(n=>n.kind); return {t1,t2,t3,hist}; });
  ok(r.t1.every(t=>t===1),'N1 XP and first-day badges are tier 1 (the quiet ticker)');
  ok(r.t2===2&&r.t3===3,'N2 a real badge is a tier-2 card, a phase is tier 3');
  ok(r.hist.indexOf('badge')>=0&&r.hist.indexOf('phase')>=0,'N3 the notice history keeps badges and phases'); await ev(()=>G.clearToasts()); }

 /* ---------- R: learn for a retry (Paper Plane Toss) ---------- */
 { const open=async()=>{ await ev(()=>{ G.go('g_paper',{back:'world'},true); }); await wait(500); await ev(()=>{ const s=G.scene; s.tipT=0; s.scores=[40,60,80]; s.dists=[40,60,80]; s.winds=[0,0,0]; s.stallN=0; s.finish(); }); await wait(400); };
  const tapId=async id=>{ const r=await ev(id=>{ const Y=G.MG.lrLayout(G.scene); const b=Y.btns.find(x=>x.id===id||(id==='right'&&x.label===G.scene.lr.q.a[0])||(id==='wrong'&&x.i!=null&&x.label!==G.scene.lr.q.a[0])); return b?{x:b.x,y:b.y,w:b.w,h:b.h}:null; },id); await D.tapR(r,350); return !!r; };
  await open(); ok(await ev(()=>G.scene.lr&&G.scene.lr.step==='offer'),'R1 three throws in: the learn-for-a-retry offer appears');
  await tapId('learn'); const q1=await ev(()=>G.scene.lr.q.id); await tapId('ask'); await tapId('right'); await wait(200);
  ok(await ev(()=>G.scene.lr&&G.scene.lr.step==='result'&&G.scene.lr.ok),'R2 a right answer earns the bonus');
  await tapId('go'); await wait(300);
  ok(await ev(()=>!G.scene.lr&&G.scene.bonus&&G.scene.bonus.i===0&&G.scene.scores.length===3),'R3 the bonus throw can only replace the shortest throw (no fourth score)');
  const second=await ev(()=>{ const s=G.scene; s.finish(); return !!s.lr; });
  ok(!second&&await ev(()=>G.HFQ.retryStats('paper').ok===1),'R4 no second offer in the same game; one earned retry is recorded');
  await open(); await tapId('learn'); const q2=await ev(()=>G.scene.lr.q.id); await tapId('ask'); await tapId('wrong'); await wait(200);
  ok(q2!==q1,'R5 the next game asks a different question');
  ok(await ev(()=>G.scene.lr&&!G.scene.lr.ok&&G.HFQ.retryStats('paper').miss===1),'R6 a wrong answer shows why and keeps the score (no bonus)');
  await tapId('done'); await wait(300); ok(await ev(()=>!G.scene.lr&&!G.scene.bonus),'R7 SEE MY SCORE ends the game normally'); }

 /* ---------- S: Plane Spotter ID cards ---------- */
 { await ev(()=>{ G.go('g_spot',{back:'world'},true); }); await wait(600);
  const id=await ev(()=>G.scene.m.id), before=await ev(id=>G.HFQ.spotCount(id),id);
  const right=await ev(()=>{ const s=G.scene, i=s.o.findIndex(m=>m.id===s.m.id), b=s.btns()[i]; return {x:b.x,y:b.y,w:b.w,h:b.h}; }); await D.tapR(right,500);
  ok(await ev(([id,b])=>G.HFQ.spotCount(id)===b+1&&G.scene.fb&&G.scene.fb.ok,[id,before]),'S1 a right answer counts the spot exactly once');
  ok(await ev(()=>G.scene.fb.page===0&&!!G.scene.card().more),'S2 the ID card opens on its first page with a MORE button');
  await wait(500); await ev(()=>G.clearToasts()); await D.tapR(await ev(()=>G.scene.card().more),500); ok(await ev(()=>G.scene.fb&&G.scene.fb.page===1),'S3 MORE turns to the second page');
  await ev(()=>G.go('spotguide',{back:'world'})); await wait(700);
  ok(await ev(()=>document.querySelectorAll('#ui.on .accard').length===G.HFQ.guideList().length&&G.HFQ.guideList().length>=62),'S4 the Spotter’s Guide shows a card for every aircraft');
  await ev(()=>G.go('fleet',{back:'world'},true)); await wait(500); await D.tapR(await ev(()=>G.scene.cardBtn()),700);
  ok(await ev(()=>G.sceneName==='idcard'&&document.querySelectorAll('#ui.on dl.facts dt').length>=6),'S5 the hangar’s ID CARD button opens the aircraft’s card'); }

 /* ---------- V: helicopters ---------- */
 { const r=await ev(()=>{ const H=G.HFQ, u=H.units.find(x=>x.id==='heli'), L=H.lessons.heli||[], figs=[];
   L.forEach(l=>{ (l.cards||[]).forEach(c=>c.fig&&figs.push(c.fig.f)); (l.qs||[]).forEach(q=>q.fig&&figs.push(q.fig.f)); });
   return {stage:u&&u.stage,open:H.unitOpen('heli'),n:L.length,practice:u&&u.practice,figsOk:figs.every(f=>G.FIG.has(f)),nf:figs.length,book:H.unitBooks('heli').map(b=>b.id)}; });
  ok(r.stage==='beyond'&&r.open&&r.n===12&&r.practice==='spot','V1 HELICOPTERS: a Beyond unit, open from day one, 12 lessons, practiced in Plane Spotter');
  ok(r.figsOk&&r.nf>=20,'V2 every helicopter figure the unit uses exists ('+r.nf+' uses)');
  ok(r.book.indexOf('heli')>=0,'V3 the Library book How Helicopters Fly goes with the unit');
  await ev(()=>G.go('route',{unit:'heli',back:'world'},true)); await wait(600); await D.shot(S+'R74_01_heli_route.png'); }

 /* ---------- L: the clue ladder ---------- */
 { const startQ=async(unit,li,kind,mode)=>{ await ev(([u,li,mode])=>{ G.go('lesson',mode==='check'?{unit:u,mode:'check',ret:{scene:'world'}}:{unit:u,lesson:li,ret:{scene:'world'}},true); },[unit,li,mode]); await wait(400);
   await ev(()=>{ G.scene.phase='q'; }); for(let g=0;g<12;g++){ if(await ev(k=>G.scene.cur().q.k===k,kind)) return true; await ev(()=>{ const s=G.scene; s.queue.push(s.queue.splice(s.qi,1)[0]); }); } return false; };
  const wrongMc=async()=>{ await D.tapR(await ev(()=>{ const it=G.scene.cur(), L=G.scene.layout(), i=it.opts.findIndex(o=>!o.ok); return L.btns.find(b=>b.i===i); }),150); await D.tapR(await ev(()=>G.scene.layout().check),300); };
  await startQ('heli',2,'mc');
  await D.tapR(await ev(()=>G.scene.hintBtn()),300);
  const h1=await ev(()=>G.scene.hint&&G.scene.hint.text), ans=await ev(()=>G.scene.cur().q.a[0]);
  await D.tapR(await ev(()=>G.scene.hintSheet().more),300); const h2=await ev(()=>G.scene.hint&&G.scene.hint.text);
  ok(/briefing card/.test(h1||'')&&!!h2&&h2!==h1&&(h1+h2).toLowerCase().indexOf(ans.toLowerCase())<0,'L1 HINT gives clue 1 (which briefing card) then clue 2, and neither names the answer');
  await D.tapR(await ev(()=>G.scene.hintSheet().btn),300);
  await wrongMc(); const f1=await ev(()=>({lvl:G.scene.fb.lvl,clue:G.scene.fb.clue,ans:G.scene.fb.ans,again:G.scene.fb.again}));
  ok(f1.lvl===1&&!!f1.clue&&!f1.ans&&f1.again,'L2 the first miss gets clue 1, not the answer, and the question comes back');
  await D.shot(S+'R74_02_clue1.png');
  await D.tapR(await ev(()=>G.scene.sheet().btn),300); await ev(()=>{ const s=G.scene; s.qi=s.queue.length-1; s.fb=null; });
  await wrongMc(); ok(await ev(()=>G.scene.fb.lvl===2&&!!G.scene.fb.clue&&!G.scene.fb.ans),'L3 the second miss gets clue 2');
  await D.tapR(await ev(()=>G.scene.sheet().more),300); ok(await ev(a=>G.scene.fb.ans===a&&!G.scene.fb.clue&&!!G.scene.fb.why,ans),'L4 SHOW ME shows the answer and its why');
  await D.tapR(await ev(()=>G.scene.sheet().btn),300); await ev(()=>{ const s=G.scene; s.qi=s.queue.length-1; s.fb=null; });
  await wrongMc(); ok(await ev(()=>G.scene.fb.lvl===3&&!!G.scene.fb.ans),'L5 after SHOW ME, another miss goes straight to the answer');
  await startQ('heli',0,'tf'); await D.tapR(await ev(()=>{ const it=G.scene.cur(), L=G.scene.layout(), i=it.opts.findIndex(o=>!o.ok); return L.btns.find(b=>b.i===i); }),150); await D.tapR(await ev(()=>G.scene.layout().check),300);
  ok(await ev(()=>G.scene.fb.lvl===3&&!!G.scene.fb.ans&&!G.scene.fb.clue),'L6 true/false (two choices) goes straight to the explanation');
  await startQ('heli',0,'mc','check'); ok(await ev(()=>!G.scene.hintBtn()),'L7 a checkride has no HINT (it is a test)');
  await wrongMc(); ok(await ev(()=>!G.scene.fb.clue&&!!G.scene.fb.ans&&!G.scene.fb.again),'L8 a checkride miss shows the answer, no clue, no go-around');
  await ev(()=>{ const qs=G.HFQ.Q.unitPool('heli').filter(q=>q.src==='lesson').slice(0,2); G.go('quiz',{title:'QA',sub:'',qs,mode:'drill',ret:{scene:'world'}}); }); await wait(500);
  await D.tapR(await ev(()=>{ const s=G.scene, q=s.cur(); const i=q.opts.findIndex((o,k)=>k!==q.ok); const bt=s.btns()[i]; return {x:bt.x,y:bt.y,w:bt.w,h:bt.h}; }),400);
  ok(await ev(()=>/^REVIEW: “.+” in “.+”$/.test(G.scene.fb.review||'')),'L9 a quiz miss points to the briefing card to review'); }

 /* ---------- W: the crew ---------- */
 { const r=await ev(()=>{ const H=G.HFQ, W=G.WORLD, n=W.rooms.classroom.npcs.find(x=>x.id==='instructor'), out=[]; for(let i=0;i<n._static.length+3;i++) out.push(H.crewLine(n)); return {out,stat:n._static,first:n.first.length}; });
  ok(/^Next at your desk: “.+”/.test(r.out[0]),'W1 the instructor’s first repeat-visit line is about YOUR next lesson');
  const statics=r.out.filter(l=>r.stat.indexOf(l)>=0); const firstRound=statics.slice(0,r.stat.length);
  ok(new Set(firstRound).size===firstRound.length&&firstRound.length===r.stat.length,'W2 the crew’s own lines all come round before any repeats ('+firstRound.length+' lines)');
  ok(r.first===5,'W3 the first meeting is unchanged (5 lines)');
  await ev(()=>G.go('world',{room:'classroom'},true)); await wait(600);
  await ev(()=>G.HFQ.crewStuck.poke(60)); await wait(400); const s1=await ev(()=>G.HFQ.crewStuck());
  ok(s1.lvl===1&&!!s1.bubble,'W4 a cadet idle in a room gets a gentle clue card: “'+(s1.bubble||'')+'”'); await D.shot(S+'R74_03_stuck.png');
  await ev(()=>{ G.HFQ.crewStuck.poke(0); }); await wait(8600); await ev(()=>G.HFQ.crewStuck.poke(60)); await wait(400); const s2=await ev(()=>G.HFQ.crewStuck());
  ok(s2.lvl===2&&/ is (to your|up|down|right next)/.test(s2.bubble||''),'W5 still stuck: a specific suggestion with a direction: “'+(s2.bubble||'')+'”');
  const near=await D.walk({npc:'instructor'},20000); await D.use(); await wait(300); await ev(()=>G.HFQ.crewStuck.poke(60)); await wait(300);
  ok(near&&await ev(()=>!!G.scene.dlg&&!G.HFQ.crewStuck().bubble),'W6 the clue card never shows during a conversation'); await D.talkThrough(); }

 /* ---------- B: the Library ---------- */
 { await ev(()=>G.go('library',{back:'world'},true)); await wait(700);
  const r=await ev(()=>({h2:[...document.querySelectorAll('#ui.on main h2')].map(e=>e.textContent),items:document.querySelectorAll('#ui.on main .list .item').length,series:document.querySelectorAll('#ui.on #lib-series .shelf button').length,last:(()=>{ const m=document.querySelector('#ui.on main'); return m&&m.lastElementChild&&m.lastElementChild.id; })()}));
  ok(/ground school/i.test(r.h2[0])&&/seven-book series/i.test(r.h2[r.h2.length-1])&&r.last==='lib-series','B1 ground school books come first, the seven-book series last');
  ok(r.items===32&&r.series===7,'B2 all 32 ground school books and all 7 novels are still there');
  await page.locator('#ui.on main .btn.ghost').first().click(); await wait(700);
  ok(await ev(()=>document.activeElement&&document.activeElement.id==='lib-series-h'),'B3 the jump link takes you (and the focus) to the series');
  /* B4: an HTML screen opened after the Hub shows itself, not the Hub's home (a host resumes its stack only when an activity comes back to it) */
  await ev(()=>G.go('hub',{},true)); await wait(600); await ev(()=>G.go('world',{room:'classroom'},true)); await wait(500);
  await ev(()=>G.go('library',{back:'world'},true)); await wait(700);
  const b4=await ev(()=>({scene:G.sceneName,h1:(document.querySelector('#ui.on h1')||{}).textContent,stack:G.HFQ.UI.stack().map(v=>v.view).join('>')}));
  ok(b4.scene==='library'&&/library/i.test(b4.h1||'')&&b4.stack==='library','B4 the Library opened after a Hub visit is the Library, not the Hub’s home ('+b4.h1+')');
  await ev(()=>G.go('spotguide',{back:'world'})); await wait(900);
  ok(await ev(()=>G.sceneName==='spotguide'&&/spotter/i.test((document.querySelector('#ui.on h1')||{}).textContent||'')),'B5 the same for the Spotter’s Guide'); }
 await ctx.close();

 /* ============================ a mouse-and-keyboard desktop ============================ */
 { const dctx=await b.newContext({viewport:{width:1440,height:900}}); const dp=await dctx.newPage(); watch(dp);
  const DD=drive(dp,dctx,{base:BASE,mouse:true});
  await DD.enroll('DESK HAWK','1357'); await DD.ev(()=>{ if(G.HFQ.tut&&G.HFQ.tut.finish) G.HFQ.tut.finish(true); G.save.mod.tut={done:1}; G.persist(); G.go('world',{room:'classroom'},true); }); await DD.wait(600);
  const r=await DD.ev(()=>({mode:G.HFQ.input.cur(),stick:!!G.scene.stickRest(G.scene.layout()),keys:G.HFQ.input.keyHints()}));
  ok(r.mode==='mouse'&&!r.stick&&r.keys&&r.keys.use==='E','C4 a mouse desktop starts without the thumb-stick and shows the E keycap on USE');
  const p0=await DD.ev(()=>[G.world.state.px,G.world.state.py]); await dp.keyboard.down('ArrowLeft'); await DD.wait(450); await dp.keyboard.up('ArrowLeft'); await DD.wait(150);
  ok(await DD.ev(p0=>G.world.state.px<p0[0]-4,p0),'C5 the arrow keys walk');
  await DD.ev(()=>G.HFQ.crewStuck.poke(60)); await DD.wait(400);
  ok(await DD.ev(()=>/E\)|USE/.test(G.HFQ.crewStuck().bubble||'')),'W7 on a keyboard the clue card names the key to press');
  await DD.shot(S+'R74_04_desktop.png');
  await dctx.close(); }

 console.log(results.join('\n')); const fails=results.filter(r=>r.startsWith('FAIL')).length;
 if(errors.length) console.log('ERRORS:\n'+errors.slice(0,8).join('\n'));
 console.log('\n'+(results.length-fails)+'/'+results.length+' passed'+(errors.length?', '+errors.length+' page errors':''));
 await b.close(); process.exit(fails||errors.length?1:0);
})().catch(e=>{ console.error(e); console.log(results.join('\n')); process.exit(1); });
