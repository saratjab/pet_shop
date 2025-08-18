import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

import { handleError } from '../utils/handleErrors';
import logger from '../config/logger';
import { errorType } from '../types/errorType';

export const validate =
  (body: ZodSchema | null, query: ZodSchema | null, params: ZodSchema | null) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.debug(`Validating request for ${req.method} ${req.originalUrl}`);

      if (body !== null) {
        const parsed = body.parse(req.body);
        req.body = parsed;
      }
      if (query !== null) {
        const parsed = query.parse(req.query);
        req.query = parsed;
      }
      if (params !== null) {
        const parsed = params.parse(req.params);
        req.params = parsed;
      }

      logger.debug('Validatoin passed and parsed');
      next();
    } catch (err: unknown) {
      logger.warn(`Validation failed: ${(err as errorType).message}`);
      const errors = handleError(err as errorType);
      res.status(400).json(errors);
    }
  };
