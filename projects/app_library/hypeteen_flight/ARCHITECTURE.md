# HTFA architecture and code review (rounds 6.5 to 7.0)

## The shape of the code

```
hypeteen-flight-quarters/
  web/                    runs as it is: plain HTML/CSS/JS, no build step
    index.html            the one page; loads every script in order
    js/
      (shell)             config, rendition, theme, audio, engine, icons, art, ui_list, data, accounts, dash, page, mod_*
                          = the app-shell framework. Byte-identical to ../app-shell/web/js (checked by structure_check).
      hfq_*.js            the app: data, places, aircraft, games (hfq_g_*), path, quiz, library, logbook, flight log, radio, lessons engine
      content/
        lessons/          512 lessons: core_1..3 (units 1-13) + one file per newer unit (heli.js: helicopters); H.dsl shorthand
        books/            the 32 Library books
        aircraft_cards.js, inspect.js, retry.js   ID cards, close-ups, learn-for-a-retry (r7.4)
  qa/                     twelve browser suites + the 512-lesson flight + structure/content checks + run_all.js
  tools/build.js          optional bundler: dist/ (2 minified bundles instead of 100 files)
```

Rules the code follows (and `qa/structure_check.js` enforces where a machine can):
1. **Shell and app stay separate.** Shell files are never edited in only one place; a difference from `app-shell` fails the check.
2. **One global, `G`.** The app hangs everything off `G.HFQ` (alias `H`); scenes register in `G.scenes`; each file is an IIFE.
3. **Content is data.** Units in `hfq_data.js`, lessons via `H.addLessons(unit, [...])`, books in `books/`. No behavior in content files.
4. **Every script is loaded exactly once, and every file on disk is loaded.** (This is how a forgotten `<script>` used to hide.)
5. **Canvas UI, one frame loop** (`engine.js`): update, draw, toasts, fade; input is cleared at the end of each frame.

## What the review found, and what changed

| Finding | Risk | Change |
|---|---|---|
| The frame loop had no error containment. A scene that threw drew a half frame and left input state stuck. | A single bug froze the game with no way out for a child. | `engine.js` now catches update/draw errors, logs them (`G.errors`, last 20), finishes the frame, and after 30 failing frames in a row returns to the home scene with a message. Global `error`/`unhandledrejection` are logged too. |
| `G.persist()` and `G.saveRoster()` swallowed write failures. | Full or blocked storage (private window) lost progress silently. | Both return true/false, set `G.storageOk`, and show one warning per session ("CAN'T SAVE ON THIS DEVICE"). |
| 100 `<script>` tags with no guard. New files could be forgotten; the shell and app could drift apart. | Silent breakage; broken framework separation. | `qa/structure_check.js`: every file loaded once, shell parity, naming rule, real lint errors. |
| Content lived in `cur/` plus three batch-named files, books beside code. | Hard to find and extend. | `js/content/lessons/` and `js/content/books/`; the loader shared by the checks is `qa/lib/content_loader.js`. |
| 103 requests (1.6 MB) to start. | Slow first load on a phone. | `tools/build.js` makes `dist/` with 2 bundles; the whole end-to-end suite passes against it. |
| Test commands were nine separate manual steps, with two servers to start by hand. | Easy to skip a suite. | `node qa/run_all.js [--fast] [--dist] [--jobs=N]` starts its own servers and runs everything. |
| Lint had never been run. | Dead code, hidden undefined names. | `qa/eslint.config.js`. There are 0 real errors. |
| Content quality: 13 lessons had all-true True/False; 8 questions were repeated across lessons; some false statements were explained "Yes." | Cheap to guess; repeated questions feel sloppy. | Fixed. `content_check` now rejects one-sided True/False lessons and a false statement explained with "Yes". |

Measured (headless Chromium, 390x800): ready in ~0.5 s locally; draw cost 0.5 to 1.6 ms per frame on every main scene (the Flight Path with 55 units is 0.8 ms thanks to culling); a save is about 1 KB, so storage is not a concern.

