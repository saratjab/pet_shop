import type { Request, Response } from 'express';

import { generateToken } from '../utils/jwt';
import { handleError } from '../utils/handleErrors';
import { localStorage } from '../utils/localStorage';
import Blacklist from '../models/blacklistModel';
import logger from '../config/logger';
import type { errorType } from '../types/errorType';

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info(`Generating new access token for user: ${req.user!.id}`);

    const accessToken = generateToken(req.user!.id);
    logger.info(`New access token generated for user: ${req.user!.id}`);

    res.status(200).json({ accessToken });
  } catch (err: unknown) {
    logger.error(
      `Failed to generate access token for user ${req.user?.id}: ${(err as errorType).message}`
    );
    const errors = handleError(err as errorType);
    res.status(401).json(errors);
  }
};

export const logOut = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = localStorage.getItem('refreshToken');
    const expiresAt = new Date(Date.now() + 3600000);
    logger.info(`Blacklisting refresh token for user: ${req.user?.id}`);

    await Blacklist.create({ token, expiresAt });
    logger.info(
      `Refresh token blacklisted successfully for user: ${req.user?.id}`
    );

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err: unknown) {
    logger.error(
      `Logout failed for user ${req.user?.id}: ${(err as errorType).message}`
    );
    const errors = handleError(err as errorType);
    res.status(500).json(errors);
  }
};
