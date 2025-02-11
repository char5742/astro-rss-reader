import type { AccountId } from "./account";

const UserIdBrand = Symbol();
export type UserId = string & { [UserIdBrand]: undefined };
export type User = Readonly<{
  id: UserId;
  accountId: AccountId;
  name: string;
  settings: UserSettings;
}>;

export type UserSettings = Readonly<{
  defaultView: "list" | "grid";
  theme: "light" | "dark" | "system";
  autoMarkAsRead: boolean;
  notificationsEnabled: boolean;
  refreshInterval: number; // 分単位
}>;
