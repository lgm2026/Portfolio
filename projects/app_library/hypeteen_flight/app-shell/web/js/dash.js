/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* DASHBOARD: the home screen. One card per CONFIG.cards entry, laid out as a grid that fits the phone.
   card = {id, label, sub, icon, scene | page | href, need:null|'member'|'owner', args}
   Modules can add live extras by id:
     G.cardSub[id]   = () => 'TEXT'   (replaces the subtitle, e.g. '3 NEW')
     G.cardBadge[id] = () => n        (a red count; -1 = a plain dot) */
(function(){
const VW=G.VW, C=G.C, CFG=G.CFG;
G.cardSub={}; G.cardBadge={};
G.scenes.dash={
 enter(a){ this.st={f:0}; this.exitM=null; this.lk=''; this.isHome=G.homeScene()==='dash'; if(this.isHome&&AUDIO.curName!==AUDIO.menuMusic()) AUDIO.play(AUDIO.menuMusic()); },
 cards(){ return (CFG.cards||[]).filter(c=>!c.hidden); },
 layout(){
  const VH=G.VH, list=this.cards(), n=list.length, y0=50, gap=8;
  const cols=n<=4?2:(n<=6?2:3), rows=Math.max(1,Math.ceil(n/cols));
  const A=VH-y0-10, ch=Math.min(cols===2?118:100,(A-gap*(rows-1))/rows), cw=(VW-16-gap*(cols-1))/cols;
  return list.map((c,i)=>Object.assign({},c,{x:8+(i%cols)*(cw+gap),y:y0+Math.floor(i/cols)*(ch+gap),w:cw,h:ch}));
 },
 locked(c){ return !G.data.can(c.need); },
 /* outside links need a real tap on a real <a>: lay one over each unlocked link card */
 placeLinks(R){
  const k=R.map(r=>r.href&&!this.locked(r)?r.id+r.y:'').join('|')+G.VH+(this.exitM?'m':'');
  if(k===this.lk) return; this.lk=k;
  for(const id in G.fields) if(id.indexOf('lnk_')===0) G.removeField(id);
  if(this.exitM) return;
  R.forEach(r=>{ if(r.href&&!this.locked(r)) G.linkField('lnk_'+r.id,{href:r.href,x:r.x,y:r.y,w:r.w,h:r.h,label:r.label,onTap:()=>AUDIO.sfx('ok')}); });
 },
 open(c){
  if(this.locked(c)){ AUDIO.sfx('buzzer'); G.toast(c.need==='owner'?'OWNER ONLY':'SIGN IN TO USE THIS',C.warn); return; }
  AUDIO.sfx('ok');
  if(c.href){ window.open(c.href,'_blank','noopener'); return; }   // keyboard path; taps hit the real link
  if(c.page){ G.go('page',{id:c.page,back:'dash'}); return; }
  G.go(c.scene||'blank',Object.assign({back:'dash',card:c.id},c.args||{}));
 },
 update(){
  if(this.exitM){
   const r=this.exitM.update();
   if(r==='no'||(r==null&&G.pressed.b)){ this.exitM=null; return; }
   if(r==='yes'){ G.toast(G.word('loggedOut'),C.info); G.go('title'); }
   return;
  }
  const noAcc=CFG.accounts&&CFG.accounts.enabled===false;
  if(!this.isHome&&G.backHit()){ G.home(); return; }   // the dashboard as a quick menu over another home scene
  if(!noAcc&&G.backHit()){
   if(G.activeAcct) this.exitM=G.confirm({title:G.word('logout')+'?',lines:['YOU’LL NEED YOUR PIN TO GET BACK IN.'],yes:G.word('logout'),no:'STAY'});
   else G.go('title');
   return;
  }
  if(G.gearHit()){ G.go('settings',{back:'dash'}); return; }
  const R=this.layout();
  this.placeLinks(R);
  // taps on link cards are handled by the overlaid <a>; keyboard Enter still opens them
  const hit=G.navList(this.st,R.map(r=>Object.assign({},r,{silent:true})),{both:true});
  if(hit) this.open(R.find(r=>r.id===hit));
 },
 draw(c){
  const R=this.layout();
  G.backdrop();
  R.forEach((r,i)=>{
   const press=G.held(r.x,r.y,r.w,r.h), y=r.y+(press?1:0), foc=this.st.f===i&&G.kbMode, lk=this.locked(r);
   G.rrect(r.x,y,r.w,r.h,14); c.fillStyle=press?C.cardPress:C.card; c.fill();
   c.strokeStyle=foc?C.title:G.rgba(C.accent,lk?.18:.42); c.lineWidth=foc?2:1; c.stroke();
   const is=Math.min(28,r.h*.26), Rr=is*.95, cy=y+Math.max(4,(r.h-(2*Rr+26))/2)+Rr;
   const DISC={path:'path',groundschool:'class',explorer:'map',fleet:'hangar',hangar:'hangar',radio:'tower',crewboard:'crewboard',locker:'profile',logbook:'achievements',settings:'settings',cadet:'profile',practice:'class',tutorial:'flightbag'};
   if(!(G.ART&&DISC[r.id]&&G.ART.disc(c,DISC[r.id],r.x+r.w/2,cy,2*Rr+4,lk))){
    c.beginPath(); c.arc(r.x+r.w/2,cy,Rr,0,7);
    if(lk) c.fillStyle='rgba(255,255,255,.05)'; else { const g=c.createLinearGradient(0,cy-Rr,0,cy+Rr); g.addColorStop(0,C.accentHi); g.addColorStop(.55,C.accent); g.addColorStop(1,C.accentLo); c.fillStyle=g; } c.fill();
    if(!lk){ c.strokeStyle='rgba(255,242,200,.8)'; c.lineWidth=1.2; c.stroke(); }
    G.icon(r.icon||'grid',c,r.x+r.w/2,cy,is,lk?C.faint:C.bg); }
   G.txt(r.label,r.x+r.w/2,cy+Rr+5,r.label.length>13?6.6:7.6,lk?C.dim:C.ink,'center',r.w-10,800);
   const sub=lk?(r.need==='owner'?'OWNER ONLY':'SIGN IN FIRST'):((G.cardSub[r.id]&&G.cardSub[r.id]())||r.sub||'');
   if(sub){ const L=G.wrap(sub,5.6,r.w-10,700);   // a long subtitle takes two lines instead of being squashed
    if(L.length>1&&cy+Rr+26+8<=y+r.h){ L.slice(0,2).forEach((l,k)=>G.txt(l,r.x+r.w/2,cy+Rr+17+k*7.5,5.4,lk?C.faint:C.dim,'center',r.w-10,700)); }
    else G.txt(sub,r.x+r.w/2,cy+Rr+18,5.8,lk?C.faint:C.dim,'center',r.w-10,700); }
   if(lk) G.icon('lock',c,r.x+r.w-12,y+12,9,C.dim);
   if(r.href&&!lk) G.icon('link',c,r.x+r.w-12,y+12,9,C.dim);
   const n=G.cardBadge[r.id]?G.cardBadge[r.id]():0;
   if(n>0){ c.beginPath(); c.arc(r.x+r.w-11,y+11,7,0,7); c.fillStyle=C.bad; c.fill(); G.txt(String(Math.min(n,9)),r.x+r.w-11,y+6.8,6,'#fff','center',undefined,800); }
   else if(n<0){ c.beginPath(); c.arc(r.x+r.w-11,y+11,4.5,0,7); c.fillStyle=C.bad; c.fill(); }
  });
  const noAcc=CFG.accounts&&CFG.accounts.enabled===false;
  G.topBar(CFG.dashTitle||(noAcc?CFG.name:G.who()),{back:!noAcc||!this.isHome,backLabel:G.activeAcct&&this.isHome?G.word('exit'):'BACK',sub:G.data.label(),gear:true});
  if(this.exitM) this.exitM.draw(c);
 }
};
})();
