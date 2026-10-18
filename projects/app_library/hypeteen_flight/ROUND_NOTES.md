# Round notes

## Round 7.4.1: the launch cut (2026-10-17)

Four changes asked for before going live, on top of r7.4. Version 7.4.1, Terms version 1.3.
- **No welcome page.** The loading plate shows only while assets load; the title screen is the first thing seen (`hfq_start.js` starts the engine the moment it is ready; the audio engine is woken by the first real tap or key, since browsers allow sound only after one). The welcome page's two-line caution (call signs and PINs; parents enroll first) now sits on the title screen, above ENROLL on tall phones, under SETTINGS on short ones.
- **New emblem** (the supplied artwork) app-wide: the title, the loading plate, the Hub's cadet card, the browser icon, the home-screen icons (192, 512, maskable, Apple touch). `assets/brand/htfa_emblem.webp`; the old insignia SVGs are kept but unused.
- **The Terms come first.** On a device with no current acceptance, the title itself opens the adult's gate before ENROLL or VISIT AS GUEST can be tapped; NOT NOW returns to the title, where the buttons ask again. The first profile enrolled after that acceptance (the Family Lead) is not asked the Cadet Pledge; later cadets and guests still are.
- **Terms 1.3:** an accuracy notice at the very top of the gate, the pledge screen and the full text ("independently gathered… validation of lesson accuracy is pending… no guarantees or assurances are made"), as its own section 1a; every contact line is now dustin@dbmb.io (website dbmb.io); the legal-entity and address placeholders are gone. A changed version means every device is asked again.
- **The byline guard** allows that one address by the author's instruction (`qa/byline_guard.js`); any other appearance of the name still fails the build.
- **Tests:** arch 29/29 (the gate checks rewritten for the gate-first flow), r7.4 round 52/52, smoke 38/38, structure, content and byline OK. The other suites were updated for the new boot (no START button; the title gate accepted as an adult would) but were not rerun for this cut, to keep it quick; run `node qa/run_all.js --dist` before the next release.

## Round 7.4: learning that rewards, aircraft you can trust, helicopters, a crew that notices (2026-10-17)

Built from an eleven-point brief. Every item below was played in headless Chromium at phone (390×844, 360×640), tablet (820×1180) and desktop (1440×900) sizes with touch, mouse and keyboard; where something was only inspected, it says so. Version 7.4.0, App Shell v1.4.5.

**Fixed**
- **Hangar: USE on a tool opened the Crew Chief.** The Tool Cart and Workbench stations were wired to the chief's talk. They now open their own close-ups (the cart's tools, the bench's parts, and the Fuel Truck at the Parking Stand: `hfq_inspect.js`, content in `js/content/inspect.js`), each with a short quick check. The chief talks only when he is the one in reach.
- **Tap targets matched only part of what is drawn.** A tap is now resolved against everything it touches, front to back: a person standing behind a table never takes a tap meant for the table, a door answers across its whole opening, a parked aircraft from wingtip to wingtip. A station counts as in reach anywhere along its front, not only at its centre. (Shell: `mod_world.js`, copied byte for byte to `app-shell/`.)
- **Guests skipped the Terms.** VISIT AS GUEST now passes the same gate as ENROLL and SIGN IN (`hfq_gate.js`): the Terms and the privacy summary in an accessible HTML screen, unticked boxes, ACCEPT enabled only after the text has been scrolled to its end. Acceptance records the version, the time and a fingerprint of the text, on the device (guests) and on each profile (accounts); a changed version is asked again. Terms version 1.2. Accepting the Terms is not treated as verified parental consent; the Terms and `docs/KNOWN_ISSUES.md` say so.
- **The welcome painting met the backdrop in a hard line** on tall phones (the plate's flat pad). The canvas plate now stops just past the picture and fades into the backdrop; the boot screen does the same. (Shell: `accounts.js`.)
- **Locker, close-ups and radio questions** no longer leave empty bands or overlap on tall or short phones: the locker preview grows with the screen, the close-up card measures its text, and a long radio question can wrap to three lines without sitting under its answers.
- **A frame drawn around pictures inside pages on wide screens** (the game canvas's desktop frame applied to every canvas). Pictures inside HTML pages are now plain.
- **Wrong figures:** the "How Helicopters Fly" book showed an airplane; "Lighter Than Air" showed an airplane; "Gliders and Soaring" and "Inside an Airliner" showed a small trainer; "The First Flight" a generic airplane. Each now shows its own aircraft.
- **SUGGEST ONE** could suggest the call sign already in the box; it never does now.
- **The Library (or the Explorer, the Spotter's Guide, Settings) opened after a visit to the Academy Hub showed the Hub's home instead** (found by the visual sweep; present since r7.0). An HTML host resumed whatever stack was left behind by any host; it now resumes only when an activity comes back to the host it was launched from (`hfq_ui.js`; `hfq_r74_smoke` B4–B5).
- **A quiet notice ("READY TO FLY OFFLINE") could sit on the Terms gate's first sentence** on a tablet; tickers and cards no longer show on the gate. **A locked ID card on a wide screen** showed its night silhouette inside a daytime frame; the frame now matches.

**Learning that rewards, never punishes**
- **Learn for a retry.** When the throws, landings, bags or darts are used up, Paper Plane Toss, the Landing Challenge, Bag Toss and Compass Darts offer one more try: a short lesson about what just happened (a stall, a tailwind, the PAPI lights, the wind, a compass heading…) and one question. A right answer earns one bonus attempt that can only replace the weakest one, so scores stay comparable. A wrong answer explains why and keeps the score. One offer per game, a question is spent the moment it is shown, and none repeats until the whole set has been seen (`hfq_retry.js`; 32 lessons in `js/content/retry.js`, sources listed in the file).
- **The instructor's clue ladder** in every lesson and HANGAR FLYING review (`hfq_crewtalk.js`, `hfq_lessons.js`): the first miss points to the briefing card that holds the answer, the second gives a closer clue from that card (chosen so it does not contain the answer), the third shows the answer and its why. SHOW ME skips to it whenever a cadet wants. True/false (two choices) goes straight to the explanation, and checkrides stay a test (the answer, no clue). A HINT button offers the first two clues before answering, and nudges after a long pause. Clues are built only from the lesson's own checked text.
- **Quizzes point to where it is taught:** after a miss, a drill, trivia or book quiz names the briefing card or book chapter to review (`hfq_quiz.js`).

**Plane Spotter: aircraft you can trust**
- **Every aircraft redrawn from its real dimensions** (62 profiles, in meters: `hfq_profiles.js` kit, `hfq_profiles_fleet.js`, `hfq_profiles_hall.js`): the length, span or rotor, height, attitude on the ground and wheel positions come from published data, so a landing gear can no longer be too long or a tail too low. `qa/hfq_ac_audit.js` checks every drawing against its published length and height and every ID card against the drawing; one aircraft (the T-6 Texan) is flagged for expert review rather than altered, because its published height does not say what it is measured to.
- **Rotorcraft checked against the FAA heliport design table** (AC 150/5390-2B): the UH-60, UH-1, S-64, H125, Bell 206, Bell 47 and R22 had masts or tail rotors too high or too far back; corrected.
- **ID cards** (`hfq_idcards.js`, 62 cards with their sources in `js/content/aircraft_cards.js`). After each answer, an ID card: maker, first flight, kind, role, what to look for, a verified fact, the story, and how to tell it from look-alikes; MORE turns to a second page. Cards collect stars (spotted 1, 3, 5 times). The SPOTTER'S GUIDE (from the hangar's gallery) shows every card; the hangar's ID CARD button opens the card for the aircraft on show. Only aircraft whose drawing passed review are shown or offered as answers.
- **Eight new rotorcraft** in the Hall of Flight (45 now): Bell 47, Bell UH-1 "Huey", Airbus H125 Écureuil, Boeing CH-47 Chinook, Kamov Ka-32, MD 520N (NOTAR), Bell Boeing V-22 Osprey, Sikorsky S-64 Skycrane. Hall facts were corrected where the review found them wrong (years, wording).

**Helicopters**
- **New Ground School unit: HELICOPTERS** (Beyond, unit 50 of 56, open from day one): 12 lessons, 79 challenges (the parts, how a rotor lifts, cyclic, collective and pedals, torque and the tail rotor, NOTAR / Fenestron / tandem / coaxial, hovering and ground effect, translational lift, advancing and retreating blades, autorotation, safety around helicopters, history, careers). Practiced in Plane Spotter. Sources: FAA Helicopter Flying Handbook (FAA-H-8083-21B), FAA AC 91-32B, 14 CFR 61. A second pass that opened the sources found two errors and seven loose statements; all were corrected (the list is in `docs/KNOWN_ISSUES.md`, item 20).
- **Eleven new diagrams** (`hfq_figs_heli.js`), each tappable for the picture questions, plus an `ac` figure that puts any aircraft profile in a lesson or book.
- **"How Helicopters Fly"** now goes with the new unit: ten illustrated chapters, with ground effect and translational lift, a safety chapter and a word list added, and loose statements tightened.
- A helicopter icon for the unit's patch (shell: `icons.js`).

**The crew notices**
- Each crew member's repeat visits lead with what matters to YOU (a checkride you are ready for, a lesson that keeps going wrong, the next lesson, a milestone, aircraft spotted, today's runway and ATIS), then their own lines in order, never repeating until all have been heard (`hfq_crewtalk.js`). First meetings are unchanged. Progress lines talk about the academy only; aviation facts stay in the crew's checked lines.
- **Nobody stays stuck:** a cadet who has not opened, talked to or walked anywhere new for a while gets a small card from the crew member in the room (never a pop-up, never during a talk): first a gentle clue, then a station to try with a direction, then the MAP and the Flight Path.

**Controls, notices, Library**
- **Controls follow the input actually used** (`hfq_input.js`): a finger shows the thumb-stick, a mouse or a movement key hides it (not screen width), Settings can pin it; W A S D and the arrow keys walk, E uses, Escape closes; the USE button carries an E keycap for keyboards. The first briefing counts any way of walking.
- **Notices in three tiers** (`hfq_notify.js`): routine XP and first-day badges share one quiet ticker line; real badges, aircraft and patches get a compact card; milestones (a new phase, a stage graduation) wait for a calm moment and take the tap that closes them. Nothing covers a question or a game round. The history is kept on the Achievements page.
- **The Library** lists the ground school books first (from how flight works to history), then quizzes and practice, and the seven-book series last, with a link at the top that jumps to it. Titles, order within each shelf and covers are unchanged (`hfq_reader.js`).

**Tests:** `qa/hfq_r74_smoke.js` (52 checks, phone / tablet / desktop: the hangar close-ups, activation zones, controls, notices, learn-for-a-retry, ID cards, the helicopter unit, the clue ladder, the crew, the Library) and `qa/hfq_ac_audit.js` (6) are new; `run_all` lists them and runs the two heavy suites (the e2e day, the 512-lesson flight) alone so the timing-sensitive checks beside them are not starved. The older suites were updated where r7.4 changed behaviour on purpose: the drivers tap a milestone card away before the next tap (as a cadet does), the e2e cadet declines the darts retry offer, the Hall count is 45, and the smoke test skips the first briefing before its runway pixel check (walking by tap now counts as walking). `node qa/run_all.js --dist`: all green (`docs/QA_RUN_ALL_r7.4.log`, `docs/QA_REPORT_r7.4.md`).

**Not done, said plainly:** no real iOS or Android device; the Terms still need counsel; the content audit's answer-length cue is unchanged in the older units; the clue chooser is machine-made (`docs/KNOWN_ISSUES.md`).

## Round 7.3: the raw downloads, and the art checked in context (2026-10-17)

The illustrator's three raw-download ZIPs (33 files) were triaged file by file (`docs/ART_ACCEPTANCE.md`): 22 are the full-size originals of files already delivered, 11 are extra generations; none is an original of the 22 preview-based files. Used: five extra badge arts (book, laurel, airliner, biplane, four-engine jet; the 33 badges now share fifteen arts, `BADGE_ART` in `hfq_logbook.js`), the dusk apron panorama as the runway horizon (stitched from its two clean sides so its aircraft is left out), and the full-size FBO original (its trainer's military roundel and extra tail wheel removed). Rejected: lettered emblems, a badge with a propeller in the middle of its fuselage. Every room was then rendered whole with the app's stations over it; painted doors, boards, shelves and cases that showed beside the app's own were painted out (lounge, classroom, game room), the game-room carpet's white cross-hatch and the wash pad's repeating blotches were calmed, and a fighter with code letters came out of the classroom tile's window. Version 7.3.0.

