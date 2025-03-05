/**
 * @module store/accounts
 * @description アカウント情報を管理するためのストアとユーティリティ関数を提供するモジュール
 *
 * このモジュールは、現在のアカウント情報を保持する永続的なストアと、
 * アカウントの作成や存在確認などの操作を行うユーティリティ関数を提供します。
 */
import { persistentAtom } from "@nanostores/persistent";
import { load, save } from "~/features/persistence/persistence";
import type { Account, AccountId } from "~/types/account";

/**
 * 現在のアカウント情報を保持する永続的なストア
 *
 * このストアは、現在ログインしているアカウントの情報を保持し、
 * アプリケーション全体で共有されます。値はJSONとしてシリアライズされ、
 * 永続化エンジンによってデータベースに保存されます。
 *
 * @example
 * ```typescript
 * import { $account } from '~/store/accounts';
 *
 * // アカウント情報の取得
 * const currentAccount = $account.get();
 *
 * // アカウント情報の更新
 * $account.set({
 *   ...currentAccount,
 *   email: 'new-email@example.com'
 * });
 * ```
 */
export const $account = persistentAtom<Account | undefined>(
  "account",
  undefined,
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  },
);

/**
 * 新しいアカウントオブジェクトを作成する内部関数
 *
 * 指定されたIDを持つ新しいアカウントオブジェクトを作成します。
 * 初期状態では、メールアドレスは空文字列に設定されます。
 *
 * @param {string} id - 新しいアカウントのID
 * @returns {Account} 作成されたアカウントオブジェクト
 * @private
 */
function newAccount(id: string) {
  return {
    id: id as AccountId,
    email: "" as string,
  } satisfies Account;
}

/**
 * 新しいアカウントを作成し、データベースに保存する
 *
 * 指定されたIDを持つ新しいアカウントを作成し、データベースに保存します。
 * このアカウントは、指定されたIDのスコープ内に保存されます。
 *
 * @param {string} id - 作成するアカウントのID
 * @returns {void}
 *
 * @example
 * ```typescript
 * import { createAccount } from '~/store/accounts';
 *
 * // 新しいアカウントの作成
 * createAccount('user123');
 * ```
 */
export function createAccount(id: string): void {
  save(id, "account", JSON.stringify(newAccount(id)));
}

/**
 * 指定されたIDのアカウントが存在するかどうかを確認する
 *
 * データベース内で指定されたIDのアカウントが存在するかどうかを確認します。
 *
 * @param {string} id - 確認するアカウントのID
 * @returns {boolean} アカウントが存在する場合はtrue、存在しない場合はfalse
 *
 * @example
 * ```typescript
 * import { isExist } from '~/store/accounts';
 *
 * // アカウントの存在確認
 * if (isExist('user123')) {
 *   console.log('アカウントが存在します');
 * } else {
 *   console.log('アカウントが存在しません');
 * }
 * ```
 */
export function isExist(id: string): boolean {
  const a = load(id, "account");
  return a !== undefined;
}
