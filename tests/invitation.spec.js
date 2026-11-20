import { test, expect } from '@playwright/test';

test.describe('Ring Ceremony Digital Invitation', () => {
  test('Top Blessing Lines are displayed correctly on intro screen', async ({ page }) => {
    await page.goto('/');

    // Check all three blessing lines
    const line1 = page.locator('text=Shree Khimaj Mata Namah');
    const line2 = page.locator('text=Shree Ganeshay Namah');
    const line3 = page.locator('text=Shree Kheteshwar Namah');

    await expect(line1).toBeVisible();
    await expect(line2).toBeVisible();
    await expect(line3).toBeVisible();

    // Verify tap hint or canvas is present
    const tapHint = page.locator('text=Tap the seal to open');
    await expect(tapHint).toBeVisible();
  });

  test('Language toggle switches between English, Hindi, and Gujarati', async ({ page }) => {
    await page.goto('/');

    // Click Hindi
    const hiButton = page.locator('button', { hasText: 'हिन्दी' });
    await hiButton.click();

    // Verify Hindi blessing lines
    await expect(page.locator('text=श्री खिमज माता नमः')).toBeVisible();
    await expect(page.locator('text=श्री गणेशाय नमः')).toBeVisible();
    await expect(page.locator('text=श्री खेतेश्वर नमः')).toBeVisible();

    // Click Gujarati
    const guButton = page.locator('button', { hasText: 'ગુજરાતી' });
    await guButton.click();

    // Verify Gujarati blessing lines
    await expect(page.locator('text=શ્રી ખીમજ માતા નમઃ')).toBeVisible();
    await expect(page.locator('text=શ્રી ગણેશાય નમઃ')).toBeVisible();
    await expect(page.locator('text=શ્રી ખેતેશ્વર નમઃ')).toBeVisible();

    // Click back to English
    const enButton = page.locator('button', { hasText: 'EN' });
    await enButton.click();
    await expect(page.locator('text=Shree Khimaj Mata Namah')).toBeVisible();
  });

  test('URL guest parameter personalizes greeting and WhatsApp RSVP', async ({ page }) => {
    await page.goto('/?guest=Rahul-and-family&mode=plain');

    // Verify personalized greeting in Hero Card
    await expect(page.locator('text=Rahul And Family')).toBeVisible();

    // Verify WhatsApp RSVP link has the guest name encoded
    const rsvpLink = page.locator('a[href*="wa.me"]', { hasText: 'Confirm on WhatsApp' });
    await expect(rsvpLink).toBeVisible();
    const href = await rsvpLink.getAttribute('href');
    expect(href).toContain(encodeURIComponent('Rahul And Family'));
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
    await expect(page.locator('text=Rekha Kanwer & Prakashsinghji').first()).toBeVisible();
    await expect(page.locator('text=Seema Kanwer & Parvatsinghji').first()).toBeVisible();

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

    // Verify Dress Code Card
    await expect(page.locator('text=Dress Code & Palette')).toBeVisible();
    await expect(page.locator('text=Champagne Gold')).toBeVisible();

    // Verify Footer buttons: Google Calendar & Reopen
    await expect(page.locator('text=Google Calendar')).toBeVisible();
    await expect(page.locator('text=Download .ics')).toBeVisible();
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
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // 1px rounding tolerance
  });
});
