# QA report: r7.2 artwork integration (2026-10-17)

"Tested" means a script ran in headless Chromium in this environment and its result is recorded; nothing else is claimed as tested. The r7.1 report (`QA_REPORT_r7.1.md`) and the r7.0 log still stand for what they cover.

## Scope

Input: the illustrator's delivery against `docs/ART_GENERATION_BRIEF.pdf` (a 48-page PDF and `HypeTeen_Flight_Academy_PNG_Assets.zip`, 44 PNGs plus the illustrator's own `asset_manifest.json`), and two badge images shared separately. Every file was inventoried against the brief (size, aspect, alpha, lettering, content) and reviewed on screen; `docs/ART_ACCEPTANCE.md` records the decision for each, `docs/ART_INTEGRATION_LOG.json` is the machine record, and `tools/integrate_art.py` reproduces the processing from the delivery.

## Pass 1: acceptance against the brief

| Check | Result |
|---|---|
| Pixel size and aspect | 44/44 exact |
| Transparency | discs and badges delivered on black (and two on a baked checkerboard); keyed to alpha here; 1 disc replaced |
| Lettering | 5 files carried words: game-room sign (misspelled brand, cloned out), runway tile (nonsense, rejected), night tile (nonsense runway numbers, rejected), profile disc (academy name, replaced), navigation badge (ring lettering, refilled). Brand lettering on the hangar and FBO tiles is spelled correctly and accepted |
| Faces | 1 (profile disc, replaced) |
| Source resolution | the illustrator's manifest states 22 of 44 files were exported from 512-px previews and enlarged; they are accepted as the best available and flagged soft; the originals are requested in round 2 |
| Missing | `badge-firstflight` (derived from the delivered navy-star badge, disc recolored gold) and `badge-navigation` (the separately shared file with its ring lettering refilled) |
| Aviation | no cockpit, instrument, sign or marking content in any accepted file; the ramp and runway floors stay code-drawn so FAA markings and lights remain exact; the hangar lead-in line is drawn by code over the painted floor |

Outcome: 32 accepted, 10 fixed, 1 derived, 1 replaced, 2 rejected (the r7.1 tiles stay for those two slots).

## Pass 2: implementation

| Change | File | Tested by |
|---|---|---|
| 44 art files replaced or added (`web/assets/art/**`, 1.4 MB total) | manifest `web/assets/art/manifest.json` (40 keys: 7 floor slots added, sky focal offsets removed) | `hfq_dist_parity.js`, `hfq_r7_offline.js` (88 files precached) |
| Painted floor keeps the room's lead-in line | `web/js/mod_world.js` (shell, mirrored) | structure check; room screenshots |
| Title screen: insignia, name and subtitle typeset over the painting's sky; buttons centered below the plate | `web/js/accounts.js` (shell, mirrored) | `hfq_smoke.js`, `hfq_e2e.js` (enrollment through the real buttons); screenshots at 360×640, 390×844, 820×1180 |
| Welcome page: title block over the sky, start button and welcome text in the space below the painting | `web/index.html` | every suite boots through it; screenshots at three sizes |
| Version 7.2.0 | `web/js/hfq_version.js` | build id `mvbvuo5p-a0a7w2` |
| Asset manifest document: 64 assets (FL-01…07 added; PL/IC/BD rows refreshed with source, bytes, digest) | `docs/ASSET_MANIFEST.json`, `docs/CONTACT_SHEET.pdf` | byline guard |

## Pass 3: functional regression

`node qa/run_all.js --fast` (log: `docs/QA_RUN_ALL_r7.2.log`): structure OK, content OK, byline OK, arch 19/19, smoke 38/38, games 52/52, r4 54/54, r5 38/38, r6 88/88, e2e 100/100, r7 parity 41/41, r7 backup 28/28, r7 explorer 36/36: **all green**. Then `node tools/build.js` (v7.2.0, 88 files precached), byline guard on the tree OK, `hfq_dist_parity.js` 3/3, `hfq_r7_offline.js` against `dist/` 13/13.

## Pass 4: presentation

Screens at 390×844 @2x in `qa/shots/r7_2/` (welcome, landing, all nine rooms, Flight Bag, Logbook, Hub, Hub tiles, Achievements, Library, Explorer) and the welcome/landing pair at 360×640 and 820×1180. Checked: the name is legible over the sky at every size; buttons sit below the painting with no clipped labels; painted floors recede correctly in all seven rooms; the hangar door, classroom board and lounge boards drawn by the app sit over calm regions of the painted walls; badge and disc edges show no halo on the navy cards.

## Outstanding (not done, not claimed)

1. 22 delivered files are preview upscales (title painting, hero, seven walls, three tiles, seven floors, three discs). They are purpose-made and on brief, so they replace the concept crops, but they read soft on a phone. `docs/ART_ROUND2_CORRECTIONS.pdf` asks for the originals; they drop in file-for-file.
2. `tile-runway` and `tile-night` rejected; `badge-firstflight` and `badge-navigation` are derived stand-ins; the profile disc is code-made. All four are on the round-2 list.
3. `wall-runway` is a plain sky (the brief asked for a horizon); acceptable, optional redo.
4. Everything in `docs/KNOWN_ISSUES.md` from r7.0 and r7.1 that is not about artwork still applies (canvas text size, real-device checks, nginx, Terms, D12 content pass).
