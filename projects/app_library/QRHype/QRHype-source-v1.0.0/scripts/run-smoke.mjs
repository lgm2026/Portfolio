// Bundle the TypeScript smoke entry with the @ alias resolved, then run it.
import { build } from "esbuild";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const outdir = resolve(root, ".smoke");
mkdirSync(outdir, { recursive: true });
const outfile = resolve(outdir, "smoke.mjs");

await build({
  entryPoints: [resolve(here, "smoke.entry.ts")],
  bundle: true,
  format: "esm",
  platform: "node",
  outfile,
  alias: { "@": resolve(root, "src") },
  logLevel: "warning",
});

execFileSync(process.execPath, [outfile], { stdio: "inherit" });
