# Asset replacement inventory and production spec (r7.1 visual pass)

Status as of 2026-10-16. Every visual element in the app, how it is produced, what the Illustrated Revision supplied and how it was used, and what a native-resolution batch should deliver to replace the upscaled plates **with no code change**. r7.1 restyles the whole app to the board: the board's paintings fill the landing screen, the Hub hero and tiles, and the back wall of every room (through the painted-art slots, with `fit:'cover'`); the board's interface language (gold disc icons, gold titles, bevelled gold buttons, winged badges) is rebuilt as vectors and CSS so it stays crisp and themeable. The plates are 3–4× upscales of the concept crops, accepted at the author's direction; replace any of them at native resolution by swapping the file.

## 1. How art reaches the screen

| Layer | Mechanism | Replace by |
|---|---|---|
| Canvas world (9 rooms, 73 stations, 9 crew, props, floors, walls, skies) | code-drawn in `hfq_data.js` / `mod_world.js`; **every piece has a painted-art slot** (`art.js`) keyed in `web/assets/art/manifest.json` | adding a file + one manifest line; the code art is the fallback |
| Title screen | code + optional `screen:title` plate (new in r7.1, `accounts.js`) | manifest line |
| Aircraft (18 fleet, 37 Hall of Flight) | vector drawings in `hfq_aircraft.js` / `hfq_aircraft2.js`; slot `ac:<id>` | manifest line (side view, nose right, transparent) |
| Crew portraits and cadet avatars | procedural portraits (`G.drawPortrait`); slot `npc:<id>` for crew | manifest line (feet at bottom center) |
| Icons (44 canvas, 60 HTML) | stroke vectors in `icons.js` / `hfq_ui.js` | edit the path data; raster icons not accepted (crispness, theming, states) |
| Badges (33), tier marks, unit patches | code-drawn medal/lock glyphs + colors | SVG per badge in a future `badge:<id>` slot (not yet wired; see §4) |
| Instructional figures (four forces, six-pack, signs, lights…) | deterministic code (`hfq_figs.js`) from FAA references | **never** replaced by generated imagery (assessment integrity) |
| HTML layer (Hub, Library, Explorer, Record, Backup) | CSS tokens + vector icons; covers as WebP; Hub hero wears the `screen:title` plate | CSS / manifest |
| Explorer map | pre-projected Natural Earth SVG paths | regenerate with `tools/build_basemap.js` |
| Book covers (7) | real covers, author line cropped | replace files in `assets/series/` |

## 2. What the Illustrated Revision supplied, and how it was used

| Concept file | Size | Used as | Notes |
|---|---|---|---|
| `landing_screen.png` | 307×544 | **PL-01** title screen (rows 0–383, the baked buttons cropped and typeset by the app); **PL-02** Hub hero strip (rows 248–383) | brand text only in the painting |
| `pilots_lounge.png` | 390×544 | **PL-03** Lounge back wall (scene region without the baked bars/buttons, `fit:cover`, the window band shown) | the baked academy sign is brand |
| `ground_school.png` | 320×544 | not used as a wall (its projection screen carries a baked diagram); the Classroom uses the “Classroom” environment tile | the four-forces figure stays code-drawn |
| `hangar.png` | 196×544 | **PL-05** Hangar back wall, upper structure band (the unverified aircraft sits below the band) | |
| `map_explorer.png` | 323×544 | not used (the app has a real projected map) | |
| `environment_scenes.png` | 7 tiles ≈ 120×110 | **PL-04, PL-06…PL-11**: Classroom, Game Room (night ops), Platform + Runway sky, Tower view, Parking Stand (terminal), Wash Rack (hangar), and the Hub tile backgrounds | label bands trimmed |
| `navigation_icons.png`, `buttons.png`, `achievement_badges.png` | strips, baked labels | **art direction, rebuilt as vectors**: gold discs on the world tab bar, Flight Bag cards, list rows and Hub tiles; gold round back/gear buttons; bevelled gold primary buttons; winged insignia on earned badges | crisp at every size, themeable, with states |
| `character_portraits.png` | 8 tiles ≈ 90 px | not used | book characters stay in the books (author’s decision) |
| `aircraft_reference_UNVERIFIED.png`, `instrument_reference_UNVERIFIED.png` | strips | not used | unverified by the supplier; one real airline livery; invented gauge numerals |
| `weather_icons.png` | 9 tiles | not used | weather figures stay code-drawn |

## 3. Production spec: what to generate so it drops in

All files transparent WebP (lossless or q≥90) unless noted, sRGB, no text, no logos, no N-numbers that spell words; one asset per file; filenames as given; each with a one-line accessible description. Device target is 2× DPR at 390 px width, so world-unit sizes below are given with the pixel size to deliver.

