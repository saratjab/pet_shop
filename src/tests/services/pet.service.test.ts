import logger from '../../config/logger';
import Pet from '../../models/petModel';
import { savePet, updatePets } from '../../service/petService';
import { petBuilder } from '../builder/petBuilder';
import { petFixture } from '../fixture/petFixture';

jest.mock('../../config/logger');

describe('updatePets Service', () => {
  let mockPet: any;
  let savePet: jest.Mock;

  beforeAll(async () => {
    jest.resetModules(); // clears any cached modules

    jest.mock('../../service/petService', () => ({
      savePet: jest.fn(), // only mock the savePet functoin
    }));

    savePet = jest.fn().mockImplementation(async (pet) => pet);
  });

  beforeEach(() => {
    mockPet = petBuilder();
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.clearAllMocks();
    jest.resetModules();
    jest.unmock('../../service/petService');
  });
});
