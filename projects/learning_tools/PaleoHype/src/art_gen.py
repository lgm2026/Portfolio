# -*- coding: utf-8 -*-
"""PaleoHype SVG art generator. Produces SEA_ART dict of scene illustrations
in the TerraHype style (viewBox 0 0 320 200, gradient skies + silhouettes)."""

HDR = ('<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" '
       'xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style="display:block">')

def sky(idp, top, bot):
    return ('<defs><linearGradient id="%s_sky" x1="0" y1="0" x2="0" y2="1">'
            '<stop offset="0" stop-color="%s"/><stop offset="1" stop-color="%s"/>'
            '</linearGradient></defs><rect width="320" height="200" fill="url(#%s_sky)"/>'
            % (idp, top, bot, idp))

def sun(idp, cx, cy, r, c0="#FFF1C8", c1="#FFCE8A"):
    return ('<radialGradient id="%s_sun" cx="50%%" cy="50%%" r="50%%">'
            '<stop offset="0" stop-color="%s"/><stop offset="1" stop-color="%s"/></radialGradient>'
            '<circle cx="%d" cy="%d" r="%d" fill="url(#%s_sun)"/>' % (idp, c0, c1, cx, cy, r, idp))

def ground(idp, top, bot, y=150):
    return ('<linearGradient id="%s_gr" x1="0" y1="0" x2="0" y2="1">'
            '<stop offset="0" stop-color="%s"/><stop offset="1" stop-color="%s"/></linearGradient>'
            '<path d="M0 %d Q160 %d 320 %d V200 H0 Z" fill="url(#%s_gr)"/>'
            % (idp, top, bot, y, y-16, y, idp))

def water(idp, top, bot, y=96):
    return ('<linearGradient id="%s_w" x1="0" y1="0" x2="0" y2="1">'
            '<stop offset="0" stop-color="%s"/><stop offset="1" stop-color="%s"/></linearGradient>'
            '<rect y="%d" width="320" height="%d" fill="url(#%s_w)"/>' % (idp, top, bot, y, 200-y, idp))

# palettes
AMBER = ("#FBE7C6", "#F4B27A")
DUSK  = ("#F6C99A", "#C9756B")
TEAL  = ("#BfE9E4", "#7FC4BE")
DEEPSEA_T = ("#5AA0B8", "#2E6A86")
DEEPSEA_B = ("#2E6A86", "#163C52")
SWAMP = ("#CFE3B0", "#9CC07A")
ICE   = ("#DCEBF2", "#A9C7D8")
ASH   = ("#C7BBA8", "#8A7A66")
EARTHG_T = ("#7FB85A", "#4E8B40")
SAND_T = ("#D8B98A", "#B08A54")
ROCK_T = ("#B79A78", "#7A5E40")

def land_scene(idp, skytop, skybot, grtop, grbot, creature, with_sun=True, suncol=("#FFF1C8","#FFCE8A")):
    s = HDR + sky(idp, skytop, skybot)
    if with_sun:
        s += sun(idp, 66, 56, 22, suncol[0], suncol[1])
    s += ground(idp, grtop, grbot, 150)
    s += creature
    return s + "</svg>"

def sea_scene(idp, t0, t1, b0, b1, creature, ray=True):
    s = HDR + sky(idp, t0, t1)
    s += water(idp, b0, b1, 70)
    if ray:
        s += ('<g opacity="0.18" fill="#EAF6FF">'
              '<path d="M60 70 L90 70 L70 200 L40 200 Z"/>'
              '<path d="M150 70 L175 70 L168 200 L132 200 Z"/>'
              '<path d="M240 70 L262 70 L280 200 L246 200 Z"/></g>')
    s += creature
    return s + "</svg>"

# ---- creature silhouettes (positioned for a 320x200 scene) ----

def theropod(color="#5A3A22", tx=150, ty=70, sc=1.0):
    # T. rex-like profile: big head, short arms, thick tail, two legs
    return ('<g fill="%s" transform="translate(%d,%d) scale(%g)">'
            '<path d="M0 40 Q-8 18 18 14 Q30 4 52 8 Q66 0 78 10 Q90 12 88 24 '
            'L70 28 Q60 30 56 36 Q70 38 84 36 Q70 48 52 46 L48 60 L56 96 L44 96 '
            'L38 64 Q30 70 26 64 L30 96 L18 96 L16 60 Q-6 56 0 40 Z"/>'
            '<path d="M52 40 l10 -2 l-2 6 Z" fill="#2A1A10"/>'  # mouth notch
            '<circle cx="72" cy="20" r="3" fill="#FFE9C0"/>'    # eye
            '<path d="M40 44 q8 4 16 2" stroke="#2A1A10" stroke-width="1.5" fill="none"/>'  # arm
            '</g>' % (color, tx, ty, sc))

def raptor(color="#6B4327", tx=150, ty=96, sc=1.0):
    # feathered raptor: slimmer, raised sickle-claw foot, plume tail
    return ('<g transform="translate(%d,%d) scale(%g)">'
            '<path d="M0 30 Q-14 22 -8 12 Q-18 6 -6 2 L20 8 Q34 -6 50 4 Q60 2 62 12 '
            'Q58 20 46 18 L40 28 Q48 50 40 70 L32 70 L32 40 Q22 46 18 40 L22 70 L14 70 '
            'L12 36 Q-2 40 0 30 Z" fill="%s"/>'
            '<circle cx="46" cy="8" r="2.4" fill="#FFE9C0"/>'
            '<path d="M-8 12 q-10 -2 -16 4 q10 0 16 2" fill="%s" opacity="0.8"/>'  # tail plume
            '</g>' % (tx, ty, sc, color, color))

def sauropod(color="#5A6A4A", tx=120, ty=40, sc=1.0):
    # long neck up, four legs, long tail
    return ('<g fill="%s" transform="translate(%d,%d) scale(%g)">'
            '<path d="M150 40 Q120 44 96 50 Q70 52 52 56 L48 60 Q60 56 80 56 '
            'Q60 70 36 70 Q44 50 30 38 Q22 20 30 6 Q40 -4 44 12 Q42 26 50 38 '
            'Q70 46 96 44 Q120 40 150 38 Z"/>'
            '<rect x="44" y="66" width="6" height="34"/><rect x="62" y="66" width="6" height="34"/>'
            '<rect x="92" y="62" width="6" height="38"/><rect x="110" y="62" width="6" height="38"/>'
            '<ellipse cx="80" cy="58" rx="40" ry="16"/>'
            '<circle cx="34" cy="8" r="2.4" fill="#FFE9C0"/></g>' % (color, tx, ty, sc))

