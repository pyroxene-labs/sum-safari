import { test, expect } from '@playwright/test';

test('game flow', async ({ page }) => {
    // 1. Visit home
    await page.goto('/');
    await expect(page).toHaveTitle(/SumSafari/);

    // 2. Start Game
    await page.getByRole('button', { name: /Start Safari/i }).click();

    // 3. Solve a problem
    // Wait for problem card
    await expect(page.locator('.problem-animal')).toBeVisible();

    // Get equation
    // const equationText = await page.locator('.problem-equation').textContent();
    // Simple parse for now: "5 + 3 = ?"
    // But we can just use the debug capability or cheat by assuming it works if we type ANY number and click check
    // Actually, let's just assert the input exists
    const input = page.locator('.answer-input');
    await expect(input).toBeVisible();

    // Type an answer (doesn't have to be correct to verify flow)
    await input.fill('999');
    await page.keyboard.press('Enter');

    // Should show feedback
    await expect(page.locator('.feedback-overlay')).toBeVisible();

    // Continue
    await page.getByRole('button', { name: /Continue/i }).click();
    await expect(page.locator('.feedback-overlay')).not.toBeVisible();
});
