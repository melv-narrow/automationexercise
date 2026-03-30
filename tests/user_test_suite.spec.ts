import { faker } from '@faker-js/faker';
import { allure } from 'allure-playwright';
import LoginPage from '../pages/login.page';
import RegisterPage from '../pages/register.page';
import { expect, test } from './fixtures';

test.describe('User Tests', () => {
  let registerPage: RegisterPage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    loginPage = new LoginPage(page);
    await registerPage.navigate();
  });

  test('Register User', async ({ ephemeralUser }) => {
    await allure.step('Register a new user account', async () => {
      await registerPage.registerAccount(ephemeralUser);
      await expect(registerPage.accountCreated).toBeVisible();
      await registerPage.continueButton.click();
      await expect(registerPage.logoutLink).toBeVisible();
    });
  });

  test('Login User with correct email and password', async ({ registeredUser }) => {
    await allure.step('Login with a registered account', async () => {
      await loginPage.login(registeredUser);
      await expect(registerPage.logoutLink).toBeVisible();
    });
  });

  test('Login User with incorrect email and password', async () => {
    await allure.step('Reject invalid credentials', async () => {
      await loginPage.loginWithInvalidCredentials(
        faker.internet.email(),
        faker.internet.password({ length: 14 })
      );
    });
  });

  test('Logout User', async ({ registeredUser }) => {
    await allure.step('Login with a registered account', async () => {
      await loginPage.login(registeredUser);
      await expect(registerPage.logoutLink).toBeVisible();
    });

    await allure.step('Logout the current user', async () => {
      await registerPage.logoutLink.click();
      await expect(registerPage.signupHeading).toBeVisible();
    });
  });

  test('Register User with existing email', async ({ registeredUser }) => {
    await allure.step('Show an explicit duplicate-email error', async () => {
      await registerPage.expectExistingUserError(registeredUser);
    });
  });

  test.afterEach(async ({ page }) => {
    await allure.attachment('TestScreenshot.png', await page.screenshot({ fullPage: true }), 'image/png');
  });
});
