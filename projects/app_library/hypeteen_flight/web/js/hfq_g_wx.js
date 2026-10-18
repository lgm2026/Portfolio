/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* WEATHER CALL (the Tower window): look at the sky and the METAR, then call the flight category.
   Categories + colors as on aviationweather.gov: VFR green, MVFR blue, IFR red, LIFR magenta.
     VFR   ceiling above 3,000 ft AND visibility above 5 miles
     MVFR  ceiling 1,000-3,000 ft and/or visibility 3-5 miles
     IFR   ceiling 500 to under 1,000 ft and/or visibility 1 to under 3 miles
     LIFR  ceiling under 500 ft and/or visibility under 1 mile
   The worse of the two decides. No ceiling (only FEW/SCT, or CLR) counts as a high ceiling. */
(function(){
const H=G.HFQ, C=G.C, VW=G.VW, PI=Math.PI, MG=G.MG;
const CATS=[{k:'VFR',col:'#2fb760',d:'VISUAL: GOOD WEATHER'},{k:'MVFR',col:'#3d7bff',d:'MARGINAL VISUAL'},{k:'IFR',col:'#e0332a',d:'INSTRUMENT'},{k:'LIFR',col:'#c63fd6',d:'LOW INSTRUMENT'}];
H.wxCats=CATS;
function sky(c,x,y,w,h,wx,t){
 const cat=wx.cat, g=c.createLinearGradient(0,y,0,y+h);
 const top={VFR:'#3f86d6',MVFR:'#7d98b6',IFR:'#8d98a4',LIFR:'#a9b0b8'}[cat];
 g.addColorStop(0,top); g.addColorStop(1,'#d8e6f2'); c.fillStyle=g; c.fillRect(x,y,w,h);
 const gy=y+h*.84; c.fillStyle='#4f7a3e'; c.fillRect(x,gy,w,h-h*.84); c.fillStyle='#3a3d42'; c.fillRect(x,gy+h*.06,w,h*.04);
 c.fillStyle='#d8dde4'; c.fillRect(x+w*.12,gy-28,5,28); c.fillStyle='#2a3a4a'; c.fillRect(x+w*.12-6,gy-36,17,9);   // a tower for scale
 // cloud layers: height on a 0-6,000 ft scale above the ground line
 const hy=ft=>gy-Math.min(1,ft/6000)*(gy-y-8);
 for(const l of wx.clouds){ const yy=hy(l.h), n={FEW:2,SCT:4,BKN:7,OVC:12}[l.c], dark=l.c==='OVC'||l.c==='BKN'?'rgba(150,158,168,.95)':'rgba(255,255,255,.92)';
  if(l.c==='OVC'){ c.fillStyle=dark; c.fillRect(x,yy-8,w,12); }
  for(let i=0;i<n;i++){ const cx=x+((i*97+l.h*.37+t*3)%(w+40))-20; H.cloud(c,cx,yy-2,40,l.c==='OVC'||l.c==='BKN'?.75:.95,i); if(l.c==='OVC'||l.c==='BKN'){ c.fillStyle='rgba(120,130,145,.35)'; c.beginPath(); c.ellipse(cx,yy+2,18,5,0,0,7); c.fill(); } }
  G.txt(l.c+' '+l.h.toLocaleString('en-US')+' FT',x+w-6,yy-14,5,'#fff','right',undefined,800); }
 // visibility: haze/fog veil, rain streaks
 const v=wx.vis, fog=v>=7?0:(v>=5?.18:(v>=3?.32:(v>=1?.55:.78)));
 if(fog){ c.fillStyle='rgba(222,228,234,'+fog+')'; c.fillRect(x,y,w,h); }
 if(wx.wx&&wx.wx.indexOf('RA')>=0&&!G.rm()){ c.strokeStyle='rgba(90,120,170,.45)'; c.lineWidth=1; for(let i=0;i<40;i++){ const rx=x+((i*37+t*120)%w), ry=y+((i*53+t*260)%h); c.beginPath(); c.moveTo(rx,ry); c.lineTo(rx-2,ry+7); c.stroke(); } }
 if(wx.wx==='-SN'&&!G.rm()){ c.fillStyle='rgba(255,255,255,.85)'; for(let i=0;i<40;i++){ const rx=x+((i*37+t*20)%w), ry=y+((i*53+t*40)%h); c.fillRect(rx,ry,1.6,1.6); } }
}
H.drawWxSky=sky;
G.scenes.g_wx={
 enter(a){ MG.start(this,'wx',a); this.N=10; this.n=0; this.score=0; this.streak=0; this.right=0; const r=H.rng(Date.now()%99991+3);
  const order=G.shuffle(['VFR','VFR','MVFR','MVFR','MVFR','IFR','IFR','IFR','LIFR','LIFR']); this.qs=order.map(cat=>H.wx.make(r,{cat}));
  this.help=!H.gameRec('wx'); if(this.help) this.tipT=0; this.start(); if(AUDIO.curName!=='tower') AUDIO.play('tower'); },
 start(){ this.w=this.qs[this.n]; this.clock=0; this.fb=null; this.peek=false; },
 btns(){ const VH=G.VH, w=(VW-30)/2, y0=VH-112; return CATS.map((k,i)=>({id:k.k,label:k.k,x:12+(i%2)*(w+6),y:y0+Math.floor(i/2)*50,w,h:44,size:11,col:k.col})); },
 why(){ const w=this.w, ceil=H.wx.ceiling(w), cc=ceil==null?'VFR':(ceil<500?'LIFR':(ceil<1000?'IFR':(ceil<=3000?'MVFR':'VFR'))), vc=w.vis<1?'LIFR':(w.vis<3?'IFR':(w.vis<=5?'MVFR':'VFR'));
  return (ceil==null?'No ceiling':'Ceiling '+ceil.toLocaleString('en-US')+' ft')+' = '+cc+'. Visibility '+H.wx.parts(w).find(p=>p.k==='vis').t.replace('SM',' mi')+' = '+vc+'. '+(cc===vc?'Both say '+w.cat+'.':'The worse one wins: '+w.cat+'.'); },
 update(dt){
  if(MG.update(this,dt)) return;
  if(this.help){ if(G.ptr.click||G.pressed.a){ G.ptr.click=false; this.help=false; this.tipT=2.4; AUDIO.sfx('ok'); } return; }
  const hb={x:VW-50,y:48,w:42,h:20}; if(!this.fb&&G.clicked(hb.x,hb.y,hb.w,hb.h)){ this.help=true; return; }
  if(this.fb){ this.fb.t+=dt; if(this.fb.t>.6&&(G.ptr.click||G.pressed.a)){ G.ptr.click=false; this.n++; if(this.n>=this.N) return this.finish(); this.start(); } return; }
  this.clock+=dt;
  for(const b of this.btns()) if(G.clicked(b.x,b.y,b.w,b.h)){ const ok=b.id===this.w.cat; let pts=0;
   if(ok){ pts=60+Math.max(0,Math.round(40-this.clock*3)); this.streak++; if(this.streak>=3) pts+=10; this.right++; AUDIO.sfx(this.streak>=3?'bigpoint':'point'); } else { this.streak=0; AUDIO.sfx('thud'); }
   this.score+=pts; this.fb={ok,pick:b.id,pts,t:0}; return; }
 },
 finish(){ MG.end(this,this.score,{head:this.right>=9?'CHIEF FORECASTER':(this.right>=6?'GOOD CALLS':'KEEP WATCHING THE SKY'),line:'You called '+this.right+' of '+this.N+' right. Student pilots fly in VFR weather.'}); },
 draw(c){
  const VH=G.VH, w=this.w;
  c.fillStyle='#10151b'; c.fillRect(0,42,VW,VH-42);
  G.txt('CALL '+Math.min(this.N,this.n+1)+' OF '+this.N,12,52,6,C.ink,'left',undefined,800);
  const hb={x:VW-50,y:48,w:42,h:20}; G.rrect(hb.x,hb.y,hb.w,hb.h,8); c.fillStyle='rgba(11,11,12,.7)'; c.fill(); c.strokeStyle=G.rgba(C.accent,.6); c.lineWidth=1; c.stroke(); G.txt('RULES',hb.x+hb.w/2,hb.y+6,5.4,C.accentText,'center',undefined,800);
  // the window + the report
  const sy=72, sh=Math.min(200,VH-330); c.save(); G.rrect(10,sy,VW-20,sh,12); c.clip(); sky(c,10,sy,VW-20,sh,w,this.t); c.restore();
  c.strokeStyle='#2a323d'; c.lineWidth=4; G.rrect(10,sy,VW-20,sh,12); c.stroke(); c.fillStyle='#2a323d'; c.fillRect(VW/2-2,sy,4,sh);
  const my=sy+sh+8, lines=H.wx.metarLines(H.wx.metar(w),34); G.rrect(10,my,VW-20,12+lines.length*11,10); c.fillStyle='#061209'; c.fill();
  lines.forEach((l,i)=>G.txt(l,VW/2,my+6+i*11,7,'#9fffc4','center',VW-30,800));
  // buttons + feedback
  for(const b of this.btns()){ const on=this.fb&&(b.id===w.cat||b.id===this.fb.pick), press=G.held(b.x,b.y,b.w,b.h); G.rrect(b.x,b.y+(press?1:0),b.w,b.h,12); c.fillStyle=this.fb?(b.id===w.cat?b.col:(b.id===this.fb.pick?'#3a1414':'rgba(255,255,255,.04)')):G.rgba(b.col,.22); c.fill(); c.strokeStyle=b.col; c.lineWidth=on?2.4:1.4; c.stroke();
   G.txt(b.label,b.x+b.w/2,b.y+8,11,'#fff','center',b.w-8,800); G.txt(CATS.find(k=>k.k===b.id).d,b.x+b.w/2,b.y+28,4.8,'rgba(255,255,255,.8)','center',b.w-8,800); }
  if(this.fb){ const h=60, y=VH-112-h-8; G.rrect(12,y,VW-24,h,12); c.fillStyle=this.fb.ok?'rgba(18,61,38,.96)':'rgba(70,16,16,.96)'; c.fill(); c.strokeStyle=this.fb.ok?C.good:C.bad; c.lineWidth=1.2; c.stroke();
   G.txt(this.fb.ok?'RIGHT CALL! +'+this.fb.pts:'IT’S '+w.cat,VW/2,y+8,8,'#fff','center',VW-40,800); G.para(this.why(),VW/2,y+24,6,C.ink,'center',VW-44,8.6,700);
   if(this.fb.t>.6&&!this.over) G.txt('TAP TO CONTINUE',VW/2,VH-10,5,C.accentText,'center',undefined,800); }
  if(this.help) drawRules(c);
  MG.hud(this,c,this.score+' PTS',{sub:'VFR • MVFR • IFR • LIFR',tip:'Read the ceiling and the visibility. The worse one decides the category.'});
 }
};
function drawRules(c){ const VH=G.VH; G.dim(.8); const y0=54; G.panel(10,y0,VW-20,VH-y0-14,{r:14,border:G.rgba(C.accent,.6)});
 G.txt('FLIGHT CATEGORIES',VW/2,y0+12,9,C.title,'center',undefined,800);
 G.para('Two things decide it: the CEILING (the lowest BROKEN or OVERCAST cloud layer) and the VISIBILITY.',VW/2,y0+30,6.2,C.sub,'center',VW-40,8.6,700);
 const R=[['VFR','CEILING ABOVE 3,000 FT','AND VISIBILITY ABOVE 5 MI'],['MVFR','CEILING 1,000 - 3,000 FT','OR VISIBILITY 3 - 5 MI'],['IFR','CEILING 500 - 999 FT','OR VISIBILITY 1 - UNDER 3 MI'],['LIFR','CEILING UNDER 500 FT','OR VISIBILITY UNDER 1 MI']];
 let y=y0+58; const rh=Math.min(54,(VH-y0-150)/4);
 R.forEach(([k,a,b],i)=>{ const col=CATS[i].col; G.rrect(20,y,VW-40,rh-6,10); c.fillStyle=G.rgba(col,.18); c.fill(); c.strokeStyle=col; c.lineWidth=1.4; c.stroke();
  G.txt(k,34,y+(rh-6)/2-6,10,'#fff','left',60,800); G.txt(a,96,y+(rh-6)/2-9,6,C.ink,'left',VW-120,800); G.txt(b,96,y+(rh-6)/2+3,6,C.ink,'left',VW-120,800); y+=rh; });
 G.para('THE WORSE ONE DECIDES. Only FEW or SCATTERED clouds? Then there is no ceiling.',VW/2,y+6,6.4,C.accentHi,'center',VW-40,9,800);
 G.txt('TAP TO START',VW/2,VH-30,6.4,C.accentText,'center',undefined,800); }
})();
