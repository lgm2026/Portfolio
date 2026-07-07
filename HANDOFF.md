# dburich24 — Master Handoff

Complete technical and content reference for Dustin Burich's personal portfolio and résumé engine. This document is written so that a person (or a fresh session) with no prior context can pick the project up and continue it confidently.

---

## 1. Overview & identity

**Owner:** Dustin Burich — Myrtle Beach, SC. Navy veteran, indie developer, customer success professional.

**Site personality / tagline:** *Veteran | Visionary | Father | Human*

**Repository name:** `dburich24` (intended to be a private repo).

**Contact (as configured in the app):**
- Email: `dustin@dbmb.io` (direct); `contact@dbmb.io` (general no-reply inbox for suggestions and in-app correspondence)
- Phone: (843) 997-6482 — rendered via JavaScript, never as raw HTML text, so scrapers can't lift it.
- LinkedIn: `linkedin.com/in/dustin-burich`

> **Hard rule — pen name:** Dustin writes fiction under a separate pen name. That name must **never** appear anywhere in this project: not in the app, the source, generated PDFs, legal text, or any handoff artifact. This site is under his real name only. If you see the pen name anywhere, it is a bug to remove.

**Voice:** First person in the biography and personal copy. Impersonal résumé voice in the experience bullets (implied "I", no pronouns) — with one deliberate exception: the honorable-discharge line reads "...to take full custody of my children." Copy is plain and human. No em-dashes or en-dashes inside body copy, no AI-speak.

---

## 2. Current status

**Feature-complete and content-audited.** The app runs today with no server. Every résumé fact has been reviewed against source documents.

What works right now:
- All seven tabs render and navigate.
- The **General Résumé** button produces a complete formatted PDF (verified: valid multi-page output).
- The **Résumé Compiler** assembles and delivers a custom PDF.
- **Custom Tailoring** (v1.1) takes a job posting and produces a tailored, letterhead cover letter with a script signature plus a two-page-capped tailored résumé. In the live preview it can draft with real AI by pasting a description; it uses an offline demo with no network. Verified headless and visually.
- Real certificate scans are embedded in the file and open in an in-app viewer.

What is pending (all deployment-side, see `DEPLOYMENT.md`):
- Final production domain and real inbox for the contact email.
- Cloudflare Worker backend — code is provided (`worker.js` + `WORKER.md`); deploy it, set the `ANTHROPIC_API_KEY` secret, and set `SITE.workerUrl`.
- Dropping the full-resolution certificate PDFs into the deployed `/assets/certs/` path.
- GitHub private repo + Pages-via-Actions deploy, analytics token.
- Trademark/licensing clearance before any HypeTeen project content goes live.

---

## 3. Tech stack & architecture

A **single self-contained HTML file** — no build tooling, no bundler, no `npm install`, no backend required to run.

**Loaded from CDN (cdnjs) at runtime:**
- React 18.2.0 (UMD, production)
- ReactDOM 18.2.0 (UMD, production)
- Babel Standalone 7.23.5 — transpiles the JSX in the browser at load
- jsPDF 2.5.1 (UMD) — vector PDF generation (`window.jspdf.jsPDF`)
- pdf-lib 1.17.1 — merges certificate PDFs into the compiled résumé (`window.PDFLib`)

**Why Babel in the browser:** the app is authored in modern JSX and ES2015+ (arrow functions, `const`, template literals, destructuring) and Babel transpiles it live. This is intentional and different from some of the owner's other apps that ship raw `React.createElement` with no Babel — **this project does not use that restricted pattern.** Write normal modern React/JSX here.

**The one hard structural constraint:** the embedded certificate image data (~2.4 MB of base64) lives in a **plain `<script>` block**, *not* the Babel block. If it were inside `type="text/babel"`, Babel would try to parse 2.4 MB of data-URIs and choke. Keep large data payloads in plain script blocks.

**State/storage note:** the app holds all state in React (`useState`). It intentionally uses **no** `localStorage`/`sessionStorage`, because the in-canvas preview environment forbids browser storage. Practical effect: the admin/unlock state resets on every page reload. When deployed as a normal standalone site this is still the behavior unless you deliberately add storage.

---

## 4. File anatomy

Two script blocks near the bottom of the file:

