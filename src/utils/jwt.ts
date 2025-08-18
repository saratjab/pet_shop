import jwt from 'jsonwebtoken';

import logger from '../config/logger';

export const generateToken = (userId: string) => {
  logger.debug(`Generating access token for user: ${userId}`);

  const token = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: '1d',
  });

  logger.debug(`Access token generated for user: ${userId}`);
  return token;
};

export const generateRefreshToken = (userId: string) => {
  logger.debug(`Generating refresh token for user: ${userId}`);

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: '1d',
  });

  logger.debug(`Refresh token generated for user: ${userId}`);
  return refreshToken;
};
