/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* ENGINE CORE (from the RK Mobile Clubhouse, generalized).
   - one <canvas>, 270 units wide and 480..600 tall (fills a phone held upright), hi-res backing buffer
   - scenes: G.scenes[name] = {enter(args), update(dt), draw(ctx), exit(next)}; switch with G.go(name,args)
   - input: touch / mouse / keyboard (arrows+WASD move focus, Enter/Space = A, Esc/Backspace = B)
   - native <input>/<textarea>/file/link elements laid over the canvas (G.field, G.fileField, G.linkField)
   - draw kit: G.txt, G.button, G.panel, G.topBar, G.Modal, G.navList, G.listNav, G.seg, G.chip, G.toggleDraw...
   - saves in localStorage, namespaced by CONFIG.id; colors from CONFIG.theme (G.C) */
(function(){
const CFG=window.CONFIG, ID=CFG.id;
const VW=270;
const C=CFG.theme;
const G = {
 VW, VH:480, canvas:null, ctx:null, img:{}, time:0, frame:0, C, CFG,
 keys:{}, pressed:{}, scenes:{}, scene:null, sceneName:'', prevScene:'',
 fade:1, fadeDir:-1, pending:null, shake:0,
 ptr:{x:-99,y:-99,down:false,click:false,released:false,sx:0,sy:0,id:null},
 touches:new Map(), swipe:null, dragDX:0, dragDY:0, wheelDY:0, kbMode:false, isTouch:false,
 toasts:[], save:null, fields:{}, typed:[], primaryField:null, pendingFocus:null, gestureId:0
};
const IOS=/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const SECRET_OK=!!(window.CSS&&CSS.supports&&CSS.supports('-webkit-text-security','disc'));
window.G=G;

/* ---------- color helpers ---------- */
G.rgba=function(hex,a){ const n=parseInt(hex.slice(1),16); return 'rgba('+((n>>16)&255)+','+((n>>8)&255)+','+(n&255)+','+a+')'; };
G.shade=function(hex,f){
 const n=parseInt(hex.slice(1),16), cl=v=>Math.max(0,Math.min(255,Math.round(v*f)));
 return '#'+((1<<24)|(cl((n>>16)&255)<<16)|(cl((n>>8)&255)<<8)|cl(n&255)).toString(16).slice(1);
};
const A=a=>G.rgba(C.accent,a), AH=a=>G.rgba(C.accentHi,a);

/* ---------- saves: a guest save + one save per account, all keyed by CONFIG.id ---------- */
G.KEYS={guest:ID+'_guest_v1', roster:ID+'_roster_v1', acct:id=>ID+'_acct_'+id};
function defSave(){
 return Object.assign({ uuid:'g-'+Math.random().toString(36).slice(2,10)+Date.now().toString(36),
  name:'', created:Date.now(), settings:{music:true,sfx:true,rm:!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)},
  points:0, best:{}, ach:{}, seen:{}, mod:{} }, JSON.parse(JSON.stringify(CFG.saveExtra||{})));
}
G.defSave=defSave;
G.saveKey=G.KEYS.guest;
G.activeAcct=null;
G.loadSave=function(key){
 G.saveKey=key||G.KEYS.guest;
 let s=null;
 try{ s=JSON.parse(localStorage.getItem(G.saveKey)||'null'); }catch(e){}
 const d=defSave();
 if(s){ for(const k in d) if(!(k in s)) s[k]=d[k]; for(const k in d.settings) if(!(k in s.settings)) s.settings[k]=d.settings[k]; G.save=s; }
 else G.save=d;
};
/* A failed write (storage full, or blocked in a private window) used to vanish silently, and a cadet would lose progress without knowing.
   Now it is remembered (G.storageOk) and said once per session. Returns true when the save was written. */
G.storageOk=true;
function storageFail(what){ G.storageOk=false; if(!G._storageWarned){ G._storageWarned=true; try{ G.toast(G.word('storageWarn'),'#ffb020'); }catch(e){} console.warn('storage write failed ('+what+')'); } }
G.persist=function(){ try{ localStorage.setItem(G.saveKey, JSON.stringify(G.save)); G.storageOk=true; return true; }catch(e){ storageFail('save'); return false; } };
G.resetSave=function(){ try{ localStorage.removeItem(G.saveKey); }catch(e){} G.loadSave(G.saveKey); };
G.logout=function(){ G.activeAcct=null; G.loadSave(G.KEYS.guest); };
G.pinHash=function(pin){
 let x=2166136261;
 for(const ch of String(pin)+'|'+ID){ x^=ch.charCodeAt(0); x=Math.imul(x,16777619)>>>0; }
 return x.toString(36);
};
G.loadRoster=function(){
 try{ G.roster=JSON.parse(localStorage.getItem(G.KEYS.roster)||'null')||{accounts:[]}; }
 catch(e){ G.roster={accounts:[]}; }
};
G.saveRoster=function(){ try{ localStorage.setItem(G.KEYS.roster,JSON.stringify(G.roster)); return true; }catch(e){ storageFail('roster'); return false; } };
G.loginAs=function(acct){
 G.activeAcct=acct;
 G.loadSave(G.KEYS.acct(acct.id));
 if(!G.save.name){ G.save.name=acct.name; G.persist(); }
 acct.lastLogin=Date.now(); G.saveRoster();
};
G.who=function(){ return (G.activeAcct&&G.activeAcct.name)||G.save.name||G.word('guestName'); };
/* a built-in word (CONFIG.words), so renditions can rename LOG IN, PTS, GUEST... */
G.word=function(k){ const w=CFG.words||{}; return w[k]!=null?w[k]:k.toUpperCase(); };

/* ---------- points / badges / toasts ---------- */
G.award=function(pts,label){
 pts=Math.max(0,Math.round(pts)); if(!pts) return;
 G.save.points+=pts; G.persist();
 G.toast((label?label+'  ':'')+'+'+pts+' '+G.word('points'), C.title, {kind:'xp',pts,label:label||''});
 if(G.onAward) G.onAward(pts);
 AUDIO.sfx(pts>=500?'bigpoint':'point');
};
G.ach=function(id){
 if(G.save.ach[id]) return;
 const a=(CFG.badges||[]).find(x=>x.id===id); if(!a) return;
 G.save.ach[id]=Date.now(); G.persist();
 G.toast('BADGE: '+a.n,C.info,{kind:'badge',id,name:a.n}); if(!G.noticeSfx) AUDIO.sfx('cheer');   // a notice module (G.noticeSfx) plays its own sound per tier
};
/* toasts: msg, a colour, and optional meta ({kind:'xp'|'badge'|..., tier, ...}) that a rendition's notice module (G.drawNotices) can use */
G.toast=function(msg,col,meta){ G.toasts.push({msg,col:col||'#fff',t:3.2,meta:meta||null}); if(G.toasts.length>8) G.toasts.shift(); G.announce(msg); };
/* screen readers: one polite live region, filled by toasts, screen titles and the HTML screens (G.announce) */
G.announce=function(msg){ try{ let el=document.getElementById('sr-live'); if(!el) return; el.textContent=''; setTimeout(()=>{ el.textContent=String(msg); },30); }catch(e){} };
G.clearToasts=function(){ G.toasts=[]; };

/* ---------- input ---------- */
const KEYMAP={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',Enter:'a',Space:'a',KeyZ:'a',KeyJ:'a',Escape:'b',KeyX:'b',KeyK:'b',Backspace:'b',KeyP:'pause',KeyE:'use'};   // E: use what you are next to (read by the walkable world)
/* the HTML layer (anything inside an element marked data-ui-root) handles its own keys: Tab, Enter, Space and arrows work natively there */
G.uiOwns=function(e){ const t=e&&e.target; return !!(t&&t.closest&&t.closest('[data-ui-root]')); };
function typing(){ const a=document.activeElement; return !!a&&((a.tagName==='INPUT'&&a.type!=='file')||a.tagName==='TEXTAREA'); }
function bindInput(){
 addEventListener('keydown',e=>{
  if(G.uiOwns(e)) return;
  if(typing()){ if(e.code==='Escape'){ document.activeElement.blur(); e.preventDefault(); } return; }
  // typing on a text screen goes straight into its field
  if(G.primaryField&&e.key.length===1&&e.key!==' '&&!e.ctrlKey&&!e.metaKey&&!e.altKey){
   const f=G.fields[G.primaryField];
   if(f&&f.el.style.display!=='none'&&f.el.style.visibility!=='hidden'){ try{ f.el.focus({preventScroll:true}); }catch(_){} return; }
  }
  if(/^[0-9]$/.test(e.key)) G.typed.push(e.key);
  else if(e.key==='Backspace'||e.key==='Delete') G.typed.push('DEL');
  const k=KEYMAP[e.code]; if(!k) return;
  e.preventDefault(); G.kbMode=true;
  if(!G.keys[k]) G.pressed[k]=true;
  G.keys[k]=true;
 });
 addEventListener('keyup',e=>{ const k=KEYMAP[e.code]; if(k){ G.keys[k]=false; } });
 const cv=G.canvas, T=G.touches;
 const toV=e=>{ const r=cv.getBoundingClientRect(); return {x:(e.clientX-r.left)/r.width*VW, y:(e.clientY-r.top)/r.height*G.VH}; };
 cv.addEventListener('pointerdown',e=>{
  e.preventDefault();
  const p=toV(e);
  T.set(e.pointerId,{x:p.x,y:p.y,sx:p.x,sy:p.y,t0:performance.now()});
  try{ cv.setPointerCapture(e.pointerId); }catch(_){}
  G.ptr.x=p.x; G.ptr.y=p.y; G.ptr.sx=p.x; G.ptr.sy=p.y;
  G.ptr.down=true; G.ptr.click=true; G.ptr.id=e.pointerId; G.gestureId++;
  G.kbMode=false; G.isTouch=e.pointerType!=='mouse';
  if(typing()) document.activeElement.blur();
  AUDIO.resume();
 });
 cv.addEventListener('pointermove',e=>{
  const p=toV(e), t=T.get(e.pointerId);
  if(t){ G.dragDX+=p.x-t.x; G.dragDY+=p.y-t.y; t.x=p.x; t.y=p.y; }
  if(e.pointerId===G.ptr.id||!G.ptr.down){ G.ptr.x=p.x; G.ptr.y=p.y; }
 });
 const up=e=>{
  const t=T.get(e.pointerId);
  if(t){
   const dx=t.x-t.sx, dy=t.y-t.sy, dt=performance.now()-t.t0;
   if(dt<650&&Math.hypot(dx,dy)>18) G.swipe={dx,dy,x0:t.sx,y0:t.sy};
   G.ptr.released=true; G.ptr.rx=t.x; G.ptr.ry=t.y; G.ptr.rsx=t.sx; G.ptr.rsy=t.sy;
   T.delete(e.pointerId);
  }
  if(!T.size) G.ptr.down=false;
  if(!IOS) applyPendingFocus();
 };
 cv.addEventListener('pointerup',up); cv.addEventListener('pointercancel',up);
 cv.addEventListener('touchend',()=>{ if(IOS) applyPendingFocus(); },{passive:true});
 cv.addEventListener('wheel',e=>{ e.preventDefault(); G.wheelDY+=e.deltaY*VW/Math.max(1,cv.getBoundingClientRect().width); },{passive:false});
}
function applyPendingFocus(){
 const pf=G.pendingFocus; G.pendingFocus=null;
 if(!pf||pf.g!==G.gestureId) return;
 const f=G.fields[pf.id]; if(!f||f.el.style.visibility==='hidden') return;
 try{ if(IOS&&document.activeElement===f.el) f.el.blur(); f.el.focus({preventScroll:true}); }catch(_){}
}
G.hit=function(x,y,w,h){ const p=G.ptr; return p.x>=x&&p.x<=x+w&&p.y>=y&&p.y<=y+h; };
G.clicked=function(x,y,w,h){ return G.ptr.click && G.hit(x,y,w,h); };
G.held=function(x,y,w,h){ for(const t of G.touches.values()) if(t.x>=x&&t.x<=x+w&&t.y>=y&&t.y<=y+h) return true; return false; };
/* tap = pointer released close to where it went down (safe inside scrolling lists) */
G.tapped=function(x,y,w,h){ const p=G.ptr; if(!p.released||Math.hypot(p.rx-p.rsx,p.ry-p.rsy)>10) return false; return p.rsx>=x&&p.rsx<=x+w&&p.rsy>=y&&p.rsy<=y+h; };
G.startedIn=function(x,y,w,h){ const p=G.ptr; return p.down&&p.sx>=x&&p.sx<=x+w&&p.sy>=y&&p.sy<=y+h; };

/* ---------- scenes ---------- */
G.go=function(name,args,instant){
 if(!G.scenes[name]){ console.warn('no scene',name); G.toast('COMING SOON',C.warn); return; }
 const target=()=>{
  if(G.scene&&G.scene.exit) G.scene.exit(name);
  G.clearFields();
  G.prevScene=G.sceneName;
  G.sceneName=name; G.scene=G.scenes[name];
  G.scene.enter(args||{});
 };
 if(instant||G.save&&G.save.settings.rm){ target(); G.pending=null; G.fade=(G.save&&G.save.settings.rm)?0:.7; G.fadeDir=-1; return; }
 G.pending=target; G.fadeDir=1;
};
/* home = CONFIG.homeScene ('dash' unless a module such as the world takes over) */
G.homeScene=function(){ const h=CFG.homeScene||'dash'; return G.scenes[h]?h:'dash'; };
G.home=function(args){ G.go(G.homeScene(),args); };

/* ---------- native text fields: the phone's own keyboard is the default way to type ---------- */
function filt(f,v){
 if(f.o.upper) v=v.toUpperCase();
 if(f.o.digits) v=v.replace(/[^0-9]/g,'');
 else if(f.o.strip) v=v.replace(f.o.strip,'');
 if(f.o.max) v=v.slice(0,f.o.max);
 return v;
}
G.field=function(id,o){
 let f=G.fields[id];
 if(!f){
  const el=document.createElement(o.multiline?'textarea':'input');
  el.className='gfield'+(o.multiline?' gmulti':''); el.autocomplete='off'; el.spellcheck=!!o.multiline;
  el.setAttribute('autocorrect','off'); el.name=ID+'_'+id+'_'+Math.random().toString(36).slice(2,6);
  document.body.appendChild(el);
  f=G.fields[id]={el,o:{}};
  el.addEventListener('input',()=>{
   const v=filt(f,el.value);
   if(v!==el.value) el.value=v;
   if(f.o.onInput) f.o.onInput(v);
  });
  el.addEventListener('keydown',e=>{
   e.stopPropagation();
   if(e.key==='Enter'&&(!f.o.multiline||e.ctrlKey||e.metaKey)){ e.preventDefault(); if(f.o.onEnter) f.o.onEnter(); }
   if(e.key==='Escape'){ e.preventDefault(); el.blur(); }
  });
 }
 f.o=o;
 const el=f.el;
 el.readOnly=!!o.readOnly; el.classList.toggle('gread',!!o.readOnly);
 if(o.readOnly) el.spellcheck=false;
 if(!o.multiline) el.type=o.type||((o.secret&&!SECRET_OK)?'password':'text');
 if(o.type==='date'||o.type==='time'){ el.style.colorScheme='dark'; if(o.maxDate) el.max=o.maxDate; else el.removeAttribute('max'); }
 el.inputMode=o.digits?'numeric':(o.tel?'tel':'text');
 if(o.digits) el.setAttribute('pattern','[0-9]*'); else el.removeAttribute('pattern');
 el.setAttribute('autocapitalize',o.digits?'off':(o.upper?'characters':'sentences'));
 el.style.setProperty('-webkit-text-security',o.secret?'disc':'none');
 el.style.letterSpacing=o.secret?'.45em':'.05em';
 el.placeholder=o.placeholder||'';
 el.maxLength=o.digits?Math.max(o.max||0,16):(o.max||200);
 el.style.textAlign=o.align||'center';
 el.enterKeyHint=o.enterHint||'done';
 if(o.value!==undefined) el.value=filt(f,String(o.value));
 f.rect={x:o.x,y:o.y,w:o.w,h:o.h};
 el.style.display='block'; el.style.visibility='visible';
 if(o.primary!==false) G.primaryField=id;
 G.placeFields();
 return f;
};
/* invisible native file picker laid over a canvas button (a real tap opens the camera / photo library) */
G.fileField=function(id,o){
 let f=G.fields[id];
 if(!f){
  const el=document.createElement('input');
  el.type='file'; el.className='gfile';
  document.body.appendChild(el);
  f=G.fields[id]={el,o:{},file:true};
  el.addEventListener('change',()=>{ const files=el.files?[...el.files]:[]; try{ el.blur(); }catch(_){} if(files.length){ if(f.o.onFiles) f.o.onFiles(files); else if(f.o.onFile) f.o.onFile(files[0]); } el.value=''; });
 }
 f.o=o; f.el.accept=o.accept||'image/*'; f.el.multiple=!!o.multiple;
 f.rect={x:o.x,y:o.y,w:o.w,h:o.h};
 f.el.style.display='block'; f.el.style.visibility='visible';
 G.placeFields();
 return f;
};
/* invisible real link laid over a canvas button (outside links, tel:, sms:, mailto: need a genuine tap) */
G.linkField=function(id,o){
 let f=G.fields[id];
 if(!f){
  const el=document.createElement('a');
  el.className='gfile'; el.target='_blank'; el.rel='noopener'; el.setAttribute('aria-label',o.label||id);
  el.addEventListener('click',()=>{ const ff=G.fields[id]; if(ff&&ff.o.onTap) ff.o.onTap(); });
  document.body.appendChild(el);
  f=G.fields[id]={el,o:{},file:true};
 }
 f.o=o; f.el.href=o.href;
 f.rect={x:o.x,y:o.y,w:o.w,h:o.h};
 f.el.style.display='block'; f.el.style.visibility='visible';
 G.placeFields();
 return f;
};
/* square, face-friendly JPEG from a picked photo (data URL) */
G.photoFromFile=function(file,size){
 size=size||192;
 return new Promise((res,rej)=>{
  const url=URL.createObjectURL(file), im=new Image();
  im.onload=()=>{
   const w=im.naturalWidth,h=im.naturalHeight,s=Math.min(w,h);
   const cv=document.createElement('canvas'); cv.width=cv.height=size;
   const x=cv.getContext('2d'); x.imageSmoothingEnabled=true; x.imageSmoothingQuality='high';
   x.drawImage(im,(w-s)/2,(h-s)*.35,s,s,0,0,size,size);
   URL.revokeObjectURL(url);
   try{ res(cv.toDataURL('image/jpeg',.8)); }catch(e){ rej(e); }
  };
  im.onerror=()=>{ URL.revokeObjectURL(url); rej(new Error('That photo could not be opened')); };
  im.src=url;
 });
};
/* a picked photo made phone-friendly: full (long edge <=1280, JPEG under `cap` bytes) + a 300px thumbnail */
G.compressPhoto=function(file,o){
 o=o||{}; const cap=o.cap||190000;
 return new Promise((res,rej)=>{
  const url=URL.createObjectURL(file), im=new Image();
  im.onload=()=>{
   const W=im.naturalWidth, H=im.naturalHeight;
   if(!W||!H){ URL.revokeObjectURL(url); rej(new Error('empty')); return; }
   const draw=(edge,q)=>{ const k=Math.min(1,edge/Math.max(W,H)), w=Math.max(1,Math.round(W*k)), h=Math.max(1,Math.round(H*k));
    const cv=document.createElement('canvas'); cv.width=w; cv.height=h; const x=cv.getContext('2d'); x.imageSmoothingEnabled=true; x.imageSmoothingQuality='high';
    x.fillStyle='#000'; x.fillRect(0,0,w,h); x.drawImage(im,0,0,w,h); return {d:cv.toDataURL('image/jpeg',q),w,h}; };
   try{
    let full=null;
    for(const edge of [1280,1080,900,720,560]){
     for(const q of [.8,.7,.6,.5]){ const r=draw(edge,q); if(r.d.length<=cap){ full=r; break; } }
     if(full) break;
    }
    if(!full){ URL.revokeObjectURL(url); rej(new Error('too_big')); return; }
    let thumb=draw(300,.66); if(thumb.d.length>24000) thumb=draw(240,.55);
    URL.revokeObjectURL(url);
    res({full:full.d,thumb:thumb.d,w:full.w,h:full.h});
   }catch(e){ URL.revokeObjectURL(url); rej(e); }
  };
  im.onerror=()=>{ URL.revokeObjectURL(url); rej(new Error('That photo could not be opened')); };
  im.src=url;
 });
};
const PHOTOS=new Map();
G.photoImg=function(src){
 if(!src) return null;
 let im=PHOTOS.get(src);
 if(!im){ im=new Image(); im.src=src; PHOTOS.set(src,im); if(PHOTOS.size>200) PHOTOS.delete(PHOTOS.keys().next().value); }
 return im.complete&&im.naturalWidth?im:null;
};
/* round headshot (or a colored initial when there is no photo) */
G.drawFace=function(src,x,y,d,name,ring){
 const im=G.photoImg(src);
 CTX.save();
 CTX.beginPath(); CTX.arc(x+d/2,y+d/2,d/2,0,7); CTX.closePath(); CTX.clip();
 if(im) CTX.drawImage(im,x,y,d,d);
 else {
  const n=String(name||'?'); let h=0; for(const ch of n) h=(h*31+ch.charCodeAt(0))>>>0;
  CTX.fillStyle=['#7a3a1a','#2a4a6a','#3a5a2a','#5a2a5a','#6a5a1a','#2a5a5a'][h%6]; CTX.fillRect(x,y,d,d);
  G.txt(n.slice(0,1).toUpperCase(),x+d/2,y+d/2-d*.26,d*.32,C.ink,'center',undefined,800);
 }
 CTX.restore();
 CTX.beginPath(); CTX.arc(x+d/2,y+d/2,d/2,0,7); CTX.strokeStyle=ring||'rgba(255,255,255,.25)'; CTX.lineWidth=1.4; CTX.stroke();
};
G.fieldVal=function(id){ const f=G.fields[id]; return f?f.el.value:''; };
G.setField=function(id,v){ const f=G.fields[id]; if(f) f.el.value=filt(f,String(v)); };
G.typeInto=function(id,v){ const f=G.fields[id]; if(!f) return; f.el.value=filt(f,String(v)); if(f.o.onInput) f.o.onInput(f.el.value); };
G.fieldFocused=function(id){ const f=G.fields[id]; return !!f&&document.activeElement===f.el; };
/* focus now (desktop/Android) and again when the current tap lifts (iOS needs a touch handler) */
G.focusField=function(id){
 const f=G.fields[id]; if(!f) return;
 try{ f.el.focus({preventScroll:true}); }catch(e){}
 if(G.ptr.down) G.pendingFocus={id,g:G.gestureId};
};
G.blurFields=function(){ const a=document.activeElement; if(a&&a.classList&&a.classList.contains('gfield')) a.blur(); };
G.clearFields=function(){ for(const id in G.fields){ G.fields[id].el.remove(); } G.fields={}; G.primaryField=null; G.pendingFocus=null; };
G.removeField=function(id){ const f=G.fields[id]; if(!f) return; f.el.remove(); delete G.fields[id]; if(G.primaryField===id) G.primaryField=null; };
G.hideFields=function(hide){ for(const id in G.fields){ G.fields[id].el.style.visibility=hide?'hidden':'visible'; if(hide) G.fields[id].el.blur(); } };
G.hideFieldsExcept=function(keep){ for(const id in G.fields){ const on=keep.indexOf(id)>=0; G.fields[id].el.style.visibility=on?'visible':'hidden'; if(!on) G.fields[id].el.blur(); } };
G.placeFields=function(){
 if(!G.canvas) return;
 const r=G.canvas.getBoundingClientRect(), sx=r.width/VW, sy=r.height/G.VH;
 for(const id in G.fields){
  const f=G.fields[id], el=f.el, q=f.rect;
  el.style.left=(r.left+q.x*sx)+'px'; el.style.top=(r.top+q.y*sy)+'px';
  el.style.width=(q.w*sx)+'px'; el.style.height=(q.h*sy)+'px';
  el.style.fontSize=Math.max(16,Math.round(f.o&&f.o.multiline?11*sy:q.h*sy*((f.o&&f.o.fs)||0.42)))+'px';
 }
};

/* ---------- on-screen keys: a SECONDARY way to type into a native field (stays in sync with it) ---------- */
const OSK_ABC=[['1','2','3','4','5','6','7','8','9','0'],['Q','W','E','R','T','Y','U','I','O','P'],['A','S','D','F','G','H','J','K','L'],['Z','X','C','V','B','N','M','-','DEL'],['SPACE','DONE']];
const OSK_NUM=[['1','2','3'],['4','5','6'],['7','8','9'],['DEL','0','DONE']];
G.oskRects=function(mode,o){
 o=o||{};
 const VH=G.VH, out=[];
 if(mode==='num'){
  const kw=o.kw||74, gx=10, gy=8, kh=o.kh||Math.round(Math.min(54,Math.max(42,(VH-290)/4.3)));
  const W=kw*3+gx*2, H=kh*4+gy*3, x0=(VW-W)/2, y0=o.y0!=null?o.y0:VH-12-H;
  OSK_NUM.forEach((r,ri)=>r.forEach((k,ci)=>out.push({k,x:x0+ci*(kw+gx),y:y0+ri*(kh+gy),w:kw,h:kh})));
  return out;
 }
 const gx=3, kw=(VW-10-gx*9)/10, kh=o.kh||28, gy=5;
 const H=kh*5+gy*4, y0=o.y0!=null?o.y0:VH-10-H;
 OSK_ABC.forEach((r,ri)=>{
  const y=y0+ri*(kh+gy);
  if(ri===4){ const dw=74; out.push({k:'SPACE',x:5,y,w:VW-10-dw-gx,h:kh}); out.push({k:'DONE',x:VW-5-dw,y,w:dw,h:kh}); return; }
  if(ri===3){ let x=5; r.forEach(k=>{ const w=k==='DEL'?kw*2+gx:kw; out.push({k,x,y,w,h:kh}); x+=w+gx; }); return; }
  const off=(10-r.length)*(kw+gx)/2;
  r.forEach((k,ci)=>out.push({k,x:5+off+ci*(kw+gx),y,w:kw,h:kh}));
 });
 return out;
};
G.oskTop=function(mode,o){ return G.oskRects(mode,o)[0].y; };
/* returns 'DONE' when the DONE key is tapped, 'KEY' after any other key */
G.osk=function(fieldId,mode,o){
 const f=G.fields[fieldId]; if(!f) return null;
 const R=G.oskRects(mode,o);
 let k=null;
 for(const r of R) if(G.clicked(r.x,r.y,r.w,r.h)){ k=r.k; break; }
 if(!k) return null;
 if(k==='DONE'){ AUDIO.sfx('ok'); return 'DONE'; }
 let v=f.el.value;
 if(k==='DEL'){ if(!v) return 'KEY'; v=v.slice(0,-1); AUDIO.sfx('back'); }
 else {
  if(f.o.max&&v.length>=f.o.max){ AUDIO.sfx('buzzer'); return 'KEY'; }
  v+=k==='SPACE'?' ':k; AUDIO.sfx('blip');
 }
 G.typeInto(fieldId,v);
 return 'KEY';
};
G.oskDraw=function(c,mode,o){
 o=o||{};
 const R=G.oskRects(mode,o);
 if(o.hint!==false) G.txt(o.hint||(mode==='num'?'OR TAP THE KEYPAD':'OR TAP THE KEYS'),VW/2,R[0].y-15,6,C.dim,'center',VW-20,700);
 const num=mode==='num';
 R.forEach(r=>{
  const press=G.held(r.x,r.y,r.w,r.h), y=r.y+(press?1:0);
  const special=r.k.length>1, ready=r.k==='DONE'&&o.ready;
  if(ready) G.glowFill(r.x,y,r.w,r.h,num?14:8);
  else {
   G.rrect(r.x,y,r.w,r.h,num?14:7);
   CTX.fillStyle=press?C.keyPress:(special?C.keySpecial:(num?C.keyNum:C.key)); CTX.fill();
   CTX.strokeStyle='rgba(255,255,255,.09)'; CTX.lineWidth=1; CTX.stroke();
  }
  let lab=r.k; if(lab==='DEL') lab='⌫'; if(lab==='DONE') lab=o.doneLabel||'DONE';
  const sz=num?(special?8:14):(special?(r.k==='DEL'?10:6.5):8.5);
  G.txt(lab,r.x+r.w/2,y+(r.h-sz*1.3)/2,sz,ready?C.onAccent:(special?C.accentText:C.ink),'center',r.w-4,700);
 });
};

/* ---------- draw kit ---------- */
let CTX=null;
/* G.withCtx(ctx, fn): run drawing code against another 2D context (for example a figure inside an HTML page), then restore */
G.withCtx=function(ctx,fn){ const prev=CTX; CTX=ctx; try{ return fn(ctx); } finally { CTX=prev; } };
const FAM=((CFG.font&&CFG.font.family)?"'"+CFG.font.family+"', ":'')+'system-ui, sans-serif';
G.font=function(size,wt){ return (wt||(size>=10?800:600))+' '+(size*1.3).toFixed(1)+'px '+FAM; };
G.rrect=function(x,y,w,h,r){
 r=Math.max(0,Math.min(r,w/2,h/2));
 CTX.beginPath();
 CTX.moveTo(x+r,y);
 CTX.arcTo(x+w,y,x+w,y+h,r); CTX.arcTo(x+w,y+h,x,y+h,r);
 CTX.arcTo(x,y+h,x,y,r); CTX.arcTo(x,y,x+w,y,r);
 CTX.closePath();
};
/* text that is too wide for its space gets a little smaller first (down to 80%), and only then narrower,
   so a long title stays readable instead of being squashed (widths are cached per font + text) */
const WCACHE=new Map();
try{ if(document.fonts&&document.fonts.addEventListener) document.fonts.addEventListener('loadingdone',()=>WCACHE.clear()); }catch(e){}   // widths measured with a fallback font are thrown away once the real font arrives
function fitFont(s,y,size,wt,maxw){ const f=G.font(size,wt); CTX.font=f; if(!maxw) return y;
 const key=f+'|'+s; let w=WCACHE.get(key); if(w==null){ w=CTX.measureText(s).width; if(WCACHE.size>4000) WCACHE.clear(); WCACHE.set(key,w); }
 if(w<=maxw) return y; const k=Math.max(.8,maxw/w); CTX.font=G.font(size*k,wt); return y+size*1.3*(1-k)*.5; }
G.txt=function(s,x,y,size,col,align,maxw,wt){
 CTX.textAlign=align||'left'; CTX.textBaseline='top';
 CTX.fillStyle=col||C.ink;
 const yy=fitFont(s,y,size,wt,maxw);
 if(maxw) CTX.fillText(s,x,yy,maxw); else CTX.fillText(s,x,yy);
};
G.txtO=function(s,x,y,size,col,align,maxw){
 CTX.save();
 CTX.textAlign=align||'left'; CTX.textBaseline='top';
 const yy=fitFont(s,y,size,800,maxw);
 CTX.shadowColor='rgba(0,0,0,.75)'; CTX.shadowBlur=4; CTX.shadowOffsetY=1.5;
 CTX.fillStyle=col||'#fff';
 if(maxw){ CTX.fillText(s,x,yy,maxw); CTX.fillText(s,x,yy,maxw); } else { CTX.fillText(s,x,yy); CTX.fillText(s,x,yy); }
 CTX.restore();
};
G.tw=function(s,size,wt){ CTX.font=G.font(size,wt); return CTX.measureText(s).width; };
G.wrap=function(s,size,maxw,wt){
 CTX.font=G.font(size,wt);
 const words=String(s).split(' '), lines=[]; let cur='';
 for(const w of words){
  const t=cur?cur+' '+w:w;
  if(CTX.measureText(t).width>maxw && cur){ lines.push(cur); cur=w; } else cur=t;
 }
 if(cur) lines.push(cur); return lines;
};
G.para=function(s,x,y,size,col,align,maxw,lh,wt){ // wrapped paragraph; returns height
 const L=G.wrap(s,size,maxw,wt); lh=lh||size*1.55;
 L.forEach((l,i)=>G.txt(l,x,y+i*lh,size,col,align,undefined,wt));
 return L.length*lh;
};
G.panel=function(x,y,w,h,opts){
 opts=opts||{};
 const r=opts.r??12, bd=opts.border||A(.75);
 CTX.save();
 CTX.shadowColor='rgba(0,0,0,.55)'; CTX.shadowBlur=14; CTX.shadowOffsetY=4;
 G.rrect(x,y,w,h,r); CTX.fillStyle=opts.bg||C.panel; CTX.fill();
 CTX.restore();
 CTX.save();
 G.rrect(x,y,w,h,r); CTX.clip();
 const g=CTX.createLinearGradient(0,y,0,y+28);
 g.addColorStop(0,'rgba(255,255,255,.07)'); g.addColorStop(1,'rgba(255,255,255,0)');
 CTX.fillStyle=g; CTX.fillRect(x,y,w,28);
 CTX.restore();
 if(bd!=='none'){ G.rrect(x+.75,y+.75,w-1.5,h-1.5,r); CTX.strokeStyle=bd; CTX.lineWidth=1.5; CTX.stroke(); }
};
G.glowFill=function(x,y,w,h,r){
 CTX.save();
 CTX.shadowColor=C.accentHi; CTX.shadowBlur=10+(G.rm()?0:Math.sin(G.time*5)*4);
 G.rrect(x,y,w,h,r);
 const g=CTX.createLinearGradient(0,y,0,y+h); g.addColorStop(0,C.accentHi); g.addColorStop(1,C.accentLo);
 CTX.fillStyle=g; CTX.fill(); CTX.fill();
 CTX.restore();
};
G.selRect=function(x,y,w,h,solid){
 if(solid) G.glowFill(x,y,w,h,Math.min(10,h/2));
 else { G.rrect(x,y,w,h,Math.min(10,h/2)); CTX.fillStyle=A(.28); CTX.fill(); }
 G.rrect(x,y,w,h,Math.min(10,h/2)); CTX.strokeStyle=AH(solid?.75:.45); CTX.lineWidth=1; CTX.stroke();
};
/* buttons: kind = primary (glowing accent) | secondary | ghost | danger | success | selected */
G.button=function(b,focus){
 if(b.hidden) return;
 const kind=b.kind||'secondary', r=b.r??Math.min(12,b.h/2);
 const press=!b.disabled&&G.held(b.x,b.y,b.w,b.h);
 const hov=!b.disabled&&!G.isTouch&&G.hit(b.x,b.y,b.w,b.h);
 const y=b.y+(press?1:0);
 CTX.save();
 if(b.disabled) CTX.globalAlpha=.42;
 let tc=C.ink;
 if(kind==='primary'){ G.glowFill(b.x,y,b.w,b.h,r); tc=C.onAccent; }
 else if(kind==='selected'){ G.rrect(b.x,y,b.w,b.h,r); const g=CTX.createLinearGradient(0,y,0,y+b.h); g.addColorStop(0,C.accentHi); g.addColorStop(1,C.accentLo); CTX.fillStyle=g; CTX.fill(); tc=C.onAccent; }
 else {
  G.rrect(b.x,y,b.w,b.h,r);
  const fills={secondary:hov?C.btnHi:C.btn,ghost:hov?A(.14):A(.06),danger:hov?C.dangerHi:C.danger,success:hov?C.successHi:C.success};
  CTX.fillStyle=fills[kind]||fills.secondary; CTX.fill();
  const strokes={secondary:C.btnLine,ghost:A(.7),danger:C.dangerLine,success:C.successLine};
  CTX.strokeStyle=strokes[kind]||strokes.secondary; CTX.lineWidth=1.2; CTX.stroke();
  tc={ghost:C.accentText,danger:C.dangerInk,success:C.successInk}[kind]||tc;
 }
 if(press){ G.rrect(b.x,y,b.w,b.h,r); CTX.fillStyle='rgba(0,0,0,.18)'; CTX.fill(); }
 if(focus&&G.kbMode&&!b.disabled){ G.rrect(b.x-3,y-3,b.w+6,b.h+6,r+3); CTX.strokeStyle=C.title; CTX.lineWidth=2; CTX.stroke(); }
 const size=b.size||8.5;
 if(b.sub){
  G.txt(b.label,b.x+b.w/2,y+b.h/2-size*1.3+1,size,b.labelCol||tc,'center',b.w-14);
  G.txt(b.sub,b.x+b.w/2,y+b.h/2+2,b.subSize||6.5,b.subCol||(kind==='primary'||kind==='selected'?G.rgba(C.onAccent,.75):C.dim),'center',b.w-14);
 } else if(b.label) G.txt(b.label,b.x+b.w/2,y+(b.h-size*1.3)/2,size,b.labelCol||tc,'center',b.w-12);
 CTX.restore();
};
G.drawBtns=function(btns,st){ btns.forEach((b,i)=>G.button(b,st&&st.f===i)); };
/* list navigation: arrows move focus, A/Enter or tap activates. Returns the button id. */
G.navList=function(st,btns,opts){
 opts=opts||{};
 const n=btns.length; if(!n) return null;
 if(st.f==null||st.f>=n) st.f=0;
 const step=d=>{ for(let k=0;k<n;k++){ st.f=(st.f+d+n)%n; if(!btns[st.f].disabled&&!btns[st.f].hidden) break; } AUDIO.sfx('blip'); };
 if(!opts.noKeys){
  if(G.pressed.up||((opts.horiz||opts.both)&&G.pressed.left)) step(-1);
  if(G.pressed.down||((opts.horiz||opts.both)&&G.pressed.right)) step(1);
 }
 for(let i=0;i<n;i++){ const b=btns[i]; if(b.disabled||b.hidden) continue;
  if(G.clicked(b.x,b.y,b.w,b.h)){ st.f=i; if(!b.silent) AUDIO.sfx('ok'); return b.id; } }
 if(G.pressed.a&&!opts.noKeys){ const b=btns[st.f]; if(b&&!b.disabled&&!b.hidden){ if(!b.silent) AUDIO.sfx('ok'); return b.id; } }
 return null;
};
/* top bar with a real BACK button (+ optional settings gear and a right-hand pill) */
G.BACK={x:6,y:7,w:68,h:27};
G.GEAR={x:VW-40,y:7,w:34,h:27};
G.topBar=function(title,o){
 o=o||{};
 if(title!==G._saidTitle){ G._saidTitle=title; G.announce(title); }   // screen readers hear each new screen's title once
 CTX.fillStyle=G.rgba(C.bg,.94); CTX.fillRect(0,0,VW,41);
 CTX.fillStyle=A(.55); CTX.fillRect(0,41,VW,1);
 if(o.back!==false){
  const B=G.BACK, press=G.held(B.x,B.y,B.w,B.h), dy=press?1:0;
  G.rrect(B.x,B.y+dy,B.w,B.h,13.5);
  { const g=CTX.createLinearGradient(0,B.y,0,B.y+B.h); g.addColorStop(0,A(press?.5:.3)); g.addColorStop(1,A(press?.3:.14)); CTX.fillStyle=g; CTX.fill(); }
  CTX.strokeStyle=AH(.9); CTX.lineWidth=1.3; CTX.stroke();
  CTX.strokeStyle=C.accentText; CTX.lineWidth=2.2; CTX.lineCap='round'; CTX.lineJoin='round';
  CTX.beginPath(); CTX.moveTo(B.x+17,B.y+8+dy); CTX.lineTo(B.x+11,B.y+13.5+dy); CTX.lineTo(B.x+17,B.y+19+dy); CTX.stroke();
  G.txt(o.backLabel||'BACK',B.x+41,B.y+7.5+dy,7.5,C.accentText,'center',44,800);
 }
 if(title){   // centered on the screen when it fits; a long title moves into the free space beside the back button instead of being squashed
  const Lx=o.back!==false?G.BACK.x+G.BACK.w+6:8; let Rx=VW-8; if(o.gear) Rx=G.GEAR.x-6;
  if(o.right){ CTX.font=G.font(7,700); Rx=Math.min(Rx,VW-12-(CTX.measureText(o.right).width+16)); }
  const size=o.size||9.5, symW=2*Math.min(VW/2-Lx,Rx-VW/2), need=Math.max(G.tw(title,size,800),o.sub?G.tw(o.sub,6,700):0);
  const shift=need>symW, cx=shift?(Lx+Rx)/2:VW/2, mw=shift?Rx-Lx:symW;
  G.txt(title,cx,o.sub?6.5:13,size,o.col||C.titleGold||C.title,'center',mw,800);
  if(o.sub) G.txt(o.sub,cx,25,6,o.subCol||C.sub,'center',mw,700);
 }
 if(o.gear&&G.ART&&G.ART.disc(CTX,'settings',G.GEAR.x+G.GEAR.w/2,G.GEAR.y+G.GEAR.h/2+(G.held(G.GEAR.x,G.GEAR.y,G.GEAR.w,G.GEAR.h)?1:0),G.GEAR.h+6)){ if(o.gearDot){ CTX.beginPath(); CTX.arc(G.GEAR.x+G.GEAR.w-3,G.GEAR.y+3,4,0,7); CTX.fillStyle=C.bad; CTX.fill(); } }
 else if(o.gear){
  const B=G.GEAR, press=G.held(B.x,B.y,B.w,B.h);
  G.rrect(B.x,B.y+(press?1:0),B.w,B.h,10); CTX.fillStyle=press?A(.35):'rgba(255,255,255,.08)'; CTX.fill();
  CTX.strokeStyle=AH(.8); CTX.lineWidth=1.2; CTX.stroke();
  if(G.icon) G.icon('gear',CTX,B.x+B.w/2,B.y+B.h/2+(press?1:0),15,C.accentText);
  if(o.gearDot){ CTX.beginPath(); CTX.arc(B.x+B.w-3,B.y+3,4,0,7); CTX.fillStyle=C.bad; CTX.fill(); }
 }
 if(o.right){
  CTX.font=G.font(7,700);
  const w=CTX.measureText(o.right).width+16;
  G.rrect(VW-6-w,9,w,22,11); CTX.fillStyle=G.rgba(C.title,.12); CTX.fill();
  CTX.strokeStyle=G.rgba(C.title,.4); CTX.lineWidth=1; CTX.stroke();
  G.txt(o.right,VW-6-w/2,14.5,7,o.rightCol||C.title,'center',w-8,700);
 }
};
G.backHit=function(){ const B=G.BACK; const h=G.pressed.b||G.clicked(B.x,B.y,B.w,B.h); if(h){ AUDIO.sfx('back'); G.pressed.b=false; G.ptr.click=false; } return h; };
G.gearHit=function(){ const B=G.GEAR; const h=G.clicked(B.x,B.y,B.w,B.h); if(h){ AUDIO.sfx('ok'); G.ptr.click=false; } return h; };
/* in-game pause button (top-left of a HUD) */
G.PAUSE={x:6,y:7,w:34,h:27};
G.pauseBtnDraw=function(){
 const P=G.PAUSE, press=G.held(P.x,P.y,P.w,P.h);
 G.rrect(P.x,P.y,P.w,P.h,10); CTX.fillStyle=press?A(.35):'rgba(255,255,255,.08)'; CTX.fill();
 CTX.strokeStyle=AH(.8); CTX.lineWidth=1.2; CTX.stroke();
 CTX.fillStyle=C.accentText; CTX.fillRect(P.x+12,P.y+8,3.5,11); CTX.fillRect(P.x+18.5,P.y+8,3.5,11);
};
G.pauseHit=function(){ const P=G.PAUSE; return G.pressed.b||G.pressed.pause||G.clicked(P.x,P.y,P.w,P.h); };
/* centered modal with stacked buttons. o = {title, sub, lines:[[text,col,size]], btns:[{id,label,kind}], drawBody, bodyH} */
G.Modal=function(o){
 return { o, st:{f:o.focus||0},
  rects(){
   const VH=G.VH, w=o.w||244, x=(VW-w)/2;
   const btnH=o.btnH||38, gap=8;
   const bodyH=o.bodyH!=null?o.bodyH:(o.lines?o.lines.length*17+6:0);
   const titleH=o.title?(o.sub?44:32):10;
   const h=titleH+bodyH+o.btns.length*(btnH+gap)+12;
   const y=o.y!=null?o.y:Math.max(48,Math.round((VH-h)/2));
   const btns=o.btns.map((b,i)=>Object.assign({},b,{x:x+14,y:y+titleH+bodyH+6+i*(btnH+gap),w:w-28,h:btnH}));
   return {x,y,w,h,titleH,bodyH,btns};
  },
  update(){ return G.navList(this.st,this.rects().btns); },
  draw(c){
   if(o.dim!==0) G.dim(o.dim||.62);
   const R=this.rects();
   G.panel(R.x,R.y,R.w,R.h,{border:o.border});
   if(o.title) G.txtO(o.title,VW/2,R.y+12,o.titleSize||10,o.titleCol||C.title,'center',R.w-20);
   if(o.sub) G.txt(o.sub,VW/2,R.y+30,6.5,o.subCol||C.sub,'center',R.w-20);
   if(o.drawBody) o.drawBody(c,R.x,R.y+R.titleH,R.w);
   else if(o.lines) o.lines.forEach((l,i)=>G.txt(l[0],VW/2,R.y+R.titleH+i*17,l[2]||8,l[1]||C.ink,'center',R.w-22));
   G.drawBtns(R.btns,this.st);
  }
 };
};
/* yes/no confirm in one call: G.confirm({title,lines,yes,no,danger}) -> modal; .update() returns 'yes'|'no'|null */
G.confirm=function(o){
 return G.Modal({title:o.title,lines:(o.lines||[]).map(l=>[l,C.sub,7.5]),btns:[{id:'yes',label:o.yes||'OK',kind:o.danger?'danger':'primary'},{id:'no',label:o.no||'CANCEL'}]});
};
/* standard pause menu for a game: G.Pause({restart:[scene,args], quit:[scene,args]}) */
G.Pause=function(o){
 return { open:false, m:null,
  show(){
   this.open=true; AUDIO.sfx('back'); G.hideFields(true);
   this.m=G.Modal({title:'PAUSED',btns:[{id:'resume',label:'RESUME',kind:'primary'},{id:'restart',label:'RESTART'},{id:'quit',label:o.quitLabel||'QUIT'}]});
  },
  update(){
   const r=this.m.update();
   if(r==='resume'||(r==null&&(G.pressed.b||G.pressed.pause))){ this.open=false; G.hideFields(false); return; }
   if(r==='restart') G.go(o.restart[0],o.restart[1]);
   if(r==='quit') G.go(o.quit[0],o.quit[1]);
  },
  draw(c){ this.m.draw(c); }
 };
};
/* segmented control + switch */
G.segRects=function(x,y,w,h,n){ const a=[],sw=w/n; for(let i=0;i<n;i++) a.push({x:x+i*sw,y,w:sw,h}); return a; };
G.seg=function(x,y,w,h,labels,sel,size){
 G.rrect(x,y,w,h,h/2); CTX.fillStyle='rgba(255,255,255,.06)'; CTX.fill();
 CTX.strokeStyle='rgba(255,255,255,.12)'; CTX.lineWidth=1; CTX.stroke();
 const R=G.segRects(x,y,w,h,labels.length);
 R.forEach((r,i)=>{
  if(i===sel){ G.rrect(r.x+2,r.y+2,r.w-4,r.h-4,(h-4)/2); const g=CTX.createLinearGradient(0,r.y,0,r.y+r.h); g.addColorStop(0,C.accentHi); g.addColorStop(1,C.accentLo); CTX.fillStyle=g; CTX.fill(); }
  G.txt(labels[i],r.x+r.w/2,r.y+(h-(size||7.5)*1.3)/2,size||7.5,i===sel?C.onAccent:C.sub,'center',r.w-8,700);
 });
};
G.segHit=function(x,y,w,h,n){ const R=G.segRects(x,y,w,h,n); for(let i=0;i<n;i++){ const r=R[i]; if(G.clicked(r.x,r.y,r.w,r.h)) return i; } return -1; };
G.toggleDraw=function(x,y,on){
 G.rrect(x,y,38,22,11); CTX.fillStyle=on?C.accent:'rgba(255,255,255,.14)'; CTX.fill();
 CTX.beginPath(); CTX.arc(on?x+27:x+11,y+11,8,0,7); CTX.fillStyle='#f6f0e6'; CTX.fill();
};
G.chip=function(text,x,y,o){
 o=o||{}; const size=o.size||6.5;
 CTX.font=G.font(size,700);
 const w=CTX.measureText(text).width+14, h=size*1.3+8;
 const lx=o.align==='right'?x-w:(o.align==='center'?x-w/2:x);
 G.rrect(lx,y,w,h,h/2); CTX.fillStyle=o.bg||'rgba(255,255,255,.08)'; CTX.fill();
 if(o.border){ CTX.strokeStyle=o.border; CTX.lineWidth=1; CTX.stroke(); }
 G.txt(text,lx+w/2,y+4,size,o.col||C.ink,'center',undefined,700);
 return w;
};
/* draw an image cover-fit into a box (fy/fx = focus 0..1) */
G.cover=function(img,x,y,w,h,fy,fx){
 if(!img) return;
 const R=img.safe||[0,0,img.width,img.height];
 const s=Math.max(w/R[2],h/R[3]);
 const sw=w/s, sh=h/s;
 const sx=R[0]+(R[2]-sw)*(fx==null?.5:fx), sy=R[1]+(R[3]-sh)*(fy==null?.5:fy);
 CTX.drawImage(img,sx,sy,sw,sh,x,y,w,h);
};
/* the shared background: CONFIG.backdrop art dimmed, or a soft accent gradient */
G.backdrop=function(dim){
 const VH=G.VH, im=CFG.backdrop&&G.img[CFG.backdrop];
 if(im){ G.cover(im,0,0,VW,VH,.35); G.dim(dim==null?.84:dim); return; }
 const g=CTX.createRadialGradient(VW/2,VH*.28,10,VW/2,VH*.28,VH*.8);
 g.addColorStop(0,C.bgGlow||C.bg); g.addColorStop(1,C.bg); CTX.fillStyle=g; CTX.fillRect(0,0,VW,VH);
};
G.dim=function(a){ CTX.fillStyle='rgba(0,0,0,'+a+')'; CTX.fillRect(-4,-4,VW+8,G.VH+8); };
G.rm=function(){ return G.save.settings.rm; };
/* drag / wheel scrolling for read-only content */
G.scroll=function(st,area,contentH){
 const max=Math.max(0,contentH-area.h);
 if(G.ptr.down&&G.ptr.sx>=area.x&&G.ptr.sx<=area.x+area.w&&G.ptr.sy>=area.y&&G.ptr.sy<=area.y+area.h) st.scroll=(st.scroll||0)-G.dragDY;
 if(G.wheelDY&&G.hit(area.x,area.y,area.w,area.h)) st.scroll=(st.scroll||0)+G.wheelDY;
 if(G.pressed.down) st.scroll=(st.scroll||0)+40;
 if(G.pressed.up) st.scroll=(st.scroll||0)-40;
 st.scroll=Math.max(0,Math.min(max,st.scroll||0));
 return max;
};
/* scrollable list of equal-height tappable rows. Returns the tapped/activated index or -1. st keeps {f, scroll}. */
G.listNav=function(st,area,n,rowH,gap,extra){
 gap=gap==null?6:gap; const pitch=rowH+gap, contentH=Math.max(0,n*pitch-gap), N=n+(extra||0);
 if(st.f==null) st.f=0; if(st.scroll==null) st.scroll=0;
 if(G.ptr.down&&G.ptr.sx>=area.x&&G.ptr.sx<=area.x+area.w&&G.ptr.sy>=area.y&&G.ptr.sy<=area.y+area.h) st.scroll-=G.dragDY;
 if(G.wheelDY&&G.hit(area.x,area.y,area.w,area.h)) st.scroll+=G.wheelDY;
 let hit=-1;
 if(N){
  if(st.f>=N) st.f=N-1;
  let mv=false;
  if(G.pressed.up){ st.f=(st.f+N-1)%N; mv=true; }
  if(G.pressed.down){ st.f=(st.f+1)%N; mv=true; }
  if(mv){ AUDIO.sfx('blip'); if(st.f<n){ const top=st.f*pitch; if(top<st.scroll) st.scroll=top; if(top+rowH>st.scroll+area.h) st.scroll=top+rowH-area.h; } }
  const scrolls=contentH>area.h;
  if(n&&(scrolls?G.tapped(area.x,area.y,area.w,area.h):G.clicked(area.x,area.y,area.w,area.h))){
   const px=scrolls?G.ptr.rsx:G.ptr.x, py=scrolls?G.ptr.rsy:G.ptr.y;
   const off=py-area.y+st.scroll, i=Math.floor(off/pitch);
   if(i>=0&&i<n&&off-i*pitch<=rowH){ st.f=i; hit=i; st.tx=px; st.ty=off-i*pitch; }
  }
  if(G.pressed.a){ hit=st.f; st.tx=null; st.ty=null; }
 }
 st.scroll=Math.max(0,Math.min(Math.max(0,contentH-area.h),st.scroll));
 st.contentH=contentH;
 return hit;
};
G.scrollBar=function(area,contentH,scroll){
 if(contentH<=area.h) return;
 const th=Math.max(24,area.h*area.h/contentH), ty=area.y+(area.h-th)*(scroll/(contentH-area.h));
 G.rrect(area.x+area.w-4,ty,3,th,1.5); CTX.fillStyle=AH(.5); CTX.fill();
};
G.shuffle=function(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); const t=a[i]; a[i]=a[j]; a[j]=t; } return a; };
G.when=function(ts){ return ts?new Date(ts).toLocaleString([],{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}).toUpperCase():'-'; };
G.ago=function(ts){
 if(!ts) return 'NEVER';
 const m=Math.floor((Date.now()-ts)/60000);
 if(m<2) return 'JUST NOW';
 if(m<60) return m+' MIN AGO';
 const h=Math.floor(m/60); if(h<24) return h+(h===1?' HR AGO':' HRS AGO');
 const d=Math.floor(h/24); if(d<7) return d===1?'YESTERDAY':d+' DAYS AGO';
 return new Date(ts).toLocaleDateString([],{month:'short',day:'numeric'}).toUpperCase();
};

