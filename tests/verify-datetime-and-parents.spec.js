import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/puroh/.gemini/antigravity/brain/c961780d-d0cf-4b0c-8532-1cd418847b9e';

test.describe('Verify Parents Name Spelling and Date/Time Block Enlargement', () => {
  const viewports = [
    { width: 390, height: 844, name: '390x844' },
    { width: 320, height: 568, name: '320x568' },
    { width: 360, height: 640, name: '360x640' },
    { width: 412, height: 915, name: '412x915' },
  ];

  test('Verify spelling, typography, single-line rendering, and spacing across EN, HI, GU', async ({ page }) => {
    // 1. English Verification
    await page.goto('/?mode=plain');
    const enBtn = page.getByRole('button', { name: 'EN' });
    await enBtn.click();
    await page.waitForTimeout(600);

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(400);

      // Verify parents names in English
      const groomParents = page.locator('text="Rekha Kuwar & Prakashsinghji"').first();
      await expect(groomParents).toBeVisible();

      const brideParents = page.locator('text="Seema Kuwar & Parvatsinghji"').first();
      await expect(brideParents).toBeVisible();

      // Ensure old spaced spellings do NOT exist in the page text
      const pageText = await page.textContent('body');
      expect(pageText).not.toContain('Prakash singhji');
      expect(pageText).not.toContain('Parvat singhji');

      // Verify Date element
      const dateEl = page.locator('text=SUNDAY, 6 DECEMBER 2026').first();
      await expect(dateEl).toBeVisible();

      // Verify Time element
      const timeEl = page.locator('text=4:00 PM Onwards').first();
      await expect(timeEl).toBeVisible();

      // Measure computed styles & bounding boxes
      const dateBox = await dateEl.boundingBox();
      const timeBox = await timeEl.boundingBox();

      const dateStyles = await dateEl.evaluate((el) => {
        const s = window.getComputedStyle(el);
        return {
          fontSize: parseFloat(s.fontSize),
          fontWeight: s.fontWeight,
          color: s.color,
          scrollHeight: el.scrollHeight,
          clientHeight: el.clientHeight,
          scrollWidth: el.scrollWidth,
          clientWidth: el.clientWidth,
        };
      });

      const timeStyles = await timeEl.evaluate((el) => {
        const s = window.getComputedStyle(el);
        return {
          fontSize: parseFloat(s.fontSize),
          fontWeight: s.fontWeight,
          color: s.color,
          scrollHeight: el.scrollHeight,
          clientHeight: el.clientHeight,
          scrollWidth: el.scrollWidth,
          clientWidth: el.clientWidth,
        };
      });

      console.log(`[EN ${vp.name}] Date fontSize: ${dateStyles.fontSize.toFixed(1)}px (wt: ${dateStyles.fontWeight}), Time fontSize: ${timeStyles.fontSize.toFixed(1)}px (wt: ${timeStyles.fontWeight})`);
      console.log(`[EN ${vp.name}] Date scrollWidth=${dateStyles.scrollWidth}, clientWidth=${dateStyles.clientWidth}`);
      console.log(`[EN ${vp.name}] Time scrollWidth=${timeStyles.scrollWidth}, clientWidth=${timeStyles.clientWidth}`);

      // Verify Date is noticeably larger than Time at all viewports
      expect(dateStyles.fontSize).toBeGreaterThan(timeStyles.fontSize);

      // Verify Date is weight 600
      expect(parseInt(dateStyles.fontWeight, 10)).toBeGreaterThanOrEqual(600);

      // Verify Time is medium/semibold (500 or 600)
      expect(parseInt(timeStyles.fontWeight, 10)).toBeGreaterThanOrEqual(500);

      // Verify Wine color on time (#4A1224 is rgb(74, 18, 36))
      expect(timeStyles.color).toContain('74, 18, 36');

      // Verify single line (no horizontal scroll or wrapping)
      expect(dateStyles.scrollWidth).toBeLessThanOrEqual(dateStyles.clientWidth + 2);
      expect(timeStyles.scrollWidth).toBeLessThanOrEqual(timeStyles.clientWidth + 2);

      // Verify Gap between Date and Time (~8-12px)
      const dateTimeGap = timeBox.y - (dateBox.y + dateBox.height);
      console.log(`[EN ${vp.name}] Gap Date->Time: ${dateTimeGap.toFixed(1)}px`);
      expect(dateTimeGap).toBeGreaterThanOrEqual(7);
      expect(dateTimeGap).toBeLessThanOrEqual(15);

      // Save screenshot
      const shotPath = path.join(process.cwd(), 'tests', 'screenshots', `parents-date-${vp.name}-en.png`);
      await page.screenshot({ path: shotPath });
    }

    // 2. Hindi Verification
    const hindiBtn = page.getByRole('button', { name: 'हिन्दी' });
    await hindiBtn.click();
    await page.waitForTimeout(600);

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(400);

      // Verify Hindi parents names without space
      const groomHi = page.locator('text="रेखा कुंवर & प्रकाशसिंहजी"').first();
      await expect(groomHi).toBeVisible();

      const brideHi = page.locator('text="सीमा कुंवर & पर्वतसिंहजी"').first();
      await expect(brideHi).toBeVisible();

      // Ensure no old Hindi spellings
      const pageText = await page.textContent('body');
      expect(pageText).not.toContain('प्रकाश सिंहजी');
      expect(pageText).not.toContain('पार्वत सिंहजी');
      expect(pageText).not.toContain('पार्वतसिंहजी');
      expect(pageText).not.toContain('पर्वत सिंहजी');

      // Verify Date and Time
      const dateEl = page.locator('text=SUNDAY, 6 DECEMBER 2026').first();
      const timeEl = page.locator('text=4:00 PM Onwards').first();
      await expect(dateEl).toBeVisible();
      await expect(timeEl).toBeVisible();

      const timeStyles = await timeEl.evaluate((el) => {
        const s = window.getComputedStyle(el);
        return {
          scrollWidth: el.scrollWidth,
          clientWidth: el.clientWidth,
        };
      });
      expect(timeStyles.scrollWidth).toBeLessThanOrEqual(timeStyles.clientWidth + 2);

      const shotPath = path.join(process.cwd(), 'tests', 'screenshots', `parents-date-${vp.name}-hi.png`);
      await page.screenshot({ path: shotPath });
    }

    // 3. Gujarati Verification
    const gujaratiBtn = page.getByRole('button', { name: 'ગુજરાતી' });
    await gujaratiBtn.click();
    await page.waitForTimeout(600);

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(400);

      // Verify Gujarati parents names without space
      const groomGu = page.locator('text="રેખા કુંવર & પ્રકાશસિંહજી"').first();
      await expect(groomGu).toBeVisible();

      const brideGu = page.locator('text="સીમા કુંવર & પર્વતસિંહજી"').first();
      await expect(brideGu).toBeVisible();

      // Ensure no old Gujarati spellings
      const pageText = await page.textContent('body');
      expect(pageText).not.toContain('પ્રકાશ સિંહજી');
      expect(pageText).not.toContain('પાર્વત સિંહજી');
      expect(pageText).not.toContain('પાર્વતસિંહજી');
      expect(pageText).not.toContain('પર્વત સિંહજી');

      // Verify Date and Time
      const dateEl = page.locator('text=SUNDAY, 6 DECEMBER 2026').first();
      const timeEl = page.locator('text=4:00 PM Onwards').first();
      await expect(dateEl).toBeVisible();
      await expect(timeEl).toBeVisible();

      const timeStyles = await timeEl.evaluate((el) => {
        const s = window.getComputedStyle(el);
        return {
          scrollWidth: el.scrollWidth,
          clientWidth: el.clientWidth,
        };
      });
      expect(timeStyles.scrollWidth).toBeLessThanOrEqual(timeStyles.clientWidth + 2);

      const shotPath = path.join(process.cwd(), 'tests', 'screenshots', `parents-date-${vp.name}-gu.png`);
      await page.screenshot({ path: shotPath });
    }

    // Copy screenshots to Artifact Directory
    if (fs.existsSync(ARTIFACT_DIR)) {
      const files = fs.readdirSync(path.join(process.cwd(), 'tests', 'screenshots'));
      for (const f of files) {
        if (f.startsWith('parents-date-')) {
          fs.copyFileSync(
            path.join(process.cwd(), 'tests', 'screenshots', f),
            path.join(ARTIFACT_DIR, f)
          );
        }
      }
    }
  });
});
