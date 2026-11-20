import { test, expect } from '@playwright/test';

test('Throttled 4x CPU run: Opening animation and responsive layout', async ({ page }) => {
  // Connect to Chrome DevTools Protocol session to throttle CPU 4x
  const client = await page.context().newCDPSession(page);
  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.waitForTimeout(1500);

  // Check header layout with 4x CPU throttling
  const line1 = page.locator('text=Shree Ganeshay Namah');
  await expect(line1).toBeVisible();

  // Click the hint button to trigger opening animation under 4x CPU throttling
  const tapHint = page.locator('button', { hasText: /tap the seal to open/i });
  await expect(tapHint).toBeVisible();
  await tapHint.click();

  // Verify transition to invitation succeeds even under 4x CPU throttling
  await expect(page.locator('text=Vraj').first()).toBeVisible({ timeout: 15000 });
  await expect(page.locator('text=Counting Down to the Auspicious Moment')).toBeVisible();
});
