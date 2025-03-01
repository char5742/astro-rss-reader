import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import "~/features/persistence/persistence";
import { createAccount, getAccount } from "~/store/accounts";
import { updateSettings } from "~/store/settings";
import { UserSettingsSchema } from "~/types/user";

export const server = {
  updateSettings: defineAction({
    accept: "form",
    input: z.object({
      theme: UserSettingsSchema.shape.appearance.shape.theme,
      fontSize: UserSettingsSchema.shape.appearance.shape.fontSize,
      "new-articles": z.boolean().optional(),
      "keyword-notifications": z.boolean().optional(),
      keywords: z.string().optional(),
      "sync-settings": z.boolean().optional(),
    }),
    handler: async (input) => {
      // キーワードを配列に変換
      const keywordsArray = input.keywords ?
        input.keywords.split(',').filter(k => k.trim() !== '') :
        [];
      
      updateSettings({
        appearance: {
          theme: input.theme,
          fontSize: input.fontSize,
        },
        notifications: {
          enabledLatestNotifications: input["new-articles"] === true,
          enabledKeywordsNotifications: input["keyword-notifications"] === true,
          keywords: keywordsArray,
        },
        account: {
          enabledSync: input["sync-settings"] === true,
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
