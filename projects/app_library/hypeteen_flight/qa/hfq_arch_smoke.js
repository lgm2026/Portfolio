/* HFQ architecture smoke: the safety nets in the engine. A scene that throws must not freeze the game; a full or blocked
   save must be noticed and said once; the shipped bundle must behave like the source.
   Run: cd web && python3 -m http.server 8777   then   node qa/hfq_arch_smoke.js   (BASE_URL to override) */
const { chromium } = require('playwright');
const BASE=process.env.BASE_URL||'http://localhost:8777/';
const results=[], errors=[]; const ok=(c,l)=>results.push((c?'OK   ':'FAIL ')+l);
(async()=>{
 const b=await chromium.launch();
 const ctx=await b.newContext({viewport:{width:390,height:800},deviceScaleFactor:2,hasTouch:true,isMobile:true});
 const page=await ctx.newPage();
 page.on('pageerror',e=>errors.push('PAGEERROR: '+e.message));
 const wait=ms=>page.waitForTimeout(ms), ev=(f,a)=>page.evaluate(f,a);
 const tapV=async(x,y)=>{ const [cx,cy]=await ev(([x,y])=>{ const r=G.canvas.getBoundingClientRect(); return [r.left+x*r.width/G.VW,r.top+y*r.height/G.VH]; },[x,y]); await page.touchscreen.tap(cx,cy); };
 const tapR=async r=>{ if(!r) return false; await tapV(r.x+r.w/2,r.y+r.h/2); return true; };
 await page.goto(BASE); await page.waitForFunction(()=>document.getElementById('tapstart').style.display==='block');
 await wait(300); await page.evaluate(()=>{ const b=document.getElementById('tapstart'); if(b&&b.offsetParent) b.click(); }); await wait(500);
 await wait(400);   // r7.4.1: no button needed: a fresh device opens the adult's gate before the title
 /* ---- the join gate (r7.4: an accessible HTML screen; unticked boxes; every way in, guests too) ---- */
 const gv=()=>ev(()=>{ const st=G.HFQ.UI.stack(), b=document.querySelector('#ui.on main.gate .btn.primary'); return {scene:G.sceneName,view:(st.slice(-1)[0]||{}).view,title:(document.querySelector('#ui.on #ui-title')||{}).textContent||'',disabled:b?b.disabled:null}; });
 const scrollEnd=()=>page.locator('#ui.on .termsbox').first().evaluate(el=>{ el.scrollTop=el.scrollHeight; el.dispatchEvent(new Event('scroll')); });
 const adultAccept=async()=>{ await scrollEnd(); await page.locator('#gate-adult').check(); await page.locator('#gate-agree').check(); await wait(150); await page.locator('#ui.on main.gate .btn.primary').click(); await wait(500); };
 const pledge=async()=>{ await page.locator('#gate-pledge').check(); await wait(100); await page.locator('#ui.on main.gate .btn.primary').click(); await wait(500); };
 let g=await gv();
 ok(g.scene==='terms'&&g.view==='gate'&&/before you start/i.test(g.title)&&await page.locator('#gate-adult').count()===1,'T1 a fresh device opens the full Terms for an adult before the title (before ENROLL or VISIT AS GUEST can be tapped)');
 ok(await ev(()=>{ const t=(document.querySelector('#ui.on .termsbox')||{}).textContent||''; return t.length>8000&&/INTELLECTUAL PROPERTY/i.test(t)&&/COPPA/.test(t)&&document.querySelectorAll('#ui.on ul.plain li').length>=4&&document.querySelectorAll('#ui.on ol.pledge li').length===G.HFQ.TERMS.pledge.length; }),'T2 the privacy summary, the Cadet Pledge and the full text (IP notice + COPPA section) are shown');
 ok(g.disabled===true&&await ev(()=>!document.getElementById('gate-adult').checked&&!document.getElementById('gate-agree').checked),'T3 ACCEPT starts disabled and both boxes start unticked (no implied consent)');
 await page.locator('#gate-adult').check(); await page.locator('#gate-agree').check(); await wait(150);
 ok((await gv()).disabled===true&&await ev(()=>/scroll to the end/i.test(document.querySelector('#ui.on .status').textContent)),'T3b ticking the boxes is not enough: the text must be scrolled to its end (and the status line says so)');
 await scrollEnd(); await wait(250);
 ok((await gv()).disabled===false,'T4 scrolled to the end with both boxes ticked: ACCEPT enables');
 await page.locator('#ui.on main.gate .btn.primary').click(); await wait(500);
 ok(await ev(()=>G.sceneName==='title'&&G.roster.terms&&G.roster.terms.v===G.HFQ.TERMS.version&&G.roster.terms.hash===G.HFQ.termsHash()),'T5 accepting records version + text fingerprint on the device and shows the title');
 await tapR(await ev(()=>G.scene.layout().btns.find(b=>b.id==='signup'))); await wait(400);
 ok(await ev(()=>G.sceneName==='signup'),'T5a ENROLL then goes straight to the name field (the first profile is the Family Lead, who just accepted)');
 await page.locator('input.gfield').fill('ECHO SCOUT'); await tapR(await ev(()=>G.scene.nextBtn())); await wait(200);
 await page.locator('input.gfield').fill('5937'); await wait(300); await page.locator('input.gfield').fill('5937'); await wait(900);
 ok(await ev(()=>!!G.activeAcct&&G.activeAcct.terms&&G.activeAcct.terms.v===G.HFQ.TERMS.version&&G.activeAcct.terms.role==='lead'),'T5b the new profile carries its own acceptance record (account level: the Family Lead)');
 await tapR(await ev(()=>G.scene.layout().btns.find(b=>b.id==='done'))); await wait(500);

 /* a second cadet gets the pledge; a changed version asks the adult again at sign-in */
 await ev(()=>G.go('signup',{},true)); await wait(400);
 g=await gv();
 ok(g.scene==='terms'&&/cadet pledge/i.test(g.title)&&g.disabled===true&&await page.locator('#gate-pledge').count()===1,'T6 a second cadet on the device gets the Cadet Pledge, with an unticked box');
 await pledge();
 ok(await ev(()=>G.sceneName==='signup'&&G.roster.terms.pledges.length===1),'T7 the pledge is recorded and sign-up opens');
 await ev(()=>{ G.roster.terms.v='0.9'; G.saveRoster(); G.go('login',{},true); }); await wait(400);
 g=await gv();
 ok(g.scene==='terms'&&/before you start/i.test(g.title),'T8 a new Terms version is shown again at sign-in');
 await adultAccept();
 ok(await ev(()=>G.sceneName==='login'&&G.HFQ.termsAccepted()),'T9 re-accepting continues to sign-in');
 ok(await ev(()=>/HTFA TERMS RECEIPT/.test(G.HFQ.termsReceipt())&&(G.CFG.settingsLinks||[]).some(l=>l.id==='terms'&&G.scenes[l.scene])),'T10 a receipt exists and the Terms stay readable from SETTINGS (r7: through the HTML settings page)');
 await ev(()=>G.go('termsRead',{back:'title'})); await wait(400);
 ok(await ev(()=>G.sceneName==='termsRead'&&/Household: version/.test(document.querySelector('#ui.on .receipt').textContent)),'T10b the Terms page shows what was accepted on this device');
 /* guests: the gate covers VISIT AS GUEST too (r7.4) */
 await ev(()=>G.go('title',{},true)); await wait(400);
 await tapR(await ev(()=>G.scene.layout().btns.find(b=>b.id==='guest'))); await wait(500);
 g=await gv();
 ok(g.scene==='terms'&&/cadet pledge/i.test(g.title),'T11 VISIT AS GUEST on a device with a Family Lead opens the Cadet Pledge before the airfield');
 await pledge();
 ok(await ev(()=>G.sceneName===G.homeScene()&&!G.activeAcct&&G.save.mod.terms&&G.save.mod.terms.v===G.HFQ.TERMS.version),'T12 the guest’s pledge is kept in the guest save and the airfield opens');
 await ev(()=>{ localStorage.clear(); }); await page.reload(); await page.waitForFunction(()=>document.getElementById('tapstart').style.display==='block'); await wait(300); await page.evaluate(()=>{ const b=document.getElementById('tapstart'); if(b&&b.offsetParent) b.click(); }); await wait(500);
 await wait(400); g=await gv();
 ok(g.scene==='terms'&&/before you start/i.test(g.title)&&await page.locator('#gate-adult').count()===1&&await ev(()=>/independently gathered/i.test((document.querySelector('#ui.on .note.warn')||{}).textContent||'')),'T13 a brand-new device asks the adult before the title, with the accuracy notice first');
 await page.keyboard.press('Escape'); await wait(500);
 ok(await ev(()=>G.sceneName==='title'),'T14 Escape (or NOT NOW) leaves the gate for the title: nothing is accepted by leaving');
 await ev(()=>G.go('world',{},true)); await wait(400);
 ok(await ev(()=>G.sceneName==='terms'),'T15 there is no back door: going straight to the airfield as a guest still lands on the gate');
 await adultAccept();
 ok(await ev(()=>G.sceneName==='world'&&G.roster.guestTerms&&G.roster.guestTerms.role==='guardian'&&G.save.mod.terms&&G.save.mod.terms.kind==='guardian'),'T16 a guardian’s acceptance for guest visits is recorded on the device, with the guest’s record');
 await ev(()=>G.go(G.homeScene(),{},true)); await wait(300);
 ok(await ev(()=>Array.isArray(G.errors)&&G.badFrames===0&&G.storageOk===true),'A1 the engine tracks errors, bad frames and storage health');
 // a scene whose draw throws: the loop survives, the error is recorded, and after 30 bad frames the cadet is sent home
 await ev(()=>{ G.scenes.__boom={ enter(){}, update(){}, draw(){ throw new Error('boom test'); } }; G.go('__boom',{},true); });
 await wait(250);
 ok(await ev(()=>G.errors.some(e=>/boom test/.test(e.msg))&&G.frame>0),'A2 a throwing scene is logged, not fatal');
 await page.waitForFunction(()=>G.sceneName===G.homeScene(),null,{timeout:8000}).catch(()=>{});
 ok(await ev(()=>G.sceneName===G.homeScene()),'A3 30 bad frames in a row send the cadet home instead of freezing');
 ok(await ev(()=>{ const n=G.frame, t0=performance.now(); return new Promise(r=>{ const tick=()=>{ if(G.frame>n+5) r(true); else if(performance.now()-t0>5000) r(false); else setTimeout(tick,50); }; tick(); }); }),'A4 the frame loop keeps running after the recovery');
 ok(await ev(()=>G.errors.length<=20),'A5 the error log is capped at 20');
 // a scene whose update throws once does not leak input state
 await ev(()=>{ let n=0; G.scenes.__once={ enter(){}, update(){ if(n++===0) throw new Error('once'); }, draw(){} }; G.go('__once',{},true); });
 await wait(400);
 ok(await ev(()=>G.badFrames===0&&G.sceneName==='__once'),'A6 one bad frame does not eject the scene');
 await ev(()=>G.go(G.homeScene(),{},true)); await wait(300);
 // storage failure is noticed and said once
 const r=await ev(()=>{ const real=Storage.prototype.setItem; Storage.prototype.setItem=function(){ throw new DOMException('full','QuotaExceededError'); };
   const a=G.persist(), t1=G.toasts.length; const b2=G.persist(), t2=G.toasts.length; Storage.prototype.setItem=real; const c=G.persist(); return {a,b2,c,says:t1>0,once:t2===t1,okFlag:G.storageOk}; });
 ok(r.a===false&&r.b2===false&&r.says&&r.once,'A7 a failed save returns false and warns once per session');
 ok(r.c===true&&r.okFlag===true,'A8 a later successful save clears the warning state');
 ok(errors.length===0,'A9 no uncaught page errors'+(errors.length?': '+errors[0]:''));
 await b.close();
 results.forEach(x=>console.log(x)); const f=results.filter(x=>x.startsWith('FAIL')).length;
 console.log((results.length-f)+'/'+results.length+' passed'); process.exit(f?1:0);
})();
