import { defineConfig, devices } from '@playwright/test';
import * as os from 'os';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 3 : undefined,
  reporter: [
    ['line'],
    [
      'allure-playwright',
      {
        detail: true,
        outputFolder: 'allure-results',
        suiteTitle: true,
        environmentInfo: {
          framework: 'Playwright',
          os_platform: os.platform(),
          os_release: os.release(),
          os_version: os.version(),
          node_version: process.version,
        },
      },
    ],
    ['html', { open: 'never' }],
  ],
  timeout: 90000,
  use: {
    baseURL: 'https://www.automationexercise.com',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'], headless: true },
    },
    {
      name: 'Firefox',
      use: { ...devices['Desktop Firefox'], headless: true },
    },
    {
      name: 'Webkit',
      use: { ...devices['Desktop Safari'], headless: true },
    },
  ],
});
