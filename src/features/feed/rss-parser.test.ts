import { describe, expect, test } from "bun:test";
import { type Feed, parseFeed } from "./rss-parser";

describe("parseFeed", () => {
  test("正しくRSS 2.0フィードをパースできる", () => {
    const rssXml = `
      <?xml version="1.0" encoding="UTF-8" ?>
      <rss version="2.0">
        <channel>
          <title>サンプルRSSフィード</title>
          <link>https://example.com/feed</link>
          <description>これはサンプルのRSSフィードです</description>
          <item>
            <title>記事タイトル1</title>
            <link>https://example.com/article1</link>
            <description>記事の内容1</description>
            <pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
          </item>
          <item>
            <title>記事タイトル2</title>
            <link>https://example.com/article2</link>
            <description>記事の内容2</description>
            <pubDate>Mon, 02 Jan 2024 00:00:00 GMT</pubDate>
          </item>
        </channel>
      </rss>
    `;

    const expected: Feed = {
      title: "サンプルRSSフィード",
      link: "https://example.com/feed",
      description: "これはサンプルのRSSフィードです",
      items: [
        {
          title: "記事タイトル1",
          link: "https://example.com/article1",
          content: "記事の内容1",
          pubDate: "Mon, 01 Jan 2024 00:00:00 GMT",
        },
        {
          title: "記事タイトル2",
          link: "https://example.com/article2",
          content: "記事の内容2",
          pubDate: "Mon, 02 Jan 2024 00:00:00 GMT",
        },
      ],
    };

    const result = parseFeed(rssXml);
    expect(result).toEqual(expected);
  });

  test("正しくAtomフィードをパースできる", () => {
    const atomXml = `
      <?xml version="1.0" encoding="UTF-8"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <title>サンプルAtomフィード</title>
        <link href="https://example.com/feed"/>
        <subtitle>これはサンプルのAtomフィードです</subtitle>
        <entry>
          <title>記事タイトル1</title>
          <link href="https://example.com/article1"/>
          <content>記事の内容1</content>
          <updated>2024-01-01T00:00:00Z</updated>
        </entry>
        <entry>
          <title>記事タイトル2</title>
          <link href="https://example.com/article2"/>
          <content>記事の内容2</content>
          <updated>2024-01-02T00:00:00Z</updated>
        </entry>
      </feed>
    `;

    const expected: Feed = {
      title: "サンプルAtomフィード",
      link: "",
      description: "これはサンプルのAtomフィードです",
      items: [
        {
          title: "記事タイトル1",
          link: "",
          content: "記事の内容1",
          pubDate: "2024-01-01T00:00:00Z",
        },
        {
          title: "記事タイトル2",
          link: "",
          content: "記事の内容2",
          pubDate: "2024-01-02T00:00:00Z",
        },
      ],
    };

    const result = parseFeed(atomXml);
    expect(result).toEqual(expected);
  });

  test("不正なフィードの場合はundefinedを返す", () => {
    const invalidXml = "<invalid></invalid>";
    const result = parseFeed(invalidXml);
    expect(result).toBeUndefined();
  });

  test("RDF (RSS 1.0) フィードをパースできる", () => {
    const rdfXml = `
      <?xml version="1.0" encoding="UTF-8" ?>
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" 
               xmlns="http://purl.org/rss/1.0/">
        <channel>
          <title>テストRDFフィード</title>
          <link>https://example.com</link>
          <description>テスト用のRDFフィード</description>
        </channel>
        <item>
          <title>記事1</title>
          <link>https://example.com/article1</link>
          <description>記事1の内容</description>
        </item>
      </rdf:RDF>
    `;
    
    const expected: Feed = {
      title: "テストRDFフィード",
      link: "https://example.com",
      description: "テスト用のRDFフィード",
      items: [
        {
          title: "記事1",
          link: "https://example.com/article1",
          content: "記事1の内容",
          pubDate: undefined,
        },
      ],
    };
    
    const result = parseFeed(rdfXml);
    expect(result).toEqual(expected);
  });
  
  test("JSONフィードをパースできる", () => {
    const jsonFeed = JSON.stringify({
      version: "https://jsonfeed.org/version/1",
      title: "テストJSONフィード",
      home_page_url: "https://example.com",
      feed_url: "https://example.com/feed.json",
      items: [
        {
          id: "1",
          title: "記事1",
          url: "https://example.com/article1",
          content_text: "記事1の内容",
          date_published: "2024-01-01T00:00:00Z"
        }
      ]
    });
    
    const expected: Feed = {
      title: "テストJSONフィード",
      link: "https://example.com",
      description: "",
      items: [
        {
          title: "記事1",
          link: "https://example.com/article1",
          content: "記事1の内容",
          pubDate: "2024-01-01T00:00:00Z",
        },
      ],
    };
    
    const result = parseFeed(jsonFeed);
    expect(result).toEqual(expected);
  });
});
