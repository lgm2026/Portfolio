# QA report: r7.1 visual integration pass (2026-10-16)

This report distinguishes tested, untested, corrected and outstanding items. "Tested" means a script ran in headless Chromium in this environment and its result is recorded; nothing else is claimed as tested.

## Scope of the pass

Input: `HypeTeen_Illustrated_Revision.zip` (13 concept PNGs, 136–544 px, baked UI text; README and PDF call them references; aircraft and instruments marked UNVERIFIED). Not supplied: the Technical Artwork QA Pack and the Android screenshots. No image generation in this environment; the author directed that the board's look be applied with its paintings as they are.

Decisions with the author (2026-10-16): the board drives the whole UI; crew stay the app's own characters; aircraft stay code-drawn; author name nowhere.

## Pass 1: visual fidelity (what changed, where)

| Screen family | Change |
|---|---|
| Welcome page (“cleared to enter”) | the landing painting fills the page; the CTA sits on a navy fade below it; the board's bevelled gold button |
| Landing | the board's landing painting is the screen (title art, tagline, cadet, airfield); ENROLL / VISIT AS GUEST / SETTINGS typeset below it in the board's gold/navy button styles |
| Walkable airfield, all nine rooms | painted back walls and skies cut from the board's scenes to each slot's exact aspect and retouched as soft-focus backdrops (bokeh grade toward navy/gold, grain), so the 3–4× upscale reads as depth, not distortion; code-drawn stations, crew and floors over them |
| World tab bar, MAP and TOWER buttons, Settings gear | **the board's own navigation discs**, cut out as transparent assets (path, lounge, class, hangar, flight bag, map, tower, crew board, profile, achievements, settings); the active tab lit |
| Top bars (canvas + HTML) | gold bold titles, cream small-caps subtitles, round bevelled gold back/gear buttons, gold hairline |
| Flight Bag cards, list rows | the board's discs where it has one, matching vector gold discs elsewhere; gold hairlines |
| Academy Hub | hero card on the landing painting; every tile a scene plate with a gold disc icon; section titles in gold |
| Achievements, Flight Record, Logbook | **the board's ten winged badges**, cut out as transparent assets; each of the 33 badges maps to one (locked badges greyed with a lock) |
| Buttons (HTML) | bevelled gold primary, navy/gold secondary and ghost, as on the board |
| Library, Explorer, Reader | inherit the gold title bar and buttons; covers unchanged (real covers) |

Treatment of the plates: each is cut from its concept at the slot's exact aspect, then given a deliberate soft focus, a grade toward the brand palette (warm highlights, cool shadows, navy at the floor line) and fine grain, so they read as depth behind the sharp foreground rather than as stretched upscales. The landing painting keeps full detail with light grain. Native-resolution plates (inventory §3) drop in file-for-file.

## Pass 2: technical accuracy

| Item | Finding |
|---|---|
| Aircraft strip | Supplier-flagged UNVERIFIED. At thumbnail size the "Cirrus SR22" lacks its canopy/door shape, the "Diamond DA40" cowling is generic, the "Beechcraft King Air 350" has an under-length nacelle, and one tile carries a real airline livery (trademark). None admitted. |
| Instrument strip | Generated gauges with invented scale numerals and a "G1000-style" display with illegible text. None admitted; instruments remain code-drawn from FAA references (`hfq_figs.js`). |
| Ground-school screen | The projected four-forces diagram is baked and unverified; the app's own vector figure is used instead. |
| Integrated plate | Contains distant aircraft (a high-wing single and a low-wing single, plausible silhouettes, not instructional) and a tower; no text; no markings that a lesson could misread. |

## Pass 3: implementation

| Change | File | Tested by |
|---|---|---|
| `fit:'cover'` with a focal point for painted-art slots | `web/js/art.js` (shell, mirrored) | structure check; room screenshots `qa/shots/r7_1/` |
| Landing painting layout (plate on top, buttons below; logo/name step aside) | `web/js/accounts.js` (shell, mirrored) | `hfq_smoke.js`, `hfq_e2e.js` (enrollment through the real buttons) |
| Gold-disc tab bar; gold titles and bevelled round buttons in the top bar; gold-disc Flight Bag cards and list rows | `web/js/mod_world.js`, `engine.js`, `dash.js`, `ui_list.js` (shell, mirrored); `rendition.js` (`titleGold`) | every browser suite drives these controls by touch |
| Eleven plates + manifest | `web/assets/art/*.webp`, `web/assets/art/manifest.json` | `hfq_dist_parity.js`, `hfq_r7_offline.js` (precached, offline) |
| HTML layer: gold titles, gold discs, tile plates, hero strip, winged badges | `web/css/htfa.css`, `web/js/hfq_hub.js` | `hfq_r7_parity.js`, `hfq_r7_explorer.js` |
| Asset manifest PL-01…PL-11; version 7.1.0 | `docs/ASSET_MANIFEST.json`, `web/js/hfq_version.js` | byline guard; build |

## Pass 4: functional regression

`node qa/run_all.js --fast` after the change (log: `docs/QA_RUN_ALL_r7.1.log`): structure, content, byline guard and the ten browser suites. Then `node tools/build.js`, `qa/hfq_dist_parity.js` and `qa/hfq_r7_offline.js` against the new `dist/`. Results are recorded in the log; the summary line at the end of this report is copied from it.

## Pass 5: final presentation

Screens at 390×844 @2x (phone), 820×1180 (tablet) and 1440×900 (desktop) in `qa/shots/r7_sizes/` and `qa/shots/r7_1/`. Checked: no clipped labels on the title and Hub, touch targets ≥ 44 px, no horizontal overflow, text scales with the setting.

## Outstanding (not done, not claimed)

1. The painted plates are upscaled concept crops; a native-resolution batch per `docs/ASSET_REPLACEMENT_INVENTORY.md` §3 sharpens them file-for-file. Floors stay code-drawn (perspective). Per-badge and aircraft art remain open by decision.
2. Canvas props, crew and aircraft are the repainted vector art, now set against painted walls; a prop-by-prop illustration pass is specified but not done.
3. Canvas text sizes on the 58 canvas scenes (audit D07) unchanged.
4. Real-device (iOS Safari, Android Chrome) checks not possible here.
5. The Technical Artwork QA Pack was not supplied; its standards could not be applied beyond what the brief states.
6. Everything in `docs/KNOWN_ISSUES.md` from r7.0 still applies.

## Result summary

`node qa/run_all.js --fast`: structure OK, content OK, byline OK, arch 19/19, smoke 38/38, games 52/52, r4 54/54, r5 38/38, r6 88/88, e2e 100/100, r7 parity 41/41, r7 backup 28/28, r7 explorer 36/36: **all green**. Then on the r7.1 build: byline guard OK, dist parity 3/3, offline on dist 13/13. The 500-lesson flight and the dist-side parity/e2e/arch runs were last executed on r7.0 earlier the same day (`docs/QA_RUN_ALL_r7.0.log`); the r7.1 change touches the title screen and the Hub hero only.
