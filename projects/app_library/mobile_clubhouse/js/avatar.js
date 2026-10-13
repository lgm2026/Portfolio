/* Rider & bike builder.
   AV.draw - side view (builder stage, sign-up, login list, settings): six bike styles, each with its own silhouette,
             wheels and riding position; the rider's skin tone, hair style + color, facial hair, helmet + color, jacket.
   AV.top  - top-down view used on the rides and in the arcade runner.
   G.scenes.builder - BUILD YOUR RIDE: BIKE / RIDER / GEAR tabs over a live showroom preview. */
(function(){
const VW=G.VW;

const AV={
 TYPES:[['bagger','BAGGER'],['cruiser','CRUISER'],['chopper','CHOPPER'],['sport','SPORT'],['adv','ADVENTURE'],['trike','TRIKE']],
 PAINTS:[['RED','#c02030'],['ORANGE','#f07818'],['BLUE','#2258c8'],['GREEN','#2a9a4a'],['PURPLE','#7a3ac8'],
         ['GOLD','#d8b020'],['TEAL','#20b0a8'],['PEARL','#e4e2dc'],['GUNMETAL','#5a5f6a'],['MIDNIGHT','#3a3a48']],
 SKINS:[['FAIR','#f3d5b6'],['LIGHT','#e2b88f'],['TAN','#c9976b'],['BROWN','#a06a43'],['DARK','#74492b'],['DEEP','#4d2f1c']],
 HAIRS:[['BLACK','#23232b'],['BROWN','#6b4a2a'],['BLONDE','#d8b050'],['RED','#b8481c'],['GRAY','#9a9aa2'],['WHITE','#e6e6ea'],['PINK','#e070b0']],
 STYLES:[['short','SHORT'],['long','LONG'],['pony','PONY'],['braids','BRAIDS'],['buzz','BUZZ']],
 FACES:[['none','CLEAN'],['goatee','GOATEE'],['beard','BEARD'],['stache','STACHE']],
 HELMS:[['half','HALF'],['open','OPEN FACE'],['full','FULL FACE']],
 HCOLS:[['BLACK','#1c1c24'],['WHITE','#e8e8ee'],['ORANGE','#f07818'],['RED','#b02030'],['GUNMETAL','#4a4e58'],['MATCH BIKE','match']],
 JACKETS:[['BLACK','#26262f'],['BROWN','#5e3c22'],['DENIM','#34507a'],['OLIVE','#4b5233'],['OXBLOOD','#6a2026'],['GRAY','#5c5f68']],
 /* fill in anything an older save doesn't have (old saves only knew 'bike' = bagger, and 'trike') */
 norm(a){
  a=a||{};
  const o=Object.assign({type:'bagger',seat:1,body:'#c02030',gender:'m',hair:'#6b4a2a',skin:'#e2b88f',face:'none',helm:'half',hcol:'#1c1c24',jacket:'#26262f'},a);
  if(!AV.TYPES.some(t=>t[0]===o.type)) o.type='bagger';
  if(!o.style) o.style=o.gender==='f'?'long':'short';
  if(o.seat!==2) o.seat=1;
  return o;
 },
 typeName(t){ const e=AV.TYPES.find(p=>p[0]===t); return e?e[1]:'BAGGER'; },
 helmCol(av){ return av.hcol==='match'?av.body:(av.hcol||'#1c1c24'); }
};

/* ---------------------------------------------------------------- side view ---------------------------------------------------------------- */
const OUT='#15131b', CH='#d6dae1', CHD='#8e929c', SEAT='#1d1d24', GOLD='#c8a040';
/* rounded-rect path on THIS context (G.rrect always targets the main canvas) */
function rrp(c,x,y,w,h,r){ r=Math.min(r,w/2,h/2); c.beginPath(); c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath(); }
function kit(c,B){
 const BL=G.shade(B,1.5), BD=G.shade(B,.5);
 const P=()=>c.beginPath();
 return {
  P,B,BL,BD,
  paint(fill,stroke){ if(fill){ c.fillStyle=fill; c.fill(); } if(stroke!==null){ c.strokeStyle=stroke||OUT; c.lineWidth=1.4; c.stroke(); } },
  grad(y0,y1){ const g=c.createLinearGradient(0,y0,0,y1); g.addColorStop(0,BL); g.addColorStop(.45,B); g.addColorStop(1,BD); return g; },
  line(pts,col,w){ P(); c.moveTo(pts[0],pts[1]); for(let i=2;i<pts.length;i+=2) c.lineTo(pts[i],pts[i+1]); c.strokeStyle=col; c.lineWidth=w; c.stroke(); },
  wheel(wx,wy,r,kind,dark){
   P(); c.arc(wx,wy,r,0,7); c.fillStyle=dark?'#16171c':'#1d1f26'; c.fill(); c.strokeStyle=OUT; c.lineWidth=1.3; c.stroke();
   if(kind==='knob'){ c.strokeStyle='#2a2c33'; c.lineWidth=1.5; for(let i=0;i<20;i++){ const a=i/20*Math.PI*2; P(); c.moveTo(wx+Math.cos(a)*(r-.5),wy+Math.sin(a)*(r-.5)); c.lineTo(wx+Math.cos(a)*(r+.55),wy+Math.sin(a)*(r+.55)); c.stroke(); } }
   if(kind==='spoke'||kind==='knob'){
    P(); c.arc(wx,wy,r*.76,0,7); c.strokeStyle=kind==='knob'?GOLD:(dark?CHD:CH); c.lineWidth=1.2; c.stroke();
    c.strokeStyle=dark?'rgba(150,156,166,.6)':'rgba(205,210,218,.8)'; c.lineWidth=.45;
    for(let i=0;i<16;i++){ const a=i/16*Math.PI*2+wx*.2; P(); c.moveTo(wx+Math.cos(a)*r*.16,wy+Math.sin(a)*r*.16); c.lineTo(wx+Math.cos(a+.38)*r*.74,wy+Math.sin(a+.38)*r*.74); c.stroke(); }
    P(); c.arc(wx,wy,r*.2,0,7); c.fillStyle=dark?CHD:CH; c.fill();
   } else if(kind==='sport'){
    P(); c.arc(wx,wy,r*.72,0,7); c.fillStyle='#2b2d35'; c.fill();
    P(); c.arc(wx,wy,r*.5,0,7); c.fillStyle=dark?'#6c7079':'#a2a8b2'; c.fill();
    c.fillStyle='#3a3d46'; for(let i=0;i<8;i++){ const a=i/8*Math.PI*2; P(); c.arc(wx+Math.cos(a)*r*.37,wy+Math.sin(a)*r*.37,.45,0,7); c.fill(); }
    c.strokeStyle='#3c3f48'; c.lineWidth=1.7;
    for(let i=0;i<3;i++){ const a=i/3*Math.PI*2+wx*.15; P(); c.moveTo(wx,wy); c.lineTo(wx+Math.cos(a)*r*.7,wy+Math.sin(a)*r*.7); c.stroke(); }
    P(); c.arc(wx,wy,r*.15,0,7); c.fillStyle=CH; c.fill();
   } else {
    P(); c.arc(wx,wy,r*.62,0,7); c.fillStyle=dark?'#3a3d45':'#4a4e58'; c.fill(); c.strokeStyle=dark?'#565a63':'#74788a'; c.lineWidth=1.1; c.stroke();
    c.strokeStyle=dark?'#60646e':'#8e929c'; c.lineWidth=1.3;
    for(let i=0;i<5;i++){ const a=i*Math.PI*2/5+wx*.3; P(); c.moveTo(wx+Math.cos(a)*r*.18,wy+Math.sin(a)*r*.18); c.lineTo(wx+Math.cos(a)*r*.58,wy+Math.sin(a)*r*.58); c.stroke(); }
    P(); c.arc(wx,wy,r*.16,0,7); c.fillStyle='#c9cdd4'; c.fill();
   }
  },
  vtwin(x0,y0,s){   // two finned cylinders in a V over a block (x0 = block's rear edge, y0 = block bottom)
   s=s||1;
   P(); c.moveTo(x0,y0); c.lineTo(x0+14*s,y0); c.lineTo(x0+13*s,y0-6.5*s); c.lineTo(x0+1*s,y0-6.5*s); c.closePath(); c.fillStyle='#474a53'; c.fill();
   const cyl=(a,b,cc,d)=>{ P(); c.moveTo(a[0],a[1]); c.lineTo(b[0],b[1]); c.lineTo(cc[0],cc[1]); c.lineTo(d[0],d[1]); c.closePath(); c.fillStyle='#5b5f69'; c.fill(); c.strokeStyle='#2c2e35'; c.lineWidth=.6; c.stroke(); };
   cyl([x0+1.6*s,y0-6*s],[x0-1.4*s,y0-14*s],[x0+3.8*s,y0-15.4*s],[x0+6.6*s,y0-6.6*s]);
   cyl([x0+7.4*s,y0-6.6*s],[x0+10.6*s,y0-15.4*s],[x0+15.6*s,y0-13.8*s],[x0+12.6*s,y0-6*s]);
   c.strokeStyle='#7c808a'; c.lineWidth=.7;
   for(let k=1;k<5;k++){ const t=k/5;
    P(); c.moveTo(x0+(1.6-3*t)*s,y0-(6+8*t)*s); c.lineTo(x0+(6.6-2.8*t)*s,y0-(6.6+8.8*t)*s); c.stroke();
    P(); c.moveTo(x0+(7.4+3.2*t)*s,y0-(6.6+8.8*t)*s); c.lineTo(x0+(12.6+3*t)*s,y0-(6+7.8*t)*s); c.stroke(); }
   P(); c.arc(x0+11.5*s,y0-3*s,2.1*s,0,7); c.fillStyle='#b9bdc6'; c.fill();   // cover
  }
 };
}
/* each style draws its bike and returns where the rider (and a passenger) sit */
const BIKES={
 bagger(c,K,av){
  const {P,paint,grad,wheel}=K;
  P(); c.moveTo(5,35); c.quadraticCurveTo(2,35,2.5,30); c.lineTo(3.5,23); c.quadraticCurveTo(4,19.5,8,19.5); c.lineTo(19,20.5); c.lineTo(21,35); c.closePath(); paint(grad(19,35));   // saddlebag
  P(); c.moveTo(4.5,24.5); c.lineTo(19.5,25.2); c.strokeStyle='rgba(255,255,255,.3)'; c.lineWidth=1.2; c.stroke();
  P(); c.moveTo(3.4,31); c.lineTo(20.4,31); c.strokeStyle=CH; c.lineWidth=1.6; c.stroke();
  P(); c.moveTo(20,36.5); c.quadraticCurveTo(38,39.5,52,37.2); c.strokeStyle=CH; c.lineWidth=3.2; c.stroke();
  P(); c.moveTo(48,37.4); c.lineTo(54,36.9); c.strokeStyle=CHD; c.lineWidth=3.8; c.stroke();
  K.vtwin(28.5,35.5,.95);
  wheel(16,34,9.5,'cast');
  return BIKES.bagger.front(c,K,av);
 },
 trike(c,K,av){
  const {P,paint,grad,wheel}=K;
  wheel(10,32.5,8,'cast',true);
  P(); c.moveTo(2,30.5); c.lineTo(2,20); c.quadraticCurveTo(2,16.5,6,16.5); c.lineTo(19,16.5); c.quadraticCurveTo(23,16.5,23,20); c.lineTo(23,30.5); c.closePath(); paint(grad(16,31));
  P(); c.moveTo(2.5,15.2); c.lineTo(22,15.2); c.strokeStyle=CH; c.lineWidth=1.8; c.stroke();
  P(); c.moveTo(4,20.5); c.lineTo(21,20.5); c.strokeStyle='rgba(255,255,255,.28)'; c.lineWidth=1.2; c.stroke();
  P(); c.moveTo(20,36.5); c.quadraticCurveTo(38,39.5,52,37.2); c.strokeStyle=CH; c.lineWidth=3.2; c.stroke();
  K.vtwin(28.5,35.5,.95);
  wheel(17,34,9.5,'cast');
  const r=BIKES.bagger.front(c,K,av);
  return r;
 },
 cruiser(c,K,av){
  const {P,paint,grad,wheel}=K;
  P(); c.moveTo(5,33.5); c.quadraticCurveTo(6.5,22.5,16,22); c.quadraticCurveTo(25,22.2,26.5,31); c.lineTo(23,31.5); c.quadraticCurveTo(21.5,26.2,16,25.8); c.quadraticCurveTo(10.5,26,8.5,33.8); c.closePath(); paint(grad(22,34));   // deep rear fender
  K.line([39,36.4,4.5,37.8],CH,2.6); K.line([37.5,33.8,6.5,35.1],CH,2.2);   // shotgun pipes
  K.vtwin(27.5,35.6,1);
  wheel(15,34,9.5,'spoke');
  K.line([49,14.5,24,21.5,15,34],'#1d1d24',2.2); K.line([48,16.5,41.5,35],'#1d1d24',2);   // frame
  P(); c.moveTo(28,21); c.quadraticCurveTo(31,15,39,15); c.quadraticCurveTo(46.5,15.3,48.5,18.6); c.quadraticCurveTo(44,22.4,36,22.6); c.quadraticCurveTo(30,22.6,28,21); c.closePath(); paint(grad(15,23));   // teardrop tank
  P(); c.moveTo(31,18.4); c.quadraticCurveTo(37,15.8,45,16.6); c.strokeStyle='rgba(255,255,255,.45)'; c.lineWidth=1.1; c.stroke();
  P(); c.arc(38,19.4,1.8,0,7); c.fillStyle='#f07818'; c.fill(); c.strokeStyle='#14121a'; c.lineWidth=.6; c.stroke();
  K.line([48.6,14.8,58.8,34.4],CH,2.4);
  P(); c.moveTo(51.4,31.6); c.quadraticCurveTo(58,24.4,66.2,30.6); c.lineTo(64.8,32.2); c.quadraticCurveTo(58.5,27.2,53.2,32.8); c.closePath(); paint(grad(24,33));
  wheel(59,35,8.5,'spoke');
  P(); c.arc(52.6,16.8,3.2,0,7); c.fillStyle=CHD; c.fill(); c.strokeStyle=OUT; c.lineWidth=.8; c.stroke();
  P(); c.ellipse(54.6,16.8,1.2,2.5,0,0,7); c.fillStyle='#ffd980'; c.fill();
  P(); c.moveTo(19.5,20.6); c.quadraticCurveTo(24,17.4,30,19); c.lineTo(29.4,22.4); c.lineTo(20.5,23); c.closePath(); paint(SEAT);
  if(av.seat===2){ P(); c.moveTo(12.5,19.4); c.quadraticCurveTo(15.5,17.6,19.5,18.6); c.lineTo(19.5,21.4); c.lineTo(13,21.6); c.closePath(); paint(SEAT); }
  K.line([49.2,14.2,47.6,10.6,44.2,10.4],'#23252d',2);
  return {hip:[24.8,19.8],knee:[35,22.4],foot:[41.2,31],sh:[29.6,8.4],hand:[44.4,10.4],head:[31,4],p:{hip:[15.6,18.8],sh:[17.4,9.2],head:[18.6,4.4]}};
 },
 chopper(c,K,av){
  const {P,paint,grad,wheel}=K;
  K.line([9.5,26,7.6,8,8.4,5.4,10.6,6.2,11.6,24],CH,1.6);   // sissy bar
  P(); c.moveTo(3.4,30.6); c.quadraticCurveTo(5.4,21.4,13,21); c.quadraticCurveTo(20.4,21.3,21.6,27.6); c.lineTo(18.6,28.2); c.quadraticCurveTo(17,24.4,13,24.3); c.quadraticCurveTo(8.6,24.6,6.8,31); c.closePath(); paint(grad(21,31));   // bobbed fender
  P(); c.moveTo(38,35.6); c.quadraticCurveTo(22,36.4,6.6,31.4); c.strokeStyle=CH; c.lineWidth=2.6; c.stroke();
  P(); c.moveTo(7.6,31.8); c.lineTo(3,29.2); c.lineTo(4.4,33.4); c.closePath(); c.fillStyle=CH; c.fill();   // fishtail
  K.vtwin(25.5,35.4,1.05);
  wheel(12.5,33.5,10,'spoke');
  K.line([51,9.6,22,20.6,12.5,33.5],'#1d1d24',2.2); K.line([50,11.2,41.6,35],'#1d1d24',2);   // hardtail frame
  P(); c.ellipse(38.4,14.6,7.4,3.6,-.36,0,7); paint(grad(10,19));   // peanut tank
  P(); c.moveTo(33.2,14.2); c.quadraticCurveTo(38,10.8,43.6,11.6); c.strokeStyle='rgba(255,255,255,.45)'; c.lineWidth=1; c.stroke();
  P(); c.arc(37.4,15.2,1.6,0,7); c.fillStyle='#f07818'; c.fill(); c.strokeStyle='#14121a'; c.lineWidth=.6; c.stroke();
  K.line([51,9,65.4,36],CH,2.2); K.line([52.6,8.6,66.8,35.2],CHD,1.3);   // long raked fork
  wheel(65.6,36,7.5,'spoke');
  P(); c.moveTo(60,30.2); c.quadraticCurveTo(65.5,26.8,71,30.2); c.strokeStyle=K.B; c.lineWidth=1.8; c.stroke();   // little front fender
  P(); c.arc(55.6,11.4,2.3,0,7); c.fillStyle=CHD; c.fill(); P(); c.ellipse(57.2,11.4,.9,1.8,0,0,7); c.fillStyle='#ffd980'; c.fill();
  P(); c.moveTo(16.6,22); c.quadraticCurveTo(21,19,27,20.2); c.lineTo(26.4,22.6); c.lineTo(17.6,23.6); c.closePath(); paint(SEAT);
  if(av.seat===2){ P(); c.moveTo(10.2,20.6); c.quadraticCurveTo(13.2,18.8,16.6,19.8); c.lineTo(16.4,22.4); c.lineTo(10.8,22.6); c.closePath(); paint(SEAT); }
  K.line([51.6,8.6,50.8,-1.6,49.4,-3,46.6,-2.4,44.6,-1.8],CH,1.8);   // ape hangers
  return {hip:[21.4,20.6],knee:[33,21.6],foot:[42.6,30.6],sh:[22.4,9],hand:[45,-1.8],head:[22.2,4.2],p:{hip:[12.4,19.8],sh:[12.2,9.6],head:[12.6,4.8]}};
 },
 sport(c,K,av){
  const {P,paint,grad,wheel}=K;
  P(); c.moveTo(6.4,15.6); c.lineTo(23,13.4); c.lineTo(29.4,16.8); c.lineTo(25.6,21.8); c.lineTo(13,21.4); c.closePath(); paint(grad(13,22));   // tall tail
  P(); c.moveTo(6.6,15.8); c.lineTo(10,15.4); c.strokeStyle='#ff3a40'; c.lineWidth=1.6; c.stroke();
  rrp(c,6,22.6,14.5,4.6,2.3); c.fillStyle=CHD; c.fill(); c.strokeStyle=OUT; c.lineWidth=.8; c.stroke();   // can
  K.line([17,34,31,29.4],'#2a2c33',2.6);   // swingarm
  wheel(17,34,9,'sport');
  P(); c.moveTo(27.6,34.4); c.lineTo(40.4,34.4); c.lineTo(40.8,24.4); c.lineTo(28.4,24.4); c.closePath(); c.fillStyle='#3a3d46'; c.fill();
  P(); c.moveTo(30,16.4); c.lineTo(41,12.6); c.lineTo(52.6,10.6); c.lineTo(61.2,15.2); c.lineTo(63.6,21.6); c.lineTo(58.6,27.6); c.lineTo(50,31.4); c.lineTo(38.6,31.8); c.lineTo(33.4,27); c.closePath(); paint(grad(10,32));   // full fairing
  P(); c.moveTo(35.6,24.4); c.lineTo(58.4,17.4); c.strokeStyle=G.shade(K.B,1.8); c.lineWidth=1.3; c.stroke();
  P(); c.moveTo(33.6,20.4); c.lineTo(41.6,17.2); c.strokeStyle='rgba(255,255,255,.4)'; c.lineWidth=1; c.stroke();
  P(); c.moveTo(58.6,16.2); c.lineTo(62.4,18.4); c.strokeStyle='#ffd980'; c.lineWidth=1.4; c.stroke();
  P(); c.moveTo(51,10.9); c.quadraticCurveTo(55,6.6,58.8,9.2); c.lineTo(60.6,14.2); c.closePath(); c.fillStyle='rgba(60,80,104,.88)'; c.fill(); c.strokeStyle='#2a3340'; c.lineWidth=.8; c.stroke();
  K.line([55.6,16,56.6,34],GOLD,2.6);
  P(); c.moveTo(50.6,27.6); c.quadraticCurveTo(56.6,23.2,62.4,27); c.strokeStyle=K.B; c.lineWidth=2.2; c.stroke();
  wheel(56.6,34,9,'sport');
  P(); c.moveTo(19.4,15); c.lineTo(31,16.4); c.lineTo(30,18.6); c.lineTo(20,17.4); c.closePath(); paint(SEAT);
  if(av.seat===2){ P(); c.moveTo(11.6,13.6); c.lineTo(19.6,13.2); c.lineTo(19.4,15.4); c.lineTo(11.8,15.8); c.closePath(); paint(SEAT); }
  K.line([50.4,13.8,47.6,15],'#23252d',2);
  return {hip:[25.6,15],knee:[32.6,21.6],foot:[28.6,27.6],sh:[38.4,9.6],hand:[48.2,14.6],head:[43,6.2],p:{hip:[15.6,13.4],sh:[20.6,5.4],head:[23,1.4]}};
 },
 adv(c,K,av){
  const {P,paint,grad,wheel}=K;
  rrp(c,3.6,18.6,16,12.6,1.6); c.fillStyle='#b9bfc8'; c.fill(); c.strokeStyle='#5a5f6a'; c.lineWidth=1; c.stroke();   // aluminum pannier
  c.fillStyle='rgba(0,0,0,.18)'; c.fillRect(4.6,22.6,14,1.1); c.fillStyle='#2a2c33'; c.fillRect(17.2,20.4,1.6,3);
  P(); c.moveTo(37,34.6); c.quadraticCurveTo(27,33,21.4,26.4); c.strokeStyle=CH; c.lineWidth=2.4; c.stroke();
  wheel(15,34,9.5,'knob');
  P(); c.moveTo(28,36.4); c.lineTo(43.2,35.2); c.lineTo(44,32.4); c.lineTo(29,33.6); c.closePath(); c.fillStyle='#8a8f99'; c.fill();   // skid plate
  P(); c.moveTo(29,33.4); c.lineTo(42.6,32.4); c.lineTo(42,24.6); c.lineTo(30,24.8); c.closePath(); c.fillStyle='#3a3d46'; c.fill();
  K.line([50.6,13,26,19.6,15,34],'#1d1d24',2.2);
  P(); c.moveTo(27,20.2); c.quadraticCurveTo(30,13.6,38.6,12.8); c.quadraticCurveTo(47.6,12.4,50.6,16.6); c.quadraticCurveTo(46,21.2,37,21.4); c.quadraticCurveTo(30,21.4,27,20.2); c.closePath(); paint(grad(12,22));
  P(); c.moveTo(30,22.4); c.lineTo(45.6,21); c.lineTo(43,26.6); c.lineTo(31.6,26.6); c.closePath(); paint(G.shade(K.B,.62));   // side panel
  P(); c.moveTo(31,16.6); c.quadraticCurveTo(38,13.6,46.6,14.6); c.strokeStyle='rgba(255,255,255,.42)'; c.lineWidth=1.1; c.stroke();
  P(); c.arc(38,18.2,1.7,0,7); c.fillStyle='#f07818'; c.fill(); c.strokeStyle='#14121a'; c.lineWidth=.6; c.stroke();
  K.line([51,14.6,59.2,33.4],GOLD,2.6);
  P(); c.moveTo(50,22.4); c.lineTo(66.2,24.2); c.lineTo(60.6,27.2); c.lineTo(51,25.8); c.closePath(); paint(grad(22,28));   // beak
  wheel(59.2,33.4,10,'knob');
  P(); c.arc(54.6,17.6,1.6,0,7); c.fillStyle='#ffd980'; c.fill(); P(); c.arc(54.2,20.4,1.4,0,7); c.fill();
  windshield(c,P,[50,13.4],[51.2,4.2,55.2,2.2],[56.4,1.8,56.8,3.4],[55.8,8.8,53.8,14]);
  P(); c.moveTo(18.6,17.4); c.quadraticCurveTo(24,14.6,32,16.2); c.lineTo(31.6,18.8); c.lineTo(19,19.6); c.closePath(); paint(SEAT);
  K.line([50.6,12.6,49.4,8.8,46.4,8],'#23252d',2);
  return {hip:[26.6,16.4],knee:[33.4,24.2],foot:[33.2,32.2],sh:[31.6,5.8],hand:[46.4,8],head:[33.2,1.4],p:{hip:[17.6,15.6],sh:[18.8,5.6],head:[20,1]}};
 }
};
/* the bagger's front half (shared with the trike) */
BIKES.bagger.front=function(c,K,av){
 const {P,paint,grad,wheel}=K;
 P(); c.moveTo(24,22.5); c.quadraticCurveTo(26,18.5,32,18); c.quadraticCurveTo(42,16.5,48,13.5); c.quadraticCurveTo(57,11,63,17);
 c.quadraticCurveTo(66.5,20.5,65,25); c.lineTo(61,29); c.quadraticCurveTo(54,31.5,48,30); c.lineTo(43,25.5); c.quadraticCurveTo(34,27.5,27,26); c.closePath(); paint(grad(11,31));
 P(); c.moveTo(27,20.5); c.quadraticCurveTo(36,18,46,15.5); c.strokeStyle='rgba(255,255,255,.4)'; c.lineWidth=1.3; c.stroke();
 P(); c.arc(33,22.5,2.1,0,7); c.fillStyle='#f07818'; c.fill(); c.strokeStyle='#14121a'; c.lineWidth=.7; c.stroke();
 P(); c.ellipse(63.6,21.5,2.1,2.8,-.3,0,7); c.fillStyle='#ffd980'; c.fill(); c.strokeStyle=OUT; c.lineWidth=1; c.stroke();
 P(); c.moveTo(47,27); c.quadraticCurveTo(56,20.5,66,27.5); c.quadraticCurveTo(66.5,30,64,30.5); c.lineTo(62,28.5); c.quadraticCurveTo(56,24,50,29.5); c.closePath(); paint(grad(21,31));
 P(); c.moveTo(58,20); c.lineTo(60.5,30); c.strokeStyle=CH; c.lineWidth=2.4; c.stroke();
 wheel(57,34,9.5,'cast');
 windshield(c,P,[46.5,15.4],[49.5,4.5,56,3.2],[60,2.8,60.4,7],[60.6,12,57.5,16.4]);
 P(); c.moveTo(19,20.5); c.quadraticCurveTo(25,17,31,18.5); c.lineTo(30,22); c.lineTo(20,23); c.closePath(); paint(SEAT);
 if(av.seat===2){ P(); c.moveTo(11,16); c.quadraticCurveTo(15,13.5,20,15.5); c.lineTo(19,20); c.lineTo(12,20); c.closePath(); paint(SEAT); }
 P(); c.moveTo(48.5,14.5); c.quadraticCurveTo(46.5,10.5,43.8,9.2); c.strokeStyle='#23252d'; c.lineWidth=2.1; c.stroke();
 return {hip:[25.5,19.6],knee:[33.5,23],foot:[33.2,30.6],sh:[33.2,8.8],hand:[44.6,9.3],head:[35,4.8],p:{hip:[15,16.4],sh:[17.6,8],head:[19.2,3.6]}};
};
function windshield(c,P,a,b,d,e){
 P(); c.moveTo(a[0],a[1]); c.quadraticCurveTo(b[0],b[1],b[2],b[3]); c.quadraticCurveTo(d[0],d[1],d[2],d[3]); c.quadraticCurveTo(e[0],e[1],e[2],e[3]); c.closePath();
 const wg=c.createLinearGradient(0,b[3],0,a[1]); wg.addColorStop(0,'rgba(210,236,250,.95)'); wg.addColorStop(1,'rgba(140,190,225,.55)');
 c.fillStyle=wg; c.fill(); c.strokeStyle='#2a3340'; c.lineWidth=1.1; c.stroke();
 P(); c.moveTo(a[0]+3,a[1]-3.5); c.quadraticCurveTo(b[0]+2,b[1]+1.5,b[2],b[3]+1.6); c.strokeStyle='rgba(255,255,255,.7)'; c.lineWidth=.9; c.stroke();
}
/* ---------------- the rider (and passenger), placed by the bike's riding position ---------------- */
function unit(dx,dy){ const l=Math.hypot(dx,dy)||1; return [dx/l,dy/l]; }
function torso(c,H,S,col,f,w0,w1){
 const [dx,dy]=unit(S[0]-H[0],S[1]-H[1]), n=[dy,-dx];   // n points at the rider's back
 const k=f?.86:1; w0=(w0||3)*(f?1.02:1); w1=(w1||3.4)*k;
 const Hb=[H[0]+n[0]*w0,H[1]+n[1]*w0], Sb=[S[0]+n[0]*w1,S[1]+n[1]*w1], Sf=[S[0]-n[0]*w1*.8,S[1]-n[1]*w1*.8], Hf=[H[0]-n[0]*w0*.75,H[1]-n[1]*w0*.75];
 const mid=[(H[0]+S[0])/2,(H[1]+S[1])/2], at=(t,off)=>[H[0]+(S[0]-H[0])*t-n[0]*off,H[1]+(S[1]-H[1])*t-n[1]*off];
 c.beginPath(); c.moveTo(Hb[0],Hb[1]);
 if(f){
  // back: in at the waist, out at the shoulder blades
  c.quadraticCurveTo(mid[0]+n[0]*(w0*.55),mid[1]+n[1]*(w0*.55),Sb[0],Sb[1]);
  c.quadraticCurveTo(S[0]+dx*2.4,S[1]+dy*2.4,Sf[0],Sf[1]);
  // front: the bust, a cinched waist, then the hips
  const b1=at(.86,w1*.8+1.9), bust=at(.66,w1*.8+1.9), w2=at(.5,w1*.5+.6), waist=at(.36,w0*.18), hip=at(.06,w0*.95);
  c.quadraticCurveTo(b1[0],b1[1],bust[0],bust[1]);
  c.quadraticCurveTo(w2[0],w2[1],waist[0],waist[1]);
  c.quadraticCurveTo(hip[0],hip[1],Hf[0],Hf[1]); c.closePath();
 } else {
  c.quadraticCurveTo(mid[0]+n[0]*(w1+1.2),mid[1]+n[1]*(w1+1.2),Sb[0],Sb[1]);
  c.quadraticCurveTo(S[0]+dx*2.6,S[1]+dy*2.6,Sf[0],Sf[1]);
  c.quadraticCurveTo(mid[0]-n[0]*w0*.6,mid[1]-n[1]*w0*.6,Hf[0],Hf[1]); c.closePath();
 }
 const g=c.createLinearGradient(Sb[0],Sb[1],Hf[0],Hf[1]); g.addColorStop(0,G.shade(col,1.25)); g.addColorStop(1,G.shade(col,.6));
 c.fillStyle=g; c.fill(); c.strokeStyle=OUT; c.lineWidth=.9; c.stroke();
 return {n,d:[dx,dy]};
}
function limb(c,a,b,cc,col,w){ c.beginPath(); c.moveTo(a[0],a[1]); c.quadraticCurveTo(b[0],b[1],cc[0],cc[1]); c.strokeStyle=col; c.lineWidth=w; c.lineCap='round'; c.stroke(); }
function hairBack(c,av,hx,hy){
 const H=av.hair; c.fillStyle=H; c.strokeStyle=H;
 if(av.style==='long'){
  c.beginPath(); c.moveTo(hx-.6,hy-4.2); c.quadraticCurveTo(hx-9.4,hy-3.2,hx-10.4,hy+5.2); c.quadraticCurveTo(hx-10.6,hy+9.4,hx-8.2,hy+11.4);
  c.quadraticCurveTo(hx-7.6,hy+8.4,hx-5.2,hy+9.8); c.quadraticCurveTo(hx-4.2,hy+5.4,hx+.6,hy+2.6); c.closePath(); c.fill();
  c.strokeStyle=G.shade(H,1.35); c.lineWidth=.55; c.lineCap='round';   // a couple of highlights
  c.beginPath(); c.moveTo(hx-3.2,hy-2.4); c.quadraticCurveTo(hx-8,hy-.6,hx-8.6,hy+6.4); c.stroke();
  c.beginPath(); c.moveTo(hx-2.2,hy+.4); c.quadraticCurveTo(hx-5.6,hy+2.6,hx-6.2,hy+7.6); c.stroke();
 }
 else if(av.style==='pony'){ c.lineWidth=2.2; c.lineCap='round'; c.beginPath(); c.moveTo(hx-3.4,hy+.6); c.quadraticCurveTo(hx-8.4,hy+1.6,hx-9.4,hy+6); c.stroke(); c.fillStyle='#f07818'; c.fillRect(hx-5.4,hy-.2,1.4,2.2); }
 else if(av.style==='braids'){ c.lineWidth=1.6; c.lineCap='round'; c.setLineDash([1.6,.7]);
  c.beginPath(); c.moveTo(hx-3.2,hy+1.2); c.quadraticCurveTo(hx-5.6,hy+4.8,hx-5,hy+9.6); c.stroke();
  c.beginPath(); c.moveTo(hx-1.6,hy+2.2); c.quadraticCurveTo(hx-3.2,hy+5.8,hx-2.6,hy+10); c.stroke(); c.setLineDash([]); }
}
function head(c,av,hx,hy){
 const S=av.skin||'#e2b88f', HC=AV.helmCol(av), H=av.hair;
 hairBack(c,av,hx,hy);
 // face
 c.beginPath(); c.arc(hx+.4,hy+.6,3.9,0,7); c.fillStyle=S; c.fill();
 c.beginPath(); c.arc(hx+.6,hy+.8,1.1,0,7); c.fillStyle=G.shade(S,.82); c.fill();   // ear
 if(av.style==='short'&&av.helm!=='full'){ c.fillStyle=H; c.fillRect(hx-.4,hy-1.8,1.5,2.6); }
 // facial hair
 if(av.face==='beard'){ c.beginPath(); c.moveTo(hx+.2,hy+1.2); c.lineTo(hx+.9,hy+4.2); c.quadraticCurveTo(hx+2.6,hy+6.6,hx+4.6,hy+3.8); c.lineTo(hx+4.5,hy+2.2); c.lineTo(hx+2.4,hy+2.6); c.closePath(); c.fillStyle=H; c.fill(); }
 else if(av.face==='goatee'){ c.beginPath(); c.moveTo(hx+2.6,hy+2.6); c.quadraticCurveTo(hx+3.2,hy+5.8,hx+4.4,hy+3); c.closePath(); c.fillStyle=H; c.fill(); c.fillRect(hx+2.8,hy+2.2,1.8,.7); }
 else if(av.face==='stache'){ c.strokeStyle=H; c.lineWidth=.9; c.beginPath(); c.moveTo(hx+2.5,hy+4.6); c.lineTo(hx+2.6,hy+2.4); c.lineTo(hx+4.4,hy+2.3); c.lineTo(hx+4.5,hy+4.4); c.stroke(); }
 // helmet
 c.fillStyle=HC;
 if(av.helm==='full'){
  c.beginPath(); c.arc(hx,hy,4.8,0,7); c.fill();
  c.beginPath(); c.ellipse(hx+2.2,hy+3.2,3.1,1.9,-.2,0,7); c.fill();
  c.beginPath(); c.moveTo(hx+1.2,hy-1.8); c.lineTo(hx+4.8,hy-1.1); c.lineTo(hx+4.7,hy+1.6); c.lineTo(hx+1.6,hy+1.6); c.closePath(); c.fillStyle='rgba(28,38,58,.92)'; c.fill();
  c.beginPath(); c.moveTo(hx+2,hy-1.2); c.lineTo(hx+4.4,hy-.7); c.strokeStyle='rgba(180,220,255,.65)'; c.lineWidth=.6; c.stroke();
 } else if(av.helm==='open'){
  c.beginPath(); c.moveTo(hx+3.2,hy-2.6); c.arc(hx,hy,4.7,-.7,Math.PI*.62,true); c.lineTo(hx+.6,hy+3.8); c.quadraticCurveTo(hx+1.4,hy-.4,hx+3.2,hy-2.6); c.closePath(); c.fill();
  c.fillStyle='#2a2c33'; rrp(c,hx+2,hy-1.4,3,1.9,.8); c.fill();   // goggles
  c.fillStyle='rgba(255,170,60,.55)'; c.fillRect(hx+2.6,hy-1,1.8,1);
 } else {
  c.beginPath(); c.arc(hx,hy-.2,4.6,Math.PI*1.04,Math.PI*1.96); c.closePath(); c.fill();
  c.beginPath(); c.moveTo(hx+1.6,hy-.6); c.lineTo(hx+5.4,hy-.3); c.strokeStyle=G.shade(HC,.6); c.lineWidth=.9; c.stroke();
  c.beginPath(); c.moveTo(hx+1,hy+.2); c.lineTo(hx+4.6,hy+.5); c.strokeStyle='#17120c'; c.lineWidth=1.3; c.stroke();   // shades
 }
 if(av.gender==='f'&&av.helm!=='full'){
  c.beginPath(); c.ellipse(hx+3.7,hy+3,.95,.6,-.15,0,7); c.fillStyle='#c8385a'; c.fill();   // lips
  c.beginPath(); c.arc(hx+.7,hy+2.5,.75,0,7); c.fillStyle='#ffd25a'; c.fill();             // earring
 }
 // club stripe
 c.beginPath(); c.arc(hx,hy-.2,4.7,-2.2,-1.2); c.strokeStyle='rgba(255,120,40,.95)'; c.lineWidth=1.1; c.stroke();
}
function rider(c,av,R){
 const J=av.jacket||'#26262f', f=av.gender==='f';
 // leg + boot
 limb(c,R.hip,[(R.hip[0]+R.knee[0])/2+.5,R.knee[1]-1.2],R.knee,'#2e3650',4.4);
 limb(c,R.knee,[(R.knee[0]+R.foot[0])/2,(R.knee[1]+R.foot[1])/2],R.foot,'#2b3249',4);
 c.beginPath(); c.moveTo(R.foot[0]-1.4,R.foot[1]+.6); c.lineTo(R.foot[0]+4.6,R.foot[1]+.8); c.strokeStyle='#15131b'; c.lineWidth=3.2; c.stroke();
 // torso, vest trim, back patch
 const T=torso(c,R.hip,R.sh,J,f);
 c.beginPath(); c.moveTo(R.hip[0]+T.n[0]*1.2,R.hip[1]+T.n[1]*1.2); c.lineTo(R.sh[0]+T.n[0]*1.4,R.sh[1]+T.n[1]*1.4); c.strokeStyle='#f07818'; c.lineWidth=1.1; c.stroke();
 c.beginPath(); c.arc(R.sh[0]+T.n[0]*2.6-T.d[0]*3,R.sh[1]+T.n[1]*2.6-T.d[1]*3,1.25,0,7); c.fillStyle='#f07818'; c.fill();
 // arm to the bars
 const sh=[R.sh[0]-T.n[0]*.6,R.sh[1]-T.n[1]*.6], el=[(sh[0]+R.hand[0])/2,(sh[1]+R.hand[1])/2+1.6];
 limb(c,sh,el,R.hand,J,3.4);
 c.beginPath(); c.arc(R.hand[0]+.4,R.hand[1],1.8,0,7); c.fillStyle='#15131b'; c.fill();
 // head
 const hd=R.head;
 head(c,av,hd[0],hd[1]);
}
function passenger(c,av,p){
 const PJ='#3a2d44';
 limb(c,p.hip,[p.hip[0]+3,p.hip[1]+3],[p.hip[0]+5,p.hip[1]+9],'#2b3249',3.6);
 torso(c,p.hip,p.sh,PJ,true,2.6,3);
 c.beginPath(); c.arc(p.head[0],p.head[1],4.1,0,7); c.fillStyle='#2b2b34'; c.fill();
 c.beginPath(); c.arc(p.head[0]+1.6,p.head[1]+.8,2.1,.5,2.4); c.fillStyle='#e0b58c'; c.fill();
 c.beginPath(); c.moveTo(p.head[0]+1,p.head[1]-1.4); c.arc(p.head[0],p.head[1],4.1,-.6,.9); c.strokeStyle='rgba(160,210,240,.85)'; c.lineWidth=1.4; c.stroke();
}
AV.draw=function(c,x,y,sc,av){
 av=AV.norm(av||G.save.avatar);
 c.save(); c.translate(x,y); c.scale(sc,sc); c.lineJoin='round'; c.lineCap='round';
 const long=av.type==='chopper'?36:33;
 c.beginPath(); c.ellipse(av.type==='chopper'?38:36,43.5,long,3.4,0,0,7); c.fillStyle='rgba(0,0,0,.4)'; c.fill();
 const K=kit(c,av.body);
 // draw the bike into an offscreen order: everything but the riders first
 const R=BIKES[av.type](c,K,av);
 if(av.seat===2) passenger(c,av,R.p);
 rider(c,av,R);
 c.restore();
};

/* ---------------------------------------------------------------- top-down ---------------------------------------------------------------- */
AV.top=function(c,x,y,avIn,s,opts){
 opts=opts||{};
 const av=AV.norm(avIn), B=av.body, t=av.type, trike=t==='trike';
 const rr=(x,y,w,h,r)=>{ rrp(c,x,y,w,h,r); c.fill(); };
 c.save(); c.translate(x,y); if(opts.rot) c.rotate(opts.rot); c.scale(s,s);
 const len=t==='chopper'?1.18:1;
 if(!opts.noShadow){ c.fillStyle='rgba(0,0,0,.35)'; c.beginPath(); c.ellipse(2.5,3,trike?14:(t==='adv'?12:9.5),21*len,0,0,7); c.fill(); }
 if(opts.beam){
  const g=c.createLinearGradient(0,-22,0,-64); g.addColorStop(0,'rgba(255,230,150,.26)'); g.addColorStop(1,'rgba(255,230,150,0)');
  c.fillStyle=g; c.beginPath(); c.moveTo(-4,-22*len); c.lineTo(-15,-64); c.lineTo(15,-64); c.lineTo(4,-22*len); c.fill();
 }
 const gB=c.createLinearGradient(-11,0,11,0); gB.addColorStop(0,G.shade(B,.55)); gB.addColorStop(.5,G.shade(B,1.3)); gB.addColorStop(1,G.shade(B,.55));
 c.fillStyle='#16151b';
 // tires
 if(t==='chopper'){ rr(-2,-31,4,12,2); c.strokeStyle=CH; c.lineWidth=1.3; c.beginPath(); c.moveTo(-1.8,-24); c.lineTo(-1.2,-14); c.moveTo(1.8,-24); c.lineTo(1.2,-14); c.stroke(); }
 else rr(t==='sport'?-2.4:-2.6,-24,t==='sport'?4.8:5.2,12,2.4);
 if(trike){ rr(-13.5,8,5,12,2.2); rr(8.5,8,5,12,2.2); } else rr(t==='chopper'?-3.4:-2.9,10,t==='chopper'?6.8:5.8,13,2.7);
 c.fillStyle=gB;
 if(trike){ rr(-11,3,22,15,4); c.fillStyle='rgba(255,255,255,.2)'; c.fillRect(-9,5.5,18,1.6); c.fillStyle=gB; }
 else if(t==='bagger'){ rr(-10,5,5.2,11.5,2.2); rr(4.8,5,5.2,11.5,2.2); }
 else if(t==='adv'){ c.fillStyle='#b9bfc8'; rr(-12.6,4,6,13,1.4); rr(6.6,4,6,13,1.4); c.fillStyle=gB; }
 else if(t==='chopper'){ c.strokeStyle=CH; c.lineWidth=1.4; c.beginPath(); c.moveTo(-3,15); c.lineTo(-3,9); c.lineTo(3,9); c.lineTo(3,15); c.stroke(); c.fillStyle=gB; }
 // body
 if(t==='sport'){ c.beginPath(); c.moveTo(0,-23); c.lineTo(5.6,-12); c.lineTo(4.6,6); c.lineTo(0,15); c.lineTo(-4.6,6); c.lineTo(-5.6,-12); c.closePath(); c.fill(); }
 else if(t==='chopper'){ rr(-3.6,-15,7.2,22,3.4); }
 else rr(-5,-15,10,25,4.5);
 c.fillStyle='rgba(255,255,255,.35)'; rr(-1.2,-13,2.4,9,1.2);
 // front: fairing / headlight / beak
 if(t==='bagger'||trike){
  c.fillStyle=gB; c.beginPath(); c.ellipse(0,-14.5,9,4.6,0,Math.PI,2*Math.PI); c.fill();
  c.fillStyle='rgba(175,218,240,.9)'; c.beginPath(); c.ellipse(0,-15.6,7,2.5,0,Math.PI,2*Math.PI); c.fill();
 } else if(t==='adv'){
  c.fillStyle=gB; c.beginPath(); c.moveTo(-4,-15); c.lineTo(0,-25); c.lineTo(4,-15); c.closePath(); c.fill();
  c.fillStyle='rgba(175,218,240,.9)'; c.beginPath(); c.ellipse(0,-15.4,5.2,2.2,0,Math.PI,2*Math.PI); c.fill();
 } else if(t==='sport'){
  c.fillStyle='rgba(60,80,104,.95)'; c.beginPath(); c.ellipse(0,-15.4,3.6,2,0,Math.PI,2*Math.PI); c.fill();
 } else {
  c.fillStyle=CH; c.beginPath(); c.arc(0,t==='chopper'?-17:-16.4,2.4,0,7); c.fill();
 }
 // bars
 c.strokeStyle='#2a2a32'; c.lineWidth=2; c.lineCap='round'; c.beginPath();
 if(t==='sport'){ c.moveTo(-6,-10.5); c.lineTo(6,-10.5); }
 else if(t==='chopper'){ c.strokeStyle=CH; c.lineWidth=1.6; c.moveTo(-11,-12); c.lineTo(-9,-17); c.lineTo(9,-17); c.lineTo(11,-12); }
 else if(t==='adv'){ c.moveTo(-11.5,-10.5); c.lineTo(11.5,-10.5); }
 else { c.moveTo(-10.5,-10); c.lineTo(10.5,-10); }
 c.stroke();
 // rider: arms, jacket, hair, helmet
 const J=av.jacket||'#26262f', HC=AV.helmCol(av), hy=t==='sport'?-6:(t==='chopper'?-1.6:-3);
 c.strokeStyle=J; c.lineWidth=2.6; c.beginPath();
 if(t==='chopper'){ c.moveTo(-5.5,-2); c.lineTo(-10,-11); c.moveTo(5.5,-2); c.lineTo(10,-11); }
 else if(t==='sport'){ c.moveTo(-5,-4); c.lineTo(-6,-10); c.moveTo(5,-4); c.lineTo(6,-10); }
 else { c.moveTo(-5.5,-3); c.lineTo(-9.5,-9.5); c.moveTo(5.5,-3); c.lineTo(9.5,-9.5); }
 c.stroke();
 const fw=av.gender==='f'?6.4:7.5;
 c.fillStyle=J; c.beginPath(); c.ellipse(0,t==='sport'?-2.6:-.5,fw,5.4,0,0,7); c.fill();
 c.strokeStyle='#f07818'; c.lineWidth=1.3; c.beginPath(); c.ellipse(0,t==='sport'?-2.6:-.5,fw,5.4,0,.25,Math.PI-.25); c.stroke();
 c.fillStyle=av.hair;
 if(av.style==='long'){ c.beginPath(); c.moveTo(-3.6,hy+1.6); c.quadraticCurveTo(-4.6,hy+8.6,0,hy+10.6); c.quadraticCurveTo(4.6,hy+8.6,3.6,hy+1.6); c.closePath(); c.fill(); }
 else if(av.style==='pony'){ c.beginPath(); c.ellipse(0,hy+6.4,1.6,3.2,0,0,7); c.fill(); }
 else if(av.style==='braids'){ c.fillRect(-2.2,hy+3,1.3,5.4); c.fillRect(.9,hy+3,1.3,5.4); }
 c.fillStyle=HC; c.beginPath(); c.arc(0,hy,4.4,0,7); c.fill();
 c.strokeStyle='rgba(0,0,0,.3)'; c.lineWidth=.7; c.stroke();
 c.fillStyle='rgba(255,140,50,.95)'; c.fillRect(-.7,hy-4.3,1.4,8.4);
 if(av.seat===2){
  c.fillStyle='#3a2d44'; c.beginPath(); c.ellipse(0,7.2,6.6,4.6,0,0,7); c.fill();
  c.fillStyle='#2b2b34'; c.beginPath(); c.arc(0,6.2,3.9,0,7); c.fill();
 }
 c.restore();
};
window.AV=AV;

/* ============================ BUILDER (portrait) ============================ */
const TABS=['BIKE','RIDER','GEAR'];
const lum=h=>{ const n=parseInt(String(h).slice(1),16); return .299*((n>>16)&255)+.587*((n>>8)&255)+.114*(n&255); };
G.scenes.builder={
 enter(a){
  a=a||{};
  this.back=a.back||'club';
  this.next=a.next||null;
  this.draft=!!a.draft; // account-creation mode: writes to the wizard, not the save
  const av=(this.draft&&G.wiz&&G.wiz.data.avatar)||G.save.avatar;
  this.av=AV.norm(JSON.parse(JSON.stringify(av||{})));
  // a hair style that isn't the default for the rider was picked on purpose: keep it when MALE/FEMALE flips
  this.touchedHair=this.av.style!==(this.av.gender==='f'?'long':'short'); this.touchedFace=this.av.face!=='none';
  if(this.tab==null) this.tab=0;
  this.st={f:0}; this.spin=0; this.flash=0;
 },
 L(){
  const VH=G.VH, ex=Math.max(0,VH-480);
  const stageY=48, stageH=Math.round(118+ex*.8);
  const tabY=stageY+stageH+8;
  return {stageY,stageH,tabY,top:tabY+38,doneY:VH-54};
 },
 rows(){
  const L=this.L(), R=[]; let y=L.top;
  const add=(o,h)=>{ o.y=y; o.h=h; R.push(o); y+=h+8; };
  if(this.tab===0){
   add({k:'type',kind:'grid',label:'STYLE',list:AV.TYPES},88);
   add({k:'body',kind:'sw',label:'PAINT',list:AV.PAINTS,rows:2},58);
   add({k:'seat',kind:'seg',label:'SEATS',list:[[1,'SOLO'],[2,'TWO-UP']]},28);
  } else if(this.tab===1){
   add({k:'gender',kind:'seg',label:'RIDER',list:[['m','MALE'],['f','FEMALE']]},28);
   add({k:'skin',kind:'sw',label:'SKIN',list:AV.SKINS},28);
   add({k:'style',kind:'chips',label:'HAIR',list:AV.STYLES},28);
   add({k:'hair',kind:'sw',label:'COLOR',list:AV.HAIRS},28);
   add({k:'face',kind:'chips',label:'FACE',list:AV.FACES},28);
  } else {
   add({k:'helm',kind:'chips',label:'HELMET',list:AV.HELMS},28);
   add({k:'hcol',kind:'sw',label:'COLOR',list:AV.HCOLS},28);
   add({k:'jacket',kind:'sw',label:'JACKET',list:AV.JACKETS},28);
  }
  return R;
 },
 /* the tappable pieces of a row: [{v, x,y,w,h}] */
 parts(r){
  const X=74, W=184, out=[];
  if(r.kind==='grid'){
   const cols=3, gw=(254-8)/cols, gh=(r.h-6)/2;
   r.list.forEach((e,i)=>out.push({v:e[0],label:e[1],x:8+(i%cols)*(gw+4),y:r.y+Math.floor(i/cols)*(gh+6),w:gw,h:gh}));
  } else if(r.kind==='seg'||r.kind==='chips'){
   const n=r.list.length, gap=r.kind==='seg'?0:4, w=(W-gap*(n-1))/n;
   r.list.forEach((e,i)=>out.push({v:e[0],label:e[1],x:X+i*(w+gap),y:r.y,w,h:r.h}));
  } else {
   const per=r.rows===2?Math.ceil(r.list.length/2):r.list.length, pitch=W/per;
   r.list.forEach((e,i)=>{ const row=Math.floor(i/per), col=i%per; out.push({v:e[1],label:e[0],x:X+col*pitch,y:r.y+row*30,w:pitch,h:28}); });
  }
  return out;
 },
 finish(){
  AUDIO.sfx('cheer');
  if(this.draft){
   if(G.wiz){ G.wiz.data.avatar=this.av; G.wiz.step=(G.SIGNUP&&G.SIGNUP.pin)||7; }
   G.go('createacct',{},true); // enter now so this tap can open the phone keypad
  } else {
   G.save.avatar=this.av; G.persist();
   G.go(this.next||this.back,{},this.next==='name');
  }
 },
 goBack(){
  if(this.draft){ if(G.wiz){ G.wiz.data.avatar=this.av; G.wiz.step=(G.SIGNUP&&G.SIGNUP.photo)||6; } G.go('createacct',{},true); }
  else G.go(this.back);
 },
 set(k,v){
  if(this.av[k]===v) return;
  this.av[k]=v;
  if(k==='gender'&&v==='f'&&this.av.face!=='none'&&!this.touchedFace) this.av.face='none';
  if(k==='gender'&&!this.touchedHair) this.av.style=v==='f'?'long':'short';
  if(k==='face') this.touchedFace=true;
  if(k==='style') this.touchedHair=true;
  this.flash=1; AUDIO.sfx(k==='type'?'rev':'blip');
 },
 cycle(r,d){
  const P=this.parts(r), cur=P.findIndex(p=>p.v===this.av[r.k]);
  const n=P[((cur<0?0:cur)+d+P.length)%P.length]; this.set(r.k,n.v);
 },
 doneBtn(){
  const L=this.L();
  const label=this.draft?'NEXT: SET YOUR PIN':(this.next==='name'?'NEXT: ROAD NAME':'SAVE MY RIDE');
  return {id:'done',label,kind:'primary',x:22,y:L.doneY,w:226,h:44,size:9};
 },
 title(){
  const a=this.av, pn=(AV.PAINTS.find(p=>p[1]===a.body)||['CUSTOM'])[0];
  return pn+' '+(a.seat===2?'TWO-UP ':'')+AV.typeName(a.type);
 },
 update(dt){
  this.spin+=dt; if(this.flash>0) this.flash=Math.max(0,this.flash-dt*2.5);
  if(G.backHit()){ this.goBack(); return; }
  const L=this.L(), st=this.st, R=this.rows(), n=R.length+1;   // rows + done
  // tabs
  const t=G.segHit(8,L.tabY,254,30,3);
  if(t>=0&&t!==this.tab){ this.tab=t; st.f=0; AUDIO.sfx('tick'); return; }
  // keyboard: up/down = row, left/right = value, enter = next value / done; [ and ] switch tabs
  if(G.pressed.up){ st.f=(st.f+n-1)%n; AUDIO.sfx('tick'); }
  if(G.pressed.down){ st.f=(st.f+1)%n; AUDIO.sfx('tick'); }
  if(st.f<R.length){ if(G.pressed.left) this.cycle(R[st.f],-1); if(G.pressed.right) this.cycle(R[st.f],1); }
  if(G.pressed.a){ if(st.f===R.length){ this.finish(); return; } this.cycle(R[st.f],1); }
  // taps
  R.forEach((r,ri)=>{ for(const p of this.parts(r)) if(G.clicked(p.x,p.y,p.w,p.h)){ st.f=ri; this.set(r.k,p.v); } });
  const d=this.doneBtn();
  if(G.clicked(d.x,d.y,d.w,d.h)){ st.f=R.length; this.finish(); }
 },
 drawStage(c,L){
  const sy=L.stageY, sh=L.stageH, a=this.av;
  G.panel(8,sy,VW-16,sh,{border:'rgba(255,170,90,.35)'});
  c.save(); G.rrect(8,sy,VW-16,sh,12); c.clip();
  // showroom: spotlight cone, warm glow, polished floor with a reflection
  const floor=sy+sh-30;
  c.fillStyle='#120e14'; c.fillRect(8,sy,VW-16,sh);
  const cone=c.createLinearGradient(0,sy,0,floor); cone.addColorStop(0,'rgba(255,214,150,.22)'); cone.addColorStop(1,'rgba(255,214,150,.04)');
  c.fillStyle=cone; c.beginPath(); c.moveTo(VW/2-24,sy); c.lineTo(VW/2+24,sy); c.lineTo(VW/2+112,floor); c.lineTo(VW/2-112,floor); c.closePath(); c.fill();
  const g=c.createRadialGradient(VW/2,floor-30,8,VW/2,floor-30,sh*.85); g.addColorStop(0,'rgba(255,150,60,'+(.2+this.flash*.25)+')'); g.addColorStop(1,'rgba(255,150,60,0)');
  c.fillStyle=g; c.fillRect(8,sy,VW-16,sh);
  const fg=c.createLinearGradient(0,floor,0,sy+sh); fg.addColorStop(0,'#2a2028'); fg.addColorStop(1,'#141016'); c.fillStyle=fg; c.fillRect(8,floor,VW-16,sy+sh-floor);
  c.fillStyle='rgba(255,160,80,.35)'; c.fillRect(8,floor,VW-16,1);
  const sc=Math.min(2.9,(sh-40)/48), bw=72*sc, bx=VW/2-bw/2-(a.type==='chopper'?2*sc:0), by=floor-44*sc;
  const bob=G.rm()?0:Math.sin(this.spin*3)*1;
  // reflection
  c.save(); c.beginPath(); c.rect(8,floor,VW-16,sy+sh-floor); c.clip();
  c.globalAlpha=.16; c.translate(0,floor*2+1); c.scale(1,-1); AV.draw(c,bx,by,sc,a); c.restore();
  AV.draw(c,bx,by+bob,sc,a);
  // a light sweep across the paint when something changes
  if(this.flash>0&&!G.rm()){ const fx=VW/2-140+(1-this.flash)*280; const sw=c.createLinearGradient(fx-30,0,fx+30,0); sw.addColorStop(0,'rgba(255,255,255,0)'); sw.addColorStop(.5,'rgba(255,255,255,'+(.22*this.flash)+')'); sw.addColorStop(1,'rgba(255,255,255,0)'); c.fillStyle=sw; c.fillRect(8,sy,VW-16,floor-sy); }
  c.restore();
  G.txt(this.title(),VW/2,sy+sh-21,7.5,'#ffd060','center',VW-40,800);
 },
 draw(c){
  const VH=G.VH, L=this.L(), a=this.av, st=this.st;
  G.cover(G.img.bg_dining,0,0,VW,VH); G.dim(.84);
  G.topBar('BUILD YOUR RIDE',{right:this.draft?'STEP '+((G.SIGNUP&&G.SIGNUP.builder)||8)+'/'+((G.SIGNUP&&G.SIGNUP.total)||10):null});
  this.drawStage(c,L);
  G.seg(8,L.tabY,254,30,TABS,this.tab,7.8);
  const R=this.rows();
  R.forEach((r,ri)=>{
   const foc=st.f===ri&&G.kbMode, P=this.parts(r), val=a[r.k];
   if(r.kind!=='grid') G.txt(r.label,14,r.y+(r.h-7*1.3)/2,7,foc?'#ffd060':'#b8ad9c','left',58,700);
   if(r.kind==='grid'){
    P.forEach(p=>{
     const on=p.v===val, press=G.held(p.x,p.y,p.w,p.h);
     G.rrect(p.x,p.y+(press?1:0),p.w,p.h,10); c.fillStyle=on?'rgba(240,120,24,.22)':'rgba(30,28,40,.92)'; c.fill();
     c.strokeStyle=on?'#ffb050':'rgba(255,255,255,.12)'; c.lineWidth=on?1.6:1; c.stroke();
     const s2=Math.min(.52,(p.h-12)/48);
     AV.draw(c,p.x+p.w/2-36*s2,p.y+3+(press?1:0),s2,Object.assign({},a,{type:p.v,seat:1}));
     G.txt(p.label,p.x+p.w/2,p.y+p.h-10,5.8,on?'#ffd060':'#e0d6c4','center',p.w-6,800);
    });
    if(foc){ G.rrect(5,r.y-3,VW-10,r.h+6,12); c.strokeStyle='#ffd060'; c.lineWidth=1.5; c.stroke(); }
   } else if(r.kind==='seg'){
    G.seg(74,r.y,184,r.h,r.list.map(e=>e[1]),r.list.findIndex(e=>e[0]===val),7.2);
    if(foc){ G.rrect(71,r.y-3,190,r.h+6,(r.h+6)/2); c.strokeStyle='#ffd060'; c.lineWidth=2; c.stroke(); }
   } else if(r.kind==='chips'){
    P.forEach(p=>{
     const on=p.v===val;
     G.rrect(p.x,p.y,p.w,p.h,p.h/2);
     if(on){ const g=c.createLinearGradient(0,p.y,0,p.y+p.h); g.addColorStop(0,'#ffa040'); g.addColorStop(1,'#e46c10'); c.fillStyle=g; } else c.fillStyle='rgba(255,255,255,.07)';
     c.fill(); c.strokeStyle=on?'#ffb050':'rgba(255,255,255,.14)'; c.lineWidth=1; c.stroke();
     G.txt(p.label,p.x+p.w/2,p.y+(p.h-6.2*1.3)/2,6.2,on?'#16100a':'#d8cebe','center',p.w-6,800);
    });
    if(foc){ G.rrect(71,r.y-3,190,r.h+6,(r.h+6)/2); c.strokeStyle='#ffd060'; c.lineWidth=2; c.stroke(); }
   } else {
    P.forEach(p=>{
     const on=p.v===val, cx=p.x+p.w/2, cy=p.y+p.h/2, rad=Math.min(11,p.w/2-3), col=p.v==='match'?a.body:p.v;
     if(on){ c.save(); if(!G.rm()){ c.shadowColor='#ff8c2a'; c.shadowBlur=10; } c.beginPath(); c.arc(cx,cy,rad+3.2,0,7); c.strokeStyle='#ffb050'; c.lineWidth=2.4; c.stroke(); c.restore(); }
     c.beginPath(); c.arc(cx,cy,rad,0,7);
     const gg=c.createLinearGradient(0,cy-rad,0,cy+rad); gg.addColorStop(0,G.shade(col,1.35)); gg.addColorStop(1,G.shade(col,.75));
     c.fillStyle=gg; c.fill(); c.strokeStyle='rgba(0,0,0,.5)'; c.lineWidth=1; c.stroke();
     if(p.v==='match'){ G.txt('BIKE',cx,cy-3,4.6,G.shade(col,.3),'center',rad*2,800); }
     else if(on){ c.strokeStyle=lum(col)>165?'#16100a':'#fff'; c.lineWidth=2; c.beginPath(); c.moveTo(cx-4.4,cy); c.lineTo(cx-1.2,cy+3.2); c.lineTo(cx+4.8,cy-3.6); c.stroke(); }
    });
    const nm=(r.list.find(e=>e[1]===val)||[''])[0];
    if(r.rows===2) G.txt(nm,14,r.y+r.h-8,6,'#e8dcc8','left',58,700);
    if(foc){ G.rrect(71,r.y-3,190,r.h+6,12); c.strokeStyle='#ffd060'; c.lineWidth=1.5; c.stroke(); }
   }
  });
  G.button(this.doneBtn(),st.f===R.length);
 }
};
})();
