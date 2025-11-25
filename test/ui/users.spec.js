import { test, expect } from '@playwright/test';

test('users.html deve listar todos os usuários', async ({ page }) => {
  await page.goto('http://localhost:5500/public/users.html');

  await page.click('#btnAll');

  await expect(page.locator('#output')).toContainText('email');
  await expect(page.locator('#output')).toContainText('Alice');
});
