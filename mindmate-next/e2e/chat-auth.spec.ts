import { test, expect } from '@playwright/test';

test.describe('Chat (Authenticated)', () => {
  test('User can open chat, send message, and receive response', async ({ page }) => {
    await page.goto('/chat');
    
    // Wait for chat to load
    await expect(page.locator('input[placeholder*="Type your message"]')).toBeVisible();

    // Type message
    await page.locator('input[placeholder*="Type your message"]').fill('Hello MindMate, how are you?');
    await page.keyboard.press('Enter');

    // Message should appear in chat
    await expect(page.getByText('Hello MindMate, how are you?')).toBeVisible();

    // The AI is mocked or using real Groq, wait for a typing indicator or response
    // Groq could take a few seconds, wait for any text from MindMate AI
    // The response is usually not empty.
    const messages = page.locator('.message-bubble');
    // We expect at least two messages (user + AI)
    await expect(async () => {
      const count = await messages.count();
      expect(count).toBeGreaterThanOrEqual(2);
    }).toPass({ timeout: 15000 });
  });
});
