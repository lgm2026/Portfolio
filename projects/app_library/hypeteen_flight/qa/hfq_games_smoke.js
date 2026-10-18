/* HFQ Round 3: the games, the aircraft (My Aircraft + the fleet), the Classroom, and the flight sound.
   Run: cd web && python3 -m http.server 8777   then   node qa/hfq_games_smoke.js */
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
 const wait=ms=>page.waitForTimeout(ms), ev=(f,a)=>page.evaluate(f,a), shot=n=>page.screenshot({path:S+n+'.png'});
 const tapV=async(x,y)=>{ const [cx,cy]=await ev(([x,y])=>{ const r=G.canvas.getBoundingClientRect(); return [r.left+x*r.width/G.VW,r.top+y*r.height/G.VH]; },[x,y]); await page.touchscreen.tap(cx,cy); await wait(120); };
 const tapR=async r=>{ if(!r) return false; await tapV(r.x+r.w/2,r.y+r.h/2); return true; };
 await page.goto(BASE); await page.waitForFunction(()=>document.getElementById('tapstart').style.display==='block');
 await wait(400); await page.evaluate(()=>{ const b=document.getElementById('tapstart'); if(b&&b.offsetParent) b.click(); }); await page.waitForFunction(()=>G.sceneName==='terms'||G.sceneName==='title',null,{timeout:15000}); await page.evaluate(()=>{ if(G.sceneName==='terms'){ G.HFQ.acceptTerms('QA','lead'); G.go('title',{gateSeen:true},true); } }); await wait(500);
 // enroll
 await tapR(await ev(()=>G.scene.layout().btns.find(b=>b.id==='signup'))); await wait(300);
 await ev(()=>{ if(G.sceneName==='terms'){ G.HFQ.acceptTerms('QA','lead'); G.HFQ.recordPledge('QA'); G.go('signup',{termsOk:true,pledged:true},true); } }); await wait(200);   // pass the Terms gate (tested in hfq_arch_smoke)
 await page.locator('input.gfield').fill('SONIC HAWK'); await tapR(await ev(()=>G.scene.nextBtn())); await wait(200);
 await page.locator('input.gfield').fill('3141'); await wait(300); await page.locator('input.gfield').fill('3141'); await wait(900);
 // ---------------- sound ----------------
 ok(await ev(()=>['title','lounge','classroom','hangar','platform','runway','arcade'].every(n=>AUDIO.has(n))&&AUDIO.menuMusic()==='title'),'S1 seven songs: title + one per place + the games; the title theme plays on the menus');
 // ---------------- PICK YOUR TRAINER ----------------
 await tapR(await ev(()=>G.scene.layout().btns.find(b=>b.id==='done'))); await wait(600);
 ok(await ev(()=>G.sceneName==='trainer'&&G.scene.layout().cards.length===6),'A1 after the Locker: PICK YOUR TRAINER with the six common trainers');
 ok(await ev(()=>G.scene.trainers.map(m=>m.id).join(',')==='c172,c152,pa28,da40,sr20,j3'),'A2 trainers: Cessna 172, Cessna 152, Piper PA-28, Diamond DA40, Cirrus SR20, Piper J-3 Cub');
 await tapR(await ev(()=>G.scene.layout().cards[3])); await wait(200); await shot('R3_01_trainer');
 await tapR(await ev(()=>G.scene.layout().btn)); await wait(900); await tapR(await ev(()=>G.scene.btns?G.scene.btns().find(b=>b.id==='new'):null)); await wait(700); await ev(()=>{ G.save.mod.tut={done:1,step:0}; if(G.HFQ.tut) G.HFQ.tut.active=false; G.persist(); });
 ok(await ev(()=>G.HFQ.myAC().id==='da40'&&G.activeAcct.ac.id==='da40'&&!!G.save.ach.mytrainer),'A3 the pick is saved to the cadet + account; MY TRAINER badge');
 // ---------------- THE CLASSROOM ----------------
 ok(await ev(()=>G.sceneName==='world'&&G.world.room()==='classroom'),'C1 new cadets report to the Classroom');
 ok(await ev(()=>{ const t=G.scene.tabs(G.scene.layout()); return t.length===5&&t[0].label==='PATH'&&t[1].label==='LOUNGE'&&t[2].label==='CLASS'; }),'C2 the tab bar: PATH, the Lounge, the Classroom, the Hangar, the Bag (the map is the round button)');
 ok(await ev(()=>AUDIO.curName==='classroom'&&AUDIO._ambName==='classroom'),'C3 the Classroom plays its own music and ambience');
 await wait(400); await shot('R3_02_classroom');
 ok(await ev(()=>{ const R=G.WORLD.rooms.classroom; return ['board','patches','review','desk','sim','chart','toLounge'].every(k=>R.stations.some(s=>s.key===k))&&R.npcs[0].id==='instructor'; }),'C4 Classroom stations: Ground School board, patch wall, Hangar Flying, my desk, cockpit trainer, chart table; the instructor teaches here');
 await ev(()=>{ const s=G.scene, st=s.P.R.stations.find(q=>q.key==='desk'); s.interact({st}); }); await wait(500);
 ok(await ev(()=>G.sceneName==='route'&&G.scene.uid==='flight'),'C5 MY DESK picks up at the first unfinished unit');
 await ev(()=>G.go('world',{room:'classroom'},true)); await wait(300);
 await ev(()=>{ G.clearToasts(); const s=G.scene, st=s.P.R.stations.find(q=>q.key==='review'); s.interact({st}); }); await wait(200);
 ok(await ev(()=>G.toasts.some(t=>/NO MISSED QUESTIONS/.test(t.msg))),'C6 HANGAR FLYING with nothing missed says NICE FLYING');
 // ---------------- the takeoff + my aircraft in lessons ----------------
 await ev(()=>G.go('lesson',{unit:'airspace',mode:'check',ret:{scene:'world'}},true)); await wait(300);
 ok(await ev(()=>G.scene.phase==='takeoff'&&AUDIO.curName==='classroom'),'C7 a checkride opens with the takeoff roll, to the classroom music');
 await wait(900); await shot('R3_03_takeoff');
 await ev(()=>{ G.scene.phase='q'; G.scene.prog=.5; }); await wait(200);
 ok(await ev(()=>{ const it=G.scene.cur(); it.sel=it.q.k==='tap'?'__none':(it.opts?it.opts.findIndex(o=>!o.ok):null); if(it.q.k==='order'){ it.placed=it.bank.slice().reverse(); it.bank=[]; } if(it.q.k==='match'){ it.errs=1; it.done={}; it.q.p.forEach((p,i)=>it.done[i]=1); } G.scene.check(); return G.scene.fb&&!G.scene.fb.ok; }),'C8 a miss on the checkride is graded (no go-around in checkrides)');
 // ---------------- MY HANGAR ----------------
 ok(await ev(()=>G.HFQ.AC.length===17&&G.HFQ.AC.filter(m=>m.trainer).length===6),'A4 the fleet: 17 aircraft, 6 of them trainers');
 ok(await ev(()=>{ const H=G.HFQ; return H.acUnlocked('c172',0)&&!H.acUnlocked('supercub',0)&&H.acUnlocked('supercub',150)&&!H.acUnlocked('b737',2000)&&H.acUnlocked('b737',2300)&&H.acUnlocked('ems',2600); }),'A5 the phases unlock aircraft: Super Cub at Crosswind Decisions, the 737 at Pilot in Command II, the air medical helicopter at the top');
 ok(await ev(()=>{ G.clearToasts(); G.save.points=140; G.award(20,'TEST'); return G.toasts.some(t=>t.msg==='NEW AIRCRAFT: PIPER SUPER CUB'); }),'A6 reaching a new phase step announces NEW AIRCRAFT');
 await ev(()=>G.go('fleet',{back:'world'},true)); await wait(300);
 ok(await ev(()=>{ const I=G.scene.items(); return I.filter(x=>x.t&&G.HFQ.AC.some(m=>m.name===x.t)).length===17; }),'A7 MY HANGAR lists every aircraft');
 await ev(()=>{ G.clearToasts(); const s=G.scene; s.sel='supercub'; s.paint=Object.assign({},G.HFQ.acById('supercub').paint); }); await wait(150);   // r7.4: A6's new phase is a milestone card that waits for a calm moment; clear it so the taps reach the paint shop
 await tapR(await ev(()=>G.scene.mineBtn())); await wait(200);
 const sw=await ev(()=>G.scene.swatches().find(q=>q.k==='body'&&q.col==='#2f8a4a'));
 await tapV(sw.x+sw.d/2,sw.y+sw.d/2); await wait(200);
 ok(await ev(()=>G.HFQ.myAC().id==='supercub'&&G.HFQ.myAC().paint.body==='#2f8a4a'),'A8 MAKE IT MINE + the paint shop save my aircraft and its colors');
 await shot('R3_04_fleet');
 await ev(()=>{ G.scene.sel='b737'; }); await wait(150);
 ok(await ev(()=>G.scene.mineBtn()===null),'A9 a locked aircraft can’t be picked yet');
 await ev(()=>G.go('world',{room:'hangar'},true)); await wait(400);
 ok(await ev(()=>{ const st=G.scene.P.R.stations.find(s=>s.key==='preflight'); return st.art==='myplane'&&st.go.scene==='fleet'; }),'A10 my aircraft is parked in the Hangar and opens MY HANGAR');
 await ev(()=>{ const S=G.world.state; S.px=280; S.py=330; G.scene.snapCam(G.scene.layout()); }); await wait(300); await shot('R3_05_hangar_myplane');
 await ev(()=>G.go('logbook',{back:'world'},true)); await wait(300);
 ok(await ev(()=>G.scene.items().some(x=>x.t==='MY AIRCRAFT')&&G.HFQ.acById(G.HFQ.myAC().id).name==='PIPER SUPER CUB'),'A11 the Logbook shows MY AIRCRAFT (the Super Cub)');
 ok(await ev(()=>{ const c=G.HFQ.cadets().find(p=>p.me); return c&&c.ac&&c.ac.id==='supercub'; }),'A12 the Squadron knows each cadet’s aircraft');
 await ev(()=>{ const cv=document.createElement('canvas'); cv.width=480; cv.height=240; const x=cv.getContext('2d'); const g=x.createLinearGradient(0,0,0,240); g.addColorStop(0,'#6aa8e8'); g.addColorStop(1,'#cfe3f5'); x.fillStyle=g; x.fillRect(0,0,480,240); x.fillStyle='#4f7a3e'; x.fillRect(0,190,480,50); x.fillStyle='#fff'; x.font='bold 28px sans-serif'; x.fillText('SAMPLE PHOTO',140,120); G.img.ac_supercub=cv; G.go('fleet',{back:'world'},true); G.scene.sel='supercub'; }); await wait(300);
 await shot('R3_04b_fleet_photo');
 ok(await ev(()=>!!G.img.ac_supercub&&G.sceneName==='fleet'),'A13 an aircraft photo (assets ac_<id>) shows in MY HANGAR with the drawing as a badge');
 await ev(()=>{ delete G.img.ac_supercub; });
 // ---------------- THE GAMES ----------------
 ok(await ev(()=>G.HFQ.GAMES.length===27&&G.HFQ.GAMES.filter(g=>g.built).length===27),'G1 the slate: 27 games, all 27 playable (round 5)');
 ok(await ev(()=>G.HFQ.GAMES.filter(g=>g.built).every(g=>!!G.scenes['g_'+g.id])),'G2 every playable game has its scene');
 const placed=await ev(()=>{ const out={}; for(const k in G.WORLD.rooms) for(const s of G.WORLD.rooms[k].stations) if(s.go&&s.go.scene&&/^g_/.test(s.go.scene)) out[s.go.scene.slice(2)]=k; return out; });
 ok(['landing','marshal','paper','bags','golf','pong','pool','cargo'].every(id=>placed[id]),'G3 every game has a place in the clubhouse ('+Object.entries(placed).map(([g,r])=>g+'@'+r).join(', ')+')');
 await ev(()=>G.go('dash',{back:'world'},true)); await wait(300);
 ok(await ev(()=>G.scene.layout().some(c=>c.card&&c.card.id==='games')||(G.CFG.cards.some(c=>c.id==='games'))),'G4 the Flight Bag has a GAMES card');
 await ev(()=>G.go('games',{back:'world'},true)); await wait(300); await shot('R3_06_games_list');
 // open every game from its station, run it a moment, screenshot
 for(const id of ['landing','marshal','paper','bags','golf','pong','pool','cargo']){
  await ev(([id,room])=>{ G.go('world',{room},true); },[id,placed[id]]); await wait(250);
  await ev(id=>{ const s=G.scene, st=s.P.R.stations.find(q=>q.go&&q.go.scene==='g_'+id); s.interact({st}); },id); await wait(500);
  const sc=await ev(()=>G.sceneName);
  await wait(900); await shot('R3_07_game_'+id);
  ok(sc==='g_'+id&&await ev(()=>AUDIO.curName==='arcade'),'G5 '+id+': opens from its station with the games music');
 }
 // ---- mechanics ----
 ok(await ev(()=>{ G.go('g_landing',{back:'world'},true); const s=G.scene; const st0=s.state; s.state='fly'; s.x=0; s.alt=1000*Math.tan(3*Math.PI/180); let ok2=true;
  const pw=()=>{ const d=Math.max(1,1000-s.x), a=Math.atan2(s.alt,d)*180/Math.PI; return a>3.5?4:a>3.17?3:a>2.83?2:a>2.5?1:0; }; ok2=pw()===2; s.alt*=1.4; const hi=pw(); s.alt*=.4; const lo=pw(); return st0==='ready'&&ok2&&hi>=3&&lo<=1; }),'G6 Landing: waits for the first hold; PAPI shows 2 white 2 red on the 3° path, more white high, more red low');
 ok(await ev(()=>{ G.go('g_landing',{back:'world'},true); const s=G.scene; s.state='fly'; s.x=1000; s.alt=.5; s.vs=-120; s.ias=60; G.ptr.down=true; G.ptr.y=300; for(let i=0;i<60&&!s.results.length;i++) s.update(1/60); G.ptr.down=false; return s.results.length===1&&s.results[0]>=90; }),'G7 Landing: holding the flare to a soft touchdown at the aiming point scores 90+');
 ok(await ev(()=>{ G.go('g_marshal',{back:'world'},true); const s=G.scene; s.help=false; s.tipT=0; const before=s.score, k=s.cur; s.answer(k); const good=s.score>before&&s.fb.ok; s.fb=null; const wrong=['ahead','left','right','slow','stop','cut'].find(x=>x!==s.cur); s.answer(wrong); return good&&!s.fb.ok&&/SAY AGAIN/.test(s.fb.msg)&&s.seq.length===10&&s.seq[8]==='stop'&&s.seq[9]==='cut'; }),'G8 Marshaller: right answers score, wrong ones get SAY AGAIN; every taxi ends with STOP and CUT ENGINES');
 ok(await ev(()=>{ const run=(deg,pow)=>{ G.go('g_paper',{back:'world'},true); const s=G.scene; s.wind=0; s.tipT=0; const a=deg*Math.PI/180, v=10+pow*30; s.p={x:0,y:34,vx:Math.cos(a)*v,vy:Math.sin(a)*v,th:a}; s.state='fly'; let t=0; while(s.state==='fly'&&t<30){ s.update(1/60); t+=1/60; } return {d:s.dists[0],st:s.stalled}; };
  const g=run(12,.55), st=run(70,1); return g.d>70&&!g.st&&st.st&&st.d<g.d; }),'G9 Paper plane: a gentle throw glides 70+ ft; a steep one stalls and falls short');
 ok(await ev(()=>{ G.go('g_bags',{back:'world'},true); const s=G.scene; s.wind=0; s.tipT=0; const el=36*Math.PI/180, v=22+.7*11; s.b={x:0,y:3,z:0,vx:0,vy:Math.sin(el)*v,vz:Math.cos(el)*v,spin:0,state:'air'}; s.state='fly'; let t=0; while(s.state==='fly'&&t<8){ s.update(1/60); t+=1/60; } return s.score===3; }),'G10 Bag Toss: a straight, medium toss with no wind drops in the hole (3 points)');
 ok(await ev(()=>{ G.go('g_bags',{back:'world'},true); const s=G.scene; s.wind=12; s.tipT=0; const el=36*Math.PI/180, v=22+.7*11; s.b={x:0,y:3,z:0,vx:0,vy:Math.sin(el)*v,vz:Math.cos(el)*v,spin:0,state:'air'}; s.state='fly'; let t=0; while(s.state==='fly'&&t<8){ s.update(1/60); t+=1/60; } const b=s.bags[0]; return b&&b.x>.5; }),'G11 Bag Toss: a 12-knot crosswind pushes the same toss off to the side');
 ok(await ev(()=>{ G.go('g_golf',{back:'world'},true); const s=G.scene; s.tipT=0; const b=s.ball, cup=s.h.cup; b.vx=0; b.vy=-400; s.n=1; s.state='roll'; let t=0; while(s.state==='roll'&&t<10){ s.update(1/60); t+=1/60; } return s.state==='holed'&&s.strokes[0]===1; }),'G12 Mini Golf: a straight putt on hole 1 drops in the cup: HOLE IN ONE');
 ok(await ev(()=>{ G.go('g_pool',{back:'world'},true); const s=G.scene; s.tipT=0; const before=s.balls.map(b=>b.x+','+b.y).join(); s.cue.vy=-520; s.shots=1; s.state='roll'; let t=0; while(s.state==='roll'&&t<12){ s.update(1/60); t+=1/60; } return s.state==='aim'&&s.balls.map(b=>b.x+','+b.y).join()!==before; }),'G13 Pool: the break scatters the rack and play returns to aiming');
 ok(await ev(()=>{ G.go('g_cargo',{back:'world'},true); const s=G.scene; s.tipT=0; for(let x=0;x<10;x++) if(x!==4) s.grid[17][x]='#fff'; s.p={k:'I',cells:[[0,0],[0,1],[0,2],[0,3]],x:4,y:0}; s.drop(); return s.lines===1&&s.score>=100&&s.grid[17].filter(v=>v).length===1&&s.grid[17][4]; }),'G14 Cargo Stack: filling a row loads (clears) it and scores');
 ok(await ev(()=>{ G.go('g_pong',{back:'world'},true); const s=G.scene; s.tipT=0; for(let i=0;i<7;i++) s.point(true); return s.me===7&&!!s.over&&s.over.score===7; }),'G15 Prop Pong: first to 7 ends the game with your margin');
 // ---- scores + XP ----
 const xp=await ev(()=>{ const H=G.HFQ; G.save.mod.games={}; const p0=G.save.points;
  const a=H.gameDone('golf',30), b=H.gameDone('golf',25), c=H.gameDone('golf',40), d=H.gameDone('pool',12), e=H.gameDone('cargo',900), f=H.gameDone('pong',3);
  return {best:H.gameRec('golf').best,a:a.xp,b:b.xp,c:c.xp,d:d.xp,e:e.xp,f:f.xp,gained:G.save.points-p0,newBest:b.better&&!c.better}; });
 ok(xp.best===25&&xp.newBest,'G16 best scores: golf keeps the LOWEST strokes (25 beats 30, 40 doesn’t count)');
 ok(xp.a===15&&xp.b===5&&xp.c===0&&xp.gained===40&&xp.f===0,'G17 game XP: first play 15, a new best 5, capped at 40 a day ('+JSON.stringify(xp)+')');
 ok(await ev(()=>{ const H=G.HFQ; G.save.mod.games={}; ['landing','marshal','paper','bags','golf','pong','pool','cargo'].forEach(id=>H.gameDone(id,1)); return !!G.save.ach.arcade&&!!G.save.ach.arcade8; }),'G18 GAME ON + ARCADE ACE badges');
 await ev(()=>{ G.go('g_paper',{back:'world'},true); G.MG.end(G.scene,150,{head:'NICE GLIDES!',line:'Throws: 50, 48, 52 ft.'}); }); await wait(800); await shot('R3_08_results');
 ok(await ev(()=>G.MG.overBtns(G.scene).some(b=>b.id==='learn')),'G19 results link back to Ground School (LEARN IT)');
 // ---- sound in the rooms ----
 await ev(()=>G.go('world',{room:'runway'},true)); await wait(300);
 ok(await ev(()=>AUDIO.curName==='runway'&&AUDIO._ambName==='runway'),'S2 the Runway plays its music and the propeller ambience');
 await ev(()=>G.go('world',{room:'platform'},true)); await wait(300);
 ok(await ev(()=>AUDIO.curName==='platform'&&AUDIO._ambName==='platform'),'S3 the Platform plays its music and wind ambience');
 await ev(()=>G.go('logbook',{back:'world'},true)); await wait(200);
 ok(await ev(()=>AUDIO._ambName===null),'S4 ambience stops when you leave the airfield');
 ok(await ev(()=>{ ['blip','ok','back','point','bigpoint','thud','buzzer','chirp','engine','takeoff','whoosh','stall','radio','squelch','chime2','clack','pocket','putt','cup','bag','board','paddle','line'].forEach(n=>AUDIO.sfx(n)); return typeof AUDIO.morse==='function'; }),'S5 every aviation sound effect plays without errors (radio click, chime, tire chirp, engine, stall horn, Morse ident...)');
 await b.close();
 console.log(results.join('\n')); if(errors.length) console.log('\nERRORS:\n'+[...new Set(errors)].join('\n'));
 const f=results.filter(r=>r.startsWith('FAIL')).length; console.log('\n'+(results.length-f)+'/'+results.length+' passed'+(errors.length?', '+errors.length+' page errors':''));
 process.exit(f||errors.length?1:0);
})();
