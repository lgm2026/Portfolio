# dburich24 — Cloudflare Worker (`worker.js`)

The Worker is the production backend for the site. It does three things:

- `POST /tailor` — powers **Custom Tailoring**. It takes the job posting (a URL and/or pasted text) plus the candidate profile, fetches the URL server-side when only a URL is provided, calls Claude, and returns the tailored role/cert selection and cover letter as JSON.
- `POST /contact` — receives the Contact tab submission (honeypot-guarded) so you can relay it to email.
- `/files` routes — the **Cloud Vault** behind the Access Files tab: upload, list, download, and remove your personal documents from any device, stored in an R2 bucket.

The Anthropic key lives only in the Worker as a secret. The browser never sees it.

---

## 1. Prerequisites

- A Cloudflare account.
- `npm i -g wrangler` and `wrangler login`.
- An Anthropic API key.

## 2. Project files

Put `worker.js` in a folder with a `wrangler.toml`:

```toml
name = "dburich24-api"
main = "worker.js"
compatibility_date = "2024-11-01"

[vars]
ALLOWED_ORIGIN = "https://dbmb.io"   # your production origin; locks CORS
CONTACT_TO = "you@yourdomain.com"          # inbox for the contact relay (optional)

[[r2_buckets]]
binding = "FILES"                          # the Cloud Vault bucket (Access Files tab)
bucket_name = "dburich24-files"
```

Create the bucket once: `wrangler r2 bucket create dburich24-files`

## 3. Secrets

```bash
wrangler secret put ANTHROPIC_API_KEY
# paste your key when prompted

wrangler secret put FILES_KEY
# choose a strong passphrase for the Cloud Vault.
# This is NOT the site access key. The site key is visible in the page source;
# the vault key exists only in the Worker and in your head. Anyone with it can
# read and write your private documents, so make it long and don't reuse it.
```

(If you wire the contact relay to a provider, add its key too, e.g. `wrangler secret put RESEND_KEY`.)

## 4. Deploy

```bash
wrangler deploy
```

Wrangler prints the Worker URL, e.g. `https://dburich24-api.<your-subdomain>.workers.dev`. Use a custom route/subdomain (e.g. `https://api.dbmb.io`) if you prefer.

## 5. Point the app at it

In `dburich24.html`, set:

```js
SITE.workerUrl = "https://api.dbmb.io";   // no trailing slash needed
```

With `workerUrl` set, Custom Tailoring routes through the Worker and the result badge reads **Cloudflare Worker**. Leave it blank during local testing to use the direct Claude call (in the live preview) or the offline demo.

## 6. Wire the contact relay (optional)

`handleContact` in `worker.js` validates the fields and drops honeypot hits, then returns `{ ok: true }`. To actually deliver mail, uncomment the example block and use your provider. A Resend example is included inline. Then update the Contact tab's submit handler in the app to `POST ${SITE.workerUrl}/contact`.

---

## Endpoint contracts

### `POST /tailor`

Request:
```json
{
  "jobUrl": "https://…",
  "jobText": "full posting text (optional; preferred when available)",
  "company": "optional",
  "position": "optional",
  "profile": { "roles": [ … ], "certifications": [ … ], "education": [ … ] }
}
```

Response:
```json
{
  "result": {
    "company": "",
    "position": "",
    "summary": "",
    "roleIds": ["c1","e3", …],
    "certTitles": ["…"],
    "coverBody": "Dear Hiring Team,\n\n…"
  }
}
```

`roleIds` reference the `id` values in the app's experience data; `certTitles` are exact certification titles. The app renders the tailored résumé and letterhead cover letter from these.

### `POST /contact`

Request: `{ "name": "", "email": "", "message": "", "website": "" }` (the `website` field is a hidden honeypot; if filled, the submission is silently accepted and dropped). Response: `{ "ok": true }`.

---

## Notes

- The model is set to `claude-sonnet-4-6` in `worker.js`. Change `MODEL` there if needed.
- The Worker trims fetched pages to plain text and caps length to keep the prompt bounded.
- CORS defaults to `*` if `ALLOWED_ORIGIN` is unset — set it in production.
- The system prompt instructs the model to never invent facts and to select only from the provided profile, matching the in-app engine.

---

## File vault endpoints

All four require the `x-files-key` header matching `FILES_KEY`. If `FILES_KEY` is unset the vault answers 401 to everything (closed by default).

| Route | Does |
|---|---|
| `GET /files` | Lists stored documents (name, size, upload date) |
| `GET /files/:name` | Downloads one document |
| `POST /files/:name` | Uploads (raw request body, 25 MB max, name is sanitized) |
| `DELETE /files/:name` | Removes one document |

The Access Files tab drives all of this. Unlock the tab with the site key, then open the Cloud Vault with the vault key. The vault key is held in memory only, never stored in the page, so you re-enter it per visit. That's intentional.
