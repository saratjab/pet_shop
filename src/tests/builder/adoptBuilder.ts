import { faker } from '@faker-js/faker/.';

export const adoptBuilder = (override = {}) => {
  return {
    user_id: faker.string.hexadecimal({ length: 24 }),
    pets: [faker.string.hexadecimal({ length: 24 })],
    payMoney: faker.number.float({ min: 10, max: 50 }),
    total: faker.number.float({ min: 50, max: 100 }),
    statu: faker.helpers.arrayElement(['pending', 'completed', 'cancelled']),
  };
};
