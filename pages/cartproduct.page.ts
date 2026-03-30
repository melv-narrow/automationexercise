import { expect, Locator, Page } from '@playwright/test';

class CartproductPage {
  page: Page;
  linkProducts: Locator;
  cartInfo: Locator;
  emptyCart: Locator;
  cartModal: Locator;
  continueShoppingButton: Locator;
  modalViewCartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.linkProducts = page.locator("a[href='/products']");
    this.cartInfo = page.locator('#cart_info');
    this.emptyCart = page.getByText('Cart is empty! Click');
    this.cartModal = page.locator('#cartModal');
    this.continueShoppingButton = page.locator('#cartModal button.close-modal');
    this.modalViewCartLink = page.locator('#cartModal a[href="/view_cart"]');
  }

  private productCardById(productId: number) {
    return this.page
      .locator('.features_items .product-image-wrapper')
      .filter({ has: this.page.locator(`a[href='/product_details/${productId}']`) })
      .first();
  }

  private cartRow(productId: number) {
    return this.page.locator(`#product-${productId}`);
  }

  async addProductsToCart(productIds: number[]) {
    await this.page.goto('/products');

    for (const [index, productId] of productIds.entries()) {
      const card = this.productCardById(productId);
      await card.scrollIntoViewIfNeeded();
      await card.locator('.productinfo a.add-to-cart').click();
      await expect(this.cartModal).toBeVisible();

      if (index < productIds.length - 1) {
        await this.continueShoppingButton.click();
        await expect(this.cartModal).toBeHidden();
      }
    }

    await this.modalViewCartLink.click();
  }

  async verifyProductsInCart() {
    await expect(this.cartRow(1)).toContainText('Blue Top');
    await expect(this.cartRow(1)).toContainText('Rs. 500');
    await expect(this.cartRow(1)).toContainText('1');
    await expect(this.cartRow(2)).toContainText('Men Tshirt');
    await expect(this.cartRow(2)).toContainText('Rs. 400');
    await expect(this.cartRow(2)).toContainText('1');
  }

  async addSingleProductToCart(productId: number, quantity: string) {
    await this.page.goto(`/product_details/${productId}`);
    await expect(this.page.locator('.product-information')).toBeVisible();
    await this.page.locator('#quantity').fill(quantity);
    await this.page.getByRole('button', { name: /Add to cart/i }).click();
    await this.modalViewCartLink.click();
    await expect(this.cartInfo).toBeVisible();
    await expect(this.cartRow(productId).getByRole('cell', { name: quantity, exact: true })).toBeVisible();
  }

  async removeProductsFromCart(productId: number) {
    await this.addProductsToCart([productId]);
    await this.cartRow(productId).locator('.cart_quantity_delete').click();
    await expect(this.emptyCart).toBeVisible();
  }
}

export default CartproductPage;
