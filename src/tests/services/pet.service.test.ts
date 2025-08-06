import logger from '../../config/logger';
import Pet from '../../models/petModel';
import { savePet, updatePets } from '../../service/petService';
import { petBuilder } from '../builder/petBuilder';
import { petFixture } from '../fixture/petFixture';

jest.mock('../../config/logger');

describe('updatePets Service', () => {
  let mockPet: any;
  let savePet: jest.Mock;

  beforeAll(async () => {
    jest.resetModules(); // clears any cached modules

    jest.mock('../../service/petService', () => ({
      savePet: jest.fn(), // only mock the savePet functoin
    }));

    savePet = jest.fn().mockImplementation(async (pet) => pet);
  });

  beforeEach(() => {
    mockPet = petBuilder();
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.clearAllMocks();
    jest.resetModules();
    jest.unmock('../../service/petService');
  });

  it('should update pet details', async () => {
    const updatedData = {
      ...mockPet,
      name: 'Updated Pet',
      age: 3,
    };
    const updatedPet = await updatePets(mockPet, updatedData);

    expect(updatedPet).toBeDefined();
    expect(updatedPet.name).toBe('Updated Pet');
    expect(updatedPet.age).toBe(3);
    expect(logger.debug).toHaveBeenCalledWith(
      `Updating pet: ${updatedPet.petTag}`
    );
    expect(logger.info).toHaveBeenCalledWith(
      `Pet ${updatedPet.petTag} updated successfully`
    );
  });
});