def stegosaur(color="#5E5238", tx=150, ty=80, sc=1.0):
    # plated back + tail spikes
    return ('<g transform="translate(%d,%d) scale(%g)">'
            '<path d="M0 40 Q14 38 24 40 Q40 30 70 34 Q92 34 104 44 L100 50 '
            'Q80 46 64 48 Q40 46 24 50 Q10 50 0 48 Z" fill="%s"/>'
            '<rect x="30" y="58" width="5" height="22" fill="%s"/><rect x="44" y="58" width="5" height="22" fill="%s"/>'
            '<rect x="64" y="56" width="5" height="24" fill="%s"/><rect x="80" y="58" width="5" height="22" fill="%s"/>'
            # plates
            '<path d="M30 40 l8 -16 l8 16 Z" fill="#7A6A48"/><path d="M48 36 l9 -20 l9 20 Z" fill="#8A795380"/>'
            '<path d="M48 36 l9 -20 l9 20 Z" fill="#8A7953"/><path d="M68 38 l8 -16 l8 16 Z" fill="#7A6A48"/>'
            # tail spikes
            '<path d="M2 44 l-14 -6 l10 10 Z" fill="#9A8A60"/><path d="M2 50 l-14 4 l12 6 Z" fill="#9A8A60"/>'
            '<circle cx="98" cy="42" r="2.2" fill="#FFE9C0"/></g>' % (tx, ty, sc, color, color, color, color, color))

def ankylosaur(color="#5A4A36", tx=150, ty=92, sc=1.0):
    # low armoured body, tail club
    return ('<g transform="translate(%d,%d) scale(%g)">'
            '<path d="M0 28 Q-16 26 -24 30 Q-16 34 0 32 L6 24 Q40 8 78 22 Q96 26 98 36 '
            'L92 40 Q60 30 36 34 Q14 32 6 36 Q0 34 0 28 Z" fill="%s"/>'
            '<ellipse cx="-26" cy="30" rx="9" ry="8" fill="#6B5A40"/>'   # tail club
            '<rect x="18" y="36" width="6" height="14" fill="%s"/><rect x="64" y="36" width="6" height="14" fill="%s"/>'
            '<circle cx="40" cy="20" r="2" fill="#8A7A58"/><circle cx="56" cy="18" r="2" fill="#8A7A58"/>'
            '<circle cx="72" cy="22" r="2" fill="#8A7A58"/>'
            '<circle cx="92" cy="30" r="2" fill="#FFE9C0"/></g>' % (tx, ty, sc, color, color, color))

def ceratopsian(color="#6A4A38", tx=150, ty=80, sc=1.0):
    # Triceratops: frill, two brow horns, nose horn, beak
    return ('<g transform="translate(%d,%d) scale(%g)">'
            '<path d="M0 40 Q-18 38 -28 42 L-22 30 Q-10 26 0 30 Q20 22 52 28 '
            'Q70 28 78 40 L70 46 Q40 36 24 40 Q8 38 0 44 Z" fill="%s"/>'
            '<path d="M58 40 Q86 30 94 44 Q92 60 70 58 Q60 50 58 40 Z" fill="%s"/>'  # frill
            '<path d="M88 50 l16 4 l-14 4 Z" fill="%s"/>'    # beak
            '<path d="M70 36 l4 -22 l4 22 Z" fill="#8A6A50"/><path d="M82 36 l4 -20 l4 20 Z" fill="#8A6A50"/>'  # brow horns
            '<path d="M92 48 l10 -8 l-2 10 Z" fill="#8A6A50"/>'  # nose horn
            '<rect x="20" y="46" width="6" height="16" fill="%s"/><rect x="48" y="46" width="6" height="16" fill="%s"/>'
            '<circle cx="80" cy="44" r="2" fill="#FFE9C0"/></g>' % (tx, ty, sc, color, color, color, color, color))

def hadrosaur(color="#5A6048", tx=150, ty=70, sc=1.0):
    # duck-bill with crest, bipedal-ish
    return ('<g transform="translate(%d,%d) scale(%g)">'
            '<path d="M0 50 Q-14 40 -6 28 L18 34 Q30 16 54 22 Q64 10 74 22 Q70 30 60 30 '
            'L66 24 Q58 36 46 34 L42 48 Q50 84 42 96 L34 96 L34 52 Q22 58 18 50 L20 96 L12 96 '
            'L10 48 Q-2 46 0 50 Z" fill="%s"/>'
            '<path d="M54 22 q14 -10 22 -2 q-8 2 -14 8 Z" fill="%s"/>'  # crest
            '<circle cx="58" cy="20" r="2.2" fill="#FFE9C0"/></g>' % (tx, ty, sc, color, color))

def pachy(color="#6B4A30", tx=150, ty=72, sc=1.0):
    # domed head, bipedal
    return ('<g transform="translate(%d,%d) scale(%g)">'
            '<path d="M0 46 Q-12 36 -4 26 L18 32 Q26 16 50 18 Q66 8 78 22 Q74 32 60 30 '
            'L54 36 Q48 46 44 46 Q50 82 42 96 L34 96 L34 50 Q24 56 20 48 L22 96 L14 96 '
            'L12 46 Q0 44 0 46 Z" fill="%s"/>'
            '<path d="M50 18 q16 -2 24 8 q-6 -14 -24 -6 Z" fill="#8A6A48"/>'  # dome
            '<circle cx="60" cy="20" r="2.2" fill="#FFE9C0"/></g>' % (tx, ty, sc, color))

