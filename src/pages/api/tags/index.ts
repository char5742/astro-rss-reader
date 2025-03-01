import type { APIRoute } from "astro";
import { $tags, addTag, deleteTag, updateTag } from "~/features/tag/tag-store";
import { z } from "zod";

// タグ作成のためのスキーマ
const CreateTagSchema = z.object({
  name: z.string().min(1, "タグ名は必須です"),
  color: z.string().optional(),
});

// タグ更新のためのスキーマ
const UpdateTagSchema = z.object({
  name: z.string().min(1, "タグ名は必須です").optional(),
  color: z.string().optional(),
});

// タグ一覧の取得
export const GET: APIRoute = async () => {
  try {
    const tags = $tags.get();
    
    return new Response(JSON.stringify({ tags }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Failed to get tags:", error);
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

// 新しいタグの作成
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const result = CreateTagSchema.safeParse(body);
    
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
    
    const { name, color } = result.data;
    const newTag = addTag(name, color);
    
    return new Response(JSON.stringify({ tag: newTag }), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Failed to create tag:", error);
    return new Response(
      JSON.stringify({ error: "タグの作成に失敗しました" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
