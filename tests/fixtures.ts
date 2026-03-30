import { test as base, expect, Page } from '@playwright/test';
import RegisterPage from '../pages/register.page';
import { buildTestUser, TestUser } from '../utils/testUser';

type TestFixtures = {
  ephemeralUser: TestUser;
  registeredUser: TestUser;
};

const blockedUrlPatterns = [
  /doubleclick\.net/i,
  /googlesyndication/i,
  /googleads/i,
  /google-analytics/i,
  /adservice/i,
  /ad-score/i,
  /stickyadstv/i,
  /flashtalking/i,
  /2mdn\.net/i,
];

async function blockThirdPartyNoise(page: Page) {
  await page.route('**/*', async route => {
    const url = route.request().url();

    if (blockedUrlPatterns.some(pattern => pattern.test(url))) {
      await route.abort();
      return;
    }

    await route.continue();
  });
}

async function registerUser(page: Page, user: TestUser) {
  const registerPage = new RegisterPage(page);

  await registerPage.navigate();
  await registerPage.registerAccount(user);
  await expect(registerPage.accountCreated).toBeVisible();
}

export const test = base.extend<TestFixtures>({
  page: async ({ page }, use) => {
    await blockThirdPartyNoise(page);
    await use(page);
  },

  ephemeralUser: async ({ browserName }, use) => {
    void browserName;
    await use(buildTestUser());
  },

  registeredUser: async ({ browser, baseURL }, use) => {
    const context = await browser.newContext({ baseURL });
    const page = await context.newPage();
    const user = buildTestUser();

    await blockThirdPartyNoise(page);
    await registerUser(page, user);
    await context.close();

    await use(user);
  },
});

export { expect };
