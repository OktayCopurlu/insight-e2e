import { defineConfig, devices } from "@playwright/test";

// Defaults: FE at 5173, BFF at 4000, both already running locally.
const FE = process.env.FE_URL || "http://localhost:5173";
const LIVE =
  !!process.env.BFF_E2E ||
  process.env.LIVE === "1" ||
  process.env.FE_LIVE === "1";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  expect: { timeout: LIVE ? 45_000 : 5_000 },
  use: {
    baseURL: FE,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: LIVE ? 60_000 : undefined,
    navigationTimeout: LIVE ? 60_000 : undefined,
    // Expose a LIVE hint to tests without Node typings
    launchOptions: {
      args: LIVE
        ? ["--enable-features=NetworkService,NetworkServiceInProcess"]
        : [],
    },
  },
  // Auto-start FE if FE_URL not provided
  webServer: process.env.FE_URL
    ? undefined
    : {
        command: "npm run dev -- --port 5173 --strictPort",
        cwd: "../news-web-app-1",
        url: "http://localhost:5173",
        reuseExistingServer: true,
        timeout: 120_000,
      },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
