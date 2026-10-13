/* Club network over the page's shared database. Only people the owner shares the arcade with
   at member level can read or write any of it; viewers and public-link visitors see nothing.
   - roster/<id>:   Alpha Roster card - first name, last initial, road name, battalion, cell, joined, last login
   - faces/<id>:    the member's headshot
   - status/<id>:   approval decision {st:'approved'|'denied', by, at}; no decision = TENTATIVE (on the waitlist)
   - acks/<applicant>~<member>: "I know this rider" - 3 from approved members of the applicant's battalion approve them
   - pocs/<id>:     battalion points of contact (named by the club admin or a club officer)
   - officers/<id>: club officers (only the club admin - the arcade's owner - can appoint; enforced by Claude's sharing rules)
   - board/<id>:    points + real miles for the Battalion / Nationwide boards
   - pos/<id>:      a member's OFFICIAL POSITION (President, Vice President, Road Captain...) once their POC, a club officer or
                    the club admin confirms it. A position picked at sign-up (roster.pc) is only a claim until then.
   - noms/<id>:     anonymous nominations for a position - who nominated is never stored. Reviewed by the club admin,
                    club officers and the nominee's battalion POC.
   - b4l/<id>:      Brothers for Life with the date the title was granted (only the club admin can write; enforced by
                    Claude's sharing rules)
   - ann/<id>:      announcements, each with an audience v: 'pub' (everyone, supporters too) | 'mem' (approved members) |
                    'off' (club admin, officers, POCs and confirmed position holders). Older posts without v are 'mem'.
   - events/<id>:   ON THE HORIZON calendar entries (rides, benefits, fundraisers, key dates...) with the same audiences
   - sup/<id>:      supporter accounts (friends & family): username + location only.
   - config/links:  payment + shop links (only the club admin can write); config/info: the club's formal info for the
                    ADMIN OFFICE (legal name, founded, mission, contact, EIN, meetings - only the club admin can write)
   - docs/<id>:     ADMIN OFFICE documents (bylaws, minutes, policies, forms...) for MEMBERS or OFFICERS; a LINK (Drive,
                    Dropbox, a website) or TEXT kept in the app. docb/<id> holds a text document's body.
                    The Admin Office (club info + documents) is for approved members only: nobody else downloads it.
   A tentative member is approved by: their battalion POC or a club officer/admin, OR 3 acknowledgments from approved
   members of their battalion, OR automatically 72 hours after sign-up. A POC/officer/admin "deny" always wins.
   WHO SEES WHAT: guests get the games, PUBLIC news/events, the shop and the donate link. Supporters and members still
   on the waitlist also VIEW positions, Brothers for Life and the boards (read-only, from the pos / b4l / board docs -
   never the roster) and sit at the club's blackjack table. The Alpha Roster, the chats, members/officers posts and the
   Admin Office (club info + documents) are for approved members only. */
