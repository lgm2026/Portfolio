const MODEL = "claude-sonnet-4-6";

const SYSTEM_PROMPT = [
  "You tailor Dustin Burich's real résumé and write his cover letters for a specific job posting.",
  "You are given his complete verified experience and certifications as JSON, plus the posting.",
  "Rules:",
  "1. Never invent facts, employers, dates, numbers, titles, or skills. Only select, prioritize, and lightly rephrase from the provided material.",
  "2. Choose the roles and certifications most relevant to the posting. Return role ids exactly from the provided list, and certification titles exactly as written. Select enough to fill about two pages, no more.",
  "3. Write the cover letter in Dustin's first-person voice: confident, plain, and human. It must begin with a salutation and end with its final paragraph. Do NOT add a closing, signature, or date, those are added automatically. No em dashes. No en dashes. No AI-sounding filler.",
  "4. Write a 2 to 3 sentence professional summary tailored to the posting, using only his real background.",
  "5. Output STRICT JSON only. No markdown, no backticks, no commentary. Match this shape exactly:",
  '{"company":"","position":"","summary":"","roleIds":[],"certTitles":[],"coverBody":""}',
  "coverBody uses \\n for line breaks."
].join("\n");

function corsHeaders(env) {
  const origin = env && env.ALLOWED_ORIGIN ? env.ALLOWED_ORIGIN : "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-files-key",
    "Access-Control-Max-Age": "86400"
  };
}

function json(obj, status, env) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: Object.assign({ "Content-Type": "application/json" }, corsHeaders(env))
  });
}

function htmlToText(html) {
  let t = html || "";
  t = t.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ");
  t = t.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
  t = t.replace(/\s+/g, " ").trim();
  return t.slice(0, 12000);
}

function parseJSON(text) {
  let t = (text || "").replace(/```json/g, "").replace(/```/g, "").trim();
  const s = t.indexOf("{"), e = t.lastIndexOf("}");
  if (s >= 0 && e > s) t = t.slice(s, e + 1);
  return JSON.parse(t);
}

function cleanSingleLine(value, max) {
  return String(value || "").replace(/[\r\n]+/g, " ").trim().slice(0, max);
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function handleTailor(request, env) {
  const body = await request.json();
  let posting = (body.jobText || "").trim();

  if (!posting && body.jobUrl) {
    try {
      const r = await fetch(body.jobUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (dburich24 tailor)" }
      });
      if (r.ok) posting = htmlToText(await r.text());
    } catch (e) {}
  }

  if (!posting) {
    posting = "Job posting URL (could not be fetched): " + (body.jobUrl || "unknown");
  }

  let hint = "";
  if (body.company) hint += "\nKnown company: " + body.company;
  if (body.position) hint += "\nKnown position: " + body.position;

  const userMsg =
    "JOB POSTING:\n" + posting + hint +
    "\n\nCANDIDATE PROFILE (JSON):\n" + JSON.stringify(body.profile || {}) +
    "\n\nReturn the JSON object now.";

  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMsg }]
    })
  });

  if (!resp.ok) {
    const detail = await resp.text();
    return json({ error: "Model call failed", status: resp.status, detail }, 502, env);
  }

  const data = await resp.json();
  const text = (data.content || [])
    .filter(b => b.type === "text")
    .map(b => b.text)
    .join("\n");

  let parsed;
  try {
    parsed = parseJSON(text);
  } catch (e) {
    return json({ error: "Could not parse model output", raw: text }, 502, env);
  }

  return json({
    result: {
      company: parsed.company || body.company || "",
      position: parsed.position || body.position || "",
      summary: parsed.summary || "",
      roleIds: Array.isArray(parsed.roleIds) ? parsed.roleIds : [],
      certTitles: Array.isArray(parsed.certTitles) ? parsed.certTitles : [],
      coverBody: parsed.coverBody || ""
    }
  }, 200, env);
}

