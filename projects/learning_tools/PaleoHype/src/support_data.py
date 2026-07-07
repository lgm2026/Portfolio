# -*- coding: utf-8 -*-
"""PaleoHype supporting datasets: glossary, pronunciations, taxonomy groups,
big concepts, careers, history timeline, milestones, marvels, famous fossils.
All factually grounded; schema matches the TerraHype engine exactly."""

# ----------------------------------------------------------------- GLOSSARY --
# {term, cat, def}
GLOSSARY = [
 # Fossils & how we find them
 ("Fossil","Fossils","The preserved remains or traces of ancient life, such as bones, shells, leaves or footprints."),
 ("Body fossil","Fossils","A fossil of part of an organism itself, such as a bone, tooth or shell."),
 ("Trace fossil","Fossils","A fossil that records behaviour, such as a footprint, burrow or fossil dung."),
 ("Permineralization","Fossils","When minerals seep into a buried bone or shell and turn it to stone."),
 ("Cast","Fossils","A fossil formed when a hollow mold in rock fills with sediment or minerals."),
 ("Mold","Fossils","A hollow in rock left in the shape of a shell or bone that has dissolved away."),
 ("Coprolite","Fossils","Fossilised dung, which can reveal what an ancient animal ate."),
 ("Amber","Fossils","Fossilised tree resin that can preserve trapped insects and other small life."),
 ("Index fossil","Fossils","A widespread, short-lived fossil used to date the rock it is found in."),
 ("Taphonomy","Fossils","The study of how living things decay, get buried and become fossils."),
 ("Matrix","Fossils","The rock surrounding a fossil, removed during preparation."),
 ("Lagerstaette","Fossils","A rare fossil site with exceptional preservation, sometimes including soft parts."),
 # Deep time & geology
 ("Geologic time","Time","The vast timescale of Earth's history, measured in millions and billions of years."),
 ("Era","Time","A large division of geologic time, such as the Mesozoic, made up of periods."),
 ("Period","Time","A division of geologic time, such as the Jurassic, shorter than an era."),
 ("Mesozoic","Time","The 'age of dinosaurs', made up of the Triassic, Jurassic and Cretaceous periods."),
 ("Paleozoic","Time","The era of ancient life before the dinosaurs, from the Cambrian to the Permian."),
 ("Cenozoic","Time","The 'age of mammals', the era after the dinosaurs that continues today."),
 ("Precambrian","Time","The vast span of early Earth history before complex animals became common."),
 ("Extinction","Time","The complete and permanent dying out of a species or larger group."),
 ("Mass extinction","Time","An event in which a large share of Earth's species die out in a short time."),
 ("Stratum","Geology","A single layer of sedimentary rock; the plural is strata."),
 ("Sedimentary rock","Geology","Rock formed from layers of sediment pressed together; most fossils are found in it."),
 ("Plate tectonics","Geology","The slow movement of the giant plates that make up Earth's outer shell."),
 ("Radiometric dating","Geology","Measuring natural radioactive decay in rocks to find their age in years."),
 # Life & evolution
 ("Evolution","Life","The gradual change in living things over many generations."),
 ("Adaptation","Life","A feature or behaviour that helps a living thing survive in its environment."),
 ("Species","Life","A group of living things alike enough to breed and produce similar offspring."),
 ("Vertebrate","Life","An animal with a backbone, such as a fish, reptile, bird or mammal."),
 ("Invertebrate","Life","An animal without a backbone, such as an insect, trilobite or shellfish."),
 ("Predator","Life","An animal that hunts and eats other animals."),
 ("Herbivore","Life","An animal that eats only plants."),
 ("Carnivore","Life","An animal that eats other animals."),
 ("Omnivore","Life","An animal that eats both plants and animals."),
 ("Living fossil","Life","A living species that closely resembles its ancient fossil relatives."),
 # Dinosaurs & their relatives
 ("Dinosaur","Dinosaurs","A group of land reptiles, now including birds, that first appeared in the Triassic."),
 ("Theropod","Dinosaurs","A mostly meat-eating dinosaur that walked on two legs; the group that led to birds."),
 ("Sauropod","Dinosaurs","A giant, long-necked plant-eating dinosaur that walked on four legs."),
 ("Ornithischian","Dinosaurs","One of the two main dinosaur groups, the 'bird-hipped' plant-eaters."),
 ("Saurischian","Dinosaurs","One of the two main dinosaur groups, the 'lizard-hipped' dinosaurs."),
 ("Ceratopsian","Dinosaurs","A horned, frilled plant-eating dinosaur such as Triceratops."),
 ("Ankylosaur","Dinosaurs","An armoured plant-eating dinosaur, some with a clubbed tail."),
 ("Stegosaur","Dinosaurs","A plated plant-eating dinosaur with spikes on its tail."),
 ("Hadrosaur","Dinosaurs","A duck-billed plant-eating dinosaur, common in Cretaceous herds."),
 ("Pterosaur","Dinosaurs","A flying reptile of the dinosaur age; not a dinosaur itself."),
 ("Synapsid","Dinosaurs","An ancient relative of mammals, such as the sail-backed Dimetrodon."),
 ("Marine reptile","Dinosaurs","A reptile adapted to life in the sea, such as a plesiosaur or mosasaur."),
 ("Trilobite","Dinosaurs","An extinct armoured sea arthropod, very common in the Paleozoic seas."),
 ("Ammonite","Dinosaurs","An extinct coil-shelled relative of squid, common in Mesozoic seas."),
 ("Megafauna","Dinosaurs","Very large animals, such as the mammoths and giant sloths of the Ice Age."),
 # Doing paleontology
 ("Paleontology","Doing science","The scientific study of ancient life through fossils."),
 ("Paleontologist","Doing science","A scientist who studies ancient life through fossils."),
 ("Preparator","Doing science","A specialist who carefully frees and repairs fossils in the lab."),
 ("Excavation","Doing science","The careful digging out of fossils from the ground."),
 ("Field jacket","Doing science","A protective shell of plaster and burlap wrapped around a fossil for transport."),
 ("Reconstruction","Doing science","A scientific rebuilding of how an extinct animal looked or moved."),
 ("Hypothesis","Doing science","A testable idea that scientists check against evidence."),
]
GLOSSARY = [{"term": t, "cat": c, "def": d} for (t, c, d) in GLOSSARY]

