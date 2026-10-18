/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* OFFLINE + STORAGE HEALTH (r7). Registers the service worker (sw.js) where the browser allows it, asks for persistent
   storage, and keeps a small, honest status the Settings screen shows: is the app ready offline, is storage persistent,
   how much space is used, and when was the last backup made. Nothing here sends anything anywhere.
   A service worker cannot run from file:// or inside some sandboxed frames (a published preview); the app then still
   works, it just needs the network to start. */
(function(){
const H=G.HFQ;
H.offline={ supported:false, ready:false, persisted:null, usage:null, quota:null, error:null };
const O=H.offline;
try{
 if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol)){
  O.supported=true;
  addEventListener('load',()=>{
   navigator.serviceWorker.register('sw.js').then(reg=>{ O.ready=!!(reg.active||navigator.serviceWorker.controller); if(reg.installing) reg.installing.addEventListener('statechange',ev=>{ if(ev.target.state==='activated') O.ready=true; }); })
    .catch(err=>{ O.supported=false; O.error=String(err&&err.message||err).slice(0,120); });
   let reloaded=false;
   navigator.serviceWorker.addEventListener('controllerchange',()=>{ O.ready=true; if(reloaded) return; reloaded=true; if(G.scene) G.toast('READY TO FLY OFFLINE',G.C.good); });
  });
 }
}catch(e){ O.supported=false; O.error=String(e&&e.message||e).slice(0,120); }
/* storage: persistent where granted (the browser then won't clear it to free space), plus usage figures */
H.storageStatus=async function(){
 try{ if(navigator.storage&&navigator.storage.persisted) O.persisted=await navigator.storage.persisted(); }catch(e){}
 try{ if(navigator.storage&&navigator.storage.estimate){ const e=await navigator.storage.estimate(); O.usage=e.usage||0; O.quota=e.quota||0; } }catch(e){}
 return O;
};
H.requestPersist=async function(){ try{ if(navigator.storage&&navigator.storage.persist) O.persisted=await navigator.storage.persist(); }catch(e){} return O.persisted; };
})();
