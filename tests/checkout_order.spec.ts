import { faker } from '@faker-js/faker';
import { allure } from 'allure-playwright';
import CheckoutPage from '../pages/checkout.page';
import LoginPage from '../pages/login.page';
import RegisterPage from '../pages/register.page';
import { expect, test } from './fixtures';

test.describe('Checkout Order Tests', () => {
  let checkoutPage: CheckoutPage;
  let registerPage: RegisterPage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    checkoutPage = new CheckoutPage(page);
    registerPage = new RegisterPage(page);
    loginPage = new LoginPage(page);
    await checkoutPage.navigate();
  });

  test('Place Order: Register while Checkout', async ({ ephemeralUser }) => {
    await allure.step('Add products and start checkout', async () => {
      await checkoutPage.addProductsToCartAndCheckout([1, 2]);
    });

    await allure.step('Register a new user during checkout', async () => {
      await registerPage.registerAccount(ephemeralUser);
      await expect(registerPage.accountCreated).toBeVisible();
      await registerPage.continueButton.click();
      await expect(registerPage.logoutLink).toBeVisible();
    });

    await allure.step('Return to cart and place the order', async () => {
      await checkoutPage.viewCartAndCheckout(faker.lorem.paragraph());
      await checkoutPage.fillPaymentDetails(ephemeralUser);
      await checkoutPage.deleteUserAccount();
    });
  });

  test('Place Order: Register before Checkout', async ({ page, ephemeralUser }) => {
    await allure.step('Register before adding items to the cart', async () => {
      await registerPage.navigate();
      await registerPage.registerAccount(ephemeralUser);
      await expect(registerPage.accountCreated).toBeVisible();
      await registerPage.continueButton.click();
      await expect(registerPage.logoutLink).toBeVisible();
    });

    await allure.step('Add products to cart and complete checkout', async () => {
      await page.goto('/');
      await checkoutPage.addProductsToCartAndCheckoutNew([1, 2]);
      await expect(checkoutPage.confirmAddress).toBeVisible();
      await checkoutPage.leaveOrderComment();
      await checkoutPage.placeOrder.click();
      await checkoutPage.fillPaymentDetails(ephemeralUser);
      await checkoutPage.deleteUserAccount();
    });
  });

  test('Place Order: Login before Checkout', async ({ page, registeredUser }) => {
    await allure.step('Login with a pre-registered user', async () => {
      await page.goto('/login');
      await loginPage.login(registeredUser);
      await expect(registerPage.logoutLink).toBeVisible();
    });

    await allure.step('Add products, checkout, and finish payment', async () => {
      await page.goto('/');
      await checkoutPage.addProductsToCartAndCheckoutNew([1, 2]);
      await expect(checkoutPage.confirmAddress).toBeVisible();
      await checkoutPage.leaveOrderComment();
      await checkoutPage.placeOrder.click();
      await checkoutPage.fillPaymentDetails(registeredUser);
      await checkoutPage.deleteUserAccount();
    });
  });

  test.afterEach(async ({ page }) => {
    await allure.attachment('Test Screenshot', await page.screenshot({ fullPage: true }), 'image/png');
  });
});
