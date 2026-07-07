# -*- coding: utf-8 -*-
"""PaleoHype concept lessons. Part 3: methods (Doing Paleontology),
flora (Prehistoric Plants & Invertebrates intro), fauna (Dinosaur biology)."""

from concepts_a import S, SI, AMNH, UCMP, USGS, NPS, NHM, FMNH, BRIT, HUM

METHODS = [
 {"id":"what-paleontologists-do","title":"What paleontologists do","track":"methods","level":"Core","src":"amnh","time":4,"art":"museum",
  "explain":[
   "Paleontologists are scientists who study ancient life. Their work goes far beyond digging. They hunt for fossils in the field, clean and study them in the lab, compare them with living animals, and publish what they learn so other scientists can build on it.",
   "The job blends many skills. A paleontologist might use geology to date rocks, biology to understand bodies, and even computers to model how an extinct animal moved. Above all, they ask careful questions and test their ideas against the evidence in the rocks."],
  "terms":[["Paleontologist","A scientist who studies ancient life through fossils."],["Hypothesis","A testable idea that scientists check against evidence."]],
  "sources":S(AMNH,UCMP),
  "quiz":[
   {"type":"mc","q":"Paleontologists spend their time:","choices":["Only digging","Finding, studying and comparing fossils","Only in museums","Inventing fossils"],"answer":1,"why":"Their work spans fieldwork, lab study and comparison."},
   {"type":"tf","q":"Paleontology combines geology and biology.","answer":True,"why":"True - it draws on both the study of rocks and of living things."}]},

 {"id":"history-paleontology","title":"A short history of paleontology","track":"methods","level":"Core","src":"nhm","time":4,"art":"fossil",
  "explain":[
   "People have wondered about fossils for thousands of years, sometimes explaining giant bones as dragons or giants. Real progress came in the 1800s, when early scientists like Mary Anning, who found great marine reptiles on the English coast, helped show these were ancient creatures.",
   "The word 'dinosaur', meaning 'terrible lizard', was coined in 1842. Over the following two centuries, fossil hunting spread worldwide, and new tools and discoveries keep reshaping our picture of prehistoric life right up to today."],
  "terms":[["Mary Anning","A pioneering 1800s fossil hunter who found early marine reptiles in England."],["Dinosaur","Meaning 'terrible lizard', a name first coined in 1842."]],
  "sources":S(NHM,BRIT),
  "quiz":[
   {"type":"mc","q":"The word 'dinosaur' means:","choices":["Giant tooth","Terrible lizard","Old bone","Stone beast"],"answer":1,"why":"'Dinosaur' means 'terrible lizard'."},
   {"type":"tf","q":"Mary Anning was an important early fossil hunter.","answer":True,"why":"True - she discovered early marine reptiles on the English coast."}]},

 {"id":"famous-sites","title":"Famous fossil sites of the world","track":"methods","level":"Core","src":"nps","time":4,"art":"excavation",
  "explain":[
   "Certain places are famous for the fossils they yield. The Morrison rocks of the American West are full of Jurassic dinosaurs. The badlands of Alberta, Canada, and the Gobi Desert in Mongolia have produced many Cretaceous discoveries, including dinosaur eggs and nests.",
   "Other sites are prized for their detail rather than size, like the Burgess Shale in Canada with its soft-bodied Cambrian animals, and the limestone quarries of Germany that preserved feathered Archaeopteryx. Each site is a precious window into a particular time and place."],
  "terms":[["Morrison Formation","Jurassic rocks of the American West, rich in dinosaur fossils."],["Gobi Desert","A Mongolian desert famous for Cretaceous dinosaur eggs and nests."]],
  "sources":S(NPS,AMNH),
  "quiz":[
   {"type":"mc","q":"The Gobi Desert is especially famous for dinosaur:","choices":["Footprints only","Eggs and nests","Feathers only","Teeth only"],"answer":1,"why":"The Gobi has yielded many dinosaur eggs and nests."},
   {"type":"tf","q":"The Morrison rocks of the American West are rich in Jurassic dinosaurs.","answer":True,"why":"True - the Morrison Formation is a famous Jurassic dinosaur source."}]},

 {"id":"how-we-know-looks","title":"How we know what dinosaurs looked like","track":"methods","level":"Core","src":"amnh","time":4,"art":"theropod",
  "explain":[
   "Bones are only the start. Scientists rebuild a dinosaur's body by studying how its bones fit together and where muscles once attached, leaving marks on the bone. Comparing it with living relatives, such as birds and crocodiles, helps fill in the soft parts.",
   "Skin impressions, feather fossils and even traces of colour pigments have added skin texture and, in a few cases, real colours. Even so, some details remain educated guesses, and dinosaur reconstructions are updated as new evidence comes in."],
  "terms":[["Reconstruction","A scientific rebuilding of how an extinct animal looked or moved."],["Muscle scar","A mark on a bone showing where a muscle once attached."]],
  "sources":S(AMNH,NHM),
  "quiz":[
   {"type":"mc","q":"Marks on a bone showing where muscles attached help scientists rebuild a dinosaur's:","choices":["Colour","Body shape","Smell","Voice"],"answer":1,"why":"Muscle scars help reconstruct the animal's body shape."},
   {"type":"tf","q":"Fossil pigments have let scientists work out the colours of some dinosaurs.","answer":True,"why":"True - preserved pigment structures have revealed some real colours."}]},

 {"id":"warm-or-cold","title":"Were dinosaurs warm-blooded?","track":"methods","level":"Core","src":"ucmp","time":4,"art":"theropod",
  "explain":[
   "For a long time dinosaurs were imagined as slow, cold-blooded reptiles. Newer evidence has changed that picture. The structure of their bones, their active lifestyles, and their close link to warm-blooded birds suggest many dinosaurs ran warm and lived at a fast pace.",
   "The truth may lie in between for some kinds. Studying growth rings in bones and chemical clues, scientists now think many dinosaurs controlled their body heat better than typical reptiles, helping explain how some grew so large and active."],
  "terms":[["Warm-blooded","Able to keep a steady, warm body temperature, like birds and mammals."],["Growth rings","Rings in bone that record an animal's growth, like rings in a tree."]],
  "sources":S(UCMP,AMNH),
  "quiz":[
   {"type":"mc","q":"Newer evidence suggests many dinosaurs were:","choices":["Slow and cold-blooded","Active and fairly warm-bodied","Made of stone","Unable to move"],"answer":1,"why":"Bone structure and bird links point to active, warmer-bodied dinosaurs."},
   {"type":"tf","q":"Dinosaurs were closely related to warm-blooded birds.","answer":True,"why":"True - birds are living dinosaurs and are warm-blooded."}]},

 {"id":"size-and-speed","title":"How big and how fast?","track":"methods","level":"Core","src":"nhm","time":4,"art":"sauropod",
  "explain":[
   "We can't weigh a living dinosaur, so scientists estimate size from the bones. They measure the skeleton, build a model of the body, and compare with living animals to judge weight. That is how we can say a big sauropod may have weighed as much as several elephants.",
   "Speed is trickier still. Fossil trackways give clues: the spacing of footprints, combined with leg length, lets scientists estimate how fast an animal was moving when it left those prints. The numbers are careful estimates, not exact measurements."],
  "terms":[["Estimate","A careful scientific guess based on measurement and comparison."],["Mass","How much matter something contains; dinosaur mass is estimated from bones."]],
  "sources":S(NHM,UCMP),
  "quiz":[
   {"type":"mc","q":"Scientists estimate a dinosaur's speed mainly from its:","choices":["Colour","Fossil trackways and leg length","Teeth","Eye size"],"answer":1,"why":"Trackway spacing and leg length give speed estimates."},
   {"type":"tf","q":"Dinosaur weights are exact measurements, not estimates.","answer":False,"why":"False - weights are careful estimates based on the skeleton."}]},

 {"id":"dinosaurs-not-extinct","title":"Dinosaurs are not all extinct","track":"methods","level":"Core","src":"amnh","time":4,"art":"terrorbird",
  "explain":[
   "Here is one of the biggest surprises in science: not all dinosaurs died out. Birds are the living descendants of small, feathered, meat-eating dinosaurs. The same family tree that holds Tyrannosaurus also leads, branch by branch, to the sparrow at your window.",
   "Fossils like the feathered Archaeopteryx, with wings but also teeth and a bony tail, capture the link beautifully. So while the giant dinosaurs are gone, their relatives are all around us - over ten thousand kinds of birds alive today."],
  "why":"Realising birds are living dinosaurs reshapes how we see both groups, and shows how the deep past connects to the living world.",
  "terms":[["Bird","A feathered, usually flying animal; birds are living dinosaurs."],["Archaeopteryx","An early bird-like dinosaur linking dinosaurs and modern birds."]],
  "sources":S(AMNH,NHM),
  "quiz":[
   {"type":"mc","q":"Which living animals are descended from dinosaurs?","choices":["Lizards","Birds","Frogs","Fish"],"answer":1,"why":"Birds descend from small meat-eating dinosaurs."},
   {"type":"tf","q":"Archaeopteryx had both wings and teeth.","answer":True,"why":"True - it combined bird-like wings with teeth and a bony tail."}]},

 {"id":"careers-paleo","title":"Careers in paleontology","track":"methods","level":"Core","src":"fmnh","time":4,"art":"museum",
  "explain":[
   "Paleontology offers many paths. Field paleontologists hunt and excavate fossils. Lab preparators clean and repair them. Museum curators care for collections and design exhibits, while researchers study the fossils and teach. Artists reconstruct extinct animals, and educators share the science with the public.",
   "Most paleontologists study geology or biology at university, then specialise. But you do not need a degree to begin: volunteering at a museum, joining a fossil club, or simply learning all you can are great first steps for any budding scientist."],
  "terms":[["Curator","A person who cares for a museum's collections and exhibits."],["Volunteer","Someone who helps without pay; a common way to start in paleontology."]],
  "sources":S(FMNH,NPS),
  "quiz":[
   {"type":"mc","q":"A museum worker who cares for fossil collections is a:","choices":["Curator","Pilot","Chef","Banker"],"answer":0,"why":"Curators care for collections and exhibits."},
   {"type":"tf","q":"Volunteering at a museum is a good way to start in paleontology.","answer":True,"why":"True - volunteering and fossil clubs are great first steps."}]},
]

