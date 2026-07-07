# -*- coding: utf-8 -*-
"""PaleoHype master build: assembles the full data blob (501 lessons, queries,
species meta, units, supporting datasets, art) and writes data_blob.json,
plus prints the engine JS for SOURCES / TRACKS / UNIT_PLAN."""
import json, collections

import gen_core, expander, art_gen, support_data
import concepts_a as CA, concepts_b as CB, concepts_c as CC

# ----------------------------------------------------------------- 1. profiles
taxa = expander.load_all()                       # 426 expanded dicts
LESSONS = {}
QUERIES = {}
META = {}
prof_by_group = collections.OrderedDict()        # (track, classGroup) -> [keys in order]

for t in taxa:
    key, rec, meta, sci = gen_core.build_profile(t["key"], t)
    if key in LESSONS:
        raise SystemExit("DUPLICATE lesson id: " + key)
    LESSONS[key] = rec
    META[key] = meta
    if sci and sci.lower() != t["name"].lower():
        QUERIES[key] = sci
    prof_by_group.setdefault((t["track"], t["classGroup"]), []).append(key)

n_profiles = len(LESSONS)

# ----------------------------------------------------------------- 2. concepts
concept_groups = [
    CA.FOUNDATIONS, CA.GEOLOGY, CB.ECOLOGY, CB.HABITATS,
    CC.METHODS, CC.FLORA, CC.FAUNA,
]
concept_ids_by_track = collections.defaultdict(list)
for g in concept_groups:
    for L in g:
        cid = L["id"]
        if cid in LESSONS:
            raise SystemExit("concept id collides with profile: " + cid)
        rec = {
            "title": L["title"], "track": L["track"], "level": L.get("level", "Core"),
            "src": L["src"], "time": L.get("time", 4),
            "explain": L["explain"], "terms": L["terms"],
            "art": L["art"], "sources": L["sources"], "quiz": L["quiz"],
        }
        if "why" in L:  rec["why"] = L["why"]
        if "hook" in L: rec["hook"] = L["hook"]
        LESSONS[cid] = rec
        concept_ids_by_track[L["track"]].append(cid)

n_total = len(LESSONS)

# ----------------------------------------------------------- 3. concept UNIT_PLAN
# Hand-curated grouping of the 75 concept ids into ordered units (lives in engine).
UNIT_PLAN = [
 # Foundations
 ("u-found-1","foundations","Foundations","What Paleontology Is","Fossils, deep time and the study of ancient life",
   ["paleo-intro","what-is-fossil","deep-time"]),
 ("u-found-2","foundations","Foundations","Reading the Past","Naming, ordering and the great chapters of life",
   ["geologic-time-scale","three-eras-life","naming-dinosaurs"]),
 ("u-found-3","foundations","Foundations","What Makes a Dinosaur","Defining dinosaurs and their two great groups",
   ["what-is-dinosaur","saurischia-ornithischia"]),
 ("u-found-4","foundations","Core","Life, Change & Continents","Evolution, the tree of life and a shifting world",
   ["evolution-basics","tree-of-life","extinction-fact","pangaea"]),
 # Deep Time & Earth (geology)
 ("u-geo-1","geology","Core","Rocks & Dating","How rocks form, and how their age is read",
   ["reading-rocks","sedimentary-rock","dating-rocks","plate-tectonics"]),
 ("u-geo-2","geology","Core","Before the Dinosaurs","From earliest life to the great coal forests",
   ["precambrian","cambrian-explosion","age-of-fishes","coal-forests"]),
 ("u-geo-3","geology","Core","The Great Dying & the Mesozoic","The worst extinction and the dinosaur ages",
   ["great-dying","triassic-world","jurassic-world","cretaceous-world"]),
 ("u-geo-4","geology","Core","Extinctions & Climate","The asteroid, the Big Five and a cooling world",
   ["kpg-extinction","five-extinctions","ancient-climates","cenozoic-cooling"]),
 # Fossils & Fossil Hunting (ecology)
 ("u-foss-1","ecology","Foundations","How Fossils Form","The rare road from living thing to stone",
   ["how-fossil-forms","molds-casts","taphonomy","why-rare"]),
 ("u-foss-2","ecology","Core","Kinds of Fossils","Bones, tracks, amber and frozen giants",
   ["body-vs-trace","footprints-tracks","amber-fossils","frozen-mummified"]),
 ("u-foss-3","ecology","Core","Fossils & Time","Dating layers and windows of perfect preservation",
   ["index-fossils","how-old-fossil","lagerstatten"]),
 ("u-foss-4","ecology","Core","Finding & Digging","Hunting, excavating and preparing fossils",
   ["finding-fossils","excavating-dinosaur","fossil-prep"]),
 # Dinosaurs (fauna concepts)
 ("u-dino-1","fauna","Core","Meet the Dinosaurs","The first dinosaurs, the hunters and the giants",
   ["first-dinosaurs","meat-eaters","long-necks"]),
 ("u-dino-2","fauna","Core","Armour, Feathers & Flight","Defences, plates, horns and the road to birds",
   ["armour-and-horns","feathers-and-flight"]),
 ("u-dino-3","fauna","Core","How Dinosaurs Lived","Eggs, senses, herds and the range of sizes",
   ["eggs-and-babies","dino-senses","dino-herds","biggest-smallest"]),
 ("u-dino-4","fauna","Core","The End of the Dinosaurs","The day the asteroid struck",
   ["end-of-dinosaurs"]),
 # Prehistoric Plants & Invertebrates (flora concepts)
 ("u-early-1","flora","Core","The Dawn of Life","The first life and the burst of Cambrian animals",
   ["first-life","cambrian-animals"]),
 ("u-early-2","flora","Core","Greening the Land","Plants and the first forests conquer the land",
   ["plants-conquer-land","first-forests"]),
 ("u-early-3","flora","Core","Invertebrates & Insects","Life without backbones, and the rise of insects",
   ["life-without-backbones","insects-take-over"]),
 # Worlds of the Past (habitats)
 ("u-world-1","habitats","Core","Ancient Worlds","Cambrian seas, coal swamps and Permian deserts",
   ["cambrian-seas","coal-swamp-world","permian-desert"]),
 ("u-world-2","habitats","Core","Worlds of the Dinosaurs","Jurassic plains, Cretaceous forests and ancient seas",
   ["jurassic-floodplain","cretaceous-forest","mesozoic-seas"]),
 ("u-world-3","habitats","Core","After the Dinosaurs","The age of mammals, the Ice Age and living fossils",
   ["age-of-mammals-world","ice-age-world","living-fossils"]),
 # Doing Paleontology (methods)
 ("u-doing-1","methods","Core","The Science of Fossils","What paleontologists do, its history and famous sites",
   ["what-paleontologists-do","history-paleontology","famous-sites"]),
 ("u-doing-2","methods","Core","Bringing Fossils to Life","How we know how dinosaurs looked, ran and grew",
   ["how-we-know-looks","warm-or-cold","size-and-speed"]),
 ("u-doing-3","methods","Core","Living Dinosaurs & Careers","Birds as dinosaurs, and how to join the field",
   ["dinosaurs-not-extinct","careers-paleo"]),
]

