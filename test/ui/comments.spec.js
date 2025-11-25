import { test, expect } from '@playwright/test';

test('comments.html deve buscar comentários por postId', async ({ page }) => {
  await page.goto('http://localhost:5500/public/comments.html');

  await page.fill('#postId', '1');
  await page.click('#btnGet');

  await expect(page.locator('#output')).toContainText('Primeiro comentário');
});
