# -*- coding: utf-8 -*-
"""Phase 6: re-theme remaining arcade help strings + minor polish."""
src = open("base.html", encoding="utf-8").read()

def rep(old, new, label):
    global src
    if old not in src:
        raise SystemExit("MISSING (%s): %r" % (label, old[:80]))
    src = src.replace(old, new, 1)

helps = [
 ("Slide your paddle. Get the acorn past the top to score; don't let it past you.",
  "Slide your paddle. Get the fossil past the top to score; don't let it past you."),
 ("Tap to float upward. Slip through the gaps in the canopy.",
  "Tap to glide upward. Slip through the gaps in the cliffs."),
 ("Steer the caterpillar to eat leaves. Don't hit the walls or yourself.",
  "Steer the trilobite to graze the sea floor. Don't hit the walls or yourself."),
 ("Move with the arrows and fire to scatter the locust swarm before it lands.",
  "Move with the arrows and fire to blast the falling meteors before they land."),
 ("Hop across, dodging cars and hazards. Reach the far side to score.",
  "Hop across, dodging the hazards. Reach the far side to score."),
 ("Move the basket to catch falling berries. Avoid the sharp thorns!",
  "Move the basket to catch falling eggs. Avoid the falling rocks!"),
 ("Bounce higher and higher up the branches. Don't fall off the bottom!",
  "Bounce higher and higher up the ledges. Don't fall off the bottom!"),
 ("Move to dodge the falling hailstones. Survive as long as you can.",
  "Move to dodge the falling meteors. Survive as long as you can."),
 ("Steer to grab crystals (they refill your lamp). Dodge the bats. Watch your light!",
  "Steer to grab fossils (they refill your lamp). Dodge the bats. Watch your light!"),
 ("Move up and down to dodge logs and grab berries. It gets faster!",
  "Move up and down to dodge boulders and grab fossils. It gets faster!"),
 ("Tap the fireflies before time runs out. Chain taps for a bonus!",
  "Tap the ammonites before time runs out. Chain taps for a bonus!"),
 ("Tap a leaf, then a neighbour, to swap. Make rows of 3+ before time runs out.",
  "Tap a fossil, then a neighbour, to swap. Make rows of 3+ before time runs out."),
 ("Swipe with the arrows to slide and merge matching seeds. Don't fill the grid!",
  "Swipe with the arrows to slide and merge matching cells. Don't fill the grid!"),
 ("Tap to uncover a tile. Numbers show nearby toxic mushrooms. Clear every safe tile!",
  "Tap to uncover a tile. Numbers show nearby unstable rock. Clear every safe tile!"),
]
for o, n in helps:
    rep(o, n, "help")

# minor polish: internal palette comment
src = src.replace("/* Fixed 8-bit ocean palette for the arcade",
                  "/* Fixed 8-bit retro palette for the arcade")

# neutralize dormant Wikimedia photo-credit labels (photos are disabled, never render)
src = src.replace('title: "Photo via Wikimedia Commons"', 'title: "Photo source"')
src = src.replace('letterSpacing: 0.2 } }, "Wikimedia") : null',
                  'letterSpacing: 0.2 } }, "Source") : null')

open("base.html", "w", encoding="utf-8").write(src)
print("phase 6 complete")