1. `<script>` (plain) — defines `window.CERT_IMAGES`, a map of certificate filename → array of page image data-URIs (compressed JPEGs), and `window.SIG_FONT`, the base64 subset Great Vibes font used for the cover-letter signature. Large data payloads live here so Babel never parses them.
2. `<script type="text/babel">` — the entire application. Everything below is inside this block.

**Component / function inventory:**

`Masthead` · `Tagline` · `About` · `ExpCard` · `Experience` · `Projects` · `Acknowledgements` · `Hobbies` · `CredentialsSection` · `Contact` · `KeyModal` · `ResumeCompiler` · `CompilePage` · `CertViewer` · `App`, plus the v1.1 tailoring components `CustomTailor` and `CompilerHub`.

Plus module-level helpers of note: `generateGeneralResume()`, `downloadBytes()`, `certKey()` / `sortCerts()`, the v1.1 tailoring engine and PDF builders (`drawLetterhead`, `coverLetterBytes`, `renderTailoredResume`, `tailoredResumeBytes`, `mergePdfBytes`, `buildTailoredPackage`, `heuristicTailor`, `directTailor`, `workerTailor`, `tailorProfile`, `registerSignatureFont`), and the data arrays described in Section 6.

**Other files in this package:** `worker.js` (Cloudflare Worker backend), `WORKER.md` (Worker setup), `DEPLOYMENT.md`, `CHANGELOG.md`, `README.md`.

---

## 5. Site map — masthead + 7 tabs

**Masthead** (persistent, fixed top, two rows):
- Row 1: small logo (gold border, rounded) + "Dustin Burich" + "Myrtle Beach, SC" subheading + email/phone stacked at right + hamburger on mobile.
- Row 2: horizontally scrollable tab bar. On mobile the tabs and contact collapse into the hamburger menu.

**Tabs** (in order; internal ids in brackets):

1. **About Me** `[about]` — default landing. Headshot, tagline (this is where the Easter egg lives), short intro, action buttons (**General Résumé** [gold] + **View Experience**), full four-paragraph biography, email/call CTA.
2. **Work Experience** `[experience]` — professional + military roles only, reverse-chronological, followed by the credentials block (degrees, JST credit callout, apprenticeships, certification grid). No sports here (they live under Hobbies). No letters of appreciation here (they live under Acknowledgements).
3. **Acknowledgements** `[acknowledgements]` — peer/leadership reviews (initials + relationship only), then a "Letters & Recognition" section (letters of appreciation + a certificate of appreciation + the Top 3 achievement certificate), then a "Request My References" mail link.
4. **Projects** `[projects]` — three under-construction placeholders (HypeTeen Academy [trademark/licensing pending], Audio/Music Library, Apps & Websites).
5. **Hobbies** `[hobbies]` — three featured hobbies + a "see more" expander revealing the rest + a **Hockey Experience** section (pulls from the sports entries) + a "Connect About a Hobby" mail link.
6. **Contact** `[contact]` — contact form (currently validated and previewed locally; wired to a Worker at deploy time) + contact info.
7. **Compile a Résumé** `[compile]` (🔒) — password gate; once unlocked, renders the full Résumé Compiler inline.

---

## 6. Content data (authoritative facts)

All content below reflects the current, audited state. The file is the source of truth; this section captures the facts that were hard-won during review so they aren't lost.

### Experience array

Professional display order (`PRO_ORDER`): `["c1","e6","e5","e4","e3","e2","e1","e0"]`. Sports entries (`s1`–`s3`) render under Hobbies.

**c1 — Opsgility LLC — Customer Success Manager / Project Manager — Fully Remote — May 2022 – Present**
Key points (no client names by design): turned around strained federal/enterprise accounts; took full ownership of an **18-week training cohort**, driving achievement-code activation and survey completion well beyond program KPI targets; built a master tracking system; grew the pipeline into new client wins; back-to-back top-tier performance ratings; supported 18+ training cohorts and hundreds of students, including tracks built for transitioning servicemembers and veterans.
> Client/program names (the academy program, the military-affairs program) were deliberately genericized — do not reintroduce them.

**e6 — USS Iwo Jima (LHD-7) — PO1, Anti-Terrorism Training Supervisor — Norfolk, VA — 2021 – Apr 2022**
Directed security-force training across shipboard and shoreside teams; built and tracked the Security Reaction Force qualification pipeline (273 training records); requalified M9/M16/M500/M240 and added the LA9-P less-lethal system; closed out nearly 12 years of service with an honorable discharge in April 2022, to take full custody of his children.

