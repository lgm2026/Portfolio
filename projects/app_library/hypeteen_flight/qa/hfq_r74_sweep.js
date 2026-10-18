/* r7.4 VISUAL SWEEP: every major screen, screenshotted at phone (390x844), tablet (820x1180) and desktop (1440x900) sizes,
   for a person to look at (qa/shots/r7_4/ holds the reviewed set as WebP). It is not a pass/fail suite: it reports page errors
   and any step that landed on the Terms gate, and leaves the pictures.
   Run: node qa/run_all.js is not needed; start a server (cd web && python3 -m http.server 8777) then
        node qa/hfq_r74_sweep.js [outdir] [profiles]      e.g. node qa/hfq_r74_sweep.js qa/shots/sweep p390,t820,d1440
   BASE_URL overrides the server. Profiles: p390, p360, t820, d1440. */
const { chromium } = require('playwright');
const path=require('path'), fs=require('fs');
const ROOT=path.join(__dirname,'..'); const BASE=process.env.BASE_URL||'http://localhost:8777/'; const OUT=process.argv[2]||path.join(__dirname,'shots','sweep'); fs.mkdirSync(OUT,{recursive:true});
const PROFS=(process.argv[3]||'p390,t820,d1440').split(',');
const drive=require(path.join(ROOT,'qa/lib/drive.js'));
const ALL={p390:{vp:{width:390,height:844},touch:true},p360:{vp:{width:360,height:640},touch:true},t820:{vp:{width:820,height:1180},touch:true},d1440:{vp:{width:1440,height:900},touch:false}};
const STEPS=[
 ['world_classroom',()=>G.go('world',{room:'classroom'},true)],
 ['world_hangar',()=>G.go('world',{room:'hangar'},true)],
 ['world_lounge',()=>G.go('world',{room:'lounge'},true)],
 ['world_tower',()=>G.go('world',{room:'tower'},true)],
 ['world_platform',()=>G.go('world',{room:'platform'},true)],
 ['world_ramp',()=>G.go('world',{room:'ramp'},true)],
 ['world_runway',()=>G.go('world',{room:'runway'},true)],
 ['world_wash',()=>G.go('world',{room:'wash'},true)],
 ['world_gameroom',()=>G.go('world',{room:'gameroom'},true)],
 ['map',()=>G.go('map',{},true)],
 ['hub',()=>G.go('hub',{},true)],
 ['path',()=>G.go('path',{back:'world'},true)],
 ['groundschool',()=>G.go('groundschool',{back:'world'},true)],
 ['route_heli',()=>G.go('route',{unit:'heli',back:'world'},true)],
 ['lesson_brief',()=>G.go('lesson',{unit:'heli',lesson:5,ret:{scene:'world'}},true)],
 ['lesson_q',()=>{ G.go('lesson',{unit:'heli',lesson:0,ret:{scene:'world'}},true); setTimeout(()=>{ G.scene.phase='q'; },50); }],
 ['lesson_clue',()=>{ G.go('lesson',{unit:'heli',lesson:3,ret:{scene:'world'}},true); setTimeout(()=>{ const s=G.scene; s.phase='q'; for(let g=0;g<8&&s.cur().q.k!=='mc';g++) s.queue.push(s.queue.splice(s.qi,1)[0]); const it=s.cur(); it.sel=it.opts.findIndex(o=>!o.ok); s.check(); },60); }],
 ['quiz',()=>{ const qs=G.HFQ.Q.unitPool('heli').slice(0,4); G.go('quiz',{title:'DRILL',sub:'HELICOPTERS',qs,mode:'drill',ret:{scene:'world'}}); }],
 ['flash',()=>{ const cards=G.HFQ.Q.cards('heli'); G.go('flash',{title:'FLASHCARDS',sub:'HELICOPTERS',cards,uid:'heli',ret:{scene:'world'}}); }],
 ['practice',()=>G.go('practice',{back:'world'},true)],
 ['library',()=>G.go('library',{back:'world'},true)],
 ['reader_heli',()=>G.go('book',{id:'heli',page:6,back:'world'})],
 ['series',()=>{ G.go('library',{back:'world'},true); setTimeout(()=>G.HFQ.UI.show('series',{n:1}),200); }],
 ['record',()=>G.go('record',{back:'world'},true)],
 ['explorer',()=>G.go('explorer',{back:'world'},true)],
 ['games',()=>G.go('games',{back:'world'},true)],
 ['g_paper',()=>G.go('g_paper',{back:'world'},true)],
 ['g_spot',()=>G.go('g_spot',{back:'world'},true)],
 ['g_landing',()=>G.go('g_landing',{back:'world'},true)],
 ['fleet',()=>G.go('fleet',{back:'world'},true)],
 ['spotguide',()=>G.go('spotguide',{back:'world'})],
 ['idcard_uh60',()=>G.go('idcard',{id:'uh60',back:'world'})],
 ['inspect',()=>G.go('inspect',{id:'toolcart',back:'world'},true)],
 ['radio',()=>G.go('radio',{back:'world'},true)],
 ['logbook',()=>G.go('logbook',{back:'world'},true)],
 ['locker',()=>G.go('locker',{back:'world'},true)],
 ['crew',()=>G.go('crew',{back:'world'},true)],
 ['prefs',()=>G.go('prefs',{back:'world'})],
 ['stuck_card',()=>{ G.go('world',{room:'tower'},true); setTimeout(()=>G.HFQ.crewStuck.poke(60),300); }]
];
(async()=>{
 const b=await chromium.launch();
 for(const id of PROFS){ const prof=ALL[id];
  const ctx=await b.newContext({viewport:prof.vp,deviceScaleFactor:1,hasTouch:prof.touch,isMobile:id.startsWith('p')});
  const page=await ctx.newPage(); const errs=[]; page.on('pageerror',e=>errs.push(e.message)); page.on('console',m=>{ if(m.type()==='error'&&!/favicon|ERR_/.test(m.text())) errs.push(m.text()); });
  const D=drive(page,ctx,{base:BASE,mouse:!prof.touch}); const ev=D.ev, wait=D.wait;
  // the gate on a fresh device, then the title
  await page.goto(BASE); await page.waitForFunction(()=>document.getElementById('tapstart').style.display==='block'); await wait(400);
  await page.screenshot({path:path.join(OUT,id+'_00_boot.png')});
  await page.evaluate(()=>{ const b=document.getElementById('tapstart'); if(b&&b.offsetParent) b.click(); }); await wait(700);
  await page.screenshot({path:path.join(OUT,id+'_01_title.png')});
  await ev(()=>{ const B=G.scene.layout().btns.find(b=>b.id==='guest'); if(B) G.go('terms',{kind:'guardian',next:'world',guest:true},true); }); await wait(700);
  await page.screenshot({path:path.join(OUT,id+'_02_terms.png')});
  await D.enroll('SWEEP '+id.toUpperCase(),'2580'); await ev(()=>{ if(G.HFQ.tut&&G.HFQ.tut.finish) G.HFQ.tut.finish(true); G.save.mod.tut={done:1}; G.persist(); });
  let n=3;
  for(const [name,fn] of STEPS){ try{ await ev(fn); }catch(e){ errs.push(name+': '+e.message); } await wait(name==='stuck_card'?900:750); await ev(()=>G.clearToasts&&G.clearToasts()); await wait(120);
   await page.screenshot({path:path.join(OUT,id+'_'+String(n++).padStart(2,'0')+'_'+name+'.png')});
   const sc=await ev(()=>G.sceneName); if(sc==='terms') errs.push(name+': landed on the Terms gate'); }
  console.log(id,'screens',n,'errors',errs.length?errs.join(' | '):'none');
  await ctx.close(); }
 await b.close();
})();
