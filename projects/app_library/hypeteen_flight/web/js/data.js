/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* DATA LAYER (G.data): one shared, Firestore-like database for every module.
   - Published as a claude.ai artifact with the `db` capability: window.claude.use('db') (shared by everyone you share with),
     and window.claude.use('user') tells us if the viewer is the OWNER.
   - Anywhere else (your computer, a preview): a LOCAL database with the same API, kept in this browser's localStorage,
     so the app works offline on one device. The first account created on a device is that device's owner.
   - To run on another backend (Firebase, Supabase...), make an object with the same shape and return it from connect().
   API used by modules (keep to these and any backend will do):
     db.collection(name).where(field, op, value).orderBy(field,'asc'|'desc').limit(n).get() / .onSnapshot(fn, err)
       ops: == != < <= > >= in array-contains ; snapshot = {size, docs:[{id, data()}]}
     db.doc('col/id').get() / .set(obj) / .update(obj) / .delete() / .onSnapshot(fn)
     db.collection(name).doc(id) is the same as db.doc(name+'/'+id)
   Helpers below (G.data.watch / add / remove / can) wrap the common cases. */
(function(){
const CFG=window.CONFIG;
const D=G.data={db:null,user:null,mode:'connecting',owner:false,ready:null,_cbs:[]};
D.newId=function(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,8); };

/* ---------- local database (same API, one device) ---------- */
function LocalDB(key){
 let store={};
 try{ store=JSON.parse(localStorage.getItem(key)||'{}')||{}; }catch(e){ store={}; }
 const ls=new Set(), notify=()=>{ for(const l of ls) setTimeout(l,0); };
 const save=()=>{ try{ localStorage.setItem(key,JSON.stringify(store)); }catch(e){ console.warn('local db full',e); } notify(); };
 addEventListener('storage',e=>{ if(e.key===key){ try{ store=JSON.parse(e.newValue||'{}')||{}; }catch(_){} notify(); } });   // other tabs
 const cp=x=>x===undefined?undefined:JSON.parse(JSON.stringify(x));
 const colDocs=col=>{ const out=[]; for(const p in store){ const i=p.lastIndexOf('/'); if(p.slice(0,i)===col) out.push({id:p.slice(i+1),data:store[p]}); } return out; };
 const snap=a=>({size:a.length,empty:!a.length,docs:a.map(x=>({id:x.id,data:()=>cp(x.data)}))});
 const test=(x,[f,op,v])=>{ const a=x.data[f]; switch(op){
  case '==': return a===v; case '!=': return a!==undefined&&a!==v; case '<': return a!==undefined&&a<v; case '<=': return a!==undefined&&a<=v;
  case '>': return a!==undefined&&a>v; case '>=': return a!==undefined&&a>=v; case 'in': return Array.isArray(v)&&v.indexOf(a)>=0;
  case 'array-contains': return Array.isArray(a)&&a.indexOf(v)>=0; default: return true; } };
 function Q(col,f,o,l){ this.col=col; this.f=f||[]; this.o=o||null; this.l=l||1000; }
 Q.prototype.where=function(f,op,v){ return new Q(this.col,this.f.concat([[f,op,v]]),this.o,this.l); };
 Q.prototype.orderBy=function(f,d){ return new Q(this.col,this.f,[f,d||'asc'],this.l); };
 Q.prototype.limit=function(n){ return new Q(this.col,this.f,this.o,n); };
 Q.prototype.run=function(){ let a=colDocs(this.col).filter(x=>this.f.every(c=>test(x,c)));
  if(this.o){ const [f,d]=this.o; a=a.filter(x=>x.data[f]!==undefined); a.sort((x,y)=>(x.data[f]<y.data[f]?-1:x.data[f]>y.data[f]?1:0)*(d==='desc'?-1:1)); }
  return a.slice(0,this.l); };
 Q.prototype.get=function(){ return Promise.resolve(snap(this.run())); };
 Q.prototype.onSnapshot=function(next,err){ const fire=()=>{ try{ next(snap(this.run())); }catch(e){ console.error(e); if(err) err(e); } }; setTimeout(fire,0); ls.add(fire); return ()=>ls.delete(fire); };
 Q.prototype.doc=function(id){ return new Doc(this.col+'/'+id); };
 function Doc(p){ this.path=p; this.id=p.slice(p.lastIndexOf('/')+1); }
 const ds=p=>({exists:p in store,id:p.slice(p.lastIndexOf('/')+1),data:()=>cp(store[p])});
 const merge=(x,y)=>{ for(const k in y){ if(y[k]&&typeof y[k]==='object'&&!Array.isArray(y[k])&&x[k]&&typeof x[k]==='object') merge(x[k],y[k]); else x[k]=y[k]; } return x; };
 Doc.prototype.get=function(){ return Promise.resolve(ds(this.path)); };
 Doc.prototype.set=function(d){ store[this.path]=cp(d); save(); return Promise.resolve(); };
 Doc.prototype.update=function(d){ if(!(this.path in store)) return Promise.reject(new Error('not found')); merge(store[this.path],cp(d)); save(); return Promise.resolve(); };
 Doc.prototype.delete=function(){ delete store[this.path]; save(); return Promise.resolve(); };
 Doc.prototype.collection=function(n){ return new Q(this.path+'/'+n); };
 Doc.prototype.onSnapshot=function(next){ const fire=()=>{ try{ next(ds(this.path)); }catch(e){ console.error(e); } }; setTimeout(fire,0); ls.add(fire); return ()=>ls.delete(fire); };
 return {collection:n=>new Q(n),doc:p=>new Doc(p),_local:true,_wipe(){ store={}; save(); }};
}

/* ---------- connect ---------- */
async function connect(){
 const use=window.claude&&window.claude.use?(n=>window.claude.use(n).catch(()=>null)):(()=>Promise.resolve(null));
 const [db,user]=await Promise.all([use('db'),use('user')]);
 if(db){
  D.db=db; D.user=user; D.mode='shared';
  if(user&&user.isOwner){ try{ D.owner=!!(await user.isOwner()); }catch(e){} }
  return;
 }
 if(!CFG.data||CFG.data.localFallback!==false){ D.db=LocalDB(CFG.id+'_localdb_v1'); D.mode='local'; return; }
 D.mode='offline';
}
D.init=function(){
 if(D.ready) return D.ready;
 D.ready=connect().catch(e=>{ console.warn('db',e); D.mode='offline'; }).then(()=>{ const cbs=D._cbs; D._cbs=[]; cbs.forEach(f=>f()); });
 return D.ready;
};
/* run fn once the database is known (now, if it already is) */
D.whenReady=function(fn){ if(D.mode!=='connecting') fn(); else D._cbs.push(fn); };

/* ---------- who may do what ---------- */
D.isOwner=function(){ return D.mode==='local'?!!(G.activeAcct&&G.activeAcct.owner):D.owner; };
D.isMember=function(){ return CFG.accounts&&CFG.accounts.enabled===false?true:!!G.activeAcct; };
D.can=function(need){ if(!need) return true; if(need==='owner') return D.isOwner(); if(need==='member') return D.isMember()||D.isOwner(); return false; };
/* the signed-in person, stamped onto everything they write */
D.me=function(){ const a=G.activeAcct; return {uid:a?a.id:(G.save&&G.save.uuid)||'guest',name:G.who()}; };

/* ---------- common cases ---------- */
/* live list of a collection, newest first by default. Returns unsubscribe(). cb(rows, err) with rows = [{id,...data}] */
D.watch=function(col,o,cb){
 o=o||{}; let un=null, dead=false;
 D.whenReady(()=>{
  if(dead) return;
  if(!D.db){ cb([], 'offline'); return; }
  let q=D.db.collection(col);
  for(const w of (o.where||[])) q=q.where(w[0],w[1],w[2]);
  q=q.orderBy(o.orderBy||'at',o.dir||'desc').limit(o.limit||200);
  un=q.onSnapshot(s=>cb(s.docs.map(d=>Object.assign({id:d.id},d.data()))),e=>cb([],e));
 });
 return ()=>{ dead=true; if(un){ try{ un(); }catch(e){} } };
};
/* add a document with an id, a timestamp and who wrote it */
D.add=function(col,data){
 if(!D.db) return Promise.reject(new Error('offline'));
 const id=D.newId(), me=D.me();
 return D.db.collection(col).doc(id).set(Object.assign({at:Date.now(),by:me.uid,byName:me.name},data)).then(()=>id);
};
D.remove=function(col,id){ return D.db?D.db.collection(col).doc(id).delete():Promise.reject(new Error('offline')); };
D.mine=function(row){ return !!row&&row.by===D.me().uid; };
/* a short line for the UI */
D.label=function(){ return {connecting:'CONNECTING…',shared:'SHARED',local:'THIS DEVICE ONLY',offline:'OFFLINE'}[D.mode]; };
})();
