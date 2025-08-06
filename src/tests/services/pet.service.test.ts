import mongoose from 'mongoose';
import Pet from '../../models/petModel';
import { deletePets } from '../../service/petService';
import { petBuilder } from '../builder/petBuilder';
import logger from '../../config/logger';

jest.mock('../../config/logger');

describe('deletePets service', () => {
  let mockPets: any[];
  let mockIds: mongoose.Types.ObjectId[];
  let mockTags: string[];

  beforeEach(async () => {
    mockIds = [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()];

    mockPets = [
      petBuilder({ _id: mockIds[0], petTag: 'tag1' }),
      petBuilder({ _id: mockIds[1], petTag: 'tag2' }),
    ];

    await Pet.insertMany(mockPets);
    Pet.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 2 });
    mockTags = ['tag1', 'tag2'];
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should call deleteMany with correct IDs', async () => {
    const idStrings = mockIds.map((id) => id.toString());
    await deletePets(idStrings, undefined);

    expect(Pet.deleteMany).toHaveBeenCalledTimes(1);
    expect(Pet.deleteMany).toHaveBeenCalledWith({
      _id: { $in: idStrings },
    });
    expect(logger.info).toHaveBeenCalledWith('Deleting pets by IDs');
    expect(logger.debug).toHaveBeenCalledWith('Pet deletions completed');
  });

  it('should call deleteMany with correct petTags', async () => {
    await deletePets(undefined, mockTags);

    expect(Pet.deleteMany).toHaveBeenCalledTimes(1);
    expect(Pet.deleteMany).toHaveBeenCalledWith({
      petTag: { $in: mockTags },
    });
    expect(logger.info).toHaveBeenCalledWith('Deleting pets by petTags');
  });
});
