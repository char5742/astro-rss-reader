import { defineCollection, z } from "astro:content";
import { feeds } from "./data/feeds";
import { convertUrlToFeed } from "./features/feed/feed-converter";
import { ArticleSchema } from "./types/article";
import { FeedSchema } from "./types/feed";

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
    feed: FeedSchema,
    articles: z.array(ArticleSchema),
  }),
});

export const collections = { feed };
