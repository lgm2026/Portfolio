/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* PORTABLE PROFILES: BACKUP AND RESTORE (r7, Gate 5). No accounts, no cloud: a family saves a backup FILE and keeps it.
   The file (.htfa, JSON; format in docs/BACKUP_FORMAT.md):
     {format:'htfa-backup', formatVersion:1, app:{name,version,build}, schema, created, scope:'profile'|'household',
      household?:{photos, localdb?}, profiles:[{id, callsign, roster, save, media:[{id,entry,type,w,h,bytes,sha256,data}]}],
      manifest:[{path, bytes, sha256}], integrity:{alg:'SHA-256', digest}}
   Optional passphrase: the whole file is encrypted with AES-256-GCM, key from PBKDF2-SHA-256 (600,000 iterations, 16-byte
   salt); {format:'htfa-backup-encrypted', kdf, cipher, ciphertext}. WebCrypto only; nothing home-made.
   The checksum detects damage. It is not proof against someone editing the file on purpose (there is no server to vouch).
   Restoring: read (60 MB cap) -> decrypt -> parse -> validate every field by type and size (unknown or oversized data is
   dropped) -> preview (what is in the file, what is on this device) -> choose per profile: add, merge or replace -> an
   automatic restore point -> write everything, read it back, compare; any failure puts the old data back -> photos ->
   UNDO THIS IMPORT stays available as a restore point. A JSON file has no paths and nothing to unzip, so there is no
   path-traversal or zip-bomb surface; photos are decoded and re-encoded, never trusted as files.
   Merge rules (documented in docs/BACKUP_FORMAT.md): never add scores together; for every record keep the better result
   (more stars, higher best, earlier first-earned date); union lists by id; settings and looks stay as they are here. */
