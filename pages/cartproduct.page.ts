import {Page, Locator, expect} from "@playwright/test";
import CheckoutPage from "../pages/checkout.page";

class CartproductPage {
    page: Page;
    checkoutPage: CheckoutPage;
    linkProducts: Locator;
    addProductOne: Locator;
    addProductTwo: Locator;
    productOne: Locator;
    productTwo: Locator;
    productOnePrice: Locator;
    productTwoPrice: Locator;
    productOneQuantity: Locator
    productTwoQuantity: Locator
    productOneTotal: Locator
    productTwoTotal: Locator
    singleProduct: Locator;
    productInformation: Locator;
    productQuantity: Locator;
    addCart: Locator;
    confirmItem: Locator;
    emptyCart: Locator;
    winterTop: Locator;

    constructor(page: Page) {
        this.page = page;
        this.checkoutPage = new CheckoutPage(page);
        this.linkProducts = page.getByRole("link", {name: " Products"})
        this.addProductOne = page.locator("html > body > section:nth-of-type(2) > div:nth-of-type(1) > div > div:nth-of-type(2) > div > div:nth-of-type(2) > div > div:nth-of-type(1) > div:nth-of-type(1) > a")
        this.addProductTwo = page.locator("html > body > section:nth-of-type(2) > div:nth-of-type(1) > div > div:nth-of-type(2) > div > div:nth-of-type(3) > div > div:nth-of-type(1) > div:nth-of-type(1) > a")
        this.productOne = page.getByRole("row", {name: "Product Image Blue Top Women > Tops Rs. 500 1 Rs. 500 "})
        this.productTwo = page.getByRole("row", {name: "Product Image Men Tshirt Men > Tshirts Rs. 400 1 Rs. 400 "})
        this.productOnePrice = page.locator("html > body > section > div > div:nth-of-type(2) > table > tbody > tr:nth-of-type(1) > td:nth-of-type(3) > p")
        this.productTwoPrice = page.locator("html > body > section > div > div:nth-of-type(2) > table > tbody > tr:nth-of-type(2) > td:nth-of-type(3) > p")
        this.productOneQuantity = page.locator('#product-1').getByRole("cell", {name: "1"})
        this.productTwoQuantity = page.locator('#product-2').getByRole("cell", {name: "1"})
        this.productOneTotal = page.locator('#product-1').getByRole("cell", {name: "Rs. 500"}).first()
        this.productTwoTotal = page.locator('#product-2').getByRole("cell", {name: "Rs. 400"}).first()
        this.singleProduct = page.locator("html > body > section:nth-of-type(2) > div:nth-of-type(1) > div > div:nth-of-type(2) > div > div:nth-of-type(4) > div > div:nth-of-type(2) > ul > li > a")
        this.productInformation = page.locator("div[class='product-information']")
        this.productQuantity = page.locator('#quantity')
        this.addCart = page.locator("button[class$='cart']")
        this.confirmItem = page.locator('#cart_info')
        this.emptyCart = page.locator('#empty_cart')
        this.winterTop = page.getByText('Add to cart').first()
        // this.winterTop = page.locator('div:nth-child(7) > .product-image-wrapper > .single-products > .product-overlay > .overlay-content > .btn')
    }
    
    async addProductToCart() {
        await this.linkProducts.click();
        await this.addProductOne.click();
        await this.checkoutPage.continueShopping.click();
        await this.addProductTwo.click();
        await this.checkoutPage.viewCart.click();
    }

    async verifyProductsInCart() {
        await expect(this.productOne).toBeVisible();
        await expect(this.productTwo).toBeVisible();
        await expect(this.productOnePrice).toBeVisible();
        await expect(this.productTwoPrice).toBeVisible();
        await expect(this.productOneQuantity).toBeVisible();
        await expect(this.productTwoQuantity).toBeVisible();
        await expect(this.productOneTotal).toBeVisible();
        await expect(this.productTwoTotal).toBeVisible();
    }
    
    async addSingleProductToCart(quantity: string) {
        await this.singleProduct.click();
        await expect(this.productInformation).toBeVisible();
        await this.productQuantity.fill(quantity);
        await this.addCart.click();
        await this.checkoutPage.viewCart.click();
        await expect(this.confirmItem).toBeVisible();
        await expect(this.page.getByRole("cell", {name: quantity, exact: true})).toBeVisible();
    }
    
    async removeProductsFromCart(productId: string) {
        await this.addProductOne.click();
        await this.checkoutPage.viewCart.click();
        await expect(this.checkoutPage.shoppingCart).toBeVisible();
        await this.page.locator(`tr#product-${productId} .cart_delete a.cart_quantity_delete`).click();
        await expect(this.emptyCart).toBeVisible();
    }
} export default CartproductPage;