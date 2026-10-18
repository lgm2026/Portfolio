/* Gate 1 runtime audit for the r6.6 baseline (read-only: it never edits the app).
   Usage: node runtime_audit.js <webDir> <outDir>
   For each device profile it boots the app, records network requests, console/page errors,
   enrolls a cadet, visits every registered scene and every airfield place, screenshots each,
   records the CSS-pixel size of every text run drawn on the canvas, tests the back path out of
   every scene, and checks offline reload, keyboard Tab focus, reduced motion and the accessibility tree. */
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const WEB = path.resolve(process.argv[2]), OUT = path.resolve(process.argv[3]);
fs.mkdirSync(OUT, { recursive: true });
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.css': 'text/css' };
const serve = dir => new Promise(res => { const s = http.createServer((q, r) => { let p = path.join(dir, decodeURIComponent(q.url.split('?')[0])); if (p.endsWith('/')) p += 'index.html'; fs.readFile(p, (e, d) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' }); r.end(d); } }); }).listen(0, () => res({ s, url: 'http://localhost:' + s.address().port + '/' })); });

const PROFILES = [
  { id: 'phone390', viewport: { width: 390, height: 800 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true },
  { id: 'phone360', viewport: { width: 360, height: 640 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true },
  { id: 'tablet820', viewport: { width: 820, height: 1180 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true },
  { id: 'desktop1440', viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, hasTouch: false, isMobile: false }
];

(async () => {
  const srv = await serve(WEB);
  const browser = await chromium.launch();
  const report = { base: srv.url, profiles: {} };
  for (const P of PROFILES) {
    const R = report.profiles[P.id] = { requests: [], thirdParty: [], errors: [], scenes: {}, rooms: {}, games: {}, back: {}, checks: {} };
    const dir = path.join(OUT, P.id); fs.mkdirSync(dir, { recursive: true });
    const ctx = await browser.newContext({ viewport: P.viewport, deviceScaleFactor: P.deviceScaleFactor, hasTouch: P.hasTouch, isMobile: P.isMobile });
    const page = await ctx.newPage();
    page.on('request', q => { const u = q.url(); R.requests.push(u); if (!u.startsWith(srv.url) && !u.startsWith('data:')) R.thirdParty.push(u); });
    page.on('pageerror', e => R.errors.push('PAGEERROR: ' + e.message));
    page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') R.errors.push(m.type().toUpperCase() + ': ' + m.text()); });
    const ev = (f, a) => page.evaluate(f, a), wait = ms => page.waitForTimeout(ms);
    const t0 = Date.now();
    await page.goto(srv.url);
    await page.waitForFunction(() => document.getElementById('tapstart').style.display === 'block', null, { timeout: 30000 });
    R.checks.readyMs = Date.now() - t0;
    await page.screenshot({ path: path.join(dir, '00_welcome.png') });
    await page.click('#tapstart'); await wait(500);
    // instrument text drawing: record the CSS-pixel size of each text run per scene
    await ev(() => {
      window.__tx = {}; const o = G.txt, oO = G.txtO;
      const rec = (s, size) => { const k = G.sceneName + (G.sceneName === 'world' && G.world ? ':' + G.world.room() : ''); const px = size * (parseFloat(G.canvas.style.width) / G.VW); const b = window.__tx[k] || (window.__tx[k] = { n: 0, lt9: 0, lt11: 0, min: 99, samples: [] }); b.n++; if (px < 9) b.lt9++; if (px < 11) b.lt11++; if (px < b.min) b.min = px; if (px < 9 && b.samples.length < 6 && String(s).trim()) b.samples.push(String(s).slice(0, 40) + ' @' + px.toFixed(1) + 'px'); };
      G.txt = function (s, x, y, size) { rec(s, size); return o.apply(this, arguments); };
      G.txtO = function (s, x, y, size) { rec(s, size); return oO.apply(this, arguments); };
    });
    await page.screenshot({ path: path.join(dir, '01_title.png') });
    // a keyboard user presses Tab: does anything focusable exist?
    await page.keyboard.press('Tab'); await wait(100);
    R.checks.tabFocus = await ev(() => { const a = document.activeElement; return a ? (a.tagName + (a.id ? '#' + a.id : '')) : null; });
    R.checks.a11yTree = await page.accessibility.snapshot().then(s => JSON.stringify(s).slice(0, 600)).catch(e => 'ERR ' + e.message);
    R.checks.canvasAria = await ev(() => ({ role: G.canvas.getAttribute('role'), label: G.canvas.getAttribute('aria-label'), tabindex: G.canvas.getAttribute('tabindex'), liveRegions: document.querySelectorAll('[aria-live]').length }));
    // enroll a cadet through the real gate (programmatic accept, like the existing suites)
    await ev(() => { const b = G.scene.layout().btns.find(b => b.id === 'signup'); return b; }).then(async b => { const [cx, cy] = await ev(([x, y]) => { const r = G.canvas.getBoundingClientRect(); return [r.left + x * r.width / G.VW, r.top + y * r.height / G.VH]; }, [b.x + b.w / 2, b.y + b.h / 2]); if (P.hasTouch) await page.touchscreen.tap(cx, cy); else await page.mouse.click(cx, cy); });
    await wait(400);
    await page.screenshot({ path: path.join(dir, '02_terms_gate.png') });
    R.checks.termsScene = await ev(() => G.sceneName);
    await ev(() => { if (G.sceneName === 'terms') { G.HFQ.acceptTerms('QA', 'lead'); G.HFQ.recordPledge('QA'); G.go('signup', { termsOk: true, pledged: true }, true); } }); await wait(300);
    await page.screenshot({ path: path.join(dir, '03_signup.png') });
    await page.locator('input.gfield').fill('AUDITOR'); await ev(() => { const b = G.scene.nextBtn(); window.__nb = b; });
    const tapV = async (x, y) => { const [cx, cy] = await ev(([x, y]) => { const r = G.canvas.getBoundingClientRect(); return [r.left + x * r.width / G.VW, r.top + y * r.height / G.VH]; }, [x, y]); if (P.hasTouch) await page.touchscreen.tap(cx, cy); else await page.mouse.click(cx, cy); await wait(150); };
    const tapR = async r => { if (!r) return false; await tapV(r.x + r.w / 2, r.y + r.h / 2); return true; };
    await tapR(await ev(() => G.scene.nextBtn())); await wait(250);
    await page.locator('input.gfield').fill('2468'); await wait(300); await page.locator('input.gfield').fill('2468'); await wait(900);
    await tapR(await ev(() => (G.scene.layout().btns || []).find(b => b.id === 'done'))); await wait(600);
    R.checks.afterEnroll = await ev(() => G.sceneName);
    await page.screenshot({ path: path.join(dir, '04_after_enroll.png') });
    await tapR(await ev(() => G.scene.layout && G.scene.layout().cards && G.scene.layout().cards[0])); await wait(200); await tapR(await ev(() => G.scene.layout && G.scene.layout().btn)); await wait(900);
    R.checks.afterTrainer = await ev(() => G.sceneName);
    // skip placement + tutorial
    await ev(() => { const H = G.HFQ; H.fl().placed = 1; const m = G.save.mod; m.tut = m.tut || {}; m.tut.done = 1; G.persist(); G.go('world', { room: 'classroom' }, true); }); await wait(900);
    // storage footprint
    R.checks.saveBytes = await ev(() => { let n = 0; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); n += k.length + (localStorage.getItem(k) || '').length; } return { keys: Object.keys(localStorage), bytes: n }; });
    // every airfield place
    const rooms = await ev(() => Object.keys(G.WORLD.rooms));
    for (const r of rooms) {
      await ev(r => G.go('world', { room: r }, true), r); await wait(700);
      await page.screenshot({ path: path.join(dir, 'room_' + r + '.png') });
      R.rooms[r] = await ev(() => ({ scene: G.sceneName, room: G.world && G.world.room(), stations: (G.WORLD.rooms[G.world.room()].stations || []).length }));
    }
    // every registered scene with sensible args
    const unit0 = await ev(() => G.HFQ.units[0].id), book0 = await ev(() => G.HFQ.BOOKS[0].id), lesson0 = await ev(() => G.HFQ.lessons[G.HFQ.units[0].id][0].id);
    const sceneArgs = { route: { unit: unit0, back: 'world' }, book: { id: book0, back: 'library' }, page: { key: 'about' }, fleet: {}, flightlog: {}, logflight: {}, radio: { back: 'world' }, map: { back: 'world' }, settings: { back: 'home' }, termsRead: {}, crew: {}, games: {}, library: { back: 'world' }, path: { back: 'world' }, practice: { back: 'world' }, groundschool: { back: 'world' }, logbook: {}, locker: {}, board: {}, dash: {} };
    const skip = new Set(['title', 'login', 'signup', 'terms', 'world', 'quiz', 'flash', 'lesson', 'placement', 'tutorial', 'blank', 'trainer', 'squadron']);
    const scenes = await ev(() => Object.keys(G.scenes));
    for (const sc of scenes) {
      if (skip.has(sc) || /^g_/.test(sc)) continue;
      R.errors.push('--- scene ' + sc);
      await ev(([sc, a]) => G.go(sc, a || {}, true), [sc, sceneArgs[sc]]); await wait(650);
      await page.screenshot({ path: path.join(dir, 'scene_' + sc + '.png') });
      R.scenes[sc] = await ev(() => ({ now: G.sceneName, badFrames: G.badFrames || 0, errs: (G.errors || []).length }));
      // back path: press Escape up to 3 times and see where we land
      const trail = [];
      for (let i = 0; i < 3; i++) { await page.keyboard.press('Escape'); await wait(450); trail.push(await ev(() => G.sceneName + (G.sceneName === 'world' && G.world ? ':' + G.world.room() : ''))); if (/^world|^dash/.test(trail[trail.length - 1])) break; }
      R.back[sc] = trail;
    }
    // a long book's table of contents: rows per chapter when a book has 30 chapters
    R.checks.tocRowHeightAt30 = await ev(() => { const VH = G.VH, n = 30, rh = Math.min(30, (VH - 150) / n); return { rowHeightUnits: rh, rowHeightCssPx: rh * parseFloat(G.canvas.style.width) / G.VW }; });
    // every game: launch, screenshot, quit
    const games = await ev(() => (G.HFQ.GAMES || []).filter(g => g.built).map(g => g.id));
    for (const g of games) {
      R.errors.push('--- game ' + g);
      const okGo = await ev(g => { if (!G.scenes['g_' + g]) return false; G.go('g_' + g, { back: 'games' }, true); return true; }, g);
      await wait(900);
      if (okGo) await page.screenshot({ path: path.join(dir, 'game_' + g + '.png') });
      R.games[g] = await ev(() => ({ scene: G.sceneName, errs: (G.errors || []).length }));
      await ev(() => G.go('games', {}, true)); await wait(300);
    }
    R.text = await ev(() => window.__tx);
    R.gErrors = await ev(() => (G.errors || []).map(e => (e.msg || e.message || String(e)).slice(0, 200)));
    // reduced motion: does the OS setting carry into the app's setting?
    R.checks.reducedMotion = await ev(() => ({ appSetting: G.save.settings.rm, mediaQuery: matchMedia('(prefers-reduced-motion: reduce)').matches, gRm: G.rm ? G.rm() : null }));
    // service worker / manifest for offline install
    R.checks.offlineSupport = await ev(() => ({ sw: 'serviceWorker' in navigator ? !!navigator.serviceWorker.controller : 'n/a', manifest: !!document.querySelector('link[rel=manifest]') }));
    await ctx.setOffline(true);
    let offlineOk = false; try { await page.reload({ timeout: 8000 }); offlineOk = await ev(() => !!window.G); } catch (e) { offlineOk = 'reload failed: ' + e.message.split('\n')[0]; }
    R.checks.offlineReload = offlineOk;
    await ctx.setOffline(false);
    await ctx.close();
    console.log(P.id, 'done:', Object.keys(R.scenes).length, 'scenes,', Object.keys(R.rooms).length, 'rooms,', Object.keys(R.games).length, 'games,', R.thirdParty.length, 'third-party requests');
  }
  await browser.close(); srv.s.close();
  fs.writeFileSync(path.join(OUT, 'runtime_audit.json'), JSON.stringify(report, null, 1));
})().catch(e => { console.error(e); process.exit(1); });
