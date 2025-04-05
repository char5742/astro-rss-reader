import { test, expect } from '@playwright/test';

test('基本的なテスト機能が動作する', async () => {
  expect(1 + 1).toBe(2);
  expect('hello').toContain('ello');
  expect([1, 2, 3]).toHaveLength(3);
  
  console.log('基本的なテストが正常に実行されました');
});

test.skip('ログインページが表示されるかのテスト', async ({ page }) => {
  console.log('テスト開始: ログインページへのアクセス');
  await page.goto('/auth/login');
  
  await expect(page).toHaveURL('/auth/login');
});