(function(){
const H72=72*3600*1000, ACKS=3;
function monthKey(){ const d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0'); }
const C=G.club={db:null,state:'connecting',rosterState:'connecting',board:[],roster:[],rosterMap:{},status:{},pocs:[],officers:[],acks:[],
 faces:{},faceBusy:0,facePushed:{},readOnly:false,admin:false,pending:false,dirty:false,last:0,lastSig:'',monthKey,H72,ACKS,
 anns:[],links:{},info:{},docs:[],docBodies:{},lastAnnN:-1,events:[],sups:[],pubSubs:[],supSubs:[],
 names:[],closeOut:[],closeIn:[],myPhacc:null,phacc:[],acctSubs:[],acctKey:'',thumbs:{},thumbBusy:0,fulls:{},lastCloseN:-1,lastPhReqN:-1,lastPhAcc:'',
 pos:{},noms:[],b4l:[],b4lByKey:{},b4lByAid:{},nomSub:null,offSubs:[],offMsgT:0,offPollT:0,offN:0,lastPosN:-1,lastOffT:-1,
 lastPendingN:-1,lastAckN:-1,lastMyAckN:-1,loaded:{roster:false,status:false,pocs:false,officers:false,acks:false,anns:false,links:false,pos:false,noms:false,b4l:false,events:false,sups:false,info:false,docs:false,names:false,closeA:false,closeB:false,phacc:false,phaccAll:false},
 ver:0,pocIds:new Set(),officerIds:new Set(),initializing:true,subs:[],mineSub:null,mineFor:null,finalizing:{}};
C.battKey=function(b){ return String(b||'').toUpperCase().trim().replace(/[^A-Z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,24)||'NONE'; };
/* loose battalion match so SC-1, SC 1 and SC1 land together */
C.sameBatt=function(a,b){ return String(a||'').replace(/-/g,'')===String(b||'').replace(/-/g,''); };
C.fmtLeft=function(ms){ const h=Math.max(1,Math.ceil(ms/3600000)), d=Math.floor(h/24), r=h%24; return h<24?h+'H':(r?d+'D '+r+'H':d+(d===1?' DAY':' DAYS')); };
C.fmtPhone=function(p){
 const d=String(p||'').replace(/\D/g,'');
 if(d.length===10) return '('+d.slice(0,3)+') '+d.slice(3,6)+'-'+d.slice(6);
 if(d.length===11&&d[0]==='1') return '+1 ('+d.slice(1,4)+') '+d.slice(4,7)+'-'+d.slice(7);
 return d||'-';
};
C.ago=function(ts){
 if(!ts) return 'NEVER';
 const m=Math.floor((Date.now()-ts)/60000);
 if(m<2) return 'JUST NOW';
 if(m<60) return m+' MIN AGO';
 const h=Math.floor(m/60); if(h<24) return h+(h===1?' HR AGO':' HRS AGO');
 const d=Math.floor(h/24); if(d<7) return d===1?'YESTERDAY':d+' DAYS AGO';
 return new Date(ts).toLocaleDateString([],{month:'short',day:'numeric',year:d>300?'numeric':undefined}).toUpperCase();
};

/* ---------- roles ---------- */
const myId=()=>G.activeAcct&&G.activeAcct.id;
C.isPoc=function(id){ id=id||myId(); return !!id&&C.pocIds.has(id); };
C.isOfficer=function(id){ id=id||myId(); return !!id&&C.officerIds.has(id); };
/* club-wide powers: the club admin (arcade owner) and the officers they appoint */
C.canManage=function(){ return !!G.activeAcct&&G.clubAccess().ok&&(C.admin||C.isOfficer()); };
/* who gets the Admin Console: the club admin, officers and battalion POCs */
C.isAdminish=function(){ return !!G.activeAcct&&G.clubAccess().ok&&(C.admin||C.isOfficer()||C.isPoc()); };
C.roleLabel=function(){
 if(C.admin) return 'CLUB ADMIN';
 if(C.isOfficer()) return 'CLUB OFFICER';
 if(C.isPoc()) return (G.bn(G.activeAcct&&G.activeAcct.battalion)||'BATTALION')+' POC';
 return '';
};

/* ---------- official positions: club titles per battalion (NOT app permissions - those are POC / club officer) ---------- */
C.POSITIONS=[{k:'pres',t:'PRESIDENT'},{k:'vp',t:'VICE PRESIDENT'},{k:'rc',t:'ROAD CAPTAIN'},
 {k:'saa',t:'SGT AT ARMS'},{k:'sec',t:'SECRETARY'},{k:'tres',t:'TREASURER'}];   // no CHIEF: that's a member's road name
const POSK=new Set(C.POSITIONS.map(p=>p.k));
C.isPosKey=function(k){ return POSK.has(k); };
C.posTitle=function(k){ const p=C.POSITIONS.find(q=>q.k===k); return p?p.t:''; };

/* ---------- membership status ---------- */
C.statusOf=function(id,ca){
 if(C.isOfficer(id)) return {st:'approved',by:'OFFICER'};
 if(C.isPoc(id)) return {st:'approved',by:'POC'};
 const s=C.status[id];
 if(s&&s.st==='approved') return {st:'approved',by:s.by||'',at:s.at||0,wit:s.wit};
 if(s&&s.st==='denied') return {st:'denied',by:s.by||'',at:s.at||0};
 const created=ca||(C.rosterMap[id]&&C.rosterMap[id].ca)||0;
 if(created&&Date.now()-created>=H72) return {st:'approved',by:'AUTO',at:created+H72};
 return {st:'tentative',left:created?Math.max(0,created+H72-Date.now()):H72};
};
C.approved=function(id,ca){ return C.statusOf(id,ca).st==='approved'; };
C.myStatus=function(){
 const a=G.activeAcct; if(!a) return {st:'guest'};
 if(a.type==='sup') return {st:'supporter'};
 if(C.admin) return {st:'approved',by:'ADMIN'};
 return C.statusOf(a.id,a.created);
};
/* who may see club features: approved members (the club admin counts as approved) */
G.clubAccess=function(){
 if(!G.activeAcct) return {ok:false,reason:'guest'};
 if(G.activeAcct.type==='sup') return {ok:false,reason:'supporter'};   // friends & family: public news + events only
 // until approval decisions have loaded, nobody is let in (a denied member must never slip through)
 if(C.initializing||(C.db&&!(C.loaded.status&&C.loaded.pocs&&C.loaded.officers))) return {ok:false,reason:'checking'};
 const s=C.myStatus();
 return s.st==='approved'?{ok:true}:{ok:false,reason:s.st,left:s.left};
};
/* read-only club pages (positions, Brothers for Life, the boards, the club blackjack table): approved members, supporters
   and members still on the waitlist. viewOnly = one of the last two (no roster, nothing to change). */
C.viewOk=function(){ const a=G.clubAccess(); return a.ok||a.reason==='supporter'||a.reason==='tentative'; };
C.viewOnly=function(){ const a=G.clubAccess(); return !a.ok&&(a.reason==='supporter'||a.reason==='tentative'); };
/* kind 'view' = a page supporters can see too (only guests + denied accounts get the lock) */
G.lockInfo=function(kind){
 const a=G.clubAccess(); if(a.ok) return null;
 if(kind==='view'&&C.viewOk()) return null;
 if(a.reason==='supporter') return {title:'FOR CLUB MEMBERS',col:'#ff9ad0',sup:true,lines:['THANKS FOR SUPPORTING THE RAGING KNIGHTS!','THE ALPHA ROSTER, THE CLUB CHATS AND THE','ADMIN OFFICE ARE FOR APPROVED MEMBERS ONLY.']};
 if(a.reason==='guest'&&kind==='rides') return {title:'RIDE WITH THE CLUB',col:'#ffd060',guest:true,lines:['CREATE AN ACCOUNT TO SHARE RIDES,','TAG YOUR CREW AND GET IN CLOSE.','FRIENDS & FAMILY CAN JOIN AS SUPPORTERS.']};
 if(a.reason==='guest'&&kind==='photos') return {title:'PHOTO ALBUM',col:'#ffd060',guest:true,lines:['RIDE PHOTOS AND PHOTO DUMPS FROM THE CLUB.','MEMBERS SEE THE ALBUM • SUPPORTERS CAN ASK','THE CLUB OFFICERS FOR ACCESS.']};
 if(a.reason==='guest'&&kind==='view') return {title:'MEMBERS & SUPPORTERS',col:'#ffd060',guest:true,lines:['CREATE AN ACCOUNT TO SEE THE CLUB’S','POSITIONS, BROTHERS FOR LIFE AND BOARDS.','FRIENDS & FAMILY CAN JOIN AS SUPPORTERS.']};
 if(a.reason==='guest') return {title:'MEMBERS ONLY',col:'#ffd060',guest:true,lines:['GUESTS AND VISITORS CAN PLAY THE GAMES.','THE ALPHA ROSTER, THE CLUB CHATS AND THE','ADMIN OFFICE ARE FOR APPROVED MEMBERS.']};
 if(a.reason==='checking') return {title:'CHECKING MEMBERSHIP…',col:'#80e0ff',lines:['ONE MOMENT WHILE THE CLUBHOUSE','CHECKS YOUR APPROVAL STATUS.']};
 if(a.reason==='tentative'){
  const b=G.bn(G.activeAcct.battalion)||'YOUR BATTALION', n=C.myAckCount();
  return {title:'ON THE WAITLIST',col:'#ffd27a',waitlist:true,lines:['YOU’RE ON THE '+b+' WAITLIST • '+n+' OF '+ACKS+' ACKNOWLEDGED.','YOUR POC CAN APPROVE YOU ANY TIME, OR '+ACKS+' '+b,'MEMBERS CAN ACKNOWLEDGE YOU. OTHERWISE YOU’RE','APPROVED AUTOMATICALLY IN '+C.fmtLeft(a.left)+'.']};
 }
 return {title:'NOT APPROVED',col:'#ff8a70',lines:['YOUR BATTALION POC DIDN’T APPROVE','THIS ACCOUNT. REACH OUT TO THEM OR A','CLUB OFFICER TO SORT IT OUT.']};
};

/* ---------- people: roster cards grouped so one member on two devices shows once ---------- */
const RANK={approved:3,tentative:2,denied:1};
let peopleCache=null, peopleKey='';
C.personKey=function(r){ return String(r.bk||'').replace(/-/g,'')+'|'+String(r.n||'').toUpperCase()+'|'+String(r.ph||'').replace(/\D/g,''); };
C.people=function(){
 const key=C.ver+':'+Math.floor(Date.now()/20000);
 if(peopleCache&&key===peopleKey) return peopleCache;
 const m=new Map();
 for(const r of C.roster){
  const k=C.personKey(r), s=C.statusOf(r.id,r.ca);
  let g=m.get(k);
  if(!g){ g={key:k,ids:[],r,ll:-1,st:s.st,left:null,ca:r.ca||0,poc:false,off:false,adm:false,faceId:null,faceV:0,pc:'',pca:0,posd:null}; m.set(k,g); }
  g.ids.push(r.id);
  if(r.pc&&POSK.has(r.pc)&&(r.pca||0)>=(g.pca||0)){ g.pc=r.pc; g.pca=r.pca||0; }
  { const pd=C.pos[r.id]; if(pd&&(!g.posd||(pd.at||0)>=(g.posd.at||0))) g.posd=pd; }
  if((r.ll||0)>g.ll){ g.ll=r.ll||0; g.r=r; }
  if(RANK[s.st]>RANK[g.st]) g.st=s.st;
  if(s.st==='tentative') g.left=g.left==null?s.left:Math.min(g.left,s.left);
  if(s.st==='approved'&&s.by&&s.by!=='AUTO'&&s.by!=='POC'&&s.by!=='OFFICER'){ g.by=s.by; if(s.wit) g.wit=s.wit; }
  if(C.isPoc(r.id)) g.poc=true;
  if(C.isOfficer(r.id)) g.off=true;
  { const sd=C.status[r.id]; if(sd&&sd.self&&sd.byId===r.id&&sd.st==='approved') g.adm=true; }
  g.ca=Math.min(g.ca||r.ca||0,r.ca||g.ca||0);
 }
 for(const g of m.values()){
  const withFace=C.roster.filter(r=>g.ids.indexOf(r.id)>=0&&r.hp).sort((a,b)=>(b.ll||0)-(a.ll||0))[0];
  if(withFace){ g.faceId=withFace.id; g.faceV=withFace.pv||0; }
  if(g.st!=='tentative') g.left=null;
  // confirmed position (and where it belongs), an unconfirmed claim, Brother for Life
  g.pos=g.posd&&POSK.has(g.posd.p)?g.posd.p:'';
  g.posBk=g.pos?(g.posd.bk||g.r.bk):'';
  g.claim=g.pc&&g.pc!==g.pos&&!(g.posd&&(g.posd.at||0)>=(g.pca||0))?g.pc:'';
  g.b4l=C.b4lByKey[g.key]||g.ids.map(id=>C.b4lByAid[id]).find(Boolean)||null;
 }
 peopleCache=[...m.values()]; peopleKey=key;
 return peopleCache;
};
C.isMine=function(g){ const id=myId(); return !!id&&!!g&&g.ids.indexOf(id)>=0; };
C.myBk=function(){ return C.battKey(G.activeAcct&&G.activeAcct.battalion); };
/* may the signed-in member approve / deny this person? (their battalion's POC, a club officer or the club admin) */
C.canDecide=function(g){
 if(!g||g.poc||g.off||g.adm||C.isMine(g)||!G.clubAccess().ok) return false;
 if(C.canManage()) return true;
 return C.isPoc()&&C.sameBatt(g.r.bk,C.myBk());
};
/* phone numbers of people still on the waitlist stay hidden from everyone but the people who approve them */
C.canSeeCell=function(g){ return !!g&&(g.st==='approved'||C.canDecide(g)||C.canManage()||C.isMine(g)); };
/* tentative members waiting on the signed-in POC (their battalion) or a club officer / the admin (every battalion) */
C.myPending=function(){
 if(!C.isAdminish()) return [];
 return C.people().filter(g=>g.st==='tentative'&&C.canDecide(g)).sort((a,b)=>(a.ca||0)-(b.ca||0));
};

/* ---------- positions: who holds what, claims and nominations waiting on a reviewer ---------- */
C.myGroup=function(){ const id=myId(); if(!id||!C.loaded.roster) return null; return C.people().find(g=>g.ids.indexOf(id)>=0)||null; };
C.myPos=function(){
 const g=C.myGroup(); if(g) return g.pos?{p:g.pos,bk:g.posBk}:null;
 const d=C.pos[myId()]; return d&&POSK.has(d.p)?{p:d.p,bk:d.bk}:null;
};
/* the OFFICERS channel: the club admin, club officers, battalion POCs and confirmed position holders */
C.isOfficerish=function(){ return !!G.activeAcct&&G.clubAccess().ok&&(C.admin||C.isOfficer()||C.isPoc()||!!C.myPos()); };
/* reviewers: the club admin + officers (every battalion) and a battalion's POC (their own battalion) */
C.canReviewBatt=function(bk){ return G.clubAccess().ok&&(C.canManage()||(C.isPoc()&&C.sameBatt(bk,C.myBk()))); };
C.canSetPos=function(g){
 if(!g||g.st!=='approved'||(C.isMine(g)&&!C.admin)) return false;   // nobody confirms their own position (except the club admin)
 return C.canReviewBatt(g.r.bk)||(!!g.pos&&C.canReviewBatt(g.posBk));
};
C.posHolders=function(bk){ return C.people().filter(g=>g.st==='approved'&&g.pos&&C.sameBatt(g.posBk,bk)); };
C.posClaims=function(){
 if(!C.isAdminish()||!C.loaded.pos||!C.loaded.roster) return [];
 return C.people().filter(g=>g.claim&&C.canSetPos(g)).sort((a,b)=>(a.pca||0)-(b.pca||0));
};
/* nominations grouped per nominee + position (several anonymous nominations for the same thing show as one) */
C.nomGroups=function(){
 if(!C.isAdminish()||!C.loaded.noms||!C.loaded.roster) return [];
 const P=C.people(), m=new Map();
 for(const n of C.noms){
  if(!C.canReviewBatt(n.bk)) continue;
  const k=n.nk+'#'+n.p; let x=m.get(k);
  if(!x){ x={k,nk:n.nk,nid:n.nid,nn:n.nn,p:n.p,bk:n.bk,b:n.b,list:[],at:0}; m.set(k,x); }
  x.list.push(n); x.at=Math.max(x.at,n.at||0);
 }
 const out=[];
 for(const x of m.values()){
  x.g=P.find(g=>g.key===x.nk)||P.find(g=>g.ids.indexOf(x.nid)>=0)||null;
  if(x.g&&C.isMine(x.g)&&!C.admin) continue;                        // nobody reviews a nomination of themselves
  if(x.g&&x.g.pos===x.p&&C.sameBatt(x.g.posBk,x.bk)) continue;      // already holds it
  out.push(x);
 }
 return out.sort((a,b)=>b.at-a.at);
};
C.posQueueN=function(){ return C.posClaims().length+C.nomGroups().length; };

/* ---------- acknowledgments ("I know this rider") ---------- */
C.canAck=function(g){
 return !!g&&g.st==='tentative'&&!C.isMine(g)&&!C.canDecide(g)&&G.clubAccess().ok&&C.sameBatt(g.r.bk,C.myBk());
};
/* valid acknowledgments for an applicant: approved members of the same battalion, one per person */
C.ackInfo=function(g,strict){
 const seen=new Map(); let mine=false;
 for(const k of C.acks){
  if(g.ids.indexOf(k.a)<0) continue;
  if(myId()&&k.v===myId()) mine=true;
  if(g.ids.indexOf(k.v)>=0) continue;
  const vr=C.rosterMap[k.v];
  if(strict&&!vr) continue;
  if(!C.sameBatt(vr?vr.bk:k.vb,g.r.bk)) continue;
  if(vr&&!C.approved(k.v)) continue;
  const vk=vr?C.personKey(vr):(k.vk||k.v);
  if(!seen.has(vk)) seen.set(vk,vr?vr.n:k.vn);
 }
 return {n:seen.size,names:[...seen.values()],mine};
};
/* for a tentative member: how many have acknowledged them so far (from their own acknowledgments feed) */
C.myAckCount=function(){
 const me=G.activeAcct; if(!me) return 0;
 const s=new Set();
 for(const k of C.acks) if(k.a===me.id&&k.v!==me.id&&C.sameBatt(k.vb,C.myBk())) s.add(k.vk||k.v);
 return s.size;
};
/* applicants in my battalion still waiting on MY acknowledgment */
C.myAckTodo=function(){
 if(!G.clubAccess().ok||!C.loaded.acks) return [];
 return C.people().filter(g=>C.canAck(g)&&!C.ackInfo(g).mine).sort((a,b)=>(a.ca||0)-(b.ca||0));
};
C.acknowledge=async function(g){
 const me=G.activeAcct; if(!C.db||!me||!C.canAck(g)) return false;
 const doc={a:g.r.id,v:me.id,vn:me.roadName,vb:C.battKey(me.battalion),vk:C.personKey(C.rosterDoc(me)),at:Date.now()};
 try{
  await C.db.collection('acks').doc(g.r.id+'~'+me.id).set(doc);
  if(!C.acks.some(k=>k.a===doc.a&&k.v===doc.v)) C.acks=C.acks.concat([Object.assign({id:g.r.id+'~'+me.id},doc)]);
  bump(); C.finalizeAcks(); return true;
 }catch(e){ return false; }
};
C.unacknowledge=async function(g){
 const me=G.activeAcct; if(!C.db||!me) return false;
 let ok=true;
 for(const k of C.acks.filter(k=>g.ids.indexOf(k.a)>=0&&k.v===me.id)){
  try{ await C.db.collection('acks').doc(k.a+'~'+k.v).delete(); }catch(e){ ok=false; }
 }
 C.acks=C.acks.filter(k=>!(g.ids.indexOf(k.a)>=0&&k.v===me.id)); bump();
 return ok;
};
/* whoever sees the 3rd valid acknowledgment first records the approval (and tidies the acknowledgments away) */
C.finalizeAcks=function(){
 if(!C.db||!G.clubAccess().ok||!C.loaded.roster||!C.loaded.acks||!C.loaded.status) return;
 for(const g of C.people()){
  if(g.st!=='tentative'||C.finalizing[g.key]||g.ids.some(id=>C.status[id])) continue;
  const inf=C.ackInfo(g,true);
  if(inf.n<ACKS) continue;
  C.finalizing[g.key]=true;
  (async()=>{
   for(const id of g.ids){ const doc={st:'approved',by:ACKS+' MEMBERS',wit:inf.names.slice(0,6),at:Date.now()};
    try{ await C.db.collection('status').doc(id).set(doc); C.status[id]=doc; }catch(e){} }
   bump(); C.cleanAcks(g);
  })();
 }
};
C.cleanAcks=function(g){
 if(!C.db) return;
 for(const k of C.acks.filter(k=>g.ids.indexOf(k.a)>=0)) C.db.collection('acks').doc(k.a+'~'+k.v).delete().catch(()=>{});
};

/* ---------- connect ---------- */
function bump(){ C.ver++; peopleCache=null; }
C.init=async function(){
 try{
  const use=window.claude&&window.claude.use?(n=>window.claude.use(n)):(()=>Promise.resolve(null));
  const [db,user]=await Promise.all([use('db'),use('user')]);
  if(user){ try{ C.admin=!!(await user.isOwner()); }catch(e){} }
  if(!db){ C.state='offline'; C.rosterState='offline'; C.initializing=false; return; }
  C.db=db; C.initializing=false;
  // everyone signed in to the arcade can see approval decisions + who the POCs and officers are (no personal details)
  db.collection('status').limit(1000).onSnapshot(s=>{
   const m={}; for(const d of s.docs){ const v=d.data(); if(v&&(v.st==='approved'||v.st==='denied')) m[d.id]=v; }
   C.status=m; C.loaded.status=true; bump(); C.syncAccess(); C.checkNotices();
  },()=>{ C.loaded.status=true; });
  db.collection('pocs').limit(500).onSnapshot(s=>{
   C.pocs=s.docs.map(d=>Object.assign({id:d.id},d.data())).filter(p=>p&&typeof p.bk==='string');
   C.pocIds=new Set(C.pocs.map(p=>p.id));
   C.loaded.pocs=true; bump(); C.syncAccess(); C.checkNotices();
  },()=>{ C.loaded.pocs=true; });
  db.collection('officers').limit(200).onSnapshot(s=>{
   C.officers=s.docs.map(d=>Object.assign({id:d.id},d.data())).filter(p=>p&&typeof p.n==='string');
   C.officerIds=new Set(C.officers.map(p=>p.id));
   C.loaded.officers=true; bump(); C.syncAccess(); C.checkNotices();
  },()=>{ C.loaded.officers=true; });
  // open to everyone: the shop + donate links (only the club admin can change them)
  db.doc('config/links').onSnapshot(s=>{
   const d=s&&s.exists?s.data():null; C.links=d&&typeof d==='object'?d:{}; C.loaded.links=true; bump();
  },()=>{ C.loaded.links=true; });
  if(G.activeAcct){ C.touch(true); C.pushRoster(G.activeAcct,true); }
  C.syncAccess();
  setInterval(()=>{ C.syncAccess(); C.checkNotices(); C.finalizeAcks(); },30000); // auto-approvals happen with the clock
 }catch(e){ C.state='offline'; C.rosterState='offline'; C.initializing=false; }
};
/* The roster (names, cells, headshots), everyone's acknowledgments and members/officers posts are only downloaded
   while an approved member is signed in, and are dropped again at logout. Supporters and members still on the
   waitlist get the PUBLIC feeds plus read-only positions, B4L and boards; a waitlisted member also follows their own
   acknowledgments. Guests get the PUBLIC feeds only. */
C.syncAccess=function(){
 if(!C.db) return;
 const acc=G.clubAccess(), me=G.activeAcct;
 // supporters + the waitlist: read-only positions, B4L and boards (dropped before the members' feeds take over)
 const wantSup=!acc.ok&&C.viewOk();
 if(!wantSup&&C.supSubs.length) C.dropSup();
 if(acc.ok&&!C.subs.length){
  const gen=++C.memGen, live=f=>x=>{ if(gen===C.memGen) f(x); };   // a late snapshot after logout/denial is ignored
  C.rosterState='connecting'; C.state='connecting';
  C.subs.push(C.db.collection('roster').limit(1000).onSnapshot(live(s=>{
   C.roster=s.docs.map(d=>Object.assign({id:d.id},d.data())).filter(r=>r&&typeof r.n==='string');
   const m={}; for(const r of C.roster) m[r.id]=r; C.rosterMap=m;
   C.rosterState='live'; C.loaded.roster=true; bump(); C.syncAccess(); C.checkNotices(); C.finalizeAcks();   // (re)check the officers-channel watch once we know who holds what
  }),e=>{ C.rosterState=e&&e.code==='revoked'?'revoked':'offline'; }));
  C.subs.push(C.db.collection('board').orderBy('p','desc').limit(500).onSnapshot(live(s=>{
   C.board=boardDocs(s); C.state='live';
  }),()=>{ C.state='offline'; }));
  C.subs.push(C.db.collection('acks').limit(1000).onSnapshot(live(s=>{
   C.acks=ackDocs(s); C.loaded.acks=true; bump(); C.checkNotices(); C.finalizeAcks();
  }),()=>{ C.loaded.acks=true; }));
  C.subs.push(C.db.collection('ann').orderBy('at','desc').limit(100).onSnapshot(live(s=>{
   C.anns=annDocs(s); C.loaded.anns=true; bump(); C.checkNotices();
  }),()=>{ C.loaded.anns=true; }));
  C.subs.push(C.db.collection('events').limit(500).onSnapshot(live(s=>{
   C.events=evDocs(s); C.loaded.events=true; bump(); C.checkNotices();
  }),()=>{ C.loaded.events=true; }));
  C.subs.push(C.db.collection('sup').limit(1000).onSnapshot(live(s=>{
   C.sups=s.docs.map(d=>Object.assign({id:d.id},d.data())).filter(x=>x&&typeof x.n==='string');
   C.loaded.sups=true; bump();
  }),()=>{ C.loaded.sups=true; }));
  C.subs.push(C.db.collection('pos').limit(1000).onSnapshot(live(s=>{
   C.pos=posDocs(s); C.loaded.pos=true; bump(); C.syncAccess(); C.checkNotices();
  }),()=>{ C.loaded.pos=true; }));
  C.subs.push(C.db.collection('b4l').limit(500).onSnapshot(live(s=>{ setB4l(s); }),()=>{ C.loaded.b4l=true; }));
  // the ADMIN OFFICE: club info + documents (approved members only)
  C.subs.push(C.db.collection('docs').limit(300).onSnapshot(live(s=>{ C.docs=docDocs(s); C.loaded.docs=true; bump(); }),()=>{ C.loaded.docs=true; }));
  C.subs.push(C.db.doc('config/info').onSnapshot(live(s=>{
   const d=s&&s.exists?s.data():null, o={};
   if(d&&typeof d==='object') for(const f of C.INFO){ const v=d[f.k]; if(typeof v==='string'&&v.trim()) o[f.k]=v.slice(0,f.max); }
   C.info=o; C.loaded.info=true; bump();
  }),()=>{ C.loaded.info=true; }));
 } else if(!acc.ok&&C.subs.length) C.dropClubData();
 // everyone else (guests, supporters, members waiting on approval) follows only what's marked PUBLIC
 const wantPub=!acc.ok;
 if(wantPub&&!C.pubSubs.length){
  const gen=++C.pubGen, live=()=>gen===C.pubGen;   // a late snapshot from a dropped feed must never overwrite the members' data
  C.pubSubs.push(C.db.collection('ann').where('v','==','pub').limit(100).onSnapshot(s=>{ if(!live()) return; C.anns=annDocs(s); C.loaded.anns=true; bump(); C.checkNotices(); },()=>{ if(live()) C.loaded.anns=true; }));
  C.pubSubs.push(C.db.collection('events').where('v','==','pub').limit(300).onSnapshot(s=>{ if(!live()) return; C.events=evDocs(s); C.loaded.events=true; bump(); C.checkNotices(); },()=>{ if(live()) C.loaded.events=true; }));
 } else if(!wantPub&&C.pubSubs.length) C.dropPublic();
 if(wantSup&&!C.supSubs.length){
  const gen=++C.supGen, live=f=>x=>{ if(gen===C.supGen) f(x); };
  C.state='connecting';
  C.supSubs.push(C.db.collection('pos').limit(1000).onSnapshot(live(s=>{ C.pos=posDocs(s); C.loaded.pos=true; bump(); }),live(()=>{ C.loaded.pos=true; })));
  C.supSubs.push(C.db.collection('b4l').limit(500).onSnapshot(live(s=>{ setB4l(s); }),live(()=>{ C.loaded.b4l=true; })));
  C.supSubs.push(C.db.collection('board').orderBy('p','desc').limit(500).onSnapshot(live(s=>{ C.board=boardDocs(s); C.state='live'; bump(); }),live(()=>{ C.state='offline'; })));
 }
 // nominations: only downloaded for the people who review them
 const wantNoms=!!(acc.ok&&C.subs.length&&C.isAdminish());
 if(wantNoms&&!C.nomSub){
  C.nomSub=C.db.collection('noms').orderBy('at','desc').limit(300).onSnapshot(s=>{
   C.noms=s.docs.map(d=>Object.assign({id:d.id},d.data())).filter(n=>n&&typeof n.nk==='string'&&POSK.has(n.p)&&typeof n.at==='number');
   C.loaded.noms=true; bump(); C.checkNotices();
  },()=>{ C.loaded.noms=true; });
 } else if(!wantNoms&&C.nomSub){ try{ C.nomSub(); }catch(e){} C.nomSub=null; C.noms=[]; C.loaded.noms=false; C.lastPosN=-1; }
 // officers channel: watch for new messages + polls so the OFFICERS card can show a dot
 const wantOff=!!(acc.ok&&C.subs.length&&C.isOfficerish());
 if(wantOff&&!C.offSubs.length){
  C.offN=0; C.offMsgT=0; C.offPollT=0; C.lastOffT=-1;
  C.offSubs.push(C.db.collection('chat').where('room','==','officers').orderBy('day','desc').limit(1).onSnapshot(s=>{
   let t=0; const me=G.save&&G.save.roadName;
   for(const d of s.docs){ const b=d.data(), msgs=b&&b.msgs; if(!msgs||typeof msgs!=='object') continue;
    for(const k in msgs){ const m=msgs[k]; if(m&&typeof m.ts==='number'&&m.n!==me&&m.ts>t) t=m.ts; } }
   C.offMsgT=t; C.offN|=1; bump(); C.checkNotices();
  },()=>{ C.offN|=1; }));
  C.offSubs.push(C.db.collection('polls').where('room','==','officers').orderBy('at','desc').limit(5).onSnapshot(s=>{
   let t=0; for(const d of s.docs){ const p=d.data(); if(p&&typeof p.at==='number'&&p.byId!==myId()&&p.at>t) t=p.at; }
   C.offPollT=t; C.offN|=2; bump(); C.checkNotices();
  },()=>{ C.offN|=2; }));
 } else if(!wantOff&&C.offSubs.length) C.dropOfficers();
 // account holders (members, the waitlist, supporters): the names index, WE'RE CLOSE and photo access
 const acctKey=me&&C.viewOk()?me.id+(C.isPhotoOfficer()?'#o':''):'';
 if(acctKey!==C.acctKey){ C.dropAcct(); C.acctKey=acctKey; if(acctKey) C.openAcct(me); }
 const want=!acc.ok&&me&&me.type!=='sup'?me.id:null;   // a member on the waitlist follows their own acknowledgments
 if(want!==C.mineFor){
  if(C.mineSub){ try{ C.mineSub(); }catch(e){} C.mineSub=null; }
  C.mineFor=want;
  if(!acc.ok){ C.acks=[]; C.lastMyAckN=-1; }
  C.mineLoaded=false;
  if(want) C.mineSub=C.db.collection('acks').where('a','==',want).limit(100).onSnapshot(s=>{ C.acks=ackDocs(s); if(!C.mineLoaded){ C.mineLoaded=true; C.lastMyAckN=C.myAckCount(); } bump(); C.checkNotices(); },()=>{});
 }
};
const AUD={pub:1,mem:1,off:1};
function annDocs(s){ return s.docs.map(d=>Object.assign({id:d.id},d.data())).filter(a=>a&&typeof a.t==='string'&&typeof a.at==='number'&&typeof a.bk==='string'&&(a.v===undefined||AUD[a.v])); }
const EVT={ride:1,benefit:1,fund:1,meet:1,key:1,anniv:1,other:1};
function evDocs(s){ return s.docs.map(d=>Object.assign({id:d.id},d.data())).filter(e=>e&&typeof e.t==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(String(e.d||''))&&EVT[e.ty]&&(e.v===undefined||AUD[e.v])&&typeof e.bk==='string'); }
function posDocs(s){ const m={}; for(const d of s.docs){ const v=d.data(); if(v&&typeof v==='object'&&(v.p===''||POSK.has(v.p))) m[d.id]=v; } return m; }
function boardDocs(s){ return s.docs.map(d=>Object.assign({id:d.id},d.data())).filter(r=>r&&typeof r.n==='string'&&typeof r.p==='number'); }
function setB4l(s){
 C.b4l=s.docs.map(d=>Object.assign({id:d.id},d.data())).filter(b=>b&&typeof b.n==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(String(b.d||'')));
 const K={}, A={}; for(const b of C.b4l){ if(b.nk) K[b.nk]=b; if(b.aid) A[b.aid]=b; } C.b4lByKey=K; C.b4lByAid=A;
 C.loaded.b4l=true; bump();
}
C.pubGen=0;
C.dropPublic=function(){ C.pubGen++; for(const u of C.pubSubs){ try{ u(); }catch(e){} } C.pubSubs=[]; };
C.supGen=0;
C.dropSup=function(){
 C.supGen++; for(const u of C.supSubs){ try{ u(); }catch(e){} } C.supSubs=[];
 if(C.subs.length) return;   // the members' feeds own this data now
 C.pos={}; C.b4l=[]; C.b4lByKey={}; C.b4lByAid={}; C.board=[]; C.loaded.pos=false; C.loaded.b4l=false; C.state='locked'; bump();
};
function ackDocs(s){ return s.docs.map(d=>Object.assign({id:d.id},d.data())).filter(k=>k&&typeof k.a==='string'&&typeof k.v==='string'); }
C.dropOfficers=function(){
 for(const u of C.offSubs){ try{ u(); }catch(e){} }
 C.offSubs=[]; C.offMsgT=0; C.offPollT=0; C.offN=0; C.lastOffT=-1;
};
C.memGen=0;
C.dropClubData=function(){
 C.memGen++;
 for(const u of C.subs){ try{ u(); }catch(e){} }
 if(C.nomSub){ try{ C.nomSub(); }catch(e){} C.nomSub=null; }
 C.dropOfficers();
 C.subs=[]; C.roster=[]; C.rosterMap={}; C.board=[]; C.faces={}; C.faceBusy=0; C.acks=[]; C.anns=[]; C.events=[]; C.sups=[];
 C.docs=[]; C.docBodies={}; C.loaded.docs=false; C.info={}; C.loaded.info=false; C.thumbs={}; C.fulls={};
 C.loaded.events=false; C.loaded.sups=false;
 C.pos={}; C.noms=[]; C.b4l=[]; C.b4lByKey={}; C.b4lByAid={};
 C.loaded.roster=false; C.loaded.acks=false; C.loaded.anns=false; C.loaded.pos=false; C.loaded.noms=false; C.loaded.b4l=false;
 C.rosterState='locked'; C.state='locked'; bump();
};
C.acctGen=0;
C.openAcct=function(me){
 const gen=++C.acctGen, live=f=>x=>{ if(gen===C.acctGen) f(x); }, db=C.db;
 C.acctSubs.push(db.collection('names').limit(1000).onSnapshot(live(s=>{ C.names=nameDocs(s); C.loaded.names=true; bump(); C.backfillNames(); }),live(()=>{ C.loaded.names=true; })));
 C.acctSubs.push(db.collection('close').where('a','==',me.id).limit(500).onSnapshot(live(s=>{ C.closeOut=closeDocs(s); C.loaded.closeA=true; bump(); C.checkNotices(); }),live(()=>{ C.loaded.closeA=true; })));
 C.acctSubs.push(db.collection('close').where('b','==',me.id).limit(500).onSnapshot(live(s=>{ C.closeIn=closeDocs(s); C.loaded.closeB=true; bump(); C.checkNotices(); }),live(()=>{ C.loaded.closeB=true; })));
 if(me.type==='sup') C.acctSubs.push(db.doc('phacc/'+me.id).onSnapshot(live(d=>{ const v=d&&d.exists?d.data():null; C.myPhacc=v&&typeof v==='object'?v:null; C.loaded.phacc=true; bump(); C.checkNotices(); }),live(()=>{ C.loaded.phacc=true; })));
 if(C.isPhotoOfficer()) C.acctSubs.push(db.collection('phacc').limit(500).onSnapshot(live(s=>{ C.phacc=s.docs.map(d=>Object.assign({id:d.id},d.data())).filter(x=>x&&typeof x.n==='string'); C.loaded.phaccAll=true; bump(); C.checkNotices(); }),live(()=>{ C.loaded.phaccAll=true; })));
};
C.dropAcct=function(){
 C.acctGen++; for(const u of C.acctSubs){ try{ u(); }catch(e){} } C.acctSubs=[];
 C.names=[]; C.closeOut=[]; C.closeIn=[]; C.myPhacc=null; C.phacc=[]; C.lastCloseN=-1; C.lastPhReqN=-1; C.lastPhAcc='';
 for(const k of ['names','closeA','closeB','phacc','phaccAll']) C.loaded[k]=false;
};
function nameDocs(s){ return s.docs.map(d=>Object.assign({id:d.id},d.data())).filter(x=>x&&typeof x.n==='string'&&x.n&&(x.t==='mem'||x.t==='sup')); }
function closeDocs(s){ return s.docs.map(d=>Object.assign({id:d.id},d.data())).filter(x=>x&&typeof x.a==='string'&&typeof x.b==='string'&&(x.st==='ask'||x.st==='ok')); }
C.offLatest=function(){ return Math.max(C.offMsgT||0,C.offPollT||0); };
C.offUnread=function(){ return C.offSubs.length>0&&C.offN===3&&C.offLatest()>(((G.save&&G.save.seen)||{}).chat_officers||0); };
C.ready=function(){ return C.loaded.status&&C.loaded.pocs&&C.loaded.officers; };

/* ---------- in-app notices ---------- */
C.checkNotices=function(){
 const note=(m,c)=>G.toast(m,c,true);   // first-look notices wait their turn instead of stacking; live ones (with a sound) show at once
 if(!G.activeAcct||!G.save||!C.ready()) return;
 const me=G.activeAcct;
 // the club admin's own card should read as approved for everyone else too
 if(C.admin&&!C.adminSelf&&!(C.status[me.id]&&C.status[me.id].self&&C.status[me.id].st==='approved')){
  C.adminSelf=true;
  const doc={st:'approved',by:'CLUB ADMIN',byId:me.id,self:true,at:Date.now()};
  C.db.collection('status').doc(me.id).set(doc).then(()=>{ C.status[me.id]=doc; bump(); }).catch(()=>{});
 }
 const s=C.myStatus().st, seen=G.save.seenStatus;
 if(seen&&s!==seen){
  if(s==='approved') note('YOU’RE APPROVED - CLUB FEATURES UNLOCKED','#80ffa0');
  else if(s==='denied') note('MEMBERSHIP NOT APPROVED - CONTACT YOUR BATTALION POC','#ff8a70');
 }
 if(s!==seen){ G.save.seenStatus=s; G.persist(); }
 // applicant: someone vouched for me
 if(s==='tentative'&&C.mineLoaded){
  const n=C.myAckCount();
  if(C.lastMyAckN>=0&&n>C.lastMyAckN){
   const k=C.acks.filter(k=>k.a===me.id).sort((a,b)=>(b.at||0)-(a.at||0))[0];
   G.toast((k&&k.vn?k.vn:'A MEMBER')+' ACKNOWLEDGED YOU ('+n+' OF '+ACKS+')','#80ffa0'); AUDIO.sfx('cheer');
  }
  C.lastMyAckN=n;
 }
 // announcements I haven't read (members: my battalion + club-wide; supporters: public posts)
 if(C.loaded.anns){
  const u=C.annUnread();
  if(C.lastAnnN<0){ if(u.length) note(u.length===1?'NEW ANNOUNCEMENT: '+u[0].t:u.length+' NEW ANNOUNCEMENTS','#ffd060'); }
  else if(u.length>C.lastAnnN){ G.toast('NEW ANNOUNCEMENT: '+u[0].t,'#ffd060'); AUDIO.sfx('horn'); }
  C.lastAnnN=u.length;
 }
 // WE'RE CLOSE: someone wants to get in close
 if(C.loaded.closeB){
  const R=C.closeRequests(), n=R.length;
  if(C.lastCloseN>=0&&n>C.lastCloseN){ G.toast(R[0].an+' WANTS TO GET IN CLOSE','#ffb0d8'); AUDIO.sfx('heart'); }
  else if(C.lastCloseN<0&&n) note(n===1?R[0].an+' WANTS TO GET IN CLOSE':n+' RIDERS WANT TO GET IN CLOSE','#ffb0d8');
  C.lastCloseN=n;
 }
 // supporters: the photo album opens once two club officers approve
 if(me.type==='sup'&&C.loaded.phacc){
  const p=C.photoAccess();
  if(C.lastPhAcc&&p!==C.lastPhAcc){
   if(p==='granted'){ G.toast('PHOTO ALBUM UNLOCKED • TWO CLUB OFFICERS APPROVED','#80ffa0'); AUDIO.sfx('cheer'); }
   else if(p==='motion') note('PHOTO ACCESS: 1 OF 2 OFFICERS APPROVED','#ffd27a');
   else if(p==='denied') note('PHOTO ACCESS WASN’T APPROVED THIS TIME','#ff9a80');
  }
  C.lastPhAcc=p;
 }
 // club officers + the club admin: supporters waiting on a motion or a second
 if(C.loaded.phaccAll){
  const n=C.photoTodo().length;
  if(C.lastPhReqN>=0&&n>C.lastPhReqN){ G.toast('A SUPPORTER ASKED FOR PHOTO ACCESS','#ffb060'); AUDIO.sfx('horn'); }
  C.lastPhReqN=n;
 }
 if(!C.loaded.roster) return;
 // POCs / officers / admin: sign-ups waiting on a decision
 const n=C.myPending().length;
 if(C.lastPendingN<0){ if(n) note((C.canManage()?(C.admin?'CLUB ADMIN: ':'CLUB OFFICER: '):'BATTALION POC: ')+n+' NEW MEMBER'+(n===1?'':'S')+' TO APPROVE','#80e0ff'); }
 else if(n>C.lastPendingN){ G.toast('NEW MEMBER WAITING FOR YOUR APPROVAL','#80e0ff'); AUDIO.sfx('horn'); }
 C.lastPendingN=n;
 // members: riders on their battalion's waitlist they haven't acknowledged
 if(C.loaded.acks){
  const a=C.myAckTodo().length;
  if(C.lastAckN<0){ if(a) note((G.bn(me.battalion)||'BATTALION')+' WAITLIST: '+a+' RIDER'+(a===1?'':'S')+' TO ACKNOWLEDGE','#80e0ff'); }
  else if(a>C.lastAckN){ G.toast('NEW RIDER ON THE '+(G.bn(me.battalion)||'BATTALION')+' WAITLIST','#80e0ff'); AUDIO.sfx('horn'); }
  C.lastAckN=a;
 }
 // reviewers: position claims + nominations waiting on them
 if(C.isAdminish()&&C.loaded.pos&&C.loaded.noms){
  const q=C.posQueueN();
  if(C.lastPosN<0){ if(q) note('POSITIONS: '+q+' TO REVIEW','#ffd060'); }
  else if(q>C.lastPosN){ G.toast('NEW POSITION CLAIM OR NOMINATION TO REVIEW','#ffd060'); AUDIO.sfx('horn'); }
  C.lastPosN=q;
 }
 // officers channel
 if(C.offSubs.length&&C.offN===3){
  const t=C.offLatest(), seen=((G.save.seen||{}).chat_officers||0), here=G.sceneName==='chat'&&G.scene&&G.scene.officers;
  if(C.lastOffT<0){ if(t>seen&&!here) note('OFFICERS CHANNEL: NEW MESSAGES','#ffb060'); }
  else if(t>C.lastOffT&&t>seen&&!here){ G.toast('NEW IN THE OFFICERS CHANNEL','#ffb060'); AUDIO.sfx('horn'); }
  C.lastOffT=t;
 }
};
C.onLogin=function(){ C.lastPendingN=-1; C.lastAckN=-1; C.lastMyAckN=-1; C.lastAnnN=-1; C.lastPosN=-1; C.lastOffT=-1; C.adminSelf=false; C.dropOfficers(); C.dropAcct(); C.acctKey=''; C.syncAccess(); C.checkNotices(); };

/* ---------- writes ---------- */
C.rosterDoc=function(a){
 return {f:a.first||'',li:String(a.li||'').slice(0,1).toUpperCase(),n:a.roadName,b:a.battalion||'',bk:C.battKey(a.battalion),
  ph:a.contact||'',ca:a.created||Date.now(),ll:a.lastLogin||a.created||0,hp:!!a.photo,pv:a.photoAt||0,
  pc:POSK.has(a.pc)?a.pc:'',pca:a.pca||0,u:Date.now()};
};
C.pushSupporter=async function(a){
 if(!C.db||C.readOnly||!a) return;
 try{ await C.db.collection('sup').doc(a.id).set({n:a.roadName,f:String(a.first||'').slice(0,12),loc:String(a.loc||'').slice(0,40),ca:a.created||Date.now(),ll:a.lastLogin||a.created||0,u:Date.now()}); }
 catch(e){ if(e&&(e.code==='invalid_argument'||e.code==='not_granted'||e.code==='revoked')) C.readOnly=true; return; }
 C.pushName(a);
};
C.pushRoster=async function(a,withFace){
 if(!C.db||C.readOnly||!a) return;
 if(a.type==='sup') return C.pushSupporter(a);
 try{ await C.db.collection('roster').doc(a.id).set(C.rosterDoc(a)); }
 catch(e){ if(e&&(e.code==='invalid_argument'||e.code==='not_granted'||e.code==='revoked')) C.readOnly=true; return; }
 C.pushName(a);
 const key=a.photo?a.photo.length+':'+(a.photoAt||0):'';
 if(withFace&&a.photo&&C.facePushed[a.id]!==key){
  try{ await C.db.collection('faces').doc(a.id).set({img:a.photo,u:Date.now()}); C.facePushed[a.id]=key; C.faces[a.id+'@'+(a.photoAt||0)]=a.photo; }catch(e){}
 }
};
C.setStatus=async function(id,st){
 if(!C.db) return false;
 const me=G.activeAcct, doc={st,by:C.admin?'CLUB ADMIN':(me?me.roadName:'POC'),byId:me?me.id:'',at:Date.now()};
 try{ await C.db.collection('status').doc(id).set(doc); C.status[id]=doc; bump(); return true; }catch(e){ return false; }
};
C.decide=async function(g,st){
 let ok=true;
 for(const id of g.ids) if(!(await C.setStatus(id,st))) ok=false;
 if(ok) C.cleanAcks(g);
 return ok;
};
async function setRole(col,g,on){
 try{
  for(const id of g.ids){
   if(on) await C.db.collection(col).doc(id).set({n:g.r.n,b:g.r.b||'',bk:g.r.bk||C.battKey(g.r.b),at:Date.now()});
   else await C.db.collection(col).doc(id).delete();
  }
  return true;
 }catch(e){ return false; }
}
C.setPoc=async function(g,on){ if(!C.db||!C.canManage()) return false; return setRole('pocs',g,on); };
C.setOfficer=async function(g,on){ if(!C.db||!C.admin) return false; return setRole('officers',g,on); };

/* ---------- positions: confirm / appoint / remove (one holder per position per battalion) ---------- */
function posDoc(g,k,bk,extra){
 const me=G.activeAcct;
 return Object.assign({p:k,bk:bk||g.r.bk,b:g.r.b||g.r.bk,n:g.r.n,by:C.admin?'CLUB ADMIN':me.roadName,byId:me.id,at:Date.now()},extra||{});
}
C.setPosition=async function(g,k){
 if(!C.db||!g||!G.activeAcct) return false;
 const self=C.isMine(g);
 if(k){ if(!POSK.has(k)||!C.canSetPos(g)) return false; }
 else if(!(C.canSetPos(g)||self)) return false;           // members may step down themselves
 try{
  if(k){
   for(const h of C.people()) if(h.key!==g.key&&h.pos===k&&C.sameBatt(h.posBk,g.r.bk)){
    const d=posDoc(h,'',h.posBk,{was:k});
    for(const id of h.ids){ await C.db.collection('pos').doc(id).set(d); C.pos[id]=d; }
   }
  }
  const doc=k?posDoc(g,k,g.r.bk):posDoc(g,'',g.posBk||g.r.bk,Object.assign({was:g.pos||''},self?{self:true}:{}));
  for(const id of g.ids){ await C.db.collection('pos').doc(id).set(doc); C.pos[id]=doc; }
  if(k) await C.clearNoms(n=>(n.nk===g.key||g.ids.indexOf(n.nid)>=0)&&n.p===k);
  bump(); return true;
 }catch(e){ return false; }
};
/* decline a claim: keeps whatever they already hold, and settles the claim */
C.declineClaim=async function(g){
 if(!C.db||!g||!g.claim||!C.canSetPos(g)) return false;
 const doc=posDoc(g,g.pos||'',g.pos?g.posBk:g.r.bk,{no:g.claim});
 try{ for(const id of g.ids){ await C.db.collection('pos').doc(id).set(doc); C.pos[id]=doc; } bump(); return true; }catch(e){ return false; }
};
/* the signed-in member says which position they hold ('' = none / stepping down) */
C.claimPosition=async function(k){
 const a=G.activeAcct; if(!a) return false;
 a.pc=POSK.has(k)?k:''; a.pca=Date.now(); G.saveRoster();
 await C.pushRoster(a);
 const g=C.myGroup();
 if(!a.pc&&g&&g.pos){ if(!(await C.setPosition(g,''))) return false; }
 bump(); return true;
};
/* anonymous nomination: the nominator is never written anywhere */
C.nominate=async function(g,k,why){
 if(!C.db||!G.clubAccess().ok||!g||!POSK.has(k)||C.isMine(g)) return false;
 const id=Date.now().toString(36)+Math.random().toString(36).slice(2,8);
 const doc={nk:g.key,nid:g.r.id,nn:g.r.n,bk:g.r.bk,b:g.r.b||g.r.bk,p:k,why:String(why||'').replace(/\s+/g,' ').trim().slice(0,200),at:Date.now()};
 try{ await C.db.collection('noms').doc(id).set(doc); return true; }catch(e){ return false; }
};
C.clearNoms=async function(pred){
 if(!C.db) return false;
 const L=C.noms.filter(pred); let ok=true;
 for(const n of L){ try{ await C.db.collection('noms').doc(n.id).delete(); }catch(e){ ok=false; } }
 C.noms=C.noms.filter(n=>L.indexOf(n)<0); bump(); return ok;
};

/* ---------- Brothers for Life: only the club admin grants the title (enforced by the sharing rules) ---------- */
C.today=function(){ const d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); };
C.validDay=function(s){ const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s||'')); if(!m) return false; const d=new Date(+m[1],+m[2]-1,+m[3]); return d.getMonth()===+m[2]-1&&+m[1]>=1950&&s<=C.today(); };
C.b4lDate=function(s){ const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s||'')); if(!m) return '-'; return new Date(+m[1],+m[2]-1,+m[3]).toLocaleDateString([],{month:'short',day:'numeric',year:'numeric'}).toUpperCase(); };
C.b4lList=function(){ return C.b4l.slice().sort((a,b)=>String(a.d).localeCompare(String(b.d))||String(a.n).localeCompare(String(b.n))); };
C.b4lPerson=function(x){ if(!x) return null; const P=C.people(); return (x.nk&&P.find(g=>g.key===x.nk))||(x.aid&&P.find(g=>g.ids.indexOf(x.aid)>=0))||null; };
/* e = {g} for a member on the app, or {n,f,li,b} for a brother who isn't; e.id edits an existing entry */
C.grantB4L=async function(e){
 if(!C.db||!C.admin||!e||!C.validDay(e.d)) return false;
 const g=e.g, r=g?g.r:null;
 const id=e.id||(r?r.id:'x'+Date.now().toString(36)+Math.random().toString(36).slice(2,6));
 const up=(s,n)=>String(s||'').toUpperCase().trim().slice(0,n);
 const doc=r?{n:r.n,f:r.f||'',li:r.li||'',b:r.b||'',bk:r.bk||C.battKey(r.b),nk:g.key,aid:r.id}
            :{n:up(e.n,14),f:up(e.f,12),li:up(e.li,1),b:up(e.b,10),bk:C.battKey(e.b),nk:e.nk||'',aid:e.aid||''};
 if(!doc.n) return false;
 Object.assign(doc,{d:e.d,by:'CLUB ADMIN',u:Date.now()});
 try{
  await C.db.collection('b4l').doc(id).set(doc);
  const x=Object.assign({id},doc); C.b4l=C.b4l.filter(b=>b.id!==id).concat([x]);
  if(x.nk) C.b4lByKey[x.nk]=x; if(x.aid) C.b4lByAid[x.aid]=x; bump(); return true;
 }catch(err){ return false; }
};
C.removeB4L=async function(x){
 if(!C.db||!C.admin||!x) return false;
 try{ await C.db.collection('b4l').doc(x.id).delete(); C.b4l=C.b4l.filter(b=>b.id!==x.id); if(x.nk) delete C.b4lByKey[x.nk]; if(x.aid) delete C.b4lByAid[x.aid]; bump(); return true; }catch(e){ return false; }
};
/* headshots load lazily (a few at a time) as cards scroll into view */
C.face=function(id,v){
 if(!id) return null;
 const k=id+'@'+(v||0);
 if(C.faces[k]!==undefined) return C.faces[k];
 if(!C.db||C.faceBusy>=4) return null;
 C.faces[k]=null; C.faceBusy++;
 C.db.doc('faces/'+id).get().then(s=>{ const d=s.exists?s.data():null; if(d&&typeof d.img==='string'&&d.img.indexOf('data:image/')===0) C.faces[k]=d.img; })
  .catch(()=>{ delete C.faces[k]; }).finally(()=>{ C.faceBusy--; });
 return null;
};

