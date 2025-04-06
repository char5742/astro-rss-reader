import type { APIRoute } from "astro";
import { $feedCategories } from "../../../store/feeds";
import type { FeedCategoryId } from "../../../types/feed";

export const GET: APIRoute = async ({ params }) => {
  try {
    const id = params.id as FeedCategoryId;
    
    if (!id) {
      return new Response(JSON.stringify({ error: "カテゴリーIDが指定されていません" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    const categories = $feedCategories.get();
    const category = categories.find(c => c.id === id);
    
    if (!category) {
      return new Response(JSON.stringify({ error: "カテゴリーが見つかりません" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    return new Response(JSON.stringify({ category }), {
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
