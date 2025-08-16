import { test, expect } from "@playwright/test";

// Frontend URL (served by Vite dev server). Start it separately or set FE_URL.

test.describe("Insight Frontend smoke", () => {
  test.beforeEach(async ({ page }) => {
    // Provide LIVE hint for tests via globalThis, avoids Node typings
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
    await page.goto("/");

    // Header present
    await expect(page.locator('[data-testid="app-title"]')).toBeVisible({
      timeout: 10_000,
    });

    // Wait for at least one card
    await expect(page.locator('[data-testid="news-card"]').first()).toBeVisible(
      { timeout: 20_000 }
    );

    // Click first card and ensure detail content exists
    const first = page.locator('[data-testid="news-card"]').first();
    // Capture the list title to assert after navigation (more robust for live data)
    const listTitle =
      (
        await first.getByRole("heading", { level: 2 }).first().textContent()
      )?.trim() || "";
    await first.click();

    // Wait for navigation to detail page and title (h1)
    await page.waitForURL(/\/news\//, { timeout: 20_000 });
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible({ timeout: 20_000 });
    const detailTitle = (await h1.textContent())?.trim() || "";
    if (listTitle) {
      const probe = listTitle.slice(0, Math.min(12, listTitle.length));
      expect(detailTitle.toLowerCase()).toContain(probe.toLowerCase());
    }

    // Optional chat button presence
    const chatBtn = page.getByRole("button", { name: /chat|ask ai/i });
    if (await chatBtn.count()) {
      await expect(chatBtn.first()).toBeVisible();
    }
  });
  test("home loads and shows cards", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    // Wait for header title as mount signal
    await expect(page.getByTestId("app-title")).toBeVisible({
      timeout: 15_000,
    });

    // App title visible in header
    await expect(page.getByTestId("app-title")).toBeVisible({
      timeout: 15_000,
    });

    // Wait for at least one news card (stubbed or real)
    const cards = page.getByTestId("news-card");
    await expect(cards.first()).toBeVisible({ timeout: 20_000 });
  });
});
