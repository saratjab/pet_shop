import Adopt, { IAdopt } from '../../models/adoptModel';
import { createAdopt } from '../../types/adoptTypes';
import { adoptBuilder } from '../builder/adoptBuilder';

describe('Adopt model', () => {
  let mockAdoptData: any;

  beforeEach(() => {
    mockAdoptData = adoptBuilder();
  });

  it('should create and save a valid adoption', async () => {
    const adopt: IAdopt = await Adopt.create(mockAdoptData);

    expect(adopt).toBeDefined();
    expect(adopt.user_id).toBeDefined();
    expect(adopt.pets).toBeDefined();
    expect(adopt.payMoney).toBe(mockAdoptData.payMoney);
    expect(adopt.total).toBe(mockAdoptData.total);
    expect(adopt.status).toBe(mockAdoptData.status);
    expect(adopt.createdAt).toBeDefined();
    expect(adopt.updatedAt).toBeDefined();
  });

  describe('should set default values', () => {
    it('should set default value for payMoney to be 0', async () => {
      const adopt: IAdopt = await Adopt.create({
        ...mockAdoptData,
        payMoney: undefined,
      });

      expect(adopt).toBeDefined();
      expect(adopt.payMoney).toBe(0);
    });

    it('should set default value for status to be pending', async () => {
      const adopt: IAdopt = await Adopt.create({
        ...mockAdoptData,
        status: undefined,
      });

      expect(adopt).toBeDefined();
      expect(adopt.status).toBe('pending');
    });
  });

  describe('status filed', () => {
    it('should accept pending for status', async () => {
      const adopt = await Adopt.create({ ...mockAdoptData, status: 'pending' });

      expect(adopt).toBeDefined();
      expect(adopt.status).toBe('pending');
    });

    it('should accept completed for status', async () => {
      const adopt = await Adopt.create({
        ...mockAdoptData,
        status: 'completed',
      });

      expect(adopt).toBeDefined();
      expect(adopt.status).toBe('completed');
    });

    it('should accept cancelled for status', async () => {
      const adopt = await Adopt.create({
        ...mockAdoptData,
        status: 'cancelled',
      });

      expect(adopt).toBeDefined();
      expect(adopt.status).toBe('cancelled');
    });

    it('should throw error if status is niether pending, completed nor cancelled', async () => {
      const adopt = new Adopt({ ...mockAdoptData, status: 'invalid-status' });

      await expect(adopt.save()).rejects.toThrow(/validation failed/i);
    });
  });

  it('should allow optional total field', async () => {
    const adopt = await Adopt.create({ ...mockAdoptData, total: 70 });

    expect(adopt).toBeDefined();
    expect(adopt.total).toBe(70);
  });
});
