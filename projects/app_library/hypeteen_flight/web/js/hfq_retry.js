/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* LEARN FOR A RETRY (r7.4). When a game's attempts are used up, it may offer ONE more attempt: a short lesson about what just
   happened in the game, then one question. Get it right and the extra attempt is yours; it can only REPLACE the weakest attempt
   (never add a new one), so a score with a retry stays comparable with every score before it. Get it wrong and you read why,
   keep the score you have, and get a different question next game. Nothing is ever taken away.
   No farming and no duplicates: one offer per game (restarting starts a new game, and new games need their attempts played
   first), a question is spent the moment it is shown, and no question comes back until the whole set has been seen.
   Use, in a game's finish():
     if(MG.offerRetry(this,{title:'ONE MORE THROW?', what:'re-throw your shortest throw (40 FT)', go:'THROW IT!', tags:['stall'],
        onEarn:()=>{...start the extra attempt...}, onSkip:()=>{...the normal end...}})) return;
   Content: js/content/retry.js (H.addRetryLessons(gameId, [...])). Progress: G.save.mod.retry = {game:{seen:[ids], ok, miss, skip}}.
   hfq_games.js calls MG.lrUpdate / MG.lrDraw while a panel is open (the game itself is frozen behind it). */
(function(){
const H=G.HFQ, C=G.C, VW=G.VW, MG=G.MG;
H.RETRY=H.RETRY||{};
H.addRetryLessons=function(game,list){ const L=H.RETRY[game]=H.RETRY[game]||[]; for(const o of list){ const i=L.findIndex(x=>x.id===o.id); if(i<0) L.push(o); else L[i]=o; } };
const ST=g=>{ const m=G.save.mod; m.retry=m.retry||{}; return m.retry[g]=m.retry[g]||{seen:[],ok:0,miss:0,skip:0}; };
H.retryStats=g=>Object.assign({},ST(g));
/* the next lesson: unseen ones only; among them, the ones that match what just happened (tags) come first, then general ones.
   When every lesson has been seen the cycle starts again, never with the one just asked. */
H.retryPick=function(game,tags){
 const L=H.RETRY[game]||[]; if(!L.length) return null; const s=ST(game); tags=tags||[];
 let pool=L.filter(o=>s.seen.indexOf(o.id)<0);
 if(!pool.length){ const last=s.seen[s.seen.length-1]; s.seen=[]; pool=L.filter(o=>o.id!==last); if(!pool.length) pool=L.slice(); }
 const score=o=>{ const t=o.tags||[]; return t.filter(x=>tags.indexOf(x)>=0).length*2+(t.indexOf('any')>=0?1:0); };
 const top=Math.max(...pool.map(score)), best=pool.filter(o=>score(o)===top);
 return best[Math.floor(Math.random()*best.length)];
};
MG.offerRetry=function(sc,o){
 if(sc.lrUsed||!(H.RETRY[sc.gid]&&H.RETRY[sc.gid].length)) return false;
 sc.lrUsed=1; sc.lr=Object.assign({step:'offer',t:0,st:{f:0}},o);
 AUDIO.sfx('chime2'); G.announce((o.title||'ONE MORE TRY?')+' Learn one quick thing, then answer one question to '+o.what+'.');
 return true;
};
const PW=VW-28, PX=14, TS=6.6, LH=TS*1.45;
/* the panel's content and buttons for the current step, laid out top to bottom and centred on the screen */
function layout(sc){
 const L=sc.lr, VH=G.VH, rows=[]; let h=16; const btns=[], wrapH=(t,s,w)=>G.wrap(t,s,w,700).length;
 const eyebrow={offer:'LEARN FOR A RETRY',lesson:'QUICK LESSON',check:'ONE QUESTION',result:L.ok?'BONUS EARNED':'GOOD TRY'}[L.step];
 rows.push({k:'eye',t:eyebrow,h:12});
 if(L.step==='offer'){
  rows.push({k:'title',t:L.title||'ONE MORE TRY?',h:20});
  const body='Learn one quick thing, then answer one question. Get it right and you can '+L.what+'.';
  rows.push({k:'body',t:body,h:wrapH(body,TS,PW-28)*LH+6});
  rows.push({k:'note',t:'One bonus try per game. Your score so far is safe either way.',h:16});
  btns.push({id:'learn',label:'LEARN + TRY AGAIN',kind:'primary',h:38},{id:'skip',label:'NO THANKS, SEE MY SCORE',kind:'ghost',h:32,size:6.4});
 } else if(L.step==='lesson'){
  const q=L.q; rows.push({k:'title',t:q.t,h:wrapH(q.t,8.6,PW-28)*12+8,size:8.6});
  if(q.fig&&G.FIG) rows.push({k:'fig',h:Math.min(96,VH*.17)+6});
  rows.push({k:'body',t:q.b,h:wrapH(q.b,TS,PW-28)*LH+4});
  btns.push({id:'ask',label:'I’M READY: ASK ME',kind:'primary',h:38},{id:'skip',label:'SKIP, SEE MY SCORE',kind:'ghost',h:30,size:6.2});
 } else if(L.step==='check'){
  rows.push({k:'q',t:L.q.q,h:wrapH(L.q.q,7.4,PW-28)*11+8});
  L.opts.forEach((t,i)=>{ const lines=G.wrap(t,6.6,PW-44,800).length; btns.push({id:'o'+i,label:t,kind:'secondary',h:Math.max(32,lines*9+16),size:6.6,i}); });
 } else {
  rows.push({k:'title',t:L.ok?'RIGHT!':'NOT QUITE',h:20,col:L.ok?C.good:C.warn});
  rows.push({k:'answer',t:L.q.a[0],h:wrapH(L.q.a[0],6.8,PW-48)*9.6+14});
  rows.push({k:'body',t:L.q.why,h:wrapH(L.q.why,TS,PW-28)*LH+4});
  if(!L.ok) rows.push({k:'note',t:'Next game brings a different question.',h:14});
  btns.push(L.ok?{id:'go',label:L.go||'TRY IT!',kind:'primary',h:40}:{id:'done',label:'SEE MY SCORE',kind:'primary',h:38});
 }
 const rowsH=rows.reduce((s,r)=>s+r.h,0), btnsH=btns.reduce((s,b)=>s+b.h+8,0);
 const H0=h+rowsH+6+btnsH+8, y0=Math.max(46,Math.round((VH-H0)/2));
 let y=y0+h; for(const r of rows){ r.y=y; y+=r.h; } y+=6;
 for(const b of btns){ Object.assign(b,{x:PX+12,y,w:PW-24}); y+=b.h+8; }
 return {x:PX,y:y0,w:PW,h:H0,rows,btns};
}
MG.lrLayout=layout;   // for the QA scripts: where the panel's buttons are
function toStep(sc,step){ const L=sc.lr; L.step=step; L.t=0; L.st={f:0};
 if(step==='lesson'){ const q=H.retryPick(sc.gid,L.tags); L.q=q; const s=ST(sc.gid); if(s.seen.indexOf(q.id)<0) s.seen.push(q.id); G.persist(); G.announce('Quick lesson. '+q.t+'. '+q.b); }   // spent the moment it is shown
 if(step==='check'){ L.opts=G.shuffle(L.q.a.slice()); G.announce(L.q.q+' '+L.opts.map((t,i)=>(i+1)+': '+t).join('. ')); }
 if(step==='result'){ G.announce((L.ok?'Right! ':'Not quite. The answer is: '+L.q.a[0]+'. ')+L.q.why); } }
function close(sc,how){ const L=sc.lr, s=ST(sc.gid); sc.lr=null;
 if(how==='earn'){ s.ok++; G.persist(); L.onEarn&&L.onEarn(); }
 else { if(how==='skip') s.skip++; G.persist(); L.onSkip&&L.onSkip(); } }
MG.lrUpdate=function(sc,dt){
 const L=sc.lr; L.t+=dt; if(L.t<.25) return;   // a beat, so the tap that ended the game doesn't answer the panel
 const Y=layout(sc);
 if(G.pressed.b){ G.pressed.b=false; AUDIO.sfx('back'); if(L.step==='result'&&L.ok) return close(sc,'earn'); return close(sc,L.step==='result'?'done':'skip'); }
 if(G.pressed.up||G.pressed.down||G.pressed.left||G.pressed.right) L.kb=true;   // arrows: show the focus on the answers from now on
 const id=G.navList(L.st,Y.btns);
 if(!id) return;
 if(id==='learn') return toStep(sc,'lesson');
 if(id==='ask') return toStep(sc,'check');
 if(id==='skip') return close(sc,'skip');
 if(id==='go') return close(sc,'earn');
 if(id==='done') return close(sc,'done');
 if(id[0]==='o'){ const pick=L.opts[+id.slice(1)]; L.ok=pick===L.q.a[0]; L.pick=pick; const s=ST(sc.gid); if(!L.ok) s.miss++; G.persist();
  if(H.rec) H.rec('retry',{game:sc.gid,q:L.q.id,ok:L.ok},'retry:'+sc.gid);
  AUDIO.sfx(L.ok?'bigpoint':'thud'); toStep(sc,'result'); }   // the cabin chime, or the gentle "say again" beep
};
MG.lrDraw=function(sc,c){
 const L=sc.lr, Y=layout(sc), k=Math.min(1,L.t*4);
 G.dim(.72*k);
 c.save(); c.globalAlpha=k;
 G.panel(Y.x,Y.y,Y.w,Y.h,{r:16,border:G.rgba(C.accent,.7)});
 for(const r of Y.rows){ const cx=Y.x+Y.w/2;
  if(r.k==='eye') G.txt(r.t,cx,r.y,5.4,C.accentText,'center',Y.w-24,800);
  else if(r.k==='title') G.para(r.t,cx,r.y,r.size||10.4,r.col||C.title,'center',Y.w-28,r.size?12:14,800);
  else if(r.k==='body') G.para(r.t,cx,r.y,TS,C.ink,'center',Y.w-28,LH,650);
  else if(r.k==='note') G.txt(r.t,cx,r.y+2,5.4,C.dim,'center',Y.w-24,700);
  else if(r.k==='q') G.para(r.t,cx,r.y,7.4,C.title,'center',Y.w-28,11,800);
  else if(r.k==='fig') { G.rrect(Y.x+14,r.y,Y.w-28,r.h-6,10); c.fillStyle='rgba(255,255,255,.04)'; c.fill(); G.FIG.draw(c,L.q.fig,Y.x+18,r.y+3,Y.w-36,r.h-12); }
  else if(r.k==='answer'){ G.rrect(Y.x+14,r.y,Y.w-28,r.h-4,10); c.fillStyle=G.rgba(C.good,.14); c.fill(); c.strokeStyle=G.rgba(C.good,.6); c.lineWidth=1; c.stroke();
   G.para('✓ '+r.t,cx,r.y+6,6.8,C.ink,'center',Y.w-48,9.6,800); }
 }
 // buttons: answer choices wrap onto two lines when they need to
 Y.btns.forEach((b,i)=>{ const foc=L.st.f===i&&(L.step!=='check'||L.kb||!!(H.input&&H.input.cur()==='keys'));   // no answer looks pre-picked to a tapping cadet
  if(L.step==='check'){ const press=G.held(b.x,b.y,b.w,b.h); G.rrect(b.x,b.y+(press?1:0),b.w,b.h,10); c.fillStyle=foc?G.rgba(C.accent,.22):C.btn; c.fill(); c.strokeStyle=foc?C.accentHi:'rgba(255,255,255,.14)'; c.lineWidth=foc?1.8:1; c.stroke();
   G.txt(String(i+1),b.x+12,b.y+b.h/2-3.5,6.4,C.accentText,'center',undefined,800);
   const lines=G.wrap(b.label,6.6,b.w-44,800); lines.forEach((ln,j)=>G.txt(ln,b.x+b.w/2+6,b.y+b.h/2-lines.length*4.5+j*9+1+(press?1:0),6.6,C.ink,'center',b.w-44,800)); }
  else G.button(b,foc); });
 c.restore();
};
})();
