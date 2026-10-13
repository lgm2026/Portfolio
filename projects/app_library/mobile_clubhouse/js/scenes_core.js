/* Title, tone, road name, clubhouse hub (portrait), route board, picnic, jukebox, credits. */
(function(){
const VW=270;

/* story progression helper — order-independent: tasks done early still count */
G.storyEvent=function(k){
 if(!G.save.done) G.save.done={};
 G.save.done[k]=1;
 const NEED={1:'garage',2:'r501',3:'benefit',4:'cornhole',5:'trivia6',6:'poker'};
 let adv=false;
 while(NEED[G.save.story]&&G.save.done[NEED[G.save.story]]){ G.save.story++; adv=true; }
 G.persist();
 if(adv&&!G.isInfo()) G.toast('NEXT: '+DATA.STORY[G.save.story].hint,'#80ffa0');
};

/* ---------- simple vector icons (tiles, buttons) ---------- */
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
  case 'slot':
   c.lineWidth=2; G.rrect(-10,-8,15,16,3); c.stroke();
   c.fillRect(-7.5,-3,2.6,6); c.fillRect(-3.8,-3,2.6,6); c.fillRect(-0.1,-3,2.6,6);
   B(); c.moveTo(9,4); c.lineTo(9,-4); c.stroke(); B(); c.arc(9,-6,2.4,0,7); c.fill(); break;
  case 'board':
   c.lineWidth=2; B(); c.moveTo(-7,9); c.lineTo(-5,-9); c.lineTo(5,-9); c.lineTo(7,9); c.closePath(); c.stroke();
   B(); c.arc(0,-3.5,2.8,0,7); c.fill(); break;
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
  case 'chevrons':   // rank insignia: official positions
   c.lineWidth=2.6; for(const yy of [-5.5,0.5,6.5]){ B(); c.moveTo(-8,yy+3.5); c.lineTo(0,yy-3); c.lineTo(8,yy+3.5); c.stroke(); } break;
  case 'medal':      // Brother for Life
   B(); c.moveTo(-7,-10); c.lineTo(-2,-10); c.lineTo(1,-3); c.lineTo(-3,-1.5); c.closePath(); c.fill();
   B(); c.moveTo(7,-10); c.lineTo(2,-10); c.lineTo(-1,-3); c.lineTo(3,-1.5); c.closePath(); c.fill();
   c.lineWidth=2; B(); c.arc(0,4,6.2,0,7); c.stroke(); star5(c,0,4,3.6,1.6); break;
  case 'offchat':    // the officers channel: a chat bubble with a star
   c.lineWidth=2; G.rrect(-10,-8,20,13,4); c.stroke();
   B(); c.moveTo(-4,5); c.lineTo(-6,10); c.lineTo(1,5); c.stroke(); star5(c,0,-1.5,4.4,1.9); break;
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
  case 'cup':        // pong: a cup and a ball
   B(); c.moveTo(-7.5,-5); c.lineTo(7.5,-5); c.lineTo(5.2,10); c.lineTo(-5.2,10); c.closePath(); c.fill();
   c.lineWidth=1.6; B(); c.moveTo(-8.5,-6.5); c.lineTo(8.5,-6.5); c.stroke();
   B(); c.arc(3.5,-10.5,2.8,0,7); c.fill(); break;
  case 'dart':       // a dartboard with a dart in it
   c.lineWidth=1.8; B(); c.arc(-1.5,1.5,8.5,0,7); c.stroke(); B(); c.arc(-1.5,1.5,4.4,0,7); c.stroke(); B(); c.arc(-1.5,1.5,1.5,0,7); c.fill();
   c.lineWidth=1.8; B(); c.moveTo(-1,1); c.lineTo(8,-8); c.stroke();
   B(); c.moveTo(8,-8); c.lineTo(11,-7); c.lineTo(9,-10.5); c.closePath(); c.fill(); break;
  case 'eight':      // an 8-ball
   c.lineWidth=2; B(); c.arc(0,0,9.5,0,7); c.stroke(); c.lineWidth=1.5;
   B(); c.arc(0,-2.2,2,0,7); c.stroke(); B(); c.arc(0,2.4,2.4,0,7); c.stroke(); break;
  case 'cal':        // calendar: ON THE HORIZON
   c.lineWidth=2; G.rrect(-9.5,-7,19,17,3); c.stroke(); c.fillRect(-9.5,-7,19,5);
   c.lineWidth=2.2; B(); c.moveTo(-5,-10); c.lineTo(-5,-5); c.moveTo(5,-10); c.lineTo(5,-5); c.stroke();
   for(const [dx,dy] of [[-5,2],[0,2],[5,2],[-5,6.5],[0,6.5]]) c.fillRect(dx-1.4,dy-1.4,2.8,2.8); break;
  case 'docs':       // ADMIN OFFICE: a document with a folded corner
   c.lineWidth=2; B(); c.moveTo(-7.5,-10); c.lineTo(3,-10); c.lineTo(8,-5); c.lineTo(8,10); c.lineTo(-7.5,10); c.closePath(); c.stroke();
   c.lineWidth=1.6; B(); c.moveTo(3,-10); c.lineTo(3,-5); c.lineTo(8,-5); c.stroke();
   c.fillRect(-4.5,-2,9,1.9); c.fillRect(-4.5,2,9,1.9); c.fillRect(-4.5,6,5.5,1.9); break;
  case 'cam': case 'camera':   // PHOTO ALBUM: a camera body, lens and flash
   c.lineWidth=2; G.rrect(-10,-5.5,20,14.5,3); c.stroke(); c.fillRect(-4.5,-9,9,3.8);
   B(); c.arc(0,1.8,4.6,0,7); c.stroke(); B(); c.arc(0,1.8,1.7,0,7); c.fill(); c.fillRect(5.2,-3.4,2.6,2); break;
  case 'close':      // WE'RE CLOSE: two riders side by side
   B(); c.arc(-4.5,-4,3.6,0,7); c.fill(); B(); c.arc(-4.5,9.5,6.6,Math.PI,2*Math.PI); c.fill();
   c.lineWidth=1.6; B(); c.arc(5,-3,3.6,0,7); c.stroke(); B(); c.arc(5,10.2,6.6,Math.PI*1.08,Math.PI*1.92); c.stroke(); break;
  case 'pot':
   G.rrect(-9,-3,18,11,3); c.fill(); c.fillRect(-11,-4,22,2.4);
   c.lineWidth=1.6; B(); c.moveTo(-3,-6); c.quadraticCurveTo(-5,-9,-3,-11); c.moveTo(3,-6); c.quadraticCurveTo(1,-9,3,-11); c.stroke(); break;
 }
 c.restore();
};

/* ============================ TITLE ============================ */
G.scenes.title={
 enter(){
  G.logout(); // the clubhouse door always asks for a PIN
  G.loadRoster();
  this.tick=0; this.st={f:0};
  AUDIO.play('radio');   // the clubhouse radio: KICKSTANDS UP first (keeps playing if it's already on)
 },
 layout(){
  const VH=G.VH;
  const cw=Math.min(190,150+(VH-480)*.4), ch=cw*1.068;
  const cy=30+(VH-480)*.15;
  const has=G.roster.accounts.length>0;
  const main=has
   ? [{id:'login',label:'LOG IN',sub:'MEMBERS & SUPPORTERS • NAME + PIN',kind:'primary',h:46},{id:'create',label:'CREATE ACCOUNT',h:40},{id:'guest',label:'PLAY AS GUEST',h:40}]
   : [{id:'create',label:'CREATE ACCOUNT',sub:'MEMBERS & SUPPORTERS START HERE',kind:'primary',h:46},{id:'guest',label:'PLAY AS GUEST',sub:'NO ACCOUNT NEEDED',h:44}];
  let y=cy+ch+12;
  const btns=[];
  for(const b of main){ btns.push(Object.assign({x:24,y,w:222,size:9},b)); y+=b.h+9; }
  const tw=70, tg=6, tx=(VW-(tw*3+tg*2))/2, th=48;
  [['mileage','RIDE LOG','gauge'],['scores','SCORES','trophy'],['settings','SETTINGS','gear']].forEach((t,i)=>{
   btns.push({id:t[0],label:t[1],x:tx+i*(tw+tg),y:y+3,w:tw,h:th,size:6.8,tile:t[2]});
  });
  y+=th+12;
  btns.push({id:'credits',label:'SAFETY & CREDITS',kind:'ghost',x:62,y,w:146,h:24,size:6.8});
  return {cw,ch,cy,btns};
 },
 update(dt){
  this.tick+=dt;
  const L=this.layout();
  const id=G.navList(this.st,L.btns);
  if(!id) return;
  if(id==='login') G.go('login');
  else if(id==='create'){ G.wiz=null; G.go('createacct',{},true); }
  else if(id==='guest') G.go(G.save.roadName?'club':'tone');
  else if(id==='mileage') G.go('mileage',{back:'title'});
  else if(id==='scores') G.go('scores',{back:'title'});
  else if(id==='settings') G.go('settings',{back:'title'});
  else if(id==='credits') G.go('credits');
 },
 draw(c){
  const VH=G.VH, L=this.layout();
  G.cover(G.img.bg_convoy,0,0,VW,VH,.35);
  const g=c.createLinearGradient(0,0,0,VH);
  g.addColorStop(0,'rgba(8,6,14,.35)'); g.addColorStop(.42,'rgba(8,6,14,.72)'); g.addColorStop(1,'rgba(8,6,14,.96)');
  c.fillStyle=g; c.fillRect(0,0,VW,VH);
  const bob=G.rm()?0:Math.sin(this.tick*2)*3;
  const im=G.img.crest;
  if(im){ c.save(); c.shadowColor='rgba(255,120,30,.45)'; c.shadowBlur=24; c.drawImage(im,VW/2-L.cw/2,L.cy+bob,L.cw,L.ch); c.restore(); }
  L.btns.forEach((b,i)=>{
   if(b.tile){
    const press=G.held(b.x,b.y,b.w,b.h);
    G.rrect(b.x,b.y+(press?1:0),b.w,b.h,12); c.fillStyle=press?'rgba(240,120,24,.25)':'rgba(30,28,40,.92)'; c.fill();
    c.strokeStyle=(this.st.f===i&&G.kbMode)?'#ffd060':'rgba(255,255,255,.12)'; c.lineWidth=1.2; c.stroke();
    G.icon(b.tile,c,b.x+b.w/2,b.y+17,18,'#ffb060');
    G.txt(b.label,b.x+b.w/2,b.y+31,b.size,'#e8dcc8','center',b.w-6,700);
   } else G.button(b,this.st.f===i);
  });
  const d=DATA.DISCLAIMERS[Math.floor(this.tick/4)%DATA.DISCLAIMERS.length];
  G.txt(d,VW/2,VH-16,6,'#8a7f70','center',VW-16);
 }
};

G.scenes.confirmReset={
 enter(a){
  this.back=(a&&a.back)||'title';
  this.m=G.Modal({title:'START OVER?',titleCol:'#ff8060',lines:[
   ['WIPES POINTS, BADGES, STORY,','#cfc4b0',7.5],['LEADERBOARD AND RIDE LOG','#cfc4b0',7.5],['FOR THIS PROFILE.','#cfc4b0',7.5]],
   btns:[{id:'keep',label:'KEEP MY SAVE',kind:'primary'},{id:'wipe',label:'WIPE EVERYTHING',kind:'danger'}]});
 },
 update(){
  const r=this.m.update();
  if(r==='keep'||(r==null&&G.pressed.b)){ G.go(this.back); return; }
  if(r==='wipe'){ G.resetSave(); AUDIO.sfx('crash'); G.toast('SAVE WIPED','#ff8060'); G.go('title'); }
 },
 draw(c){ G.cover(G.img.bg_convoy,0,0,VW,G.VH); this.m.draw(c); }
};

/* ============================ TONE PICK ============================ */
G.scenes.tone={
 enter(){ this.st={f:G.save.tone==='family'?1:0}; },
 btns(){
  const VH=G.VH, h=Math.min(132,(VH-150)/2.2), y0=58;
  return [
   {id:'garage',x:12,y:y0,w:246,h,t:'GARAGE TALK',d:['Mature biker humor.','Salty. Never nasty.'],icon:'wrench'},
   {id:'family',x:12,y:y0+h+12,w:246,h,t:'FAMILY NIGHT',d:['Same game, same jokes,','rated for the grandkids.'],icon:'heart'}
  ];
 },
 update(){
  if(G.backHit()){ G.go('title'); return; }
  const id=G.navList(this.st,this.btns());
  if(id){
   G.save.tone=id; G.persist();
   G.go(G.save.roadName?'club':'builder',{back:'tone',next:'name'});
  }
 },
 draw(c){
  const VH=G.VH;
  G.cover(G.img.bg_dining,0,0,VW,VH); G.dim(.78);
  G.topBar('CLUBHOUSE TONE');
  this.btns().forEach((b,i)=>{
   const foc=this.st.f===i;
   G.panel(b.x,b.y,b.w,b.h,{border:foc?'rgba(255,180,90,.9)':'rgba(255,255,255,.14)'});
   G.icon(b.icon,c,b.x+34,b.y+b.h/2,26,'#ffb060');
   G.txt(b.t,b.x+64,b.y+b.h/2-26,10,'#ffd060','left');
   b.d.forEach((l,j)=>G.txt(l,b.x+64,b.y+b.h/2-4+j*14,7.5,'#cfc4b0','left'));
   G.chip('TAP TO PICK',b.x+b.w-12,b.y+b.h-24,{align:'right',col:'#16100a',bg:'#f08a2a',size:6});
  });
  const b=this.btns()[1];
  G.txt('YOU CAN CHANGE THIS ANY TIME IN SETTINGS',VW/2,b.y+b.h+14,6.5,'#9a8f80','center');
 }
};

