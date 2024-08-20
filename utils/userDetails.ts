import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import { userPool } from './userPool';
import { Page } from '@playwright/test';

// Existing function (unchanged)
export function userDetails() {
    const email = faker.internet.email();
    const password = faker.internet.password();
    const name = faker.person.firstName();
    const streetAddress = faker.location.streetAddress();
    const envContent = `EMAIL=${email}\nPASSWORD=${password}\nNAME=${name}\nSTREET_ADDRESS=${streetAddress}`;
    fs.writeFileSync('.env', envContent);
}

// Updated function for pool-based approach
export async function getPoolUser(page: Page) {
    const user = await userPool.getOrCreateRegisteredUser(page);
    return {
        email: user.email,
        password: user.password,
        name: user.name,
        streetAddress: faker.location.streetAddress() // Generate this on-the-fly as it's not stored in the pool
    };
}

export function releasePoolUser(email: string) {
    userPool.releaseUser(email);
}