/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* HYPETEEN FLIGHT ACADEMY - THE CREW THINKS (r7.4). Three things that make the crew more than line dispensers:
   1. THE CLUE ENGINE  H.clue(q, level): hints for a Ground School challenge, built only from the academy's own checked text
      (the lesson's briefing cards and its instructor tip), so a hint can never invent a fact.
        level 1  a gentle directional clue: which briefing card holds the answer, plus a way to think about this kind of question
        level 2  closer guidance: the card sentence that best fits the question, chosen so it does NOT contain the answer
        level 3  the clear explanation: the lesson scene shows the answer and its why (hfq_lessons.js)
      H.clueSource(q) also points the quiz engine at the card to review after a miss.
   2. CREW WHO NOTICE  every crew member's repeat-visit lines become one smart line: the most useful thing about YOUR
      progress first (a checkride you are ready for, a lesson that keeps going wrong, the next lesson, a milestone, a new
      aircraft spotted, today's runway), then their own tips in order, never the same line twice in a row and never a
      repeat until every line has been heard. Progress lines talk about the academy only; aviation facts stay in the crew's
      checked lines and the lessons' tips.
   3. NOBODY STAYS STUCK  in the walkable rooms, a cadet who has not opened, talked to or walked anywhere new for a while gets
      a small speech bubble from the crew member in the room (never a pop-up, never during a talk or a station): first a
      gentle clue, then a specific suggestion with a direction, then the plain way out (the MAP, the Flight Path).
   Saved per cadet: G.save.mod.crewtalk = {said:{npc:[keys]}, seen:{npc:[i]}, last:{npc:{t,ctx}}, used:{room:key:1}} */
(function(){
const H=G.HFQ, C=G.C, VW=G.VW;
const CT=()=>{ const m=G.save.mod; const s=m.crewtalk=m.crewtalk||{}; s.said=s.said||{}; s.seen=s.seen||{}; s.last=s.last||{}; s.used=s.used||{}; return s; };
const T=s=>H.UI&&H.UI.title?H.UI.title(s):String(s||'');   // UNIT TITLES -> Unit Titles (keeps VFR, ATC, ID...)
const UT=u=>u?u.t:'';

/* ============================ 1. THE CLUE ENGINE ============================ */
const STOP=new Set(('the a an and or of to in on at for is are was were be been being it its this that these those with from by as into than then what which '+
 'who whom whose why how when where your you yours our their there here they them he she his her him not no yes do does did can could should would will just '+
 'only also more most less very each every any some all both one two three about after before over under between while because so if but up down out off '+
 'get gets got make makes made use used uses like into onto its it’s that’s what’s true false tap pick answer answers called call says say').split(' '));
const stem=w=>w.length>4?w.replace(/(ies)$/,'y').replace(/(ing|ers|er|ed|es|s)$/,''):w;
const keys=s=>(String(s||'').toLowerCase().replace(/[’']/g,'').match(/[a-z0-9]+/g)||[]).filter(w=>w.length>2&&!STOP.has(w)).map(stem);
const overlap=(a,b)=>{ const A=new Set(a); let n=0; for(const w of new Set(b)) if(A.has(w)) n++; return n; };
const sentences=s=>String(s||'').split(/(?<=[.!?])\s+(?=[A-Z“"‘(])/).map(x=>x.trim()).filter(Boolean);
let LIX=null; const lessonById=id=>{ if(!LIX){ LIX={}; for(const u of H.units) for(const l of H.lessons[u.id]||[]) LIX[l.id]=l; } return LIX[id]||null; };
H.lessonById=lessonById;
/* the words that would give a challenge away */
function answerKeys(q){
 if(q.k==='mc'||q.k==='fill') return keys(q.a[0]);
 if(q.k==='tap') return keys(q.zl||'');
 return [];
}
/* which briefing card a challenge comes from: the card sharing the most words with the question, its answer and its why */
H.clueSource=function(q){
 const L=q&&lessonById(q.lesson); if(!L||!L.cards||!L.cards.length) return null;
 const qk=keys(q.q+' '+(q.k==='mc'||q.k==='fill'?q.a[0]:'')+' '+(q.why||'')+' '+(q.zl||''));
 let best=0, bs=-1; L.cards.forEach((c,i)=>{ const s=overlap(qk,keys(c.t+' '+c.b))+(c.fig&&q.fig&&c.fig.f===q.fig.f?3:0); if(s>bs){ bs=s; best=i; } });
 return {lesson:L,card:L.cards[best],i:best,score:bs};
};
/* the book chapter a library-quiz question comes from (same word match, over the chapter heading and its paragraphs) */
H.bookSection=function(bookId,text){ const b=H.bookById&&H.bookById(bookId); if(!b||!b.sec) return null; const qk=keys(text); let best=null, bs=0;
 for(const s of b.sec){ const sc=overlap(qk,keys(s.h+' '+(s.p||[]).join(' '))); if(sc>bs){ bs=sc; best=s; } }
 return best&&bs>=2?{h:T(best.h),book:T(b.t)}:null; };
const KIND={mc:'Rule out the answers you know are wrong first.',tf:'Check every part of the sentence: one wrong detail makes it false.',
 fill:'Try each word in the blank and read the whole sentence.',order:'Find the step that has to come first, then ask what comes next.',
 tap:'Find that part on the briefing card’s picture.',match:'Start with the pair you are surest about.'};
H.clue=function(q,level,here){
 const S=H.clueSource(q); if(!S) return KIND[q.k]||'Think back to the briefing.';
 const ak0=answerKeys(q), named=ak0.length&&overlap(ak0,keys(S.card.t))>0;   // a card titled with the answer is pointed to by number
 const where=(named?'number '+(S.i+1)+' of '+S.lesson.cards.length:'“'+S.card.t+'”')+(here&&here.id===S.lesson.id?'':' in the lesson “'+S.lesson.t+'”');
 if(level<=1) return 'Look back at the briefing card '+where+'. '+(KIND[q.k]||'');
 if(q.k==='tap'&&q.zl) return 'Look for '+q.zl.charAt(0).toLowerCase()+q.zl.slice(1)+'.';
 /* level 2: the sentence that fits the question best, without the answer's own words */
 const ak=answerKeys(q), qk=keys(q.q);
 const pool=[]; S.lesson.cards.forEach((c,ci)=>sentences(c.b).forEach(s=>pool.push({s,w:ci===S.i?2:0})));
 if(S.lesson.tip) sentences(S.lesson.tip).forEach(s=>pool.push({s,w:1}));
 let best=null, bs=0;
 for(const p of pool){ const k=keys(p.s); if(ak.length&&overlap(ak,k)>0) continue; const sc=overlap(qk,k)*2+p.w; if(sc>bs){ bs=sc; best=p.s; } }
 return best&&bs>=2?'Here is a closer clue: '+best:'Read the card '+where+' once more, slowly. The answer is in it.';
};

/* ============================ 2. CREW WHO NOTICE ============================ */
const REL={chief:['preflightinsp','parts','engine','systems','maint','power'],marshal:['preflightinsp','airports','safety','loading'],tech:['preflightinsp','maint','instruments'],
 ops:['airports','safety','night','charts','pattern'],tower:['radio','radio2','airspace','pattern','wxsvc','airports'],spotter:['types','heli','history','jet','mil','frontier'],
 captain:['airline','jet','careers','xc','wxsvc','adm','ppl'],host:[],instructor:null};
const FLp=()=>(H.fl?H.fl():{l:{},miss:{}});
const allAC=()=>{ const seen={}, out=[]; for(const m of (H.AC||[]).concat(H.HALL||[])) if(!seen[m.id]){ seen[m.id]=1; out.push(m); } return out; };
const spotted=()=>allAC().filter(m=>H.spotCount?H.spotCount(m.id)>0:false);
const isRotor=m=>{ const P=H.ACP&&H.ACP[m.id]; return !!(P&&P.dims&&P.dims.rotor); };
const games=()=>G.save.mod.games||{};
const played=id=>{ const g=games()[id]; return !!(g&&(g.plays||g.best)); };
/* lessons finished (not tested out) since this crew member last talked to you, in a unit they care about */
function recentLesson(npc,since){
 const f=FLp(), rel=REL[npc]; let best=null;
 for(const id in f.l){ const r=f.l[id]; if(!r||r.tested||!(r.at>since)) continue; const l=lessonById(id); if(!l||!l.tip) continue; if(rel&&rel.indexOf(l.unit)<0) continue; if(!best||r.at>f.l[best.id].at) best=l; }
 return best; }
const MILE=[1,5,10,25,50,100,150,200,300,400,500];
const CTX={
 instructor(o){ const out=[], f=FLp(), tot=H.totals?H.totals():{done:0,patches:0,missed:0};
  for(const u of H.units){ const P=H.unitProg(u.id); if(P.total&&P.all&&!P.patch&&(!H.unitOpen||H.unitOpen(u.id))){ out.push({key:'ck:'+u.id,pri:1,text:'Every '+T(UT(u))+' lesson is done. The checkride is next: '+H.checkPass+' of '+H.checkN+' right earns the patch.'}); break; } }
  let worst=null; for(const id in f.l){ const r=f.l[id]; if(r&&!r.tested&&r.runs>=2&&r.stars<=1&&(!worst||r.at>f.l[worst].at)) worst=id; }
  if(worst){ const l=lessonById(worst), r=f.l[worst]; if(l) out.push({key:'st:'+worst+':'+r.runs,pri:1,text:'“'+l.t+'” giving you trouble? Read its briefing cards once more before you fly it again. Every answer is in there.'}); }
  const nu=H.nextUnit&&H.nextUnit(); if(nu){ const P=H.unitProg(nu.id), l=(H.lessons[nu.id]||[])[P.next]; if(l) out.push({key:'nx:'+l.id,pri:2,text:'Next at your desk: “'+l.t+'”, in '+T(UT(nu))+'.'}); }
  const m=MILE.filter(x=>x<=tot.done).pop(); if(m&&m>1) out.push({key:'ms:'+m,pri:2,text:tot.done+' lessons flown. That is real ground school, cadet. Keep that pace.'});
  if(tot.patches>0){ const pm=[1,3,5,10,20,30,40,50].filter(x=>x<=tot.patches).pop(); if(pm) out.push({key:'pa:'+pm,pri:2,text:tot.patches+' unit patch'+(tot.patches>1?'es':'')+' on the PATCH WALL. You earned every one.'}); }
  if(tot.missed>=3) out.push({key:'mi:'+Math.floor(tot.missed/5),pri:3,text:tot.missed+' questions are waiting in HANGAR FLYING on the corkboard. Get one right and it comes off your list.'});
  const d=H.today?H.today():null, st=H.streak?H.streak():0; if(d&&st>0&&d.n<H.dailyGoal){ const need=H.dailyGoal-d.n; out.push({key:'dy:'+d.d,pri:3,text:'You are on a '+st+'-day FLIGHT DAYS streak. '+need+' more lesson'+(need>1?'s':'')+' today keeps it going.'}); }
  const hp=H.unitProg('heli'); if(hp&&hp.total&&!hp.done&&tot.done>=3) out.push({key:'new:heli',pri:3,text:'New on the Flight Path: HELICOPTERS, in the Beyond stage. Cyclic, collective, hovering, autorotation. It is open now.'});
  return out; },
 chief(o){ const out=[], n=spotted().length;
  if(!played('preflight')) out.push({key:'pf',pri:3,text:'A walk-around is how pilots find a problem while they are still safely on the ground. Try the PREFLIGHT RACE out at the parking stand.'});
  if(n>=3) out.push({key:'sp:'+Math.floor(n/5),pri:3,text:n+' aircraft spotted so far. The AIRCRAFT GALLERY on the wall has an ID card for every one.'});
  return out; },
 spotter(o){ const out=[], A=allAC(), S=spotted(), R=A.filter(isRotor), SR=S.filter(isRotor);
  if(S.length) out.push({key:'sp:'+S.length,pri:2,text:S.length+' of '+A.length+' spotted! '+(A.length-S.length?(A.length-S.length)+' to go, and every one has an ID card in the SPOTTER’S GUIDE.':'You have found them all. Now try for three stars on every card.')});
  if(S.length>=3&&SR.length<R.length) out.push({key:'ro:'+SR.length,pri:3,text:SR.length+' of '+R.length+' rotorcraft spotted. Look up top for the big rotor, then check the tail: a tail rotor, a fan in the fin, or nothing at all?'});
  return out; },
 tower(o){ const out=[], r=G.save.mod.radio||{}, w=H.wx&&H.wx.today?H.wx.today():null;
  if(!r.first) out.push({key:'fc',pri:1,text:'You have not called me on the radio yet. Tap CALL TOWER anywhere on the field and start with your call sign.'});
  if(w&&w.letter&&w.rwy) out.push({key:'at:'+(H.dayKey?H.dayKey(0):'')+':'+w.letter,pri:2,text:'Academy Field information '+w.letter+' is current: runway '+w.rwy+' in use. Listen to the ATIS before you call.'});
  return out; },
 captain(o){ const out=[], e=((G.save.mod.flog||{}).e||[]).filter(x=>x.k!=='sim'), n=e.length;
  if(!n) out.push({key:'lb0',pri:3,text:'Your logbook has no real flights in it yet. Next time you fly as a passenger, write it down in MY LOGBOOK.'});
  else out.push({key:'lb:'+Math.min(n,50),pri:2,text:n+' flight'+(n>1?'s':'')+' in your logbook. Every one is part of your flying story.'});
  return out; },
 host(o){ const out=[], g=games(), n=Object.keys(g).filter(k=>k!=='day'&&g[k]&&g[k].best).length;
  if(played('paper')) out.push({key:'rt',pri:3,text:'Out of throws in Paper Plane Toss? Answer the instructor’s quick lesson and you earn one more.'});
  if(n>=2) out.push({key:'hs:'+n,pri:3,text:'You have set scores in '+n+' games. The HIGH SCORES board keeps your best.'});
  return out; }
};
/* the line a crew member says on a repeat visit */
H.crewLine=function(n){
 const st=CT(), id=n.id, said=st.said[id]=st.said[id]||[], last=st.last[id]||{t:0,ctx:false}, lines=n._static||[];
 const cands=[]; const fn=CTX[id]; try{ if(fn) cands.push(...fn(n)); }catch(e){}
 const rl=recentLesson(id,last.t||0); if(rl&&id!=='instructor') cands.push({key:'rl:'+rl.id,pri:2,text:'You just flew “'+rl.t+'” in Ground School? Good. Remember: '+rl.tip});
 const rel=REL[id]; if(rel&&rel.length){ const u=H.units.find(u=>rel.indexOf(u.id)>=0&&H.lessons[u.id]&&H.unitProg(u.id).done===0&&(!H.unitOpen||H.unitOpen(u.id))); if(u) cands.push({key:'su:'+u.id,pri:3,text:'Want to know more about all this? The '+T(UT(u))+' unit on the Flight Path covers it.'}); }
 const fresh=cands.filter(c=>said.indexOf(c.key)<0).sort((a,b)=>a.pri-b.pri);
 let pick=null;
 if(fresh.length&&(fresh[0].pri===1||!last.ctx||!lines.length)) pick=fresh[0];
 let text;
 if(pick){ text=pick.text; said.push(pick.key); if(said.length>80) said.splice(0,said.length-80); st.last[id]={t:Date.now(),ctx:true}; }
 else if(lines.length){ const seen=st.seen[id]=st.seen[id]||[]; let i=-1; for(let k=0;k<lines.length;k++){ if(seen.indexOf(k)<0){ i=k; break; } }
  if(i<0){ const prev=seen[seen.length-1]; seen.length=0; i=prev===0&&lines.length>1?1:0; }
  seen.push(i); const l=lines[i]; text=typeof l==='function'?l():l; st.last[id]={t:Date.now(),ctx:false}; }
 else text='Good to see you, cadet.';
 G.persist(); return text;
};
/* every crew member's repeat-visit lines go through H.crewLine (their first meeting stays exactly as written) */
for(const k in G.WORLD.rooms) for(const n of G.WORLD.rooms[k].npcs||[]){ if(n._static) continue; n._static=(n.lines||[]).slice(); n.lines=[()=>H.crewLine(n)]; }

/* ============================ 3. NOBODY STAYS STUCK (the walkable rooms) ============================ */
const NEXT={classroom:['desk','board','review','library'],hangar:['preflight','gallery','cart','bench'],platform:['scope','toss','wx'],tower:['strips','atis','lightgun'],
 ramp:['myplane','signals','fuel'],wash:['washplane','shelf'],runway:['landing','taxi','depart'],lounge:['crewboard','trophy','locker'],gameroom:['scores','pool','darts']};
const IDLE=45, SHOW=8;
const SK={room:null,idle:0,lvl:0,b:null,lastT:0};
const reset=()=>{ SK.idle=0; SK.lvl=0; SK.b=null; };
const W=G.WORLD, pOpen=W.onOpen, pTalk=W.onTalk, pRoom=W.onRoom;
W.onOpen=function(s){ const r=G.world&&G.world.room&&G.world.room(); if(r&&s&&s.key){ CT().used[r+':'+s.key]=1; G.persist(); } reset(); return pOpen?pOpen.apply(this,arguments):undefined; };
W.onTalk=function(n,first){ reset(); return pTalk?pTalk.apply(this,arguments):undefined; };
W.onRoom=function(key,first){ SK.room=key; reset(); return pRoom?pRoom.apply(this,arguments):undefined; };
function dirWord(dx,dy){ const h=Math.abs(dx)>25?(dx<0?'left':'right'):null, v=Math.abs(dy)>25?(dy<0?'up':'down'):null;
 if(h&&v) return v+' and to your '+h; if(h) return 'to your '+h; if(v) return v==='up'?'up toward the back wall':'down toward the front of the room'; return 'right next to you'; }
const nameOf=s=>{ const n=String(s.label||'').split(':')[0].replace(/\s*\(.*\)$/,''); return (n.indexOf('MY ')===0?'':'the ')+n; };
function stuckText(R,sc,lvl){
 const near=sc.nearThing&&sc.nearThing(), keyW=W.keyHints&&W.keyHints();
 if(lvl===1){ const use='Tap USE'+(keyW&&keyW.use?' (or press '+keyW.use+')':'');
  if(near&&near.st) return use+' to open '+nameOf(near.st)+'.'; if(near&&(near.npc||near.crowd)) return use+' to talk to '+(near.npc?'the '+near.npc.name.toLowerCase():near.crowd.name)+'.';
  return 'Walk up to a sign, a screen or a person. When it glows, tap USE.'; }
 if(lvl===2){ const list=(NEXT[R.key]||[]).map(k=>(R.stations||[]).find(s=>s.key===k)).filter(Boolean); const used=CT().used;
  const s=list.find(x=>!used[R.key+':'+x.key])||list[0]; const ST=G.world&&G.world.state;
  if(s&&ST){ const p=s.foot?[(s.foot[0]+s.foot[2])/2,(s.foot[1]+s.foot[3])/2]:(s.wall?[s.x,R.wall||0]:[ST.px,ST.py]); const nm=nameOf(s); return nm.charAt(0).toUpperCase()+nm.slice(1)+' is '+dirWord(p[0]-ST.px,p[1]-ST.py)+'. Walk over and tap USE.'; }
  return 'Every glowing spot here does something. Walk to one and tap USE.'; }
 return 'Want to go somewhere else? Tap MAP to jump anywhere on the airfield, or open the FLIGHT PATH tab for your next lesson.';
}
const pFx=W.roomFx;
W.roomFx=function(c,R,phase,L){
 if(pFx) pFx.apply(this,arguments);
 if(phase!=='over') return;
 const sc=G.scene; if(G.sceneName!=='world'||!sc) return;
 const now=G.time||0, dt=Math.min(.25,Math.max(0,now-(SK.lastT||now))); SK.lastT=now;
 if(SK.room!==R.key){ SK.room=R.key; reset(); }
 if(sc.dlg){ SK.b=null; SK.idle=0; return; }   // a conversation clears the card at once
 if(sc.exitM||(sc.path&&sc.path.length)||(H.tut&&H.tut.active)) return;   // never during a walk-to, the exit question or the tutorial
 if(SK.b){ SK.b.t+=dt; if(SK.b.t>SHOW){ SK.b=null; SK.idle=0; } }
 else if(SK.lvl<3){ SK.idle+=dt; if(SK.idle>IDLE){ SK.lvl++; const who=(R.npcs||[])[0]; SK.b={t:0,who,text:stuckText(R,sc,SK.lvl)}; if(G.announce) G.announce((who?who.name+': ':'')+SK.b.text); } }
 if(!SK.b) return;
 /* the hint card: screen space, top left of the room view, clear of the MAP and TOWER buttons and of the labels lower down */
 const b=SK.b, who=b.who, k=G.k||1, a=G.rm()?1:Math.max(0,Math.min(1,b.t*4,(SHOW-b.t)*2));
 c.save(); c.setTransform(k,0,0,k,0,0); c.globalAlpha=a;
 const sz=6.2, x=6, w=VW-56, tx=x+(who?36:10), lines=G.wrap(b.text,sz,w-(tx-x)-8,700).slice(0,4), h=Math.max(who?36:22,(who?15:8)+lines.length*9+6), y=L.roomY+6;
 c.save(); if(!G.rm()){ c.shadowColor='rgba(0,0,0,.45)'; c.shadowBlur=10; c.shadowOffsetY=3; } G.rrect(x,y,w,h,10); c.fillStyle='rgba(250,246,236,.97)'; c.fill(); c.restore();
 G.rrect(x,y,w,h,10); c.strokeStyle=G.rgba(C.accent,.9); c.lineWidth=1; c.stroke();
 if(who){ G.drawPortrait(c,x+5,y+(h-26)/2,26,who.av||{},C.accent); G.txt(who.name,tx,y+5,4.8,'#8a6420','left',w-(tx-x)-8,800); }
 lines.forEach((l,i)=>G.txt(l,tx,y+(who?14:7)+i*9,sz,'#1d2733','left',w-(tx-x)-8,700));
 c.restore();
};
H.crewStuck=()=>({room:SK.room,idle:SK.idle,lvl:SK.lvl,bubble:SK.b&&SK.b.text});   // for QA
H.crewStuck.poke=v=>{ SK.idle=v; };   // QA: skip the wait
})();
