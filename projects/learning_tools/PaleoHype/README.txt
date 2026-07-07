PaleoHype Dinosaurs & Prehistoric Life — Full Source Bundle
=============================================================

WHAT'S HERE
  src/PaleoHype.html
    The complete, final single-file application (React via
    React.createElement, no build step, no JSX). This is the same file
    delivered in the sandbox package as "index.html".

  src/gen_core.py, taxa_*.py, expander.py
    The 426-species paleontology database and the profile-lesson generator
    (explain text, terms, sourced quiz questions) for each species.

  src/concepts_a.py, concepts_b.py, concepts_c.py
    The 75 hand-authored concept lessons covering foundations, geology,
    fossil-hunting, prehistoric plants & invertebrates, dinosaurs, the
    worlds of the past, and the practice of paleontology.

  src/art_gen.py
    Generates the 37 original SVG illustrations used throughout the app.

  src/support_data.py
    Hand-authored reference datasets: glossary, name pronunciations,
    taxonomy groups, "big idea" concepts, careers, a history-of-
    paleontology timeline, achievement milestones, "marvels" facts, and a
    findable-fossils collection guide.

  src/build_data.py
    Master assembly script. Runs the generators above, assembles the
    501-lesson data blob plus all reference datasets, and writes the JSON
    data blob and engine-side JS (sources/tracks/units) used by the app.

  src/rebrand1.py .. rebrand6.py
    The sequence of scripts used to adapt the shared engine template into
    PaleoHype: branding, storage key, track labels and art, arcade game
    themes, ordering minigames, onboarding copy, and legal text.

HOW TO REBUILD
  1. Start from the shared engine template (not included here, as it is
     the operator's separate base asset).
  2. Run build_data.py to produce data_blob.json, _sources.js, _tracks.js,
     and _unitplan.js.
  3. Run rebrand1.py through rebrand6.py in order against the engine
     template to inject the data blob and apply all PaleoHype branding.
  4. The result is src/PaleoHype.html — validate with a JS parser (e.g.
     @babel/parser) and confirm the injected JSON parses before shipping.

NOTES
  • All factual content (taxa, dates, classifications, sources) was
    compiled from public, reputable paleontology and natural-history
    references and is intended for general education, not professional use.
  • See the Legal Notices file in the sandbox package for full disclaimers.
