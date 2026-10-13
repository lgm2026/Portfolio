/* INFORMATIONAL clubhouse (picked at sign-up, switchable in Settings): the club at a glance, with no walk-around room
   and no story. What's NEXT on the horizon, anything waiting on you, then big cards. Members-only cards (chat, roster,
   officers, admin office) are hidden for supporters and show a lock for guests and the waitlist. The PHOTO ALBUM card
   shows the newest photos; a supporter sees it grayed with REQUEST PERMISSION until two club officers let them in.
   Plus the GAMES list (with the Hall of Fame) that replaces the room. */
(function(){
const VW=G.VW;
const CARDS=[
 {id:'news',label:'ANNOUNCEMENTS',icon:'megaphone'},
 {id:'horizon',label:'ON THE HORIZON',icon:'cal'},
 {id:'chat',label:'CLUB CHAT',icon:'chat',mem:true},
 {id:'roster',label:'ALPHA ROSTER',icon:'roster',mem:true},
 {id:'officers',label:'OFFICERS',icon:'offchat',mem:true},
 {id:'positions',label:'POSITIONS',icon:'chevrons'},
 {id:'b4l',label:'BROTHERS FOR LIFE',icon:'medal'},
 {id:'pay',label:'PAYMENTS',icon:'wallet'},
 {id:'shop',label:'RKFFMC SHOP',icon:'bag'},
 {id:'office',label:'ADMIN OFFICE',icon:'docs',mem:true},
 {id:'games',label:'GAMES',icon:'joy'},
 {id:'mileage',label:'RIDE LOG',icon:'gauge'},
 {id:'photos',label:'PHOTO ALBUM',icon:'cam'}
];
const isSup=()=>!!(G.activeAcct&&G.activeAcct.type==='sup');
G.scenes.dash={
 enter(){ this.st={f:0}; this.exitM=null; this.recent=[]; this.subOn=false; if(AUDIO.curName!==G.bgm()) AUDIO.play(G.bgm()); G.updateBoard(); this.sync(); },
 exit(){ this.unsubRecent(); },
 /* the newest few photos for the PHOTO ALBUM card (only for members and supporters with access) */
 sync(){
  const C=G.club, want=!!C.db&&C.canViewPhotos();
  if(want===this.subOn) return;
  this.unsubRecent(); this.subOn=want; if(!want) return;
  const gen=this.gen;
  this.unsub=C.db.collection('pho').orderBy('at','desc').limit(3).onSnapshot(s=>{ if(gen===this.gen) this.recent=C.phoDocs(s); },()=>{});
 },
 unsubRecent(){ this.gen=(this.gen||0)+1; if(this.unsub){ try{ this.unsub(); }catch(e){} this.unsub=null; } this.subOn=false; this.recent=[]; },
 cards(){ return CARDS.filter(c=>!(isSup()&&c.mem)); },
 layout(){
  const VH=G.VH, CS=G.scenes.club, call=CS.clubCall(), wc=CS.waitChip({roomY:40});
  let y=46; const bannerY=y;
  if(call) y+=30; else if(wc) y+=wc.h+8;
  const nextY=y, nextH=58; y+=nextH+8;
  // a lone card on the last row spans the full width (the PHOTO ALBUM, with the newest photos)
  const list=this.cards(), cols=list.length<=6?2:3, gap=7, wide=cols===3&&list.length%3===1, rows=Math.ceil((list.length-(wide?1:0))/cols);
  const A=VH-8-y, wideH=wide?Math.round(Math.max(46,Math.min(64,A*.15))):0;
  const ch=Math.min(cols===2?104:96,(A-(wide?wideH+gap:0)-gap*(rows-1))/rows), cw=(VW-16-gap*(cols-1))/cols;
  const R=list.map((c,i)=>wide&&i===list.length-1?Object.assign({},c,{x:8,y:y+rows*(ch+gap),w:VW-16,h:wideH,wide:true})
   :Object.assign({},c,{x:8+(i%cols)*(cw+gap),y:y+Math.floor(i/cols)*(ch+gap),w:cw,h:ch}));
  return {call,wc,bannerY,nextY,nextH,R};
 },
 label(c){ return c.id==='pay'&&!G.clubAccess().ok?'DONATE':c.label; },
 /* a supporter's way into the album: what to do next, said loud enough to notice */
 photoAsk(){
  const p=G.club.photoAccess();
  return {none:{t:'REQUEST PERMISSION',col:'#ff9ad0'},denied:{t:'ASK AGAIN',col:'#ff9ad0'},asked:{t:'REQUESTED',col:'#ffd27a'},motion:{t:'1 OF 2 APPROVED',col:'#ffd27a'}}[p]||null;
 },
 sub(c){
  const C=G.club, ok=G.clubAccess().ok;
  if(c.id==='photos'){
   const p=C.photoAccess();
   if(p==='member'||p==='granted'){ const n=this.recent.length; return n?'NEWEST: '+G.fmtDay(this.recent[0].d):'RIDE PHOTOS + PHOTO DUMPS'; }
   if(p==='locked') return G.activeAcct?'AFTER APPROVAL':'WITH AN ACCOUNT';
   return 'OFFICERS GRANT ACCESS';
  }
  if(!ok&&this.locked(c)) return G.activeAcct?'AFTER APPROVAL':(c.mem?'MEMBERS ONLY':'WITH AN ACCOUNT');
  switch(c.id){
   case 'news': { const n=C.annUnread().length; return n?n+' NEW':(ok?'CLUB NEWS':'PUBLIC NEWS'); }
   case 'horizon': { const u=G.horizon.upcoming(1)[0]; return u?'NEXT: '+G.horizon.fmtDate(u.o):'CALENDAR'; }
   case 'chat': return 'BATTALION + NATIONWIDE';
   case 'roster': { const n=C.people().filter(g=>g.st==='approved').length; return n?n+' MEMBERS':'MEMBERS'; }
   case 'officers': return C.isOfficerish()?'LEADERSHIP CHANNEL':'OFFICERS ONLY';
   case 'positions': return 'WHO HOLDS WHAT';
   case 'b4l': { const n=C.b4l.length; return n?n+(n===1?' BROTHER':' BROTHERS'):'THE HONOR ROLL'; }
   case 'pay': return ok?'DUES + EVENTS':'SUPPORT THE CLUB';
   case 'shop': return C.link('shop')?'CLUB GEAR':'COMING SOON';
   case 'office': return 'CLUB INFO + DOCS';
   case 'games': return 'RIDES • PICNIC • FAME';
   case 'mileage': { const q=C.viewOk()?C.closeRequests().length:0; return q?q+(q===1?' WANTS':' WANT')+' TO GET IN CLOSE':'LOG RIDES • WE’RE CLOSE'; }
  }
  return '';
 },
 badge(c){
  const C=G.club;
  if(c.id==='officers') return G.clubAccess().ok&&C.offUnread()?-1:0;
  return G.tileBadge(c.id);
 },
 locked(c){ return G.tileLocked(c.id); },
 open(id){
  AUDIO.sfx('ok');
  if(id==='mileage') G.go('mileage',{back:'club'});
  else G.scenes.club.doTile(id);
 },
 update(dt){
  if(this.exitM){
   const r=this.exitM.update();
   if(r==='stay'||(r==null&&G.pressed.b)){ this.exitM=null; return; }
   if(r==='leave'){ G.toast('LOGGED OUT - RIDE SAFE','#80e0ff'); G.go('title'); }
   return;
  }
  if(G.backHit()){
   if(G.activeAcct) this.exitM=G.Modal({title:'LEAVE THE CLUBHOUSE?',lines:[['YOU WILL NEED YOUR PIN','#cfc4b0',7.5],['TO GET BACK IN.','#cfc4b0',7.5]],btns:[{id:'stay',label:'STAY',kind:'primary'},{id:'leave',label:'LOG OUT',kind:'danger'}]});
   else G.go('title');
   return;
  }
  if(G.gearHit()){ G.go('settings',{back:'club'}); return; }
  this.sync();
  const L=this.layout();
  if(L.call&&G.clicked(6,L.bannerY,VW-12,24)){ AUDIO.sfx('ok'); G.go(L.call.go,Object.assign({back:'club'},L.call.args||{})); return; }
  if(!L.call&&L.wc&&G.clicked(L.wc.x,L.wc.y,L.wc.w,L.wc.h)){ AUDIO.sfx('ok'); G.go('waitlist',{back:'club'}); return; }
  if(G.clicked(8,L.nextY,VW-16,L.nextH)){ AUDIO.sfx('ok'); G.go('horizon'); return; }
  const id=G.navList(this.st,L.R,{both:true});
  if(id) this.open(id);
 },
 /* REQUEST PERMISSION: a bright pill on a grayed card */
 askPill(c,cx,y,ask,maxw){
  const size=5.8, w=Math.min(maxw,G.tw(ask.t,size,800)+14), h=13;
  G.rrect(cx-w/2,y,w,h,6.5); c.fillStyle=ask.col==='#ff9ad0'?'rgba(255,154,208,.2)':'rgba(255,210,122,.16)'; c.fill(); c.strokeStyle=ask.col; c.lineWidth=1; c.stroke();
  G.txt(ask.t,cx,y+2.6,size,ask.col,'center',w-6,800);
 },
 /* the full-width PHOTO ALBUM card: icon + words on the left, the newest photos on the right */
 drawWide(c,r,y,lk,ask,lab){
  const R=Math.min(17,r.h*.31), cx=r.x+12+R, cy=y+r.h/2;
  c.beginPath(); c.arc(cx,cy,R,0,7); c.fillStyle=lk?'rgba(255,255,255,.05)':'rgba(240,120,24,.13)'; c.fill();
  G.icon(r.icon,c,cx,cy,R*1.1,lk?'#7a7066':'#ffb060');
  const tx=cx+R+10, s=r.h-14, n=lk?0:this.recent.length, tw=n?n*(s+4):0, room=r.w-(tx-r.x)-tw-10;
  G.txt(lab,tx,cy-11,8,lk?'#9a8f80':'#f0e6d6','left',room,800);
  if(ask) this.askPill(c,tx+Math.min(room,G.tw(ask.t,5.8,800)+14)/2,cy+2,ask,room);
  else G.txt(this.sub(r),tx,cy+3,5.8,lk?'#6f665c':'#a89c8a','left',room,700);
  for(let i=0;i<n;i++){
   const m=this.recent[i], x=r.x+r.w-8-(n-i)*(s+4)+4, im=G.phThumbImg(m.id);
   c.save(); G.rrect(x,y+7,s,s,7); c.clip(); c.fillStyle='#1c1a24'; c.fillRect(x,y+7,s,s); if(im) G.cover(im,x,y+7,s,s); else G.icon('cam',c,x+s/2,y+7+s/2,s*.34,'rgba(255,255,255,.18)'); c.restore();
   G.rrect(x,y+7,s,s,7); c.strokeStyle='rgba(255,255,255,.16)'; c.lineWidth=1; c.stroke();
  }
 },
 draw(c){
  const VH=G.VH, C=G.club, L=this.layout();
  G.cover(G.img.bg_dining,0,0,VW,VH); G.dim(.86);
  // anything waiting on this member
  if(L.call){
   c.save(); if(!G.rm()){ c.shadowColor='#60d0ff'; c.shadowBlur=8+Math.sin(G.time*5)*3; }
   G.rrect(6,L.bannerY,VW-12,24,12); const g=c.createLinearGradient(0,L.bannerY,0,L.bannerY+24); g.addColorStop(0,'#8ce4ff'); g.addColorStop(1,'#3aa8dc'); c.fillStyle=g; c.fill(); c.restore();
   G.icon(L.call.icon||'roster',c,22,L.bannerY+12,13,'#06202c');
   G.txt(L.call.text,VW/2+8,L.bannerY+6.5,7.2,'#06202c','center',VW-56,800);
  } else if(L.wc){
   const w=L.wc; G.rrect(w.x,w.y,w.w,w.h,w.h/2); c.fillStyle='rgba(216,176,80,.18)'; c.fill(); c.strokeStyle='rgba(255,210,122,.7)'; c.lineWidth=1; c.stroke();
   G.txt(w.text,w.x+w.w/2,w.y+4,w.size,'#ffd27a','center',undefined,700);
  }
  // NEXT on the horizon
  { const y=L.nextY, h=L.nextH, u=G.horizon.upcoming(1)[0], press=G.held(8,y,VW-16,h);
    G.panel(8,y+(press?1:0),VW-16,h,{r:12,border:'rgba(255,170,90,.55)'});
    if(u){
     const d=new Date(u.o.slice(0,4),+u.o.slice(5,7)-1,+u.o.slice(8,10)), T=C.evType(u.e.ty), un=G.horizon.until(u.o,u.e.tm);
     G.rrect(16,y+8,42,h-16,8); c.fillStyle=T.col; c.fill();
     G.txt(['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][d.getMonth()],37,y+12,6,'#14100c','center',undefined,800);
     G.txt(String(d.getDate()),37,y+22,12,'#14100c','center',undefined,800);
     G.txt('NEXT ON THE HORIZON',66,y+8,5.6,'#ff9a50','left',undefined,800);
     G.txt(G.horizon.titleOf(u.e,u.o),66,y+19,8.4,'#f4ede2','left',VW-150,800);
     G.txt([u.e.tm?G.horizon.fmtTime(u.e.tm):'',u.e.loc].filter(Boolean).join(' • ')||T.t,66,y+36,6,'#b8ad9c','left',VW-150,700);
     G.chip(un.t,VW-16,y+8,{align:'right',size:5.8,col:un.col,bg:'rgba(0,0,0,.45)'});
     G.txt('CALENDAR ›',VW-18,y+h-17,6.2,'#ffb060','right',undefined,800);
    } else {
     G.icon('cal',c,36,y+h/2,22,'#ffb060');
     G.txt('ON THE HORIZON',62,y+13,8.6,'#ffd060','left',undefined,800);
     G.txt(C.loaded.events?'NOTHING SCHEDULED YET • TAP FOR THE CALENDAR':(C.state==='offline'&&!C.db?'NEEDS THE CLUB NETWORK • TAP FOR THE CALENDAR':'LOADING WHAT’S COMING UP…'),62,y+31,6,'#b8ad9c','left',VW-80,700);
    }
  }
  // cards
  L.R.forEach((r,i)=>{
   const press=G.held(r.x,r.y,r.w,r.h), y=r.y+(press?1:0), foc=this.st.f===i&&G.kbMode, lk=this.locked(r), ask=r.id==='photos'&&lk?this.photoAsk():null;
   G.rrect(r.x,y,r.w,r.h,12); c.fillStyle=press?'#2c2a3a':'rgba(29,27,39,.96)'; c.fill(); c.strokeStyle=foc?'#ffd060':(ask?'rgba(255,154,208,.45)':'rgba(255,255,255,.1)'); c.lineWidth=foc?2:1; c.stroke();
   const lab=this.label(r);
   if(r.wide) this.drawWide(c,r,y,lk,ask,lab);
   else {
    const is=Math.min(28,r.h*.28), R=is*.92, cy=y+Math.max(3,(r.h-(2*R+24))/2)+R;
    c.beginPath(); c.arc(r.x+r.w/2,cy,R,0,7); c.fillStyle=lk?'rgba(255,255,255,.05)':'rgba(240,120,24,.13)'; c.fill();
    G.icon(r.icon,c,r.x+r.w/2,cy,is,lk?'#7a7066':'#ffb060');
    G.txt(lab,r.x+r.w/2,cy+R+4,lab.length>13?6.4:7.2,lk?'#9a8f80':'#f0e6d6','center',r.w-8,800);
    if(ask) this.askPill(c,r.x+r.w/2,cy+R+15,ask,r.w-10);
    else G.txt(this.sub(r),r.x+r.w/2,cy+R+16,5.6,lk?'#6f665c':'#a89c8a','center',r.w-8,700);
   }
   if(lk) G.icon('lock',c,r.x+r.w-11,y+11,9,ask?'#ff9ad0':'#9a8f80');
   const n=this.badge(r);
   if(n>0){ c.beginPath(); c.arc(r.x+r.w-10,y+10,7,0,7); c.fillStyle='#ff5a40'; c.fill(); G.txt(String(Math.min(n,9)),r.x+r.w-10,y+5.8,6,'#fff','center',undefined,800); }
   else if(n<0){ c.beginPath(); c.arc(r.x+r.w-10,y+10,4.5,0,7); c.fillStyle='#ff5a40'; c.fill(); }
  });
  const sup=isSup(), vmark=G.activeAcct&&G.clubAccess().ok?' ✓':'';
  G.topBar((G.save.roadName||'GUEST')+vmark,{backLabel:'EXIT',sub:(sup?'SUPPORTER • ':'')+G.save.points.toLocaleString()+' PTS',subCol:sup?'#ff9ad0':'#ffd060',gear:true});
  if(this.exitM) this.exitM.draw(c);
 }
};

/* ============================ GAMES (the informational clubhouse's way into every game) ============================ */
const GAMES=[
 {id:'rideselect',t:'ROUTE BOARD',d:'10 RIDES • HOLD THE LINE • STOP FOR A BROTHER',icon:'road',best:null},
 {id:'picnicselect',t:'PICNIC YARD',d:'CORNHOLE • CHILI • BLACKJACK • PONG • DARTS',icon:'board'},
 {id:'pool',t:'8-BALL VS HAMMER',d:'THE CLUBHOUSE POOL TABLE',icon:'eight',best:'pool'},
 {id:'arcadeselect',t:'ARCADE',d:'TRIVIA + 4 RETRO CABINETS',icon:'joy'},
 {id:'slots',t:'RAGING SLOTS',d:'POINTS ONLY • NEVER MONEY',icon:'slot'},
 {id:'garage',t:'GARAGE TUNE-UP',d:'PRE-RIDE CHECKS AGAINST THE CLOCK',icon:'wrench',best:'garage'},
 {id:'jukebox',t:'JUKEBOX',d:'PICK THE CLUBHOUSE SOUNDTRACK',icon:'music'},
 {id:'scores',t:'HALL OF FAME',d:'HIGH SCORES • BADGES • THE BOARDS',icon:'trophy'}
];
G.scenes.games={
 enter(){ this.st={f:0}; },
 rows(){ const VH=G.VH, top=50, gap=6, n=GAMES.length, h=Math.min(62,(VH-top-10-gap*(n-1))/n); return GAMES.map((g,i)=>Object.assign({},g,{x:10,y:top+i*(h+gap),w:250,h})); },
 update(){
  if(G.backHit()){ G.go('club'); return; }
  const id=G.navList(this.st,this.rows());
  if(id==='scores') G.go('scores',{back:'games'});
  else if(id) G.go(id);
 },
 draw(c){
  const VH=G.VH;
  G.cover(G.img.bg_convoy,0,0,VW,VH,.35); G.dim(.84);
  this.rows().forEach((b,i)=>{
   const press=G.held(b.x,b.y,b.w,b.h), y=b.y+(press?1:0), foc=this.st.f===i&&G.kbMode;
   G.panel(b.x,y,b.w,b.h,{r:12,border:foc?'#ffd060':'rgba(255,255,255,.14)'});
   const ir=Math.min(17,b.h*.34);
   c.beginPath(); c.arc(b.x+28,y+b.h/2,ir,0,7); c.fillStyle='rgba(240,120,24,.13)'; c.fill();
   G.icon(b.icon,c,b.x+28,y+b.h/2,ir*1.15,'#ffb060');
   G.txt(b.t,b.x+54,y+b.h/2-12,8.2,'#f4ede2','left',176,800);
   G.txt(b.d,b.x+54,y+b.h/2+2,5.8,'#b8ad9c','left',176,700);
   G.txt('›',b.x+b.w-14,y+b.h/2-8,12,'#ffb060','center',undefined,800);
  });
  G.topBar('GAMES');
 }
};
})();
