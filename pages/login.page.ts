import { expect, Locator, Page } from '@playwright/test';
import { TestUser } from '../utils/testUser';

class LoginPage {
  page: Page;
  emailAddress: Locator;
  password: Locator;
  loginButton: Locator;
  invalidCredentialsError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailAddress = page
      .locator('form')
      .filter({ has: page.getByRole('button', { name: 'Login' }) })
      .getByPlaceholder('Email Address');
    this.password = page
      .locator('form')
      .filter({ has: page.getByRole('button', { name: 'Login' }) })
      .getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.invalidCredentialsError = page.getByText('Your email or password is incorrect!');
  }

  async login(user: Pick<TestUser, 'email' | 'password'>) {
    await this.emailAddress.fill(user.email);
    await this.password.fill(user.password);
    await this.loginButton.click();
  }

  async loginWithInvalidCredentials(email: string, password: string) {
    await this.emailAddress.fill(email);
    await this.password.fill(password);
    await this.loginButton.click();
    await expect(this.invalidCredentialsError).toBeVisible();
  }
}

export default LoginPage;
