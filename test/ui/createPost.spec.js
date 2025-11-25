import { test, expect } from '@playwright/test';

test('posts.html deve criar um novo post', async ({ page }) => {
  await page.goto('http://localhost:5500/public/posts.html');

  await page.fill('#userId', '1');
  await page.fill('#title', 'Post via UI');
  await page.fill('#body', 'Conteúdo do teste Playwright');

  await page.click('#btnCreate');

  await expect(page.locator('#output')).toContainText('Post criado com sucesso');
});
