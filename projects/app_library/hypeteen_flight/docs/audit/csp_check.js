/* Serves a directory with the CSP from tools/hosting/nginx-hfq.conf on every response and reports whether the app's content loads. */
const { chromium } = require('playwright'); const http=require('http'), fs=require('fs'), path=require('path');
const DIR=path.resolve(process.argv[2]);
const CSP="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'";
const MIME={'.html':'text/html','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml'};
const s=http.createServer((q,r)=>{ let p=path.join(DIR,decodeURIComponent(q.url.split('?')[0])); if(p.endsWith('/')) p+='index.html'; fs.readFile(p,(e,d)=>{ if(e){r.writeHead(404);r.end();return;} r.writeHead(200,{'Content-Type':MIME[path.extname(p)]||'application/octet-stream','Content-Security-Policy':CSP}); r.end(d); }); }).listen(0, async()=>{
 const b=await chromium.launch(), pg=await b.newPage(), errs=[];
 pg.on('pageerror',e=>errs.push('PAGEERROR '+e.message)); pg.on('console',m=>{ if(m.type()==='error') errs.push('CONSOLE '+m.text().slice(0,160)); });
 await pg.goto('http://localhost:'+s.address().port+'/'); await pg.waitForTimeout(2500);
 const st=await pg.evaluate(()=>({G:!!window.G, units:window.G&&G.HFQ&&G.HFQ.units?G.HFQ.units.length:0, lessons:window.G&&G.HFQ&&G.HFQ.lessons?Object.keys(G.HFQ.lessons).length:0, books:window.G&&G.HFQ&&G.HFQ.BOOKS?G.HFQ.BOOKS.length:0, start:document.getElementById('tapstart')&&document.getElementById('tapstart').style.display}));
 console.log(JSON.stringify(st)); console.log(errs.slice(0,6).join('\n')); await b.close(); s.close(); });
