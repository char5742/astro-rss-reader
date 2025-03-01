import { atom } from "nanostores";
import { load, save } from "~/features/persistence/persistence";
import type { ArticleId } from "~/types/article";
import { ArticleStatus } from "~/types/article";

// 記事のステータスを管理するストア
export const $articleStatuses = atom<Record<string, ArticleStatus>>(
  loadArticleStatuses(),
);

// 記事のステータスを読み込む
function loadArticleStatuses(): Record<string, ArticleStatus> {
  const statuses = load("articleStatuses");
  return statuses ? JSON.parse(statuses) : {};
}

// 記事のステータスを更新する
export function updateArticleStatus(
  articleId: ArticleId,
  status: ArticleStatus,
): void {
  const statuses = $articleStatuses.get();
  const newStatuses = { ...statuses, [articleId]: status };

  $articleStatuses.set(newStatuses);
  save("articleStatuses", JSON.stringify(newStatuses));
}

// 記事のステータスを取得する
export function getArticleStatus(articleId: ArticleId): ArticleStatus {
  return $articleStatuses.get()[articleId] || ArticleStatus.UNREAD;
}
