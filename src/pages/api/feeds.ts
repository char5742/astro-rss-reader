import type { APIRoute } from "astro";
import { addFeed, deleteFeed, updateFeed, type Feed } from "../../actions/feeds";
import type { AccountId } from "../../types/account";

/**
 * フィード追加のAPIエンドポイント
 */
export const POST: APIRoute = async ({ request, locals }) => {
  const accountId = locals.accountId;
  
  if (!accountId) {
    return new Response(JSON.stringify({ error: "認証が必要です" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  
  try {
    const feedData = await request.json() as Feed;
    
    if (!feedData.name || !feedData.url) {
      return new Response(JSON.stringify({ error: "フィード名とURLは必須です" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    
    const success = addFeed(accountId, feedData);
    
    if (success) {
      return new Response(JSON.stringify({ success: true, message: "フィードを追加しました" }), {
        status: 201,
        headers: {
          "Content-Type": "application/json"
        }
      });
    } else {
      return new Response(JSON.stringify({ error: "フィードの追加に失敗しました" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
  } catch (error) {
    console.error("Error adding feed:", error);
    return new Response(JSON.stringify({ error: "リクエストの処理中にエラーが発生しました" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};

/**
 * フィード更新のAPIエンドポイント
 */
export const PUT: APIRoute = async ({ request, locals }) => {
  const accountId = locals.accountId;
  
  if (!accountId) {
    return new Response(JSON.stringify({ error: "認証が必要です" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  
  try {
    const { feedUrl, updatedFeed } = await request.json() as { feedUrl: string, updatedFeed: Partial<Feed> };
    
    if (!feedUrl) {
      return new Response(JSON.stringify({ error: "更新対象のフィードURLは必須です" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    
    const success = updateFeed(accountId, feedUrl, updatedFeed);
    
    if (success) {
      return new Response(JSON.stringify({ success: true, message: "フィードを更新しました" }), {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      });
    } else {
      return new Response(JSON.stringify({ error: "フィードの更新に失敗しました" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
  } catch (error) {
    console.error("Error updating feed:", error);
    return new Response(JSON.stringify({ error: "リクエストの処理中にエラーが発生しました" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};

/**
 * フィード削除のAPIエンドポイント
 */
export const DELETE: APIRoute = async ({ request, locals }) => {
  const accountId = locals.accountId;
  
  if (!accountId) {
    return new Response(JSON.stringify({ error: "認証が必要です" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  
  try {
    const { feedUrl } = await request.json() as { feedUrl: string };
    
    if (!feedUrl) {
      return new Response(JSON.stringify({ error: "削除対象のフィードURLは必須です" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    
    const success = deleteFeed(accountId, feedUrl);
    
    if (success) {
      return new Response(JSON.stringify({ success: true, message: "フィードを削除しました" }), {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      });
    } else {
      return new Response(JSON.stringify({ error: "フィードの削除に失敗しました" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
  } catch (error) {
    console.error("Error deleting feed:", error);
    return new Response(JSON.stringify({ error: "リクエストの処理中にエラーが発生しました" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
