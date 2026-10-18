/* HFQ Round 2: the Ground School learning game (Flight Lessons).
   Plays the real UI by tapping: the route, a briefing, every challenge type, a wrong answer (GO-AROUND), the landing
   scorecard, the checkride + patch, HANGAR FLYING review, FLIGHT DAYS + the daily plan. Then auto-flies all 512 lessons
   on a small phone screen to catch layout overflow and runtime errors.
   Run: cd web && python3 -m http.server 8777   then   node qa/hfq_lessons_smoke.js */
const { chromium } = require('playwright');
const fs=require('fs'), path=require('path');
const BASE=process.env.BASE_URL||'http://localhost:8777/';
const S=path.join(__dirname,'shots')+'/'; fs.mkdirSync(S,{recursive:true});
const results=[], errors=[]; const ok=(c,l)=>results.push((c?'OK   ':'FAIL ')+l);

async function session(b,vw,vh){
 const ctx=await b.newContext({viewport:{width:vw,height:vh},deviceScaleFactor:2,hasTouch:true,isMobile:true});
 const page=await ctx.newPage();
 page.on('pageerror',e=>errors.push('PAGEERROR: '+e.message+' '+(e.stack||'').split('\n')[1]));
 page.on('console',m=>{ if(m.type()==='error'&&!/fonts\.g|ERR_|favicon/.test(m.text())) errors.push('CONSOLE: '+m.text()); });
 const T={page};
 T.wait=ms=>page.waitForTimeout(ms); T.ev=(f,a)=>page.evaluate(f,a); T.shot=n=>page.screenshot({path:S+n+'.png'});
 const V=(x,y)=>T.ev(([x,y])=>{ const r=G.canvas.getBoundingClientRect(); return [r.left+x*r.width/G.VW,r.top+y*r.height/G.VH]; },[x,y]);
 /* r7.4: a milestone card (tier 3) takes the tap that closes it, as it does for a cadet; when one is up, tap it away first */
 T.closeCel=async()=>{ if(!(await T.ev(()=>!!(G.HFQ.notices&&G.HFQ.notices.cel)))) return; await T.wait(700); const [cx,cy]=await V(135,200); await page.touchscreen.tap(cx,cy); await T.wait(450); };
 T.tapV=async(x,y,ms)=>{ await T.closeCel(); const [cx,cy]=await V(x,y); await page.touchscreen.tap(cx,cy); await T.wait(ms==null?110:ms); };
 T.tapR=async(r,ms)=>{ if(!r) return false; await T.tapV(r.x+r.w/2,r.y+r.h/2,ms); return true; };
 T.enroll=async name=>{
  await page.goto(BASE); await page.waitForFunction(()=>document.getElementById('tapstart').style.display==='block');
  await T.wait(500); await page.evaluate(()=>{ const b=document.getElementById('tapstart'); if(b&&b.offsetParent) b.click(); }); await page.waitForFunction(()=>G.sceneName==='terms'||G.sceneName==='title',null,{timeout:15000}); await page.evaluate(()=>{ if(G.sceneName==='terms'){ G.HFQ.acceptTerms('QA','lead'); G.go('title',{gateSeen:true},true); } }); await T.wait(500);
  await T.tapR(await T.ev(()=>G.scene.layout().btns.find(b=>b.id==='signup'))); await T.wait(300);
  await T.ev(()=>{ if(G.sceneName==='terms'){ G.HFQ.acceptTerms('QA','lead'); G.HFQ.recordPledge('QA'); G.go('signup',{termsOk:true,pledged:true},true); } }); await T.wait(200);
  await page.locator('input.gfield').fill(name); await T.tapR(await T.ev(()=>G.scene.nextBtn())); await T.wait(200);
  await page.locator('input.gfield').fill('2468'); await T.wait(300); await page.locator('input.gfield').fill('2468'); await T.wait(900);
  await T.tapR(await T.ev(()=>G.scene.layout().btns.find(b=>b.id==='done'))); await T.wait(600);
  await T.tapR(await T.ev(()=>G.scene.layout().btn)); await T.wait(700);   // PICK YOUR TRAINER
  await T.tapR(await T.ev(()=>G.scene.btns?G.scene.btns().find(b=>b.id==='new'):null)); await T.wait(700); await T.ev(()=>{ G.save.mod.tut={done:1,step:0}; if(G.HFQ.tut) G.HFQ.tut.active=false; G.persist(); });   // the placement screen: start at the beginning
 };
 /* answer the current challenge by tapping. right=false picks a wrong answer where the kind allows it. Returns the kind. */
 T.answer=async(right,ms)=>{
  const k=await T.ev(()=>G.scene.cur().q.k);
  if(k==='mc'||k==='fill'||k==='tf'){
   await T.tapR(await T.ev(r=>{ const it=G.scene.cur(), L=G.scene.layout(), i=it.opts.findIndex(o=>r?o.ok:!o.ok); return L.btns.find(b=>b.i===i); },right),ms);
  } else if(k==='tap'){
   const p=await T.ev(r=>{ const q=G.scene.cur().q, L=G.scene.layout(), z=r?q.z:G.FIG.zones(q.fig).map(z=>z[0]).find(id=>id!==q.z); return G.FIG.center(q.fig,z,L.fig.x+2,L.fig.y+2,L.fig.w-4,L.fig.h-4); },right);
   await T.tapV(p[0],p[1],ms);
  } else if(k==='order'){
   const n=await T.ev(()=>G.scene.cur().q.s.length);
   if(!right){ for(let j=0;j<n;j++) await T.tapR(await T.ev(()=>G.scene.layout().btns.slice(-1)[0]),ms); }   // shuffled bank order, last first: wrong (the shuffle is never already sorted)
   else for(let j=0;j<n;j++) await T.tapR(await T.ev(()=>{ const it=G.scene.cur(), L=G.scene.layout(), need=it.placed.length, i=it.bank.findIndex(x=>x.i===need); return L.btns.find(b=>b.i===i); }),ms);
  } else if(k==='match'){
   const n=await T.ev(()=>G.scene.cur().q.p.length);
   if(!right){ await T.tapR(await T.ev(()=>{ const it=G.scene.cur(), L=G.scene.layout(); return L.btns.find(b=>b.side==='L'&&it.left[b.i].i===0); }),ms);
    await T.tapR(await T.ev(()=>{ const it=G.scene.cur(), L=G.scene.layout(); return L.btns.find(b=>b.side==='R'&&it.right[b.i].i===1); }),ms); }
   for(let i=0;i<n;i++){
    await T.tapR(await T.ev(i=>{ const it=G.scene.cur(), L=G.scene.layout(); return L.btns.find(b=>b.side==='L'&&it.left[b.i].i===i); },i),ms);
    await T.tapR(await T.ev(i=>{ const it=G.scene.cur(), L=G.scene.layout(); return L.btns.find(b=>b.side==='R'&&it.right[b.i].i===i); },i),ms);
   }
   return k;   // match checks itself when the last pair lands
  }
  await T.tapR(await T.ev(()=>G.scene.layout().check),ms);
  return k;
 };
 T.cont=async ms=>{ await T.tapR(await T.ev(()=>G.scene.fb?G.scene.sheet().btn:null),ms); };
 T.flyAll=async(ms)=>{ await T.ev(()=>{ if(G.scene.phase==='takeoff') G.scene.phase='q'; }); for(let g=0;g<80&&await T.ev(()=>G.scene.phase==='q');g++){ await T.answer(true,ms); await T.cont(ms); } };
 return T;
}

