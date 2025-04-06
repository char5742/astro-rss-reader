import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { ArticleStatus } from "~/types/article";
import { convertUrlToFeed } from "./feed-converter";

describe("Feed Converter", () => {
  let mockFetch: typeof fetch;

  beforeEach(() => {
    mockFetch = globalThis.fetch;
  });

  it.skip("RSSフィードを正しく変換できる", async () => {
    const rssContent = `
      <?xml version="1.0" encoding="UTF-8" ?>
      <rss version="2.0">
        <channel>
          <title>Test RSS Feed</title>
          <description>Test Description</description>
          <link>https://example.com/feed</link>
          <image>
            <url>https://example.com/image.png</url>
          </image>
          <item>
            <title>Test Article</title>
            <link>https://example.com/article1</link>
            <description>Test Content</description>
            <pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
          </item>
          <item>
            <title>Test Article</title>
            <link>https://example.com/article2</link>
            <description>Test Content</description>
            <pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
          </item>
        </channel>
      </rss>
    `;

    globalThis.fetch = async () => new Response(rssContent);

    const { feed, articles } = await convertUrlToFeed(
      "https://example.com/feed.xml",
    );

    expect(feed).toMatchObject({
      title: "Test RSS Feed",
      description: "Test Description",
      imageUrl: "https://example.com/image.png",
      url: "https://example.com/feed.xml",
    });

    expect(articles).toHaveLength(2);
    expect(articles[0]).toMatchObject({
      title: "Test Article",
      url: "https://example.com/article1",
      content: "Test Content",
    });
  });

  it("Atomフィードを正しく変換できる", async () => {
    const atomContent = `
    <?xml version="1.0" encoding="UTF-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom">
      <title>Test Atom Feed</title>
      <subtitle>Test Subtitle</subtitle>
      <link href="https://example.com/feed" rel="self"/>
      <logo>https://example.com/logo.png</logo>

      <entry>
        <title>Test Entry 1</title>
        <link rel="alternate" type="text/html" href="https://example.com/entry1"/>
        <id>https://example.com/entry1</id>
        <updated>2024-01-01T00:00:00Z</updated>
        <summary>Test Entry Content</summary>
      </entry>

      <entry>
        <title>Test Entry 2</title>
        <link rel="alternate" type="text/html" href="https://example.com/entry2"/>
        <id>https://example.com/entry2</id>
        <updated>2024-01-01T00:00:00Z</updated>
        <summary>Test Entry Content</summary>
      </entry>
    </feed>
    `;

    globalThis.fetch = async () => new Response(atomContent);

    const { feed, articles } = await convertUrlToFeed(
      "https://example.com/atom.xml",
    );

    expect(feed).toMatchObject({
      title: "Test Atom Feed",
      description: "Test Subtitle",
      imageUrl: "https://example.com/logo.png",
      url: "https://example.com/atom.xml",
    });

    expect(articles).toHaveLength(2);
    expect(articles[0]).toMatchObject({
      title: "Test Entry 1",
      content: "Test Entry Content",
    });
  });

  it("無効なフィードの場合は空の記事リストを返す", async () => {
    globalThis.fetch = async () => new Response("invalid content");

    const { feed, articles } = await convertUrlToFeed(
      "https://example.com/invalid.xml",
    );

    expect(feed).toBeDefined();
    expect(feed.title).toBe("https://example.com/invalid.xml");
    expect(articles).toHaveLength(0);
  });

  afterEach(() => {
    globalThis.fetch = mockFetch;
  });
});
