import node from "@astrojs/node";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [],
  experimental: {
    serializeConfig: true,
    session: true,
    svg: true,
  },
  output: "server",
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
  adapter: node({
    mode: "standalone",
  }),
});