## Round 6.6 additions
- `hfq_terms.js`: Terms as data + the gate scene + the on-device acceptance receipt. The gate wraps `G.go` for `signup`/`login`; the shell is untouched except for the generic `CFG.settingsLinks` hook.
- `tools/hosting/`: nginx + logrotate for self-hosting with 90-day access logs (COPPA internal-operations scope), CSP and anti-framing headers, referer check on the bundles.

## Round 7.0: the shared services and the HTML layer

**Two presentations, one set of services.** Every activity (lesson, test-out, drill, checkride, flashcards, book, novel, game, place, crew member, tool, Explorer place) is a row in the activity registry (`hfq_registry.js`): stable id, title, category, airfield location, curriculum objective, prerequisites, assessment rules, `avail()`, `status()` and one `launch(back)`. The walkable airfield, the Flight Path, the Flight Bag and the Academy Hub all call the same scenes through it, so parity is a property of the construction, and `qa/hfq_r7_parity.js` checks it end to end (identical taps in both modes, identical saves).

**The HTML layer** (`hfq_ui.js`) is a `#ui` root over the canvas, hosted by ordinary canvas scenes (`UI.host(name, map)`): `G.go('hub')`, `G.go('library')`, `G.go('explorer')`, `G.go('record')`, `G.go('backup')` work like any scene (fades, Terms gate, back arguments). Inside the layer, views form a stack (`UI.show` / `UI.back`); launching a canvas activity suspends the stack and coming back resumes it at the same scroll position (rules 1–4 in the file header, tested in `hfq_r7_explorer.js` U1–U4). The engine ignores keys typed inside the layer (`G.uiOwns`). All text goes through `textContent`; inline emphasis from manuscripts becomes `<em>`/`<strong>` runs; nothing is parsed as HTML; no inline handlers, so the strict CSP holds.

**Mode** is a per-profile setting (`settings.hub`). `G.homeScene()` returns `hub` in Hub mode; `G.go('world' | 'dash')` is redirected to the Hub (a room argument becomes the place page). Switching never touches progress (parity P7).

**The verified record** (`mod.rec.log`) is written by wrapping the existing functions (`G.ach`, `H.gameDone`, `H.lib.markRead`, `H.testOut`) and by two explicit calls from the lesson and quiz scenes, never by re-implementing scoring. It records kind, activity id, result and the mode it happened in. It is an honest diary, not a certificate: no server, so no tamper proof, and the app says so.

**Content as data.** `tools/build.js` evaluates every content file in a vm with a recorder in place of the content API and ships the recorded calls as XOR-keyed base64 JSON decoded with `JSON.parse`; lazy content (the basemap, the seven novels) ships the same way, one file each, precached by the service worker. `qa/hfq_dist_parity.js` proves the bundle loads the same content as the source; `qa/hfq_r7_offline.js` proves it under the shipped CSP with the network off.

**Storage.** Saves stay in `localStorage` under the legacy `hfq_*` keys (migration safety). IndexedDB `hfq_device_v1` holds photos and restore points. Backups are JSON envelopes with a canonical-JSON SHA-256 digest and optional AES-GCM; imports are sanitized, previewed, applied all-or-nothing with rollback (`docs/BACKUP_FORMAT.md`).

**Rules enforced by `qa/structure_check.js`:** every script loaded once; every file on disk referenced (lazy content by path from a loaded file; series books listed in `content/series.js`); shell files byte-identical to `app-shell`; `hfq_*` naming; no lint errors. `qa/byline_guard.js`: no author name anywhere, by salted fingerprints.

## Round 7.4: learning, aircraft, helicopters, the crew

**One gate, three doors** (`hfq_gate.js`). ENROLL, SIGN IN and VISIT AS GUEST all pass the Terms gate in the HTML layer: the version (`hfq_terms.js`, 1.2), the time and a fingerprint of the text are recorded on the device for guests (`H.acceptGuestTerms`, `H.recordGuestPledge`, `H.guestTermsOk` in `hfq_terms.js`) and on each profile for accounts (`H.acceptTerms`); a changed version is asked again. The gate wraps `G.go` so there is no path around it.

