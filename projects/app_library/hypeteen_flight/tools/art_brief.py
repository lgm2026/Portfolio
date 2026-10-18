#!/usr/bin/env python3
"""Builds the art-generation brief for an outside illustrator: docs/ART_GENERATION_BRIEF.pdf.
   One PDF, every raster asset the app still needs, with exact pixel sizes, slot diagrams, style rules and the
   return format. Reference crops come from the author's own Illustrated Revision board and the cropped Book One cover.
   Run: python3 tools/art_brief.py [--board <dir with the board PNGs>] [--screens <all-screens jpg>]"""
import os, sys, tempfile
from PIL import Image
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Flowable,
                                Image as RLImage, KeepTogether)

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
WEB = os.path.join(ROOT, 'web'); DOCS = os.path.join(ROOT, 'docs')
args = sys.argv[1:]
def opt(name, default):
    return args[args.index(name) + 1] if name in args else default
BOARD = opt('--board', os.path.join(ROOT, '..', '..', 'baseline', 'illustrated_rev', 'extracted', 'assets'))
SCREENS = opt('--screens', os.path.join(ROOT, '..', 'release', 'HTFA_r7.1_all_screens.jpg'))
OUT = opt('--out', os.path.join(DOCS, 'ART_GENERATION_BRIEF.pdf'))
tmp = tempfile.mkdtemp()

NAVY = colors.HexColor('#10263D'); BLUE = colors.HexColor('#183B5A'); BRASS = colors.HexColor('#B88C35')
CREAM = colors.HexColor('#F2E7CB'); SLATE = colors.HexColor('#657889'); GOLD = colors.HexColor('#E9C77A')
INK = colors.HexColor('#1B2430'); PALE = colors.HexColor('#F7F2E6'); LINE = colors.HexColor('#D8CDB4')

PW, PH = letter
M = 0.65 * inch
CW = PW - 2 * M

def ps(name, **kw):
    base = dict(fontName='Helvetica', fontSize=9.6, leading=13, textColor=INK, alignment=TA_LEFT)
    base.update(kw); return ParagraphStyle(name, **base)
H1 = ps('h1', fontName='Times-Bold', fontSize=20, leading=24, textColor=NAVY, spaceAfter=6)
H2 = ps('h2', fontName='Times-Bold', fontSize=14.5, leading=18, textColor=NAVY, spaceBefore=10, spaceAfter=4)
H3 = ps('h3', fontName='Helvetica-Bold', fontSize=10.2, leading=13, textColor=BLUE, spaceBefore=6, spaceAfter=2)
P = ps('p', spaceAfter=4)
SM = ps('sm', fontSize=8.2, leading=10.6, textColor=SLATE)
SMI = ps('smi', fontSize=8.2, leading=10.6, textColor=INK)
CELL = ps('cell', fontSize=8.4, leading=10.8)
CELLB = ps('cellb', fontName='Helvetica-Bold', fontSize=8.4, leading=10.8, textColor=NAVY)
MONO = ps('mono', fontName='Courier-Bold', fontSize=8.2, leading=10.4, textColor=NAVY)
BUL = ps('bul', leftIndent=12, bulletIndent=2, spaceAfter=2.5)

def bullets(items):
    return [Paragraph(t, BUL, bulletText='•') for t in items]

def thumb(src, maxw, maxh, crop=None, q=86, name=None):
    im = Image.open(src).convert('RGB')
    if crop: im = im.crop(crop)
    im.thumbnail((maxw, maxh), Image.LANCZOS)
    out = os.path.join(tmp, (name or os.path.basename(src)).rsplit('.', 1)[0] + '.jpg'); im.save(out, quality=q); return out

def pic(path, w, h=None, crop=None, maxpx=1400):
    """A reference image scaled to w points (keeps aspect)."""
    im = Image.open(path)
    if crop: im = im.crop(crop)
    iw, ih = im.size
    if h is None: h = w * ih / iw
    f = thumb(path, maxpx, int(maxpx * ih / iw) + 1, crop, name=os.path.basename(path) + ('_%d_%d_%d_%d' % tuple(crop) if crop else ''))
    return RLImage(f, width=w, height=h)

class Swatches(Flowable):
    def __init__(self, items, w):
        super().__init__(); self.items = items; self.width = w; self.height = 0.78 * inch
    def draw(self):
        c = self.canv; n = len(self.items); gap = 6; bw = (self.width - gap * (n - 1)) / n
        for i, (hexv, name, use) in enumerate(self.items):
            x = i * (bw + gap)
            c.setFillColor(colors.HexColor(hexv)); c.setStrokeColor(LINE); c.roundRect(x, 0.3 * inch, bw, 0.44 * inch, 4, fill=1, stroke=1)
            c.setFillColor(INK); c.setFont('Helvetica-Bold', 7.4); c.drawString(x, 0.17 * inch, name)
            c.setFont('Courier', 7.2); c.drawString(x, 0.06 * inch, hexv)
            c.setFont('Helvetica', 6.6); c.setFillColor(SLATE); c.drawString(x, -0.06 * inch, use)
    def wrap(self, aw, ah): return (self.width, self.height + 0.1 * inch)

