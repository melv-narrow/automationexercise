import { expect, Locator, Page } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { TestUser } from '../utils/testUser';

class CheckoutPage {
  page: Page;
  continueShopping: Locator;
  viewCart: Locator;
  cartModal: Locator;
  shoppingCart: Locator;
  checkout: Locator;
  cart: Locator;
  confirmAddress: Locator;
  confirmItems: Locator;
  productComment: Locator;
  placeOrder: Locator;
  nameOnCard: Locator;
  cardNumber: Locator;
  cvv: Locator;
  cardMonth: Locator;
  cardYear: Locator;
  payment: Locator;
  orderConfirmation: Locator;
  deleteAccount: Locator;
  accountDeleted: Locator;
  continueDelete: Locator;
  register: Locator;
  linkSignupLogin: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartModal = page.locator('#cartModal');
    this.continueShopping = page.locator('#cartModal button.close-modal');
    this.viewCart = page.locator('#cartModal a[href="/view_cart"]');
    this.shoppingCart = page.getByText('Shopping Cart');
    this.checkout = page.getByText('Proceed To Checkout');
    this.cart = page.locator("header a[href='/view_cart']");
    this.confirmAddress = page.locator('#address_delivery');
    this.confirmItems = page.locator('#cart_info');
    this.productComment = page.locator('textarea[name="message"]');
    this.placeOrder = page.getByRole('link', { name: 'Place Order' });
    this.nameOnCard = page.locator('input[name="name_on_card"]');
    this.cardNumber = page.locator('input[name="card_number"]');
    this.cvv = page.getByPlaceholder('ex.');
    this.cardMonth = page.getByPlaceholder('MM');
    this.cardYear = page.getByPlaceholder('YYYY');
    this.payment = page.getByRole('button', { name: 'Pay and Confirm Order' });
    this.orderConfirmation = page.getByText('Order Placed!');
    this.deleteAccount = page.locator("a[href='/delete_account']");
    this.accountDeleted = page.getByText('Account Deleted!');
    this.continueDelete = page.getByRole('link', { name: 'Continue' });
    this.register = page.getByRole('link', { name: 'Register / Login' });
    this.linkSignupLogin = page.locator("a[href='/login']");
  }

  private homeProductCardById(productId: number) {
    return this.page
      .locator('.features_items .product-image-wrapper')
      .filter({ has: this.page.locator(`a[href='/product_details/${productId}']`) })
      .first();
  }

  async navigate() {
    await this.page.goto('/');
    await expect(this.page).toHaveURL('/');
  }

  async addHomeProductsToCart(productIds: number[]) {
    for (const [index, productId] of productIds.entries()) {
      const card = this.homeProductCardById(productId);

      await card.scrollIntoViewIfNeeded();
      await card.locator('.productinfo a.add-to-cart').click();
      await expect(this.cartModal).toBeVisible();

      if (index < productIds.length - 1) {
        await this.continueShopping.click();
        await expect(this.cartModal).toBeHidden();
      }
    }
  }

  async addProductsToCartAndCheckout(productIds: number[]) {
    await this.addHomeProductsToCart(productIds);
    await this.viewCart.click();
    await expect(this.shoppingCart).toBeVisible();
    await this.checkout.click();
    await this.register.click();
  }

  async addProductsToCartAndCheckoutNew(productIds: number[]) {
    await this.addHomeProductsToCart(productIds);
    await this.viewCart.click();
    await expect(this.shoppingCart).toBeVisible();
    await this.checkout.click();
  }

  async viewCartAndCheckout(comment: string) {
    await this.cart.click();
    await this.checkout.click();
    await expect(this.confirmAddress).toBeVisible();
    await expect(this.confirmItems).toBeVisible();
    await this.productComment.fill(comment);
    await this.placeOrder.click();
  }

  async fillPaymentDetails(user: TestUser) {
    await this.nameOnCard.fill(user.fullName);
    await this.cardNumber.fill('4111111111111111');
    await this.cvv.fill('123');
    await this.cardMonth.fill('12');
    await this.cardYear.fill('2030');
    await this.payment.click();
    await expect(this.orderConfirmation).toBeVisible();
  }

  async leaveOrderComment() {
    await this.productComment.fill(faker.lorem.paragraph());
  }

  async deleteUserAccount() {
    await this.deleteAccount.click();
    await expect(this.accountDeleted).toBeVisible();
    await this.continueDelete.click();
  }
}

export default CheckoutPage;
