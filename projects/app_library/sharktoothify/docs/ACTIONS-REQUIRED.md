# ✅ ACTIONS REQUIRED — SharkToothify v1.0.0 Go-Live

Everything code-side is **done**. These are the steps only you can perform
(accounts, keys, payments). Work top-to-bottom · **~75–90 minutes total**.
Deep detail lives in `SETUP-GUIDE.md`; this is the condensed runbook.

---

## A. Accounts (≈10 min)
- [ ] **Anthropic** — console.anthropic.com → create key `sharktoothify-prod` → **Settings → Limits: set a monthly spend cap** (e.g. $50)
- [ ] **Stripe** — stripe.com account (stay in **Test mode** until step G)
- [ ] **Cloudflare** — free account

## B. Stripe: create 8 Payment Links (≈25 min) — *Guide Part 1*
**Analysis packs (3)** — products at **$4.99 / $9.99 / $99.99**, one Payment Link each:
- [ ] After-payment redirect (exact, braces included):
      `https://sharktoothify.us/?session_id={CHECKOUT_SESSION_ID}`
- [ ] Metadata key `credits` = **1 / 3 / 50** respectively

**Tip Jar (5)** — no redirect/metadata needed:
- [ ] Fixed-price links: **$2, $5, $10, $25**
- [ ] One **"Customers choose what to pay"** link with **Minimum = $2.00**

## C. Deploy the AI backend (≈10 min) — run inside `worker/`
```
npx wrangler login
npx wrangler kv namespace create CREDITS      # paste the printed id into wrangler.toml
npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler secret put STRIPE_SECRET_KEY     # sk_test_… for now
npx wrangler deploy                           # note the printed URL
```

## D. Paste 9 values into `site/SharkToothIdentifier.jsx` (≈5 min)
Search the file for `REPLACE` — exactly nine slots:
- [ ] `AI_BACKEND.workerUrl` ← your Worker URL from step C
- [ ] `AI_BACKEND.packs[0..2].link` ← the 3 pack links
- [ ] `TIP_LINKS.t2 / t5 / t10 / t25 / custom` ← the 5 tip links

## E. Domain & email (≈15 min) — *Guide Part 7*
- [ ] Cloudflare → **Add site** `sharktoothify.us` → switch nameservers at your registrar
- [ ] **Email Routing** → create `updates@sharktoothify.us` → forward to your inbox → verify
      *(required — it's printed in your Terms, Privacy Policy & DMCA notice)*

## F. Deploy the website (≈5 min)
- [ ] Cloudflare → **Workers & Pages → Create → Pages → Upload assets** → drag the **contents of `site/`**
- [ ] Custom domains: `sharktoothify.us` + `www` (redirect to apex)
- [ ] Confirm `worker/wrangler.toml` `ALLOWED_ORIGIN = "https://sharktoothify.us"` (it ships that way) — if you changed it, `npx wrangler deploy` again

## G. Test-flight, then GO LIVE (≈25 min) — *Guide Part 5 checklist*
- [ ] Full test pass with card `4242 4242 4242 4242` (consent → free daily analysis → countdown → tip picker → 1-pack purchase → replay guard → offline install → backup)
- [ ] Flip Stripe to **Live**, recreate the 8 links live, paste them in, `wrangler secret put STRIPE_SECRET_KEY` with `sk_live_…`, redeploy Worker + re-upload the JSX
- [ ] One real **$4.99** purchase on your own phone · quick iPhone + Android pass
- [ ] 🎉 **Announce** — the in-app 📣 Share button is your launch tool

## H. Launch week
- [ ] Google Search Console → add `sharktoothify.us` → submit `/sitemap.xml`
- [ ] **Legal filings** (Checklist Phase 9): pick the owner entity → copyright.gov (~$65) → USPTO trademark → attorney pass (arbitration clause + NC venue + consent flow)
- [ ] Optional: enable Plausible (one uncomment in `index.html`)

## Later, on your schedule
- [ ] **Shopify** (Phase 10): publish via Lovable → CNAME `shop.sharktoothify.us` → Storefront token → set `SHOP_ENABLED = true` → re-upload
- [ ] **App stores** (Phases 11–14): decide the IAP path first; your privacy URL is already live at `https://sharktoothify.us/privacy.html`; Play's 12-tester/14-day clock starts early

---
*Bundle contents are final: zero API keys in the client, daily-free + $4.99/$9.99/$99.99 packs, $2 tip minimum, consent-gated Terms v3/Privacy/Disclaimers, hardened Worker, full icon set, SEO + policy pages. Ship it.* 🦈
