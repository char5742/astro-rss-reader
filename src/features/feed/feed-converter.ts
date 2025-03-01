import { createHash } from "crypto";
import { ArticleStatus, NewArticle, type Article } from "~/types/article";
import type { Feed, FeedId } from "~/types/feed";
import { getFeedMetadata } from "./feed";
import { parseFeed } from "./rss-parser";

export async function convertUrlToFeed(
  url: string,
): Promise<{ feed: Feed; articles: Article[] }> {
  // フィードの内容を取得
  const response = await fetch(url);
  const xmlText = await response.text();

  // フィードのメタデータを取得
  const metadata = await getFeedMetadata(xmlText);

  // Feed型のデータを作成
  const feed: Feed = {
    id: toHash(url) as FeedId,
    title: metadata.title || url,
    url: url,
    categoryIds: [],
    description: metadata.description,
    imageUrl: metadata.imageUrl,
    lastUpdated: new Date(),
  };

  const parsedFeed = parseFeed(xmlText);
  if (!parsedFeed) {
    return { feed, articles: [] };
  }

  // 記事データを作成
  const articles = parsedFeed.items.map((item) => {
    return NewArticle({
      id: toHash(item.link),
      feedId: feed.id,
      title: item.title,
      url: item.link,
      content: item.content || "",
      publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
      status: ArticleStatus.UNREAD,
      categories: [],
      summary: item.content?.substring(0, 200) || "", // 最初の200文字をサマリーとして使用
    });
  });

  return { feed, articles };
}

function toHash(str: string): string {
  return createHash("sha256").update(str).digest("base64url").slice(0, 16);
}
