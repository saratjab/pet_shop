import type { FilterQuery, HydratedDocument } from 'mongoose';

import type { IPet } from '../models/petModel';
import Pets from '../models/petModel';
import type { getPetsQuery, updatePetType } from '../types/petTypes';
import logger from '../config/logger';

export const findPetById = async (
  id: string
): Promise<HydratedDocument<IPet>> => {
  logger.debug(`Searching for pet by ID: ${id}`);
  const pet = await Pets.findById(id);
  if (!pet) {
    logger.warn(`Pet not found with ID: ${id}`);
    throw Error('pet not found');
  }
  logger.debug(`pet found with ID: ${id}`);
  return pet;
};

export const findPetByPetTag = async (
  petTag: string
): Promise<HydratedDocument<IPet>> => {
  logger.debug(`Searching for pet by petTag: ${petTag}`);
  const pet = await Pets.findOne({ petTag: petTag, isAdopted: false });
  if (!pet) {
    logger.warn(`Pet not found with petTag: ${petTag}`);
    throw Error('pet not found');
  }
  logger.debug(`pet found with petTag: ${petTag}`);
  return pet;
};

export const savePet = async (pet: IPet): Promise<HydratedDocument<IPet>> => {
  try {
    logger.debug('saving new pet to database');

    const newPet = new Pets(pet);
    const savedPet = await newPet.save();

    logger.debug(`Pet saved with ID: ${savedPet._id}`);
    return savedPet;
  } catch (err) {
    logger.warn('Error saving pet to database', (err as Error).message);
    throw Error('Error saving pet');
  }
};

export const updatePets = async (
  pet: IPet,
  petP: updatePetType
): Promise<HydratedDocument<IPet>> => {
  logger.debug(`Updating pet: ${pet.petTag}`);
  Object.assign(pet, petP);
  logger.info(`Pet ${pet.petTag} updated successfully`);
  return await savePet(pet);
};

export const deletePets = async (
  id?: string[],
  petTag?: string[]
): Promise<void> => {
  if (!id && !petTag) {
    logger.warn('Nither id nor petTag has been provided');
    throw new Error('Either id or petTag must be provided');
  }
  if (id) {
    logger.info('Deleting pets by IDs');
    await Pets.deleteMany({
      _id: { $in: id },
    });
  }
  if (petTag) {
    logger.info('Deleting pets by petTags');
    await Pets.deleteMany({
      petTag: { $in: petTag },
    });
  }
  logger.debug('Pet deletions completed');
};

export const filter = async (
  query: getPetsQuery
): Promise<{ pets: HydratedDocument<IPet>[]; total: number }> => {
  logger.debug('Filtering pets with query');

  const newQuery: FilterQuery<IPet> = {};
  //x !== null && x !== undefined
  if (query.kind !== null && query.kind !== undefined)
    newQuery.kind = query.kind;
  if (query.gender !== null && query.gender !== undefined)
    newQuery.gender = query.gender;
  if (query.isAdopted !== null && query.isAdopted !== undefined)
    newQuery.isAdopted = query.isAdopted;
  if (query.age !== null && query.age !== undefined) newQuery.age = query.age;
  else if (
    (query.minAge !== null && query.minAge !== undefined) ||
    (query.maxAge !== null && query.maxAge !== undefined)
  ) {
    newQuery.age = {};
    if (query.minAge !== null && query.minAge !== undefined)
      newQuery.age.$gte = query.minAge;
    if (query.maxAge !== null && query.maxAge !== undefined)
      newQuery.age.$lte = query.maxAge;
  }
  if (query.price !== null && query.price !== undefined)
    newQuery.price = query.price;
  else if (
    (query.minPrice !== null && query.minPrice !== undefined) ||
    (query.maxPrice !== null && query.maxPrice !== undefined)
  ) {
    newQuery.price = {};
    if (query.minPrice !== null && query.minPrice !== undefined)
      newQuery.price.$gte = query.minPrice;
    if (query.maxPrice !== null && query.maxPrice !== undefined)
      newQuery.price.$lte = query.maxPrice;
  }

  const skip = (query.page - 1) * query.limit;

  const [pets, total] = await Promise.all([
    Pets.find(newQuery)
      .sort({ [query.sortBy!]: query.order })
      .skip(skip)
      .limit(query.limit),
    Pets.countDocuments(),
  ]);

  logger.info(`Filtered ${pets.length} pets (Total: ${total})`);
  return { pets, total };
};
