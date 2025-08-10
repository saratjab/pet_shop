import { faker } from '@faker-js/faker';

export const petBuilder = (override = {}) => {
  return {
    petTag: faker.string.alpha(5).toLowerCase(),
    name: faker.string.alpha(5),
    kind: faker.animal.type(),
    age: faker.number.int({ min: 1, max: 10 }),
    price: faker.number.float({ min: 10, max: 100, fractionDigits: 1 }),
    gender: faker.helpers.arrayElement(['M', 'F']),
    isAdopted: false,
    ...override,
  };
};