# sanity: every concept id appears exactly once in UNIT_PLAN
planned = []
for u in UNIT_PLAN: planned.extend(u[5])
all_concept_ids = [L["id"] for g in concept_groups for L in g]
assert sorted(planned) == sorted(all_concept_ids), "concept UNIT_PLAN mismatch"

# ------------------------------------------------- 4. profile units (UNITS_EXTRA)
CLASS_UNIT_TITLE = {
 "earlydino":"The First Dinosaurs","theropod":"Meat-Eating Dinosaurs","sauropod":"Long-Necked Giants",
 "stegosaur":"Plated Dinosaurs","ankylosaur":"Armoured Dinosaurs","ceratopsian":"Horned Dinosaurs",
 "pachy":"Bone-Headed Dinosaurs","ornithopod":"Duck-Bills & Ornithopods",
 "synapsid":"Proto-Mammals","archosaur":"Crocodile-Line Reptiles","pterosaur":"Flying Reptiles",
 "marine":"Sea Reptiles & Sea Monsters","fish":"Prehistoric Fish","shark":"Prehistoric Sharks",
 "amphibian":"Early Amphibians","mammal":"Prehistoric Mammals","bird":"Prehistoric Birds",
 "human":"Human Origins","ediacaran":"The Earliest Animals","trilobite":"Trilobites",
 "arthropod":"Ancient Arthropods","invert":"Ancient Invertebrates","plant":"Prehistoric Plants",
}
TRACK_ORDER = ["fauna","conservation","flora"]
CLASS_ORDER = {
 "fauna":["earlydino","theropod","sauropod","stegosaur","ankylosaur","ceratopsian","pachy","ornithopod"],
 "conservation":["synapsid","archosaur","pterosaur","marine","fish","shark","amphibian","mammal","bird","human"],
 "flora":["ediacaran","trilobite","arthropod","invert","plant"],
}
ROMAN = ["I","II","III","IV","V","VI","VII","VIII","IX","X"]

def chunk(lst, n):
    out = []
    for i in range(0, len(lst), n):
        out.append(lst[i:i+n])
    return out

UNITS_EXTRA = []
uctr = 0
for track in TRACK_ORDER:
    for cg in CLASS_ORDER[track]:
        keys = prof_by_group.get((track, cg), [])
        if not keys:
            continue
        parts = chunk(keys, 8)
        for idx, part in enumerate(parts):
            uctr += 1
            base = CLASS_UNIT_TITLE.get(cg, cg.title())
            title = base if len(parts) == 1 else base + " " + ROMAN[idx]
            UNITS_EXTRA.append({
                "id": "u-sp-" + str(uctr),
                "title": title,
                "subtitle": "Real species, when they lived and what set them apart",
                "track": track,
                "level": "Core",
                "ids": part,
            })

