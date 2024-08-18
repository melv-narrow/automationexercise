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
    
    async emailSubscription() {
        await this.scrollDown;
        await expect(this.headingSubscription).toBeVisible();
        await this.emailAddress.fill(faker.internet.email());
        await this.subscribeButton.click();
        await expect(this.successMessage).toBeVisible();
    }
}
export default EmailsubPage;