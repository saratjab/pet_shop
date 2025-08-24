import { IPet } from '../models/petModel';
import { createPetType } from '../types/petTypes';
import { BaseClient } from './BaseClient';

const client = new BaseClient();

export const getAllPets = async (): Promise<IPet[]> => {
  try {
    const response = await client.get<IPet[]>('/pets');
    return response.data;
  } catch (err) {
    console.error('Error in getAllPets');
    throw err;
  }
};

export const registerPet = async (pet: createPetType) => {
  try {
    const savedPet = await client.post<IPet>({ url: '/pets', data: pet });
    return savedPet.data;
  } catch (err) {
    console.error('Error in registerPet', err);
    throw err;
  }
};
