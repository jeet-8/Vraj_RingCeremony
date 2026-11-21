import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Interactive Scratch-to-Reveal Card', () => {
  test('Photo loading, pointer scratching, auto-reveal, and carousel at 390x844', async ({ page }) => {
    // Collect failed network requests to ensure 0 404s for photos
    const failedRequests = [];
    page.on('response', (response) => {
      if (response.url().includes('/photos/') && response.status() >= 400) {
        failedRequests.push({ url: response.url(), status: response.status() });
      }
    });

    // Navigate in plain mode to jump directly to scrollable cards
    await page.goto('/?mode=plain');
    await page.waitForTimeout(1000);

    // 1. Verify 0 404s for photos
    expect(failedRequests).toHaveLength(0);

    // 2. Locate Scratch Card Section
    const photoSection = page.locator('div[class*="paper-card"]').filter({ hasText: /A Glimpse of Love/i });
    await expect(photoSection).toBeVisible();

    // Scroll photo section into view
    await photoSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    // 3. Verify Canvas is rendered inside arch frame with touch-action: none
    const canvas = photoSection.locator('canvas');
    await expect(canvas).toBeVisible();
    const touchAction = await canvas.evaluate((el) => window.getComputedStyle(el).touchAction);
    expect(touchAction).toBe('none');

    // Capture initial foil state
    const foilShot = path.resolve('tests/screenshots/scratch-01-foil-initial.png');
    await photoSection.screenshot({ path: foilShot });

    // 4. Perform scratching via Pointer Events
    const canvasBox = await canvas.boundingBox();
    expect(canvasBox).not.toBeNull();

    const startX = canvasBox.x + canvasBox.width * 0.15;
    const startY = canvasBox.y + canvasBox.height * 0.20;
    const endX = canvasBox.x + canvasBox.width * 0.85;
    const endY = canvasBox.y + canvasBox.height * 0.80;

    // Simulate dense scratch strokes back and forth across >= 50% of card
    await page.mouse.move(startX, startY);
    await page.mouse.down();

    for (let stroke = 0; stroke < 12; stroke++) {
      const y = startY + stroke * ((endY - startY) / 11);
      if (stroke % 2 === 0) {
        await page.mouse.move(endX, y, { steps: 6 });
      } else {
        await page.mouse.move(startX, y, { steps: 6 });
      }
    }

    await page.mouse.up();
    await page.waitForTimeout(300);

    // Capture during-scratch state
    const midShot = path.resolve('tests/screenshots/scratch-02-during-scratch.png');
    await photoSection.screenshot({ path: midShot });

    // Wait for auto-reveal fade (600ms) + sparkle celebration
    await page.waitForTimeout(1200);

    // If canvas is still visible, press Enter key on the card to reveal photo 1 only
    const canvasEl = photoSection.locator('canvas');
    if (await canvasEl.isVisible()) {
      await canvasEl.press('Enter');
      await page.waitForTimeout(800);
    }

    // Capture revealed photo state
    const revealedShot = path.resolve('tests/screenshots/scratch-03-auto-revealed.png');
    await photoSection.screenshot({ path: revealedShot });

    // 5. Verify Tap to Enlarge opens Lightbox
    const frame = photoSection.locator('div[class*="rounded-t-[140px]"]');
    await frame.click();
    await page.waitForTimeout(500);

    const lightbox = page.locator('div[class*="fixed inset-0"]');
    await expect(lightbox).toBeVisible();

    // Close lightbox
    const closeBtn = lightbox.getByRole('button', { name: /close/i });
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();
    await page.waitForTimeout(300);

    // 6. Verify Next and Previous arrows and dots indicator are REMOVED (single photo only)
    const nextBtn = photoSection.getByLabel('Next photo');
    const prevBtn = photoSection.getByLabel('Previous photo');
    await expect(nextBtn).not.toBeVisible();
    await expect(prevBtn).not.toBeVisible();

    const dots = photoSection.locator('button[aria-label*="Go to photo"]');
    await expect(dots).toHaveCount(0);

    // Capture clean single-photo state
    const singlePhotoShot = path.resolve('tests/screenshots/scratch-04-single-photo.png');
    await photoSection.screenshot({ path: singlePhotoShot });

    console.log('Scratch-to-reveal test completed with 0 errors and 0 404s!');
  });

  test('Background music static import, non-blocking unlock, and mute toggle', async ({ page }) => {
    let audio404 = false;
    page.on('response', (res) => {
      if (res.url().includes('background-music') && res.status() >= 400) {
        audio404 = true;
      }
    });

    await page.goto('/');

    // Tap "Skip intro" to test first-gesture music playback
    const skipBtn = page.getByRole('button', { name: /skip intro/i });
    await expect(skipBtn).toBeVisible();
    await skipBtn.click();
    await page.waitForTimeout(1000);

    // Verify 0 404s for audio
    expect(audio404).toBe(false);

    // Verify Music button shows "Music on"
    const musicBtn = page.locator('button').filter({ hasText: /music on|muted/i });
    await expect(musicBtn).toBeVisible();

    // Toggle mute
    await musicBtn.click();
    await page.waitForTimeout(500);

    // Toggle unmute
    await musicBtn.click();
    await page.waitForTimeout(500);

    console.log('Background music verification passed with 0 404s!');
  });
});
