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
const BUILD='dev';
const PRECACHE=[];
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
