# App Shell

The framework from the **Raging Knights Mobile Clubhouse (V19)**, with the club taken out. It's a phone-first web app with:

- a welcome page;
- sign-in with a name and a 4-digit PIN, plus guest mode;
- a dashboard of cards;
- settings;
- a shared database;
- one working example module.

Everything that makes it *a particular app* lives in one file, `web/js/rendition.js`.

It is plain HTML, CSS and JavaScript, with no framework, no build step and no dependencies.

## What's in this folder

| Path | What it is |
|---|---|
| `web/` | The app. Open `index.html` through any web server. |
| `web/js/config.js` | Every default setting, documented. **Read it; don't edit it.** |
| `web/js/rendition.js` | **This copy's changes**, deep-merged over `config.js`. |
| `presets/` | Example renditions as JSON: `raging-knights/` (your look, rebuilt on the shell), `homestead/` (no sign-in, green, three cards) and `hfq/` (HypeTeen Flight Quarters: a walkable airfield with its own modules). |
| `tools/new_rendition.py` | Turns a preset JSON into a ready-to-run copy in one command. |
| `qa/smoke.js` | An end-to-end test of every screen (Playwright), with screenshots. |
| `PLAYBOOK.md` | The repeatable process: making renditions, adding modules, and how the shell was cut out of the clubhouse. |
| `PROMPT_STARTER.md` | A fill-in prompt for having Claude build a rendition or a module. |

## Making a rendition (the 3-minute version)

1. Copy `presets/homestead/preset.json` to a new file and edit it:
   - `id`
   - `name`
   - `theme` colors
   - `cards`
   - `pages`
2. Run `python3 tools/new_rendition.py path/to/preset.json ../my-app --zip`.
3. Run `cd ../my-app/web && python3 -m http.server 8777`, then open http://localhost:8777.

If you'd rather work by hand, copy the whole folder and edit `web/js/rendition.js` directly. The two methods give the same result.

## Running it

- **On your computer:** `cd web && python3 -m http.server 8777`. Without a shared database, the app keeps its data in a **local database** in the browser, so everything works on one device. The first account created on a device is that device's **owner**.
- **Live, as a claude.ai artifact:** publish `web/index.html` as the page, with every file under `js/` and `assets/` as supporting files at the same paths. Then declare these capabilities:

```json
{"db":{"rules":[{"path":"","read":"interact","write":"interact"}]},
 "user":{}}
```

The artifact's owner is the app's **owner** (`user.isOwner()`). To make a collection owner-write-only (like `config` or `officers` in the clubhouse), add a rule such as `{"path":"config","read":"interact","write":"owner"}`.

- **Other hosts:** `G.data` expects a Firestore-like object. See the top of `web/js/data.js`; the built-in `LocalDB` there is a complete reference implementation.

## How it's built

### Load order (`index.html`)

1. `config.js`
2. `rendition.js`
3. `theme.js`, which paints the welcome page from the config
4. core: `audio.js`, `engine.js`, `icons.js`, `ui_list.js`, `data.js`
5. screens: `accounts.js`, `dash.js`, `page.js`
6. modules: `mod_*.js`

### Core files

| File | Gives you |
|---|---|
| `engine.js` (`G`) | **Canvas:** 270 units wide, 480–600 tall, scaled to the phone. **Scenes and input:** scenes with fades, plus touch, mouse and keys. **Native fields:** real `<input>`, file and link elements laid over the canvas (`G.field`, `G.fileField`, `G.linkField`). **Draw kit:** `G.txt`, `G.para`, `G.button`, `G.panel`, `G.topBar`, `G.Modal`, `G.confirm`, `G.navList`, `G.listNav`, `G.seg`, `G.toggleDraw`, `G.chip`, `G.cover`, `G.backdrop`. **Saves:** per-account saves, toasts, points and badges. **Photos:** `G.photoFromFile`, `G.compressPhoto`. |
| `ui_list.js` (`G.CL`) | Scrolling lists of mixed rows (`CL.List`) and ready-made rows: `CL.hdr`, `CL.note`, `CL.text`, `CL.row`, `CL.action`, `CL.letter`. |
| `data.js` (`G.data`) | The shared database (claude.ai `db`, or local), plus `watch`, `add`, `remove`, `can(need)`, `isOwner` and `me`. |
| `audio.js` (`AUDIO`) | The 8-bit sequencer (songs are text grids), sound effects, and an optional streamed radio from `CONFIG.audio.radio`. |
| `icons.js` | 37 vector icons for `G.icon(name, ctx, x, y, size, color)`. The list is in `G.ICONS`. |
| `theme.js` | CSS colors, font, text and logo for the HTML welcome page. |

