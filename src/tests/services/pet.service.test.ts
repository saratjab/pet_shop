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
      petBuilder({ kind: 'kind' }),
      petBuilder({ kind: 'kind' }),
      petBuilder({ kind: 'other' }),
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
});
