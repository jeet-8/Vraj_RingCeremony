import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/puroh/.gemini/antigravity/brain/c961780d-d0cf-4b0c-8532-1cd418847b9e';

test.describe('Verify Hero Card Pill Text "SAGAI - DASTUR"', () => {
  test('Pill displays SAGAI - DASTUR in EN, HI, GU at 390px and 320px without line wrap', async ({ page }) => {
    // 1. English - 390x844
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/?mode=plain');
    await page.waitForTimeout(1000);

    // Verify Title still has Ring Ceremony
    const title = await page.title();
    expect(title).toContain('Ring Ceremony');

    // Find Pill
    const pill = page.locator('div:has-text("SAGAI - DASTUR")').last();
    await expect(pill).toBeVisible();

    const pillText = await pill.innerText();
    expect(pillText.trim()).toBe('SAGAI - DASTUR');

    // Check single line height (should be around 24-32px, not wrapped)
    const pillBox = await pill.boundingBox();
    expect(pillBox.height).toBeLessThan(40);

    // Screenshot English 390x844
    const en390Path = path.join(process.cwd(), 'tests', 'screenshots', 'hero-sagai-dastur-390x844-en.png');
    await page.screenshot({ path: en390Path });

    // 2. English - 320x568
    await page.setViewportSize({ width: 320, height: 568 });
    await page.waitForTimeout(500);
    const pillBox320 = await pill.boundingBox();
    expect(pillBox320.height).toBeLessThan(40);

    const en320Path = path.join(process.cwd(), 'tests', 'screenshots', 'hero-sagai-dastur-320x568-en.png');
    await page.screenshot({ path: en320Path });

    // 3. Hindi - Switch to Hindi
    const hindiBtn = page.getByRole('button', { name: 'हिन्दी' });
    await hindiBtn.click();
    await page.waitForTimeout(600);

    const hindiPill = page.locator('div:has-text("सगाई - दस्तूर")').last();
    await expect(hindiPill).toBeVisible();
    const hindiText = await hindiPill.innerText();
    expect(hindiText.trim()).toBe('सगाई - दस्तूर');

    const hi320Path = path.join(process.cwd(), 'tests', 'screenshots', 'hero-sagai-dastur-320x568-hi.png');
    await page.screenshot({ path: hi320Path });

    // Hindi 390x844
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500);
    const hi390Path = path.join(process.cwd(), 'tests', 'screenshots', 'hero-sagai-dastur-390x844-hi.png');
    await page.screenshot({ path: hi390Path });

    // 4. Gujarati - Switch to Gujarati
    const gujaratiBtn = page.getByRole('button', { name: 'ગુજરાતી' });
    await gujaratiBtn.click();
    await page.waitForTimeout(600);

    const gujPill = page.locator('div:has-text("સગાઈ - દસ્તૂર")').last();
    await expect(gujPill).toBeVisible();
    const gujText = await gujPill.innerText();
    expect(gujText.trim()).toBe('સગાઈ - દસ્તૂર');

    const gu390Path = path.join(process.cwd(), 'tests', 'screenshots', 'hero-sagai-dastur-390x844-gu.png');
    await page.screenshot({ path: gu390Path });

    // Gujarati 320x568
    await page.setViewportSize({ width: 320, height: 568 });
    await page.waitForTimeout(500);
    const gu320Path = path.join(process.cwd(), 'tests', 'screenshots', 'hero-sagai-dastur-320x568-gu.png');
    await page.screenshot({ path: gu320Path });

    // Copy screenshots to Artifact Directory
    if (fs.existsSync(ARTIFACT_DIR)) {
      const filesToCopy = [
        { src: en390Path, dest: path.join(ARTIFACT_DIR, 'hero-sagai-dastur-390x844-en.png') },
        { src: en320Path, dest: path.join(ARTIFACT_DIR, 'hero-sagai-dastur-320x568-en.png') },
        { src: hi390Path, dest: path.join(ARTIFACT_DIR, 'hero-sagai-dastur-390x844-hi.png') },
        { src: hi320Path, dest: path.join(ARTIFACT_DIR, 'hero-sagai-dastur-320x568-hi.png') },
        { src: gu390Path, dest: path.join(ARTIFACT_DIR, 'hero-sagai-dastur-390x844-gu.png') },
        { src: gu320Path, dest: path.join(ARTIFACT_DIR, 'hero-sagai-dastur-320x568-gu.png') },
      ];
      for (const item of filesToCopy) {
        if (fs.existsSync(item.src)) {
          fs.copyFileSync(item.src, item.dest);
        }
      }
    }
  });
});