(async()=>{
 const b=await chromium.launch();
 /* ===================== part 1: a cadet plays it, on a regular phone ===================== */
 const T=await session(b,390,800), {ev,wait,shot,tapR,tapV}=T;
 await T.enroll('ROCKET WREN');
 const xp0=await ev(()=>G.save.points);
 ok(await ev(()=>G.HFQ.units.every(u=>G.groundSchool.status(u.id)==='ready')),'L1 all Ground School units have lessons registered');
 ok(await ev(()=>G.HFQ.allLessons().length===512&&Object.keys(G.HFQ.qIndex).length>=3000),'L2 512 lessons, 3000+ challenges loaded');
 await ev(()=>G.go('groundschool',{back:'world'},true)); await wait(400); await shot('L01_groundschool');
 // open unit 1 with a real tap on its row
 const row=await ev(()=>{ const s=G.scene, A=s.area(), I=s.items(); s.list.prep(I,A); const it=I.find(i=>i.tap&&i.tap()&&i.tap().unit==='flight'); return it?{x:A.x+8,y:A.y+it.y-s.list.sc.scroll,w:A.w-16,h:it.h-6}:null; });
 await tapR(row); await wait(600);
 ok(await ev(()=>G.sceneName==='route'&&G.scene.uid==='flight'),'L3 tapping a unit opens its route');
 await shot('L02_route');
 ok(await ev(()=>{ const s=G.scene; return s.state(0).open&&!s.state(1).open&&!s.state(4).open; }),'L4 only lesson 1 is open; the checkride is locked');
 // locked waypoint: buzz + toast, no sheet
 await tapR(await ev(()=>{ const n=G.scene.geo().nodes[2]; return {x:n.x-4,y:n.y-4,w:8,h:8}; })); await wait(200);
 ok(await ev(()=>G.scene.sheet==null),'L5 a locked waypoint does not open');
 await tapR(await ev(()=>{ const n=G.scene.geo().nodes[0]; return {x:n.x-4,y:n.y-4,w:8,h:8}; })); await wait(250);
 ok(await ev(()=>G.scene.sheet===0),'L6 tapping waypoint 1 opens its lesson sheet');
 await shot('L03_route_sheet');
 await tapR(await ev(()=>G.scene.sheetRect().btn)); await wait(500);
 ok(await ev(()=>G.sceneName==='lesson'&&G.scene.phase==='brief'&&G.scene.card===0),'L7 START LESSON opens the preflight briefing');
 await shot('L04_brief');
 const nCards=await ev(()=>G.scene.L.cards.length);
 for(let i=0;i<nCards-1;i++){ await tapR(await ev(()=>G.scene.briefBtns().find(b=>b.id==='next'))); await wait(150); }
 await shot('L05_brief_tip');
 await tapR(await ev(()=>G.scene.briefBtns().find(b=>b.id==='next'))); await wait(500);
 ok(await ev(()=>G.scene.phase==='takeoff'),'L8a LET’S FLY rolls down the runway: CLEARED FOR TAKEOFF');
 await shot('L05b_takeoff');
 await tapV(135,300); await wait(250);
 ok(await ev(()=>G.scene.phase==='q'),'L8 a tap skips the takeoff and the challenges start');
 // fly lesson 1 perfectly, screenshotting the first challenge and one "right" sheet
 let first=true;
 for(let g=0;g<40&&await ev(()=>G.scene.phase==='q');g++){
  if(first){ await shot('L06_challenge'); }
  await T.answer(true);
  if(first){ await wait(150); await shot('L07_right'); first=false; }
  await T.cont();
 }
 await wait(2600); await shot('L08_landing_3stars');
 const r1=await ev(()=>({res:G.scene.result,rec:G.HFQ.fl().l['fl-forces']||G.HFQ.fl().l[G.HFQ.lessons.flight[0].id],xp:G.save.points}));
 ok(r1.res&&r1.res.kind==='lesson'&&r1.res.stars===3&&r1.rec&&r1.rec.stars===3,'L9 a perfect lesson lands with 3 stars and saves them');
 ok(r1.xp-xp0>=10+15,'L10 lesson XP is awarded (lesson + stars: +'+(r1.xp-xp0)+')');
 ok(await ev(()=>!!G.save.ach.firstflight&&!!G.save.ach.perfect),'L11 FIRST LESSON + PERFECT LANDING badges');
 ok(await ev(()=>G.HFQ.streak()===1&&G.HFQ.today().n===1),'L12 FLIGHT DAYS starts at 1; today’s plan 1 / 2');
 await tapR(await ev(()=>G.scene.doneBtns().find(b=>b.id==='go'))); await wait(500);
 ok(await ev(()=>G.sceneName==='route'&&G.scene.state(1).open&&G.scene.state(0).done),'L13 CONTINUE returns to the route with lesson 2 unlocked');
 // lesson 2: miss the first challenge -> GO-AROUND
 await tapR(await ev(()=>{ const n=G.scene.geo().nodes[1]; return {x:n.x-4,y:n.y-4,w:8,h:8}; })); await wait(250);
 await tapR(await ev(()=>G.scene.sheetRect().btn)); await wait(400);
 await ev(()=>{ G.scene.phase='q'; }); await wait(100);
 const q0=await ev(()=>({n:G.scene.queue.length,id:G.scene.cur().q.id,k:G.scene.cur().q.k}));
 await T.answer(false); await wait(200);
 ok(await ev(()=>G.scene.fb&&!G.scene.fb.ok&&G.scene.fb.again),'L14 a wrong answer shows NOT QUITE with the explanation');
 await shot('L09_wrong_goaround');
 ok(await ev(n=>G.scene.queue.length===n+1,q0.n),'L15 the missed challenge comes back at the end (GO-AROUND)');
 ok(await ev(id=>!!G.HFQ.fl().miss[id],q0.id),'L16 the miss is saved for HANGAR FLYING');
 await T.cont();
 // screenshot the go-around kicker when it comes back
 for(let g=0;g<40&&await ev(()=>G.scene.phase==='q');g++){
  if(await ev(()=>!!G.scene.cur().retry)) await shot('L10_goaround_kicker');
  await T.answer(true); await T.cont();
 }
 await wait(2600);
 const r2=await ev(()=>G.scene.result);
 ok(r2.stars===2,'L17 one miss lands with 2 stars');
 ok(r2.lines.some(l=>l[0]==='DAILY FLIGHT PLAN'),'L18 second lesson of the day completes the DAILY FLIGHT PLAN bonus');
 await shot('L11_landing_2stars');
 // finish the rest of unit 1 by flying it, then the checkride
 for(let li=2;li<4;li++){ await ev(li=>G.go('lesson',{unit:'flight',lesson:li,ret:{scene:'route',args:{unit:'flight'}}},true),li); await wait(300); await ev(()=>{ G.scene.phase='q'; }); await T.flyAll(); await wait(300); }
 await ev(()=>G.go('route',{unit:'flight'},true)); await wait(400);
 ok(await ev(()=>G.scene.state(4).open&&G.HFQ.unitProg('flight').all),'L19 finishing every lesson unlocks the checkride');
 await shot('L12_route_checkride_ready');
 await tapR(await ev(()=>{ const n=G.scene.geo().nodes[4]; return {x:n.x-4,y:n.y-4,w:8,h:8}; })); await wait(250);
 await tapR(await ev(()=>G.scene.sheetRect().btn)); await wait(400);
 ok(await ev(()=>G.scene.mode==='check'&&G.scene.total===G.HFQ.checkN),'L20 the checkride has '+10+' challenges from the whole unit');
 await shot('L13_checkride_q');
 const xpC=await ev(()=>G.save.points);
 await T.flyAll(); await wait(2600);
 const rc=await ev(()=>({r:G.scene.result,done:(G.save.mod.gs.done||{}).flight,xp:G.save.points}));
 ok(rc.r.pass&&rc.done&&rc.xp-xpC>=100,'L21 passing the checkride earns the patch + 100 XP through G.groundSchool.complete');
 ok(await ev(()=>!!G.save.ach.checkride),'L22 FIRST PATCH badge');
 await shot('L14_checkride_patch');
 // a failed checkride: no retry inside the checkride, 'NOT YET'
 await ev(()=>G.go('lesson',{unit:'parts',mode:'check',ret:{scene:'groundschool'}},true)); await wait(300);
 await ev(()=>{ G.scene.phase='q'; }); for(let g=0;g<20&&await ev(()=>G.scene.phase==='q');g++){ await T.answer(g>=6); await T.cont(); }
 await wait(2000);
 ok(await ev(()=>G.scene.result.kind==='check'&&!G.scene.result.pass&&!(G.save.mod.gs.done||{}).parts),'L23 missing 3+ on a checkride: NOT YET, no patch');
 await shot('L15_checkride_notyet');
 // HANGAR FLYING
 await ev(()=>G.go('groundschool',{back:'world'},true)); await wait(400);
 ok(await ev(()=>G.HFQ.totals().missed>=1),'L24 Ground School offers HANGAR FLYING for missed challenges');
 await shot('L16_groundschool_progress');
 await ev(()=>G.HFQ.startReview({scene:'groundschool'})); await wait(400);
 const nr=await ev(()=>G.scene.total);
 await T.flyAll(); await wait(1800);
 ok(nr>0&&await ev(()=>G.scene.result.kind==='review'&&G.scene.result.cleared>=1),'L25 HANGAR FLYING clears answered misses ('+nr+' reviewed)');
 await shot('L17_review_done');
 // logbook shows the patch + stars + flight days; badges list includes the new ones
 await ev(()=>G.go('logbook',{back:'world'},true)); await wait(300);
 await ev(()=>{ G.scene.list.sc.scroll=9999; }); await wait(300);
 await shot('L18_logbook_groundschool');
 ok(await ev(()=>['firstflight','perfect','tailwind','streak3','checkride','grad'].every(id=>G.CFG.badges.some(b=>b.id===id))),'L26 six new Ground School badges are in the Logbook');
 // a new day keeps FLIGHT DAYS going; skipping a day resets it
 ok(await ev(()=>{ const H=G.HFQ, real=H.clock; H.clock=()=>real()+864e5; H.tickDay(true); const a=H.streak(); H.clock=()=>real()+3*864e5; const b=H.streak(); H.clock=real; return a===2&&b===0; }),'L27 FLIGHT DAYS: +1 the next day, back to 0 after a missed day');
 // the shell's flight bag card shows lesson progress
 ok(await ev(()=>/\d+ \/ 512 LESSONS/.test(G.cardSub.gs())),'L28 the Flight Bag card shows lesson progress');
 // every challenge type, one screenshot each (unanswered, then picked)
 const kinds=['mc','tf','fill','match','order','tap'];
 for(const k of kinds){
  const spot=await ev(k=>{ for(const u of G.HFQ.units) for(const l of G.HFQ.lessons[u.id]) { const i=l.qs.findIndex(q=>q.k===k&&(k!=='mc'||q.fig)); if(i>=0) return {u:u.id,n:l.n,i}; } return null; },k);
  await ev(s=>{ G.go('lesson',{unit:s.u,lesson:s.n,ret:{scene:'groundschool'}},true); const sc=G.scene; sc.phase='q'; const it=sc.queue.splice(s.i,1)[0]; sc.queue.unshift(it); },spot); await wait(300);
  await shot('L20_type_'+k);
 }

 /* ===================== part 2: every lesson, auto-flown on a small phone (480 tall) ===================== */
 const P=await session(b,360,640);
 await P.enroll('SKY TESTER');
 const vh=await P.ev(()=>G.VH);
 const lay=[]; let flown=0;
 const all=await P.ev(()=>G.HFQ.units.map(u=>[u.id,G.HFQ.lessons[u.id].length]));
 for(const [uid,n] of all) for(let li=0;li<n;li++){
  await P.ev(([u,l])=>{ G.go('lesson',{unit:u,lesson:l,ret:{scene:'groundschool'}},true); },[uid,li]); await P.wait(60);
  // briefing cards: check the text + figure fit the panel
  const bc=await P.ev(()=>{ const s=G.scene, out=[]; s.L.cards.forEach((cd,i)=>{ const w=G.VW-20, h=G.VH-50-62, tl=G.wrap(cd.t,10.5,w-28,800).length, bl=G.wrap(cd.b,7.8,w-28,600).length; const used=30+tl*15+4+bl*12.4+8+(cd.fig?48:0)+(i===s.L.cards.length-1&&s.L.tip?Math.max(52,G.wrap(s.L.tip,7.4,w-92,800).length*11.5+26)+12:0); if(used>h) out.push(s.L.id+' card '+(i+1)+' overflows by '+Math.round(used-h)); }); return out; });
  lay.push(...bc);
  await P.ev(()=>{ G.scene.phase='q'; });
  for(let g=0;g<40&&await P.ev(()=>G.scene.phase==='q');g++){
   const bad=await P.ev(()=>{ const s=G.scene, it=s.cur(), q=it.q, L=s.layout(), lim=L.check.y-2, out=[];
    for(const bt of L.btns) if(bt.y+bt.h>lim+0.5) { out.push(q.id+' ('+q.k+') answers overflow by '+Math.round(bt.y+bt.h-lim)); break; }
    if(L.fig&&L.fig.h<56) out.push(q.id+' ('+q.k+') figure squeezed to '+Math.round(L.fig.h));
    if(L.pY+L.pH>(L.fig?L.fig.y:L.aY)+1) out.push(q.id+' prompt overlaps');
    return out; });
   lay.push(...bad);
   const qid=await P.ev(()=>G.scene.cur().q.id); await P.answer(true,25);
   if(await P.ev(()=>G.scene.fb&&!G.scene.fb.ok)) lay.push(qid+': the right answer was graded wrong (input/zone problem)');
   await P.cont(25); flown++;
  }
  if(!(await P.ev(()=>G.scene.phase==='done'))) lay.push(uid+' lesson '+li+' did not finish');
 }
 ok(flown>=3000,'L29 auto-flew every challenge in all 512 lessons ('+flown+' answered, screen '+vh+' tall)');
 ok(!lay.length,'L30 nothing overflows on a small phone'+(lay.length?':\n      '+lay.slice(0,30).join('\n      '):''));
 ok(await P.ev(()=>G.HFQ.totals().done===512&&G.HFQ.totals().stars===1536),'L31 all 512 lessons saved with 3 stars');
 await b.close();
 console.log(results.join('\n')); if(errors.length) console.log('\nERRORS:\n'+[...new Set(errors)].join('\n'));
 const f=results.filter(r=>r.startsWith('FAIL')).length; console.log('\n'+(results.length-f)+'/'+results.length+' passed'+(errors.length?', '+errors.length+' page errors':''));
 process.exit(f||errors.length?1:0);
})();