/* ---------- announcements: battalion POCs post to their battalion; officers + the club admin to any battalion or all ---------- */
C.canAnnounce=function(){ return G.clubAccess().ok&&(C.canManage()||C.isPoc()); };
C.annTargets=function(){
 if(!C.canAnnounce()) return [];
 const me=G.activeAcct, mine={bk:C.myBk(),b:me.battalion||C.myBk()};
 if(!C.canManage()) return [mine];
 const m=new Map([['ALL',{bk:'ALL',b:'ALL BATTALIONS'}],[mine.bk.replace(/-/g,''),mine]]);
 for(const g of C.people()) if(g.st==='approved'){ const k=String(g.r.bk).replace(/-/g,''); if(!m.has(k)) m.set(k,{bk:g.r.bk,b:g.r.b||g.r.bk}); }
 return [...m.values()];
};
C.AUDS=[{v:'pub',t:'PUBLIC',d:'EVERYONE, SUPPORTERS TOO',col:'#80ffa0'},{v:'mem',t:'MEMBERS',d:'APPROVED MEMBERS',col:'#80e0ff'},{v:'off',t:'OFFICERS',d:'ADMIN, OFFICERS, POCS + POSITIONS',col:'#ffb060'}];
C.audOf=function(x){ return C.AUDS.find(a=>a.v===((x&&x.v)||'mem'))||C.AUDS[1]; };
/* may the signed-in viewer see this post or event? */
C.canSee=function(x){ const v=(x&&x.v)||'mem'; if(v==='pub') return true; if(!G.clubAccess().ok) return false; return v==='mem'||C.isOfficerish(); };
C.myAnns=function(){ const ok=G.clubAccess().ok, bk=C.myBk(); return C.anns.filter(a=>C.canSee(a)&&(!ok||a.bk==='ALL'||C.sameBatt(a.bk,bk))).sort((x,y)=>y.at-x.at); };
C.annUnread=function(){ const seen=((G.save&&G.save.seen)||{}).ann||0, me=myId(); return C.myAnns().filter(a=>a.at>seen&&a.byId!==me); };
C.markAnnSeen=function(){
 const L=C.myAnns(); if(!L.length||!G.save) return;
 if(!G.save.seen) G.save.seen={};
 if(L[0].at>(G.save.seen.ann||0)){ G.save.seen.ann=L[0].at; G.persist(); }
 C.lastAnnN=0;
};
C.canDeleteAnn=function(a){ return !!a&&G.clubAccess().ok&&(a.byId===myId()||C.canManage()||(C.isPoc()&&a.bk!=='ALL'&&C.sameBatt(a.bk,C.myBk()))); };
C.postAnn=async function(tg,t,body,v){
 const me=G.activeAcct; if(!C.db||!me||!tg||!C.annTargets().some(x=>x.bk===tg.bk)) return false;
 const id=Date.now().toString(36)+Math.random().toString(36).slice(2,6);
 const doc={bk:tg.bk,b:tg.b,t:String(t).slice(0,60),body:String(body).slice(0,600),v:AUD[v]?v:'mem',by:me.roadName,byId:me.id,role:C.roleLabel(),at:Date.now()};
 try{ await C.db.collection('ann').doc(id).set(doc); C.anns=[Object.assign({id},doc)].concat(C.anns.filter(a=>a.id!==id)); bump(); return true; }catch(e){ return false; }
};
C.deleteAnn=async function(a){
 if(!C.db||!C.canDeleteAnn(a)) return false;
 try{ await C.db.collection('ann').doc(a.id).delete(); C.anns=C.anns.filter(x=>x.id!==a.id); bump(); return true; }catch(e){ return false; }
};

