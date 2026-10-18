# HypeTeen Flight Academy (Round 7.4)

> **r7.4 (2026-10-17): learning that rewards, aircraft you can trust, helicopters, a crew that notices.** Learn-for-a-retry in four games, the instructor's clue ladder in every lesson, every aircraft drawn to scale from published dimensions with ID cards and an audit, a HELICOPTERS unit (12 lessons, eleven diagrams, eight new rotorcraft), crew lines that lead with your progress and a card for cadets who get stuck, one Terms gate for guests and sign-ins, notices in three tiers, controls that follow the input you use, and the Library with the ground-school books first. `ROUND_NOTES.md` has the whole list.

> **r7.0 (2026-10-16): the flagship companion to the seven-book HypeTeen Flight Academy series.** New name (migrated from HypeTeen Flight Quarters, all progress kept), an optional **Academy Hub** with proven parity to the walkable airfield, the **Library** with all seven novels free to read in an e-reader, a **Flight Record** (verified learning + self-reported experiences), the offline **North American Aviation Explorer**, **portable profiles** (backup files, optional encryption, preview, merge, rollback), a service worker for offline use, a strict-CSP build, and the navy/brass design. Start with `docs/HANDOFF.md`.


The companion learning app to the HypeTeen Flight Academy books, for cadets aged 10–14, built on the App Shell (v1.4.5). Cadets enroll on their device, pick a trainer airplane, get a first briefing from their instructor, follow the FLIGHT PATH through ground school (lessons, books, drills, checkrides; test out of what they already know), talk to the tower on the radio, keep a flight log, and walk a 3/4-diorama airfield full of games with a thumb-stick:

- the **Pilot's Lounge** (and the Crew Board) and its **Game Room**
- the **Classroom**
- the **Hangar**
- the **Viewing Platform**
- the **Runway**
- the **Tower**
- the **Parking Stand**
- the **Wash Rack**

It is plain HTML, CSS and JavaScript, with no framework, no build step and no dependencies. All art and sound are drawn and synthesized in code (no image or audio files yet).

## Run it

