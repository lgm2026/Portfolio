#!/usr/bin/env node
/* Optional production build. The source stays plain files with no build step: `web/` runs as it is.
   This only makes a faster copy for publishing:
     node tools/build.js            ->  dist/   (index.html + a few minified bundles + assets + the offline service worker)
   Every run of consecutive <script src> tags in web/index.html becomes one bundle (boot.js, app.js...), in the same order,
   so behavior is identical; 100 requests become 2.
   r7 changes (see docs/02_AUDIT_REGISTER.md, D01):
   - Content files (js/content/**) are evaluated HERE, at build time, with a recorder in place of the content API
     (H.addLessons / addBooks / addShelves / extendBook and anything registered in CONTENT_API). What ships is the recorded
     calls as JSON, XOR-keyed with the build id and base64'd; at load, __hfqd() decodes with JSON.parse and replays the
     calls. Nothing is ever evaluated from a string, so the page works under a strict Content-Security-Policy
     (no 'unsafe-eval'). This is copy-and-paste protection, not encryption.
   - Lazy content (js/content/lazy/**, loaded on demand by H.loadContent) is encoded the same way, one file each.
   - dist/sw.js gets a precache list of every file in dist/ and a cache name tied to the build id.
   Protection of the Work (see LICENSE): every bundle starts with a copyright banner and a BUILD FINGERPRINT (id + date),
   also exposed as window.HFQ_BUILD; the per-file /*! headers survive minification; no source maps are emitted. */
const fs=require('fs'), path=require('path'), cp=require('child_process'), vm=require('vm');
const ROOT=path.join(__dirname,'..'), WEB=path.join(ROOT,'web'), OUT=path.join(ROOT,'dist');
let esbuild=null; try{ esbuild=require('esbuild'); }catch(e){ try{ esbuild=require(cp.execSync('npm root -g',{encoding:'utf8'}).trim()+'/esbuild'); }catch(e2){ try{ esbuild=require('/opt/npm-tools/node_modules/esbuild'); }catch(e3){} } }
const APP_VERSION=(()=>{ try{ return /version:'([^']+)'/.exec(fs.readFileSync(path.join(WEB,'js','hfq_version.js'),'utf8'))[1]; }catch(e){ return '0'; } })();
fs.rmSync(OUT,{recursive:true,force:true}); fs.mkdirSync(OUT,{recursive:true});
// copy everything that is not JS (assets, css, the manifest, the service worker template)
(function copy(d){ for(const e of fs.readdirSync(d,{withFileTypes:true})){ const s=path.join(d,e.name), r=path.relative(WEB,s); if(e.isDirectory()){ if(r==='js') continue; fs.mkdirSync(path.join(OUT,r),{recursive:true}); copy(s); } else if(r!=='index.html'&&r!=='sw.js') fs.copyFileSync(s,path.join(OUT,r)); } })(WEB);
let html=fs.readFileSync(path.join(WEB,'index.html'),'utf8');
const re=/(?:<script\s+src="([^"]+)"><\/script>[ \t]*\n?(?:<!--[\s\S]*?-->[ \t]*\n?)*)+/g;
const BUILD={id:Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8), date:new Date().toISOString().slice(0,10), version:APP_VERSION};
const banner='/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary; no license granted. Build '+BUILD.id+' '+BUILD.date+' v'+BUILD.version+' */\n';
const xor=buf=>{ const key=Buffer.from(BUILD.id); for(let i=0;i<buf.length;i++) buf[i]^=key[i%key.length]; return buf; };
const encode=text=>xor(Buffer.from(text,'utf8')).toString('base64');
const DECODER='window.HFQ_BUILD='+JSON.stringify(BUILD)+';window.__hfqd=function(s){var k='+JSON.stringify(BUILD.id)+',a=atob(s),n=a.length,u=new Uint8Array(n);for(var i=0;i<n;i++)u[i]=a.charCodeAt(i)^k.charCodeAt(i%k.length);var calls=JSON.parse(new TextDecoder().decode(u)),H=G.HFQ;for(var j=0;j<calls.length;j++){var c=calls[j];H[c[0]].apply(H,c[1]);}};\n';

