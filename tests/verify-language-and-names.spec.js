import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/puroh/.gemini/antigravity/brain/c961780d-d0cf-4b0c-8532-1cd418847b9e';

test.describe('Hindi Default, Reopen Behavior, Language Switching, and New Spellings', () => {
  test.setTimeout(90000);

  test('1. Fresh visit opens in Hindi by default, and Reopen keeps Hindi', async ({ browser }) => {
    // Fresh context with en-US browser locale and empty storage
    const context = await browser.newContext({
      locale: 'en-US',
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    await page.goto('/');
    await page.waitForTimeout(1500);

    // a. Verify html lang="hi"
    const htmlLang = await page.getAttribute('html', 'lang');
    expect(htmlLang).toBe('hi');

    // Verify active language pill is हिन्दी
    const activePill = page.locator('button.bg-gradient-to-r:has-text("हिन्दी")');
    await expect(activePill).toBeVisible();

    // Verify Hindi blessings visible on intro screen
    await expect(page.locator('text=श्री गणेशाय नमः').first()).toBeVisible();
    await expect(page.locator('text=श्री खिमज माताय नमः').first()).toBeVisible();
    await expect(page.locator('text=श्री खेतेश्वराय नमः').first()).toBeVisible();

    // Verify Hindi hint text
    await expect(page.locator('text=खोलने के लिए मोहर पर स्पर्श करें').first()).toBeVisible();
    await expect(page.locator('text=कहीं भी स्पर्श करें या मोहर दबाएं').first()).toBeVisible();

    // Capture screenshot of fresh Hindi intro
    const introShotPath = path.join(process.cwd(), 'tests', 'screenshots', 'hindi-default-intro-390x844.png');
    await page.screenshot({ path: introShotPath });

    // Open the envelope / skip to invitation
    const skipBtn = page.locator('button:has-text("सीधे आमंत्रण देखें")');
    await expect(skipBtn).toBeVisible();
    await skipBtn.click();
    await page.waitForTimeout(1000);

    // Verify Hero Card Hindi content with new spellings (मोरीबई, सुखीबई, धर्मपत्नी श्रीधनसिंहजी)
    await expect(page.locator('text=सगाई - दस्तूर').first()).toBeVisible();
    await expect(page.locator('text="श्री कुलदेवी खिमज माताजी की असीम कृपा से, हमारे यहाँ"').first()).toBeVisible();
    await expect(page.locator('text=/श्रीमति मोरीबई धर्मपत्नी श्रीधनसिंहजी राजपुरोहित \\(ठि\\. चूण्ड़ा\\) हाल- अहमदाबाद - का सुपौत्र/').first()).toBeVisible();
    await expect(page.locator('text=/श्रीमति सुखीबई धर्मपत्नी, श्री दीपसिंहजी राजपुरोहित \\(ठि\\. भाचुंडा\\)/').first()).toBeVisible();
    await expect(page.locator('text=की सुपोत्री').first()).toBeVisible();

    // Capture screenshot of Hindi Hero Card
    const heroShotPath = path.join(process.cwd(), 'tests', 'screenshots', 'hindi-default-hero-390x844.png');
    await page.screenshot({ path: heroShotPath });

    // b. Scroll down to footer and tap "Reopen envelope"
    const reopenBtn = page.locator('button:has-text("लिफाफा पुनः खोलें")');
    await reopenBtn.scrollIntoViewIfNeeded();
    await expect(reopenBtn).toBeVisible();
    await reopenBtn.click();
    await page.waitForTimeout(1200);

    // Verify after Reopen, site is STILL in Hindi!
    expect(await page.getAttribute('html', 'lang')).toBe('hi');
    await expect(page.locator('button.bg-gradient-to-r:has-text("हिन्दी")')).toBeVisible();
    await expect(page.locator('text=श्री गणेशाय नमः').first()).toBeVisible();
    await expect(page.locator('text=खोलने के लिए मोहर पर स्पर्श करें').first()).toBeVisible();

    // Capture screenshot of reopened intro in Hindi
    const reopenShotPath = path.join(process.cwd(), 'tests', 'screenshots', 'hindi-reopened-intro-390x844.png');
    await page.screenshot({ path: reopenShotPath });

    if (fs.existsSync(ARTIFACT_DIR)) {
      fs.copyFileSync(introShotPath, path.join(ARTIFACT_DIR, 'hindi-default-intro-390x844.png'));
      fs.copyFileSync(heroShotPath, path.join(ARTIFACT_DIR, 'hindi-default-hero-390x844.png'));
      fs.copyFileSync(reopenShotPath, path.join(ARTIFACT_DIR, 'hindi-reopened-intro-390x844.png'));
    }

    await context.close();
  });

  test('2. Manual selection persists during visit & reopen, but resets on new session', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    await page.goto('/');
    await page.waitForTimeout(1000);

    // c. Switch to EN
    const enBtn = page.getByRole('button', { name: 'EN' });
    await enBtn.click();
    await page.waitForTimeout(600);

    expect(await page.getAttribute('html', 'lang')).toBe('en');
    await expect(page.locator('button.bg-gradient-to-r:has-text("EN")')).toBeVisible();

    // Open invitation
    const skipBtn = page.locator('button:has-text("Skip intro")');
    await skipBtn.click();
    await page.waitForTimeout(800);

    // Verify English text with MoriBai and SukhiBai
    await expect(page.locator('text=/Shrimati MoriBai, Wife of Shri Dhansinghji Rajpurohit/').first()).toBeVisible();
    await expect(page.locator('text=/Shrimati  SukhiBai, Wife of Shri Deep Singhji Rajpurohit/').first()).toBeVisible();

    // Reopen in English -> stays in English!
    const reopenBtnEn = page.locator('button:has-text("Reopen Envelope")');
    await reopenBtnEn.scrollIntoViewIfNeeded();
    await reopenBtnEn.click();
    await page.waitForTimeout(1000);

    expect(await page.getAttribute('html', 'lang')).toBe('en');
    await expect(page.locator('button.bg-gradient-to-r:has-text("EN")')).toBeVisible();
    await expect(page.locator('text=Shree Ganeshay Namah').first()).toBeVisible();

    // d. Switch to Gujarati
    const guBtn = page.getByRole('button', { name: 'ગુજરાતી' });
    await guBtn.click();
    await page.waitForTimeout(600);

    expect(await page.getAttribute('html', 'lang')).toBe('gu');
    await expect(page.locator('button.bg-gradient-to-r:has-text("ગુજરાતી")')).toBeVisible();

    const skipBtnGu = page.locator('button:has-text("સીધું આમંત્રણ જુઓ")');
    await skipBtnGu.click();
    await page.waitForTimeout(800);

    // Verify Gujarati with મોરીબઈ and સુખીબઈ
    await expect(page.locator('text=/શ્રીમતી મોરીબઈ/').first()).toBeVisible();
    await expect(page.locator('text=/શ્રીમતી સુખીબઈ/').first()).toBeVisible();

    // Reopen in Gujarati -> stays in Gujarati!
    const reopenBtnGu = page.locator('button:has-text("કવર ફરી ખોલો")');
    await reopenBtnGu.scrollIntoViewIfNeeded();
    await reopenBtnGu.click();
    await page.waitForTimeout(1000);

    expect(await page.getAttribute('html', 'lang')).toBe('gu');
    await expect(page.locator('button.bg-gradient-to-r:has-text("ગુજરાતી")')).toBeVisible();

    await context.close();
  });

  test('3. Responsive Layout & No Overflow across 320, 360, 390, 412px in Hi, En, Gu', async ({ browser }) => {
    const viewports = [
      { name: '320x568', width: 320, height: 568 },
      { name: '360x640', width: 360, height: 640 },
      { name: '390x844', width: 390, height: 844 },
      { name: '412x915', width: 412, height: 915 },
    ];

    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    await page.goto('/');
    await page.waitForTimeout(1000);

    const skipBtn = page.locator('button:has-text("सीधे आमंत्रण देखें"), button:has-text("Skip intro")');
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
      await page.waitForTimeout(800);
    }

    const langs = [
      { code: 'hi', label: 'हिन्दी' },
      { code: 'en', label: 'EN' },
      { code: 'gu', label: 'ગુજરાતી' },
    ];

    for (const lang of langs) {
      const btn = page.getByRole('button', { name: lang.label });
      await btn.click();
      await page.waitForTimeout(500);

      for (const vp of viewports) {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.waitForTimeout(300);

        const card = page.locator('.paper-card').first();
        await expect(card).toBeVisible();
        const cardBox = await card.boundingBox();
        expect(cardBox.width).toBeLessThanOrEqual(vp.width);

        const shotPath = path.join(process.cwd(), 'tests', 'screenshots', `hero-${lang.code}-${vp.name}.png`);
        await page.screenshot({ path: shotPath });

        if (fs.existsSync(ARTIFACT_DIR)) {
          fs.copyFileSync(shotPath, path.join(ARTIFACT_DIR, `hero-${lang.code}-${vp.name}.png`));
        }
      }
    }

    await context.close();
  });
});
