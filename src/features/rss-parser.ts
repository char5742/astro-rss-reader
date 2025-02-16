import { XMLParser } from "fast-xml-parser";
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
  const parser = new XMLParser();
  const jObj = parser.parse(xmlString);
  // RSSかAtomか判別
  if (jObj.rss) {
    return parseRss(jObj.rss);
  }
  if (jObj.feed) {
    return parseAtom(jObj.feed);
  }
  return undefined;
}

/**
 * RSS 2.0のパース
 */
function parseRss(rss: any): Feed {
  const channel = rss.channel;

  return {
    title: channel.title,
    link: channel.link,
    description: channel.description,
    items: Array.from(channel.item || []).map((item: any) => ({
      title: item.title,
      link: item.link,
      content: item.description || "",
      pubDate: item.pubDate,
    })),
  };
}

/**
 * Atomのパース
 */
function parseAtom(feed: any): Feed {
  return {
    title: feed.title,
    link: feed.link,
    description: feed.subtitle,
    items: Array.from(feed.entry || []).map((entry: any) => ({
      title: entry.title,
      link: Array.isArray(entry.link) ? entry.link[0] : entry.link,
      content: entry.content || entry.summary || "",
      pubDate: entry.updated || entry.published,
    })),
  };
}
