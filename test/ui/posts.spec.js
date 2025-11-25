import { test, expect } from '@playwright/test';

test('posts.html deve listar todos os posts', async ({ page }) => {
  await page.goto('http://localhost:5500/public/posts.html');

  await page.click('#btnAll');

  const output = await page.locator('#output').textContent();

  await expect(page.locator('#output')).toContainText('Post 1');
  await expect(page.locator('#output')).toContainText('Post 2');
});
