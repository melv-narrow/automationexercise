import { faker } from '@faker-js/faker';
import EmailsubPage from '../pages/emailsub.page';
import { test } from './fixtures';

test.describe('Email Subscription Tests', () => {
  let emailsubPage: EmailsubPage;

  test.beforeEach(async ({ page }) => {
    emailsubPage = new EmailsubPage(page);
    await emailsubPage.subNavigate();
  });

  test('Verify Subscription in home page', async () => {
    await emailsubPage.emailSubscription(faker.internet.email());
  });

  test('Verify Subscription in Cart page', async () => {
    await emailsubPage.cartNavigate();
    await emailsubPage.emailSubscription(faker.internet.email());
  });
});
