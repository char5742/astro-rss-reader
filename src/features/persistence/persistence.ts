/**
 * @module persistence
 * @description キーと値のペアをSQLiteデータベースに永続化するためのモジュール
 *
 * このモジュールは、アプリケーションのデータをSQLiteデータベースに永続化するための
 * シンプルなキー・バリューストアを提供します。データはスコープ（通常はアカウントID）ごとに
 * 分離され、各スコープ内でキーと値のペアとして管理されます。
 *
 * 内部的には、各スコープはデータベース内の1つのレコードとして保存され、
 * そのスコープに属するすべてのキーと値はJSONオブジェクトとしてシリアライズされます。
 * これにより、効率的なデータ管理と簡単なアクセスが可能になります。
 *
 * @example
 * ```typescript
 * // データの保存
 * save('user123', 'preferences', JSON.stringify({ theme: 'dark' }));
 *
 * // データの読み込み
 * const preferences = JSON.parse(load('user123', 'preferences') || '{}');
 *
 * // データの削除
 * remove('user123', 'preferences');
 * ```
 */
import { Database } from "bun:sqlite";

/**
 * SQLiteデータベースのファイル名
 * アプリケーションのデータを保存するデータベースファイルの名前
 */
const dbname = "mydb.sqlite";

/**
 * データベース初期化
 * アプリケーション起動時に実行され、必要なテーブルを作成します
 */
const db = new Database(dbname);
db.exec(`
       CREATE TABLE IF NOT EXISTS store (
        key TEXT PRIMARY KEY,
        value TEXT
      )`);
console.info("Table created successfully");

/**
 * 指定されたキーと値をデータベースに直接保存する内部関数
 *
 * この関数は、データベースに直接アクセスし、指定されたキーと値のペアを保存します。
 * 同じキーが既に存在する場合は、値が上書きされます。
 *
 * @param {string} key - 保存するデータのキー（通常はスコープ名）
 * @param {string} value - 保存する文字列データ（通常はJSONシリアライズされたオブジェクト）
 * @returns {void}
 * @private
 *
 * @example
 * ```typescript
 * // 内部使用のみ
 * _save('user123', '{"preferences":{"theme":"dark"}}');
 * ```
 */
function _save(key: string, value: string): void {
  const db = new Database(dbname);
  const statement = db.prepare(
    `insert or replace into store (key, value) values (?, ?);`,
  );
  statement.run(key, value);
  console.info(`Saved key: ${key} with value: ${value} to the database`);
}

/**
 * 指定されたキーに対応する値をデータベースから直接読み込む内部関数
 *
 * この関数は、データベースに直接アクセスし、指定されたキーに対応する値を読み込みます。
 * キーが存在しない場合は、undefinedを返します。
 *
 * @param {string} key - 読み込むデータのキー（通常はスコープ名）
 * @returns {string|undefined} 指定されたキーに対応する値、存在しない場合はundefined
 * @private
 *
 * @example
 * ```typescript
 * // 内部使用のみ
 * const userData = _load('user123'); // '{"preferences":{"theme":"dark"}}'
 * ```
 */
function _load(key: string): string | undefined {
  const db = new Database(dbname);
  const statement = db.prepare(`select value from store where key = ?;`);
  const result = statement.get(key) as unknown as { value: string } | undefined;
  return result?.value ?? undefined;
}

/**
 * 指定されたスコープ内のキーに対応する値を保存する
 *
 * スコープはJSONオブジェクトとして保存され、キーはそのオブジェクト内のプロパティとなります。
 * この関数は、指定されたスコープのデータを読み込み、指定されたキーに値を設定し、
 * 更新されたデータをデータベースに保存します。
 *
 * @param {string} scope - データのスコープ（名前空間、通常はアカウントID）
 * @param {string} key - 保存するデータのキー
 * @param {string} value - 保存する文字列データ
 * @returns {void}
 *
 * @example
 * ```typescript
 * // ユーザー設定の保存
 * save('user123', 'preferences', JSON.stringify({ theme: 'dark' }));
 *
 * // 記事のステータスの保存
 * save('user123', 'articleStatuses', JSON.stringify({ 'article1': 'read' }));
 * ```
 */
export function save(scope: string, key: string, value: string): void {
  const currentValue = JSON.parse(_load(scope) ?? "{}");
  currentValue[key] = value;
  _save(scope, JSON.stringify(currentValue));
}

/**
 * 指定されたスコープ内のキーに対応する値を読み込む
 *
 * この関数は、指定されたスコープのデータを読み込み、指定されたキーに対応する値を返します。
 * キーが存在しない場合は、undefinedを返します。
 *
 * @param {string} scope - データのスコープ（名前空間、通常はアカウントID）
 * @param {string} key - 読み込むデータのキー
 * @returns {string|undefined} 指定されたキーに対応する値、存在しない場合はundefined
 *
 * @example
 * ```typescript
 * // ユーザー設定の読み込み
 * const preferencesJson = load('user123', 'preferences');
 * const preferences = preferencesJson ? JSON.parse(preferencesJson) : { theme: 'system' };
 *
 * // 記事のステータスの読み込み
 * const articleStatusesJson = load('user123', 'articleStatuses');
 * const articleStatuses = articleStatusesJson ? JSON.parse(articleStatusesJson) : {};
 * ```
 */
export function load(scope: string, key: string): string | undefined {
  const currentValue = JSON.parse(_load(scope) ?? "{}");
  return currentValue[key] ?? undefined;
}

/**
 * 指定されたスコープ内のキーとそれに対応する値を削除する
 *
 * この関数は、指定されたスコープのデータを読み込み、指定されたキーを削除し、
 * 更新されたデータをデータベースに保存します。
 *
 * @param {string} scope - データのスコープ（名前空間、通常はアカウントID）
 * @param {string} key - 削除するデータのキー
 * @returns {void}
 *
 * @example
 * ```typescript
 * // ユーザー設定の削除
 * remove('user123', 'preferences');
 *
 * // 記事のステータスの削除
 * remove('user123', 'articleStatuses');
 * ```
 */
export function remove(scope: string, key: string): void {
  const currentValue = JSON.parse(_load(scope) ?? "{}");
  delete currentValue[key];
  _save(scope, JSON.stringify(currentValue));
}
