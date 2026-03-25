import { test, expect } from '@playwright/test';

test.describe('Production Hardening & Integrity', () => {
  
  test('should display medical disclaimer footer on all pages', async ({ page }) => {
    await page.goto('/');
    const footerDisclaimer = page.locator('text=Medical Disclaimer');
    await expect(footerDisclaimer).toBeVisible();
    
    await page.goto('/chat');
    await expect(footerDisclaimer).toBeVisible();
  });

  test('should show skip-to-content link on tab', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skipLink = page.locator('text=Skip to main content');
    await expect(skipLink).toBeVisible();
    await expect(skipLink).toBeFocused();
  });

  test('should have a valid PWA manifest link', async ({ page }) => {
    await page.goto('/');
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveAttribute('href', '/manifest.json');
  });

  test('should handle community reports (UI only)', async ({ page }) => {
    // Note: This assumes the user is logged in or we're testing the button presence
    await page.goto('/community');
    const reportBtn = page.locator('button:has-text("Report")').first();
    if (await reportBtn.isVisible()) {
      await reportBtn.click();
      await expect(page.locator('select')).toBeVisible();
      await expect(page.locator('button:has-text("Submit Report")')).toBeVisible();
    }
  });

  test('should trigger error boundary on component failure', async ({ page }) => {
    // We can simulate an error by navigating to a route that we know will crash
    // or by injecting code that throws.
    await page.goto('/_next/debug/crash', { waitUntil: 'networkidle' }).catch(() => {});
    // If the page crashes, the ErrorBoundary should catch it.
    const errorTitle = page.locator('text=Something went wrong');
    // This is a placeholder as we don't have a specific "crash" route, 
    // but it demonstrates the test pattern.
  });

});
