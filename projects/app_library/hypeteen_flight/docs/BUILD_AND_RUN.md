# Build and run

## Run from source (no build)

```
cd web && python3 -m http.server 8777      # any static server works
open http://localhost:8777
```
Everything runs from plain files. Content loads unencoded; the service worker runs in "dev" mode (no precache).

## Build the published app

```
node tools/build.js                          # -> dist/  (needs Node 18+; esbuild optional, found via `npm root -g` or /opt/npm-tools)
```
`dist/` holds `index.html`, two minified bundles with the build fingerprint, every content file as data (no eval), the lazy content (basemap, seven novels) and `sw.js` with a precache list keyed by build id.

## Serve `dist/`

Static hosting over **https** with the headers in `tools/hosting/hfq-security-headers.conf` (`tools/hosting/nginx-hfq.conf` is a complete nginx example; run `nginx -t` first). No server-side code, no database, no third-party requests.

## Test

```
node qa/run_all.js            # every check; starts its own servers
node qa/run_all.js --fast     # skips the 512-lesson flight
node qa/run_all.js --dist     # also builds dist/ and runs offline, parity, e2e and arch suites against it
```
Playwright with Chromium is required for the browser suites (`NODE_PATH` to a node_modules that has `playwright`). Individual suites and the generated docs are listed in `README.md` → *Run it*.

## Put a book in the Library

`node tools/import_book.js <1-7> <manuscript.md>` then set the book's entry in `web/js/content/series.js` (see `docs/LIBRARY_PIPELINE.md`).

## Replace art without code

Drop a file into `web/assets/art/` and add its slot line to `web/assets/art/manifest.json` (slot keys and sizes in `docs/ASSET_REPLACEMENT_INVENTORY.md`). Rebuild `dist/`.
