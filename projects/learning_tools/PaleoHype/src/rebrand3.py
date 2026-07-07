# -*- coding: utf-8 -*-
"""Phase 3 rebrand (encoding-safe via prefix regex for facts)."""
import re
src = open("base.html", encoding="utf-8").read()
DASH = "\u2014"

def rep(old, new, label, count=1):
    global src
    if src.count(old) < count:
        raise SystemExit("MISSING (%s): %r" % (label, old[:90]))
    src = src.replace(old, new, count)

# ---- arcade facts: match by unique dash-free prefix, replace whole fact token
fact_prefix_map = [
 ("A gray squirrel can relocate acorns",
  "Tyrannosaurus had teeth up to about 30 cm long " + DASH + " roughly the size of bananas."),
 ("Lichens slowly break bare rock down into soil",
  "Sedimentary rock, where most fossils form, is built from layers of sand, silt and mud."),
 ("Maple seeds spin like tiny helicopters",
  "The giant pterosaur Quetzalcoatlus stood as tall as a giraffe with a wingspan over 10 m."),
 ("A single plastic bottle can take around 450 years",
  "Most living things never fossilise " + DASH + " it takes quick burial and a lot of luck."),
 ("A caterpillar can eat many times its own weight",
  "Trilobites thrived in the seas for nearly 270 million years before they died out."),
 ("An octopus has about 500 million neurons",
  "Some dinosaur fossils preserve skin impressions, showing their scales and texture."),
 ("A large locust swarm can contain",
  "The asteroid that helped end the dinosaurs left a crater over 150 km wide."),
 ("Some towns build small tunnels so toads",
  "Fossil trackways show that some dinosaurs travelled together in herds."),
 ("Bears gorge on berries in late summer",
  "Fossil nests show some dinosaurs cared for their eggs and young, much like birds."),
 ("Some bamboo can grow nearly a meter in a single day",
  "The first true forests grew in the Devonian, over 380 million years ago."),
 ("Hailstones grow as storm updrafts",
  "A thin worldwide clue layer marks the asteroid impact that ended the dinosaur age."),
 ("Flying squirrels don't truly fly",
  "Many raptors were feathered, fast pack-hunters closely related to birds."),
 ("Frost, water and gravity slowly wear mountains down",
  "Erosion slowly wears rock away, sometimes uncovering fossils buried for ages."),
 ("Some cave crystals grow for thousands of years",
  "Caves and tar pits have preserved Ice Age bones in remarkable detail."),
 ("Pronghorn can sprint over 80 km/h",
  "To move big fossils safely, crews wrap them in a plaster 'field jacket'."),
 ("Fireflies flash in coded patterns",
  "Ammonites were coil-shelled relatives of squid and make excellent index fossils."),
 ("Leaves blaze red and gold in autumn",
  "Amber is fossilised tree resin that can trap insects in lifelike detail."),
 ("Many songbirds learn their songs",
  "Crested duck-bills like Parasaurolophus may have made deep, trombone-like calls."),
 ("A giant sequoia grows from a seed",
  "Birds are living dinosaurs, descended from small, feathered meat-eaters."),
 ("Never eat a wild mushroom unless an expert",
  "Fossils are usually dated by the rock layers around them, not directly."),
 ("Fireflies make cold light through a chemical reaction",
  "Huge volcanic eruptions helped cause some of Earth's great mass extinctions."),
]
for prefix, new in fact_prefix_map:
    pat = 'fact: "' + re.escape(prefix) + '[^"]*"'
    m = re.search(pat, src)
    if not m:
        raise SystemExit("fact prefix not found: " + prefix)
    src = src[:m.start()] + 'fact: "' + new + '"' + src[m.end():]

# ---- onboarding interests
rep('  "Trees & forests", "Birds", "Mammals", "Wildflowers & plants",\n'
    '  "Rocks & fossils", "Insects & bugs", "Conservation", "Nature careers"',
    '  "Dinosaurs", "Fossils & fossil hunting", "Sea reptiles & sea life", "Flying reptiles",\n'
    '  "Mammals & Ice Age", "Rocks & deep time", "Prehistoric plants & bugs", "Paleontology careers"',
    "interests")

# ---- topic-sorter categories MUST match glossary cats
rep('var cats = ["Ecology", "Plants", "Animals", "Geology", "Habitats", "Conservation", "Field skills"];',
    'var cats = ["Fossils", "Time", "Life", "Geology", "Dinosaurs", "Doing science"];',
    "zonecats")

