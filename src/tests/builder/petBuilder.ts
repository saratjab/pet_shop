import { faker } from '@faker-js/faker/.';

export const petBuilderData = (override = {}) => {
  return {
    petTag: faker.string.alphanumeric(8),
    name: faker.animal.cat(),
    kind: faker.animal.type(),
    age: faker.number.int({ min: 1, max: 10 }),
    price: faker.number.float({ min: 10, max: 100, fractionDigits: 1 }),
    gender: 'F',
    isAdopted: false,
    ...override,
  };
};
