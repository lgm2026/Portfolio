/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* HYPETEEN FLIGHT ACADEMY - the cadet: look, call signs, XP + ranks, the Locker, and the world's hooks.
   Shell hooks used: G.playerAv, G.drawAcct, G.nameSuggest, G.afterSignup, G.onAward, G.WORLD.onRoom/onTalk/onOpen/crowd/sub */
(function(){
const H=G.HFQ, C=G.C, VW=G.VW;
const cad=()=>(G.save.mod.cadet=G.save.mod.cadet||{});
const pick=a=>a[Math.floor(Math.random()*a.length)];

/* ---------- look ---------- */
G.playerAv=()=>Object.assign({},H.defaultAv,cad().av||{});
G.drawAcct=(c,a,x,y,d,ring)=>G.drawPortrait(c,x,y,d,Object.assign({},H.defaultAv,a.av||{}),ring);

/* ---------- call signs (made up, never a real name) ---------- */
G.nameSuggest=function(){ const used=(G.roster&&G.roster.accounts||[]).map(a=>a.name); let cur=''; try{ cur=G.fieldVal?String(G.fieldVal('name')||''):''; }catch(e){} for(let k=0;k<80;k++){ const n=pick(H.callSigns); if(!used.includes(n)&&n!==cur) return n; } return pick(H.callSigns); };   // r7.4: never the one already in the box (SUGGEST ONE twice always changes it)

/* ---------- XP + ranks ---------- */
H.rank=function(xp){
 let i=0; for(let k=0;k<H.ranks.length;k++) if(xp>=H.ranks[k].xp) i=k;
 const r=H.ranks[i], nx=H.ranks[i+1], ph=H.phases[r.phase];
 return {i,n:r.n,min:r.xp,next:nx?nx.xp:null,nextN:nx?nx.n:null,
  phase:r.phase,phaseN:ph.n,book:ph.book,step:r.step,stepN:H.steps[r.step],
  short:'PHASE '+(r.phase+1)+' • STEP '+H.steps[r.step]};
};
G.onAward=function(pts){
 const now=G.save.points, before=now-pts, a=H.rank(before), b=H.rank(now);
 /* r7.4 notices: a new academy phase is a milestone (tier 3, shown at the next calm moment); a step inside a phase is routine (tier 1) */
 if(a.phase<b.phase){ G.toast('NEW PHASE: '+b.phaseN,C.good,{kind:'phase',tier:3,title:b.phaseN,sub:'Phase '+(b.phase+1)+' of '+H.phases.length+', named for Book '+b.book+' of the series. New aircraft may be waiting in your hangar.'}); }
 else if(a.i<b.i){ G.toast('STEP UP: '+b.n,C.good,{kind:'step',tier:1}); AUDIO.sfx('chime2'); }
 if(G.activeAcct){ G.activeAcct.xp=now; G.saveRoster(); }
};

/* ---------- enrollment ends at the Locker ---------- */
G.afterSignup=function(){
 G.ach('enrolled'); G.award(H.xp.enroll,'ENROLLED');
 G.go('locker',{first:true});
};

/* ---------- world hooks ---------- */
const W=G.WORLD;
W.sub=()=>G.who()+' • '+H.rank(G.save.points).short+' • '+G.save.points+' XP';
W.onRoom=function(key,first){
 if(!first) return;
 G.award(H.xp.place,'NEW PLACE');
 const v=G.save.mod.world.visited||{};
 if(Object.keys(W.rooms).every(k=>v[k])) G.ach('explorer');
};
W.onTalk=function(n,first){
 if(!first) return;
 G.award(H.xp.crew,'MET THE '+n.name);
 const met=G.save.mod.world.met||{}, all=[];
 for(const k in W.rooms) for(const q of W.rooms[k].npcs||[]) all.push(q.id);
 if(all.every(id=>met[id])) G.ach('crew');
};
W.onOpen=function(s){
 if(s.key==='news'&&!cad().news){ cad().news=1; G.persist(); G.award(H.xp.news,'READ THE NEWS'); G.ach('newsreader'); }
};
/* other cadets enrolled on this device hang out in the Lounge */
H.cadets=function(){
 return (G.roster.accounts||[]).map(a=>{
  let s=null; try{ s=JSON.parse(localStorage.getItem(G.KEYS.acct(a.id))||'null'); }catch(e){}
  const xp=(s&&s.points)||a.xp||0;
  const mod=(s&&s.mod)||{};
  return {id:a.id,name:a.name,acct:a,xp,rank:H.rank(xp),av:Object.assign({},H.defaultAv,a.av||{}),ac:(G.activeAcct&&G.activeAcct.id===a.id&&H.myAC)?H.myAC():(H.acForAcct?H.acForAcct(a):null),me:!!(G.activeAcct&&G.activeAcct.id===a.id),
   wkxp:(H.weekKey&&a.wk===H.weekKey())?(a.wkxp||0):0,
   badges:Object.keys((s&&s.ach)||{}).length,patches:Object.keys((mod.gs||{}).done||{}).length,flights:((mod.flog||{}).e||[]).filter(e=>e.k!=='sim').length,spotted:Object.keys((mod.cadet||{}).spotted||{}).length};
 });
};
W.crowd=function(key){
 if(key!=='lounge') return [];
 return H.cadets().filter(p=>!p.me).map(p=>({id:p.id,name:p.name,av:p.av,sub:p.rank.short,
  line:'Hi! I’m '+p.name+'. I’m in phase '+(p.rank.phase+1)+', '+p.rank.phaseN+', with '+p.xp+' XP. See you in Ground School!'}));
};

/* ============================ THE LOCKER: build your cadet ============================ */
const LK=H.look;
G.scenes.locker={
 enter(a){ this.first=!!a.first; this.back=a.back||G.homeScene(); this.av=G.playerAv(); this.st={f:0}; this.t=0; },
 layout(){
  /* tall screens share their spare height: the preview grows first (up to 230), then the rows breathe (up to +8 each) */
  const VH=G.VH, top=46, spare=Math.max(0,VH-top-8-5*44-52-10-120), prevH=120+Math.min(110,spare), gap=44+Math.min(8,Math.max(0,(spare-110)/5));
  let y=top+prevH+8; const rows=[];
  const sw=(id,label,list)=>{ rows.push({id,label,kind:'sw',list,y,h:40}); y+=gap; };
  const sg=(id,label,list)=>{ rows.push({id,label,kind:'seg',list,y,h:40}); y+=gap; };
  sw('suit','FLIGHT SUIT',LK.suit); sw('skin','SKIN',LK.skin); sw('hair','HAIR COLOR',LK.hair);
  sg('style','HAIR STYLE',LK.style); sg('hat','HEADGEAR',LK.hat);
  const by=Math.max(y+2,VH-52);
  const bw=(VW-36)/3;
  const btns=[{id:'random',label:'SURPRISE ME',kind:'ghost',x:12,y:by,w:bw,h:40,size:6.8},
              {id:'plane',label:'MY AIRCRAFT',kind:'ghost',x:18+bw,y:by,w:bw,h:40,size:6.8},
              {id:'done',label:this.first?'NEXT ▸':'DONE',kind:'primary',x:24+bw*2,y:by,w:bw,h:40,size:this.first?8.4:9}];
  return {top,prevH,rows,btns};
 },
 swRects(r){ const n=r.list.length, gap=6, d=Math.min(24,(VW-24-gap*(n-1))/n), x0=14; return r.list.map((col,i)=>({col,i,x:x0+i*(d+gap),y:r.y+14,d})); },   // left-aligned under each label
 set(k,v){
  this.av[k]=v; if(k==='suit') this.av.hatCol=G.shade(v,.7);
  cad().av=Object.assign({},this.av); G.persist();
  if(G.activeAcct){ G.activeAcct.av=cad().av; G.saveRoster(); }
  if(!cad().styled){ cad().styled=1; G.persist(); G.award(G.HFQ.xp.locker,'LOCKER READY'); G.ach('styled'); }
  AUDIO.sfx('blip');
 },
 leave(){ if(this.first) G.go('trainer',{first:true}); else G.go(this.back); },
 update(dt){
  this.t+=dt;
  if(G.backHit()){ this.leave(); return; }
  const L=this.layout();
  for(const r of L.rows){
   if(r.kind==='sw'){ for(const s of this.swRects(r)) if(G.clicked(s.x-2,s.y-2,s.d+4,s.d+4)){ this.set(r.id,s.col); return; } }
   else { const i=G.segHit(12,r.y+14,VW-24,24,r.list.length); if(i>=0){ this.set(r.id,r.list[i][0]); return; } }
  }
  const id=G.navList(this.st,L.btns,{horiz:true});
  if(id==='random'){ this.set('suit',pick(LK.suit)); this.av.skin=pick(LK.skin); this.av.hair=pick(LK.hair); this.av.style=pick(LK.style)[0]; this.av.hat=pick(LK.hat)[0]; this.set('hat',this.av.hat); }
  if(id==='done') this.leave();
  if(id==='plane') G.go(this.first?'trainer':'fleet',this.first?{first:true}:{back:'locker'});
 },
 draw(c){
  const L=this.layout(), VH=G.VH;
  G.backdrop(.9);
  // preview: the cadet in front of a locker
  G.panel(12,L.top,VW-24,L.prevH,{r:14,border:G.rgba(C.accent,.45)});
  G.worldArt.floor.locker(c,[30,L.top+L.prevH-14,94,L.top+L.prevH-8],L.prevH-34,'#4a6a9a');
  const s=Math.min(4.4,(L.prevH-26)/36);
  G.drawPerson(c,VW/2+20,L.top+L.prevH-10,s,this.av,G.rm()?1:(Math.sin(this.t*.8)>0?1:-1),0);
  G.txt(G.who(),VW-24,L.top+10,8,C.title,'right',110,800);
  G.txt(G.HFQ.rank(G.save.points).n,VW-24,L.top+24,6,C.dim,'right',110,700);
  for(const r of L.rows){
   G.txt(r.label,14,r.y,6,C.dim,'left',undefined,800);
   if(r.kind==='sw') for(const sq of this.swRects(r)){
    const on=this.av[r.id]===sq.col;
    c.beginPath(); c.arc(sq.x+sq.d/2,sq.y+sq.d/2,sq.d/2,0,7); c.fillStyle=sq.col; c.fill();
    c.lineWidth=on?2.4:1; c.strokeStyle=on?C.accentHi:'rgba(255,255,255,.25)'; c.stroke();
    if(on){ c.beginPath(); c.arc(sq.x+sq.d/2,sq.y+sq.d/2,sq.d/2+3,0,7); c.strokeStyle=G.rgba(C.accentHi,.45); c.lineWidth=1; c.stroke(); }
   } else G.seg(12,r.y+14,VW-24,24,r.list.map(q=>q[1]),r.list.findIndex(q=>q[0]===this.av[r.id]),5.8);
  }
  G.drawBtns(L.btns,this.st);
  G.topBar(this.first?'SUIT UP, CADET':'MY LOCKER',{back:!this.first||true,sub:this.first?'PICK YOUR LOOK • CHANGE IT ANYTIME':null});
 }
};
})();

/* ---------- keeping the save safe (handoff build) ---------- */
(function(){ const H=G.HFQ;
 /* ask the browser to keep this site's storage (Safari can evict site data after a week away; a persistent grant stops that). Best effort, silent. */
 try{ if(navigator.storage&&navigator.storage.persist) navigator.storage.persist().catch(()=>{}); }catch(e){}
 /* stamp every cadet's save with a version, so a future change of shape has something to migrate from */
 H.SAVE_V=1; const stamp=()=>{ const m=G.save&&G.save.mod; if(m&&!m.v){ m.v=H.SAVE_V; } };
 const prevLoad=G.loadSave; G.loadSave=function(key){ prevLoad.call(G,key); stamp(); }; stamp();
 /* a last-resort guard: an unexpected error must never leave the screen frozen without a word. The frame loop keeps running; say so once, then keep quiet. */
 let said=0; window.addEventListener('error',()=>{ const now=Date.now(); if(now-said<15000) return; said=now; try{ G.toast('SOMETHING WENT WRONG. IF THE SCREEN IS STUCK, TAP BACK OR RELOAD.',G.C.warn); }catch(e){} });
})();
