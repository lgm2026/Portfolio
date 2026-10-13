/* CLUB WIRE: always-on chat for APPROVED members (guests, visitors and tentative members see a lock). Two rooms:
   the member's own BATTALION chat and the RKFFMC NATIONWIDE chat.
   POLLS: any member can post a question with 2-5 answers (optionally "write-in" answers). Members tap an answer to
   vote (tap it again to take the vote back, or tap another to change it), results update live, and SEE RESPONSES shows
   who answered what. The member who posted it, the battalion's POC, club officers and the club admin can close or delete it.
   OFFICERS CHANNEL (G.go('chat',{officers:true})): one private room for the club admin, club officers, battalion POCs
   and members with a confirmed official position; everyone else sees an OFFICERS ONLY panel.
   Live-synced through the page's shared database (messages are grouped into one document per room per day;
   polls are polls/<id>, each member's answer is votes/<poll>~<member>); falls back to this device when the wire is down.
   Portrait layout: room tabs + composer on top, so the phone keyboard never covers them. */
(function(){
const VW=G.VW;
const NAMECOLS=['#ffd060','#80d8f0','#80ffa0','#ff9ad0','#d8b050','#b0a0ff','#ff9a70'];
function nameCol(n){ let h=0; for(const ch of n) h=(h*31+ch.charCodeAt(0))>>>0; return NAMECOLS[h%NAMECOLS.length]; }
function tfmt(ts){
 const d=new Date(ts), now=new Date();
 const hm=d.toLocaleTimeString([],{hour:'numeric',minute:'2-digit'});
 return d.toDateString()===now.toDateString()?hm:(d.getMonth()+1)+'/'+d.getDate()+' '+hm;
}
function dayKey(ts){ const d=new Date(ts); return d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0'); }
function loadLocal(room){ try{ return JSON.parse(localStorage.getItem('rka_chat2_'+room)||'[]'); }catch(e){ return []; } }
function saveLocal(room,a){ try{ localStorage.setItem('rka_chat2_'+room,JSON.stringify(a.slice(-100))); }catch(e){} }
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const TXT=7.5, LH=12.5, PADX=12, LIST_Y=150, ROW=30, MAXOPT=5;

G.scenes.chat={
 enter(o){
  o=o||{};
  this.officers=!!o.officers;
  this.lock=G.LockPanel(); this.unsubs=[]; this.ost={f:0};
  this.locked=!G.clubAccess().ok;
  this.offLocked=!this.locked&&this.officers&&!G.club.isOfficerish();
  if(this.locked||this.offLocked) return;
  const a=G.activeAcct, bk=G.club.battKey(a.battalion);
  if(this.officers){ this.rooms=[{id:'officers',label:'OFFICERS CHANNEL'}]; this.ri=0; }
  else {
   this.rooms=[{id:'b-'+bk,label:G.bl(a.battalion)||'MY BATTALION'},{id:'national',label:'NATIONWIDE'}];
   this.ri=this.riMem!=null&&this.lastAcct===a.id?this.riMem:0; this.lastAcct=a.id;
  }
  this.data={}; this.pend={}; this.legacy=[]; this.polls={}; this.votes={};
  for(const r of this.rooms){ this.data[r.id]=[]; this.pend[r.id]=[]; this.polls[r.id]=[]; this.votes[r.id]=[]; }
  this.db=null; this.unsubs=[]; this.readOnly=false;
  this.status='CONNECTING TO THE WIRE...'; this.statusCol='#9a8f80';
  this.sc={scroll:0}; this.keys=false; this.pm=null; this.pd=null; this.wi=null; this.confirm=null;
  this.mkMsg();
  this.connect();
 },
 mkMsg(){ G.field('msg',{x:8,y:88,w:128,h:40,fs:.32,max:140,placeholder:this.ph(),align:'left',enterHint:'send',onEnter:()=>this.send()}); },
 exit(){ for(const u of (this.unsubs||[])){ try{u();}catch(e){} } this.unsubs=[]; },
 room(){ return this.rooms[this.ri]; },
 ph(){ return 'Message…'; },   // the room's name is on the tab above; a longer hint gets cut off in this narrow box
 wide(){ return this.officers||this.room().id==='national'; },   // rooms that mix battalions show each poster's battalion
 connect(){
  const self=this;
  (async()=>{
   try{
    const db=(window.claude&&window.claude.use)?await window.claude.use('db'):null;
    if(G.sceneName!=='chat') return;
    if(!db){ self.status='THIS DEVICE ONLY (NO WIRE LINK)'; self.statusCol='#d8b050'; return; }
    self.db=db;
    for(const r of self.rooms){
     self.unsubs.push(db.collection('chat').where('room','==',r.id).orderBy('day','desc').limit(3).onSnapshot(s=>{
      const out=[];
      for(const d of s.docs){ const b=d.data(); const msgs=b&&b.msgs; if(!msgs||typeof msgs!=='object') continue;
       for(const k in msgs){ const m=msgs[k]; if(m&&typeof m.t==='string'&&typeof m.n==='string'&&typeof m.ts==='number') out.push({id:k,n:m.n,t:m.t,ts:m.ts,b:m.b||'',r:typeof m.r==='string'?m.r.slice(0,32):''}); } }
      self.data[r.id]=out;
      const ids=new Set(out.map(m=>m.id)); self.pend[r.id]=self.pend[r.id].filter(m=>!ids.has(m.id));
      if(!self.readOnly){ self.status='LIVE • MEMBERS ONLY • ALWAYS ON'; self.statusCol='#80ffa0'; }
     },()=>{ self.status='WIRE DOWN - SAVING ON THIS DEVICE'; self.statusCol='#d8b050'; self.db=null; }));
     self.unsubs.push(db.collection('polls').where('room','==',r.id).orderBy('at','desc').limit(20).onSnapshot(s=>{
      self.polls[r.id]=s.docs.map(d=>Object.assign({id:d.id},d.data())).filter(p=>p&&typeof p.q==='string'&&Array.isArray(p.opts)&&typeof p.at==='number');
     },()=>{}));
     self.unsubs.push(db.collection('votes').where('room','==',r.id).limit(1000).onSnapshot(s=>{
      self.votes[r.id]=s.docs.map(d=>Object.assign({id:d.id},d.data())).filter(v=>v&&typeof v.p==='string'&&typeof v.v==='string'&&typeof v.c==='number');
     },()=>{}));
    }
    // messages from the earlier single-room wire show in NATIONWIDE
    if(!self.officers) self.unsubs.push(db.collection('chat').orderBy('ts','desc').limit(40).onSnapshot(s=>{
     self.legacy=s.docs.map(d=>{ const m=d.data(); return m&&typeof m.t==='string'&&typeof m.n==='string'&&typeof m.ts==='number'?{id:'L'+d.id,n:m.n,t:m.t,ts:m.ts,b:''}:null; }).filter(Boolean);
    },()=>{}));
   }catch(e){ self.status='THIS DEVICE ONLY'; self.statusCol='#d8b050'; }
  })();
 },
 msgs(r){
  let L=this.data[r.id].concat(this.pend[r.id]);
  if(r.id==='national') L=L.concat(this.legacy);
  const seen=new Set(L.map(m=>m.ts+'|'+m.n));
  return L.concat(loadLocal(r.id).filter(m=>!seen.has(m.ts+'|'+m.n)));
 },
 /* the timeline: messages and polls together, newest first */
 list(){
  const r=this.room();
  const L=this.msgs(r).map(m=>({kind:'msg',ts:m.ts,m})).concat(this.polls[r.id].map(p=>({kind:'poll',ts:p.at,p})));
  return L.sort((a,b)=>b.ts-a.ts).slice(0,80);
 },
 async send(){
  const text=G.fieldVal('msg').trim().replace(/\s+/g,' ');
  if(!text){ AUDIO.sfx('buzzer'); return; }
  G.setField('msg','');
  const r=this.room(), ts=Date.now(), id=ts.toString(36)+Math.random().toString(36).slice(2,6);
  const m={n:G.save.roadName,t:text.slice(0,140),ts,b:G.activeAcct.battalion||''};
  if(this.officers){ const C=G.club, mp=C.myPos(); m.r=(C.roleLabel()||(mp?(G.bn(G.activeAcct.battalion)+' '+C.posTitle(mp.p)).trim():'')).slice(0,32); }
  this.sc.scroll=0; AUDIO.sfx('ok');
  if(!this.db||this.readOnly){ const L=loadLocal(r.id); L.push({...m,id,loc:true}); saveLocal(r.id,L); return; }
  this.pend[r.id].push({...m,id});
  const day=dayKey(ts), ref=this.db.collection('chat').doc(r.id+'~'+day);
  try{ await ref.update({msgs:{[id]:m},last:ts}); }
  catch(e){
   try{
    if(e&&e.code==='invalid_argument'){
     const snap=await ref.get();
     if(snap.exists) throw e;          // the day exists, so the write itself was refused
     await ref.set({room:r.id,day,msgs:{[id]:m},last:ts});
    } else throw e;
   }catch(e2){
    this.pend[r.id]=this.pend[r.id].filter(x=>x.id!==id);
    if(e2&&e2.code==='quota_exceeded'){ this.status='WIRE IS FULL - ASK AN ADMIN TO CLEAR IT'; this.statusCol='#ff7030'; }
    else { this.readOnly=true; this.status='VIEW-ONLY ACCESS - SAVED ON THIS DEVICE'; this.statusCol='#d8b050'; }
    const L=loadLocal(r.id); L.push({...m,id,loc:true}); saveLocal(r.id,L);
   }
  }
 },
 /* ---------------- polls ---------------- */
 pollVotes(p){ return (this.votes[p.room]||[]).filter(v=>v.p===p.id); },
 myVote(p){ const me=G.activeAcct; return this.pollVotes(p).find(v=>v.v===me.id)||null; },
 tally(p){
  const V=this.pollVotes(p), n=p.opts.map(()=>0); let other=0;
  for(const v of V){ if(v.c>=0&&v.c<n.length) n[v.c]++; else if(v.c<0) other++; }
  return {n,other,total:V.length};
 },
 canModerate(p){
  const C=G.club, me=G.activeAcct;
  if(p.byId===me.id||C.canManage()) return true;
  return C.isPoc()&&p.room==='b-'+C.myBk();
 },
 pollH(p){ return 26+this.pollQ(p).length*LH+6+(p.opts.length+(p.other?1:0))*ROW+26; },
 pollQ(p){ return G.wrap(p.q,TXT,VW-16-PADX*2,700).slice(0,4); },
 async vote(p,i,txt){
  if(p.closed){ G.toast('THIS POLL IS CLOSED','#ffd27a'); AUDIO.sfx('buzzer'); return; }
  if(!this.db||this.readOnly){ G.toast('POLLS NEED THE CLUB NETWORK','#ffd27a'); return; }
  const me=G.activeAcct, id=p.id+'~'+me.id, mine=this.myVote(p), L=this.votes[p.room];
  const ref=this.db.collection('votes').doc(id);
  if(mine&&mine.c===i&&i>=0){
   this.votes[p.room]=L.filter(v=>v.id!==id); AUDIO.sfx('back');
   try{ await ref.delete(); }catch(e){ G.toast('COULDN’T SAVE - CHECK YOUR CONNECTION','#ff7030'); }
   return;
  }
  const doc={p:p.id,room:p.room,v:me.id,n:me.roadName,b:me.battalion||'',c:i,at:Date.now()};
  if(i<0) doc.txt=String(txt||'').slice(0,40);
  this.votes[p.room]=L.filter(v=>v.id!==id).concat([Object.assign({id},doc)]); AUDIO.sfx('ok');
  try{ await ref.set(doc); }catch(e){ G.toast('COULDN’T SAVE - CHECK YOUR CONNECTION','#ff7030'); }
 },
 /* poll composer */
 openComposer(){
  if(!this.db||this.readOnly){ G.toast('POLLS NEED THE CLUB NETWORK','#ffd27a'); AUDIO.sfx('buzzer'); return; }
  G.removeField('msg'); this.keys=false;
  this.pm={n:2,other:false,err:'',st:{f:0}};
  this.mkPollFields(); G.focusField('pq'); AUDIO.sfx('ok');
 },
 mkPollFields(){
  const L=this.pmL();
  G.field('pq',{x:8,y:L.qy,w:254,h:36,max:120,align:'left',placeholder:'Ask the room a question…',enterHint:'next',value:G.fieldVal('pq'),onEnter:()=>G.focusField('po0'),onInput:()=>{ this.pm.err=''; }});
  for(let i=0;i<MAXOPT;i++){
   if(i<this.pm.n) G.field('po'+i,{x:8,y:L.oy+i*(ROW+4),w:254,h:ROW,fs:.36,max:40,align:'left',primary:false,placeholder:'Answer '+(i+1),value:G.fieldVal('po'+i),enterHint:i<this.pm.n-1?'next':'done',
    onEnter:()=>{ if(i<this.pm.n-1) G.focusField('po'+(i+1)); else G.blurFields(); },onInput:()=>{ this.pm.err=''; }});
   else G.removeField('po'+i);
  }
 },
 pmL(){
  const qy=80, oy=qy+36+20, n=this.pm?this.pm.n:2, end=oy+n*(ROW+4);
  const B=[];
  if(n<MAXOPT) B.push({id:'add',label:'+ ADD AN ANSWER',kind:'ghost',x:8,y:end+2,w:254,h:28,size:7.2});
  const ty=end+(n<MAXOPT?38:6);
  B.push({id:'other',x:8,y:ty,w:254,h:30,silent:true});
  B.push({id:'post',label:'POST POLL',kind:'primary',x:8,y:ty+40,w:254,h:40,size:8.5});
  B.push({id:'cancel',label:'CANCEL',x:8,y:ty+88,w:254,h:30,size:7.2});
  return {qy,oy,ty,B};
 },
 closeComposer(){
  G.removeField('pq'); for(let i=0;i<MAXOPT;i++) G.removeField('po'+i);
  this.pm=null; this.mkMsg();
 },
 async postPoll(){
  const pm=this.pm; if(!pm||pm.busy) return;
  const q=G.fieldVal('pq').trim().replace(/\s+/g,' ');
  const opts=[]; for(let i=0;i<pm.n;i++){ const v=G.fieldVal('po'+i).trim().replace(/\s+/g,' '); if(v&&!opts.some(o=>o.toLowerCase()===v.toLowerCase())) opts.push(v); }
  if(q.length<3){ pm.err='ASK A QUESTION FIRST'; AUDIO.sfx('buzzer'); G.focusField('pq'); return; }
  if(opts.length<2&&!(opts.length===1&&pm.other)){ pm.err='ADD AT LEAST 2 DIFFERENT ANSWERS'; AUDIO.sfx('buzzer'); return; }
  const me=G.activeAcct, r=this.room(), id=uid();
  const doc={room:r.id,q:q.slice(0,120),opts:opts.slice(0,MAXOPT).map(o=>o.slice(0,40)),other:!!pm.other,by:me.roadName,byId:me.id,b:me.battalion||'',at:Date.now(),closed:false};
  pm.busy=true;
  try{ await this.db.collection('polls').doc(id).set(doc); }
  catch(e){ pm.busy=false; pm.err='COULDN’T POST - CHECK YOUR CONNECTION'; AUDIO.sfx('buzzer'); return; }
  this.polls[r.id]=[Object.assign({id},doc)].concat(this.polls[r.id].filter(p=>p.id!==id));
  this.closeComposer(); this.sc.scroll=0;
  G.toast('POLL POSTED TO '+r.label,'#80ffa0'); AUDIO.sfx('cheer');
 },
 /* write-in answer */
 openWriteIn(p){
  const mine=this.myVote(p);
  this.wi={p,st:{f:0}}; this.msgVis(false);
  G.field('wi',{x:24,y:this.wiL().fy,w:222,h:36,max:40,align:'left',placeholder:'Your answer…',value:mine&&mine.c<0?mine.txt||'':'',enterHint:'send',onEnter:()=>this.submitWriteIn()});
  G.focusField('wi');
 },
 wiL(){ const y=Math.round(G.VH*.22); return {y,fy:y+52,B:[{id:'ok',label:'SUBMIT ANSWER',kind:'primary',x:24,y:y+100,w:222,h:38,size:8},{id:'no',label:'CANCEL',x:24,y:y+146,w:222,h:30,size:7.2}]}; },
 submitWriteIn(){
  const t=G.fieldVal('wi').trim().replace(/\s+/g,' ');
  if(t.length<1){ AUDIO.sfx('buzzer'); return; }
  const p=this.wi.p; this.closeWriteIn(); this.vote(p,-1,t);
 },
 closeWriteIn(){ G.removeField('wi'); this.wi=null; this.msgVis(true); if(G.fields.msg) G.primaryField='msg'; },
 msgVis(v){ const f=G.fields.msg; if(!f) return; if(!v) f.el.blur(); f.el.style.visibility=v?'visible':'hidden'; },
 /* responses sheet: who answered what */
 openResponses(p){ this.pd={p,sc:{scroll:0},st:{f:0}}; this.msgVis(false); AUDIO.sfx('ok'); },
 pdL(){
  const p=this.pd.p, VH=G.VH, top=54, h=VH-top-12, B=[];
  if(this.canModerate(p)){
   if(!p.closed) B.push({id:'close',label:'CLOSE POLL',kind:'ghost'});
   B.push({id:'del',label:'DELETE POLL',kind:'danger'});
  }
  B.push({id:'done',label:'DONE',kind:'primary'});
  const bw=(254-16-(B.length-1)*6)/B.length;
  B.forEach((b,i)=>Object.assign(b,{x:16+i*(bw+6),y:top+h-44,w:bw,h:34,size:7}));
  return {x:8,y:top,w:254,h,area:{x:8,y:top+64,w:254,h:h-64-52},B};
 },
 pdLines(){
  const p=this.pd.p, V=this.pollVotes(p), T=this.tally(p), out=[];
  p.opts.forEach((o,i)=>{
   out.push({t:o+'  ('+T.n[i]+')',col:'#ffd060',size:7.6,gap:6});
   const names=V.filter(v=>v.c===i).sort((a,b)=>a.at-b.at).map(v=>v.n);
   if(names.length) G.wrap(names.join(', '),6.6,222,600).forEach(l=>out.push({t:l,col:'#e8dcc8',size:6.6}));
   else out.push({t:'NO ONE YET',col:'#7f7668',size:6.2});
  });
  if(p.other){
   out.push({t:'WRITE-IN ANSWERS  ('+T.other+')',col:'#80e0ff',size:7.6,gap:6});
   const W=V.filter(v=>v.c<0).sort((a,b)=>a.at-b.at);
   if(W.length) W.forEach(v=>G.wrap(v.n+': '+(v.txt||''),6.6,222,600).forEach(l=>out.push({t:l,col:'#e8dcc8',size:6.6})));
   else out.push({t:'NO ONE YET',col:'#7f7668',size:6.2});
  }
  return out;
 },
 async closePoll(p){
  try{ await this.db.collection('polls').doc(p.id).update({closed:true,closedBy:G.activeAcct.roadName}); p.closed=true; G.toast('POLL CLOSED','#ffd27a'); AUDIO.sfx('back'); }
  catch(e){ G.toast('COULDN’T CLOSE - CHECK YOUR CONNECTION','#ff7030'); }
 },
 async deletePoll(p){
  try{
   await this.db.collection('polls').doc(p.id).delete();
   this.polls[p.room]=this.polls[p.room].filter(x=>x.id!==p.id);
   for(const v of this.pollVotes(p)) this.db.collection('votes').doc(v.id).delete().catch(()=>{});
   G.toast('POLL DELETED','#ffd27a'); AUDIO.sfx('back');
  }catch(e){ G.toast('COULDN’T DELETE - CHECK YOUR CONNECTION','#ff7030'); }
 },
 /* ---------------- layout + drawing helpers ---------------- */
 layout(list){
  let y=0; const out=[];
  for(const it of list){
   if(it.kind==='poll'){ const h=this.pollH(it.p); out.push({it,y,h}); y+=h+6; continue; }
   const lines=G.wrap(it.m.t,TXT,VW-16-PADX*2,600).slice(0,6);
   const h=24+lines.length*LH+6;
   out.push({it,lines,y,h}); y+=h+6;
  }
  return {rows:out,h:y};
 },
 sendBtn(){ return {id:'send',label:'SEND',kind:'primary',x:208,y:88,w:54,h:40,size:8}; },
 keysBtn(){ return {id:'keys',label:'',kind:this.keys?'selected':'secondary',x:174,y:88,w:30,h:40}; },
 pollBtn(){ return {id:'poll',label:'',kind:'secondary',x:140,y:88,w:30,h:40}; },
 listBottom(){ return this.keys?G.oskTop('abc')-22:G.VH; },
 latest(r){
  let L=this.data[r.id]; if(r.id==='national') L=L.concat(this.legacy);
  const P=this.polls[r.id].filter(p=>p.byId!==G.activeAcct.id);
  return {L,P,latest:Math.max(L.reduce((a,m)=>Math.max(a,m.ts),0),P.reduce((a,p)=>Math.max(a,p.at),0))};
 },
 unread(r){
  const x=this.latest(r), seen=(G.save.seen||{})['chat_'+r.id]||0;
  return x.latest>seen&&(x.L.some(m=>m.ts>seen&&m.n!==G.save.roadName)||x.P.some(p=>p.at>seen));
 },
 markSeen(){
  const r=this.room(), x=this.latest(r);
  if(!G.save.seen) G.save.seen={};
  if(x.latest>(G.save.seen['chat_'+r.id]||0)){ G.save.seen['chat_'+r.id]=x.latest; this.seenDirty=true; }
 },
 switchRoom(i){ this.ri=i; if(!this.officers) this.riMem=i; this.sc.scroll=0; AUDIO.sfx('blip'); const f=G.fields.msg; if(f) f.el.placeholder=this.ph(); },
 /* members without a club role or confirmed position: the officers channel stays closed */
 offRects(){
  const VH=G.VH, h=168, y=Math.max(60,Math.round((VH-h)/2)-30);
  return {x:14,y,w:242,h,btns:[{id:'pos',label:'OFFICIAL POSITIONS \u203A',kind:'ghost',x:28,y:y+h+14,w:214,h:36,size:8}]};
 },
 drawOffLock(c){
  const R=this.offRects();
  G.panel(R.x,R.y,R.w,R.h,{border:'rgba(255,176,96,.5)'});
  c.beginPath(); c.arc(VW/2,R.y+36,21,0,7); c.fillStyle='rgba(255,255,255,.07)'; c.fill();
  G.icon('lock',c,VW/2,R.y+37,24,'#ffb060');
  G.txt('OFFICERS ONLY',VW/2,R.y+66,10,'#ffb060','center',R.w-20,800);
  ['FOR THE CLUB ADMIN, CLUB OFFICERS, BATTALION','POCS AND MEMBERS WITH A CONFIRMED','OFFICIAL POSITION (PRESIDENT, ROAD CAPTAIN…).']
   .forEach((l,i)=>G.txt(l,VW/2,R.y+92+i*15,6.4,'#e0d6c4','center',R.w-18,700));
  G.txt('HOLD A POSITION? ADD IT UNDER OFFICIAL POSITIONS.',VW/2,R.y+R.h-20,6,'#9a8f80','center',R.w-20,700);
  G.drawBtns(R.btns,this.ost);
 },
 /* ---------------- update ---------------- */
 update(){
  if(this.locked){ if(G.backHit()){ G.go('club'); return; } if(G.clubAccess().ok){ this.enter({officers:this.officers}); return; } this.lock.update(52); return; }
  if(!G.clubAccess().ok){ this.exit(); G.clearFields(); this.pm=this.pd=this.wi=null; this.locked=true; return; }
  if(this.offLocked){
   if(G.backHit()){ G.go('club'); return; }
   if(G.club.isOfficerish()){ this.enter({officers:true}); return; }
   if(G.navList(this.ost,this.offRects().btns)==='pos') G.go('positions',{back:'club'});
   return;
  }
  if(this.officers&&!G.club.isOfficerish()){ this.exit(); G.clearFields(); this.pm=this.pd=this.wi=this.confirm=null; this.offLocked=true; return; }
  // poll composer
  if(this.pm){
   if(G.backHit()){ this.closeComposer(); return; }
   const tp=this.topPost(); if(G.clicked(tp.x,tp.y,tp.w,tp.h)){ this.postPoll(); return; }
   const L=this.pmL(), id=G.navList(this.pm.st,L.B,{noKeys:true});
   if(id==='add'){ this.pm.n=Math.min(MAXOPT,this.pm.n+1); this.mkPollFields(); G.focusField('po'+(this.pm.n-1)); AUDIO.sfx('ok'); }
   else if(id==='other'){ this.pm.other=!this.pm.other; AUDIO.sfx('blip'); }
   else if(id==='post') this.postPoll();
   else if(id==='cancel') this.closeComposer();
   return;
  }
  // write-in answer
  if(this.wi){
   if(G.backHit()){ this.closeWriteIn(); return; }
   const id=G.navList(this.wi.st,this.wiL().B,{noKeys:true});
   if(id==='ok') this.submitWriteIn(); else if(id==='no') this.closeWriteIn();
   return;
  }
  // confirm (delete poll)
  if(this.confirm){
   const r=this.confirm.update();
   if(r==='no'||(r==null&&G.pressed.b)){ this.confirm=null; return; }
   if(r==='yes'){ const p=this.confirm.p; this.confirm=null; this.pd=null; this.msgVis(true); this.deletePoll(p); }
   return;
  }
  // responses sheet
  if(this.pd){
   const fresh=this.polls[this.pd.p.room].find(x=>x.id===this.pd.p.id); if(fresh) this.pd.p=fresh;
   if(G.backHit()){ this.pd=null; this.msgVis(true); return; }
   const L=this.pdL(), id=G.navList(this.pd.st,L.B,{both:true});
   if(id==='done'){ this.pd=null; this.msgVis(true); return; }
   if(id==='close'){ this.closePoll(this.pd.p); return; }
   if(id==='del'){ this.confirm=G.Modal({title:'DELETE THIS POLL?',titleCol:'#ff8060',lines:[['ITS ANSWERS ARE REMOVED TOO.','#cfc4b0',7.2]],btns:[{id:'yes',label:'DELETE POLL',kind:'danger'},{id:'no',label:'KEEP IT'}]}); this.confirm.p=this.pd.p; return; }
   G.scroll(this.pd.sc,L.area,this.pdLines().reduce((s,l)=>s+(l.gap||0)+l.size*1.3+4,0)+10);
   return;
  }
  if(G.backHit()){ if(this.seenDirty) G.persist(); G.go('club'); return; }
  if(!this.officers){
   const t=G.segHit(8,48,254,30,2);
   if(t>=0&&t!==this.ri) this.switchRoom(t);
   if((G.pressed.left||G.pressed.right)&&!G.fieldFocused('msg')) this.switchRoom(1-this.ri);
  }
  const b=this.sendBtn(), k=this.keysBtn(), pb=this.pollBtn();
  if(G.clicked(b.x,b.y,b.w,b.h)){ this.send(); return; }
  if(G.clicked(k.x,k.y,k.w,k.h)){ this.keys=!this.keys; AUDIO.sfx('blip'); return; }
  if(G.clicked(pb.x,pb.y,pb.w,pb.h)){ this.openComposer(); return; }
  if(this.keys){ const r=G.osk('msg','abc'); if(r==='DONE'){ this.send(); return; } if(r) return; }
  this.markSeen();
  const area={x:0,y:LIST_Y,w:VW,h:this.listBottom()-LIST_Y}, L=this.layout(this.list());
  G.scroll(this.sc,area,L.h+10);
  // taps on a poll: answer it, or open its responses
  if(G.tapped(area.x,area.y,area.w,area.h)){
   const yy=G.ptr.rsy-LIST_Y+this.sc.scroll, row=L.rows.find(r=>yy>=r.y&&yy<r.y+r.h);
   if(row&&row.it.kind==='poll'){
    const p=row.it.p, ly=yy-row.y, oy=26+this.pollQ(p).length*LH+6, n=p.opts.length+(p.other?1:0);
    const i=Math.floor((ly-oy)/ROW);
    if(ly>=oy&&i>=0&&i<n){
     if(i<p.opts.length) this.vote(p,i);
     else if(p.closed){ G.toast('THIS POLL IS CLOSED','#ffd27a'); }
     else this.openWriteIn(p);
    } else if(ly>=row.h-26) this.openResponses(p);
   }
  }
 },
 topPost(){ const t='POST', w=G.tw(t,7,800)+24; return {x:VW-6-w,y:8,w,h:25,t}; },
 /* ---------------- draw ---------------- */
 drawPoll(c,p,x,y,w,h){
  const T=this.tally(p), mine=this.myVote(p), Q=this.pollQ(p);
  G.rrect(x,y,w,h,12); c.fillStyle='rgba(16,34,46,.96)'; c.fill();
  c.strokeStyle=p.closed?'rgba(255,255,255,.18)':'rgba(128,224,255,.55)'; c.lineWidth=1.2; c.stroke();
  // header: bar-chart glyph + who asked
  c.fillStyle='#80e0ff'; c.fillRect(x+PADX,y+13,3,6); c.fillRect(x+PADX+4.5,y+10,3,9); c.fillRect(x+PADX+9,y+15,3,4);
  G.txt('POLL • '+p.by+(this.wide()&&p.b?' • '+G.bs(p.b):''),x+PADX+17,y+8,7,nameCol(p.by),'left',150,800);
  G.txt(tfmt(p.at),x+w-PADX,y+9,5.8,'#7f7668','right');
  Q.forEach((l,i)=>G.txt(l,x+PADX,y+24+i*LH,TXT,'#f4ede2','left',undefined,700));
  let oy=y+26+Q.length*LH+6;
  const rows=p.opts.map((o,i)=>({label:o,n:T.n[i],mine:!!mine&&mine.c===i}));
  if(p.other) rows.push({label:mine&&mine.c<0?'✎ YOU: '+(mine.txt||''):'OTHER (WRITE IN)…',n:T.other,mine:!!mine&&mine.c<0,other:true});
  rows.forEach(r=>{
   const rx=x+10, rw=w-20, rh=ROW-4, pct=T.total?r.n/T.total:0;
   G.rrect(rx,oy,rw,rh,8); c.fillStyle='rgba(255,255,255,.06)'; c.fill();
   if(pct>0){ c.save(); G.rrect(rx,oy,rw,rh,8); c.clip(); c.fillStyle=r.mine?'rgba(240,138,42,.55)':'rgba(128,224,255,.22)'; c.fillRect(rx,oy,rw*pct,rh); c.restore(); }
   if(r.mine){ G.rrect(rx,oy,rw,rh,8); c.strokeStyle='#ffb060'; c.lineWidth=1.4; c.stroke(); }
   G.txt((r.mine&&!r.other?'✓ ':'')+r.label,rx+9,oy+8,6.9,r.mine?'#ffd060':(r.other?'#9fd8ff':'#ece2d2'),'left',rw-70,700);
   G.txt(r.n+(T.total?' • '+Math.round(pct*100)+'%':''),rx+rw-9,oy+8,6.4,'#cfc4b0','right',undefined,700);
   oy+=ROW;
  });
  G.txt((p.closed?'CLOSED • ':'')+T.total+' RESPONSE'+(T.total===1?'':'S')+(p.closed?'':(mine?' • TAP AGAIN TO TAKE IT BACK':' • TAP AN ANSWER')),x+PADX,y+h-17,5.8,p.closed?'#ffd27a':'#9a8f80','left',w-110,700);
  G.txt('SEE RESPONSES ›',x+w-PADX,y+h-18,6.4,'#80e0ff','right',undefined,800);
 },
 draw(c){
  const VH=G.VH;
  c.fillStyle='#14121c'; c.fillRect(0,0,VW,VH);
  G.cover(G.img.bg_dining,0,0,VW,VH); G.dim(.88);
  const title=this.officers?'OFFICERS CHANNEL':'CLUB WIRE';
  if(this.locked){ this.lock.draw(c,52); G.topBar(title,{size:this.officers?8.4:undefined}); return; }
  if(this.offLocked){ this.drawOffLock(c); G.topBar(title,{size:8.4}); return; }
  if(this.pm){ this.drawComposer(c); return; }
  if(this.officers){
   // one private room: who it's for
   G.rrect(8,48,254,30,12); c.fillStyle='rgba(255,176,96,.1)'; c.fill(); c.strokeStyle='rgba(255,176,96,.45)'; c.lineWidth=1; c.stroke();
   G.icon('offchat',c,24,63,14,'#ffb060');
   G.txt('PRIVATE TO CLUB LEADERSHIP',40,53,7,'#ffd060','left',214,800);
   G.txt('ADMIN • OFFICERS • POCS • POSITION HOLDERS',40,65,5.6,'#cfc4b0','left',214,700);
  } else {
   // room tabs
   G.seg(8,48,254,30,this.rooms.map(r=>r.label),this.ri,6.8);
   this.rooms.forEach((r,i)=>{ if(i!==this.ri&&this.unread(r)){ const R=G.segRects(8,48,254,30,2)[i]; c.beginPath(); c.arc(R.x+R.w-12,R.y+9,3.5,0,7); c.fillStyle='#ff6a50'; c.fill(); } });
  }
  // composer: tap the box to type with your phone keyboard; the key button shows arcade keys as a backup
  G.rrect(8,88,128,40,14); c.fillStyle='rgba(0,0,0,.35)'; c.fill();
  G.button(this.sendBtn());
  const pb=this.pollBtn(); G.button(pb);
  { const x=pb.x+pb.w/2-7, y=pb.y+12; c.fillStyle='#80e0ff'; c.fillRect(x,y+8,4,8); c.fillRect(x+5,y+2,4,14); c.fillRect(x+10,y+5,4,11);
    G.txt('POLL',pb.x+pb.w/2,pb.y+pb.h-11,4.6,'#80e0ff','center',undefined,800); }
  const kb=this.keysBtn(); G.button(kb);
  { const col=this.keys?'#16100a':'#ffb060', x=kb.x+kb.w/2, y=kb.y+kb.h/2;
    c.strokeStyle=col; c.lineWidth=1.4; G.rrect(x-9,y-6,18,12,2.5); c.stroke();
    c.fillStyle=col; for(let i=0;i<4;i++){ c.fillRect(x-6.5+i*3.6,y-3.2,2,2); c.fillRect(x-6.5+i*3.6,y,2,2); } c.fillRect(x-4.5,y+3,9,1.6); }
  c.beginPath(); c.arc(14,140,3.5,0,7); c.fillStyle=this.statusCol; c.fill();
  G.txt(this.status,22,135.5,6.2,this.statusCol,'left',VW-30,700);
  const L=this.layout(this.list()), LB=this.listBottom();
  c.save(); c.beginPath(); c.rect(0,LIST_Y,VW,LB-LIST_Y); c.clip();
  if(!L.rows.length){
   G.txt('QUIET IN HERE.',VW/2,LIST_Y+40,9,'#cfc4b0','center');
   G.txt('SAY SOMETHING, '+G.save.roadName+' • OR POST A POLL.',VW/2,LIST_Y+60,7.5,'#9a8f80','center',VW-20);
  }
  const nat=this.wide();
  for(const r of L.rows){
   const y=LIST_Y+r.y-this.sc.scroll;
   if(y>LB||y+r.h<LIST_Y) continue;
   if(r.it.kind==='poll'){ this.drawPoll(c,r.it.p,8,y,VW-16,r.h); continue; }
   const m=r.it.m, mine=m.n===G.save.roadName;
   G.rrect(8,y,VW-16,r.h,12);
   c.fillStyle=mine?'rgba(240,120,24,.13)':'rgba(30,28,40,.92)'; c.fill();
   c.strokeStyle=mine?'rgba(255,150,60,.45)':'rgba(255,255,255,.08)'; c.lineWidth=1; c.stroke();
   const who=m.n+(mine?' (YOU)':'')+(m.r?' • '+m.r:(nat&&m.b?' • '+G.bs(m.b):''));
   G.txt(who,8+PADX,y+8,7,nameCol(m.n),'left',160,800);
   G.txt((m.loc?'⌂ ':'')+tfmt(m.ts),VW-8-PADX,y+9,5.8,'#7f7668','right');
   r.lines.forEach((l,i)=>G.txt(l,8+PADX,y+24+i*LH,TXT,'#ece2d2','left',undefined,600));
  }
  c.restore();
  G.scrollBar({x:0,y:LIST_Y,w:VW-2,h:LB-LIST_Y},L.h+10,this.sc.scroll);
  if(this.keys){ c.fillStyle='rgba(11,10,16,.94)'; c.fillRect(0,LB,VW,VH-LB); G.oskDraw(c,'abc',{doneLabel:'SEND',hint:'ARCADE KEYS (YOUR PHONE KEYBOARD WORKS TOO)'}); }
  G.topBar(title,{size:this.officers?8.4:undefined});
  if(this.pd) this.drawResponses(c);
  if(this.wi) this.drawWriteIn(c);
  if(this.confirm) this.confirm.draw(c);
 },
 drawComposer(c){
  const pm=this.pm, L=this.pmL(), r=this.room();
  G.txt('POSTING TO: '+r.label,8,49,6.6,'#80e0ff','left',VW-16,800);
  G.txt('QUESTION',8,L.qy-11,6.2,'#b8ad9c','left',undefined,700);
  G.rrect(8,L.qy,254,36,14); c.fillStyle='rgba(0,0,0,.4)'; c.fill();
  G.txt('ANSWERS (2-'+MAXOPT+')',8,L.oy-13,6.2,'#b8ad9c','left',undefined,700);
  for(let i=0;i<pm.n;i++){ G.rrect(8,L.oy+i*(ROW+4),254,ROW,12); c.fillStyle='rgba(0,0,0,.4)'; c.fill(); }
  const tb=L.B.find(b=>b.id==='other');
  G.txt('ALLOW WRITE-IN ANSWERS',tb.x+4,tb.y+5,7.2,'#e8dcc8','left',undefined,700);
  G.txt('MEMBERS CAN TYPE THEIR OWN ANSWER',tb.x+4,tb.y+18,5.6,'#9a8f80','left',undefined,700);
  G.toggleDraw(tb.x+tb.w-42,tb.y+4,pm.other);
  G.drawBtns(L.B.filter(b=>b.id!=='other'),{f:-1});
  const cb=L.B.find(b=>b.id==='cancel');
  if(pm.err) G.txt(pm.err,VW/2,cb.y+cb.h+8,7,'#ff7a60','center',VW-20,700);
  else G.txt('EVERYONE IN THIS ROOM CAN ANSWER AND SEE WHO ANSWERED WHAT',VW/2,cb.y+cb.h+8,5.6,'#8a7f70','center',VW-20,700);
  G.topBar('NEW POLL');
  const tp=this.topPost(), press=G.held(tp.x,tp.y,tp.w,tp.h); G.glowFill(tp.x,tp.y+(press?1:0),tp.w,tp.h,12.5); G.txt(tp.t,tp.x+tp.w/2,tp.y+7.5+(press?1:0),7,'#16100a','center',undefined,800);
 },
 drawResponses(c){
  const L=this.pdL(), p=this.pd.p, T=this.tally(p);
  G.dim(.66);
  G.panel(L.x,L.y,L.w,L.h,{border:'rgba(128,224,255,.75)'});
  G.txt('RESPONSES • '+T.total+(p.closed?' • CLOSED':''),VW/2,L.y+10,7,'#80e0ff','center',L.w-20,800);
  G.wrap(p.q,7.6,L.w-28,800).slice(0,3).forEach((l,i)=>G.txt(l,VW/2,L.y+26+i*12,7.6,'#f4ede2','center',L.w-20,800));
  const A=L.area; let y=A.y-this.pd.sc.scroll;
  c.save(); c.beginPath(); c.rect(A.x,A.y,A.w,A.h); c.clip();
  for(const l of this.pdLines()){ y+=l.gap||0; if(y>A.y-20&&y<A.y+A.h) G.txt(l.t,A.x+16,y,l.size,l.col,'left',A.w-32,l.size>7?800:600); y+=l.size*1.3+4; }
  c.restore();
  G.scrollBar(A,this.pdLines().reduce((s,l)=>s+(l.gap||0)+l.size*1.3+4,0)+10,this.pd.sc.scroll);
  G.drawBtns(L.B,this.pd.st);
 },
 drawWriteIn(c){
  const L=this.wiL();
  G.dim(.66);
  G.panel(16,L.y,238,186,{border:'rgba(128,224,255,.75)'});
  G.txt('YOUR ANSWER',VW/2,L.y+12,9,'#80e0ff','center',220,800);
  G.txt(this.wi.p.q.slice(0,60),VW/2,L.y+30,6.4,'#cfc4b0','center',220,700);
  G.rrect(24,L.fy,222,36,14); c.fillStyle='rgba(0,0,0,.45)'; c.fill();
  G.drawBtns(L.B,this.wi.st);
 }
};
})();