def earlydino(color="#6E5236", tx=150, ty=96, sc=1.0):
    # small slim bipedal early dino
    return ('<g transform="translate(%d,%d) scale(%g)">'
            '<path d="M0 24 Q-16 20 -24 24 Q-14 28 0 26 L10 22 Q22 8 40 14 Q50 6 56 16 '
            'Q52 22 44 22 L40 30 Q46 50 40 66 L34 66 L34 38 Q26 42 22 36 L24 66 L18 66 '
            'L16 32 Q2 30 0 24 Z" fill="%s"/>'
            '<circle cx="42" cy="14" r="2" fill="#FFE9C0"/></g>' % (tx, ty, sc, color))

def pterosaur_fly(color="#7A5640", cx=160, cy=70, sc=1.0):
    # flying pterosaur with crest and wide membrane wings (in sky)
    return ('<g transform="translate(%d,%d) scale(%g)">'
            '<path d="M0 0 Q-60 -28 -96 -10 Q-50 -6 -20 6 Q-50 8 -78 22 Q-40 18 -8 10 '
            'L0 14 Q40 18 78 4 Q50 6 20 6 Q50 -6 96 -10 Q60 -28 0 0 Z" fill="%s"/>'
            '<path d="M-4 -2 q-2 -16 8 -20 q-6 12 -2 20 Z" fill="%s"/>'  # head crest
            '<circle cx="2" cy="-4" r="1.8" fill="#FFE9C0"/></g>' % (cx, cy, sc, color, color))

def terrorbird(color="#6A4A2E", tx=150, ty=64, sc=1.0):
    # tall flightless bird with big hooked beak
    return ('<g transform="translate(%d,%d) scale(%g)">'
            '<ellipse cx="20" cy="56" rx="20" ry="26" fill="%s"/>'
            '<path d="M22 34 Q18 14 30 8 Q44 6 42 22 L40 30 Q34 30 30 26 Q26 30 22 34 Z" fill="%s"/>'
            '<path d="M40 14 l16 4 q-8 6 -16 4 Z" fill="#C98A4A"/>'  # beak hook
            '<rect x="14" y="78" width="4" height="22" fill="#8A5A34"/><rect x="26" y="78" width="4" height="22" fill="#8A5A34"/>'
            '<circle cx="34" cy="16" r="2" fill="#FFE9C0"/></g>' % (tx, ty, sc, color, color))

def plesiosaur_sea(color="#3C5A66", cx=150, cy=110, sc=1.0):
    # long-necked plesiosaur with flippers (underwater)
    return ('<g transform="translate(%d,%d) scale(%g)">'
            '<path d="M-60 10 Q-30 6 0 8 Q30 4 56 -2 Q40 6 22 8 L22 12 Q44 12 60 6 '
            'Q40 22 14 18 Q-10 16 -30 16 Q-50 16 -60 14 Z" fill="%s"/>'
            '<path d="M48 -2 Q44 -22 56 -30 Q60 -16 54 -2 Z" fill="%s"/>'  # neck up-curve
            '<circle cx="56" cy="-26" r="2" fill="#CFF3FF"/>'
            '<path d="M6 12 q-8 14 -22 14 q10 -4 14 -16 Z" fill="%s"/>'   # flipper
            '<path d="M-22 10 q-8 14 -22 12 q10 -4 14 -14 Z" fill="%s"/></g>'
            % (cx, cy, sc, color, color, color, color))

def dunkleosteus_sea(color="#41606B", cx=150, cy=110, sc=1.0):
    # armoured fish with bony plated head/jaws
    return ('<g transform="translate(%d,%d) scale(%g)">'
            '<path d="M-70 0 Q-40 -22 0 -20 Q40 -22 64 -6 Q80 0 64 8 Q40 22 0 20 Q-40 22 -70 4 Z" fill="%s"/>'
            '<path d="M30 -8 Q54 -10 64 -6 L62 -2 L30 -2 Z" fill="#9FB4BC"/>'   # bony head plate
            '<path d="M30 6 L62 4 Q54 12 30 10 Z" fill="#9FB4BC"/>'
            '<path d="M44 -2 l16 -2 l-14 6 Z" fill="#1C2D33"/>'  # jaw gap
            '<path d="M-70 0 l-16 -12 l4 14 l-6 10 Z" fill="%s"/>'  # tail
            '<circle cx="40" cy="-6" r="2.4" fill="#CFF3FF"/></g>' % (cx, cy, sc, color, color))

def shark_sea(color="#46555C", cx=150, cy=110, sc=1.0):
    # megalodon-like shark with big triangular fin and gaping jaw
    return ('<g transform="translate(%d,%d) scale(%g)">'
            '<path d="M-70 4 Q-30 -16 30 -14 Q60 -12 74 0 Q60 12 30 14 Q-30 16 -70 8 Z" fill="%s"/>'
            '<path d="M0 -14 L10 -40 L24 -12 Z" fill="%s"/>'   # dorsal fin
            '<path d="M-70 4 l-18 -14 l6 14 l-8 14 Z" fill="%s"/>'  # tail
            '<path d="M50 2 Q70 -2 74 0 Q70 8 52 8 Z" fill="#E9F6FF"/>'  # white belly mouth
            '<path d="M54 2 l16 -1 l-14 5 Z" fill="#1C2A30"/>'
            '<circle cx="44" cy="-4" r="2" fill="#0E1A20"/></g>' % (cx, cy, sc, color, color, color))

def dimetrodon(color="#6A4438", tx=140, ty=92, sc=1.0):
    # sail-back synapsid
    return ('<g transform="translate(%d,%d) scale(%g)">'
            '<path d="M0 30 Q-16 30 -26 34 Q-14 38 0 36 L6 30 Q40 22 78 32 Q92 36 90 44 '
            'L82 46 Q56 36 36 38 Q14 36 6 40 Q0 38 0 30 Z" fill="%s"/>'
            # sail
            '<path d="M8 30 Q14 -6 26 -8 Q40 -10 52 -6 Q66 -8 74 30 '
            'Q60 16 52 16 Q40 14 30 16 Q18 16 8 30 Z" fill="#8A5A48"/>'
            '<g stroke="#5A3428" stroke-width="1.4">'
            '<line x1="20" y1="28" x2="22" y2="-4"/><line x1="34" y1="26" x2="36" y2="-8"/>'
            '<line x1="48" y1="26" x2="50" y2="-8"/><line x1="62" y1="28" x2="62" y2="-2"/></g>'
            '<rect x="20" y="42" width="5" height="14" fill="%s"/><rect x="64" y="42" width="5" height="14" fill="%s"/>'
            '<circle cx="84" cy="38" r="2" fill="#FFE9C0"/></g>' % (tx, ty, sc, color, color, color))

