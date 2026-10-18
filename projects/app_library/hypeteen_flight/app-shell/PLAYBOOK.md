# Playbook: making renditions, again and again

The shell separates **framework** (same in every copy) from **rendition** (what makes a copy different). Every step below keeps that line clean, so the shell stays reusable.

```
FRAMEWORK (never edit per rendition)        RENDITION (one per app)
  engine.js  ui_list.js  data.js              js/rendition.js   <- name, colors, cards, pages, settings
  audio.js   icons.js    theme.js             assets/            <- logo, backdrop, songs
  accounts.js  dash.js  page.js               js/mod_*.js        <- the app's own screens
  config.js (the defaults)                    index.html         <- one <script> line per module
```

## 1. A new rendition

Work through these in order. Each step is small, and the app runs after every one.

1. **Identity.** Pick a new `id` (lowercase, unique), `name`, `subtitle`, `tagline`, `blurb`, `welcome`, `startLabel` and `pageTitle`.
   - The `id` keeps one rendition's accounts and data separate from another's on the same phone.
2. **Look.** Set `theme` (the color list is in `config.js`) and `font`. Set `assets`, `logo` and `backdrop`; a PNG or an SVG with a width and height set both work.
   - Start from the 5 accent colors:
     - `accent` for borders;
     - `accentHi` and `accentLo` for the gradient;
     - `accentText` for icons and ghost text;
     - `onAccent` for text on the button.
3. **Who gets in.** Set `accounts.enabled`, `accounts.guest`, `accounts.nameLabel` ("ROAD NAME", "CALL SIGN"…) and `accounts.photo`.
4. **The home screen.** Set `cards`: each opens a `scene`, a `page` or an `href`, with an optional `need`.
   - With 2–6 cards, the grid is 2 columns; with more, it's 3.
5. **Words-only screens.** Write them in `pages`, so no code is needed for About, Rules, FAQ or Contact.
6. **Real features.** Build each one as a module (section 2).
7. **Check it.** Run `qa/smoke.js`. Add a check for each new module, and look at the screenshots.
8. **Ship it.**
   - **As a zip:** run `tools/new_rendition.py … --zip`.
   - **Live as a claude.ai artifact:** use the capabilities in `README.md`.

**The fast path:** steps 1–5 are all in one JSON preset, and `tools/new_rendition.py` applies them. Keep each rendition's preset next to its art, as `presets/<name>/`. A rendition's own code also lives there: list each file under `_files` (to copy it in) and `_scripts` (to load it). You can then rebuild any rendition from the latest shell by running the tool again; this is how shell fixes reach every copy.

## 2. A new module (a feature)

1. Copy `js/mod_blank.js` to `js/mod_<name>.js` and rename the scene.
   - For anything that lists shared records, copy `js/mod_board.js` instead.
2. Add `<script src="js/mod_<name>.js"></script>` under *modules* in `index.html`.
3. Add a card that opens it: `{id, label, sub, icon, scene:'<name>', need}`.
4. Use these patterns, already proven in the clubhouse:
   - **Lists:** `CL.List` with items built each frame. Use `CL.row` for tappable rows and `CL.text` for paragraphs.
   - **Typing:** a native `G.field` (the phone's own keyboard). Use `multiline:true` for long text and `digits:true` for numbers.
   - **Photos:** `G.fileField` and `G.compressPhoto`. Keep each photo under about 190 KB.
   - **Shared data:** `G.data.watch` (unsubscribe in `exit`), `G.data.add` and `G.data.remove`. Put one collection per kind of record.
   - **Per-person data:** `G.save.mod.<name>`, then `G.persist()`.
   - **Confirm anything destructive:** `G.confirm({...})`. Hide native fields while a modal is open (`G.hideFields(true)`).
   - **Live dashboard hints:** `G.cardSub[id] = () => '3 NEW'` and `G.cardBadge[id] = () => n`.
5. Follow the scene rules at the top of `mod_blank.js`:
   - read input in `update`;
   - draw in `draw`;
   - draw the top bar last;
   - drop subscriptions in `exit`.
6. **Places instead of a menu:** for an app people walk around in, turn on `mod_world.js`. Describe the rooms in a data file (`G.WORLD`), and add custom wall or floor art through `G.worldArt`. `presets/hfq/` is the worked example.
7. **Reusing it:** a module that two renditions want lives in the shell's `js/`. A module only one rendition wants lives with that rendition. Use the preset's `_modules` list to choose which ones a copy keeps.

## 3. How this shell was cut out of the clubhouse (repeat for any app)

This is the extraction method, so you can turn another finished app into a shell the same way.

1. **Inventory.** List every file and what it does. The clubhouse README table was the map.
2. **Sort each file into one of four bins:**

| Bin | Clubhouse examples | What happened |
|---|---|---|
| **Core**: no club knowledge | `engine.js`, the list kit, the audio sequencer, icons | kept and generalized |
| **Pattern**: generic idea, club-specific details | accounts + PIN, the dashboard, settings, the db connect | rewritten small, driven by config |
| **Example**: one feature kept as a working reference | announcements and chat became `mod_board.js` | kept one, simplified |
| **Content**: the app itself | story, games, roster, positions, battalions, B4L, rides, photos, songs | removed |

3. **Find every hard-coded identity and lift it into config:**
   - **Names and text:** title, tagline, welcome page.
   - **Colors:** every `#f07818`-style literal became `G.C.*` or `--css-var`.
   - **Storage keys:** `rka_*` became `CONFIG.id + '_*'`.
   - **The PIN salt:** now `CONFIG.id`.
   - **Assets:** now `CONFIG.assets`.
   - **Music:** now `CONFIG.audio`.
   - **Dashboard cards:** now `CONFIG.cards`.
   - **Access rules:** now `need` levels.
4. **Cut the cross-links.** The clubhouse's core called club code (`G.club`, `G.isInfo`, battalion helpers, story events). Each call was either removed or turned into a hook that modules fill in (`G.cardSub`, `G.cardBadge`, `G.data`).
5. **Give it a fallback.** The shell must run with nothing attached, so `data.js` got `LocalDB`. It has the same API as the shared database and lives in the browser.
6. **Prove it's empty and still works.** The smoke test runs every screen, then two very different presets are built from the same shell. If a rendition needs a framework edit, the framework isn't general enough yet: fix the shell, not the copy.
7. **Write down the line.** The table at the top of this playbook *is* the line between framework and rendition. Keep it true.

**What was left out on purpose**, and can be carried over from the clubhouse zip when a rendition needs it:

| Feature | Clubhouse files |
|---|---|
| Rider/avatar builder | `avatar.js` |
| Approvals + roster | `club.js`, `roster.js`, `admin.js` |
| Chat + polls | `chat.js` |
| Events calendar | `horizon.js` |
| Photo album | `photos.js` |
| Ride log | `ridelog.js` |
| Games | `scenes_*.js`, `game_*.js` |
| Offline song renderer | `music/` |

Each of those files expects `G.club`, so porting one means pointing its database calls at `G.data.db` and its colors at `G.C`.
