f = "seahype-curriculum.js"
R = [
('"The marine virus is a marine microbe (virus), most at home in the open ocean.", "The most numerous biological particles in the sea, marine viruses help recycle nutrients by bursting the microbes they infect."',
 '"A marine virus is a tiny ocean microbe. It lives all through the open ocean.", "Marine viruses are the most common tiny particles in the sea. They help recycle nutrients by bursting the microbes they infect."'),
('"The marine archaea is a marine microbe (archaea), most at home in around hydrothermal vents. Instead of using sunlight, it gets its energy from chemicals, with help from tiny bacteria living inside it.", "These ancient single-celled microbes thrive in extreme places like hot vents, often living on chemical energy."',
 '"A marine archaea is a tiny ocean microbe. Many live around hot hydrothermal vents. Instead of using sunlight, they get energy from chemicals.", "These ancient single-celled microbes thrive in extreme places like hot vents."'),
('"The bacterioplankton is a marine microbe (bacteria), most at home in the open ocean. It mostly eats detritus and seabed matter.", "Invisible but vital, ocean bacteria break down dead matter and recycle nutrients that fuel the entire food web."',
 '"Bacterioplankton are tiny ocean bacteria. They live all through the open ocean. They feed on bits of dead matter.", "Too small to see but very important, ocean bacteria break down dead matter and recycle nutrients that feed the whole food web."'),
]
s = open(f, encoding="utf-8").read()
ok = 0; fail = 0
for old, new in R:
    c = s.count(old)
    if c == 1: s = s.replace(old, new); ok += 1
    else: fail += 1; print("  !! match=%d :: %s" % (c, old[:50]))
open(f, "w", encoding="utf-8").write(s)
print("microbe stubs fixed:", ok, "| failed:", fail)
