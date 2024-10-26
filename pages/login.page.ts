import {Page, Locator, expect} from "@playwright/test";

class LoginPage {
    page: Page;
    emailAddress: Locator;
    password: Locator;
    loginButton: Locator;
    errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailAddress = page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address');
        this.password = page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.errorMessage = page.locator('form').filter({ hasText: 'Login' }).getByText('Your email or password is incorrect!');
    }

    async incorrectLogin(emailAddress: string, password: string) {
        await this.emailAddress.fill(emailAddress);
        await this.password.fill(password);
        await this.loginButton.click();
        await expect(this.errorMessage).toBeVisible();
    }

    async login(emailAddress: string, password: string) {
        await this.emailAddress.fill(emailAddress);
        await this.password.fill(password);
        await this.loginButton.click();
    }

    async verifyLoginPageElements() {
        await expect(this.emailAddress).toBeVisible();
        await expect(this.password).toBeVisible();
        await expect(this.loginButton).toBeVisible();
    }

    async verifyErrorMessage() {
        await expect(this.errorMessage).toBeVisible();
    }
}
export default LoginPage;
