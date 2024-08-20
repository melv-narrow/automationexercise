import { faker } from '@faker-js/faker';
import fs from 'fs';
import { Page } from '@playwright/test';
import RegisterPage from '../pages/register.page';

interface User {
  email: string;
  password: string;
  name: string;
  isAvailable: boolean;
  isRegistered: boolean;
}

const USER_POOL_FILE = 'userPool.json';

export class UserPool {
  private users: User[];

  constructor() {
    this.users = this.loadUsers();
  }

  private loadUsers(): User[] {
    if (fs.existsSync(USER_POOL_FILE)) {
      return JSON.parse(fs.readFileSync(USER_POOL_FILE, 'utf-8'));
    }
    return [];
  }

  private saveUsers(): void {
    fs.writeFileSync(USER_POOL_FILE, JSON.stringify(this.users, null, 2));
  }

  public getAvailableUser(): User | null {
    const availableUser = this.users.find(user => user.isAvailable);
    if (availableUser) {
      availableUser.isAvailable = false;
      this.saveUsers();
      return availableUser;
    }
    return null;
  }

  public releaseUser(email: string): void {
    const user = this.users.find(u => u.email === email);
    if (user) {
      user.isAvailable = true;
      this.saveUsers();
    }
  }

  public addUser(): User {
    const newUser: User = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.person.fullName(),
      isAvailable: true,
      isRegistered: false
    };
    this.users.push(newUser);
    this.saveUsers();
    return newUser;
  }

  public ensureMinimumUsers(minUsers: number): void {
    while (this.users.length < minUsers) {
      this.addUser();
    }
  }

  public async getOrCreateRegisteredUser(page: Page): Promise<User> {
    let user = this.getAvailableUser();
    if (!user) {
      user = this.addUser();
    }
    if (!user.isRegistered) {
      await this.registerUser(page, user);
    }
    return user;
  }

  private async registerUser(page: Page, user: User): Promise<void> {
    const registerPage = new RegisterPage(page);
    await registerPage.navigate();
    await registerPage.userSignup(user.name, user.email);
    await registerPage.fillAccountInformation(
      user.password,
      faker.number.int({ min: 1, max: 30 }),
      faker.number.int({ min: 1, max: 12 }),
      faker.number.int({ min: 1900, max: 2023 }),
      user.name.split(' ')[0],
      user.name.split(' ')[1] || '',
      faker.company.name(),
      faker.location.streetAddress(),
      faker.location.state(),
      faker.location.city(),
      faker.location.zipCode(),
      faker.phone.number()
    );
    await registerPage.createAccountButton.click();
    user.isRegistered = true;
    this.saveUsers();
  }
}

export const userPool = new UserPool();