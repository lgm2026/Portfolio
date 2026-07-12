import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { fileURLToPath } from "node:url";

// Builds a single self-contained index.html for in-sandbox previewing.
// Fonts, images, JS, and CSS are all inlined; the PWA service worker is
// stubbed out because it cannot register inside a sandboxed frame.
export default defineConfig({
  base: "./",
  // The single-file build is itself the offline copy, so the in-app download
  // serializes the current document rather than fetching a separate file.
  define: {
    __QRHYPE_OFFLINE__: JSON.stringify("self"),
  },
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "virtual:pwa-register": fileURLToPath(
        new URL("./scripts/preview/pwa-register-stub.ts", import.meta.url),
      ),
    },
  },
  build: {
    outDir: "dist-preview",
    // Inline every asset (fonts, monogram) as data URIs so the HTML is portable.
    assetsInlineLimit: 100 * 1024 * 1024,
    chunkSizeWarningLimit: 8000,
    cssCodeSplit: false,
  },
});
