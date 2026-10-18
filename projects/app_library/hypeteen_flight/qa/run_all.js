/* One command for everything:  node qa/run_all.js            all checks, browser suites in parallel
                                node qa/run_all.js --fast     the no-browser checks + the quick browser suites (skips the 512-lesson flight)
                                node qa/run_all.js --dist     also build dist/ and run the end-to-end suite against the bundle
   Starts its own static servers on free ports, so nothing needs to be running first. Exit code 1 if anything fails. */
const http=require('http'), fs=require('fs'), path=require('path'), cp=require('child_process'), os=require('os');
const ROOT=path.join(__dirname,'..'), args=process.argv.slice(2), JOBS=+((args.find(a=>/^--jobs=/.test(a))||('--jobs='+Math.max(1,Math.min(2,os.cpus().length)))).split('=')[1]), FAST=args.includes('--fast'), DIST=args.includes('--dist');
const MIME={'.html':'text/html','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.css':'text/css','.wav':'audio/wav','.woff2':'font/woff2','.webp':'image/webp','.jpg':'image/jpeg','.webmanifest':'application/manifest+json','.mp3':'audio/mpeg','.ogg':'audio/ogg','.txt':'text/plain'};
const serve=dir=>new Promise(res=>{ const s=http.createServer((q,r)=>{ let p=path.join(dir,decodeURIComponent(q.url.split('?')[0])); if(p.endsWith('/')) p+='index.html'; fs.readFile(p,(e,d)=>{ if(e){ r.writeHead(404); r.end(); } else { r.writeHead(200,{'Content-Type':MIME[path.extname(p)]||'application/octet-stream'}); r.end(d); } }); }).listen(0,()=>res({s,url:'http://localhost:'+s.address().port+'/'})); });
const run=(name,file,env)=>new Promise(res=>{ const t=Date.now(); const c=cp.spawn('node',[path.join(__dirname,file)],{env:Object.assign({},process.env,env),cwd:ROOT}); let out=''; c.stdout.on('data',d=>out+=d); c.stderr.on('data',d=>out+=d);
  c.on('close',code=>{ const m=out.match(/(\d+)\s*\/\s*(\d+) passed/)||out.match(/(OK)\s*$/m); const fails=out.split('\n').filter(l=>/^FAIL/.test(l)); res({name,code,secs:((Date.now()-t)/1000).toFixed(0),summary:m?m[0]:(code?'failed':'ok'),fails,tail:out.split('\n').slice(-6).join('\n')}); }); });
(async()=>{
 const results=[];
 for(const [n,f] of [['structure','structure_check.js'],['content','content_check.js'],['byline','byline_guard.js']]){ const r=await run(n,f); results.push(r); console.log((r.code?'FAIL ':'ok   ')+n.padEnd(12)+r.summary); if(r.code) console.log(r.tail); }
 const app=await serve(path.join(ROOT,'web'));
 /* a third field marks the heavy suites (a whole cadet's day, the 512-lesson flight): each runs alone, so the thumb-stick and
    frame-timing checks in the suites beside it are not starved (r7.4: with the 2-job default they were, now and then) */
 const suites=[['arch','hfq_arch_smoke.js'],['smoke','hfq_smoke.js'],['games','hfq_games_smoke.js'],['r4','hfq_r4_smoke.js'],['r5','hfq_r5_smoke.js'],['r6','hfq_r6_smoke.js'],['e2e','hfq_e2e.js',1],['r7 parity','hfq_r7_parity.js'],['r7 backup','hfq_r7_backup.js'],['r7 explorer','hfq_r7_explorer.js'],['r7.4 aircraft','hfq_ac_audit.js'],['r7.4 round','hfq_r74_smoke.js']];
 if(!FAST) suites.push(['lessons(512)','hfq_lessons_smoke.js',1]);
 /* the thumb-stick and frame-timing checks are timing sensitive, so only a few browsers run at once (--jobs=N, default 2); a heavy job takes every slot */
 const queue=[]; let active=0;
 const pump=()=>{ while(queue.length){ const j=queue[0]; if(j.heavy?active>0:active>=JOBS) break; queue.shift(); active+=j.heavy?JOBS:1; j.fn().then(j.res).finally(()=>{ active-=j.heavy?JOBS:1; pump(); }); } };
 const lim=(fn,heavy)=>new Promise(res=>{ queue.push({fn,res,heavy:!!heavy}); pump(); });
 const jobs=suites.map(([n,f,heavy])=>lim(()=>run(n,f,{BASE_URL:app.url}),heavy));
 let dist=null;
 if(DIST){ cp.execSync('node tools/build.js',{cwd:ROOT,stdio:'inherit'}); dist=await serve(path.join(ROOT,'dist')); jobs.push(lim(()=>run('offline on dist','hfq_r7_offline.js',{BASE_URL:dist.url})), lim(()=>run('parity on dist','hfq_r7_parity.js',{BASE_URL:dist.url})), lim(()=>run('e2e on dist','hfq_e2e.js',{BASE_URL:dist.url}),1), lim(()=>run('arch on dist','hfq_arch_smoke.js',{BASE_URL:dist.url})), lim(()=>run('dist parity','hfq_dist_parity.js'))); }
 for(const j of jobs){ const r=await j; results.push(r); console.log((r.code?'FAIL ':'ok   ')+r.name.padEnd(12)+r.summary.padEnd(16)+r.secs+'s'); r.fails.forEach(f=>console.log('       '+f)); if(r.code&&!r.fails.length) console.log(r.tail.split('\n').map(l=>'       '+l).join('\n')); }   // a suite that crashed (no FAIL lines) shows its last lines
 app.s.close(); if(dist) dist.s.close();
 const bad=results.filter(r=>r.code); console.log(bad.length?('\n'+bad.length+' failing: '+bad.map(r=>r.name).join(', ')):'\nall green'); process.exit(bad.length?1:0);
})();
