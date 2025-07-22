import { ZodSchema } from 'zod';
import { handleError } from '../utils/handleErrors';
import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

export const validate = (body: ZodSchema | null, query: ZodSchema | null, params: ZodSchema | null) =>
(req: Request, res: Response, next: NextFunction) =>{
    try{
        if(body !== null){
            const parsed = body.parse(req.body);
            req.body = parsed;
        }
        if(query !== null){
            const parsed = query.parse(req.query);
            req.query = parsed;
        }
        if(params !== null){
            const parsed = params.parse(req.params);
            req.params = parsed;
        }
        logger.debug(`Validatoin passed and parsed into ${req.body}`);
        next();
    }catch(err: any){
        const errors = handleError(err);
        res.status(400).json( errors );
    }
}