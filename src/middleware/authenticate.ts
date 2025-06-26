import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';
import { findUserById } from "../service/userService";
import { handleError } from "../utils/handleErrors";
import { localStorage } from "../utils/localStorage";
import Blacklist from "../models/blacklistModel";

const refresshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

declare global {
    namespace Express {
        interface Request{
            user?: any;
        }
    }
} //? This extends the Express Request interface globally so you can safely attach a user object to it

// export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

//     const authHeader = req.header('Authorization'); // it looks for the Authorization header in the incoming request
//     //? Authorization: Bearer <token>
    
//     const token = authHeader?.split(' ')[1]; //? ['Bearer', '<token>']
//     if(!token){ //! it must have token
//         res.status(401).json({message: 'No token'});
//         return;
//     } 
    
//     try{
//         const payload = jwt.verify(token, process.env.JWT_SECRET!) as {userId : string};
//         //? verify the token using the secret key
//         //? if the token is valid, it extracts the userId from the payload
//         //! if not valid (expired, wrong secret) it throws an error

//         const user = await findUserById(payload.userId);
//         req.user = user; 

//         //! attaches the user object to the request
//         //? this makes the user available in any controllers or middleware that comes after this 
//         next(); // if every thing is valid call the next function 
//     }
//     catch(err: any){
//         console.error("JWT Verification Error:", err.message);
//         res.status(401).json({ message: 'Unauthorized' });
//     }

//     //? this middleware checks if a request is authenticated by validation the jwt token
//     //! this function is used to protect routes
//     // reads the jwt token from the request header
//     // verify the token using secret key 
//     // Finds the user from the DB using the id token
//     // attaches the user to req.user so you can access them later 

// }

export const authenticate = async (req:  Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers['authorization'] ;
    const token = authHeader?.split(' ')[1];
    if(!token){
        res.status(401).json({ message: 'Invalide token format' });
        return
    }

    try{
        const payload = jwt.verify(token, accessTokenSecret!) as {userId : string};

        const blacklistToken = await Blacklist.findOne({ token });
        if(blacklistToken) {
            res.status(401).json({ message: 'Token is blacklisted'});
        }

        const user = await findUserById(payload.userId);
        req.user = user;
        next();
    }
    catch(err: any){
        const errors = handleError(err);
        res.status(401).json({ message: 'Unauthorized' });
    }
}
// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// export interface AuthRequest extends Request {
//     user?: { id: string };
// }

// export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
//     const authHeader = req.headers.authorization;
//     const token = authHeader && authHeader.split(' ')[1]; 

//     if (!token) {
//         res.status(401).json({ message: 'Access token missing' });
//         return;
//     }
//     try {
//         const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
//         req.user = { id: decoded.id };
//         next();
//     } catch (err) {
//         res.status(403).json({ message: 'Invalid token' });
//     }
// };


export const verifyRefreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
    const token = localStorage.getItem('refreshToken');
    if(!token) {
        res.status(401).json({ message: 'Refresh Token missing' });
        return;
    }
    try{
        const payload = jwt.verify(token, refresshTokenSecret!) as { userId: string};
        
        const blacklistToken = await Blacklist.findOne({ token });
        if(blacklistToken) {
            res.status(401).json({ message: 'Token is blacklisted'});
        }

        const user = await findUserById(payload.userId);
        req.user = user;
        next();
    }
    catch(err: any){
        const errors = handleError(err);
        res.status(401).json({ message: 'Unauthorized' });
    }
}