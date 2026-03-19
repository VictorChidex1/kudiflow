import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { createRequire } from "module";

// vite-plugin-prerender ships a broken ESM bundle (uses `require` inside .mjs).
// We use createRequire to explicitly load its CJS build instead.
const require = createRequire(import.meta.url);
const vitePrerender = require("vite-plugin-prerender");

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    vitePrerender({
      // The directory where your built assets live
      staticDir: path.join(__dirname, "dist"),
      // All public-facing marketing routes (no auth, no dashboard)
      routes: [
        "/",
        "/about",
        "/contact",
        "/docs",
        "/privacy-policy",
        "/terms-of-service",
        "/coming-soon",
      ],
    }),
  ],
});