**e5 — NTAG Carolina / Navy Recruiting Station — PO1, Recruiter / Training Manager — Myrtle Beach, SC — Dec 2019 – 2021**
Reworked office workflow/layout during the 2019 DITS inspection (98% record accuracy, eliminated involuntary attrition); led PT and 25+ Delayed Entry Program sessions, pivoting to virtual delivery when the pandemic hit; mentored 102 assigned youth (Coastal Leadership Academy JROTC, 80+ off-duty hours); owned all Future Sailor training (100% DEP qualification rate); represented the command at **22** community/humanitarian events. *(Note: this figure was corrected from an erroneous "220+".)*

**e4 — Harbor Patrol Unit, Guam — PO2 to PO1 — Aug – Nov 2019**
Ran waterborne security patrols and law enforcement as a Harbor Security Boat Coxswain; vessel ops, crew supervision, incident response; **advanced to Petty Officer First Class (E-6)** during this tour.

**e3 — Joint Base Charleston / NSA Charleston — PO2 — Charleston, SC — 2016 – Aug 2019** *(most decorated tour)*
- Harbor Security Boat Coxswain and Small Craft Petty Officer in Charge; 12-person joint-service crew, 22 miles of restricted waterway, two nuclear-powered vessels.
- Advanced to Patrol Supervisor, Watch Commander, and Command Duty Officer.
- **First Navy Master-at-Arms to qualify as a USAF Base Defense Operations Controller** with the 628th Security Forces Squadron.
- **Authored and implemented an end-to-end revision and accuracy update to the Command Duty Officer study and qualification material.** *(Corrected wording — this is NOT "authored a controller study guide"; do not revert.)*
- Managed electronic security systems for 87 alarmed facilities / ~35,000 personnel daily; led the effort that secured a **$5.11M** security-system upgrade.
- **Expertly administered the Joint Base Charleston Ceremonial Honors Program, managing 75+ personnel (including joint service) across 8 commands to render military honors at 100+ funerals and ceremonial functions over 24 months throughout the southeastern United States.** *(Corrected numbers — replaced an earlier "21 Sailors / 80+ funerals" version; do not revert.)*
- Led the Honor Guard detail for the 2017 Joint Base Charleston Navy Ball; helped raise $18,000+.
- Hurricane Matthew disaster-recovery team.
- **Awards (medals only, on this entry):** Air Force Achievement Medal (Aug 2019); Air Force Outstanding Unit Award (2018 and 2019). *(The Top 3 certificate was moved to Acknowledgements — see below.)*

**e2 — USS George H.W. Bush (CVN-77) / VFA-31 — PO3 to PO2 — Virginia Beach, VA / FPO AE — 2013 – 2016**
Earned both ESWS and EAWS (dual warfare qualification, relatively rare); qualified across security roles (Armorer, Dispatcher, Crowd Control, Reaction Force Leader); full shipboard damage-control qualification; trained/qualified the next wave of the security force (50 patrolmen, 30 patrol supervisors, 30 armorers, 30 clearing-barrel supervisors); 250+ hours of security operations during a **nine-month overseas deployment supporting combat operations**. *(Deployment framing corrected — the earlier "5th and 6th Fleet areas" phrasing was removed.)*

**e1 — United States Navy — Master-at-Arms, Seaman to PO3 — NAS Oceana, Virginia Beach, VA — 2010 – 2013**
Main-gate Entry Control Point POIC (7,000+ vehicles / 20,000+ personnel daily); helped protect **10,500 acres across 19 posts and 88 tenant commands (25,000+ people), leading a force of 83 sailors and 26 DoD civilian police officers**; full patrol workload (300+ citations, 150+ calls, 50+ reports); armory + road qualifications; **wrote the eight-page Desk Sergeant qualification and standardization guide later adopted Navy-wide**; security/crisis response across **multiple** NAS Oceana air shows and the April 2012 FA-18 mishap community response; 95+ hours home-repair volunteering + 20+ hours Red Cross.
> The 10,500-acre base-security bullet and the Desk Sergeant guide bullet were deliberately **moved here from the carrier entry (e2)** — a shore installation's acreage and tenant commands belong to the shore tour, not the ship. Keep them here.
> Open flag: the "leading a force of 83 sailors and 26 DoD civilian police officers" line sits in a junior-enlisted entry. It's accurate to the installation secured; if it reads as over-scoped for the rank, soften the framing — owner's call.

