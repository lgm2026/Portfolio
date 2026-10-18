/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* HYPETEEN FLIGHT ACADEMY - GROUND SCHOOL: the curriculum map, and the socket the learning game plugs into.
   Units live in G.HFQ.units (hfq_data.js). A unit with a registered game opens it (the Flight Lessons route, hfq_lessons.js):
     G.groundSchool.register('flight', {scene:'route', args:{...}})   // from the learning game's js
     G.groundSchool.complete('flight', score)                       // the game calls this when a unit is finished (its checkride)
   Units without a game show what they will teach.
   Progress per cadet: G.save.mod.gs = {seen:{unitId:time}, done:{unitId:{at,score}}} */
(function(){
const H=G.HFQ, C=G.C, CL=G.CL, VW=G.VW;
const gs=()=>(G.save.mod.gs=G.save.mod.gs||{seen:{},done:{}});
const GS=G.groundSchool={
 games:{},
 register(id,go){ this.games[id]=go; },
 complete(id,score){ const p=gs(); if(!p.done[id]){ p.done[id]={at:Date.now(),score:score||null}; G.persist(); G.award(100,'UNIT COMPLETE'); const u=H.units.find(q=>q.id===id); if(u) G.toast('PATCH: '+u.t,C.good,{kind:'patch',tier:2,id,title:'UNIT PATCH EARNED',sub:u.t,icon:'medal'}); if(H.checkGold) H.checkGold(id); } else { p.done[id].score=Math.max(p.done[id].score||0,score||0); G.persist(); } },
 status(id){ const p=gs(); if(p.done[id]) return 'done'; if(this.games[id]) return 'ready'; return 'soon'; },
 open(id,back){ const g=this.games[id]; if(!g) return false; G.go(g.scene,Object.assign({unit:id,back:back||'groundschool'},g.args||{})); return true; }
};
const lessonsOn=()=>!!H.unitProg;
G.cardSub.gs=()=>{ if(!lessonsOn()) return null; const T=H.totals(); return T.done+' / '+T.lessons+' LESSONS'; };

/* the header: FLIGHT DAYS, today's flight plan, patches */
function statsItem(){
 return {h:66,draw(c,x,y,w){
  const T=H.totals(), d=H.today(), sk=H.streak(), cw=(w-12)/3;
  const cell=(i,big,label,draw)=>{ const cx=x+i*(cw+6); G.rrect(cx,y+4,cw,56,12); c.fillStyle='rgba(255,255,255,.05)'; c.fill(); c.strokeStyle='rgba(255,255,255,.1)'; c.lineWidth=1; c.stroke();
   draw(cx+cw/2,y+20); G.txt(big,cx+cw/2,y+31,9,C.ink,'center',cw-8,800); G.txt(label,cx+cw/2,y+47,4.8,C.dim,'center',cw-8,800); };
  cell(0,String(sk),'FLIGHT DAYS',(cx,cy)=>{ c.save(); c.translate(cx,cy); c.fillStyle=sk?'#ff8a1a':'rgba(255,255,255,.25)'; c.beginPath(); c.moveTo(0,-8); c.bezierCurveTo(7,-2,6,6,0,7); c.bezierCurveTo(-6,6,-7,-1,-2,-4); c.bezierCurveTo(-2,-1,0,0,0,-8); c.fill(); c.restore(); });
  cell(1,Math.min(d.n,H.dailyGoal)+' / '+H.dailyGoal,'TODAY’S PLAN',(cx,cy)=>{ const p=Math.min(1,d.n/H.dailyGoal); c.beginPath(); c.arc(cx,cy,7,0,Math.PI*2); c.strokeStyle='rgba(255,255,255,.15)'; c.lineWidth=2.4; c.stroke(); if(p>0){ c.beginPath(); c.arc(cx,cy,7,-Math.PI/2,-Math.PI/2+p*Math.PI*2); c.strokeStyle=d.bonus?C.good:C.accent; c.stroke(); } });
  cell(2,T.patches+' / '+T.units,'UNIT PATCHES',(cx,cy)=>{ H.drawPatch(c,cx,cy,8,H.units[0],T.patches>0); });
 }};
}
/* a unit row: patch, title, progress bar + stars */
function unitItem(u,i){
 const st=GS.status(u.id), P=lessonsOn()&&H.lessons[u.id]?H.unitProg(u.id):null;
 return {h:64,focus:true,
  draw(c,x,y,w,foc){
   G.rrect(x,y+2,w,58,12); c.fillStyle=C.card; c.fill(); c.strokeStyle=foc?C.title:(P&&P.patch?G.rgba(C.accent,.5):'rgba(255,255,255,.1)'); c.lineWidth=foc?2:1; c.stroke();
   H.drawPatch?H.drawPatch(c,x+28,y+31,18,u,P&&P.patch):G.icon(u.icon,c,x+28,y+31,18,C.accentText);
   G.txt((i+1)+'. '+u.t,x+56,y+10,8,C.ink,'left',w-120,800);
   G.txt(u.s,x+56,y+25,5.6,C.dim,'left',w-120,700);
   if(P){ const bw=w-122, p=P.total?P.done/P.total:0, open=!H.unitOpen||H.unitOpen(u.id), T=H.tier?H.tier(u.id):null; G.rrect(x+56,y+40,bw,6,3); c.fillStyle='rgba(255,255,255,.1)'; c.fill(); if(p>0){ G.rrect(x+56,y+40,Math.max(6,bw*p),6,3); c.fillStyle=P.patch?C.good:C.accent; c.fill(); }
    if(!open){ G.icon('lock',c,x+w-16,y+16,11,C.dim); G.txt('LOCKED',x+w-10,y+30,5.2,C.dim,'right',undefined,800); }
    else { G.txt(P.patch?'✓ PATCH':(P.done?P.done+'/'+P.total:'START'),x+w-10,y+12,6.6,P.patch?C.good:(P.done?C.accentHi:C.accentText),'right',undefined,800);
     if(T&&H.drawMedal){ [1,2,3].forEach(k=>H.drawMedal(c,x+w-46+(k-1)*14,y+41,5,T.t>=k?k:0)); } else G.txt('★ '+P.stars+'/'+P.max,x+w-10,y+36,6,P.stars?C.accentHi:C.dim,'right',undefined,800); } }
   else G.txt(st==='ready'?'READY':(gs().seen[u.id]?'PREVIEWED':'SOON'),x+w-10,y+24,6.6,st==='ready'?C.accentHi:C.dim,'right',undefined,800);
  },
  tap(){ return (H.unitOpen&&!H.unitOpen(u.id))?{locked:u.id}:{unit:u.id}; }, enter(){ return (H.unitOpen&&!H.unitOpen(u.id))?{locked:u.id}:{unit:u.id}; }};
}
G.scenes.groundschool={
 enter(a){ if(AUDIO.curName!=='classroom') AUDIO.play('classroom'); this.back=a.back||G.homeScene(); this.direct=!!a.unit; this.unit=a.unit?H.units.find(u=>u.id===a.unit)||null:null; this.list=CL.List(); this.redirect=null;
  if(this.unit){ this.seen(this.unit); if(GS.games[this.unit.id]) this.redirect=this.unit.id; } },
 seen(u){ const p=gs(); if(p.seen[u.id]) return; const firstEver=!Object.keys(p.seen).length; p.seen[u.id]=Date.now(); G.persist(); G.award(H.xp.unit,'NEW UNIT'); if(firstEver) G.ach('student'); },
 area(){ return {x:4,y:46,w:VW-8,h:G.VH-50}; },
 items(){
  const I=[];
  if(!this.unit){
   if(lessonsOn()){
    I.push(statsItem());
    const T=H.totals();
    if(T.missed) I.push(CL.action('HANGAR FLYING: PRACTICE '+T.missed+' MISSED '+(T.missed===1?'QUESTION':'QUESTIONS'),{review:1},'ghost'));
    I.push(CL.text('Every pilot starts on the ground. Fly each unit’s lessons, then pass its checkride to earn the patch.',{size:6.8,col:C.sub}));
   } else I.push(CL.text('Every pilot starts on the ground. Pick a unit to see what it teaches.',{size:7,col:C.sub}));
   H.units.forEach((u,i)=>I.push(unitItem(u,i)));
   I.push(CL.note(['PRACTICE FOR CURIOUS CADETS • NOT AN FAA COURSE','THE GAME NEVER GRANTS A REAL PILOT CERTIFICATE']));
   return I;
  }
  const u=this.unit, st=GS.status(u.id);
  I.push(CL.hdr('WHAT YOU’LL LEARN'));
  for(const t of u.topics) I.push(CL.text('•  '+t,{size:7.6,col:C.ink,wt:700,gap:0}));
  I.push({h:10,draw(){}});
  if(st==='soon') I.push(CL.note(['LESSONS FOR THIS UNIT ARE','STILL BEING WRITTEN.']));
  I.push(CL.action(st==='done'?'PLAY AGAIN':'START LESSONS',st==='soon'?{soon:1}:{start:u.id},st==='soon'?'secondary':'primary'));
  return I;
 },
 update(){
  if(this.redirect){ const id=this.redirect; this.redirect=null; GS.open(id,this.back); return; }
  if(G.backHit()){ if(this.unit&&!this.direct){ this.unit=null; this.list.reset(); } else G.go(this.back); return; }
  this.list.update(this.items(),this.area(),a=>{
   if(a.review){ H.startReview({scene:'groundschool',args:{back:this.back}}); return; }
   if(a.locked){ G.toast('FINISH THE UNIT BEFORE IT FIRST (OR TEST OUT ON THE FLIGHT PATH)',C.warn); AUDIO.sfx('thud'); return; }
   if(a.unit){ const u=H.units.find(x=>x.id===a.unit); this.seen(u); if(GS.games[u.id]){ GS.open(u.id,'groundschool'); return; } this.unit=u; this.list.reset(); }
   else if(a.start){ GS.open(a.start,'groundschool'); }
   else if(a.soon) G.toast('LESSONS COMING SOON',C.warn);
  });
 },
 draw(c){
  G.backdrop(.9);
  if(this.redirect) return;
  this.list.draw(c,this.items(),this.area());
  if(!this.unit){ const sub=lessonsOn()?(()=>{ const T=H.totals(); return T.done+' OF '+T.lessons+' LESSONS • ★ '+T.stars; })():Object.keys(gs().seen).length+' OF '+H.units.length+' UNITS OPENED'; G.topBar('GROUND SCHOOL',{sub}); }
  else { const i=H.units.indexOf(this.unit); G.topBar(this.unit.t,{sub:'UNIT '+(i+1)+' OF '+H.units.length+' • '+this.unit.s,size:8.4}); }
 }
};
})();
