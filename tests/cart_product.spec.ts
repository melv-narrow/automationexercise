import {test, expect} from '@playwright/test';
import CartproductPage from "../pages/cartproduct.page";
import CheckoutPage from "../pages/checkout.page";

test.describe("Cart Tests", () => {
    let cartproductPage: CartproductPage;
    let checkoutPage: CheckoutPage;
    test.beforeEach(async ({page}) => {
        cartproductPage = new CartproductPage(page);
        checkoutPage = new CheckoutPage(page);
        await checkoutPage.navigate();
    });

    test('Add Products in Cart', async () => {
        await cartproductPage.linkProducts.click();
        await cartproductPage.addProductToCart();
        await cartproductPage.verifyProductsInCart();
    });

    test('Verify Product quantity in Cart', async () => {
        await cartproductPage.addSingleProductToCart('4');
    });

    test('Remove Products From Cart', async () => {
        await cartproductPage.removeProductsFromCart('1');
    });

    test('Add Product with Empty Quantity', async () => {
        await cartproductPage.addSingleProductToCart('');
        await expect(cartproductPage.confirmItem).not.toBeVisible();
    });

    test('Add Product with Maximum Quantity', async () => {
        await cartproductPage.addSingleProductToCart('1000');
        await expect(cartproductPage.page.getByRole("cell", {name: '1000', exact: true})).toBeVisible();
    });

    test('Add Invalid Product to Cart', async () => {
        await cartproductPage.page.goto('/product/invalid');
        await expect(cartproductPage.page.getByText('Product not found')).toBeVisible();
    });

    test('Add Product to Cart as Different User Roles', async () => {
        // Assuming different user roles are implemented
        // Add product as guest
        await cartproductPage.addSingleProductToCart('1');
        await expect(cartproductPage.confirmItem).toBeVisible();

        // Add product as logged-in user
        await checkoutPage.linkSignupLogin.click();
        await checkoutPage.login('user@example.com', 'password');
        await cartproductPage.addSingleProductToCart('1');
        await expect(cartproductPage.confirmItem).toBeVisible();
    });

    test('Responsive Design: Add Product to Cart on Different Screen Sizes', async ({page}) => {
        const viewports = [
            { width: 1920, height: 1080 },
            { width: 1366, height: 768 },
            { width: 375, height: 667 },
            { width: 414, height: 896 }
        ];

        for (const viewport of viewports) {
            await page.setViewportSize(viewport);
            await cartproductPage.addSingleProductToCart('1');
            await expect(cartproductPage.confirmItem).toBeVisible();
        }
    });

    test('Cross-Browser Compatibility: Add Product to Cart', async ({browser}) => {
        const browsers = ['chromium', 'firefox', 'webkit'];

        for (const browserType of browsers) {
            const browserInstance = await browser[browserType].launch();
            const context = await browserInstance.newContext();
            const page = await context.newPage();
            const cartproductPage = new CartproductPage(page);
            const checkoutPage = new CheckoutPage(page);

            await checkoutPage.navigate();
            await cartproductPage.addSingleProductToCart('1');
            await expect(cartproductPage.confirmItem).toBeVisible();

            await browserInstance.close();
        }
    });
});
