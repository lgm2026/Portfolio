/* Smoke test: every shell screen, sign-up + PIN, the bulletin board (local DB and a mocked shared DB), log out / in.
   Run:  cd web && python3 -m http.server 8777   then   node qa/smoke.js   (BASE_URL=... to point elsewhere)
   Needs: npm install playwright (or a global install). Screenshots -> qa/shots/ */
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const BASE = process.env.BASE_URL || 'http://localhost:8777/';
const S = path.join(__dirname, 'shots') + '/'; fs.mkdirSync(S, { recursive: true });
const results = [], errors = [];
const ok = (c, l) => results.push((c ? 'OK   ' : 'FAIL ') + l);

/* a tiny in-memory stand-in for window.claude.use('db') / ('user') - same API the app uses */
function mockClaude(opts) {
  const store = new Map(), ls = new Set(), notify = () => { for (const l of ls) setTimeout(l, 10); };
  const cp = x => x === undefined ? undefined : JSON.parse(JSON.stringify(x));
  const colDocs = col => { const o = []; for (const [p, d] of store) { const i = p.lastIndexOf('/'); if (p.slice(0, i) === col) o.push({ id: p.slice(i + 1), data: d }); } return o; };
  const snap = a => ({ size: a.length, docs: a.map(x => ({ id: x.id, data: () => cp(x.data) })) });
  function Q(c, f, o, l) { this.c = c; this.f = f || []; this.o = o; this.l = l || 1000; }
  Q.prototype.where = function (f, op, v) { return new Q(this.c, this.f.concat([[f, op, v]]), this.o, this.l); };
  Q.prototype.orderBy = function (f, d) { return new Q(this.c, this.f, [f, d || 'asc'], this.l); };
  Q.prototype.limit = function (n) { return new Q(this.c, this.f, this.o, n); };
  Q.prototype.run = function () { let a = colDocs(this.c).filter(x => this.f.every(([f, op, v]) => op === '==' ? x.data[f] === v : true)); if (this.o) { const [f, d] = this.o; a.sort((x, y) => (x.data[f] < y.data[f] ? -1 : 1) * (d === 'desc' ? -1 : 1)); } return a.slice(0, this.l); };
  Q.prototype.get = function () { return Promise.resolve(snap(this.run())); };
  Q.prototype.onSnapshot = function (n) { const f = () => n(snap(this.run())); setTimeout(f, 30); ls.add(f); return () => ls.delete(f); };
  Q.prototype.doc = function (id) { return new D(this.c + '/' + id); };
  function D(p) { this.p = p; this.id = p.slice(p.lastIndexOf('/') + 1); }
  D.prototype.get = function () { const d = store.get(this.p); return Promise.resolve({ exists: !!d, id: this.id, data: () => cp(d) }); };
  D.prototype.set = function (d) { store.set(this.p, cp(d)); notify(); return Promise.resolve(); };
  D.prototype.update = function (d) { Object.assign(store.get(this.p), cp(d)); notify(); return Promise.resolve(); };
  D.prototype.delete = function () { store.delete(this.p); notify(); return Promise.resolve(); };
  D.prototype.onSnapshot = function (n) { const f = () => { const d = store.get(this.p); n({ exists: !!d, id: this.id, data: () => cp(d) }); }; setTimeout(f, 30); ls.add(f); return () => ls.delete(f); };
  const db = { collection: n => new Q(n), doc: p => new D(p) };
  const user = { isOwner: () => Promise.resolve(!!opts.owner) };
  window.__store = store;
  window.claude = { use: n => Promise.resolve(n === 'db' ? db : n === 'user' ? user : null) };
}