/* ---------- ON THE HORIZON: real-life events (same posters + audiences as announcements) ---------- */
C.EVTYPES=[{k:'ride',t:'RIDE',col:'#ff9a50'},{k:'benefit',t:'BENEFIT',col:'#ff7aa8'},{k:'fund',t:'FUNDRAISER',col:'#ffd060'},{k:'meet',t:'MEETING',col:'#80e0ff'},
 {k:'key',t:'KEY DATE',col:'#c8a8ff'},{k:'anniv',t:'ANNIVERSARY',col:'#80ffa0'},{k:'other',t:'OTHER',col:'#cfc4b0'}];
C.evType=function(k){ return C.EVTYPES.find(t=>t.k===k)||C.EVTYPES[6]; };
C.canPostEvent=function(){ return C.canAnnounce(); };
C.canEditEvent=function(e){ return !!e&&!e.auto&&G.clubAccess().ok&&(e.byId===myId()||C.canManage()||(C.isPoc()&&e.bk!=='ALL'&&C.sameBatt(e.bk,C.myBk()))); };
C.saveEvent=async function(f,id){
 const me=G.activeAcct; if(!C.db||!me||!C.canPostEvent()) return false;
 const tg=C.annTargets().find(x=>x.bk===f.bk)||C.annTargets()[0]; if(!tg) return false;
 const old=id&&C.events.find(e=>e.id===id);
 if(old&&!C.canEditEvent(old)) return false;
 id=id||Date.now().toString(36)+Math.random().toString(36).slice(2,6);
 const doc={t:String(f.t||'').slice(0,60),d:String(f.d),tm:/^\d{2}:\d{2}$/.test(f.tm||'')?f.tm:'',loc:String(f.loc||'').slice(0,60),note:String(f.note||'').slice(0,400),
  ty:C.EVTYPES.some(t=>t.k===f.ty)?f.ty:'other',v:AUD[f.v]?f.v:'mem',rep:f.rep?'y':'',bk:tg.bk,b:tg.b,
  by:old?old.by:me.roadName,byId:old?old.byId:me.id,role:old?old.role:C.roleLabel(),at:old?old.at:Date.now(),u:Date.now()};
 if(!/^\d{4}-\d{2}-\d{2}$/.test(doc.d)||doc.t.length<3) return false;
 try{ await C.db.collection('events').doc(id).set(doc); C.events=[Object.assign({id},doc)].concat(C.events.filter(e=>e.id!==id)); bump(); return id; }catch(e){ return false; }
};
C.deleteEvent=async function(e){
 if(!C.db||!C.canEditEvent(e)) return false;
 try{ await C.db.collection('events').doc(e.id).delete(); C.events=C.events.filter(x=>x.id!==e.id); bump(); return true; }catch(err){ return false; }
};
/* everything this viewer may see: posted events + (members) Brother-for-Life anniversaries */
C.visibleEvents=function(){
 const out=C.events.filter(e=>C.canSee(e));
 if(G.clubAccess().ok) for(const b of C.b4l) out.push({id:'b4l~'+b.id,auto:true,t:b.n+' • BROTHER FOR LIFE',d:b.d,ty:'anniv',v:'mem',rep:'y',bk:'ALL',b:'',loc:'',note:'Anniversary of the day '+b.n+' earned the title Brother for Life.',by:'B4L',at:0,since:+String(b.d).slice(0,4)});
 return out;
};
C.evUnread=function(){ const seen=((G.save&&G.save.seen)||{}).ev||0, me=myId(); return C.events.filter(e=>C.canSee(e)&&(e.at||0)>seen&&e.byId!==me); };
C.markEvSeen=function(){ if(!G.save) return; if(!G.save.seen) G.save.seen={}; const t=Math.max(0,...C.events.map(e=>e.at||0)); if(t>(G.save.seen.ev||0)){ G.save.seen.ev=t; G.persist(); } };

