import logger from '../../config/logger';
import Pet from '../../models/petModel';
import { savePet } from '../../service/petService';
import { petBuilder } from '../builder/petBuilder';
import { petFixture } from '../fixture/petFixture';

jest.mock('../../config/logger');

describe('savePet service', () => {
  let mockPets: any[];

  beforeEach(async () => {
    jest.resetAllMocks();
    mockPets = [petBuilder(petFixture)];
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await Pet.deleteMany({});
  });

  it('should save a new pet to the database', async () => {
    const pet = await savePet(mockPets[0]);

    expect(pet._id).toBeDefined();
    expect(pet.petTag).toBe(mockPets[0].petTag);
    expect(pet.name).toBe(mockPets[0].name);
    expect(pet.kind).toBe(mockPets[0].kind);
    expect(pet.age).toBe(mockPets[0].age);
    expect(pet.price).toBe(mockPets[0].price);
    expect(pet.description).toBe(mockPets[0].description);

    const petInDb = await Pet.findById(pet._id);
    expect(petInDb).toBeDefined();

    expect(logger.debug).toHaveBeenCalledWith('saving new pet to database');
    expect(logger.debug).toHaveBeenCalledWith(`Pet saved with ID: ${pet._id}`);
  });
});
