import { defineConfig } from "@playwright/test";
const port=Number(process.env.PLAYWRIGHT_TEST_PORT??8031);
const baseURL=`http://127.0.0.1:${port}`;
export default defineConfig({
  testDir: "./tests/browser",
  use: {
    baseURL,
    launchOptions: {
      executablePath: "/usr/bin/chromium",
      args: ["--no-sandbox"],
    },
  },
  webServer: {
    command: `python3 -m http.server ${port} --bind 127.0.0.1`,
    url: baseURL,
    reuseExistingServer: false,
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 } } },
    {
      name: "mobile",
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
});
