import Pet, { IPet } from '../../models/petModel';
import logger from '../../config/logger';
import { petBuilder } from '../builder/petBuilder';
import { getAllPets } from '../../service/petService';
import type { createPetType } from '../../types/petTypes';

jest.mock('../../config/logger');
const match = (pets: createPetType, mockPets: createPetType) => {
  expect(mockPets).toMatchObject({
    name: pets.name,
    kind: pets.kind,
    age: pets.age,
    price: pets.price,
    gender: pets.gender,
    isAdopted: pets.isAdopted,
  });
};
describe('getAllPets service', () => {
  let mockPets: createPetType[];
  let mockPagination: {
    page: number;
    limit: number;
    sortBy: 'name' | 'price' | 'age';
    order: 1 | -1;
  };

  beforeEach(async () => {
    mockPets = [
      petBuilder({
        kind: 'kind',
        gender: 'F',
        isAdopted: false,
        age: 2,
        price: 100,
      }),
      petBuilder({
        kind: 'other',
        gender: 'M',
        isAdopted: true,
        age: 5,
        price: 200,
      }),
    ];

    mockPagination = {
      limit: 5,
      sortBy: 'name' as const,
      order: 1,
      page: 1,
    }; // need to match the service's expected query structure

    await Pet.insertMany(mockPets);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    await Pet.deleteMany({});
  });

  it('should getAllPets based on their kind', async () => {
    const filteredPets = mockPets.filter(
      (pet: createPetType) => pet.kind === 'kind'
    );

    const { pets, total } = await getAllPets({
      ...mockPagination,
      kind: 'kind',
    });

    match(filteredPets[0], pets[0]);
    expect(total).toBe(mockPets.length);

    expect(logger.debug).toHaveBeenCalledWith('Filtering pets with query');
    expect(logger.info).toHaveBeenCalledWith(
      `Filtered ${pets.length} pets (Total: ${total})`
    );
  });

  it('should getAllPets based on their gender', async () => {
    const filteredPets = mockPets.filter(
      (pet: createPetType) => pet.gender === 'F'
    );

    const { pets, total } = await getAllPets({
      ...mockPagination,
      gender: 'F',
    });

    match(pets[0], filteredPets[0]);
    expect(total).toBe(mockPets.length);

    expect(logger.debug).toHaveBeenCalledWith('Filtering pets with query');
    expect(logger.info).toHaveBeenCalledWith(
      `Filtered ${pets.length} pets (Total: ${total})`
    );
  });

  it('should getAllPets based on their isAdopted', async () => {
    const filteredPets = mockPets.filter(
      (pet: createPetType) => pet.isAdopted === false
    );
    const { pets, total } = await getAllPets({
      ...mockPagination,
      isAdopted: false,
    });

    match(pets[0], filteredPets[0]);
    expect(total).toBe(mockPets.length);

    expect(logger.debug).toHaveBeenCalledWith('Filtering pets with query');
    expect(logger.info).toHaveBeenCalledWith(
      `Filtered ${pets.length} pets (Total: ${total})`
    );
  });

  it('should getAllPets based on their age', async () => {
    const filteredPets = mockPets.filter((pet: createPetType) => pet.age === 2);
    const { pets, total } = await getAllPets({
      ...mockPagination,
      age: 2,
    });

    match(pets[0], filteredPets[0]);
    expect(total).toBe(mockPets.length);

    expect(logger.debug).toHaveBeenCalledWith('Filtering pets with query');
    expect(logger.info).toHaveBeenCalledWith(
      `Filtered ${pets.length} pets (Total: ${total})`
    );
  });

  it('should getAllPets based on their age range', async () => {
    const filteredPets = mockPets.filter(
      (pet: createPetType) => pet.age >= 1 && pet.age <= 3
    );
    const { pets, total } = await getAllPets({
      ...mockPagination,
      minAge: 1,
      maxAge: 3,
    });

    match(pets[0], filteredPets[0]);
    expect(total).toBe(mockPets.length);

    expect(logger.debug).toHaveBeenCalledWith('Filtering pets with query');
    expect(logger.info).toHaveBeenCalledWith(
      `Filtered ${pets.length} pets (Total: ${total})`
    );
  });

  it('should getAllPets based on their age range with min', async () => {
    const filteredPets = mockPets.filter((pet: createPetType) => pet.age >= 3);
    const { pets, total } = await getAllPets({
      ...mockPagination,
      minAge: 3,
    });
    match(pets[0], filteredPets[0]);
    expect(total).toBe(mockPets.length);

    expect(logger.debug).toHaveBeenCalledWith('Filtering pets with query');
    expect(logger.info).toHaveBeenCalledWith(
      `Filtered ${pets.length} pets (Total: ${total})`
    );
  });

  it('should getAllPets based on their age range with max', async () => {
    const filteredPets = mockPets.filter((pet: createPetType) => pet.age <= 2);

    const { pets, total } = await getAllPets({
      ...mockPagination,
      maxAge: 2,
    });
    match(pets[0], filteredPets[0]);
    expect(total).toBe(mockPets.length);

    expect(logger.debug).toHaveBeenCalledWith('Filtering pets with query');
    expect(logger.info).toHaveBeenCalledWith(
      `Filtered ${pets.length} pets (Total: ${total})`
    );
  });

  it('should getAllPets based on their price', async () => {
    const filteredPets = mockPets.filter(
      (pet: createPetType) => pet.price === 100
    );

    const { pets, total } = await getAllPets({
      ...mockPagination,
      price: 100,
    });
    match(pets[0], filteredPets[0]);
    expect(total).toBe(mockPets.length);

    expect(logger.debug).toHaveBeenCalledWith('Filtering pets with query');
    expect(logger.info).toHaveBeenCalledWith(
      `Filtered ${pets.length} pets (Total: ${total})`
    );
  });

  it('should getAllPets based on their price range', async () => {
    const filteredPets = mockPets.filter(
      (pet: createPetType) => pet.price >= 50 && pet.price <= 150
    );

    const { pets, total } = await getAllPets({
      ...mockPagination,
      minPrice: 50,
      maxPrice: 150,
    });
    match(pets[0], filteredPets[0]);
    expect(total).toBe(mockPets.length);

    expect(logger.debug).toHaveBeenCalledWith('Filtering pets with query');
    expect(logger.info).toHaveBeenCalledWith(
      `Filtered ${pets.length} pets (Total: ${total})`
    );
  });

  it('should getAllPets based on their price range with min', async () => {
    const filteredPets = mockPets.filter(
      (pet: createPetType) => pet.price >= 50
    );

    const { pets, total } = await getAllPets({
      ...mockPagination,
      minPrice: 50,
    });
    match(pets[0], filteredPets[0]);
    expect(total).toBe(mockPets.length);

    expect(logger.debug).toHaveBeenCalledWith('Filtering pets with query');
    expect(logger.info).toHaveBeenCalledWith(
      `Filtered ${pets.length} pets (Total: ${total})`
    );
  });

  it('should getAllPets based on their price range with max', async () => {
    const filteredPets = mockPets.filter(
      (pet: createPetType) => pet.price <= 150
    );

    const { pets, total } = await getAllPets({
      ...mockPagination,
      maxPrice: 150,
    });
    match(pets[0], filteredPets[0]);
    expect(total).toBe(mockPets.length);

    expect(logger.debug).toHaveBeenCalledWith('Filtering pets with query');
    expect(logger.info).toHaveBeenCalledWith(
      `Filtered ${pets.length} pets (Total: ${total})`
    );
  });

  it('should return all pets sorted by name in ascending order', async () => {
    const mockQuery = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(mockPets),
    };

    jest.spyOn(Pet, 'find').mockReturnValue(mockQuery as any);
    jest.spyOn(Pet, 'countDocuments').mockResolvedValue(mockPets.length);

    const { pets, total } = await getAllPets({
      ...mockPagination,
    });

    expect(Pet.find).toHaveBeenCalledWith({});
    expect(mockQuery.sort).toHaveBeenCalledWith({ name: 1 });
    expect(mockQuery.skip).toHaveBeenCalledWith(0);
    expect(mockQuery.limit).toHaveBeenCalledWith(5);
    expect(pets).toEqual(mockPets);
    expect(total).toBe(mockPets.length);
  });

  it('should skip and limit correctly', async () => {
    const page = 2;
    const limitValue = 5;
    const skipValue = (page - 1) * limitValue;
    const expectedPets = mockPets.slice(skipValue, skipValue + limitValue);

    const mockQuery = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(expectedPets),
    };

    jest.spyOn(Pet, 'find').mockReturnValue(mockQuery as any);
    jest.spyOn(Pet, 'countDocuments').mockResolvedValue(mockPets.length);

    const { pets, total } = await getAllPets({
      ...mockPagination,
      page,
      limit: limitValue,
    });

    expect(Pet.find).toHaveBeenCalledWith({});
    expect(mockQuery.skip).toHaveBeenCalledWith(skipValue);
    expect(mockQuery.limit).toHaveBeenCalledWith(limitValue);
    expect(pets).toEqual(expectedPets);
    expect(total).toBe(mockPets.length);
  });

  it('should handle empty results', async () => {
    const { pets, total } = await getAllPets({
      ...mockPagination,
      kind: 'nonexistent',
    });

    expect(pets).toMatchObject([]);
    expect(total).toBe(mockPets.length);

    expect(logger.debug).toHaveBeenCalledWith('Filtering pets with query');
    expect(logger.info).toHaveBeenCalledWith(
      `Filtered ${pets.length} pets (Total: ${total})`
    );
  });

  it('should handle error when Pet.find fails', async () => {
    jest.spyOn(Pet, 'find').mockImplementation(() => {
      throw new Error('failed finding pets');
    });

    await expect(getAllPets(mockPagination)).rejects.toThrow(
      'failed finding pets'
    );
  });

  it('should handle error in query chain', async () => {
    const mockQuery = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockRejectedValue(new Error('Database error')),
    };

    jest.spyOn(Pet, 'find').mockReturnValue(mockQuery as any);
    jest.spyOn(Pet, 'countDocuments').mockResolvedValue(0);

    await expect(getAllPets(mockPagination)).rejects.toThrow('Database error');
  });

  it('should handle error when Pet.countDocuments fails', async () => {
    jest
      .spyOn(Pet, 'countDocuments')
      .mockRejectedValue(new Error('failed counting pets'));

    await expect(getAllPets(mockPagination)).rejects.toThrow(
      'failed counting pets'
    );
  });
});
