import { expect, Locator, Page } from '@playwright/test';
import { TestUser } from '../utils/testUser';

class RegisterPage {
  page: Page;
  fullName: Locator;
  emailAddress: Locator;
  signupButton: Locator;
  accountInformation: Locator;
  mrRadioButton: Locator;
  password: Locator;
  days: Locator;
  months: Locator;
  years: Locator;
  firstName: Locator;
  lastName: Locator;
  company: Locator;
  address: Locator;
  country: Locator;
  state: Locator;
  zipcode: Locator;
  city: Locator;
  mobileNumber: Locator;
  createAccountButton: Locator;
  accountCreated: Locator;
  continueButton: Locator;
  logoutLink: Locator;
  signupHeading: Locator;
  alreadyRegistered: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signupHeading = page.getByRole('heading', { name: 'New User Signup!' });
    this.fullName = page.getByPlaceholder('Name');
    this.emailAddress = page
      .locator('form')
      .filter({ has: page.getByRole('button', { name: 'Signup' }) })
      .getByPlaceholder('Email Address');
    this.signupButton = page.getByRole('button', { name: 'Signup' });
    this.accountInformation = page.getByText('Enter Account Information');
    this.mrRadioButton = page.getByLabel('Mr.');
    this.password = page.getByLabel('Password *');
    this.days = page.locator('#days');
    this.months = page.locator('#months');
    this.years = page.locator('#years');
    this.firstName = page.getByLabel('First name *');
    this.lastName = page.getByLabel('Last name *');
    this.company = page.getByLabel('Company', { exact: true });
    this.address = page.getByLabel('Address * (Street address, P.');
    this.country = page.locator('#country');
    this.state = page.getByLabel('State *');
    this.city = page.getByLabel('City *');
    this.zipcode = page.locator('#zipcode');
    this.mobileNumber = page.getByLabel('Mobile Number *');
    this.createAccountButton = page.getByRole('button', { name: 'Create Account' });
    this.accountCreated = page.getByText('Account Created!');
    this.continueButton = page.getByRole('link', { name: 'Continue' });
    this.logoutLink = page.locator("a[href='/logout']");
    this.alreadyRegistered = page.getByText('Email Address already exist!');
  }

  async navigate() {
    await this.page.goto('/login');
    await expect(this.signupHeading).toBeVisible();
  }

  async startSignup(user: Pick<TestUser, 'fullName' | 'email'>) {
    await this.fullName.fill(user.fullName);
    await this.emailAddress.fill(user.email);
    await this.signupButton.click();
    await expect(this.accountInformation).toBeVisible();
  }

  async fillAccountInformation(user: TestUser) {
    await this.mrRadioButton.check();
    await this.password.fill(user.password);
    await this.days.selectOption(user.birthDay);
    await this.months.selectOption(user.birthMonth);
    await this.years.selectOption(user.birthYear);
    await this.firstName.fill(user.firstName);
    await this.lastName.fill(user.lastName);
    await this.company.fill(user.company);
    await this.address.fill(user.address);
    await this.country.selectOption({ label: user.country });
    await this.state.fill(user.state);
    await this.city.fill(user.city);
    await this.zipcode.fill(user.zipcode);
    await this.mobileNumber.fill(user.mobileNumber);
  }

  async registerAccount(user: TestUser) {
    await this.startSignup(user);
    await this.fillAccountInformation(user);
    await this.createAccountButton.click();
  }

  async expectExistingUserError(user: Pick<TestUser, 'fullName' | 'email'>) {
    await this.fullName.fill(user.fullName);
    await this.emailAddress.fill(user.email);
    await this.signupButton.click();
    await expect(this.alreadyRegistered).toBeVisible();
  }
}

export default RegisterPage;
