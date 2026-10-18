/* HYPETEEN FLIGHT QUARTERS - the LOGBOOK (your rank, XP, badges, places and crew) and the SQUADRON (every cadet on this device). */
(function(){
const H=G.HFQ, C=G.C, CL=G.CL, VW=G.VW;

/* a row for a person: portrait, name, line under it, right-hand text */
function personRow(p,sub,right,rightCol,act){
 return {h:56,focus:!!act,
  draw(c,x,y,w,foc){
   G.rrect(x,y,w,50,12); c.fillStyle=p.me?G.rgba(C.accent,.14):C.card; c.fill();
   c.strokeStyle=foc?C.title:(p.me?G.rgba(C.accent,.5):'rgba(255,255,255,.1)'); c.lineWidth=foc?2:1; c.stroke();
   G.drawPortrait(c,x+8,y+7,36,p.av,p.me?C.accent:null);
   G.txt(p.name,x+52,y+10,8.4,p.me?C.accentHi:C.ink,'left',w-130,800);
   G.txt(sub,x+52,y+27,6,C.dim,'left',w-130,700);
   if(right) G.txt(right,x+w-10,y+19,6.6,rightCol||C.sub,'right',undefined,800);
  },
  tap(){ return act; }, enter(){ return act; }};
}

/* ============================ LOGBOOK ============================ */
G.scenes.logbook={
 enter(a){ this.back=a.back||G.homeScene(); this.list=CL.List(); },
 area(){ return {x:4,y:122,w:VW-8,h:G.VH-126}; },
 items(){
  const I=[], W=G.WORLD, ws=G.save.mod.world||{}, v=ws.visited||{}, met=ws.met||{}, gsP=(G.save.mod.gs||{seen:{}});
  const badges=G.CFG.badges||[], got=badges.filter(b=>G.save.ach[b.id]).length;
  I.push(CL.hdr('BADGES',got+' / '+badges.length));
  for(const b of badges){ const on=!!G.save.ach[b.id]; I.push(CL.row(b.n,b.d||'',{icon:on?'medal':'lock',col:on?C.ink:C.dim,right:on?'✓':'',rightCol:C.good,h:44})); }
  const rooms=Object.keys(W.rooms);
  I.push(CL.hdr('PLACES VISITED',rooms.filter(k=>v[k]).length+' / '+rooms.length));
  for(const k of rooms){ const r=W.rooms[k]; I.push(CL.row(r.name,v[k]?'FIRST VISIT '+G.ago(v[k]):'NOT YET',{icon:(r.tab&&r.tab.icon)||'pin',col:v[k]?C.ink:C.dim,act:{room:k},right:v[k]?'✓':'',rightCol:C.good,h:44})); }
  const crew=[]; for(const k of rooms) for(const n of W.rooms[k].npcs||[]) crew.push(Object.assign({room:k},n));
  I.push(CL.hdr('CREW MET',crew.filter(n=>met[n.id]).length+' / '+crew.length));
  for(const n of crew) I.push(personRow({name:n.name,av:n.av},met[n.id]?n.role:'FIND THEM IN THE '+W.rooms[n.room].name,met[n.id]?'✓':'',C.good,{room:n.room}));
  I.push(CL.hdr('GROUND SCHOOL',Object.keys(gsP.seen||{}).length+' / '+H.units.length+' OPENED'));
  I.push(CL.action('OPEN GROUND SCHOOL',{scene:'groundschool'},'ghost'));
  return I;
 },
 update(){
  if(G.backHit()){ G.go(this.back); return; }
  this.list.update(this.items(),this.area(),a=>{ if(a.room) G.go('world',{room:a.room}); else if(a.scene) G.go(a.scene,{back:'logbook'}); });
 },
 draw(c){
  G.backdrop(.9);
  // the cadet card
  const xp=G.save.points, r=H.rank(xp);
  G.panel(10,48,VW-20,68,{r:14});
  G.drawPortrait(c,20,57,50,G.playerAv(),C.accent);
  G.txt(G.who(),80,56,10,C.ink,'left',VW-100,800);
  G.txt(r.n+' • '+xp+' XP',80,74,7,C.accentHi,'left',VW-100,800);
  const bx=80, bw=VW-100, by=92, p=r.next?(xp-r.min)/(r.next-r.min):1;
  G.rrect(bx,by,bw,8,4); c.fillStyle='rgba(255,255,255,.1)'; c.fill();
  if(p>0){ G.rrect(bx,by,Math.max(8,bw*p),8,4); c.fillStyle=C.accent; c.fill(); }
  G.txt(r.next?(r.next-xp)+' XP TO '+r.nextN:'TOP RANK!',bx,by+11,5.6,C.dim,'left',bw,700);
  this.list.draw(c,this.items(),this.area());
  G.topBar('MY LOGBOOK');
 }
};

/* ============================ SQUADRON: every cadet enrolled on this device ============================ */
G.scenes.squadron={
 enter(a){ this.back=a.back||G.homeScene(); this.list=CL.List(); G.loadRoster(); },
 area(){ return {x:4,y:46,w:VW-8,h:G.VH-50}; },
 items(){
  const all=H.cadets().sort((a,b)=>b.xp-a.xp), I=[];
  I.push(CL.text('Everyone enrolled on this device, highest XP first. Enroll family and friends from the sign-in screen.',{size:6.8,col:C.sub}));
  if(!all.length) I.push(CL.note(['NO CADETS ENROLLED YET.']));
  all.forEach((p,i)=>I.push(personRow(p,(i+1)+'. '+p.rank.n+(p.acct.owner?' • '+G.word('owner'):''),p.xp+' XP',p.me?C.accentHi:C.sub)));
  return I;
 },
 update(){ if(G.backHit()){ G.go(this.back); return; } this.list.update(this.items(),this.area(),()=>{}); },
 draw(c){ G.backdrop(.9); this.list.draw(c,this.items(),this.area()); G.topBar('SQUADRON',{sub:'CADETS ON THIS DEVICE'}); }
};
})();