**e0 — United States Navy — Master-at-Arms "A" School Graduate — Naval Technical Training Center, Lackland AFB, TX — Jul – Nov 2010**
Began Navy service with Recruit Training, advancing to Master-at-Arms "A" School in September 2010; completed the 260-hour course (patrol procedures, criminal investigation, use of force, arrest, search and seizure, firearms); graduated a qualified federal law enforcement officer; initial weapons qualifications (9mm, M500, M16).

**Sports entries (render under Hobbies → Hockey Experience):**
- **s1 — Grand Strand Youth Hockey — Head Coach / Program Manager — Myrtle Beach, SC — Oct 2025 – Present** (ongoing). Leads a youth roller/inline program end to end plus social/sponsor coordination.
- **s2 — Myrtle Beach Fire Department Ice Hockey Team — Social Media Manager — Myrtle Beach, SC — Oct 2025 – May 2026.** Ran the team's Facebook page (game-day coverage, announcements, promotion). *(Retitled from "Operations Manager" to reflect the actual role.)*
- **s3 — PeeDee IceCats (FPHL) — All-Access Intern — Florence, SC — Oct 2025 – May 2026.** Game-day operations, fan experience, crowd-management systems, media/scheduling.
> All hockey dates were corrected to an **October 2025** start (they had been wrongly set to 2018/2019/2021).

### Certifications (34 total)

Each cert carries a tier (1 = headline, 2 = supporting, 3 = historical/expired), a status, an issuer + date string, an optional `ack:true` flag, and a `file` (PDF name). Sorted newest-first within tier via `sortCerts` / `certKey`.

- The **credentials grid** on the Work Experience tab shows tier 1/2/3 certs **excluding** `ack:true` items.
- `ack:true` items (3 letters of appreciation + a SAPR certificate of appreciation + the **JB Charleston Top 3 Certificate of Achievement**) render on the **Acknowledgements** tab instead, under "Letters & Recognition." They remain selectable as attachments in the compiler.
- Certificate dates were reconciled to the source documents. Historical badges read "Expired ...".

### Education

- Saint Leo University — A.A. Liberal Arts, GPA 3.3 (2016)
- Calumet High School (2010)
- Two U.S. Department of Labor apprenticeships
- Joint Services Transcript — 78 ACE-recommended credit hours (labeled "Unofficial — official copy available upon request, circumstance permitting")

### References (`REF_POOL`)

Four entries — Thomas Mace, David Robison, Joseph Blacka (active) and Justin Roberts (inactive). Admin-gated; only surfaced inside the compiler.

### Hobbies

Three featured (Reconnecting with Nature, Finding Shark Teeth, All Things Hockey) plus additional hobbies behind a "see more" expander. The Hockey Experience block on this tab is generated from the sports entries above.

### Projects

Three placeholders in an under-construction state: HypeTeen Academy (gated on trademark/licensing), Audio/Music Library, Apps & Websites.

---

## 7. Résumé features

### 7a. General Résumé (one click)

Module-level `generateGeneralResume()`, wired to the gold button on the About tab. Builds a complete, all-inclusive PDF with jsPDF: professional summary, full professional + military experience, sports management, education (degrees + JST + apprenticeships), and headline + supporting certifications (tier 1 and 2, excluding `ack` items). Downloads as `Dustin_Burich_Resume.pdf`. Verified to produce a valid multi-page document.

### 7b. Résumé Compiler (gated)

Reached via the **Compile a Résumé** tab after unlocking. Presents a live "Your PDF" preview strip and four toggle sections that can be reordered with up/down arrows:
- **Cover Letter** (AI-generated at deploy time via the Worker)
- **Résumé** (Classic/Modern layout toggle + role picker + admin tag filters)
- **Supporting Documents** (select certificate PDFs to attach)
- **References**

`buildPDF()` generates the vector pages with jsPDF, then pdf-lib merges any selected certificate PDFs. In the deployed site it fetches full-resolution certs from `/assets/certs/`; in preview it falls back gracefully.

### 7c. PDF delivery — `downloadBytes()` (important)

Both generators deliver through the shared `downloadBytes(bytes, filename)` helper. This exists because of a real bug that used to make downloads silently fail:

