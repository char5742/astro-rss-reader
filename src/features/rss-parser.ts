import { Document, Element, Window, XMLParser } from "happy-dom";
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
export function parseFeed(xmlString: string): Feed | undefined {
  const parser = new XMLParser(new Window());
  const doc = parser.parse(xmlString);
  // RSSかAtomか判別
  if (doc.querySelector("rss")) {
    return parseRss(doc);
  }
  if (doc.querySelector("feed")) {
    return parseAtom(doc);
  }
  return undefined;
}

const parseRss = (channel: Document): Feed => ({
  title: getText(channel, "title"),
  link: getText(channel, "link"),
  description: getText(channel, "description"),
  items: Array.from(channel.querySelectorAll("item")).map((item) => ({
    title: getText(item, "title"),
    link: getText(item, "link"),
    content: getText(item, "description"),
    pubDate: getText(item, "pubDate"),
  })),
});

const parseAtom = (feed: Document): Feed => ({
  title: getText(feed, "title"),
  link: feed.querySelector("link")?.getAttribute("href") || "",
  description: getText(feed, "subtitle"),
  items: Array.from(feed.querySelectorAll("entry")).map((entry) => ({
    title: getText(entry, "title"),
    link: entry.querySelector("link")?.getAttribute("href") || "",
    content: getText(entry, "content") || getText(entry, "summary"),
    pubDate: getText(entry, "updated") || getText(entry, "published"),
  })),
});

const getText = (parent: Element | Document, selector: string): string =>
  parent.querySelector(selector)?.textContent?.trim() || "";
