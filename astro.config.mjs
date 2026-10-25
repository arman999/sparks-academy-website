// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://sparksacademyenrichment.com",

  // Pages are pre-built as static HTML (fast). Only /api/register runs on demand.
  output: "static",
  adapter: cloudflare({
    // Optimize images at build time; no extra Cloudflare Images setup needed.
    imageService: "compile",
  }),

  // Self-hosted fonts with preloading and size-matched fallbacks (less layout shift).
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Bricolage Grotesque",
      cssVariable: "--font-bricolage",
      weights: [500, 700, 800],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["system-ui", "sans-serif"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Nunito",
      cssVariable: "--font-nunito",
      weights: [400, 600, 700, 800],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["system-ui", "sans-serif"],
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