FLORA = [
 {"id":"first-life","title":"The first life on Earth","track":"flora","level":"Foundations","src":"si","time":4,"art":"ediacaran",
  "explain":[
   "Life began astonishingly early, more than three and a half billion years ago, as simple single cells in the sea. For most of Earth's history, that was all there was. Among the most important were cyanobacteria, tiny microbes that released oxygen, slowly changing the whole planet.",
   "Mats of these microbes built layered mounds called stromatolites, some of which still form today. The long, quiet age of single-celled life set the stage for everything that followed, including every plant and animal."],
  "terms":[["Stromatolite","A layered mound built by mats of microbes, among the oldest signs of life."],["Cyanobacteria","Tiny microbes that release oxygen; they helped fill the early air."]],
  "sources":S(SI,UCMP),
  "quiz":[
   {"type":"mc","q":"The earliest life on Earth was:","choices":["Giant reptiles","Simple single cells in the sea","Tall trees","Fish"],"answer":1,"why":"Life began as single-celled microbes in the sea."},
   {"type":"tf","q":"Microbes helped add oxygen to Earth's early atmosphere.","answer":True,"why":"True - cyanobacteria released the oxygen that built up over time."}]},

 {"id":"cambrian-animals","title":"Life explodes: the first animals","track":"flora","level":"Core","src":"si","time":4,"art":"anomalocaris",
  "explain":[
   "After billions of years of tiny life, the seas suddenly filled with animals during the Cambrian explosion. Creatures evolved shells, eyes, legs and the first hard skeletons. Trilobites became some of the most successful animals ever, and strange hunters like Anomalocaris prowled the water.",
   "These early animals invented body plans still seen today, from arthropods to the distant ancestors of fish. The fossils of this burst of life, especially from sites like the Burgess Shale, are among the most important in all of paleontology."],
  "terms":[["Arthropod","An animal with a hard outer shell and jointed legs, like a trilobite or insect."],["Skeleton","A hard supporting framework; hard skeletons first became common in the Cambrian."]],
  "sources":S(SI,UCMP),
  "quiz":[
   {"type":"mc","q":"Trilobites and Anomalocaris first became common during the:","choices":["Ice Age","Cambrian","Jurassic","Cretaceous"],"answer":1,"why":"They appeared during the Cambrian explosion."},
   {"type":"tf","q":"Hard skeletons became common during the Cambrian explosion.","answer":True,"why":"True - shells and skeletons appeared widely in the Cambrian."}]},

 {"id":"plants-conquer-land","title":"Plants conquer the land","track":"flora","level":"Core","src":"nhm","time":4,"art":"fern",
  "explain":[
   "For most of history the land was bare rock and soil. Then, starting over 400 million years ago, the first small plants crept ashore near water. They were simple, leafless green stalks, but they began the slow greening of the continents.",
   "Plants faced big challenges on land: holding themselves up, drinking water, and spreading without the sea. Over time they solved these problems by evolving roots, stems and tougher tissues, paving the way for the first forests and, eventually, all land life."],
  "terms":[["Land plant","A plant that lives on land; the first appeared over 400 million years ago."],["Root","A plant part that anchors it and draws up water, key to life on land."]],
  "sources":S(NHM,UCMP),
  "quiz":[
   {"type":"mc","q":"The first land plants were:","choices":["Tall flowering trees","Small, simple green stalks","Giant ferns","Grasses"],"answer":1,"why":"Early land plants were small, simple and leafless."},
   {"type":"tf","q":"Plants needed roots and stems to thrive on land.","answer":True,"why":"True - roots and stems helped plants survive away from water."}]},

 {"id":"first-forests","title":"The first forests","track":"flora","level":"Core","src":"nhm","time":4,"art":"fern",
  "explain":[
   "Once plants had roots and sturdy stems, some grew tall, and by the Devonian the first true trees appeared. Plants like Archaeopteris formed the earliest forests, with real wood and deep roots that gripped the soil and changed the very chemistry of the air and ground.",
   "These early forests were a turning point. They created shade, soil and shelter, drew down carbon dioxide, and offered new homes for animals beginning to live on land. The green, forested world we know was just getting started."],
  "terms":[["Forest","Land thickly covered in trees; the first forests grew in the Devonian."],["Wood","Tough plant tissue that lets trees grow tall and strong."]],
  "sources":S(NHM,UCMP),
  "quiz":[
   {"type":"mc","q":"The first true forests appeared during the:","choices":["Devonian","Cretaceous","Ice Age","Cambrian"],"answer":0,"why":"Early forests with real trees grew in the Devonian."},
   {"type":"tf","q":"Early forests helped create soil and shelter for land animals.","answer":True,"why":"True - forests built soil and offered homes for new land life."}]},

 {"id":"life-without-backbones","title":"Life without backbones","track":"flora","level":"Core","src":"nhm","time":4,"art":"trilobite",
  "explain":[
   "Most animals, then and now, have no backbone. These invertebrates include shellfish, insects, worms, corals, and the squid-like ammonites. Their hard shells fossilise readily, which is why so much of the fossil record is made up of invertebrate life.",
   "Invertebrates were the first animals and remain the most numerous. Trilobites ruled the early seas, sea scorpions grew huge, and ammonites swarmed the oceans of the dinosaur age. Studying them helps date rocks and trace how life changed over time."],
  "terms":[["Invertebrate","An animal without a backbone, such as a shellfish, insect or worm."],["Exoskeleton","A hard outer shell that supports and protects an invertebrate's body."]],
  "sources":S(NHM,UCMP),
  "quiz":[
   {"type":"mc","q":"An animal without a backbone is called a(n):","choices":["Vertebrate","Invertebrate","Mammal","Reptile"],"answer":1,"why":"Animals without backbones are invertebrates."},
   {"type":"tf","q":"Invertebrate shells fossilise easily and are common fossils.","answer":True,"why":"True - their hard shells make invertebrates very common fossils."}]},

 {"id":"insects-take-over","title":"How insects took over the land","track":"flora","level":"Core","src":"nhm","time":4,"art":"eurypterid",
  "explain":[
   "Insects were among the first animals to live fully on land, and they became wildly successful. By the coal-forest age, the oxygen-rich air let some grow huge, like dragonfly relatives with wings as wide as a hawk's. Insects were also the first animals to fly.",
   "Today insects are the most numerous animals on Earth, with millions of kinds. Their long history is captured in fossils and especially in amber, which has trapped ancient insects in lifelike detail for millions of years."],
  "terms":[["Insect","A small six-legged animal; insects were the first animals to fly."],["Flight","Movement through the air; insects achieved it before any other animals."]],
  "sources":S(NHM,UCMP),
  "quiz":[
   {"type":"mc","q":"Insects were the first animals to:","choices":["Swim","Fly","Walk","Dig"],"answer":1,"why":"Insects were the first animals to achieve flight."},
   {"type":"tf","q":"Extra oxygen in the coal-forest age let some insects grow very large.","answer":True,"why":"True - high oxygen is linked to giant Carboniferous insects."}]},
]

