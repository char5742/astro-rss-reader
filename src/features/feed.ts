export interface FeedMetadata {
  title: string;
  description?: string;
  imageUrl?: string;
}

export class FeedError extends Error {
  constructor(message: string) {
    super(message);
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

export async function getFeedMetadata(url: string): Promise<FeedMetadata> {
  try {
    const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");

    // RSS 2.0とAtomの両方に対応
    const title = xmlDoc.querySelector(
      "channel > title, feed > title",
    )?.textContent;

    if (!title) {
      throw new FeedError("フィードのタイトルが取得できません");
    }

    const description = xmlDoc.querySelector(
      "channel > description, feed > subtitle",
    )?.textContent;

    const imageUrl = xmlDoc.querySelector(
      "channel > image > url, feed > logo",
    )?.textContent;

    return {
      title,
      description: description || undefined,
      imageUrl: imageUrl || undefined,
    };
  } catch (error) {
    throw new FeedError("フィードの解析に失敗しました");
  }
}
