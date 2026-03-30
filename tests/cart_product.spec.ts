import { test } from './fixtures';
import CartproductPage from '../pages/cartproduct.page';
import CheckoutPage from '../pages/checkout.page';

test.describe('Cart Tests', () => {
  let cartproductPage: CartproductPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    cartproductPage = new CartproductPage(page);
    checkoutPage = new CheckoutPage(page);
    await checkoutPage.navigate();
  });

  test('Add Products in Cart', async () => {
    await cartproductPage.addProductsToCart([1, 2]);
    await cartproductPage.verifyProductsInCart();
  });

  test('Verify Product quantity in Cart', async () => {
    await cartproductPage.addSingleProductToCart(1, '4');
  });

  test('Remove Products From Cart', async () => {
    await cartproductPage.removeProductsFromCart(1);
  });
});
