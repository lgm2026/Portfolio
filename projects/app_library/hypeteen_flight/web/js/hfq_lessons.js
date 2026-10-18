/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* HYPETEEN FLIGHT ACADEMY - FLIGHT LESSONS: the Ground School learning game.
   Each Ground School unit is a ROUTE of lessons (one per topic) ending in a CHECKRIDE that earns the unit PATCH.
   A lesson = a short BRIEFING (cards + an instructor tip), then a FLIGHT of tap-only challenges:
     mc    pick one              {k:'mc',   q, a:['right','wrong',...], fig?, why}
     tf    true or false         {k:'tf',   q, t:true|false, fig?, why}
     fill  fill the blank        {k:'fill', q:'... ___ ...', a:['right','wrong',...], why}
     match match the pairs       {k:'match',q, p:[['left','right'],...], why}
     order put in order          {k:'order',q, s:['first','second',...], why}
     tap   tap the picture       {k:'tap',  q, fig, z:'zoneId', zl?:'what the zone is called', why}
   (a[0] is always the right answer; options are shuffled at play time. figs are hfq_figs.js specs.)
   Content files call H.addLessons(unitId, [{id, t, cards:[{t, b, fig?}], tip, qs:[...]}]), which also registers the
   unit with Ground School: G.groundSchool.register(unitId, {scene:'route'}).
   The game layer: wrong answers come back at the end (a GO-AROUND), streaks of right answers build a TAILWIND,
   r7.4: a miss gets the INSTRUCTOR'S CLUE LADDER (hfq_crewtalk.js H.clue): the first miss points to the briefing card, the second
   gives a closer clue from it, the third shows the answer and its why (SHOW ME jumps there any time). A HINT chip offers the
   first two clues before answering, and nudges after a long pause. Checkrides stay a test: no clues, the answer is shown.
   1-3 stars per lesson, a landing scorecard, FLIGHT DAYS (a daily streak), a DAILY FLIGHT PLAN, a review deck of
   missed questions (HANGAR FLYING), and unit PATCHES. XP is never money; nothing is random-reward.
   Progress per cadet: G.save.mod.fl = {l:{lessonId:{stars,best,runs,at,tw}}, miss:{qid:{n,at}}, streak:{n,last,best}, day:{d,n,bonus,review}} */
