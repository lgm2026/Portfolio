/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  SharkToothify AI Backend — Cloudflare Worker
 * ═══════════════════════════════════════════════════════════════════════════
 *  Holds the Anthropic API key server-side and meters AI tooth analyses.
 *  The app never contains any API key.
 *
 *  MONETIZATION MODEL
 *    • 1 FREE analysis per device every FREE_INTERVAL_HOURS (default 24 h)
 *    • Paid packs via Stripe Payment Links: 1/$4.99 · 3/$9.99 · 50/$99.99
 *
 *  ROUTES
 *    POST /v1/identify   Run one analysis (credit token, else daily free)
 *    GET  /v1/free       Daily-free status for a device
 *    POST /v1/claim      Redeem a Stripe Checkout session → credits
 *    GET  /v1/balance    Current balance for a token
 *
 *  REQUIRED BINDINGS (see wrangler.toml + SETUP-GUIDE.md)
 *    KV namespace : CREDITS
 *    Secrets      : ANTHROPIC_API_KEY, STRIPE_SECRET_KEY
 *    Vars         : ALLOWED_ORIGIN, FREE_INTERVAL_HOURS, MAX_TOKENS_CAP,
 *                   ALLOWED_MODEL, PRICE_MAP
 *
 *  PRICE_MAP maps Stripe amount_total (cents) → credits, as a fallback when a
 *  Payment Link has no `credits` metadata. Example: "499:1,999:3,9999:50"
 * ═══════════════════════════════════════════════════════════════════════════
 */

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const cors = corsHeaders(req, env);
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    try {
      if (url.pathname === "/v1/identify" && req.method === "POST") return await identify(req, env, cors);
      if (url.pathname === "/v1/free"     && req.method === "GET")  return await freeStatus(req, env, cors, url);
      if (url.pathname === "/v1/claim"    && req.method === "POST") return await claim(req, env, cors);
      if (url.pathname === "/v1/balance"  && req.method === "GET")  return await balance(req, env, cors);
      return json({ error: { type: "not_found", message: "Unknown route." } }, 404, cors);
    } catch (e) {
      return json({ error: { type: "server_error", message: e.message || "Server error." } }, 500, cors);
    }
  },
};

/* ── helpers ──────────────────────────────────────────────────────────────── */
function corsHeaders(req, env) {
  const origin = req.headers.get("Origin") || "";
  const allowed = (env.ALLOWED_ORIGIN || "*").split(",").map(s => s.trim());
  const ok = allowed.includes("*") || allowed.includes(origin);
  return {
    "Access-Control-Allow-Origin": ok ? (allowed.includes("*") ? "*" : origin) : "null",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Device-Id",
    "Access-Control-Expose-Headers": "X-Credits-Remaining,X-Free-Next",
    "Vary": "Origin",
  };
}
function json(obj, status, cors, extra) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...cors, ...(extra || {}) },
  });
}
function bearer(req) {
  const h = req.headers.get("Authorization") || "";
  return h.startsWith("Bearer ") ? h.slice(7).trim() : null;
}
function deviceIdOf(req, url) {
  const h = (req.headers.get("X-Device-Id") || (url && url.searchParams.get("device_id")) || "").trim();
  return /^[A-Za-z0-9-]{8,64}$/.test(h) ? h : null;
}
function freeIntervalMs(env) {
  return Math.max(1, parseInt(env.FREE_INTERVAL_HOURS || "24", 10)) * 3600 * 1000;
}
async function getTok(env, token) {
  if (!token || !token.startsWith("stk_")) return null;
  const raw = await env.CREDITS.get("tok:" + token);
  return raw ? JSON.parse(raw) : null;
}
async function putTok(env, token, data) {
  await env.CREDITS.put("tok:" + token, JSON.stringify(data));
}
function newToken() {
  return "stk_" + crypto.randomUUID().replace(/-/g, "");
}
async function callAnthropic(env, body) {
  // Model + token guardrails: a tampered client can't change model or run up costs.
  body.model = env.ALLOWED_MODEL || "claude-sonnet-4-20250514";
  const cap = parseInt(env.MAX_TOKENS_CAP || "8000", 10);
  body.max_tokens = Math.min(parseInt(body.max_tokens || cap, 10) || cap, cap);
  body.stream = false;
  const up = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });
  return { ok: up.ok, status: up.status, text: await up.text() };
}