class Slot(Flowable):
    """A slot diagram: the plate at its true aspect, zones the app draws over hatched in brass, the floor line marked."""
    def __init__(self, w_units, h_units, zones, w, eye=None, note_left=None, markers=None):
        super().__init__(); self.wu = w_units; self.hu = h_units; self.zones = zones; self.width = w
        self.k = w / w_units; self.height = h_units * self.k + 0.42 * inch; self.eye = eye; self.note_left = note_left; self.markers = markers or []
    def wrap(self, aw, ah): return (self.width, self.height)
    def draw(self):
        c = self.canv; k = self.k; W = self.wu * k; H = self.hu * k; y0 = 0.3 * inch
        c.setFillColor(PALE); c.setStrokeColor(NAVY); c.setLineWidth(0.8); c.rect(0, y0, W, H, fill=1, stroke=1)
        if self.note_left:
            lw = self.note_left[0] * k
            c.setFillColor(colors.Color(0.1, 0.15, 0.24, 0.08)); c.rect(0, y0, lw, H, fill=1, stroke=0)
            c.setStrokeColor(SLATE); c.setDash(2, 2); c.line(lw, y0, lw, y0 + H); c.setDash()
            c.setFillColor(SLATE); c.setFont('Helvetica-Oblique', 6.4); c.drawCentredString(lw / 2, y0 + H / 2 - 2, self.note_left[1])
        for (a, b, label) in self.zones:
            x = a * k; w = (b - a) * k
            c.setFillColor(colors.Color(0.72, 0.55, 0.21, 0.28)); c.rect(x, y0, w, H, fill=1, stroke=0)
            c.setStrokeColor(BRASS); c.setLineWidth(0.5); c.rect(x, y0, w, H, fill=0, stroke=1)
            c.setFillColor(NAVY); c.setFont('Helvetica-Bold', 6.2)
            c.drawCentredString(x + w / 2, y0 + H - 9, label)
            c.setFont('Helvetica', 5.8); c.setFillColor(SLATE)
            c.drawCentredString(x + w / 2, y0 + 3, '%d%%-%d%%' % (round(100 * a / self.wu), round(100 * b / self.wu)))
        for (x, label) in self.markers:
            X = x * k; c.setStrokeColor(BLUE); c.setDash(1, 2); c.line(X, y0, X, y0 + H); c.setDash()
            c.setFillColor(BLUE); c.setFont('Helvetica-Oblique', 6.2); c.drawCentredString(X, y0 + H / 2 + 6, label)
        if self.eye:
            ey = y0 + H * (1 - self.eye); c.setStrokeColor(colors.Color(0.1, 0.23, 0.35, 0.5)); c.setDash(3, 3); c.line(0, ey, W, ey); c.setDash()
            c.setFillColor(BLUE); c.setFont('Helvetica-Oblique', 6.2); c.drawRightString(W - 3, ey + 2, 'eye level')
        c.setStrokeColor(BRASS); c.setLineWidth(1.4); c.line(0, y0, W, y0)
        c.setFillColor(BRASS); c.setFont('Helvetica-Bold', 6.6); c.drawString(0, y0 - 9, 'floor line (bottom edge of the plate meets the floor)')
        c.setFillColor(SLATE); c.setFont('Helvetica', 6.6); c.drawRightString(W, y0 - 9, 'hatched = the app draws its own object here; keep the painting calm behind it')

