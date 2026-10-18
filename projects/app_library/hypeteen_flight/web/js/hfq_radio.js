/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* HYPETEEN FLIGHT ACADEMY - THE RADIO: today's weather (METAR + ATIS), the tower's voice, and CALL THE TOWER.
   The academy's home airport (H.FIELD in hfq_version.js: ACADEMY FIELD, identifier KHFQ) is made up. Its weather is generated once a day; the ATIS letter
   changes every hour like the real thing, and the runway in use follows the wind (runway 27 or runway 9).
   Phraseology follows the FAA AIM (ch. 4) and the controller's handbook (JO 7110.65): taxi clearances give the
   runway first, then the route and any hold short; pilots read back runway assignments and hold short instructions.
   Flight categories (aviationweather.gov / NWS): VFR ceiling > 3,000 ft and vis > 5 SM; MVFR 1,000-3,000 ft
   and/or 3-5 SM; IFR 500 to under 1,000 ft and/or 1 to under 3 SM; LIFR under 500 ft and/or under 1 SM.
   The ceiling is the lowest BROKEN or OVERCAST layer. The worse of ceiling and visibility sets the category.
   API (G.HFQ):
     H.wx.today()            {metar, wdir, wspd, rwy, letter, ...} for this hour
     H.wx.make(rand, o)      a random weather report (o.cat:'VFR'|'MVFR'|'IFR'|'LIFR')
     H.wx.cat(w)             its flight category;  H.wx.metar(w) the METAR string;  H.wx.parts(w) the METAR tokens
     H.say(msg, who)         speak {t, s} or text with the phone's own voice (Settings: TOWER VOICE); H.sayStop()
     H.R                     radio phrase builders: rt(), D() digits, ALT() altitudes, cs() your call sign
     H.RadioFlow             the step engine shared by CALL THE TOWER and the Departure/Arrival games */
