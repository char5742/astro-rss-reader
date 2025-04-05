import type { APIRoute } from "astro";
import { $feeds } from "../../../store/feeds";
import { nanoid } from "nanoid";
import type { Feed, FeedId } from "../../../types/feed";

export const GET: APIRoute = async () => {
  try {
    const feeds = $feeds.get();
    
    return new Response(JSON.stringify({ feeds }), {
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
    const { id, title, url, description, categoryIds } = data;
    
    if (!title || !url) {
      return new Response(JSON.stringify({ error: "タイトルとURLは必須です" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    const feeds = $feeds.get();
    
    if (id) {
      const index = feeds.findIndex(f => f.id === id);
      
      if (index === -1) {
        return new Response(JSON.stringify({ error: "フィードが見つかりません" }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
      
      const updatedFeeds = [...feeds];
      updatedFeeds[index] = {
        ...feeds[index],
        title,
        url,
        description,
        categoryIds: categoryIds || [],
        lastUpdated: new Date()
      };
      
      $feeds.set(updatedFeeds);
      
      return new Response(JSON.stringify({ 
        message: "フィードを更新しました",
        feed: updatedFeeds[index]
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } else {
      const newFeed: Feed = {
        id: nanoid() as FeedId,
        title,
        url,
        description,
        categoryIds: categoryIds || [],
        lastUpdated: new Date()
      };
      
      $feeds.set([...feeds, newFeed]);
      
      return new Response(JSON.stringify({ 
        message: "フィードを追加しました",
        feed: newFeed
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
      return new Response(JSON.stringify({ error: "フィードIDは必須です" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    const feeds = $feeds.get();
    const index = feeds.findIndex(f => f.id === id);
    
    if (index === -1) {
      return new Response(JSON.stringify({ error: "フィードが見つかりません" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    const updatedFeeds = feeds.filter(f => f.id !== id);
    $feeds.set(updatedFeeds);
    
    return new Response(JSON.stringify({ 
      message: "フィードを削除しました"
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
