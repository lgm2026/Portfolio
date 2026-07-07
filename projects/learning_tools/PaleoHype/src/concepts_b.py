# -*- coding: utf-8 -*-
"""PaleoHype concept lessons. Part 2: ecology (Fossils & Fossil Hunting)
and habitats (Worlds of the Past) tracks."""

from concepts_a import S, SI, AMNH, UCMP, USGS, NPS, NHM, FMNH, BRIT, HUM

NOAA = ("NOAA Ocean Service", "https://oceanservice.noaa.gov/")

ECOLOGY = [
 {"id":"how-fossil-forms","title":"How a fossil forms","track":"ecology","level":"Foundations","src":"nps","time":4,"art":"fossil",
  "explain":[
   "Most fossils begin when a plant or animal dies and is quickly buried by mud, sand or ash before it can rot away or be eaten. The soft parts usually vanish, leaving behind the hard parts such as bone, shell or wood. Over long ages, more layers pile on top and squeeze the sediment into rock.",
   "As water seeps through the buried bone, it carries dissolved minerals that fill the tiny spaces and sometimes replace the original material. Slowly the bone turns to stone, a process called permineralization, preserving its shape in fine detail."],
  "why":"Knowing the steps shows why fast burial and hard parts make fossils far more likely - and why so few creatures ever become one.",
  "terms":[["Permineralization","When minerals fill the spaces in a buried bone or shell, turning it to stone."],["Burial","Being covered by sediment, the crucial first step in forming most fossils."]],
  "sources":S(NPS,UCMP),
  "quiz":[
   {"type":"mc","q":"The crucial first step in forming most fossils is:","choices":["Being eaten","Quick burial in sediment","Drying in the sun","Floating on water"],"answer":1,"why":"Fast burial protects remains long enough to fossilise."},
   {"type":"mc","q":"When minerals slowly turn a buried bone to stone, it is called:","choices":["Erosion","Permineralization","Evaporation","Melting"],"answer":1,"why":"That process is permineralization."},
   {"type":"tf","q":"Soft parts like skin usually fossilise more easily than bone.","answer":False,"why":"False - hard parts such as bone and shell fossilise far more readily than soft tissue."}]},

 {"id":"body-vs-trace","title":"Body fossils and trace fossils","track":"ecology","level":"Core","src":"nps","time":4,"art":"footprint",
  "explain":[
   "Fossils come in two broad kinds. Body fossils are parts of the creature itself - bones, teeth, shells, leaves. Trace fossils are records of behaviour: footprints, burrows, nests, tooth marks, and even fossilised droppings called coprolites.",
   "Both tell different stories. A skeleton shows what an animal looked like, while a trackway can reveal how fast it moved, whether it travelled in a herd, and how it carried its body. Put together, they bring extinct animals to life."],
  "terms":[["Coprolite","Fossilised dung, a trace fossil that can reveal an animal's diet."],["Trackway","A line of fossil footprints left by a walking animal."]],
  "sources":S(NPS,UCMP),
  "quiz":[
   {"type":"mc","q":"Fossilised droppings are called:","choices":["Coprolites","Copratons","Dungstones","Mudrocks"],"answer":0,"why":"Fossil dung is called a coprolite."},
   {"type":"mc","q":"A trackway of footprints can reveal how an animal:","choices":["Tasted","Moved and travelled","Smelled","Dreamed"],"answer":1,"why":"Trackways record movement, speed and group behaviour."},
   {"type":"tf","q":"A dinosaur tooth is a trace fossil.","answer":False,"why":"False - a tooth is part of the animal itself, so it is a body fossil."}]},

 {"id":"footprints-tracks","title":"Footprints and trackways","track":"ecology","level":"Core","src":"nps","time":4,"art":"footprint",
  "explain":[
   "Dinosaur footprints form when an animal steps in soft mud that later hardens and is buried. A single print shows the shape of the foot, but a whole trackway of prints in a row reveals far more - the length of the stride hints at how fast the animal was moving.",
   "Tracks can capture moments frozen in time: many animals walking the same way may show a herd on the move, while two sets of prints meeting can hint at a hunt. Because tracks record living behaviour, they are some of the most exciting fossils to find."],
  "terms":[["Stride","The distance covered in one step; longer strides can mean faster movement."],["Trackmaker","The animal that made a set of fossil footprints."]],
  "sources":S(NPS,UCMP),
  "quiz":[
   {"type":"mc","q":"The spacing of footprints in a trackway can hint at an animal's:","choices":["Colour","Speed","Age in years","Favourite food"],"answer":1,"why":"Longer strides generally indicate faster movement."},
   {"type":"tf","q":"Many parallel trackways can suggest animals moved in a herd.","answer":True,"why":"True - sets of tracks heading the same way can record group movement."}]},

 {"id":"amber-fossils","title":"Amber: trapped in time","track":"ecology","level":"Core","src":"nhm","time":3,"art":"amber",
  "explain":[
   "Amber is fossilised tree resin, the sticky sap that some trees ooze. When an insect or other small creature got stuck in fresh resin, it could be sealed inside and preserved as the resin slowly hardened into amber over millions of years.",
   "Because amber surrounds its captives completely, it preserves them in astonishing detail, down to tiny hairs and delicate wings. It has trapped ancient insects, spiders, flowers, feathers and more, giving us rare windows into life that bones alone could never show."],
  "terms":[["Amber","Fossilised tree resin that can preserve trapped insects and other small life."],["Resin","Sticky sap produced by some trees, which can harden into amber."]],
  "sources":S(NHM,UCMP),
  "quiz":[
   {"type":"mc","q":"Amber is fossilised:","choices":["Bone","Tree resin","Mud","Ice"],"answer":1,"why":"Amber is hardened, fossilised tree resin."},
   {"type":"tf","q":"Amber can preserve tiny details like an insect's wings and hairs.","answer":True,"why":"True - amber preserves trapped creatures in extraordinary detail."}]},

 {"id":"frozen-mummified","title":"Frozen and mummified fossils","track":"ecology","level":"Core","src":"amnh","time":3,"art":"mammoth",
  "explain":[
   "Now and then, conditions preserve far more than bone. In the frozen ground of the far north, whole woolly mammoths have been found with skin, hair and even their last meal still in their stomachs, deep-frozen for tens of thousands of years.",
   "In very dry places, remains can dry out and become mummified instead of rotting. A few dinosaur 'mummies' preserve skin impressions and body outlines, showing the shape and texture of creatures that died long before the Ice Age."],
  "terms":[["Mummification","Drying out of remains so they are preserved instead of rotting."],["Permafrost","Ground that stays frozen for years, able to preserve Ice Age animals."]],
  "sources":S(AMNH,SI),
  "quiz":[
   {"type":"mc","q":"Frozen mammoths are sometimes found preserved in:","choices":["Hot deserts","Permafrost","Coral reefs","Volcanoes"],"answer":1,"why":"Frozen ground, or permafrost, can preserve whole mammoths."},
   {"type":"tf","q":"Some dinosaur fossils preserve impressions of their skin.","answer":True,"why":"True - rare 'mummified' dinosaurs preserve skin texture."}]},

 {"id":"molds-casts","title":"Molds and casts","track":"ecology","level":"Core","src":"ucmp","time":3,"art":"fossil",
  "explain":[
   "Sometimes a shell or bone dissolves away after being buried, leaving an empty hollow in the rock shaped exactly like the original. This hollow is called a mold. If minerals or sediment later fill that hollow, they harden into a copy of the original shape, called a cast.",
   "Molds and casts are common ways that shells, leaves and other delicate things are preserved. Even when the original material is long gone, its shape can survive perfectly in stone."],
  "terms":[["Mold","A hollow in rock left in the shape of a dissolved shell or bone."],["Cast","A fossil formed when a mold fills with sediment or minerals, copying the shape."]],
  "sources":S(UCMP,NPS),
  "quiz":[
   {"type":"mc","q":"A hollow left in rock by a dissolved shell is called a:","choices":["Cast","Mold","Coprolite","Crystal"],"answer":1,"why":"The empty shell-shaped hollow is a mold."},
   {"type":"tf","q":"A cast forms when a mold is filled in and hardens.","answer":True,"why":"True - filling a mold creates a cast of the original shape."}]},

 {"id":"taphonomy","title":"Taphonomy: from death to discovery","track":"ecology","level":"Core","src":"si","time":4,"art":"fossil",
  "explain":[
   "Taphonomy is the study of everything that happens to a living thing between its death and the day a scientist digs it up. It asks how a body was buried, what scattered or broke the bones, and which parts survived. This helps scientists tell a real feature from damage done long after death.",
   "Most remains never make it. Scavengers, rot, rivers and weather destroy nearly everything. Understanding these losses helps paleontologists read the gaps in the fossil record and avoid being fooled by a skeleton that was jumbled before it fossilised."],
  "terms":[["Taphonomy","The study of how living things decay, get buried and become fossils."],["Scavenger","An animal that feeds on dead remains, often scattering bones."]],
  "sources":S(SI,UCMP),
  "quiz":[
   {"type":"mc","q":"Taphonomy studies what happens to remains:","choices":["Only while alive","Between death and discovery","Only in museums","Before birth"],"answer":1,"why":"Taphonomy covers everything from death to fossil discovery."},
   {"type":"tf","q":"Most dead animals are destroyed before they can fossilise.","answer":True,"why":"True - rot, scavengers and weather destroy nearly all remains."}]},

 {"id":"index-fossils","title":"Index fossils: nature's bookmarks","track":"ecology","level":"Core","src":"usgs","time":4,"art":"ammonite",
  "explain":[
   "Some fossils are especially useful for dating rocks. An index fossil comes from a creature that was widespread, common, and lived for only a fairly short stretch of time. When you find one, you can tell roughly how old the surrounding rock is.",
   "Ammonites and trilobites make excellent index fossils. Because each kind lived during a known window of time, matching the same fossil in two far-apart places shows those rocks formed at the same time, even on different continents."],
  "terms":[["Index fossil","A widespread, short-lived fossil used to date the rock it is found in."],["Correlation","Matching rock layers in different places by their shared fossils."]],
  "sources":S(USGS,UCMP),
  "quiz":[
   {"type":"mc","q":"A good index fossil should be widespread and:","choices":["Very rare","Around for only a short time span","Always huge","Still alive"],"answer":1,"why":"Index fossils lived for a short, known stretch of time."},
   {"type":"tf","q":"The same index fossil in two places shows the rocks are about the same age.","answer":True,"why":"True - shared index fossils let scientists match rock ages."}]},

 {"id":"finding-fossils","title":"Finding fossils in the field","track":"ecology","level":"Core","src":"nps","time":4,"art":"excavation",
  "explain":[
   "Fossil hunters look where the right kind of rock is exposed at the surface. Sedimentary rock of the proper age, laid bare in cliffs, badlands, riverbanks or quarries, is most promising. Wind and rain slowly wear the rock away, sometimes revealing bones poking out, ready to be spotted.",
   "Patience and sharp eyes matter more than luck. Searchers walk slowly, scanning the ground for the colour, shine or texture of bone or shell among the ordinary rocks. On public lands there are rules about what may be collected, to protect important finds for everyone."],
  "terms":[["Badlands","Dry, heavily eroded land where bare rock makes fossils easy to spot."],["Outcrop","A place where rock is exposed at the Earth's surface."]],
  "sources":S(NPS,USGS),
  "quiz":[
   {"type":"mc","q":"Fossil hunters search where which kind of rock is exposed?","choices":["Sedimentary rock of the right age","Fresh lava","Ocean water","Steel"],"answer":0,"why":"Exposed sedimentary rock of the right age is most promising."},
   {"type":"tf","q":"Erosion can uncover fossils by wearing away the rock around them.","answer":True,"why":"True - weathering slowly exposes buried fossils at the surface."}]},

 {"id":"excavating-dinosaur","title":"Excavating a dinosaur","track":"ecology","level":"Core","src":"amnh","time":4,"art":"excavation",
  "explain":[
   "Once a big fossil is found, digging it out is slow and careful work. The team maps and photographs the bones in place, then removes the surrounding rock with brushes, picks and small tools. They leave a layer of rock around each bone to protect it.",
   "To move large fossils safely, workers wrap them in a 'field jacket' of burlap soaked in plaster, like a cast for a broken arm. Once hardened, the jacketed bone can be lifted and carried to the lab without falling apart."],
  "terms":[["Field jacket","A protective shell of plaster and burlap wrapped around a fossil for transport."],["Quarry","A site where fossils or rock are dug out of the ground."]],
  "sources":S(AMNH,NPS),
  "quiz":[
   {"type":"mc","q":"Large fossils are protected for moving by wrapping them in a:","choices":["Plastic bag","Plaster field jacket","Blanket","Net"],"answer":1,"why":"A plaster-and-burlap field jacket protects big bones during transport."},
   {"type":"tf","q":"Before digging, the team usually maps and photographs the bones in place.","answer":True,"why":"True - recording the bones in place preserves vital information."}]},

 {"id":"fossil-prep","title":"Preparing fossils in the lab","track":"ecology","level":"Core","src":"fmnh","time":4,"art":"museum",
  "explain":[
   "Back in the laboratory, skilled workers called preparators free the fossil from its rock. Using fine tools, tiny drills and sometimes weak acids, they remove the stone grain by grain, a job that can take months or even years for a big skeleton.",
   "Broken pieces are glued and any gaps may be filled and supported. The cleaned fossil can then be studied, measured, and sometimes mounted for display. Careful preparation can reveal delicate details that were hidden inside the rock."],
  "terms":[["Preparator","A specialist who carefully frees and repairs fossils in the lab."],["Matrix","The rock surrounding a fossil, which must be removed during preparation."]],
  "sources":S(FMNH,AMNH),
  "quiz":[
   {"type":"mc","q":"A person who carefully cleans fossils out of rock is called a:","choices":["Preparator","Pilot","Pharmacist","Plumber"],"answer":0,"why":"Lab specialists who free fossils are called preparators."},
   {"type":"tf","q":"Preparing a large skeleton can take many months or years.","answer":True,"why":"True - cleaning a big fossil from its rock is slow, painstaking work."}]},

 {"id":"how-old-fossil","title":"Working out a fossil's age","track":"ecology","level":"Core","src":"usgs","time":4,"art":"strata",
  "explain":[
   "Scientists rarely date a fossil directly. Instead they date the rock layers around it. If a fossil is sandwiched between two volcanic ash beds whose ages are known, the fossil must fall between those two ages.",
   "Relative position helps too: a fossil in a deeper layer is older than one above it. By combining the order of the layers with precise dates from volcanic rocks, paleontologists can pin down a fossil's age in millions of years."],
  "terms":[["Ash bed","A layer of volcanic ash that can be dated precisely and used to date nearby fossils."],["Bracketing","Dating a fossil by the known ages of rock layers just above and below it."]],
  "sources":S(USGS,UCMP),
  "quiz":[
   {"type":"mc","q":"Scientists usually find a fossil's age by dating the:","choices":["Fossil's colour","Surrounding rock layers","Museum label","Nearest river"],"answer":1,"why":"They date the rock layers around the fossil."},
   {"type":"tf","q":"A fossil between two dated ash beds must be younger than the lower bed.","answer":True,"why":"True - it falls between the ages of the layers above and below it."}]},

 {"id":"lagerstatten","title":"Windows of perfect preservation","track":"ecology","level":"Core","src":"nhm","time":4,"art":"fossil",
  "explain":[
   "A few rare fossil sites preserve life in breathtaking detail, including soft parts that almost never survive. Scientists call such a site by the German word Lagerstaette. They form under special conditions, such as still, oxygen-poor water where bodies settle gently and scavengers cannot reach them.",
   "Famous examples include the Burgess Shale, with its soft-bodied Cambrian animals, and German quarries that preserved feathered Archaeopteryx and delicate jellyfish. These windows show creatures and details the ordinary fossil record misses entirely."],
  "terms":[["Lagerstaette","A fossil site with exceptional preservation, often including soft parts."],["Soft tissue","The non-bony parts of an animal, such as skin, muscle or feathers."]],
  "sources":S(NHM,UCMP),
  "quiz":[
   {"type":"mc","q":"A site with exceptional fossil preservation of soft parts is called a:","choices":["Lagerstaette","Laboratory","Landfill","Glacier"],"answer":0,"why":"Such exceptional sites are called Lagerstaetten."},
   {"type":"tf","q":"Still, oxygen-poor water can help preserve soft body parts.","answer":True,"why":"True - calm, low-oxygen settings reduce decay and scavenging."}]},

 {"id":"why-rare","title":"Why most things never fossilise","track":"ecology","level":"Foundations","src":"si","time":3,"art":"fossil",
  "explain":[
   "Becoming a fossil is extraordinarily unlikely. When most creatures die, scavengers eat them, bacteria rot them, and weather scatters whatever is left. Only if remains are buried quickly in the right place do they stand a chance of lasting.",
   "Because of this, the fossil record is full of gaps. Soft animals, forest creatures and rare species are especially under-represented, while hard-shelled sea animals fossilise far more often. Scientists keep these gaps in mind when reading the story of the past."],
  "terms":[["Fossil record","The whole collection of fossils, used to study the history of life."],["Bias","A built-in unevenness, such as the fossil record favouring hard-bodied sea life."]],
  "sources":S(SI,UCMP),
  "quiz":[
   {"type":"mc","q":"Which is most likely to be missing from the fossil record?","choices":["Hard sea shells","Soft-bodied forest animals","Clam shells","Coral"],"answer":1,"why":"Soft-bodied land animals fossilise very rarely."},
   {"type":"tf","q":"The fossil record is complete, with every species preserved.","answer":False,"why":"False - the fossil record is full of gaps and favours hard-bodied life."}]},
]