/* ---- build-time evaluation of content files: record the API calls, ship them as data ---- */
const loader=require(path.join(ROOT,'qa','lib','content_loader.js'));   // a stub G with the real H.dsl
const CONTENT_API=['addLessons','addBooks','addShelves','extendBook','addSeries','addSeriesText','addDestinations','addBasemap','addCompanion','addInspect','addRetryLessons','addAircraftInfo'];
function plainCheck(v,where){   // everything shipped must survive JSON exactly
 if(v===null||typeof v==='string'||typeof v==='boolean') return;
 if(typeof v==='number'){ if(!isFinite(v)) throw new Error(where+': non-finite number'); return; }
 if(Array.isArray(v)){ v.forEach((x,i)=>{ if(x===undefined) throw new Error(where+'['+i+']: undefined in an array'); plainCheck(x,where+'['+i+']'); }); return; }
 if(typeof v==='object'){ const p=Object.getPrototypeOf(v); if(p!==null&&Object.getPrototypeOf(p)!==null) throw new Error(where+': not a plain object'); for(const k in v){ if(v[k]===undefined) continue; plainCheck(v[k],where+'.'+k); } return; }   // a plain object from any realm (the content runs in a vm sandbox)
 throw new Error(where+': '+typeof v+' cannot be shipped as data');
}
function recordContent(rel){
 const calls=[], H={dsl:loader.H.dsl};
 for(const fn of CONTENT_API) H[fn]=function(){ calls.push([fn,Array.prototype.slice.call(arguments)]); return true; };
 const sandbox={G:{HFQ:H},console};
 vm.runInNewContext(fs.readFileSync(path.join(WEB,rel),'utf8'),sandbox,{filename:rel});
 calls.forEach((c,i)=>plainCheck(c[1],rel+' call '+(i+1)+' '+c[0]));
 return calls;
}
const minify=src=>esbuild?esbuild.transformSync(src,{minify:true,target:'es2020',legalComments:'inline'}).code:src;
let n=0, inBytes=0, outBytes=0, encoded=0; const names=['boot','app','app2','app3'];
html=html.replace(re,run=>{
  const files=[...run.matchAll(/<script\s+src="([^"]+)"/g)].map(m=>m[1]).filter(f=>!/^https?:/.test(f));
  if(!files.length) return run;
  const name=(names[n++]||'bundle'+n)+'.js'; let code=banner+(n===2?DECODER:'');
  for(const f of files){ const src=fs.readFileSync(path.join(WEB,f),'utf8'); inBytes+=src.length;
    if(/^js\/content\//.test(f)){ code+='__hfqd("'+encode(JSON.stringify(recordContent(f)))+'");\n'; encoded++; continue; }
    code+=minify(src).trim().replace(/;?$/,';')+'\n'; }
  outBytes+=code.length; fs.writeFileSync(path.join(OUT,name),code);
  return '<script src="'+name+'"></script>\n';
});
if(n<2) throw new Error('expected at least two script runs in index.html (the decoder rides in the second)');
// lazy content: every file under js/content/lazy/ becomes dist/js/content/lazy/<same path>, encoded the same way
const LAZY=path.join(WEB,'js','content','lazy'); let lazy=0;
if(fs.existsSync(LAZY)) (function walk(d){ for(const e of fs.readdirSync(d,{withFileTypes:true})){ const s=path.join(d,e.name); if(e.isDirectory()) walk(s); else if(e.name.endsWith('.js')){ const rel=path.relative(WEB,s).split(path.sep).join('/'); const out=path.join(OUT,rel); fs.mkdirSync(path.dirname(out),{recursive:true}); const body=banner+'__hfqd("'+encode(JSON.stringify(recordContent(rel)))+'");\nif(window.__hfqLoaded)window.__hfqLoaded('+JSON.stringify(rel)+');\n'; fs.writeFileSync(out,body); lazy++; outBytes+=body.length; } } })(LAZY);
fs.writeFileSync(path.join(OUT,'index.html'),html);
// the offline service worker: precache every file in dist/, cache name = build id
const all=[]; (function walk(d){ for(const e of fs.readdirSync(d,{withFileTypes:true})){ const s=path.join(d,e.name); if(e.isDirectory()) walk(s); else all.push(path.relative(OUT,s).split(path.sep).join('/')); } })(OUT);
if(fs.existsSync(path.join(WEB,'sw.js'))){ const sw=fs.readFileSync(path.join(WEB,'sw.js'),'utf8').replace("const BUILD='dev'","const BUILD="+JSON.stringify(BUILD.id)).replace('const PRECACHE=[];','const PRECACHE='+JSON.stringify(['./'].concat(all.filter(f=>f!=='index.html')))+';'); fs.writeFileSync(path.join(OUT,'sw.js'),sw); }
console.log('build '+BUILD.id+' v'+BUILD.version+': '+n+' bundles, '+encoded+' content files + '+lazy+' lazy files shipped as data (no eval), '+all.length+' files precached, '+Math.round(inBytes/1024)+' KB -> '+Math.round(outBytes/1024)+' KB'+(esbuild?'':' (not minified: esbuild not found)'));
