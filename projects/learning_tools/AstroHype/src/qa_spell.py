# -*- coding: utf-8 -*-
import re, json
from collections import defaultdict
import gen_entries, astro_concepts, astro_content, astro_art

el, q, meta, ent = gen_entries.build()
cl, plan = astro_concepts.build()
L = {}; L.update(el); L.update(cl)

# ---- collect all human-readable strings with a source tag ----
texts = []  # (tag, string)
def add(tag, s):
    if isinstance(s, str) and s.strip():
        texts.append((tag, s))

for lid, les in L.items():
    add(lid + ".title", les.get("title", ""))
    for i, e in enumerate(les.get("explain", [])): add(lid + ".explain[%d]" % i, e)
    add(lid + ".why", les.get("why", ""))
    add(lid + ".hook", les.get("hook", ""))
    for t in les.get("terms", []):
        if isinstance(t, list) and len(t) == 2:
            add(lid + ".term", t[0]); add(lid + ".termdef", t[1])
    for qz in les.get("quiz", []):
        add(lid + ".q", qz.get("q", ""))
        for c in qz.get("choices", []): add(lid + ".choice", c)
        add(lid + ".qwhy", qz.get("why", ""))
    if les.get("misconception"):
        m = les["misconception"]
        if isinstance(m, dict):
            add(lid + ".mis.claim", m.get("claim", "")); add(lid + ".mis.truth", m.get("truth", ""))

for g in astro_content.GLOSSARY:
    add("glossary.term", g["term"]); add("glossary.def", g["def"])
for p in astro_content.PRON:
    add("pron.term", p.get("term", "")); add("pron.say", p.get("say", ""))
for t in astro_content.TAXONOMY:
    add("tax.group", t.get("group", "")); add("tax.note", t.get("note", "") or t.get("desc",""))
for c in astro_content.CONCEPTS:
    add("concept.t", c.get("title","")); add("concept.b", c.get("body","") or c.get("text",""))
for c in astro_content.CAREERS:
    add("career.t", c.get("title","") or c.get("role","")); add("career.b", c.get("body","") or c.get("desc",""))
for h in astro_content.HISTORY:
    add("hist.t", h.get("title","") or h.get("label","")); add("hist.b", h.get("body","") or h.get("desc",""))
for m in astro_content.MILESTONES:
    add("mile", m.get("label","") or m.get("title","")); add("mile.b", m.get("desc","") or m.get("body",""))
for m in astro_content.MARVELS:
    add("marvel.t", m.get("title","")); add("marvel.b", m.get("body","") or m.get("desc",""))
for s in astro_content.SHELLS:
    add("shell.name", s.get("name","")); add("shell.note", s.get("note","") or s.get("desc",""))

# ---- build dictionary of allowed proper nouns from data ----
proper = set()
for lid, les in L.items():
    for w in re.findall(r"[A-Za-z][A-Za-z'\-]+", les.get("title","")):
        proper.add(w.lower())
for m in meta.values():
    for fld in ("sci",):
        if m.get(fld):
            for w in re.findall(r"[A-Za-z][A-Za-z'\-]+", m[fld]): proper.add(w.lower())

