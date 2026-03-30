import { faker } from '@faker-js/faker';

export interface TestUser {
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  company: string;
  address: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  country: string;
}

export function buildTestUser(): TestUser {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    fullName: `${firstName} ${lastName}`,
    firstName,
    lastName,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    password: faker.internet.password({ length: 14 }),
    company: faker.company.name(),
    address: faker.location.streetAddress(),
    state: faker.location.state(),
    city: faker.location.city(),
    zipcode: faker.location.zipCode(),
    mobileNumber: faker.string.numeric(10),
    birthDay: '10',
    birthMonth: '5',
    birthYear: '1991',
    country: 'Canada',
  };
}
