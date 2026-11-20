import { test, expect } from '@playwright/test';
import path from 'path';

test('Verify blessing sequence and capture crisp Hero Card blessing lines', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  
  // Go to plain mode or skip intro to view Hero Card immediately
  await page.goto('/?mode=plain');
  await page.waitForTimeout(1000);

  // Check top 3 blessing lines
  const blessing1 = page.locator('text=Shree Ganeshay Namah');
  const blessing2 = page.locator('text=Shree Khimaj Mata Namah');
  const blessing3 = page.locator('text=Shree Kheteshwaray Namah');

  await expect(blessing1).toBeVisible();
  await expect(blessing2).toBeVisible();
  await expect(blessing3).toBeVisible();

  // Check their vertical order (blessing1 < blessing2 < blessing3)
  const box1 = await blessing1.boundingBox();
  const box2 = await blessing2.boundingBox();
  const box3 = await blessing3.boundingBox();

  expect(box2.y).toBeGreaterThan(box1.y);
  expect(box3.y).toBeGreaterThan(box2.y);

  // Capture screenshot of the Hero card showing crisp blessing lines
  const heroCard = page.locator('.paper-card').first();
  await expect(heroCard).toBeVisible();

  const heroCardPath = path.join(process.cwd(), 'tests', 'screenshots', 'crisp-hero-blessing-lines.png');
  await heroCard.screenshot({ path: heroCardPath });
  console.log(`Saved screenshot to ${heroCardPath}`);
});
