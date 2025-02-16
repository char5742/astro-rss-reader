import node from "@astrojs/node";
import icon from "astro-icon";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [icon()],
  experimental: {
    serializeConfig: true,
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
