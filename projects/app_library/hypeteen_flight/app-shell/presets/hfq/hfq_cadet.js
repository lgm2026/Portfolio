/* HYPETEEN FLIGHT QUARTERS - the cadet: look, call signs, XP + ranks, the Locker, and the world's hooks.
   Shell hooks used: G.playerAv, G.drawAcct, G.nameSuggest, G.afterSignup, G.onAward, G.WORLD.onRoom/onTalk/onOpen/crowd/sub */
(function(){
const H=G.HFQ, C=G.C, VW=G.VW;
const cad=()=>(G.save.mod.cadet=G.save.mod.cadet||{});
const pick=a=>a[Math.floor(Math.random()*a.length)];

/* ---------- look ---------- */
G.playerAv=()=>Object.assign({},H.defaultAv,cad().av||{});
G.drawAcct=(c,a,x,y,d,ring)=>G.drawPortrait(c,x,y,d,Object.assign({},H.defaultAv,a.av||{}),ring);

/* ---------- call signs (made up, never a real name) ---------- */
G.nameSuggest=function(){ for(let k=0;k<60;k++){ const n=pick(H.callA)+' '+pick(H.callB); if(n.length<=16) return n; } return 'SKY SCOUT'; };

/* ---------- XP + ranks ---------- */
H.rank=function(xp){
 let i=0; for(let k=0;k<H.ranks.length;k++) if(xp>=H.ranks[k].xp) i=k;
 const r=H.ranks[i], nx=H.ranks[i+1];
 return {i,n:r.n,min:r.xp,next:nx?nx.xp:null,nextN:nx?nx.n:null};
};
G.onAward=function(pts){
 const now=G.save.points, before=now-pts;
 if(H.rank(before).i<H.rank(now).i){ G.toast('RANK UP: '+H.rank(now).n,C.good); AUDIO.jingle('fanfare'); }
 if(G.activeAcct){ G.activeAcct.xp=now; G.saveRoster(); }
};

/* ---------- enrollment ends at the Locker ---------- */
G.afterSignup=function(){
 G.ach('enrolled'); G.award(H.xp.enroll,'ENROLLED');
 G.go('locker',{first:true});
};

/* ---------- world hooks ---------- */
const W=G.WORLD;
W.sub=()=>G.who()+' • '+H.rank(G.save.points).n+' • '+G.save.points+' XP';
W.onRoom=function(key,first){
 if(!first) return;
 G.award(H.xp.place,'NEW PLACE');
 const v=G.save.mod.world.visited||{};
 if(Object.keys(W.rooms).every(k=>v[k])) G.ach('explorer');
};
W.onTalk=function(n,first){
 if(!first) return;
 G.award(H.xp.crew,'MET THE '+n.name);
 const met=G.save.mod.world.met||{}, all=[];
 for(const k in W.rooms) for(const q of W.rooms[k].npcs||[]) all.push(q.id);
 if(all.every(id=>met[id])) G.ach('crew');
};
W.onOpen=function(s){
 if(s.key==='news'&&!cad().news){ cad().news=1; G.persist(); G.award(H.xp.news,'READ THE NEWS'); G.ach('newsreader'); }
};
/* other cadets enrolled on this device hang out in the Lounge */
H.cadets=function(){
 return (G.roster.accounts||[]).map(a=>{
  let s=null; try{ s=JSON.parse(localStorage.getItem(G.KEYS.acct(a.id))||'null'); }catch(e){}
  const xp=(s&&s.points)||a.xp||0;
  return {id:a.id,name:a.name,acct:a,xp,rank:H.rank(xp),av:Object.assign({},H.defaultAv,a.av||{}),me:!!(G.activeAcct&&G.activeAcct.id===a.id)};
 });
};
W.crowd=function(key){
 if(key!=='lounge') return [];
 return H.cadets().filter(p=>!p.me).map(p=>({id:p.id,name:p.name,av:p.av,sub:p.rank.n,
  line:'Hi! I’m '+p.name+'. I’m a '+p.rank.n+' with '+p.xp+' XP. See you in Ground School!'}));
};

/* ============================ THE LOCKER: build your cadet ============================ */
const LK=H.look;
G.scenes.locker={
 enter(a){ this.first=!!a.first; this.back=a.back||G.homeScene(); this.av=G.playerAv(); this.st={f:0}; this.t=0; },
 layout(){
  const VH=G.VH, top=46, prevH=Math.min(170,VH-360);
  let y=top+prevH+8; const rows=[];
  const sw=(id,label,list)=>{ rows.push({id,label,kind:'sw',list,y,h:40}); y+=44; };
  const sg=(id,label,list)=>{ rows.push({id,label,kind:'seg',list,y,h:40}); y+=44; };
  sw('suit','FLIGHT SUIT',LK.suit); sw('skin','SKIN',LK.skin); sw('hair','HAIR COLOR',LK.hair);
  sg('style','HAIR STYLE',LK.style); sg('hat','HEADGEAR',LK.hat);
  const by=Math.max(y+2,VH-52);
  const btns=[{id:'random',label:'SURPRISE ME',kind:'ghost',x:12,y:by,w:100,h:40,size:7.5},
              {id:'done',label:this.first?'REPORT TO THE LOUNGE':'DONE',kind:'primary',x:120,y:by,w:VW-132,h:40,size:this.first?7.6:9}];
  return {top,prevH,rows,btns};
 },
 swRects(r){ const n=r.list.length, gap=6, d=Math.min(24,(VW-24-gap*(n-1))/n), w=n*d+(n-1)*gap, x0=(VW-w)/2; return r.list.map((col,i)=>({col,i,x:x0+i*(d+gap),y:r.y+14,d})); },
 set(k,v){
  this.av[k]=v; if(k==='suit') this.av.hatCol=G.shade(v,.7);
  cad().av=Object.assign({},this.av); G.persist();
  if(G.activeAcct){ G.activeAcct.av=cad().av; G.saveRoster(); }
  if(!cad().styled){ cad().styled=1; G.persist(); G.award(G.HFQ.xp.locker,'LOCKER READY'); G.ach('styled'); }
  AUDIO.sfx('blip');
 },
 leave(){ if(this.first) G.go('world',{room:'lounge'}); else G.go(this.back); },
 update(dt){
  this.t+=dt;
  if(G.backHit()){ this.leave(); return; }
  const L=this.layout();
  for(const r of L.rows){
   if(r.kind==='sw'){ for(const s of this.swRects(r)) if(G.clicked(s.x-2,s.y-2,s.d+4,s.d+4)){ this.set(r.id,s.col); return; } }
   else { const i=G.segHit(12,r.y+14,VW-24,24,r.list.length); if(i>=0){ this.set(r.id,r.list[i][0]); return; } }
  }
  const id=G.navList(this.st,L.btns,{horiz:true});
  if(id==='random'){ this.set('suit',pick(LK.suit)); this.av.skin=pick(LK.skin); this.av.hair=pick(LK.hair); this.av.style=pick(LK.style)[0]; this.av.hat=pick(LK.hat)[0]; this.set('hat',this.av.hat); }
  if(id==='done') this.leave();
 },
 draw(c){
  const L=this.layout(), VH=G.VH;
  G.backdrop(.9);
  // preview: the cadet in front of a locker
  G.panel(12,L.top,VW-24,L.prevH,{r:14,border:G.rgba(C.accent,.45)});
  G.worldArt.floor.locker(c,[30,L.top+L.prevH-14,94,L.top+L.prevH-8],L.prevH-34,'#4a6a9a');
  const s=Math.min(3.6,(L.prevH-26)/36);
  G.drawPerson(c,VW/2+20,L.top+L.prevH-10,s,this.av,G.rm()?1:(Math.sin(this.t*.8)>0?1:-1),0);
  G.txt(G.who(),VW-24,L.top+10,8,C.title,'right',110,800);
  G.txt(G.HFQ.rank(G.save.points).n,VW-24,L.top+24,6,C.dim,'right',110,700);
  for(const r of L.rows){
   G.txt(r.label,14,r.y,6,C.dim,'left',undefined,800);
   if(r.kind==='sw') for(const sq of this.swRects(r)){
    const on=this.av[r.id]===sq.col;
    c.beginPath(); c.arc(sq.x+sq.d/2,sq.y+sq.d/2,sq.d/2,0,7); c.fillStyle=sq.col; c.fill();
    c.lineWidth=on?2.4:1; c.strokeStyle=on?C.accentHi:'rgba(255,255,255,.25)'; c.stroke();
    if(on){ c.beginPath(); c.arc(sq.x+sq.d/2,sq.y+sq.d/2,sq.d/2+3,0,7); c.strokeStyle=G.rgba(C.accentHi,.45); c.lineWidth=1; c.stroke(); }
   } else G.seg(12,r.y+14,VW-24,24,r.list.map(q=>q[1]),r.list.findIndex(q=>q[0]===this.av[r.id]),5.8);
  }
  G.drawBtns(L.btns,this.st);
  G.topBar(this.first?'SUIT UP, CADET':'MY LOCKER',{back:!this.first||true,sub:this.first?'PICK YOUR LOOK • CHANGE IT ANYTIME':null});
 }
};
})();
