/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* NOTICES (r7.4): rewards sized to what they mean, kept out of the way of reading and play.
   Every G.toast(msg, colour, meta) lands here (the engine's G.award / G.ach pass meta: {kind:'xp'|'badge', ...}; other files pass
   {kind:'phase'|'step'|'aircraft'|'patch', tier}). Three tiers:
   TIER 1  routine progress: XP, steps, the first-day badges (ENROLLED, LOCKER READY, MY TRAINER...), short info lines.
           A small ticker in the top bar, over the subtitle line (chrome, never content), 1.8 s. XP arriving together is
           added up into one line ("+70 XP • ENROLLED • LOCKER READY"); first-day badges share one line too.
   TIER 2  meaningful achievements: most badges, a new aircraft, a unit patch; and warnings. A compact card just under the top
           bar, clear of the corner buttons, 2.8 s. During play (a lesson question, a game round, a conversation, the first
           briefing) it shrinks to the ticker instead, so nothing covers the action.
   TIER 3  major milestones: a new academy phase, a stage graduation, GROUND SCHOOL MASTER, HALL OF FLIGHT, CLUBHOUSE LEGEND,
           LIBRARIAN. A centred card that waits for a calm moment (results, the airfield, the Hub; never mid-question or
           mid-round), dims lightly, and closes with a tap, Escape or after 5 s.
   One of each tier at a time; the rest queue. Reduced motion: no slide, no glow, no sparkle. On the HTML screens the same
   notices render as HTML (the ticker under the header). Screen readers hear every notice (G.announce).
   History: G.save.mod.notes (the last 80 badges, phases, steps, aircraft and patches, with dates), shown on Achievements. */
