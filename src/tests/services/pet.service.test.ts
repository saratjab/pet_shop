import logger from '../../config/logger';
import Pet from '../../models/petModel';
import { savePet } from '../../service/petService';
import { petBuilder } from '../builder/petBuilder';
import { petFixture } from '../fixture/petFixture';

jest.mock('../../config/logger');

describe('savePet service', () => {
  let mockPet: any;
  let mockedLogger: any;

  beforeEach(async () => {
    // jest.resetAllMocks();
    mockedLogger = logger as jest.Mocked<typeof logger>;
    mockPet = petBuilder(petFixture);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await Pet.deleteMany({});
  });

  it('should save a new pet to the database', async () => {
    const pet = await savePet(mockPet);

    expect(pet).toBeDefined();
    expect(pet._id).toBeDefined();
    expect(pet.petTag).toBe(mockPet.petTag);
    expect(pet.name).toBe(mockPet.name);
    expect(pet.kind).toBe(mockPet.kind);
    expect(pet.age).toBe(mockPet.age);
    expect(pet.price).toBe(mockPet.price);
    expect(pet.description).toBe(mockPet.description);

    const petInDb = await Pet.findById(pet._id);
    expect(petInDb).toBeDefined();

    expect(mockedLogger.debug.mock.calls[0][0]).toBe(
      'saving new pet to database'
    );
    expect(mockedLogger.debug.mock.calls[1][0]).toBe(
      `Pet saved with ID: ${pet._id}`
    );
  });

  it('should throw error when .save() returns null', async () => {
    const saveSpy = jest
      .spyOn(Pet.prototype, 'save')
      .mockResolvedValue(null as any);

    await expect(savePet(mockPet)).rejects.toThrow('Error saving pet');
    expect(mockedLogger.debug.mock.calls[0][0]).toBe(
      'saving new pet to database'
    );
    expect(mockedLogger.warn.mock.calls[0][0]).toBe(
      'Error saving pet to database'
    );

    expect(saveSpy).toHaveBeenCalled();
    saveSpy.mockRestore(); // reset the method to it's original behavior
  });

  it('should call save method on the pet instance', async () => {
    const saveSpy = jest.spyOn(Pet.prototype, 'save');

    await savePet(mockPet);

    expect(saveSpy).toHaveBeenCalledTimes(1);
    saveSpy.mockRestore();
  });

  it('should handle DB error', async () => {
    jest.spyOn(Pet.prototype, 'save').mockRejectedValue(new Error('DB error'));
    await expect(savePet(mockPet)).rejects.toThrow('DB error');
  });
});
