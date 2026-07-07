# -*- coding: utf-8 -*-
"""Rebrand the TerraHype engine to PaleoHype and inject the data blob."""
import re, json

src = open("base.html", encoding="utf-8").read()
orig_len = len(src)

def replace_block(text, anchor, close, repl, label):
    i = text.find(anchor)
    if i < 0:
        raise SystemExit("anchor not found: " + label)
    j = text.find(close, i)
    if j < 0:
        raise SystemExit("close not found: " + label)
    j += len(close)
    return text[:i] + repl + text[j:]

# 1-4 simple brand strings
subs = [
 (r'var STORE_KEY = "terrahype_nature_v1";', 'var STORE_KEY = "paleohype_v1";'),
 (r'var BRAND = "TerraHype Nature Conservation Education";',
  'var BRAND = "PaleoHype Dinosaurs & Prehistoric Life";'),
 (r'var BRAND_SHORT = "TerraHype";', 'var BRAND_SHORT = "PaleoHype";'),
 (r'var TAGLINE = "Bite-sized lessons for future nature conservationists";',
  'var TAGLINE = "Bite-sized lessons for future paleontologists";'),
]
for pat, repl in subs:
    if src.find(pat) < 0:
        raise SystemExit("brand string not found: " + pat)
    src = src.replace(pat, repl, 1)

# 5 LESSON_ART -> empty (all lessons carry their own art field)
src = replace_block(src, "var LESSON_ART = {", "};",
                    "var LESSON_ART = {};", "LESSON_ART")

# 6 TRACK_ART -> paleo art keys
track_art_line = ('var TRACK_ART = { foundations: "fossil", ecology: "excavation", '
                  'flora: "fern", fauna: "theropod", geology: "strata", '
                  'habitats: "volcano", conservation: "plesiosaur", methods: "museum" };')
src = replace_block(src, "var TRACK_ART = {", "};", track_art_line, "TRACK_ART")

# also update artFor fallback "forest" -> "fossil"
src = src.replace('  if (track && TRACK_ART[track]) return TRACK_ART[track];\n  return "forest";',
                  '  if (track && TRACK_ART[track]) return TRACK_ART[track];\n  return "fossil";', 1)

# 7-9 SOURCES / TRACKS / UNIT_PLAN from generated JS
SOURCES_JS = open("_sources.js").read()
TRACKS_JS  = open("_tracks.js").read()
UNIT_PLAN_JS = open("_unitplan.js").read()
src = replace_block(src, "var SOURCES = {", "\n};", SOURCES_JS, "SOURCES")
src = replace_block(src, "var TRACKS = [", "\n];", TRACKS_JS, "TRACKS")
src = replace_block(src, "var UNIT_PLAN = [", "\n];", UNIT_PLAN_JS, "UNIT_PLAN")

# ---- inject data blob into <script id="sea-data"> ----
blob = open("data_blob.json", encoding="utf-8").read()
m = re.search(r'(<script type="application/json" id="sea-data">)(.*?)(</script>)', src, re.S)
if not m:
    raise SystemExit("data script tag not found")
src = src[:m.start(2)] + blob + src[m.end(2):]

open("base.html", "w", encoding="utf-8").write(src)
print("structural rebrand + injection done")
print("len before:", orig_len, "after:", len(src))