(function(){
const H=G.HFQ, C=G.C, VW=G.VW, UI=H.UI;
const TIER3=new Set(['spotall','games27','librarian','goldall','grad','stugrad','prvgrad','topsky']);
const QUIET=new Set(['enrolled','styled','mytrainer','briefed','newsreader','student','arcade','reader','flightlog','radio']);   // first-day badges: tier 1
const ALERT=c=>c===C.warn||c===C.bad||c==='#ffb020'||c==='#ff6b6b';
G.noticeSfx=true;   // the engine leaves badge sounds to this file (one per tier)
function classify(msg,col,meta){ const m=Object.assign({},meta||{}), k=m.kind||'';
 if(k==='badge'){ m.tier=m.tier||(TIER3.has(m.id)?3:(QUIET.has(m.id)?1:2)); return m; }
 if(k==='xp'){ m.tier=1; return m; }
 if(m.tier) { m.kind=k||'info'; return m; }
 if(ALERT(col)) return {kind:'alert',tier:2};
 return {kind:'info',tier:1}; }
/* the history (meaningful kinds only) */
const LOGGED={badge:1,phase:1,step:1,aircraft:1,patch:1};
function remember(m,msg){ if(!LOGGED[m.kind]||!G.save||!G.save.mod) return; const L=(G.save.mod.notes=G.save.mod.notes||[]); L.push({at:Date.now(),msg,tier:m.tier,kind:m.kind,id:m.id||null}); if(L.length>80) L.splice(0,L.length-80); }
H.noteHistory=()=>((G.save&&G.save.mod&&G.save.mod.notes)||[]).slice().reverse();

/* ---------------- the queue (G.toasts keeps one entry per call, as before; display merges) ---------------- */
G.toast=function(msg,col,meta){ msg=String(msg); const m=classify(msg,col,meta), now=performance.now();
 if(G.toasts.some(t=>t.msg===msg&&!t.gone&&now-t.at<2000)) return;   // the same words twice in a row: once
 G.toasts.push({msg,col:col||'#fff',meta:m,at:now}); if(G.toasts.length>30) G.toasts.splice(0,G.toasts.length-30);
 remember(m,msg); G.announce(msg); };
G.clearToasts=function(){ G.toasts=[]; S.tick=S.card=S.cel=null; syncHTML(); };
const S={tick:null,card:null,cel:null};
const pending=()=>G.toasts.filter(t=>!t.shown);
const settle=list=>list.forEach(t=>{ t.shown=true; });
const clip=(s,n)=>s.length>n?s.slice(0,n-1)+'…':s;
/* is now a calm moment? (results screens, the airfield with nothing open, the Hub and the Library) */
function calm(){ const n=G.sceneName||'', sc=G.scene||{};
 if(H.tut&&H.tut.active) return false; if(G.fade>.05||G.pending) return false;
 if(UI&&UI.visible()) return n!=='terms';
 if(n==='world') return !sc.dlg&&!sc.exitM;
 if(n==='lesson') return sc.phase==='done'&&sc.t>.8;
 if(n==='quiz') return !!sc.over&&sc.over.t>.6; if(n==='flash') return !!sc.done;
 if(n.indexOf('g_')===0) return !!sc.over&&sc.over.t>1;
 return ['path','logbook','dash','groundschool','route','fleet','games','practice','crew','flightlog','inspect','map','board','radio'].indexOf(n)>=0&&!sc.sheet&&!(sc.mode==='flow'); }
/* busy: someone is mid-question, mid-round, mid-sentence */
function busy(){ return !calm(); }
function sfxFor(n){ try{ if(n.tier===3) AUDIO.jingle('fanfare'); else if(n.tier===2&&n.kind!=='alert') AUDIO.sfx(busy()?'point':'cheer'); }catch(e){} }

/* routine progress arriving together becomes ONE line: the XP added up, the first-day badges named once, a step-up folded in
   ("+65 XP • BADGES: ENROLLED • LOCKER READY • STEP II"). An XP label that is also a badge's name is not repeated. */
const PROG={xp:1,badge:1,step:1};
function takeTick(){ const P=pending().filter(t=>t.meta.tier===1); if(!P.length) return null; const first=P[0];
 if(PROG[first.meta.kind]){ const batch=P.filter(t=>PROG[t.meta.kind]); settle(batch);
  const xs=batch.filter(t=>t.meta.kind==='xp'), qb=batch.filter(t=>t.meta.kind==='badge'), st=batch.filter(t=>t.meta.kind==='step'), pts=xs.reduce((s,t)=>s+(t.meta.pts||0),0);
  const names=qb.map(t=>t.meta.name), labels=[...new Set(xs.map(t=>t.meta.label).filter(l=>l&&names.indexOf(l)<0))];
  const parts=[]; if(pts) parts.push('+'+pts+' XP'); if(names.length) parts.push((names.length>1?'BADGES: ':'BADGE: ')+names.join(' • ')); else if(labels.length) parts.push(labels.slice(0,2).join(' • ')+(labels.length>2?' +'+(labels.length-2):''));
  if(st.length) parts.push('STEP '+String(st[st.length-1].msg).trim().split(' ').pop());   // "STEP II": the phase is in the top bar
  return {kind:names.length?'badge':(pts?'xp':'step'),text:clip(parts.join(' • '),78),col:C.accentHi,icon:names.length?'medal':(pts?'star':'chevrons'),dur:Math.min(3.2,1.8+parts.length*.45),list:batch}; }
 settle([first]); return {kind:first.meta.kind,text:first.msg,col:first.col&&first.col!=='#fff'?first.col:C.ink,icon:first.meta.kind==='step'?'chevrons':null,dur:Math.min(3,1.6+first.msg.length/60),list:[first]}; }
function takeCard(){ const P=pending().filter(t=>t.meta.tier===2); if(!P.length) return null; const first=P[0];
 if(first.meta.kind==='badge'){ const qb=P.filter(t=>t.meta.kind==='badge'); settle(qb); const b=(G.CFG.badges||[]).find(x=>x.id===qb[0].meta.id)||{};
  return qb.length>1?{kind:'badge',title:qb.length+' NEW BADGES',sub:clip(qb.map(t=>t.meta.name).join(' • '),70),id:qb[0].meta.id,tier:2,dur:3.2}:{kind:'badge',title:'BADGE: '+qb[0].meta.name,sub:b.d||'',id:qb[0].meta.id,tier:2,dur:2.8}; }
 settle([first]); const m=first.meta, sp=first.msg.split(': ');
 return {kind:m.kind,title:m.title||(sp.length>1?sp[0]:first.msg),sub:m.sub||(sp.length>1?sp.slice(1).join(': '):''),id:m.id||null,tier:2,dur:m.kind==='alert'?Math.min(4,2.2+first.msg.length/50):2.8,alert:m.kind==='alert',icon:m.icon||(m.kind==='aircraft'?'plane':(m.kind==='patch'?'medal':(m.kind==='alert'?'bell':'star')))}; }
function takeCel(){ const P=pending().filter(t=>t.meta.tier===3); if(!P.length) return null; const t=P[0]; settle([t]); const m=t.meta, b=m.kind==='badge'?(G.CFG.badges||[]).find(x=>x.id===m.id)||{}:{};
 return {kind:m.kind,eyebrow:m.kind==='phase'?'NEW ACADEMY PHASE':'MILESTONE',title:m.kind==='badge'?m.name:(m.title||t.msg.replace(/^NEW PHASE: /,'')),sub:m.sub||b.d||'',id:m.id||null,tier:3,dur:5}; }

/* ---------------- each frame ---------------- */
function step(dt){
 /* a milestone has the stage to itself: while it shows, the ticker and the card wait (their clocks stop) */
 const order=S.cel?['cel']:['tick','card','cel'];
 for(const k of order){ const n=S[k]; if(n){ n.t+=dt; if(n.t>=n.dur+(k==='cel'?0:.3)){ S[k]=null; (n.list||[]).forEach(t=>{ t.gone=true; }); } } }
 if(!S.cel&&calm()){ const n=takeCel(); if(n){ n.t=0; S.cel=n; sfxFor(n); } }
 if(S.cel) return;
 if(!S.card){ const P=pending().filter(t=>t.meta.tier===2);
  if(P.length){ if(calm()||P[0].meta.kind==='alert'){ const n=takeCard(); if(n){ n.t=0; S.card=n; sfxFor(n); } }
   else if(!S.tick){ const n=takeCard(); if(n){ n.t=0; S.tick={kind:n.kind,text:n.title,col:C.accentHi,icon:n.icon||'medal',dur:2.4,t:0}; sfxFor(n); } } } }
 if(!S.tick){ const n=takeTick(); if(n){ n.t=0; S.tick=n; } }
 G.toasts=G.toasts.filter(t=>!t.gone||performance.now()-t.at<4000);   // shown ones linger briefly (tests and screen readers read the array)
}
const fade=(n,inT,outT)=>{ if(G.rm()) return 1; const a=Math.min(1,n.t/inT), b=Math.min(1,Math.max(0,(n.dur+(n===S.cel?0:.3)-n.t)/outT)); return Math.min(a,b); };
/* the ticker sits over the top bar's subtitle line (chrome, not content); the title screen has no bar, so it goes low */
function tickY(){ return G.sceneName==='title'?G.VH-44:23; }
function drawTick(c,n){ const a=fade(n,.15,.3), sz=5.8, txt=n.text, iw=n.icon?11:0, w=Math.min(VW-108,G.tw(txt,sz,800)+20+iw), x=VW/2-w/2, y=tickY(), h=14;
 c.save(); c.globalAlpha=a; G.rrect(x,y,w,h,7); c.fillStyle='rgba(10,24,40,.95)'; c.fill(); c.strokeStyle=G.rgba(C.accent,.55); c.lineWidth=.8; c.stroke();
 if(n.icon) G.icon(n.icon,c,x+10,y+7,8,n.col||C.accentHi);
 G.txt(txt,VW/2+iw/2,y+3.7,sz,n.col||C.ink,'center',w-14-iw,800); c.restore(); }
function drawCard(c,n){ const a=fade(n,.2,.35), right=G.sceneName==='world'?54:10, x=10, w=VW-x-right, h=34, y=46+(G.rm()?0:(1-Math.min(1,n.t/.2))*-6);
 c.save(); c.globalAlpha=a; if(!G.rm()){ c.shadowColor='rgba(0,0,0,.45)'; c.shadowBlur=10; c.shadowOffsetY=3; }
 G.rrect(x,y,w,h,10); c.fillStyle=n.alert?'rgba(52,26,10,.97)':'rgba(16,38,61,.97)'; c.fill(); c.restore();
 c.save(); c.globalAlpha=a; G.rrect(x,y,w,h,10); c.strokeStyle=n.alert?G.rgba(C.warn,.85):G.rgba(C.accentHi,.75); c.lineWidth=1; c.stroke();
 if(n.kind==='badge'&&n.id&&H.drawBadge) H.drawBadge(c,x+18,y+h/2,10.5,n.id,true); else { c.beginPath(); c.arc(x+18,y+h/2,10,0,7); c.fillStyle=n.alert?G.rgba(C.warn,.18):G.rgba(C.accent,.2); c.fill(); G.icon(n.icon||'star',c,x+18,y+h/2,11,n.alert?C.warn:C.accentHi); }
 G.txt(n.title,x+34,y+(n.sub?6:12),6.8,n.alert?C.warn:C.accentHi,'left',w-42,800);
 if(n.sub) G.txt(n.sub,x+34,y+19,5.2,C.sub,'left',w-42,700);
 c.restore(); }
function drawCel(c,n){ const a=fade(n,.25,.4), VH=G.VH, w=VW-44, h=166, x=22, y=Math.round(VH*.3-h/2+30), k=G.rm()?1:Math.min(1,.92+n.t*.4);
 c.save(); c.globalAlpha=a*.55; c.fillStyle='#000'; c.fillRect(0,0,VW,VH); c.restore();
 c.save(); c.globalAlpha=a; c.translate(VW/2,y+h/2); c.scale(k,k); c.translate(-VW/2,-(y+h/2));
 G.panel(x,y,w,h,{r:18,border:G.rgba(C.accentHi,.8)});
 if(!G.rm()){ const g=c.createRadialGradient(VW/2,y+46,4,VW/2,y+46,70); g.addColorStop(0,G.rgba(C.accentHi,.28)); g.addColorStop(1,G.rgba(C.accentHi,0)); c.fillStyle=g; c.fillRect(x,y,w,100); }
 if(n.kind==='badge'&&n.id&&H.drawBadge) H.drawBadge(c,VW/2,y+44,24,n.id,true);
 else { c.beginPath(); c.arc(VW/2,y+44,24,0,7); c.fillStyle=G.rgba(C.accent,.22); c.fill(); c.strokeStyle=G.rgba(C.accentHi,.8); c.lineWidth=1.4; c.stroke(); G.icon(n.kind==='phase'?'book':'trophy',c,VW/2,y+44,24,C.accentHi); }
 G.txt(n.eyebrow,VW/2,y+78,5.4,C.dim,'center',w-20,800);
 G.txt(n.title,VW/2,y+89,10,C.titleGold||C.title,'center',w-24,800);
 if(n.sub) G.para(n.sub,VW/2,y+108,6.2,C.sub,'center',w-34,8.8,700);
 if(n.t>.6) G.txt('TAP TO CONTINUE',VW/2,y+h-15,5.2,C.accentText,'center',undefined,800);
 c.restore(); }
G.drawNotices=function(c,dt){ step(dt); syncHTML(); if(UI&&UI.visible()) return;
 if(S.cel){ drawCel(c,S.cel); return; } if(S.card) drawCard(c,S.card); if(S.tick) drawTick(c,S.tick); };
/* a milestone card takes the tap that closes it (so the tap never lands on what is underneath) */
G.preUpdate=function(){ const n=S.cel; if(!n||(UI&&UI.visible())) return false;
 if(n.t>.6&&(G.ptr.click||G.pressed.a||G.pressed.b)){ G.ptr.click=false; G.pressed.a=false; G.pressed.b=false; n.dur=Math.min(n.dur,n.t+.25); AUDIO.sfx('ok'); }
 return true; };

/* ---------------- the HTML screens: the same notices, as HTML ---------------- */
let el=null, shownKey='';
function syncHTML(){ if(!(UI&&UI.visible())){ if(el&&el.parentNode){ el.parentNode.removeChild(el); el=null; shownKey=''; } return; }
 const root=document.getElementById('ui'); if(!root) return;
 if(!el){ el=document.createElement('div'); el.className='notices'; el.setAttribute('aria-hidden','true'); root.appendChild(el); }   // G.announce already speaks each one
 const key=(S.cel?'cel|'+S.cel.title:[S.tick&&S.tick.text,S.card&&S.card.title].join('|'))+(G.sceneName==='terms'?'|gate':''); if(key===shownKey) return; shownKey=key;
 while(el.firstChild) el.removeChild(el.firstChild);
 const h=UI.h;
 const gate=G.sceneName==='terms';   // the Terms gate is a reading screen with no top bar: a ticker or card would sit on its text, so neither shows there (they are quiet notices; the history keeps them)
 if(S.tick&&!S.cel&&!gate) el.appendChild(h('div',{class:'n-tick'},S.tick.text));
 if(S.card&&!S.cel&&!gate){ const src=S.card.kind==='badge'&&S.card.id&&H.badgeSrc?H.badgeSrc(S.card.id):null; el.appendChild(h('div',{class:'n-card'+(S.card.alert?' alert':'')},src?h('img',{src,alt:'',width:'40',height:'40'}):UI.icon(S.card.icon||'star'),h('div',{},h('b',{text:S.card.title}),S.card.sub?h('small',{text:S.card.sub}):null))); }
 if(S.cel){ const n=S.cel, src=n.kind==='badge'&&n.id&&H.badgeSrc?H.badgeSrc(n.id):null;
  const card=h('div',{class:'n-cel',role:'dialog','aria-label':n.eyebrow+': '+n.title},src?h('img',{src,alt:'',width:'96',height:'96'}):UI.icon(n.kind==='phase'?'book':'trophy','big'),h('small',{text:n.eyebrow}),h('h2',{text:n.title}),n.sub?h('p',{text:n.sub}):null,
   h('button',{class:'btn primary',type:'button',onclick:()=>{ n.dur=Math.min(n.dur,n.t+.1); }},'Continue'));
  el.appendChild(h('div',{class:'n-scrim',onclick:e=>{ if(e.target.classList.contains('n-scrim')) n.dur=Math.min(n.dur,n.t+.1); }},card)); el.removeAttribute('aria-hidden'); setTimeout(()=>{ const b=card.querySelector('button'); if(b) b.focus({preventScroll:true}); },30); }
 else el.setAttribute('aria-hidden','true'); }
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&S.cel&&UI&&UI.visible()){ S.cel.dur=Math.min(S.cel.dur,S.cel.t+.1); e.stopPropagation(); } },true);
/* HTML-only status lines (e.g. "Opening the book…") join the same queue */
if(UI) UI.toast=function(msg){ G.toast(msg,C.info,{kind:'info',tier:1}); };
H.notices=S;   // for tests
})();
