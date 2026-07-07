# -*- coding: utf-8 -*-
import re

# US -> UK base map (lowercase). Only words safe to convert in prose.
MAP = {
    "center": "centre", "centers": "centres", "centered": "centred", "centering": "centring",
    "color": "colour", "colors": "colours", "colored": "coloured", "coloring": "colouring", "colorful": "colourful",
    "favorite": "favourite", "favorites": "favourites",
    "neighbor": "neighbour", "neighbors": "neighbours", "neighboring": "neighbouring", "neighborhood": "neighbourhood",
    "recognize": "recognise", "recognized": "recognised", "recognizes": "recognising", "recognizing": "recognising",
    "toward": "towards",
    "traveled": "travelled", "traveling": "travelling", "traveler": "traveller",
    "defense": "defence",
    "modeling": "modelling", "modeled": "modelled",
    "signaling": "signalling", "signaled": "signalled",
    "fueled": "fuelled", "fueling": "fuelling",
    "catalog": "catalogue", "cataloged": "catalogued", "catalogs": "catalogues",
    "organize": "organise", "organized": "organised", "organizing": "organising",
    "realize": "realise", "realized": "realised", "realizing": "realising",
    "analyze": "analyse", "analyzed": "analysed", "analyzing": "analysing",
    "behavior": "behaviour", "behaviors": "behaviours",
    "liter": "litre", "liters": "litres",
    "meter": "metre", "meters": "metres",
    "kilometer": "kilometre", "kilometers": "kilometres",
    "centimeter": "centimetre", "centimeters": "centimetres",
    "millimeter": "millimetre", "millimeters": "millimetres",
    "gray": "grey", "grayish": "greyish",
    "maneuver": "manoeuvre", "maneuvers": "manoeuvres", "maneuvered": "manoeuvred",
    "specialized": "specialised", "specialize": "specialise",
}

def _case(out, src):
    if src.isupper(): return out.upper()
    if src[:1].isupper(): return out[:1].upper() + out[1:]
    return out

_pat = re.compile(r"\b(" + "|".join(sorted(MAP.keys(), key=len, reverse=True)) + r")\b", re.I)

def uk(s):
    if not isinstance(s, str) or not s:
        return s
    def rep(m):
        w = m.group(0)
        return _case(MAP[w.lower()], w)
    return _pat.sub(rep, s)

def normalize_obj(o):
    """Recursively normalize all string VALUES in a dict/list structure (not keys)."""
    if isinstance(o, str):
        return uk(o)
    if isinstance(o, list):
        return [normalize_obj(x) for x in o]
    if isinstance(o, dict):
        return {k: normalize_obj(v) for k, v in o.items()}
    return o

if __name__ == "__main__":
    tests = ["The center of the galaxy", "a colorful nebula", "moved toward mastery",
             "favorite target", "diameter and parameter unchanged", "a 10 meter dish",
             "Color blazes", "RECOGNIZE this"]
    for t in tests:
        print(repr(t), "->", repr(uk(t)))
