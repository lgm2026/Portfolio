# Art acceptance record: the commissioned artwork

Two inputs, both measured against `docs/ART_GENERATION_BRIEF.pdf` (46 assets):

1. **The delivery (2026-10-16)**, a PDF and a ZIP of PNGs: 44 of 46 files, every one at the exact pixel size and aspect asked for; `badge-firstflight` and `badge-navigation` missing. The illustrator's own manifest states that **22 of the 44 were exported from 512-px WebP previews and enlarged**, which does not recover detail; the other 22 came from full-size originals (2048 to 6224 px).
2. **The raw downloads (2026-10-17)**, three ZIPs straight from the generator: 33 files. 22 are the full-size originals of files already delivered (exactly the 22 that were not preview-based), 11 are extra generations that were not delivered. **None of them is an original of the 22 preview-based files**, so those still need re-exporting or regenerating (round 2).

Outcome in the app (r7.3), over the 46 briefed slots: **26 accepted as delivered, 15 fixed in-house, 1 derived, 2 replaced, 2 rejected**, plus 5 extra badge arts taken from the raw downloads. Every repair is mechanical (keying, cloning along the image's own structure, row-by-row continuation of plain wall or sky, recoloring, stitching) and is listed; nothing was repainted by hand or generated. Rejected slots keep their r7.1 art. Processing: `tools/integrate_art.py`; this record: `tools/art_acceptance.py`.

## How it was checked

- **Against the brief:** size, aspect, transparency, lettering (every letter read at full size), faces, brands, military marks, aviation plausibility (wing position, struts, gear, propeller, tail), age-appropriateness.
- **In context:** every room rendered whole (`qa/shots/r7_3_rooms/`) with the app's own stations drawn over the painted wall. That check found painted objects that duplicated the app's own (a painted door beside the app's door, a painted bookshelf, screen, cork boards and trophy case peeking out beside the app's boards, a door behind the basketball hoop); all were painted out. Phone screens: `qa/shots/r7_3/`.

## Per-slot decisions

### Screens

| Asset | Source | Decision | Note |
|---|---|---|---|
| `screen-title` | 409x512 preview, enlarged | **FIXED** | padded navy bottom blended (edge at row 1421); 409x512 source, stored 1000x1250 |
| `screen-hero` | 512x219 preview, enlarged | **ACCEPTED** | 512x219 source (soft); stored 1500x562 |

### Room walls and skies

| Asset | Source | Decision | Note |
|---|---|---|---|
| `wall-classroom` | 512x219 preview, enlarged | **FIXED** | 512x219 source (soft); painted out, as plain wall continued row by row: the painted bookshelf (the app draws the library shelf); the painted projection screen and cork board (the app draws its board and patch wall); the outlets under the screen; stored 1560x360 |
| `wall-hangar` | 512x219 preview, enlarged | **ACCEPTED** | 512x219 source (soft), on brief; stored 1680x390 |
| `wall-lounge` | 512x219 preview, enlarged | **FIXED** | 512x219 source (soft); painted out, as plain wall continued row by row: the painted door (the app draws its own door here); the wainscot under it, continued with its own grain; the painted cork board (the app draws the crew board and Hangar News); the painted trophy case (the app draws the logbook case); stored 1560x360 |
| `wall-platform` | 512x219 preview, enlarged | **ACCEPTED** | 512x219 source (soft), on brief; stored 2040x420 |
| `wall-ramp` | 512x219 preview, enlarged | **ACCEPTED** | 512x219 source (soft), on brief; stored 2520x330 |
| `wall-tower` | 512x219 preview, enlarged | **ACCEPTED** | 512x219 source (soft), on brief; stored 1560x450 |
| `wall-wash` | 512x219 preview, enlarged | **ACCEPTED** | 512x219 source (soft), on brief; stored 1560x390 |
| `wall-gameroom` | 6224x2664 original | **FIXED** | the whole wall rebuilt from one clean panel of its own (period 342 px): the misspelled sign on the arcade machine, the chairs, the dartboard, the door behind the hoops and the corner print (an aircraft with no wing) are gone; the app draws its own door, darts, sign, hoops and score board; 6224-px source, stored 1800x360 |
| `wall-runway` | 6224x2664 original | **REPLACED** | from the raw downloads: the 6224-px dusk apron panorama, stitched from its two clean sides so the parked aircraft (military-style roundels) is left out; hangars at the left, a tree line at the right, the sun low at the right; nothing painted in; replaces the plain sky; stored 2520x330 |

### Floors

| Asset | Source | Decision | Note |
|---|---|---|---|
| `floor-lounge` | 512x288 preview, enlarged | **ACCEPTED** | 512x288 source (texture; fine at this size); stored 1040x560 |
| `floor-gameroom` | 512x288 preview, enlarged | **FIXED** | 512x288 source; the busy white cross-hatch replaced by the plain carpet weave from its own clean bottom band, mirrored down the floor; stored 1200x600 |
| `floor-classroom` | 512x288 preview, enlarged | **ACCEPTED** | 512x288 source (texture; fine at this size); stored 1040x560 |
| `floor-hangar` | 512x288 preview, enlarged | **ACCEPTED** | 512x288 source (texture; fine at this size); stored 1120x580 |
| `floor-platform` | 512x288 preview, enlarged | **ACCEPTED** | 512x288 source (texture; fine at this size); stored 960x440 |
| `floor-tower` | 512x288 preview, enlarged | **ACCEPTED** | 512x288 source (texture; fine at this size); stored 1040x460 |
| `floor-wash` | 512x288 preview, enlarged | **FIXED** | 512x288 source; the large white blotches (they read as stains, and repeated halfway across) reduced to the fine grain of wet concrete; stored 1040x540 |

### Hub scene tiles

| Asset | Source | Decision | Note |
|---|---|---|---|
| `tile-hangar` | 4704x3528 original | **ACCEPTED** | 4704-px source; carries the brand name on the hangar, spelled correctly; aircraft geometry checked (high wing, struts, tricycle gear, two-blade prop); stored 800x600 |
| `tile-lounge` | 512x384 preview, enlarged | **ACCEPTED** | 512-px source (soft); two biplanes outside, a blank world map; stored 800x600 |
| `tile-classroom` | 512x384 preview, enlarged | **FIXED** | 512-px source (soft); a WWII-type fighter with code letters outside the left window removed (the field continues); the biplane outside the right window stays; stored 800x600 |
| `tile-tower` | 512x384 preview, enlarged | **ACCEPTED** | 512-px source (soft); stored 800x600 |
| `tile-terminal` | 4704x3528 original | **FIXED** | 4704-px source; brand name on the FBO, spelled correctly; the parked trainer's military star-and-bar roundel cloned out along its own stripes, and its extra tail wheel (a 172 has a nose wheel only) removed (fixed on the 4704-px original from the raw downloads); stored 800x600 |
| `tile-runway` | 4704x3528 original | **REJECTED** | letterboxed inside a 4:3 canvas; nonsense lettering painted on the runway; the app keeps its previous tile |
| `tile-night` | 4704x3528 original | **REJECTED** | rendered inside a gold picture frame; nonsense runway numbers legible at the threshold; the app keeps its previous tile |

### Navigation discs

| Asset | Source | Decision | Note |
|---|---|---|---|
| `icon-path` | 2048x2048 original | **ACCEPTED** | on brief (navy disc, gold glyph); 2048-px source; circular alpha cut; stored 256x256 |
| `icon-lounge` | 2048x2048 original | **ACCEPTED** | on brief (navy disc, gold glyph); 2048-px source; circular alpha cut; stored 256x256 |
| `icon-class` | 2048x2048 original | **ACCEPTED** | on brief (navy disc, gold glyph); 2048-px source; circular alpha cut; stored 256x256 |
| `icon-crewboard` | 2048x2048 original | **ACCEPTED** | on brief (navy disc, gold glyph); 2048-px source; circular alpha cut; stored 256x256 |
| `icon-hangar` | 2048x2048 original | **FIXED** | delivered as a bare glyph; keyed and set on the brief's navy disc (rim copied from the delivered lounge disc); 2048-px source; stored 256x256 |
| `icon-flightbag` | 512x512 preview, enlarged | **FIXED** | delivered as a bare glyph; keyed and set on the brief's navy disc (rim copied from the delivered lounge disc); 512-px source; stored 256x256 |
| `icon-map` | 512x512 preview, enlarged | **FIXED** | delivered as a bare glyph; keyed and set on the brief's navy disc (rim copied from the delivered lounge disc); 512-px source; stored 256x256 |
| `icon-tower` | 512x512 preview, enlarged | **FIXED** | delivered as a bare glyph; keyed and set on the brief's navy disc (rim copied from the delivered lounge disc); 512-px source; stored 256x256 |
| `icon-achievements` | 2048x2048 original | **FIXED** | delivered as a bare glyph; keyed and set on the brief's navy disc (rim copied from the delivered lounge disc); 2048-px source; stored 256x256 |
| `icon-settings` | 2048x2048 original | **FIXED** | delivered as a bare glyph; keyed and set on the brief's navy disc (rim copied from the delivered lounge disc); 2048-px source; stored 256x256 |
| `icon-profile` | 2048x2048 original | **REPLACED** | delivered with a face and the academy name lettered around the rim (brief: no text, no faces); replaced by a plain head-and-shoulders glyph in the delivered glyph gold on the same disc |

### Badges

| Asset | Source | Decision | Note |
|---|---|---|---|
| `badge-weather` | 2048x2048 original | **ACCEPTED** | on brief; 2048-px source; black keyed; stored 320x320 |
| `badge-radio` | 2048x2048 original | **ACCEPTED** | on brief; 2048-px source; black keyed; stored 320x320 |
| `badge-flightplanning` | 2048x2048 original | **ACCEPTED** | on brief; 2048-px source; black keyed; stored 320x320 |
| `badge-explorer` | 2048x2048 original | **ACCEPTED** | on brief; 2048-px source; black keyed; stored 320x320 |
| `badge-history` | 2048x2048 original | **ACCEPTED** | on brief; 2048-px source; checkerboard keyed; stored 320x320 |
| `badge-maintenance` | 2048x2048 original | **ACCEPTED** | on brief; 2048-px source; black keyed; stored 320x320 |
| `badge-jetops` | 2048x2048 original | **ACCEPTED** | on brief; 2048-px source; checkerboard keyed; stored 320x320 |
| `badge-mastercadet` | 2048x2048 original | **ACCEPTED** | on brief; 2048-px source; black keyed; stored 320x320 |
| `badge-firstflight` | not delivered | **DERIVED** | not delivered; built from the delivered navy-disc star badge with the disc recolored gold, per the brief (gold wings, gold disc, gold star) |
| `badge-navigation` | not delivered | **FIXED** | the delivered badge carried lettering on its ring; the ring was refilled with its own blue (lettering and two dots removed); compass rose untouched |
| `badge-groundschool` | 2048-px original (raw downloads) | **ACCEPTED** | from the raw downloads (2048-px original, black keyed): gold wings with an open book and pencil (blank pages); serves GROUND SCHOOL STUDENT, PAGE ONE, BOOKWORM; stored 320x320 |
| `badge-laurel` | 2048-px original (raw downloads) | **ACCEPTED** | from the raw downloads (2048-px original, black keyed): gold wings with a star in a laurel (no shield, not a service insignia); serves GREASED IT, GOLD WINGS, PRIVATE PILOT GRAD; stored 320x320 |
| `badge-airliner` | 2048-px original (raw downloads) | **ACCEPTED** | from the raw downloads (2048-px original, black keyed): gold wings with a twin-jet airliner seen head-on; serves FREQUENT FLYER; stored 320x320 |
| `badge-biplane` | 2048-px original (raw downloads) | **ACCEPTED** | from the raw downloads (2048-px original, black keyed): gold wings, green disc with a biplane (iconic view); serves SHARP EYES; stored 320x320 |
| `badge-jetliner` | 2048-px original (raw downloads) | **ACCEPTED** | from the raw downloads (2048-px original, black keyed): gold wings, blue disc with a four-engine jet, plan view; serves GAME NIGHT REGULAR, CLUBHOUSE LEGEND; stored 320x320 |

## The raw downloads, file by file

8 junk, 18 original, 1 rejected, 6 used.

| ZIP | File (openart-…) | Kind | Decision | What it is |
|---|---|---|---|---|
| openart-download.zip | `1792200380_01ac09a6` | extra | **USED** | gold wings with an open book and pencil, blank pages: badge art "groundschool" |
| openart-download.zip | `1792200382_69281530` | extra | **JUNK** | roundel lettered FLIGHT ACADEMY around a compass and mountains (lettering) |
| openart-download.zip | `1792200385_742de040` | extra | **REJECTED** | wings with an aircraft whose propeller sits in the middle of the fuselage, behind a canard; not a real configuration |
| openart-download.zip | `1792200387_f388377d` | original | **ORIGINAL** | of the delivered badge-maintenance (in the app) |
| openart-download.zip | `1792200389_e3965d17` | extra | **USED** | gold wings with a twin-jet airliner seen head-on: badge art "airliner" |
| openart-download.zip | `1792200393_c9b4ea84` | extra | **USED** | gold wings with a star in a laurel: badge art "laurel" |
| openart-download.zip | `1792200599_3381a0ca` | original | **JUNK** | portrait medallion with a face and the academy name lettered twice (the delivered icon-profile, replaced) |
| openart-download.zip | `1792200606_f3631260` | original | **ORIGINAL** | of the delivered icon-settings glyph (in the app, on the navy disc) |
| openart-download.zip | `1792200622_1926eba1` | original | **JUNK** | the runway tile: letterboxed, nonsense lettering on the runway (the rejected tile-runway) |
| openart-download.zip | `1792200623_736a322b` | original | **ORIGINAL** | of the delivered tile-terminal; used to repair it at full resolution (military roundel and extra tail wheel removed) |
| openart-download.zip | `1792200627_a6e19118` | original | **ORIGINAL** | of the delivered wall-gameroom (rebuilt from its own panels) |
| openart-download.zip | `1792200643_af582433` | original | **ORIGINAL** | of the delivered tile-hangar (in the app) |
| openart-download.zip | `1792200651_f17fe129` | original | **JUNK** | night runway inside a gold picture frame, nonsense runway numbers, white threshold lights (FAA: green and red) |
| openart-download.zip | `1792200654_db035e34` | original | **USED** | dusk apron panorama: the runway horizon, stitched so its aircraft with military-style roundels is left out |
| openart-download-1.zip | `1792207068_5f87a4d2` | extra | **JUNK** | runway disc with the academy name lettered below it |
| openart-download-1.zip | `1792207070_37031502` | extra | **JUNK** | house glyph with the academy name lettered below it |
| openart-download-1.zip | `1792207072_b31bcd74` | extra | **JUNK** | framed emblem lettered with the academy name twice |
| openart-download-1.zip | `1792207073_404077c9` | original | **ORIGINAL** | of the delivered icon-hangar wrench (in the app) |
| openart-download-1.zip | `1792207078_4cc3a34f` | extra | **JUNK** | crew glyph inside a badge lettered with the academy name |
| openart-download-1.zip | `1792207080_cf936527` | original | **ORIGINAL** | of the delivered icon-achievements trophy (a white corner, keyed out) |
| openart-download-1.zip | `1792207085_32c064e8` | original | **ORIGINAL** | of the delivered badge-explorer |
| openart-download-1.zip | `1792207230_2373bf80` | original | **ORIGINAL** | of the delivered badge-flightplanning |
| openart-download-1.zip | `1792207411_53a286ab` | original | **ORIGINAL** | of the delivered badge-weather |
| openart-download-1.zip | `1792207414_9244efe2` | original | **ORIGINAL** | of the delivered badge-radio |
| openart-download-1.zip | `1792207418_2c5071cc` | extra | **USED** | gold wings, green disc with a biplane: badge art "biplane" |
| openart-download-1.zip | `1792207419_7daf362f` | extra | **USED** | gold wings, blue disc with a four-engine jet: badge art "jetliner" |
| openart-download-1.zip | `1792207423_87c7f3d6` | original | **ORIGINAL** | of the delivered badge-mastercadet |
| openart-download-2.zip | `1792208003_0c17fd65` | original | **ORIGINAL** | of the delivered icon-path |
| openart-download-2.zip | `1792208007_6e66eefa` | original | **ORIGINAL** | of the delivered icon-lounge |
| openart-download-2.zip | `1792208009_dddce2bf` | original | **ORIGINAL** | of the delivered icon-class |
| openart-download-2.zip | `1792208012_d6a76b2e` | original | **ORIGINAL** | of the delivered icon-crewboard |
| openart-download-2.zip | `1792208019_f268c242` | original | **ORIGINAL** | of the delivered badge-history (baked checkerboard, keyed out) |
| openart-download-2.zip | `1792208022_50634083` | original | **ORIGINAL** | of the delivered badge-jetops (baked checkerboard, keyed out) |

## Which art each badge wears

Thirty-three badges share fifteen arts; each badge gets the one that fits it. The mapping lives in `web/js/hfq_logbook.js` (`BADGE_ART`).

| Art | Badges |
|---|---|
| `airliner` | Frequent Flyer |
| `biplane` | Sharp Eyes |
| `explorer` | Locker Ready, Met The Crew, Discovery Grad |
| `firstflight` | First Flight, Logbook Opened |
| `flightplanning` | Flight Days, First Patch, Student Pilot Grad |
| `groundschool` | Ground School Student, Page One, Bookworm |
| `history` | Hall Of Flight, Librarian |
| `jetliner` | Game Night Regular, Clubhouse Legend |
| `jetops` | Game On, Arcade Ace |
| `laurel` | Greased It, Gold Wings, Private Pilot Grad |
| `maintenance` | My Trainer |
| `mastercadet` | Ground School Master, Top Of The Sky |
| `navigation` | Airfield Explorer, First Briefing, Already Knew It |
| `radio` | Enrolled, In The Know, On Frequency |
| `weather` | Tailwind, Trivia Night Regular |

## What still needs the illustrator (round 2)

1. **Full-size originals for the 22 preview-based files**: `floor-classroom`, `floor-gameroom`, `floor-hangar`, `floor-lounge`, `floor-platform`, `floor-tower`, `floor-wash`, `icon-flightbag`, `icon-map`, `icon-tower`, `screen-hero`, `screen-title`, `tile-classroom`, `tile-lounge`, `tile-tower`, `wall-classroom`, `wall-hangar`, `wall-lounge`, `wall-platform`, `wall-ramp`, `wall-tower`, `wall-wash`. They are not in the raw downloads; the generator made the others at 2048 to 6224 px, so these should be re-exported or regenerated at full size.
2. **Redo** `tile-runway` (no lettering on the runway, no letterbox) and `tile-night` (no frame, no numbers, threshold lights green and red, not white), `icon-profile` (no face, no lettering), and `badge-firstflight` and `badge-navigation` as briefed (the app ships derived stand-ins).
3. **Rules that were broken and must not recur:** lettering (a misspelled brand on the game-room machine, lettered roundels and discs); military insignia on civil aircraft (the star-and-bar roundel on the FBO trainer and on the apron panorama's aircraft); impossible aircraft (a third wheel on a tricycle trainer, a propeller in the middle of a fuselage, a framed aircraft with no wing); objects painted where the app draws its own (doors, boards, shelves, cases: keep the hatched zones plain); transparent backgrounds delivered on black or a baked checkerboard.

The forwardable version is `docs/ART_ROUND2_CORRECTIONS.pdf`.
