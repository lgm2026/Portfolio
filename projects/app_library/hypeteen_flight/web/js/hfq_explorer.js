/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* THE NORTH AMERICAN AVIATION EXPLORER (r7, Gate 6): real places to visit across the United States, Canada and Mexico,
   as an offline map AND an equivalent searchable directory (the directory is the full, accessible version; the map is the
   same data drawn on North America). Data: content/explorer/destinations.js (a verified starter set with sources). Map:
   content/lazy/explorer/basemap.js (Natural Earth, public domain), loaded the first time the map opens, then offline.
   Each place has a short learning card linked to a Ground School unit, a reflection prompt, access and safety notes, and
   its sources. "I visited" adds a SELF-REPORTED entry to the Flight Record. Visiting earns nothing academic: no XP, no
   badges, no phases. External links (the places' own websites) open only on a tap, after a notice that they leave the app.
   Visits: G.save.mod.visits[destId] = {at, entry}. */
(function(){
const H=G.HFQ, UI=H.UI, h=UI.h, T=UI.title;
const sfx=n=>{ try{ AUDIO.sfx(n); }catch(e){} };
const DEST=[]; let MAP=null;
H.addDestinations=function(list){ for(const d of list){ const i=DEST.findIndex(x=>x.id===d.id); if(i<0) DEST.push(d); else DEST[i]=d; } if(H.REG) H.REG.invalidate(); };
H.addBasemap=function(m){ MAP=m; MAP.k=prep(m); };
const CATS={museum:['Museum','#D9B25E'],space:['Spaceflight','#86B8FF'],field:['Historic airfield or first flight','#5FD38D'],memorial:['Memorial','#E8EDF5'],site:['Pioneer’s home','#F2A65A'],display:['Outdoor display','#C59BF5']};
const COUNTRY={US:'United States',CA:'Canada',MX:'Mexico'};
/* the explicit safety class every place carries (content/explorer/destinations.js) */
const SCLASS={indoor:'Indoor museum or visitor center',outdoor:'Outdoor site',ship:'Museum ship',airfield:'At a working airport',base:'On or beside a military base',memorial:'Memorial',
 'crash-memorial':'Memorial at an air-crash site'};
const X=H.EXPLORER={
 list:()=>DEST.slice(), byId:id=>DEST.find(d=>d.id===id)||null, cats:CATS, countries:COUNTRY, sclass:SCLASS,
 visits:()=>{ const m=G.save.mod; m.visits=m.visits||{}; return m.visits; },
 visited:id=>!!X.visits()[id],
 markVisited:(id,entry)=>{ if(!X.byId(id)) return; const v=X.visits(); v[id]=v[id]||{at:Date.now(),entry:entry||null}; if(entry) v[id].entry=entry; G.persist(); H.rec('visit',{dest:id},'dest:'+id); G.persist(); },
 project:(lat,lon)=>MAP?MAP.k(lat,lon):null, basemap:()=>MAP,
 coverage:()=>{ const c={}; DEST.forEach(d=>c[d.country]=(c[d.country]||0)+1); return c; }
};
UI.host('explorer',a=>a.dest?{view:'dest',args:{dest:a.dest},back:a.back||(H.isHub()?'hub':'world')}:{view:'explorer',args:{mode:a.mode||'map'},back:a.back||(H.isHub()?'hub':'world')});
/* the same conic equal-area formula d3 used to draw the map (tools/build_basemap.js), so pins land where they belong */
function prep(m){ const P=m.proj, r=Math.PI/180, y0=P.parallels[0]*r, y1=P.parallels[1]*r, sy0=Math.sin(y0), n=(sy0+Math.sin(y1))/2, c=1+sy0*(2*n-sy0), r0=Math.sqrt(c)/n;
 const raw=(x,y)=>{ const rr=Math.sqrt(c-2*n*Math.sin(y))/n; return [rr*Math.sin(x*n), r0-rr*Math.cos(x*n)]; };
 const ctr=raw(((P.center||[0,0])[0])*r,((P.center||[0,0])[1])*r);   // d3 places the (unrotated) center at the translate point
 return (lat,lon)=>{ let x=(lon+P.rotate[0])*r; if(x>Math.PI) x-=2*Math.PI; if(x<-Math.PI) x+=2*Math.PI; const p=raw(x,lat*r); return [P.translate[0]+P.scale*(p[0]-ctr[0]), P.translate[1]-P.scale*(p[1]-ctr[1])]; }; }
const loadMap=()=>MAP?Promise.resolve(MAP):H.loadContent('js/content/lazy/explorer/basemap.js').then(()=>{ if(!MAP) throw new Error('no map'); return MAP; });
X.loadMap=loadMap;

/* ---------------- filtering (shared by the map and the directory) ---------------- */
const FS=()=>{ const p=UI.prefs(), d={cat:'',country:'',vis:'',q:''}; p.explorer=p.explorer||{}; for(const k in d) if(!(k in p.explorer)) p.explorer[k]=d[k]; return p.explorer; };   // one live object, never a copy
function filtered(){ const f=FS(), words=f.q.toLowerCase().split(/\s+/).filter(Boolean);
 return DEST.filter(d=>(!f.cat||d.cat===f.cat)&&(!f.country||d.country===f.country)&&(!f.vis||(f.vis==='yes'?X.visited(d.id):!X.visited(d.id)))&&
  words.every(w=>(d.name+' '+d.city+' '+d.region+' '+COUNTRY[d.country]+' '+d.summary+' '+(CATS[d.cat]||[''])[0]).toLowerCase().indexOf(w)>=0)); }
function filterBar(onChange){ const f=FS(), wrap=h('div',{});
 const q=h('input',{type:'search',value:f.q,placeholder:'Search places, cities, states','aria-label':'Search the Explorer',oninput:()=>{ f.q=q.value; onChange(); }});
 wrap.appendChild(h('div',{class:'search'},UI.icon('search'),q));
 const g=h('div',{class:'filters scroll',role:'group','aria-label':'Kind of place'});
 [['','All kinds']].concat(Object.keys(CATS).map(k=>[k,CATS[k][0],CATS[k][1]])).forEach(([v,l,col])=>{ const b=h('button',{type:'button',class:'chip','aria-pressed':String(f.cat===v),onclick:()=>{ f.cat=v; [...g.children].forEach(c=>c.setAttribute('aria-pressed',String(c===b))); G.persist(); onChange(); }},col?h('span',{class:'dot',style:{background:col}}):null,l); g.appendChild(b); });
 wrap.appendChild(g);
 const sel=(label,opts,key)=>{ const s=h('select',{onchange:()=>{ f[key]=s.value; G.persist(); onChange(); }}); opts.forEach(([v,l])=>s.appendChild(h('option',{value:v,selected:f[key]===v,text:l}))); return h('label',{},h('span',{text:label}),s); };
 wrap.appendChild(h('div',{class:'selrow'},sel('Country',[['','All countries'],['US','United States'],['CA','Canada'],['MX','Mexico']],'country'),sel('Visits',[['','Any'],['yes','Visited'],['no','Not yet']],'vis')));
 return wrap; }

/* ============================ THE EXPLORER ============================ */
UI.define('explorer',{ title:'Explorer', sub:()=>DEST.length+' places to visit',
 actions:a=>[{icon:'info',label:'About this directory',onClick:()=>UI.show('explorerinfo')}],
 render(a,ctx){ const M=h('main',{}); const mode=a.mode||'map';
  const seg=h('div',{class:'seg',role:'tablist','aria-label':'Map or directory'});
  [['map','Map'],['list','Directory']].forEach(([v,l])=>seg.appendChild(h('button',{type:'button',role:'tab','aria-selected':String(mode===v),onclick:()=>{ a.mode=v; UI.refresh(); }},l)));
  M.appendChild(h('div',{class:'spread',style:{marginBottom:'10px'}},seg,h('span',{class:'count',id:'ex-count'})));
  const body=h('div',{});
  const redraw=()=>{ const L=filtered(); const cnt=document.getElementById('ex-count'); if(cnt) cnt.textContent=L.length+' of '+DEST.length+' places'; if(mode==='map') drawPins(L); else drawList(body,L); };
  M.appendChild(filterBar(redraw));
  M.appendChild(body);
  if(mode==='map') buildMap(body,a,redraw); else { drawList(body,filtered()); }
  M.appendChild(h('p',{class:'attrib',text:'A starter set checked on '+UI.date('2026-10-16')+', not every aviation place in North America. Hours and entry rules change: check each place’s website before you go. Map data: Natural Earth (public domain).'}));
  setTimeout(()=>{ const cnt=document.getElementById('ex-count'); if(cnt) cnt.textContent=filtered().length+' of '+DEST.length+' places'; },0);
  return M; }
});
function drawList(body,L){ UI.clear(body);
 if(!L.length){ body.appendChild(h('div',{class:'empty',text:'No places match. Clear a filter or try another word.'})); return; }
 for(const c of ['US','CA','MX']){ const in_c=L.filter(d=>d.country===c); if(!in_c.length) continue;
  body.appendChild(h('h2',{text:COUNTRY[c]}));
  const list=h('div',{class:'list'});
  in_c.slice().sort((x,y)=>(x.region+x.name).localeCompare(y.region+y.name)).forEach(d=>list.appendChild(UI.item(h('span',{class:'dot',style:{background:CATS[d.cat][1],width:'16px',height:'16px'}}),d.name,CATS[d.cat][0]+' • '+d.city+', '+d.region,X.visited(d.id)?'VISITED':'',()=>UI.show('dest',{dest:d.id}))));
  body.appendChild(list); } }

/* ---------------- the map: an SVG drawn from shipped data; pan, pinch, wheel, keys ---------------- */
const SVG='http://www.w3.org/2000/svg';
const sv=(tag,attrs)=>{ const e=document.createElementNS(SVG,tag); for(const k in attrs||{}) e.setAttribute(k,attrs[k]); return e; };
let M_=null;   // the live map: {svg, view, pins, sel}
function buildMap(body,a,redraw){
 const wrap=h('div',{class:'mapwrap',tabindex:'0','aria-label':'Map of North America. Arrow keys move, plus and minus zoom. Every place is also in the Directory.'});
 const info=h('div',{'aria-live':'polite',style:{marginTop:'10px'}});
 body.appendChild(wrap); body.appendChild(info);
 wrap.appendChild(h('div',{class:'empty',style:{margin:'20px'},text:'Loading the map…'}));
 loadMap().then(m=>{ UI.clear(wrap); const svg=sv('svg',{class:'map',viewBox:'0 0 '+m.w+' '+m.h,role:'group','aria-label':'Aviation places on a map of North America'});
  const base=sv('g',{});
  for(const c of m.countries){ const p=sv('path',{d:c.d,class:'ctry'+(c.na?' na':'')}); base.appendChild(p); }
  if(m.lakes) base.appendChild(sv('path',{d:m.lakes,class:'lake'}));
  if(m.subunits) base.appendChild(sv('path',{d:m.subunits,class:'sub'}));
  svg.appendChild(base); const pins=sv('g',{}); svg.appendChild(pins);
  wrap.appendChild(svg);
  const ctl=h('div',{class:'mapctl'},h('button',{class:'iconbtn',type:'button','aria-label':'Zoom in',onclick:()=>zoom(1.6)},UI.icon('plus')),h('button',{class:'iconbtn',type:'button','aria-label':'Zoom out',onclick:()=>zoom(1/1.6)},UI.icon('minus')),h('button',{class:'iconbtn',type:'button','aria-label':'Show all of North America',onclick:()=>{ M_.view={x:0,y:0,w:m.w,h:m.h}; apply(); }},UI.icon('globe')));
  wrap.appendChild(ctl);
  M_={svg,pins,info,m,view:a.view||{x:0,y:0,w:m.w,h:m.h},sel:a.sel||null,a};
  const pts=new Map(); let drag=null, moved=0;
  const toVB=(cx,cy)=>{ const r=svg.getBoundingClientRect(), v=M_.view, k=Math.max(v.w/r.width,v.h/r.height), ox=(r.width*k-v.w)/2, oy=(r.height*k-v.h)/2; return [v.x+(cx-r.left)*k-ox, v.y+(cy-r.top)*k-oy]; };
  function apply(){ const v=M_.view, m2=M_.m, minW=m2.w/10; v.w=Math.max(minW,Math.min(m2.w,v.w)); v.h=v.w*m2.h/m2.w; v.x=Math.max(-v.w*.25,Math.min(m2.w-v.w*.75,v.x)); v.y=Math.max(-v.h*.25,Math.min(m2.h-v.h*.75,v.y)); svg.setAttribute('viewBox',v.x+' '+v.y+' '+v.w+' '+v.h); M_.a.view=Object.assign({},v); drawPins(filtered()); }
  function zoom(f,cx,cy){ const v=M_.view; const c=cx!=null?toVB(cx,cy):[v.x+v.w/2,v.y+v.h/2]; const nw=Math.max(M_.m.w/10,Math.min(M_.m.w,v.w/f)), k=nw/v.w; v.x=c[0]-(c[0]-v.x)*k; v.y=c[1]-(c[1]-v.y)*k; v.w=nw; apply(); }
  M_.zoom=zoom; M_.apply=apply;
  svg.addEventListener('pointerdown',e=>{ svg.setPointerCapture(e.pointerId); pts.set(e.pointerId,[e.clientX,e.clientY]); moved=0; if(pts.size===1) drag={x:e.clientX,y:e.clientY}; else drag=null; });
  svg.addEventListener('pointermove',e=>{ if(!pts.has(e.pointerId)) return; const prev=pts.get(e.pointerId); pts.set(e.pointerId,[e.clientX,e.clientY]);
   if(pts.size===1&&drag){ const r=svg.getBoundingClientRect(), v=M_.view, k=Math.max(v.w/r.width,v.h/r.height); v.x-=(e.clientX-prev[0])*k; v.y-=(e.clientY-prev[1])*k; moved+=Math.abs(e.clientX-prev[0])+Math.abs(e.clientY-prev[1]); apply(); }
   else if(pts.size===2){ const [p1,p2]=[...pts.values()], other=[...pts.entries()].find(([id])=>id!==e.pointerId)[1]; const d0=Math.hypot(prev[0]-other[0],prev[1]-other[1]), d1=Math.hypot(p1[0]-p2[0],p1[1]-p2[1]); if(d0>0) zoom(d1/d0,(p1[0]+p2[0])/2,(p1[1]+p2[1])/2); moved+=10; } });
  const up=e=>{ pts.delete(e.pointerId); if(!pts.size) drag=null; };
  svg.addEventListener('pointerup',up); svg.addEventListener('pointercancel',up);
  svg.addEventListener('wheel',e=>{ e.preventDefault(); zoom(e.deltaY<0?1.25:1/1.25,e.clientX,e.clientY); },{passive:false});
  svg.addEventListener('dblclick',e=>{ zoom(1.8,e.clientX,e.clientY); });
  wrap.addEventListener('keydown',e=>{ if(e.target!==wrap) return; const v=M_.view, s=v.w*.12; let done=true;
   if(e.key==='ArrowLeft') v.x-=s; else if(e.key==='ArrowRight') v.x+=s; else if(e.key==='ArrowUp') v.y-=s; else if(e.key==='ArrowDown') v.y+=s; else if(e.key==='+'||e.key==='=') { zoom(1.4); return e.preventDefault(); } else if(e.key==='-'||e.key==='_'){ zoom(1/1.4); return e.preventDefault(); } else done=false;
   if(done){ e.preventDefault(); apply(); } });
  M_.wasDrag=()=>moved>8;
  apply(); if(M_.sel) showInfo(X.byId(M_.sel));
 }).catch(()=>{ UI.clear(wrap); wrap.appendChild(h('div',{class:'empty',style:{margin:'20px'}},'The map has not loaded on this device yet, and it needs the internet the first time. The ',h('button',{class:'btn ghost',type:'button',onclick:()=>{ M_=null; const a2=UI.stack().slice(-1)[0]; if(a2) a2.args.mode='list'; UI.replace('explorer',{mode:'list'}); }},'Directory'),' has every place and works offline.')); });
}
function drawPins(L){ if(!M_||!M_.svg.isConnected) return; const {pins,svg,view}=M_; while(pins.firstChild) pins.removeChild(pins.firstChild);
 const r=svg.getBoundingClientRect(), k=Math.max(view.w/Math.max(1,r.width),view.h/Math.max(1,r.height)), R=Math.max(5.5,Math.min(10,7))*k, cell=30*k;
 // cluster nearby pins in screen space so a crowded coast stays tappable
 const groups=[]; for(const d of L){ const p=X.project(d.lat,d.lon); if(!p) continue; let g=groups.find(g=>Math.hypot(g.x-p[0],g.y-p[1])<cell); if(g){ g.items.push(d); g.x=(g.x*(g.items.length-1)+p[0])/g.items.length; g.y=(g.y*(g.items.length-1)+p[1])/g.items.length; } else groups.push({x:p[0],y:p[1],items:[d]}); }
 for(const g of groups){
  if(g.items.length===1){ const d=g.items[0], sel=M_.sel===d.id; const el=sv('g',{class:'pin'+(sel?' sel':''),tabindex:'0',role:'button','aria-label':d.name+', '+CATS[d.cat][0]+', '+d.city+(X.visited(d.id)?', visited':'')});
   el.appendChild(sv('circle',{cx:g.x,cy:g.y,r:R*(sel?1.35:1),fill:CATS[d.cat][1]}));
   if(X.visited(d.id)) el.appendChild(sv('circle',{cx:g.x,cy:g.y,r:R*.38,fill:'#0A1828'}));
   const go=()=>{ if(M_.wasDrag&&M_.wasDrag()) return; M_.sel=d.id; M_.a.sel=d.id; sfx('blip'); showInfo(d); drawPins(filtered()); };
   el.addEventListener('click',go); el.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); M_.sel=d.id; showInfo(d); UI.show('dest',{dest:d.id}); } });
   pins.appendChild(el); }
  else { const el=sv('g',{class:'pin cluster',tabindex:'0',role:'button','aria-label':g.items.length+' places here: '+g.items.map(d=>d.name).join(', ')+'. Zoom in to separate them.'});
   el.appendChild(sv('circle',{cx:g.x,cy:g.y,r:R*1.7,fill:'#E6C477'})); const t=sv('text',{x:g.x,y:g.y+R*.5,'text-anchor':'middle',style:'font-size:'+(R*1.35).toFixed(2)+'px'}); t.textContent=String(g.items.length); el.appendChild(t);
   const go=()=>{ if(M_.wasDrag&&M_.wasDrag()) return; const v=M_.view, nw=Math.max(M_.m.w/10,v.w/2.2); v.x=g.x-nw/2; v.y=g.y-nw*M_.m.h/M_.m.w/2; v.w=nw; M_.apply(); };
   el.addEventListener('click',go); el.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); go(); } }); pins.appendChild(el); }
 } }
