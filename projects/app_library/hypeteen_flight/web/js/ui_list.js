/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* LIST KIT (G.CL, from the RK roster.js): scrolling lists of mixed-height items with tap, drag, wheel and keyboard.
   An ITEM is a plain object:  {h, draw(c,x,y,w,focused), focus?:true, tap?(lx,ly,w)->action, enter?()->action}
   Build an array of items every frame, then:
     this.list = CL.List();                         // in enter()
     this.list.update(items, area, act=>{...});     // in update(): act is whatever the tapped item's tap() returned
     this.list.draw(c, items, area);                // in draw()
   The finger-lift from the tap that OPENED a list never counts as a tap on a row. */
(function(){
const C=G.C;
const CL=G.CL={};
CL.scrollArea=function(st,area,contentH){ // drag + wheel only (arrow keys move the focus instead)
 const max=Math.max(0,contentH-area.h);
 if(G.ptr.down&&G.ptr.sx>=area.x&&G.ptr.sx<=area.x+area.w&&G.ptr.sy>=area.y&&G.ptr.sy<=area.y+area.h) st.scroll=(st.scroll||0)-G.dragDY;
 if(G.wheelDY&&G.hit(area.x,area.y,area.w,area.h)) st.scroll=(st.scroll||0)+G.wheelDY;
 st.scroll=Math.max(0,Math.min(max,st.scroll||0));
};
CL.layout=function(items){ let y=0; for(const i of items){ i.y=y; y+=i.h; } return y; };
CL.telHref=function(p,sms){ let d=String(p||'').replace(/\D/g,''); if(d.length===10) d='1'+d; return (sms?'sms:+':'tel:+')+d; };

/* ---- ready-made items ---- */
/* section header with an optional count on the right */
CL.hdr=function(t,n,col){ return {h:26,t,draw:(c,x,y,w)=>{ G.txt(t,x+4,y+9,6.8,col||C.accentText,'left',w-50,800); if(n!=null) G.txt(String(n),x+w-4,y+9,6.6,C.dim,'right',undefined,800); c.fillStyle='rgba(255,255,255,.08)'; c.fillRect(x,y+23,w,1); }}; };
/* A-Z divider */
CL.letter=function(L){ return {h:22,draw:(c,x,y,w)=>{ G.txt(L,x+6,y+5,8.5,C.title,'left',undefined,800); c.fillStyle=G.rgba(C.title,.2); c.fillRect(x+22,y+11,w-26,1); }}; };
/* a soft centered note (empty states, hints) */
CL.note=function(lines,col){ const h=lines.length*13+14; return {h:h+10,draw:(c,x,y,w)=>{ G.rrect(x,y+5,w,h,10); c.fillStyle='rgba(255,255,255,.05)'; c.fill(); c.strokeStyle='rgba(255,255,255,.08)'; c.lineWidth=1; c.stroke(); lines.forEach((l,i)=>G.txt(l,x+w/2,y+13+i*13,6.4,col||C.sub,'center',w-16,700)); }}; };
/* a full-width button row */
CL.action=function(label,act,kind){ return {h:44,focus:true,enter:()=>act,draw(c,x,y,w,foc){ G.button({x,y:y+2,w,h:36,label,kind:kind||'ghost',size:7.8},foc); },tap:()=>act}; };
/* wrapped body text (measured once per width) */
CL.text=function(s,o){
 o=o||{}; const size=o.size||7, lh=size*1.55; let lines=null, lw=0;
 const it={h:0,draw(c,x,y,w){ G.para(s,x+4,y+4,size,o.col||C.sub,'left',w-8,lh,o.wt||500); }};
 it.measure=function(w){ if(lw!==w){ lines=G.wrap(s,size,w-8,o.wt||500); lw=w; } it.h=lines.length*lh+8+(o.gap||4); return it; };
 return it;
};
/* a standard tappable row: icon or face on the left, title + subtitle, chevron or right text.
   o = {icon, face:{src,name}, right, rightCol, act, h, col} */
CL.row=function(title,sub,o){
 o=o||{}; const H=o.h||52;
 return {h:H+6,t:title,focus:!!o.act,   // t: the title, kept so tests (and future search) can read a list
  draw(c,x,y,w,foc){
   const press=o.act&&G.held(x,y,w,H);
   G.rrect(x,y,w,H,12); c.fillStyle=press?C.cardPress:C.card; c.fill();
   c.strokeStyle=foc?C.title:'rgba(255,255,255,.1)'; c.lineWidth=foc?2:1; c.stroke();
   let tx=x+12;
   if(o.face){ G.drawFace(o.face.src,x+8,y+(H-36)/2,36,o.face.name); tx=x+52; }
   else if(o.icon){ c.beginPath(); c.arc(x+24,y+H/2,14,0,7); const g=c.createLinearGradient(0,y+H/2-14,0,y+H/2+14); g.addColorStop(0,C.accentHi); g.addColorStop(.55,C.accent); g.addColorStop(1,C.accentLo); c.fillStyle=g; c.fill(); c.strokeStyle='rgba(255,242,200,.7)'; c.lineWidth=1; c.stroke(); G.icon(o.icon,c,x+24,y+H/2,15,C.bg); tx=x+46; }
   const rw=o.right?G.tw(o.right,6.4,800)+14:(o.act?18:6);
   G.txt(title,tx,y+(sub?H/2-11:H/2-6),8.2,o.col||C.ink,'left',x+w-tx-rw,800);
   if(sub) G.txt(sub,tx,y+H/2+2,6,C.dim,'left',x+w-tx-rw,700);
   if(o.right) G.txt(o.right,x+w-10,y+H/2-4,6.4,o.rightCol||C.sub,'right',undefined,800);
   else if(o.act) G.txt('›',x+w-12,y+H/2-8,12,C.accentText,'center',undefined,800);
  },
  enter(){ return o.act; }, tap(){ return o.act; }};
};

/* ---- the list itself ---- */
CL.List=function(){
 return { sc:{scroll:0}, f:-1, g0:G.gestureId,
  reset(){ this.sc.scroll=0; this.f=-1; this.g0=G.gestureId; },
  prep(items,area){ for(const it of items) if(it.measure) it.measure(area.w-16); return CL.layout(items)+8; },
  update(items,area,onAct){
   const H=this.prep(items,area);
   CL.scrollArea(this.sc,area,H);
   const F=items.map((it,i)=>it.focus?i:-1).filter(i=>i>=0);
   if(G.pressed.up||G.pressed.down){
    if(F.length){
     let k=F.indexOf(this.f);
     k=k<0?(G.pressed.down?0:F.length-1):Math.max(0,Math.min(F.length-1,k+(G.pressed.down?1:-1)));
     this.f=F[k]; const it=items[this.f];
     if(it.y<this.sc.scroll) this.sc.scroll=it.y;
     if(it.y+it.h>this.sc.scroll+area.h) this.sc.scroll=it.y+it.h-area.h;
     if(k===0) this.sc.scroll=0;
     AUDIO.sfx('blip');
    } else { this.sc.scroll+=G.pressed.down?40:-40; CL.scrollArea(this.sc,area,H); }
   }
   if(G.pressed.a&&items[this.f]&&items[this.f].focus){ const it=items[this.f]; const a=it.enter?it.enter():null; if(a!=null){ AUDIO.sfx('ok'); onAct(a); } return; }
   if(G.tapped(area.x,area.y,area.w,area.h)&&G.gestureId!==this.g0){
    const yy=G.ptr.rsy-area.y+this.sc.scroll;
    const it=items.find(i=>yy>=i.y&&yy<i.y+i.h);
    if(it&&it.tap){ this.f=items.indexOf(it); const a=it.tap(G.ptr.rsx-area.x-8,yy-it.y,area.w-16); if(a!=null){ AUDIO.sfx('ok'); onAct(a); } }
   }
  },
  draw(c,items,area){
   const H=this.prep(items,area), top=area.y, bot=area.y+area.h;
   c.save(); c.beginPath(); c.rect(area.x,top,area.w,area.h); c.clip();
   for(let i=0;i<items.length;i++){
    const it=items[i], y=top+it.y-this.sc.scroll;
    if(y>bot||y+it.h<top) continue;
    it.draw(c,area.x+8,y,area.w-16,G.kbMode&&this.f===i);
   }
   c.restore();
   G.scrollBar({x:area.x,y:top,w:area.w-2,h:area.h},H,this.sc.scroll);
  }
 };
};
})();
