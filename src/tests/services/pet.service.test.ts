import logger from '../../config/logger';
import Pet from '../../models/petModel';
import { petBuilder } from '../builder/petBuilder';
import { petFixture } from '../fixture/petFixture';

jest.mock('../../config/logger');

describe('savePet service', () => {
  let mockPets: any[];
  let petTag1 = 'tag1';
  let petTag2 = 'tag2';

  beforeEach(async () => {
    jest.resetAllMocks();
    mockPets = [
      petBuilder(petFixture),
    ];

    await Pet.insertMany(mockPets);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await Pet.deleteMany({});
  });

});