/* ============================ ROAD NAME (guests) ============================ */
const NY=128, NH=42;
G.scenes.name={
 enter(){
  this.st={f:0};
  G.field('road',{x:22,y:NY,w:226,h:NH,upper:true,max:10,strip:/[^A-Z0-9 \-]/g,placeholder:'TAP HERE TO TYPE',value:G.save.roadName||'',enterHint:'go',onEnter:()=>this.done()});
  G.focusField('road');
 },
 btns(){
  return [{id:'go',label:'SADDLE UP',sub:'ENTER THE CLUBHOUSE',kind:'primary',x:22,y:NY+NH+8,w:226,h:44},
   {id:'rnd',label:'RANDOM ROAD NAME',kind:'ghost',x:22,y:NY+NH+60,w:226,h:30,size:7.5}];
 },
 update(){
  if(G.backHit()){ G.go('builder',{back:'tone',next:'name'}); return; }
  const r=G.osk('road','abc');
  if(r==='DONE'){ this.done(); return; }
  if(r) return;
  const id=G.navList(this.st,this.btns());
  if(id==='rnd'){ G.typeInto('road',DATA.ROADNAMES[Math.floor(Math.random()*DATA.ROADNAMES.length)]); AUDIO.sfx('card'); }
  else if(id==='go') this.done();
 },
 done(){
  let n=G.fieldVal('road').trim();
  if(!n) n=DATA.ROADNAMES[Math.floor(Math.random()*DATA.ROADNAMES.length)];
  G.save.roadName=n; G.persist(); G.updateBoard();
  G.blurFields(); AUDIO.sfx('cheer');
  G.go('club');
 },
 draw(c){
  const VH=G.VH;
  G.cover(G.img.bg_charity,0,0,VW,VH); G.dim(.84);
  G.topBar('ROAD NAME');
  AV.draw(c,VW/2-50,46,1.4,G.save.avatar);
  G.txt('EVERY RIDER NEEDS A ROAD NAME',VW/2,110,8,'#ffd060','center',VW-20,800);
  G.rrect(22,NY,226,NH,14); c.fillStyle='rgba(0,0,0,.4)'; c.fill();
  G.drawBtns(this.btns(),this.st);
  G.oskDraw(c,'abc',{hint:'YOUR PHONE KEYBOARD WORKS \u2022 OR TAP THESE KEYS'});
 }
};

/* ============================ CLUBHOUSE (portrait: a room to walk around + one-tap cards) ============================
   The room is a 3/4 view you can walk anywhere in: tap the floor to walk there (the member steers around furniture),
   tap a station or a character to walk over to it, or use the arrow keys. Stations hang on the back wall or stand
   in the room; everything is drawn back-to-front so the member is never lost behind the furniture. */
const WW=600, WH=500, WALL=112;        // world units: the back wall's face is y 0..WALL, the floor runs below it
const PR=7;                            // the member's footprint radius
const STATIONS=[
 {key:'rides',label:'ROUTE BOARD',x:50,wall:true},
 {key:'hall',label:'HALL OF FAME',x:116,wall:true},
 {key:'meeting',label:'MEETING ROOM',x:184,wall:true},
 {key:'roster',label:'ALPHA ROSTER',x:254,wall:true},
 {key:'waitlist',label:'WAITLIST',x:316,wall:true},
 {key:'b4l',label:'BROTHERS FOR LIFE',x:378,wall:true},
 {key:'mileage',label:'RIDE LOG',x:440,wall:true},
 {key:'office',label:'ADMIN OFFICE',x:510,wall:true},
 {key:'juke',label:'JUKEBOX',x:566,foot:[550,118,582,142],u:[566,158],h:52},
 {key:'arcade',label:'ARCADE CABS',x:63,foot:[28,170,98,194],u:[63,210],h:58},
 {key:'slots',label:'RAGING SLOTS',x:128,foot:[114,172,142,194],u:[128,210],h:54},
 {key:'pool',label:'POOL TABLE',x:290,foot:[234,262,346,314],u:[290,332],h:16},
 {key:'ladies',label:'LADIES DESK',x:66,foot:[26,356,106,382],u:[66,398],h:30},
 {key:'garage',label:'GARAGE',x:8,side:'L',y0:262,y1:334,u:[28,298]},
 {key:'picnic',label:'PICNIC YARD',x:WW-8,side:'R',y0:322,y1:398,u:[WW-28,362]},
 {key:'horizon',label:'ON THE HORIZON',x:372,foot:[360,446,384,458],u:[372,476],h:46}
];
STATIONS.forEach(s=>{ if(s.wall) s.u=[s.x,WALL+16]; });
const DECOR=[
 {k:'bar',foot:[418,222,588,250],h:26},
 {k:'stool',foot:[432,262,444,270],h:14},{k:'stool',foot:[470,262,482,270],h:14},{k:'stool',foot:[508,262,520,270],h:14},{k:'stool',foot:[546,262,558,270],h:14},
 {k:'table',foot:[168,402,212,424],h:16},{k:'table',foot:[390,402,434,424],h:16}
];
const NPCS=[
 {id:'hammer',x:494,y:292,col:'#ff7030',shirt:'#2a2a34',skin:'#d9a070'},
 {id:'sparks',x:98,y:252,col:'#80c8ff',shirt:'#24303e',skin:'#c88c60'},
 {id:'kevin', x:532,y:428,col:'#60d080',shirt:'#20342a',skin:'#d9a070'},
 {id:'ember', x:122,y:376,col:'#ff9ad0',shirt:'#301e2a',skin:'#e0b080',av:{hair:'#d9dae4',gender:'f',bun:true}}, // Mawmaw
 {id:'chief', x:214,y:144,col:'#ffb040',shirt:'#20202a',skin:'#caa078'},
 {id:'visitor',x:520,y:176,col:'#b0b0c0',shirt:'#303038',skin:'#d0a880'}
];
const LIGHTS=[[96,262],[290,232],[502,300],[290,436],[112,440],[470,430]];
/* where the member can stand: inside the walls, clear of every footprint (grown by the member's radius) */
const SOLIDS=[].concat(STATIONS.filter(s=>s.foot).map(s=>s.foot),DECOR.map(d=>d.foot),NPCS.map(n=>[n.x-6,n.y-4,n.x+6,n.y+3])).map(f=>[f[0]-PR,f[1]-PR,f[2]+PR,f[3]+PR]);
function free(x,y){
 if(x<14+PR||x>WW-14-PR||y<WALL+8||y>WH-6) return false;
 for(const f of SOLIDS) if(x>f[0]&&x<f[2]&&y>f[1]&&y<f[3]) return false;
 return true;
}
const GC=8, GCOLS=Math.ceil(WW/GC), GROWS=Math.ceil(WH/GC);
let GRID=null;
function grid(){ if(GRID) return GRID; GRID=new Uint8Array(GCOLS*GROWS); for(let r=0;r<GROWS;r++) for(let q=0;q<GCOLS;q++) GRID[r*GCOLS+q]=free((q+.5)*GC,(r+.5)*GC)?1:0; return GRID; }
function los(x0,y0,x1,y1){ const n=Math.ceil(Math.hypot(x1-x0,y1-y0)/3); for(let i=1;i<=n;i++){ const t=i/n; if(!free(x0+(x1-x0)*t,y0+(y1-y0)*t)) return false; } return true; }
/* walking route around the furniture (A* on an 8-unit grid, then trimmed to the corners you actually need) */
function findPath(x0,y0,x1,y1){
 const g=grid(), cell=(x,y)=>[Math.max(0,Math.min(GCOLS-1,Math.floor(x/GC))),Math.max(0,Math.min(GROWS-1,Math.floor(y/GC)))];
 const [sq,sr]=cell(x0,y0); let [tq,tr]=cell(x1,y1);
 if(!free(x1,y1)){   // tapped furniture or a wall: head for the nearest open floor
  let best=null,bd=1e9; for(let r=0;r<GROWS;r++) for(let q=0;q<GCOLS;q++) if(g[r*GCOLS+q]){ const d=(q-tq)*(q-tq)+(r-tr)*(r-tr); if(d<bd){ bd=d; best=[q,r]; } }
  if(!best) return null; [tq,tr]=best; x1=(tq+.5)*GC; y1=(tr+.5)*GC;
 }
 if(los(x0,y0,x1,y1)) return [[x1,y1]];
 const N=GCOLS*GROWS, gs=new Float32Array(N).fill(1e9), fs=new Float32Array(N).fill(1e9), from=new Int32Array(N).fill(-1), closed=new Uint8Array(N);
 const start=sr*GCOLS+sq, goal=tr*GCOLS+tq, open=[start];
 const h=i=>{ const dq=Math.abs(i%GCOLS-tq), dr=Math.abs(Math.floor(i/GCOLS)-tr); return Math.max(dq,dr)+.414*Math.min(dq,dr); };
 gs[start]=0; fs[start]=h(start);
 while(open.length){
  let bi=0; for(let i=1;i<open.length;i++) if(fs[open[i]]<fs[open[bi]]) bi=i;
  const cur=open[bi]; open[bi]=open[open.length-1]; open.pop();
  if(cur===goal) break;
  if(closed[cur]) continue; closed[cur]=1;
  const cq=cur%GCOLS, cr=Math.floor(cur/GCOLS);
  for(let dr=-1;dr<=1;dr++) for(let dq=-1;dq<=1;dq++){
   if(!dq&&!dr) continue;
   const q=cq+dq, r=cr+dr; if(q<0||r<0||q>=GCOLS||r>=GROWS) continue;
   const ni=r*GCOLS+q; if(!g[ni]||closed[ni]) continue;
   if(dq&&dr&&(!g[cr*GCOLS+q]||!g[r*GCOLS+cq])) continue;   // no cutting corners
   const ng=gs[cur]+(dq&&dr?1.414:1);
   if(ng<gs[ni]){ gs[ni]=ng; fs[ni]=ng+h(ni); from[ni]=cur; open.push(ni); }
  }
 }
 if(goal!==start&&from[goal]<0) return null;
 const pts=[]; for(let i=goal;i!==start&&i>=0;i=from[i]) pts.push([(i%GCOLS+.5)*GC,(Math.floor(i/GCOLS)+.5)*GC]);
 pts.reverse(); if(!pts.length) return [[x1,y1]]; pts[pts.length-1]=[x1,y1];
 const out=[]; let ax=x0, ay=y0, i=0;
 while(i<pts.length){ let j=pts.length-1; while(j>i&&!los(ax,ay,pts[j][0],pts[j][1])) j--; out.push(pts[j]); ax=pts[j][0]; ay=pts[j][1]; i=j+1; }
 return out;
}
const TILES=[
 {id:'rides',label:'RIDES',icon:'road'},{id:'garage',label:'GARAGE',icon:'wrench'},
 {id:'arcade',label:'ARCADE',icon:'joy'},{id:'photos',label:'PHOTO ALBUM',icon:'cam'},
 {id:'picnic',label:'PICNIC',icon:'board'},{id:'ladies',label:'LADIES',icon:'heart'},
 {id:'hall',label:'FAME',icon:'trophy'},{id:'office',label:'ADMIN OFFICE',icon:'docs'},
 {id:'horizon',label:'HORIZON',icon:'cal'},{id:'mileage',label:'RIDE LOG',icon:'gauge'},
 {id:'chat',label:'CHAT',icon:'chat'},{id:'roster',label:'ROSTER',icon:'roster'},
 {id:'news',label:'ANNOUNCEMENTS',icon:'megaphone'},{id:'pay',label:'PAYMENTS',icon:'wallet'},{id:'shop',label:'RKFFMC SHOP',icon:'bag'},
 {id:'positions',label:'POSITIONS',icon:'chevrons'},{id:'b4l',label:'B4L',icon:'medal'},{id:'officers',label:'OFFICERS',icon:'offchat'}
];
/* locks: CHAT, ROSTER and the ADMIN OFFICE are for approved members (OFFICERS also needs a club role or position);
   POSITIONS + B4L are open read-only to supporters and the waitlist. The PHOTO ALBUM is for approved members and the
   supporters two club officers let in. Everything else is open to all (non-members see PUBLIC posts and DONATE). */
