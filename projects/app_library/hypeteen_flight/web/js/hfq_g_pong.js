/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* PROP PONG (the Game Room): ping-pong on a runway-striped table against the crew chief. Drag to move your paddle.
   The ball speeds up with every rally ("AFTERBURNER" past a certain speed). Where it hits your paddle sets the angle.
   First to 7. Score = your margin (7-3 is +4). */
(function(){
const H=G.HFQ, C=G.C, VW=G.VW, PI=Math.PI, MG=G.MG;
const PW=40, PH=6, BR=3.4, WIN=7;
G.scenes.g_pong={
 enter(a){ MG.start(this,'pong',a); this.me=0; this.cpu=0; this.px=VW/2; this.cx=VW/2; this.serveT=1.1; this.ball=null; this.rally=0; this.dir=1; this.msg='SERVE: YOU'; },
 table(){ const VH=G.VH; return {x:18,y:58,w:VW-36,h:VH-58-28}; },
 serve(){ const T=this.table(), dir=this.dir; const sp=150; const a=(Math.random()*.6-.3);
  this.ball={x:T.x+T.w/2,y:T.y+T.h/2,vx:Math.sin(a)*sp,vy:dir*Math.cos(a)*sp}; this.rally=0; this.msg=null; AUDIO.sfx('paddle'); },
 point(meScored){ if(meScored){ this.me++; AUDIO.sfx('point'); } else { this.cpu++; AUDIO.sfx('thud'); }
  this.ball=null; this.dir=meScored?-1:1; this.serveT=1; this.msg=meScored?'POINT: YOU':'POINT: CREW CHIEF';
  if(this.me>=WIN||this.cpu>=WIN){ const m=this.me-this.cpu; MG.end(this,m,{head:m>0?'YOU WIN '+this.me+'–'+this.cpu:'CREW CHIEF WINS '+this.cpu+'–'+this.me,line:m>0?'Nice rallies! Margin +'+m+'.':'So close. The crew chief has been practicing.',lose:m<0}); } },
 update(dt){
  if(MG.update(this,dt)) return;
  const T=this.table(), py=T.y+T.h-16, cy=T.y+16;
  if(G.ptr.down&&G.ptr.y>44) this.px+=(G.ptr.x-this.px)*Math.min(1,dt*18);
  if(G.pressed.left) this.px-=10; if(G.pressed.right) this.px+=10;
  this.px=Math.max(T.x+PW/2,Math.min(T.x+T.w-PW/2,this.px));
  if(!this.ball){ this.serveT-=dt; if(this.serveT<=0&&!this.over) this.serve(); }
  const b=this.ball;
  // the crew chief: follows the ball, a little slow, aims off-center sometimes
  const target=b&&b.vy<0?b.x+Math.sin(this.t*1.7)*10:T.x+T.w/2, cs=95+Math.min(120,this.rally*7);
  this.cx+=Math.max(-cs*dt,Math.min(cs*dt,target-this.cx)); this.cx=Math.max(T.x+PW/2,Math.min(T.x+T.w-PW/2,this.cx));
  if(!b) return;
  const sub=4, st=Math.min(dt,.05)/sub;
  for(let i=0;i<sub;i++){
   b.x+=b.vx*st; b.y+=b.vy*st;
   if(b.x<T.x+BR){ b.x=T.x+BR; b.vx=Math.abs(b.vx); AUDIO.sfx('wall'); } if(b.x>T.x+T.w-BR){ b.x=T.x+T.w-BR; b.vx=-Math.abs(b.vx); AUDIO.sfx('wall'); }
   const hitPaddle=(px,y,down)=>{ if(Math.abs(b.y-y)<PH/2+BR&&Math.abs(b.x-px)<PW/2+BR&&(down?b.vy>0:b.vy<0)){
     const off=(b.x-px)/(PW/2), sp=Math.min(420,Math.hypot(b.vx,b.vy)*1.06+6), ang=off*1.05;
     b.vx=Math.sin(ang)*sp; b.vy=(down?-1:1)*Math.cos(ang)*sp; b.y=y+(down?-1:1)*(PH/2+BR); this.rally++; AUDIO.sfx('paddle');
     if(sp>300&&!this.ab){ this.ab=1; G.toast('AFTERBURNER!',C.warn); } return true; } return false; };
   hitPaddle(this.px,py,true); hitPaddle(this.cx,cy,false);
   if(b.y>T.y+T.h+8){ this.point(false); return; } if(b.y<T.y-8){ this.point(true); return; }
  }
 },
 draw(c){
  const VH=G.VH, T=this.table();
  MG.floor(c,0,42,VW,VH-42,'hangar');
  // the table, painted like a runway
  c.save(); c.shadowColor='rgba(0,0,0,.55)'; c.shadowBlur=14; c.shadowOffsetY=6; G.rrect(T.x,T.y,T.w,T.h,6); c.fillStyle='#1f5aa6'; c.fill(); c.restore();
  MG.felt(c,T.x,T.y,T.w,T.h,'#1f5aa6',6); c.strokeStyle='#f4f4f2'; c.lineWidth=2; G.rrect(T.x+1,T.y+1,T.w-2,T.h-2,6); c.stroke();
  c.fillStyle='rgba(255,255,255,.85)'; for(let y=T.y+30;y<T.y+T.h-30;y+=26) c.fillRect(T.x+T.w/2-1,y,2,14);
  for(const yy of [T.y+6,T.y+T.h-16]) for(let x=T.x+T.w/2-34;x<T.x+T.w/2+34;x+=8) c.fillRect(x,yy,4,10);
  G.txt('27',T.x+T.w/2,T.y+T.h-40,12,'rgba(255,255,255,.5)','center',undefined,800); G.txt('9',T.x+T.w/2,T.y+24,12,'rgba(255,255,255,.5)','center',undefined,800);
  c.fillStyle='rgba(255,255,255,.65)'; c.fillRect(T.x-4,T.y+T.h/2-1,T.w+8,2);    // the net
  // paddles: yours yellow, the crew chief's red
  const py=T.y+T.h-16, cy=T.y+16;
  c.fillStyle='#ffc21a'; G.rrect(this.px-PW/2,py-PH/2,PW,PH,3); c.fill(); c.fillStyle='#c23a3a'; G.rrect(this.cx-PW/2,cy-PH/2,PW,PH,3); c.fill();
  // ball + its motion blur
  const b=this.ball; if(b){ const sp=Math.hypot(b.vx,b.vy); if(sp>220&&!G.rm()){ c.fillStyle='rgba(255,138,26,.25)'; c.beginPath(); c.arc(b.x-b.vx*.02,b.y-b.vy*.02,BR,0,PI*2); c.fill(); }
   MG.sphere(c,b.x,b.y,BR,'#ff8a1a'); }
  G.txt(String(this.cpu),T.x+10,T.y+T.h/2-22,14,'rgba(255,255,255,.5)','left',undefined,800); G.txt(String(this.me),T.x+10,T.y+T.h/2+8,14,'#ffc21a','left',undefined,800);
  if(this.msg&&!this.ball) G.txt(this.msg,VW/2,T.y+T.h/2-30,7.4,C.ink,'center',undefined,800);
  G.txt('CREW CHIEF',VW/2,48,5.4,C.sub,'center',undefined,800);
  MG.hud(this,c,this.me+' – '+this.cpu,{sub:'FIRST TO 7',tip:'Drag to move your yellow paddle. Hit with the edge to angle the ball.'});
 }
};
})();
