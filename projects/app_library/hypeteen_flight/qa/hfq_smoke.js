/* HFQ round-1 smoke test: enroll -> locker -> lounge, walk + talk, all four places, ground school, logbook,
   squadron, flight bag, pages, a second cadet showing up in the lounge, family-lead PIN reset.
   Run: cd web && python3 -m http.server 8777   then   node qa/hfq_smoke.js   (BASE_URL to override) */
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
 const wait=ms=>page.waitForTimeout(ms), ev=(f,a)=>page.evaluate(f,a), scene=()=>ev(()=>G.sceneName), shot=n=>page.screenshot({path:S+n+'.png'});
 const tapV=async(x,y)=>{ const [cx,cy]=await ev(([x,y])=>{ const r=G.canvas.getBoundingClientRect(); return [r.left+x*r.width/G.VW,r.top+y*r.height/G.VH]; },[x,y]); await page.touchscreen.tap(cx,cy); await wait(120); };
 const tapR=async fn=>{ const r=await ev(fn); if(!r) return false; await tapV(r.x+r.w/2,r.y+r.h/2); return true; };
 await page.goto(BASE); await page.waitForFunction(()=>document.getElementById('tapstart').style.display==='block');
 await wait(900); await shot('00_welcome');
 await page.evaluate(()=>{ const b=document.getElementById('tapstart'); if(b&&b.offsetParent) b.click(); }); await page.waitForFunction(()=>G.sceneName==='terms'||G.sceneName==='title',null,{timeout:15000}); await page.evaluate(()=>{ if(G.sceneName==='terms'){ G.HFQ.acceptTerms('QA','lead'); G.go('title',{gateSeen:true},true); } }); await wait(600);
 ok(await scene()==='title','1 title screen'); await shot('01_title');
 // ---- enroll
 await tapR(()=>G.scene.layout().btns.find(b=>b.id==='signup')); await wait(300);
 await ev(()=>{ if(G.sceneName==='terms'){ G.HFQ.acceptTerms('QA','lead'); G.HFQ.recordPledge('QA'); G.go('signup',{termsOk:true,pledged:true},true); } }); await wait(200);
 await tapR(()=>G.scene.suggestBtn()); await wait(150);
 const cs=await ev(()=>G.fieldVal('name'));
 ok(/^[A-Z]+$/.test(cs)&&cs.length<=12,'2 GIVE ME A FUN ONE fills a one-word call sign ('+cs+')');
 await shot('02_enroll_name');
 await tapR(()=>G.scene.nextBtn()); await wait(200);
 await page.locator('input.gfield').fill('1234'); await wait(300);
 await page.locator('input.gfield').fill('1234'); await wait(900);
 ok(await scene()==='locker','3 enrolling ends in the Locker');
 ok(await ev(()=>G.save.ach.enrolled&&G.save.points>=50),'4 ENROLLED badge + 50 XP');
 await tapR(()=>{ const L=G.scene.layout(), r=L.rows[0], s=G.scene.swRects(r)[2]; return {x:s.x,y:s.y,w:s.d,h:s.d}; }); await wait(150);
 await tapR(()=>{ const L=G.scene.layout(), r=L.rows[4]; const R=G.segRects(12,r.y+14,G.VW-24,24,r.list.length); return R[2]; }); await wait(150);
 ok(await ev(()=>G.playerAv().suit==='#c23a3a'&&G.playerAv().hat==='headset'&&G.activeAcct.av.hat==='headset'),'5 Locker changes save to the cadet + account');
 await shot('03_locker');
 await tapR(()=>G.scene.layout().btns.find(b=>b.id==='done')); await wait(700);
 ok(await scene()==='trainer','6a NEXT opens PICK YOUR TRAINER');
 await tapR(()=>G.scene.layout().cards[2]); await wait(200);
 await tapR(()=>G.scene.layout().btn); await wait(800); await tapR(()=>G.scene.btns&&G.sceneName==='placement'?G.scene.btns().find(b=>b.id==='new'):null); await wait(700);
 ok(await scene()==='world'&&await ev(()=>G.world.room())==='classroom'&&await ev(()=>G.HFQ.myAC().id==='pa28'),'6 picking a trainer (PA-28) reports to the Classroom');
 await wait(400); await shot('04_classroom');
 // ---- walk to the instructor and talk
 const onScreen=await ev(()=>{ const s=G.scene, L=s.layout(), n=s.P.R.npcs[0], p=s.toScreen(n.x,n.y-16,L); return p[0]>10&&p[0]<G.VW-10; });
 ok(onScreen,'7a the instructor is in view when you arrive');
 await tapR(()=>{ const s=G.scene, L=s.layout(), n=s.P.R.npcs[0], p=s.toScreen(n.x,n.y-16,L); return {x:p[0]-4,y:p[1]-4,w:8,h:8}; });
 for(let i=0;i<30&&!(await ev(()=>!!G.scene.dlg));i++) await wait(150);
 ok(await ev(()=>!!G.scene.dlg&&G.scene.dlg.npc.id==='instructor'),'7 tapping the instructor walks over and starts talking');
 await shot('05_dialog');
 for(let i=0;i<14&&await ev(()=>!!G.scene.dlg);i++){ await tapV(135,200); await wait(120); }
 ok(await ev(()=>!G.scene.dlg&&(G.save.mod.world.met||{}).instructor===1),'8 dialog closes; instructor marked as met');
 // ---- tabs to each place
 const tab=async k=>{ await tapR(new Function('return G.scene.tabs(G.scene.layout()).find(t=>t.room==="'+k+'")')); await wait(700); };
 for(const k of ['lounge','hangar']){ await tab(k); ok(await ev(()=>G.world.room())===k,'9 tab bar goes to the '+k); await wait(300); await shot('06_'+k); }
 // the rest through the MAP tab (round 4): tap a place, then GO THERE
 for(const k of ['tower','platform','ramp','wash','gameroom','runway']){ await tapR(()=>G.scene.mapBtn(G.scene.layout())); await wait(500);
  await ev(k=>{ G.scene.sel=k; },k); await tapR(()=>G.scene.btns().find(b=>b.id==='go')); await wait(700);
  ok(await ev(()=>G.world.room())===k,'9 the MAP goes to the '+k); await shot('06_'+k); }
 ok(await ev(()=>!!G.save.ach.explorer),'10 AIRFIELD EXPLORER after all nine places');
 // door: runway -> hangar via the side door station
 await ev(()=>{ const s=G.scene, st=s.P.R.stations.find(q=>q.key==='toHangar'); s.interact({st}); }); await wait(700);
 ok(await ev(()=>G.world.room())==='hangar','11 a door leads back to the hangar');
 await ev(()=>{ const s=G.scene, n=s.P.R.npcs[0]; s.talk(n); }); await wait(200); await shot('07_hangar_chief');
 await ev(()=>{ G.scene.dlg=null; });
 // ---- ground school from the classroom whiteboard
 await tab('classroom');
 await ev(()=>{ const s=G.scene, st=s.P.R.stations.find(q=>q.key==='board'); s.interact({st}); }); await wait(600);
 ok(await scene()==='groundschool','12 the classroom whiteboard opens Ground School');
 await shot('08_groundschool');
 await ev(()=>{ const s=G.scene; s.unit=G.HFQ.units[3]; s.seen(s.unit); s.list.reset(); }); await wait(300);
 ok(await ev(()=>G.save.ach.student&&G.save.mod.gs.seen.instruments),'13 opening a unit: GROUND SCHOOL STUDENT badge');
 await shot('09_unit');
 ok(await ev(()=>{ G.groundSchool.register('instruments',{scene:'blank'}); return G.groundSchool.status('instruments')==='ready'; }),'14 a learning-game unit can register and light up');
 await tapV(40,20); await wait(200); await tapV(40,20); await wait(600);
 ok(await scene()==='world','15 BACK returns to the classroom');
 // ---- logbook, flight bag, pages
 await ev(()=>G.go('logbook',{back:'world'},true)); await wait(400); await shot('10_logbook');
 await ev(()=>G.go('dash',{back:'world'},true)); await wait(400); await shot('11_flightbag');
 ok(await ev(()=>G.scene.layout().length===17),'16 FLIGHT BAG lists 17 cards (r7 adds FLIGHT RECORD and EXPLORER)');
 await tapV(40,20); await wait(600); ok(await scene()==='world','17 FLIGHT BAG BACK returns to the world (no log-out prompt)');
 for(const p of ['aircraft','radio','windsock','about']){ await ev(p=>G.go('page',{id:p,back:'world'},true),p); await wait(300); await shot('12_page_'+p); }
 // ---- round 2: academy phases (the six books) + FAA airfield colors
 ok(await ev(()=>G.HFQ.phases.map(p=>p.n).join('|')==='BALANCE BEFORE CONTROL|CROSSWIND DECISIONS|WEATHER MINIMUMS|CROSS-COUNTRY|SOLO|PILOT IN COMMAND|THE SKY WE SHARE'&&G.HFQ.ranks.length===21),'R2.1 the seven book titles are the academy phases, 3 steps each (r7 adds Book Seven above 2000 XP)');
 ok(await ev(()=>{ const R=G.HFQ.rank; return R(0).phaseN==='BALANCE BEFORE CONTROL'&&R(0).short==='PHASE 1 • STEP I'&&R(150).phaseN==='CROSSWIND DECISIONS'&&R(2600).n==='PILOT IN COMMAND III'&&R(2600).next===2900&&R(2900).phaseN==='THE SKY WE SHARE'&&R(9999).n==='THE SKY WE SHARE III'&&R(9999).next===null; }),'R2.2 XP maps to phase + step; every old threshold unchanged');
 ok(await ev(()=>{ G.clearToasts(); G.save.points=390; G.award(20,'TEST'); return G.toasts.some(t=>t.msg==='NEW PHASE: WEATHER MINIMUMS'); }),'R2.3 crossing a phase line shows NEW PHASE');
 await ev(()=>{ G.clearToasts(); G.go('logbook',{back:'world'},true); }); await wait(400);
 ok(await ev(()=>{ const I=G.scene.items(), k=I.findIndex(x=>x.t==='ACADEMY PHASES'); return k>=0&&G.HFQ.phases.every((p,i)=>I[k+1+i].t===(i+1)+'. '+p.n); }),'R2.4 the Logbook lists the six phases');
 await shot('16_logbook_phases');
 ok(await ev(()=>{ const lc=x=>String(x).toLowerCase(); return lc(G.C.bg)==='#0d1f33'&&lc(G.C.accent)==='#b88c35'&&lc(G.C.onAccent)==='#10263d'&&lc(G.C.danger)==='#c8102e'&&lc(G.C.dangerInk)==='#ffffff'&&!!(G.worldArt&&G.worldArt.floor&&String(G.worldArt.floor.sign).indexOf('#ffc21a')>=0); }),'R2.5 menus use the academy palette (navy, brass, mandatory red/white), and airfield signs keep FAA sign yellow (r7)');
 ok(await ev(()=>{ const R=G.WORLD.rooms.runway; return R.decor.some(d=>d.sign==='mandatory'&&d.text==='9-27')&&R.stations.filter(s=>s.art==='sign').every(s=>s.sign==='info'); }),'R2.6 runway: red 9-27 holding sign; game signs are black-on-yellow');
 await ev(()=>{ if(G.HFQ.tut&&G.HFQ.tut.active) G.HFQ.tut.finish(true); G.clearToasts(); G.go('world',{room:'runway'},true); }); await wait(700);   // r7.4: walking any way now moves the first briefing on, so this run reaches its dimmed TOWER step; skip it before sampling pixels
 // hold-short: the solid lines must be on the apron (holding) side. Sample the marking in world space.
 const hs=await ev(()=>{ const s=G.scene, L=s.layout(), y=262, rows=[y-6,y-3,y+1,y+4].map(yy=>{ let hits=0; for(let x=200;x<260;x++){ const p=s.toScreen(x,yy+.8,L), d=G.canvas.getContext('2d').getImageData(Math.round(p[0]*G.canvas.width/G.VW),Math.round(p[1]*G.canvas.height/G.VH),1,1).data; if(d[0]>200&&d[1]>150&&d[2]<90) hits++; } return hits; }); return rows; });
 ok(hs[2]>hs[0]+3&&hs[3]>hs[1]+3,'R2.7 hold-short solid lines face the apron, dashed face the runway ('+hs.join(',')+')');
 await shot('17_runway_faa');
 // ---- a second cadet; the first appears in the lounge
 await ev(()=>{ G.go('title',{},true); }); await wait(300);
 await tapR(()=>G.scene.layout().btns.find(b=>b.id==='signup')); await wait(300);
 await ev(()=>{ if(G.sceneName==='terms'){ G.HFQ.acceptTerms('QA','lead'); G.HFQ.recordPledge('QA'); G.go('signup',{termsOk:true,pledged:true},true); } }); await wait(200);
 await page.locator('input.gfield').fill('ZIPPY WREN'); await tapR(()=>G.scene.nextBtn()); await wait(200);
 await page.locator('input.gfield').fill('5555'); await wait(300); await page.locator('input.gfield').fill('5555'); await wait(900);
 await tapR(()=>G.scene.layout().btns.find(b=>b.id==='done')); await wait(700);
 await tapR(()=>G.scene.layout().btn); await wait(800); await tapR(()=>G.scene.btns&&G.sceneName==='placement'?G.scene.btns().find(b=>b.id==='new'):null); await wait(700);
 await ev(()=>G.go('world',{room:'lounge'},true)); await wait(500);
 ok(await ev(()=>G.scene.crowd.length===1&&G.scene.crowd[0].name!=='ZIPPY WREN'),'18 the first cadet hangs out in the second cadet’s lounge');
 await shot('13_lounge_crowd');
 await ev(()=>G.go('squadron',{back:'world'},true)); await wait(400); await shot('14_squadron');
 ok(await ev(()=>{ G.scene.tab='cadets'; return G.scene.items().length===3&&G.HFQ.cadets().length===2; }),'19 SQUADRON (the Crew Board’s CADETS tab) lists both cadets');
 // ---- family lead resets the second cadet's PIN
 await ev(()=>{ G.go('title',{},true); }); await wait(300);
 await ev(()=>{ G.loginAs(G.roster.accounts[0]); G.go('settings',{back:'home'},true); }); await wait(300);
 ok(await ev(()=>!!G.scene.rows().find(r=>r.id==='pins')),'20 the Family Lead sees RESET SOMEONE’S PIN');
 await tapR(()=>G.scene.rows().find(r=>r.id==='pins')); await wait(200); await shot('15_pin_reset');
 await tapR(()=>G.scene.m.rects().btns[0]); await wait(200);
 ok(await ev(()=>G.roster.accounts[1].pinH===null),'21 the PIN is cleared');
 await ev(()=>{ G.go('title',{},true); }); await wait(300);
 await tapR(()=>G.scene.layout().btns.find(b=>b.id==='login')); await wait(400);
 await tapV(130,62+60+27); await wait(300);
 await page.locator('input.gfield').fill('7777'); await wait(300); await page.locator('input.gfield').fill('7777'); await wait(900);
 ok(await scene()==='world'&&await ev(()=>G.activeAcct.name==='ZIPPY WREN'),'22 the cadet picks a new PIN and is in');
 await b.close();
 console.log(results.join('\n')); if(errors.length) console.log('\nERRORS:\n'+errors.join('\n'));
 const f=results.filter(r=>r.startsWith('FAIL')).length; console.log('\n'+(results.length-f)+'/'+results.length+' passed'+(errors.length?', '+errors.length+' page errors':''));
 process.exit(f||errors.length?1:0);
})();
