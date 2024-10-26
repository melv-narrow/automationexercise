import {test, expect} from '@playwright/test';
import {allure} from "allure-playwright";
import {faker} from "@faker-js/faker";
import ContactusPage from "../pages/contactus.page";
import path from "node:path";

let contactUsPage: ContactusPage;

test.beforeEach(async ({page}) => {
    contactUsPage = new ContactusPage(page);
    await page.goto('/');
});

test.skip("Contact Us", async ({ page }) => {
    await allure.step("Navigate to Contact Us page", async () => {
        await contactUsPage.contactUsLink.click();
        await page.waitForLoadState('networkidle');
        await expect(contactUsPage.getInTouch).toHaveText("Get In Touch");
    });
    await allure.step("Fill in the contact form", async () => {
        await contactUsPage.fillContactForm(
            faker.person.firstName(),
            faker.internet.email(),
            faker.lorem.sentence(),
            faker.lorem.paragraph()
        );
    });

    await allure.step("Upload a file", async () => {
        const filePath = path.join(__dirname, '..', 'fileuploads', 'File Upload.pdf');
        await contactUsPage.fileUpload(filePath);
    });

    await allure.step("Submit the contact form", async () => {
        const button = contactUsPage.submitButton;
        if (await button.isVisible()){
            console.log('Button is visible');
            await button.click();
        } else {
            console.log('Button is not visible');
        }
        await page.waitForTimeout(6000)
        await contactUsPage.alert();
        await expect(contactUsPage.successMessage).toBeVisible();
        await contactUsPage.homeButton.click();
        await expect(page).toHaveURL('/');
    });
});

test('Contact Us with Empty Inputs', async ({ page }) => {
    await contactUsPage.contactUsLink.click();
    await page.waitForLoadState('networkidle');
    await contactUsPage.submitButton.click();
    await expect(contactUsPage.successMessage).not.toBeVisible();
});

test('Contact Us with Maximum Input Sizes', async ({ page }) => {
    await contactUsPage.contactUsLink.click();
    await page.waitForLoadState('networkidle');
    await contactUsPage.fillContactForm(
        'A'.repeat(255),
        'A'.repeat(255) + '@example.com',
        'A'.repeat(255),
        'A'.repeat(1000)
    );
    await contactUsPage.submitButton.click();
    await page.waitForTimeout(6000);
    await contactUsPage.alert();
    await expect(contactUsPage.successMessage).toBeVisible();
});

test('Contact Us with Invalid Inputs', async ({ page }) => {
    await contactUsPage.contactUsLink.click();
    await page.waitForLoadState('networkidle');
    await contactUsPage.fillContactForm(
        'Invalid Name',
        'invalid-email',
        'Invalid Subject',
        'Invalid Message'
    );
    await contactUsPage.submitButton.click();
    await expect(contactUsPage.successMessage).not.toBeVisible();
});

test('Contact Us as Different User Roles', async ({ page }) => {
    // Assuming different user roles are implemented
    // Contact Us as guest
    await contactUsPage.contactUsLink.click();
    await page.waitForLoadState('networkidle');
    await contactUsPage.fillContactForm(
        faker.person.firstName(),
        faker.internet.email(),
        faker.lorem.sentence(),
        faker.lorem.paragraph()
    );
    await contactUsPage.submitButton.click();
    await page.waitForTimeout(6000);
    await contactUsPage.alert();
    await expect(contactUsPage.successMessage).toBeVisible();

    // Contact Us as logged-in user
    await page.goto('/login');
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await contactUsPage.contactUsLink.click();
    await page.waitForLoadState('networkidle');
    await contactUsPage.fillContactForm(
        faker.person.firstName(),
        faker.internet.email(),
        faker.lorem.sentence(),
        faker.lorem.paragraph()
    );
    await contactUsPage.submitButton.click();
    await page.waitForTimeout(6000);
    await contactUsPage.alert();
    await expect(contactUsPage.successMessage).toBeVisible();
});

test('Responsive Design: Contact Us on Different Screen Sizes', async ({ page }) => {
    const viewports = [
        { width: 1920, height: 1080 },
        { width: 1366, height: 768 },
        { width: 375, height: 667 },
        { width: 414, height: 896 }
    ];

    for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await contactUsPage.contactUsLink.click();
        await page.waitForLoadState('networkidle');
        await contactUsPage.fillContactForm(
            faker.person.firstName(),
            faker.internet.email(),
            faker.lorem.sentence(),
            faker.lorem.paragraph()
        );
        await contactUsPage.submitButton.click();
        await page.waitForTimeout(6000);
        await contactUsPage.alert();
        await expect(contactUsPage.successMessage).toBeVisible();
    }
});

test('Cross-Browser Compatibility: Contact Us', async ({ browser }) => {
    const browsers = ['chromium', 'firefox', 'webkit'];

    for (const browserType of browsers) {
        const browserInstance = await browser[browserType].launch();
        const context = await browserInstance.newContext();
        const page = await context.newPage();
        const contactUsPage = new ContactusPage(page);

        await page.goto('/');
        await contactUsPage.contactUsLink.click();
        await page.waitForLoadState('networkidle');
        await contactUsPage.fillContactForm(
            faker.person.firstName(),
            faker.internet.email(),
            faker.lorem.sentence(),
            faker.lorem.paragraph()
        );
        await contactUsPage.submitButton.click();
        await page.waitForTimeout(6000);
        await contactUsPage.alert();
        await expect(contactUsPage.successMessage).toBeVisible();

        await browserInstance.close();
    }
});
