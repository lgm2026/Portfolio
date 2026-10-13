/* Hall of Fame (scores/badges/stats) and settings. Portrait. (The ride log is in ridelog.js.) */
(function(){
const VW=G.VW;
function today(){ const d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }

/* ============================ HALL OF FAME ============================ */
/* tabs: BATTALION board, RKFFMC NATIONWIDE board (shared), BADGES, STATS (personal) */
function secItem(t,right){ return {h:24,draw:(c,x,y,w)=>{ G.txt(t,x+4,y+9,6.8,'#ff9a50','left',w-60,800); if(right) G.txt(right,x+w-4,y+9,6,'#9a8f80','right',undefined,700); }}; }
function noteItem(lines,col){ const h=lines.length*13+14; return {h:h+6,draw:(c,x,y,w)=>{ G.rrect(x,y,w,h,10); c.fillStyle='rgba(255,255,255,.05)'; c.fill(); c.strokeStyle='rgba(255,255,255,.1)'; c.lineWidth=1; c.stroke(); lines.forEach((l,i)=>G.txt(l,x+w/2,y+8+i*13,6.5,col||'#cfc4b0','center',w-16,700)); }}; }
function rowItem(rank,name,sub,val,me,ver){
 return {h:38,draw:(c,x,y,w)=>{
  G.rrect(x,y,w,34,10); c.fillStyle=me?'rgba(240,120,24,.16)':'rgba(30,28,40,.92)'; c.fill();
  if(me){ c.strokeStyle='rgba(255,150,60,.5)'; c.lineWidth=1; c.stroke(); }
  const medal=['#ffd060','#d8dce4','#d89060'][rank-1];
  c.beginPath(); c.arc(x+18,y+17,10,0,7); c.fillStyle=medal||'rgba(255,255,255,.1)'; c.fill();
  G.txt(String(rank),x+18,y+11.5,7.5,medal?'#16100a':'#cfc4b0','center',undefined,800);
  G.txt(name+(ver?' ✓':''),x+36,y+(sub?6:11.5),8,me?'#ffd060':'#f4ede2','left',w-120,800);
  if(sub) G.txt(sub,x+36,y+21,5.8,'#9a8f80','left',w-120,700);
  G.txt(val,x+w-10,y+11.5,8,'#ffd060','right',undefined,800);
 }};
}
function cardItem(title,sub,stats){
 return {h:84,draw:(c,x,y,w)=>{
  G.rrect(x,y,w,78,12); const g=c.createLinearGradient(0,y,0,y+78); g.addColorStop(0,'rgba(240,120,24,.22)'); g.addColorStop(1,'rgba(240,120,24,.06)');
  c.fillStyle=g; c.fill(); c.strokeStyle='rgba(255,150,60,.5)'; c.lineWidth=1; c.stroke();
  c.drawImage(G.img.crest_sm,x+10,y+10,26,28);
  G.txt(title,x+44,y+10,9,'#ffd060','left',w-54,800);
  G.txt(sub,x+44,y+27,6,'#cfc4b0','left',w-54,700);
  const cw=(w-20)/stats.length;
  stats.forEach((s,i)=>{ G.txt(s[1],x+10+cw*i+cw/2,y+46,10,'#f4ede2','center',cw-4,800); G.txt(s[0],x+10+cw*i+cw/2,y+62,5.6,'#9a8f80','center',cw-4,700); });
 }};
}
function localBoard(items){
 const b=G.save.board.slice(0,10);
 if(!b.length) items.push(noteItem(['NO RIDERS ON THIS DEVICE YET.','GO EARN SOME POINTS!']));
 b.forEach((e,i)=>{ const acct=G.roster&&G.roster.accounts.find(a=>a.roadName===e.name); items.push(rowItem(i+1,e.name,null,e.score.toLocaleString(),e.name===G.save.roadName,!!(acct&&G.club&&G.club.approved(acct.id,acct.created)))); });
}
G.scenes.scores={
 enter(a){
  this.back=(a&&a.back)||(G.save.roadName?'club':'title');
  const C=G.club, sup=G.activeAcct&&G.activeAcct.type==='sup';
  this.tab=G.clubAccess().ok?0:(C&&C.viewOk()?(sup?1:0):2); this.sc={scroll:0};
 },
 L(){
  const VH=G.VH, bh=Math.round(62+Math.max(0,VH-480)*.3);
  const tabY=48+bh+8, listY=tabY+38;
  return {bh,tabY,listY,area:{x:8,y:listY,w:254,h:VH-listY-8}};
 },
 items(){
  const C=G.club, live=C&&C.state==='live', it=[], a=G.activeAcct, mo=C?C.monthKey():'';
  const offNote=()=>noteItem([C&&C.state==='connecting'?'CONNECTING TO THE CLUB BOARD…':'OFFLINE • SHOWING THIS DEVICE ONLY'],'#ffd27a');
  // battalion + nationwide boards: approved members, supporters and the waitlist (read-only); ✓ marks only for members
  const mem=G.clubAccess().ok, ok=mem||(C&&C.viewOk()), sup=a&&a.type==='sup';
  if((this.tab===0||this.tab===1)&&!ok){
   const inf=G.lockInfo('view')||G.lockInfo();
   it.push(noteItem([inf.title].concat(inf.lines),inf.col));
   it.push(secItem('THIS DEVICE')); localBoard(it); return it;
  }
  if(this.tab===0){
   if(!a){ it.push(noteItem(['BATTALION BOARDS ARE FOR MEMBERS.','CREATE AN ACCOUNT OR LOG IN TO JOIN YOURS.'],'#ffd27a')); it.push(secItem('THIS DEVICE')); localBoard(it); return it; }
   if(sup){ it.push(noteItem(['SUPPORTERS AREN’T ON A BATTALION BOARD.','THE NATIONAL BOARD SHOWS EVERY BATTALION.'],'#ff9ad0')); it.push(secItem('THIS DEVICE')); localBoard(it); return it; }
   const bk=C.battKey(a.battalion);
   if(!live){ it.push(offNote()); localBoard(it); return it; }
   let rows=C.rowsFor(bk);
   if(!rows.some(r=>r.id===a.id)) rows=rows.concat([Object.assign({id:a.id},C.docFor(a,G.save))]).sort((x,y)=>y.p-x.p);
   const pts=rows.reduce((s,r)=>s+(r.p||0),0), mm=rows.reduce((s,r)=>s+(r.mo===mo?(r.mm||0):0),0);
   it.push(cardItem(G.bl(a.battalion)||'MY BATTALION','RAGING KNIGHTS FFMC',[['RIDERS',String(rows.length)],['POINTS',pts.toLocaleString()],['REAL MI (MONTH)',mm.toLocaleString()]]));
   it.push(secItem('RIDERS','POINTS'));
   rows.forEach((r,i)=>it.push(rowItem(i+1,r.n,(r.mo===mo&&r.mm?r.mm.toLocaleString()+' REAL MI THIS MONTH':null),(r.p||0).toLocaleString(),r.id===a.id,mem&&C.approved(r.id))));
   return it;
  }
  if(this.tab===1){
   if(!live){ it.push(offNote()); localBoard(it); return it; }
   const B=C.battalions(), riders=C.boardRows();
   const pts=B.reduce((s,b)=>s+b.p,0), mm=B.reduce((s,b)=>s+b.mm,0);
   it.push(cardItem('RKFFMC NATIONWIDE',B.length+' BATTALION'+(B.length===1?'':'S')+' ON THE BOARD',[['RIDERS',String(riders.length)],['POINTS',pts.toLocaleString()],['REAL MI (MONTH)',mm.toLocaleString()]]));
   if(!riders.length) it.push(noteItem(['NO MEMBERS ON THE BOARD YET.','PLAY A GAME TO POST YOUR POINTS.']));
   if(B.length){ it.push(secItem('BATTALION STANDINGS','POINTS')); B.forEach((b,i)=>it.push(rowItem(i+1,G.bn(b.name||b.bk),b.members+' RIDER'+(b.members===1?'':'S')+(b.mm?' • '+b.mm.toLocaleString()+' REAL MI THIS MONTH':''),b.p.toLocaleString(),a&&b.bk===C.battKey(a.battalion),false))); }
   if(riders.length){ it.push(secItem('TOP RIDERS','POINTS')); riders.slice(0,15).forEach((r,i)=>it.push(rowItem(i+1,r.n,r.b?G.bn(r.b):null,(r.p||0).toLocaleString(),a&&r.id===a.id,mem&&C.approved(r.id)))); }
   it.push(noteItem(mem?['✓ = APPROVED MEMBER','POINTS ARE BRAGGING RIGHTS, NEVER MONEY']:['THE CLUB’S MEMBERS, BATTALION BY BATTALION','POINTS ARE BRAGGING RIGHTS, NEVER MONEY']));
   return it;
  }
  if(this.tab===2){
   const got=Object.keys(G.save.ach).length;
   it.push(secItem('BADGES',got+' / '+DATA.ACH.length));
   DATA.ACH.forEach(b=>{ const on=!!G.save.ach[b.id]; it.push({h:44,draw:(c,x,y,w)=>{
    G.rrect(x,y,w,40,10); c.fillStyle=on?'rgba(240,120,24,.12)':'rgba(30,28,40,.9)'; c.fill();
    c.beginPath(); c.arc(x+20,y+20,13,0,7); c.fillStyle=on?'#f08a2a':'#2c2a36'; c.fill();
    G.icon(on?'star':'lock',c,x+20,y+20,on?15:12,on?'#16100a':'#6f6878');
    G.txt(b.n,x+42,y+7,7.5,on?'#ffd060':'#a09aa8','left',w-50,800);
    G.txt(b.d,x+42,y+22,6.2,on?'#e0d4c0':'#77707e','left',w-50);
   }}); });
   return it;
  }
  const s=G.save, realMi=s.mileage.reduce((t,m)=>t+m.miles,0), b=s.best;
  const routes=DATA.ROUTE_ORDER.filter(k=>(s.plays[k]||0)>0).length;
  const R=[
   ['LIFETIME POINTS',s.points.toLocaleString()],['STORY PROGRESS',Math.min(s.story,8)+'/8'],['ROUTES FINISHED',routes+'/'+DATA.ROUTE_ORDER.length],
   ['BEST: 501 TRAFFIC',b.r501||0],['BEST: TAIL OF THE DRAGON',b.dragon||0],['BEST: POKER RUN',b.poker||0],
   ['BEST: CORNHOLE',b.cornhole||0],['BEST: TRIVIA',b.trivia||0],['BEST: CHILI (/99)',b.chili||0],['BEST: GARAGE ROUND',b.garage||0],
   ['BEST: PATCH MATCH',b.match3||0],['BEST: BURNOUT BREAKER',b.breaker||0],['BEST: BOULEVARD',b.frogger||0],['BEST: ENDLESS RIDE',b.runner||0],
   ['BIGGEST SLOTS WIN',b.slots||0],['MILES LOGGED',realMi.toLocaleString()]
  ];
  it.push(secItem('MY STATS',G.save.roadName||'GUEST'));
  R.forEach((r,i)=>it.push({h:28,draw:(c,x,y,w)=>{
   if(i%2===0){ G.rrect(x,y,w,26,8); c.fillStyle='rgba(255,255,255,.04)'; c.fill(); }
   G.txt(r[0],x+10,y+8,6.8,'#cfc4b0','left',170,700);
   G.txt(String(typeof r[1]==='number'?r[1].toLocaleString():r[1]),x+w-10,y+7.5,7.5,'#ffd060','right',undefined,800);
  }}));
  return it;
 },
 update(){
  if(G.backHit()){ G.go(this.back); return; }
  const L=this.L();
  const t=G.segHit(8,L.tabY,254,30,4);
  if(t>=0&&t!==this.tab){ this.tab=t; this.sc.scroll=0; AUDIO.sfx('blip'); }
  if(G.pressed.left){ this.tab=(this.tab+3)%4; this.sc.scroll=0; AUDIO.sfx('blip'); }
  if(G.pressed.right){ this.tab=(this.tab+1)%4; this.sc.scroll=0; AUDIO.sfx('blip'); }
  const h=this.items().reduce((s,i)=>s+i.h,0);
  G.scroll(this.sc,L.area,h+6);
 },
 draw(c){
  const VH=G.VH, L=this.L();
  G.cover(G.img.bg_dining,0,0,VW,VH); G.dim(.86);
  c.save(); G.rrect(8,48,VW-16,L.bh,12); c.clip();
  G.cover(G.img.photo_club,8,48,VW-16,L.bh,.4);
  const g=c.createLinearGradient(0,48,0,48+L.bh); g.addColorStop(0,'rgba(0,0,0,.05)'); g.addColorStop(1,'rgba(0,0,0,.78)');
  c.fillStyle=g; c.fillRect(8,48,VW-16,L.bh);
  c.restore();
  c.drawImage(G.img.crest_sm,16,48+L.bh-38,28,30);
  c.drawImage(G.img.ladies,VW-46,48+L.bh-38,30,30);
  G.txtO(G.save.roadName||'GUEST',VW/2,48+L.bh-34,10,'#ffd060','center',150);
  G.txt(G.save.points.toLocaleString()+' LIFETIME PTS',VW/2,48+L.bh-15,6.6,'#f4ede2','center',150,700);
  G.seg(8,L.tabY,254,30,['BATTALION','NATIONAL','BADGES','STATS'],this.tab,6.4);
  const A=L.area, items=this.items();
  c.save(); c.beginPath(); c.rect(0,A.y,VW,A.h); c.clip();
  let y=A.y-this.sc.scroll;
  for(const it of items){ if(y+it.h>=A.y&&y<=A.y+A.h) it.draw(c,A.x,y,A.w); y+=it.h; }
  c.restore();
  G.scrollBar(A,items.reduce((s,i)=>s+i.h,0)+6,this.sc.scroll);
  G.topBar('HALL OF FAME');
 }
};

/* the RIDE LOG (G.scenes.mileage) lives in ridelog.js */

/* ============================ SETTINGS ============================ */
let settingsBack='title';
G.scenes.settings={
 enter(a){ if(a&&a.back) settingsBack=a.back; this.st={f:0}; this.m=null; this.busy=false; this.prk=''; },
 rows(){
  const R=[]; let y=62;
  R.push({id:'tone',y,h:30}); y+=48;
  R.push({id:'mode',y,h:30}); y+=42;
  R.push({id:'rider',y,h:48}); y+=54;
  if(G.activeAcct&&G.activeAcct.type!=='sup'){ R.push({id:'photo',y,h:44}); y+=50; }
  if(G.club&&G.club.isAdminish()){ R.push({id:'console',y,h:40}); y+=48; }
  for(const id of ['music','sfx','rm']){ R.push({id,y,h:28}); y+=32; }
  y+=6;
  if(G.activeAcct){ R.push({id:'wipe',y,h:34,w:120}); R.push({id:'logout',y,h:34,x:138,w:120}); }
  else R.push({id:'wipe',y,h:34});
  return R.map(r=>Object.assign({x:12,w:246},r));
 },
 /* the headshot row is a real file picker laid over the canvas (camera or photo library) */
 placePhoto(R){
  const r=R.find(q=>q.id==='photo'); if(!r) return;
  const k=r.y+','+G.VH; if(k===this.prk&&G.fields.photo) return; this.prk=k;
  G.fileField('photo',{x:r.x,y:r.y,w:r.w,h:r.h,accept:'image/*',onFile:f=>this.onPhoto(f)});
 },
 onPhoto(file){
  this.busy=true;
  G.photoFromFile(file,192).then(src=>{
   this.busy=false; const a=G.activeAcct; if(!a) return;
   a.photo=src; a.photoAt=Date.now(); G.saveRoster();
   if(G.club) G.club.pushRoster(a,true);
   G.toast('HEADSHOT UPDATED','#80ffa0'); AUDIO.sfx('cheer');
  }).catch(()=>{ this.busy=false; G.toast('THAT PHOTO COULDN’T BE OPENED - TRY A JPG OR PNG','#ff7a60'); AUDIO.sfx('buzzer'); });
 },
 setMode(m){
  if(G.save.mode===m) return;
  G.save.mode=m; G.persist(); AUDIO.sfx('ok');
  if(G.activeAcct){ G.activeAcct.mode=m; G.saveRoster(); }
  G.toast(m==='info'?'INFORMATIONAL: NEWS, EVENTS, CHAT + GAMES':'INTERACTIVE: WALK THE CLUBHOUSE + STORY','#80ffa0');
 },
 update(){
  const s=G.save.settings;
  if(this.m){
   const r=this.m.update();
   if(r==='stay'||(r==null&&G.pressed.b)){ this.m=null; G.hideFields(false); return; }
   if(r==='leave'){ G.toast('LOGGED OUT - RIDE SAFE','#80e0ff'); G.go('title'); }
   return;
  }
  if(G.backHit()){ G.persist(); G.go(settingsBack); return; }
  const R=this.rows(), st=this.st, n=R.length;
  this.placePhoto(R);
  if(G.pressed.up){ st.f=(st.f+n-1)%n; AUDIO.sfx('blip'); }
  if(G.pressed.down){ st.f=(st.f+1)%n; AUDIO.sfx('blip'); }
  const t=G.segHit(R[0].x,R[0].y,R[0].w,R[0].h,2);
  if(t>=0){ st.f=0; G.save.tone=t?'family':'garage'; G.persist(); AUDIO.sfx('ok'); return; }
  const m=G.segHit(R[1].x,R[1].y,R[1].w,R[1].h,2);
  if(m>=0){ st.f=1; this.setMode(m?'info':'play'); return; }
  let act=null;
  for(let i=2;i<n;i++){ const r=R[i]; if(r.id!=='photo'&&G.clicked(r.x,r.y,r.w,r.h)){ st.f=i; act=r.id; } }
  const cur=R[st.f].id;
  if(!act&&(G.pressed.a||((G.pressed.left||G.pressed.right)&&['tone','mode','music','sfx','rm'].indexOf(cur)>=0))) act=cur;
  if(!act) return;
  switch(act){
   case 'tone': G.save.tone=G.save.tone==='family'?'garage':'family'; AUDIO.sfx('ok'); break;
   case 'mode': this.setMode(G.isInfo()?'play':'info'); return;
   case 'rider': G.persist(); AUDIO.sfx('ok'); G.go('builder',{back:'settings'}); return;
   case 'photo': { const f=G.fields.photo; if(f&&!this.busy) try{ f.el.click(); }catch(e){} return; }
   case 'console': G.persist(); AUDIO.sfx('ok'); G.go('console',{back:'settings'}); return;
   case 'music': s.music=!s.music; AUDIO.setMusic(s.music); AUDIO.sfx('ok'); break;
   case 'sfx': s.sfx=!s.sfx; AUDIO.setSfx(s.sfx); AUDIO.sfx('ok'); break;
   case 'rm': s.rm=!s.rm; AUDIO.sfx('ok'); break;
   case 'wipe': G.persist(); AUDIO.sfx('ok'); G.go('confirmReset',{back:'settings'}); return;
   case 'logout': AUDIO.sfx('ok'); G.hideFields(true); this.m=G.Modal({title:'LOG OUT?',lines:[['YOU’LL NEED YOUR PIN','#cfc4b0',7.5],['TO GET BACK IN.','#cfc4b0',7.5]],btns:[{id:'stay',label:'STAY',kind:'primary'},{id:'leave',label:'LOG OUT',kind:'danger'}]}); return;
  }
  G.persist();
 },
 draw(c){
  const VH=G.VH, s=G.save.settings, R=this.rows(), st=this.st, by={};
  R.forEach((r,i)=>{ by[r.id]=r; r.i=i; });
  G.cover(G.img.bg_charity,0,0,VW,VH); G.dim(.86);
  G.topBar('SETTINGS');
  const ring=r=>{ if(st.f===r.i&&G.kbMode){ G.rrect(r.x-3,r.y-3,r.w+6,r.h+6,14); c.strokeStyle='#ffd060'; c.lineWidth=2; c.stroke(); } };
  const card=r=>{ const press=G.held(r.x,r.y,r.w,r.h); G.rrect(r.x,r.y+(press?1:0),r.w,r.h,12); c.fillStyle=press?'rgba(60,52,72,.95)':'rgba(30,28,40,.95)'; c.fill(); c.strokeStyle='rgba(255,255,255,.12)'; c.lineWidth=1; c.stroke(); };
  { const r=by.tone; G.txt('CLUBHOUSE TONE',14,r.y-13,6.5,'#b8ad9c','left',undefined,700);
    G.seg(r.x,r.y,r.w,r.h,['GARAGE TALK','FAMILY NIGHT'],G.save.tone==='family'?1:0,7.5); ring(r); }
  { const r=by.mode; G.txt('CLUBHOUSE MODE',14,r.y-13,6.5,'#b8ad9c','left',undefined,700);
    G.txt(G.isInfo()?'NO STORY • STRAIGHT TO THE CLUB':'WALK AROUND • STORY MODE',258,r.y-13,5.8,'#8a7f70','right',150,700);
    G.seg(r.x,r.y,r.w,r.h,['INTERACTIVE','INFORMATIONAL'],G.isInfo()?1:0,7.5); ring(r); }
  { const r=by.rider; card(r);
    AV.draw(c,r.x+8,r.y+3,.86,G.save.avatar);
    G.txt('RIDER & BIKE',r.x+86,r.y+9,8.5,'#f4ede2','left',undefined,800);
    G.txt('STYLE, PAINT, RIDER, GEAR',r.x+86,r.y+27,6.2,'#9a8f80','left',120);
    G.txt('EDIT ›',r.x+r.w-12,r.y+17,7.5,'#ffb060','right',undefined,800); ring(r); }
  if(by.photo){ const r=by.photo, a=G.activeAcct; card(r);
    if(a.photo) G.drawFace(a.photo,r.x+10,r.y+4,36,a.roadName,'#f08a2a');
    else { c.beginPath(); c.arc(r.x+28,r.y+22,18,0,7); c.fillStyle='rgba(255,255,255,.06)'; c.fill(); c.save(); c.setLineDash([4,3]); c.strokeStyle='rgba(255,160,80,.7)'; c.lineWidth=1.2; c.stroke(); c.restore(); G.icon('user',c,r.x+28,r.y+23,18,'rgba(255,176,96,.6)'); }
    G.txt('HEADSHOT',r.x+56,r.y+9,8.5,'#f4ede2','left',undefined,800);
    G.txt(this.busy?'PROCESSING…':(a.photo?'SHOWN ON THE ALPHA ROSTER':'ADD ONE FOR THE ALPHA ROSTER'),r.x+56,r.y+27,6.2,a.photo?'#9a8f80':'#ffd27a','left',128,700);
    G.txt(a.photo?'CHANGE ›':'ADD ›',r.x+r.w-12,r.y+17,7.5,'#ffb060','right',undefined,800); ring(r); }
  if(by.console){ const r=by.console, C=G.club, n=C.myPending().length; card(r);
    G.icon('roster',c,r.x+24,r.y+20,18,'#ffb060');
    G.txt('ADMIN CONSOLE',r.x+46,r.y+8,8.5,'#f4ede2','left',undefined,800);
    G.txt(C.roleLabel()+(n?' \u2022 '+n+' WAITING':''),r.x+46,r.y+24,6.2,n?'#80e0ff':'#9a8f80','left',150,700);
    G.txt('OPEN \u203A',r.x+r.w-12,r.y+14,7.5,'#ffb060','right',undefined,800); ring(r); }
  [['music','MUSIC',s.music],['sfx','SOUND EFFECTS',s.sfx],['rm','REDUCED MOTION',s.rm]].forEach(t=>{
   const r=by[t[0]];
   G.txt(t[1],r.x+4,r.y+r.h/2-5.5,8,'#e8dcc8','left',undefined,700);
   G.toggleDraw(r.x+r.w-42,r.y+(r.h-22)/2,t[2]);
   c.fillStyle='rgba(255,255,255,.07)'; c.fillRect(r.x,r.y+r.h+2,r.w,1);
   ring(r);
  });
  G.button({x:by.wipe.x,y:by.wipe.y,w:by.wipe.w,h:by.wipe.h,label:by.logout?'WIPE SAVE':'WIPE THIS SAVE',kind:'danger',size:by.logout?7.4:8},st.f===by.wipe.i);
  if(by.logout) G.button({x:by.logout.x,y:by.logout.y,w:by.logout.w,h:by.logout.h,label:'LOG OUT',kind:'ghost',size:7.4},st.f===by.logout.i);
  G.txt('POINTS ARE NEVER MONEY',VW/2,VH-20,5.6,'#7f7668','center',VW-16);
  if(this.m) this.m.draw(c);
 }
};
})();
