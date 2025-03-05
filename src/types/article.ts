import { z } from "zod";
import { FeedIdSchema } from "./feed";

export enum ArticleStatus {
  UNREAD = "unread",
  READ = "read",
  ARCHIVED = "archived",
}

const ArticleIdBrand = Symbol();
export const ArticleIdSchema = z.string().brand(ArticleIdBrand);
export type ArticleId = z.infer<typeof ArticleIdSchema>;

const ArticleCategoryIdBrand = Symbol();
export const ArticleCategoryIdSchema = z.string().brand(ArticleCategoryIdBrand);
export type ArticleCategoryId = z.infer<typeof ArticleCategoryIdSchema>;

export const ArticleCategorySchema = z
  .object({
    id: ArticleCategoryIdSchema,
    name: z.string(),
  })
  .readonly();
export type ArticleCategory = z.infer<typeof ArticleCategorySchema>;

export const ArticleSchema = z
  .object({
    id: ArticleIdSchema,
    feedId: FeedIdSchema,
    title: z.string(),
    url: z.string().url(),
    content: z.string(),
    summary: z.string().optional(),
    author: z.string().optional(),
    publishedAt: z.date(),
    imageUrl: z.string().url().optional(),
    categories: z.array(ArticleCategorySchema),
  })
  .readonly();
export type Article = z.infer<typeof ArticleSchema>;

export function NewArticle({
  id,
  feedId,
  title,
  url,
  content,
  publishedAt,
  categories,
  summary,
  author,
  imageUrl,
}: Omit<Article, "id"> & { id: string }): Article {
  return {
    id: id as ArticleId,
    feedId,
    title,
    url,
    content,
    publishedAt,
    categories,
    summary,
    author,
    imageUrl,
  };
}

export const TagSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    color: z.string().optional(),
  })
  .readonly();
export type Tag = z.infer<typeof TagSchema>;

export const ArticleWithTagsSchema = z
  .object({
    article: ArticleSchema,
    tags: z.array(TagSchema),
  })
  .readonly();
export type ArticleWithTags = z.infer<typeof ArticleWithTagsSchema>;
