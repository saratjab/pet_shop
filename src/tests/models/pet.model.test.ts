import { util } from 'zod/v4/core';
import Pet from '../../models/petModel';
import { petBuilderData } from '../builder/petBuilder';

describe('Pet Model', () => {
  let petData: any;
  beforeAll(() => {
    petData = petBuilderData();
  });
  it('should create and save a valid user', async () => {
    const pet = await Pet.create({ ...petData });

    expect(pet).toBeDefined();
    expect(pet.petTag).toBeDefined();
    expect(pet.name).toBe(petData.name);
    expect(pet.kind).toBe(petData.kind);
    expect(pet.age).toBe(petData.age);
    expect(pet.price).toBe(petData.price);
    expect(pet.isAdopted).toBe(false);
    // expect(pet.createdAt).toBeDefined();
    // expect(pet.updatedAt).toBeDefined();
  });

  it('should throw validation errors if required fieds are missing', async () => {
    await expect(Pet.create({})).rejects.toThrow(/validation failed/i);
  });

  it('should throw duplicate key error if petTag is not unique', async () => {
    const pet = await Pet.create(petData);
    const petDuplicate = new Pet(petData);
    await expect(petDuplicate.save()).rejects.toMatchObject({
      name: 'MongoServerError',
      code: 11000,
    });
  });
});
