import { expect, Locator, Page } from '@playwright/test';

class EmailsubPage {
  page: Page;
  headingSubscription: Locator;
  emailAddress: Locator;
  subscribeButton: Locator;
  successMessage: Locator;
  linkCart: Locator;

  constructor(page: Page) {
    this.page = page;
    this.headingSubscription = page.getByRole('heading', { name: 'Subscription' });
    this.emailAddress = page.getByPlaceholder('Your email address');
    this.subscribeButton = page.locator('button#subscribe');
    this.successMessage = page.getByText('You have been successfully subscribed!');
    this.linkCart = page.locator("header a[href='/view_cart']");
  }

  async subNavigate() {
    await this.page.goto('/');
    await expect(this.page).toHaveURL('/');
  }

  async cartNavigate() {
    await this.linkCart.click();
    await expect(this.page.getByText('Shopping Cart')).toBeVisible();
  }

  async emailSubscription(email: string) {
    await this.headingSubscription.scrollIntoViewIfNeeded();
    await expect(this.headingSubscription).toBeVisible();
    await this.emailAddress.fill(email);
    await this.subscribeButton.click();
    await expect(this.successMessage).toBeVisible();
  }
}

export default EmailsubPage;
