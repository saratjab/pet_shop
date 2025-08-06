import logger from '../../config/logger';
import { updatePets } from '../../service/petService';
import { petBuilder } from '../builder/petBuilder';

jest.mock('../../config/logger');

describe('updatePets service', () => {
  let mockPet: any;
  let savePet: jest.Mock;
  beforeEach(() => {
    mockPet = petBuilder();
    savePet = jest.fn().mockImplementation((pet) => pet);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update pet successfuly', async () => {
    const updatedData = {
      name: 'updated name',
      age: 3,
    };

    const updatedPet = await updatePets(mockPet, updatedData);

    expect(updatedPet).toBeDefined();
    expect(updatedPet.name).toBe('updated name');
    expect(updatedPet.age).toBe(3);
    expect(logger.debug).toHaveBeenCalledWith(
      `Updating pet: ${updatedPet.petTag}`
    );
    expect(logger.info).toHaveBeenCalledWith(
      `Pet ${updatedPet.petTag} updated successfully`
    );
  });
});
