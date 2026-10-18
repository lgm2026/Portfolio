# Gate 0: protected baseline (r6.6)

Date: 2026-10-16. Nothing in the baseline was modified; all work happens on a copy.

## What was received

| Item | SHA-256 |
|---|---|
| `hypeteen-flight-quarters-r6.6-handoff.zip` (172 files, 5.0 MB unpacked) | `9b79bcdcf9b1cbb04242e4baa69419efe1ae33a4fc4087fc78b7781797a0b780` |
| Unified Production Handoff PDF (22 pages, the product brief) | `a06f1ea0c531843d73daf5c122851235bef7c692a23404ff5fed6c81d0eb842b` |

A per-file SHA-256 manifest of the unpacked archive (172 entries) is kept with the read-only backup as `r6.6_FILE_MANIFEST.sha256` and is reproduced in `docs/baseline/r6.6_FILE_MANIFEST.sha256` of this release.

## Source-of-truth declaration

The archive's top folder is named `hfq-r1-handoff`, but its contents are round 6.6 (dist build `mv8lct7j-hu54xj`, 2026-10-14).

| Path in the archive | What it is | Status |
|---|---|---|
| `hypeteen-flight-quarters/web/` | The app. Plain HTML/CSS/JS, 101 scripts, no build step. | **Authoritative source.** Every change in r7 starts here. |
| `hypeteen-flight-quarters/dist/` | Generated bundle (2 scripts) from `tools/build.js`. | Derived. Rebuilt each release, never edited. |
| `hypeteen-flight-quarters/qa/` | Nine browser suites, structure/content checks, `run_all.js`. | Authoritative tests. Extended in r7. |
| `hypeteen-flight-quarters/tools/` | Build, header stamping, nginx hosting config. | Authoritative (hosting config has defects, see the audit). |
| `app-shell/` | The reusable framework (App Shell v1.4.4). 14 shell files must stay byte-identical with the app (enforced by `qa/structure_check.js`). | Authoritative for shell files. |
| `app-shell/presets/hfq/` | The Round 1 starter preset. | **Legacy.** Not today's app. |
| `app-shell/presets/raging-knights/`, `homestead/` | Unrelated renditions of the shell. | **Legacy / unrelated.** |
| `HANDOFF_PROMPT.md` | Round 6.3.1 handoff prompt. | **Stale.** Counts, the cast list and file references are out of date; it references `docs/`, `assets/`, `HANDOFF_REPORT.pdf` and a root `tools/README.md` that are not in this archive. |
| `PROTECTING_THE_WORK.md`, `LICENSE` | IP checklist and proprietary license. | Current, but the license names the author byline (removed in r7 per the author's rule). |

## Reproducible launch

```
cd hypeteen-flight-quarters/web && python3 -m http.server 8777
# open http://localhost:8777 (a phone or a narrow window shows it best)
```

Tests need Playwright with Chromium. In this workspace: `NODE_PATH=/opt/npm-tools/node_modules node qa/run_all.js`.

## Baseline test results (unmodified r6.6)

Host: 2 CPUs, Chromium 1194 (Playwright 1.56), Node 22.

| Suite | Result | Notes |
|---|---|---|
| structure_check | OK | 101 scripts, 14 shell files identical, lint clean |
| content_check | OK | 55 units, 500 lessons, 3,004 challenges |
| hfq_arch_smoke | 19/19 | |
| hfq_smoke | 38/38 | |
| hfq_games_smoke | 52/52 | |
| hfq_r4_smoke | 54/54 alone | Failed to start when three browsers ran at once (`--jobs=3`); passes alone |
| hfq_r5_smoke | 38/38 alone (twice) | G24 Hangar Hoops is timing-sensitive; failed only under `--jobs=3` |
| hfq_r6_smoke | 88/88 | |
| hfq_e2e | 100/100 | 204 s |
| hfq_lessons_smoke | 32/32 | all 500 lessons flown, 886 s |

Conclusion: the baseline is green when run as documented (`--jobs=2`, the default). The two load-induced failures are recorded as test debt, not app defects.

## Content audit at baseline (advisory)

`qa/content_audit.js`: the correct multiple-choice answer is strictly the longest option in 68.2% of 1,460 questions; 257 throwaway distractors; 21 duplicate prompts; true/false balance 50.7% true.
