import { defineCollection, z } from "astro:content";
import { feeds } from "./data/feeds";
import { convertUrlToFeed } from "./features/feed-converter";

const feed = defineCollection({
  loader: async () => {
    const promises = feeds.map(async (feed) => {
      return await convertUrlToFeed(feed.url).then((f) => ({
        id: f.feed.id,
        ...f,
      }));
    });
    const feedData = await Promise.all(promises);
    return feedData;
  },
  schema: z.object({
    id: z.string(),
    feed: z.object({
      title: z.string(),
      url: z.string(),
      categoryIds: z.array(z.string()),
      description: z.string().optional(),
      imageUrl: z.string().optional(),
      lastUpdated: z.date(),
    }),
    articles: z.array(
      z.object({
        id: z.string(),
        feedId: z.string(),
        title: z.string(),
        url: z.string(),
        content: z.string(),
        publishedAt: z.date(),
        status: z.enum(["unread", "read", "archived"]),
        isFavorite: z.boolean(),
        categories: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
          }),
        ),
        summary: z.string(),
      }),
    ),
  }),
});

export const collections = { feed };
