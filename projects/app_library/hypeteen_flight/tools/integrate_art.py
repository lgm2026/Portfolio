#!/usr/bin/env python3
"""Integrates an illustrator's delivery (the 46-asset brief, docs/ART_GENERATION_BRIEF.pdf) into web/assets/art/.
   Every repair here is mechanical and recorded: backgrounds keyed to alpha, bare glyphs set on the disc the brief asked
   for, a misspelled sign cloned out of a wall, a tail inpainted out of a sky, a padded title blended, two missing badges
   derived from delivered ones. Rejected files are left alone (the app keeps its previous art for those slots).
   --openart <dir>: the illustrator's raw generator downloads (three ZIPs, extracted into one folder tree); the clean,
   letter-free originals among them become extra badge arts and the runway horizon plate.
   Run: python3 -I tools/integrate_art.py --delivery <dir with assets/*.png> [--extra <dir>] [--out web/assets/art]"""
import os, sys, json
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi

args = sys.argv[1:]
def opt(n, d=None):
    return args[args.index(n) + 1] if n in args else d
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
DELIV = opt('--delivery'); EXTRA = opt('--extra', DELIV); OPENART = opt('--openart')
OUT = opt('--out', os.path.join(ROOT, 'web', 'assets', 'art'))
A = os.path.join(DELIV, 'assets')
os.makedirs(os.path.join(OUT, 'icons'), exist_ok=True); os.makedirs(os.path.join(OUT, 'badges'), exist_ok=True); os.makedirs(os.path.join(OUT, 'floors'), exist_ok=True)
LOG = []
def log(k, action, note=''):
    LOG[:] = [l for l in LOG if l['asset'] != k]          # a later decision about the same asset supersedes the earlier one
    LOG.append({'asset': k, 'action': action, 'note': note}); print('%-26s %-8s %s' % (k, action, note))

def load(name, where=A):
    return Image.open(os.path.join(where, name)).convert('RGBA')

def save(im, rel, q=82, lossless=False):
    p = os.path.join(OUT, rel)
    if lossless: im.save(p, 'WEBP', lossless=True, quality=100, method=6)
    else: im.save(p, 'WEBP', quality=q, method=6)
    return os.path.getsize(p)

# ------------------------------------------------------------------ keying helpers
def border_components(cand):
    lab, n = ndi.label(cand)
    if n == 0: return np.zeros_like(cand)
    edge = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    edge = edge[edge != 0]
    return np.isin(lab, edge)

def key_colors(im, keys, lo=18, hi=58, feather=1.0):
    """Alpha from the distance to the nearest key color, restricted to background connected to the border.
       Colors are un-fringed (the source was composited on the key) so no dark halo remains."""
    a = np.asarray(im).astype(np.float32); rgb = a[..., :3]
    d = np.full(rgb.shape[:2], 1e9, np.float32)
    for k in keys: d = np.minimum(d, np.sqrt(((rgb - np.array(k, np.float32)) ** 2).sum(-1)))
    cand = d < hi
    bg = border_components(cand)
    alpha = np.ones_like(d)
    alpha[bg] = np.clip((d[bg] - lo) / (hi - lo), 0, 1)
    if feather: alpha = ndi.gaussian_filter(alpha, feather)
    key = np.array(keys[0], np.float32)
    al = alpha[..., None]
    rgb_un = np.where(al > 0.02, np.clip((rgb - key * (1 - al)) / np.maximum(al, 1e-3), 0, 255), rgb)
    out = np.dstack([rgb_un, alpha * 255]).astype(np.uint8)
    return Image.fromarray(out, 'RGBA')

def sample_keys(im, n=2):
    """The background colors of a delivered PNG: the most common quantized colors along its border (one for a plain
       background, two for a baked checkerboard)."""
    a = np.asarray(im)[..., :3]
    border = np.concatenate([a[:6].reshape(-1, 3), a[-6:].reshape(-1, 3), a[:, :6].reshape(-1, 3), a[:, -6:].reshape(-1, 3)])
    q = (border // 8) * 8 + 4
    vals, counts = np.unique(q, axis=0, return_counts=True)
    order = np.argsort(-counts)
    keys = [tuple(int(x) for x in vals[order[0]])]
    for i in order[1:]:
        c = tuple(int(x) for x in vals[i])
        if counts[i] > border.shape[0] * 0.08 and np.abs(np.array(c) - np.array(keys[0])).max() > 24: keys.append(c)
        if len(keys) >= n: break
    return keys

def key_neutral(im, s_lo=0.12, s_hi=0.30, v_lo=40):
    """Alpha for a saturated (gold) glyph on a neutral background: HSV saturation drives alpha, holes (speculars) are
       filled, and only regions touching the border are treated as background."""
    rgb = np.asarray(im.convert('RGB')).astype(np.float32) / 255
    mx = rgb.max(-1); mn = rgb.min(-1); sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0); val = mx * 255
    fg = np.clip((sat - s_lo) / (s_hi - s_lo), 0, 1) * np.clip((val - v_lo) / 30, 0, 1)
    solid = ndi.binary_fill_holes(fg > 0.5)
    solid = ndi.binary_opening(solid, iterations=2)
    bg = border_components(~solid)
    alpha = np.where(bg, np.clip((fg - 0.15) / 0.85, 0, 1), 1.0)       # faint tint in a vignetted background is not glyph
    alpha = ndi.gaussian_filter(alpha, 0.8)
    out = np.dstack([(rgb * 255), alpha * 255]).astype(np.uint8)
    return Image.fromarray(out, 'RGBA')

def bbox_alpha(im, thr=100):
    a = np.asarray(im)[..., 3]; ys, xs = np.where(a > thr)
    return xs.min(), ys.min(), xs.max() + 1, ys.max() + 1

