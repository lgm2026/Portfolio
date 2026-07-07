# -*- coding: utf-8 -*-
"""
PaleoHype data generator — core framework.
Builds factually-accurate paleontology lessons in the TerraHype engine schema.
"""

# ---------------------------------------------------------------- PERIODS ----
# periodKey -> (display label, time span text, distractor pool position order)
PERIODS = {
    "hadean":     ("the Hadean Eon",        "more than 4 billion years ago"),
    "archean":    ("the Archean Eon",       "about 4 to 2.5 billion years ago"),
    "proterozoic":("the Proterozoic Eon",   "about 2.5 billion to 540 million years ago"),
    "ediacaran":  ("the Ediacaran Period",  "about 635 to 539 million years ago"),
    "cambrian":   ("the Cambrian Period",   "about 539 to 485 million years ago"),
    "ordovician": ("the Ordovician Period", "about 485 to 444 million years ago"),
    "silurian":   ("the Silurian Period",   "about 444 to 419 million years ago"),
    "devonian":   ("the Devonian Period",   "about 419 to 359 million years ago"),
    "carbonif":   ("the Carboniferous Period","about 359 to 299 million years ago"),
    "permian":    ("the Permian Period",    "about 299 to 252 million years ago"),
    "triassic":   ("the Triassic Period",   "about 252 to 201 million years ago"),
    "jurassic":   ("the Jurassic Period",   "about 201 to 145 million years ago"),
    "cretaceous": ("the Cretaceous Period", "about 145 to 66 million years ago"),
    "earlycret":  ("the Early Cretaceous",  "about 145 to 100 million years ago"),
    "latecret":   ("the Late Cretaceous",   "about 100 to 66 million years ago"),
    "paleocene":  ("the Paleocene Epoch",   "about 66 to 56 million years ago"),
    "eocene":     ("the Eocene Epoch",      "about 56 to 34 million years ago"),
    "oligocene":  ("the Oligocene Epoch",   "about 34 to 23 million years ago"),
    "miocene":    ("the Miocene Epoch",     "about 23 to 5 million years ago"),
    "pliocene":   ("the Pliocene Epoch",    "about 5.3 to 2.6 million years ago"),
    "pleistocene":("the Pleistocene Epoch", "the last great Ice Age, about 2.6 million to 11,700 years ago"),
    "paleogene":  ("the Paleogene Period",  "about 66 to 23 million years ago"),
    "neogene":    ("the Neogene Period",    "about 23 to 2.6 million years ago"),
}

# A short label for use inside the "when did it live" multiple-choice
PERIOD_LABEL = {
    "hadean": "the Hadean Eon", "archean": "the Archean Eon",
    "proterozoic": "the Proterozoic Eon", "ediacaran": "the Ediacaran Period",
    "cambrian": "the Cambrian Period", "ordovician": "the Ordovician Period",
    "silurian": "the Silurian Period", "devonian": "the Devonian Period",
    "carbonif": "the Carboniferous Period", "permian": "the Permian Period",
    "triassic": "the Triassic Period", "jurassic": "the Jurassic Period",
    "cretaceous": "the Cretaceous Period", "earlycret": "the Early Cretaceous",
    "latecret": "the Late Cretaceous", "paleocene": "the Paleocene Epoch",
    "eocene": "the Eocene Epoch", "oligocene": "the Oligocene Epoch",
    "miocene": "the Miocene Epoch", "pliocene": "the Pliocene Epoch",
    "pleistocene": "the Pleistocene Epoch (the Ice Age)",
    "paleogene": "the Paleogene Period", "neogene": "the Neogene Period",
}

