import { test, expect } from '@playwright/test';

test.describe('記事画面のテスト', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await page.locator('#id').fill('testuser');
    await page.getByRole('button', { name: 'ログイン' }).click();
    await expect(page).toHaveURL('/');
  });

  test('記事一覧ページが正しく表示される', async ({ page }) => {
    await page.goto('/articles');
    
    await expect(page.getByRole('heading', { name: '記事' })).toBeVisible();
    
    await expect(page.locator('.filter-options')).toBeVisible();
  });

  test('記事をフィルタリングできる', async ({ page }) => {
    await page.goto('/articles');
    
    await page.getByRole('button', { name: '未読' }).click();
    
    await expect(page.url()).toContain('filter=unread');
  });

  test('記事の詳細を表示できる', async ({ page }) => {
    await page.goto('/articles');
    
    const firstArticle = page.locator('.article-card').first();
    if (await firstArticle.isVisible()) {
      await firstArticle.click();
      
      await expect(page.locator('.article-modal')).toBeVisible();
      
      await expect(page.locator('.article-title')).toBeVisible();
      
      await expect(page.locator('.article-content')).toBeVisible();
    }
  });

  test('記事を既読/未読に切り替えられる', async ({ page }) => {
    await page.goto('/articles');
    
    const firstArticle = page.locator('.article-card').first();
    if (await firstArticle.isVisible()) {
      await page.locator('.article-status-toggle').first().click();
      
      await expect(page.locator('.article-card.read').first()).toBeVisible();
    }
  });
});
