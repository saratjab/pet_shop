import { Request, Response} from 'express';
import { generateToken } from '../utils/jwt';
import { handleError } from '../utils/handleErrors';
import { localStorage } from '../utils/localStorage';

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
        localStorage.removeItem('refreshToken');
        res.status(200).json({ message: 'Logged out successfully' })
    }catch(err: any){
        const errors = handleError(err);
        res.status(400).json( errors );
    }
}