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

  it('should throw error if no IDs or petTags are provided', async () => {
    await expect(deletePets()).rejects.toThrow(
      'Either id or petTag must be provided'
    );
    expect(Pet.deleteMany).not.toHaveBeenCalled();
  });

  it('should handle empty arrays for IDs and petTags', async () => {
    await deletePets([], []);
    expect(Pet.deleteMany).toHaveBeenCalled();
    expect(Pet.deleteMany).toHaveBeenCalledWith({
      _id: { $in: [] },
    });
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
});
