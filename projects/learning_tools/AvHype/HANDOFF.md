# AvHype Aviation Education — Developer Handoff

> **Purpose of this document:** everything a new chat/engineer needs to resume development of this app with zero prior context. Read this top-to-bottom once, run the Quick Start, and you are caught up.

---

## 0. TL;DR

**AvHype Aviation Education** is a **free, single-file React website** — a Duolingo-style FAA flight-training **study tool**. It is *not* a native app and *not* FAA-affiliated; it is an independent educational study aid. The entire thing compiles to **one self-contained `.html` file** (~1.44 MB) that runs anywhere, including the in-app artifact preview, with no server and no build step at runtime.

- **Working source:** `FlightPathAcademy.jsx` (~6,996 lines). **Do not rename this file** — the build script reads it by that exact path.
- **Content lives in sibling data files** (`avhype-*.js`) that are merged and inlined at build time.
- **Current content:** **224 lessons**, 222 glossary terms (60 pilot lingo/slang), 76 pronunciation entries, 54 aircraft, 31 featured airports + an optional 20k-airport directory, 9 certificate tracks, ~45 learning units, 13 arcade games.
- **The deliverable** is `AvHype Aviation Education.html` (self-contained) plus an optional sibling `avhype-airports.js`.

---

## 1. Quick Start (in a fresh chat)

All files are in this handoff bundle. In the working container:

```bash
# 1. Put everything in one folder (the build hard-codes /home/claude/fp/)
mkdir -p /home/claude/fp && cd /home/claude/fp
#    ...unzip the bundle here so paths match (FlightPathAcademy.jsx, avhype-*.js,
#    validate.js, build_html.js, assets/, package.json, etc. all sit in /home/claude/fp/)

# 2. Install dev deps (NOT shipped to users — only used to validate/build/test)
npm install            # installs @babel/core, @babel/preset-react, react, react-dom, jsdom

# 3. The standard edit cycle:
node validate.js FlightPathAcademy.jsx     # MUST print: PASS: parses clean...
node build_html.js                          # writes /mnt/user-data/outputs/FlightPathAcademy.html
node test_wave3.js                          # (optional) jsdom smoke test

# 4. Package to branded names + present
cd /mnt/user-data/outputs
cp FlightPathAcademy.html "AvHype Aviation Education.html"
cp /home/claude/fp/FlightPathAcademy.jsx "AvHype Aviation Education.jsx"
rm -f FlightPathAcademy.html FlightPathAcademy.jsx
# then present_files: HTML first, then avhype-airports.js, then the .jsx
```

**Environment that worked:** Node v22, npm 10. Dependencies pinned in `package.json` / `package-lock.json`.

> If `npm install` is blocked, the only hard requirements are `@babel/core` + `@babel/preset-react` (for `validate.js`), `react` + `react-dom` UMD builds (inlined by `build_html.js`), and `jsdom` (for tests). The build reads React UMD from `node_modules/react/umd/react.production.min.js` and `node_modules/react-dom/umd/react-dom.production.min.js`.

---

## 2. Branding & non-negotiables (READ THIS)

- **Display brand:** `AvHype Aviation Education`. It is a **website**, not an app. Tagline: **"Bite-sized learning for future aviators."**
- **`AvHype Resources`** = the in-app resource library name.
- **`freeFlightDB`** = legal **operator alias** (`var LEGAL_OWNER` in the jsx) — appears **only** in the legal docs (Terms/Privacy/Copyright). Never in learner-facing UI.
- **Never** put a real person's name or personal details anywhere in the app. Learner-facing = "AvHype" only.
- **Disclaimers must stay prominent** everywhere they currently appear: independent / not FAA-affiliated / does not certify anyone; quiz questions are original (not retired FAA questions); arcade is "play on the ground"; the mock exam is practice-only.
- The brand string is centralized: `var BRAND` near the top of the jsx, and `BRAND`/`BADGE` in `build_html.js`. The localStorage key (`STORE_KEY = "flightpath_academy_v1"`) is intentionally decoupled from the brand name — **do not change the storage key** or you wipe existing users' progress.

**Brand domain (for reference):** `sharkyourtooth.ai` was for another project — for THIS app the relevant brand is AvHype; no live domain is hard-coded into logic.

---

## 3. File inventory

