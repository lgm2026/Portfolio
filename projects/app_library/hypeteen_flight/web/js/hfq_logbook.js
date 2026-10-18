/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* HYPETEEN FLIGHT ACADEMY - MY LOGBOOK (the pilot card, the flight log's two books, Ground School, the phases, badges, places and crew)
   and the SQUADRON list (every cadet on this device; the Crew Board in hfq_crew.js replaced it as the social screen). */
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
   if(p.ac&&H.drawAC) H.drawAC(c,p.ac.id,x+w-84,y+9,44,24,p.ac.paint,{ground:false});
  },
  tap(){ return act; }, enter(){ return act; }};
}

/* ============================ LOGBOOK ============================
   A pilot's logbook, cadet-sized: the pilot card on top, then the flight log's two books (real flights and sim
   sessions, kept apart), Ground School, the academy phases, and compact grids for badges, places and crew. */
const SIMC='#38c9d6';
const hhmm=min=>Math.floor(min/60)+':'+String(min%60).padStart(2,'0');
const BADGE_ICON={enrolled:'user',styled:'user',explorer:'map',crew:'chat',student:'docs',newsreader:'megaphone',firstflight:'plane',perfect:'star',tailwind:'chevrons',streak3:'cal',checkride:'medal',mytrainer:'plane',arcade:'joy',arcade8:'joy',radio:'headset',spotter:'search',spotall:'search',games17:'joy',games27:'trophy',briefed:'star',reader:'book',bookworm:'book',librarian:'book',testout:'chevrons',gold1:'medal',goldall:'trophy',trivia10:'star',flightlog:'cal',traveler:'plane',grad:'trophy',stugrad:'medal',prvgrad:'medal',topsky:'trophy'};
const fmtDay=t=>{ const d=new Date(t); return d.getDate()+' '+['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][d.getMonth()]+' '+d.getFullYear(); };
H.BADGE_ICON=BADGE_ICON;
/* a badge as a medal (also used to export the badge art): H.drawBadge(c, x, y, r, badgeId, earned) */
/* fifteen winged badge paintings (assets/art/badges): the board's ten, redrawn by the illustrator, and five more from the
   illustrator's originals (book, laurel, airliner, biplane, four-engine jet); each badge wears the one that fits it */
const BADGE_ART={enrolled:'radio',styled:'explorer',explorer:'navigation',crew:'explorer',student:'groundschool',newsreader:'radio',firstflight:'firstflight',perfect:'laurel',tailwind:'weather',streak3:'flightplanning',checkride:'flightplanning',mytrainer:'maintenance',arcade:'jetops',arcade8:'jetops',radio:'radio',spotter:'biplane',spotall:'history',games17:'jetliner',games27:'jetliner',briefed:'navigation',reader:'groundschool',bookworm:'groundschool',librarian:'history',testout:'navigation',gold1:'laurel',goldall:'mastercadet',trivia10:'weather',flightlog:'firstflight',traveler:'airliner',grad:'explorer',stugrad:'flightplanning',prvgrad:'laurel',topsky:'mastercadet'};
H.badgeArt=id=>'badge:'+(BADGE_ART[id]||'firstflight');
H.badgeSrc=id=>{ const e=G.ART&&G.ART.entry&&G.ART.entry(H.badgeArt(id)); return e?e.src:null; };
H.drawBadge=(c,x,y,r,id,on)=>{ if(G.ART&&G.ART.has(H.badgeArt(id))){ const im=G.ART.img(H.badgeArt(id)); if(im){ c.save(); if(!on){ c.globalAlpha=.35; } c.drawImage(im,x-r*1.25,y-r*1.25,r*2.5,r*2.5); c.restore(); if(!on){ c.save(); c.globalAlpha=.6; G.icon('lock',c,x,y,r*.9,C.dim); c.restore(); } return; } } medal(c,x,y,r,on,BADGE_ICON[id]||'medal'); };
function medal(c,x,y,r,on,icon){ c.beginPath(); c.arc(x,y,r,0,7); if(on){ const g=c.createRadialGradient(x-r*.3,y-r*.35,r*.1,x,y,r); g.addColorStop(0,'#ffe27a'); g.addColorStop(1,'#d99a00'); c.fillStyle=g; } else c.fillStyle='rgba(255,255,255,.06)'; c.fill(); c.strokeStyle=on?'rgba(0,0,0,.35)':'rgba(255,255,255,.14)'; c.lineWidth=1; c.stroke(); G.icon(on?icon:'lock',c,x,y,r*1.05,on?'#1a1406':'rgba(255,255,255,.35)'); }
/* a row of equal tiles; each tile draws itself and returns an action when tapped */
function tileRow(list,cols,h,drawTile){ return {h,focus:list.some(t=>t.act),draw(c,x,y,w){ const tw=(w-(cols-1)*6)/cols; list.forEach((t,i)=>{ const tx=x+i*(tw+6); drawTile(c,t,tx,y,tw,h-6); }); },tap(lx,ly,w){ const tw=(w-(cols-1)*6)/cols, i=Math.floor(lx/(tw+6)); return list[i]&&list[i].act||null; }}; }
const card=(c,x,y,w,h,col)=>{ G.rrect(x,y,w,h,10); c.fillStyle=C.card; c.fill(); c.strokeStyle=col||'rgba(255,255,255,.1)'; c.lineWidth=1; c.stroke(); };
G.scenes.logbook={
 enter(a){ this.back=a.back||G.homeScene(); this.list=CL.List(); this.pop=null; },
 area(){ return {x:4,y:122,w:VW-8,h:G.VH-126}; },
 items(){
  const I=[], W=G.WORLD, ws=G.save.mod.world||{}, v=ws.visited||{}, met=ws.met||{}, gsP=(G.save.mod.gs||{seen:{}});
  const badges=G.CFG.badges||[], got=badges.filter(b=>G.save.ach[b.id]).length, r=H.rank(G.save.points);
  // r7: the Flight Record (what I learned, what I did, what's next) grows out of this logbook
  I.push(CL.row('FLIGHT RECORD','WHAT I LEARNED • WHAT I DID • WHAT’S NEXT',{icon:'docs',act:{scene:'record',args:{}},h:44}));
  // the flight log: two books, never mixed
  if(H.flog){ const T=H.flog.totals();
   I.push(CL.hdr('MY FLIGHT LOG','TAP A BOOK'));
   I.push(tileRow([{k:'fl',act:{scene:'flightlog',args:{tab:'fl'}}},{k:'sim',act:{scene:'flightlog',args:{tab:'sim'}}}],2,64,(c,t,x,y,w,h)=>{ const sim=t.k==='sim', col=sim?SIMC:C.accentHi;
    card(c,x,y,w,h,G.rgba(col,.45)); G.txt(sim?'SIM SESSIONS':'FLIGHTS',x+10,y+8,5,col,'left',w-20,800);
    G.txt(String(sim?T.sim:T.flights),x+10,y+18,13,C.ink,'left',w-20,800);
    G.txt(sim?hhmm(T.simMin)+' SIM TIME • '+T.simLdg+' LDG':hhmm(T.min)+' TRAINING • '+T.ldg+' LDG',x+10,y+h-14,4.8,C.sub,'left',w-20,800);
    G.txt('›',x+w-12,y+18,12,col,'center',undefined,800); }));
   I.push(CL.text('Like a real logbook, sim time is practice in the trainer: it is kept in its own book and never counts as flight time.',{size:5.6,col:C.dim})); }
  if(H.AC){ const a=H.acById(H.myAC().id), un=H.AC.filter(m=>H.acUnlocked(m.id)).length;
   I.push(CL.row('MY AIRCRAFT',a.name+' • '+un+' OF '+H.AC.length+' UNLOCKED',{icon:'plane',act:{scene:'fleet'},h:44})); }
  if(H.HALL&&H.HALL.length){ const sp=H.HALL.filter(m=>H.isSpotted(m.id)).length; I.push(CL.row('HALL OF FLIGHT','NAME THEM IN PLANE SPOTTER',{icon:'search',act:{scene:'g_spot'},right:sp+' / '+H.HALL.length,rightCol:sp?C.accentHi:C.dim,h:44})); }
  // ground school
  if(H.totals){ const T=H.totals(), sk=H.fl().streak||{};
   I.push(CL.hdr('GROUND SCHOOL',T.done+' / '+T.lessons+' LESSONS'));
   I.push({h:Math.ceil(H.units.length/7)*40+8,draw(c,x,y,w){ const cw=w/7, done=(G.save.mod.gs||{}).done||{};
    H.units.forEach((u,i)=>{ const cx=x+cw*(i%7)+cw/2, cy=y+22+Math.floor(i/7)*40; H.drawPatch(c,cx,cy,15,u,!!done[u.id]); }); }});
   I.push(tileRow([{v:T.stars+' / '+T.maxStars,k:'STARS',ic:'star'},{v:T.patches+' / '+T.units,k:'UNIT PATCHES',ic:'medal'},{v:String(H.streak()),k:'FLIGHT DAYS • BEST '+(sk.best||0),ic:'cal'}],3,50,(c,t,x,y,w,h)=>{ card(c,x,y,w,h); G.icon(t.ic,c,x+13,y+14,10,C.accentText); G.txt(t.v,x+24,y+8,8.4,C.ink,'left',w-28,800); G.txt(t.k,x+w/2,y+h-13,4.4,C.dim,'center',w-8,800); }));
   I.push(CL.action('OPEN GROUND SCHOOL',{scene:'groundschool'},'ghost'));
  } else I.push(CL.hdr('GROUND SCHOOL',Object.keys(gsP.seen||{}).length+' / '+H.units.length+' OPENED'));
  // the academy phases (the six books)
  I.push(CL.hdr('ACADEMY PHASES','PHASE '+(r.phase+1)+' OF '+H.phases.length));
  H.phases.forEach((p,i)=>{ const done=i<r.phase, now=i===r.phase;
   I.push(CL.row((i+1)+'. '+p.n,now?'YOU ARE HERE • STEP '+r.stepN+' OF '+H.steps.length:(done?'COMPLETE':'STARTS AT '+p.xp+' XP'),
    {icon:done?'medal':(now?'plane':'lock'),col:done||now?C.ink:C.dim,right:done?'✓':(now?'NOW':''),rightCol:done?C.good:C.accentHi,h:44})); });
  // badges: a grid of medals; tap one for what it is
  I.push(CL.hdr('BADGES',got+' / '+badges.length));
  for(let i=0;i<badges.length;i+=4) I.push(tileRow(badges.slice(i,i+4).map(b=>({b,act:{badge:b.id}})),4,62,(c,t,x,y,w,h)=>{ const on=!!G.save.ach[t.b.id];
   medal(c,x+w/2,y+16,13,on,BADGE_ICON[t.b.id]||'medal'); const L=G.wrap(t.b.n,4.6,w-2,800).slice(0,2); L.forEach((l,k)=>G.txt(l,x+w/2,y+33+k*7,4.6,on?C.ink:C.dim,'center',w-2,800)); }));
  // places and crew: compact grids, tap to go there
  const rooms=Object.keys(W.rooms);
  I.push(CL.hdr('PLACES VISITED',rooms.filter(k=>v[k]).length+' / '+rooms.length));
  for(let i=0;i<rooms.length;i+=3) I.push(tileRow(rooms.slice(i,i+3).map(k=>({k,act:{room:k}})),3,46,(c,t,x,y,w,h)=>{ const R=W.rooms[t.k], on=!!v[t.k];
   card(c,x,y,w,h,on?null:'rgba(255,255,255,.06)'); G.icon((R.tab&&R.tab.icon)||(R.mapLabel?'pin':'pin'),c,x+13,y+h/2,11,on?C.accentText:C.faint);
   const L=G.wrap((R.mapLabel||R.name).replace(/^THE /,''),5,w-34,800).slice(0,2); L.forEach((l,k)=>G.txt(l,x+24,y+h/2-(L.length*7)/2+k*7,5,on?C.ink:C.dim,'left',w-34,800));
   if(on) G.icon('check',c,x+w-9,y+9,8,C.good); }));
  const crew=[]; for(const k of rooms) for(const n of W.rooms[k].npcs||[]) crew.push(Object.assign({room:k},n));
  I.push(CL.hdr('CREW MET',crew.filter(n=>met[n.id]).length+' / '+crew.length));
  for(let i=0;i<crew.length;i+=3) I.push(tileRow(crew.slice(i,i+3).map(n=>({n,act:{room:n.room}})),3,60,(c,t,x,y,w,h)=>{ const n=t.n, on=!!met[n.id];
   card(c,x,y,w,h,on?null:'rgba(255,255,255,.06)'); G.drawPortrait(c,x+w/2-13,y+5,26,n.av||{},on?C.accent:null); if(!on){ c.fillStyle='rgba(11,11,12,.55)'; c.beginPath(); c.arc(x+w/2,y+18,13,0,7); c.fill(); }
   G.txt(n.name,x+w/2,y+35,5,on?C.ink:C.dim,'center',w-6,800); G.txt(on?'MET':'IN THE '+(W.rooms[n.room].mapLabel||W.rooms[n.room].name).replace(/^THE /,''),x+w/2,y+44,4.2,on?C.good:C.faint,'center',w-6,800); }));
  return I;
 },
 update(){
  if(this.pop){ if(G.ptr.click||G.backHit()||G.pressed.b||G.pressed.a){ G.ptr.click=false; this.pop=null; AUDIO.sfx('back'); } return; }
  if(G.backHit()){ G.go(this.back); return; }
  this.list.update(this.items(),this.area(),a=>{ if(a.badge){ this.pop=(G.CFG.badges||[]).find(b=>b.id===a.badge); AUDIO.sfx('card'); } else if(a.room) G.go('world',{room:a.room}); else if(a.scene) G.go(a.scene,Object.assign({back:'logbook'},a.args||{})); });
 },
 draw(c){
  G.backdrop(.9);
  // the pilot card
  const xp=G.save.points, r=H.rank(xp);
  G.panel(10,48,VW-20,68,{r:14,border:G.rgba(C.accent,.5)});
  G.drawPortrait(c,20,57,50,G.playerAv(),C.accent);
  G.txt(G.who(),80,56,10,C.ink,'left',VW-170,800);
  G.txt(r.n+' • '+xp+' XP',80,74,6.4,C.accentHi,'left',VW-170,800);
  if(H.drawAC){ const a=H.myAC(); H.drawAC(c,a.id,VW-84,66,62,28,a.paint,{ground:false}); }
  G.txt('PHASE '+(r.phase+1)+' OF '+H.phases.length,VW-22,56,5,C.dim,'right',70,800);
  const bx=80, bw=VW-102, by=92, p=r.next?(xp-r.min)/(r.next-r.min):1;
  G.rrect(bx,by,bw,7,3.5); c.fillStyle='rgba(255,255,255,.1)'; c.fill();
  if(p>0){ G.rrect(bx,by,Math.max(7,bw*p),7,3.5); c.fillStyle=C.accent; c.fill(); }
  G.txt(r.next?(r.next-xp)+' XP TO '+r.nextN:'TOP OF THE ACADEMY!',bx,by+10,5,C.dim,'left',bw,700);
  this.list.draw(c,this.items(),this.area());
  if(this.pop){ const b=this.pop, on=!!G.save.ach[b.id], VH=G.VH, h=150, y=(VH-h)/2; G.dim(.6); G.panel(24,y,VW-48,h,{r:16,border:G.rgba(on?C.accent:'#ffffff',.5)});
   medal(c,VW/2,y+34,20,on,BADGE_ICON[b.id]||'medal'); G.txt(b.n,VW/2,y+62,9,on?C.title:C.ink,'center',VW-70,800); G.para(b.d||'',VW/2,y+80,6.2,C.sub,'center',VW-80,9,700);
   G.txt(on?'EARNED '+fmtDay(G.save.ach[b.id]):'NOT EARNED YET',VW/2,y+h-30,5.6,on?C.good:C.dim,'center',undefined,800); G.txt('TAP TO CLOSE',VW/2,y+h-16,4.8,C.accentText,'center',undefined,800); }
  G.topBar('MY LOGBOOK',{sub:got(G)+' BADGES • '+(H.flog?H.flog.totals().flights:0)+' FLIGHTS'});
 }
};
function got(G){ return (G.CFG.badges||[]).filter(b=>G.save.ach[b.id]).length; }
G.cardSub.logbook=()=>{ const n=got(G), N=(G.CFG.badges||[]).length; return n+' / '+N+' BADGES'; };

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
