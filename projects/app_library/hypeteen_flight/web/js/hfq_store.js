/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* THE DEVICE STORE (r7): IndexedDB for the things too big or too important for localStorage.
   - media:  Flight Record photos (re-encoded JPEG blobs + thumbnails, per cadet). Never sent anywhere.
   - snaps:  restore points, written automatically before a migration or an import, and on request. Each holds the exact
             strings that were in localStorage (the roster and the saves), so a restore puts back exactly what was there.
   Saves themselves stay in localStorage (small, synchronous, and what every older version reads).
   If IndexedDB is unavailable (some private windows), H.store.ok is false: photos and restore points are switched off and
   the screens say so; everything else keeps working. Database name keeps the legacy 'hfq' prefix (see hfq_version.js). */
(function(){
const H=G.HFQ;
const DB='hfq_device_v1', VER=1;
let dbp=null;
const S=H.store={ ok:typeof indexedDB!=='undefined', MAX_SNAPS:12 };
function open(){
 if(!S.ok) return Promise.reject(new Error('IndexedDB unavailable'));
 if(dbp) return dbp;
 dbp=new Promise((res,rej)=>{ let rq; try{ rq=indexedDB.open(DB,VER); }catch(e){ S.ok=false; rej(e); return; }
  rq.onupgradeneeded=()=>{ const d=rq.result; if(!d.objectStoreNames.contains('media')){ const m=d.createObjectStore('media',{keyPath:'id'}); m.createIndex('owner','owner'); } if(!d.objectStoreNames.contains('snaps')){ const s=d.createObjectStore('snaps',{keyPath:'id'}); s.createIndex('at','at'); } };
  rq.onsuccess=()=>res(rq.result); rq.onerror=()=>{ S.ok=false; rej(rq.error); }; rq.onblocked=()=>rej(new Error('database blocked'));
 }).catch(e=>{ dbp=null; S.ok=false; throw e; });
 return dbp;
}
const tx=(store,mode,fn)=>open().then(d=>new Promise((res,rej)=>{ const t=d.transaction(store,mode), os=t.objectStore(store); let out; const r=fn(os); if(r&&'onsuccess' in r){ r.onsuccess=()=>{ out=r.result; }; } t.oncomplete=()=>res(out); t.onerror=()=>rej(t.error); t.onabort=()=>rej(t.error||new Error('aborted')); }));
S.put=(store,v)=>tx(store,'readwrite',os=>os.put(v));
S.get=(store,k)=>tx(store,'readonly',os=>os.get(k));
S.del=(store,k)=>tx(store,'readwrite',os=>os.delete(k));
S.all=(store)=>tx(store,'readonly',os=>os.getAll());
S.byOwner=(owner)=>tx('media','readonly',os=>os.index('owner').getAll(owner));
S.check=()=>open().then(()=>true).catch(()=>false);
S.newId=p=>(p||'m')+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8);

/* ---- restore points ---- */
const KEYS=()=>{ const out=[]; for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); if(k&&k.indexOf(G.CFG.id+'_')===0) out.push(k); } return out.sort(); };
S.capture=function(){ const data={}; try{ for(const k of KEYS()) data[k]=localStorage.getItem(k); }catch(e){} return data; };
S.snapshot=function(reason,extra){
 const data=S.capture(), id=S.newId('snap');
 const v={id,at:Date.now(),reason:String(reason||'restore point').slice(0,80),app:H.VERSION.version,schema:H.VERSION.schema,keys:Object.keys(data).length,bytes:Object.values(data).reduce((a,s)=>a+(s?s.length:0),0),data,extra:extra||null};
 return S.put('snaps',v).then(()=>S.prune()).then(()=>v).catch(e=>{ console.warn('restore point not saved',e); return null; });
};
S.snaps=()=>S.all('snaps').then(a=>(a||[]).sort((x,y)=>y.at-x.at)).catch(()=>[]);
S.prune=()=>S.snaps().then(a=>Promise.all(a.slice(S.MAX_SNAPS).map(s=>S.del('snaps',s.id))));
/* put a restore point back, all or nothing: every key is written, then read back and compared; on any failure the
   keys are returned to what they were a moment ago. Returns true on success. */
S.restore=function(snap){
 const before=S.capture(), want=snap.data||{};
 const write=src=>{ for(const k of KEYS()) if(!(k in src)) localStorage.removeItem(k); for(const k in src) localStorage.setItem(k,src[k]); };
 try{ write(want); for(const k in want) if(localStorage.getItem(k)!==want[k]) throw new Error('verify failed for '+k); return true; }
 catch(e){ try{ write(before); }catch(e2){} console.warn('restore failed, rolled back',e); return false; }
};
})();
