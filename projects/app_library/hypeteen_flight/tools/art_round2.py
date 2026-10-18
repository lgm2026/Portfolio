#!/usr/bin/env python3
"""Builds docs/ART_ROUND2_CORRECTIONS.pdf: the short follow-up request to the illustrator after the first delivery.
   Reads the illustrator's asset_manifest.json (which files were exported from previews) and the integration log.
   Run: python3 -I tools/art_round2.py --delivery <dir>"""
import os, sys, json
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
args = sys.argv[1:]; DELIV = args[args.index('--delivery') + 1]
OUT = os.path.join(ROOT, 'docs', 'ART_ROUND2_CORRECTIONS.pdf')
their = {r['asset'].replace('.png', ''): r for r in json.load(open(os.path.join(DELIV, 'asset_manifest.json')))['records']}
soft = sorted(k for k, r in their.items() if r.get('upscaled'))

NAVY = colors.HexColor('#10263D'); BRASS = colors.HexColor('#B88C35'); CREAM = colors.HexColor('#F2E7CB'); GOLD = colors.HexColor('#E9C77A')
SLATE = colors.HexColor('#657889'); INK = colors.HexColor('#1B2430'); PALE = colors.HexColor('#F7F2E6'); LINE = colors.HexColor('#D8CDB4')
PW, PH = letter; M = 0.7 * inch; CW = PW - 2 * M
def ps(n, **kw):
    b = dict(fontName='Helvetica', fontSize=9.8, leading=13.4, textColor=INK); b.update(kw); return ParagraphStyle(n, **b)
H1 = ps('h1', fontName='Times-Bold', fontSize=19, leading=23, textColor=NAVY, spaceAfter=6)
H2 = ps('h2', fontName='Times-Bold', fontSize=13.5, leading=17, textColor=NAVY, spaceBefore=9, spaceAfter=3)
P = ps('p', spaceAfter=5); SM = ps('sm', fontSize=8.4, leading=11, textColor=SLATE)
CELL = ps('c', fontSize=8.6, leading=11.2); HD = ps('hd', fontName='Helvetica-Bold', fontSize=8.6, leading=11.2, textColor=CREAM)
MONO = ps('m', fontName='Courier-Bold', fontSize=8.4, leading=11, textColor=NAVY)
BUL = ps('b', leftIndent=12, bulletIndent=2, spaceAfter=3)

def hdr(c, d):
    c.saveState(); c.setFillColor(NAVY); c.rect(0, PH - 0.6 * inch, PW, 0.6 * inch, fill=1, stroke=0); c.setFillColor(BRASS); c.rect(0, PH - 0.6 * inch - 2, PW, 2, fill=1, stroke=0)
    c.setFillColor(GOLD); c.setFont('Times-Bold', 13); c.drawString(M, PH - 0.39 * inch, 'HypeTeen Flight Academy')
    c.setFillColor(CREAM); c.setFont('Helvetica', 8.2); c.drawRightString(PW - M, PH - 0.39 * inch, 'Art brief, round 2: corrections after the first delivery  |  2026-10-17  |  v1.1')
    c.setFillColor(SLATE); c.setFont('Helvetica', 7.6); c.drawString(M, 0.42 * inch, 'Hype Learning Academies. Companion to docs/ART_GENERATION_BRIEF.pdf (v1.0); every rule and size in that brief still applies.'); c.drawRightString(PW - M, 0.42 * inch, 'page %d' % d.page); c.restoreState()

def table(rows, widths):
    rows = [[Paragraph(x, HD) for x in rows[0]]] + rows[1:]
    t = Table(rows, colWidths=widths, repeatRows=1)
    st = [('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LINEBELOW', (0, 0), (-1, -1), 0.35, LINE), ('BACKGROUND', (0, 0), (-1, 0), NAVY),
          ('LEFTPADDING', (0, 0), (-1, -1), 4), ('RIGHTPADDING', (0, 0), (-1, -1), 4), ('TOPPADDING', (0, 0), (-1, -1), 3), ('BOTTOMPADDING', (0, 0), (-1, -1), 3)]
    for i in range(1, len(rows)):
        if i % 2 == 0: st.append(('BACKGROUND', (0, i), (-1, i), PALE))
    t.setStyle(TableStyle(st)); return t
c_ = lambda s: Paragraph(s, CELL); m_ = lambda s: Paragraph(s, MONO)

S = []; A = S.append
A(Paragraph('Round 2: what to send next', H1))
A(Paragraph('Thank you for the first delivery and the three raw-download ZIPs. 44 of 46 files arrived at the exact sizes asked for, and most are in the app now; five of the extra badge generations in the raw downloads are in it too. This page lists the one systemic fix, the handful of redos, and the rules that were broken. Everything else in the original brief (sizes, palette, no lettering, transparency) is unchanged.', P))

