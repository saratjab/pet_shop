import { Request, Response} from 'express';
import { generateToken } from '../utils/jwt';
import { handleError } from '../utils/handleErrors';

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    try{
        const accessToken = generateToken(req.user.id);
        res.status(200).json({ accessToken });
    }catch(err: any){
        const errors = handleError(err);
        res.status(401).json( errors );
    }
}