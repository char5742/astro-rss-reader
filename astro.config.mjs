import db from "@astrojs/db";
import node from "@astrojs/node";
import icon from "astro-icon";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [db(), icon()],
  experimental: {
    serializeConfig: true,
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
  adapter: node({
    mode: "standalone",
  }),
});
