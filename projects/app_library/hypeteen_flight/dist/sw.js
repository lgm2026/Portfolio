/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* THE OFFLINE SERVICE WORKER (r7, docs/02_AUDIT_REGISTER.md D05).
   After the first visit the whole academy works with the network off: lessons, games, the Library, the Explorer map and
   directory. Only links to outside websites need the internet.
   - dist/: tools/build.js fills PRECACHE with every file of the release and sets BUILD, so a new release installs a new
     cache and the old one is deleted on activation.
   - web/ (the source, no build): PRECACHE is empty, so on install the worker reads index.html and caches every script,
     stylesheet and icon it names; everything else is cached the first time it is fetched.
   Strategy: the page itself is network-first (a new release shows up when online), every other same-origin file is
   served from the cache and refreshed in the background. Nothing from another origin is ever cached or proxied, and no
   user data passes through here (profiles live in localStorage and IndexedDB). */
const BUILD="mvczzh1g-rxcyde";
const PRECACHE=["./","app.js","assets/art/badges/airliner.webp","assets/art/badges/biplane.webp","assets/art/badges/explorer.webp","assets/art/badges/firstflight.webp","assets/art/badges/flightplanning.webp","assets/art/badges/groundschool.webp","assets/art/badges/history.webp","assets/art/badges/jetliner.webp","assets/art/badges/jetops.webp","assets/art/badges/laurel.webp","assets/art/badges/maintenance.webp","assets/art/badges/mastercadet.webp","assets/art/badges/navigation.webp","assets/art/badges/radio.webp","assets/art/badges/weather.webp","assets/art/classroom-wall.webp","assets/art/env-classroom2.webp","assets/art/env-hangar2.webp","assets/art/env-lounge2.webp","assets/art/env-night.webp","assets/art/env-runway.webp","assets/art/env-terminal.webp","assets/art/env-tower.webp","assets/art/floors/classroom.webp","assets/art/floors/gameroom.webp","assets/art/floors/hangar.webp","assets/art/floors/lounge.webp","assets/art/floors/platform.webp","assets/art/floors/tower.webp","assets/art/floors/wash.webp","assets/art/gameroom-wall.webp","assets/art/hangar-wall.webp","assets/art/hero-strip.webp","assets/art/icons/achievements.webp","assets/art/icons/class.webp","assets/art/icons/crewboard.webp","assets/art/icons/flightbag.webp","assets/art/icons/hangar.webp","assets/art/icons/lounge.webp","assets/art/icons/map.webp","assets/art/icons/path.webp","assets/art/icons/profile.webp","assets/art/icons/settings.webp","assets/art/icons/tower.webp","assets/art/landing.webp","assets/art/lounge-wall.webp","assets/art/manifest.json","assets/art/platform-sky.webp","assets/art/ramp-sky.webp","assets/art/runway-sky.webp","assets/art/tower-sky.webp","assets/art/wash-wall.webp","assets/brand/apple-touch-icon.png","assets/brand/htfa_emblem.webp","assets/brand/htfa_icon.svg","assets/brand/htfa_insignia.svg","assets/brand/icon-192.png","assets/brand/icon-512.png","assets/brand/icon-maskable-512.png","assets/fonts/OFL-CormorantGaramond.txt","assets/fonts/OFL-EBGaramond.txt","assets/fonts/OFL-Rubik.txt","assets/fonts/cormorant-garamond-latin-600-normal.woff2","assets/fonts/cormorant-garamond-latin-700-normal.woff2","assets/fonts/eb-garamond-latin-400-italic.woff2","assets/fonts/eb-garamond-latin-400-normal.woff2","assets/fonts/eb-garamond-latin-600-normal.woff2","assets/fonts/rubik-latin-400-normal.woff2","assets/fonts/rubik-latin-600-normal.woff2","assets/fonts/rubik-latin-700-normal.woff2","assets/fonts/rubik-latin-800-normal.woff2","assets/hfq_logo.svg","assets/logo.svg","assets/series/htfa-book1-cover.webp","assets/series/htfa-book2-cover.webp","assets/series/htfa-book3-cover.webp","assets/series/htfa-book4-cover.webp","assets/series/htfa-book5-cover.webp","assets/series/htfa-book6-cover.webp","assets/series/htfa-book7-cover.webp","boot.js","css/fonts.css","css/htfa.css","js/content/lazy/explorer/basemap.js","js/content/lazy/series/htfa-1.js","js/content/lazy/series/htfa-2.js","js/content/lazy/series/htfa-3.js","js/content/lazy/series/htfa-4.js","js/content/lazy/series/htfa-5.js","js/content/lazy/series/htfa-6.js","js/content/lazy/series/htfa-7.js","manifest.webmanifest"];
const CACHE='htfa-'+BUILD;
const listFromIndex=html=>{ const out=new Set(['./']); const re=/(?:src|href)="([^"#?]+)"/g; let m; while((m=re.exec(html))){ const u=m[1]; if(!/^(https?:|data:|mailto:)/.test(u)) out.add(u); } return [...out]; };
self.addEventListener('install',e=>{
 e.waitUntil((async()=>{
  const c=await caches.open(CACHE);
  let list=PRECACHE;
  if(!list.length){ try{ const r=await fetch('./',{cache:'no-cache'}); list=listFromIndex(await r.text()); }catch(err){ list=['./']; } }
  // one failed file must not stop the rest from being cached
  await Promise.all(list.map(u=>c.add(new Request(u,{cache:'no-cache'})).catch(()=>{})));
  await self.skipWaiting();
 })());
});
self.addEventListener('activate',e=>{
 e.waitUntil((async()=>{ const keys=await caches.keys(); await Promise.all(keys.filter(k=>k.indexOf('htfa-')===0&&k!==CACHE).map(k=>caches.delete(k))); await self.clients.claim(); })());
});
self.addEventListener('fetch',e=>{
 const r=e.request; if(r.method!=='GET') return;
 const u=new URL(r.url); if(u.origin!==self.location.origin) return;   // outside websites: straight to the network, never cached
 if(r.mode==='navigate'){
  e.respondWith((async()=>{ try{ const res=await fetch(r); if(res.ok){ const c=await caches.open(CACHE); c.put('./',res.clone()); } return res; }
   catch(err){ return (await caches.match('./'))||(await caches.match('index.html'))||Response.error(); } })());
  return;
 }
 e.respondWith((async()=>{
  const hit=await caches.match(r,{ignoreSearch:true});
  const net=fetch(r).then(async res=>{ if(res.ok&&res.type==='basic'){ const c=await caches.open(CACHE); c.put(r,res.clone()); } return res; }).catch(()=>null);
  if(hit){ e.waitUntil(net); return hit; }
  return (await net)||Response.error();
 })());
});
