import { IPet } from '../models/petModel';
import { Request, Response } from 'express';
import { handleError } from '../utils/handleErrors';
import { formatPetResponse } from '../utils/format';
import { getPetsQuery } from '../types/petTypes';
import {
  savePet,
  findPetById,
  findPetByPetTag,
  filter,
  updatePets,
  deletePets,
} from '../service/petService';
import logger from '../config/logger';
import { errorType } from '../types/errorType';

export const registerPet = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info('Pet registration started');
    logger.debug(`Incoming pet data: ${JSON.stringify(req.body)}`);

    const newPet: IPet = req.body;
    const savedPet = await savePet(newPet);

    logger.info(`Pet registered successfully: ${savedPet}`);
    res.status(201).json(formatPetResponse(savedPet));
  } catch (err: unknown) {
    logger.error(`Registration failed: ${(err as errorType).message}`);
    const errors = handleError(err as errorType);
    res.status(400).json(errors);
  }
};

export const filterPets = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const query = req.query as unknown as getPetsQuery;
    logger.debug(`Filter pets called with query: ${JSON.stringify(query)}`);

    const { pets, total } = await filter(query);
    logger.info(
      `Filter result: ${pets.length} pets found out of ${total} total`
    );

    if ([].length == 0) {
      logger.warn(`No pets found matching criteria: ${JSON.stringify(query)}`);
      res.status(200).json({ message: 'Pets not found' });
    } else
      res.status(200).json({
        data: pets.map((pet) => formatPetResponse(pet)),
        pagination: {
          total,
          page: query.page,
          limit: query.limit,
          pages: Math.ceil(total / query.limit),
        },
      });
  } catch (err: unknown) {
    logger.error(`Error filtering pets: ${(err as errorType).message}`);
    const errors = handleError(err as errorType);
    res.json(404).json(errors);
  }
};

export const getPetById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;
    logger.debug(`Fetching pet by ID: ${id}`);

    const pet = await findPetById(id);
    logger.info(`Pet found: ${pet.petTag}`);
    res.status(200).json(formatPetResponse(pet));
  } catch (err: unknown) {
    logger.warn(`Pet not found with ID: ${req.params.id}`);
    const errors = handleError(err as errorType);
    res.status(404).json(errors);
  }
};

export const getPetByPetTag = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const petTag = req.params.petTag;
    logger.debug(`Fetching pet by petTag: ${petTag}`);

    const pet = await findPetByPetTag(petTag);
    logger.info(`Pet found: ${petTag}`);
    res.status(200).json(formatPetResponse(pet));
  } catch (err: unknown) {
    logger.warn(`Pet not found: ${req.params.petTag}`);
    const errors = handleError(err as errorType);
    res.status(404).json(errors);
  }
};

export const updatePetById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedData = req.body;
    const id = req.params.id;
    logger.debug(`admin requested updates on Pet [${id}]`);

    const pet = await findPetById(id);
    const updatedPet = await updatePets(pet, updatedData);
    logger.info(`Pet [${id}] info updated successfully`);
    res.status(200).json(formatPetResponse(updatedPet));
  } catch (err: unknown) {
    logger.error(
      `Failed to update pet: [${req.params.id}]: ${(err as errorType).message}`
    );
    const errors = handleError(err as errorType);
    res.status(400).json(errors);
  }
};

export const updatePetByPetTag = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedData = req.body;
    const petTag = req.params.petTag;
    logger.debug(`admin requested updates on Pet [${petTag}]`);

    const pet = await findPetByPetTag(petTag);
    const updatedPet = await updatePets(pet, updatedData);
    logger.info(`Pet [${petTag}] info updated successfully`);
    res.status(200).json(formatPetResponse(updatedPet));
  } catch (err: unknown) {
    logger.error(
      `Failed to update pet: [${req.params.id}]: ${(err as errorType).message}`
    );
    const errors = handleError(err as errorType);
    res.status(400).json(errors);
  }
};

export const deletePetById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.body.id;
    logger.debug(`requested deletion of pet by ID [${id}]`);

    await deletePets(id);
    logger.info(`Pet [${id}] has been deleted`);
    res.status(204).json({ message: 'you deleted pets' });
  } catch (err: unknown) {
    logger.error(
      `Error deleting user by ID [${req.params.id}]: ${(err as errorType).message}`
    );
    const errors = handleError(err as errorType);
    res.status(400).json(errors);
  }
};

export const deletePetByPetTag = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const petTag = req.body.petTag;
    logger.debug(`requested deletion of pet by ID [${petTag}]`);

    await deletePets(undefined, petTag);
    logger.info(`Pets has been deleted`);
    res.status(204).json({ message: 'you deleted pets' });
  } catch (err: unknown) {
    logger.error(
      `Error deleting pets by pet tag: ${(err as errorType).message}`
    );
    const errors = handleError(err as errorType);
    res.status(400).json(errors);
  }
};
