import { Request, Response, NextFunction } from 'express';

export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => { //* this called a higher-order function (a function that returns another function)
        if(!req.user || !roles.includes(req.user.role)){
            res.status(403).json({message: 'Access denied. You are not authorized.'});
            return;
        }
        next();
    }
}