## Round 7.2: the commissioned artwork lands (2026-10-17)

The illustrator returned 44 of the 46 assets from `docs/ART_GENERATION_BRIEF.pdf`. `tools/integrate_art.py` keyed, cut, repaired and resized them into `web/assets/art/` and `docs/ART_ACCEPTANCE.md` records every decision (32 accepted, 10 fixed, 1 derived, 1 replaced, 2 rejected). New in the app: painted floors in seven rooms (`room:<id>:floor`, laid into the floor plane; the hangar's lead-in line is drawn by code over the plate), the title painting with the name typeset over its sky (`accounts.js`, mirrored to the shell) and the welcome page restructured the same way (`index.html`), five new Hub tiles, eleven discs and ten badges from the delivery. Known: 22 of the delivered files are preview upscales; `docs/ART_ROUND2_CORRECTIONS.pdf` asks for the originals. Version 7.2.0.

## Round 6.3.1: the handoff build

**The complete handoff package:** the app, the shell, every test, every asset rendered to files (art as PNG, sound as WAV, every screen), and the written handoff (summary, outline, next steps, production checklist, asset guide, rules, testing, history) as Markdown and one PDF. The playable build is republished to the same artifact.

**Fixed while exporting the assets:**
- Crew portraits are framed on the face: the head and shoulders fill the circle, so no portrait cuts off the top of the head (the Crew Board, the cadet cards, the dialog). (App Shell v1.4.4.)
- The AIRFIELD EXPLORER badge says ALL NINE PLACES (it has needed all nine since the Game Room opened; the text still said eight).

**Tuned:**
- Each unit names its own practice game (`practice` in `hfq_data.js`), so the PRACTICE node and the route's pill drill the unit with the game that teaches it best: Gauge Reader for Cockpit Instruments (not Wash Day), Phonetic Pairs for the radio (not Pool), Weather Call for Weather (not Bag Toss), Taxi Maze for Airports. Units without a pick fall back to the first game that lists them.
- The app asks the browser for persistent storage, so Safari is less likely to evict a family's progress after a week away.
- Every save carries a version stamp (`mod.v`), ready for migrations.
- A last-resort error guard: if something unexpected breaks, one line says so instead of a silent freeze; the frame loop keeps running.

**Added:**
- Outdoor places take a painted sky: `room:platform:wall`, `room:ramp:wall` and `room:runway:wall` now work like the indoor walls (App Shell v1.4.4). Every piece of art in the game now has a painted-art slot.
- `H.drawBadge(c, x, y, r, id, earned)` draws any badge medal (the logbook and the asset export use it).
- The game files' header comments name the places the games live in now (the Game Room, the Parking Stand).
- The README's games table, badge list (30), XP table and safety notes are brought up to date.

**Tested:** every suite passes (content OK; `hfq_e2e` 100/100, `hfq_r6_smoke` 88/88 with new checks for the painted sky and the unit practice games, `hfq_smoke` 38/38, `hfq_lessons_smoke` 32/32, `hfq_games_smoke` 52/52, `hfq_r4_smoke` 54/54, `hfq_r5_smoke` 38/38, shell 23/23).

## Round 6.3: the fine tune (a real logbook, and formatting app-wide)

**Playable build:** republished to the same claude.ai artifact (same link). Still device-only.

**The Flight Log is a real logbook now: flights and sim are kept apart.**
- It opens on two books, **FLIGHTS** and **SIM SESSIONS**, the way a pilot's logbook keeps simulator time in its own column. Sim time is never added to flight time.
- Each book has its own ruled page totals. FLIGHTS: flights, training time, landings, airports, aircraft, with ALL / PASSENGER / TRAINING filters. SIM SESSIONS: sessions, sim time, landings, lessons, checkrides.
- Entries are ledger rows: the date, the route (or the session), a role chip (PASSENGER, STUDENT PILOT, DISCOVERY FLIGHT, OBSERVER, SIM), time and landings. Passenger rows show a dash where time and landings don't apply.
- A sim session's sheet says where it was flown (the academy trainer) and that it doesn't count as flight time. Sims can't be removed (they're a record of practice); real flights still can. The SIM SESSIONS book's button is FLY A LESSON.

