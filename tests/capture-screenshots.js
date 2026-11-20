import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function run() {
  const screenshotsDir = path.resolve('tests/screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch();

  // 1. Mobile 390x844 - Intro Screen
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:4173/');
  await mobilePage.waitForTimeout(2000);
  await mobilePage.screenshot({ path: path.join(screenshotsDir, '01-mobile-intro-envelope.png') });
  console.log('Saved 01-mobile-intro-envelope.png');

  // 2. Hindi Language Toggle
  await mobilePage.click('button:has-text("हिन्दी")');
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({ path: path.join(screenshotsDir, '02-mobile-hindi-intro.png') });
  console.log('Saved 02-mobile-hindi-intro.png');

  // 3. Gujarati Language Toggle
  await mobilePage.click('button:has-text("ગુજરાતી")');
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({ path: path.join(screenshotsDir, '03-mobile-gujarati-intro.png') });
  console.log('Saved 03-mobile-gujarati-intro.png');

  // 4. Personalized Invitation View (?guest=Rahul-and-family)
  await mobilePage.goto('http://localhost:4173/?guest=Rahul-and-family');
  await mobilePage.waitForTimeout(1000);
  await mobilePage.click('button:has-text("Skip intro")');
  await mobilePage.waitForTimeout(1500);
  await mobilePage.screenshot({ path: path.join(screenshotsDir, '04-mobile-personalized-hero.png') });
  console.log('Saved 04-mobile-personalized-hero.png');

  // Scroll down to Venue & Schedule
  await mobilePage.evaluate(() => window.scrollTo(0, 900));
  await mobilePage.waitForTimeout(800);
  await mobilePage.screenshot({ path: path.join(screenshotsDir, '05-mobile-venue-schedule.png') });
  console.log('Saved 05-mobile-venue-schedule.png');

  // Scroll down to RSVP & Footer
  await mobilePage.evaluate(() => window.scrollTo(0, 1800));
  await mobilePage.waitForTimeout(800);
  await mobilePage.screenshot({ path: path.join(screenshotsDir, '06-mobile-rsvp-footer.png') });
  console.log('Saved 06-mobile-rsvp-footer.png');

  // 5. Desktop 1920x1080 - Intro View
  const desktopContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto('http://localhost:4173/');
  await desktopPage.waitForTimeout(2000);
  await desktopPage.screenshot({ path: path.join(screenshotsDir, '07-desktop-intro.png') });
  console.log('Saved 07-desktop-intro.png');

  // 6. Plain 2D Backup Version
  await desktopPage.goto('http://localhost:4173/?mode=plain&guest=Rahul-and-family');
  await desktopPage.waitForTimeout(1500);
  await desktopPage.screenshot({ path: path.join(screenshotsDir, '08-plain-2d-backup.png') });
  console.log('Saved 08-plain-2d-backup.png');

  await browser.close();
  console.log('All screenshots captured successfully!');
}

run().catch(console.error);
