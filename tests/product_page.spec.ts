import {test, expect} from '@playwright/test';
import ProductPage from "../pages/product.page";
import {allure} from "allure-playwright";
import exp = require("node:constants");

test.describe('Product Page Test Suite', () => {
    let productPage: ProductPage;

    test.beforeEach(async ({page}) => {
        productPage = new ProductPage(page);
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

    test.afterEach(async ({ page }) => {
        await allure.attachment(
            "TestScreenshot.png",
            await page.screenshot(),
            "image/png"
        );
        await page.waitForTimeout(1000);
    });
});