# ------------------------------------------------------------- PRONUNCIATION --
# {term, say, note}
PRON = [
 ("Tyrannosaurus","tie-RAN-uh-SOR-us","The famous 'tyrant lizard', a giant meat-eater."),
 ("Triceratops","try-SERR-uh-tops","'Three-horned face', a horned plant-eater."),
 ("Velociraptor","veh-LOSS-ih-rap-tor","A small, fast, feathered hunter."),
 ("Stegosaurus","STEG-uh-SOR-us","A plated dinosaur with tail spikes."),
 ("Brachiosaurus","BRACK-ee-uh-SOR-us","A giant long-necked plant-eater."),
 ("Ankylosaurus","an-KY-luh-SOR-us","An armoured dinosaur with a tail club."),
 ("Allosaurus","AL-uh-SOR-us","A big Jurassic meat-eating dinosaur."),
 ("Diplodocus","dih-PLOD-uh-kus","A very long sauropod with a whip-like tail."),
 ("Spinosaurus","SPINE-uh-SOR-us","A sail-backed, fish-eating dinosaur."),
 ("Pteranodon","teh-RAN-uh-don","A large crested flying reptile (the 'p' is silent)."),
 ("Archaeopteryx","ar-kee-OP-ter-ix","An early bird-like dinosaur with feathers and teeth."),
 ("Pachycephalosaurus","PACK-ee-SEF-uh-luh-SOR-us","A thick, dome-headed dinosaur."),
 ("Parasaurolophus","PA-ra-sor-OL-uh-fus","A duck-billed dinosaur with a long head crest."),
 ("Iguanodon","ig-WAH-nuh-don","An early plant-eater with a thumb spike."),
 ("Deinonychus","die-NON-ih-kus","A sickle-clawed raptor that helped change how we see dinosaurs."),
 ("Compsognathus","komp-SOG-nuh-thus","A small, chicken-sized meat-eater."),
 ("Plesiosaur","PLEE-see-uh-sor","A long-necked marine reptile."),
 ("Ichthyosaur","IK-thee-uh-sor","A dolphin-shaped marine reptile."),
 ("Mosasaur","MOH-zuh-sor","A giant sea lizard of the Late Cretaceous."),
 ("Dimetrodon","die-MET-ruh-don","A sail-backed synapsid, not a dinosaur."),
 ("Quetzalcoatlus","KET-sal-koh-AT-lus","One of the largest flying animals ever."),
 ("Anomalocaris","uh-NOM-uh-loh-KAR-iss","A large Cambrian sea predator."),
 ("Dunkleosteus","dun-kul-OSS-tee-us","A huge armoured prehistoric fish."),
 ("Smilodon","SMY-luh-don","The famous sabre-toothed cat."),
 ("Mammoth","MAM-uth","A shaggy, tusked Ice Age relative of elephants."),
 ("Coelacanth","SEE-luh-kanth","A 'living fossil' fish once thought long extinct."),
]
PRON = [{"term": t, "say": s, "note": n} for (t, s, n) in PRON]

