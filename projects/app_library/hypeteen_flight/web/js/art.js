/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* PAINTED ART SLOTS (App Shell v1.4): every piece of code-drawn art can be replaced by an image, one at a time, with no code.
   Put images in assets/art/ and list them in assets/art/manifest.json:
     { "prop:pool": "assets/art/pool.png",                                    a floor prop, by its art name (feet at the bottom center)
       "station:lounge:pool": {"src":"assets/art/lounge-pool.png","w":140,"h":80,"ax":0.5,"ay":1},   one station in one room (overrides prop:)
       "wall:cork": "assets/art/cork.png",                                    a wall art, drawn over the station's wall slot
       "room:lounge:wall": "assets/art/lounge-wall.png",                      a whole back wall (R.w x R.wall world units)
       "room:runway:wall": "assets/art/runway-sky.png",                       outdoors (wallStyle sky/open): the sky band, from 200 units left of the floor to past its right edge
       "room:lounge:floor": "assets/art/lounge-floor.png",                    a whole floor (R.w x (R.h-R.wall)), drawn in the floor plane, so it recedes
       "npc:captain": {"src":"assets/art/captain.png","w":30,"h":46},         a person (feet at the bottom center)
       "ac:c172": "assets/art/c172.png",                                      an aircraft side view (nose right), in place of the model
       "book:forces": "assets/art/forces-cover.png" }                         a book cover in the Library
   An entry is a path, or {src, w, h, ax, ay, fit:'cover', fx, fy}: fit:'cover' fills the slot and crops around (fx,fy); w/h in world units (default: the slot's width, the image's aspect), ax/ay the
   anchor (0..1; default feet at the bottom center). Missing manifest, missing file or a bad image: the code art draws instead.
   G.ART.has(key) / G.ART.img(key) / G.ART.draw(c,key,x,y,w,h) / G.ART.sprite(c,key,fp,h) */
(function(){
const A=G.ART={man:{},imgs:{},ready:false,url:'assets/art/manifest.json',
 load(url){ url=url||A.url; try{ fetch(url,{cache:'no-cache'}).then(r=>r.ok?r.json():{}).then(m=>{ A.man=(m&&typeof m==='object')?m:{}; A.ready=true; }).catch(()=>{ A.ready=true; }); }catch(e){ A.ready=true; } },
 add(man){ Object.assign(A.man,man||{}); },
 has(key){ return !!A.man[key]; },
 entry(key){ const e=A.man[key]; return e?(typeof e==='string'?{src:e}:e):null; },
 img(key){ const e=A.entry(key); if(!e) return null; let im=A.imgs[key]; if(!im){ im=new Image(); im.onerror=()=>{ im.bad=true; }; im.src=e.src; A.imgs[key]=im; } return (im.complete&&im.naturalWidth&&!im.bad)?im:null; },
 draw(c,key,x,y,w,h){ const im=A.img(key); if(!im) return false; const e=A.entry(key);
  if(e&&e.fit==='cover'){ const iw=im.naturalWidth, ih=im.naturalHeight, k=Math.max(w/iw,h/ih), sw=w/k, sh=h/k, fx=e.fx==null?.5:e.fx, fy=e.fy==null?.5:e.fy; c.drawImage(im,(iw-sw)*fx,(ih-sh)*fy,sw,sh,x,y,w,h); return true; }   // {fit:'cover', fx, fy}: fill the slot, cropping around a focal point (0..1)
  c.drawImage(im,x,y,w,h); return true; },
 /* a painted icon disc centred at (cx,cy) with diameter d (slot icon:<name>); false when there is none */
 disc(c,name,cx,cy,d,dim){ const key='icon:'+name, im=A.img(key); if(!A.has(key)||!im) return false; c.save(); if(dim) c.globalAlpha=.55; c.drawImage(im,cx-d/2,cy-d/2,d,d); c.restore(); return true; },
 /* an upright sprite standing on a projected footprint fp=[X0,Y0,X1,Y1] (feet on the near edge), h tall */
 sprite(c,key,fp,h){ const e=A.entry(key), im=A.img(key); if(!im) return false; const w=fp[2]-fp[0], sw=e.w||w, sh=e.h||sw*im.naturalHeight/im.naturalWidth, ax=e.ax==null?.5:e.ax, ay=e.ay==null?1:e.ay, cx=(fp[0]+fp[2])/2, by=fp[3];
  c.drawImage(im,cx-sw*ax,by-sh*ay,sw,sh); return true; },
 /* a person: feet at (x,y), about 44 tall unless the entry says otherwise */
 person(c,key,x,y){ const e=A.entry(key), im=A.img(key); if(!im) return false; const sh=e.h||44, sw=e.w||sh*im.naturalWidth/im.naturalHeight; c.drawImage(im,x-sw*(e.ax==null?.5:e.ax),y-sh*(e.ay==null?1:e.ay),sw,sh); return true; }
};
A.load();
})();