/* ---------- boot / loop ---------- */
const APP={};
window.APP=APP;
APP.boot=function(){
 G.canvas=document.getElementById('game'); G.ctx=G.canvas.getContext('2d');
 try{ const cv=G.canvas; if(!cv.getAttribute('role')) cv.setAttribute('role','application'); cv.setAttribute('aria-roledescription','game'); if(!cv.getAttribute('aria-label')) cv.setAttribute('aria-label',(CFG.a11yLabel||CFG.pageTitle||CFG.name)); cv.tabIndex=0;
  if(!document.getElementById('sr-live')){ const lv=document.createElement('div'); lv.id='sr-live'; lv.setAttribute('aria-live','polite'); lv.setAttribute('role','status'); lv.style.cssText='position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0'; document.body.appendChild(lv); } }catch(e){}
 CTX=G.ctx;
 G.loadSave(); G.loadRoster();
 resize(); addEventListener('resize',resize);
 if(window.visualViewport) visualViewport.addEventListener('resize',()=>G.placeFields());
 try{ AUDIO.preload(); }catch(e){}
 if(G.data) G.data.init();   // start connecting to the shared database while the art loads
 const msg=document.getElementById('bootmsg'), list=CFG.assets||[];
 let left=list.length;
 if(!left) ready();
 list.forEach(a=>{
  const im=new Image();
  im.onload=()=>{ if(a.safe) im.safe=a.safe; G.img[a.name]=im; if(--left===0) ready(); };
  im.onerror=()=>{ console.warn('missing asset',a.src); if(--left===0) ready(); };
  im.src=a.src;
 });
 function ready(){
  msg.textContent=CFG.readyText||'READY.';
  const b=document.getElementById('tapstart'); b.style.display='block';
  b.onclick=()=>{
   AUDIO.init(); AUDIO.resume();
   AUDIO.setMusic(G.save.settings.music); AUDIO.setSfx(G.save.settings.sfx);
   document.getElementById('boot').style.display='none';
   bindInput();
   const start=(CFG.accounts&&CFG.accounts.enabled===false)?G.homeScene():(CFG.startScene||'title');
   G.go(start,{},true);
   AUDIO.play(AUDIO.menuMusic());
   requestAnimationFrame(loop);
  };
 }
};
function resize(){
 const w=innerWidth,h=innerHeight;
 G.VH = h>w ? Math.max(480,Math.min(600,Math.round(VW*h/w))) : 480;
 const s=Math.min(w/VW,h/G.VH);
 G.canvas.style.width=Math.round(VW*s)+'px'; G.canvas.style.height=Math.round(G.VH*s)+'px';
 G.k=Math.max(1,Math.min(4,s*(devicePixelRatio||1)));
 G.canvas.width=Math.round(VW*G.k); G.canvas.height=Math.round(G.VH*G.k);
 if(CTX){ CTX.imageSmoothingEnabled=true; CTX.imageSmoothingQuality='high'; }
 G.placeFields();
}
G.resize=resize;
let last=0;
const HOLD={};
function loop(t){
 requestAnimationFrame(loop);
 let dt=(t-last)/1000; last=t;
 if(dt>0.1) dt=0.1;
 G.time+=dt; G.frame++;
 for(const k of ['up','down','left','right']){
  if(G.keys[k]){ HOLD[k]=(HOLD[k]||0)+dt; if(HOLD[k]>.38){ HOLD[k]-=.12; G.pressed[k]=true; } }
  else HOLD[k]=0;
 }
 if(G.fadeDir===1){ G.fade=Math.min(1,G.fade+dt*5); if(G.fade>=1&&G.pending){ G.pending(); G.pending=null; G.fadeDir=-1; } }
 else if(G.fadeDir===-1 && G.fade>0){ G.fade=Math.max(0,G.fade-dt*5); }
 const k=G.k||1, VH=G.VH;
 let bad=null;
 try{ const held=G.preUpdate?G.preUpdate(dt):false;   // a rendition hook may take this frame's input first (a modal notice), and say so
   if(!held&&G.scene&&G.scene.update&&(G.fadeDir!==1)) G.scene.update(dt); }catch(e){ bad=e; }
 CTX.setTransform(k,0,0,k,0,0);
 CTX.imageSmoothingEnabled=true; CTX.imageSmoothingQuality='high';
 if(G.shake>0 && !G.rm()){
  CTX.setTransform(k,0,0,k,(Math.random()*2-1)*G.shake*k,(Math.random()*2-1)*G.shake*k);
  G.shake=Math.max(0,G.shake-dt*18);
 }
 CTX.fillStyle=C.bg; CTX.fillRect(-8,-8,VW+16,VH+16);
 if(!bad){ try{ if(G.scene&&G.scene.draw) G.scene.draw(CTX,dt); }catch(e){ bad=e; } }
 CTX.setTransform(k,0,0,k,0,0); CTX.globalAlpha=1;
 if(bad) frameFailed(bad); else G.badFrames=0;
 if(G.drawNotices){ try{ G.drawNotices(CTX,dt); }catch(e){ logError(e,'notices'); drawToasts(dt); } } else drawToasts(dt);
 if(G.fade>0){ CTX.fillStyle='rgba(0,0,0,'+G.fade+')'; CTX.fillRect(0,0,VW,VH); }
 if(Object.keys(G.fields).length) G.placeFields();
 G.pressed={}; G.typed=[]; G.ptr.click=false; G.ptr.released=false; G.swipe=null; G.dragDX=0; G.dragDY=0; G.wheelDY=0;
}
/* One bad frame must not freeze the game. The error is logged (G.errors keeps the last 20, for support), the frame still finishes
   (input state is cleared below), and if the same scene fails 30 frames running the cadet is sent home instead of staring at a frozen screen. */