G.tileLocked=function(id){
 const C=G.club, ok=G.clubAccess().ok;
 if(id==='chat'||id==='roster'||id==='office') return !ok;
 if(id==='officers') return !ok||!C.isOfficerish();
 if(id==='positions'||id==='b4l') return !C.viewOk();
 if(id==='photos') return !C.canViewPhotos();
 return false;
};
/* the little red counts on a card: things waiting on this member */
G.tileBadge=function(id){
 const C=G.club, ok=G.clubAccess().ok;
 if(id==='news') return C.annUnread().length;
 if(id==='horizon') return C.evUnread().length;
 if(id==='mileage') return C.viewOk()?C.closeRequests().length:0;
 if(id==='photos') return C.photoTodo().length;
 if(!ok) return 0;
 if(id==='roster') return C.myPending().length+C.myAckTodo().length;
 if(id==='positions') return C.posQueueN();
 return 0;
};
const TILE_COLS=6;
/* the character tied to each Prospect Day step: the only one who may flag a member down during that step */
const STORY_NPC={0:'chief',2:'hammer',3:'ember',4:'kevin',5:'sparks',6:'visitor',7:'chief'};
G.scenes.club={
 enter(a){
  a=a||{};
  if(this.px==null||this.py==null||a.reset){ this.px=290; this.py=468; }
  if(a.at){ const s=STATIONS.find(q=>q.key===a.at); if(s){ this.px=s.u[0]; this.py=s.u[1]; } }
  if(a.px!=null){ this.px=a.px; if(a.py!=null) this.py=a.py; }
  if(!free(this.px,this.py)){ this.px=290; this.py=468; }
  this.dir=this.dir||1; this.walk=0;
  this.mode='walk'; this.dlg=null; this.benefit=null; this.exitM=null;
  this.path=null; this.tgtThing=null; this.tst={f:0};
  this.snapCam(this.layout());
  if(AUDIO.curName!==G.bgm()) AUDIO.play(G.bgm());
  G.updateBoard();
 },
 layout(){
  const VH=G.VH;
  const bannerY=46, bannerH=24, roomY=74;
  const gridH=Math.round(VH/3), gridY=VH-6-gridH;   // the cards: about a third of the screen, at the bottom
  const RH=gridY-6-roomY;                            // the room gets the rest
  const Z=Math.max(.92,Math.min(1.22,RH/262));       // room zoom
  return {bannerY,bannerH,roomY,RH,gridY,gridH,Z,RS:Z,vw:VW/Z,vh:RH/Z};
 },
 tileRects(L){
  const gap=4, cols=TILE_COLS, rows=Math.ceil(TILES.length/cols), w=(VW-12-gap*(cols-1))/cols, h=(L.gridH-gap*(rows-1))/rows;
  return TILES.map((t,i)=>Object.assign({},t,{x:6+(i%cols)*(w+gap),y:L.gridY+Math.floor(i/cols)*(h+gap),w,h}));
 },
 tileLabel(s,cx,y,maxw,col){
  let size=5.8; const sp=s.indexOf(' ');
  if(G.tw(s,size,700)>maxw&&sp>0){ G.txt(s.slice(0,sp),cx,y-8,size,col,'center',maxw,700); G.txt(s.slice(sp+1),cx,y,size,col,'center',maxw,700); return; }
  while(size>4.8&&G.tw(s,size,700)>maxw) size-=.2;
  G.txt(s,cx,y+(5.8-size)*.6,size,col,'center',maxw,700);
 },
 storyTile(){
  const s=DATA.STORY[G.save.story];
  return s&&s.where?s.where:null;
 },
 toWorld(sx,sy,L){ return [sx/L.Z+this.camX,(sy-L.roomY)/L.Z+this.camY]; },
 toScreen(wx,wy,L){ return [(wx-this.camX)*L.Z,L.roomY+(wy-this.camY)*L.Z]; },
 camTarget(L){ return [Math.max(0,Math.min(WW-L.vw,this.px-L.vw/2)),Math.max(0,Math.min(WH-L.vh,this.py-L.vh*.6))]; },
 snapCam(L){ const t=this.camTarget(L); this.camX=t[0]; this.camY=t[1]; },
 followCam(L,dt){ const t=this.camTarget(L), k=Math.min(1,dt*6); this.camX+=(t[0]-this.camX)*k; this.camY+=(t[1]-this.camY)*k; },
 free(x,y){ return free(x,y); },
 stationAt(k){ return STATIONS.find(s=>s.key===k)||null; },
 npcAt(id){ return NPCS.find(n=>n.id===id)||null; },
 /* walk to a point (around furniture); `thing` opens / talks on arrival */
 walkTo(x,y,thing){
  if(Math.hypot(this.px-x,this.py-y)<3){ this.path=null; this.tgtThing=null; if(thing) this.interact(thing); return; }
  const p=findPath(this.px,this.py,x,y);
  this.path=p&&p.length?p:null; this.tgtThing=this.path?(thing||null):null;
 },
 /* what's under a tap in the room: a character, something standing in the room, or something on a wall */
 hitThing(wx,wy){
  for(const n of NPCS) if(Math.abs(wx-n.x)<11&&wy>n.y-42&&wy<n.y+5) return {npc:n};
  const fl=STATIONS.filter(s=>s.foot).sort((a,b)=>b.foot[3]-a.foot[3]);
  for(const s of fl){ const f=s.foot; if(wx>f[0]-2&&wx<f[2]+2&&wy>f[1]-s.h&&wy<f[3]+2) return {st:s}; }
  for(const s of STATIONS) if(s.side){ if((s.side==='L'?wx<26:wx>WW-26)&&wy>s.y0-6&&wy<s.y1+4) return {st:s}; }
  for(const s of STATIONS) if(s.wall&&wy<WALL+6&&Math.abs(wx-s.x)<30) return {st:s};
  return null;
 },
 topic(id){
  const st=G.save.story;
  if(id==='chief') return st===0?'intro':(st===7?'ceremony':(st===8?'after':'mid'));
  if(id==='ember') return st===3?'benefit':'talk';
  return 'talk';
 },
 hasNews(id){
  if(STORY_NPC[G.save.story]!==id) return false;
  return (G.save.met||{})[id]!==this.topic(id);
 },
 markMet(id){ if(!G.save.met) G.save.met={}; G.save.met[id]=this.topic(id); G.persist(); },
 /* the glowing "TALK TO ... / station" pill over the member: tap it (or press ENTER) to talk or open */
 promptRect(L){
  if(this.mode!=='walk') return null;
  const near=this.nearThing(); if(!near) return null;
  const [nx,ny]=this.toScreen(this.px,this.py-46,L);
  const label=near.npc?('TALK TO '+DATA.NPC[near.npc.id].name):near.st.label;
  const w=G.tw('▶ '+label,7,800)+22;
  return {x:Math.max(6,Math.min(VW-6-w,nx-w/2)),y:Math.max(L.roomY+4,Math.min(L.roomY+L.RH-22,ny-12)),w,h:18,label,near};
 },
 say(npc,lines,onDone){
  this.mode='dialog';
  this.dlg={npc,lines:lines.map(l=>G.T(l)),i:0,t:0,onDone};
  AUDIO.sfx('blip');
 },
 /* ---- update ---- */
 update(dt){
  if(this.exitM){
   const r=this.exitM.update();
   if(r==='stay'||(r==null&&G.pressed.b)){ this.exitM=null; return; }
   if(r==='leave'){ G.toast('LOGGED OUT - RIDE SAFE','#80e0ff'); G.go('title'); }
   return;
  }
  if(this.mode==='dialog'){ this.updDialog(dt); return; }
  if(this.mode==='benefit'){ this.updBenefit(dt); return; }
  if(G.backHit()){
   if(G.activeAcct) this.exitM=G.Modal({title:'LEAVE THE CLUBHOUSE?',lines:[['YOU WILL NEED YOUR PIN','#cfc4b0',7.5],['TO GET BACK IN.','#cfc4b0',7.5]],
    btns:[{id:'stay',label:'STAY',kind:'primary'},{id:'leave',label:'LOG OUT',kind:'danger'}]});
   else G.go('title');
   return;
  }
  const L=this.layout();
  if(G.gearHit()){ G.go('settings',{back:'club'}); return; }
  { const wc=this.waitChip(L); if(wc&&G.clicked(wc.x,wc.y,wc.w,wc.h)){ AUDIO.sfx('ok'); G.go('waitlist',{back:'club'}); return; } }
  // banner: club business waiting on this member comes first, then the next story step
  if(G.clicked(6,L.bannerY,VW-12,L.bannerH)){
   const call=this.clubCall();
   if(call){ AUDIO.sfx('ok'); G.go(call.go,Object.assign({back:'club'},call.args||{})); return; }
   const st=this.storyTile();
   if(st){ AUDIO.sfx('ok'); this.doTile(st); return; }
   if(G.horizon&&G.horizon.upcoming(1).length){ AUDIO.sfx('ok'); G.go('horizon'); return; }
  }
  // cards
  const id=G.navList(this.tst,this.tileRects(L),{noKeys:true});
  if(id){ this.doTile(id); return; }
  // the room: arrow keys walk anywhere; a tap walks there (around furniture); a tapped station or character is the destination
  let vx=0,vy=0;
  if(G.keys.left) vx=-1; if(G.keys.right) vx=1;
  if(G.keys.up) vy=-1; if(G.keys.down) vy=1;
  if(vx||vy){ this.path=null; this.tgtThing=null; }
  if(G.pressed.a){ const near=this.nearThing(); if(near){ this.interact(near); return; } }
  const pr=this.promptRect(L);
  if(pr&&G.clicked(pr.x-4,pr.y-4,pr.w+8,pr.h+8)){ AUDIO.sfx('ok'); this.interact(pr.near); return; }
  if(G.ptr.click&&G.ptr.y>=L.roomY&&G.ptr.y<=L.roomY+L.RH){
   const [wx,wy]=this.toWorld(G.ptr.x,G.ptr.y,L), hit=this.hitThing(wx,wy);
   if(hit&&hit.npc){ const n=hit.npc, side=this.px<n.x?-1:1; this.walkTo(n.x+side*17,n.y+4,this.hasNews(n.id)?{npc:n}:null); }   // a character only starts talking if they have news
   else if(hit&&hit.st) this.walkTo(hit.st.u[0],hit.st.u[1],{st:hit.st});
   else this.walkTo(wx,wy,null);
   AUDIO.sfx('tick');
  }
  let mx=vx, my=vy;
  if(!mx&&!my&&this.path){
   const t=this.path[0], dx=t[0]-this.px, dy=t[1]-this.py, d=Math.hypot(dx,dy);
   if(d<2.5){ this.px=t[0]; this.py=t[1]; this.path.shift();
    if(!this.path.length){ this.path=null; const th=this.tgtThing; this.tgtThing=null; if(th){ this.walk=0; this.interact(th); return; } } }
   else { mx=dx/d; my=dy/d; }
  } else if(mx&&my){ mx*=.7071; my*=.7071; }
  if(mx||my){
   const SP=105, nx=this.px+mx*SP*dt, ny=this.py+my*SP*dt;
   if(free(nx,ny)){ this.px=nx; this.py=ny; }
   else if(free(nx,this.py)) this.px=nx;
   else if(free(this.px,ny)) this.py=ny;
   else if(this.path){ this.path=null; this.tgtThing=null; }
   if(Math.abs(mx)>.25) this.dir=mx>0?1:-1;
   this.walk+=dt*10;
  } else this.walk=0;
  // the one exception: a character with something new for this step flags the member down, once
  for(const n of NPCS){
   if(this.hasNews(n.id)&&Math.hypot(this.px-n.x,this.py-n.y)<30){ this.path=null; this.tgtThing=null; this.walk=0; this.dir=n.x>=this.px?1:-1; this.talk(n.id); return; }
  }
  this.followCam(L,dt);
 },
 doTile(id){
  if(id==='rides') G.go('rideselect');
  else if(id==='garage') G.go('garage');
  else if(id==='arcade') G.go('arcadeselect');
  else if(id==='slots') G.go('slots');
  else if(id==='photos') G.go('photos',{back:'club'});
  else if(id==='picnic') G.go('picnicselect');
  else if(id==='ladies') this.goNpc('ember');
  else if(id==='hall') G.go('scores',{back:'club'});
  else if(id==='meeting') this.goNpc('chief');
  else if(id==='juke') G.go('jukebox');
  else if(id==='mileage') G.go('mileage',{back:'club'});
  else if(id==='settings') G.go('settings',{back:'club'});
  else if(id==='chat') G.go('chat');
  else if(id==='roster') G.go('roster');
  else if(id==='waitlist') G.go('waitlist',{back:'club'});
  else if(id==='office') G.go('office',{back:'club'});
  else if(id==='news') G.go('news');
  else if(id==='pay') G.go('pay');
  else if(id==='shop') G.go('shop');
  else if(id==='pool'){ if(G.scenes.pool) G.go('pool'); else G.toast('POOL IS COMING SOON','#ffd27a'); }
  else if(id==='positions') G.go('positions',{back:'club'});
  else if(id==='b4l') G.go('b4l',{back:'club'});
  else if(id==='officers') G.go('chat',{officers:true});
  else if(id==='horizon') G.go('horizon');
  else if(id==='games') G.go('games');
 },
 goNpc(id){
  const n=NPCS.find(q=>q.id===id); if(!n) return;
  const spots=[[n.x-18,n.y+4],[n.x+18,n.y+4],[n.x,n.y+18]], s=spots.find(p=>free(p[0],p[1]))||spots[0];
  this.px=s[0]; this.py=s[1]; this.dir=n.x>=this.px?1:-1; this.path=null; this.tgtThing=null;
  this.snapCam(this.layout());
  this.talk(id);
 },
 nearThing(){
  let best=null, bd=27;
  for(const n of NPCS){ const d=Math.hypot(this.px-n.x,this.py-n.y); if(d<bd){ bd=d; best={npc:n}; } }
  if(best) return best;
  bd=22;
  for(const s of STATIONS){ const d=Math.hypot(this.px-s.u[0],this.py-s.u[1]); if(d<bd){ bd=d; best={st:s}; } }
  return best;
 },
 interact(n){
  if(n.npc) return this.talk(n.npc.id);
  const k=n.st.key;
  if(k==='ladies') this.talk('ember');
  else if(k==='meeting') this.talk('chief');
  else this.doTile(k);
 },
 talk(id){
  const st=G.save.story, N=DATA.NPC;
  this.markMet(id);
  if(id==='chief'){
   if(st===0) this.say(N.chief,N.chief.intro,()=>{ G.save.story=1; G.storyEvent('sync'); if(G.save.story===1) G.toast('NEXT: '+DATA.STORY[1].hint,'#80ffa0'); });
   else if(st===7) this.say(N.chief,N.chief.ceremony,()=>{
     G.save.story=8; G.persist(); G.ach('patched'); G.award(1000,'PROSPECT DAY COMPLETE');
     AUDIO.jingle('patch');
   });
   else if(st===8) this.say(N.chief,N.chief.after);
   else this.say(N.chief,N.chief.mid);
  }
  else if(id==='hammer') this.say(N.hammer,N.hammer.talk);
  else if(id==='kevin') this.say(N.kevin,N.kevin.talk);
  else if(id==='sparks') this.say(N.sparks,N.sparks.talk);
  else if(id==='visitor') this.say(N.visitor,N.visitor.talk);
  else if(id==='ember'){
   if(st===3) this.say(N.ember,N.ember.benefit_intro,()=>this.startBenefit());
   else this.say(N.ember,N.ember.talk);
  }
 },
 updDialog(dt){
  const d=this.dlg; d.t+=dt*46;
  const line=d.lines[d.i];
  if(G.pressed.a||G.ptr.click){
   if(d.t<line.length){ d.t=line.length; }
   else { d.i++; d.t=0; AUDIO.sfx('blip');
    if(d.i>=d.lines.length){ this.mode='walk'; const f=d.onDone; this.dlg=null; if(f) f(); } }
  }
  if(G.pressed.b){ this.mode='walk'; const f=this.dlg.onDone; this.dlg=null; if(f) f(); }
 },
 startBenefit(){ this.mode='benefit'; this.benefit={i:0,score:0,st:{f:0},showR:null,ord:DATA.BENEFIT.map(q=>G.order(q.opts.length))}; },
 benefitBtns(){
  const VH=G.VH, b=this.benefit;
  if(b.showR) return [{id:'next',label:'CONTINUE',kind:'primary',x:22,y:VH-70,w:226,h:42}];
  const q=DATA.BENEFIT[b.i], top=Math.max(170,VH*.38);
  const ord=(b.ord&&b.ord[b.i])||q.opts.map((o,k)=>k);   // shuffled: the best answer isn't always on top
  return ord.map((k,j)=>({id:'o'+k,label:q.opts[k].t,x:18,y:top+j*58,w:234,h:50,size:7.6}));
 },
 updBenefit(){
  const b=this.benefit;
  const id=G.navList(b.st,this.benefitBtns());
  if(!id) return;
  if(id==='next'){
   b.showR=null; b.i++; b.st={f:0};
   if(b.i>=DATA.BENEFIT.length){
    const good=b.score>=5, E=DATA.NPC.ember;
    this.mode='walk';
    this.say(E, good?E.benefit_good:E.benefit_ok, ()=>{ G.award(150+b.score*50,'BENEFIT PLANNED'); G.storyEvent('benefit'); });
   }
   return;
  }
  const o=DATA.BENEFIT[b.i].opts[+id.slice(1)];
  b.score+=o.s; b.showR=o.r; b.last=o.s;
  AUDIO.sfx(o.s===2?'ok':(o.s===1?'blip':'buzzer'));
 },
 /* ================= drawing ================= */
 draw(c){
  const VH=G.VH, L=this.layout();
  c.fillStyle='#120d09'; c.fillRect(0,0,VW,VH);
  this.drawRoom(c,L);
  this.drawRoomOverlay(c,L);
  const vmark=G.activeAcct&&G.clubAccess().ok?' \u2713':'', sup=G.activeAcct&&G.activeAcct.type==='sup';
  G.topBar((G.save.roadName||'PROSPECT')+vmark,{backLabel:'EXIT',sub:(sup?'SUPPORTER \u2022 ':'')+G.save.points.toLocaleString()+' PTS',subCol:sup?'#ff9ad0':'#ffd060',gear:true});
  this.drawBanner(c,L);
  this.drawTiles(c,L);
  if(this.mode==='dialog') this.drawDialog(c,L);
  if(this.mode==='benefit') this.drawBenefit(c,L);
  if(this.exitM) this.exitM.draw(c);
 },
 /* club business that needs this member: approvals (POCs, officers, admin) or acknowledgments (members) */
 clubCall(){
  const C=G.club, p=C.myPending().length;
  if(p) return {go:'console',n:p,text:'APPROVE '+p+' NEW MEMBER'+(p===1?'':'S')+' \u203A'};
  const a=C.myAckTodo().length;
  if(a) return {go:'waitlist',n:a,text:a+' RIDER'+(a===1?'':'S')+' NEED'+(a===1?'S':'')+' YOUR ACKNOWLEDGMENT \u203A'};
  { const u=C.annUnread(); if(u.length) return {go:'news',n:u.length,icon:'megaphone',text:(u.length>1?u.length+' NEW ANNOUNCEMENTS':'NEW: '+u[0].t)+' \u203A'}; }
  if(C.isAdminish()){
   const nc=C.posClaims().length, nn=C.nomGroups().length;
   if(nc||nn) return {go:'positions',args:{review:true},n:nc+nn,icon:'chevrons',text:'REVIEW '+[nc?nc+' POSITION CLAIM'+(nc===1?'':'S'):'',nn?nn+' NOMINATION'+(nn===1?'':'S'):''].filter(Boolean).join(' + ')+' \u203A'};
  }
  { const n=C.photoTodo().length; if(n) return {go:'photos',args:{tab:'access'},n,icon:'cam',text:n+(n===1?' SUPPORTER WANTS':' SUPPORTERS WANT')+' PHOTO ACCESS \u203A'}; }
  if(C.viewOk()){ const q=C.closeRequests(); if(q.length) return {go:'mileage',args:{close:true},n:q.length,icon:'close',text:(q.length===1?q[0].an+' WANTS TO GET IN CLOSE':q.length+' RIDERS WANT TO GET IN CLOSE')+' \u203A'}; }
  return null;
 },
 waitChip(L){
  const acc=G.clubAccess(); if(!G.activeAcct||acc.ok||acc.reason!=='tentative') return null;
  const C=G.club, text='ON THE WAITLIST \u2022 '+C.myAckCount()+'/'+C.ACKS+' \u2022 AUTO IN '+C.fmtLeft(acc.left)+' \u203A';
  const size=6, w=G.tw(text,size,700)+14, h=size*1.3+8;
  return {text,x:8,y:L.roomY+6,w,h,size};
 },
 drawBanner(c,L){
  const st=this.storyTile(), s=DATA.STORY[G.save.story];
  const call=this.clubCall();
  if(call){
   c.save(); if(!G.rm()){ c.shadowColor='#60d0ff'; c.shadowBlur=8+Math.sin(G.time*5)*3; }
   G.rrect(6,L.bannerY,VW-12,L.bannerH,12);
   const g=c.createLinearGradient(0,L.bannerY,0,L.bannerY+L.bannerH); g.addColorStop(0,'#8ce4ff'); g.addColorStop(1,'#3aa8dc');
   c.fillStyle=g; c.fill(); c.restore();
   G.icon(call.icon||'roster',c,22,L.bannerY+12,13,'#06202c');
   G.txt(call.text,VW/2+8,L.bannerY+6.5,7.2,'#06202c','center',VW-56,800);
   return;
  }
  if(st){
   G.glowFill(6,L.bannerY,VW-12,L.bannerH,12);
   G.icon('play',c,20,L.bannerY+12,11,'#16100a');
   G.txt('NEXT: '+s.hint,VW/2+6,L.bannerY+6.5,7,'#16100a','center',VW-50,800);
  } else {
   // story done: the banner shows what's next on the horizon
   const u=G.horizon&&G.horizon.upcoming(1)[0];
   G.rrect(6,L.bannerY,VW-12,L.bannerH,12); c.fillStyle=u?'rgba(255,176,96,.14)':'rgba(128,255,160,.12)'; c.fill();
   c.strokeStyle=u?'rgba(255,176,96,.55)':'rgba(128,255,160,.45)'; c.lineWidth=1; c.stroke();
   if(u){ const un=G.horizon.until(u.o,u.e.tm); G.icon('cal',c,20,L.bannerY+12,11,'#ffb060');
    G.txt('NEXT UP: '+G.horizon.titleOf(u.e,u.o)+' • '+un.t+' \u203A',VW/2+6,L.bannerY+6.5,7,'#ffd8a8','center',VW-50,800); }
   else G.txt('CHAPTER COMPLETE • THE ROAD IS YOURS',VW/2,L.bannerY+6.5,7,'#a8ffc0','center',VW-30,700);
  }
 },
 drawTiles(c,L){
  const target=this.storyTile();
  this.tileRects(L).forEach((t,i)=>{
   const press=G.held(t.x,t.y,t.w,t.h);
   const glow=t.id===target;
   const y=t.y+(press?1:0);
   if(glow) G.glowFill(t.x,y,t.w,t.h,10);
   else { G.rrect(t.x,y,t.w,t.h,10); c.fillStyle=press?'#2c2a3a':'#1d1b27'; c.fill(); c.strokeStyle='rgba(255,255,255,.09)'; c.lineWidth=1; c.stroke(); }
   const col=glow?'#16100a':'#ffb060';
   const is=Math.min(18,t.h*.3);
   G.icon(t.icon,c,t.x+t.w/2,y+t.h*.4,is,col);
   const C=G.club, ok=G.clubAccess().ok;
   this.tileLabel(t.id==='pay'&&!ok?'DONATE':t.label,t.x+t.w/2,y+t.h-12,t.w-5,glow?'#16100a':'#e8dcc8');
   if(G.tileLocked(t.id)){ G.icon('lock',c,t.x+t.w-8,y+8,8,t.id==='photos'&&C.photoAccess()!=='locked'?'#ff9ad0':'#9a8f80'); }
   const n=G.tileBadge(t.id);
   if(n){ c.beginPath(); c.arc(t.x+t.w-7,y+7,6.2,0,7); c.fillStyle='#ff5a40'; c.fill(); G.txt(String(Math.min(n,9)),t.x+t.w-7,y+3.2,5.6,'#fff','center',undefined,800); }
   else if(t.id==='officers'&&ok&&C.offUnread()){ c.beginPath(); c.arc(t.x+t.w-7,y+7,4.2,0,7); c.fillStyle='#ff5a40'; c.fill(); }
  });
 },
 drawRoom(c,L){
  c.save();
  c.beginPath(); c.rect(0,L.roomY,VW,L.RH); c.clip();
  c.translate(0,L.roomY); c.scale(L.Z,L.Z); c.translate(-this.camX,-this.camY);
  this.drawWall(c);
  this.drawFloor(c);
  // everything standing in the room, back to front
  const items=[];
  for(const s of STATIONS) if(s.foot) items.push({y:s.foot[3],st:s,r:[s.foot[0],s.foot[1]-s.h,s.foot[2],s.foot[3]]});
  for(const d of DECOR) items.push({y:d.foot[3],d,r:[d.foot[0],d.foot[1]-d.h,d.foot[2],d.foot[3]]});
  for(const n of NPCS) items.push({y:n.y,n,r:[n.x-9,n.y-40,n.x+9,n.y+2]});
  items.push({y:this.py,me:true});
  items.sort((a,b)=>a.y-b.y);
  const near=this.mode==='walk'?this.nearThing():null;
  for(const it of items){
   if(it.me) this.drawMe(c);
   else if(it.n) this.drawNpc(c,it.n);
   else if(it.st) this.drawFloorStation(c,it.st,near&&near.st===it.st);
   else this.drawDecor(c,it.d);
  }
  // never lose the member behind the furniture: a see-through copy on top when something covers them
  const me=[this.px-9,this.py-40,this.px+9,this.py+2];
  if(items.some(it=>!it.me&&it.y>this.py&&it.r[0]<me[2]&&it.r[2]>me[0]&&it.r[1]<me[3]&&it.r[3]>me[1])){ c.save(); c.globalAlpha=.45; this.drawMe(c); c.restore(); }
  // a soft fade at the front edge of the room
  const fg=c.createLinearGradient(0,WH-40,0,WH); fg.addColorStop(0,'rgba(0,0,0,0)'); fg.addColorStop(1,'rgba(0,0,0,.5)'); c.fillStyle=fg; c.fillRect(0,WH-40,WW,40);
  c.restore();
 },
 drawMe(c){ this.drawDude(c,this.px,this.py-21,{shirt:'#3a2410',vest:'#191921',skin:'#dca878',trim:'#f07818'},this.dir,this.walk,null,G.save.avatar); },
 drawNpc(c,n){
  const face=Math.hypot(this.px-n.x,this.py-n.y)<70?(this.px>=n.x?1:-1):(n.x>WW/2?-1:1);
  const bob=G.rm()?0:Math.round(Math.sin(G.time*2+n.x)*.6);
  this.drawDude(c,n.x,n.y-21+bob,{shirt:n.shirt,vest:'#15151d',skin:n.skin,trim:n.col},face,0,null,n.av||null);
 },
 drawWall(c){
  c.fillStyle='#0c0905'; c.fillRect(0,0,WW,14);
  for(let x=20;x<WW;x+=96){ c.fillStyle='#231810'; c.fillRect(x,0,12,14); c.fillStyle='rgba(0,0,0,.3)'; c.fillRect(x+12,0,3,14); }
  const wg=c.createLinearGradient(0,14,0,74); wg.addColorStop(0,'#3a2817'); wg.addColorStop(1,'#2e1f10'); c.fillStyle=wg; c.fillRect(0,14,WW,60);
  c.fillStyle='rgba(0,0,0,.14)';
  for(let y=23;y<74;y+=9){ c.fillRect(0,y,WW,1.4); for(let x=((y-23)/9)%2?0:18;x<WW;x+=36) c.fillRect(x,y-9,1.4,9); }
  c.fillStyle='#2a1a0c'; c.fillRect(0,74,WW,WALL-74);
  c.fillStyle='rgba(255,255,255,.035)'; for(let x=0;x<WW;x+=22) c.fillRect(x,77,1.2,WALL-82);
  c.fillStyle='#4a3018'; c.fillRect(0,72,WW,3);
  c.fillStyle='#160d05'; c.fillRect(0,WALL-4,WW,4);
  for(const x of [17,83,150,219,285,347,409,475,546]){   // sconces
   const g=c.createRadialGradient(x,26,2,x,26,44); g.addColorStop(0,'rgba(255,200,110,.22)'); g.addColorStop(1,'rgba(255,200,110,0)'); c.fillStyle=g; c.fillRect(x-44,0,88,WALL);
   c.fillStyle='#2e2418'; c.fillRect(x-4,20,8,4); c.fillStyle='#ffd77a'; c.beginPath(); c.arc(x,27,3,0,7); c.fill();
  }
  for(const s of STATIONS) if(s.wall) this.drawWallStation(c,s);
 },
 drawFloor(c){
  const fg=c.createLinearGradient(0,WALL,0,WH); fg.addColorStop(0,'#33241a'); fg.addColorStop(1,'#241811'); c.fillStyle=fg; c.fillRect(0,WALL,WW,WH-WALL);
  for(let y=WALL,i=0;y<WH;y+=12,i++){
   c.fillStyle=i%2?'rgba(255,255,255,.018)':'rgba(0,0,0,.05)'; c.fillRect(0,y,WW,12);
   c.fillStyle='rgba(0,0,0,.28)'; c.fillRect(0,y,WW,1.2);
   for(let x=(i*37)%70;x<WW;x+=70){ c.fillStyle='rgba(0,0,0,.2)'; c.fillRect(x,y+1,1.2,11); }
  }
  // side walls with the garage door (left) and the patio door to the picnic yard (right)
  for(const L of [0,1]){
   const x=L?WW-14:0;
   const sg=c.createLinearGradient(x,0,x+14,0); sg.addColorStop(0,L?'#2a1c10':'#1a1108'); sg.addColorStop(1,L?'#1a1108':'#2a1c10');
   c.fillStyle=sg; c.fillRect(x,WALL-6,14,WH-WALL+6);
  }
  c.save(); c.globalCompositeOperation='lighter';
  for(const [lx,ly] of LIGHTS){ const g=c.createRadialGradient(lx,ly,6,lx,ly,90); g.addColorStop(0,'rgba(255,185,90,.11)'); g.addColorStop(1,'rgba(255,185,90,0)'); c.fillStyle=g; c.beginPath(); c.ellipse(lx,ly,100,62,0,0,7); c.fill(); }
  c.restore();
  // crest rug in the middle of the floor
  c.save(); c.translate(290,448);
  c.fillStyle='rgba(0,0,0,.4)'; c.beginPath(); c.ellipse(0,2,66,28,0,0,7); c.fill();
  c.fillStyle='#161019'; c.beginPath(); c.ellipse(0,0,62,26,0,0,7); c.fill();
  c.strokeStyle='#f07818'; c.lineWidth=2; c.beginPath(); c.ellipse(0,0,57,22,0,0,7); c.stroke();
  c.drawImage(G.img.crest_sm,-19,-20,38,40);
  c.restore();
  // little mats in front of the wall stations
  const near=this.mode==='walk'?this.nearThing():null;
  for(const s of STATIONS){ if(!s.wall) continue; const on=near&&near.st===s;
   c.save(); if(on&&!G.rm()){ c.shadowColor='#ff8c2a'; c.shadowBlur=10; }
   G.rrect(s.x-22,WALL+6,44,12,6); c.fillStyle=on?'rgba(240,120,24,.5)':'rgba(0,0,0,.32)'; c.fill(); c.strokeStyle=on?'#ffb050':'rgba(240,120,24,.28)'; c.lineWidth=1.2; c.stroke(); c.restore(); }
  for(const s of STATIONS) if(s.side) this.drawSideDoor(c,s,near&&near.st===s);
 },
 drawSideDoor(c,s,on){
  const L=s.side==='L', x=L?0:WW-14, y0=s.y0, y1=s.y1;
  // light spilling onto the floor
  const g=c.createLinearGradient(L?14:WW-14,0,L?70:WW-70,0); g.addColorStop(0,L?'rgba(255,220,150,.22)':'rgba(190,230,255,.24)'); g.addColorStop(1,'rgba(255,220,150,0)');
  c.fillStyle=g; c.beginPath(); c.moveTo(L?14:WW-14,y0+4); c.lineTo(L?70:WW-70,y0-8); c.lineTo(L?70:WW-70,y1+14); c.lineTo(L?14:WW-14,y1); c.closePath(); c.fill();
  c.fillStyle=L?'#cfa860':'#a8d8f0'; c.fillRect(x+2,y0,10,y1-y0);
  if(L){ c.fillStyle='rgba(60,40,20,.55)'; for(let y=y0;y<y0+(y1-y0)*.45;y+=5) c.fillRect(x+2,y,10,3); }   // roll-up door, half open
  else { c.fillStyle='rgba(255,255,255,.4)'; c.fillRect(x+4,y0+6,2,y1-y0-12); c.fillStyle='#3a2a1a'; c.fillRect(x+2,(y0+y1)/2-1,10,2); }
  c.strokeStyle=on?'#ffb050':'#4a3018'; c.lineWidth=on?2:1.5; c.strokeRect(x+1.5,y0-1,11,y1-y0+2);
  const lx=L?x+22:x-8;
  c.save(); if(on&&!G.rm()){ c.shadowColor='#ff8c2a'; c.shadowBlur=8; }
  G.rrect(L?x+15:x-58,y0-16,58,12,5); c.fillStyle=on?'rgba(240,120,24,.6)':'rgba(0,0,0,.6)'; c.fill(); c.restore();
  G.txt(L?'GARAGE':'PICNIC YARD',L?x+44:x-29,y0-14,6,on?'#16100a':(L?'#e8dcc8':'#a8ffc0'),'center',54,800);
 },
 drawFloorStation(c,s,on){
  const f=s.foot, x0=f[0], y0=f[1], x1=f[2], y1=f[3], w=x1-x0, top=y0-s.h;
  c.save();
  c.fillStyle='rgba(0,0,0,.35)'; c.beginPath(); c.ellipse((x0+x1)/2,y1-1,w/2+4,6,0,0,7); c.fill();
  if(on&&!G.rm()){ c.shadowColor='#ff8c2a'; c.shadowBlur=12; }
  switch(s.key){
   case 'juke':
    c.fillStyle='#6a1e38'; G.rrect(x0,top+8,w,s.h-8+(y1-y0),6); c.fill();
    c.fillStyle='#8a2a4a'; c.beginPath(); c.ellipse(x0+w/2,top+12,w/2,12,0,Math.PI,0); c.fill();
    c.shadowBlur=0;
    c.fillStyle='#ffd060'; c.fillRect(x0+5,top+12,w-10,7);
    c.fillStyle='#60d0ff'; c.fillRect(x0+5,top+23,w-10,3); c.fillStyle='#80ffa0'; c.fillRect(x0+5,top+29,w-10,3);
    { const beat=AUDIO.curName&&!G.rm()?Math.abs(Math.sin(G.time*5))*5:0; c.fillStyle='#ff4060'; c.fillRect(x0+5,top+35,8+beat,5); }
    c.fillStyle='rgba(0,0,0,.35)'; for(let y=top+44;y<y1-4;y+=3) c.fillRect(x0+6,y,w-12,1.4);
    break;
   case 'arcade':
    for(let k=0;k<2;k++){ const cx=x0+k*36, cw=32;
     c.fillStyle=k?'#2a1e4a':'#202a4a'; G.rrect(cx,top,cw,s.h+(y1-y0)-2,4); c.fill();
     c.shadowBlur=0;
     c.fillStyle='#101522'; c.fillRect(cx,top,cw,8);
     c.fillStyle=k?'#ff60b0':'#ffd060'; c.fillRect(cx+3,top+2,cw-6,4);
     const sg=c.createLinearGradient(0,top+12,0,top+32); sg.addColorStop(0,'#80e8ff'); sg.addColorStop(1,'#3a90d0');
     c.fillStyle=sg; c.fillRect(cx+4,top+12,cw-8,20);
     if(!G.rm()){ c.fillStyle='rgba(255,255,255,.5)'; c.fillRect(cx+6+((G.time*20+k*9)%(cw-14)),top+20,3,3); }
     c.fillStyle='#14141c'; c.fillRect(cx+2,top+34,cw-4,9);
     c.fillStyle='#ff4060'; c.beginPath(); c.arc(cx+10,top+38,2.2,0,7); c.fill(); c.fillStyle='#ffd060'; c.beginPath(); c.arc(cx+17,top+38,2.2,0,7); c.fill();
     c.strokeStyle='#c8ccd4'; c.lineWidth=1.4; c.beginPath(); c.moveTo(cx+24,top+40); c.lineTo(cx+24,top+35); c.stroke();
    }
    break;
   case 'slots':
    c.fillStyle='#6b1f2e'; G.rrect(x0,top,w,s.h+(y1-y0)-2,5); c.fill(); c.shadowBlur=0;
    c.fillStyle='#ffd060'; c.fillRect(x0+3,top+3,w-6,6);
    c.fillStyle='#2a0e16'; c.fillRect(x0+3,top+12,w-6,16);
    c.fillStyle='#f4efe2'; for(let i=0;i<3;i++) c.fillRect(x0+5+i*7,top+14,5,12);
    c.fillStyle='#c02030'; for(let i=0;i<3;i++) c.fillRect(x0+6+i*7,top+18,3,3);
    c.fillStyle='#3a0e16'; c.fillRect(x0+3,top+32,w-6,10);
    c.strokeStyle='#c8ccd4'; c.lineWidth=2; c.beginPath(); c.moveTo(x1+2,top+30); c.lineTo(x1+4,top+16); c.stroke();
    c.fillStyle='#c02030'; c.beginPath(); c.arc(x1+4,top+15,3,0,7); c.fill();
    break;
   case 'pool': {
    const H=s.h;
    c.fillStyle='#3a2210'; for(const lx of [x0+6,x1-12]) for(const ly of [y0+10,y1-4]) c.fillRect(lx,ly-H+4,6,H+2);
    c.fillStyle='#5a3418'; G.rrect(x0,y0-H,w,y1-y0,8); c.fill();
    c.shadowBlur=0;
    c.fillStyle='#4a2c14'; c.fillRect(x0+2,y1-H,w-4,6);
    const fg=c.createLinearGradient(0,y0-H+6,0,y1-H-4); fg.addColorStop(0,'#227a44'); fg.addColorStop(1,'#16603a');
    c.fillStyle=fg; c.fillRect(x0+7,y0-H+6,w-14,y1-y0-12);
    c.fillStyle='#0a0806'; for(const px of [x0+8,x0+w/2,x1-8]) for(const py of [y0-H+7,y1-H-6]){ c.beginPath(); c.arc(px,py,2.4,0,7); c.fill(); }
    const balls=[['#ffd060',x0+30,y0-H+20],['#c02030',x0+40,y0-H+26],['#2258c8',x0+48,y0-H+18],['#7a3ac8',x0+38,y0-H+16],['#f4efe2',x1-26,y0-H+24]];
    for(const[col,bx,by] of balls){ c.fillStyle=col; c.beginPath(); c.arc(bx,by,2.4,0,7); c.fill(); }
    c.strokeStyle='#c8a060'; c.lineWidth=1.8; c.beginPath(); c.moveTo(x1-20,y0-H+22); c.lineTo(x1+10,y0-H+34); c.stroke();
    break; }
   case 'horizon': {   // an easel with the club calendar on it
    const cx=(x0+x1)/2, bt=top-6;
    c.strokeStyle='#5a3418'; c.lineWidth=2.4; c.beginPath(); c.moveTo(cx-10,y1); c.lineTo(cx-4,bt+6); c.moveTo(cx+10,y1); c.lineTo(cx+4,bt+6); c.moveTo(cx,y1-2); c.lineTo(cx,bt+20); c.stroke();
    c.fillStyle='#f4ecd8'; G.rrect(cx-17,bt,34,28,3); c.fill(); c.shadowBlur=0;
    c.fillStyle='#c02030'; c.fillRect(cx-17,bt,34,6);
    c.fillStyle='#3a3040'; for(let r=0;r<3;r++) for(let k=0;k<5;k++) c.fillRect(cx-14+k*6.2,bt+9+r*6,4,3.6);
    c.fillStyle='#f07818'; c.fillRect(cx-1.8,bt+15,4,3.6);
    c.fillStyle='#5a3418'; c.fillRect(cx-19,bt+27,38,3);
    break; }
   case 'ladies':
    c.fillStyle='#3a2030'; G.rrect(x0,top,w,s.h+(y1-y0)-2,4); c.fill(); c.shadowBlur=0;
    c.fillStyle='#5a3248'; c.fillRect(x0,top,w,6);
    c.fillStyle='#ff9ad0'; c.fillRect(x0+4,top+10,w-8,2);
    c.drawImage(G.img.ladies,x0+w/2-14,top-30,28,28);
    c.fillStyle='#e8d8c0'; c.fillRect(x0+8,top+1,10,4); c.fillRect(x0+w-20,top+1,12,4);
    break;
  }
  c.restore();
  // name plate
  const lab={juke:'JUKEBOX',arcade:'ARCADE',slots:'SLOTS',pool:'POOL',ladies:'LADIES',horizon:'ON THE HORIZON'}[s.key];
  if(lab){ const ly=s.key==='pool'||s.key==='horizon'?y1+4:y1-12, lw=G.tw(lab,6,800)+12;
   G.rrect((x0+x1)/2-lw/2,ly,lw,11,5); c.fillStyle=on?'rgba(240,120,24,.75)':'rgba(0,0,0,.6)'; c.fill();
   G.txt(lab,(x0+x1)/2,ly+1.6,6,on?'#16100a':(s.key==='ladies'?'#ff9ad0':(s.key==='slots'?'#ffd060':'#e8dcc8')),'center',lw,800); }
 },
 drawDecor(c,d){
  const f=d.foot, x0=f[0], y0=f[1], x1=f[2], y1=f[3], w=x1-x0;
  c.fillStyle='rgba(0,0,0,.3)'; c.beginPath(); c.ellipse((x0+x1)/2,y1,w/2+3,5,0,0,7); c.fill();
  if(d.k==='bar'){
   const top=y0-d.h;
   c.fillStyle='#3a2512'; c.fillRect(x0,top+8,w,d.h+(y1-y0)-8);
   c.fillStyle='rgba(255,255,255,.05)'; for(let x=x0+8;x<x1;x+=18) c.fillRect(x,top+12,1.4,d.h+(y1-y0)-16);
   c.fillStyle='#6a4524'; G.rrect(x0-3,top,w+6,12,3); c.fill();
   c.fillStyle='rgba(255,255,255,.12)'; c.fillRect(x0,top+1,w,1.4);
   const cols=['#2a7a4a','#b02a30','#c8882a','#3a5ab0','#7a3ac8','#d8d0b8'];
   for(let i=0;i<7;i++){ const bx=x0+12+i*22; c.fillStyle=cols[i%cols.length]; c.fillRect(bx,top-10,4,10); c.fillRect(bx+1,top-13,2,3); }
   c.fillStyle='#c8ccd4'; for(let i=0;i<3;i++){ c.fillRect(x0+w-40+i*9,top-12,2,12); c.beginPath(); c.arc(x0+w-39+i*9,top-12,2.2,0,7); c.fill(); }
   G.txt('BAR',x0+w/2,top+16,7,'#ffb060','center',undefined,800);
  } else if(d.k==='stool'){
   const cx=(x0+x1)/2;
   c.strokeStyle='#1c120a'; c.lineWidth=1.6; c.beginPath(); c.moveTo(cx-4,y1); c.lineTo(cx-2,y1-d.h+3); c.moveTo(cx+4,y1); c.lineTo(cx+2,y1-d.h+3); c.stroke();
   c.fillStyle='#8a2a1a'; c.beginPath(); c.ellipse(cx,y1-d.h+2,7,3.2,0,0,7); c.fill();
   c.fillStyle='rgba(255,255,255,.15)'; c.beginPath(); c.ellipse(cx-1,y1-d.h+1.4,4,1.2,0,0,7); c.fill();
  } else {
   const cx=(x0+x1)/2, ty=y1-d.h;
   for(const [ox,oy] of [[-24,2],[24,2]]){ c.fillStyle='#2a1c10'; c.fillRect(cx+ox-5,ty+oy-8,10,12); c.fillStyle='#4a2e16'; c.fillRect(cx+ox-6,ty+oy+2,12,4); }
   c.fillStyle='#1c120a'; c.fillRect(cx-2,ty+6,4,d.h-4);
   c.fillStyle='#5a3a1c'; c.beginPath(); c.ellipse(cx,ty+4,w/2,8,0,0,7); c.fill();
   c.fillStyle='rgba(255,255,255,.08)'; c.beginPath(); c.ellipse(cx-4,ty+2,w/3,3.6,0,0,7); c.fill();
   c.fillStyle='#c87820'; c.fillRect(cx-8,ty-2,5,6); c.fillStyle='#e8e4d8'; c.fillRect(cx+4,ty-1,5,4);
  }
 },
 drawRoomOverlay(c,L){
  const toS=(wx,wy)=>this.toScreen(wx,wy,L);
  c.save(); c.beginPath(); c.rect(0,L.roomY,VW,L.RH); c.clip();
  // player name (the action prompt takes its place when there's something to do)
  const [nx,ny]=toS(this.px,this.py-42);
  if(G.save.roadName&&!this.promptRect(L)) G.txtO(G.save.roadName,nx,ny-6,6.5,'#ffd060','center');
  // where a tap is walking to
  if(this.path&&this.path.length){ const t=this.path[this.path.length-1], [tx,ty]=toS(t[0],t[1]); c.strokeStyle='rgba(255,208,96,.6)'; c.lineWidth=1.2; c.beginPath(); c.ellipse(tx,ty,6*L.Z,3*L.Z,0,0,7); c.stroke(); }
  // characters with something new for this step
  for(const n of NPCS){
   if(!this.hasNews(n.id)) continue;
   const [bx,by]=toS(n.x,n.y-50);
   const bob=G.rm()?0:Math.sin(G.time*5)*2.5;
   c.beginPath(); c.arc(bx,by+bob,8,0,7); c.fillStyle='#80ffa0'; c.fill(); c.strokeStyle='#10301a'; c.lineWidth=1.5; c.stroke();
   G.txt('!',bx,by-6+bob,9,'#10301a','center',undefined,800);
  }
  // story marker over the station to visit next
  const stn=STATIONS.find(q=>q.key===this.storyTile());
  if(stn){
   const [sx,sy]=stn.wall?toS(stn.x,6):(stn.side?toS(stn.side==='L'?30:WW-30,stn.y0-26):toS(stn.u[0],stn.foot[1]-stn.h-14));
   const bob=G.rm()?0:Math.sin(G.time*5)*3; G.txtO('!',sx,sy+bob,12,'#80ffa0','center');
  }
  c.restore();
  // action prompt (tap it or press ENTER to talk / open)
  const pr=this.promptRect(L);
  if(pr){ G.glowFill(pr.x,pr.y,pr.w,pr.h,9); G.txt('▶ '+pr.label,pr.x+pr.w/2,pr.y+4.5,7,'#16100a','center',undefined,800); }
  // pending verification chip
  const acc=G.clubAccess();
  if(G.activeAcct&&!acc.ok){
   const wc=this.waitChip(L);
   if(wc) G.chip(wc.text,wc.x,wc.y,{col:'#ffd27a',bg:'rgba(30,22,8,.9)',border:'rgba(216,176,80,.7)',size:wc.size});
   else if(acc.reason==='denied') G.chip('NOT APPROVED • CONTACT YOUR POC',8,L.roomY+6,{col:'#ffb0a0',bg:'rgba(40,12,8,.9)',border:'rgba(255,120,90,.6)',size:6});
  }
  // edge fades hint that the room keeps going
  const ex=this.camX>2, rx=this.camX<WW-L.vw-2, uy=this.camY>2, dy=this.camY<WH-L.vh-2;
  for(const [on,x,y,w,h,ax,ay,bx,by] of [[ex,0,L.roomY,22,L.RH,22,0,0,0],[rx,VW-22,L.roomY,22,L.RH,VW-22,0,VW,0],[dy,0,L.roomY+L.RH-18,VW,18,0,L.roomY+L.RH-18,0,L.roomY+L.RH]]){
   if(!on) continue; const g=c.createLinearGradient(ax,ay,bx,by); g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(1,'rgba(0,0,0,.45)'); c.fillStyle=g; c.fillRect(x,y,w,h);
  }
 },
 drawWallStation(c,s){
  const near=this.mode==='walk'?this.nearThing():null, on=near&&near.st===s;
  c.save(); c.translate(s.x,-42);
  for(let a=0;a<6;a++){ c.fillStyle=a%2?'#b34f10':'#2a1c12'; c.fillRect(-27+a*9,44,9,7); }
  c.translate(0,22);
  if(on&&!G.rm()){ c.shadowColor='#ff8c2a'; c.shadowBlur=12; }
  G.rrect(-27,90,54,14,6); c.fillStyle=on?'rgba(240,120,24,.75)':'rgba(0,0,0,.55)'; c.fill();
  c.shadowBlur=0;
  const lab=(t,col)=>G.txt(t,0,93,7,on?'#16100a':(col||'#d8c8b0'),'center',52,700);
  switch(s.key){
   case 'rides': c.fillStyle='#4a3522'; c.fillRect(-20,40,44,48); c.fillStyle='#d8e8d0'; c.fillRect(-16,46,36,36);
     c.strokeStyle='#d04020'; c.lineWidth=1.5; c.beginPath(); c.moveTo(-12,76); c.bezierCurveTo(-2,52,6,70,16,50); c.stroke();
     c.fillStyle='#d04020'; c.fillRect(14,48,4,4); lab('ROUTES'); break;
   case 'hall': c.fillStyle='#4a3522'; c.fillRect(-24,38,50,50);
     c.drawImage(G.img.photo_club,-20,42,42,32); c.drawImage(G.img.crest_sm,-6,74,14,15); lab('FAME'); break;
   case 'meeting': c.fillStyle='#55381e'; c.fillRect(-18,34,38,56); c.fillStyle='#331f0e'; c.fillRect(-14,40,30,50);
     c.fillStyle='#ffd060'; c.fillRect(6,64,4,4); lab('MEETING'); break;
   case 'mileage': c.fillStyle='#7a6a4a'; c.fillRect(-14,40,30,42); c.fillStyle='#efe6d0'; c.fillRect(-11,46,24,32);
     c.fillStyle='#888'; for(let y=50;y<74;y+=6) c.fillRect(-8,y,18,2);
     c.fillStyle='#303030'; c.fillRect(-4,38,10,6); lab('MILES'); break;
   case 'roster': c.fillStyle='#5a3d22'; c.fillRect(-24,36,50,52); c.fillStyle='#b88a52'; c.fillRect(-21,39,44,46);
     { const sk=['#d9a070','#c88c60','#e0b080','#caa078','#a87048','#d0a880'];
       for(let i=0;i<6;i++){ const px=-18+(i%3)*14, py=42+Math.floor(i/3)*21;
        c.fillStyle='#f4efe2'; c.fillRect(px,py,11,16); c.fillStyle='#2a3444'; c.fillRect(px+1.5,py+1.5,8,9);
        c.fillStyle=sk[i]; c.beginPath(); c.arc(px+5.5,py+5,2.3,0,7); c.fill(); c.fillRect(px+3,py+7.5,5,3);
        c.fillStyle='#c02030'; c.fillRect(px+4.5,py-1.5,2,2.5); c.fillStyle='#777'; c.fillRect(px+2,py+12,7,1.2); } }
     lab('ROSTER','#80e0ff'); break;
   case 'waitlist': c.fillStyle='#34444e'; c.fillRect(-22,36,46,50); c.fillStyle='#dfe8ec'; c.fillRect(-19,39,40,44);
     for(let i=0;i<3;i++){ const py=42+i*13;
      c.fillStyle='#9fb4c0'; c.fillRect(-16,py,9,10); c.fillStyle='#2a3444'; c.beginPath(); c.arc(-11.5,py+3.8,2.2,0,7); c.fill(); c.fillRect(-14,py+6.2,5,3.2);
      c.fillStyle='#6a7a86'; c.fillRect(-4,py+2,15,2); c.fillRect(-4,py+6,10,1.6);
      c.fillStyle=i===0?'#40c070':'rgba(0,0,0,.18)'; c.fillRect(13,py+2,5,5); }
     lab('WAITLIST','#80e0ff'); break;
   case 'office': c.fillStyle='#2e1c10'; c.fillRect(-20,28,42,62); c.fillStyle='#5a381c'; c.fillRect(-16,32,34,58);
     c.fillStyle='rgba(0,0,0,.18)'; c.fillRect(-12,56,26,1.4); c.fillRect(-12,72,26,1.4);
     c.fillStyle='#ffd060'; c.fillRect(-9,40,20,9); c.fillStyle='#5a381c'; c.fillRect(-6,43.5,14,1.6);
     c.fillStyle='#e0b050'; c.beginPath(); c.arc(12,66,2.4,0,7); c.fill();
     lab('ADMIN','#ffb060'); break;
   case 'b4l': {   // honor plaque: gold B4L over engraved name plates
     c.fillStyle='#24160a'; c.fillRect(-23,32,48,58);
     c.fillStyle='#4a2e14'; c.fillRect(-20,35,42,52);
     c.strokeStyle='#d8a838'; c.lineWidth=1.4; c.strokeRect(-18.5,36.5,39,49);
     G.txt('B4L',1,39.5,10,'#ffd060','center',36,800);
     c.fillStyle='#c8a050'; c.fillRect(-11,52,24,1.2);
     const n=Math.min(4,Math.max(2,(G.club&&G.club.b4l&&G.club.b4l.length)||3));
     for(let i=0;i<n;i++){ c.fillStyle='#b88a3a'; c.fillRect(-13,57+i*7,28,4.4); c.fillStyle='rgba(60,36,10,.75)'; c.fillRect(-10,58.4+i*7,16-((i*5)%7),1.4); }
     lab('B4L','#ffd060'); break; }
  }
  c.restore();
 },
 drawDude(c,x,y,col,dir,walk,name,av){
  x=Math.round(x); y=Math.round(y);
  const step=Math.floor(walk*2)%2===0?0:1;
  const sk=(av&&av.skin)||col.skin, vest=(av&&av.jacket)||col.vest;
  c.fillStyle='rgba(0,0,0,.35)'; c.beginPath(); c.ellipse(x,y+21,9,3,0,0,7); c.fill();
  c.fillStyle='#283048';
  c.fillRect(x-5,y+8,4,12-(walk?step*2:0));
  c.fillRect(x+1,y+8,4,12-(walk?(1-step)*2:0));
  c.fillStyle='#17120c'; c.fillRect(x-6,y+18,6,3); c.fillRect(x+1,y+18,6,3);
  const fem=!!(av&&av.gender==='f'), tw=fem?12:14, tx=x-tw/2, vw=fem?4:5;   // female riders: a slimmer build
  c.fillStyle=col.shirt; c.fillRect(tx,y-4,tw,13);
  if(fem){ c.fillStyle='rgba(0,0,0,.28)'; c.fillRect(tx,y+2,tw,1); }
  c.fillStyle=vest; c.fillRect(tx,y-4,vw,13); c.fillRect(tx+tw-vw,y-4,vw,13);
  c.fillStyle=col.trim; c.fillRect(tx,y-4,2,13); c.fillRect(tx+tw-2,y-4,2,13);
  c.fillStyle=sk; c.fillRect(fem?x-8:x-9,y-2,fem?2:3,8); c.fillRect(x+6,y-2,fem?2:3,8);
  c.fillStyle=sk; c.fillRect(x-4,y-13,9,9);
  if(av){
   const H=av.hair||'#2a2a30', st=av.style||(av.gender==='f'?'long':'short');
   c.fillStyle=H;
   if(st==='buzz') c.fillRect(x-4,y-13,9,1.5); else c.fillRect(x-4,y-13,9,3);
   if(av.bun) c.fillRect(x-1,y-16,4,3);
   if(st==='long') c.fillRect(dir>0?x-6:x+4,y-12,3,10);
   else if(st==='pony'){ c.fillRect(dir>0?x-6:x+4,y-12,2,3); c.fillRect(dir>0?x-8:x+5,y-11,3,7); c.fillStyle='#f07818'; c.fillRect(dir>0?x-7:x+5,y-11,2,1); c.fillStyle=H; }
   else if(st==='braids'){ c.fillRect(dir>0?x-6:x+4,y-12,2,11); c.fillRect(dir>0?x-3:x+2,y-6,1,8); }
   const fc=av.face||(av.gender==='f'||av.bun?'none':'goatee');
   if(fc==='beard') c.fillRect(x-3,y-6,7,3);
   else if(fc==='goatee') c.fillRect(dir>0?x:x-2,y-5,3,2);
   else if(fc==='stache'){ c.fillRect(x-2,y-7,6,1); c.fillRect(x-2,y-7,1,3); c.fillRect(x+3,y-7,1,3); }
  } else { c.fillStyle='#2a2a30'; c.fillRect(x-4,y-13,9,3); }
  c.fillStyle='#17120c'; c.fillRect(dir>0?x+1:x-4,y-8,3,2);
  c.fillRect(dir>0?x-4:x+2,y-8,2,2);
  if(av&&av.gender==='f'){ c.fillStyle='#c8385a'; c.fillRect(dir>0?x+1:x-3,y-6,3,1); c.fillStyle='#ffd25a'; c.fillRect(dir>0?x-4:x+4,y-6,1,1); }   // lips, earring
  if(name) G.txtO(name,x,y-24,6,'#ffd060','center');
 },
 drawDialog(c,L){
  const d=this.dlg, VH=G.VH;
  const lineH=14.5, nLines=Math.min(6,G.wrap(d.lines[d.i],8.5,VW-40).length);
  const h=Math.max(150,Math.min(VH-6-L.gridY,86+nLines*lineH+44)), y=VH-6-h;
  c.fillStyle='rgba(0,0,0,.55)'; c.fillRect(0,L.gridY-4,VW,VH-L.gridY+4);
  G.panel(6,y,VW-12,h,{border:d.npc.col});
  // portrait
  const n=NPCS.find(q=>DATA.NPC[q.id]===d.npc);
  c.save(); c.beginPath(); c.arc(32,y+30,20,0,7); c.fillStyle='rgba(255,255,255,.06)'; c.fill();
  c.strokeStyle=d.npc.col; c.lineWidth=1.5; c.stroke(); c.clip();
  if(n){ c.translate(32,y+38); c.scale(1.5,1.5); this.drawDude(c,0,0,{shirt:n.shirt,vest:'#15151d',skin:n.skin,trim:n.col},1,0,null,n.av||null); }
  c.restore();
  G.txt(d.npc.name,60,y+16,10,d.npc.col,'left');
  G.txt((d.i+1)+' / '+d.lines.length,VW-18,y+20,6.5,'#8a7f70','right');
  const line=d.lines[d.i], shown=line.slice(0,Math.floor(d.t));
  const lh=14.5;
  G.wrap(shown,8.5,VW-40).slice(0,Math.floor((h-86)/lh)).forEach((l,i)=>G.txt(l,20,y+60+i*lh,8.5,'#f4ede2'));
  if(d.t>=line.length){
   const bw=150; G.glowFill(VW/2-bw/2,y+h-38,bw,28,14);
   G.txt(d.i+1>=d.lines.length?'DONE':'TAP TO CONTINUE',VW/2,y+h-31,7.5,'#16100a','center',bw-10,800);
  }
 },
 drawBenefit(c,L){
  const b=this.benefit, VH=G.VH, q=DATA.BENEFIT[Math.min(b.i,DATA.BENEFIT.length-1)];
  G.dim(.72);
  G.panel(8,48,VW-16,VH-56,{border:'#ff9ad0'});
  c.drawImage(G.img.ladies,VW/2-26,56,52,51);
  G.txt('BENEFIT PLANNING  '+Math.min(b.i+1,3)+'/3',VW/2,112,8.5,'#ff9ad0','center');
  if(b.showR){
   G.txt(b.last===2?'GREAT CALL':(b.last===1?'NOT BAD':'HMM...'),VW/2,140,11,b.last===2?'#80ffa0':(b.last===1?'#ffd060':'#ff8060'),'center');
   G.para(b.showR,VW/2,172,8.5,'#f4ede2','center',VW-44);
  } else {
   G.para(q.q,VW/2,136,8.5,'#f4ede2','center',VW-44);
  }
  const btns=this.benefitBtns();
  if(!b.showR) btns.forEach((x,i)=>{ x.label=''; });
  G.drawBtns(btns,b.st);
  if(!b.showR) btns.forEach(r=>{ const o=q.opts[+r.id.slice(1)]; G.wrap(o.t,7.6,r.w-24).slice(0,2).forEach((l,j,arr)=>G.txt(l,r.x+r.w/2,r.y+r.h/2-(arr.length*11)/2+j*11+1,7.6,'#f0e8dc','center')); });
 }
};

