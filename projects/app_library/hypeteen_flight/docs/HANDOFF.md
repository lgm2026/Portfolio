# HypeTeen Flight Academy r7.4: production handoff

Release date 2026-10-17 (r7.0 feature release and r7.1 visual integration on 2026-10-16; r7.2 integrates the commissioned artwork; r7.3 adds the illustrator's raw downloads and an in-context art check; r7.4 is the learning, aircraft, helicopter and crew round from the eleven-point brief). Imprint: Hype Learning Academies.

**Status: feature-complete, tested; not final.** r7.4 (`ROUND_NOTES.md`) adds learn-for-a-retry in four games, the instructor's clue ladder in every lesson, aircraft drawn to scale from published dimensions with ID cards and an audit, a HELICOPTERS unit (12 lessons) with eleven diagrams and eight new rotorcraft, a crew that leads with the cadet's own progress and notices when they are stuck, a Terms gate for guests and sign-ins, notices in tiers, controls that follow the input used, and the Library with the ground-school books first and the seven-book series last. The illustrator's artwork is as in r7.3; half of it is still at preview resolution (`docs/ART_ROUND2_CORRECTIONS.pdf`). `docs/QA_REPORT_r7.4.md` has the pass-by-pass record.

## What this is

The companion learning app to the seven-book HypeTeen Flight Academy series, for cadets aged 10–14. Plain HTML/CSS/JS on one canvas plus an HTML layer; no framework, no dependencies at runtime, nothing leaves the device. Runs from `web/` as it is; `dist/` is the published build.

## Start here

| Need | Read |
|---|---|
| Run and test it | `docs/BUILD_AND_RUN.md`, `README.md` → *Run it* |
| What changed and why, with evidence | `ROUND_NOTES.md` (Round 7.4 at the top), `docs/02_AUDIT_REGISTER.md` |
| How the code fits together | `ARCHITECTURE.md` |
| Upgrade from r6.6 (nothing lost) | `docs/04_MIGRATION_GUIDE.md` |
| Every activity (938) | `docs/ACTIVITY_REGISTRY.md` (generated) |
| Backup file format, import rules, merge rules | `docs/BACKUP_FORMAT.md` |
| Explorer data, citations, licenses | `docs/EXPLORER_DESTINATIONS.md` (generated) |
| Putting a book in the Library | `docs/LIBRARY_PIPELINE.md` |
| Images: manifest, contact sheet, the art backlog | `docs/ASSET_MANIFEST.json`, `docs/CONTACT_SHEET.pdf`, `docs/ART_BACKLOG.md` |
| The design system | `docs/03_DESIGN_SYSTEM.md` |
| What is not done | `docs/KNOWN_ISSUES.md`, `docs/QA_REPORT_r7.4.md` |
| Art replacement inventory and production spec | `docs/ASSET_REPLACEMENT_INVENTORY.md` |
| The brief handed to the illustrator (46 assets, sizes, rules, return format) | `docs/ART_GENERATION_BRIEF.pdf` (built by `tools/art_brief.py`) |
| What came back and what was done with it, file by file | `docs/ART_ACCEPTANCE.md`, `docs/ART_INTEGRATION_LOG.json` (`tools/integrate_art.py --delivery <zip dir> --extra <shared files> --openart <raw downloads>`) |
| The follow-up request to the illustrator | `docs/ART_ROUND2_CORRECTIONS.pdf` (`tools/art_round2.py`) |

## Deploy

1. `node tools/build.js` → `dist/` (two minified bundles, content as data, lazy content, the service worker with a precache list and a build id).
2. Serve `dist/` as static files with the headers in `tools/hosting/hfq-security-headers.conf` (`nginx-hfq.conf` is a full example; run `nginx -t`). https is required for encrypted backups and for installing to a home screen.
3. Smoke it: `BASE_URL=https://your-host/ node qa/hfq_r7_offline.js` and `node qa/hfq_e2e.js`.

A new build id invalidates the old cache; families get the update on the next open.

## The rules this app lives by (do not regress)

- **Kids first.** Call signs only, no real names, emails or photos requested; data stays on the device; only the Family Lead posts Hangar News; no free-text chat between cadets; the Flight Log asks for no names. Photos a cadet adds to their own record are shrunk, stripped of metadata and never uploaded.
- **Honest aviation.** Lessons follow FAA handbooks for ages 10–14; FAA signs, markings and lights keep their standard colors; the app never claims to grant a certificate or rating; checkrides are labeled practice; simulated time is never flight time; the Explorer never points to wreckage or restricted places.
- **No author name anywhere.** Not in the app, source, PDFs, docs or build output. `qa/byline_guard.js` enforces it with fingerprints; the book importer refuses manuscripts that still carry it; covers are cropped above the author line.
- **Nothing gated behind the books.** The novels are free and optional; every lesson, game and badge is open to every cadet.
- **Equal outcomes in both modes.** The airfield and the Hub call the same registry; `qa/hfq_r7_parity.js` must stay green.
- **XP is never money; no gambling mechanics.** Game XP is capped daily; lessons always earn the most.
- **Don't assign book characters to roles in the app without the author.** The crew are the app's own characters; the novels' cast appears only inside the books.

## What was inspected, changed, tested, and could not be verified

- **Inspected:** the full r6.6 archive (file manifest with SHA-256 in `docs/baseline/`), the briefs (r7 and the eleven-point r7.4 brief), the series production master (manuscripts, metadata, covers; interior art set aside by the author), the runtime at four viewport sizes, and in r7.4 every aircraft drawing against its published dimensions and every helicopter statement against the FAA Helicopter Flying Handbook.
- **Changed:** 20 register items (statuses in `02_AUDIT_REGISTER.md`); 12 new source files (`hfq_ui`, `hfq_hub`, `hfq_registry`, `hfq_profile`, `hfq_reader`, `hfq_record`, `hfq_backup`, `hfq_store`, `hfq_explorer`, `hfq_offline`, `hfq_version`, `hfq_start`), the design CSS, the content API split, the build, the service worker, the hosting config, the Terms (1.1), the About page, the brand assets, the seven imported novels and their covers, the basemap and destination data. r7.4 adds 15 source files (`hfq_gate`, `hfq_notify`, `hfq_input`, `hfq_crewtalk`, `hfq_retry`, `hfq_inspect`, `hfq_idcards`, `hfq_profiles`, `hfq_profiles_fleet`, `hfq_profiles_hall`, `hfq_figs_heli`, and the content files `lessons/heli`, `aircraft_cards`, `inspect`, `retry`), the Terms (1.2), four shell files (App Shell v1.4.5: `engine`, `mod_world`, `accounts`, `icons`, byte-identical in `app-shell/`), and touches to the lesson, quiz, reader, hub, radio, games and fleet modules.
- **Tested:** `node qa/run_all.js --dist`: structure, content, byline guard, 12 browser suites (arch 28, smoke 38, games 52, r4 54, r5 38, r6 88, e2e 100, parity 41, backup 28, explorer 36, r7.4 round 52, aircraft audit 6), the 512-lesson flight, then on the built bundle: dist parity, offline (13), parity and e2e again. Screenshots in `qa/shots/`; a visual sweep of every screen at phone, tablet and desktop sizes was reviewed by eye for r7.4.
- **Could not be verified here:** real iOS Safari / Android Chrome devices; `nginx -t`; a lawyer's reading of the Terms (and whether the guest gate meets parental-consent rules where the app is offered); the author's content pass on quiz distractors (D12); the T-6 Texan's published height and a few rotorcraft figures to the inch. No image generation is available here: the artwork is the illustrator's, mechanically repaired where recorded. Each is in `docs/KNOWN_ISSUES.md`.

## Release contents

`HypeTeen_Flight_Academy_Production_r7.4.zip` (not named FINAL: half of the commissioned artwork is still at preview resolution and the Terms await counsel): `web/` (runnable source), `dist/` (the build), `app-shell/` (the framework the shell files are compared to), `qa/`, `tools/`, `docs/`, `README.md`, `ARCHITECTURE.md`, `ROUND_NOTES.md`, `LICENSE`, `PROTECTING_THE_WORK.md`, and `RELEASE_MANIFEST.sha256` (every file's digest). The series production master is **not** in the release zip (it is the publisher's own package); the app carries only the imported story text and the cropped covers.
