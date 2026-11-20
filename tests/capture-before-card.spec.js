import { test } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test('Capture BEFORE opened card at 390x844 with dpr 2 and 3', async ({ browser }) => {
  const screenshotsDir = path.resolve('tests/screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  for (const dpr of [2, 3]) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: dpr,
      isMobile: true,
    });
    const page = await context.newPage();
    await page.goto('http://localhost:4173/');
    await page.waitForTimeout(2000);

    const tapHint = page.locator('button', { hasText: /tap the seal to open/i });
    if (await tapHint.isVisible()) {
      await tapHint.click();
    } else {
      await page.click('canvas');
    }

    // Wait 4 seconds for the card rise animation
    await page.waitForTimeout(4000);
    await page.screenshot({ path: path.join(screenshotsDir, `before-opened-card-dpr${dpr}.png`) });
    console.log(`Saved before-opened-card-dpr${dpr}.png`);
    await context.close();
  }
});