A(Paragraph('1. The systemic fix: export the originals, not the previews', H2))
A(Paragraph('Your manifest records that <b>%d files were exported from 512-px WebP previews and enlarged</b> to the target size. Enlarging does not add detail, so these read soft on a phone. The same generator produced 2048 to 6224 px originals for the other files, so the full-size renders exist: please re-export these %d from the originals (or regenerate them at full size) and resend them at the same file names and pixel sizes. <b>They are not in the three raw-download ZIPs</b>: those hold the originals of the other 22 delivered files and 11 extra generations.' % (len(soft), len(soft)), P))
cols = 3; per = (len(soft) + cols - 1) // cols
grid = [[Paragraph('<font face="Courier-Bold" color="#10263D">%s.png</font>' % soft[cc * per + r], ps('g', fontSize=8.2, leading=10.6)) if cc * per + r < len(soft) else '' for cc in range(cols)] for r in range(per)]
t = Table(grid, colWidths=[CW / cols] * cols); t.setStyle(TableStyle([('LEFTPADDING', (0, 0), (-1, -1), 2), ('TOPPADDING', (0, 0), (-1, -1), 1), ('BOTTOMPADDING', (0, 0), (-1, -1), 1)])); A(t)

A(Paragraph('2. Redos (the delivered file could not be used)', H2))
A(table([
  ['File', 'What was wrong', 'What to deliver'],
  [m_('tile-runway.png'), c_('A 16:9 picture letterboxed inside the 4:3 canvas, with nonsense lettering painted on the runway and a stray aircraft shadow.'), c_('A full-bleed 1280 x 960 runway at sunrise, lights only, no letters or numerals on the surface.')],
  [m_('tile-night.png'), c_('Rendered inside a gold picture frame; invented runway numbers legible at the threshold; the threshold lights were white.'), c_('Full-bleed 1280 x 960, no frame, no numbers; lights in their FAA colours: runway edge white, threshold green, runway end red, taxiway edge blue.')],
  [m_('icon-profile.png'), c_('A portrait of a face with the academy name lettered around the rim.'), c_('A flat gold head-and-shoulders silhouette on the navy disc, like the delivered PATH, LOUNGE, CLASS and CREW BOARD discs. No text.')],
  [m_('badge-firstflight.png'), c_('Not delivered.'), c_('Gold wings, gold disc, gold star; 1024 x 1024, transparent.')],
  [m_('badge-navigation.png'), c_('Not delivered (a version with "AIRFIELD BLUE" lettered on the ring was shared separately).'), c_('The same compass-rose badge with a plain blue ring and no lettering.')],
 ], [1.7 * inch, 2.6 * inch, CW - 4.3 * inch]))

A(KeepTogether([Paragraph('3. Fixed here; please do not repeat', H2)] + [Paragraph(x, BUL, bulletText='\u2022') for x in [
  '<b>Objects in the hatched zones.</b> The lounge wall had a painted door, cork board and trophy case, and the classroom wall a bookshelf, projection screen and cork board, each a little off the app\'s own door, boards and shelf, so both showed side by side; the game-room wall had a door behind the basketball hoop. All were painted out. Keep the hatched zones of every wall plain (wall, window or sky only).',
  '<b>Lettering.</b> A misspelled brand on the game-room arcade machine (cloned out); the academy name lettered on four discs and emblems in the raw downloads (not used). No words, letters or numerals anywhere; leave signs blank.',
  '<b>Military insignia on civil aircraft.</b> The trainer parked at the FBO and the aircraft on the dusk apron both wore the star-and-bar roundel. Civil trainers carry no national insignia; leave fuselages plain.',
  '<b>Impossible aircraft.</b> The FBO trainer had a tail wheel as well as its nose wheel (a tricycle trainer has a nose wheel only); a badge showed a propeller in the middle of a fuselage behind a canard; the framed print in the game room showed an aircraft with no wing. Check wings, struts, gear, propeller and tail against a real type.',
  '<b>Floors.</b> The game-room carpet carried a busy white cross-hatch and the wash-pad concrete large white blotches that repeated halfway across; both were calmed here. Floors are texture only: even, quiet, no pattern that reads as marks.',
  '<b>Transparency and discs.</b> Discs and badges arrived on black or a baked checkerboard (keyed here), and six navigation glyphs came without their disc (set on it here). Deliver 32-bit PNGs, complete discs.',
  '<b>Padding.</b> The title painting was padded with flat navy to reach 1600 x 2000. Paint to the full canvas; the bottom quarter calm and darkening.',
 ]]))

A(Paragraph('4. Return format (unchanged)', H2))
A(Paragraph('A ZIP of PNGs with the exact file names, sRGB, 8-bit, 32-bit where transparency is required, no watermark or signature. A PDF is welcome as a contact sheet but the ZIP is what gets integrated.', P))
doc = SimpleDocTemplate(OUT, pagesize=letter, leftMargin=M, rightMargin=M, topMargin=0.9 * inch, bottomMargin=0.72 * inch, title='HypeTeen Flight Academy: art brief, round 2', author='Hype Learning Academies')
doc.build(S, onFirstPage=hdr, onLaterPages=hdr); print('wrote', OUT, os.path.getsize(OUT) // 1024, 'KB')
