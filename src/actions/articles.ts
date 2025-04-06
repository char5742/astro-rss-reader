import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import DOMPurify from "isomorphic-dompurify";
import { articleById, updateArticleStatus as updateArticleStatusStore } from "~/store/articles";
import { $feeds } from "~/store/feeds";
import { ArticleIdSchema, ArticleStatus } from "~/types/article";

// 記事の内容を取得するアクション
export const getArticleContent = defineAction({
  input: z.object({
    articleId: ArticleIdSchema,
  }),
  handler: async ({ articleId }) => {
    try {
      // フィードコレクションから全ての記事を取得
      const feeds = await $feeds.get();

      // 指定されたIDを持つ記事を検索
      let targetArticle = null;

      for (const feed of feeds) {
        const foundArticle =await articleById(feed.id, articleId);
        
        if (foundArticle) {
          targetArticle = {
            ...foundArticle,
            feedTitle: feed.title,
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
          content: sanitizedContent,
        },
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

// 記事のステータスを変更するアクション
export const updateArticleStatus = defineAction({
  input: z.object({
    articleId: ArticleIdSchema,
    status: z.nativeEnum(ArticleStatus),
  }),
  handler: async ({ articleId, status }) => {
    try {
      // 記事のステータスを更新
      updateArticleStatusStore(articleId, status);
      console.log(
        `記事ID: ${articleId} のステータスを ${status} に更新しました`,
      );

      return {
        success: true,
        articleId,
        status,
      };
    } catch (error) {
      console.error("ステータス更新エラー:", error);
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "サーバーエラーが発生しました",
      });
    }
  },
});
