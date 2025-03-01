import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import "~/features/persistence/persistence";
import { createAccount, getAccount } from "~/store/accounts";
import { updateSettings } from "~/store/settings";
import { UserSettingsSchema } from "~/types/user";
import {
  toggleBookmark,
  getArticleContent,
  toggleFavorite,
  updateArticleStatus
} from "./articles";

export const server = {
  // 記事関連のアクション
  articles: {
    toggleBookmark,
    getArticleContent,
    toggleFavorite,
    updateArticleStatus,
  },
  updateSettings: defineAction({
    accept: "form",
    input: z.object({
      theme: UserSettingsSchema.shape.appearance.shape.theme,
      fontSize: UserSettingsSchema.shape.appearance.shape.fontSize,
    }),
    handler: async (input) => {
      updateSettings({
        appearance: {
          theme: input.theme,
          fontSize: input.fontSize,
        },
      });
    },
  }),
  signup: defineAction({
    accept: "form",
    input: z.object({
      id: z.string(),
    }),
    handler: async (input, context) => {
      createAccount(input.id);
      context.session?.set("accountId", input.id);
    },
  }),
  login: defineAction({
    accept: "form",
    input: z.object({
      id: z.string(),
    }),
    handler: async (input, context) => {
      const account = getAccount(input.id);
      if (!account) {
        throw new Error("アカウントが見つかりません");
      }
      context.session?.set("accountId", input.id);
    },
  }),
  logout: defineAction({
    handler: async (_, context) => {
      context.session?.destroy();
    },
  }),
};
