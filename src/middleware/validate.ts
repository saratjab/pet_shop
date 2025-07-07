import { ZodSchema } from 'zod';
import { handleError } from '../utils/handleErrors';
import { Request, Response, NextFunction } from 'express';

export const validate = (body: ZodSchema | null, query: ZodSchema | null, params: ZodSchema | null) =>
(req: Request, res: Response, next: NextFunction) =>{
    try{
        if(body !== null)
            body.parse(req.body);
        if(query !== null)
            query.parse(req.query);
        if(params !== null)
            params.parse(req.params);
        next();
    }catch(err: any){
        const errors = handleError(err);
        res.status(400).json( errors );
    }
}