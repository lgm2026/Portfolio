/* 8-BALL vs HAMMER at the clubhouse pool table (top-down, portrait).
   Touch the table to aim (the cue ball shoots toward your finger), fine-tune with the arrows, then slide the
   POWER bar and let go to shoot. Standard 8-ball, kept friendly: the first ball you legally pocket picks your group,
   keep shooting while you pocket your own, a foul gives the other player ball in hand, sink the 8 last to win. */
(function(){
const VW=G.VW, K=G.gameKit;
const R=1/34.7, D=2*R, DEC=.55, E_BALL=.95, E_RAIL=.76, MAXV=6;
const COLS=['#f6f2e8','#f2c21a','#1c4fbf','#d42a2a','#5a2a8a','#f07818','#1a8a4a','#8a1a24','#111111','#f2c21a','#1c4fbf','#d42a2a','#5a2a8a','#f07818','#1a8a4a','#8a1a24'];
const POCKETS=[[0,0],[1,0],[0,1],[1,1],[0,2],[1,2]];
const AIMPT=[[R*.45,R*.45],[1-R*.45,R*.45],[-R*.25,1],[1+R*.25,1],[R*.45,2-R*.45],[1-R*.45,2-R*.45]];
const kind=n=>n===0?'cue':(n===8?'eight':(n<8?'solid':'stripe'));
const HAM={shirt:'#2a2a34',vest:'#15151d',skin:'#d9a070',trim:'#ff7030'};
const GNAME={solid:'SOLIDS',stripe:'STRIPES'};

/* ---------- physics ---------- */
function inCornerZone(b){ return (b.x<2*R||b.x>1-2*R)&&(b.y<2*R||b.y>2-2*R); }
function rails(b,ev){
 const cz=y=>y<2*R||y>2-2*R, side=y=>Math.abs(y-1)<1.45*R, cx=x=>x<2*R||x>1-2*R;
 if(b.x<R&&!cz(b.y)&&!side(b.y)){ b.x=R; if(b.vx<0){ b.vx=-b.vx*E_RAIL; b.vy*=.96; ev&&ev.rail++; ev&&ev.snd(Math.abs(b.vx)); } }
 if(b.x>1-R&&!cz(b.y)&&!side(b.y)){ b.x=1-R; if(b.vx>0){ b.vx=-b.vx*E_RAIL; b.vy*=.96; ev&&ev.rail++; ev&&ev.snd(Math.abs(b.vx)); } }
 if(b.y<R&&!cx(b.x)){ b.y=R; if(b.vy<0){ b.vy=-b.vy*E_RAIL; b.vx*=.96; ev&&ev.rail++; ev&&ev.snd(Math.abs(b.vy)); } }
 if(b.y>2-R&&!cx(b.x)){ b.y=2-R; if(b.vy>0){ b.vy=-b.vy*E_RAIL; b.vx*=.96; ev&&ev.rail++; ev&&ev.snd(Math.abs(b.vy)); } }
}
function pocketOf(b){
 for(let i=0;i<6;i++){ const [px,py]=POCKETS[i]; const cap=i===2||i===3?1.5*R:1.65*R; if(Math.hypot(b.x-px,b.y-py)<cap) return i; }
 if(b.x<-.2*R||b.x>1+.2*R||b.y<-.2*R||b.y>2+.2*R){ let bi=0,bd=9; for(let i=0;i<6;i++){ const d=Math.hypot(b.x-POCKETS[i][0],b.y-POCKETS[i][1]); if(d<bd){ bd=d; bi=i; } } return bi; }
 return -1;
}
function step(balls,h,ev){
 for(const b of balls) if(b.on&&(b.vx||b.vy)){
  b.x+=b.vx*h; b.y+=b.vy*h;
  const sp=Math.hypot(b.vx,b.vy), ns=sp-DEC*h;
  if(ns<.012){ b.vx=0; b.vy=0; } else { b.vx*=ns/sp; b.vy*=ns/sp; }
  b.rot=(b.rot||0)+sp*h*30;
 }
 for(let i=0;i<balls.length;i++){ const a=balls[i]; if(!a.on) continue;
  for(let j=i+1;j<balls.length;j++){ const b=balls[j]; if(!b.on) continue;
   const dx=b.x-a.x, dy=b.y-a.y, d2=dx*dx+dy*dy;
   if(d2>=D*D||d2===0) continue;
   const d=Math.sqrt(d2), nx=dx/d, ny=dy/d, over=(D-d)/2;
   a.x-=nx*over; a.y-=ny*over; b.x+=nx*over; b.y+=ny*over;
   const vr=(a.vx-b.vx)*nx+(a.vy-b.vy)*ny;
   if(vr>0){ const imp=vr*(1+E_BALL)/2; a.vx-=imp*nx; a.vy-=imp*ny; b.vx+=imp*nx; b.vy+=imp*ny;
    if(ev){ if(ev.first==null&&(a.n===0||b.n===0)) ev.first=a.n===0?b.n:a.n; ev.click(vr); } }
  }
 }
 for(const b of balls) if(b.on){
  rails(b,ev);
  const p=pocketOf(b);
  if(p>=0){ b.on=false; b.vx=b.vy=0; b.pk=p; if(ev){ ev.pocketed.push(b.n); ev.drop(b); } }
 }
}
const moving=balls=>balls.some(b=>b.on&&(b.vx||b.vy));
/* clear path for a ball of radius R from A to B (ignoring some balls) */
function clear(balls,ax,ay,bx,by,skip){
 const dx=bx-ax, dy=by-ay, L2=dx*dx+dy*dy||1e-9;
 for(const c of balls){ if(!c.on||skip.indexOf(c.n)>=0) continue;
  let t=((c.x-ax)*dx+(c.y-ay)*dy)/L2; t=Math.max(0,Math.min(1,t));
  if(Math.hypot(ax+dx*t-c.x,ay+dy*t-c.y)<D*.98) return false; }
 return true;
}
/* the shot a careful player would take from here (used by Hammer, and to place ball in hand) */
function bestShot(balls,cue,targets){
 let best=null;
 for(const t of balls){ if(!t.on||targets.indexOf(t.n)<0) continue;
  for(let i=0;i<6;i++){
   const [px,py]=AIMPT[i], ox=px-t.x, oy=py-t.y, d2=Math.hypot(ox,oy); if(d2<1e-6) continue;
   const ux=ox/d2, uy=oy/d2, gx=t.x-ux*D, gy=t.y-uy*D;
   if(gx<R*.9||gx>1-R*.9||gy<R*.9||gy>2-R*.9) continue;
   const cx=gx-cue.x, cy=gy-cue.y, d1=Math.hypot(cx,cy); if(d1<1e-6) continue;
   const cut=Math.acos(Math.max(-1,Math.min(1,(cx*ux+cy*uy)/d1)));
   if(cut>1.36) continue;
   if(i===2||i===3){ if(Math.abs(uy)>.82) continue; }        // side pockets only take a ball heading across
   if(!clear(balls,cue.x,cue.y,gx,gy,[0,t.n])||!clear(balls,t.x,t.y,px,py,[t.n,0])) continue;
   const score=Math.pow(Math.cos(cut),2)/(1+d1*.7+d2*1.1);
   if(!best||score>best.score){
    const vObj=Math.sqrt(2*DEC*d2)+.35, vC=vObj/Math.max(.25,Math.cos(cut))/.975, v0=Math.sqrt(vC*vC+2*DEC*d1)*1.12;
    best={score,ang:Math.atan2(cy,cx),v:Math.max(.8,Math.min(5,v0)),t:t.n,pocket:i};
   }
  }
 }
 return best;
}

G.scenes.pool={
 enter(){
  this.rack();
  this.turn='me'; this.grp={me:null,ham:null}; this.inHand=true; this.kitchen=true; this.isBreak=true;
  this.ang=-Math.PI/2; this.pow=0; this.powDrag=false; this.place=false; this.phase='aim';
  this.msg=''; this.msgT=0; this.shots=0; this.potted={me:0,ham:0};
  this.plan=null; this.thinkT=0; this.rollT=0; this.aimDrag=false; this.ev=null; this.endWin=false; this.endWhy=''; this.sT=0;
  this.state='tut';
  this.pause=G.Pause({restart:['pool'],quit:['club'],quitLabel:'BACK TO THE CLUBHOUSE'});
  this.modal=K.tutModal('8-BALL VS HAMMER',['TOUCH THE TABLE TO AIM • ARROWS FINE-TUNE','SLIDE THE POWER BAR, LET GO TO SHOOT','FIRST BALL YOU SINK PICKS YOUR GROUP',['SINK THE 8 LAST TO WIN','#ffd060',7.5]],'RACK ’EM');
  this.onModal=()=>{ if(this.state==='tut'){ this.state='play'; this.say('YOUR BREAK • DRAG THE CUE BALL TO PLACE IT','#ffd060',2.2); } };
  AUDIO.play(G.bgm());   // the clubhouse's own music (the jukebox pick)
 },
 rack(){
  const B=[]; for(let n=0;n<16;n++) B.push({n,x:0,y:0,vx:0,vy:0,on:true,rot:Math.random()*6});
  const order=[1,2,3,4,5,6,7,9,10,11,12,13,14,15]; G.shuffle(order);
  // back corners: one solid, one stripe; the 8 in the middle
  const slots=[]; for(let k=0;k<5;k++) for(let j=0;j<=k;j++) slots.push([k,j]);
  const s=order.findIndex(n=>n<8), t=order.findIndex(n=>n>8);
  const sol=order.splice(s,1)[0], str=order.splice(order.findIndex(n=>n>8),1)[0];
  let k8=0;
  for(const [k,j] of slots){
   let n;
   if(k===2&&j===1) n=8; else if(k===4&&j===0) n=sol; else if(k===4&&j===4) n=str; else n=order[k8++];
   B[n].x=.5+(j-k/2)*D*1.004; B[n].y=.5-k*D*.866*1.004;
  }
  B[0].x=.5; B[0].y=1.5;
  this.balls=B;
 },
 say(m,col,t){ this.msg=m; this.msgCol=col||'#ffd060'; this.msgT=t||1.6; },
 cue(){ return this.balls[0]; },
 T(){ const VH=G.VH, top=70, bot=VH-84, rail=11;
  let H=bot-top-2*rail, W=H/2; const maxW=VW-2*rail-20; if(W>maxW){ W=maxW; H=W*2; }
  const x0=VW/2-W/2, y0=top+rail+((bot-top-2*rail)-H)/2;
  return {x0,y0,W,H,rail,s:W}; },
 toS(x,y,T){ T=T||this.T(); return [T.x0+x*T.s,T.y0+y*T.s]; },
 toT(sx,sy,T){ T=T||this.T(); return [(sx-T.x0)/T.s,(sy-T.y0)/T.s]; },
 left(who){ const g=this.grp[who]; if(!g) return 7; return this.balls.filter(b=>b.on&&kind(b.n)===g).length; },
 targets(who){
  const g=this.grp[who];
  if(!g) return this.balls.filter(b=>b.on&&b.n!==0&&b.n!==8).map(b=>b.n);
  const own=this.balls.filter(b=>b.on&&kind(b.n)===g).map(b=>b.n);
  return own.length?own:[8];
 },
 freeSpot(x,y,skip){ for(const b of this.balls) if(b.on&&b.n!==0&&b.n!==skip&&Math.hypot(b.x-x,b.y-y)<D*1.02) return false; return x>=R&&x<=1-R&&y>=R&&y<=2-R; },
 /* ---------- shooting ---------- */
 shoot(v,ang){
  const c=this.cue(); c.vx=Math.cos(ang)*v; c.vy=Math.sin(ang)*v;
  this.leftBefore={me:this.left('me'),ham:this.left('ham')};
  const self=this; let ct=0;
  this.ev={first:null,pocketed:[],rail:0,
   click(vr){ if(G.time-ct>.04){ ct=G.time; AUDIO.note&&AUDIO.note(1400+Math.min(1,vr/3)*900,.05,Math.min(.16,.03+vr*.05)); } },
   snd(v){ if(v>.4) AUDIO.note&&AUDIO.note(160,.08,Math.min(.12,v*.04)); },
   drop(b){ AUDIO.sfx(b.n===0?'thud':'hole'); }};
  this.phase='roll'; this.rollT=0; this.inHand=false; this.place=false; this.shots++;
  AUDIO.sfx('board');
 },
 myShot(){ const p=this.pow; if(p<.02) return; const err=(Math.random()-.5)*.005; this.shoot(.3+p*(MAXV-.3),this.ang+err); this.pow=0; },
 judge(){
  const ev=this.ev, who=this.turn, opp=who==='me'?'ham':'me';
  const pk=ev.pocketed.filter(n=>n!==0&&n!==8), eight=ev.pocketed.indexOf(8)>=0, scratch=ev.pocketed.indexOf(0)>=0;
  const g=this.grp[who], lb=this.leftBefore[who];
  let foul='';
  if(scratch) foul='SCRATCH!';
  else if(ev.first==null) foul='FOUL: NO BALL HIT';
  else if(g){ const fk=kind(ev.first); if(lb>0&&fk!==g) foul=fk==='eight'?'FOUL: HIT THE 8 FIRST':'FOUL: WRONG GROUP FIRST'; else if(lb===0&&ev.first!==8) foul='FOUL: THE 8 WAS YOUR BALL'; }
  else if(ev.first===8&&!this.isBreak) foul='FOUL: HIT THE 8 FIRST';
  for(const n of pk){ if(this.grp.me){ if(kind(n)===this.grp.me) this.potted.me++; else this.potted.ham++; } }
  if(eight){
   if(this.isBreak){ this.respot8(); this.say('8 ON THE BREAK - RESPOTTED','#ffd060'); }
   else { const won=g&&lb===0&&!foul; this.over(won?who:opp,won?'':(foul?'8 BALL WITH A '+(scratch?'SCRATCH':'FOUL'):'8 BALL TOO EARLY')); return; }
  }
  this.isBreak=false;
  if(!g&&!foul&&pk.length){
   const k=kind(pk[0]); this.grp[who]=k; this.grp[opp]=k==='solid'?'stripe':'solid';
   for(const n of pk){ if(kind(n)===this.grp.me) this.potted.me++; else this.potted.ham++; }
   this.say((who==='me'?'YOU HAVE ':'HAMMER HAS ')+GNAME[k],'#80ffa0',2);
  }
  const gNow=this.grp[who], madeOwn=pk.some(n=>!gNow||kind(n)===gNow);
  if(foul){
   this.say(foul+' • BALL IN HAND FOR '+(opp==='me'?'YOU':'HAMMER'),'#ff9a80',2.2); AUDIO.sfx('buzzer');
   if(scratch){ const c=this.cue(); c.on=true; c.vx=c.vy=0; c.x=.5; c.y=1.5; for(let k=0;k<40&&!this.freeSpot(c.x,c.y);k++){ c.x=.5+(Math.random()-.5)*.8; c.y=1.1+Math.random()*.8; } }
   this.turn=opp; this.inHand=true; this.kitchen=false;
  } else if(madeOwn){
   if(who==='me'&&!this.msgT) this.say('NICE! SHOOT AGAIN','#80ffa0');
   else if(who==='me') this.msg+=' • SHOOT AGAIN';
  } else { this.turn=opp; this.say(opp==='me'?'YOUR SHOT':'HAMMER’S SHOT',opp==='me'?'#ffd060':'#ff9a60'); }
  this.phase='aim'; this.pow=0;
  if(this.turn==='ham'){ this.phase='think'; this.thinkT=0; this.plan=null; }
 },
 respot8(){
  // back on the foot spot, or the nearest free point along the long string (toward the foot rail first)
  const b=this.balls[8]; b.on=true; b.vx=b.vy=0; b.x=.5;
  const tries=[.5]; for(let k=1;k<40;k++){ tries.push(.5-k*D*.5,.5+k*D*.5); }
  b.y=tries.find(y=>y>=2*R&&y<=2-2*R&&this.freeSpot(.5,y,8))||.5;
 },
 over(winner,why){
  const win=winner==='me'; this.state='ending'; this.endWin=win; this.endWhy=why; this.sT=1.2;
  this.say(win?'THE 8 DROPS - YOU WIN!':(why?why.toUpperCase():'HAMMER SINKS THE 8'),win?'#80ffa0':'#ff9a80',2.2);
  if(win) AUDIO.sfx('cheer'); else AUDIO.sfx('buzzer');
 },
 finish(){
  const win=this.endWin; this.state='over';
  const hamLeft=this.grp.ham?this.left('ham'):7, myPot=this.grp.me?7-this.left('me'):0;
  const pts=win?400+hamLeft*25:60+myPot*20;
  G.award(pts,win?'8-BALL CHAMP':'GOOD GAME, HAMMER WINS');
  if(win) G.ach('pool_w');
  G.save.plays.pool=(G.save.plays.pool||0)+1;
  if(pts>(G.save.best.pool||0)) G.save.best.pool=pts;
  G.updateBoard(); G.persist();
  AUDIO.jingle(win?'win':'lose');
  const H=DATA.NPC.hammer, q=G.T((win?H.pool_lose:H.pool_win)[Math.floor(Math.random()*2)]);
  this.modal=K.endModal({title:win?'YOU RAN HAMMER’S TABLE!':'HAMMER WINS THE RACK',titleCol:win?'#80ffa0':'#ff8a60',hub:'club',
   lines:[...(this.endWhy?[[this.endWhy,'#ff9a80',7.5]]:[]),['+'+pts+' PTS','#80ffa0',8.5],...G.wrap('HAMMER: “'+q+'”',6.5,216).slice(0,3).map(l=>[l,'#cfc4b0',6.5])]});
 },
 /* ---------- Hammer ---------- */
 hammerPlan(){
  const tg=this.targets('ham');
  if(this.inHand){
   // pick the spot with the best shot
   let best=null, bpos=null;
   for(let i=0;i<10;i++) for(let j=0;j<20;j++){
    const x=.08+i*.093, y=.08+j*.096; if(!this.freeSpot(x,y)) continue;
    const s=bestShot(this.balls,{x,y},tg); if(s&&(!best||s.score>best.score)){ best=s; bpos=[x,y]; }
   }
   if(bpos){ const c=this.cue(); c.x=bpos[0]; c.y=bpos[1]; c.on=true; }
  }
  let s=bestShot(this.balls,this.cue(),tg);
  if(!s){   // no clean pot: roll into one of his own balls (a safety)
   const c=this.cue(); let bd=9, bt=null;
   for(const b of this.balls) if(b.on&&tg.indexOf(b.n)>=0){ const d=Math.hypot(b.x-c.x,b.y-c.y); if(d<bd&&clear(this.balls,c.x,c.y,b.x,b.y,[0,b.n])){ bd=d; bt=b; } }
   if(!bt) for(const b of this.balls) if(b.on&&tg.indexOf(b.n)>=0){ const d=Math.hypot(b.x-c.x,b.y-c.y); if(d<bd){ bd=d; bt=b; } }
   s=bt?{ang:Math.atan2(bt.y-c.y,bt.x-c.x),v:1.6+bd*.9,t:bt.n,safety:true}:{ang:-Math.PI/2,v:2};
  }
  const g=()=>{ let u=0; for(let i=0;i<6;i++) u+=Math.random(); return u-3; };
  s.ang+=g()*.0085*1.41;     // about half a degree of aim error
  s.v*=1+g()*.06;
  return s;
 },
 /* ---------- update ---------- */
 update(dt){
  if(this.msgT>0) this.msgT-=dt;
  if(K.gameFrame(this,'pool','club')) return;
  if(this.state==='ending'){ this.sT-=dt; if(this.sT<=0) this.finish(); return; }
  if(this.state!=='play') return;
  if(this.phase==='roll'){
   this.rollT+=dt;
   const n=Math.ceil(Math.min(dt,.05)*240), h=Math.min(dt,.05)/n;
   for(let i=0;i<n;i++) step(this.balls,h,this.ev);
   if(!moving(this.balls)||this.rollT>14){ for(const b of this.balls){ b.vx=0; b.vy=0; } this.judge(); }
   return;
  }
  if(this.phase==='think'){
   this.thinkT+=dt;
   if(!this.plan&&this.thinkT>.5) this.plan=this.hammerPlan();
   if(this.plan){
    let d=this.plan.ang-this.ang; while(d>Math.PI) d-=2*Math.PI; while(d<-Math.PI) d+=2*Math.PI;
    this.ang+=d*Math.min(1,dt*5);
    this.pow=Math.max(0,Math.min(this.plan.v/MAXV,(this.thinkT-1.1)*1.4));
    if(this.thinkT>1.9){ const v=this.plan.v; this.ang=this.plan.ang; this.plan=null; this.shoot(v,this.ang); this.pow=0; }
   }
   return;
  }
  // my turn
  const T=this.T(), p=G.ptr, P=this.panel(), c=this.cue();
  if(G.ptr.click){
   if(G.hit(P.bar.x-6,P.bar.y-10,P.bar.w+12,P.bar.h+20)){ this.powDrag=true; }
   else if(G.hit(P.l.x,P.l.y,P.l.w,P.l.h)){ this.ang-=.0035; AUDIO.sfx('tick'); }
   else if(G.hit(P.r.x,P.r.y,P.r.w,P.r.h)){ this.ang+=.0035; AUDIO.sfx('tick'); }
   else if(p.y>T.y0-T.rail&&p.y<T.y0+T.H+T.rail){
    const [cx,cy]=this.toS(c.x,c.y,T);
    this.place=this.inHand&&Math.hypot(p.x-cx,p.y-cy)<Math.max(16,R*T.s*3.2);
    this.aimDrag=!this.place;
    if(this.aimDrag&&Math.hypot(p.x-cx,p.y-cy)>4) this.ang=Math.atan2(p.y-cy,p.x-cx);
   }
  }
  if(p.down){
   if(this.powDrag) this.pow=Math.max(0,Math.min(1,(p.x-P.bar.x)/P.bar.w));
   else if(this.place){
    let [x,y]=this.toT(p.x,p.y,T); x=Math.max(R,Math.min(1-R,x)); y=Math.max(this.kitchen?1.5:R,Math.min(2-R,y));
    if(this.freeSpot(x,y)){ c.x=x; c.y=y; }
   } else if(this.aimDrag){ const [cx,cy]=this.toS(c.x,c.y,T); if(Math.hypot(p.x-cx,p.y-cy)>4) this.ang=Math.atan2(p.y-cy,p.x-cx); }
   // hold the fine arrows to keep turning
   if(G.held(P.l.x,P.l.y,P.l.w,P.l.h)) this.ang-=.05*dt;
   if(G.held(P.r.x,P.r.y,P.r.w,P.r.h)) this.ang+=.05*dt;
  } else {
   if(this.powDrag){ this.powDrag=false; this.myShot(); return; }
   this.place=false; this.aimDrag=false;
  }
  if(G.keys.left) this.ang-=.35*dt; if(G.keys.right) this.ang+=.35*dt;
  if(G.keys.up) this.pow=Math.min(1,this.pow+.6*dt); if(G.keys.down) this.pow=Math.max(0,this.pow-.6*dt);
  if(G.pressed.a&&this.pow>.02) this.myShot();
 },
 panel(){ const VH=G.VH, y=VH-72; return {y,bar:{x:58,y:y+18,w:154,h:16},l:{x:8,y:y+10,w:42,h:32},r:{x:220,y:y+10,w:42,h:32}}; },
 /* where the cue ball meets the first ball (or rail) along the aim */
 guide(){
  const c=this.cue(), ux=Math.cos(this.ang), uy=Math.sin(this.ang);
  let tHit=9, hit=null;
  for(const b of this.balls){ if(!b.on||b.n===0) continue;
   const fx=c.x-b.x, fy=c.y-b.y, bq=fx*ux+fy*uy, cq=fx*fx+fy*fy-D*D, disc=bq*bq-cq;
   if(disc<0) continue; const t=-bq-Math.sqrt(disc); if(t>0&&t<tHit){ tHit=t; hit=b; } }
  const tx=ux>0?(1-R-c.x)/ux:(ux<0?(R-c.x)/ux:9), ty=uy>0?(2-R-c.y)/uy:(uy<0?(R-c.y)/uy:9), tRail=Math.min(tx,ty);
  if(hit&&tHit<tRail){ const gx=c.x+ux*tHit, gy=c.y+uy*tHit, nx=(hit.x-gx)/D, ny=(hit.y-gy)/D; return {gx,gy,hit,nx,ny,ux,uy}; }
  return {gx:c.x+ux*tRail,gy:c.y+uy*tRail,rail:true,tx,ty,ux,uy};
 },
 /* ---------- drawing ---------- */
 drawBall(c,b,T){
  const [x,y]=this.toS(b.x,b.y,T), r=R*T.s;
  c.fillStyle='rgba(0,0,0,.35)'; c.beginPath(); c.ellipse(x+r*.25,y+r*.35,r,r*.9,0,0,7); c.fill();
  const col=COLS[b.n];
  c.save(); c.beginPath(); c.arc(x,y,r,0,7); c.clip();
  if(b.n>8){ c.fillStyle='#f6f2e8'; c.fillRect(x-r,y-r,2*r,2*r); const o=Math.sin(b.rot||0)*r*.25; c.fillStyle=col; c.fillRect(x-r,y-r*.55+o,2*r,r*1.1); }
  else { c.fillStyle=col; c.fillRect(x-r,y-r,2*r,2*r); }
  if(b.n&&r>=4.2){ c.fillStyle='#f6f2e8'; c.beginPath(); c.arc(x+Math.cos(b.rot||0)*r*.2,y,r*.45,0,7); c.fill();
   if(r>=5.2) G.txt(String(b.n),x+Math.cos(b.rot||0)*r*.2,y-r*.33,r*.42,'#111','center',undefined,800); }
  const g=c.createRadialGradient(x-r*.4,y-r*.45,r*.1,x,y,r*1.1); g.addColorStop(0,'rgba(255,255,255,.55)'); g.addColorStop(.35,'rgba(255,255,255,0)'); g.addColorStop(1,'rgba(0,0,0,.35)');
  c.fillStyle=g; c.fillRect(x-r,y-r,2*r,2*r);
  c.restore();
 },
 drawTable(c,T){
  const {x0,y0,W,H,rail}=T;
  // floor
  c.fillStyle='#1a120c'; c.fillRect(0,42,VW,G.VH-42);
  c.fillStyle='rgba(0,0,0,.18)'; for(let y=46;y<G.VH;y+=12) c.fillRect(0,y,VW,1.2);
  // rails
  const wg=c.createLinearGradient(x0-rail,0,x0+W+rail,0); wg.addColorStop(0,'#3a1e0c'); wg.addColorStop(.5,'#6a3c1a'); wg.addColorStop(1,'#3a1e0c');
  c.fillStyle='rgba(0,0,0,.5)'; G.rrect(x0-rail+3,y0-rail+5,W+2*rail,H+2*rail,10); c.fill();
  c.fillStyle=wg; G.rrect(x0-rail,y0-rail,W+2*rail,H+2*rail,10); c.fill();
  c.strokeStyle='rgba(255,210,150,.25)'; c.lineWidth=1; G.rrect(x0-rail+.5,y0-rail+.5,W+2*rail-1,H+2*rail-1,10); c.stroke();
  // diamonds
  c.fillStyle='#f0e6d0';
  for(let k=1;k<4;k++){ const x=x0+W*k/4; c.beginPath(); c.arc(x,y0-rail/2,1.3,0,7); c.arc(x,y0+H+rail/2,1.3,0,7); c.fill(); }
  for(let k=1;k<8;k++){ if(k===4) continue; const y=y0+H*k/8; c.beginPath(); c.arc(x0-rail/2,y,1.3,0,7); c.fill(); c.beginPath(); c.arc(x0+W+rail/2,y,1.3,0,7); c.fill(); }
  // felt + lamp light
  const fg=c.createRadialGradient(x0+W/2,y0+H/2,10,x0+W/2,y0+H/2,H*.62); fg.addColorStop(0,'#24935a'); fg.addColorStop(1,'#11502f');
  c.fillStyle=fg; c.fillRect(x0,y0,W,H);
  c.strokeStyle='rgba(0,0,0,.35)'; c.lineWidth=2.4; c.strokeRect(x0+1,y0+1,W-2,H-2);   // cushion nose shadow
  if(G.img.crest_sm){ c.globalAlpha=.08; const s=W*.42; c.drawImage(G.img.crest_sm,x0+W/2-s/2,y0+H/2-s*.53,s,s*1.06); c.globalAlpha=1; }
  // head string + foot spot
  c.strokeStyle='rgba(255,255,255,.12)'; c.lineWidth=1; c.beginPath(); c.moveTo(x0,y0+H*.75); c.lineTo(x0+W,y0+H*.75); c.stroke();
  c.fillStyle='rgba(255,255,255,.25)'; c.beginPath(); c.arc(x0+W/2,y0+H*.25,1.2,0,7); c.fill();
  // pockets
  for(let i=0;i<6;i++){ const [px,py]=this.toS(POCKETS[i][0],POCKETS[i][1],T), pr=R*T.s*(i===2||i===3?1.55:1.75);
   c.fillStyle='#2a1a0e'; c.beginPath(); c.arc(px,py,pr+2,0,7); c.fill();
   c.fillStyle='#050404'; c.beginPath(); c.arc(px,py,pr,0,7); c.fill(); }
 },
 drawCue(c,T){
  const cb=this.cue(); if(!cb.on) return;
  const [x,y]=this.toS(cb.x,cb.y,T), r=R*T.s, ux=Math.cos(this.ang), uy=Math.sin(this.ang);
  const back=r*1.6+this.pow*28, len=150;
  const sx=x-ux*back, sy=y-uy*back, ex=x-ux*(back+len), ey=y-uy*(back+len);
  c.save(); c.lineCap='round';
  c.strokeStyle='rgba(0,0,0,.35)'; c.lineWidth=4.2; c.beginPath(); c.moveTo(sx+3,sy+4); c.lineTo(ex+3,ey+4); c.stroke();
  const g=c.createLinearGradient(sx,sy,ex,ey); g.addColorStop(0,'#f0e2c0'); g.addColorStop(.04,'#f0e2c0'); g.addColorStop(.05,'#d8b070'); g.addColorStop(.62,'#b07a3a'); g.addColorStop(.66,'#2a1a10'); g.addColorStop(1,'#1a0e08');
  c.strokeStyle=g; c.lineWidth=3.4; c.beginPath(); c.moveTo(sx,sy); c.lineTo(ex,ey); c.stroke();
  c.strokeStyle='#3a7ad8'; c.lineWidth=3.4; c.beginPath(); c.moveTo(sx,sy); c.lineTo(sx-ux*1.6,sy-uy*1.6); c.stroke();
  c.restore();
 },
 draw(c){
  const VH=G.VH, T=this.T();
  this.drawTable(c,T);
  // aim guide (my turn)
  const mine=this.state==='play'&&this.turn==='me'&&this.phase==='aim';
  if(mine&&this.cue().on){
   const gd=this.guide(), [cx,cy]=this.toS(this.cue().x,this.cue().y,T), [gx,gy]=this.toS(gd.gx,gd.gy,T), r=R*T.s;
   c.setLineDash([3,4]); c.strokeStyle='rgba(255,255,255,.65)'; c.lineWidth=1; c.beginPath(); c.moveTo(cx,cy); c.lineTo(gx,gy); c.stroke(); c.setLineDash([]);
   c.strokeStyle='rgba(255,255,255,.75)'; c.beginPath(); c.arc(gx,gy,r,0,7); c.stroke();
   if(gd.hit){
    const own=this.targets('me').indexOf(gd.hit.n)>=0;
    const [hx,hy]=this.toS(gd.hit.x,gd.hit.y,T), L=R*T.s*7;
    c.strokeStyle=own?'rgba(128,255,160,.9)':'rgba(255,120,100,.9)'; c.lineWidth=1.6; c.beginPath(); c.moveTo(hx,hy); c.lineTo(hx+gd.nx*L,hy+gd.ny*L); c.stroke();
    const dot=gd.ux*gd.nx+gd.uy*gd.ny, tx=gd.ux-dot*gd.nx, ty=gd.uy-dot*gd.ny, tl=Math.hypot(tx,ty);
    if(tl>.05){ c.strokeStyle='rgba(255,255,255,.4)'; c.beginPath(); c.moveTo(gx,gy); c.lineTo(gx+tx/tl*L*.6,gy+ty/tl*L*.6); c.stroke(); }
    if(!own){ c.strokeStyle='#ff7060'; c.lineWidth=1.4; c.beginPath(); c.arc(hx,hy,r+2.5,0,7); c.stroke(); }
   }
  }
  for(const b of this.balls) if(b.on) this.drawBall(c,b,T);
  if(this.inHand&&this.turn==='me'&&this.phase==='aim'&&this.state==='play'){
   const [cx,cy]=this.toS(this.cue().x,this.cue().y,T), r=R*T.s;
   c.strokeStyle='rgba(255,208,96,'+(.5+.4*Math.sin(G.time*6))+')'; c.lineWidth=1.4; c.beginPath(); c.arc(cx,cy,r+5,0,7); c.stroke();
   if(this.kitchen){ c.fillStyle='rgba(255,208,96,.06)'; c.fillRect(T.x0,T.y0+T.H*.75,T.W,T.H*.25); }
  }
  if(this.state==='play'&&(this.phase==='aim'&&this.turn==='me'||this.phase==='think')) this.drawCue(c,T);
  // HUD
  K.gameBar(c,'8-BALL VS HAMMER',this.turn==='me'?'YOUR SHOT':'HAMMER');
  this.drawGroups(c);
  if(this.msgT>0){ c.globalAlpha=Math.min(1,this.msgT*2); G.txtO(this.msg,VW/2,T.y0+T.H*.5-8,8.5,this.msgCol,'center',VW-30); c.globalAlpha=1; }
  // controls
  const P=this.panel();
  c.fillStyle='rgba(11,10,16,.97)'; c.fillRect(0,P.y,VW,VH-P.y); c.fillStyle='rgba(240,120,24,.5)'; c.fillRect(0,P.y,VW,1);
  const live=mine;
  G.button({id:'l',label:'◀',x:P.l.x,y:P.l.y,w:P.l.w,h:P.l.h,kind:'secondary',disabled:!live,size:9});
  G.button({id:'r',label:'▶',x:P.r.x,y:P.r.y,w:P.r.w,h:P.r.h,kind:'secondary',disabled:!live,size:9});
  const B=P.bar;
  G.rrect(B.x,B.y,B.w,B.h,8); c.fillStyle='rgba(255,255,255,.08)'; c.fill(); c.strokeStyle='rgba(255,255,255,.15)'; c.lineWidth=1; c.stroke();
  if(this.pow>0){ const g=c.createLinearGradient(B.x,0,B.x+B.w,0); g.addColorStop(0,'#80ffa0'); g.addColorStop(.6,'#ffd060'); g.addColorStop(1,'#ff6a40'); G.rrect(B.x,B.y,Math.max(12,B.w*this.pow),B.h,8); c.fillStyle=g; c.fill(); }
  G.txt(this.pow>0?'POWER '+Math.round(this.pow*100)+'%':'POWER • SLIDE, LET GO TO SHOOT',B.x+B.w/2,B.y+3.5,6.2,this.pow>0?'#16100a':'#9a8f80','center',B.w-8,800);
  const tip=!live?(this.phase==='roll'?'…':'HAMMER IS LINING UP'):(this.inHand?'DRAG THE CUE BALL TO PLACE IT • TOUCH THE TABLE TO AIM':'TOUCH THE TABLE TO AIM • ◀ ▶ FINE-TUNE');
  G.txt(tip,VW/2,VH-18,5.6,'#8a7f70','center',VW-16,700);
  if(this.modal) this.modal.draw(c);
  if(this.pause.open) this.pause.draw(c);
 },
 drawGroups(c){
  const y=46;
  const row=(x,who,label,col,align)=>{
   const g=this.grp[who];
   G.txt(label+(g?' • '+GNAME[g]:''),x,y,6,col,align,120,800);
   if(!g){ G.txt('OPEN TABLE',x,y+11,5.6,'#9a8f80',align,undefined,700); return; }
   const ns=g==='solid'?[1,2,3,4,5,6,7]:[9,10,11,12,13,14,15];
   ns.forEach((n,i)=>{ const on=this.balls[n].on, bx=align==='left'?x+5+i*11:x-5-(6-i)*11;
    c.globalAlpha=on?1:.22; c.fillStyle=COLS[n]; c.beginPath(); c.arc(bx,y+15,4.2,0,7); c.fill();
    if(n>8){ c.fillStyle='#f6f2e8'; c.fillRect(bx-4.2,y+11,8.4,1.6); c.fillRect(bx-4.2,y+17.4,8.4,1.6); }
    c.globalAlpha=1; });
  };
  row(10,'me','YOU','#ff9a60','left'); row(VW-10,'ham','HAMMER','#ff7030','right');
 }
};
G.poolSim={step,bestShot,moving,R};   // QA
})();
