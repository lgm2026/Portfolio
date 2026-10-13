/* ADMIN OFFICE: the club's formal info and its documents - for approved (verified) members only. Guests, supporters
   and members still on the waitlist get the members-only lock and never download any of it.
   CLUB INFO (legal name, founded, nonprofit/EIN, mission, meetings, mailing address, email, phone, website): only the
   club admin edits it (config/info - enforced by the arcade's sharing rules).
   DOCUMENTS (bylaws, meeting minutes, policies, forms, finance, other) are for MEMBERS (every approved member) or
   OFFICERS (admin, officers, POCs and confirmed positions). Club officers and the club admin add, edit and remove them.
   A document is a LINK (Google Drive, Dropbox, the club's website...) that opens in a new tab, or TEXT typed or pasted
   into the app and read right here. The Admin Console (approvals, POCs, officers) is one tap away for the club admin,
   officers and POCs. */
(function(){
const VW=G.VW, CL=G.CL;
function wrapBody(text,size,w,weight){ const out=[]; String(text||'').split(/\n/).forEach(p=>{ const L=p.trim()?G.wrap(p.trim(),size,w,weight||600):['']; L.forEach(l=>out.push(l)); }); while(out.length&&!out[out.length-1]) out.pop(); return out; }
/* a big "open this link" button that is a real link under the hood (so phones open it reliably) */
function linkAt(id,url,b){
 const f=G.fields[id];
 if(!url){ if(f) G.removeField(id); return; }
 if(!f||f.o.href!==url||f.rect.y!==b.y||f.rect.x!==b.x||f.rect.h!==b.h) G.linkField(id,{href:url,x:b.x,y:b.y,w:b.w,h:b.h,label:b.label,onTap:()=>AUDIO.sfx('ok')});
}
function hostOf(u){ try{ return new URL(u).hostname.replace(/^www\./,''); }catch(e){ return ''; } }
const INFO_ROWS=[['founded','FOUNDED'],['ein','NONPROFIT'],['meet','MEETINGS'],['addr','ADDRESS'],['email','EMAIL'],['phone','PHONE']];
const LW=58;   // label column in the club info card

G.scenes.office={
 enter(a){
  a=a||{};
  if(a.back) this.back=a.back; else if(!this.back) this.back='club';
  this.lock=G.LockPanel();
  this.mode='home'; this.list=CL.List(); this.cache=null; this.st={f:0}; this.dst={f:0}; this.est={f:0};
  this.doc=null; this.body=null; this.bodyErr=false; this.ed=null; this.inf=null; this.modal=null; this.busy=false; this.err='';
 },
 area(){ return {x:0,y:48,w:VW,h:G.VH-54}; },
 webUrl(){ const w=(G.club.info||{}).web; return w?(G.club.cleanUrl(w)||''):''; },
 canInfo(){ const C=G.club; return !!C.admin&&!!G.activeAcct&&G.clubAccess().ok; },
 /* ---------------- home: club info, the console (admin roles), documents by category ---------------- */
 items(){
  const C=G.club, ok=G.clubAccess().ok;
  const key=[C.ver,Math.floor(Date.now()/30000),ok,C.loaded.docs,C.loaded.info,C.isAdminish(),C.canEditDocs(),this.canInfo(),C.myPending().length].join('|');
  if(this.cache&&this.cache.key===key) return this.cache.items;
  const it=[this.infoItem()];
  if(C.isAdminish()) it.push(this.consoleItem());
  const D=C.visibleDocs();
  it.push({h:34,draw:(c,x,y,w)=>{ G.icon('docs',c,x+10,y+14,13,'#ffd060'); G.txt('CLUB DOCUMENTS',x+22,y+9,8,'#ffd060','left',w-80,800);
   if(D.length) G.txt(D.length+(D.length===1?' DOCUMENT':' DOCUMENTS'),x+w-4,y+10,6,'#9a8f80','right',undefined,800);
   c.fillStyle='rgba(255,208,96,.25)'; c.fillRect(x,y+29,w,1); }});
  if(!C.db) it.push(CL.note(['DOCUMENTS NEED THE CLUB NETWORK.','GAMES AND YOUR RIDE LOG STILL WORK.'],'#ffd27a'));
  else if(!C.loaded.docs) it.push(CL.note(['LOADING DOCUMENTS…']));
  else {
   for(const cat of C.DOCCATS){
    const L=D.filter(d=>d.cat===cat.k).sort(cat.k==='minutes'?((a,b)=>(b.at||0)-(a.at||0)):((a,b)=>String(a.t).localeCompare(String(b.t))));
    if(!L.length) continue;
    it.push(CL.hdr(cat.t,L.length,cat.col));
    L.forEach(d=>it.push(this.docItem(d)));
   }
   if(!D.length) it.push(CL.note(C.canEditDocs()?['NO DOCUMENTS YET.','TAP + ADD FOR THE BYLAWS, MINUTES OR FORMS.']:['NO DOCUMENTS YET.','OFFICERS POST THE BYLAWS, MINUTES AND FORMS HERE.']));
  }
  it.push(CL.note(['FOR APPROVED MEMBERS ONLY • OFFICERS AND THE CLUB','ADMIN POST DOCUMENTS FOR MEMBERS OR OFFICERS.']));
  CL.layout(it);
  this.cache={key,items:it};
  return it;
 },
 infoItem(){
  const C=G.club, I=C.info||{}, inner=254-24, edit=this.canInfo(), web=this.webUrl();
  const nl=G.wrap(I.name||'RAGING KNIGHTS FFMC',9,inner-44,800).slice(0,3);
  const rows=[];
  for(const [k,t] of INFO_ROWS){ if(!I[k]) continue; rows.push({t,lines:wrapBody(I[k],6.6,inner-LW).slice(0,5)}); }
  const ml=I.mission?wrapBody(I.mission,6.8,inner).slice(0,14):[];
  const empty=!rows.length&&!ml.length&&!I.name&&!web;
  const headH=Math.max(48,24+nl.length*12+8);
  let h=headH+8;
  rows.forEach(r=>{ h+=r.lines.length*10.5+6; });
  if(ml.length) h+=14+ml.length*11+6;
  if(empty) h+=28;
  const webY=web?h+2:null; if(web) h+=40;
  const editY=edit?h+2:null; if(edit) h+=40;
  h+=6;
  const H=h;
  return {h:H+8,focus:true,webY,
   draw(c,x,y,w,foc){
    G.rrect(x,y,w,H,14); const g=c.createLinearGradient(0,y,0,y+H); g.addColorStop(0,'rgba(64,40,18,.96)'); g.addColorStop(1,'rgba(26,22,30,.96)');
    c.fillStyle=g; c.fill(); c.strokeStyle=foc?'#ffd060':'rgba(255,176,96,.5)'; c.lineWidth=foc?2:1.2; c.stroke();
    if(G.img.crest_sm) c.drawImage(G.img.crest_sm,x+10,y+10,30,32);
    G.txt('CLUB INFO',x+48,y+10,5.8,'#ff9a50','left',w-60,800);
    let yy=y+22; nl.forEach(l=>{ G.txt(l,x+48,yy,9,'#ffd060','left',w-58,800); yy+=12; });
    c.fillStyle='rgba(255,255,255,.1)'; c.fillRect(x+10,y+headH,w-20,1);
    yy=y+headH+8;
    rows.forEach(r=>{ G.txt(r.t,x+12,yy+.5,5.4,'#9a8f80','left',LW-6,800); r.lines.forEach((l,i)=>G.txt(l,x+12+LW,yy+i*10.5,6.6,'#ece2d2','left',w-24-LW,600)); yy+=r.lines.length*10.5+6; });
    if(ml.length){ G.txt('MISSION',x+12,yy,5.4,'#9a8f80','left',undefined,800); yy+=14; ml.forEach(l=>{ G.txt(l,x+12,yy,6.8,'#f0e6d6','left',w-24,600); yy+=11; }); yy+=6; }
    if(empty) G.txt(edit?'ADD THE CLUB’S INFO WITH THE BUTTON BELOW.':'THE CLUB ADMIN HASN’T FILLED THIS IN YET.',x+w/2,yy+4,6.2,'#9a8f80','center',w-20,700);
    if(web){ G.button({x:x+12,y:y+webY,w:w-24,h:32,label:'VISIT THE CLUB WEBSITE ↗',kind:'secondary',size:7.6}); }
    if(edit) G.button({x:x+12,y:y+editY,w:w-24,h:32,label:'✎ EDIT CLUB INFO',kind:'ghost',size:7.4});
   },
   enter:()=>edit?{kind:'editinfo'}:(web?{kind:'web'}:null),
   tap(lx,ly){ if(edit&&ly>=editY&&ly<=editY+32) return {kind:'editinfo'}; if(web&&ly>=webY&&ly<=webY+32) return {kind:'web'}; return null; }};
 },
 consoleItem(){
  const C=G.club, n=C.myPending().length;
  return {h:52,focus:true,
   draw(c,x,y,w,foc){
    const press=G.held(x,y,w,46);
    G.rrect(x,y+(press?1:0),w,46,12); c.fillStyle=press?'rgba(60,52,72,.96)':'rgba(44,26,14,.94)'; c.fill(); c.strokeStyle=foc?'#ffd060':'rgba(255,144,80,.55)'; c.lineWidth=foc?2:1; c.stroke();
    c.beginPath(); c.arc(x+24,y+23,15,0,7); c.fillStyle='rgba(255,144,80,.14)'; c.fill();
    G.icon('roster',c,x+24,y+23,17,'#ff9050');
    G.txt('ADMIN CONSOLE',x+46,y+9,8.4,'#f4ede2','left',w-100,800);
    G.txt(n?C.roleLabel()+' • '+n+' WAITING ON YOU':'APPROVALS • POCS • OFFICERS',x+46,y+25,5.8,n?'#80e0ff':'#b8ad9c','left',w-96,700);
    G.txt('OPEN ›',x+w-12,y+17,7.2,'#ffb060','right',undefined,800);
    if(n){ c.beginPath(); c.arc(x+w-8,y+6,6,0,7); c.fillStyle='#ff5a40'; c.fill(); G.txt(String(Math.min(n,9)),x+w-8,y+2.2,5.6,'#fff','center',undefined,800); }
   },
   tap:()=>({kind:'console'}),enter:()=>({kind:'console'})};
 },
 docItem(d){
  const C=G.club, cat=C.docCat(d.cat), link=d.kind==='link', au=C.audOf(d);
  const chip=au.v==='off'?'OFFICERS':'MEMBERS';
  const tl=G.wrap(d.t,7.8,156,800).slice(0,2), H=30+tl.length*11;
  const sub=(link?'↗ '+hostOf(d.url):'READ IT HERE')+' • '+CL.day(d.u||d.at);
  return {h:H+6,focus:true,d,
   draw(c,x,y,w,foc){
    const press=G.held(x,y,w,H);
    G.rrect(x,y+(press?1:0),w,H,11); c.fillStyle=press?'rgba(60,52,72,.96)':'rgba(30,28,40,.95)'; c.fill(); c.strokeStyle=foc?'#ffd060':'rgba(255,255,255,.1)'; c.lineWidth=foc?1.6:1; c.stroke();
    G.rrect(x+6,y+8,3.5,H-16,1.75); c.fillStyle=cat.col; c.fill();
    G.icon('docs',c,x+25,y+H/2,15,link?'#9fd8ff':'#ffd060');
    let yy=y+7; tl.forEach(l=>{ G.txt(l,x+42,yy,7.8,'#f4ede2','left',w-(chip?96:56),800); yy+=11; });
    G.txt(sub,x+42,yy+3,5.6,link?'#9fd8ff':'#b8ad9c','left',w-56,700);
    if(chip) G.chip(chip,x+w-10,y+7,{align:'right',size:5,col:au.col,bg:'rgba(0,0,0,.4)'});
    G.txt('›',x+w-14,y+H-19,10,'#ffb060','center',undefined,800);
   },
   tap:()=>({kind:'open',d}),enter:()=>({kind:'open',d})};
 },
 onAct(a){
  if(!a) return;
  const C=G.club;
  if(a.kind==='open') this.openDoc(a.d);
  else if(a.kind==='console'){ AUDIO.sfx('ok'); G.go('console',{back:'office'}); }
  else if(a.kind==='editinfo'&&this.canInfo()){ this.mode='info'; this.list.reset(); this.cache=null; G.removeField('web'); AUDIO.sfx('ok'); }
  else if(a.kind==='web'){ const u=this.webUrl(); if(u) try{ window.open(u,'_blank','noopener'); }catch(e){} }
 },
 /* the website button inside the scrolling info card is a real link: keep it under the drawn button */
 placeWeb(){
  const url=this.webUrl(), it=this.mode==='home'&&!this.modal&&this.cache&&this.cache.items[0];
  if(!url||!it||it.webY==null){ G.removeField('web'); return; }
  const A=this.area(), b={x:A.x+20,y:A.y+it.y-this.list.sc.scroll+it.webY,w:A.w-40,h:32,label:'Club website'};
  if(b.y<A.y||b.y+b.h>A.y+A.h){ G.removeField('web'); return; }
  linkAt('web',url,b);
 },
 addBtn(){
  if(this.mode==='edit'){ const t=this.ed&&this.ed.busy?'…':'SAVE', w=G.tw(t,7,800)+24; return {x:VW-6-w,y:8,w,h:25,t}; }
  if(this.mode!=='home'||!G.club.canEditDocs()) return null;
  const t='+ ADD', w=G.tw(t,7,800)+24; return {x:VW-6-w,y:8,w,h:25,t};
 },
 drawAdd(c){ const ap=this.addBtn(); if(!ap) return; const press=G.held(ap.x,ap.y,ap.w,ap.h); G.glowFill(ap.x,ap.y+(press?1:0),ap.w,ap.h,12.5); G.txt(ap.t,ap.x+ap.w/2,ap.y+7.5+(press?1:0),7,'#16100a','center',undefined,800); },
 /* ---------------- one document ---------------- */
 openDoc(d,quiet){
  const C=G.club;
  G.removeField('web'); G.removeField('rd'); G.removeField('dl');
  this.mode='doc'; this.dst={f:0}; this.modal=null;
  const same=this.doc&&this.doc.id===d.id&&this.doc.u===d.u&&this.body!=null;
  this.doc=d; this.bodyErr=false;
  if(!same) this.body=null;
  if(!quiet) AUDIO.sfx('ok');
  if(d.kind!=='text') return;
  if(this.body!=null){ this.placeReader(); return; }
  const want=d.id+'@'+d.u; this.bodyKey=want;
  C.docBody(d).then(b=>{
   if(this.mode!=='doc'||!this.doc||this.bodyKey!==want||this.doc.id!==d.id) return;
   if(b==null){ this.bodyErr=true; return; }
   this.body=b; this.placeReader();
  });
 },
 closeDoc(){ G.removeField('rd'); G.removeField('dl'); this.mode='home'; this.doc=null; this.body=null; this.modal=null; this.cache=null; },
 DL(){
  const VH=G.VH, d=this.doc, tl=G.wrap(d.t,10,236,800).slice(0,3), top=58;
  const metaY=top+tl.length*14+2, chipY=metaY+14, bodyY=chipY+24, can=G.club.canEditDocs(), btnY=VH-46;
  return {tl,top,metaY,chipY,bodyY,can,btnY,bodyH:Math.max(60,(can?btnY-10:VH-10)-bodyY),
   open:{label:'Open the document',x:22,y:bodyY+34,w:226,h:46},
   B:can?[{id:'edit',label:'✎ EDIT',x:12,y:btnY,w:120,h:36,size:7.6},{id:'del',label:'DELETE',kind:'danger',x:138,y:btnY,w:120,h:36,size:7.6}]:[]};
 },
 placeReader(){
  if(this.mode!=='doc'||this.body==null) return;
  const L=this.DL();
  G.field('rd',{x:12,y:L.bodyY,w:246,h:L.bodyH,multiline:true,readOnly:true,align:'left',max:G.club.DOCMAX,value:this.body,primary:false});
  if(this.modal) G.hideFields(true);
 },
 updDoc(){
  const C=G.club;
  // it may have been edited or removed (or hidden from this viewer) while it was open
  const cur=C.docs.find(x=>x.id===this.doc.id);
  if(!cur||!C.canSee(cur)){ this.closeDoc(); G.toast('THAT DOCUMENT IS NO LONGER AVAILABLE','#ffd27a'); return; }
  if(cur!==this.doc){ if(cur.u!==this.doc.u||cur.kind!==this.doc.kind){ this.openDoc(cur,true); return; } this.doc=cur; }
  const d=this.doc, L=this.DL();
  if(this.modal){
   const r=this.modal.update();
   if(r==='no'||(r==null&&G.pressed.b)){ this.modal=null; G.hideFields(false); return; }
   if(r==='yes'){
    this.modal=null; G.hideFields(false);
    if(this.busy) return; this.busy=true;
    C.deleteDoc(d).then(ok=>{ this.busy=false; if(ok){ if(this.mode==='doc'&&this.doc&&this.doc.id===d.id) this.closeDoc(); G.toast('DOCUMENT DELETED','#ffd27a'); } else G.toast('COULDN’T DELETE - CHECK YOUR CONNECTION','#ff7030'); });
   }
   return;
  }
  if(G.backHit()){ this.closeDoc(); return; }
  if(d.kind==='link') linkAt('dl',d.url,L.open); else G.removeField('dl');
  const id=G.navList(this.dst,L.B,{noKeys:true});
  if(id==='edit') this.openEditor(d);
  else if(id==='del'){ G.hideFields(true); this.modal=G.Modal({title:'DELETE THIS DOCUMENT?',titleCol:'#ff8060',lines:[[d.t.slice(0,40),'#cfc4b0',7],['EVERYONE LOSES ACCESS TO IT HERE.','#9a8f80',6.4]],btns:[{id:'yes',label:'DELETE',kind:'danger'},{id:'no',label:'KEEP IT'}]}); }
 },
 drawDoc(c){
  const C=G.club, d=this.doc, L=this.DL(), cat=C.docCat(d.cat), au=C.audOf(d), VH=G.VH;
  let yy=L.top; L.tl.forEach(l=>{ G.txt(l,14,yy,10,'#ffd060','left',VW-28,800); yy+=14; });
  G.txt('POSTED BY '+d.by+(d.role?' • '+d.role:'')+((d.u||0)>(d.at||0)+60000&&d.ub?' • EDITED BY '+d.ub:''),14,L.metaY,5.8,'#9a8f80','left',VW-28,700);
  let cx=14;
  cx+=G.chip(cat.t,cx,L.chipY,{size:5.6,col:'#14100c',bg:cat.col})+5;
  cx+=G.chip(au.v==='off'?'OFFICERS ONLY':'MEMBERS ONLY',cx,L.chipY,{size:5.6,col:au.col,bg:'rgba(0,0,0,.4)',border:au.col})+5;
  G.chip('UPDATED '+CL.day(d.u||d.at),cx,L.chipY,{size:5.6,col:'#cfc4b0',bg:'rgba(255,255,255,.08)'});
  if(d.kind==='link'){
   const b=L.open;
   G.panel(12,L.bodyY,246,b.y+b.h+56-L.bodyY,{border:'rgba(159,216,255,.4)'});
   G.txt('A LINKED DOCUMENT',VW/2,L.bodyY+12,6.4,'#9fd8ff','center',230,800);
   G.button({x:b.x,y:b.y,w:b.w,h:b.h,label:'OPEN DOCUMENT ↗',kind:'primary',size:9});
   G.txt('OPENS '+C.linkLabel(d.url),VW/2,b.y+b.h+10,6,'#9fd8ff','center',230,700);
   G.txt('IN A NEW TAB',VW/2,b.y+b.h+23,5.8,'#9a8f80','center',230,700);
  } else {
   G.rrect(12,L.bodyY,246,L.bodyH,14); c.fillStyle='rgba(8,7,12,.72)'; c.fill();
   if(this.body==null) G.txt(this.bodyErr?'COULDN’T LOAD THIS DOCUMENT • TAP BACK AND TRY AGAIN':'LOADING…',VW/2,L.bodyY+20,6.6,this.bodyErr?'#ff9a80':'#cfc4b0','center',230,700);
  }
  if(L.B.length) G.drawBtns(L.B,this.dst);
  G.topBar(cat.t,{size:8.6});
  if(this.modal) this.modal.draw(c);
 },
 /* ---------------- add / edit a document (club officers + the club admin) ---------------- */
 EL(){
  const VH=G.VH, t=64;
  return {titleY:t,catY:t+50,audY:t+112,kindY:t+156,srcY:t+200,saveY:VH-48,get bodyH(){ return Math.max(60,this.saveY-24-this.srcY); }};
 },
 catRects(){ const E=this.EL(), w=(246-10)/3; return G.club.DOCCATS.map((k,i)=>({x:12+(i%3)*(w+5),y:E.catY+Math.floor(i/3)*24,w,h:20,k})); },
 audRects(){ const E=this.EL(), w=(246-5)/2; return G.club.DOCAUDS.map((a,i)=>({x:12+i*(w+5),y:E.audY,w,h:22,a})); },
 openEditor(d){
  const C=G.club; if(!C.canEditDocs()) return;
  if(d&&d.kind==='text'&&this.body==null){ G.toast('ONE MOMENT - STILL LOADING THE TEXT','#ffd27a'); return; }
  G.removeField('rd'); G.removeField('dl'); G.removeField('web');
  const f=d?{t:d.t,cat:d.cat,v:d.v||'mem',kind:d.kind,url:d.url||'',body:d.kind==='text'?(this.body||''):''}
           :{t:'',cat:'bylaws',v:'mem',kind:'link',url:'',body:''};
  this.ed={id:d?d.id:null,f,err:'',busy:false,from:this.mode};
  this.mode='edit'; this.est={f:0};
  const E=this.EL();
  G.field('dt',{x:12,y:E.titleY,w:246,h:32,max:60,align:'left',placeholder:'e.g. RKFFMC Bylaws',value:f.t,enterHint:'next',
   onInput:()=>{ if(this.ed) this.ed.err=''; },onEnter:()=>G.focusField(this.ed&&this.ed.f.kind==='text'?'db':'du')});
  this.kindFields();
  if(!d) G.focusField('dt');
  AUDIO.sfx('ok');
 },
 kindFields(){
  const ed=this.ed, f=ed.f, E=this.EL();
  if(f.kind==='link'){
   if(G.fields.db){ f.body=G.fieldVal('db'); G.removeField('db'); }
   G.field('du',{x:12,y:E.srcY,w:246,h:32,max:300,type:'url',align:'left',placeholder:'https://drive.google.com/…',value:f.url,primary:false,enterHint:'done',
    onInput:()=>{ ed.err=''; },onEnter:()=>this.saveEditor()});
  } else {
   if(G.fields.du){ f.url=G.fieldVal('du'); G.removeField('du'); }
   G.field('db',{x:12,y:E.srcY,w:246,h:E.bodyH,max:G.club.DOCMAX,multiline:true,align:'left',placeholder:'Type or paste the document…',value:f.body,primary:false,onInput:()=>{ ed.err=''; }});
  }
 },
 closeEditor(){
  for(const id of ['dt','du','db']) G.removeField(id);
  const from=this.ed&&this.ed.from; this.ed=null; this.cache=null;
  if(from==='doc'&&this.doc){ const cur=G.club.docs.find(x=>x.id===this.doc.id); if(cur&&G.club.canSee(cur)){ this.openDoc(cur,true); return; } }
  this.mode='home'; this.doc=null; this.body=null;
 },
 async saveEditor(){
  const ed=this.ed, C=G.club; if(!ed||ed.busy) return;
  const f=ed.f;
  f.t=G.fieldVal('dt').trim();
  if(f.kind==='link') f.url=G.fieldVal('du').trim(); else f.body=G.fieldVal('db');
  if(f.t.length<3){ ed.err='GIVE IT A TITLE (3+ CHARACTERS)'; AUDIO.sfx('buzzer'); G.focusField('dt'); return; }
  if(f.kind==='link'&&!C.cleanUrl(f.url)){ ed.err='PASTE THE DOCUMENT’S WEB LINK (HTTPS://…)'; AUDIO.sfx('buzzer'); G.focusField('du'); return; }
  if(f.kind==='text'&&!String(f.body).trim()){ ed.err='TYPE OR PASTE THE DOCUMENT’S TEXT'; AUDIO.sfx('buzzer'); G.focusField('db'); return; }
  ed.busy=true;
  const id=await C.saveDoc(f,ed.id);
  if(this.ed!==ed) return;
  ed.busy=false;
  if(!id){ ed.err='COULDN’T SAVE - CHECK YOUR CONNECTION'; AUDIO.sfx('buzzer'); return; }
  G.toast((ed.id?'UPDATED: ':'ADDED: ')+f.t.toUpperCase().slice(0,40),'#80ffa0'); AUDIO.sfx('cheer');
  for(const k of ['dt','du','db']) G.removeField(k);
  this.ed=null; this.cache=null;
  const d=C.docs.find(x=>x.id===id);
  if(d){ this.doc=d; this.body=d.kind==='text'?String(f.body).slice(0,C.DOCMAX):null; this.openDoc(d,true); }
  else { this.mode='home'; this.doc=null; this.body=null; }
 },
 updEditor(){
  const ed=this.ed, f=ed.f;
  if(G.backHit()){ this.closeEditor(); return; }
  const ap=this.addBtn(); if(ap&&G.clicked(ap.x,ap.y,ap.w,ap.h)){ this.saveEditor(); return; }
  for(const r of this.catRects()) if(G.clicked(r.x,r.y-2,r.w,r.h+4)){ f.cat=r.k.k; AUDIO.sfx('blip'); return; }
  for(const r of this.audRects()) if(G.clicked(r.x,r.y-2,r.w,r.h+4)){ f.v=r.a.v; AUDIO.sfx('blip'); return; }
  { const E=this.EL(), k=G.segHit(12,E.kindY,246,26,2); if(k>=0){ const nk=k?'text':'link'; if(nk!==f.kind){ f.kind=nk; ed.err=''; this.kindFields(); AUDIO.sfx('blip'); } return; } }
  const id=G.navList(this.est,this.editBtns(),{noKeys:true});
  if(id==='save') this.saveEditor(); else if(id==='cancel') this.closeEditor();
 },
 editBtns(){ const E=this.EL(), ed=this.ed; return [{id:'save',label:ed.busy?'SAVING…':(ed.id?'SAVE CHANGES':'ADD DOCUMENT'),kind:'primary',x:12,y:E.saveY,w:170,h:38,size:8},{id:'cancel',label:'CANCEL',x:188,y:E.saveY,w:70,h:38,size:7.2}]; },
 drawEditor(c){
  const ed=this.ed, f=ed.f, E=this.EL(), C=G.club;
  const lab=(t,y,x)=>G.txt(t,x||12,y-12,6.2,'#b8ad9c','left',undefined,700);
  lab('TITLE',E.titleY); G.rrect(12,E.titleY,246,32,14); c.fillStyle='rgba(0,0,0,.4)'; c.fill();
  lab('CATEGORY',E.catY);
  for(const r of this.catRects()){ const on=r.k.k===f.cat; G.rrect(r.x,r.y,r.w,r.h,10); c.fillStyle=on?r.k.col:'rgba(255,255,255,.07)'; c.fill(); c.strokeStyle=on?r.k.col:'rgba(255,255,255,.18)'; c.lineWidth=1; c.stroke();
   G.txt(r.k.t,r.x+r.w/2,r.y+5,5.8,on?'#14100c':'#e0d6c4','center',r.w-6,800); }
  { const A=this.audRects(), au=C.DOCAUDS.find(a=>a.v===f.v)||C.DOCAUDS[0];
    lab('WHO CAN SEE IT',A[0].y); G.txt(au.d,258,A[0].y-12,5.6,au.col,'right',150,700);
    for(const r of A){ const on=r.a.v===f.v; G.rrect(r.x,r.y,r.w,r.h,11); c.fillStyle=on?r.a.col:'rgba(255,255,255,.07)'; c.fill(); c.strokeStyle=on?r.a.col:'rgba(255,255,255,.2)'; c.lineWidth=1; c.stroke();
     G.txt(r.a.t,r.x+r.w/2,r.y+6,6.6,on?'#10141a':'#e0d6c4','center',r.w-6,800); } }
  lab('THE DOCUMENT',E.kindY);
  G.seg(12,E.kindY,246,26,['A LINK','TEXT IN THE APP'],f.kind==='text'?1:0,7);
  if(f.kind==='link'){
   G.rrect(12,E.srcY,246,32,14); c.fillStyle='rgba(0,0,0,.4)'; c.fill();
   ['PASTE A GOOGLE DRIVE, DROPBOX OR WEBSITE LINK.','SET THE FILE TO “ANYONE WITH THE LINK CAN VIEW”','SO THE MEMBERS WHO SEE IT HERE CAN OPEN IT.']
    .forEach((l,i)=>G.txt(l,VW/2,E.srcY+44+i*12,5.8,i===0?'#cfc4b0':'#9a8f80','center',VW-24,700));
  } else {
   G.rrect(12,E.srcY,246,E.bodyH,14); c.fillStyle='rgba(0,0,0,.4)'; c.fill();
  }
  G.drawBtns(this.editBtns(),this.est);
  if(ed.err) G.txt(ed.err,VW/2,E.saveY-14,6.4,'#ff7a60','center',VW-20,700);
  G.topBar(ed.id?'EDIT DOCUMENT':'NEW DOCUMENT',{size:8.4});
  this.drawAdd(c);
 },
 /* ---------------- club info (the club admin) ---------------- */
 infoItems(){
  const C=G.club, key=[C.ver,'info'].join('|');
  if(this.icache&&this.icache.key===key) return this.icache.items;
  const it=[CL.note(['ONLY THE CLUB ADMIN CAN CHANGE THE CLUB INFO.','APPROVED MEMBERS SEE IT IN THE ADMIN OFFICE.'],'#ffd27a')];
  for(const f of C.INFO) it.push(this.infoRow(f));
  it.push(CL.action('DONE',{kind:'done'},'secondary'));
  CL.layout(it);
  this.icache={key,items:it};
  return it;
 },
 infoRow(f){
  const v=(G.club.info||{})[f.k]||'', vl=v?G.wrap(v.replace(/\s*\n\s*/g,' • '),6.6,206,600).slice(0,2):[], H=v?24+vl.length*10:34;
  return {h:H+6,focus:true,
   draw(c,x,y,w,foc){
    const press=G.held(x,y,w,H);
    G.rrect(x,y+(press?1:0),w,H,10); c.fillStyle=press?'rgba(60,52,72,.96)':'rgba(30,28,40,.95)'; c.fill(); c.strokeStyle=foc?'#ffd060':'rgba(255,255,255,.1)'; c.lineWidth=foc?1.6:1; c.stroke();
    G.txt(f.t,x+12,y+7,5.8,'#ff9a50','left',w-60,800);
    if(v){ let yy=y+18; vl.forEach(l=>{ G.txt(l,x+12,yy,6.6,'#ece2d2','left',w-44,600); yy+=10; }); }
    else G.txt('NOT SET • TAP TO ADD',x+12,y+18,6,'#7f7668','left',w-44,700);
    G.txt('›',x+w-14,y+H/2-7,11,'#ffb060','center',undefined,800);
   },
   tap:()=>({kind:'field',f}),enter:()=>({kind:'field',f})};
 },
 IL(){
  const f=this.inf, y0=70, fh=f.multi?(f.k==='mission'?150:96):36, by=y0+fh+16;
  return {y0,fh,B:[{id:'save',label:this.busy?'SAVING…':'SAVE',kind:'primary',x:12,y:by,w:170,h:38,size:8.5},{id:'cancel',label:'CANCEL',x:188,y:by,w:70,h:38,size:7.2}]};
 },
 openInfoField(f){
  const C=G.club; this.inf=f; this.mode='infoedit'; this.err=''; this.ist={f:0};
  const L=this.IL();
  G.field('iv',{x:12,y:L.y0,w:246,h:L.fh,max:f.max,multiline:!!f.multi,type:f.url?'url':(f.k==='email'?'email':undefined),tel:f.k==='phone',align:'left',
   placeholder:f.ph||'',value:(C.info||{})[f.k]||'',enterHint:'done',onInput:()=>{ this.err=''; },onEnter:()=>this.saveInfo()});
  G.focusField('iv'); AUDIO.sfx('ok');
 },
 closeInfoField(){ G.removeField('iv'); this.inf=null; this.mode='info'; this.err=''; this.icache=null; },
 async saveInfo(){
  const C=G.club, f=this.inf; if(!f||this.busy) return;
  const v=G.fieldVal('iv').trim();
  if(f.url&&v&&!C.cleanUrl(v)){ this.err='THAT DOESN’T LOOK LIKE A WEB LINK'; AUDIO.sfx('buzzer'); return; }
  this.busy=true;
  const ok=await C.saveInfo(f.k,v);
  this.busy=false;
  if(this.inf!==f) return;
  if(!ok){ this.err='COULDN’T SAVE - ONLY THE CLUB ADMIN CAN CHANGE THIS'; AUDIO.sfx('buzzer'); return; }
  G.toast(v?f.t+' SAVED':f.t+' REMOVED','#80ffa0'); AUDIO.sfx('cheer');
  this.closeInfoField();
 },
 updInfo(){
  if(this.mode==='infoedit'){
   if(G.backHit()){ this.closeInfoField(); return; }
   const id=G.navList(this.ist,this.IL().B,{noKeys:true});
   if(id==='save') this.saveInfo(); else if(id==='cancel') this.closeInfoField();
   return;
  }
  const done=()=>{ this.mode='home'; this.cache=null; this.icache=null; this.list.reset(); };
  if(G.backHit()){ done(); return; }
  this.list.update(this.infoItems(),this.area(),a=>{
   if(!a) return;
   if(a.kind==='done'){ AUDIO.sfx('back'); done(); }
   else if(a.kind==='field') this.openInfoField(a.f);
  });
 },
 drawInfo(c){
  if(this.mode==='infoedit'){
   const f=this.inf, L=this.IL();
   G.txt(f.t,12,L.y0-14,6.6,'#ffd060','left',undefined,800);
   G.txt(f.url?'THE CLUB’S OWN SITE • HTTPS://…':(f.multi?'SHORT AND CLEAR • NEW LINES ARE KEPT':'APPROVED MEMBERS SEE THIS'),258,L.y0-14,5.6,'#9a8f80','right',150,700);
   G.rrect(12,L.y0,246,L.fh,14); c.fillStyle='rgba(0,0,0,.4)'; c.fill();
   G.drawBtns(L.B,this.ist);
   const by=L.B[0].y+L.B[0].h+12;
   if(this.err) G.txt(this.err,VW/2,by,6.6,'#ff7a60','center',VW-20,700);
   else G.txt('LEAVE IT EMPTY AND SAVE TO REMOVE IT.',VW/2,by,6,'#8a7f70','center',VW-20,700);
   G.topBar('CLUB INFO',{size:8.6});
   return;
  }
  this.list.draw(c,this.infoItems(),this.area());
  G.topBar('EDIT CLUB INFO',{size:8.4});
 },
 /* ---------------- frame ---------------- */
 /* not an approved member (guest, supporter, waitlist, denied): the members-only lock, and nothing of the office stays up */
 locked(){ return !G.clubAccess().ok; },
 shut(){
  for(const id of ['web','rd','dl','dt','du','db','iv']) G.removeField(id);
  if(this.mode!=='home'||this.doc||this.ed||this.modal){ this.mode='home'; this.doc=null; this.body=null; this.ed=null; this.inf=null; this.modal=null; this.cache=null; this.list.reset(); }
 },
 update(){
  const C=G.club;
  if(this.locked()){ this.shut(); if(G.backHit()){ G.go(this.back); return; } this.lock.update(56); return; }
  if(this.mode==='edit'){ if(!C.canEditDocs()){ this.closeEditor(); return; } this.updEditor(); return; }
  if(this.mode==='info'||this.mode==='infoedit'){ if(!this.canInfo()){ G.removeField('iv'); this.inf=null; this.mode='home'; this.cache=null; return; } this.updInfo(); return; }
  if(this.mode==='doc'){ this.updDoc(); return; }
  if(G.backHit()){ G.removeField('web'); G.go(this.back); return; }
  const ap=this.addBtn(); if(ap&&G.clicked(ap.x,ap.y,ap.w,ap.h)){ this.openEditor(null); return; }
  this.list.update(this.items(),this.area(),a=>this.onAct(a));
  this.placeWeb();
 },
 draw(c){
  const VH=G.VH;
  G.cover(G.img.bg_dining,0,0,VW,VH); G.dim(.9);
  if(this.locked()){ this.lock.draw(c,56); G.topBar('ADMIN OFFICE',{size:8.6}); return; }
  if(this.mode==='edit'){ this.drawEditor(c); return; }
  if(this.mode==='info'||this.mode==='infoedit'){ this.drawInfo(c); return; }
  if(this.mode==='doc'){ this.drawDoc(c); return; }
  this.list.draw(c,this.items(),this.area());
  G.topBar('ADMIN OFFICE',{size:8.6});
  this.drawAdd(c);
 }
};
})();
