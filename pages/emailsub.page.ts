import {Page, Locator, expect} from "@playwright/test";
import CheckoutPage from "./checkout.page";
import {faker} from "@faker-js/faker";

class EmailsubPage {
    page: Page;
    checkoutPage: CheckoutPage;
    scrollDown: Promise<void>;
    headingSubscription: Locator;
    emailAddress: Locator;
    subscribeButton: Locator;
    successMessage: Locator;
    linkCart: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.checkoutPage = new CheckoutPage(page);
        this.scrollDown = page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        this.headingSubscription = page.getByRole('heading', { name: 'Subscription' });
        this.emailAddress = page.getByPlaceholder('Your email address');
        this.subscribeButton = page.getByRole('button', { name: '' });
        this.successMessage = page.getByText('You have been successfully subscribed!');
        this.linkCart = page.getByRole("link", {name: " Cart"});
    }
    
    async subNavigate() {
        await this.checkoutPage.navigate();
    }

    async cartNavigate() {
        await this.linkCart.click();
        await expect(this.checkoutPage.shoppingCart).toBeVisible();
    }
    
    async emailSubscription(email: string) {
        await this.scrollDown;
        await expect(this.headingSubscription).toBeVisible();
        await this.emailAddress.fill(email);
        await this.subscribeButton.click();
        await expect(this.successMessage).toBeVisible();
    }
    
    async verifySubscriptionWithEmptyEmail() {
        await this.scrollDown;
        await expect(this.headingSubscription).toBeVisible();
        await this.emailAddress.fill('');
        await this.subscribeButton.click();
        await expect(this.successMessage).not.toBeVisible();
    }

    async verifySubscriptionWithMaxEmailLength() {
        await this.scrollDown;
        await expect(this.headingSubscription).toBeVisible();
        await this.emailAddress.fill('A'.repeat(255) + '@example.com');
        await this.subscribeButton.click();
        await expect(this.successMessage).toBeVisible();
    }

    async verifySubscriptionWithInvalidEmail() {
        await this.scrollDown;
        await expect(this.headingSubscription).toBeVisible();
        await this.emailAddress.fill('invalid-email');
        await this.subscribeButton.click();
        await expect(this.successMessage).not.toBeVisible();
    }

    async verifySubscriptionAsDifferentUserRoles() {
        // Assuming different user roles are implemented
        // Subscribe as guest
        await this.scrollDown;
        await expect(this.headingSubscription).toBeVisible();
        await this.emailAddress.fill('guest@example.com');
        await this.subscribeButton.click();
        await expect(this.successMessage).toBeVisible();

        // Subscribe as logged-in user
        await this.checkoutPage.linkSignupLogin.click();
        await this.checkoutPage.login('user@example.com', 'password');
        await this.scrollDown;
        await expect(this.headingSubscription).toBeVisible();
        await this.emailAddress.fill('user@example.com');
        await this.subscribeButton.click();
        await expect(this.successMessage).toBeVisible();
    }

    async verifySubscriptionOnDifferentScreenSizes(viewports: { width: number, height: number }[]) {
        for (const viewport of viewports) {
            await this.page.setViewportSize(viewport);
            await this.scrollDown;
            await expect(this.headingSubscription).toBeVisible();
            await this.emailAddress.fill('responsive@example.com');
            await this.subscribeButton.click();
            await expect(this.successMessage).toBeVisible();
        }
    }

    async verifySubscriptionOnDifferentBrowsers(browsers: string[]) {
        for (const browserType of browsers) {
            const browserInstance = await this.page.context().browser().newContext({ browserName: browserType });
            const page = await browserInstance.newPage();
            const emailsubPage = new EmailsubPage(page);

            await emailsubPage.subNavigate();
            await emailsubPage.scrollDown;
            await expect(emailsubPage.headingSubscription).toBeVisible();
            await emailsubPage.emailAddress.fill('crossbrowser@example.com');
            await emailsubPage.subscribeButton.click();
            await expect(emailsubPage.successMessage).toBeVisible();

            await browserInstance.close();
        }
    }
}
export default EmailsubPage;
