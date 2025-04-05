import { test, expect } from '@playwright/test';

test.describe('設定画面のテスト', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByPlaceholder('ユーザーID').fill('testuser');
    await page.getByRole('button', { name: 'ログイン' }).click();
    await expect(page).toHaveURL('/');
  });

  test('設定ページが正しく表示される', async ({ page }) => {
    await page.goto('/settings');
    
    await expect(page.getByRole('heading', { name: '設定' })).toBeVisible();
    
    await expect(page.getByText('外観')).toBeVisible();
    
    await expect(page.getByText('通知')).toBeVisible();
  });

  test('テーマを変更できる', async ({ page }) => {
    await page.goto('/settings');
    
    await page.getByLabel('ダーク').click();
    
    await expect(page.locator('body.dark-theme')).toBeVisible();
    
    await page.getByLabel('ライト').click();
    
    await expect(page.locator('body:not(.dark-theme)')).toBeVisible();
  });

  test('フォントサイズを変更できる', async ({ page }) => {
    await page.goto('/settings');
    
    await page.getByLabel('大').click();
    
    await expect(page.locator('body.large-font')).toBeVisible();
    
    await page.getByLabel('標準').click();
    
    await expect(page.locator('body:not(.large-font):not(.small-font)')).toBeVisible();
  });

  test('通知設定を変更できる', async ({ page }) => {
    await page.goto('/settings');
    
    const notificationToggle = page.locator('.notification-toggle');
    if (await notificationToggle.isVisible()) {
      await notificationToggle.click();
      
      await expect(page.locator('.keyword-input')).toBeVisible();
    }
  });
});
