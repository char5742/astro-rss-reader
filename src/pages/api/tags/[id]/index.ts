import type { APIRoute } from "astro";
import { deleteTag, getTag, updateTag } from "~/features/tag/tag-store";
import { removeAllArticlesFromTag } from "~/features/bookmark/bookmark-store";
import { z } from "zod";

// タグ更新のためのスキーマ
const UpdateTagSchema = z.object({
  name: z.string().min(1, "タグ名は必須です").optional(),
  color: z.string().optional(),
});

// 特定のタグの取得
export const GET: APIRoute = async ({ params }) => {
  const tagId = params.id;
  
  if (!tagId) {
    return new Response(
      JSON.stringify({ error: "タグIDが指定されていません" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  
  try {
    const tag = getTag(tagId);
    
    if (!tag) {
      return new Response(
        JSON.stringify({ error: "指定されたタグが見つかりません" }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    
    return new Response(JSON.stringify({ tag }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(`Failed to get tag ${tagId}:`, error);
    return new Response(
      JSON.stringify({ error: "タグの取得に失敗しました" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};

// タグの更新
export const PUT: APIRoute = async ({ request, params }) => {
  const tagId = params.id;
  
  if (!tagId) {
    return new Response(
      JSON.stringify({ error: "タグIDが指定されていません" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  
  try {
    const body = await request.json();
    const result = UpdateTagSchema.safeParse(body);
    
    if (!result.success) {
      return new Response(
        JSON.stringify({ 
          error: "無効なリクエスト形式です", 
          details: result.error.format() 
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    
    const success = updateTag(tagId, result.data);
    
    if (!success) {
      return new Response(
        JSON.stringify({ error: "指定されたタグが見つかりません" }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    
    const updatedTag = getTag(tagId);
    
    return new Response(JSON.stringify({ tag: updatedTag }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(`Failed to update tag ${tagId}:`, error);
    return new Response(
      JSON.stringify({ error: "タグの更新に失敗しました" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};

// タグの削除
export const DELETE: APIRoute = async ({ params }) => {
  const tagId = params.id;
  
  if (!tagId) {
    return new Response(
      JSON.stringify({ error: "タグIDが指定されていません" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  
  try {
    // タグに関連付けられた記事の関連付けをすべて削除
    removeAllArticlesFromTag(tagId);
    
    // タグを削除
    const success = deleteTag(tagId);
    
    if (!success) {
      return new Response(
        JSON.stringify({ error: "指定されたタグが見つかりません" }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(`Failed to delete tag ${tagId}:`, error);
    return new Response(
      JSON.stringify({ error: "タグの削除に失敗しました" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
