#!/usr/bin/env python3
"""Generate the placeholder monogram and every app icon QRHype ships with.

Run with: npm run icons  (or: python3 scripts/generate_icons.py)

To rebrand, replace src/assets/monogram.png with your own transparent square
PNG and run this script again. It will keep an existing monogram and only
regenerate the derived icons and favicon from the brand gradient.
"""

import os
import struct
import zlib

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(ROOT, "src", "assets")
PUBLIC = os.path.join(ROOT, "public")
ICONS = os.path.join(PUBLIC, "icons")

NAVY = (22, 50, 74)
SEAFOAM = (42, 129, 113)
SAND = (245, 242, 234)

FONT_CANDIDATES = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
]


def load_font(size):
    for path in FONT_CANDIDATES:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def ensure_dirs():
    os.makedirs(ASSETS, exist_ok=True)
    os.makedirs(ICONS, exist_ok=True)


def make_monogram(size=1024):
    """A simple two-tone DB wordmark on a transparent square canvas."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    font = load_font(int(size * 0.6))

    letters = "DB"
    # Measure each glyph so the pair sits centered as a unit.
    widths = []
    height = 0
    for ch in letters:
        box = draw.textbbox((0, 0), ch, font=font)
        widths.append(box[2] - box[0])
        height = max(height, box[3] - box[1])
    gap = int(size * 0.01)
    total = sum(widths) + gap
    x = (size - total) / 2
    top = (size - height) / 2

    colors = [NAVY, SEAFOAM]
    for ch, w, color in zip(letters, widths, colors):
        box = draw.textbbox((0, 0), ch, font=font)
        draw.text((x - box[0], top - box[1]), ch, font=font, fill=color + (255,))
        x += w + gap

    return img


def _fit_center(mark, tile_size, coverage):
    """Scale the mark to a fraction of the tile and center it, keeping aspect."""
    target = int(tile_size * coverage)
    mw, mh = mark.size
    scale = min(target / mw, target / mh)
    nw, nh = max(1, int(mw * scale)), max(1, int(mh * scale))
    resized = mark.resize((nw, nh), Image.LANCZOS)
    return resized, ((tile_size - nw) // 2, (tile_size - nh) // 2)


def _light_gradient(size):
    """Soft sand to seafoam-tinted wash that keeps dark artwork legible."""
    top = SAND
    bottom = (232, 240, 237)
    grad = Image.new("RGB", (size, size))
    px = grad.load()
    for y in range(size):
        t = y / max(1, size - 1)
        r = int(top[0] + (bottom[0] - top[0]) * t)
        g = int(top[1] + (bottom[1] - top[1]) * t)
        b = int(top[2] + (bottom[2] - top[2]) * t)
        for x in range(size):
            px[x, y] = (r, g, b)
    return grad


def rounded_icon(size, mark, radius_ratio=0.22, coverage=0.72):
    """Rounded-square light tile with the brand mark centered."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    grad = _light_gradient(size)
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        [0, 0, size - 1, size - 1], radius=int(size * radius_ratio), fill=255
    )
    img.paste(grad, (0, 0), mask)
    if mark is not None:
        resized, pos = _fit_center(mark, size, coverage)
        img.paste(resized, pos, resized)
    return img


def maskable_icon(size, mark, coverage=0.58):
    """Full-bleed light tile with extra padding to survive mask crops."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 255))
    img.paste(_light_gradient(size), (0, 0))
    if mark is not None:
        resized, pos = _fit_center(mark, size, coverage)
        img.paste(resized, pos, resized)
    return img.convert("RGBA")


def write_ico(png_image, path):
    """Write a minimal .ico wrapping a single 48x48 PNG frame."""
    frame = png_image.resize((48, 48), Image.LANCZOS)
    import io

    buf = io.BytesIO()
    frame.save(buf, format="PNG")
    png_bytes = buf.getvalue()

    header = struct.pack("<HHH", 0, 1, 1)
    entry = struct.pack(
        "<BBBBHHII",
        48,
        48,
        0,
        0,
        1,
        32,
        len(png_bytes),
        6 + 16,
    )
    with open(path, "wb") as f:
        f.write(header + entry + png_bytes)


def main():
    ensure_dirs()

    monogram_path = os.path.join(ASSETS, "monogram.png")
    if os.path.exists(monogram_path):
        print("Keeping existing monogram at src/assets/monogram.png")
        mark = Image.open(monogram_path).convert("RGBA")
    else:
        mark = make_monogram()
        mark.save(monogram_path)
        print("Wrote placeholder monogram to src/assets/monogram.png")

    icon192 = rounded_icon(192, mark)
    icon192.save(os.path.join(ICONS, "icon-192.png"))
    rounded_icon(512, mark).save(os.path.join(ICONS, "icon-512.png"))
    maskable_icon(512, mark).save(os.path.join(ICONS, "maskable-512.png"))
    rounded_icon(180, mark).save(os.path.join(ICONS, "apple-touch-icon.png"))
    write_ico(icon192, os.path.join(PUBLIC, "favicon.ico"))

    print("Generated app icons in public/icons and public/favicon.ico")


if __name__ == "__main__":
    main()
