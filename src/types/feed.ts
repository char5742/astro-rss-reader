import { z } from "zod";

const FeedIdBrand = Symbol();
export const FeedIdSchema = z.string().brand(FeedIdBrand);
export type FeedId = z.infer<typeof FeedIdSchema>;

const FeedCategoryIdBrand = Symbol();
export const FeedCategoryIdSchema = z.string().brand(FeedCategoryIdBrand);
export type FeedCategoryId = z.infer<typeof FeedCategoryIdSchema>;

export const FeedSchema = z
  .object({
    id: FeedIdSchema,
    title: z.string(),
    url: z.string().url(),
    categoryIds: z.array(FeedCategoryIdSchema),
    description: z.string().optional(),
    lastUpdated: z.date().optional(),
    imageUrl: z.string().url().optional(),
  })
  .readonly();
export type Feed = z.infer<typeof FeedSchema>;

export const FeedCategorySchema = z
  .object({
    id: FeedCategoryIdSchema,
    name: z.string(),
  })
  .readonly();
export type FeedCategory = z.infer<typeof FeedCategorySchema>;

export const SubscriptionSchema = z
  .object({
    feedId: FeedIdSchema,
    subscribedAt: z.date(),
    notificationsEnabled: z.boolean(),
  })
  .readonly();
export type Subscription = z.infer<typeof SubscriptionSchema>;
