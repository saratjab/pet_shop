import type { IPet } from '../models/petModel';
import type { createPetType } from '../types/petTypes';
import { BaseClient } from './BaseClient';

const client = new BaseClient();

export const getAllPets = async (): Promise<IPet[]> => {
  try {
    const response = await client.get<IPet[]>('/pets');
    return response;
  } catch (err) {
    console.error('Error in getAllPets');
    throw err;
  }
};

export const registerPet = async (pet: createPetType): Promise<IPet> => {
  try {
    const savedPet = await client.post<IPet>({ url: '/pets', data: pet });
    return savedPet;
  } catch (err) {
    console.error('Error in registerPet', err);
    throw err;
  }
};
