/* HFQ Round 5: the last ten games (the slate is complete at 27), their places on the airfield, and the badges.
   Every game is driven to its results screen. Run: cd web && python3 -m http.server 8777   then   node qa/hfq_r5_smoke.js */
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
 // a click the game's update() sees, without going through the real pointer
 const press=(x,y)=>ev(([x,y])=>{ G.ptr.x=x; G.ptr.y=y; G.ptr.click=true; G.scene.update(1/60); G.ptr.click=false; },[x,y]);
 const over=async()=>ev(()=>!!(G.scene&&G.scene.over));
 const settle=async()=>{ await wait(600); await tapV(135,300); await wait(80); };
 await page.goto(BASE); await page.waitForFunction(()=>document.getElementById('tapstart').style.display==='block');
 await wait(400); await page.evaluate(()=>{ const b=document.getElementById('tapstart'); if(b&&b.offsetParent) b.click(); }); await page.waitForFunction(()=>G.sceneName==='terms'||G.sceneName==='title',null,{timeout:15000}); await page.evaluate(()=>{ if(G.sceneName==='terms'){ G.HFQ.acceptTerms('QA','lead'); G.go('title',{gateSeen:true},true); } }); await wait(500);
 await tapR(await ev(()=>G.scene.layout().btns.find(b=>b.id==='signup'))); await wait(300);
 await ev(()=>{ if(G.sceneName==='terms'){ G.HFQ.acceptTerms('QA','lead'); G.HFQ.recordPledge('QA'); G.go('signup',{termsOk:true,pledged:true},true); } }); await wait(200);   // pass the Terms gate (tested in hfq_arch_smoke)
 await page.locator('input.gfield').fill('KITE SCOUT'); await tapR(await ev(()=>G.scene.nextBtn())); await wait(200);
 await page.locator('input.gfield').fill('4826'); await wait(300); await page.locator('input.gfield').fill('4826'); await wait(900);
 await tapR(await ev(()=>G.scene.layout().btns.find(b=>b.id==='done'))); await wait(500);
 await tapR(await ev(()=>G.scene.layout().cards[0])); await wait(150); await tapR(await ev(()=>G.scene.layout().btn)); await wait(900); await tapR(await ev(()=>G.scene.btns?G.scene.btns().find(b=>b.id==='new'):null)); await wait(700); await ev(()=>{ G.save.mod.tut={done:1,step:0}; if(G.HFQ.tut) G.HFQ.tut.active=false; G.persist(); });

 /* ---------------- THE SLATE ---------------- */
 ok(await ev(()=>{ const g=G.HFQ.GAMES; return g.length===27&&g.every(x=>x.built&&G.scenes['g_'+x.id]); }),'S1 27 games on the slate, all 27 built, every one with a scene');
 ok(await ev(()=>['cloud','pairs','gauges','words','darts','hockey','radar4','skee','bowling','hoops'].every(id=>G.HFQ.gameById(id).built)),'S2 the ten Round 5 games are playable');
 ok(await ev(()=>{ const R=G.WORLD.rooms, has=(r,k)=>R[r].stations.some(s=>s.key===k); return ['darts','hockey','radar4','skee','bowling','hoops','pool','pong','bags','golf','cargo'].every(k=>has('gameroom',k))&&has('classroom','words')&&has('classroom','pairs')&&has('classroom','sim')&&has('platform','cloud'); }),'S3 the fun games live in the Game Room; the learning games stay on the airfield');
 ok(await ev(()=>{ const A=G.worldArt; return ['dartboard','bookshelf','hoop'].every(k=>A.wall[k])&&['hockey','skee','cardtable','lane'].every(k=>A.floor[k]); }),'S4 the new props have art: dartboard, bookshelf, hoop, hockey table, skee machine, card table, bowling lane');
 ok(await ev(()=>{ const R=G.WORLD.rooms.lounge, sp=R.spawn, inside=(f,p)=>p[0]>=f[0]&&p[0]<=f[2]&&p[1]>=f[1]&&p[1]<=f[3]; return !R.stations.filter(s=>s.foot).some(s=>inside(s.foot,sp)); }),'S5 the lounge spawn point is not inside any station footprint');
 ok(await ev(()=>CONFIG.cards.find(c=>c.id==='games').sub==='27 TO PLAY'),'S6 the Flight Bag GAMES card says 27 TO PLAY');
 ok(await ev(()=>{ const B=CONFIG.badges; return B.some(b=>b.id==='games17')&&B.some(b=>b.id==='games27'); }),'S7 badges: games17 (17 different games) and games27 (all 27)');
 ok(await ev(()=>/Twenty-seven games/.test(CONFIG.pages.about.body.join(' '))),'S8 the About page counts 27 games');

 /* ---------------- THE GAMES, PLAYED TO THE END ---------------- */
 // CLOUD SPOTTER: name, then meaning, 8 rounds
 await ev(()=>G.go('g_cloud',{back:'world'},true)); await wait(300);
 ok(await ev(()=>{ const s=G.scene; return s.stage==='name'&&s.opts.length===4&&s.opts.includes(s.ok); }),'G1 Cloud Spotter opens on NAME with four options');
 for(let i=0;i<8;i++){ const bt=await ev(()=>{ const s=G.scene; return s.btns()[s.opts.indexOf(s.ok)]; }); await press(bt.x+bt.w/2,bt.y+bt.h/2); await ev(()=>{ G.scene.fb.t=1; }); await tapV(135,300); await wait(60); }
 ok(await over()&&await ev(()=>G.scene.right===8&&G.scene.score>=480),'G2 Cloud Spotter: 8 of 8 (names and meanings) scores 480+');
 ok(await ev(()=>{ const s=G.scene; return s.seq.every(k=>/cumulus|stratus|cirrus|cumulonimbus|fog/.test(k.id))&&s.seq.some(k=>k.id==='cumulonimbus'&&/THUNDERSTORM/.test(k.means)); }),'G3 cloud facts: cumulonimbus means thunderstorm, stay on the ground');
 await shot('R5_01_cloud');
 // PHONETIC PAIRS: match all 8 by peeking at the pairs
 await ev(()=>G.go('g_pairs',{back:'world'},true)); await wait(300);
 ok(await ev(()=>{ const s=G.scene; return s.cards.length===16&&s.cards.filter(k=>k.letter).length===8&&s.cards.every(k=>k.letter?/^[A-Z]$/.test(k.t):G.HFQ.PHONETIC.includes(k.t)); }),'G4 Phonetic Pairs: 16 cards, 8 letters + their 8 radio words');
 for(let p=0;p<8;p++){ for(const which of [0,1]){ const g=await ev(([p,which])=>{ const s=G.scene; return s.grid().filter(q=>q.k.p===p)[which]; },[p,which]); await press(g.x+g.w/2,g.y+g.h/2); } }
 ok(await over()&&await ev(()=>G.scene.moves===8&&G.scene.matched===8),'G5 Phonetic Pairs: eight perfect matches end the game');
 // GAUGE READER: ten right
 await ev(()=>G.go('g_gauges',{back:'world'},true)); await wait(300);
 ok(await ev(()=>{ const s=G.scene; return s.qs.length===10&&['asi','alt','hi','vsi'].every(k=>s.qs.some(q=>q.k===k))&&s.qs.every(q=>q.opts.includes(q.v)&&q.opts.length===4); }),'G6 Gauge Reader: ten questions across airspeed, altitude, heading, vertical speed');
 for(let i=0;i<10;i++){ const bt=await ev(()=>{ const s=G.scene; return s.btns()[s.q.opts.indexOf(s.q.v)]; }); await press(bt.x+bt.w/2,bt.y+bt.h/2); await ev(()=>{ G.scene.fb.t=1; }); await tapV(135,300); await wait(60); }
 ok(await over()&&await ev(()=>G.scene.right===10),'G7 Gauge Reader: 10 of 10 read right');
 ok(await ev(()=>{ G.go('g_gauges',{back:'world'},true); const s=G.scene; s.tipT=0; s.update(9); return !!(s.fb&&s.fb.slow); }),'G8 Gauge Reader: the 8-second clock runs out on a slow scan');
 // WORD HUNT: tap first and last letter of every word
 await ev(()=>G.go('g_words',{back:'world'},true)); await wait(300);
 ok(await ev(()=>{ const s=G.scene; return s.words.length===6&&s.grid.length===8&&s.words.every(w=>{ const dx=Math.sign(w.x1-w.x0), dy=Math.sign(w.y1-w.y0); return [...w.w].every((ch,i)=>s.grid[w.y0+dy*i][w.x0+dx*i]===ch); }); }),'G9 Word Hunt: six words placed, every letter where the grid says');
 for(let i=0;i<6;i++){ const pts=await ev(i=>{ const s=G.scene, K=s.cell(), w=s.words[i]; return [[K.x0+w.x0*K.s+K.s/2,K.y0+w.y0*K.s+K.s/2],[K.x0+w.x1*K.s+K.s/2,K.y0+w.y1*K.s+K.s/2]]; },i); await press(pts[0][0],pts[0][1]); await press(pts[1][0],pts[1][1]); }
 ok(await over()&&await ev(()=>G.scene.found.length===6),'G10 Word Hunt: all six found ends the game');
 await shot('R5_02_words');
 // COMPASS DARTS: throw when the needle is on the target
 await ev(()=>G.go('g_darts',{back:'world'},true)); await wait(300);
 ok(await ev(()=>{ const s=G.scene; return /^FLY (HEADING \d{3}|NORTH|NORTHEAST|EAST|SOUTHEAST|SOUTH|SOUTHWEST|WEST|NORTHWEST)$/.test(s.call)&&s.target%10===0; }),'G11 Compass Darts: the tower calls a heading or a compass point');
 for(let i=0;i<8;i++){ await ev(()=>{ const s=G.scene; s.tipT=0; s.wob=0; s.ang=s.target; G.ptr.click=true; s.update(1/60); G.ptr.click=false; s.fb.t=1; }); await tapV(135,300); await wait(60); }
 ok(await over()&&await ev(()=>G.scene.score===800),'G12 Compass Darts: eight bullseyes = 800');
 ok(await ev(()=>{ G.go('g_darts',{back:'world'},true); const s=G.scene; s.tipT=0; s.wob=0; s.target=90; s.ang=270; G.ptr.click=true; s.update(1/60); G.ptr.click=false; return s.fb.pts===0&&s.fb.d>=170; }),'G13 Compass Darts: 180° off scores nothing');
 // AIR HOCKEY: push the puck into the crew goal five times
 await ev(()=>G.go('g_hockey',{back:'world'},true)); await wait(300);
 for(let g=0;g<5;g++){ await ev(()=>{ const s=G.scene, T=s.T; s.tipT=0; s.cx=T.x+20; s.cy=T.y+30; s.puck={x:G.VW/2,y:T.y+T.h/2+10,vx:0,vy:-700}; let t=0; while(!s.goalT&&t<4){ s.update(1/60); t+=1/60; } s.goalT=0.001; s.update(1/60); s.goalT=0; }); }
 ok(await over()&&await ev(()=>G.scene.me===5),'G14 Air Hockey: five straight shots into the crew goal win it');
 ok(await ev(()=>{ G.go('g_hockey',{back:'world'},true); const s=G.scene, T=s.T; s.tipT=0; s.puck={x:T.x+30,y:T.y+T.h/2,vx:0,vy:400}; let t=0; while(!s.goalT&&t<3){ s.update(1/60); t+=1/60; } return s.puck.y>T.y+T.h/2&&!s.goalT; }),'G15 Air Hockey: a shot wide of the goal bounces off the end wall');
 // RADAR FOUR: stack four in one column while the crew plays elsewhere
 await ev(()=>G.go('g_radar4',{back:'world'},true)); await wait(300);
 ok(await ev(()=>{ const s=G.scene; return s.bd.length===6&&s.bd[0].length===7&&s.turn===1; }),'G16 Radar Four: a 7×6 board, you move first');
 await ev(()=>{ const s=G.scene; s.tipT=0; const orig=s.cpuMove; s.cpuMove=function(){ for(const x of [0,1,2,4,5,6]) if(this.lowest(x)>=0&&this.place(x,2)) return; }; for(let i=0;i<4&&!s.won;i++){ s.place(3,1); if(!s.won) s.cpuMove(); } s.cpuMove=orig; s.endT=0.001; s.update(1/60); });
 ok(await over()&&await ev(()=>G.scene.won===1&&!!G.scene.line),'G17 Radar Four: four gold in a column wins, with the line drawn');
 ok(await ev(()=>{ G.go('g_radar4',{back:'world'},true); const s=G.scene; s.bd[5][0]=s.bd[5][1]=s.bd[5][2]=1; s.turn=2; s.cpuMove(); return s.bd[5][3]===2; }),'G18 Radar Four: the crew blocks three in a row');
 // SKEE-BALL: a centered roll lands by the rings
 await ev(()=>G.go('g_skee',{back:'world'},true)); await wait(300);
 for(let i=0;i<9;i++){ await ev(()=>{ const s=G.scene, L=s.lane; s.tipT=0; s.ball={x:L.cx,y:L.bot-16,v:420,vx:0,phase:'roll',t:0,z:0}; let t=0; while(s.ball&&t<6){ s.update(1/60); t+=1/60; } }); }
 ok(await over()&&await ev(()=>G.scene.n===9&&G.scene.score>=270),'G19 Skee-Ball: nine centered rolls at the right speed land in the 30+ rings');
 ok(await ev(()=>{ G.go('g_skee',{back:'world'},true); const s=G.scene, L=s.lane; s.tipT=0; s.ball={x:L.cx,y:L.bot-16,v:280,vx:0,phase:'roll',t:0,z:0}; let t=0; while(s.ball&&t<6){ s.update(1/60); t+=1/60; } return s.last&&s.last.pts===0; }),'G19b Skee-Ball: a soft roll falls short of the rings');
 // CONE BOWLING: a straight hard roll, five frames
 await ev(()=>G.go('g_bowling',{back:'world'},true)); await wait(300);
 ok(await ev(()=>G.scene.cones.length===10&&G.scene.cones.every(k=>k.up)),'G20 Cone Bowling: ten cones racked');
 await ev(()=>{ const s=G.scene, L=s.L; s.tipT=0; let guard=0; while(!s.over&&guard++<12){ s.ball={x:L.cx+1,y:L.bot-18,v:520,vx:0,curve:0,spin:0}; let t=0; while(s.ball&&t<6){ s.update(1/60); t+=1/60; } while(s.msg){ s.update(.5); } } });
 ok(await over()&&await ev(()=>G.scene.frames.length===5&&G.scene.score>0),'G21 Cone Bowling: five frames scored');
 ok(await ev(()=>{ G.go('g_bowling',{back:'world'},true); const s=G.scene; s.knock(s.cones[0],1,500); return s.cones.filter(k=>!k.up).length>=1&&s.cones[0].ang!==0; }),'G22 Cone Bowling: a hit cone falls (and can tip the ones behind it)');
 await shot('R5_03_bowling');
 // HANGAR HOOPS: aim every shot straight at the hoop until the clock runs out
 await ev(()=>G.go('g_hoops',{back:'world'},true)); await wait(300);
 await ev(()=>{ const s=G.scene; s.tipT=0; let guard=0; while(!s.over&&guard++<3000){ if(!s.ball&&s.clock>0){ const h=s.hoop; s.ball={t:0,dur:.6,D:h.d,x0:G.VW/2,x1:h.x,h:40,x:G.VW/2,d:0,z:0}; } s.update(1/10); } });
 ok(await over()&&await ev(()=>G.scene.makes>=10&&G.scene.score>=20&&G.scene.shots===G.scene.makes),'G23 Hangar Hoops: shots aimed at the hoop all drop; the clock ends the game');
 ok(await ev(()=>{ G.go('g_hoops',{back:'world'},true); const s=G.scene; s.tipT=0; const h=s.hoop; s.ball={t:0,dur:.6,D:Math.min(1.05,h.d+.3),x1:h.x,x0:G.VW/2,h:40,x:G.VW/2,d:0,z:0}; let t=0; while(s.ball&&t<2){ s.update(1/60); t+=1/60; } return s.makes===0&&s.shots===1; }),'G24 Hangar Hoops: a shot long of the hoop misses');

 /* ---------------- RECORDS + BADGES ---------------- */
 ok(await ev(()=>['cloud','pairs','gauges','words','darts','hockey','radar4','skee','bowling','hoops'].every(id=>G.save.mod.games[id]&&G.save.mod.games[id].plays>=1&&G.save.mod.games[id].best!=null)),'B1 all ten new games recorded a best score');
 ok(await ev(()=>{ const d=G.save.mod.games.day; return d&&d.xp<=G.HFQ.xp.gameDaily; }),'B2 game XP stayed under the daily cap');
 ok(await ev(()=>{ const H=G.HFQ; H.GAMES.forEach(g=>{ if(!G.save.mod.games[g.id]) H.gameDone(g.id,1,{counts:false}); }); return !!G.save.ach.games27; }),'B3 playing every game earns CLUBHOUSE LEGEND (games27)');
 ok(await ev(()=>!!G.save.ach.games17),'B4 seventeen different games earned GAME NIGHT REGULAR (games17)');
 await ev(()=>G.go('games',{back:'world'},true)); await wait(500); await shot('R5_04_games_list');
 ok(await ev(()=>{ const I=G.scene.items(), hdr=I.filter(i=>i.kind==='hdr'||i.t==='hdr'||i.type==='hdr'); const txt=JSON.stringify(I); return !/COMING/.test(txt)&&/THE GAME ROOM/.test(txt)&&/WASH RACK/.test(txt)&&I.filter(i=>i.h===58).length===27; }),'B5 the GAMES list groups all 27 by place (the Game Room first), nothing COMING SOON');
 await b.close();
 console.log(results.join('\n')); if(errors.length) console.log('\nERRORS:\n'+[...new Set(errors)].join('\n'));
 const f=results.filter(r=>r.startsWith('FAIL')).length; console.log('\n'+(results.length-f)+'/'+results.length+' passed'+(errors.length?', '+errors.length+' page errors':''));
 process.exit(f||errors.length?1:0);
})();
