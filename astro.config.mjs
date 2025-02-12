// @ts-check
import { defineConfig } from "astro/config";

import db from "@astrojs/db";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  integrations: [db(), icon()],
  experimental: {
    serializeConfig: true
  },
  vite: {
    css: {
      transformer: "lightningcss",
      lightningcss: {
        drafts: {
          customMedia: true,
        },
      },
    },
  },
  site: "https://char5742.github.io",
  base: "astro-rss-reader",
});