FAUNA = [
 {"id":"first-dinosaurs","title":"The first dinosaurs","track":"fauna","level":"Core","src":"amnh","time":4,"art":"earlydino",
  "explain":[
   "The earliest dinosaurs appeared in the Triassic Period, over 230 million years ago. They were nothing like the giants to come: small, lightly built, two-legged animals such as Eoraptor and Herrerasaurus, often no bigger than a dog or a person.",
   "At first dinosaurs were just one of many reptile groups, sharing the land with crocodile relatives that were larger and more common. Only later, after upheavals cleared away rivals, did dinosaurs rise to rule the land for the rest of the Mesozoic."],
  "terms":[["Eoraptor","One of the earliest known dinosaurs, small and lightly built."],["Triassic","The period when the first dinosaurs appeared, over 230 million years ago."]],
  "sources":S(AMNH,UCMP),
  "quiz":[
   {"type":"mc","q":"The first dinosaurs were:","choices":["Giant and four-legged","Small and two-legged","Flying","Aquatic"],"answer":1,"why":"Early dinosaurs were small, two-legged animals."},
   {"type":"tf","q":"Dinosaurs ruled the land from the very moment they appeared.","answer":False,"why":"False - they were minor at first and rose to dominance only later."}]},

 {"id":"meat-eaters","title":"The meat-eaters: theropods","track":"fauna","level":"Core","src":"amnh","time":4,"art":"theropod",
  "explain":[
   "The theropods were the meat-eating dinosaurs, and they walked on two legs with grasping hands and sharp, often serrated teeth. The group ranges from tiny feathered hunters to giants like Tyrannosaurus and Giganotosaurus, among the largest predators ever to walk the land.",
   "Theropods were not all alike. Some were swift pack-hunters, some fished, and one branch became plant-eaters. Most importantly, the small feathered theropods gave rise to birds, making theropods the only dinosaur group with living members today."],
  "terms":[["Theropod","A meat-eating dinosaur that walked on two legs; the group that led to birds."],["Serrated","Edged with tiny saw-like teeth, as on many theropod teeth."]],
  "sources":S(AMNH,NHM),
  "quiz":[
   {"type":"mc","q":"Theropods are the group of dinosaurs that were mostly:","choices":["Long-necked plant-eaters","Two-legged meat-eaters","Armoured","Flying"],"answer":1,"why":"Theropods were the two-legged, mostly meat-eating dinosaurs."},
   {"type":"tf","q":"Birds evolved from small theropod dinosaurs.","answer":True,"why":"True - birds descend from small feathered theropods."}]},

 {"id":"long-necks","title":"The giants: sauropods","track":"fauna","level":"Core","src":"amnh","time":4,"art":"sauropod",
  "explain":[
   "Sauropods were the long-necked, plant-eating giants, the largest animals ever to live on land. Walking on four pillar-like legs, with long necks and whip-like tails, they included Brachiosaurus, Diplodocus and the colossal Argentinosaurus, which may have weighed as much as a dozen elephants.",
   "Their long necks let them reach food other animals could not, from treetops to wide patches of ground. To grow so huge, they ate enormous amounts of plants and had air-filled, lightweight bones, a little like those of birds."],
  "terms":[["Sauropod","A giant long-necked plant-eating dinosaur that walked on four legs."],["Herbivore","An animal that eats plants; all sauropods were herbivores."]],
  "sources":S(AMNH,NHM),
  "quiz":[
   {"type":"mc","q":"Sauropods are famous for being the largest:","choices":["Flying animals","Land animals ever","Sea animals","Insects"],"answer":1,"why":"Sauropods were the largest land animals that ever lived."},
   {"type":"tf","q":"A long neck helped sauropods reach food other animals could not.","answer":True,"why":"True - their necks gave access to treetops and wide feeding areas."}]},

 {"id":"armour-and-horns","title":"Armour, plates and horns","track":"fauna","level":"Core","src":"amnh","time":4,"art":"ankylosaur",
  "explain":[
   "Many plant-eating dinosaurs grew their own defences. Ankylosaurs were covered in bony armour and some swung clubbed tails. Stegosaurs bore rows of plates along the back and spikes on the tail. Ceratopsians like Triceratops carried sharp horns and a bony neck frill.",
   "These features helped against predators, but they may have done more. Plates and frills could also help dinosaurs recognise their own kind, show off to mates, or signal to rivals, much as antlers and bright feathers do in animals today."],
  "terms":[["Armour","Bony plates protecting an animal, as on an ankylosaur."],["Frill","The bony shield around the neck of a horned dinosaur like Triceratops."]],
  "sources":S(AMNH,NHM),
  "quiz":[
   {"type":"mc","q":"Triceratops defended itself with horns and a bony:","choices":["Tail club","Neck frill","Back sail","Beak only"],"answer":1,"why":"Triceratops had horns and a bony neck frill."},
   {"type":"tf","q":"Plates and frills may have helped dinosaurs show off as well as defend.","answer":True,"why":"True - such features likely had display roles too."}]},

 {"id":"feathers-and-flight","title":"Feathers and the bird link","track":"fauna","level":"Core","src":"nhm","time":4,"art":"raptor",
  "explain":[
   "One of the great discoveries of recent decades is that many dinosaurs had feathers. At first these were simple fuzzy filaments, useful for warmth or display. Later, some meat-eating dinosaurs grew true, vaned feathers like those of birds, long before any of them could fly.",
   "This means feathers came first and flight came later. Small feathered dinosaurs such as the raptors were close cousins of the earliest birds, and the line between bird and dinosaur turns out to be wonderfully blurry."],
  "terms":[["Feather","A light structure growing from the skin; many dinosaurs had feathers."],["Filament","A simple hair-like fibre; the earliest dinosaur feathers were filaments."]],
  "sources":S(NHM,AMNH),
  "quiz":[
   {"type":"mc","q":"In dinosaurs, feathers first appeared:","choices":["Only after flight began","Before flight, for warmth or display","Only on giants","Never"],"answer":1,"why":"Feathers came first, used for warmth or display before flight."},
   {"type":"tf","q":"Many meat-eating dinosaurs had feathers.","answer":True,"why":"True - feathers were widespread among theropod dinosaurs."}]},

 {"id":"eggs-and-babies","title":"Dinosaur eggs and babies","track":"fauna","level":"Core","src":"amnh","time":4,"art":"hadrosaur",
  "explain":[
   "Dinosaurs laid eggs, like their reptile and bird relatives. Fossil nests, eggs and even unhatched babies have been found, showing dinosaurs built nests and sometimes returned to the same nesting grounds year after year, much as seabirds do today.",
   "Some dinosaurs cared for their young. The hadrosaur Maiasaura, whose name means 'good mother lizard', is known from nests with eggshell and growing babies, hinting that the parents brought food to the nest. Other fossils show small dinosaurs sitting on their nests like brooding birds."],
  "terms":[["Nest","A prepared place where eggs are laid; many dinosaurs built nests."],["Maiasaura","A duck-billed dinosaur known from nests, eggs and babies."]],
  "sources":S(AMNH,NPS),
  "quiz":[
   {"type":"mc","q":"How did dinosaurs reproduce?","choices":["They laid eggs","They gave live birth only","They split in two","They grew from plants"],"answer":0,"why":"Dinosaurs laid eggs, like birds and other reptiles."},
   {"type":"tf","q":"Some dinosaurs cared for their young at the nest.","answer":True,"why":"True - fossils of Maiasaura suggest parental care."}]},

 {"id":"dino-senses","title":"How dinosaurs sensed their world","track":"fauna","level":"Core","src":"ucmp","time":4,"art":"theropod",
  "explain":[
   "Scientists can learn how dinosaurs sensed the world by studying their skulls. The spaces where the brain and nerves sat leave hollows that reveal the size of the parts handling sight, smell and balance. Tyrannosaurus, for instance, had large smell centres, hinting at a keen nose.",
   "Eye sockets show some hunters had forward-facing eyes for judging distance, while many plant-eaters had eyes on the sides of the head for a wide view to watch for danger. These clues help bring the senses of extinct animals back to life."],
  "terms":[["Braincase","The part of the skull that held the brain, revealing senses."],["Sense","A way of detecting the world, such as sight, smell or hearing."]],
  "sources":S(UCMP,AMNH),
  "quiz":[
   {"type":"mc","q":"Scientists study a dinosaur's senses mainly from its:","choices":["Tail","Skull and braincase","Toes","Skin colour"],"answer":1,"why":"The skull and braincase reveal the senses."},
   {"type":"tf","q":"Tyrannosaurus appears to have had a strong sense of smell.","answer":True,"why":"True - its large smell centres suggest a keen nose."}]},

 {"id":"biggest-smallest","title":"The biggest and smallest dinosaurs","track":"fauna","level":"Core","src":"nhm","time":4,"art":"sauropod",
  "explain":[
   "Dinosaurs came in an astonishing range of sizes. The largest were giant sauropods like Argentinosaurus, perhaps over 30 metres long and weighing as much as a dozen elephants. They were the biggest animals ever to walk on land.",
   "At the other end were tiny dinosaurs no bigger than a chicken or crow, including small feathered hunters and the earliest birds. Between these extremes lay every size in between, filling the prehistoric world from the ground up to the treetops."],
  "terms":[["Argentinosaurus","One of the largest dinosaurs, a giant long-necked sauropod."],["Range","The full spread between extremes, such as dinosaur sizes from tiny to gigantic."]],
  "sources":S(NHM,AMNH),
  "quiz":[
   {"type":"mc","q":"The very largest dinosaurs were the:","choices":["Tiny feathered hunters","Giant long-necked sauropods","Armoured dinosaurs","Horned dinosaurs"],"answer":1,"why":"Giant sauropods were the largest dinosaurs."},
   {"type":"tf","q":"Some dinosaurs were no bigger than a chicken.","answer":True,"why":"True - the smallest dinosaurs were tiny, including early birds."}]},

 {"id":"dino-herds","title":"Did dinosaurs live in herds?","track":"fauna","level":"Core","src":"nps","time":4,"art":"hadrosaur",
  "explain":[
   "Many dinosaurs seem to have lived in groups. Huge bone-beds, where dozens or even thousands of one kind died together, suggest some plant-eaters travelled in herds. Trackways of many animals walking the same way point to the same conclusion.",
   "Living in a herd has clear benefits: more eyes to spot danger and safety in numbers. Some meat-eating dinosaurs may also have hunted in packs, though this is harder to prove. As with living animals, dinosaur behaviour was probably varied and complex."],
  "terms":[["Herd","A group of animals living and moving together, as some dinosaurs did."],["Bone-bed","A rock layer packed with the bones of many animals."]],
  "sources":S(NPS,AMNH),
  "quiz":[
   {"type":"mc","q":"Large bone-beds of one dinosaur kind suggest those animals:","choices":["Lived alone","Lived in herds","Could fly","Ate rocks"],"answer":1,"why":"Mass bone-beds point to herd living."},
   {"type":"tf","q":"Living in a herd can offer safety in numbers.","answer":True,"why":"True - herds provide more eyes for danger and group protection."}]},

 {"id":"end-of-dinosaurs","title":"The end of the dinosaurs","track":"fauna","level":"Core","src":"si","time":4,"art":"extinction",
  "explain":[
   "The reign of the dinosaurs ended suddenly about 66 million years ago, when a giant asteroid struck the Earth. The impact darkened the skies, chilled the world and collapsed the food chains, and all the non-bird dinosaurs died out, along with many other creatures.",
   "Yet the dinosaur story did not fully end. The feathered, bird-line dinosaurs survived and became the birds we see today. So the next time you watch a sparrow or a hawk, remember you are looking at a living dinosaur."],
  "why":"This event closes the age of dinosaurs but also reveals their living legacy, tying the deep past directly to the world outside your window.",
  "terms":[["Asteroid impact","The strike of a large space rock; one ended the age of dinosaurs."],["Legacy","Something left behind; birds are the living legacy of the dinosaurs."]],
  "sources":S(SI,USGS),
  "quiz":[
   {"type":"mc","q":"The age of the dinosaurs ended about 66 million years ago because of a:","choices":["Long winter alone","Giant asteroid impact","Plant shortage only","Flood"],"answer":1,"why":"A giant asteroid impact ended the dinosaur age."},
   {"type":"tf","q":"Birds are the living legacy of the dinosaurs.","answer":True,"why":"True - bird-line dinosaurs survived and became today's birds."}]},
]
