import type { Request, Response, NextFunction } from 'express';

import logger from '../config/logger';
import type { IUser } from '../models/userModel';

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    logger.debug(`Allowed roles: [${roles.join(', ')}]`);

    const user: IUser | undefined = req.user;
    if (!user || !roles.includes(user.role)) {
      logger.warn('Access denied for user');
      res.status(403).json({
        message: 'Access denied. You are not authorized.',
      });
      return;
    }
    logger.info(`Access granted for user: ${user.username}`);
    next();
  };
};
