import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { createRequire } from "module";

// vite-plugin-prerender uses Puppeteer (headless Chrome) which cannot run
// in Vercel's sandboxed build environment. Only load it outside of Vercel CI.
const isVercel = !!process.env.VERCEL;
const require = createRequire(import.meta.url);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Only prerender locally and on Firebase deploy (not on Vercel)
    ...(!isVercel
      ? [
          require("vite-plugin-prerender")({
            staticDir: path.join(__dirname, "dist"),
            routes: [
              "/",
              "/about",
              "/contact",
              "/docs",
              "/privacy-policy",
              "/terms-of-service",
              "/coming-soon",
              "/blog",
            ],
          }),
        ]
      : []),
  ],
});
