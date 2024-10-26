import { test, expect } from '@playwright/test';
import CheckoutPage from "../pages/checkout.page";
import RegisterPage from "../pages/register.page";
import {getPoolUser, releasePoolUser, userDetails} from "../utils/userDetails";
import {getUserDetails} from "../pages/getUserDetails";
import {faker} from "@faker-js/faker";
import {allure} from "allure-playwright";
import LoginPage from "../pages/login.page";
import dotenv from "dotenv";
import { userPool } from '../utils/userPool';
dotenv.config();


test.describe("Checkout Order Tests", () => {
    let checkoutPage: CheckoutPage;
    let registerPage: RegisterPage;
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        checkoutPage = new CheckoutPage(page);
        registerPage = new RegisterPage(page);
        loginPage = new LoginPage(page);
        await checkoutPage.navigate();
        userPool.ensureMinimumUsers(5);
    });

    test('Place Order: Register while Checkout', async ({page}) => {
        userDetails();
        const user = getUserDetails();
        await checkoutPage.addProductsToCartAndCheckout();
        await allure.step("Fill in the user details", async () => {
            await registerPage.userSignup(faker.person.fullName(), user.email);
        });
        await allure.step("Fill in the account information", async () => {
            await registerPage.mrRadioButton.check();
            await registerPage.fillAccountInformation(
                user.password,
                faker.number.int({ min: 1, max: 30 }),
                faker.number.int({ min: 1, max: 12 }),
                faker.number.int({ min: 1900, max: 2023 }),
                faker.person.firstName(),
                faker.person.lastName(),
                faker.company.name(),
                faker.location.streetAddress(),
                faker.location.state(),
                faker.location.city(),
                faker.location.zipCode(),
                faker.phone.number()
            );
            await registerPage.randomCountry();
        });
        await allure.step("Create the user account", async () => {
            await registerPage.createAccountButton.click();
            await expect(registerPage.accountCreated).toBeVisible();
            await registerPage.continueButton.click();
            await expect(registerPage.logoutLink).toBeVisible();
        });
        await allure.step("Add products to cart and checkout", async () => {
            await checkoutPage.viewCartAndCheckout();
        });
        await allure.step("Fill in payment details", async () => {
            await checkoutPage.fillPaymentDetails();
        });
        await allure.step("Delete user account", async () => {
            await checkoutPage.deleteUserAccount();
        });
    });

    test('Place Order: Register before Checkout', async ({page}) => {
        userDetails();
        const user = getUserDetails();
        await checkoutPage.linkSignupLogin.click();

        await allure.step("Fill in the user details", async () => {
            await registerPage.userSignup(faker.person.fullName(), user.email);
        });
        await allure.step("Fill in the account information", async () => {
            await registerPage.mrRadioButton.check();
            await registerPage.fillAccountInformation(
                user.password,
                faker.number.int({ min: 1, max: 30 }),
                faker.number.int({ min: 1, max: 12 }),
                faker.number.int({ min: 1900, max: 2023 }),
                faker.person.firstName(),
                faker.person.lastName(),
                faker.company.name(),
                faker.location.streetAddress(),
                faker.location.state(),
                faker.location.city(),
                faker.location.zipCode(),
                faker.phone.number()
            );
            await registerPage.randomCountry();
        });
        await allure.step("Create the user account", async () => {
            await registerPage.createAccountButton.click();
            await expect(registerPage.accountCreated).toBeVisible();
            await registerPage.continueButton.click();
            await expect(registerPage.logoutLink).toBeVisible();
        });

        await allure.step("Add products to cart, checkout and place order", async () => {
            await checkoutPage.addProductsToCartAndCheckoutNew();
            await expect(checkoutPage.confirmAddress).toBeVisible();
            await checkoutPage.productComment.fill(faker.lorem.paragraph());
            await checkoutPage.placeOrder.click();
        });
        await allure.step("Fill in payment details and delete user account", async () => {
            await checkoutPage.fillPaymentDetails();
            await checkoutPage.deleteUserAccount();
        });
    });

    test('Place Order: Login before Checkout', async ({page}) => {
        const user = await getPoolUser(page);
        
        // Navigate directly to the login page
        await page.goto('/login');

        await allure.step("Verify user is logged in", async () => {
            await expect(registerPage.logoutLink).toBeVisible();
        });
        await allure.step("Add products to cart and checkout", async () => {
            await checkoutPage.addProductsToCartAndCheckoutNew();
        });
        await allure.step("Confirm Details and Place order", async () => {
            await expect(checkoutPage.confirmAddress).toBeVisible();
            await checkoutPage.productComment.fill(faker.lorem.paragraph());
            await checkoutPage.placeOrder.click();
        });
        await allure.step("Fill in payment details and delete user account", async () => {
            await checkoutPage.fillPaymentDetails();
            releasePoolUser(user.email);
        });
    });

    test('Place Order with Empty Cart', async ({page}) => {
        await checkoutPage.cart.click();
        await expect(checkoutPage.shoppingCart).toBeVisible();
        await expect(checkoutPage.page.getByText('Your cart is empty')).toBeVisible();
    });

    test('Place Order with Maximum Products', async ({page}) => {
        for (let i = 0; i < 1000; i++) {
            await checkoutPage.productOne.click();
            await checkoutPage.continueShopping.click();
        }
        await checkoutPage.viewCart.click();
        await expect(checkoutPage.shoppingCart).toBeVisible();
        await checkoutPage.checkout.click();
        await expect(checkoutPage.confirmAddress).toBeVisible();
        await checkoutPage.productComment.fill(faker.lorem.paragraph());
        await checkoutPage.placeOrder.click();
        await checkoutPage.fillPaymentDetails();
    });

    test('Place Order with Invalid Product', async ({page}) => {
        await page.goto('/product/invalid');
        await expect(page.getByText('Product not found')).toBeVisible();
    });

    test('Place Order as Different User Roles', async ({page}) => {
        // Assuming different user roles are implemented
        // Place order as guest
        await checkoutPage.addProductsToCartAndCheckoutNew();
        await expect(checkoutPage.confirmAddress).toBeVisible();
        await checkoutPage.productComment.fill(faker.lorem.paragraph());
        await checkoutPage.placeOrder.click();
        await checkoutPage.fillPaymentDetails();

        // Place order as logged-in user
        await checkoutPage.linkSignupLogin.click();
        await loginPage.emailAddress.fill('user@example.com');
        await loginPage.password.fill('password');
        await loginPage.loginButton.click();
        await checkoutPage.addProductsToCartAndCheckoutNew();
        await expect(checkoutPage.confirmAddress).toBeVisible();
        await checkoutPage.productComment.fill(faker.lorem.paragraph());
        await checkoutPage.placeOrder.click();
        await checkoutPage.fillPaymentDetails();
    });

    test('Responsive Design: Place Order on Different Screen Sizes', async ({page}) => {
        const viewports = [
            { width: 1920, height: 1080 },
            { width: 1366, height: 768 },
            { width: 375, height: 667 },
            { width: 414, height: 896 }
        ];

        for (const viewport of viewports) {
            await page.setViewportSize(viewport);
            await checkoutPage.addProductsToCartAndCheckoutNew();
            await expect(checkoutPage.confirmAddress).toBeVisible();
            await checkoutPage.productComment.fill(faker.lorem.paragraph());
            await checkoutPage.placeOrder.click();
            await checkoutPage.fillPaymentDetails();
        }
    });

    test('Cross-Browser Compatibility: Place Order', async ({browser}) => {
        const browsers = ['chromium', 'firefox', 'webkit'];

        for (const browserType of browsers) {
            const browserInstance = await browser[browserType].launch();
            const context = await browserInstance.newContext();
            const page = await context.newPage();
            const checkoutPage = new CheckoutPage(page);
            const registerPage = new RegisterPage(page);
            const loginPage = new LoginPage(page);

            await checkoutPage.navigate();
            await checkoutPage.addProductsToCartAndCheckoutNew();
            await expect(checkoutPage.confirmAddress).toBeVisible();
            await checkoutPage.productComment.fill(faker.lorem.paragraph());
            await checkoutPage.placeOrder.click();
            await checkoutPage.fillPaymentDetails();

            await browserInstance.close();
        }
    });

    test.afterEach(async ({ page }) => {
        await allure.attachment("Test Screenshot", await page.screenshot({ fullPage: true }), "image/png");
    });
});
