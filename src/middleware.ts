import { defineMiddleware, sequence } from "astro:middleware";
import "./store";
import { setAccountStorage } from "./store";

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
  const accountId = await context.session?.get("accountId");
  const isAuthenticated = !!accountId;

  // 認証されていない場合は、ログインページにリダイレクト
  if (!isAuthenticated) {
    // 既にログインページにいる場合は、次のミドルウェアまたはハンドラに進む
    if (context.url.pathname.startsWith("/auth/")) return next();
    return context.redirect("/auth/login");
  }
  // もし認証済みで、ログイン、サインアップページにアクセスした場合は、トップページにリダイレクト
  if (context.url.pathname.startsWith("/auth/")) {
    return context.redirect("/");
  }

  // 認証済みの場合は、次のミドルウェアまたはハンドラに進む
  context.locals.accountId = accountId;
  setAccountStorage(accountId);
  return next();
});

export const onRequest = sequence(authenticate);
