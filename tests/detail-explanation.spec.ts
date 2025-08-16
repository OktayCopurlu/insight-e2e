import { test, expect } from "@playwright/test";

// Live-only: navigate from list to detail and verify the explanation section renders.

test("navigate to detail and see explanation section", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await expect(page.locator('[data-testid="app-title"]')).toBeVisible({
    timeout: 60_000,
  });

  // Wait and click first card
  const first = page.locator('[data-testid="news-card"]').first();
  await expect(first).toBeVisible({ timeout: 60_000 });
  // Capture list title for robust assertion after navigation
  const listTitle = (
    await first.getByRole("heading", { level: 2 }).first().textContent()
  )?.trim();
  await first.click();

  // Wait for URL change and h1 title on detail page
  await page.waitForURL(/\/news\//, { timeout: 60_000 });
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toBeVisible({ timeout: 60_000 });
  const detailTitle = (await h1.textContent())?.trim() || "";
  if (listTitle) {
    const probe = listTitle.slice(0, Math.min(12, listTitle.length));
    expect(detailTitle.toLowerCase()).toContain(probe.toLowerCase());
  }

  // Explanation section should exist
  const explHeading = page.getByRole("heading", {
    name: /detailed ai explanation/i,
  });
  await expect(explHeading).toBeVisible({ timeout: 30_000 });

  // If a generate button is present, just verify it's visible (don’t trigger AI calls in e2e)
  const generateBtn = page.getByRole("button", {
    name: /generate detailed explanation/i,
  });
  if (await generateBtn.count()) {
    await expect(generateBtn.first()).toBeVisible();
  }
});
