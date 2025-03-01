import { atom } from "nanostores";
import { load, save } from "~/features/persistence/persistence";
import type { Tag } from "~/types/article";
import { v4 as uuidv4 } from 'uuid';

// タグデータのストア
export const $tags = atom<Tag[]>(loadTags());

// デフォルトのタグ
const defaultTags: Tag[] = [
  { id: "tech", name: "テクノロジー", color: "#3498db" },
  { id: "news", name: "ニュース", color: "#e74c3c" },
  { id: "dev", name: "開発", color: "#2ecc71" },
  { id: "ai", name: "AI", color: "#9b59b6" },
];

// タグの読み込み
function loadTags(): Tag[] {
  const tagsData = load("tags");
  if (tagsData) {
    try {
      return JSON.parse(tagsData);
    } catch (error) {
      console.error("Failed to parse tags data:", error);
    }
  }
  return defaultTags;
}

// タグの保存
function saveTags() {
  save("tags", JSON.stringify($tags.get()));
}

// タグの追加
export function addTag(name: string, color?: string): Tag {
  const id = uuidv4();
  const newTag: Tag = {
    id,
    name,
    color,
  };
  
  const tags = $tags.get();
  $tags.set([...tags, newTag]);
  saveTags();
  
  return newTag;
}

// タグの更新
export function updateTag(id: string, updates: Partial<Omit<Tag, "id">>): boolean {
  const tags = $tags.get();
  const tagIndex = tags.findIndex(tag => tag.id === id);
  
  if (tagIndex !== -1) {
    const updatedTags = [...tags];
    updatedTags[tagIndex] = {
      ...updatedTags[tagIndex],
      ...updates,
    };
    
    $tags.set(updatedTags);
    saveTags();
    return true;
  }
  
  return false;
}

// タグの削除
export function deleteTag(id: string): boolean {
  const tags = $tags.get();
  const filteredTags = tags.filter(tag => tag.id !== id);
  
  if (filteredTags.length < tags.length) {
    $tags.set(filteredTags);
    saveTags();
    return true;
  }
  
  return false;
}

// タグの取得
export function getTag(id: string): Tag | undefined {
  const tags = $tags.get();
  return tags.find(tag => tag.id === id);
}

// タグ名からIDを取得
export function getTagIdByName(name: string): string | undefined {
  const tags = $tags.get();
  const tag = tags.find(t => t.name === name);
  return tag?.id;
}

// 初期化（必要に応じて）
export function initializeTagStore() {
  if ($tags.get().length === 0) {
    $tags.set(defaultTags);
    saveTags();
  }
}

// 初期化を実行
initializeTagStore();
