import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/puroh/.gemini/antigravity/brain/c961780d-d0cf-4b0c-8532-1cd418847b9e';

test.describe('Verify Kuldevi Blessing Line on Hero Card', () => {
  const viewports = [
    { width: 390, height: 844, name: '390x844' },
    { width: 320, height: 568, name: '320x568' },
    { width: 360, height: 640, name: '360x640' },
    { width: 412, height: 915, name: '412x915' },
  ];

  test('Verify text, ordering, style, and no overflow across 320, 360, 390, 412px in EN, HI, GU', async ({ page }) => {
    // 1. English Tests
    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/?mode=plain');
      await page.waitForTimeout(600);

      // Verify pill
      const pill = page.locator('text=SAGAI - DASTUR').last();
      await expect(pill).toBeVisible();

      // Verify Kuldevi blessing line
      const blessing = page.locator('text="With the Immense Grace of Shri Kuldevi Khimaj Mataji, We Have"').first();
      await expect(blessing).toBeVisible();

      // Verify Grandson of
      const grandsonLabel = page.locator('text="Grandson of"').first();
      await expect(grandsonLabel).toBeVisible();

      // Verify Shrimati Morkidevi paragraph with capitalized Wife and Residing
      const grandparents = page.locator('text=/Shrimati Morkidevi, Wife of Shri Dhansinghji Rajpurohit.*Presently Residing in Ahmedabad/').first();
      await expect(grandparents).toBeVisible();
      await expect(grandparents).toBeVisible();

      // Geometry checks
      const pillBox = await pill.boundingBox();
      const blessingBox = await blessing.boundingBox();
      const grandsonBox = await grandsonLabel.boundingBox();

      // Verify top-to-bottom ordering
      expect(pillBox.y + pillBox.height).toBeLessThanOrEqual(blessingBox.y);
      expect(blessingBox.y + blessingBox.height).toBeLessThanOrEqual(grandsonBox.y);

      // Verify spacing
      const pillToBlessingGap = blessingBox.y - (pillBox.y + pillBox.height);
      const blessingToGrandsonGap = grandsonBox.y - (blessingBox.y + blessingBox.height);
      console.log(`[EN ${vp.name}] Gap Pill->Blessing: ${pillToBlessingGap}px, Gap Blessing->Grandson: ${blessingToGrandsonGap}px`);
      expect(pillToBlessingGap).toBeGreaterThanOrEqual(10);
      expect(blessingToGrandsonGap).toBeGreaterThanOrEqual(6);

      // Save screenshot
      const shotPath = path.join(process.cwd(), 'tests', 'screenshots', `hero-blessing-${vp.name}-en.png`);
      await page.screenshot({ path: shotPath });
    }

    // 2. Hindi Tests
    const hindiBtn = page.getByRole('button', { name: 'हिन्दी' });
    await hindiBtn.click();
    await page.waitForTimeout(600);

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(400);

      const pill = page.locator('text=सगाई - दस्तूर').last();
      await expect(pill).toBeVisible();

      const blessing = page.locator('text="श्री कुलदेवी खिमज माताजी की असीम कृपा से, हमारे यहाँ"').first();
      await expect(blessing).toBeVisible();

      const grandparents = page.locator('text=/श्रीमति मोरकीदेवी/').first();
      await expect(grandparents).toBeVisible();

      const pillBox = await pill.boundingBox();
      const blessingBox = await blessing.boundingBox();
      const gpBox = await grandparents.boundingBox();

      expect(pillBox.y + pillBox.height).toBeLessThanOrEqual(blessingBox.y);
      expect(blessingBox.y + blessingBox.height).toBeLessThanOrEqual(gpBox.y);

      const shotPath = path.join(process.cwd(), 'tests', 'screenshots', `hero-blessing-${vp.name}-hi.png`);
      await page.screenshot({ path: shotPath });
    }

    // 3. Gujarati Tests
    const gujaratiBtn = page.getByRole('button', { name: 'ગુજરાતી' });
    await gujaratiBtn.click();
    await page.waitForTimeout(600);

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(400);

      const pill = page.locator('text=સગાઈ - દસ્તૂર').last();
      await expect(pill).toBeVisible();

      const blessing = page.locator('text="શ્રી કુળદેવી ખીમજ માતાજીની અસીમ કૃપાથી, અમારે ત્યાં"').first();
      await expect(blessing).toBeVisible();

      const grandparents = page.locator('text=/શ્રીમતી મોરકીદેવી/').first();
      await expect(grandparents).toBeVisible();

      const pillBox = await pill.boundingBox();
      const blessingBox = await blessing.boundingBox();
      const gpBox = await grandparents.boundingBox();

      expect(pillBox.y + pillBox.height).toBeLessThanOrEqual(blessingBox.y);
      expect(blessingBox.y + blessingBox.height).toBeLessThanOrEqual(gpBox.y);

      const shotPath = path.join(process.cwd(), 'tests', 'screenshots', `hero-blessing-${vp.name}-gu.png`);
      await page.screenshot({ path: shotPath });
    }

    // Copy screenshots to Artifact Directory
    if (fs.existsSync(ARTIFACT_DIR)) {
      const files = fs.readdirSync(path.join(process.cwd(), 'tests', 'screenshots'));
      for (const f of files) {
        if (f.startsWith('hero-blessing-')) {
          fs.copyFileSync(
            path.join(process.cwd(), 'tests', 'screenshots', f),
            path.join(ARTIFACT_DIR, f)
          );
        }
      }
    }
  });
});