def hdr(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(NAVY); canvas.rect(0, PH - 0.62 * inch, PW, 0.62 * inch, fill=1, stroke=0)
    canvas.setFillColor(BRASS); canvas.rect(0, PH - 0.62 * inch - 2, PW, 2, fill=1, stroke=0)
    canvas.setFillColor(GOLD); canvas.setFont('Times-Bold', 13); canvas.drawString(M, PH - 0.40 * inch, 'HypeTeen Flight Academy')
    canvas.setFillColor(CREAM); canvas.setFont('Helvetica', 8.2); canvas.drawRightString(PW - M, PH - 0.40 * inch, 'Art generation brief for the illustrator  |  v1.0  |  2026-10-16')
    canvas.setFillColor(SLATE); canvas.setFont('Helvetica', 7.6)
    canvas.drawString(M, 0.42 * inch, 'Hype Learning Academies. Reference images are the publisher\'s own concept board and cover, supplied for producing these assets only.')
    canvas.drawRightString(PW - M, 0.42 * inch, 'page %d' % doc.page)
    canvas.restoreState()

HD = ps('hd', fontName='Helvetica-Bold', fontSize=8.4, leading=10.8, textColor=CREAM)
def table(rows, widths, head=True, zebra=True, fs=None):
    if head: rows = [[Paragraph(c.text, HD) if isinstance(c, Paragraph) else c for c in rows[0]]] + rows[1:]
    t = Table(rows, colWidths=widths, repeatRows=1 if head else 0)
    st = [('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LINEBELOW', (0, 0), (-1, -1), 0.35, LINE),
          ('LEFTPADDING', (0, 0), (-1, -1), 4), ('RIGHTPADDING', (0, 0), (-1, -1), 4), ('TOPPADDING', (0, 0), (-1, -1), 3), ('BOTTOMPADDING', (0, 0), (-1, -1), 3)]
    if head:
        st += [('BACKGROUND', (0, 0), (-1, 0), NAVY), ('TEXTCOLOR', (0, 0), (-1, 0), CREAM), ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'), ('FONTSIZE', (0, 0), (-1, 0), 8.2)]
    if zebra:
        for i in range(1 if head else 0, len(rows)):
            if i % 2 == (0 if head else 1): st.append(('BACKGROUND', (0, i), (-1, i), PALE))
    t.setStyle(TableStyle(st)); return t

def c_(s): return Paragraph(s, CELL)
def b_(s): return Paragraph(s, CELLB)
def m_(s): return Paragraph(s, MONO)

# ------------------------------------------------------------------------------------------------ content data
WALLS = [
 # key, scene, w, h, px, zones[(a,b,label)], outdoor_left, markers, brief
 ('lounge', "Pilot's Lounge", 520, 120, [(48, 92, 'door'), (178, 222, 'door'), (230, 270, 'stairs'), (282, 378, 'crew board'), (382, 438, 'cork board'), (455, 499, 'trophy case')], None, [],
  'Back wall of a flight-school lounge at golden hour. Tall windows onto the apron with a control tower far off, parked light aircraft as soft shapes, warm interior wood and brass, a leather bench line low on the wall. Put the big windows in the open spans (18% to 34% of the width, and the gaps to the right of 52%); the hatched zones carry a door, stairs and boards the app draws, so keep the wall plain behind them.'),
 ('gameroom', 'Game Room', 600, 120, [(18, 62, 'door'), (103, 137, 'dart board'), (245, 415, 'neon sign'), (445, 495, 'hoops'), (521, 591, 'score board')], None, [],
  'Panelled navy wall of a clubroom at night, warm lamp light, framed aviation prints as soft blurred shapes, a brass rail. No neon, no screens, no legible print content (the app draws its own sign, darts and hoops over the hatched zones).'),
 ('classroom', 'Classroom', 520, 120, [(32, 112, 'book shelf'), (126, 286, 'white board'), (330, 414, 'patch wall'), (440, 492, 'review desk')], None, [],
  'Ground-school wall in daylight. Pale wall, a wide blank whiteboard or projection surface where the hatched "white board" zone is (the app draws its own diagrams over it, so the surface must be empty), a shelf line and a window at the right with the airfield outside. Charts and posters only as soft shapes without text.'),
 ('hangar', 'Hangar', 560, 130, [(41, 151, 'photo gallery'), (205, 355, 'hangar door'), (414, 510, 'parts shelf')], None, [],
  'Hangar interior back wall: steel framing, corrugated panels, work lights, tool boards as soft shapes, a wide door opening centered on the hatched "hangar door" zone (37% to 63%) with sunset sky showing through it. The app draws the door itself; paint the opening, frame and track. No flags, no aircraft on the wall.'),
 ('platform', 'Viewing Platform', 680, 140, [], (200, 'continues past the left edge of the deck'), [],
  'Pure sky plate: golden-hour sky over distant hills and a tree line, the sun low at the right, no aircraft, no buildings in the lower third beyond a far-off hangar roofline. The deck floor starts at the bottom edge. The left 29% of the plate lies off the edge of the walkable deck but is visible, so the horizon must run the full width.'),
 ('tower', 'Tower cab', 520, 150, [(88, 172, 'ATIS desk'), (214, 310, 'window console'), (370, 450, 'flight strips')], None, [],
  'Inside a control-tower cab at dusk: the slanted cab glass with the airfield below (runway lights just coming on, a taxiway, the apron), console desk line along the bottom 30% (keep it plain; the app draws screens and strips over the hatched zones). Lights as warm points, no text or numerals anywhere.'),
 ('ramp', 'Parking Stand', 840, 110, [(275, 425, 'gate to the runway')], (200, 'off the left edge of the apron'), [(286, 'control tower here (optional)')],
  'Outdoor horizon seen from the apron at golden hour: a low FBO or terminal building far away, a control tower where the marker is, fuel farm and hangars as distant shapes, big sky above. The apron floor starts at the bottom edge. No painted ground markings (the app draws FAA-standard markings on the floor).'),
 ('wash', 'Wash Rack', 520, 130, [(398, 482, 'supply shelf')], None, [],
  'Wash-bay wall: wet concrete and tile, coiled hoses, a pressure-washer unit and racks as soft shapes, bright daylight from a large door at the left, water sheen on surfaces. No signage text.'),
 ('runway', 'Runway', 840, 110, [], (200, 'off the left edge of the field'), [(740, 'control tower here (optional)')],
  'Runway horizon at golden hour: flat grass field to the horizon, far-off hangars and a tower where the marker is, approach lights only as distant points, no runway surface or markings in the picture (the runway, numbers and FAA lights are drawn by the app on the floor).'),
]
WALL_PX = {'lounge': (3120, 720), 'gameroom': (3600, 720), 'classroom': (3120, 720), 'hangar': (3360, 780), 'platform': (4080, 840),
           'tower': (3120, 900), 'ramp': (5040, 660), 'wash': (3120, 780), 'runway': (5040, 660)}
FLOORS = [
 ('lounge', 520, 280, 'warm walnut plank floor, boards running left to right, satin finish'),
 ('gameroom', 600, 300, 'deep navy low-pile carpet with a faint diamond weave'),
 ('classroom', 520, 280, 'cream and soft grey checker tile, matte, slightly worn'),
 ('hangar', 560, 290, 'sealed grey concrete with saw-cut joints on a square grid (about 9 joints across), light tire scuffs; no painted lines (the app draws the yellow lead-in line)'),
 ('platform', 480, 220, 'weathered timber deck boards running top to bottom, silvered, with visible grain'),
 ('tower', 520, 230, 'charcoal low-pile carpet, very even'),
 ('wash', 520, 270, 'wet sealed concrete with a slight sheen and a shallow drain channel across the middle third'),
]
TILES = [
 ('runway', 'Airfield / runway', 'a runway at sunrise, looking down the centerline toward the sun, PAPI and edge lights glowing (lights only, no numerals or legible markings)'),
 ('hangar', 'Hangar interior', 'a bright hangar interior with a high-wing training aircraft silhouetted against the open door (generic, no markings), tool chests, polished floor'),
 ('lounge', "Pilot's lounge", 'a lounge with big windows onto the apron at golden hour, leather seating, wood and brass, a blank framed map as a soft shape'),
 ('classroom', 'Classroom', 'a ground-school room with desks facing a blank screen, airfield visible through the windows'),
 ('tower', 'Tower view', 'a control tower against a dramatic dusk sky, airfield below'),
 ('terminal', 'Terminal / FBO', 'a small terminal or FBO at golden hour with the apron and parked light aircraft, warm windows'),
 ('night', 'Night operations', 'a runway and taxiway at night from low altitude, blue taxiway edge lights, white runway edge lights, stars above'),
]
ICONS = [
 ('path', 'PATH', 'a straight road or runway receding to a vanishing point with a dashed centerline'),
 ('lounge', 'LOUNGE', 'a simple house with a door'),
 ('class', 'CLASS', 'a document page with text lines (lines only, no letters)'),
 ('hangar', 'HANGAR', 'an open-end wrench, diagonal'),
 ('flightbag', 'FLIGHT BAG', 'a handled bag with a small wing emblem'),
 ('map', 'MAP', 'a folded tri-panel map'),
 ('tower', 'TOWER', 'a control tower with a cab'),
 ('crewboard', 'CREW BOARD', 'three people, head and shoulders, overlapping'),
 ('profile', 'PROFILE', 'one person, head and shoulders'),
 ('achievements', 'ACHIEVEMENTS', 'a two-handled trophy cup'),
 ('settings', 'SETTINGS', 'a gear'),
]
BADGES = [
 ('firstflight', 'FIRST FLIGHT', 'gold wings, gold disc, gold star at the center'),
 ('navigation', 'NAVIGATION', 'gold wings, cream disc with a gold compass rose'),
 ('weather', 'WEATHER', 'silver wings, gold disc with a small star over a stylized cloud'),
 ('radio', 'RADIO', 'gold wings, navy disc with a gold star'),
 ('flightplanning', 'FLIGHT PLANNING', 'gold wings, red disc with a white star'),
 ('explorer', 'EXPLORER', 'gold wings, royal-blue disc with a white star'),
 ('history', 'HISTORY', 'gold wings, forest-green disc with a gold star and small laurel'),
 ('maintenance', 'MAINTENANCE', 'gold wings, gold disc with crossed wrenches'),
 ('jetops', 'JET OPERATIONS', 'gold wings, navy disc with a gold swept-wing jet silhouette'),
 ('mastercadet', 'MASTER CADET', 'gold wings, blue and gold disc with a white star and two short gold ribbons'),
]

# ------------------------------------------------------------------------------------------------ build
story = []
A = story.append

A(Paragraph('Art generation brief', H1))
A(Paragraph('<b>What this is.</b> The HypeTeen Flight Academy app (the companion to the seven-book series, for cadets aged 10 to 14) ships today with concept paintings enlarged 3 to 4 times behind a vector interface. This brief lists every raster asset that should be generated at production resolution so it drops into the app with no code change. The look is already set by the publisher\'s concept board and the book covers; your job is to produce the same world at full size and sharpness, following the exact dimensions here.', P))
A(Paragraph('<b>How to read it.</b> Section 1 fixes the visual identity and the rules that apply to every image. Sections 2 to 4 are the three batches, in priority order, one row per asset with its file name, exact pixel size, transparency and content. Section 5 says how to return the work and how it will be checked. Produce Batch 1 first; it can be reviewed before Batches 2 and 3 start.', P))

A(Paragraph('Deliverables at a glance', H2))
A(table([
  [b_('Batch'), b_('Assets'), b_('Count'), b_('Transparency'), b_('Why first')],
  [c_('1. Screens and room walls'), c_('title painting, hero painting, 9 room back walls and skies'), c_('11'), c_('none (opaque)'), c_('the largest surfaces in the app; everything else sits on them')],
  [c_('2. Navigation discs and badges'), c_('11 round navigation discs, 10 winged achievement badges'), c_('21'), c_('yes (PNG alpha)'), c_('redraws of the board\'s own designs at resolution; seen on every screen')],
  [c_('3. Hub scene tiles and floors'), c_('7 scene tiles for the Academy Hub, 7 floor textures'), c_('14'), c_('none'), c_('polish; the current tiles and code-drawn floors are acceptable until these arrive')],
  [b_('Total'), c_(''), b_('46'), c_(''), c_('')],
 ], [1.55 * inch, 2.5 * inch, 0.55 * inch, 0.95 * inch, CW - 5.55 * inch]))
A(Spacer(1, 6))
A(Paragraph('<b>Return format in one line:</b> one PDF, one asset per page, each page headed by the exact file name and carrying the image at its full pixel size without recompression, plus (preferred) a ZIP of the same PNG files. Details in Section 5.', P))

A(Paragraph('Where the assets appear', H2))
if os.path.exists(SCREENS):
    im = Image.open(SCREENS); iw, ih = im.size
    A(KeepTogether([pic(SCREENS, CW * 0.9, CW * 0.9 * ih / iw, maxpx=2000), Spacer(1, 3), Paragraph('The app as it stands (phone screens, left to right: welcome, title, airfield rooms, Hub, Library, Explorer, Record). The soft backdrops in the rooms and the title painting are the enlarged concepts that Batch 1 replaces; the round gold discs and the winged badges are the designs Batch 2 redraws.', SM)]))
A(PageBreak())

# ---- 1. identity and rules
A(Paragraph('1. Visual identity', H1))
A(Paragraph('The series is cinematic and sincere: real airfields at golden hour and dusk, deep navy skies, brass and gold hardware, cream light. Painterly hyper-realism (a polished digital painting, not a photo and not a cartoon), the same hand across every asset. The reference is the publisher\'s concept board and Book One\'s cover, shown here.', P))
refs = []
lp = os.path.join(BOARD, 'landing_screen.png'); cv = os.path.join(WEB, 'assets', 'series', 'htfa-book1-cover.webp'); pl = os.path.join(BOARD, 'pilots_lounge.png'); hg = os.path.join(BOARD, 'hangar.png')
cells = []
if os.path.exists(lp): cells.append([pic(lp, 1.55 * inch, crop=(0, 0, 307, 383)), Paragraph('Title concept: the composition to reproduce at full resolution (Batch 1, screen-title)', SM)])
if os.path.exists(cv): cells.append([pic(cv, 1.55 * inch), Paragraph('Book One cover: palette, lighting and finish of the series', SM)])
if os.path.exists(pl): cells.append([pic(pl, 1.55 * inch, crop=(0, 150, 390, 410)), Paragraph('Lounge concept: interior warmth, windows onto the apron', SM)])
if os.path.exists(hg): cells.append([pic(hg, 1.55 * inch, crop=(0, 58, 196, 330)), Paragraph('Hangar concept: steel, light, open door', SM)])
if cells:
    row1 = [c[0] for c in cells]; row2 = [c[1] for c in cells]
    t = Table([row1, row2], colWidths=[CW / len(cells)] * len(cells)); t.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP'), ('ALIGN', (0, 0), (-1, -1), 'CENTER'), ('LEFTPADDING', (0, 0), (-1, -1), 3), ('RIGHTPADDING', (0, 0), (-1, -1), 3)]))
    A(t)
A(Paragraph('Palette (use these as the anchors; natural scene colors around them)', H3))
A(Swatches([('#10263D', 'Navy', 'skies, interface'), ('#183B5A', 'Airfield blue', 'shadows, glass'), ('#B88C35', 'Brass', 'hardware, rims'), ('#E9C77A', 'Title gold', 'highlights, glyphs'),
            ('#F2E7CB', 'Cream', 'light, walls'), ('#657889', 'Slate', 'concrete, cloud'), ('#E8803A', 'Sunset', 'horizon glow'), ('#5A8A44', 'Field green', 'grass')], CW))
A(Spacer(1, 10))
A(Paragraph('Lighting and camera', H3))
A(Paragraph('Golden hour or dusk for every outdoor view, the sun low and to one side; interiors lit warm from windows or work lights with cool navy shadows. Room walls are flat elevations seen straight on (verticals stay vertical, no wide-angle distortion), eye level about 65% down the plate; the app adds the floor in perspective below them. Everything stays legible when reduced to a phone screen: large shapes, clean value separation, no fine clutter.', P))
A(KeepTogether([Paragraph('Rules that apply to every image', H3)] + bullets([
 '<b>No text, letters, numerals, logos or wordmarks anywhere</b>: no signs, no posters with words, no aircraft registrations, no runway numbers, no gauge numerals, no watermarks or signatures. Labels are typeset by the app. (Decorative text in the concept board is baked into the concept only; do not reproduce it.)',
 '<b>No real brands or liveries</b>: no airline colors, manufacturer badges, flags as a focal element, or product logos.',
 '<b>No people as subjects</b> except where the brief says so (the title painting\'s cadet, seen from behind, face hidden). No children\'s faces, no book characters, no celebrities.',
 '<b>Aviation plausibility</b>: aircraft appear only as distant or silhouetted shapes with correct general proportions (a high-wing or low-wing single-engine trainer); no instrument panels, no cockpit detail, no airport signs, markings or lights drawn as instruction. The app draws FAA-standard signs, markings and lights itself.',
 '<b>Kid-appropriate</b>: no weapons, military insignia, crashes, smoke or storms as drama; weather is fair or softly dramatic sky.',
 '<b>Exact pixel sizes</b> as listed, sRGB, 8-bit PNG (24-bit opaque, 32-bit where transparency is required). Do not add borders, rounded corners, vignettes to black, frames or drop shadows; the app does its own cropping and shading.',
 '<b>Edges</b>: wall plates and skies must hold the full width with content to the very edge (no fading to a color), because the app crops them to fit different phones around the center.',
 '<b>Consistency</b>: one rendering style, one palette, one time of day per room family (lounge, classroom, hangar, wash and platform in late afternoon; tower, game room and night tile at dusk or night; runway and ramp at golden hour).',
])))
A(PageBreak())

# ---- 2. batch 1
A(Paragraph('2. Batch 1: screens and room walls (11 assets, opaque PNG)', H1))
A(Paragraph('2.1 Title and hero paintings', H2))
A(table([
  [b_('File name'), b_('Pixels (W x H)'), b_('Content')],
  [m_('screen-title.png'), c_('1600 x 2000 (4:5 portrait)'),
   c_('The title concept reproduced at full resolution with the same composition: a cadet aged about 12 seen from behind (dark hooded jacket, black backpack with a small gold wing patch, no face visible) standing on an apron, looking toward a GA airfield at golden hour: a high-wing single to the left, a control tower and hangars to the right, mountains far off, a sky of warm cloud against deep blue. <b>Leave the top 30% as sky only</b> (the app typesets the name there) and <b>the bottom 25% calm and darkening toward navy</b> (buttons sit over it). No text, no wing emblem in the sky.')],
  [m_('screen-hero.png'), c_('2400 x 900 (8:3 landscape)'),
   c_('The same scene as a wide landscape band for tablets and desktops: the cadet small and off-center at the lower left third, the airfield and tower across the right, horizon at about 60% down. Keep the middle 60% of the width self-contained (phones crop to it).')],
 ], [1.35 * inch, 1.45 * inch, CW - 2.8 * inch]))
A(Spacer(1, 6))
A(Paragraph('2.2 Room back walls and skies (9 assets)', H2))
A(Paragraph('Each room in the walkable airfield has one back-wall plate; outdoor rooms have a sky-and-horizon plate instead. The plate\'s bottom edge is the floor line; the app draws the floor, props, crew and the hatched wall objects over it. Dimensions are exact (6 px per world unit). Hatched zones in the diagrams mark where the app paints its own doors, boards and consoles; keep the painting calm behind them (plain wall, soft shapes) so the two layers do not fight.', P))
for key, scene, wu, hu, zones, left, markers, brief in WALLS:
    px = WALL_PX[key]
    block = [Paragraph('<font color="#10263D"><b>wall-%s.png</b></font> &nbsp; %s &nbsp;|&nbsp; <b>%d x %d px</b> (%d x %d world units%s)' % (key, scene, px[0], px[1], wu, hu, ', outdoor: includes a 200-unit run past the left edge' if left else ''), H3),
             Slot(wu, hu, zones, CW, eye=0.35 if not left else None, note_left=left, markers=markers),
             Paragraph(brief, SMI), Spacer(1, 5)]
    A(KeepTogether(block))
A(PageBreak())

# ---- 3. batch 2
A(Paragraph('3. Batch 2: navigation discs and badges (21 assets, transparent PNG)', H1))
A(Paragraph('These are redraws of the publisher\'s own designs at production resolution, not new designs. Match each reference tile: the same glyph, the same colors, the same bevel. The app adds shadows, glow and locked states itself, so deliver each piece clean on a transparent background with nothing outside its silhouette.', P))
A(Paragraph('3.1 Navigation discs (11)', H2))
ni = os.path.join(BOARD, 'navigation_icons.png')
if os.path.exists(ni): A(pic(ni, CW, crop=(0, 22, 809, 100)))
A(Paragraph('Reference strip (the labels are typeset by the app; do not include them). Each disc: a navy (#10263D to #183B5A) radial-gradient face, a bevelled brass-to-gold rim about 7% of the diameter wide with a bright highlight at the top left, and a flat gold (#E9C77A to #B88C35) glyph centered at about 55% of the diameter.', SM))
A(Spacer(1, 4))
A(table([[b_('File name'), b_('Pixels'), b_('Glyph')]] + [[m_('icon-%s.png' % k), c_('1024 x 1024, disc diameter 940 centered, transparent outside'), c_('%s: %s' % (n, g))] for k, n, g in ICONS],
        [1.75 * inch, 2.1 * inch, CW - 3.85 * inch]))
A(Spacer(1, 8))
ab = os.path.join(BOARD, 'achievement_badges.png')
A(KeepTogether([Paragraph('3.2 Winged achievement badges (10)', H2)] + ([pic(ab, CW * 0.62, crop=(0, 18, 401, 136))] if os.path.exists(ab) else []) + [Paragraph('Reference strip. Each badge: spread metallic wings (gold unless noted), a central disc with its emblem, a small banner shape below the disc <b>with no lettering</b> (the app typesets the name). Deliver each badge upright, wings spanning about 96% of the canvas width, everything else transparent.', SM)]))
A(Spacer(1, 4))
A(table([[b_('File name'), b_('Pixels'), b_('Design (match the reference tile)')]] + [[m_('badge-%s.png' % k), c_('1024 x 1024, transparent'), c_('%s: %s' % (n, g))] for k, n, g in BADGES],
        [1.9 * inch, 1.5 * inch, CW - 3.4 * inch]))
A(PageBreak())

# ---- 4. batch 3
A(Paragraph('4. Batch 3: Hub scene tiles and floors (14 assets, opaque PNG)', H1))
A(Paragraph('4.1 Academy Hub scene tiles (7)', H2))
es = os.path.join(BOARD, 'environment_scenes.png')
if os.path.exists(es): A(pic(es, CW, crop=(0, 0, 867, 122)))
A(Paragraph('Reference strip (labels are typeset by the app). Each tile is a small painting shown behind a card title, cropped to the center at various aspects, so keep the subject in the middle 70% and the lower 30% a little darker so white text reads over it.', SM))
A(Spacer(1, 4))
A(table([[b_('File name'), b_('Pixels'), b_('Scene')]] + [[m_('tile-%s.png' % k), c_('1280 x 960 (4:3)'), c_('%s: %s' % (n, g))] for k, n, g in TILES], [1.5 * inch, 1.1 * inch, CW - 2.6 * inch]))
A(Spacer(1, 8))
A(Paragraph('4.2 Floor textures (7)', H2))
A(Paragraph('Top-down, flat, even lighting, texture only: no objects, no shadows of furniture, no markings. The app lays each one into the room in perspective, so a texture that is slightly directional (planks, boards) should run as stated. Edge to edge; seamless tiling is not required. Sizes are 4 px per world unit. The two outdoor floors (parking stand and runway) are not requested: their FAA markings and lights are drawn by code and must stay exact.', P))
A(table([[b_('File name'), b_('Pixels (W x H)'), b_('Texture')]] + [[m_('floor-%s.png' % k), c_('%d x %d' % (w * 4, h * 4)), c_(t)] for k, w, h, t in FLOORS], [1.5 * inch, 1.2 * inch, CW - 2.7 * inch]))
A(PageBreak())

# ---- 5. return and acceptance
A(Paragraph('5. Returning the work', H1))
A(Paragraph('5.1 Format', H2))
A(KeepTogether(bullets([
 '<b>One PDF</b>, one asset per page. Page size equal to the image size (or the image placed at 100% with a white margin). The page header carries the <b>exact file name</b> from this brief, the pixel size and the batch number.',
 'Images embedded <b>losslessly at full resolution</b> (PNG passthrough or Flate). No JPEG recompression, no downsampling, no color-profile conversion away from sRGB. Transparent assets must keep their alpha channel in the PDF page; if the PDF tool flattens alpha, say so on the page and rely on the ZIP.',
 '<b>Preferred in addition</b>: a ZIP of the same PNG files with the exact file names. When both are supplied, the ZIP is the one that gets integrated.',
 'A first page listing what is included, anything not produced and why, and any deviation from a listed size.',
 'No author or illustrator name, signature or watermark on any image or page; the app and its documents carry no personal names by policy.',
])))
A(Paragraph('5.2 Acceptance checks run on receipt', H2))
A(table([
  [b_('Check'), b_('Pass condition')],
  [c_('Pixel size'), c_('Exactly as listed (a 1% tolerance only if the aspect is preserved; the app crops around the center).')],
  [c_('Text and marks'), c_('No letters, numerals, logos, registrations, signatures or watermarks found at 100% zoom.')],
  [c_('Transparency'), c_('Batch 2 assets have a clean alpha edge with no halo or background color; Batch 1 and 3 assets are fully opaque.')],
  [c_('Edges'), c_('Wall and sky plates carry content to all four edges; no vignette, border or fade.')],
  [c_('Quiet zones'), c_('Hatched zones in Section 2 hold no focal object that would collide with the app\'s own door, board or console.')],
  [c_('Palette and light'), c_('Golden hour or dusk as specified; navy, brass, gold and cream anchors present; one consistent painting style across the batch.')],
  [c_('Aviation'), c_('Aircraft only as plausible distant shapes; no cockpit, instrument, sign, marking or light drawn in a way a lesson could mistake for instruction.')],
  [c_('Content'), c_('Age-appropriate for 10 to 14; no faces of children; nothing from the novels\' cast.')],
 ], [1.4 * inch, CW - 1.4 * inch]))
A(Spacer(1, 8))
A(Paragraph('5.3 Complete file list (46)', H2))
names = ['screen-title.png', 'screen-hero.png'] + ['wall-%s.png' % w[0] for w in WALLS] + ['icon-%s.png' % i[0] for i in ICONS] + ['badge-%s.png' % b[0] for b in BADGES] + ['tile-%s.png' % t[0] for t in TILES] + ['floor-%s.png' % f[0] for f in FLOORS]
sizes = {'screen-title.png': '1600x2000', 'screen-hero.png': '2400x900'}
for w in WALLS: sizes['wall-%s.png' % w[0]] = '%dx%d' % WALL_PX[w[0]]
for i in ICONS: sizes['icon-%s.png' % i[0]] = '1024x1024 alpha'
for b in BADGES: sizes['badge-%s.png' % b[0]] = '1024x1024 alpha'
for t in TILES: sizes['tile-%s.png' % t[0]] = '1280x960'
for f in FLOORS: sizes['floor-%s.png' % f[0]] = '%dx%d' % (f[1] * 4, f[2] * 4)
cols = 3; per = (len(names) + cols - 1) // cols
grid = []
for r in range(per):
    row = []
    for ccol in range(cols):
        i = ccol * per + r
        row.append(Paragraph('<font face="Courier-Bold" color="#10263D">%s</font> <font color="#657889">%s</font>' % (names[i], sizes[names[i]]), ps('fl', fontSize=7.6, leading=10)) if i < len(names) else '')
    grid.append(row)
t = Table(grid, colWidths=[CW / cols] * cols); t.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LEFTPADDING', (0, 0), (-1, -1), 2), ('RIGHTPADDING', (0, 0), (-1, -1), 2), ('TOPPADDING', (0, 0), (-1, -1), 1), ('BOTTOMPADDING', (0, 0), (-1, -1), 1)]))
A(t)

doc = SimpleDocTemplate(OUT, pagesize=letter, leftMargin=M, rightMargin=M, topMargin=0.95 * inch, bottomMargin=0.75 * inch,
                        title='HypeTeen Flight Academy: art generation brief', author='Hype Learning Academies', subject='Production artwork specification for the HTFA app')
doc.build(story, onFirstPage=hdr, onLaterPages=hdr)
print('wrote', OUT, os.path.getsize(OUT) // 1024, 'KB')
