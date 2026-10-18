/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* THE FLIGHT RECORD (r7, Gate 5): the Pilot Success Inventory. It grows out of the Cadet Logbook and the Flight Log and
   keeps three things clearly apart:
   1. WHAT I LEARNED: the verified record. Lessons, unit tiers, checkrides, book quizzes and badges, with dates, recorded by
      the app itself (H.verified, H.recLog). Records from before r7 show what was done, not each attempt.
   2. WHAT I DID: self-reported real-world experiences, marked SELF-REPORTED everywhere. Real flights stay in the Flight Log
      (passenger, discovery and training flights; sim time never counts as flight time). Museums, airports, airshows,
      aircraft sightings, historic sites and other experiences are journal entries here, with optional notes, a reflection
      and, when the Family Lead allows it on this device, up to four photos.
   3. WHAT'S NEXT: topics to practice (missed questions), the next step on the Flight Path, and the cadet's own goals.
   None of it is an FAA logbook or a credential. Self-reported entries earn no XP and no badges, and nothing here is ever
   posted to the Crew Board or sent anywhere.
   Journal: G.save.mod.journal = {v:1, e:[{id, type, d, place, dest, ac, title, note, refl, media:[ids], src:'self', v, cr, up}],
            goals:[{id, t, done, cr}]}.  Photos: IndexedDB (hfq_store.js), owner = the profile id. */
(function(){
const H=G.HFQ, UI=H.UI, h=UI.h, T=UI.title;
const sfx=n=>{ try{ AUDIO.sfx(n); }catch(e){} };
UI.host('record',a=>({view:a.view||'record',args:a.args||{tab:a.tab||'learned'},back:a.back||(H.isHub()?'hub':'world')}));
const J=()=>{ const m=G.save.mod; m.journal=m.journal||{v:1,e:[],goals:[]}; m.journal.e=m.journal.e||[]; m.journal.goals=m.journal.goals||[]; return m.journal; };
H.journal=J;
const TYPES=[['museum','Museum visit','map'],['airport','Airport visit','pin'],['airshow','Airshow','star'],['sighting','Aircraft sighting','eye'],['site','Historic site or memorial','flag'],['event','Aviation event or camp','cal'],['other','Other experience','record']];
H.JOURNAL_TYPES=TYPES;
const typeOf=k=>TYPES.find(t=>t[0]===k)||TYPES[TYPES.length-1];
const LIM={place:60,ac:40,title:60,note:400,refl:400,goal:80};
const owner=()=>(G.activeAcct&&G.activeAcct.id)||'guest';
H.photosAllowed=()=>!!(G.roster&&G.roster.photos);
const clean=(s,n)=>String(s||'').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,'').replace(/\s+/g,' ').trim().slice(0,n);
const cleanBlock=(s,n)=>String(s||'').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,'').replace(/\r\n?/g,'\n').replace(/\n{3,}/g,'\n\n').trim().slice(0,n);
H.journalAdd=function(o){ const now=Date.now(), e={id:H.store.newId('j'),type:typeOf(o.type)[0],d:/^\d{4}-\d{2}-\d{2}$/.test(o.d)?o.d:UI.ymd(),place:clean(o.place,LIM.place),dest:o.dest?String(o.dest).slice(0,40):null,ac:clean(o.ac,LIM.ac),title:clean(o.title,LIM.title),note:cleanBlock(o.note,LIM.note),refl:cleanBlock(o.refl,LIM.refl),media:(o.media||[]).slice(0,4),src:'self',v:1,cr:now,up:now};
 J().e.push(e); G.persist(); H.rec('journal',{type:e.type},'journal:'+e.id); G.persist(); return e; };
