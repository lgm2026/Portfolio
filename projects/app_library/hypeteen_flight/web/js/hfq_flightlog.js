/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* HYPETEEN FLIGHT ACADEMY - THE FLIGHT LOG: every flight a cadet takes, kept like a real pilot's logbook, in two books.
   FLIGHTS (real flights the cadet logs):
     PASSENGER  a flight they rode on (airline, charter, a ride with a family friend): date, from, to, what they flew in,
                seat, what they saw out the window
     TRAINING   a flight they flew or sat in on as a student: date, from, to, aircraft, minutes, landings, what they
                practiced, with an instructor / a discovery flight / observing from the back seat
   SIM SESSIONS (logged by the app itself): every Ground School lesson and checkride flown, and every Landing Challenge.
   Sim time is kept apart and never added to flight time, the way a logbook keeps simulator time in its own column.
   Kid safety: the log stays on this device and is never shared or posted. No names are asked for (an instructor is
   "an instructor"). Airports are codes or city names, notes are short. The Crew Board only ever says "logged a flight".
   Data: G.save.mod.flog = {e:[entry]}  entry = {id,k:'pax'|'dual'|'sim',d:'YYYY-MM-DD',fr,to,ac:{t,d},al,seat,min,ldg,saw:[],did:[],role,note,title,at} */