**My Logbook, rebuilt.** The pilot card, then the two books as separate tiles (FLIGHTS / SIM SESSIONS), My Aircraft, the Hall of Flight, Ground School (patches + three stat tiles), the academy phases, then compact grids: badges as medals (tap one for what it is and when you earned it), places visited and crew met (tap to go there). It's about a third as long to scroll.

**Formatting, app-wide.**
- Text never gets squashed. Text too wide for its space now shrinks a little first (down to 80%) before narrowing. Top-bar titles that don't fit centered move into the free space beside BACK. Flight Bag subtitles wrap to two lines when needed. (App Shell v1.4.3.)
- Panels and sheets size themselves to what they hold: quiz feedback, deck complete, game results, flight log sheets, the Flight Path sheets.
- On a tall phone, quiz and lesson questions sit closer to their answers instead of floating at the top.
- Quiz titles are short (DRILL, TEST OUT, BOOK QUIZ, FLASHCARDS), and the unit or book moves to the subtitle.
- Answer choices share one label size per question (lessons, quizzes, the radio, Cloud Spotter, Light Gun, Plane Spotter), the largest at which every choice fits, so a set never mixes big and small text.
- Labels and name tags never crowd each other, the USE prompt or the screen edge.
- Locker swatches line up under their labels. The Library rows end with the same › as every other list. The Crew Board is named CREW BOARD with ACTIVITY / CADETS tabs, and every cadet row shows their aircraft.
- Plurals and copy fixed throughout (1 CADET, 1 MISSED QUESTION, 1 PATCH, "an 8-question quiz"). The About page was rewritten in a clear order (How to Play first, For Families last).

**Behaves like a finished learning game.**
- Leaving a quiz, drill or test-out partway asks first, like the lessons do, and the clock pauses while it asks.
- The GAMES list puts THE GAME ROOM first, where the fun games really are.
- When the daily game XP limit is reached, the results say so (LESSONS STILL EARN XP), and no line promises XP that wasn't given.
- The Flight Path opens on your next step with its unit banner in view.

**Tested:**
- Every suite passes (content OK; `hfq_e2e` 100/100, `hfq_r6_smoke` 86/86, `hfq_smoke` 38/38, `hfq_lessons_smoke` 32/32, `hfq_games_smoke` 52/52, `hfq_r4_smoke` 54/54, `hfq_r5_smoke` 38/38, shell 23/23). `hfq_r6_smoke` adds checks for the two books, the sim sheet, opening a book or filter, the logbook grids, shrink-to-fit text, the daily XP message and the Game Room list.
- Every screen was shot at 390×800 and 360×640 and reviewed.

## Round 6.2: one-word call signs, Among Us walking, a first briefing, and the whole loop played end to end

**Playable build:** republished to the same claude.ai artifact (same link). Still device-only.

- **Call signs are one word**, like real ones. GIVE ME A FUN ONE picks from 107 (AFTERBURNER, PICKLE, WINGNUT, TACO, WHIRLYBIRD…), never one another cadet on the device already has. The hint: ONE WORD, LIKE A REAL CALL SIGN. MAKE IT UP, NOT YOUR REAL NAME. Older two-word call signs keep working.
- **Walking, Among Us style (App Shell v1.4.2):** drag anywhere on the floor, or on the resting stick bottom-left, and a thumb-stick follows your thumb. The cadet walks the way you push and slides along desks and walls instead of sticking. The round **USE** button bottom-right lights up when a person or a station is in reach: the thing glows, and a small prompt over it says what it is. A short tap still walks to a spot or opens what you tap. All 69 stations and people in the nine places were reached with the stick in testing.
- **The map is a pop-up:** the round MAP button top-right opens the whole airfield over the room you're in (tap a place, tap again or GO THERE; ✕ or a tap outside closes it). The round TOWER button under it calls the tower from anywhere. The bar is now PATH, LOUNGE, CLASS, HANGAR, FLIGHT BAG.
- **The first briefing, at launch:** the first time a new cadet lands in the Classroom, the instructor runs eight spotlighted steps: walk with the stick → walk over and tap USE → open the MAP → the TOWER button → the FLIGHT BAG → the PATH tab → tap the glowing node → START. The briefing ends as their first lesson begins for real. SKIP works at any step; the TUTORIAL card in the Flight Bag replays it; finishing earns the FIRST BRIEFING badge and 20 XP.
- **Flight Path sheets say what's inside** (briefing cards, challenges, minutes, XP and stars, YOU'LL LEARN for lessons; chapters and quiz length for books; question counts and pass marks for test-outs, drills and checkrides), and each sheet sizes itself to what it holds. The Path opens on the glowing node (your next step); once a unit is SILVER its books, game and drill stay open for GOLD, but the glow moves on to the next unit. Back from a lesson or a book, the Path stays where you were instead of jumping to the top.

**Found by playing it end to end, and fixed:**

- A lesson question missed in a drill, a trivia round or a test-out now goes to HANGAR FLYING too, and clears when answered right later, so every mistake has one place to practice it. HANGAR FLYING with nothing to review says so instead of opening an empty flight.
- Quiz results fit their content and list up to three misses with the right answer (WORTH ANOTHER LOOK). The games' results panels fit too.
- Flashcards keep the question in small print on the answer side, so short answers read in context.
- Station labels and name tags hanging off the screen edge slide back on; a label that would crowd the prompt over a person hides until you walk on; while USE is lit, the briefing's hint moves to it (TAP USE).
- Copy: "an 8-question quiz", "1 PATCH", "spotted an AIRBUS A320"; the About page no longer says every book has a 6-question quiz; reading a book shows its XP once, not twice; games no longer show "THROW 9 OF 8" or TAP TO CONTINUE behind the results.

**Tested:**

