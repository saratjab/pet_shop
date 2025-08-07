import Pet from '../../models/petModel';
import { petBuilder } from '../builder/petBuilder';
import { getAllPets } from '../../service/petService';
import logger from '../../config/logger';

jest.mock('../../config/logger');

describe('getAllPets service', () => {
  let mockPets: any;
  let mockPagination: any;

  let sortMock: jest.Mock;
  let skipMock: jest.Mock;
  let limitMock: jest.Mock;

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

  afterEach(() => {
    Pet.deleteMany({});
    jest.resetAllMocks();
  });

  it('should getAllPets based on their kind', async () => {
    const filteredPets = mockPets.filter((pet: any) => pet.kind === 'kind');

    limitMock.mockResolvedValue(filteredPets);
    (Pet.countDocuments as jest.Mock).mockResolvedValue(mockPets.length);

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

    limitMock.mockResolvedValue(filteredPets);
    (Pet.countDocuments as jest.Mock).mockResolvedValue(mockPets.length);

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

    limitMock.mockResolvedValue(filteredPets);
    (Pet.countDocuments as jest.Mock).mockResolvedValue(mockPets.length);

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

    limitMock.mockResolvedValue(filteredPets);
    (Pet.countDocuments as jest.Mock).mockResolvedValue(mockPets.length);

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

    limitMock.mockResolvedValue(filteredPets);
    (Pet.countDocuments as jest.Mock).mockResolvedValue(mockPets.length);

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

    limitMock.mockResolvedValue(filteredPets);
    (Pet.countDocuments as jest.Mock).mockResolvedValue(mockPets.length);

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

    limitMock.mockResolvedValue(filteredPets);
    (Pet.countDocuments as jest.Mock).mockResolvedValue(mockPets.length);

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

    limitMock.mockResolvedValue(filteredPets);
    (Pet.countDocuments as jest.Mock).mockResolvedValue(mockPets.length);

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
});