def amphibian(color="#4E6A4A", tx=140, ty=120, sc=1.0):
    # salamander-like amphibian by water
    return ('<g transform="translate(%d,%d) scale(%g)">'
            '<path d="M0 8 Q-20 6 -34 12 Q-18 14 0 12 L8 8 Q40 0 72 10 Q86 14 80 20 '
            'Q60 14 36 16 Q14 14 8 16 Q0 16 0 8 Z" fill="%s"/>'
            '<ellipse cx="74" cy="10" rx="10" ry="7" fill="%s"/>'
            '<circle cx="78" cy="7" r="2" fill="#E9F0C0"/>'
            '<path d="M20 14 l-4 8 M22 14 l2 8 M58 14 l-2 8 M60 14 l4 8" stroke="%s" stroke-width="2" fill="none"/>'
            '</g>' % (tx, ty, sc, color, color, color))

def croc(color="#4E5A3A", tx=130, ty=120, sc=1.0):
    # crocodile-line archosaur, long snout
    return ('<g transform="translate(%d,%d) scale(%g)">'
            '<path d="M0 8 Q-22 6 -38 12 Q-20 14 0 12 L10 8 Q44 0 86 8 Q108 10 110 14 '
            'L86 16 Q48 12 22 14 Q8 14 0 12 Z" fill="%s"/>'
            '<path d="M86 8 L110 12 L86 12 Z" fill="%s"/>'
            '<g fill="#6A7A4A"><path d="M14 6 l4 -6 l4 6 Z"/><path d="M30 5 l4 -6 l4 6 Z"/>'
            '<path d="M46 5 l4 -6 l4 6 Z"/><path d="M62 6 l4 -6 l4 6 Z"/></g>'
            '<circle cx="92" cy="9" r="1.8" fill="#E9F0C0"/></g>' % (tx, ty, sc, color, color))

def mammoth(color="#5A4636", tx=140, ty=70, sc=1.0):
    # woolly mammoth: dome head, tusks, trunk, shaggy
    return ('<g transform="translate(%d,%d) scale(%g)">'
            '<path d="M0 40 Q-6 16 24 14 Q36 4 60 8 Q84 6 92 26 Q96 44 86 60 '
            'L78 60 L78 96 L66 96 L66 58 Q40 64 22 58 L22 96 L10 96 L10 54 Q-4 52 0 40 Z" fill="%s"/>'
            '<path d="M30 14 Q34 4 46 6 Q40 12 38 18 Z" fill="#6A5644"/>'  # dome
            '<path d="M26 52 Q18 70 26 84 Q30 72 34 60 Z" fill="%s"/>'    # trunk
            '<path d="M28 56 Q16 70 6 64 Q18 64 26 54 Z" fill="#EAD9B8"/>' # tusk
            '<path d="M40 58 Q30 74 22 70 Q32 68 38 56 Z" fill="#EAD9B8"/>'
            '<circle cx="40" cy="22" r="2.2" fill="#FFE9C0"/></g>' % (tx, ty, sc, color, color))

def sabertooth(color="#7A5A38", tx=150, ty=80, sc=1.0):
    # sabre-toothed cat profile
    return ('<g transform="translate(%d,%d) scale(%g)">'
            '<path d="M0 30 Q-10 12 14 10 Q24 0 44 4 Q58 2 60 16 L54 22 Q44 16 36 20 '
            'Q44 40 38 70 L30 70 L30 30 Q18 36 14 28 L18 70 L10 70 L8 28 Q-4 44 0 30 Z" fill="%s"/>'
            '<path d="M50 18 l-2 14 l4 -2 Z" fill="#FFF8E8"/>'  # sabre tooth
            '<circle cx="46" cy="10" r="2" fill="#FFE9C0"/></g>' % (tx, ty, sc, color))

def groundsloth(color="#6A5238", tx=140, ty=64, sc=1.0):
    # giant ground sloth reared up
    return ('<g transform="translate(%d,%d) scale(%g)">'
            '<path d="M30 96 Q20 70 26 44 Q24 24 40 16 Q52 6 64 16 Q74 24 70 40 '
            'Q78 50 72 64 Q80 78 70 96 L56 96 Q60 76 54 62 Q44 70 34 64 Q40 80 44 96 Z" fill="%s"/>'
            '<path d="M40 16 Q44 6 54 10 Q48 16 48 22 Z" fill="%s"/>'  # head
            '<path d="M26 44 q-12 6 -16 18 q10 -2 18 -10 Z" fill="%s"/>'  # arm+claws
            '<circle cx="46" cy="14" r="2" fill="#FFE9C0"/></g>' % (tx, ty, sc, color, color, color))

def earlyhuman(color="#6A4A34", tx=150, ty=72, sc=1.0):
    # upright hominin with a spear
    return ('<g transform="translate(%d,%d) scale(%g)">'
            '<circle cx="40" cy="14" r="9" fill="%s"/>'
            '<path d="M34 22 Q40 26 46 22 L48 52 Q48 60 40 60 Q32 60 32 52 Z" fill="%s"/>'
            '<rect x="36" y="58" width="4" height="34" fill="%s"/><rect x="42" y="58" width="4" height="34" fill="%s"/>'
            '<path d="M46 28 l16 -4" stroke="%s" stroke-width="3"/>'  # arm
            '<line x1="62" y1="6" x2="62" y2="64" stroke="#8A6A48" stroke-width="2.4"/>'  # spear
            '<path d="M62 6 l-3 8 l3 -2 l3 2 Z" fill="#C9B48A"/></g>' % (tx, ty, sc, color, color, color, color, color))