def fit_square(im, size, span):
    """Place a transparent sprite in a size×size canvas so its width is `span` px (height-limited if taller)."""
    x0, y0, x1, y1 = bbox_alpha(im); sp = im.crop((x0, y0, x1, y1))
    k = min(span / sp.width, span / sp.height); sp = sp.resize((max(1, round(sp.width * k)), max(1, round(sp.height * k))), Image.LANCZOS)
    out = Image.new('RGBA', (size, size), (0, 0, 0, 0)); out.alpha_composite(sp, ((size - sp.width) // 2, (size - sp.height) // 2)); return out

def disc_geometry(im):
    """Center and radius of the gold-rimmed disc in a delivered icon (the largest non-background blob)."""
    rgb = np.asarray(im.convert('RGB')).astype(np.float32)
    d = np.sqrt(((rgb - rgb[0, 0]) ** 2).sum(-1))
    m = ndi.binary_fill_holes(d > 40); m = ndi.binary_opening(m, iterations=3)
    ys, xs = np.where(m)
    cx, cy = (xs.min() + xs.max()) / 2, (ys.min() + ys.max()) / 2; r = max(xs.max() - xs.min(), ys.max() - ys.min()) / 2
    return cx, cy, r

def circle_alpha(im, cx, cy, r, feather=1.2):
    h, w = im.size[1], im.size[0]; yy, xx = np.mgrid[0:h, 0:w]
    dist = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
    alpha = np.clip((r - dist) / feather + 0.5, 0, 1)
    a = np.asarray(im).copy(); a[..., 3] = (alpha * 255).astype(np.uint8); return Image.fromarray(a, 'RGBA')

def disc_base(ref, size):
    """A clean navy disc with the delivered gold rim: the rim ring is copied from `ref`, the face is rebuilt from the
       ring of clean face just inside it (sampled by angle, so the gloss keeps its direction)."""
    cx, cy, r = disc_geometry(ref)
    rgb = np.asarray(ref.convert('RGB')).astype(np.float32)
    h, w = rgb.shape[:2]; yy, xx = np.mgrid[0:h, 0:w]
    dist = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2); ang = np.arctan2(yy - cy, xx - cx)
    face = np.zeros_like(rgb)
    bins = 90; sect = ((ang + np.pi) / (2 * np.pi) * bins).astype(int) % bins
    ring = (dist > 0.62 * r) & (dist < 0.80 * r)
    prof = np.zeros((bins, 3), np.float32)
    for b in range(bins):
        sel = ring & (sect == b); prof[b] = np.median(rgb[sel], axis=0) if sel.any() else prof[b - 1]
    prof = np.concatenate([prof[-4:], prof, prof[:4]]); prof = np.array([np.convolve(prof[:, c], np.ones(9) / 9, 'valid') for c in range(3)]).T
    face = prof[sect]
    radial = 1 - 0.10 * np.clip((dist / r - 0.45) / 0.4, 0, 1) ** 2        # a little darker toward the rim
    radial += 0.06 * np.clip(1 - dist / (0.5 * r), 0, 1)                     # a little brighter at the center
    face = np.clip(face * radial[..., None], 0, 255)
    rimmask = dist >= 0.84 * r
    out = np.where(rimmask[..., None], rgb, face)
    im = Image.fromarray(out.astype(np.uint8), 'RGB').convert('RGBA')
    im = circle_alpha(im, cx, cy, r)
    return im, (cx, cy, r)

def put_glyph(disc, geo, glyph, frac=0.56, shadow=0.45):
    cx, cy, r = [float(v) for v in geo]
    x0, y0, x1, y1 = bbox_alpha(glyph); g = glyph.crop((x0, y0, x1, y1))
    k = (2 * r * frac) / max(g.width, g.height); g = g.resize((max(1, round(g.width * k)), max(1, round(g.height * k))), Image.LANCZOS)
    out = disc.copy()
    if shadow:
        sh = Image.new('RGBA', g.size, (0, 0, 0, 0)); sh.putalpha(g.getchannel('A').point(lambda v: int(v * shadow)))
        sh = sh.filter(ImageFilter.GaussianBlur(float(r) * 0.025))
        out.alpha_composite(sh, (round(cx - g.width / 2), round(cy - g.height / 2 + r * 0.03)))
    out.alpha_composite(g, (round(cx - g.width / 2), round(cy - g.height / 2)))
    return out

# ------------------------------------------------------------------ plate helpers
def grade(im, strength=1.0, bottom=0.14, grain=3.0):
    """The brand grade used on every plate: a touch of contrast, warm highs and cool shadows, a navy settle at the floor
       line, fine grain. Light, because these paintings were made for the slots."""
    a = np.asarray(im.convert('RGB')).astype(np.float32)
    m = a.mean()
    a = (a - m) * (1 + 0.06 * strength) + m
    lum = a.mean(-1, keepdims=True) / 255
    a = a + strength * (lum - 0.5) * np.array([10, 4, -10], np.float32)
    h = a.shape[0]; t = np.linspace(0, 1, h)[:, None, None]
    if bottom > 0:
        fade = np.clip((t - (1 - bottom)) / bottom, 0, 1) ** 1.6 * 0.35 * strength
        navy = np.array([16, 38, 61], np.float32)
        a = a * (1 - fade) + navy * fade
    if grain:
        rng = np.random.default_rng(7); a = a + rng.normal(0, grain, a.shape)
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), 'RGB')

def resize_to(im, w, h):
    return im.convert('RGB').resize((w, h), Image.LANCZOS)


# ------------------------------------------------------------------ retouch helpers (used to take out painted objects the app draws itself)
def row_fill(a, x0, x1, L, R, y0=0, y1=None, span=None, tex=None, feather=4, seed=1):
    """Replaces a[y0:y1, x0:x1] row by row with a straight blend between the mean colour of columns L=(l0,l1) and
       R=(r0,r1) on the same row: plain wall, sky or field continues across, horizontal features (rails, trims, the
       horizon) stay at their height. span=(s0,s1) blends over a wider virtual span (to step over a mullion that is kept).
       tex=(t0,t1): the fine texture (high-pass) of those columns is mirrored across the fill."""
    y1 = a.shape[0] if y1 is None else y1
    Lc = ndi.gaussian_filter1d(a[y0:y1, L[0]:L[1]].mean(1), 1.2, axis=0); Rc = ndi.gaussian_filter1d(a[y0:y1, R[0]:R[1]].mean(1), 1.2, axis=0)
    s0, s1 = span if span else (x0, x1)
    t = ((np.arange(x0, x1) - s0) / max(1, (s1 - s0)))[None, :, None]
    fill = Lc[:, None, :] * (1 - t) + Rc[:, None, :] * t
    if tex:
        src = a[y0:y1, tex[0]:tex[1]]; hp = src - ndi.gaussian_filter(src, (2, 6, 0))
        reps = []; w = x1 - x0; k = 0
        while sum(r.shape[1] for r in reps) < w: reps.append(hp if k % 2 == 0 else hp[:, ::-1]); k += 1
        fill = fill + np.concatenate(reps, axis=1)[:, :w]
    else:
        noise = a[y0:y1, L[0]:L[1]] - ndi.gaussian_filter(a[y0:y1, L[0]:L[1]], (1, 1, 0))
        fill = fill + np.random.default_rng(seed).normal(0, float(noise.std()), fill.shape)
    wgt = np.ones(x1 - x0)
    if feather: e = np.arange(x1 - x0); wgt = np.clip(np.minimum(e + 1, x1 - x0 - e) / feather, 0, 1)
    a[y0:y1, x0:x1] = a[y0:y1, x0:x1] * (1 - wgt[None, :, None]) + fill * wgt[None, :, None]

