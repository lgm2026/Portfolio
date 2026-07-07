# Security Overview - SeaHype Marine Biology Education

**Version:** 1.0.0  **Effective date:** 5 July 2026

## Architecture and threat surface
The App is a single, self-contained offline HTML application. It has:
- No backend server, no database, and no user accounts or authentication.
- No network calls at runtime (all lesson data and assets are inlined; verified by
  automated scan of the shipped file: 0 `fetch(`/`XMLHttpRequest` calls, 0 references
  to any external API). The only outbound action possible is the user tapping an
  external source link, which hands off to the device browser.
- No secrets, API keys, tokens, or credentials of any kind in the shipped file.

Because there is no server and no account, entire classes of risk do not apply:
server breaches, credential theft, session hijacking, CSRF, SQL/`NoSQL` injection,
and data-in-transit interception of user data.

## Data storage
User data (display name, progress, settings, notes) is kept only in the browser's
local storage on the device. It is never transmitted. Users can erase it instantly
via Reset progress or by clearing site data / uninstalling.

## Input handling / XSS
User-entered text (e.g., display name) is rendered through React, which escapes
content by default. This is verified in automated QA: a script/HTML payload entered
as a display name is shown as literal text and does not execute, inject nodes, or
fire handlers.

## Content integrity
The App ships as one deterministic file. Automated checks confirm no external script
or style sources, no remote images in markup, and no placeholder/test artifacts in
user-visible content.

## Rate limiting / abuse
Not applicable: there is no server endpoint to protect. No user-generated content is
transmitted or shared between users.

## Recommendations for the operator
- Serve the file over HTTPS if hosted on the web; ship via signed store packages for
  app stores.
- Keep the React/ReactDOM versions current and rebuild when security releases land.
- Preserve the strict Content Security posture (no added remote scripts) in future
  updates.

## Reporting
Security concerns may be reported to [CONTACT EMAIL OR URL].
