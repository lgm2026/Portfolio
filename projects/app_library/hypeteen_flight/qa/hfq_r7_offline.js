/* HFQ Round 7: OFFLINE ON THE BUILT APP. Loads dist/ once (the service worker installs and precaches every file), then cuts the
   network and reloads: the app must boot, a lesson must open, the Explorer directory must search, a series book must open from
   the cache, and the strict Content-Security-Policy headers the hosting config sets must leave everything working.
   Run against dist only:   node tools/build.js && (cd dist && python3 -m http.server 8778)   then   BASE_URL=http://localhost:8778/ node qa/hfq_r7_offline.js */
const { chromium } = require('playwright');
const fs=require('fs'), path=require('path');
const drive=require('./lib/drive.js');
const BASE=process.env.BASE_URL||'http://localhost:8778/';
const S=path.join(__dirname,'shots')+'/'; fs.mkdirSync(S,{recursive:true});
const results=[], errors=[]; const ok=(c,l)=>{ results.push((c?'OK   ':'FAIL ')+l); if(process.env.VERBOSE) console.log(results[results.length-1]); };
(async()=>{
 const b=await chromium.launch();
 const ctx=await b.newContext({viewport:{width:390,height:800},deviceScaleFactor:2,hasTouch:true,isMobile:true,serviceWorkers:'allow'});
 /* the hosting headers (tools/hosting/hfq-security-headers.conf), applied to every response so the bundle is tested under them */
 const conf=fs.readFileSync(path.join(__dirname,'..','tools','hosting','hfq-security-headers.conf'),'utf8');
 const CSP=(/Content-Security-Policy\s+"([^"]+)"/.exec(conf)||[])[1]; if(!CSP) throw new Error('no CSP in tools/hosting/hfq-security-headers.conf');
 await ctx.route('**/*',async route=>{ try{ const r=await route.fetch(); const headers=Object.assign({},r.headers(),{'content-security-policy':CSP,'x-content-type-options':'nosniff'}); await route.fulfill({response:r,headers}); }catch(e){ await route.abort(); } });
 const page=await ctx.newPage();
 page.on('pageerror',e=>errors.push('PAGEERROR: '+e.message+' '+(e.stack||'').split('\n')[1]));
 page.on('console',m=>{ if(m.type()==='error'&&!/favicon/.test(m.text())) errors.push('CONSOLE: '+m.text()); });
 const D=drive(page,ctx,{base:BASE}); const {ev,wait,until}=D;

 /* ---- online: install ---- */
 await D.enroll('HOTEL','8888'); await ev(()=>{ G.HFQ.tut.finish(true); G.go('world',{},true); }); await wait(300);
 ok(await ev(()=>!!(window.HFQ_BUILD&&window.HFQ_BUILD.id)),'O1 the built app carries its build fingerprint');
 ok(await ev(()=>G.HFQ.units.length>=50&&G.HFQ.BOOKS.length===32&&G.HFQ.EXPLORER.list().length>=45&&G.HFQ.SERIES.length===7),'O2 under the strict CSP the data-only content loaded: units, 32 books, the Explorer set, the series');
 const sw=await ev(()=>navigator.serviceWorker.ready.then(r=>!!r.active)); ok(sw,'O3 the service worker is active');
 await until(()=>caches.keys().then(k=>k.length>0),8000);
 const cached=await ev(async()=>{ const ks=await caches.keys(); const c=await caches.open(ks[0]); const keys=await c.keys(); return {n:keys.length,series:keys.filter(k=>/content\/lazy\/series\//.test(k.url)).length,basemap:keys.some(k=>/basemap\.js/.test(k.url)),fonts:keys.filter(k=>/\.woff2$/.test(k.url)).length,covers:keys.filter(k=>/htfa-book\d-cover\.webp/.test(k.url)).length}; });
 ok(cached.n>=40&&cached.series===7&&cached.basemap&&cached.fonts>=6&&cached.covers===7,'O4 the precache holds the app, all seven books, the basemap, the fonts and the covers ('+cached.n+' files)');
 await ev(()=>G.go('library',{back:'world'},true)); await wait(400); await D.click('Balance Before Control',{sel:'.shelf button'}); await D.click('Start reading'); await until(()=>!!document.querySelector('#ui.on .reader'),8000);
 ok(await ev(()=>!!G.HFQ.SERIES_TEXT['htfa-1']),'O5 online: Book One opens (its text arrives as data, decoded without eval)');
 await ev(()=>G.go('world',{},true)); await wait(300);

 /* ---- offline: everything again ---- */
 await ctx.setOffline(true);
 await page.reload({waitUntil:'load'}).catch(()=>{});
 const booted=await page.waitForFunction(()=>document.getElementById('tapstart')&&document.getElementById('tapstart').style.display==='block',null,{timeout:15000}).then(()=>true,()=>false);
 ok(booted,'O6 OFFLINE: the app boots from the cache'); if(!booted){ console.log(results.join('\n')); process.exit(1); }
 await wait(300); await page.evaluate(()=>{ const b=document.getElementById('tapstart'); if(b&&b.offsetParent) b.click(); }); await page.waitForFunction(()=>G.sceneName==='terms'||G.sceneName==='title',null,{timeout:15000}); await page.evaluate(()=>{ if(G.sceneName==='terms'){ G.HFQ.acceptTerms('QA','lead'); G.go('title',{gateSeen:true},true); } }); await wait(600);
 await ev(()=>{ G.loginAs(G.roster.accounts[0]); G.go('world',{},true); }); await wait(400);
 ok(await ev(()=>G.activeAcct&&G.activeAcct.name==='HOTEL'&&G.save.points>=0),'O7 OFFLINE: the profile is there');
 await ev(()=>G.go('lesson',{unit:'flight',lesson:0,ret:{scene:'world'}},true)); await wait(600);
 ok(await ev(()=>G.sceneName==='lesson'&&G.scene.phase==='brief'),'O8 OFFLINE: a lesson opens');
 await ev(()=>G.go('explorer',{back:'world',mode:'list'},true)); await wait(600);
 await page.locator('#ui.on input[type=search]').fill('wright'); await wait(300);
 ok(await ev(()=>G.sceneName==='explorer'&&document.querySelectorAll('#ui.on main .list .item').length>=1&&document.querySelectorAll('#ui.on main .list .item').length<10),'O9 OFFLINE: the Explorer directory searches');
 await ev(()=>G.go('explorer',{back:'world',mode:'map'},true)); await until(()=>!!document.querySelector('#ui.on svg.map .pin'),8000);
 ok(await ev(()=>document.querySelectorAll('#ui.on svg.map .pin').length>0),'O10 OFFLINE: the map draws from the cached basemap');
 await ev(()=>G.go('library',{back:'world'},true)); await wait(400); await D.click('The Sky We Share',{sel:'.shelf button'}); await D.click('Start reading'); const opened=await until(()=>!!document.querySelector('#ui.on .reader')&&!!G.HFQ.SERIES_TEXT['htfa-7'],8000);
 ok(opened,'O11 OFFLINE: Book Seven, never opened before, loads from the precache');
 await D.shot(S+'R7O_01_offline_reader.png');
 ok(await ev(()=>[...document.fonts].some(f=>f.status==='loaded')),'O12 OFFLINE: the bundled fonts are in use');
 await ev(()=>G.go('backup',{back:'world'},true)); await wait(500);
 ok(await ev(()=>/Works offline/.test(document.querySelector('#ui.on main').textContent)),'O13 the Backup screen reports offline readiness');
 await ctx.setOffline(false);

 console.log(results.join('\n')); const fails=results.filter(r=>r.startsWith('FAIL')).length;
 if(errors.length) console.log('ERRORS:\n'+errors.slice(0,8).join('\n'));
 console.log('\n'+(results.length-fails)+'/'+results.length+' passed'+(errors.length?', '+errors.length+' page errors':''));
 await b.close(); process.exit(fails||errors.length?1:0);
})().catch(e=>{ console.error(e); console.log(results.join('\n')); process.exit(1); });
