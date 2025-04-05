/**
 * @module actions/feeds
 * @description フィード管理に関するサーバーアクションを提供するモジュール
 *
 * このモジュールは、フィードの追加、編集、削除などの操作を行うためのサーバーアクションを提供します。
 */
import { feeds as staticFeeds } from "../data/feeds";
import type { AccountId } from "../types/account";
import { persistentAtom } from "@nanostores/persistent";

/**
 * フィードの型定義
 */
export interface Feed {
  name: string;
  url: string;
  categories: string[];
}

/**
 * ユーザーごとのフィード設定を管理するストア
 */
export const $userFeeds = persistentAtom<Record<AccountId, Feed[]>>(
  "userFeeds",
  {},
  { encode: JSON.stringify, decode: JSON.parse }
);

/**
 * 指定されたアカウントのフィード一覧を取得する
 *
 * @param {AccountId} accountId - フィードを取得するアカウントのID
 * @returns {Feed[]} フィードの配列
 */
export function getFeeds(accountId: AccountId): Feed[] {
  const userFeedsRecord = $userFeeds.get();
  const userFeeds = userFeedsRecord[accountId] || [];
  
  if (userFeeds.length === 0) {
    return staticFeeds;
  }
  
  return userFeeds;
}

/**
 * 新しいフィードを追加する
 *
 * @param {AccountId} accountId - フィードを追加するアカウントのID
 * @param {Feed} feed - 追加するフィードの情報
 * @returns {boolean} 追加が成功したかどうか
 */
export function addFeed(accountId: AccountId, feed: Feed): boolean {
  try {
    const userFeedsRecord = $userFeeds.get();
    const userFeeds = userFeedsRecord[accountId] || [];
    
    if (userFeeds.some(existingFeed => existingFeed.url === feed.url)) {
      console.error(`Feed with URL ${feed.url} already exists`);
      return false;
    }
    
    const updatedFeeds = [...userFeeds, feed];
    
    $userFeeds.set({
      ...userFeedsRecord,
      [accountId]: updatedFeeds
    });
    
    console.info(`Added feed ${feed.name} for account ${accountId}`);
    return true;
  } catch (error) {
    console.error("Error adding feed:", error);
    return false;
  }
}

/**
 * 既存のフィードを更新する
 *
 * @param {AccountId} accountId - フィードを更新するアカウントのID
 * @param {string} feedUrl - 更新するフィードのURL
 * @param {Partial<Feed>} updatedFeed - 更新するフィードの情報
 * @returns {boolean} 更新が成功したかどうか
 */
export function updateFeed(
  accountId: AccountId,
  feedUrl: string,
  updatedFeed: Partial<Feed>
): boolean {
  try {
    const userFeedsRecord = $userFeeds.get();
    const userFeeds = userFeedsRecord[accountId] || [];
    
    const feedIndex = userFeeds.findIndex(feed => feed.url === feedUrl);
    if (feedIndex === -1) {
      console.error(`Feed with URL ${feedUrl} not found`);
      return false;
    }
    
    const updatedFeeds = [...userFeeds];
    updatedFeeds[feedIndex] = {
      ...updatedFeeds[feedIndex],
      ...updatedFeed
    };
    
    $userFeeds.set({
      ...userFeedsRecord,
      [accountId]: updatedFeeds
    });
    
    console.info(`Updated feed ${feedUrl} for account ${accountId}`);
    return true;
  } catch (error) {
    console.error("Error updating feed:", error);
    return false;
  }
}

/**
 * フィードを削除する
 *
 * @param {AccountId} accountId - フィードを削除するアカウントのID
 * @param {string} feedUrl - 削除するフィードのURL
 * @returns {boolean} 削除が成功したかどうか
 */
export function deleteFeed(accountId: AccountId, feedUrl: string): boolean {
  try {
    const userFeedsRecord = $userFeeds.get();
    const userFeeds = userFeedsRecord[accountId] || [];
    
    const feedIndex = userFeeds.findIndex(feed => feed.url === feedUrl);
    if (feedIndex === -1) {
      console.error(`Feed with URL ${feedUrl} not found`);
      return false;
    }
    
    const updatedFeeds = userFeeds.filter(feed => feed.url !== feedUrl);
    
    $userFeeds.set({
      ...userFeedsRecord,
      [accountId]: updatedFeeds
    });
    
    console.info(`Deleted feed ${feedUrl} for account ${accountId}`);
    return true;
  } catch (error) {
    console.error("Error deleting feed:", error);
    return false;
  }
}

/**
 * カテゴリー一覧を取得する
 *
 * @param {AccountId} accountId - カテゴリーを取得するアカウントのID
 * @returns {string[]} カテゴリーの配列
 */
export function getCategories(accountId: AccountId): string[] {
  const feeds = getFeeds(accountId);
  
  const categories = new Set<string>();
  feeds.forEach(feed => {
    feed.categories.forEach(category => {
      categories.add(category);
    });
  });
  
  return Array.from(categories);
}
