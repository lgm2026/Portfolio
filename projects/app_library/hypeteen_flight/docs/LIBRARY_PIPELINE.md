# Library pipeline: from a finished manuscript to a book in the app

The seven HypeTeen Flight Academy novels are read inside the app, free, start to finish. This is how a book gets there and what the app does with it.

## 1. Import

```
node tools/import_book.js <n> <path/to/book0n.md>          # writes web/js/content/lazy/series/htfa-<n>.js
node tools/import_book.js <n> <path/to/book0n.md> --check  # dry run: chapters, words, what was dropped, which units are linked
```

Input: the production master's Markdown manuscript (`03_EDITABLE_PRODUCTION/manuscripts/book0n.md`). Output: one lazy content file that calls `G.HFQ.addSeriesText('htfa-n', {chapters, words})`. The import is deterministic (same manuscript, same bytes).

What the importer does, in order:

| Manuscript | In the app |
|---|---|
| `# Prologue — ...`, `# Chapter One — ...`, `# Epilogue — ...`, `# Ground School Notes — ...`, `# The Pilot's Field Guide ...` | one chapter each; the part before the dash becomes the eyebrow, the part after is the title |
| `## Heading` inside a chapter | a section heading |
| `* * *` | a scene break (a small brass ornament) |
| `> quote` | a quotation |
| `*emphasis*`, `**strong**` | rendered as runs (`<em>`, `<strong>`); the text is never parsed as HTML |
| `[[IMG:...]]` | **dropped**: this edition carries no interior artwork (the author's decision) |
| `## Continue with ...` + the next-book teaser | **dropped**: the app shows its own next-book card |
| `## ... ABOUT THE AUTHOR` to the end of the file | **dropped**: no author name appears anywhere in the app |

The importer refuses to write if a fingerprinted author name survives anywhere in the output (the same fingerprint set as `qa/byline_guard.js`), or if the manuscript parsed to fewer than 1,000 words.

Links: the Ground School Notes chapter gets up to six links to academy units, chosen by keyword from its section headings (`UNIT_KEYS` in the importer); Book Seven's Field Guide links to the two judgment units. The reader shows these only at the end of that chapter, after it has been read, so the story is never interrupted and nothing is spoiled.

## 2. Register

`web/js/content/series.js` holds one entry per book: number, id, title, `status` (`available` or `soon`), accent color, cover file, cover alt text, lazy file path, chapter count, word count, age line, tagline and teaser (the publisher's own copy from `book_metadata.json`). A book marked `soon` shows COMING SOON everywhere and cannot be opened.

Covers: `web/assets/series/htfa-book<n>-cover.webp`, 600 × 845, made from the supplied front covers with the author line (the bottom 8.8%) cropped away. See `docs/ASSET_MANIFEST.json`.

## 3. Ship

`tools/build.js` evaluates every content file at build time and ships the recorded `addSeriesText` call as XOR-keyed, base64 JSON (`dist/js/content/lazy/series/htfa-<n>.js`), decoded with `JSON.parse` at load, so the page runs under a strict CSP with no `eval`. The service worker precaches all seven files, so once the app has been installed every book opens offline. Roughly 1.4 MB for the whole series.

## 4. In the app

- The Library shelf shows the seven covers with each cadet's place ("Chapter 12", "finished").
- A book's page: cover, tagline, teaser, age line, chapters and reading time, Start / Continue reading, the academy phase named for it.
- The reader (`hfq_reader.js`): one chapter at a time, Previous / Next, contents and bookmarks, text size, line spacing, serif or sans, night / sepia / day pages, a progress bar, your place saved per profile (`G.save.mod.read[docId]`), keyboard and screen-reader friendly, works offline.
- Finishing the last chapter marks the book finished and records `readseries` in the verified log. Reading earns no XP or badges: the books are for reading.
- Search finds the books (`series:<n>` in the activity registry).

## 5. Rules

- Story text is copied verbatim and never edited in the app repo. Fix a manuscript, re-import.
- No author name, byline or "about the author" in any file. `node qa/byline_guard.js` runs in `qa/run_all.js` and fails the build on a hit.
- Interior illustrations stay out until the author supplies approved art; the importer would then map `[[IMG:...]]` to `{img, alt}` blocks with the files under `web/assets/series/`.