# Short glossary definition for each period term used in a lesson's `terms`
PERIOD_DEF = {
    "ediacaran": "The time, about 635 to 539 million years ago, of Earth's earliest large, soft-bodied animals.",
    "cambrian": "A period about 539 to 485 million years ago when most major animal groups first appear in the fossil record.",
    "ordovician": "A period about 485 to 444 million years ago, dominated by life in the seas.",
    "silurian": "A period about 444 to 419 million years ago, when the first plants spread onto land.",
    "devonian": "A period about 419 to 359 million years ago, nicknamed the Age of Fishes.",
    "carbonif": "A period about 359 to 299 million years ago whose vast swampy forests formed today's coal.",
    "permian": "A period about 299 to 252 million years ago that ended in the largest mass extinction of all time.",
    "triassic": "A period about 252 to 201 million years ago, when dinosaurs and mammals first appeared.",
    "jurassic": "A period about 201 to 145 million years ago, when giant dinosaurs ruled the land.",
    "cretaceous": "A period about 145 to 66 million years ago, ending when the non-bird dinosaurs died out.",
    "earlycret": "The first half of the Cretaceous Period, about 145 to 100 million years ago.",
    "latecret": "The second half of the Cretaceous Period, about 100 to 66 million years ago.",
    "paleocene": "The epoch just after the dinosaurs died out, about 66 to 56 million years ago.",
    "eocene": "An epoch about 56 to 34 million years ago, when many modern mammal groups appeared.",
    "oligocene": "An epoch about 34 to 23 million years ago, as the world slowly cooled.",
    "miocene": "An epoch about 23 to 5 million years ago, when grasslands spread worldwide.",
    "pliocene": "An epoch about 5.3 to 2.6 million years ago, just before the Ice Age.",
    "pleistocene": "The most recent Ice Age, about 2.6 million to 11,700 years ago, home to mammoths and sabre-tooths.",
    "permian": "A period about 299 to 252 million years ago that ended in the largest mass extinction of all time.",
}

# ---------------------------------------------------------------- SOURCES ----
# These are the source codes the engine's SOURCES map will define.
SRC = {
    "si":     {"label": "Smithsonian \u2014 National Museum of Natural History", "url": "https://naturalhistory.si.edu/"},
    "amnh":   {"label": "American Museum of Natural History", "url": "https://www.amnh.org/"},
    "ucmp":   {"label": "UC Museum of Paleontology", "url": "https://ucmp.berkeley.edu/"},
    "usgs":   {"label": "USGS", "url": "https://www.usgs.gov/"},
    "nps":    {"label": "National Park Service", "url": "https://www.nps.gov/"},
    "nhm":    {"label": "Natural History Museum (London)", "url": "https://www.nhm.ac.uk/"},
    "fmnh":   {"label": "Field Museum", "url": "https://www.fieldmuseum.org/"},
    "britann":{"label": "Encyclopaedia Britannica", "url": "https://www.britannica.com/"},
    "nasa":   {"label": "NASA Earth Observatory", "url": "https://earthobservatory.nasa.gov/"},
    "noaa":   {"label": "NOAA Ocean Service", "url": "https://oceanservice.noaa.gov/"},
    "nmnhe":  {"label": "Smithsonian Ocean", "url": "https://ocean.si.edu/"},
    "humanorg":{"label": "Smithsonian Human Origins", "url": "https://humanorigins.si.edu/"},
}

# Default source pairings used by the profile generator, keyed by classGroup family
def sources_for(family):
    base = {"label": SRC["si"]["label"], "url": SRC["si"]["url"]}
    second = {"label": SRC["amnh"]["label"], "url": SRC["amnh"]["url"]}
    if family in ("plant",):
        second = {"label": SRC["ucmp"]["label"], "url": SRC["ucmp"]["url"]}
    if family in ("human",):
        base = {"label": SRC["humanorg"]["label"], "url": SRC["humanorg"]["url"]}
        second = {"label": SRC["si"]["label"], "url": SRC["si"]["url"]}
    if family in ("marine", "fish", "invert"):
        second = {"label": SRC["nhm"]["label"], "url": SRC["nhm"]["url"]}
    return [base, second]

