# -*- coding: utf-8 -*-
"""Phase 2 rebrand: meta tags, boot splash, welcome/about copy, badges,
arcade themes, and a full paleontology rewrite of the ordering minigames."""
import re, json

src = open("base.html", encoding="utf-8").read()

def must_replace(old, new, label, count=1):
    global src
    if src.count(old) < count:
        raise SystemExit("MISSING (%s): %r" % (label, old[:80]))
    src = src.replace(old, new, count)

# ---------------------------------------------------------------- meta + title
meta_subs = [
 ('<meta name="description" content="TerraHype Nature Conservation Education — free, offline, bite-sized lessons in nature and conservation with sourced facts." />',
  '<meta name="description" content="PaleoHype Dinosaurs & Prehistoric Life — free, offline, bite-sized lessons in dinosaurs, fossils and prehistoric life with sourced facts." />'),
 ('<meta name="apple-mobile-web-app-title" content="TerraHype" />',
  '<meta name="apple-mobile-web-app-title" content="PaleoHype" />'),
 ('<meta property="og:title" content="TerraHype Nature Conservation Education" />',
  '<meta property="og:title" content="PaleoHype Dinosaurs & Prehistoric Life" />'),
 ('<meta property="og:description" content="A free, fun-but-formal way to learn nature conservation: 200+ sourced lessons, XP, an arcade, and a full reference library." />',
  '<meta property="og:description" content="A free, fun-but-formal way to learn about dinosaurs and prehistoric life: 500+ sourced lessons, XP, an arcade, and a full reference library." />'),
 ('<meta property="og:site_name" content="TerraHype" />',
  '<meta property="og:site_name" content="PaleoHype" />'),
 ('<meta name="twitter:title" content="TerraHype Nature Conservation Education" />',
  '<meta name="twitter:title" content="PaleoHype Dinosaurs & Prehistoric Life" />'),
 ('<title>TerraHype Nature Conservation Education</title>',
  '<title>PaleoHype Dinosaurs & Prehistoric Life</title>'),
]
for o, n in meta_subs:
    must_replace(o, n, "meta")

# also any twitter:description if present
src = src.replace('learn nature conservation', 'learn about prehistoric life')

# ---------------------------------------------------------------- boot splash
must_replace('alt="TerraHype Nature Conservation Education" width="118" height="118"',
             'alt="PaleoHype Dinosaurs & Prehistoric Life" width="118" height="118"', "splash-alt")
must_replace('<span id="sea-btnlabel">Preparing TerraHype…</span>',
             '<span id="sea-btnlabel">Preparing PaleoHype…</span>', "splash-btn")
must_replace('W.localStorage.getItem("terrahype_nature_v1")',
             'W.localStorage.getItem("paleohype_v1")', "splash-key")
must_replace('returning ? "Enter TerraHype" : "Start exploring"',
             'returning ? "Enter PaleoHype" : "Start exploring"', "splash-enter")

# ---------------------------------------------------------------- welcome copy
must_replace(
 '"Welcome to TerraHype! Explore the wild land in short lessons — from towering trees and wildflowers to bears, owls, and the rocks beneath your feet. Each lesson ends with a quick quiz so the cool facts stick. It\'s free, works offline, and stays on your device."',
 '"Welcome to PaleoHype! Explore the prehistoric world in short lessons — from towering dinosaurs and ancient seas to fossils, deep time, and the creatures that came long before us. Each lesson ends with a quick quiz so the cool facts stick. It\'s free, works offline, and stays on your device."',
 "welcome")

# ---------------------------------------------------------------- about copy
must_replace(
 '"TerraHype\'s facts are drawn from established nature, ecology and conservation references and link to these authoritative organizations. Open any to explore further. Species photos load live from Wikimedia Commons \\u2014 tap the \\u201cWikimedia\\u201d tag on any photo for its source page and image credits."',
 '"PaleoHype\'s facts are drawn from established paleontology, geology and natural-history references and link to these authoritative organizations. Open any to explore further."',
 "about")

# ---------------------------------------------------------------- badge tweak
must_replace('title: "Field Naturalist", desc: "Master 100 species"',
             'title: "Field Paleontologist", desc: "Master 100 species"', "badge")

