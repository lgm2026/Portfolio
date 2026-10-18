# Protecting the Work: checklist before going live

What is already in the code (round 6.6):
- `LICENSE` (all rights reserved, no license granted) at the root and in the app folder; `.gitignore` keeps `dist/`, shots and logs out of git.
- A copyright header on every source file (`node tools/stamp_headers.js` re-stamps new files).
- `tools/build.js` stamps each bundle with a copyright banner and a **build fingerprint** (`window.HFQ_BUILD`), keeps the per-file headers, emits no source maps, and ships the lessons and books **encoded** (not readable or copy-pasteable in the bundle; decoded at load).
- The Terms of Use inside the app carry the IP notice and warning every household must accept.
- `tools/hosting/` serves `dist/` with anti-framing and CSP headers, a referer check on the bundles, and 90-day access logs.

What only you can do (in order):
1. **GitHub: make the repository private.** Settings → General → Danger Zone → Change visibility. If it was ever public, assume that history was seen. Push only `web/` source to the private repo; deploy `dist/` to dbmb.io by copying files (rsync/SFTP), never GitHub Pages from a public repo.
2. **Register the copyright** at copyright.gov: one registration for the software (computer program) and one for the text (lessons + books, as a literary work). Registration before infringement is what unlocks statutory damages and attorneys' fees.
3. **Register the trademarks** at uspto.gov: HypeTeen Flight Academy, HypeTeen Flight Quarters (Class 9 software and Class 41 education at minimum). Use TM until registered, (R) after.
4. **Fill in the brackets** in `web/js/hfq_terms.js` (legal entity, email, mailing address, confirm the state) and have counsel read the Terms once. Bump `H.TERMS.version` when the text changes.
5. **Keep a dated copy of each release** (the zip, with its build id) somewhere safe. If a copy ever appears elsewhere, the fingerprint and headers tie it to a release and a date.
6. **Do not** paste the source into public forums or public AI tools, and do not share the private artifact link beyond your testers.

What this does not do: stop a determined programmer from reading the running JavaScript, or protect the *idea* of a kids' flight-training game. Ideas are not protectable; your expression, brand, and the 512 lessons are, and they are now marked, registered-ready, and gated.