def seamless_clone(a, mask, dx, dy):
    """Poisson clone: a[y+dy, x+dx] is copied into the mask and the mismatch along the mask's edge is spread smoothly
       across it, so the patch carries the source's texture and the surroundings' colour."""
    from scipy.sparse import coo_matrix
    from scipy.sparse.linalg import spsolve
    ys, xs = np.where(mask); y0, y1, x0, x1 = ys.min() - 2, ys.max() + 3, xs.min() - 2, xs.max() + 3
    sub = a[y0:y1, x0:x1].copy(); m = mask[y0:y1, x0:x1]; src = a[y0 + dy:y1 + dy, x0 + dx:x1 + dx]
    diff = sub - src; h, w = m.shape; idx = -np.ones((h, w), int); unk = np.argwhere(m); idx[m] = np.arange(len(unk))
    rows, cols, vals = [], [], []; B = np.zeros((len(unk), 3))
    for k, (i, j) in enumerate(unk):
        rows.append(k); cols.append(k); vals.append(4.0)
        for di, dj in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ii, jj = i + di, j + dj
            if m[ii, jj]: rows.append(k); cols.append(idx[ii, jj]); vals.append(-1.0)
            else: B[k] += diff[ii, jj]
    A = coo_matrix((vals, (rows, cols)), shape=(len(unk), len(unk))).tocsr()
    sol = spsolve(A, B); out = sub.copy(); out[m] = src[m] + sol; a[y0:y1, x0:x1] = out

def ellipse_mask(shape, cx, cy, rx, ry):
    yy, xx = np.mgrid[0:shape[0], 0:shape[1]]; return ((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2 <= 1

def line_mask(shape, p0, p1, r):
    yy, xx = np.mgrid[0:shape[0], 0:shape[1]].astype(np.float32); (x0, y0), (x1, y1) = p0, p1
    vx, vy = x1 - x0, y1 - y0; t = np.clip(((xx - x0) * vx + (yy - y0) * vy) / (vx * vx + vy * vy), 0, 1)
    return (xx - (x0 + t * vx)) ** 2 + (yy - (y0 + t * vy)) ** 2 <= r * r

# Painted objects in the delivered walls that the app also draws (its own doors, boards, shelves, cases are code art
# drawn on top, a few world units narrower or offset, so the painted one peeked out beside it). Units: world units on
# the delivered 6-px-per-unit plates. Each: (x0, x1, left sample, right sample, rows, texture sample).
U = 6
RETOUCH = {
 'lounge': [((51, 118.5), (42, 50.5), (119, 124), (0, 586), None, 'the painted door (the app draws its own door here)'),
            ((51, 118.5), (42, 50.5), (119, 124), (586, 720), (36, 50), 'the wainscot under it, continued with its own grain'),
            ((240, 307.5), (228, 239.5), (307.5, 310.5), (0, 578), None, 'the painted cork board (the app draws the crew board and Hangar News)'),
            ((400.5, 481.5), (395, 400.5), (481.5, 488.5), (0, 578), None, 'the painted trophy case (the app draws the logbook case)')],
 'classroom': [((50, 147.5), (44, 49.5), (148, 155), (0, 720), None, 'the painted bookshelf (the app draws the library shelf)'),
               ((176.5, 436.5), (168, 176), (437, 442), (0, 560), None, 'the painted projection screen and cork board (the app draws its board and patch wall)'),
               ((176.5, 343), (168, 176), (344, 352), (560, 720), None, 'the outlets under the screen')],
}
def retouch_wall(k, a):
    notes = []
    for (x0, x1), L, R, (y0, y1), tex, what in RETOUCH.get(k, []):
        P = lambda v: int(round(v * U))
        row_fill(a, P(x0), P(x1), (P(L[0]), P(L[1])), (P(R[0]), P(R[1])), y0, y1, tex=(P(tex[0]), P(tex[1])) if tex else None)
        notes.append(what)
    return notes

# ================================================================== 1. screens
title = load('screen-title.png').convert('RGB')
a = np.asarray(title).astype(np.float32)
# the painting ends at a hard edge on flat navy (the delivery padded the bottom 20%); blend it over 220 px
rows = a.mean(axis=(1, 2)); edge = int(np.argmax(np.abs(np.diff(rows[1200:1900]))) + 1200)
navy = a[-20:].reshape(-1, 3).mean(0)
y0 = edge - 170; y1 = edge + 6
t = np.clip((np.arange(a.shape[0]) - y0) / (y1 - y0), 0, 1) ** 1.6
a = a * (1 - t)[:, None, None] + navy * t[:, None, None]
title = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), 'RGB').resize((1000, 1250), Image.LANCZOS)
title = grade(title, 0.6, bottom=0.0, grain=2.0)
log('screen-title', 'FIXED', 'padded navy bottom blended (edge at row %d); 409x512 source, stored 1000x1250' % edge)
save(title, 'landing.webp', 84)
hero = resize_to(load('screen-hero.png'), 1500, 562); hero = grade(hero, 0.6, bottom=0.0, grain=2.0)
log('screen-hero', 'ACCEPTED', '512x219 source (soft); stored 1500x562'); save(hero, 'hero-strip.webp', 82)

