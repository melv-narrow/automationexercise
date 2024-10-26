import { test, expect } from "@playwright/test";
import RegisterPage from "../pages/register.page";
import { allure } from "allure-playwright";
import { faker } from "@faker-js/faker";
import { userDetails } from "../utils/userDetails";
import { getUserDetails } from "../pages/getUserDetails";
import LoginPage from "../pages/login.page";

test.describe("User Tests", () => {
  let registerPage: RegisterPage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    loginPage = new LoginPage(page);
    await registerPage.navigate();
  });

  test("Register User", async ({ page }) => {
    userDetails();
    const user = getUserDetails();

    await allure.step("Fill in the user details", async () => {
      await registerPage.userSignup(faker.person.fullName(), user.email);
    });
    await allure.step("Fill in the account information", async () => {
      await registerPage.mrRadioButton.check();
      await registerPage.fillAccountInformation(
        user.password,
        faker.number.int({ min: 1, max: 30 }),
        faker.number.int({ min: 1, max: 12 }),
        faker.number.int({ min: 1900, max: 2023 }),
        faker.person.firstName(),
        faker.person.lastName(),
        faker.company.name(),
        faker.location.streetAddress(),
        faker.location.state(),
        faker.location.city(),
        faker.location.zipCode(),
        faker.phone.number()
      );
      await registerPage.randomCountry();
    });
    await allure.step("Create the user account", async () => {
      await registerPage.createAccountButton.click();
      await expect(registerPage.accountCreated).toBeVisible();
      await registerPage.continueButton.click();
      await expect(registerPage.logoutLink).toBeVisible();
    });
  });

  test(" Login User with correct email and password", async ({ page }) => {
    await page.waitForTimeout(10000);
    const user = getUserDetails();

    await allure.step(
      "Fill in email address and password then login",
      async () => {
        await loginPage.emailAddress.fill(user.email);
        await loginPage.password.fill(user.password);
        await loginPage.loginButton.click();
      }
    );
    await allure.step("Verify user is logged in", async () => {
      await expect(registerPage.logoutLink).toBeVisible();
    });
  });

  test(" Login User with incorrect email and password", async ({ page }) => {
    await allure.step(
      "Fill in incorrect email address and password then login",
      async () => {
        await loginPage.incorrectLogin(
          faker.internet.email(),
          faker.internet.password()
        );
        await loginPage.loginButton.click();
      }
    );
    await allure.step("Verify user is not logged in", async () => {
      await expect(
        page
          .locator("form")
          .filter({ hasText: "Login" })
          .getByText("Your email or password is incorrect!")
      ).toBeVisible();
    });
  });

  test("Logout User", async ({ page }) => {
    await page.waitForTimeout(10000);
    const user = getUserDetails();

    await allure.step(
      "Fill in email address and password then login",
      async () => {
        await loginPage.emailAddress.fill(user.email);
        await loginPage.password.fill(user.password);
        await loginPage.loginButton.click();
      }
    );
    await allure.step("Verify user is logged in", async () => {
      await expect(registerPage.logoutLink).toBeVisible();
    });
    await allure.step("Logout the user", async () => {
      await registerPage.logoutLink.click();
      await expect(registerPage.heading).toBeVisible();
    });
  });

  test("Register User with existing email", async ({ page }) => {
    const user = getUserDetails();

    await allure.step("Fill in the user details", async () => {
      await registerPage.existingUserSignup(user.name, user.email);
    });
  });

  test("Register User with Empty Inputs", async ({ page }) => {
    await allure.step("Fill in the user details with empty inputs", async () => {
      await registerPage.userSignup("", "");
    });
    await allure.step("Verify account information is not visible", async () => {
      await expect(registerPage.accountInformation).not.toBeVisible();
    });
  });

  test("Register User with Maximum Input Sizes", async ({ page }) => {
    const longString = "A".repeat(255);
    await allure.step("Fill in the user details with maximum input sizes", async () => {
      await registerPage.userSignup(longString, `${longString}@example.com`);
    });
    await allure.step("Fill in the account information with maximum input sizes", async () => {
      await registerPage.mrRadioButton.check();
      await registerPage.fillAccountInformation(
        longString,
        30,
        12,
        2023,
        longString,
        longString,
        longString,
        longString,
        longString,
        longString,
        longString
      );
      await registerPage.randomCountry();
    });
    await allure.step("Create the user account", async () => {
      await registerPage.createAccountButton.click();
      await expect(registerPage.accountCreated).toBeVisible();
      await registerPage.continueButton.click();
      await expect(registerPage.logoutLink).toBeVisible();
    });
  });

  test("Register User with Invalid Inputs", async ({ page }) => {
    await allure.step("Fill in the user details with invalid inputs", async () => {
      await registerPage.userSignup("Invalid Name", "invalid-email");
    });
    await allure.step("Verify account information is not visible", async () => {
      await expect(registerPage.accountInformation).not.toBeVisible();
    });
  });

  test("Login User with Empty Inputs", async ({ page }) => {
    await allure.step("Fill in email address and password with empty inputs", async () => {
      await loginPage.incorrectLogin("", "");
      await loginPage.loginButton.click();
    });
    await allure.step("Verify user is not logged in", async () => {
      await expect(
        page
          .locator("form")
          .filter({ hasText: "Login" })
          .getByText("Your email or password is incorrect!")
      ).toBeVisible();
    });
  });

  test("Login User with Maximum Input Sizes", async ({ page }) => {
    const longString = "A".repeat(255);
    await allure.step("Fill in email address and password with maximum input sizes", async () => {
      await loginPage.incorrectLogin(`${longString}@example.com`, longString);
      await loginPage.loginButton.click();
    });
    await allure.step("Verify user is not logged in", async () => {
      await expect(
        page
          .locator("form")
          .filter({ hasText: "Login" })
          .getByText("Your email or password is incorrect!")
      ).toBeVisible();
    });
  });

  test("Login User with Invalid Inputs", async ({ page }) => {
    await allure.step("Fill in email address and password with invalid inputs", async () => {
      await loginPage.incorrectLogin("invalid-email", "invalid-password");
      await loginPage.loginButton.click();
    });
    await allure.step("Verify user is not logged in", async () => {
      await expect(
        page
          .locator("form")
          .filter({ hasText: "Login" })
          .getByText("Your email or password is incorrect!")
      ).toBeVisible();
    });
  });

  test("Responsive Design: User Tests on Different Screen Sizes", async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 1366, height: 768 },
      { width: 375, height: 667 },
      { width: 414, height: 896 }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await registerPage.navigate();
      await registerPage.userSignup(faker.person.fullName(), faker.internet.email());
      await registerPage.mrRadioButton.check();
      await registerPage.fillAccountInformation(
        faker.internet.password(),
        faker.number.int({ min: 1, max: 30 }),
        faker.number.int({ min: 1, max: 12 }),
        faker.number.int({ min: 1900, max: 2023 }),
        faker.person.firstName(),
        faker.person.lastName(),
        faker.company.name(),
        faker.location.streetAddress(),
        faker.location.state(),
        faker.location.city(),
        faker.location.zipCode(),
        faker.phone.number()
      );
      await registerPage.randomCountry();
      await registerPage.createAccountButton.click();
      await expect(registerPage.accountCreated).toBeVisible();
      await registerPage.continueButton.click();
      await expect(registerPage.logoutLink).toBeVisible();
    }
  });

  test("Cross-Browser Compatibility: User Tests", async ({ browser }) => {
    const browsers = ['chromium', 'firefox', 'webkit'];

    for (const browserType of browsers) {
      const browserInstance = await browser[browserType].launch();
      const context = await browserInstance.newContext();
      const page = await context.newPage();
      const registerPage = new RegisterPage(page);
      const loginPage = new LoginPage(page);

      await registerPage.navigate();
      await registerPage.userSignup(faker.person.fullName(), faker.internet.email());
      await registerPage.mrRadioButton.check();
      await registerPage.fillAccountInformation(
        faker.internet.password(),
        faker.number.int({ min: 1, max: 30 }),
        faker.number.int({ min: 1, max: 12 }),
        faker.number.int({ min: 1900, max: 2023 }),
        faker.person.firstName(),
        faker.person.lastName(),
        faker.company.name(),
        faker.location.streetAddress(),
        faker.location.state(),
        faker.location.city(),
        faker.location.zipCode(),
        faker.phone.number()
      );
      await registerPage.randomCountry();
      await registerPage.createAccountButton.click();
      await expect(registerPage.accountCreated).toBeVisible();
      await registerPage.continueButton.click();
      await expect(registerPage.logoutLink).toBeVisible();

      await browserInstance.close();
    }
  });

  test.afterEach(async ({ page }) => {
    await allure.attachment(
      "TestScreenshot.png",
      await page.screenshot(),
      "image/png"
    );
    await page.waitForTimeout(1000);
  });
});
