import type { HydratedDocument } from 'mongoose';

import type { IAdopt } from '../models/adoptModel';
import Adopt from '../models/adoptModel';
import type { IPet } from '../models/petModel';
import Pets from '../models/petModel';
import { findUserById } from '../service/userService';
import logger from '../config/logger';

type paymentSummary = {
  total: number;
  payMoney: number;
  remaining: number;
};

export const isPetValid = async (
  pets: string[]
): Promise<HydratedDocument<IPet>[]> => {
  logger.debug('Validation pets');
  const petsData = await Pets.find({
    _id: { $in: pets },
  });
  if (petsData.some((p) => !p || p.isAdopted)) {
    logger.warn('One or more pets not found or already adopted');
    throw Error('One or more pets not found or already adopted');
  }

  logger.info('All pets are valid and available for adoption');
  return petsData;
};

export const isCustomerOld = async (user_id: string): Promise<boolean> => {
  const user = await Adopt.findOne({ user_id });
  if (user) return true;
  return false;
};

export const getTotalPrice = async (pets: IPet[]): Promise<number> => {
  return pets.reduce((sum, pet) => sum + pet.price, 0);
};

export const makePetsAdopted = async (pets: IPet[]): Promise<void> => {
  await Pets.updateMany(
    { _id: { $in: pets.map((pet) => pet.id) } },
    { $set: { isAdopted: true } }
  );
};

export const saveAdopt = async (
  adopt: IAdopt
): Promise<HydratedDocument<IAdopt>> => {
  logger.info(`Attempting to save adoption for user ${adopt.user_id}`);

  const user = await findUserById(adopt.user_id);
  const pets = await isPetValid(adopt.pets);
  const total = await getTotalPrice(pets);
  await makePetsAdopted(pets);
  const isOld = await isCustomerOld(user.id);

  let adoptDoc: HydratedDocument<IAdopt>;
  if (isOld) {
    logger.info(`Existing customer: ${user.id}, updating adoption record`);
    const userDB = await Adopt.findOne({ user_id: user.id });
    if (!userDB) {
      logger.warn('User adoption not found');
      throw Error('user adoption not found');
    }
    adoptDoc = userDB;
    adoptDoc.pets.push(...adopt.pets);
    adoptDoc.total! += total;
    adoptDoc.payMoney! += adopt.payMoney ?? 0;
  } else {
    logger.info(`New customer ${user.id}, creating new adoption`);
    adoptDoc = new Adopt({
      user_id: adopt.user_id,
      pets: adopt.pets,
      payMoney: adopt.payMoney ?? 0,
      total: total,
    });
  }

  if (adoptDoc.payMoney! < adoptDoc.total!) {
    adoptDoc.status = 'pending';
  } else if (adoptDoc.payMoney === adoptDoc.total!) {
    adoptDoc.status = 'completed';
  } else {
    const remaining = adoptDoc.payMoney! - adoptDoc.total!;
    logger.warn(`Overpayment detected, Refunding remaining: ${remaining}`);
    adoptDoc.payMoney = adoptDoc.total!;
    throw Error(`remining ${remaining}$`);
  }

  logger.info(`Adoption saved for user ${user.id}`);
  return await adoptDoc.save();
};

export const findAllAdopts = async (pagination: {
  limit: number;
  skip: number;
}): Promise<{ adoptions: HydratedDocument<IAdopt>[]; total: number }> => {
  const [adoptions, total] = await Promise.all([
    Adopt.find({}).skip(pagination.skip).limit(pagination.limit),
    Adopt.countDocuments(),
  ]);
  return { adoptions, total };
};

export const findAdoptById = async (
  id: string
): Promise<HydratedDocument<IAdopt>> => {
  const adopt = await Adopt.findById(id);
  if (!adopt) throw Error('Adopt not found');
  return adopt;
};

export const findMyPets = async (user_id: string): Promise<string[]> => {
  const adopt = await Adopt.findOne({ user_id });
  if (!adopt) throw Error('no adoption');
  return adopt.pets;
};

export const getMoney = async (user_id: string): Promise<paymentSummary> => {
  const adopt = await Adopt.findOne({ user_id });
  if (!adopt) throw Error('no adoption');
  return {
    total: adopt.total!,
    payMoney: adopt.payMoney!,
    remaining: adopt.total! - adopt.payMoney!,
  };
};

export const payments = async (
  user_id: string,
  money: number
): Promise<paymentSummary> => {
  const adopt = await Adopt.findOne({ user_id });
  if (!adopt) throw Error('no adoption');
  adopt.payMoney! += money;
  if (adopt.payMoney! < adopt.total!) {
    adopt.status = 'pending';
  } else if (adopt.payMoney === adopt.total!) {
    adopt.status = 'completed';
  } else {
    adopt.payMoney = adopt.total!;
    adopt.status = 'completed';
  }
  await adopt.save();

  return {
    total: adopt.total!,
    payMoney: adopt.payMoney!,
    remaining: adopt.total! - adopt.payMoney!,
  };
};

export const makePetsNotAdopted = async (pets: IPet[]): Promise<void> => {
  await Pets.updateMany(
    { _id: { $in: pets.map((pet) => pet.id) } },
    { $set: { isAdopted: true } }
  );
};

export const cancelingPets = async (
  user_id: string,
  pets: string[]
): Promise<HydratedDocument<IAdopt>> => {
  logger.info(`User ${user_id} attempting to cancel adoption for pets`);

  const adopt = await Adopt.findOne({ user_id });
  if (!adopt) {
    logger.error('No adoption found for cancellation');
    throw Error('No adoption found');
  }

  const userAdoptedPets = adopt.pets.map((pet_id) => pet_id.toString());
  const cancelablePetIds = pets.filter((id) => userAdoptedPets.includes(id));

  if (cancelablePetIds.length === 0) {
    logger.warn("None of the selected pets are part of the user's pets");
    throw Error("None of the selected pets are part of the user's pets");
  }

  const petsToCancel = await Pets.find({
    _id: { $in: cancelablePetIds },
  });

  const total = await getTotalPrice(petsToCancel);

  await makePetsNotAdopted(petsToCancel);
  logger.info('Marked pets as not adopted');

  const newTotal = adopt.total! - total;

  if (newTotal === 0) {
    adopt.payMoney = 0;
    adopt.status = 'cancelled';
    logger.info('All pets canceled. adoption fully cancelled for user');
  } else if (adopt.payMoney! >= newTotal) {
    adopt.payMoney = newTotal;
    adopt.status = 'completed';
  } else if (adopt.payMoney! < newTotal) {
    adopt.status = 'pending';
  }
  adopt.pets = adopt.pets.filter((pet) => !pets.includes(pet.toString()));

  adopt.total = newTotal;
  logger.info(`Adoption updated after cancellation for user ${user_id}`);
  return await adopt.save();
};