(function(){
const H=G.HFQ, C=G.C, CL=G.CL, VW=G.VW, PI=Math.PI, D=G.data;
const FL=()=>{ const m=G.save.mod; m.flog=m.flog||{e:[]}; return m.flog; };
const pad=n=>String(n).padStart(2,'0');
const today=()=>{ const d=new Date(); return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()); };
const fmtDate=s=>{ if(!s) return ''; const [y,m,d]=s.split('-'); const M=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']; return +d+' '+(M[+m-1]||'')+' '+y; };
const hhmm=min=>{ const h=Math.floor(min/60), m=min%60; return h+':'+pad(m); };
H.xp=Object.assign(H.xp||{},{logFirst:15,logEntry:5,logDaily:20});

/* what you can fly in */
const PAX_AC=[{t:'BOEING 737',d:'b737'},{t:'AIRBUS A320 / A321',d:'a320'},{t:'BOEING 787',d:'b737'},{t:'AIRBUS A350',d:'a320'},{t:'BOEING 777',d:'b737'},{t:'BOEING 747',d:'b747'},{t:'EMBRAER E175 / E190',d:'b737'},{t:'REGIONAL JET (CRJ)',d:'b737'},{t:'TURBOPROP (Q400, ATR)',d:'pc12'},{t:'SMALL AIRPLANE',d:'c172'},{t:'HELICOPTER',d:'b206'},{t:'NOT SURE',d:'b737'}];
const SAW=['CLOUDS FROM ABOVE','CITY LIGHTS','MOUNTAINS','THE OCEAN','A SUNRISE','A SUNSET','ANOTHER AIRPLANE','THE WING FLEXING','THE FLAPS COME OUT','THE LANDING GEAR','A RIVER OR LAKE','RAIN ON THE WINDOW'];
const DID=['TAXIING','TAKEOFF','CLIMBS + DESCENTS','TURNS','STRAIGHT + LEVEL','SLOW FLIGHT','STALLS','THE PATTERN','LANDINGS','RADIO CALLS','NAVIGATION','CHECKLISTS'];
const ROLES=[['dual','WITH AN INSTRUCTOR'],['disc','DISCOVERY FLIGHT'],['obs','OBSERVER (BACK SEAT)']];
const SEATS=[['window','WINDOW'],['middle','MIDDLE'],['aisle','AISLE']];
const MINS=[20,30,45,60,90,120];
H.flog={
 all(){ return FL().e.slice().sort((a,b)=>(b.d||'').localeCompare(a.d||'')||b.at-a.at); },
 totals(){ const E=FL().e, real=E.filter(e=>e.k!=='sim'), sims=E.filter(e=>e.k==='sim'), ap=new Set(), types=new Set(); let min=0, ldg=0;
  for(const e of real){ if(e.fr) ap.add(e.fr); if(e.to) ap.add(e.to); if(e.ac&&e.ac.t) types.add(e.ac.t); if(e.k==='dual'){ min+=e.min||0; ldg+=e.ldg||0; } }
  return {flights:real.length,pax:real.filter(e=>e.k==='pax').length,dual:real.filter(e=>e.k==='dual').length,min,ldg,airports:ap.size,types:types.size,
   sim:sims.length,simMin:sims.reduce((a,e)=>a+(e.min||0),0),simLdg:sims.reduce((a,e)=>a+(e.ldg||0),0),simLessons:sims.filter(e=>/^LESSON/.test(e.title||'')).length,simChecks:sims.filter(e=>/^CHECKRIDE/.test(e.title||'')).length}; },
 add(e){ e.id=e.id||D.newId(); e.at=Date.now(); FL().e.push(e); G.persist(); if(G.activeAcct){ G.activeAcct.flights=H.flog.totals().flights; G.saveRoster(); } return e; },
 remove(id){ const F=FL(); F.e=F.e.filter(e=>e.id!==id); G.persist(); if(G.activeAcct){ G.activeAcct.flights=H.flog.totals().flights; G.saveRoster(); } },
 /* a real flight the cadet logged: XP (capped per day), badges, a line on the Crew Board */
 logged(e){ const F=FL(), d=H.dayKey?H.dayKey(0):today(); if(F.day!==d){ F.day=d; F.xp=0; } const first=!F.first; let xp=first?H.xp.logFirst:H.xp.logEntry; xp=Math.min(xp,Math.max(0,H.xp.logDaily-F.xp)); F.xp+=xp; F.first=1; G.persist();
  if(xp) G.award(xp,'FLIGHT LOGGED'); G.ach('flightlog'); if(H.flog.totals().flights>=10) G.ach('traveler');
  if(H.feed) H.feed('flog:'+e.k+':'+d,e.k==='pax'?'logged a flight as a passenger':'logged a training flight',{icon:'cal'}); },
 /* the app logs sim flights on its own (lessons, checkrides, the Landing Challenge) */
 sim(o){ const ac=H.myAC?H.myAC():{id:'c172'}, m=H.acById(ac.id); H.flog.add({k:'sim',d:today(),fr:'KHFQ',to:'KHFQ',ac:{t:m.name,d:m.id},min:o.min||5,ldg:o.ldg==null?1:o.ldg,title:o.title||'SIM FLIGHT'}); }
};

/* ============================ THE LOG: two books, kept apart like a real pilot's logbook ============================
   FLIGHTS = real flights (as a passenger, or as a student pilot). SIM SESSIONS = practice in the academy's trainer
   (every lesson, checkride and Landing Challenge logs one by itself). Sim time is never added to flight time. */
const SIMC='#38c9d6', MON=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'], MONTHS=['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
const ROLE_TAG={dual:'STUDENT PILOT',disc:'DISCOVERY FLIGHT',obs:'OBSERVER'};
H.flogTag=e=>e.k==='sim'?['SIM',SIMC]:(e.k==='pax'?['PASSENGER',C.info]:[ROLE_TAG[e.role]||'STUDENT PILOT',C.accentHi]);
const chip=(c,t,x,y,col)=>{ const w=G.tw(t,4.4,800)+8; G.rrect(x,y,w,10,5); c.fillStyle=G.rgba(col,.16); c.fill(); c.strokeStyle=G.rgba(col,.55); c.lineWidth=.8; c.stroke(); G.txt(t,x+w/2,y+2.6,4.4,col,'center',undefined,800); return w; };
function ledgerHead(sim){ return {h:18,draw(c,x,y,w){ G.txt('DATE',x+14,y+5,4.4,C.dim,'center',undefined,800); G.txt(sim?'SESSION':'ROUTE • AIRCRAFT',x+34,y+5,4.4,C.dim,'left',undefined,800); G.txt(sim?'SIM TIME':'TIME',x+w-46,y+5,4.4,C.dim,'right',undefined,800); G.txt('LDG',x+w-10,y+5,4.4,C.dim,'right',undefined,800); c.fillStyle=G.rgba(sim?SIMC:C.accent,.45); c.fillRect(x,y+15,w,1); }}; }
function ledgerRow(e,i){
 const sim=e.k==='sim', T=H.flogTag(e), [yy,mm,dd]=(e.d||'').split('-');
 return {h:40,focus:true,t:e.id,
  draw(c,x,y,w,foc){
   if(i%2){ c.fillStyle='rgba(255,255,255,.035)'; c.fillRect(x,y,w,39); }
   if(foc){ G.rrect(x,y,w,39,6); c.strokeStyle=C.title; c.lineWidth=1.6; c.stroke(); }
   c.fillStyle='rgba(255,255,255,.07)'; c.fillRect(x,y+39,w,1); c.fillRect(x+28,y+4,1,31);
   G.txt(String(+dd||''),x+14,y+6,10,C.ink,'center',24,800); G.txt(MON[+mm-1]||'',x+14,y+25,4.6,C.dim,'center',24,800);
   G.txt(sim?(e.title||'SIM SESSION'):(e.fr||'?')+' → '+(e.to||'?'),x+34,y+6,7.2,C.ink,'left',w-34-78,800);
   const cw=chip(c,T[0],x+34,y+23,T[1]); G.txt(sim?'TRAINER • '+((e.ac&&e.ac.t)||'')+' • '+(e.fr||'KHFQ'):((e.ac&&e.ac.t)||'')+(e.al?' • '+e.al:''),x+38+cw,y+24,4.8,C.sub,'left',w-38-cw-78,700);
   const time=e.k==='pax'?'—':hhmm(e.min||0), ldg=e.k==='pax'?'—':String(e.ldg||0);
   G.txt(time,x+w-46,y+13,7.6,sim?SIMC:(e.k==='pax'?C.dim:C.ink),'right',40,800); G.txt(ldg,x+w-10,y+13,7.6,e.k==='pax'?C.dim:C.ink,'right',24,800);
  },
  tap(){ return {open:e.id}; }, enter(){ return {open:e.id}; }};
}
G.scenes.flightlog={
 enter(a){ a=a||{}; this.back=a.back||'logbook'; const t=a.tab||'fl'; this.book=t==='sim'?'sim':'fl'; this.filter=(t==='pax'||t==='dual')?t:'all'; this.list=CL.List(); this.open=null; this.m=null; if(AUDIO.curName!=='lounge') AUDIO.play('lounge'); },
 filters(){ return [['all','ALL FLIGHTS'],['pax','PASSENGER'],['dual','TRAINING']]; },
 area(){ const top=this.book==='fl'?176:156; return {x:4,y:top,w:VW-8,h:G.VH-top-52}; },
 entries(){ return H.flog.all().filter(e=>this.book==='sim'?e.k==='sim':(e.k!=='sim'&&(this.filter==='all'||e.k===this.filter))); },
 items(){ const I=[], E=this.entries(), sim=this.book==='sim';
  if(!E.length) I.push(CL.note(sim?['NO SIM SESSIONS YET.','EVERY LESSON YOU FLY LOGS ONE HERE,','WITH A TAKEOFF AND A LANDING.']:['NO FLIGHTS LOGGED YET.','RIDDEN ON AN AIRLINER? TAKEN A LESSON?','TAP + LOG A FLIGHT.']));
  else { I.push(ledgerHead(sim)); let last='', i=0; for(const e of E){ const ym=(e.d||'').slice(0,7); if(ym!==last){ last=ym; i=0; const [y,m]=ym.split('-'); I.push(CL.hdr(MONTHS[+m-1]+' '+y,null,sim?SIMC:undefined)); } I.push(ledgerRow(e,i++)); } }
  I.push(CL.text(sim?'Sim sessions log themselves: every lesson, checkride and Landing Challenge you fly. Like a real logbook, sim time is kept apart and never counts as flight time.':'Your flight log stays on this device. The Crew Board only says that you logged a flight, never where.',{size:5.6,col:C.dim}));
  return I; },
 bottomBtn(){ return this.book==='fl'?{id:'add',label:'+ LOG A FLIGHT',kind:'primary',x:12,y:G.VH-46,w:VW-24,h:38,size:8.4}:{id:'fly',label:'FLY A LESSON ▸',kind:'ghost',x:12,y:G.VH-46,w:VW-24,h:38,size:8}; },
 addBtn(){ return this.bottomBtn(); },
 update(){
  if(this.m){ const r=this.m.update(); if(r==='no'||(r==null&&G.pressed.b)){ this.m=null; return; } if(r==='yes'){ H.flog.remove(this.open); this.open=null; this.m=null; G.toast('ENTRY REMOVED',C.info); AUDIO.sfx('ok'); } return; }
  if(this.open){ const e=FL().e.find(q=>q.id===this.open); if(!e){ this.open=null; return; } if(G.backHit()||G.pressed.b){ this.open=null; return; } const S=this.sheet(e);
   if(S.del&&G.clicked(S.del.x,S.del.y,S.del.w,S.del.h)){ this.m=G.confirm({title:'REMOVE THIS FLIGHT?',lines:['IT COMES OFF YOUR LOG FOR GOOD.'],yes:'REMOVE',danger:true}); return; }
   if(G.clicked(S.close.x,S.close.y,S.close.w,S.close.h)||(G.ptr.click&&!G.hit(S.x,S.y,S.w,S.h))){ this.open=null; G.ptr.click=false; } return; }
  if(G.backHit()){ G.go(this.back); return; }
  const bi=G.segHit(12,48,VW-24,24,2); if(bi>=0){ const b=['fl','sim'][bi]; if(b!==this.book){ this.book=b; this.list.reset(); AUDIO.sfx('blip'); } return; }
  if(this.book==='fl'){ const fi=G.segHit(12,150,VW-24,20,3); if(fi>=0){ const f=this.filters()[fi][0]; if(f!==this.filter){ this.filter=f; this.list.reset(); AUDIO.sfx('blip'); } return; } }
  const b=this.bottomBtn(); if(G.clicked(b.x,b.y,b.w,b.h)){ AUDIO.sfx('ok'); if(b.id==='add') G.go('logflight',{back:'flightlog'}); else G.go('path',{back:'flightlog'}); return; }
  this.list.update(this.items(),this.area(),a=>{ if(a&&a.open){ this.open=a.open; AUDIO.sfx('card'); } });
 },
 /* the entry sheet sizes itself to what the entry holds */
 sheetBody(e){ const rows=[]; const add=(k,v)=>{ if(v||v===0) rows.push([k,String(v).toUpperCase()]); };
  add('AIRCRAFT',e.ac&&e.ac.t); if(e.k==='pax'){ add('AIRLINE',e.al); add('SEAT',e.seat); }
  if(e.k==='dual'){ add('FLIGHT TIME',hhmm(e.min||0)+' • '+(e.ldg||0)+' LANDING'+(e.ldg===1?'':'S')); add('FLOWN AS',(ROLES.find(r=>r[0]===e.role)||['','STUDENT'])[1]); }
  if(e.k==='sim'){ add('WHERE','THE ACADEMY TRAINER (SIM) • '+(e.fr||'KHFQ')); add('SIM TIME',hhmm(e.min||0)+' • '+(e.ldg||0)+' LANDING'+(e.ldg===1?'':'S')); }
  const chips=(e.k==='pax'?e.saw:e.did)||[]; let ch=0; if(chips.length){ let cx=0, rowsN=1; for(const t of chips){ const w=G.tw(t,5,800)+10; if(cx+w>VW-48){ cx=0; rowsN++; } cx+=w+4; } ch=12+rowsN*14+6; }
  const noteH=e.note?G.wrap(e.note,6,VW-48,600).length*8.4+6:0, simH=e.k==='sim'?2*8.4+8:0;
  return {rows,chips,ch,noteH,simH,h:48+rows.length*22+ch+noteH+simH+(e.k==='sim'?14:58)}; },
 sheet(e){ const VH=G.VH, B=this.sheetBody(e), h=Math.min(VH-100,Math.max(150,B.h)), y=VH-h-8; return {x:8,y,w:VW-16,h,B,close:{x:VW-44,y:y+6,w:30,h:26},del:e.k==='sim'?null:{x:24,y:y+h-46,w:VW-48,h:36}}; },
 draw(c){
  G.backdrop(.9); const T=H.flog.totals(), VH=G.VH, sim=this.book==='sim', col=sim?SIMC:C.accentHi;
  G.seg(12,48,VW-24,24,['FLIGHTS','SIM SESSIONS'],sim?1:0,6.6);
  // page totals, ruled like a logbook
  G.panel(8,78,VW-16,52,{r:12,border:G.rgba(sim?SIMC:C.accent,.45)});
  const cols=sim?[['SESSIONS',T.sim],['SIM TIME',hhmm(T.simMin)],['LANDINGS',T.simLdg],['LESSONS',T.simLessons],['CHECKRIDES',T.simChecks]]:[['FLIGHTS',T.flights],['TRAINING TIME',hhmm(T.min)],['LANDINGS',T.ldg],['AIRPORTS',T.airports],['AIRCRAFT',T.types]];
  const cw=(VW-32)/cols.length; cols.forEach(([k,v],i)=>{ const x=16+i*cw; G.txt(String(v),x+cw/2,85,11,i===0?col:C.ink,'center',cw-4,800); G.txt(k,x+cw/2,108,4.3,C.dim,'center',cw-4,800); if(i){ c.fillStyle='rgba(255,255,255,.08)'; c.fillRect(x,86,1,34); } });
  G.txt(sim?'PRACTICE IN THE TRAINER • NEVER COUNTED AS FLIGHT TIME':T.pax+' AS A PASSENGER • '+T.dual+' AS A STUDENT PILOT',VW/2,136,5.2,sim?SIMC:C.sub,'center',VW-24,800);
  if(!sim) G.seg(12,150,VW-24,20,this.filters().map(f=>f[1]),this.filters().findIndex(f=>f[0]===this.filter),5.6);
  this.list.draw(c,this.items(),this.area());
  c.fillStyle=G.rgba(C.bg,.95); c.fillRect(0,VH-52,VW,52); G.drawBtns([this.bottomBtn()]);
  if(this.open){ const e=FL().e.find(q=>q.id===this.open); if(e) this.drawSheet(c,e); }
  if(this.m) this.m.draw(c);
  G.topBar('MY FLIGHT LOG',{sub:sim?T.sim+' SIM SESSION'+(T.sim===1?'':'S')+' • '+hhmm(T.simMin):T.flights+' FLIGHT'+(T.flights===1?'':'S')+' • '+hhmm(T.min)+' TRAINING'});
 },
 drawSheet(c,e){ const S=this.sheet(e), B=S.B, sim=e.k==='sim', Tg=H.flogTag(e);
  G.dim(.5); G.panel(S.x,S.y,S.w,S.h,{r:16,border:G.rgba(sim?SIMC:C.accent,.6)}); G.icon('x',c,S.close.x+15,S.close.y+13,12,C.dim);
  const kick={pax:'PASSENGER FLIGHT',dual:'TRAINING FLIGHT',sim:'SIM SESSION'}[e.k]; G.txt(kick+' • '+fmtDate(e.d),S.x+16,S.y+14,5.8,sim?SIMC:C.accentText,'left',S.w-70,800);
  G.txt(sim?(e.title||''):(e.fr||'?')+' → '+(e.to||'?'),S.x+16,S.y+26,10.4,C.title,'left',S.w-32,800);
  if(e.ac&&e.ac.d&&!sim) H.drawAC(c,e.ac.d,S.x+S.w-100,S.y+44,88,44,null,{ground:false,prop:'spin',t:G.time});
  let y=S.y+48; for(const [k,v] of B.rows){ G.txt(k,S.x+16,y,4.8,C.dim,'left',undefined,800); G.txt(v,S.x+16,y+8,6.6,C.ink,'left',sim?S.w-32:S.w-130,800); y+=22; }
  if(B.chips.length){ G.txt(e.k==='pax'?'WHAT I SAW':'WHAT WE PRACTICED',S.x+16,y,4.8,C.dim,'left',undefined,800); y+=10; let cx=S.x+16; for(const ch of B.chips){ const w=G.tw(ch,5,800)+10; if(cx+w>S.x+S.w-16){ cx=S.x+16; y+=14; } G.rrect(cx,y,w,11,5.5); c.fillStyle=G.rgba(C.accent,.16); c.fill(); G.txt(ch,cx+w/2,y+3,5,C.accentHi,'center',undefined,800); cx+=w+4; } y+=20; }
  if(e.note){ G.para(e.note,S.x+16,y,6,C.sub,'left',S.w-32,8.4,600); y+=B.noteH; }
  if(sim){ G.para('Practice in the academy’s trainer. It is logged like a real logbook logs simulator time: in its own column, never added to flight time.',S.x+16,y+2,5.8,SIMC,'left',S.w-32,8.4,700); }
  if(S.del) G.button(Object.assign({},S.del,{label:'REMOVE FROM MY LOG',kind:'danger',size:7}),false);
 }
};

/* ============================ LOG A FLIGHT (the form) ============================ */
G.scenes.logflight={
 enter(a){ a=a||{}; this.back=a.back||'flightlog'; this.step=0; this.k=null; this.e={d:today(),fr:'',to:'',ac:null,al:'',seat:'window',min:60,ldg:1,saw:[],did:[],role:'dual',note:''}; this.pick=null; this.list=null; this.err=''; },
 exit(){ G.clearFields(); },
 kinds(){ const VH=G.VH, h=Math.min(124,(VH-120)/2-10); return [{k:'pax',y:60,h,t:'I FLEW AS A PASSENGER',s:'An airliner, a charter, a ride in a small airplane. Where did you go? What did you see?',icon:'user',d:'b737'},{k:'dual',y:60+h+12,h,t:'I FLEW AS A STUDENT PILOT',s:'A lesson with an instructor, a discovery flight, or watching from the back seat.',icon:'headset',d:'c172'}]; },
 fields(){ const y0=56; return {date:{x:12,y:y0,w:VW-24,h:30},fr:{x:12,y:y0+54,w:(VW-30)/2,h:30},to:{x:18+(VW-30)/2,y:y0+54,w:(VW-30)/2,h:30},ac:{x:12,y:y0+108,w:VW-24,h:40},al:{x:12,y:y0+176,w:VW-24,h:30},next:{x:12,y:G.VH-46,w:VW-24,h:38}}; },
 place(){ const F=this.fields(), e=this.e;
  G.field('d',{x:F.date.x,y:F.date.y,w:F.date.w,h:F.date.h,type:'date',value:e.d,maxDate:today(),align:'center',onInput:v=>{ e.d=v; }});
  G.field('fr',{x:F.fr.x,y:F.fr.y,w:F.fr.w,h:F.fr.h,upper:true,max:14,placeholder:'e.g. KJFK',value:e.fr,primary:false,onInput:v=>{ e.fr=v.toUpperCase(); }});
  G.field('to',{x:F.to.x,y:F.to.y,w:F.to.w,h:F.to.h,upper:true,max:14,placeholder:'e.g. KMYR',value:e.to,primary:false,onInput:v=>{ e.to=v.toUpperCase(); }});
  if(this.k==='pax') G.field('al',{x:F.al.x,y:F.al.y,w:F.al.w,h:F.al.h,upper:true,max:18,placeholder:'AIRLINE (OPTIONAL)',value:e.al,primary:false,onInput:v=>{ e.al=v.toUpperCase(); }}); else G.removeField('al'); },
 acList(){ if(this.k==='pax') return PAX_AC; const L=[]; for(const m of H.AC) L.push({t:m.name,d:m.id}); for(const m of H.HALL.filter(x=>x.cat==='TRAINERS')) L.push({t:m.name,d:m.id}); L.push({t:'HELICOPTER',d:'r22'},{t:'GLIDER',d:'glider'},{t:'OTHER AIRPLANE',d:'c172'}); return L; },
 step2(){ const VH=G.VH, e=this.e, out={chips:[],seg:null,steps:null,role:null,note:{x:12,y:VH-98,w:VW-24,h:44},save:{x:12,y:VH-46,w:VW-24,h:38}}; let y=56;
  if(this.k==='pax'){ out.seg={x:12,y:y+12,w:VW-24,h:24,items:SEATS,label:'SEAT'}; y+=48; out.chipLabel='WHAT DID YOU SEE OUT THE WINDOW?'; }
  else { out.seg={x:12,y:y+12,w:VW-24,h:24,items:MINS.map(m=>[m,m+' MIN']),label:'FLIGHT TIME',key:'min'}; y+=48; out.steps={x:12,y:y+12,w:VW-24,h:28,label:'LANDINGS'}; y+=48; out.role={x:12,y:y+12,w:VW-24,h:24,items:ROLES,label:'I WAS…',key:'role'}; y+=48; out.chipLabel='WHAT DID YOU PRACTICE?'; }
  out.chipY=y+12; const L=this.k==='pax'?SAW:DID, cw=(VW-24-8)/3; L.forEach((t,i)=>out.chips.push({t,x:12+(i%3)*(cw+4),y:out.chipY+Math.floor(i/3)*26,w:cw,h:22})); return out; },
 update(dt){
  const e=this.e;
  if(this.pick){ if(G.backHit()||G.pressed.b){ this.pick=null; G.hideFields(false); return; } this.list.update(this.pick,{x:4,y:46,w:VW-8,h:G.VH-50},a=>{ if(a&&a.ac){ e.ac=a.ac; this.pick=null; G.hideFields(false); AUDIO.sfx('ok'); } }); return; }
  if(G.backHit()){ if(this.step===0){ G.go(this.back); return; } this.step--; G.clearFields(); if(this.step===1) this.place(); return; }
  if(this.step===0){ for(const k of this.kinds()) if(G.clicked(12,k.y,VW-24,k.h)){ this.k=k.k; this.step=1; this.err=''; AUDIO.sfx('ok'); this.place(); return; } return; }
  if(this.step===1){ const F=this.fields();
   if(G.clicked(F.ac.x,F.ac.y,F.ac.w,F.ac.h)){ AUDIO.sfx('blip'); G.hideFields(true); this.list=CL.List(); this.pick=[CL.hdr('WHAT DID YOU FLY IN?',null)].concat(this.acList().map(a=>({h:46,focus:true,t:a.t,draw(c,x,y,w,foc){ G.rrect(x,y+2,w,40,10); c.fillStyle=e.ac&&e.ac.t===a.t?G.rgba(C.accent,.16):C.card; c.fill(); c.strokeStyle=foc?C.title:'rgba(255,255,255,.1)'; c.lineWidth=foc?2:1; c.stroke(); H.drawAC(c,a.d,x+4,y+6,60,32,null,{ground:false}); G.txt(a.t,x+72,y+15,7.2,C.ink,'left',w-80,800); },tap:()=>({ac:a}),enter:()=>({ac:a})}))); return; }
   if(G.clicked(F.next.x,F.next.y,F.next.w,F.next.h)||G.pressed.a){ if(!e.d){ this.err='PICK THE DATE.'; AUDIO.sfx('buzzer'); return; } if(!e.ac){ this.err='PICK WHAT YOU FLEW IN.'; AUDIO.sfx('buzzer'); return; } if(!e.fr.trim()||!e.to.trim()){ this.err='WHERE FROM, AND WHERE TO? A CODE OR A CITY.'; AUDIO.sfx('buzzer'); return; }
    this.err=''; this.step=2; G.clearFields(); AUDIO.sfx('ok'); const S=this.step2(); G.field('note',{x:S.note.x,y:S.note.y,w:S.note.w,h:S.note.h,multiline:true,max:120,align:'left',placeholder:'A NOTE (OPTIONAL). NO REAL NAMES.',value:e.note,onInput:v=>{ e.note=v; }}); return; }
   return; }
  if(this.step===2){ const S=this.step2();
   if(S.seg){ const i=G.segHit(S.seg.x,S.seg.y,S.seg.w,S.seg.h,S.seg.items.length); if(i>=0){ if(S.seg.key==='min') e.min=S.seg.items[i][0]; else e.seat=S.seg.items[i][0]; AUDIO.sfx('blip'); return; } }
   if(S.role){ const i=G.segHit(S.role.x,S.role.y,S.role.w,S.role.h,S.role.items.length); if(i>=0){ e.role=S.role.items[i][0]; AUDIO.sfx('blip'); return; } }
   if(S.steps){ const st=S.steps; if(G.clicked(st.x+st.w-70,st.y,32,st.h)){ e.ldg=Math.max(0,e.ldg-1); AUDIO.sfx('blip'); return; } if(G.clicked(st.x+st.w-34,st.y,32,st.h)){ e.ldg=Math.min(20,e.ldg+1); AUDIO.sfx('blip'); return; } }
   for(const ch of S.chips) if(G.clicked(ch.x,ch.y,ch.w,ch.h)){ const arr=this.k==='pax'?e.saw:e.did, i=arr.indexOf(ch.t); if(i>=0) arr.splice(i,1); else if(arr.length<6) arr.push(ch.t); AUDIO.sfx('blip'); return; }
   if(G.clicked(S.save.x,S.save.y,S.save.w,S.save.h)){ this.save(); return; } }
 },
 save(){ const e=this.e, out={k:this.k,d:e.d,fr:e.fr.trim().slice(0,14),to:e.to.trim().slice(0,14),ac:e.ac,note:(e.note||'').trim().slice(0,120)};
  if(this.k==='pax'){ out.al=e.al.trim().slice(0,18); out.seat=e.seat; out.saw=e.saw.slice(); } else { out.min=e.min; out.ldg=e.ldg; out.did=e.did.slice(); out.role=e.role; }
  H.flog.add(out); H.flog.logged(out); AUDIO.jingle('win'); G.toast('FLIGHT LOGGED',C.good); G.go('flightlog',{back:'logbook',tab:this.k}); },
 draw(c){
  G.backdrop(.9); const e=this.e, VH=G.VH;
  if(this.pick){ this.list.draw(c,this.pick,{x:4,y:46,w:VW-8,h:VH-50}); G.topBar('WHAT DID YOU FLY IN?',{sub:'PICK THE CLOSEST ONE'}); return; }
  if(this.step===0){ for(const k of this.kinds()){ const press=G.held(12,k.y,VW-24,k.h); G.rrect(12,k.y+(press?1:0),VW-24,k.h,14); c.fillStyle=press?C.cardPress:C.card; c.fill(); c.strokeStyle=G.rgba(C.accent,.5); c.lineWidth=1.4; c.stroke();
    H.drawAC(c,k.d,24,k.y+10,110,55,null,{ground:false,prop:'spin',t:G.time,fly:true}); G.txt(k.t,140,k.y+14,8.4,C.title,'left',VW-160,800); G.para(k.s,140,k.y+30,6,C.sub,'left',VW-166,8.4,600); G.txt('TAP TO START ▸',VW-24,k.y+k.h-16,5.6,C.accentText,'right',undefined,800); }
   G.para('Your log stays on this device. Use airport codes or city names, and no real names.',VW/2,VH-44,5.6,C.dim,'center',VW-40,8,700);
   G.topBar('LOG A FLIGHT',{sub:'WHAT KIND OF FLIGHT WAS IT?'}); return; }
  if(this.step===1){ const F=this.fields(); const lab=(t,r)=>G.txt(t,r.x+2,r.y-10,4.8,C.dim,'left',undefined,800);
   lab('DATE',F.date); lab('FROM',F.fr); lab('TO',F.to); lab('WHAT YOU FLEW IN',F.ac);
   G.rrect(F.ac.x,F.ac.y,F.ac.w,F.ac.h,10); c.fillStyle=C.card; c.fill(); c.strokeStyle=e.ac?G.rgba(C.accent,.6):'rgba(255,255,255,.14)'; c.lineWidth=1.2; c.stroke();
   if(e.ac){ H.drawAC(c,e.ac.d,F.ac.x+4,F.ac.y+4,60,32,null,{ground:false}); G.txt(e.ac.t,F.ac.x+72,F.ac.y+14,7.4,C.ink,'left',F.ac.w-84,800); } else G.txt('TAP TO PICK AN AIRCRAFT ▸',F.ac.x+F.ac.w/2,F.ac.y+14,7,C.accentText,'center',undefined,800);
   if(this.k==='pax') lab('AIRLINE',F.al);
   if(this.err) G.para(this.err,VW/2,VH-70,6,C.bad,'center',VW-30,8.4,800);
   G.button(Object.assign({},F.next,{label:'NEXT ▸',kind:'primary',size:8.4}),false);
   G.topBar(this.k==='pax'?'PASSENGER FLIGHT':'TRAINING FLIGHT',{sub:'STEP 1 OF 2 • THE BASICS'}); return; }
  const S=this.step2();
  const lab=(t,r)=>G.txt(t,r.x+2,r.y-9,4.8,C.dim,'left',undefined,800);
  if(S.seg){ lab(S.seg.label,S.seg); G.seg(S.seg.x,S.seg.y,S.seg.w,S.seg.h,S.seg.items.map(q=>q[1]),S.seg.items.findIndex(q=>q[0]===(S.seg.key==='min'?e.min:e.seat)),S.seg.key==='min'?5.4:6.2); }
  if(S.steps){ const st=S.steps; lab(st.label,st); G.rrect(st.x,st.y,st.w,st.h,8); c.fillStyle=C.card; c.fill(); G.txt(e.ldg+' LANDING'+(e.ldg===1?'':'S'),st.x+12,st.y+9,7.4,C.ink,'left',undefined,800);
   for(const [dx,t] of [[st.w-70,'−'],[st.w-34,'+']]){ G.rrect(st.x+dx,st.y+2,32,st.h-4,7); c.fillStyle=C.btn||'#1c1c1f'; c.fill(); c.strokeStyle='rgba(255,255,255,.2)'; c.lineWidth=1; c.stroke(); G.txt(t,st.x+dx+16,st.y+6,10,C.accentHi,'center',undefined,800); } }
  if(S.role){ lab(S.role.label,S.role); G.seg(S.role.x,S.role.y,S.role.w,S.role.h,S.role.items.map(q=>q[1]),S.role.items.findIndex(q=>q[0]===e.role),5.2); }
  G.txt(S.chipLabel,14,S.chipY-9,4.8,C.dim,'left',undefined,800);
  const arr=this.k==='pax'?e.saw:e.did; for(const ch of S.chips){ const on=arr.includes(ch.t); G.rrect(ch.x,ch.y,ch.w,ch.h,8); c.fillStyle=on?G.rgba(C.accent,.22):C.card; c.fill(); c.strokeStyle=on?C.accentHi:'rgba(255,255,255,.12)'; c.lineWidth=on?1.6:1; c.stroke(); G.txt(ch.t,ch.x+ch.w/2,ch.y+7,4.6,on?C.accentHi:C.sub,'center',ch.w-6,800); }
  G.txt('NOTE',14,S.note.y-9,4.8,C.dim,'left',undefined,800);
  G.button(Object.assign({},S.save,{label:'SAVE TO MY LOG',kind:'primary',size:8.4}),false);
  G.topBar(this.k==='pax'?'PASSENGER FLIGHT':'TRAINING FLIGHT',{sub:'STEP 2 OF 2 • THE DETAILS'});
 }
};

G.cardSub.flightlog=()=>{ const T=H.flog.totals(); return T.flights+(T.flights===1?' FLIGHT':' FLIGHTS')+' • '+T.sim+' SIM'; };
/* ============================ HOOKS: the app logs sim flights ============================ */
/* called from the lesson engine and the Landing Challenge (see hfq_lessons.js finish(), hfq_g_landing.js done()) */
H.simFlight=function(o){ try{ H.flog.sim(o); }catch(e){ console.warn(e); } };
})();
