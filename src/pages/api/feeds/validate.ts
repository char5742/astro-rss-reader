import type { APIRoute } from "astro";
import { getFeedMetadata, validateFeedUrl } from "~/features/feed/feed";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const feedUrl = url.searchParams.get("url");

  if (!feedUrl) {
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

  try {
    // フィードURLの検証
    const isValid = await validateFeedUrl(feedUrl);

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
    const response = await fetch(`/api/proxy?url=${encodeURIComponent(feedUrl)}`);
    const text = await response.text();

    // フィードのメタデータを取得
    const metadata = await getFeedMetadata(text);

    return new Response(
      JSON.stringify({
        success: true,
        title: metadata.title,
        description: metadata.description,
        imageUrl: metadata.imageUrl,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Feed validation error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : "フィードの検証中にエラーが発生しました",
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
