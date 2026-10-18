# Backup file format (`.htfa`)

A backup is one JSON file. Everything a family's progress needs is inside; nothing is ever sent anywhere. `hfq_backup.js` writes and reads it.

## Plain envelope (`format: "htfa-backup"`)

```json
{
  "format": "htfa-backup", "formatVersion": 1,
  "app": {"name": "HypeTeen Flight Academy", "version": "7.0.0", "build": "<build id or 'source'>"},
  "schema": 2, "created": "2026-10-16T20:57:01.568Z", "scope": "household" | "profile",
  "household": {"photos": false, "localdb": "<the shared Crew Board data as stored>"} | null,
  "profiles": [ {"id": "<canonical profile id>", "callsign": "DELTA", "roster": {...public roster fields...}, "save": {...the save exactly as stored...},
                 "media": [ {"id": "<media id>", "entry": "<journal entry id>", "type": "image/jpeg", "w": 1600, "h": 1200, "bytes": 123456, "sha256": "<hex>", "data": "<base64>"} ]} ],
  "manifest": [ {"path": "profiles/0/save", "bytes": 48213, "sha256": "<hex>"}, {"path": "profiles/0/media/0", ...} ],
  "integrity": {"alg": "SHA-256", "of": "canonical JSON of every field except integrity", "digest": "<hex>"}
}
```

- **Canonical JSON**: keys sorted recursively, no whitespace (`B.canon`). The integrity digest is SHA-256 of the canonical envelope with `integrity` removed; the manifest carries a digest per profile save and per photo.
- **The checksum detects corruption, not tampering.** There is no server and no signing key, so a file edited by someone who recomputes the digest is indistinguishable from a real one. The app says so on the Backup screen and in the Terms. Local achievements are an honest diary, not a certificate.
- **PINs** travel as the roster's salted hash (`pinH`), never in clear. A PIN keeps family members out of each other's profiles on one device; it is not authentication.

## Encrypted envelope (`format: "htfa-backup-encrypted"`)

```json
{"format": "htfa-backup-encrypted", "formatVersion": 1,
 "kdf": {"name": "PBKDF2", "hash": "SHA-256", "iterations": 600000, "salt": "<base64, 16 bytes>"},
 "cipher": {"name": "AES-GCM", "iv": "<base64, 12 bytes>", "tagLength": 128},
 "ciphertext": "<base64 of AES-GCM(plain envelope JSON)>"}
```

WebCrypto only (`crypto.subtle`), which needs a secure context (https or localhost); on plain http the option is hidden and the screen says why. No custom cryptography anywhere. A lost passphrase cannot be recovered.

## Import: what is checked, in order

1. Not empty; at most 60 MB of text (checked before parsing).
2. Valid JSON; `format` is one of ours; `formatVersion` and `schema` are not newer than this app (a clear "update the app first" message otherwise).
3. Integrity digest matches the canonical envelope.
4. 1 to 20 profiles. Each profile: id matches `[A-Za-z0-9_-]{1,64}`, call sign matches the app's call-sign rule, the save is **sanitized** (`__proto__`, `constructor`, `prototype` keys dropped; depth ≤ 12; strings ≤ 5,000 chars; arrays ≤ 20,000; ≤ 400,000 nodes; points clamped to 0..10,000,000; name ≤ 16 chars) and **checked** (`mod.v` not newer than this schema).
5. Media: ≤ 200 per profile, JPEG/PNG/WebP only, ≤ 11 MB base64 each, ids re-minted when not well-formed (so a path-like id never reaches storage). At restore time each photo must decode as an image, is re-encoded (≤ 1600 px, no EXIF) and its SHA-256 must match when given; anything else is skipped, never fatal.
6. Roster fields are copied by an allow-list with types; everything else in the roster is ignored.

Nothing shown from a backup is ever parsed as HTML (all text goes through `textContent`).

## Restore: preview, then merge or replace

- **Dry run first**: the preview names each profile in the file and whether it exists on this device. Choices per profile: add (new here), merge (default when it exists), replace, skip. Only the Family Lead may restore other cadets; a cadet may restore their own profile.
- **A restore point is written before anything changes** (IndexedDB, `snaps` store, up to 12 kept; Backup and restore > Restore points goes back to any of them; a new restore point of the current state is saved first).
- **All or nothing**: every key is written, read back and compared; on any failure (quota, blocked storage) all keys are put back exactly as they were and the screen says nothing changed.

### Merge rules (never sum scores)

| Section | Rule |
|---|---|
| `points` (XP) | the greater value |
| `ach` (badges) | union; the earliest date kept |
| `fl.l` (lesson records) | per lesson: a flown record beats a tested-out one; otherwise more stars; stars, best accuracy and runs each take the greater value |
| `fl.miss` | union |
| `lib.read` | union, earliest date; `lib.quiz` per book: best score, passed/aced OR-ed, plays = the greater count (never summed, so a merge cannot inflate attempts) |
| `games` | per game: best score (highest, or lowest for low-is-best games), plays = the greater count |
| `fl.drill`, `fl.trivia` | best score, gold OR-ed, plays = the greater count; `fl.streak`: the more recent streak, the greater best |
| `gs.done`, `gs.seen`, `world.visited`, `world.met`, `visits` | union, earliest date |
| `flog.e`, `journal.e`, `journal.goals` | union by `id`; the later `up` (updated) wins on a clash |
| `read` (reader places) | the further place wins; bookmarks united by chapter + position |
| `rec.log` (verified log) | union by (time, kind, activity), sorted by time, capped |
| `tut.done` | earliest |
| anything else | the device's value is kept; sections the device does not have are copied |

Duplicate activity ids across the two sides therefore never double-count: the best record wins and counts take the greater value rather than a sum.

## Schema migration

Saves carry `mod.v`. `1` is r6.6 (HypeTeen Flight Quarters). `2` is r7: adds `rec` (verified log), `ui`, `journal`, `visits`, `read`, `settings.hub`, and `v`/`src`/`cr`/`up` on flight-log entries. Migration is additive, logged in the verified record, and preceded by a restore point of the raw localStorage the first time a device sees v2. A brand-new save starts at v2 with nothing to migrate. Older versions of the app ignore the new fields.

## Storage, eviction, private windows

Saves live in `localStorage`; photos and restore points in IndexedDB (`hfq_device_v1`). The app asks for persistent storage (`navigator.storage.persist()`); the Backup screen reports whether storage is persistent or "can be cleared by the browser", how much is used, and whether photos and restore points are available (they are not in some private windows). The honest rule, stated in the app: a browser can clear site data and a device can be lost; the backup file is the only protection.
