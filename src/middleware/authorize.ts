import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    logger.debug(`Allowed roles: [${roles.join(', ')}]`);

    if (!req.user || !roles.includes(req.user.role)) {
      logger.warn(`Access denied for user`);
      res.status(403).json({
        message: 'Access denied. You are not authorized.',
      });
      return;
    }
    logger.info(`Access granted for user: ${req.user.username}`);
    next();
  };
};
