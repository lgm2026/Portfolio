# -*- coding: utf-8 -*-
"""PaleoHype concept lessons (hand-authored, factually accurate, kid-friendly).
Part 1: foundations + geology (Deep Time & Earth) tracks.
Schema matches the engine lesson format.
"""

def S(*pairs):
    return [{"label": p[0], "url": p[1]} for p in pairs]

SI  = ("Smithsonian \u2014 National Museum of Natural History", "https://naturalhistory.si.edu/")
AMNH= ("American Museum of Natural History", "https://www.amnh.org/")
UCMP= ("UC Museum of Paleontology", "https://ucmp.berkeley.edu/")
USGS= ("USGS", "https://www.usgs.gov/")
NPS = ("National Park Service", "https://www.nps.gov/")
NHM = ("Natural History Museum (London)", "https://www.nhm.ac.uk/")
FMNH= ("Field Museum", "https://www.fieldmuseum.org/")
BRIT= ("Encyclopaedia Britannica", "https://www.britannica.com/")
HUM = ("Smithsonian Human Origins", "https://humanorigins.si.edu/")
NASA= ("NASA Earth Observatory", "https://earthobservatory.nasa.gov/")
NOAA= ("NOAA Ocean Service", "https://oceanservice.noaa.gov/")

FOUNDATIONS = [
 {"id":"paleo-intro","title":"Welcome to paleontology","track":"foundations","level":"Foundations","src":"si","time":3,"art":"fossil",
  "explain":[
   "Paleontology is the science of ancient life. Paleontologists study fossils - the preserved remains and traces of living things - to learn about plants, animals and whole worlds that existed long before any people were around.",
   "Fossils are like clues in a mystery millions of years old. By carefully digging them up, comparing them and testing the rocks they came from, scientists can piece together what prehistoric creatures looked like, what they ate and how they lived."],
  "why":"Paleontology mixes biology, geology and detective work. Every fossil is a piece of evidence, and the story is still being written as new discoveries are made.",
  "hook":"The present is the key to the past.",
  "terms":[["Paleontology","The scientific study of ancient life through fossils."],["Fossil","The preserved remains or traces of a once-living thing."]],
  "sources":S(SI,AMNH),
  "quiz":[
   {"type":"mc","q":"What do paleontologists study?","choices":["Living rainforests","Fossils of ancient life","The weather","Distant planets"],"answer":1,"why":"Paleontology is the study of ancient life through fossils."},
   {"type":"tf","q":"Fossils can tell us about animals that lived before there were any people.","answer":True,"why":"True - most prehistoric life existed long before humans appeared."}]},

 {"id":"what-is-fossil","title":"What is a fossil?","track":"foundations","level":"Foundations","src":"nps","time":3,"art":"fossil",
  "explain":[
   "A fossil is any trace of past life preserved in rock. Body fossils are parts of the actual creature, such as bones, teeth, shells or leaves. Trace fossils are marks an animal left behind, like footprints, burrows or even droppings.",
   "Most fossils form when a dead plant or animal is quickly buried in mud or sand. Over long ages the soft parts rot away, while the hard parts may turn to stone as minerals seep in. Only a tiny fraction of living things ever become fossils."],
  "terms":[["Body fossil","A fossil of part of an organism itself, such as a bone or shell."],["Trace fossil","A fossil of something an animal did, such as a footprint or burrow."]],
  "sources":S(NPS,UCMP),
  "quiz":[
   {"type":"mc","q":"A dinosaur footprint preserved in rock is an example of a:","choices":["Body fossil","Trace fossil","Living fossil","Mineral"],"answer":1,"why":"A footprint records an animal's activity, so it is a trace fossil."},
   {"type":"mc","q":"Which is most likely to become a fossil?","choices":["Soft skin","A hard bone or shell","A puff of breath","A feeling"],"answer":1,"why":"Hard parts like bones, teeth and shells fossilise far more often than soft tissue."},
   {"type":"tf","q":"Almost every animal that ever lived became a fossil.","answer":False,"why":"False - only a very small fraction of living things are ever fossilised."}]},

 {"id":"deep-time","title":"Deep time: the age of the Earth","track":"foundations","level":"Foundations","src":"usgs","time":3,"art":"timescale",
  "explain":[
   "The Earth is about 4.5 billion years old. That stretch of time is so vast that scientists call it 'deep time'. If all of Earth's history were squeezed into a single day, humans would appear only in the last few seconds before midnight.",
   "Life has existed for most of that history, but for billions of years it was just tiny living things in the sea. Large animals are a fairly recent chapter, and the dinosaurs, though long gone, lived much closer to our own time than to the beginnings of life."],
  "why":"Deep time is hard to imagine because human lives are so short. Comparing Earth's history to a clock or a calendar helps make the scale real.",
  "terms":[["Deep time","The immense span of geological history, measured in millions and billions of years."],["Billion","One thousand million; the Earth is about 4.5 billion years old."]],
  "sources":S(USGS,NPS),
  "quiz":[
   {"type":"mc","q":"About how old is the Earth?","choices":["6,000 years","4.5 million years","4.5 billion years","450 billion years"],"answer":2,"why":"The Earth is about 4.5 billion years old."},
   {"type":"tf","q":"Humans have been on Earth for most of its history.","answer":False,"why":"False - humans appeared only very recently in Earth's long history."}]},

 {"id":"geologic-time-scale","title":"The geologic time scale","track":"foundations","level":"Foundations","src":"usgs","time":4,"art":"timescale",
  "explain":[
   "To organise deep time, scientists split Earth's history into named chunks. The biggest are eons, which break into eras, then periods, then epochs. Names like Jurassic, Cretaceous and Permian are periods you will meet again and again.",
   "These divisions are not random. Each boundary marks a real change in the rocks and the fossils, often a moment when many kinds of life appeared or disappeared. The time scale is the calendar all paleontologists share."],
  "terms":[["Period","A unit of the geologic time scale, such as the Jurassic or Cretaceous."],["Era","A large span of time made up of several periods, such as the Mesozoic Era."]],
  "sources":S(USGS,BRIT),
  "quiz":[
   {"type":"mc","q":"Which list goes from longest span to shortest?","choices":["Period, era, eon","Eon, era, period","Epoch, period, eon","Era, eon, period"],"answer":1,"why":"Eons are the largest divisions, then eras, then periods."},
   {"type":"mc","q":"The Jurassic and Cretaceous are examples of:","choices":["Eras","Periods","Continents","Rocks"],"answer":1,"why":"Jurassic and Cretaceous are periods of the geologic time scale."}]},

 {"id":"three-eras-life","title":"The three great eras of animal life","track":"foundations","level":"Foundations","src":"si","time":4,"art":"timescale",
  "explain":[
   "Since complex animals became common, Earth's history has had three great eras. The Paleozoic, the 'age of ancient life', saw fish, the first land plants and the first reptiles. The Mesozoic, the 'age of middle life', was the age of dinosaurs. The Cenozoic, the 'age of recent life', is the age of mammals - our own era.",
   "Two of the biggest extinctions in history mark the borders between these eras. The end of the Paleozoic and the end of the Mesozoic were each times when a huge share of life vanished, clearing the way for new groups to rise."],
  "terms":[["Mesozoic Era","The 'age of dinosaurs', made up of the Triassic, Jurassic and Cretaceous periods."],["Cenozoic Era","The 'age of mammals', the era we live in now, after the dinosaurs."]],
  "sources":S(SI,UCMP),
  "quiz":[
   {"type":"mc","q":"The Mesozoic Era is best known as the age of:","choices":["Mammals","Dinosaurs","Fish","People"],"answer":1,"why":"The Mesozoic is the age of dinosaurs."},
   {"type":"mc","q":"We currently live in the:","choices":["Paleozoic Era","Mesozoic Era","Cenozoic Era","Precambrian"],"answer":2,"why":"The Cenozoic, the age of mammals, is the era we live in today."},
   {"type":"tf","q":"Mass extinctions mark the boundaries between the great eras.","answer":True,"why":"True - the era boundaries fall at times of major extinction."}]},

 {"id":"what-is-dinosaur","title":"What is a dinosaur?","track":"foundations","level":"Foundations","src":"amnh","time":4,"art":"theropod",
  "explain":[
   "Dinosaurs are a group of reptiles that first appeared in the Triassic Period. Their key feature is in the legs: dinosaurs stand with their legs straight beneath their bodies, like a horse, rather than sprawled out to the sides, like a lizard. This upright stance let them walk, run and grow in new ways.",
   "Not every big prehistoric reptile was a dinosaur. Flying pterosaurs, swimming plesiosaurs and the sail-backed Dimetrodon are often called dinosaurs by mistake, but they belong to other groups. And one branch of dinosaurs is still alive today: the birds."],
  "why":"Knowing what makes a dinosaur a dinosaur helps sort the family tree, and reveals the surprise that birds are living dinosaurs.",
  "terms":[["Dinosaur","A reptile of a group with an upright leg posture, first appearing in the Triassic."],["Reptile","A scaly, usually egg-laying animal; dinosaurs were a special group of reptiles."]],
  "sources":S(AMNH,NHM),
  "quiz":[
   {"type":"mc","q":"What sets dinosaurs apart from lizards?","choices":["They lived in water","Their legs stand straight under the body","They had no bones","They could all fly"],"answer":1,"why":"Dinosaurs had an upright stance with legs beneath the body."},
   {"type":"mc","q":"Which of these is NOT a dinosaur?","choices":["Tyrannosaurus","Triceratops","Pteranodon","Stegosaurus"],"answer":2,"why":"Pteranodon is a flying reptile, a pterosaur, not a dinosaur."},
   {"type":"tf","q":"Birds are living dinosaurs.","answer":True,"why":"True - birds descend from small meat-eating dinosaurs and are part of the dinosaur family."}]},

 {"id":"saurischia-ornithischia","title":"The two great groups of dinosaurs","track":"foundations","level":"Core","src":"ucmp","time":4,"art":"sauropod",
  "explain":[
   "Dinosaurs are traditionally split into two groups based on the shape of their hip bones. The saurischians, or 'lizard-hipped' dinosaurs, include the meat-eating theropods and the long-necked sauropods. The ornithischians, or 'bird-hipped' dinosaurs, were all plant-eaters and include the horned, armoured, plated and duck-billed kinds.",
   "Oddly, birds did not come from the 'bird-hipped' group. They evolved from lizard-hipped theropods. The names describe the hip shape, not which group led to birds."],
  "terms":[["Saurischia","The 'lizard-hipped' dinosaurs, including theropods and sauropods."],["Ornithischia","The 'bird-hipped' dinosaurs, all plant-eaters, such as Triceratops and Stegosaurus."]],
  "sources":S(UCMP,AMNH),
  "quiz":[
   {"type":"mc","q":"Dinosaurs are traditionally divided by the shape of their:","choices":["Teeth","Hip bones","Tails","Eyes"],"answer":1,"why":"The two great groups are defined by hip-bone shape."},
   {"type":"tf","q":"All ornithischian dinosaurs were plant-eaters.","answer":True,"why":"True - the bird-hipped ornithischians were all herbivores."}]},

 {"id":"evolution-basics","title":"Evolution and natural selection","track":"foundations","level":"Foundations","src":"amnh","time":4,"art":"fossil",
  "explain":[
   "Evolution is the way living things change over many generations. Offspring are never exactly like their parents, and some small differences help an animal survive and have young. Those helpful features get passed on and become more common - a process called natural selection.",
   "Fossils capture evolution in action. By lining up fossils of different ages, scientists can watch features slowly change, such as fish fins becoming legs, or small many-toed horses becoming the single-toed horses of today."],
  "why":"Evolution ties all of life together and explains why fossils form a branching family tree rather than a random jumble.",
  "terms":[["Evolution","The change in living things over many generations."],["Natural selection","The process where helpful traits become more common because they aid survival."]],
  "sources":S(AMNH,UCMP),
  "quiz":[
   {"type":"mc","q":"Natural selection favours traits that:","choices":["Look the nicest","Help an animal survive and reproduce","Are the largest","Appear by magic"],"answer":1,"why":"Traits that aid survival and reproduction become more common over time."},
   {"type":"tf","q":"Fossils of different ages can show features changing over time.","answer":True,"why":"True - the fossil record captures evolutionary change."}]},

 {"id":"tree-of-life","title":"The tree of life","track":"foundations","level":"Core","src":"ucmp","time":3,"art":"fossil",
  "explain":[
   "All living things, past and present, are related like branches on a giant family tree. Closely related groups sit on nearby branches because they share a recent common ancestor. Scientists work out the branches by comparing bones, bodies and, for living things, DNA.",
   "The tree shows surprising links. Crocodiles are closer cousins to birds and dinosaurs than they are to lizards, and whales sit on a branch among hoofed mammals. The fossil record helps fill in the older, deeper parts of the tree."],
  "terms":[["Common ancestor","A species from which two or more later groups both descend."],["Classification","Sorting living things into groups based on how they are related."]],
  "sources":S(UCMP,SI),
  "quiz":[
   {"type":"mc","q":"Two groups are closely related when they share a recent:","choices":["Habitat","Common ancestor","Colour","Size"],"answer":1,"why":"Closely related groups share a recent common ancestor."},
   {"type":"tf","q":"Crocodiles are more closely related to birds than to lizards.","answer":True,"why":"True - crocodiles and birds share a closer common ancestor with each other."}]},

 {"id":"naming-dinosaurs","title":"How dinosaurs get their names","track":"foundations","level":"Core","src":"nhm","time":3,"art":"fossil",
  "explain":[
   "Every kind of animal, living or extinct, gets a two-part scientific name in Latin or Greek. The first part is the genus, like Tyrannosaurus, and the second is the species, like rex. Together, Tyrannosaurus rex names one exact kind of animal that scientists everywhere recognise.",
   "Names often describe the animal or honour a place or person. 'Tyrannosaurus rex' means 'tyrant lizard king'. 'Triceratops' means 'three-horned face'. Learning what the names mean is a fun way to remember each creature."],
  "terms":[["Genus","The first part of a scientific name, shared by closely related species."],["Species","The second part of a scientific name, identifying one exact kind of organism."]],
  "sources":S(NHM,BRIT),
  "quiz":[
   {"type":"mc","q":"In 'Tyrannosaurus rex', the word 'Tyrannosaurus' is the:","choices":["Species","Genus","Nickname","Period"],"answer":1,"why":"The first part of the name is the genus."},
   {"type":"mc","q":"What does 'Triceratops' mean?","choices":["Giant lizard","Three-horned face","Fast runner","Tiny tooth"],"answer":1,"why":"'Triceratops' means 'three-horned face'."}]},

 {"id":"extinction-fact","title":"Extinction: a fact of life","track":"foundations","level":"Foundations","src":"si","time":3,"art":"extinction",
  "explain":[
   "Extinction is when the last member of a kind of living thing dies and that species is gone forever. It is a normal part of life's story: most species that have ever lived are now extinct, usually dying out slowly as the world changes around them.",
   "Sometimes, though, huge numbers of species die out together in a short time. These mass extinctions are rare but powerful, and each one has reshaped life on Earth by ending old groups and giving new ones their chance."],
  "why":"Extinction is not just about disasters. It is the constant background to evolution, and understanding it helps explain why the living world looks the way it does.",
  "terms":[["Extinction","The permanent loss of a kind of living thing when its last members die."],["Mass extinction","A short span in which a large share of all species die out."]],
  "sources":S(SI,USGS),
  "quiz":[
   {"type":"mc","q":"A species is extinct when:","choices":["It moves away","Its last members have died","It changes colour","It falls asleep"],"answer":1,"why":"Extinction means the last members of a species have died."},
   {"type":"tf","q":"Most species that have ever lived are now extinct.","answer":True,"why":"True - extinction is the normal fate of the vast majority of species."}]},

 {"id":"pangaea","title":"Pangaea and drifting continents","track":"foundations","level":"Core","src":"usgs","time":4,"art":"strata",
  "explain":[
   "The continents are not fixed. They ride on giant slabs of the Earth's shell that slowly move, only a few centimetres a year. Long ago this drift gathered nearly all the land into one supercontinent called Pangaea, surrounded by a single great ocean.",
   "Pangaea formed near the end of the Paleozoic and broke apart through the age of dinosaurs. That is why the same kinds of fossils turn up on continents now separated by wide oceans - those lands were once joined together."],
  "terms":[["Pangaea","The supercontinent that joined nearly all land before the age of dinosaurs."],["Continental drift","The slow movement of continents across the Earth's surface over millions of years."]],
  "sources":S(USGS,NPS),
  "quiz":[
   {"type":"mc","q":"Pangaea was a single huge:","choices":["Ocean","Supercontinent","Volcano","Glacier"],"answer":1,"why":"Pangaea was a supercontinent joining nearly all the land."},
   {"type":"tf","q":"Matching fossils on far-apart continents show those lands were once joined.","answer":True,"why":"True - shared fossils are evidence the continents were once connected."}]},
]

