import { describe, expect, it, beforeEach, afterEach } from "bun:test";
import { discoverFeeds } from "./feed-discovery";

describe("Feed Discovery", () => {
  let mockFetch: typeof fetch;
  
  beforeEach(() => {
    mockFetch = globalThis.fetch;
  });
  
  it("直接フィードURLを検出できる", async () => {
    globalThis.fetch = async () => 
      new Response("", {
        headers: { "content-type": "application/rss+xml" }
      });
    
    const feeds = await discoverFeeds("https://example.com/feed.xml");
    expect(feeds).toEqual(["https://example.com/feed.xml"]);
  });
  
  it("HTMLからフィードリンクを抽出できる", async () => {
    const html = `
      <html>
        <head>
          <link rel="alternate" type="application/rss+xml" href="/feed.xml">
          <link rel="alternate" type="application/atom+xml" href="https://example.com/atom.xml">
        </head>
        <body>
          <!-- content -->
        </body>
      </html>
    `;
    
    globalThis.fetch = async () => new Response(html);
    
    const feeds = await discoverFeeds("https://example.com");
    expect(feeds).toContain("https://example.com/feed.xml");
    expect(feeds).toContain("https://example.com/atom.xml");
  });
  
  it("一般的なフィードパスも検出する", async () => {
    globalThis.fetch = async () => new Response("<html></html>");
    
    const feeds = await discoverFeeds("https://example.com");
    expect(feeds).toContain("https://example.com/feed");
    expect(feeds).toContain("https://example.com/rss.xml");
  });
  
  afterEach(() => {
    globalThis.fetch = mockFetch;
  });
});
