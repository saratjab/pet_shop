import logger from '../../config/logger';
import Pet from '../../models/petModel';
import { petBuilder } from '../builder/petBuilder';

jest.mock('../../config/logger');

describe('findPetById service', () => {
  let mockPets: any[];

  beforeEach(async () => {
    mockPets = [petBuilder({ id: '1' }), petBuilder({ id: '2' })];
  });

  
});
