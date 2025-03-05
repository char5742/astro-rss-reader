/**
 * @module store/settings
 * @description ユーザー設定を管理するためのストアとユーティリティ関数を提供するモジュール
 *
 * このモジュールは、アプリケーションのユーザー設定（テーマ、フォントサイズ、通知設定など）を
 * 管理するための永続的なストアと、設定を更新するためのユーティリティ関数を提供します。
 */
import { persistentAtom } from "@nanostores/persistent";
import type { AccountId } from "~/types/account";
import type { UserSettings } from "~/types/user";

/**
 * ユーザー設定を管理する永続的なストア
 *
 * このストアは、アプリケーションのユーザー設定を保持し、
 * 値はJSONとしてシリアライズされ、永続化エンジンによってデータベースに保存されます。
 * 初期値はデフォルト設定関数によって提供されます。
 *
 * @example
 * ```typescript
 * import { $settings } from '~/store/settings';
 *
 * // 現在の設定を取得
 * const currentSettings = $settings.get();
 *
 * // テーマ設定を取得
 * const theme = currentSettings.appearance.theme;
 *
 * // 直接設定を更新（通常は updateSettings 関数を使用）
 * $settings.set({
 *   ...currentSettings,
 *   appearance: {
 *     ...currentSettings.appearance,
 *     theme: 'dark'
 *   }
 * });
 * ```
 */
export const $settings = persistentAtom<UserSettings>(
  "settings",
  defaultSettings(),
  { encode: JSON.stringify, decode: JSON.parse },
);

/**
 * デフォルトのユーザー設定を提供する関数
 *
 * アプリケーションの初期設定値を定義します。これらの値は、
 * ユーザーが明示的に設定を変更するまで使用されます。
 *
 * @returns {UserSettings} デフォルトのユーザー設定オブジェクト
 * @private
 */
function defaultSettings(): UserSettings {
  return {
    appearance: {
      theme: "system",  // システムのテーマに従う
      fontSize: "medium",  // 中サイズのフォント
    },
    notifications: {
      enabledLatestNotifications: false,  // 最新の通知を無効
      enabledKeywordsNotifications: false,  // キーワード通知を無効
      keywords: [],  // 通知キーワードの空リスト
    },
    account: {
      enabledSync: false,  // アカウント同期を無効
    },
  };
}

/**
 * ユーザー設定を更新する
 *
 * 指定されたアカウントIDのユーザー設定を部分的に更新します。
 * この関数は、既存の設定を保持しながら、指定された設定のみを更新します。
 *
 * @param {AccountId} accountId - 設定を更新するアカウントのID
 * @param {Partial<UserSettings>} settings - 更新する設定の部分オブジェクト
 * @returns {void}
 *
 * @example
 * ```typescript
 * import { updateSettings } from '~/store/settings';
 *
 * // テーマを暗いテーマに変更
 * updateSettings('user123', {
 *   appearance: {
 *     theme: 'dark'
 *   }
 * });
 *
 * // 通知設定を更新
 * updateSettings('user123', {
 *   notifications: {
 *     enabledLatestNotifications: true,
 *     keywords: ['重要', 'ニュース']
 *   }
 * });
 * ```
 */
export function updateSettings(
  accountId: AccountId,
  settings: Partial<UserSettings>,
): void {
  $settings.set({ ...$settings.get(), ...settings });
  console.info("Updated settings", $settings.get());
}
