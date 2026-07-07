# 🦈 SharkToothify — Master Launch Checklist

One source of truth from here to live. Work top-to-bottom; each phase lists its time cost and what it unblocks. Detailed how-tos live in **SETUP-GUIDE.md** (referenced as *Guide P#*).

**Legend:** ⬜ to-do · 🔶 decision needed · ✅ already done (built & verified in the codebase)

---

## ✅ Phase 0 — Already done (the build)

- ✅ App feature-complete: **daily free AI analysis** (1 per device / 24 h) + **$4.99 · $9.99 · $99.99 analysis packs** — zero API keys anywhere in the app; Hunt Planner, Beaches, share cards, collection tracker, backup/restore, PWA + offline, install banner, update-ready pill, error boundary
- ✅ **Welcome screen with required acknowledgement** on first launch (Terms pointer included)
- ✅ 🛍 Shop gated behind `SHOP_ENABLED` ("Coming Soon" until the store ships); ☕ **Tip Jar amount picker** built in-app ($2 suggested · $5 · $10 · $25 · name-your-price, $2 app-wide minimum) — activates the moment the Stripe links are pasted
- ✅ **Legal Center**: consent gate with required acceptance language + tabbed **Terms of Service v3** (assumption of risk, AI disclaimer, warranties, liability cap, indemnification, **binding arbitration + class waiver with 30-day opt-out**, NC governing law, force majeure, severability), **Privacy Policy** (GDPR/CCPA, cookies, children, processors), and **Disclaimers + data/OSS credits** (incl. required © OpenStreetMap attribution)
- ✅ Public **terms.html + privacy.html** pages generated (app-store privacy URL: `https://sharktoothify.us/privacy.html`)
- ✅ Worker hardened: per-caller **rate limiting**, 9.5 MB payload cap, request-shape validation
- ✅ **DB maker's mark** integrated (consent screen, Legal Center header, Settings → About, boot screen, error fallback, policy pages) — core Sharktoothify brand untouched
- ✅ Accessibility touches: `prefers-reduced-motion`, `:focus-visible`, dialog roles/labels on legal & consent surfaces
- ✅ Cloudflare Worker (`worker.js`) + `wrangler.toml` written and syntax-checked
- ✅ Website shell: `index.html` (SEO copy + JSON-LD + canonical), `manifest.webmanifest`, `sw.js`, `robots.txt`, `sitemap.xml`
- ✅ Legal: Terms v2.0 (copyright/trademark/license/enforcement/NOAA/purchases/NC law), © notices on hero, Settings, source, HTML
- ✅ Domain migrated everywhere to **sharktoothify.us** (zero old references, mount-test passed)
- ✅ Runtime-verified: 14/14 smoke checks, loader pipeline proof

---

## ⬜ Phase 1 — Accounts & assets (~1 hr, do anytime, blocks everything)

- ⬜ Anthropic Console: production key named `sharktoothify-prod` + **monthly spend cap** (e.g. $50) — *Guide 2.1*
- ⬜ Stripe account (work in **Test mode** first)
- ⬜ Cloudflare account (free tier covers everything)
- ⬜ Icons from the badge logo → `/icons/`: `icon-192.png`, `icon-512.png`, `maskable-512.png` (~20% safe padding), `icon-180.png`, `og-card.png` (1200×630)
- ⬜ Optional: Plausible account for `sharktoothify.us`

## ⬜ Phase 2 — Stripe (test mode) (~20 min) — *Guide P1*

- ⬜ 3 products: 1/$4.99 · 3/$9.99 · 50/$99.99
- ⬜ 3 Payment Links, each with: redirect → `https://sharktoothify.us/?session_id={CHECKOUT_SESSION_ID}` **and** metadata `credits` = 1/3/50
- ⬜ Tip Jar: **five** Payment Links — fixed $2/$5/$10/$25 + one "customers choose price" with **minimum $2** (app-wide $2 minimum)
- ⬜ Copy the **test** secret key (`sk_test_…`)

## ⬜ Phase 3 — AI backend deploy (~15 min) — *Guide P2*

- ⬜ `npx wrangler login` → `npx wrangler kv namespace create CREDITS` → paste id into `wrangler.toml`
- ⬜ `npx wrangler secret put ANTHROPIC_API_KEY` and `STRIPE_SECRET_KEY`
- ⬜ `npx wrangler deploy` → note the Worker URL
- ⬜ Optional: custom domain `api.sharktoothify.us` (requires Phase 5 zone)

## ⬜ Phase 4 — Wire the app config (~5 min)

Paste into the top of `SharkToothIdentifier.jsx` (the `REPLACE_*` slots):

- ⬜ `AI_BACKEND.workerUrl` ← Phase 3 URL
- ⬜ `AI_BACKEND.packs[0..2].link` ← Phase 2 pack links
- ⬜ `TIP_LINKS.*` ← the five tip links (the ☕ picker goes live automatically; Shop stays off until Phase 10)
- ⬜ `EXTERNAL_LINKS.coffee` ← tip-jar link
- ⬜ *(Later, Phase 10)* `SHOPIFY.domain` + `storefrontToken` + `collectionHandle`

## ⬜ Phase 5 — Domain & email (~15 min) — *Guide P7*

- ⬜ Add `sharktoothify.us` zone to Cloudflare → switch nameservers at the registrar
- ⬜ **Email Routing**: create `updates@sharktoothify.us` → forward to your inbox → verify. **Required** — it's printed in your Terms & DMCA notice
- ⬜ Hold the `shop.` CNAME for Phase 10

## ⬜ Phase 6 — Website deploy (~15 min) — *Guide P4 + P7.6*

- ⬜ Folder: `index.html`, `SharkToothIdentifier.jsx`, `sw.js`, `manifest.webmanifest`, `terms.html`, `privacy.html`, `robots.txt`, `sitemap.xml`, `/icons/` (incl. `db-monogram.png`)
- ⬜ Cloudflare **Pages → Upload assets** → custom domains `sharktoothify.us` + `www` (redirect to apex)
- ⬜ Confirm `ALLOWED_ORIGIN = "https://sharktoothify.us"` in `wrangler.toml` → `npx wrangler deploy` once more
- ⬜ Google Search Console: add property → submit `https://sharktoothify.us/sitemap.xml`
- ⬜ Optional: uncomment the Plausible `<script>` line in `index.html`

## ⬜ Phase 7 — Test flight (Stripe TEST mode) (~30 min) — *Guide P5 checklist*

- ⬜ Run the full Part 5 checklist (consent → free daily analysis → same-day retry shows countdown + $4.99 offer → ☕ tip picker ($2 suggested, $2 min) → buy 1-pack with `4242` → 🎉 toast → replay-guard → Shop/Tip "Coming Soon" → Hunt Planner via Venice → install + airplane-mode → backup round-trip → share card)
- ⬜ New since that list was written: install banner appears (Android/desktop + iOS hint), 📣 Share button works, Terms opens from hero © and Settings → About & Legal

## ⬜ Phase 8 — GO LIVE (~30 min)

- ⬜ Stripe → Live mode: recreate the 3 pack links + tip link, paste **live** links into the JSX
- ⬜ `npx wrangler secret put STRIPE_SECRET_KEY` with `sk_live_…` → redeploy Worker
- ⬜ Re-upload Pages with the final JSX
- ⬜ One real-money $4.99 purchase on your own phone (then refund it in Stripe if you like — the credit stays, your call)
- ⬜ Real-device pass: one iPhone, one Android
- ⬜ 🎉 Announce — the 📣 Share button is your launch tool

## ⬜ Phase 9 — Legal filings (week of launch) — *Guide P8*

- 🔶 **Decide the legal owner name FIRST — it drives every filing below.** The app currently displays **"SharktoothifyUS"** as the copyright/trademark holder (source header, in-app Terms, hero ©, Settings, index.html, JSON-LD `Organization`). Pick what you'll actually register under:
  - **Your personal legal name** (simplest; you own it as an individual)
  - **An LLC** (e.g. "Sharktoothify LLC" / "Sharktoothify US LLC") — better liability separation; form it *before* filing so the copyright/trademark are owned by the entity
  - The literal brand string **"SharktoothifyUS"** as a trade name — workable, but a registrar may ask for the underlying legal person/entity behind it
  - ⚠️ Whatever you choose, the **owner on the copyright + trademark must match** each other and your Stripe/Shopify business identity. If it differs from the displayed "SharktoothifyUS" brand, that's fine — brand name and legal owner can differ — just keep it intentional and consistent. If you want the in-app text to read differently from "SharktoothifyUS" (e.g. show your name or LLC), tell me and I'll update every surface in one pass.
- ⬜ Copyright registration at copyright.gov (~$65) — **before launch** maximizes statutory-damage rights · *owner = your Phase 9 decision*
- ⬜ USPTO trademark: "SHARKTOOTHIFY" word mark (+ logo), Class 9/42 · *applicant = same owner*
- ⬜ IP-attorney pass on the Terms — priority items: **arbitration + class-waiver enforceability** (AAA consumer rules, opt-out mechanics), the NC governing-law/venue clause, the consent-flow adequacy, and the owner-name/entity choice
- ⬜ Optional: DMCA agent registration ($6)

## ⬜ Phase 10 — Shopify store (whenever you publish via Lovable)

- ⬜ Publish the store; add `shop.sharktoothify.us` as its custom domain → create the CNAME in Cloudflare
- ⬜ Shopify admin → Develop apps → app with `unauthenticated_read_product_listings` → copy **Storefront token** — *Guide P3*
- ⬜ Paste `SHOPIFY.domain` + token (+ a "featured-in-app" `collectionHandle`), flip `SHOP_ENABLED = true` → re-upload Pages
- 💡 Token works **before** the store is public — you can preview the in-app grid behind Shopify's password page

---

# 📱 App Stores (recommended: 2–4 weeks after web launch)

## 🔶 Phase 11 — THE GATE DECISION: in-app purchases

**Read this first — it shapes everything below.** Apple (guideline 3.1.1) and Google (Play Billing policy) both **require their own payment systems for digital goods bought inside native apps**, at a 15–30% cut. Your Stripe pack links are perfect for the web but **cannot ship inside the store binaries**. Pick a path:

- 🔶 **Path A — RevenueCat IAP (recommended):** native builds sell the same 1/3/50 analysis packs through StoreKit/Play Billing (the free daily analysis is store-compliant as-is) via RevenueCat; a small new Worker route verifies the receipt and credits the same token system. Cleanest UX, fully compliant, ~a day of work. *(Say the word and I'll build the Worker route + client wiring.)*
- 🔶 **Path B — Web-only sales:** native builds hide pack purchases entirely (free manual ID, the free daily AI analysis, tide/hunt features, and restore-existing-credits). Compliant only if the app never directs users to buy externally. Zero new code, but weaker native monetization.

## ⬜ Phase 12 — Shared store prep (~half a day)

- ✅→⬜ Privacy policy URL: **already generated** (`privacy.html` ships in the bundle) — just deploy with Phase 6, then enter `https://sharktoothify.us/privacy.html` in both store listings
- ⬜ Store icons: 1024×1024 (iOS), 512×512 + 1024×500 feature graphic (Play)
- ⬜ 5–8 phone screenshots (ID result, Hunt Planner, Tide chart, Badges, Beaches make a great set)
- ⬜ Listing copy: name, subtitle/short description, full description, keywords
- ⬜ Capacitor wrap: `npm i @capacitor/core cli` → bundle the web files into `www/` → `npx cap add ios android`. Inside the native shell the files are local, so it's offline by default (no SW needed) — *I'll scaffold this when you're ready*
- ⬜ Permission strings: camera ("to photograph shark teeth for identification") + location-when-in-use ("to find your nearest tide station")

## ⬜ Phase 13 — Apple App Store

- ⬜ Apple Developer Program ($99/yr) — start early, verification can take days
- ⬜ Xcode build → TestFlight on your own iPhone
- ⬜ App Store Connect: listing, age rating (4+), privacy "nutrition label" (camera images sent for AI processing; coords to NOAA/NWS; no tracking), encryption-exempt declaration
- ⬜ Review notes: explain the free daily analysis so the reviewer can test AI; expect ~1–3 day review

## ⬜ Phase 14 — Google Play

- ⬜ Play Console ($25 one-time)
- ⬜ **Heads-up:** new personal developer accounts must run a closed test with **12 testers for 14 days** before production — start this clock early
- ⬜ Data-safety form (mirrors the Apple label), content rating questionnaire
- ⬜ Internal → closed → production rollout

---

### Critical-path summary
**Web live** = Phases 1→8 ≈ **one focused afternoon**. Store presence = Phases 11→14, gated by the 🔶 IAP decision and Play's 14-day test clock — which is exactly why web-first is the right call: you're earning on the site while the store pipelines run.
