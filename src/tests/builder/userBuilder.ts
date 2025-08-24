import { faker } from '@faker-js/faker';

export const buildUserData = (overrides = {}): object => {
  return {
    username: faker.internet.username(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: faker.helpers.arrayElement(['customer', 'employee', 'admin']),
    isActive: true,
    gender: 'F',
    ...overrides,
  };
};