def trilobite_sea(color="#3E5A60", cx=150, cy=108, sc=1.2):
    # top-down trilobite (three lobes, segments)
    return ('<g transform="translate(%d,%d) scale(%g)">'
            '<path d="M0 -24 Q26 -22 30 0 Q26 28 0 30 Q-26 28 -30 0 Q-26 -22 0 -24 Z" fill="%s"/>'
            '<path d="M0 -22 Q10 -20 11 0 Q10 26 0 28 Q-10 26 -11 0 Q-10 -20 0 -22 Z" fill="#5A7A80"/>'  # axial lobe
            '<g stroke="#26424A" stroke-width="1.4">'
            '<line x1="-26" y1="-6" x2="26" y2="-6"/><line x1="-28" y1="2" x2="28" y2="2"/>'
            '<line x1="-27" y1="10" x2="27" y2="10"/><line x1="-24" y1="18" x2="24" y2="18"/></g>'
            '<circle cx="-6" cy="-18" r="2" fill="#CFF3FF"/><circle cx="6" cy="-18" r="2" fill="#CFF3FF"/></g>'
            % (cx, cy, sc, color))

def ammonite_sea(color="#4A6068", cx=150, cy=108, sc=1.0):
    # coiled ammonite spiral
    return ('<g transform="translate(%d,%d) scale(%g)" fill="none" stroke="%s" stroke-width="6">'
            '<circle cx="0" cy="0" r="28"/><circle cx="0" cy="0" r="20" stroke-width="5"/>'
            '<circle cx="0" cy="0" r="12" stroke-width="4"/>'
            '<g stroke="#6A8088" stroke-width="2">'
            '<line x1="0" y1="-28" x2="0" y2="-12"/><line x1="20" y1="14" x2="9" y2="6"/>'
            '<line x1="-20" y1="14" x2="-9" y2="6"/><line x1="24" y1="-14" x2="11" y2="-6"/>'
            '<line x1="-24" y1="-14" x2="-11" y2="-6"/></g></g>' % (cx, cy, sc, color))

def anomalocaris_sea(color="#3E5A66", cx=150, cy=108, sc=1.0):
    # Anomalocaris: body with side flaps, two front grasping arms
    return ('<g transform="translate(%d,%d) scale(%g)">'
            '<path d="M-60 0 Q-30 -14 20 -12 Q44 -12 56 -2 Q44 10 20 12 Q-30 14 -60 4 Z" fill="%s"/>'
            '<g fill="#5A7A86" opacity="0.85">'
            '<path d="M-50 8 q-6 14 -18 16 q10 -2 16 -10 Z"/><path d="M-32 10 q-6 14 -18 16 q10 -2 16 -10 Z"/>'
            '<path d="M-14 10 q-6 14 -18 16 q10 -2 16 -10 Z"/><path d="M4 10 q-6 14 -18 16 q10 -2 16 -10 Z"/></g>'
            '<path d="M52 -4 q14 -6 22 2 q-10 0 -16 6 q-2 6 -8 8 q4 -10 2 -16 Z" fill="%s"/>'  # grasping arm
            '<path d="M52 4 q14 4 18 14 q-10 -6 -16 -4 q-2 -6 -8 -6 Z" fill="%s"/>'
            '<circle cx="40" cy="-6" r="2.4" fill="#CFF3FF"/></g>' % (cx, cy, sc, color, color, color))

def eurypterid_sea(color="#3A5A52", cx=150, cy=108, sc=1.0):
    # sea scorpion: segmented body, paddle, tail spike, claws
    return ('<g transform="translate(%d,%d) scale(%g)">'
            '<path d="M40 0 Q20 -10 -10 -8 Q-40 -8 -64 0 Q-40 8 -10 8 Q20 10 40 0 Z" fill="%s"/>'
            '<path d="M-64 0 l-16 -2 l0 4 Z" fill="%s"/>'  # tail spike
            '<g stroke="#26423A" stroke-width="1.2">'
            '<line x1="20" y1="-8" x2="20" y2="8"/><line x1="6" y1="-9" x2="6" y2="9"/>'
            '<line x1="-8" y1="-9" x2="-8" y2="9"/><line x1="-22" y1="-8" x2="-22" y2="8"/></g>'
            '<path d="M40 -4 q14 -4 20 2 q-8 0 -12 4 Z" fill="%s"/>'   # claw
            '<path d="M40 4 q14 4 18 12 q-8 -6 -12 -4 Z" fill="%s"/>'
            '<path d="M30 8 q-6 12 -16 14 q8 -2 14 -8 Z" fill="%s"/>'  # paddle
            '<circle cx="30" cy="-4" r="2" fill="#CFF3FF"/></g>'
            % (cx, cy, sc, color, color, color, color, color))

def ediacaran_sea(cx=160, cy=110, sc=1.0):
    # Ediacaran frond + disc on sea floor
    return ('<g transform="translate(%d,%d) scale(%g)">'
            '<path d="M0 40 Q-2 0 0 -34 Q12 -28 8 -6 Q14 -22 6 -36 Q20 -30 12 -8 '
            'Q18 -18 10 -34 L8 40 Z" fill="#5A8A86"/>'
            '<path d="M0 -34 Q-12 -28 -8 -6 Q-14 -22 -6 -36 Q-20 -30 -12 -8 Q-18 -18 -10 -34 Z" fill="#4A7A76"/>'
            '<ellipse cx="40" cy="34" rx="16" ry="6" fill="#6A9A96"/>'
            '<circle cx="40" cy="34" r="6" fill="#7AAAA6"/>'
            '<ellipse cx="-40" cy="36" rx="12" ry="5" fill="#6A9A96"/></g>' % (cx, cy, sc))

def fern_plant(tx=150, ty=80, sc=1.0):
    # lush fern / cycad fronds
    return ('<g transform="translate(%d,%d) scale(%g)">'
            '<g stroke="#3E7A3C" stroke-width="3" fill="none">'
            '<path d="M0 70 Q-6 30 -28 6"/><path d="M0 70 Q0 26 0 -6"/><path d="M0 70 Q6 30 28 6"/>'
            '<path d="M0 70 Q-10 40 -40 26"/><path d="M0 70 Q10 40 40 26"/></g>'
            '<g fill="#4E8B40">'
            '<path d="M-28 6 q-8 -4 -10 -12 q8 2 12 8 Z"/><path d="M0 -6 q-6 -8 -4 -16 q6 6 6 14 Z"/>'
            '<path d="M28 6 q8 -4 10 -12 q-8 2 -12 8 Z"/></g>'
            '<g stroke="#5A9A4A" stroke-width="1.4">'
            '<path d="M-14 40 l-6 -4 M-10 30 l-7 -3 M-6 20 l-7 -2 M14 40 l6 -4 M10 30 l7 -3 M6 20 l7 -2 M0 24 l-5 -4 M0 14 l-5 -4"/></g></g>'
            % (tx, ty, sc))