/* ============================ ROUTE BOARD ============================ */
G.scenes.rideselect={
 enter(){ this.routes=DATA.ROUTE_ORDER; this.st={f:0}; },
 cards(){
  const VH=G.VH, top=50, gap=6, h=Math.min(48,(VH-top-8-gap*9)/10);
  return this.routes.map((r,i)=>({id:r,x:8,y:top+i*(h+gap),w:254,h}));
 },
 storyRoute(){ const s=G.save.story; if(G.isInfo()) return null; return s===2?'r501':(s===6?'poker':null); },
 update(){
  if(G.backHit()){ G.go(G.gamesBack()); return; }
  const id=G.navList(this.st,this.cards());
  if(id) G.go('rideintro',{route:id});
 },
 draw(c){
  const VH=G.VH;
  G.cover(G.img.bg_501,0,0,VW,VH); G.dim(.82);
  G.topBar('ROUTE BOARD');
  const story=this.storyRoute();
  this.cards().forEach((b,i)=>{
   const R=DATA.ROUTES[b.id], best=G.save.best[b.id]||0, played=G.save.plays[b.id]||0;
   const press=G.held(b.x,b.y,b.w,b.h), foc=this.st.f===i&&G.kbMode, y=b.y+(press?1:0);
   if(b.id===story) G.glowFill(b.x,y,b.w,b.h,10);
   else { G.rrect(b.x,y,b.w,b.h,10); c.fillStyle=press?'rgba(50,44,60,.96)':'rgba(26,24,34,.94)'; c.fill(); c.strokeStyle=foc?'#ffd060':'rgba(255,255,255,.1)'; c.lineWidth=foc?2:1; c.stroke(); }
   // mini landscape thumb
   const tx=b.x+6, ty=y+5, tw=b.h-10;
   c.save(); G.rrect(tx,ty,tw,tw,6); c.clip();
   const g=c.createLinearGradient(0,ty,0,ty+tw); g.addColorStop(0,R.sky[0]); g.addColorStop(1,R.sky[1]);
   c.fillStyle=g; c.fillRect(tx,ty,tw,tw);
   c.fillStyle=R.shoulder; c.fillRect(tx,ty+tw*.62,tw,tw*.38);
   c.fillStyle='#3c3c44'; c.beginPath(); c.moveTo(tx+tw*.44,ty+tw*.62); c.lineTo(tx+tw*.56,ty+tw*.62); c.lineTo(tx+tw*.86,ty+tw); c.lineTo(tx+tw*.14,ty+tw); c.closePath(); c.fill();
   c.restore();
   const dark=b.id===story;
   G.txt(R.name,tx+tw+8,y+b.h/2-12,7.6,dark?'#16100a':'#f4ede2','left',150,800);
   G.txt(R.sub,tx+tw+8,y+b.h/2+2,5.8,dark?'#3a1c06':'#9a8f80','left',150);
   if(b.id===story) G.chip('STORY',b.x+b.w-8,y+b.h/2-8,{align:'right',col:'#ffd060',bg:'#16100a',size:6});
   else if(!played) G.chip('NEW',b.x+b.w-8,y+b.h/2-8,{align:'right',col:'#16100a',bg:'#80ffa0',size:6});
   else G.txt(best.toLocaleString(),b.x+b.w-10,y+b.h/2-5,7,'#ffd060','right');
  });
 }
};