GEOLOGY = [
 {"id":"reading-rocks","title":"Reading the story in the rocks","track":"geology","level":"Foundations","src":"usgs","time":4,"art":"strata",
  "explain":[
   "Rocks are like the pages of a giant history book. Layers of sand and mud settle on top of one another and slowly harden into rock, with the oldest layers at the bottom and the youngest on top. Fossils sit inside the layers like bookmarks showing what lived at each time.",
   "By reading the order of the layers, geologists work out the sequence of past events. A canyon wall can reveal millions of years of history, from ancient seas to deserts to swamps, all stacked one above the next."],
  "why":"The simple rule that lower layers are older is the foundation of how we read deep time from the rocks.",
  "terms":[["Strata","Layers of rock, usually stacked oldest at the bottom and youngest on top."],["Superposition","The rule that in undisturbed layers, lower rock is older than the rock above it."]],
  "sources":S(USGS,NPS),
  "quiz":[
   {"type":"mc","q":"In undisturbed rock layers, the oldest layer is usually:","choices":["At the top","At the bottom","In the middle","Missing"],"answer":1,"why":"By the rule of superposition, lower layers are older."},
   {"type":"tf","q":"Rock layers can record millions of years of Earth's history.","answer":True,"why":"True - stacked strata preserve long sequences of past events."}]},

 {"id":"sedimentary-rock","title":"Sedimentary rock: where fossils live","track":"geology","level":"Foundations","src":"usgs","time":4,"art":"strata",
  "explain":[
   "Almost all fossils are found in sedimentary rock. It forms when bits of sand, mud and shell pile up in layers, usually under water, and are pressed and cemented into stone over long ages. Sandstone, mudstone and limestone are common examples.",
   "Because sedimentary rock builds up gently, a dead animal can be buried softly and preserved. Igneous rock from cooled lava and metamorphic rock changed by heat and pressure almost never hold fossils, since their fierce conditions would destroy them."],
  "terms":[["Sedimentary rock","Rock formed from layers of sediment such as sand, mud or shell."],["Sediment","Loose bits of rock, sand, mud or shell that can pile up and harden into rock."]],
  "sources":S(USGS,UCMP),
  "quiz":[
   {"type":"mc","q":"Most fossils are found in which kind of rock?","choices":["Igneous","Sedimentary","Metamorphic","Molten"],"answer":1,"why":"Fossils are almost always found in sedimentary rock."},
   {"type":"mc","q":"Sedimentary rock forms mainly from:","choices":["Cooling lava","Layers of sediment pressed together","Melting metal","Lightning"],"answer":1,"why":"It forms from layers of sediment cemented into stone."},
   {"type":"tf","q":"Lava-formed igneous rock is the best place to find dinosaur bones.","answer":False,"why":"False - fossils form in sedimentary rock, not in igneous rock from lava."}]},

 {"id":"dating-rocks","title":"How we date the rocks","track":"geology","level":"Core","src":"usgs","time":4,"art":"strata",
  "explain":[
   "Scientists date rocks in two main ways. Relative dating tells which rocks are older or younger by their order in the layers. Absolute dating gives an actual age in years, often by measuring radioactive elements in the rock that break down at a steady, known rate, like a natural clock.",
   "Volcanic ash layers are especially useful, because they can be dated very precisely and often sit just above or below fossil beds. Together these methods let scientists say not just which fossils are older, but roughly how many millions of years old they are."],
  "terms":[["Relative dating","Working out the order of events by the position of rock layers."],["Radiometric dating","Finding a rock's age in years by measuring radioactive elements that decay at a known rate."]],
  "sources":S(USGS,UCMP),
  "quiz":[
   {"type":"mc","q":"Radiometric dating gives a rock's age by measuring:","choices":["Its colour","Radioactive elements decaying at a steady rate","Its weight","How shiny it is"],"answer":1,"why":"It measures radioactive decay, which happens at a known, steady rate."},
   {"type":"mc","q":"Telling only whether one layer is older than another is called:","choices":["Relative dating","Absolute dating","Carbon dating","Guessing"],"answer":0,"why":"Relative dating gives the order, not an exact age."}]},

 {"id":"plate-tectonics","title":"Moving plates and mountains","track":"geology","level":"Core","src":"usgs","time":4,"art":"volcano",
  "explain":[
   "The Earth's hard outer shell is cracked into huge pieces called tectonic plates that slowly slide over the hot, soft rock beneath. Where plates pull apart, push together or grind past one another, they build mountains, open oceans and set off earthquakes and volcanoes.",
   "This slow churning has reshaped the planet again and again, joining and splitting continents over hundreds of millions of years. It moved the lands the dinosaurs lived on and keeps redrawing the map even today."],
  "terms":[["Tectonic plate","A giant piece of the Earth's outer shell that slowly moves."],["Volcano","An opening where molten rock reaches the surface, often where plates meet."]],
  "sources":S(USGS,NPS),
  "quiz":[
   {"type":"mc","q":"Tectonic plates are giant moving pieces of the Earth's:","choices":["Atmosphere","Outer shell","Core","Oceans only"],"answer":1,"why":"Plates are large slabs of the Earth's outer shell."},
   {"type":"tf","q":"Moving plates can build mountains and trigger volcanoes.","answer":True,"why":"True - plate movements raise mountains and cause volcanoes and earthquakes."}]},

 {"id":"precambrian","title":"The Precambrian: life's long beginning","track":"geology","level":"Core","src":"si","time":4,"art":"ediacaran",
  "explain":[
   "The Precambrian covers the first four billion years of Earth's history, nearly nine-tenths of all time. For most of it, life was nothing but microscopic single cells in the sea. These tiny living things slowly changed the planet, even filling the air with the oxygen we breathe today.",
   "Only near the very end of the Precambrian, in the Ediacaran Period, did the first large, soft-bodied animals appear. Strange frond-like and disc-shaped creatures lived on the sea floor, the earliest big animals in the fossil record."],
  "terms":[["Precambrian","The vast first stretch of Earth's history, before abundant animal fossils."],["Microbe","A living thing too small to see without a microscope, such as a bacterium."]],
  "sources":S(SI,UCMP),
  "quiz":[
   {"type":"mc","q":"For most of the Precambrian, life was made of:","choices":["Dinosaurs","Tiny single cells","Giant trees","Fish"],"answer":1,"why":"Life was microscopic single cells for most of the Precambrian."},
   {"type":"tf","q":"Early life helped add oxygen to Earth's air.","answer":True,"why":"True - early microbes released the oxygen that built up in the atmosphere."}]},

 {"id":"cambrian-explosion","title":"The Cambrian explosion","track":"geology","level":"Core","src":"si","time":4,"art":"anomalocaris",
  "explain":[
   "About 539 million years ago, the Cambrian Period opened with a burst of new life sometimes called the Cambrian explosion. In a relatively short time, most of the major groups of animals appeared in the seas, many with shells, eyes, legs and the first hard parts.",
   "Famous fossil sites like the Burgess Shale preserve this strange early world in stunning detail, including soft bodies that rarely fossilise. Trilobites scuttled across the sea floor while the metre-long hunter Anomalocaris cruised above."],
  "terms":[["Cambrian explosion","The rapid appearance of most major animal groups early in the Cambrian Period."],["Burgess Shale","A famous Canadian fossil site preserving soft-bodied Cambrian animals."]],
  "sources":S(SI,UCMP),
  "quiz":[
   {"type":"mc","q":"The Cambrian explosion was a burst in the variety of:","choices":["Plants on land","Animals in the sea","Flying insects","Mammals"],"answer":1,"why":"Most major animal groups appeared in the seas during the Cambrian."},
   {"type":"tf","q":"The Burgess Shale preserves even soft-bodied Cambrian animals.","answer":True,"why":"True - it is famous for its exquisite soft-body preservation."}]},

 {"id":"age-of-fishes","title":"The Devonian: the Age of Fishes","track":"geology","level":"Core","src":"nhm","time":4,"art":"dunkleosteus",
  "explain":[
   "The Devonian Period, around 419 to 359 million years ago, is nicknamed the Age of Fishes because the seas teemed with them. Among the giants was Dunkleosteus, an armoured fish up to six metres long whose head was sheathed in bony plates instead of scales.",
   "On land, the first forests took root, and most importantly, some lobe-finned fish began crawling into the shallows. Their sturdy fins would slowly become legs, leading to the very first four-legged animals to walk on land."],
  "terms":[["Devonian","A period about 419 to 359 million years ago, rich in fish and the first forests."],["Lobe-finned fish","Fish with strong, fleshy fins; their relatives gave rise to land animals."]],
  "sources":S(NHM,UCMP),
  "quiz":[
   {"type":"mc","q":"The Devonian Period is nicknamed the Age of:","choices":["Dinosaurs","Fishes","Mammals","Flowers"],"answer":1,"why":"The Devonian is called the Age of Fishes."},
   {"type":"tf","q":"During the Devonian, some fish began moving onto land.","answer":True,"why":"True - lobe-finned fish crawled ashore, leading to the first land vertebrates."}]},

 {"id":"coal-forests","title":"The Carboniferous coal forests","track":"geology","level":"Core","src":"nhm","time":4,"art":"fern",
  "explain":[
   "The Carboniferous Period, about 359 to 299 million years ago, was a hothouse of vast swampy forests. Giant club-mosses and tree-sized horsetails grew tens of metres tall. When they died and were buried, their remains slowly turned into the coal we still burn today, giving the period its name.",
   "The air held more oxygen than now, and that helped some creatures grow huge. Dragonfly relatives had wingspans the width of a hawk, and millipede relatives grew over two metres long, crawling among the towering trees."],
  "terms":[["Carboniferous","A coal-forming period about 359 to 299 million years ago of vast swampy forests."],["Coal","A black rock formed from the buried remains of ancient swamp plants."]],
  "sources":S(NHM,USGS),
  "quiz":[
   {"type":"mc","q":"The Carboniferous Period is named for its vast deposits of:","choices":["Salt","Coal","Iron","Gold"],"answer":1,"why":"Buried swamp forests of the Carboniferous formed coal."},
   {"type":"tf","q":"Extra oxygen in the air helped some Carboniferous insects grow very large.","answer":True,"why":"True - high oxygen levels are linked to the giant insects of the period."}]},

 {"id":"great-dying","title":"The Permian extinction: the Great Dying","track":"geology","level":"Core","src":"si","time":4,"art":"extinction",
  "explain":[
   "The Permian Period ended about 252 million years ago in the largest mass extinction in Earth's history, often called the Great Dying. As much as nine in ten species in the sea disappeared, along with most life on land. It was the closest life has ever come to being wiped out entirely.",
   "Scientists link the disaster to enormous volcanic eruptions in what is now Siberia, which poured out gases that warmed the planet and poisoned the seas. Life took millions of years to recover, but the survivors set the stage for the dinosaurs to come."],
  "terms":[["Permian","A period about 299 to 252 million years ago, ending in the largest extinction ever."],["The Great Dying","The end-Permian mass extinction, the most severe in Earth's history."]],
  "sources":S(SI,USGS),
  "quiz":[
   {"type":"mc","q":"The end-Permian extinction is the largest in Earth's history and is nicknamed the:","choices":["Big Freeze","Great Dying","Long Sleep","Last Stand"],"answer":1,"why":"The end-Permian event is called the Great Dying."},
   {"type":"mc","q":"What is thought to have driven the Great Dying?","choices":["A giant flood","Massive volcanic eruptions","An ice age caused by the Moon","Too many plants"],"answer":1,"why":"Huge Siberian volcanic eruptions are the leading cause."},
   {"type":"tf","q":"The Great Dying wiped out the dinosaurs.","answer":False,"why":"False - the dinosaurs appeared after this event, in the Triassic."}]},

 {"id":"triassic-world","title":"The Triassic: dawn of the dinosaurs","track":"geology","level":"Core","src":"amnh","time":4,"art":"earlydino",
  "explain":[
   "The Triassic Period, about 252 to 201 million years ago, began in a world recovering from the Great Dying. With so many old groups gone, new ones spread out. Among them, the very first dinosaurs appeared - small, fast, two-legged animals that were not yet the giants to come.",
   "The first true mammals also arose in the Triassic, tiny and shrew-like. The land was still joined as Pangaea, and crocodile-line reptiles ruled many habitats before the dinosaurs rose to dominate."],
  "terms":[["Triassic","A period about 252 to 201 million years ago when dinosaurs and mammals first appeared."],["Archosaur","A reptile of the crocodile and dinosaur line, common in the Triassic."]],
  "sources":S(AMNH,UCMP),
  "quiz":[
   {"type":"mc","q":"The first dinosaurs appeared during the:","choices":["Triassic Period","Cambrian Period","Ice Age","Devonian Period"],"answer":0,"why":"Dinosaurs first appeared in the Triassic."},
   {"type":"tf","q":"The first mammals also appeared in the Triassic.","answer":True,"why":"True - the earliest true mammals arose in the Triassic, small and shrew-like."}]},

 {"id":"jurassic-world","title":"The Jurassic: age of giants","track":"geology","level":"Core","src":"amnh","time":4,"art":"sauropod",
  "explain":[
   "The Jurassic Period, about 201 to 145 million years ago, was the heyday of the giant dinosaurs. Enormous long-necked sauropods like Brachiosaurus and Diplodocus browsed lush forests, while predators such as Allosaurus hunted among them. The first birds, like Archaeopteryx, also took to the air.",
   "Pangaea was breaking apart, opening new seas and spreading damp, green landscapes. Warm, wet conditions across much of the world fed thick plant growth, supporting the largest land animals that had ever lived."],
  "terms":[["Jurassic","A period about 201 to 145 million years ago when giant dinosaurs ruled the land."],["Sauropod","A giant, long-necked, plant-eating dinosaur that walked on four legs."]],
  "sources":S(AMNH,NHM),
  "quiz":[
   {"type":"mc","q":"The Jurassic is especially famous for its giant:","choices":["Insects","Long-necked sauropod dinosaurs","Whales","Flowering trees"],"answer":1,"why":"The Jurassic was the heyday of giant long-necked sauropods."},
   {"type":"tf","q":"The earliest birds appeared during the Jurassic.","answer":True,"why":"True - early birds such as Archaeopteryx date to the Jurassic."}]},

 {"id":"cretaceous-world","title":"The Cretaceous: flowers and last dinosaurs","track":"geology","level":"Core","src":"amnh","time":4,"art":"ceratopsian",
  "explain":[
   "The Cretaceous Period, about 145 to 66 million years ago, was the last and longest chapter of the dinosaur age. It brought some of the most famous dinosaurs of all, including Tyrannosaurus, Triceratops and the duck-billed hadrosaurs. The continents were drifting into shapes we would start to recognise.",
   "A major change swept the land: flowering plants appeared and spread, bringing the first blossoms and, with them, many new insects. Then, at the very end of the period, a sudden catastrophe ended the age of dinosaurs."],
  "terms":[["Cretaceous","A period about 145 to 66 million years ago, ending when the non-bird dinosaurs died out."],["Flowering plant","A plant that produces flowers and seeds, first spreading in the Cretaceous."]],
  "sources":S(AMNH,NHM),
  "quiz":[
   {"type":"mc","q":"Which group of plants first spread during the Cretaceous?","choices":["Mosses","Flowering plants","Giant club-mosses","Seaweeds"],"answer":1,"why":"Flowering plants appeared and spread in the Cretaceous."},
   {"type":"tf","q":"Tyrannosaurus and Triceratops both lived in the Cretaceous.","answer":True,"why":"True - both are famous Late Cretaceous dinosaurs."}]},

 {"id":"kpg-extinction","title":"The day the dinosaurs died","track":"geology","level":"Core","src":"si","time":5,"art":"extinction",
  "explain":[
   "About 66 million years ago, the age of dinosaurs ended in a single catastrophe. A mountain-sized asteroid struck what is now Mexico, blasting out a crater over 150 kilometres wide. The impact threw so much dust and soot into the sky that sunlight was blocked for months or years, and plants withered.",
   "With the food chains collapsing, all the non-bird dinosaurs died out, along with the flying pterosaurs and the great marine reptiles. Only some smaller animals, including the ancestors of today's birds and mammals, survived to inherit the changed world."],
  "why":"This is the most famous extinction of all, and the evidence - a worldwide layer of impact dust and a buried crater - shows how science pieces such events together.",
  "terms":[["Asteroid","A large rocky body from space; one struck Earth at the end of the Cretaceous."],["K-Pg boundary","The thin rock layer marking the extinction at the end of the Cretaceous."]],
  "sources":S(SI,USGS),
  "quiz":[
   {"type":"mc","q":"What is thought to have ended the age of dinosaurs?","choices":["A long ice age","A giant asteroid impact","A disease","Rising seas alone"],"answer":1,"why":"A giant asteroid impact about 66 million years ago is the leading cause."},
   {"type":"mc","q":"Which group survived the end-Cretaceous extinction?","choices":["Non-bird dinosaurs","Pterosaurs","Birds","Giant marine reptiles"],"answer":2,"why":"Birds, descended from small dinosaurs, survived."},
   {"type":"tf","q":"The asteroid impact left a huge buried crater near present-day Mexico.","answer":True,"why":"True - the Chicxulub crater records the impact."}]},

 {"id":"ancient-climates","title":"Reading ancient climates","track":"geology","level":"Core","src":"nasa","time":4,"art":"strata",
  "explain":[
   "Rocks and fossils record not just what lived, but what the weather and seasons were like long ago. Coal beds point to warm, wet swamps, while certain rocks and scratch marks reveal ancient deserts or sheets of ice. Fossil leaves can even hint at past temperature and rainfall by their size and shape.",
   "Studying these clues shows that Earth's climate has swung between hot greenhouse worlds and cold icehouse worlds many times. Much of the dinosaur age was warmer than today, with no permanent polar ice caps."],
  "terms":[["Climate","The usual pattern of temperature and weather in a place over many years."],["Ice age","A long cold span when great ice sheets spread over the land."]],
  "sources":S(NASA,USGS),
  "quiz":[
   {"type":"mc","q":"Thick coal beds usually point to an ancient climate that was:","choices":["Cold and dry","Warm and swampy","Frozen","Airless"],"answer":1,"why":"Coal forms from lush, warm, swampy forests."},
   {"type":"tf","q":"Much of the dinosaur age was warmer than today, without permanent polar ice.","answer":True,"why":"True - the Mesozoic was largely a warm, ice-free greenhouse world."}]},

 {"id":"five-extinctions","title":"The five great mass extinctions","track":"geology","level":"Core","src":"si","time":4,"art":"extinction",
  "explain":[
   "Life has been struck by disaster many times, but five stand out as the 'Big Five' mass extinctions. They came at the end of the Ordovician, in the Late Devonian, at the end of the Permian, the end of the Triassic, and the end of the Cretaceous. Each wiped out a huge share of living things.",
   "Different causes lay behind them, from sudden cold snaps to vast volcanic eruptions to an asteroid strike. Yet each disaster also opened the door for survivors to spread, proving that even the greatest catastrophes are turning points in the long story of life."],
  "why":"Seeing extinction as a repeating pattern, not a one-off, reveals how life has been reshaped again and again across deep time.",
  "terms":[["Big Five","The five largest mass extinctions in Earth's history."],["Catastrophe","A sudden, widespread disaster, such as a mass extinction."]],
  "sources":S(SI,USGS),
  "quiz":[
   {"type":"mc","q":"How many extinctions make up the famous 'Big Five'?","choices":["Two","Five","Ten","Twenty"],"answer":1,"why":"The 'Big Five' refers to the five largest mass extinctions."},
   {"type":"mc","q":"Which extinction ended the age of dinosaurs?","choices":["End-Ordovician","End-Permian","End-Cretaceous","End-Triassic"],"answer":2,"why":"The end-Cretaceous extinction ended the dinosaur age."},
   {"type":"tf","q":"Mass extinctions can clear the way for new groups to spread.","answer":True,"why":"True - survivors often expand after a mass extinction."}]},

 {"id":"cenozoic-cooling","title":"The world cools: ice and grass","track":"geology","level":"Core","src":"nasa","time":4,"art":"mammoth",
  "explain":[
   "After the dinosaurs vanished, the world was warm, but over tens of millions of years it slowly cooled. As temperatures dropped, thick forests gave way in many places to open grasslands, and great sheets of ice began to build at the poles.",
   "This cooling shaped the age of mammals. Grazing herds spread across the new grasslands, and during the recent Ice Ages, cold-adapted giants like the woolly mammoth roamed the frozen north. The climate we know today is the latest chapter of that long cooling."],
  "terms":[["Grassland","Open land covered in grasses, which spread as the world cooled."],["Polar ice","Sheets of ice at the poles, which grew during the cooling of recent times."]],
  "sources":S(NASA,SI),
  "quiz":[
   {"type":"mc","q":"As the Cenozoic world cooled, forests in many places gave way to:","choices":["Deserts only","Open grasslands","Coal swamps","Oceans"],"answer":1,"why":"Cooling spread open grasslands during the age of mammals."},
   {"type":"tf","q":"The woolly mammoth lived during recent Ice Ages of the cooling world.","answer":True,"why":"True - mammoths were cold-adapted animals of the Ice Age north."}]},
]
