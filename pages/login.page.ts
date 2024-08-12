import {Page, Locator} from "@playwright/test";

class LoginPage {
    page: Page;
    emailAddress: Locator;
    password: Locator;
    loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailAddress = page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address');
        this.password = page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
    }

    async incorrectLogin(emailAddress: string, password: string) {
        await this.emailAddress.fill(emailAddress);
        await this.password.fill(password);
        await this.loginButton.click();
    }
}
export default LoginPage;