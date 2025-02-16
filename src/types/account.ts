import { z } from "astro:content";

const AccountIdBrand = Symbol();
export const AccountIdSchema = z.string().brand(AccountIdBrand);
export const AccountSchema = z
  .object({
    id: AccountIdSchema,
    email: z.string(),
  })
  .readonly();
export type Account = z.infer<typeof AccountSchema>;
