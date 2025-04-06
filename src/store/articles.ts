/**
 * @module store/articles
 * @description 記事のステータスを管理するためのストアとユーティリティ関数を提供するモジュール
 *
 * このモジュールは、記事のステータス（既読、未読、保存済みなど）を管理するための
 * 永続的なストアと、ステータスを更新するためのユーティリティ関数を提供します。
 */
import { persistentAtom } from "@nanostores/persistent";
import { convertUrlToFeed } from "~/features/feed/feed-converter"; // convertUrlToFeed をインポート
import { $feeds } from "~/store/feeds"; // $feeds をインポート
import type { Article, ArticleId } from "~/types/article"; // Article 型をインポート
import { ArticleStatus } from "~/types/article";
import type { FeedId } from "~/types/feed"; // FeedId 型をインポート

/**
 * 記事データのキャッシュ有効期限（ミリ秒）
 * デフォルトは360日
 */
const CACHE_TTL = 360 * 24 * 60 * 60 * 1000;

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

/**
 * 記事データのキャッシュを管理する永続的なストア
 * キー: articleId, 値: Article
 */
export const $articleCache = persistentAtom<
  Record<ArticleId, Article>
>("articleCache", {}, { encode: JSON.stringify, decode: JSON.parse });

/**
 * 記事キャッシュのメタデータを管理する永続的なストア
 * キャッシュの作成時刻などを記録
 */
export const $articleCacheMeta = persistentAtom<
  Record<ArticleId, { timestamp: number, feedId: FeedId }>
>("articleCacheMeta", {}, { encode: JSON.stringify, decode: JSON.parse });

/**
 * フィードごとの記事IDリストを管理するストア
 * キー: feedId, 値: ArticleId[]
 */
export const $feedArticleIds = persistentAtom<
  Record<FeedId, ArticleId[]>
>("feedArticleIds", {}, { encode: JSON.stringify, decode: JSON.parse });

/**
 * 記事データをキャッシュに保存する
 * 
 * @param {Article} article - 保存する記事
 * @private
 */
function _cacheArticle(article: Article): void {
  const { id: articleId, feedId } = article;
  const timestamp = Date.now();
  
  // 記事データを保存
  const currentCache = $articleCache.get();
  $articleCache.set({
    ...currentCache,
    [articleId]: article
  });
  
  // メタデータを保存
  const currentMeta = $articleCacheMeta.get();
  $articleCacheMeta.set({
    ...currentMeta,
    [articleId]: { timestamp, feedId }
  });
  
  // フィードの記事IDリストを更新
  const currentFeedArticleIds = $feedArticleIds.get();
  const articleIds = currentFeedArticleIds[feedId] || [];
  if (!articleIds.includes(articleId)) {
    $feedArticleIds.set({
      ...currentFeedArticleIds,
      [feedId]: [...articleIds, articleId]
    });
  }
  
  console.info(`Cached article: ${articleId} for feed ${feedId}`);
}

/**
 * キャッシュから記事データを読み込む
 * 
 * @param {ArticleId} articleId - 記事ID
 * @returns {Article | null} 記事データ。キャッシュが無効または存在しない場合はnull
 * @private
 */
function _loadCachedArticle(articleId: ArticleId): Article | null {
  const cache = $articleCache.get();
  const meta = $articleCacheMeta.get();
  
  const article = cache[articleId];
  const metadata = meta[articleId];
  
  if (!article || !metadata) {
    return null;
  }
  
  const now = Date.now();
  
  // キャッシュが有効期限内かチェック
  if (now - metadata.timestamp > CACHE_TTL) {
    console.info(`Cache expired for article ${articleId}`);
    return null;
  }
  
  // JSONデシリアライズ後に失われた型情報を復元
  if (article.publishedAt && typeof article.publishedAt === 'string') {
    return {
      ...article,
      publishedAt: new Date(article.publishedAt)
    };
  }
  
  return article;
}

