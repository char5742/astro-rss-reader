import type { APIRoute } from "astro";
import { deleteFeed, getFeed } from "~/features/feed/feed-store";

export const DELETE: APIRoute = async ({ params }) => {
  const id = params.id;

  if (!id) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "フィードIDが指定されていません",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    // フィードが存在するか確認
    const feed = getFeed(id as any);
    if (!feed) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "指定されたIDのフィードが見つかりません",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // フィードを削除
    const deleted = deleteFeed(id as any);

    if (deleted) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "フィードが正常に削除されました",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: "フィードの削除に失敗しました",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  } catch (error) {
    console.error("Feed deletion error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : "フィードの削除中にエラーが発生しました",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};

// 個別のフィード情報を取得するGETエンドポイント
export const GET: APIRoute = async ({ params }) => {
  const id = params.id;

  if (!id) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "フィードIDが指定されていません",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    // フィードを取得
    const feed = getFeed(id as any);

    if (feed) {
      return new Response(
        JSON.stringify({
          success: true,
          feed,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: "指定されたIDのフィードが見つかりません",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  } catch (error) {
    console.error("Feed retrieval error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : "フィード情報の取得中にエラーが発生しました",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
