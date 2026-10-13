/* Club UI kit (scrolling card lists + the member card) and the ALPHA ROSTER.
   The roster is the approved-member directory: toggle MY BATTALION / ENTIRE CLUB; alphabetical cards with
   headshot, road name, first name + last initial, battalion, cell and last clubhouse login.
   The waitlist and the Admin Console (admin.js) reuse the same cards. */
(function(){
const VW=G.VW;
const CL=G.CL={};
CL.scrollArea=function(st,area,contentH){ // drag + wheel only (arrow keys move the focus instead)
 const max=Math.max(0,contentH-area.h);
 if(G.ptr.down&&G.ptr.sx>=area.x&&G.ptr.sx<=area.x+area.w&&G.ptr.sy>=area.y&&G.ptr.sy<=area.y+area.h) st.scroll=(st.scroll||0)-G.dragDY;
 if(G.wheelDY&&G.hit(area.x,area.y,area.w,area.h)) st.scroll=(st.scroll||0)+G.wheelDY;
 st.scroll=Math.max(0,Math.min(max,st.scroll||0));
};
CL.telHref=function(p,sms){ let d=String(p||'').replace(/\D/g,''); if(d.length===10) d='1'+d; return (sms?'sms:+':'tel:+')+d; };
CL.faceSrc=function(g){ const me=G.activeAcct; if(G.club.isMine(g)&&me.photo) return me.photo; return G.club.face(g.faceId,g.faceV); };
CL.when=function(ts){ return ts?new Date(ts).toLocaleString([],{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}).toUpperCase():'-'; };
CL.day=function(ts){ return ts?new Date(ts).toLocaleDateString([],{month:'short',day:'numeric',year:'numeric'}).toUpperCase():'-'; };
CL.layout=function(items){ let y=0; for(const i of items){ i.y=y; y+=i.h; } return y; };
CL.dots=function(c,x,y,n,of){ for(let i=0;i<of;i++){ c.beginPath(); c.arc(x+i*11,y,4,0,7); c.fillStyle=i<n?'#80ffa0':'rgba(255,255,255,.14)'; c.fill(); } };
CL.hdr=function(t,n,col){ return {h:26,draw:(c,x,y,w)=>{ G.txt(t,x+4,y+9,6.8,col||'#ff9a50','left',w-50,800); if(n!=null) G.txt(String(n),x+w-4,y+9,6.6,'#9a8f80','right',undefined,800); c.fillStyle='rgba(255,255,255,.08)'; c.fillRect(x,y+23,w,1); }}; };
CL.letter=function(L){ return {h:22,draw:(c,x,y,w)=>{ G.txt(L,x+6,y+5,8.5,'#ffd060','left',undefined,800); c.fillStyle='rgba(255,208,96,.2)'; c.fillRect(x+22,y+11,w-26,1); }}; };
CL.note=function(lines,col){ const h=lines.length*13+14; return {h:h+10,draw:(c,x,y,w)=>{ G.rrect(x,y+5,w,h,10); c.fillStyle='rgba(255,255,255,.05)'; c.fill(); c.strokeStyle='rgba(255,255,255,.08)'; c.lineWidth=1; c.stroke(); lines.forEach((l,i)=>G.txt(l,x+w/2,y+13+i*13,6.4,col||'#b8ad9c','center',w-16,700)); }}; };
/* a full-width action row (e.g. "+ NAME A POC") */
CL.action=function(label,act,kind){ return {h:44,focus:true,enter:()=>act,draw(c,x,y,w,foc){ G.button({x,y:y+2,w,h:36,label,kind:kind||'ghost',size:7.8},foc); },tap:()=>act}; };
function roleChips(c,g,x,y){
 let cx=x;
 if(g.adm) cx+=G.chip('ADMIN',cx,y,{size:5.2,col:'#20100a',bg:'#ffd060'})+4;
 if(g.off) cx+=G.chip('OFFICER',cx,y,{size:5.2,col:'#20100a',bg:'#ffb060'})+4;
 if(g.poc) cx+=G.chip('POC',cx,y,{size:5.2,col:'#10202a',bg:'#80e0ff'})+4;
 if(g.b4l) cx+=G.chip('B4L',cx,y,{size:5.2,col:'#20100a',bg:'#e8c060'})+4;
 return cx-x;
}
/* member row: o = {denied, btn:{label,kind,act}, mute} */
CL.member=function(g,o){
 o=o||{};
 return {h:64,g,focus:true,
  draw(c,x,y,w,foc){
   const C=G.club, r=g.r, mine=C.isMine(g), press=G.held(x,y,w,58);
   G.rrect(x,y,w,58,12); c.fillStyle=press?'rgba(60,52,72,.96)':(mine?'rgba(240,120,24,.13)':'rgba(30,28,40,.94)'); c.fill();
   c.strokeStyle=foc?'#ffd060':(mine?'rgba(255,150,60,.45)':'rgba(255,255,255,.1)'); c.lineWidth=foc?2:1; c.stroke();
   if(o.denied){ c.save(); c.globalAlpha=.62; }
   G.drawFace(CL.faceSrc(g),x+8,y+8,42,r.n,g.off?'#ffb060':(g.poc?'#80e0ff':(mine?'#f08a2a':null)));
   const nx=x+58, rw=o.btn?118:92;
   G.txt(r.n,nx,y+8,9,mine?'#ffd060':'#f4ede2','left',rw-20,800);
   roleChips(c,g,nx+Math.min(rw-20,G.tw(r.n,9,800))+5,y+8);
   G.txt([G.nameLine(r),G.bn(r.b)].filter(Boolean).join(' • '),nx,y+25,6.6,'#cfc4b0','left',o.btn?104:112,700);
   if(C.canSeeCell(g)) G.txt('☎ '+C.fmtPhone(r.ph),nx,y+40,6.8,'#9fd8ff','left',o.btn?104:112,700);
   else G.txt('CELL SHOWN AFTER APPROVAL',nx,y+41,5.6,'#7f7668','left',112,700);
   if(o.denied) c.restore();
   if(o.btn) G.button({x:x+w-74,y:y+14,w:66,h:30,label:o.btn.label,kind:o.btn.kind||'ghost',size:6.6});
   else if(o.denied){ G.txt('NOT',x+w-10,y+12,5.6,'#ff9a80','right',undefined,800); G.txt('APPROVED',x+w-10,y+22,5.6,'#ff9a80','right',undefined,800); }
   else { G.txt(mine?'THAT’S YOU':'LAST LOGIN',x+w-10,y+12,5.4,'#7f7668','right',undefined,700);
    G.txt(C.ago(g.ll),x+w-10,y+22,6.4,'#e8dcc8','right',66,800); }
  },
  enter(){ return o.pick||{kind:'open',g}; },
  tap(lx,ly,w){ if(o.btn&&lx>=w-78&&ly>=10&&ly<=48) return o.btn.act; return o.pick||{open:g}; }};
};
/* someone on the waitlist. mode 'decide' = APPROVE / DENY (POCs, officers, admin) | 'ack' = ACKNOWLEDGE (members) */
CL.applicant=function(g,mode){
 const decide=mode==='decide', H=decide?112:104;
 return {h:H+6,g,focus:true,
  draw(c,x,y,w,foc){
   const C=G.club, r=g.r, inf=C.ackInfo(g);
   G.rrect(x,y,w,H,12); c.fillStyle='rgba(18,40,52,.95)'; c.fill();
   c.strokeStyle=foc?'#ffd060':'rgba(128,224,255,.5)'; c.lineWidth=foc?2:1.2; c.stroke();
   G.drawFace(CL.faceSrc(g),x+8,y+8,42,r.n,'#80e0ff');
   if(!r.hp){ G.rrect(x+11,y+40,36,9,4.5); c.fillStyle='rgba(0,0,0,.72)'; c.fill(); G.txt('NO PHOTO',x+29,y+41.2,4.4,'#ff9a70','center',34,800); }
   G.txt(r.n,x+58,y+8,9,'#f4ede2','left',100,800);
   G.txt([G.nameLine(r),G.bn(r.b)].filter(Boolean).join(' • '),x+58,y+25,6.6,'#cfc4b0','left',102,700);
   if(decide) G.txt('☎ '+C.fmtPhone(r.ph),x+58,y+40,6.8,'#9fd8ff','left',102,700);
   else G.txt('SIGNED UP '+C.ago(g.ca),x+58,y+41,6,'#9a8f80','left',102,700);
   if(decide){ G.txt('SIGNED UP',x+w-10,y+8,5.4,'#7f7668','right',undefined,700); G.txt(C.ago(g.ca),x+w-10,y+17,6.2,'#e8dcc8','right',70,800); }
   G.txt('AUTO-APPROVES',x+w-10,y+(decide?31:10),5.4,'#d8b050','right',undefined,700);
   G.txt('IN '+C.fmtLeft(g.left||0),x+w-10,y+(decide?40:19),6.2,'#ffd27a','right',70,800);
   // acknowledgment progress
   const py=decide?y+60:y+60;
   CL.dots(c,x+16,py,inf.n,C.ACKS);
   G.txt(inf.n+' OF '+C.ACKS+' ACKNOWLEDGED'+(inf.names.length?' • '+inf.names.join(', '):''),x+16+C.ACKS*11+4,py-4.5,5.8,inf.n?'#a8ffc0':'#9a8f80','left',w-60,700);
   const by=y+H-34, bw=(w-24)/2;
   if(decide){
    G.button({x:x+8,y:by,w:bw,h:28,label:'✓ APPROVE',kind:'success',size:7.5});
    G.button({x:x+16+bw,y:by,w:bw,h:28,label:'DENY',kind:'danger',size:7.5});
   } else if(inf.mine) G.button({x:x+8,y:by,w:w-16,h:28,label:'✓ YOU ACKNOWLEDGED • TAP TO UNDO',kind:'ghost',size:7});
   else G.button({x:x+8,y:by,w:w-16,h:28,label:'ACKNOWLEDGE: I KNOW THIS RIDER',kind:'primary',size:7.5});
  },
  tap(lx,ly,w){
   if(ly>=H-36&&ly<=H-4){
    if(decide) return {kind:lx<w/2?'approve':'deny',g};
    return {kind:G.club.ackInfo(g).mine?'unack':'ack',g};
   }
   return {kind:'open',g};
  }};
};

/* ---------- list controller: drag/wheel scroll, arrow-key focus, Enter, taps ---------- */
CL.List=function(){
 /* g0: the gesture that brought this list up (opened, reset or switched to it) - its finger-lift is not a tap on a row */
 return { sc:{scroll:0}, f:-1, g0:G.gestureId,
  reset(){ this.sc.scroll=0; this.f=-1; this.g0=G.gestureId; },
  update(items,area,onAct){
   const H=CL.layout(items)+8;
   CL.scrollArea(this.sc,area,H);
   const F=items.map((it,i)=>it.focus?i:-1).filter(i=>i>=0);
   if(F.length&&(G.pressed.up||G.pressed.down)){
    let k=F.indexOf(this.f);
    k=k<0?(G.pressed.down?0:F.length-1):Math.max(0,Math.min(F.length-1,k+(G.pressed.down?1:-1)));
    this.f=F[k]; const it=items[this.f];
    if(it.y<this.sc.scroll) this.sc.scroll=it.y;
    if(it.y+it.h>this.sc.scroll+area.h) this.sc.scroll=it.y+it.h-area.h;
    if(k===0) this.sc.scroll=0;
    AUDIO.sfx('blip');
   }
   if(G.pressed.a&&items[this.f]&&items[this.f].focus){ const it=items[this.f]; onAct(it.enter?it.enter():(it.g?{kind:'open',g:it.g,open:it.g}:null)); return; }
   if(G.tapped(area.x,area.y,area.w,area.h)&&G.gestureId!==this.g0){
    const yy=G.ptr.rsy-area.y+this.sc.scroll;
    const it=items.find(i=>yy>=i.y&&yy<i.y+i.h);
    if(it&&it.tap){ this.f=items.indexOf(it); onAct(it.tap(G.ptr.rsx-area.x-8,yy-it.y,area.w-16)); }
   }
  },
  draw(c,items,area){
   const H=CL.layout(items)+8, top=area.y, bot=area.y+area.h;
   c.save(); c.beginPath(); c.rect(area.x,top,area.w,area.h); c.clip();
   for(let i=0;i<items.length;i++){
    const it=items[i], y=top+it.y-this.sc.scroll;
    if(y>bot||y+it.h<top) continue;
    it.draw(c,area.x+8,y,area.w-16,G.kbMode&&this.f===i);
   }
   c.restore();
   G.scrollBar({x:area.x,y:top,w:area.w-2,h:area.h},H,this.sc.scroll);
  }
 };
};

/* ---------- the member card (detail) with every action: call/text, approve/deny, acknowledge, POC, officer ---------- */
function byLine(g){
 const C=G.club;
 if(g.adm) return 'CLUB ADMIN • RUNS THE MOBILE CLUBHOUSE';
 if(g.off) return 'CLUB OFFICER • APPOINTED BY THE CLUB ADMIN';
 if(g.poc) return 'BATTALION POC • APPROVES NEW '+G.bn(g.r.b)+' MEMBERS';
 if(g.st==='tentative') return 'ON THE WAITLIST • AUTO-APPROVES IN '+C.fmtLeft(g.left||0);
 if(g.st==='denied'){ const s=g.ids.map(id=>C.status[id]).find(Boolean); return 'NOT APPROVED'+(s&&s.by?' BY '+s.by:''); }
 if(g.wit&&g.wit.length) return 'APPROVED BY '+g.by+': '+g.wit.join(', ');
 if(g.by) return 'APPROVED BY '+g.by;
 return 'APPROVED AUTOMATICALLY AFTER 72 HRS';
}
const ASK={
 deny:g=>({t:'DENY '+g.r.n+'?',l:['THEY’LL BE LOCKED OUT OF THE ROSTER,','CHATS AND CLUB BOARDS.','YOU CAN APPROVE THEM LATER.'],y:'DENY',n:'KEEP PENDING',danger:true}),
 revoke:g=>({t:'REVOKE '+g.r.n+'?',l:['THEY’LL BE LOCKED OUT OF THE ROSTER,','CHATS AND CLUB BOARDS.','YOU CAN APPROVE THEM LATER.'],y:'REVOKE',n:'KEEP APPROVED',danger:true}),
 ack:g=>({t:'ACKNOWLEDGE '+g.r.n+'?',l:['ONLY IF YOU KNOW THIS RIDER AND THEY','BELONG IN '+(G.bn(g.r.b)||'YOUR BATTALION')+'. '+G.club.ACKS+' MEMBER','ACKNOWLEDGMENTS APPROVE THEM.'],y:'I KNOW THIS RIDER',n:'CANCEL'}),
 poc:g=>({t:'MAKE '+g.r.n+' A POC?',l:['BATTALION POCS APPROVE OR DENY NEW','MEMBERS OF '+(G.bn(g.r.b)||'THEIR BATTALION')+' FROM THE','ADMIN CONSOLE.'],y:'MAKE '+(G.bn(g.r.b)||'BATTALION')+' POC',n:'CANCEL'}),
 unpoc:g=>({t:'REMOVE '+g.r.n+' AS POC?',l:['THEY KEEP THEIR MEMBERSHIP.'],y:'REMOVE POC',n:'CANCEL',danger:true}),
 officer:g=>({t:'APPOINT '+g.r.n+'?',l:['CLUB OFFICERS APPROVE OR DENY ANY','BATTALION AND NAME POCS. ONLY YOU','CAN APPOINT OR REMOVE OFFICERS.'],y:'APPOINT OFFICER',n:'CANCEL'}),
 unofficer:g=>({t:'REMOVE '+g.r.n+' AS OFFICER?',l:['THEY KEEP THEIR MEMBERSHIP.'],y:'REMOVE OFFICER',n:'CANCEL',danger:true})
};
G.MemberCard=function(o){
 o=o||{};
 const hide=()=>{ if(o.hide) o.hide(); }, show=()=>{ if(o.show) o.show(); };
 return { g:null, st:{f:0}, lk:'', confirm:null, busy:false,
  active(){ return !!(this.g||this.confirm); },
  open(g){ this.g=g; this.st={f:0}; this.lk=''; hide(); AUDIO.sfx('ok'); },
  close(){ G.removeField('call'); G.removeField('sms'); this.g=null; this.confirm=null; show(); },
  rows(){
   const g=this.g, C=G.club, b=G.bn(g.r.b)||'BATTALION', R=[];
   if(C.canSeeCell(g)&&!C.isMine(g)&&String(g.r.ph||'').replace(/\D/g,'').length>=7) R.push([{id:'call',label:'CALL',kind:'primary'},{id:'sms',label:'TEXT'}]);
   if(C.canDecide(g)){
    if(g.st==='tentative') R.push([{id:'approve',label:'✓ APPROVE',kind:'success'},{id:'deny',label:'DENY',kind:'danger'}]);
    else if(g.st==='approved') R.push([{id:'revoke',label:'REVOKE APPROVAL',kind:'danger'}]);
    else R.push([{id:'approve',label:'✓ APPROVE',kind:'success'}]);
   } else if(C.canAck(g)) R.push([C.ackInfo(g).mine?{id:'unack',label:'UNDO MY ACKNOWLEDGMENT',kind:'ghost'}:{id:'ack',label:'ACKNOWLEDGE: I KNOW THIS RIDER',kind:'primary'}]);
   if(C.canManage()&&g.st!=='denied'&&!C.isMine(g)&&!g.adm){
    const row=[{id:g.poc?'unpoc':'poc',label:g.poc?'REMOVE POC':'MAKE '+b+' POC',kind:'ghost'}];
    if(C.admin) row.push({id:g.off?'unofficer':'officer',label:g.off?'REMOVE OFFICER':'MAKE OFFICER',kind:'ghost'});
    R.push(row);
   }
   R.push([{id:'close',label:'CLOSE'}]);
   return R;
  },
  info(){
   const g=this.g, C=G.club, r=g.r, I=[['CELL',C.canSeeCell(g)?C.fmtPhone(r.ph):'SHOWN AFTER APPROVAL'],['LAST LOGIN',C.isMine(g)?'RIGHT NOW':CL.when(g.ll)],[g.st==='approved'?'MEMBER SINCE':'SIGNED UP',CL.day(g.ca)]];
   if(g.st==='tentative'){ const a=C.ackInfo(g); I.push(['ACKNOWLEDGED',a.n+' OF '+C.ACKS+(a.names.length?' • '+a.names.join(', '):'')]); }
   if(g.b4l) I.push(['BROTHER FOR LIFE','SINCE '+C.b4lDate(g.b4l.d)]);
   return I;
  },
  L(){
   const W=246, X=(VW-W)/2, R=this.rows(), I=this.info(), bh=34, gap=8;
   const top=184+I.length*17+6, h=top+R.length*(bh+gap)+6;
   const y=Math.max(46,Math.round((G.VH-h)/2)), B=[];
   R.forEach((row,ri)=>{ const n=row.length, bw=(W-28-(n-1)*8)/n;
    row.forEach((b,k)=>B.push(Object.assign({x:X+14+k*(bw+8),y:y+top+ri*(bh+gap),w:bw,h:bh,size:7.6},b))); });
   return {x:X,y,w:W,h,B,I};
  },
  placeLinks(){
   if(!this.g) return;
   const L=this.L(), call=L.B.find(b=>b.id==='call'), sms=L.B.find(b=>b.id==='sms');
   const k=call&&!this.confirm?call.y+':'+this.g.key:'none';
   if(k===this.lk) return; this.lk=k;
   G.removeField('call'); G.removeField('sms');
   if(k==='none') return;
   const g=this.g;
   G.linkField('call',{href:CL.telHref(g.r.ph),x:call.x,y:call.y,w:call.w,h:call.h,label:'Call '+g.r.n,onTap:()=>AUDIO.sfx('ok')});
   G.linkField('sms',{href:CL.telHref(g.r.ph,true),x:sms.x,y:sms.y,w:sms.w,h:sms.h,label:'Text '+g.r.n,onTap:()=>AUDIO.sfx('ok')});
  },
  /* entry point for list buttons and the card's own buttons */
  act(a){
   if(!a) return;
   if(a.open) return this.open(a.open);
   const kind=a.kind, g=a.g; if(!g) return;
   if(kind==='open') return this.open(g);
   if(kind==='approve'||kind==='unack') return this.run(kind,g);
   const q=ASK[kind]; if(!q) return;
   const m=q(g);
   this.confirm=G.Modal({title:m.t,titleCol:m.danger?'#ff8060':'#ffd060',lines:m.l.map((t,i)=>[t,i===m.l.length-1&&m.l.length>1?'#9a8f80':'#cfc4b0',7]),
    btns:[{id:'yes',label:m.y,kind:m.danger?'danger':'primary'},{id:'no',label:m.n}]});
   this.confirm.kind=kind; this.confirm.g=g;
   this.lk=''; G.removeField('call'); G.removeField('sms'); hide();
  },
  async run(kind,g){
   if(this.busy) return; this.busy=true;
   const C=G.club; let ok=false, msg='', col='#80ffa0', sfx='cheer';
   if(kind==='approve'){ ok=await C.decide(g,'approved'); msg=g.r.n+' APPROVED - WELCOME TO THE CLUB'; }
   else if(kind==='deny'||kind==='revoke'){ ok=await C.decide(g,'denied'); msg=g.r.n+' NOT APPROVED'; col='#ff8a70'; sfx='back'; }
   else if(kind==='ack'){ ok=await C.acknowledge(g); const n=Math.min(C.ACKS,C.ackInfo(g).n); msg=n>=C.ACKS?g.r.n+' IS APPROVED - '+C.ACKS+' MEMBERS VOUCHED':'YOU ACKNOWLEDGED '+g.r.n+' ('+n+' OF '+C.ACKS+')'; }
   else if(kind==='unack'){ ok=await C.unacknowledge(g); msg='ACKNOWLEDGMENT REMOVED'; col='#ffd27a'; sfx='back'; }
   else if(kind==='poc'||kind==='unpoc'){ ok=await C.setPoc(g,kind==='poc'); msg=kind==='poc'?g.r.n+' IS NOW '+(G.bn(g.r.b)||'BATTALION')+' POC':g.r.n+' IS NO LONGER A POC'; col=kind==='poc'?'#80e0ff':'#ffd27a'; }
   else if(kind==='officer'||kind==='unofficer'){ ok=await C.setOfficer(g,kind==='officer'); msg=kind==='officer'?g.r.n+' IS NOW A CLUB OFFICER':g.r.n+' IS NO LONGER AN OFFICER'; col=kind==='officer'?'#ffb060':'#ffd27a'; }
   this.busy=false;
   if(!ok){ G.toast(kind.indexOf('officer')>=0?'COULDN’T SAVE - ONLY THE CLUB ADMIN APPOINTS OFFICERS':'COULDN’T SAVE - CHECK YOUR CONNECTION','#ff7030'); AUDIO.sfx('buzzer'); return; }
   G.toast(msg,col); AUDIO.sfx(sfx);
   if(o.changed) o.changed();
  },
  /* returns true when the card (or a confirm) took this frame's input */
  update(){
   if(this.confirm){
    const r=this.confirm.update();
    if(r==='no'||(r==null&&G.pressed.b)){ this.confirm=null; if(!this.g) show(); return true; }
    if(r==='yes'){ const k=this.confirm.kind, g=this.confirm.g; this.confirm=null; if(!this.g) show(); this.run(k,g); }
    return true;
   }
   if(!this.g) return false;
   const fresh=G.club.people().find(x=>x.key===this.g.key); if(fresh) this.g=fresh;
   this.placeLinks();
   if(G.backHit()){ this.close(); return true; }
   const L=this.L(), id=G.navList(this.st,L.B,{both:true});
   if(id==='close'){ this.close(); return true; }
   if(id==='call'||id==='sms'){ const f=G.fields[id]; if(f) try{ f.el.click(); }catch(e){} }
   else if(id==='revoke') this.act({kind:'revoke',g:this.g});
   else if(id) this.act({kind:id,g:this.g});
   if(!id&&G.ptr.click&&!G.hit(L.x,L.y,L.w,L.h)) this.close();
   return true;
  },
  draw(c){
   if(this.g){
    const g=this.g, r=g.r, L=this.L(), C=G.club, X=L.x, W=L.w, y=L.y;
    G.dim(.66);
    G.panel(X,y,W,L.h,{border:g.st==='tentative'?'rgba(128,224,255,.8)':(g.st==='denied'?'rgba(255,120,90,.7)':undefined)});
    G.drawFace(CL.faceSrc(g),VW/2-42,y+14,84,r.n,g.off?'#ffb060':(g.poc?'#80e0ff':'#f08a2a'));
    G.txtO(r.n,VW/2,y+106,12,'#ffd060','center',W-20);
    G.txt([G.nameLine(r),G.bn(r.b)].filter(Boolean).join(' • '),VW/2,y+127,7.5,'#e8dcc8','center',W-20,700);
    const ST={approved:'✓ APPROVED',tentative:'ON THE WAITLIST',denied:'NOT APPROVED'}[g.st];
    const SC={approved:['#a8ffc0','rgba(60,160,90,.18)'],tentative:['#80e0ff','rgba(60,140,200,.18)'],denied:['#ffb0a0','rgba(200,70,50,.2)']}[g.st];
    const chips=[[ST,SC]]; if(g.adm) chips.push(['CLUB ADMIN',['#20100a','#ffd060']]); if(g.off) chips.push(['CLUB OFFICER',['#20100a','#ffb060']]); if(g.poc) chips.push(['BATTALION POC',['#10202a','#80e0ff']]);
    if(g.pos) chips.push([C.posTitle(g.pos),['#20100a','#ffe08a']]); if(g.b4l) chips.push(['B4L',['#20100a','#e8c060']]);
    let cs=6; const fit=()=>chips.reduce((s,ch)=>s+G.tw(ch[0],cs,700)+14,0)+(chips.length-1)*6;
    if(fit()>W-16&&chips.length>1&&g.st==='approved') chips.shift();   // approved is implied by the titles
    while(fit()>W-16&&cs>4.8) cs-=.2;
    let cx=VW/2-fit()/2;
    chips.forEach(ch=>{ G.chip(ch[0],cx,y+144,{size:cs,col:ch[1][0],bg:ch[1][1]}); cx+=G.tw(ch[0],cs,700)+14+6; });
    G.txt(byLine(g),VW/2,y+166,6,'#9a8f80','center',W-20,700);
    L.I.forEach((row,i)=>{ const ry=y+184+i*17;
     if(i%2===0){ G.rrect(X+10,ry-3,W-20,16,6); c.fillStyle='rgba(255,255,255,.04)'; c.fill(); }
     G.txt(row[0],X+18,ry,6.4,'#9a8f80','left',undefined,700);
     G.txt(row[1],X+W-18,ry,row[0]==='CELL'&&row[1].indexOf('SHOWN')===0?6:7,i===0?'#9fd8ff':'#f4ede2','right',W-110,800); });
    G.drawBtns(L.B,this.st);
    if(this.busy) G.txt('SAVING…',VW/2,y+L.h-12,6,'#ffd060','center');
   }
   if(this.confirm) this.confirm.draw(c);
  }
 };
};

/* ============================ ALPHA ROSTER ============================ */
const LIST_Y=140;
const SEG={x:8,y:48,w:254,h:30};
G.scenes.roster={
 enter(a){
  this.lock=G.LockPanel();
  if(this.scope==null) this.scope=0; // 0 = my battalion, 1 = entire club (remembered while the page is open)
  if(this.sort==null) this.sort=0;   // 0 = road name, 1 = first name
  this.list=CL.List(); this.cache=null;
  this.card=G.MemberCard({hide:()=>this.qVis(false),show:()=>this.qVis(true),changed:()=>{ this.cache=null; }});
  this.locked=!G.clubAccess().ok;
  if(!this.locked) this.mkSearch();
 },
 exit(){ this.card=null; },
 qVis(v){ const q=G.fields.q; if(!q) return; if(!v) q.el.blur(); q.el.style.visibility=v?'visible':'hidden'; },
 mkSearch(){
  G.field('q',{x:8,y:84,w:254,h:32,fs:.32,max:24,upper:true,strip:/[^A-Z0-9 \-'.]/g,align:'left',placeholder:'SEARCH NAME OR NUMBER',enterHint:'search',
   onInput:()=>{ this.list.reset(); this.cache=null; },onEnter:()=>G.blurFields()});
 },
 query(){ return G.fieldVal('q').trim(); },
 match(g,q){
  if(!q) return true;
  const r=g.r, digits=q.replace(/\D/g,'');
  if(String(r.n||'').toUpperCase().indexOf(q)>=0) return true;
  if(String(r.f||'').toUpperCase().indexOf(q)>=0) return true;
  if(String(r.b||'').toUpperCase().indexOf(q)>=0) return true;
  return digits.length>=3&&String(r.ph||'').replace(/\D/g,'').indexOf(digits)>=0;
 },
 items(){
  const C=G.club, q=this.query();
  const key=[C.ver,Math.floor(Date.now()/20000),this.scope,this.sort,q,C.rosterState,C.readOnly,C.loaded.sups].join('|');
  if(this.cache&&this.cache.key===key) return this.cache.items;
  const me=G.activeAcct, myBk=C.myBk(), it=[];
  if(!C.db){
   it.push(CL.note(C.rosterState==='connecting'?['CONNECTING TO THE CLUB NETWORK…']:['THE ALPHA ROSTER NEEDS THE CLUB NETWORK.','GAMES AND YOUR RIDE LOG STILL WORK.'],'#ffd27a'));
  } else if(C.readOnly){
   it.push(CL.note(['YOUR ACCESS TO THIS ARCADE IS VIEW-ONLY,','SO THE CLUB NETWORK IS OFF FOR YOU.','ASK THE CLUB ADMIN FOR MEMBER ACCESS.'],'#ffd27a'));
  } else if(C.rosterState!=='live'){
   it.push(CL.note(['LOADING THE ROSTER…'],'#cfc4b0'));
  } else if(this.scope===2){
   // friends & family who signed up as supporters (username + location only)
   const S=C.sups.filter(x=>!q||String(x.n).toUpperCase().indexOf(q)>=0||String(x.loc||'').toUpperCase().indexOf(q)>=0).sort((a,b)=>String(a.n).localeCompare(String(b.n)));
   for(const x of S) it.push(this.supItem(x));
   if(!S.length) it.push(CL.note(q?['NO SUPPORTERS MATCH “'+q+'”.']:(C.loaded.sups?['NO SUPPORTERS YET.','FRIENDS & FAMILY CAN SIGN UP AS SUPPORTERS.']:['LOADING SUPPORTERS…'])));
   it.push(CL.note(['SUPPORTERS SEE PUBLIC NEWS, EVENTS AND THE GAMES.','THEY NEVER SEE THE ROSTER OR THE CHATS.']));
  } else {
   const sortKey=g=>String(this.sort?(g.r.f||g.r.n):g.r.n).toUpperCase();
   const M=C.people().filter(g=>g.st==='approved'&&(this.scope===1||C.sameBatt(g.r.bk,myBk))&&this.match(g,q))
    .sort((a,b)=>sortKey(a).localeCompare(sortKey(b)));
   let last='';
   for(const g of M){ const k=sortKey(g), L=/[A-Z]/.test(k[0]||'')?k[0]:'#'; if(L!==last){ it.push(CL.letter(L)); last=L; } it.push(CL.member(g)); }
   if(!M.length) it.push(CL.note(q?['NO MEMBERS MATCH “'+q+'”.']:(this.scope===0?['NO APPROVED MEMBERS IN '+(G.bn(me.battalion)||'YOUR BATTALION')+' YET.','TRY ENTIRE CLUB.']:['NO APPROVED MEMBERS YET.'])));
   it.push(CL.note(['MEMBERS ONLY • DON’T SHARE NUMBERS OUTSIDE THE CLUB','LAST LOGIN = LAST PIN LOGIN TO THE MOBILE CLUBHOUSE']));
  }
  CL.layout(it);
  this.cache={key,items:it};
  return it;
 },
 supItem(x){
  const C=G.club;
  return {h:50,draw(c,x0,y,w){
   G.rrect(x0,y,w,44,10); c.fillStyle='rgba(30,28,40,.94)'; c.fill(); c.strokeStyle='rgba(255,154,208,.25)'; c.lineWidth=1; c.stroke();
   c.beginPath(); c.arc(x0+22,y+22,14,0,7); c.fillStyle='rgba(255,154,208,.14)'; c.fill(); G.icon('heart',c,x0+22,y+23,14,'#ff9ad0');
   G.drawPersonName({n:x.n,t:'sup',f:x.f},x0+44,y+7,8.4,'#f4ede2',w-130);
   G.txt(x.loc||'—',x0+44,y+24,6.4,'#cfc4b0','left',w-130,700);
   G.chip('SUPPORTER',x0+w-8,y+6,{align:'right',size:5.4,col:'#ffb8dc',bg:'rgba(255,154,208,.14)'});
   G.txt('SEEN '+C.ago(x.ll||x.u),x0+w-8,y+27,5.6,'#9a8f80','right',90,700);
  }};
 },
 infoLine(){
  const C=G.club, me=G.activeAcct, myBk=C.myBk();
  if(this.scope===2) return 'SUPPORTERS • '+C.sups.length+' FRIENDS & FAMILY';
  const P=C.people().filter(g=>g.st==='approved');
  if(this.scope===1){ const nb=new Set(P.map(g=>String(g.r.bk).replace(/-/g,''))).size; return 'ENTIRE CLUB • '+P.length+' MEMBER'+(P.length===1?'':'S')+' • '+nb+' BATTALION'+(nb===1?'':'S'); }
  const mine=P.filter(g=>C.sameBatt(g.r.bk,myBk)), pocs=mine.filter(g=>g.poc).map(g=>g.r.n);
  return (G.bn(me.battalion)||'MY BATTALION')+' • '+mine.length+' MEMBER'+(mine.length===1?'':'S')+(pocs.length?' • POC: '+pocs.join(', '):' • NO POC YET');
 },
 sortChip(){ const t=this.sort?'A-Z: FIRST NAME':'A-Z: ROAD NAME'; const w=G.tw(t,5.8,700)+14; return {x:VW-8-w,y:121,w,h:15.5,t}; },
 waitBtn(){
  const C=G.club, n=C.people().filter(g=>g.st==='tentative'&&C.sameBatt(g.r.bk,C.myBk())&&!C.isMine(g)).length;
  const t='WAITLIST'+(n?' '+n:''); const w=G.tw(t,7,800)+22;
  return {x:VW-6-w,y:8,w,h:25,t,n};
 },
 update(dt){
  if(this.locked){
   if(G.backHit()){ G.go('club'); return; }
   if(G.clubAccess().ok){ this.locked=false; this.mkSearch(); return; } // approval came through while open
   this.lock.update(56);
   return;
  }
  if(!G.clubAccess().ok){ this.card.close(); G.removeField('q'); this.locked=true; return; }
  if(this.card.update()) return;
  if(G.backHit()){ G.go('club'); return; }
  const wb=this.waitBtn();
  if(G.clicked(wb.x,wb.y,wb.w,wb.h)){ AUDIO.sfx('ok'); G.go('waitlist',{back:'roster'}); return; }
  const t=G.segHit(SEG.x,SEG.y,SEG.w,SEG.h,3);
  if(t>=0&&t!==this.scope){ this.scope=t; this.list.reset(); AUDIO.sfx('blip'); }
  if((G.pressed.left||G.pressed.right)&&!G.fieldFocused('q')){ this.scope=(this.scope+(G.pressed.left?2:1))%3; this.list.reset(); AUDIO.sfx('blip'); }
  const sc=this.sortChip();
  if(G.clicked(sc.x-4,sc.y-4,sc.w+8,sc.h+8)){ this.sort=1-this.sort; this.list.reset(); AUDIO.sfx('blip'); }
  this.list.update(this.items(),{x:0,y:LIST_Y,w:VW,h:G.VH-LIST_Y-6},a=>this.card.act(a));
 },
 draw(c){
  const VH=G.VH, C=G.club;
  G.cover(G.img.bg_dining,0,0,VW,VH); G.dim(.88);
  if(this.locked){ G.topBar('ALPHA ROSTER'); this.lock.draw(c,56); return; }
  const me=G.activeAcct;
  G.seg(SEG.x,SEG.y,SEG.w,SEG.h,[G.bs(me.battalion)||'MY BATT','ENTIRE CLUB','SUPPORTERS'],this.scope,6.6);
  G.rrect(8,84,254,32,14); c.fillStyle='rgba(0,0,0,.35)'; c.fill();
  const live=C.rosterState==='live'&&C.db&&!C.readOnly;
  if(live){
   const sc=this.sortChip();
   G.txt(this.infoLine(),10,124,6,'#b8ad9c','left',sc.x-16,700);
   G.rrect(sc.x,sc.y,sc.w,sc.h,sc.h/2); c.fillStyle='rgba(240,120,24,.14)'; c.fill(); c.strokeStyle='rgba(255,150,60,.55)'; c.lineWidth=1; c.stroke();
   G.txt(sc.t,sc.x+sc.w/2,sc.y+3.6,5.8,'#ffb060','center',undefined,700);
  }
  this.list.draw(c,this.items(),{x:0,y:LIST_Y,w:VW,h:VH-LIST_Y-6});
  G.topBar('ALPHA ROSTER');
  if(live){ const wb=this.waitBtn(), press=G.held(wb.x,wb.y,wb.w,wb.h);
   G.rrect(wb.x,wb.y+(press?1:0),wb.w,wb.h,12.5); c.fillStyle=wb.n?'rgba(128,224,255,.22)':'rgba(255,255,255,.07)'; c.fill();
   c.strokeStyle=wb.n?'rgba(128,224,255,.85)':'rgba(255,255,255,.25)'; c.lineWidth=1.2; c.stroke();
   G.txt(wb.t,wb.x+wb.w/2,wb.y+7.5+(press?1:0),7,wb.n?'#bff0ff':'#cfc4b0','center',undefined,800); }
  this.card.draw(c);
 }
};
})();