def mushroom_fungus(tx=150, ty=96, sc=1.0):
    # giant Prototaxites-style fungal trunk + small mushrooms
    return ('<g transform="translate(%d,%d) scale(%g)">'
            '<path d="M-8 60 Q-12 10 -6 -30 Q0 -36 6 -30 Q12 10 8 60 Z" fill="#9A7A4A"/>'
            '<ellipse cx="0" cy="-32" rx="16" ry="8" fill="#B89A60"/>'
            '<g fill="#C98A6A"><ellipse cx="34" cy="50" rx="12" ry="6"/><rect x="31" y="50" width="6" height="12" fill="#D8C4A0"/>'
            '<ellipse cx="-34" cy="54" rx="9" ry="5"/><rect x="-37" y="54" width="5" height="10" fill="#D8C4A0"/></g></g>'
            % (tx, ty, sc))

# ---- non-creature concept scenes ----

def fossil_scene():
    # ammonite + bone fossil embedded in rock strata
    s = HDR + sky("fos", *ROCK_T)
    s += ('<g>'
          '<rect y="0" width="320" height="200" fill="#8A6E4E"/>'
          '<rect y="0" width="320" height="50" fill="#9C8060"/>'
          '<rect y="120" width="320" height="40" fill="#7A5E40"/>'
          '<g opacity="0.25" stroke="#5A4428" stroke-width="2" fill="none">'
          '<path d="M0 50 Q160 44 320 50"/><path d="M0 120 Q160 114 320 120"/><path d="M0 160 Q160 154 320 160"/></g>'
          # ammonite fossil
          '<g transform="translate(96,108)" fill="none" stroke="#E8DCC2" stroke-width="5">'
          '<circle r="26"/><circle r="18" stroke-width="4"/><circle r="10" stroke-width="3"/></g>'
          # bone fossil
          '<g transform="translate(210,96) rotate(20)" fill="#EDE2C8">'
          '<rect x="-34" y="-7" width="68" height="14" rx="6"/>'
          '<circle cx="-34" cy="-10" r="9"/><circle cx="-34" cy="10" r="9"/>'
          '<circle cx="34" cy="-10" r="9"/><circle cx="34" cy="10" r="9"/></g></g>')
    return s + "</svg>"

def strata_scene():
    # layered rock canyon
    s = HDR + sky("str", "#F3D7A8", "#E6B578")
    cols = ["#C9A878","#B8945E","#A8814C","#946B3C","#7E5630","#6A4828"]
    y = 70
    body = '<g>'
    for i,c in enumerate(cols):
        body += '<path d="M0 %d Q160 %d 320 %d V%d H0 Z" fill="%s"/>' % (y, y-8, y, y+24, c)
        y += 22
    body += '</g>'
    s += body
    # canyon shadow
    s += '<path d="M150 70 L172 70 L160 200 L138 200 Z" fill="#3A2A1A" opacity="0.18"/>'
    return s + "</svg>"

def timescale_scene():
    # horizontal time bands with an arrow
    s = HDR + sky("tim", "#EAF0F6", "#CBD8E6")
    bands = [("#7FB0D8",0),("#7FC4BE",53),("#9CC07A",106),("#E6C36A",160),("#E59A6A",214),("#C98A8A",268)]
    body = '<g>'
    for c,x in bands:
        body += '<rect x="%d" y="70" width="54" height="64" fill="%s"/>' % (x, c)
    body += '</g>'
    s += body
    s += '<rect x="0" y="134" width="320" height="6" fill="#4A4A4A"/>'
    s += '<path d="M300 124 l16 13 l-16 13 Z" fill="#4A4A4A"/>'
    s += ('<g fill="#FFFFFF" opacity="0.85"><circle cx="27" cy="150" r="3"/><circle cx="133" cy="150" r="3"/>'
          '<circle cx="241" cy="150" r="3"/></g>')
    return s + "</svg>"

def excavation_scene():
    # dig site: bones in ground + tools + flags
    s = HDR + sky("exc", *SAND_T)
    s += ('<path d="M0 120 Q160 108 320 120 V200 H0 Z" fill="#C49A60"/>'
          '<path d="M0 150 Q160 140 320 150 V200 H0 Z" fill="#A87E48"/>')
    # grid pegs and string
    s += ('<g stroke="#6A4A2A" stroke-width="2">'
          '<line x1="60" y1="138" x2="260" y2="132"/><line x1="60" y1="166" x2="260" y2="160"/>'
          '<line x1="90" y1="130" x2="90" y2="172"/><line x1="160" y1="128" x2="160" y2="170"/>'
          '<line x1="230" y1="128" x2="230" y2="166"/></g>')
    # exposed bones
    s += ('<g fill="#EFE4CA"><rect x="110" y="148" width="40" height="9" rx="4"/>'
          '<circle cx="110" cy="152" r="7"/><circle cx="150" cy="152" r="7"/>'
          '<rect x="186" y="150" width="34" height="8" rx="4" transform="rotate(-12 186 150)"/></g>')
    # brush + pick
    s += ('<g><rect x="70" y="96" width="4" height="34" fill="#8A5A30" transform="rotate(18 70 96)"/>'
          '<rect x="66" y="126" width="12" height="10" fill="#D8C49A" transform="rotate(18 66 126)"/>'
          '<g transform="translate(250,92) rotate(-22)"><rect x="-2" y="0" width="4" height="30" fill="#6A4A2A"/>'
          '<path d="M-14 0 Q0 -8 14 0 Q0 -2 -14 0 Z" fill="#9AA0A6"/></g></g>')
    # flag
    s += '<g><line x1="40" y1="100" x2="40" y2="138" stroke="#5A3A1A" stroke-width="2"/><path d="M40 100 l18 6 l-18 6 Z" fill="#D2552F"/></g>'
    return s + "</svg>"

