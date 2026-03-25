import { test, expect } from '@playwright/test';

test.describe('Mood Tracking', () => {
  test('Log in to log mood and see dashboard', async ({ page }) => {
    await page.goto('/mood');

    // Without login, the page should show some prompt to login
    await expect(page.getByText(/Please log in to view your mood history/i)).toBeVisible();

    // Test mood submission locally bypassing auth or checking the prompt
    // Click mood button
    const greatMoodButton = page.locator('button').filter({ hasText: '😊' });
    await greatMoodButton.click();

    await page.locator('button', { hasText: 'Work' }).click();

    // Log the mood
    await page.getByRole('button', { name: /Log in to Save Mood/i }).click();

    // Should push to login
    await expect(page).toHaveURL(/.*login.*/);
  });
});
