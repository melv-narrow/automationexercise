import {test, expect} from '@playwright/test';
import RegisterPage from "../pages/register.page";
import { allure } from "allure-playwright";
import {faker} from "@faker-js/faker";
import {userDetails} from "../utils/userDetails";
import {getUserDetails} from "../pages/getUserDetails";
import LoginPage from "../pages/login.page";

test.describe('User Tests', () => {
    let registerPage: RegisterPage;
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        registerPage = new RegisterPage(page);
        loginPage = new LoginPage(page);
        await registerPage.navigate();
    });

    test('Register User', async ({ page }) => {
        userDetails();
        const user = getUserDetails();

        await allure.step('Fill in the user details', async () => {
            await registerPage.userSignup(faker.person.fullName(), user.email);
        });
       await allure.step('Fill in the account information', async () => {
           await registerPage.mrRadioButton.check();
           await registerPage.fillAccountInformation(user.password,
               faker.number.int({min: 1, max: 30}),faker.number.int({min: 1, max: 12}),faker.number.int({min: 1900, max: 2023}),
               faker.person.firstName(),faker.person.lastName(),faker.company.name(),faker.location.streetAddress()
               ,faker.location.state(),faker.location.city(),faker.location.zipCode(),
               faker.phone.number());
           await registerPage.randomCountry();
       });
       await allure.step('Create the user account', async () => {
           await registerPage.createAccountButton.click();
           await expect(registerPage.accountCreated).toBeVisible();
           await registerPage.continueButton.click();
           await expect(registerPage.logoutLink).toBeVisible();
       });
    });

    test(' Login User with correct email and password', async ({ page }) => {
        await page.waitForTimeout(10000);
        const user = getUserDetails();

        await allure.step('Fill in email address and password then login', async () => {
            await loginPage.emailAddress.fill(user.email);
            await loginPage.password.fill(user.password);
            await loginPage.loginButton.click();
        });
        await allure.step('Verify user is logged in', async () => {
            await expect(registerPage.logoutLink).toBeVisible();
        });
    });

    test(' Login User with incorrect email and password', async ({ page }) => {
        await allure.step('Fill in incorrect email address and password then login', async () => {
            await loginPage.incorrectLogin(faker.internet.email(), faker.internet.password());
            await loginPage.loginButton.click();
        });
        await allure.step('Verify user is not logged in', async () => {
            await expect(page.locator('form').filter({hasText: 'Login'}).getByText('Your email or password is incorrect!')).toBeVisible();
        });
    });

    test ('Logout User', async ({ page }) => {
        // await page.waitForTimeout(10000);
        const user = getUserDetails();

        await allure.step('Fill in email address and password then login', async () => {
            await loginPage.emailAddress.fill(user.email);
            await loginPage.password.fill(user.password);
            await loginPage.loginButton.click();
        });
        await allure.step('Verify user is logged in', async () => {
            await expect(registerPage.logoutLink).toBeVisible();
        });
        await allure.step('Logout the user', async () => {
            await registerPage.logoutLink.click();
            await expect(registerPage.heading).toBeVisible();
        });
    });

    test ('Register User with existing email', async ({ page }) => {
        const user = getUserDetails();

        await allure.step('Fill in the user details', async () => {
            await registerPage.existingUserSignup(user.name, user.email);
        });
    });
});