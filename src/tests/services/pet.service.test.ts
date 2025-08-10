import logger from '../../config/logger';
import Pet from '../../models/petModel';
import { findPetByPetTag } from '../../service/petService';
import { createPetType } from '../../types/petTypes';
import { petBuilder } from '../builder/petBuilder';

jest.mock('../../config/logger');

describe('findPetByPetTag service', () => {
  let mockPet: createPetType;
  let mockedLogger: jest.Mocked<typeof logger>;
  let petTag = 'tag1';

  beforeEach(async () => {
    mockedLogger = logger as jest.Mocked<typeof logger>;
    mockPet = petBuilder({ petTag });
    await Pet.insertMany(mockPet);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    await Pet.deleteMany({});
  });

  it('should return the pet document', async () => {
    const pet = await Pet.findOne({ petTag: petTag });

    const result = await findPetByPetTag(petTag);

    expect(result).toEqual(pet);
    expect(mockedLogger.debug.mock.calls[0][0]).toBe(
      'Searching for pet by petTag: tag1'
    );
    expect(mockedLogger.debug.mock.calls[1][0]).toBe(
      'pet found with petTag: tag1'
    );
    expect(mockedLogger.debug).toHaveBeenCalledTimes(2);
  });

  it('should throw error if pet not found', async () => {
    await expect(findPetByPetTag('invalid-tag')).rejects.toThrow(
      'pet not found'
    );
    expect(mockedLogger.debug.mock.calls[0][0]).toBe(
      'Searching for pet by petTag: invalid-tag'
    );
    expect(mockedLogger.warn.mock.calls[0][0]).toBe(
      'Pet not found with petTag: invalid-tag'
    );
  });

  it('should call Pet.findOne with the correct petTag', async () => {
    const spy = jest.spyOn(Pet, 'findOne');

    await findPetByPetTag(petTag);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ isAdopted: false, petTag: petTag });
  });

  it('should handle database error', async () => {
    jest.spyOn(Pet, 'findOne').mockRejectedValue(new Error('DB error'));
    await expect(findPetByPetTag(petTag)).rejects.toThrow('DB error');
  });
});