### Ship-critical (the app + its data)
| File | ~Size | Role |
|---|---|---|
| `FlightPathAcademy.jsx` | 494 KB / ~6,996 lines | **The entire app.** React via `React.createElement` (aliased `var h`). All UI, navigation, screens, arcade, onboarding, legal docs, inline config (UNITS, PATHWAYS, THEMES, RANKS, APP_FEATURES, etc.). |
| `avhype-lessons.js` | 325 KB | Base lessons map → `window.__AV_LESSONS__` (117 lessons). |
| `avhype-lessons-extra.js` | 63 KB | +38 airplane lessons (first PPL deep-dive wave). Merges via `Object.assign`. |
| `avhype-lessons-extra2.js` | 58 KB | +39 airplane PPL lessons (second wave: airspace, comms, airport ops, performance, maneuvers, weather, aeromedical, ADM). |
| `avhype-lessons-extra3.js` | 41 KB | +30 **Instrument Rating** lessons (clearances, charts, approaches, IFR regs, IFR weather, attitude instrument flying). |
| `avhype-reference.js` | 132 KB | Airport ops, weather, nav, glossary (base), signs, markings, flashcards → several `__AV_*__` globals. |
| `avhype-reference-extra.js` | 13 KB | +34 pilot lingo (glossary) + 47 pronunciation entries. |
| `avhype-reference-extra2.js` | 10 KB | +26 pilot lingo + 29 pronunciation entries. |
| `avhype-content.js` | 76 KB | Aircraft (54), history, milestones, preflight, certificates, career paths, featured airports (31). |
| `assets/full.png` | 69 KB | Full logo (used in boot splash). Base64-embedded at build. |
| `assets/mark.png` | 20 KB | Logo mark. Base64-embedded at build. |
| `assets/fav.png` | 1 KB | Favicon. Base64-embedded at build. |

### Build & test tooling (dev-only, not shipped)
| File | Role |
|---|---|
| `build_html.js` | Assembles the self-contained HTML into `/mnt/user-data/outputs/FlightPathAcademy.html`. Inlines React UMD, the raw app, and all data as one JSON blob. |
| `validate.js` | Parser/lint gate. Babel-parses the jsx + scans for forbidden tokens. **Run after every jsx edit.** |
| `test_wave3.js` | Latest jsdom smoke test (boot, lesson counts, units render). |
| `test_wave2.js` | Earlier jsdom test (kept for reference). |
| `smoke.js` | Original/general jsdom harness (kept for reference). |
| `package.json` / `package-lock.json` | Dev dependency manifest. |

### Optional / pipeline (airport directory)
| File | Role |
|---|---|
| `avhype-airports.js` | **The deliverable airport directory** (~1 MB). Sets `window.__AVHYPE_AIRPORTS_PACKED`. Loaded **lazily in the background** by the app; ship it next to the HTML. Optional — app degrades gracefully to the 31 featured airports if absent (this is why the artifact preview only shows featured airports). |
| `extract_airports.py` | Pipeline: parses an OurAirports CSV → `airports_db.js`. |
| `airports_db.js` | Intermediate JSON of airports (from the python script). |
| (`airports_raw.csv`) | The 12 MB OurAirports source CSV — **NOT in this bundle** (re-download from ourairports.com data if you need to regenerate). |

### Not included on purpose
- `node_modules/` — regenerate with `npm install`.
- `airports_raw.csv` — 12 MB; re-downloadable.
- `FlightPathAcademy.jsx.bak` — stale backup, redundant.

---

## 4. Architecture

### Single-file React, no runtime build
- The app is written as **plain `React.createElement` calls** (aliased `var h = React.createElement;`) and `const {useState, useEffect, useRef, useMemo} = React;`. **It does NOT contain JSX angle-bracket syntax**, so it runs directly in the browser with **no Babel shipped**. (The file extension is `.jsx` by convention only.)
- `validate.js` runs `@babel/preset-react` purely as a **parse check** — Babel is never bundled into the output.
- Mounts to `#root`. No `import`/`export` anywhere — everything is one big script scope.

### How data gets in (the merge + inline mechanism)
The editable content lives in sibling `.js` files. At build time `build_html.js`:
1. Creates an empty object `DW = {}`.
2. Runs each data file's IIFE into `DW` **in this order** (order matters because `-extra*` files `Object.assign`/`concat` onto earlier globals):
   ```
   avhype-lessons.js → avhype-lessons-extra.js → avhype-lessons-extra2.js → avhype-lessons-extra3.js
   → avhype-reference.js → avhype-reference-extra.js → avhype-reference-extra2.js
   → avhype-content.js
   ```
