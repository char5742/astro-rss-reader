export interface FeedMetadata {
  title?: string;
  description?: string;
  imageUrl?: string;
}

export class FeedError extends Error {
  constructor(message: string, error?: unknown) {
    super(message + (error ? `: ${error}` : ""));
    this.name = "FeedError";
  }
}

export async function validateFeedUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
    const contentType = response.headers.get("content-type");

    if (!contentType) {
      throw new FeedError("Content-Typeが取得できません");
    }

    return (
      contentType.includes("xml") ||
      contentType.includes("rss") ||
      contentType.includes("atom")
    );
  } catch (error) {
    throw new FeedError("フィードURLにアクセスできません");
  }
}

import { XMLParser } from "fast-xml-parser";

export async function getFeedMetadata(text: string): Promise<FeedMetadata> {
  try {
    const parser = new XMLParser();
    const jObj = parser.parse(text);

    // RSS 2.0とAtomの両方に対応
    const title = jObj.rss?.channel?.title || jObj.feed?.title;
    const description = jObj.rss?.channel?.description || jObj.feed?.subtitle;
    const imageUrl = jObj.rss?.channel?.image?.url || jObj.feed?.logo;

    return {
      title,
      description: description || undefined,
      imageUrl: imageUrl || undefined,
    };
  } catch (error) {
    throw new FeedError("フィードの解析に失敗しました", error);
  }
}
