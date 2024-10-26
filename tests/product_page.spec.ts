import {test, expect} from '@playwright/test';
import ProductPage from "../pages/product.page";
import CartproductPage from "../pages/cartproduct.page";
import {allure} from "allure-playwright";
import CheckoutPage from '../pages/checkout.page';
import RegisterPage from '../pages/register.page';
import LoginPage from '../pages/login.page';
import { getPoolUser } from '../utils/userDetails';

test.describe('Product Page Test Suite', () => {
    let productPage: ProductPage;
    let cartproductPage: CartproductPage;
    let checkoutPage: CheckoutPage;
    let registerPage: RegisterPage;
    let loginPage: LoginPage;

    test.beforeEach(async ({page}) => {
        productPage = new ProductPage(page);
        cartproductPage = new CartproductPage(page);
        checkoutPage = new CheckoutPage(page);
        registerPage = new RegisterPage(page);
        loginPage = new LoginPage(page);
        await productPage.navigateToProductPage();
    });

    test('Verify All Products and product detail page', async () => {
        await allure.step("Navigate to the Product Page and Click on the first product", async () => {
            await productPage.firstProduct.click();
        });
        await allure.step("Verify the product details", async () => {
            await productPage.verifyProductDetails();
        });
    });

    test('Search for a Product', async () => {
        await allure.step("Search for a product", async () => {
            await productPage.searchProduct.fill('Winter Top');
            await productPage.searchButton.click();
            await expect(productPage.searchedProduct).toBeVisible();
        });
    });

    test('View Category Products', async ({page}) => {
        await page.goto('/')
        await allure.step("Navigate to Women's Dress category", async () => {
            await productPage.navigateToCategory('Women', 'Dress');
            await expect(productPage.categoryHeader).toHaveText('Women - Dress Products');
        });

        await allure.step("Navigate to Men's Tshirts category", async () => {
            await productPage.navigateToCategory('Men', 'Tshirts');
            await expect(productPage.categoryHeader).toHaveText('Men - Tshirts Products');
        });
    });

    test('Search Products and Verify Cart After Login', async ({page}) => {
        await page.goto('/products');
        await productPage.searchForProduct('Winter Top');
        await expect(productPage.searchedProduct).toBeVisible();
        await cartproductPage.winterTop.click();
        await checkoutPage.viewCart.click();
        await expect(checkoutPage.confirmItems).toBeVisible();
        const user = await getPoolUser(page);
        await page.goto('/login');
        await loginPage.emailAddress.fill(user.email);
        await loginPage.password.fill(user.password);
        await loginPage.loginButton.click();
        await expect(registerPage.logoutLink).toBeVisible();
        await checkoutPage.cart.click();
        await expect(checkoutPage.confirmItems).toBeVisible();
    });

    test('Search Product with Empty Input', async () => {
        await allure.step("Search for a product with empty input", async () => {
            await productPage.searchProduct.fill('');
            await productPage.searchButton.click();
            await expect(productPage.searchedProduct).not.toBeVisible();
        });
    });

    test('Search Product with Maximum Input Size', async () => {
        await allure.step("Search for a product with maximum input size", async () => {
            await productPage.searchProduct.fill('A'.repeat(255));
            await productPage.searchButton.click();
            await expect(productPage.searchedProduct).not.toBeVisible();
        });
    });

    test('Search Product with Invalid Input', async () => {
        await allure.step("Search for a product with invalid input", async () => {
            await productPage.searchProduct.fill('InvalidProductName');
            await productPage.searchButton.click();
            await expect(productPage.searchedProduct).not.toBeVisible();
        });
    });

    test('Search Product as Different User Roles', async ({page}) => {
        // Assuming different user roles are implemented
        // Search product as guest
        await productPage.searchForProduct('Winter Top');
        await expect(productPage.searchedProduct).toBeVisible();

        // Search product as logged-in user
        const user = await getPoolUser(page);
        await page.goto('/login');
        await loginPage.emailAddress.fill(user.email);
        await loginPage.password.fill(user.password);
        await loginPage.loginButton.click();
        await expect(registerPage.logoutLink).toBeVisible();
        await productPage.searchForProduct('Winter Top');
        await expect(productPage.searchedProduct).toBeVisible();
    });

    test('Responsive Design: Search Product on Different Screen Sizes', async ({page}) => {
        const viewports = [
            { width: 1920, height: 1080 },
            { width: 1366, height: 768 },
            { width: 375, height: 667 },
            { width: 414, height: 896 }
        ];

        for (const viewport of viewports) {
            await page.setViewportSize(viewport);
            await productPage.searchForProduct('Winter Top');
            await expect(productPage.searchedProduct).toBeVisible();
        }
    });

    test('Cross-Browser Compatibility: Search Product', async ({browser}) => {
        const browsers = ['chromium', 'firefox', 'webkit'];

        for (const browserType of browsers) {
            const browserInstance = await browser[browserType].launch();
            const context = await browserInstance.newContext();
            const page = await context.newPage();
            const productPage = new ProductPage(page);

            await productPage.navigateToProductPage();
            await productPage.searchForProduct('Winter Top');
            await expect(productPage.searchedProduct).toBeVisible();

            await browserInstance.close();
        }
    });

    test.afterEach(async ({ page }) => {
        await allure.attachment(
            "TestScreenshot.png",
            await page.screenshot(),
            "image/png"
        );
        await page.waitForTimeout(1000);
    });
});
