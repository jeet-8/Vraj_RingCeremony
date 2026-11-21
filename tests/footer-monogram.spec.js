import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Footer Golden V & P Monogram Badge Verification', () => {
  test('Verify footer monogram badge on mobile (390x844 DPR 3) and no 404s', async ({ page }) => {
    let monogram404 = false;
    page.on('response', (res) => {
      if (res.url().includes('vp-monogram') && res.status() >= 400) {
        monogram404 = true;
      }
    });

    await page.goto('/?mode=plain');

    // 1. Locate Footer & Monogram Badge
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await footer.scrollIntoViewIfNeeded();

    const badge = footer.locator('div[class*="shadow-wax-seal"]');
    await expect(badge).toBeVisible();

    const monogramImg = badge.locator('img[src*="vp-monogram.png"]');
    await expect(monogramImg).toBeVisible();

    // Verify 0 404s
    expect(monogram404).toBe(false);

    // Verify natural dimensions loaded
    const isLoaded = await monogramImg.evaluate((img) => {
      return img.complete && img.naturalWidth === 800 && img.naturalHeight === 800;
    });
    expect(isLoaded).toBe(true);

    // Verify badge container dimensions at 390px (clamp(80px, 24vw, 120px) => 24% of 390 = 93.6px)
    const badgeBox = await badge.boundingBox();
    expect(badgeBox).not.toBeNull();
    console.log(`Mobile 390px Badge size: ${badgeBox.width} x ${badgeBox.height}`);
    expect(badgeBox.width).toBeGreaterThanOrEqual(80);
    expect(badgeBox.width).toBeLessThanOrEqual(120);

    // Verify spacing above couple name
    const coupleHeading = footer.locator('h3');
    await expect(coupleHeading).toBeVisible();
    const headingBox = await coupleHeading.boundingBox();
    const spacing = headingBox.y - (badgeBox.y + badgeBox.height);
    console.log(`Spacing between badge and couple heading: ${spacing}px`);
    expect(spacing).toBeGreaterThanOrEqual(10);
    expect(spacing).toBeLessThanOrEqual(20);

    // Verify no old text "V & P" remains in the badge
    const badgeText = await badge.innerText();
    expect(badgeText.trim()).toBe('');

    // Capture screenshot on 390x844 DPR 3
    const mobileShot = path.resolve('tests/screenshots/footer-monogram-390x844-dpr3.png');
    await footer.screenshot({ path: mobileShot });
  });

  test('Verify footer monogram across 320px, 360px, 412px, and desktop 1920x1080', async ({ browser }) => {
    const viewports = [
      { name: '320px', width: 320, height: 600, dpr: 2 },
      { name: '360px', width: 360, height: 740, dpr: 2 },
      { name: '412px', width: 412, height: 915, dpr: 2 },
      { name: 'desktop-1080p', width: 1920, height: 1080, dpr: 1 },
    ];

    for (const vp of viewports) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: vp.dpr,
      });
      const page = await context.newPage();
      await page.goto('/?mode=plain');

      const footer = page.locator('footer');
      await footer.scrollIntoViewIfNeeded();

      const badge = footer.locator('div[class*="shadow-wax-seal"]');
      await expect(badge).toBeVisible();

      const badgeBox = await badge.boundingBox();
      expect(badgeBox.width).toBeGreaterThanOrEqual(80);
      expect(badgeBox.width).toBeLessThanOrEqual(120);

      const shotPath = path.resolve(`tests/screenshots/footer-monogram-${vp.name}.png`);
      await footer.screenshot({ path: shotPath });
      await context.close();
    }
  });
});