/* ============================ PICNIC YARD ============================ */
G.scenes.picnicselect={
 enter(){ this.st={f:0}; },
 hh(){ return Math.min(110,G.VH*.2); },
 cards(){
  const VH=G.VH, top=48+this.hh()+8, poolH=34, gap=6;
  const h=Math.min(80,(VH-top-16-poolH-8-gap*4)/5);
  const C=[
   {id:'cornhole',t:'CORNHOLE VS KEVIN',d:'PLAY TO 21 • CANCEL SCORING',icon:'board',best:'cornhole'},
   {id:'chili',t:'CHILI COOK-OFF',d:'PICK 5 • STIR • 3 JUDGES',icon:'pot',best:'chili'},
   {id:'blackjack',t:'BLACKJACK',d:'SOLO OR THE LIVE CLUB TABLE',icon:'cards',best:'blackjack'},
   {id:'pong',t:G.T({g:'BEER PONG VS SPARKS',f:'CUP PONG VS SPARKS'}),d:'6 CUPS • PULL BACK, LET GO',icon:'cup',best:'pong'},
   {id:'darts',t:'DARTS VS CHIEF',d:'301 • FIRST TO EXACTLY ZERO',icon:'dart',best:'darts'}
  ].map((c,i)=>Object.assign(c,{x:10,y:top+i*(h+gap),w:250,h}));
  const y=top+5*(h+gap)+2;
  C.push({id:'pool',label:'8-BALL VS HAMMER • INSIDE AT THE POOL TABLE ›',kind:'ghost',x:10,y,w:250,h:poolH,size:6.8});
  return C;
 },
 update(){
  if(G.backHit()){ G.go(G.gamesBack()); return; }
  const id=G.navList(this.st,this.cards());
  if(id) G.go(id);
 },
 draw(c){
  const VH=G.VH, hh=this.hh();
  c.fillStyle='#120d09'; c.fillRect(0,0,VW,VH);
  c.save(); G.rrect(8,48,VW-16,hh,12); c.clip(); G.cover(G.img.bg_charity,8,48,VW-16,hh,.3); c.restore();
  const g=c.createLinearGradient(0,48+hh*.4,0,48+hh); g.addColorStop(0,'rgba(18,13,9,0)'); g.addColorStop(1,'rgba(18,13,9,.9)');
  c.fillStyle=g; c.fillRect(8,48,VW-16,hh);
  G.txtO('PICNIC YARD',VW/2,48+hh-22,10.5,'#ffd060','center');
  G.topBar('PICNIC YARD');
  const story=G.save.story===4&&G.save.mode!=='info'?'cornhole':null;
  this.cards().forEach((b,i)=>{
   if(b.id==='pool'){ G.button(b,this.st.f===i); return; }
   const press=G.held(b.x,b.y,b.w,b.h), y=b.y+(press?1:0), glow=b.id===story;
   if(glow) G.glowFill(b.x,y,b.w,b.h,12);
   else G.panel(b.x,y,b.w,b.h,{r:12,border:this.st.f===i&&G.kbMode?'#ffd060':'rgba(255,255,255,.14)'});
   const col=glow?'#16100a':'#ffb060', ir=Math.min(19,b.h*.36);
   c.beginPath(); c.arc(b.x+30,y+b.h/2,ir,0,7); c.fillStyle=glow?'rgba(0,0,0,.12)':'rgba(240,120,24,.12)'; c.fill();
   G.icon(b.icon,c,b.x+30,y+b.h/2,ir*1.15,col);
   const ty=y+b.h/2-17;
   G.txt(b.t,b.x+58,ty,8.2,glow?'#16100a':'#f4ede2','left',184,800);
   G.txt(b.d,b.x+58,ty+13,6,glow?'#3a1c06':'#b8ad9c','left',184,700);
   const best=G.save.best[b.best]||0;
   G.txt(best?('BEST '+best+(b.id==='chili'?'/99':' PTS')):(glow?'STORY: PLAY NOW':'NOT PLAYED YET'),b.x+58,ty+24,6,glow?'#3a1c06':'#ffd060','left',184,700);
  });
 }
};

