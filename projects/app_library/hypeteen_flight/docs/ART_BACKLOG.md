# Art backlog and production rules (Gate 7)

## What r7 ships

The r7 visual integration is done with vector and code-drawn art plus the supplied covers, listed in `docs/ASSET_MANIFEST.json` (18 files) and shown on `docs/CONTACT_SHEET.pdf`:

- the academy insignia and icon set (BR-01…BR-06), drawn in code from the series' heraldic direction;
- the seven real front covers, author line cropped (CV-01…CV-07);
- three bundled typefaces (editorial serif for display, a book serif for reading, a modern sans for UI), served locally;
- the Natural Earth basemap, pre-projected;
- the repainted canvas world: navy #10263D, airfield blue #183B5A, brass #B88C35, cream #F2E7CB, slate #657889 applied app-wide (FAA signs, markings and lights keep their standard colors on purpose).

**Candor:** this production session had no image-generation capability. Nothing raster was generated for r7; the painterly, photoreal environment art the brief asks for (families A–J) is not in this release. The audit of existing art (`docs/02_AUDIT_REGISTER.md`, D14) found the r6.6 canvas scenes strong enough to keep, repainted; nothing was replaced with a weaker asset.

## The 260-slot backlog, mapped to real needs

The brief lists ten families of 26. Mapped against the app as it stands, de-duplicated against what is drawn in code, the honest need is smaller. Slots marked **keep code** are already served by vector/code art and should not be produced as raster.

| Family | Brief | Real need in the app | Slots to produce | Notes |
|---|---|---|---|---|
| A Airfield exteriors | 26 | 9 room backdrops (Lounge, Game Room, Classroom, Hangar, Platform, Tower, Parking Stand, Wash Rack, Runway) at day + dusk | 18 | The canvas world draws the floor and props; a painted sky/horizon band per room is the visible win. |
| B Building interiors | 26 | wall art for the 9 rooms (`room:<id>:wall` slots already exist in `G.ART`) | 9 | The `G.ART` manifest (`web/assets/art/manifest.json`) accepts a painted wall per room with no code change. |
| C Aircraft recognition | 26 | 26 aircraft portraits for the Hall of Flight / Plane Spotter | 26 | Must be accurate silhouettes; validate each type against reference photos. |
| D Cockpit and controls | 26 | 0 for assessments (instrument figures stay code-drawn and FAA-referenced); 6 ambient cockpit scenes for lesson briefings | 6 | Never use generated instruments in quiz items. |
| E Weather learning | 26 | 10 cloud/front/sky scenes for the Weather units' briefings | 10 | Cloud types must be identifiable; label nothing in the image. |
| F Navigation learning | 26 | 0 (sectional excerpts must be real FAA charts, not generated); 4 scenic checkpoints for Cross-Country briefings | 4 | Real chart excerpts need a source decision (FAA charts are public domain). |
| G Communications | 26 | 4 Tower / radio room scenes | 4 | The runway and taxi signs stay code-drawn to FAA spec. |
| H Explorer destinations | 26 | 0 photographs (policy: none shipped); 6 generic category illustrations (museum, airfield, spaceflight, memorial, pioneer home, display) | 6 | Generic, not of a specific real place, to avoid misrepresenting a site. |
| I Cadet records and rewards | 26 | 33 badge marks + 4 tier marks (bronze/silver/gold/patch) | **keep code** | Already vector; a raster set would be palette-swapped duplicates, which the brief forbids. |
| J App interface and states | 26 | 5 empty/error/offline illustrations | 5 | Small, single-color-plus-brass spot art. |

**Total honest need: 88 raster assets**, not 260. Produce them as a pilot batch of 3–5 first (recommended: one room sky band, one aircraft portrait, one cloud scene, one Explorer category card, one empty-state spot), review against the rules below, then expand family by family.

## Acceptance rules for every new image

1. Visual consistency with the covers: painterly hyper-realism, golden-hour skies, navy/brass framing; no cartoon outlines.
2. Aircraft and anatomy accuracy (a Cessna 172 has a strut and a single nose wheel; propeller blade count matches the type).
3. Legible at target size (room sky band: 270 canvas units wide; aircraft portrait: 120 px square; spot art: 96 px).
4. **No baked-in text**, no fake labels, no N-numbers that spell words, no logos. The app sets all type.
5. File budget: WebP, ≤ 150 KB for a backdrop, ≤ 40 KB for a portrait or spot; dimensions in the manifest.
6. An accessible description written for each (goes into `alt` / `aria-label`).
7. Manifest row filled before the file lands in `web/assets/` (id, role, screen, path, dimensions, transparent, source/prompt, rights, approval, validation, fallback).
8. Any instrument, chart, display or control used for assessment must be exact and independently validated, or it does not go into a test item. Generative mockups are marked `non-instructional` in the manifest.

## Prompt pack (for an external image model, under review)

Common suffix: "painterly hyper-realistic illustration, golden-hour light, navy and brass accents, no text, no lettering, no logos, no people's faces in close-up, clean composition with empty space at the top for a title bar".

- A-sky-01 Lounge dusk: "a small-airport pilot's lounge seen from inside toward big windows, a ramp with two parked training airplanes outside at sunset"
- A-sky-06 Tower day: "view from a small control tower cab over a single runway and a grass airfield, late afternoon, windsock lifting in a light wind"
- C-01 Cessna 172 three-quarter front portrait on a neutral warm backdrop, high wing with struts, tricycle gear, two-blade propeller
- E-03 Cumulonimbus: "a towering cumulonimbus with an anvil top over flat farmland, seen from the ground, dramatic but accurate"
- H-01 Museum (generic): "a bright aviation museum hall with several historic aircraft hung from the ceiling, no signage legible"
- J-03 Offline state: "a small brass compass rose on navy, soft vignette, spot illustration"

Each generated candidate is reviewed with the eight rules above; rejected images are not kept.