def museum_scene():
    # mounted skeleton under arch
    s = HDR + sky("mus", "#EDE6D8", "#D6CBB6")
    s += '<rect y="150" width="320" height="50" fill="#B8A488"/>'
    # pillars + arch
    s += ('<g fill="#CFC4AC"><rect x="34" y="40" width="14" height="110"/><rect x="272" y="40" width="14" height="110"/>'
          '<path d="M34 44 Q160 6 286 44 L286 56 Q160 22 34 56 Z"/></g>')
    # skeleton: sauropod mount
    s += ('<g stroke="#EFE7D2" stroke-width="6" fill="none" stroke-linecap="round">'
          '<path d="M70 140 Q96 120 120 116 Q150 112 176 110 Q150 96 130 70 Q116 44 128 30"/>'
          '<path d="M176 110 Q210 112 244 126"/></g>'
          '<g stroke="#EFE7D2" stroke-width="5">'
          '<line x1="110" y1="120" x2="110" y2="150"/><line x1="140" y1="116" x2="140" y2="150"/>'
          '<line x1="186" y1="112" x2="190" y2="150"/><line x1="214" y1="116" x2="220" y2="150"/></g>'
          '<g stroke="#EFE7D2" stroke-width="2">'
          '<line x1="96" y1="118" x2="170" y2="112"/><line x1="100" y1="126" x2="172" y2="118"/></g>'
          '<circle cx="128" cy="28" r="4" fill="#EFE7D2"/>')
    return s + "</svg>"

def volcano_scene():
    # erupting volcano with plates feel
    s = HDR + sky("vol", "#5A4A5E", "#C9756B")
    s += sun("vol", 60, 50, 16, "#FFE3B0", "#F2A85A")
    s += ('<path d="M0 170 Q160 160 320 170 V200 H0 Z" fill="#3A2A2A"/>'
          '<path d="M90 170 L150 70 L160 60 L172 72 L240 170 Z" fill="#4A3A3A"/>'
          '<path d="M150 76 L162 60 L174 78 Q162 70 150 76 Z" fill="#2A1E1E"/>'
          # lava
          '<path d="M150 72 Q160 40 158 22 Q166 40 170 72 Z" fill="#F2A03A"/>'
          '<path d="M156 70 Q162 50 162 36 Q168 52 168 70 Z" fill="#F2D23A"/>'
          # lava flow
          '<path d="M160 78 Q150 120 132 170 L150 170 Q160 124 168 86 Z" fill="#E2562A"/>')
    # ash cloud
    s += ('<g fill="#5A4A4A" opacity="0.7"><circle cx="160" cy="18" r="18"/><circle cx="180" cy="24" r="14"/>'
          '<circle cx="142" cy="26" r="13"/></g>')
    # embers
    s += '<g fill="#F2C23A"><circle cx="186" cy="48" r="2"/><circle cx="140" cy="40" r="2"/><circle cx="172" cy="34" r="1.6"/></g>'
    return s + "</svg>"

def extinction_scene():
    # dark sky, asteroid streaking toward horizon with dino silhouette
    s = HDR + sky("ext", "#3A2A3E", "#7A3A2E")
    s += sun("ext", 70, 48, 20, "#F2C46A", "#E2603A")
    s += '<path d="M0 150 Q160 140 320 150 V200 H0 Z" fill="#2A1E22"/>'
    # asteroid + trail
    s += ('<g><line x1="40" y1="20" x2="210" y2="120" stroke="#F2C46A" stroke-width="3" opacity="0.7"/>'
          '<circle cx="214" cy="124" r="9" fill="#F2A03A"/><circle cx="214" cy="124" r="14" fill="#F2A03A" opacity="0.3"/></g>')
    # T. rex silhouette on horizon
    s += theropod("#140C10", 150, 96, 0.9)
    # falling debris
    s += '<g stroke="#E2A03A" stroke-width="2" opacity="0.6"><line x1="90" y1="30" x2="100" y2="44"/><line x1="140" y1="22" x2="152" y2="38"/><line x1="250" y1="40" x2="262" y2="56"/></g>'
    return s + "</svg>"

def amber_scene():
    # amber blob with trapped insect
    s = HDR + sky("amb", "#F3D7A0", "#D89A4A")
    s += ('<g transform="translate(160,108)">'
          '<ellipse rx="70" ry="86" fill="#E2912A" opacity="0.55"/>'
          '<ellipse rx="56" ry="70" fill="#F2B04A" opacity="0.5"/>'
          '<ellipse rx="40" ry="52" fill="#F8D27A" opacity="0.6"/>'
          # trapped insect
          '<g fill="#3A2A14"><ellipse cx="0" cy="0" rx="6" ry="12"/><circle cx="0" cy="-14" r="5"/>'
          '<g stroke="#3A2A14" stroke-width="2"><line x1="-6" y1="-4" x2="-22" y2="-12"/><line x1="6" y1="-4" x2="22" y2="-12"/>'
          '<line x1="-6" y1="2" x2="-24" y2="2"/><line x1="6" y1="2" x2="24" y2="2"/>'
          '<line x1="-6" y1="8" x2="-20" y2="18"/><line x1="6" y1="8" x2="20" y2="18"/></g>'
          '<path d="M-2 -18 l-8 -10 M2 -18 l8 -10" stroke="#3A2A14" stroke-width="1.6"/></g></g>'
          '<ellipse cx="146" cy="64" rx="14" ry="22" fill="#FFFFFF" opacity="0.25"/>')
    return s + "</svg>"

def footprint_scene():
    # three-toed dino tracks across mud
    s = HDR + sky("foot", "#D8C49A", "#B8945E")
    s += '<path d="M0 70 Q160 60 320 70 V200 H0 Z" fill="#A8814C"/>'
    def track(x,y,sc):
        return ('<g transform="translate(%d,%d) scale(%g)" fill="#6A4A28">'
                '<path d="M0 0 Q-6 -22 -3 -30 Q0 -34 3 -30 Q6 -22 0 0 Z"/>'
                '<path d="M0 0 Q-16 -16 -18 -24 Q-18 -30 -12 -28 Q-4 -22 0 0 Z"/>'
                '<path d="M0 0 Q16 -16 18 -24 Q18 -30 12 -28 Q4 -22 0 0 Z"/>'
                '<ellipse cx="0" cy="6" rx="8" ry="6"/></g>' % (x,y,sc))
    s += track(70,110,1.0) + track(150,140,1.1) + track(232,108,1.0) + track(118,168,1.15)
    return s + "</svg>"

