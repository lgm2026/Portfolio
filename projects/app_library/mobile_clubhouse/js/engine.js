/* RKA engine core — PORTRAIT edition.
   Virtual canvas 270 wide x 480..600 tall (sized to fill a phone held upright),
   hi-res backing buffer, keyboard + multi-touch + swipe input, native text fields,
   and the shared UI kit (top bar with BACK, buttons, modals, pause). */
(function(){
const VW=270;
const ASSETS = ['crest','crest_sm','ladies','photo_club',
 'bg_convoy','bg_501','bg_bikerdown','bg_dining','bg_charity',
 'rider_red','rider_orange','rider_trike','rider_couple'];

const G = {
 VW, VH:480, canvas:null, ctx:null, img:{}, time:0, frame:0,
 keys:{}, pressed:{}, scenes:{}, scene:null, sceneName:'', prevScene:'',
 fade:1, fadeDir:-1, pending:null, shake:0,
 ptr:{x:-99,y:-99,down:false,click:false,released:false,sx:0,sy:0,id:null},
 touches:new Map(), swipe:null, dragDX:0, dragDY:0, wheelDY:0, kbMode:false, isTouch:false,
 toasts:[], save:null, fields:{}, typed:[], primaryField:null, pendingFocus:null, gestureId:0
};
const IOS=/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const SECRET_OK=!!(window.CSS&&CSS.supports&&CSS.supports('-webkit-text-security','disc'));
window.G=G;

/* ---------- saves (multi-profile: guest + member accounts) ---------- */
const GUEST_KEY='rka_save_v1';
function defSave(){
 return { uuid:'g-'+Math.random().toString(36).slice(2,10)+Date.now().toString(36),
  roadName:'', tone:'', mode:'play', created:Date.now(),
  settings:{music:true,sfx:true,rm:false},
  points:0, best:{}, plays:{}, ach:{}, story:0, done:{}, bdDone:false, holes:0,
  avatar:{type:'bagger',seat:1,body:'#c02030',gender:'m',hair:'#6b4a2a',skin:'#e2b88f',style:'short',face:'none',helm:'half',hcol:'#1c1c24',jacket:'#26262f'},
  board:[], mileage:[], jukebox:{}, bgm:'radio', slots:null, seen:{} };
}
G.defSave=defSave;
G.saveKey=GUEST_KEY;
G.activeAcct=null;
G.loadSave=function(key){
 G.saveKey=key||GUEST_KEY;
 let s=null;
 try{ s=JSON.parse(localStorage.getItem(G.saveKey)||'null'); }catch(e){}
 const d=defSave();
 if(s){ for(const k in d) if(!(k in s)) s[k]=d[k]; for(const k in d.settings) if(!(k in s.settings)) s.settings[k]=d.settings[k]; G.save=s; }
 else G.save=d;
};
G.persist=function(){ try{ localStorage.setItem(G.saveKey, JSON.stringify(G.save)); }catch(e){} };
G.resetSave=function(){ try{ localStorage.removeItem(G.saveKey); }catch(e){} G.loadSave(G.saveKey); };
G.logout=function(){ G.activeAcct=null; G.loadSave(GUEST_KEY); };
G.pinHash=function(pin){
 let x=2166136261;
 for(const ch of String(pin)+'|RKA343'){ x^=ch.charCodeAt(0); x=Math.imul(x,16777619)>>>0; }
 return x.toString(36);
};
G.loadRoster=function(){
 try{ G.roster=JSON.parse(localStorage.getItem('rka_roster_v1')||'null')||{accounts:[],adminPin:null}; }
 catch(e){ G.roster={accounts:[],adminPin:null}; }
};
G.saveRoster=function(){ try{ localStorage.setItem('rka_roster_v1',JSON.stringify(G.roster)); }catch(e){} };
G.loginAs=function(acct){
 G.activeAcct=acct;
 G.loadSave('rka_acct_'+acct.id);
 if(!G.save.roadName){ G.save.roadName=acct.roadName; if(!G.save.tone) G.save.tone='garage'; if(acct.mode) G.save.mode=acct.mode==='info'?'info':'play'; G.persist(); }   // a fresh save keeps the clubhouse they picked
};

/* ---------- tone helper ---------- */
G.T=function(line){ if(typeof line==='string') return line; return (G.save.tone==='family'? line.f : line.g) || line.g || line.f; };

/* ---------- points / achievements ---------- */
G.award=function(pts,label){
 pts=Math.max(0,Math.round(pts)); if(!pts) return;
 G.save.points+=pts; G.persist();
 G.toast((label?label+'  ':'')+'+'+pts+' PTS', '#ffd060');
 AUDIO.sfx(pts>=500?'bigpoint':'point');
 if(G.save.points>=15000) G.ach('road_dog');
};
G.ach=function(id){
 if(G.save.ach[id]) return;
 const a=DATA.ACH.find(x=>x.id===id); if(!a) return;
 G.save.ach[id]=Date.now(); G.persist();
 G.toast('BADGE: '+a.n,'#80e0ff'); AUDIO.sfx('cheer');
};
/* queue=true (club notices, log-in nudges): wait for the toasts already up, so a burst plays in turn instead of stacking */
G.toast=function(msg,col,queue){
 let w=0; if(queue) for(const t of G.toasts) w=Math.max(w,(t.w||0)+t.t-.45);
 G.toasts.push({msg,col:col||'#fff',t:3.2,w:Math.min(w,8)}); if(G.toasts.length>5) G.toasts.shift();
};
G.clearToasts=function(keepBadges){ G.toasts=keepBadges?G.toasts.filter(t=>t.msg.indexOf('BADGE')===0):[]; };
G.updateBoard=function(){
 const b=G.save.board, name=G.save.roadName||'GUEST';
 let e=b.find(x=>x.name===name);
 if(!e){ e={name,score:0,date:Date.now()}; b.push(e); }
 if(G.save.points>e.score){ e.score=G.save.points; e.date=Date.now(); }
 b.sort((x,y)=>y.score-x.score); G.save.board=b.slice(0,10); G.persist();
};

/* ---------- input ---------- */
const KEYMAP={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',Enter:'a',Space:'a',KeyZ:'a',KeyJ:'a',Escape:'b',KeyX:'b',KeyK:'b',Backspace:'b',KeyP:'pause'};
function typing(){ const a=document.activeElement; return !!a&&((a.tagName==='INPUT'&&a.type!=='file')||a.tagName==='TEXTAREA'); }
function bindInput(){
 addEventListener('keydown',e=>{
  if(typing()){ if(e.code==='Escape'){ document.activeElement.blur(); e.preventDefault(); } return; }
  // typing on a text screen goes straight into its field (the device keyboard is the default way to type)
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
/* INFORMATIONAL mode (picked at sign-up, switchable in Settings): no walk-around room or story - the clubhouse is a dashboard */
G.isInfo=function(){ return !!G.save&&G.save.mode==='info'; };
G.gamesBack=function(){ return G.isInfo()?'games':'club'; };   // where a game hub's BACK goes
/* the clubhouse's background music: the ROCK RADIO, or the track starred in the jukebox (saved with the profile) */
G.bgm=function(){ const s=G.save, k=s&&s.bgm; return k&&s.bgmPick&&AUDIO.has(k)?k:'radio'; };   // the clubhouse radio unless the jukebox pinned a track
G.go=function(name,args,instant){
 if(name==='club'&&G.isInfo()) name='dash';
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
G.updatePads=function(){}; // legacy no-op: controls are now drawn on screen

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
  el.setAttribute('autocorrect','off'); el.name='rka_'+id+'_'+Math.random().toString(36).slice(2,6);
  document.body.appendChild(el);
  f=G.fields[id]={el,o:{}};
  el.addEventListener('input',()=>{
   const v=filt(f,el.value);
   if(v!==el.value) el.value=v;
   if(f.o.onInput) f.o.onInput(v);
  });
  el.addEventListener('keydown',e=>{
   e.stopPropagation();
   // multi-line boxes keep Enter for new lines (Ctrl/Cmd+Enter submits)
   if(e.key==='Enter'&&(!f.o.multiline||e.ctrlKey||e.metaKey)){ e.preventDefault(); if(f.o.onEnter) f.o.onEnter(); }
   if(e.key==='Escape'){ e.preventDefault(); el.blur(); }
  });
 }
 f.o=o;
 const el=f.el;
 el.readOnly=!!o.readOnly; el.classList.toggle('gread',!!o.readOnly);   // read-only: a document to read, select and copy
 if(o.readOnly) el.spellcheck=false;
 if(!o.multiline) el.type=o.type||((o.secret&&!SECRET_OK)?'password':'text');
 if(o.type==='date'||o.type==='time'){ el.style.colorScheme='dark'; if(o.maxDate) el.max=o.maxDate; else el.removeAttribute('max'); }
 el.inputMode=o.digits?'numeric':(o.tel?'tel':'text');
 if(o.digits) el.setAttribute('pattern','[0-9]*'); else el.removeAttribute('pattern');
 el.setAttribute('autocapitalize',o.digits?'off':(o.upper?'characters':'sentences'));
 el.style.setProperty('-webkit-text-security',o.secret?'disc':'none');
 el.style.letterSpacing=o.secret?'.45em':'.05em';
 el.placeholder=o.placeholder||'';
 el.maxLength=o.digits?Math.max(o.max||0,16):(o.max||200);   // number fields keep the digits of anything pasted ("SC-7" -> 7), then trim
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
/* invisible real link laid over a canvas button (CALL / TEXT need a genuine tap on a tel:/sms: link) */
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
const PHOTOS=new Map();
G.photoImg=function(src){
 if(!src) return null;
 let im=PHOTOS.get(src);
 if(!im){ im=new Image(); im.src=src; PHOTOS.set(src,im); if(PHOTOS.size>200) PHOTOS.delete(PHOTOS.keys().next().value); }
 return im.complete&&im.naturalWidth?im:null;
};
/* round headshot (or initials when there is no photo) */
G.drawFace=function(src,x,y,d,name,ring){
 const im=G.photoImg(src);
 CTX.save();
 CTX.beginPath(); CTX.arc(x+d/2,y+d/2,d/2,0,7); CTX.closePath(); CTX.clip();
 if(im) CTX.drawImage(im,x,y,d,d);
 else {
  const n=String(name||'?'); let h=0; for(const ch of n) h=(h*31+ch.charCodeAt(0))>>>0;
  CTX.fillStyle=['#7a3a1a','#2a4a6a','#3a5a2a','#5a2a5a','#6a5a1a','#2a5a5a'][h%6]; CTX.fillRect(x,y,d,d);
  G.txt(n.slice(0,1).toUpperCase(),x+d/2,y+d/2-d*.26,d*.32,'#f4ede2','center',undefined,800);
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
/* hide every native field except these (an overlay that brings its own field, e.g. a search box) */
G.hideFieldsExcept=function(keep){ for(const id in G.fields){ const on=keep.indexOf(id)>=0; G.fields[id].el.style.visibility=on?'visible':'hidden'; if(!on) G.fields[id].el.blur(); } };
/* a picked photo made phone-friendly: the photo (long edge up to 1280 px, JPEG squeezed under the size cap) + a
   thumbnail (long edge 300 px). The original never leaves the phone. */
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

/* ---------- arcade keys: a SECONDARY way to type into a native field (stays in sync with it) ---------- */
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
 if(o.hint!==false) G.txt(o.hint||(mode==='num'?'OR TAP THE KEYPAD':'OR TAP THE ARCADE KEYS'),VW/2,R[0].y-15,6,'#8a7f70','center',VW-20,700);
 const num=mode==='num';
 R.forEach(r=>{
  const press=G.held(r.x,r.y,r.w,r.h), y=r.y+(press?1:0);
  const special=r.k.length>1, ready=r.k==='DONE'&&o.ready;
  if(ready) G.glowFill(r.x,y,r.w,r.h,num?14:8);
  else {
   G.rrect(r.x,y,r.w,r.h,num?14:7);
   CTX.fillStyle=press?'#423b52':(special?'#1b1924':(num?'#2a2836':'#24222e')); CTX.fill();
   CTX.strokeStyle='rgba(255,255,255,.09)'; CTX.lineWidth=1; CTX.stroke();
  }
  let lab=r.k; if(lab==='DEL') lab='\u232B'; if(lab==='DONE') lab=o.doneLabel||'DONE'; if(lab==='SPACE') lab='SPACE';
  const sz=num?(special?8:14):(special?(r.k==='DEL'?10:6.5):8.5);
  G.txt(lab,r.x+r.w/2,y+(r.h-sz*1.3)/2,sz,ready?'#16100a':(special?'#ffb060':'#eee4d4'),'center',r.w-4,700);
 });
};

/* ---------- color helpers ---------- */
G.shade=function(hex,f){
 const n=parseInt(hex.slice(1),16);
 const r=Math.max(0,Math.min(255,Math.round(((n>>16)&255)*f)));
 const g=Math.max(0,Math.min(255,Math.round(((n>>8)&255)*f)));
 const b=Math.max(0,Math.min(255,Math.round((n&255)*f)));
 return '#'+((1<<24)|(r<<16)|(g<<8)|b).toString(16).slice(1);
};

/* ---------- draw kit ---------- */
let CTX=null;
G.font=function(size,wt){ return (wt||(size>=10?800:600))+' '+(size*1.3).toFixed(1)+'px Rubik, system-ui, sans-serif'; };
G.rrect=function(x,y,w,h,r){
 r=Math.max(0,Math.min(r,w/2,h/2));
 CTX.beginPath();
 CTX.moveTo(x+r,y);
 CTX.arcTo(x+w,y,x+w,y+h,r); CTX.arcTo(x+w,y+h,x,y+h,r);
 CTX.arcTo(x,y+h,x,y,r); CTX.arcTo(x,y,x+w,y,r);
 CTX.closePath();
};
G.txt=function(s,x,y,size,col,align,maxw,wt){
 CTX.font=G.font(size,wt);
 CTX.textAlign=align||'left'; CTX.textBaseline='top';
 CTX.fillStyle=col||'#f4ede2';
 if(maxw) CTX.fillText(s,x,y,maxw); else CTX.fillText(s,x,y);
};
G.txtO=function(s,x,y,size,col,align,maxw){
 CTX.save();
 CTX.font=G.font(size,800); CTX.textAlign=align||'left'; CTX.textBaseline='top';
 CTX.shadowColor='rgba(0,0,0,.75)'; CTX.shadowBlur=4; CTX.shadowOffsetY=1.5;
 CTX.fillStyle=col||'#fff';
 if(maxw){ CTX.fillText(s,x,y,maxw); CTX.fillText(s,x,y,maxw); } else { CTX.fillText(s,x,y); CTX.fillText(s,x,y); }
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
G.para=function(s,x,y,size,col,align,maxw,lh){ // wrapped paragraph; returns height
 const L=G.wrap(s,size,maxw); lh=lh||size*1.55;
 L.forEach((l,i)=>G.txt(l,x,y+i*lh,size,col,align));
 return L.length*lh;
};
G.panel=function(x,y,w,h,opts){
 opts=opts||{};
 const r=opts.r??12, bd=opts.border||'rgba(240,120,24,.75)';
 CTX.save();
 CTX.shadowColor='rgba(0,0,0,.55)'; CTX.shadowBlur=14; CTX.shadowOffsetY=4;
 G.rrect(x,y,w,h,r); CTX.fillStyle=opts.bg||'rgba(22,22,32,.97)'; CTX.fill();
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
 CTX.shadowColor='#ff8c2a'; CTX.shadowBlur=10+(G.rm()?0:Math.sin(G.time*5)*4);
 G.rrect(x,y,w,h,r);
 const g=CTX.createLinearGradient(0,y,0,y+h); g.addColorStop(0,'#ffa648'); g.addColorStop(1,'#ec7010');
 CTX.fillStyle=g; CTX.fill(); CTX.fill();
 CTX.restore();
};
G.selRect=function(x,y,w,h,solid){
 if(solid) G.glowFill(x,y,w,h,Math.min(10,h/2));
 else { G.rrect(x,y,w,h,Math.min(10,h/2)); CTX.fillStyle='rgba(240,120,24,.28)'; CTX.fill(); }
 G.rrect(x,y,w,h,Math.min(10,h/2)); CTX.strokeStyle='rgba(255,180,90,'+(solid?.75:.45)+')'; CTX.lineWidth=1; CTX.stroke();
};
/* buttons: kind = primary (glowing orange) | secondary | ghost | danger | success | selected */
G.button=function(b,focus){
 if(b.hidden) return;
 const kind=b.kind||'secondary', r=b.r??Math.min(12,b.h/2);
 const press=!b.disabled&&G.held(b.x,b.y,b.w,b.h);
 const hov=!b.disabled&&!G.isTouch&&G.hit(b.x,b.y,b.w,b.h);
 const y=b.y+(press?1:0);
 CTX.save();
 if(b.disabled) CTX.globalAlpha=.42;
 let tc='#f0e8dc';
 if(kind==='primary'){ G.glowFill(b.x,y,b.w,b.h,r); tc='#16100a'; }
 else if(kind==='selected'){ G.rrect(b.x,y,b.w,b.h,r); const g=CTX.createLinearGradient(0,y,0,y+b.h); g.addColorStop(0,'#ffa040'); g.addColorStop(1,'#e46c10'); CTX.fillStyle=g; CTX.fill(); tc='#16100a'; }
 else {
  G.rrect(b.x,y,b.w,b.h,r);
  const fills={secondary:hov?'#323244':'#262634',ghost:hov?'rgba(240,120,24,.14)':'rgba(240,120,24,.06)',danger:hov?'#5a2222':'#47191b',success:hov?'#22573a':'#1b4630'};
  CTX.fillStyle=fills[kind]||fills.secondary; CTX.fill();
  const strokes={secondary:'rgba(255,255,255,.12)',ghost:'rgba(240,120,24,.7)',danger:'rgba(255,110,90,.7)',success:'rgba(128,255,160,.6)'};
  CTX.strokeStyle=strokes[kind]||strokes.secondary; CTX.lineWidth=1.2; CTX.stroke();
  tc={ghost:'#ffb060',danger:'#ffb8a8',success:'#c8ffd8'}[kind]||tc;
 }
 if(press){ G.rrect(b.x,y,b.w,b.h,r); CTX.fillStyle='rgba(0,0,0,.18)'; CTX.fill(); }
 if(focus&&G.kbMode&&!b.disabled){ G.rrect(b.x-3,y-3,b.w+6,b.h+6,r+3); CTX.strokeStyle='#ffd060'; CTX.lineWidth=2; CTX.stroke(); }
 const size=b.size||8.5;
 let ix=0;
 if(b.icon){ ix=(b.iconW||16)/2+3; b.icon(CTX,b.x+b.w/2-G.tw(b.label||'',size)/2-ix+2,y+b.h/2,tc); }
 if(b.sub){
  G.txt(b.label,b.x+b.w/2+ix,y+b.h/2-size*1.3+1,size,b.labelCol||tc,'center',b.w-14);
  G.txt(b.sub,b.x+b.w/2+ix,y+b.h/2+2,b.subSize||6.5,b.subCol||(kind==='primary'||kind==='selected'?'#3a1c06':'#9a8f80'),'center',b.w-14);
 } else if(b.label) G.txt(b.label,b.x+b.w/2+ix,y+(b.h-size*1.3)/2,size,b.labelCol||tc,'center',b.w-12);
 CTX.restore();
};
G.drawBtns=function(btns,st){ btns.forEach((b,i)=>G.button(b,st&&st.f===i)); };
/* list navigation: arrows move focus, A/Enter or tap activates. Returns the button id. */
G.navList=function(st,btns,opts){
 opts=opts||{};
 const live=btns.filter(b=>!b.hidden);
 const n=btns.length; if(!n) return null;
 if(st.f==null||st.f>=n) st.f=0;
 const step=d=>{ for(let k=0;k<n;k++){ st.f=(st.f+d+n)%n; if(!btns[st.f].disabled&&!btns[st.f].hidden) break; } AUDIO.sfx('blip'); };
 if(!opts.noKeys){
  if(G.pressed.up||(opts.horiz&&G.pressed.left)||(opts.both&&G.pressed.left)) step(-1);
  if(G.pressed.down||(opts.horiz&&G.pressed.right)||(opts.both&&G.pressed.right)) step(1);
 }
 for(let i=0;i<n;i++){ const b=btns[i]; if(b.disabled||b.hidden) continue;
  if(G.clicked(b.x,b.y,b.w,b.h)){ st.f=i; if(!b.silent) AUDIO.sfx('ok'); return b.id; } }
 if(G.pressed.a&&!opts.noKeys){ const b=btns[st.f]; if(b&&!b.disabled&&!b.hidden){ if(!b.silent) AUDIO.sfx('ok'); return b.id; } }
 return live.length?null:null;
};
/* top bar with a real BACK button */
G.BACK={x:6,y:7,w:68,h:27};
G.topBar=function(title,o){
 o=o||{};
 CTX.fillStyle='rgba(11,10,16,.94)'; CTX.fillRect(0,0,VW,41);
 CTX.fillStyle='rgba(240,120,24,.55)'; CTX.fillRect(0,41,VW,1);
 if(o.back!==false){
  const B=G.BACK, press=G.held(B.x,B.y,B.w,B.h);
  G.rrect(B.x,B.y+(press?1:0),B.w,B.h,13.5);
  CTX.fillStyle=press?'rgba(240,120,24,.3)':'rgba(240,120,24,.12)'; CTX.fill();
  CTX.strokeStyle='rgba(255,150,60,.85)'; CTX.lineWidth=1.3; CTX.stroke();
  // chevron
  CTX.strokeStyle='#ffb060'; CTX.lineWidth=2.2; CTX.lineCap='round'; CTX.lineJoin='round';
  CTX.beginPath(); CTX.moveTo(B.x+17,B.y+8+(press?1:0)); CTX.lineTo(B.x+11,B.y+13.5+(press?1:0)); CTX.lineTo(B.x+17,B.y+19+(press?1:0)); CTX.stroke();
  G.txt(o.backLabel||'BACK',B.x+41,B.y+7.5+(press?1:0),7.5,'#ffc080','center',44,800);
 }
 if(title){
  // centered, but never running into BACK, the gear or a right-hand chip
  let L=o.back!==false?G.BACK.x+G.BACK.w+5:8, R=VW-8;
  if(o.gear) R=Math.min(R,G.GEAR.x-5);
  if(o.right){ CTX.font=G.font(7,700); R=Math.min(R,VW-6-(CTX.measureText(o.right).width+16)-5); }
  const mw=Math.max(60,Math.min(o.right?118:124,2*Math.min(VW/2-L,R-VW/2)));
  G.txt(title,VW/2,o.sub?6.5:13,o.size||9.5,o.col||'#ffd060','center',mw,800);
  if(o.sub) G.txt(o.sub,VW/2,25,6,o.subCol||'#cfc4b0','center',mw,700);
 }
 if(o.gear){
  const B=G.GEAR, press=G.held(B.x,B.y,B.w,B.h);
  G.rrect(B.x,B.y+(press?1:0),B.w,B.h,10); CTX.fillStyle=press?'rgba(240,120,24,.35)':'rgba(255,255,255,.08)'; CTX.fill();
  CTX.strokeStyle='rgba(255,150,60,.8)'; CTX.lineWidth=1.2; CTX.stroke();
  if(G.icon) G.icon('gear',CTX,B.x+B.w/2,B.y+B.h/2+(press?1:0),15,'#ffc080');
  if(o.gearDot){ CTX.beginPath(); CTX.arc(B.x+B.w-3,B.y+3,4,0,7); CTX.fillStyle='#ff5a40'; CTX.fill(); }
 }
 if(o.right){
  CTX.font=G.font(7,700);
  const w=CTX.measureText(o.right).width+16;
  G.rrect(VW-6-w,9,w,22,11); CTX.fillStyle='rgba(255,208,96,.12)'; CTX.fill();
  CTX.strokeStyle='rgba(255,208,96,.4)'; CTX.lineWidth=1; CTX.stroke();
  G.txt(o.right,VW-6-w/2,14.5,7,o.rightCol||'#ffd060','center',w-8,700);
 }
};
/* battalions are numbered 1-9: '7' reads BATTALION 7 (older free-text codes show as typed) */
/* fresh random order for answer choices (so the right one isn't always on top) */
G.shuffle=function(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); const t=a[i]; a[i]=a[j]; a[j]=t; } return a; };
G.order=function(n){ return G.shuffle([...Array(n).keys()]); };
G.bn=function(b){ b=String(b==null?'':b).trim(); return /^[1-9]$/.test(b)?'BATTALION '+b:b; };
G.bl=function(b){ b=String(b==null?'':b).trim(); if(!b) return ''; return /^[1-9]$/.test(b)?'BATTALION '+b:b+' BATTALION'; };
G.bs=function(b){ b=String(b==null?'':b).trim(); return /^[1-9]$/.test(b)?'BATT '+b:b; };
G.backHit=function(){ const B=G.BACK; const h=G.pressed.b||G.clicked(B.x,B.y,B.w,B.h); if(h){ AUDIO.sfx('back'); G.pressed.b=false; G.ptr.click=false; } return h; };
/* settings gear (top-right of a top bar) */
G.GEAR={x:VW-40,y:7,w:34,h:27};
G.gearHit=function(){ const B=G.GEAR; const h=G.clicked(B.x,B.y,B.w,B.h); if(h){ AUDIO.sfx('ok'); G.ptr.click=false; } return h; };
/* in-game pause button (top-left of the HUD) */
G.PAUSE={x:6,y:7,w:34,h:27};
G.pauseBtnDraw=function(){
 const P=G.PAUSE, press=G.held(P.x,P.y,P.w,P.h);
 G.rrect(P.x,P.y,P.w,P.h,10); CTX.fillStyle=press?'rgba(240,120,24,.35)':'rgba(255,255,255,.08)'; CTX.fill();
 CTX.strokeStyle='rgba(255,150,60,.8)'; CTX.lineWidth=1.2; CTX.stroke();
 CTX.fillStyle='#ffc080'; CTX.fillRect(P.x+12,P.y+8,3.5,11); CTX.fillRect(P.x+18.5,P.y+8,3.5,11);
};
G.pauseHit=function(){ const P=G.PAUSE; return G.pressed.b||G.pressed.pause||G.clicked(P.x,P.y,P.w,P.h); };
/* centered modal with stacked buttons */
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
   if(o.title) G.txtO(o.title,VW/2,R.y+12,o.titleSize||10,o.titleCol||'#ffd060','center',R.w-20);
   if(o.sub) G.txt(o.sub,VW/2,R.y+30,6.5,o.subCol||'#b8ad9c','center',R.w-20);
   if(o.drawBody) o.drawBody(c,R.x,R.y+R.titleH,R.w);
   else if(o.lines) o.lines.forEach((l,i)=>G.txt(l[0],VW/2,R.y+R.titleH+i*17,l[2]||8,l[1]||'#e8dcc8','center',R.w-22));
   G.drawBtns(R.btns,this.st);
  }
 };
};
/* standard pause menu for every game */
G.Pause=function(o){
 return { open:false, m:null,
  show(){
   this.open=true; AUDIO.sfx('back'); G.hideFields(true);
   this.m=G.Modal({title:'PAUSED',btns:[
    {id:'resume',label:'RESUME',kind:'primary'},
    {id:'restart',label:'RESTART'},
    {id:'quit',label:o.quitLabel||'QUIT TO CLUBHOUSE'}]});
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
  if(i===sel){ G.rrect(r.x+2,r.y+2,r.w-4,r.h-4,(h-4)/2); const g=CTX.createLinearGradient(0,r.y,0,r.y+r.h); g.addColorStop(0,'#ffa040'); g.addColorStop(1,'#e46c10'); CTX.fillStyle=g; CTX.fill(); }
  G.txt(labels[i],r.x+r.w/2,r.y+(h-(size||7.5)*1.3)/2,size||7.5,i===sel?'#16100a':'#cfc4b0','center',r.w-8,700);
 });
};
G.segHit=function(x,y,w,h,n){ const R=G.segRects(x,y,w,h,n); for(let i=0;i<n;i++){ const r=R[i]; if(G.clicked(r.x,r.y,r.w,r.h)) return i; } return -1; };
G.toggleDraw=function(x,y,on){
 G.rrect(x,y,38,22,11); CTX.fillStyle=on?'#e8781a':'rgba(255,255,255,.14)'; CTX.fill();
 CTX.beginPath(); CTX.arc(on?x+27:x+11,y+11,8,0,7); CTX.fillStyle='#f6f0e6'; CTX.fill();
};
G.chip=function(text,x,y,o){
 o=o||{}; const size=o.size||6.5;
 CTX.font=G.font(size,700);
 const w=CTX.measureText(text).width+14, h=size*1.3+8;
 const lx=o.align==='right'?x-w:(o.align==='center'?x-w/2:x);
 G.rrect(lx,y,w,h,h/2); CTX.fillStyle=o.bg||'rgba(255,255,255,.08)'; CTX.fill();
 if(o.border){ CTX.strokeStyle=o.border; CTX.lineWidth=1; CTX.stroke(); }
 G.txt(text,lx+w/2,y+4,size,o.col||'#e8dcc8','center',undefined,700);
 return w;
};
G.heart=function(cx,cy,sz,col){
 CTX.fillStyle=col; CTX.beginPath();
 CTX.moveTo(cx,cy+sz*.42);
 CTX.bezierCurveTo(cx-sz*.68,cy-sz*.06, cx-sz*.38,cy-sz*.58, cx,cy-sz*.2);
 CTX.bezierCurveTo(cx+sz*.38,cy-sz*.58, cx+sz*.68,cy-sz*.06, cx,cy+sz*.42);
 CTX.fill();
};
G.hearts=function(x,y,n,max,sz){
 sz=sz||11;
 for(let i=0;i<max;i++) G.heart(x+sz/2+i*(sz+3),y+sz/2+1,sz,i<n?'#ff3b4e':'rgba(255,80,95,.22)');
};
/* draw an image cover-fit into a box (fy = vertical focus 0..1) */
G.cover=function(img,x,y,w,h,fy,fx){
 if(!img) return;
 const R=img.safe||[0,0,img.width,img.height];
 const s=Math.max(w/R[2],h/R[3]);
 const sw=w/s, sh=h/s;
 const sx=R[0]+(R[2]-sw)*(fx==null?.5:fx), sy=R[1]+(R[3]-sh)*(fy==null?.5:fy);
 CTX.drawImage(img,sx,sy,sw,sh,x,y,w,h);
};
G.flipImg=function(name,x,y,w,h){
 const im=G.img[name]; if(!im) return;
 CTX.save(); CTX.translate(x+w,y); CTX.scale(-1,1);
 CTX.drawImage(im,0,0,w,h); CTX.restore();
};
G.dim=function(a){ CTX.fillStyle='rgba(0,0,0,'+a+')'; CTX.fillRect(-4,-4,VW+8,G.VH+8); };
G.rm=function(){ return G.save.settings.rm; };
/* drag / wheel scrolling for read-only lists */
G.scroll=function(st,area,contentH){
 const max=Math.max(0,contentH-area.h);
 if(G.ptr.down&&G.ptr.sx>=area.x&&G.ptr.sx<=area.x+area.w&&G.ptr.sy>=area.y&&G.ptr.sy<=area.y+area.h) st.scroll=(st.scroll||0)-G.dragDY;
 if(G.wheelDY&&G.hit(area.x,area.y,area.w,area.h)) st.scroll=(st.scroll||0)+G.wheelDY;
 if(G.pressed.down) st.scroll=(st.scroll||0)+40;
 if(G.pressed.up) st.scroll=(st.scroll||0)-40;
 st.scroll=Math.max(0,Math.min(max,st.scroll||0));
 return max;
};
/* scrollable list of tappable rows (drag/wheel to scroll, tap a row, arrows+Enter for keyboard).
   `extra` adds keyboard-only focus slots after the rows (for buttons under the list).
   Returns the tapped/activated index (rows 0..n-1, extras n..) or -1. st keeps {f, scroll}. */
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
 G.rrect(area.x+area.w-4,ty,3,th,1.5); CTX.fillStyle='rgba(255,170,90,.5)'; CTX.fill();
};

/* ---------- boot / loop ---------- */
const RKA={};
window.RKA=RKA;
// source regions that skip the title/menu text baked into some club artwork
const SAFE={bg_501:[0,90,480,124],bg_bikerdown:[0,62,480,162]};
RKA.boot=function(){
 G.canvas=document.getElementById('game'); G.ctx=G.canvas.getContext('2d');
 CTX=G.ctx;
 G.loadSave(); G.loadRoster();
 resize(); addEventListener('resize',resize);
 if(window.visualViewport) visualViewport.addEventListener('resize',()=>G.placeFields());
 let left=ASSETS.length;
 try{ AUDIO.preload(); }catch(e){}   // start fetching the title theme while the art loads
 const msg=document.getElementById('bootmsg');
 ASSETS.forEach(n=>{
  const im=new Image();
  im.onload=()=>{ if(SAFE[n]) im.safe=SAFE[n]; G.img[n]=im; if(--left===0) ready(); };
  im.onerror=()=>{ console.warn('missing asset',n); if(--left===0) ready(); };
  im.src='assets/'+n+'.png';
 });
 function ready(){
  msg.textContent='READY. HELMETS ON.';
  const b=document.getElementById('tapstart'); b.style.display='block';
  b.onclick=()=>{
   AUDIO.init(); AUDIO.resume();
   AUDIO.setMusic(G.save.settings.music); AUDIO.setSfx(G.save.settings.sfx);
   document.getElementById('boot').style.display='none';
   bindInput();
   G.go('title',{},true);
   AUDIO.play('radio');
   requestAnimationFrame(loop);
  };
 }
};
function resize(){
 const w=innerWidth,h=innerHeight;
 // portrait-first: fill a phone held upright; on wide screens show a phone-shaped cabinet
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
 if(G.scene&&G.scene.update&&(G.fadeDir!==1)) G.scene.update(dt);
 const k=G.k||1, VH=G.VH;
 CTX.setTransform(k,0,0,k,0,0);
 CTX.imageSmoothingEnabled=true; CTX.imageSmoothingQuality='high';
 if(G.shake>0 && !G.rm()){
  CTX.setTransform(k,0,0,k,(Math.random()*2-1)*G.shake*k,(Math.random()*2-1)*G.shake*k);
  G.shake=Math.max(0,G.shake-dt*18);
 }
 CTX.fillStyle='#0b0a10'; CTX.fillRect(-8,-8,VW+16,VH+16);
 if(G.scene&&G.scene.draw) G.scene.draw(CTX,dt);
 CTX.setTransform(k,0,0,k,0,0);
 drawToasts(dt);
 if(G.fade>0){ CTX.fillStyle='rgba(0,0,0,'+G.fade+')'; CTX.fillRect(0,0,VW,VH); }
 if(Object.keys(G.fields).length) G.placeFields();
 G.pressed={}; G.typed=[]; G.ptr.click=false; G.ptr.released=false; G.swipe=null; G.dragDX=0; G.dragDY=0; G.wheelDY=0;
}
function drawToasts(dt){
 for(let i=G.toasts.length-1;i>=0;i--){ const t=G.toasts[i]; if(t.w>0){ t.w-=dt; continue; } t.t-=dt; if(t.t<=0) G.toasts.splice(i,1); }
 let y=48;
 for(const t of G.toasts.filter(t=>!(t.w>0)).slice(-3)){
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
