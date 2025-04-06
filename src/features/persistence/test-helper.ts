/**
 * テスト用ヘルパー関数
 * テスト実行時にSQLiteのモックを適用するための関数を提供します
 */
import { MockDatabaseSync, setupDatabaseMock, clearMockStorage } from './persistence.mock';

const isTestEnvironment = process.env.NODE_ENV === 'test' || process.env.PLAYWRIGHT_TEST === 'true';

export function mockSQLiteForTests(): void {
  if (isTestEnvironment) {
    global.DatabaseSync = MockDatabaseSync;
    
    setupDatabaseMock();
  }
}

export function resetMockStorage(): void {
  if (isTestEnvironment) {
    clearMockStorage();
  }
}

export { isTestEnvironment };
