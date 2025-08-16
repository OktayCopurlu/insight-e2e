import { test, expect } from "@playwright/test";

// Frontend URL (served by Vite dev server). Start it separately or set FE_URL.

test.describe("Insight Frontend smoke", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      // @ts-ignore
      (globalThis as any).__E2E_LIVE__ = Boolean((window as any).__E2E_LIVE__);
    });
    page.on("console", (msg) =>
      console.log("[browser]", msg.type(), msg.text())
    );
    page.on("pageerror", (err) => console.error("[pageerror]", err.message));
    page.on("requestfailed", (req) =>
      console.warn("[requestfailed]", req.url(), req.failure()?.errorText)
    );
  });

  test("home shows a list and opens detail", async ({ page }) => {
    let listTitle = "";

    await test.step("Given I open the homepage", async () => {
      await page.goto("/");
      await expect(page.getByTestId("app-title")).toBeVisible({
        timeout: 30_000,
      });
    });

    await test.step("And I can see at least one news card", async () => {
      await expect(page.getByTestId("news-card").first()).toBeVisible({
        timeout: 30_000,
      });
    });

    await test.step("When I click the first card", async () => {
      const first = page.getByTestId("news-card").first();
      listTitle =
        (
          await first.getByRole("heading", { level: 2 }).first().textContent()
        )?.trim() || "";
      await first.click();
    });

    await test.step("Then I land on the detail page and see matching title", async () => {
      await page.waitForURL(/\/news\//, { timeout: 30_000 });
      const h1 = page.getByRole("heading", { level: 1 });
      await expect(h1).toBeVisible({ timeout: 30_000 });
      const detailTitle = (await h1.textContent())?.trim() || "";
      if (listTitle) {
        const probe = listTitle.slice(0, Math.min(12, listTitle.length));
        expect(detailTitle.toLowerCase()).toContain(probe.toLowerCase());
      }
    });

    await test.step("And I may see a Chat button", async () => {
      const chatBtn = page.getByRole("button", { name: /chat|ask ai/i });
      if (await chatBtn.count()) {
        await expect(chatBtn.first()).toBeVisible();
      }
    });
  });

  test("home loads and shows cards", async ({ page }) => {
    await test.step("Given I open the homepage", async () => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto("/");
      await expect(page.getByTestId("app-title")).toBeVisible({
        timeout: 30_000,
      });
    });

    await test.step("Then I can see at least one news card", async () => {
      await expect(page.getByTestId("news-card").first()).toBeVisible({
        timeout: 30_000,
      });
    });
  });
});
