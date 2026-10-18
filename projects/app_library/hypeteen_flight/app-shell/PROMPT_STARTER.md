# Prompt starter: build a rendition on the App Shell

Attach this zip and fill in the brackets. Delete any line you don't need.

---

I'm attaching the **App Shell**, a phone-first web-app framework. Read `README.md` and `PLAYBOOK.md` first.

Make a new rendition:

- **Name and identity:** [app name, subtitle, tagline, a unique lowercase id]
- **Who it's for:** [the people and what they need to do]
- **Look:** [colors or a vibe, a font, a logo or backdrop file I'm attaching]
- **Sign-in:** [names + PINs / guests allowed / no sign-in at all]. People are called: [e.g. "road name", "call sign"]
- **Home screen cards:** [list them. For each, say whether it's a text page, a link, or a real feature]
- **Features to build as modules:** [for each: what it shows, who can add or change things, what's shared vs. personal]
- **Owner-only things:** [what only the owner can do]
- **Where it runs:** [a claude.ai artifact / a zip I'll host / another database]
- **What I want back:**
  - [a preset JSON + a zip, built with `tools/new_rendition.py`]
  - [the live artifact]
  - [a plan first]

Rules:

- Keep framework files untouched. Put everything rendition-specific in `rendition.js`, `assets/` and new `mod_*.js` files.
- Follow the module rules in `mod_blank.js`.
- Add a check to `qa/smoke.js` for each module and run it.
- Ask me anything ambiguous before building.