/* ---------- payment + shop links: only the club admin can set them (enforced by the sharing rules), so nobody
   can swap in their own Venmo. Payments happen on the linked site; the arcade never sees card or bank details. ---------- */
C.cleanUrl=function(u){
 u=String(u||'').trim(); if(!u) return '';
 if(!/^[a-z][a-z0-9+.-]*:/i.test(u)) u='https://'+u;
 try{ const x=new URL(u); if(x.protocol!=='https:'&&x.protocol!=='http:') return null; if(!x.hostname||x.hostname.indexOf('.')<0) return null; return x.href.slice(0,300); }catch(e){ return null; }
};
C.linkLabel=function(u){ try{ const x=new URL(u); return (x.hostname.replace(/^www\./,'')+x.pathname.replace(/\/$/,'')).slice(0,44); }catch(e){ return ''; } };
C.link=function(kind,bk){
 const L=C.links||{}, ok=u=>typeof u==='string'&&u?(C.cleanUrl(u)||''):'';   // only ever an http(s) link
 if(kind==='shop') return ok(L.shop);
 if(!bk) return ok(L.pay);
 return ok((L.bpay||{})[String(bk).replace(/-/g,'')]);
};
C.setLink=async function(kind,url,bk){
 if(!C.db||!C.admin) return false;
 const L=JSON.parse(JSON.stringify(C.links||{}));
 if(kind==='shop') L.shop=url;
 else if(!bk) L.pay=url;
 else { L.bpay=L.bpay||{}; const k=String(bk).replace(/-/g,''); if(url) L.bpay[k]=url; else delete L.bpay[k]; }
 L.u=Date.now();
 try{ await C.db.doc('config/links').set(L); C.links=L; bump(); return true; }catch(e){ return false; }
};

