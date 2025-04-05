import { persistentAtom } from "@nanostores/persistent";
import { save, load } from "../features/persistence/persistence";
import type { AccountId } from "../types/account";
import type { Feed, FeedCategory, FeedCategoryId, FeedId } from "../types/feed";
import { v4 as uuidv4 } from "uuid";

export const $feedOrder = persistentAtom<FeedId[]>(
  "feed-order",
  [],
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);

export const $feedCategories = persistentAtom<FeedCategory[]>(
  "feed-categories",
  [],
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);

export const $feeds = persistentAtom<Feed[]>(
  "feeds",
  [],
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);

export function setFeedStorage(accountId: AccountId) {
  $feedOrder.listen((value) => {
    save(accountId, "feed-order", JSON.stringify(value));
  });

  $feedCategories.listen((value) => {
    save(accountId, "feed-categories", JSON.stringify(value));
  });

  $feeds.listen((value) => {
    save(accountId, "feeds", JSON.stringify(value));
  });

  const orderData = load(accountId, "feed-order");
  if (orderData) {
    $feedOrder.set(JSON.parse(orderData) as FeedId[]);
  }

  const categoriesData = load(accountId, "feed-categories");
  if (categoriesData) {
    $feedCategories.set(JSON.parse(categoriesData) as FeedCategory[]);
  }

  const feedsData = load(accountId, "feeds");
  if (feedsData) {
    $feeds.set(JSON.parse(feedsData) as Feed[]);
  }
}

export function addFeed(feed: Omit<Feed, "id">): FeedId {
  const id = uuidv4() as FeedId;
  const newFeed: Feed = {
    ...feed,
    id,
  };
  
  const currentFeeds = $feeds.get();
  $feeds.set([...currentFeeds, newFeed]);
  
  const currentOrder = $feedOrder.get();
  $feedOrder.set([...currentOrder, id]);
  
  return id;
}

export function updateFeed(id: FeedId, feed: Partial<Omit<Feed, "id">>): void {
  const currentFeeds = $feeds.get();
  const index = currentFeeds.findIndex((f) => f.id === id);
  
  if (index !== -1) {
    const updatedFeed = {
      ...currentFeeds[index],
      ...feed,
    };
    
    const newFeeds = [...currentFeeds];
    newFeeds[index] = updatedFeed;
    $feeds.set(newFeeds);
  }
}

export function deleteFeed(id: FeedId): void {
  const currentFeeds = $feeds.get();
  $feeds.set(currentFeeds.filter((feed) => feed.id !== id));
  
  const currentOrder = $feedOrder.get();
  $feedOrder.set(currentOrder.filter((feedId) => feedId !== id));
}

export function updateFeedOrder(newOrder: FeedId[]): void {
  $feedOrder.set(newOrder);
}

export function addCategory(name: string): FeedCategoryId {
  const id = uuidv4() as FeedCategoryId;
  const newCategory: FeedCategory = {
    id,
    name,
  };
  
  const currentCategories = $feedCategories.get();
  $feedCategories.set([...currentCategories, newCategory]);
  
  return id;
}

export function updateCategory(id: FeedCategoryId, name: string): void {
  const currentCategories = $feedCategories.get();
  const index = currentCategories.findIndex((c) => c.id === id);
  
  if (index !== -1) {
    const updatedCategory = {
      ...currentCategories[index],
      name,
    };
    
    const newCategories = [...currentCategories];
    newCategories[index] = updatedCategory;
    $feedCategories.set(newCategories);
  }
}

export function deleteCategory(id: FeedCategoryId): void {
  const currentCategories = $feedCategories.get();
  $feedCategories.set(currentCategories.filter((category) => category.id !== id));
  
  const currentFeeds = $feeds.get();
  const updatedFeeds = currentFeeds.map((feed) => ({
    ...feed,
    categoryIds: feed.categoryIds.filter((categoryId) => categoryId !== id),
  }));
  
  $feeds.set(updatedFeeds);
}

export async function importOpml(opmlContent: string): Promise<{
  addedFeeds: number;
  errors: string[];
}> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(opmlContent, "text/xml");
  const outlines = doc.querySelectorAll("outline[xmlUrl]");
  
  const errors: string[] = [];
  let addedFeeds = 0;
  
  for (const outline of outlines) {
    try {
      const title = outline.getAttribute("title") || outline.getAttribute("text") || "";
      const url = outline.getAttribute("xmlUrl") || "";
      const categoryName = outline.parentElement?.getAttribute("title") || outline.parentElement?.getAttribute("text") || "未分類";
      
      if (!url) {
        errors.push(`フィードURLが見つかりません: ${title}`);
        continue;
      }
      
      let categoryId: FeedCategoryId | undefined;
      const categories = $feedCategories.get();
      const existingCategory = categories.find((c) => c.name === categoryName);
      
      if (existingCategory) {
        categoryId = existingCategory.id;
      } else {
        categoryId = addCategory(categoryName);
      }
      
      addFeed({
        title,
        url,
        categoryIds: categoryId ? [categoryId] : [],
        lastUpdated: new Date(),
      });
      
      addedFeeds++;
    } catch (error) {
      errors.push(`インポートエラー: ${error}`);
    }
  }
  
  return { addedFeeds, errors };
}

export function exportOpml(): string {
  const feeds = $feeds.get();
  const categories = $feedCategories.get();
  
  let opml = `<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head>
    <title>RSS Reader Feeds</title>
    <dateCreated>${new Date().toISOString()}</dateCreated>
  </head>
  <body>`;
  
  const feedsByCategory: Record<string, Feed[]> = {};
  
  const uncategorizedFeeds: Feed[] = [];
  
  feeds.forEach((feed) => {
    if (feed.categoryIds.length === 0) {
      uncategorizedFeeds.push(feed);
    } else {
      feed.categoryIds.forEach((categoryId) => {
        if (!feedsByCategory[categoryId]) {
          feedsByCategory[categoryId] = [];
        }
        feedsByCategory[categoryId].push(feed);
      });
    }
  });
  
  categories.forEach((category) => {
    const categoryFeeds = feedsByCategory[category.id] || [];
    
    if (categoryFeeds.length > 0) {
      opml += `\n    <outline text="${category.name}" title="${category.name}">`;
      
      categoryFeeds.forEach((feed) => {
        opml += `\n      <outline text="${feed.title}" title="${feed.title}" type="rss" xmlUrl="${feed.url}" />`;
      });
      
      opml += `\n    </outline>`;
    }
  });
  
  if (uncategorizedFeeds.length > 0) {
    opml += `\n    <outline text="未分類" title="未分類">`;
    
    uncategorizedFeeds.forEach((feed) => {
      opml += `\n      <outline text="${feed.title}" title="${feed.title}" type="rss" xmlUrl="${feed.url}" />`;
    });
    
    opml += `\n    </outline>`;
  }
  
  opml += `\n  </body>\n</opml>`;
  
  return opml;
}