# ================================================================== 2. walls
WALL = {'lounge': (520, 120, 'lounge-wall.webp'), 'classroom': (520, 120, 'classroom-wall.webp'), 'hangar': (560, 130, 'hangar-wall.webp'),
        'platform': (680, 140, 'platform-sky.webp'), 'tower': (520, 150, 'tower-sky.webp'), 'ramp': (840, 110, 'ramp-sky.webp'),
        'wash': (520, 130, 'wash-wall.webp'), 'gameroom': (600, 120, 'gameroom-wall.webp'), 'runway': (840, 110, 'runway-sky.webp')}
SOFT = {'lounge', 'classroom', 'hangar', 'platform', 'tower', 'ramp', 'wash'}
for k in sorted(SOFT):
    wu, hu, fn = WALL[k]; src = load('wall-%s.png' % k).convert('RGB')
    notes = []
    if k in RETOUCH:
        wa = np.asarray(src).astype(np.float32); notes = retouch_wall(k, wa); src = Image.fromarray(np.clip(wa, 0, 255).astype(np.uint8), 'RGB')
    im = resize_to(src, wu * 3, hu * 3)
    sky = k in ('platform', 'ramp', 'runway')
    im = grade(im, 0.8, bottom=0.0 if sky else 0.16)
    if notes: log('wall-' + k, 'FIXED', '512x219 source (soft); painted out, as plain wall continued row by row: ' + '; '.join(notes) + '; stored %dx%d' % (wu * 3, hu * 3))
    else: log('wall-' + k, 'ACCEPTED', '512x219 source (soft), on brief; stored %dx%d' % (wu * 3, hu * 3))
    save(im, fn, 80)

# game room: clone clean panels over the misspelled pinball machine, the armchairs and the dartboard
g = load('wall-gameroom.png').convert('RGB'); ga = np.asarray(g).astype(np.float32)
goldness = (ga[..., 0] * 0.6 + ga[..., 1] * 0.4 - ga[..., 2])            # gold mouldings score
col = goldness[80:640].mean(0); col = ndi.gaussian_filter1d(col, 3)
# stiles: the strongest vertical gold lines, at least 300 px apart, in the clean right half
peaks = [x for x in range(1700, 3600) if col[x] == col[max(0, x - 40):x + 40].max() and col[x] > np.percentile(col, 92)]
stiles = []
for p in peaks:
    if not stiles or p - stiles[-1] > 300: stiles.append(p)
period = int(np.median(np.diff(stiles))) if len(stiles) > 2 else 450
pa = stiles[0]; panel = ga[:, pa:pa + period].copy()                  # one clean panel, stile to stile
new = ga.copy()
x = pa
while x > 0: x -= period
for xs in range(x, ga.shape[1], period):                              # tile it across the whole wall
    s0, s1 = max(0, xs), min(xs + period, ga.shape[1])
    if s1 <= s0: continue
    new[:, s0:s1] = panel[:, s0 - xs:s1 - xs]
gm = Image.fromarray(np.clip(new, 0, 255).astype(np.uint8), 'RGB')
gm = grade(resize_to(gm, 600 * 3, 120 * 3), 0.8, bottom=0.16)
log('wall-gameroom', 'FIXED', 'the whole wall rebuilt from one clean panel of its own (period %d px): the misspelled sign on the arcade machine, the chairs, the dartboard, the door behind the hoops and the corner print (an aircraft with no wing) are gone; the app draws its own door, darts, sign, hoops and score board; 6224-px source, stored 1800x360' % period)
save(gm, 'gameroom-wall.webp', 80)

# runway: a clean sky band with an aircraft tail intruding at the bottom center; continue the gradient over it
r = load('wall-runway.png').convert('RGB'); ra = np.asarray(r).astype(np.float32)
band = ra[540:]; med = np.median(band, axis=1, keepdims=True)            # sky rows are uniform along x; anything else is the aircraft
odd = np.sqrt(((band - med) ** 2).sum(-1)) > 22
odd = ndi.binary_opening(odd, iterations=2)
ys, xs = np.where(odd)
if len(ys):
    x0, x1 = max(0, xs.min() - 80), min(ra.shape[1], xs.max() + 80); ytop = 540 + ys.min() - 24
    ref = ndi.gaussian_filter1d(ra[ytop - 12:ytop - 2].mean(0), 40, axis=0)          # the clean rows just above, smoothed along x
    grad = ndi.gaussian_filter1d((ra[ytop - 2] - ra[ytop - 42]) / 40, 40, axis=0)    # the sky's vertical gradient, smoothed along x
    for y in range(ytop, ra.shape[0]):
        ra[y, x0:x1] = np.clip(ref[x0:x1] + grad[x0:x1] * (y - ytop + 8), 0, 255)
    patch = ra[ytop - 40:, x0:x1]; ra[ytop - 40:, x0:x1] = ndi.gaussian_filter(patch, (5, 14, 0))
    fe = np.clip(np.abs(np.arange(x0, x1) - (x0 + x1) / 2) / ((x1 - x0) / 2), 0, 1) ** 3           # feather the patch sides
    ra[ytop - 40:, x0:x1] = ra[ytop - 40:, x0:x1] * (1 - fe)[None, :, None] + np.asarray(r).astype(np.float32)[ytop - 40:, x0:x1] * fe[None, :, None]
rw = grade(resize_to(Image.fromarray(ra.astype(np.uint8), 'RGB'), 840 * 3, 110 * 3), 0.8, bottom=0.0)
log('wall-runway', 'FIXED', 'aircraft tail inpainted out of the sky band; plain sky (off brief: no horizon features); stored 2520x330')
save(rw, 'runway-sky.webp', 80)

# ================================================================== 3. floors (7; ramp and runway stay code-drawn)
FLOOR = {'lounge': (520, 280), 'gameroom': (600, 300), 'classroom': (520, 280), 'hangar': (560, 290), 'platform': (480, 220), 'tower': (520, 230), 'wash': (520, 270)}
def flat_texture(a, sigma):
    # the texture's fine detail on its own average colour: no blotches, no vignette, no visible repeat
    return a - ndi.gaussian_filter(a, (sigma, sigma, 0)) + a.reshape(-1, 3).mean(0)
