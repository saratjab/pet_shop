import mongoose from 'mongoose';
import logger from '../../config/logger';
import Pet, { IPet } from '../../models/petModel';
import { findPetById, findPetByPetTag } from '../../service/petService';
import { petBuilder } from '../builder/petBuilder';
import { createPetType } from '../../types/petTypes';
    
jest.mock('../../config/logger');

describe('findPetById service', () => {
  let mockPet: createPetType;
  let mockedLogger: jest.Mocked<typeof logger>;
  let id: mongoose.Types.ObjectId;

  beforeEach(async () => {
    // jest.resetAllMocks();//? it reset mock implementations created jest.fn() to return it to a normal function
    //? reset mock calls history
    mockedLogger = logger as jest.Mocked<typeof logger>;
    id = new mongoose.Types.ObjectId();
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

describe('findPetByPetTag service', () => {
  let mockPet: any;
  let mockedLogger: any;
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

describe('savePet service', () => {
  let mockPet: createPetType;
  let mockedLogger: jest.Mocked<typeof logger>;

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
    const pet = await savePet(mockPet as IPet);

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

    await expect(savePet(mockPet as IPet)).rejects.toThrow('Error saving pet');
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

    await savePet(mockPet as IPet);

    expect(saveSpy).toHaveBeenCalledTimes(1);
    saveSpy.mockRestore();
  });

  it('should handle DB error', async () => {
    jest.spyOn(Pet.prototype, 'save').mockRejectedValue(new Error('DB error'));
    await expect(savePet(mockPet as IPet)).rejects.toThrow('DB error');
  });
});