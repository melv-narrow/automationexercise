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
});