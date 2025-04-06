/**
 * SQLiteデータベースのモック実装
 * テスト環境で使用するためのモックです
 */

const mockStorage: Record<string, string> = {};

export class MockDatabaseSync {
  constructor(dbname: string) {
  }

  exec(sql: string): void {
    return;
  }

  prepare(sql: string): {
    run: (key: string, value?: string) => void;
    get: (key: string) => { value: string } | undefined;
  } {
    return {
      run: (key: string, value?: string) => {
        if (value !== undefined) {
          mockStorage[key] = value;
        }
      },
      get: (key: string) => {
        const value = mockStorage[key];
        return value !== undefined ? { value } : undefined;
      },
    };
  }
}

export function setupDatabaseMock(): void {
  const isTestEnvironment = process.env.NODE_ENV === 'test' || process.env.PLAYWRIGHT_TEST === 'true';
  
  if (isTestEnvironment) {
    console.info('SQLiteデータベースのモックを設定しました');
    
    Object.keys(mockStorage).forEach(key => {
      delete mockStorage[key];
    });
  }
}

export function clearMockStorage(): void {
  Object.keys(mockStorage).forEach(key => {
    delete mockStorage[key];
  });
}
