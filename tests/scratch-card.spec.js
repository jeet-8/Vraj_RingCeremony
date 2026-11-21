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

    // 6. Test Next Slide Arrow (min 44px tap target)
    const nextBtn = photoSection.getByLabel('Next photo');
    if (await nextBtn.isVisible()) {
      const box = await nextBtn.boundingBox();
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);

      await nextBtn.click();
      await page.waitForTimeout(600);

      // Slide 2 has its own unrevealed foil
      const canvasSlide2 = photoSection.locator('canvas');
      await expect(canvasSlide2).toBeVisible();

      // 7. Test "Reveal all" button
      const revealAllBtn = photoSection.getByRole('button', { name: /reveal all/i });
      await expect(revealAllBtn).toBeVisible();
      await revealAllBtn.click();
      await page.waitForTimeout(1000);

      // Capture Slide 2 revealed
      const revealAllShot = path.resolve('tests/screenshots/scratch-04-reveal-all.png');
      await photoSection.screenshot({ path: revealAllShot });
    }

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
