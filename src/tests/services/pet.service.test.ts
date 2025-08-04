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
});
