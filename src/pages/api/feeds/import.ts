import type { APIRoute } from "astro";
import { $feeds, $feedCategories } from "../../../store/feeds";
import { nanoid } from "nanoid";
import type { Feed, FeedCategory, FeedCategoryId, FeedId } from "../../../types/feed";
import { XMLParser } from "fast-xml-parser";

export const POST: APIRoute = async ({ request }) => {
  try {
    const opmlContent = await request.text();
    
    if (!opmlContent) {
      return new Response(JSON.stringify({ error: "OPMLデータが指定されていません" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      isArray: (name) => ["outline"].includes(name)
    });
    
    const parsedOpml = parser.parse(opmlContent);
    
    if (!parsedOpml.opml || !parsedOpml.opml.body) {
      return new Response(JSON.stringify({ error: "無効なOPMLフォーマットです" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    const existingFeeds = $feeds.get();
    const existingCategories = $feedCategories.get();
    
    const result = importFromOPML(parsedOpml.opml.body, existingFeeds, existingCategories);
    
    $feeds.set(result.feeds);
    $feedCategories.set(result.categories);
    
    return new Response(JSON.stringify({ 
      message: "OPMLを正常にインポートしました",
      count: result.importedCount
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("OPMLインポートエラー:", error);
    return new Response(JSON.stringify({ 
      error: "OPMLのインポート中にエラーが発生しました",
      details: String(error)
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

/**
 * OPMLからフィードとカテゴリーをインポートする
 */
function importFromOPML(
  opmlBody: any, 
  existingFeeds: Feed[], 
  existingCategories: FeedCategory[]
): { feeds: Feed[], categories: FeedCategory[], importedCount: number } {
  const outlines = opmlBody.outline || [];
  const newFeeds: Feed[] = [...existingFeeds];
  const newCategories: FeedCategory[] = [...existingCategories];
  let importedCount = 0;
  
  const categoryNameToId: Record<string, FeedCategoryId> = {};
  existingCategories.forEach(category => {
    categoryNameToId[category.name] = category.id;
  });
  
  const existingUrls = new Set(existingFeeds.map(feed => feed.url));
  
  outlines.forEach((outline: any) => {
    if (outline["@_type"] === "rss" || outline["@_xmlUrl"]) {
      const url = outline["@_xmlUrl"] || "";
      const title = outline["@_text"] || outline["@_title"] || url;
      
      if (!url || existingUrls.has(url)) {
        return;
      }
      
      newFeeds.push({
        id: nanoid() as FeedId,
        title,
        url,
        categoryIds: [],
        lastUpdated: new Date()
      });
      
      existingUrls.add(url);
      importedCount++;
    } else {
      const categoryName = outline["@_text"] || outline["@_title"] || "";
      if (!categoryName) return;
      
      let categoryId: FeedCategoryId;
      if (!categoryNameToId[categoryName]) {
        categoryId = nanoid() as FeedCategoryId;
        newCategories.push({
          id: categoryId,
          name: categoryName
        });
        categoryNameToId[categoryName] = categoryId;
      } else {
        categoryId = categoryNameToId[categoryName];
      }
      
      const subOutlines = outline.outline || [];
      subOutlines.forEach((subOutline: any) => {
        if (subOutline["@_type"] === "rss" || subOutline["@_xmlUrl"]) {
          const url = subOutline["@_xmlUrl"] || "";
          const title = subOutline["@_text"] || subOutline["@_title"] || url;
          
          if (!url || existingUrls.has(url)) {
            return;
          }
          
          newFeeds.push({
            id: nanoid() as FeedId,
            title,
            url,
            categoryIds: [categoryId],
            lastUpdated: new Date()
          });
          
          existingUrls.add(url);
          importedCount++;
        }
      });
    }
  });
  
  return { feeds: newFeeds, categories: newCategories, importedCount };
}
