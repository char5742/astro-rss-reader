import { FeedError } from "./feed";

/**
 * URLからRSSフィードを自動検出する
 * @param url 検出元のURL
 * @returns 検出されたフィードURLの配列
 */
export async function discoverFeeds(url: string): Promise<string[]> {
  try {
    console.log("フィード検出中:", url);
    if (await isDirectFeed(url)) {
      return [url];
    }
    
    const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
    const html = await response.statusText;
    
    return extractFeedLinks(html, url);
  } catch (error) {
    console.error("フィード検出エラー:", error);
    throw new FeedError("フィードの自動検出に失敗しました", error);
  }
}

/**
 * 直接URLがフィードかどうかを確認
 */
async function isDirectFeed(url: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
    const contentType = response.headers.get("content-type");
    
    if (!contentType) return false;
    
    if (contentType.includes("xml") ||
        contentType.includes("rss") ||
        contentType.includes("atom")) {
      return true;
    }
    
    if (contentType.includes("json")) {
      const text = await response.text();
      try {
        const json = JSON.parse(text);
        return json && 
               typeof json === 'object' && 
               json.version && 
               typeof json.version === 'string' && 
               json.version.startsWith('https://jsonfeed.org/version/') && 
               Array.isArray(json.items);
      } catch (e) {
        return false;
      }
    }
    
    return false;
  } catch (error) {
    return false;
  }
}

/**
 * HTMLからフィードリンクを抽出
 */
function extractFeedLinks(html: string, baseUrl: string): string[] {
  const feedUrls: string[] = [];
  const baseUrlObj = new URL(baseUrl);
  
  const linkRegex = /<link[^>]*rel=["'](alternate|feed)["'][^>]*href=["']([^"']*)["'][^>]*>/gi;
  let match;
  
  while ((match = linkRegex.exec(html)) !== null) {
    const url = match[2];
    if (url) {
      try {
        const absoluteUrl = new URL(url, baseUrlObj.origin).href;
        feedUrls.push(absoluteUrl);
      } catch (e) {
        console.warn(`無効なURL: ${url}`);
      }
    }
  }
  
  const typeRegex = /<link[^>]*type=["'](application\/rss\+xml|application\/atom\+xml|application\/feed\+json)["'][^>]*href=["']([^"']*)["'][^>]*>/gi;
  
  while ((match = typeRegex.exec(html)) !== null) {
    const url = match[2];
    if (url) {
      try {
        const absoluteUrl = new URL(url, baseUrlObj.origin).href;
        if (!feedUrls.includes(absoluteUrl)) {
          feedUrls.push(absoluteUrl);
        }
      } catch (e) {
        console.warn(`無効なURL: ${url}`);
      }
    }
  }
  
  const commonPaths = [
    "/feed", "/rss", "/atom", "/feed.xml", "/rss.xml", "/atom.xml", 
    "/feed/", "/rss/", "/atom/", "/index.xml", "/feed.json"
  ];
  
  for (const path of commonPaths) {
    try {
      const potentialUrl = new URL(path, baseUrlObj.origin).href;
      if (!feedUrls.includes(potentialUrl)) {
        feedUrls.push(potentialUrl);
      }
    } catch (e) {
      console.warn(`無効なURL構築: ${path}`);
    }
  }
  
  return feedUrls;
}
