import { test, expect } from "@playwright/test";

// Live-only: navigate from list to detail and verify the explanation section renders.

test("navigate to detail and see explanation section", async ({ page }) => {
  let listTitle: string | undefined;

  await test.step("Given I open the homepage", async () => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    await expect(page.getByTestId("app-title")).toBeVisible({ timeout: 60_000 });
  });

  await test.step("And I can see at least one news card", async () => {
    await expect(page.getByTestId("news-card").first()).toBeVisible({ timeout: 60_000 });
  });

  await test.step("When I click the first card", async () => {
    const first = page.getByTestId("news-card").first();
    listTitle = (await first.getByRole("heading", { level: 2 }).first().textContent())?.trim();
    await first.click();
  });

  await test.step("Then I land on the detail page and see matching title", async () => {
    await page.waitForURL(/\/news\//, { timeout: 60_000 });
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible({ timeout: 60_000 });
    const detailTitle = (await h1.textContent())?.trim() || "";
    if (listTitle) {
      const probe = listTitle.slice(0, Math.min(12, listTitle.length));
      expect(detailTitle.toLowerCase()).toContain(probe.toLowerCase());
    }
  });

  await test.step("And I can see the explanation section", async () => {
    const explHeading = page.getByRole("heading", { name: /detailed ai explanation/i });
    await expect(explHeading).toBeVisible({ timeout: 30_000 });
  });

  await test.step("And a generate explanation button may be visible", async () => {
    const generateBtn = page.getByRole("button", { name: /generate detailed explanation/i });
    if (await generateBtn.count()) {
      await expect(generateBtn.first()).toBeVisible();
    }
  });
});
