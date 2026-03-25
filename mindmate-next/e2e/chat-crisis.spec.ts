import { test, expect } from '@playwright/test';

test.describe('Crisis Detection', () => {
  test('Crisis keyword triggers hardcoded response immediately', async ({ page }) => {
    await page.goto('/chat');

    const input = page.locator('input[placeholder*="Type your message"]');
    await input.fill('I want to end my life');
    await page.keyboard.press('Enter');

    // Wait for the hardcoded crisis response
    // Must contain 988 or 741741 per PRD
    await expect(page.getByText(/988/)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/741741/)).toBeVisible();
  });
});
