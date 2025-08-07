import mongoose from 'mongoose';
import logger from '../../config/logger';
import Pet from '../../models/petModel';
import { findPetById } from '../../service/petService';
import { petBuilder } from '../builder/petBuilder';

jest.mock('../../config/logger');

describe('findPetById service', () => {
  let mockPet: any;
  let mockedLogger: any;
  let id: mongoose.Types.ObjectId;

  beforeEach(async () => {
    // jest.resetAllMocks();//? it reset mock implementations created jest.fn() to return it to a normal function
    //? reset mock calls history
    mockedLogger = logger as jest.Mocked<typeof logger>;
    id = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');
    mockPet = petBuilder({ _id: id });

    await Pet.insertMany(mockPet); // Using insertMany for better performance
  });

  afterEach(async () => {
    jest.clearAllMocks(); // it didn't clear the mocks in the top-level
    //? it clears mock implementations created jest.fn()
    //? clears mock calls history
    //? clears instances jest.spyOn()
    await Pet.deleteMany({});
  });

  it('should return the pet document by ID', async () => {
    const result = await findPetById(id.toString());

    expect(result._id).toEqual(id);
    expect(result.petTag).toBe(mockPet.petTag);
    expect(result.name).toBe(mockPet.name);
    expect(result.kind).toBe(mockPet.kind);
    expect(result.age).toBe(mockPet.age);
    expect(result.price).toBe(mockPet.price);
    expect(result.description).toBe(mockPet.description);

    expect(mockedLogger.debug.mock.calls[0][0]).toBe(
      `Searching for pet by ID: ${id}`
    );
    expect(mockedLogger.debug.mock.calls[1][0]).toBe(
      `pet found with ID: ${id}`
    );
  });

  it('should throw an error if pet not found', async () => {
    const nonExistentId = new mongoose.Types.ObjectId().toString();

    await expect(findPetById(nonExistentId)).rejects.toThrow('pet not found');
    expect(mockedLogger.debug.mock.calls[0][0]).toBe(
      `Searching for pet by ID: ${nonExistentId}`
    );
    expect(mockedLogger.warn.mock.calls[0][0]).toBe(
      `Pet not found with ID: ${nonExistentId}`
    );
  });

  it('should throw an error if ID is invalid', async () => {
    const invalidId = 'invalid-id';

    await expect(findPetById(invalidId)).rejects.toThrow(/invalid-id/i);
    expect(mockedLogger.debug.mock.calls[0][0]).toBe(
      `Searching for pet by ID: ${invalidId}`
    );
  });

  it('should call Pet.findById with the correct ID', async () => {
    const spy = jest.spyOn(Pet, 'findById'); // This lets you track calls to Pet.findById without replacing its implementation.

    await findPetById(id.toString());

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(id.toString());
  });

  it('should handle database error', async () => {
    const mockFindById = jest
      .spyOn(Pet, 'findById')
      .mockRejectedValue(new Error('DB error'));
    await expect(findPetById(id.toString())).rejects.toThrow('DB error');
  });
});
