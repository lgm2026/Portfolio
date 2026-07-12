// Builds the standard multi-file app and a single self-contained
// qrhype-offline.html placed in dist/, which the in-app "Download for offline
// use" link serves. Also finalizes dist-preview/index.html as a portable file.
//
// Run with: npm run build:offline

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.cwd());
const run = (cmd, args) => execFileSync(cmd, args, { stdio: "inherit", cwd: root });

// 1. Standard build (type-check + multi-file bundle) and the single-file build.
run("npx", ["tsc", "-b"]);
run("npx", ["vite", "build"]);
run("npx", ["vite", "build", "--config", "vite.config.preview.ts"]);

// 2. Inline the icons that live in public/ (favicon, apple-touch, splash) as
//    data URIs so the single file has zero external references.
const previewHtmlPath = resolve(root, "dist-preview", "index.html");
let html = readFileSync(previewHtmlPath, "utf8");

const asDataUri = (relPath, mime) => {
  const bytes = readFileSync(resolve(root, "public", relPath));
  return `data:${mime};base64,${bytes.toString("base64")}`;
};

const replacements = [
  [/href="\.?\/?favicon\.ico"/g, `href="${asDataUri("favicon.ico", "image/x-icon")}"`],
  [
    /href="\.?\/?icons\/apple-touch-icon\.png"/g,
    `href="${asDataUri("icons/apple-touch-icon.png", "image/png")}"`,
  ],
  [
    /src="\.?\/?icons\/icon-192\.png"/g,
    `src="${asDataUri("icons/icon-192.png", "image/png")}"`,
  ],
];
for (const [pattern, value] of replacements) html = html.replace(pattern, value);

writeFileSync(previewHtmlPath, html, "utf8");

// 3. Ship the self-contained copy next to the app for the download link.
if (!existsSync(resolve(root, "dist"))) {
  throw new Error("dist/ was not produced by the build");
}
copyFileSync(previewHtmlPath, resolve(root, "dist", "qrhype-offline.html"));

const leftover = html.match(/(?:src|href)="\.?\/(?!\/)[^"]*"/g) || [];
console.log(
  leftover.length === 0
    ? "\nOffline file is fully self-contained: dist/qrhype-offline.html"
    : `\nWarning: unresolved references remain: ${leftover.join(", ")}`,
);
