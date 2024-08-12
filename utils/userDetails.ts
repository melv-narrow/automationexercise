import { faker } from '@faker-js/faker';
import * as fs from 'fs';

export function userDetails() {
    const email = faker.internet.email();
    const password = faker.internet.password();
    const envContent = `EMAIL=${email}\nPASSWORD=${password}\n`;
    fs.writeFileSync('.env', envContent);
}