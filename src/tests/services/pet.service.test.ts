import mongoose, { DeleteResult, HydratedDocument } from 'mongoose';

import logger from '../../config/logger';
import Pet, { IPet } from '../../models/petModel';
import { petFixture } from '../fixture/petFixture';
import { petBuilder } from '../builder/petBuilder';
import { createPetType, updatePetType } from '../../types/petTypes';
import {
  findPetById,
  findPetByPetTag,
  deletePets,
  savePet,
  updatePets,
} from '../../service/petService';
import * as petService from '../../service/petService'; // to mock savePet

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
    jest.restoreAllMocks();
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
    jest.spyOn(Pet, 'findById').mockRejectedValue(new Error('DB error'));
    await expect(findPetById(id.toString())).rejects.toThrow('DB error');
  });
});

describe('findPetByPetTag service', () => {
  let mockPet: createPetType;
  let mockedLogger: jest.Mocked<typeof logger>;
  const petTag = 'tag1';

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
    jest.restoreAllMocks();
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
    const saveSpy = jest.spyOn(Pet.prototype, 'save').mockResolvedValue(null);

    await expect(savePet(mockPet as IPet)).rejects.toThrow('Error saving pet');
    expect(mockedLogger.debug.mock.calls[0][0]).toBe(
      'saving new pet to database'
    );
    expect(mockedLogger.warn.mock.calls[0][0]).toBe(
      'Error saving pet to database'
    );

    expect(saveSpy).toHaveBeenCalled();
    saveSpy.mockRestore(); 
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

describe('updatePets service', () => {
  let mockPet: createPetType;
  let mockUpdatedField: updatePetType;
  let mockSavedUpdates: createPetType & updatePetType;
  let mockSavePet: jest.SpyInstance;
  let mockedLogger: jest.Mocked<typeof logger>;

  beforeEach(() => {
    mockedLogger = logger as jest.Mocked<typeof logger>;
    mockPet = petBuilder(petFixture);
    mockUpdatedField = { name: 'updated name', age: 3 };
    mockSavedUpdates = { ...mockPet, ...mockUpdatedField };
    mockSavePet = jest
      .spyOn(petService, 'savePet')
      .mockImplementation(async (pet: IPet) => pet as HydratedDocument<IPet>);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should update pet and call savePet with updated data', async () => {
    const updatedPet = await updatePets(mockPet as IPet, mockUpdatedField);

    expect(mockSavePet).toHaveBeenCalledTimes(1);
    expect(mockSavePet).toHaveBeenCalledWith(mockSavedUpdates);
    expect(mockedLogger.debug.mock.calls[0][0]).toBe(
      `Updating pet: ${updatedPet.petTag}`
    );
    expect(mockedLogger.info.mock.calls[0][0]).toBe(
      `Pet ${updatedPet.petTag} updated successfully`
    );
  });

  it('should correctly overwrite the original pet object with updated fields', async () => {
    const updatedPet = await updatePets(mockPet as IPet, mockUpdatedField);

    expect(updatedPet).toBeDefined();
    expect(updatedPet.name).toBe('updated name');
    expect(updatedPet.age).toBe(3);
    expect(updatedPet.petTag).toBe(mockPet.petTag);
    expect(updatedPet.kind).toBe(mockPet.kind);
    expect(updatedPet.price).toBe(mockPet.price);
    expect(updatedPet.description).toBe(mockPet.description);
    expect(updatedPet.isAdopted).toBe(mockPet.isAdopted);

    expect(mockedLogger.debug.mock.calls[0][0]).toBe(
      `Updating pet: ${updatedPet.petTag}`
    );
    expect(mockedLogger.info.mock.calls[0][0]).toBe(
      `Pet ${updatedPet.petTag} updated successfully`
    );
  });

  it('should handle empty update fields', async () => {
    const emptyUpdate = {};
    const updatedPet = await updatePets(mockPet as IPet, emptyUpdate);
    expect(mockSavePet).toHaveBeenCalledTimes(1);
    expect(mockSavePet).toHaveBeenCalledWith(mockPet);
    expect(updatedPet).toEqual(mockPet);

    expect(mockedLogger.debug.mock.calls[0][0]).toBe(
      `Updating pet: ${updatedPet.petTag}`
    );
    expect(mockedLogger.info.mock.calls[0][0]).toBe(
      `Pet ${updatedPet.petTag} updated successfully`
    );
  });

  it('should log an error if savePet fails', async () => {
    mockSavePet = jest
      .spyOn(petService, 'savePet')
      .mockRejectedValue(new Error('Save failed'));

    await expect(updatePets(mockPet as IPet, mockUpdatedField)).rejects.toThrow(
      'Save failed'
    );
    expect(mockedLogger.debug.mock.calls[0][0]).toBe(
      `Updating pet: ${mockPet.petTag}`
    );
    // expect(logger.warn).toHaveBeenCalledWith('Error saving pet to database'); savePet is mocked, so this won't be called
  });
});

describe('deletePets service', () => {
  let mockIds: mongoose.Types.ObjectId[];
  let mockTags: string[];
  let mockedLogger: jest.Mocked<typeof logger>;

  beforeEach(async () => {
    mockedLogger = logger as jest.Mocked<typeof logger>;
    mockIds = [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()];
    mockTags = ['tag1', 'tag2'];

    // await Pet.insertMany(mockPets);
    jest
      .spyOn(Pet, 'deleteMany')
      .mockResolvedValue({ deletedCount: 2 } as DeleteResult);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should call deleteMany with correct IDs', async () => {
    const idStrings = mockIds.map((id) => id.toString());
    await deletePets(idStrings, undefined);

    expect(Pet.deleteMany).toHaveBeenCalledTimes(1);
    expect(Pet.deleteMany).toHaveBeenCalledWith({
      _id: { $in: idStrings },
    });

    expect(mockedLogger.info.mock.calls[0][0]).toBe('Deleting pets by IDs');
    expect(mockedLogger.debug.mock.calls[0][0]).toBe('Pet deletions completed');
  });

  it('should call deleteMany with correct petTags', async () => {
    await deletePets(undefined, mockTags);

    expect(Pet.deleteMany).toHaveBeenCalledTimes(1);
    expect(Pet.deleteMany).toHaveBeenCalledWith({
      petTag: { $in: mockTags },
    });

    expect(mockedLogger.info.mock.calls[0][0]).toBe('Deleting pets by petTags');
  });

  it('should throw error if no IDs or petTags are provided', async () => {
    await expect(deletePets()).rejects.toThrow(
      'Either id or petTag must be provided'
    );
    expect(Pet.deleteMany).not.toHaveBeenCalled();
    expect(mockedLogger.warn.mock.calls[0][0]).toBe(
      'Nither id nor petTag has been provided'
    );
  });

  it('should handle empty arrays for IDs', async () => {
    await deletePets([], undefined);
    expect(Pet.deleteMany).toHaveBeenCalled();
    expect(Pet.deleteMany).toHaveBeenCalledWith({
      _id: { $in: [] },
    });
  });

  it('should handle empty arrays for petTags', async () => {
    await deletePets(undefined, []);
    expect(Pet.deleteMany).toHaveBeenCalled();
    expect(Pet.deleteMany).toHaveBeenCalledWith({
      petTag: { $in: [] },
    });
  });

  it('should delete pets by both IDs and petTags', async () => {
    await deletePets(
      mockIds.map((id) => id.toString()),
      mockTags
    );

    expect(Pet.deleteMany).toHaveBeenCalledTimes(2);
    expect(Pet.deleteMany).toHaveBeenCalledWith({
      _id: { $in: mockIds.map((id) => id.toString()) },
    });
    expect(Pet.deleteMany).toHaveBeenCalledWith({
      petTag: { $in: mockTags },
    });

    expect(mockedLogger.info.mock.calls[0][0]).toBe('Deleting pets by IDs');
    expect(mockedLogger.info.mock.calls[1][0]).toBe('Deleting pets by petTags');
    expect(mockedLogger.debug.mock.calls[0][0]).toBe('Pet deletions completed');
  });

  it('should log an error if deletion fails', async () => {
    Pet.deleteMany = jest.fn().mockRejectedValue(new Error('Deletion failed'));

    await expect(
      deletePets(
        mockIds.map((id) => id.toString()),
        mockTags
      )
    ).rejects.toThrow('Deletion failed');
  });

  it('shuold handle if no pets deleted', async () => {
    Pet.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 0 });
    await deletePets(
      mockIds.map((id) => id.toString()),
      undefined
    );

    expect(Pet.deleteMany).toHaveBeenCalledTimes(1);
    expect(Pet.deleteMany).toHaveBeenCalledWith({
      _id: { $in: mockIds.map((id) => id.toString()) },
    });
  });
});
