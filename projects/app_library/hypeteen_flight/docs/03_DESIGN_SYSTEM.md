# Design system (r7)

The visual north star is the series' covers: golden-hour skies, navy and brass heraldry, editorial typography. The app is a dark, navy design by intent; only the reader offers day and sepia pages.

## Color

| Token | Hex | Use |
|---|---|---|
| navy | `#10263D` | page background, theme color, bars |
| navy deep | `#0A1828` | behind the map, toasts, pin outlines |
| airfield blue | `#183B5A` | cards, panels, the canvas world's base |
| airfield blue 2 / 3 | `#22507A` / `#2E6496` | raised cards, highlights |
| brass | `#B88C35` | primary actions, rules, the insignia |
| brass hi / lo / ink | `#D9B25E` / `#9C7428` / `#E6C477` | selected states, gradients, eyebrows and labels |
| cream | `#F2E7CB` | headings, hero text |
| ink / sub / dim | `#F7F1E3` / `#E2D6BA` / `#A9B6C3` | body, secondary, muted |
| slate | `#657889` | attribution, tertiary |
| good / warn / bad / info | `#5FD38D` / `#F2C14E` / `#FF6B5B` / `#86B8FF` | status only, never decoration |

Contrast: body text on navy ≥ 12:1; muted text ≥ 5:1; brass primary buttons use navy text (≥ 7:1). FAA signs, markings and lights in the canvas world keep their standard colors (the in-world aviation rule beats the brand palette).

Tokens live in `web/css/htfa.css` (`#ui { --navy … }`) for the HTML layer and in `web/js/theme.js` / `rendition.js` for the canvas.

## Type

- **Display / headings:** Cormorant Garamond 600/700, uppercase with `.06–.08em` tracking (editorial serif).
- **Reading:** EB Garamond 400 / 400 italic / 600 at 16–27 px, line height 1.45–1.9, chosen by the reader; a sans option (Rubik) for readers who prefer it.
- **UI:** Rubik 400/600/700; labels uppercase with `.06–.18em` tracking; body 16 px, scaled by the text-size setting (16 / 17.5 / 19 / 21 px).
- All three are bundled (`web/assets/fonts`, SIL OFL 1.1); no font request leaves the origin.

## Layout

- Phone first: one column, 16 px gutters, safe-area insets, 44 px minimum touch targets (rows 56 px, buttons 46 px).
- Tablet/desktop: the HTML layer fills the width to 1120 px with 2–3 column grids (`.grid`, `.grid.wide`, `.grid.tiles`); the canvas stays a phone-shaped frame by design.
- Sticky top bar: Back on the left, a two-line title (clamped to two lines, smaller for long titles), actions on the right.
- Sections: `h2` with a brass hairline; cards with a 16 px radius and a soft shadow; segmented controls for exclusive choices; chips for filters (horizontal scroll on phones); selects for long filter lists.

## Components (hfq_ui.js + htfa.css)

`.bar`, `.iconbtn`, `.btn` (primary / ghost / danger / block), `.chip` (good / info / warn / self), `.seg`, `.filters.scroll`, `.card` (hi / flat), `.tile`, `.list .item`, `.stats .stat`, `.meter`, `.tier`, `.note` (warn / bad / good), `.empty`, `.dialog` + `.scrim`, `.toastline`, `.cover` (real / typeset), `.shelf`, `.reader` (night / sepia / day, serif / sans), `.mapwrap`, `.kv`, `.tabs`, `.entry`, `.thumbs`, `.provenance`.

Icons: one stroke family on a 24-unit grid, 1.9 stroke, drawn inline as SVG from `IC` in `hfq_ui.js`; the canvas has the matching set in `icons.js`.

## Accessibility

- Keyboard: everything in the HTML layer is a real button, link or input; Escape goes back; Tab order follows reading order; focus is visible (3 px brass ring).
- Screen readers: landmarks (`header`, `main`, `nav`), one `h1` per screen that receives focus on change, a polite live region for toasts and scene changes, labelled icon buttons, `aria-pressed` / `aria-selected` on toggles and tabs, `role=progressbar` on meters. The canvas carries `role=img` and a label, and every canvas screen's information is reachable in the Hub.
- Motion: `prefers-reduced-motion` honored by default; the setting is per profile.
- Text: scalable (four sizes) in the layer; reader text 16–27 px.
- Print: the Flight Record prints as a plain document (`@media print` hides the canvas and the bars).

## Voice

Plain, warm, specific; written to a cadet, never down to one. Aviation terms are used correctly and explained once. Buttons are verbs. No exclamation-mark enthusiasm in UI copy; celebration belongs to the badges and jingles. Self-reported things are always labelled so; verified things say what verified them.