(function(){
const H=G.HFQ, C=G.C, VW=G.VW, PI=Math.PI;
H.lessons={}; H.qIndex={};
H.xp=Object.assign(H.xp||{},{lesson:10,star:5,tailwind:5,daily:10,review:5});
H.dailyGoal=2; H.checkN=10; H.checkPass=8;
H.unitColors=['#2f6fb5','#c23a3a','#2f8a4a','#d9731a','#6a3fa0','#1f8a8a','#3a5ad0','#8a6a2a','#b0287f','#4a7a2a','#a0522d','#2a4a8a','#7a2a6a'];
(function(){ // one colour per unit past the first 13: hues spread by the golden angle so neighbours never look alike
 const hex=(h,s2,l)=>{ const k=n=>{ const a=(n+h/30)%12, q=s2*Math.min(l,1-l); return Math.round(255*(l-q*Math.max(-1,Math.min(a-3,9-a,1)))); }; return '#'+[k(0),k(8),k(4)].map(v=>('0'+v.toString(16)).slice(-2)).join(''); };
 for(let i=H.unitColors.length;i<H.units.length;i++) H.unitColors.push(hex((i*137.5)%360,.5,.42));
})();
/* ---------- short forms for writing lessons (used by the curriculum files hfq_c_*.js) ---------- */
H.dsl={
 cd:(t,b,fig)=>fig?{t,b,fig}:{t,b},
 mc:(q,a,why)=>({k:'mc',q,a,why}),                 // a[0] is the right answer
 tf:(q,t,why)=>({k:'tf',q,t,why}),
 fl:(q,a,why)=>({k:'fill',q,a,why}),               // q holds one ___ ; a[0] is the right word
 mt:(q,p,why)=>({k:'match',q,p,why}),
 od:(q,s,why)=>({k:'order',q,s,why}),
 L:(id,t,cards,tip,qs)=>({id,t,cards,tip,qs})
};

/* ---------- content registration ---------- */
H.addLessons=function(unitId,list){
 H.lessons[unitId]=list;
 const U=H.units.find(x=>x.id===unitId); if(U&&(!U.topics||!U.topics.length)) U.topics=list.map(l=>l.t);   // the units added in round 6.4 take their topic list from the lesson titles
 list.forEach((l,i)=>{ l.unit=unitId; l.n=i; (l.qs||[]).forEach((q,k)=>{ q.id=q.id||(l.id+'.'+k); q.lesson=l.id; H.qIndex[q.id]=q; }); });
 G.groundSchool.register(unitId,{scene:'route'});
};
H.allLessons=()=>H.units.reduce((a,u)=>a.concat(H.lessons[u.id]||[]),[]);

/* ---------- progress ---------- */
const FL=H.fl=function(){ const m=G.save.mod, f=m.fl=m.fl||{}; f.l=f.l||{}; f.miss=f.miss||{}; f.streak=f.streak||{n:0,last:null,best:0}; f.day=f.day||{d:null,n:0,bonus:0,review:0}; return f; };
H.clock=()=>Date.now();
H.dayKey=function(off){ const n=new Date(H.clock()), d=new Date(n.getFullYear(),n.getMonth(),n.getDate()+(off||0)); return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2); };
H.today=function(){ const f=FL(), t=H.dayKey(0); if(f.day.d!==t) f.day={d:t,n:0,bonus:0,review:0}; return f.day; };
H.streak=function(){ const s=FL().streak; return (s.last===H.dayKey(0)||s.last===H.dayKey(-1))?s.n:0; };
H.tickDay=function(counts){   // a finished lesson/checkride/review keeps FLIGHT DAYS going; lessons + checkrides count toward the plan
 const f=FL(), d=H.today(), s=f.streak, t=H.dayKey(0);
 if(s.last!==t){ s.n=(s.last===H.dayKey(-1))?s.n+1:1; s.last=t; s.best=Math.max(s.best||0,s.n); }
 if(s.n>=3) G.ach('streak3');
 if(counts) d.n++;
 if(d.n>=H.dailyGoal&&!d.bonus){ d.bonus=1; return H.xp.daily; }
 return 0;
};
H.unitProg=function(uid){
 const L=H.lessons[uid]||[], f=FL(); let done=0,stars=0,next=-1;
 L.forEach((l,i)=>{ const r=f.l[l.id]; if(r){ done++; stars+=r.stars; } else if(next<0) next=i; });
 const p=((G.save.mod.gs||{}).done||{})[uid];
 return {total:L.length,done,stars,max:L.length*3,next:next<0?L.length:next,all:L.length>0&&done===L.length,patch:!!p};
};
H.totals=function(){
 let lessons=0,done=0,stars=0,patches=0; const p=(G.save.mod.gs||{}).done||{};
 for(const u of H.units){ const g=H.unitProg(u.id); lessons+=g.total; done+=g.done; stars+=g.stars; if(p[u.id]) patches++; }
 return {lessons,done,stars,maxStars:lessons*3,patches,units:H.units.length,missed:Object.keys(FL().miss).filter(id=>H.qIndex[id]).length};
};
function noteMiss(q){ const m=FL().miss, r=m[q.id]||{n:0}; r.n=Math.min(5,r.n+1); r.at=Date.now(); m[q.id]=r; }
function noteHit(q){ const m=FL().miss, r=m[q.id]; if(!r) return 0; r.n--; if(r.n<=0){ delete m[q.id]; return 1; } return 0; }
H.noteMiss=noteMiss; H.noteHit=noteHit;   // the quiz engine feeds HANGAR FLYING too (drills, trivia, test-outs)

/* ---------- the unit patch ---------- */
H.drawPatch=function(c,cx,cy,r,u,earned){
 const i=Math.max(0,H.units.indexOf(u)), col=H.unitColors[i%H.unitColors.length];
 c.save();
 c.beginPath(); c.arc(cx,cy,r,0,PI*2); c.fillStyle=earned?col:'rgba(255,255,255,.06)'; c.fill();
 c.lineWidth=Math.max(1.2,r*.12); c.strokeStyle=earned?C.accent:'rgba(255,255,255,.16)'; c.stroke();
 c.setLineDash([Math.max(1,r*.12),Math.max(1,r*.1)]); c.lineWidth=Math.max(.6,r*.04); c.strokeStyle=earned?'rgba(255,255,255,.7)':'rgba(255,255,255,.12)';
 c.beginPath(); c.arc(cx,cy,r*.8,0,PI*2); c.stroke(); c.setLineDash([]);
 G.icon(u.icon||'star',c,cx,cy-(r>14?r*.08:0),r*.9,earned?'#fff':'rgba(255,255,255,.28)');
 if(r>14) G.txt(String(i+1),cx,cy+r*.42,r*.2,earned?C.accentHi:'rgba(255,255,255,.3)','center',undefined,800);
 c.restore();
};

/* ---------- small drawing helpers ---------- */
function starShape(c,cx,cy,R,fill,stroke){ c.beginPath(); for(let i=0;i<10;i++){ const q=i%2?R*.45:R, a=-PI/2+i*PI/5; c.lineTo(cx+Math.cos(a)*q,cy+Math.sin(a)*q); } c.closePath(); if(fill){ c.fillStyle=fill; c.fill(); } if(stroke){ c.strokeStyle=stroke; c.lineWidth=1.2; c.stroke(); } }
H.stars=function(c,cx,cy,R,n,gap){ gap=gap||R*2.3; for(let i=0;i<3;i++) starShape(c,cx+(i-1)*gap,cy,R,i<n?C.accent:'rgba(255,255,255,.08)',i<n?null:'rgba(255,255,255,.22)'); };
function closeBtn(c){ const B={x:6,y:7,w:34,h:27}, press=G.held(B.x,B.y,B.w,B.h); G.rrect(B.x,B.y+(press?1:0),B.w,B.h,10); c.fillStyle=press?G.rgba(C.accent,.3):'rgba(255,255,255,.08)'; c.fill(); c.strokeStyle=G.rgba(C.accentHi,.7); c.lineWidth=1.2; c.stroke(); G.icon('x',c,B.x+B.w/2,B.y+B.h/2+(press?1:0),13,C.accentText); return B; }
const closeHit=()=>G.clicked(6,7,34,27);
function sentence(q,fill,size,maxw){   // word layout for fill-the-blank sentences
 const sp=G.tw(' ',size,700), lines=[[]]; let w=0;
 for(const t of q.split(' ')){ const isB=t.indexOf('___')>=0, disp=isB?t.replace(/_+/,fill||'_______'):t, tw=G.tw(disp,size,800)+(isB?10:0);
  if(w+tw>maxw&&lines[lines.length-1].length){ lines.push([]); w=0; } lines[lines.length-1].push({t:disp,isB,w:tw}); w+=tw+sp; }
 return {lines,sp};
}
const KICK={mc:'PICK ONE',tf:'TRUE OR FALSE?',fill:'FILL THE BLANK',match:'MATCH THE PAIRS',order:'PUT THEM IN ORDER',tap:'TAP THE PICTURE'};
const NICE=['NICE!','AFFIRMATIVE!','SPOT ON!','NAILED IT!','SMOOTH!','GREAT CALL!','THAT’S IT!'];
const RECOVER=['NOW YOU’VE GOT IT!','THAT’S THE ONE!','LOCKED IN!','YOU WORKED IT OUT!'];   // a go-around answered right

/* ---------- a playable copy of a question (fresh shuffle every time it comes up) ---------- */
function prep(q){
 const it={q,sel:null,id:q.id};
 if(q.k==='mc'||q.k==='fill') it.opts=G.shuffle(q.a.map((t,i)=>({t,ok:i===0})));
 if(q.k==='tf') it.opts=[{t:'TRUE',sub:'AFFIRMATIVE',v:true,ok:q.t===true},{t:'FALSE',sub:'NEGATIVE',v:false,ok:q.t===false}];
 if(q.k==='match'){ it.left=G.shuffle(q.p.map((p,i)=>({t:p[0],i}))); it.right=G.shuffle(q.p.map((p,i)=>({t:p[1],i}))); it.done={}; it.pick=null; it.errs=0; it.flash=null; }
 if(q.k==='order'){ let b; do{ b=G.shuffle(q.s.map((t,i)=>({t,i}))); }while(q.s.length>1&&b.every((x,k)=>x.i===k)); it.bank=b; it.placed=[]; }
 return it;
}
function ready(it){ const k=it.q.k; if(k==='match') return false; if(k==='order') return it.placed.length===it.q.s.length; return it.sel!=null; }
function grade(it){ const q=it.q;
 if(q.k==='mc'||q.k==='fill'||q.k==='tf') return !!(it.sel!=null&&it.opts[it.sel].ok);
 if(q.k==='order') return it.placed.every((x,k)=>x.i===k);
 if(q.k==='tap') return it.sel===q.z;
 if(q.k==='match') return it.errs===0;
 return false; }
function answerText(it){ const q=it.q;
 if(q.k==='mc'||q.k==='fill') return q.a[0];
 if(q.k==='tf') return q.t?'TRUE':'FALSE';
 if(q.k==='order') return q.s.join('  →  ');
 if(q.k==='tap') return (q.zl||'the part outlined in green').toUpperCase();
 return ''; }

/* ============================ THE LESSON (a flight) ============================ */
G.scenes.lesson={
 enter(a){
  this.uid=a.unit; this.u=H.units.find(u=>u.id===a.unit); this.mode=a.mode||'lesson'; this.ret=a.ret||{scene:'route',args:{unit:a.unit}};
  const L=H.lessons[this.uid]||[]; this.L=this.mode==='lesson'?L[a.lesson|0]:null; this.li=a.lesson|0;
  let qs=[];
  if(this.mode==='lesson') qs=(this.L&&this.L.qs)||[];
  else if(this.mode==='check'){ const pool=[]; L.forEach(l=>{ const s=G.shuffle(l.qs.slice()); pool.push({first:s[0],rest:s.slice(1)}); });
   qs=pool.map(p=>p.first); const rest=G.shuffle([].concat(...pool.map(p=>p.rest))); while(qs.length<H.checkN&&rest.length) qs.push(rest.pop()); qs=G.shuffle(qs.slice(0,H.checkN)); }
  else if(this.mode==='review'){ const m=FL().miss; qs=Object.keys(m).filter(id=>H.qIndex[id]).sort((x,y)=>(m[y].n-m[x].n)||(m[x].at-m[y].at)).slice(0,8).map(id=>H.qIndex[id]); }
  this.queue=qs.map(prep); this.total=qs.length; this.qi=0; this.right=0; this.missed={}; this.cleared=0;
  this._s0=this._s1=this._s2=0;
  this.combo=0; this.maxCombo=0; this.comboPop=0; this.prog=0; this.fb=null; this.fx=[]; this.t=0; this.m=null; this.result=null; this.card=0;
  this.tries={}; this.hint=null; this.idleQ=0; this.nudge=false; this.hints=0;   // r7.4: the clue ladder
  this.phase=(this.mode==='lesson'&&this.L&&this.L.cards&&this.L.cards.length)?'brief':'takeoff'; this.toT=0; this._chirp=0;
  if(!this.total){ this.phase='done'; this.result={kind:'empty'}; }
  if(AUDIO.curName!=='classroom') AUDIO.play('classroom');
  if(this.phase==='takeoff') this.startTakeoff();
 },
 cur(){ return this.queue[this.qi]; },
 leave(){ G.go(this.ret.scene,this.ret.args||{}); },
 /* ---------- layout (recomputed every frame; the canvas height can change) ---------- */
 layout(){
  const it=this.cur(), q=it.q, VH=G.VH, L={}, size=8.6, lh=13.2, maxw=VW-28; let y=52;
  L.kickY=y; y+=17;
  L.size=size; L.lh=lh;
  if(q.k==='fill'){ const S=sentence(q.q,it.sel!=null?it.opts[it.sel].t:null,size,maxw); L.sent=S; L.pH=S.lines.length*(lh+3); }
  else { L.lines=G.wrap(q.q,size,maxw,800); L.pH=L.lines.length*lh; }
  L.pY=y; y+=L.pH+8;
  const bottom=VH-60, n=(it.opts||it.left||it.bank||[]).length;
  const need={mc:n*40,tf:72,fill:44,match:n*42,order:n*28+Math.ceil(n/2)*36+14,tap:0}[q.k]||0;
  if(q.fig){ const fh=q.k==='tap'?Math.min(156,bottom-y-6):Math.max(64,Math.min(122,bottom-y-need-6)); L.fig={x:12,y,w:VW-24,h:fh}; y+=fh+8; }
  L.aY=y; L.aH=bottom-y;
  L.btns=[];
  /* text-only questions: the answers sit a little lower when the screen has room (closer to the thumb, never under the
     feedback sheet, never far from the question), so a tall phone doesn't show the question with a void beneath it */
  const settle=blockH=>q.fig?y:Math.max(y,Math.min(bottom-150-blockH,y+56));
  if(q.k==='mc'){ const h=Math.max(28,Math.min(36,(L.aH-(n-1)*6)/n)), y0=settle(n*h+(n-1)*6); it.opts.forEach((o,i)=>L.btns.push({i,x:14,y:y0+i*(h+6),w:VW-28,h,label:o.t})); }
  if(q.k==='tf'){ const h=Math.min(64,L.aH), y0=settle(h); it.opts.forEach((o,i)=>L.btns.push({i,x:i?VW/2+4:14,y:y0,w:VW/2-18,h,label:o.t,sub:o.sub})); }
  if(q.k==='fill'){ let row=[],rows=[],w=0; const gap=8;
   it.opts.forEach((o,i)=>{ const bw=G.tw(o.t,8,800)+26; if(w+bw>VW-28&&row.length){ rows.push(row); row=[]; w=0; } row.push({i,w:bw,label:o.t}); w+=bw+gap; });
   if(row.length) rows.push(row);
   const y0=settle(rows.length*42);
   rows.forEach((r,ri)=>{ const tot=r.reduce((a,b)=>a+b.w,0)+gap*(r.length-1); let x=(VW-tot)/2; r.forEach(b=>{ L.btns.push({i:b.i,x,y:y0+4+ri*42,w:b.w,h:34,label:b.label}); x+=b.w+gap; }); }); }
  if(q.k==='match'){ const h=Math.max(28,Math.min(36,(L.aH-(n-1)*6)/n)), w=(VW-38)/2;
   it.left.forEach((o,i)=>L.btns.push({side:'L',i,x:14,y:y+i*(h+6),w,h,label:o.t})); it.right.forEach((o,i)=>L.btns.push({side:'R',i,x:24+w,y:y+i*(h+6),w,h,label:o.t})); }
  if(q.k==='order'){ const sh=24, n2=q.s.length; L.slots=[]; for(let i=0;i<n2;i++) L.slots.push({i,x:14,y:y+i*(sh+4),w:VW-28,h:sh});
   const by=y+n2*(sh+4)+10, w=(VW-36)/2; it.bank.forEach((o,i)=>L.btns.push({i,x:i%2?22+w:14,y:by+Math.floor(i/2)*36,w,h:30,label:o.t})); }
  L.check={x:14,y:VH-52,w:VW-28,h:40};
  return L;
 },
 /* ---------- input ---------- */
 update(dt){
  this.t+=dt; this.comboPop=Math.max(0,this.comboPop-dt*3);
  this.prog+=((this.total?this.right/this.total:0)-this.prog)*Math.min(1,dt*6);
  for(const p of this.fx){ p.x+=p.vx*dt; p.y+=p.vy*dt; p.vy+=260*dt; p.t-=dt; } this.fx=this.fx.filter(p=>p.t>0);
  if(this.m){ const r=this.m.update(); if(r==='yes'){ this.m=null; this.leave(); } else if(r==='no'||G.pressed.b){ this.m=null; } return; }
  if(this.phase==='q'&&this.hint&&G.pressed.b){ G.pressed.b=false; this.hint=null; AUDIO.sfx('back'); return; }   // Escape closes a clue first
  if(this.phase!=='done'&&(closeHit()||G.pressed.b)){ G.ptr.click=false; AUDIO.sfx('back');
   if(this.phase==='brief'&&this.card===0){ this.leave(); return; }
   this.m=G.confirm({title:this.mode==='check'?'LEAVE THE CHECKRIDE?':'LEAVE THIS LESSON?',lines:['YOUR PROGRESS HERE','WON’T BE SAVED.'],yes:'LEAVE',no:'KEEP FLYING'}); return; }
  if(this.phase==='brief') return this.updBrief();
  if(this.phase==='takeoff') return this.updTakeoff(dt);
  if(this.phase==='q') return this.updQ(dt);
  if(this.phase==='done') return this.updDone();
 },
 briefBtns(){ const VH=G.VH, last=this.card>=this.L.cards.length-1; return [{id:'back',label:'BACK',kind:'ghost',x:14,y:VH-52,w:78,h:40,hidden:this.card===0},{id:'next',label:last?'LET’S FLY ▸':'NEXT',kind:'primary',x:this.card===0?14:100,y:VH-52,w:this.card===0?VW-28:VW-114,h:40}]; },
 updBrief(){
  const B=this.briefBtns(); let id=null;
  for(const b of B) if(!b.hidden&&G.clicked(b.x,b.y,b.w,b.h)) id=b.id;
  if(G.pressed.a||G.pressed.right) id='next'; if(G.pressed.left&&this.card>0) id='back';
  if(G.swipe&&Math.abs(G.swipe.dx)>40&&Math.abs(G.swipe.dx)>Math.abs(G.swipe.dy)) id=G.swipe.dx<0?'next':(this.card>0?'back':null);
  if(id==='back'){ this.card--; AUDIO.sfx('back'); }
  if(id==='next'){ AUDIO.sfx('ok'); if(this.card<this.L.cards.length-1) this.card++; else { this.phase='takeoff'; this.startTakeoff(); } }
 },
 startTakeoff(){ this.toT=0; this.t=0; AUDIO.sfx('radio'); this._toSfx=0;
  if(H.say&&H.R){ const R=H.R; H.sayStop(); H.say(R.rt(R.cs(),', RUNWAY ',R.D(H.radioRwy()),', CLEARED FOR TAKEOFF.'),'atc'); } },
 updTakeoff(dt){
  this.toT+=dt;
  if(!this._toSfx&&this.toT>.55){ this._toSfx=1; AUDIO.sfx('takeoff'); }
  const tap=G.ptr.click||G.pressed.a; if(tap) G.ptr.click=false;
  if(this.toT>(G.rm()?1.2:2.6)||(tap&&this.toT>.25)){ this.phase='q'; this.t=0; }
 },
 updQ(dt){
  const it=this.cur(), q=it.q, L=this.layout();
  if(it.flash){ it.flash.t-=dt; if(it.flash.t<=0) it.flash=null; }
  if(this.fb){
   const S=this.sheet();
   if(S.more&&G.clicked(S.more.x,S.more.y,S.more.w,S.more.h)){ this.reveal(); return; }
   if(G.clicked(S.btn.x,S.btn.y,S.btn.w,S.btn.h)||G.pressed.a){ AUDIO.sfx('ok'); this.next(); }
   return;
  }
  if(this.hint){ const B=this.hintSheet();
   if(B.more&&G.clicked(B.more.x,B.more.y,B.more.w,B.more.h)){ this.hint={lvl:2,text:H.clue(q,2,this.L)}; AUDIO.sfx('blip'); if(G.announce) G.announce('Instructor: '+this.hint.text); return; }
   if(G.clicked(B.btn.x,B.btn.y,B.btn.w,B.btn.h)||G.pressed.a){ this.hint=null; AUDIO.sfx('ok'); }
   return; }
  const hb=this.hintBtn(L);
  if(hb&&(G.clicked(hb.x,hb.y,hb.w,hb.h)||G.typed.indexOf('h')>=0||G.typed.indexOf('H')>=0)){ G.ptr.click=false; this.openHint(); return; }
  if(G.ptr.click||G.typed.length) this.idleQ=0; else this.idleQ+=dt;
  if(hb&&!this.nudge&&this.idleQ>25){ this.nudge=true; if(G.announce) G.announce('Need a clue? Tap HINT.'); }
  // number keys pick an option
  const dig=G.typed.find(k=>/^[1-9]$/.test(k));
  if(dig&&(q.k==='mc'||q.k==='fill'||q.k==='tf')){ const i=+dig-1; if(it.opts[i]){ it.sel=i; AUDIO.sfx('blip'); } }
  if(q.k==='mc'||q.k==='fill'||q.k==='tf'){ for(const b of L.btns) if(G.clicked(b.x,b.y,b.w,b.h)){ it.sel=b.i; AUDIO.sfx('blip'); } }
  if(q.k==='tap'&&L.fig&&G.clicked(L.fig.x,L.fig.y,L.fig.w,L.fig.h)){ const z=G.FIG.hit(q.fig,G.ptr.x,G.ptr.y,L.fig.x,L.fig.y,L.fig.w,L.fig.h); if(z){ it.sel=z; AUDIO.sfx('blip'); } else G.toast('TAP A PART OF THE PICTURE',C.dim); }
  if(q.k==='order'){
   for(let i=0;i<L.slots.length;i++){ const s=L.slots[i]; if(it.placed[i]&&G.clicked(s.x,s.y,s.w,s.h)){ const x=it.placed.splice(i,1)[0]; it.bank.push(x); AUDIO.sfx('back'); return; } }
   for(const b of L.btns) if(G.clicked(b.x,b.y,b.w,b.h)){ it.placed.push(it.bank.splice(b.i,1)[0]); AUDIO.sfx('blip'); return; }
  }
  if(q.k==='match'){
   for(const b of L.btns){ const o=(b.side==='L'?it.left:it.right)[b.i]; if(it.done[o.i]||!G.clicked(b.x,b.y,b.w,b.h)) continue;
    if(!it.pick||it.pick.side===b.side){ it.pick={side:b.side,i:b.i}; AUDIO.sfx('blip'); }
    else { const other=(it.pick.side==='L'?it.left:it.right)[it.pick.i];
     if(other.i===o.i){ it.done[o.i]=1; it.pick=null; AUDIO.sfx('point'); this.burst(b.x+b.w/2,b.y+b.h/2,6);
      if(Object.keys(it.done).length===q.p.length) this.check(); }
     else { it.errs++; it.flash={a:it.pick,b:{side:b.side,i:b.i},t:.5}; it.pick=null; AUDIO.sfx('thud'); G.shake=2; } }
    return; }
  }
  if(ready(it)&&(G.clicked(L.check.x,L.check.y,L.check.w,L.check.h)||G.pressed.a)) this.check();
 },
 burst(x,y,n){ if(G.rm()) return; for(let i=0;i<n;i++){ const a=-PI/2+(Math.random()-.5)*2.2, v=80+Math.random()*120; this.fx.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,t:.6+Math.random()*.3,col:i%3?C.accent:C.good}); } },
 check(){
  const it=this.cur(), q=it.q, ok=grade(it), first=!this.missed[q.id]&&!it.retry;
  if(ok){
   this.right++; this.combo++; this.maxCombo=Math.max(this.maxCombo,this.combo); this.comboPop=1;
   if(first&&noteHit(q)&&this.mode==='review') this.cleared++;
   AUDIO.sfx(this.combo>0&&this.combo%5===0?'bigpoint':'point');
   const L=this.layout(); this.burst(L.check.x+L.check.w/2,L.check.y,this.combo>=3?16:10);
  } else {
   this.combo=0; AUDIO.sfx('thud'); G.shake=3;
   if(!this.missed[q.id]){ this.missed[q.id]=1; if(this.mode!=='review') noteMiss(q); }
  }
  const head=ok?(it.retry?RECOVER:NICE)[Math.floor(Math.random()*(it.retry?RECOVER:NICE).length)]:(this.mode==='check'?'NOT QUITE':'SAY AGAIN?');
  const again=!ok&&this.mode!=='check'&&q.k!=='match';
  /* the clue ladder: a lesson or review miss gets a clue first, then a closer one, then the answer (true/false has only two
     choices, so it goes straight to the explanation) */
  const lvl=(!ok&&again&&q.k!=='tf'&&H.clue)?Math.min(3,(this.tries[q.id]=(this.tries[q.id]||0)+1)):3;
  this.fb={ok,head,ans:ok||lvl<3?null:answerText(it),why:lvl<3?'':(q.why||''),again,matchErr:q.k==='match'&&!ok,lvl,clue:lvl<3?H.clue(q,lvl,this.L):null};
  this.hint=null; this.nudge=false; this.idleQ=0;
  if(this.fb.clue&&G.announce) G.announce('Say again? Instructor: '+this.fb.clue);
  if(again){ const cp=prep(q); cp.retry=1; this.queue.push(cp); }
  else if(!ok) this.right++;   // checkride / match: no retry, the flight moves on
  G.persist();
 },
 sheet(){
  const VH=G.VH, f=this.fb, lines=G.wrap(f.why,7,VW-40,600), al=f.ans?G.wrap('ANSWER: '+f.ans,7.2,VW-40,800):[], cl=f.clue?G.wrap(f.clue,7,VW-80,700):[];
  const h=40+al.length*11+(f.again?12:0)+lines.length*11+(cl.length?Math.max(40,14+cl.length*10.5)+4:0)+56, y=VH-h;
  if(f.clue) return {y,h,lines,al,cl,btn:{x:110,y:VH-50,w:VW-124,h:40},more:{x:14,y:VH-50,w:90,h:40}};
  return {y,h,lines,al,cl,btn:{x:14,y:VH-50,w:VW-28,h:40}};
 },
 reveal(){ const it=this.cur(), q=it.q, f=this.fb; if(!f||!f.clue) return;   // SHOW ME: the answer and its why, now
  f.ans=answerText(it); f.why=q.why||''; f.clue=null; f.lvl=3; f.shown=1; this.tries[q.id]=Math.max(this.tries[q.id]||0,2); AUDIO.sfx('blip');
  if(G.announce) G.announce('Answer: '+f.ans+'. '+f.why); },
 hintBtn(L){ if(this.mode==='check'||this.fb||this.hint||!H.clue) return null; return {x:VW-68,y:(L||this.layout()).kickY-3,w:54,h:17}; },
 hintSheet(){ const VH=G.VH, h0=this.hint, cl=G.wrap(h0.text,7,VW-80,700), h=Math.max(40,14+cl.length*10.5)+40+56, y=VH-h;
  return {y,h,cl,btn:h0.lvl<2?{x:110,y:VH-50,w:VW-124,h:40}:{x:14,y:VH-50,w:VW-28,h:40},more:h0.lvl<2?{x:14,y:VH-50,w:90,h:40}:null}; },
 openHint(){ const q=this.cur().q; this.hint={lvl:1,text:H.clue(q,1,this.L)}; this.hints++; this.nudge=false; AUDIO.sfx('blip'); if(G.announce) G.announce('Instructor: '+this.hint.text); },
 /* the instructor's clue box, shared by the feedback sheet and the HINT sheet */
 drawClue(c,x,y,w,cl,label){ const h=Math.max(40,14+cl.length*10.5), av=H.crew&&H.crew.instructor;
  G.rrect(x,y,w,h,12); c.fillStyle=G.rgba(C.accent,.1); c.fill(); c.strokeStyle=G.rgba(C.accent,.45); c.lineWidth=1; c.stroke();
  if(av) G.drawPortrait(c,x+6,y+(h-30)/2,30,av,C.accent);
  G.txt(label,x+42,y+6,5.2,C.accentText,'left',w-50,800);
  cl.forEach((s,i)=>G.txt(s,x+42,y+15+i*10.5,7,C.ink,'left',w-50,700));
  return h; },
 next(){
  this.fb=null; this.hint=null; this.idleQ=0; this.nudge=false; this.qi++;
  if(this.qi>=this.queue.length) this.finish();
 },
 /* ---------- the end of the flight ---------- */
 finish(){
  const f=FL(), distinctMiss=Object.keys(this.missed).length, acc=this.total?Math.round(100*(this.total-distinctMiss)/this.total):0, lines=[]; let xp=0;
  this.phase='done'; this.t=0;
  if(this.mode==='lesson'){
   const id=this.L.id, prev=f.l[id], stars=distinctMiss===0?3:(distinctMiss<=2?2:1);
   if(!prev){ xp+=H.xp.lesson; lines.push(['LESSON COMPLETE',H.xp.lesson]); }
   const ns=Math.max(0,stars-(prev?prev.stars:0)); if(ns){ xp+=ns*H.xp.star; lines.push([ns+(ns>1?' NEW STARS':' NEW STAR'),ns*H.xp.star]); }
   let tw=prev&&prev.tw; if(this.maxCombo>=5&&!tw){ tw=1; xp+=H.xp.tailwind; lines.push(['TAILWIND BONUS',H.xp.tailwind]); }
   f.l[id]={stars:Math.max(stars,prev?prev.stars:0),best:Math.max(acc,prev?prev.best:0),runs:(prev?prev.runs:0)+1,at:Date.now(),tw:tw?1:0};
   const d=H.tickDay(true); if(d){ xp+=d; lines.push(['DAILY FLIGHT PLAN',d]); }
   G.ach('firstflight'); if(stars===3) G.ach('perfect'); if(this.maxCombo>=5) G.ach('tailwind');
   if(!lines.length) lines.push(['PRACTICE FLIGHT',0]);
   this.result={kind:'lesson',stars,acc,lines,xp,first:!prev};
   if(H.recLesson) H.recLesson('lesson',{lesson:id,unit:this.uid,stars,acc,misses:distinctMiss,first:!prev,xp});   // the verified record (hfq_profile.js)
   if(H.simFlight) H.simFlight({title:'LESSON: '+this.L.t.toUpperCase(),min:Math.max(3,Math.round((this.L.cards.length*25+this.L.qs.length*20)/60)),ldg:1});
   AUDIO.jingle(stars===3?'fanfare':'win');
  } else if(this.mode==='check'){
   const score=this.total-distinctMiss, pass=score>=H.checkPass, had=((G.save.mod.gs||{}).done||{})[this.uid];
   if(pass){ G.groundSchool.complete(this.uid,Math.round(100*score/this.total)); if(!had) lines.push(['UNIT PATCH EARNED',100]); G.ach('checkride'); for(const [sid,aid] of [['discovery','grad'],['student','stugrad'],['private','prvgrad'],['beyond','topsky']]){ const sp=H.stageProg(sid); if(sp.units&&sp.patches>=sp.units) G.ach(aid); } }
   const d=H.tickDay(true); if(d){ xp+=d; lines.push(['DAILY FLIGHT PLAN',d]); }
   this.result={kind:'check',pass,score,n:this.total,lines,xp,first:pass&&!had};
   if(H.recLesson) H.recLesson('checkride',{unit:this.uid,score,n:this.total,pass,xp});
   if(H.simFlight) H.simFlight({title:'CHECKRIDE: '+this.u.t,min:8,ldg:1});
   AUDIO.jingle(pass?'fanfare':'lose');
  } else {
   const d=H.today(); if(!d.review){ d.review=1; xp+=H.xp.review; lines.push(['HANGAR FLYING',H.xp.review]); }
   H.tickDay(false);
   this.result={kind:'review',cleared:this.cleared,n:this.total,acc,lines,xp,left:H.totals().missed};
   AUDIO.jingle('win');
  }
  G.persist(); if(xp) G.award(xp,this.mode==='lesson'?'LESSON':(this.mode==='check'?'CHECKRIDE':'REVIEW'));
 },
 doneBtns(){ const VH=G.VH, r=this.result||{}, B=[];
  const again=r.kind==='lesson'?'FLY IT AGAIN':(r.kind==='check'?(r.pass?'FLY IT AGAIN':'TRY AGAIN'):null);
  if(again) B.push({id:'again',label:again,kind:'ghost',x:14,y:VH-96,w:VW-28,h:36});
  B.push({id:'go',label:r.kind==='review'?'BACK TO GROUND SCHOOL':'CONTINUE',kind:'primary',x:14,y:VH-52,w:VW-28,h:40});
  return B; },
 updDone(){
  if(this.t<.4) return;
  let id=null; for(const b of this.doneBtns()) if(G.clicked(b.x,b.y,b.w,b.h)) id=b.id; if(G.pressed.a) id='go';
  if(id==='go'){ AUDIO.sfx('ok'); this.leave(); }
  if(id==='again'){ AUDIO.sfx('ok'); G.go('lesson',{unit:this.uid,lesson:this.li,mode:this.mode,ret:this.ret}); }
 },
 /* ---------- drawing ---------- */
 drawTop(c,title,sub){
  c.fillStyle=G.rgba(C.bg,.96); c.fillRect(0,0,VW,42); c.fillStyle=G.rgba(C.accent,.5); c.fillRect(0,42,VW,1);
  closeBtn(c);
  if(title){ G.txt(title,VW/2+16,sub?7:13,8.6,C.title,'center',VW-110,800); if(sub) G.txt(sub,VW/2+16,24,5.8,C.sub,'center',VW-110,700); return; }
  // progress: a little airplane flying the route from departure to destination
  const x0=52, x1=VW-52, y=21, p=Math.max(0,Math.min(1,this.prog));
  c.strokeStyle='rgba(255,255,255,.16)'; c.lineWidth=3; c.lineCap='round'; c.beginPath(); c.moveTo(x0,y); c.lineTo(x1,y); c.stroke();
  c.strokeStyle=C.accent; c.beginPath(); c.moveTo(x0,y); c.lineTo(x0+(x1-x0)*p,y); c.stroke();
  for(let i=0;i<=this.total;i++){ const x=x0+(x1-x0)*i/this.total; c.beginPath(); c.arc(x,y,1.6,0,PI*2); c.fillStyle=i/this.total<=p+.001?C.accentHi:'rgba(255,255,255,.3)'; c.fill(); }
  c.fillStyle=C.dim; c.fillRect(x1+3,y-5,1.4,10); c.fillStyle=C.good; c.fillRect(x1+4.4,y-5,5,3.4);
  const bob=G.rm()?0:Math.sin(this.t*3)*1.2;
  if(H.drawAC){ const a=H.myAC(); H.drawAC(c,a.id,x0+(x1-x0)*p-17,y-10+bob,34,17,a.paint,{ground:false,prop:'spin',t:this.t}); }
  else { c.save(); c.translate(x0+(x1-x0)*p,y-1+bob); c.rotate(PI/2); G.icon('plane',c,0,0,15,'#fff'); c.restore(); }
  // altitude: climbs out, cruises, and comes back down for the landing
  if(this.phase==='q'){ const alt=Math.round(Math.sin(Math.max(0,Math.min(1,this.prog))*PI)*4500/100)*100; G.txt('ALT '+alt.toLocaleString('en-US')+' FT',VW/2,30,4.6,C.dim,'center',undefined,800); }
  // tailwind combo
  if(this.combo>=2){ const s=1+this.comboPop*.35, x=VW-26;
   c.save(); c.translate(x,y); c.scale(s,s);
   c.strokeStyle=G.rgba(C.accentHi,.7); c.lineWidth=1.3; for(let i=0;i<3;i++){ const yy=-5+i*5, ox=(G.rm()?0:(this.t*30+i*7)%10); c.beginPath(); c.moveTo(-18+ox,yy); c.lineTo(-10+ox,yy); c.stroke(); }
   G.txt('×'+this.combo,4,-6,8,C.accentHi,'center',undefined,800); c.restore();
   G.txt('TAILWIND',x,31,4.2,C.accentText,'center',undefined,800);
  }
 },
 draw(c){
  G.backdrop(.92);
  if(this.phase==='brief') this.drawBrief(c);
  else if(this.phase==='takeoff') this.drawTakeoff(c);
  else if(this.phase==='q') this.drawQ(c);
  else this.drawDone(c);
  for(const p of this.fx){ c.globalAlpha=Math.min(1,p.t*2); c.fillStyle=p.col; c.fillRect(p.x-1.6,p.y-1.6,3.2,3.2); } c.globalAlpha=1;
  if(this.m) this.m.draw(c);
 },
 drawTakeoff(c){
  const VH=G.VH, t=this.toT, x=10, y=54, w=VW-20, h=Math.min(250,VH-130), a=H.myAC?H.myAC():null;
  c.save(); G.rrect(x,y,w,h,14); c.clip();
  const k=G.rm()?.5:Math.min(1,t/2.4), roll=Math.min(1,k/.5), climb=Math.max(0,(k-.5)/.5), gy=y+h-30;
  H.sky(c,x,y,w,h,{mode:'day',sun:[.8,.18],t}); H.clouds(c,x,y,w,h*.6,{t,n:5,seed:3,speed:14,alpha:.9});
  H.sideRunway(c,x,gy,w,{t,k:roll}); H.speedLines(c,x,y,w,h-30,{t,k:roll*(1-climb*.6),col:'rgba(255,255,255,.3)'});
  const px=x+30+roll*w*.32+climb*w*.34, py=gy+15-climb*climb*h*.55, pitch=-.32*Math.min(1,climb*2.2);
  if(a){ c.save(); c.translate(px,py); c.rotate(pitch); H.drawAC(c,a.id,-46,-40,92,46,a.paint,{ground:false,prop:'spin',t}); c.restore(); }
  if(roll>.3&&climb<.2&&!G.rm()){ const hg=c.createRadialGradient(px-40,gy+8,0,px-40,gy+8,26); hg.addColorStop(0,'rgba(255,255,255,.2)'); hg.addColorStop(1,'rgba(255,255,255,0)'); c.fillStyle=hg; c.fillRect(px-70,gy-18,60,30); }   // dust kicked up on the roll
  c.restore();
  c.strokeStyle=G.rgba(C.accent,.45); c.lineWidth=1.2; G.rrect(x,y,w,h,14); c.stroke();
  // the tower's call
  const by=y+h+10, call=G.who()+', RUNWAY '+(H.radioRwy?H.radioRwy():'27')+', CLEARED FOR TAKEOFF.';   // today's runway, from the ATIS (hfq_radio.js)
  G.rrect(14,by,VW-28,48,12); c.fillStyle=G.rgba(C.accent,.1); c.fill(); c.strokeStyle=G.rgba(C.accent,.5); c.lineWidth=1; c.stroke();
  G.icon('chat',c,30,by+24,14,C.accentText); G.txt('TOWER',46,by+8,5.4,C.accentText,'left',undefined,800);
  G.para(call,46,by+19,7.4,C.ink,'left',VW-72,10.5,800);
  G.txt(G.rm()?'':'TAP TO SKIP',VW/2,VH-24,5.4,C.dim,'center',undefined,800);
  const kind=this.mode==='check'?'CHECKRIDE':(this.mode==='review'?'HANGAR FLYING':'LESSON '+(this.li+1));
  this.drawTop(c,kind+' • TAKEOFF',this.u?this.u.t:'MISSED QUESTIONS');
 },
 drawBrief(c){
  const VH=G.VH, L=this.L, cd=L.cards[this.card], last=this.card===L.cards.length-1, ui=H.units.indexOf(this.u);
  const x=10, y=50, w=VW-20, h=VH-y-62;
  G.panel(x,y,w,h,{r:14,border:G.rgba(C.accent,.45)});
  G.txt('PREFLIGHT BRIEFING  •  '+(this.card+1)+' OF '+L.cards.length,x+14,y+12,5.8,C.accentText,'left',w-28,800);
  for(let i=0;i<L.cards.length;i++){ c.beginPath(); c.arc(x+w-14-(L.cards.length-1-i)*9,y+15,2.6,0,PI*2); c.fillStyle=i===this.card?C.accent:'rgba(255,255,255,.2)'; c.fill(); }
  const tl=G.wrap(cd.t,10.5,w-28,800); tl.forEach((s,i)=>G.txt(s,x+14,y+28+i*15,10.5,C.title,'left',w-28,800));
  let yy=y+30+tl.length*15+4;
  yy+=G.para(cd.b,x+14,yy,7.8,C.ink,'left',w-28,12.4,600)+8;
  const tipH=last&&L.tip?Math.max(52,G.wrap(L.tip,7.4,w-92,800).length*11.5+26):0;
  if(cd.fig){ const fh=Math.min(132,y+h-tipH-12-yy); if(fh>48){ G.rrect(x+8,yy,w-16,fh,10); c.fillStyle='rgba(255,255,255,.035)'; c.fill(); G.FIG.draw(c,cd.fig,x+10,yy+2,w-20,fh-4); } }
  if(tipH){ const ty=y+h-tipH-8, av=H.crew&&H.crew.instructor;
   G.rrect(x+8,ty,w-16,tipH,12); c.fillStyle=G.rgba(C.accent,.1); c.fill(); c.strokeStyle=G.rgba(C.accent,.5); c.lineWidth=1; c.stroke();
   if(av) G.drawPortrait(c,x+16,ty+(tipH-40)/2,40,av,C.accent);
   G.txt('INSTRUCTOR TIP',x+64,ty+9,5.6,C.accentText,'left',undefined,800);
   G.para(L.tip,x+64,ty+21,7.4,C.ink,'left',w-92,11.5,800); }
  G.drawBtns(this.briefBtns());
  this.drawTop(c,L.t.toUpperCase(),'UNIT '+(ui+1)+' • LESSON '+(this.li+1)+' OF '+(H.lessons[this.uid]||[]).length);
 },
 drawQ(c){
  const it=this.cur(), q=it.q, L=this.layout(), f=this.fb, rv=!!(f&&!f.clue);   // rv: show the right answer (not while a clue is up)
  // kicker
  const kick=this.mode==='check'?'CHECKRIDE • '+Math.min(this.total,this.qi+1)+' OF '+this.total:(it.retry?'GO-AROUND • TRY AGAIN':KICK[q.k]);
  G.chip(kick,14,L.kickY-2,{size:5.8,col:it.retry?C.warn:C.accentText,bg:G.rgba(it.retry?C.warn:C.accent,.12),border:G.rgba(it.retry?C.warn:C.accent,.4)});
  const hb=this.hintBtn(L); if(hb){ const pulse=this.nudge&&!G.rm()?.5+Math.sin(this.t*5)*.3:0, press=G.held(hb.x,hb.y,hb.w,hb.h);
   G.rrect(hb.x,hb.y+(press?1:0),hb.w,hb.h,8); c.fillStyle=G.rgba(C.accent,this.nudge?.22+pulse*.2:.1); c.fill(); c.strokeStyle=G.rgba(C.accentHi,this.nudge?.9:.5); c.lineWidth=1; c.stroke();
   G.icon('info',c,hb.x+10,hb.y+hb.h/2+(press?1:0),9,C.accentText); G.txt('HINT',hb.x+19,hb.y+5.5+(press?1:0),5.8,C.accentText,'left',undefined,800);
   if(this.nudge) G.txt('NEED A CLUE?',hb.x-5,hb.y+6,5,C.accentText,'right',undefined,800); }
  // prompt
  if(L.sent){ const S=L.sent; S.lines.forEach((ln,li)=>{ let w=ln.reduce((a,t)=>a+t.w,0)+S.sp*(ln.length-1), lx=14; const yy=L.pY+li*(L.lh+3);
    for(const tk of ln){ if(tk.isB){ G.rrect(lx-2,yy-3,tk.w+2,L.size*1.3+6,5); c.fillStyle=it.sel!=null?G.rgba(f?(f.ok?C.good:C.bad):C.accent,.22):'rgba(255,255,255,.07)'; c.fill(); c.strokeStyle=it.sel!=null?(f?(f.ok?C.good:C.bad):C.accent):'rgba(255,255,255,.3)'; c.lineWidth=1; c.stroke(); }
     G.txt(tk.t,lx+(tk.isB?4:0),yy,L.size,tk.isB?(it.sel!=null?C.accentHi:C.dim):C.ink,'left',undefined,800); lx+=tk.w+S.sp; } }); }
  else L.lines.forEach((s,i)=>G.txt(s,14,L.pY+i*L.lh,L.size,C.ink,'left',undefined,800));
  // figure
  if(L.fig){ G.rrect(L.fig.x,L.fig.y,L.fig.w,L.fig.h,10); c.fillStyle='rgba(255,255,255,.035)'; c.fill();
   const marks=[]; if(q.k==='tap'){ if(f){ if(rv) marks.push({id:q.z,col:C.good,fill:G.rgba(C.good,.18)}); if(!f.ok&&it.sel) marks.push({id:it.sel,col:C.bad}); } else if(it.sel) marks.push({id:it.sel,col:C.accent,fill:G.rgba(C.accent,.18)}); }
   G.FIG.draw(c,q.fig,L.fig.x+2,L.fig.y+2,L.fig.w-4,L.fig.h-4,marks);
   if(q.k==='tap'&&!f&&!it.sel) G.txt('TAP ON THE PICTURE',VW/2,L.fig.y+L.fig.h+2,5.4,C.dim,'center',undefined,800); }
  // answers
  if(q.k==='mc'||q.k==='fill'||q.k==='tf'){ const sz=q.k==='tf'?10:(q.k==='mc'?H.fitSize(L.btns.map(b=>b.label),VW-28-20,7.6,6.4):7.6); for(const b of L.btns){ const o=it.opts[b.i]; let kind=it.sel===b.i?'selected':'secondary';
    if(f){ if(o.ok&&rv) kind='success'; else if(it.sel===b.i) kind=f.ok?'success':'danger'; }
    G.button(Object.assign({},b,{kind,size:sz,subSize:5.6,sub:b.sub}),false); } }
  if(q.k==='match'){ const msz=H.fitSize(L.btns.map(b=>b.label),(VW-38)/2-14,7,5.6); for(const b of L.btns){ const o=(b.side==='L'?it.left:it.right)[b.i]; let kind='secondary';
    if(it.done[o.i]) kind='success'; else if(it.pick&&it.pick.side===b.side&&it.pick.i===b.i) kind='selected';
    if(it.flash&&((it.flash.a.side===b.side&&it.flash.a.i===b.i)||(it.flash.b.side===b.side&&it.flash.b.i===b.i))) kind='danger';
    G.button(Object.assign({},b,{kind,size:msz}),false); }
   if(!f) G.txt(it.errs?'MISMATCHES: '+it.errs:'TAP ONE ON EACH SIDE',VW/2,L.check.y+14,5.8,it.errs?C.warn:C.dim,'center',undefined,800); }
  if(q.k==='order'){ L.slots.forEach((s,i)=>{ const p=it.placed[i];
    G.rrect(s.x,s.y,s.w,s.h,8); if(p){ const ok=f?(rv?p.i===i:f.ok):null; c.fillStyle=f?G.rgba(ok?C.good:C.bad,.18):G.rgba(C.accent,.12); c.fill(); c.strokeStyle=f?(ok?C.good:C.bad):G.rgba(C.accent,.6); c.lineWidth=1; c.stroke(); }
    else { c.setLineDash([3,3]); c.strokeStyle='rgba(255,255,255,.22)'; c.lineWidth=1; c.stroke(); c.setLineDash([]); }
    G.txt(String(i+1),s.x+12,s.y+s.h/2-5,7.4,p?C.accentHi:C.dim,'center',undefined,800);
    if(p) G.txt(p.t,s.x+26,s.y+s.h/2-5,p.t.length>34?6.4:7.2,C.ink,'left',s.w-34,800); });
   const osz=H.fitSize(L.btns.map(b=>b.label).concat(it.bank.map(x=>x.t)),(VW-36)/2-14,7,5.6); for(const b of L.btns) G.button(Object.assign({},b,{kind:'secondary',size:osz}),false); }
  // check button
  if(!f&&q.k!=='match') G.button(Object.assign({},L.check,{label:'CHECK',kind:'primary',disabled:!ready(it),size:9}),false);
  // feedback sheet
  if(f){ const S=this.sheet(), col=f.ok?C.good:C.bad;
   c.save(); c.shadowColor='rgba(0,0,0,.6)'; c.shadowBlur=18; G.rrect(0,S.y,VW,S.h+20,16); c.fillStyle=C.panel; c.fill(); c.restore();
   c.fillStyle=col; c.fillRect(0,S.y,VW,3);
   G.icon(f.ok?'check':'x',c,24,S.y+20,16,col);
   G.txt(f.head,40,S.y+12,11,col,'left',undefined,800);
   let yy=S.y+34;
   if(f.ans){ S.al.forEach((s,i)=>G.txt(s,18,yy+i*11,7.2,C.ink,'left',undefined,800)); yy+=S.al.length*11+2; }
   if(f.clue){ yy+=this.drawClue(c,14,yy,VW-28,S.cl,'INSTRUCTOR • CLUE '+f.lvl+' OF 2')+4; }
   if(f.again){ G.txt('GO-AROUND: THIS ONE COMES BACK AT THE END.',18,yy,5.8,C.warn,'left',VW-36,800); yy+=12; }
   S.lines.forEach((s,i)=>G.txt(s,18,yy+i*11,7,C.sub,'left',undefined,600));
   if(S.more) G.button(Object.assign({},S.more,{label:'SHOW ME',kind:'ghost',size:7.6}),false);
   G.button(Object.assign({},S.btn,{label:'CONTINUE',kind:f.ok?'primary':'secondary',size:9}),false); }
  // the HINT sheet (before answering): clue 1, then clue 2; never the answer
  if(!f&&this.hint){ const B=this.hintSheet();
   c.save(); c.shadowColor='rgba(0,0,0,.6)'; c.shadowBlur=18; G.rrect(0,B.y,VW,B.h+20,16); c.fillStyle=C.panel; c.fill(); c.restore();
   c.fillStyle=C.accent; c.fillRect(0,B.y,VW,3);
   G.icon('info',c,24,B.y+20,16,C.accentText); G.txt('A CLUE',40,B.y+12,11,C.accentText,'left',undefined,800);
   this.drawClue(c,14,B.y+34,VW-28,B.cl,'INSTRUCTOR • CLUE '+this.hint.lvl+' OF 2');
   if(B.more) G.button(Object.assign({},B.more,{label:'CLOSER CLUE',kind:'ghost',size:6.8}),false);
   G.button(Object.assign({},B.btn,{label:'GOT IT',kind:'primary',size:9}),false); }
  this.drawTop(c);
 },
 drawDone(c){
  const VH=G.VH, r=this.result||{}, t=this.t;
  if(r.kind==='empty'){ G.txt('NOTHING TO REVIEW YET',VW/2,VH/2-20,9,C.title,'center'); G.drawBtns(this.doneBtns()); return; }
  // the landing
  const sx=10, sy=50, sw=VW-20, sh=112;
  c.save(); G.rrect(sx,sy,sw,sh,14); c.clip();
  const k=G.rm()?1:Math.min(1,t/1.3), e=1-Math.pow(1-k,2.4), roll=G.rm()?1:Math.max(0,Math.min(1,(t-1.3)/.7));
  H.sky(c,sx,sy,sw,sh,{mode:'golden',sun:[.12,.3],t}); H.clouds(c,sx,sy,sw,sh*.5,{t,n:3,seed:5,speed:4,alpha:.7});
  const grd=c.createLinearGradient(0,sy+sh-22,0,sy+sh); grd.addColorStop(0,'#5d8a47'); grd.addColorStop(1,'#3f6a34'); c.fillStyle=grd; c.fillRect(sx,sy+sh-22,sw,22); const rg=c.createLinearGradient(0,sy+sh-17,0,sy+sh-5); rg.addColorStop(0,'#4a4d53'); rg.addColorStop(1,'#2c2f35'); c.fillStyle=rg; c.fillRect(sx,sy+sh-17,sw,12);
  c.fillStyle='#f2f2f2'; for(let x=sx+8;x<sx+sw;x+=20) c.fillRect(x,sy+sh-11.8,10,1.6);
  if(k>=1&&roll<.5&&!G.rm()){ const px0=sx+16+(sw*.48)+roll*30; for(let i=0;i<3;i++){ const pg=c.createRadialGradient(px0-14-i*9,sy+sh-16,0,px0-14-i*9,sy+sh-16,7+i*3); pg.addColorStop(0,'rgba(255,255,255,'+(.5-roll)+')'); pg.addColorStop(1,'rgba(255,255,255,0)'); c.fillStyle=pg; c.fillRect(px0-40-i*9,sy+sh-36,60,30); } }   // tire smoke at touchdown
  const px=sx+16+e*(sw*.48)+roll*30, py=sy+28+e*(sh-15-28), pitch=-.08*(1-k)+(k>=1?0:.02);   // ends with the wheels on the runway
  if(!G.rm()&&k<1) for(let i=1;i<5;i++){ c.fillStyle='rgba(255,255,255,'+(.12-i*.02)+')'; c.beginPath(); c.arc(px-30-i*12,py-6-i*3*(1-e),3+i,0,PI*2); c.fill(); }
  c.save(); c.translate(px,py); c.rotate(pitch); c.scale(.3,.3); c.translate(-122,-100); if(H.drawAC){ const a=H.myAC(); H.drawAC(c,a.id,0,0,240,120,a.paint,{ground:false,prop:roll<1?'spin':'',t}); } else if(G.FIG.drawPlane) G.FIG.drawPlane(c); c.restore();
  if(k>=1&&!this._chirp){ this._chirp=1; AUDIO.sfx('chirp'); }
  if(k>=1&&roll<.6&&!G.rm()) for(let i=0;i<3;i++){ c.fillStyle='rgba(220,220,220,'+(.3*(1-roll))+')'; c.beginPath(); c.arc(px-8-i*6,sy+sh-14,2+i,0,PI*2); c.fill(); }
  c.restore();
  // headline + stars / patch
  let y=sy+sh+12;
  if(r.kind==='lesson'){
   const pop=i=>G.rm()?1:Math.max(0,Math.min(1,(t-1.5-i*.28)*5));
   for(let i=0;i<3;i++){ const s=pop(i), on=i<r.stars; if(s<=0) continue; c.save(); c.translate(VW/2+(i-1)*42,y+18); c.scale(.6+s*.4,.6+s*.4); starShape(c,0,0,15,on?C.accent:'rgba(255,255,255,.08)',on?null:'rgba(255,255,255,.25)'); c.restore();
    if(on&&!this['_s'+i]&&s>=1){ this['_s'+i]=1; AUDIO.sfx('pickup'); this.burst(VW/2+(i-1)*42,y+18,8); } }
   y+=44; G.txt(r.stars===3?'GREASED IT!':(r.stars===2?'NICE LANDING!':'LANDED SAFE!'),VW/2,y,12,C.title,'center',undefined,800);
   y+=20; G.txt(this.L.t.toUpperCase(),VW/2,y,6.4,C.sub,'center',VW-30,800); y+=16;
   this.statRow(c,y,[['ACCURACY',r.acc+'%'],['BEST TAILWIND','×'+this.maxCombo],['XP EARNED','+'+r.xp]]); y+=46;
  } else if(r.kind==='check'){
   const s=G.rm()?1:Math.max(0,Math.min(1,(t-1.4)*3));
   if(r.pass){ c.save(); c.translate(VW/2,y+26); c.rotate((1-s)*-2.4); c.scale(.4+s*.6,.4+s*.6); H.drawPatch(c,0,0,24,this.u,true); c.restore(); y+=60; G.txt('CHECKRIDE PASSED!',VW/2,y,12,C.title,'center',undefined,800); y+=20; G.txt(this.u.t+' PATCH '+(r.first?'EARNED':'KEPT'),VW/2,y,6.4,C.sub,'center',VW-30,800); }
   else { y+=10; G.txt('NOT YET',VW/2,y,13,C.warn,'center',undefined,800); y+=22; G.para('You need '+H.checkPass+' of '+r.n+'. Review the lessons and try again: real pilots practice until they’re ready.',VW/2,y,6.8,C.sub,'center',VW-40,10.5,600); y+=8; }
   y+=16; this.statRow(c,y,[['SCORE',r.score+' / '+r.n],['PASS MARK',H.checkPass+' / '+r.n],['XP EARNED','+'+(r.xp+(r.first?100:0))]]); y+=46;
   G.txt('PRACTICE CHECKRIDE • NOT AN FAA TEST',VW/2,y,5.2,C.dim,'center',undefined,800); y+=12;
  } else {
   y+=6; G.txt('DEBRIEF COMPLETE',VW/2,y,12,C.title,'center',undefined,800); y+=20; G.txt(r.cleared+' CLEARED FROM YOUR LIST • '+r.left+' LEFT',VW/2,y,6.4,C.sub,'center',VW-30,800); y+=16;
   this.statRow(c,y,[['ACCURACY',r.acc+'%'],['QUESTIONS',String(r.n)],['XP EARNED','+'+r.xp]]); y+=46;
  }
  // XP lines
  const B=this.doneBtns(), maxY=B[0].y-8;
  for(const [label,v] of r.lines||[]){ if(y+16>maxY) break; G.txt(label,22,y,6.6,C.sub,'left',undefined,800); if(v) G.txt('+'+v+' XP',VW-22,y,6.6,C.accentHi,'right',undefined,800); c.fillStyle='rgba(255,255,255,.06)'; c.fillRect(22,y+13,VW-44,1); y+=17; }
  if(r.kind==='lesson'&&y+14<maxY){ const d=H.today(); G.txt('FLIGHT DAYS: '+H.streak()+'   •   TODAY: '+Math.min(d.n,H.dailyGoal)+' / '+H.dailyGoal+' LESSONS',VW/2,y+2,5.8,C.dim,'center',VW-30,800); }
  if(t>.4) G.drawBtns(B);
  G.txt(r.kind==='check'?'CHECKRIDE':(r.kind==='review'?'HANGAR FLYING':'LESSON COMPLETE'),VW/2,16,8.6,C.title,'center',undefined,800);
 },
 statRow(c,y,cells){ const w=(VW-36)/3; cells.forEach(([k,v],i)=>{ const x=14+i*(w+4); G.rrect(x,y,w,38,10); c.fillStyle='rgba(255,255,255,.05)'; c.fill(); c.strokeStyle='rgba(255,255,255,.1)'; c.lineWidth=1; c.stroke(); G.txt(v,x+w/2,y+6,10,C.ink,'center',w-6,800); G.txt(k,x+w/2,y+25,4.8,C.dim,'center',w-6,800); }); }
};

