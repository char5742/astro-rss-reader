import type { APIRoute } from "astro";
import { discoverFeeds } from "~/features/feed/feed-discovery";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url).searchParams.get("url");
  
  if (!url) {
    return new Response(JSON.stringify({ error: "URLが指定されていません" }), { 
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const feeds = await discoverFeeds(url);
    
    return new Response(JSON.stringify({ feeds }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error(`フィード検出エラー: ${error}`);
    return new Response(JSON.stringify({ error: `フィード検出エラー: ${error}` }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
