import { test, expect } from '@playwright/test';
import path from 'path';

test('Capture intro screen blessing lines', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.waitForTimeout(1800);

  const blessing1 = page.locator('text=Shree Ganeshay Namah');
  await expect(blessing1).toBeVisible();

  const shotPath = path.join(process.cwd(), 'tests', 'screenshots', 'crisp-intro-blessing-lines.png');
  await page.screenshot({ path: shotPath });
  console.log(`Saved screenshot to ${shotPath}`);
});
