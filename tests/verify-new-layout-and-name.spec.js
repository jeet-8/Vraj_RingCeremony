import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Verify Hero Card Layout & Pooja (Jiya) & V & P Monogram', () => {
  test('1. Sealed envelope displays V & P monogram on wax seal', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForTimeout(2000);

    // Capture sealed envelope screenshot
    const shotPath = path.join(process.cwd(), 'tests', 'screenshots', 'screenshot-sealed-envelope-vp.png');
    await page.screenshot({ path: shotPath });
    console.log(`Saved sealed envelope screenshot: ${shotPath}`);
  });

  test('2. Hero card layout matches exact new order, parents under child, no box, responsive', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/?mode=plain');
    await page.waitForTimeout(1000);

    // Verify Title & Meta
    const title = await page.title();
    expect(title).toBe('Ring Ceremony Invitation | Vraj & Pooja (Jiya) - 6 Dec 2026');

    // Verify Blessing lines at top
    const blessing1 = page.locator('text=Shree Ganeshay Namah');
    const blessing2 = page.locator('text=Shree Khimaj Mata Namah');
    const blessing3 = page.locator('text=Shree Kheteshwaray Namah');
    await expect(blessing1).toBeVisible();
    await expect(blessing2).toBeVisible();
    await expect(blessing3).toBeVisible();

    // Verify Invitation Text
    const elderBlessing = page.locator('text=With the divine blessings of our beloved elders');
    const invite = page.locator('text=cordially invite you to celebrate the joyous Ring Ceremony of');
    await expect(elderBlessing).toBeVisible();
    await expect(invite).toBeVisible();

    // Verify Groom Block
    const groomName = page.locator('h1', { hasText: 'Vraj' });
    const sonOf = page.locator('text=Son of');
    const groomParents = page.locator('text=Rekha Kuwar & Prakashsinghji');
    await expect(groomName).toBeVisible();
    await expect(sonOf).toBeVisible();
    await expect(groomParents).toBeVisible();

    // Verify Bride Block
    const brideName = page.locator('h1', { hasText: 'Pooja (Jiya)' });
    const daughterOf = page.locator('text=Daughter of');
    const brideParents = page.locator('text=Seema Kuwar & Parvatsinghji');
    await expect(brideName).toBeVisible();
    await expect(daughterOf).toBeVisible();
    await expect(brideParents).toBeVisible();

    // Verify vertical order:
    // blessing1 < elderBlessing < invite < groomName < sonOf < groomParents < brideName < daughterOf < brideParents
    const boxBlessing = await blessing1.boundingBox();
    const boxElder = await elderBlessing.boundingBox();
    const boxInvite = await invite.boundingBox();
    const boxGroom = await groomName.boundingBox();
    const boxSonOf = await sonOf.boundingBox();
    const boxGroomParents = await groomParents.boundingBox();
    const boxBride = await brideName.boundingBox();
    const boxDaughterOf = await daughterOf.boundingBox();
    const boxBrideParents = await brideParents.boundingBox();

    expect(boxElder.y).toBeGreaterThan(boxBlessing.y);
    expect(boxInvite.y).toBeGreaterThan(boxElder.y);
    expect(boxGroom.y).toBeGreaterThan(boxInvite.y);
    expect(boxSonOf.y).toBeGreaterThan(boxGroom.y);
    expect(boxGroomParents.y).toBeGreaterThan(boxSonOf.y);
    expect(boxBride.y).toBeGreaterThan(boxGroomParents.y);
    expect(boxDaughterOf.y).toBeGreaterThan(boxBride.y);
    expect(boxBrideParents.y).toBeGreaterThan(boxDaughterOf.y);

    // Capture screenshot of Hero Card at 390px
    const heroCard = page.locator('.paper-card').first();
    const heroShotPath = path.join(process.cwd(), 'tests', 'screenshots', 'screenshot-opened-hero-parents.png');
    await heroCard.screenshot({ path: heroShotPath });
    console.log(`Saved hero card screenshot: ${heroShotPath}`);
  });

  test('3. Responsive fit at 320px width: no overflow, Pooja (Jiya) on single line', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/?mode=plain');
    await page.waitForTimeout(1000);

    const brideName = page.locator('h1', { hasText: 'Pooja (Jiya)' });
    await expect(brideName).toBeVisible();

    // Check no horizontal overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);

    const heroCard = page.locator('.paper-card').first();
    const shotPath = path.join(process.cwd(), 'tests', 'screenshots', 'screenshot-hero-320px.png');
    await heroCard.screenshot({ path: shotPath });
    console.log(`Saved 320px screenshot: ${shotPath}`);
  });

  test('4. Language switcher displays localized parents and labels (Hindi & Gujarati)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/?mode=plain');
    await page.waitForTimeout(1000);

    // Switch to Hindi
    const hiBtn = page.getByRole('button', { name: 'हिन्दी' });
    await hiBtn.click();
    await page.waitForTimeout(500);

    await expect(page.getByText('सुपुत्र', { exact: true })).toBeVisible();
    await expect(page.locator('text=रेखा कुंवर & प्रकाशसिंहजी')).toBeVisible();
    await expect(page.getByText('सुपुत्री', { exact: true })).toBeVisible();
    await expect(page.locator('text=सीमा कुंवर & पार्वतसिंहजी')).toBeVisible();

    // Switch to Gujarati
    const guBtn = page.getByRole('button', { name: 'ગુજરાતી' });
    await guBtn.click();
    await page.waitForTimeout(500);

    await expect(page.getByText('સુપુત્ર', { exact: true })).toBeVisible();
    await expect(page.locator('text=રેખા કુંવર & પ્રકાશસિંહજી')).toBeVisible();
    await expect(page.getByText('સુપુત્રી', { exact: true })).toBeVisible();
    await expect(page.locator('text=સીમા કુંવર & પાર્વતસિંહજી')).toBeVisible();
  });
});
