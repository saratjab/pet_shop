import { Request, Response, NextFunction } from 'express';

export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => { //* this called a higher-order function (a function that returns another function)
        if(!req.user || !roles.includes(req.user.role)){
            res.status(403).json({message: 'Access denied. You are not authorized.'});
            return;
        }
        next();
    }
    // This middleware : 
    //? takes a list of allowed roles ['admin', 'employee']
    //? checks if req.user.role is in that list 
    //? if not responds with 304 forbidden
}
//! authorizeRoles('admin')
//? Do: 
// check if req.user.role [the logged in user] is admin
// prevent unaothorized users from accessing the route


//! RBAC Role-Based Access Control
//? means users get access permissions based o their role, not their identity
//? Why use RBAC
//* easy to manage: assign permissions by role, not per user
//* scalable: works well in lage systems
//* secure: prevents unauthorized access
//* maintainable: roles act like permissions groups
