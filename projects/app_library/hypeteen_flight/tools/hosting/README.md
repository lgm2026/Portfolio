# Hosting HypeTeen Flight Academy on your own server (dbmb.io) with visitor logs

Why: the published artifact lives on claude.ai, where you get no access logs. Served from your own domain, the web server
records every visit by itself (no code in the app, nothing sent by the app): IP address, time, page, browser string, and the
HTTP status. That is the "who visited" record for security and abuse investigation, and it is the only visitor data the
Terms (Section 4) promise to collect. The app stays static and device-only.

Legal frame (summary, not advice): the app is used by children under 13. Under COPPA, an IP address is personal
information, but collecting it **solely to support internal operations** (security, integrity, abuse detection, legal
compliance) is permitted without parental consent **if** it is never used to profile, contact, or advertise to a child and
is not shared except as the Rule allows. Keep it that way:

- Log only what the server logs by default. No analytics scripts, no pixels, no cookies, no third-party tags. (The app has none.)
- Never join the logs with game data. The app does not send game data, so this is automatic; keep it so.
- Retain for **90 days or less** (the Terms say 90). The config below rotates daily and deletes after 90 days.
- Restrict who can read the logs (root / the server admin only). Treat them as sensitive.
- If a lawyer, the police, or anyone else asks for them, follow legal process. Document each access.
- Say what you do in the Terms (already in Section 4) and keep the text and the practice in step.

## Deploy
1. `node tools/build.js` → copy `dist/` to the server, e.g. `/var/www/hfq`.
2. Copy `hfq-security-headers.conf` to `/etc/nginx/snippets/`, install the nginx site below, then `nginx -t && systemctl reload nginx`.
   Check the headers once: `curl -sI https://flight.dbmb.io/ | grep -i -E 'content-security|x-frame'` must print both lines
   (the r6.6 config dropped them; see docs/02_AUDIT_REGISTER.md D02).
3. Install the logrotate rule. Check `ls /var/log/nginx/hfq.*` after a day.

## Reading the logs
- Visits per day:       `zcat -f /var/log/nginx/hfq.access.log* | cut -d' ' -f4 | cut -d: -f1 | sort | uniq -c`
- Distinct IPs today:   `cut -d' ' -f1 /var/log/nginx/hfq.access.log | sort -u | wc -l`
- Who pulled app.js most (bulk-download / scraping signal):
                         `grep ' /app.js ' /var/log/nginx/hfq.access.log | cut -d' ' -f1 | sort | uniq -c | sort -rn | head`
- Hot-linking from another site (someone embedding or mirroring the app):
                         `awk -F'"' '$4!="-" && $4 !~ /dbmb\.io/ {print $4}' /var/log/nginx/hfq.access.log | sort | uniq -c | sort -rn`

The nginx config also blocks other sites from framing the app (X-Frame-Options / frame-ancestors) and sets a strict
Content-Security-Policy with no third-party sources at all (fonts and map data ship with the app). r7's build ships content as
data, so the page runs without 'unsafe-eval' or inline scripts. A copied `index.html` on another domain cannot load your
scripts from dbmb.io (the referer check on `.js`).