/* ---------- ADMIN OFFICE: the club's formal info (club admin only, enforced by the sharing rules) + documents ---------- */
C.INFO=[{k:'name',t:'LEGAL NAME',max:90,ph:'Raging Knights Firefighters Motorcycle Club, Inc.'},
 {k:'founded',t:'FOUNDED',max:50,ph:'Year and where'},
 {k:'ein',t:'NONPROFIT / EIN',max:60,ph:'e.g. 501(c)(3) • EIN 12-3456789'},
 {k:'mission',t:'MISSION',max:600,multi:true,ph:'What the club stands for'},
 {k:'meet',t:'MEETINGS',max:200,multi:true,ph:'e.g. First Tuesday monthly, 7 PM'},
 {k:'addr',t:'MAILING ADDRESS',max:160,multi:true,ph:'Street or PO box, city, state, ZIP'},
 {k:'email',t:'EMAIL',max:80,ph:'club@example.com'},
 {k:'phone',t:'PHONE',max:30,ph:'Club phone number'},
 {k:'web',t:'WEBSITE',max:200,url:true,ph:'https://…'}];
C.infoField=function(k){ return C.INFO.find(f=>f.k===k)||null; };
C.saveInfo=async function(k,v){
 const f=C.infoField(k); if(!C.db||!C.admin||!f) return false;
 v=String(v||'').trim().slice(0,f.max);
 if(f.url&&v){ v=C.cleanUrl(v); if(!v) return false; }
 const o=Object.assign({},C.info); if(v) o[k]=v; else delete o[k];
 try{ await C.db.doc('config/info').set(Object.assign({},o,{u:Date.now()})); C.info=o; bump(); return true; }catch(e){ return false; }
};
C.DOCCATS=[{k:'bylaws',t:'BYLAWS',col:'#ffd060'},{k:'minutes',t:'MEETING MINUTES',col:'#80e0ff'},{k:'policy',t:'POLICIES',col:'#c8a8ff'},
 {k:'form',t:'FORMS',col:'#80ffa0'},{k:'finance',t:'FINANCE',col:'#ffb060'},{k:'other',t:'OTHER',col:'#cfc4b0'}];
const DOCK={}; C.DOCCATS.forEach(c=>{ DOCK[c.k]=c; });
C.docCat=function(k){ return DOCK[k]||DOCK.other; };
C.DOCMAX=50000;
function docDocs(s){
 return s.docs.map(d=>Object.assign({id:d.id},d.data())).filter(d=>d&&typeof d.t==='string'&&(d.kind==='link'||d.kind==='text')&&(d.v===undefined||AUD[d.v]))
  .map(d=>Object.assign(d,{v:d.v==='off'?'off':'mem',cat:DOCK[d.cat]?d.cat:'other',url:d.kind==='link'?(C.cleanUrl(d.url)||''):''}))   // members or officers (an older PUBLIC one counts as members)
  .filter(d=>d.kind==='text'||d.url);   // shared data is untrusted: a link that isn't http(s) is never listed
}
/* officers + the club admin post, edit and remove documents */
C.canEditDocs=function(){ return C.canManage(); };
C.visibleDocs=function(){ return G.clubAccess().ok?C.docs.filter(d=>C.canSee(d)):[]; };
C.DOCAUDS=[{v:'mem',t:'MEMBERS',d:'EVERY APPROVED MEMBER',col:'#80e0ff'},{v:'off',t:'OFFICERS',d:'ADMIN, OFFICERS, POCS + POSITIONS',col:'#ffb060'}];
C.saveDoc=async function(f,id){
 const me=G.activeAcct; if(!C.db||!me||!C.canEditDocs()) return false;
 const old=id?C.docs.find(d=>d.id===id):null;
 id=id||Date.now().toString(36)+Math.random().toString(36).slice(2,6);
 const kind=f.kind==='text'?'text':'link', url=kind==='link'?C.cleanUrl(f.url):'', body=kind==='text'?String(f.body||'').slice(0,C.DOCMAX):'';
 if(kind==='link'&&!url) return false;
 const now=Date.now();
 const doc={t:String(f.t||'').trim().slice(0,60),cat:DOCK[f.cat]?f.cat:'other',kind,url,n:body.length,v:f.v==='off'?'off':'mem',
  by:old?old.by:me.roadName,byId:old?old.byId:me.id,role:old?old.role:C.roleLabel(),at:old?old.at:now,u:now,ub:me.roadName};
 if(doc.t.length<3) return false;
 try{
  if(kind==='text') await C.db.collection('docb').doc(id).set({b:body,u:now});   // the body first, so a listed text doc always has one
  await C.db.collection('docs').doc(id).set(doc);
  if(kind==='link'&&old&&old.kind==='text') C.db.collection('docb').doc(id).delete().catch(()=>{});
  C.docs=[Object.assign({id},doc)].concat(C.docs.filter(d=>d.id!==id));
  if(kind==='text') C.docBodies[id]={u:now,b:body}; else delete C.docBodies[id];
  bump(); return id;
 }catch(e){ return false; }
};
C.deleteDoc=async function(d){
 if(!C.db||!d||!C.canEditDocs()) return false;
 try{
  await C.db.collection('docs').doc(d.id).delete();
  if(d.kind==='text') C.db.collection('docb').doc(d.id).delete().catch(()=>{});
  C.docs=C.docs.filter(x=>x.id!==d.id); delete C.docBodies[d.id]; bump(); return true;
 }catch(e){ return false; }
};
/* a text document's body, fetched when someone opens it (cached until the document changes) */
C.docBody=async function(d){
 if(!G.clubAccess().ok) return null;
 const c=C.docBodies[d.id]; if(c&&c.u===d.u) return c.b;
 if(!C.db) return null;
 try{
  const s=await C.db.doc('docb/'+d.id).get(), v=s.exists?s.data():null;
  const b=v&&typeof v.b==='string'?v.b.slice(0,C.DOCMAX):'';
  if(C.docs.some(x=>x.id===d.id)) C.docBodies[d.id]={u:d.u,b};
  return b;
 }catch(e){ return null; }
};

