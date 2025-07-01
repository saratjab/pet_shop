import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';
import { findUserById } from "../service/userService";
import { handleError } from "../utils/handleErrors";
import { localStorage } from "../utils/localStorage";
import Blacklist from "../models/blacklistModel";
import { accessTokenSecret, refresshTokenSecret } from "../app";


declare global {
    namespace Express {
        interface Request{
            user?: any;
        }
    }
}

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
        res.status(401).json({ message: 'Authentication required. Please log in' });
    }
}

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
        res.status(401).json({ message: 'Authentication required. Please log in' });
    }
}