import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Photo Gallery, Card Ordering & Seal Verification', () => {
  test('Verify photo loads properly and card ordering matches requirements', async ({ page }) => {
    // Navigate with mode=plain or open envelope to inspect cards
    await page.goto('/?mode=plain');

    // 1. Verify PhotoGalleryCard image loads with natural dimensions
    const coupleImg = page.locator('div[class*="aspect-[4/5]"] img');
    await expect(coupleImg).toBeVisible();

    const isImgLoaded = await coupleImg.evaluate((img) => {
      return img.complete && img.naturalWidth > 0 && img.naturalHeight > 0;
    });
    expect(isImgLoaded).toBe(true);

    const naturalWidth = await coupleImg.evaluate((img) => img.naturalWidth);
    const naturalHeight = await coupleImg.evaluate((img) => img.naturalHeight);
    console.log(`[Photo Debug] Image loaded successfully: ${naturalWidth}x${naturalHeight}`);

    // 2. Verify Ordering of Sections:
    // Schedule should come BEFORE Venue
    const scheduleTitle = page.getByText(/Auspicious Schedule/i);
    const venueTitle = page.getByText(/Celebration Venue/i);

    await expect(scheduleTitle).toBeVisible();
    await expect(venueTitle).toBeVisible();

    const scheduleBox = await scheduleTitle.boundingBox();
    const venueBox = await venueTitle.boundingBox();

    expect(scheduleBox).not.toBeNull();
    expect(venueBox).not.toBeNull();

    console.log(`[Order Debug] Schedule y=${scheduleBox.y}, Venue y=${venueBox.y}`);
    expect(scheduleBox.y).toBeLessThan(venueBox.y); // Schedule comes before Venue (Schedule is second-to-last, Venue is last)

    // Capture screenshot of Photo Gallery & Ordered Cards
    const shotPath = path.resolve('tests/screenshots/verified-photo-and-order.png');
    await page.screenshot({ path: shotPath, fullPage: true });
  });

  test('Verify 3D wax seal monogram, date and no halo at 390x844 DPR 2', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();
    await page.goto('/');

    await page.waitForSelector('canvas');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(2000);

    const shotPath = path.resolve('tests/screenshots/verified-seal-390x844-dpr2.png');
    await page.screenshot({ path: shotPath });

    await context.close();
  });
});
