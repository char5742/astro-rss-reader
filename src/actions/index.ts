import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import "~/features/persistence/persistence";
import { createAccount, isExist } from "~/store/accounts";
import { updateSettings } from "~/store/settings";
import type { AccountId } from "~/types/account";
import { UserSettingsSchema } from "~/types/user";
import { getArticleContent, updateArticleStatus } from "./articles";

export const server = {
  // 記事関連のアクション
  articles: {
    getArticleContent,
    updateArticleStatus,
  },
  updateSettings: defineAction({
    accept: "form",
    input: z.object({
      theme: UserSettingsSchema.shape.appearance.shape.theme,
      fontSize: UserSettingsSchema.shape.appearance.shape.fontSize,
    }),
    handler: async (input, context) => {
      updateSettings(context.locals.accountId, {
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
      context.session?.set("accountId", input.id as AccountId);
    },
  }),
  login: defineAction({
    accept: "form",
    input: z.object({
      id: z.string(),
    }),
    handler: async (input, context) => {
      if (!isExist(input.id)) {
        throw new Error("アカウントが見つかりません");
      }
      context.session?.set("accountId", input.id as AccountId);
    },
  }),
  logout: defineAction({
    handler: async (_, context) => {
      context.session?.destroy();
    },
  }),
};