# ---- assemble all ----
def build_art():
    A = {}
    A["theropod"]   = land_scene("thr", *AMBER, "#9C7A4A", "#6E5230", theropod("#5A3A22"))
    A["raptor"]     = land_scene("rap", *DUSK, "#8A6E4A", "#5E4A2E", raptor("#6B4327"))
    A["sauropod"]   = land_scene("sau", *AMBER, "#7FB85A", "#4E8B40", sauropod("#5A6A4A", 96, 40))
    A["stegosaur"]  = land_scene("steg", *AMBER, "#8FA85A", "#5E7B40", stegosaur("#5E5238"))
    A["ankylosaur"] = land_scene("anky", "#F3D7A8", "#C9A06A", "#9C8A5A", "#6E5A30", ankylosaur("#5A4A36"))
    A["ceratopsian"]= land_scene("cera", *DUSK, "#8FA85A", "#5E7B40", ceratopsian("#6A4A38"))
    A["hadrosaur"]  = land_scene("hadr", *AMBER, "#7FB85A", "#4E8B40", hadrosaur("#5A6048"))
    A["pachy"]      = land_scene("pach", *AMBER, "#9C8A5A", "#6E5A30", pachy("#6B4A30"))
    A["earlydino"]  = land_scene("erld", "#F3D7A8", "#D89A6A", "#B89460", "#8A6A40", earlydino("#6E5236"))
    A["pterosaur"]  = (HDR + sky("pter", "#CFE6F2", "#8FBEDC") + sun("pter", 250, 50, 22)
                       + '<g fill="#FFFFFF" opacity="0.5"><ellipse cx="70" cy="60" rx="30" ry="10"/><ellipse cx="120" cy="48" rx="22" ry="8"/></g>'
                       + ground("pter", "#9CC07A", "#6E9A4A", 168) + pterosaur_fly("#7A5640", 150, 80, 1.0) + "</svg>")
    A["terrorbird"] = land_scene("terb", *DUSK, "#9CB06A", "#6E8B44", terrorbird("#6A4A2E"))
    A["plesiosaur"] = sea_scene("ples", *TEAL, "#3C6A7A", "#1C3E50", plesiosaur_sea("#3C5A66"))
    A["dunkleosteus"]= sea_scene("dunk", "#9FCBD8", "#5C97AE", "#3C6A7A", "#1C3E50", dunkleosteus_sea("#41606B"))
    A["shark"]      = sea_scene("shrk", "#8FC0D0", "#4C87A0", "#2E6A86", "#163C52", shark_sea("#46555C"))
    A["dimetrodon"] = land_scene("dime", "#F3C99A", "#C9756B", "#B8945E", "#8A6A40", dimetrodon("#6A4438"))
    A["amphibian"]  = (HDR + sky("amph", *SWAMP) + ground("amph", "#7FA85A", "#4E7B3A", 150)
                       + water("amph", "#9CC0B0", "#5C8A7A", 150) + amphibian("#4E6A4A", 150, 140) + "</svg>")
    A["croc"]       = (HDR + sky("croc", *SWAMP) + water("croc", "#9CB8A0", "#5C7A5A", 130)
                       + croc("#4E5A3A", 130, 124) + "</svg>")
    A["mammoth"]    = land_scene("mam", *ICE, "#C8D4C0", "#9CB090", mammoth("#5A4636"), suncol=("#FFF4D8","#E8DCC0"))
    A["sabertooth"] = land_scene("sab", *DUSK, "#C9B98A", "#9C8A5A", sabertooth("#7A5A38"))
    A["groundsloth"]= land_scene("grsl", *AMBER, "#9CB06A", "#6E8B44", groundsloth("#6A5238"))
    A["earlyhuman"] = land_scene("ehum", "#F3D7A8", "#D89A6A", "#B8945E", "#8A6A40", earlyhuman("#6A4A34"))
    A["trilobite"]  = sea_scene("tril", *DEEPSEA_T, *DEEPSEA_B, trilobite_sea("#3E5A60"), ray=False)
    A["ammonite"]   = sea_scene("ammo", *DEEPSEA_T, *DEEPSEA_B, ammonite_sea("#4A6068"), ray=False)
    A["anomalocaris"]= sea_scene("anom", *DEEPSEA_T, *DEEPSEA_B, anomalocaris_sea("#3E5A66"), ray=False)
    A["eurypterid"] = sea_scene("eury", *DEEPSEA_T, *DEEPSEA_B, eurypterid_sea("#3A5A52"), ray=False)
    A["ediacaran"]  = (HDR + sky("edia", "#4A7A86", "#26505E") + water("edia", "#3C6A78", "#163C48", 60)
                       + '<path d="M0 160 Q160 150 320 160 V200 H0 Z" fill="#1C3E48"/>' + ediacaran_sea(160, 120, 1.0) + "</svg>")
    A["fern"]       = land_scene("fern", *SWAMP, "#7FA85A", "#4E7B3A", fern_plant(150, 80))
    A["mushroom"]   = land_scene("mush", "#D8E0C0", "#A8C088", "#8FA85A", "#5E7B40", mushroom_fungus(150, 96))
    A["fossil"]     = fossil_scene()
    A["strata"]     = strata_scene()
    A["timescale"]  = timescale_scene()
    A["excavation"] = excavation_scene()
    A["museum"]     = museum_scene()
    A["volcano"]    = volcano_scene()
    A["extinction"] = extinction_scene()
    A["amber"]      = amber_scene()
    A["footprint"]  = footprint_scene()
    return A

if __name__ == "__main__":
    A = build_art()
    print("art keys:", len(A))
    # check every svg parses-ish (balanced tags) and starts with <svg
    bad = [k for k,v in A.items() if not v.startswith("<svg") or not v.endswith("</svg>")]
    print("bad svgs:", bad)
    for k,v in A.items():
        if v.count("<svg")!=1 or v.count("</svg>")!=1:
            print("tag imbalance:", k)
