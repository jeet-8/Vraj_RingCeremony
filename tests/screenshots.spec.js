import { test } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test('Capture responsive screenshots', async ({ page, browserName }) => {
  const screenshotsDir = path.resolve('tests/screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  // 1. Mobile Intro (390x844)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(screenshotsDir, '01-mobile-intro.png') });

  // 2. Hindi Intro
  await page.click('button:has-text("हिन्दी")');
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(screenshotsDir, '02-mobile-hindi.png') });

  // 3. Gujarati Intro
  await page.click('button:has-text("ગુજરાતી")');
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(screenshotsDir, '03-mobile-gujarati.png') });

  // 4. Personalized Scrollable Invitation
  await page.goto('/?guest=Rahul-and-family');
  await page.waitForTimeout(800);
  await page.click('button:has-text("Skip intro")');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(screenshotsDir, '04-personalized-hero.png') });

  // 5. Scroll down to Venue & Schedule
  await page.evaluate(() => window.scrollTo(0, 850));
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(screenshotsDir, '05-venue-schedule.png') });

  // 6. Scroll down to Dress Code & RSVP
  await page.evaluate(() => window.scrollTo(0, 1600));
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(screenshotsDir, '06-rsvp-footer.png') });

  // 7. Plain 2D Backup Version
  await page.goto('/?mode=plain&guest=Rahul-and-family');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotsDir, '07-plain-2d-view.png') });
});
