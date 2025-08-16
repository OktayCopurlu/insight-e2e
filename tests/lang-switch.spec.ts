import { test, expect } from "@playwright/test";

test("language selector updates <html lang> and URL", async ({ page }) => {
  await test.step("Given I open the homepage", async () => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    await expect(page.getByTestId("app-title")).toBeVisible({
      timeout: 30_000,
    });
  });

  const select = page.locator("#lang-select");

  await test.step("And I can see the language selector", async () => {
    await expect(select).toBeVisible({ timeout: 30_000 });
  });

  await test.step("When I change language to Turkish (tr)", async () => {
    await select.selectOption("tr");
  });

  await test.step("Then the URL reflects the selected language", async () => {
    await expect(page).toHaveURL(/\blang=tr\b/);
  });

  await test.step("And the <html> lang attribute is updated", async () => {
    const htmlLang = await page.evaluate(() =>
      document.documentElement.getAttribute("lang")
    );
    expect(htmlLang).toBe("tr");
  });
});