### Screens

| Scene | What it is |
|---|---|
| `title` | Log in, create account, or continue as guest. Skipped when `accounts.enabled:false`. |
| `login`, `signup` | Pick your name and enter your PIN; or enter a name, a PIN, and the PIN again. |
| `dash` | The card grid from `CONFIG.cards`. |
| `settings` | Photo, music, sound, reduced motion, data mode, log out and delete account. |
| `page` | Any `CONFIG.pages` entry as a scrolling text page with links. |
| `board` | **The example module:** live shared posts, a compose box, and author/owner delete. |
| `blank` | **The module template:** copy it to start a new screen. |
| `world` | **Walkable places** (`mod_world.js`, off by default): rooms, doors, people to talk to, tap-to-walk with pathfinding, and a tab bar between places. Add it with the preset's `_scripts` and set `homeScene:'world'`. The room format is documented at the top of the file. |

### Words, home and hooks (v1.1)

- **`CONFIG.words`:** every built-in label (LOG IN, CREATE ACCOUNT, PTS, GUEST...), so a rendition can talk its own way.
- **`CONFIG.homeScene`:** where people land after signing in. It's `'dash'` by default. When it's something else (like `'world'`), the dashboard becomes a quick menu whose BACK returns home.
- **Hooks a module can set:**

| Hook | What it does |
|---|---|
| `G.nameSuggest()` | Adds a suggest button to sign-up. |
| `G.afterSignup(acct)` | Runs after enrolling, e.g. to open an avatar builder. |
| `G.drawAcct(c,acct,x,y,d)` | Draws account pictures. |
| `G.playerAv()` | Your avatar in the world. |
| `G.onAward(pts)` | Runs after every award, e.g. to detect a rank-up. |

- **PIN reset:** the device owner gets RESET SOMEONE'S PIN in Settings. That person picks a new PIN at their next log-in.

### Tab bar, floating button and settings toggles (v1.3, from HypeTeen Flight Quarters round 4)

- **`mod_world.js`:** `G.WORLD.tabs` picks the tab bar: room keys and scene tabs (`{id, label, icon, scene, args, home:true}`; a `home` tab lights up in rooms without a tab of their own). `G.WORLD.fab = {label, icon, fn(roomKey)}` floats a button over every room (`fab:false` on a room hides it).
- **`accounts.js`:** `CONFIG.settingsToggles = [{id, label, def, on(v)}]` adds on/off rows to Settings; read them with `G.setting(id)`.
- **`icons.js`:** headset, map, tower, drop.
- **`mod_world.js`:** `G.WORLD.roomFx(c, R, phase, L)` draws in room space after the floor (`'floor'`) and after the people (`'over'`): light pools, vignettes, weather. People are drawn with shaded suits and soft shadows.

### Look, airfield parts and sound (v1.2, from HypeTeen Flight Quarters rounds 2–3)

- **More theme keys** in `config.js`, so a rendition can recolor everything (the defaults look the same as v1.1):
  - buttons: `btn`, `btnHi`, `btnLine`; `danger`, `dangerHi`, `dangerLine`, `dangerInk`; `success`, `successHi`, `successLine`, `successInk`;
  - the on-screen keyboard and PIN pad: `key`, `keyNum`, `keySpecial`, `keyPress`.
