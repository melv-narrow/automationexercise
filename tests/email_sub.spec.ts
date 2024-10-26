import {test, expect} from '@playwright/test';
import EmailsubPage from "../pages/emailsub.page";
import checkoutPage from "../pages/checkout.page";

test.describe("Email Subscription Tests", () => {
    let emailsubPage: EmailsubPage;
    test.beforeEach(async ({page}) => {
        emailsubPage = new EmailsubPage(page);
        await emailsubPage.subNavigate();
    });

    test('Verify Subscription in home page', async ({page}) => {
        await emailsubPage.emailSubscription();
    });

    test('Verify Subscription in Cart page', async ({page}) => {
        await emailsubPage.cartNavigate();
        await emailsubPage.emailSubscription();
    });

    test('Verify Subscription with Empty Email', async ({page}) => {
        await emailsubPage.scrollDown;
        await expect(emailsubPage.headingSubscription).toBeVisible();
        await emailsubPage.emailAddress.fill('');
        await emailsubPage.subscribeButton.click();
        await expect(emailsubPage.successMessage).not.toBeVisible();
    });

    test('Verify Subscription with Maximum Email Length', async ({page}) => {
        await emailsubPage.scrollDown;
        await expect(emailsubPage.headingSubscription).toBeVisible();
        await emailsubPage.emailAddress.fill('A'.repeat(255) + '@example.com');
        await emailsubPage.subscribeButton.click();
        await expect(emailsubPage.successMessage).toBeVisible();
    });

    test('Verify Subscription with Invalid Email', async ({page}) => {
        await emailsubPage.scrollDown;
        await expect(emailsubPage.headingSubscription).toBeVisible();
        await emailsubPage.emailAddress.fill('invalid-email');
        await emailsubPage.subscribeButton.click();
        await expect(emailsubPage.successMessage).not.toBeVisible();
    });

    test('Verify Subscription as Different User Roles', async ({page}) => {
        // Assuming different user roles are implemented
        // Subscribe as guest
        await emailsubPage.scrollDown;
        await expect(emailsubPage.headingSubscription).toBeVisible();
        await emailsubPage.emailAddress.fill('guest@example.com');
        await emailsubPage.subscribeButton.click();
        await expect(emailsubPage.successMessage).toBeVisible();

        // Subscribe as logged-in user
        await checkoutPage.linkSignupLogin.click();
        await checkoutPage.login('user@example.com', 'password');
        await emailsubPage.scrollDown;
        await expect(emailsubPage.headingSubscription).toBeVisible();
        await emailsubPage.emailAddress.fill('user@example.com');
        await emailsubPage.subscribeButton.click();
        await expect(emailsubPage.successMessage).toBeVisible();
    });

    test('Responsive Design: Verify Subscription on Different Screen Sizes', async ({page}) => {
        const viewports = [
            { width: 1920, height: 1080 },
            { width: 1366, height: 768 },
            { width: 375, height: 667 },
            { width: 414, height: 896 }
        ];

        for (const viewport of viewports) {
            await page.setViewportSize(viewport);
            await emailsubPage.scrollDown;
            await expect(emailsubPage.headingSubscription).toBeVisible();
            await emailsubPage.emailAddress.fill('responsive@example.com');
            await emailsubPage.subscribeButton.click();
            await expect(emailsubPage.successMessage).toBeVisible();
        }
    });

    test('Cross-Browser Compatibility: Verify Subscription', async ({browser}) => {
        const browsers = ['chromium', 'firefox', 'webkit'];

        for (const browserType of browsers) {
            const browserInstance = await browser[browserType].launch();
            const context = await browserInstance.newContext();
            const page = await context.newPage();
            const emailsubPage = new EmailsubPage(page);

            await emailsubPage.subNavigate();
            await emailsubPage.scrollDown;
            await expect(emailsubPage.headingSubscription).toBeVisible();
            await emailsubPage.emailAddress.fill('crossbrowser@example.com');
            await emailsubPage.subscribeButton.click();
            await expect(emailsubPage.successMessage).toBeVisible();

            await browserInstance.close();
        }
    });
});
