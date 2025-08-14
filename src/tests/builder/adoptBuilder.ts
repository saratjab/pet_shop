import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';

export const adoptBuilder = (override = {}) => {
  return {
    user_id: new mongoose.Types.ObjectId().toString(),
    pets: [new mongoose.Types.ObjectId().toString()],
    payMoney: faker.number.float({ min: 10, max: 50, fractionDigits: 0 }),
    total: faker.number.float({ min: 50, max: 100, fractionDigits: 0 }),
    status: faker.helpers.arrayElement(['pending', 'completed', 'cancelled']),
  };
};
