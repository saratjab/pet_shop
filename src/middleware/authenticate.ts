import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { findUserById } from '../service/userService';
import { localStorage } from '../utils/localStorage';
import Blacklist from '../models/blacklistModel';
import { accessTokenSecret, refresshTokenSecret } from '../app';
import logger from '../config/logger';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  logger.debug(`check headers for token`);
  console.log(req.headers);
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  if (!token) {
    logger.warn('Authentication failed: Missing or invalid token format');
    res.status(401).json({ message: 'Invalide token format' });
    return;
  }
  try {
    const payload = jwt.verify(token, accessTokenSecret!) as {
      userId: string;
    };
    logger.debug(`Token verified for userId: ${payload.userId}`);

    const blacklistToken = await Blacklist.findOne({ token });
    if (blacklistToken) {
      logger.warn(`Token is blacklisted for userId: ${payload.userId}`);
      res.status(401).json({ message: 'Token is blacklisted' });
      return;
    }

    const user = await findUserById(payload.userId);
    req.user = user;
    logger.info(`Authenticated user: ${user.username}`);
    next();
  } catch (err: any) {
    logger.error(`Authentication error: ${err.message}`);
    res.status(401).json({
      message: 'Authentication required. Please log in',
    });
  }
};

export const verifyRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = localStorage.getItem('refreshToken') || req.body.refreshToken;
  if (!token) {
    logger.warn('Refresh token missing in verifyRefreshToken');
    res.status(401).json({ message: 'Refresh Token missing' });
    return;
  }
  try {
    const payload = jwt.verify(token, refresshTokenSecret!) as {
      userId: string;
    };
    logger.debug(`Refresh token verified for userId: ${payload.userId}`);

    const blacklistToken = await Blacklist.findOne({ token });
    if (blacklistToken) {
      logger.warn(`Refresh token is blacklisted for userId: ${payload.userId}`);
      res.status(401).json({ message: 'Token is blacklisted' });
      return;
    }

    const user = await findUserById(payload.userId);
    req.user = user;
    logger.info(`Verified refresh token for user: ${user.username}`);
    next();
  } catch (err: any) {
    logger.error(`Refresh token verification failed: ${err.message}`);
    res.status(401).json({
      message: 'Authentication required. Please log in',
    });
  }
};
