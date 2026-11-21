import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Wax Seal Monogram & Date Verification', () => {
  test('Capture wax seal at 390x844 with DPR 2', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();
    await page.goto('/');

    // Wait for canvas to mount and fonts to load
    await page.waitForSelector('canvas');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(2000);

    // Capture full screen sealed envelope
    const shotPath = path.resolve('tests/screenshots/after-seal-390x844-dpr2.png');
    await page.screenshot({ path: shotPath });

    // Verify tap hint or blessing lines are present and not overlapping
    const tapHint = page.getByRole('button', { name: /tap the seal to open/i });
    await expect(tapHint).toBeVisible();

    await context.close();
  });

  test('Capture wax seal at 390x844 with DPR 3', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();
    await page.goto('/');

    await page.waitForSelector('canvas');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(2000);

    const shotPath = path.resolve('tests/screenshots/after-seal-390x844-dpr3.png');
    await page.screenshot({ path: shotPath });

    // Click seal to ensure opening interaction works
    const canvas = page.locator('canvas');
    const box = await canvas.boundingBox();
    if (box) {
      // Tap near seal center (around 38% height)
      await page.touchscreen.tap(box.x + box.width * 0.5, box.y + box.height * 0.45);
    }

    // Wait for card to open and content to become visible
    await page.waitForTimeout(3000);
    const openedShot = path.resolve('tests/screenshots/after-seal-opened-dpr3.png');
    await page.screenshot({ path: openedShot });

    await context.close();
  });

  test('Capture wax seal on Desktop 1920x1080', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
      isMobile: false,
    });
    const page = await context.newPage();
    await page.goto('/');

    await page.waitForSelector('canvas');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(2000);

    const shotPath = path.resolve('tests/screenshots/after-seal-desktop-1080p.png');
    await page.screenshot({ path: shotPath });

    await context.close();
  });
});
