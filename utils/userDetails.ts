import { faker } from '@faker-js/faker';
import * as fs from 'fs';

export function userDetails() {
    const email = faker.internet.email();
    const password = faker.internet.password();
    const name = faker.person.firstName();
    const streetAddress = faker.location.streetAddress();
    const envContent = `EMAIL=${email}\nPASSWORD=${password}\nNAME=${name}\nSTREET_ADDRESS=${streetAddress}`;
    fs.writeFileSync('.env', envContent);
}