/* ---------- confirmed positions straight from the pos docs (no roster): what supporters and the waitlist see ---------- */
C.posBoard=function(){
 const m=new Map();
 for(const id in C.pos){
  const d=C.pos[id]; if(!d||!POSK.has(d.p)||typeof d.n!=='string') continue;
  if(C.status[id]&&C.status[id].st==='denied') continue;
  const k=String(d.bk||'NONE').replace(/-/g,'');
  let bt=m.get(k); if(!bt){ bt={k,bk:d.bk||'NONE',b:d.b||d.bk||'',H:{}}; m.set(k,bt); }
  const L=bt.H[d.p]||(bt.H[d.p]=[]); if(L.indexOf(d.n)<0) L.push(d.n);
 }
 const mine=G.activeAcct&&G.activeAcct.type!=='sup'?String(C.myBk()).replace(/-/g,''):'';
 return [...m.values()].sort((a,b)=>a.k===mine?-1:(b.k===mine?1:String(a.b).localeCompare(String(b.b),undefined,{numeric:true})));
};

/* ---------- the NAMES index: one small card per account - road name / nickname, member or supporter, a supporter's
   first name, a member's battalion (never a member's first name, cell or photo). Sign-up skips names that are taken;
   members and supporters use it to tag riders, credit photos and get in close. ---------- */
C.nameKey=function(n){ return String(n||'').toUpperCase().replace(/[^A-Z0-9]/g,''); };
C.nameDoc=function(a){ const sup=a.type==='sup'; return {n:String(a.roadName||'').slice(0,14),key:C.nameKey(a.roadName),t:sup?'sup':'mem',f:sup?String(a.first||'').slice(0,12):'',b:sup?'':String(a.battalion||'').slice(0,12),u:Date.now()}; };
C.pushName=async function(a){ if(!C.db||C.readOnly||!a||!a.roadName) return; try{ await C.db.collection('names').doc(a.id).set(C.nameDoc(a)); }catch(e){} };
C.takenCache={};
/* is this road name / nickname already someone's in the club? (one small lookup - nobody downloads the list to sign up) */
C.nameTaken=async function(n){
 const k=C.nameKey(n); if(!k) return false;
 const c=C.takenCache[k]; if(c&&Date.now()-c.at<60000) return c.v;
 if(!C.db) return false;
 try{ const s=await C.db.collection('names').where('key','==',k).limit(1).get(); const v=!!(s&&s.docs&&s.docs.length); C.takenCache[k]={v,at:Date.now()}; return v; }
 catch(e){ return false; }
};
/* approved members fill in the index for anyone on the roster (or a supporter) who hasn't signed in since it started */
C.backfillNames=function(){
 if(!C.db||C.readOnly||!G.clubAccess().ok||!C.loaded.roster||!C.loaded.names||C._bfBusy||Date.now()-(C._bfAt||0)<60000) return;
 const have=new Set(C.names.map(x=>x.id)), todo=[];
 for(const r of C.roster) if(!have.has(r.id)&&C.statusOf(r.id,r.ca).st!=='denied') todo.push([r.id,{n:r.n,key:C.nameKey(r.n),t:'mem',f:'',b:String(r.b||''),u:r.ll||r.ca||0}]);
 if(C.loaded.sups) for(const x of C.sups) if(!have.has(x.id)) todo.push([x.id,{n:x.n,key:C.nameKey(x.n),t:'sup',f:String(x.f||''),b:'',u:x.ll||x.ca||0}]);
 if(!todo.length) return;
 C._bfBusy=true; C._bfAt=Date.now();
 (async()=>{ for(const [id,doc] of todo.slice(0,25)){ try{ await C.db.collection('names').doc(id).set(doc); }catch(e){ break; } } C._bfBusy=false; })();
};
/* everyone you can tag on a ride, credit for a photo or get in close with - one entry per person, no denied accounts */
C.directory=function(){
 const seen=new Map();
 for(const x of C.names){
  if(C.status[x.id]&&C.status[x.id].st==='denied') continue;
  const k=x.t+'|'+x.key+'|'+(x.t==='mem'?C.battKey(x.b).replace(/-/g,''):String(x.f||'').toUpperCase());
  const prev=seen.get(k); if(prev&&(prev.u||0)>=(x.u||0)) continue;
  seen.set(k,x);
 }
 return [...seen.values()].map(x=>({id:x.id,n:x.n,t:x.t,f:x.f||'',b:x.b||''})).sort((a,b)=>String(a.n).localeCompare(String(b.n)));
};
C.person=function(id){ const x=C.names.find(n=>n.id===id); return x?{id:x.id,n:x.n,t:x.t,f:x.f||'',b:x.b||''}:null; };

/* ---------- WE'RE CLOSE: everyone here is family - getting in close is for the riders you ride with most. Close riders
   see each other's rides and brag notes. close/<asker>~<other> {st:'ask'|'ok'}; either one can step back. ---------- */
const closeKey=(a,b)=>a+'~'+b;
const strip=x=>{ const o=Object.assign({},x); delete o.id; return o; };
C.closeState=function(otherId){   // 'ok' | 'in' (they asked me) | 'out' (I asked) | ''
 const o=C.closeOut.find(x=>x.b===otherId), i=C.closeIn.find(x=>x.a===otherId);
 if((o&&o.st==='ok')||(i&&i.st==='ok')) return 'ok';
 if(i) return 'in';
 if(o) return 'out';
 return '';
};
C.closeIds=function(){ const s=new Set(); for(const x of C.closeOut) if(x.st==='ok') s.add(x.b); for(const x of C.closeIn) if(x.st==='ok') s.add(x.a); return [...s]; };
C.closeRequests=function(){ return C.closeIn.filter(x=>x.st==='ask'&&C.closeState(x.a)==='in').sort((a,b)=>(b.ts||0)-(a.ts||0)); };
C.closeCircle=function(){
 const out=[];
 for(const id of C.closeIds()){
  const p=C.person(id), o=C.closeOut.find(x=>x.b===id), i=C.closeIn.find(x=>x.a===id);
  out.push(p||{id,n:o?o.bn:(i?i.an:'RIDER'),t:o?o.bt:(i?i.at:'mem'),f:o?(o.bf||''):(i?(i.af||''):''),b:''});
 }
 return out.sort((a,b)=>String(a.n).localeCompare(String(b.n)));
};
C.closeSent=function(){ return C.closeOut.filter(x=>x.st==='ask'&&C.closeState(x.b)==='out').map(x=>C.person(x.b)||{id:x.b,n:x.bn,t:x.bt,f:x.bf||'',b:''}); };
C.getClose=async function(p){
 const me=G.activeAcct; if(!C.db||!me||!p||!p.id||p.id===me.id||!C.viewOk()) return false;
 const inc=C.closeIn.find(x=>x.a===p.id);
 try{
  if(inc){   // they asked first: this accepts
   const d=Object.assign(strip(inc),{st:'ok',u:Date.now()});
   await C.db.collection('close').doc(closeKey(p.id,me.id)).set(d);
   C.closeIn=C.closeIn.filter(x=>x.a!==p.id).concat([Object.assign({id:closeKey(p.id,me.id)},d)]);
  } else {
   const sup=me.type==='sup';
   const d={a:me.id,an:me.roadName,at:sup?'sup':'mem',af:sup?String(me.first||''):'',b:p.id,bn:p.n,bt:p.t||'mem',bf:p.f||'',st:'ask',ts:Date.now(),u:Date.now()};
   await C.db.collection('close').doc(closeKey(me.id,p.id)).set(d);
   C.closeOut=C.closeOut.filter(x=>x.b!==p.id).concat([Object.assign({id:closeKey(me.id,p.id)},d)]);
  }
  bump(); return true;
 }catch(e){ return false; }
};
C.stepBack=async function(otherId){   // decline a request, cancel mine, or step back from someone close
 const me=myId(); if(!C.db||!me||!otherId) return false;
 let ok=true;
 for(const k of [closeKey(me,otherId),closeKey(otherId,me)]){ try{ await C.db.collection('close').doc(k).delete(); }catch(e){ ok=false; } }
 C.closeOut=C.closeOut.filter(x=>x.b!==otherId); C.closeIn=C.closeIn.filter(x=>x.a!==otherId); bump();
 return ok;
};

/* ---------- shared rides: the rider, everyone tagged on it and the rider's close circle see it. rides/<id> ---------- */
C.rideDoc=function(r){
 const me=G.activeAcct, sup=me.type==='sup', riders=(r.riders||[]).slice(0,40).map(p=>({id:String(p.id||''),n:String(p.n||'').slice(0,14),t:p.t==='sup'?'sup':'mem',f:String(p.f||'').slice(0,12)}));
 return {by:me.roadName,byId:me.id,bt:sup?'sup':'mem',bf:sup?String(me.first||''):'',d:r.date,mi:r.miles,bike:r.bike||'',ty:r.note||'',where:String(r.where||'').slice(0,60),
  riders,tag:riders.map(p=>p.id).filter(Boolean),brag:String(r.brag||'').slice(0,1000),ph:(r.ph||[]).slice(0,60),at:r.at||Date.now(),u:Date.now()};
};
C.canShareRides=function(){ return !!C.db&&!!G.activeAcct&&C.viewOk(); };
C.publishRide=async function(r){
 if(!C.canShareRides()||!r||!r.rid) return false;
 try{ await C.db.collection('rides').doc(r.rid).set(C.rideDoc(r)); return true; }catch(e){ return false; }
};
C.unpublishRide=async function(rid){ if(!C.db||!rid) return false; try{ await C.db.collection('rides').doc(rid).delete(); return true; }catch(e){ return false; } };
C.rideDocs=function(s){ return s.docs.map(d=>Object.assign({id:d.id},d.data())).filter(x=>x&&typeof x.by==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(String(x.d||''))&&typeof x.mi==='number'); };

/* ---------- PHOTO ALBUM: approved members upload; a supporter sees it once a club officer makes the motion and a
   second club officer seconds it. Photos stay: only a club officer or the club admin can take one down.
   pho/<id> the details, phot/<id> a small thumbnail, phof/<id> the photo; phacc/<supporter> the access motion. ---------- */
