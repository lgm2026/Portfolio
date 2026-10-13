/* BLACKJACK at Mawmaw's table (picnic yard).
   SOLO: 8 hands against Mawmaw. CLUB TABLE: approved members who are on play the same hands live, each against the
   dealer (never against each other). Points only - no betting, no wagering, nothing of value.
   Cards come from a seeded hash (an endless shoe), so everyone at the club table computes the same dealer hand and
   everyone's cards from the round number alone: nobody has to host the table. */
(function(){
const VW=G.VW, K=G.gameKit;
const PTS={bj:60,win:40,push:10,lose:0};
const RANK=['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const SOLO_HANDS=8, TURN_S=25, WAIT_S=30, FRESH=45000, SEATS=5, HB=15;
const MAW={shirt:'#301e2a',vest:'#15151d',skin:'#e0b080',trim:'#ff9ad0'}, MAWAV={hair:'#d9dae4',gender:'f',bun:true};

/* ---------- cards ---------- */
function h32(s){ let h=0x811c9dc5; for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,0x01000193); }
 h^=h>>>16; h=Math.imul(h,0x85ebca6b); h^=h>>>13; h=Math.imul(h,0xc2b2ae35); h^=h>>>16; return h>>>0; }
const card=(seed,who,i)=>{ const h=h32(seed+'|'+who+'|'+i); return {r:h%13,s:(h>>>8)&3}; };
function total(cs){ let t=0,a=0; for(const c of cs){ if(c.r===0){ a++; t+=11; } else t+=Math.min(10,c.r+1); } while(t>21&&a){ t-=10; a--; } return {t,soft:a>0}; }
const natural=cs=>cs.length===2&&total(cs).t===21;
function dealerCards(seed){ const d=[card(seed,'D',0),card(seed,'D',1)]; for(let i=2;total(d).t<17;i++) d.push(card(seed,'D',i)); return d; }   // stands on all 17s
function handOf(seed,id,hits){ const p=[]; for(let i=0;i<2+hits;i++) p.push(card(seed,id,i)); return p; }
function outcome(p,d){ const pv=total(p).t, dv=total(d).t, pn=natural(p), dn=natural(d);
 if(pn&&dn) return 'push'; if(pn) return 'bj'; if(dn||pv>21) return 'lose'; if(dv>21) return 'win'; return pv>dv?'win':(pv<dv?'lose':'push'); }
const hitsOf=m=>(String(m||'').match(/h/g)||[]).length;
const rk=t=>t.salt+':'+t.r;   // a club-table round: also the seed everyone deals from
G.bj={card,total,natural,dealerCards,handOf,outcome};   // shared with QA

/* ---------- drawing helpers ---------- */
const RED='#c8243a', INK='#1c1a24';
function suitPath(c,s){
 c.beginPath();
 if(s===1){ c.moveTo(0,8); c.bezierCurveTo(-12,0,-9,-10,0,-4); c.bezierCurveTo(9,-10,12,0,0,8); }                 // hearts
 else if(s===2){ c.moveTo(0,-10); c.lineTo(7.5,0); c.lineTo(0,10); c.lineTo(-7.5,0); c.closePath(); }             // diamonds
 else if(s===0){ c.moveTo(0,-10); c.bezierCurveTo(-12,-1,-9,9,0,4); c.bezierCurveTo(9,9,12,-1,0,-10);             // spades
  c.moveTo(0,2); c.lineTo(-3.6,10); c.lineTo(3.6,10); c.closePath(); }
 else { c.arc(0,-4.6,4.4,0,7); c.moveTo(-0.4,2.2); c.arc(-4.8,2.2,4.4,0,7); c.moveTo(9.2,2.2); c.arc(4.8,2.2,4.4,0,7);   // clubs
  c.moveTo(0,0); c.lineTo(-3.4,10); c.lineTo(3.4,10); c.closePath(); }
}
function drawSuit(c,s,x,y,sz,col){ c.save(); c.translate(x,y); c.scale(sz/20,sz/20); c.fillStyle=col; suitPath(c,s); c.fill(); c.restore(); }
function drawCard(c,x,y,w,h,cd,up,sx){   // sx: horizontal squeeze while flipping (1 = flat)
 const r=Math.max(2,w*.12);
 c.save();
 if(sx!=null&&sx<1){ c.translate(x+w/2,0); c.scale(Math.max(.03,sx),1); c.translate(-(x+w/2),0); }
 c.fillStyle='rgba(0,0,0,.32)'; G.rrect(x+1,y+2,w,h,r); c.fill();
 if(!up||!cd){
  G.rrect(x,y,w,h,r); c.fillStyle='#24202e'; c.fill();
  c.save(); G.rrect(x+2,y+2,w-4,h-4,r*.7); c.clip();
  c.strokeStyle='rgba(240,120,24,.2)'; c.lineWidth=1;
  for(let k=0;k<w+h;k+=4){ c.beginPath(); c.moveTo(x+k,y); c.lineTo(x+k-h,y+h); c.stroke(); }
  c.restore();
  c.strokeStyle='#f07818'; c.lineWidth=Math.max(.8,w*.035); G.rrect(x+2.5,y+2.5,w-5,h-5,r*.7); c.stroke();
  if(G.img.crest_sm&&w>=26){ const s=w*.5; c.drawImage(G.img.crest_sm,x+w/2-s/2,y+h/2-s*.53,s,s*1.06); }
 } else {
  G.rrect(x,y,w,h,r); c.fillStyle='#fbf6ea'; c.fill(); c.strokeStyle='rgba(0,0,0,.25)'; c.lineWidth=.8; c.stroke();
  const col=(cd.s===1||cd.s===2)?RED:INK, rs=RANK[cd.r];
  G.txt(rs,x+w*.08,y+h*.05,w*(rs.length>1?.19:.22),col,'left',undefined,800);
  drawSuit(c,cd.s,x+w*.19,y+h*.37,h*.13,col);
  if(cd.r>=10){
   G.rrect(x+w*.34,y+h*.2,w*.56,h*.7,2); c.strokeStyle=col; c.globalAlpha=.45; c.lineWidth=1; c.stroke(); c.globalAlpha=1;
   G.txt(rs,x+w*.62,y+h*.27,w*.3,col,'center',undefined,800);
   drawSuit(c,cd.s,x+w*.62,y+h*.72,h*.17,col);
  } else drawSuit(c,cd.s,x+w*.6,y+h*.63,h*.4,col);
 }
 c.restore();
}
G.bjDraw={drawCard,drawSuit};
/* felt print that follows the curve of the table */
function arcText(c,s,cx,cy,R,size,col){
 c.save(); c.font=G.font(size,800); c.fillStyle=col; c.textAlign='center'; c.textBaseline='middle';
 let a=Math.PI/2+c.measureText(s).width/2/R;
 for(const ch of s){ const w=c.measureText(ch).width; a-=w/2/R;
  c.save(); c.translate(cx+R*Math.cos(a),cy+R*Math.sin(a)); c.rotate(a-Math.PI/2); c.fillText(ch,0,0); c.restore(); a-=w/2/R; }
 c.restore();
}

G.scenes.blackjack={
 enter(){
  this.pause=G.Pause({restart:['blackjack'],quit:['picnicselect'],quitLabel:'QUIT TO PICNIC YARD'});
  this.st={f:0}; this.msg=''; this.msgT=0; this.modal=null;
  this.mode='menu'; this.state='menu'; this.phase='idle';
  this.cur=0; this.lastR=0; this.lastKey=null; this.seed=''; this.dealer=[]; this.hits=0; this.moves=''; this.myDone=true; this.res=null;
  this.cards={p:[],d:[]}; this.flipT0=-9;
  this.sess={hands:0,wins:0,pts:0};
  this.net=null; this.netOpen();
  const again=this.again; this.again=null;
  if(again==='solo') this.startSolo();
  else if(again==='table'&&this.tableOk().ok) this.startTable();
  else this.showMenu();
  AUDIO.play('poker');
 },
 exit(next){ this.netClose(); if(next!=='blackjack') this.again=null; },
 say(m,col){ this.msg=m; this.msgCol=col||'#ffd060'; this.msgT=1.6; },
 /* ---------- who may sit at the club table ---------- */
 tableOk(){
  const C=G.club;
  if(!G.activeAcct) return {ok:false,why:'MEMBERS & SUPPORTERS • LOG IN TO SIT DOWN'};
  const a=G.clubAccess();   // members, supporters and the waitlist sit down; guests and denied accounts play solo
  if(!C||!C.viewOk()) return {ok:false,why:a.reason==='checking'?'CHECKING YOUR MEMBERSHIP…':'NOT AVAILABLE ON THIS ACCOUNT'};
  if(!C||!C.db) return {ok:false,why:'NEEDS THE CLUB NETWORK'};
  return {ok:true};
 },
 showMenu(){
  this.mode='menu'; this.state='menu'; this.phase='idle';
  const t=this.tableOk();
  this.modal=G.Modal({title:'MAWMAW’S TABLE',sub:'BLACKJACK • DEALER STANDS ON 17',btnH:46,
   lines:[['GET CLOSER TO 21 THAN MAWMAW','#e8dcc8',7.5],['WIN 40 • BLACKJACK 60 • PUSH 10','#ffd060',7.5],['POINTS ONLY • NO BETTING, EVER','#9a8f80',6.5]],
   btns:[{id:'solo',label:'PLAY SOLO',sub:SOLO_HANDS+' HANDS VS MAWMAW',kind:'primary'},
    {id:'table',label:'CLUB TABLE',sub:t.ok?this.tableSub():t.why,disabled:!t.ok},
    {id:'back',label:'BACK TO PICNIC YARD',kind:'ghost'}]});
  this.onModal=r=>{ if(r==='solo') this.startSolo(); else if(r==='table') this.startTable(); else G.go('picnicselect'); };
 },
 tableSub(){ const n=this.net?this.present().length:0; return n?(n+' PLAYER'+(n===1?'':'S')+' AT THE TABLE NOW'):'PLAY LIVE WITH WHOEVER’S ON'; },
 /* ---------- the shared table: bj/table {r,salt,at,by} + one bj/s~<member> seat doc per member ---------- */
 netOpen(){
  if(this.net||!this.tableOk().ok) return;
  const C=G.club, me=G.activeAcct;
  const n=this.net={me:me.id,name:(G.save.roadName||me.roadName||'MEMBER').toUpperCase(),sup:me.type==='sup'?1:0,tbl:null,tSeen:0,seats:new Map(),prevU:{},seen:{},hb:0,seated:false,tLoaded:false,sLoaded:false,un:[],j:0,swept:{}};
  try{
   n.un.push(C.db.doc('bj/table').onSnapshot(d=>this.onTable(d),()=>{ n.err=true; }));
   // newest seats first, so seats left behind by closed apps can never crowd out the live ones
   n.un.push(C.db.collection('bj').orderBy('u','desc').limit(40).onSnapshot(s=>this.onSeats(s),()=>{ n.err=true; }));
  }catch(e){ n.err=true; }
 },
 loaded(){ const n=this.net; return !!(n&&n.tLoaded&&n.sLoaded); },
 netClose(){
  const n=this.net; if(!n) return;
  this.leaveSeat();
  for(const u of n.un){ try{ u(); }catch(e){} }
  this.net=null;
 },
 onTable(d){
  const n=this.net; if(!n) return;
  const v=d&&d.exists?d.data():null, tbl=v&&typeof v.r==='number'&&typeof v.salt==='string'?v:null, now=Date.now();
  // a deal that shows up while we watch is fresh; on first load only trust one that's seconds old
  if(tbl&&(!n.tbl||rk(tbl)!==rk(n.tbl))) n.tSeen=(n.tLoaded||Math.abs(now-(+tbl.at||0))<15000)?now:0;
  n.tbl=tbl;
  if(!n.tLoaded){ n.tLoaded=true; this.settle0(); }
 },
 onSeats(s){
  const n=this.net; if(!n) return;
  const now=Date.now(), seats=new Map();
  for(const d of s.docs){
   const v=d.data(); if(!v||typeof v!=='object'||d.id.indexOf('s~')!==0||typeof v.n!=='string') continue;
   const id=d.id.slice(2);
   if(id!==n.me&&now-(+v.u||0)>6*3600e3){   // tidy up a seat left behind by a closed app
    if(!n.swept[id]){ n.swept[id]=1; G.club.db.collection('bj').doc(d.id).delete().catch(()=>{}); }
    continue;
   }
   seats.set(id,v);
   if(n.prevU[id]!==v.u){ if(n.prevU[id]!==undefined||Math.abs(now-(+v.u||0))<600000) n.seen[id]=now; n.prevU[id]=v.u; }
  }
  for(const id of Object.keys(n.seen)) if(!seats.has(id)){ delete n.seen[id]; delete n.prevU[id]; }
  n.seats=seats;
  if(!n.sLoaded){ n.sLoaded=true; this.settle0(); }
 },
 /* sitting down: a hand that already finished isn't mine to join (one still being played is) */
 settle0(){
  if(this.mode!=='table'||this.lastKey!==null||!this.loaded()) return;
  const t=this.net.tbl; this.lastKey=t&&!this.inProgress(t.r)?rk(t):'';
 },
 present(){
  const n=this.net; if(!n) return [];
  const now=Date.now(), out=[];
  for(const [id,v] of n.seats){ if(id===n.me) continue; if(now-(n.seen[id]||0)<FRESH) out.push(Object.assign({id},v)); }
  out.sort((a,b)=>(a.j||0)-(b.j||0));
  return out.slice(0,SEATS-1);
 },
 inRound(r){ return this.present().filter(s=>s.r===r); },
 inProgress(r){ return this.inRound(r).some(s=>!s.d); },
 writeSeat(){
  const n=this.net; if(!n||!n.seated) return;
  n.hb=0;
  const doc={n:n.name,r:this.cur||0,m:this.moves||'',d:this.myDone?1:0,u:Date.now(),j:n.j||(n.j=Date.now()),s:n.sup};   // s: a supporter (♥ at the table)
  G.club.db.collection('bj').doc('s~'+n.me).set(doc).catch(()=>{});
 },
 leaveSeat(){
  const n=this.net; if(!n||!n.seated) return;
  n.seated=false;
  try{ G.club.db.collection('bj').doc('s~'+n.me).delete().catch(()=>{}); }catch(e){}
 },
 deal(){
  const n=this.net; if(!n||!this.loaded()) return;
  const t=n.tbl, prev=n.tbl, prevSeen=n.tSeen, d=new Date();
  // the round number only ever goes up; a brand-new table's salt is the date, so two first deals at once still agree
  const doc={r:Math.max(t?t.r:0,this.cur||0)+1,salt:t&&t.salt?t.salt:'rk'+d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate(),at:Date.now(),by:n.name};
  n.tbl=doc; n.tSeen=Date.now();
  G.club.db.doc('bj/table').set(doc).catch(()=>{
   if(this.net===n&&n.tbl===doc){ n.tbl=prev; n.tSeen=prevSeen; }
   G.toast('COULDN’T REACH THE TABLE - TRY AGAIN','#ff8a70');
  });
 },
 joinable(){
  const n=this.net, t=n&&n.tbl;
  if(!t||this.lastKey===null||rk(t)===this.lastKey) return false;
  return this.inProgress(t.r)||Date.now()-n.tSeen<10000;
 },
 /* ---------- modes ---------- */
 startSolo(){
  this.netClose();
  this.mode='solo'; this.state='play'; this.myId='P';
  this.solo={n:0,wins:0,pts:0};
  this.nextSolo();
 },
 nextSolo(){ this.solo.n++; this.startRound(this.solo.n,'S'+Math.random().toString(36).slice(2,10)); },
 startTable(){
  const t=this.tableOk(); if(!t.ok){ G.toast(t.why,'#ff8a70'); this.showMenu(); return; }
  this.netOpen();
  if(!this.net){ this.showMenu(); return; }
  if(this.present().length>=SEATS-1){ G.toast('THE TABLE IS FULL ('+SEATS+' SEATS) - PLAY SOLO FOR NOW','#ffd27a'); this.showMenu(); return; }
  this.mode='table'; this.state='play'; this.phase='idle'; this.myId=this.net.me;
  this.cur=0; this.myDone=true; this.moves=''; this.res=null; this.cards={p:[],d:[]};
  this.lastKey=null; this.settle0();
  this.net.seated=true; this.writeSeat();
  this.sess={hands:0,wins:0,pts:0};
  AUDIO.sfx('ok'); this.say('YOU SIT DOWN AT THE CLUB TABLE','#80ffa0');
 },
 /* ---------- a hand ---------- */
 startRound(r,seed){
  this.cur=r; this.lastR=r; this.seed=seed; this.dealer=dealerCards(seed);
  this.hits=0; this.moves=''; this.myDone=false; this.res=null;
  this.cards={p:[],d:[]}; this.flipT0=-9;
  this.phase='deal'; this.q=[['p',0],['d',0],['p',1],['d',1]]; this.qT=.12; this.lastCardT=G.time;
  this.turnT=TURN_S; this.waitT=0; this.st={f:0};
  if(this.mode==='table') this.writeSeat();
 },
 myHand(){ return handOf(this.seed,this.myId,this.hits); },
 afterDeal(){
  const p=this.myHand();
  if(natural(this.dealer)){ this.say('MAWMAW HAS BLACKJACK','#ff9ad0'); AUDIO.sfx('buzzer'); this.finishMine(); return; }   // the dealer peeks
  if(natural(p)){ this.say('BLACKJACK!','#80ffa0'); AUDIO.sfx('cheer'); G.ach('bj21'); this.finishMine(); return; }
  this.phase='play'; this.turnT=TURN_S;
 },
 hit(){
  this.hits++; this.moves+='h'; this.cards.p.push({i:1+this.hits,t0:G.time}); this.lastCardT=G.time; AUDIO.sfx('card');
  const t=total(this.myHand()).t;
  if(t>21){ this.say('BUST!','#ff8a70'); AUDIO.sfx('buzzer'); this.finishMine(); }
  else if(t===21){ this.say('21!','#80ffa0'); this.finishMine(); }
  else if(this.mode==='table') this.writeSeat();
 },
 finishMine(){
  this.myDone=true; if(this.moves.slice(-1)!=='s') this.moves+='s';
  if(this.mode==='table') this.writeSeat();
  this.phase='wait'; this.waitT=0;
 },
 waitingOn(){ return this.mode==='table'?this.inRound(this.cur).filter(s=>!s.d):[]; },
 startReveal(){
  this.phase='reveal'; this.revT=0; this.flipT0=G.time; AUDIO.sfx('card');
  // Mawmaw only draws if somebody still has a live hand
  const hands=[this.myHand()];
  if(this.mode==='table') for(const s of this.inRound(this.cur)) if(s.d) hands.push(handOf(this.seed,s.id,hitsOf(s.m)));
  const live=hands.some(h=>total(h).t<=21&&!natural(h))&&!natural(this.dealer);
  this.dTarget=live?this.dealer.length:2; this.nextDT=.8;
 },
 settle(){
  const res=this.res=outcome(this.myHand(),this.dealer), pts=PTS[res];
  this.phase='result'; this.resT=0; this.st={f:0};
  AUDIO.sfx(res==='lose'?'thud':(res==='push'?'blip':'bigpoint'));
  const won=res==='win'||res==='bj';
  if(this.mode==='solo'){ this.solo.pts+=pts; if(won) this.solo.wins++; }
  else {
   this.sess.hands++; if(won) this.sess.wins++; this.sess.pts+=pts;
   if(pts) G.award(pts,res==='bj'?'BLACKJACK!':(res==='win'?'HAND WON':'PUSH'));
  }
 },
 finishSolo(){
  const s=this.solo; this.state='over'; this.again='solo';
  if(s.pts) G.award(s.pts,'MAWMAW’S TABLE');
  G.save.plays.blackjack=(G.save.plays.blackjack||0)+1;
  if(s.pts>(G.save.best.blackjack||0)) G.save.best.blackjack=s.pts;
  G.updateBoard(); G.persist();
  const good=s.wins>=5, E=DATA.NPC.ember;
  AUDIO.jingle(good?'win':'lose');
  const q=G.T((good?E.bj_good:E.bj_ok)[Math.floor(Math.random()*2)]);
  this.modal=K.endModal({title:good?'YOU BEAT THE HOUSE!':(s.wins>=3?'HELD YOUR OWN':'THE HOUSE WINS TODAY'),titleCol:good?'#80ffa0':'#ffd060',hub:'picnicselect',hubLabel:'PICNIC YARD',
   lines:[[s.wins+' OF '+SOLO_HANDS+' HANDS WON','#ffd060',11],['+'+s.pts+' PTS','#80ffa0',8.5],...G.wrap('MAWMAW: “'+q+'”',6.5,216).slice(0,3).map(l=>[l,'#cfc4b0',6.5])]});
 },
 leaveTable(){
  this.netClose();
  const s=this.sess; this.state='over'; this.again='table';
  G.save.plays.blackjack=(G.save.plays.blackjack||0)+1; G.updateBoard(); G.persist();
  this.modal=K.endModal({title:'THANKS FOR SITTING IN',hub:'picnicselect',hubLabel:'PICNIC YARD',
   lines:[[s.hands?(s.wins+' OF '+s.hands+' HANDS WON'):'NO HANDS PLAYED','#ffd060',10],['+'+s.pts+' PTS AT THE CLUB TABLE','#80ffa0',8],['SEE YOU NEXT TIME, SUGAR','#cfc4b0',6.5]]});
 },
 /* ---------- update ---------- */
 netTick(dt){
  const n=this.net; if(!n||!n.seated) return;
  n.hb+=dt; if(n.hb>=HB) this.writeSeat();
  // the turn clock runs even while paused, so nobody holds up the table
  if(this.phase==='play'&&this.mode==='table'){ this.turnT-=dt; if(this.turnT<=0){ this.say('TIME! YOU STAND','#ffd27a'); this.finishMine(); } }
 },
 btns(){
  const L=this.L(), y=L.py+14, h=46, ph=this.phase;
  if(this.mode==='menu'||this.state==='over') return [];
  if(ph==='play') return [{id:'hit',label:'HIT',sub:'TAKE A CARD',kind:'primary',x:14,y,w:116,h,size:11},{id:'stand',label:'STAND',sub:'KEEP '+total(this.myHand()).t,x:140,y,w:116,h,size:11}];
  if(this.mode==='solo'&&ph==='result') return [{id:'next',label:this.solo.n>=SOLO_HANDS?'SEE RESULTS':'NEXT HAND ›',sub:'HAND '+this.solo.n+' OF '+SOLO_HANDS,kind:'primary',x:30,y,w:210,h}];
  if(this.mode==='table'&&ph==='idle'){
   const wait=!this.loaded(), busy=!wait&&!!(this.net.tbl&&this.inProgress(this.net.tbl.r));
   return [{id:'deal',label:wait?'CONNECTING…':(busy?'HAND IN PROGRESS':'DEAL'),sub:wait?'FINDING THE TABLE':(busy?'NEXT DEAL WHEN THEY FINISH':'NEW HAND FOR THE TABLE'),kind:'primary',disabled:wait||busy,x:14,y,w:164,h},{id:'leave',label:'LEAVE',kind:'ghost',x:186,y,w:70,h}];
  }
  let label='…';
  if(ph==='deal') label='DEALING…';
  else if(ph==='wait'){ const w=this.waitingOn(); label=w.length?'WAITING ON '+w.map(s=>s.n).join(', '):'…'; }
  else if(ph==='reveal') label='MAWMAW PLAYS…';
  else if(ph==='result') label=this.res==='lose'?'NEXT HAND SOON':'NICE HAND!';
  return [{id:'busy',label,kind:'secondary',disabled:true,x:14,y,w:242,h}];
 },
 update(dt){
  if(this.msgT>0) this.msgT-=dt;
  this.netTick(dt);
  if(this.mode==='menu'){
   if(G.backHit()){ G.go('picnicselect'); return; }
   if(this.modal){
    const b=this.modal.o.btns[1]; if(b&&!b.disabled) b.sub=this.tableSub();
    const r=this.modal.update(); if(r){ this.modal=null; this.onModal(r); }
   }
   return;
  }
  if(K.gameFrame(this,'blackjack','picnicselect')) return;
  const ph=this.phase;
  if(ph==='deal'){
   this.qT-=dt;
   if(this.q.length){ if(this.qT<=0){ const [w,i]=this.q.shift(); this.cards[w].push({i,t0:G.time}); this.lastCardT=G.time; AUDIO.sfx('card'); this.qT=.26; } }
   else if(G.time-this.lastCardT>.42) this.afterDeal();
  } else if(ph==='wait'){
   this.waitT+=dt;
   if(this.waitT>.45&&(this.waitingOn().length===0||this.waitT>=WAIT_S)) this.startReveal();
  } else if(ph==='reveal'){
   this.revT+=dt;
   if(this.revT>=this.nextDT){
    if(this.cards.d.length<this.dTarget){ this.cards.d.push({i:this.cards.d.length,t0:G.time}); AUDIO.sfx('card'); this.nextDT+=.6; }
    else this.settle();
   }
  } else if(ph==='result'){
   this.resT+=dt;
   if(this.mode==='table'&&this.resT>3.2) this.phase='idle';
  } else if(ph==='idle'&&this.mode==='table'){
   if(this.joinable()){ const t=this.net.tbl; this.lastKey=rk(t); this.startRound(t.r,rk(t)); return; }
  }
  const id=G.navList(this.st,this.btns(),{horiz:true});
  if(id==='hit'&&this.phase==='play') this.hit();
  else if(id==='stand'&&this.phase==='play'){ AUDIO.sfx('ok'); this.finishMine(); }
  else if(id==='next'){ if(this.solo.n>=SOLO_HANDS) this.finishSolo(); else this.nextSolo(); }
  else if(id==='deal'){ this.deal(); }
  else if(id==='leave'){ this.leaveTable(); }
 },
 /* ---------- layout + drawing ---------- */
 L(){
  const VH=G.VH, py=VH-92, table=this.mode==='table';
  const dy=112, oy=table?186:0;
  const my=table?Math.max(oy+92,py-104):Math.round((dy+62+py)/2-36);
  return {py,dy,oy,my,cw:40,ch:56,dw:36,dh:50,ow:21,oh:30};
 },
 rowX(n,w,maxW){ const step=n>1?Math.min(w+5,(maxW-w)/(n-1)):0; const tw=w+step*(n-1); return {x0:VW/2-tw/2,step}; },
 drawHandRow(c,list,cards,y,w,h,holeIdx){
  const R=this.rowX(Math.max(1,list.length),w,VW-60), SX=VW-38, SY=86;
  list.forEach((v,k)=>{
   const tx=R.x0+k*R.step, age=G.time-v.t0, fl=Math.min(1,age/.28), e=1-Math.pow(1-fl,3);
   const x=SX+(tx-SX)*e, yy=SY+(y-SY)*e;
   const cd=cards[v.i];
   if(fl<1){ drawCard(c,x,yy,w,h,cd,false); return; }
   if(holeIdx===v.i){   // the hole card stays down until Mawmaw flips it
    const fa=G.time-this.flipT0;
    if(this.phase!=='reveal'&&this.phase!=='result'&&!(this.mode==='table'&&this.phase==='idle'&&this.cur)) { drawCard(c,x,yy,w,h,cd,false); return; }
    if(fa<.16){ drawCard(c,x,yy,w,h,cd,fa>=.08,Math.abs(Math.cos(fa/.16*Math.PI))); return; }
   }
   const fa=age-.28; if(fa<.14){ drawCard(c,x,yy,w,h,cd,fa>=.07,Math.abs(Math.cos(fa/.14*Math.PI))); return; }
   drawCard(c,x,yy,w,h,cd,true);
  });
 },
 drawFelt(c,L){
  const VH=G.VH;
  // night sky over the picnic yard, string lights, tree line
  const sky=c.createLinearGradient(0,42,0,104); sky.addColorStop(0,'#12172a'); sky.addColorStop(1,'#2a1c22'); c.fillStyle=sky; c.fillRect(0,42,VW,62);
  c.fillStyle='#0c0f14'; c.beginPath(); c.moveTo(0,98);
  for(let x=0;x<=VW;x+=10) c.lineTo(x,92-Math.abs(Math.sin(x*.07))*8-((x*13)%7));
  c.lineTo(VW,104); c.lineTo(0,104); c.closePath(); c.fill();
  c.strokeStyle='rgba(20,14,10,.9)'; c.lineWidth=1; c.beginPath();
  for(let x=0;x<=VW;x+=6){ const y=50+Math.sin(x/VW*Math.PI*2)*5; if(x) c.lineTo(x,y); else c.moveTo(x,y); } c.stroke();
  for(let i=0;i<15;i++){ const x=9+i*18, y=50+Math.sin(x/VW*Math.PI*2)*5+3; c.fillStyle=['#ffd060','#ff7030','#80ffa0'][i%3];
   c.globalAlpha=G.rm()?1:.75+.25*Math.sin(G.time*3+i); c.beginPath(); c.arc(x,y,2,0,7); c.fill(); }
  c.globalAlpha=1;
  // Mawmaw behind the table
  c.save(); c.translate(VW/2,86); c.scale(1.8,1.8);
  G.scenes.club.drawDude(c,0,0,MAW,1,0,null,MAWAV); c.restore();
  // the table: padded rail + felt
  const g=c.createRadialGradient(VW/2,L.py*.62,20,VW/2,L.py*.6,L.py*.85); g.addColorStop(0,'#21734a'); g.addColorStop(1,'#0c3020');
  c.fillStyle=g; c.fillRect(0,104,VW,L.py-104);
  c.fillStyle='rgba(0,0,0,.08)'; for(let y=106;y<L.py;y+=3) c.fillRect(0,y,VW,1);
  const rg=c.createLinearGradient(0,96,0,108); rg.addColorStop(0,'#4a2c16'); rg.addColorStop(1,'#24140a');
  c.fillStyle=rg; c.fillRect(0,96,VW,10); c.fillStyle='rgba(255,210,140,.25)'; c.fillRect(0,96,VW,1.2);
  // shoe
  c.fillStyle='#14121a'; G.rrect(VW-50,78,34,20,4); c.fill(); c.strokeStyle='#f07818'; c.lineWidth=1; c.stroke();
  drawCard(c,VW-44,74,24,16,null,false);
  // felt print: under the dealer (solo) or in the open felt between the seats and my hand (club table)
  const pb=this.mode==='table'?(L.oy+80+L.my-14)/2+4:L.dy+82;
  if(this.mode!=='table'||L.my-14-(L.oy+80)>=44){
   const cy=pb-232;
   c.save(); c.globalAlpha=.3;
   arcText(c,'BLACKJACK PAYS 60 PTS',VW/2,cy,232,6.6,'#ffd060');
   arcText(c,'DEALER STANDS ON ALL 17S',VW/2,cy,246,5.4,'#e8dcc8');
   c.strokeStyle='#ffd060'; c.lineWidth=1; c.beginPath(); c.arc(VW/2,cy,256,Math.PI*.3,Math.PI*.7); c.stroke();
   c.restore();
  }
  G.chip('MAWMAW DEALS',8,58,{size:6,col:'#ff9ad0',bg:'rgba(0,0,0,.45)',border:'rgba(255,154,208,.5)'});
 },
 totChip(cards,x,y,show,col){
  if(!cards.length) return;
  const T=total(cards), t=T.t;
  const txt=!show?'?':(natural(cards)?'BLACKJACK':(t>21?'BUST '+t:((T.soft&&t<21?'SOFT ':'')+t)));
  G.chip(txt,x,y,{align:'center',size:6.6,col:col||(t>21&&show?'#ffb0a0':'#f4ede2'),bg:'rgba(0,0,0,.5)',border:'rgba(255,255,255,.18)'});
 },
 draw(c){
  const VH=G.VH, L=this.L();
  c.fillStyle='#0b0a10'; c.fillRect(0,0,VW,VH);
  this.drawFelt(c,L);
  if(this.mode!=='menu'&&this.cur){
   // dealer
   const showAll=this.phase==='reveal'||this.phase==='result'||(this.phase==='idle'&&this.cur);
   const dShown=this.cards.d.map(v=>this.dealer[v.i]);
   this.drawHandRow(c,this.cards.d,this.dealer,L.dy,L.dw,L.dh,1);
   if(this.cards.d.length>=2&&G.time-this.cards.d[1].t0>.3) this.totChip(showAll?dShown:dShown.slice(0,1),VW/2,L.dy+L.dh+5,true,'#ffd0e8');
   // me
   const mine=this.myHand();
   this.drawHandRow(c,this.cards.p,mine,L.my,L.cw,L.ch,-1);
   const meName=this.mode==='table'?this.net&&this.net.name||'YOU':'YOU';
   if(this.cards.p.length>=2) this.totChip(mine.slice(0,this.cards.p.length),VW/2,L.my+L.ch+5,true);
   G.txt(meName,VW/2,L.my-13,6.4,'#ffd060','center',150,800);
   if(this.res&&(this.phase==='result'||this.phase==='idle')) this.drawResult(c,L);
  }
  if(this.mode==='table') this.drawSeats(c,L);
  // bottom panel
  c.fillStyle='rgba(11,10,16,.97)'; c.fillRect(0,L.py,VW,VH-L.py); c.fillStyle='rgba(240,120,24,.5)'; c.fillRect(0,L.py,VW,1);
  this.btns().forEach((b,i)=>G.button(b,this.st.f===i));
  let tip='';
  if(this.phase==='play'&&this.mode==='table') tip='AUTO-STAND IN '+Math.max(0,Math.ceil(this.turnT))+'S • EVERYONE PLAYS MAWMAW, NOT EACH OTHER';
  else if(this.phase==='play') tip='HIT TO TAKE A CARD • STAND TO KEEP YOUR TOTAL';
  else if(this.mode==='table'&&this.phase==='idle') tip='ANYONE AT THE TABLE CAN DEAL THE NEXT HAND';
  else if(this.mode==='solo') tip='POINTS ONLY • NO BETTING';
  if(tip) G.txt(tip,VW/2,VH-20,5.8,'#8a7f70','center',VW-16,700);
  // top bar
  if(this.mode==='menu') G.topBar('BLACKJACK');
  else K.gameBar(c,'BLACKJACK',this.mode==='solo'?'HAND '+Math.min(this.solo.n,SOLO_HANDS)+'/'+SOLO_HANDS:(this.present().length+1)+' AT THE TABLE');
  if(this.msgT>0){ c.globalAlpha=Math.min(1,this.msgT*2); G.txtO(this.msg,VW/2,L.my-34,9.5,this.msgCol,'center',VW-20); c.globalAlpha=1; }
  if(this.modal) this.modal.draw(c);
  if(this.pause.open) this.pause.draw(c);
 },
 drawResult(c,L){
  const r=this.res, pts=PTS[r];
  const txt={bj:'BLACKJACK! +'+pts,win:'YOU WIN +'+pts,push:'PUSH +'+pts,lose:'MAWMAW WINS'}[r];
  const col={bj:'#80ffa0',win:'#80ffa0',push:'#ffd060',lose:'#ff9a80'}[r];
  const y=L.my+L.ch/2-12, w=G.tw(txt,10,800)+34;
  c.save(); c.globalAlpha=this.phase==='idle'?.7:1;
  G.rrect(VW/2-w/2,y,w,24,12); c.fillStyle='rgba(8,8,12,.86)'; c.fill(); c.strokeStyle=col; c.lineWidth=1.5; c.stroke();
  G.txt(txt,VW/2,y+5,10,col,'center',undefined,800);
  c.restore();
 },
 drawSeats(c,L){
  const others=this.present();
  if(!others.length){ G.txt('NO ONE ELSE AT THE TABLE YET',VW/2,L.oy+30,6.6,'rgba(232,220,200,.55)','center',VW-30,700); G.txt('ANYONE WHO SITS DOWN SHOWS UP HERE',VW/2,L.oy+44,5.8,'rgba(232,220,200,.4)','center',VW-30,700); return; }
  const n=others.length, sw=Math.min(64,(VW-16)/n), x0=VW/2-sw*n/2;
  others.forEach((s,k)=>{
   const x=x0+k*sw, cx=x+sw/2;
   G.rrect(x+2,L.oy,sw-4,80,8); c.fillStyle='rgba(6,24,14,.62)'; c.fill(); c.strokeStyle='rgba(255,255,255,.08)'; c.lineWidth=1; c.stroke();
   G.txt(s.s===1?'♥ '+s.n:s.n,cx,L.oy+4,5.8,s.s===1?'#ff9ad0':'#ffd060','center',sw-8,800);
   const inThis=this.cur&&s.r===this.cur;
   if(!inThis){ G.txt(s.r&&!s.d?'IN A HAND':'READY',cx,L.oy+36,5.6,'#9a8f80','center',sw-8,700); return; }
   const hand=handOf(this.seed,s.id,hitsOf(s.m)), step=Math.min(9,(sw-10-L.ow)/Math.max(1,hand.length-1));
   const hx=cx-(L.ow+step*(hand.length-1))/2;
   hand.forEach((cd,i)=>drawCard(c,hx+i*step,L.oy+16,L.ow,L.oh,cd,true));
   const T=total(hand), revealed=this.phase==='result'||this.phase==='idle';
   let st, col='#e8dcc8';
   if(!s.d){ st='PLAYING…'; col='#9a8f80'; }
   else if(revealed){ const o=outcome(hand,this.dealer); st={bj:'BLACKJACK',win:'WINS',push:'PUSH',lose:'LOSES'}[o]; col={bj:'#80ffa0',win:'#80ffa0',push:'#ffd060',lose:'#ff9a80'}[o]; }
   else st=natural(hand)?'BLACKJACK':(T.t>21?'BUST':'STANDS '+T.t);
   G.txt(st,cx,L.oy+L.oh+22,5.6,col,'center',sw-6,800);
  });
 }
};
})();
