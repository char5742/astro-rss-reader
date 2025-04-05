/**
 * @module store/feeds
 * @description フィードを管理するためのストアとユーティリティ関数を提供するモジュール
 *
 * このモジュールは、アプリケーションのフィード（RSSフィード、Atomフィードなど）を
 * 管理するための永続的なストアと、フィードを操作するためのユーティリティ関数を提供します。
 */
import { persistentAtom } from "@nanostores/persistent";
import { nanoid } from "nanoid";
import type { AccountId } from "~/types/account";
import type { Feed, FeedCategory, FeedCategoryId, FeedId } from "~/types/feed";

/**
 * フィードを管理する永続的なストア
 *
 * このストアは、アプリケーションのフィードを保持し、
 * 値はJSONとしてシリアライズされ、永続化エンジンによってデータベースに保存されます。
 */
export const $feeds = persistentAtom<Feed[]>(
  "feeds",
  [],
  { encode: JSON.stringify, decode: JSON.parse },
);

/**
 * フィードカテゴリーを管理する永続的なストア
 *
 * このストアは、アプリケーションのフィードカテゴリーを保持し、
 * 値はJSONとしてシリアライズされ、永続化エンジンによってデータベースに保存されます。
 */
export const $feedCategories = persistentAtom<FeedCategory[]>(
  "feedCategories",
  [],
  { encode: JSON.stringify, decode: JSON.parse },
);

/**
 * フィードを追加する
 *
 * 新しいフィードをストアに追加します。
 *
 * @param {AccountId} accountId - フィードを追加するアカウントのID
 * @param {Omit<Feed, "id" | "lastUpdated">} feedData - 追加するフィードのデータ
 * @returns {FeedId} 追加されたフィードのID
 */
export function addFeed(
  accountId: AccountId,
  feedData: Omit<Feed, "id" | "lastUpdated">,
): FeedId {
  const id = nanoid() as FeedId;
  const feed: Feed = {
    ...feedData,
    id,
    lastUpdated: new Date(),
  };
  
  const currentFeeds = $feeds.get();
  $feeds.set([...currentFeeds, feed]);
  console.info("Added feed", feed);
  
  return id;
}

/**
 * フィードを更新する
 *
 * 既存のフィードを更新します。
 *
 * @param {AccountId} accountId - フィードを更新するアカウントのID
 * @param {FeedId} feedId - 更新するフィードのID
 * @param {Partial<Omit<Feed, "id">>} feedData - 更新するフィードのデータ
 * @returns {boolean} 更新が成功したかどうか
 */
export function updateFeed(
  accountId: AccountId,
  feedId: FeedId,
  feedData: Partial<Omit<Feed, "id">>,
): boolean {
  const currentFeeds = $feeds.get();
  const feedIndex = currentFeeds.findIndex(feed => feed.id === feedId);
  
  if (feedIndex === -1) {
    console.warn(`Feed with ID ${feedId} not found`);
    return false;
  }
  
  const updatedFeed: Feed = {
    ...currentFeeds[feedIndex],
    ...feedData,
    lastUpdated: new Date(),
  };
  
  const updatedFeeds = [...currentFeeds];
  updatedFeeds[feedIndex] = updatedFeed;
  
  $feeds.set(updatedFeeds);
  console.info("Updated feed", updatedFeed);
  
  return true;
}

/**
 * フィードを削除する
 *
 * 指定されたIDのフィードをストアから削除します。
 *
 * @param {AccountId} accountId - フィードを削除するアカウントのID
 * @param {FeedId} feedId - 削除するフィードのID
 * @returns {boolean} 削除が成功したかどうか
 */
export function deleteFeed(
  accountId: AccountId,
  feedId: FeedId,
): boolean {
  const currentFeeds = $feeds.get();
  const updatedFeeds = currentFeeds.filter(feed => feed.id !== feedId);
  
  if (updatedFeeds.length === currentFeeds.length) {
    console.warn(`Feed with ID ${feedId} not found`);
    return false;
  }
  
  $feeds.set(updatedFeeds);
  console.info(`Deleted feed with ID ${feedId}`);
  
  return true;
}

/**
 * カテゴリーを追加する
 *
 * 新しいカテゴリーをストアに追加します。
 *
 * @param {AccountId} accountId - カテゴリーを追加するアカウントのID
 * @param {string} name - カテゴリー名
 * @returns {FeedCategoryId} 追加されたカテゴリーのID
 */
export function addCategory(
  accountId: AccountId,
  name: string,
): FeedCategoryId {
  const id = nanoid() as FeedCategoryId;
  const category: FeedCategory = {
    id,
    name,
  };
  
  const currentCategories = $feedCategories.get();
  $feedCategories.set([...currentCategories, category]);
  console.info("Added category", category);
  
  return id;
}

/**
 * カテゴリーを更新する
 *
 * 既存のカテゴリーを更新します。
 *
 * @param {AccountId} accountId - カテゴリーを更新するアカウントのID
 * @param {FeedCategoryId} categoryId - 更新するカテゴリーのID
 * @param {string} name - 新しいカテゴリー名
 * @returns {boolean} 更新が成功したかどうか
 */
