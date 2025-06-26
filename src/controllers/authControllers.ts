import { Request, Response} from 'express';
import { generateToken } from '../utils/jwt';
import { handleError } from '../utils/handleErrors';
import { localStorage } from '../utils/localStorage';
import Blacklist from '../models/blacklistModel';

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    try{
        const accessToken = generateToken(req.user.id);
        res.status(200).json({ accessToken });
    }catch(err: any){
        const errors = handleError(err);
        res.status(401).json( errors );
    }
}

export const logOut = async (req: Request, res: Response): Promise<void> => {
    try{
        const token = localStorage.getItem('refreshToken');
        const expiresAt = new Date(Date.now() + 3600000);
        await Blacklist.create({ token, expiresAt });
        res.status(200).json({ message: 'Logged out successfully' })
    }catch(err: any){
        const errors = handleError(err);
        res.status(500).json( errors );
    }
}