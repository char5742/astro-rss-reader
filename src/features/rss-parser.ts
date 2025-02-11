// feedParser.ts
export interface FeedItem {
  title: string;
  link: string;
  content: string;
  pubDate?: string;
}

export interface Feed {
  title: string;
  link: string;
  description: string;
  items: FeedItem[];
}

/**
 * XMLをパースし、RSS/Atomのフィードを解析する
 * @param xmlString XML形式の文字列
 * @returns Feedオブジェクト
 */
export function parseFeed(xmlString: string): Feed {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, "application/xml");

  // RSSかAtomか判別
  if (doc.documentElement.nodeName === "rss") {
    return parseRss(doc);
  }
  if (doc.documentElement.nodeName === "feed") {
    return parseAtom(doc);
  }
  throw new Error("RSS/Atom形式ではないか、解析に失敗しました。");
}

/**
 * RSS 2.0のパース
 */
function parseRss(doc: Document): Feed {
  const channel = doc.querySelector("channel");
  if (!channel) throw new Error("RSSフォーマットが不正です");

  return {
    title: getText(channel, "title"),
    link: getText(channel, "link"),
    description: getText(channel, "description"),
    items: Array.from(channel.querySelectorAll("item")).map((item) => ({
      title: getText(item, "title"),
      link: getText(item, "link"),
      content: getText(item, "description"),
      pubDate: getText(item, "pubDate"),
    })),
  };
}

/**
 * Atomのパース
 */
function parseAtom(doc: Document): Feed {
  const feed = doc.documentElement;

  return {
    title: getText(feed, "title"),
    link: getAtomLink(feed),
    description: getText(feed, "subtitle"),
    items: Array.from(feed.querySelectorAll("entry")).map((entry) => ({
      title: getText(entry, "title"),
      link: getAtomLink(entry),
      content: getText(entry, "content") || getText(entry, "summary"),
      pubDate: getText(entry, "updated") || getText(entry, "published"),
    })),
  };
}

/**
 * XMLノードから指定したタグのテキストを取得
 */
function getText(parent: Element, tagName: string): string {
  const element = parent.querySelector(tagName);
  return element ? element.textContent?.trim() || "" : "";
}

/**
 * Atomのlink要素を取得
 */
function getAtomLink(parent: Element): string {
  const link =
    parent.querySelector('link[rel="alternate"]') ||
    parent.querySelector("link");
  return link ? link.getAttribute("href") || "" : "";
}