# ------------------------------------------------------- CLASSIFICATION KEYS --
# classGroup -> human label used in the "classified as a kind of" quiz answer.
CLASS_LABEL = {
    "theropod":      "theropod dinosaur",
    "sauropod":      "sauropod dinosaur",
    "ornithopod":    "ornithopod dinosaur",
    "ceratopsian":   "horned dinosaur",
    "ankylosaur":    "armoured dinosaur",
    "stegosaur":     "plated dinosaur",
    "pachy":         "bone-headed dinosaur",
    "earlydino":     "early dinosaur",
    "pterosaur":     "pterosaur (flying reptile)",
    "marine":        "marine reptile",
    "synapsid":      "synapsid (proto-mammal)",
    "mammal":        "prehistoric mammal",
    "bird":          "prehistoric bird",
    "human":         "early human relative",
    "fish":          "prehistoric fish",
    "shark":         "prehistoric shark",
    "amphibian":     "early amphibian",
    "reptile":       "early reptile",
    "archosaur":     "crocodile-line reptile",
    "trilobite":     "trilobite",
    "invert":        "prehistoric invertebrate",
    "arthropod":     "prehistoric arthropod",
    "plant":         "prehistoric plant",
    "ediacaran":     "Ediacaran life-form",
}
# Pool of class options for the "classified as" quiz distractors
CLASS_POOL = list(CLASS_LABEL.values())

# ---------------------------------------------------------------- HELPERS ----
import random
random.seed(70)  # canon nod: trailer 70

def pick_distractors(correct, pool, n=3):
    opts = [x for x in pool if x != correct]
    random.shuffle(opts)
    chosen = opts[:n]
    chosen.append(correct)
    random.shuffle(chosen)
    return chosen, chosen.index(correct)

# Diet phrasing helpers for the lead paragraph + a true/false diet question
DIET_CLAUSE = {
    "carnivore": "was a meat-eater, hunting other animals",
    "herbivore": "was a plant-eater",
    "omnivore":  "ate both plants and animals",
    "piscivore": "fed mainly on fish",
    "insectivore":"fed mainly on insects and other small creatures",
    "filter":    "filtered tiny food from the water",
    "scavenger": "fed largely on animals that were already dead",
    "none":      "",
}
DIET_WRONG = {
    "carnivore": "fed only on leaves and plants",
    "herbivore": "hunted large animals for meat",
    "omnivore":  "ate nothing but fish",
    "piscivore": "grazed on grass",
    "insectivore":"hunted large prey",
    "filter":    "was a fierce hunter of large prey",
    "scavenger": "made its own food from sunlight",
}