def calm_stains(im):
    # the delivered wash pad was big white blotches, repeated halfway across; wet concrete keeps only their fine grain
    a = np.asarray(im.convert('RGB')).astype(np.float32); low = ndi.gaussian_filter(a, (40, 40, 0)); m = low.reshape(-1, 3).mean(0)
    fine = a - ndi.gaussian_filter(a, (3, 3, 0))
    out = (m + (low - m) * 0.18 + fine * 0.45) * 0.93
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), 'RGB')
def calm_lines(im):
    # the delivered carpet carried a busy white cross-hatch over most of its area; its clean bottom band (no lines),
    # flattened and mirrored down the floor, gives the deep navy low-pile carpet the brief asked for
    a = np.asarray(im.convert('RGB')).astype(np.float32); H = a.shape[0]; y0, y1 = int(H * 0.84), int(H * 0.99)
    band = flat_texture(a[y0:y1], 30); med = np.stack([ndi.median_filter(band[..., c], size=7) for c in range(3)], -1)
    hot = (band.mean(-1) - med.mean(-1)) > 12; hot = ndi.binary_dilation(hot, iterations=1)[..., None]   # stray bright flecks
    band = np.where(hot, med, band); reps = []; k = 0
    while sum(r.shape[0] for r in reps) < H: reps.append(band if k % 2 == 0 else band[::-1]); k += 1
    out = np.concatenate(reps, axis=0)[:H]
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), 'RGB')
FLOOR_FIX = {'wash': (calm_stains, 'the large white blotches (they read as stains, and repeated halfway across) reduced to the fine grain of wet concrete'),
             'gameroom': (calm_lines, 'the busy white cross-hatch replaced by the plain carpet weave from its own clean bottom band, mirrored down the floor')}
for k, (w, h) in FLOOR.items():
    src = load('floor-%s.png' % k)
    fx = FLOOR_FIX.get(k)
    if fx: src = fx[0](src)
    im = resize_to(src, w * 2, h * 2)
    im = grade(im, 0.5, bottom=0.0, grain=2.5)
    if fx: log('floor-' + k, 'FIXED', '512x288 source; ' + fx[1] + '; stored %dx%d' % (w * 2, h * 2))
    else: log('floor-' + k, 'ACCEPTED', '512x288 source (texture; fine at this size); stored %dx%d' % (w * 2, h * 2))
    save(im, 'floors/%s.webp' % k, 78)

# ================================================================== 4. hub tiles
TILE = {'hangar': 'env-hangar2.webp', 'lounge': 'env-lounge2.webp', 'classroom': 'env-classroom2.webp', 'tower': 'env-tower.webp', 'terminal': 'env-terminal.webp'}
def fix_terminal(im):
    # The trainer parked at the FBO is a Cessna 172 type but carried (1) the US military star-and-bar roundel on its
    # fuselage and (2) a tail wheel as well as its nose wheel. Coordinates are in the 4704x3528 original.
    a = np.asarray(im.convert('RGB')).astype(np.float32); s = a.shape[1] / 4704.0; S = lambda v: int(round(v * s)); sh = a.shape[:2]
    m = ellipse_mask(sh, 2971 * s, 1987 * s, 31 * s, 62 * s)
    yy, xx = np.mgrid[0:sh[0], 0:sh[1]]
    for (bx0, bx1, by0, by1) in ((2899, 2948, 1961, 2003), (2995, 3040, 1967, 2013)):
        m |= (xx >= S(bx0)) & (xx < S(bx1)) & (yy >= S(by0)) & (yy < S(by1))
    m = ndi.binary_dilation(m, iterations=max(1, S(4)))
    seamless_clone(a, m, S(150), S(13))                                   # the fuselage 150 px aft, along the stripes
    lum = a.mean(-1); belly = np.zeros(sh[1], int)
    for x in range(S(3215), S(3345)):
        col = lum[S(2030):S(2110), x]; dark = np.where(col < 110)[0]; belly[x] = S(2030) + (dark[0] if len(dark) else S(80))
    wheel = line_mask(sh, (3236 * s, 2070 * s), (3298 * s, 2148 * s), 9 * s) | ellipse_mask(sh, 3301 * s, 2161 * s, 28 * s, 35 * s)
    wheel &= yy > belly[None, :] + max(1, S(2))
    wheel = ndi.binary_dilation(wheel, iterations=max(1, S(3))) & (yy > belly[None, :] + max(1, S(2)))
    split = S(2127)
    up = wheel & (yy < split); lo = wheel & (yy >= split)
    if up.any(): seamless_clone(a, up, S(90), 0)                          # the hangar wall to the right
    if lo.any(): seamless_clone(a, lo, -S(90), S(10))                     # the apron to the left, along the yellow line
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), 'RGB')
def fix_classroom_tile(im):
    # a WWII-type fighter with code letters on its fuselage stood outside the left window; the field continues instead
    a = np.asarray(im.convert('RGB')).astype(np.float32); s = a.shape[1] / 1280.0; S = lambda v: int(round(v * s))
    for (x0, x1) in ((84, 218), (233, 334)):                              # the mullion between them stays
        row_fill(a, S(x0), S(x1), (S(76), S(84)), (S(334), S(342)), S(398), S(490), span=(S(80), S(338)), feather=2)
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), 'RGB')
TILE_FIX = {'terminal': (fix_terminal, 'the parked trainer\'s military star-and-bar roundel cloned out along its own stripes, and its extra tail wheel (a 172 has a nose wheel only) removed'),
            'classroom': (fix_classroom_tile, 'a WWII-type fighter with code letters outside the left window removed (the field continues); the biplane outside the right window stays')}
for k, fn in TILE.items():
    src = load('tile-%s.png' % k); fx = TILE_FIX.get(k); orig = ''
    if k == 'terminal' and OPENART:
        import glob as _g
        hits = _g.glob(os.path.join(OPENART, '**', 'openart-1792200623_736a322b*.png'), recursive=True)
        if hits: src = Image.open(hits[0]).convert('RGBA'); orig = ' (fixed on the 4704-px original from the raw downloads)'
    if fx: src = fx[0](src)
    im = grade(resize_to(src, 800, 600), 0.7, bottom=0.22, grain=2.0)
    note = {'hangar': '4704-px source; carries the brand name on the hangar, spelled correctly; aircraft geometry checked (high wing, struts, tricycle gear, two-blade prop)',
            'terminal': '4704-px source; brand name on the FBO, spelled correctly', 'lounge': '512-px source (soft); two biplanes outside, a blank world map',
            'classroom': '512-px source (soft)', 'tower': '512-px source (soft)'}[k]
    if fx: log('tile-' + k, 'FIXED', note + '; ' + fx[1] + orig + '; stored 800x600')
    else: log('tile-' + k, 'ACCEPTED', note + '; stored 800x600')
    save(im, fn, 80)