# ---------------------------------------------------------------- TAXONOMY ----
# {group, rank, examples, note}
TAXONOMY = [
 ("Theropods","Dinosaurs (Theropoda)","Tyrannosaurus, Velociraptor, Allosaurus, Spinosaurus","Mostly meat-eating, two-legged dinosaurs; birds evolved from this group."),
 ("Sauropods","Dinosaurs (Sauropoda)","Brachiosaurus, Diplodocus, Argentinosaurus","Giant, long-necked, four-legged plant-eaters - the largest land animals ever."),
 ("Ornithopods","Dinosaurs (Ornithopoda)","Iguanodon, Parasaurolophus, Maiasaura","Plant-eating 'bird-hipped' dinosaurs, including the duck-billed hadrosaurs."),
 ("Horned dinosaurs","Dinosaurs (Ceratopsia)","Triceratops, Styracosaurus, Protoceratops","Plant-eaters with beaks, neck frills and, in many, sharp horns."),
 ("Armoured dinosaurs","Dinosaurs (Ankylosauria)","Ankylosaurus, Euoplocephalus","Low, heavily armoured plant-eaters, some with a bony tail club."),
 ("Plated dinosaurs","Dinosaurs (Stegosauria)","Stegosaurus, Kentrosaurus","Plant-eaters with rows of back plates and spiked tails."),
 ("Pterosaurs","Flying reptiles (Pterosauria)","Pteranodon, Quetzalcoatlus, Rhamphorhynchus","Flying reptiles of the dinosaur age; close cousins of dinosaurs but not dinosaurs."),
 ("Marine reptiles","Sea reptiles","Plesiosaurs, Ichthyosaurs, Mosasaurs","Reptile groups that returned to the sea; separate from dinosaurs."),
 ("Synapsids","Proto-mammals (Synapsida)","Dimetrodon, Lystrosaurus, Gorgonops","Ancient relatives of mammals; ruled the land before the dinosaurs."),
 ("Trilobites","Arthropods (Trilobita)","Elrathia, Phacops, Isotelus","Extinct armoured sea animals, among the most successful of the Paleozoic."),
 ("Ammonites","Cephalopods (Ammonoidea)","Coiled-shelled relatives of squid","Common Mesozoic sea animals and useful index fossils."),
 ("Birds","Living dinosaurs (Aves)","From Archaeopteryx to modern birds","Feathered, surviving descendants of small theropod dinosaurs."),
]
TAXONOMY = [{"group": g, "rank": r, "examples": e, "note": n} for (g, r, e, n) in TAXONOMY]

# ------------------------------------------------------------------ CONCEPTS --
# {title, body, src}
CONCEPTS = [
 ("Deep time is almost unimaginably long","Earth is about 4.6 billion years old. If that whole history were squeezed into a single day, the dinosaurs would not appear until late evening, and humans only in the last few seconds. Thinking in millions of years is the key to paleontology.","usgs"),
 ("Most things never become fossils","Becoming a fossil takes a rare run of luck: quick burial, hard parts and the right kind of rock. Soft-bodied and forest animals are especially under-represented, so the fossil record is a patchy, incomplete album of the past.","si"),
 ("Rock layers record the order of time","In undisturbed rock, deeper layers are older than the ones above. By reading the order of the strata and the fossils inside them, scientists piece the history of life into sequence.","usgs"),
 ("Birds are living dinosaurs","Birds descend from small, feathered, meat-eating dinosaurs. The giant dinosaurs are gone, but their relatives sing in trees today, linking the deep past to the living world.","amnh"),
 ("Feathers came before flight","Many dinosaurs had feathers long before any could fly, first for warmth or display. Flight evolved later in some feathered theropods, which is why feathers are now known across the group.","nhm"),
 ("Extinctions reshape life again and again","Life has suffered at least five great mass extinctions. Each was a catastrophe, but each also cleared the way for survivors to spread - mammals, for instance, expanded only after the dinosaurs vanished.","si"),
 ("Continents move over deep time","Earth's plates drift slowly, joining and splitting the continents. The supercontinent Pangaea later broke apart, shaping where ancient animals could live and how they spread.","usgs"),
 ("Fossils are dated through the rocks","Scientists rarely date a fossil directly. Instead they date volcanic layers above and below it, then place the fossil between those known ages.","usgs"),
 ("We rebuild extinct animals from clues","Bones, muscle scars, skin impressions, trackways and even fossil pigments let scientists carefully reconstruct how extinct animals looked and moved - and update those ideas as new evidence appears.","amnh"),
 ("The present helps explain the past","By comparing fossils with living relatives such as birds and crocodiles, scientists infer how extinct animals lived, grew and behaved.","ucmp"),
]
CONCEPTS = [{"title": t, "body": b, "src": s} for (t, b, s) in CONCEPTS]