# curated astronomy whitelist
WL = """astronomy astronomer astronomers astrophysics cosmology cosmological cosmos
constellation constellations nebula nebulae nebular galactic galaxy galaxies supernova supernovae
supergiant supergiants protostar protostars exoplanet exoplanets exoplanetary circumstellar interstellar
intergalactic extragalactic redshift blueshift parallax luminosity luminosities albedo perihelion aphelion
perigee apogee apsis periapsis apoapsis retrograde prograde ecliptic zodiac equinox equinoxes solstice solstices
azimuth zenith nadir culmination occultation syzygy libration terminator regolith chromosphere photosphere
corona coronal heliosphere heliopause magnetosphere ionosphere stratosphere troposphere mesosphere thermosphere exosphere
tidally barycenter barycentre spectroscopy spectroscopic spectra spectrum spectral parsec parsecs lightyear
kilometre kilometres kilometer kilometers metre metres litre tonne tonnes gravitational gravity microgravity
accretion accreting protoplanetary planetesimal planetesimals planetary interplanetary cometary asteroidal meteoroid
meteoroids meteorite meteorites meteor meteors cometesimal coma tails ionized ionised plasma plasmas fusion
deuterium helium hydrogen lithium beryllium nucleosynthesis isotopes isotope opacity convective radiative
chromospheric sunspot sunspots sunspots starlight starspot magnitudes magnitude apparent absolute bolometric
parallactic astrometry astrometric photometry photometric radial Doppler blackbody hydrostatic
Schwarzschild Chandrasekhar Kuiper Oort Lagrange Lagrangian Roche Hubble Webb Kepler Newton Newtonian Einstein
Galilean Cassini Voyager Pioneer Magellan Juno Dawn Rosetta Philae Hayabusa OSIRIS Curiosity Perseverance Ingenuity
Sojourner Opportunity Spirit Viking Mariner Messenger Apollo Gemini Artemis Soyuz Sputnik Vostok
Andromeda Triangulum Sombrero Whirlpool Pinwheel Cartwheel Antennae
Betelgeuse Rigel Sirius Canopus Arcturus Vega Capella Rigil Procyon Achernar Hadar Altair Acrux Aldebaran Antares
Spica Pollux Fomalhaut Deneb Mimosa Regulus Castor Bellatrix Elnath Miaplacidus Alnilam Alnitak Mintaka Saiph
Polaris Mizar Alcor Algol Rasalhague Kochab Alphard Hamal Diphda Menkar Mirach Almach Alpheratz Schedar Caph
Mira Proxima Centauri Centaurus Cygnus Lyra Aquila Orion Taurus Scorpius Sagittarius Cassiopeia Cepheus Perseus
Andromedae Pegasus Hercules Bootes Draco Ursa Majoris Minoris Leo Virgo Libra Aries Pisces Aquarius Capricornus
Gemini Cancer Ophiuchus Serpens Hydra Corvus Crater Crux Carina Vela Puppis Columba Lepus Canis Eridanus Cetus
Fornax Sculptor Phoenix Grus Tucana Pavo Indus Octans Hydrus Reticulum Dorado Pictor Caelum Horologium
Mensa Volans Chamaeleon Apus Musca Circinus Norma Ara Telescopium Corona Borealis Australis Scutum Sagitta
Vulpecula Delphinus Equuleus Lacerta Triangulum Auriga Camelopardalis Lynx Monoceros Sextans
Mercury Venus Mars Jupiter Saturn Uranus Neptune Pluto Ceres Eris Haumea Makemake Sedna Quaoar Orcus Gonggong
Ganymede Callisto Europa Io Titan Enceladus Mimas Tethys Dione Rhea Iapetus Hyperion Phoebe Titania Oberon
Umbriel Ariel Miranda Triton Nereid Proteus Charon Nix Hydra Kerberos Styx Phobos Deimos Pandora Prometheus
Amalthea Himalia Vesta Pallas Hygiea Juno Eros Bennu Ryugu Itokawa Psyche Ida Gaspra Mathilde Chariklo
Halley Encke Hale Bopp Tempel Wild Borrelly Churyumov Gerasimenko Hartley Shoemaker Levy Swift Tuttle
Crab Veil Helix Ring Lagoon Trifid Eagle Omega Orion Horsehead Tarantula Carina Rosette Flame Cone Pelican
Pleiades Hyades Praesepe Beehive Jewel Hercules Omega Tucanae Centauri Wishing Coathanger Butterfly Ptolemy
Plough Dipper Teapot Cygni Leonids Perseids Geminids Quadrantids Lyrids Orionids Taurids Aquariids Draconids
Eta Aquariids Ursids Camelopardalids Capricornids
Greenwich Chile Atacama Mauna Kea Hawaii Arecibo VLA ALMA Gemini Keck Subaru
TRAPPIST Kepler Trappist Proxima Gliese HD Kelt WASP Kepler Tau Ceti Vega Pegasi
heliocentric geocentric Copernican Ptolemaic Aristotelian uncrewed crewed flyby flybys rover rovers
gibbous waxing waning crescent umbra penumbra antumbra annular totality
quasar quasars pulsar pulsars magnetar magnetars blazar neutron dwarf dwarfs brown wormhole wormholes
spacetime curvature relativistic relativity dilation gravitationally observable redshifted
exo subsolar superrotation outgassing cryovolcano cryovolcanism cryovolcanic icy rocky gaseous
collimated arcminute arcsecond arcseconds milliarcsecond degrees equatorial polar oblate prograde
binoculars eyepiece eyepieces refractor reflector refractors reflectors collimation aperture focal
naked-eye dark-sky light-pollution stargazing stargazers skywatching skywatchers
billion trillion quintillion sextillion kilometres reddish bluish whitish yellowish brightest densest
hottest coolest farthest furthest closest largest smallest oldest fastest nearest faint fainter faintest
Mpc kpc AU au lyr myr
Lvl"""
known = set(w.lower() for w in re.findall(r"[A-Za-z'\-]+", WL))
known |= proper

from spellchecker import SpellChecker
sp = SpellChecker(distance=1)

def tokenize(s):
    # words, keep internal apostrophes/hyphens; drop possessive 's handled below
    return re.findall(r"[A-Za-z]+(?:['\-][A-Za-z]+)*", s)

unknown = defaultdict(list)  # word -> list of (tag, context)
for tag, s in texts:
    # strip things that look like numbers/units
    for w in tokenize(s):
        lw = w.lower().strip("'-")
        base = lw
        # strip possessive
        if base.endswith("'s"): base = base[:-2]
        if base.endswith("s'"): base = base[:-2]
        base2 = base.replace("'", "")
        if not base or base.isdigit(): continue
        if base in known or base2 in known: continue
        # split hyphenated and check each part
        parts = re.split(r"[\-']", base)
        if all((p in known or p in sp or p == "" or p.isdigit()) for p in parts):
            continue
        if base in sp or base2 in sp:
            continue
        unknown[base].append((tag, s))

# Report unknown words, most frequent first
items = sorted(unknown.items(), key=lambda kv: -len(kv[1]))
print("DISTINCT UNKNOWN WORDS:", len(items))
print("TOTAL TEXT STRINGS:", len(texts))
print("=" * 60)
for w, occ in items:
    tags = set(t.split(".")[0] for t, _ in occ)
    print("%-22s x%-3d  %s" % (w, len(occ), list(tags)[:4]))
    # show one context for rare ones
    if len(occ) <= 3:
        print("        e.g.", repr(occ[0][1][:90]))