# ---------------------------------------------------------------- arcade themes
# Re-theme player-facing title/tag/desc only (ids and mechanics untouched).
arcade = {
 "pong":     ('Fossil Pong',        'Arcade',   'Volley a fossil past the raptor.'),
 "breaker":  ('Boulder Breaker',    'Arcade',   'Smash the rock wall with a bouncing stone.'),
 "jelly":    ('Pterosaur Glide',    'Action',   'Glide a pterosaur through gaps in the cliffs.'),
 "plastic":  ('Fossil Rescue',      'Action',   'Catch the falling fossils, dodge the rubble.'),
 "snake":    ('Trilobite Trail',    'Classic',  'Grow your trilobite by grazing the sea floor.'),
 "memory":   ('Fossil Memory',      'Brain',    'Match pairs of prehistoric creatures.'),
 "invaders": ('Meteor Storm',       'Shooter',  'Blast the falling space rocks.'),
 "turtle":   ('Dino Crossing',      'Classic',  'Guide the little dinosaur across the river.'),
 "crab":     ('Egg Catch',          'Action',   'Catch the dinosaur eggs, dodge the rocks.'),
 "kelp":     ('Cliff Climber',      'Action',   'Bounce up the towering ancient cliffs.'),
 "octo":     ('Meteor Dodge',       'Survival', 'Survive the falling meteors.'),
 "seahorse": ('Raptor Sprint',      'Runner',   'Weave through three lanes.'),
 "anchor":   ('Rockslide',          'Shooter',  'Blast tumbling rocks on the mountainside.'),
 "pearl":    ('Cave Crawler',       'Action',   'Crawl deep for fossils before your lamp fades.'),
 "runner":   ('Dig Site Dash',      'Runner',   'Race across the dig site, dodge the boulders.'),
 "bubblepop":('Ammonite Pop',       'Tap',      'Tap as many ammonites as you can.'),
 "tetris":   ('Strata Stacker',     'Puzzle',   'Stack rock layers and clear lines.'),
 "match3":   ('Fossil Match',       'Puzzle',   'Swap to line up three matching fossils.'),
 "sonar":    ('Dino Call Says',     'Brain',    'Repeat the dinosaur call sequence.'),
 "t2048":    ('Evolve 2048',        'Puzzle',   'Merge cells to evolve toward a dinosaur.'),
 "sweeper":  ('Fossil Dig',         'Brain',    'Uncover fossils, avoid the unstable rock.'),
 "lights":   ('Lava Lights',        'Brain',    'Switch off every glowing lava vent.'),
 "reefq":    ('Time Trial',         'Quiz',     'Fast-fire questions from every lesson.'),
 "weboflife":('Web of Life',        'Relate',   'Pick the right link: who ate whom, who lived where.'),
 "sortkind": ('Sort by Kind',       'Sort',     'Is it a dinosaur, a pterosaur, a fossil? Sort each one.'),
 "zoneq":    ('Topic Sorter',       'Sort',     'Match each term to its branch of paleontology.'),
}
for gid, (title, tag, desc) in arcade.items():
    m = re.search(r'(id: "%s", title: )"([^"]*)"(, tag: )"([^"]*)"(, desc: )"([^"]*)"' % re.escape(gid), src)
    if not m:
        raise SystemExit("arcade game not found: " + gid)
    new = '%s%s%s%s%s%s' % (m.group(1), json.dumps(title), m.group(3),
                            json.dumps(tag), m.group(5), json.dumps(desc))
    src = src[:m.start()] + new + src[m.end():]

# arcade help strings that mention nature
must_replace("Catch falling litter in your bag. Don't grab the wildlife!",
             "Catch the falling fossils in your bag. Don't grab the loose rubble!", "arcade-help-plastic")

