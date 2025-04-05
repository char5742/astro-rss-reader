import type { APIRoute } from "astro";
import { $feeds, $feedCategories } from "../../../store/feeds";
import type { Feed, FeedCategory } from "../../../types/feed";

export const GET: APIRoute = async () => {
  try {
    const feeds = $feeds.get();
    const categories = $feedCategories.get();
    
    const opml = generateOPML(feeds, categories);
    
    return new Response(opml, {
      status: 200,
      headers: { 
        "Content-Type": "application/xml",
        "Content-Disposition": "attachment; filename=feeds.opml"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

/**
 * フィードとカテゴリーからOPMLを生成する
 */
function generateOPML(feeds: Feed[], categories: FeedCategory[]): string {
  const now = new Date().toISOString();
  
  const feedsByCategory: Record<string, Feed[]> = {};
  
  const uncategorizedFeeds: Feed[] = [];
  
  feeds.forEach(feed => {
    if (feed.categoryIds.length === 0) {
      uncategorizedFeeds.push(feed);
    } else {
      feed.categoryIds.forEach(categoryId => {
        if (!feedsByCategory[categoryId]) {
          feedsByCategory[categoryId] = [];
        }
        feedsByCategory[categoryId].push(feed);
      });
    }
  });
  
  let opml = `<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head>
    <title>Astro RSS Reader Feeds</title>
    <dateCreated>${now}</dateCreated>
  </head>
  <body>`;
  
  categories.forEach(category => {
    const categoryFeeds = feedsByCategory[category.id] || [];
    
    if (categoryFeeds.length > 0) {
      opml += `\n    <outline text="${escapeXml(category.name)}" title="${escapeXml(category.name)}">`;
      
      categoryFeeds.forEach(feed => {
        opml += `\n      <outline type="rss" text="${escapeXml(feed.title)}" title="${escapeXml(feed.title)}" xmlUrl="${escapeXml(feed.url)}" htmlUrl="${escapeXml(feed.url)}"/>`;
      });
      
      opml += `\n    </outline>`;
    }
  });
  
  uncategorizedFeeds.forEach(feed => {
    opml += `\n    <outline type="rss" text="${escapeXml(feed.title)}" title="${escapeXml(feed.title)}" xmlUrl="${escapeXml(feed.url)}" htmlUrl="${escapeXml(feed.url)}"/>`;
  });
  
  opml += `\n  </body>
</opml>`;
  
  return opml;
}

/**
 * XML特殊文字をエスケープする
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
