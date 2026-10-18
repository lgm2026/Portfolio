/* Shared browser drivers for the r7 suites (hfq_r7_parity.js, hfq_r7_ui.js, hfq_r7_backup.js...).
   The same moves the older suites make (real touches on the canvas, CDP touch events for the stick and swipes), gathered
   in one place, plus helpers for the HTML layer (#ui). Nothing here sets game state behind the UI's back unless a helper's
   name says so (seed, finishGame). */
const SEEDED_RANDOM=`(()=>{ let s=1; const rnd=()=>{ s=(s+0x6D2B79F5)|0; let t=Math.imul(s^(s>>>15),1|s); t=(t+Math.imul(t^(t>>>7),61|t))^t; return ((t^(t>>>14))>>>0)/4294967296; };
 Math.random=rnd; window.__seed=n=>{ s=n|0; }; })();`;
/* Every activity scene reseeds when it starts, from what it is (scene + unit + lesson + mode + book), so a lesson or a
   quiz draws the same questions in the same order whichever way it was reached. */
const SEED_SCENES=`(()=>{ const hash=str=>{ let h=2166136261; for(let i=0;i<str.length;i++){ h^=str.charCodeAt(i); h=Math.imul(h,16777619); } return h|0; };
 const wrap=()=>{ ['lesson','quiz','flash'].forEach(n=>{ const sc=G.scenes[n]; if(!sc||sc.__seeded) return; const e=sc.enter; sc.enter=function(a){ a=a||{}; window.__seed(hash(n+'|'+(a.unit||'')+'|'+(a.lesson!=null?a.lesson:'')+'|'+(a.mode||'')+'|'+(a.book||a.id||'')+'|'+(a.title||''))); return e.apply(this,arguments); }; sc.__seeded=1; }); };
 if(window.G&&G.scenes) wrap(); window.addEventListener('load',()=>setTimeout(wrap,0)); })();`;

