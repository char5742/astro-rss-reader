import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { getFeedMetadata, validateFeedUrl } from "./feed";

describe("Feed Utilities", () => {
  let mockFetch: typeof fetch;

  beforeEach(() => {
    // フェッチのモックを元に戻す
    mockFetch = globalThis.fetch;
  });

  describe("validateFeedUrl", () => {
    it("RSSフィードのURLを検証できる", async () => {
      globalThis.fetch = async () =>
        new Response("", {
          headers: {
            "content-type": "application/rss+xml",
          },
        });

      const result = await validateFeedUrl("https://example.com/feed.xml");
      expect(result).toBe(true);
    });

    it("AtomフィードのURLを検証できる", async () => {
      globalThis.fetch = async () =>
        new Response("", {
          headers: {
            "content-type": "application/atom+xml",
          },
        });

      const result = await validateFeedUrl("https://example.com/atom.xml");
      expect(result).toBe(true);
    });

    it("無効なURLの場合はエラーを投げる", async () => {
      globalThis.fetch = async () => {
        throw new Error("Network error");
      };

      await expect(validateFeedUrl("invalid-url")).rejects.toThrow(
        "フィードURLにアクセスできません",
      );
    });
  });

  describe("getFeedMetadata", () => {
    it("RSSフィードのメタデータを取得できる", async () => {
      const rssContent = `
        <?xml version="1.0" encoding="UTF-8" ?>
        <rss version="2.0">
          <channel>
            <title>Test Feed</title>
            <description>Test Description</description>
            <image>
              <url>https://example.com/image.png</url>
            </image>
          </channel>
        </rss>
      `;

      globalThis.fetch = async () => new Response(rssContent);

      const metadata = await getFeedMetadata(rssContent);
      expect(metadata).toEqual({
        title: "Test Feed",
        description: "Test Description",
        imageUrl: "https://example.com/image.png",
      });
    });

    it("Atomフィードのメタデータを取得できる", async () => {
      const atomContent = `
        <?xml version="1.0" encoding="UTF-8" ?>
        <feed xmlns="http://www.w3.org/2005/Atom">
          <title>Test Atom Feed</title>
          <subtitle>Test Subtitle</subtitle>
          <logo>https://example.com/logo.png</logo>
        </feed>
      `;

      const metadata = await getFeedMetadata(atomContent);
      expect(metadata).toEqual({
        title: "Test Atom Feed",
        description: "Test Subtitle",
        imageUrl: "https://example.com/logo.png",
      });
    });

    it("無効なフィードの場合は空のメタデータを返す", async () => {
      await expect(await getFeedMetadata("invalid-feed")).toEqual({
        title: undefined,
        description: undefined,
        imageUrl: undefined,
      });
    });
  });

  afterEach(() => {
    // テスト後にフェッチを元に戻す
    globalThis.fetch = mockFetch;
  });
});
