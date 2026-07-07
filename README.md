# dburich24 — Personal Portfolio + Résumé Engine

This is the complete handoff package for **Dustin Burich's** personal portfolio website (`dburich24`). Everything needed to run, understand, continue, or deploy the project lives in this folder.

## What this is

A single self-contained HTML file that renders a coastal-themed React portfolio site with three built-in résumé tools:

1. A one-click **General Résumé** button (all-inclusive PDF, no configuring).
2. **Custom Tailoring** — give it a job posting and it returns a tailored cover letter on your letterhead (monogram + real script signature) plus a matched résumé capped at two pages, pulling only your real experience and certifications.
3. A password-gated **Manual Compiler** that assembles a custom PDF (cover letter + résumé + supporting certificate documents + references), merging real certificate scans embedded directly in the file.

No build step, no server, no dependencies to install. Open the HTML file in a browser and it runs.

## Package contents

| File | What it is |
|---|---|
| `dburich24.html` | The live application. This is the deliverable. ~2.85 MB, one file. |
| `worker.js` | The Cloudflare Worker backend (`/tailor` for Custom Tailoring, `/contact` for the contact form, `/files` for the Cloud Vault). |
| `WORKER.md` | How to deploy and wire up `worker.js`. |
| `HANDOFF.md` | The master document — architecture, full content data, features, design system, build/verify method, and current state. **Read this first if you're picking up the project.** |
| `DEPLOYMENT.md` | Step-by-step pre-launch checklist for shipping to a real domain (GitHub Pages + Cloudflare Worker). |
| `CHANGELOG.md` | What changed per session (latest: v1.1 Custom Tailoring). |
| `README.md` | This file. |

## Quick start

**To view it:** double-click `dburich24.html`, or drag it into any modern browser. It loads React, Babel, jsPDF, and pdf-lib from a CDN, so an internet connection is required on first load.

**To try the résumé tools:**
- On the **About Me** tab, click **General Résumé** to generate the complete PDF.
- Open the **Compile a Résumé** tab (🔒; unlock key is in `HANDOFF.md`). It opens on **Custom Tailoring** — paste a job description (and/or a URL), click **Generate**, then download the tailored package. In this preview it drafts with real AI when you paste a description, or an offline demo otherwise. The pick-and-choose tool is under the **Manual Compiler** tab.
- Open the **Access Files** tab (🔒, same key) to download any certificate, letter, or transcript as a PDF. The **Cloud Vault** section (upload from any device) activates once the Worker is deployed.

**To edit it:** all logic lives in one `<script type="text/babel">` block near the bottom of the file. See the "Build & Verify Method" section of `HANDOFF.md` — there is a strict transpile-check loop you should follow before shipping any change, because the file uses in-browser Babel and a small parser ruleset.

## One important rule

Dustin publishes fiction under a separate pen name. **That pen name must never appear anywhere** in this project — not in the app, source, PDFs, legal text, or any handoff document. This site is under his real name only.

## Status at a glance

Feature-complete and content-audited. Pending items before public launch are the deployment tasks in `DEPLOYMENT.md` (real domain, live email relay, Cloudflare Worker for the AI cover letter, contact form, and Cloud Vault, and dropping the full-resolution certificate PDFs — FEMA ones rotated upright — into the deployed `/assets/certs/` folder). Everything else runs today.
