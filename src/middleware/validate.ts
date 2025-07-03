import { ZodSchema } from 'zod';
import { handleError } from '../utils/handleErrors';
import { Request, Response, NextFunction } from 'express';

export const validate = 
(schemas: ZodSchema[], target: ('body' | 'query' | 'params')[]) => 
(req: Request, res: Response, next: NextFunction) => {
    try{
        for(let i = 0; i < schemas.length; i++){
            schemas[i].parse(target[i]);
        }
        next();
    }catch(err: any){
        const errors = handleError(err);
        res.status(400).json( errors );
    }
}