(function(){
const H=G.HFQ, UI=H.UI, h=UI.h;
const sfx=n=>{ try{ AUDIO.sfx(n); }catch(e){} };
const B=H.BACKUP={ FORMAT:'htfa-backup', ENC:'htfa-backup-encrypted', FV:1, MAX_FILE:60*1024*1024, MAX_PROFILES:20, ITER:600000 };
UI.host('backup',a=>({view:'backup',args:{},back:a.back||(H.isHub()?'hub':'settings')}));
UI.host('prefs',a=>({view:'settings',args:{},back:a.back||'settings'}));
/* the canvas Settings page links here (one row: Backup, Terms and privacy) */
(function(){ const L=G.CFG.settingsLinks||[]; const t=L.find(l=>l.id==='terms'); if(t){ t.label='CONTROLS, BACKUP + PRIVACY'; t.scene='prefs'; } else L.push({id:'terms',label:'CONTROLS, BACKUP + PRIVACY',scene:'prefs'}); G.CFG.settingsLinks=L; })();

/* ---------------- bytes, base64, hashing ---------------- */
const enc=new TextEncoder(), dec=new TextDecoder();
const b64=u8=>{ let s=''; const C=0x8000; for(let i=0;i<u8.length;i+=C) s+=String.fromCharCode.apply(null,u8.subarray(i,i+C)); return btoa(s); };
const unb64=s=>{ const bin=atob(s); const u=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) u[i]=bin.charCodeAt(i); return u; };
const subtle=(window.crypto&&crypto.subtle)?crypto.subtle:null;
B.cryptoOk=!!subtle;
/* SHA-256: WebCrypto where available (https, localhost); a plain implementation only for file:// (checksums only) */
function sha256js(u8){ const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
 const l=u8.length, n=((l+9+63)>>6)<<6, m=new Uint8Array(n); m.set(u8); m[l]=0x80; const bits=l*8; for(let i=0;i<8;i++) m[n-1-i]=Math.floor(bits/Math.pow(2,8*i))&255;
 let a0=0x6a09e667,b0=0xbb67ae85,c0=0x3c6ef372,d0=0xa54ff53a,e0=0x510e527f,f0=0x9b05688c,g0=0x1f83d9ab,h0=0x5be0cd19; const w=new Int32Array(64), r=(x,k)=>(x>>>k)|(x<<(32-k));
 for(let o=0;o<n;o+=64){ for(let i=0;i<16;i++) w[i]=(m[o+4*i]<<24)|(m[o+4*i+1]<<16)|(m[o+4*i+2]<<8)|m[o+4*i+3]; for(let i=16;i<64;i++){ const s0=r(w[i-15],7)^r(w[i-15],18)^(w[i-15]>>>3), s1=r(w[i-2],17)^r(w[i-2],19)^(w[i-2]>>>10); w[i]=(w[i-16]+s0+w[i-7]+s1)|0; }
  let a=a0,b=b0,c=c0,d=d0,e=e0,f=f0,g=g0,hh=h0; for(let i=0;i<64;i++){ const S1=r(e,6)^r(e,11)^r(e,25), ch=(e&f)^(~e&g), t1=(hh+S1+ch+K[i]+w[i])|0, S0=r(a,2)^r(a,13)^r(a,22), mj=(a&b)^(a&c)^(b&c), t2=(S0+mj)|0; hh=g; g=f; f=e; e=(d+t1)|0; d=c; c=b; b=a; a=(t1+t2)|0; }
  a0=(a0+a)|0; b0=(b0+b)|0; c0=(c0+c)|0; d0=(d0+d)|0; e0=(e0+e)|0; f0=(f0+f)|0; g0=(g0+g)|0; h0=(h0+hh)|0; }
 return [a0,b0,c0,d0,e0,f0,g0,h0].map(x=>('00000000'+(x>>>0).toString(16)).slice(-8)).join(''); }
B.sha256=async function(data){ const u8=typeof data==='string'?enc.encode(data):data; if(subtle){ const d=new Uint8Array(await subtle.digest('SHA-256',u8)); return [...d].map(x=>x.toString(16).padStart(2,'0')).join(''); } return sha256js(u8); };
/* canonical JSON: keys sorted, so the same data always gives the same checksum */
const canon=v=>v===null||typeof v!=='object'?JSON.stringify(v):(Array.isArray(v)?'['+v.map(canon).join(',')+']':'{'+Object.keys(v).filter(k=>v[k]!==undefined).sort().map(k=>JSON.stringify(k)+':'+canon(v[k])).join(',')+'}');
B.canon=canon;

/* ---------------- encryption (AES-256-GCM, PBKDF2-SHA-256) ---------------- */
async function keyFrom(pass,salt,iter){ const base=await subtle.importKey('raw',enc.encode(pass),'PBKDF2',false,['deriveKey']); return subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',salt,iterations:iter},base,{name:'AES-GCM',length:256},false,['encrypt','decrypt']); }
B.encrypt=async function(text,pass){ if(!subtle) throw new Error('Encryption needs a secure page (https).'); const salt=crypto.getRandomValues(new Uint8Array(16)), iv=crypto.getRandomValues(new Uint8Array(12)), k=await keyFrom(pass,salt,B.ITER);
 const ct=new Uint8Array(await subtle.encrypt({name:'AES-GCM',iv},k,enc.encode(text))); return JSON.stringify({format:B.ENC,formatVersion:B.FV,kdf:{name:'PBKDF2',hash:'SHA-256',iterations:B.ITER,salt:b64(salt)},cipher:{name:'AES-GCM',iv:b64(iv),tagLength:128},ciphertext:b64(ct)}); };
B.decrypt=async function(obj,pass){ if(!subtle) throw new Error('Opening an encrypted backup needs a secure page (https).');
 const it=obj.kdf&&obj.kdf.iterations; if(!(obj.kdf&&obj.kdf.name==='PBKDF2'&&obj.kdf.hash==='SHA-256'&&Number.isInteger(it)&&it>=100000&&it<=5000000&&obj.cipher&&obj.cipher.name==='AES-GCM'&&typeof obj.ciphertext==='string')) throw new Error('This encrypted backup is not in a format this app knows.');
 const k=await keyFrom(pass,unb64(obj.kdf.salt),it); try{ return dec.decode(await subtle.decrypt({name:'AES-GCM',iv:unb64(obj.cipher.iv)},k,unb64(obj.ciphertext))); }catch(e){ throw new Error('Wrong passphrase, or the file is damaged.'); } };

/* ---------------- what is on this device ---------------- */
const acctKey=id=>G.KEYS.acct(id);
function readSave(key){ try{ return JSON.parse(localStorage.getItem(key)||'null'); }catch(e){ return null; } }
const ROSTER_KEYS={name:'s16',pinH:'s16',created:'n',lastLogin:'n',owner:'b',av:'o',xp:'n',flights:'n',wk:'s16',wkxp:'n',ac:'o',photo:'skip'};
function rosterPublic(a){ const o={}; for(const k in ROSTER_KEYS){ if(ROSTER_KEYS[k]==='skip') continue; if(a[k]!==undefined) o[k]=a[k]; } return o; }
async function mediaFor(owner,withPhotos){ if(!withPhotos||!H.store.ok) return []; const list=await H.store.byOwner(owner).catch(()=>[]); const out=[];
 for(const r of list){ const u8=new Uint8Array(await r.blob.arrayBuffer()); out.push({id:r.id,entry:r.entry||null,type:r.type,w:r.w,h:r.h,bytes:u8.length,sha256:await B.sha256(u8),data:b64(u8)}); } return out; }
B.build=async function(scope,o){ o=o||{};
 const profiles=[], me=G.activeAcct;
 const list=scope==='household'?G.roster.accounts.slice():(me?[me]:[]);
 if(!list.length&&scope!=='household'){ G.persist(); profiles.push({id:'guest',callsign:'GUEST',roster:{},save:readSave(G.KEYS.guest)||G.save,media:await mediaFor('guest',o.photos)}); }
 for(const a of list){ if(me&&a.id===me.id) G.persist(); const s=readSave(acctKey(a.id)); if(!s) continue; profiles.push({id:a.id,callsign:a.name,roster:rosterPublic(a),save:s,media:await mediaFor(a.id,o.photos)}); }
 const body={format:B.FORMAT,formatVersion:B.FV,app:{name:H.VERSION.name,version:H.VERSION.version,build:(window.HFQ_BUILD&&window.HFQ_BUILD.id)||'source'},schema:H.VERSION.schema,created:new Date().toISOString(),scope,
  household:scope==='household'?{photos:!!G.roster.photos,localdb:(()=>{ try{ return localStorage.getItem(G.CFG.id+'_localdb_v1'); }catch(e){ return null; } })()}:null,profiles};
 const manifest=[]; for(let i=0;i<profiles.length;i++){ const s=canon(profiles[i].save); manifest.push({path:'profiles/'+i+'/save',bytes:s.length,sha256:await B.sha256(s)}); profiles[i].media.forEach((m,j)=>manifest.push({path:'profiles/'+i+'/media/'+j,bytes:m.bytes,sha256:m.sha256})); }
 body.manifest=manifest;
 body.integrity={alg:'SHA-256',of:'canonical JSON of every field except integrity',digest:await B.sha256(canon(body))};
 return body;
};
B.download=function(text,name){ const blob=new Blob([text],{type:'application/json'}), url=URL.createObjectURL(blob), a=h('a',{href:url,download:name,style:{display:'none'}}); document.body.appendChild(a); a.click(); setTimeout(()=>{ URL.revokeObjectURL(url); a.remove(); },4000); };
B.exportFile=async function(scope,o){ o=o||{}; const body=await B.build(scope,o); let text=JSON.stringify(body);
 if(o.pass) text=await B.encrypt(text,o.pass);
 const who=scope==='household'?'household':(G.activeAcct?G.activeAcct.name:'guest'), name='htfa-backup-'+who.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'-'+UI.ymd()+(o.pass?'-locked':'')+'.htfa';
 B.download(text,name); const m=G.save.mod; m.ui=m.ui||{}; m.ui.lastBackup=Date.now(); G.roster.lastBackup=Date.now(); G.saveRoster(); G.persist();
 return {name,bytes:text.length,profiles:body.profiles.length,photos:body.profiles.reduce((n,p)=>n+p.media.length,0)}; };

/* ---------------- reading a file: validate everything ---------------- */
const BAD_KEYS=new Set(['__proto__','constructor','prototype']);
function sanitize(v,lim,depth){ depth=depth||0; if(++lim.nodes>lim.maxNodes) throw new Error('The file holds more data than a profile can.');
 if(v===null||typeof v==='boolean') return v; if(typeof v==='number') return isFinite(v)?v:0; if(typeof v==='string') return v.length>lim.maxStr?v.slice(0,lim.maxStr):v;
 if(depth>lim.maxDepth) return undefined;
 if(Array.isArray(v)){ const out=[]; for(let i=0;i<Math.min(v.length,lim.maxArr);i++){ const x=sanitize(v[i],lim,depth+1); if(x!==undefined) out.push(x); } return out; }
 if(typeof v==='object'){ const out={}; for(const k of Object.keys(v)){ if(BAD_KEYS.has(k)||k.length>80) continue; const x=sanitize(v[k],lim,depth+1); if(x!==undefined) out[k]=x; } return out; }
 return undefined; }
const isObj=v=>v&&typeof v==='object'&&!Array.isArray(v);
function checkSave(s){ if(!isObj(s)) throw new Error('A profile in the file has no save data.');
 if(typeof s.points!=='number'||s.points<0||s.points>1e7) s.points=Math.max(0,Math.min(1e7,+s.points||0));
 s.ach=isObj(s.ach)?s.ach:{}; for(const k in s.ach) if(typeof s.ach[k]!=='number') delete s.ach[k];
 s.settings=isObj(s.settings)?s.settings:{}; for(const k in s.settings) if(typeof s.settings[k]!=='boolean') delete s.settings[k];
 s.best=isObj(s.best)?s.best:{}; s.seen=isObj(s.seen)?s.seen:{}; s.mod=isObj(s.mod)?s.mod:{};
 if(typeof s.mod.v!=='number') s.mod.v=1; if(s.mod.v>H.PROFILE.SCHEMA) throw new Error('This backup comes from a newer version of the app. Update the app, then restore it.');
 if(typeof s.name!=='string') s.name=''; s.name=s.name.slice(0,16); return s; }
const ID_RE=/^[a-z0-9_-]{1,40}$/i, CS_RE=/^[A-Z0-9][A-Z0-9 \-']{0,15}$/i;
B.parse=async function(text,pass){
 if(typeof text!=='string'||!text.length) throw new Error('That file is empty.');
 if(text.length>B.MAX_FILE) throw new Error('That file is too big to be a backup.');
 let obj; try{ obj=JSON.parse(text); }catch(e){ throw new Error('That is not a HypeTeen Flight Academy backup file.'); }
 if(isObj(obj)&&obj.format===B.ENC){ if(pass==null){ const err=new Error('This backup is locked with a passphrase.'); err.needPass=true; throw err; } text=await B.decrypt(obj,pass); try{ obj=JSON.parse(text); }catch(e){ throw new Error('The unlocked file is damaged.'); } }
 if(!isObj(obj)||obj.format!==B.FORMAT) throw new Error('That is not a HypeTeen Flight Academy backup file.');
 if(!Number.isInteger(obj.formatVersion)||obj.formatVersion>B.FV) throw new Error('This backup comes from a newer version of the app. Update the app first.');
 if(typeof obj.schema==='number'&&obj.schema>H.PROFILE.SCHEMA) throw new Error('This backup comes from a newer version of the app. Update the app first.');
 // integrity: the checksum over everything except itself (damage detection)
 const claimed=obj.integrity&&obj.integrity.digest; const copy=Object.assign({},obj); delete copy.integrity;
 const ok=typeof claimed==='string'&&claimed===await B.sha256(canon(copy));
 if(!ok) throw new Error('This backup file is damaged or was changed after it was saved, so it was not used.');
 if(!Array.isArray(obj.profiles)||!obj.profiles.length||obj.profiles.length>B.MAX_PROFILES) throw new Error('The backup holds no profiles this app can read.');
 const lim={nodes:0,maxNodes:400000,maxStr:5000,maxArr:20000,maxDepth:12}, out=[];
 for(const p of obj.profiles){ if(!isObj(p)||!ID_RE.test(String(p.id||''))) continue;
  const cs=String(p.callsign||'').toUpperCase().slice(0,16); if(p.id!=='guest'&&!CS_RE.test(cs)) continue;
  const save=checkSave(sanitize(p.save,lim));
  const r=isObj(p.roster)?p.roster:{}, roster={};
  for(const k in ROSTER_KEYS){ const t=ROSTER_KEYS[k], v=r[k]; if(v==null||t==='skip') continue; if(t==='n'&&typeof v==='number'&&isFinite(v)) roster[k]=v; else if(t==='s16'&&typeof v==='string') roster[k]=v.slice(0,16); else if(t==='b'&&typeof v==='boolean') roster[k]=v; else if(t==='o'&&isObj(v)) roster[k]=sanitize(v,lim); }
  const media=[]; for(const m of Array.isArray(p.media)?p.media.slice(0,200):[]){ if(!isObj(m)||typeof m.data!=='string'||m.data.length>11*1024*1024||!/^image\/(jpeg|png|webp)$/.test(String(m.type))) continue; media.push({id:ID_RE.test(String(m.id))?m.id:H.store.newId('p'),entry:typeof m.entry==='string'?m.entry.slice(0,40):null,type:m.type,data:m.data,sha256:typeof m.sha256==='string'?m.sha256:''}); }
  out.push({id:p.id,callsign:cs||'GUEST',roster,save,media});
 }
 if(!out.length) throw new Error('The backup holds no profiles this app can read.');
 return {meta:{app:isObj(obj.app)?{name:String(obj.app.name||'').slice(0,60),version:String(obj.app.version||'').slice(0,20)}:{},created:String(obj.created||'').slice(0,40),scope:obj.scope==='household'?'household':'profile'},household:isObj(obj.household)?{photos:!!obj.household.photos,localdb:typeof obj.household.localdb==='string'&&obj.household.localdb.length<4e6?obj.household.localdb:null}:null,profiles:out};
};

/* ---------------- merging two saves of the same profile (never invent, never add up) ---------------- */
const maxN=(a,b)=>Math.max(+a||0,+b||0), earliest=(a,b)=>a&&b?Math.min(a,b):(a||b);
function unionBy(a,b,key,pick){ const m=new Map(); (a||[]).forEach(x=>m.set(x[key],x)); (b||[]).forEach(x=>{ const k=x[key]; if(!m.has(k)) m.set(k,x); else m.set(k,pick(m.get(k),x)); }); return [...m.values()]; }
const later=(x,y)=>((y.up||y.at||0)>(x.up||x.at||0)?y:x);
B.merge=function(local,inc){
 const s=JSON.parse(JSON.stringify(local)), I=inc; s.points=maxN(s.points,I.points);
 s.ach=s.ach||{}; for(const k in I.ach||{}) s.ach[k]=earliest(s.ach[k],I.ach[k]);
 const m=s.mod=s.mod||{}, im=I.mod||{};
 for(const k in im) if(!(k in m)) m[k]=im[k];   // whole sections the device does not have yet
 const fl=m.fl, ifl=im.fl; if(fl&&ifl&&fl!==ifl){ fl.l=fl.l||{}; for(const id in ifl.l||{}){ const a=fl.l[id], b=ifl.l[id]; if(!a) fl.l[id]=b; else { const keep=(a.tested&&!b.tested)?b:((b.tested&&!a.tested)?a:(b.stars>a.stars?b:a)); fl.l[id]=Object.assign({},keep,{stars:Math.max(a.stars||0,b.stars||0),best:maxN(a.best,b.best),runs:maxN(a.runs,b.runs),at:Math.max(a.at||0,b.at||0)}); } }
  fl.miss=fl.miss||{}; for(const q in ifl.miss||{}) fl.miss[q]=fl.miss[q]?{n:Math.max(fl.miss[q].n,ifl.miss[q].n),at:Math.max(fl.miss[q].at||0,ifl.miss[q].at||0)}:ifl.miss[q];
  fl.drill=fl.drill||{}; for(const u in ifl.drill||{}){ const a=fl.drill[u], b=ifl.drill[u]; fl.drill[u]=a?{best:maxN(a.best,b.best),gold:!!(a.gold||b.gold),plays:maxN(a.plays,b.plays)}:b; }
  if(ifl.trivia){ const a=fl.trivia||{}; fl.trivia=Object.assign({},a,{best:maxN(a.best,ifl.trivia.best),plays:maxN(a.plays,ifl.trivia.plays)}); }
  fl.flash=fl.flash||{}; for(const u in ifl.flash||{}) fl.flash[u]=earliest(fl.flash[u],ifl.flash[u]);
  if(ifl.streak&&fl.streak){ const a=fl.streak, b=ifl.streak; const pick=(b.last||'')>(a.last||'')?b:a; fl.streak={n:pick.n,last:pick.last,best:Math.max(a.best||0,b.best||0)}; }
  fl.placed=fl.placed||ifl.placed; }
 const gs=m.gs, igs=im.gs; if(gs&&igs&&gs!==igs){ gs.done=gs.done||{}; for(const u in igs.done||{}) gs.done[u]=gs.done[u]?Math.max(+gs.done[u]||0,+igs.done[u]||0)||gs.done[u]:igs.done[u]; gs.seen=gs.seen||{}; for(const u in igs.seen||{}) gs.seen[u]=earliest(gs.seen[u],igs.seen[u]); }
 const lb=m.lib, ilb=im.lib; if(lb&&ilb&&lb!==ilb){ lb.read=lb.read||{}; for(const b in ilb.read||{}) lb.read[b]=earliest(lb.read[b],ilb.read[b]); lb.quiz=lb.quiz||{}; for(const b in ilb.quiz||{}){ const a=lb.quiz[b], c=ilb.quiz[b]; lb.quiz[b]=a?{best:maxN(a.best,c.best),plays:maxN(a.plays,c.plays),passed:!!(a.passed||c.passed),aced:!!(a.aced||c.aced)}:c; } lb.pos=lb.pos||{}; for(const b in ilb.pos||{}) lb.pos[b]=Math.max(lb.pos[b]||0,ilb.pos[b]||0); }
 const gm=m.games, igm=im.games; if(gm&&igm&&gm!==igm){ for(const id in igm){ if(id==='day') continue; const a=gm[id], b=igm[id], def=H.gameById&&H.gameById(id), low=def&&def.best==='low'; if(!a){ gm[id]=b; continue; } const best=a.best==null?b.best:(b.best==null?a.best:(low?Math.min(a.best,b.best):Math.max(a.best,b.best))); gm[id]={plays:maxN(a.plays,b.plays),best,at:Math.max(a.at||0,b.at||0)}; } }
 if(m.flog&&im.flog&&m.flog!==im.flog) m.flog.e=unionBy(m.flog.e,im.flog.e,'id',later);
 if(m.journal&&im.journal&&m.journal!==im.journal){ m.journal.e=unionBy(m.journal.e,im.journal.e,'id',later); m.journal.goals=unionBy(m.journal.goals,im.journal.goals,'id',later); }
 if(m.read&&im.read&&m.read!==im.read) for(const d in im.read){ const a=m.read[d], b=im.read[d]; if(!a){ m.read[d]=b; continue; } const far=(b.ch>a.ch||(b.ch===a.ch&&b.f>a.f))?b:a; m.read[d]=Object.assign({},far,{bm:unionBy(a.bm,b.bm,'at',(x)=>x),done:earliest(a.done,b.done)}); }
 if(m.visits&&im.visits&&m.visits!==im.visits) for(const d in im.visits) m.visits[d]=m.visits[d]?{at:earliest(m.visits[d].at,im.visits[d].at),entry:m.visits[d].entry||im.visits[d].entry}:im.visits[d];
 const w=m.world, iw=im.world; if(w&&iw&&w!==iw){ w.visited=w.visited||{}; for(const k in iw.visited||{}) w.visited[k]=earliest(w.visited[k],iw.visited[k]); w.met=w.met||{}; for(const k in iw.met||{}) w.met[k]=maxN(w.met[k],iw.met[k]); }
 const cd=m.cadet, icd=im.cadet; if(cd&&icd&&cd!==icd){ if(icd.spotted){ cd.spotted=cd.spotted||{}; for(const k in icd.spotted) cd.spotted[k]=earliest(cd.spotted[k],icd.spotted[k]); } if(icd.news) cd.news=cd.news||icd.news; }
 if(m.rec&&im.rec&&m.rec!==im.rec){ const seen=new Set(m.rec.log.map(x=>x.t+'|'+x.k+'|'+x.a)); im.rec.log.forEach(x=>{ if(!seen.has(x.t+'|'+x.k+'|'+x.a)) m.rec.log.push(x); }); m.rec.log.sort((a,b)=>a.t-b.t); if(m.rec.log.length>H.PROFILE.LOG_MAX) m.rec.log.splice(0,m.rec.log.length-H.PROFILE.LOG_MAX); }
 if(m.tut&&im.tut) m.tut.done=earliest(m.tut.done,im.tut.done);
 return s;
};

/* ---------------- applying a parsed backup (all or nothing) ---------------- */
B.plan=function(parsed){ const me=G.activeAcct, owner=!!(me&&me.owner)||!G.roster.accounts.length;
 return parsed.profiles.map(p=>{ const here=p.id==='guest'?null:G.roster.accounts.find(a=>a.id===p.id);
  let allowed=owner||(me&&me.id===p.id)||(p.id==='guest'&&!me), why=allowed?'':'Only the Family Lead can restore other cadets.';
  return {p,here:!!here,hereName:here?here.name:null,choice:allowed?(here?'merge':'add'):'skip',allowed,why}; }); };
B.apply=async function(parsed,plan,o){ o=o||{};
 const snap=H.store.ok?await H.store.snapshot('Before restoring a backup ('+UI.date(Date.now())+')'):null;
 const before=H.store.capture(), writes={};
 const R=JSON.parse(JSON.stringify(G.roster)); let added=0, merged=0, replaced=0, photos=0;
 for(const x of plan){ if(!x.allowed||x.choice==='skip') continue; const p=x.p;
  if(p.id==='guest'){ const cur=readSave(G.KEYS.guest)||G.defSave(); writes[G.KEYS.guest]=JSON.stringify(x.choice==='replace'?p.save:B.merge(cur,p.save)); x.choice==='replace'?replaced++:merged++; continue; }
  const idx=R.accounts.findIndex(a=>a.id===p.id);
  if(idx<0){ let name=p.callsign; const used=new Set(R.accounts.map(a=>a.name)); for(let i=2;used.has(name);i++) name=(p.callsign.slice(0,14)+i); const acct=Object.assign({},p.roster,{id:p.id,name,owner:!R.accounts.length&&!!p.roster.owner}); if(!acct.pinH) acct.pinH=null; R.accounts.push(acct); writes[acctKey(p.id)]=JSON.stringify(Object.assign(p.save,{name})); added++; }
  else { const cur=readSave(acctKey(p.id)); if(x.choice==='replace'||!cur){ writes[acctKey(p.id)]=JSON.stringify(p.save); const keep=R.accounts[idx]; R.accounts[idx]=Object.assign({},keep,p.roster,{id:keep.id,name:keep.name,owner:keep.owner,pinH:p.roster.pinH||keep.pinH}); replaced++; } else { writes[acctKey(p.id)]=JSON.stringify(B.merge(cur,p.save)); merged++; } }
 }
 if(parsed.household&&o.household){ if(typeof parsed.household.photos==='boolean'&&(!G.activeAcct||G.activeAcct.owner)) R.photos=parsed.household.photos; if(parsed.household.localdb&&!localStorage.getItem(G.CFG.id+'_localdb_v1')) writes[G.CFG.id+'_localdb_v1']=parsed.household.localdb; }
 writes[G.KEYS.roster]=JSON.stringify(R);
 // write, read back, compare; on any failure put everything back
 try{ for(const k in writes) localStorage.setItem(k,writes[k]); for(const k in writes) if(localStorage.getItem(k)!==writes[k]) throw new Error('verify '+k); }
 catch(e){ try{ for(const k of Object.keys(writes)){ if(k in before) localStorage.setItem(k,before[k]); else localStorage.removeItem(k); } }catch(e2){} throw new Error('The device ran out of room or refused the data, so nothing was changed.'); }
 // photos (after the profiles are safely in place; a photo that fails is skipped, never fatal)
 if(H.store.ok) for(const x of plan){ if(!x.allowed||x.choice==='skip') continue; for(const m of x.p.media){ try{ const u8=unb64(m.data); if(m.sha256&&m.sha256!==await B.sha256(u8)) continue; const blob=new Blob([u8],{type:m.type}); const img=await (window.createImageBitmap?createImageBitmap(blob):Promise.reject()); if(img.width>4096||img.height>4096){ if(img.close) img.close(); continue; }
   const cv=document.createElement('canvas'); const k=Math.min(1,1600/Math.max(img.width,img.height)); cv.width=Math.round(img.width*k); cv.height=Math.round(img.height*k); cv.getContext('2d').drawImage(img,0,0,cv.width,cv.height);
   const big=await new Promise(r=>cv.toBlob(r,'image/jpeg',.82)); const tc=document.createElement('canvas'); const t=Math.min(1,320/Math.max(img.width,img.height)); tc.width=Math.round(img.width*t); tc.height=Math.round(img.height*t); tc.getContext('2d').drawImage(img,0,0,tc.width,tc.height); const th=await new Promise(r=>tc.toBlob(r,'image/jpeg',.78)); if(img.close) img.close();
   await H.store.put('media',{id:m.id,owner:x.p.id,entry:m.entry,type:'image/jpeg',blob:big,thumb:th,w:cv.width,h:cv.height,bytes:big.size,cr:Date.now()}); photos++; }catch(e){} } }
 G.loadRoster();
 return {added,merged,replaced,photos,snap};
};

/* ============================ THE SCREEN ============================ */
UI.define('backup',{ title:'Backup and restore', sub:()=>G.who(),
 render(){ const M=h('main',{}), me=G.activeAcct, owner=!!(me&&me.owner), last=(G.roster&&G.roster.lastBackup)||0;
  const status=h('div',{class:'card flat'});
  const line=(k,v,cls)=>h('div',{class:'spread',style:{padding:'4px 0',borderBottom:'1px solid var(--line)'}},h('span',{class:'muted small',text:k}),h('b',{class:cls||'',text:v}));
  status.appendChild(line('Last backup file',last?UI.date(last):'Never'));
  status.appendChild(line('Profiles on this device',String((G.roster.accounts||[]).length||1)));
  const st=line('Storage','Checking…'), ofl=line('Works offline',H.offline&&H.offline.ready?'Yes':(H.offline&&H.offline.supported?'After this visit':'Needs the internet to start'));
  status.appendChild(st); status.appendChild(ofl);
  status.appendChild(line('Photos and restore points',H.store.ok?'Available':'Not available in this browser'));
  H.storageStatus&&H.storageStatus().then(O=>{ st.lastChild.textContent=(O.persisted?'Kept (persistent)':'Can be cleared by the browser')+(O.usage!=null?' • '+UI.bytes(O.usage)+' used':''); });
  M.appendChild(h('p',{class:'lede',text:'Everything lives on this device. A backup file is how a family keeps its progress safe and moves it to a new device. No accounts, no cloud.'}));
  M.appendChild(status);
  if(!last) M.appendChild(h('div',{class:'note warn',style:{marginTop:'12px'},text:'No backup yet. If this browser’s data is cleared or the device is lost, progress cannot be recovered without one.'}));
  // ---- save ----
  M.appendChild(h('h2',{text:'Save a backup file'}));
  const sc=h('div',{class:'seg',role:'group','aria-label':'What to save'}); let scope=owner?'household':'profile';
  [['profile',me?'Just '+me.name:'This guest profile'],owner?['household','The whole household']:null].filter(Boolean).forEach(([v,l])=>{ const b=h('button',{type:'button','aria-pressed':String(v===scope),onclick:()=>{ scope=v; [...sc.children].forEach(c=>c.setAttribute('aria-pressed',String(c===b))); }},l); sc.appendChild(b); });
  const ph=h('input',{type:'checkbox',id:'bk-photos',checked:true,style:{width:'22px',height:'22px',accentColor:'#D9B25E'}});
  const lock=h('input',{type:'checkbox',id:'bk-lock',style:{width:'22px',height:'22px',accentColor:'#D9B25E'},disabled:!B.cryptoOk});
  const p1=h('input',{type:'password',autocomplete:'new-password',placeholder:'Passphrase (8 or more characters)','aria-label':'Passphrase'}), p2=h('input',{type:'password',autocomplete:'new-password',placeholder:'The same passphrase again','aria-label':'Passphrase again'});
  const pw=h('div',{style:{display:'none'},class:'stack'},p1,p2,h('p',{class:'hint',text:'Write it down somewhere safe. Without it, nobody can open the file: not you, not the app, not the publisher.'}));
  lock.addEventListener('change',()=>{ pw.style.display=lock.checked?'block':'none'; });
  const out=h('div',{'aria-live':'polite'});
  M.appendChild(h('div',{class:'card flat stack'},sc,h('label',{class:'item',for:'bk-photos',style:{cursor:'pointer'}},h('span',{class:'grow'},h('b',{text:'Include photos'}),h('small',{text:'Flight Record photos make the file bigger.'})),ph),
   h('label',{class:'item',for:'bk-lock',style:{cursor:B.cryptoOk?'pointer':'default'}},h('span',{class:'grow'},h('b',{text:'Lock it with a passphrase'}),h('small',{text:B.cryptoOk?'Encrypted on this device (AES-256).':'Needs the app to be opened from a secure (https) address.'})),lock),pw,
   h('button',{class:'btn primary',type:'button',onclick:async ev=>{ const btn=ev.currentTarget; if(lock.checked){ if(p1.value.length<8){ UI.toast('Use 8 or more characters'); return; } if(p1.value!==p2.value){ UI.toast('The passphrases do not match'); return; } }
     btn.disabled=true; UI.clear(out); out.appendChild(h('p',{class:'small muted',text:lock.checked?'Locking and saving… (a few seconds)':'Saving…'}));
     try{ const r=await B.exportFile(scope,{photos:ph.checked,pass:lock.checked?p1.value:null}); UI.clear(out); out.appendChild(h('div',{class:'note good',text:'Saved '+r.name+' ('+UI.bytes(r.bytes)+', '+UI.plural(r.profiles,'profile')+(r.photos?', '+UI.plural(r.photos,'photo'):'')+'). Keep it somewhere safe, off this device.'})); sfx('cheer'); }
     catch(e){ UI.clear(out); out.appendChild(h('div',{class:'note bad',role:'alert',text:'The backup was not saved: '+e.message})); }
     btn.disabled=false; p1.value=''; p2.value=''; }},UI.icon('download'),'Save the backup file'),out));
  // ---- restore ----
  M.appendChild(h('h2',{text:'Restore from a backup file'}));
  const file=h('input',{type:'file',accept:'.htfa,application/json',class:'sr',id:'bk-file',onchange:()=>{ const f=file.files&&file.files[0]; file.value=''; if(f) restoreFlow(f); }});
  M.appendChild(h('div',{class:'card flat'},h('p',{class:'small muted',text:owner||!me?'Pick a .htfa file. You will see what is in it before anything changes, and a restore point is saved first.':'You can restore your own profile from a file. The Family Lead can restore everyone.'}),
   h('label',{for:'bk-file',class:'btn',role:'button',tabindex:'0',onkeydown:ev=>{ if(ev.key==='Enter'||ev.key===' '){ ev.preventDefault(); file.click(); } }},UI.icon('upload'),'Choose a backup file'),file));
  // ---- restore points ----
  M.appendChild(h('h2',{text:'Restore points'}));
  const rp=h('div',{class:'list'}); M.appendChild(rp);
  if(!H.store.ok) rp.appendChild(h('div',{class:'empty',text:'Restore points need storage this browser is not giving the app.'}));
  else { H.store.snaps().then(list=>{ UI.clear(rp); if(!list.length){ rp.appendChild(h('div',{class:'empty',text:'None yet. One is saved automatically before every restore and before updates.'})); return; }
    list.forEach(s=>rp.appendChild(UI.item('clock',s.reason,UI.date(s.at)+' • '+new Date(s.at).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'})+' • '+UI.bytes(s.bytes),'',owner||!G.roster.accounts.length?async()=>{ if(!(await UI.confirm('Go back to this restore point?',['Every profile on this device goes back to how it was then ('+UI.date(s.at)+'). Anything since is replaced. A new restore point of the current state is saved first.'],'Go back',{danger:true}))) return; await H.store.snapshot('Before going back to '+UI.date(s.at)); const ok=H.store.restore(s); if(ok){ UI.toast('Restored. Sign in again.'); setTimeout(()=>{ G.logout(); G.go('title',{},true); },700); } else UI.dialog({title:'Nothing changed',body:h('p',{text:'The device refused the data. Everything is as it was.'})}); }:null))); }); }
  if(!me||owner){ M.appendChild(h('h2',{text:'Photos in the Flight Record'}));
   const pc=h('input',{type:'checkbox',id:'bk-allow',checked:H.photosAllowed(),style:{width:'22px',height:'22px',accentColor:'#D9B25E'},onchange:()=>{ G.roster.photos=pc.checked; G.saveRoster(); sfx('ok'); UI.toast(pc.checked?'Photos are on for this device':'Photos are off for this device'); }});
   M.appendChild(h('label',{class:'item',for:'bk-allow',style:{cursor:'pointer'}},h('span',{class:'grow'},h('b',{text:'Let cadets add photos'}),h('small',{text:'For the Family Lead. Photos stay on this device, are saved without location data, and are never shared.'})),pc)); }
  return M; }
});
async function restoreFlow(f){
 if(f.size>B.MAX_FILE){ UI.dialog({title:'That file is too big',body:h('p',{text:'A backup is never that large. Pick a .htfa file saved by the app.'})}); return; }
 let text; try{ text=await f.text(); }catch(e){ UI.dialog({title:'That file could not be read',body:h('p',{text:'Try again, or pick a different file.'})}); return; }
 let parsed=null, pass=null;
 for(let tries=0;tries<4&&!parsed;tries++){
  try{ parsed=await B.parse(text,pass); }
  catch(e){ if(e.needPass||/passphrase/i.test(e.message)&&pass!=null){ pass=await askPass(tries>0); if(pass==null) return; continue; } UI.dialog({title:'Not restored',body:h('p',{text:e.message})}); return; }
 }
 if(!parsed) return;
 const plan=B.plan(parsed), body=h('div',{});
 body.appendChild(h('p',{class:'small muted',text:'Saved '+(parsed.meta.created?UI.date(parsed.meta.created):'')+' by '+(parsed.meta.app.name||'the app')+' '+(parsed.meta.app.version||'')+'.'}));
 const L=h('div',{class:'list'});
 plan.forEach(x=>{ const s=x.p.save, lessons=Object.keys(((s.mod||{}).fl||{}).l||{}).length, badges=Object.keys(s.ach||{}).length;
  const sel=h('select',{'aria-label':'What to do with '+x.p.callsign,disabled:!x.allowed,onchange:()=>{ x.choice=sel.value; }});
  (x.here?[['merge','Merge with this device (keep the best of both)'],['replace','Replace what is on this device'],['skip','Skip']]:[['add','Add to this device'],['skip','Skip']]).forEach(([v,l])=>sel.appendChild(h('option',{value:v,selected:v===x.choice},l)));
  L.appendChild(h('div',{class:'card flat'},h('b',{text:x.p.callsign}),h('p',{class:'small muted',style:{margin:'2px 0 8px'},text:(s.points||0)+' XP • '+UI.plural(lessons,'lesson')+' • '+UI.plural(badges,'badge')+' • '+UI.plural(x.p.media.length,'photo')+(x.here?' • already on this device':' • new here')}),x.allowed?sel:h('p',{class:'small',text:x.why}))); });
 body.appendChild(L);
 body.appendChild(h('p',{class:'small muted',style:{marginTop:'10px'},text:'Merging never adds scores together: each lesson, quiz and game keeps its better result, and lists are joined. A restore point is saved first, so this can be undone.'}));
 if(!H.termsAccepted()) body.appendChild(h('div',{class:'note warn',text:'This device has no accepted Terms of Use yet. Restoring needs the Family Lead to accept them: the next step shows them.'}));
 UI.dialog({title:'Restore '+UI.plural(plan.filter(x=>x.allowed).length,'profile')+'?',body,actions:[{label:'Cancel',kind:'ghost'},{label:'Restore',kind:'primary',onClick:()=>{ go(); }}]});
 async function go(){
  if(!H.termsAccepted()){ const okT=await termsGate(); if(!okT) return; }
  try{ const r=await B.apply(parsed,plan,{household:parsed.meta.scope==='household'}); sfx('cheer');
   UI.dialog({title:'Restored',body:h('div',{},h('p',{text:[r.added?UI.plural(r.added,'profile')+' added':null,r.merged?UI.plural(r.merged,'profile')+' merged':null,r.replaced?UI.plural(r.replaced,'profile')+' replaced':null,r.photos?UI.plural(r.photos,'photo'):null].filter(Boolean).join(', ')+'.'}),h('p',{class:'small muted',text:r.snap?'Changed your mind? Backup and restore > Restore points has the moment before this.':'Sign in to continue.'})),actions:[{label:'Sign in',kind:'primary',onClick:()=>{ G.logout(); G.go('title',{},true); }}],dismiss:false});
  }catch(e){ UI.dialog({title:'Nothing changed',body:h('p',{text:e.message})}); }
 }
}
function askPass(again){ return new Promise(res=>{ const p=h('input',{type:'password',autocomplete:'current-password','aria-label':'Passphrase',placeholder:'Passphrase'}); UI.dialog({title:again?'That passphrase did not open it':'This backup is locked',body:h('div',{},h('p',{class:'small muted',text:'Type the passphrase used when the backup was saved.'}),p),actions:[{label:'Cancel',kind:'ghost',onClick:()=>res(null)},{label:'Open',kind:'primary',onClick:()=>res(p.value)}],onClose:v=>{ if(v===undefined) res(null); }}); }); }
/* a device with no Terms yet: the adult reads and accepts them here (same receipt as the join gate) */
function termsGate(){ return new Promise(res=>{ const box=h('div',{style:{maxHeight:'50vh',overflow:'auto',padding:'10px',border:'1px solid var(--line-2)',borderRadius:'10px',whiteSpace:'pre-wrap',fontSize:'.86em',lineHeight:'1.45'},tabindex:'0',text:H.termsText()});
 let read=false; const ok=h('button',{class:'btn primary',type:'button',disabled:true,onclick:()=>{ H.acceptTerms('restore','lead'); d.close(); res(true); }},'I have read it • I accept');
 box.addEventListener('scroll',()=>{ if(box.scrollTop+box.clientHeight>=box.scrollHeight-8&&!read){ read=true; ok.disabled=false; } });
 const d=UI.dialog({title:'Terms of Use (for the Family Lead)',body:h('div',{},box,h('div',{class:'acts'},ok)),actions:[{label:'Not now',kind:'ghost',onClick:()=>res(false)}],onClose:v=>{ if(v===undefined&&!read) res(false); }});
 setTimeout(()=>{ if(box.scrollHeight<=box.clientHeight+8){ read=true; ok.disabled=false; } },60); }); }
})();
