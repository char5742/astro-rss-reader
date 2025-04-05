import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url).searchParams.get("url");
  
  if (!url) {
    return new Response("URLが指定されていません", { status: 400 });
  }

  try {
    const response = await fetch(url);
    
    const headers = new Headers();
    response.headers.forEach((value, key) => {
      headers.set(key, value);
    });
    
    headers.set("Access-Control-Allow-Origin", "*");
    
    return new Response(await response.text(), {
      status: response.status,
      headers
    });
  } catch (error) {
    console.error(`プロキシエラー: ${error}`);
    return new Response(`フェッチエラー: ${error}`, { status: 500 });
  }
};