3. Serializes `DW` to one JSON string and emits it as `<script type="application/json" id="avhype-data">…</script>`, followed by a tiny loader that does `JSON.parse` and copies every key onto `window`.
4. The app reads each global with the pattern:
   ```js
   var LESSONS = (typeof window !== "undefined" && window.__AV_LESSONS__) ? window.__AV_LESSONS__ : {};
   ```
   Fallback is `{}` for maps, `[]` for arrays.

**Why inline JSON instead of separate JS files?** Self-containment (works in the artifact preview and any static host with zero extra requests) and faster startup (`JSON.parse` beats parsing a huge JS object literal). The sibling files stay as the human-editable source of truth.

### Globals the app expects (16 total)
`__AV_LESSONS__`, `__AV_GLOSSARY__`, `__AV_PRONUNCIATION__`, `__AV_AIRPORT_OPS__`, `__AV_WEATHER__`, `__AV_NAV__`, `__AV_AIRPORT_SIGNS__`, `__AV_AIRPORT_MARKINGS__`, `__AV_FLASHCARDS__`, `__AV_CERTIFICATES__`, `__AV_CAREER_PATHS__`, `__AV_AIRCRAFT__`, `__AV_HISTORY__`, `__AV_AIRPORTS__`, `__AV_PREFLIGHT__`, `__AV_MILESTONES__`.

### Boot / splash system
`build_html.js` injects an HTML boot splash (animated, collects an optional name) BEFORE React loads. It sets `window.__fpaDeferBoot = true` so React does **not** auto-render. The app defines `window.__fpaBoot()` (renders) and calls `window.__fpaReady()` when parsed. The splash "Ready for takeoff" button calls `__fpaBoot()`. The optional typed name is passed via `window.__fpaPrefill.name`. A returning user (localStorage `onboarded:true`) gets a "Welcome back" splash. There is also an 8-second failsafe that boots automatically.

> **Testing implication:** in jsdom, set `window.__fpaBoot()` yourself after seeding localStorage (see §8).

---

## 5. STRICT PARSER RULESET (validated on every jsx edit)

`validate.js` enforces a Babel-standalone-safe subset. **The jsx must obey all of these** (the data `.js` files are exempt — see note):

- **No optional chaining** `?.`
- **No nullish coalescing** `??`
- **No regex literals inside `.map()` / `.filter()` callbacks.**
- **No arrow functions in callbacks** — use `function () {}` syntax (arrows elsewhere are also avoided; just use `var` + `function`).
- Use **`var`** (not `let`/`const`) for variables, except the established top `const {…} = React;` destructure.
- **Avoid object spread** `{...x}`.
- Ternaries `? :` are fine. `.split()/.replace()` with regex are fine **outside** map/filter callbacks. `\u` escapes in strings are fine.

