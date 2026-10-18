# QA report: r7.4, learning that rewards, aircraft you can trust, helicopters, a crew that notices (2026-10-17)

"Tested" means a script ran in headless Chromium in this environment and its result is recorded. "Inspected" means a person (or this round's reviewer) looked and no script covers it. Nothing below is claimed tested on a real phone or tablet; see Outstanding.

## Inputs

`HypeTeen_Flight_Academy_Production_r7_3.zip` and an eleven-point brief: (1) learn-to-retry minigames with no exploits, (2) Plane Spotter drawing accuracy and verified ID cards, (3) the hangar USE → Crew Chief bug, (4) notifications in tiers, (5) full activation zones and keyboard / mouse / Escape, (6) a mandatory Terms gate for guests and sign-ins, (7) characters that give contextual hints and an escalating clue ladder without inventing facts, (8) the Library with the general books first and the seven-book series last, (9) an app-wide audit, (10) real-browser QA at desktop / tablet / phone sizes, (11) the package. Plus the author's wish for more helicopter knowledge.

## Pass 1: audit (what was wrong, how it was found)

| Finding | How found | Action |
|---|---|---|
| Hangar Tool Cart and Workbench opened the Crew Chief's talk | steered to each station with the thumb-stick and pressed USE in a script (`hfq_r74_smoke` H1) | their own close-ups (`hfq_inspect.js`); the chief talks only when he is in reach (H2) |
| Taps on stations hit a footprint, not the drawing: a crew member behind a table took the table's tap; doors answered only near the floor glow; parked aircraft only at their base | tapped every station's drawn box in every room from a script | `hitThing` resolves front to back against what is drawn; `reachOf` counts a station in reach along its whole front (`mod_world.js`, shell v1.4.5; `hfq_r74_smoke` Z1–Z4) |
| VISIT AS GUEST bypassed the Terms; SIGN IN on another device never asked | read `hfq_gate`/`accounts` flows; scripted a fresh device | one gate for guests, enrollment and sign-in, version-stamped, re-asked on change (`hfq_gate.js`, Terms 1.2; `hfq_arch_smoke` T1–T16) |
| Every reward was a toast of the same weight, and toasts covered questions | scripted a lesson while earning XP; read `engine.js` | three tiers (`hfq_notify.js`), nothing over a question or a round; history on Achievements (`hfq_r74_smoke` N1–N3) |
| The thumb-stick showed or hid by screen width, not by input; no E key; Escape did not close talks | keyboard and mouse scripts at desktop size | input mode (`hfq_input.js`), `KeyE` → `use` in the shell, Escape closes (`hfq_r74_smoke` C1–C5, W7) |
| Wrong aircraft figures in four books | opened every book figure in the fig gallery | each book shows its own aircraft (`ac` figure) |
| Rotorcraft masts and tail rotors too high or too far back (UH-60 mast 1.24 m high) | `qa/hfq_ac_audit.js` against FAA AC 150/5390-2B | corrected profiles; audit passes with one documented note (T-6) |
| The welcome painting's plate met the backdrop in a hard line on tall phones; empty bands in the Locker and close-ups; radio questions under their answers | the visual sweep at 390×844 and 360×640 | plate fades (`accounts.js`), layouts measure their text |
| Pictures inside HTML pages took the game canvas's desktop frame | the sweep at 1440×900 | `#ui canvas` reset (`htfa.css`) |
| SUGGEST ONE could repeat the call sign in the box | e2e A2 flaked on it | never repeats the current one (`hfq_cadet.js`) |
| The Library, Explorer, Spotter's Guide or Settings opened after a Hub visit showed the Hub's home (since r7.0) | the visual sweep (phone, tablet and desktop screenshots of every screen) | a host resumes its stack only for an activity returning to it (`hfq_ui.js`; `hfq_r74_smoke` B4–B5) |
| A ticker could cover the Terms gate's first sentence on a tablet; a locked ID card on a wide screen sat in a daytime frame | the visual sweep | no tickers or cards on the gate (`hfq_notify.js`); the locked frame matches the silhouette (`htfa.css`) |

## Pass 2: content (what was written, what was checked)

| Content | Source | Check |
|---|---|---|
| HELICOPTERS unit: 12 lessons, 79 challenges (`lessons/heli.js`) | FAA Helicopter Flying Handbook FAA-H-8083-21B ch. 2–4, 7, 11; AC 91-32B; 14 CFR 61.83 / 61.103 / 61.109(c) / 61.129(c); history against encyclopedia entries and their cited sources | `content_check` rules (card length, question mix, tap zones); a second-pass review that opened the sources found 2 errors and 7 loose statements, all corrected (`KNOWN_ISSUES.md` item 20) |
| "How Helicopters Fly" rewritten (10 chapters, 8 quiz questions) | the same | the same review; quiz keys verified |
| 62 aircraft ID cards (`content/aircraft_cards.js`) | manufacturer and museum pages named per card | `hfq_ac_audit` A4–A5: card numbers equal the drawing's within 3%, every card names its sources |
| 32 learn-for-a-retry lessons (`content/retry.js`) | PHAK / AFH / AIM passages named in the file | `content_check`; played in `hfq_games_smoke` and `hfq_r74_smoke` |
| Close-ups: Tool Cart, Workbench, Fuel Truck (`content/inspect.js`) | PHAK ch. 7 (fuel grades, contamination, static); AMT Handbook General ch. 9–10, 12; 14 CFR 91.409(a), 43.9, 23.1557(c), 65 Subpart D; AC 43.13-1B ch. 7–8 (named in the file) | played in `hfq_r74_smoke` H1 |
| Crew progress lines, stuck-card text (`hfq_crewtalk.js`) | academy records only; no aviation facts beyond the checked lines | `hfq_r74_smoke` W1–W6 |

## Pass 3: implementation and regression

`node qa/run_all.js --dist` (log: `docs/QA_RUN_ALL_r7.4.log`): structure OK, content OK (56 units, 512 lessons, 3,079 challenges), byline OK; build v7.4.0 (`mvcuz3fl-e13k4h`, 93 files precached); arch 28/28, smoke 38/38, games 52/52, r4 54/54, r5 38/38, r6 88/88, e2e 100/100, r7 parity 41/41, r7 backup 28/28, r7 explorer 36/36, r7.4 aircraft 6/6, r7.4 round 52/52; on the built bundle: offline 13/13, parity 41/41, e2e 100/100, arch 28/28, dist parity 3/3. **The 512-lesson flight crashed once inside this run (at 706 s, no FAIL line) and passed 32/32 when rerun alone on the same build** (the log carries both); it also passed inside the previous full run. It is an intermittent harness failure, not a reproduced app defect, and is listed in `KNOWN_ISSUES.md`.

Suites changed for r7.4 (each change is a behaviour the round introduced on purpose, not a loosened check): the shared driver and the e2e / lessons suites tap a milestone card away before the next tap, as a cadet does; the e2e cadet declines the darts retry offer; the r6 placement result closes its milestone card before BACK; the r4 Hall count is 45; the smoke runway pixel check skips the first briefing (tap-to-walk now counts as walking, so the briefing had legitimately reached its TOWER step and dimmed the screen).

## Pass 4: the visual sweep

`node qa/hfq_r74_sweep.js` took 42 screens × 3 sizes (phone 390×844 with touch, tablet 820×1180 with touch, desktop 1440×900 with a mouse): boot, title, the Terms gate, all nine rooms, the map, the Hub, the Flight Path, Ground School, the helicopter route, a briefing card, a picture question, a clue after a miss, a drill, flashcards, the Practice Hub, the Library, a book page, the series, the Flight Record, the Explorer, the games list, three games, My Hangar, the Spotter's Guide, an ID card, a close-up, the radio, the Logbook, the Locker, the Crew Board, Settings and the stuck card. All 126 were reviewed by eye on contact sheets (no page errors, no step landing on the gate); the shipped set is `qa/shots/r7_4/*.webp`. Found and fixed from the sweep: the Library / Explorer / Spotter's Guide / Settings showing the Hub's home after a Hub visit, a ticker over the gate's first sentence on the tablet, and the locked ID card's frame on the desktop. Second sweep after the fixes: clean. Not covered by the sweep: real device rendering (fonts, safe areas, scroll physics), which needs a phone in hand.

## Outstanding (not done, not claimed)

1. No real iOS Safari or Android Chrome device was available; everything above ran in headless Chromium with touch, mouse and keyboard emulation.
2. The Terms (1.2) need counsel, including whether the guest gate's adult acceptance meets parental-consent rules where the app is offered.
3. The T-6 Texan drawing is 13% under its published height, which does not say what it is measured to; flagged, not altered. A few rotorcraft figures could not be confirmed to the inch from a primary page (`KNOWN_ISSUES.md` item 15).
4. The clue chooser is machine-made from the lesson text; an author's per-question pass would improve a few second clues.
5. The content audit's answer-length cue (67.3% of multiple-choice answers are the longest option) is unchanged in the older units.
