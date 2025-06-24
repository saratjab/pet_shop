import { Request, Response} from 'express';
import { generateRefreshToken, generateToken } from '../utils/jwt';
import { handleError } from '../utils/handleErrors';
import { findUserById } from '../service/userService';

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    const accessToken = generateToken(req.user.id);
    res.status(200).json({ accessToken });
    try{
        
    }catch(err: any){
        const errors = handleError(err);
        res.status(401).json( errors );
    }
}