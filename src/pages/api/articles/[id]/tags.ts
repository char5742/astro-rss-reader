import type { APIRoute } from "astro";
import type { ArticleId } from "~/types/article";
import { 
  addTagToArticle, 
  getTagIdsForArticle, 
  removeTagFromArticle 
} from "~/features/bookmark/bookmark-store";
import { getTag } from "~/features/tag/tag-store";
import { z } from "zod";

// タグ追加のためのスキーマ
const AddTagSchema = z.object({
  tagId: z.string().min(1, "タグIDは必須です"),
});

// タグ削除のためのスキーマ
const RemoveTagSchema = z.object({
  tagId: z.string().min(1, "タグIDは必須です"),
});

// 記事に付けられたタグの取得
export const GET: APIRoute = async ({ params }) => {
  const articleId = params.id as ArticleId;
  
  if (!articleId) {
    return new Response(
      JSON.stringify({ error: "記事IDが指定されていません" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  
  try {
    const tagIds = getTagIdsForArticle(articleId);
    const tags = tagIds.map(id => getTag(id)).filter(Boolean);
    
    return new Response(JSON.stringify({ tags }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(`Failed to get tags for article ${articleId}:`, error);
    return new Response(
      JSON.stringify({ error: "記事のタグ取得に失敗しました" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};

// 記事にタグを追加
export const POST: APIRoute = async ({ request, params }) => {
  const articleId = params.id as ArticleId;
  
  if (!articleId) {
    return new Response(
      JSON.stringify({ error: "記事IDが指定されていません" }),
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
    const result = AddTagSchema.safeParse(body);
    
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
    
    const { tagId } = result.data;
    
    // タグが存在するか確認
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
    
    // タグを記事に追加
    const bookmarkTag = addTagToArticle(articleId, tagId);
    
    return new Response(JSON.stringify({ success: true, tag, bookmarkTag }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(`Failed to add tag to article ${articleId}:`, error);
    return new Response(
      JSON.stringify({ error: "記事へのタグ追加に失敗しました" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};

// 記事からタグを削除
export const DELETE: APIRoute = async ({ request, params }) => {
  const articleId = params.id as ArticleId;
  
  if (!articleId) {
    return new Response(
      JSON.stringify({ error: "記事IDが指定されていません" }),
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
    const result = RemoveTagSchema.safeParse(body);
    
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
    
    const { tagId } = result.data;
    
    // タグを記事から削除
    const success = removeTagFromArticle(articleId, tagId);
    
    if (!success) {
      return new Response(
        JSON.stringify({ error: "指定された記事とタグの関連付けが見つかりません" }),
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
    console.error(`Failed to remove tag from article ${articleId}:`, error);
    return new Response(
      JSON.stringify({ error: "記事からのタグ削除に失敗しました" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
