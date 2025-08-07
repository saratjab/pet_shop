import Pet from '../../models/petModel';
import { petBuilder } from '../builder/petBuilder';

jest.mock('../../config/logger');

describe('getAllPets service', () => {
  let mockPets: any;
  beforeEach( async () => {
    mockPets = [
        petBuilder({}),
        petBuilder({}),
        petBuilder({}),
    ];
    Pet.find = jest.fn().mockReturnValue(mockPets);
    Pet.countDocuments = jest.fn().mockReturnValue(mockPets.length);

    await Pet.insertMany(mockPets);
  });

  afterEach(() => {
    Pet.deleteMany({});
    jest.resetAllMocks();
  });


});
