import { z } from "zod";
import { AccountIdSchema } from "./account";

const UserIdBrand = Symbol();
export const UserIdSchma = z.string().brand(UserIdBrand);
export type UserId = z.infer<typeof UserIdSchma>;
export const UserSchmea = z
  .object({
    id: UserIdSchma,
    accountId: AccountIdSchema,
    name: z.string(),
    settings: z.object({
      theme: z.enum(["light", "dark", "system"]),
      autoMarkAsRead: z.boolean(),
      notificationsEnabled: z.boolean(),
      refreshInterval: z.number(),
    }),
  })
  .readonly();
export type User = z.infer<typeof UserSchmea>;

export const UserSettingsSchema = z.object({
  appearance: z.object({
    theme: z.enum(["light", "dark", "system"]),
    fontSize: z.enum(["small", "medium", "large"]),
  }),
  notifications: z.object({
    enabledLatestNotifications: z.boolean(),
    enabledKeywordsNotifications: z.boolean(),
    keywords: z.array(z.string()),
  }),
  account: z.object({
    enabledSync: z.boolean(),
  }),
});
export type UserSettings = z.infer<typeof UserSettingsSchema>;
