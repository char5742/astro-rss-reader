import { persistentAtom } from "@nanostores/persistent";
import type { UserSettings } from "~/types/user";

export const $settings = persistentAtom<UserSettings>(
  "settings",
  defaultSettings(),
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  },
);

function defaultSettings(): UserSettings {
  return {
    appearance: {
      theme: "system",
      fontSize: "medium",
    },
    notifications: {
      enabledLatestNotifications: false,
      enabledKeywordsNotifications: false,
      keywords: [],
    },
    account: {
      enabledSync: false,
    },
  };
}

export function updateSettings(settings: Partial<UserSettings>): void {
  $settings.set({
    ...$settings.get(),
    ...settings,
  });
}