log('tile-runway', 'REJECTED', 'letterboxed inside a 4:3 canvas; nonsense lettering painted on the runway; the app keeps its previous tile')
log('tile-night', 'REJECTED', 'rendered inside a gold picture frame; nonsense runway numbers legible at the threshold; the app keeps its previous tile')

# ================================================================== 5. navigation discs
ICON = 256; SPAN = 240
disc_icons = ['path', 'lounge', 'class', 'crewboard']
ref = load('icon-lounge.png')
for k in disc_icons:
    im = load('icon-%s.png' % k); cx, cy, rr = disc_geometry(im)
    im = circle_alpha(im, cx, cy, rr * 0.995)
    out = fit_square(im, ICON, SPAN)
    log('icon-' + k, 'ACCEPTED', 'on brief (navy disc, gold glyph); 2048-px source; circular alpha cut; stored 256x256'); save(out, 'icons/%s.webp' % k, 90)
base, geo = disc_base(ref, ICON)
for k in ['hangar', 'flightbag', 'map', 'tower', 'achievements', 'settings']:
    g = key_neutral(load('icon-%s.png' % k))
    out = put_glyph(base, geo, g, frac={'tower': 0.62, 'flightbag': 0.54, 'map': 0.58}.get(k, 0.56))
    out = fit_square(out, ICON, SPAN)
    src = '512-px source' if k in ('flightbag', 'map', 'tower') else '2048-px source'
    log('icon-' + k, 'FIXED', 'delivered as a bare glyph; keyed and set on the brief\'s navy disc (rim copied from the delivered lounge disc); %s; stored 256x256' % src)
    save(out, 'icons/%s.webp' % k, 90)
from PIL import ImageDraw
def person_glyph(size=1024):
    g = Image.new('RGBA', (size, size), (0, 0, 0, 0)); d = ImageDraw.Draw(g); c = size / 2
    d.ellipse([c - 0.17 * size, 0.14 * size, c + 0.17 * size, 0.48 * size], fill=(255, 255, 255, 255))
    d.rounded_rectangle([c - 0.33 * size, 0.56 * size, c + 0.33 * size, 1.05 * size], radius=0.26 * size, fill=(255, 255, 255, 255))
    d.rectangle([0, 0.86 * size, size, size], fill=(0, 0, 0, 0))
    m = np.asarray(g)[..., 3].astype(np.float32) / 255
    yy = np.linspace(0, 1, size)[:, None]
    top = np.array([236, 206, 128], np.float32); bot = np.array([196, 156, 78], np.float32)
    col = top * (1 - yy) + bot * yy; col = np.broadcast_to(col[:, None, :], (size, size, 3)).copy()
    inner = ndi.binary_erosion(m > 0.5, iterations=int(size * 0.012))
    col[(m > 0.5) & ~inner] = np.array([168, 128, 58], np.float32)                 # a darker bevel edge
    return Image.fromarray(np.dstack([col, m * 255]).astype(np.uint8), 'RGBA')
out = fit_square(put_glyph(base, geo, person_glyph(), frac=0.52), ICON, SPAN)
log('icon-profile', 'REPLACED', 'delivered with a face and the academy name lettered around the rim (brief: no text, no faces); replaced by a plain head-and-shoulders glyph in the delivered glyph gold on the same disc')
save(out, 'icons/profile.webp', 90)

# ================================================================== 6. badges
BADGE = 320; BSPAN = 304
def badge_from(im):
    keys = sample_keys(im)
    out = key_colors(im, keys, lo=16, hi=60, feather=0.8) if len(keys) == 1 else key_neutral(im, s_lo=0.10, s_hi=0.22, v_lo=30)
    return fit_square(out, BADGE, BSPAN), keys
for k in ['weather', 'radio', 'flightplanning', 'explorer', 'history', 'maintenance', 'jetops', 'mastercadet']:
    out, keys = badge_from(load('badge-%s.png' % k))
    kind = 'checkerboard keyed' if len(keys) > 1 else 'black keyed'
    log('badge-' + k, 'ACCEPTED', 'on brief; 2048-px source; %s; stored 320x320' % kind); save(out, 'badges/%s.webp' % k, 90)

# first flight (missing): the illustrator's navy-disc star badge with its disc recolored to gold
ff = load('firstflight-base.png', EXTRA); ff = key_colors(ff, sample_keys(ff), 16, 60, 0.8)
fa = np.asarray(ff).astype(np.float32); rgb = fa[..., :3] / 255
mx = rgb.max(-1); mn = rgb.min(-1); sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
blue = (rgb[..., 2] > rgb[..., 0] * 1.25) & (rgb[..., 2] > rgb[..., 1] * 1.05) & (sat > 0.25) & (fa[..., 3] > 30)
blue = ndi.binary_closing(blue, iterations=2)
v = mx; gold = np.stack([np.clip(v * 1.55 + 0.12, 0, 1), np.clip(v * 1.30 + 0.07, 0, 1), np.clip(v * 0.55 + 0.02, 0, 1)], -1)
w = ndi.gaussian_filter(blue.astype(np.float32), 1.0)[..., None]
rgb2 = rgb * (1 - w) + gold * w
fa[..., :3] = np.clip(rgb2 * 255, 0, 255)
ffo = fit_square(Image.fromarray(fa.astype(np.uint8), 'RGBA'), BADGE, BSPAN)
log('badge-firstflight', 'DERIVED', 'not delivered; built from the delivered navy-disc star badge with the disc recolored gold, per the brief (gold wings, gold disc, gold star)')
save(ffo, 'badges/firstflight.webp', 90)

