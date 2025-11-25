import { test, expect } from '@playwright/test';

test('index.html deve exibir links para Users, Posts e Comments', async ({ page }) => {
  await page.goto('http://localhost:5500/public/index.html');   // Ajuste conforme seu Live Server

  await expect(page.locator('a[href="users.html"]')).toBeVisible();
  await expect(page.locator('a[href="posts.html"]')).toBeVisible();
  await expect(page.locator('a[href="comments.html"]')).toBeVisible();
  
  const title = await page.textContent('h1');
  expect(title).toContain('Mini API Local');
});
