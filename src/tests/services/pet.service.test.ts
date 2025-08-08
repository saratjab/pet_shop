import mongoose from 'mongoose';
import Pet from '../../models/petModel';
import { deletePets } from '../../service/petService';
import { petBuilder } from '../builder/petBuilder';
import logger from '../../config/logger';

jest.mock('../../config/logger');

describe('deletePets service', () => {
  let mockIds: mongoose.Types.ObjectId[];
  let mockTags: string[];
  let mockedLogger: any;

  beforeEach(async () => {
    mockedLogger = logger as jest.Mocked<typeof logger>;
    mockIds = [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()];
    mockTags = ['tag1', 'tag2'];

    // await Pet.insertMany(mockPets);
    Pet.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 2 });
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

    expect(mockedLogger.info.mock.calls[0][0]).toBe('Deleting pets by IDs');
    expect(mockedLogger.debug.mock.calls[0][0]).toBe('Pet deletions completed');
  });

  it('should call deleteMany with correct petTags', async () => {
    await deletePets(undefined, mockTags);

    expect(Pet.deleteMany).toHaveBeenCalledTimes(1);
    expect(Pet.deleteMany).toHaveBeenCalledWith({
      petTag: { $in: mockTags },
    });

    expect(mockedLogger.info.mock.calls[0][0]).toBe('Deleting pets by petTags');
  });

  it('should throw error if no IDs or petTags are provided', async () => {
    await expect(deletePets()).rejects.toThrow(
      'Either id or petTag must be provided'
    );
    expect(Pet.deleteMany).not.toHaveBeenCalled();
    expect(mockedLogger.warn.mock.calls[0][0]).toBe(
      'Nither id nor petTag has been provided'
    );
  });

  it('should handle empty arrays for IDs', async () => {
    await deletePets([], undefined);
    expect(Pet.deleteMany).toHaveBeenCalled();
    expect(Pet.deleteMany).toHaveBeenCalledWith({
      _id: { $in: [] },
    });
  });

  it('should handle empty arrays for petTags', async () => {
    await deletePets(undefined, []);
    expect(Pet.deleteMany).toHaveBeenCalled();
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

    expect(mockedLogger.info.mock.calls[0][0]).toBe('Deleting pets by IDs');
    expect(mockedLogger.info.mock.calls[1][0]).toBe('Deleting pets by petTags');
    expect(mockedLogger.debug.mock.calls[0][0]).toBe('Pet deletions completed');
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
