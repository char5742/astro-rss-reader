/**
 * @module store/articles
 * @description 記事のステータスを管理するためのストアとユーティリティ関数を提供するモジュール
 *
 * このモジュールは、記事のステータス（既読、未読、保存済みなど）を管理するための
 * 永続的なストアと、ステータスを更新するためのユーティリティ関数を提供します。
 */
import { persistentAtom } from "@nanostores/persistent";
import type { ArticleId } from "~/types/article";
import { ArticleStatus } from "~/types/article";

/**
 * 記事のステータスを管理する永続的なストア
 *
 * このストアは、各記事のIDをキー、ステータスを値とするオブジェクトを保持します。
 * 値はJSONとしてシリアライズされ、永続化エンジンによってデータベースに保存されます。
 *
 * @example
 * ```typescript
 * import { $articleStatuses } from '~/store/articles';
 * import { ArticleStatus } from '~/types/article';
 *
 * // すべての記事のステータスを取得
 * const allStatuses = $articleStatuses.get();
 *
 * // 特定の記事のステータスを取得
 * const articleStatus = allStatuses['article123'] || ArticleStatus.UNREAD;
 *
 * // 直接ステータスを更新（通常は updateArticleStatus 関数を使用）
 * $articleStatuses.set({
 *   ...allStatuses,
 *   'article123': ArticleStatus.READ
 * });
 * ```
 */
export const $articleStatuses = persistentAtom<
  Record<ArticleId, ArticleStatus>
>("articleStatuses", {}, { encode: JSON.stringify, decode: JSON.parse });

/**
 * 指定された記事IDのステータスを取得する
 *
 * 指定された記事IDに対応するステータスをストアから取得します。
 * 記事IDが存在しない場合は、デフォルト値としてArticleStatus.UNREADを返します。
 *
 * @param {ArticleId} id - ステータスを取得する記事のID
 * @returns {ArticleStatus} 記事のステータス（既読、未読、保存済みなど）
 *
 * @example
 * ```typescript
 * import { $articleStatusBy } from '~/store/articles';
 * import { ArticleStatus } from '~/types/article';
 *
 * // 特定の記事のステータスを取得
 * const articleStatus = $articleStatusBy('article123');
 *
 * // ステータスが未読の場合の処理
 * if (articleStatus === ArticleStatus.UNREAD) {
 *   console.log('この記事は未読です。');
 * }
 * ```
 */
export const $articleStatusBy = (id: ArticleId) => {
  return { get: () => $articleStatuses.get()[id] ?? ArticleStatus.UNREAD };
};

/**
 * 記事のステータスを更新する
 *
 * 指定された記事IDのステータスを更新し、変更をストアに反映します。
 * この関数は、既存のステータスを保持しながら、指定された記事のステータスのみを更新します。
 *
 * @param {ArticleId} articleId - 更新する記事のID
 * @param {ArticleStatus} status - 設定する新しいステータス
 * @returns {void}
 *
 * @example
 * ```typescript
 * import { updateArticleStatus } from '~/store/articles';
 * import { ArticleStatus } from '~/types/article';
 *
 * // 記事を既読に設定
 * updateArticleStatus('article123', ArticleStatus.READ);
 *
 * // 記事を保存済みに設定
 * updateArticleStatus('article456', ArticleStatus.SAVED);
 * ```
 */
export function updateArticleStatus(
  articleId: ArticleId,
  status: ArticleStatus,
): void {
  const statuses = $articleStatuses.get();
  const newStatuses = {
    ...statuses,
    [articleId]: status,
  };

  $articleStatuses.set(newStatuses);
}
