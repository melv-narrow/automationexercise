import { faker } from '@faker-js/faker';
import path from 'node:path';
import ContactusPage from '../pages/contactus.page';
import { expect, test } from './fixtures';

test.describe('Contact Us', () => {
  let contactUsPage: ContactusPage;

  test.beforeEach(async ({ page }) => {
    contactUsPage = new ContactusPage(page);
    await contactUsPage.navigate();
  });

  test('Submit the contact form successfully', async ({ page }) => {
    await contactUsPage.fillContactForm(
      faker.person.fullName(),
      faker.internet.email(),
      faker.lorem.sentence(),
      faker.lorem.paragraph()
    );

    const filePath = path.join(__dirname, '..', 'fileuploads', 'File Upload.pdf');
    await contactUsPage.fileUpload(filePath);
    await contactUsPage.submitContactForm();

    await contactUsPage.homeButton.click();
    await expect(page).toHaveURL('/');
  });
});