C.isPhotoOfficer=function(){ return !!G.activeAcct&&G.clubAccess().ok&&(C.admin||C.isOfficer()); };
C.canUploadPhotos=function(){ return !!C.db&&!!G.activeAcct&&G.clubAccess().ok; };
C.photoAccess=function(){   // member | granted | motion (1 of 2) | asked | denied | none (supporter, not asked yet) | checking | locked
 const a=G.clubAccess(); if(a.ok) return 'member';
 if(a.reason!=='supporter') return 'locked';
 if(!C.loaded.phacc) return 'checking';
 const x=C.myPhacc; if(!x) return 'none';
 if(x.st==='ok'&&x.m&&x.s&&x.m.id!==x.s.id) return 'granted';
 if(x.st==='no') return 'denied';
 return x.m?'motion':'asked';
};
C.canViewPhotos=function(){ const p=C.photoAccess(); return p==='member'||p==='granted'; };
C.requestPhotos=async function(){
 const me=G.activeAcct, p=C.photoAccess(); if(!C.db||!me||me.type!=='sup'||(p!=='none'&&p!=='denied')) return false;
 const d={n:me.roadName,f:String(me.first||''),loc:String(me.loc||''),st:'ask',m:null,s:null,rq:Date.now(),u:Date.now()};
 try{ await C.db.collection('phacc').doc(me.id).set(d); C.myPhacc=d; bump(); return true; }catch(e){ return false; }
};
/* officers' queue: requests still waiting (newest first), and who already has access */
C.photoQueue=function(){ return C.phacc.filter(x=>x.st==='ask').sort((a,b)=>(b.rq||0)-(a.rq||0)); };
C.photoGranted=function(){ return C.phacc.filter(x=>x.st==='ok'&&x.m&&x.s).sort((a,b)=>String(a.n).localeCompare(String(b.n))); };
C.photoTodo=function(){ const me=myId(); return C.isPhotoOfficer()?C.photoQueue().filter(x=>!x.m||x.m.id!==me):[]; };
C.motionPhotos=async function(x){   // the first officer makes the motion; a different officer seconds it and access opens
 const me=G.activeAcct; if(!C.db||!me||!x||!C.isPhotoOfficer()) return false;
 const who={n:C.admin?'CLUB ADMIN':me.roadName,id:me.id,at:Date.now()}, d=strip(x);
 if(!d.m) d.m=who;
 else if(d.m.id===me.id) return 'self';
 else { d.s=who; d.st='ok'; }
 d.u=Date.now();
 try{ await C.db.collection('phacc').doc(x.id).set(d); C.phacc=C.phacc.filter(y=>y.id!==x.id).concat([Object.assign({id:x.id},d)]); bump(); return d.st==='ok'?'granted':'motion'; }
 catch(e){ return false; }
};
C.denyPhotos=async function(x){   // decline a request, or take access away again
 const me=G.activeAcct; if(!C.db||!me||!x||!C.isPhotoOfficer()) return false;
 const d=Object.assign(strip(x),{st:'no',m:null,s:null,by:C.admin?'CLUB ADMIN':me.roadName,u:Date.now()});
 try{ await C.db.collection('phacc').doc(x.id).set(d); C.phacc=C.phacc.filter(y=>y.id!==x.id).concat([Object.assign({id:x.id},d)]); bump(); return true; }catch(e){ return false; }
};
C.PHOTO_CAP=190000;   // a stored photo stays under ~190 KB of text (the database's 256 KiB-per-document limit)
C.phoDocs=function(s){ return s.docs.map(d=>Object.assign({id:d.id},d.data())).filter(x=>x&&typeof x.byId==='string'&&typeof x.at==='number'&&/^\d{4}-\d{2}-\d{2}$/.test(String(x.d||''))); };
async function retrying(fn){
 for(let i=0;;i++){
  try{ return await fn(); }
  catch(e){ const c=e&&e.code; if(i<3&&(c==='resource_exhausted'||c==='unavailable')){ await new Promise(r=>setTimeout(r,700*(i+1))); continue; } throw e; }
 }
}
/* one photo: the picture, its thumbnail, then the details (so a listed photo always has its picture) */
C.savePhoto=async function(p){
 const me=G.activeAcct; if(!C.db||!me||!C.canUploadPhotos()) return {err:'not_member'};
 if(!p||typeof p.full!=='string'||p.full.length>C.PHOTO_CAP+40000||typeof p.thumb!=='string') return {err:'too_big'};
 const id=Date.now().toString(36)+Math.random().toString(36).slice(2,7), cr=p.cr||{};
 const meta={by:me.roadName,byId:me.id,cr:String(cr.n||me.roadName).slice(0,24),crId:String(cr.id||(cr.n?'':me.id)),crT:cr.t||(cr.n?'':'mem'),
  d:/^\d{4}-\d{2}-\d{2}$/.test(p.d||'')?p.d:C.today(),loc:String(p.loc||'').slice(0,60),desc:String(p.desc||'').slice(0,300),b:String(p.b||''),ride:String(p.ride||''),
  w:p.w|0,h:p.h|0,at:Date.now(),u:Date.now()};
 try{
  await retrying(()=>C.db.collection('phof').doc(id).set({img:p.full}));
  await retrying(()=>C.db.collection('phot').doc(id).set({t:p.thumb}));
  await retrying(()=>C.db.collection('pho').doc(id).set(meta));
  C.thumbs[id]=p.thumb; C.fulls[id]=p.full;
  return {id,meta:Object.assign({id},meta)};
 }catch(e){ return {err:(e&&e.code)||'failed'}; }
};
/* thumbnails load a few at a time as the grid scrolls; the full photo when it's opened */
C.thumb=function(id){
 if(C.thumbs[id]!==undefined) return C.thumbs[id];
 if(!C.db||C.thumbBusy>=6) return null;
 C.thumbs[id]=null; C.thumbBusy++;
 C.db.doc('phot/'+id).get().then(s=>{ const d=s.exists?s.data():null; if(d&&typeof d.t==='string'&&d.t.indexOf('data:image/')===0) C.thumbs[id]=d.t; })
  .catch(()=>{ setTimeout(()=>{ if(C.thumbs[id]===null) delete C.thumbs[id]; },5000); }).finally(()=>{ C.thumbBusy--; });   // a failed load retries after a pause
 return null;
};
C.fullPhoto=async function(id){
 if(C.fulls[id]) return C.fulls[id];
 if(!C.db||!C.canViewPhotos()) return null;
 try{ const s=await C.db.doc('phof/'+id).get(), d=s.exists?s.data():null; if(d&&typeof d.img==='string'&&d.img.indexOf('data:image/')===0){ C.fulls[id]=d.img; return d.img; } }catch(e){}
 return null;
};
C.canEditPhoto=function(m){ return !!m&&!!G.activeAcct&&G.clubAccess().ok&&(m.byId===myId()||C.isPhotoOfficer()); };
/* the uploader can fix the date, place and caption; a club officer (or the club admin) can also change the credit */
C.editPhoto=async function(m,ch){
 if(!C.db||!C.canEditPhoto(m)) return false;
 const d=strip(m);
 if(ch.d&&/^\d{4}-\d{2}-\d{2}$/.test(ch.d)) d.d=ch.d;
 if(ch.loc!=null) d.loc=String(ch.loc).slice(0,60);
 if(ch.desc!=null) d.desc=String(ch.desc).slice(0,300);
 if(ch.cr&&C.isPhotoOfficer()){ d.cr=String(ch.cr.n||'').slice(0,24)||d.by; d.crId=String(ch.cr.id||''); d.crT=ch.cr.t||''; }
 d.u=Date.now(); d.ub=G.activeAcct.roadName;
 try{ await C.db.collection('pho').doc(m.id).set(d); return Object.assign({id:m.id},d); }catch(e){ return false; }
};
C.removePhoto=async function(m){
 if(!C.db||!m||!C.isPhotoOfficer()) return false;
 try{ await C.db.collection('pho').doc(m.id).delete(); }catch(e){ return false; }
 for(const col of ['phot','phof']) C.db.collection(col).doc(m.id).delete().catch(()=>{});
 delete C.thumbs[m.id]; delete C.fulls[m.id]; return true;
};

/* ---------- Battalion / Nationwide boards ---------- */
C.docFor=function(acct,save){
 const mo=monthKey(); let mi=0, mm=0;
 for(const m of (save.mileage||[])){ mi+=m.miles; if(String(m.date).slice(0,7)===mo) mm+=m.miles; }
 return {n:acct.roadName,b:acct.battalion||'',bk:C.battKey(acct.battalion),p:Math.round(save.points||0),mi,mm,mo,u:Date.now()};
};
/* queue a write of the signed-in member's totals: throttled, coalesced, one write at a time */
C.touch=function(now){
 if(!C.db||C.readOnly||!G.activeAcct||G.activeAcct.type==='sup') return;
 C.dirty=true;
 if(C.pending) return;
 C.pending=true;
 setTimeout(C.flush,now?0:Math.max(0,4000-(Date.now()-C.last)));
};
C.flush=async function(){
 if(!C.dirty||!C.db||!G.activeAcct||G.activeAcct.type==='sup'){ C.pending=false; C.dirty=false; return; }
 C.dirty=false;
 const a=G.activeAcct, doc=C.docFor(a,G.save);
 const sig=a.id+JSON.stringify([doc.n,doc.b,doc.p,doc.mi,doc.mm,doc.mo]);
 if(sig===C.lastSig){ C.pending=false; return; }
 try{ await C.db.collection('board').doc(a.id).set(doc); C.lastSig=sig; C.last=Date.now(); }
 catch(e){ if(e&&(e.code==='invalid_argument'||e.code==='not_granted'||e.code==='revoked')) C.readOnly=true; }
 C.pending=false;
 if(C.dirty) C.touch();
};
C.removeAccount=async function(acct){
 if(!C.db||C.readOnly) return;
 for(const col of (acct.type==='sup'?['sup','names','phacc']:['board','roster','faces','status','pos','names'])){ try{ await C.db.collection(col).doc(acct.id).delete(); }catch(e){} }
 for(const k of C.acks.filter(k=>k.a===acct.id||k.v===acct.id)){ try{ await C.db.collection('acks').doc(k.a+'~'+k.v).delete(); }catch(e){} }
};
const notDenied=r=>C.statusOf(r.id).st!=='denied';
C.rowsFor=function(bk){ return C.board.filter(r=>r.bk===bk&&notDenied(r)).sort((a,b)=>b.p-a.p); };
C.boardRows=function(){ return C.board.filter(notDenied).sort((a,b)=>b.p-a.p); };
C.battalions=function(){
 const m={}, mo=monthKey();
 for(const r of C.boardRows()){
  const k=r.bk||'NONE', e=m[k]||(m[k]={bk:k,name:r.b||k,members:0,p:0,mm:0});
  e.members++; e.p+=r.p||0; if(r.mo===mo) e.mm+=r.mm||0;
 }
 return Object.values(m).sort((a,b)=>b.p-a.p);
};

/* ---------- shared lock panel (members-only: roster, chats, waitlist, console | kind 'view': positions, B4L) ---------- */
G.LockPanel=function(kind){
 return { st:{f:0},
  rects(top){
   const inf=G.lockInfo(kind), VH=G.VH, n=inf?inf.lines.length:0, h=124+n*15;
   const y=Math.max(top,Math.min(VH-h-110,top+(VH-top-h-110)*.35));
   const B=[];
   if(inf&&inf.guest) B.push({id:'join',label:'CREATE AN ACCOUNT',kind:'primary',x:28,y:y+h+14,w:214,h:42,size:8.5},{id:'login',label:kind==='view'||kind==='photos'||kind==='rides'?'LOG IN':'MEMBER LOGIN',x:28,y:y+h+64,w:214,h:36,size:8});
   else if(inf&&inf.waitlist&&G.sceneName!=='waitlist') B.push({id:'wait',label:'SEE MY WAITLIST CARD',kind:'ghost',x:28,y:y+h+14,w:214,h:36,size:8});
   return {x:14,y,w:242,h,btns:B,inf};
  },
  update(top){
   const R=this.rects(top), id=G.navList(this.st,R.btns);
   if(id==='join'){ G.wiz=null; G.go('createacct',{},true); }
   else if(id==='login') G.go('login');
   else if(id==='wait') G.go('waitlist');
  },
  draw(c,top){
   const R=this.rects(top), inf=R.inf; if(!inf) return;
   G.panel(R.x,R.y,R.w,R.h,{border:'rgba(255,255,255,.16)'});
   c.beginPath(); c.arc(G.VW/2,R.y+36,21,0,7); c.fillStyle='rgba(255,255,255,.07)'; c.fill();
   G.icon('lock',c,G.VW/2,R.y+37,24,inf.col);
   G.txt(inf.title,G.VW/2,R.y+66,10,inf.col,'center',R.w-20,800);
   inf.lines.forEach((l,i)=>G.txt(l,G.VW/2,R.y+92+i*15,6.4,'#e0d6c4','center',R.w-18,700));
   G.txt(inf.guest?(kind==='view'||kind==='photos'||kind==='rides'?'ALREADY SIGNED UP? LOG IN WITH YOUR PIN.':'ALREADY A MEMBER? LOG IN WITH YOUR PIN.'):'TAP BACK TO KEEP PLAYING.',G.VW/2,R.y+R.h-20,6,'#9a8f80','center',R.w-20,700);
   G.drawBtns(R.btns,this.st);
  }
 };
};

// keep the board + roster current whenever points change or a member signs in
const award=G.award; G.award=function(p,l){ award(p,l); C.touch(); };
const login=G.loginAs; G.loginAs=function(a){ login(a); a.lastLogin=Date.now(); G.saveRoster(); C.touch(true); C.pushRoster(a,true); C.onLogin(); };
const logout=G.logout; G.logout=function(){ logout(); C.lastPendingN=-1; C.lastAckN=-1; C.lastAnnN=-1; C.lastPosN=-1; C.lastOffT=-1; C.syncAccess(); };
C.init();
})();
