import type { APIRoute } from "astro";
import { addFeed, getCategoryIdByName } from "~/features/feed/feed-store";
import { getFeedMetadata, validateFeedUrl } from "~/features/feed/feed";

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const url = formData.get("url") as string;
    let title = formData.get("title") as string;
    const categoryValues = formData.getAll("category") as string[];

    if (!url) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "URLが指定されていません",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // フィードURLの検証
    const isValid = await validateFeedUrl(url);
    if (!isValid) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "有効なRSSまたはAtomフィードではありません",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // フィードのコンテンツを取得
    const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
    const text = await response.text();

    // フィードのメタデータを取得
    const metadata = await getFeedMetadata(text);

    // タイトルが指定されていない場合はメタデータから取得
    if (!title && metadata.title) {
      title = metadata.title;
    }

    // カテゴリーIDを取得
    const categoryIds = categoryValues
      .map(name => getCategoryIdByName(name))
      .filter(id => id !== undefined) as any[]; // FeedCategoryIdとして扱う

    // フィードを追加
    const newFeed = addFeed({
      title: title || "無題のフィード",
      url,
      categoryIds,
      description: metadata.description,
      imageUrl: metadata.imageUrl,
      lastUpdated: new Date(),
    });

    return new Response(
      JSON.stringify({
        success: true,
        feed: newFeed,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Feed creation error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : "フィードの追加中にエラーが発生しました",
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

// フィード一覧を取得するGETエンドポイント
export const GET: APIRoute = async () => {
  try {
    // フィード一覧を取得（実際にはfeed-storeから取得する）
    const { $feeds } = await import("~/features/feed/feed-store");
    const feeds = $feeds.get();

    return new Response(
      JSON.stringify({
        success: true,
        feeds,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Feed list error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : "フィード一覧の取得中にエラーが発生しました",
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