H.journalUpdate=function(id,o){ const e=J().e.find(x=>x.id===id); if(!e) return null; ['place','ac','title'].forEach(k=>{ if(k in o) e[k]=clean(o[k],LIM[k]); }); ['note','refl'].forEach(k=>{ if(k in o) e[k]=cleanBlock(o[k],LIM[k]); }); if(o.type) e.type=typeOf(o.type)[0]; if(o.d&&/^\d{4}-\d{2}-\d{2}$/.test(o.d)) e.d=o.d; if(o.media) e.media=o.media.slice(0,4); e.up=Date.now(); G.persist(); return e; };
H.journalRemove=function(id){ const j=J(), e=j.e.find(x=>x.id===id); if(!e) return; (e.media||[]).forEach(m=>{ if(H.store.ok) H.store.del('media',m).catch(()=>{}); }); j.e=j.e.filter(x=>x.id!==id); G.persist(); };

/* ---------------- photos: decoded, shrunk, re-encoded (that strips location and camera data), thumbnails ---------------- */
const MAX_IN=25*1024*1024, MAX_DIM=12000, OUT_DIM=1600, THUMB=320, OK_TYPES=/^image\/(jpeg|png|webp|gif|heic|heif)$/;
function decode(blob){ if(window.createImageBitmap) return createImageBitmap(blob); return new Promise((res,rej)=>{ const u=URL.createObjectURL(blob), im=new Image(); im.onload=()=>{ URL.revokeObjectURL(u); res(im); }; im.onerror=()=>{ URL.revokeObjectURL(u); rej(new Error('not an image')); }; im.src=u; }); }
function encode(src,max,q){ const w0=src.width, h0=src.height, k=Math.min(1,max/Math.max(w0,h0)), w=Math.max(1,Math.round(w0*k)), hh=Math.max(1,Math.round(h0*k)); const c=document.createElement('canvas'); c.width=w; c.height=hh; const x=c.getContext('2d'); x.fillStyle='#fff'; x.fillRect(0,0,w,hh); x.drawImage(src,0,0,w,hh); return new Promise((res,rej)=>c.toBlob(b=>b?res({blob:b,w,h:hh}):rej(new Error('encode failed')),'image/jpeg',q)); }
H.photoFrom=async function(file,entryId){
 if(!H.store.ok) throw new Error('Photos need storage this browser is not giving the app (a private window?).');
 if(!file||file.size>MAX_IN) throw new Error('That photo is too big (25 MB at most).');
 if(file.type&&!OK_TYPES.test(file.type)) throw new Error('That file is not a photo.');
 const img=await decode(file).catch(()=>{ throw new Error('That photo could not be opened. Try a JPEG or PNG.'); });
 if(!img.width||!img.height||img.width>MAX_DIM||img.height>MAX_DIM) throw new Error('That photo’s size is not supported.');
 const big=await encode(img,OUT_DIM,.82), th=await encode(img,THUMB,.78); if(img.close) img.close();
 const rec={id:H.store.newId('p'),owner:owner(),entry:entryId||null,type:'image/jpeg',blob:big.blob,thumb:th.blob,w:big.w,h:big.h,bytes:big.blob.size,cr:Date.now()};
 await H.store.put('media',rec); return rec;
};
const urls=new Map();
const thumbURL=async id=>{ if(urls.has(id)) return urls.get(id); const r=await H.store.get('media',id).catch(()=>null); if(!r) return null; const u=URL.createObjectURL(r.thumb||r.blob); urls.set(id,u); return u; };
const fullURL=async id=>{ const r=await H.store.get('media',id).catch(()=>null); return r?URL.createObjectURL(r.blob):null; };
function thumbs(ids,onRemove){ const box=h('div',{class:'thumbs'}); (ids||[]).forEach(id=>{ const im=h('img',{alt:'Photo',loading:'lazy'}); const wrap=h('div',{style:{position:'relative'}},h('button',{type:'button',class:'card flat',style:{padding:'0',border:'0',background:'none'},'aria-label':'Open photo',onclick:async()=>{ const u=await fullURL(id); if(u) UI.dialog({title:'Photo',body:h('img',{src:u,alt:'Photo',style:{width:'100%',borderRadius:'12px'}}),actions:[{label:'Close',kind:'primary'}],onClose:()=>URL.revokeObjectURL(u)}); }},im),
  onRemove?h('button',{type:'button',class:'iconbtn','aria-label':'Remove this photo',style:{position:'absolute',top:'4px',right:'4px',minHeight:'32px',minWidth:'32px',padding:'0'},onclick:()=>{ onRemove(id); wrap.remove(); }},UI.icon('close')):null);
  thumbURL(id).then(u=>{ if(u) im.src=u; else im.alt='Photo not on this device'; }); box.appendChild(wrap); }); return box; }

