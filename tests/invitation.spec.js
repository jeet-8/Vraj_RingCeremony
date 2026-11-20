import { test, expect } from '@playwright/test';

test.describe('Ring Ceremony Invitation Functional Tests', () => {
  test('Page loads with Shree Ganeshay Namah, Shree Khimaj Mata Namah, Shree Kheteshwaray Namah', async ({ page }) => {
    await page.goto('/');

    // Verify top blessing lines exist and are visible
    const blessing1 = page.locator('text=Shree Ganeshay Namah');
    const blessing2 = page.locator('text=Shree Khimaj Mata Namah');
    const blessing3 = page.locator('text=Shree Kheteshwaray Namah');

    await expect(blessing1).toBeVisible();
    await expect(blessing2).toBeVisible();
    await expect(blessing3).toBeVisible();
  });

  test('Language switcher toggles between English, Hindi, and Gujarati', async ({ page }) => {
    await page.goto('/');

    // Switch to Hindi
    const hindiBtn = page.getByRole('button', { name: 'हिन्दी' });
    await expect(hindiBtn).toBeVisible();
    await hindiBtn.click();

    // Verify Hindi blessing line
    await expect(page.locator('text=श्री खिमज माता नमः')).toBeVisible();

    // Switch to Gujarati
    const gujaratiBtn = page.getByRole('button', { name: 'ગુજરાતી' });
    await expect(gujaratiBtn).toBeVisible();
    await gujaratiBtn.click();

    // Verify Gujarati blessing line
    await expect(page.locator('text=શ્રી ખીમજ માતા નમઃ')).toBeVisible();

    // Switch back to English
    const englishBtn = page.getByRole('button', { name: 'EN' });
    await expect(englishBtn).toBeVisible();
    await englishBtn.click();

    await expect(page.locator('text=Shree Ganeshay Namah')).toBeVisible();
  });

  test('URL guest parameter personalizes greeting in Hero Card', async ({ page }) => {
    await page.goto('/?guest=Rahul-and-family&mode=plain');

    // Verify personalized greeting in Hero Card
    await expect(page.locator('text=Rahul And Family')).toBeVisible();
  });

  test('Invitation opening sequence and scrollable card reveals', async ({ page }) => {
    await page.goto('/');

    // Click "Skip intro" to transition to scrollable invitation
    const skipBtn = page.locator('button', { hasText: 'Skip intro' });
    await expect(skipBtn).toBeVisible();
    await skipBtn.click();

    // Verify Hero Card elements
    await expect(page.locator('text=Vraj').first()).toBeVisible();
    await expect(page.locator('text=Jiya (Pooja)').first()).toBeVisible();
    await expect(page.locator('text=Rekha Kuwar & Prakashsinghji').first()).toBeVisible();
    await expect(page.locator('text=Seema Kuwar & Parvatsinghji').first()).toBeVisible();

    // Verify Countdown Card
    await expect(page.locator('text=Counting Down to the Auspicious Moment')).toBeVisible();
    await expect(page.locator('text=Days')).toBeVisible();
    await expect(page.locator('text=Hours')).toBeVisible();

    // Verify Venue Card & Google Maps link
    await expect(page.locator('text=R.K. Royal Banquet & Party Lawn')).toBeVisible();
    const mapsBtn = page.locator('a', { hasText: 'Open in Google Maps' });
    await expect(mapsBtn).toBeVisible();
    const mapsHref = await mapsBtn.getAttribute('href');
    expect(mapsHref).toBe('https://share.google/SWki02Fxf0gKUxKCN');

    // Verify Schedule Card
    await expect(page.locator('text=Arrival & Welcome')).toBeVisible();
    await expect(page.locator('text=Ring Ceremony & Blessings')).toBeVisible();

    // Verify removed sections are NOT present
    await expect(page.locator('text=Dress Code & Palette')).not.toBeVisible();
    await expect(page.locator('text=Confirm on WhatsApp')).not.toBeVisible();
    await expect(page.locator('text=Google Calendar')).not.toBeVisible();
    await expect(page.locator('text=Download .ics')).not.toBeVisible();
    await expect(page.locator('text=View Simple Version')).not.toBeVisible();

    // Verify Footer buttons: Reopen Envelope
    await expect(page.locator('text=Reopen Envelope')).toBeVisible();
  });

  test('Plain 2D backup view loads immediately without WebGL', async ({ page }) => {
    await page.goto('/?mode=plain');

    await expect(page.locator('text=Switch to 3D View')).toBeVisible();
    await expect(page.locator('text=Vraj').first()).toBeVisible();
    await expect(page.locator('text=R.K. Royal Banquet & Party Lawn')).toBeVisible();
  });

  test('No horizontal scrolling / overflow at 390px mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/?mode=plain');

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });
});
