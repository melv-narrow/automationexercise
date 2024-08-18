import {Page, Locator,} from '@playwright/test';

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
    heading: Locator;
    alreadyRegistered: Locator;
    constructor(page: Page) {
        this.page = page;
        this.heading = page.getByRole('heading', { name: 'New User Signup!' })
        this.fullName = page.getByPlaceholder('Name')
        this.emailAddress = page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address')
        this.signupButton = page.getByRole('button', { name: 'Signup' })
        this.accountInformation = page.getByText('Enter Account Information')
        this.mrRadioButton = page.getByLabel('Mr.')
        this.password = page.getByLabel('Password *')
        this.days = page.locator('#days')
        this.months = page.locator('#months')
        this.years = page.locator('#years')
        this.firstName = page.getByLabel('First name *')
        this.lastName = page.getByLabel('Last name *')
        this.company = page.getByLabel('Company', { exact: true })
        this.address = page.getByLabel('Address * (Street address, P.')
        this.state = page.getByLabel('State *')
        this.city = page.getByLabel('City *')
        this.zipcode = page.locator('#zipcode')
        this.mobileNumber = page.getByLabel('Mobile Number *')
        this.createAccountButton = page.getByRole('button', { name: 'Create Account' })
        this.accountCreated = page.getByText('Account Created!')
        this.continueButton = page.getByRole('link', { name: 'Continue' })
        this.logoutLink = page.getByRole('link', { name: ' Logout' })
        this.alreadyRegistered = page.locator('form').filter({hasText: 'Login'}).getByText('Email Address already exist!')
    }

    async userSignup(fullName: string, emailAddress: string) {
        await this.fullName.fill(fullName);
        await this.emailAddress.fill(emailAddress);
        await this.signupButton.click();
        const accountInformation = this.accountInformation
        if (await accountInformation.isVisible()) {
            console.log('Account Information is visible');
        } else {
            console.log('Account Information is not visible');
        }
    }

    async existingUserSignup(fullName: string, emailAddress: string) {
        await this.fullName.fill(fullName);
        await this.emailAddress.fill(emailAddress);
        await this.signupButton.click();
        const alreadyRegistered = this.alreadyRegistered
        if (await alreadyRegistered.isVisible()) {
            console.log('Email Address already exists!');
        } else {
            console.log('Email Address does not exist');
        }
    }

    async fillAccountInformation(password: string, day: number, month: number, year: number, firstName: string, lastName: string, companyName: string, streetAddress: string, state: string, city: string, zipcode: string, cellphone: string) {
        // await this.justName.fill(justName);
        await this.password.fill(password);
        await this.days.selectOption(day.toString());
        await this.months.selectOption(month.toString());
        await this.years.selectOption(year.toString());
        await this.firstName.fill(firstName);
        await this.lastName.fill(lastName);
        await this.company.fill(companyName);
        await this.address.fill(streetAddress);
        await this.state.fill(state);
        await this.city.fill(city);
        await this.zipcode.fill(zipcode);
        await this.mobileNumber.fill(cellphone);
    }

    async navigate() {
        await this.page.goto('/login');
        await this.heading.waitFor({ state: 'visible' });
    }

    async randomCountry() {
        const countryDropdown = this.page.locator('#country');
        const countryOptions = await countryDropdown.locator('option').all();
        const randomCountry = countryOptions[Math.floor(Math.random() * countryOptions.length)];
        const countryValue = await randomCountry.getAttribute('value');
        console.log(`Random country selected: ${countryValue}`);
        await countryDropdown.selectOption({ value: countryValue });
    }

}
export default RegisterPage;