# ---------------------------------------------------------------- SEQUENCES
SEQ = [
 # Foundations — deep time & classification
 ("seq-eras","foundations","Order the great chapters of life from oldest to newest.",
  ["Precambrian","Paleozoic Era","Mesozoic Era","Cenozoic Era"],
  "Life ran from the long Precambrian, through the Paleozoic and Mesozoic, into today's Cenozoic."),
 ("seq-timeunits","foundations","Order these time spans from the longest to the shortest.",
  ["Eon","Era","Period","Epoch"],
  "Geologic time nests from huge eons down to eras, periods and shorter epochs."),
 ("seq-classify","foundations","Order the levels of classification from broadest to most specific.",
  ["Kingdom","Phylum","Class","Order","Species"],
  "Living things are sorted from broad kingdoms down to a single species."),
 ("seq-historyline","foundations","Order these moments from oldest to most recent.",
  ["Earth forms","First life appears","Cambrian explosion","Age of dinosaurs","First humans"],
  "From Earth's birth to the first life, the Cambrian, the dinosaurs and finally humans."),
 # Fossils & Fossil Hunting (ecology)
 ("seq-fossilform","ecology","Order how a fossil forms.",
  ["An animal dies","Buried in sediment","Minerals replace the bone","Rock layers build above","Erosion reveals it"],
  "Quick burial, then permineralization, then later erosion brings the fossil to light."),
 ("seq-excavate","ecology","Order the steps of excavating a dinosaur.",
  ["Find the bone","Map and photograph it","Remove the surrounding rock","Wrap it in a plaster jacket","Carry it to the lab"],
  "Record the bone in place, free it carefully, jacket it, then transport it."),
 ("seq-prep","ecology","Order how a fossil is prepared in the lab.",
  ["Open the field jacket","Remove rock with fine tools","Glue broken pieces","Study and measure","Put it on display"],
  "Preparators free the fossil grain by grain before it can be studied or mounted."),
 ("seq-taphonomy","ecology","Order what happens to most animals after death (very few fossilise).",
  ["An animal dies","Scavengers feed on it","Bones scatter","Most remains rot away","A rare few are buried and fossilise"],
  "Taphonomy: nearly everything is lost, so only a rare buried few become fossils."),
 # Prehistoric Plants & Invertebrates (flora)
 ("seq-riseoflife","flora","Order the rise of life from earliest to latest.",
  ["Single cells","First animals","Life moves onto land","First forests","Flowering plants"],
  "Life grew from single cells to animals, then conquered land and finally flowered."),
 ("seq-plantsland","flora","Order how plants conquered the land.",
  ["Algae in water","First tiny land plants","Plants with roots and stems","First trees","Vast forests"],
  "Plants crept ashore, evolved roots and stems, then grew into the first forests."),
 ("seq-photosyn","flora","Order the steps of photosynthesis.",
  ["Sunlight is captured","Carbon dioxide and water combine","Sugar (food) is made","Oxygen is released"],
  "Plants catch light, combine carbon dioxide and water into sugar, and release oxygen."),
 ("seq-plantgroups","flora","Order these plant groups by when they first appeared.",
  ["Mosses","Ferns","Conifers","Flowering plants"],
  "Simple mosses came first, then ferns, then cone-bearing conifers, then flowering plants."),
 # Dinosaurs (fauna)
 ("seq-classtrex","fauna","Classify Tyrannosaurus from broad to specific.",
  ["Animal","Dinosaur","Theropod","Tyrannosaurus"],
  "Tyrannosaurus is an animal, a dinosaur, a theropod, and finally its own kind."),
 ("seq-dinolife","fauna","Order a dinosaur's life, from egg onward.",
  ["Egg laid in a nest","Egg hatches","Hatchling","Juvenile","Adult dinosaur"],
  "Like birds, dinosaurs hatched from eggs and grew from hatchling to adult."),
 ("seq-dinoages","fauna","Order these dinosaurs from the earliest period to the latest.",
  ["Coelophysis (Triassic)","Stegosaurus (Jurassic)","Iguanodon (Early Cretaceous)","Triceratops (Late Cretaceous)"],
  "The dinosaurs span the Triassic, Jurassic and Cretaceous, in that order."),
 ("seq-classtri","fauna","Classify Triceratops from broad to specific.",
  ["Animal","Dinosaur","Ornithischian","Horned dinosaur","Triceratops"],
  "Triceratops is an animal, a dinosaur, a 'bird-hipped' ornithischian, a horned dinosaur."),
 # Deep Time & Earth (geology)
 ("seq-rockcycle","geology","Follow rock around the rock cycle, starting from molten magma.",
  ["Magma","Igneous rock","Sediment","Sedimentary rock","Metamorphic rock"],
  "Magma cools to igneous rock, which erodes to sediment, hardens, then can be changed by heat."),
 ("seq-paleozoic","geology","Order the periods of the Paleozoic, oldest first.",
  ["Cambrian","Ordovician","Silurian","Devonian","Carboniferous","Permian"],
  "The Paleozoic runs Cambrian, Ordovician, Silurian, Devonian, Carboniferous, Permian."),
 ("seq-mesozoic","geology","Order the periods of the Mesozoic, oldest first.",
  ["Triassic","Jurassic","Cretaceous"],
  "The age of dinosaurs runs Triassic, then Jurassic, then Cretaceous."),
 ("seq-strata","geology","In undisturbed rock, order these layers from oldest to youngest.",
  ["Deepest layer","Lower-middle layer","Upper-middle layer","Surface layer"],
  "Deeper rock layers are older; younger layers sit on top."),
 # Worlds of the Past (habitats)
 ("seq-worlds","habitats","Order these ancient worlds from oldest to newest.",
  ["Cambrian sea","Coal swamp","Permian desert","Jurassic plain","Ice Age tundra"],
  "Earth's scenery changed from Cambrian seas through coal swamps and deserts to Ice Age tundra."),
 ("seq-cenozoic","habitats","Order the epochs of the age of mammals, earliest first.",
  ["Paleocene","Eocene","Oligocene","Miocene","Pliocene","Pleistocene"],
  "The Cenozoic epochs run Paleocene, Eocene, Oligocene, Miocene, Pliocene, Pleistocene."),
 ("seq-seasworlds","habitats","Order these worlds from the earliest to the latest.",
  ["Cambrian seas","Carboniferous swamps","Cretaceous forests","Ice Age tundra"],
  "From the first teeming seas to coal swamps, blooming forests and frozen tundra."),
 # Other Prehistoric Animals (conservation)
 ("seq-vertgroups","conservation","Order these animal groups by when they first appeared.",
  ["Fish","Amphibians","Reptiles","Mammals","Birds"],
  "Vertebrate life advanced from fish to amphibians, reptiles, mammals and birds."),
 ("seq-humanline","conservation","Order these human relatives from earliest to latest.",
  ["Australopithecus","Homo habilis","Homo erectus","Neanderthals","Modern humans"],
  "Our family tree runs from Australopithecus through early Homo to Neanderthals and us."),
 ("seq-seapredators","conservation","Order these ocean predators from the earliest to the latest.",
  ["Anomalocaris (Cambrian)","Dunkleosteus (Devonian)","Ichthyosaur (Mesozoic)","Megalodon (Cenozoic)"],
  "Sea hunters changed from Anomalocaris to Dunkleosteus, ichthyosaurs and finally Megalodon."),
 ("seq-mammalrise","conservation","Order the rise of the mammals after the dinosaurs.",
  ["Dinosaurs die out","Small mammals survive","Mammals grow larger","Grasslands spread","Ice Age giants appear"],
  "With the dinosaurs gone, mammals grew large and spread, ending with Ice Age giants."),
 # Doing Paleontology (methods)
 ("seq-paleoflow","methods","Order the steps a paleontologist follows.",
  ["Find a fossil","Excavate it","Prepare it in the lab","Study and compare","Publish the findings"],
  "Discovery, excavation, preparation, study and publishing make up the work."),
 ("seq-dating","methods","Order how scientists work out a fossil's age.",
  ["Find the rock layer","Date volcanic ash above and below","Compare with index fossils","Estimate the age in years"],
  "Fossils are dated through their rock layers, dated ash beds and known index fossils."),
 ("seq-mount","methods","Order how a museum skeleton is mounted.",
  ["Clean each bone","Build a support frame","Attach the bones","Pose the skeleton","Open the exhibit"],
  "Cleaned bones are fitted to a frame, posed, and finally revealed to the public."),
]
seq_lines = []
for sid, track, prompt, items, why in SEQ:
    seq_lines.append('  { id: %s, track: %s, prompt: %s, items: %s, why: %s }'
        % (json.dumps(sid), json.dumps(track), json.dumps(prompt),
           json.dumps(items, ensure_ascii=False), json.dumps(why)))
SEQ_JS = "var SEQUENCES = [\n" + ",\n".join(seq_lines) + "\n];"

i = src.find("var SEQUENCES = [")
j = src.find("\n];", i) + 3
if i < 0 or j < 3:
    raise SystemExit("SEQUENCES block not found")
src = src[:i] + SEQ_JS + src[j:]

open("base.html", "w", encoding="utf-8").write(src)
print("phase 2 rebrand complete; sequences:", len(SEQ), "arcade re-themed:", len(arcade))
