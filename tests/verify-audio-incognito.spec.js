import { test, expect } from '@playwright/test';

test.describe('Audio Autoplay & First-Gesture Fallback Verification (Incognito Simulation)', () => {
  test('Fresh session starts audio on load or on first user gesture with clean UI and no hint pill', async ({ page }) => {
    // Playwright test runner naturally runs with a completely empty, fresh incognito context
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Locate Music button regardless of language (Hindi default: संगीत / म्यूट, English: Music on / Muted)
    const musicBtn = page.locator('button:has-text("संगीत"), button:has-text("Music"), button:has-text("સંગીત"), button:has-text("म्यूट"), button:has-text("Muted")').first();
    await expect(musicBtn).toBeVisible();

    const audioStatusOnLoad = await page.evaluate(() => {
      const se = window.__soundEngine;
      return {
        isPlaying: se?.isPlaying,
        isMuted: se?.isMuted,
        audioPaused: se?.audioElement?.paused,
        audioMuted: se?.audioElement?.muted,
        audioVolume: se?.audioElement?.volume,
      };
    });
    console.log('[Incognito Test] Audio status on load:', JSON.stringify(audioStatusOnLoad));

    // Confirm that NO hint pill exists in the DOM
    const hintPill = page.locator(':has-text("संगीत के लिए कहीं भी स्पर्श करें"), :has-text("Tap anywhere for music"), :has-text("સંગીત માટે ગમે ત્યાં સ્પર્શ કરો")').first();
    const isHintPresent = await hintPill.isVisible().catch(() => false);
    expect(isHintPresent).toBe(false);

    // Simulate first user gesture: tap anywhere on the screen
    await page.mouse.click(200, 300);
    await page.waitForTimeout(600);

    const audioStatusAfterTap = await page.evaluate(() => {
      const se = window.__soundEngine;
      return {
        isPlaying: se?.isPlaying,
        isMuted: se?.isMuted,
        audioPaused: se?.audioElement?.paused,
        audioMuted: se?.audioElement?.muted,
      };
    });
    console.log('[Incognito Test] Audio status after tap:', JSON.stringify(audioStatusAfterTap));
    expect(audioStatusAfterTap.isPlaying).toBe(true);
    expect(audioStatusAfterTap.isMuted).toBe(false);

    // Verify user explicit mute
    await musicBtn.click();
    await page.waitForTimeout(300);

    const isMutedSession = await page.evaluate(() => {
      return sessionStorage.getItem('vraj_music_muted');
    });
    expect(isMutedSession).toBe('true');

    // Tap somewhere else again: must remain muted
    await page.mouse.click(100, 150);
    await page.waitForTimeout(300);
    const stillMuted = await page.evaluate(() => {
      return sessionStorage.getItem('vraj_music_muted');
    });
    expect(stillMuted).toBe('true');
  });
});
