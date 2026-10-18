# QA report: r7.3, the raw downloads and the art checked in context (2026-10-17)

"Tested" means a script ran in headless Chromium in this environment and its result is recorded. The r7.2 report covers the first integration of the delivery; this one covers what changed since.

## Inputs

The illustrator's three raw-download ZIPs (`openart-download.zip`, `-1`, `-2`; 33 PNGs, 2048 to 6224 px). Each file was matched to the delivery and read at full size: **22 are the full-size originals of files already delivered** (exactly the 22 that were not preview-based), **11 are extra generations**. None is an original of the 22 preview-based files. Decisions, file by file: `docs/ART_ACCEPTANCE.md`.

## Pass 1: detail review (lettering, aircraft, insignia)

| Finding | Where | Action |
|---|---|---|
| Academy name lettered on discs and emblems | 4 extra generations, the profile medallion | not used |
| Propeller in the middle of a fuselage, behind a canard | the extra "trainer" badge | rejected (`badge-firstflight` stays the in-house gold-disc stand-in) |
| US military star-and-bar roundel on a civil trainer | the FBO tile; the dusk apron panorama | cloned out along the fuselage stripes (FBO, on the 4704-px original); left out by stitching (panorama) |
| Tail wheel as well as nose wheel on a tricycle trainer | the FBO tile | removed (wall and apron cloned in, yellow line kept) |
| WWII fighter with fuselage code letters outside the window | the classroom tile | removed (the field continues; the mullion kept) |
| Aircraft with no wing, framed on the wall | the game-room wall's corner print | gone with the wall rebuild |
| Threshold lights white (FAA: green/red), nonsense runway numbers, a picture frame | the night runway | stays rejected |
| Brand lettering spelled correctly, clean letterforms | hangar and FBO tiles | accepted |
| Aircraft geometry (high wing, struts, tricycle gear, two-blade prop) | hangar tile | correct; accepted |

## Pass 2: in context

Every room rendered whole with the app's own stations drawn over the painted wall (`qa/shots/r7_3_rooms/`, a review render with the camera zoomed out and labels off). Found and fixed:

| Room | Problem | Fix |
|---|---|---|
| Pilot's Lounge | a painted door showed beside the app's door; slivers of a painted cork board and trophy case beside the app's boards | painted out as plain wall, row by row (wainscot grain continued) |
| Classroom | a painted bookshelf, projection screen and cork board showed beside the app's shelf, board and patch wall; outlets | painted out as plain wall (chair rail continued) |
| Game Room | a painted door behind the basketball hoop; a corner print beside the score board | whole wall rebuilt from one clean panel of its own |
| Game Room floor | busy white cross-hatch | replaced by the carpet's own plain weave (clean band, mirrored) |
| Wash Rack floor | large white blotches, repeated halfway across | reduced to the fine grain of wet concrete |
| Runway | a plain sky band (off brief) | the dusk apron panorama: hangars at the left, tree line at the right |
| Hangar, Tower, Platform, Parking Stand | none (the hangar's painted door opening is where the app's door is) | none |

Also fixed: the settings glyph was set too small on its disc (faint background tint counted as glyph).

## Pass 3: implementation

| Change | File |
|---|---|
| Raw-download triage, extra badges, runway stitch, FBO and classroom tile repairs, wall retouches, floor calming | `tools/integrate_art.py` (`--openart`) |
| 33 badges mapped across fifteen arts | `web/js/hfq_logbook.js` (`BADGE_ART`) |
| Five badge slots added (`badge:groundschool`, `laurel`, `airliner`, `biplane`, `jetliner`) | `web/assets/art/manifest.json` |
| Version 7.3.0 | `web/js/hfq_version.js` |
| Acceptance record, asset manifest (69 assets), contact sheet, round-2 request v1.1 | `docs/ART_ACCEPTANCE.md`, `docs/ASSET_MANIFEST.json`, `docs/CONTACT_SHEET.pdf`, `docs/ART_ROUND2_CORRECTIONS.pdf` |

## Pass 4: regression

`node qa/run_all.js --fast` (log: `docs/QA_RUN_ALL_r7.3.log`): structure OK, content OK, byline OK, arch 19/19, smoke 38/38, games 52/52, r4 54/54, r5 38/38, r6 88/88, e2e 100/100, r7 parity 41/41, r7 backup 28/28, r7 explorer 36/36: **all green**. Then `node tools/build.js` (v7.3.0, build `mvby7rmf-izyfdg`, 93 files precached), byline guard on the whole tree OK, structure check OK, `hfq_dist_parity.js` 3/3, `hfq_r7_offline.js` against `dist/` 13/13. Screens at 390×844 @2x: `qa/shots/r7_3/` (badge variety on the Achievements list and the Logbook checked).

## Outstanding (not done, not claimed)

1. The 22 preview-based files remain soft until full-size versions arrive (round 2).
2. `tile-runway` and `tile-night` stay at their r7.1 art; `badge-firstflight` and `badge-navigation` are stand-ins; the profile disc is code-made.
3. The ramp horizon's distant hangars show stair-stepped roof edges at full zoom (a property of the 512-px preview; not fixable without the original).
4. Everything in `docs/KNOWN_ISSUES.md` not about artwork still applies.
