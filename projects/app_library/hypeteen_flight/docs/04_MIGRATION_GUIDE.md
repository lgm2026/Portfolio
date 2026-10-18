# Migration guide: HypeTeen Flight Quarters r6.6 → HypeTeen Flight Academy r7.0

## For families (what changes on the device)

Nothing to do. Open the app once and every profile, lesson record, badge, flight and setting comes across. The first time, a restore point of the old data is saved automatically (Settings → Backup and restore → Restore points), and a one-time notice explains the new name. Then make a backup file: it is the only protection against a browser clearing site data.

## For the publisher (what the code does)

### Identifiers kept on purpose

| Legacy identifier | Status in r7 | Why |
|---|---|---|
| `localStorage` keys `hfq_roster_v1`, `hfq_acct_<id>`, `hfq_guest_v1`, `hfq_localdb_v1` (`CONFIG.id = 'hfq'`) | **kept** | Changing them would orphan every existing profile. Renaming is cosmetic; the key prefix is not user-facing. |
| IndexedDB `hfq_device_v1` | new in r7, legacy prefix | same reason |
| file names `hfq_*.js`, `G.HFQ` | **kept** | the architecture rule (`qa/structure_check.js`) and every test refer to them |
| the airport identifier `KHFQ` | **kept** (fictional) | the in-world field is now **Academy Field**; one constant, `H.FIELD`, carries name and identifier |
| `window.APP`, `G.*` globals | kept | engine |

### User-facing renames

Title, manifest, Terms (v1.1, re-acceptance not required: scope unchanged, name and backup section added), About, LICENSE, headers, build banner, the Flight Bag, toasts and the Hub all say **HypeTeen Flight Academy**. The imprint is **Hype Learning Academies**. The Terms and About pages keep one line "(formerly HypeTeen Flight Quarters)" so families recognize the app.

### Save schema v1 → v2 (additive)

Applied by `hfq_profile.js` on every load, logged into the verified record, preceded once per device by a raw restore point:

```
mod.v = 2
mod.rec     = {v:1, log:[]}          verified record (what the app witnessed, with provenance and mode)
mod.ui      = {}                     text size, reader and explorer preferences
mod.journal = {v:1, e:[], goals:[]}  self-reported experiences (the Flight Record's WHAT I DID / WHAT'S NEXT)
mod.visits  = {}                     Explorer visits (self-reported)
mod.read    = {}                     reader places and bookmarks per document
settings.hub = false                 Academy Hub mode is opt-in per profile
flog.e[*]  += {v:1, src:'app'|'self', cr, up}   flight-log entries gain version, source and timestamps
```

No field is removed or re-scored. Points, badges, stars, tiers, game bests and flight-log entries are exactly what they were; the `qa/hfq_r7_backup.js` K27 check migrates a crafted v1 save and asserts every value survives. Older app versions ignore the new fields (and would overwrite `mod.v`; keep the restore point until the whole household has moved).

### Progression

Six academy phases become seven: **The Sky We Share** starts at 2,900 XP (three steps to 3,800). Every existing threshold (0 / 150 / 400 / 800 / 1,300 / 2,000) is unchanged, so no cadet's phase or step moves. XP, badge and tier rules are unchanged; the registry (`docs/ACTIVITY_REGISTRY.md`) documents each.

### The Library

The canvas Library and reader are replaced by the HTML Library and e-reader. `lib.read`, `lib.quiz` and `lib.pos` (the chapter a cadet stopped on) are read and written unchanged, so every book position and quiz result carries over; the reader's own state (`mod.read`) is additional. The legacy scenes stay registered as `library_r6` / `book_r6` for one release and are not reachable from the UI.

### Hosting

Serve `dist/` with `tools/hosting/hfq-security-headers.conf` (strict CSP without `unsafe-eval`; content ships as data). The service worker (`sw.js`) precaches every file and updates by build id; the old r6.6 deployment had no service worker, so no stale cache can survive the upgrade.

### Rollback

A device: Settings → Backup and restore → Restore points → the "Before the r7 update" point (restores the exact r6.6 keys). A deployment: redeploy the r6.6 `dist/`; v2 fields are ignored and nothing is lost except r7-only records (Flight Record journal, reader bookmarks, Explorer visits), which remain in the save for when r7 returns.
