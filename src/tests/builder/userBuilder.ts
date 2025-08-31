import { faker } from '@faker-js/faker';

import type { mockUser } from '../../types/userTypes';

export const buildUserData = (overrides = {}): mockUser => {
  return {
    username: faker.internet.username(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: faker.helpers.arrayElement(['customer', 'employee', 'admin']),
    isActive: faker.helpers.arrayElement([true, false]),
    ...overrides,
  };
};