# ------------------------------------------------------------------- CAREERS --
# {role, what, path, src}
CAREERS = [
 ("Paleontologist","Studies ancient life by finding and analysing fossils, then publishing what they reveal about the history of life.","A degree in geology or biology, usually followed by graduate study and fieldwork.","ucmp"),
 ("Field paleontologist","Searches for and carefully excavates fossils from rock in the field, mapping and protecting each find.","Training in geology plus hands-on field experience on dig teams.","nps"),
 ("Fossil preparator","Frees fossils from their surrounding rock and repairs them using fine tools in the lab.","Often learned through museum training, volunteering and apprenticeship; great hand skills.","fmnh"),
 ("Museum curator","Cares for a museum's fossil collections, leads research and designs exhibits for the public.","Usually an advanced degree in paleontology and experience with collections.","si"),
 ("Paleoartist","Reconstructs extinct animals and ancient worlds as drawings, paintings and models, guided by the science.","Strong art skills plus close study of anatomy and the latest research.","amnh"),
 ("Geologist","Studies rocks and the Earth, including the layers and dating that put fossils in time.","A degree in geology or earth science.","usgs"),
 ("Paleobotanist","Studies fossil plants to learn how vegetation and ancient climates changed over time.","A background in botany and paleontology.","nhm"),
 ("Museum educator","Shares the science of fossils and prehistory with students and visitors.","A background in science or education and a gift for explaining ideas.","fmnh"),
 ("Collections manager","Organises, labels and protects the thousands of specimens a museum holds for research.","Training in museum studies or biology and careful, organised work.","si"),
 ("Science writer","Explains new fossil discoveries and ideas to the public through articles, books and media.","Strong writing skills plus a solid grounding in science.","britann"),
]
CAREERS = [{"role": r, "what": w, "path": p, "src": s} for (r, w, p, s) in CAREERS]

# ------------------------------------------------------------------- HISTORY --
# {year, title, body}  (history of paleontology)
HISTORY = [
 ("1677","First dinosaur bone described","An English scholar describes a giant bone, later known to be from a dinosaur, though at the time it was thought to belong to a giant human."),
 ("1811","Mary Anning's ichthyosaur","On the English coast, young Mary Anning and her brother uncover a complete ichthyosaur, one of the first ancient marine reptiles recognised by science."),
 ("1824","Megalosaurus named","Megalosaurus becomes the first dinosaur to be formally named and described, from fossils found in England."),
 ("1842","The word 'dinosaur' is coined","Anatomist Richard Owen groups several giant fossil reptiles together and names them dinosaurs, meaning 'terrible lizards'."),
 ("1858","First mounted skeleton ideas","The discovery of a fairly complete Hadrosaurus in New Jersey shows that some dinosaurs walked on two legs, reshaping how they were imagined."),
 ("1861","Archaeopteryx discovered","A feathered, bird-like fossil from Germany links dinosaurs and birds and supports new ideas about evolution."),
 ("1870s","The great 'Bone Wars'","A fierce rivalry between two American fossil hunters leads to the discovery of dozens of new dinosaurs, including Stegosaurus and Triceratops."),
 ("1923","Dinosaur eggs in the Gobi","Expeditions to Mongolia's Gobi Desert find nests of dinosaur eggs, showing that dinosaurs laid eggs much like birds and reptiles."),
 ("1969","Deinonychus changes everything","The study of the active, sickle-clawed Deinonychus revives the idea that dinosaurs were fast and warm, and strengthens the dinosaur-bird link."),
 ("1980","Asteroid extinction theory","Scientists propose that an asteroid impact ended the age of dinosaurs, supported later by a giant buried crater and a worldwide clue layer."),
]
HISTORY = [{"year": y, "title": t, "body": b} for (y, t, b) in HISTORY]

