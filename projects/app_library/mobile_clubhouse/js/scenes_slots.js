/* RAGING SLOTS (portrait): 3 free spins daily + convert earned points into spins.
   Pays points only. Never money, never a buy-in. */
(function(){
const VW=G.VW;
const SYMS=['wheel','flame','wrench','piston','shield','bell','crest'];
const WEIGHTS=[5,5,5,5,4,3,2];
const PAY3={wheel:120,flame:120,wrench:160,piston:160,shield:220,bell:350,crest:1000};
function rollSym(){
 const tot=WEIGHTS.reduce((a,b)=>a+b,0);
 let r=Math.random()*tot;
 for(let i=0;i<SYMS.length;i++){ r-=WEIGHTS[i]; if(r<=0) return i; }
 return 0;
}
function today(){ const d=new Date(); return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate(); }

function drawSym(c,i,cx,cy,sz){
 const s=sz/20;
 c.save(); c.translate(cx,cy); c.scale(s,s); c.translate(-10,-10);
 switch(SYMS[i]){
  case 'wheel': c.fillStyle='#15151c'; c.beginPath(); c.arc(10,10,8.5,0,7); c.fill();
   c.fillStyle='#9a9ea8'; c.beginPath(); c.arc(10,10,4.5,0,7); c.fill();
   c.strokeStyle='#55565e'; c.lineWidth=.9; for(let k=0;k<5;k++){ const a=k*Math.PI*2/5; c.beginPath(); c.moveTo(10+Math.cos(a)*1.5,10+Math.sin(a)*1.5); c.lineTo(10+Math.cos(a)*4.5,10+Math.sin(a)*4.5); c.stroke(); }
   c.fillStyle='#2a2e36'; c.beginPath(); c.arc(10,10,1.6,0,7); c.fill(); break;
  case 'flame': c.fillStyle='#f07818'; c.beginPath();
   c.moveTo(10,-1); c.bezierCurveTo(16,6,17,11,14,16); c.bezierCurveTo(12,19,8,19,6,16);
   c.bezierCurveTo(3,11,5,7,10,-1); c.fill();
   c.fillStyle='#ffd060'; c.beginPath(); c.arc(10,14,3.4,0,7); c.fill(); break;
  case 'wrench': c.fillStyle='#b8bcc8'; c.save(); c.translate(10,10); c.rotate(-.7);
   c.fillRect(-2,-8,4,16); c.beginPath(); c.arc(0,-8,4,0,7); c.fill(); c.beginPath(); c.arc(0,8,4,0,7); c.fill();
   c.fillStyle='#55565e'; c.fillRect(-4,-10,3,4); c.fillRect(1,6,3,4); c.restore(); break;
  case 'piston': c.fillStyle='#c8ccd4'; G.rrect(3,1,14,9,2); c.fill();
   c.fillStyle='#8a8e98'; c.fillRect(8,10,4,9); c.fillStyle='#55565e'; c.fillRect(3,4,14,2); break;
  case 'shield': c.fillStyle='#d8b020'; c.beginPath();
   c.moveTo(10,0); c.lineTo(18,3); c.lineTo(17,12); c.quadraticCurveTo(14,18,10,20);
   c.quadraticCurveTo(6,18,3,12); c.lineTo(2,3); c.closePath(); c.fill();
   c.fillStyle='#8a2a1a'; c.beginPath(); c.moveTo(10,4); c.lineTo(14,6); c.lineTo(13.5,11); c.quadraticCurveTo(12,14,10,15); c.quadraticCurveTo(8,14,6.5,11); c.lineTo(6,6); c.closePath(); c.fill(); break;
  case 'bell': c.fillStyle='#ffd060'; c.beginPath();
   c.moveTo(10,1); c.quadraticCurveTo(17,3,17,14); c.lineTo(3,14); c.quadraticCurveTo(3,3,10,1); c.fill();
   c.fillRect(1,14,18,3); c.beginPath(); c.arc(10,19,2.4,0,7); c.fill();
   c.fillStyle='#b08020'; c.fillRect(9,0,2,3); break;
  case 'crest': c.drawImage(G.img.crest_sm,0,-1,20,21); break;
 }
 c.restore();
}

G.scenes.slots={
 enter(){
  let sl=G.save.slots;
  if(!sl||sl.d!==today()||sl.t!==undefined){ sl=G.save.slots={d:today(),free:3,bank:(sl&&sl.bank)||0}; G.persist(); }
  this.reels=[0,1,2].map(()=>({syms:this.strip(),off:0,spd:0,stopped:true}));
  this.spinning=false; this.lever=0; this.msg='TAP SPIN • GOOD LUCK'; this.msgCol='#cfc4b0';
  this.won=0; this.wonShow=0; this.flash=0; this.hold=false; this.st={f:0}; this.pays=null;
  AUDIO.play('poker');
 },
 strip(){ const a=[]; for(let i=0;i<20;i++) a.push(rollSym()); return a; },
 spins(){ const sl=G.save.slots; return sl.free+sl.bank; },
 L(){
  const VH=G.VH, y0=48, y1=VH-142;
  const avail=(y1-62)-(y0+56), rh=Math.min(156,avail), rt=y0+56+(avail-rh)/2;
  return {mx:12,mw:236,y0,y1,rt,rh};
 },
 btns(){
  const VH=G.VH, n=this.spins();
  return [
   {id:'spin',label:this.spinning?'SPINNING...':'SPIN!',sub:this.spinning?'':(n?n+' SPIN'+(n===1?'':'S')+' LEFT':'CONVERT POINTS BELOW'),kind:!this.spinning&&n?'primary':'secondary',x:20,y:VH-130,w:230,h:48,size:11},
   {id:'b1',label:'+1 SPIN',sub:'25 PTS',x:8,y:VH-74,w:82,h:40,size:7.5,subSize:6,disabled:this.spinning},
   {id:'b5',label:'+5 SPINS',sub:'100 PTS',x:94,y:VH-74,w:82,h:40,size:7.5,subSize:6,disabled:this.spinning},
   {id:'pays',label:'PAYOUTS',kind:'ghost',x:180,y:VH-74,w:82,h:40,size:7.5}
  ];
 },
 buy(n,cost){
  if(this.spinning) return;
  if(G.save.points<cost){ this.msg='NEED '+cost+' PTS - GO EARN SOME!'; this.msgCol='#ff8a70'; AUDIO.sfx('buzzer'); return; }
  G.save.points-=cost; G.save.slots.bank+=n; G.persist();
  this.msg='+'+n+' SPIN'+(n>1?'S':'')+' IN THE BANK'; this.msgCol='#80ffa0';
  AUDIO.sfx('pickup');
 },
 spin(){
  if(this.spinning) return;
  const sl=G.save.slots;
  if(this.spins()<=0){ this.msg='OUT OF SPINS - CONVERT POINTS BELOW'; this.msgCol='#ffd060'; AUDIO.sfx('buzzer'); return; }
  if(sl.free>0) sl.free--; else sl.bank--;
  G.persist();
  this.spinning=true; this.lever=1; this.won=0; this.wonShow=0;
  this.msg='GOOD LUCK...'; this.msgCol='#cfc4b0';
  this.result=[rollSym(),rollSym(),rollSym()];
  this.hold=this.result[0]===this.result[1]; // two match: let the third one sweat
  this.reels.forEach((r,i)=>{ r.spd=520+i*60; r.stopAt=G.time+1.0+i*.45+(i===2&&this.hold?.9:0); r.stopped=false; });
  AUDIO.sfx('rev');
 },
 openPays(){
  this.pays=G.Modal({title:'PAYOUTS',sub:'THREE ON THE CENTER LINE',bodyH:7*22+30,drawBody:(c,x,y,w)=>{
   SYMS.forEach((s,i)=>{ const yy=y+4+i*22; drawSym(c,i,x+40,yy+8,17); G.txt(s.toUpperCase()+' ×3',x+58,yy+2,7,'#e8dcc8','left',undefined,700); G.txt(PAY3[s]+' PTS',x+w-24,yy+2,7.5,s==='crest'?'#ffd060':'#cfc4b0','right',undefined,800); });
   G.txt('TWO CRESTS 75 • ANY PAIR 30 • ONE CREST 15',x+w/2,y+7*22+10,6,'#9a8f80','center',w-16,700);
  },btns:[{id:'ok',label:'GOT IT',kind:'primary'}]});
 },
 update(dt){
  if(this.pays){ const r=this.pays.update(); if(r||G.pressed.b){ this.pays=null; } return; }
  if(G.backHit()){
   if(this.spinning){ G.toast('HOLD ON - THE REELS ARE SPINNING','#ffd060'); return; }
   G.go(G.gamesBack()); return;
  }
  if(this.flash>0) this.flash-=dt;
  if(this.won>this.wonShow) this.wonShow=Math.min(this.won,this.wonShow+dt*Math.max(200,this.won));
  if(this.lever>0&&!this.spinning) this.lever=Math.max(0,this.lever-dt*3);
  const L=this.L();
  if(!this.spinning&&G.clicked(L.mx,L.rt,L.mw+20,L.rh)) this.spin();
  const id=G.navList(this.st,this.btns(),{both:true});
  if(id==='spin') this.spin();
  else if(id==='b1') this.buy(1,25);
  else if(id==='b5') this.buy(5,100);
  else if(id==='pays') this.openPays();
  if(this.spinning){
   let allStopped=true;
   this.reels.forEach((r,i)=>{
    if(r.stopped) return;
    allStopped=false;
    r.off+=r.spd*dt;
    if(G.time>r.stopAt){
     r.stopped=true; r.off=0;
     r.syms[2]=this.result[i];
     r.syms[1]=rollSym(); r.syms[3]=rollSym();
     AUDIO.sfx('thud'); G.shake=1.5;
     if(i===1&&this.hold){ this.msg='HOLD ON... TWO MATCHING!'; this.msgCol='#ffd060'; AUDIO.sfx('horn'); }
    } else if(Math.random()<dt*14) AUDIO.sfx('tick');
   });
   if(allStopped){ this.spinning=false; this.lever=0; this.payout(); }
  }
 },
 payout(){
  const[a,b,c2]=this.result;
  const names=[SYMS[a],SYMS[b],SYMS[c2]];
  const crests=names.filter(n=>n==='crest').length;
  let pts=0,msg='SO CLOSE! SPIN AGAIN',col='#cfc4b0';
  if(a===b&&b===c2){
   pts=PAY3[names[0]];
   msg=names[0]==='crest'?'JACKPOT!! TRIPLE CREST!':'THREE '+names[0].toUpperCase()+'S!';
   col=names[0]==='crest'?'#ffd060':'#80ffa0';
   if(names[0]==='crest') G.ach('jackpot');
   this.flash=2;
  } else if(crests===2){ pts=75; msg='TWO CRESTS! +75'; col='#80ffa0'; }
  else if(a===b||b===c2||a===c2){ pts=30; msg='PAIR! +30'; col='#80ffa0'; }
  else if(crests===1){ pts=15; msg='CREST BONUS +15'; col='#80e0ff'; }
  this.msg=msg; this.msgCol=col;
  if(pts){ this.won=pts; this.wonShow=0; G.award(pts,'RAGING SLOTS'); if(pts>=400) AUDIO.jingle('win'); else AUDIO.sfx('bigpoint'); }
  else AUDIO.sfx('back');
  const best=G.save.best.slots||0; if(pts>best){ G.save.best.slots=pts; G.persist(); }
 },
 draw(c){
  const VH=G.VH, L=this.L(), {mx,mw,y0,y1,rt,rh}=L;
  c.fillStyle='#1b1410'; c.fillRect(0,0,VW,VH);
  for(let y=42;y<VH;y+=12){ c.fillStyle=(y/12|0)%2?'#211812':'#1b1410'; c.fillRect(0,y,VW,6); }
  // cabinet
  c.save(); if(!G.rm()){ c.shadowColor=this.flash>0?'#ffd060':'rgba(0,0,0,.6)'; c.shadowBlur=this.flash>0?18:12; }
  G.rrect(mx,y0,mw,y1-y0,16);
  const grad=c.createLinearGradient(0,y0,0,y1); grad.addColorStop(0,'#7a2434'); grad.addColorStop(1,'#4e1622');
  c.fillStyle=grad; c.fill(); c.restore();
  G.rrect(mx,y0,mw,y1-y0,16); c.strokeStyle='#e8c87a'; c.lineWidth=2; c.stroke();
  // marquee
  G.rrect(mx+8,y0+6,mw-16,32,10); c.fillStyle='#2a0e16'; c.fill();
  c.drawImage(G.img.crest_sm,mx+14,y0+8,26,28);
  G.txtO('RAGING SLOTS',mx+mw/2+12,y0+13,10,this.flash>0&&Math.sin(G.time*12)>0?'#fff':'#ffd060','center');
  for(let i=0;i<14;i++){
   const on=this.flash>0?Math.sin(G.time*10+i)>0:(i===(Math.floor(G.time*6)%14));
   c.fillStyle=on?'#ffd060':'rgba(255,208,96,.2)';
   c.beginPath(); c.arc(mx+18+i*((mw-36)/13),y0+46,2.5,0,7); c.fill();
  }
  // reels
  const rw=66, gap=8, rx0=mx+(mw-(rw*3+gap*2))/2, P=rh/3, ss=Math.min(36,P*.72);
  for(let i=0;i<3;i++){
   const rx=rx0+i*(rw+gap), r=this.reels[i];
   G.rrect(rx,rt,rw,rh,10); c.fillStyle='#f4efe2'; c.fill();
   c.save(); G.rrect(rx,rt,rw,rh,10); c.clip();
   const base=rt+rh/2;
   for(let k=-2;k<=2;k++){
    const yy=base+k*P+(r.stopped?0:(r.off%P));
    const sym=r.stopped?r.syms[(2+k+r.syms.length)%r.syms.length]:r.syms[((2+k-Math.floor(r.off/P))%r.syms.length+r.syms.length*10)%r.syms.length];
    drawSym(c,sym,rx+rw/2,yy,ss);
   }
   const sh=c.createLinearGradient(0,rt,0,rt+rh);
   sh.addColorStop(0,'rgba(0,0,0,.5)'); sh.addColorStop(.28,'rgba(0,0,0,0)'); sh.addColorStop(.72,'rgba(0,0,0,0)'); sh.addColorStop(1,'rgba(0,0,0,.5)');
   c.fillStyle=sh; c.fillRect(rx,rt,rw,rh);
   c.restore();
  }
  c.strokeStyle='rgba(240,120,24,.85)'; c.lineWidth=2;
  c.beginPath(); c.moveTo(mx+8,rt+rh/2); c.lineTo(mx+mw-8,rt+rh/2); c.stroke();
  c.fillStyle='#f07818'; c.beginPath(); c.moveTo(mx+4,rt+rh/2-5); c.lineTo(mx+10,rt+rh/2); c.lineTo(mx+4,rt+rh/2+5); c.fill();
  c.beginPath(); c.moveTo(mx+mw-4,rt+rh/2-5); c.lineTo(mx+mw-10,rt+rh/2); c.lineTo(mx+mw-4,rt+rh/2+5); c.fill();
  if(this.wonShow>0&&!this.spinning) G.txtO('+'+Math.round(this.wonShow),VW/2,rt+rh/2-P-6,15,'#ffd060','center');
  // lever (decorative; tapping the reels spins too)
  const lv=this.lever, lx=mx+mw+5, top=rt+10, len=rh*.55;
  c.strokeStyle='#8a8e98'; c.lineWidth=4; c.lineCap='round';
  const ky=top+len*.1+lv*len*.8;
  c.beginPath(); c.moveTo(lx,top+len); c.lineTo(lx,ky); c.stroke();
  c.fillStyle='#c02030'; c.beginPath(); c.arc(lx,ky,5.5,0,7); c.fill();
  // message + spins line
  G.rrect(mx+12,y1-54,mw-24,22,11); c.fillStyle='#2a0e16'; c.fill();
  G.txt(this.msg,VW/2-6,y1-48,6.8,this.msgCol,'center',mw-40,800);
  const sl=G.save.slots;
  G.txt('SPINS '+this.spins()+(sl.free?(' (FREE '+sl.free+')'):''),mx+16,y1-24,7,this.spins()?'#80ffa0':'#ff8a70','left',undefined,800);
  G.txt(G.save.points.toLocaleString()+' PTS',mx+mw-16,y1-24,7,'#ffd060','right',undefined,800);
  G.drawBtns(this.btns(),this.st);
  G.txt('3 FREE SPINS DAILY • PAYS POINTS, NEVER MONEY',VW/2,VH-24,5.8,'#8a8a98','center',VW-16,700);
  G.topBar('RAGING SLOTS',{right:G.save.points.toLocaleString()+' PTS'});
  if(this.pays) this.pays.draw(c);
 }
};
})();
