import { ZodSchema } from 'zod';
import { handleError } from '../utils/handleErrors';
import { Request, Response, NextFunction } from 'express';

export const validate = 
(schema: ZodSchema, target: 'body' | 'query' | 'params') => 
(req: Request, res: Response, next: NextFunction) => {
    try{
        schema.parse(req[target]);
        next();
    }catch(err: any){
        const errors = handleError(err);
        res.status(400).json( errors );
    }
}