function showInfo(d){ if(!M_||!d) return; const I=M_.info; UI.clear(I);
 I.appendChild(h('div',{class:'card'},h('div',{class:'spread'},h('div',{},h('b',{text:d.name}),h('div',{class:'small muted',text:CATS[d.cat][0]+' • '+d.city+', '+d.region+', '+COUNTRY[d.country]})),X.visited(d.id)?h('span',{class:'chip good',text:'Visited'}):null),
  h('p',{class:'small',style:{margin:'8px 0'},text:d.summary}),h('button',{class:'btn primary',type:'button',onclick:()=>UI.show('dest',{dest:d.id})},'Open',UI.icon('right')))); }

/* ============================ ONE PLACE ============================ */
UI.define('dest',{ title:a=>{ const d=X.byId(a.dest); return d?d.name:'Place'; }, sub:a=>{ const d=X.byId(a.dest); return d?CATS[d.cat][0]+' • '+COUNTRY[d.country]:''; },
 render(a){ const d=X.byId(a.dest), M=h('main',{}); if(!d) return h('p',{text:'This place is not in the Explorer.'});
  const v=X.visits()[d.id];
  M.appendChild(h('div',{class:'row'},h('span',{class:'chip'},h('span',{class:'dot',style:{background:CATS[d.cat][1]}}),CATS[d.cat][0]),h('span',{class:'chip',text:d.city+', '+d.region}),v?h('span',{class:'chip good',text:'Visited '+UI.date(v.at)}):null));
  if(d.sclass==='crash-memorial') M.appendChild(h('div',{class:'note warn',role:'note',style:{marginTop:'12px'},text:'A memorial where an aircraft came down. It is a place of remembrance: talk about it with a parent or guardian before you visit.'}));
  M.appendChild(h('p',{class:'lede',style:{marginTop:'12px'},text:d.summary}));
  M.appendChild(h('div',{class:'card flat'},h('span',{class:'eyebrow',text:'The story'}),h('p',{style:{margin:'6px 0 0'},text:d.history})));
  if(d.learn){ const u=H.units.find(x=>x.id===d.learn.unit); if(u) M.appendChild(h('div',{class:'card hi',style:{marginTop:'12px'}},h('span',{class:'eyebrow',text:'Learn it in the academy'}),h('p',{style:{margin:'6px 0 10px'},text:T(u.t)+': '+T(u.s)}),h('button',{class:'btn',type:'button',onclick:()=>{ if(H.isHub()) UI.show('unit',{unit:u.id}); else UI.go('route',{unit:u.id,back:'explorer'}); }},UI.icon('path'),'Open the unit'))); }
  M.appendChild(h('div',{class:'card flat',style:{marginTop:'12px'}},h('span',{class:'eyebrow',text:'Think about it'}),h('p',{style:{margin:'6px 0 0'},text:d.prompt})));
  M.appendChild(h('h2',{text:'Before you go'}));
  const dl=h('dl',{class:'kv'}); const kv=(k,val)=>{ dl.appendChild(h('dt',{text:k})); dl.appendChild(h('dd',{text:val})); };
  kv('Kind of visit',SCLASS[d.sclass]||'Public place'); kv('Getting in',d.access); kv('Stay safe',d.safety); kv('Where',d.city+', '+d.region+', '+COUNTRY[d.country]); kv('Coordinates',d.lat.toFixed(4)+', '+d.lon.toFixed(4));
  M.appendChild(dl);
  M.appendChild(h('div',{class:'note',style:{marginTop:'12px'},text:'Visit with a parent or guardian. The academy never needs a visit: lessons, badges and phases are all earned in the app.'}));
  M.appendChild(h('div',{class:'row',style:{marginTop:'14px'}},h('button',{class:'btn primary',type:'button',onclick:()=>UI.go('record',{back:G.sceneName,view:'jedit',args:{type:d.cat==='memorial'||d.cat==='site'||d.cat==='field'?'site':(d.cat==='display'?'site':'museum'),title:d.name,place:d.city+', '+d.region,dest:d.id}})},UI.icon('check'),v?'Add another visit':'I visited (self-reported)')));
  M.appendChild(h('h2',{text:'Sources'}));
  const S=h('div',{class:'list'}); d.src.forEach(s=>S.appendChild(UI.item('globe',s.t,s.u.replace(/^https?:\/\//,'').replace(/\/$/,''),'',()=>outside(s.u,s.t)))); M.appendChild(S);
  M.appendChild(h('p',{class:'tiny muted',style:{marginTop:'8px'},text:'Checked '+UI.date(d.checked)+'. No photos are included for this place.'}));
  return M; }
});
/* outside links: say so first (they need the internet and leave the app) */
function outside(u,t){ UI.dialog({title:'Open a website?',body:h('div',{},h('p',{text:t}),h('p',{class:'small muted',text:'This opens outside the academy, in your browser, and needs the internet. That website has its own rules and privacy terms.'})),actions:[{label:'Stay here',kind:'ghost'},{label:'Open it',kind:'primary',onClick:()=>{ try{ const w=window.open(u,'_blank','noopener,noreferrer'); if(w) w.opener=null; }catch(e){} }}]}); }
UI.define('explorerinfo',{ title:'About the Explorer', sub:'Coverage and sources',
 render(){ const M=h('main',{}), c=X.coverage();
  M.appendChild(h('p',{class:'lede',text:'A starter set of '+DEST.length+' aviation places that welcome visitors: '+(c.US||0)+' in the United States, '+(c.CA||0)+' in Canada and '+(c.MX||0)+' in Mexico. It is not every aviation place in North America; more will be added over time.'}));
  M.appendChild(h('div',{class:'card flat stack'},h('p',{text:'Every place lists its sources and the date they were checked. Coordinates come from the sources shown on each place. Opening hours, prices and entry rules change often, so each page asks families to check the official website before going.'}),
   h('p',{text:'Only places open to the public are listed, and each is marked with the kind of visit it is: an indoor museum, an outdoor site, a museum ship, a working airport, a military base, or a memorial. Memorials, including those where an aircraft came down, are included with care and are visit-only: no game or quiz is attached to them. The Explorer never points to wreckage, restricted areas, hazardous places or private property.'}),
   h('p',{text:'The map is drawn from Natural Earth data (public domain), shipped inside the app, so it works offline. Nothing is sent anywhere when you browse it.'})));
  return M; }
});
/* search: every place */
H.REG.extra.push(()=>DEST.map(d=>({id:'dest:'+d.id,kind:'dest',dest:d.id,title:d.name,sub:CATS[d.cat][0]+' • '+d.city+', '+d.region,cat:'Explorer',icon:'pin',objective:d.summary,prereq:'None.',assess:'None. Visits are self-reported and earn nothing academic.',est:null,diff:1,
 words:[d.city,d.region,COUNTRY[d.country],d.summary,d.history].join(' '),avail:()=>({ok:true,why:''}),status:()=>({done:X.visited(d.id),label:X.visited(d.id)?'VISITED':''}),launch:back=>{ G.go('explorer',{dest:d.id,back}); return true; }})));
})();
