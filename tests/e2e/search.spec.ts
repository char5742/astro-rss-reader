import { test, expect } from '@playwright/test';

test.describe('検索機能のテスト', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await page.locator('#id').fill('testuser');
    await page.getByRole('button', { name: 'ログイン' }).click();
    await expect(page).toHaveURL('/');
  });

  test('検索ページが正しく表示される', async ({ page }) => {
    await page.goto('/search');
    
    await expect(page.getByRole('heading', { name: '検索' })).toBeVisible();
    
    await expect(page.getByPlaceholder('検索キーワード')).toBeVisible();
  });

  test('検索を実行できる', async ({ page }) => {
    await page.goto('/search');
    
    await page.getByPlaceholder('検索キーワード').fill('テスト');
    
    await page.getByRole('button', { name: '検索' }).click();
    
    await expect(page.locator('.search-results')).toBeVisible();
  });

  test('検索結果から記事を開ける', async ({ page }) => {
    await page.goto('/search');
    
    await page.getByPlaceholder('検索キーワード').fill('テスト');
    
    await page.getByRole('button', { name: '検索' }).click();
    
    const firstResult = page.locator('.search-result').first();
    if (await firstResult.isVisible()) {
      await firstResult.click();
      
      await expect(page.locator('.article-modal')).toBeVisible();
    }
  });

  test('検索履歴が保存される', async ({ page }) => {
    await page.goto('/search');
    
    await page.getByPlaceholder('検索キーワード').fill('テスト1');
    await page.getByRole('button', { name: '検索' }).click();
    
    await page.getByPlaceholder('検索キーワード').fill('テスト2');
    await page.getByRole('button', { name: '検索' }).click();
    
    await expect(page.locator('.search-history')).toBeVisible();
    await expect(page.getByText('テスト1')).toBeVisible();
    await expect(page.getByText('テスト2')).toBeVisible();
  });
});