G.errors=[]; G.badFrames=0;
function logError(e,where){ const r={t:Date.now(),where,scene:G.sceneName,msg:String(e&&e.message||e),stack:String(e&&e.stack||'').split('\n').slice(0,3).join(' | ')}; G.errors.push(r); if(G.errors.length>20) G.errors.shift(); if(G.errors.length<=3||G.badFrames===1) console.error('HFQ error',r); }
function frameFailed(e){
 if(++G.badFrames===1) logError(e,'frame');
 if(G.badFrames>=30 && G.sceneName!==G.homeScene()){ G.badFrames=0; G.toast(G.word('crashHome'),'#ff6b6b'); try{ G.go(G.homeScene(),{},true); }catch(e2){ logError(e2,'recover'); } }
}
window.addEventListener('error',ev=>{ try{ logError(ev.error||ev.message,'window'); }catch(e){} });
window.addEventListener('unhandledrejection',ev=>{ try{ logError(ev.reason,'promise'); }catch(e){} });
function drawToasts(dt){
 // the two oldest toasts are on screen and count down; the rest wait their turn, so none covers the screen or gets lost
 for(let i=Math.min(1,G.toasts.length-1);i>=0;i--){ const t=G.toasts[i]; t.t-=dt; if(t.t<=0) G.toasts.splice(i,1); }
 let y=48;
 for(const t of G.toasts.slice(0,2)){
  CTX.globalAlpha=Math.min(1,t.t*2);
  CTX.font=G.font(7.5,700);
  const w=Math.min(VW-16,CTX.measureText(t.msg).width+24);
  G.rrect(VW/2-w/2,y,w,20,10);
  CTX.fillStyle='rgba(12,12,18,.94)'; CTX.fill();
  CTX.strokeStyle=t.col; CTX.lineWidth=1.25; CTX.stroke();
  G.txt(t.msg,VW/2,y+5,7.5,t.col,'center',w-14,700);
  CTX.globalAlpha=1;
  y+=24;
 }
}
})();
