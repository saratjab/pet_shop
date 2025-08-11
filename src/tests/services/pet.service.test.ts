import Pet from '../../models/petModel';
import logger from '../../config/logger';
import { petBuilder } from '../builder/petBuilder';
import { getAllPets } from '../../service/petService';
import { createPetType } from '../../types/petTypes';

jest.mock('../../config/logger');

describe('getAllPets service', () => {
  let mockPets: createPetType[];
  let mockPagination: {
    page: number;
    limit: number;
    sortBy: 'name' | 'price' | 'age';
    order: 1 | -1;
  };

  let sortMock: jest.Mock;
  let skipMock: jest.Mock;
  let limitMock: jest.Mock;

  const mockFindAndCount = (filteredPets: any[], totalCount?: number) => {
    limitMock.mockResolvedValue(filteredPets);
    if (totalCount === undefined) {
      totalCount = mockPets.length;
    }
    (Pet.countDocuments as jest.Mock).mockResolvedValue(totalCount);
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

    sortMock = jest.fn().mockReturnThis();
    skipMock = jest.fn().mockReturnThis();
    limitMock = jest.fn();

    Pet.find = jest.fn().mockReturnValue({
      sort: sortMock,
      skip: skipMock,
      limit: limitMock,
    });
    Pet.countDocuments = jest.fn();

    // await Pet.insertMany(mockPets); useleless - mocking find, countDocument
  });

  afterEach(async () => {
    await Pet.deleteMany({});
    jest.restoreAllMocks();
  });

  it('should getAllPets based on their kind', async () => {
    const filteredPets = mockPets.filter((pet: any) => pet.kind === 'kind');

    mockFindAndCount(filteredPets);

    const { pets, total } = await getAllPets({
      ...mockPagination,
      kind: 'kind',
    });

    expect(Pet.find).toHaveBeenCalledWith({ kind: 'kind' });
    expect(pets).toEqual(filteredPets);
    expect(total).toBe(mockPets.length);

    expect(logger.debug).toHaveBeenCalledWith('Filtering pets with query');
    expect(logger.info).toHaveBeenCalledWith(
      `Filtered ${pets.length} pets (Total: ${total})`
    );
  });

  it('should getAllPets based on their gender', async () => {
    const filteredPets = mockPets.filter((pet: any) => pet.gender === 'F');

    mockFindAndCount(filteredPets);

    const { pets, total } = await getAllPets({
      ...mockPagination,
      gender: 'F',
    });

    expect(Pet.find).toHaveBeenCalledWith({ gender: 'F' });
    expect(pets).toEqual(filteredPets);
    expect(total).toBe(mockPets.length);

    expect(logger.debug).toHaveBeenCalledWith('Filtering pets with query');
    expect(logger.info).toHaveBeenCalledWith(
      `Filtered ${pets.length} pets (Total: ${total})`
    );
  });

  it('should getAllPets based on their isAdopted', async () => {
    const filteredPets = mockPets.filter((pet: any) => pet.isAdopted === false);

    mockFindAndCount(filteredPets);

    const { pets, total } = await getAllPets({
      ...mockPagination,
      isAdopted: false,
    });

    expect(Pet.find).toHaveBeenCalledWith({ isAdopted: false });
    expect(pets).toEqual(filteredPets);
    expect(total).toBe(mockPets.length);

    expect(logger.debug).toHaveBeenCalledWith('Filtering pets with query');
    expect(logger.info).toHaveBeenCalledWith(
      `Filtered ${pets.length} pets (Total: ${total})`
    );
  });

  it('should getAllPets based on their age', async () => {
    const filteredPets = mockPets.filter((pet: any) => pet.age === 2);

    mockFindAndCount(filteredPets);

    const { pets, total } = await getAllPets({
      ...mockPagination,
      age: 2,
    });

    expect(Pet.find).toHaveBeenCalledWith({ age: 2 });
    expect(pets).toEqual(filteredPets);
    expect(total).toBe(mockPets.length);

    expect(logger.debug).toHaveBeenCalledWith('Filtering pets with query');
    expect(logger.info).toHaveBeenCalledWith(
      `Filtered ${pets.length} pets (Total: ${total})`
    );
  });

  it('should getAllPets based on their age range', async () => {
    const filteredPets = mockPets.filter(
      (pet: any) => pet.age >= 1 && pet.age <= 3
    );
    mockFindAndCount(filteredPets);

    const { pets, total } = await getAllPets({
      ...mockPagination,
      minAge: 1,
      maxAge: 3,
    });

    expect(Pet.find).toHaveBeenCalledWith({
      age: { $gte: 1, $lte: 3 },
    });
    expect(pets).toEqual(filteredPets);
    expect(total).toBe(mockPets.length);

    expect(logger.debug).toHaveBeenCalledWith('Filtering pets with query');
    expect(logger.info).toHaveBeenCalledWith(
      `Filtered ${pets.length} pets (Total: ${total})`
    );
  });

  it('should getAllPets based on their age range with min', async () => {
    const filteredPets = mockPets.filter((pet: any) => pet.age >= 1);
    mockFindAndCount(filteredPets);

    const { pets, total } = await getAllPets({
      ...mockPagination,
      minAge: 1,
    });

    expect(Pet.find).toHaveBeenCalledWith({
      age: { $gte: 1 },
    });
    expect(pets).toEqual(filteredPets);
    expect(total).toBe(mockPets.length);

    expect(logger.debug).toHaveBeenCalledWith('Filtering pets with query');
    expect(logger.info).toHaveBeenCalledWith(
      `Filtered ${pets.length} pets (Total: ${total})`
    );
  });

  it('should getAllPets based on their age range with max', async () => {
    const filteredPets = mockPets.filter((pet: any) => pet.age <= 2);

    mockFindAndCount(filteredPets);

    const { pets, total } = await getAllPets({
      ...mockPagination,
      maxAge: 2,
    });

    expect(Pet.find).toHaveBeenCalledWith({
      age: { $lte: 2 },
    });
    expect(pets).toEqual(filteredPets);
    expect(total).toBe(mockPets.length);

    expect(logger.debug).toHaveBeenCalledWith('Filtering pets with query');
    expect(logger.info).toHaveBeenCalledWith(
      `Filtered ${pets.length} pets (Total: ${total})`
    );
  });

  it('should getAllPets based on their price', async () => {
    const filteredPets = mockPets.filter((pet: any) => pet.price === 100);

    mockFindAndCount(filteredPets);

    const { pets, total } = await getAllPets({
      ...mockPagination,
      price: 100,
    });

    expect(Pet.find).toHaveBeenCalledWith({ price: 100 });
    expect(pets).toEqual(filteredPets);
    expect(total).toBe(mockPets.length);

    expect(logger.debug).toHaveBeenCalledWith('Filtering pets with query');
    expect(logger.info).toHaveBeenCalledWith(
      `Filtered ${pets.length} pets (Total: ${total})`
    );
  });

  it('should getAllPets based on their price range', async () => {
    const filteredPets = mockPets.filter(
      (pet: any) => pet.price >= 50 && pet.price <= 150
    );

    mockFindAndCount(filteredPets);

    const { pets, total } = await getAllPets({
      ...mockPagination,
      minPrice: 50,
      maxPrice: 150,
    });

    expect(Pet.find).toHaveBeenCalledWith({
      price: { $gte: 50, $lte: 150 },
    });
    expect(pets).toEqual(filteredPets);
    expect(total).toBe(mockPets.length);

    expect(logger.debug).toHaveBeenCalledWith('Filtering pets with query');
    expect(logger.info).toHaveBeenCalledWith(
      `Filtered ${pets.length} pets (Total: ${total})`
    );
  });

  it('should getAllPets based on their price range with min', async () => {
    const filteredPets = mockPets.filter((pet: any) => pet.price >= 50);

    mockFindAndCount(filteredPets);

    const { pets, total } = await getAllPets({
      ...mockPagination,
      minPrice: 50,
    });

    expect(Pet.find).toHaveBeenCalledWith({
      price: { $gte: 50 },
    });
    expect(pets).toEqual(filteredPets);
    expect(total).toBe(mockPets.length);

    expect(logger.debug).toHaveBeenCalledWith('Filtering pets with query');
    expect(logger.info).toHaveBeenCalledWith(
      `Filtered ${pets.length} pets (Total: ${total})`
    );
  });

  it('should getAllPets based on their price range with max', async () => {
    const filteredPets = mockPets.filter((pet: any) => pet.price <= 150);

    mockFindAndCount(filteredPets);

    const { pets, total } = await getAllPets({
      ...mockPagination,
      maxPrice: 150,
    });

    expect(Pet.find).toHaveBeenCalledWith({
      price: { $lte: 150 },
    });
    expect(pets).toEqual(filteredPets);
    expect(total).toBe(mockPets.length);

    expect(logger.debug).toHaveBeenCalledWith('Filtering pets with query');
    expect(logger.info).toHaveBeenCalledWith(
      `Filtered ${pets.length} pets (Total: ${total})`
    );
  });

  it('should return all pets sorted by name in ascending order', async () => {
    mockFindAndCount(mockPets);

    const { pets, total } = await getAllPets({
      ...mockPagination, // includes sortBy: 'name', order: 1
    });

    expect(Pet.find).toHaveBeenCalledWith({});
    expect(sortMock).toHaveBeenCalledWith({ name: 1 });
    expect(pets).toEqual(mockPets);
    expect(total).toBe(mockPets.length);
  });

  it('should skip and limit correctly', async () => {
    const page = 1;
    const limitValue = 1;
    const skipValue = (page - 1) * limitValue;

    mockFindAndCount([mockPets[skipValue]]);

    const { pets, total } = await getAllPets({
      ...mockPagination,
      page,
      limit: limitValue,
    });

    expect(Pet.find).toHaveBeenCalledWith({});
    expect(skipMock).toHaveBeenCalledWith(skipValue);
    expect(limitMock).toHaveBeenCalledWith(limitValue);
    expect(pets).toEqual([mockPets[skipValue]]);
    expect(total).toBe(mockPets.length);
  });

  it('should handle empty results', async () => {
    mockFindAndCount([], 0);

    const { pets, total } = await getAllPets({
      ...mockPagination,
      kind: 'nonexistent',
    });

    expect(Pet.find).toHaveBeenCalledWith({ kind: 'nonexistent' });
    expect(pets).toEqual([]);
    expect(total).toBe(0);

    expect(logger.debug).toHaveBeenCalledWith('Filtering pets with query');
    expect(logger.info).toHaveBeenCalledWith(
      `Filtered ${pets.length} pets (Total: ${total})`
    );
  });

  it('should handle error when Pet.find fails', async () => {
    limitMock.mockRejectedValue(new Error('failed finding pets'));
    await expect(getAllPets(mockPagination)).rejects.toThrow(
      'failed finding pets'
    );
  });

  it('should handle error when Pet.countDocuments fails', async () => {
    (Pet.countDocuments as jest.Mock).mockRejectedValue(
      new Error('failed counting pets')
    );
    await expect(getAllPets(mockPagination)).rejects.toThrow(
      'failed counting pets'
    );
  });
});