**Notices in tiers** (`hfq_notify.js`). The shell's `G.toast` carries meta (`{kind, tier, ...}`); the rendition installs `G.drawNotices` (a ticker line for tier 1, a compact card for tier 2, a centred milestone card for tier 3 that waits for a calm moment: results, the airfield, the Hub) and `G.preUpdate` (the milestone card takes the tap that closes it). Everything also lands in the history (`mod.notes`) the Achievements page shows.

**Input mode** (`hfq_input.js`). `H.input.cur()` is `touch`, `mouse` or `keys` from what the cadet last did; the world's `stickHint` and `keyHints` hooks read it per frame, so the resting thumb-stick follows the finger and the E keycap follows the keyboard. Settings can pin the stick. In the shell, a tap is resolved front to back against what is drawn (`hitThing`, `footBox`, `inDoor`), and a station is in reach along its whole front (`reachOf`).

**Aircraft as scale profiles** (`hfq_profiles.js`, `_fleet.js`, `_hall.js`). Every aircraft is drawn in meters inside `{dims:{L, H, span|rotor}, draw(K)}`; `H.drawProfile` fits the profile into the 240 × 120 box and `H.profileExt(id, opt)` measures it (with or without the propeller disc) for `qa/hfq_ac_audit.js`, which compares the drawn extents to the published dimensions and the ID cards (`content/aircraft_cards.js`, `hfq_idcards.js`) to the drawing. Plane Spotter offers only reviewed aircraft.

**Clues from the lesson's own text** (`hfq_crewtalk.js`). `H.clue(q, level, here)` finds the briefing card that shares the most key words with the question and its answer (level 1: the card by number or title, never a title that names the answer), then a sentence of it that does not contain the answer's key words (level 2), then the answer and its why (level 3, `hfq_lessons.js`). The same module gives the crew their progress-first repeat lines (`H.crewLine`, state in `mod.crewtalk`) and the stuck card (`H.crewStuck`): idle time in a room, a ladder of three texts, drawn by the world scene, never during a talk.

**Learn for a retry** (`hfq_retry.js`, content in `content/retry.js`). `MG.offerRetry(sc, o)` is called by a game's finish once per game; the panel runs its own steps (offer, lesson, one question, result) with `MG.lrUpdate` / `MG.lrDraw` while the game is frozen behind it; a right answer calls the game's `onEarn`, which may only replace the weakest attempt. Seen questions are kept per game in `mod.retry`.

**Helicopters** are an ordinary unit (`content/lessons/heli.js`) with its own figure pack (`hfq_figs_heli.js`, registered through `G.FIG.add` and the `G.FIG.kit` helpers), a book (`books_2.js`) and ID cards; nothing in the engine knows the difference.

## Remaining debt, in order of value

1. **Multiple-choice answer-length cue.** `node qa/content_audit.js` shows the correct answer is the longest option in ~68% of questions (the original lessons are 55%), and ~260 distractors are throwaways ("A song", "Nobody"). Kids learn to pick the longest. Fixing it means rewriting distractors to be plausible and similar in length; it needs an author's eye, so it is a content pass, not a refactor.
2. **Fact check against FAA sources** for the 446 lessons added in round 6.4 (only structure is checked by machine). The r7.4 helicopter unit, book and ID cards had a second-pass review against their sources; the older units have not.
3. **Google Fonts** are fetched from `fonts.googleapis.com` (`theme.js`). That is the only third-party request, and it tells Google a child's device opened the app. Bundling the font (or using the system font) would make "data stays on the device" literally true. Changing fonts is a visual decision, so it is not done.
4. **Shell dead code.** About 40 unused variables sit in shell files (mostly unused `catch(e)` bindings). Left alone so the shell stays identical; clean them in the shell first, then copy.
5. **Timing-sensitive tests.** The thumb-stick and frame-timing checks can fail when many browsers run at once; `run_all.js` therefore defaults to 2 at a time and runs the two heavy suites alone (r7.4). The shared driver now waits for screens rather than fixed times where it can; the older suites still use fixed waits in places.
6. **Save versioning.** Saves are merged over defaults, which handles added fields; renamed or restructured fields would need a `v` number and a migration. Add that the first time a save field changes meaning.
7. **Lazy-load lessons by stage.** Not worth it yet: all content parses in well under the 0.5 s startup; revisit past ~1,000 lessons.
