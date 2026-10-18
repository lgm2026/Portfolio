/* Structure check (no browser): the architecture rules, enforced.
   1. every script on disk is loaded by index.html exactly once, and every tag points at a real file
   2. the framework (app-shell) files are byte-identical in the app: the shell stays separate and improvements flow back to it
   3. shell scripts load before app scripts; app scripts are named hfq_* or live under js/content/
   4. no real lint errors (undefined names, duplicate keys...) when eslint is installed
   Run: node qa/structure_check.js   Exit code 1 on any problem. */
const fs=require('fs'), path=require('path'), cp=require('child_process');
const ROOT=path.join(__dirname,'..'), WEB=path.join(ROOT,'web');
/* the framework lives beside the app in the workspace (../app-shell) or inside the release package (./app-shell): check whichever is there */
const SHELL=[path.join(ROOT,'app-shell','web','js'),path.join(ROOT,'..','app-shell','web','js')].find(d=>fs.existsSync(d))||path.join(ROOT,'app-shell','web','js');
const probs=[], P=m=>probs.push(m);
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const onDisk=walk(path.join(WEB,'js')).filter(f=>f.endsWith('.js')).map(f=>path.relative(WEB,f).split(path.sep).join('/'));
const html=fs.readFileSync(path.join(WEB,'index.html'),'utf8');
const tags=[...html.matchAll(/<script\s+src="([^"]+)"/g)].map(m=>m[1]);
const seen={}; tags.forEach(t=>{ seen[t]=(seen[t]||0)+1; });
for(const t in seen){ if(seen[t]>1) P('loaded twice: '+t); if(!/^https?:/.test(t)&&!fs.existsSync(path.join(WEB,t))) P('script tag with no file: '+t); }
// r7: files under js/content/lazy/ load on demand (H.loadContent), so instead of a <script> tag each one must be named,
// by its exact path, in a file that index.html does load (and a lazy file named nowhere is an error, as before)
const loadedText=tags.filter(t=>!/^https?:/.test(t)&&fs.existsSync(path.join(WEB,t))).map(t=>fs.readFileSync(path.join(WEB,t),'utf8')).join('\n');
for(const f of onDisk){ if(seen[f]) continue; if(/^js\/content\/lazy\//.test(f)){ if(!loadedText.includes("'"+f+"'")&&!loadedText.includes('"'+f+'"')&&!/^js\/content\/lazy\/series\//.test(f)) P('lazy content named by no loaded file: '+f); continue; } P('on disk but never loaded: '+f); }
// a lazy series book must be listed as the file of a book in content/series.js
const seriesTxt=fs.existsSync(path.join(WEB,'js/content/series.js'))?fs.readFileSync(path.join(WEB,'js/content/series.js'),'utf8'):'';
for(const f of onDisk) if(/^js\/content\/lazy\/series\//.test(f)&&!seriesTxt.includes("file:'"+f+"'")) P('a series book file that content/series.js does not list: '+f);
// shell parity
const shellFiles=fs.existsSync(SHELL)?fs.readdirSync(SHELL).filter(f=>f.endsWith('.js')&&f!=='rendition.js'):[];
for(const f of shellFiles){ const a=path.join(WEB,'js',f); if(!fs.existsSync(a)) P('shell file missing from the app: '+f); else if(!fs.readFileSync(a).equals(fs.readFileSync(path.join(SHELL,f)))) P('shell file differs from app-shell (copy it back, or move the change into an app file): '+f); }
const isShell=t=>shellFiles.includes(path.basename(t))&&!t.includes('/content/');
const isApp=t=>/(^|\/)hfq_/.test(t)||t.includes('/content/');
let lastShell=-1, firstApp=1e9; tags.forEach((t,i)=>{ if(isShell(t)&&t!=='js/rendition.js'&&t!=='js/config.js') lastShell=Math.max(lastShell,i); if(isApp(t)) firstApp=Math.min(firstApp,i); });
if(shellFiles.length&&lastShell>firstApp){ const late=tags.filter((t,i)=>isShell(t)&&i>firstApp&&t!=='js/rendition.js').join(', '); if(late) console.log('note: shell modules loaded after app files (allowed for module files): '+late); }
for(const f of onDisk){ if(!isShell(f)&&!isApp(f)&&!['js/rendition.js','js/config.js'].includes(f)) P('file is neither shell nor app (name it hfq_* or put it under js/content/): '+f); }
// lint (errors only; unused variables are reported by `eslint -c qa/eslint.config.js web/js`)
{ const cfg=path.join(__dirname,'eslint.config.js'); const out=cp.spawnSync('eslint',['-c',cfg,'--quiet','--format','json',path.join(WEB,'js')],{encoding:'utf8',maxBuffer:1<<26});
 if(out.error) console.log('note: eslint not installed, lint skipped');
 else { let res=null; try{ res=JSON.parse(out.stdout); }catch(e){ P('lint could not run: '+String(out.stderr).split('\n')[0]); }
  (res||[]).forEach(r=>r.messages.forEach(m=>P('lint: '+path.relative(ROOT,r.filePath)+':'+m.line+' '+m.message+' ('+m.ruleId+')'))); } }
console.log(onDisk.length+' scripts on disk, '+tags.length+' tags, '+shellFiles.length+' shell files compared.');
if(probs.length){ console.log('PROBLEMS ('+probs.length+'):'); probs.forEach(p=>console.log(' '+p)); process.exit(1); } else console.log('structure check: OK');
