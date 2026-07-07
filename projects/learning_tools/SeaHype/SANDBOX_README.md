# SeaHype Marine Biology Education — Sandbox

This is the complete working build directory for the app. It is self-contained:
the shipped product is a single offline `.html` file built from the sources here.

## Restore / setup
This zip excludes `node_modules/` and `__pycache__/` (regenerable, large).

```bash
cd sea
npm install                                   # restores @babel, jsdom, react, react-dom
pip install textstat --break-system-packages  # only needed for readability.py
```

## Build the app
```bash
node validate.js SeaHype.jsx     # parser-rule lint (must print PASS)
node build_html.js               # writes the single-file app to outputs (see path below)
```
`build_html.js` inlines the engine + the 13 `seahype-*.js` data files + React UMD
into one HTML. Output path is set inside that script
(`/mnt/user-data/outputs/SeaHype Marine Biology Education.html`). The build is
deterministic.

## Source of truth
- `SeaHype.jsx` — the app engine (React via `React.createElement`, aliased `var h`; NO JSX).
- Data files inlined by the build (the app's content):
  `seahype-lessons.js`, `-extra.js`, `-extra2.js`, `-extra3.js`, `-extra4.js`,
  `seahype-curriculum.js` (generated species lessons; minified to one line),
  `seahype-content.js`, `seahype-extra-content.js`, `seahype-queries.js`,
  `seahype-art.js`, `seahype-shells.js`, `seahype-pathmeta.js`, `seahype-photos.js`.
- All lessons merge into `window.__SEA_LESSONS__`. Reference datasets live in
  `window.__SEA_GLOSSARY__/_PRON__/_TAXONOMY__/_CONCEPTS__/_CAREERS__/_HISTORY__/`
  `_MILESTONES__/_SHELLS__/_MARVELS__`.

## Invariants (do not change)
- localStorage key: `seahype_marinebio_v1` (and `PHOTO_CACHE_KEY` for photos).
- React does NOT auto-mount; the HTML boot splash calls `window.__seaBoot()`.
- Operator alias in shipped strings: `openMarineDB`. Never ship the pen name.
- The 444 species/curriculum lessons are reachable only via Library + Expeditions
  (intentional roadmap "orphans").

## Parser ruleset (enforced by validate.js on the .jsx; data files exempt but must stay valid JS)
1. no `?.`  2. no `??`  3. `var` only (no let/const)  4. no object spread (use `sx()`)
5. no regex literals inside map/filter/forEach callbacks  6. `function(){}` handlers
(no arrows)  7. no template literals (string concat).

## QA / test harnesses — all read the BUILT HTML and boot it in jsdom
(so they inspect exactly what the app renders from — same source of truth as the app):
```bash
node smoke.js            # 1502 quiz questions + data integrity
node qa_content.js       # static scan: meta tags, offline, name-leak, alias, refs, orphans
node qa_screens.js       # full-site screen + flow walk, dark/light, 412px + 1280px
node review.js           # content coherence + dumps prose to /tmp/all_prose.txt
node simgames.js         # 22 arcade game logic sims
node deskinput.js        # 24/24 render both themes + desktop keyboard/mouse
```
Readability:
```bash
node extract.js > /dev/null 2>&1
python3 readability.py 2>&1 | grep -E "mean=|above grade 8"
```

## Helper / generation scripts (already applied; kept for reproducibility)
- `gen_curriculum.py`, `gen_art.py`, `species_sci.py`, `author_specs.py` — generators.
- `rw_batch1.py … rw_batch11.py`, `rw_microbes.py`, `rw_species1.py`, `rw_species2.py`
  — reading-level rewrite passes (mean FK 5.83, max 8.1, 99.8% <= grade 8).
- `bake_photos.py`, `embed_photos.py`, `fetch_photos.py`, `run_photos.sh` — optional
  photo pipeline (the shipped app is fully offline without it).
- `pulltext.js`, `extract.js`, `dbg.js`, `_cal*.js`, `_probe.js`, `_endpunct.js` — probes.