Expected success line: `PASS: parses clean, no forbidden tokens. Lines: <N>` (the line count is `validate`'s own count and can differ slightly from `wc -l`; only **PASS** matters).

> **Data files are NOT scanned by `validate.js`.** They are pure data run via `new Function` then `JSON.stringify`. They must still be **valid JS and JSON-serializable** (no functions, no `undefined`). **Gotcha:** never put an unescaped double-quote inside a double-quoted string — use single quotes for inner quoted phrases (apostrophes like `it's` are fine). A syntax error there surfaces only at build time (the `new Function` throws), not in `validate.js`.

---

## 6. Data shapes (copy these exactly)

### Lesson (entry in `__AV_LESSONS__`)
```js
"lesson-id": {
  title: "Short lesson title",
  pathway: "airplane",                 // pathway category (airplane/drone/helicopter/...)
  cert: "Unit Title String",           // MUST equal the title of the UNIT that lists this lesson
  faa: "phak",                         // a valid FAA source key (see list below)
  acs: "Free-text ACS/area reference",
  time: 6,                             // minutes (integer)
  explain: ["paragraph 1", "paragraph 2", "paragraph 3"],
  quiz: [
    { type: "mc",   q: "...", choices: ["a","b","c","d"], answer: 2, why: "..." }, // answer = 0-based index
    { type: "tf",   q: "...", answer: true, why: "..." },
    { type: "fill", q: "... ____ ...", answer: "word", why: "..." }
  ]
}
```
(Optional `explainByTier` exists on some older lessons but is omitted on newer ones.)

### Unit (entry in the inline `var UNITS = [...]` in the jsx)
```js
{
  id: "a-airspace2",          // unique unit id
  cert: "ppl",                // the TRACK/cert id (ppl, instrument, commercial, sport, remote, ...)
  pathway: "airplane",
  level: "Airplane • Airspace",
  title: "Airspace System in Depth",   // each listed lesson's `cert` field must equal THIS string
  subtitle: "One-line description of what the unit covers.",
  lessons: ["as-classes", "as-eg", "as-sua", "as-tfr", "as-equip"]   // ids must exist in the merged lessons
}
```
> **Two different "cert" meanings:** a *lesson's* `cert` = the **unit title** it belongs to; a *unit's* `cert` = the **track id** (`ppl`, `instrument`, …). This is the existing convention — keep it.

### Glossary term (`__AV_GLOSSARY__`)
```js
{ term: "Crab / Crabbing", def: "Explanation...", cat: "Lingo & Slang" }   // `full` is an optional extra field
```
`GLOSSARY_CATS` (inline in jsx): `Weather, Airspace, Navigation, Regulations & certificates, Operations & procedures, Aerodynamics & performance, Aircraft & systems, Instruments & avionics, Communication & ATC, Human factors, Lingo & Slang`.

### Pronunciation entry (`__AV_PRONUNCIATION__`)
```js
{ term: "Pitot", say: "PEE-toe", tip: "Why/how, one sentence.", cat: "Airframe & structure" }
```
Existing pronunciation categories: `Airframe & structure`, `Systems & instruments`, `Weather & airport`, `Speeds, nav & medical`, `Aircraft & engine makers`. (The screen derives chips from whatever cats are present, so a new cat would just add a chip.)

### Valid `faa` source keys
`phak, afh, hfh, ifh, iph, aih, rmh, wbh, acs, aim, wings, cfr61, cfr67, cfr91, cfr107, medical, iacra, psi, dpe, notams, tfr, laanc, trust, awc, asrs, ntsb` — resolved by `faaSourceById()` in the jsx.

---

## 7. How to add content (the common task)

### Add a batch of lessons + a unit
1. **Create/append a data file**, e.g. `avhype-lessons-extra4.js`:
   ```js
   window.__AV_LESSONS__ = Object.assign((window.__AV_LESSONS__ || {}), { "new-id": { ...lesson... }, ... });
   ```
   Verify IDs don't collide with existing lessons first (merge in Node and check).
2. **Wire it into `build_html.js`** — add a `runInto(DW, "avhype-lessons-extra4.js");` in the chain **after** the previous lessons file (order matters).
3. **Add the UNIT(s)** to `var UNITS = [...]` in the jsx. Each lesson's `cert` must equal its unit `title`; every `lessons:[...]` id must exist.
4. `node validate.js FlightPathAcademy.jsx` → **PASS**.
5. `node build_html.js` → check the printed counts.
6. Cross-check in Node: every new lesson is referenced by a unit, and no unit references a missing lesson (see §9 snippet).
7. jsdom test → package → present.

### Add pilot lingo / pronunciation
1. Append to a `avhype-reference-extraN.js` using `.concat(...)`:
   ```js
   window.__AV_GLOSSARY__ = (window.__AV_GLOSSARY__ || []).concat([ { term, def, cat: "Lingo & Slang" }, ... ]);
   window.__AV_PRONUNCIATION__ = (window.__AV_PRONUNCIATION__ || []).concat([ { term, say, tip, cat }, ... ]);
   ```
2. Wire its `runInto(...)` into `build_html.js` **after** the previous reference file.
3. Build → verify counts → no jsx change needed (the GlossaryScreen/PronunciationScreen read the globals).

> When adding files, also remember to add their `runInto` calls — this is the single most common thing to forget.

---

## 8. Build / validate / test workflow (detail)

### Validate
```bash
node validate.js FlightPathAcademy.jsx | grep -E 'PASS|FAIL'
```

### Build
```bash
node build_html.js
# prints e.g.: wrote HTML bytes: 1441950 | data globals: 16 | title brand: true | badge: true
```
Output: `/mnt/user-data/outputs/FlightPathAcademy.html` (self-contained).

### jsdom smoke test (pattern that works for the self-contained build)
Data is **inline**, so use a *simple* JSDOM (no custom ResourceLoader). The airport sibling injection fails silently in jsdom — that's expected and fine.
```js
const { JSDOM, VirtualConsole } = require("jsdom");
const vc = new VirtualConsole();
vc.on("jsdomError", e => errors.push(String(e.message || e)));
const dom = new JSDOM(html, { runScripts: "dangerously", pretendToBeVisual: true, url: "https://e.com/", virtualConsole: vc });
const w = dom.window;
await sleep(140);
w.scrollTo = function(){};
w.localStorage.setItem("flightpath_academy_v1", JSON.stringify({
  onboarded: true,
  profile: { name: "T", pathways: ["airplane"], goals: [], age: "adult" },
  lessons:{}, weak:{}, log:[], endorsements:{}, personalMins:{}, surveys:{},
  arcade:{ tickets:0, xpDay:"", xpToday:0 }, exams:{}, examLog:[],
  activePathway: null,
  settings:{ theme:"dark", goalsPromptDismissed:true, favorites:[] }
}));
w.__fpaBoot();                 // boot is deferred by the splash; call it yourself
await sleep(520);
// AgreementGate shows first on a fresh agree-state -> click the smallest element containing
// "I understand and agree". Clicks: el.dispatchEvent(new w.MouseEvent("click", { bubbles: true }))
```
Useful UI strings/selectors:
- Agreement button text: **`I understand and agree`**
- Open menu: `button[aria-label="Open menu"]`; close: `button[aria-label="Close menu"]` (menu overlay is `fixed inset:0 z1000`, opaque)
- Quiz-option buttons have inline style containing `text-align: left`
- Mock exam flow: Practice → "Mock Knowledge Test" → "10" → "Start exam" → "Question 1 of" → click option → "Jump to question" → "Submit exam for scoring"
- `clickText` helper: pick the **smallest** element whose `textContent` includes the target string.

### Package & present
See §1 step 4. Present order: **HTML first, then `avhype-airports.js`, then the `.jsx`.** Keep the closing summary concise.

---

## 9. Current state (as of this handoff)

- **224 lessons** total across ~45 units and 9 certificate tracks.
- **Content waves that landed:**
  - Base: 117 lessons (foundation + every pathway intro: airplane, drone/Part 107, helicopter, sport, commercial, CFI, ATP, glider, balloon, gyroplane, powered-lift, weight-shift, powered-parachute, instrument, multi/sea, etc.).
  - **Wave 1** (`-extra`): +38 airplane PPL deep-dive (aerodynamics, systems, instruments, weather, nav, regs, aeromedical, maneuvers) + 34 lingo + 47 pronunciation + the **Pronunciation Guide screen**.
  - **Wave 2** (`-extra2`): +39 airplane PPL (Airspace System in Depth, Radio Communications, Airport & Night Operations, Performance/Weight & Balance, Core Flight Maneuvers, Weather Services & Hazards, Aeromedical in Depth, Aeronautical Decision-Making) + 26 lingo + 29 pronunciation.
  - **Wave 3** (`-extra3`): +30 **Instrument Rating** lessons across 6 units (Flying in the System, Charts & Procedures, Instrument Approaches, IFR Regulations, IFR Weather & Hazards, Attitude Instrument Flying). Units `i-system / i-charts / i-approaches / i-regs / i-weather / i-attitude` are already in the jsx.
- **Glossary:** 222 terms incl. **60 pilot lingo/slang**. **Pronunciation:** 76 entries.
- **Last verified:** validate PASS (6,996 lines), build OK (16 globals, ~1.44 MB), jsdom 8/8.

### Quick re-verify snippet (run in /home/claude/fp)
```bash
node -e '
var w={};function R(f){(new Function("window",require("fs").readFileSync(f,"utf8")))(w);}
["avhype-lessons.js","avhype-lessons-extra.js","avhype-lessons-extra2.js","avhype-lessons-extra3.js",
 "avhype-reference.js","avhype-reference-extra.js","avhype-reference-extra2.js","avhype-content.js"].forEach(R);
var L=w.__AV_LESSONS__||{},G=w.__AV_GLOSSARY__||[],P=w.__AV_PRONUNCIATION__||[];
console.log("lessons",Object.keys(L).length,"| glossary",G.length,"(lingo "+G.filter(function(x){return x.cat==="Lingo & Slang";}).length+") | pron",P.length);
// every UNIT lesson-id resolves + every lesson is wired:
var fs=require("fs"),jsx=fs.readFileSync("FlightPathAcademy.jsx","utf8");
var seg=jsx.slice(jsx.indexOf("var UNITS"),jsx.indexOf("var UNITS")+85000),re=/lessons:\s*\[([^\]]*)\]/g,m,refd={};
while((m=re.exec(seg))){m[1].split(",").forEach(function(s){s=s.trim().replace(/^"+|"+$/g,"");if(s)refd[s]=1;});}
console.log("broken unit refs:",Object.keys(refd).filter(function(id){return !L[id];}).join(",")||"none");
'
```

---

## 10. Core app structure (orientation map for the jsx)

- **Navigation:** bottom TabBar with 5 tabs — **Learn, Practice, Logbook (id `log`), Library, Arcade**. Top-right hamburger opens a full-screen **FeatureMenu** overlay listing `APP_FEATURES` alphabetically with star-favorites.
  - `goTab(id)`, `openSub(name)`, `closeSub()`, `openLesson(id)`, `goFeature(f)`, `goExam`. `nav` state = `{screen, lesson, pool, cards, sub, title}`.
  - Sub-routes (`nav.sub`) include: endorsements, glossary, **pronounce** (Pronunciation Guide), signs, resources, legal, milestones, transcript, examlog, credentials, career, airportops, weather, navigation, airports, preflight, pathfinder, goals, aircraft, flashcards, arcade, history, hangar, profile.
- **Key inline config (NOT in data files):** `UNITS` (the roadmap), `PATHWAYS`, `THEMES` (deep navy / royal blue / cyan), `RANKS`, `APP_FEATURES`, `GLOSSARY_CATS`, all arcade data, legal docs, `EXTERNAL_LINKS`/`FAA_SOURCES`, onboarding copy.
- **State:** `App()` holds the root state; persisted to localStorage `STORE_KEY`. `mergeState` upgrades older saved states (adds new keys with guards). Handlers: `earnArcade`, `recordExam`, `logExam`, `deleteExamLog`, `chooseActivePathway`, `beginPathway` (pins a career path AND redirects Home to the start of the roadmap), `toggleFavorite`, `goFeature`.
- **Helpers/primitives:** `h = React.createElement`; `normAnswer`, `shuffle`, `todayStr`, `cloneState`; UI: `SubHeader`, `Btn` (kinds: primary/go/ghost/soft/danger; small/full/disabled), `Card`, `SectionLabel`, `Modal` (needs `open:true`), `Bar`, `Glyph(name,size,color)`, `Dropdown`, `tintColor`, `pathMeta`. Fonts: MONO / SANS / PIX.
  - `Glyph` names available: airspace, arcade, back, balloon, bolt, check, checklist, clock, cloud, compass, ext, flame, glider, gyro, hangar, heli, learn, library, light, lock, log, menu, more, pattern, pin, poweredchute, poweredlift, practice, radio, rotor, runway, safety, sign, tower, weightshift, wind, wing, wings-badge, x. **No "flag" glyph.**
- **Arcade:** 13 8-bit games + tickets/XP economy + Web-Audio SFX layer (`SfxButton`, mute toggle persisted to localStorage `avhype_sfx`).
- **Roadmap logic:** `unitsForState(state)` returns the foundation units first, then `UNITS` whose `pathway` is in the learner's `profile.pathways`. So all `pathway:"airplane"` units (PPL *and* instrument) show for an airplane learner regardless of their `cert` track.

---

## 11. Airport directory (optional sibling)

- The app calls `loadAirportsData()` after it's interactive, which injects `<script src="avhype-airports.js">`. That file sets `window.__AVHYPE_AIRPORTS_PACKED` = a **pipe/tilde-delimited** string:
  - Fields per record: `code|iata|name|city|region|country|type|elev` (type = `L`/`M`/`S`).
  - Records joined by `~`.
- **Ship `avhype-airports.js` in the same folder as the HTML** for the full ~20k-airport directory. Without it the app still works and shows the 31 featured airports (this is the artifact-preview behavior).
- **Regenerate:** download the OurAirports `airports.csv` (public domain) → save as `airports_raw.csv` → `python3 extract_airports.py` (produces `airports_db.js`) → pack those rows into the `code|...|elev` + `~` format and wrap as `window.__AVHYPE_AIRPORTS_PACKED="..."` in `avhype-airports.js`.

---

## 12. Production Readiness Audit Log (executive review pass)

**Update — personal "DB" monogram integrated (founder decision, post-audit):** the user confirmed the supplied DB monogram (initials/wave/palm/plane mark) is their own personal colophon and asked for it to be applied subtly app-wide. Final treatment (after a correction round — the first pass wrongly left the source PNG's white background and added an unrequested "Crafted by DB" tagline; both removed):
- **`assets/db-mark.png`** — full-color mark, white background converted to true alpha transparency with smooth edge falloff, cropped to artwork bounds, 240px, ~61KB.
- **`assets/db-mark-light.png`** — light monochrome knockout variant (identical geometry via the alpha channel, filled #C9D6E4) for dark surfaces where the navy artwork would vanish, ~25KB. Standard dark/light logo-set practice; geometry is untouched.
- Both embedded by `build_html.js` as `DBMARK_URI` / `DBMARK_LIGHT_URI` → `window.__AVHYPE_DBMARK__` / `window.__AVHYPE_DBMARK_LIGHT__`.
- **Placements (mark only, no text):** (1) boot splash footer — light variant, 30px, 60% opacity; (2) Profile & Settings foot — theme-aware (light variant on dark theme, full color on light), 34px, 65% opacity; (3) Training Transcript footer — full-color variant as a document seal on the always-white printable sheet, 44px, 85% opacity.
- Verified via jsdom: all three render, each surface gets the correct variant, no tagline text exists anywhere, app boots with zero errors, 224 lessons intact. Verified visually via composites that the transparent mark sits cleanly on both the dark (#070E1C) and light (#EEF2FA) theme backgrounds.
If more placements are wanted later, good candidates are the Credentials screen and the Legal/Terms document header.

A cross-functional production-readiness audit was performed against the live codebase. Findings and fixes:

**Fixed (code-level, verified via validate.js + build + jsdom regression):**
- **Keyboard/screen-reader accessibility (WCAG 2.1.1, 4.1.2):** 22 clickable `<div>` rows (roadmap cards, toggles, checkboxes, settings rows) had `onClick` but no `role`, `tabIndex`, or key handler — unreachable by keyboard and invisible to screen readers as interactive. Added a shared `kbdClick(fn)` / `kbdKey(fn)` helper pattern; every row now has `role="button"`, `tabIndex={0}`, and responds to Enter/Space. Expandable rows also gained `aria-expanded`.
- **Icon-only buttons missing labels:** 6 icon-only `<button>`s (unpin, delete, clear-search, 3× close/X) had no `aria-label`. Fixed.
- **Modal dialog semantics:** `Modal` now supports Escape-to-close, and has `role="dialog"`, `aria-modal="true"`, `aria-label` from its title, plus `aria-label="Close dialog"` on its close button.
- **Reduced motion:** the boot splash's 6 continuous CSS animations (star twinkle, cloud drift, plane bob, button pulse, spinner, progress shimmer) had no `prefers-reduced-motion` guard. Added a media query that disables/simplifies them for users who request reduced motion.
- **WCAG AA contrast failure:** `light.textFaint` was `#8694A8` on `#F3F7FD` = **2.87:1** (fails even the 3:1 large-text floor). Changed to `#5E7086` = **4.72:1** (passes AA for normal text). Verified other theme text/background pairs computationally; all pass AA except two borderline large-text-only pairs noted below.

**Verified clean (no action needed):**
- No `console.log`/`debugger`/TODO/FIXME/Lorem-ipsum anywhere in the app.
- No `dangerouslySetInnerHTML`/`innerHTML` with user input, no `eval`, no third-party analytics/tracking, no runtime `fetch`/XHR calls — the app is 100% static/local, which sharply limits the security and privacy surface.
- External links already use `window.open(url, "_blank", "noopener")` — correct, no reverse-tabnabbing risk.
- Legal pages (Terms, Copyright, Trademark, Privacy) already exist with real, non-placeholder language and are reachable from Settings and the feature menu.
- `safeStorage` wrapper already degrades gracefully when `localStorage` is unavailable (private browsing, quota).

**Documented, not code-changed (needs a business/design decision):**
- `dark.sky` (#2C6FE0 on #070E1C bg) = 4.09:1 — passes AA for large text only; it's used at small sizes (12–14px) in some link/accent contexts. Sky is a core brand accent color, so retuning it needs a design sign-off rather than a unilateral change.
- `dark.textFaint` (#5F7488 on panel) = 3.50:1 — same category, used for small captions/timestamps.
- The two full-screen modal/menu **backdrop** `<div>`s (click-outside-to-dismiss) are intentionally left mouse-only; their functionality is fully covered by a real, keyboard-accessible close `<button>` and/or the new Escape-key handler, so making an invisible full-screen div a tab stop would be an anti-pattern, not a fix.
- The supplied "DB" monogram (personal initials, wave, palm tree, single-engine plane) was **not** applied anywhere in AvHype — see the branding note in the chat where this came up. It reads as a personal/portfolio mark, and AvHype's own source code has a hard rule against real-name/pen-name references in learner-facing UI.

**Test artifact (not an app bug):** `test_a11y.js`'s "glossary row is keyboard-focusable" check fails because it targets the FeatureMenu's "Glossary of Terms" row, which was already a native `<button>` before this audit (not one of the 22 divs that needed fixing). Confirmed via direct DOM inspection that this is a test-target mistake, not a regression.

---

## 13. Open items / suggested next steps

Picked up where useful — the user (a Charlotte-based indie dev, pen name D.L. Burich; brief/direct; wants thorough, all-inclusive execution without confirmation pauses; uses "Continue" to proceed) has been pushing for breadth & depth. Candidate next moves:

- **More content waves** (the established pattern): e.g. a PPL "wave 4" — Cross-Country Flight Planning (nav log, E6B, variation/deviation, fuel reserves, diversions/lost procedures), Aircraft Systems II (vacuum/gyros, gear/brakes, fuel injection vs carb, environmental, ice protection), Regulations & Airworthiness (inspections/ADs, maintenance & preventive maintenance, right-of-way & min altitudes, required equipment ATOMATOFLAMES/FLAPS, medical & BasicMed), Emergency Procedures II (engine-out, fire, electrical, instrument failures, egress/ditching), and Checkride & Oral Prep (ACS, oral, ARROW docs, scenario judgment, nerves). *(This was scoped but not yet built — a clean, high-value next task.)*
- **Minify the app code** as an optional build step (a few hundred KB) for faster startup.
- **Surface mock-exam scores** on the Transcript screen.
- **Daily-goal XP ring** on Home.
- Add **IFR-themed lingo/pronunciation** to complement the new instrument lessons (localizer, glideslope, RNAV, "in the soup", "going missed", etc.).
- **Design sign-off on two borderline accent colors** (`dark.sky`, `dark.textFaint`) flagged in §12 — both pass AA for large text only; retuning them for small-text use is a design call, not a code fix.

---

## 14. Gotchas / lessons learned

- **Always re-grep anchors before editing** the jsx — line numbers shift after each insert. Use `str_replace` with enough surrounding context to be unique.
- **`validate.js` line count ≠ `wc -l`** — both are fine; only the **PASS** verdict matters.
- **Forgetting a `runInto` call** is the #1 build mistake when adding data files. The build prints `data globals: N` — sanity-check it.
- **Inner double-quotes in data strings** break the build (not validate). Use single quotes for inner quoted phrases.
- **jsdom menu-button false negatives:** if you open a lesson first, the menu button (`aria-label="Open menu"`) isn't on the lesson screen. Test the menu from Home, or don't chain those steps.
- **Curriculum must be FAA-accurate.** Quiz questions are original (never reproduce retired FAA test questions).
- **The 8-second failsafe** auto-boots the app even if the splash button isn't clicked — handy in tests, but call `__fpaBoot()` explicitly to avoid waiting.
- **Don't change `STORE_KEY`** — it would orphan every existing user's saved progress.

---

## 15. One-paragraph summary to paste into a fresh chat

> I'm continuing development of **AvHype Aviation Education**, a free single-file React website that's a Duolingo-style FAA flight-training study tool (independent, not FAA-affiliated). The whole app is `FlightPathAcademy.jsx` (~7k lines, plain `React.createElement`, strict no-`?.`/no-`??`/no-arrow-callbacks parser rules enforced by `validate.js`). Content lives in sibling `avhype-*.js` data files merged + inlined as JSON by `build_html.js` into a self-contained `.html`. It currently has 224 lessons, 60 pilot-lingo glossary terms, 76 pronunciation entries, an arcade, and an optional 20k-airport directory (`avhype-airports.js`). Edit cycle: `node validate.js FlightPathAcademy.jsx` (must PASS) → `node build_html.js` → jsdom test → copy to "AvHype Aviation Education.html" and present. See HANDOFF.md §6–§8 for exact data shapes and the build/test workflow. Branding: learner-facing is "AvHype" only; `freeFlightDB` (LEGAL_OWNER) appears only in legal docs; keep disclaimers prominent; never change the localStorage key.