# ---------------------------------------------------------------- MILESTONES --
# {id, need, title, blurb, cite}
MILESTONES = [
 ("first-step",1,"First Dig","You finished your first lesson. Every paleontologist starts with a single careful observation.","Smithsonian"),
 ("trail-started",5,"Field Notes","Five lessons in. You are building a real foundation in how prehistoric life worked.","UC Museum of Paleontology"),
 ("getting-deeper",15,"Into the Strata","Fifteen lessons deep. You are digging down through layer after layer of Earth's story.","USGS"),
 ("bone-hunter",30,"Bone Hunter","Thirty lessons. You are spotting the patterns that connect ancient worlds across deep time.","American Museum of Natural History"),
 ("seasoned",50,"Seasoned Collector","Fifty lessons. Your knowledge of prehistoric life is becoming genuinely broad.","Natural History Museum, London"),
 ("expedition",80,"Expedition Leader","Eighty lessons. You could guide others through the long history of life on Earth.","Field Museum"),
 ("curator",120,"Curator's Eye","One hundred and twenty lessons. You are building a museum's worth of understanding.","Smithsonian"),
 ("paleo-master",180,"Master Paleontologist","An extraordinary journey through deep time. You have explored the prehistoric world in remarkable depth.","UC Museum of Paleontology"),
]
MILESTONES = [{"id": i, "need": n, "title": t, "blurb": b, "cite": c} for (i, n, t, b, c) in MILESTONES]

# ------------------------------------------------------------------- MARVELS --
# {title, fact, src}
MARVELS = [
 ("The largest land animals ever","The biggest sauropods, such as Argentinosaurus, may have stretched over 30 metres long and weighed as much as a dozen elephants - the largest animals ever to walk on land.","nhm"),
 ("A bite like no other","Tyrannosaurus had one of the most powerful bites of any land animal known, strong enough to crush bone, and teeth the size of bananas.","amnh"),
 ("The fastest in the sky","The giant pterosaur Quetzalcoatlus stood as tall as a giraffe and was among the largest flying animals that has ever lived.","si"),
 ("Feathers on a tyrant's cousin","Many meat-eating dinosaurs were feathered. Some relatives of Tyrannosaurus had fuzzy, feather-like coats, changing how we picture them.","nhm"),
 ("A fish thought long gone","The coelacanth was known only from fossils and believed extinct for millions of years - until a living one was caught off Africa in 1938.","si"),
 ("Trilobites ruled for ages","Trilobites thrived in the seas for nearly 270 million years, far longer than the dinosaurs, before finally dying out.","ucmp"),
 ("Eggs the size of footballs","Some dinosaur eggs were huge, and fossil nests show that certain dinosaurs cared for their young much as birds do today.","amnh"),
 ("An impact that changed the world","The asteroid that helped end the dinosaurs left a crater over 150 kilometres wide and scattered a thin clue layer found around the globe.","usgs"),
 ("Giants of the Ice Age","Woolly mammoths, giant ground sloths and sabre-toothed cats roamed alongside early humans during the last Ice Age.","si"),
 ("Amber's frozen moments","Amber has trapped ancient insects, flowers and even feathers in such detail that tiny hairs are still visible millions of years later.","nhm"),
 ("The first giant predators","Long before the dinosaurs, the metre-long Anomalocaris was one of the first large hunters in the Cambrian seas.","si"),
 ("Sails before the dinosaurs","The sail-backed Dimetrodon is often mistaken for a dinosaur, but it lived before them and was actually a relative of mammals.","ucmp"),
]
MARVELS = [{"title": t, "fact": f, "src": s} for (t, f, s) in MARVELS]

