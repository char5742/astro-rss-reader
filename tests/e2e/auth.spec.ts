import { test, expect } from '@playwright/test';

test.describe('認証機能のテスト', () => {
  test('ログインページが正しく表示される', async ({ page }) => {
    await page.goto('/auth/login');
    
    await expect(page).toHaveTitle(/ログイン/);
    await expect(page.getByRole('heading', { name: 'RSS Reader' })).toBeVisible();
    await expect(page.getByPlaceholder('ユーザーID')).toBeVisible();
    await expect(page.getByRole('button', { name: 'ログイン' })).toBeVisible();
  });

  test('有効なIDでログインできる', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.getByPlaceholder('ユーザーID').fill('testuser');
    await page.getByRole('button', { name: 'ログイン' }).click();
    
    await expect(page).toHaveURL('/');
    
    await expect(page.locator('.side-nav')).toBeVisible();
  });

  test('新規ユーザー登録ができる', async ({ page }) => {
    await page.goto('/auth/signup');
    
    await expect(page).toHaveTitle(/新規登録/);
    await page.getByPlaceholder('ユーザーID').fill('newuser' + Date.now());
    await page.getByRole('button', { name: '登録' }).click();
    
    await expect(page).toHaveURL('/');
  });
});
