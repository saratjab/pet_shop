import Pet, { IPet } from '../../models/petModel';
import { petBuilderData } from '../builder/petBuilder';

describe('Pet Model', () => {
  let petData: any;

  beforeAll(() => {
    petData = petBuilderData();
  });

  it('should create and save a valid user', async () => {
    const pet: IPet = await Pet.create(petData);

    expect(pet).toBeDefined();
    expect(pet.petTag).toBeDefined();
    expect(pet.name).toBe(petData.name);
    expect(pet.kind).toBe(petData.kind);
    expect(pet.age).toBe(petData.age);
    expect(pet.price).toBe(petData.price);
    expect(pet.isAdopted).toBe(false);
    expect(pet.createdAt).toBeDefined();
    expect(pet.updatedAt).toBeDefined();
  });

  it('should set default value true to isActive', async () => {
    const pet = await Pet.create({ ...petData, isActive: undefined });
    expect(pet.isAdopted).toBe(false);
  });

  it('should store the petTag in lowercase', async () => {
    const petTag = 'PETTAG';
    const pet = await Pet.create({ ...petData, petTag });

    expect(pet.petTag).toBe(petTag.toLowerCase());
  });

  it('should allow optional description field', async () => {
    const pet = await Pet.create({ ...petData, description: 'A lovely cat' });
    expect(pet.description).toBe('A lovely cat');
  });

  it('should accept M for gender', async () => {
    const pet = new Pet({ ...petData, gender: 'M' });
    expect(pet).toBeDefined();
    expect(pet.gender).toBe('M');
  });

  it('should accept F for gender', async () => {
    const pet = new Pet({ ...petData, gender: 'F' });
    expect(pet).toBeDefined();
    expect(pet.gender).toBe('F');
  });

  it('should throw validation errors if required fields are missing', async () => {
    await expect(Pet.create({})).rejects.toThrow(/validation failed/i);
  });

  it('should throw error if gender is neither M or F', async () => {
    const pet = new Pet({ ...petData, gender: 'invalid-gender' });
    await expect(pet.save()).rejects.toThrow(/validation failed/i);
  });

  it('should fail if price is negative', async () => {
    const invalidPet = new Pet({ ...petData, price: -1 });
    await expect(invalidPet.save()).rejects.toThrow(/validation failed/i);
  });

  it('should fail if age is negative', async () => {
    const invalidPet = new Pet({ ...petData, age: -1 });
    await expect(invalidPet.save()).rejects.toThrow(/validation failed/i);
  });

  it('should fail if age is not a number', async () => {
    const invalidPet = new Pet({ ...petData, age: 'invalid-age' });
    await expect(invalidPet.save()).rejects.toThrow(/validation failed/i);
  });

  it('should fail if price is not a number', async () => {
    const invalidPet = new Pet({ ...petData, price: 'invalid-price' });
    await expect(invalidPet.save()).rejects.toThrow(/validation failed/i);
  });

  it('should fail if isAdopted is not a boolean', async () => {
    const invalidPet = new Pet({ ...petData, isAdopted: 'invalid-price' });
    await expect(invalidPet.save()).rejects.toThrow(/validation failed/i);
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
