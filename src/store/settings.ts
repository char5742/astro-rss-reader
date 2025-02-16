import { atom } from "nanostores";
import { load, save } from "~/features/persistence/persistence";
import type { UserSettings } from "~/types/user";

export const $settings = atom<UserSettings>(loadSettings());

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

function loadSettings(): UserSettings {
  const settings = load("settings");
  console.log("Loaded settings", settings);
  return settings ? JSON.parse(settings) : defaultSettings();
}

export function updateSettings(settings: Partial<UserSettings>): void {
  $settings.set({ ...$settings.get(), ...settings });
  console.info("Updated settings", $settings.get());
  save("settings", JSON.stringify($settings.get()));
}
