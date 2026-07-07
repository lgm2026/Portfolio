f = "seahype-curriculum.js"
A = '"], "terms":'
T = [
("Juveniles wiggle dramatically to mimic toxic flatworms, gaining protection until they grow up.",
 "Young ones wiggle a lot to copy poisonous flatworms. This keeps them safe until they grow up."),
("One of the grandest host anemones, its colorful column shelters clown anemonefish among the tentacles.",
 "It is one of the largest host anemones. Its colorful body shelters clownfish among its tentacles."),
("It hides its silhouette using glowing bacteria housed in a special light organ, matching the moonlight above.",
 "It hides its shadow using glowing bacteria in a special light organ. The glow matches the moonlight above."),
("It communicates with rippling color patterns and can even send different signals from each side of its body.",
 "It 'talks' using rippling color patterns. It can even show different signals on each side of its body."),
("The largest living reptile, it tolerates the sea and can travel long distances between coasts on ocean currents.",
 "It is the largest reptile alive. It can handle the sea and ride ocean currents far between coasts."),
("Its fan of venomous spines deters predators; native to the Indo-Pacific, it has become a damaging invader in the Atlantic.",
 "Its fan of venomous spines scares off predators. It comes from the Indo-Pacific but has become a harmful invader in the Atlantic."),
("When disturbed at night it flashes blue, making breaking waves and boat wakes glow with bioluminescence.",
 "When stirred up at night, it flashes blue. This makes breaking waves and boat trails glow."),
("Encased in an ornate, two-part shell of glassy silica, diatoms drift in sunlit water and produce a large share of Earth's oxygen.",
 "Diatoms wear a fancy two-part shell made of glassy silica. They drift in sunlit water and make a large share of Earth's oxygen."),
("Among the most numerous animals on Earth, these tiny drifters are a key link between phytoplankton and larger animals.",
 "They are among the most numerous animals on Earth. These tiny drifters are a key link between phytoplankton and bigger animals."),
("Its broad antler-like branches once dominated Caribbean reefs but are now threatened.",
 "Its wide, antler-like branches once filled Caribbean reefs. Now they are threatened."),
("Some Mediterranean meadows are single clones thousands of years old, among the oldest living things on Earth.",
 "Some Mediterranean meadows are one single plant, thousands of years old. They are among the oldest living things on Earth."),
("A 'living fossil' with a coiled, gas-filled shell, it adjusts its buoyancy by emptying and filling the chambers.",
 "It is a 'living fossil' with a coiled, gas-filled shell. It floats higher or lower by emptying and filling the chambers."),
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
