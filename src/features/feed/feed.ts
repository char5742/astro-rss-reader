export interface FeedMetadata {
  title?: string;
  description?: string;
  imageUrl?: string;
}

export class FeedError extends Error {
  constructor(message: string, error?: unknown) {
    super(message + (error ? `: ${error}` : ""));
    this.name = "FeedError";
  }
}

export async function validateFeedUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
    const contentType = response.headers.get("content-type");
    
    if (!contentType) {
      throw new FeedError("Content-Typeが取得できません");
    }
    
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
    throw new FeedError("フィードURLにアクセスできません", error);
  }
}

import { XMLParser } from "fast-xml-parser";

export async function getFeedMetadata(text: string): Promise<FeedMetadata> {
  try {
    if (text.trim().startsWith('{')) {
      try {
        const jsonObj = JSON.parse(text);
        if (jsonObj.version && jsonObj.version.startsWith('https://jsonfeed.org/version/')) {
          return {
            title: jsonObj.title,
            description: jsonObj.description,
            imageUrl: jsonObj.icon || jsonObj.favicon,
          };
        }
      } catch (e) {
      }
    }

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });
    const jObj = parser.parse(text);

    const title = jObj.rss?.channel?.title || jObj.feed?.title || jObj.rdf?.["rdf:RDF"]?.channel?.title;
    const description = jObj.rss?.channel?.description || jObj.feed?.subtitle || jObj.feed?.tagline || jObj.rdf?.["rdf:RDF"]?.channel?.description;
    const imageUrl = jObj.rss?.channel?.image?.url || jObj.feed?.logo || jObj.feed?.icon;

    return {
      title,
      description: description || undefined,
      imageUrl: imageUrl || undefined,
    };
  } catch (error) {
    console.error("フィードメタデータ解析エラー:", error);
    return {};
  }
}
