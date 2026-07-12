import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// base "./" keeps every asset path relative, so the same build works on
// GitHub Pages project sites, custom domains, and inside the Capacitor APK.
export default defineConfig({
  base: "./",
  // In the standard build the offline copy is a separate file shipped alongside
  // the app (produced by npm run build:offline). The single-file preview build
  // sets this to "self" instead.
  define: {
    __QRHYPE_OFFLINE__: JSON.stringify("asset"),
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "icons/apple-touch-icon.png"],
      manifest: {
        name: "QRHype",
        short_name: "QRHype",
        description:
          "Create clean, custom QR codes in seconds. Free, private, and fully in your browser.",
        start_url: "./",
        scope: "./",
        display: "standalone",
        background_color: "#fbfaf7",
        theme_color: "#2a8171",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "icons/maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
