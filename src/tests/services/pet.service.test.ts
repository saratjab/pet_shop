import logger from '../../config/logger';
import { updatePets } from '../../service/petService';
import { petFixture } from '../fixture/petFixture';

jest.mock('../../config/logger');

describe('updatePets service', () => {
  let mockPet: any;
  let mockUpdatedField: any;
  let mcokSavedUpdates: any;
  let mockSavePet: any;
  let mockedLogger: any;

  beforeEach(() => {
    mockedLogger = logger as jest.Mocked<typeof logger>;
    mockPet = petFixture;
    mockUpdatedField = { name: 'updated name', age: 3 };
    mcokSavedUpdates = { ...mockPet, ...mockUpdatedField };
    mockSavePet = jest
      .spyOn(require('../../service/petService'), 'savePet')
      .mockResolvedValue(mcokSavedUpdates);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update pet and call savePet with updated data', async () => {
    const updatedPet = await updatePets(mockPet, mockUpdatedField);

    expect(mockSavePet).toHaveBeenCalledTimes(1);
    expect(mockSavePet).toHaveBeenCalledWith(mcokSavedUpdates);
    expect(mockedLogger.debug.mock.calls[0][0]).toBe(
      `Updating pet: ${updatedPet.petTag}`
    );
    expect(mockedLogger.info.mock.calls[0][0]).toBe(
      `Pet ${updatedPet.petTag} updated successfully`
    );
  });

  it('should correctly overwrite the original pet object with updated fields', async () => {
    const updatedPet = await updatePets(mockPet, mockUpdatedField);

    expect(updatedPet).toBeDefined();
    expect(updatedPet.name).toBe('updated name');
    expect(updatedPet.age).toBe(3);
    expect(updatedPet.petTag).toBe(mockPet.petTag);
    expect(updatedPet.kind).toBe(mockPet.kind);
    expect(updatedPet.price).toBe(mockPet.price);
    expect(updatedPet.description).toBe(mockPet.description);
    expect(updatedPet.isAdopted).toBe(mockPet.isAdopted);

    expect(mockedLogger.debug.mock.calls[0][0]).toBe(
      `Updating pet: ${updatedPet.petTag}`
    );
    expect(mockedLogger.info.mock.calls[0][0]).toBe(
      `Pet ${updatedPet.petTag} updated successfully`
    );
  });

  it('should handle empty update fields', async () => {
    const emptyUpdate = {};
    const updatedPet = await updatePets(mockPet, emptyUpdate);

    expect(mockSavePet).toHaveBeenCalledTimes(1);
    expect(mockSavePet).toHaveBeenCalledWith(mockPet);
    expect(updatedPet).toEqual(mockPet);

    expect(mockedLogger.debug.mock.calls[0][0]).toBe(
      `Updating pet: ${updatedPet.petTag}`
    );
    expect(mockedLogger.info.mock.calls[0][0]).toBe(
      `Pet ${updatedPet.petTag} updated successfully`
    );
  });

  it('should log an error if savePet fails', async () => {
    mockSavePet = jest
      .spyOn(require('../../service/petService'), 'savePet')
      .mockRejectedValue(new Error('Save failed'));

    await expect(updatePets(mockPet, mockUpdatedField)).rejects.toThrow(
      'Save failed'
    );
    expect(mockedLogger.debug.mock.calls[0][0]).toBe(
      `Updating pet: ${mockPet.petTag}`
    );
    // expect(logger.warn).toHaveBeenCalledWith('Error saving pet to database'); savePet is mocked, so this won't be called
  });
});
