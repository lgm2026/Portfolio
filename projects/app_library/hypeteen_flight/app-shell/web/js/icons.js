/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* ICONS: simple vector icons drawn on the canvas. G.icon(name, ctx, centerX, centerY, size, color)
   Add a new one by adding a `case` (draw it on a 20x20 grid centered on 0,0). */
(function(){
function star5(c,cx,cy,R,r){ c.beginPath(); for(let i=0;i<10;i++){ const q=i%2?r:R, a=-Math.PI/2+i*Math.PI/5; c.lineTo(cx+Math.cos(a)*q,cy+Math.sin(a)*q); } c.closePath(); c.fill(); }
G.icon=function(name,c,cx,cy,s,col){
 c.save(); c.translate(cx,cy); const k=s/20; c.scale(k,k);
 c.fillStyle=col; c.strokeStyle=col; c.lineWidth=2.2; c.lineCap='round'; c.lineJoin='round';
 const B=()=>c.beginPath();
 switch(name){
  case 'road':
   B(); c.moveTo(-3,-9); c.lineTo(-9,9); c.moveTo(3,-9); c.lineTo(9,9); c.stroke();
   c.lineWidth=2; B(); c.moveTo(0,-7); c.lineTo(0,-3.5); c.moveTo(0,0); c.lineTo(0,3.5); c.moveTo(0,7); c.lineTo(0,9.5); c.stroke(); break;
  case 'wrench':
   c.rotate(-Math.PI/4); c.lineWidth=3.4; B(); c.moveTo(0,-1); c.lineTo(0,10); c.stroke();
   c.lineWidth=2.8; B(); c.arc(0,-5.5,5,-0.25*Math.PI,1.25*Math.PI,false); c.stroke(); break;
  case 'joy':
   G.rrect(-9,3,18,7,3); c.fill(); c.lineWidth=2.6; B(); c.moveTo(0,4); c.lineTo(0,-4); c.stroke();
   B(); c.arc(0,-6.5,4,0,7); c.fill(); break;
  case 'heart':
   B(); c.moveTo(0,8); c.bezierCurveTo(-12,0,-7,-11,0,-4); c.bezierCurveTo(7,-11,12,0,0,8); c.fill(); break;
  case 'trophy':
   B(); c.moveTo(-6,-8); c.lineTo(6,-8); c.lineTo(5,-1); c.quadraticCurveTo(0,5,-5,-1); c.closePath(); c.fill();
   c.lineWidth=1.8; B(); c.arc(-7,-4.5,3,Math.PI*.5,Math.PI*1.5); c.stroke(); B(); c.arc(7,-4.5,3,-Math.PI*.5,Math.PI*.5); c.stroke();
   c.fillRect(-1.5,2,3,5); c.fillRect(-6,7,12,2.6); break;
  case 'star':
   B(); for(let i=0;i<10;i++){ const r=i%2?4.2:9.5, a=-Math.PI/2+i*Math.PI/5; c.lineTo(Math.cos(a)*r,Math.sin(a)*r); } c.closePath(); c.fill(); break;
  case 'music':
   c.lineWidth=2; B(); c.moveTo(-3,5); c.lineTo(-3,-8); c.lineTo(7,-10); c.lineTo(7,3); c.stroke();
   B(); c.ellipse(-5.5,5.5,3.4,2.6,-.3,0,7); c.fill(); B(); c.ellipse(4.5,3.5,3.4,2.6,-.3,0,7); c.fill(); break;
  case 'gauge':
   c.lineWidth=2.4; B(); c.arc(0,4,9,Math.PI,2*Math.PI); c.stroke();
   B(); c.moveTo(0,4); c.lineTo(5.5,-3); c.stroke(); B(); c.arc(0,4,2.2,0,7); c.fill(); break;
  case 'chat':
   c.lineWidth=2; G.rrect(-10,-8,20,13,4); c.stroke();
   B(); c.moveTo(-4,5); c.lineTo(-6,10); c.lineTo(1,5); c.stroke();
   for(const dx of [-5,0,5]){ B(); c.arc(dx,-1.5,1.4,0,7); c.fill(); } break;
  case 'gear':
   for(let i=0;i<8;i++){ c.save(); c.rotate(i*Math.PI/4); c.fillRect(-1.8,-10,3.6,4); c.restore(); }
   c.lineWidth=3; B(); c.arc(0,0,6,0,7); c.stroke(); B(); c.arc(0,0,1.6,0,7); c.fill(); break;
  case 'lock':
   G.rrect(-6,-1,12,9,2); c.fill(); c.lineWidth=2.2; B(); c.arc(0,-2,4,Math.PI,2*Math.PI); c.stroke(); break;
  case 'chevrons':   // rank insignia
   c.lineWidth=2.6; for(const yy of [-5.5,0.5,6.5]){ B(); c.moveTo(-8,yy+3.5); c.lineTo(0,yy-3); c.lineTo(8,yy+3.5); c.stroke(); } break;
  case 'medal':      // a medal
   B(); c.moveTo(-7,-10); c.lineTo(-2,-10); c.lineTo(1,-3); c.lineTo(-3,-1.5); c.closePath(); c.fill();
   B(); c.moveTo(7,-10); c.lineTo(2,-10); c.lineTo(-1,-3); c.lineTo(3,-1.5); c.closePath(); c.fill();
   c.lineWidth=2; B(); c.arc(0,4,6.2,0,7); c.stroke(); star5(c,0,4,3.6,1.6); break;
  case 'user':
   B(); c.arc(0,-4,4.5,0,7); c.fill(); B(); c.arc(0,10,8,Math.PI,2*Math.PI); c.fill(); break;
  case 'cards':
   c.lineWidth=1.8; c.save(); c.rotate(-.25); G.rrect(-8,-8,10,14,2); c.stroke(); c.restore();
   c.save(); c.rotate(.2); G.rrect(-1,-7,10,14,2); c.fill(); c.restore(); break;
  case 'flag':
   c.lineWidth=2; B(); c.moveTo(-7,10); c.lineTo(-7,-10); c.stroke();
   B(); c.moveTo(-7,-9); c.lineTo(8,-6); c.lineTo(-7,-1); c.closePath(); c.fill(); break;
  case 'play':
   B(); c.moveTo(-5,-8); c.lineTo(8,0); c.lineTo(-5,8); c.closePath(); c.fill(); break;
  case 'roster':
   c.lineWidth=2; G.rrect(-10,-8,20,16,3); c.stroke();
   B(); c.arc(-4.5,-2.2,2.6,0,7); c.fill(); B(); c.arc(-4.5,5.6,4.4,Math.PI,2*Math.PI); c.fill();
   c.fillRect(1,-3.6,6.5,2); c.fillRect(1,0.4,6.5,2); c.fillRect(1,4.4,4.5,2); break;
  case 'megaphone':
   B(); c.moveTo(-9,-3.5); c.lineTo(-3,-3.5); c.lineTo(7,-9.5); c.lineTo(7,9.5); c.lineTo(-3,3.5); c.lineTo(-9,3.5); c.closePath(); c.fill();
   c.lineWidth=2.2; B(); c.moveTo(-6.5,4); c.lineTo(-4.5,9.5); c.stroke(); B(); c.arc(8,0,3,-Math.PI/2.4,Math.PI/2.4); c.stroke(); break;
  case 'wallet':
   c.lineWidth=2; G.rrect(-10,-7,20,15,3); c.stroke(); B(); c.moveTo(-10,-2.5); c.lineTo(10,-2.5); c.stroke();
   G.rrect(3,0.5,7,4.5,1.5); c.fill(); break;
  case 'bag':   // outlined shopping bag (a solid one reads as a padlock)
   c.lineWidth=2; B(); c.moveTo(-8,-3); c.lineTo(8,-3); c.lineTo(9.5,10); c.lineTo(-9.5,10); c.closePath(); c.stroke();
   c.lineWidth=1.8; B(); c.moveTo(-4,-3); c.lineTo(-4,-5); c.arc(0,-5,4,Math.PI,2*Math.PI); c.lineTo(4,-3); c.stroke();
   B(); c.arc(0,2,3.6,0.15*Math.PI,0.85*Math.PI); c.stroke(); break;
  case 'cal':        // calendar
   c.lineWidth=2; G.rrect(-9.5,-7,19,17,3); c.stroke(); c.fillRect(-9.5,-7,19,5);
   c.lineWidth=2.2; B(); c.moveTo(-5,-10); c.lineTo(-5,-5); c.moveTo(5,-10); c.lineTo(5,-5); c.stroke();
   for(const [dx,dy] of [[-5,2],[0,2],[5,2],[-5,6.5],[0,6.5]]) c.fillRect(dx-1.4,dy-1.4,2.8,2.8); break;
  case 'docs':       // a document
   c.lineWidth=2; B(); c.moveTo(-7.5,-10); c.lineTo(3,-10); c.lineTo(8,-5); c.lineTo(8,10); c.lineTo(-7.5,10); c.closePath(); c.stroke();
   c.lineWidth=1.6; B(); c.moveTo(3,-10); c.lineTo(3,-5); c.lineTo(8,-5); c.stroke();
   c.fillRect(-4.5,-2,9,1.9); c.fillRect(-4.5,2,9,1.9); c.fillRect(-4.5,6,5.5,1.9); break;
  case 'cam': case 'camera':   // a camera
   c.lineWidth=2; G.rrect(-10,-5.5,20,14.5,3); c.stroke(); c.fillRect(-4.5,-9,9,3.8);
   B(); c.arc(0,1.8,4.6,0,7); c.stroke(); B(); c.arc(0,1.8,1.7,0,7); c.fill(); c.fillRect(5.2,-3.4,2.6,2); break;
  case 'x':          // dismiss / close a sheet
   c.lineWidth=2.6; B(); c.moveTo(-6.5,-6.5); c.lineTo(6.5,6.5); c.moveTo(6.5,-6.5); c.lineTo(-6.5,6.5); c.stroke(); break;
  case 'close':      // two people ("close friends"; use 'x' for a dismiss button)
   B(); c.arc(-4.5,-4,3.6,0,7); c.fill(); B(); c.arc(-4.5,9.5,6.6,Math.PI,2*Math.PI); c.fill();
   c.lineWidth=1.6; B(); c.arc(5,-3,3.6,0,7); c.stroke(); B(); c.arc(5,10.2,6.6,Math.PI*1.08,Math.PI*1.92); c.stroke(); break;
  case 'info':
   c.lineWidth=2.2; B(); c.arc(0,0,9.5,0,7); c.stroke(); c.fillRect(-1.4,-1.5,2.8,7.5); B(); c.arc(0,-5,1.7,0,7); c.fill(); break;
  case 'grid':
   for(const [dx,dy] of [[-9,-9],[1,-9],[-9,1],[1,1]]){ G.rrect(dx,dy,8,8,2); c.fill(); } break;
  case 'link':
   c.lineWidth=2.4; c.rotate(-Math.PI/4); G.rrect(-10,-4,11,8,4); c.stroke(); G.rrect(-1,-4,11,8,4); c.stroke(); break;
  case 'home':
   B(); c.moveTo(-10,0); c.lineTo(0,-9); c.lineTo(10,0); c.lineTo(7,0); c.lineTo(7,9); c.lineTo(2,9); c.lineTo(2,3); c.lineTo(-2,3); c.lineTo(-2,9); c.lineTo(-7,9); c.lineTo(-7,0); c.closePath(); c.fill(); break;
  case 'plus':
   c.lineWidth=3; B(); c.moveTo(0,-8); c.lineTo(0,8); c.moveTo(-8,0); c.lineTo(8,0); c.stroke(); break;
  case 'list':
   for(const yy of [-7,0,7]){ B(); c.arc(-8,yy,1.8,0,7); c.fill(); c.fillRect(-4,yy-1.2,13,2.4); } break;
  case 'bell':
   B(); c.moveTo(-8,5); c.quadraticCurveTo(-6,3,-6,-2); c.quadraticCurveTo(-6,-9,0,-9); c.quadraticCurveTo(6,-9,6,-2); c.quadraticCurveTo(6,3,8,5); c.closePath(); c.fill();
   B(); c.arc(0,7,2.6,0,Math.PI); c.fill(); break;
  case 'pin':
   B(); c.arc(0,-3,7,Math.PI*.85,Math.PI*.15); c.lineTo(0,10); c.closePath(); c.fill();
   c.fillStyle='rgba(0,0,0,.45)'; B(); c.arc(0,-3,2.6,0,7); c.fill(); break;
  case 'search':
   c.lineWidth=2.4; B(); c.arc(-2,-2,6.5,0,7); c.stroke(); c.lineWidth=3; B(); c.moveTo(3,3); c.lineTo(9,9); c.stroke(); break;
  case 'check':
   c.lineWidth=3; B(); c.moveTo(-8,0); c.lineTo(-2.5,6); c.lineTo(8.5,-6); c.stroke(); break;
  case 'cloud':
   B(); c.arc(-4,2,5.5,0,7); c.arc(3,-1,7,0,7); c.arc(8,3,4.5,0,7); c.fill(); c.fillRect(-9,3,18,5); break;
  case 'headset':    // a pilot's headset with a boom mic
   c.lineWidth=2.4; B(); c.arc(0,1,8,Math.PI*1.08,Math.PI*1.92); c.stroke();
   G.rrect(-10,-1,5,9,2); c.fill(); G.rrect(5,-1,5,9,2); c.fill();
   c.lineWidth=1.8; B(); c.moveTo(-7.5,7); c.quadraticCurveTo(-7,10.5,-1,10); c.stroke(); B(); c.arc(0,10,1.8,0,7); c.fill(); break;
  case 'map':        // a folded chart
   B(); c.moveTo(-9,-7); c.lineTo(-3,-9); c.lineTo(3,-7); c.lineTo(9,-9); c.lineTo(9,7); c.lineTo(3,9); c.lineTo(-3,7); c.lineTo(-9,9); c.closePath(); c.stroke();
   c.lineWidth=1.6; B(); c.moveTo(-3,-9); c.lineTo(-3,7); c.moveTo(3,-7); c.lineTo(3,9); c.stroke(); break;
  case 'tower':      // a control tower: cab on a shaft
   B(); c.moveTo(-8,-6); c.lineTo(8,-6); c.lineTo(6,-1); c.lineTo(-6,-1); c.closePath(); c.fill();
   c.fillRect(-7,-9,14,2.4); c.fillRect(-2.6,-1,5.2,9); c.fillRect(-6,8,12,2.4);
   c.fillStyle='rgba(0,0,0,.45)'; c.fillRect(-5.5,-5,11,2.4); break;
  case 'book':       // an open book
   c.lineWidth=2; B(); c.moveTo(0,-7); c.bezierCurveTo(-3,-9,-7,-9,-10,-8); c.lineTo(-10,7); c.bezierCurveTo(-7,6,-3,6,0,8); c.bezierCurveTo(3,6,7,6,10,7); c.lineTo(10,-8); c.bezierCurveTo(7,-9,3,-9,0,-7); c.closePath(); c.stroke();
   B(); c.moveTo(0,-7); c.lineTo(0,8); c.stroke(); c.lineWidth=1.4; B(); c.moveTo(-7,-4); c.lineTo(-3,-3.5); c.moveTo(-7,0); c.lineTo(-3,.5); c.moveTo(3,-3.5); c.lineTo(7,-4); c.moveTo(3,.5); c.lineTo(7,0); c.stroke(); break;
  case 'drop':       // a water drop
   B(); c.moveTo(0,-10); c.bezierCurveTo(4,-4,8,0,8,4); c.arc(0,4,8,0,Math.PI); c.bezierCurveTo(-8,0,-4,-4,0,-10); c.fill(); break;
  case 'heli':       // a little helicopter, side view, nose right (r7.4)
   B(); c.ellipse(2.5,2,6.6,4.8,0,0,7); c.fill();
   c.lineWidth=2.2; B(); c.moveTo(-3,1.5); c.lineTo(-10,-.5); c.stroke();
   c.lineWidth=1.4; B(); c.arc(-10,-1.5,2.6,0,7); c.stroke();
   c.lineWidth=1.8; B(); c.moveTo(2.5,-2.5); c.lineTo(2.5,-6); c.moveTo(-9,-6.5); c.lineTo(10.5,-6.5); c.stroke();
   c.lineWidth=1.5; B(); c.moveTo(-1,6.4); c.lineTo(-1.6,8.6); c.moveTo(6,6.4); c.lineTo(6.6,8.6); c.moveTo(-4.5,8.8); c.lineTo(9.5,8.8); c.stroke(); break;
  case 'plane':      // a little airplane seen from above, nose up
   B(); c.moveTo(0,-10); c.quadraticCurveTo(2,-8,2,-3); c.lineTo(10,1); c.lineTo(10,3.5); c.lineTo(2,1.5); c.lineTo(1.6,6); c.lineTo(4.5,8.5); c.lineTo(4.5,10); c.lineTo(0,9); c.lineTo(-4.5,10); c.lineTo(-4.5,8.5); c.lineTo(-1.6,6); c.lineTo(-2,1.5); c.lineTo(-10,3.5); c.lineTo(-10,1); c.lineTo(-2,-3); c.quadraticCurveTo(-2,-8,0,-10); c.closePath(); c.fill(); break;
 }
 c.restore();
};
G.ICONS=['joy','heart','trophy','star','music','gauge','chat','gear','lock','chevrons','medal','user','cards','flag','play','roster','megaphone','wallet','bag','cal','docs','cam','close','wrench','road','info','grid','link','home','plus','list','bell','pin','search','check','cloud','plane','heli','book'];
})();
