/**
 * @module store
 * @description アカウントごとのデータ永続化を実現するためのカスタム永続化エンジンを提供するモジュール
 *
 * このモジュールは、nanostores/persistentライブラリのカスタム実装を提供し、
 * アカウントごとにデータを分離して保存する機能を実現します。
 * SQLiteデータベースを使用してデータを永続化し、変更通知のためのイベントシステムも実装しています。
 */
import type {
  PersistentEvent,
  PersistentListener,
  PersistentStore,
} from "@nanostores/persistent";

import { setPersistentEngine } from "@nanostores/persistent";
import { load, remove, save } from "~/features/persistence/persistence";
import type { AccountId } from "~/types/account";

/**
 * イベントリスナーの配列
 * データの変更を監視するリスナーを保持します
 * @private
 */
let listeners: PersistentListener[] = [];

/**
 * データ変更時に呼び出される関数
 * 登録されたすべてのリスナーに変更イベントを通知します
 *
 * @param {string} key - 変更されたデータのキー
 * @param {any} newValue - 新しい値
 * @private
 */
function onChange(key: string, newValue: any) {
  const event: PersistentEvent = { key, newValue };
  for (const i of listeners) i(event);
}

/**
 * nanostores/persistentのイベントシステム実装
 * データ変更を監視するためのイベントリスナーの登録と削除を管理します
 *
 * @property {Function} addEventListener - イベントリスナーを登録する関数
 * @property {Function} removeEventListener - イベントリスナーを削除する関数
 * @property {boolean} perKey - キーごとにリスナーを管理するかどうか（falseの場合、すべてのキーの変更を一つのリスナーで監視）
 * @private
 */
const events = {
  addEventListener(key: string, callback: PersistentListener) {
    listeners.push(callback);
  },
  removeEventListener(key: string, callback: PersistentListener) {
    listeners = listeners.filter((i) => i !== callback);
  },
  // window dispatches "storage" events for any key change
  // => One listener for all map keys is enough
  perKey: false,
};

/**
 * 指定されたアカウントIDに対する永続化エンジンを設定します
 * この関数を呼び出すことで、nanostoresのすべての永続化操作が
 * 指定されたアカウントのスコープ内で行われるようになります
 *
 * @param {AccountId} accountId - データを保存するアカウントのID
 * @example
 * ```typescript
 * // アプリケーション起動時やログイン後に呼び出す
 * import { setAccountStorage } from '~/store';
 *
 * setAccountStorage('user123');
 * ```
 */
export function setAccountStorage(accountId: AccountId) {
  /**
   * カスタム永続化ストアの実装
   * Proxyを使用して、キーと値のペアの読み書き操作をインターセプトし、
   * SQLiteデータベースへの保存と読み込みを行います
   *
   * @private
   */
  const storage: PersistentStore = new Proxy(
    {},
    {
      /**
       * キーに対する値の設定操作をインターセプト
       * @param {object} _ - ターゲットオブジェクト（未使用）
       * @param {string} key - 保存するデータのキー
       * @param {string} value - 保存する値
       * @returns {boolean} 操作の成功を示すboolean値
       */
      set(_, key: string, value: string) {
        save(accountId, key, value);
        onChange(key, value);
        return true;
      },
      /**
       * キーに対する値の取得操作をインターセプト
       * @param {object} _ - ターゲットオブジェクト（未使用）
       * @param {string} key - 読み込むデータのキー
       * @returns {string|undefined} 保存されている値、または存在しない場合はundefined
       */
      get(_, key: string) {
        return load(accountId, key);
      },
      /**
       * キーと値のペアの削除操作をインターセプト
       * @param {object} _ - ターゲットオブジェクト（未使用）
       * @param {string} key - 削除するデータのキー
       * @returns {boolean} 操作の成功を示すboolean値
       */
      deleteProperty(_, key: string) {
        remove(accountId, key);
        onChange(key, undefined);
        return true;
      },
    },
  );

  // nanostores/persistentライブラリに永続化エンジンを設定
  setPersistentEngine(storage, events);
}