/* ============================ THE RECORD ============================ */
const TABS=[['learned','What I learned'],['did','What I did'],['next','What’s next']];
UI.define('record',{ title:'Flight Record', sub:()=>G.who(),
 actions:()=>[{icon:'download',label:'Print or save as PDF',onClick:()=>{ try{ window.print(); }catch(e){} }}],
 render(a){ const M=h('main',{}), tab=a.tab||'learned';
  const tl=h('div',{class:'tabs',role:'tablist','aria-label':'Flight Record'});
  TABS.forEach(([k,l])=>tl.appendChild(h('button',{type:'button',role:'tab','aria-selected':String(k===tab),id:'tab-'+k,'aria-controls':'panel-'+k,onclick:()=>{ a.tab=k; UI.refresh(); }},l)));
  M.appendChild(tl);
  const P=h('section',{role:'tabpanel',id:'panel-'+tab,'aria-labelledby':'tab-'+tab});
  if(tab==='learned') learned(P); else if(tab==='did') did(P,a); else next(P);
  M.appendChild(P);
  M.appendChild(h('p',{class:'tiny muted',style:{marginTop:'26px'},text:'The Flight Record is not an FAA logbook and not a certificate. What I learned is recorded by this app on this device; it cannot be independently verified. What I did is self-reported. Time in the academy’s trainer is never flight time.'}));
  return M; }
});
function learned(P){ const V=H.verified();
 P.appendChild(h('div',{class:'stats'},h('div',{class:'stat'},h('b',{text:String(V.lessons.length)}),h('span',{text:'Lessons flown'})),h('div',{class:'stat'},h('b',{text:String(V.units.filter(u=>u.patch).length)}),h('span',{text:'Unit patches'})),h('div',{class:'stat'},h('b',{text:String(V.units.filter(u=>u.tier===3).length)}),h('span',{text:'Gold units'})),h('div',{class:'stat'},h('b',{text:String(V.quizzes.filter(q=>q.passed).length)}),h('span',{text:'Book quizzes passed'})),h('div',{class:'stat'},h('b',{text:String(V.badges.length)}),h('span',{text:'Badges'})),h('div',{class:'stat'},h('b',{text:String(V.xp)}),h('span',{text:'XP'}))));
 P.appendChild(h('p',{class:'row',style:{marginTop:'10px'}},h('span',{class:'chip good provenance',text:'Recorded by the app'}),h('span',{class:'small muted',text:'Phase '+(V.rank.phase+1)+': '+T(V.rank.phaseN)+', step '+V.rank.stepN})));
 P.appendChild(h('h2',{text:'Units'}));
 const started=V.units.filter(u=>u.done||u.patch);
 if(!started.length) P.appendChild(h('div',{class:'empty',text:'Fly your first lesson and it shows up here.'}));
 else { const L=h('div',{class:'list'}); started.forEach(u=>L.appendChild(UI.item(h('span',{class:'tier'+(u.tier?' t'+u.tier:'')}),T(u.t),u.done+' of '+u.total+' lessons • '+u.stars+' stars'+(u.tested?' • tested out':'')+(u.drill&&u.drill.best?' • drill best '+u.drill.best+'/10':''),u.tierName||'STARTED',H.isHub()?()=>UI.show('unit',{unit:u.id}):null))); P.appendChild(L); }
 P.appendChild(h('h2',{text:'Book quizzes'}));
 if(!V.quizzes.length) P.appendChild(h('div',{class:'empty',text:'Read a Library book and take its quiz.'})); else { const L=h('div',{class:'list'}); V.quizzes.forEach(q=>L.appendChild(UI.item('book',T(q.t),'Best '+q.best+' of '+q.n+' • '+UI.plural(q.plays,'try','tries'),q.aced?'ACED':(q.passed?'PASSED':'NOT YET'),null))); P.appendChild(L); }
 P.appendChild(h('h2',{text:'Badges'}));
 if(!V.badges.length) P.appendChild(h('div',{class:'empty',text:'No badges yet.'})); else { const L=h('div',{class:'list'}); V.badges.forEach(b=>{ const src=H.badgeSrc&&H.badgeSrc(b.id); L.appendChild(UI.item(src?h('img',{class:'badgeart',src,alt:'',width:'44',height:'44'}):'medal',T(b.n),UI.date(b.at),'',null)); }); P.appendChild(L); }
 P.appendChild(h('h2',{text:'Recent results'}));
 const log=V.log.filter(x=>['lesson','checkride','quiz','game','testout','read','readseries'].indexOf(x.k)>=0).slice(-25).reverse();
 if(!log.length) P.appendChild(h('div',{class:'empty',text:'Results recorded from now on show here, with the date and the score.'}));
 else { const L=h('div',{class:'list'}); log.forEach(x=>{ const act=H.REG.get(x.a), r=x.r||{}; let line='';
   if(x.k==='lesson') line=r.stars+' ★ • '+(r.misses||0)+' missed'; else if(x.k==='checkride') line=r.score+' of '+r.n+(r.pass?' • passed':' • not yet'); else if(x.k==='quiz') line=(r.mode||'quiz')+': '+r.right+' of '+r.n+(r.passed?' • passed':''); else if(x.k==='game') line='score '+(r.score!=null?r.score:'-'); else if(x.k==='testout') line='tested out'; else line='read';
   L.appendChild(UI.item(x.k==='game'?'games':(x.k==='quiz'||x.k==='checkride'?'check':'plane'),act?act.title:x.a,line,UI.date(x.t),null)); }); P.appendChild(L); }
 const before=G.save.mod.migratedAt&&V.lessons.some(l=>l.at&&l.at<G.save.mod.migratedAt);
 if(before) P.appendChild(h('p',{class:'small muted',style:{marginTop:'10px'},text:'Lessons and badges from before this version are listed with what was achieved; the app did not keep each attempt then, so none are shown or made up.'}));
}
function did(P,a){
 const F=H.flog?H.flog.all().filter(e=>e.k!=='sim'):[], E=J().e.slice().sort((x,y)=>(y.d||'').localeCompare(x.d||'')||y.cr-x.cr);
 P.appendChild(h('div',{class:'note warn'},h('b',{text:'Self-reported. '}),'These are your own notes about real flights, places and experiences. The app cannot check them, and they never count toward lessons, badges or phases.'));
 P.appendChild(h('div',{class:'row',style:{margin:'14px 0'}},h('button',{class:'btn primary',type:'button',onclick:()=>UI.show('jedit',{})},UI.icon('plus'),'Add an experience'),h('button',{class:'btn',type:'button',onclick:()=>UI.go('logflight',{back:G.sceneName})},UI.icon('plane'),'Log a real flight'),h('button',{class:'btn ghost',type:'button',onclick:()=>UI.go('flightlog',{back:G.sceneName})},'Open the Flight Log')));
 P.appendChild(h('h2',{text:'Real flights'}));
 if(!F.length) P.appendChild(h('div',{class:'empty',text:'Rode in an airliner, took a discovery flight or a lesson? Log it in the Flight Log.'}));
 else { const L=h('div',{class:'list'}); F.slice(0,40).forEach(e=>{ const tg=H.flogTag?H.flogTag(e)[0]:''; L.appendChild(UI.item('plane',(e.fr||'?')+' → '+(e.to||'?'),T(tg)+' • '+((e.ac&&e.ac.t)?T(e.ac.t):'')+(e.k==='dual'&&e.min?' • '+e.min+' min':''),UI.date(e.d),null)); }); P.appendChild(L); }
 P.appendChild(h('h2',{text:'Places and experiences'}));
 if(!E.length) P.appendChild(h('div',{class:'empty',text:'Been to an aviation museum, an airshow or an airport observation deck? Add it here. The Explorer can add a visit for you.'}));
 else { const L=h('div',{class:'list'}); E.forEach(e=>{ const t=typeOf(e.type); L.appendChild(UI.item(t[2],e.title||e.place||t[1],t[1]+(e.place&&e.title?' • '+e.place:'')+((e.media||[]).length?' • '+UI.plural(e.media.length,'photo'):''),UI.date(e.d),()=>UI.show('jentry',{id:e.id}))); }); P.appendChild(L); }
}
function next(P){
 const nx=UI.nextLesson&&UI.nextLesson(), tp=H.toPractice(), g=J().goals;
 P.appendChild(h('h2',{text:'Next on the Flight Path'}));
 if(nx&&nx.n){ const L=nx.n.k==='lesson'?(H.lessons[nx.u.id]||[])[nx.n.i]:null; P.appendChild(h('div',{class:'card hi'},h('h3',{text:L?L.t:'Checkride: '+T(nx.u.t)}),h('p',{class:'small muted',text:T(nx.u.t)}),h('button',{class:'btn primary',type:'button',onclick:()=>H.REG.launch(L?'lesson:'+L.id:'check:'+nx.u.id,G.sceneName)},'Go'))); }
 else P.appendChild(h('div',{class:'empty',text:'Every open unit is SILVER or better. Go for GOLD, or explore BEYOND.'}));
 P.appendChild(h('h2',{text:'Topics to practice'}));
 if(!tp.length) P.appendChild(h('div',{class:'empty',text:'No missed questions waiting. Nice flying.'}));
 else { const L=h('div',{class:'list'}); tp.slice(0,8).forEach(t=>L.appendChild(UI.item('chat',T(t.t),UI.plural(t.n,'missed question'),'PRACTICE',()=>H.REG.launch('review',G.sceneName)))); P.appendChild(L); }
 P.appendChild(h('h2',{text:'My goals'}));
 P.appendChild(h('p',{class:'small muted',text:'Your own aviation goals: a museum to see, an airshow, a discovery flight. Only you see them.'}));
 const inp=h('input',{type:'text',maxlength:String(LIM.goal),placeholder:'Add a goal (for example: see a Space Shuttle)','aria-label':'New goal'});
 P.appendChild(h('form',{class:'row',onsubmit:e=>{ e.preventDefault(); const t=clean(inp.value,LIM.goal); if(!t) return; J().goals.push({id:H.store.newId('g'),t,done:0,cr:Date.now()}); G.persist(); sfx('ok'); UI.refresh(); }},h('div',{style:{flex:'1',minWidth:'200px'}},inp),h('button',{class:'btn',type:'submit'},UI.icon('plus'),'Add')));
 const L=h('div',{class:'list',style:{marginTop:'10px'}});
 g.forEach(x=>{ const id='goal-'+x.id; const cb=h('input',{type:'checkbox',id,checked:!!x.done,style:{width:'22px',height:'22px',accentColor:'#D9B25E'},onchange:()=>{ x.done=cb.checked?Date.now():0; G.persist(); sfx('ok'); UI.refresh(); }});
  L.appendChild(h('div',{class:'item',style:{cursor:'default'}},cb,h('label',{for:id,class:'grow'},h('b',{text:x.t,style:x.done?{textDecoration:'line-through',color:'var(--dim)'}:{}}),x.done?h('small',{text:'Done '+UI.date(x.done)}):null),h('button',{class:'iconbtn',type:'button','aria-label':'Remove goal',onclick:()=>{ J().goals=J().goals.filter(y=>y!==x); G.persist(); UI.refresh(); }},UI.icon('trash')))); });
 if(g.length) P.appendChild(L);
}