HABITATS = [
 {"id":"cambrian-seas","title":"The Cambrian seas","track":"habitats","level":"Core","src":"si","time":4,"art":"anomalocaris",
  "explain":[
   "Step back over 500 million years and the land is bare rock, but the seas are bursting with strange new life. Trilobites crawl along the sea floor, sponges and early reefs rise up, and the metre-long Anomalocaris glides above as one of the first big hunters.",
   "This was a world entirely of the water. No animals or plants yet lived on land. The Cambrian seas were the stage on which most major animal groups first appeared, setting the pattern for animal life ever since."],
  "terms":[["Reef","A ridge built by sea creatures; the first reefs appeared in the early seas."],["Sea floor","The bottom of the ocean, home to trilobites and other early animals."]],
  "sources":S(SI,UCMP),
  "quiz":[
   {"type":"mc","q":"During the Cambrian, complex animal life was found:","choices":["On mountaintops","In the seas","In forests","In the air"],"answer":1,"why":"Cambrian animal life lived in the seas; land was still bare."},
   {"type":"tf","q":"Plants and animals already covered the land in the Cambrian.","answer":False,"why":"False - the land was still bare rock during the Cambrian."}]},

 {"id":"coal-swamp-world","title":"Inside a coal swamp","track":"habitats","level":"Core","src":"nhm","time":4,"art":"fern",
  "explain":[
   "The Carboniferous coal swamps were warm, wet and green. Towering club-moss trees with diamond-patterned bark rose from the muck, while giant horsetails and tree ferns crowded the wetlands. The thick, humid air buzzed with the largest insects that have ever lived.",
   "Dragonfly relatives the size of seagulls flew between the trunks, and millipede relatives longer than a person crawled through the leaf litter. When these forests died and sank into the swamp, they slowly became the coal we dig up today."],
  "terms":[["Swamp","Wet, muddy forested ground; vast swamps formed coal in the Carboniferous."],["Club-moss","A type of plant that grew into giant trees in the coal forests."]],
  "sources":S(NHM,USGS),
  "quiz":[
   {"type":"mc","q":"The coal swamps were home to unusually large:","choices":["Mammals","Insects","Birds","Sharks"],"answer":1,"why":"High oxygen helped giant insects thrive in the coal swamps."},
   {"type":"tf","q":"Dead coal-swamp plants slowly turned into coal.","answer":True,"why":"True - buried swamp forests became coal over long ages."}]},

 {"id":"permian-desert","title":"Permian deserts and the sail-backs","track":"habitats","level":"Core","src":"si","time":4,"art":"dimetrodon",
  "explain":[
   "By the Permian, much of the supercontinent Pangaea was hot and dry, with vast red deserts spreading across its interior. This harsh world belonged not to dinosaurs, which had not yet appeared, but to the synapsids - the distant relatives of mammals.",
   "The most famous was Dimetrodon, a sail-backed hunter often mistaken for a dinosaur. Its tall back sail, plant-eating relatives and many other strange synapsids ruled the Permian land before the Great Dying swept most of them away."],
  "terms":[["Synapsid","An ancient relative of mammals, such as the sail-backed Dimetrodon."],["Desert","A very dry region; deserts spread across Pangaea in the Permian."]],
  "sources":S(SI,UCMP),
  "quiz":[
   {"type":"mc","q":"Dimetrodon, with its tall back sail, was a:","choices":["Dinosaur","Synapsid relative of mammals","Fish","Bird"],"answer":1,"why":"Dimetrodon was a synapsid, not a dinosaur."},
   {"type":"tf","q":"Dinosaurs ruled the Permian deserts.","answer":False,"why":"False - dinosaurs had not yet appeared; synapsids ruled the Permian."}]},

 {"id":"jurassic-floodplain","title":"A Jurassic floodplain","track":"habitats","level":"Core","src":"amnh","time":4,"art":"sauropod",
  "explain":[
   "Picture a wide, green Jurassic plain crossed by lazy rivers. Herds of huge long-necked sauropods move slowly through groves of conifers, tree ferns and ginkgoes, stripping leaves from high branches. Plated Stegosaurus browse lower down, swinging their spiked tails.",
   "Where there are plant-eaters, hunters follow. Allosaurus and other predators stalk the herds, while small, sharp-eyed dinosaurs dart underfoot. The famous Morrison rocks of the American West preserve exactly this kind of teeming Jurassic world."],
  "terms":[["Floodplain","Flat land beside rivers that floods at times; a common dinosaur habitat."],["Conifer","A cone-bearing tree, such as a pine; a major food plant in the Jurassic."]],
  "sources":S(AMNH,NPS),
  "quiz":[
   {"type":"mc","q":"Giant long-necked dinosaurs of the Jurassic mostly fed on:","choices":["Meat","Plants and leaves","Fish","Insects"],"answer":1,"why":"Sauropods were plant-eaters that stripped leaves from trees."},
   {"type":"tf","q":"Predators like Allosaurus hunted on the Jurassic plains.","answer":True,"why":"True - Allosaurus was a top Jurassic predator."}]},

 {"id":"cretaceous-forest","title":"Cretaceous forests in bloom","track":"habitats","level":"Core","src":"amnh","time":4,"art":"ceratopsian",
  "explain":[
   "The Late Cretaceous brought a fresher-looking world. For the first time, flowering plants spread widely, painting the landscape with early blossoms and feeding swarms of new insects. Among the trees roamed horned Triceratops, armoured ankylosaurs and great herds of duck-billed hadrosaurs.",
   "Above them loomed Tyrannosaurus and its relatives, the top hunters of the age. This rich, blooming world was the final stage of the dinosaur story, right up until the asteroid struck."],
  "terms":[["Hadrosaur","A duck-billed plant-eating dinosaur, common in Cretaceous herds."],["Blossom","The flower of a plant; flowering plants spread in the Cretaceous."]],
  "sources":S(AMNH,NHM),
  "quiz":[
   {"type":"mc","q":"A major new kind of plant that spread in the Cretaceous was the:","choices":["Giant club-moss","Flowering plant","Seaweed","Moss"],"answer":1,"why":"Flowering plants spread widely in the Cretaceous."},
   {"type":"tf","q":"Tyrannosaurus was a top predator of the Late Cretaceous.","answer":True,"why":"True - T. rex was an apex predator at the end of the Cretaceous."}]},

 {"id":"mesozoic-seas","title":"Seas of the dinosaur age","track":"habitats","level":"Core","src":"noaa","time":4,"art":"plesiosaur",
  "explain":[
   "While dinosaurs ruled the land, the seas of the Mesozoic belonged to giant reptiles. Dolphin-shaped ichthyosaurs, long-necked plesiosaurs and, later, the huge sea lizards called mosasaurs hunted fish and squid in warm, shallow oceans that spread across much of the world.",
   "Coiled-shelled ammonites filled the water in huge numbers, while sharks and bony fish darted below. None of these sea reptiles were dinosaurs; they were separate groups that returned to the water and ruled it for millions of years."],
  "terms":[["Marine reptile","A reptile adapted to life in the sea, such as a plesiosaur or mosasaur."],["Ammonite","A coil-shelled relative of squid, hugely common in Mesozoic seas."]],
  "sources":S(NOAA,SI),
  "quiz":[
   {"type":"mc","q":"The giant swimming reptiles of the dinosaur age were:","choices":["Dinosaurs","A separate group of marine reptiles","Whales","Fish"],"answer":1,"why":"Marine reptiles were separate from dinosaurs."},
   {"type":"tf","q":"Ammonites were extremely common in Mesozoic seas.","answer":True,"why":"True - coil-shelled ammonites swarmed the seas of the dinosaur age."}]},

 {"id":"age-of-mammals-world","title":"The age of mammals begins","track":"habitats","level":"Core","src":"si","time":4,"art":"mammoth",
  "explain":[
   "After the dinosaurs vanished, the surviving mammals seized their chance. Over the following millions of years they grew larger and more varied, filling roles the dinosaurs had left empty. Strange early giants browsed the forests, while the first whales returned to the sea.",
   "As the world slowly cooled and grasslands spread, herds of grazing mammals appeared, hunted by sabre-toothed cats and other fierce predators. This Cenozoic world of mammals leads right up to the animals, and people, of today."],
  "terms":[["Cenozoic","The 'age of mammals', the era after the dinosaurs that continues today."],["Grassland","Open land covered in grasses, which spread during the age of mammals."]],
  "sources":S(SI,UCMP),
  "quiz":[
   {"type":"mc","q":"After the dinosaurs died out, which group grew large and varied?","choices":["Mammals","Trilobites","Pterosaurs","Ammonites"],"answer":0,"why":"Mammals expanded to fill the roles left empty by the dinosaurs."},
   {"type":"tf","q":"Grasslands spread widely during the age of mammals.","answer":True,"why":"True - cooling climates spread grasslands in the Cenozoic."}]},

 {"id":"ice-age-world","title":"The Ice Age world","track":"habitats","level":"Core","src":"si","time":4,"art":"mammoth",
  "explain":[
   "During the most recent Ice Age, great sheets of ice spread from the poles, and much of the north was cold, open tundra and grassland. This chilly world was home to the famous megafauna: woolly mammoths, woolly rhinos, giant ground sloths, cave bears and sabre-toothed cats.",
   "Early humans lived alongside these animals, hunting them and painting them on cave walls. As the ice melted and the climate warmed, many of the great Ice Age beasts died out, for reasons scientists still study today."],
  "terms":[["Ice Age","A span when great ice sheets spread; the last one ended about 11,700 years ago."],["Megafauna","Very large animals, such as the mammoths and giant sloths of the Ice Age."]],
  "sources":S(SI,NPS),
  "quiz":[
   {"type":"mc","q":"Which animal lived during the last Ice Age?","choices":["Woolly mammoth","Tyrannosaurus","Trilobite","Anomalocaris"],"answer":0,"why":"Woolly mammoths were classic Ice Age megafauna."},
   {"type":"tf","q":"Early humans lived alongside Ice Age megafauna.","answer":True,"why":"True - people hunted and painted Ice Age animals like mammoths."}]},

 {"id":"living-fossils","title":"Living fossils among us","track":"habitats","level":"Core","src":"nhm","time":3,"art":"fern",
  "explain":[
   "A few living things have changed remarkably little over vast stretches of time, so people call them 'living fossils'. They closely resemble their ancient relatives known from the rocks, giving us a living glimpse of the deep past.",
   "Examples include the ginkgo tree, horseshoe crabs, and the coelacanth - a fish known first from fossils and thought long extinct, until a living one was caught in 1938. These survivors remind us that the prehistoric world is not entirely gone."],
  "terms":[["Living fossil","A living species closely resembling its ancient fossil relatives."],["Coelacanth","A lobe-finned fish once known only from fossils, then found alive in 1938."]],
  "sources":S(NHM,SI),
  "quiz":[
   {"type":"mc","q":"A 'living fossil' is a modern species that:","choices":["Is made of stone","Closely resembles its ancient relatives","Glows in the dark","Lives forever"],"answer":1,"why":"Living fossils strongly resemble their ancient fossil relatives."},
   {"type":"tf","q":"A living coelacanth was caught in 1938 after being known only from fossils.","answer":True,"why":"True - the coelacanth's 1938 capture stunned scientists."}]},
]