1. Run `cd web && python3 -m http.server 8777`.
2. Open http://localhost:8777. A phone, or a narrow browser window, shows it best.
3. Test it (screenshots land in `qa/shots/`):
   - **`node qa/run_all.js`**: everything below in one command (it starts its own servers). `--fast` skips the 512-lesson flight, `--dist` also builds `dist/` and runs the end-to-end and architecture suites against the bundle, `--jobs=N` sets how many browsers run at once (default 2; the end-to-end day and the 512-lesson flight always run alone).
   - `node qa/structure_check.js`: the architecture rules without a browser: every script loaded once and every file on disk loaded, the shell files identical to `app-shell`, naming, and lint errors.
   - `node qa/hfq_arch_smoke.js`: the engine's safety nets: a scene that throws is logged and the cadet is sent home after 30 bad frames, a failed save warns once (9 checks).
   - `node qa/content_audit.js`: advisory quality report (answer-length cue, throwaway distractors, duplicate prompts).
   - `node qa/content_check.js`: every lesson and challenge, without a browser.
   - `node qa/hfq_e2e.js`: **the whole loop, one new cadet, every move a real touch** (taps, and the thumb-stick through touch events): enroll with a fun call sign, placement, the full first briefing, two lessons (one with a go-around), TEST OUT, a perfect DRILL, the CHECKRIDE, the unit's three books read cover to cover and their quizzes, GOLD, trivia, flashcards, Hangar Flying, the MAP to the Game Room, walking to a game and playing it to the end, the TOWER button, the Classroom bookshelf, the Library, a Flight Log entry, then a reload and sign-in with everything kept (100 checks).
   - `node qa/hfq_smoke.js`: enrollment, the trainer pick, all nine places (tabs + the map), phases, the FAA look, the Logbook, Squadron, PIN reset (38 checks).
   - `node qa/hfq_lessons_smoke.js`: Ground School played by tapping (takeoff, every challenge type, checkride, review), then all 512 lessons flown on a small phone screen (32 checks).
   - `node qa/hfq_games_smoke.js`: the Classroom, My Aircraft and the fleet, the first 8 games and their mechanics, scores and XP, and the room sound (52 checks).
   - `node qa/hfq_r4_smoke.js`: the map, the Tower / Parking Stand / Wash Rack, Call the Tower (weather, ATIS, calls, readbacks), the Hall of Flight, the nine Round 4 games played to the end, the Flight Log and the Crew Board (54 checks).
   - `node qa/hfq_r5_smoke.js`: the last ten games played to the end, their places and props, the grouped GAMES list and the game badges (38 checks).
   - `node qa/hfq_r6_smoke.js`: the placement check, the diorama projection, the Game Room split, the Library (32 books, chapters, resume, quizzes, scaling, story shelves), the painted-art slots, the quiz engine and flashcards, the Flight Path (locks, test-out, drills, GOLD), the Practice Hub and trivia, the one-word call signs, the thumb-stick and USE button, the first briefing, Hangar Flying fed by drills and trivia, the two-book Flight Log, the logbook grids, shrink-to-fit text, a painted sky for outdoor places, each unit's own practice game (88 checks).
   - `node qa/fig_gallery.js`: renders every Ground School figure for a visual check.
   - **r7:** `node qa/hfq_r7_parity.js` (two cadets, airfield vs Academy Hub, identical answers, identical saves: 41 checks), `node qa/hfq_r7_backup.js` (backup files, hostile files, encryption, rollback, migration: 28), `node qa/hfq_r7_explorer.js` (Explorer data + screen, the HTML layer, the seven novels: 36), `BASE_URL=<dist server> node qa/hfq_r7_offline.js` (the built app with the network off, under the shipped CSP: 13), `node qa/byline_guard.js` (no author name anywhere), `node qa/hfq_dist_parity.js` (the bundle equals the source).
   - **r7.4:** `node qa/hfq_r74_smoke.js` (the hangar close-ups, the Terms gate for guests and sign-ins, notices in tiers, controls by input, learn-for-a-retry, the clue ladder, the crew's hints and the stuck card, ID cards, the Library order, phone / tablet / desktop: 52 checks), `node qa/hfq_ac_audit.js` (every aircraft drawing against its published length and height, and every ID card against its drawing: 6). `node qa/hfq_r74_sweep.js [outdir] [profiles]` screenshots every major screen at phone, tablet and desktop sizes for a person to review (the reviewed r7.4 set is in `qa/shots/r7_4/`).
   - Generated docs: `node qa/hfq_r7_registry_export.js` (docs/ACTIVITY_REGISTRY.md), `node tools/export_destinations.js` (docs/EXPLORER_DESTINATIONS.md), `python3 tools/contact_sheet.py` (docs/CONTACT_SHEET.pdf).

## Where things are

| To change… | Edit |
|---|---|
| **The HTML layer** (the view stack, dialogs, icons, title case, hosting of HTML screens by canvas scenes) | `web/js/hfq_ui.js`, `web/css/htfa.css` |
| **The Academy Hub** (home, search, Flight Path list, unit pages, the Games directory, airfield places and crew, achievements, settings, the Hub briefing) | `web/js/hfq_hub.js` |
| **The activity registry** (one id and one launch per activity; both modes call it) | `web/js/hfq_registry.js`; generated inventory `docs/ACTIVITY_REGISTRY.md` |
| **Profiles, modes, the verified record, schema migration** | `web/js/hfq_profile.js` |
| **The Library v2 and the e-reader; the seven novels** | `web/js/hfq_reader.js`; `web/js/content/series.js`; `web/js/content/lazy/series/htfa-<n>.js` (generated by `tools/import_book.js`, see `docs/LIBRARY_PIPELINE.md`) |
| **The Flight Record** (what I learned / did / next, journal entries, photos, goals, print) | `web/js/hfq_record.js` |
| **Backup and restore** (envelope, integrity, encryption, sanitizer, merge, rollback, restore points) | `web/js/hfq_backup.js`, `web/js/hfq_store.js`; `docs/BACKUP_FORMAT.md` |
| **The Explorer** (map, directory, place pages, visits) and its data | `web/js/hfq_explorer.js`; `web/js/content/explorer/destinations.js`; the basemap `tools/build_basemap.js` |
| Offline: the service worker and the web app manifest | `web/sw.js`, `web/manifest.webmanifest`, `web/js/hfq_offline.js` |
| The production build (content as data, no eval) and hosting headers | `tools/build.js`, `tools/hosting/` |
| Name, colors, words, Flight Bag cards, text pages, badges, the title music | `web/js/rendition.js` |
| **The Flight Path, mastery tiers, test-out, drills, the placement check, the Practice Hub** | `web/js/hfq_path.js` |
| **The quiz engine and flashcards** (used by drills, test-outs, trivia, book quizzes, placement) | `web/js/hfq_quiz.js` |
| **The Library:** the shelves, the chaptered reader, reading + quiz progress | `web/js/hfq_library.js`; the 32 books: `web/js/content/books/books.js`, `web/js/content/books/books_2.js` (see *Adding books*) |
| **Painted art slots** (images that replace any code art by key) | `web/js/art.js` (the shell) + `web/assets/art/manifest.json` |
| The nine places: layout, stations, doors, crew, room music and ambience, drawn props (volumes via `G.V`), the tab bar, the round MAP and TOWER buttons, the USE button and the stick | `web/js/hfq_data.js` → `G.WORLD` |
| **The first briefing** (the 8-step tutorial a new cadet gets on landing; replay card in the Flight Bag) | `web/js/hfq_tutorial.js` |
| The 3/4 projection and the volume kit (`G.V.box/top/front/side/cyl/plane/shadow`), the thumb-stick, USE, sliding along obstacles | `web/js/mod_world.js` (the shell, v1.4.4) |
| **The airfield map** (the pop-up behind the round MAP button) and the art for the Tower, Parking Stand and Wash Rack | `web/js/hfq_places.js` |
| **The radio:** today's weather (METAR/ATIS), the tower's voice, radio calls and readbacks, CALL THE TOWER | `web/js/hfq_radio.js` |
| **The Hall of Flight:** the 45 historic aircraft, their facts and clues (the drawings are in `hfq_profiles_hall.js`) | `web/js/hfq_aircraft2.js` |
| **The Flight Log:** passenger, training and sim flights, totals, the LOG A FLIGHT form | `web/js/hfq_flightlog.js` |
| **The Round 5 games:** Cloud Spotter, Phonetic Pairs, Gauge Reader, Word Hunt / Compass Darts, Air Hockey, Radar Four, Skee-Ball / Cone Bowling, Hangar Hoops (the file names keep the places they were first built for; those games now live in the Game Room) | `web/js/hfq_g_class.js`, `web/js/hfq_g_lounge.js`, `web/js/hfq_g_hangar.js` |
| **The Crew Board:** the activity feed, kudos, the cadets leaderboard and ID cards, the Lounge departure board | `web/js/hfq_crew.js` |
| Academy phases, XP amounts, call-sign words, locker colors, the 56 units (each with its `practice` game) | `web/js/hfq_data.js` → `G.HFQ` |
| Enrollment hooks, XP and step-ups, the Locker, who hangs out in the Lounge | `web/js/hfq_cadet.js` |
| **Sound:** the songs, jingles, aviation sound effects, room ambience, Morse idents | `web/js/hfq_audio.js` |
| **Aircraft:** the 17 models, their drawings, facts, unlocks and paint | `web/js/hfq_aircraft.js` |
| **My Aircraft screens:** PICK YOUR TRAINER, MY HANGAR / AIRCRAFT GALLERY | `web/js/hfq_fleet.js` |
| The Ground School list (FLIGHT DAYS, today's plan, patches) | `web/js/hfq_groundschool.js` |
| **The lesson game:** route, briefings, takeoff, challenges, scorecards, checkrides, review, the classroom desk | `web/js/hfq_lessons.js` |
| **Lesson content:** units 1–4 / 5–8 / 9–13 | `web/js/content/lessons/core_1.js`, `core_2.js`, `core_3.js` |
| **Figures:** airplane parts, instruments, signs, charts, weather, airspace, aircraft types | `web/js/hfq_figs.js` (helicopter figures: `hfq_figs_heli.js`) |
| **The games:** the slate of 27, the shared kit and materials, the GAMES list | `web/js/hfq_games.js` |
| **Each game** | `web/js/hfq_g_<name>.js` (landing, marshal, paper, bags, golf, pong, pool, cargo, spot, metar, wx, lightgun, radio = depart + arrive, taxi, preflight, wash) |
| Logbook and Squadron | `web/js/hfq_logbook.js` |
| Walking, rooms, doors, dialog, people, airfield signs and runways, room sound | `web/js/mod_world.js` (shell framework) |
| Everything else (engine, accounts, lists, data, audio engine, icons) | the shell files; fix them in the shell, then copy them in |

## How a cadet moves through it

1. **Welcome page:** CLEARED TO ENTER (title theme).
2. **Title:** ENROLL, SIGN IN or VISIT AS GUEST.
3. **Enroll:** a made-up, one-word call sign, like a real one (GIVE ME A FUN ONE picks from 107: AFTERBURNER, PICKLE, WINGNUT, TACO…, never one another cadet on the device has), then a PIN, then the PIN again.
4. **Locker (SUIT UP, CADET):** suit, skin, hair, hair style and headgear.
5. **PICK YOUR TRAINER:** one of the six most common training airplanes.
6. **HAVE YOU STUDIED FLYING BEFORE?** I'M NEW starts at the beginning; the 12-question placement check can test them out of the first units.
7. **The first briefing:** they land in the Classroom and the instructor walks them through the controls in eight spotlighted steps: walk with the stick, walk to the instructor and tap USE, open the MAP, the TOWER button, the FLIGHT BAG, the PATH tab, tap the glowing node, START. Their first lesson then starts for real. SKIP works at any step; the TUTORIAL card in the Flight Bag replays it; finishing earns FIRST BRIEFING and 20 XP.
8. **Walking:** drag anywhere on the floor (or the resting stick, bottom left) and a thumb-stick follows the thumb; the cadet slides along desks and walls instead of sticking. The round **USE** button (bottom right) lights up when a person or a station is in reach, the thing glows and a small prompt names it. A short tap still walks to a spot or opens what you tap.
9. **The tab bar** is PATH, LOUNGE, CLASS, HANGAR and FLIGHT BAG. The round **MAP** button (top right) pops the whole airfield up over the room: tap a place to read what's there, tap it again (or GO THERE) to go, ✕ or a tap outside to close. Under it, the round **TOWER** button opens the radio from anywhere. Every place also connects to its neighbors by doors. **FLIGHT BAG** lists everything as cards, including the FLIGHT PATH, PRACTICE HUB, THE LIBRARY, GAMES, MY HANGAR, FLIGHT LOG, the CREW BOARD and the TUTORIAL.

### What's in each place

| Place | Stations | Crew | Sound |
|---|---|---|---|
| **Lounge** (the hangout) | Doors to the Classroom, the **Game Room**, the Hangar and the Parking Stand, stairs to the Platform, the **Crew Board** (departure-board style), Hangar News, My Logbook (with the Flight Log), My Locker, the jukebox, the Cadets + Kudos sign. Other cadets on the device hang out here. | Captain (airline) | laid-back theme, room tone, distant flybys |
| **Game Room** (off the Lounge, just for fun) | **Pool**, **Air Hockey**, **Skee-Ball**, **Cone Bowling**, **Hangar Hoops**, **Compass Darts**, **Mini Golf**, **Prop Pong**, **Bag Toss**, the **Cargo Stack** and **Radar Four** arcade cabinets, the HIGH SCORES board, a neon sign | Host | arcade theme |
| **Classroom** | **The Library** (bookshelf), **Ground School** whiteboard, **Patch Wall** (earned unit patches), **Hangar Flying** corkboard (review), **My Desk** (keep learning), **Cockpit Trainer** (Gauge Reader), **Phonetic Pairs**, **Word Hunt**, **Chart Table** (Navigation unit), door to the Lounge | Instructor | calm focus theme |
| **Hangar** | Aircraft Gallery, out to the Runway, Parts of an Airplane poster, **your own aircraft** parked in the middle (opens MY HANGAR), tool cart, workbench, doors to the Lounge and the Wash Rack | Crew Chief | mechanical groove, air tools |
| **Platform** | **Plane Spotter** scope, **Cloud Spotter**, Today's Weather (the ATIS), Windsock, the scanner radio, **Paper Plane Toss**, stairs down | Plane Spotter | airy theme, wind, radio squelch |
| **Runway** | **Landing Challenge**, **Taxi Maze**, **Departure** and **Arrival** (radio), the red 9-27 holding sign, doors to the Hangar and the Parking Stand | Airport Ops | driving theme, a propeller idling, departures |
| **Tower** | **METAR Decoder** screen, **Weather Call** window, flight strips (the radio), the **light gun**, the GND / TWR / APP consoles (**Taxi Maze**, **Departures**, **Arrivals**), stairs down to the Parking Stand | Tower (the controller) | calm radar theme, radio chatter, a radar ping |
| **Parking Stand** | Your aircraft tied down (**Preflight Race**), the fuel truck, **Marshaller Signals**, other parked airplanes, taxi out to the Runway, doors to the Tower and the Lounge | Line Crew (marshaller + fueler) | sunny ramp theme, a propeller idling |
| **Wash Rack** | Your aircraft on the pad (**Wash Day**), the supplies shelf, door to the Hangar | Line Tech | ramp theme, running water, drips |

## Ground School: Flight Lessons

56 units in four stages (Discovery, Student Pilot, Private Pilot, Beyond), 512 lessons (one per topic, files in `web/js/content/lessons/`; the HELICOPTERS unit is `heli.js`, from the FAA Helicopter Flying Handbook), about 3,080 challenges. Facts follow the FAA's Pilot's Handbook of Aeronautical Knowledge, the AIM, 14 CFR 91, the airport sign and marking ACs and the Airplane Flying Handbook, rewritten for ages 10–14. The AvHype Aviation Education site was used as a fact source.

**A unit is a route.** Its lessons are waypoints on a chart, unlocked in order, and the last waypoint is the **checkride**: 10 challenges drawn from every lesson in the unit, 8 to pass. Passing calls `G.groundSchool.complete(unitId, score)`, which awards the **unit patch** and 100 XP.

**A lesson** is a **preflight briefing** (1–4 cards with figures and an instructor tip), a **takeoff** (the tower clears the cadet's call sign for takeoff from Runway 27; tap to skip), then a **flight** of 6–7 tap-only challenges:

| Kind | What the cadet does |
|---|---|
| `mc` | picks one of four |
| `tf` | TRUE / FALSE (labeled AFFIRMATIVE / NEGATIVE) |
| `fill` | taps the word that fills the blank |
| `match` | matches 3–4 pairs |
| `order` | puts steps in order |
| `tap` | taps the right part of a picture (instruments, signs, airspace, airplane parts…) |

**The game layer:**

- **Flight feel:** the cadet's own aircraft flies the progress bar, an altitude readout climbs and descends, a cabin chime sounds for right answers, and the tires chirp on the landing scorecard.
- **Go-arounds:** a miss gets the radio's "SAY AGAIN?" with the right answer and why, then comes back at the end of the lesson.
- **Tailwind:** right answers in a row build a TAILWIND streak (×2, ×3…).
- **Stars:** each lesson lands with 1–3 stars (3 = no misses).
- **Daily habits:** FLIGHT DAYS counts days in a row with a lesson. TODAY'S PLAN is 2 lessons a day.
- **Review:** HANGAR FLYING replays missed challenges until they're cleared. A lesson question missed in a drill, a trivia round or a test-out lands there too (`H.noteMiss` / `H.noteHit`, called by the quiz engine), and answering it right later clears it, so every mistake has one place to be practiced.

**XP:** a new lesson 10, each new star 5, a first TAILWIND of 5+ 5, the daily plan 10, a review session 5 (once a day), a unit patch 100. Replays earn only new stars.

### Adding or editing lessons

Each content file calls `H.addLessons(unitId, [...])`, which also registers the unit with Ground School:

```js
H.addLessons('weather', [
 {id:'wx-wind', t:'Wind + the windsock',
  cards:[{t:'Card title', b:'Card text.', fig:{f:'sock', kts:10}}],
  tip:'One short line from the instructor.',
  qs:[
   {k:'mc',   q:'Question?', a:['right','wrong','wrong','wrong'], why:'Why.'},   // a[0] is always right; options shuffle
   {k:'tf',   q:'Statement.', t:true, why:'Why.'},
   {k:'fill', q:'One ___ in the sentence.', a:['right','wrong','wrong'], why:'Why.'},
   {k:'match',q:'Match them.', p:[['left','right'],['left','right'],['left','right']], why:'Why.'},
   {k:'order',q:'Put in order.', s:['first','second','third'], why:'Why.'},
   {k:'tap',  q:'Tap the X.', fig:{f:'airspace', quiz:true}, z:'B', zl:'What the right zone is called', why:'Why.'}
  ]}
]);
```

Figures are listed in `G.FIG.names()`, and their tap zones in `G.FIG.zones(spec)`. Use `quiz:true` where a figure would otherwise print the answer (airspace, wing, axes, CG, nav lights). Run `node qa/content_check.js` after any edit: it catches missing blanks, duplicate match labels, tap zones that don't exist or overlap, and answers too long for their buttons.

## My Aircraft

- **Pick your trainer:** each cadet picks from the six most common trainers:
  - Cessna 172 Skyhawk
  - Cessna 152
  - Piper PA-28 Warrior
  - Diamond DA40 Star
  - Cirrus SR20
  - Piper J-3 Cub
- **Unlocks:** the phases unlock more aircraft, one per phase step from Crosswind Decisions on (11 unlocks):

| Phase | Unlocks |
|---|---|
| *Crosswind Decisions* | Piper Super Cub; a floatplane |
| *Weather Minimums* | Cirrus SR22; Beechcraft Bonanza |
| *Cross-Country* | Piper Seminole twin; Pilatus PC-12 turboprop |
| *Solo* | Schweizer 2-33 glider; Robinson R22 helicopter |
| *Pilot in Command* | Cessna Citation CJ jet; Boeing 737; at the very top, an air medical helicopter |

- **Paint:** each aircraft can be painted, with a body color and a stripe color.
- **Where it shows up:**
  - parked in the Hangar;
  - in the Logbook and the Squadron;
  - flying the lesson progress bar, the takeoff, the landing scorecard and the Landing Challenge.
- **Drawings:** every aircraft is a side-view drawing of the real model's shape (wing position, struts, gear, tail, engines, canopy), with no logos or brand marks. Model names describe the real aircraft.

### Aircraft photos

When you have photos, save each as `web/assets/aircraft/<id>.jpg` and add it to `assets` in `rendition.js`, like this: `{ "name": "ac_c172", "src": "assets/aircraft/c172.jpg" }`.

MY HANGAR and the Aircraft Gallery then show the photo, with the drawing as a small badge. The ids are:

- **Trainers:** `c172`, `c152`, `pa28`, `da40`, `sr20`, `j3`
- **Unlocks:** `supercub`, `float`, `sr22`, `bonanza`, `seminole`, `pc12`, `glider`, `r22`, `citation`, `b737`, `ems`

Use photos you own or have a license for, and keep the credits.

## Call the Tower (the radio)

Quarters Field (KHFQ) has an ATIS (127.25), GROUND (121.70) and TOWER (118.30); all made up. `H.wx.today()` makes the day's weather from the date (VFR most days, sometimes MVFR), with the ATIS letter changing every hour and runway 27 or 9 picked from the wind. `H.wx.make(rng, {cat})` makes any report, and `H.wx.cat(w)` classes it by the NWS flight-category rules.

A call is four chips: who you're calling, who you are, where you are, what you want. `H.callDefs(room)` builds today's calls (radio check, ready to taxi, ready for departure, inbound, midfield, after landing) with the controller's reply and three readbacks, one right. `H.RadioFlow` runs a sequence of steps (tune, atis, build, readback, quiz, anim) and is shared by CALL THE TOWER and the Departure / Arrival games.

`H.say(msg, who)` speaks with the phone's own voice (speechSynthesis). It follows the TOWER VOICE setting (on by default), and nothing leaves the device. Phrases are stored twice: `t` as shown, `s` as spoken (digits one at a time, "niner").

## The Hall of Flight

45 aircraft from the illustrated guide live in `web/js/hfq_aircraft2.js` (37 from r4 plus eight rotorcraft added in r7.4), in nine categories (pioneers, lighter than air, World War I, World War II, airliners, jets, rotorcraft, trainers, uncrewed). Each is a side-view drawing in the same 240 × 120 box as the fleet, animated through `H.drawAC(c, id, …, {prop:'spin', t, fly:true})`. Since r7.4 the drawings are scale profiles in meters (`web/js/hfq_profiles_hall.js`, `hfq_profiles_fleet.js`, the kit in `hfq_profiles.js`): each profile carries its published length, span or rotor diameter and height, and `qa/hfq_ac_audit.js` checks every drawing against them and every ID card (`web/js/content/aircraft_cards.js`) against the drawing. The house rules: no insignia, no logos, no weapons. Cadets unlock one by naming it in PLANE SPOTTER (`H.spot(id)`); `H.acUnlocked(id)` then lets them fly it as their avatar. Add one by appending to `H.HALL` with `{id, name, cat, year, role, seats, paint, facts:[2], clue}` plus a profile `PR.<id>={dims:{L,H,span|rotor}, draw(K)}` and a card.

## The Flight Log

`web/js/hfq_flightlog.js`. Entries live in `G.save.mod.flog.e` (per cadet, on the device). `H.flog.add(entry)` and `H.flog.logged(entry)` (XP, badges, a Crew Board line). The app logs sim sessions itself through `H.simFlight({title, min, ldg})` from the lesson engine (lessons, checkrides) and the Landing Challenge. The form (`G.scenes.logflight`) is two steps and asks for no names: date, from/to (a code or city), the aircraft from a picker, then seat + what-I-saw chips (passenger) or minutes, landings, what-we-practiced chips and the role (training). Notes are 120 characters.

**Two books, kept apart like a real pilot's logbook.** The log opens on FLIGHTS (real flights: passenger and training, with ALL / PASSENGER / TRAINING filters) or SIM SESSIONS (the trainer). Each book has its own page totals (flights, training time, landings, airports, aircraft / sessions, sim time, landings, lessons, checkrides) and ledger rows (date, route or session, a role chip, time, landings). Sim time is never added to flight time, the way a logbook keeps simulator time in its own column. Real entries can be removed from their sheet; sim sessions are records of practice and cannot. `G.go('flightlog', {tab:'fl'|'sim'|'pax'|'dual'})` opens a book (and a filter). My Logbook shows the two books as separate tiles.

## The Crew Board

`web/js/hfq_crew.js`. A shared collection `feed` through `G.data` (this device, or the artifact's shared db when published with it). Nobody types: `H.feed(key, text, {icon})` posts a line when something happens, deduped by key. Hooks wrap `G.ach`, `G.onAward`, `H.spot`, `G.groundSchool.complete` and `H.gameDone`; the Flight Log posts "logged a flight" with no details. `H.kudos(row)` toggles the viewer's kudos on a line. The CADETS tab reads `H.cadets()` (XP, XP this week, flights, patches, badges, kudos received). The Lounge wall art `depboard` shows the latest lines.

## The Library: adding books and stories

Books are data. Any `js` file loaded after `content/books/books.js` can add to the shelves (add the `<script>` to `index.html`), so your literature can live in its own files:

```js
(function(){ const H=G.HFQ;
 H.addShelves([{id:'stories', t:'HANGAR STORIES', icon:'star', kind:'story'}]);   // kind:'story' = fiction: chapters, a byline, no quiz
 H.addBooks([{
   id:'crosswind-1', shelf:'stories', kind:'story', t:'CROSSWIND DECISIONS, CHAPTER ONE', sub:'From the HypeTeen Flight Academy',
   unit:'decisions',                       // the Ground School unit it goes with (optional for stories)
   cover:'book:crosswind-1',               // a painted cover, if assets/art/manifest.json has one (optional)
   sec:[ {h:'THE WINDSOCK', p:['Paragraph…','Paragraph…']},     // each section is one page in the reader
         {h:'THE DECISION', p:['…'], fig:{f:'sock'}} ],          // a Ground School figure on the page (optional)
   quiz:[ {q:'…', a:['right','wrong','wrong','wrong'], ok:0, why:'…'} ]   // any length; passing is 5 of 6, 7 of 8, 10 of 12 (stories can leave it out)
 }]);
 H.extendBook('forces', [{h:'MORE', p:['…']}], [{q:'…', a:['…','…','…','…'], ok:0, why:'…'}]);   // grow an existing book
})();
```

The reader pages through the sections (BACK / CONTENTS / NEXT), remembers the page per cadet, marks the book read on the last page (+10 XP, +15 for 8 chapters or more), and offers the quiz. Non-fiction books count toward GOLD on the Flight Path through their `unit`. Facts in the built-in books are sourced in the comments at the top of `hfq_books.js` and `hfq_books_2.js`.

## Painted art

Every piece of code-drawn art has an image slot. Drop images in `web/assets/art/` and list them in `web/assets/art/manifest.json` (no code):

```json
{ "room:lounge:wall": "assets/art/lounge-wall.png",
  "room:lounge:floor": "assets/art/lounge-floor.png",
  "prop:pool": {"src":"assets/art/pool.png", "w":130, "h":70},
  "station:gameroom:skee": "assets/art/skee.png",
  "wall:cork": "assets/art/corkboard.png",
  "npc:captain": {"src":"assets/art/captain.png", "w":30, "h":46},
  "ac:c172": "assets/art/c172-side.png",
  "book:forces": "assets/art/forces-cover.png" }
```

Keys: `room:<key>:wall` (the back wall, R.w × R.wall units; outdoors, on the Platform, the Parking Stand and the Runway, it is the sky band, drawn from 200 units left of the floor to past its right edge), `room:<key>:floor` (drawn in the floor plane, so it recedes with the diorama), `prop:<art>` or `station:<room>:<stationKey>` / `decor:<room>:<art>` (floor props: feet at the bottom center of the footprint), `wall:<art>`, `npc:<id>`, `ac:<aircraftId>` (a side view, nose to the right), `book:<id>`. An entry is a path or `{src, w, h, ax, ay}` (size in world units, anchor 0–1). Anything missing or broken falls back to the code art, so you can paint one prop at a time. The slots are in the shell (`js/art.js`, `js/mod_world.js`), the aircraft renderer and the Library.

## The games

**Twenty-seven games around the airfield** (also listed under GAMES in the Flight Bag, grouped by place, THE GAME ROOM first). The eleven just-for-fun games are in the Game Room; the learning games are where they belong on the airfield:

| Game | Where | What it teaches or practices |
|---|---|---|
| **Landing Challenge** | Runway | Fly the 3° glide path by the **PAPI** lights (2 white + 2 red = on path), then flare. Three approaches: calm, headwind, gusty. Hold the flare too long and the stall horn sounds. |
| **Marshaller Signals** | Parking Stand | The real FAA/ICAO wand signals (straight ahead, turn left/right, slow down, stop, cut engines), from the pilot's point of view, with a signals chart. |
| **Paper Plane Toss** | Platform | A small glider model with lift, drag, angle of attack and a real stall. Headwinds and tailwinds change the distance. |
| **Bag Toss** (cornhole) | Game Room | A crosswind from the windsock pushes the bag: aim into the wind. |
| **Hangar Mini Golf** | Game Room | Six holes: a runway, a taxiway dogleg, a spinning propeller, sliding hangar doors, runway-light bumpers and a baggage cart. |
| **Prop Pong** | Game Room | Ping-pong on a runway-striped table, first to 7. |
| **Pool** | Game Room | Balls lettered A–G, called out as ALFA through GOLF. |
| **Cargo Stack** | Game Room arcade | A falling-block puzzle in a cargo hold, with a balance (CG) needle and a bonus for balanced loads. |
| **Plane Spotter** | Platform | Name the aircraft crossing the scope; new ones join your hangar. A clue costs half the points. |
| **METAR Decoder** | Tower | Tap the piece of a weather report, or pick what it means. A decoder card explains every piece. |
| **Weather Call** | Tower | Read the sky and the METAR: VFR, MVFR, IFR or LIFR (the worse of ceiling and visibility decides). |
| **Light Gun Signals** | Tower | The tower's steady / flashing green, red and white signals, on the ground and in the air (14 CFR 91.125). |
| **Departure** | Tower, Runway | ATIS, the letter, the runway, ground (taxi + readback), taxi to the hold line, tower (ready + readback), takeoff. Scored. |
| **Arrival** | Tower, Runway | ATIS, inbound call, the traffic pattern (which leg, which way to turn), midfield call, cleared to land, exit and switch to ground. |
| **Taxi Maze** | Tower, Runway | Three taxi clearances; follow the signs at each junction and brake before the hold-short line. Crossing it is a runway incursion. |
| **Preflight Race** | Parking Stand | Ten glowing checks on the walk-around with close-ups; four hide a problem (water or jet fuel in the sample, a pitot cover, low oil, a nest, a flat tire, a tie-down). |
| **Wash Day** | Wash Rack | Cover the pitot tube and static port, bug remover, soap, hose, soft cloth on the plastic windshield (paper towels scratch), covers off. |
| **Cloud Spotter** | Platform | Name the cloud from a live sky (cumulus, stratus, cirrus, cumulonimbus, fog), then what it means for a pilot (PHAK ch. 12). |
| **Phonetic Pairs** | Classroom | A memory game: match letters to ALFA, BRAVO, CHARLIE… The tower voice says each word. |
| **Gauge Reader** | Classroom (cockpit trainer) | Read airspeed, altitude, heading and vertical speed off the six-pack, eight seconds each. |
| **Word Hunt** | Classroom | Six aviation words hidden in an 8×8 grid. Tap the first letter, then the last. |
| **Compass Darts** | Game Room | The tower calls a heading or a compass point; stop the sweeping needle on it. 090 is east, 180 south, 270 west. |
| **Air Hockey** | Game Room | Drag your mallet; first to 5 against the crew. |
| **Radar Four** | Game Room arcade | Four in a row on a radar scope against the crew, who blocks and takes wins. |
| **Skee-Ball** | Game Room | Pull back and let go. Rings: taxiway 10, apron 20, runway 30, hold line 40, centerline 50. |
| **Cone Bowling** | Game Room | Ten orange cones, five frames, strikes and spares. Cones mark the parts of an apron that are closed. |
| **Hangar Hoops** | Game Room | A 45-second shootout; the hoop rolls to a new spot after every make; far hoops are worth 3. |

**Each unit's practice game** is named in `hfq_data.js` (`practice:'gauges'`), and shows as the PRACTICE node on the Flight Path and the pill on the unit's route; a unit without one falls back to the first built game whose `learn` names it.

**Game XP:** the first play of each game is worth 15, and a new personal best 5. Game XP is capped at **40 a day**, so Ground School stays the fastest way up the phases. Each game's results screen links to the Ground School unit it practices.

**Adding a game:** copy any `hfq_g_*.js` file. Call `MG.start(this, id, a)` in `enter`, `if(MG.update(this, dt)) return;` first in `update`, `MG.end(this, score, {head, line})` when it's over, and `MG.hud(this, c, rightText, {sub, tip})` last in `draw`. Mark the game `built:1` in `H.GAMES`, add its `<script>` to `index.html`, and place a station with `go:{scene:'g_<id>'}` in `hfq_data.js`.

## Sound

Every sound is synthesized (`hfq_audio.js`), through the shell's AUDIO v1.2 hooks.

- **Music:** a title theme, one song for each place, and a games theme. Ground School always plays the calm classroom theme.
- **UI sounds,** all from the cockpit and the radio:
  - a push-to-talk click for taps;
  - a cabin chime for right answers;
  - a soft double-beep for misses;
  - a stall-horn buzz for locked things.
- **Flight sounds:** engine start, the takeoff roll, tire chirps, flybys, wind and radio calls. `AUDIO.morse('ABC')` plays a beacon ident.
- **Ambience:** each place has a sound bed (the Runway has a propeller idling). Ambience follows the MUSIC switch.

## Phases, XP and badges

**Academy phases** are the six books, three steps each:

| Phase | Starts at |
|---|---|
| *Balance Before Control* | 0 XP |
| *Crosswind Decisions* | 150 XP |
| *Weather Minimums* | 400 XP |
| *Cross-Country* | 800 XP |
| *Solo* | 1,300 XP |
| *Pilot in Command* | 2,000 XP (top step at 2,600) |

Phase names are academy stages, never a real certificate or rating.

**XP outside Ground School and games:**

| Action | XP |
|---|---|
| Enroll | 50 |
| A new place | 20 |
| Meeting a crew member | 25 |
| Opening a Ground School unit | 10 |
| Saving your look | 15 |
| Reading Hangar News | 5 |
| Finishing the first briefing | 20 |

**34 badges** (in `rendition.js` → `badges`; My Logbook shows them as medals):

- **Getting started:** ENROLLED, LOCKER READY, FIRST BRIEFING, AIRFIELD EXPLORER (all nine places), MET THE CREW, IN THE KNOW (Hangar News)
- **Ground School:** GROUND SCHOOL STUDENT, FIRST FLIGHT, GREASED IT, TAILWIND, FLIGHT DAYS, FIRST PATCH, ALREADY KNEW IT (tested out), GOLD WINGS, DISCOVERY GRAD, STUDENT GRAD, PRIVATE GRAD and TOP OF THE SKY (all patches in each stage), GROUND SCHOOL MASTER (every unit at GOLD)
- **The Library and practice:** PAGE ONE, BOOKWORM (8 quizzes), LIBRARIAN (every quiz), TRIVIA NIGHT REGULAR (10 rounds)
- **Aircraft and the radio:** MY TRAINER, ON FREQUENCY, SHARP EYES (10 spotted), HALL OF FLIGHT (all 45)
- **Games:** GAME ON, ARCADE ACE (8 games), GAME NIGHT REGULAR (17), CLUBHOUSE LEGEND (all 27)
- **The Flight Log:** LOGBOOK OPENED, FREQUENT FLYER (10 real flights)

## The look

FAA airfield colors (AC 150/5340-18 signs, AC 150/5340-30 lights):

- **Screens:** sign black with sign yellow, like a location sign.
- **Primary buttons:** black on yellow, like a direction sign.
- **Destructive buttons:** white on red, like a mandatory sign.
- **Info:** blue. **Success:** green.

The Runway has:

- numbers at both ends;
- a hold-short marking with its solid lines on the holding side;
- correct edge, threshold, end and apron lights.

The logo is still the placeholder.

## Kid-safety defaults

- Call signs only, with the hint "MAKE ONE UP - NOT YOUR REAL NAME".
- No photo upload. Aircraft photos are added by the developer, never by cadets.
- Everything stays on the device: lesson progress, aircraft, game scores.
- Hangar News is posted by the Family Lead only. Cadets can read it but not post.
- There's no free-text chat between cadets. The Crew Board writes itself from what cadets do, and kudos is one tap. Posting to Hangar News stays with the Family Lead.
- The Flight Log asks for no names (an instructor is "an instructor"), stays on the device, and the Crew Board only ever says "logged a flight".
- The tower's voice is the phone's own built-in speech; it can be turned off in Settings and nothing is sent anywhere.
- Ground School is tap-only (no typing), has no lives, and always lets a cadet finish. Lessons, test-outs and checkrides have no clock; the only timed rounds are the optional DRILL and FLIGHT TRIVIA. Checkrides say "PRACTICE CHECKRIDE • NOT AN FAA TEST".
- Games have no real-money or random-reward mechanics, and their XP is capped daily.


## Terms of Use and the join gate
`web/js/hfq_terms.js` holds the Terms (version in `H.TERMS.version`; bump it when the text changes and every household re-accepts at sign-in). The gate requires scrolling to the end. Acceptance is recorded on the device only. Hosting with visitor logs: `tools/hosting/README.md`.

## Architecture and build
See `ARCHITECTURE.md` (layout, rules, review findings, remaining debt). `node tools/build.js` makes a faster `dist/` for publishing (2 bundles instead of 100 files); the source in `web/` needs no build.