/* ── POST /v1/identify ────────────────────────────────────────────────────── */
async function identify(req, env, cors) {
  // Abuse guards: payload size cap, request-shape validation, per-caller rate limit.
  const clen = parseInt(req.headers.get("Content-Length") || "0", 10);
  if (clen > 9_500_000) {
    return json({ error: { type: "bad_request", message: "That image is too large — try a smaller photo." } }, 413, cors);
  }
  let body;
  try { body = await req.json(); } catch { return json({ error: { type: "bad_request", message: "Invalid JSON body." } }, 400, cors); }
  if (!body || !Array.isArray(body.messages) || body.messages.length === 0 || body.messages.length > 8) {
    return json({ error: { type: "bad_request", message: "Invalid request." } }, 400, cors);
  }
  const caller = bearer(req) || deviceIdOf(req) || req.headers.get("CF-Connecting-IP") || "anon";
  const bucket = Math.floor(Date.now() / 60000);
  const rlKey = "rl:" + caller + ":" + bucket;
  const usedRl = parseInt((await env.CREDITS.get(rlKey)) || "0", 10);
  const rlCap = parseInt(env.RATE_PER_MIN || "6", 10);
  if (usedRl >= rlCap) {
    return json({ error: { type: "rate_limit_error", message: "Too many requests — please wait a minute and try again." } }, 429, cors);
  }
  await env.CREDITS.put(rlKey, String(usedRl + 1), { expirationTtl: 120 });

  // Path 1 — paid credits
  const token = bearer(req);
  const rec = token ? await getTok(env, token) : null;
  if (rec && (rec.credits | 0) > 0) {
    const up = await callAnthropic(env, body);
    let remaining = rec.credits;
    if (up.ok) {
      remaining = Math.max(0, (rec.credits | 0) - 1);
      rec.credits = remaining;
      rec.used = (rec.used | 0) + 1;
      rec.lastUsed = Date.now();
      await putTok(env, token, rec);
    }
    return new Response(up.text, {
      status: up.status,
      headers: { "Content-Type": "application/json", ...cors, "X-Credits-Remaining": String(remaining) },
    });
  }

  // Path 2 — one free analysis per device per interval
  const dev = deviceIdOf(req);
  if (dev) {
    const interval = freeIntervalMs(env);
    const last = parseInt((await env.CREDITS.get("free:" + dev)) || "0", 10);
    const now = Date.now();
    if (!last || now - last >= interval) {
      const up = await callAnthropic(env, body);
      let nextAt = last ? last + interval : now; // unchanged unless success
      if (up.ok) {
        await env.CREDITS.put("free:" + dev, String(now));
        nextAt = now + interval;
      }
      return new Response(up.text, {
        status: up.status,
        headers: { "Content-Type": "application/json", ...cors, "X-Free-Next": String(nextAt), "X-Credits-Remaining": String((rec && rec.credits) | 0) },
      });
    }
    const nextAt = last + interval;
    return json(
      { error: { type: "free_used", message: "Today's free analysis has been used on this device.", next_at: nextAt } },
      402, cors, { "X-Free-Next": String(nextAt) }
    );
  }

  return json({ error: { type: "payment_required", message: "No analysis credit available for this request." } }, 402, cors);
}

/* ── GET /v1/free?device_id=… ─────────────────────────────────────────────── */
async function freeStatus(req, env, cors, url) {
  const dev = deviceIdOf(req, url);
  if (!dev) return json({ error: { type: "bad_request", message: "Missing device_id." } }, 400, cors);
  const interval = freeIntervalMs(env);
  const last = parseInt((await env.CREDITS.get("free:" + dev)) || "0", 10);
  const now = Date.now();
  const available = !last || now - last >= interval;
  return json({ available, next_at: available ? now : last + interval, interval_hours: interval / 3600000 }, 200, cors);
}

/* ── POST /v1/claim  {session_id, existing_token?} ────────────────────────── */
async function claim(req, env, cors) {
  let b; try { b = await req.json(); } catch { b = {}; }
  const sid = (b.session_id || "").trim();
  if (!/^cs_(test_|live_)?[A-Za-z0-9]+$/.test(sid)) {
    return json({ error: { type: "bad_request", message: "Missing or invalid session_id." } }, 400, cors);
  }
  if (await env.CREDITS.get("claimed:" + sid)) {
    return json({ error: { type: "already_claimed", message: "This purchase was already redeemed on a device." } }, 409, cors);
  }
  const sres = await fetch("https://api.stripe.com/v1/checkout/sessions/" + encodeURIComponent(sid), {
    headers: { Authorization: "Bearer " + env.STRIPE_SECRET_KEY },
  });
  const sess = await sres.json();
  if (!sres.ok) return json({ error: { type: "stripe_error", message: (sess.error && sess.error.message) || "Couldn't verify the purchase." } }, 400, cors);
  if (sess.payment_status !== "paid") {
    return json({ error: { type: "unpaid", message: "That checkout hasn't been paid." } }, 402, cors);
  }
  let credits = parseInt((sess.metadata && sess.metadata.credits) || "0", 10);
  if (!credits) {
    const map = Object.fromEntries((env.PRICE_MAP || "").split(",").filter(Boolean).map(p => p.split(":").map(s => s.trim())));
    credits = parseInt(map[String(sess.amount_total)] || "0", 10);
  }
  if (!credits) return json({ error: { type: "unmapped_price", message: "Purchase verified but no credit amount is configured for it. Email support." } }, 422, cors);

  let token = (b.existing_token || "").trim();
  let rec = await getTok(env, token);
  if (!rec) { token = newToken(); rec = { credits: 0, used: 0, created: Date.now() }; }
  rec.credits = (rec.credits | 0) + credits;
  rec.lastClaim = sid;
  await putTok(env, token, rec);
  await env.CREDITS.put("claimed:" + sid, token);
  return json({ token, credits: rec.credits, added: credits }, 200, cors);
}

/* ── GET /v1/balance ──────────────────────────────────────────────────────── */
async function balance(req, env, cors) {
  const rec = await getTok(env, bearer(req));
  if (!rec) return json({ error: { type: "invalid_token", message: "Unknown token." } }, 401, cors);
  return json({ credits: rec.credits | 0, used: rec.used | 0 }, 200, cors);
}