/* ============================ ONE ENTRY ============================ */
UI.define('jentry',{ title:a=>{ const e=J().e.find(x=>x.id===a.id); return e?(e.title||e.place||typeOf(e.type)[1]):'Entry'; }, sub:'Self-reported',
 render(a){ const e=J().e.find(x=>x.id===a.id), M=h('main',{}); if(!e) return h('p',{text:'This entry is gone.'}); const t=typeOf(e.type);
  M.appendChild(h('div',{class:'row'},h('span',{class:'chip self provenance',text:'Self-reported'}),h('span',{class:'chip',text:t[1]}),h('span',{class:'chip',text:UI.date(e.d)})));
  const dl=h('dl',{class:'kv',style:{marginTop:'14px'}}); const kv=(k,v)=>{ if(v){ dl.appendChild(h('dt',{text:k})); dl.appendChild(h('dd',{text:v})); } };
  kv('Where',e.place); kv('Aircraft',e.ac); if(e.dest&&H.EXPLORER){ const d=H.EXPLORER.byId(e.dest); if(d) kv('Explorer',d.name); }
  M.appendChild(dl);
  if(e.note) M.appendChild(h('div',{class:'card flat',style:{marginTop:'12px'}},h('span',{class:'eyebrow',text:'Notes'}),h('p',{style:{whiteSpace:'pre-wrap',margin:'6px 0 0'},text:e.note})));
  if(e.refl) M.appendChild(h('div',{class:'card flat',style:{marginTop:'12px'}},h('span',{class:'eyebrow',text:'What I want to remember'}),h('p',{style:{whiteSpace:'pre-wrap',margin:'6px 0 0'},text:e.refl})));
  if((e.media||[]).length) M.appendChild(thumbs(e.media));
  M.appendChild(h('div',{class:'row',style:{marginTop:'16px'}},h('button',{class:'btn',type:'button',onclick:()=>UI.show('jedit',{id:e.id})},UI.icon('edit'),'Edit'),h('button',{class:'btn danger',type:'button',onclick:async()=>{ if(await UI.confirm('Delete this entry?',['It and its photos are removed from this device.'],'Delete',{danger:true})){ H.journalRemove(e.id); UI.back(); } }},UI.icon('trash'),'Delete')));
  M.appendChild(h('p',{class:'tiny muted',style:{marginTop:'14px'},text:'Added '+UI.date(e.cr)+(e.up>e.cr+1000?' • edited '+UI.date(e.up):'')}));
  return M; }
});

