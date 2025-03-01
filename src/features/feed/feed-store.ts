import { atom } from "nanostores";
import { load, save } from "~/features/persistence/persistence";
import type { Feed, FeedCategory, FeedId } from "~/types/feed";
import { v4 as uuidv4 } from 'uuid';

// フィードデータのストア
export const $feeds = atom<Feed[]>(loadFeeds());
export const $feedCategories = atom<FeedCategory[]>(loadFeedCategories());

// デフォルトのカテゴリー
const defaultCategories: FeedCategory[] = [
  { id: "tech" as any, name: "テクノロジー" },
  { id: "news" as any, name: "ニュース" },
  { id: "entertainment" as any, name: "エンタメ" },
];

// フィードの読み込み
function loadFeeds(): Feed[] {
  const feedsData = load("feeds");
  if (feedsData) {
    try {
      return JSON.parse(feedsData);
    } catch (error) {
      console.error("Failed to parse feeds data:", error);
    }
  }
  return [];
}

// カテゴリーの読み込み
function loadFeedCategories(): FeedCategory[] {
  const categoriesData = load("feedCategories");
  if (categoriesData) {
    try {
      return JSON.parse(categoriesData);
    } catch (error) {
      console.error("Failed to parse feed categories data:", error);
    }
  }
  return defaultCategories;
}

// フィードの保存
function saveFeeds() {
  save("feeds", JSON.stringify($feeds.get()));
}

// カテゴリーの保存
function saveFeedCategories() {
  save("feedCategories", JSON.stringify($feedCategories.get()));
}

// フィードの追加
export function addFeed(feedData: Omit<Feed, "id">): Feed {
  const id = uuidv4() as unknown as FeedId;
  const newFeed: Feed = {
    id,
    ...feedData,
  };
  
  const feeds = $feeds.get();
  $feeds.set([...feeds, newFeed]);
  saveFeeds();
  
  return newFeed;
}

// フィードの削除
export function deleteFeed(id: FeedId): boolean {
  const feeds = $feeds.get();
  const filteredFeeds = feeds.filter(feed => feed.id !== id);
  
  if (filteredFeeds.length < feeds.length) {
    $feeds.set(filteredFeeds);
    saveFeeds();
    return true;
  }
  
  return false;
}

// カテゴリーの追加
export function addCategory(name: string): FeedCategory {
  const id = uuidv4() as any;
  const newCategory: FeedCategory = {
    id,
    name,
  };
  
  const categories = $feedCategories.get();
  $feedCategories.set([...categories, newCategory]);
  saveFeedCategories();
  
  return newCategory;
}

// カテゴリーの削除
export function deleteCategory(id: string): boolean {
  const categories = $feedCategories.get();
  const filteredCategories = categories.filter(category => category.id !== id);
  
  if (filteredCategories.length < categories.length) {
    $feedCategories.set(filteredCategories);
    saveFeedCategories();
    
    // カテゴリーを使用しているフィードからそのカテゴリーを削除
    const feeds = $feeds.get();
    const updatedFeeds = feeds.map(feed => ({
      ...feed,
      categoryIds: feed.categoryIds.filter(catId => catId !== id),
    }));
    
    $feeds.set(updatedFeeds);
    saveFeeds();
    
    return true;
  }
  
  return false;
}

// フィードの取得
export function getFeed(id: FeedId): Feed | undefined {
  const feeds = $feeds.get();
  return feeds.find(feed => feed.id === id);
}

// カテゴリーの取得
export function getCategory(id: string): FeedCategory | undefined {
  const categories = $feedCategories.get();
  return categories.find(category => category.id === id);
}

// カテゴリー名からIDを取得
export function getCategoryIdByName(name: string): string | undefined {
  const categories = $feedCategories.get();
  const category = categories.find(cat => cat.name === name);
  return category?.id;
}

// 初期化（必要に応じて）
export function initializeFeedStore() {
  if ($feedCategories.get().length === 0) {
    $feedCategories.set(defaultCategories);
    saveFeedCategories();
  }
}

// 初期化を実行
initializeFeedStore();
