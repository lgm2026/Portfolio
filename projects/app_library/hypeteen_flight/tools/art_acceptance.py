#!/usr/bin/env python3
"""Writes docs/ART_ACCEPTANCE.md, the acceptance record for the commissioned artwork, from docs/ART_INTEGRATION_LOG.json
   (the record tools/integrate_art.py keeps, including its triage of the illustrator's raw downloads), the illustrator's
   own asset_manifest.json (which says which files were exported from 512-px previews) and the app's badge mapping.
   Run: python3 -I tools/art_acceptance.py --delivery <dir>"""
import json, os, re, sys
from collections import Counter
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
args = sys.argv[1:]; DELIV = args[args.index('--delivery') + 1] if '--delivery' in args else None
J = json.load(open(os.path.join(ROOT, 'docs', 'ART_INTEGRATION_LOG.json'))); log = J['log']; raw = J.get('openart', [])
their = {}
if DELIV and os.path.exists(os.path.join(DELIV, 'asset_manifest.json')):
    for r in json.load(open(os.path.join(DELIV, 'asset_manifest.json')))['records']:
        their[r['asset'].replace('.png', '')] = r
soft = sorted(k for k, r in their.items() if r.get('upscaled'))
BRIEF = set(['screen-title', 'screen-hero'] + ['wall-' + k for k in ('lounge', 'gameroom', 'classroom', 'hangar', 'platform', 'tower', 'ramp', 'wash', 'runway')]
             + ['floor-' + k for k in ('lounge', 'gameroom', 'classroom', 'hangar', 'platform', 'tower', 'wash')] + ['tile-' + k for k in ('runway', 'hangar', 'lounge', 'classroom', 'tower', 'terminal', 'night')]
             + ['icon-' + k for k in ('path', 'lounge', 'class', 'hangar', 'flightbag', 'map', 'tower', 'crewboard', 'profile', 'achievements', 'settings')]
             + ['badge-' + k for k in ('firstflight', 'navigation', 'weather', 'radio', 'flightplanning', 'explorer', 'history', 'maintenance', 'jetops', 'mastercadet')])
slots = [l for l in log if l['asset'] in BRIEF]; extras = [l for l in log if l['asset'] not in BRIEF]
counts = Counter(l['action'] for l in slots); rawc = Counter(r['decision'] for r in raw); kinds = Counter(r.get('kind') for r in raw)
# the app's badge mapping: badge id -> art, and the badge names
lb = open(os.path.join(ROOT, 'web', 'js', 'hfq_logbook.js')).read()
amap = dict(re.findall(r"(\w+):'(\w+)'", lb[lb.index('const BADGE_ART={'):lb.index('};', lb.index('const BADGE_ART={'))]))
rd = open(os.path.join(ROOT, 'web', 'js', 'rendition.js')).read(); seg = rd[rd.index('"badges": ['):]
names = dict((m[0], m[1]) for m in re.findall(r'"id": "([a-z0-9_]+)",\s*"n": "([^"]+)"', seg))

