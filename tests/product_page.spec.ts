import { allure } from 'allure-playwright';
import CheckoutPage from '../pages/checkout.page';
import LoginPage from '../pages/login.page';
import ProductPage from '../pages/product.page';
import RegisterPage from '../pages/register.page';
import { expect, test } from './fixtures';

test.describe('Product Page Test Suite', () => {
  let productPage: ProductPage;
  let checkoutPage: CheckoutPage;
  let registerPage: RegisterPage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    productPage = new ProductPage(page);
    checkoutPage = new CheckoutPage(page);
    registerPage = new RegisterPage(page);
    loginPage = new LoginPage(page);
    await productPage.navigateToProductPage();
  });

  test('Verify All Products and product detail page', async () => {
    await allure.step('Open the first product details page', async () => {
      await productPage.openFirstProduct();
    });

    await allure.step('Verify the product details', async () => {
      await productPage.verifyProductDetails();
    });
  });

  test('Search for a Product', async () => {
    await allure.step('Search for Winter Top', async () => {
      await productPage.searchForProduct('Winter Top');
    });
  });

  test('View Category Products', async ({ page }) => {
    await allure.step("Open Women's Dress products", async () => {
      await productPage.navigateToCategory('Women', 'Dress');
      await expect(productPage.categoryHeader).toHaveText('Women - Dress Products');
    });

    await allure.step("Open Men's Tshirts products", async () => {
      await page.goto('/products');
      await productPage.navigateToCategory('Men', 'Tshirts');
      await expect(productPage.categoryHeader).toHaveText('Men - Tshirts Products');
    });
  });

  test('Search Products and Verify Cart After Login', async ({ page, registeredUser }) => {
    await page.goto('/products');
    await productPage.searchForProduct('Winter Top');
    await productPage.addProductToCart(5);
    await checkoutPage.viewCart.click();
    await expect(checkoutPage.confirmItems).toBeVisible();

    await page.goto('/login');
    await loginPage.login(registeredUser);
    await expect(registerPage.logoutLink).toBeVisible();

    await checkoutPage.cart.click();
    await expect(checkoutPage.confirmItems).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    await allure.attachment('TestScreenshot.png', await page.screenshot({ fullPage: true }), 'image/png');
  });
});
