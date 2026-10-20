import { defineConfig } from "@playwright/test";

// On Windows, uses the Microsoft Edge already installed, so no extra browser download is needed; elsewhere (the cloud),
// the Chromium that Playwright finds by itself.
const browser = process.platform === "win32" ? { channel: "msedge" } : {};

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  // the reader parses whole books (the Iliad) in the page; with many tests in parallel that can take longer than 5 s
  expect: { timeout: 15_000 },
  use: { baseURL: "http://localhost:3100", ...browser },
  webServer: {
    command: "npm run build && node scripts/serve-out.mjs 3100",
    url: "http://localhost:3100",
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
