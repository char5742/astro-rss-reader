import { test, expect } from '@playwright/test';

const isCIEnvironment = Boolean(process.env.CI);

test.describe('フィード画面のテスト', () => {
  test.beforeEach(async ({ page }) => {
    if (isCIEnvironment) {
      test.skip();
      return;
    }
    
    await page.goto('/auth/login');
    await page.locator('#id').fill('testuser');
    await page.getByRole('button', { name: 'ログイン' }).click();
    await expect(page).toHaveURL('/');
  });

  test('フィード一覧ページが正しく表示される', async ({ page }) => {
    if (isCIEnvironment) {
      test.skip();
      return;
    }
    
    await page.goto('/feeds');
    
    await expect(page.getByRole('heading', { name: 'フィード' })).toBeVisible();
    
    await expect(page.getByRole('button', { name: '追加' })).toBeVisible();
  });

  test('フィード追加フォームが機能する', async ({ page }) => {
    if (isCIEnvironment) {
      test.skip();
      return;
    }
    
    await page.goto('/feeds');
    
    await page.getByRole('button', { name: '追加' }).click();
    
    await expect(page.getByPlaceholder('https://example.com/feed.xml')).toBeVisible();
    
    await page.getByPlaceholder('https://example.com/feed.xml').fill('https://example.com/feed.xml');
    
    await page.getByRole('button', { name: '追加' }).click();
    
    await expect(page.getByRole('heading', { name: 'フィード' })).toBeVisible();
  });

  test('フィード詳細ページが表示される', async ({ page }) => {
    if (isCIEnvironment) {
      test.skip();
      return;
    }
    
    await page.goto('/feeds');
    
    const firstFeed = page.locator('.feed-item').first();
    if (await firstFeed.isVisible()) {
      await firstFeed.click();
      
      await expect(page.url()).toContain('/feeds/');
      
      await expect(page.locator('.feed-header')).toBeVisible();
    }
  });
});