- **Airfield signs** in `mod_world.js`: a `sign` station or decor takes `sign:'location'|'info'|'direction'|'mandatory'`, drawn in FAA AC 150/5340-18 colors (location is the default).
- **Runways** (`runway:{y0,y1,num,lights,inset}`): numbers at both ends (the reciprocal is worked out), threshold bars at both ends, white edge lights, green/red threshold and end lights, and blue apron edge lights. `lights:false` turns the lights off; `inset` keeps the ends clear of side doors.
- **`G.icon('x')`:** a dismiss X. (`'close'` is still the two-people icon.)
- **List items keep their title** (`CL.hdr(...).t`, `CL.row(...).t`), so tests can read a list.
- **Sound hooks** in `audio.js`, so a rendition brings its own sound without editing the file:
  - `AUDIO.addSongs({...})` and `AUDIO.addJingles({...})` (same 16-step grid format as the built-in theme);
  - `AUDIO.addSfx(name, fn)` adds an effect, or replaces a built-in one such as `'blip'` or `'ok'`, so every UI tap changes at once;
  - `AUDIO.addAmbience(name, fn)` and `AUDIO.ambience(name|null)` give a looping sound bed that crossfades, follows MUSIC ON/OFF, and pauses while the page is hidden.
- **Rooms can set `music` and `ambience`** in `mod_world.js`. The world plays them on entry and stops the ambience on exit.

### Access levels

Cards (`need`) and the board (`post`) use these levels:

- `null`: everyone;
- `'member'`: signed in;
- `'owner'`: the artifact owner, or the first account on a device.

**Important:** like the clubhouse, privacy is enforced by what the app *chooses* to download, plus any owner-only database rules. On a real backend, enforce access on the server.

### v1.4: 3/4 dioramas (from HypeTeen Flight Quarters round 6)

Rooms are still described flat (x across, y = depth), and `G.V` projects them: the floor is sheared and compressed (`proj:{sh,kd}` per room, default .32/.8), the back wall stands upright, the right wall shows its inside (with any `side:'R'` doors cut into it), the left wall is a cut edge, and indoor rooms float on a slab with a drop shadow over a dark backdrop (`palette.back/back2/slab`). Outdoor rooms (`wallStyle` sky/open, or `outdoor:true`) get ground past the edges (`palette.ground`) and no walls. Floor art is called as `art(c, fp, h, col, s, wf)`: `fp` is the projected footprint (feet on the near edge, for upright sprites), `wf` the flat world footprint for volumes. The kit: `V.P/unP` (project/unproject a floor point), `V.fp(f)`, `V.plane(c,z,fn)` (draw in world units on the floor plane at height z), `V.box(c,f,h,col,{h0,rim,noEdge,topCol,frontCol,sideCol})`, `V.top/front/side` (face paths), `V.cyl`, `V.shadow(c,f,h,a)`, `V.sprite`. Built-in props (couch, table, desk, counter, bench, locker, crate, plant, cone, cart) are volumes; sign, scope, windsock, radio and plane are sprites. `toScreen(wx,wy,L,z)` takes world floor coordinates (plus a height); `toWorld` unprojects taps; `roomFx(c,R,'floor')` runs inside the floor plane. The camera centers on the player's column at mid-depth. The shell's own test still passes unchanged.

### v1.4.1: painted-art slots (`js/art.js`)

`G.ART` loads `assets/art/manifest.json` (missing is fine) and lets an image replace code art by key: `room:<key>:wall`, `room:<key>:floor`, `prop:<art>`, `station:<room>:<key>`, `decor:<room>:<art>`, `wall:<art>`, `npc:<id>`. An entry is a path or `{src,w,h,ax,ay}`. `G.ART.has/img/draw/sprite/person`; `G.ART.add({...})` at runtime. mod_world checks the slots before every wall, floor, prop and person it draws; a rendition adds its own keys the same way (Flight Quarters uses `ac:<id>` and `book:<id>`).

### v1.4.5: taps that hit what is drawn, notices a rendition can tier, keyboard hints (from HypeTeen Flight Academy round 7.4)

