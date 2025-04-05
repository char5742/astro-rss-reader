/**
 * テスト環境用のセットアップファイル
 * テスト実行時にモックを使用するための設定を行います
 */

const isTestEnvironment = process.env.NODE_ENV === 'test' || process.env.PLAYWRIGHT_TEST === 'true';

if (isTestEnvironment) {
  console.info('テスト環境を検出しました。SQLiteのモックを使用します。');
  
  console.info('テスト実行時に手動でモックを適用してください');
}

export default isTestEnvironment;
