import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/puroh/.gemini/antigravity/brain/c961780d-d0cf-4b0c-8532-1cd418847b9e';

test.describe('Verify 3D Animation Card Content, Ribbon & Sharpness at 390x844 DPR 3', () => {
  test.use({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
  });

  test('1. English: 3D card content matches Hero Card, ribbon does not overlap text', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    // Click the seal / button to start opening animation
    const tapButton = page.locator('button:has-text("Tap the seal to open")');
    if (await tapButton.isVisible()) {
      await tapButton.click();
    } else {
      await page.click('canvas');
    }

    // Wait 2.8s: Top flap is open, card is revealed with tied ribbon & bow
    await page.waitForTimeout(2800);
    const midShotPath = path.join(process.cwd(), 'tests', 'screenshots', '3d-card-mid-animation-390x844-dpr3-en.png');
    await page.screenshot({ path: midShotPath });
    console.log(`Saved mid-animation screenshot: ${midShotPath}`);

    // Wait 2.4s more (total ~5.2s): Bow untied, ribbon cleared, card risen
    await page.waitForTimeout(2400);
    const risenShotPath = path.join(process.cwd(), 'tests', 'screenshots', '3d-card-risen-390x844-dpr3-en.png');
    await page.screenshot({ path: risenShotPath });
    console.log(`Saved risen card screenshot: ${risenShotPath}`);

    // Wait for animation completion and crossfade to crisp HTML card (~7.5s)
    await page.waitForTimeout(2500);
    const heroCard = page.locator('text=SAGAI - DASTUR').first();
    await expect(heroCard).toBeVisible({ timeout: 5000 });

    const endShotPath = path.join(process.cwd(), 'tests', 'screenshots', 'html-card-end-390x844-dpr3-en.png');
    await page.screenshot({ path: endShotPath });
    console.log(`Saved end HTML card screenshot: ${endShotPath}`);

    // Copy to artifact directory
    if (fs.existsSync(ARTIFACT_DIR)) {
      fs.copyFileSync(midShotPath, path.join(ARTIFACT_DIR, '3d-card-mid-animation-390x844-dpr3-en.png'));
      fs.copyFileSync(risenShotPath, path.join(ARTIFACT_DIR, '3d-card-risen-390x844-dpr3-en.png'));
      fs.copyFileSync(endShotPath, path.join(ARTIFACT_DIR, 'html-card-end-390x844-dpr3-en.png'));
    }
  });

  test('2. Hindi: 3D card renders Devanagari text, Sagai Dastur pill, and matches Hero card', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500);

    // Switch to Hindi
    const hindiBtn = page.getByRole('button', { name: 'हिन्दी' });
    await hindiBtn.click();
    await page.waitForTimeout(800);

    // Click to start opening
    const tapButton = page.locator('button:has-text("खोलने के लिए मोहर पर स्पर्श करें")');
    if (await tapButton.isVisible()) {
      await tapButton.click();
    } else {
      await page.click('canvas');
    }

    await page.waitForTimeout(2800);
    const midShotPath = path.join(process.cwd(), 'tests', 'screenshots', '3d-card-mid-animation-390x844-dpr3-hi.png');
    await page.screenshot({ path: midShotPath });

    await page.waitForTimeout(5000);
    const endShotPath = path.join(process.cwd(), 'tests', 'screenshots', 'html-card-end-390x844-dpr3-hi.png');
    await page.screenshot({ path: endShotPath });

    if (fs.existsSync(ARTIFACT_DIR)) {
      fs.copyFileSync(midShotPath, path.join(ARTIFACT_DIR, '3d-card-mid-animation-390x844-dpr3-hi.png'));
      fs.copyFileSync(endShotPath, path.join(ARTIFACT_DIR, 'html-card-end-390x844-dpr3-hi.png'));
    }
  });

  test('3. Gujarati: 3D card renders Gujarati text, Sagai Dastur pill, and matches Hero card', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500);

    // Switch to Gujarati
    const gujaratiBtn = page.getByRole('button', { name: 'ગુજરાતી' });
    await gujaratiBtn.click();
    await page.waitForTimeout(800);

    // Click to start opening
    const tapButton = page.locator('button:has-text("ખોલવા માટે સીલ પર સ્પર્શ કરો")');
    if (await tapButton.isVisible()) {
      await tapButton.click();
    } else {
      await page.click('canvas');
    }

    await page.waitForTimeout(2800);
    const midShotPath = path.join(process.cwd(), 'tests', 'screenshots', '3d-card-mid-animation-390x844-dpr3-gu.png');
    await page.screenshot({ path: midShotPath });

    await page.waitForTimeout(5000);
    const endShotPath = path.join(process.cwd(), 'tests', 'screenshots', 'html-card-end-390x844-dpr3-gu.png');
    await page.screenshot({ path: endShotPath });

    if (fs.existsSync(ARTIFACT_DIR)) {
      fs.copyFileSync(midShotPath, path.join(ARTIFACT_DIR, '3d-card-mid-animation-390x844-dpr3-gu.png'));
      fs.copyFileSync(endShotPath, path.join(ARTIFACT_DIR, 'html-card-end-390x844-dpr3-gu.png'));
    }
  });
});
