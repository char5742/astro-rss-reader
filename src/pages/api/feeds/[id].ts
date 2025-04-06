import type { APIRoute } from "astro";
import { $feeds } from "~/store/feeds";
import type { FeedId } from "~/types/feed";

export const GET: APIRoute = async ({ params }) => {
  try {
    const id = params.id as FeedId;
    
    if (!id) {
      return new Response(JSON.stringify({ error: "フィードIDが指定されていません" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    const feeds = $feeds.get();
    const feed = feeds.find(f => f.id === id);
    
    if (!feed) {
      return new Response(JSON.stringify({ error: "フィードが見つかりません" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    return new Response(JSON.stringify({ feed }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
