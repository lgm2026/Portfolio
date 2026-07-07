# dburich24 — Changelog

## v1.2

### Production domain: dbmb.io
- Full domain swap from the dburich24.com placeholder to **dbmb.io**: SITE name, résumé contact line, PDF footer, worker URL example, Cloudflare ALLOWED_ORIGIN, and all documentation.
- Two inboxes established: **dustin@dbmb.io** (direct; drives every mailto on the hero, About, Contact, and the résumé header) and **contact@dbmb.io** (general no-reply inbox for suggestions and in-app correspondence; surfaced as its own "Suggestions & App Support" row on the Contact page and used as the worker relay's from address example).
- Historical CHANGELOG entries retain the old placeholder by design; live code and docs carry zero references to it.

### Project Portfolio restructured into three sections
- **App Library** leads with three cards: SharkToothify, Mobile Mechanic FreeRM, and Second Chance Toolkit, each showing Coming Soon until its link is pasted into APP_LIBRARY (search "PROJECTS CONFIG"). A See More button opens a full App Library page with all apps plus a More Coming Soon card.
- **Learning Tools** holds the HypeTeen Academy card, routing to the established Academy landing page.
- **Tunes** holds the AI Generated Music by DL Peli card, opening a media player page. Tracks are added via the TUNES list as YouTube or Spotify embeds (both supported, one line each); until then the page shows a friendly placeholder. Player: embedded frame plus a numbered track list with the active row highlighted.

### Hero contact info, See My Experience heading, nav reorder
- Contact moved to second in the navigation menu, right after About Me.
- Phone number and email now sit tastefully under the tagline on the About hero as tappable links with a gold underline accent, centered on mobile and left-aligned on desktop.
- A gold "See My Experience" subheading now introduces the General Résumé and View Experience buttons, with more breathing room after the short intro.

### Av8Hype launches everywhere, including previews
- The Study button now checks whether hypeteen/learning/av8hype/ is actually served. On the deployed site it opens the real file as before; in environments that do not carry the folder (like sandboxed previews), it decompresses an embedded gzip copy of the app in the browser and opens that instead, so the launch works either way. The window opens synchronously on the click, keeping popup blockers satisfied.
- Cost: the embedded fallback adds about 0.8MB to the portfolio file (now ~5.4MB). Verified headless: the embedded copy decompresses byte-identical to the shipped app file.

### Av8Hype baked into the fileset
- The complete AvHype Aviation Education app (1.9MB self-contained single file) now ships inside the package at hypeteen/learning/av8hype/index.html with its legal notices alongside. The Av8Hype card in HypeTeen Learning links to it by relative URL and opens in a new tab, so everything lives on one domain in one deploy.
- The card description now reflects the real scope: 501 lessons, arcade games, and the proctored Verify Knowledge mode.
- Learning card buttons now read "Study" instead of "Play," completing the earlier rename that had only covered the landing gate.

### Grand Strand title updated
- Grand Strand Youth Hockey role retitled to "Volunteer Head Coach / Program Manager" on the Experience card, the Hobbies snapshot, and the résumé's sports one-liner.

### Boot loading screen + favicon bug fix
- **Root cause of the "DB\" />" flash found and fixed:** the favicon link nested raw double quotes inside a double-quoted href, so browsers closed the attribute early and rendered the tag's tail as page text on every load. The favicon is now properly URL-encoded, which also makes the browser-tab icon work for the first time.
- **Boot monogram is the real site logo.** The loading screen shows a lightweight embedded copy of the actual corner logo, framed with the same gold border, rounded corners, and shadow as the masthead, so the slide-home animation hands off to its twin.
- **Proper boot screen added.** From the first painted frame, the page shows the gold DB monogram in a spinning ring with the Dustin Burich wordmark, centered on navy. When React mounts, the monogram slides up toward the top-left masthead position while the overlay fades out, then removes itself. Honors prefers-reduced-motion with a simple fade.

### Admin tabs consolidated into Site Administration
- Compile a Résumé, Access Files, and Site Updates left the hamburger menu; a single lock-gated **Site Administration** item replaced them. Unlocking (same key, and the About page unlock now lands here too) opens a hub with three tiles that route to the same three workspaces, untouched underneath. The menu is three items lighter.

### Grand Strand Youth Hockey bullet corrected
- "Run social media, sponsor coordination, and event planning" replaced with the accurate scope: "Manage communications, volunteer coordination, fundraising, and youth training across the entire program."

### MBFD and IceCats moved to the bottom of Professional Experience
- The Myrtle Beach Fire Department and PeeDee IceCats roles now carry a tail:true flag, and the automatic sort places tail entries at the bottom of the Experience list (chronological among themselves). New order: Opsgility, Grand Strand Youth Hockey, Navy tours newest to oldest, then MBFD and IceCats. The résumé's compact Sports Management section is unchanged.

### Summary popup placement fixed
- The "See a Short Summary" popup no longer tucks under the fixed masthead. It now centers in the viewport with a safe top offset, caps its height, and scrolls its own body internally so the header bar and close button stay on screen at all times, on desktop and mobile.

### Chronological ordering everywhere + Site Updates admin tab
- **Experience order is now computed, not hand-maintained.** The manual PRO_ORDER list is gone; entries sort automatically by end date (Present first), then start date, newest first. The primary current role carries primary:true to stay pinned on top. A new entry pasted anywhere in the EXPERIENCE array lands in the right chronological spot at load. Regression verified: the computed order exactly matches the previous hand-set order.
- **Letters of appreciation now sort newest-first** on the Acknowledgements page (they previously rendered in raw array order). Certificates were already auto-sorted on every page; that behavior is unchanged.
- **New admin tab: Site Updates** (lock-gated like Compile and Access Files, same access key). Pick Work Experience, Certificate, or Letter of Appreciation, fill the form, and it generates a paste-ready data block with a live placement preview ("card 5 of 12, right below X"). Copy button included. Paste the block anywhere inside EXPERIENCE or CERTS in dburich24.html and redeploy; ordering is automatic.
- Verified headless: experience order regression, ack letters descending, auto-placement of hypothetical new cert and experience entries, résumé still exactly two pages, Updates page renders locked and unlocked.

### Hero invitation added
- The front page intro now ends with a friendly nudge: "And don't be shy. Take a look around: my experience, projects, hobbies, and plenty more are all waiting in the menu at the top right of the page."

### HypeTeen Academy section opened
- Landing gates reordered: HypeTeen Learning now sits first with a Study eyebrow, HypeTeen Leisure second. Leisure copy reframed to "stories written to accompany your learning."
- The HypeTeen Academy project card now opens a full in-site subpage with two paths: **HypeTeen Leisure** (the book library) and **HypeTeen Learning** (the learning tools).
- Leisure lists five series (Flight Academy, Sea Exploration, Nature Conservation, Paleontology Research, Astronomy Studies), each opening a stacked six-card book list. Flight Academy Book 1, Balance Before Control, is wired for a free ad-supported PDF link plus an eventual softcover link; all other slots show Coming Soon states.
- Learning stacks five app cards in order: Av8Hype, SeaHype, TerraHype, PaleoHype, AstroHype, each launching its site once a URL is pasted into HT_APPS.
- Config lives at the top of the block (search "HYPETEEN CONFIG"): paste pdf and buy links per book, and url per learning app, as items go live. Empty strings render Coming Soon.
- Breadcrumb navigation back through Academy and Projects, keyboard operable gate tiles, mobile responsive stacking. No author byline appears anywhere in the section.

### Hockey roles joined Professional Experience
- The three hockey roles (Grand Strand Youth Hockey, MBFD Ice Hockey Team, PeeDee IceCats) now render as full cards on the Experience tab, placed after the current Opsgility role and ahead of the Navy tours. The Hobbies tab keeps its On and Off the Ice snapshot.
- The general résumé is unchanged by design: hockey stays a compact Sports Management one-liner section, and the resume generator now explicitly filters sports entries out of the full-entry list to prevent duplication. Regression verified: still exactly two pages, each sports title appears once.

### Sports roles expanded
- **Myrtle Beach Fire Department Ice Hockey Team** retitled to Operations and Social Media Manager; added the fundraiser coordination work that helped collect more than $15,000 toward firefighter cancer screenings, alongside content library and Facebook ownership.
- **PeeDee IceCats (FPHL) All-Access Intern** expanded to cover the automated tablet-based puck-in-play display system for fan entry and egress, the mid-season step-in as full-time mascot, and merchandising consultancy revenue growth, in addition to game-day operations work.
- General résumé regression: still exactly two pages; the longer title fits its one-line sports entry with room to spare.

 — Certificate viewer + Access Files

Viewer polish and a new private download tab. Transpile-verified; the download path was proven headless (valid PDFs built for a portrait cert, a landscape cert, and a multi-page transcript).

### Certificate viewer

- **Landscape certs no longer sideways.** The four FEMA ICS certificates (IS-100, IS-200, IS-700, IS-800) were stored rotated inside a portrait frame, so they showed on their side. Their embedded images are now rotated to upright landscape, so they read normally and fit the frame like every other cert.
- **Auto-fitting title.** The document title in the viewer header shrinks to stay on one line, and only wraps to a second line if staying on one would drop it below a legible size. No more single-word overflow.
- **Download from the viewer.** Each open certificate has a Download button in the header that saves it as a PDF.

### New tab: Access Files (admin-gated)

A private, key-locked tab for pulling your own documents on the go. It lists every certificate, award, letter, and transcript with a per-file Download button. In the live preview the PDFs are rebuilt from the embedded page images; on the deployed site the buttons pull the full-resolution originals from `/assets/certs/` automatically. Uses the same access key as the compiler.

### Cloud Vault (upload, now built)

The Access Files tab gained a **Cloud Vault**: drag-drop or tap to upload certificates and letters to an R2 bucket behind the Worker, list them, download from any device, remove them. Protected by its own `FILES_KEY` Worker secret (deliberately separate from the site key, which is visible in page source); the vault key is entered per visit and never stored. The Worker's `/files` routes (list, download, upload, delete) were verified against a mock R2 bucket: 12/12 checks passed, including auth rejection, filename sanitization, and byte-for-byte round-trip. With no `workerUrl` configured the section explains itself instead of pretending to work. Setup steps live in WORKER.md and DEPLOYMENT.md 5c.

### Front-page About expanded

- Three new paragraphs in Dustin's voice: coaching the youth roller hockey program he helped build plus the community thread, faith in Jesus as the anchor for how he leads and treats people, and the proudly maintained dad-lawn (fresh stripes, trusty New Balances, grass that outranks the street). The closing paragraph was deduplicated so hockey coaching isn't mentioned twice.
- Section retitled from "The Slightly Longer Version" to "The Good Stuff."
- **Accuracy and tone revisions:** the hockey copy no longer claims Dustin built the program from the ground up; he coaches and puts concentrated effort into growing the sport locally (front page and the Experience line item both corrected). The lawn paragraph was rewritten warm and friendly, dropping the competitive "outranks every other dad" angle.

### Executive tone pass across all experience

- **Every role's line items rewritten in an executive register** (factual, confident, no invented claims): Opsgility, all seven Navy tours, and all three sports roles. Bullet order preserved per role so the general résumé's `GEN_TOP2` picks stay aligned.
- **Opsgility corrected and completed.** The old "took ownership of an 18-week cohort" line undersold the record; it now states full end-to-end ownership of the entire program: 40 eighteen-week Cloud IT cohorts, more than 500 students over four years, averaging 32 program hours a week with every performance marker met, plus veteran career-reidentification delivery. The civilian translation line was strengthened to match.
- **Résumé professional summary upgraded** to lead with the combined record: nearly 12 years of decorated service plus four years of civilian program ownership with the cohort and student numbers up front.
- Regression-proven: résumé still exactly 2 pages (headless build plus visual pass), transpile clean, no em dashes in any new prose.

### About page rewrite + Experience summary popup

- **Front page (About) rewritten civilian-friendly.** Shorter hero intro plus two relaxed paragraphs in Dustin's voice, professional but human, with room to breathe. Section retitled "The Slightly Longer Version."
- **Original long-form story preserved.** The previous About copy (short and long) lives on as `SUMMARY_SHORT` / `SUMMARY_FULL`, lightly polished for tone, and is now reachable from a **See a Short Summary** button at the top of the Experience page. It opens in a popup that reuses the certificate viewer's modal shell (backdrop click and Escape both close it).
- No em or en dashes anywhere in the new prose.
- **Fix:** the popup body originally reused `.about-p`, whose cream text (styled for the dark About page) vanished on the popup's cream background, and it inherited cert-viewer padding. The popup now has its own classes: a gold-ruled formal lead blurb (`.sum-lead`), a 660px reading measure, dark body text, and mobile padding. The lead was rewritten as a confident, formal, credential-forward summary. Content verified by headless React render (lead + all four paragraphs present).

### Certificate orientation — full sweep

- **19 more landscape certs rotated upright in the viewer.** The earlier v1.2 fix covered only the four FEMA ICS certs; a full audit found 19 more landscape documents stored sideways in portrait frames: DB-Advantor-SysAd, DB-CENSEC-ATTRASUP, DB-CENSECFOR-NavyCorrections, DB-CENSECFOR-SRFA, DB-Coxswain, DB-EAWS, DB-ESWS, DB-EVOC, DB-HSBOps, DB-JBCTOP3, DB-JKO_JPME_, DB-NHTSA-DWI_SFST, DB-SAPR_Service_, DB-SAPR_Training_, DB-SIMBBC, DB-USDOL-ComputerOperator, DB-USDOL-PoliceOfficer, DB_Af-POI, DB_MA-ASchool.
- **Method:** every one of the 42 embedded page images was checked with a text-banding orientation detector and Tesseract OSD (four-way rotation probe), with ambiguous calls (EAWS, ESWS, Coxswain, St. Leo p1) settled by visual side-by-side comparison. DSAACP and St. Leo page 1 were detector false positives and are genuinely upright.
- **Downloads verified:** `downloadCertPDF` rebuilt correct PDFs headless from the rotated data — landscape pages for ESWS and USDOL Police Officer, portrait for DSAACP, four portrait pages for the JST — and the rebuilt ESWS PDF was rasterized and visually confirmed upright.
- Embedded image payload grew ~1.3 MB from re-encoding the rotated scans (JPEG q85).

### General résumé overhaul (2-page)

- **Hard 2-page target.** The general résumé now lays out to exactly two pages (verified headless against the shipped file). Previously four pages, one of which was almost entirely education and certifications.
- **Pre-2019 tours trimmed to their two most impactful bullets** — A School, NAS Oceana, CVN-77, and JB Charleston (2016–Aug 2019). The picks live in the `GEN_TOP2` map directly above `generateGeneralResume` and apply to the general résumé only; the site's Experience tab and both compilers still use the full record.
- **Certifications** render as a flowing paragraph ("Name (Issuer) · Name (Issuer) · …") instead of one bulleted line per cert.
- **Education and apprenticeships** compress to one line each: bold title with gray details on the same line, wrapping below only when too long. The JST line carries the 78 ACE-recommended credit hours.
- **Sports Management** compresses to one line per role (title — org, dates right-aligned), no bullets.
- **Contact header is a single line:** phone • email • portfolio site. `SITE.portfolio` currently holds the placeholder `dburich24.com`; the layout is sized for up to 20 characters. Location no longer appears on the résumé header.
- **LinkedIn removed everywhere** — from `SITE`, the résumé header, and the Contact tab.

### Full QA + polish pass

- **Loading spinner redesigned:** the monogram no longer tumbles; it now sits still inside a spinning gold arc on a circular border with an inner teal ring, echoing the corner monogram while reading unmistakably as a loading wheel.
- **Keyboard accessibility:** the masthead tabs (desktop and mobile), brand/home mark, burger menu, every certificate and letter "View ↗" link, and the compiler's mode switch are now keyboard-operable (Enter/Space) with proper roles, plus a site-wide gold `:focus-visible` outline.
- **Head/meta:** page title expanded, meta description, theme color, Open Graph tags, and an inline DB monogram favicon added; stale "v1.0 (Sandbox Build)" header comment corrected.
- **Copy fix:** a Hobbies card said "his own vehicles" on a first-person site; now "my own vehicles." All other hobby, page-lead, and note copy re-read for voice.
- **CSS hygiene:** removed a duplicated `.empty` rule; new file rows wrap properly on narrow phones; viewer download button shrinks on small screens.
- **Regression proofs re-run on the shipped file:** transpile clean, per-document PDF downloads verified headless (portrait cert, rotated FEMA landscape, 4-page JST — correct page counts and orientations), pen-name scan still zero.

### Deploy note

All 23 landscape source PDFs in `/assets/certs/` (the four FEMA certs plus the 19 listed above) should be rotated to upright the same way, so résumé attachments and Access Files downloads match the viewer. The in-app viewer is already fixed regardless of the source files.

## v1.1 — Custom Tailoring (job posting to tailored cover letter + résumé)

A new one-shot tailoring flow under **Compile a Résumé**, plus two experience edits and a footer fix. Everything was transpile-verified, and the new PDF output was proven headless and visually (cover letter and both résumé pages rasterized and checked).

### New feature: Custom Tailoring

The Compile page now opens on a **Custom Tailoring** tab (the hand-built pick-and-choose tool is still there under **Manual Compiler**). You give it a posting and get back a matched application:

- **Inputs:** optional company and position, a **job posting URL**, and a **paste-the-description** box. The paste box is what tailors the posting in the local preview; the URL is fetched server-side once the Worker is deployed.
- **Tailored cover letter** on your letterhead: the monogram sits top-left like real stationery, a gold rule under the header, your contact line, then the body, and a **real script signature** (an embedded, subset Great Vibes font) above your typed name. The signature and monogram are placed automatically.
- **Tailored résumé, capped at two pages.** It pulls only your real experience and certifications, selects and orders the most relevant roles, lists the most relevant certs, and fits everything to two pages with an automatic density/trim pass. Nothing is invented.
- **Editable result.** The drafted cover letter is fully editable before download, and you can choose to download the letter, the résumé, or both as one PDF.
- **Three engines, automatic fallback:** (1) your **Cloudflare Worker** in production (fetches the URL, calls Claude, returns the selection and letter); (2) a **direct Claude call** when no Worker is set, which works in the live preview so you can test real AI tailoring by pasting a description; (3) an **offline keyword-matching demo** when there is no network, so the layout and flow always work. The result panel shows which engine produced the draft.

A ready-to-deploy `worker.js` (with `/tailor` and `/contact`) and `WORKER.md` setup notes ship alongside the app. See DEPLOYMENT.md step 5.

### Experience edits

- **CVN-77 / VFA-31 tour:** added a leading bullet — *"Returned to NAS Oceana post-deployment as Master-at-Arms Second Class (E-5) from November 2014 to August 2016, leading a security shift and supervising a combined force that included 26 DoD civilian police officers."* (VFA-31 is home-based at Oceana; the squadron returned there post-deployment.) The DoD-officer supervision now lives here as an E-5 leadership credit.
- **NAS Oceana (junior) tour:** softened the base-security line to *"serving within a combined installation security force of 83 sailors."* The over-claimed "leading" was dropped, and the 26 DoD civilian police officers were relocated to the E-5 shift-lead bullet above so the number appears once, as a supervision credit at the right rank.

### Copy audit (owner write-up review)

Small wording changes from the owner's read-through:
- **About, para 2:** "crafting Challenge Coin displays after a shift carving wake in the Cooper River at the helm of a Harbor Security Boat…" (was "…to carving wake across the Cooper River from the helm…").
- **About, para 3:** "…somewhere on the road, chasing my dreams. I dream of becoming a pilot, though I enjoy spending as much time on or near the water as I can…" (was "…a half-planned trip. I'm working toward becoming a pilot, I love being on the water…").
- **Opsgility (c1):** "Supported 40 eighteen-week Cloud IT training cohorts and over 500 students…" (was "18+ training cohorts and hundreds of students").
- **USS Iwo Jima (e6) summary:** "Shipboard Anti-Terrorism Training Program Supervisor and security operations administrator…" (was "Senior training program supervisor…").
- **e6 discharge bullet:** "…to assume the custody and care of my children." (was "to take full custody of my children").
- **Joint Base Charleston (e3) summary:** "Installation Electronic Security Systems Manager and Joint-Service Liaison…" (was "Facility security systems manager and joint operations commander…").
- **CVN-77 ESWS/EAWS bullet:** "…reflecting exceptional knowledge and qualification attainment across shipboard and aviation warfare systems alike." (was "reflecting command of…").
- **CVN-77 training bullet:** "Expertly trained and qualified the next wave of the security force… ensuring a seamless transition."

### Fixes

- **Footer em-dash removed.** `SITE.pdfFooter` was `dburich24.com — v1.0`; it is now `dburich24.com · v1.1` (middot, matching the site footer separator). Prints on every generated PDF.
- **Fixed an italic-bullet bug in the tailored résumé.** When a role's bullets crossed a page break, the page footer left the font in an italic state and the continuation bullets rendered italic. The body font is now re-asserted after the footer and per bullet line.
- **Version bumped to v1.1** (`SITE.version` and the footer) to keep generated PDFs traceable.

### Note on the em-dashes in titles, awards, and certs

Those are an intentional label separator inside structured fields (e.g., *"Letter of Appreciation — 2012 FA-18 Mishap Response"*), not flowing body copy, so they were left as-is. Say the word if you want them swept to middots too.

---

## Previous session — accuracy audit + résumé engine fixes

A full accuracy pass over the résumé/experience content plus two functional fixes to the résumé engine. All changes were transpile-verified; the PDF generator was additionally proven headless.

### Functional fixes

- **Fixed the PDF download bug.** Downloads silently produced nothing because the blob URL was revoked on the line right after the click, cancelling the download. Introduced a shared `downloadBytes()` helper that delays the revoke by 30 seconds and, inside the sandboxed preview iframe, also opens the PDF in a new tab as a fallback. Both the compiler and the General Résumé now use it.
- **Added the General Résumé button.** The About tab now leads with a gold **General Résumé** button wired to a new `generateGeneralResume()` function that builds a complete, all-inclusive, formatted PDF (summary, full experience, sports, education, headline + supporting certs) in one click — separate from the pick-and-choose compiler. Verified to output a valid multi-page ~27 KB PDF.

### Content audit — corrections

- **Command Duty Officer material:** rewrote the Charleston bullet to "authored and implemented an end-to-end revision and accuracy update to the Command Duty Officer study and qualification material." Removed the incorrect "authored a controller study guide" claim.
- **Ceremonial Honors Program:** rewrote to "expertly administered the Joint Base Charleston Ceremonial Honors Program, managing 75+ personnel (including joint service) across 8 commands to render military honors at 100+ funerals and ceremonial functions over 24 months throughout the southeastern United States." Replaced the earlier "21 Sailors / 80+ funerals" numbers.
- **Hockey dates:** corrected all three roles to an October 2025 start (were wrongly 2018/2019/2021). Grand Strand Youth Hockey is ongoing; Myrtle Beach Fire Dept Hockey and PeeDee IceCats both closed May 2026.
- **Myrtle Beach Fire Dept Hockey role:** retitled from "Operations Manager" to "Social Media Manager" and rewrote the line to reflect running the team's Facebook page.
- **NTAG community events:** corrected "220+" to "22".
- **CVN-77 deployment:** removed the "5th and 6th Fleet areas" phrasing in favor of "nine-month overseas deployment supporting combat operations."
- **Misattributed carrier bullets moved to NAS Oceana:** the 10,500-acre / 83-sailor base-security bullet and the eight-page Desk Sergeant standardization-guide bullet were moved from the carrier entry to the Oceana (shore installation) entry, where acreage and tenant commands belong.
- **Air shows:** changed the single "2011 NAS Oceana Air Show" reference to "multiple NAS Oceana air shows."
- **"A" School entry:** added the opening progression — "Began Navy service with Recruit Training, advancing to Master-at-Arms 'A' School in September 2010" — so the Jul–Nov 2010 span reads correctly.
- **Guam:** corrected to "Advanced to Petty Officer First Class (E-6) during this tour."
- **Discharge line pronoun:** fixed "his children" to "my children."

### Content audit — structure & de-duplication

- **Top 3 Certificate of Achievement** was appearing twice (Charleston awards *and* the credentials grid). Flagged it `ack:true` so it renders once, on the Acknowledgements tab under "Letters & Recognition," while staying attachable in the compiler. Removed it from the Charleston awards list (which now shows the three medals only).
- **Acknowledgements section** heading updated to "Letters & Recognition"; lead copy updated accordingly.
- **Letter-of-appreciation references removed from the Oceana bullets** (those live on the Acknowledgements tab now).

### Language pass

Rewrote the experience bullets across every role — Opsgility, all six Navy tours, and the hockey roles — to read as professional but human accomplishments rather than dry stat-dumps, while preserving the quantified impact. Removed redundant "earned certification X" filler bullets (certs have their own grid).

### Open flag carried forward

The relocated "leading a force of 83 sailors and 26 DoD civilian police officers" line now sits in the junior-enlisted Oceana entry. It's accurate to the installation secured; framing can be softened if it reads as over-scoped for the rank — owner's decision.