async function open(browser, name, mock) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 780 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(name + ' PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/fonts\.g|ERR_|favicon/.test(m.text())) errors.push(name + ' CONSOLE: ' + m.text()); });
  if (mock) await page.addInitScript(mockClaude, mock);
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.getElementById('tapstart').style.display === 'block', null, { timeout: 15000 });
  await page.screenshot({ path: S + name + '_00_welcome.png' });
  await page.tap('#tapstart'); await page.waitForTimeout(500);
  const T = {
    page, wait: ms => page.waitForTimeout(ms),
    shot: n => page.screenshot({ path: S + name + '_' + n + '.png' }),
    scene: () => page.evaluate(() => G.sceneName),
    ev: (f, a) => page.evaluate(f, a),
    tapV: async (x, y) => { const [cx, cy] = await page.evaluate(([x, y]) => { const r = G.canvas.getBoundingClientRect(); return [r.left + x * r.width / G.VW, r.top + y * r.height / G.VH]; }, [x, y]); await page.touchscreen.tap(cx, cy); await page.waitForTimeout(120); },
    tapBtn: async (fn) => { const r = await page.evaluate(fn); if (!r) return false; await T.tapV(r.x + r.w / 2, r.y + r.h / 2); return true; },
  };
  return T;
}

(async () => {
  const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
  /* ---- A: local database (no window.claude) ---- */
  {
    const T = await open(browser, 'local');
    ok(await T.scene() === 'title', 'A1 starts on the title screen');
    await T.shot('01_title');
    await T.tapBtn(() => G.scene.layout().btns.find(b => b.id === 'signup')); await T.wait(300);
    ok(await T.scene() === 'signup', 'A2 CREATE ACCOUNT opens sign-up');
    await T.page.locator('input.gfield').fill('ALEX'); await T.shot('02_signup_name');
    await T.tapBtn(() => G.scene.nextBtn()); await T.wait(200);
    await T.page.locator('input.gfield').fill('1234'); await T.wait(300);
    await T.shot('03_signup_pin2');
    await T.page.locator('input.gfield').fill('1234'); await T.wait(700);
    ok(await T.scene() === 'dash', 'A3 sign-up lands on the dashboard');
    ok(await T.ev(() => G.activeAcct && G.activeAcct.owner === true), 'A4 first account on a device is the owner');
    await T.shot('04_dash');
    const cards = await T.ev(() => G.scene.layout().map(c => c.id));
    ok(cards.join() === 'board,about,slot1,link', 'A5 dashboard shows the configured cards');
    ok(await T.ev(() => !!document.querySelector('a.gfile[href="https://example.com"]')), 'A6 link card has a real <a> over it');
    // board: post
    await T.tapBtn(() => G.scene.layout().find(c => c.id === 'board')); await T.wait(500);
    ok(await T.scene() === 'board', 'A7 BULLETIN opens');
    await T.shot('05_board_empty');
    await T.tapBtn(() => G.scene.btns()[0]); await T.wait(200);
    await T.page.locator('textarea.gfield').fill('First post from the shell. Long enough to wrap onto a second line to check the layout.');
    await T.shot('06_board_compose');
    await T.tapBtn(() => G.scene.btns().find(b => b.id === 'send')); await T.wait(500);
    const n = await T.ev(() => JSON.parse(localStorage.getItem(CONFIG.id + '_localdb_v1')) );
    ok(Object.keys(n).filter(k => k.indexOf('posts/') === 0).length === 1, 'A8 the post is saved in the local database');
    await T.shot('07_board_post');
    // delete own post
    await T.ev(() => { const it = G.scene.items()[0]; G.scene.list.f = 0; });
    await T.tapBtn(() => { const A = G.scene.area(); return { x: A.x + A.w - 60, y: A.y + 4, w: 40, h: 20 }; }); await T.wait(200);
    ok(await T.ev(() => !!G.scene.m), 'A9 DELETE asks first');
    await T.shot('08_board_delete_confirm');
    await T.tapBtn(() => G.scene.m.rects().btns[0]); await T.wait(400);
    ok(await T.ev(() => Object.keys(JSON.parse(localStorage.getItem(CONFIG.id + '_localdb_v1'))).filter(k => k.indexOf('posts/') === 0).length === 0), 'A10 post deleted');
    await T.tapV(40, 20); await T.wait(500);
    ok(await T.scene() === 'dash', 'A11 BACK returns to the dashboard');
    // about page, module slot, settings
    await T.tapBtn(() => G.scene.layout().find(c => c.id === 'about')); await T.wait(500);
    ok(await T.scene() === 'page', 'A12 ABOUT opens the config page'); await T.shot('09_page');
    await T.tapV(40, 20); await T.wait(500);
    await T.tapBtn(() => G.scene.layout().find(c => c.id === 'slot1')); await T.wait(500);
    ok(await T.scene() === 'blank', 'A13 module slot opens the template'); await T.shot('10_blank');
    await T.tapBtn(() => G.scene.btns()[0]); await T.wait(150);
    ok(await T.ev(() => G.save.mod.blank.taps === 1), 'A14 per-person save works');
    await T.tapV(40, 20); await T.wait(500);
    await T.tapV(250, 20); await T.wait(500);
    ok(await T.scene() === 'settings', 'A15 gear opens settings'); await T.shot('11_settings');
    // log out + back in
    await T.tapBtn(() => G.scene.rows().find(r => r.id === 'logout')); await T.wait(200);
    await T.tapBtn(() => G.scene.m.rects().btns[0]); await T.wait(500);
    ok(await T.scene() === 'title', 'A16 log out -> title');
    await T.tapBtn(() => G.scene.layout().btns.find(b => b.id === 'login')); await T.wait(500);
    await T.shot('12_login');
    await T.tapV(130, 62 + 27); await T.wait(300);
    await T.page.locator('input.gfield').fill('9999'); await T.wait(300);
    ok(await T.ev(() => G.scene.err.indexOf('WRONG') === 0), 'A17 wrong PIN is refused');
    await T.page.locator('input.gfield').fill('1234'); await T.wait(700);
    ok(await T.scene() === 'dash', 'A18 right PIN logs in');
    // guest: owner-only and member cards lock
    await T.ev(() => { CONFIG.cards.push({ id: 'own', label: 'OWNER TOOL', icon: 'lock', scene: 'blank', need: 'owner' }); G.logout(); G.go('dash', {}, true); });
    await T.wait(300);
    ok(await T.ev(() => G.scene.locked(G.scene.layout().find(c => c.id === 'own'))), 'A19 owner-only card is locked for a guest');
    await T.shot('13_dash_guest_locked');
  }
  /* ---- B: shared database (mocked window.claude), viewer is not the owner ---- */
  {
    const T = await open(browser, 'shared', { owner: false });
    ok(await T.ev(() => G.data.mode) === 'shared', 'B1 uses window.claude db when present');
    await T.ev(async () => (await window.claude.use('db')).doc('posts/x1').set({ at: Date.now() - 60000, by: 'someone-else', byName: 'JORDAN', text: 'Posted by another person.' }));
    await T.ev(() => G.go('dash', {}, true)); await T.wait(400);
    ok(await T.ev(() => G.cardSub.board()) === '1 NEW', 'B2 dashboard card shows 1 NEW');
    await T.shot('01_dash_guest');
    await T.ev(() => G.go('board', { back: 'dash' }, true)); await T.wait(400);
    ok(await T.ev(() => G.scene.btns().length === 0), 'B3 a guest cannot post (post:member)');
    ok(await T.ev(() => G.scene.items().length === 1 && !G.scene.items()[0].focus), 'B4 a guest cannot delete someone else’s post');
    await T.shot('02_board_readonly');
  }
  await browser.close();
  console.log(results.join('\n'));
  if (errors.length) console.log('\nERRORS:\n' + errors.join('\n'));
  const fail = results.filter(r => r.startsWith('FAIL')).length + errors.length;
  console.log('\n' + (results.length - results.filter(r => r.startsWith('FAIL')).length) + '/' + results.length + ' passed' + (errors.length ? ', ' + errors.length + ' page errors' : ''));
  process.exit(fail ? 1 : 0);
})();
