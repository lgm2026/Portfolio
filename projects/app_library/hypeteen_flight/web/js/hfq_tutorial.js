/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* THE FIRST BRIEFING (round 6.2): the guided tutorial a new cadet gets the first time they land on the airfield.
   Eight steps, a spotlight on the thing to use and the instructor talking: walk with the stick, walk to the instructor and
   tap USE, the MAP pop-up, the TOWER button, the FLIGHT BAG, the PATH tab, a node on the Flight Path, and then the cadet's
   first lesson starts for real (the briefing ends the moment it does). Skippable at any step; replayable from the Flight Bag
   (TUTORIAL card). Finishing earns the FIRST BRIEFING badge and 20 XP.
   Progress: G.save.mod.tut = {done:time, step}.  The overlay rides on the world and path scenes (their update/draw are wrapped). */
(function(){
const H=G.HFQ, C=G.C, VW=G.VW;
H.xp=Object.assign(H.xp||{},{tutorial:20});
const TS=()=>{ const m=G.save.mod; m.tut=m.tut||{done:0,step:0}; return m.tut; };
const name=()=>(G.activeAcct&&G.activeAcct.name)||'CADET';
const hit=r=>r&&G.clicked(r.x-4,r.y-4,r.w+8,r.h+8);
const W=()=>G.scene, Lw=()=>G.scene.layout();
const rect=(r,round)=>r?{x:r.x,y:r.y,w:r.w,h:r.h,round:round==null?10:round}:null;
const near=()=>{ const s=W(), u=s&&s.useRect&&s.useRect(Lw()); return !!(u&&u.near); };
const nodeStart=n=>n==='lesson'||n==='quiz'||n==='book'||n==='flash'||(typeof n==='string'&&n.indexOf('g_')===0);
/* each step: the scene it lives on, what the instructor says, the thing(s) to spotlight (screen rects), and how it completes:
   done() is checked every frame, next:true waits for NEXT, endOn(sceneName) completes it the moment that scene opens. */
const STEPS=[
 {scene:'world',card:'top',hint:()=>!H.input||H.input.touchUI()?'DRAG TO WALK':(H.input.cur()==='keys'?'W A S D TO WALK':'W A S D OR CLICK TO WALK'),
  say:()=>'Welcome to '+G.HFQ.FIELD.name.replace(/\b\w+/g,w=>w[0]+w.slice(1).toLowerCase())+', '+name()+'! I’m your instructor. Let’s get you moving: '+(H.input?H.input.walkWords():'drag your thumb on the floor, or on the stick at the bottom left')+'.',
  target:()=>{ const L=Lw(); return {x:12,y:L.roomY+L.RH*.42,w:VW-24,h:L.RH*.56,round:16}; },
  /* r7.4: any way of walking counts (the stick, W A S D or the arrow keys, a click or tap on the floor), measured from when this step began */
  onStart:()=>{ T.walk0=(W()&&W().walked)||0; },
  done:()=>((W().walked||0)-(T.walk0||0))>60},
 {scene:'world',card:'top',hint:()=>near()?(H.input?H.input.useShort():'TAP USE'):'WALK TO ME',
  say:()=>'Now walk over to me. When you’re close I’ll glow and the USE button lights up. '+(H.input&&H.input.cur()!=='touch'?'Press E (or click USE) to talk. Clicking me works too.':'Tap USE to talk. (Tapping me works too.)'),
  target:()=>{ const s=W(), L=Lw(), n=s.P.R.npcs&&s.P.R.npcs[0], out=[]; if(n){ const [x,y]=s.toScreen(n.x,n.y,L,22); out.push({x:x-24,y:y-30,w:48,h:60,round:24}); } const u=s.useRect&&s.useRect(L); if(u) out[near()?'unshift':'push'](rect(u,32)); return out; },
  done:()=>!!(W().dlg||(G.save.mod.world.met||{}).instructor)},
 {scene:'world',card:'bottom',hint:'TAP MAP',
  say:()=>'This round MAP button pops up the whole airfield: the Tower, the Runway, the Parking Stand, the Game Room. Tap a place twice to go there. Open it now.',
  target:()=>{ const s=W(), m=s.mapBtn(Lw()); return rect(m,18); },
  done:()=>!!T.visited.map},
 {scene:'world',card:'bottom',next:true,
  say:()=>'Under it is the TOWER button. It calls the control tower from anywhere: today’s weather first, then real radio calls to ground and tower. Try it after the briefing.',
  target:()=>{ const s=W(), f=s.fabRect(Lw()); return rect(f,18); }},
 {scene:'world',card:'top',next:true,
  say:()=>'Down at the bottom, the FLIGHT BAG holds everything in one list: your locker, logbook, flight log, badges, the Library, the Practice Hub and every game.',
  target:()=>{ const s=W(), t=s.tabs(Lw()).find(q=>q.id==='bag'); return rect(t,10); }},
 {scene:'world',card:'top',hint:'TAP PATH',
  say:()=>'And PATH is your whole course: '+H.units.length+' units of ground school, lesson by lesson, with books, games, drills and checkrides. Tap PATH.',
  target:()=>{ const s=W(), t=s.tabs(Lw()).find(q=>q.scene==='path'); return rect(t,10); },
  done:()=>!!T.visited.path},
 {scene:'path',card:'auto',hint:'TAP THE NODE',
  onStart:()=>{ const s=W(); if(!s||!s.current) return; const n=s.current(), A=s.area(); if(n){ const y=n.y-s.sc.scroll; if(y<40||y>A.h-150) s.sc.scroll=Math.max(0,n.y-A.h*.35); } },   // a returning cadet's next node may be off screen
  say:()=>'Every unit is a stage. Finish its lessons for BRONZE, pass the checkride for SILVER, and ace the drill and the book quiz for GOLD. Tap the glowing node.',
  target:()=>{ const s=W(), n=s.current(); if(!n) return null; const A=s.area(); return {x:n.x-28,y:A.y+n.y-s.sc.scroll-28,w:56,h:56,round:28}; },
  done:()=>!!W().sheet},
 {scene:'path',card:'top',hint:'START',
  say:()=>'Each lesson is a quick briefing, then challenges you tap, with a takeoff and a landing. Already know a unit? TEST OUT skips ahead. Ready, '+name()+'? Start it.',
  target:()=>{ const s=W(); if(!s.sheet) return null; const S=s.sheetRect(); return rect(S.btn,10); },
  undo:()=>!W().sheet, endOn:nodeStart}
];
const T=H.tut={
 active:false, i:0, t:0, flash:0, visited:{}, N:STEPS.length,
 start(force){ const t=TS(); if(t.done&&!force) return false; T.active=true; T.i=0; T.t=0; T.visited={}; t.step=0; G.persist(); if(STEPS[0].onStart&&G.sceneName==='world') STEPS[0].onStart(); return true; },
 skip(){ T.finish(true); },
 finish(skipped){ const t=TS(); T.active=false; if(!t.done){ t.done=Date.now(); G.persist(); if(!skipped){ G.award(H.xp.tutorial,'FIRST BRIEFING'); G.ach('briefed'); if(H.feed) H.feed('tut','finished the first briefing',{icon:'star'}); } }
  G.toast(skipped?'REPLAY THE BRIEFING ANY TIME FROM THE FLIGHT BAG':'BRIEFING COMPLETE: +'+H.xp.tutorial+' XP',skipped?C.info:C.good); },
 step(){ return STEPS[T.i]; },
 shows(scene){ const s=T.step(); if(!T.active||!s) return false; if(scene==='world'&&G.scenes.world.dlg) return false; return s.scene==='any'||s.scene===scene; },
 advance(){ T.i++; T.t=0; TS().step=T.i; G.persist(); AUDIO.sfx('chime2'); if(T.i>=STEPS.length) T.finish(false); else if(STEPS[T.i].onStart&&G.sceneName===STEPS[T.i].scene) STEPS[T.i].onStart(); },
 targets(){ const s=T.step(); let r=s&&s.target?s.target():null; if(!r) return []; return (Array.isArray(r)?r:[r]).filter(Boolean); },
 card(){ const VH=G.VH, s=T.step(), txt=s.say(), lines=G.wrap(txt,6.6,VW-40,700).length, h=58+lines*9.4+36;
  let at=s.card||'bottom'; if(at==='auto'){ const r=T.targets()[0]; at=r&&r.y+r.h/2>VH*.5?'top':'bottom'; }
  const y=at==='top'?46:VH-62-h-6; return {x:8,y,w:VW-16,h,lines,txt,at,next:{x:VW-92,y:y+h-32,w:76,h:24},skip:{x:16,y:y+h-32,w:60,h:24}}; },
 /* returns true when the overlay used the tap */
 update(dt,scene){
  if(!T.active) return false; const s=T.step(); if(!s) return false; T.t+=dt; T.flash+=dt;
  if(s.undo&&s.undo()&&T.i>0&&s.scene===scene){ T.i--; T.t=0; return false; }
  if(s.done&&!s.next&&s.done()&&T.t>.3){ T.advance(); return false; }
  if(!T.shows(scene)) return false;
  const K=T.card();
  if(hit(K.skip)){ AUDIO.sfx('back'); T.skip(); return true; }
  if(s.next&&hit(K.next)){ AUDIO.sfx('ok'); T.advance(); return true; }
  return false;
 },
 draw(c,scene){
  if(!T.shows(scene)) return; const s=T.step(), VH=G.VH, K=T.card(), R=T.targets(), hint=typeof s.hint==='function'?s.hint():s.hint;
  // the dim, with a hole around each target
  c.save(); c.beginPath(); c.rect(0,0,VW,VH);
  for(const r of R){ const rr=Math.min(r.round||10,r.w/2,r.h/2); c.moveTo(r.x+rr,r.y); c.arcTo(r.x,r.y,r.x,r.y+r.h,rr); c.arcTo(r.x,r.y+r.h,r.x+r.w,r.y+r.h,rr); c.arcTo(r.x+r.w,r.y+r.h,r.x+r.w,r.y,rr); c.arcTo(r.x+r.w,r.y,r.x,r.y,rr); c.closePath(); }
  c.fillStyle='rgba(0,0,0,.55)'; c.fill('evenodd'); c.restore();
  R.forEach((r,i)=>{ c.save(); if(!G.rm()){ c.shadowColor=C.accentHi; c.shadowBlur=10+Math.sin(T.flash*5)*5; } G.rrect(r.x,r.y,r.w,r.h,r.round||10); c.strokeStyle=C.accentHi; c.lineWidth=2.2; c.stroke(); c.restore();
   if(i===0&&hint&&r.x+r.w>0&&r.x<VW){ const tw=G.tw(hint,5.4,800), hy=r.h>120?r.y+8:(r.y>VH/2?r.y-16:r.y+r.h+6); G.rrect(r.x+r.w/2-tw/2-7,hy,tw+14,13,6); c.fillStyle=C.accentHi; c.fill(); G.txt(hint,r.x+r.w/2,hy+3.6,5.4,C.onAccent,'center',undefined,800); }
   if(r.x+r.w<0||r.x>VW){ const right=r.x>VW, ax=right?VW-16:16, ay=Math.max(K.at==='top'?K.y+K.h+20:60,Math.min(VH-200,r.y+r.h/2)); c.fillStyle=C.accentHi; c.beginPath(); c.moveTo(ax+(right?8:-8),ay); c.lineTo(ax-(right?6:-6),ay-9); c.lineTo(ax-(right?6:-6),ay+9); c.closePath(); c.fill(); G.txt(hint||'THIS WAY',ax+(right?-42:42),ay-4,5.4,C.accentHi,'center',undefined,800); } });
  // the instructor's card
  G.panel(K.x,K.y,K.w,K.h,{r:14,border:G.rgba(C.accent,.7)});
  G.drawPortrait(c,K.x+10,K.y+10,40,(H.crew&&H.crew.instructor)||{},C.accent);
  G.txt('INSTRUCTOR',K.x+58,K.y+11,6.6,C.title,'left',K.w-70,800); G.txt('FIRST BRIEFING • '+(T.i+1)+' OF '+STEPS.length,K.x+58,K.y+23,5,C.dim,'left',K.w-70,700);
  for(let k=0;k<STEPS.length;k++){ G.rrect(K.x+58+k*11,K.y+33,9,3,1.5); c.fillStyle=k<T.i?G.rgba(C.good,.8):(k===T.i?C.accentHi:'rgba(255,255,255,.15)'); c.fill(); }
  G.para(K.txt,K.x+12,K.y+54,6.6,C.ink,'left',K.w-24,9.4,700);
  G.button({x:K.skip.x,y:K.skip.y,w:K.skip.w,h:K.skip.h,label:'SKIP',kind:'ghost',size:5.6});
  if(s.next) G.button({x:K.next.x,y:K.next.y,w:K.next.w,h:K.next.h,label:'NEXT',kind:'primary',size:6});
  else G.txt('DO IT TO CONTINUE',K.next.x+K.next.w/2,K.next.y+8,5,C.accentText,'center',undefined,800);
 }
};
/* ride on the scenes */
function wrap(name,scene){ const S=G.scenes[name]; if(!S||S._tut) return; S._tut=true; const u=S.update, d=S.draw;
 S.update=function(dt){ if(T.update(dt,scene)) return; return u.call(this,dt); };
 S.draw=function(c){ d.call(this,c); if(G.sceneName!==scene) return; T.draw(c,scene); if(T.shows(scene)&&this.drawStick) this.drawStick(c); }; }
wrap('world','world'); wrap('path','path');
const og=G.go; G.go=function(n,a,i){ if(T.active){ T.visited[n]=true; const s=T.step(); if(s&&s.endOn&&s.endOn(n)){ T.i=STEPS.length-1; T.advance(); } } return og.call(G,n,a,i); };
/* it starts the first time a placed cadet lands on the airfield; the Flight Bag can replay it */
const oldRoom=G.WORLD.onRoom; G.WORLD.onRoom=function(key,first){ if(oldRoom) oldRoom(key,first); const t=TS(); if(!t.done&&!T.active&&H.fl&&H.fl().placed&&key==='classroom') setTimeout(()=>{ if(G.sceneName==='world'&&!TS().done) T.start(); },400); };
H.replayTutorial=function(){ G.go('world',{room:'classroom'}); setTimeout(()=>T.start(true),500); };
G.scenes.tutorial={ enter(){ H.replayTutorial(); }, update(){}, draw(){} };   // the Flight Bag card
G.cardSub.tutorial=()=>TS().done?'REPLAY THE BRIEFING':'YOUR FIRST BRIEFING';
})();
