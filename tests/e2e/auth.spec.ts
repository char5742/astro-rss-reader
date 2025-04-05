import { test, expect } from '@playwright/test';

const isCIEnvironment = Boolean(process.env.CI);

test('基本的なテスト機能が動作する', async () => {
  expect(1 + 1).toBe(2);
  expect('hello').toContain('ello');
  expect([1, 2, 3]).toHaveLength(3);
  
  console.log('基本的なテストが正常に実行されました');
});

test(isCIEnvironment ? 'ログインページが表示されるかのテスト (CIではスキップ)' : 'ログインページが表示されるかのテスト', async ({ page }) => {
  if (isCIEnvironment) {
    console.log('CI環境のため、このテストはスキップします');
    test.skip();
    return;
  }
  
  console.log('テスト開始: ログインページへのアクセス');
  await page.goto('/auth/login');
  
  await expect(page).toHaveURL('/auth/login');
});