- **`mod_world.js`:** a tap is resolved against everything it touches (`hitThing`), front to back: people and floor stations by how near they stand, then side doors across their whole opening and height (`inDoor`), then wall stations; an art function may carry `bounds(p, h, s)` when it paints beyond its footprint (a parked aircraft answers wingtip to wingtip, `footBox`). A station is in reach anywhere along its front (`reachOf`), not only at its use point. `W.stickHint` may be a function answered per frame (show the resting stick only for touch input), `W.keyHints()` returns `{use, walk}` for a keycap on USE and a walk legend, and `this.walked` counts how far the walker has moved in the room by any means (a tutorial reads it).
- **`engine.js`:** `G.toast(msg, col, meta)` carries optional meta (`{kind:'xp'|'badge', ...}`); a rendition may install `G.drawNotices(ctx, dt)` to draw toasts its own way (tiers, a history) and `G.preUpdate(dt)` to take a frame's input first (a modal notice); `G.noticeSfx` tells the engine to leave badge sounds to it. `KeyE` maps to `use`.
- **`accounts.js`:** the title painting's plate stops just past the picture (`picFrac`, measured once from the image) and fades into the backdrop, so a portrait plate that ends in a flat pad never meets the backdrop in a hard line on tall phones.
- **`icons.js`:** a `heli` icon.

### v1.4.4: portraits and painted skies (from the HypeTeen Flight Quarters handoff build)

- `G.drawPortrait` frames the face: the head and shoulders fill the circle instead of the figure's middle, so no portrait cuts the top of the head.
- Outdoor rooms take a painted sky: `room:<key>:wall` now works outdoors too, drawn across the whole sky band (from 200 units left of the floor to past its right edge, `R.wall` tall). Indoors it is unchanged (the back wall, `R.w` × `R.wall`).

### v1.4.3: text that fits (from HypeTeen Flight Quarters round 6.3)

- `G.txt` / `G.txtO` with a `maxw`: text too wide for its space shrinks first (down to 80%, re-centered on its line) and only then narrows, so nothing reads squashed. Widths are cached per font and text.
- `G.topBar`: a title (or subtitle) too long to sit centered between BACK and the right-hand buttons moves into the free space beside BACK instead of being squeezed.
- The dashboard: a card subtitle too long for one line wraps to two when the card has room.

### v1.4.2: walking with a thumb-stick, USE, a map button (from HypeTeen Flight Quarters round 6.2)

Drag-to-walk and sliding are built in for every world (tap-to-walk still works beside them); the resting stick, the USE button, the map button and the round floating button are opt-in flags on `G.WORLD`.

- **The stick:** a press in the room that drags more than 10 px becomes a floating thumb-stick (`this.joy`: origin, knob, direction, distance); the walker moves the way it points, faster the further it is pushed. `stickHint:true` draws a resting stick bottom-left (a press there anchors the stick on it at once). A short tap still walks to the spot (pathfinding) or opens what was tapped, so tap-to-walk keeps working.
- **Sliding:** pushing into a desk or a wall slides along it instead of stopping: if the main direction is blocked, the walker slides along the edge the way the stick leans (or toward the nearer open end, `probeAxis`), and holds that slide with a little hysteresis so it does not jitter.
- **USE:** `useBtn:true` draws a round USE button bottom-right. It lights up (and the person or station in reach glows, with a small prompt over its head in place of the name tag) when `nearThing()` finds something; tapping it does what walking up and tapping would.
- **The map button:** `mapBtn:{label, icon, scene, args}` draws a round button top-right that opens that scene (Flight Quarters opens its airfield map as a pop-up over the room). `fab.round:true` (with `fab.short`) turns the floating button into a round one under it.
- **Labels stay readable:** a station label that would crowd the prompt over a person hides until you walk on, and a label or a name tag half off the screen edge slides back on.

### v1.3.1 (from HypeTeen Flight Quarters round 5)

- Station labels in a room are laid out in order; a label that would overlap an earlier one (same row, touching) steps up a row, up to four rows, so crowded walls stay readable.

## Tests

1. Serve `web/` on port 8777, or set `BASE_URL`.
2. Run `npm install playwright` (or use a global install).
3. Run `node qa/smoke.js`.

There are 23 checks:

- sign-up and the PIN, including a wrong PIN;
- owner detection;
- every card;
- posting and deleting on the board;
- the per-account save;
- settings and log out;
- locked cards;
- a mocked shared database with a non-owner guest.

Screenshots go to `qa/shots/`.
