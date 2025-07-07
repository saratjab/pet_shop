import { ZodSchema } from 'zod';
import { handleError } from '../utils/handleErrors';
import { Request, Response, NextFunction } from 'express';

// export const validate = 
// (schemas: ZodSchema[], target: ('body' | 'query' | 'params')[]) => 
// (req: Request, res: Response, next: NextFunction) => {
//     try{
//         for(let i = 0; i < schemas.length; i++){
//             const parsed = schemas[i].parse(req[target[i]]);
//             console.log('parsed', parsed);
//             req.query = parsed;
//             // if(target[i] === 'query')
//             //     Object.assign(req.query, parsed);
//             // else 
//             //     req[target[i]] = parsed;
//         }
//         next();
//     }catch(err: any){
//         const errors = handleError(err);
//         res.status(400).json( errors );
//     }
// }

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