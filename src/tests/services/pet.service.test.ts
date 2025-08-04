import logger from '../../config/logger';
import Pet from '../../models/petModel';
import { findPetById } from '../../service/petService';
import { petBuilder } from '../builder/petBuilder';
import mongoose from 'mongoose';

jest.mock('../../config/logger');

describe('findPetById service', () => {
  let mockPets: any[];
  let id1: mongoose.Types.ObjectId;
  let id2: mongoose.Types.ObjectId;

  beforeEach(async () => {
    jest.resetAllMocks();
    id1 = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');
    id2 = new mongoose.Types.ObjectId('667f1f77bcf86cd799439011');
    mockPets = [petBuilder({ _id: id1 }), petBuilder({ _id: id2 })];

    await Pet.insertMany(mockPets); // Using insertMany for better performance
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await Pet.deleteMany({});
  });

  it('should return the pet document', async () => {
    const result = await findPetById(id1.toString());

    expect(result._id).toEqual(id1);
    expect(result.petTag).toBe(mockPets[0].petTag);
    expect(result.name).toBe(mockPets[0].name);
    expect(result.kind).toBe(mockPets[0].kind);
    expect(result.age).toBe(mockPets[0].age);
    expect(result.price).toBe(mockPets[0].price);
    expect(result.description).toBe(mockPets[0].description);

    expect(logger.debug).toHaveBeenCalledWith(
      `Searching for pet by ID: ${id1}`
    );
    expect(logger.debug).toHaveBeenCalledWith(`pet found with ID: ${id1}`);
  });

  it('should throw an error if pet not found', async () => {
    const nonExistentId = new mongoose.Types.ObjectId().toString();

    await expect(findPetById(nonExistentId)).rejects.toThrow('pet not found');
    expect(logger.debug).toHaveBeenCalledWith(
      `Searching for pet by ID: ${nonExistentId}`
    );
    expect(logger.warn).toHaveBeenCalledWith(
      `Pet not found with ID: ${nonExistentId}`
    );
  });

  it('should throw an error if ID is invalid', async () => {
    const invalidId = 'invalid-id';

    await expect(findPetById(invalidId)).rejects.toThrow(/invalid-id/i);
    expect(logger.debug).toHaveBeenCalledWith(
      `Searching for pet by ID: ${invalidId}`
    );
  });

  it('should call Pet.findById with the correct ID', async () => {
    const spy = jest.spyOn(Pet, 'findById'); // This lets you track calls to Pet.findById without replacing its implementation.

    await findPetById(id1.toString());

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(id1.toString());
  });
});
