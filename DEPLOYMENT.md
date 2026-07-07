# dburich24 — Deployment Checklist

Everything needed to take `dburich24.html` from a working local file to a live public site. The app runs standalone today; these steps wire up the production domain, the backend, and the real certificate assets.

---

## Target architecture

- **Hosting:** GitHub Pages (served from a private repo via GitHub Actions).
- **Backend:** a single Cloudflare Worker handling two jobs — AI cover-letter generation and contact-form relay.
- **Assets:** full-resolution certificate PDFs served from `/assets/certs/`.

---

## 1. Repository

- [ ] Create the private GitHub repo `dburich24`.
- [ ] Commit `dburich24.html`. If you prefer, rename it `index.html` at the site root so the domain serves it directly.
- [ ] Add the `assets/certs/` folder (see step 4).

## 2. GitHub Pages via Actions

- [ ] Enable Pages on the repo, source = GitHub Actions.
- [ ] Add a static-deploy workflow that publishes the repo root (or `/docs`) to Pages on push to `main`.
- [ ] Confirm the site loads over HTTPS at the Pages URL before attaching a custom domain.

## 3. Custom domain

- [ ] Point the final domain at GitHub Pages (DNS `CNAME`/`A` records per GitHub's current instructions).
- [ ] Add the `CNAME` file / Pages custom-domain setting.
- [ ] Update the app's configured values to the real domain:
  - `SITE.email` is set to the direct inbox `dustin@dbmb.io`; `SITE.emailGeneral` is the general no-reply inbox `contact@dbmb.io` (suggestions, in-app correspondence). Create both mailboxes on the dbmb.io domain.
  - `SITE.linkedin` — verify.
  - `SITE.pdfFooter` is `dbmb.io · v1.2`; update the version on future releases.
  - `SITE.workerUrl` — set to your deployed Cloudflare Worker base URL (see step 5). Leaving it blank keeps the app in preview mode (direct Claude call / offline demo). Once set, Custom Tailoring routes through the Worker.

## 4. Certificate assets

- [ ] Take the full-resolution certificate PDFs from the separate certificates archive (`dburich24-certificates.zip`).
- [ ] Place them in `public/assets/certs/` (or `/assets/certs/` at the site root) using the exact filenames referenced by the cert data (each cert record has a `file:"NAME.pdf"`).
- [ ] **Rotate all 23 landscape source PDFs to upright.** These scans are landscape documents stored sideways. The in-app viewer copies are already fixed inside the embedded data, but résumé attachments and Access Files downloads pull the source files from `/assets/certs/`, so they must be rotated to match. The full list: the four FEMA ICS certs (IS-100, IS-200, IS-700, IS-800) plus DB-Advantor-SysAd, DB-CENSEC-ATTRASUP, DB-CENSECFOR-NavyCorrections, DB-CENSECFOR-SRFA, DB-Coxswain, DB-EAWS, DB-ESWS, DB-EVOC, DB-HSBOps, DB-JBCTOP3, DB-JKO_JPME_, DB-NHTSA-DWI_SFST, DB-SAPR_Service_, DB-SAPR_Training_, DB-SIMBBC, DB-USDOL-ComputerOperator, DB-USDOL-PoliceOfficer, DB_Af-POI, DB_MA-ASchool. Everything else (letters, transcripts, DSAACP, Forklift, OC, NCIS, the Microsoft certs) is already upright.
- [ ] Verify the compiler's "Supporting Documents" merge pulls the real high-res PDFs (not the embedded preview images).
- [ ] Verify the Access Files tab's per-document Download buttons serve the originals (they fall back to embedded images only when the asset is missing).

## HypeTeen app fileset

The Av8Hype learning app ships inside this package at `hypeteen/learning/av8hype/`
(`index.html` is the complete self-contained app; the legal notices ride alongside).
Deploy the whole `hypeteen/` folder to the repo root next to the portfolio HTML, so the
Av8Hype card's relative link `hypeteen/learning/av8hype/` resolves on the same domain.
Future learning apps follow the same convention: `hypeteen/learning/<app>/index.html`.
Book PDFs will live at `hypeteen/books/` when they go live.

## 5. Cloudflare Worker (backend)

A ready-to-deploy Worker ships with this package as **`worker.js`**, with full setup steps in **`WORKER.md`**. It handles three responsibilities:

**a. Custom Tailoring (`POST /tailor`)**
- [ ] Deploy `worker.js`. Endpoint `/tailor` receives the posting URL (or pasted text) plus the candidate profile, fetches the URL server-side when only a URL is given, calls Claude, and returns the tailored selection and cover letter as JSON.
- [ ] Store the model API key as the Worker secret `ANTHROPIC_API_KEY` — never in the client.
- [ ] Set `SITE.workerUrl` in the app to the Worker's base URL. With it set, the app stops using the direct-call/offline paths and routes tailoring through the Worker.

**b. Contact-form relay (`POST /contact`)**
- [ ] `worker.js` includes a `/contact` handler with a honeypot check; wire it to your email provider (Resend, Postmark, MailChannels, etc.) — a commented Resend example is in the file.
- [ ] Update the Contact tab's submit handler to POST to `${SITE.workerUrl}/contact` (it currently validates and previews locally).

**c. Cloud Vault (`/files` routes)**
- [ ] Create the R2 bucket (`wrangler r2 bucket create dburich24-files`) and bind it as `FILES` (see WORKER.md).
- [ ] Set the `FILES_KEY` secret to a strong passphrase. This is separate from the site access key on purpose: the site key sits in public page source, the vault key never does.
- [ ] Test from a second device: Access Files -> unlock -> Cloud Vault -> upload a PDF -> download it elsewhere.

**General Worker hygiene**
- [ ] Set the `ALLOWED_ORIGIN` var to the production origin to lock CORS.
- [ ] Rate-limit the endpoints.

## 6. Analytics

- [ ] Add the Cloudflare (or chosen) analytics token/snippet.

## 7. Pre-launch verification

- [ ] All seven tabs load and navigate on desktop and mobile.
- [ ] **General Résumé** downloads a valid PDF on the live domain (not just the preview).
- [ ] **Custom Tailoring** end to end on the live domain: paste a posting (and/or a URL), generate, and download a package. Confirm the badge reads "Cloudflare Worker," the cover letter carries the monogram and script signature, and the résumé is at most two pages.
- [ ] Compiler produces a merged PDF with real high-res certs attached.
- [ ] Contact form actually delivers to the inbox.
- [ ] Cover-letter generation returns text end to end.
- [ ] Phone number is not present as raw text in the page source (it should be assembled in JS).
- [ ] The pen name appears **nowhere** — grep the built output to be sure.
- [ ] Admin unlock works; nothing admin-only is exposed to a normal visitor.

## 8. Content gates

- [ ] HypeTeen Academy project content stays behind its placeholder until trademark/licensing is cleared.

---

## Notes

- **Storage:** the app uses no browser storage, so admin state resets on reload. If you want the unlock to persist for the owner on the live site, add `localStorage` deliberately (it's fine on a real domain, unlike the preview environment).
- **Versioning:** bump `SITE.pdfFooter` (e.g., `v1.1`) when you ship meaningful résumé-output changes so generated PDFs are traceable.
