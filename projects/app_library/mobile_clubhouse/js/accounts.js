/* Member accounts (portrait): PIN login, the sign-up wizard and the device admin panel.
   Sign-up collects first name, LAST INITIAL only, road name, battalion, cell number and a headshot.
   New members start TENTATIVE until their battalion POC approves them (or 72 hours pass) - see club.js.
   Typing uses the phone's own keyboard by default; the arcade keys/keypad are a backup. */
(function(){
const VW=G.VW;

/* last names are no longer kept anywhere: only the initial survives (one-time cleanup of older accounts) */
const loadRoster=G.loadRoster;
G.loadRoster=function(){
 loadRoster();
 let dirty=false;
 for(const a of G.roster.accounts){
  if('last' in a){ if(!a.li) a.li=String(a.last||'').trim().slice(0,1).toUpperCase(); delete a.last; dirty=true; }
  if('verified' in a){ delete a.verified; dirty=true; }
 }
 if(dirty) G.saveRoster();
};
G.nameLine=function(a){ const f=a.first||a.f||'', li=a.li||''; return (f+(li?' '+li+'.':'')).trim(); };
const ST={approved:['✓ APPROVED','#a8ffc0','rgba(60,160,90,.18)'],tentative:['TENTATIVE','#ffd27a','rgba(216,176,80,.14)'],denied:['NOT APPROVED','#ffb0a0','rgba(200,70,50,.2)'],supporter:['♥ SUPPORTER','#ffb8dc','rgba(255,154,208,.16)']};
G.statusChip=function(st,x,y,o){ const s=ST[st]||ST.tentative; return G.chip(s[0],x,y,Object.assign({col:s[1],bg:s[2],size:6},o||{})); };
function acctStatus(a){ if(a.type==='sup') return 'supporter'; return G.club?G.club.statusOf(a.id,a.created).st:'tentative'; }
/* headshot, or the member's ride when there is no photo yet */
function drawAcct(c,a,x,y,d,av){
 if(a.photo){ G.drawFace(a.photo,x,y,d,a.roadName); return; }
 c.save(); c.beginPath(); c.arc(x+d/2,y+d/2,d/2,0,7); c.fillStyle='rgba(255,255,255,.07)'; c.fill(); c.clip();
 const sc=d/80; AV.draw(c,x+d/2-36*sc,y+d/2-21*sc,sc,av); c.restore();
 c.beginPath(); c.arc(x+d/2,y+d/2,d/2,0,7); c.strokeStyle='rgba(255,255,255,.18)'; c.lineWidth=1.2; c.stroke();
}

/* ---------- PIN entry: native numeric field (masked) + arcade keypad backup ---------- */
const PIN_W=150, PIN_H=46;
function pinField(y,onDone){
 G.field('pin',{x:(VW-PIN_W)/2,y,w:PIN_W,h:PIN_H,digits:true,max:4,secret:true,placeholder:'••••',enterHint:'go',
  onEnter:()=>{ if(G.fieldVal('pin').length===4) onDone(); else AUDIO.sfx('buzzer'); }});
 G.focusField('pin');
}
/* run every frame on a PIN screen: arcade keypad + auto-submit at 4 digits */
function pinUpdate(onDone){
 const r=G.osk('pin','num');
 if(r==='DONE'){ if(G.fieldVal('pin').length===4) return onDone(); AUDIO.sfx('buzzer'); }
 if(G.fieldVal('pin').length===4) onDone();
}
function pinDraw(c,y,err,shake){
 const sx=shake>0&&!G.rm()?Math.sin(shake*60)*6*shake/.4:0;
 G.rrect((VW-PIN_W)/2-6+sx,y-6,PIN_W+12,PIN_H+12,18); c.fillStyle='rgba(0,0,0,.4)'; c.fill();
 if(err) G.txt(err,VW/2,y+PIN_H+12,7,'#ff7a60','center',VW-20,700);
 G.oskDraw(c,'num',{doneLabel:'OK',ready:G.fieldVal('pin').length===4,hint:'TYPE WITH YOUR KEYBOARD • OR TAP THE KEYPAD'});
}
function pinY(){ // keep the field high so the phone keyboard never covers it
 const top=G.oskTop('num');
 return Math.max(132,Math.min(top-90,G.VH*.34));
}
function acctAvatar(a){
 try{ const s=JSON.parse(localStorage.getItem('rka_acct_'+a.id)||'null'); if(s&&s.avatar) return s.avatar; }catch(e){}
 return {type:'bike',seat:1,body:'#c02030',gender:'m',hair:'#6b4a2a'};
}

/* ============================ LOGIN ============================ */
G.scenes.login={
 enter(){
  G.loadRoster();
  this.mode='list'; this.ls={f:0,scroll:0}; this.tries=0; this.err=''; this.sel=null; this.shake=0;
  this.avs={}; for(const a of G.roster.accounts) this.avs[a.id]=acctAvatar(a);
 },
 area(){ return {x:10,y:62,w:250,h:G.VH-62-62}; },
 btns(){
  const VH=G.VH;
  return [{id:'new',label:'NEW ACCOUNT',kind:'ghost',x:10,y:VH-50,w:122,h:38,size:7.5},
          {id:'admin',label:'DEVICE ADMIN',kind:'ghost',x:138,y:VH-50,w:122,h:38,size:7.5}];
 },
 openPin(a){
  this.sel=a; this.mode='pin'; this.err=''; this.tries=0; this.shake=0;
  pinField(pinY(),()=>this.check());
  AUDIO.sfx('ok');
 },
 check(){
  const v=G.fieldVal('pin');
  if(v.length!==4) return;
  if(G.pinHash(v)===this.sel.pinH){
   G.blurFields(); AUDIO.sfx('cheer');
   G.toast('WELCOME BACK, '+this.sel.roadName,this.sel.type==='sup'?'#ff9ad0':'#80ffa0');   // first, so the club's notices queue behind it
   G.loginAs(this.sel);
   if(!this.sel.photo&&this.sel.type!=='sup') G.toast('ADD A HEADSHOT: GEAR (TOP RIGHT) \u203A HEADSHOT','#ffd27a',true);
   G.go('club');
  } else {
   this.tries++; G.setField('pin',''); this.shake=.4;
   this.err=this.tries>=3?'WRONG PIN - ASK A DEVICE ADMIN FOR HELP':'WRONG PIN - TRY AGAIN';
   AUDIO.sfx('buzzer');
  }
 },
 update(dt){
  if(this.shake>0) this.shake=Math.max(0,this.shake-dt);
  if(this.mode==='pin'){
   if(G.backHit()){ G.removeField('pin'); this.mode='list'; this.err=''; return; }
   pinUpdate(()=>this.check());
   return;
  }
  if(G.backHit()){ G.go('title'); return; }
  const A=G.roster.accounts, B=this.btns();
  for(const b of B) if(G.clicked(b.x,b.y,b.w,b.h)){ this.act(b.id); return; }
  const i=G.listNav(this.ls,this.area(),A.length,54,6,2);
  if(i<0) return;
  if(i>=A.length){ this.act(B[i-A.length].id); return; }
  this.openPin(A[i]);
 },
 act(id){
  AUDIO.sfx('ok');
  if(id==='new'){ G.wiz=null; G.go('createacct',{},true); } else G.go('admin',{},true);
 },
 draw(c){
  const VH=G.VH;
  G.cover(G.img.bg_dining,0,0,VW,VH); G.dim(.84);
  G.topBar('LOG IN');
  if(this.mode==='pin'){
   const a=this.sel, fy=pinY();
   const room=fy-14-48;
   let ny;
   if(a.photo){ const d=Math.max(54,Math.min(92,room-40)); G.drawFace(a.photo,VW/2-d/2,50,d,a.roadName,'#f08a2a'); ny=50+d+8; }
   else { const sc=Math.max(.8,Math.min(1.6,(room-44)/46)); AV.draw(c,VW/2-36*sc,46,sc,this.avs[a.id]); ny=46+46*sc+2; }
   G.txt(a.roadName,VW/2,ny,11,'#ffd060','center',VW-30,800);
   G.txt('ENTER YOUR 4-DIGIT PIN',VW/2,ny+20,7,'#cfc4b0','center');
   pinDraw(c,fy,this.err,this.shake);
   return;
  }
  const A=G.roster.accounts, ar=this.area();
  G.txt('WHO’S RIDING? TAP YOUR NAME',VW/2,48,7,'#b8ad9c','center');
  if(!A.length){
   G.txt('NO ACCOUNTS ON THIS DEVICE YET.',VW/2,ar.y+60,8,'#cfc4b0','center');
   G.txt('TAP NEW ACCOUNT TO JOIN THE CLUBHOUSE.',VW/2,ar.y+80,7,'#9a8f80','center');
  }
  c.save(); c.beginPath(); c.rect(ar.x-4,ar.y,ar.w+8,ar.h); c.clip();
  A.forEach((a,i)=>{
   const y=ar.y+i*60-this.ls.scroll;
   if(y>ar.y+ar.h||y+54<ar.y) return;
   const foc=this.ls.f===i&&G.kbMode, press=G.held(ar.x,y,ar.w,54);
   G.rrect(ar.x,y+(press?1:0),ar.w,54,12); c.fillStyle=press?'rgba(60,50,70,.95)':'rgba(30,28,40,.95)'; c.fill();
   c.strokeStyle=foc?'#ffd060':'rgba(255,255,255,.12)'; c.lineWidth=foc?2:1; c.stroke();
   drawAcct(c,a,ar.x+8,y+7,40,this.avs[a.id]);
   G.txt(a.roadName,ar.x+56,y+10,9.5,'#f4ede2','left',104,800);
   G.txt(a.type==='sup'?(a.loc||'SUPPORTER'):[G.bn(a.battalion),G.nameLine(a)].filter(Boolean).join(' • '),ar.x+56,y+31,6.5,'#9a8f80','left',104);
   G.statusChip(acctStatus(a),ar.x+ar.w-24,y+18,{align:'right',size:5.6});
   G.txt('›',ar.x+ar.w-10,y+14,14,'#ffb060','center');
  });
  c.restore();
  G.scrollBar(ar,this.ls.contentH||0,this.ls.scroll);
  this.btns().forEach((b,k)=>G.button(b,this.ls.f===A.length+k));
 }
};

/* ============================ CREATE ACCOUNT ============================ */
/* Two kinds of account: CLUB MEMBERS (first name, last initial, road name, battalion 1-9, optional position, cell,
   headshot - their POC approves them) and SUPPORTERS (friends & family: first name, a nickname and where they're from -
   they get everything but the Alpha Roster and the club's chats). Right after picking member or supporter, everyone
   picks MALE or FEMALE: it sets up their rider and the RANDOM ROAD NAME / NICKNAME ideas (500 of each, skipping any
   name someone in the club already has). Everyone picks INTERACTIVE or INFORMATIONAL, builds their rider + bike, then
   sets a PIN. */
const NAMECHARS=/[^A-Z \-'.]/g, CODECHARS=/[^A-Z0-9 \-]/g, LOCCHARS=/[^A-Z \-'.,]/g;
const TYPE={k:'type',pick:'type',label:'WHO’S SIGNING UP?',hint:'RAGING KNIGHTS MEMBERS AND THE PEOPLE WHO BACK THEM'};
const MODE={k:'mode',pick:'mode',label:'YOUR CLUBHOUSE',hint:'YOU CAN SWITCH ANY TIME IN SETTINGS'};
const GENDER={k:'g',pick:'g',label:'MALE OR FEMALE?',hint:'SETS UP YOUR RIDER AND YOUR NAME IDEAS'};
const MEMBER=[
 {k:'first',label:'FIRST NAME',max:12,strip:NAMECHARS,hint:'SHOWN TO APPROVED MEMBERS ON THE ALPHA ROSTER'},
 {k:'li',label:'LAST INITIAL',max:1,strip:/[^A-Z]/g,hint:'JUST THE FIRST LETTER • NO LAST NAMES COLLECTED'},
 {k:'road',label:'ROAD NAME',max:10,strip:CODECHARS,rnd:true,hint:'THIS IS HOW THE CLUB SEES YOU'},
 {k:'batt',label:'BATTALION NUMBER',max:1,digits:true,one9:true,ph:'1-9',hint:'YOUR BATTALION NUMBER (1-9) • ITS POC APPROVES YOU'},
 {k:'pos',label:'OFFICIAL POSITION',pick:'pos',hint:'ONLY IF YOU HOLD ONE • YOUR POC OR AN OFFICER CONFIRMS IT'},
 {k:'contact',label:'CELL NUMBER',max:15,digits:true,hint:'SHARED WITH APPROVED MEMBERS ON THE ALPHA ROSTER'}
];
const SUPPORTER=[
 {k:'first',label:'FIRST NAME',max:12,strip:NAMECHARS,hint:'SHOWN SMALL NEXT TO YOUR NICKNAME'},
 {k:'user',label:'NICKNAME',max:12,strip:CODECHARS,rnd:true,hint:'HOW YOU LOG IN • THE CLUB SEES YOU AS A SUPPORTER'},
 {k:'loc',label:'YOUR LOCATION',max:28,strip:LOCCHARS,ph:'CITY, STATE',hint:'WHERE YOU’RE CHEERING FROM (CITY, STATE)'}
];
function flow(w){
 const sup=w.data.type==='sup', f=[TYPE,GENDER].concat(sup?SUPPORTER:MEMBER);
 if(!sup) f.push({k:'photo',special:'photo'});
 f.push(MODE);
 f.push({k:'ride',special:'ride'});   // everyone builds a rider + bike (the avatar), whichever clubhouse they picked
 f.push({k:'pin',special:'pin'});
 return f;
}
const FY=94, FH=42;
const stepOf=(w,k)=>flow(w).findIndex(s=>(s.special||s.k)===k);
/* the ride builder (avatar.js) hands back to these steps */
G.SIGNUP={get pin(){ return G.wiz?stepOf(G.wiz,'pin'):0; }, get photo(){ return G.wiz?stepOf(G.wiz,'mode'):0; },
 get builder(){ return G.wiz?stepOf(G.wiz,'ride')+1:0; }, get total(){ return G.wiz?flow(G.wiz).length+1:0; }};
const posName=k=>(G.club&&G.club.posTitle(k))||'';
G.scenes.createacct={
 enter(){
  if(!G.wiz) G.wiz={step:0,data:{type:'',g:'',first:'',li:'',road:'',batt:'',pos:'',contact:'',user:'',loc:'',photo:'',mode:'play',avatar:null},pin:''};
  this.w=G.wiz; this.err=''; this.st={f:0}; this.shake=0; this.busy=false; this.prk=''; this.rolling=false;
  if(!this.w.seen) this.w.seen={};
  const F=flow(this.w);
  if(this.w.step>=F.length) this.w.step=F.length-1;
  if(F[this.w.step].special==='pin'&&!this.w.data.avatar) this.w.step=stepOf(this.w,'mode');
  this.setupStep();
 },
 cur(){ return flow(this.w)[this.w.step]; },
 setupStep(){
  const w=this.w, st=this.cur();
  this.prk='';
  if(st.pick){
   // a tap-to-choose step (no typing)
   G.removeField('f'); G.removeField('pin'); G.removeField('photo'); G.blurFields();
   const B=this.pickL(); this.st={f:st.pick==='type'?Math.max(0,w.data.type==='sup'?1:0):(st.pick==='g'?(w.data.g==='f'?1:0):B.length-1)};
  } else if(!st.special){
   G.removeField('pin'); G.removeField('photo');
   const was=G.fields.f&&G.fields.f.el.inputMode, focused=G.fieldFocused('f');
   G.field('f',{x:22,y:FY,w:226,h:FH,upper:!st.digits,max:st.max,digits:st.digits,strip:st.strip,
    placeholder:st.ph||(st.digits?'CELL NUMBER':(st.k==='li'?'A-Z':'TAP HERE TO TYPE')),value:w.data[st.k]||'',enterHint:'next',onEnter:()=>this.next()});
   // switching letters <-> numbers: refocus so the phone shows the right keyboard
   if(focused&&was!==G.fields.f.el.inputMode){ try{ G.fields.f.el.blur(); G.fields.f.el.focus({preventScroll:true}); }catch(e){} }
   else G.focusField('f');
  } else if(st.special==='photo'){
   G.removeField('f'); G.removeField('pin'); G.blurFields();
   this.placePhoto();
  } else if(st.special==='ride'){
   this.toRide();
  } else {
   G.removeField('f'); G.removeField('photo');
   pinField(pinY(),()=>this.pinDone());
  }
 },
 stepNo(){ const w=this.w, F=flow(w); return F[w.step].special==='pin'?(w.pin?F.length+1:F.length):w.step+1; },
 total(){ return flow(this.w).length+1; },
 /* tap-to-choose steps: who's signing up, official position, interactive vs informational */
 pickL(){
  const st=this.cur(), d=this.w.data;
  if(st.pick==='type') return [
   {id:'type:mem',label:'CLUB MEMBER',sub:'RAGING KNIGHTS FFMC • POC APPROVED',icon:'star',kind:d.type==='mem'?'selected':'secondary',x:22,y:FY,w:226,h:62},
   {id:'type:sup',label:'SUPPORTER',sub:'FRIENDS & FAMILY OF THE CLUB',icon:'heart',kind:d.type==='sup'?'selected':'secondary',x:22,y:FY+72,w:226,h:62}];
  if(st.pick==='g'){
   const h=Math.round(Math.min(112,Math.max(78,(G.VH-FY-150)/2)));
   return [{id:'g:m',label:'MALE',x:22,y:FY,w:226,h,gcard:'m',kind:d.g==='m'?'selected':'secondary'},
    {id:'g:f',label:'FEMALE',x:22,y:FY+h+10,w:226,h,gcard:'f',kind:d.g==='f'?'selected':'secondary'}];
  }
  if(st.pick==='mode'){
   const h=Math.min(92,Math.max(76,(G.VH-FY-150)/2));
   return [{id:'mode:play',x:22,y:FY,w:226,h,card:'play'},{id:'mode:info',x:22,y:FY+h+10,w:226,h,card:'info'},
    {id:'next',label:'NEXT',kind:'primary',x:22,y:FY+2*h+24,w:226,h:40,size:9}];
  }
  return this.posL();
 },
 /* official position: NONE or one of the club's positions (2 columns), then NEXT */
 posL(){
  const opts=[{k:'',t:'NONE'}].concat(G.club?G.club.POSITIONS:[]);
  const bw=(226-8)/2, bh=30, y0=FY, cur=this.w.data.pos||'';
  const B=opts.map((p,i)=>({id:'pos:'+p.k,label:p.t,kind:cur===p.k?'selected':'secondary',x:22+(i%2)*(bw+8),y:y0+Math.floor(i/2)*(bh+6),w:bw,h:bh,size:7}));
  B.push({id:'next',label:'NEXT',kind:'primary',x:22,y:y0+Math.ceil(opts.length/2)*(bh+6)+6,w:226,h:40,size:9});
  return B;
 },
 btns(){
  const w=this.w, st=this.cur(), B=[];
  if(st.pick) return this.pickL();
  const F=flow(w), nx=F[w.step+1], lastField=nx&&(nx.special||nx.pick==='mode');
  B.push({id:'next',label:lastField?(nx.special==='photo'?'NEXT: YOUR HEADSHOT':'NEXT'):'NEXT',kind:'primary',x:22,y:FY+FH+8,w:226,h:40,size:9});
  if(st.rnd) B.push({id:'rnd',label:this.rolling?'FINDING ONE…':(st.k==='user'?'RANDOM NICKNAME':'RANDOM ROAD NAME'),kind:'ghost',x:22,y:FY+FH+54,w:226,h:30,size:7.5});
  return B;
 },
 /* ---- headshot step ---- */
 photoL(){
  const ex=Math.max(0,G.VH-480), d=Math.round(Math.min(150,112+ex*.36)), circY=Math.round(88+ex*.22), by=circY+d+24, has=!!this.w.data.photo;
  const B=has
   ? [{id:'next',label:'NEXT',kind:'primary',x:22,y:by,w:226,h:44,size:9},
      {id:'pick',label:'RETAKE OR CHOOSE ANOTHER',kind:'ghost',x:22,y:by+52,w:226,h:34,size:7.5}]
   : [{id:'pick',label:'TAKE OR CHOOSE A PHOTO',kind:'primary',x:22,y:by,w:226,h:44,size:9},
      {id:'skip',label:'SKIP FOR NOW (ADD IT IN SETTINGS)',kind:'ghost',x:22,y:by+52,w:226,h:30,size:7}];
  return {d,circY,B};
 },
 placePhoto(){
  const b=this.photoL().B.find(q=>q.id==='pick'), k=b.x+','+b.y+','+b.h+','+G.VH;
  if(k===this.prk&&G.fields.photo) return;
  this.prk=k;
  G.fileField('photo',{x:b.x,y:b.y,w:b.w,h:b.h,accept:'image/*',onFile:f=>this.onPhoto(f)});
 },
 onPhoto(file){
  const w=this.w; this.busy=true; this.err='';
  G.photoFromFile(file,192).then(src=>{
   if(G.wiz!==w) return;
   w.data.photo=src; this.busy=false; this.st={f:0}; AUDIO.sfx('cheer');
  }).catch(()=>{
   if(G.wiz!==w) return;
   this.busy=false; this.err='THAT PHOTO COULDN’T BE OPENED - TRY A JPG OR PNG'; AUDIO.sfx('buzzer');
  });
 },
 toRide(){ const w=this.w; G.blurFields(); G.removeField('f'); G.removeField('photo'); w.step=stepOf(w,'mode'); G.go('builder',{draft:true,back:'createacct'}); },
 oskMode(){ const st=this.cur(); return st&&st.digits?'num':'abc'; },
 oskOpts(){ return this.oskMode()==='num'?{kh:Math.round(Math.min(48,Math.max(38,(G.VH-330)/4.4)))}:{}; },
 advance(){
  const w=this.w; w.step++; this.st={f:0};
  if(this.cur().special==='ride'){ this.toRide(); return; }
  this.setupStep();
 },
 next(){
  const w=this.w, st=this.cur();
  if(st.pick){ this.err=''; if(st.pick==='pos') w.data.pos=w.data.pos||''; AUDIO.sfx('ok'); this.advance(); return; }
  const v=G.fieldVal('f').trim().replace(/\s+/g,' ');
  if(!v){ this.err=st.k==='li'?'TYPE THE FIRST LETTER OF YOUR LAST NAME':'PLEASE FILL THIS IN'; AUDIO.sfx('buzzer'); return; }
  if(st.one9&&!/^[1-9]$/.test(v)){ this.err='BATTALIONS ARE NUMBERED 1 TO 9'; AUDIO.sfx('buzzer'); return; }
  if((st.k==='road'||st.k==='user')&&G.roster.accounts.some(a=>a.roadName.toUpperCase()===v.toUpperCase())){ this.err=(st.k==='user'?'THAT USERNAME':'THAT ROAD NAME')+' IS TAKEN ON THIS DEVICE'; AUDIO.sfx('buzzer'); return; }
  if(st.k==='user'&&v.length<3){ this.err='AT LEAST 3 CHARACTERS'; AUDIO.sfx('buzzer'); return; }
  if(st.k==='loc'&&v.replace(/[^A-Z]/g,'').length<2){ this.err='TYPE YOUR CITY AND STATE'; AUDIO.sfx('buzzer'); return; }
  if(st.k==='contact'&&v.length<10){ this.err='ENTER YOUR FULL CELL NUMBER (10+ DIGITS)'; AUDIO.sfx('buzzer'); return; }
  this.err=''; w.data[st.k]=v; AUDIO.sfx('ok');
  this.advance();
 },
 /* a random road name / nickname from the 500 for the rider's gender - never one this device or anyone in the club has */
 async rollName(){
  if(this.rolling) return;
  const w=this.w, d=w.data, st=this.cur(), L=d.g==='f'?DATA.NAMES_F:DATA.NAMES_M;
  const local=new Set(G.roster.accounts.map(a=>String(a.roadName).toUpperCase())), seen=w.seen;
  this.rolling=true; let pick=null;
  for(let i=0;i<14&&!pick;i++){
   const n=L[Math.floor(Math.random()*L.length)];
   if(local.has(n)||seen[n]||n.length>st.max) continue;
   seen[n]=1;
   if(G.club&&await G.club.nameTaken(n)) continue;
   pick=n;
  }
  this.rolling=false;
  if(G.wiz!==w||this.cur()!==st) return;
  if(!pick){ this.err='NO FREE NAME FOUND - TRY AGAIN OR TYPE YOUR OWN'; AUDIO.sfx('buzzer'); return; }
  G.typeInto('f',pick); AUDIO.sfx('card'); this.err='';
 },
 /* MALE / FEMALE sets up the rider (the default hair follows unless they already picked one) */
 applyGender(){
  const d=this.w.data, old=d.avatar, a=Object.assign({},old||{});
  const wasDefault=!old||!old.style||old.style===(old.gender==='f'?'long':'short');
  a.gender=d.g; if(wasDefault) a.style=d.g==='f'?'long':'short';
  if(d.g==='f'&&(!old||!old.face||old.face==='goatee')) a.face='none';
  d.avatar=AV.norm(a);
 },
 pick(id){
  const w=this.w, d=w.data;
  if(id.indexOf('g:')===0){
   const g=id.slice(2);
   if(d.g!==g){ d.g=g; this.applyGender(); w.seen={}; }
   this.err=''; AUDIO.sfx('ok'); this.advance(); return;
  }
  if(id.indexOf('type:')===0){
   const t=id.slice(5);
   if(d.type!==t){ d.type=t; d.mode=t==='sup'?'info':'play'; }   // supporters start informational, members interactive (either can switch)
   this.err=''; AUDIO.sfx('ok'); this.advance(); return;
  }
  if(id.indexOf('mode:')===0){ d.mode=id.slice(5); this.err=''; AUDIO.sfx('blip'); return; }
  if(id.indexOf('pos:')===0){ d.pos=id.slice(4); this.err=''; return; }
  if(id==='next') this.next();
 },
 back(){
  const w=this.w, st=this.cur();
  if(st.special==='pin'){
   if(w.pin){ w.pin=''; G.setField('pin',''); this.err=''; return; }
   G.go('builder',{draft:true,back:'createacct'}); return;
  }
  if(!st.pick&&!st.special) w.data[st.k]=G.fieldVal('f').trim();
  if(w.step===0){ G.wiz=null; G.go('title'); return; }
  w.step--; this.err=''; this.busy=false;
  if(this.cur().special==='ride'){ w.step--; }
  this.setupStep();
 },
 pinDone(){
  const w=this.w, v=G.fieldVal('pin');
  if(v.length!==4) return;
  if(!w.pin){ w.pin=v; G.setField('pin',''); this.err=''; AUDIO.sfx('ok'); }
  else if(w.pin===v) this.finish();
  else { w.pin=''; G.setField('pin',''); this.shake=.4; this.err='PINS DIDN’T MATCH - PICK ONE AGAIN'; AUDIO.sfx('buzzer'); }
 },
 update(dt){
  if(this.shake>0) this.shake=Math.max(0,this.shake-dt);
  const w=this.w, st=this.cur();
  if(G.backHit()){ this.back(); return; }
  if(st.pick){
   const id=G.navList(this.st,this.pickL());
   if(id) this.pick(id);
   return;
  }
  if(!st.special){
   const r=G.osk('f',this.oskMode(),this.oskOpts());
   if(r==='DONE'){ this.next(); return; }
   if(r){ this.err=''; return; }
   const id=G.navList(this.st,this.btns());
   if(id==='next') this.next();
   else if(id==='rnd') this.rollName();
   return;
  }
  if(st.special==='photo'){
   this.placePhoto();
   if(this.busy) return;
   const id=G.navList(this.st,this.photoL().B);
   if(id==='pick'){ const f=G.fields.photo; if(f) try{ f.el.click(); }catch(e){} }
   else if(id==='next') this.advance();
   else if(id==='skip'){ w.data.photo=''; this.advance(); }
   return;
  }
  if(st.special==='pin') pinUpdate(()=>this.pinDone());
 },
 finish(){
  const w=this.w, d=w.data, now=Date.now(), sup=d.type==='sup', g=(d.avatar&&d.avatar.gender)||d.g||'m';
  const id=now.toString(36)+Math.random().toString(36).slice(2,6);
  const acct=sup
   ? {id,type:'sup',first:d.first,roadName:d.user,loc:d.loc,g,mode:d.mode,pinH:G.pinHash(w.pin),created:now,lastLogin:now}
   : {id,first:d.first,li:d.li,roadName:d.road,battalion:d.batt,contact:d.contact,photo:d.photo||'',photoAt:d.photo?now:0,
      pc:d.pos||'',pca:d.pos?now:0,g,mode:d.mode,pinH:G.pinHash(w.pin),created:now,lastLogin:now};
  G.roster.accounts.push(acct); G.saveRoster();
  G.activeAcct=acct; G.saveKey='rka_acct_'+acct.id;
  G.save=G.defSave();
  G.save.roadName=acct.roadName; G.save.tone=sup?'family':'garage'; G.save.mode=d.mode==='info'?'info':'play';
  if(d.avatar) G.save.avatar=d.avatar;
  G.save.seenStatus=G.club?G.club.myStatus().st:'tentative';
  G.persist(); G.updateBoard();
  if(G.club){ G.club.touch(true); G.club.pushRoster(acct,true); G.club.onLogin(); }
  G.wiz=null; G.blurFields();
  AUDIO.jingle('win');
  if(sup){ G.toast('WELCOME, '+acct.roadName+'! THANKS FOR SUPPORTING THE CLUB','#ff9ad0'); G.toast('NEWS, EVENTS, GAMES, THE SHOP AND MORE ARE ALL YOURS','#80e0ff',true); }
  else if(G.clubAccess().ok) G.toast('WELCOME TO THE CLUBHOUSE, '+d.road,'#80ffa0');
  else {
   G.toast('WELCOME, '+d.road+' - YOU’RE TENTATIVE FOR NOW','#d8b050');
   if(G.club&&G.club.db) G.toast('YOUR BATTALION POC HAS BEEN NOTIFIED','#80e0ff',true);   // only true when the club network is there
  }
  if(!sup&&d.pos) G.toast(posName(d.pos)+': YOUR POC OR AN OFFICER CONFIRMS IT','#ffd060',true);
  G.go('club');
 },
 summary(){
  const w=this.w, d=w.data, F=flow(w), done=[];
  if(d.type==='sup'){ if(d.first&&stepOf(w,'first')<w.step) done.push(d.first); if(d.user&&stepOf(w,'user')<w.step) done.push(d.user); if(d.loc&&stepOf(w,'loc')<w.step) done.push(d.loc); }
  else {
   if(d.first&&stepOf(w,'first')<w.step) done.push(d.first+(stepOf(w,'li')<w.step&&d.li?' '+d.li+'.':''));
   if(d.road&&stepOf(w,'road')<w.step) done.push(d.road);
   if(d.batt&&stepOf(w,'batt')<w.step) done.push(G.bn(d.batt));
   if(d.pos&&stepOf(w,'pos')<w.step) done.push(posName(d.pos));
  }
  return done.join(' • ');
 },
 drawTypeCard(c,b,foc){
  const press=G.held(b.x,b.y,b.w,b.h), y=b.y+(press?1:0), on=b.kind==='selected', sup=b.icon==='heart';
  G.rrect(b.x,y,b.w,b.h,14); c.fillStyle=on?'rgba(240,120,24,.2)':(press?'rgba(60,52,72,.95)':'rgba(30,28,40,.95)'); c.fill();
  c.strokeStyle=foc?'#ffd060':(on?'#ffa040':'rgba(255,255,255,.14)'); c.lineWidth=foc||on?2:1; c.stroke();
  c.beginPath(); c.arc(b.x+30,y+b.h/2,19,0,7); c.fillStyle=sup?'rgba(255,154,208,.16)':'rgba(240,120,24,.18)'; c.fill();
  G.icon(b.icon,c,b.x+30,y+b.h/2,20,sup?'#ff9ad0':'#ffb060');
  G.txt(b.label,b.x+58,y+b.h/2-15,9.5,'#f4ede2','left',b.w-80,800);
  G.txt(b.sub,b.x+58,y+b.h/2+4,5.8,'#b8ad9c','left',b.w-76,700);
  G.txt('›',b.x+b.w-14,y+b.h/2-9,12,'#ffb060','center',undefined,800);
 },
 drawGenderCard(c,b,foc){
  const press=G.held(b.x,b.y,b.w,b.h), y=b.y+(press?1:0), on=b.kind==='selected', f=b.gcard==='f', d=this.w.data;
  G.rrect(b.x,y,b.w,b.h,14); c.fillStyle=on?'rgba(240,120,24,.2)':(press?'rgba(60,52,72,.95)':'rgba(30,28,40,.95)'); c.fill();
  c.strokeStyle=foc?'#ffd060':(on?'#ffa040':'rgba(255,255,255,.14)'); c.lineWidth=foc||on?2:1; c.stroke();
  const base=d.avatar&&d.avatar.gender===b.gcard?d.avatar:{}, av=AV.norm(Object.assign({},base,{gender:b.gcard,style:base.style||(f?'long':'short'),face:f?'none':(base.face||'goatee')}));
  const sc=Math.min(1.5,(b.h-10)/48);
  c.save(); G.rrect(b.x+6,y+5,118,b.h-10,10); c.clip(); c.fillStyle='rgba(0,0,0,.25)'; c.fillRect(b.x+6,y+5,118,b.h-10);
  AV.draw(c,b.x+65-36*sc,y+b.h/2-24*sc,sc,av); c.restore();
  G.txt(b.label,b.x+136,y+b.h/2-16,10,on?'#ffd060':'#f4ede2','left',84,800);
  const L=d.type==='sup'?['NICKNAME IDEAS','LIKE '+(f?'RAVEN':'TORCH')]:['ROAD NAME IDEAS','LIKE '+(f?'RAVEN':'TORCH')];
  L.forEach((l,i)=>G.txt(l,b.x+136,y+b.h/2+2+i*11,5.8,'#b8ad9c','left',86,700));
  G.txt('›',b.x+b.w-12,y+b.h/2-9,12,'#ffb060','center',undefined,800);
 },
 drawModeCard(c,b,on){
  const press=G.held(b.x,b.y,b.w,b.h), y=b.y+(press?1:0);
  G.rrect(b.x,y,b.w,b.h,14); c.fillStyle=on?'rgba(240,120,24,.2)':'rgba(30,28,40,.95)'; c.fill();
  c.strokeStyle=on?'#ffa040':'rgba(255,255,255,.14)'; c.lineWidth=on?2:1; c.stroke();
  const play=b.card==='play';
  c.beginPath(); c.arc(b.x+30,y+b.h/2,19,0,7); c.fillStyle=on?'rgba(240,120,24,.3)':'rgba(255,255,255,.06)'; c.fill();
  G.icon(play?'road':'cal',c,b.x+30,y+b.h/2,22,on?'#ffd060':'#ffb060');
  G.txt(play?'INTERACTIVE':'INFORMATIONAL',b.x+58,y+12,9,on?'#ffd060':'#f4ede2','left',140,800);
  const L=play?['WALK THE CLUBHOUSE, MEET THE','CHARACTERS, PLAY THE STORY']:['STRAIGHT TO NEWS, EVENTS,','CHAT AND THE GAMES • NO STORY'];
  L.forEach((l,i)=>G.txt(l,b.x+58,y+30+i*12,6,on?'#f0e2cc':'#b8ad9c','left',150,700));
  c.beginPath(); c.arc(b.x+b.w-16,y+16,6,0,7); c.strokeStyle=on?'#ffd060':'rgba(255,255,255,.35)'; c.lineWidth=1.6; c.stroke();
  if(on){ c.beginPath(); c.arc(b.x+b.w-16,y+16,3.2,0,7); c.fillStyle='#ffd060'; c.fill(); }
 },
 draw(c){
  const VH=G.VH, w=this.w, st=this.cur(), T=this.total();
  G.cover(G.img.bg_charity,0,0,VW,VH); G.dim(.85);
  G.topBar('CREATE ACCOUNT',{right:'STEP '+this.stepNo()+'/'+T});
  const n=this.stepNo(), pw=(VW-28-(T-1)*3)/T;
  for(let i=0;i<T;i++){ G.rrect(14+i*(pw+3),47,pw,4,2); c.fillStyle=i<n?'#f08a2a':'rgba(255,255,255,.14)'; c.fill(); }
  if(st.pick){
   const B=this.pickL();
   G.txt(st.label,VW/2,58,10,'#ffd060','center',VW-20,800);
   G.txt(st.hint,VW/2,78,6.5,'#b8ad9c','center',VW-20);
   B.forEach((b,i)=>{
    if(b.card){ this.drawModeCard(c,b,w.data.mode===b.card); if(this.st.f===i&&G.kbMode){ G.rrect(b.x-3,b.y-3,b.w+6,b.h+6,16); c.strokeStyle='#ffd060'; c.lineWidth=2; c.stroke(); } return; }
    if(b.gcard){ this.drawGenderCard(c,b,this.st.f===i&&G.kbMode); return; }
    if(b.icon){ this.drawTypeCard(c,b,this.st.f===i&&G.kbMode); return; }
    G.button(b,this.st.f===i);
   });
   const by=B[B.length-1].y+B[B.length-1].h, sum=this.summary();
   if(st.pick==='type'){
    ['MEMBERS: THE ALPHA ROSTER, CHATS AND CLUB BOARDS','ONCE YOUR BATTALION POC APPROVES YOU.','SUPPORTERS: PUBLIC NEWS, UPCOMING EVENTS','AND ALL THE GAMES.'].forEach((l,i)=>G.txt(l,VW/2,by+18+i*13+(i>1?6:0),6,i<2?'#b8ad9c':'#ff9ad0','center',VW-20,700));
   } else if(st.pick==='g'){
    ['YOU CAN FINE-TUNE YOUR RIDER (HAIR, FACE, GEAR)','IN THE RIDE BUILDER A FEW STEPS FROM NOW.'].forEach((l,i)=>G.txt(l,VW/2,by+18+i*13,6,'#8a7f70','center',VW-20,700));
   } else if(st.pick==='pos'){
    if(sum) G.txt(sum,VW/2,by+14,6.5,'#cfc4b0','center',VW-24,700);
    ['TITLES LIKE PRESIDENT OR ROAD CAPTAIN SHOW ON THE','POSITIONS CARD ONCE YOUR POC OR AN OFFICER CONFIRMS.','PICK NONE IF YOU DON’T HOLD ONE.'].forEach((l,i)=>G.txt(l,VW/2,by+34+i*13,6,'#8a7f70','center',VW-20,700));
   } else if(sum) G.txt(sum,VW/2,by+14,6.5,'#cfc4b0','center',VW-24,700);
   return;
  }
  if(!st.special){
   const d=w.data;
   G.txt(st.label,VW/2,58,10,'#ffd060','center',VW-20,800);
   G.txt(st.hint,VW/2,78,6.5,'#b8ad9c','center',VW-20);
   G.rrect(22,FY,226,FH,14); c.fillStyle='rgba(0,0,0,.4)'; c.fill();
   const B=this.btns();
   G.drawBtns(B,this.st);
   const by=B[B.length-1].y+B[B.length-1].h;
   if(this.err) G.txt(this.err,VW/2,by+8,7,'#ff7a60','center',VW-20,700);
   const top=G.oskTop(this.oskMode(),this.oskOpts());
   const sum=this.summary(), ny=Math.max(by+24,top-48);
   if(sum&&ny+10<top-20) G.txt(sum,VW/2,ny,6.5,'#cfc4b0','center',VW-24,700);
   if(ny+24<top-20) G.txt(d.type==='sup'?'SUPPORTERS SEE PUBLIC NEWS, EVENTS AND THE GAMES':'YOUR BATTALION POC APPROVES NEW MEMBERS',VW/2,ny+14,6,'#8a7f70','center',VW-20);
   G.oskDraw(c,this.oskMode(),Object.assign({hint:'YOUR PHONE KEYBOARD WORKS • OR TAP THESE KEYS'},this.oskOpts()));
   return;
  }
  if(st.special==='photo'){
   G.txt('HEADSHOT',VW/2,58,10,'#ffd060','center',VW-20,800);
   G.txt('A CLEAR PHOTO OF YOUR FACE FOR THE ALPHA ROSTER',VW/2,76,6.5,'#b8ad9c','center',VW-20);
   const L=this.photoL(), d=L.d, x=VW/2-d/2, y=L.circY;
   if(w.data.photo) G.drawFace(w.data.photo,x,y,d,w.data.road,'#f08a2a');
   else {
    c.beginPath(); c.arc(VW/2,y+d/2,d/2,0,7); c.fillStyle='rgba(255,255,255,.05)'; c.fill();
    c.save(); c.setLineDash([6,5]); c.strokeStyle='rgba(255,160,80,.65)'; c.lineWidth=1.6; c.stroke(); c.restore();
    c.save(); c.beginPath(); c.arc(VW/2,y+d/2,d/2-2,0,7); c.clip();
    G.icon('user',c,VW/2,y+d/2+2,d*.62,'rgba(255,176,96,.38)'); c.restore();
   }
   if(this.busy){
    c.beginPath(); c.arc(VW/2,y+d/2,d/2,0,7); c.fillStyle='rgba(0,0,0,.6)'; c.fill();
    G.txt('PROCESSING…',VW/2,y+d/2-5,7.5,'#ffd060','center',d-10,800);
   }
   G.drawBtns(L.B,this.st);
   const lb=L.B[L.B.length-1], by=lb.y+lb.h;
   if(this.err) G.txt(this.err,VW/2,by+10,7,'#ff7a60','center',VW-20,700);
   else G.txt('GOOD LIGHT • FACE THE CAMERA • NO SUNGLASSES',VW/2,by+12,6.2,'#9a8f80','center',VW-20,700);
   G.txt('ONLY APPROVED MEMBERS CAN SEE IT',VW/2,by+27,6,'#7f7668','center',VW-20);
   return;
  }
  const fy=pinY(), room=fy-14-56, nm=w.data.type==='sup'?w.data.user:w.data.road;
  let ty;
  if(w.data.photo){ const d=Math.max(54,Math.min(88,room-40)); G.drawFace(w.data.photo,VW/2-d/2,56,d,nm,'#f08a2a'); ty=56+d+8; }
  else if(w.data.avatar){ const sc=Math.max(.8,Math.min(1.4,(room-40)/46)); AV.draw(c,VW/2-36*sc,54,sc,w.data.avatar); ty=54+46*sc+2; }
  else { const d=Math.max(54,Math.min(80,room-40)); c.beginPath(); c.arc(VW/2,56+d/2,d/2,0,7); c.fillStyle='rgba(255,154,208,.12)'; c.fill(); G.icon(w.data.type==='sup'?'heart':'user',c,VW/2,56+d/2,d*.5,w.data.type==='sup'?'#ff9ad0':'#ffb060'); ty=56+d+8; }
  G.txt(w.pin?'CONFIRM YOUR PIN':'CREATE A 4-DIGIT PIN',VW/2,ty,10,'#ffd060','center',VW-20,800);
  G.txt(w.pin?'TYPE THE SAME 4 DIGITS AGAIN':(nm?nm+' • ':'')+'YOU’LL ENTER IT TO LOG IN',VW/2,ty+18,6.5,'#cfc4b0','center',VW-20);
  pinDraw(c,fy,this.err,this.shake);
 }
};

/* ============================ DEVICE ADMIN (accounts saved on this phone/tablet) ============================ */
/* Club approvals are NOT done here - battalion POCs approve members in the Alpha Roster. */
const ROWH=78;
G.scenes.admin={
 enter(){
  G.loadRoster();
  this.mode=G.roster.adminPin?'gate':'setup';
  this.first=''; this.err=''; this.ls={f:0,scroll:0}; this.del=null; this.shake=0;
  this.avs={}; for(const a of G.roster.accounts) this.avs[a.id]=acctAvatar(a);
  pinField(pinY(),()=>this.pinDone());
 },
 area(){ return {x:8,y:74,w:254,h:G.VH-74-8}; },
 pinDone(){
  const v=G.fieldVal('pin'); if(v.length!==4) return;
  if(this.mode==='setup'){
   if(!this.first){ this.first=v; G.setField('pin',''); this.err=''; AUDIO.sfx('ok'); }
   else if(this.first===v){ G.roster.adminPin=G.pinHash(v); G.saveRoster(); this.openPanel(); AUDIO.sfx('cheer'); }
   else { this.first=''; G.setField('pin',''); this.shake=.4; this.err='PINS DIDN’T MATCH - START OVER'; AUDIO.sfx('buzzer'); }
  } else {
   if(G.pinHash(v)===G.roster.adminPin){ this.openPanel(); AUDIO.sfx('ok'); }
   else { G.setField('pin',''); this.shake=.4; this.err='WRONG DEVICE ADMIN PIN'; AUDIO.sfx('buzzer'); }
  }
 },
 openPanel(){ G.blurFields(); G.removeField('pin'); this.mode='panel'; this.err=''; },
 update(dt){
  if(this.shake>0) this.shake=Math.max(0,this.shake-dt);
  if(this.mode!=='panel'){
   if(G.backHit()){ G.go('login'); return; }
   pinUpdate(()=>this.pinDone());
   return;
  }
  const A=G.roster.accounts;
  if(this.del){
   const r=this.del.update();
   if(r==='keep'||(r==null&&G.pressed.b)){ this.del=null; return; }
   if(r==='delete'){
    const a=A[this.delI];
    if(G.club) G.club.removeAccount(a);
    try{ localStorage.removeItem('rka_acct_'+a.id); }catch(e){}
    A.splice(this.delI,1); G.saveRoster();
    this.del=null; this.ls.f=Math.max(0,Math.min(this.ls.f,A.length-1)); AUDIO.sfx('crash');
    G.toast('ACCOUNT DELETED','#ff8060');
   }
   return;
  }
  if(G.backHit()){ G.go('login'); return; }
  const ar=this.area();
  const i=G.listNav(this.ls,ar,A.length,ROWH,8);
  if(i<0) return;
  if(this.ls.tx!=null&&this.ls.tx<ar.x+ar.w-90) return; // tapped the info side: just focus that card
  this.delI=i;
  this.del=G.Modal({title:'DELETE '+A[i].roadName+'?',titleCol:'#ff8060',lines:[['REMOVES IT FROM THIS DEVICE AND','#cfc4b0',7.5],['THE ALPHA ROSTER. CAN’T BE UNDONE.','#cfc4b0',7.5]],
   btns:[{id:'keep',label:'KEEP ACCOUNT',kind:'primary'},{id:'delete',label:'DELETE',kind:'danger'}]});
 },
 draw(c){
  const VH=G.VH;
  G.cover(G.img.bg_bikerdown,0,0,VW,VH); G.dim(.86);
  if(this.mode!=='panel'){
   G.topBar('DEVICE ADMIN',{col:'#ff9050'});
   const fy=pinY();
   const t=this.mode==='setup'?(this.first?'CONFIRM THE DEVICE PIN':'SET A DEVICE ADMIN PIN'):'DEVICE ADMIN PIN';
   const cy=Math.max(50,fy-100);
   c.drawImage(G.img.crest_sm,VW/2-19,cy,38,41);
   G.txt(t,VW/2,cy+48,10,'#ffd060','center',VW-20,800);
   G.txt(this.mode==='setup'?'FIRST TIME ON THIS DEVICE: CHOOSE ONE':'MANAGES THE ACCOUNTS SAVED ON THIS DEVICE',VW/2,cy+66,6.5,'#cfc4b0','center',VW-20);
   pinDraw(c,fy,this.err,this.shake);
   return;
  }
  const A=G.roster.accounts, ar=this.area();
  G.topBar('DEVICE ACCOUNTS',{col:'#ff9050',size:8.4});
  G.txt(A.length+' ACCOUNT'+(A.length===1?'':'S')+' SAVED ON THIS DEVICE',VW/2,48,7,'#cfc4b0','center',VW-20,700);
  G.txt('BATTALION POCS APPROVE MEMBERS IN THE ALPHA ROSTER',VW/2,61,5.8,'#9a8f80','center',VW-20,700);
  if(!A.length) G.txt('NO ACCOUNTS YET.',VW/2,ar.y+50,8,'#9a8f80','center');
  c.save(); c.beginPath(); c.rect(0,ar.y,VW,ar.h); c.clip();
  A.forEach((a,i)=>{
   const y=ar.y+i*(ROWH+8)-this.ls.scroll;
   if(y>ar.y+ar.h||y+ROWH<ar.y) return;
   const foc=this.ls.f===i;
   G.rrect(ar.x,y,ar.w,ROWH,12); c.fillStyle='rgba(30,28,40,.96)'; c.fill();
   c.strokeStyle=foc&&G.kbMode?'#ffd060':'rgba(255,255,255,.12)'; c.lineWidth=foc&&G.kbMode?2:1; c.stroke();
   drawAcct(c,a,ar.x+10,y+10,44,this.avs[a.id]);
   G.txt(a.roadName,ar.x+62,y+8,9.5,'#ffd060','left',100,800);
   G.txt(a.type==='sup'?'FRIENDS & FAMILY':[G.nameLine(a),G.bn(a.battalion)].filter(Boolean).join(' • '),ar.x+62,y+27,6.6,'#e8dcc8','left',100,700);
   G.txt(a.type==='sup'?(a.loc||''):'☎ '+(G.club?G.club.fmtPhone(a.contact):a.contact),ar.x+62,y+41,6.4,'#9a8f80','left',100);
   G.statusChip(acctStatus(a),ar.x+62,y+55,{size:5.6});
   G.button({x:ar.x+ar.w-82,y:y+(ROWH-30)/2,w:72,h:30,label:'DELETE',kind:'danger',size:7},foc);
  });
  c.restore();
  G.scrollBar(ar,this.ls.contentH||0,this.ls.scroll);
  if(this.del) this.del.draw(c);
 }
};
})();
