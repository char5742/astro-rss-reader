import { defineMiddleware, sequence } from "astro:middleware";
import { setPersistentEngine } from "@nanostores/persistent";
import { load, remove, save } from "./features/persistence/persistence";
import type { AccountId } from "./types/account";
import type { PersistentEvent, PersistentListener, PersistentStore } from "@nanostores/persistent";

let listeners: PersistentListener[] = [];

function onChange(key: string, newValue: any) {
  const event: PersistentEvent = { key, newValue };
  for (const i of listeners) i(event);
}

const events = {
  addEventListener(key: string, callback: PersistentListener) {
    listeners.push(callback);
  },
  removeEventListener(key: string, callback: PersistentListener) {
    listeners = listeners.filter((i) => i !== callback);
  },
  perKey: false,
};

async function setAccountStorage(accountId: AccountId): Promise<void> {
  const storage: PersistentStore = new Proxy(
    {},
    {
      set(_, key: string, value: string) {
        save(accountId, key, value).catch(err => 
          console.error(`Error saving ${key}:`, err)
        );
        onChange(key, value);
        return true;
      },
      get(_, key: string) {
        return "{}";
      },
      deleteProperty(_, key: string) {
        remove(accountId, key).catch(err => 
          console.error(`Error removing ${key}:`, err)
        );
        onChange(key, undefined);
        return true;
      },
    },
  );

  setPersistentEngine(storage, events);
  
  try {
    const keys = ["settings", "articleStatuses"];
    for (const key of keys) {
      load(accountId, key).then(value => {
        if (value) {
          onChange(key, value);
        }
      }).catch(err => {
        console.error(`Error loading ${key}:`, err);
      });
    }
  } catch (error) {
    console.error("Error initializing account storage:", error);
  }
}

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
  await setAccountStorage(accountId);
  return next();
});

export const onRequest = sequence(authenticate);
