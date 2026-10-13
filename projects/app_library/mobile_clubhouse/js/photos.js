/* PHOTO ALBUM: ride photos and photo dumps with their date, place and caption, saved for good.
   Approved members add photos (here, or straight from a logged ride) and can credit who took them - a member or a
   supporter, for the whole batch or photo by photo. A supporter sees the album once a club officer makes the motion
   and a second, different club officer seconds it. The uploader can fix a photo's date, place and caption; a club
   officer (or the club admin) can also change its credit or take it down.
   Also here: G.PersonPicker (pick riders / a photo credit / someone to get in close with) and G.PhotoBatch (pick,
   shrink, credit and upload a batch of photos - used by the album and the ride log). */
(function(){
const VW=G.VW, CL=G.CL;
const myId=()=>G.activeAcct&&G.activeAcct.id;
/* small image caches: thumbnails for the grid, a few full photos for the viewer */
function lru(max){ const m=new Map(); return {get(src){ if(!src) return null; let im=m.get(src); if(im){ m.delete(src); m.set(src,im); } else { im=new Image(); im.src=src; m.set(src,im); if(m.size>max) m.delete(m.keys().next().value); } return im.complete&&im.naturalWidth?im:null; }}; }
const THUMBS=lru(240), FULLS=lru(8);
G.phThumbImg=function(id){ return THUMBS.get(G.club.thumb(id)); };
G.phFullImg=function(src){ return FULLS.get(src); };
G.imgFrom=function(src){ return THUMBS.get(src); };
G.titleCase=function(s){ return String(s||'').toLowerCase().replace(/(^|[\s\-'.])([a-z])/g,(m,a,b)=>a+b.toUpperCase()); };
G.fmtDay=function(s){ const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s||'')); if(!m) return ''; return new Date(+m[1],+m[2]-1,+m[3]).toLocaleDateString([],{month:'short',day:'numeric',year:'numeric'}).toUpperCase(); };
G.today=function(){ const d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); };
/* a name the way the club shows it: the road name / nickname, and a supporter's first name small + accented */
G.drawPersonName=function(p,x,y,size,col,maxw){
 const n=String((p&&p.n)||''), f=p&&p.t==='sup'&&p.f?G.titleCase(p.f):'';
 const nw=Math.min(G.tw(n,size,800),maxw||9999);
 G.txt(n,x,y,size,col||'#f4ede2','left',maxw,800);
 if(f){ const fs=Math.max(5,size*.74), fx=x+nw+4, room=maxw?maxw-nw-4:120; if(room>14) G.txt(f,fx,y+(size-fs)*.8,fs,'#ff9ad0','left',room,700); }
 return nw;
};
G.personSub=function(p){ return p.t==='sup'?'♥ SUPPORTER':(p.b?G.bn(p.b):'MEMBER'); };
const avatarDot=G.personDot=function(c,p,cx,cy,r){
 c.beginPath(); c.arc(cx,cy,r,0,7); c.fillStyle=p.t==='sup'?'rgba(255,154,208,.22)':'rgba(240,120,24,.2)'; c.fill();
 c.strokeStyle=p.t==='sup'?'rgba(255,154,208,.7)':'rgba(255,170,90,.7)'; c.lineWidth=1; c.stroke();
 G.txt(String(p.n||'?').slice(0,1),cx,cy-r*.55,r*1.05,p.t==='sup'?'#ffc4e2':'#ffd8a8','center',undefined,800);
};

/* ============================ PERSON PICKER (full screen, search + list) ============================ */
/* o = {title, sub, multi, sel:[people], exclude:[ids], allowText (free-text credit), top:[people shown first]} */
G.PersonPicker=function(o){
 o=o||{};
 const key=p=>p.id||('t:'+p.n);
 const P={o,on:false,list:CL.List(),st:{f:0},sel:new Map((o.sel||[]).map(p=>[key(p),p])),
  open(){
   this.on=true; this.list.reset();
   G.field('pq',{x:12,y:54,w:246,h:32,fs:.34,max:20,upper:true,strip:/[^A-Z0-9 \-'.]/g,align:'left',placeholder:o.allowText?'SEARCH OR TYPE A NAME':'SEARCH A NAME',
    enterHint:'search',primary:false,onInput:()=>{ this.list.reset(); },onEnter:()=>G.blurFields()});
   G.hideFieldsExcept(['pq']); AUDIO.sfx('ok');
  },
  close(){ this.on=false; G.removeField('pq'); G.hideFields(false); },
  people(){
   const q=G.fieldVal('pq').trim().toUpperCase(), ex=new Set(o.exclude||[]), topIds=new Set((o.top||[]).map(p=>p.id));
   return G.club.directory().filter(p=>!ex.has(p.id)&&!topIds.has(p.id)&&(!q||p.n.indexOf(q)>=0||String(p.f).toUpperCase().indexOf(q)>=0));
  },
  area(){ return {x:0,y:92,w:VW,h:G.VH-92-58}; },
  row(p){
   const self=this, k=key(p);
   return {h:48,focus:true,p,
    draw(c,x,y,w,foc){
     const on=self.sel.has(k), press=G.held(x,y,w,42);
     G.rrect(x,y+(press?1:0),w,42,11); c.fillStyle=on?'rgba(240,120,24,.16)':'rgba(30,28,40,.95)'; c.fill();
     c.strokeStyle=foc?'#ffd060':(on?'rgba(255,170,90,.7)':'rgba(255,255,255,.1)'); c.lineWidth=foc?1.6:1; c.stroke();
     if(p.free){ G.icon('cam',c,x+21,y+21,15,'#ffb060'); G.txt('CREDIT “'+p.n+'”',x+40,y+9,7.6,'#ffd060','left',w-60,800); G.txt('SOMEONE WHO ISN’T ON THE APP',x+40,y+24,5.6,'#9a8f80','left',w-60,700); return; }
     avatarDot(c,p,x+21,y+21,13);
     G.drawPersonName(p,x+40,y+8,8,'#f4ede2',w-90);
     G.txt(p.me?'THAT’S YOU':G.personSub(p),x+40,y+25,5.6,p.t==='sup'?'#ff9ad0':'#9a8f80','left',w-90,700);
     if(o.multi){ const bx=x+w-30, by=y+11; G.rrect(bx,by,20,20,6); c.fillStyle=on?'#f07818':'rgba(255,255,255,.06)'; c.fill(); c.strokeStyle=on?'#ffb050':'rgba(255,255,255,.3)'; c.lineWidth=1.2; c.stroke();
      if(on){ c.strokeStyle='#16100a'; c.lineWidth=2.2; c.beginPath(); c.moveTo(bx+5,by+10); c.lineTo(bx+8.6,by+14); c.lineTo(bx+15.4,by+6); c.stroke(); } }
     else G.txt('›',x+w-14,y+12,11,'#ffb060','center',undefined,800);
    },
    tap:()=>({p}),enter:()=>({p})};
  },
  items(){
   const q0=G.fieldVal('pq').trim().toUpperCase(), ck=q0+'|'+G.club.ver+'|'+G.club.names.length+'|'+G.club.loaded.names;
   if(this._c&&this._c.k===ck) return this._c.it;
   const it=this.build(); this._c={k:ck,it}; return it;
  },
  build(){
   const it=[], q=G.fieldVal('pq').trim().toUpperCase(), L=this.people();
   if(o.allowText&&q.length>=2&&!L.some(p=>p.n===q)&&!(o.top||[]).some(p=>p.n===q)) it.push(this.row({n:q,t:'',free:true}));
   for(const p of (o.top||[])) it.push(this.row(p));
   for(const p of L) it.push(this.row(p));
   if(!L.length&&!(o.top||[]).length) it.push(CL.note([G.club.loaded.names?(q?'NOBODY BY THAT NAME YET.':'NOBODY ELSE ON THE APP YET.'):'LOADING NAMES…']));
   CL.layout(it); return it;
  },
  btns(){
   const y=G.VH-50;
   if(o.multi) return [{id:'done',label:'DONE • '+this.sel.size+' PICKED',kind:'primary',x:12,y,w:170,h:40,size:8},{id:'cancel',label:'CANCEL',x:188,y,w:70,h:40,size:7.2}];
   return [{id:'cancel',label:'CANCEL',x:12,y,w:246,h:40,size:7.6}];
  },
  update(){
   if(G.backHit()){ this.close(); return {cancel:true}; }
   const id=G.navList(this.st,this.btns(),{noKeys:true});
   if(id==='done'){ this.close(); return {done:[...this.sel.values()]}; }
   if(id==='cancel'){ this.close(); return {cancel:true}; }
   let res=null;
   this.list.update(this.items(),this.area(),a=>{
    if(!a||!a.p) return;
    if(o.multi){ const k=key(a.p); if(this.sel.has(k)) this.sel.delete(k); else this.sel.set(k,a.p); AUDIO.sfx('blip'); }
    else { this.close(); res={done:a.p}; AUDIO.sfx('ok'); }
   });
   return res;
  },
  draw(c){
   const VH=G.VH;
   c.fillStyle='rgba(10,9,14,.97)'; c.fillRect(0,0,VW,VH);
   G.rrect(12,54,246,32,14); c.fillStyle='rgba(0,0,0,.45)'; c.fill();
   this.list.draw(c,this.items(),this.area());
   G.drawBtns(this.btns(),this.st);
   G.topBar(o.title||'PICK SOMEONE',{size:8.4,sub:o.sub,subCol:'#cfc4b0'});
  }
 };
 return P;
};

/* ============================ PHOTO BATCH: pick → shrink → credit → upload ============================ */
G.PhotoBatch=function(){
 return {items:[],credit:null,busy:false,prog:'',err:'',
  async add(files){
   const imgs=files.filter(f=>!f.type||f.type.indexOf('image/')===0).slice(0,Math.max(0,30-this.items.length));
   if(!imgs.length){ this.err='PICK PHOTOS (JPG OR PNG)'; return; }
   this.busy=true; this.err='';
   for(let i=0;i<imgs.length;i++){
    this.prog='GETTING PHOTO '+(i+1)+' OF '+imgs.length+' READY…';
    try{ const r=await G.compressPhoto(imgs[i],{cap:G.club.PHOTO_CAP}); this.items.push(Object.assign(r,{cr:null})); }
    catch(e){ this.err='ONE PHOTO COULDN’T BE OPENED - TRY A JPG OR PNG'; }
   }
   this.busy=false; this.prog='';
  },
  me(){ const a=G.activeAcct; return a?{id:a.id,n:a.roadName,t:a.type==='sup'?'sup':'mem',f:a.type==='sup'?(a.first||''):''}:null; },
  creditOf(it){ return it.cr||this.credit||this.me(); },
  creditLabel(cr){ const me=this.me(); return !cr||(me&&cr.id===me.id)?'ME':cr.n; },
  /* meta = {d, loc, desc, ride, b}; onProg(done,total) */
  async upload(meta,onProg){
   const ids=[], b=meta.b||(Date.now().toString(36)+Math.random().toString(36).slice(2,5));
   for(let i=0;i<this.items.length;i++){
    const it=this.items[i];
    const r=await G.club.savePhoto({full:it.full,thumb:it.thumb,w:it.w,h:it.h,d:meta.d,loc:meta.loc,desc:meta.desc,ride:meta.ride,b,cr:this.creditOf(it)});
    if(!r||r.err) return {ids,err:(r&&r.err)||'failed'};
    ids.push(r.id); if(onProg) onProg(i+1,this.items.length);
   }
   return {ids};
  },
  /* a strip of thumbnails; badge = photo with its own credit */
  stripRects(x,y,w,h,extra){ const n=this.items.length+(extra?1:0), gap=6, s=h, per=Math.max(1,Math.floor((w+gap)/(s+gap))), R=[];
   for(let i=0;i<Math.min(n,per);i++) R.push({i:extra?i-1:i,x:x+i*(s+gap),y,w:s,h:s});
   return R; },
  drawStrip(c,R,addLabel){
   for(const r of R){
    G.rrect(r.x,r.y,r.w,r.h,9);
    if(r.i<0){ c.fillStyle='rgba(240,120,24,.12)'; c.fill(); c.save(); c.setLineDash([3,3]); c.strokeStyle='rgba(255,170,90,.75)'; c.lineWidth=1.2; c.stroke(); c.restore();
     G.icon('cam',c,r.x+r.w/2,r.y+r.h/2-5,r.w*.36,'#ffb060'); G.txt(addLabel||'+ ADD',r.x+r.w/2,r.y+r.h-13,5.6,'#ffb060','center',r.w-4,800); continue; }
    const it=this.items[r.i], im=G.imgFrom(it.thumb);
    c.save(); G.rrect(r.x,r.y,r.w,r.h,9); c.clip(); c.fillStyle='#1a1820'; c.fillRect(r.x,r.y,r.w,r.h); if(im) G.cover(im,r.x,r.y,r.w,r.h); c.restore();
    G.rrect(r.x,r.y,r.w,r.h,9); c.strokeStyle='rgba(255,255,255,.18)'; c.lineWidth=1; c.stroke();
    if(it.cr){ c.beginPath(); c.arc(r.x+r.w-7,r.y+7,5.5,0,7); c.fillStyle='#ff9ad0'; c.fill(); G.txt('©',r.x+r.w-7,r.y+3.4,6,'#2a0c1c','center',undefined,800); }
   }
   const shown=R.filter(r=>r.i>=0).length, more=this.items.length-shown;
   if(more>0){ const r=R[R.length-1]; G.rrect(r.x,r.y,r.w,r.h,9); c.fillStyle='rgba(0,0,0,.6)'; c.fill(); G.txt('+'+(more+1),r.x+r.w/2,r.y+r.h/2-6,9,'#fff','center',undefined,800); }
  }
 };
};

/* ============================ PHOTO ALBUM ============================ */
const CELL_GAP=4;
function photoRow(list,scene){
 const cw=(254-CELL_GAP*2)/3;
 return {h:cw+CELL_GAP,focus:true,list,
  draw(c,x,y,w,foc){
   const cs=(w-CELL_GAP*2)/3;
   list.forEach((m,i)=>{
    const cx=x+i*(cs+CELL_GAP), im=G.phThumbImg(m.id);
    c.save(); G.rrect(cx,y,cs,cs,8); c.clip(); c.fillStyle='#1c1a24'; c.fillRect(cx,y,cs,cs);
    if(im) G.cover(im,cx,y,cs,cs); else G.icon('cam',c,cx+cs/2,y+cs/2,cs*.28,'rgba(255,255,255,.2)');
    if(m.crT==='sup'){ c.fillStyle='rgba(0,0,0,.55)'; c.fillRect(cx,y+cs-13,cs,13); G.txt('© '+m.cr,cx+4,y+cs-11.5,5,'#ffc4e2','left',cs-8,700); }
    c.restore();
    G.rrect(cx,y,cs,cs,8); c.strokeStyle=foc&&scene.fcol===i?'#ffd060':'rgba(255,255,255,.12)'; c.lineWidth=foc&&scene.fcol===i?2:1; c.stroke();
   });
  },
  tap(lx,ly,w){ const cs=(w-CELL_GAP*2)/3, i=Math.min(2,Math.max(0,Math.floor(lx/(cs+CELL_GAP)))); return list[i]?{kind:'view',m:list[i]}:null; },
  enter(){ const m=list[Math.min(scene.fcol,list.length-1)]; return m?{kind:'view',m}:null; }};
}
G.scenes.photos={
 enter(a){
  a=a||{};
  if(a.back){ this.back=a.back; this.backArgs=a.backArgs||null; } else if(!this.back) this.back='club';
  this.flt=a.filter||{k:'all'};
  this.mode=a.tab==='access'?'access':'grid';
  this.list=CL.List(); this.cache=null; this.st={f:0}; this.fcol=0;
  this.modal=null; this.picker=null; this.batch=null; this.err=''; this.busy=false; this.vi=0; this.cur=null; this.ed=null; this.sending=null;
  this.lock=G.LockPanel('photos');
  this.photos=[]; this.older=[]; this.olderDone=false; this.loaded=false; this.subKey=''; this.unsub=null;
  this.sync();
 },
 exit(){ this.unsubAll(); },
 /* the album downloads only for members and supporters with access */
 sync(){
  const C=G.club, want=C.db&&C.canViewPhotos()?'on':'';
  if(want===this.subKey) return;
  this.unsubAll(); this.subKey=want; this.cache=null; if(!want){ this.photos=[]; this.loaded=false; return; }
  const gen=this.gen=(this.gen||0)+1;
  this.unsub=C.db.collection('pho').orderBy('at','desc').limit(600).onSnapshot(s=>{ if(gen!==this.gen) return; this.photos=C.phoDocs(s); this.loaded=true; this.cache=null; },()=>{ if(gen===this.gen) this.loaded=true; });
 },
 unsubAll(){ this.gen=(this.gen||0)+1; if(this.unsub){ try{ this.unsub(); }catch(e){} this.unsub=null; } this.subKey=''; },
 async loadOlder(){
  const C=G.club; if(this.busy||!C.db) return; const all=this.all(); if(!all.length) return;
  this.busy=true; const min=Math.min(...all.map(m=>m.at));
  try{ const s=await C.db.collection('pho').where('at','<',min).orderBy('at','desc').limit(300).get(); const L=C.phoDocs(s); this.older=this.older.concat(L); if(L.length<300) this.olderDone=true; }catch(e){ G.toast('COULDN’T LOAD OLDER PHOTOS','#ff7030'); }
  this.busy=false; this.cache=null;
 },
 all(){ const m=new Map(); for(const p of this.photos.concat(this.older)) if(!m.has(p.id)) m.set(p.id,p); return [...m.values()].sort((a,b)=>String(b.d).localeCompare(String(a.d))||b.at-a.at); },
 filtered(){
  const f=this.flt, me=myId(), L=this.all();
  if(f.k==='mine') return L.filter(m=>m.byId===me);
  if(f.k==='by') return L.filter(m=>m.byId===f.id);
  if(f.k==='ride') return L.filter(m=>m.ride===f.ride);
  return L;
 },
 fltLabel(){ const f=this.flt; return f.k==='mine'?'MINE':(f.k==='by'?'BY '+f.n:(f.k==='ride'?'THIS RIDE':'ALL')); },
 /* ---------------- the grid ---------------- */
 area(){ return {x:0,y:84,w:VW,h:G.VH-90}; },
 chipRects(){
  const R=[], y=52, add=(id,label,w)=>{ const x=R.length?R[R.length-1].x+R[R.length-1].w+6:10; R.push({id,label,x,y,w,h:24}); };
  const f=this.flt, mem=G.club.canUploadPhotos();
  add('all','ALL',44);
  if(mem) add('mine','MINE',52);
  add('by',f.k==='by'?'BY '+f.n+' ✕':'BY…',f.k==='by'?Math.min(118,G.tw('BY '+f.n+' ✕',6.4,800)+20):52);
  if(f.k==='ride') add('ride','THIS RIDE ✕',78);
  return R;
 },
 items(){
  const C=G.club, f=this.flt, L=this.filtered();
  const key=[C.ver,this.photos.length,this.older.length,this.loaded,f.k,f.id||'',f.ride||'',C.photoTodo().length,this.busy].join('|');
  if(this.cache&&this.cache.key===key) return this.cache.items;
  const it=[];
  if(C.isPhotoOfficer()){ const n=C.photoTodo().length; it.push(CL.action('SUPPORTER PHOTO ACCESS'+(n?' • '+n+' WAITING':'')+' ›',{kind:'access'},n?'primary':'ghost')); }
  if(!C.db) it.push(CL.note(['THE PHOTO ALBUM NEEDS THE CLUB NETWORK.'],'#ffd27a'));
  else if(!this.loaded) it.push(CL.note(['LOADING PHOTOS…']));
  else if(!L.length) it.push(CL.note(f.k==='all'?(C.canUploadPhotos()?['NO PHOTOS YET.','TAP + ADD TO START THE CLUB’S ALBUM.']:['NO PHOTOS YET.','MEMBERS ADD RIDE PHOTOS HERE.']):['NO PHOTOS HERE YET.']));
  else {
   let day='', run=[];
   const flush=()=>{ for(let i=0;i<run.length;i+=3) it.push(photoRow(run.slice(i,i+3),this)); run=[]; };
   for(const m of L){
    if(m.d!==day){ flush(); day=m.d; const places=[...new Set(L.filter(x=>x.d===day&&x.loc).map(x=>x.loc))];
     const n=L.filter(x=>x.d===day).length; it.push(CL.hdr(G.fmtDay(day)+(places.length===1?' • '+places[0].toUpperCase():''),n+(n===1?' PHOTO':' PHOTOS'),'#ffd060')); }
    run.push(m);
   }
   flush();
   if(f.k==='all'&&this.photos.length>=600&&!this.olderDone) it.push(CL.action(this.busy?'LOADING…':'SHOW OLDER PHOTOS',{kind:'older'},'secondary'));
  }
  it.push(CL.note(G.activeAcct&&G.clubAccess().ok?['PHOTOS STAY IN THE ALBUM FOR GOOD. ONLY A CLUB OFFICER','OR THE CLUB ADMIN CAN TAKE ONE DOWN.']:['RIDE PHOTOS FROM THE RAGING KNIGHTS.','THANKS FOR BACKING THE CLUB!']));
  CL.layout(it);
  this.cache={key,items:it};
  return it;
 },
 addBtn(){ if(this.mode!=='grid'||!G.club.canUploadPhotos()) return null; const t='+ ADD', w=G.tw(t,7,800)+24; return {x:VW-6-w,y:8,w,h:25,t}; },
 placePicker(){
  const ab=this.addBtn();
  if(!ab||this.picker||this.modal){ G.removeField('pf'); return; }
  const f=G.fields.pf; if(f&&f.rect.x===ab.x&&f.rect.w===ab.w) return;
  G.fileField('pf',{x:ab.x,y:ab.y,w:ab.w,h:ab.h,accept:'image/*',multiple:true,onFiles:fs=>this.pick(fs)});
 },
 async pick(files){
  if(!G.club.canUploadPhotos()) return;
  G.removeField('pf');
  this.batch=G.PhotoBatch(); this.mode='prep'; this.err='';
  await this.batch.add(files);
  if(G.sceneName!=='photos'||this.mode!=='prep') return;
  if(!this.batch.items.length){ G.toast(this.batch.err||'NO PHOTOS PICKED','#ff7a60'); this.mode='grid'; this.batch=null; return; }
  this.openUpload();
 },
 /* ---------------- upload form ---------------- */
 UL(){ const VH=G.VH, top=54, stripH=Math.min(58,(VW-24-18)/4), dY=top+70+stripH, cY=dY+58; return {top,stripY:top+14,stripH,crY:top+20+stripH,dY,cY,cH:Math.max(44,Math.min(110,VH-cY-76)),btnY:VH-50}; },
 openUpload(){
  this.mode='up'; this.st={f:0};
  const L=this.UL();
  G.field('ud',{x:12,y:L.dY,w:130,h:32,fs:.36,type:'date',align:'left',value:G.today(),maxDate:G.today(),primary:false});
  G.field('ul',{x:148,y:L.dY,w:110,h:32,max:60,align:'left',placeholder:'Where?',primary:false});
  G.field('uc',{x:12,y:L.cY,w:246,h:L.cH,max:300,multiline:true,align:'left',placeholder:'Caption (optional): the ride, the stop, the crew…',primary:false});
  AUDIO.sfx('ok');
 },
 closeUpload(){ for(const id of ['ud','ul','uc']) G.removeField(id); this.batch=null; this.mode='grid'; this.cache=null; },
 async sendUpload(){
  const b=this.batch; if(!b||this.sending) return;
  const d=G.fieldVal('ud')||G.today(), loc=G.fieldVal('ul').trim(), desc=G.fieldVal('uc').trim();
  if(!/^\d{4}-\d{2}-\d{2}$/.test(d)){ this.err='PICK THE DATE THE PHOTOS WERE TAKEN'; AUDIO.sfx('buzzer'); return; }
  for(const id of ['ud','ul','uc']) G.removeField(id);
  this.mode='sending'; this.sending={done:0,n:b.items.length};
  const r=await b.upload({d,loc,desc},(k,n)=>{ this.sending={done:k,n}; });
  this.sending=null; this.batch=null;
  if(r.err&&!r.ids.length){ this.mode='grid'; G.toast(r.err==='quota_exceeded'?'THE CLUB’S PHOTO STORAGE IS FULL - TELL THE CLUB ADMIN':'COULDN’T UPLOAD - CHECK YOUR CONNECTION','#ff7030'); AUDIO.sfx('buzzer'); return; }
  G.toast(r.ids.length+(r.ids.length===1?' PHOTO':' PHOTOS')+' ADDED TO THE ALBUM'+(r.err?' • SOME DIDN’T MAKE IT':''),'#80ffa0'); AUDIO.sfx('cheer');
  this.flt={k:'mine'}; this.mode='grid'; this.cache=null; this.list.reset();
 },
 updUpload(){
  const b=this.batch, L=this.UL();
  if(this.picker){ const r=this.picker.update(); if(r){ const pk=this.picker; this.picker=null; if(r.done){ if(pk.target==='all') b.credit=r.done; else if(pk.target!=null&&b.items[pk.target]) b.items[pk.target].cr=r.done; } } return; }
  if(G.backHit()){ this.closeUpload(); return; }
  const R=b.stripRects(12,L.stripY,246,L.stripH);
  for(const r of R) if(G.clicked(r.x,r.y,r.w,r.h)&&r.i>=0){ this.openCredit(r.i); return; }
  const cb=this.creditBtn(); if(G.clicked(cb.x,cb.y,cb.w,cb.h)){ this.openCredit('all'); return; }
  const B=this.upBtns(), id=G.navList(this.st,B,{noKeys:true});
  if(id==='send') this.sendUpload(); else if(id==='cancel') this.closeUpload();
 },
 creditBtn(){ const L=this.UL(); return {x:12,y:L.crY,w:246,h:26}; },
 openCredit(target){
  const b=this.batch, me=b.me();
  this.picker=G.PersonPicker({title:'PHOTO BY',sub:target==='all'?'WHO TOOK THESE PHOTOS?':'WHO TOOK THIS ONE?',allowText:true,top:me?[Object.assign({me:true},me)]:[]});
  this.picker.target=target; this.picker.open();
 },
 upBtns(){ const L=this.UL(), n=this.batch?this.batch.items.length:0; return [{id:'send',label:'ADD '+n+(n===1?' PHOTO':' PHOTOS'),kind:'primary',x:12,y:L.btnY,w:170,h:40,size:8.2},{id:'cancel',label:'CANCEL',x:188,y:L.btnY,w:70,h:40,size:7.2}]; },
 drawUpload(c){
  const b=this.batch, L=this.UL();
  G.txt('YOUR PHOTOS • TAP ONE TO CREDIT IT ON ITS OWN',12,L.top,6,'#b8ad9c','left',VW-24,700);
  b.drawStrip(c,b.stripRects(12,L.stripY,246,L.stripH));
  const cb=this.creditBtn(), cr=b.credit;
  G.rrect(cb.x,cb.y,cb.w,cb.h,13); c.fillStyle='rgba(255,154,208,.1)'; c.fill(); c.strokeStyle='rgba(255,154,208,.55)'; c.lineWidth=1; c.stroke();
  G.txt('PHOTO BY:',cb.x+10,cb.y+8,6.4,'#ffc4e2','left',undefined,800);
  if(!cr||cr.id===myId()) G.txt('ME ▾',cb.x+62,cb.y+7.4,7.2,'#f4ede2','left',undefined,800); else { G.drawPersonName(cr,cb.x+62,cb.y+7.4,7.2,'#f4ede2',150); G.txt('▾',cb.x+cb.w-12,cb.y+7,7.2,'#f4ede2','center',undefined,800); }
  const lab=(t,x,y)=>G.txt(t,x,y-12,6.2,'#b8ad9c','left',undefined,700);
  lab('DATE TAKEN',12,L.dY); lab('WHERE (OPTIONAL)',148,L.dY); lab('CAPTION (OPTIONAL)',12,L.cY);
  G.rrect(12,L.cY,246,L.cH,14); c.fillStyle='rgba(0,0,0,.4)'; c.fill();
  G.drawBtns(this.upBtns(),this.st);
  if(this.err) G.txt(this.err,VW/2,L.btnY-14,6.4,'#ff7a60','center',VW-20,700);
  else G.txt('SAVED FOR GOOD • THE CLUB SEES THEM IN THE ALBUM',VW/2,L.btnY-14,5.8,'#8a7f70','center',VW-20,700);
  G.topBar('ADD PHOTOS',{size:8.6});
  if(this.picker) this.picker.draw(c);
 },
 /* ---------------- one photo ---------------- */
 openView(m){
  const L=this.filtered(); this.vi=Math.max(0,L.findIndex(x=>x.id===m.id)); this.cur=m; this.mode='view'; this.st={f:0}; this.full=null;
  G.removeField('pf'); this.loadFull(m); AUDIO.sfx('ok');
 },
 loadFull(m){ const want=m.id; G.club.fullPhoto(m.id).then(src=>{ if(this.cur&&this.cur.id===want) this.full=src; }); },
 step(d){ const L=this.filtered(); if(!L.length) return; this.vi=(this.vi+d+L.length)%L.length; this.cur=L[this.vi]; this.full=null; this.loadFull(this.cur); AUDIO.sfx('blip'); },
 VL(){ const VH=G.VH, ih=Math.round(Math.min(VH*.52,VH-260)); return {iy:48,ih,dy:48+ih+10,btnY:VH-50}; },
 viewBtns(){
  const L=this.VL(), m=this.cur, B=[];
  if(G.club.canEditPhoto(m)) B.push({id:'set',label:'⚙ PHOTO SETTINGS',kind:'ghost',x:12,y:L.btnY,w:150,h:40,size:7.4});
  B.push({id:'close',label:'CLOSE',x:B.length?168:12,y:L.btnY,w:B.length?90:246,h:40,size:7.6});
  return B;
 },
 updView(){
  const L=this.VL();
  if(G.backHit()){ this.mode='grid'; this.cur=null; return; }
  // the photo may have changed or been taken down meanwhile
  const live=this.all().find(x=>x.id===this.cur.id);
  if(!live){ this.mode='grid'; this.cur=null; G.toast('THAT PHOTO WAS TAKEN DOWN','#ffd27a'); return; }
  this.cur=live;
  if(G.pressed.left){ this.step(-1); return; } if(G.pressed.right){ this.step(1); return; }
  if(G.clicked(8,L.iy,VW/3,L.ih)){ this.step(-1); return; }
  if(G.clicked(VW*2/3-8,L.iy,VW/3,L.ih)){ this.step(1); return; }
  const id=G.navList(this.st,this.viewBtns(),{noKeys:true});
  if(id==='close'){ this.mode='grid'; this.cur=null; }
  else if(id==='set') this.openSettings();
 },
 drawView(c){
  const L=this.VL(), m=this.cur, VH=G.VH, list=this.filtered();
  c.fillStyle='#07060a'; c.fillRect(0,0,VW,VH);
  const src=this.full, im=src?G.phFullImg(src):null, th=G.phThumbImg(m.id), use=im||th;
  if(use){ const k=Math.min((VW-16)/use.width,L.ih/use.height), w=use.width*k, h=use.height*k; c.drawImage(use,VW/2-w/2,L.iy+L.ih/2-h/2,w,h); }
  else G.icon('cam',c,VW/2,L.iy+L.ih/2,36,'rgba(255,255,255,.18)');
  if(!im) G.txt('LOADING THE FULL PHOTO…',VW/2,L.iy+L.ih-14,5.8,'rgba(255,255,255,.55)','center',VW-20,700);
  if(list.length>1){ G.txt('‹',16,L.iy+L.ih/2-10,16,'rgba(255,255,255,.55)','center',undefined,800); G.txt('›',VW-16,L.iy+L.ih/2-10,16,'rgba(255,255,255,.55)','center',undefined,800); }
  let y=L.dy;
  G.txt([G.fmtDay(m.d),m.loc?m.loc.toUpperCase():''].filter(Boolean).join(' • '),12,y,7.6,'#ffd060','left',VW-24,800); y+=15;
  if(m.desc){ G.wrap(m.desc,7,VW-24,600).slice(0,3).forEach(l=>{ G.txt(l,12,y,7,'#ece2d2','left',VW-24,600); y+=11; }); y+=3; }
  const crp=m.crId?(G.club.person(m.crId)||{n:m.cr,t:m.crT}):{n:m.cr,t:m.crT};
  G.txt('PHOTO BY',12,y+1,5.6,'#9a8f80','left',undefined,800); G.drawPersonName(crp,62,y,7.2,m.crT==='sup'?'#ffc4e2':'#f4ede2',VW-80); y+=14;
  G.txt('ADDED BY',12,y+1,5.6,'#9a8f80','left',undefined,800); G.txt(m.by+(m.ride?' • FROM A LOGGED RIDE':''),62,y,6.6,'#cfc4b0','left',VW-80,700); y+=13;
  G.drawBtns(this.viewBtns(),this.st);
  G.topBar((this.vi+1)+' OF '+list.length,{size:8.6,sub:this.fltLabel()==='ALL'?'PHOTO ALBUM':this.fltLabel(),subCol:'#ffb060'});
 },
 /* ---------------- photo settings (uploader: date, place, caption | officers: + credit, take down) ---------------- */
 SL(){ const top=64; return {dY:top,cY:top+58,cH:72,crY:top+156,btnY:G.VH-50}; },
 openSettings(){
  const m=this.cur, L=this.SL(); this.mode='set'; this.st={f:0}; this.ed={cr:null};
  G.field('sd',{x:12,y:L.dY,w:130,h:32,fs:.36,type:'date',align:'left',value:m.d,maxDate:G.today(),primary:false});
  G.field('sl',{x:148,y:L.dY,w:110,h:32,max:60,align:'left',placeholder:'Where?',value:m.loc||'',primary:false});
  G.field('sc',{x:12,y:L.cY,w:246,h:L.cH,max:300,multiline:true,align:'left',placeholder:'Caption',value:m.desc||'',primary:false});
  AUDIO.sfx('ok');
 },
 closeSettings(){ for(const id of ['sd','sl','sc']) G.removeField(id); this.ed=null; this.mode='view'; },
 setBtns(){ const L=this.SL(), off=G.club.isPhotoOfficer(), B=[{id:'save',label:'SAVE CHANGES',kind:'primary',x:12,y:L.btnY,w:170,h:40,size:8},{id:'cancel',label:'CANCEL',x:188,y:L.btnY,w:70,h:40,size:7.2}];
  if(off) B.push({id:'remove',label:'TAKE THIS PHOTO DOWN',kind:'danger',x:12,y:L.btnY-46,w:246,h:34,size:7.2});
  return B; },
 crBtn(){ const L=this.SL(); return {x:12,y:L.crY,w:246,h:30}; },
 async saveSettings(){
  const m=this.cur, ch={d:G.fieldVal('sd'),loc:G.fieldVal('sl').trim(),desc:G.fieldVal('sc').trim()};
  if(this.ed&&this.ed.cr) ch.cr=this.ed.cr;
  this.busy=true; const r=await G.club.editPhoto(m,ch); this.busy=false;
  if(!r){ G.toast('COULDN’T SAVE - CHECK YOUR CONNECTION','#ff7030'); AUDIO.sfx('buzzer'); return; }
  this.photos=this.photos.map(x=>x.id===r.id?r:x); this.older=this.older.map(x=>x.id===r.id?r:x); this.cur=r; this.cache=null;
  G.toast('PHOTO UPDATED','#80ffa0'); AUDIO.sfx('cheer'); this.closeSettings();
 },
 updSettings(){
  if(this.picker){ const r=this.picker.update(); if(r){ this.picker=null; if(r.done) this.ed.cr=r.done; } return; }
  if(this.modal){ const r=this.modal.update(); if(r==='no'||(r==null&&G.pressed.b)){ this.modal=null; G.hideFields(false); return; }
   if(r==='yes'){ const m=this.cur; this.modal=null; G.club.removePhoto(m).then(ok=>{ if(ok){ for(const id of ['sd','sl','sc']) G.removeField(id); this.photos=this.photos.filter(x=>x.id!==m.id); this.older=this.older.filter(x=>x.id!==m.id); this.mode='grid'; this.cur=null; this.cache=null; G.toast('PHOTO TAKEN DOWN','#ffd27a'); } else { G.hideFields(false); G.toast('COULDN’T TAKE IT DOWN','#ff7030'); } }); }
   return; }
  if(G.backHit()){ this.closeSettings(); return; }
  if(G.club.isPhotoOfficer()){ const b=this.crBtn(); if(G.clicked(b.x,b.y,b.w,b.h)){ const m=this.cur; this.picker=G.PersonPicker({title:'PHOTO BY',sub:'WHO TOOK THIS PHOTO?',allowText:true,top:[G.club.person(m.byId)||{id:m.byId,n:m.by,t:'mem'}]}); this.picker.open(); return; } }
  const id=G.navList(this.st,this.setBtns(),{noKeys:true});
  if(id==='save'&&!this.busy) this.saveSettings();
  else if(id==='cancel') this.closeSettings();
  else if(id==='remove'){ G.hideFields(true); this.modal=G.Modal({title:'TAKE THIS PHOTO DOWN?',titleCol:'#ff8060',lines:[['IT COMES OUT OF THE ALBUM FOR EVERYONE.','#cfc4b0',6.8]],btns:[{id:'yes',label:'TAKE IT DOWN',kind:'danger'},{id:'no',label:'KEEP IT'}]}); }
 },
 drawSettings(c){
  const m=this.cur, L=this.SL(), off=G.club.isPhotoOfficer();
  const lab=(t,x,y)=>G.txt(t,x,y-12,6.2,'#b8ad9c','left',undefined,700);
  lab('DATE TAKEN',12,L.dY); lab('WHERE',148,L.dY); lab('CAPTION',12,L.cY);
  G.rrect(12,L.cY,246,L.cH,14); c.fillStyle='rgba(0,0,0,.4)'; c.fill();
  lab('PHOTO CREDIT',12,L.crY);
  const b=this.crBtn(), cr=(this.ed&&this.ed.cr)||(m.crId?(G.club.person(m.crId)||{n:m.cr,t:m.crT}):{n:m.cr,t:m.crT});
  G.rrect(b.x,b.y,b.w,b.h,14); c.fillStyle=off?'rgba(255,154,208,.1)':'rgba(255,255,255,.04)'; c.fill(); c.strokeStyle=off?'rgba(255,154,208,.55)':'rgba(255,255,255,.12)'; c.lineWidth=1; c.stroke();
  G.drawPersonName(cr,b.x+12,b.y+9,7.6,'#f4ede2',off?190:220);
  if(off) G.txt('CHANGE ▾',b.x+b.w-10,b.y+9.6,6.4,'#ffc4e2','right',undefined,800);
  else G.txt('ONLY A CLUB OFFICER CAN CHANGE THE CREDIT',VW/2,b.y+b.h+8,5.8,'#8a7f70','center',VW-24,700);
  G.drawBtns(this.setBtns(),this.st);
  G.topBar('PHOTO SETTINGS',{size:8.6});
  if(this.picker) this.picker.draw(c);
  if(this.modal) this.modal.draw(c);
 },
 /* ---------------- club officers: supporters asking for access (a motion + a second) ---------------- */
 accItems(){
  const C=G.club, me=myId(), it=[];
  it.push(CL.note(['A SUPPORTER SEES THE ALBUM ONCE ONE CLUB OFFICER','MAKES THE MOTION AND A SECOND OFFICER SECONDS IT.'],'#ffd27a'));
  const Q=C.photoQueue();
  it.push(CL.hdr('WAITING',Q.length,'#ffb060'));
  for(const x of Q){
   const mine=x.m&&x.m.id===me, H=72;
   it.push({h:H+6,focus:true,x,
    draw(c,xx,y,w,foc){
     G.rrect(xx,y,w,H,12); c.fillStyle='rgba(40,24,32,.95)'; c.fill(); c.strokeStyle=foc?'#ffd060':'rgba(255,154,208,.45)'; c.lineWidth=foc?1.6:1; c.stroke();
     avatarDot(c,{n:x.n,t:'sup'},xx+22,y+20,13);
     G.drawPersonName({n:x.n,t:'sup',f:x.f},xx+42,y+8,8.2,'#f4ede2',w-56);
     G.txt([x.loc,'ASKED '+C.ago(x.rq)].filter(Boolean).join(' • '),xx+42,y+24,5.8,'#cfc4b0','left',w-56,700);
     const by=y+H-28;
     if(!x.m){ G.button({x:xx+8,y:by,w:(w-24)*.62,h:22,label:'MOTION TO APPROVE',kind:'success',size:6.6}); }
     else if(!mine){ G.txt('MOTION BY '+x.m.n,xx+42,y+36,5.8,'#ffd27a','left',w-56,800); G.button({x:xx+8,y:by,w:(w-24)*.62,h:22,label:'SECOND IT • APPROVE',kind:'success',size:6.6}); }
     else { G.txt('YOU MADE THE MOTION • ANOTHER OFFICER SECONDS IT',xx+42,y+36,5.6,'#ffd27a','left',w-56,800); }
     G.button({x:xx+w-8-(w-24)*.36,y:by,w:(w-24)*.36,h:22,label:'DECLINE',kind:'danger',size:6.6});
    },
    tap(lx,ly,w){ if(ly<H-30||ly>H-4) return null; const dx=w-8-(w-24)*.36; if(lx>=dx&&lx<=w-8) return {kind:'deny',x}; if(!mine&&lx>=8&&lx<=8+(w-24)*.62) return {kind:'motion',x}; return null; }});
  }
  if(!Q.length) it.push(CL.note(['NOBODY IS WAITING RIGHT NOW.'],'#a8ffc0'));
  const A=C.photoGranted();
  it.push(CL.hdr('HAS ACCESS',A.length,'#80ffa0'));
  for(const x of A){
   it.push({h:52,focus:true,x,
    draw(c,xx,y,w,foc){
     G.rrect(xx,y,w,46,12); c.fillStyle='rgba(30,28,40,.95)'; c.fill(); c.strokeStyle=foc?'#ffd060':'rgba(255,255,255,.1)'; c.lineWidth=1; c.stroke();
     avatarDot(c,{n:x.n,t:'sup'},xx+22,y+23,12);
     G.drawPersonName({n:x.n,t:'sup',f:x.f},xx+42,y+9,7.8,'#f4ede2',w-130);
     G.txt('MOTION '+x.m.n+' • SECOND '+x.s.n,xx+42,y+26,5.4,'#9a8f80','left',w-130,700);
     G.button({x:xx+w-74,y:y+10,w:66,h:26,label:'REVOKE',kind:'ghost',size:6.6});
    },
    tap(lx,ly,w){ return lx>=w-74&&lx<=w-8&&ly>=8&&ly<=38?{kind:'revoke',x}:null; }});
  }
  if(!A.length) it.push(CL.note(['NO SUPPORTERS HAVE ACCESS YET.']));
  CL.layout(it); return it;
 },
 async onAcc(a){
  const C=G.club; if(!a||this.busy) return;
  if(a.kind==='motion'){ this.busy=true; const r=await C.motionPhotos(a.x); this.busy=false;
   if(r==='granted'){ G.toast(a.x.n+' CAN SEE THE ALBUM NOW','#80ffa0'); AUDIO.sfx('cheer'); }
   else if(r==='motion'){ G.toast('MOTION MADE • A SECOND OFFICER SECONDS IT','#ffd27a'); AUDIO.sfx('ok'); }
   else if(r==='self'){ G.toast('ANOTHER OFFICER HAS TO SECOND YOUR MOTION','#ffd27a'); AUDIO.sfx('buzzer'); }
   else { G.toast('COULDN’T SAVE - CHECK YOUR CONNECTION','#ff7030'); AUDIO.sfx('buzzer'); }
   return; }
  if(a.kind==='deny'||a.kind==='revoke'){
   this.modal=G.Modal({title:a.kind==='deny'?'DECLINE '+a.x.n+'?':'REVOKE '+a.x.n+'?',titleCol:'#ff8060',lines:[[a.kind==='deny'?'THEY CAN ASK AGAIN LATER.':'THE ALBUM CLOSES FOR THEM.','#cfc4b0',7]],btns:[{id:'yes',label:a.kind==='deny'?'DECLINE':'REVOKE',kind:'danger'},{id:'no',label:'CANCEL'}]});
   this.modal.x=a.x; this.modal.kind=a.kind;
  }
 },
 /* ---------------- a supporter's door: ask for access ---------------- */
 reqY(){ return Math.round(G.VH*.14); },
 reqBtn(){ return {id:'req',label:'REQUEST PHOTO ACCESS',kind:'primary',x:28,y:this.reqY()+218,w:214,h:44,size:8.6}; },
 updRequest(){
  if(G.backHit()){ G.go(this.back,this.backArgs||{}); return; }
  const p=G.club.photoAccess();
  if(p!=='none'&&p!=='denied') return;
  const b=this.reqBtn();
  if(G.clicked(b.x,b.y,b.w,b.h)&&!this.busy){ this.busy=true; G.club.requestPhotos().then(ok=>{ this.busy=false; G.toast(ok?'REQUEST SENT TO THE CLUB OFFICERS':'COULDN’T SEND - CHECK YOUR CONNECTION',ok?'#80ffa0':'#ff7030'); AUDIO.sfx(ok?'cheer':'buzzer'); }); }
 },
 drawRequest(c){
  const VH=G.VH, C=G.club, p=C.photoAccess(), x=C.myPhacc||{};
  const y=this.reqY(), h=202;
  G.panel(14,y,242,h,{border:'rgba(255,154,208,.6)'});
  c.beginPath(); c.arc(VW/2,y+38,24,0,7); c.fillStyle='rgba(255,154,208,.12)'; c.fill();
  G.icon('cam',c,VW/2,y+38,26,'#ff9ad0');
  G.txt('PHOTO ALBUM',VW/2,y+72,11,'#ffd060','center',220,800);
  const lines=['RIDE PHOTOS AND PHOTO DUMPS FROM THE CLUB.','SUPPORTERS GET IN ONCE A CLUB OFFICER MAKES','THE MOTION AND A SECOND OFFICER SECONDS IT.'];
  lines.forEach((l,i)=>G.txt(l,VW/2,y+96+i*14,6.4,'#e0d6c4','center',226,700));
  // where the request stands: two steps
  const sy=y+150, steps=[['ASKED',p==='asked'||p==='motion'],['MOTION',p==='motion'],['SECOND',false]];
  steps.forEach((s,i)=>{ const cx=VW/2-70+i*70; c.beginPath(); c.arc(cx,sy,9,0,7); c.fillStyle=s[1]?'#ff9ad0':'rgba(255,255,255,.08)'; c.fill(); c.strokeStyle='rgba(255,154,208,.6)'; c.lineWidth=1; c.stroke();
   if(s[1]){ c.strokeStyle='#2a0c1c'; c.lineWidth=2; c.beginPath(); c.moveTo(cx-4,sy); c.lineTo(cx-1,sy+3.4); c.lineTo(cx+4.6,sy-3.2); c.stroke(); }
   G.txt(s[0],cx,sy+13,5.4,s[1]?'#ffc4e2':'#8a7f70','center',undefined,800);
   if(i<2){ c.fillStyle='rgba(255,154,208,.3)'; c.fillRect(cx+12,sy-.5,46,1); } });
  const status={checking:'CHECKING YOUR ACCESS…',none:'TAP BELOW TO ASK THE CLUB OFFICERS',asked:'REQUESTED • WAITING FOR A CLUB OFFICER',motion:'1 OF 2 OFFICERS APPROVED • '+(x.m?x.m.n+' MADE THE MOTION':''),denied:'NOT APPROVED THIS TIME • YOU CAN ASK AGAIN'}[p]||'';
  G.txt(status,VW/2,sy+32,6.2,p==='denied'?'#ff9a80':'#ffd27a','center',226,800);
  if(p==='none'||p==='denied'){ const b=this.reqBtn(); G.button(Object.assign({},b,{label:this.busy?'SENDING…':(p==='denied'?'ASK AGAIN':b.label)})); }
 },
 /* ---------------- frame ---------------- */
 update(){
  const C=G.club;
  this.sync();
  const acc=C.photoAccess();
  if(acc==='locked'){ G.removeField('pf'); if(this.mode!=='grid'){ G.clearFields(); this.mode='grid'; this.picker=null; this.modal=null; } if(G.backHit()){ G.go(this.back,this.backArgs||{}); return; } this.lock.update(56); return; }
  if(acc!=='member'&&acc!=='granted'){ G.removeField('pf'); this.updRequest(); return; }
  if(this.mode==='prep'||this.mode==='sending'){ return; }
  if(this.mode==='up'){ if(!C.canUploadPhotos()){ this.closeUpload(); return; } this.updUpload(); return; }
  if(this.mode==='view'){ this.updView(); return; }
  if(this.mode==='set'){ if(!C.canEditPhoto(this.cur)){ this.closeSettings(); return; } this.updSettings(); return; }
  if(this.mode==='access'){
   if(!C.isPhotoOfficer()){ this.mode='grid'; return; }
   if(this.modal){ const r=this.modal.update(); if(r==='no'||(r==null&&G.pressed.b)){ this.modal=null; return; }
    if(r==='yes'){ const m=this.modal; this.modal=null; C.denyPhotos(m.x).then(ok=>G.toast(ok?(m.kind==='deny'?'REQUEST DECLINED':'ACCESS REVOKED'):'COULDN’T SAVE',ok?'#ffd27a':'#ff7030')); } return; }
   if(G.backHit()){ this.mode='grid'; this.cache=null; this.list.reset(); return; }
   this.list.update(this.accItems(),{x:0,y:48,w:VW,h:G.VH-54},a=>this.onAcc(a));
   return;
  }
  // grid
  if(this.picker){ const r=this.picker.update(); if(r){ this.picker=null; if(r.done){ this.flt={k:'by',id:r.done.id,n:r.done.n}; this.cache=null; this.list.reset(); } } return; }
  this.placePicker();
  if(G.backHit()){ G.removeField('pf'); G.go(this.back,this.backArgs||{}); return; }
  if(G.pressed.left&&this.fcol>0){ this.fcol--; AUDIO.sfx('blip'); }
  if(G.pressed.right&&this.fcol<2){ this.fcol++; AUDIO.sfx('blip'); }
  for(const r of this.chipRects()) if(G.clicked(r.x,r.y-2,r.w,r.h+4)){
   AUDIO.sfx('blip'); this.list.reset(); this.cache=null;
   if(r.id==='all'||r.id==='ride') this.flt={k:'all'};
   else if(r.id==='mine') this.flt={k:'mine'};
   else if(r.id==='by'){ if(this.flt.k==='by') this.flt={k:'all'}; else { const ups=new Set(this.all().map(m=>m.byId)); this.picker=G.PersonPicker({title:'WHOSE PHOTOS?',sub:'EVERYONE WHO HAS ADDED PHOTOS'}); const pp=this.picker; pp.people=function(){ const q=G.fieldVal('pq').trim().toUpperCase(); return G.club.directory().filter(p=>ups.has(p.id)&&(!q||p.n.indexOf(q)>=0)); }; pp.open(); G.removeField('pf'); } }
   return;
  }
  this.list.update(this.items(),this.area(),a=>{
   if(!a) return;
   if(a.kind==='view') this.openView(a.m);
   else if(a.kind==='access'){ this.mode='access'; this.list.reset(); G.removeField('pf'); AUDIO.sfx('ok'); }
   else if(a.kind==='older') this.loadOlder();
  });
 },
 draw(c){
  const VH=G.VH, C=G.club, acc=C.photoAccess();
  G.cover(G.img.bg_dining,0,0,VW,VH); G.dim(.9);
  if(acc==='locked'){ this.lock.draw(c,56); G.topBar('PHOTO ALBUM',{size:8.6}); return; }
  if(acc!=='member'&&acc!=='granted'){ this.drawRequest(c); G.topBar('PHOTO ALBUM',{size:8.6}); return; }
  if(this.mode==='prep'||this.mode==='sending'){
   const s=this.sending, msg=this.mode==='prep'?((this.batch&&this.batch.prog)||'GETTING YOUR PHOTOS READY…'):'UPLOADING '+(s?s.done+1>s.n?s.n:s.done+1:1)+' OF '+(s?s.n:1)+'…';
   G.panel(24,VH*.36,222,96,{border:'rgba(255,170,90,.6)'});
   G.icon('cam',c,VW/2,VH*.36+28,22,'#ffb060');
   G.txt(msg,VW/2,VH*.36+50,7.4,'#ffd060','center',206,800);
   if(s){ G.rrect(44,VH*.36+70,182,8,4); c.fillStyle='rgba(255,255,255,.1)'; c.fill(); G.rrect(44,VH*.36+70,182*(s.done/s.n),8,4); c.fillStyle='#ff9a40'; c.fill(); }
   G.topBar(this.mode==='prep'?'ADD PHOTOS':'UPLOADING',{size:8.6}); return;
  }
  if(this.mode==='up'){ this.drawUpload(c); return; }
  if(this.mode==='view'){ this.drawView(c); return; }
  if(this.mode==='set'){ this.drawView(c); G.dim(.85); this.drawSettings(c); return; }
  if(this.mode==='access'){ this.list.draw(c,this.accItems(),{x:0,y:48,w:VW,h:VH-54}); G.topBar('SUPPORTER ACCESS',{size:8.4}); if(this.modal) this.modal.draw(c); return; }
  // grid
  for(const r of this.chipRects()){ const on=(r.id==='all'&&this.flt.k==='all')||(r.id===this.flt.k)||(r.id==='ride');
   G.rrect(r.x,r.y,r.w,r.h,12); c.fillStyle=on?'#ffa040':'rgba(255,255,255,.07)'; c.fill(); c.strokeStyle=on?'#ffb050':'rgba(255,255,255,.2)'; c.lineWidth=1; c.stroke();
   G.txt(r.label,r.x+r.w/2,r.y+7,6.4,on?'#16100a':'#e0d6c4','center',r.w-8,800); }
  { const n=this.filtered().length; G.txt(n+(n===1?' PHOTO':' PHOTOS'),VW-10,59,6,'#9a8f80','right',undefined,800); }
  this.list.draw(c,this.items(),this.area());
  G.topBar('PHOTO ALBUM',{size:8.6});
  const ab=this.addBtn(); if(ab){ const press=G.held(ab.x,ab.y,ab.w,ab.h); G.glowFill(ab.x,ab.y+(press?1:0),ab.w,ab.h,12.5); G.txt(ab.t,ab.x+ab.w/2,ab.y+7.5+(press?1:0),7,'#16100a','center',undefined,800); }
  if(this.picker) this.picker.draw(c);
 }
};
})();
