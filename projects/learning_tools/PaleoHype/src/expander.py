# -*- coding: utf-8 -*-
"""Expander: turns raw taxon tuples into dicts with track/family resolved."""

# classGroup -> track key (engine track id)
FAUNA_DINO = set(["theropod","sauropod","ornithopod","ceratopsian","ankylosaur","stegosaur","pachy","earlydino"])
OTHER_ANIMAL = set(["pterosaur","marine","synapsid","mammal","bird","human","fish","shark","amphibian","reptile","archosaur"])
FLORA_INV = set(["trilobite","invert","arthropod","ediacaran","plant"])

def track_for(classg):
    if classg in FAUNA_DINO:
        return "fauna"        # "Dinosaurs"
    if classg in OTHER_ANIMAL:
        return "conservation" # "Other Prehistoric Animals"
    if classg in FLORA_INV:
        return "flora"        # "Prehistoric Plants & Invertebrates"
    return "conservation"

def family_for(classg):
    if classg == "marine":
        return "marine"
    if classg in ("fish","shark"):
        return "fish"
    if classg in ("invert","trilobite","arthropod","ediacaran"):
        return "invert"
    if classg == "human":
        return "human"
    if classg == "plant":
        return "plant"
    return ""

def expand(tup):
    """tuple (key, name, sci, group, classGroup, periodKey, diet, art, trait) -> dict"""
    key, name, sci, group, classg, pk, diet, art, trait = tup
    return {
        "key": key,
        "name": name,
        "sci": sci,
        "group": group,
        "classGroup": classg,
        "periodKey": pk,
        "diet": diet,
        "art": art,
        "trait": trait,
        "track": track_for(classg),
        "family": family_for(classg),
    }

def load_all():
    import taxa_theropods, taxa_armoured, taxa_ornithischian
    import taxa_pterosaurs_marine, taxa_synapsid_archosaur
    import taxa_invert_fish_plant, taxa_cenozoic
    raw = []
    raw += taxa_theropods.THEROPODS
    raw += taxa_armoured.SAUROPODS
    raw += taxa_armoured.STEGOSAURS
    raw += taxa_armoured.ANKYLOSAURS
    raw += taxa_ornithischian.CERATOPSIANS
    raw += taxa_ornithischian.PACHYCEPHALOSAURS
    raw += taxa_ornithischian.ORNITHOPODS
    raw += taxa_pterosaurs_marine.PTEROSAURS
    raw += taxa_pterosaurs_marine.MARINE
    raw += taxa_synapsid_archosaur.SYNAPSIDS
    raw += taxa_synapsid_archosaur.AMPHIBIANS
    raw += taxa_synapsid_archosaur.ARCHOSAURS
    raw += taxa_invert_fish_plant.EDIACARAN
    raw += taxa_invert_fish_plant.INVERTS
    raw += taxa_invert_fish_plant.PLANTS
    raw += taxa_cenozoic.MAMMALS
    raw += taxa_cenozoic.BIRDS
    raw += taxa_cenozoic.HUMANS
    # try supplementary file if present
    try:
        import taxa_supplement
        raw += taxa_supplement.SUPPLEMENT
    except Exception:
        pass
    return [expand(t) for t in raw]

if __name__ == "__main__":
    items = load_all()
    print("TOTAL taxa:", len(items))
    # check duplicate keys
    from collections import Counter
    kc = Counter(x["key"] for x in items)
    dupes = [k for k,v in kc.items() if v>1]
    print("duplicate keys:", dupes)
    # by track
    tc = Counter(x["track"] for x in items)
    print("by track:", dict(tc))
    # by classGroup
    cc = Counter(x["classGroup"] for x in items)
    print("by classGroup:", dict(cc))
    # unknown periods/classes
    import gen_core
    badp = sorted(set(x["periodKey"] for x in items if x["periodKey"] not in gen_core.PERIOD_LABEL))
    print("unknown periodKeys:", badp)
    badc = sorted(set(x["classGroup"] for x in items if x["classGroup"] not in gen_core.CLASS_LABEL))
    print("unknown classGroups:", badc)
    # art keys used
    ac = Counter(x["art"] for x in items)
    print("art keys used:", sorted(ac.keys()))