/* ============================ ADD / EDIT AN ENTRY ============================ */
UI.define('jedit',{ title:a=>a.id?'Edit entry':'Add an experience', sub:'Self-reported',
 render(a){ const M=h('main',{}), e=a.id?J().e.find(x=>x.id===a.id):null, d=a.draft=a.draft||(e?{type:e.type,d:e.d,place:e.place,ac:e.ac,title:e.title,note:e.note,refl:e.refl,media:(e.media||[]).slice(),dest:e.dest}:{type:a.type||'museum',d:UI.ymd(),place:a.place||'',ac:'',title:a.title||'',note:'',refl:'',media:[],dest:a.dest||null});
  M.appendChild(h('div',{class:'note'},'Use places and aircraft, not people’s names. Do not write anyone’s address, school or phone number.'));
  const f=h('form',{style:{marginTop:'14px'},onsubmit:ev=>{ ev.preventDefault(); save(); }});
  const sel=h('select',{'aria-label':'Kind of experience',onchange:()=>{ d.type=sel.value; }}); TYPES.forEach(t=>sel.appendChild(h('option',{value:t[0],selected:t[0]===d.type},t[1])));
  const fld=(label,el,hint)=>h('label',{class:'fld'},h('span',{text:label}),el,hint?h('div',{class:'hint',text:hint}):null);
  const inp=(k,ph,n)=>{ const i=h('input',{type:'text',value:d[k]||'',maxlength:String(n),placeholder:ph,oninput:()=>{ d[k]=i.value; }}); return i; };
  const area=(k,ph,n)=>{ const c=h('div',{class:'hint',text:(d[k]||'').length+' / '+n}); const t=h('textarea',{maxlength:String(n),placeholder:ph,oninput:()=>{ d[k]=t.value; c.textContent=t.value.length+' / '+n; }}); t.value=d[k]||''; return [t,c]; };
  const date=h('input',{type:'date',value:d.d,max:UI.ymd(),oninput:()=>{ d.d=date.value; }});
  f.appendChild(fld('What was it?',sel)); f.appendChild(fld('When',date));
  f.appendChild(fld('Title (optional)',inp('title','For example: My first airshow',LIM.title)));
  f.appendChild(fld('Where',inp('place','A museum, an airport code or a town',LIM.place)));
  f.appendChild(fld('Aircraft (optional)',inp('ac','For example: B-17, Cessna 172, Space Shuttle',LIM.ac)));
  const [nt,nc]=area('note','What happened, what you saw',LIM.note); f.appendChild(h('label',{class:'fld'},h('span',{text:'Notes (optional)'}),nt,nc));
  const [rt,rc]=area('refl','What do you want to remember? What did it make you curious about?',LIM.refl); f.appendChild(h('label',{class:'fld'},h('span',{text:'Reflection (optional)'}),rt,rc));
  // photos
  const ph=h('div',{class:'card flat',style:{margin:'4px 0 14px'}});
  if(!H.photosAllowed()) ph.appendChild(h('p',{class:'small muted',style:{margin:0},text:'Photos are off on this device. The Family Lead can turn them on in Backup and restore.'}));
  else if(!H.store.ok) ph.appendChild(h('p',{class:'small muted',style:{margin:0},text:'This browser is not letting the app store photos (a private window?).'}));
  else { const th=h('div'), draw=()=>{ UI.clear(th); th.appendChild(thumbs(d.media,id=>{ d.media=d.media.filter(x=>x!==id); H.store.del('media',id).catch(()=>{}); })); };
   const pick=h('input',{type:'file',accept:'image/*',class:'sr',id:'jphoto',onchange:async()=>{ const file=pick.files&&pick.files[0]; pick.value=''; if(!file) return; if(d.media.length>=4){ UI.toast('Four photos at most'); return; } UI.toast('Adding the photo…'); try{ const r=await H.photoFrom(file,a.id||null); d.media.push(r.id); draw(); UI.toast('Photo added'); }catch(err){ UI.dialog({title:'That photo was not added',body:h('p',{text:err.message})}); } }});
   ph.appendChild(h('div',{class:'spread'},h('b',{text:'Photos (up to 4)'}),h('label',{for:'jphoto',class:'btn',role:'button',tabindex:'0',onkeydown:ev=>{ if(ev.key==='Enter'||ev.key===' '){ ev.preventDefault(); pick.click(); } }},UI.icon('camera'),'Add a photo'),pick));
   ph.appendChild(h('p',{class:'tiny muted',style:{margin:'6px 0 0'},text:'Photos are shrunk and saved without location or camera data, on this device only.'})); ph.appendChild(th); draw(); }
  f.appendChild(ph);
  f.appendChild(h('div',{class:'row'},h('button',{class:'btn primary',type:'submit'},UI.icon('check'),'Save'),h('button',{class:'btn ghost',type:'button',onclick:()=>UI.back()},'Cancel')));
  M.appendChild(f);
  function save(){ if(!d.title.trim()&&!d.place.trim()){ UI.toast('Add a title or a place'); return; } let e2;
   if(e) e2=H.journalUpdate(e.id,d); else { e2=H.journalAdd(d); (d.media||[]).forEach(id=>H.store.get('media',id).then(r=>{ if(r&&!r.entry){ r.entry=e2.id; H.store.put('media',r); } }).catch(()=>{})); if(d.dest&&H.EXPLORER) H.EXPLORER.markVisited(d.dest,e2.id); }
   sfx('cheer'); a.draft=null; UI.replace('jentry',{id:e2.id}); }
  return M; }
});
/* the Flight Bag card (airfield mode) */
G.cardSub.record=()=>{ const n=J().e.length+(H.flog?H.flog.totals().flights:0); return n?n+' EXPERIENCES':'LEARNED • DID • NEXT'; };
})();
