import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import DOMPurify from 'isomorphic-dompurify';

export const GET: APIRoute = async ({ params }) => {
  const articleId = params.id;

  if (!articleId) {
    return new Response(
      JSON.stringify({
        error: "記事IDが必要です"
      }),
      { status: 400 }
    );
  }

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
      return new Response(
        JSON.stringify({
          error: "記事が見つかりません"
        }),
        { status: 404 }
      );
    }

    // HTMLの安全化
    const sanitizedContent = DOMPurify.sanitize(targetArticle.content);

    return new Response(
      JSON.stringify({
        success: true,
        article: {
          ...targetArticle,
          content: sanitizedContent
        }
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("エラーが発生しました:", error);
    return new Response(
      JSON.stringify({
        error: "サーバーエラーが発生しました"
      }),
      { status: 500 }
    );
  }
};