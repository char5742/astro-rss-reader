import type { APIRoute } from "astro";
import { $feedCategories } from "../../../store/feeds";
import { nanoid } from "nanoid";
import type { FeedCategory, FeedCategoryId } from "../../../types/feed";

export const GET: APIRoute = async () => {
  try {
    const categories = $feedCategories.get();
    
    return new Response(JSON.stringify({ categories }), {
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

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { id, name } = data;
    
    if (!name) {
      return new Response(JSON.stringify({ error: "カテゴリー名は必須です" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    const categories = $feedCategories.get();
    
    if (id) {
      const index = categories.findIndex(c => c.id === id);
      
      if (index === -1) {
        return new Response(JSON.stringify({ error: "カテゴリーが見つかりません" }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
      
      const updatedCategories = [...categories];
      updatedCategories[index] = {
        ...categories[index],
        name
      };
      
      $feedCategories.set(updatedCategories);
      
      return new Response(JSON.stringify({ 
        message: "カテゴリーを更新しました",
        category: updatedCategories[index]
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } else {
      const newCategory: FeedCategory = {
        id: nanoid() as FeedCategoryId,
        name
      };
      
      $feedCategories.set([...categories, newCategory]);
      
      return new Response(JSON.stringify({ 
        message: "カテゴリーを追加しました",
        category: newCategory
      }), {
        status: 201,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { id } = data;
    
    if (!id) {
      return new Response(JSON.stringify({ error: "カテゴリーIDは必須です" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    const categories = $feedCategories.get();
    const index = categories.findIndex(c => c.id === id);
    
    if (index === -1) {
      return new Response(JSON.stringify({ error: "カテゴリーが見つかりません" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    const updatedCategories = categories.filter(c => c.id !== id);
    $feedCategories.set(updatedCategories);
    
    return new Response(JSON.stringify({ 
      message: "カテゴリーを削除しました"
    }), {
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