### 3.1 Room walls and floors (the biggest visual win; 9 + 9 slots)

| Slot key | Scene | World units (w×h) | Deliver (px) | Content brief |
|---|---|---|---|---|
| `room:lounge:wall` | Pilot's Lounge | 520×120 | 3120×720 | back wall of a flight-school lounge: big windows onto the apron at golden hour, tower in the distance, warm interior light; **leave the station x-ranges free of focal objects** (stations list in `hfq_data.js`) |
| `room:gameroom:wall` | Game Room | 600×120 | 3600×720 | panelled wall, neon-free, framed aviation prints as soft shapes |
| `room:classroom:wall` | Classroom | 520×120 | 3120×720 | ground-school wall: blank whiteboard/projection area (diagrams are drawn by code over it), charts as soft shapes |
| `room:hangar:wall` | Hangar | 560×130 | 3360×780 | hangar interior wall, open door with sunset sky at one end, tool boards as soft shapes |
| `room:platform:wall` | Viewing Platform | 780×140 (sky band, outdoor: 200 units past the left edge) | 4680×840 | sky at golden hour over distant hills; no aircraft (they are drawn) |
| `room:tower:wall` | Tower cab | 520×150 | 3120×900 | tower cab windows with the airfield below, dusk |
| `room:ramp:wall` | Parking Stand | 840×110 (outdoor) | 5040×660 | apron horizon with the terminal/FBO far away |
| `room:wash:wall` | Wash Rack | 520×130 | 3120×780 | wash bay wall, hoses and racks as soft shapes |
| `room:runway:wall` | Runway | 840×110 (outdoor) | 5040×660 | runway horizon with PAPI far off; no markings (code draws FAA-standard markings) |
| `room:<id>:floor` | all nine | w × (h−wall), e.g. lounge 520×280 | 3120×1680 | floor texture plate drawn in perspective by the engine; subtle, no objects |

### 3.2 Title and hero

| Slot key | Deliver | Content brief |
|---|---|---|
| `screen:title` | 1560×1200 landscape, alpha fade baked into the top 60% | cadet seen from behind at a GA airfield at golden hour; **no text**; the typeset name sits above it (currently: the 4× upscaled concept crop) |
| `screen:hero-wide` (Hub hero; CSS) | 2400×900 | same scene, wider crop for tablet/desktop |

### 3.3 Props, stations and crew (optional; code art is strong here)

47 distinct prop drawings (`prop:<art>`), 23 station wall arts (`wall:<art>`), 9 crew (`npc:<id>`, 30×46 world units → 180×276 px, feet at bottom center). Only replace a prop when the illustration is clearly better than the vector; crew stay the app's own characters.

### 3.4 Aircraft (55 slots, `ac:<id>`)

Side view, nose right, transparent, 1200×400 px, verified against a three-view drawing for the exact type (wing position, struts, gear, propeller count, tail). Each delivery includes the reference used. None accepted without the geometry check; no real liveries or airline marks.

### 3.5 Badges (33) and tiers (4)

SVG, 96×96 viewBox, gold-metal style from the board, no text (labels are typeset). A `badge:<id>` slot will be wired when the first batch arrives (two-line change in `hfq_hub.js` and `hfq_logbook.js`).

### 3.6 Not to produce

Icons (vector, code), instruments and instructional figures (code, FAA references), FAA signs/markings/lights (code, standard colors), book covers (supplied), the map (data).

## 4. Pilot batch recommendation

Five assets, reviewed before the rest: `room:lounge:wall`, `room:classroom:wall`, `room:hangar:wall`, `room:platform:wall` (sky), `screen:title` at full resolution. Drop them into `web/assets/art/`, add their manifest lines, run `node qa/run_all.js --fast` and `python3 tools/contact_sheet.py`, and review `qa/shots/`.

## 5. Status table

| Item | Status |
|---|---|
| Landing painting (`screen:title`) | integrated (4× upscale); replace at native resolution per §3.2 |
| Hub hero and tile plates | integrated (CSS backgrounds) |
| Room back walls and skies, all nine rooms | integrated from the concept scenes (3–4× upscales, `fit:cover`); native-resolution plates per §3.1 would sharpen them; floors stay code-drawn (perspective) |
| Aircraft | code-drawn by decision; production spec in §3.4 if wanted later |
| Characters | app crew unchanged by decision |
| Icons, buttons, chrome | vector, restyled to the board in r7.1: gold discs, gold titles, bevelled gold buttons; no raster |
| Badges | earned badges wear the academy insignia (vector); per-badge art per §3.5 remains open |
| Instruments, figures | code, FAA-referenced; not replaceable by generated art |
