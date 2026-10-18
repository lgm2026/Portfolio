/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* DEPARTURE + ARRIVAL (the Tower consoles, the Runway signs): every radio call of a flight, scored.
   Built on H.RadioFlow (hfq_radio.js). Each right answer on the first try is 100 points (50 on the second).
   DEPARTURE: ATIS -> the letter -> the runway in use -> GROUND (taxi call + readback) -> taxi -> hold short ->
              TOWER (ready for departure + readback) -> takeoff.
   ARRIVAL:   ATIS -> TOWER (inbound + readback) -> the traffic pattern -> midfield call -> cleared to land ->
              landing -> exit the runway + switch to ground (readback).
   Traffic pattern: left traffic for runway 27, right traffic for runway 9, so the pattern always stays south of the
   field. Legs: upwind, crosswind, downwind, base, final. */
(function(){
const H=G.HFQ, C=G.C, VW=G.VW, PI=Math.PI, MG=G.MG;
function letterQ(){ const w=H.wx.today(), L=w.letter, i=H.PHONETIC.indexOf(L), o=[H.PHONETIC[(i+1)%26],H.PHONETIC[(i+25)%26]];
 return {k:'quiz',q:'WHAT IS TODAY’S ATIS INFORMATION LETTER?',yes:'INFORMATION '+L+'. TELL THE CONTROLLER YOU HAVE IT.',opts:[{t:L,ok:1}].concat(o.map(t=>({t,why:'Listen again: it was INFORMATION '+L+'.'})))}; }
function rwyQ(){ const w=H.wx.today(), from=w.wspd===0?'calm':String(w.wdir).padStart(3,'0')+'°';
 return {k:'quiz',q:'WHICH RUNWAY IS IN USE TODAY?',yes:'INTO THE WIND!',opts:[{t:'RUNWAY '+w.rwy,ok:1},{t:'RUNWAY '+w.rwyOther,why:'The wind is '+(w.wspd===0?'calm, so the ATIS picked runway '+w.rwy:'from '+from+'. Take off and land INTO the wind: runway '+w.rwy)+'.'},{t:'RUNWAY 18',why:'Academy Field only has runway 9-27. Listen to the ATIS.'}]}; }
const DEPART=()=>[{k:'tune',freq:'atis'},{k:'atis'},letterQ(),rwyQ(),{k:'tune',freq:'ground'},{k:'build',call:'taxi',freq:'ground'},{k:'readback',call:'taxi'},{k:'anim',kind:'taxi',dur:3},
 {k:'quiz',q:'YOU’RE AT THE HOLD-SHORT LINE. WHAT NOW?',yes:'STOPPED. NOW CALL TOWER.',opts:[{t:'STOP, SWITCH TO TOWER AND CALL',ok:1},{t:'CROSS IT: GROUND SAID TAXI',why:'Never cross a hold-short line without a clearance. Stop and call tower.'},{t:'WAIT FOR GROUND TO CALL YOU',why:'The runway belongs to TOWER. Switch to tower and say you’re ready.'}]},
 {k:'tune',freq:'tower'},{k:'build',call:'depart',freq:'tower'},{k:'readback',call:'depart'},{k:'anim',kind:'takeoff',dur:3.2}];
const ARRIVE=()=>{ const w=H.wx.today(), dw=w.rwy==='27'?'LEFT':'RIGHT';
 return [{k:'tune',freq:'atis'},{k:'atis'},letterQ(),{k:'tune',freq:'tower'},{k:'build',call:'inbound',freq:'tower'},{k:'readback',call:'inbound'},
  {k:'quiz',fig:'downwind',q:'YOU’RE FLYING THE HIGHLIGHTED LEG. WHICH LEG IS IT?',yes:'DOWNWIND: PARALLEL TO THE RUNWAY, FLYING THE OTHER WAY.',opts:[{t:'DOWNWIND',ok:1},{t:'BASE',why:'Base is the short leg that turns you toward the runway.'},{t:'FINAL',why:'Final is lined up with the runway.'},{t:'CROSSWIND',why:'Crosswind is the short leg right after takeoff.'}]},
  {k:'quiz',fig:'base',q:'TOWER SAID '+dw+' TRAFFIC. AT THE END OF DOWNWIND, WHICH WAY DO YOU TURN ONTO BASE?',yes:dw+' TRAFFIC MEANS EVERY TURN IS TO THE '+dw+'.',opts:[{t:'TURN '+dw,ok:1},{t:'TURN '+(dw==='LEFT'?'RIGHT':'LEFT'),why:dw+' traffic means every turn in the pattern is to the '+dw+'.'}]},
  {k:'build',call:'midfield',freq:'tower',labels:['WHO ARE YOU CALLING?','WHO ARE YOU?','WHERE ARE YOU?','WHICH RUNWAY?']},{k:'readback',call:'midfield'},{k:'anim',kind:'landing',dur:3},
  {k:'reply',call:'vacate'},{k:'readback',call:'vacate'}]; };
/* the traffic pattern, from above (north up). hl = the leg to light up; labels after answering */
function drawPattern(c,x,y,w,h,hl,labels){
 const rwy=H.wx.today().rwy, flip=rwy==='9';
 G.rrect(x,y,w,h,12); c.fillStyle='#3f6b3a'; c.fill();
 const cx=x+w/2, ry=y+h*.3, rl=w*.36; c.fillStyle='#3a3d42'; c.fillRect(cx-rl/2,ry-5,rl,10); c.fillStyle='#f2f2f2'; for(let k=cx-rl/2+10;k<cx+rl/2-10;k+=10) c.fillRect(k,ry-.6,5,1.2);
 G.txt(flip?'9':'27',flip?cx-rl/2+8:cx+rl/2-14,ry-3,5,'#fff','left',undefined,800); G.txt(flip?'27':'9',flip?cx+rl/2-12:cx-rl/2+4,ry-3,5,'#fff','left',undefined,800);
 const W=x+w*.1, E=x+w*.9, S=y+h*.78, xL=cx-rl/2-18, xR=cx+rl/2+18;
 // legs for runway 27 (landing west, left traffic, pattern south); mirrored for runway 9 (right traffic)
 const F=p=>flip?[2*cx-p[0],p[1]]:p;
 const legs={upwind:[[xL,ry],[W,ry]],crosswind:[[W,ry],[W,S]],downwind:[[W,S],[E,S]],base:[[E,S],[E,ry]],final:[[E,ry],[xR,ry]]};
 for(const k in legs){ const [a,b]=legs[k].map(F), on=k===hl; c.strokeStyle=on?C.accentHi:'rgba(255,255,255,.45)'; c.lineWidth=on?3.4:1.6; c.setLineDash(on?[]:[4,3]); c.beginPath(); c.moveTo(a[0],a[1]); c.lineTo(b[0],b[1]); c.stroke(); c.setLineDash([]);
  const mx=(a[0]+b[0])/2, my=(a[1]+b[1])/2, ang=Math.atan2(b[1]-a[1],b[0]-a[0]); c.save(); c.translate(mx,my); c.rotate(ang); c.fillStyle=on?C.accentHi:'rgba(255,255,255,.6)'; c.beginPath(); c.moveTo(5,0); c.lineTo(-3,-3.5); c.lineTo(-3,3.5); c.closePath(); c.fill(); c.restore();
  if(labels) G.txt(k.toUpperCase(),mx+(k==='crosswind'||k==='base'?(mx<cx?-4:4):0),my+(k==='downwind'?6:(k==='upwind'||k==='final'?-12:-3)),5,on?C.accentHi:'#fff',(k==='crosswind'||k==='base')?(mx<cx?'right':'left'):'center',undefined,800); }
 G.txt('N ▲',x+w-10,y+6,5,'#fff','right',undefined,800);
}
H.drawPattern=drawPattern;
function radioGame(id,steps,head){
 G.scenes['g_'+id]={
  enter(a){ MG.start(this,id,a); this.flow=new H.RadioFlow(steps(),{room:'ramp',scored:true,onDone:()=>this.finish()}); if(AUDIO.curName!=='tower') AUDIO.play('tower'); },
  exit(){ H.sayStop(); },
  area(){ const VH=G.VH, w=VW-24, need=Math.min(VH-112-64,this.flow?this.flow.needH(w):196); return {x:12,y:VH-12-need,w,h:need}; },   // r7.4: grows for a long question
  update(dt){
   if(MG.update(this,dt)) return;
   for(const b of H.drawRadioHead.__gb||[]) if(G.clicked(b.x,b.y,b.w,b.h)){ H.sayStop(); this.flow.tune(b.id.slice(2)); return; }
   this.flow.update(dt,this.area());
  },
  finish(){ const F=this.flow, pct=F.max?F.score/F.max:0; MG.end(this,F.score,{head:pct>.9?head[0]:(pct>.7?head[1]:head[2]),line:'Radio score: '+F.score+' of '+F.max+'. Clear, short and in order: that’s how pilots talk.'}); },
  draw(c){
   G.backdrop(.95); const VH=G.VH, a=this.area(), F=this.flow, s=F.cur();
   const btns=H.drawRadioHead(c,10,48,VW-20,F.freq,this.t); H.drawRadioHead.__gb=btns; G.drawBtns(btns);
   const ly=112, lh=a.y-ly-8;
   if(s&&s.fig){ const picked=F.fb&&F.fb.ok; drawPattern(c,12,ly,VW-24,lh,s.fig,picked); }
   else if(F.log.length) F.drawLog(c,12,ly,VW-24,lh);
   else { G.panel(12,ly,VW-24,lh,{r:12}); G.txt(id==='depart'?'YOUR FLIGHT: PARKING STAND TO TAKEOFF':'YOUR FLIGHT: BACK TO '+H.FIELD.name,VW/2,ly+12,6.6,C.title,'center',VW-40,800);
    const L=id==='depart'?['1. ATIS: GET THE WEATHER + LETTER','2. GROUND: ASK TO TAXI, READ IT BACK','3. TAXI TO THE HOLD-SHORT LINE','4. TOWER: READY FOR DEPARTURE','5. TAKEOFF!']:['1. ATIS: GET THE WEATHER + LETTER','2. TOWER: INBOUND FOR LANDING','3. FLY THE TRAFFIC PATTERN','4. CLEARED TO LAND','5. EXIT THE RUNWAY, SWITCH TO GROUND'];
    L.forEach((l,i)=>G.txt(l,26,ly+32+i*14,5.8,C.ink,'left',VW-52,800)); }
   if(s) F.drawAction(c,a);
   G.txt('STEP '+Math.min(F.steps.length,F.i+1)+' / '+F.steps.length,12,VH-8,4.8,C.dim,'left',undefined,800);
   MG.hud(this,c,F.score+' PTS',{sub:id==='depart'?'PARKING STAND TO TAKEOFF':'INBOUND TO THE PARKING STAND',tip:id==='depart'?'Listen to the ATIS, then call ground and tower. Tap TUNE buttons on the radio when asked.':'Get the ATIS, call the tower, fly the pattern and land.'});
  }
 };
}
radioGame('depart',DEPART,['SMOOTH OPERATOR','CLEARED FOR TAKEOFF','AIRBORNE!']);
radioGame('arrive',ARRIVE,['GREASED THE RADIO','WELCOME BACK','ON THE GROUND']);
})();
