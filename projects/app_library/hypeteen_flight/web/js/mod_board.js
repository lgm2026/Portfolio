/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* MODULE EXAMPLE: BULLETIN BOARD — a complete, working pattern to copy for any shared list
   (announcements, sign-ups, logs, requests...). It shows:
     - a live subscription to a shared collection (G.data.watch) that is dropped on exit
     - a native multi-line text box + a POST button that writes (G.data.add)
     - who may post (CONFIG.board.post: null | 'member' | 'owner'), who may delete (the author or the owner)
     - a confirm modal, empty / offline states, and a "N NEW" subtitle on its dashboard card
   Settings: CONFIG.board = {title, collection, post, max}
   Copy this file to mod_<name>.js, rename the scene + collection, add a <script> tag and a card. */
(function(){
const VW=G.VW, C=G.C, CL=G.CL, D=G.data, CFG=G.CFG;
const O=Object.assign({title:'BULLETIN',collection:'posts',post:'member',max:280},CFG.board||{});
let rows=[], loaded=false, err=null, un=null;
/* stay subscribed while the app is open, so the dashboard card can show what's new */
function sub(){ if(un) return; un=D.watch(O.collection,{limit:100},(r,e)=>{ rows=r; loaded=true; err=e||null; }); }
D.whenReady(sub);
const seenKey='board_'+O.collection;
G.cardSub.board=()=>{ if(!loaded) return null; const s=(G.save.seen||{})[seenKey]||0, n=rows.filter(r=>r.at>s&&!D.mine(r)).length; return n?n+' NEW':(rows.length?rows.length+' POSTS':null); };

G.scenes.board={
 enter(a){ this.back=a.back||G.homeScene(); this.list=CL.List(); this.m=null; this.del=null; this.compose=false; this.busy=false; sub(); },
 exit(){ G.save.seen[seenKey]=Date.now(); G.persist(); },
 canPost(){ return D.db&&D.can(O.post); },
 area(){ const top=this.compose?178:(this.canPost()?92:48); return {x:4,y:top,w:VW-8,h:G.VH-top-6}; },
 items(){
  const I=[];
  if(!loaded) I.push(CL.note(['LOADING…']));
  else if(err==='offline'||!D.db) I.push(CL.note(['NO SHARED DATA ON THIS COPY.','PUBLISH IT WITH THE db CAPABILITY.']));
  else if(!rows.length) I.push(CL.note(['NOTHING POSTED YET.',this.canPost()?'BE THE FIRST.':'CHECK BACK SOON.']));
  for(const r of rows) I.push(postItem(r));
  return I;
 },
 openCompose(){
  this.compose=true; this.list.reset();
  G.field('msg',{x:12,y:50,w:VW-24,h:78,multiline:true,max:O.max,align:'left',placeholder:'WRITE SOMETHING…',onEnter:()=>this.send()});
  G.focusField('msg');
 },
 closeCompose(){ this.compose=false; G.removeField('msg'); this.list.reset(); },
 send(){
  const t=G.fieldVal('msg').trim();
  if(!t){ AUDIO.sfx('buzzer'); return; }
  if(this.busy) return; this.busy=true;
  D.add(O.collection,{text:t}).then(()=>{ this.busy=false; this.closeCompose(); AUDIO.sfx('cheer'); G.toast('POSTED',C.good); })
   .catch(e=>{ this.busy=false; AUDIO.sfx('buzzer'); G.toast('COULDN’T POST - '+((e&&e.message)||'TRY AGAIN').toUpperCase(),C.bad); });
 },
 btns(){
  if(this.compose) return [{id:'cancel',label:'CANCEL',x:12,y:136,w:100,h:34,size:7.5},{id:'send',label:this.busy?'POSTING…':'POST',kind:'primary',x:120,y:136,w:VW-132,h:34,size:8,disabled:this.busy}];
  if(this.canPost()) return [{id:'new',label:'+ NEW POST',kind:'ghost',x:12,y:50,w:VW-24,h:34,size:8}];
  return [];
 },
 update(){
  if(this.m){
   const r=this.m.update();
   if(r==='no'||(r==null&&G.pressed.b)){ this.m=null; G.hideFields(false); return; }
   if(r==='yes'){ D.remove(O.collection,this.del.id).then(()=>G.toast('DELETED',C.info)).catch(()=>G.toast('COULDN’T DELETE',C.bad)); this.m=null; G.hideFields(false); }
   return;
  }
  if(G.backHit()){ if(this.compose) this.closeCompose(); else G.go(this.back); return; }
  for(const b of this.btns()) if(!b.disabled&&G.clicked(b.x,b.y,b.w,b.h)){
   AUDIO.sfx('ok');
   if(b.id==='new') this.openCompose(); else if(b.id==='cancel') this.closeCompose(); else if(b.id==='send') this.send();
   return;
  }
  this.list.update(this.items(),this.area(),a=>{
   if(a&&a.del){ this.del=a.del; G.hideFields(true); this.m=G.confirm({title:'DELETE THIS POST?',lines:['THIS CAN’T BE UNDONE.'],yes:'DELETE',danger:true}); }
  });
 },
 draw(c){
  G.backdrop(.9);
  this.list.draw(c,this.items(),this.area());
  G.drawBtns(this.btns());
  if(this.compose) G.txt(G.fieldVal('msg').length+' / '+O.max,VW-14,132-12,5.6,C.dim,'right');
  G.topBar(O.title,{sub:D.label()});
  if(this.m) this.m.draw(c);
 }
};

/* one post: face/initial, name, time, wrapped text; a DELETE link for the author or the owner */
function postItem(r){
 const size=7.2, lh=size*1.5; let L=null, lw=0;
 const canDel=D.mine(r)||D.isOwner();
 const it={h:0,focus:canDel,
  measure(w){ if(lw!==w){ L=G.wrap(String(r.text||''),size,w-24,500); lw=w; } it.h=40+L.length*lh+10; return it; },
  draw(c,x,y,w,foc){
   const h=it.h-6;
   G.rrect(x,y,w,h,12); c.fillStyle=C.card; c.fill(); c.strokeStyle=foc?C.title:(D.mine(r)?G.rgba(C.accent,.45):'rgba(255,255,255,.1)'); c.lineWidth=foc?2:1; c.stroke();
   G.drawFace(null,x+10,y+9,22,r.byName);
   G.txt(r.byName||'SOMEONE',x+38,y+9,7.6,D.mine(r)?C.title:C.ink,'left',w-110,800);
   G.txt(G.ago(r.at),x+38,y+21,5.6,C.dim,'left',undefined,700);
   if(canDel) G.txt('DELETE',x+w-12,y+12,6,C.bad,'right',undefined,800);
   L.forEach((l,i)=>G.txt(l,x+12,y+38+i*lh,size,C.sub,'left',undefined,500));
  },
  tap(lx,ly,w){ return canDel&&lx>w-60&&ly<30?{del:r}:null; },
  enter(){ return canDel?{del:r}:null; }};
 return it;
}
})();
