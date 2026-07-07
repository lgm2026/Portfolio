f = "seahype-curriculum.js"
A = '"], "terms":'  # anchor: end of explain array -> targets prose only, not quiz
# (old_trait, new_trait)
T = [
("These drifters spin intricate, glassy mineral skeletons of astonishing geometric beauty.",
 "These tiny drifters build glassy skeletons with amazing shapes."),
("Living at hydrothermal vents, it has no mouth or gut and is fed entirely by symbiotic bacteria inside its body.",
 "It lives at hot vents. It has no mouth or gut. Tiny bacteria living inside it make all its food."),
("Possibly the most abundant photosynthetic organism on Earth, this microscopic cell helps generate much of the oxygen we breathe.",
 "It may be one of the most common living things on Earth. This tiny cell helps make much of the oxygen we breathe."),
("The female secretes a delicate, papery shell that she uses as an egg case and a buoyancy aid.",
 "The female makes a thin, papery shell. She uses it to hold her eggs and to help her float."),
("A tube-shaped colony of thousands of tiny animals, it drifts as one and glows with brilliant bioluminescence.",
 "It is a tube-shaped colony of thousands of tiny animals. They drift as one and glow with bright light."),
("Flamboyantly colored, its venom-tipped spines warn predators away, and tiny animals often shelter among them.",
 "It has bright colors and venom-tipped spines that warn predators away. Tiny animals often hide among its spines."),
("A camouflage champion, it controls its skin with split-second precision and floats using a porous internal 'cuttlebone.'",
 "It is a master of camouflage and can change its skin in a split second. It floats using a spongy inner shell called a 'cuttlebone.'"),
("It carries coconut or clam shells to assemble into portable armor, a rare example of tool use in an invertebrate.",
 "It carries coconut or clam shells and fits them together as armor it can move with. That is a rare case of an animal without a backbone using tools."),
("These spinning, two-tailed cells include species that cause harmful 'red tides' and others that light the waves with bioluminescence.",
 "These spinning cells have two tails. Some cause harmful 'red tides.' Others make the waves glow at night."),
("It can impersonate other animals, such as a flatfish, lionfish or sea snake, by reshaping its body and posture.",
 "It can copy other animals, like a flatfish, lionfish, or sea snake, by changing its body shape and pose."),
("Tiny but extremely venomous, this thumbnail-sized box jelly delivers a sting with severe delayed effects.",
 "It is tiny but very venomous. This thumbnail-sized box jelly gives a sting whose worst effects come hours later."),
("The largest turtle, it has a leathery shell instead of a hard one and feeds almost entirely on jellyfish.",
 "It is the largest turtle. It has a leathery shell instead of a hard one, and it eats almost only jellyfish."),
("River dolphins navigate murky water largely by echolocation, and some are tinted pink.",
 "River dolphins find their way through murky water mostly by echolocation. Some are tinted pink."),
]
s = open(f, encoding="utf-8").read()
ok = 0; fail = 0
for old, new in T:
    o = old + A; n = new + A
    c = s.count(o)
    if c == 1: s = s.replace(o, n); ok += 1
    else: fail += 1; print("  !! match=%d :: %s" % (c, old[:50]))
open(f, "w", encoding="utf-8").write(s)
print("species traits simplified:", ok, "| failed:", fail)