- **New `qa/hfq_e2e.js` (100 checks):** one brand-new cadet plays the whole loop, every move a real touch (taps, and the stick through touch events): enroll with a fun call sign → placement (I'M NEW) → the full briefing → Lesson 1 (3 stars) → Lesson 2 with a go-around (2 stars) → TEST OUT (BRONZE) → a perfect DRILL → the CHECKRIDE (SILVER) → the unit's three books read cover to cover and their quizzes aced (GOLD) → trivia, flashcards (with a STUDY AGAIN round), HANGAR FLYING → the MAP to the Game Room, walk to Compass Darts with the stick, USE, eight throws to the results → the TOWER button and the ATIS → the Classroom bookshelf → a book from another shelf and its quiz → a Flight Log entry → reload and sign in: XP, tiers, books, quizzes, the log and the badges all kept, and the briefing does not start again. No page errors.
- `hfq_r6_smoke`: 79/79 (adds the call signs, the stick, USE, sliding, the bar and buttons, every briefing step, misses from drills reaching Hangar Flying, the Path keeping its place and opening on the glowing node, the sheets fitting, the empty Hangar Flying message). `content_check`: OK. `hfq_smoke`: 38/38. `hfq_lessons_smoke`: 32/32. `hfq_games_smoke`: 52/52. `hfq_r4_smoke`: 54/54. `hfq_r5_smoke`: 38/38. Shell: 23/23.

**It runs as an educational game, start to finish:** a cadet is taught (lessons with briefings, books), checked (challenges, quizzes, drills, checkrides), corrected (the why after every answer, go-arounds, Hangar Flying), and rewarded (stars, tiers, patches, badges, XP), with the fun games one map tap away.

## Round 6.1: the Library scales (32 books, chapters), and painted-art slots

- **Both, as asked:** the first 24 books each grew by two chapters and two quiz questions (8 chapters, 8 questions, 7 to pass), and a seventh shelf, AIRCRAFT OF EVERY KIND, arrived with four books (How Helicopters Fly, Gliders and Soaring, Inside an Airliner, Lighter Than Air), plus four more on the old shelves (Flying at Night, Winds Aloft and the Jet Stream, Air Traffic Control, Glass Cockpits and Autopilots). 32 books, about 14,200 words, 240 quiz questions. Facts checked against the FAA handbooks (Helicopter, Glider, Balloon, Airplane Flying), the AIM, 14 CFR 61/91 and the dates named in the text.
- **Scalable:** books are data that any file can add (`H.addShelves`, `H.addBooks`, `H.extendBook`), quizzes can be any length (pass = 5 of 6, 7 of 8, 10 of 12), and a shelf can be `kind:'story'` for your literature: chapters, a byline, no quiz required. The README has the recipe.
- **The reader is chaptered:** one section a page with BACK / CONTENTS / NEXT, page dots, a contents sheet with checkmarks, and the page remembered per cadet (the shelf row says CONTINUE • PAGE 4). The last page marks the book read (+10 XP, +15 for 8+ chapters) and offers the quiz.
- **Painted-art slots (App Shell v1.4, `js/art.js`):** a manifest of images (`web/assets/art/manifest.json`) can replace any code art by key: whole walls and floors (floors are drawn in the diorama's floor plane, so they recede), props (by art name, or one station in one room), wall art, people, aircraft side views and book covers. Anything missing falls back to the code art, so your illustrator can paint one thing at a time; the README lists the keys. The manifest ships empty.
- **Tested:** `hfq_r6_smoke` is now 55/55 (chapters, resume, 32 books, scaling with a test story shelf, the art slots drawing an image); the other suites are unchanged and green.

## Round 6: the academy's spine (Flight Path, Library, Practice Hub), the Game Room, and the 3/4 dioramas

**Playable build:** republished to the same claude.ai artifact (same link). Still device-only.

**The logic, end to end (your "Duolingo of flight training"):**

- **THE FLIGHT PATH** (new PATH tab, first on the bar; also a Flight Bag card): the whole course as one winding path through the 13 units. Each unit is a stage of nodes: TEST OUT (10 questions, 80% skips the lessons), the LESSONS (the escorted side: briefing, takeoff, challenges, landing, unchanged), READ (the unit's Library book, then its quiz), PRACTICE (the clubhouse game that drills the unit), DRILL (10 questions, 8 seconds each) and the CHECKRIDE. Units unlock in order; the next opens at Bronze. Tap a node for a sheet with details and a start button; tap a stage banner for the unit page.
- **Mastery tiers per unit:** BRONZE = every lesson done (or tested out). SILVER = the checkride (the patch). GOLD = a perfect drill AND every book quiz for the unit passed. Medals show on the Path banners and the Ground School board; the board now locks units in order too (with a hint to test out).
- **Placement check** right after enrolling: "Have you studied flying before?" Start at the beginning, or take a 12-question check (3 from each of the first four units); 2 of 3 right tests you out of that unit. Nothing is ever locked for good: every unit still offers TEST OUT later.
- **THE LIBRARY** (the bookshelf in the Classroom, a Flight Bag card, and the READ nodes): 24 readable books on six shelves (How Flight Works, The Airplane, The Airport, Weather, The Sky + the Radio, History + Careers), about 7,900 words of real ground school written for 10–14, with the Ground School figures inline (forces, wing, axes, six-pack, runway, signs, lights, pattern, windsock, clouds, fronts, airspace, sectional, compass, CG, IMSAFE…). Reading to the end earns 10 XP; each book has a 6-question quiz (5 to pass, +15 XP; a perfect 6, +10 more). Badges PAGE ONE, BOOKWORM (8 quizzes), LIBRARIAN (all 24).
- **THE PRACTICE HUB** ("affirm my knowledge", from the Path's bottom bar and the Flight Bag): FLASHCARDS for every open unit (question on the front, the answer and the why on the back; GOT IT / STUDY AGAIN, rounds until every card is known; +5 XP a deck), FLIGHT TRIVIA (10 mixed questions from every unit you have opened, lessons and books alike, 10 seconds each, streak bonuses, a best score; +10 XP the first round each day, +5 for a perfect round), DRILLS per unit (for Gold), HANGAR FLYING (missed questions) and the Library.
- **The quiz engine** (`hfq_quiz.js`): one fast scene for test-outs, drills, trivia, book quizzes and the placement check: a clock when wanted, streaks, points, the why after every answer, a results panel with XP lines, TRY AGAIN with a fresh draw. It normalizes the lessons' multiple-choice, true/false and fill-in challenges (the figure challenges stay in the lessons) and the books' quizzes into one pool per unit.
- **Unit pages** (the classroom route) now offer TEST OUT (before Bronze) or DRILL (after) beside the practice game.
- The Crew Board tells the new story: tested out of a unit, read a book, aced a quiz, drilled a unit perfectly. New badges: ALREADY KNEW IT, GOLD WINGS, GROUND SCHOOL MASTER, TRIVIA NIGHT REGULAR.

**The places:**

- **3/4 dioramas (App Shell v1.4, in `app-shell/` and copied in):** every place is now projected as a cut-away diorama: the floor is sheared and compressed (`G.V`, per-room `proj:{sh,kd}`), the back wall stands upright, the right wall shows its inside with a baseboard and the doors cut into it, the left wall is seen edge-on as a cut edge, and the whole room floats on a slab with a drop shadow over a dark backdrop. Outdoor places (the platform, the parking stand, the runway) have no walls: the ground and sky run past the edges. The runway, taxiway and apron markings are drawn on the floor plane, so they recede like the real thing. Props are real volumes: `G.V.box/top/front/side/cyl` with lit faces, `G.V.shadow` cast shadows, and `G.V.plane` for anything painted on the floor or a table top. Couches, tables, desks, lockers, crates, carts, plants, cones, the pool and card tables, air hockey, ping-pong, skee-ball, the arcade cabinets, the cockpit trainer, the chart and puzzle desks, the workbench, oil drums, the jukebox and the rug are all rebuilt that way. People, aircraft and signs stand upright at their projected feet. Taps unproject through the same math, labels follow the projected positions, and the camera centers on the player's column at mid-depth so the back wall stays in view.
- **THE GAME ROOM** (new, off the Lounge, nine places now): every just-for-fun game lives here: Pool, Air Hockey, Skee-Ball, Cone Bowling, Hangar Hoops, Compass Darts, Mini Golf, Prop Pong, Bag Toss and the two arcade cabinets (Cargo Stack, Radar Four), with a neon sign, a live HIGH SCORES board (tap it for the games list), stools, a host who explains the split, and the arcade song. The learning games stay where they belong on the airfield: the Tower (METAR, Weather Call, Light Gun), the Runway (Landing, Taxi Maze, Departure, Arrival), the Parking Stand (Preflight, Marshaller), the Wash Rack, the Platform (Plane Spotter, Cloud Spotter, Paper Plane Toss) and the Classroom (Phonetic Pairs, Gauge Reader, Word Hunt).
- The Lounge keeps the social things (Crew Board, Hangar News, the logbook case, the locker, the captain) and gains a jukebox (cycles every place's song) and a rug; the Hangar gains a workbench and oil drums. The map has the Game Room pin. The bar is PATH, MAP, LOUNGE, CLASS, HANGAR, FLIGHT BAG (the Tower is on the map and behind CALL TOWER everywhere).
- Fixed: the published page's title had fallen back to "App Shell" (the shell's index.html title); the app now sets its own.

**Tested:**

- `content_check`: OK. `hfq_smoke`: 38/38 (walks all nine places, passes the placement screen). `hfq_lessons_smoke`: 32/32. `hfq_games_smoke`: 52/52. `hfq_r4_smoke`: 54/54. `hfq_r5_smoke`: 38/38 (the fun games are in the Game Room, the learning games on the airfield). Shell: 23/23.
- `hfq_r6_smoke`: 50/50, new: the placement check tested out of four units; the projection round-trips and hit-tests; the Game Room split; the 24 books (sections, quizzes, figures, word count), reading and acing a book; the quiz engine's normalization and clock; a flashcard deck; the Path's stages, locks, TEST OUT → Bronze, drill, checkride + book quizzes → GOLD and its badge; the Practice Hub and trivia XP; the bag cards and the bar.
- Draw cost headless: places 0.4–1.2 ms a frame, the Path 1.9 ms.

**Facts checked for the books:** PHAK (forces, airfoils, stalls, controls, instruments, weight and balance, clouds, fronts, airspace, navigation, ADM/IMSAFE/hazardous attitudes), 14 CFR 61 (student solo 16 / 14 gliders and balloons; private 17 / 16; 40 hours Part 61, 35 Part 141), 14 CFR 91.125 light signals, AC 150/5340-18 sign colors, AC 150/5345-27 windsocks (fully extended at 15 knots), the AIM (beacons, PAPI, lighting colors, pattern altitude 1,000 ft AGL, 45° entry, 121.5, 7700/7600/7500), NWS flight categories, and the dates in Milestones of Flight (Wrights 12/17/1903, Lindbergh 5/20–21/1927, Earhart 5/20–21/1932, Yeager 10/14/1947, Comet 1952, 747 service 1970, Concorde 1976–2003, Voyager 12/1986). Quarters Field, KHFQ and the METAR example are made up.

**Open for you:**

- The books are ~330 words each on purpose (phone reading, ages 10–14). Say the word and the shelves grow (more history, more types, careers in depth) or the books get longer.
- The dioramas are code-drawn with image-layer slots ready: a painted room, prop or aircraft can replace any art function one at a time when you have illustration.

## Round 5: the slate is complete, 27 games

**Playable build:** republished to the same claude.ai artifact (same link). Still device-only.

**Built this round, the last ten games, each with its own prop in its room, a Ground School unit it practices (where one fits), and a Playwright run to its results screen:**

- **Cloud Spotter (Viewing Platform, the CLOUDS sign):** eight rounds. Name the cloud from a live sky (cumulus, stratus, cirrus, cumulonimbus with lightning and rain, fog on the ground), then say what it means for a pilot. Facts from the PHAK, ch. 12. Practices WEATHER.
- **Phonetic Pairs (Classroom, the card table):** 16 cards, match eight letters to their radio words, with a flip animation; the tower voice says each word as you turn it. Practices TALKING ON THE RADIO.
- **Gauge Reader (Classroom, the cockpit trainer now opens it):** ten instruments, eight seconds each, read airspeed, altitude, heading and vertical speed off the real six-pack figures. Practices COCKPIT INSTRUMENTS.
- **Word Hunt (Classroom, the bookshelf):** six aviation words hidden in an 8×8 grid (across, down, diagonal), tap the first letter then the last, a hint costs 20. Practices PARTS OF AN AIRPLANE.
- **Compass Darts (Lounge, the dartboard):** the tower calls a heading ("FLY HEADING 020") or a compass point ("FLY NORTHEAST"); a needle sweeps the rose, tap when it's on the heading; within 5° is a bullseye. Practices NAVIGATION + CHARTS.
- **Air Hockey (Lounge):** drag your mallet, first to 5 against the crew's mallet (which tracks the puck and lunges). Real-ish puck physics with mallet momentum.
- **Radar Four (Lounge arcade, RADAR cabinet):** four in a row on a radar scope against the crew, who takes a win when it has one and blocks three in a row.
- **Skee-Ball (Lounge):** pull back and let go; the ball rolls up the lane, flies off the ramp and lands on an airfield board whose rings are TAXIWAY 10, APRON 20, RUNWAY 30, HOLD LINE 40, CENTERLINE 50. Soft rolls fall short, hard rolls fly over the top.
- **Cone Bowling (Hangar, the lane):** ten orange traffic cones, five frames, two rolls each, strikes (+15) and spares (+13); a falling cone can tip the ones behind it. Practices AIRPORTS (cones mark closed apron).
- **Hangar Hoops (Hangar, the hoop on the wall; in the game, a rolling stand that moves after every make):** 45-second shootout, pull farther for a longer shot, hoops at the far mark are worth 3.

**Also:**

- The GAMES list in the Flight Bag is grouped by place (Lounge, Classroom, Hangar, Platform, Tower, Runway, Parking Stand, Wash Rack); "COMING SOON" is gone.
- Badges: GAME NIGHT REGULAR (17 different games) and CLUBHOUSE LEGEND (all 27).
- The Lounge got a dartboard between the window and the stairs, the air-hockey table at the front, the Skee-Ball machine and a second arcade cabinet along the back wall; the spawn point moved to the front. The Classroom got a bookshelf and a card table; the Hangar a bowling lane and a wall hoop; the Platform a CLOUDS sign (the plane spotter stepped aside for it).
- Shell v1.3.1 (changed in `app-shell/` and copied in): station labels that would overlap one another on the wall now step up a row instead of colliding.

**Tested:**

- `content_check`: OK. `hfq_smoke`: 37/37. `hfq_lessons_smoke`: 32/32. `hfq_games_smoke`: 52/52 (now expects 27/27). `hfq_r4_smoke`: 54/54. Shell: 23/23.
- `hfq_r5_smoke`: 38/38, new. Every new game is driven to its results screen; it also checks the cloud facts, the word placement, the crew's blocking move in Radar Four, Skee-Ball's short-roll miss, the badges and the grouped list.
- Per-frame cost of the new games is 0.04–0.3 ms headless (the air-hockey surface is drawn once and cached).

**Facts checked:** cloud types and what they mean (PHAK ch. 12), the phonetic alphabet (ICAO), headings/compass points, the six-pack (existing figures).

## Round 4: the whole airfield, Call the Tower, the Hall of Flight, the Flight Log and the Crew Board

**Playable build:** published as a claude.ai artifact (private to you until you share it). It runs on the viewer's device only: cadets, scores, the flight log and the boards stay in that browser.

**Built this round:**

- **Three new places, eight in all:** THE TOWER (the cab, with the radio and weather games on its consoles), the PARKING STAND (your airplane tied down, the fuel truck, line crew, Preflight Race, Marshaller Signals) and the WASH RACK (Wash Day, the supplies shelf, the line tech). Every place connects by doors, and new crew: Airport Ops on the runway, the line tech, a plane spotter on the platform, an airline captain in the Lounge.
- **AIRFIELD MAP:** the MAP tab shows Quarters Field as a golden-hour walkaround view with callout labels, leader lines, a legend and live traffic (modeled on the airport-overview image you sent). Tap a place to read what's there, tap again to go. The bottom bar is MAP, Lounge, Class, Hangar, Tower, Flight Bag; the map lights up when you're somewhere else.
- **CALL THE TOWER:** a radio you can open from anywhere (the floating CALL TOWER button). Tune ATIS, GROUND or TOWER. The ATIS reads today's weather and runway (generated daily; the letter changes hourly; runway 9 or 27 follows the wind). Calls are built by tapping four chips (who you're calling, who you are, where you are, what you want), the controller answers with real phraseology, and you read it back. Readbacks without the hold short or with the wrong runway are caught and explained. The tower talks out loud with the phone's built-in voice (Settings: TOWER VOICE, on by default; nothing leaves the device). Lessons now call today's runway on takeoff and the tower says it.
- **The Hall of Flight:** 37 aircraft from your illustrated guide (the Cessna 172 and PA-28 were already in the fleet), drawn as animated side views (propellers, rotors, the balloon's flame, the airship) in nine categories from the Wright Flyer to stealth jets, airships and uncrewed aircraft. No insignia, logos or weapons. Each has two checkable facts and a spotter's clue. Cadets unlock them by naming them in PLANE SPOTTER, then fly any of them as their avatar.
- **Nine new games (17 built, 10 to go):** Plane Spotter, METAR Decoder, Weather Call (VFR/MVFR/IFR/LIFR), Light Gun Signals, Departure and Arrival (every radio call of a flight, scored), Taxi Maze (follow the signs, brake before the hold-short line; crossing it is a runway incursion), Preflight Race (walk-around with close-ups: fuel samples, pitot cover, oil, tires, tie-downs) and Wash Day (cover the pitot and static ports first). Each Ground School unit's route now shows the games that practice it.
- **MY FLIGHT LOG:** a real logbook. PASSENGER flights (date, from/to, what you flew in, airline, seat, what you saw out the window), TRAINING flights (aircraft, minutes, landings, what you practiced, with an instructor / discovery flight / observer) and SIM flights the app logs on its own (every lesson, checkride and Landing Challenge). Totals read like a logbook: flights, hours, landings, airports, aircraft types, sim. It stays on the device and is never shared.
- **The CREW BOARD (the social hub, built for kids):** nobody types anything. The board fills itself with what cadets do: badges, phase steps, unit patches, aircraft spotted, personal bests, "logged a flight" (never where). One-tap KUDOS. The CADETS tab is the leaderboard (all time + this week) with an ID card per cadet (look, aircraft, phase, flights, patches, badges, kudos). In the Lounge, a departure-style board on the wall shows the latest lines. Hangar News stays the Family Lead's announcement board.
- **Sound:** two new songs (the Tower, the ramp), tower and wash-rack ambience, radio and wash sound effects.
- **New badges:** ON FREQUENCY, SHARP EYES, HALL OF FLIGHT, CLUBHOUSE LEGEND, LOGBOOK OPENED, FREQUENT FLYER. AIRFIELD EXPLORER now needs all eight places.
- **Shell (App Shell v1.3), changed in `app-shell/` and copied in:** `G.WORLD.tabs` (choose the tab bar; scene tabs with `home:true`), `G.WORLD.fab` (a floating button over every place), `CONFIG.settingsToggles` + `G.setting(id)`, and icons headset, map, tower, drop.

**Round 4.1, the look (after your note that it still read as paper cutouts):**

- **Every aircraft is now lit.** One render pass behind `H.drawAC` draws the model offscreen and lights it in place: cylindrical shading from the top highlight to the belly shadow, a warm key light from upper left with a cool fill from below, a specular streak, bounce light off the ground. Soft gradient shadows, wet-apron reflections (hangar, parking stand, wash rack, the gallery preview), motion-blurred propellers and rotors with bright blade tips, metallic wheels, and real aircraft lights: a flashing red beacon and white tail strobes, placed per model. Renders are cached (static, plus eight propeller phases), so it costs almost nothing per frame.
- **Skies and air.** A shared atmosphere kit (`H.sky`, `H.clouds`, `H.speedLines`, `H.sideRunway`): graded skies in day, golden, dusk and overcast moods, a sun with glow and lens flare, horizon haze, pre-rendered soft clouds with shaded undersides, speed streaks on takeoff and approach, scrolling runway lights, dust on the roll and tire smoke on touchdown. Used in lessons (takeoff, landing), the Landing Challenge (the gusty round is golden hour), Plane Spotter, Light Gun Signals (dusk), the Departure/Arrival animations, Paper Plane Toss and Weather Call.
- **The places.** A lighting layer in every room: floodlight pools, rubber and oil on the concrete, patch repairs, wet patches that catch the light, window light on the Lounge floor, a vignette, dust in the hangar beams, a warm haze on the outdoor horizons. People now have shaded suits and faces and soft shadows.
- Shell v1.3 adds the `G.WORLD.roomFx(c, R, phase)` hook that this uses.

**Influences used:** the airport-overview image (the map's callout style, legend and golden-hour look) and the asset pack (navy-and-amber grading, the lounge departure board, the tower cab, the six crew roles: captain, controller, ground crew, maintenance tech, passenger). Both were treated as direction, not assets.

**Tested** (the shell's own test still passes, 23/23):

- `content_check`: OK.
- `hfq_smoke`: 37/37 (now walks all eight places through the map).
- `hfq_lessons_smoke`: 32/32.
- `hfq_games_smoke`: 52/52.
- `hfq_r4_smoke`: 54/54, new. It plays every new game to the end, builds a radio call and catches bad readbacks, checks 1,200 generated weather reports against the FAA/NWS flight-category rules, logs flights and reads the Crew Board.

**Facts checked this round:** flight categories (NWS/aviationweather.gov), light gun signals (14 CFR 91.125), taxi phraseology and readbacks (FAA JO 7110.65 ch. 3-7), washing an airplane and fuel sampling (AOPA), the aircraft dates in your guide.

**Notes:**

- Quarters Field and its identifier KHFQ are made up. The ATIS frequencies are made up too.
- The flight log asks for no names. The instructor is "an instructor"; airports are codes or city names; notes are 120 characters and private.
- The playable artifact runs in local mode. It can be republished with a shared database so the Crew Board and Hangar News are shared between everyone you give the link to; say so if you want that.

## Round 3: flight sound, My Aircraft, the Classroom, and the first 8 games (as delivered)

**Built:**

- **The Classroom, Ground School's home:**
  - a new walkable place, the CLASS tab, with the instructor;
  - stations: the Ground School whiteboard, a Patch Wall that fills in as units are passed, the Hangar Flying corkboard, **My Desk** (always opens the next unfinished lesson), a Cockpit Trainer (Instruments) and a Chart Table (Navigation);
  - after picking a trainer, new cadets report to class. The Lounge becomes the hangout.
- **Ground School flight feel:**
  - every flight starts with a **takeoff roll**, with the tower clearing the cadet's call sign: "[call sign], runway 27, cleared for takeoff";
  - the cadet's own aircraft flies the progress bar, and an **altitude** readout climbs and descends;
  - misses get the radio's **"SAY AGAIN?"**, and right answers a **cabin chime**;
  - tires chirp on the landing scorecard, and the calm classroom theme plays through every lesson.
- **My Aircraft:**
  - 17 real key models drawn as side views, without logos;
  - **PICK YOUR TRAINER** at enrollment, from the six most common trainers: Cessna 172, Cessna 152, Piper PA-28, Diamond DA40, Cirrus SR20 and Piper J-3 Cub;
  - **11 unlocks across the book phases:** bush plane, floatplane, SR22, Bonanza, Seminole twin, PC-12, glider, R22 helicopter, Citation jet and 737, topped by an **air medical helicopter** (a nod to Book 7);
  - **MY HANGAR** has a paint shop (body + stripe). It doubles as the Aircraft Gallery.
  - The cadet's aircraft is parked in the Hangar and shown in the Logbook, the Squadron and the lessons. A NEW AIRCRAFT toast announces each unlock.
  - **Photo slots are ready:** drop in a photo per aircraft and the gallery shows it (README → Aircraft photos).
- **Flight sound, all synthesized:**
  - a title theme, a song for each of the five places, and a games theme;
  - cockpit and radio UI sounds: push-to-talk clicks, the cabin chime, a "say again" double-beep, a stall-horn buzz;
  - flight effects: engine start, takeoff roll, tire chirp, flyby, wind, radio calls, Morse idents;
  - a sound bed for every place, such as a propeller idling on the Runway, wind on the Platform and air tools in the Hangar.
- **The games:**
  - a shared kit: pause, results, best scores, a capped-XP rule, LEARN IT links to Ground School, and a GAMES list in the Flight Bag;
  - **8 playable games, placed around the clubhouse:**
    - Landing Challenge (PAPI glide path + flare) and Marshaller Signals (real wand signals) on the Runway;
    - Paper Plane Toss (lift, drag, stall) on the Platform;
    - Bag Toss (crosswind cornhole), Hangar Mini Golf and Prop Pong in the Hangar;
    - Pool (balls ALFA–GOLF) and Cargo Stack (falling blocks with a balance needle) in the Lounge.
  - Game XP: 15 for a first play, 5 for a new best, capped at 40 a day.
  - **3 new badges:** MY TRAINER, GAME ON, ARCADE ACE.
- **Shell (App Shell v1.2), changed in `app-shell/` and copied in:**
  - sound hooks: `AUDIO.addSongs`, `addJingles`, `addSfx` and `addAmbience`/`ambience`;
  - per-room `music` and `ambience` in `mod_world.js`.

**Tested** (the shell's own test still passes, 23/23):

- `content_check`: OK.
- `hfq_smoke`: 34/34.
- `hfq_lessons_smoke`: 32/32.
- `hfq_games_smoke`: 52/52. It covers every game mechanic: on-path PAPI, a soft flared landing scoring 90+, a steep paper throw stalling, a crosswind moving the bag, a hole in one, the pool break, a cleared cargo row, and first to 7.

**Notes:**

- I read "metrics" in your list as the falling-block puzzle (Tetris-style). It's called **Cargo Stack**, since the Tetris name is trademarked. If you meant something else, say what and I'll build it.
- The instructor moved from the Lounge to the Classroom. The crew are still placeholders.
- Fixed overlapping labels: the crew chief's name sat on the Bag Toss label, and the Lounge locker sat on the Classroom door. Both moved.

## The game plan: 27 games around the airfield (all built)

| Place | Games |
|---|---|
| **Runway** | Landing Challenge, Taxi Maze, Departure, Arrival |
| **Tower** | METAR Decoder, Weather Call, Light Gun Signals (and the radio games from the consoles) |
| **Parking Stand** | Marshaller Signals, Preflight Race |
| **Platform** | Paper Plane Toss, Plane Spotter, Cloud Spotter |
| **Hangar** | Bag Toss, Hangar Mini Golf, Prop Pong, Cone Bowling, Hangar Hoops |
| **Wash Rack** | Wash Day |
| **Lounge** | Pool, Cargo Stack, Compass Darts, Air Hockey, Radar Four, Skee-Ball |
| **Classroom** | Phonetic Pairs, Gauge Reader, Word Hunt |

## Decisions

**Waiting on you:**

1. **Aircraft photos:** send them when ready. The drop-in format is in the README.
2. **Identity upgrade:** the logo, and anything that changes colors or the title theme.
3. **Literature:** where it goes (About, briefings, crew lines, Hangar News, "from the books" cards).
4. **Crew names:** book characters later, or new app-only characters? (The captain, line tech, spotter and airport ops are new placeholders.)
5. **Sharing:** keep the playable build device-only, or republish it with a shared Crew Board + Hangar News for everyone you give the link to?
6. **"Metrics":** still read as the falling-block puzzle (Cargo Stack). Say if you meant something else.

## Next rounds (proposed)

- **Round 6:** weather states in the places (rain-slick apron, fog, night, following the asset pack and today's ATIS), the Weather Board on the platform, and airline-style "boarding passes" for logged flights.
- **Then:** the identity upgrade, your photos and literature, and cross-device squadrons.

---

## Round 2: Ground School comes alive, book phases, FAA look

**Built:**

- **Flight Lessons, the Ground School game** (`hfq_lessons.js`, content in `hfq_lessons_1/2/3.js`, figures in `hfq_figs.js`):
  - all 13 units written: **54 lessons, 328 challenges**, one lesson per topic;
  - each unit is a **route** of waypoints ending in a **checkride** (10 challenges, 8 to pass) that earns the **unit patch** through `G.groundSchool.complete`;
  - each lesson is a **preflight briefing** (cards, figures, an instructor tip), then **six kinds of tap-only challenge**: pick one, true/false, fill the blank, match pairs, put in order, and tap the picture;
  - **the game layer:** GO-AROUND (a miss comes back at the end), TAILWIND streaks, 1–3 star landings with an animated landing scorecard, FLIGHT DAYS (daily streak), TODAY'S PLAN (2 lessons a day), HANGAR FLYING (review of misses), unit patches;
  - **25 kinds of drawn figure** (no image files): airplane parts (side and top), the four forces, the wing and angle of attack, the three axes, the cockpit, all six instruments, FAA signs, the hold-short marking, airport lights, the traffic pattern, the windsock, clouds, fronts, a compass rose, a sectional chart, the airspace "wedding cake", right-of-way, position lights, the CG seesaw, hot-and-high, IMSAFE and nine aircraft types;
  - **6 new badges:** FIRST FLIGHT, GREASED IT, TAILWIND, FLIGHT DAYS, FIRST PATCH, GROUND SCHOOL GRAD;
  - the Ground School list shows FLIGHT DAYS, today's plan, patches, stars and progress per unit. The Logbook shows all 13 patches, and the Flight Bag card shows lessons done.
- **Phases:** the six book titles are the academy phases, three steps each (18 steps, 0–2,600 XP), with STEP UP and NEW PHASE toasts and a phase list in the Logbook.
- **The look, to FAA airfield standards:**
  - sign black + sign yellow, white-on-red for destructive buttons, taxiway blue, threshold green;
  - Runway: numbers at both ends (9 and 27), threshold bars, white edge lights, green/red threshold and end lights, blue apron lights, the red 9-27 holding sign, black-on-yellow game signs;
  - **accuracy fix:** the hold-short marking was drawn backwards. Its solid lines are now on the holding side.
- **Pages:** About explains Ground School to families (practice, not an FAA course). The Aircraft Gallery points to unit 13.
- **Fixes:** the Logbook said "FIND THEM IN THE THE RUNWAY".

**Shell (App Shell v1.2), changed in `app-shell/` and copied in:**

- theme keys for every button and the keypad;
- FAA sign styles, runway ends and lights in `mod_world.js`;
- an `x` icon;
- list items keep their titles.

The shell's own test still passes, 23/23.

**Tested:**

- `qa/content_check.js`: all 328 challenges OK.
- `qa/hfq_smoke.js`: 32/32.
- `qa/hfq_lessons_smoke.js`: 31/31, including every challenge in all 54 lessons auto-flown on a 480-tall screen with nothing overflowing.

### Decisions (as of Round 2)

**Settled this round:**

- **Crew:** placeholders for now.
- **Ranks:** the book titles are the phases.
- **Look:** FAA airfield colors.

**Waiting on you:**

1. **Identity upgrade:** you said a full identity (logo, brand) is coming. The logo is still the placeholder wings.
2. **Literature:** formal and informal writing you'll send. Tell me where it goes: the About page, briefings, crew lines, or Hangar News.
3. **Crew names:** book characters later, or new app-only characters? Lesson tips come from the INSTRUCTOR's portrait, so this changes who's talking in Ground School.
4. **Social between cadets:** still on one device only. Before anything goes across devices, choose:
   - preset quick-chat phrases;
   - kudos/salutes only;
   - adult-moderated posts.

### From AvHype, for later rounds

So far I've used AvHype's lessons, glossary and reference data as a fact source, rewritten for 10–14. Still unused:

- **13 arcade games**, natural fits for the Runway signs and new stations:
  - Final Approach → Landing Challenge;
  - Taxi Runner → Taxi Maze;
  - Tower Signals (light gun) → Marshaller/Tower station;
  - also Pattern Pilot, Altitude Hold, Crosswind Lander, Sign Sweep, Phonetic Flash, Mayday Match, Cloud Spotter, Airspace Ace, Gauge Reader and METAR Blitz.
- **54 aircraft** with history and specs → the Aircraft Gallery and Spotter Scope.
- **222 glossary terms** and **76 pronunciations** → Tower Radio and a pilot-talk page.
- **The preflight checklist** → the Preflight Check walk-around in the Hangar.
- **Weather and METAR references** → the Weather Board.
- **Milestones, history and career paths:** these could tie in with Book 7's career theme.

AvHype is written for adult learners (Part 61 certificates, the instrument rating). Anything brought over gets rewritten for ages 10–14 and fact-checked, the same as this round's lessons.

### Next rounds (as proposed in Round 2)

- **Round 3:**
  - the first runway game: Landing Challenge (from Final Approach) or Marshaller Signals;
  - the Preflight Check walk-around on the Hangar trainer, which would also earn Ground School XP.
- **Then:**
  - Weather Board and Spotter Scope content;
  - the identity upgrade;
  - book-tied extras: each phase unlocking a "from the books" card once the literature arrives.
- **Later:** cross-device squadrons, published as an artifact with the shared database, using whichever social design you choose.

---

## Round 1 (starter)

Generated from App Shell v1.1 with `tools/new_rendition.py presets/hfq/preset.json`. From here on, this folder is the source of truth: edit it directly each round. (`app-shell/presets/hfq/` is still the Round 1 starter, not today's app.)

**Built:**

- enrollment (call sign + PIN, Family Lead, guests);
- four walkable places with tab bar and Flight Bag;
- four placeholder crew;
- XP, seven ranks (replaced by phases in Round 2) and six badges;
- Ground School's 13 units and plug-in socket;
- Logbook;
- Squadron;
- text pages;
- "build me" module slots for the runway games, Preflight Check, Spotter Scope and Weather Board.

**Tested:** 25/25.

## Round 6.4: the 500-lesson course
- The course is now **four stages, 55 units, 500 lessons, 3,004 challenges** (same lesson size as before: 2-3 cards + 6 questions): DISCOVERY (the original 13 units + a Discovery Flight unit), STUDENT PILOT (12 units), PRIVATE PILOT (17 units), BEYOND (12 units: instrument, ratings, commercial, instructor, airline, jets, careers, special missions, military + space, new frontiers, history, master pilot). Private and Beyond lessons are curious-cadet overviews, not an FAA course; checkrides stay labeled practice.
- BEYOND is a free stage (`free:true`): open from day one, no gating. Other units still open one at a time (previous unit BRONZE).
- New lessons live in `web/js/content/lessons/*.js` (was `cur/`) (one file per unit, `H.dsl` shorthand), loaded after `core_3.js`. `qa/content_check.js` loads them too.
- The Flight Path has stage tabs (tap to jump), stage headers, cached geometry and draw culling. Each stage has a graduation badge (DISCOVERY GRAD, STUDENT GRAD, PRIVATE GRAD, TOP OF THE SKY): 34 badges total.
- Suites: smoke 38, games 52, r4 54, r5 38, r6 88, e2e 100, lessons (all 500 auto-flown) see below. content_check OK.

## Round 6.5: architecture review and hardening
Full write-up in `ARCHITECTURE.md`.
- **Engine safety nets (shell, synced to app-shell):** the frame loop contains errors (logged to `G.errors`, home after 30 bad frames); failed saves return false, set `G.storageOk` and warn once. New words `storageWarn`, `crashHome`.
- **Structure:** content moved to `js/content/lessons` (was `cur/` + `hfq_lessons_1-3`) and `js/content/books`. `qa/structure_check.js` enforces script wiring, shell parity, naming and lint. Lint config in `qa/eslint.config.js`.
- **Build:** `tools/build.js` (esbuild) makes `dist/`: 100 script files become 2 bundles. Published artifact now serves `dist/`.
- **Tests:** new `hfq_arch_smoke` (9) and `run_all.js`; `content_check` and the new `content_audit` share `qa/lib/content_loader.js`. `content_check` now rejects one-sided True/False lessons and false statements explained with "Yes".
- **Content fixes:** 13 one-sided True/False lessons balanced, 8 repeated questions reworded, 3 wrong "Yes." explanations fixed.
- **Not done (needs the author):** the multiple-choice answer-length cue (68% of correct answers are the longest option), the Google Fonts request, a fact check of the new lessons.

## Round 6.6: Terms of Use, the join gate, and visitor logs
- **`web/js/hfq_terms.js`**: the Terms of Use, Terms and Conditions and Intellectual Property Notice as app data (`H.TERMS`, version 1.0), layered: a six-line **Cadet Pledge** in a child's words, then the sixteen-section full Terms for the Family Lead (who we are; children and the Family Lead; not flight instruction; data stays on the device + the Google Fonts request + server access logs under COPPA's internal-operations exception; the IP notice and warning; call signs and XP; conduct; health; updates; warranties; liability; responsibility; termination; South Carolina law; general; contact). Bracketed items are for the publisher to fill in. **Not legal advice; counsel should review before release.**
- **The gate**: SIGN UP on a device with no accepted Terms shows the full Terms to the adult; ACCEPT stays disabled until the text has been scrolled to the end. Later cadets get the Pledge and tap I PROMISE. A new version asks the adult again at sign-in. Acceptance is a **receipt on the device** (`G.roster.terms`: version, date, time, who, and an FNV-1a fingerprint of the exact text), readable with the Terms from SETTINGS → TERMS OF USE + PRIVACY. Nothing is sent anywhere.
- **Shell:** `CFG.settingsLinks` (extra pages in Settings) added to `accounts.js`, synced to app-shell.
- **Visitor logs:** `tools/hosting/` has the nginx site, logrotate (90 days) and a README for serving `dist/` from dbmb.io, where the server's own access log is the "who visited" record. The app itself still sends nothing; no analytics, no identities of children (COPPA).
- Tests: `hfq_arch_smoke` 19 (10 new gate checks); the other suites pass the gate programmatically.
- **Protecting the Work (round 6.6b):** `LICENSE`, `.gitignore`, copyright headers on all 118 source files (`tools/stamp_headers.js`), bundles stamped with a build fingerprint (`window.HFQ_BUILD`) and banner, lessons and books encoded in the bundle (decoded at load; not copy-pasteable), no source maps. Checklist for the publisher: `../PROTECTING_THE_WORK.md`.


## Round 7.0: HypeTeen Flight Academy (2026-10-16)

The flagship release that goes with the seven-book series. Built in gates (protect, audit, stabilize, shared services, Hub, inventory, Explorer, art, QA, release); the evidence for each is in `docs/`.

- **Gate 0–1:** immutable baseline (`docs/01_GATE0_BASELINE.md`), runtime audit at four sizes and the 20-item remediation register (`docs/02_AUDIT_REGISTER.md`, statuses recorded).
- **Gate 2 (stabilize):** the P0 build defect (content lost under a strict CSP) fixed by shipping content as data; nginx headers fixed; fonts bundled (no third-party requests); service worker + manifest; reduced motion from the OS; toast queue; placement 3-of-3 and test-out tries capped (no rewarding guessing); a live region and ARIA on the canvas.
- **Gate 3 (shared architecture):** `hfq_registry.js` (918 activities, one launch each), `hfq_profile.js` (modes, verified record, schema v2), `hfq_ui.js` (the HTML layer).
- **Gate 4 (Academy Hub):** Settings toggle per profile; home, search, Flight Path list, unit pages, Games directory, places and crew, achievements, settings, a Hub first briefing; `qa/hfq_r7_parity.js` proves identical outcomes in both modes.
- **Library v2:** an e-reader for the 32 ground-school books and **all seven novels**, imported from the finished manuscripts with `tools/import_book.js` (interior art omitted by the author's decision; no author name anywhere; Ground School Notes linked to units, spoiler-safe). Real covers, author line cropped. A seventh academy phase, The Sky We Share, above 2000 XP.
- **Gate 5 (Success Inventory):** the Flight Record (verified vs self-reported, journal schema with id/type/date/place/aircraft/description/media/source/timestamps/version, goals, photos stripped of metadata, print); portable profiles (`.htfa` backup files with integrity, optional AES-GCM + PBKDF2, dry-run preview, merge/replace, pre-import restore point, all-or-nothing writes, rollback; `docs/BACKUP_FORMAT.md`).
- **Gate 6 (Explorer):** 46 verified places in the US, Canada and Mexico with citations, checked dates, access and safety notes and an explicit safety class; offline map (Natural Earth, pre-projected) + equivalent directory; visits are self-reported and never academic (`docs/EXPLORER_DESTINATIONS.md`).
- **Gate 7 (visual):** navy/brass palette app-wide (FAA signs unchanged), editorial serif + modern sans, insignia and icon set, asset manifest and contact sheet; the raster backlog scoped honestly (`docs/ART_BACKLOG.md`).
- **Gate 8 (ship):** `node qa/run_all.js --dist` green (structure, content, byline guard, 10 browser suites, dist parity, offline, parity on dist), release zip, migration guide, known issues, handoff.

## Round 7.1: the Illustrated Revision applied app-wide (2026-10-16)

The concept board becomes the look of the app:
- **Landing screen** = the board's landing painting (title art, tagline, cadet, airfield), with ENROLL / VISIT AS GUEST / SETTINGS typeset below in the board's gold and navy button styles.
- **Every room** gets a painted back wall or sky from the board's scenes through the painted-art slots (`art.js` gains `fit:'cover'` with a focal point); stations, crew and floors stay code-drawn over them.
- **Navigation language**: the board's own navigation discs (cut out as transparent assets) on the world tab bar, the MAP and TOWER buttons, the Flight Bag, the Hub tiles and the Settings gear; matching vector gold discs where the board has no icon; gold bold titles with cream small-caps subtitles and round bevelled gold back/gear buttons on every top bar (canvas and HTML); bevelled gold primary buttons; the board's ten winged badges serve all 33 achievements (Achievements, Flight Record, Logbook).
- **Welcome page** (“cleared to enter”): the landing painting with the CTA below it.
- **Plates retouched**: cut to each slot's exact aspect, soft-focus grade toward navy/gold, grain.
- **Academy Hub**: hero on the landing painting, every tile a scene plate.
- Not used by decision: the board's aircraft and instrument sheets (unverified), the character portraits (book characters stay in the books), raster icons/buttons (rebuilt as vectors).
- Plates are 3–4× upscales of the concept crops; `docs/ASSET_REPLACEMENT_INVENTORY.md` specifies native-resolution replacements that drop in file-for-file. Version 7.1.0; `docs/QA_REPORT_r7.1.md`.
