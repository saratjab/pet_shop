import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';

export const adoptBuilder = (override = {}) => {
  return {
    user_id: new mongoose.Types.ObjectId(),
    pets: [new mongoose.Types.ObjectId()],
    payMoney: faker.number.float({ min: 10, max: 50 }),
    total: faker.number.float({ min: 50, max: 100 }),
    status: faker.helpers.arrayElement(['pending', 'completed', 'cancelled']),
  };
};
