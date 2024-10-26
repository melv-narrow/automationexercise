import {expect, Locator, Page} from "@playwright/test";

class ProductPage {
    page: Page;
    heading: Locator;
    homeButton: Locator;
    productLink: Locator;
    allProducts: Locator;
    firstProduct: Locator;
    productHeading: Locator;
    productCategory: Locator;
    productPrice: Locator;
    productAvailability: Locator;
    productCondition: Locator;
    productBrand: Locator;
    searchProduct: Locator;
    searchButton: Locator;
    searchedProduct: Locator;
    categoryHeader: Locator;

    constructor(page: Page) {
        this.page = page;
        this.heading = page.getByRole('heading', { name: 'All Products' })
        this.homeButton = page.locator('li').filter({ hasText: 'Home' })
        this.productLink = page.getByRole('link', { name: ' Products' })
        this.allProducts = page.locator('h2.title.text-center')
        this.firstProduct = page.locator('.choose > .nav > li > a').first()
        this.productHeading = page.getByRole('heading', { name: 'Blue Top' })
        this.productCategory = page.getByText('Category: Women > Tops')
        this.productPrice = page.getByText('Rs.')
        this.productAvailability = page.getByText('Availability: In Stock')
        this.productCondition = page.getByText('Condition: New')
        this.productBrand = page.getByText('Brand: Polo')
        this.searchProduct = page.getByPlaceholder('Search Product')
        this.searchButton = page.getByRole('button', { name: '' })
        this.searchedProduct = page.getByText('Winter Top').nth(1)
        this.categoryHeader = page.getByRole('heading', { name: /.*Products$/ });
    }

    async navigateToProductPage() {
        await this.page.goto('/');
        const homeButton = this.homeButton;
        if (await homeButton.isVisible()) {
            console.log('Home Page is visible');
            await this.productLink.click();
        }
        await expect(this.allProducts).toBeVisible();
    }

    async verifyProductDetails() {
        await expect(this.productHeading).toBeVisible();
        await expect(this.productCategory).toBeVisible();
        await expect(this.productPrice).toBeVisible();
        await expect(this.productAvailability).toBeVisible();
        await expect(this.productCondition).toBeVisible();
        await expect(this.productBrand).toBeVisible();
    }

    async navigateToCategory(mainCategory: string, subCategory: string) {
        await this.page.locator(`a[href="#${mainCategory}"]`).click();
        await this.page.waitForTimeout(1000);
        const subCategoryLink = this.page.getByRole('link', { name: subCategory });
        await subCategoryLink.waitFor({ state: 'visible' });
        await subCategoryLink.click();
    }

    async searchForProduct(productName: string) {
        await this.searchProduct.fill(productName);
        await this.searchButton.click();
        await this.page.waitForTimeout(1000);
    }

    async verifyProductDetailsWithAssertions() {
        await expect(this.productHeading).toBeVisible();
        await expect(this.productCategory).toBeVisible();
        await expect(this.productPrice).toBeVisible();
        await expect(this.productAvailability).toBeVisible();
        await expect(this.productCondition).toBeVisible();
        await expect(this.productBrand).toBeVisible();
        await expect(this.productPrice).toHaveText(/Rs\.\d+/);
        await expect(this.productAvailability).toHaveText('Availability: In Stock');
        await expect(this.productCondition).toHaveText('Condition: New');
        await expect(this.productBrand).toHaveText('Brand: Polo');
    }

    async searchForProductWithAssertions(productName: string) {
        await this.searchProduct.fill(productName);
        await this.searchButton.click();
        await this.page.waitForTimeout(1000);
        await expect(this.searchedProduct).toBeVisible();
    }

    async searchForProductWithEmptyInput() {
        await this.searchProduct.fill('');
        await this.searchButton.click();
        await this.page.waitForTimeout(1000);
        await expect(this.searchedProduct).not.toBeVisible();
    }

    async searchForProductWithMaxInputSize() {
        await this.searchProduct.fill('A'.repeat(255));
        await this.searchButton.click();
        await this.page.waitForTimeout(1000);
        await expect(this.searchedProduct).not.toBeVisible();
    }

    async searchForProductWithInvalidInput() {
        await this.searchProduct.fill('InvalidProductName');
        await this.searchButton.click();
        await this.page.waitForTimeout(1000);
        await expect(this.searchedProduct).not.toBeVisible();
    }

    async searchForProductAsDifferentUserRoles(page: Page) {
        // Assuming different user roles are implemented
        // Search product as guest
        await this.searchForProduct('Winter Top');
        await expect(this.searchedProduct).toBeVisible();

        // Search product as logged-in user
        const user = await getPoolUser(page);
        await page.goto('/login');
        await loginPage.emailAddress.fill(user.email);
        await loginPage.password.fill(user.password);
        await loginPage.loginButton.click();
        await expect(registerPage.logoutLink).toBeVisible();
        await this.searchForProduct('Winter Top');
        await expect(this.searchedProduct).toBeVisible();
    }

    async searchForProductOnDifferentScreenSizes(viewports: { width: number, height: number }[]) {
        for (const viewport of viewports) {
            await this.page.setViewportSize(viewport);
            await this.searchForProduct('Winter Top');
            await expect(this.searchedProduct).toBeVisible();
        }
    }

    async searchForProductOnDifferentBrowsers(browsers: string[]) {
        for (const browserType of browsers) {
            const browserInstance = await this.page.context().browser().newContext({ browserName: browserType });
            const page = await browserInstance.newPage();
            const productPage = new ProductPage(page);

            await productPage.navigateToProductPage();
            await productPage.searchForProduct('Winter Top');
            await expect(productPage.searchedProduct).toBeVisible();

            await browserInstance.close();
        }
    }
}
export default ProductPage;
