import { test, expect } from "@playwright/test";

test("language picker populates from /config", async ({ page }) => {
  const langSelect = page.locator("#lang-select");
  let options: string[] = [];

  await test.step("Given I open the homepage", async () => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    await expect(page.getByTestId("app-title")).toBeVisible({
      timeout: 60_000,
    });
  });

  await test.step("And I can see the language selector", async () => {
    await expect(langSelect).toBeVisible({ timeout: 30_000 });
  });

  await test.step("Then it lists at least one language option", async () => {
    options = (await langSelect.locator("option").allTextContents()).map((o) =>
      o.trim()
    );
    expect(options.length).toBeGreaterThan(0);
  });

  await test.step("When multiple options exist, I switch to another one", async () => {
    if (options.length > 1) {
      const current = await langSelect.inputValue();
      const next = options.find((v) => v && v !== current) || options[0];
      await langSelect.selectOption(next);
      await expect(page).toHaveURL(new RegExp(`\\blang=${next}\\b`));
    }
  });
});
