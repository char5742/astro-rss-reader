import { test, expect } from '@playwright/test';

test('ログインページが表示されるかの基本テスト', async ({ page }) => {
  console.log('テスト開始: ログインページへのアクセス');
  await page.goto('/auth/login');
  console.log('ページにアクセスしました');
  
  const title = await page.title();
  console.log('ページタイトル:', title);
  
  const content = await page.content();
  console.log('ページ内容の一部:', content.substring(0, 200));
  
  await expect(page).toHaveURL('/auth/login');
});
