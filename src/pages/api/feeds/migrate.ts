import type { APIRoute } from "astro";
import { feeds as fixedFeeds } from "~/data/feeds";
import { nanoid } from "nanoid";
import { $feeds, $feedCategories } from "~/store/feeds";
import type { Feed, FeedCategory, FeedCategoryId, FeedId } from "~/types/feed";

export const GET: APIRoute = async () => {
  try {
    const existingFeeds = $feeds.get();
    const existingCategories = $feedCategories.get();
    
    if (existingFeeds.length > 0 || existingCategories.length > 0) {
      return new Response(JSON.stringify({ 
        message: "すでにデータが移行されています",
        migrated: false
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    const uniqueCategories = new Set<string>();
    fixedFeeds.forEach(feed => {
      feed.categories.forEach(category => {
        uniqueCategories.add(category);
      });
    });
    
    const categoryMap: Record<string, FeedCategoryId> = {};
    const newCategories: FeedCategory[] = Array.from(uniqueCategories).map(name => {
      const id = nanoid() as FeedCategoryId;
      categoryMap[name] = id;
      return { id, name };
    });
    
    const newFeeds: Feed[] = fixedFeeds.map(feed => ({
      id: nanoid() as FeedId,
      url: feed.url,
      title: feed.name,
      categoryIds: feed.categories.map(name => categoryMap[name]),
      lastUpdated: new Date(),
    }));
    
    $feedCategories.set(newCategories);
    $feeds.set(newFeeds);
    
    return new Response(JSON.stringify({ 
      message: "データを正常に移行しました",
      migrated: true,
      feedCount: newFeeds.length,
      categoryCount: newCategories.length
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("データ移行エラー:", error);
    return new Response(JSON.stringify({ 
      error: "データ移行中にエラーが発生しました",
      details: String(error)
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
