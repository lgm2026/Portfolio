/* RIDE LOG: log a ride (date, bike, odometer, ride type), then who rode with you, photos for the club album and an
   optional BRAG ABOUT IT. Your rides are kept with your profile on this device; with an account they're also shared
   with your close riders and everyone you tag. Filter by month, year, all-time or between two dates.
   WE'RE CLOSE: everyone here is family - get in close with the riders you ride with most. Close riders see each
   other's rides and brag notes. */
(function(){
const VW=G.VW, CL=G.CL;
const BIKES=['MY HARLEY','THE TRIKE','ROAD GLIDE','OLD RELIABLE','THE BAGGER','LOANER'];
const NOTES=['CLUB RIDE','SOLO CRUISE','CHARITY RUN','COMMUTE','POKER RUN','MEMORIAL RIDE','JUST BECAUSE'];
const MONTHS=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const MONTHS_L=['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
const pad2=n=>String(n).padStart(2,'0');
function today(){ const d=new Date(); return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate()); }
function shiftDay(s,n){ const d=new Date(s+'T12:00:00'); d.setDate(d.getDate()+n); return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate()); }
function niceDate(s){ const d=new Date(s+'T12:00:00'); return d.toLocaleDateString([],{weekday:'short',month:'short',day:'numeric'}).toUpperCase(); }
function shiftMonth(ym,d){ let y=+ym.slice(0,4), m=+ym.slice(5,7)+d; while(m<1){ m+=12; y--; } while(m>12){ m-=12; y++; } return y+'-'+pad2(m); }
const myId=()=>G.activeAcct&&G.activeAcct.id;
const newRid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const isDay=s=>/^\d{4}-\d{2}-\d{2}$/.test(String(s||''));

/* one ride, from this device's log or from the club (a close rider's, or one you're tagged on) */
function fromLocal(m){
 const a=G.activeAcct, sup=a&&a.type==='sup';
 return {key:'L'+m.id,rid:m.rid||'',mine:true,d:m.date,mi:m.miles,bike:m.bike,ty:m.note,where:m.where||'',riders:m.riders||[],brag:m.brag||'',ph:m.ph||[],
  start:m.start,end:m.end,flag:m.flag||'',m,by:G.save.roadName||'ME',byId:myId(),bt:sup?'sup':'mem',bf:sup?(a.first||''):''};
}
function fromDoc(x){ return {key:'R'+x.id,rid:x.id,mine:false,d:x.d,mi:x.mi,bike:x.bike||'',ty:x.ty||'',where:x.where||'',riders:Array.isArray(x.riders)?x.riders:[],brag:x.brag||'',ph:Array.isArray(x.ph)?x.ph:[],by:x.by,byId:x.byId,bt:x.bt,bf:x.bf||''}; }
function inPeriod(d,f){
 if(f.k==='month') return d.slice(0,7)===f.ym;
 if(f.k==='year') return d.slice(0,4)===f.y;
 if(f.k==='range') return (!f.a||d>=f.a)&&(!f.b||d<=f.b);
 return true;
}
function ridersLine(r){
 const L=r.riders||[]; if(!L.length) return '';
 const names=L.map(p=>p.n); let s='WITH '+names.slice(0,2).join(', ');
 if(names.length>2) s+=' +'+(names.length-2);
 return s;
}
function pillRects(r,w,H){
 const P=[]; let x=w-8;
 if(r.brag){ const pw=38; x-=pw; P.push({k:'brag',x,y:H-21,w:pw,h:15}); x-=5; }
 if(r.ph&&r.ph.length){ const pw=30+String(r.ph.length).length*4; x-=pw; P.push({k:'photos',x,y:H-21,w:pw,h:15}); x-=5; }
 return P;
}
function rideCard(r){
 const H=64;
 return {h:H+6,focus:true,r,
  draw(c,x,y,w,foc){
   const press=G.held(x,y,w,H);
   G.rrect(x,y+(press?1:0),w,H,12); c.fillStyle=r.mine?'rgba(30,28,40,.95)':'rgba(34,26,40,.95)'; c.fill();
   c.strokeStyle=foc?'#ffd060':(r.mine?'rgba(255,255,255,.1)':'rgba(255,154,208,.22)'); c.lineWidth=foc?1.6:1; c.stroke();
   const mo=MONTHS[+r.d.slice(5,7)-1]||'', dd=String(+r.d.slice(8,10));
   G.rrect(x+7,y+8,38,H-16,9); c.fillStyle='rgba(240,120,24,.15)'; c.fill();
   G.txt(mo,x+26,y+13,5.8,'#ffb060','center',undefined,800);
   G.txt(dd,x+26,y+23,12,'#f4ede2','center',undefined,800);
   G.txt(r.d.slice(0,4),x+26,y+H-19,5,'#9a8f80','center',undefined,700);
   const tx=x+54, P=pillRects(r,w,H), pw=P.length?w-P[P.length-1].x+4:0;
   if(r.mine) G.txt(r.ty||'RIDE',tx,y+9,7.8,'#f4ede2','left',w-54-70,800);
   else G.drawPersonName({n:r.by,t:r.bt,f:r.bf},tx,y+9,7.8,'#f4ede2',w-54-70);
   G.txt(r.mi.toLocaleString()+' MI',x+w-10,y+8.5,9,'#ffd060','right',undefined,800);
   const sub=(r.mine?[r.bike,r.where]:[r.ty,r.where]).filter(Boolean).join(' • ');
   if(sub) G.txt(sub.toUpperCase(),tx,y+25,5.8,'#b8ad9c','left',w-54-10,700);
   const wl=ridersLine(r); if(wl) G.txt(wl,tx,y+H-18,5.6,'#9a8f80','left',Math.max(30,w-54-pw-6),700);
   else if(r.flag) G.txt('⚠ '+r.flag.replace('FLAGGED: ',''),tx,y+H-18,5.4,'#ff8a70','left',Math.max(30,w-54-pw-6),700);
   for(const p of P){
    const px=x+p.x, py=y+p.y;
    if(p.k==='brag'){ G.rrect(px,py,p.w,p.h,7.5); c.fillStyle='rgba(255,154,208,.16)'; c.fill(); c.strokeStyle='rgba(255,154,208,.7)'; c.lineWidth=1; c.stroke(); G.txt('BRAG',px+p.w/2,py+3.6,5.6,'#ffc4e2','center',undefined,800); }
    else { G.rrect(px,py,p.w,p.h,7.5); c.fillStyle='rgba(240,120,24,.14)'; c.fill(); c.strokeStyle='rgba(255,170,90,.6)'; c.lineWidth=1; c.stroke(); G.icon('cam',c,px+10,py+7.5,9.5,'#ffb060'); G.txt(String(r.ph.length),px+18,py+3.6,5.8,'#ffd8a8','left',undefined,800); }
   }
  },
  tap(lx,ly,w){ for(const p of pillRects(r,w,H)) if(lx>=p.x-4&&lx<=p.x+p.w+4&&ly>=p.y-5&&ly<=p.y+p.h+5) return {kind:p.k,r}; return ly<=H?{kind:'detail',r}:null; },
  enter(){ return {kind:'detail',r}; }};
}
/* a person row with up to two buttons on the right (WE'RE CLOSE) */
function personRow(p,sub,btns){
 const H=48;
 const rects=w=>{ let x=w-6; return btns.map(b=>{ const bw=b.w||64; x-=bw; const r={b,x,y:12,w:bw,h:24}; x-=5; return r; }); };
 return {h:H+5,focus:true,
  draw(c,x,y,w,foc){
   G.rrect(x,y,w,H,12); c.fillStyle='rgba(30,28,40,.95)'; c.fill(); c.strokeStyle=foc?'#ffd060':'rgba(255,255,255,.1)'; c.lineWidth=foc?1.6:1; c.stroke();
   G.personDot(c,p,x+22,y+H/2,13);
   const R=rects(w), room=Math.max(40,(R.length?R[R.length-1].x:w)-48);
   G.drawPersonName(p,x+42,y+11,7.8,'#f4ede2',room);
   G.txt(sub||G.personSub(p),x+42,y+27,5.6,p.t==='sup'?'#ff9ad0':'#9a8f80','left',room,700);
   for(const r of R) G.button({x:x+r.x,y:y+r.y,w:r.w,h:r.h,label:r.b.label,kind:r.b.kind||'secondary',size:6.4});
  },
  tap(lx,ly,w){ for(const r of rects(w)) if(lx>=r.x&&lx<=r.x+r.w&&ly>=r.y-4&&ly<=r.y+r.h+4) return {kind:r.b.act,p}; return null; },
  enter(){ return btns[0]?{kind:btns[0].act,p}:null; }};
}

G.scenes.mileage={
 enter(a){
  a=a||{};
  if(a.back) this.back=a.back; else if(!this.back) this.back=G.save.roadName?'club':'title';
  this.st={f:0}; this.saved=null; this.modal=null; this.picker=null; this.batch=null; this.err=''; this.sending=null;
  this.list=CL.List(); this.cache=null;
  if(!this.flt) this.flt={k:'month',ym:today().slice(0,7),y:today().slice(0,4),a:'',b:''};
  this.crew=[]; this.crewKey=''; this.crewUnsubs=[]; this.crewParts={}; this.crewLoaded=false;
  this.lock=G.LockPanel('rides');
  this.mode='menu';
  if(a.close) this.openClose();
  else if(a.list) this.openList(a.list,a.who||null);
 },
 exit(){ this.dropCrew(); },
 totals(){
  const mo=today().slice(0,7); let cur=0, all=0, n=0, nm=0;
  for(const m of G.save.mileage){ all+=m.miles; n++; if(String(m.date).slice(0,7)===mo){ cur+=m.miles; nm++; } }
  return {cur,all,n,nm,mo};
 },
 /* ---------------- home ---------------- */
 menuBtns(){
  const VH=G.VH, C=G.club, q=C.viewOk()?C.closeRequests().length:0, n=C.closeIds().length;
  return [{id:'log',label:'LOG A RIDE',sub:'MILES • RIDERS • PHOTOS • BRAG',kind:'primary',x:16,y:VH-206,w:238,h:50,size:9},
   {id:'mine',label:'MY RIDES',x:16,y:VH-148,w:116,h:40,size:8},
   {id:'crew',label:'CLOSE RIDES',x:138,y:VH-148,w:116,h:40,size:8},
   {id:'close',label:'WE’RE CLOSE',sub:q?q+(q===1?' WANTS':' WANT')+' TO GET IN CLOSE':(n?n+' CLOSE RIDER'+(n===1?'':'S'):'GET IN CLOSE WITH YOUR CREW'),x:16,y:VH-100,w:238,h:44,size:8.2,subCol:q?'#ffc4e2':undefined},
   {id:'csv',label:'EXPORT CSV',kind:'ghost',x:70,y:VH-48,w:130,h:30,size:7}];
 },
 drawMenu(c){
  const VH=G.VH, t=this.totals(), B=this.menuBtns(), top=50, ph=B[0].y-12-top;
  G.panel(10,top,250,ph,{border:'rgba(255,170,90,.45)'});
  G.txt('THIS MONTH',VW/2,top+12,6.6,'#b8ad9c','center',undefined,800);
  G.txt(t.cur.toLocaleString()+' MI',VW/2,top+24,20,'#ffd060','center',230,800);
  G.txt(t.nm+(t.nm===1?' RIDE':' RIDES')+' THIS MONTH • LIFETIME '+t.all.toLocaleString()+' MI',VW/2,top+56,6.4,'#e8dcc8','center',232,700);
  // the last six months
  const bt=top+76, bb=top+ph-22, bh=bb-bt;
  if(bh>=36){
   const ym=today().slice(0,7), cols=[...Array(6).keys()].map(i=>shiftMonth(ym,i-5)), sums=cols.map(k=>G.save.mileage.reduce((s,m)=>s+(String(m.date).slice(0,7)===k?m.miles:0),0));
   const mx=Math.max(1,...sums), cw=36, gap=(230-cw*6)/5;
   if(!sums.some(Boolean)){ G.icon('road',c,VW/2,bt+bh/2-14,26,'rgba(255,176,96,.35)'); G.txt('NO RIDES THESE LAST SIX MONTHS',VW/2,bt+bh/2+6,6.6,'#9a8f80','center',220,800); G.txt('LOG ONE BELOW - YOUR MILES SHOW UP HERE',VW/2,bt+bh/2+19,5.8,'#7f7668','center',220,700); }
   cols.forEach((k,i)=>{
    const x=20+i*(cw+gap), h=sums[i]?Math.max(4,(bh-14)*sums[i]/mx):2, cur=i===5;
    G.rrect(x,bb-h,cw,h,Math.min(6,h/2)); c.fillStyle=cur?'#ff9a40':'rgba(255,170,90,.38)'; c.fill();
    if(sums[i]) G.txt(sums[i]>=1000?(sums[i]/1000).toFixed(1)+'K':String(sums[i]),x+cw/2,bb-h-11,5.6,cur?'#ffd060':'#cfc4b0','center',cw+4,800);
    G.txt(MONTHS[+k.slice(5,7)-1],x+cw/2,bb+5,5.6,cur?'#ffd060':'#9a8f80','center',undefined,800);
   });
  }
  const C=G.club, q=C.viewOk()?C.closeRequests().length:0;
  G.drawBtns(B,this.st);
  if(q){ const b=B[3]; c.beginPath(); c.arc(b.x+b.w-12,b.y+12,7,0,7); c.fillStyle='#ff5a40'; c.fill(); G.txt(String(Math.min(q,9)),b.x+b.w-12,b.y+7.8,6,'#fff','center',undefined,800); }
  G.icon('close',c,B[3].x+24,B[3].y+B[3].h/2,15,'#ffb060');
 },
 /* ---------------- page 1: the ride ---------------- */
 startForm(){
  this.mode='form'; this.err=''; this.pad=null; this.fst={f:0};
  this.f={date:today(),bike:0,note:0,start:'',end:'',where:'',riders:[],brag:'',rid:newRid()};
  this.batch=G.PhotoBatch();
  this.formFields();
 },
 formFields(){
  const L=this.FL(), f=this.f;
  G.field('start',{x:12,y:L.odo+14,w:118,h:40,digits:true,max:7,placeholder:'START',enterHint:'next',value:f.start,onInput:()=>{this.err='';},onEnter:()=>G.focusField('end')});
  G.field('end',{x:140,y:L.odo+14,w:118,h:40,digits:true,max:7,placeholder:'END',enterHint:'done',primary:false,value:f.end,onInput:()=>{this.err='';},onEnter:()=>{ G.blurFields(); this.next(); }});
 },
 FL(){ const y0=52; return {date:y0,bike:y0+52,odo:y0+104,note:y0+176,miles:y0+226,save:y0+246,kp:y0+300}; },
 formBtns(){
  const L=this.FL();
  return [
   {id:'date',x:12,y:L.date+12,w:246,h:34},{id:'bike',x:12,y:L.bike+12,w:246,h:34},
   {id:'start',x:12,y:L.odo+14,w:118,h:40},{id:'end',x:140,y:L.odo+14,w:118,h:40},
   {id:'note',x:12,y:L.note+12,w:246,h:34},
   {id:'save',label:'NEXT: RIDERS, PHOTOS & BRAG ›',kind:'primary',x:16,y:L.save,w:238,h:44,size:8.2},
   {id:'kp',label:'USE THE ARCADE KEYPAD',kind:'ghost',x:52,y:L.kp,w:166,h:28,size:6.8}
  ];
 },
 stepHit(b){ if(G.clicked(b.x,b.y,44,b.h)) return -1; if(G.clicked(b.x+b.w-44,b.y,44,b.h)) return 1; return 0; },
 change(row,d){
  const f=this.f;
  if(row===0){ const nd=shiftDay(f.date,d); if(nd<=today()) f.date=nd; else { AUDIO.sfx('buzzer'); return; } }
  if(row===1) f.bike=(f.bike+d+BIKES.length)%BIKES.length;
  if(row===4) f.note=(f.note+d+NOTES.length)%NOTES.length;
  AUDIO.sfx('tick');
 },
 /* odometer check: both readings, end past start, not a ride that's already on the log */
 check(){
  const f=this.f, s=parseInt(G.fieldVal('start')||'',10), e=parseInt(G.fieldVal('end')||'',10);
  if(isNaN(s)||isNaN(e)) return {err:'ENTER BOTH ODOMETER READINGS'};
  if(e<=s) return {err:'END MUST BE GREATER THAN START'};
  const miles=e-s; let flag='';
  if(miles>1200) flag='FLAGGED: 1200+ MI DAY';
  if(G.save.mileage.find(m=>m.date===f.date&&m.start===s&&m.end===e)) return {err:'THAT RIDE IS ALREADY LOGGED'};
  const overlap=G.save.mileage.find(m=>m.date===f.date&&m.bike===BIKES[f.bike]&&Math.max(m.start,s)<Math.min(m.end,e));
  if(overlap&&!flag) flag='FLAGGED: ODOMETER OVERLAP';
  return {s,e,miles,flag};
 },
 next(){
  const r=this.check(); if(r.err){ this.err=r.err; AUDIO.sfx('buzzer'); return; }
  this.f.start=G.fieldVal('start'); this.f.end=G.fieldVal('end'); this.f.chk=r;
  G.removeField('start'); G.removeField('end'); G.blurFields();
  this.openStory();
 },
 updForm(){
  if(this.pad){
   const r=G.osk(this.pad,'num',{kh:40});
   if(r==='DONE'){ this.pad=null; return; }
   if(r) return;
   const t=G.segHit(40,G.oskTop('num',{kh:40})-50,190,28,2);
   if(t>=0){ this.pad=t?'end':'start'; AUDIO.sfx('blip'); return; }
   if(G.backHit()){ this.pad=null; return; }
   return;
  }
  if(G.backHit()){ G.removeField('start'); G.removeField('end'); this.batch=null; this.mode='menu'; return; }
  const B=this.formBtns(), fs=this.fst;
  for(const k of [0,1,4]){ const d=this.stepHit(B[k]); if(d){ fs.f=k; this.change(k,d); return; } }
  if(G.pressed.left||G.pressed.right){ const d=G.pressed.left?-1:1; if(fs.f===0||fs.f===1||fs.f===4) this.change(fs.f,d); }
  const id=G.navList(fs,B);
  if(id==='save') this.next();
  else if(id==='kp'){ this.pad=G.fieldVal('start')?'end':'start'; G.blurFields(); }
  else if((id==='start'||id==='end')&&G.kbMode) G.focusField(id);
  else if(id==='bike'||id==='note') this.change(fs.f,1);
 },
 drawForm(c){
  const VH=G.VH, L=this.FL(), B=this.formBtns(), f=this.f, fs=this.fst||{f:0};
  const label=(t,y)=>G.txt(t,14,y,6.5,'#b8ad9c','left',undefined,700);
  const stepper=(k,text)=>{
   const b=B[k], foc=fs.f===k&&G.kbMode;
   G.rrect(b.x,b.y,b.w,b.h,b.h/2); c.fillStyle='rgba(255,255,255,.06)'; c.fill();
   c.strokeStyle=foc?'#ffd060':'rgba(255,255,255,.14)'; c.lineWidth=foc?2:1; c.stroke();
   for(const side of [0,1]){
    const x=side?b.x+b.w-40:b.x+4, press=G.held(x,b.y,40,b.h);
    G.rrect(x,b.y+4,36,b.h-8,(b.h-8)/2); c.fillStyle=press?'rgba(240,120,24,.45)':'rgba(240,120,24,.16)'; c.fill();
    G.txt(side?'›':'‹',x+18,b.y+b.h/2-9,13,'#ffb060','center',undefined,800);
   }
   G.txt(text,b.x+b.w/2,b.y+b.h/2-5.5,8,'#f4ede2','center',b.w-96,800);
  };
  label('DATE',L.date); stepper(0,f.date===today()?'TODAY • '+niceDate(f.date):niceDate(f.date));
  label('BIKE',L.bike); stepper(1,BIKES[f.bike]);
  label('START ODOMETER',L.odo+2); G.txt('END ODOMETER',142,L.odo+2,6.5,'#b8ad9c','left',undefined,700);
  for(const k of [2,3]){ const b=B[k]; G.rrect(b.x,b.y,b.w,b.h,14); c.fillStyle='rgba(0,0,0,.4)'; c.fill();
   if(fs.f===k&&G.kbMode){ G.rrect(b.x-3,b.y-3,b.w+6,b.h+6,16); c.strokeStyle='#ffd060'; c.lineWidth=2; c.stroke(); } }
  label('RIDE TYPE',L.note); stepper(4,NOTES[f.note]);
  const s=parseInt(G.fieldVal('start')||'',10), e=parseInt(G.fieldVal('end')||'',10);
  if(this.err) G.txt(this.err,VW/2,L.miles,7,'#ff7a60','center',VW-20,700);
  else if(!isNaN(s)&&!isNaN(e)&&e>s) G.txt('= '+(e-s).toLocaleString()+' MILES',VW/2,L.miles-2,9,'#80ffa0','center',VW-20,800);
  else G.txt('TAP A BOX TO TYPE WITH YOUR PHONE KEYPAD',VW/2,L.miles,6.5,'#8a7f70','center',VW-20);
  G.button(B[5],fs.f===5); G.button(B[6],fs.f===6);
  G.txt('STEP 1 OF 2',VW/2,L.kp+36,5.8,'#7f7668','center',undefined,800);
  if(this.pad){
   const top=G.oskTop('num',{kh:40});
   G.dim(.5);
   c.fillStyle='rgba(8,7,12,.96)'; c.fillRect(0,top-62,VW,VH-top+62);
   c.fillStyle='rgba(240,120,24,.5)'; c.fillRect(0,top-62,VW,1);
   G.seg(40,top-50,190,28,['START','END'],this.pad==='end'?1:0,7.5);
   G.txt((this.pad==='end'?'END':'START')+': '+(G.fieldVal(this.pad)||'-'),VW/2,top-16,7.5,'#ffd060','center',VW-20,800);
   G.oskDraw(c,'num',{kh:40,hint:false,doneLabel:'DONE'});
  }
 },
 /* ---------------- page 2: who rode, photos, brag ---------------- */
 SL(){ const VH=G.VH, btnY=VH-50, bragY=262; return {where:62,riders:114,photos:172,credit:222,bragY,bragH:Math.max(56,Math.min(120,btnY-30-bragY)),btnY}; },
 openStory(){
  this.mode='story'; this.sst={f:0}; this.err='';
  const L=this.SL(), f=this.f;
  G.field('rw',{x:12,y:L.where,w:246,h:32,max:60,align:'left',placeholder:'e.g. Blue Ridge Parkway',value:f.where,primary:false});
  G.field('rb',{x:12,y:L.bragY,w:246,h:L.bragH,max:1000,multiline:true,align:'left',value:f.brag,primary:false,
   placeholder:'The roads, the weather, the stops, who got lost…'});
  this.placeAdd();
 },
 keepStory(){ this.f.where=G.fieldVal('rw'); this.f.brag=G.fieldVal('rb'); },
 closeStory(){ this.keepStory(); for(const id of ['rw','rb','rp']) G.removeField(id); },
 canTag(){ return G.club.viewOk()&&G.club.loaded.names; },
 ridersBox(){ const L=this.SL(); return {x:12,y:L.riders,w:246,h:36}; },
 stripR(){ const L=this.SL(), b=this.batch; return b.stripRects(12,L.photos,246,46,b.items.length<30); },
 creditBox(){ const L=this.SL(); return {x:12,y:L.credit,w:246,h:20}; },
 storyBtns(){ const L=this.SL(); return [{id:'save',label:'SAVE THIS RIDE',kind:'primary',x:12,y:L.btnY,w:170,h:40,size:8.6},{id:'back',label:'‹ BACK',x:188,y:L.btnY,w:70,h:40,size:7.4}]; },
 /* the + ADD tile carries a real file picker (a genuine tap opens the camera / photo library) */
 placeAdd(){
  const C=G.club;
  if(this.mode!=='story'||this.picker||this.modal||!C.canUploadPhotos()||!this.batch||this.batch.busy){ G.removeField('rp'); return; }
  const r=this.stripR().find(q=>q.i<0); if(!r){ G.removeField('rp'); return; }
  const f=G.fields.rp; if(f&&f.rect.x===r.x&&f.rect.y===r.y) return;
  G.fileField('rp',{x:r.x,y:r.y,w:r.w,h:r.h,accept:'image/*',multiple:true,onFiles:fs=>{ G.removeField('rp'); this.batch.add(fs).then(()=>{ if(this.batch&&this.batch.err) G.toast(this.batch.err,'#ff7a60'); }); }});
 },
 updStory(){
  const C=G.club, b=this.batch;
  if(this.picker){ const r=this.picker.update(); if(r){ const pk=this.picker; this.picker=null; if(r.done){
    if(pk.target==='riders') this.f.riders=r.done.map(p=>({id:p.id,n:p.n,t:p.t,f:p.f||''}));
    else if(pk.target==='all') b.credit=r.done;
    else if(b.items[pk.target]) b.items[pk.target].cr=r.done; } }
   return; }
  if(this.modal){ const r=this.modal.update(); const m=this.modal;
   if(r==='cancel'||(r==null&&G.pressed.b)){ this.modal=null; G.hideFields(false); return; }
   if(r==='credit'){ this.modal=null; G.hideFields(false); this.openCredit(m.i); return; }
   if(r==='remove'){ this.modal=null; G.hideFields(false); b.items.splice(m.i,1); AUDIO.sfx('back'); return; }
   return; }
  this.placeAdd();
  if(G.backHit()){ this.closeStory(); this.mode='form'; this.formFields(); return; }
  if(b.busy) return;
  const rb=this.ridersBox();
  if(G.clicked(rb.x,rb.y,rb.w,rb.h)){
   if(!this.canTag()){ G.toast(G.activeAcct?'TAGGING NEEDS THE CLUB NETWORK':'CREATE AN ACCOUNT TO TAG RIDERS','#ffd27a'); return; }
   this.picker=G.PersonPicker({title:'WHO RODE?',sub:'CHECK EVERYONE ON THE RIDE',multi:true,sel:this.f.riders,exclude:[myId()]});
   this.picker.target='riders'; this.picker.open(); return;
  }
  if(C.canUploadPhotos()){
   for(const r of this.stripR()) if(r.i>=0&&G.clicked(r.x,r.y,r.w,r.h)){
    this.modal=G.Modal({title:'PHOTO '+(r.i+1),sub:'CREDIT: '+b.creditLabel(b.creditOf(b.items[r.i])),btns:[{id:'credit',label:'CREDIT THIS PHOTO',kind:'primary'},{id:'remove',label:'TAKE IT OUT',kind:'danger'},{id:'cancel',label:'CANCEL'}]});
    this.modal.i=r.i; G.hideFields(true); return;
   }
   const cb=this.creditBox(); if(b.items.length&&G.clicked(cb.x,cb.y,cb.w,cb.h)){ this.openCredit('all'); return; }
  }
  const id=G.navList(this.sst,this.storyBtns(),{noKeys:true});
  if(id==='save') this.save();
  else if(id==='back'){ this.closeStory(); this.mode='form'; this.formFields(); }
 },
 openCredit(target){
  const b=this.batch, me=b.me();
  this.picker=G.PersonPicker({title:'PHOTO BY',sub:target==='all'?'WHO TOOK THESE PHOTOS?':'WHO TOOK THIS ONE?',allowText:true,top:me?[Object.assign({me:true},me)]:[]});
  this.picker.target=target; this.picker.open();
 },
 drawStory(c){
  const C=G.club, L=this.SL(), f=this.f, b=this.batch;
  const lab=(t,y,col)=>G.txt(t,14,y-12,6.2,col||'#b8ad9c','left',VW-28,700);
  lab('WHERE (OPTIONAL)',L.where);
  // riders
  lab('WHO RODE WITH YOU',L.riders);
  { const r=this.ridersBox(), press=G.held(r.x,r.y,r.w,r.h);
    G.rrect(r.x,r.y+(press?1:0),r.w,r.h,13); c.fillStyle='rgba(255,255,255,.06)'; c.fill(); c.strokeStyle='rgba(240,120,24,.7)'; c.lineWidth=1.3; c.stroke();
    if(!f.riders.length) G.txt(this.canTag()?'+ TAG THE RIDERS WHO CAME ALONG':(G.activeAcct?'TAGGING NEEDS THE CLUB NETWORK':'CREATE AN ACCOUNT TO TAG RIDERS'),r.x+r.w/2,r.y+12,7,this.canTag()?'#ffb060':'#8a7f70','center',r.w-16,800);
    else {
     let x=r.x+8; const y=r.y+9, maxX=r.x+r.w-40; let shown=0;
     for(const p of f.riders){
      const nw=G.tw(p.n,6.6,800), fw=p.t==='sup'&&p.f?G.tw(G.titleCase(p.f),4.9,700)+4:0, w=nw+fw+14;
      if(x+w>maxX) break;
      G.rrect(x,y,w,18,9); c.fillStyle=p.t==='sup'?'rgba(255,154,208,.14)':'rgba(240,120,24,.16)'; c.fill();
      G.drawPersonName(p,x+7,y+4,6.6,'#f4ede2',w-10); x+=w+5; shown++;
     }
     const more=f.riders.length-shown;
     G.txt(more>0?'+'+more:'✎',r.x+r.w-16,r.y+11,more>0?7.4:8,'#ffb060','center',undefined,800);
    } }
  // photos
  if(C.canUploadPhotos()){
   lab('PHOTOS • THEY GO IN THE CLUB ALBUM'+(b.items.length?' • '+b.items.length:''),L.photos);
   b.drawStrip(c,this.stripR(),'+ ADD');
   if(b.busy){ G.rrect(12,L.photos,246,46,9); c.fillStyle='rgba(8,7,12,.82)'; c.fill(); G.txt(b.prog||'GETTING PHOTOS READY…',VW/2,L.photos+18,6.8,'#ffd060','center',230,800); }
   if(b.items.length){ const cb=this.creditBox(), cr=b.credit;
    G.txt('PHOTO BY:',cb.x+2,cb.y+5,6,'#ffc4e2','left',undefined,800);
    if(!cr||cr.id===myId()) G.txt('ME ▾',cb.x+50,cb.y+4.5,6.8,'#f4ede2','left',undefined,800); else G.drawPersonName(cr,cb.x+50,cb.y+4.5,6.8,'#f4ede2',150);
    G.txt('TAP A PHOTO TO CREDIT IT ON ITS OWN',cb.x+cb.w,cb.y+5.5,5.2,'#8a7f70','right',90,700); }
  } else {
   lab('PHOTOS',L.photos);
   G.rrect(12,L.photos,246,46,10); c.save(); c.setLineDash([3,3]); c.strokeStyle='rgba(255,255,255,.18)'; c.lineWidth=1; c.stroke(); c.restore();
   G.icon('cam',c,34,L.photos+23,16,'#6f665c');
   const off=!C.db&&G.activeAcct&&G.clubAccess().ok;   // an approved member, but no club network here
   G.txt(off?'RIDE PHOTOS NEED THE CLUB NETWORK.':'APPROVED MEMBERS ADD RIDE PHOTOS',52,L.photos+12,6.4,'#9a8f80','left',196,800);
   G.txt(off?'YOU CAN STILL BRAG!':'TO THE CLUB ALBUM. YOU CAN STILL BRAG!',52,L.photos+25,6.4,'#9a8f80','left',196,800);
  }
  // brag
  lab('BRAG ABOUT IT (OPTIONAL)',L.bragY,'#ffc4e2');
  G.rrect(12,L.bragY,246,L.bragH,14); c.fillStyle='rgba(0,0,0,.4)'; c.fill();
  const share=C.canShareRides();
  G.txt(share?'SEEN BY YOUR CLOSE RIDERS + EVERYONE YOU TAG':'SAVED WITH YOUR PROFILE ON THIS DEVICE',VW/2,L.btnY-15,5.8,share?'#a8ffc0':'#8a7f70','center',VW-20,800);
  G.drawBtns(this.storyBtns(),this.sst);
 },
 /* ---------------- save: photos into the album, the ride on the log, shared with the crew ---------------- */
 async save(){
  if(this.sending) return;
  const C=G.club, f=this.f, b=this.batch;
  this.keepStory();
  if(b&&b.busy){ G.toast('ONE MOMENT - PHOTOS ARE STILL GETTING READY','#ffd27a'); return; }
  const chk=f.chk; if(!chk){ this.err='CHECK THE ODOMETER READINGS'; return; }
  for(const id of ['rw','rb','rp']) G.removeField(id);
  const where=String(f.where||'').trim().slice(0,60), brag=String(f.brag||'').trim().slice(0,1000);
  const entry={id:Date.now(),rid:f.rid,date:f.date,bike:BIKES[f.bike],start:chk.s,end:chk.e,miles:chk.miles,note:NOTES[f.note],flag:chk.flag,
   where,riders:f.riders.slice(0,40),brag,ph:[],at:Date.now()};
  let phErr='';
  if(b&&b.items.length&&C.canUploadPhotos()){
   this.mode='sending'; this.sending={done:0,n:b.items.length};
   const r=await b.upload({d:f.date,loc:where,desc:G.titleCase(entry.note),ride:f.rid},(k,n)=>{ this.sending={done:k,n}; });
   entry.ph=r.ids; if(r.err) phErr=r.err;
  }
  this.sending=null;
  G.save.mileage.unshift(entry);
  G.save.mileage=G.save.mileage.slice(0,400);
  G.persist(); G.ach('logged'); if(C) C.touch();
  let shared=false;
  if(C.canShareRides()) shared=await C.publishRide(entry);
  this.batch=null;
  this.mode='saved'; AUDIO.sfx('cheer');
  const tagged=entry.riders.filter(p=>p.id).length, lines=[[entry.miles.toLocaleString()+' MILES','#ffd060',11],[' ','#fff',3]];
  lines.push([shared?'SHARED WITH YOUR CLOSE RIDERS'+(tagged?' + '+tagged+' TAGGED':''):(C.canShareRides()?'SAVED • SHARING FAILED (CHECK YOUR CONNECTION)':'SAVED WITH YOUR PROFILE ON THIS DEVICE'),shared?'#a8ffc0':'#cfc4b0',6.6]);
  if(entry.ph.length) lines.push([entry.ph.length+(entry.ph.length===1?' PHOTO':' PHOTOS')+' ADDED TO THE CLUB ALBUM','#ffd8a8',6.6]);
  if(phErr) lines.push([phErr==='quota_exceeded'?'THE ALBUM IS FULL - TELL THE CLUB ADMIN':'SOME PHOTOS DIDN’T UPLOAD','#ff8a70',6.4]);
  if(entry.flag) lines.push([entry.flag,'#ff8a70',6.6]);
  const btns=[{id:'ok',label:'DONE',kind:'primary'}];
  if(entry.ph.length) btns.push({id:'pics',label:'SEE THE PHOTOS'});
  this.saved=G.Modal({title:'RIDE LOGGED!',titleCol:'#80ffa0',lines,btns});
  this.saved.rid=entry.rid;
 },
 /* ---------------- the lists: MY RIDES (this device) and CLOSE RIDES (close riders + rides you're tagged on) ---------------- */
 openList(tab,who){
  this.mode='list'; this.tab=tab==='crew'?'crew':'mine'; this.who=who||null; this.list.reset(); this.cache=null;
  this.placeRange();
 },
 placeRange(){
  if(this.mode!=='list'||this.flt.k!=='range'||this.modal){ G.removeField('fa'); G.removeField('fb'); return; }
  if(G.fields.fa) return;
  const y=this.LL().perY;
  G.field('fa',{x:34,y,w:100,h:28,fs:.38,type:'date',align:'left',value:this.flt.a,maxDate:today(),primary:false,onInput:v=>{ this.flt.a=v; this.cache=null; this.list.reset(); }});
  G.field('fb',{x:158,y,w:100,h:28,fs:.38,type:'date',align:'left',value:this.flt.b,maxDate:today(),primary:false,onInput:v=>{ this.flt.b=v; this.cache=null; this.list.reset(); }});
 },
 LL(){ const VH=G.VH; return {tabY:48,fY:82,perY:114,totY:150,listY:166,area:{x:0,y:166,w:VW,h:VH-166-6}}; },
 syncCrew(){
  const C=G.club, me=myId(), ok=C.canShareRides()&&this.mode==='list'&&this.tab==='crew';
  const ids=ok?C.closeIds().slice().sort():[], key=ok?me+'|'+ids.join(','):'';
  if(key===this.crewKey) return;
  this.dropCrew(); this.crewKey=key; if(!key) return;
  const gen=this.crewGen, parts=this.crewParts={}, need=1+Math.ceil(ids.length/30); let got=0;
  const put=(k,L)=>{ if(gen!==this.crewGen) return; if(!(k in parts)) got++; parts[k]=L; if(got>=need) this.crewLoaded=true; this.mergeCrew(); };
  this.crewUnsubs.push(C.db.collection('rides').where('tag','array-contains',me).orderBy('at','desc').limit(200).onSnapshot(s=>put('tag',C.rideDocs(s)),()=>put('tag',[])));
  for(let i=0;i<ids.length;i+=30){ const k='by'+i, chunk=ids.slice(i,i+30);
   this.crewUnsubs.push(C.db.collection('rides').where('byId','in',chunk).orderBy('at','desc').limit(300).onSnapshot(s=>put(k,C.rideDocs(s)),()=>put(k,[]))); }
 },
 dropCrew(){ this.crewGen=(this.crewGen||0)+1; for(const u of this.crewUnsubs||[]){ try{ u(); }catch(e){} } this.crewUnsubs=[]; this.crewKey=''; this.crewLoaded=false; this.crew=[]; this.cache=null; },
 mergeCrew(){
  const me=myId(), m=new Map();
  for(const k in this.crewParts) for(const x of this.crewParts[k]) if(x.byId!==me) m.set(x.id,x);
  this.crew=[...m.values()].map(fromDoc); this.cache=null;
 },
 rides(){
  const L=this.tab==='crew'?this.crew:G.save.mileage.filter(m=>isDay(m.date)&&typeof m.miles==='number').map(fromLocal);
  return L.filter(r=>inPeriod(r.d,this.flt)&&(!this.who||r.byId===this.who.id)).sort((a,b)=>b.d.localeCompare(a.d)||String(b.key).localeCompare(String(a.key)));
 },
 listItems(){
  const C=G.club, f=this.flt;
  const key=[this.tab,C.ver,G.save.mileage.length,this.crew.length,this.crewLoaded,f.k,f.ym,f.y,f.a,f.b,this.who?this.who.id:''].join('|');
  if(this.cache&&this.cache.key===key) return this.cache.items;
  const it=[], R=this.rides();
  if(this.tab==='crew'){
   if(!G.activeAcct||!C.viewOk()) it.push(CL.note(['CREATE AN ACCOUNT TO SEE YOUR','CLOSE RIDERS’ RIDES AND GET TAGGED ON RIDES.'],'#ffd27a'));
   else if(!C.db) it.push(CL.note(['CLOSE RIDES NEED THE CLUB NETWORK.'],'#ffd27a'));
   else if(!this.crewLoaded) it.push(CL.note(['LOADING RIDES…']));
   else if(!R.length){ it.push(CL.note(this.who?['NO RIDES FROM '+this.who.n+' IN THIS PERIOD.']:(C.closeIds().length?['NO RIDES FROM YOUR CLOSE RIDERS','OR RIDES YOU’RE TAGGED ON IN THIS PERIOD.']:['GET IN CLOSE WITH YOUR CREW TO SEE','THEIR RIDES HERE. TAGGED RIDES SHOW UP TOO.']))); if(!C.closeIds().length) it.push(CL.action('WE’RE CLOSE ›',{kind:'close'},'ghost')); }
  } else if(!R.length) it.push(CL.note(G.save.mileage.length?['NO RIDES IN THIS PERIOD.']:['NO RIDES LOGGED YET.','LOG ONE FROM THE RIDE LOG HOME.']));
  for(const r of R) it.push(rideCard(r));
  CL.layout(it); this.cache={key,items:it,n:R.length,mi:R.reduce((s,r)=>s+r.mi,0),people:new Set(R.map(r=>r.byId)).size};
  return it;
 },
 periodText(){
  const f=this.flt;
  if(f.k==='month') return MONTHS_L[+f.ym.slice(5,7)-1]+' '+f.ym.slice(0,4);
  if(f.k==='year') return f.y;
  return 'EVERY RIDE ON THE LOG';
 },
 updList(){
  const C=G.club, LL=this.LL();
  this.syncCrew();
  if(this.modal){ this.updListModal(); return; }
  this.placeRange();
  if(G.backHit()){ G.removeField('fa'); G.removeField('fb'); this.dropCrew(); this.mode='menu'; return; }
  const t=G.segHit(8,LL.tabY,254,28,2);
  if(t>=0){ const nt=t?'crew':'mine'; if(nt!==this.tab){ this.tab=nt; this.who=null; this.list.reset(); this.cache=null; AUDIO.sfx('blip'); } return; }
  const fk=G.segHit(8,LL.fY,254,26,4);
  if(fk>=0){ const k=['month','year','all','range'][fk]; if(k!==this.flt.k){ this.flt.k=k; G.removeField('fa'); G.removeField('fb'); this.list.reset(); this.cache=null; AUDIO.sfx('blip'); this.placeRange(); } return; }
  if(this.flt.k==='month'||this.flt.k==='year'){
   const d=G.clicked(8,LL.perY,48,28)?-1:(G.clicked(VW-56,LL.perY,48,28)?1:0);
   if(d){ if(this.flt.k==='month'){ const n=shiftMonth(this.flt.ym,d); if(n<=today().slice(0,7)) this.flt.ym=n; else { AUDIO.sfx('buzzer'); return; } } else { const n=String(+this.flt.y+d); if(n<=today().slice(0,4)) this.flt.y=n; else { AUDIO.sfx('buzzer'); return; } } this.list.reset(); this.cache=null; AUDIO.sfx('tick'); return; }
  }
  if(this.who&&G.clicked(VW-88,LL.totY-4,80,20)){ this.who=null; this.list.reset(); this.cache=null; AUDIO.sfx('blip'); return; }
  this.list.update(this.listItems(),LL.area,a=>this.onRide(a));
 },
 onRide(a){
  if(!a) return;
  if(a.kind==='close'){ G.removeField('fa'); G.removeField('fb'); this.dropCrew(); this.openClose(); return; }
  if(a.kind==='brag'){ this.openBrag(a.r); return; }
  if(a.kind==='photos'){ this.seePhotos(a.r); return; }
  if(a.kind==='detail') this.openDetail(a.r);
 },
 seePhotos(r){ G.go('photos',{filter:{k:'ride',ride:r.rid},back:'mileage',backArgs:{list:this.tab,who:this.who}}); },
 /* BRAG ABOUT IT: the rider's own words, in a small popup */
 openBrag(r){
  const W=226, lines=G.wrap(r.brag,7,W-22,600), maxL=Math.max(6,Math.floor((G.VH-210)/11)), L=lines.slice(0,maxL);
  if(lines.length>maxL) L[maxL-1]=L[maxL-1].replace(/\s*\S*$/,'')+' …';
  G.hideFields(true); AUDIO.sfx('ok');
  this.modal=G.Modal({w:W+18,title:'BRAG ABOUT IT',titleCol:'#ffc4e2',sub:(r.mine?'YOU':r.by)+' • '+G.fmtDay(r.d)+' • '+r.mi.toLocaleString()+' MI',border:'rgba(255,154,208,.7)',bodyH:L.length*11+14,
   drawBody:(c,x,y,w)=>{ G.rrect(x+10,y,w-20,L.length*11+8,10); c.fillStyle='rgba(255,154,208,.07)'; c.fill(); L.forEach((l,i)=>G.txt(l,x+18,y+5+i*11,7,'#f4ede2','left',w-34,600)); },
   btns:[{id:'close',label:'CLOSE',kind:'primary'}]});
  this.modal.kind='brag';
 },
 openDetail(r){
  const rows=[];
  if(!r.mine) rows.push(['RIDER',r.by+(r.bt==='sup'&&r.bf?' ('+G.titleCase(r.bf)+')':'')]);
  if(r.bike) rows.push(['BIKE',r.bike]);
  if(r.where) rows.push(['WHERE',r.where.toUpperCase()]);
  if(r.mine&&r.start!=null) rows.push(['ODOMETER',r.start.toLocaleString()+' → '+r.end.toLocaleString()]);
  const withL=r.riders&&r.riders.length?G.wrap(r.riders.map(p=>p.n+(p.t==='sup'&&p.f?' ('+G.titleCase(p.f)+')':'')).join(', '),6.6,150,700).slice(0,3):[];
  if(r.flag) rows.push(['NOTE',r.flag]);
  const btns=[];
  if(r.brag) btns.push({id:'brag',label:'READ THE BRAG',kind:'primary'});
  if(r.ph.length) btns.push({id:'pics',label:'SEE '+r.ph.length+(r.ph.length===1?' PHOTO':' PHOTOS')});
  if(r.mine) btns.push({id:'del',label:'DELETE THIS RIDE',kind:'danger'});
  btns.push({id:'close',label:'CLOSE',kind:btns.length?'secondary':'primary'});
  const bodyH=rows.length*15+(withL.length?withL.length*11+4:0)+8;
  G.hideFields(true); AUDIO.sfx('ok');
  this.modal=G.Modal({title:r.ty||'RIDE',sub:G.fmtDay(r.d)+' • '+r.mi.toLocaleString()+' MILES',bodyH,btnH:34,
   drawBody:(c,x,y0,w)=>{
    const y=y0+5;
    rows.forEach((q,i)=>{ G.txt(q[0],x+16,y+i*15+1,5.8,'#9a8f80','left',undefined,800); G.txt(q[1],x+76,y+i*15,6.8,q[0]==='NOTE'?'#ff8a70':'#f4ede2','left',w-90,700); });
    if(withL.length){ const yy=y+rows.length*15; G.txt('RODE WITH',x+16,yy+1,5.8,'#9a8f80','left',undefined,800); withL.forEach((l,i)=>G.txt(l,x+76,yy+i*11,6.6,'#ffd8a8','left',w-90,700)); }
   },btns});
  this.modal.kind='detail'; this.modal.r=r;
 },
 updListModal(){
  const m=this.modal, r=m.update();
  if(r==='close'||r==='no'||(r==null&&G.pressed.b)){ this.modal=null; G.hideFields(false); return; }
  if(m.kind==='detail'){
   if(r==='brag'){ this.modal=null; this.openBrag(m.r); }
   else if(r==='pics'){ this.modal=null; this.seePhotos(m.r); }
   else if(r==='del'){ this.modal=G.Modal({title:'DELETE THIS RIDE?',titleCol:'#ff8060',lines:[['IT COMES OFF YOUR LOG AND YOUR','#cfc4b0',6.8],['CLOSE RIDERS’ LISTS. ITS PHOTOS','#cfc4b0',6.8],['STAY IN THE CLUB ALBUM.','#cfc4b0',6.8]],btns:[{id:'yes',label:'DELETE IT',kind:'danger'},{id:'no',label:'KEEP IT'}]}); this.modal.kind='del'; this.modal.r=m.r; }
   return;
  }
  if(m.kind==='del'&&r==='yes'){
   const x=m.r; this.modal=null; G.hideFields(false);
   G.save.mileage=G.save.mileage.filter(q=>q.id!==x.m.id); G.persist(); if(G.club) G.club.touch();
   if(x.rid) G.club.unpublishRide(x.rid);
   this.cache=null; G.toast('RIDE DELETED','#ffd27a'); AUDIO.sfx('back');
  }
 },
 drawList(c){
  const VH=G.VH, LL=this.LL(), f=this.flt;
  G.seg(8,LL.tabY,254,28,['MY RIDES','CLOSE RIDES'],this.tab==='crew'?1:0,7.4);
  G.seg(8,LL.fY,254,26,['MONTH','YEAR','ALL-TIME','RANGE'],['month','year','all','range'].indexOf(f.k),6.6);
  const py=LL.perY;
  if(f.k==='month'||f.k==='year'){
   for(const side of [0,1]){ const x=side?VW-56:8, press=G.held(x,py,48,28); G.rrect(x,py,48,28,14); c.fillStyle=press?'rgba(240,120,24,.45)':'rgba(240,120,24,.16)'; c.fill(); G.txt(side?'›':'‹',x+24,py+5,12,'#ffb060','center',undefined,800); }
   G.txt(this.periodText(),VW/2,py+8,8.4,'#ffd060','center',150,800);
  } else if(f.k==='range'){
   G.txt('FROM',12,py+9,6,'#b8ad9c','left',undefined,800); G.txt('TO',140,py+9,6,'#b8ad9c','left',undefined,800);
  } else G.txt(this.periodText(),VW/2,py+8,7.6,'#ffd060','center',VW-20,800);
  const items=this.listItems(), K=this.cache;
  let tot=K.n+(K.n===1?' RIDE':' RIDES')+' • '+K.mi.toLocaleString()+' MI';
  if(this.tab==='crew'&&!this.who&&K.n) tot+=' • '+K.people+(K.people===1?' RIDER':' RIDERS');
  G.txt(tot,12,LL.totY,7,'#e8dcc8','left',this.who?170:VW-24,800);
  if(this.who){ G.chip('ONLY '+this.who.n+' ✕',VW-8,LL.totY-4,{align:'right',size:5.8,col:'#ffc4e2',bg:'rgba(255,154,208,.14)',border:'rgba(255,154,208,.5)'}); }
  this.list.draw(c,items,LL.area);
 },
 /* ---------------- WE'RE CLOSE ---------------- */
 openClose(){ this.mode='close'; this.list.reset(); this.cache=null; },
 closeItems(){
  const C=G.club, it=[];
  it.push({h:62,draw:(c,x,y,w)=>{
   G.rrect(x,y+2,w,54,12); c.fillStyle='rgba(255,154,208,.07)'; c.fill(); c.strokeStyle='rgba(255,154,208,.3)'; c.lineWidth=1; c.stroke();
   G.icon('close',c,x+24,y+29,20,'#ff9ad0');
   ['EVERYONE HERE IS FAMILY. GET IN CLOSE WITH THE','RIDERS YOU RIDE WITH MOST: CLOSE RIDERS SEE','EACH OTHER’S RIDES AND BRAG NOTES.'].forEach((l,i)=>G.txt(l,x+44,y+11+i*13,6,'#f0d8e4','left',w-52,700));
  }});
  const Q=C.closeRequests();
  if(Q.length){
   it.push(CL.hdr('WANT TO GET IN CLOSE',Q.length,'#ff9ad0'));
   for(const x of Q){ const p={id:x.a,n:x.an,t:x.at,f:x.af||''}; it.push(personRow(p,(x.at==='sup'?'♥ SUPPORTER':'MEMBER')+' • ASKED '+C.ago(x.ts),[{label:'NOT NOW',act:'decline',w:56},{label:'GET IN CLOSE',act:'accept',kind:'success',w:74}])); }
  }
  const O=C.closeCircle();
  it.push(CL.hdr('YOUR CLOSE RIDERS',O.length,'#ffb060'));
  for(const p of O) it.push(personRow(p,null,[{label:'STEP BACK',act:'step',w:62},{label:'RIDES',act:'rides',kind:'ghost',w:50}]));
  if(!O.length) it.push(CL.note(['NOBODY YET. GET IN CLOSE WITH THE','RIDERS YOU RIDE WITH MOST.']));
  const S=C.closeSent();
  if(S.length){
   it.push(CL.hdr('WAITING ON THEM',S.length,'#9a8f80'));
   for(const p of S) it.push(personRow(p,'ASKED • WAITING ON THEM',[{label:'CANCEL',act:'cancel',w:56}]));
  }
  it.push(CL.action('+ GET IN CLOSE WITH SOMEONE',{kind:'pick'},'primary'));
  CL.layout(it); return it;
 },
 async onClose(a){
  const C=G.club; if(!a||this.busy) return;
  if(a.kind==='pick'){
   if(!C.loaded.names){ G.toast('LOADING NAMES - ONE MOMENT','#ffd27a'); return; }
   const skip=[myId(),...C.closeIds(),...C.closeSent().map(p=>p.id)];
   const top=C.closeRequests().map(x=>({id:x.a,n:x.an,t:x.at,f:x.af||''}));
   this.picker=G.PersonPicker({title:'GET IN CLOSE',sub:'WHO DO YOU RIDE WITH MOST?',exclude:skip,top});
   this.picker.target='close'; this.picker.open(); return;
  }
  if(a.kind==='rides'){ this.openList('crew',a.p); return; }
  if(a.kind==='step'){ this.modal=G.Modal({title:'STEP BACK FROM '+a.p.n+'?',titleCol:'#ffd060',lines:[['YOU’LL STOP SEEING EACH OTHER’S','#cfc4b0',6.8],['RIDES AND BRAG NOTES. YOU CAN GET','#cfc4b0',6.8],['IN CLOSE AGAIN ANY TIME.','#cfc4b0',6.8]],btns:[{id:'yes',label:'STEP BACK',kind:'danger'},{id:'no',label:'STAY CLOSE'}]}); this.modal.p=a.p; return; }
  this.busy=true;
  if(a.kind==='accept'){ const ok=await C.getClose(a.p); G.toast(ok?'YOU’RE CLOSE WITH '+a.p.n+' NOW':'COULDN’T SAVE - CHECK YOUR CONNECTION',ok?'#80ffa0':'#ff7030'); AUDIO.sfx(ok?'cheer':'buzzer'); }
  else if(a.kind==='decline'||a.kind==='cancel'){ const ok=await C.stepBack(a.p.id); G.toast(ok?(a.kind==='cancel'?'REQUEST CANCELED':'MAYBE ANOTHER TIME'):'COULDN’T SAVE - CHECK YOUR CONNECTION',ok?'#ffd27a':'#ff7030'); }
  this.busy=false;
 },
 async pickClose(p){
  const C=G.club; this.busy=true;
  const was=C.closeState(p.id), ok=await C.getClose(p);
  this.busy=false;
  if(!ok){ G.toast('COULDN’T SAVE - CHECK YOUR CONNECTION','#ff7030'); AUDIO.sfx('buzzer'); return; }
  G.toast(was==='in'?'YOU’RE CLOSE WITH '+p.n+' NOW':'ASKED '+p.n+' TO GET IN CLOSE',was==='in'?'#80ffa0':'#ffd27a'); AUDIO.sfx(was==='in'?'cheer':'ok');
 },
 updClose(){
  const C=G.club;
  if(!G.activeAcct||!C.viewOk()){ if(G.backHit()){ this.mode='menu'; return; } this.lock.update(56); return; }
  if(this.picker){ const r=this.picker.update(); if(r){ this.picker=null; if(r.done) this.pickClose(r.done); } return; }
  if(this.modal){ const r=this.modal.update(); if(r==='no'||(r==null&&G.pressed.b)){ this.modal=null; return; }
   if(r==='yes'){ const p=this.modal.p; this.modal=null; C.stepBack(p.id).then(ok=>G.toast(ok?'STEPPED BACK FROM '+p.n:'COULDN’T SAVE - CHECK YOUR CONNECTION',ok?'#ffd27a':'#ff7030')); } return; }
  if(G.backHit()){ this.mode='menu'; return; }
  this.list.update(this.closeItems(),{x:0,y:48,w:VW,h:G.VH-54},a=>this.onClose(a));
 },
 drawClose(c){
  const C=G.club;
  if(!G.activeAcct||!C.viewOk()){ this.lock.draw(c,56); return; }
  if(!C.db) G.txt('WE’RE CLOSE NEEDS THE CLUB NETWORK',VW/2,G.VH-18,6,'#ffd27a','center',VW-20,800);
  this.list.draw(c,this.closeItems(),{x:0,y:48,w:VW,h:G.VH-54});
 },
 /* ---------------- CSV ---------------- */
 exportCSV(){
  const q=v=>{ const s=String(v==null?'':v); return /[",\n\r]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s; };
  const rows=[['date','bike','odometer_start','odometer_end','miles','ride_type','where','rode_with','photos','brag','flag']];
  for(const m of G.save.mileage) rows.push([m.date,m.bike,m.start,m.end,m.miles,m.note,m.where||'',(m.riders||[]).map(p=>p.n).join('; '),(m.ph||[]).length,m.brag||'',m.flag||'']);
  const csv=rows.map(r=>r.map(q).join(',')).join('\n');
  try{
   const a=document.createElement('a');
   a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv);
   a.download='raging-knights-ride-log.csv';
   document.body.appendChild(a); a.click(); a.remove();
   G.toast('CSV EXPORTED','#80ffa0');
  }catch(e){ G.toast('EXPORT FAILED','#ff6050'); }
 },
 /* ---------------- frame ---------------- */
 update(){
  if(this.mode==='menu'){
   if(G.backHit()){ G.go(this.back); return; }
   const id=G.navList(this.st,this.menuBtns());
   if(id==='log') this.startForm();
   else if(id==='mine'||id==='crew') this.openList(id);
   else if(id==='close') this.openClose();
   else if(id==='csv') this.exportCSV();
   return;
  }
  if(this.mode==='form'){ this.updForm(); return; }
  if(this.mode==='story'){ this.updStory(); return; }
  if(this.mode==='sending') return;
  if(this.mode==='saved'){
   const r=this.saved.update();
   if(r==='pics'){ const rid=this.saved.rid; this.saved=null; G.go('photos',{filter:{k:'ride',ride:rid},back:'mileage'}); return; }
   if(r||G.pressed.b){ this.saved=null; this.mode='menu'; G.clearFields(); }
   return;
  }
  if(this.mode==='list'){ this.updList(); return; }
  if(this.mode==='close'){ this.updClose(); return; }
 },
 draw(c){
  const VH=G.VH;
  G.cover(G.img.bg_convoy,0,0,VW,VH); G.dim(.86);
  if(this.mode==='menu'){ this.drawMenu(c); G.topBar('RIDE LOG'); return; }
  if(this.mode==='form'){ this.drawForm(c); G.topBar('LOG A RIDE',{sub:'STEP 1 • THE RIDE',subCol:'#ffb060'}); return; }
  if(this.mode==='story'){ this.drawStory(c); G.topBar('LOG A RIDE',{sub:'STEP 2 • THE CREW + THE STORY',subCol:'#ffb060'}); if(this.picker) this.picker.draw(c); if(this.modal) this.modal.draw(c); return; }
  if(this.mode==='sending'){
   const s=this.sending||{done:0,n:1};
   G.panel(24,VH*.36,222,96,{border:'rgba(255,170,90,.6)'});
   G.icon('cam',c,VW/2,VH*.36+28,22,'#ffb060');
   G.txt('UPLOADING PHOTO '+Math.min(s.n,s.done+1)+' OF '+s.n+'…',VW/2,VH*.36+50,7.4,'#ffd060','center',206,800);
   G.rrect(44,VH*.36+70,182,8,4); c.fillStyle='rgba(255,255,255,.1)'; c.fill(); G.rrect(44,VH*.36+70,Math.max(8,182*(s.done/s.n)),8,4); c.fillStyle='#ff9a40'; c.fill();
   G.topBar('SAVING YOUR RIDE',{back:false}); return;
  }
  if(this.mode==='saved'){ this.drawMenu(c); G.topBar('RIDE LOG'); this.saved.draw(c); return; }
  if(this.mode==='list'){ this.drawList(c); G.topBar(this.tab==='crew'?'CLOSE RIDES':'MY RIDES'); if(this.modal) this.modal.draw(c); return; }
  if(this.mode==='close'){ this.drawClose(c); G.topBar('WE’RE CLOSE',{sub:'YOUR CLOSE RIDERS',subCol:'#ff9ad0'}); if(this.picker) this.picker.draw(c); if(this.modal) this.modal.draw(c); return; }
 }
};
})();
