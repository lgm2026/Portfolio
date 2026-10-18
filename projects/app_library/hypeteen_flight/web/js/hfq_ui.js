/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* THE HTML LAYER (r7): accessible screens laid over the canvas, for everything that is a document or a direct-access menu:
   the Academy Hub, the Library and its reader, the Explorer, the Flight Record and backups.
   How it fits the engine:
   - Every HTML screen family is hosted by an ordinary canvas scene (UI.host). G.go('hub'), G.go('library'), G.go('book',{id})
     work like any other scene, so fades, the Terms gate, the tutorial and "back" arguments behave as before.
   - Inside the layer, views form a stack (UI.show pushes, UI.back pops). Launching a canvas activity (a lesson, a game, a
     quiz) leaves the stack in place; coming back re-renders the view that launched it, at the same scroll position.
   - The engine ignores keys typed inside #ui (G.uiOwns), so Tab, Enter, Space and arrows work natively; Escape goes back.
   - All text is set with textContent. Nothing user-written is ever parsed as HTML.
   Views: UI.define(id, {title(a), sub(a), render(a, ctx) -> Node, back?:false, actions(a)?, music?, className?}). */
(function(){
const H=G.HFQ;
const UI=H.UI={};
const SVGNS='http://www.w3.org/2000/svg';

/* ---------------- DOM helpers ---------------- */
const h=UI.h=function(tag,attrs){
 const el=document.createElement(tag), a=attrs||{};
 for(const k in a){ const v=a[k]; if(v==null||v===false) continue;
  if(k==='class') el.className=v; else if(k==='text') el.textContent=String(v); else if(k==='style'&&typeof v==='object') Object.assign(el.style,v);
  else if(k.slice(0,2)==='on'&&typeof v==='function') el.addEventListener(k.slice(2).toLowerCase(),v);
  else if(k==='dataset') Object.assign(el.dataset,v); else if(v===true) el.setAttribute(k,''); else el.setAttribute(k,String(v)); }
 for(let i=2;i<arguments.length;i++) add(el,arguments[i]);
 return el;
};
function add(el,c){ if(c==null||c===false) return; if(Array.isArray(c)){ c.forEach(x=>add(el,x)); return; } el.appendChild(c instanceof Node?c:document.createTextNode(String(c))); }
UI.add=add;
UI.clear=el=>{ while(el.firstChild) el.removeChild(el.firstChild); return el; };
UI.frag=function(){ const f=document.createDocumentFragment(); for(let i=0;i<arguments.length;i++) add(f,arguments[i]); return f; };

/* ---------------- icons: one stroke family (24-unit grid, 1.9 stroke), drawn here so no image is needed ---------------- */
const IC={
 home:'M3 11 12 4l9 7M5 10v10h14V10M10 20v-6h4v6', back:'M15 5l-7 7 7 7', close:'M6 6l12 12M18 6 6 18', right:'M9 5l7 7-7 7', search:'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm9 16-4.3-4.3',
 path:'M7 21c0-5 10-6 10-11 0-2.5-2-4-5-4M5 4h4M15 21h4', games:'M6 9h12a3 3 0 0 1 3 3v3a3 3 0 0 1-5.2 2L14 15h-4l-1.8 2A3 3 0 0 1 3 15v-3a3 3 0 0 1 3-3zm2 2v4m-2-2h4m6-1h.01M17 14h.01',
 book:'M4 5.5C6.5 4 9.5 4 12 5.5 14.5 4 17.5 4 20 5.5V19c-2.5-1.5-5.5-1.5-8 0-2.5-1.5-5.5-1.5-8 0zM12 5.5V19', map:'M9 4 3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14',
 compass:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm3.5 5.5-2 5-5 2 2-5z', record:'M6 3h10l3 3v15H6zM9 8h6M9 12h6M9 16h4', trophy:'M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M9 21h6M10 17h4',
 gear:'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm8 3-.1-1.2 2-1.6-2-3.4-2.4.9a7 7 0 0 0-2-1.2L15 3h-4l-.5 2.5a7 7 0 0 0-2 1.2l-2.4-.9-2 3.4 2 1.6L6 12l.1 1.2-2 1.6 2 3.4 2.4-.9a7 7 0 0 0 2 1.2L11 21h4l.5-2.5a7 7 0 0 0 2-1.2l2.4.9 2-3.4-2-1.6z',
 plane:'M3 13l7-1 3-8h2l-1 8 6 1v2l-6 .5 1 4.5h-2l-3-4-7-.5z', pin:'M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11zm0-13.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6z', star:'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',
 check:'M4 12.5 9 17 20 6', lock:'M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z', download:'M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M4 19h16', upload:'M12 19V8m0 0-4.5 4.5M12 8l4.5 4.5M4 4h16', shield:'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
 camera:'M4 8h3.5L9 5.5h6L16.5 8H20v11H4zm8 2.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z', bookmark:'M7 3h10v18l-5-4-5 4z', text:'M4 7V5h11v2M9.5 5v14M7 19h5M14 12h7M17.5 12v7M16 19h3', sun:'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 1v3m0 16v3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1M1 12h3m16 0h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1',
 info:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 7v6m0-9.5h.01', warn:'M12 3 2 20h20zM12 9v5m0 3h.01', list:'M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01', headset:'M4 15v-3a8 8 0 0 1 16 0v3M4 15h3v5H5a1 1 0 0 1-1-1zm16 0h-3v5h2a1 1 0 0 0 1-1zM17 20c0 1-2 2-5 2',
 user:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 9c.5-4 3.4-6 7-6s6.5 2 7 6', users:'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20c.4-3.4 3-5.5 6.5-5.5s6.1 2.1 6.5 5.5M16 4.5a3.5 3.5 0 0 1 0 6.8M18 14.7c2 .7 3.3 2.5 3.5 5.3',
 cards:'M7 4h11a2 2 0 0 1 2 2v12M4 8h11a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z', wrench:'M14.5 4a5 5 0 0 0-5 6.5L3 17l4 4 6.5-6.5A5 5 0 0 0 20 9.5l-3 3-3.5-1-1-3.5z', cal:'M4 6h16v15H4zM4 10h16M8 3v4m8-4v4',
 joy:'M12 4v8m-4 4h8a4 4 0 0 1 4 4H4a4 4 0 0 1 4-4zm4-14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z', chat:'M4 5h16v11H9l-5 4z', clock:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 4v5l3 2', flag:'M5 21V4m0 0h11l-2 4 2 4H5',
 eye:'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zm10-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z', trash:'M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14', edit:'M4 20h4L19 9l-4-4L4 16zM14 6l4 4', plus:'M12 5v14M5 12h14', minus:'M5 12h14', globe:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18',
 medal:'M8 3h3l1 4 1-4h3l-2 6M12 9a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 3 1.2 2.4 2.6.4-1.9 1.8.5 2.6-2.4-1.3-2.4 1.3.5-2.6-1.9-1.8 2.6-.4z', radio:'M4 9h16v11H4zM8 9l9-5M8 14.5a1.5 1.5 0 1 0 0 .1M13 13h4M13 16h4',
 hub:'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z', walk:'M13 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM10 21l2-6 3 3v3M9 11l3-3 3 2 2 3M9 11l-2 4'
};
UI.icon=function(name,cls){ const s=document.createElementNS(SVGNS,'svg'); s.setAttribute('viewBox','0 0 24 24'); s.setAttribute('class','ic'+(cls?' '+cls:'')); s.setAttribute('aria-hidden','true'); s.setAttribute('focusable','false');
 const p=document.createElementNS(SVGNS,'path'); p.setAttribute('d',IC[name]||IC.info); s.appendChild(p); return s; };
UI.hasIcon=n=>!!IC[n];

/* ---------------- formatting ---------------- */
const MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
UI.date=function(v){ if(!v) return ''; let d; if(typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)){ const p=v.split('-'); d=new Date(+p[0],+p[1]-1,+p[2]); } else d=new Date(v); if(isNaN(d)) return ''; return MON[d.getMonth()]+' '+d.getDate()+', '+d.getFullYear(); };
UI.ymd=function(t){ const d=t?new Date(t):new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); };
UI.plural=(n,one,many)=>n+' '+(n===1?one:(many||one+'s'));
UI.bytes=n=>n<1024?n+' B':(n<1048576?(n/1024).toFixed(n<10240?1:0)+' KB':(n/1048576).toFixed(1)+' MB');
/* title case for the canvas's ALL-CAPS strings; aviation abbreviations and roman numerals stay in capitals */
const KEEP=/^(XP|ATIS|METAR|METARS|TAF|TAFS|FAA|NTSB|NOTAM|NOTAMS|VFR|IFR|ATC|GPS|ILS|VOR|NDB|ADS-B|AGL|MSL|RPM|PAPI|VASI|ELT|CFI|PPL|NASA|USAF|RCAF|USA|UK|DC|HTFA|KHFQ|II|III|IV|VI|VII|VIII|IX|XI|XII|AOA|CG|UTC|IAS|TAS|AWOS|ASOS|CTAF|UNICOM|WWII|WWI|NORAD|ISS)$/;   // words that are never ordinary English words
UI.title=s=>String(s||'').toLowerCase().replace(/(^|[\s(\-/+])([a-z])/g,(m,a,b)=>a+b.toUpperCase()).replace(/\b(And|Of|The|A|An|To|In|On|For|At|By|Or)\b/g,(m,w,i)=>i?w.toLowerCase():w)
 .replace(/[A-Za-z][A-Za-z-]*/g,w=>KEEP.test(w.toUpperCase())?w.toUpperCase():w).replace(/\b([Tt]he) Us\b/g,'$1 US');

/* ---------------- the root ---------------- */
let root=null, scroller=null, live=null, stack=[], hostBack=null, shown=false, dlg=null;
function ensureRoot(){
 if(root) return root;
 root=h('div',{id:'ui','data-ui-root':''});
 scroller=h('div',{class:'scroller'}); root.appendChild(scroller);
 document.body.appendChild(root);
 root.addEventListener('keydown',e=>{
  if(e.key==='Escape'){ if(dlg){ dlg.close(); e.preventDefault(); return; } const v=top(); const def=v&&UI.views[v.view]; if(def&&def.onEscape&&def.onEscape(v.args)===true){ e.preventDefault(); return; } if(canGoBack()){ e.preventDefault(); UI.back(); } }
 });
 return root;
}
const top=()=>stack[stack.length-1];
function canGoBack(){ const v=top(); if(!v) return false; const def=UI.views[v.view]; return !(def&&def.back===false&&stack.length===1&&!hostBack); }
UI.visible=()=>shown;
UI.applyPrefs=function(){ if(!root) return; const p=UI.prefs(); root.dataset.text=String(p.text||0); root.dataset.rm=G.rm&&G.rm()?'1':'0'; };
UI.prefs=function(){ const m=G.save.mod; m.ui=m.ui||{}; return m.ui; };
UI.setPref=function(k,v){ UI.prefs()[k]=v; G.persist(); UI.applyPrefs(); };

/* ---------------- views and the stack ---------------- */
UI.views={};
UI.define=(id,def)=>{ UI.views[id]=def; return def; };
UI.reset=function(){ stack=[]; hostBack=null; UI.away=false; };
UI.away=false;   // true while a canvas activity launched from the layer is running: coming back resumes the stack
UI.stack=()=>stack.map(s=>({view:s.view,args:s.args}));
const sameKey=(a,b)=>!!a&&!!b&&a.view===b.view&&JSON.stringify(keyOf(a.args))===JSON.stringify(keyOf(b.args));
const keyOf=a=>{ a=a||{}; const k={}; ['id','doc','n','room','unit','tab','dest'].forEach(n=>{ if(a[n]!=null) k[n]=a[n]; }); return k; };
UI.enter=function(req,back){
 ensureRoot(); hostBack=back||hostBack;
 if(req&&req.view){
  const e={view:req.view,args:req.args||{},scroll:0};
  const at=stack.findIndex(s=>sameKey(s,e));
  if(at>=0){ stack.length=at+1; Object.assign(stack[at].args,e.args); }
  else { if(req.root) stack=[]; stack.push(e); }
 } else if(!stack.length) stack.push({view:'home',args:{},scroll:0});
 show(true);
};
UI.show=function(view,args){ const cur=top(); if(cur) cur.scroll=scroller.scrollTop; stack.push({view,args:args||{},scroll:0}); render(); AUDIO.sfx('blip'); };
UI.replace=function(view,args){ stack.pop(); stack.push({view,args:args||{},scroll:0}); render(); };
UI.back=function(){
 if(dlg) dlg.close();
 const cur=top(); const def=cur&&UI.views[cur.view];
 if(def&&def.onLeave) try{ def.onLeave(cur.args); }catch(e){}
 if(stack.length>1){ stack.pop(); render(true); AUDIO.sfx('back'); return; }
 if(def&&def.back===false&&!hostBack) return;
 const to=hostBack||G.homeScene(); AUDIO.sfx('back'); stack=[]; hostBack=null; UI.away=false; G.go(to,{});
};
UI.refresh=function(){ if(shown) render(true,true); };
UI.go=function(scene,args){ const cur=top(); if(cur) cur.scroll=scroller.scrollTop; G.go(scene,args); };   // leave for a canvas activity; the stack waits
function show(restore){ shown=true; root.classList.add('on'); UI.applyPrefs(); render(restore); }
UI.hide=function(){ shown=false; if(dlg) dlg.close(); if(root){ const cur=top(); const def=cur&&UI.views[cur.view]; if(def&&def.onHide) try{ def.onHide(cur.args); }catch(e){} if(cur) cur.scroll=scroller.scrollTop; root.classList.remove('on'); UI.clear(scroller); } };

function render(restore,keepFocus){
 const e=top(); if(!e) return; const def=UI.views[e.view]; if(!def){ console.warn('no view',e.view); return; }
 const prevFocus=keepFocus&&document.activeElement&&document.activeElement.id;
 UI.clear(scroller); scroller.className='scroller'+(def.className?' '+def.className:'');
 const title=(typeof def.title==='function'?def.title(e.args):def.title)||'';
 const sub=(typeof def.sub==='function'?def.sub(e.args):def.sub)||'';
 const left=h('div',{class:'side'}), right=h('div',{class:'side r'});
 const showBack=!(def.back===false&&stack.length===1&&!hostBack);
 if(showBack) left.appendChild(h('button',{class:'iconbtn',type:'button','aria-label':'Back',onclick:()=>UI.back()},UI.icon('back'),h('span',{class:'lbl',text:'Back'})));
 else left.appendChild(h('span',{'aria-hidden':'true',style:{width:'44px'}}));
 (def.actions?def.actions(e.args)||[]:[]).forEach(a=>right.appendChild(h('button',{class:'iconbtn',type:'button','aria-label':a.label,title:a.label,onclick:a.onClick},UI.icon(a.icon),a.text?h('span',{class:'lbl',text:a.text}):null)));
 const h1=h('h1',{id:'ui-title',tabindex:'-1',text:title,'data-long':title.length>18?'':null});
 const bar=h('header',{class:'bar'},left,h('div',{class:'ttl'},h1,sub?h('span',{class:'sub',text:sub}):null),right);
 let body;
 try{ body=def.render(e.args,{h,UI,entry:e}); }catch(err){ console.error(err); if(G.errors) G.errors.push({t:Date.now(),where:'ui:'+e.view,msg:String(err&&err.message||err)}); body=h('main',{},h('div',{class:'note bad',role:'alert'},'This screen could not open. Go back and try again.')); }
 if(def.bare) scroller.appendChild(body); else { scroller.appendChild(bar); scroller.appendChild(body&&body.tagName==='MAIN'?body:h('main',{},body)); }
 if(def.music&&AUDIO.curName!==def.music) AUDIO.play(def.music);
 const sc=restore?e.scroll||0:0; scroller.scrollTop=sc; requestAnimationFrame(()=>{ scroller.scrollTop=sc; });
 if(prevFocus&&document.getElementById(prevFocus)) document.getElementById(prevFocus).focus({preventScroll:true});
 else if(!keepFocus){ const f=scroller.querySelector('#ui-title')||h1; try{ f.focus({preventScroll:true}); }catch(err){} }
 if(!keepFocus) G.announce(title+(sub?'. '+sub:''));
 if(def.after) try{ def.after(e.args,scroller); }catch(err){ console.error(err); }
}
UI.scroller=()=>scroller;

/* ---------------- dialogs (focus moves in, Escape closes, focus returns) ---------------- */
UI.dialog=function(o){
 ensureRoot(); if(dlg) dlg.close();
 const ret=document.activeElement, id='dlg-'+Date.now().toString(36);
 const acts=h('div',{class:'acts'});
 const box=h('div',{class:'dialog',role:'dialog','aria-modal':'true','aria-labelledby':id},h('h2',{id,text:o.title||''}),o.body||null,acts);
 const scrim=h('div',{class:'scrim',onclick:e=>{ if(e.target===scrim&&o.dismiss!==false) close(); }},box);
 function close(v){ if(!scrim.parentNode) return; scrim.parentNode.removeChild(scrim); dlg=null; if(o.onClose) o.onClose(v); try{ if(ret&&ret.focus) ret.focus({preventScroll:true}); }catch(e){} }
 (o.actions||[{label:'OK',kind:'primary'}]).forEach(a=>acts.appendChild(h('button',{class:'btn '+(a.kind||''),type:'button',onclick:()=>{ const keep=a.onClick&&a.onClick()===false; if(!keep&&a.close!==false) close(a.value); }},a.label)));
 root.appendChild(scrim); dlg={close,el:box};
 box.addEventListener('keydown',e=>{ if(e.key!=='Tab') return; const f=[...box.querySelectorAll('button,input,select,textarea,a[href],[tabindex]:not([tabindex="-1"])')].filter(x=>!x.disabled); if(!f.length) return; const first=f[0], last=f[f.length-1]; if(e.shiftKey&&document.activeElement===first){ last.focus(); e.preventDefault(); } else if(!e.shiftKey&&document.activeElement===last){ first.focus(); e.preventDefault(); } });
 setTimeout(()=>{ const f=box.querySelector('[autofocus]')||box.querySelector('input,select,textarea')||acts.querySelector('.btn.primary')||acts.querySelector('button'); if(f) f.focus(); },20);
 G.announce(o.title||'');
 return dlg;
};
UI.confirm=function(title,lines,yes,o){ o=o||{}; return new Promise(res=>{ UI.dialog({title,body:h('div',{},(lines||[]).map(l=>h('p',{text:l}))),actions:[{label:o.no||'Cancel',kind:'ghost',value:false,onClick:()=>res(false)},{label:yes||'OK',kind:o.danger?'danger':'primary',value:true,onClick:()=>res(true)}],onClose:v=>{ if(v===undefined) res(false); }}); }); };
let toastT=null;
UI.toast=function(msg){ ensureRoot(); const old=root.querySelector('.toastline'); if(old) old.remove(); const t=h('div',{class:'toastline',role:'status',text:msg}); root.appendChild(t); clearTimeout(toastT); toastT=setTimeout(()=>{ if(t.parentNode) t.remove(); },2600); };
/* canvas toasts are drawn under the HTML layer: while it is up, show them here too (the canvas still announces them) */
const oToast=G.toast; G.toast=function(msg,col){ oToast.call(G,msg,col); if(shown) UI.toast(msg); };

/* ---------------- hosting: a canvas scene per screen family ---------------- */
UI.hosts=new Set();
UI.stackLen=()=>stack.length;
/* Rules (qa/hfq_r7_ui.js tests each one):
   1. Arriving from the canvas with something to open (any argument besides `back`): a fresh stack with that view; Back from
      it returns to `back`.
   2. Arriving from another HTML screen family (UI.go from a view): the view is pushed onto the same stack.
   3. Coming back from a canvas activity that a view launched (a lesson, a quiz, a game: they return with no target): the
      stack resumes exactly where it was, scroll position included.
   4. Going to the walkable airfield, the Flight Bag or the title screen ends a suspended stack. */
UI.host=function(name,map){
 UI.hosts.add(name);
 G.scenes[name]={
  enter(a){ a=a||{}; this.t=0;
   const target=Object.keys(a).some(k=>k!=='back'), fromHost=UI.hosts.has(G.prevScene);
   /* coming back to the host an activity was launched from resumes its stack; arriving at a DIFFERENT host (the Library after
      the Hub, say) must show that host's own view (r7.4: it used to resume the Hub's home instead) */
   if(!target&&UI.away&&stack.length&&UI.awayFrom===name){ UI.away=false; UI.enter(null); return; }
   UI.away=false;
   if(!fromHost) UI.reset();
   const r=map(a)||{};
   UI.enter(r,fromHost?null:(a.back||r.back||null)); },
  update(dt){ this.t+=dt; if(G.pressed.b&&!(document.activeElement&&root&&root.contains(document.activeElement))) UI.back(); },
  draw(c){ c.fillStyle=G.C.bg; c.fillRect(0,0,G.VW,G.VH); },
  exit(next){ if(!UI.hosts.has(next)&&stack.length){ UI.away=true; UI.awayFrom=name; } UI.hide(); }
 };
};
const oGo=G.go; G.go=function(name){ if(name==='world'||name==='dash'||name==='title'){ UI.away=false; } return oGo.apply(G,arguments); };
/* G.go to any canvas scene hides the layer (the host's exit does it); signing out clears the stack */
const oLogout=G.logout; G.logout=function(){ UI.reset(); return oLogout.apply(G,arguments); };
const oLogin=G.loginAs; G.loginAs=function(){ UI.reset(); return oLogin.apply(G,arguments); };
})();
