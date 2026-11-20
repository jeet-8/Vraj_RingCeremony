import { test } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test('Reproduce bugs at 390x844', async ({ page }) => {
  const screenshotsDir = path.resolve('tests/screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.waitForTimeout(2500);

  // Capture the reproduction of Bug 1 (Header Overlap) & Bug 3 (Cropped Envelope)
  await page.screenshot({ path: path.join(screenshotsDir, 'before-390x844-intro.png') });
  console.log('Saved before-390x844-intro.png');
});
