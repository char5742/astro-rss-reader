import { defineMiddleware, sequence } from "astro:middleware";

/**
 * 認証ミドルウェア
 */
const authenticate = defineMiddleware(async (context, next) => {
  // ログイン、サインアップページへのアクセスは許可
  if (
    context.url.pathname.startsWith("/_actions/login") ||
    context.url.pathname.startsWith("/_actions/signup")
  ) {
    return next();
  }
  const isAuthenticated = await context.session?.has("accountId");

  // 認証されていない場合は、ログインページにリダイレクト
  if (!isAuthenticated && !context.url.pathname.startsWith("/auth/")) {
    return context.redirect("/auth/login");
  }
  // もし認証済みで、ログイン、サインアップページにアクセスした場合は、トップページにリダイレクト
  if (isAuthenticated && context.url.pathname.startsWith("/auth/")) {
    return context.redirect("/");
  }
  return next();
});

export const onRequest = sequence(authenticate);