# navigation (missing; the delivered file has words on the ring): fill the blue ring over the lettering
nv = load('navigation-text.png', EXTRA); nv = key_colors(nv, sample_keys(nv), 16, 60, 0.8)
na = np.asarray(nv).astype(np.float32); rgb = na[..., :3] / 255
mx = rgb.max(-1); mn = rgb.min(-1); sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
blue = (rgb[..., 2] > rgb[..., 0] * 1.3) & (rgb[..., 2] > rgb[..., 1] * 1.08) & (sat > 0.3) & (na[..., 3] > 30)
ys, xs = np.where(blue); cx, cy = (xs.min() + xs.max()) / 2, (ys.min() + ys.max()) / 2
h, wdt = blue.shape; yy, xx = np.mgrid[0:h, 0:wdt]; dist = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2); ang = np.arctan2(yy - cy, xx - cx)
rr = dist[blue]; rmax = np.percentile(rr, 99.7); rmin = np.percentile(rr, 0.3)
ring = (dist > rmin + 3) & (dist < rmax - 3)
bins = 72; sect = ((ang + np.pi) / (2 * np.pi) * bins).astype(int) % bins
fill = np.zeros((bins, 3), np.float32)
for b in range(bins):
    sel = ring & blue & (sect == b); fill[b] = np.median(rgb[sel], axis=0) if sel.sum() > 20 else fill[b - 1]
for b in range(bins):
    if not (ring & blue & (sect == b)).sum() > 20: fill[b] = fill[(b + 1) % bins] if fill[(b + 1) % bins].any() else fill[b - 1]
text = ring & ~blue
rgbn = rgb.copy(); rgbn[text] = fill[sect[text]]
soft = ndi.gaussian_filter(text.astype(np.float32), 1.2)[..., None]
rgbn = rgb * (1 - soft) + rgbn * soft
na[..., :3] = np.clip(rgbn * 255, 0, 255); na[..., 3] = np.where(ring, 255, na[..., 3])
nvo = fit_square(Image.fromarray(na.astype(np.uint8), 'RGBA'), BADGE, BSPAN)
log('badge-navigation', 'FIXED', 'the delivered badge carried lettering on its ring; the ring was refilled with its own blue (lettering and two dots removed); compass rose untouched')
save(nvo, 'badges/navigation.webp', 90)


# ================================================================== 7. the raw generator downloads (originals)
# Only files with no lettering, no faces and no military marks are used. Everything else in the three ZIPs is either a
# duplicate of a delivered file or junk (lettered roundels, the framed night runway, the lettered runway tile).
if OPENART:
    import glob
    def oa(stem):
        hits = glob.glob(os.path.join(OPENART, '**', 'openart-' + stem + '*.png'), recursive=True)
        return Image.open(hits[0]).convert('RGBA') if hits else None
    EXTRA_BADGES = {   # output name: (file stem, what it is, which badges it serves)
        'groundschool': ('1792200380_01ac09a6', 'gold wings with an open book and pencil (blank pages)', 'GROUND SCHOOL STUDENT, PAGE ONE, BOOKWORM'),
        'laurel': ('1792200393_c9b4ea84', 'gold wings with a star in a laurel (no shield, not a service insignia)', 'GREASED IT, GOLD WINGS, PRIVATE PILOT GRAD'),
        'airliner': ('1792200389_e3965d17', 'gold wings with a twin-jet airliner seen head-on', 'FREQUENT FLYER'),
        'biplane': ('1792207418_2c5071cc', 'gold wings, green disc with a biplane (iconic view)', 'SHARP EYES'),
        'jetliner': ('1792207419_7daf362f', 'gold wings, blue disc with a four-engine jet, plan view', 'GAME NIGHT REGULAR, CLUBHOUSE LEGEND'),
    }
    for name, (stem, what, serves) in EXTRA_BADGES.items():
        im = oa(stem)
        if im is None: log('badge-' + name, 'SKIPPED', 'original not found in the openart downloads'); continue
        out, keys = badge_from(im)
        save(out, 'badges/%s.webp' % name, 90)
        log('badge-' + name, 'ACCEPTED', 'from the raw downloads (2048-px original, black keyed): %s; serves %s; stored 320x320' % (what, serves))
    # the dusk apron panorama (6224x2664): hangars on the horizon at the left, a tree line at the right, and a parked
    # low-wing aircraft with military-style roundels in the middle. Nothing is painted in: the band is stitched from the
    # two clean sides (columns 0..1704, the gap after the last hangar, and 4300.., where the tree line starts), with the
    # sky matched across the seam by a smooth per-row gain and cross-faded (wide in the open sky, 70 px at the horizon).
    pan = oa('1792200654_db035e34')
    if pan is not None:
        pa = np.asarray(pan.convert('RGB')).astype(np.float32); Hh, Ww = pa.shape[:2]
        cL, cR, YB = 1704, 4300, 2062
        Wout = cL + (Ww - cR); Hb = int(round(Wout / (840 / 110))); Y0 = YB - Hb; rows = np.arange(Y0, YB)
        gl = pa[Y0:YB, cL - 30:cL + 10].mean(1); gr = pa[Y0:YB, cR - 10:cR + 30].mean(1)
        g = gr / np.maximum(gl, 1); cut = int(np.searchsorted(rows, 2036)); g[cut:] = g[cut - 1]
        g = ndi.gaussian_filter1d(g, 12, axis=0); g = 1 + (g - 1) * np.clip((2046 - rows) / 10, 0, 1)[:, None]
        def ramp(d, span):
            x = np.clip(d / span, 0, 1); return x * x * (3 - 2 * x)
        wL = ramp(np.arange(0, cL + 600) - (cL - 1500), 1500); wR = ramp((cR + 1500) - np.arange(cR - 600, Ww), 1500)
        left = pa[Y0:YB, :cL + 600] * np.power(g[:, None, :], 0.5 * wL[None, :, None])
        right = pa[Y0:YB, cR - 600:] * np.power(g[:, None, :], -0.5 * wR[None, :, None])
        band = np.zeros((Hb, Wout, 3), np.float32); j = np.arange(Wout)
        for i, y in enumerate(rows):
            B = 1000 if y < 1960 else (70 if y >= 1985 else 1000 + (70 - 1000) * (y - 1960) / 25)
            t = ramp(j - (cL - B / 2), B)[:, None]
            band[i] = left[i, np.clip(j, 0, cL + 599)] * (1 - t) + right[i, np.clip(j - cL + 600, 0, right.shape[1] - 1)] * t
        band = Image.fromarray(np.clip(band, 0, 255).astype(np.uint8), 'RGB')
        rw = grade(band.resize((840 * 3, 110 * 3), Image.LANCZOS), 0.8, bottom=0.0)
        save(rw, 'runway-sky.webp', 80)
        log('wall-runway', 'REPLACED', 'from the raw downloads: the 6224-px dusk apron panorama, stitched from its two clean sides so the parked aircraft (military-style roundels) is left out; hangars at the left, a tree line at the right, the sun low at the right; nothing painted in; replaces the plain sky; stored 2520x330')