out = []; A = out.append
A('# Art acceptance record: the commissioned artwork\n')
A('Two inputs, both measured against `docs/ART_GENERATION_BRIEF.pdf` (46 assets):\n')
A('1. **The delivery (2026-10-16)**, a PDF and a ZIP of PNGs: 44 of 46 files, every one at the exact pixel size and aspect asked for; `badge-firstflight` and `badge-navigation` missing. The illustrator\'s own manifest states that **%d of the 44 were exported from 512-px WebP previews and enlarged**, which does not recover detail; the other %d came from full-size originals (2048 to 6224 px).' % (len(soft), 44 - len(soft)))
A('2. **The raw downloads (2026-10-17)**, three ZIPs straight from the generator: %d files. %d are the full-size originals of files already delivered (exactly the %d that were not preview-based), %d are extra generations that were not delivered. **None of them is an original of the %d preview-based files**, so those still need re-exporting or regenerating (round 2).\n' % (len(raw), kinds.get('original', 0), 44 - len(soft), kinds.get('extra', 0), len(soft)))
A('Outcome in the app (r7.3), over the %d briefed slots: **%d accepted as delivered, %d fixed in-house, %d derived, %d replaced, %d rejected**, plus %d extra badge arts taken from the raw downloads. Every repair is mechanical (keying, cloning along the image\'s own structure, row-by-row continuation of plain wall or sky, recoloring, stitching) and is listed; nothing was repainted by hand or generated. Rejected slots keep their r7.1 art. Processing: `tools/integrate_art.py`; this record: `tools/art_acceptance.py`.\n' % (len(slots), counts.get('ACCEPTED', 0), counts.get('FIXED', 0), counts.get('DERIVED', 0), counts.get('REPLACED', 0), counts.get('REJECTED', 0), len(extras)))
A('## How it was checked\n')
A('- **Against the brief:** size, aspect, transparency, lettering (every letter read at full size), faces, brands, military marks, aviation plausibility (wing position, struts, gear, propeller, tail), age-appropriateness.')
A('- **In context:** every room rendered whole (`qa/shots/r7_3_rooms/`) with the app\'s own stations drawn over the painted wall. That check found painted objects that duplicated the app\'s own (a painted door beside the app\'s door, a painted bookshelf, screen, cork boards and trophy case peeking out beside the app\'s boards, a door behind the basketball hoop); all were painted out. Phone screens: `qa/shots/r7_3/`.\n')
A('## Per-slot decisions\n')
groups = [('Screens', 'screen-'), ('Room walls and skies', 'wall-'), ('Floors', 'floor-'), ('Hub scene tiles', 'tile-'), ('Navigation discs', 'icon-'), ('Badges', 'badge-')]
for title, pre in groups:
    rows = [l for l in slots + extras if l['asset'].startswith(pre)]
    if not rows: continue
    A('### %s\n' % title); A('| Asset | Source | Decision | Note |\n|---|---|---|---|')
    for l in rows:
        t = their.get(l['asset'], {})
        if t.get('upscaled'): src = '%dx%d preview, enlarged' % tuple(t['source_dimensions'])
        elif t.get('source_dimensions'): src = '%dx%d original' % tuple(t['source_dimensions'])
        elif 'raw downloads' in l['note']: src = '2048-px original (raw downloads)'
        else: src = 'not delivered'
        A('| `%s` | %s | **%s** | %s |' % (l['asset'], src, l['action'], l['note'].replace('|', '/')))
    A('')
if raw:
    A('## The raw downloads, file by file\n')
    A('%s.\n' % ', '.join('%d %s' % (v, k.lower()) for k, v in sorted(rawc.items())))
    A('| ZIP | File (openart-…) | Kind | Decision | What it is |\n|---|---|---|---|---|')
    for r in raw: A('| %s | `%s` | %s | **%s** | %s |' % (r['zip'], r['file'], r.get('kind', ''), r['decision'], r['note'].replace('|', '/')))
    A('')
A('## Which art each badge wears\n')
A('Thirty-three badges share fifteen arts; each badge gets the one that fits it. The mapping lives in `web/js/hfq_logbook.js` (`BADGE_ART`).\n')
by = {}
for bid, art in amap.items(): by.setdefault(art, []).append(names.get(bid, bid).title())
A('| Art | Badges |\n|---|---|')
for art in sorted(by): A('| `%s` | %s |' % (art, ', '.join(by[art])))
A('')
A('## What still needs the illustrator (round 2)\n')
A('1. **Full-size originals for the %d preview-based files**: %s. They are not in the raw downloads; the generator made the others at 2048 to 6224 px, so these should be re-exported or regenerated at full size.' % (len(soft), ', '.join('`%s`' % s for s in soft)))
A('2. **Redo** `tile-runway` (no lettering on the runway, no letterbox) and `tile-night` (no frame, no numbers, threshold lights green and red, not white), `icon-profile` (no face, no lettering), and `badge-firstflight` and `badge-navigation` as briefed (the app ships derived stand-ins).')
A('3. **Rules that were broken and must not recur:** lettering (a misspelled brand on the game-room machine, lettered roundels and discs); military insignia on civil aircraft (the star-and-bar roundel on the FBO trainer and on the apron panorama\'s aircraft); impossible aircraft (a third wheel on a tricycle trainer, a propeller in the middle of a fuselage, a framed aircraft with no wing); objects painted where the app draws its own (doors, boards, shelves, cases: keep the hatched zones plain); transparent backgrounds delivered on black or a baked checkerboard.\n')
A('The forwardable version is `docs/ART_ROUND2_CORRECTIONS.pdf`.\n')
open(os.path.join(ROOT, 'docs', 'ART_ACCEPTANCE.md'), 'w').write('\n'.join(out))
print('wrote docs/ART_ACCEPTANCE.md; slots', dict(counts), '; extras', len(extras), '; raw', dict(rawc), dict(kinds), '; preview-based:', len(soft))
