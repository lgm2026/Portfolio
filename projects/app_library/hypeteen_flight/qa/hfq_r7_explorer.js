/* HFQ Round 7: THE EXPLORER, THE HTML LAYER AND THE SERIES.
   Explorer: every destination carries coordinates inside North America, citations with https URLs, a checked date, access and
   safety notes and an explicit safety class; memorials have no learning game; the map projects the basemap's own test points
   exactly; the directory and the map show the same set; filters and search work; "I visited" is a self-reported record that
   earns nothing academic. HTML layer: the view stack resumes after a canvas activity, Back/Escape unwind it, focus lands on
   the title, text size and reduced motion are respected. Series: all seven books load, chapters are intact, no interior art
   placeholders, no author name, the Ground School Notes link to real units, a bookmark and the reading place survive a reload.
   Run: cd web && python3 -m http.server 8777   then   node qa/hfq_r7_explorer.js */
const { chromium } = require('playwright');
const fs=require('fs'), path=require('path');
const drive=require('./lib/drive.js');
const BASE=process.env.BASE_URL||'http://localhost:8777/';
const S=path.join(__dirname,'shots')+'/'; fs.mkdirSync(S,{recursive:true});
const results=[], errors=[]; const ok=(c,l)=>{ results.push((c?'OK   ':'FAIL ')+l); if(process.env.VERBOSE) console.log(results[results.length-1]); };
(async()=>{
 const b=await chromium.launch();
 const ctx=await b.newContext({viewport:{width:390,height:800},deviceScaleFactor:2,hasTouch:true,isMobile:true});
 const page=await ctx.newPage();
 page.on('pageerror',e=>errors.push('PAGEERROR: '+e.message+' '+(e.stack||'').split('\n')[1]));
 page.on('console',m=>{ if(m.type()==='error'&&!/fonts\.g|ERR_|favicon/.test(m.text())) errors.push('CONSOLE: '+m.text()); });
 const D=drive(page,ctx,{base:BASE}); const {ev,wait,until}=D;
 await D.enroll('FOXTROT','6666'); await ev(()=>{ G.HFQ.tut.finish(true); G.go('world',{},true); }); await wait(300);

 /* ============================ EXPLORER DATA ============================ */
 const data=await ev(()=>{ const X=G.HFQ.EXPLORER, L=X.list(), bad=[]; const ids=new Set();
  for(const d of L){ const why=[];
   if(!/^[a-z]{2}-[a-z0-9-]+$/.test(d.id)||ids.has(d.id)) why.push('id'); ids.add(d.id);
   if(!(d.lat>14&&d.lat<72&&d.lon>-170&&d.lon<-52)) why.push('coords');
   if(!['US','CA','MX'].includes(d.country)||!d.region||!d.city) why.push('place');
   if(!X.cats[d.cat]) why.push('cat'); if(!X.sclass[d.sclass]) why.push('sclass');
   if(!d.summary||d.summary.length<20||!d.history||d.history.length<60) why.push('text');
   if(!Array.isArray(d.src)||!d.src.length||!d.src.every(s=>s.t&&/^https:\/\//.test(s.u))) why.push('src');
   if(!/^\d{4}-\d{2}-\d{2}$/.test(d.checked)) why.push('checked'); if(!d.access||!d.safety) why.push('notes'); if(d.media!=='none') why.push('media');
   if(d.cat==='memorial'&&d.learn) why.push('memorial-learn'); if(d.learn&&!G.HFQ.units.some(u=>u.id===d.learn.unit)) why.push('learn-unit');
   if(d.prompt==null) why.push('prompt'); if(why.length) bad.push(d.id+':'+why.join('/')); }
  return {n:L.length,bad,cov:X.coverage(),cls:L.reduce((o,d)=>(o[d.sclass]=(o[d.sclass]||0)+1,o),{})}; });
 ok(data.n>=45&&!data.bad.length,'X1 '+data.n+' destinations, every one with a stable id, North American coordinates, country/region/city, category, safety class, summary + history, https citations, a checked date, access + safety notes'+(data.bad.length?' (bad: '+data.bad.join(' ')+')':''));
 ok(data.cov.US>=30&&data.cov.CA>=6&&data.cov.MX>=3,'X2 coverage spans all three countries: '+JSON.stringify(data.cov));
 ok(Object.keys(data.cls).length>=5&&!!data.cls.memorial,'X3 explicit safety classes in use: '+JSON.stringify(data.cls));
 const proj=await ev(async()=>{ const X=G.HFQ.EXPLORER, m=await X.loadMap(); return {tests:m.tests.map(t=>{ const p=X.project(t[0],t[1]); return Math.abs(p[0]-t[2])<.02&&Math.abs(p[1]-t[3])<.02; }),countries:m.countries.length,na:m.countries.filter(c=>c.na).length,attrib:m.attribution||''}; });
 ok(proj.tests.length>=5&&proj.tests.every(Boolean),'X4 the app projects the basemap’s '+proj.tests.length+' test points exactly where d3 put them (same conic equal-area formula)');
 ok(proj.countries>20&&proj.na===3&&/Natural Earth/i.test(proj.attrib),'X5 the shipped basemap: '+proj.countries+' country outlines, 3 highlighted, Natural Earth attribution');

 /* ============================ EXPLORER SCREEN ============================ */
 await ev(()=>G.go('explorer',{back:'world'},true)); await wait(1200); await D.shot(S+'R7X_01_map.png');
 ok(await ev(()=>G.sceneName==='explorer'&&document.querySelectorAll('#ui.on svg.map .pin').length>0),'X6 the map draws (clustered) pins');
 const pinTotal=await ev(()=>[...document.querySelectorAll('#ui.on svg.map .pin')].reduce((n,p)=>n+(p.classList.contains('cluster')?+p.querySelector('text').textContent:1),0));
 ok(pinTotal===data.n,'X7 the pins and clusters add up to every destination ('+pinTotal+')');
 await D.click('Directory',{sel:'[role=tab]'}); await wait(400); await D.shot(S+'R7X_02_directory.png');
 ok(await ev(n=>document.querySelectorAll('#ui.on main .list .item').length===n,data.n),'X8 the Directory lists the same '+data.n+' places');
 await page.locator('#ui.on input[type=search]').fill('museum'); await wait(300);
 const nMus=await ev(()=>document.querySelectorAll('#ui.on main .list .item').length);
 ok(nMus>10&&nMus<data.n,'X9 search narrows the list ('+nMus+' for “museum”)');
 await page.locator('#ui.on input[type=search]').fill(''); await page.locator('#ui.on select').first().selectOption('CA'); await wait(300);
 ok(await ev(n=>document.querySelectorAll('#ui.on main .list .item').length===n,data.cov.CA),'X10 the country filter shows exactly the Canadian places ('+data.cov.CA+')');
 await page.locator('#ui.on select').first().selectOption(''); await wait(200);
 await D.click('National Air and Space Museum',{sel:'.item'}); await wait(500); await D.shot(S+'R7X_03_place.png');
 ok(await ev(()=>{ const t=document.querySelector('#ui.on main').textContent; return /Sources/.test(t)&&/Stay safe/.test(t)&&/Getting in/.test(t)&&/Kind of visit/.test(t)&&/Checked/.test(t)&&/Visit with a parent/.test(t); }),'X11 a place page: story, learning card, prompt, kind of visit, getting in, stay safe, sources with the checked date');
 const xp0=await ev(()=>G.save.points), ach0=await ev(()=>Object.keys(G.save.ach).length);
 await D.click('I visited',{re:true}); await wait(600);
 ok(await ev(()=>G.sceneName==='record'&&G.HFQ.UI.stack().slice(-1)[0].view==='jedit'),'X12 I VISITED opens a self-reported Flight Record entry, pre-filled');
 await D.shot(S+'R7X_04_jedit.png');
 await D.click('Save',{sel:'button.primary'}); await wait(600);
 const j=await ev(()=>({n:(G.save.mod.journal.e||[]).length,e:(G.save.mod.journal.e||[])[0],visited:G.HFQ.EXPLORER.visited('us-nasm'),xp:G.save.points,ach:Object.keys(G.save.ach).length}));
 ok(j.n===1&&j.e&&j.e.src==='self'&&j.e.id&&j.e.type&&/^\d{4}-\d{2}-\d{2}$/.test(j.e.d)&&j.e.cr&&j.e.up&&j.e.v===1&&j.e.dest==='us-nasm'&&j.visited,'X13 saved: one self-reported entry (id, type, date, source flag, timestamps, version) and the place is marked visited');
 ok(j.xp===xp0&&j.ach===ach0,'X14 the visit earned no XP and no badge (visits are never academic)');
 ok(await ev(()=>G.HFQ.recLog().some(x=>x.k==='visit'&&x.a==='dest:us-nasm')),'X15 the verified log notes the self-report as a visit record');

 /* ============================ THE HTML LAYER: stack, back, keys, prefs ============================ */
 await ev(()=>G.go('hub',{},true)); await wait(500);
 await D.click('Flight Path',{sel:'.tile'}); await D.click('How Airplanes Fly',{sel:'.item'});
 ok(JSON.stringify((await D.ui()).stack)==='["home","pathlist","unit"]','U1 Hub: home > Flight Path > unit on the stack');
 await D.click('Flashcards'); await until(()=>G.sceneName==='flash',3000);
 await ev(()=>{ const s=G.scene; let g=0; while(!s.done&&g++<200) s.rate(true); }); await wait(500);
 await ev(()=>G.go('hub',{},true)); await wait(500);
 ok(JSON.stringify((await D.ui()).stack)==='["home","pathlist","unit"]'&&(await D.ui()).title==='How Airplanes Fly','U2 after the canvas activity the stack resumes on the unit page');
 await page.keyboard.press('Escape'); await wait(400);
 ok(JSON.stringify((await D.ui()).stack)==='["home","pathlist"]','U3 Escape goes back one view');
 await D.back(); ok(JSON.stringify((await D.ui()).stack)==='["home"]','U4 the Back button again: home');
 ok(await ev(()=>document.activeElement&&document.activeElement.id==='ui-title'),'U5 focus lands on the screen title');
 ok(await ev(()=>!!document.getElementById('sr-live')&&document.querySelector('#ui').getAttribute('data-text')==='0'),'U6 a live region exists; text size at Standard');
 await D.click('Settings',{sel:'.tile'}); await D.click('Larger',{sel:'.seg button'});
 const fs1=await ev(()=>({t:document.querySelector('#ui').dataset.text,px:parseFloat(getComputedStyle(document.querySelector('#ui')).fontSize),pref:G.save.mod.ui.text}));
 ok(fs1.t==='2'&&fs1.px>18&&fs1.pref===2,'U7 Text size Larger: the layer scales ('+fs1.px+'px) and the choice is saved with the profile');
 await D.click('Standard',{sel:'.seg button'});
 await page.locator('#ui.on input#sw-reducedmotion').check(); await wait(200);
 ok(await ev(()=>G.save.settings.rm===true&&document.querySelector('#ui').dataset.rm==='1'),'U8 Reduced motion: saved and applied to the layer');
 await page.locator('#ui.on input#sw-reducedmotion').uncheck();
 ok(await ev(()=>!document.querySelector('#ui [onclick]')&&!document.querySelector('#ui [innerHTML]')),'U9 no inline handlers in the layer (strict CSP safe)');
 await D.shot(S+'R7X_05_settings.png');

 /* ============================ THE SERIES ============================ */
 const ser=await ev(async()=>{ const H=G.HFQ, out=[]; for(const sb of H.SERIES){ if(sb.status!=='available'){ out.push({n:sb.n,soon:true}); continue; } await H.loadContent(sb.file); const d=H.SERIES_TEXT[sb.id]; const txt=JSON.stringify(d); out.push({n:sb.n,t:sb.t,ch:d.chapters.length,words:d.words,img:/\[\[IMG:/.test(txt),about:/about the author/i.test(txt),links:(d.chapters.find(c=>c.links)||{links:[]}).links.map(l=>l.a),cover:sb.cover,first:d.chapters[0].t,last:d.chapters[d.chapters.length-1].t,blocks:d.chapters.reduce((k,c)=>k+c.blocks.length,0)}); } return out; });
 ok(ser.length===7&&ser.every(s=>!s.soon),'S1 all seven books are available and their text loads on demand');
 ok(ser.every(s=>s.ch>=24&&s.words>25000&&s.blocks>1500),'S2 each book: 24+ chapters, 25,000+ words ('+ser.map(s=>s.n+':'+s.ch+'ch/'+s.words+'w').join(' ')+')');
 ok(ser.every(s=>!s.img&&!s.about),'S3 no interior-art placeholders and no author note in any book');
 ok(ser.every(s=>/^Prologue/.test(s.first))&&ser.filter(s=>/Ground School Notes/.test(s.last)).length===6&&/Field Guide/.test(ser[6].last),'S4 each book opens on its Prologue and closes on its Ground School Notes (Book Seven: the Field Guide)');
 ok(await ev(l=>l.every(a=>!!G.HFQ.REG.get(a)),ser.flatMap(s=>s.links))&&ser.every(s=>s.links.length>=1),'S5 the back-matter links point at real academy units');
 ok(ser.every(s=>/^assets\/series\/htfa-book\d-cover\.webp$/.test(s.cover)),'S6 every book has its real cover file');
 const covers=await ev(async()=>{ const out=[]; for(const sb of G.HFQ.SERIES){ const r=await fetch(sb.cover); const bl=await r.blob(); const im=await createImageBitmap(bl); out.push({ok:r.ok,w:im.width,h:im.height,bytes:bl.size}); } return out; });
 ok(covers.every(c=>c.ok&&c.w===600&&c.h===845&&c.bytes<200000),'S7 covers load: 600×845 WebP, each under 200 KB');
 await ev(()=>G.go('library',{back:'hub'},true)); await wait(600); await D.shot(S+'R7X_06_library.png');
 await D.click('The Sky We Share',{sel:'.shelf button'}); await wait(400); await D.shot(S+'R7X_07_book7.png');
 ok((await D.ui()).title==='The Sky We Share','S8 Book Seven’s page');
 await D.click('Start reading'); await until(()=>!!document.querySelector('#ui.on .reader'),6000); await wait(400);
 ok(await ev(()=>/Prologue/.test(document.querySelector('#ui-title').textContent)||/Prologue/.test(document.querySelector('#ui.on .reader .chno').textContent+document.querySelector('#ui.on #ch-title').textContent)),'S9 the reader opens on the Prologue');
 await D.click('Next chapter',{sel:'nav.chapnav button'}); await D.click('Next chapter',{sel:'nav.chapnav button'});
 await page.locator('#ui.on .reader header button[aria-label="Add a bookmark here"]').click(); await wait(300);
 const st=await ev(()=>G.save.mod.read['htfa-7']);
 ok(st&&st.ch===2&&st.bm.length===1&&st.bm[0].ch===2,'S10 chapter 3, bookmarked');
 await page.reload(); await page.waitForFunction(()=>document.getElementById('tapstart').style.display==='block'); await wait(300); await page.evaluate(()=>{ const b=document.getElementById('tapstart'); if(b&&b.offsetParent) b.click(); }); await page.waitForFunction(()=>G.sceneName==='terms'||G.sceneName==='title',null,{timeout:15000}); await page.evaluate(()=>{ if(G.sceneName==='terms'){ G.HFQ.acceptTerms('QA','lead'); G.go('title',{gateSeen:true},true); } }); await wait(600);
 await ev(()=>{ G.loginAs(G.roster.accounts[0]); G.go('library',{back:'world'},true); }); await wait(600);
 ok(await ev(()=>/Chapter 3/.test(document.querySelector('#ui.on .shelf').textContent)&&G.save.mod.read['htfa-7'].bm.length===1),'S11 after a reload: the shelf says Chapter 3, the bookmark is kept');
 await D.click('The Sky We Share',{sel:'.shelf button'}); await D.click('Continue reading'); await until(()=>!!document.querySelector('#ui.on .reader'),6000); await wait(300);
 ok(await ev(()=>{ const s=G.HFQ.UI.stack(); return s[s.length-1].args.ch===2; }),'S12 Continue reading resumes on chapter 3');
 await D.shot(S+'R7X_08_reader7.png');

 console.log(results.join('\n')); const fails=results.filter(r=>r.startsWith('FAIL')).length;
 if(errors.length) console.log('ERRORS:\n'+errors.slice(0,8).join('\n'));
 console.log('\n'+(results.length-fails)+'/'+results.length+' passed'+(errors.length?', '+errors.length+' page errors':''));
 await b.close(); process.exit(fails||errors.length?1:0);
})().catch(e=>{ console.error(e); console.log(results.join('\n')); process.exit(1); });
