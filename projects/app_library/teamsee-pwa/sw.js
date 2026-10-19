// TeamSee service worker. App shell: versioned per build, so the calendar opens offline.
// Navigations: network first with a short timeout, then the cached shell (share links like ?l=… resolve to it offline).
// Only successful responses are cached. Google Fonts are cached after first use so text looks right offline.
// /api/* is network-first with a cache fallback. /admin and /feeds/* are never cached.
const VERSION = 'teamsee-8466a9314c23';
const FONTS = 'teamsee-fonts-v1';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png', './favicon-48.png'];
self.addEventListener('install', (e) => e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener('activate', (e) => e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION && k !== FONTS).map((k) => caches.delete(k)))).then(() => self.clients.claim())));
const put = (cache, req, res) => caches.open(cache).then((c) => c.put(req, res)).catch(() => {});
function timeout(ms, p) { return new Promise((res, rej) => { const t = setTimeout(() => rej(new Error('timeout')), ms); p.then((x) => { clearTimeout(t); res(x); }, (e) => { clearTimeout(t); rej(e); }); }); }
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const u = new URL(req.url);
  if (u.hostname === 'fonts.googleapis.com' || u.hostname === 'fonts.gstatic.com') {
    // Offline and never cached: an empty stylesheet (system fonts take over) instead of a failed request.
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((r) => { if (r.ok || r.type === 'opaque') put(FONTS, req, r.clone()); return r; })
      .catch(() => (u.hostname === 'fonts.googleapis.com' ? new Response('/* fonts unavailable offline */', { headers: { 'content-type': 'text/css' } }) : Response.error()))));
    return;
  }
  if (u.origin !== location.origin || u.pathname.startsWith('/admin') || u.pathname.startsWith('/feeds/')) return;
  if (u.pathname.startsWith('/api/')) {
    e.respondWith(fetch(req).then((r) => { if (r.ok) put(VERSION, req, r.clone()); return r; }).catch(() => caches.match(req)));
    return;
  }
  if (req.mode === 'navigate') {
    e.respondWith(timeout(4000, fetch(req)).then((r) => { if (r.ok) put(VERSION, './index.html', r.clone()); return r; })
      .catch(() => caches.match('./index.html').then((hit) => hit || fetch(req))));
    return;
  }
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((r) => { if (r.ok) put(VERSION, req, r.clone()); return r; })));
});