module.exports=function drive(page,ctx,o){
 o=o||{};
 const D={};
 const wait=D.wait=ms=>page.waitForTimeout(ms);
 const ev=D.ev=(f,a)=>page.evaluate(f,a);
 D.scene=()=>ev(()=>G.sceneName);
 const V=D.V=(x,y)=>ev(([x,y])=>{ const r=G.canvas.getBoundingClientRect(); return [r.left+x*r.width/G.VW,r.top+y*r.height/G.VH]; },[x,y]);
 const hasTouch=o.mouse?false:true;   // o.mouse: drive with a mouse (desktop) instead of touches
 const tapAt=async(x,y)=>{ if(hasTouch) await page.touchscreen.tap(x,y); else await page.mouse.click(x,y); };
 D.tapAt=tapAt;
 /* r7.4: a milestone card (tier 3) takes the tap that closes it, as it does for a cadet; when one is up, tap it away first */
 const celUp=()=>ev(()=>!!(G.HFQ&&G.HFQ.notices&&G.HFQ.notices.cel));
 const closeCel=D.closeCel=async()=>{ if(!(await celUp())) return false; await wait(700); const p=await V(135,200); await tapAt(p[0],p[1]); await wait(450); return true; };
 const tapV=D.tapV=async(x,y,ms)=>{ await closeCel(); const p=await V(x,y); await tapAt(p[0],p[1]); await wait(ms==null?150:ms); };
 const tapR=D.tapR=async(r,ms)=>{ if(!r) return false; await tapV(r.x+r.w/2,r.y+r.h/2,ms); return true; };
 const until=D.until=async(f,ms,a)=>{ const t0=Date.now(); while(Date.now()-t0<(ms||4000)){ if(await ev(f,a)) return true; await wait(60); } return false; };
 let cdp=null; const touch=D.touch=async(type,p)=>{ if(!cdp) cdp=await ctx.newCDPSession(page); return cdp.send('Input.dispatchTouchEvent',{type,touchPoints:p?[{x:p[0],y:p[1]}]:[]}); };
 const swipe=D.swipe=async(x,y0,y1)=>{ const a=await V(x,y0), z=await V(x,y1); await touch('touchStart',a); for(let i=1;i<=10;i++){ await touch('touchMove',[a[0],a[1]+(z[1]-a[1])*i/10]); await wait(28); } await touch('touchEnd'); await wait(140); };

 /* ---- enroll a cadet the way a family does (the Terms gate itself is tested in hfq_arch_smoke) ---- */
 D.enroll=async(name,pin)=>{
  await page.goto(o.base); await page.waitForFunction(()=>document.getElementById('tapstart').style.display==='block'); await wait(400);
  await page.evaluate(()=>{ const b=document.getElementById('tapstart'); if(b&&b.offsetParent) b.click(); }); await page.waitForFunction(()=>G.sceneName==='terms'||G.sceneName==='title',null,{timeout:15000}); await page.evaluate(()=>{ if(G.sceneName==='terms'){ G.HFQ.acceptTerms('QA','lead'); G.go('title',{gateSeen:true},true); } }); await wait(500);
  await tapR(await ev(()=>G.scene.layout().btns.find(b=>b.id==='signup')),300);
  await ev(()=>{ if(G.sceneName==='terms'){ G.HFQ.acceptTerms('QA','lead'); G.HFQ.recordPledge('QA'); G.go('signup',{termsOk:true,pledged:true},true); } }); await wait(200);
  await page.locator('input.gfield').fill(name); await tapR(await ev(()=>G.scene.nextBtn()),200);
  await page.locator('input.gfield').fill(pin); await wait(300); await page.locator('input.gfield').fill(pin); await wait(900);
  await tapR(await ev(()=>G.scene.layout().btns.find(b=>b.id==='done')),500);
  await until(()=>G.sceneName==='trainer',4000);   // PICK YOUR TRAINER (a fixed wait starved under load)
  await tapR(await ev(()=>G.scene.layout().cards[0]),150); await tapR(await ev(()=>G.scene.layout().btn),900);
  await until(()=>G.sceneName!=='trainer',4000);
  return D.scene(); };

 /* ---- the thumb-stick: steer along the walkable route to an NPC or a station ---- */
 D.walk=async(target,ms)=>{
  await closeCel();
  const L=await ev(()=>{ const s=G.scene; return s.stickRest(s.layout()); }); const c0=await V(L.x,L.y);
  await touch('touchStart',c0); let got=false; const t0=Date.now();
  while(Date.now()-t0<(ms||20000)){
   if(await celUp()){ await touch('touchEnd'); await closeCel(); await touch('touchStart',c0); }   // a milestone card holds the stick until it is tapped away
   const g=await ev(t=>{ const s=G.scene, S=G.world.state, R=s.P.R, nt=s.nearThing(), hitIt=nt&&((t.npc&&nt.npc&&nt.npc.id===t.npc)||(t.st&&nt.st&&nt.st.key===t.st));
    if(hitIt) return {near:true};
    const goal=t.npc?(()=>{ const p=R.npcs.find(q=>q.id===t.npc); return [p.x,p.y+6]; })():R.stations.find(q=>q.key===t.st).u;
    const wp=G.world.findPath(s.P,S.px,S.py,goal[0],goal[1])||[goal]; let a=wp[0]; if(wp.length>1&&Math.hypot(a[0]-S.px,a[1]-S.py)<6) a=wp[1];
    const dx=a[0]-S.px, dy=a[1]-S.py, d=Math.hypot(dx,dy)||1; return {dx:dx/d,dy:dy/d}; },target);
   if(g.near){ got=true; break; }
   await touch('touchMove',await V(L.x+g.dx*28,L.y+g.dy*28)); await wait(60);
  }
  await touch('touchEnd'); await wait(200); return got; };
 D.use=async()=>tapR(await ev(()=>{ const s=G.scene; return s.useRect(s.layout()); }),500);
 D.talkThrough=async()=>{ for(let i=0;i<20&&await ev(()=>!!(G.scene&&G.scene.dlg));i++) await tapV(135,200,160); await wait(300); };

 /* ---- the quiz scene: tap the right (or a wrong) answer, then tap to go on ---- */
 const quizOne=D.quizOne=async right=>{ await until(()=>G.sceneName==='quiz'&&!G.scene.fb&&!G.scene.over&&!!G.scene.cur(),3000);
  const bt=await ev(r=>{ const s=G.scene, q=s.cur(), i=r?q.ok:q.opts.findIndex((o,k)=>k!==q.ok); return Object.assign({qid:q.id,src:q.src},s.btns()[i]); },right); await tapR(bt,80);
  await until(()=>G.scene.fb&&G.scene.fb.t>.55,2000); await tapV(135,150,120); return bt; };
 /* policy: nothing = all right; a function(i) -> right? */
 D.quizAll=async policy=>{ const miss=[];
  for(let i=0;i<40;i++){ await until(()=>G.sceneName!=='quiz'||G.scene.over||(!G.scene.fb&&!!G.scene.cur()),3000); if(await ev(()=>G.sceneName!=='quiz'||!!G.scene.over)) break;
   const right=typeof policy==='function'?policy(i):true; const bt=await quizOne(right); if(!right) miss.push(bt.qid); }
  await until(()=>G.scene.over&&G.scene.over.t>.55,3000); return ev(m=>{ const o=G.scene.over; return {n:o.n,right:o.right,passed:o.passed,perfect:o.perfect,head:(o.res||{}).head,mode:G.scene.a.mode,miss:m}; },miss); };
 D.quizBack=async()=>tapR(await ev(()=>G.scene.overBtns().find(b=>b.id==='back')),500);

 /* ---- a lesson: briefing cards, the takeoff, every challenge by tapping ---- */
 const answer=D.answer=async right=>{
  const k=await ev(()=>G.scene.cur().q.k);
  if(k==='mc'||k==='fill'||k==='tf'){ await tapR(await ev(r=>{ const it=G.scene.cur(), L=G.scene.layout(), i=it.opts.findIndex(o=>r?o.ok:!o.ok); return L.btns.find(b=>b.i===i); },right),110); }
  else if(k==='tap'){ const p=await ev(r=>{ const q=G.scene.cur().q, L=G.scene.layout(), z=r?q.z:G.FIG.zones(q.fig).map(z=>z[0]).find(id=>id!==q.z); return G.FIG.center(q.fig,z,L.fig.x+2,L.fig.y+2,L.fig.w-4,L.fig.h-4); },right); await tapV(p[0],p[1],110); }
  else if(k==='order'){ const n=await ev(()=>G.scene.cur().q.s.length);
   if(!right){ for(let j=0;j<n;j++) await tapR(await ev(()=>G.scene.layout().btns.slice(-1)[0]),110); }
   else for(let j=0;j<n;j++) await tapR(await ev(()=>{ const it=G.scene.cur(), L=G.scene.layout(), need=it.placed.length, i=it.bank.findIndex(x=>x.i===need); return L.btns.find(b=>b.i===i); }),110); }
  else if(k==='match'){ const n=await ev(()=>G.scene.cur().q.p.length);
   if(!right){ await tapR(await ev(()=>{ const it=G.scene.cur(), L=G.scene.layout(); return L.btns.find(b=>b.side==='L'&&it.left[b.i].i===0); }),110); await tapR(await ev(()=>{ const it=G.scene.cur(), L=G.scene.layout(); return L.btns.find(b=>b.side==='R'&&it.right[b.i].i===1); }),110); }
   for(let i=0;i<n;i++){ await tapR(await ev(i=>{ const it=G.scene.cur(), L=G.scene.layout(); return L.btns.find(b=>b.side==='L'&&it.left[b.i].i===i); },i),110); await tapR(await ev(i=>{ const it=G.scene.cur(), L=G.scene.layout(); return L.btns.find(b=>b.side==='R'&&it.right[b.i].i===i); },i),110); }
   return k; }
  await tapR(await ev(()=>G.scene.layout().check),110); return k; };
 const cont=async()=>{ await tapR(await ev(()=>G.scene.fb?G.scene.sheet().btn:null),130); };
 /* miss: how many first-try challenges to get wrong (each comes back before landing and is then answered right) */
 D.fly=async opt=>{ opt=opt||{}; const missed=[];
  await until(()=>G.sceneName==='lesson',3000);
  for(let g=0;g<30&&await ev(()=>G.scene.phase==='brief');g++) await tapR(await ev(()=>G.scene.briefBtns().find(b=>b.id==='next')),170);
  for(let g=0;g<20&&await ev(()=>G.scene.phase==='takeoff');g++) await tapV(135,300,250);
  for(let g=0;g<120&&await ev(()=>G.scene.phase==='q');g++){
   const miss=missed.length<(opt.miss||0)&&await ev(()=>!G.scene.cur().retry);
   if(miss) missed.push(await ev(()=>G.scene.cur().q.id));
   await answer(!miss); await cont(); }
  await until(()=>G.scene.phase==='done'&&G.scene.t>.5,4000); await wait(400);
  return {res:await ev(()=>G.scene.result),missed}; };
 D.lessonGo=async()=>tapR(await ev(()=>G.scene.doneBtns().find(b=>b.id==='go')),600);

 /* ---- the drawn Flight Path: swipe a node into view, tap it, then GO on its sheet ---- */
 D.node=async sp=>{ for(let g=0;g<16;g++){
   const r=await ev(sp=>{ const s=G.scene, A=s.area(); for(const st of s.geo().stages){ if(st.u.id!==sp.u) continue; const n=st.nodes.find(n=>n.k===sp.k&&(sp.i==null||n.i===sp.i)&&(sp.id==null||n.id===sp.id)); if(!n) return {none:1};
     const y=A.y+n.y-s.sc.scroll; return {x:n.x-11,y:y-11,w:22,h:22,vis:y>A.y+30&&y<A.y+A.h-30,dy:y-(A.y+A.h/2),Ay:A.y,Ah:A.h,open:n.open,done:n.done}; } return {none:1}; },sp);
   if(r.none) return null; if(r.vis) return r;
   const d=Math.max(-(r.Ah-80),Math.min(r.Ah-80,r.dy)), mid=r.Ay+r.Ah/2; await swipe(18,mid+d/2,mid-d/2); }
  return null; };
 D.pathGo=async sp=>{ const r=await D.node(sp); if(!r) return false; await tapR(r,300); if(!await ev(()=>!!G.scene.sheet)) return false; await tapR(await ev(()=>G.scene.sheetRect().btn),600); return true; };

 /* ---- a canvas CL list (Practice Hub and friends): swipe an item into view and tap it ---- */
 D.listTap=async t=>{ for(let g=0;g<20;g++){
   const r=await ev(t=>{ const s=G.scene, A=(s.area&&!s.pick)?s.area():{x:4,y:46,w:G.VW-8,h:G.VH-50}, list=s.list, I=s.pick||s.items(); list.prep(I,A);
     const it=I.find(i=>i.t===t); if(!it) return {none:1};
     const y=A.y+it.y-list.sc.scroll; return {x:A.x+10,y:y+4,w:A.w-20,h:Math.min(it.h-10,40),vis:y>=A.y-1&&y+it.h<=A.y+A.h+1,dy:y+it.h/2-(A.y+A.h/2),Ay:A.y,Ah:A.h}; },t);
   if(r.none) return false; if(r.vis){ await tapR(r,400); return true; }
   const d=Math.max(-(r.Ah-80),Math.min(r.Ah-80,r.dy)), mid=r.Ay+r.Ah/2; await swipe(135,mid+d/2,mid-d/2); }
  return false; };

 /* ---- the HTML layer ---- */
 D.ui=()=>ev(()=>({on:!!document.querySelector('#ui.on'),title:(document.querySelector('#ui-title')||{}).textContent||'',stack:G.HFQ.UI.stack().map(x=>x.view),scene:G.sceneName}));
 D.uiReady=async view=>until(v=>{ const s=G.HFQ.UI.stack(); return !!document.querySelector('#ui.on')&&s.length&&s[s.length-1].view===v; },5000,view);
 /* click a button or row in the layer by its visible text (exact, or a RegExp source with re:true) */
 D.click=async(text,opt)=>{ opt=opt||{}; const loc=page.locator('#ui.on').locator(opt.sel||'button, [role=button], a').filter({hasText:opt.re?new RegExp(text):text});
  const n=await loc.count(); if(!n) return false; const el=opt.last?loc.nth(n-1):loc.first(); await el.scrollIntoViewIfNeeded(); await el.click(); await wait(opt.ms==null?350:opt.ms); return true; };
 D.back=async()=>{ await page.locator('#ui.on header.bar button[aria-label="Back"]').first().click(); await wait(400); };
 D.shot=async(file,keepToasts)=>{ if(!keepToasts) await ev(()=>G.clearToasts&&G.clearToasts()); await page.screenshot({path:file}); };
 return D;
};
module.exports.SEEDED_RANDOM=SEEDED_RANDOM;
module.exports.SEED_SCENES=SEED_SCENES;
