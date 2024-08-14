import { faker } from '@faker-js/faker';
import * as fs from 'fs';

export function userDetails() {
    const email = faker.internet.email();
    const password = faker.internet.password();
    const name = faker.person.firstName();
    const envContent = `EMAIL=${email}\nPASSWORD=${password}\nNAME=${name}`;
    fs.writeFileSync('.env', envContent);
}