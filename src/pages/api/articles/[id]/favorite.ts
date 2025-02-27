import type { APIRoute } from "astro";

// 実際の環境では、データベースなどと連携してお気に入り状態を変更
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
    const { isFavorite } = body;

    // isFavoriteがブール値かチェック
    if (typeof isFavorite !== 'boolean') {
      return new Response(
        JSON.stringify({
          error: "isFavoriteはブール値である必要があります"
        }),
        { status: 400 }
      );
    }

    // ここで実際のデータを更新する処理を実装
    // 本番では、データベースなどに保存する
    console.log(`記事ID: ${articleId} のお気に入り状態を ${isFavorite ? "追加" : "解除"} しました`);

    return new Response(
      JSON.stringify({
        success: true,
        articleId,
        isFavorite
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