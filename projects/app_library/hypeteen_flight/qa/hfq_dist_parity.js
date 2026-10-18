/* DIST PARITY (r7): the built dist/ must hold exactly the same course as web/. Since r7 the build ships content as recorded
   data (no eval), so this check loads both, in a real browser, and compares every lesson, book, shelf and unit as JSON.
   It also loads dist/ under a strict Content-Security-Policy (no 'unsafe-eval', no inline script) and checks nothing is refused.
   Run: node qa/hfq_dist_parity.js    (builds nothing; run node tools/build.js first)    Exit 1 on any difference. */
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const CSP = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self'; worker-src 'self'; manifest-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'";
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.css': 'text/css', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json', '.webp': 'image/webp', '.jpg': 'image/jpeg' };
const serve = (dir, csp) => new Promise(res => { const s = http.createServer((q, r) => { let p = path.join(dir, decodeURIComponent(q.url.split('?')[0])); if (p.endsWith('/')) p += 'index.html'; fs.readFile(p, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } const h = { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' }; if (csp) h['Content-Security-Policy'] = csp; r.writeHead(200, h); r.end(d); }); }).listen(0, () => res({ s, url: 'http://localhost:' + s.address().port + '/' })); });
const results = []; const ok = (c, l) => results.push((c ? 'OK   ' : 'FAIL ') + l);
(async () => {
  if (!fs.existsSync(path.join(ROOT, 'dist', 'index.html'))) { console.log('FAIL no dist/ (run node tools/build.js)'); process.exit(1); }
  const web = await serve(path.join(ROOT, 'web')), dist = await serve(path.join(ROOT, 'dist'), CSP);
  const b = await chromium.launch();
  const grab = async (url, label) => {
    const ctx = await b.newContext(); const pg = await ctx.newPage(); const refused = [];
    pg.on('console', m => { if (m.type() === 'error' && /Content Security Policy|Refused/.test(m.text())) refused.push(m.text().slice(0, 140)); });
    pg.on('pageerror', e => refused.push('PAGEERROR ' + e.message.slice(0, 140)));
    await pg.goto(url); await pg.waitForFunction(() => document.getElementById('tapstart') && document.getElementById('tapstart').style.display === 'block', null, { timeout: 30000 });
    const snap = await pg.evaluate(() => { const H = G.HFQ; return JSON.stringify({ units: H.units.map(u => [u.id, u.t, u.stage, (u.topics || []).length]), lessons: H.lessons, books: H.BOOKS, shelves: H.SHELVES }); });
    await ctx.close(); return { snap, refused, label };
  };
  const A = await grab(web.url, 'web'), B = await grab(dist.url, 'dist');
  ok(A.snap.length > 100000, 'P1 web/ loads the course (' + Math.round(A.snap.length / 1024) + ' KB of content)');
  ok(A.snap === B.snap, 'P2 dist/ holds exactly the same units, lessons, books and shelves as web/ (' + Math.round(B.snap.length / 1024) + ' KB)');
  ok(B.refused.length === 0, 'P3 dist/ runs under a strict CSP (no unsafe-eval, no inline script) with nothing refused' + (B.refused.length ? ': ' + B.refused[0] : ''));
  await b.close(); web.s.close(); dist.s.close();
  results.forEach(r => console.log(r));
  const pass = results.filter(r => r.startsWith('OK')).length; console.log('\n' + pass + '/' + results.length + ' passed');
  process.exit(pass === results.length ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
