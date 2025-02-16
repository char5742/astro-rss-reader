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

import { XMLParser } from "fast-xml-parser";

/**
 * XMLをパースし、RSS/Atomのフィードを解析する
 * @param xmlString XML形式の文字列
 * @returns Feedオブジェクト
 */
export function parseFeed(xmlString: string): Feed | undefined {
  const parser = new XMLParser();
  const jObj = parser.parse(xmlString);
  // RSSかAtomか判別
  if (jObj.rss) {
    return parseRss(jObj.rss.channel);
  }
  if (jObj.feed) {
    return parseAtom(jObj.feed);
  }
  return undefined;
}

const parseRss = (channel: any): Feed => ({
  title: channel.title,
  link: channel.link,
  description: channel.description,
  items: channel.item.map((item: any) => ({
    title: item.title,
    link: item.link,
    content: item.description,
    pubDate: item.pubDate,
  })),
});

const parseAtom = (feed: any): Feed => ({
  title: feed.title,
  link: feed.link,
  description: feed.subtitle,
  items: Array.from(feed.entry || []).map((entry: any) => ({
    title: entry.title,
    link: Array.isArray(entry.link) ? entry.link[0] : entry.link,
    content: entry.content || entry.summary,
    pubDate: entry.updated || entry.published,
  })),
});