/* ============================ THE ROUTE: a unit's lessons as waypoints ============================ */
G.scenes.route={
 enter(a){
  if(AUDIO.curName!=='classroom') AUDIO.play('classroom');
  this.uid=a.unit||this.uid; this.u=H.units.find(u=>u.id===this.uid); this.back=a.back||this.back||'groundschool'; this.st={scroll:0}; this.sheet=null; this.t=0; this.auto=true;
  if(this.u&&G.scenes.groundschool.seen) G.scenes.groundschool.seen(this.u);
 },
 L(){ return H.lessons[this.uid]||[]; },
 geo(){
  const top=104, n=this.L().length+1, gap=80, nodes=[];
  for(let i=0;i<n;i++) nodes.push({i,check:i===n-1,x:VW/2+Math.sin(i*1.3+.5)*64,y:top+46+i*gap-(this.st.scroll||0)});
  return {top,nodes,contentH:46+n*gap+60,area:{x:0,y:top,w:VW,h:G.VH-top}};
 },
 state(i){
  const L=this.L(), f=FL(), P=H.unitProg(this.uid);
  if(i===L.length) return {done:P.patch,open:P.all,cur:P.all&&!P.patch};
  const done=!!f.l[L[i].id], open=i===0||!!f.l[L[i-1].id];
  return {done,open,cur:open&&!done,rec:f.l[L[i].id]};
 },
 sheetRect(){ const VH=G.VH, h=164; return {x:8,y:VH-h-8,w:VW-16,h,btn:{x:22,y:VH-56,w:VW-44,h:38},close:{x:VW-44,y:VH-h,w:30,h:26}}; },
 ret(){ return {scene:'route',args:{unit:this.uid,back:this.back}}; },
 /* the clubhouse games that practice this unit (round 4): one or two pills at the bottom */
 practice(){ if(!H.GAMES||this.sheet!=null) return []; const pri=['metar','wx','depart','arrive','taxi','lightgun','spot','preflight','wash','landing','marshal','paper','cargo','bags','pool'];
  const L=[H.unitGame?H.unitGame(this.uid):null].filter(Boolean).concat(H.GAMES.filter(g=>g.built&&g.learn===this.uid).sort((a,b)=>pri.indexOf(a.id)-pri.indexOf(b.id))).slice(0,1).map(g=>({g,name:g.name,where:g.where,icon:g.icon||'joy',go:()=>G.go('g_'+g.id,{back:'route'})}));
  const T=H.tier?H.tier(this.uid):null;   // the affirm-my-knowledge side: test out, or drill for gold
  if(T&&!T.bronze) L.unshift({name:'TEST OUT',where:'SKIP AHEAD: 80%',icon:'chevrons',go:()=>H.startTestOut(this.uid,this.ret())}); else if(T) L.unshift({name:T.drill&&T.drill.gold?'DRILL: GOLD':'DRILL',where:T.drill?'BEST '+T.drill.best+' / '+H.DRILL_N:H.DRILL_N+' TIMED',icon:'gauge',go:()=>H.startDrill(this.uid,this.ret())});
  if(!L.length) return []; const w=(VW-24-(L.length-1)*6)/L.length; return L.map((g,i)=>Object.assign(g,{x:12+i*(w+6),y:G.VH-40,w,h:32})); },
 update(dt){
  this.t+=dt;
  if(this.sheet!=null){
   const S=this.sheetRect(), i=this.sheet, check=i===this.L().length;
   if(G.backHit()||G.clicked(S.close.x,S.close.y,S.close.w,S.close.h)||(G.ptr.click&&!G.hit(S.x,S.y,S.w,S.h))){ this.sheet=null; G.ptr.click=false; return; }
   if(G.clicked(S.btn.x,S.btn.y,S.btn.w,S.btn.h)||G.pressed.a){ AUDIO.sfx('ok'); G.go('lesson',check?{unit:this.uid,mode:'check',ret:this.ret()}:{unit:this.uid,lesson:i,ret:this.ret()}); }
   return;
  }
  if(G.backHit()){ G.go(this.back); return; }
  for(const b of this.practice()) if(G.clicked(b.x,b.y,b.w,b.h)){ AUDIO.sfx('ok'); b.go(); return; }
  const g=this.geo();
  if(this.auto){ this.auto=false; const P=H.unitProg(this.uid), cur=Math.min(P.next,this.L().length); this.st.scroll=Math.max(0,Math.min(g.contentH-g.area.h+20,(cur*80)-(g.area.h/2-60))); }
  G.CL.scrollArea(this.st,g.area,g.contentH+20);
  if(G.ptr.released&&Math.hypot(G.ptr.rx-G.ptr.rsx,G.ptr.ry-G.ptr.rsy)<10&&G.ptr.rsy>g.top){
   for(const n of this.geo().nodes) if(Math.hypot(G.ptr.rx-n.x,G.ptr.ry-n.y)<26){
    const s=this.state(n.i); if(!s.open){ AUDIO.sfx('buzzer'); G.toast(n.check?'FINISH EVERY LESSON TO UNLOCK THE CHECKRIDE':'FINISH LESSON '+n.i+' FIRST',C.warn); }
    else { AUDIO.sfx('ok'); this.sheet=n.i; } break; }
  }
  if(G.pressed.a){ const P=H.unitProg(this.uid); this.sheet=Math.min(P.next,this.L().length); if(!this.state(this.sheet).open) this.sheet=null; }
 },
 draw(c){
  G.backdrop(.92);
  const g=this.geo(), L=this.L(), P=H.unitProg(this.uid);
  c.save(); c.beginPath(); c.rect(0,g.top,VW,G.VH-g.top); c.clip();
  // chart paper: faint grid + contour lines
  c.strokeStyle='rgba(255,255,255,.035)'; c.lineWidth=1; const off=(this.st.scroll||0)%40;
  for(let x=15;x<VW;x+=40){ c.beginPath(); c.moveTo(x,g.top); c.lineTo(x,G.VH); c.stroke(); }
  for(let y=g.top-off;y<G.VH;y+=40){ c.beginPath(); c.moveTo(0,y); c.lineTo(VW,y); c.stroke(); }
  c.strokeStyle=G.rgba(C.accent,.05); for(let k=0;k<5;k++){ c.beginPath(); for(let x=0;x<=VW;x+=10){ const y=g.top+60+k*120-(this.st.scroll||0)*.6+Math.sin(x*.03+k)*18; x?c.lineTo(x,y):c.moveTo(x,y); } c.stroke(); }
  // the route line
  const N=g.nodes;
  for(let i=0;i<N.length-1;i++){ const a=N[i], b=N[i+1], done=this.state(i).done;
   c.strokeStyle=done?G.rgba(C.accent,.85):'rgba(255,255,255,.18)'; c.lineWidth=done?3:2; if(!done) c.setLineDash([5,6]);
   c.beginPath(); c.moveTo(a.x,a.y); c.bezierCurveTo(a.x,a.y+40,b.x,b.y-40,b.x,b.y); c.stroke(); c.setLineDash([]); }
  // waypoints
  for(const n of N){ const s=this.state(n.i), R=n.check?24:21, pulse=s.cur&&!G.rm()?(Math.sin(this.t*4)+1)/2:0;
   if(s.cur){ c.beginPath(); c.arc(n.x,n.y,R+5+pulse*4,0,PI*2); c.strokeStyle=G.rgba(C.accent,.35+pulse*.3); c.lineWidth=2; c.stroke(); }
   if(n.check){ H.drawPatch(c,n.x,n.y,R,this.u,s.done); if(!s.open){ c.beginPath(); c.arc(n.x,n.y,R,0,PI*2); c.fillStyle='rgba(0,0,0,.45)'; c.fill(); G.icon('lock',c,n.x,n.y,14,'rgba(255,255,255,.5)'); } }
   else { c.beginPath(); c.arc(n.x,n.y,R,0,PI*2); c.fillStyle=s.done?C.accent:(s.open?C.cardPress||'#2c2c31':'rgba(255,255,255,.05)'); c.fill();
    c.lineWidth=2; c.strokeStyle=s.done?C.accentHi:(s.open?C.accent:'rgba(255,255,255,.12)'); c.stroke();
    if(s.done) G.icon('check',c,n.x,n.y,16,C.onAccent); else if(s.open) G.txt(String(n.i+1),n.x,n.y-7,10,C.accentHi,'center',undefined,800); else G.icon('lock',c,n.x,n.y,13,'rgba(255,255,255,.3)');
    if(s.rec) H.stars(c,n.x,n.y+R+8,4.4,s.rec.stars,10); }
   if(s.cur&&!n.check){ c.save(); c.translate(n.x+(n.x<VW/2?-R-14:R+14),n.y-R+2+(G.rm()?0:Math.sin(this.t*3)*2)); c.rotate(n.x<VW/2?PI*.75:PI*1.25); G.icon('plane',c,0,0,14,'#fff'); c.restore(); }
   // label beside the waypoint
   const right=n.x<VW/2, lx=right?n.x+R+12:n.x-R-12, al=right?'left':'right', lw=VW/2-R-30;
   G.txt(n.check?'CHECKRIDE':'LESSON '+(n.i+1),lx,n.y-16,5.4,s.open?C.accentText:C.dim,al,lw,800);
   const t=n.check?(s.done?'PATCH EARNED':'PASS '+H.checkPass+' OF '+H.checkN):L[n.i].t;
   G.wrap(t.toUpperCase(),6.4,lw,800).slice(0,3).forEach((ln,k)=>G.txt(ln,lx,n.y-6+k*9.5,6.4,s.open?C.ink:C.dim,al,lw,800));
  }
  c.restore();
  // header card
  G.panel(8,48,VW-16,52,{r:12});
  H.drawPatch(c,34,74,19,this.u,P.patch);
  const ui=H.units.indexOf(this.u);
  G.txt('UNIT '+(ui+1)+' OF '+H.units.length+'  •  '+this.u.s,60,57,5.6,C.accentText,'left',VW-80,800);
  const bw=VW-128, p=P.total?P.done/P.total:0;
  G.rrect(60,72,bw,7,3.5); c.fillStyle='rgba(255,255,255,.1)'; c.fill(); if(p>0){ G.rrect(60,72,Math.max(7,bw*p),7,3.5); c.fillStyle=C.accent; c.fill(); }
  G.txt(P.done+' / '+P.total+' LESSONS',60,83,5.6,C.sub,'left',undefined,800);
  starShape(c,VW-54,76,6,C.accent); G.txt(P.stars+'/'+P.max,VW-45,71,7,C.ink,'left',undefined,800);
  G.txt(P.patch?'PATCH EARNED':(P.all?'CHECKRIDE READY':''),VW-20,86,5,P.patch?C.good:C.accentHi,'right',undefined,800);
  // the sheet for a picked waypoint
  if(this.sheet!=null){ const S=this.sheetRect(), i=this.sheet, check=i===L.length, s=this.state(i);
   G.dim(.45); G.panel(S.x,S.y,S.w,S.h,{r:16,border:G.rgba(C.accent,.6)});
   G.icon('x',c,S.close.x+15,S.close.y+13,12,C.dim);
   G.txt(check?'UNIT CHECKRIDE':'LESSON '+(i+1)+' OF '+L.length,S.x+16,S.y+14,5.8,C.accentText,'left',undefined,800);
   const title=check?this.u.t+' CHECKRIDE':L[i].t.toUpperCase(); G.wrap(title,10,S.w-60,800).slice(0,2).forEach((ln,k)=>G.txt(ln,S.x+16,S.y+28+k*14,10,C.title,'left',S.w-60,800));
   let yy=S.y+58;
   if(check){ G.para(H.checkN+' questions from every lesson in this unit. Get '+H.checkPass+' right to earn the patch. Practice only: not an FAA test.',S.x+16,yy,6.8,C.sub,'left',S.w-32,10.4,600); }
   else { const l=L[i]; G.txt('BRIEFING: '+l.cards.length+' CARDS  •  '+l.qs.length+' CHALLENGES  •  ~'+Math.max(2,Math.round((l.cards.length*25+l.qs.length*20)/60))+' MIN',S.x+16,yy,5.8,C.sub,'left',S.w-32,800);
    if(s.rec){ H.stars(c,S.x+34,yy+26,7,s.rec.stars,17); G.txt('BEST '+s.rec.best+'%  •  FLOWN '+s.rec.runs+'×',S.x+70,yy+21,6,C.dim,'left',undefined,800); }
    else G.txt('NEW LESSON',S.x+16,yy+18,6.4,C.accentHi,'left',undefined,800); }
   G.button(Object.assign({},S.btn,{label:check?(s.done?'FLY THE CHECKRIDE AGAIN':'START CHECKRIDE'):(s.done?'FLY IT AGAIN':'START LESSON'),kind:'primary',size:8.6}),false);
  }
  if(this.sheet==null){ const P2=this.practice(); if(P2.length){ c.fillStyle=G.rgba(C.bg,.92); c.fillRect(0,G.VH-56,VW,56); G.txt('AFFIRM IT: TEST OUT, DRILL, PRACTICE',VW/2,G.VH-53,4.8,C.dim,'center',undefined,800); }
   for(const b of P2){ const press=G.held(b.x,b.y,b.w,b.h); G.rrect(b.x,b.y+(press?1:0),b.w,b.h,10); c.fillStyle=press?C.cardPress:C.card; c.fill(); c.strokeStyle=G.rgba(C.accent,.6); c.lineWidth=1.2; c.stroke();
    G.icon(b.icon||'joy',c,b.x+14,b.y+16,11,C.accentText); G.txt(b.name,b.x+26,b.y+7,6,C.ink,'left',b.w-32,800); G.txt(b.where,b.x+26,b.y+18,4.6,C.dim,'left',b.w-32,800); } }
  G.topBar(this.u.t,{sub:'GROUND SCHOOL ROUTE',size:8.6});
 }
};

/* ---------- the classroom desk + the corkboard ---------- */
H.firstRoom='classroom';
H.keepLearning=function(){
 for(const u of H.units){ const P=H.unitProg(u.id); if(P.total&&!P.all){ G.go('route',{unit:u.id,back:'world'}); return; } }
 for(const u of H.units){ const P=H.unitProg(u.id); if(P.total&&!P.patch){ G.go('route',{unit:u.id,back:'world'}); return; } }
 G.go('groundschool',{back:'world'});
};
H.reviewOrToast=function(){ if(H.totals().missed) H.startReview({scene:'world'}); else { G.toast('NO MISSED QUESTIONS. NICE FLYING!',C.good); AUDIO.sfx('chime2'); } };
/* ---------- review deck: G.go('lesson',{mode:'review', ret}) ---------- */
H.startReview=function(ret){ G.go('lesson',{mode:'review',unit:null,ret:ret||{scene:'groundschool'}}); };
})();
