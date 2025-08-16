import { test, expect } from "@playwright/test";

test("language picker populates from /config", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await expect(page.locator('[data-testid="app-title"]')).toBeVisible({
    timeout: 60_000,
  });

  const langSelect = page.locator("#lang-select");
  await expect(langSelect).toBeVisible({ timeout: 30_000 });

  // Ensure it has at least one option
  const options = await langSelect.locator("option").allTextContents();
  expect(options.length).toBeGreaterThan(0);

  // If more than one language is available, switch to a different one and verify URL reflects it
  if (options.length > 1) {
    const current = await langSelect.inputValue();
    const next =
      options.map((o) => o.trim()).find((v) => v && v !== current) ||
      options[0].trim();
    await langSelect.selectOption(next);
    await expect(page).toHaveURL(new RegExp(`\\blang=${next}\\b`));
  }
});
