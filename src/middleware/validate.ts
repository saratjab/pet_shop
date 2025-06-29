import { Request, Response, NextFunction } from 'express';
import { handleError } from '../utils/handleErrors';
import { ZodSchema } from 'zod';

export const validate = 
(schema: ZodSchema, target: 'body' | 'query' | 'params' = 'body') => 
(req: Request, res: Response, next: NextFunction) => {
    try{
        schema.parse(req[target]);
        next();
    }catch(err: any){
        const errors = handleError(err);
        res.status(400).json( errors );
    }
}

