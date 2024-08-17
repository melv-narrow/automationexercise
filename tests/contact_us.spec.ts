import {test, expect} from '@playwright/test';
import {allure} from "allure-playwright";
import {faker} from "@faker-js/faker";
import ContactusPage from "../pages/contactus.page";
import path from "node:path";

let contactUsPage: ContactusPage;

test.beforeEach(async ({page}) => {
    contactUsPage = new ContactusPage(page);
    await page.goto('/');
});

test.skip("Contact Us", async ({ page }) => {
    await allure.step("Navigate to Contact Us page", async () => {
        await contactUsPage.contactUsLink.click();
        await page.waitForLoadState('networkidle');
        await expect(contactUsPage.getInTouch).toHaveText("Get In Touch");
    });
    await allure.step("Fill in the contact form", async () => {
        await contactUsPage.fillContactForm(
            faker.person.firstName(),
            faker.internet.email(),
            faker.lorem.sentence(),
            faker.lorem.paragraph()
        );
    });

    await allure.step("Upload a file", async () => {
        const filePath = path.join(__dirname, '..', 'fileuploads', 'File Upload.pdf');
        await contactUsPage.fileUpload(filePath);
    });

    await allure.step("Submit the contact form", async () => {
        const button = contactUsPage.submitButton;
        if (await button.isVisible()){
            console.log('Button is visible');
            await button.click();
        } else {
            console.log('Button is not visible');
        }
        await page.waitForTimeout(6000)
        await contactUsPage.alert();
        await expect(contactUsPage.successMessage).toBeVisible();
        await contactUsPage.homeButton.click();
        await expect(page).toHaveURL('/');
    });
});