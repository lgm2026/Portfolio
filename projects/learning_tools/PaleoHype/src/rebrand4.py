# -*- coding: utf-8 -*-
"""Phase 4 rebrand: remove leftover SeaHype / marine-biology references
(TerraHype was itself forked from SeaHype and left these behind)."""
import re
src = open("base.html", encoding="utf-8").read()
DASH = "\u2014"

def rep(old, new, label, count=1):
    global src
    if src.count(old) < count:
        raise SystemExit("MISSING (%s): %r" % (label, old[:90]))
    src = src.replace(old, new, count)

# ---- ComplianceBanner sentence (player-visible)
rep('"SeaHype presents original educational content with links to authoritative sources. It is not affiliated with NOAA, the Smithsonian, or any agency, and is not a substitute for accredited coursework, fieldwork, or scientific-diving certification. Always follow local laws and safety guidance, and never handle protected or dangerous marine life."',
    '"PaleoHype presents original educational content with links to authoritative sources. It is not affiliated with the Smithsonian, the USGS, or any agency, and is not a substitute for accredited coursework or formal fieldwork. Always follow local laws and landowner permissions, and never collect fossils where it is restricted."',
    "compliance-banner")

# ---- Legal: educational disclaimer paragraph
rep('Its lessons are original explanations of well-established marine-biology concepts, with links to authoritative public sources for further reading. It is not a substitute for accredited coursework, formal fieldwork, or a scientific-diving certification.',
    'Its lessons are original explanations of well-established paleontology and natural-history concepts, with links to authoritative public sources for further reading. It is not a substitute for accredited coursework, formal fieldwork, or professional scientific training.',
    "legal-eduardo")

# ---- Legal: affiliation paragraph
rep('"SeaHype is not affiliated with, endorsed by, or sponsored by NOAA, the Smithsonian Institution, MBARI, WHOI, IUCN, NASA, FAO, or any other organization referenced. Linked sources belong to their respective owners and are provided for educational reference only."',
    '"PaleoHype is not affiliated with, endorsed by, or sponsored by the Smithsonian Institution, the American Museum of Natural History, the UC Museum of Paleontology, the Natural History Museum, the Field Museum, the USGS, the National Park Service, NASA, NOAA, or any other organization referenced. Linked sources belong to their respective owners and are provided for educational reference only."',
    "legal-affil")

# ---- Legal: artwork paragraph
rep('"All sea-life and shell illustrations in "',
    '"All illustrations of prehistoric life in "', "art-1")
rep('are original vector artwork created for this app ' + DASH + ' they are drawn diagrams, not photographs. They are designed to be recognizable teaching aids that render crisply at any size and work fully offline. Real organisms vary in color and form, so use the linked sources and field guides whenever you need photographic reference or precise identification.',
    'are original vector artwork created for this app ' + DASH + ' they are drawn reconstructions, not photographs. They are designed to be recognizable teaching aids that render crisply at any size and work fully offline. Extinct species are known only from fossils and are reconstructed by scientists, so use the linked sources and field guides whenever you need reference or precise identification.',
    "art-2")

# ---- header comment block
rep('   SeaHype Marine Biology Education ' + DASH + ' a free, openly accessible marine-biology\n'
    '   study website (operator alias: openMarineDB).',
    '   PaleoHype Dinosaurs & Prehistoric Life ' + DASH + ' a free, openly accessible paleontology\n'
    '   study website (operator alias: openPaleoDB).',
    "header-comment")

# ---- global token swaps for everything else
rep('Renders the official SeaHype coin logo', 'Renders the official PaleoHype coin logo', "logo-comment")
# remaining "SeaHype" word tokens (about header, privacy, trademarks, no-warranty,
# review copy, library subtitle, aria-label). Safe: no identifier uses this token.
n = src.count("SeaHype")
src = src.replace("SeaHype", "PaleoHype")
# any stray marine-biology / openMarineDB / Marine Biology Education
src = src.replace("openMarineDB", "openPaleoDB")
src = src.replace("Marine Biology Education", "Dinosaurs & Prehistoric Life")
src = src.replace("marine-biology", "paleontology")

open("base.html", "w", encoding="utf-8").write(src)
print("phase 4 complete; SeaHype tokens swapped:", n)
