/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* HYPETEEN FLIGHT ACADEMY - THE AIRFIELD: art for the Tower cab, the Parking Stand and the Wash Rack,
   and the AIRFIELD MAP (the round MAP button in every place): a walkaround view of the field that pops up over the room; tap a place to go there.
   The places themselves are data in hfq_data.js (G.WORLD). FAA colors throughout: white runway markings,
   yellow taxiway markings, blue taxiway edge lights, hold-short lines solid on the holding side. */
(function(){
const H=G.HFQ, C=G.C, VW=G.VW, PI=Math.PI, A=G.worldArt;
const T=()=>G.rm()?0:G.time;

/* ============================ WALLS ============================ */
/* the tower cab: windows all the way across, looking out over the runway */
A.walls.towercab=function(c,R,P){
 const top=12, bot=R.wall-24;
 c.fillStyle='#1c232c'; c.fillRect(0,0,R.w,R.wall);
 // the view: sky, the far side of the airfield, the runway with an airplane now and then
 const g=c.createLinearGradient(0,top,0,bot); g.addColorStop(0,'#4f93d8'); g.addColorStop(.55,'#bcdcf6'); g.addColorStop(.56,'#6f9c52'); g.addColorStop(1,'#4f7a3e'); c.fillStyle=g; c.fillRect(0,top,R.w,bot-top);
 const hz=top+(bot-top)*.55, t=T();
 c.fillStyle='rgba(255,255,255,.8)'; for(let i=0;i<5;i++){ const cx=((i*131+t*5)%(R.w+80))-40, cy=top+10+(i*17)%30; c.beginPath(); c.ellipse(cx,cy,16,5,0,0,7); c.ellipse(cx+12,cy-3,10,5,0,0,7); c.fill(); }
 c.fillStyle='#3f6a3a'; for(let x=0;x<R.w;x+=18){ c.beginPath(); c.arc(x+9,hz,6+((x*7)%4),PI,0); c.fill(); }
 const ry=hz+(bot-hz)*.52; c.fillStyle='#45484e'; c.fillRect(0,ry,R.w,9); c.fillStyle='#f2f2f2'; for(let x=10;x<R.w;x+=26) c.fillRect(x,ry+4,13,1.2); c.fillRect(0,ry+.6,R.w,.8); c.fillRect(0,ry+7.6,R.w,.8);
 c.fillStyle='#55585e'; c.fillRect(0,ry+18,R.w,5); c.fillStyle='#ffc21a'; c.fillRect(0,ry+20,R.w,.9);
 // an airplane rolls down the runway and climbs out, every ~16 s
 const k=(t%16)/16, px=-30+k*(R.w+60), climb=Math.max(0,(k-.45)/.55);
 c.save(); c.translate(px,ry+3-climb*climb*46); c.rotate(-.18*Math.min(1,climb*3)); c.fillStyle='#f4f6fa'; c.beginPath(); c.ellipse(0,0,9,2.2,0,0,7); c.fill(); c.fillRect(-1,-4,3,4); c.fillRect(-9,-4.5,2.2,4); c.fillStyle='#2f6fb5'; c.fillRect(-8,-.4,16,.9); c.restore();
 // mullions, the ceiling visor and the console ledge
 c.fillStyle='#10151b'; c.fillRect(0,0,R.w,top); for(let x=0;x<=R.w;x+=74){ c.beginPath(); c.moveTo(x-3,top); c.lineTo(x+3,top); c.lineTo(x+6,bot); c.lineTo(x-6,bot); c.closePath(); c.fill(); }
 c.fillStyle='rgba(30,40,55,.55)'; for(let x=10;x<R.w;x+=148) c.fillRect(x,top,60,12);
 c.fillStyle='#2a323d'; c.fillRect(0,bot,R.w,R.wall-bot); c.fillStyle='#39434f'; c.fillRect(0,bot,R.w,4);
 c.fillStyle='rgba(255,255,255,.06)'; c.fillRect(0,top,R.w,2);
};
/* the wash bay: a covered pad with a corrugated back wall */
A.walls.washbay=function(c,R,P){
 c.fillStyle=P.wall||'#4a5a6a'; c.fillRect(0,0,R.w,R.wall);
 c.fillStyle='rgba(255,255,255,.08)'; for(let x=0;x<R.w;x+=7) c.fillRect(x,14,2.2,R.wall-14);
 c.fillStyle='#2a3440'; c.fillRect(0,0,R.w,14); c.fillStyle='rgba(255,250,220,.9)'; for(let x=70;x<R.w;x+=130) c.fillRect(x-12,10,24,3);
 // painted reminders on the wall
 const sign=(x,y,w,txt,bg,ink)=>{ c.fillStyle=bg; c.fillRect(x,y,w,16); G.txt(txt,x+w/2,y+5,5.2,ink,'center',w-6,800); };
 sign(150,34,140,'WASH RACK',C.accent||'#ffc21a','#111');
 sign(130,56,180,'COVER PITOT + STATIC PORTS FIRST','#c8102e','#fff');
 c.fillStyle='#ff6a1a'; c.fillRect(312,60,10,3); c.fillRect(318,60,3,14);
};

/* ============================ FLOORS ============================ */
A.floors.carpet=function(c,R,P){ c.fillStyle=P.floor||'#39414e'; c.fillRect(0,R.wall,R.w,R.h-R.wall); c.fillStyle='rgba(255,255,255,.035)'; for(let y=R.wall+6;y<R.h;y+=12) for(let x=(y/12%2)*12;x<R.w;x+=24) c.fillRect(x,y,6,6); };
A.floors.apron=function(c,R,P){
 c.fillStyle=P.floor||'#7c8087'; c.fillRect(0,R.wall,R.w,R.h-R.wall);
 c.fillStyle='rgba(0,0,0,.09)'; for(let x=40;x<R.w;x+=80) c.fillRect(x,R.wall,1.4,R.h-R.wall); for(let y=R.wall+50;y<R.h;y+=50) c.fillRect(0,y,R.w,1.4);
 // the taxilane centerline (yellow) along the back, and a lead-in line to each parking spot
 c.strokeStyle='#ffc21a'; c.lineWidth=3; c.beginPath(); c.moveTo(14,R.wall+22); c.lineTo(R.w-14,R.wall+22); c.stroke();
 c.lineWidth=2; for(const x of [100,320,530]){ c.beginPath(); c.moveTo(x,R.wall+22); c.lineTo(x,R.wall+96); c.stroke(); c.beginPath(); c.moveTo(x-16,R.wall+96); c.lineTo(x+16,R.wall+96); c.stroke(); }
 // parking spot numbers + tie-down rings
 [['P1',100],['P2',320],['P3',530]].forEach(([n,x])=>G.txt(n,x+22,R.wall+30,8,'rgba(255,255,255,.75)','left',undefined,800));
 c.strokeStyle='#e9edf2'; c.lineWidth=1.2; for(const x of [60,140,280,360,490,570]) for(const y of [R.wall+150,R.wall+290]){ c.beginPath(); c.arc(x,y,2.2,0,7); c.stroke(); }
};
A.floors.washpad=function(c,R,P){
 c.fillStyle=P.floor||'#8e949b'; c.fillRect(0,R.wall,R.w,R.h-R.wall);
 c.fillStyle='rgba(40,70,110,.16)'; for(const [x,y,rx,ry] of [[150,300,90,26],[330,320,70,18],[260,250,120,14]]){ c.beginPath(); c.ellipse(x,y,rx,ry,0,0,7); c.fill(); }
 c.fillStyle='#4a4f56'; c.fillRect(R.w/2-60,R.h-48,120,8); c.fillStyle='#2a2d33'; for(let x=R.w/2-58;x<R.w/2+60;x+=5) c.fillRect(x,R.h-47,2.4,6);   // the drain
 c.fillStyle='rgba(255,255,255,.12)'; for(let i=0;i<8;i++){ const x=40+i*60, y=R.wall+40+(i*37)%160; c.fillRect(x,y,14,1); }
};

/* ============================ WALL ART (tower cab) ============================ */
A.wall.wxscreen=function(c,s,R){ const w=s.w, x=s.x-w/2, y=20, h=46;
 c.fillStyle='#0d1116'; c.fillRect(x-3,y-3,w+6,h+6); c.fillStyle='#07150c'; c.fillRect(x,y,w,h);
 const wx=H.wx?H.wx.today():null, lines=wx?H.wx.metarLines(wx.metar,13):['METAR','KXXX 000000Z'];
 G.txt('METAR',x+4,y+3,5,'#3fdc7c','left',undefined,800);
 lines.slice(0,3).forEach((l,i)=>G.txt(l,x+4,y+13+i*9,5,'#9fffc4','left',w-8,600));
 c.fillStyle='#3a4250'; c.fillRect(s.x-2,y+h+3,4,R.wall-y-h-27); };
A.wall.wxwindow=function(c,s,R){ const w=s.w, x=s.x-w/2;
 c.strokeStyle='#ffc21a'; c.lineWidth=1.4; c.setLineDash([4,3]); c.strokeRect(x+4,18,w-8,R.wall-48); c.setLineDash([]);
 G.rrect(s.x-24,R.wall-44,48,14,7); c.fillStyle='rgba(11,11,12,.75)'; c.fill(); G.icon('cloud',c,s.x-12,R.wall-37,9,'#ffd24d'); G.txt('VFR?',s.x+6,R.wall-41,5.4,'#ffd24d','center',undefined,800); };
A.wall.strips=function(c,s,R){ const w=s.w, x=s.x-w/2, y=24, h=R.wall-64;
 c.fillStyle='#2a2d33'; c.fillRect(x-3,y-3,w+6,h+6); c.fillStyle='#3a3f48'; c.fillRect(x,y,w,h);
 const cols=['#f4e6b8','#bfe0ff','#f4e6b8','#c8f0c8','#bfe0ff','#f4e6b8'];
 for(let i=0;i<6;i++){ c.fillStyle=cols[i]; c.fillRect(x+4,y+4+i*((h-8)/6),w-8,(h-8)/6-2); c.fillStyle='rgba(0,0,0,.45)'; c.fillRect(x+8,y+7+i*((h-8)/6),18,1.4); c.fillRect(x+30,y+7+i*((h-8)/6),26,1.4); } };

/* ============================ FLOOR ART ============================ */
A.floor.lightgun=function(c,f,h){ const cx=(f[0]+f[2])/2, b=f[3], t=T();   // the tower's signal light gun on its stand, aimed out the window
 c.strokeStyle='#5d6672'; c.lineWidth=2; c.beginPath(); c.moveTo(cx-9,b); c.lineTo(cx,b-h+16); c.lineTo(cx+9,b); c.moveTo(cx,b); c.lineTo(cx,b-h+16); c.stroke();
 const k=Math.floor(t/2.2)%3, col=['#3fdc7c','#ff3b30','#f4f4f4'][k], on=(t*2.5)%1<.6;
 c.save(); c.translate(cx,b-h+12);
 if(on){ c.globalAlpha=.22; c.fillStyle=col; c.beginPath(); c.moveTo(-6,-8); c.lineTo(-30,-44); c.lineTo(14,-44); c.lineTo(6,-8); c.closePath(); c.fill(); c.globalAlpha=1; }
 c.fillStyle='#2a2d33'; G.rrect(-9,-9,18,16,5); c.fill(); c.fillStyle='#4a5260'; c.fillRect(-12,-2,4,8); c.fillRect(8,-2,4,8);
 c.beginPath(); c.arc(0,-2,6.5,0,7); c.fillStyle='#14161a'; c.fill(); c.beginPath(); c.arc(0,-2,5,0,7); c.fillStyle=on?col:'#3a3f48'; c.fill();
 if(on){ c.fillStyle='rgba(255,255,255,.6)'; c.beginPath(); c.arc(-1.6,-3.6,1.4,0,7); c.fill(); }
 c.restore(); };
A.floor.console=function(c,f,h,col,s,wf){ const w=f[2]-f[0], t=T(); wf=wf||f;
 G.V.box(c,wf,h,'#2a323d',{rim:true});
 const sx=f[0]+8, sy=f[3]-h-22, sw=w-16, sh=20; c.fillStyle='#10151b'; c.fillRect(sx-2,sy-2,sw+4,sh+4); c.fillStyle='#061209'; c.fillRect(sx,sy,sw,sh);
 const kind=s&&s.text;
 if(kind==='APP'){ const cx=sx+sw/2, cy=sy+sh/2; c.strokeStyle='rgba(63,220,124,.5)'; c.lineWidth=.8; c.beginPath(); c.arc(cx,cy,8,0,7); c.stroke(); c.beginPath(); c.arc(cx,cy,4,0,7); c.stroke();
  const a=t*2; c.strokeStyle='#3fdc7c'; c.beginPath(); c.moveTo(cx,cy); c.lineTo(cx+Math.cos(a)*9,cy+Math.sin(a)*9); c.stroke(); c.fillStyle='#9fffc4'; c.fillRect(cx+5,cy-4,1.6,1.6); c.fillRect(cx-6,cy+2,1.6,1.6); }
 else if(kind==='GND'){ c.strokeStyle='#ffc21a'; c.lineWidth=1; c.beginPath(); c.moveTo(sx+3,sy+sh-5); c.lineTo(sx+sw-3,sy+sh-5); c.moveTo(sx+12,sy+sh-5); c.lineTo(sx+12,sy+5); c.lineTo(sx+sw-8,sy+5); c.stroke(); c.fillStyle='#f4f4f4'; c.fillRect(sx+3,sy+sh-3,sw-6,1.2); c.fillStyle='#3fdc7c'; const k=(t*.3)%1; c.fillRect(sx+12-1.5,sy+5+(sh-10)*(1-k)-1.5,3,3); }
 else { for(let i=0;i<3;i++){ c.fillStyle=i===1?'#bfe0ff':'#f4e6b8'; c.fillRect(sx+3,sy+3+i*6,sw-6,4); } }
 G.txt(kind||'',f[0]+w/2,f[3]-h+4,4.6,'#ffd24d','center',w-6,800); };
A.floor.binos=function(c,f,h){ const cx=(f[0]+f[2])/2, b=f[3]; c.fillStyle='#5d6672'; c.fillRect(cx-1.5,b-h+8,3,h-8); c.fillRect(cx-7,b-2,14,2.6);
 c.fillStyle='#2a2d33'; G.rrect(cx-8,b-h,7,10,2.5); c.fill(); G.rrect(cx+1,b-h,7,10,2.5); c.fill(); c.fillStyle='#7fb2e0'; c.beginPath(); c.arc(cx-4.5,b-h+9,2.2,0,7); c.arc(cx+4.5,b-h+9,2.2,0,7); c.fill(); };
/* the cadet's own airplane, tied down at the parking stand with chocks and a pitot cover streamer */
A.floor.parkedplane=function(c,f){
 const w=(f[2]-f[0])+70, h=w/2, x=f[0]-35, y=f[3]+3-h*104/120, ac=H.myAC?H.myAC():{id:'c172'};
 if(H.drawAC) H.drawAC(c,ac.id,x,y,w,h,ac.paint,{ground:true,reflect:true,t:T()});
 c.fillStyle='#ffc21a'; for(const cx of [f[0]+48,f[0]+120]){ c.beginPath(); c.moveTo(cx-6,f[3]+4); c.lineTo(cx-1,f[3]-2); c.lineTo(cx-1,f[3]+4); c.closePath(); c.fill(); }
 c.strokeStyle='rgba(240,240,240,.7)'; c.lineWidth=.9; c.beginPath(); c.moveTo(f[0]+70,f[1]-30); c.lineTo(f[0]+82,f[3]+8); c.stroke(); c.beginPath(); c.arc(f[0]+82,f[3]+8,1.6,0,7); c.stroke();
 const sx=f[0]+64, sy=f[1]-24, wv=Math.sin(T()*5)*1.5; c.fillStyle='#ff4a1a'; c.beginPath(); c.moveTo(sx,sy); c.lineTo(sx+3,sy+12); c.lineTo(sx+1+wv,sy+12); c.lineTo(sx-2,sy); c.fill();
};
A.floor.parkedplane.bounds=p=>H.acPropBounds(p,35);   // the whole painted aircraft answers a tap (mod_world footBox)
A.floor.parked=function(c,f,h,col,d){ const w=(f[2]-f[0])+40, hh=w/2, x=f[0]-20, y=f[3]+3-hh*104/120; if(H.drawAC) H.drawAC(c,(d&&d.id)||'pa28',x,y,w,hh,null,{ground:true,reflect:true,t:T()}); };
A.floor.fueltruck=function(c,f,h){ const w=f[2]-f[0], b=f[3];
 c.fillStyle='rgba(0,0,0,.25)'; c.beginPath(); c.ellipse(f[0]+w/2,b+1,w/2,3,0,0,7); c.fill();
 c.fillStyle='#e9edf2'; G.rrect(f[0],b-h,w*.7,h-8,8); c.fill(); c.strokeStyle='rgba(20,22,26,.4)'; c.lineWidth=.8; c.stroke();
 c.fillStyle='#2f6fb5'; c.fillRect(f[0]+4,b-h+12,w*.7-8,3);
 G.txt('100LL',f[0]+w*.35,b-h+5,6,'#1a1c20','center',undefined,800);
 c.fillStyle='#c23a3a'; G.rrect(f[0]+w*.68,b-h+6,w*.32,h-14,4); c.fill(); c.fillStyle='#7fb2e0'; c.fillRect(f[0]+w*.78,b-h+9,w*.18,9);
 c.fillStyle='#1a1c20'; for(const wx of [f[0]+14,f[0]+w*.5,f[0]+w-12]){ c.beginPath(); c.arc(wx,b-5,5,0,7); c.fill(); } c.fillStyle='#c9ced6'; for(const wx of [f[0]+14,f[0]+w*.5,f[0]+w-12]){ c.beginPath(); c.arc(wx,b-5,2,0,7); c.fill(); }
 c.strokeStyle='#1a1c20'; c.lineWidth=1.6; c.beginPath(); c.moveTo(f[0]+2,b-h+14); c.quadraticCurveTo(f[0]-14,b,f[0]-30,b-2); c.stroke();   // the hose
};
A.floor.washplane=function(c,f){
 const w=(f[2]-f[0])+70, h=w/2, x=f[0]-35, y=f[3]+3-h*104/120, ac=H.myAC?H.myAC():{id:'c172'}, t=T();
 if(H.drawAC) H.drawAC(c,ac.id,x,y,w,h,ac.paint,{ground:true,reflect:true,t:t});
 c.fillStyle='rgba(255,255,255,.75)'; for(const [bx,by] of [[f[0]+40,f[1]-6],[f[0]+96,f[1]-10],[f[0]+150,f[1]-14]]) for(const [dx,dy,r] of [[0,0,2.4],[3,-1.5,1.8],[-2.6,-1.2,1.6],[1,-3.4,1.3]]){ c.beginPath(); c.arc(bx+dx,by+dy,r,0,7); c.fill(); }
 c.fillStyle='rgba(120,190,255,.6)'; for(let i=0;i<6;i++){ const dx=f[0]+30+i*22, dy=f[3]-((t*40+i*13)%26); c.fillRect(dx,dy,1.2,3); }
};
A.floor.washplane.bounds=p=>H.acPropBounds(p,35);
A.wall.shelf=function(c,s,R){ const w=s.w, x=s.x-w/2, y=26, h=R.wall-52;
 c.fillStyle='#8d96a2'; c.fillRect(x,y,3,h); c.fillRect(x+w-3,y,3,h); for(let i=0;i<3;i++) c.fillRect(x,y+8+i*(h/3),w,2.4);
 const b=[['#3fdc7c',8],['#5b9bff',10],['#ffc21a',9],['#ff6a1a',6],['#e9edf2',11],['#c23a3a',8]];
 b.forEach(([col,hh],i)=>{ const r=Math.floor(i/3), bx=x+8+(i%3)*((w-16)/3), by=y+8+r*(h/3); c.fillStyle=col; c.fillRect(bx,by-hh,9,hh); c.fillRect(bx+3,by-hh-3,3,3); });
 c.fillStyle='#ff4a1a'; c.fillRect(x+10,y+8+2*(h/3)-6,22,6); G.txt('REMOVE',x+21,y+8+2*(h/3)-5,3.2,'#fff','center',undefined,800);
 c.fillStyle='#e8cf8a'; c.fillRect(x+w-30,y+8+2*(h/3)-5,18,5); };
A.floor.hosereel=function(c,f,h){ const cx=(f[0]+f[2])/2, b=f[3]; c.fillStyle='#5d6672'; c.fillRect(cx-2,b-h+10,4,h-10); c.beginPath(); c.arc(cx,b-h+10,11,0,7); c.fillStyle='#3a3f48'; c.fill();
 c.strokeStyle='#2f8a4a'; c.lineWidth=2.4; for(let r=4;r<11;r+=2.6){ c.beginPath(); c.arc(cx,b-h+10,r,0,7); c.stroke(); } c.beginPath(); c.moveTo(cx+10,b-h+14); c.quadraticCurveTo(cx+24,b,cx+40,b+4); c.stroke(); };
A.floor.bucket=function(c,f,h){ const w=f[2]-f[0]; c.fillStyle='#ff8a1a'; c.beginPath(); c.moveTo(f[0],f[1]-h); c.lineTo(f[2],f[1]-h); c.lineTo(f[2]-2,f[3]); c.lineTo(f[0]+2,f[3]); c.closePath(); c.fill(); c.fillStyle='rgba(255,255,255,.9)'; for(let i=0;i<4;i++){ c.beginPath(); c.arc(f[0]+3+i*(w-6)/3,f[1]-h-1,2.4,0,7); c.fill(); } };



/* ============================ ROOM LIGHTING (G.WORLD.roomFx) ============================
   'floor': light pools from floodlights and windows, rubber and oil on concrete, wet patches that catch the light.
   'over':  a soft vignette, warm haze at the top of outdoor places, dust in the hangar beams. Cheap: a few gradients. */
const RM=G.rm;
function pool(c,x,y,rx,ry,col,a){ c.save(); c.translate(x,y); c.scale(1,ry/rx); const g=c.createRadialGradient(0,0,0,0,0,rx); g.addColorStop(0,'rgba('+col+','+a+')'); g.addColorStop(.6,'rgba('+col+','+(a*.35)+')'); g.addColorStop(1,'rgba('+col+',0)'); c.fillStyle=g; c.beginPath(); c.arc(0,0,rx,0,7); c.fill(); c.restore(); }
G.WORLD.roomFx=function(c,R,phase,L){
 const t=RM()?0:G.time, key=R.key;
 if(phase==='floor'){
  if(R.floor==='concrete'||R.floor==='apron'||R.floor==='washpad'){
   c.fillStyle='rgba(0,0,0,.09)'; for(let i=0;i<18;i++){ const x=((i*97+13)%(R.w-40))+20, y=R.wall+30+((i*61)%(R.h-R.wall-50)); c.beginPath(); c.ellipse(x,y,10+(i%4)*5,2.2,(i%5)*.4,0,7); c.fill(); }   // rubber + oil
   c.fillStyle='rgba(255,255,255,.035)'; for(let i=0;i<6;i++){ const x=((i*151+31)%(R.w-60))+30, y=R.wall+40+((i*89)%(R.h-R.wall-60)); c.fillRect(x,y,26+(i%3)*10,18); }   // patch repairs
   if(R.floor!=='washpad'){ for(let i=0;i<4;i++){ const x=((i*173+40)%(R.w-80))+40, y=R.wall+60+((i*113)%(R.h-R.wall-90)); pool(c,x,y,38,10,'190,215,245',.16); } }   // wet patches
   for(const x of [R.w*.25,R.w*.75]) pool(c,x,R.wall+28,150,70,'255,214,140',.14);   // floodlights
  }
  if(R.floor==='wood'){ for(const [x,w] of R.windows||[]) pool(c,x+w/2,R.wall+40,120,60,'255,200,120',.16); pool(c,R.w*.72,R.h*.7,120,60,'255,180,90',.08); }
  if(R.floor==='tile'){ pool(c,R.w*.5,R.wall+40,220,70,'255,255,255',.1); }
  if(R.floor==='carpet'){ for(const x of [120,262,404]) pool(c,x,R.wall+40,70,30,'120,180,255',.12); }
  if(R.floor==='grass'){ pool(c,R.w*.5,R.wall+20,R.w*.6,50,'255,210,140',.14); }
  if(R.floor==='deck'){ pool(c,R.w*.5,R.wall+30,R.w*.5,50,'255,225,170',.16); }
 } else {
  // vignette
  const PW=G.V.W||R.w, PH=G.V.H||R.h; const v=c.createRadialGradient(PW/2,PH*.55,PW*.25,PW/2,PH*.55,PW*.75); v.addColorStop(0,'rgba(0,0,0,0)'); v.addColorStop(1,'rgba(0,0,0,.34)'); c.fillStyle=v; c.fillRect(-40,-20,PW+80,PH+60);
  if(R.wallStyle==='hangar'&&!RM()){ c.save(); c.globalCompositeOperation='lighter'; for(let i=0;i<14;i++){ const x=40+((i*83+t*6)%(R.w-80)), y=R.wall+20+((i*47+t*4)%160); c.fillStyle='rgba(255,230,180,'+(.18+Math.sin(t*2+i)*.1)+')'; c.fillRect(x,y,1.2,1.2); } c.restore(); }   // dust in the light
  if(R.wallStyle==='open'||R.wallStyle==='sky'){ const hz=c.createLinearGradient(0,R.wall-30,0,R.wall+40); hz.addColorStop(0,'rgba(255,200,130,.18)'); hz.addColorStop(1,'rgba(255,200,130,0)'); c.fillStyle=hz; c.fillRect(-100,R.wall-30,R.w+300,70); }
 }
};

/* ============================ ATMOSPHERE: skies, clouds, sun, haze ============================
   H.sky(c,x,y,w,h,o)      a sky in a box. o.mode 'day'|'golden'|'dusk'|'overcast'; o.sun [fx,fy] (fractions, default upper right);
                           o.flare (lens flare toward the box center); o.haze (a bright band at the bottom); o.t for drift
   H.cloud(c,x,y,w,a,i)    one soft cloud (pre-rendered sprite i = 0..2), w wide, alpha a
   H.clouds(c,x,y,w,h,o)   a drifting layer of them inside a box: o.t, o.n, o.alpha, o.seed
   H.speedLines(c,x,y,w,h,o) motion streaks for a rolling / flying view: o.t, o.k (0..1 speed), o.col */
const CL3=[]; function cloudSprite(i){
 if(CL3[i]) return CL3[i]; const cv=document.createElement('canvas'); cv.width=240; cv.height=120; const c=cv.getContext('2d');
 const puffs=[[[70,74,34],[110,62,42],[150,70,36],[182,80,26],[42,84,22]],[[60,78,28],[96,60,44],[140,66,38],[176,78,30],[200,86,18]],[[80,76,30],[120,64,40],[160,74,34],[48,86,20]]][i];
 c.save(); c.shadowColor='rgba(255,255,255,.95)'; c.shadowBlur=18;
 for(const [px,py,r] of puffs){ const g=c.createLinearGradient(0,py-r,0,py+r*.9); g.addColorStop(0,'#ffffff'); g.addColorStop(.62,'#f3f6fa'); g.addColorStop(1,'#c3ced9'); c.fillStyle=g; c.beginPath(); c.arc(px,py,r,0,7); c.fill(); }
 c.restore();
 c.globalCompositeOperation='source-atop'; const g=c.createLinearGradient(0,30,0,116); g.addColorStop(0,'rgba(255,255,255,0)'); g.addColorStop(.7,'rgba(150,165,185,.0)'); g.addColorStop(1,'rgba(120,135,160,.45)'); c.fillStyle=g; c.fillRect(0,0,240,120);
 return CL3[i]=cv; }
H.cloud=function(c,x,y,w,a,i){ const sp=cloudSprite((i||0)%3), h=w/2; c.save(); c.globalAlpha=a==null?.9:a; c.drawImage(sp,x-w/2,y-h/2,w,h); c.restore(); };
H.clouds=function(c,x,y,w,h,o){ o=o||{}; const t=G.rm()?0:(o.t||0), n=o.n||5, sd=o.seed||0, sp=o.speed==null?6:o.speed;
 for(let i=0;i<n;i++){ const cw=w*(.22+((i*37+sd)%5)*.06), span=w+cw*2, cx=x-cw+(((i*131+sd*53)+t*sp*(1+(i%3)*.4))%span), cy=y+h*(.12+((i*53+sd*7)%7)/7*.6), al=(o.alpha==null?.85:o.alpha)*(.7+((i*7)%4)*.1); H.cloud(c,cx,cy,cw,al,i+sd); } };
H.sky=function(c,x,y,w,h,o){ o=o||{}; const mode=o.mode||'day', g=c.createLinearGradient(0,y,0,y+h);
 const M={day:[['#1f4f93',0],['#4a86cc',.45],['#9cc6ea',.85],['#dcecf7',1]],golden:[['#1b2a50',0],['#4f5f95',.4],['#d08a52',.8],['#f6c98a',1]],dusk:[['#0d1428',0],['#2b3660',.5],['#7a5577',.85],['#d98a5a',1]],overcast:[['#5a6672',0],['#8b96a0',.6],['#aeb7bf',1]]}[mode];
 for(const [col,k] of M) g.addColorStop(k,col); c.fillStyle=g; c.fillRect(x,y,w,h);
 const sun=o.sun||[.82,.2], sx=x+w*sun[0], sy=y+h*sun[1];
 if(mode!=='overcast'){ const R=Math.max(w,h)*.5, sg=c.createRadialGradient(sx,sy,0,sx,sy,R); const warm=mode==='day'?'255,245,215':'255,200,120';
  sg.addColorStop(0,'rgba('+warm+',.95)'); sg.addColorStop(.05,'rgba('+warm+',.55)'); sg.addColorStop(.3,'rgba('+warm+',.14)'); sg.addColorStop(1,'rgba('+warm+',0)'); c.fillStyle=sg; c.fillRect(x,y,w,h);
  if(o.flare!==false){ const cx=x+w/2, cy=y+h/2; c.save(); c.globalCompositeOperation='lighter'; [[.25,5,.12],[.45,3,.1],[.7,9,.07],[1.1,4,.09]].forEach(([k,r,a])=>{ const fx=sx+(cx-sx)*k, fy=sy+(cy-sy)*k; const fg=c.createRadialGradient(fx,fy,0,fx,fy,r*w/100); fg.addColorStop(0,'rgba(255,230,180,'+a+')'); fg.addColorStop(.7,'rgba(255,200,140,'+a*.5+')'); fg.addColorStop(1,'rgba(255,200,140,0)'); c.fillStyle=fg; c.beginPath(); c.arc(fx,fy,r*w/100,0,7); c.fill(); });
   const st=c.createLinearGradient(sx-w*.35,sy,sx+w*.35,sy); st.addColorStop(0,'rgba(255,240,210,0)'); st.addColorStop(.5,'rgba(255,240,210,.22)'); st.addColorStop(1,'rgba(255,240,210,0)'); c.fillStyle=st; c.fillRect(sx-w*.35,sy-1,w*.7,2); c.restore(); } }
 if(o.haze!==false){ const hz=c.createLinearGradient(0,y+h*.55,0,y+h); hz.addColorStop(0,'rgba(255,255,255,0)'); hz.addColorStop(1,mode==='golden'?'rgba(255,220,170,.4)':'rgba(255,255,255,.32)'); c.fillStyle=hz; c.fillRect(x,y+h*.55,w,h*.45); }
};
H.speedLines=function(c,x,y,w,h,o){ o=o||{}; const t=G.rm()?0:(o.t||0), k=o.k==null?1:o.k; if(k<=0||G.rm()) return; c.save(); c.beginPath(); c.rect(x,y,w,h); c.clip(); c.strokeStyle=o.col||'rgba(255,255,255,.35)';
 for(let i=0;i<10;i++){ const ly=y+((i*47)%h), len=18+((i*29)%40)*k, lx=x+w-(((i*83)+t*(300+i*40)*k)%(w+len)); c.lineWidth=.8+(i%3)*.4; c.globalAlpha=.25+k*.5; c.beginPath(); c.moveTo(lx,ly); c.lineTo(lx+len,ly); c.stroke(); } c.restore(); };
/* a runway seen from the side in a box: surface, centerline dashes scrolling with speed k, edge lights, tire smoke puffs */
H.sideRunway=function(c,x,gy,w,o){ o=o||{}; const t=o.t||0, k=o.k||0;
 const g=c.createLinearGradient(0,gy,0,gy+30); g.addColorStop(0,'#5d8a47'); g.addColorStop(1,'#3f6a34'); c.fillStyle=g; c.fillRect(x,gy,w,30);
 const rg=c.createLinearGradient(0,gy+6,0,gy+22); rg.addColorStop(0,'#4a4d53'); rg.addColorStop(.5,'#36393f'); rg.addColorStop(1,'#2c2f35'); c.fillStyle=rg; c.fillRect(x,gy+6,w,16);
 c.fillStyle='rgba(0,0,0,.18)'; for(let i=0;i<14;i++) c.fillRect(x+((i*61)%w),gy+8+(i%3)*4,10+(i%4)*6,1.2);   // rubber + patches
 const off=G.rm()?0:(t*t*90*k)%40; c.fillStyle='#f2f2f2'; for(let xx=x-40+(40-off);xx<x+w;xx+=40) c.fillRect(xx,gy+13.4,20,2);
 if(k>.4&&!G.rm()){ c.fillStyle='rgba(255,255,255,.35)'; for(let xx=x-40+(40-off);xx<x+w;xx+=40) c.fillRect(xx-10*k,gy+13.4,10*k,2); }
 for(let xx=x+((G.rm()?0:-t*t*70*k)%28+28)%28;xx<x+w;xx+=28){ for(const yy of [gy+5,gy+23]){ const lg=c.createRadialGradient(xx,yy,0,xx,yy,4); lg.addColorStop(0,'rgba(255,251,230,1)'); lg.addColorStop(.35,'rgba(255,251,230,.6)'); lg.addColorStop(1,'rgba(255,251,230,0)'); c.fillStyle=lg; c.beginPath(); c.arc(xx,yy,4,0,7); c.fill(); } }
};

/* ============================ THE AIRFIELD MAP ============================ */
/* An oblique "walkaround" view of Academy Field at golden hour, drawn in a 240 x 300 box: sky and hills at the top,
   the field in perspective below (north is away from you), callout labels with leader lines, a legend, live traffic.
   Layout units: x across 0-240, z depth 0 (far, north) to 200 (near, south). Runway 9-27 is nearest. */
const PLACES=[
 {room:'tower',x:43,z:60,lx:58,ly:100,blurb:'The control tower cab. Radio and weather games: METAR Decoder, Weather Call, Light Gun Signals, Taxi Maze, Departures and Arrivals.'},
 {room:'platform',x:115,z:40,lx:116,ly:72,blurb:'Up on the roof: Plane Spotter, Cloud Spotter, Paper Plane Toss, the windsock and today’s weather.'},
 {room:'lounge',x:92,z:72,lx:58,ly:166,blurb:'The hangout: the Crew Board, Hangar News, your locker, the jukebox, the other cadets, and the door to the Game Room.'},
 {room:'gameroom',x:66,z:84,lx:22,ly:196,blurb:'Just for fun: Pool, Air Hockey, Skee-Ball, Cone Bowling, Hangar Hoops, Compass Darts, Mini Golf, Prop Pong, Bag Toss and the arcade.'},
 {room:'classroom',x:138,z:72,lx:150,ly:100,blurb:'Ground School: '+G.HFQ.units.length+' units, checkrides and patches, THE LIBRARY, plus Gauge Reader, Phonetic Pairs and Word Hunt.'},
 {room:'hangar',x:184,z:60,lx:204,ly:112,blurb:'Your aircraft, the gallery, the parts board, the crew chief and his workbench.'},
 {room:'wash',x:224,z:76,lx:206,ly:168,blurb:'Wash your aircraft. Cover the pitot tube first!'},
 {room:'ramp',x:120,z:118,lx:170,ly:208,blurb:'Where airplanes park and fuel up. Preflight Race and Marshaller Signals.'},
 {room:'runway',x:120,z:176,lx:60,ly:238,blurb:'Landing Challenge, Taxi Maze, and the departure and arrival radio calls.'}
];
H.mapPlaces=PLACES;
const HZ=92;   // the horizon
function P(x,z){ const v=Math.max(0,Math.min(1,z/200)), k=.42+.58*v; return [120+(x-120)*k,HZ+(v*v*.6+v*.4)*200]; }
H.mapProject=P;
function quad(c,x0,z0,x1,z1,col,stroke){ const a=P(x0,z0),b=P(x1,z0),d=P(x1,z1),e=P(x0,z1); c.beginPath(); c.moveTo(a[0],a[1]); c.lineTo(b[0],b[1]); c.lineTo(d[0],d[1]); c.lineTo(e[0],e[1]); c.closePath(); if(col){ c.fillStyle=col; c.fill(); } if(stroke){ c.strokeStyle=stroke; c.lineWidth=.6; c.stroke(); } }
function seg(c,x0,z0,x1,z1,col,w){ const a=P(x0,z0),b=P(x1,z1); c.strokeStyle=col; c.lineWidth=w; c.beginPath(); c.moveTo(a[0],a[1]); c.lineTo(b[0],b[1]); c.stroke(); }
/* a box building: footprint (x0..x1, z0..z1), height h in layout units, wall + roof colors */
function box(c,x0,z0,x1,z1,h,wall,roof,o){ o=o||{};
 const k=.42+.58*((z0+z1)/400), hh=h*k*1.1, pts=[P(x0,z1),P(x1,z1),P(x1,z0),P(x0,z0)];
 // front wall (near, south face) + the east side, then the roof
 c.fillStyle=G.shade(wall,.85); c.beginPath(); c.moveTo(pts[1][0],pts[1][1]); c.lineTo(pts[2][0],pts[2][1]); c.lineTo(pts[2][0],pts[2][1]-hh); c.lineTo(pts[1][0],pts[1][1]-hh); c.closePath(); c.fill();
 c.fillStyle=wall; c.beginPath(); c.moveTo(pts[0][0],pts[0][1]); c.lineTo(pts[1][0],pts[1][1]); c.lineTo(pts[1][0],pts[1][1]-hh); c.lineTo(pts[0][0],pts[0][1]-hh); c.closePath(); c.fill();
 if(o.windows){ c.fillStyle='rgba(255,214,120,.85)'; const n=Math.max(2,Math.floor((pts[1][0]-pts[0][0])/7)); for(let i=0;i<n;i++){ const x=pts[0][0]+3+i*((pts[1][0]-pts[0][0]-6)/n); c.fillRect(x,pts[0][1]-hh*.72,3.2,hh*.3); } }
 if(o.doors){ c.fillStyle='#2a2f38'; c.fillRect(pts[0][0]+4,pts[0][1]-hh*.78,(pts[1][0]-pts[0][0])*.6,hh*.78); c.fillStyle='rgba(255,214,120,.5)'; c.fillRect(pts[0][0]+5,pts[0][1]-hh*.72,(pts[1][0]-pts[0][0])*.6-2,hh*.7); }
 c.fillStyle=roof; c.beginPath(); c.moveTo(pts[0][0],pts[0][1]-hh); c.lineTo(pts[1][0],pts[1][1]-hh); c.lineTo(pts[2][0],pts[2][1]-hh); c.lineTo(pts[3][0],pts[3][1]-hh); c.closePath(); c.fill();
 c.strokeStyle='rgba(20,22,26,.45)'; c.lineWidth=.5; c.stroke();
 return {top:pts[0][1]-hh,hh,pts};
}
function planeIcon(c,x,y,s,ang,col){ c.save(); c.translate(x,y); c.rotate(ang); G.icon('plane',c,0,0,s,col); c.restore(); }
function mapDraw(c,sel,here,t){
 // ---- sky: deep navy down to a golden horizon, the sun low on the right, hills and a far city
 const sky=c.createLinearGradient(0,0,0,HZ); sky.addColorStop(0,'#17284a'); sky.addColorStop(.55,'#5c6d9a'); sky.addColorStop(.85,'#d99a5a'); sky.addColorStop(1,'#f3c983'); c.fillStyle=sky; c.fillRect(0,0,240,HZ+2);
 const sun=c.createRadialGradient(196,HZ-8,2,196,HZ-8,60); sun.addColorStop(0,'rgba(255,236,190,.95)'); sun.addColorStop(.12,'rgba(255,200,110,.6)'); sun.addColorStop(1,'rgba(255,160,70,0)'); c.fillStyle=sun; c.fillRect(120,0,120,HZ+2);
 c.fillStyle='rgba(255,255,255,.22)'; for(let i=0;i<6;i++){ const cx=((i*61+t*2.5)%280)-20, cy=22+(i*13)%44, w=18+(i*7)%14; c.beginPath(); c.ellipse(cx,cy,w,3.2,0,0,7); c.ellipse(cx+w*.5,cy-2,w*.5,3,0,0,7); c.fill(); }
 c.fillStyle='#3b3f63'; c.beginPath(); c.moveTo(0,HZ); for(let x=0;x<=240;x+=8){ c.lineTo(x,HZ-6-Math.abs(Math.sin(x*.06))*9-Math.sin(x*.021)*4); } c.lineTo(240,HZ); c.closePath(); c.fill();
 c.fillStyle='rgba(255,210,120,.7)'; for(let x=6;x<240;x+=5) if((x*7)%3) c.fillRect(x,HZ-2-((x*13)%4),1,1);
 // ---- the field in perspective
 const g=c.createLinearGradient(0,HZ,0,300); g.addColorStop(0,'#5a7a44'); g.addColorStop(1,'#3f6a34'); c.fillStyle=g; c.fillRect(0,HZ,240,300-HZ);
 c.fillStyle='rgba(255,190,90,.12)'; c.beginPath(); c.moveTo(0,HZ); c.lineTo(240,HZ); c.lineTo(240,HZ+40); c.lineTo(0,HZ+40); c.fill();
 c.fillStyle='#3f6a3a'; for(let i=0;i<16;i++){ const [x,y]=P(8+i*15,8+(i*5)%14); c.beginPath(); c.arc(x,y,2.2,0,7); c.fill(); }
 // the apron (parking stand) + its taxilane, the taxiway, the runway
 quad(c,60,94,180,140,'#7c8087'); quad(c,156,88,210,98,'#7c8087');
 seg(c,64,132,176,132,'#ffc21a',.8); seg(c,120,132,120,142,'#ffc21a',.8);
 quad(c,14,140,226,150,'#55585e'); seg(c,14,145,226,145,'#ffc21a',.7);
 for(const x of [24,88,152,216]){ quad(c,x-5,148,x+5,172,'#55585e'); seg(c,x,148,x,170,'#ffc21a',.6); seg(c,x-5,164,x+5,164,'#ffc21a',.9); }
 quad(c,8,172,232,186,'#3d4046'); seg(c,30,179,210,179,'rgba(242,242,242,.0)',0);
 c.fillStyle='#f2f2f2'; for(let x=40;x<200;x+=14){ const a=P(x,179),b=P(x+7,179); c.fillRect(a[0],a[1]-.5,b[0]-a[0],1); }
 for(let z=174;z<185;z+=2.2){ const a=P(10,z),b=P(20,z); c.fillRect(a[0],a[1]-.4,b[0]-a[0],.9); const d=P(220,z),e=P(230,z); c.fillRect(d[0],d[1]-.4,e[0]-d[0],.9); }
 const n9=P(28,179), n27=P(212,179); G.txt('9',n9[0],n9[1]-4,6,'#f2f2f2','center',undefined,800); G.txt('27',n27[0],n27[1]-4,6,'#f2f2f2','center',undefined,800);
 // runway edge lights (white), taxiway edge lights (blue), apron floods (amber)
 for(let x=14;x<232;x+=11){ for(const z of [172,186]){ const [px,py]=P(x,z); c.fillStyle='#fffbe6'; c.fillRect(px-.5,py-.5,1,1); } for(const z of [139,151]){ const [px,py]=P(x,z); c.fillStyle='#3d7bff'; c.fillRect(px-.5,py-.5,1,1); } }
 for(const [x,z] of [[64,94],[180,94],[64,140],[180,140]]){ const [px,py]=P(x,z); const fl=c.createRadialGradient(px,py-8,0,px,py-8,14); fl.addColorStop(0,'rgba(255,200,110,.55)'); fl.addColorStop(1,'rgba(255,200,110,0)'); c.fillStyle=fl; c.fillRect(px-14,py-22,28,28); c.fillStyle='#8d96a2'; c.fillRect(px-.5,py-9,1,9); }
 // parked airplanes on the stand
 for(const [x,z] of [[82,112],[104,112],[140,112],[160,112]]){ const [px,py]=P(x,z); planeIcon(c,px,py,8,0,'#f4f6fa'); }
 // ---- buildings (far to near): the hangar, the wash rack, the FBO with the platform on its roof, the tower
 const Hg=box(c,160,40,206,80,22,'#8d9aaa','#a9b4c2',{doors:true}); c.fillStyle='rgba(255,255,255,.25)'; for(let x=Hg.pts[3][0]+2;x<Hg.pts[2][0];x+=3) c.fillRect(x,Hg.top,1,Hg.pts[0][1]-Hg.top-1);
 box(c,212,62,234,84,12,'#8a929c','#9aa3ad'); { const [px,py]=P(223,73); c.fillStyle='#5b9bff'; c.beginPath(); c.ellipse(px,py-9,5,2.4,0,0,7); c.fill(); }
 const F=box(c,78,46,152,84,16,'#d9cfb8','#c4b99e',{windows:true}); box(c,100,46,130,62,22,'#c9c2b2','#b9ad95'); box(c,52,74,80,92,11,'#b8a88e','#a89878');
 { const [px,py]=P(115,54), rail=F.top-7; c.strokeStyle='#e9edf2'; c.lineWidth=.6; const a=P(102,48),b=P(128,48); c.beginPath(); c.moveTo(a[0],rail); c.lineTo(b[0],rail); c.stroke(); for(let x=a[0];x<=b[0];x+=4) c.fillRect(x,rail,.6,3); }
 { const [bx,by]=P(43,60), k=.6, hT=46*k; c.fillStyle='#c9c2b2'; c.fillRect(bx-7,by-10,14,10); c.fillStyle='#cfd4dc'; c.fillRect(bx-3,by-hT,6,hT-8); c.fillStyle='#2a3a4a'; c.beginPath(); for(let i=0;i<8;i++){ const a=i*PI/4+PI/8; c.lineTo(bx+Math.cos(a)*8,by-hT-2+Math.sin(a)*4); } c.closePath(); c.fill();
   c.fillStyle='#8fd0ff'; c.fillRect(bx-7,by-hT-4,14,3.6); c.fillStyle='#cfd4dc'; c.fillRect(bx-9,by-hT-7,18,2.2); c.fillStyle='#3a3f48'; c.fillRect(bx-.6,by-hT-16,1.2,9);
   const on=Math.floor(t*1.6)%2===0; c.fillStyle=on?'#ff3b30':'rgba(255,59,48,.25)'; c.beginPath(); c.arc(bx,by-hT-16,1.6,0,7); c.fill(); if(on){ c.fillStyle='rgba(255,59,48,.25)'; c.beginPath(); c.arc(bx,by-hT-16,4,0,7); c.fill(); } }
 // windsock + segmented circle south of the runway
 { const [px,py]=P(120,194); c.strokeStyle='#f2f2f2'; c.lineWidth=.8; c.setLineDash([2,2]); c.beginPath(); c.ellipse(px,py,10,3.6,0,0,7); c.stroke(); c.setLineDash([]); c.fillStyle='#ff6a1a'; c.save(); c.translate(px,py-8); const wd=H.wx?H.wx.today().wdir:270; c.rotate((wd+180-90)*PI/180); c.fillRect(0,-1.4,7,2.8); c.restore(); c.fillStyle='#d8dde4'; c.fillRect(px-.5,py-8,1,8); }
 // ---- traffic: one on final from the east, one taxiing on Alpha, one departing climbing out west
 { const k=(t%9)/9, x=250-k*290, z=179, [px,py]=P(Math.max(-30,Math.min(240,x)),z); const alt=Math.max(0,(k<.5?(.5-k)*2:0))*40; if(k<.95) planeIcon(c,px,py-alt,9,-PI/2,'#ffe9a8'); }
 { const k=(t%13)/13, [px,py]=P(26+k*190,145); planeIcon(c,px,py,7,PI/2,'#ffffff'); }
 { const k=(t%11)/11; if(k>.3){ const q=(k-.3)/.7, [px,py]=P(120-q*170,179); c.globalAlpha=Math.max(0,1-q*.9); planeIcon(c,px,py-q*q*70,9+q*4,-PI/2,'#f4f6fa'); c.globalAlpha=1; } }
 // ---- callouts: a pin on the ground, a leader line, a labeled pill (like a walkaround map)
 for(const p of PLACES){ const on=sel===p.room, me=here===p.room, R=(G.WORLD.rooms[p.room]||{}), [px,py]=P(p.x,p.z);
  const lab=R.mapLabel||(R.tab&&R.tab.label)||p.room.toUpperCase(), tw=G.tw(lab,4.6,800)+22, lx=Math.max(2,Math.min(238-tw,p.lx-tw/2)), ly=p.ly;
  c.strokeStyle=on?C.accentHi:'rgba(255,255,255,.85)'; c.lineWidth=on?1.2:.8; c.beginPath(); c.moveTo(lx+tw/2,ly+13); c.lineTo(px,py); c.stroke();
  if(me&&!G.rm()){ c.beginPath(); c.arc(px,py,5+(t*8)%6,0,7); c.strokeStyle=G.rgba(C.good,Math.max(0,.9-((t*8)%6)/6)); c.lineWidth=1.2; c.stroke(); }
  c.beginPath(); c.arc(px,py,2.6,0,7); c.fillStyle=on?C.accentHi:'#fff'; c.fill(); c.strokeStyle='rgba(0,0,0,.6)'; c.lineWidth=.8; c.stroke();
  G.rrect(lx,ly,tw,13,4); c.fillStyle=on?C.accentHi:'rgba(10,14,24,.88)'; c.fill(); c.strokeStyle=on?C.accentHi:(me?C.good:'rgba(255,255,255,.55)'); c.lineWidth=on||me?1.2:.7; c.stroke();
  G.icon((R.tab&&R.tab.icon)||'pin',c,lx+8,ly+6.5,8,on?C.onAccent:C.accentHi); G.txt(lab,lx+15,ly+4,4.6,on?C.onAccent:'#fff','left',undefined,800);
 }
 // ---- legend (bottom right) + compass (top left)
 G.rrect(180,264,56,32,4); c.fillStyle='rgba(10,14,24,.8)'; c.fill(); G.txt('MAP LEGEND',184,267,3.6,C.accentHi,'left',undefined,800);
 [['RUNWAY','#f2f2f2'],['TAXIWAY','#ffc21a'],['APRON / STAND','#8d939a'],['BUILDINGS','#d9cfb8']].forEach(([n,col],i)=>{ c.fillStyle=col; c.beginPath(); c.arc(187,275+i*5.4,1.6,0,7); c.fill(); G.txt(n,191,273+i*5.4,3.4,'#fff','left',undefined,800); });
 G.rrect(4,HZ+6,30,20,4); c.fillStyle='rgba(10,14,24,.78)'; c.fill(); c.strokeStyle='#fff'; c.lineWidth=.6; c.beginPath(); c.moveTo(19,HZ+9); c.lineTo(22,HZ+22); c.lineTo(19,HZ+19); c.lineTo(16,HZ+22); c.closePath(); c.stroke(); c.fillStyle='#fff'; c.beginPath(); c.moveTo(19,HZ+9); c.lineTo(22,HZ+22); c.lineTo(19,HZ+19); c.closePath(); c.fill(); G.txt('N',26,HZ+12,4.2,'#fff','left',undefined,800);
}
H.mapDraw=mapDraw;
G.scenes.map={   // the airfield map as a pop-up over the place you are in (the round MAP button), Among Us style
 enter(a){ a=a||{}; this.back=a.back||'world'; this.here=a.from||(G.world&&G.world.room())||null; this.sel=this.here; this.t=0; this.open=0; },
 box(){ const VH=G.VH, px=8, py=48, pw=VW-16, ph=VH-56, top=py+30, cardH=74, btnH=46, h=ph-30-cardH-btnH-8, s=Math.min((pw-14)/240,h/300);
  return {s,x:(VW-240*s)/2,y:top,w:240*s,h:300*s,cardY:top+300*s+6,px,py,pw,ph,close:{x:px+pw-34,y:py+4,w:28,h:24}}; },
 btns(){ const B=this.box(), y=B.py+B.ph-44, w=(B.pw-36)/3; return [{id:'go',label:this.sel===this.here?'YOU ARE HERE':'GO THERE',kind:this.sel===this.here?'ghost':'primary',x:B.px+10,y,w,h:36,size:6.6},{id:'radio',label:'CALL TOWER',kind:'secondary',x:B.px+18+w,y,w,h:36,size:6.6},{id:'explorer',label:'EXPLORER',kind:'secondary',x:B.px+26+2*w,y,w,h:36,size:6.6}]; },
 close(){ AUDIO.sfx('back'); G.go('world',{},true); },
 update(dt){ this.t+=dt; this.open=Math.min(1,this.open+dt*6);
  if(G.backHit()){ this.close(); return; }
  const B=this.box(); if(G.clicked(B.close.x,B.close.y,B.close.w,B.close.h)){ this.close(); return; }
  for(const b of this.btns()) if(G.clicked(b.x,b.y,b.w,b.h)){ AUDIO.sfx('ok');
   if(b.id==='radio'){ G.go('radio',{back:'map',from:this.sel||this.here}); return; }
   if(b.id==='explorer'){ G.go('explorer',{back:'map'}); return; }
   if(b.id==='go'&&this.sel){ if(this.sel===this.here){ this.close(); return; } AUDIO.sfx('swish'); G.go('world',{room:this.sel}); return; } }
  if(G.ptr.click&&G.ptr.y>B.y&&G.ptr.y<B.y+B.h){ const mx=(G.ptr.x-B.x)/B.s, my=(G.ptr.y-B.y)/B.s; let best=null, bd=16;
   for(const p of PLACES){ const [px,py]=P(p.x,p.z), d=Math.min(Math.hypot(mx-px,my-py),Math.hypot(mx-p.lx,my-(p.ly+6))*.8); if(d<bd){ bd=d; best=p; } }
   if(best){ if(best.room===this.sel&&best.room!==this.here){ AUDIO.sfx('swish'); G.go('world',{room:best.room}); return; } this.sel=best.room; AUDIO.sfx('blip'); } }
  else if(G.ptr.click&&(G.ptr.y<B.py||G.ptr.y>B.py+B.ph)){ this.close(); }   // a tap outside the panel closes it
 },
 draw(c){ const VH=G.VH, B=this.box(), k=G.rm()?1:this.open;
  // the place you are in, frozen and dimmed underneath
  const W=G.scenes.world; if(W&&W.P) W.draw(c); else G.backdrop(.95);
  G.dim(.62*k);
  c.save(); c.translate(VW/2,VH/2); c.scale(.92+.08*k,.92+.08*k); c.translate(-VW/2,-VH/2); c.globalAlpha=k;
  G.panel(B.px,B.py,B.pw,B.ph,{r:16,border:G.rgba(C.accent,.7)});
  G.icon('map',c,B.px+16,B.py+15,11,C.accentHi); G.txt('AIRFIELD MAP',B.px+28,B.py+8,8.4,C.title,'left',B.pw-80,800); G.txt('TAP A PLACE • TAP AGAIN TO GO',B.px+28,B.py+20,4.6,C.dim,'left',B.pw-80,800);
  G.rrect(B.close.x,B.close.y,B.close.w,B.close.h,8); c.fillStyle='rgba(255,255,255,.08)'; c.fill(); c.strokeStyle='rgba(255,255,255,.2)'; c.lineWidth=1; c.stroke(); G.txt('✕',B.close.x+B.close.w/2,B.close.y+6,8.4,C.ink,'center',undefined,800);
  c.save(); G.rrect(B.x,B.y,B.w,B.h,12); c.clip(); c.translate(B.x,B.y); c.scale(B.s,B.s); mapDraw(c,this.sel,this.here,G.rm()?0:this.t); c.restore();
  c.strokeStyle=G.rgba(C.accent,.5); c.lineWidth=1.2; G.rrect(B.x,B.y,B.w,B.h,12); c.stroke();
  // the info card
  const p=PLACES.find(q=>q.room===this.sel), R=p&&G.WORLD.rooms[p.room], y=B.cardY, ch=B.py+B.ph-50-y;
  if(p&&ch>26){ G.rrect(B.px+8,y,B.pw-16,ch,10); c.fillStyle='rgba(255,255,255,.05)'; c.fill();
   G.txt(R.name,B.px+16,y+7,7.8,C.title,'left',B.pw-100,800);
   if(this.sel===this.here) G.txt('YOU ARE HERE',B.px+B.pw-16,y+9,5.2,C.good,'right',undefined,800);
   G.para(p.blurb,B.px+16,y+20,5.8,C.ink,'left',B.pw-32,8.2,600); }
  else if(ch>26){ G.para('Tap a place on the airfield to see what’s there. Tap it again to go.',VW/2,y+12,6.4,C.sub,'center',B.pw-30,9,700); }
  G.drawBtns(this.btns());
  c.restore();
 }
};
})();