(function(){
const H=G.HFQ, C=G.C, VW=G.VW, PI=Math.PI, FN=H.FIELD.call;   // FN: the field's name on the radio ("ACADEMY GROUND")
const PH=['ALFA','BRAVO','CHARLIE','DELTA','ECHO','FOXTROT','GOLF','HOTEL','INDIA','JULIETT','KILO','LIMA','MIKE','NOVEMBER','OSCAR','PAPA','QUEBEC','ROMEO','SIERRA','TANGO','UNIFORM','VICTOR','WHISKEY','X-RAY','YANKEE','ZULU'];
H.PHONETIC=PH;
const pick=(r,a)=>a[Math.floor(r()*a.length)];
function rng(seed){ let s=(seed>>>0)||7; return ()=>{ s^=s<<13; s>>>=0; s^=s>>>17; s^=s<<5; s>>>=0; return (s%1000003)/1000003; }; }
H.rng=rng;

/* ============================ RADIO WORDS ============================ */
const NUM=['zero','one','two','three','four','five','six','seven','eight','niner'];
const sayDigits=x=>String(x).replace(/,/g,'').split('').map(ch=>ch==='.'?'point':(/\d/.test(ch)?NUM[+ch]:(ch===' '?'':ch))).filter(Boolean).join(' ');
function altWords(n){ const th=Math.floor(n/1000), hu=Math.round((n%1000)/100); let s=''; if(th) s+=(th>=10?sayDigits(th):NUM[th].replace('niner','nine'))+' thousand'; if(hu) s+=(s?' ':'')+NUM[hu].replace('niner','nine')+' hundred'; return s||'zero'; }
const R=H.R={
 rt(...parts){ let t='',s=''; for(const p of parts){ if(p==null) continue; if(typeof p==='string'){ t+=p; s+=p; } else { t+=p.t; s+=p.s; } } return {t,s:s.toLowerCase()}; },
 D:x=>({t:String(x),s:' '+sayDigits(x)+' '}),
 ALT:n=>({t:n.toLocaleString('en-US'),s:' '+altWords(n)+' '}),
 cs:()=>{ const n=(G.who&&G.who())||'CADET'; return {t:n,s:n.toLowerCase()}; },
 VIS:v=>{ const wh=Math.floor(v), fr=v-wh, fw={.25:'one quarter',.5:'one half',.75:'three quarters'}[fr]; return {t:fmtVis(v),s:' '+(wh?sayDigits(wh)+(fw?' and '+fw:''):fw)+' '}; },
 say:sayDigits
};

/* ============================ WEATHER ============================ */
const VIS={VFR:[10,10,10,7,6],MVFR:[4,5,3],IFR:[2,1.5,1],LIFR:[.75,.5,.25]};
const fmtVis=v=>v>=1?(v%1?Math.floor(v)+' '+({.5:'1/2',.25:'1/4',.75:'3/4'})[v%1]:String(v)):({.5:'1/2',.25:'1/4',.75:'3/4'})[v];
const pad=(n,k)=>String(Math.abs(Math.round(n))).padStart(k,'0');
const WX=H.wx={
 cat(w){ const ceil=WX.ceiling(w)==null?1e9:WX.ceiling(w), v=w.vis;
  if(ceil<500||v<1) return 'LIFR'; if(ceil<1000||v<3) return 'IFR'; if(ceil<=3000||v<=5) return 'MVFR'; return 'VFR'; },
 ceiling(w){ const c=w.clouds.find(l=>l.c==='BKN'||l.c==='OVC'); return c?c.h:null; },
 /* a random report. o.cat picks the flight category; o.lim:'ceil'|'vis' picks which one is the limiting factor */
 make(r,o){
  o=o||{}; const cat=o.cat||pick(r,['VFR','VFR','MVFR','IFR','LIFR']);
  const w={station:'KHFQ',cat,wx:'',clouds:[]};
  // wind: westerly most days. dir in tens of degrees, never straight across the runway
  if(o.calm||r()<.06){ w.wdir=0; w.wspd=0; }
  else { w.wdir=(r()<(o.west==null?.72:o.west)?200+Math.floor(r()*15)*10:30+Math.floor(r()*13)*10); w.wspd=3+Math.floor(r()*(cat==='VFR'?16:20)); if(w.wspd>=10&&r()<.3) w.gust=w.wspd+10+Math.floor(r()*6); }
  const lim=o.lim||(r()<.5?'ceil':'vis');
  // visibility + ceiling for the category (values stay clear of the borderlines)
  const good={vis:pick(r,VIS.VFR)}, layerH=k=>Math.round(k/100)*100;
  if(cat==='VFR'){ w.vis=good.vis; const n=Math.floor(r()*3); const used=[]; for(let i=0;i<n;i++){ const h=layerH(3500+r()*16000); if(used.includes(h)) continue; used.push(h); w.clouds.push({c:pick(r,i===n-1&&r()<.4?['BKN','SCT']:['FEW','SCT']),h}); } }
  else {
   const ceilFor={MVFR:()=>layerH(1200+r()*1600),IFR:()=>layerH(600+r()*300),LIFR:()=>layerH(200+r()*200)}[cat];
   if(lim==='ceil'){ w.vis=cat==='MVFR'?pick(r,[7,10,6]):(cat==='IFR'?pick(r,[4,6,7]):pick(r,[2,1.5,4])); w.clouds.push({c:pick(r,['BKN','OVC']),h:ceilFor()}); }
   else { w.vis=pick(r,VIS[cat]); if(r()<.5) w.clouds.push({c:pick(r,['FEW','SCT']),h:layerH(cat==='MVFR'?4000+r()*4000:(cat==='IFR'?1500+r()*2500:600+r()*900))}); else w.clouds.push({c:'BKN',h:layerH(cat==='LIFR'?3500+r()*3000:4000+r()*5000)}); }
   if(w.vis<7) w.wx=w.vis<.75?'FG':(w.vis<=4?pick(r,['BR','-RA','RA','BR','HZ']):pick(r,['BR','HZ','-RA']));
   if(r()<.4&&cat!=='LIFR') w.clouds.push({c:'OVC',h:layerH(Math.max(WX.ceiling(w)||0,w.clouds[0].h)+2000+r()*4000)});
  }
  w.clouds.sort((a,b)=>a.h-b.h);
  w.temp=Math.round(o.temp!=null?o.temp:(cat==='VFR'?8+r()*24:4+r()*20)); w.dew=w.temp-(w.wx==='FG'?0:(w.wx==='BR'||w.wx.indexOf('RA')>=0?1+Math.floor(r()*3):3+Math.floor(r()*12)));
  if(r()<.12){ w.temp=-Math.floor(r()*6); w.dew=w.temp-2; if(w.wx.indexOf('RA')>=0) w.wx='-SN'; }
  w.alt=2970+Math.floor(r()*60);
  const now=new Date(); w.day=now.getUTCDate(); w.hr=now.getUTCHours();
  w.cat=WX.cat(w);
  return w;
 },
 parts(w){
  const P=[]; P.push({k:'station',t:w.station}); P.push({k:'time',t:pad(w.day,2)+pad(w.hr,2)+'53Z'});
  P.push({k:'wind',t:w.wspd===0?'00000KT':pad(w.wdir,3)+pad(w.wspd,2)+(w.gust?'G'+pad(w.gust,2):'')+'KT'});
  P.push({k:'vis',t:fmtVis(w.vis)+'SM'}); if(w.wx) P.push({k:'wx',t:w.wx});
  if(!w.clouds.length) P.push({k:'sky',t:'CLR'}); else w.clouds.forEach(l=>P.push({k:'sky',t:l.c+pad(l.h/100,3),l}));
  const T=v=>(v<0?'M':'')+pad(v,2); P.push({k:'temp',t:T(w.temp)+'/'+T(w.dew)}); P.push({k:'alt',t:'A'+w.alt});
  return P; },
 metar(w){ return WX.parts(w).map(p=>p.t).join(' '); },
 metarLines(m,max){ const out=[]; let line=''; for(const tok of m.split(' ')){ if((line+' '+tok).trim().length>max){ out.push(line.trim()); line=tok; } else line+=' '+tok; } if(line.trim()) out.push(line.trim()); return out; },
 /* what each piece means, for kids */
 explain(p,w){
  switch(p.k){
   case 'station': return p.t+' is the airport: four letters. K means the United States.';
   case 'time': return 'Day '+p.t.slice(0,2)+' of the month, '+p.t.slice(2,4)+':'+p.t.slice(4,6)+' Zulu (UTC) time.';
   case 'wind': return w.wspd===0?'Calm: no wind.':'Wind FROM '+pad(w.wdir,3)+'° at '+w.wspd+' knots'+(w.gust?', gusting to '+w.gust:'')+'.';
   case 'vis': return 'Visibility: you can see '+fmtVis(w.vis)+' statute mile'+(w.vis===1?'':'s')+'.';
   case 'wx': return ({BR:'BR = mist.',FG:'FG = fog.','-RA':'-RA = light rain.',RA:'RA = rain.',HZ:'HZ = haze.','-SN':'-SN = light snow.'})[p.t]||p.t;
   case 'sky': return p.t==='CLR'?'CLR: no clouds below 12,000 feet.':({FEW:'FEW',SCT:'SCATTERED',BKN:'BROKEN',OVC:'OVERCAST'})[p.l.c]+' clouds at '+p.l.h.toLocaleString('en-US')+' feet.'+((p.l.c==='BKN'||p.l.c==='OVC')?' BROKEN or OVERCAST makes a ceiling.':'');
   case 'temp': return 'Temperature '+w.temp+'°C, dew point '+w.dew+'°C.'+(w.temp-w.dew<=2?' Close together: watch for fog!':'');
   case 'alt': return 'Altimeter setting: '+String(w.alt).slice(0,2)+'.'+String(w.alt).slice(2)+' inches of mercury.';
  }
  return '';
 },
 dayIndex(){ const d=new Date(); return Math.floor((d.getTime()-d.getTimezoneOffset()*60000)/86400000); },
 /* today's weather at the academy's field: VFR (sometimes MVFR), same all day; the ATIS letter changes hourly */
 today(){
  const di=WX.dayIndex(), hr=new Date().getUTCHours(), key=di+':'+hr;
  if(WX._t&&WX._t.key===key) return WX._t;
  const r=rng(di*7919+13), w=WX.make(r,{cat:r()<.82?'VFR':'MVFR',lim:'ceil'});
  w.letter=PH[(di*5+hr)%26]; w.rwy=(w.wspd===0||w.wdir>180)?'27':'9'; w.rwyOther=w.rwy==='27'?'9':'27';
  w.metar=WX.metar(w); w.key=key; WX._t=w; return w;
 },
 /* the ATIS broadcast for a report */
 atis(w){ const {rt,D,ALT}=R, sky=w.clouds.length?w.clouds.map(l=>rt(({FEW:'FEW CLOUDS AT ',SCT:'SCATTERED CLOUDS AT ',BKN:'CEILING ',OVC:'CEILING '})[l.c],ALT(l.h),(l.c==='BKN'?' BROKEN':(l.c==='OVC'?' OVERCAST':'')))):[rt('SKY CLEAR')];
  const parts=[rt(FN+' FIELD INFORMATION ',w.letter,'. '),rt(D(pad(w.hr,2)+'53'),' ZULU. '),
   w.wspd===0?rt('WIND CALM. '):rt('WIND ',D(pad(w.wdir,3)),' AT ',D(w.wspd),w.gust?rt(' GUSTS ',D(w.gust)):null,'. '),
   rt('VISIBILITY ',R.VIS(w.vis),'. ')];
  sky.forEach(s=>parts.push(rt(s,'. ')));
  parts.push(rt('TEMPERATURE ',w.temp<0?'MINUS ':'',D(Math.abs(w.temp)),', DEW POINT ',w.dew<0?'MINUS ':'',D(Math.abs(w.dew)),'. '),rt('ALTIMETER ',D(w.alt),'. '),
   rt('LANDING AND DEPARTING RUNWAY ',D(w.rwy||'27'),'. '),rt('ADVISE ON INITIAL CONTACT YOU HAVE INFORMATION ',w.letter,'.'));
  return rt(...parts); }
};
H.radioRwy=()=>WX.today().rwy;

/* ============================ THE VOICE ============================ */
let VOICE=null;
function voice(){ if(VOICE) return VOICE; const S=window.speechSynthesis; if(!S) return null; const vs=S.getVoices()||[];
 VOICE=vs.find(v=>/en[-_]US/i.test(v.lang)&&/google|samantha|alex|aria|jenny|guy/i.test(v.name))||vs.find(v=>/en[-_]US/i.test(v.lang))||vs.find(v=>/^en/i.test(v.lang))||null; return VOICE; }
if(window.speechSynthesis&&window.speechSynthesis.addEventListener) window.speechSynthesis.addEventListener('voiceschanged',()=>{ VOICE=null; });
H.voiceOn=()=>!!window.speechSynthesis&&G.setting&&G.setting('voice');
/* speak a radio message. who: 'atc' (controller) | 'pilot' | 'atis'. Returns an estimated duration in seconds */
H.say=function(msg,who,onEnd){
 const text=typeof msg==='string'?msg.toLowerCase():msg.s, est=Math.max(1.2,text.split(/\s+/).length*.36);
 if(!H.voiceOn()){ if(onEnd) setTimeout(onEnd,est*1000*.6); return est*.6; }
 try{ const S=window.speechSynthesis, u=new SpeechSynthesisUtterance(text.replace(/\s+/g,' ').trim());
  const v=voice(); if(v) u.voice=v; u.lang=(v&&v.lang)||'en-US';
  u.rate=who==='pilot'?1.04:(who==='atis'?1.0:1.1); u.pitch=who==='pilot'?1.2:(who==='atis'?.85:.92); u.volume=1;
  u.onstart=()=>AUDIO.sfx('squelch'); u.onend=()=>{ AUDIO.sfx('squelch'); if(onEnd) onEnd(); };
  S.speak(u); }catch(e){ if(onEnd) setTimeout(onEnd,est*1000); }
 return est; };
H.sayStop=function(){ try{ if(window.speechSynthesis) window.speechSynthesis.cancel(); }catch(e){} };

/* ============================ FREQUENCIES + PLACES ============================ */
const FREQ={atis:{f:'127.25',n:FN+' ATIS',short:'ATIS'},ground:{f:'121.70',n:FN+' GROUND',short:'GROUND'},tower:{f:'118.30',n:FN+' TOWER',short:'TOWER'}};
H.FREQ=FREQ;
const WHERE={ramp:'AT THE PARKING STAND',hangar:'AT THE HANGAR',wash:'AT THE WASH RACK',runway:'HOLDING SHORT RUNWAY',tower:'AT THE PARKING STAND',lounge:'AT THE PARKING STAND',classroom:'AT THE PARKING STAND',platform:'AT THE PARKING STAND'};
H.whereFor=room=>WHERE[room]||'AT THE PARKING STAND';

/* ============================ THE CALLS ============================
   Each call is 4 slots (who you're calling, who you are, where you are, what you want), the controller's
   reply, and readback choices. Built fresh from today's weather. */
H.callDefs=function(room){
 const {rt,D,ALT,cs}=R, w=WX.today(), rwy=w.rwy, oth=w.rwyOther, L=w.letter, me=cs(), here=H.whereFor(room);
 const others=PH.filter(x=>x!==L), lw=[others[(PH.indexOf(L)+3)%25],others[(PH.indexOf(L)+11)%25]];
 const dw=rwy==='27'?'LEFT':'RIGHT', dwo=dw==='LEFT'?'RIGHT':'LEFT', turn=rwy==='27'?'RIGHT':'LEFT', exitTwy=rwy==='27'?'ALPHA 3':'ALPHA 2';
 const wind=w.wspd===0?rt('WIND CALM, '):rt('WIND ',D(pad(w.wdir,3)),' AT ',D(w.wspd),', ');
 const slot=(ok,bad,why)=>({ok,opts:G.shuffle([ok].concat(bad)),why});
 return {
  radiocheck:{freq:['ground','tower'],label:'RADIO CHECK',sub:'MAKE SURE THEY CAN HEAR YOU',
   slots:fq=>[slot(FREQ[fq].n,[FREQ[fq==='ground'?'tower':'ground'].n,FN+' ATIS'],'You’re tuned to '+FREQ[fq].short+', so call '+FREQ[fq].n+'.'),slot(me.t,['ROGER','WILCO'],'Say who YOU are: your call sign.'),slot(room==='runway'?here+' '+rwy:here,[room==='hangar'?'AT THE WASH RACK':'AT THE HANGAR','IN THE CLOUDS'],'Say where you are right now.'),slot('RADIO CHECK',['CLEARED FOR TAKEOFF','SAY AGAIN'],'Ask for a RADIO CHECK.')],
   reply:fq=>rt(me,', ',FREQ[fq].n,', LOUD AND CLEAR.'),readback:null},
  taxi:{freq:['ground'],label:'READY TO TAXI',sub:'ASK GROUND FOR A TAXI CLEARANCE',
   slots:()=>[slot(FN+' GROUND',[FN+' TOWER',FN+' ATIS'],'Airplanes on the ground talk to GROUND.'),slot(me.t,['ROGER',FN+' GROUND'],'Say who YOU are: your call sign.'),slot(here,[room==='hangar'?'AT THE WASH RACK':'AT THE HANGAR','ON FINAL'],'Say where your airplane is.'),slot('READY TO TAXI WITH '+L,['READY TO TAXI WITH '+lw[0],'READY TO TAXI WITH '+lw[1]],'Use today’s ATIS letter: '+L+'. Tune ATIS to hear it.')],
   reply:()=>rt(me,', '+FN+' GROUND, RUNWAY ',D(rwy),', TAXI VIA ALPHA, HOLD SHORT OF RUNWAY ',D(rwy),'.'),
   readback:()=>[{t:rt('RUNWAY ',D(rwy),', TAXI VIA ALPHA, HOLD SHORT OF RUNWAY ',D(rwy),', ',me),ok:1},
    {t:rt('TAXI VIA ALPHA, ',me),why:'Read back the RUNWAY and the HOLD SHORT. Every time.'},
    {t:rt('RUNWAY ',D(oth),', TAXI VIA ALPHA, HOLD SHORT OF RUNWAY ',D(oth),', ',me),why:'Wrong runway. Ground said runway '+rwy+'.'}]},
  depart:{freq:['tower'],label:'READY FOR DEPARTURE',sub:'AT THE HOLD-SHORT LINE',rooms:['runway'],
   slots:()=>[slot(FN+' TOWER',[FN+' GROUND',FN+' ATIS'],'The runway belongs to TOWER.'),slot(me.t,['ROGER',FN+' TOWER'],'Say who YOU are: your call sign.'),slot('HOLDING SHORT RUNWAY '+rwy,['HOLDING SHORT RUNWAY '+oth,'AT THE PARKING STAND'],'You’re waiting at the hold-short line for runway '+rwy+'.'),slot('READY FOR DEPARTURE',['READY TO TAXI','INBOUND FOR LANDING'],'Tell tower you’re READY FOR DEPARTURE.')],
   reply:()=>rt(me,', '+FN+' TOWER, ',wind,'RUNWAY ',D(rwy),', CLEARED FOR TAKEOFF.'),
   readback:()=>[{t:rt('RUNWAY ',D(rwy),', CLEARED FOR TAKEOFF, ',me),ok:1},
    {t:rt('CLEARED TO LAND RUNWAY ',D(rwy),', ',me),why:'That’s a LANDING clearance. You were cleared for TAKEOFF.'},
    {t:rt('ROGER, ',me),why:'Read back the runway with a takeoff clearance, so everyone knows you’re on the right one.'}]},
  inbound:{freq:['tower'],label:'INBOUND FOR LANDING',sub:'PRACTICE: YOU’RE 10 MILES OUT',
   slots:()=>[slot(FN+' TOWER',[FN+' GROUND',FN+' ATIS'],'Airplanes in the air near the field talk to TOWER.'),slot(me.t,['ROGER',FN+' TOWER'],'Say who YOU are: your call sign.'),slot('10 MILES SOUTH, 2,500',['AT THE PARKING STAND','HOLDING SHORT RUNWAY '+rwy],'Say where you are: distance, direction and altitude.'),slot('INBOUND FOR LANDING WITH '+L,['INBOUND FOR LANDING WITH '+lw[0],'READY FOR DEPARTURE'],'Say what you want, with today’s ATIS letter: '+L+'.')],
   pilotSay:()=>rt(FN+' TOWER, ',me,', ',D(10),' MILES SOUTH, ',ALT(2500),', INBOUND FOR LANDING WITH ',L,'.'),
   reply:()=>rt(me,', '+FN+' TOWER, ENTER ',dw,' DOWNWIND RUNWAY ',D(rwy),', REPORT MIDFIELD.'),
   readback:()=>[{t:rt(dw,' DOWNWIND RUNWAY ',D(rwy),', REPORT MIDFIELD, ',me),ok:1},
    {t:rt(dwo,' DOWNWIND RUNWAY ',D(rwy),', REPORT MIDFIELD, ',me),why:'Tower said '+dw+' downwind: '+dw+' turns around the pattern.'},
    {t:rt('STRAIGHT IN RUNWAY ',D(rwy),', ',me),why:'Tower asked you to enter the '+dw+' DOWNWIND, not to fly straight in.'}]},
  /* used by the Arrival game */
  midfield:{freq:['tower'],label:'MIDFIELD DOWNWIND',
   slots:()=>[slot(FN+' TOWER',[FN+' GROUND',FN+' ATIS'],'You’re still talking to TOWER.'),slot(me.t,['ROGER','WILCO'],'Say who YOU are: your call sign.'),slot('MIDFIELD '+dw+' DOWNWIND',['ON FINAL','HOLDING SHORT RUNWAY '+rwy],'Tower asked you to report MIDFIELD on the downwind.'),slot('RUNWAY '+rwy,['RUNWAY '+oth,'READY TO TAXI'],'Say the runway: '+rwy+'.')],
   reply:()=>rt(me,', RUNWAY ',D(rwy),', ',wind,'CLEARED TO LAND.'),
   readback:()=>[{t:rt('RUNWAY ',D(rwy),', CLEARED TO LAND, ',me),ok:1},
    {t:rt('RUNWAY ',D(rwy),', CLEARED FOR TAKEOFF, ',me),why:'You’re landing! Tower said CLEARED TO LAND.'},
    {t:rt('WILCO'),why:'Read back the runway with a landing clearance, plus your call sign.'}]},
  vacate:{freq:['tower'],label:'AFTER LANDING',
   reply:()=>rt(me,', TURN ',turn,' AT ',exitTwy,', CONTACT GROUND POINT ',D(7),'.'),
   readback:()=>[{t:rt(turn,' AT ',exitTwy,', GROUND POINT ',D(7),', ',me),ok:1},
    {t:rt(turn==='RIGHT'?'LEFT':'RIGHT',' AT ',exitTwy,', GROUND POINT ',D(7),', ',me),why:'Tower said turn '+turn+'.'},
    {t:rt(turn,' AT ',exitTwy,', TOWER POINT ',D(3),', ',me),why:'Tower handed you to GROUND: 121.7, “ground point seven.”'}]}
 };
};

/* ============================ RADIO FLOW: the step engine ============================
   steps: {k:'tune', freq} | {k:'atis'} | {k:'build', call, freq} | {k:'readback', call} | {k:'quiz', q, opts:[{t,ok,why}], fig}
          {k:'say', msg} (the controller says something) | {k:'anim', kind:'takeoff'|'landing'|'taxi', dur}
   The scene owns a flow F = new H.RadioFlow(steps, {room, scored}) and calls F.update(dt) / F.draw(c, area). */
const fbk=o=>{ o.t0=o.t; return o; };
function bubble(who,msg,col){ return {who,t:typeof msg==='string'?msg:msg.t,col}; }
H.RadioFlow=function(steps,o){
 this.steps=steps; this.o=o||{}; this.i=-1; this.log=(this.o.log||[]).slice(-8); this.freq=this.o.freq||null; this.score=0; this.max=0; this.tries=0; this.done=false;
 this.defs=H.callDefs(this.o.room||'ramp'); this.next();
};
const RF=H.RadioFlow.prototype;
RF.cur=function(){ return this.steps[this.i]; };
RF.next=function(){
 this.i++; this.tries=0; this.sel=[]; this.fb=null; this.wait=0; this.anim=null; this.picked=null;
 const s=this.cur(); if(!s){ this.done=true; if(this.o.onDone) this.o.onDone(this); return; }
 if(s.k==='build'){ const d=this.defs[s.call]; s.slots=d.slots(s.freq||this.freq||d.freq[0]); s.labels=s.labels||['WHO ARE YOU CALLING?','WHO ARE YOU?','WHERE ARE YOU?','WHAT DO YOU WANT?']; }
 if(s.k==='readback'){ const d=this.defs[s.call]; s.opts=G.shuffle(d.readback().map(x=>Object.assign({},x))); }
 if(s.k==='quiz'&&!s._sh){ s.opts=G.shuffle(s.opts.slice()); s._sh=1; }
 if(s.k==='atis'){ const w=WX.today(), m=WX.atis(w); this.log.push(bubble('ATIS '+FREQ.atis.f,m,'#9fffc4')); this.wait=H.say(m,'atis')*.35+1; H.heardAtis(); }
 if(s.k==='say'){ const m=typeof s.msg==='function'?s.msg(this):s.msg; this.log.push(bubble(s.from||'TOWER',m,C.accentHi)); this.wait=Math.min(2.4,H.say(m,'atc')*.5); }
 if(s.k==='reply'){ const d=this.defs[s.call], m=d.reply(this.freq); this.log.push(bubble(FREQ[this.freq||'tower'].short,m,C.accentHi)); this.wait=Math.min(2.6,H.say(m,'atc')*.5); }
 if(s.k==='anim'){ this.anim={t:0,dur:s.dur||3,kind:s.kind}; if(s.kind==='takeoff') AUDIO.sfx('takeoff'); if(s.kind==='landing') AUDIO.sfx('whoosh'); if(s.kind==='taxi') AUDIO.sfx('engine'); }
 if(s.k==='tune'&&this.freq===s.freq) this.next();
};
RF.mark=function(ok){ if(!this.o.scored) return; this.max+=100; if(ok) this.score+=this.tries===0?100:(this.tries===1?50:20); };
RF.tune=function(f){ this.freq=f; AUDIO.sfx('squelch'); const s=this.cur(); if(s&&s.k==='tune'){ if(f===s.freq){ this.mark(true); this.log.push(bubble('TUNED',FREQ[f].n+' '+FREQ[f].f,C.dim)); this.next(); } else { this.tries++; this.fb=fbk({ok:false,t:1.4,msg:'THAT’S '+FREQ[f].short+'. TUNE '+FREQ[s.freq].short+' ('+FREQ[s.freq].f+')'}); AUDIO.sfx('thud'); } } };
/* r7.4 layout: a quiz question can wrap to three lines and must never sit under its own answers (the ATIS letter, the
   traffic-pattern questions). The question's height decides where the answers start, the answers share what is left, and the
   scene grows the action area when a step needs it (RF.needH), so the feedback line gets its own room below the answers
   instead of covering them. */
RF.qH=function(w){ const s=this.cur(); if(!s) return 0; if(s.k==='quiz') return G.wrap(s.q,6.6,w,800).length*9+6; if(s.k==='readback') return 16; return 0; };
RF.needH=function(w){ const s=this.cur(); if(!s||this.anim) return 196; if(s.k==='quiz'||s.k==='readback'){ const n=(s.opts||[]).length||3; return Math.max(196,this.qH(w)+8+n*40+(n-1)*6+46); } return 196; };
RF.optTop=function(a){ return a.y+Math.max(24,this.qH(a.w)+6); };
/* the action area: returns buttons for the current step */
RF.buttons=function(a){
 const s=this.cur(), B=[]; if(!s||this.wait>0||this.anim) return B;
 const y0=a.y, w=a.w, x0=a.x;
 if(s.k==='build'){ const k=this.sel.length;
  if(k<4){ const sz=H.fitSize?H.fitSize(s.slots[k].opts,w-14,7,6):7; s.slots[k].opts.forEach((t,i)=>B.push({id:'chip:'+i,label:t,kind:'secondary',x:x0,y:y0+42+i*36,w,h:32,size:sz})); }
  else B.push({id:'ptt',label:'PUSH TO TALK',kind:'primary',x:x0,y:y0+40,w,h:56,size:10}); }
 if(s.k==='readback'||s.k==='quiz'){ const opts=s.opts, n=opts.length, top=this.optTop(a), room=a.y+a.h-46-top-(n-1)*6, bh=Math.max(30,Math.min(44,room/n)); opts.forEach((o,i)=>{ const t=typeof o.t==='string'?o.t:o.t.t; B.push({id:'opt:'+i,label:t,kind:this.picked===i?(o.ok?'success':'danger'):'secondary',x:x0,y:top+i*(bh+6),w,h:bh,size:t.length>44?5.6:(t.length>30?6.2:7)}); }); }
 if(s.k==='atis') B.push({id:'next',label:'GOT IT',kind:'primary',x:x0,y:y0+a.h-46,w,h:40,size:8.4}),B.push({id:'again',label:'LISTEN AGAIN',kind:'ghost',x:x0,y:y0+a.h-92,w,h:38,size:7});
 return B;
};
RF.update=function(dt,a){
 const s=this.cur(); if(!s) return;
 if(this.fb){ this.fb.t-=dt; if(this.fb.t<=0||(G.ptr.click&&this.fb.t<this.fb.t0-.5)){ G.ptr.click=false; const go=this.fb.go; this.fb=null; if(go) this.next(); else this.picked=null; } return; }
 if(this.wait>0){ this.wait-=dt; if(G.ptr.click&&this.wait<1.2){ G.ptr.click=false; this.wait=0; } if(this.wait<=0&&(s.k==='say'||s.k==='reply'||this._ptt)){ this._ptt=false; this.next(); } return; }
 if(this.anim){ this.anim.t+=dt; if(this.anim.t>=this.anim.dur||(G.ptr.click&&this.anim.t>.6)){ G.ptr.click=false; this.next(); } return; }
 for(const b of this.buttons(a)) if(G.clicked(b.x,b.y,b.w,b.h)){ this.press(b.id); return; }
};
RF.press=function(id){
 const s=this.cur();
 if(id==='again'){ const m=WX.atis(WX.today()); H.sayStop(); H.say(m,'atis'); AUDIO.sfx('ok'); return; }
 if(id==='next'){ AUDIO.sfx('ok'); H.sayStop(); this.next(); return; }
 if(id.indexOf('chip:')===0){ const k=this.sel.length, sl=s.slots[k], t=sl.opts[+id.slice(5)];
  if(t===sl.ok){ this.sel.push(t); AUDIO.sfx('blip'); this.mark(true); this.tries=0; }
  else { this.tries++; this.fb=fbk({ok:false,t:1.6,msg:sl.why}); AUDIO.sfx('thud'); }
  return; }
 if(id==='ptt'){ const d=this.defs[s.call], msg=d.pilotSay?d.pilotSay():R.rt(...this.sel.map((t,i)=>i===1?R.cs():t).reduce((a,p,i)=>a.concat(i?[', ',p]:[p]),[]),'.');
  msg.s=msg.s.replace(/runway (\d+)/g,(m,n)=>'runway '+sayDigits(n));
  this.log.push(bubble('YOU',msg,C.info)); AUDIO.sfx('blip'); const est=H.say(msg,'pilot'); this.wait=Math.min(3,est*.45)+.4;
  // the controller answers once you've finished talking
  const self=this; this._afterPtt=()=>{ const m=d.reply(self.freq||d.freq[0]); self.log.push(bubble(FREQ[self.freq||d.freq[0]].short,m,C.accentHi)); H.say(m,'atc'); };
  this.steps.splice(this.i+1,0,{k:'_reply'}); this._ptt=true; return; }
 if(id.indexOf('opt:')===0){ const i=+id.slice(4), o=s.opts[i]; this.picked=i;
  if(o.ok){ this.mark(true); AUDIO.sfx('point'); if(s.k==='readback'){ this.log.push(bubble('YOU',o.t,C.info)); H.say(o.t,'pilot'); } this.fb=fbk({ok:true,t:s.k==='readback'?1.6:1.2,msg:s.k==='readback'?'GOOD READBACK':(s.yes||'RIGHT!'),go:true}); }
  else { this.tries++; AUDIO.sfx('thud'); this.fb=fbk({ok:false,t:2.2,msg:o.why||'NOT QUITE'}); }
  return; }
};
/* the synthetic step that plays the controller's reply after you talk */
const _next=RF.next; RF.next=function(){ _next.call(this); const s=this.cur(); if(s&&s.k==='_reply'){ if(this._afterPtt) this._afterPtt(); this._afterPtt=null; this.wait=1.8; this.steps.splice(this.i,1); this.i--; this._replyHold=true; } };
const _upd=RF.update; RF.update=function(dt,a){ if(this._replyHold){ this.wait-=dt; if(G.ptr.click&&this.wait<1.4){ G.ptr.click=false; this.wait=0; } if(this.wait<=0){ this._replyHold=false; this.next(); } return; } _upd.call(this,dt,a); };

/* ----- drawing ----- */
RF.drawLog=function(c,x,y,w,h){
 c.save(); c.beginPath(); c.rect(x,y,w,h); c.clip();
 let yy=y+h; for(let i=this.log.length-1;i>=0&&yy>y;i--){ const b=this.log[i], mine=b.who==='YOU', L=G.wrap(b.t,6.4,w-40,700), bh=16+L.length*9;
  yy-=bh+5; const bx=mine?x+30:x, bw=w-30;
  G.rrect(bx,yy,bw,bh,9); c.fillStyle=mine?G.rgba(C.info,.14):'rgba(255,255,255,.05)'; c.fill(); c.strokeStyle=G.rgba(b.col||C.accent,.45); c.lineWidth=1; c.stroke();
  G.txt(b.who,bx+8,yy+4,4.8,b.col||C.accentHi,'left',bw-16,800); L.forEach((l,k)=>G.txt(l,bx+8,yy+12+k*9,6.4,C.ink,'left',bw-16,700)); }
 c.restore();
};
RF.drawAction=function(c,a){
 const s=this.cur(); if(!s) return;
 if(this.anim){ drawAnim(c,a.x,a.y,a.w,a.h,this.anim.kind,this.anim.t/this.anim.dur,this.anim.t); return; }
 if(s.k==='build'){ const k=Math.min(3,this.sel.length);
  // the four slots
  const sw=(a.w-9)/4; for(let i=0;i<4;i++){ const x=a.x+i*(sw+3), on=i===this.sel.length; G.rrect(x,a.y,sw,26,7); c.fillStyle=this.sel[i]?G.rgba(C.good,.14):(on?G.rgba(C.accent,.14):'rgba(255,255,255,.04)'); c.fill(); c.strokeStyle=this.sel[i]?G.rgba(C.good,.6):(on?C.accent:'rgba(255,255,255,.12)'); c.lineWidth=on?1.6:1; c.stroke();
   G.txt(['WHO?','ME','WHERE','WHAT'][i],x+sw/2,a.y+3,4.4,C.dim,'center',sw-4,800); G.txt(this.sel[i]?(i===1?'✓ ME':'✓'):'…',x+sw/2,a.y+13,6,this.sel[i]?C.good:C.dim,'center',sw-4,800); }
  if(this.sel.length<4) G.txt(s.labels[this.sel.length],a.x,a.y+28,6,C.accentText,'left',a.w,800);
  else G.txt('READY? KEY THE MIC AND SAY IT.',a.x+a.w/2,a.y+28,6,C.accentText,'center',a.w,800); }
 if(s.k==='readback') G.txt(this.picked!=null&&this.fb&&this.fb.ok?'':'READ IT BACK: PICK THE RIGHT ANSWER',a.x,a.y+6,6,C.accentText,'left',a.w,800);
 if(s.k==='quiz'){ G.para(s.q,a.x,a.y+2,6.6,C.ink,'left',a.w,9,800); }
 if(s.k==='atis'){ G.para('That’s the ATIS: today’s weather and runway, on a loop. Note the letter: INFORMATION '+WX.today().letter+'.',a.x,a.y+6,6.6,C.sub,'left',a.w,9.4,700); }
 if(s.k==='tune'){ G.para('Tune '+FREQ[s.freq].n+': tap '+FREQ[s.freq].short+' ('+FREQ[s.freq].f+') on the radio.',a.x+a.w/2,a.y+a.h/2-14,7.4,C.ink,'center',a.w,10,800); }
 G.drawBtns(this.buttons(a));
 if(this.fb){ const h=Math.max(30,12+G.wrap(this.fb.msg,6.6,a.w-24,800).length*9.4), B=this.buttons(a), below=B.length?B[B.length-1].y+B[B.length-1].h+6:a.y+a.h-h-2, fy=Math.min(a.y+a.h-h-2,Math.max(below,a.y)); G.rrect(a.x,fy,a.w,h,10); c.fillStyle=this.fb.ok?'rgba(18,61,38,.97)':'rgba(70,16,16,.97)'; c.fill(); c.strokeStyle=this.fb.ok?C.good:C.bad; c.lineWidth=1.2; c.stroke(); G.para(this.fb.msg,a.x+a.w/2,fy+7,6.6,'#fff','center',a.w-24,9.4,800); }
 if(this.wait>0&&!this.fb) G.txt('LISTENING…  (TAP TO SKIP)',a.x+a.w/2,a.y+a.h-16,6,C.dim,'center',a.w,800);
};
/* the radio head: frequency display + presets */
H.drawRadioHead=function(c,x,y,w,freq,t){
 G.rrect(x,y,w,58,12); c.fillStyle='#14161a'; c.fill(); c.strokeStyle='rgba(255,255,255,.12)'; c.lineWidth=1; c.stroke();
 G.txt('COM 1',x+10,y+7,5,C.dim,'left',undefined,800);
 G.rrect(x+10,y+16,w*.56,34,6); c.fillStyle='#061209'; c.fill();
 const F=freq?FREQ[freq]:null; G.txt(F?F.f:'---.--',x+16,y+20,15,'#3fdc7c','left',w*.56-12,800); G.txt(F?F.n:'PICK A FREQUENCY',x+16,y+40,4.6,'#9fffc4','left',w*.56-12,800);
 if(freq&&!G.rm()){ const k=(Math.sin(t*9)+1)/2; c.fillStyle=G.rgba(C.good,.4+k*.6); c.beginPath(); c.arc(x+w*.56+2,y+22,2.2,0,7); c.fill(); }
 return ['atis','ground','tower'].map((f,i)=>{ const bw=(w*.44-28)/3; return {id:'f:'+f,label:FREQ[f].short,x:x+w*.56+18+i*(bw+4),y:y+16,w:bw,h:34,size:5.6,kind:freq===f?'primary':'secondary'}; });
};
H.heardAtis=function(){ const r=(G.save.mod.radio=G.save.mod.radio||{}); r.heard=WX.today().key; G.persist(); };

/* ----- flight animations (takeoff, landing, taxi) in a box ----- */
function drawAnim(c,x,y,w,h,kind,k,t){
 const a=H.myAC?H.myAC():{id:'c172',paint:null}; k=Math.max(0,Math.min(1,k));
 c.save(); G.rrect(x,y,w,h,12); c.clip();
 const gy=y+h-26; H.sky(c,x,y,w,h,{mode:'day',sun:[.84,.2],t}); H.clouds(c,x,y,w,h*.55,{t,n:4,seed:7,speed:kind==='taxi'?3:10,alpha:.85});
 const gg=c.createLinearGradient(0,gy,0,gy+26); gg.addColorStop(0,'#5d8a47'); gg.addColorStop(1,'#3f6a34'); c.fillStyle=gg; c.fillRect(x,gy,w,26); c.fillStyle='#36393f'; c.fillRect(x,gy+5,w,14);
 const scroll=G.rm()?0:t*(kind==='taxi'?20:80); c.fillStyle='#f2f2f2'; for(let xx=x-((scroll%36));xx<x+w;xx+=36) c.fillRect(xx,gy+11.4,18,1.6);
 if(kind!=='taxi') H.speedLines(c,x,y,w,h-26,{t,k:kind==='takeoff'?Math.min(1,k*2):Math.max(0,1-k),col:'rgba(255,255,255,.28)'});
 if(kind==='taxi'){ c.fillStyle='#55585e'; c.fillRect(x,gy+5,w,14); c.fillStyle='#ffc21a'; c.fillRect(x,gy+11.6,w,1.2); const hx=x+w*.82; c.fillRect(hx,gy+5,1.4,14); c.fillRect(hx+3,gy+5,1.4,14); for(let yy=gy+5;yy<gy+19;yy+=3.4){ c.fillRect(hx+6,yy,1.4,2); c.fillRect(hx+9,yy,1.4,2); }
  const px=x+20+Math.min(1,k*1.15)*(w*.82-70); H.drawAC(c,a.id,px-30,gy-24,70,35,a.paint,{ground:false,prop:'spin',t}); }
 else if(kind==='takeoff'){ const roll=Math.min(1,k/.5), climb=Math.max(0,(k-.5)/.5), px=x+20+roll*w*.35+climb*w*.4, py=gy+12-climb*climb*h*.6;
  c.save(); c.translate(px,py); c.rotate(-.3*Math.min(1,climb*2.4)); H.drawAC(c,a.id,-40,-36,80,40,a.paint,{ground:false,prop:'spin',t}); c.restore(); }
 else { const px=x+w*.1+k*w*.6, py=gy+12-Math.pow(1-Math.min(1,k/.7),2)*h*.55; c.save(); c.translate(px,py); c.rotate(-.06+.08*Math.min(1,k/.7)); H.drawAC(c,a.id,-40,-36,80,40,a.paint,{ground:false,prop:'spin',t}); c.restore(); if(k>.7&&k<.76&&!G.rm()){ c.fillStyle='rgba(255,255,255,.6)'; c.beginPath(); c.arc(px-6,gy+16,4,0,7); c.fill(); } }
 c.restore(); c.strokeStyle=G.rgba(C.accent,.4); c.lineWidth=1; G.rrect(x,y,w,h,12); c.stroke();
 G.txt(kind==='taxi'?'TAXIING… STOP AT THE HOLD-SHORT LINE':(kind==='takeoff'?'ROTATE… POSITIVE CLIMB!':'TOUCHDOWN… NICE!'),x+w/2,y+8,6,'#fff','center',w-16,800);
}
H.drawFlightAnim=drawAnim;

/* ============================ CALL THE TOWER (the scene) ============================ */
const RX=()=>{ const r=(G.save.mod.radio=G.save.mod.radio||{}); return r; };
G.scenes.radio={
 enter(a){ a=a||{}; this.back=a.back||'world'; this.room=a.from||(G.world&&G.world.room())||'ramp'; this.t=0; this.mode='menu'; this.flow=null; this.help=false;
  this.freq=a.freq||null; this.log=[]; if(AUDIO.curName!=='tower') AUDIO.play('tower');
  if(this.freq==='atis') this.startAtis(); },
 exit(){ H.sayStop(); },
 area(){ const VH=G.VH, w=VW-24, need=this.flow&&this.mode==='flow'?Math.min(VH-112-64,this.flow.needH(w)):196; return {x:12,y:VH-10-need,w,h:need}; },   // r7.4: grows for a long question
 startAtis(){ this.freq='atis'; this.flow=new H.RadioFlow([{k:'atis'}],{room:this.room,freq:'atis',log:this.flow?this.flow.log:[],onDone:()=>{ this.mode='menu'; }}); this.mode='flow'; },
 menu(){ const D=H.callDefs(this.room), out=[]; const f=this.freq;
  if(!f) return out;
  if(f==='atis'){ out.push({id:'atis',label:'LISTEN TO THE ATIS',sub:'TODAY’S WEATHER + RUNWAY'}); return out; }
  for(const k of ['taxi','depart','inbound','radiocheck']){ const d=D[k]; if(!d.freq.includes(f)) continue; if(d.rooms&&!d.rooms.includes(this.room)) continue; if(k==='taxi'&&this.room==='runway') continue; out.push({id:k,label:d.label,sub:d.sub}); }
  return out; },
 startCall(k){
  const steps=[{k:'build',call:k,freq:this.freq}]; const D=H.callDefs(this.room);
  if(D[k].readback) steps.push({k:'readback',call:k});
  if(k==='depart') steps.push({k:'anim',kind:'takeoff',dur:3.2});
  this.flow=new H.RadioFlow(steps,{room:this.room,freq:this.freq,log:this.flow?this.flow.log:[],onDone:()=>this.finish(k)}); this.mode='flow'; this.call=k; },
 finish(k){
  this.mode='done'; this.doneK=k; const r=RX(), d=H.dayKey?H.dayKey(0):'';
  if(!r.first){ r.first=1; G.ach('radio'); }
  if(r.d!==d){ r.d=d; r.xp=0; r.calls={}; } if(!r.calls[k]&&r.xp<20){ r.calls[k]=1; r.xp+=5; G.award(5,'RADIO CALL'); }
  G.persist(); AUDIO.sfx('chime2'); },
 doneBtns(){ const a=this.area(), B=[], k=this.doneK, w=a.w;
  if(k==='taxi') B.push({id:'go:runway',label:'TAXI OUT TO THE RUNWAY',kind:'primary'},{id:'g_taxi',label:'PLAY TAXI MAZE',kind:'ghost'});
  else if(k==='depart'||k==='inbound') B.push({id:'g_landing',label:'FLY THE LANDING CHALLENGE',kind:'primary'});
  B.push({id:'again',label:'ANOTHER CALL',kind:'secondary'},{id:'back',label:'DONE',kind:'ghost'});
  return B.map((b,i)=>Object.assign(b,{x:a.x,y:a.y+40+i*40,w,h:34,size:7.4})); },
 update(dt){ this.t+=dt;
  if(this.help){ if(G.ptr.click||G.pressed.a||G.pressed.b){ G.ptr.click=false; this.help=false; } return; }
  if(G.backHit()){ H.sayStop(); G.go(this.back,this.back==='world'?{}:{from:this.room}); return; }
  const hb={x:VW-34,y:4,w:28,h:30}; if(G.clicked(hb.x,hb.y,hb.w,hb.h)){ this.help=true; return; }
  const RH=H.drawRadioHead.__btns||[];
  for(const b of RH) if(G.clicked(b.x,b.y,b.w,b.h)){ const f=b.id.slice(2); H.sayStop();
   if(this.flow&&this.mode==='flow'){ this.flow.tune(f); this.freq=this.flow.freq; return; }
   this.freq=f; AUDIO.sfx('squelch'); if(f==='atis') this.startAtis(); else this.mode='menu'; return; }
  const a=this.area();
  if(this.mode==='flow'&&this.flow){ this.flow.update(dt,a); return; }
  if(this.mode==='menu'){ this.menu().forEach((m,i)=>{ if(G.clicked(a.x,a.y+30+i*42,a.w,38)){ AUDIO.sfx('ok'); if(m.id==='atis') this.startAtis(); else this.startCall(m.id); } }); return; }
  if(this.mode==='done'){ for(const b of this.doneBtns()) if(G.clicked(b.x,b.y,b.w,b.h)){ AUDIO.sfx('ok'); H.sayStop();
   if(b.id==='go:runway'){ G.go('world',{room:'runway'}); return; } if(b.id==='again'){ this.mode='menu'; return; } if(b.id==='back'){ G.go(this.back,this.back==='world'?{}:{from:this.room}); return; }
   G.go(b.id,{back:'world'}); return; } }
 },
 draw(c){
  G.backdrop(.95); const VH=G.VH, a=this.area();
  const btns=H.drawRadioHead(c,10,48,VW-20,this.freq,this.t); H.drawRadioHead.__btns=btns; G.drawBtns(btns);
  // transcript
  const ly=112, lh=a.y-ly-8, log=this.flow?this.flow.log:[];
  if(log.length) RF.drawLog.call(this.flow,c,12,ly,VW-24,lh);
  else { G.panel(12,ly,VW-24,lh,{r:12}); const w=H.wx.today();
   G.txt(H.FIELD.name+' ('+H.FIELD.id+')',VW/2,ly+12,7.4,C.title,'center',VW-40,800);
   G.txt('INFORMATION '+w.letter+' • RUNWAY '+w.rwy+' IN USE',VW/2,ly+26,6,C.sub,'center',VW-40,800);
   const L=['1. TUNE ATIS FOR THE WEATHER + LETTER','2. TUNE GROUND TO TAXI, OR TOWER FOR THE RUNWAY','3. WHO, WHO, WHERE, WHAT: BUILD THE CALL','4. READ BACK WHAT THEY TELL YOU'];
   L.forEach((l,i)=>G.txt(l,24,ly+46+i*13,5.6,C.ink,'left',VW-48,800));
   G.txt(H.voiceOn()?'TOWER VOICE: ON (SETTINGS)':'TOWER VOICE: OFF (SETTINGS)',VW/2,ly+lh-14,5,C.dim,'center',undefined,800); }
  // action area
  if(this.mode==='flow'&&this.flow) this.flow.drawAction(c,a);
  else if(this.mode==='menu'){ const M=this.menu();
   if(!this.freq) G.para('Pick a frequency on the radio: ATIS for the weather, GROUND to taxi, TOWER for the runway.',a.x+a.w/2,a.y+30,7,C.ink,'center',a.w,10,800);
   else { G.txt('WHAT DO YOU WANT TO SAY?',a.x,a.y+10,6,C.accentText,'left',a.w,800);
    M.forEach((m,i)=>{ const y=a.y+30+i*42, press=G.held(a.x,y,a.w,38); G.rrect(a.x,y+(press?1:0),a.w,38,10); c.fillStyle=press?C.cardPress:C.card; c.fill(); c.strokeStyle='rgba(255,255,255,.14)'; c.lineWidth=1; c.stroke();
     G.icon('headset',c,a.x+18,y+19,12,C.accentText); G.txt(m.label,a.x+34,y+8,7.4,C.ink,'left',a.w-44,800); G.txt(m.sub||'',a.x+34,y+22,5,C.dim,'left',a.w-44,800); }); } }
  else if(this.mode==='done'){ const k=this.doneK; G.txt(k==='radiocheck'?'LOUD AND CLEAR!':'NICE RADIO WORK!',a.x+a.w/2,a.y+8,10,C.good,'center',a.w,800);
   G.txt(k==='taxi'?'CLEARED TO TAXI. HOLD SHORT OF THE RUNWAY.':(k==='depart'?'YOU’RE AIRBORNE.':(k==='inbound'?'ENTER THE PATTERN AND LAND.':'THEY HEAR YOU FINE.')),a.x+a.w/2,a.y+24,6,C.sub,'center',a.w,800);
   G.drawBtns(this.doneBtns()); }
  G.topBar('CALL THE TOWER',{sub:this.freq?H.FREQ[this.freq].n+' '+H.FREQ[this.freq].f:H.FIELD.name+' RADIO',backLabel:'BACK'});
  const hb={x:VW-34,y:4,w:28,h:30}; c.beginPath(); c.arc(hb.x+14,hb.y+17,11,0,7); c.fillStyle='rgba(255,255,255,.08)'; c.fill(); G.txt('?',hb.x+14,hb.y+11,9,C.accentText,'center',undefined,800);
  if(this.help) drawRadioHelp(c);
 }
};
function drawRadioHelp(c){ const VH=G.VH; G.dim(.8); G.panel(10,52,VW-20,VH-66,{r:14,border:G.rgba(C.accent,.6)});
 let y=64; G.txt('HOW TO TALK ON THE RADIO',VW/2,y,9,C.title,'center',VW-30,800); y+=20;
 const P=['Every first call has four parts: WHO you’re calling, WHO you are, WHERE you are, and WHAT you want.',
  'Example: “'+FN+' GROUND, SKY SCOUT, AT THE PARKING STAND, READY TO TAXI WITH BRAVO.”',
  'ATIS is a recording of the airport’s weather and runway. Each new one gets a letter (ALFA, BRAVO...). Tell the controller which one you heard.',
  'GROUND controls the taxiways. TOWER controls the runway and the sky around the airport.',
  'Read back what the controller tells you, especially the RUNWAY and any HOLD SHORT. End with your call sign.',
  'Numbers are said one digit at a time: runway 27 is “two seven.” Nine is “niner.”',
  'Real pilots use the airplane’s type and tail number, like “Skyhawk one two three alfa bravo.” Here, your call sign works the same way.'];
 for(const p of P){ G.para(p,22,y,6.4,C.ink,'left',VW-44,9.2,700); y+=G.wrap(p,6.4,VW-44,700).length*9.2+8; }
 G.txt('TAP TO CLOSE',VW/2,VH-30,6,C.accentText,'center',undefined,800); }
})();
