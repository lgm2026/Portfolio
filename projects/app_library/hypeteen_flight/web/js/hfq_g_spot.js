/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* PLANE SPOTTER (the Viewing Platform's scope): aircraft fly across the scope; name each one.
   Naming a Hall of Flight aircraft for the first time unlocks it as an avatar (H.spot). 8 per round, mostly
   aircraft you haven't spotted yet. Faster answers score more; the LOOK FOR clue costs half the points.
   Answer choices come from the same family where possible (jets with jets, biplanes with biplanes).
   r7.4: only aircraft whose drawing has been checked against the real thing are shown or offered as answers (H.spotOK), and
   every answer, right or wrong, ends on a compact ID CARD (maker, first flight, role, what to look for, one checked fact) with
   a MORE page (size, story, the look-alike and how to tell them apart). Correct spots add stars to the card (hfq_idcards.js). */
(function(){
const H=G.HFQ, C=G.C, VW=G.VW, PI=Math.PI, MG=G.MG;
G.scenes.g_spot={
 enter(a){ MG.start(this,'spot',a); this.N=8; this.n=0; this.score=0; this.right=0; this.fresh=[]; this.streak=0; this.seq=this.makeSeq(); this.next(); if(AUDIO.curName!=='platform') AUDIO.play('platform'); },
 exit(){},
 makeSeq(){ const ok=H.spotOK||(()=>true), hall=H.HALL.filter(ok), un=G.shuffle(hall.filter(m=>!H.isSpotted(m.id))), seen=G.shuffle(hall.filter(m=>H.isSpotted(m.id)));
  const extra=G.shuffle(H.AC.filter(m=>!m.trainer&&ok(m))).slice(0,2);
  const out=un.slice(0,6).concat(seen.slice(0,Math.max(0,6-un.length)));
  while(out.length<this.N) out.push(extra.length?extra.pop():hall[Math.floor(Math.random()*hall.length)]);
  return G.shuffle(out.slice(0,this.N)); },
 opts(m){ const ok=H.spotOK||(()=>true), all=H.HALL.concat(H.AC.filter(x=>!x.trainer)).filter(ok), same=G.shuffle(all.filter(x=>x.id!==m.id&&x.cat&&x.cat===m.cat)), other=G.shuffle(all.filter(x=>x.id!==m.id&&x.cat!==m.cat));
  return G.shuffle([m].concat(same.slice(0,2)).concat(other).slice(0,4)); },
 next(){ const m=this.seq[this.n]; this.m=m; this.o=this.opts(m); this.k=0; this.clock=0; this.hint=false; this.fb=null; this.pass=0;
  this.sz=60+Math.random()*30; this.y=.32+Math.random()*.22; this.slow=(m.cat==='LIGHTER THAN AIR')?.55:1; AUDIO.sfx('whoosh'); },
 view(){ const VH=G.VH, cy=Math.min(150,VH*.27)+48, r=Math.min(VW*.47,VH*.22); return {cx:VW/2,cy,r}; },
 btns(){ const VH=G.VH, y0=VH-188, B=[]; const size=H.fitSize(this.o.map(m=>m.name),VW-44,7.2,6.2); this.o.forEach((m,i)=>B.push({id:'o:'+i,label:m.name,x:12,y:y0+i*40,w:VW-24,h:34,size,kind:this.fb?(m.id===this.m.id?'success':(this.fb.pick===i?'danger':'secondary')):'secondary'})); return B; },
 update(dt){
  if(MG.update(this,dt)) return;
  if(this.fb){ this.fb.t+=dt; if(this.fb.t<.6) return; const C2=this.card();
   if(G.clicked(C2.more.x,C2.more.y,C2.more.w,C2.more.h)||G.pressed.right||G.pressed.left){ G.ptr.click=false; this.fb.page=this.fb.page?0:1; AUDIO.sfx('card'); this.sayCard(); return; }
   if(G.ptr.click||G.pressed.a){ G.ptr.click=false; this.n++; if(this.n>=this.N) return this.finish(); this.next(); } return; }
  this.clock+=dt; this.k+=dt*.16*this.slow; if(this.k>1.15){ this.k=-.15; this.pass++; }
  const hb={x:VW-86,y:48,w:78,h:20}; if(!this.hint&&G.clicked(hb.x,hb.y,hb.w,hb.h)){ this.hint=true; AUDIO.sfx('card'); return; }
  for(const b of this.btns()) if(G.clicked(b.x,b.y,b.w,b.h)) return this.answer(+b.id.slice(2));
 },
 answer(i){
  const ok=this.o[i].id===this.m.id; if(this.tipT>.35) this.tipT=.35;   // the opening tip fades as soon as the first ID card opens
  let pts=0; if(ok){ pts=Math.round((60+Math.max(0,40-this.clock*5))*(this.pass?0.7:1)*(this.hint?.5:1)); this.streak++; if(this.streak>=3) pts+=10; this.right++; AUDIO.sfx('shutter'); AUDIO.sfx(this.streak>=3?'bigpoint':'point'); }
  else { this.streak=0; AUDIO.sfx('thud'); }
  this.score+=pts; let fresh=false; if(ok&&H.noteSpot) H.noteSpot(this.m.id);   // count the spot first: an older save's earlier spot counts as one
  if(ok&&this.m.hall){ fresh=H.spot(this.m.id); if(fresh){ this.fresh.push(this.m.name); G.toast('NEW IN YOUR HANGAR: '+this.m.name,C.good,{kind:'aircraft',tier:1}); } }
  this.fb={ok,pick:i,pts,fresh,t:0,page:0,brief:H.idCardBrief?H.idCardBrief(this.m.id):null}; this.sayCard();
 },
 /* the ID card that follows every answer: page 0 the essentials, page 1 MORE (size, story, the look-alike) */
 card(){ const VH=G.VH, V=this.view(), h=Math.min(196,VH-8-(V.cy+V.r+8)), y=VH-8-h; return {x:12,y,w:VW-24,h,more:{x:20,y:y+h-30,w:86,h:24}}; },
 sayCard(){ const f=this.fb, B=f&&f.brief; if(!B) return; G.announce(f.page?['Size: '+B.size.join(', '),B.hist,B.alike?'Do not mix it up with the '+B.alike.name+'. '+B.alike.how:''].join(' '):[(f.ok?'Spotted! ':'That was the ')+B.name+'.',B.meta+'.','Look for: '+B.look.join('; ')+'.',B.fact].join(' ')); },
 finish(){ const nf=this.fresh.length; MG.end(this,this.score,{head:this.right>=7?'EAGLE EYES!':(this.right>=5?'NICE SPOTTING':'KEEP WATCHING THE SKIES'),
  line:'You named '+this.right+' of '+this.N+'.'+(nf?' '+nf+' new aircraft joined your hangar!':' Name new ones to add them to your hangar.')+' Every ID card is in the Spotter’s Guide (My Hangar).'}); },
 draw(c){
  const VH=G.VH, V=this.view(), t=this.t, m=this.m;
  c.fillStyle='#14181e'; c.fillRect(0,42,VW,VH-42);
  // the scope view
  c.save(); c.beginPath(); c.arc(V.cx,V.cy,V.r,0,PI*2); c.clip();
  H.sky(c,V.cx-V.r,V.cy-V.r,V.r*2,V.r*2,{mode:'day',sun:[.78,.14],t,haze:false}); H.clouds(c,V.cx-V.r,V.cy-V.r*.9,V.r*2,V.r*1.6,{t,n:4,seed:2,speed:8,alpha:.85});
  const k=this.fb?Math.min(this.k,.5):this.k, x=V.cx-V.r-40+k*(V.r*2+80), y=V.cy-V.r+V.r*2*this.y, w=V.r*1.25*(this.sz/80);
  if(m) H.drawAC(c,m.id,x-w/2,y-w/4,w,w/2,null,{ground:false,prop:'spin',t,fly:true});
  c.restore();
  // scope ring + crosshair ticks
  c.strokeStyle='#2a2f38'; c.lineWidth=10; c.beginPath(); c.arc(V.cx,V.cy,V.r+5,0,PI*2); c.stroke(); c.strokeStyle='rgba(255,255,255,.35)'; c.lineWidth=1;
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ c.beginPath(); c.moveTo(V.cx+dx*V.r*.75,V.cy+dy*V.r*.75); c.lineTo(V.cx+dx*V.r*.95,V.cy+dy*V.r*.95); c.stroke(); }
  if(!(this.tipT>0)){ G.txt('AIRCRAFT '+Math.min(this.N,this.n+1)+' OF '+this.N,12,52,6,C.ink,'left',undefined,800);   // (after the opening tip)
  // clue
  const hb={x:VW-86,y:48,w:78,h:20}; G.rrect(hb.x,hb.y,hb.w,hb.h,8); c.fillStyle=this.hint?G.rgba(C.accent,.18):'rgba(11,11,12,.7)'; c.fill(); c.strokeStyle=G.rgba(C.accent,.6); c.lineWidth=1; c.stroke(); G.txt(this.hint?'CLUE SHOWN':'LOOK FOR… (½ PTS)',hb.x+hb.w/2,hb.y+6,5,C.accentText,'center',undefined,800); }
  const cy=V.cy+V.r+12;
  if(this.hint&&!this.fb&&m){ G.para('LOOK FOR: '+m.clue,VW/2,cy,6.4,C.accentHi,'center',VW-30,9,800); }
  // answers / the reveal
  if(!this.fb) G.drawBtns(this.btns());
  if(this.fb&&m){ const f=this.fb, K=this.card(), B=f.brief||{name:m.name,meta:(m.year||'')+' • '+(m.role||''),look:[m.clue||''],fact:(m.facts||[''])[0],hist:'',size:[],alike:null,stars:0,n:0}, x=K.x, y=K.y, w=K.w, hh=K.h, tw=w-28;
   G.rrect(x,y,w,hh,12); c.fillStyle=f.ok?'rgba(14,44,30,.97)':'rgba(58,18,16,.97)'; c.fill(); c.strokeStyle=f.ok?C.good:C.bad; c.lineWidth=1.2; c.stroke();
   G.txt(f.ok?(f.fresh?'SPOTTED! NEW ID CARD + NEW IN YOUR HANGAR':'SPOTTED! +'+f.pts):'NOT QUITE: HERE IS ITS ID CARD',x+w/2,y+7,5.6,f.ok?C.good:'#ffb3a8','center',tw,800);
   const nz=H.fitSize([B.name],tw,8.6,6.4); G.txt(B.name,x+w/2,y+19,nz,'#fff','center',tw,800);
   let yy=y+32; const para=(t,size,col,lh,max)=>{ const L=G.wrap(t,size,tw,700).slice(0,max||9); L.forEach((s2,i)=>G.txt(s2,x+14,yy+i*lh,size,col,'left',tw,700)); yy+=L.length*lh; };
   const label=t=>{ G.txt(t,x+14,yy,5.2,C.accentText,'left',undefined,800); yy+=8.6; };
   if(!f.page){
    para(B.meta,5.8,C.sub,8,2); yy+=4;
    label('LOOK FOR'); for(const t of B.look){ const L=G.wrap(t,6.5,tw-9,700).slice(0,2); G.txt('•',x+14,yy,6.5,C.accentHi,'left',undefined,800); L.forEach((s2,i)=>G.txt(s2,x+23,yy+i*8.8,6.5,C.ink,'left',tw-9,700)); yy+=L.length*8.8+1.5; }
    yy+=3; label('DID YOU KNOW?'); para(B.fact,6.5,C.ink,8.8,3);
   } else {
    label('SIZE'); for(const t of B.size.length?B.size:['—']) { G.txt(t,x+14,yy,6.1,C.ink,'left',tw,700); yy+=8.4; }
    yy+=3; if(B.hist){ label('ITS STORY'); para(B.hist,6.3,C.ink,8.6,3); yy+=3; }
    if(B.alike){ label('DON’T MIX IT UP WITH'); para(B.alike.name+': '+B.alike.how,6.3,C.ink,8.6,3); }
   }
   const mb=K.more; G.rrect(mb.x,mb.y,mb.w,mb.h,8); c.fillStyle='rgba(255,255,255,.08)'; c.fill(); c.strokeStyle=G.rgba(C.accent,.7); c.lineWidth=1; c.stroke();
   G.txt(f.page?'◂ THE BASICS':'MORE ▸',mb.x+mb.w/2,mb.y+8,5.6,C.accentHi,'center',mb.w-6,800);
   G.txt('★★★'.slice(0,B.stars)+'☆☆☆'.slice(0,3-B.stars),x+w/2,mb.y+5,7,C.title,'center',undefined,800); G.txt(B.n?'SPOTTED '+B.n+'×':'',x+w/2,mb.y+16,4.6,C.dim,'center',undefined,800);
   if(f.t>.6&&!this.over) G.txt('TAP TO CONTINUE ▸',x+w-14,mb.y+8,5.6,C.accentText,'right',undefined,800); }
  MG.hud(this,c,this.score+' PTS',{sub:'NAME WHAT FLIES PAST',tip:'Name each aircraft as it flies by. Quick answers score more. New ones join your hangar!'});
 }
};
})();
