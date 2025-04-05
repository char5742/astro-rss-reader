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
  try {
    if (xmlString.trim().startsWith('{')) {
      try {
        const jsonObj = JSON.parse(xmlString);
        if (jsonObj.version && jsonObj.version.startsWith('https://jsonfeed.org/version/')) {
          return parseJsonFeed(jsonObj);
        }
      } catch (e) {
      }
    }

    const parser = new XMLParser({ 
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      isArray: (name) => ["item", "entry"].includes(name)
    });
    
    const jObj = parser.parse(xmlString);
    
    if (jObj.rss) {
      return parseRss(jObj.rss.channel);
    }
    if (jObj.feed) {
      return parseAtom(jObj.feed);
    }
    if (jObj["rdf:RDF"]) {
      return parseRdf(jObj["rdf:RDF"]);
    }
    return undefined;
  } catch (error) {
    console.error("フィード解析エラー:", error);
    return undefined;
  }
}

const parseRss = (channel: any): Feed => ({
  title: channel.title || "",
  link: channel.link || "",
  description: channel.description || "",
  items: Array.isArray(channel.item) ? channel.item.map((item: any) => ({
    title: item.title || "",
    link: item.link || (item.guid && item.guid["@_isPermaLink"] !== "false" ? item.guid : ""),
    content: item.description || item["content:encoded"] || "",
    pubDate: item.pubDate || item.pubDate || item["dc:date"],
  })) : [],
});

const parseAtom = (feed: any): Feed => ({
  title: feed.title || "",
  link: Array.isArray(feed.link) 
    ? feed.link.find((l: any) => l["@_rel"] === "self" || !l["@_rel"])?.["@_href"] || ""
    : (feed.link?.["@_href"] || feed.link || ""),
  description: feed.subtitle || feed.tagline || "",
  items: Array.from(feed.entry || []).map((entry: any) => {
    const link = Array.isArray(entry.link) 
      ? entry.link.find((l: any) => l["@_rel"] === "alternate" || !l["@_rel"])?.["@_href"] || "" 
      : (entry.link?.["@_href"] || entry.link || "");
    return {
      title: entry.title || "",
      link: link,
      content: entry.content || entry.summary || entry.description || "",
      pubDate: entry.updated || entry.published || entry.issued || entry.modified,
    };
  }),
});

const parseRdf = (feed: any): Feed => ({
  title: feed.channel?.title || "",
  link: feed.channel?.link || "",
  description: feed.channel?.description || "",
  items: Array.from(feed.item || []).map((item: any) => ({
    title: item.title || "",
    link: item.link || "",
    content: item.description || "",
    pubDate: item["dc:date"] || item.pubDate,
  })),
});

function isJsonFeed(obj: any): boolean {
  return obj && obj.version && obj.version.startsWith("https://jsonfeed.org/version/") && 
    Array.isArray(obj.items);
}

const parseJsonFeed = (feed: any): Feed => ({
  title: feed.title || "",
  link: feed.home_page_url || feed.feed_url || "",
  description: feed.description || "",
  items: feed.items.map((item: any) => ({
    title: item.title || "",
    link: item.url || item.external_url || "",
    content: item.content_html || item.content_text || "",
    pubDate: item.date_published || item.date_modified,
  })),
});
