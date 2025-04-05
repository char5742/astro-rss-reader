import { z } from "zod";

const AccountIdBrand = Symbol();
export const AccountIdSchema = z.string().brand(AccountIdBrand);
export type AccountId = z.infer<typeof AccountIdSchema>;
export const AccountSchema = z
  .object({
    id: AccountIdSchema,
    email: z.string(),
  })
  .readonly();
export type Account = z.infer<typeof AccountSchema>;