# ---- onboarding copy
rep('"What draws you to nature?"', '"What draws you to prehistoric life?"', "onb-q")
rep('note: "New to nature ' + DASH + ' keep it friendly"',
    'note: "New to fossils ' + DASH + ' keep it friendly"', "onb-junior")

# ---- splash sub + author + operator + twitter desc
rep('<p class="sea-sub" id="sea-sub">Setting up your nature lessons. This takes just a moment.</p>',
    '<p class="sea-sub" id="sea-sub">Setting up your prehistoric lessons. This takes just a moment.</p>', "splash-sub")
rep('<meta name="author" content="openNatureDB" />',
    '<meta name="author" content="openPaleoDB" />', "author")
rep('var OPERATOR = "openNatureDB";', 'var OPERATOR = "openPaleoDB";', "operator")
# twitter desc (match by prefix to avoid dash ambiguity)
m = re.search(r'<meta name="twitter:description" content="[^"]*" />', src)
if m:
    src = src[:m.start()] + '<meta name="twitter:description" content="500+ sourced dinosaur &amp; prehistoric-life lessons, XP, an arcade, and a full reference library, free and offline." />' + src[m.end():]

# ---- "fact of the day" + arcade screen titles
rep('"Nature fact of the day"', '"Prehistoric fact of the day"', "factoftheday")
rep('"8-Bit Nature Arcade"', '"8-Bit Fossil Arcade"', "arcade-title")
rep('26 nature mini-games', '26 prehistoric mini-games', "arcade-sub")

# ---- about/settings app description + section header
rep('"A free, offline nature & conservation study app. Your progress is stored only on this device',
    '"A free, offline dinosaurs & prehistoric life study app. Your progress is stored only on this device', "appdesc")
rep('"Nature & Conservation")', '"Dinosaurs & Prehistoric Life")', "sectionhdr")

# ---- safety disclaimer
rep('Always follow local laws, regulations and safety guidance for any beach, water, boating or field activity. Never handle protected, venomous, or otherwise dangerous marine life. When in doubt, observe from a safe distance',
    'Always follow local laws, regulations and landowner permissions before collecting fossils or rocks anywhere. Many parks and public lands protect fossils, and collecting may be restricted or require a permit. When in doubt, observe and photograph rather than collect, and ask an expert',
    "disclaimer")

# ---- boot-splash tips array
i = src.find("var tips = [\n      \"Forests cover about a third of Earth")
if i < 0: raise SystemExit("tips array not found")
j = src.find("];", i) + 2
tips_new = ("var tips = [\n"
 "      \"Earth is about 4.6 billion years old " + DASH + " humans appear only in its last sliver of time.\",\n"
 "      \"Birds are living dinosaurs, descended from small feathered meat-eaters.\",\n"
 "      \"The largest dinosaurs may have weighed as much as a dozen elephants.\",\n"
 "      \"Most living things never become fossils " + DASH + " it takes quick burial and luck.\",\n"
 "      \"Trilobites ruled the seas for nearly 270 million years before dying out.\",\n"
 "      \"Many dinosaurs had feathers long before any of them could fly.\",\n"
 "      \"An asteroid strike helped end the age of dinosaurs about 66 million years ago.\",\n"
 "      \"The coelacanth, known from fossils, was found alive in 1938.\"\n"
 "    ];")
src = src[:i] + tips_new + src[j:]

# ---- OCEAN_TIPS loading facts
i = src.find("var OCEAN_TIPS = [")
j = src.find("];", i) + 2
ocean_new = ("var OCEAN_TIPS = [\n"
 "  \"If Earth's history were one day, the dinosaurs would appear late in the evening.\",\n"
 "  \"Birds are the living descendants of small, feathered, meat-eating dinosaurs.\",\n"
 "  \"The giant pterosaur Quetzalcoatlus was among the largest flying animals ever.\",\n"
 "  \"Amber has trapped ancient insects in such detail that tiny hairs are still visible.\",\n"
 "  \"Most fossils form in sedimentary rock, built from layers of sand, silt and mud.\",\n"
 "  \"Scientists usually date a fossil by the rock layers around it, not directly.\",\n"
 "  \"Trilobites and ammonites make excellent index fossils for dating rocks.\",\n"
 "  \"Life has been struck by at least five great mass extinctions.\"\n"
 "];")
src = src[:i] + ocean_new + src[j:]

open("base.html", "w", encoding="utf-8").write(src)
print("phase 3 rebrand complete")
