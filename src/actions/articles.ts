import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";
import { getCollection } from "astro:content";
import DOMPurify from 'isomorphic-dompurify';
import { ArticleIdSchema, ArticleStatus } from "~/types/article";

// 記事のブックマーク状態を切り替えるアクション
export const toggleBookmark = defineAction({
  input: z.object({
    articleId: ArticleIdSchema,
  }),
  handler: async ({ articleId }) => {
    try {
      // TODO: 実際のデータベース処理を実装
      // ここではモックレスポンスを返す
      return { success: true };
    } catch (error) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "ブックマークの切り替えに失敗しました",
      });
    }
  },
});

// 記事の内容を取得するアクション
export const getArticleContent = defineAction({
  input: z.object({
    articleId: ArticleIdSchema,
  }),
  handler: async ({ articleId }) => {
    try {
      // フィードコレクションから全ての記事を取得
      const feeds = await getCollection("feed");

      // 指定されたIDを持つ記事を検索
      let targetArticle = null;

      for (const feed of feeds) {
        const foundArticle = feed.data.articles.find(article => article.id === articleId);
        if (foundArticle) {
          targetArticle = {
            ...foundArticle,
            feedTitle: feed.data.feed.title
          };
          break;
        }
      }

      if (!targetArticle) {
        throw new ActionError({
          code: "NOT_FOUND",
          message: "記事が見つかりません",
        });
      }

      // HTMLの安全化
      const sanitizedContent = DOMPurify.sanitize(targetArticle.content);

      return {
        success: true,
        article: {
          ...targetArticle,
          content: sanitizedContent
        }
      };
    } catch (error) {
      if (error instanceof ActionError) {
        throw error;
      }
      console.error("エラーが発生しました:", error);
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "サーバーエラーが発生しました",
      });
    }
  },
});

// 記事のお気に入り状態を変更するアクション
export const toggleFavorite = defineAction({
  input: z.object({
    articleId: ArticleIdSchema,
    isFavorite: z.boolean(),
  }),
  handler: async ({ articleId, isFavorite }) => {
    try {
      // ここで実際のデータを更新する処理を実装
      // 本番では、データベースなどに保存する
      console.log(`記事ID: ${articleId} のお気に入り状態を ${isFavorite ? "追加" : "解除"} しました`);

      return {
        success: true,
        articleId,
        isFavorite
      };
    } catch (error) {
      console.error("エラーが発生しました:", error);
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "サーバーエラーが発生しました",
      });
    }
  },
});

// 記事のステータスを変更するアクション
export const updateArticleStatus = defineAction({
  input: z.object({
    articleId: ArticleIdSchema,
    status: z.nativeEnum(ArticleStatus),
  }),
  handler: async ({ articleId, status }) => {
    try {
      // ここで実際のデータを更新する処理を実装
      // 本番では、データベースなどに保存する
      console.log(`記事ID: ${articleId} のステータスを ${status} に更新しました`);

      return {
        success: true,
        articleId,
        status
      };
    } catch (error) {
      console.error("エラーが発生しました:", error);
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "サーバーエラーが発生しました",
      });
    }
  },
});
