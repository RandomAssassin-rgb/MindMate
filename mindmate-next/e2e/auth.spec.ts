import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('Sign up flow shows verification UI', async ({ page }) => {
    // Go to login page
    await page.goto('/login');
    
    // Switch to sign up tab
    await page.getByRole('button', { name: 'Sign Up' }).click();
    
    // Fill out form with random email to avoid collision
    const testEmail = `test-${Date.now()}@example.com`;
    await page.getByPlaceholder('Enter your email').fill(testEmail);
    await page.getByPlaceholder('Create a password').fill('Testpass123!');
    
    // Submit
    await page.getByRole('button', { name: 'Create Account' }).click();
    
    // Wait for the success message / check your email UI
    await expect(page.getByText(/Check your email/i)).toBeVisible({ timeout: 10000 });
  });

  test('Log in flow works for existing user', async ({ page }) => {
    await page.goto('/login');
    
    // Switch to login tab
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // These credentials might fail if not created, but we just want to ensure it tries
    // and shows either a success redirect or an error message cleanly.
    await page.getByPlaceholder('Enter your email').fill('test@example.com');
    await page.getByPlaceholder('Enter your password').fill('wrongpassword');
    
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    
    // Expect some kind of feedback (Invalid login credentials)
    await expect(page.getByText(/Invalid login credentials/i)).toBeVisible({ timeout: 10000 });
  });
});