export function updateCategory(
  accountId: AccountId,
  categoryId: FeedCategoryId,
  name: string,
): boolean {
  const currentCategories = $feedCategories.get();
  const categoryIndex = currentCategories.findIndex(category => category.id === categoryId);
  
  if (categoryIndex === -1) {
    console.warn(`Category with ID ${categoryId} not found`);
    return false;
  }
  
  const updatedCategory: FeedCategory = {
    ...currentCategories[categoryIndex],
    name,
  };
  
  const updatedCategories = [...currentCategories];
  updatedCategories[categoryIndex] = updatedCategory;
  
  $feedCategories.set(updatedCategories);
  console.info("Updated category", updatedCategory);
  
  return true;
}

/**
 * カテゴリーを削除する
 *
 * 指定されたIDのカテゴリーをストアから削除します。
 * 削除されたカテゴリーに属するフィードからそのカテゴリーIDを削除します。
 *
 * @param {AccountId} accountId - カテゴリーを削除するアカウントのID
 * @param {FeedCategoryId} categoryId - 削除するカテゴリーのID
 * @returns {boolean} 削除が成功したかどうか
 */
export function deleteCategory(
  accountId: AccountId,
  categoryId: FeedCategoryId,
): boolean {
  const currentCategories = $feedCategories.get();
  const updatedCategories = currentCategories.filter(category => category.id !== categoryId);
  
  if (updatedCategories.length === currentCategories.length) {
    console.warn(`Category with ID ${categoryId} not found`);
    return false;
  }
  
  $feedCategories.set(updatedCategories);
  console.info(`Deleted category with ID ${categoryId}`);
  
  const currentFeeds = $feeds.get();
  const updatedFeeds = currentFeeds.map(feed => {
    if (feed.categoryIds.includes(categoryId)) {
      return {
        ...feed,
        categoryIds: feed.categoryIds.filter(id => id !== categoryId),
      };
    }
    return feed;
  });
  
  $feeds.set(updatedFeeds);
  
  return true;
}

/**
 * OPMLからフィードをインポートする
 *
 * OPMLファイルからフィードをインポートします。
 *
 * @param {AccountId} accountId - フィードをインポートするアカウントのID
 * @param {string} opmlContent - OPMLファイルの内容
 * @returns {number} インポートされたフィードの数
 */
export function importFromOPML(
  accountId: AccountId,
  opmlContent: string,
): number {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(opmlContent, "text/xml");
    const outlines = xmlDoc.querySelectorAll("outline[type='rss'], outline[xmlUrl]");
    
    const currentFeeds = $feeds.get();
    const newFeeds: Feed[] = [];
    
    outlines.forEach((outline) => {
      const title = outline.getAttribute("title") || outline.getAttribute("text") || "";
      const url = outline.getAttribute("xmlUrl") || "";
      
      if (url && !currentFeeds.some(feed => feed.url === url)) {
        const id = nanoid() as FeedId;
        newFeeds.push({
          id,
          title,
          url,
          categoryIds: [],
          lastUpdated: new Date(),
        });
      }
    });
    
    if (newFeeds.length > 0) {
      $feeds.set([...currentFeeds, ...newFeeds]);
      console.info(`Imported ${newFeeds.length} feeds from OPML`);
    }
    
    return newFeeds.length;
  } catch (error) {
    console.error("Error importing from OPML:", error);
    return 0;
  }
}

/**
 * フィードをOPMLにエクスポートする
 *
 * 現在のフィードをOPML形式にエクスポートします。
 *
 * @param {AccountId} accountId - フィードをエクスポートするアカウントのID
 * @returns {string} OPML形式の文字列
 */
export function exportToOPML(accountId: AccountId): string {
  const feeds = $feeds.get();
  const categories = $feedCategories.get();
  
  let opml = `<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head>
    <title>Astro RSS Reader Feeds</title>
    <dateCreated>${new Date().toISOString()}</dateCreated>
  </head>
  <body>`;
  
  const feedsByCategory: Record<string, Feed[]> = {};
  
  const uncategorizedFeeds = feeds.filter(feed => feed.categoryIds.length === 0);
  
  categories.forEach(category => {
    feedsByCategory[category.id] = feeds.filter(feed => 
      feed.categoryIds.includes(category.id)
    );
  });
  
  categories.forEach(category => {
    if (feedsByCategory[category.id]?.length > 0) {
      opml += `
    <outline text="${category.name}">`;
      
      feedsByCategory[category.id].forEach(feed => {
        opml += `
      <outline type="rss" text="${feed.title}" title="${feed.title}" xmlUrl="${feed.url}" />`;
      });
      
      opml += `
    </outline>`;
    }
  });
  
  uncategorizedFeeds.forEach(feed => {
    opml += `
    <outline type="rss" text="${feed.title}" title="${feed.title}" xmlUrl="${feed.url}" />`;
  });
  
  opml += `
  </body>
</opml>`;
  
  return opml;
}
