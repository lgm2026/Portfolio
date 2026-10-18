/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* POOL (the Game Room): clear the table in as few shots as you can. The seven balls are lettered A to G and
   called out in the phonetic alphabet when they drop ("ALFA!"). Pull back from anywhere and let go to shoot.
   Sinking the white cue ball costs one extra shot and it comes back to the start spot. */
(function(){
const H=G.HFQ, C=G.C, VW=G.VW, PI=Math.PI, MG=G.MG;
const R=6.2, PHON=['ALFA','BRAVO','CHARLIE','DELTA','ECHO','FOXTROT','GOLF'], COLS=['#ffc21a','#2f6fb5','#c23a3a','#6a3fa0','#e07a1a','#2f8a4a','#7a2a2a'];
G.scenes.g_pool={
 enter(a){ MG.start(this,'pool',a); this.shots=0; this.sl={}; this.rack(); this.state='aim'; this.pocketed=[]; },
 table(){ const VH=G.VH, top=58, h=Math.min(VH-top-30,(VW-36)*1.9); return {x:18,y:top,w:VW-36,h}; },
 rack(){ const T=this.table(), cx=T.x+T.w/2, top=T.y+T.h*.28; this.balls=[];
  let k=0; for(let r=0;r<4&&k<7;r++) for(let i=0;i<=r&&k<7;i++){ this.balls.push({x:cx+(i-r/2)*R*2.05,y:top-r*R*1.8,vx:0,vy:0,id:k,col:COLS[k],in:false}); k++; }
  this.cue={x:cx,y:T.y+T.h*.76,vx:0,vy:0,id:-1,col:'#f8f8f6',in:false}; this.balls.push(this.cue); },
 pockets(){ const T=this.table(); return [[T.x+3,T.y+3],[T.x+T.w-3,T.y+3],[T.x,T.y+T.h/2],[T.x+T.w,T.y+T.h/2],[T.x+3,T.y+T.h-3],[T.x+T.w-3,T.y+T.h-3]]; },
 moving(){ return this.balls.some(b=>!b.in&&(Math.abs(b.vx)>.5||Math.abs(b.vy)>.5)); },
 update(dt){
  if(MG.update(this,dt)) return;
  const T=this.table(), cue=this.cue;
  if(this.state==='aim'){
   const s=MG.sling(this.sl,cue.x,cue.y,100,(x,y)=>y>44);
   this.aim=s.active?s:null;
   if(s.fired){ const sp=80+s.fired.power*520, L=Math.hypot(s.fired.dx,s.fired.dy)||1; cue.vx=s.fired.dx/L*sp; cue.vy=s.fired.dy/L*sp; this.shots++; this.state='roll'; AUDIO.sfx('clack'); this.scratch=false; }
  } else if(this.state==='roll'){
   const sub=8, st=Math.min(dt,.05)/sub, P=this.pockets();
   for(let n=0;n<sub;n++){
    for(const b of this.balls){ if(b.in) continue; b.x+=b.vx*st; b.y+=b.vy*st; const f=Math.pow(.42,st); b.vx*=f; b.vy*=f;
     // cushions
     if(b.x<T.x+R){ b.x=T.x+R; b.vx=Math.abs(b.vx)*.82; if(Math.abs(b.vx)>30) AUDIO.sfx('cushion'); } if(b.x>T.x+T.w-R){ b.x=T.x+T.w-R; b.vx=-Math.abs(b.vx)*.82; if(Math.abs(b.vx)>30) AUDIO.sfx('cushion'); }
     if(b.y<T.y+R){ b.y=T.y+R; b.vy=Math.abs(b.vy)*.82; if(Math.abs(b.vy)>30) AUDIO.sfx('cushion'); } if(b.y>T.y+T.h-R){ b.y=T.y+T.h-R; b.vy=-Math.abs(b.vy)*.82; if(Math.abs(b.vy)>30) AUDIO.sfx('cushion'); }
     for(const p of P) if(Math.hypot(b.x-p[0],b.y-p[1])<R*1.75){ b.in=true; b.vx=b.vy=0; AUDIO.sfx('pocket');
      if(b===this.cue) this.scratch=true; else { this.pocketed.push(b.id); this.flash={t:1.2,txt:PHON[b.id]+'!',col:b.col}; } break; } }
    // ball-ball collisions (equal mass, elastic)
    for(let i=0;i<this.balls.length;i++) for(let j=i+1;j<this.balls.length;j++){ const a=this.balls[i], b=this.balls[j]; if(a.in||b.in) continue;
     const dx=b.x-a.x, dy=b.y-a.y, d=Math.hypot(dx,dy); if(d>0&&d<R*2){ const nx=dx/d, ny=dy/d, ov=R*2-d; a.x-=nx*ov/2; a.y-=ny*ov/2; b.x+=nx*ov/2; b.y+=ny*ov/2;
      const rv=(a.vx-b.vx)*nx+(a.vy-b.vy)*ny; if(rv>0){ a.vx-=rv*nx*.96; a.vy-=rv*ny*.96; b.vx+=rv*nx*.96; b.vy+=rv*ny*.96; if(rv>25) AUDIO.sfx('clack'); } } }
   }
   if(this.flash) this.flash.t-=dt;
   if(!this.moving()){ for(const b of this.balls){ b.vx=b.vy=0; }
    if(this.scratch){ this.shots++; this.cue.in=false; this.cue.x=T.x+T.w/2; this.cue.y=T.y+T.h*.76; this.flash={t:1.4,txt:'SCRATCH: +1 SHOT',col:C.warn}; AUDIO.sfx('thud');
     for(const b of this.balls) if(b!==this.cue&&!b.in&&Math.hypot(b.x-this.cue.x,b.y-this.cue.y)<R*2.2) this.cue.y+=R*2.4; }
    if(this.balls.filter(b=>b!==this.cue&&!b.in).length===0) return this.finish();
    this.state='aim'; }
  }
  if(this.flash&&this.state==='aim') this.flash.t-=dt;
 },
 finish(){ this.state='over'; MG.end(this,this.shots,{head:this.shots<=10?'TABLE CLEARED: SHARP SHOOTING!':'TABLE CLEARED',line:'All seven, ALFA through GOLF, in '+this.shots+' shots.'}); },
 draw(c){
  const VH=G.VH, T=this.table();
  MG.floor(c,0,42,VW,VH-42,'wood');
  c.save(); c.shadowColor='rgba(0,0,0,.6)'; c.shadowBlur=14; c.shadowOffsetY=6; MG.wood(c,T.x-10,T.y-10,T.w+20,T.h+20,'#5a3a22',12); c.restore();
  MG.felt(c,T.x,T.y,T.w,T.h,'#1f6a44',4);
  c.fillStyle='rgba(255,255,255,.06)'; c.fillRect(T.x,T.y+T.h*.76,T.w,1); c.beginPath(); c.arc(T.x+T.w/2,T.y+T.h*.76,2,0,PI*2); c.fill();
  for(const p of this.pockets()){ const pg=c.createRadialGradient(p[0],p[1],0,p[0],p[1],R*1.8); pg.addColorStop(0,'#000'); pg.addColorStop(.7,'#0b0b0c'); pg.addColorStop(1,'rgba(11,11,12,0)'); c.fillStyle=pg; c.beginPath(); c.arc(p[0],p[1],R*1.8,0,PI*2); c.fill(); }
  for(let i=0;i<3;i++){ c.fillStyle='#e8d8b0'; c.beginPath(); c.arc(T.x-5,T.y+T.h*(i+1)/4,1.4,0,PI*2); c.fill(); c.beginPath(); c.arc(T.x+T.w+5,T.y+T.h*(i+1)/4,1.4,0,PI*2); c.fill(); }
  // balls
  for(const b of this.balls){ if(b.in) continue; const sg=c.createRadialGradient(b.x+1.2,b.y+1.8,0,b.x+1.2,b.y+1.8,R*1.5); sg.addColorStop(0,'rgba(0,0,0,.4)'); sg.addColorStop(1,'rgba(0,0,0,0)'); c.fillStyle=sg; c.beginPath(); c.arc(b.x+1.2,b.y+1.8,R*1.5,0,PI*2); c.fill();
   MG.sphere(c,b.x,b.y,R,b.col);
   if(b.id>=0){ c.fillStyle='#f8f8f6'; c.beginPath(); c.arc(b.x,b.y,R*.55,0,PI*2); c.fill(); G.txt(PHON[b.id][0],b.x,b.y-2.6,5,'#141008','center',undefined,800); } }
  // cue stick + aim
  if(this.state==='aim'){ const cue=this.cue; if(this.aim){ const L=Math.hypot(this.aim.dx,this.aim.dy)||1, ux=this.aim.dx/L, uy=this.aim.dy/L, back=10+this.aim.power*26;
    c.strokeStyle='#c9a36a'; c.lineWidth=3; c.lineCap='round'; c.beginPath(); c.moveTo(cue.x-ux*(R+back),cue.y-uy*(R+back)); c.lineTo(cue.x-ux*(R+back+120),cue.y-uy*(R+back+120)); c.stroke();
    MG.aimLine(c,cue.x,cue.y,this.aim.dx,this.aim.dy,this.aim.power,150,'#ffffff'); }
   else G.txt('PULL BACK FROM ANYWHERE TO AIM',VW/2,T.y+T.h+8,5.6,C.sub,'center',undefined,800); }
  // pocketed tray
  const left=PHON.map((p,i)=>i).filter(i=>this.pocketed.indexOf(i)<0); G.txt('LEFT: '+left.map(i=>PHON[i]).join(' • ')||'',VW/2,48,4.8,C.sub,'center',VW-20,800);
  if(this.flash&&this.flash.t>0){ G.txt(this.flash.txt,VW/2,T.y+T.h/2-10,13,this.flash.col||C.title,'center',VW-30,800); }
  MG.hud(this,c,this.shots+' SHOTS',{sub:'CLEAR THE TABLE',tip:'Pull back from anywhere and let go. Each ball is a letter: sink ALFA through GOLF.'});
 }
};
})();
