import logger from '../../config/logger';
import Pet from '../../models/petModel';
import { findPetById, findPetByPetTag } from '../../service/petService';
import { petBuilder } from '../builder/petBuilder';
import mongoose from 'mongoose';

jest.mock('../../config/logger');

describe('findPetByPetTag service', () => {
  let mockPets: any[];
  let petTag1 = 'tag1';
  let petTag2 = 'tag2';

  beforeEach(async () => {
    jest.resetAllMocks();
    mockPets = [
      petBuilder({ petTag: petTag1 }),
      petBuilder({ petTag: petTag2 }),
    ];

    await Pet.insertMany(mockPets);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await Pet.deleteMany({});
  });

  it('should return the pet document', async () => {
    const pet = await Pet.findOne({ petTag: petTag1 });

    const result = await findPetByPetTag(petTag1);

    expect(result).toEqual(pet);
    expect(logger.debug).toHaveBeenCalledWith(
      'Searching for pet by petTag: tag1'
    );
    expect(logger.debug).toHaveBeenCalledWith('pet found with petTag: tag1');
  });
});
