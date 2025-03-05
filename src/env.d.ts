import type { AccountId } from "./types/account";

declare global {
  namespace App {
    interface Locals extends Record<string, any> {
      accountId: AccountId;
    }
    interface SessionData {
      accountId: AccountId | null;
    }
  }
}

export {};
