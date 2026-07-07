# -*- coding: utf-8 -*-
"""Phase 5: replace the hardcoded nature trivia pool (relCurated) with
factually accurate paleontology questions."""
src = open("base.html", encoding="utf-8").read()
D = "\u2014"

new_fn = (
'function relCurated() {\n'
'  return [\n'
'    { q: "Birds evolved from which group of dinosaurs?", choices: ["Theropods", "Sauropods", "Stegosaurs", "Horned dinosaurs"], answer: 0, why: "Birds descend from small, feathered theropod dinosaurs." },\n'
'    { q: "Which dinosaur had three horns and a large neck frill?", choices: ["Triceratops", "Velociraptor", "Brachiosaurus", "Stegosaurus"], answer: 0, why: "Triceratops means \\u2018three-horned face\\u2019." },\n'
'    { q: "What helped end the age of the dinosaurs about 66 million years ago?", choices: ["An asteroid impact", "An ice age", "A great flood", "A disease"], answer: 0, why: "A huge asteroid strike, together with volcanism, drove the end-Cretaceous extinction." },\n'
'    { q: "Most fossils are found in which kind of rock?", choices: ["Sedimentary", "Igneous", "Volcanic glass", "Marble"], answer: 0, why: "Sediment buries remains in layers, so most fossils form in sedimentary rock." },\n'
'    { q: "Trilobites were a kind of ' + D + '?", choices: ["Sea arthropod", "Fish", "Dinosaur", "Plant"], answer: 0, why: "Trilobites were armoured marine arthropods of the Paleozoic seas." },\n'
'    { q: "Which era is known as the \\u2018age of dinosaurs\\u2019?", choices: ["Mesozoic", "Paleozoic", "Cenozoic", "Precambrian"], answer: 0, why: "The Mesozoic spans the Triassic, Jurassic and Cretaceous periods." },\n'
'    { q: "A giant long-necked, four-legged plant-eating dinosaur is a ' + D + '?", choices: ["Sauropod", "Theropod", "Pterosaur", "Trilobite"], answer: 0, why: "Sauropods such as Brachiosaurus were the giant long-necked plant-eaters." },\n'
'    { q: "Pterosaurs were flying ' + D + '?", choices: ["Reptiles", "Dinosaurs", "Birds", "Insects"], answer: 0, why: "Pterosaurs were flying reptiles, close cousins of dinosaurs but not dinosaurs themselves." },\n'
'    { q: "Fossilised tree resin that can trap insects is called ' + D + '?", choices: ["Amber", "Coal", "Marble", "Chalk"], answer: 0, why: "Amber is hardened ancient resin that can preserve trapped creatures in detail." },\n'
'    { q: "Which \\u2018living fossil\\u2019 fish was found alive in 1938?", choices: ["Coelacanth", "Salmon", "Tuna", "Cod"], answer: 0, why: "The coelacanth was known only from fossils until a living one was caught off Africa." },\n'
'    { q: "A dinosaur footprint is which kind of fossil?", choices: ["Trace fossil", "Body fossil", "Index fossil", "Living fossil"], answer: 0, why: "Trace fossils record behaviour, such as footprints and burrows." },\n'
'    { q: "Tyrannosaurus rex was a meat-eating ' + D + '?", choices: ["Theropod", "Sauropod", "Horned dinosaur", "Armoured dinosaur"], answer: 0, why: "T. rex was a giant theropod, the same broad group that led to birds." },\n'
'    { q: "Scientists usually work out a fossil\\u2019s age from ' + D + '?", choices: ["The rock layers around it", "Its colour", "Its weight", "Its smell"], answer: 0, why: "Fossils are dated through their rock layers and dated volcanic ash, not directly." },\n'
'    { q: "Which sail-backed animal lived before the dinosaurs and is a relative of mammals?", choices: ["Dimetrodon", "Stegosaurus", "Spinosaurus", "Iguanodon"], answer: 0, why: "Dimetrodon was a synapsid, an early mammal relative, not a dinosaur." },\n'
'    { q: "Stegosaurus is famous for the rows of ' + D + ' on its back?", choices: ["Bony plates", "Feathers", "Horns", "Sails"], answer: 0, why: "Stegosaurus had tall bony back plates and spikes on its tail." },\n'
'    { q: "Woolly mammoths lived during the ' + D + '?", choices: ["Ice Age", "Jurassic", "Cambrian", "Triassic"], answer: 0, why: "Mammoths roamed during the last Ice Age, alongside early humans." }\n'
'  ];\n'
'}'
)

i = src.find("function relCurated() {")
e = src.find("\n}", src.find("\n  ];", i)) + 2
if i < 0 or e < 2:
    raise SystemExit("relCurated bounds not found")
src = src[:i] + new_fn + src[e:]

# also fix the header-comment "scientific-diving certification" leftover
src = src.replace(
 "a study and reference tool, NOT a substitute for\n   accredited coursework, fieldwork, or scientific-diving certification.",
 "a study and reference tool, NOT a substitute for\n   accredited coursework, formal fieldwork, or professional scientific training.")

open("base.html", "w", encoding="utf-8").write(src)
print("phase 5 complete: relCurated rewritten + header comment fixed")
