/* HFQ Round 4: the airfield map, the Tower / Parking Stand / Wash Rack, CALL THE TOWER (weather, ATIS, radio calls,
   voice setting), the Hall of Flight aircraft (spot to unlock), and the nine new games, each played to the end.
   Run: cd web && python3 -m http.server 8777   then   node qa/hfq_r4_smoke.js */
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
 await tapR(await ev(()=>G.scene.layout().btns.find(b=>b.id==='signup'))); await wait(300);
 await ev(()=>{ if(G.sceneName==='terms'){ G.HFQ.acceptTerms('QA','lead'); G.HFQ.recordPledge('QA'); G.go('signup',{termsOk:true,pledged:true},true); } }); await wait(200);   // pass the Terms gate (tested in hfq_arch_smoke)
 await page.locator('input.gfield').fill('ROTOR SCOUT'); await tapR(await ev(()=>G.scene.nextBtn())); await wait(200);
 await page.locator('input.gfield').fill('2718'); await wait(300); await page.locator('input.gfield').fill('2718'); await wait(900);
 await tapR(await ev(()=>G.scene.layout().btns.find(b=>b.id==='done'))); await wait(500);
 await tapR(await ev(()=>G.scene.layout().cards[0])); await wait(150); await tapR(await ev(()=>G.scene.layout().btn)); await wait(900); await tapR(await ev(()=>G.scene.btns?G.scene.btns().find(b=>b.id==='new'):null)); await wait(700); await ev(()=>{ G.save.mod.tut={done:1,step:0}; if(G.HFQ.tut) G.HFQ.tut.active=false; G.persist(); });

 /* ---------------- THE AIRFIELD ---------------- */
 ok(await ev(()=>['tower','ramp','wash'].every(k=>G.WORLD.rooms[k])&&Object.keys(G.WORLD.rooms).length===9),'P1 nine places: the Tower, the Parking Stand, the Wash Rack and the Game Room join the five');
 ok(await ev(()=>{ const t=G.scene.tabs(G.scene.layout()); return t.map(x=>x.label).join(',')==='PATH,LOUNGE,CLASS,HANGAR,FLIGHT BAG'&&!!G.scene.mapBtn(G.scene.layout()); }),'P2 tab bar: Path, Lounge, Class, Hangar, Flight Bag; the map is the round button in the room');
 ok(await ev(()=>{ // every place is reachable by walking through doors
  const R=G.WORLD.rooms, seen=new Set(['lounge']), q=['lounge']; while(q.length){ const k=q.shift(); for(const s of R[k].stations) if(s.go&&s.go.room&&!seen.has(s.go.room)){ seen.add(s.go.room); q.push(s.go.room); } } return seen.size===9; }),'P3 every place connects by doors (walkable without the map)');
 ok(await ev(()=>{ const R=G.WORLD.rooms; for(const k in R) for(const s of R[k].stations){ const g=s.go||{}; if(g.scene&&!G.scenes[g.scene]) return k+':'+s.key; if(g.room&&g.at&&!R[g.room].stations.some(q=>q.key===g.at)) return k+':'+s.key; if(g.page&&!G.CFG.pages[g.page]) return k+':'+s.key; } return true; })===true,'P4 every station opens a real scene, page or door (no dead ends)');
 await ev(()=>G.go('world',{room:'ramp'},true)); await wait(400);
 ok(await ev(()=>{ const t=G.scene.tabs(G.scene.layout()); return !t.some(x=>x.on)&&!!G.scene.mapBtn(G.scene.layout()); }),'P5 in a place without a tab (the Parking Stand) no tab lights up and the MAP button is there');
 ok(await ev(()=>AUDIO.curName==='ramp'),'P6 the Parking Stand plays the ramp song');
 await shot('R4_01_ramp');
 await ev(()=>G.go('world',{room:'tower'},true)); await wait(400);
 ok(await ev(()=>AUDIO.curName==='tower'&&AUDIO._ambName==='tower'),'P7 the Tower plays its own song and ambience');
 await shot('R4_02_tower');
 await ev(()=>G.go('world',{room:'wash'},true)); await wait(400);
 ok(await ev(()=>AUDIO._ambName==='wash'),'P8 the Wash Rack has its water ambience');
 // the MAP tab
 await tapR(await ev(()=>G.scene.mapBtn(G.scene.layout()))); await wait(500);
 ok(await ev(()=>G.sceneName==='map'&&G.scene.here==='wash'&&G.HFQ.mapPlaces.length===9),'M1 MAP opens the airfield diagram, YOU ARE HERE at the Wash Rack, 9 places');
 await shot('R4_03_map');
 const pin=await ev(()=>{ const B=G.scene.box(), p=G.HFQ.mapPlaces.find(q=>q.room==='tower'), [px,py]=G.HFQ.mapProject(p.x,p.z); return {x:B.x+px*B.s-4,y:B.y+py*B.s-4,w:8,h:8}; });
 await tapR(pin); await wait(200);
 ok(await ev(()=>G.scene.sel==='tower'),'M2 tapping a place selects it and shows what’s there');
 await tapR(pin); await wait(600);
 ok(await ev(()=>G.sceneName==='world'&&G.world.room()==='tower'),'M3 tapping it again goes there');
 // CALL TOWER button
 const fab=await ev(()=>G.scene.fabRect(G.scene.layout()));
 ok(!!fab,'F1 a CALL TOWER button floats over every place');
 await tapR(fab); await wait(500);
 ok(await ev(()=>G.sceneName==='radio'),'F2 CALL TOWER opens the radio');

 /* ---------------- WEATHER + THE RADIO ---------------- */
 ok(await ev(()=>{ const H=G.HFQ, r=H.rng(42); for(const cat of ['VFR','MVFR','IFR','LIFR']) for(let i=0;i<300;i++){ const w=H.wx.make(r,{cat}); if(H.wx.cat(w)!==cat) return cat+' '+H.wx.metar(w); } return true; })===true,'W1 1,200 generated reports all land in the category asked for (FAA/NWS flight-category rules)');
 ok(await ev(()=>{ const H=G.HFQ, r=H.rng(7), re=/^KHFQ \d{6}Z (\d{5}(G\d{2})?KT|00000KT) [\d\/ ]+SM( (BR|FG|-RA|RA|HZ|-SN))?( (CLR|(FEW|SCT|BKN|OVC)\d{3}))+ M?\d{2}\/M?\d{2} A\d{4}$/; for(let i=0;i<300;i++){ const m=H.wx.metar(H.wx.make(r)); if(!re.test(m)) return m; } return true; })===true,'W2 every METAR follows the standard format (station, time Z, wind, visibility, weather, sky, temp/dew, altimeter)');
 ok(await ev(()=>{ const w=G.HFQ.wx.today(); return (w.wspd===0||w.wdir>180)?w.rwy==='27':w.rwy==='9'; }),'W3 the runway in use follows today’s wind (take off into the wind)');
 ok(await ev(()=>{ const H=G.HFQ, w=H.wx.today(), a=H.wx.atis(w); return a.t.indexOf('INFORMATION '+w.letter)>=0&&a.t.indexOf('RUNWAY '+w.rwy)>=0&&/niner|two|seven/.test(a.s); }),'W4 the ATIS gives the letter + runway, and is spoken digit by digit');
 ok(await ev(()=>G.setting('voice')===true&&G.CFG.settingsToggles.some(t=>t.id==='voice'&&t.label==='TOWER VOICE')),'V1 TOWER VOICE is a setting, on by default');
 // a full radio call by tapping: ATIS, then Ground taxi call, readback
 const head=async f=>tapR(await ev(f=>G.HFQ.drawRadioHead.__btns.find(b=>b.id==='f:'+f),f));
 const fb=async id=>tapR(await ev(id=>{ const s=G.scene; return s.flow.buttons(s.area()).find(b=>b.id===id); },id));
 await head('atis'); await wait(300); await ev(()=>{ G.scene.flow.wait=0; }); await wait(80);
 ok(await ev(()=>G.scene.flow.log.some(l=>l.who.indexOf('ATIS')===0)),'R1 tuning ATIS plays today’s broadcast');
 await fb('next'); await wait(150); await head('ground'); await wait(250);
 await tapR(await ev(()=>{ const a=G.scene.area(); return {x:a.x,y:a.y+30,w:a.w,h:38}; })); await wait(250);
 for(let k=0;k<4;k++){ await fb(await ev(()=>{ const F=G.scene.flow, sl=F.cur().slots[F.sel.length]; return 'chip:'+sl.opts.indexOf(sl.ok); })); await wait(120); }
 await fb('ptt'); await wait(300);
 for(let i=0;i<40;i++){ if(await ev(()=>{ const F=G.scene.flow, s=F.cur(); return s&&s.k==='readback'&&F.wait<=0&&!F._replyHold; })) break; await ev(()=>{ const F=G.scene.flow; F.wait=Math.min(F.wait,.05); }); await wait(120); }
 ok(await ev(()=>{ const L=G.scene.flow.log; return L.some(l=>l.who==='YOU'&&/READY TO TAXI WITH/.test(l.t))&&L.some(l=>/TAXI VIA ALPHA, HOLD SHORT OF RUNWAY/.test(l.t)); }),'R2 who-who-where-what call built by tapping; ground answers with runway, route and hold short');
 await fb(await ev(()=>'opt:'+G.scene.flow.cur().opts.findIndex(o=>!o.ok))); await wait(150);
 ok(await ev(()=>G.scene.flow.fb&&!G.scene.flow.fb.ok),'R3 a readback without the hold short is caught');
 await ev(()=>{ G.scene.flow.fb=null; G.scene.flow.picked=null; }); await fb(await ev(()=>'opt:'+G.scene.flow.cur().opts.findIndex(o=>o.ok))); await wait(1900);
 ok(await ev(()=>G.sceneName==='radio'&&G.scene.mode==='done'&&!!G.save.ach.radio),'R4 a correct readback finishes the call; ON FREQUENCY badge');
 await shot('R4_04_radio_done');

 /* ---------------- THE HALL OF FLIGHT ---------------- */
 ok(await ev(()=>{ const H=G.HFQ, L=H.HALL, ids=new Set(L.map(m=>m.id)); return L.length===45&&ids.size===45&&L.every(m=>m.facts.length===2&&m.clue&&H.HALL_CATS.includes(m.cat)&&m.year&&!H.AC.some(a=>a.id===m.id)); }),'H1 45 Hall of Flight aircraft from the guide (r7.4 adds eight rotorcraft) (plus the 172 + PA-28 already in the fleet), each with 2 facts, a clue and a year');
 ok(await ev(()=>{ const c=document.createElement('canvas').getContext('2d'); for(const m of G.HFQ.HALL){ G.HFQ.drawAC(c,m.id,0,0,240,120,null,{prop:'spin',t:1,fly:true}); } return true; }),'H2 every aircraft draws, animated (propellers, rotors, flames)');
 ok(await ev(()=>{ const H=G.HFQ; if(H.acUnlocked('dr1')) return false; H.spot('dr1'); return H.acUnlocked('dr1')&&H.isSpotted('dr1'); }),'H3 Hall aircraft are locked until spotted, then unlocked');
 ok(await ev(()=>{ G.HFQ.setMyAC('dr1'); return G.HFQ.myAC().id==='dr1'&&G.activeAcct.ac.id==='dr1'; }),'H4 a spotted aircraft becomes MY AIRCRAFT (the avatar)');
 await ev(()=>G.go('fleet',{back:'world'},true)); await wait(400);
 ok(await ev(()=>G.scene.items().some(i=>i.t==='HALL OF FLIGHT')),'H5 the hangar gallery lists the Hall of Flight by category');
 await shot('R4_05_fleet_dr1');
 await ev(()=>G.HFQ.setMyAC('c172'));

 /* ---------------- THE GAMES ---------------- */
 ok(await ev(()=>{ const H=G.HFQ, g=H.GAMES.filter(x=>x.built); return g.length>=17&&g.every(x=>G.scenes['g_'+x.id]); }),'G0 17+ games built, every one with a scene (27 since Round 5)');
 const over=async()=>ev(()=>!!(G.scene&&G.scene.over));
 // PLANE SPOTTER
 await ev(()=>G.go('g_spot',{back:'world'},true)); await wait(400);
 const sp0=await ev(()=>Object.keys(G.save.mod.cadet.spotted||{}).length);
 for(let i=0;i<8;i++){ await ev(()=>{ const s=G.scene; s.answer(s.o.findIndex(m=>m.id===s.m.id)); s.fb.t=1; }); await tapV(135,300); await wait(80); }
 ok(await over()&&await ev(()=>G.scene.right===8)&&await ev(()=>Object.keys(G.save.mod.cadet.spotted).length)>sp0,'G1 Plane Spotter: 8 named, new aircraft added to the hangar');
 await shot('R4_06_spot_over');
 // METAR DECODER
 await ev(()=>G.go('g_metar',{back:'world'},true)); await wait(300); await ev(()=>{ G.scene.help=false; });
 for(let i=0;i<10;i++){ await ev(()=>{ const s=G.scene, q=s.q; if(q.opts) s.answer(true,q.opts.indexOf(q.ok)); else s.answer(true,q.ans); s.fb.t=1; }); await tapV(135,300); await wait(60); }
 ok(await over()&&await ev(()=>G.scene.right===10&&G.scene.score>=600),'G2 METAR Decoder: 10 reports decoded');
 ok(await ev(()=>{ const H=G.HFQ, r=H.rng(11); for(let i=0;i<200;i++){ const w=H.wx.make(r); for(const p of H.wx.parts(w)) if(!H.wx.explain(p,w)) return false; } return true; }),'G2b every piece of every report has a kid-friendly explanation');
 // WEATHER CALL
 await ev(()=>G.go('g_wx',{back:'world'},true)); await wait(300); await ev(()=>{ G.scene.help=false; });
 for(let i=0;i<10;i++){ await tapR(await ev(()=>G.scene.btns().find(b=>b.id===G.scene.w.cat))); await ev(()=>{ G.scene.fb.t=1; }); await tapV(135,300); await wait(60); }
 ok(await over()&&await ev(()=>G.scene.right===10),'G3 Weather Call: 10 categories called by tapping VFR/MVFR/IFR/LIFR');
 // LIGHT GUN
 await ev(()=>G.go('g_lightgun',{back:'world'},true)); await wait(300); await ev(()=>{ G.scene.help=false; });
 ok(await ev(()=>{ const s=G.scene; return s.qs.some(q=>q.ctx==='air')&&s.qs.some(q=>q.ctx==='gnd'); }),'G4a Light Gun mixes ground and in-the-air signals');
 for(let i=0;i<12;i++){ await tapR(await ev(()=>{ const s=G.scene; return s.btns()[s.opts.indexOf(s.ok)]; })); await ev(()=>{ G.scene.fb.t=1; }); await tapV(135,300); await wait(60); }
 ok(await over()&&await ev(()=>G.scene.right===12),'G4 Light Gun Signals: 12 signals read (14 CFR 91.125)');
 // DEPARTURE + ARRIVAL: drive every step right
 for(const id of ['depart','arrive']){
  await ev(id=>G.go('g_'+id,{back:'world'},true),id); await wait(300);
  for(let n=0;n<80&&!(await over());n++){
   await ev(()=>{ const F=G.scene.flow, s=F.cur(); if(!s) return; if(F.wait>0.002||F._replyHold){ F.wait=0.001; return; } if(F.fb){ F.fb.t=0; return; } if(F.anim){ F.anim.t=99; return; }
    if(s.k==='tune') F.tune(s.freq);
    else if(s.k==='atis') F.press('next');
    else if(s.k==='build'){ if(F.sel.length<4){ const sl=s.slots[F.sel.length]; F.press('chip:'+sl.opts.indexOf(sl.ok)); } else F.press('ptt'); }
    else if(s.k==='readback'||s.k==='quiz') F.press('opt:'+s.opts.findIndex(o=>o.ok)); });
   await wait(70);
  }
  ok(await over()&&await ev(()=>G.scene.flow.score===G.scene.flow.max&&G.scene.flow.max>=1000),'G5 '+(id==='depart'?'Departure':'Arrival')+': every call and readback right first time = a perfect radio score');
  if(id==='arrive') await shot('R4_07_arrive_over');
 }
 ok(await ev(()=>{ const D=G.HFQ.callDefs('ramp'), w=G.HFQ.wx.today(); return D.inbound.reply().t.indexOf(w.rwy==='27'?'LEFT DOWNWIND':'RIGHT DOWNWIND')>=0; }),'G5b left traffic for runway 27, right traffic for runway 9 (the pattern stays south of the field)');
 // TAXI MAZE: follow the clearance, brake before the hold line
 await ev(()=>G.go('g_taxi',{back:'world'},true)); await wait(300);
 for(let n=0;n<400&&!(await over());n++){
  await ev(()=>{ const s=G.scene; if(s.state==='clear'){ s.clock=2; G.ptr.click=true; return; } if(s.state==='done'){ G.ptr.down=false; s.clock=3; G.ptr.click=true; return; }
   if(s.state==='choose'){ const want=s.lv.route[s.ri+1], b=s.choiceBtns().find(q=>q.id===want); s.choose(b); return; }
   if(s.onConnector()){ const y=s.pos()[1], B=s.brakeBtn(); if(y>224){ G.ptr.down=true; G.ptr.x=B.x+20; G.ptr.y=B.y+20; } else { G.ptr.down=false; if(s.k<.5) s.k+=.06; } } else { G.ptr.down=false; s.k=Math.min(1,s.k+.25); } });
  await wait(40);
 }
 ok(await over()&&await ev(()=>G.scene.turnsOK>=6&&G.scene.wrong===0&&G.scene.incursions===0),'G6 Taxi Maze: 3 clearances followed by the signs, stopped short of every hold line');
 await ev(()=>G.go('g_taxi',{back:'world'},true)); await wait(200);
 await ev(()=>{ const s=G.scene; s.state='roll'; s.at='a4'; s.to='r4'; s.k=.95; s.v=17; }); await wait(400);
 ok(await ev(()=>G.scene.incursions===1&&G.scene.fb&&/INCURSION/.test(G.scene.fb.msg)),'G6b rolling past the hold-short line is a runway incursion');
 // PREFLIGHT RACE
 await ev(()=>G.go('g_preflight',{back:'world'},true)); await wait(300);
 const first=await ev(()=>{ const s=G.scene, q=s.list[0], [x,y]=s.spot(q); return {x:x-3,y:y-3,w:6,h:6}; }); await tapR(first); await wait(150);
 ok(await ev(()=>!!G.scene.open),'G7a tapping a glowing spot opens its close-up');
 for(let i=0;i<10;i++){ await ev(()=>{ const s=G.scene; if(!s.open) s.open=s.list.find(q=>!q.done); s.answer(s.open.prob); s.fb.t=0; }); await wait(80); }
 ok(await over()&&await ev(()=>G.scene.found===4&&G.scene.missed===0),'G7 Preflight Race: all 10 checks, all 4 problems squawked');
 // WASH DAY: water before covers costs points; covers on, clean, covers off = sparkling
 await ev(()=>G.go('g_wash',{back:'world'},true)); await wait(300);
 await ev(()=>{ const s=G.scene, [x,y]=s.toS(...s.hot().static); s.tool='soap'; G.ptr.down=true; G.ptr.x=x; G.ptr.y=y; }); await wait(150); await ev(()=>{ G.ptr.down=false; });
 ok(await ev(()=>G.scene.pen.water===1),'G8a soap near an uncovered static port: WATER IN THE STATIC PORT penalty');
 await ev(()=>G.go('g_wash',{back:'world'},true)); await wait(300);
 for(const k of ['pitot','static']){ await ev(()=>{ G.scene.tool='cover'; }); const r=await ev(k=>{ const s=G.scene, [x,y]=s.toS(...s.hot()[k]); return {x:x-3,y:y-3,w:6,h:6}; },k); await tapR(r); await wait(100); }
 ok(await ev(()=>G.scene.covers.pitot&&G.scene.covers.static&&G.scene.coveredFirst===true),'G8b covers go on by tapping the pitot tube and static port');
 for(const [tool,kind] of [['bug','bug'],['soap','dirt'],['hose','suds'],['cloth','smudge']]){ await ev(t=>{ G.scene.tool=t; },tool);
  for(const i of await ev(k=>G.scene.spots.map((s,i)=>s.hp>0&&s.k===k?i:-1).filter(i=>i>=0),kind)){ await ev(i=>{ const s=G.scene, sp=s.spots[i]; const [x,y]=s.toS(sp.x,sp.y); G.ptr.down=true; G.ptr.x=x; G.ptr.y=y; },i); await wait(420); } await ev(()=>{ G.ptr.down=false; }); await wait(60); }
 ok(await ev(()=>G.scene.spots.every(s=>s.hp<=0)),'G8c bug remover, soap, hose and soft cloth clean every spot');
 for(const k of ['pitot','static']){ await ev(()=>{ G.scene.tool='cover'; }); const r=await ev(k=>{ const s=G.scene, [x,y]=s.toS(...s.hot()[k]); return {x:x-3,y:y-3,w:6,h:6}; },k); await tapR(r); await wait(100); }
 await tapR(await ev(()=>G.scene.doneBtn())); await wait(300);
 ok(await over()&&await ev(()=>G.scene.over.head==='SPARKLING!'),'G8 Wash Day: covers first, clean, covers off = SPARKLING');
 await shot('R4_08_wash_over');
 ok(await ev(()=>['spot','metar','wx','lightgun','depart','arrive','taxi','preflight','wash'].every(id=>!!(G.save.mod.games[id]&&G.save.mod.games[id].plays))),'G9 all nine Round 4 games recorded a score');
 /* ---------- THE FLIGHT LOG + THE CREW BOARD ---------- */
 const n0=await ev(()=>{ const a=G.HFQ.flog.totals().flights; G.HFQ.simFlight({title:'LESSON: TEST',min:4,ldg:1}); return {a,T:G.HFQ.flog.totals()}; });
 ok(n0.a===0&&n0.T.sim===1&&n0.T.flights===0&&n0.T.simLdg===1,'L1 the app logs lessons as sim flights; sim time never counts as real flights');
 await ev(()=>G.go('logflight',{back:'flightlog'},true)); await wait(300);
 await tapR(await ev(()=>{ const k=G.scene.kinds()[0]; return {x:12,y:k.y,w:G.VW-24,h:k.h}; })); await wait(300);
 await tapR(await ev(()=>G.scene.fields().next)); await wait(200);
 ok(await ev(()=>G.scene.step===1&&/PICK/.test(G.scene.err)),'L2 the form will not save without an aircraft and a route');
 await ev(()=>{ G.scene.e.ac={t:'BOEING 737',d:'b737'}; G.scene.e.fr='KJFK'; G.scene.e.to='KMYR'; }); await tapR(await ev(()=>G.scene.fields().next)); await wait(300);
 ok(await ev(()=>G.scene.step===2&&G.scene.step2().chips.length===12),'L3 step 2: seat + twelve what-I-saw chips (no free text needed)');
 await tapR(await ev(()=>G.scene.step2().chips[0])); await tapR(await ev(()=>G.scene.step2().save)); await wait(500);
 ok(await ev(()=>{ const T=G.HFQ.flog.totals(); return G.sceneName==='flightlog'&&T.flights===1&&T.pax===1&&T.airports===2&&!!G.save.ach.flightlog; }),'L4 a passenger flight is logged: 1 flight, 2 airports, LOGBOOK OPENED badge');
 await ev(()=>{ G.HFQ.flog.add({k:'dual',d:'2026-09-01',fr:'KHFQ',to:'KHFQ',ac:{t:'CESSNA 172 SKYHAWK',d:'c172'},min:45,ldg:3,did:['LANDINGS'],role:'dual'}); G.HFQ.flog.logged({k:'dual'}); });
 ok(await ev(()=>{ const T=G.HFQ.flog.totals(); return T.dual===1&&T.min===45&&T.ldg===3&&T.types===2; }),'L5 a training flight adds time, landings and an aircraft type to the totals');
 await shot('R4_09_flightlog');
 await ev(()=>G.go('crew',{back:'world',tab:'feed'},true)); await wait(600);
 ok(await ev(()=>{ const R=G.HFQ.feedRows(); return R.length>=4&&R.some(r=>/logged a flight as a passenger/.test(r.text))&&R.some(r=>/badge/.test(r.text))&&!R.some(r=>/KJFK|KMYR/.test(r.text)); }),'S1 the Crew Board filled itself: badges and “logged a flight”, never where');
 const kr=await ev(()=>G.HFQ.feedRows()[0].id); await ev(id=>{ const r=G.HFQ.feedRows().find(q=>q.id===id); G.HFQ.kudos(r); },kr); await wait(400);
 ok(await ev(id=>{ const r=G.HFQ.feedRows().find(q=>q.id===id); return r&&(r.kudos||[]).length===1&&G.HFQ.kudosFor(r.by)>=1; },kr),'S2 one-tap KUDOS lands on the line and counts for the cadet');
 ok(await ev(()=>{ const p=G.HFQ.cadets()[0]; return p.wkxp>0&&p.flights===2&&p.badges>0; }),'S3 the CADETS tab knows XP this week, flights logged and badges');
 await shot('R4_10_crewboard');
 await b.close();
 console.log(results.join('\n')); if(errors.length) console.log('\nERRORS:\n'+[...new Set(errors)].join('\n'));
 const f=results.filter(r=>r.startsWith('FAIL')).length; console.log('\n'+(results.length-f)+'/'+results.length+' passed'+(errors.length?', '+errors.length+' page errors':''));
 process.exit(f||errors.length?1:0);
})();
