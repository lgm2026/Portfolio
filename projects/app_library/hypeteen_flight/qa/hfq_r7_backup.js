/* HFQ Round 7: PORTABLE PROFILES. Backup files round-trip, encrypted backups open only with the passphrase, and hostile or
   broken files are refused without touching the profiles on the device. Also: the schema migration, restore points and the
   merge rules (never sum scores: keep the best; records unite by id).
   The file goes through the real screen once (SAVE THE BACKUP FILE -> a download -> RESTORE FROM A FILE -> the preview ->
   RESTORE), then the parser is exercised directly with crafted files, which is the only way to feed it garbage.
   Run: cd web && python3 -m http.server 8777   then   node qa/hfq_r7_backup.js */
const { chromium } = require('playwright');
const fs=require('fs'), path=require('path'), os=require('os');
const drive=require('./lib/drive.js');
const BASE=process.env.BASE_URL||'http://localhost:8777/';
const S=path.join(__dirname,'shots')+'/'; fs.mkdirSync(S,{recursive:true});
const results=[], errors=[]; const ok=(c,l)=>{ results.push((c?'OK   ':'FAIL ')+l); if(process.env.VERBOSE) console.log(results[results.length-1]); };
(async()=>{
 const b=await chromium.launch();
 const ctx=await b.newContext({viewport:{width:390,height:800},deviceScaleFactor:2,hasTouch:true,isMobile:true,acceptDownloads:true});
 const page=await ctx.newPage();
 page.on('pageerror',e=>errors.push('PAGEERROR: '+e.message+' '+(e.stack||'').split('\n')[1]));
 page.on('console',m=>{ if(m.type()==='error'&&!/fonts\.g|ERR_|favicon/.test(m.text())) errors.push('CONSOLE: '+m.text()); });
 const D=drive(page,ctx,{base:BASE}); const {ev,wait,until}=D;
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'htfa-bk-'));

 /* ---- a cadet with some progress ---- */
 await D.enroll('DELTA','4444'); await ev(()=>{ G.go('world',{},true); });
 await ev(()=>{ const H=G.HFQ; G.award(120,'QA'); H.lib.quizDone('forces',6,8); H.gameDone('paper',40,{}); G.ach('reader'); G.persist(); }); await wait(300);
 const before=await ev(()=>({points:G.save.points,ach:Object.keys(G.save.ach).sort(),quiz:G.save.mod.lib.quiz.forces.best,game:G.save.mod.games.paper.best,id:G.activeAcct.id,uuid:G.save.uuid}));
 ok(before.points>120&&before.quiz===6&&before.game===40,'K1 DELTA has progress to protect: '+before.points+' XP, a quiz best of 6, a game best of 40');

 /* ---- the screen: save a backup file ---- */
 await ev(()=>G.go('backup',{back:'world'},true)); await wait(800); await D.shot(S+'R7B_01_backup.png');
 ok(await ev(()=>G.sceneName==='backup'&&!!document.querySelector('#ui.on')),'K2 Backup and restore opens from Settings');
 const [dl]=await Promise.all([page.waitForEvent('download',{timeout:8000}),D.click('Save the backup file')]);
 const file=path.join(tmp,dl.suggestedFilename()); await dl.saveAs(file); const text=fs.readFileSync(file,'utf8'); let env=null; try{ env=JSON.parse(text); }catch(e){}
 ok(!!env&&env.format==='htfa-backup'&&/\.htfa$/.test(dl.suggestedFilename()),'K3 SAVE THE BACKUP FILE downloads a JSON envelope as .htfa ('+dl.suggestedFilename()+')');
 ok(!!env&&env.formatVersion===1&&typeof env.schema==='number'&&env.app&&typeof env.app.version==='string'&&typeof env.created==='string'&&env.integrity&&env.integrity.alg==='SHA-256'&&/^[0-9a-f]{64}$/.test(env.integrity.digest)&&Array.isArray(env.manifest)&&env.manifest.length>=1&&env.manifest.every(m=>m.path&&/^[0-9a-f]{64}$/.test(m.sha256)),'K4 the envelope carries schema, app version, creation time, a manifest and a SHA-256 integrity value');
 ok(!!env&&env.profiles.every(p=>/^[A-Za-z0-9_-]{1,64}$/.test(p.id))&&env.profiles.some(p=>p.callsign==='DELTA'),'K5 profiles carry a canonical id and the call sign; no real names anywhere');
 ok(!!env&&env.integrity.digest===await ev(t=>G.HFQ.BACKUP.sha256(G.HFQ.BACKUP.canon(Object.assign({},JSON.parse(t),{integrity:undefined}))),text),'K6 the integrity hash is the SHA-256 of the canonical envelope (checksum = corruption detection, as documented)');
 ok(await ev(()=>!!(G.save.mod.ui&&G.save.mod.ui.lastBackup)&&!!G.roster.lastBackup),'K7 the save and the roster remember when the last backup was made');

 /* ---- a second cadet, then restore DELTA's file over the device through the screen (merge) ---- */
 await ev(()=>{ const H=G.HFQ; G.award(30,'QA2'); H.lib.quizDone('forces',8,8); G.persist(); }); await wait(100);   // DELTA moves on after the backup: a higher quiz best
 const later=await ev(()=>({points:G.save.points,quiz:G.save.mod.lib.quiz.forces.best}));
 await ev(()=>G.go('backup',{back:'world'},true)); await wait(600);
 const [chooser]=await Promise.all([page.waitForEvent('filechooser',{timeout:8000}),D.click('Choose a backup file',{sel:'label.btn'})]);
 await chooser.setFiles(file); await wait(1200); await D.shot(S+'R7B_02_preview.png');
 ok(await ev(()=>!!document.querySelector('#ui.on .dialog')&&/DELTA/.test(document.querySelector('#ui.on .dialog').textContent)&&/merge/i.test(document.querySelector('#ui.on .dialog').textContent)),'K8 a dry-run preview names the profile in the file and proposes a merge');
 ok(await D.click('Restore',{sel:'.dialog .acts button'}),'K9 RESTORE'); await wait(1500);
 const after=await ev(()=>{ const s=JSON.parse(localStorage.getItem(G.saveKey)); return {points:s.points,quiz:s.mod.lib.quiz.forces.best,game:s.mod.games.paper.best,ach:Object.keys(s.ach).sort()}; });
 ok(after.quiz===8&&after.points===later.points&&after.game===40,'K10 merge keeps the best: the newer quiz best (8) wins over the file (6), XP is not summed ('+after.points+')');
 ok(await ev(()=>G.HFQ.store.snaps().then(l=>l.some(s=>/Before restoring/.test(s.reason)))),'K11 a restore point was written before the import');
 await D.shot(S+'R7B_03_restored.png');
 await ev(()=>{ if(document.querySelector('#ui.on .dialog')) G.HFQ.UI.dialog({title:'x'}).close(); G.loginAs(G.roster.accounts.find(a=>a.name==='DELTA')); G.go('world',{},true); }); await wait(300);

 /* ---- the parser, fed directly ---- */
 const parse=(t,pass)=>ev(([t,p])=>G.HFQ.BACKUP.parse(t,p).then(r=>({ok:true,n:r.profiles.length,meta:r.meta}),e=>({ok:false,msg:e.message,needPass:!!e.needPass})),[t,pass]);
 const snapshotKeys=()=>ev(()=>JSON.stringify(G.HFQ.store.capture()));
 const K0=await snapshotKeys();
 let r=await parse(text); ok(r.ok&&r.n===1,'K12 the real file parses: 1 profile');
 r=await parse(text.replace('"callsign":"DELTA"','"callsign":"ECHOX"')); ok(!r.ok&&/damaged|changed/i.test(r.msg),'K13 a file edited after saving fails the integrity check: '+r.msg);
 r=await parse('{"format":"htfa-backup","formatVersion":1'); ok(!r.ok,'K14 truncated JSON is refused: '+r.msg);
 r=await parse('{"hello":"world"}'); ok(!r.ok&&/not a .*backup/i.test(r.msg),'K15 a random JSON file is refused: '+r.msg);
 r=await parse(JSON.stringify(Object.assign(JSON.parse(text),{formatVersion:99}))); ok(!r.ok&&/newer version/i.test(r.msg),'K16 a file from a newer format is refused with a clear message');
 r=await parse('x'.repeat(61*1024*1024)); ok(!r.ok&&/too big/i.test(r.msg),'K17 an oversized file (61 MB) is refused before parsing');
 r=await parse(text.replace('"profiles":[','"__proto__":{"polluted":1},"profiles":[')); ok(await ev(()=>({}).polluted===undefined&&Object.prototype.polluted===undefined),'K18 a __proto__ key at the top of the file never pollutes anything (parsed: '+r.ok+', prototype untouched)');
 // a crafted but internally consistent hostile file: rebuild the hash so only the sanitizer stands between it and the save
 const hostile=await ev(async t=>{ const B=G.HFQ.BACKUP, o=JSON.parse(t); o.profiles[0].media=[]; const p=o.profiles[0]; p.save.points=1e12; p.save.name='<img src=x onerror=alert(1)>'+'A'.repeat(500); p.save.mod.evil={__proto__:{x:1},constructor:{prototype:{y:1}}}; p.save.mod.deep=JSON.parse('['.repeat(80)+']'.repeat(80)); p.media=[{id:'../../etc/passwd',type:'image/png',data:'AAAA',w:99999,h:99999}]; o.integrity=undefined; o.integrity={alg:'SHA-256',digest:await B.sha256(B.canon(o))}; return JSON.stringify(o); },text);
 const hp=await ev(t=>G.HFQ.BACKUP.parse(t).then(r=>{ const s=r.profiles[0].save; return {ok:true,points:s.points,name:s.name,evilKeys:Object.keys(s.mod.evil||{}),deep:JSON.stringify(s.mod.deep).length,media:r.profiles[0].media.map(m=>m.id)}; },e=>({ok:false,msg:e.message})),hostile);
 ok(hp.ok&&hp.points<=1e7&&hp.name.length<=16&&!hp.evilKeys.includes('__proto__')&&!hp.evilKeys.includes('constructor')&&hp.deep<200&&hp.media.every(id=>/^[A-Za-z0-9_-]+$/.test(id)),'K19 the sanitizer caps points, truncates names, drops __proto__/constructor keys, flattens absurd depth and replaces a path-like media id ('+JSON.stringify(hp).slice(0,170)+')');
 ok(await snapshotKeys()===K0,'K20 none of the refused or hostile files changed anything on the device');
 const hostileApply=await ev(async t=>{ const B=G.HFQ.BACKUP, parsed=await B.parse(t); const plan=B.plan(parsed).map(x=>Object.assign(x,{choice:'skip'})); plan[0].choice='merge'; const n0=(await G.HFQ.store.all('media')).length; const r=await B.apply(parsed,plan,{}); return {photos:r.photos,n:(await G.HFQ.store.all('media')).length-n0}; },hostile);
 ok(hostileApply.photos===0&&hostileApply.n===0,'K19b restoring it: the 99999-pixel non-image is skipped at decode time, nothing stored');

 /* ---- an encrypted backup ---- */
 const enc=await ev(async t=>G.HFQ.BACKUP.cryptoOk?G.HFQ.BACKUP.encrypt(t,'correct horse'):null,text);
 if(enc){ const eo=JSON.parse(enc);
  ok(eo.format==='htfa-backup-encrypted'&&eo.kdf&&eo.kdf.name==='PBKDF2'&&eo.kdf.hash==='SHA-256'&&eo.kdf.iterations>=600000&&eo.kdf.salt&&eo.cipher&&eo.cipher.name==='AES-GCM'&&eo.cipher.iv&&eo.cipher.tagLength===128&&eo.ciphertext,'K21 encrypted envelope: AES-GCM with a PBKDF2-SHA-256 key ('+eo.kdf.iterations+' iterations), random salt and IV');
  ok(!/DELTA/.test(enc),'K22 the ciphertext does not contain the call sign');
  r=await parse(enc); ok(!r.ok&&r.needPass,'K23 without a passphrase the app asks for one');
  r=await parse(enc,'wrong'); ok(!r.ok&&!r.needPass,'K24 the wrong passphrase is refused: '+r.msg);
  r=await parse(enc,'correct horse'); ok(r.ok&&r.n===1,'K25 the right passphrase opens it: 1 profile');
 } else ok(true,'K21-25 (encryption needs a secure context; skipped on plain http)');

 /* ---- rollback: a failed write puts everything back ---- */
 const rb=await ev(async t=>{ const B=G.HFQ.BACKUP, parsed=await B.parse(t), plan=B.plan(parsed), before=JSON.stringify(G.HFQ.store.capture()); const o=localStorage.setItem; let n=0; localStorage.setItem=function(k,v){ if(++n===2) throw new Error('QuotaExceededError'); return o.call(localStorage,k,v); };
  let err=null; try{ await B.apply(parsed,plan,{}); }catch(e){ err=e.message; } localStorage.setItem=o; return {err,same:JSON.stringify(G.HFQ.store.capture())===before}; },text);
 ok(!!rb.err&&rb.same,'K26 when the device refuses a write mid-import, the import reports it and every key is exactly as before');

 /* ---- schema migration of an r6.6 (v1) save ---- */
 const mig=await ev(()=>{ const s=G.defSave(); s.points=333; s.mod={fl:{l:{},miss:{}},flog:{e:[{id:'f1',k:'pax',at:1700000000000}]}}; s.settings={music:true,sfx:true,rm:false}; const key=G.CFG.id+'_acct_qa_v1'; localStorage.setItem(key,JSON.stringify(s)); const was=G.saveKey; G.loadSave(key); const out={v:G.save.mod.v,hub:G.save.settings.hub,rec:!!G.save.mod.rec,journal:!!G.save.mod.journal,flog:G.save.mod.flog.e[0],migrated:!!G.save.mod.migratedAt,points:G.save.points,log:G.save.mod.rec.log.some(x=>x.k==='migrate')}; localStorage.removeItem(key); G.loadSave(was); return out; });
 ok(mig.v===2&&mig.hub===false&&mig.rec&&mig.journal&&mig.flog.v===1&&mig.flog.src==='self'&&mig.migrated&&mig.points===333&&mig.log,'K27 a v1 save migrates to v2 additively: points kept, hub off, record + journal added, flight-log entries get version and source, the migration is logged');

 console.log(results.join('\n')); const fails=results.filter(r=>r.startsWith('FAIL')).length;
 if(errors.length) console.log('ERRORS:\n'+errors.slice(0,8).join('\n'));
 console.log('\n'+(results.length-fails)+'/'+results.length+' passed'+(errors.length?', '+errors.length+' page errors':''));
 await b.close(); process.exit(fails||errors.length?1:0);
})().catch(e=>{ console.error(e); console.log(results.join('\n')); process.exit(1); });
