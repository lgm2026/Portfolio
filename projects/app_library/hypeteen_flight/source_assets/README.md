# Source asset library

The commissioned artwork is reproduced in `web/assets/art/` by `tools/integrate_art.py` from the illustrator's files. To keep this package under the transfer limit, the large PNGs are not repeated here; they are the publisher's own files:

- `illustrator_delivery_2026-10-16/`: put the `assets/` folder of `HypeTeen_Flight_Academy_PNG_Assets.zip` here (44 PNGs). Included: the illustrator's `asset_manifest.json` and `shared_separately/` (the two badge images sent outside the ZIP).
- `illustrator_raw_downloads_2026-10-17/`: extract `openart-download.zip`, `openart-download-1.zip` and `openart-download-2.zip` here (33 PNGs). Which were used, which are originals of delivered files and which were rejected as junk, file by file: `docs/ART_ACCEPTANCE.md`.
- `illustrated_revision_concepts/`: the r7.1 concept board as received (13 PNG crops); still the source of the two Hub tiles whose replacements were rejected (`env-runway`, `env-night`).

Rebuild: `python3 -I tools/integrate_art.py --delivery source_assets/illustrator_delivery_2026-10-16 --extra source_assets/illustrator_delivery_2026-10-16/shared_separately --openart source_assets/illustrator_raw_downloads_2026-10-17`. Integrated files live where the app loads them: `web/assets/art/` (plates, `floors/`, `icons/`, `badges/`, `manifest.json`); every one is in `docs/ASSET_MANIFEST.json`.
