import { test, expect } from '@playwright/test';
import CheckoutPage from "../pages/checkout.page";
import RegisterPage from "../pages/register.page";
import {userDetails} from "../utils/userDetails";
import {getUserDetails} from "../pages/getUserDetails";
import {faker} from "@faker-js/faker";
import {allure} from "allure-playwright";
import LoginPage from "../pages/login.page";
import dotenv from "dotenv";
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

    test.skip('Place Order: Login before Checkout', async ({page}) => {
        const user = getUserDetails();
        await checkoutPage.linkSignupLogin.click();

        await allure.step("Fill in email address and password then login", async () => {
                await loginPage.emailAddress.fill(process.env.STATIC_EMAIL);
                await loginPage.password.fill(process.env.STATIC_PASSWORD);
                await loginPage.loginButton.click();
            }
        );
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
            await checkoutPage.deleteUserAccount();
        });
    });

    test.afterEach(async ({ page }) => {
        await allure.attachment("Test Screenshot", await page.screenshot({ fullPage: true }), "image/png");
    });
});