/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* PAGE: a read-only text screen built from CONFIG.pages[id] - no code needed for About / Rules / FAQ / Contact pages.
   pages.<id> = {title, body:[ '# HEADING', 'a paragraph', ... ], links:[{label, href}] }
   Open with G.go('page',{id:'about', back:'dash'}) or a dashboard card with page:'about'. */
(function(){
const VW=G.VW, C=G.C, CL=G.CL;
G.scenes.page={
 enter(a){ this.back=a.back||G.homeScene(); this.id=a.id; this.p=(G.CFG.pages||{})[a.id]||{title:'MISSING PAGE',body:['No CONFIG.pages entry named "'+a.id+'".']}; this.list=CL.List(); this.lk=''; },
 area(){ return {x:4,y:46,w:VW-8,h:G.VH-50}; },
 items(){
  if(this._items) return this._items;
  const I=[];
  for(const s of this.p.body||[]){
   if(/^# /.test(s)) I.push(CL.hdr(s.slice(2).toUpperCase()));
   else I.push(CL.text(s,{size:7.2,col:C.sub}));
  }
  for(const l of this.p.links||[]) I.push(Object.assign(CL.row(l.label,l.sub||l.href.replace(/^https?:\/\//,''),{icon:'link',act:{href:l.href}}),{href:l.href}));
  return this._items=I;
 },
 /* link rows get a real <a> laid over them (moves with the scroll) */
 placeLinks(){
  const A=this.area(), I=this.items();
  I.forEach((it,i)=>{ if(!it.href) return;
   const y=A.y+it.y-this.list.sc.scroll, vis=y+it.h-6>A.y&&y<A.y+A.h;
   const id='plk'+i;
   if(!vis){ G.removeField(id); return; }
   const top=Math.max(A.y,y), h=Math.min(y+it.h-6,A.y+A.h)-top;
   G.linkField(id,{href:it.href,x:A.x+8,y:top,w:A.w-16,h});
  });
 },
 exit(){ this._items=null; },
 update(){
  if(G.backHit()){ G.go(this.back); return; }
  this.list.update(this.items(),this.area(),a=>{ if(a&&a.href) window.open(a.href,'_blank','noopener'); });
  this.placeLinks();
 },
 draw(c){
  G.backdrop(.9);
  this.list.draw(c,this.items(),this.area());
  G.topBar(this.p.title||'');
 }
};
})();
