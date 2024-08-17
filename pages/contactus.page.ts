import {Locator, Page} from "@playwright/test";
import path from "node:path";

class ContactusPage {
    page: Page;
    contactUsLink: Locator;
    getInTouch: Locator;
    fullName: Locator;
    emailAddress: Locator;
    subject: Locator;
    message: Locator;
    submitButton: Locator;
    successMessage: Locator;
    homeButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.contactUsLink = page.getByText('Contact us');
        this.getInTouch = page.getByRole('heading', { name: 'Get In Touch' });
        this.fullName = page.getByPlaceholder('Name')
        this.emailAddress = page.getByPlaceholder('Email', { exact: true })
        this.subject = page.getByPlaceholder('Subject')
        this.message = page.getByPlaceholder('Your Message Here')
        // this.submitButton = page.getByRole('button', { name: 'Submit' });
        this.submitButton = page.locator('//form[@id=\'contact-us-form\']//input[@name=\'submit\']')
        this.successMessage = page.locator('h2').filter({ hasText: 'Success! Your details have been submitted successfully.' });
        this.homeButton = page.getByText('Home');
    }

    async fillContactForm(fullName: string, emailAddress: string, subject: string, message: string) {
        await this.fullName.fill(fullName);
        await this.emailAddress.fill(emailAddress);
        await this.subject.fill(subject);
        await this.message.fill(message);
    }

    async fileUpload(filePath: string) {
        const fileInput = this.page.locator('input[name="upload_file"]');
        await fileInput.setInputFiles(filePath)
    }

    async alert() {
        this.page.on('dialog', async dialog => {
            console.log(dialog.message());
            await dialog.accept();
        });
    }
}

export default ContactusPage;