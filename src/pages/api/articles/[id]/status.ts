import type { APIRoute } from "astro";
import { ArticleStatus } from "~/types/article";

// 実際の環境では、データベースなどと連携してステータスを変更
export const POST: APIRoute = async ({ request, params }) => {
  try {
    const articleId = params.id;

    if (!articleId) {
      return new Response(
        JSON.stringify({
          error: "記事IDが必要です"
        }),
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    // ステータスが有効な値かチェック
    if (!Object.values(ArticleStatus).includes(status)) {
      return new Response(
        JSON.stringify({
          error: "無効なステータスです"
        }),
        { status: 400 }
      );
    }

    // ここで実際のデータを更新する処理を実装
    // 本番では、データベースなどに保存する
    console.log(`記事ID: ${articleId} のステータスを ${status} に更新しました`);

    return new Response(
      JSON.stringify({
        success: true,
        articleId,
        status
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