# -------------------------------------------------------- FAMOUS FOSSILS (SHELLS) --
# Repurpose the collection screen as common findable fossils.
# {name, sci, group, art, regions, size, desc}
FOSSILS = [
 ("Ammonite","Coiled cephalopod shell","Index fossil","ammonite",["Mesozoic seas"],"Often 2-20 cm","A coiled, ribbed shell that looks like a ram's horn. These relatives of squid are common in marine rocks and are prized index fossils for dating layers."),
 ("Trilobite","Armoured sea arthropod","Paleozoic","trilobite",["Paleozoic seas"],"Often 1-10 cm","A segmented, three-lobed body with a hard shell. Trilobites crawled the ancient sea floor for hundreds of millions of years before dying out."),
 ("Shark tooth","Fossil tooth","Marine","shark",["Marine sediments"],"Often 1-15 cm","Hard, triangular and often glossy, shark teeth fossilise far more easily than the rest of the cartilage skeleton, so they are among the most common vertebrate fossils."),
 ("Brachiopod","Two-shelled sea animal","Paleozoic","fossil",["Shallow seas"],"Often 1-8 cm","A clam-like shell with two halves that are mirror images top to bottom. Brachiopods were hugely common in ancient seas."),
 ("Crinoid stem","'Sea lily' segments","Paleozoic","fossil",["Shallow seas"],"Beads a few mm wide","Stacked, button-like discs from the stalk of a sea lily, an animal related to starfish. Loose discs look like tiny washers in the rock."),
 ("Belemnite","Bullet-shaped fossil","Mesozoic","ammonite",["Mesozoic seas"],"Often 2-15 cm","The hard, bullet-shaped internal guard of an extinct squid relative. Smooth and pointed, they are common in marine rocks of the dinosaur age."),
 ("Petrified wood","Mineralised tree","Plants","fern",["Ancient forests"],"Logs of any size","Wood turned to stone, with the grain and rings often perfectly preserved in colourful minerals."),
 ("Fossil fern","Plant frond imprint","Plants","fern",["Coal forests"],"Fronds up to 30 cm","Delicate leaf imprints pressed into fine rock, common in the rocks of ancient coal swamps."),
 ("Fossil coral","Colonial reef animal","Paleozoic","fossil",["Ancient reefs"],"Patches up to 30 cm","Honeycomb or horn-shaped patterns left by reef-building animals, showing where warm shallow seas once lay."),
 ("Gastropod","Sea or pond snail shell","Marine","ammonite",["Seas and lakes"],"Often 1-10 cm","A spiral, coiled snail shell. Gastropods lived in ancient seas, rivers and lakes and are common fossils."),
 ("Orthoceras","Straight-shelled cephalopod","Paleozoic","ammonite",["Paleozoic seas"],"Often 5-30 cm","A long, straight, chambered shell from an early relative of squid that swam the Paleozoic seas."),
 ("Echinoid","Fossil sea urchin","Marine","fossil",["Shallow seas"],"Often 2-10 cm","A rounded, dome-shaped shell, sometimes patterned with five-fold symmetry, from an ancient sea urchin."),
 ("Bivalve","Two-shelled mollusc","Marine","fossil",["Seas and rivers"],"Often 1-15 cm","A clam- or oyster-like shell with two matching halves. Bivalves are common in many marine rocks."),
 ("Dinosaur footprint","Trace fossil track","Trace fossil","footprint",["River and lake beds"],"Up to 1 m across","An impression left by a dinosaur stepping in soft mud that later hardened. Three-toed tracks are a classic sign of theropods."),
 ("Coprolite","Fossil dung","Trace fossil","fossil",["Many settings"],"Often 2-20 cm","Fossilised droppings. Though humble, coprolites can reveal exactly what an ancient animal ate."),
 ("Insect in amber","Trapped in resin","Amber","amber",["Ancient forests"],"Pieces a few cm","A small creature sealed inside fossilised tree resin, often preserved in astonishing detail."),
 ("Eurypterid","'Sea scorpion'","Paleozoic","eurypterid",["Paleozoic waters"],"Often 5-30 cm","The fossil of an extinct water arthropod with paddles and, in some, large claws; a few kinds grew very large."),
 ("Graptolite","Colonial drifters","Paleozoic","fossil",["Paleozoic seas"],"Often 1-5 cm","Thin, pencil-mark-like fossils of tiny colonial animals that drifted in ancient seas; useful for dating rocks."),
 ("Megalodon tooth","Giant shark tooth","Marine","shark",["Marine sediments"],"Up to ~18 cm","The huge serrated tooth of the largest shark that ever lived, a prized find from sea-floor sediments."),
 ("Fossil leaf","Pressed leaf imprint","Plants","fern",["Lake beds"],"Often 2-15 cm","A flattened imprint of a leaf in fine rock, capturing its shape and veins; useful for reading ancient climates."),
]
FOSSILS = [{"name": n, "sci": s, "group": g, "art": a, "regions": r, "size": z, "desc": d}
           for (n, s, g, a, r, z, d) in FOSSILS]
