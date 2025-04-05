import { test, expect } from '@playwright/test';

test.describe('ホームページとフィード表示のテスト', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await page.locator('#id').fill('testuser');
    await page.getByRole('button', { name: 'ログイン' }).click();
    await expect(page).toHaveURL('/');
  });

  test('ホームページが正しく表示される', async ({ page }) => {
    await expect(page.locator('.side-nav')).toBeVisible();
    await expect(page.getByRole('link', { name: 'ホーム' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'フィード' })).toBeVisible();
    await expect(page.getByRole('link', { name: '記事' })).toBeVisible();
  });

  test('フィードページに移動できる', async ({ page }) => {
    await page.getByRole('link', { name: 'フィード' }).click();
    await expect(page).toHaveURL('/feeds');
    await expect(page.getByRole('heading', { name: 'フィード' })).toBeVisible();
  });

  test('記事ページに移動できる', async ({ page }) => {
    await page.getByRole('link', { name: '記事' }).click();
    await expect(page).toHaveURL('/articles');
    await expect(page.getByRole('heading', { name: '記事' })).toBeVisible();
  });

  test('設定ページに移動できる', async ({ page }) => {
    await page.getByRole('link', { name: '設定' }).click();
    await expect(page).toHaveURL('/settings');
    await expect(page.getByRole('heading', { name: '設定' })).toBeVisible();
  });

  test('ログアウトができる', async ({ page }) => {
    await page.getByRole('button', { name: 'ログアウト' }).click();
    await expect(page).toHaveURL('/auth/login');
  });
});
