import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test.describe('Redesigned Full-Bleed 3D Opening Scene and Crisp Card', () => {
  const screenshotsDir = path.resolve('tests/screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  test('1. Full-bleed envelope at 390x844 DPR 2: crisp text, no overlap, full paper coverage', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
    });
    const page = await context.newPage();

    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('http://localhost:4173/');
    await page.waitForTimeout(2000);

    const langSelector = page.getByRole('button', { name: 'EN', exact: true });
    const skipButton = page.locator('button', { hasText: 'Skip intro' });
    await expect(langSelector).toBeVisible();
    await expect(skipButton).toBeVisible();

    const line1 = page.locator('text=Shree Ganeshay Namah');
    const line2 = page.locator('text=Shree Khimaj Mata Namah');
    const line3 = page.locator('text=Shree Kheteshwaray Namah');
    await expect(line1).toBeVisible();
    await expect(line2).toBeVisible();
    await expect(line3).toBeVisible();

    const langBox = await langSelector.boundingBox();
    const line1Box = await line1.boundingBox();
    expect(line1Box.y).toBeGreaterThanOrEqual(langBox.y + langBox.height);

    const tapHint = page.locator('button', { hasText: /tap the seal to open/i });
    await expect(tapHint).toBeVisible();

    const shotPath = path.join(screenshotsDir, 'after-fullbleed-envelope-dpr2.png');
    await page.screenshot({ path: shotPath });
    console.log(`Saved ${shotPath}`);

    expect(consoleErrors).toEqual([]);
    await context.close();
  });

  test('2. Full-bleed envelope at 390x844 DPR 3: crisp text, no overlap, full paper coverage', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      isMobile: true,
    });
    const page = await context.newPage();

    await page.goto('http://localhost:4173/');
    await page.waitForTimeout(2000);

    const line1 = page.locator('text=Shree Ganeshay Namah');
    await expect(line1).toBeVisible();

    const shotPath = path.join(screenshotsDir, 'after-fullbleed-envelope-dpr3.png');
    await page.screenshot({ path: shotPath });
    console.log(`Saved ${shotPath}`);

    await context.close();
  });

  test('3. Opening sequence DPR 2: Seal attached to flap, card rises, crisp HTML card swap', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
    });
    const page = await context.newPage();

    await page.goto('http://localhost:4173/');
    await page.waitForTimeout(1500);

    const tapHint = page.locator('button', { hasText: /tap the seal to open/i });
    await tapHint.click();

    // Flap lifts carrying seal up, inside lining revealed
    await page.waitForTimeout(3000);
    const openMidPath = path.join(screenshotsDir, 'after-opening-mid-dpr2.png');
    await page.screenshot({ path: openMidPath });
    console.log(`Saved ${openMidPath}`);

    // Wait for transition to crisp scrollable HTML card
    await expect(page.locator('text=Counting Down to the Auspicious Moment')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Vraj').first()).toBeVisible();

    const openedCardPath = path.join(screenshotsDir, 'after-opened-card-dpr2.png');
    await page.screenshot({ path: openedCardPath });
    console.log(`Saved ${openedCardPath}`);

    await context.close();
  });

  test('4. Opening sequence DPR 3: Seal attached to flap, card rises, crisp HTML card swap', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      isMobile: true,
    });
    const page = await context.newPage();

    await page.goto('http://localhost:4173/');
    await page.waitForTimeout(1500);

    const tapHint = page.locator('button', { hasText: /tap the seal to open/i });
    await tapHint.click();

    await page.waitForTimeout(3000);
    const openMidPath = path.join(screenshotsDir, 'after-opening-mid-dpr3.png');
    await page.screenshot({ path: openMidPath });
    console.log(`Saved ${openMidPath}`);

    await expect(page.locator('text=Counting Down to the Auspicious Moment')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Vraj').first()).toBeVisible();

    const openedCardPath = path.join(screenshotsDir, 'after-opened-card-dpr3.png');
    await page.screenshot({ path: openedCardPath });
    console.log(`Saved ${openedCardPath}`);

    await context.close();
  });
});