/**
 * フィードに関連するキャッシュ済み記事のリストを取得する
 * 
 * @param {FeedId} feedId - フィードID
 * @returns {Article[]} キャッシュから取得した有効な記事のリスト
 * @private
 */
function _getValidCachedArticlesForFeed(feedId: FeedId): Article[] {
  const feedArticleIds = $feedArticleIds.get()[feedId] || [];
  const validArticles: Article[] = [];
  
  for (const articleId of feedArticleIds) {
    const article = _loadCachedArticle(articleId);
    if (article) {
      validArticles.push(article);
    }
  }
  
  return validArticles;
}

/**
 * 指定されたフィードIDに紐づく記事のリストを取得する
 *
 * キャッシュに有効なデータがある場合はそれを使用し、
 * ない場合またはキャッシュが不完全な場合はリモートからフェッチして結果をキャッシュする
 *
 * @param {FeedId} feedId - 記事を取得するフィードのID
 * @returns {Promise<Article[]>} 記事のリスト
 */
export async function articlesByFeedId(feedId: FeedId): Promise<Article[]> {
  // キャッシュから記事リストを取得
  const cachedArticles = _getValidCachedArticlesForFeed(feedId);
  
  // キャッシュにある程度の記事がある場合はそれを返す
  // ここでは5件以上をキャッシュ十分と判断
  if (cachedArticles.length >= 5) {
    console.info(`Using ${cachedArticles.length} cached articles for feed ${feedId}`);
    return cachedArticles;
  }
  
  const feeds = $feeds.get();
  const feed = feeds.find((f) => f.id === feedId);

  if (!feed) {
    console.warn(`Feed with ID ${feedId} not found in $feeds store.`);
    return cachedArticles.length > 0 ? cachedArticles : []; // キャッシュがあれば使用
  }

  try {
    // convertUrlToFeed は外部からフィードを取得・解析するため非同期
    const { articles } = await convertUrlToFeed(feed.url);
    
    // 取得した記事データを個別にキャッシュ
    for (const article of articles) {
      _cacheArticle(article);
    }
    
    return articles;
  } catch (error) {
    console.error(`Error fetching or converting feed for URL ${feed.url}:`, error);
    return cachedArticles.length > 0 ? cachedArticles : []; // キャッシュがあれば使用
  }
}

/**
 * 指定されたフィードIDと記事IDに紐づく記事を取得する
 *
 * まず直接キャッシュから記事を検索し、見つからない場合はフィードを取得して探す
 *
 * @param {FeedId} feedId - 記事が属するフィードのID
 * @param {ArticleId} articleId - 取得する記事のID
 * @returns {Promise<Article | null>} 記事データ、見つからない場合は null
 */
export async function articleById(
  feedId: FeedId,
  articleId: ArticleId,
): Promise<Article | null> {
  // まずキャッシュから記事を直接検索
  const cachedArticle = _loadCachedArticle(articleId);
  if (cachedArticle) {
    return cachedArticle;
  }
  
  // キャッシュになければ、フィードから検索
  const articles = await articlesByFeedId(feedId);
  const article = articles.find((a) => a.id === articleId);
  
  // 見つかった記事をキャッシュ
  if (article) {
    _cacheArticle(article);
  }
  
  return article || null;
}

/**
 * キャッシュを強制的に更新する
 * 
 * @param {FeedId} feedId - 更新するフィードのID
 * @returns {Promise<Article[]>} 更新された記事のリスト
 */
export async function refreshArticles(feedId: FeedId): Promise<Article[]> {
  const feeds = $feeds.get();
  const feed = feeds.find((f) => f.id === feedId);

  if (!feed) {
    console.warn(`Feed with ID ${feedId} not found in $feeds store.`);
    return [];
  }

  try {
    const { articles } = await convertUrlToFeed(feed.url);
    
    // 取得した記事データを個別にキャッシュ
    for (const article of articles) {
      _cacheArticle(article);
    }
    
    return articles;
  } catch (error) {
    console.error(`Error refreshing articles for feed ${feedId}:`, error);
    return [];
  }
}