def build_profile(key, t):
    """t is a taxon dict -> returns (lesson_id, lesson_record, meta_record, sci_name)."""
    name = t["name"]
    sci = t.get("sci", "")
    group = t["group"]                      # e.g. "large theropod dinosaur"
    classg = t["classGroup"]                # key into CLASS_LABEL
    class_label = CLASS_LABEL[classg]
    pk = t["periodKey"]
    period_label = PERIOD_LABEL[pk]
    when_phrase = PERIODS[pk][1] if pk in PERIODS else ""
    diet = t.get("diet", "none")
    trait = t["trait"]
    track = t["track"]
    art = t["art"]

    # ---- lead paragraph
    p1 = "The " + name + " was a " + group + " that lived during " + period_label + "."
    if sci:
        # Only add a scientific-name sentence if the common name differs meaningfully
        if sci.lower() != name.lower():
            p1 += " Scientists call it " + sci + "."
    if diet in DIET_CLAUSE and DIET_CLAUSE[diet]:
        p1 += " It " + DIET_CLAUSE[diet] + "."
    explain = [p1, trait]

    # ---- terms
    terms = []
    terms.append([class_label.split(" (")[0].title() if False else class_label,
                  _class_def(classg)])
    if pk in PERIOD_DEF:
        # term label is the bare period name
        plabel = period_label.replace("the ", "").replace(" (the Ice Age)", "")
        terms.append([plabel, PERIOD_DEF[pk]])

    # ---- quiz
    q = []
    # Q1: when did it live
    per_opts, per_idx = pick_distractors(period_label, list(PERIOD_LABEL.values()))
    q.append({"type": "mc", "q": "When did the " + name + " live?",
              "choices": per_opts, "answer": per_idx,
              "why": "The " + name + " lived during " + period_label + "."})
    # Q2: classified as
    cls_opts, cls_idx = pick_distractors(class_label, CLASS_POOL)
    q.append({"type": "mc", "q": "The " + name + " is classified as a kind of:",
              "choices": cls_opts, "answer": cls_idx,
              "why": "The " + name + " is a " + class_label + "."})
    # Q3: trait T/F (true) OR diet T/F (false) - alternate deterministically for variety
    keysum = 0
    for _ch in key:
        keysum += ord(_ch)
    if diet in DIET_WRONG and (keysum % 2 == 0):
        q.append({"type": "tf",
                  "q": "The " + name + " " + DIET_WRONG[diet] + ".",
                  "answer": False,
                  "why": "False \u2014 the " + name + " actually " + DIET_CLAUSE[diet] + "."})
    else:
        q.append({"type": "tf", "q": trait, "answer": True,
                  "why": "True \u2014 that is a real feature of the " + name + "."})

    rec = {
        "title": name,
        "track": track,
        "level": "Core",
        "src": t.get("src", "si"),
        "time": 3,
        "explain": explain,
        "terms": terms,
        "art": art,
        "sources": sources_for(t.get("family", "")),
        "quiz": q,
    }
    meta = {
        "name": name,
        "cat": class_label,
        "group": group,
        "hab": when_phrase,            # reuse hab field to carry the time span
        "habKey": pk,
        "diet": ("(" + diet + ")") if diet != "none" else "",
        "art": art,
        "trait": trait,
    }
    return key, rec, meta, sci

def _class_def(classg):
    d = {
        "theropod": "A meat-eating dinosaur that walked on two legs; the group that includes T. rex and birds.",
        "sauropod": "A giant, long-necked, plant-eating dinosaur that walked on four legs.",
        "ornithopod": "A plant-eating dinosaur, including the duck-billed hadrosaurs.",
        "ceratopsian": "A plant-eating dinosaur with a beak, and often horns and a bony neck frill.",
        "ankylosaur": "A heavily armoured, plant-eating dinosaur covered in bony plates.",
        "stegosaur": "A plant-eating dinosaur with bony plates along its back and spikes on its tail.",
        "pachy": "A plant-eating dinosaur with a thick, domed skull of solid bone.",
        "earlydino": "One of the first dinosaurs, from the Triassic Period.",
        "pterosaur": "A flying reptile with wings of skin; the first vertebrates to fly. Not a dinosaur.",
        "marine": "A reptile adapted to life in the sea, such as a plesiosaur, ichthyosaur or mosasaur.",
        "synapsid": "An ancient relative of mammals; some had sails or mammal-like features.",
        "mammal": "A warm-blooded, usually furry animal that feeds its young milk.",
        "bird": "A feathered, usually flying animal descended from small dinosaurs.",
        "human": "An ancient member of the human family tree.",
        "fish": "An animal that lives in water and usually breathes with gills.",
        "shark": "A fish with a skeleton of cartilage instead of bone.",
        "amphibian": "An animal that usually begins life in water with gills, like a frog or salamander.",
        "reptile": "A scaly, air-breathing animal that lays eggs on land.",
        "archosaur": "A reptile of the crocodile and dinosaur line, common in the Triassic.",
        "trilobite": "An extinct sea arthropod with a hard, three-part shell.",
        "invert": "An animal without a backbone, such as a shellfish or worm.",
        "arthropod": "An animal with a hard outer shell and jointed legs, like an insect or crab.",
        "plant": "A living thing that makes its own food from sunlight.",
        "ediacaran": "One of Earth's earliest large animals, soft-bodied and strange.",
    }
    return d.get(classg, "A kind of prehistoric living thing.")

if __name__ == "__main__":
    print("periods:", len(PERIODS), "classes:", len(CLASS_LABEL))
