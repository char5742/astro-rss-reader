import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get("url");

  if (!targetUrl) {
    return new Response(
      JSON.stringify({
        error: "URLが指定されていません",
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
    const response = await fetch(targetUrl);
    
    // レスポンスヘッダーをコピー
    const headers = new Headers();
    response.headers.forEach((value, key) => {
      // CORSヘッダーは除外
      if (!key.toLowerCase().startsWith("access-control-")) {
        headers.set(key, value);
      }
    });
    
    // Content-Typeを設定
    const contentType = response.headers.get("content-type");
    if (contentType) {
      headers.set("Content-Type", contentType);
    }
    
    // レスポンスを返す
    return new Response(await response.text(), {
      status: response.status,
      headers,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response(
      JSON.stringify({
        error: "プロキシリクエストに失敗しました",
        message: error instanceof Error ? error.message : "不明なエラー",
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