/* ============================ JUKEBOX ============================ */
const TRACKS=[['title','OPEN ROAD ANTHEM'],['ride','FULL THROTTLE 501'],['dragon','DRAGON SLALOM'],['club','CLUBHOUSE SHUFFLE'],['rock','CLUBHOUSE THUNDER'],
 ['poker','FIVE CARD CRUISE'],['ladies','EMBERS & LACE'],['game','PICNIC BOP'],['somber','LAST BELL (MEMORIAL)']];
const ROCKROWS=()=>[['radio','ROCK RADIO','ALL FOUR, IN TURN']].concat(AUDIO.RADIO.map(k=>[k,AUDIO.ROCK[k].t,AUDIO.ROCK[k].d]));
/* JUKEBOX: HARD ROCK (the clubhouse radio + its four songs) and 8-BIT (the arcade tracks the games play). Tap a track to
   play it; tap its star to make it the CLUBHOUSE MUSIC - what plays in the clubhouse room, the dashboard and at the pool
   table from then on. The pick is saved with the profile (G.save.bgm); the ROCK RADIO is the default. */
G.scenes.jukebox={
 enter(){ this.st={f:0}; if(this.tab==null) this.tab=(!AUDIO.curName||AUDIO.isRock(AUDIO.curName))?0:1; },
 list(){ return this.tab===0?ROCKROWS():TRACKS.map(t=>[t[0],t[1],'8-BIT']); },
 rows(){
  const VH=G.VH, top=90, L=this.list(), n=L.length, h=Math.min(this.tab===0?58:46,(VH-top-100-(n-1)*5)/n);
  const R=L.map((t,i)=>({id:t[0],x:10,y:top+i*(h+5),w:250,h:h,name:t[1],desc:t[2]}));
  R.push({id:'music',label:G.save.settings.music?'MUSIC: ON':'MUSIC: OFF',kind:'ghost',x:60,y:VH-64,w:150,h:32,size:7.5});
  return R;
 },
 starRect(b){ const s=Math.min(30,b.h-4); return {x:b.x+b.w-s-6,y:b.y+(b.h-s)/2,w:s,h:s}; },
 name(id){ const t=ROCKROWS().concat(TRACKS).find(t=>t[0]===id); return t?t[1]:id; },
 setDefault(id){
  if(!AUDIO.has(id)) return;
  G.save.bgm=id; G.save.bgmPick=true; G.save.jukebox[id]=1; G.persist();
  AUDIO.play(id); AUDIO.sfx('ok');
  G.toast('CLUBHOUSE MUSIC: '+this.name(id),'#ffd060');
 },
 on(id){ return AUDIO.isRock(id)?(AUDIO.playing(id)||(id==='radio'&&AUDIO.curName==='radio')):AUDIO.curName===id; },
 update(){
  if(G.backHit()){ G.go(G.gamesBack()); return; }
  const t=G.segHit(10,50,250,30,2);
  if(t>=0&&t!==this.tab){ this.tab=t; this.st={f:0}; AUDIO.sfx('blip'); return; }
  if(G.pressed.left||G.pressed.right){ this.tab=1-this.tab; this.st={f:0}; AUDIO.sfx('blip'); }
  for(const b of this.rows()){ if(b.id==='music') continue; const r=this.starRect(b); if(G.clicked(r.x-4,r.y-4,r.w+8,r.h+8)){ this.setDefault(b.id); return; } }
  const id=G.navList(this.st,this.rows());
  if(!id) return;
  if(id==='music'){ const s=G.save.settings; s.music=!s.music; AUDIO.setMusic(s.music); G.persist(); return; }
  AUDIO.play(id); G.save.jukebox[id]=1; G.persist();
 },
 draw(c){
  const VH=G.VH, def=G.bgm();
  G.cover(G.img.bg_dining,0,0,VW,VH); G.dim(.82);
  G.topBar('JUKEBOX');
  G.seg(10,50,250,30,['HARD ROCK','8-BIT ARCADE'],this.tab,7.4);
  this.rows().forEach((b,i)=>{
   if(b.id==='music'){ G.button(b,this.st.f===i); return; }
   const on=this.on(b.id), isDef=def===b.id, press=G.held(b.x,b.y,b.w,b.h), y=b.y+(press?1:0);
   const radioHas=AUDIO.curName==='radio'&&AUDIO.playing(b.id)&&b.id!=='radio';
   if(on) G.glowFill(b.x,y,b.w,b.h,10);
   else { G.rrect(b.x,y,b.w,b.h,10); c.fillStyle='rgba(28,24,36,.94)'; c.fill(); c.strokeStyle=this.st.f===i&&G.kbMode?'#ffd060':(isDef?'rgba(255,208,96,.55)':'rgba(255,255,255,.1)'); c.lineWidth=isDef?1.4:1; c.stroke(); }
   G.icon(on?'music':(b.id==='radio'?'music':'play'),c,b.x+20,y+b.h/2,on?16:13,on?'#16100a':'#ffb060');
   const tags=[on?(radioHas?'ON THE RADIO':'NOW PLAYING'):'',isDef?'CLUBHOUSE MUSIC':''].filter(Boolean).join(' • ');
   const sub=this.tab===0?[b.desc,tags].filter(Boolean).join(' • '):tags;
   G.txt(b.name,b.x+40,y+b.h/2-(sub?9.5:5.5),this.tab===0?8.2:7.6,on?'#16100a':'#f0e8dc','left',b.w-84,800);
   if(sub) G.txt(sub,b.x+40,y+b.h/2+3,5.4,on?'#3a1c06':(tags?'#ffd060':'#a89c8a'),'left',b.w-84,800);
   const r=this.starRect(b), sy=r.y+(press?1:0);
   c.beginPath(); c.arc(r.x+r.w/2,sy+r.h/2,r.w/2,0,7);
   c.fillStyle=isDef?(on?'rgba(22,16,10,.85)':'rgba(255,208,96,.16)'):(on?'rgba(22,16,10,.25)':'rgba(255,255,255,.05)'); c.fill();
   c.strokeStyle=isDef?'#ffd060':(on?'rgba(22,16,10,.5)':'rgba(255,255,255,.18)'); c.lineWidth=1.2; c.stroke();
   G.icon('star',c,r.x+r.w/2,sy+r.h/2,r.w*.62,isDef?'#ffd060':(on?'rgba(22,16,10,.55)':'rgba(255,255,255,.28)'));
  });
  G.txt(this.tab===0?'TAP A SONG TO PLAY IT • TAP ITS ★ TO MAKE IT THE CLUBHOUSE MUSIC':'THE GAMES PLAY THESE • ★ ONE TO PLAY IT IN THE CLUBHOUSE TOO',VW/2,VH-18,5.4,'#8a7f70','center',VW-14,700);
 }
};

