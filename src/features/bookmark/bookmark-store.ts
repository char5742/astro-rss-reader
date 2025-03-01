import { atom } from "nanostores";
import { load, save } from "~/features/persistence/persistence";
import type { ArticleId } from "~/types/article";
import { v4 as uuidv4 } from 'uuid';

// 記事とタグの関連付けを管理する型
export interface BookmarkTag {
  id: string;
  articleId: ArticleId;
  tagId: string;
  createdAt: Date;
}

// ブックマークタグのストア
export const $bookmarkTags = atom<BookmarkTag[]>(loadBookmarkTags());

// ブックマークタグの読み込み
function loadBookmarkTags(): BookmarkTag[] {
  const bookmarkTagsData = load("bookmarkTags");
  if (bookmarkTagsData) {
    try {
      const parsed = JSON.parse(bookmarkTagsData);
      // Date文字列をDateオブジェクトに変換
      return parsed.map((tag: any) => ({
        ...tag,
        createdAt: new Date(tag.createdAt),
      }));
    } catch (error) {
      console.error("Failed to parse bookmark tags data:", error);
    }
  }
  return [];
}

// ブックマークタグの保存
function saveBookmarkTags() {
  save("bookmarkTags", JSON.stringify($bookmarkTags.get()));
}

// 記事にタグを追加
export function addTagToArticle(articleId: ArticleId, tagId: string): BookmarkTag {
  const bookmarkTags = $bookmarkTags.get();
  
  // 既に同じタグが付いているか確認
  const existingTag = bookmarkTags.find(
    bt => bt.articleId === articleId && bt.tagId === tagId
  );
  
  if (existingTag) {
    return existingTag;
  }
  
  const newBookmarkTag: BookmarkTag = {
    id: uuidv4(),
    articleId,
    tagId,
    createdAt: new Date(),
  };
  
  $bookmarkTags.set([...bookmarkTags, newBookmarkTag]);
  saveBookmarkTags();
  
  return newBookmarkTag;
}

// 記事からタグを削除
export function removeTagFromArticle(articleId: ArticleId, tagId: string): boolean {
  const bookmarkTags = $bookmarkTags.get();
  const filteredTags = bookmarkTags.filter(
    bt => !(bt.articleId === articleId && bt.tagId === tagId)
  );
  
  if (filteredTags.length < bookmarkTags.length) {
    $bookmarkTags.set(filteredTags);
    saveBookmarkTags();
    return true;
  }
  
  return false;
}

// 記事に付けられたすべてのタグIDを取得
export function getTagIdsForArticle(articleId: ArticleId): string[] {
  const bookmarkTags = $bookmarkTags.get();
  return bookmarkTags
    .filter(bt => bt.articleId === articleId)
    .map(bt => bt.tagId);
}

// タグが付けられたすべての記事IDを取得
export function getArticleIdsForTag(tagId: string): ArticleId[] {
  const bookmarkTags = $bookmarkTags.get();
  return bookmarkTags
    .filter(bt => bt.tagId === tagId)
    .map(bt => bt.articleId);
}

// 記事のすべてのタグを削除
export function removeAllTagsFromArticle(articleId: ArticleId): boolean {
  const bookmarkTags = $bookmarkTags.get();
  const filteredTags = bookmarkTags.filter(bt => bt.articleId !== articleId);
  
  if (filteredTags.length < bookmarkTags.length) {
    $bookmarkTags.set(filteredTags);
    saveBookmarkTags();
    return true;
  }
  
  return false;
}

// タグに関連するすべての記事の関連付けを削除
export function removeAllArticlesFromTag(tagId: string): boolean {
  const bookmarkTags = $bookmarkTags.get();
  const filteredTags = bookmarkTags.filter(bt => bt.tagId !== tagId);
  
  if (filteredTags.length < bookmarkTags.length) {
    $bookmarkTags.set(filteredTags);
    saveBookmarkTags();
    return true;
  }
  
  return false;
}
