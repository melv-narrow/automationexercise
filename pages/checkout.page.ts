import {expect, Locator, Page} from "@playwright/test";
import {getUserDetails} from "./getUserDetails";
import {faker} from "@faker-js/faker";

class CheckoutPage {
    page: Page;
    productOne: Locator;
    productTwo: Locator;
    productThree: Locator;
    continueShopping: Locator;
    viewCart: Locator;
    shoppingCart: Locator;
    checkout: Locator;
    loggedIn: Locator;
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
        this.productOne = page.locator('html > body > section:nth-of-type(2) > div:nth-of-type(1) > div > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(8) > div > div:nth-of-type(1) > div:nth-of-type(1) > a')
        this.productTwo = page.locator('html > body > section:nth-of-type(2) > div:nth-of-type(1) > div > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(7) > div > div:nth-of-type(1) > div:nth-of-type(1) > a')
        this.productThree = page.locator('html > body > section:nth-of-type(2) > div:nth-of-type(1) > div > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(13) > div > div:nth-of-type(1) > div:nth-of-type(1) > a')
        this.continueShopping = page.getByRole('button', { name: 'Continue Shopping' })
        this.viewCart = page.getByRole('link', { name: 'View Cart' })
        this.shoppingCart = page.getByText('Shopping Cart')
        this.checkout = page.getByText('Proceed To Checkout')
        this.loggedIn = page.getByText('Logged in as John')
        this.cart = page.getByRole('link', { name: ' Cart' })
        this.confirmAddress = page.locator('#address_delivery')
        this.confirmItems = page.locator('#cart_info')
        this.productComment = page.locator('textarea[name="message"]')
        this.placeOrder = page.getByRole('link', { name: 'Place Order' })
        this.nameOnCard = page.locator('input[name="name_on_card"]')
        this.cardNumber = page.locator('input[name="card_number"]')
        this.cvv = page.getByPlaceholder('ex.')
        this.cardMonth = page.getByPlaceholder('MM')
        this.cardYear = page.getByPlaceholder('YYYY')
        this.payment = page.getByRole('button', { name: 'Pay and Confirm Order' })
        this.orderConfirmation = page.getByText('Order Placed!')
        this.deleteAccount = page.getByRole('link', { name: ' Delete Account' })
        this.accountDeleted = page.getByText('Account Deleted!')
        this.continueDelete = page.getByRole('link', { name: 'Continue' })
        this.register = page.getByRole('link', {name: 'Register / Login'})
        this.linkSignupLogin = page.getByRole("link", {name: " Signup / Login"})

    }

    async navigate(){
        await this.page.goto('/')
        await expect(this.page).toHaveURL('/')
    }

    async addProductsToCartAndCheckout(){
        await this.productOne.waitFor({state: 'visible'})
        await this.productOne.click()
        await this.continueShopping.click()
        await this.productTwo.click()
        await this.continueShopping.click()
        await this.productThree.click()
        await this.viewCart.click()
        await expect(this.shoppingCart).toBeVisible()
        await this.checkout.click()
        await this.register.click()
    }

    async addProductsToCartAndCheckoutNew(){
        await this.productOne.hover()
        await this.productOne.click()
        await this.continueShopping.click()
        await this.productTwo.hover()
        await this.productTwo.click()
        await this.viewCart.click()
        await expect(this.shoppingCart).toBeVisible()
        await this.checkout.click()
    }

    async viewCartAndCheckout(){
        await this.cart.click()
        await this.checkout.click()
        await expect(this.confirmAddress).toBeVisible()
        await expect(this.confirmItems).toBeVisible()
        await this.productComment.fill(faker.lorem.paragraph())
        await this.placeOrder.click()

    }

    async fillPaymentDetails(){
        const user = getUserDetails()
        await this.nameOnCard.fill(`${user.name}`)
        await this.cardNumber.fill(faker.finance.creditCardNumber())
        await this.cvv.fill(faker.finance.creditCardCVV())
        await this.cardMonth.fill(String(faker.number.int({min: 1, max: 12})))
        await this.cardYear.fill(String(faker.number.int({min: 2026, max: 2030})))
        await this.payment.click()
        await expect(this.orderConfirmation).toBeVisible()
    }

    async deleteUserAccount(){
        await this.deleteAccount.click()
        await expect(this.accountDeleted).toBeVisible()
        await this.continueDelete.click()
    }
}
export default CheckoutPage;