async function handleContact(request, env) {
  const body = await request.json();

  // Honeypot: if a hidden field is filled, silently accept and drop.
  if (body.website) return json({ ok: true }, 200, env);

  const name = cleanSingleLine(body.name, 200);
  const email = cleanSingleLine(body.email, 200).toLowerCase();
  const message = String(body.message || "").trim().slice(0, 5000);

  if (!name || !email || !message) {
    return json({ error: "Please fill in all fields." }, 400, env);
  }

  if (!isEmail(email)) {
    return json({ error: "Please enter a valid email address." }, 400, env);
  }

  if (!env.RESEND_KEY) {
    return json({ error: "Contact email is not configured: missing RESEND_KEY." }, 500, env);
  }

  if (!env.CONTACT_TO) {
    return json({ error: "Contact email is not configured: missing CONTACT_TO." }, 500, env);
  }

  const to = cleanSingleLine(env.CONTACT_TO, 200);
  const from = cleanSingleLine(env.CONTACT_FROM || "Portfolio <no-reply@dbmb.io>", 200);
  const subject = "Portfolio contact from " + name;

  const text = [
    "New portfolio contact form submission",
    "",
    "Name: " + name,
    "Email: " + email,
    "",
    message
  ].join("\n");

  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + env.RESEND_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: email,
      subject,
      text
    })
  });

  if (!resp.ok) {
    const detail = await resp.text();
    return json({ error: "Email provider rejected the message.", detail }, 502, env);
  }

  return json({ ok: true }, 200, env);
}

function safeName(raw) {
  const n = decodeURIComponent(raw || "")
    .split("/")
    .pop()
    .replace(/[^\w .()&-]+/g, "_")
    .trim();

  return n.slice(0, 160);
}

function filesAuthed(request, env) {
  if (!env.FILES_KEY) return false;
  const k = request.headers.get("x-files-key") || "";
  return k.length > 0 && k === env.FILES_KEY;
}

async function handleFiles(request, env, url) {
  if (!env.FILES) {
    return json({ error: "R2 bucket not bound. Add the FILES binding." }, 500, env);
  }

  if (!filesAuthed(request, env)) {
    return json({ error: "Unauthorized" }, 401, env);
  }

  const parts = url.pathname.split("/").filter(Boolean);
  const name = parts.length > 1 ? safeName(parts.slice(1).join("/")) : "";

  if (request.method === "GET" && !name) {
    const listing = await env.FILES.list({ limit: 500 });
    const files = listing.objects.map((o) => ({
      name: o.key,
      size: o.size,
      uploaded: o.uploaded ? new Date(o.uploaded).toISOString() : null
    }));

    return json({ files }, 200, env);
  }

  if (!name) return json({ error: "Missing file name" }, 400, env);

  if (request.method === "GET") {
    const obj = await env.FILES.get(name);
    if (!obj) return json({ error: "Not found" }, 404, env);

    const headers = Object.assign({
      "Content-Type": obj.httpMetadata && obj.httpMetadata.contentType
        ? obj.httpMetadata.contentType
        : "application/octet-stream",
      "Content-Disposition": 'attachment; filename="' + name.replace(/"/g, "") + '"',
      "Cache-Control": "private, no-store"
    }, corsHeaders(env));

    return new Response(obj.body, { status: 200, headers });
  }

  if (request.method === "POST") {
    const len = Number(request.headers.get("content-length") || 0);

    if (len > 25 * 1024 * 1024) {
      return json({ error: "File too large (25 MB max)" }, 413, env);
    }

    const ct = request.headers.get("content-type") || "application/octet-stream";
    await env.FILES.put(name, request.body, {
      httpMetadata: { contentType: ct }
    });

    return json({ ok: true, name }, 200, env);
  }

  if (request.method === "DELETE") {
    await env.FILES.delete(name);
    return json({ ok: true }, 200, env);
  }

  return json({ error: "Method not allowed" }, 405, env);
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(env)
      });
    }

    const url = new URL(request.url);

    try {
      if (request.method === "POST" && url.pathname === "/tailor") {
        return await handleTailor(request, env);
      }

      if (request.method === "POST" && url.pathname === "/contact") {
        return await handleContact(request, env);
      }

      if (url.pathname === "/files" || url.pathname.startsWith("/files/")) {
        return await handleFiles(request, env, url);
      }
    } catch (e) {
      return json({
        error: String(e && e.message ? e.message : e)
      }, 500, env);
    }

    return json({ error: "Not found" }, 404, env);
  }
};
