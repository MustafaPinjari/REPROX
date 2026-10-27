import { defineConfig, devices } from '@playwright/test';

/**
 * REPROX Playwright Configuration
 * Configured for production regression testing using system Edge/Chromium.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
    channel: 'msedge',
    headless: true,
  },
  projects: [
    {
      name: 'msedge',
      use: {
        channel: 'msedge',
        headless: true,
      },
    },
  ],
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 3000',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: true,
    timeout: 15000,
  },
});
