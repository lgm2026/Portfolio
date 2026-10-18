/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* AIRCRAFT ID CARDS + THE SPOTTER'S GUIDE (r7.4).
   Every aircraft has an ID card (content: js/content/aircraft_cards.js, H.addAircraftInfo): who built it, when it first flew,
   what it is for, what to look for, one checked fact, its story and how to tell it from look-alikes.
   - Plane Spotter shows a compact card after every answer, right or wrong (hfq_g_spot.js), with a MORE page.
   - The Spotter's Guide (G.go('spotguide')) collects the cards: the academy fleet is open from the start; a Hall of Flight card
     is collected by naming that aircraft in Plane Spotter. Each correct spot adds to the card: 1 spot = collected (one star),
     3 = silver (two), 5 = gold (three).
   - The full card (G.go('idcard',{id})) is an accessible HTML page with the drawing, the facts table and the sources.
   Progress: G.save.mod.cadet.spotN = {id: correct spots}. Older saves count an aircraft already spotted as one spot. */
(function(){
const H=G.HFQ, UI=H.UI, h=UI.h;
H.ACINFO=H.ACINFO||{};
H.addAircraftInfo=function(map){ for(const k in map) H.ACINFO[k]=Object.assign({},H.ACINFO[k]||{},map[k]); };
const cad=()=>(G.save.mod.cadet=G.save.mod.cadet||{});
H.spotCount=id=>Math.max(((cad().spotN||{})[id])||0,H.isSpotted&&H.isSpotted(id)?1:0);
H.noteSpot=function(id){ const c=cad(); c.spotN=c.spotN||{}; c.spotN[id]=H.spotCount(id)+1; G.persist(); return c.spotN[id]; };
H.spotStars=id=>{ const n=H.spotCount(id); return n>=5?3:(n>=3?2:(n>=1?1:0)); };
H.STAR_AT=[1,3,5];
H.cardOpen=id=>{ const m=H.acById(id); return !(m&&m.hall)||H.isSpotted(id); };   // the fleet's cards are open; Hall cards are collected by spotting
/* the aircraft the spotter may show and name: only those whose drawing has been checked against the real thing */
H.spotOK=m=>!!(m&&H.ACP&&H.ACP[m.id]&&!H.ACP[m.id].review);
H.guideList=()=>H.AC.concat(H.HALL).filter(H.spotOK);
const yr=s=>{ const m=String(s||'').match(/\b(1[789]\d\d|20\d\d)\b/); return m?m[1]:''; };
/* the short card for the canvas (Plane Spotter): plain strings, ready to wrap */
H.idCardBrief=function(id){ const m=H.acById(id), I=H.ACINFO[id]||{};
 const alike=(I.alike||[])[0], am=alike&&H.acById(alike[0]);
 const size=[I.L&&('LENGTH '+I.L),I.S&&((/rotor/i.test(I.S)?'ROTOR ':(/across/i.test(I.S)?'WIDTH ':'WINGSPAN '))+I.S.replace(/ rotors?$/,'')),I.Ht&&('HEIGHT '+I.Ht)].filter(Boolean);
 return {name:m.name,meta:[I.m,(yr(I.f)||m.year)?'FIRST FLEW '+(yr(I.f)||m.year):'',I.r||m.role].filter(Boolean).join(' • ').toUpperCase(),
  look:(I.look||[m.clue||'']).slice(0,2),fact:I.fact||(m.facts||[''])[0],hist:I.hist||(m.facts||['',''])[1]||'',size,
  alike:am?{name:am.name,how:alike[1]}:null,stars:H.spotStars(id),n:H.spotCount(id)}; };

/* ---------------- drawings inside the HTML pages ---------------- */
function acCanvas(id,w,hh,o){ o=o||{}; const dpr=Math.min(3,window.devicePixelRatio||1), cv=h('canvas',{width:String(Math.round(w*dpr)),height:String(Math.round(hh*dpr)),class:'acfig'+(o.locked?' locked':''),role:'img','aria-label':o.label||'',style:{width:'100%',maxWidth:w+'px',aspectRatio:w+' / '+hh}});
 const c=cv.getContext('2d'); c.scale(dpr,dpr);
 const g=c.createLinearGradient(0,0,0,hh); g.addColorStop(0,o.locked?'#1a2a3c':'#5d8fc9'); g.addColorStop(.75,o.locked?'#22374f':'#b9d3ea'); g.addColorStop(1,o.locked?'#1a2a3c':'#8aa0b4'); c.fillStyle=g; c.fillRect(0,0,w,hh);
 try{ const mine=H.myAC&&H.myAC().id===id?H.myAC().paint:null;
  H.drawAC(c,id,w*.04,hh*.02,w*.92,hh*.96,o.locked?{body:'#0d1726',stripe:'#0d1726'}:mine,{ground:!o.locked,lights:!o.locked}); }catch(e){}
 return cv; }
const stars=(n,big)=>h('span',{class:'stars'+(big?' big':''),'aria-label':n?n+' of 3 stars':'Not collected yet'},[1,2,3].map(i=>h('i',{class:i<=n?'on':'',text:'★'})));
/* aircraft names in normal capitals: model codes keep theirs (PA-28, SR20, B-17, UH-60, Ka-32, MiG-21, Dr.I, XIII) */
const SPECIAL={'MIG-21':'MiG-21','KA-32':'Ka-32','DR.I':'Dr.I','JETRANGER':'JetRanger','(HUEY)':'(Huey)','(ÉCUREUIL)':'(Écureuil)','SPAD':'SPAD','NOTAR':'NOTAR','(NOTAR)':'(NOTAR)','LZ':'LZ','CJ':'CJ','MK':'Mk','MD':'MD','MCDONNELL':'McDonnell'};
H.acName=function(name){ return String(name||'').split(' ').map(w=>{ if(SPECIAL[w]) return SPECIAL[w]; if(/\d/.test(w)||/^[IVX]+$/.test(w)||/^S\.[IVX]+$/.test(w)||/^C\.\d/.test(w)) return w;
  return w.toLowerCase().replace(/(^|[(\-])(\p{L})/gu,(m,a,b)=>a+b.toUpperCase()); }).join(' ').replace(/\b(Of|The|And)\b/g,m=>m.toLowerCase()); };
const T=UI.title, N=H.acName;

/* ---------------- the Spotter's Guide ---------------- */
UI.host('spotguide',a=>({view:'spotguide',args:{},back:a.back||'fleet'}));
UI.host('idcard',a=>({view:'idcard',args:{id:a.id},back:a.back||'fleet'}));
function counts(){ const L=H.guideList(), hall=L.filter(m=>m.hall);
 return {all:L.length,hall:hall.length,got:hall.filter(m=>H.isSpotted(m.id)).length,gold:L.filter(m=>H.spotStars(m.id)===3).length,spotted:L.filter(m=>H.spotCount(m.id)>0).length}; }
UI.define('spotguide',{ title:'Spotter’s Guide', sub:()=>{ const k=counts(); return k.got+' of '+k.hall+' Hall of Flight cards • '+k.gold+' gold'; },
 render(){ const M=h('main',{class:'guide'}), k=counts();
  M.appendChild(h('p',{class:'lede',text:'Every aircraft has an ID card. Name an aircraft in Plane Spotter to collect its card. Spot it again to earn stars: one star for 1 spot, two for 3, three (gold) for 5.'}));
  M.appendChild(h('div',{class:'meter',role:'progressbar','aria-valuemin':'0','aria-valuemax':String(k.hall),'aria-valuenow':String(k.got),'aria-label':'Hall of Flight cards collected'},h('i',{style:{width:Math.round(100*k.got/Math.max(1,k.hall))+'%'}})));
  M.appendChild(h('div',{class:'row',style:{marginTop:'12px'}},h('button',{class:'btn primary',type:'button',onclick:()=>{ AUDIO.sfx('ok'); UI.go('g_spot',{back:'spotguide'}); }},UI.icon('search'),' Play Plane Spotter')));
  const grid=(list)=>{ const G2=h('div',{class:'cards'}); for(const m of list){ const open=H.cardOpen(m.id), st=H.spotStars(m.id);
    G2.appendChild(h('button',{class:'accard'+(open?'':' locked'),type:'button','aria-label':(open?N(m.name):'Locked card')+(open?', '+(st?st+' stars':'not spotted yet'):''),onclick:()=>UI.show('idcard',{id:m.id})},
     acCanvas(m.id,220,110,{locked:!open,label:open?'Drawing of the '+N(m.name):'A dark silhouette: not collected yet'}),
     h('b',{text:open?N(m.name):'?  ?  ?'}),h('small',{text:open?(m.year?m.year+' • ':'')+T(m.role||''):'Spot it to collect'}),open?stars(st):null)); }
   return G2; };
  M.appendChild(h('h2',{text:'The academy fleet'})); M.appendChild(grid(H.AC.filter(H.spotOK)));
  for(const cat of H.HALL_CATS){ const L=H.HALL.filter(m=>m.cat===cat&&H.spotOK(m)); if(!L.length) continue; M.appendChild(h('h2',{text:T(cat)})); M.appendChild(grid(L)); }
  M.appendChild(h('p',{class:'tiny muted',style:{marginTop:'18px'},text:'Drawings are side views made from each aircraft’s real length, height and shape. No logos or markings.'}));
  return M; }
});

/* ---------------- one ID card ---------------- */
UI.define('idcard',{ title:a=>{ const m=H.acById(a.id); return H.cardOpen(a.id)?N(m.name):'A locked card'; }, sub:a=>{ const m=H.acById(a.id), I=H.ACINFO[a.id]||{}; return H.cardOpen(a.id)?[yr(I.f)||m.year,T(I.r||m.role||'')].filter(Boolean).join(' • '):'Spot it in Plane Spotter'; },
 render(a){ const m=H.acById(a.id), I=H.ACINFO[a.id]||{}, open=H.cardOpen(a.id), M=h('main',{class:'idcard'});
  M.appendChild(h('figure',{class:'idfig'+(open?'':' locked')},acCanvas(a.id,560,280,{locked:!open,label:open?'Side view of the '+N(m.name):'A dark silhouette of an aircraft you have not spotted yet'})));
  if(!open){ M.appendChild(h('section',{class:'card flat'},h('p',{class:'lede',text:'You haven’t spotted this one yet.'}),h('p',{},h('b',{text:'Look for: '}),m.clue||''),
    h('div',{class:'row'},h('button',{class:'btn primary',type:'button',onclick:()=>{ AUDIO.sfx('ok'); UI.go('g_spot',{back:'spotguide'}); }},'Play Plane Spotter')))); return M; }
  const st=H.spotStars(a.id), n=H.spotCount(a.id), next=H.STAR_AT.find(x=>x>n);
  M.appendChild(h('div',{class:'idprog'},stars(st,true),h('span',{text:n?('Spotted '+UI.plural(n,'time')+(next?' • '+(next-n)+' more for the next star':' • gold card!')):(m.hall?'':'Spot it in Plane Spotter to earn stars')})));
  const dl=h('dl',{class:'facts'}), row=(k,v)=>{ if(v){ dl.appendChild(h('dt',{text:k})); dl.appendChild(h('dd',{text:v})); } };
  row('Made by',I.m); row('First flight',I.f||(m.year?String(m.year):'')); row('Kind',I.t); row('What it does',I.r||T(m.role||'')); row('On board',I.p);
  row('Length',I.L); row(I.S&&/rotor/i.test(I.S)?'Rotor':(I.S&&/across/i.test(I.S)?'Width':'Wingspan'),I.S); row('Height',I.Ht);
  M.appendChild(h('section',{class:'card flat'},h('h2',{text:'Quick facts'}),dl));
  if((I.look||[]).length){ const ul=h('ul',{class:'plain'}); I.look.forEach(t=>ul.appendChild(h('li',{text:t}))); M.appendChild(h('h2',{text:'What to look for'})); M.appendChild(h('div',{class:'card flat'},ul)); }
  if(I.fact) { M.appendChild(h('h2',{text:'Did you know?'})); M.appendChild(h('div',{class:'card flat'},h('p',{text:I.fact}))); }
  const story=[I.hist].concat((m.facts||[]).filter(f=>f&&f!==I.fact&&f!==I.hist)).filter(Boolean);
  if(story.length){ M.appendChild(h('h2',{text:'Its story'})); M.appendChild(h('div',{class:'card flat'},story.map(t=>h('p',{text:t})))); }
  if((I.alike||[]).length){ M.appendChild(h('h2',{text:'Don’t mix it up with'})); const L=h('div',{class:'list'});
   for(const [id2,how] of I.alike){ const m2=H.acById(id2), open2=H.cardOpen(id2); L.appendChild(UI.item('plane',N(m2.name),how,open2?'OPEN':'LOCKED',open2?()=>UI.show('idcard',{id:id2}):null)); }
   M.appendChild(L); }
  if(I.src) M.appendChild(h('p',{class:'tiny muted',style:{marginTop:'16px'},text:'Sources: '+I.src+'.'}));
  const acts=h('div',{class:'row',style:{marginTop:'14px'}});
  if(H.acUnlocked(a.id)&&H.myAC().id!==a.id&&m.kind!=='airliner') acts.appendChild(h('button',{class:'btn',type:'button',onclick:()=>{ H.setMyAC(a.id); AUDIO.sfx('engine'); UI.toast('My aircraft: '+N(m.name)); UI.refresh(); }},'Make it my aircraft'));
  acts.appendChild(h('button',{class:'btn ghost',type:'button',onclick:()=>{ AUDIO.sfx('ok'); UI.go('g_spot',{back:'spotguide'}); }},'Play Plane Spotter'));
  M.appendChild(acts);
  return M; }
});
})();