# every profile must appear exactly once across UNITS_EXTRA
placed = []
for u in UNITS_EXTRA: placed.extend(u["ids"])
assert sorted(placed) == sorted(QUERIES.keys() | (set(LESSONS) - set(all_concept_ids))) or \
       len(placed) == n_profiles, "profile units coverage mismatch"
assert len(placed) == n_profiles and len(set(placed)) == n_profiles, "profile units not 1:1"

# ----------------------------------------------------------------- 5. art + blob
SEA_ART = art_gen.build_art()

blob = {
 "__SEA_LESSONS__": LESSONS,
 "__SEA_UNITS_EXTRA__": UNITS_EXTRA,
 "__SEA_QUERIES__": QUERIES,
 "__SEA_GLOSSARY__": support_data.GLOSSARY,
 "__SEA_PRON__": support_data.PRON,
 "__SEA_TAXONOMY__": support_data.TAXONOMY,
 "__SEA_CONCEPTS__": support_data.CONCEPTS,
 "__SEA_CAREERS__": support_data.CAREERS,
 "__SEA_HISTORY__": support_data.HISTORY,
 "__SEA_MILESTONES__": support_data.MILESTONES,
 "__SEA_MARVELS__": support_data.MARVELS,
 "SEA_ART": SEA_ART,
 "__SEA_SHELLS__": support_data.FOSSILS,
 "__SEA_PHOTOS__": {},
 "__SEA_PHOTO_CREDITS__": [],
 "__SEA_SPECIES_META__": META,
}

with open("data_blob.json", "w", encoding="utf-8") as f:
    json.dump(blob, f, ensure_ascii=False, separators=(",", ":"))

# ----------------------------------------------------------------- 6. engine JS
# SOURCES dict (paleo)
src_lines = []
for k, v in gen_core.SRC.items():
    src_lines.append('  %s: { label: %s, url: %s }' % (k, json.dumps(v["label"], ensure_ascii=False), json.dumps(v["url"])))
SOURCES_JS = "var SOURCES = {\n" + ",\n".join(src_lines) + "\n};"

# TRACKS dict (relabeled, same tint keys)
TRACKS = [
 ("foundations","Foundations","sky","Fossils, deep time, evolution and what makes a dinosaur."),
 ("ecology","Fossils & Fossil Hunting","green","How fossils form, and how they are found and prepared."),
 ("flora","Prehistoric Plants & Invertebrates","teal","Early life, plants, insects and animals without backbones."),
 ("fauna","Dinosaurs","coral","The dinosaurs themselves, from tiny hunters to giants."),
 ("geology","Deep Time & Earth","sand","Rock layers, dating, moving continents and extinctions."),
 ("habitats","Worlds of the Past","violet","The environments of each age, from ancient seas to the Ice Age."),
 ("conservation","Other Prehistoric Animals","amber","Sea reptiles, pterosaurs, mammals, early humans and more."),
 ("methods","Doing Paleontology","magenta","How fossils are studied — and how to join the field."),
]
track_lines = []
for tid, label, tint, blurb in TRACKS:
    track_lines.append('  { id: %s, label: %s, tint: %s, blurb: %s }'
        % (json.dumps(tid), json.dumps(label), json.dumps(tint), json.dumps(blurb)))
TRACKS_JS = "var TRACKS = [\n" + ",\n".join(track_lines) + "\n];"

# UNIT_PLAN (concept units)
up_lines = []
for uid, track, level, title, subtitle, ids in UNIT_PLAN:
    up_lines.append('  { id: %s, track: %s, level: %s, title: %s, subtitle: %s, ids: %s }'
        % (json.dumps(uid), json.dumps(track), json.dumps(level), json.dumps(title),
           json.dumps(subtitle), json.dumps(ids)))
UNIT_PLAN_JS = "var UNIT_PLAN = [\n" + ",\n".join(up_lines) + "\n];"

with open("_sources.js","w") as f: f.write(SOURCES_JS)
with open("_tracks.js","w") as f: f.write(TRACKS_JS)
with open("_unitplan.js","w") as f: f.write(UNIT_PLAN_JS)

# ----------------------------------------------------------------- report
import os
print("profiles:", n_profiles)
print("concepts:", n_total - n_profiles)
print("TOTAL lessons:", n_total)
print("queries (sci names):", len(QUERIES))
print("species meta:", len(META))
print("concept units:", len(UNIT_PLAN))
print("profile units:", len(UNITS_EXTRA))
print("art scenes:", len(SEA_ART))
print("data_blob.json bytes:", os.path.getsize("data_blob.json"))
# verify every lesson art key resolves
artkeys = set(SEA_ART.keys())
missing_art = sorted({L["art"] for L in LESSONS.values() if L.get("art") and L["art"] not in artkeys})
print("lesson art keys missing from SEA_ART:", missing_art)
# verify every lesson is in some unit
inunits = set(planned) | set(placed)
orphans = sorted(set(LESSONS) - inunits)
print("orphan lessons (in no unit):", len(orphans), orphans[:8])
