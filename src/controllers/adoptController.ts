import { Request, Response } from 'express';
import { handleError } from '../utils/handleErrors';
import { formatAdoptResponse } from '../utils/format';
import {
  findAllAdopts,
  saveAdopt,
  findMyPets,
  getMoney,
  payments,
  cancelingPets,
  findAdoptById,
} from '../service/adoptService';
import { pagination } from '../types/paginationTypes';
import logger from '../config/logger';
import { errorType } from '../types/errorType';

export const getAdoptions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const query = req.query as unknown as pagination;
    logger.debug(`Fetching adoptions`);

    const skip = (query.page - 1) * query.limit;
    const { adoptions, total } = await findAllAdopts({
      limit: query.limit,
      skip,
    });
    if (adoptions.length === 0) {
      logger.warn('No adoptions found');
      res.status(200).json({ message: 'Adoptions not found' });
    } else {
      logger.info(`Returning ${adoptions.length}`);
      res.status(200).json({
        data: adoptions.map((adopts) => formatAdoptResponse(adopts)),
        pagination: {
          total,
          page: query.page,
          limit: query.limit,
          pages: Math.ceil(total / query.limit),
        },
      });
    }
  } catch (err: unknown) {
    logger.error(`Failed to get adoptions: ${(err as errorType).message}`);
    const errors = handleError(err as errorType);
    res.status(404).json(errors);
  }
};

export const adoption = async (req: Request, res: Response): Promise<void> => {
  try {
    const user_id = req.user!.id;
    if (!user_id) {
      logger.warn('User ID missing on adoption request');
      throw Error('User not found');
    }
    const adopt = req.body;
    adopt.user_id = user_id;

    logger.debug(`Saving adoption for user: ${user_id}`);
    const savedAdopt = await saveAdopt(adopt);
    logger.info(`Adoption saved successfully with id: ${savedAdopt._id}`);
    res.status(201).json(formatAdoptResponse(adopt));
  } catch (err: unknown) {
    logger.error('Failed to save adoption', {
      message: (err as errorType).message,
    });
    const errors = handleError(err as errorType);
    res.status(400).json(errors);
  }
};

export const getMyPets = async (req: Request, res: Response): Promise<void> => {
  try {
    //! test
    const user_id = req.user!.id;
    if (!user_id) {
      logger.warn('User ID missing on getMyPets request');
      throw Error('User not found');
    }

    logger.debug(`Fetching pets adopted by user: ${user_id}`);
    const pets = await findMyPets(user_id);

    logger.info(`Returning ${pets.length} pets for user: ${user_id}`);
    res.status(200).json(pets);
  } catch (err: unknown) {
    logger.error('Failed to get user pets', {
      message: (err as errorType).message,
    });
    const errors = handleError(err as errorType);
    res.status(404).json(errors);
  }
};

export const getRemains = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user_id = req.user!.id;
    if (!user_id) {
      logger.warn('User ID missing on getRemains request');
      throw Error('User not found');
    }

    logger.debug(`Getting remaining balance for user: ${user_id}`);
    const infoPay = await getMoney(user_id);

    logger.info(`Remaining balance retrieved for user: ${user_id}`);
    res.status(200).json(infoPay);
  } catch (err: unknown) {
    logger.error('Failed to get remaining payment info', {
      message: (err as errorType).message,
    });
    const errors = handleError(err as errorType);
    res.status(500).json(errors);
  }
};

export const payment = async (req: Request, res: Response): Promise<void> => {
  try {
    const money = req.body.payMoney;
    const user_id = req.user!.id;
    if (!user_id) {
      logger.warn('User ID missing on payment request');
      throw Error('User not found');
    }

    logger.debug(`Processing payment of ${money} for user: ${user_id}`);
    const pays = await payments(user_id, money);
    logger.info(`Payment successful for user: ${user_id}, amount: ${money}`);
    res.status(200).json(pays);
  } catch (err: unknown) {
    logger.error('Payment processing failed', {
      message: (err as errorType).message,
    });
    const errors = handleError(err as errorType);
    res.status(400).json(errors);
  }
};

export const cancelPets = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const pets = req.body.pets;
    const user_id = req.user!.id;

    logger.debug(
      `User ${user_id} requested to cancel pets: ${JSON.stringify(pets)}`
    );
    const adopt = await cancelingPets(user_id, pets);

    logger.info(`Pets cancelled for user ${user_id}`);
    res.status(200).json(adopt);
  } catch (err: unknown) {
    logger.error('Failed to cancel pets', {
      message: (err as errorType).message,
    });
    const errors = handleError(err as errorType);
    res.status(400).json(errors);
  }
};

export const getAdoption = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const adopt_id = req.params.id;
    logger.debug(`Fetching adoption with ID: ${adopt_id}`);

    const adopt = await findAdoptById(adopt_id);

    logger.info(`Adoption retrieved: ${adopt_id}`);
    res.status(200).json(formatAdoptResponse(adopt));
  } catch (err: unknown) {
    logger.error('Failed to get adoption', {
      message: (err as errorType).message,
    });
    const errors = handleError(err as errorType);
    res.status(400).json(errors);
  }
};