# Every file in the three raw-download ZIPs, and what became of it (docs/ART_ACCEPTANCE.md prints this table).
# kind: 'original' = the full-size original of a file in the delivery ZIP; 'extra' = a generation that was not delivered.
OPENART_TRIAGE = [
 ('openart-download.zip', '1792200380_01ac09a6', 'extra', 'USED', 'gold wings with an open book and pencil, blank pages: badge art "groundschool"'),
 ('openart-download.zip', '1792200382_69281530', 'extra', 'JUNK', 'roundel lettered FLIGHT ACADEMY around a compass and mountains (lettering)'),
 ('openart-download.zip', '1792200385_742de040', 'extra', 'REJECTED', 'wings with an aircraft whose propeller sits in the middle of the fuselage, behind a canard; not a real configuration'),
 ('openart-download.zip', '1792200387_f388377d', 'original', 'ORIGINAL', 'of the delivered badge-maintenance (in the app)'),
 ('openart-download.zip', '1792200389_e3965d17', 'extra', 'USED', 'gold wings with a twin-jet airliner seen head-on: badge art "airliner"'),
 ('openart-download.zip', '1792200393_c9b4ea84', 'extra', 'USED', 'gold wings with a star in a laurel: badge art "laurel"'),
 ('openart-download.zip', '1792200599_3381a0ca', 'original', 'JUNK', 'portrait medallion with a face and the academy name lettered twice (the delivered icon-profile, replaced)'),
 ('openart-download.zip', '1792200606_f3631260', 'original', 'ORIGINAL', 'of the delivered icon-settings glyph (in the app, on the navy disc)'),
 ('openart-download.zip', '1792200622_1926eba1', 'original', 'JUNK', 'the runway tile: letterboxed, nonsense lettering on the runway (the rejected tile-runway)'),
 ('openart-download.zip', '1792200623_736a322b', 'original', 'ORIGINAL', 'of the delivered tile-terminal; used to repair it at full resolution (military roundel and extra tail wheel removed)'),
 ('openart-download.zip', '1792200627_a6e19118', 'original', 'ORIGINAL', 'of the delivered wall-gameroom (rebuilt from its own panels)'),
 ('openart-download.zip', '1792200643_af582433', 'original', 'ORIGINAL', 'of the delivered tile-hangar (in the app)'),
 ('openart-download.zip', '1792200651_f17fe129', 'original', 'JUNK', 'night runway inside a gold picture frame, nonsense runway numbers, white threshold lights (FAA: green and red)'),
 ('openart-download.zip', '1792200654_db035e34', 'original', 'USED', 'dusk apron panorama: the runway horizon, stitched so its aircraft with military-style roundels is left out'),
 ('openart-download-1.zip', '1792207068_5f87a4d2', 'extra', 'JUNK', 'runway disc with the academy name lettered below it'),
 ('openart-download-1.zip', '1792207070_37031502', 'extra', 'JUNK', 'house glyph with the academy name lettered below it'),
 ('openart-download-1.zip', '1792207072_b31bcd74', 'extra', 'JUNK', 'framed emblem lettered with the academy name twice'),
 ('openart-download-1.zip', '1792207073_404077c9', 'original', 'ORIGINAL', 'of the delivered icon-hangar wrench (in the app)'),
 ('openart-download-1.zip', '1792207078_4cc3a34f', 'extra', 'JUNK', 'crew glyph inside a badge lettered with the academy name'),
 ('openart-download-1.zip', '1792207080_cf936527', 'original', 'ORIGINAL', 'of the delivered icon-achievements trophy (a white corner, keyed out)'),
 ('openart-download-1.zip', '1792207085_32c064e8', 'original', 'ORIGINAL', 'of the delivered badge-explorer'),
 ('openart-download-1.zip', '1792207230_2373bf80', 'original', 'ORIGINAL', 'of the delivered badge-flightplanning'),
 ('openart-download-1.zip', '1792207411_53a286ab', 'original', 'ORIGINAL', 'of the delivered badge-weather'),
 ('openart-download-1.zip', '1792207414_9244efe2', 'original', 'ORIGINAL', 'of the delivered badge-radio'),
 ('openart-download-1.zip', '1792207418_2c5071cc', 'extra', 'USED', 'gold wings, green disc with a biplane: badge art "biplane"'),
 ('openart-download-1.zip', '1792207419_7daf362f', 'extra', 'USED', 'gold wings, blue disc with a four-engine jet: badge art "jetliner"'),
 ('openart-download-1.zip', '1792207423_87c7f3d6', 'original', 'ORIGINAL', 'of the delivered badge-mastercadet'),
 ('openart-download-2.zip', '1792208003_0c17fd65', 'original', 'ORIGINAL', 'of the delivered icon-path'),
 ('openart-download-2.zip', '1792208007_6e66eefa', 'original', 'ORIGINAL', 'of the delivered icon-lounge'),
 ('openart-download-2.zip', '1792208009_dddce2bf', 'original', 'ORIGINAL', 'of the delivered icon-class'),
 ('openart-download-2.zip', '1792208012_d6a76b2e', 'original', 'ORIGINAL', 'of the delivered icon-crewboard'),
 ('openart-download-2.zip', '1792208019_f268c242', 'original', 'ORIGINAL', 'of the delivered badge-history (baked checkerboard, keyed out)'),
 ('openart-download-2.zip', '1792208022_50634083', 'original', 'ORIGINAL', 'of the delivered badge-jetops (baked checkerboard, keyed out)'),
]
json.dump({'delivery': os.path.abspath(DELIV), 'log': LOG, 'openart': [dict(zip(('zip', 'file', 'kind', 'decision', 'note'), t)) for t in OPENART_TRIAGE] if OPENART else []}, open(os.path.join(ROOT, 'docs', 'ART_INTEGRATION_LOG.json'), 'w'), indent=1)
from collections import Counter
print('\n%d entries:' % len(LOG), dict(Counter(l['action'] for l in LOG)))
