/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* HYPETEEN FLIGHT ACADEMY - THE CREW BOARD: the social hub, built for kids.
   Nobody types anything. The board fills itself with what cadets DO: badges, phase steps, unit patches, aircraft
   spotted, game personal bests, flights logged (never where). Cadets give each other KUDOS (one tap), and the
   CADETS tab is the leaderboard (all time + this week) with a profile card for each cadet: look, aircraft,
   phase, patches, badges, flights, kudos received. Hangar News stays the Family Lead's announcement board.
   Shared data: collection 'feed' (G.data: this device, or the artifact's shared db) = {kind,text,icon,av,ac,kudos:[uid]}
   In the Lounge, the departure board on the wall shows the latest lines, split-flap style. */
(function(){
const H=G.HFQ, C=G.C, CL=G.CL, VW=G.VW, PI=Math.PI, D=G.data;
const cad=()=>(G.save.mod.cadet=G.save.mod.cadet||{});
let rows=[], loaded=false, un=null;
function sub(){ if(un) return; un=D.watch('feed',{limit:120},(r,e)=>{ rows=r; loaded=true; }); }
D.whenReady(sub);
H.feedRows=()=>rows;
const weekKey=()=>{ const d=new Date(), day=(d.getDay()+6)%7, m=new Date(d.getFullYear(),d.getMonth(),d.getDate()-day); return m.getFullYear()+'-'+(m.getMonth()+1)+'-'+m.getDate(); };
H.weekKey=weekKey;

/* ---------- posting: one line per event, deduped, only for signed-in cadets ---------- */
H.feed=function(key,text,o){
 o=o||{}; if(!G.activeAcct||!D.db||!D.can('member')) return;
 const seen=(cad().fed=cad().fed||{}); if(key&&seen[key]) return; if(key){ seen[key]=1; G.persist(); }
 const ac=H.myAC?H.myAC():null;
 D.add('feed',{kind:o.kind||'event',text,icon:o.icon||'star',av:G.playerAv?G.playerAv():{},ac:ac?{id:ac.id,paint:ac.paint}:null,kudos:[]}).catch(()=>{});
};
H.kudos=function(row){ if(!G.activeAcct||!D.db) return; const me=D.me().uid, k=(row.kudos||[]).slice(); const i=k.indexOf(me); if(i>=0) k.splice(i,1); else k.push(me);
 D.db.collection('feed').doc(row.id).update({kudos:k}).catch(()=>{}); AUDIO.sfx(i>=0?'blip':'chime2'); };
H.kudosFor=uid=>rows.filter(r=>r.by===uid).reduce((a,r)=>a+((r.kudos||[]).length),0);

/* ---------- hooks: the things that make a line on the board ---------- */
const prevAch=G.ach;
G.ach=function(id){ const had=G.save.ach[id]; prevAch(id); if(!had&&G.save.ach[id]){ const a=(G.CFG.badges||[]).find(x=>x.id===id); if(a) H.feed('badge:'+id,'earned the '+a.n+' badge',{icon:'medal',kind:'badge'}); } };
const prevAward=G.onAward;
G.onAward=function(pts){
 const now=G.save.points, before=now-pts, a=H.rank(before), b=H.rank(now);
 if(prevAward) prevAward(pts);
 if(a.phase<b.phase) H.feed('phase:'+b.phase,'reached phase '+(b.phase+1)+': '+b.phaseN,{icon:'trophy',kind:'phase'});
 else if(a.i<b.i) H.feed('step:'+b.i,'stepped up to '+b.n,{icon:'chevrons',kind:'phase'});
 // XP this week, for the CADETS tab
 const w=weekKey(), c=cad(); if(!c.wk||c.wk.w!==w) c.wk={w,xp:0}; c.wk.xp+=pts; G.persist(); if(G.activeAcct){ G.activeAcct.wk=w; G.activeAcct.wkxp=c.wk.xp; G.saveRoster(); }
};
const prevSpot=H.spot;
H.spot=function(id){ const fresh=prevSpot(id); if(fresh){ const m=H.acById(id); H.feed('spot:'+id,'spotted '+H.an(m.name)+' '+m.name,{icon:'search',kind:'spot'}); } return fresh; };
const prevComplete=G.groundSchool.complete;
G.groundSchool.complete=function(id,score){ const had=((G.save.mod.gs||{}).done||{})[id]; prevComplete.call(G.groundSchool,id,score); if(!had){ const u=H.units.find(q=>q.id===id); if(u) H.feed('patch:'+id,'earned the '+u.t+' patch',{icon:'medal',kind:'patch'}); } };
const prevGameDone=H.gameDone;
H.gameDone=function(id,score,o){ const r=prevGameDone(id,score,o); if(r.better||r.first){ const g=H.gameById(id); if(g&&!r.first) H.feed('best:'+id+':'+(H.dayKey?H.dayKey(0):''),'set a personal best in '+g.name+': '+H.fmtScore(id,score),{icon:g.icon||'joy',kind:'best'}); } return r; };

/* ---------- the feed item ---------- */
function feedItem(r){
 const me=D.me().uid, mine=r.by===me, k=(r.kudos||[]).length, gave=(r.kudos||[]).includes(me), size=6.6; let L=null, lw=0;
 const it={h:0,focus:true,
  measure(w){ if(lw!==w){ L=G.wrap((r.byName||'A CADET')+' '+r.text,size,w-68,700); lw=w; } it.h=Math.max(52,20+L.length*9+12)+6; return it; },
  draw(c,x,y,w,foc){ const h=it.h-6;
   G.rrect(x,y,w,h,12); c.fillStyle=mine?G.rgba(C.accent,.08):C.card; c.fill(); c.strokeStyle=foc?C.title:'rgba(255,255,255,.1)'; c.lineWidth=foc?2:1; c.stroke();
   G.drawPortrait(c,x+8,y+8,30,r.av||{},mine?C.accent:null); G.icon(r.icon||'star',c,x+34,y+34,9,C.accentHi);
   L.forEach((l,i)=>G.txt(l,x+48,y+9+i*9,size,C.ink,'left',w-60,i?600:700));
   G.txt(G.ago(r.at),x+48,y+h-13,4.8,C.dim,'left',undefined,700);
   const kb={x:x+w-58,y:y+h-24,w:50,h:18}; G.rrect(kb.x,kb.y,kb.w,kb.h,9); c.fillStyle=gave?G.rgba(C.accent,.3):'rgba(255,255,255,.06)'; c.fill(); c.strokeStyle=gave?C.accentHi:'rgba(255,255,255,.14)'; c.lineWidth=1; c.stroke();
   G.txt((gave?'★ ':'☆ ')+'KUDOS'+(k?' '+k:''),kb.x+kb.w/2,kb.y+5,4.8,gave?C.accentHi:C.sub,'center',undefined,800);
  },
  tap(lx,ly,w){ return (lx>w-62&&ly>it.h-32)?{kudos:r}:{who:r.by}; }, enter(){ return {kudos:r}; }};
 return it;
}
/* ---------- the cadet rows (leaderboard) ---------- */
function cadetRow(p,i,wk){
 return {h:60,focus:true,t:p.name,
  draw(c,x,y,w,foc){
   G.rrect(x,y+2,w,54,12); c.fillStyle=p.me?G.rgba(C.accent,.14):C.card; c.fill(); c.strokeStyle=foc?C.title:(p.me?G.rgba(C.accent,.5):'rgba(255,255,255,.1)'); c.lineWidth=foc||p.me?2:1; c.stroke();
   G.txt(String(i+1),x+12,y+22,9,i<3?C.accentHi:C.dim,'center',undefined,800);
   G.drawPortrait(c,x+24,y+9,36,p.av,p.me?C.accent:null);
   G.txt(p.name,x+68,y+10,8,p.me?C.accentHi:C.ink,'left',w-150,800);
   G.txt('PHASE '+(p.rank.phase+1)+' • '+p.rank.n,x+68,y+26,5.2,C.dim,'left',w-150,700);
   const ac=p.ac||(p.me&&H.myAC?H.myAC():null); if(ac&&H.drawAC) H.drawAC(c,ac.id,x+66,y+34,40,18,ac.paint,{ground:false});
   G.txt(p.xp+' XP',x+w-10,y+10,7,C.sub,'right',undefined,800); G.txt('+'+(wk?p.wkxp:0)+' THIS WEEK',x+w-10,y+24,5,wk&&p.wkxp?C.good:C.dim,'right',undefined,800);
   G.txt('★ '+H.kudosFor(p.id),x+w-10,y+38,5,C.accentHi,'right',undefined,800);
  },
  tap(){ return {who:p.id}; }, enter(){ return {who:p.id}; }};
}
G.scenes.crew={
 enter(a){ a=a||{}; this.back=a.back||G.homeScene(); this.tab=a.tab||'feed'; this.list=CL.List(); this.who=null; sub(); G.loadRoster(); if(AUDIO.curName!=='lounge') AUDIO.play('lounge'); },
 exit(){ G.save.seen=G.save.seen||{}; G.save.seen.feed=Date.now(); G.persist(); },
 area(){ return {x:4,y:78,w:VW-8,h:G.VH-82}; },
 cadets(){ return H.cadets().sort((a,b)=>b.xp-a.xp); },
 items(){ const I=[];
  if(this.tab==='feed'){
   if(!loaded) I.push(CL.note(['LOADING…']));
   else if(!D.db) I.push(CL.note(['NO SHARED DATA ON THIS COPY.']));
   else if(!rows.length) I.push(CL.note(['THE BOARD IS EMPTY SO FAR.','EARN A BADGE, SPOT AN AIRCRAFT OR','LOG A FLIGHT AND IT SHOWS UP HERE.']));
   else { I.push(CL.text('What every cadet on this board has been up to. Tap ☆ KUDOS to cheer someone on.',{size:6,col:C.sub})); for(const r of rows) I.push(feedItem(r)); }
  } else { const all=this.cadets(); I.push(CL.text('Highest XP first. Tap a cadet for their card. Enroll family and friends from the sign-in screen.',{size:6,col:C.sub}));
   if(!all.length) I.push(CL.note(['NO CADETS ENROLLED YET.'])); all.forEach((p,i)=>I.push(cadetRow(p,i,true))); }
  return I; },
 update(){
  if(this.who){ if(G.backHit()||G.pressed.b||G.ptr.click){ G.ptr.click=false; this.who=null; } return; }
  if(G.backHit()){ G.go(this.back); return; }
  const i=G.segHit(12,50,VW-24,22,2); if(i>=0){ const t=['feed','cadets'][i]; if(t!==this.tab){ this.tab=t; this.list.reset(); AUDIO.sfx('blip'); } return; }
  this.list.update(this.items(),this.area(),a=>{ if(!a) return; if(a.kudos){ H.kudos(a.kudos); return; } if(a.who){ const p=H.cadets().find(q=>q.id===a.who); if(p){ this.who=p; AUDIO.sfx('card'); } } });
 },
 draw(c){
  G.backdrop(.9);
  G.seg(12,50,VW-24,22,['ACTIVITY','CADETS'],this.tab==='feed'?0:1,6.6);
  this.list.draw(c,this.items(),this.area());
  if(this.who) this.drawCard(c,this.who);
  const nc=H.cadets().length; G.topBar('CREW BOARD',{sub:D.label()+' • '+nc+(nc===1?' CADET':' CADETS')});
 },
 drawCard(c,p){
  const VH=G.VH, h=Math.min(330,VH-100), y=(VH-h)/2, x=14, w=VW-28;
  G.dim(.6); G.panel(x,y,w,h,{r:16,border:G.rgba(C.accent,.6)});
  // a cadet ID card: portrait, name, phase, their aircraft
  c.fillStyle=G.rgba(C.accent,.12); G.rrect(x+1,y+1,w-2,56,15); c.fill(); c.fillStyle=C.panel; c.fillRect(x+1,y+40,w-2,18);
  G.drawPortrait(c,x+12,y+10,44,p.av,C.accent);
  G.txt(p.name,x+64,y+12,10,C.title,'left',w-80,800); G.txt('PHASE '+(p.rank.phase+1)+' • '+p.rank.n,x+64,y+28,5.6,C.sub,'left',w-80,800);
  if(p.acct.owner) G.txt(G.word('owner'),x+64,y+40,5,C.accentHi,'left',undefined,800);
  const ac=p.ac||{id:'c172'}; if(H.drawAC){ H.drawAC(c,ac.id,x+w/2-70,y+62,140,70,ac.paint,{ground:true,prop:'spin',t:G.time,fly:true}); G.txt(H.acById(ac.id).name,x+w/2,y+134,6,C.sub,'center',w-20,800); }
  const st=[['XP',p.xp],['THIS WEEK','+'+(p.wkxp||0)],['KUDOS','★ '+H.kudosFor(p.id)],['FLIGHTS',p.flights||0],['PATCHES',p.patches||0],['BADGES',p.badges||0]];
  const cw=(w-20)/st.length; st.forEach(([k,v],i)=>{ const cx=x+10+i*cw+cw/2; G.txt(String(v),cx,y+150,9,i===2?C.accentHi:C.ink,'center',cw-4,800); G.txt(k,cx,y+166,4.4,C.dim,'center',cw-4,800); });
  const mine=rows.filter(r=>r.by===p.id).slice(0,4); G.txt('LATEST ON THE BOARD',x+14,y+184,4.8,C.dim,'left',undefined,800);
  if(!mine.length) G.txt('NOTHING YET',x+14,y+196,6,C.sub,'left',undefined,700); mine.forEach((r,i)=>{ G.icon(r.icon||'star',c,x+20,y+202+i*16,9,C.accentHi); G.txt(r.text.toUpperCase(),x+32,y+198+i*16,5.4,C.ink,'left',w-50,700); });
  G.txt('TAP TO CLOSE',x+w/2,y+h-16,5.4,C.accentText,'center',undefined,800);
 }
};
G.scenes.squadron=G.scenes.crew;
G.cardSub.squadron=()=>{ if(!loaded) return null; const s=(G.save.seen||{}).feed||0, n=rows.filter(r=>r.at>s&&!D.mine(r)).length; const nc=H.cadets().length; return n?n+' NEW':(nc+(nc===1?' CADET':' CADETS')); };

/* ---------- the departure board in the Lounge (wall art 'depboard') ---------- */
G.worldArt.wall.depboard=function(c,s,R){
 const w=s.w, x=s.x-w/2, y=18, h=R.wall-46, t=G.rm()?0:G.time;
 c.fillStyle='#14161a'; c.fillRect(x-3,y-3,w+6,h+6); c.fillStyle='#0b0c10'; c.fillRect(x,y,w,h);
 c.fillStyle='#ffc21a'; c.fillRect(x,y,w,9); G.txt('CREW BOARD',x+4,y+2,5,'#111','left',undefined,800); G.txt(new Date().getHours().toString().padStart(2,'0')+':'+new Date().getMinutes().toString().padStart(2,'0'),x+w-4,y+2,5,'#111','right',undefined,800);
 const L=rows.slice(0,Math.floor((h-14)/9)); const flap=Math.floor(t*6);
 if(!L.length) G.txt('— NO ACTIVITY YET —',x+w/2,y+h/2-3,4.6,'#f4c24d','center',w-6,800);
 L.forEach((r,i)=>{ const yy=y+13+i*9, nm=(r.byName||'CADET').slice(0,9), tx=r.text.toUpperCase().slice(0,22), k=(r.kudos||[]).length;
  c.fillStyle=i%2?'rgba(255,255,255,.03)':'rgba(255,255,255,0)'; c.fillRect(x+1,yy-1,w-2,9);
  G.txt(nm,x+4,yy,4.4,'#f4c24d','left',38,800); G.txt(i===0&&(flap%7===0)?tx.replace(/[A-Z]/g,'▯'):tx,x+44,yy,4.4,'#f4e6b8','left',w-62,700); if(k) G.txt('★'+k,x+w-4,yy,4.2,'#ffd24d','right',undefined,800); });
};
})();