/* ============================ CREDITS / SAFETY ============================ */
G.scenes.credits={
 enter(){ this.sc={scroll:0}; },
 lines(){
  return [
   ['RKFFMC MOBILE CLUBHOUSE','#ffd060',10],[' '],
   ['THE CLUB’S MOBILE CLUBHOUSE: ROSTER, CHAT,','#cfc4b0'],['RIDE LOGS, PHOTOS AND CLUBHOUSE GAMES','#cfc4b0'],['FOR THE RAGING KNIGHTS FFMC','#cfc4b0'],[' '],
   ['SAFETY & FAIR PLAY','#ff8a40',9],
   ...DATA.DISCLAIMERS.map(d=>[d,'#e8dcc8',7]),[' '],
   ['THE 343 ON THE CREST HONORS THE','#cfc4b0'],['FIREFIGHTERS LOST ON 9/11/2001.','#cfc4b0'],
   ['NEVER FORGET.','#ffd060',9],[' '],
   ['HOW TO PLAY','#ff8a40',9],
   ['TAP BUTTONS & TILES TO MOVE AROUND','#e8dcc8',7],['‹ BACK (TOP LEFT) ALWAYS RETURNS','#e8dcc8',7],['CLUBHOUSE SETTINGS: GEAR, TOP RIGHT','#e8dcc8',7],
   ['KEYBOARD: ARROWS, ENTER, ESC','#e8dcc8',7],[' '],
   ['ART: CLUB-SUPPLIED IMAGERY','#cfc4b0'],['MUSIC: ORIGINAL HARD ROCK + 8-BIT','#cfc4b0'],['CODE: ORIGINAL','#cfc4b0'],[' '],
   ['POINTS ARE BRAGGING RIGHTS.','#80ffa0'],['MILES ARE MEMORIES.','#80ffa0'],['RUBBER SIDE DOWN, ALWAYS.','#80ffa0']
  ];
 },
 update(){
  if(G.backHit()){ G.go('title'); return; }
  const VH=G.VH, area={x:0,y:44,w:VW,h:VH-44};
  const L=this.lines(); let h=20; for(const l of L) h+=l[0]===' '?10:(l[2]||8)*2.1; h+=120;
  G.scroll(this.sc,area,h);
 },
 draw(c){
  const VH=G.VH;
  G.cover(G.img.bg_convoy,0,0,VW,VH); G.dim(.86);
  c.save(); c.beginPath(); c.rect(0,44,VW,VH-44); c.clip();
  let y=60-this.sc.scroll;
  for(const l of this.lines()){
   if(l[0]!==' '&&y>20&&y<VH) G.txt(l[0],VW/2,y,l[2]||8,l[1]||'#fff','center',VW-24);
   y+=l[0]===' '?10:(l[2]||8)*2.1;
  }
  c.drawImage(G.img.crest,VW/2-45,y+10,90,96);
  c.restore();
  G.topBar('SAFETY & CREDITS',{size:8.5});
 }
};
})();
