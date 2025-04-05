/**
 * e2eテスト用のセットアップファイル
 * Playwrightテスト実行前に実行されます
 */
import { mockSQLiteForTests } from '../../src/features/persistence/test-helper';

export default async function globalSetup() {
  mockSQLiteForTests();
  
  console.info('e2eテスト用のセットアップが完了しました。SQLiteはモック化されています。');
}
