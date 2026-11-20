import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test.describe('Acceptance Tests for Bug Fixes', () => {
  const screenshotsDir = path.resolve('tests/screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  test('Bug 1 Fix: All three blessing lines visible with NO button overlap', async ({ page }, testInfo) => {
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/');
    await page.waitForTimeout(1500);

    const langSelector = page.getByRole('button', { name: 'EN', exact: true });
    const skipButton = page.locator('button', { hasText: 'Skip intro' });

    const line1 = page.locator('text=Shree Ganeshay Namah');
    const line2 = page.locator('text=Shree Khimaj Mata Namah');
    const line3 = page.locator('text=Shree Kheteshwaray Namah');

    await expect(langSelector).toBeVisible();
    await expect(skipButton).toBeVisible();
    await expect(line1).toBeVisible();
    await expect(line2).toBeVisible();
    await expect(line3).toBeVisible();

    const langBox = await langSelector.boundingBox();
    const skipBox = await skipButton.boundingBox();
    const line1Box = await line1.boundingBox();
    const line2Box = await line2.boundingBox();
    const line3Box = await line3.boundingBox();

    // Verify Row 2 (Blessing lines) is vertically BELOW Row 1 (Language toggle & Skip button)
    expect(line1Box.y).toBeGreaterThanOrEqual(langBox.y + langBox.height + 4);
    expect(line1Box.y).toBeGreaterThanOrEqual(skipBox.y + skipBox.height + 4);

    // Verify lines do not overlap each other
    expect(line2Box.y).toBeGreaterThan(line1Box.y);
    expect(line3Box.y).toBeGreaterThan(line2Box.y);

    // No console errors
    expect(consoleErrors).toEqual([]);

    if (testInfo.project.name === 'Mobile-390x844') {
      await page.screenshot({ path: path.join(screenshotsDir, 'after-390x844-intro.png') });
      console.log('Saved after-390x844-intro.png');
    }
  });

  test('Bug 2 Fix: Tapping hint button starts animation and reveals scrollable invitation', async ({ page }) => {
    page.on('console', msg => console.log('[Browser Console]', msg.type(), msg.text()));
    await page.goto('/');
    await page.waitForTimeout(1500);

    const tapHint = page.locator('button', { hasText: /tap the seal to open/i });
    await expect(tapHint).toBeVisible();
    await tapHint.click();

    // Wait for the opening sequence to finish and transition to scrollable invitation
    await expect(page.locator('text=Vraj').first()).toBeVisible({ timeout: 12000 });
    await expect(page.locator('text=Counting Down to the Auspicious Moment')).toBeVisible();

    // Verify it is scrollable
    await page.evaluate(() => window.scrollTo(0, 500));
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
  });

  test('Bug 2 Fix: Tapping canvas / seal triggers open animation', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500);

    // Click on canvas center where seal and generous 160px hit area are
    const canvas = page.locator('canvas');
    await canvas.click();

    await expect(page.locator('text=Vraj').first()).toBeVisible({ timeout: 12000 });
  });

  test('Bug 3 Fix: Envelope is fully framed without cropping and buttons are clear', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500);

    const canvas = page.locator('canvas');
    const canvasBox = await canvas.boundingBox();
    const viewportSize = page.viewportSize();

    expect(canvasBox.width).toBeLessThanOrEqual(viewportSize.width);

    // Verify Muted button is visible and does not overlap the prompt button
    const musicBtn = page.locator('button', { hasText: 'Muted' });
    const tapHint = page.locator('button', { hasText: /tap the seal to open/i });
    await expect(musicBtn).toBeVisible();
    await expect(tapHint).toBeVisible();

    const musicBox = await musicBtn.boundingBox();
    const tapBox = await tapHint.boundingBox();

    // Ensure music button and tap button don't overlap horizontally and vertically at the same time
    const horizontalOverlap = !(musicBox.x + musicBox.width <= tapBox.x || tapBox.x + tapBox.width <= musicBox.x);
    const verticalOverlap = !(musicBox.y + musicBox.height <= tapBox.y || tapBox.y + tapBox.height <= musicBox.y);
    expect(horizontalOverlap && verticalOverlap).toBe(false);
  });

  test('Fallback Crossfade: Skip button transitions immediately', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    const skipButton = page.locator('button', { hasText: 'Skip intro' });
    await skipButton.click();

    await expect(page.locator('text=Vraj').first()).toBeVisible({ timeout: 3000 });
  });
});