- **The bug:** the old code called `URL.revokeObjectURL(url)` on the line immediately after `a.click()`, destroying the blob before the browser could act. It looked like it worked but produced nothing.
- **The fix:** `downloadBytes` triggers the anchor download, then delays `revokeObjectURL` by 30 seconds. It also detects when it is running inside a sandboxed preview iframe (`window.self !== window.top`) and **opens the PDF in a new tab** as a fallback, since forced downloads are frequently blocked in that iframe. Deployed standalone, only the normal download fires.

If you ever change the download path, preserve both behaviors (delayed revoke + iframe fallback).

### 7d. Custom Tailoring (job posting → tailored package) — v1.1

The **Compile a Résumé** page now opens on a **Custom Tailoring** tab via `CompilerHub` (the pick-and-choose tool of 7b is still there under **Manual Compiler**; it takes an `embedded` prop so the hub doesn't double-wrap it). The `CompilePage` gate renders `<CompilerHub/>` when unlocked.

**What it does:** the user provides an optional company/position, a job posting URL, and/or the pasted description, and gets back a tailored cover letter plus a résumé capped at two pages, downloadable as one PDF. The résumé pulls only from the real `EXPERIENCE`/`CERTS` data — nothing is invented.

**Engine (`CustomTailor` component), automatic fallback in this order:**
1. **Worker** — if `SITE.workerUrl` is set, `workerTailor()` POSTs `{jobUrl, jobText, company, position, profile}` to `${workerUrl}/tailor`; the Worker fetches the URL server-side, calls Claude, and returns the selection + letter. This is the production path.
2. **Direct Claude** — if no `workerUrl` and `SITE.allowDirectAI` is true and a description was pasted, `directTailor()` calls the Anthropic Messages API directly (`claude-sonnet-4-6`). This works in the live artifact preview, so real AI tailoring can be tested by pasting a posting. It cannot fetch a URL (browser CORS), so it needs pasted text.
3. **Offline demo** — `heuristicTailor()` scores each role and cert by keyword overlap with the posting and drafts a templated letter. No network required, so the layout/flow always work. The result badge shows which engine ran.

The profile sent to the model is built by `tailorProfile()` (roles with ids/tags/skills/highlights, active non-`ack` certs, education). The system prompt (`tailorSystemPrompt()`, mirrored in `worker.js`) forbids inventing facts and requires strict JSON: `{company, position, summary, roleIds, certTitles, coverBody}`.

**PDF output (all jsPDF, merged with pdf-lib):**
- `drawLetterhead()` is a shared header used by both documents: the `LOGO_SRC` monogram top-left, name, contact line, gold rule — real-stationery look.
- `coverLetterBytes()` builds the letter: date, recipient, `Re:`, body, `Respectfully,`, then a **script signature** rendered in an embedded subset **Great Vibes** font (OFL) registered via `registerSignatureFont()` from `window.SIG_FONT`; falls back to `times-italic` if the font is unavailable. Then the typed name.
- `tailoredResumeBytes()` enforces the **two-page cap**: it renders via `renderTailoredResume()` at decreasing bullet density (5→2), then trims roles, then hard-deletes overflow pages if still long. `getNumberOfPages()` drives the loop.
- `buildTailoredPackage()` assembles the chosen parts and downloads via the shared `downloadBytes()` as `Dustin_Burich_Tailored_<Company>.pdf`.

**Signature font:** `window.SIG_FONT` is a base64 subset (A–Z a–z, ~49 KB) of Great Vibes, embedded in the plain `<script>` block next to `CERT_IMAGES`. It is licensed OFL (embeddable). To change the signature style, swap the base64 and the `addFont` name.

**Font-state note:** the page footer draws in italic, so after any page break the body font is re-asserted (in `tailoredFoot()` and per bullet line) to prevent continuation bullets from rendering italic. Keep that if you refactor the résumé renderer.

---

## 8. Design system — "Beachfront Business Retreat" (locked)

**Palette:** navy `#0d1b2a`, navy2 `#12283f`, teal `#0e7490`, sea `#4a9b8e`, gold `#c9a84c`, copper `#a0633a`, cream `#f4efe6`, mist `#e8f4f8`.

**Type:** Barlow Condensed (display) + Inter (body). Mobile-first.

**Motion:** logo-image spinner on page transitions and during PDF compile.

Treat the palette and type pairing as fixed unless the owner asks to change them.

---

## 9. Admin unlock / Easter egg

The compiler is gated. Two ways in, both setting the same admin flag:

1. Open the **Compile a Résumé** tab and enter the unlock key: **`Tracy`**.
2. Easter egg on the About tab tagline: tap **"Human"** five times, then **"Veteran"** five times, then long-press **"Father"** (~1.5s) to open the key modal.

Admin state is in-memory and resets on reload (see storage note in Section 3).

---

## 10. Build & verify method (follow this before shipping any change)

The app is one file with an in-browser Babel block, so a syntax error anywhere breaks the whole page silently. Use this loop:

1. **Edit** the `<script type="text/babel">` block in `dburich24.html`.
2. **Transpile-check** before trusting the change: extract the babel block and run it through `@babel/standalone` with the **classic** JSX runtime in Node:
   ```js
   const html = require('fs').readFileSync('dburich24.html','utf8');
   const code = html.match(/<script type="text\/babel"[^>]*>([\s\S]*?)<\/script>/)[1];
   require('@babel/standalone').transform(code, { presets: [['react', { runtime: 'classic' }]] });
   ```
   (Classic runtime matters — the automatic runtime emits `import` statements that won't run in a bare `Function` sandbox.)
3. **For PDF logic,** you can headlessly prove a generator runs by stubbing `window.jspdf.jsPDF` (real jsPDF from npm), plus stub `React`/`ReactDOM`/`document`/`Blob`/`URL`, evaluating the transpiled module, and calling the generator. A valid résumé comes out around 25–30 KB; anything a few hundred bytes is a failure.
4. **Large data edits** (the CERT_IMAGES payload) are impractical via string replacement — script them by reading, modifying, and rewriting the file, and keep that payload in the plain `<script>` block.

---

## 11. Certificate system

- **In-app viewing:** `window.CERT_IMAGES` (plain script block) maps each certificate filename to an array of compressed JPEG page images. The `CertViewer` modal renders them stacked. This keeps the whole app self-contained and offline-capable.
- **Full-resolution archive:** a separate handoff archive (`dburich24-certificates.zip`, ~50 MB) holds the 36 original full-resolution certificate/transcript PDFs plus an index and manifest. At deploy time, drop those PDFs into the site's `public/assets/certs/` folder so the compiler can merge the real high-res documents. (That archive is delivered separately from this package; regenerate it from the originals if needed.)

---

## 12. Pending / open flags

Deployment tasks are in `DEPLOYMENT.md`. Content/design open items:

- **Rank-scope flag (e1): resolved.** The junior Oceana line now reads "serving within a combined installation security force of 83 sailors" (no over-claim of leading as a junior enlisted). The 26 DoD civilian police officers were relocated to a dated E-5 bullet on the CVN-77 / VFA-31 tour: "Returned to NAS Oceana post-deployment as Master-at-Arms Second Class (E-5)… leading a security shift and supervising a combined force that included 26 DoD civilian police officers." The DoD-officer supervision now appears once, at the correct rank.
- **Hockey end dates:** confirmed — Grand Strand ongoing, the other two closed May 2026.
- **Em-dash separators in titles/awards/certs:** left as intentional label separators (structured fields, not body copy). Sweep to middots if the owner prefers full consistency.
- **Trademark/licensing:** HypeTeen project content stays gated until cleared.

---

## Certificate viewer + Access Files (v1.2)

**Sideways landscape certs.** Many certificates are landscape documents that were stored rotated 90° inside a portrait frame, so the viewer showed them on their side. The fix is baked into the embedded data: 23 documents are now stored upright landscape (860×665) — the four FEMA ICS certs plus DB-Advantor-SysAd, DB-CENSEC-ATTRASUP, DB-CENSECFOR-NavyCorrections, DB-CENSECFOR-SRFA, DB-Coxswain, DB-EAWS, DB-ESWS, DB-EVOC, DB-HSBOps, DB-JBCTOP3, DB-JKO_JPME_, DB-NHTSA-DWI_SFST, DB-SAPR_Service_, DB-SAPR_Training_, DB-SIMBBC, DB-USDOL-ComputerOperator, DB-USDOL-PoliceOfficer, DB_Af-POI, DB_MA-ASchool. Every embedded page was verified two ways: a text-banding orientation detector plus Tesseract OSD, then a visual pass over contact sheets of all 42 pages. If a future cert shows sideways, rotate its `window.CERT_IMAGES[...]` entry 90° clockwise the same way — dimensions alone can't tell you (a portrait cert and a rotated landscape cert are the same pixel size), so check the content.

**Auto-fit title.** `FitTitle` measures the header width and shrinks the font from 17px down to a 12.5px floor to keep the title on one line; below the floor it allows a second line (clamped). No config.

**Download path.** `downloadCertPDF(file, title)` first tries `fetch("assets/certs/"+file)` and, if it gets a real PDF, downloads that. Otherwise it rebuilds a PDF from the embedded page images with jsPDF (per-page orientation by aspect, fit within the page, centered). This is why downloads work in the live preview and serve the full-resolution originals once deployed. **Deploy caveat:** rotate all 23 landscape source PDFs in `/assets/certs/` to upright too (full list in DEPLOYMENT.md), so downloaded/attached copies match the viewer.

**Access Files tab.** Admin-gated (same access key as the compiler). Lists every cert/award/letter/transcript that has a `file`, grouped, each with a Download button, plus the Cloud Vault (next section) for documents you add later.

### About copy (two versions)

The front page uses `ABOUT_SHORT` (hero intro) and `ABOUT_FULL` (two paragraphs), rewritten short and civilian-friendly. The original long-form story is preserved as `SUMMARY_SHORT` / `SUMMARY_FULL` right below them and appears in the **See a Short Summary** popup on the Experience page (`SummaryModal`, which borrows the cert viewer's `cv-` modal styles plus a small `.sum-body` block). Edit the constants to change either version; nothing else is wired to them.

### General résumé (2-page layout)

The blue **General Résumé** button on About produces a strict two-page PDF. Pre-2019 tours are trimmed to their two strongest bullets via the `GEN_TOP2` map that sits directly above `generateGeneralResume` in the source — each entry is a role id with the indices of the bullets to keep (indices into that role's `bullets` array). Change the picks there; nothing else needs touching, and the site's Experience tab plus both compilers are unaffected. The contact header is one line — phone • email • `SITE.portfolio` — with `portfolio` set to the production domain `dbmb.io`. LinkedIn was removed from the site and résumé entirely. If future content pushes past two pages, the first knobs to turn are the cert-paragraph leading (11pt) and the bullet leading (12pt) inside the function.

### Cloud Vault (upload — built in v1.2)

The Access Files tab now has a **Cloud Vault** section backed by the Worker and an R2 bucket. Upload certificates and letters from any device (drag-drop or tap), list them, download them anywhere, remove them. No code edits, no redeploys.

- **Two keys by design.** The site access key unlocks the tab but lives in public page source, so it protects nothing sensitive. The vault requires the `FILES_KEY` Worker secret, entered per visit and held only in React state — never persisted to the page or browser storage. All four `/files` routes 401 without it, and the vault stays closed entirely if the secret is unset.
- **Worker routes:** `GET /files` (list), `GET/POST/DELETE /files/:name`. Names are sanitized against path tricks; uploads cap at 25 MB. The route handlers were exercised with a mock R2 bucket: auth rejection, upload/list/download round-trip, traversal sanitization, and delete all verified.
- **Preview behavior:** with `SITE.workerUrl` empty the vault section shows an "activates on deploy" note instead of a dead interface. Setup: WORKER.md ("File vault") and DEPLOYMENT.md step 5c.

---

*This handoff reflects the state of `dburich24.html` at the time of writing. When in doubt, the file is the source of truth — read it, don't guess.*

## Adding new content (chronological by design)

The site computes display order at load, so source placement never matters:
certificates and letters sort via certKey/sortCerts, experience via expSpan/sortExperience
(end date first, Present on top, primary:true pins the main current role).

The workflow: unlock admin via the **Site Administration** menu item, open the **Site Updates** workspace, choose Work Experience,
Certificate, or Letter of Appreciation, fill the form, and copy the generated block.
It shows a placement preview of exactly where the entry will appear. Paste the block
anywhere inside the EXPERIENCE or CERTS array in dburich24.html and redeploy.
For certificates with a PDF, also add the file itself per the DEPLOYMENT checklist
(source PDF in /assets/certs/ plus the embedded viewer image pipeline).

## HypeTeen fileset convention

Learning apps are baked into this fileset as siblings of the portfolio, not embedded in it:
`hypeteen/learning/<app>/index.html`, linked by relative URL in HT_APPS and opened in a new tab.
Av8Hype is the first one in. To add the next app, drop its compiled single-file HTML at
`hypeteen/learning/<name>/index.html` and paste the relative path into its HT_APPS url.
