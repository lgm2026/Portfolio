/* HYPETEEN FLIGHT QUARTERS - GROUND SCHOOL: the curriculum map, and the socket the learning game plugs into.
   Units live in G.HFQ.units (hfq_data.js). Each unit shows what it teaches; START LESSONS lights up once a game is registered:
     G.groundSchool.register('flight', {scene:'lesson_flight', args:{...}})   // from the learning game's js
     G.groundSchool.complete('flight', score)                               // the game calls this when a unit is finished
   Progress per cadet: G.save.mod.gs = {seen:{unitId:time}, done:{unitId:{at,score}}} */
(function(){
const H=G.HFQ, C=G.C, CL=G.CL, VW=G.VW;
const gs=()=>(G.save.mod.gs=G.save.mod.gs||{seen:{},done:{}});
const GS=G.groundSchool={
 games:{},
 register(id,go){ this.games[id]=go; },
 complete(id,score){ const p=gs(); if(!p.done[id]){ p.done[id]={at:Date.now(),score:score||null}; G.persist(); G.award(100,'UNIT COMPLETE'); } else { p.done[id].score=Math.max(p.done[id].score||0,score||0); G.persist(); } },
 status(id){ const p=gs(); if(p.done[id]) return 'done'; if(this.games[id]) return 'ready'; return 'soon'; }
};
G.scenes.groundschool={
 enter(a){ this.back=a.back||G.homeScene(); this.direct=!!a.unit; this.unit=a.unit?H.units.find(u=>u.id===a.unit)||null:null; this.list=CL.List(); if(this.unit) this.seen(this.unit); },
 seen(u){ const p=gs(); if(p.seen[u.id]) return; const firstEver=!Object.keys(p.seen).length; p.seen[u.id]=Date.now(); G.persist(); G.award(H.xp.unit,'NEW UNIT'); if(firstEver) G.ach('student'); },
 area(){ return {x:4,y:46,w:VW-8,h:G.VH-50}; },
 items(){
  const I=[];
  if(!this.unit){
   I.push(CL.text('Every pilot starts on the ground. Pick a unit to see what it teaches. Lessons and quizzes arrive with the learning game.',{size:7,col:C.sub}));
   H.units.forEach((u,i)=>{
    const st=GS.status(u.id), seen=gs().seen[u.id];
    I.push(CL.row((i+1)+'. '+u.t,u.s,{icon:u.icon,act:{unit:u.id},h:48,right:st==='done'?'✓ DONE':(st==='ready'?'READY':(seen?'PREVIEWED':'SOON')),rightCol:st==='done'?C.good:(st==='ready'?C.accentHi:C.dim)}));
   });
   return I;
  }
  const u=this.unit, st=GS.status(u.id);
  I.push(CL.hdr('WHAT YOU’LL LEARN'));
  for(const t of u.topics) I.push(CL.text('•  '+t,{size:7.6,col:C.ink,wt:700,gap:0}));
  I.push({h:10,draw(){}});
  if(st==='soon') I.push(CL.note(['LESSONS FOR THIS UNIT ARRIVE','WITH THE LEARNING GAME.']));
  I.push(CL.action(st==='done'?'PLAY AGAIN':'START LESSONS',st==='soon'?{soon:1}:{start:u.id},st==='soon'?'secondary':'primary'));
  return I;
 },
 update(){
  if(G.backHit()){ if(this.unit&&!this.direct){ this.unit=null; this.list.reset(); } else G.go(this.back); return; }
  this.list.update(this.items(),this.area(),a=>{
   if(a.unit){ this.unit=H.units.find(u=>u.id===a.unit); this.seen(this.unit); this.list.reset(); }
   else if(a.start){ const g=GS.games[a.start]; G.go(g.scene,Object.assign({back:'groundschool',unit:a.start},g.args||{})); }
   else if(a.soon) G.toast('COMING WITH THE LEARNING GAME',C.warn);
  });
 },
 draw(c){
  G.backdrop(.9);
  this.list.draw(c,this.items(),this.area());
  if(!this.unit){ const n=Object.keys(gs().seen).length; G.topBar('GROUND SCHOOL',{sub:n+' OF '+H.units.length+' UNITS OPENED'}); }
  else { const i=H.units.indexOf(this.unit); G.topBar(this.unit.t,{sub:'UNIT '+(i+1)+' OF '+H.units.length+' • '+this.unit.s,size:8.4}); }
 }
};
})();
