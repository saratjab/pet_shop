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

    expect(adopt.user_id).toBeDefined();
    expect(adopt.pets).toBeDefined();
    expect(adopt.payMoney).toBe(mockAdoptData.payMoney);
    expect(adopt.total).toBe(mockAdoptData.total);
    expect(adopt.status).toBe(mockAdoptData.status);
    expect(adopt.createdAt).toBeDefined();
    expect(adopt.updatedAt).toBeDefined();
  });
});
