import { expect, Locator, Page } from '@playwright/test';

class ContactusPage {
  page: Page;
  contactUsLink: Locator;
  getInTouch: Locator;
  fullName: Locator;
  emailAddress: Locator;
  subject: Locator;
  message: Locator;
  fileInput: Locator;
  submitButton: Locator;
  successMessage: Locator;
  homeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.contactUsLink = page.locator("a[href='/contact_us']");
    this.getInTouch = page.getByRole('heading', { name: 'Get In Touch' });
    this.fullName = page.getByPlaceholder('Name');
    this.emailAddress = page.getByPlaceholder('Email', { exact: true });
    this.subject = page.getByPlaceholder('Subject');
    this.message = page.getByPlaceholder('Your Message Here');
    this.fileInput = page.locator('input[name="upload_file"]');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.successMessage = page.locator('.status.alert-success');
    this.homeButton = page.locator('#form-section a.btn-success');
  }

  async navigate() {
    await this.page.goto('/contact_us');
    await expect(this.getInTouch).toBeVisible();
  }

  async fillContactForm(fullName: string, emailAddress: string, subject: string, message: string) {
    await this.fullName.fill(fullName);
    await this.emailAddress.fill(emailAddress);
    await this.subject.fill(subject);
    await this.message.fill(message);
  }

  async fileUpload(filePath: string) {
    await this.fileInput.setInputFiles(filePath);
  }

  async submitContactForm() {
    await Promise.all([
      this.page.waitForEvent('dialog').then(dialog => dialog.accept()),
      this.submitButton.click(),
    ]);
    await expect(this.successMessage).toBeVisible();
  }
}

export default ContactusPage;
