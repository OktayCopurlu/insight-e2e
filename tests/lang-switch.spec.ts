import { test, expect } from "@playwright/test";

test("language selector updates <html lang> and URL", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");

  // Ensure app mounted
  await expect(page.locator('[data-testid="app-title"]')).toBeVisible({
    timeout: 15_000,
  });
  const select = page.locator("#lang-select");
  await expect(select).toBeVisible({ timeout: 10_000 });

  // Change language to tr
  await select.selectOption("tr");

  // URL should include ?lang=tr
  await expect(page).toHaveURL(/\blang=tr\b/);

  // Document <html lang> should be set
  const htmlLang = await page.evaluate(() =>
    document.documentElement.getAttribute("lang")
  );
  expect(htmlLang).toBe("tr");
});
