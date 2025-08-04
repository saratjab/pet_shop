import { faker } from '@faker-js/faker';

export const buildUserData = (overrides = {}) => {
  return {
    username: faker.internet.username(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: 'admin',
    isActive: true,
    ...overrides,
  };
};