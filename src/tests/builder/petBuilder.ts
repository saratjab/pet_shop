import { faker } from '@faker-js/faker/.';

export const petBuilder = (override = {}) => {
  return {
    petTag: faker.string.alpha(5),
    name: faker.string.alpha(5),
    kind: faker.animal.dog(),
    age: 2,
    price: 100,
    ...override,
  };
};
