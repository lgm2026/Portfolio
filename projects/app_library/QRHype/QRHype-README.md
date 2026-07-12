# QRHype

A free, professional QR code generator that runs entirely in your browser. No
login, no backend, no database, no tracking, and no ads. Everything you enter,
including any logo you upload, stays on your device. Nothing is ever sent to a
server, because there is no server.

QRHype supports thirteen QR types, full styling control, a live preview, a
practical scanability review, and instant downloads in PNG, SVG, PDF, or JPG. It
installs as a Progressive Web App for offline use and can be packaged as an
Android APK with Capacitor.

## Features

Thirteen code types: Website URL, Plain text, Email, Phone, SMS, Wi-Fi, Contact
card (vCard), WhatsApp, Location or maps, Calendar event, App store or deep link,
Social media profile, and Custom raw payload.

Styling controls: solid or gradient code color with adjustable angle, background
color, a transparent background option, six module styles, corner frame and
corner center styles and colors, size, quiet zone, and error correction level.
Six built-in presets give you a coherent look in one click.

Center logo: upload a PNG, JPG, SVG, or WebP. The image is resized and processed
locally, error correction is raised to High automatically, and an optional white
backdrop keeps busy logos legible.

Scanability review: live checks for contrast, inverted colors, logo coverage,
quiet zone, and data density. Failing checks block download until resolved so
you do not ship a code that will not scan.

Downloads: PNG, SVG, PDF, or JPG, named `qrhype-[type]-[date].[ext]`. Transparent
codes are flattened onto white for the JPG format, which has no alpha channel.

## Tech stack

React 18 and TypeScript in strict mode, built with Vite. Styling uses Tailwind
CSS v4. QR rendering uses qr-code-styling. PDF export uses jsPDF, loaded on
demand. Subtle motion uses Framer Motion, and respects the reduced motion
system setting. Offline support uses vite-plugin-pwa. Android packaging uses
Capacitor.

## Getting started

Requires Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

The dev server prints a local URL. Open it in your browser.

## Available scripts

- `npm run dev` starts the Vite dev server.
- `npm run build` type-checks and builds the production bundle into `dist`.
- `npm run build:offline` builds the app plus a self-contained
  `qrhype-offline.html` in `dist` for the offline download link.
- `npm run preview` serves the built bundle locally.
- `npm run typecheck` runs the TypeScript compiler with no emit.
- `npm run test:payloads` runs the payload, escaping, and validation suite.
- `npm run icons` regenerates the monogram-derived app icons and favicon.
- `npm run deploy` publishes `dist` to GitHub Pages.
- `npm run android:add`, `android:sync`, `android:open`, `android:apk` handle
  the Capacitor Android project. See docs/ANDROID_APK.md.

## Building for production

```bash
npm run build
```

The build runs the strict TypeScript type-check first, then produces an
optimized bundle in `dist`. The bundle uses relative asset paths so it works
both at a domain root and under a subpath such as a GitHub Pages project site.

## Deploying to GitHub Pages

The project is configured for GitHub Pages out of the box. The Vite base is set
to a relative path, so the same build works whether your site is served from
`username.github.io` or `username.github.io/qrhype`.

To deploy:

```bash
npm run build
npm run deploy
```

`npm run deploy` uses the `gh-pages` package to push the contents of `dist` to a
`gh-pages` branch. In your repository settings, set GitHub Pages to serve from
that branch. If you host under a project subpath, no base path change is needed
because assets are referenced relatively.

For a user or organization site served at the domain root, the same build works
without modification.

## Progressive Web App and offline use

QRHype registers a service worker that precaches the app shell and assets. After
the first visit, the app loads and runs with no network connection. Because all
QR generation happens on the device, you can create and download codes fully
offline.

Installed apps update automatically. When you deploy a new build, the service
worker fetches it and the installed app picks up the update on its next launch.

The Privacy panel also has a "Download QRHype for offline use" link that saves
the entire app as a single self-contained HTML file. Opening that file in any
browser, including by double-clicking it, runs QRHype with no server and no
network. The standard build serves a companion `qrhype-offline.html` for this
link, produced by `npm run build:offline`. The deploy step runs that build
automatically, so the hosted site always offers the download.

## Packaging as an Android APK

QRHype can be wrapped in a native Android shell with Capacitor and compiled into
an installable, fully offline APK. The app ID is `io.dbmb.qrhype`. Full
prerequisites and step-by-step build, signing, and troubleshooting instructions
are in docs/ANDROID_APK.md.

Quick version, run locally with the Android toolchain installed:

```bash
npm run build
npm run android:add     # first time only, creates the android/ project
npm run android:sync
npm run android:open     # build and run from Android Studio
```

## Branding and the monogram

The app ships with a placeholder DB monogram used in the header, the footer, and
as the source for the app icons and favicon. The mark is a transparent PNG at
`src/assets/monogram.png`.

To rebrand:

1. Replace `src/assets/monogram.png` with your own mark. Use a square,
   transparent PNG at 512 px or larger for crisp icons.
2. Run `npm run icons`. The icon script keeps your monogram and regenerates the
   favicon and the app icons from the brand gradient.
3. Rebuild with `npm run build`.

The monogram is always rendered on a transparent background and stands alone,
without accompanying text, unless you add text yourself.

## Project structure

```
public/icons            app icons and favicon (generated)
scripts                 icon generation and the payload test runner
docs                    Android packaging guide and QA checklist
src/
  assets                the monogram mark
  components/ui          reusable primitives (button, card, field, dialog, ...)
  components/brand       the monogram component
  components/layout      header, footer, and legal dialog content
  features/qr
    payload-builders     one builder per QR type plus a dispatcher
    validators           per-type form validation
    exporters            PNG, SVG, JPG, and PDF export
    components            the destination, design, and preview UI
    qr-options.ts         maps style state onto the renderer
    scanability.ts        the scanability checks
    state.tsx             the QR context, reducer, and hooks
    constants.ts          type metadata, presets, and defaults
    types.ts              the QR domain types
  lib                    small utilities (color, hooks, toast, class names)
  styles                 the Tailwind entry and design tokens
```

## Architecture notes for a future V2

The generator is structured so that a later version can add dynamic QR codes,
short links, saved projects, or analytics without a rewrite. The payload
builders and validators are pure functions with no UI or storage dependencies,
so they can be reused by a batch tool, an API, or a native client. The renderer
options are produced in one place, which keeps the live preview and every export
format perfectly consistent. State is isolated behind a small context and
reducer, which leaves room to swap in persistence or a server sync layer later.
None of that is built today; the current app is deliberately client-side only.

## Privacy

QRHype has no accounts, no analytics, no tracking cookies, and no advertising.
The content you enter is used only in your browser to render the code you see.
Uploaded logos are read and processed on your device and are never transmitted
or stored anywhere else.

## License and trademark

QR Code is a registered trademark of Denso Wave Incorporated. QRHype is an
independent tool and is not affiliated with or endorsed by Denso Wave.
