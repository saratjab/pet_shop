import { refreshToken } from '../controllers/authControllers';
import { verifyRefreshToken } from '../middleware/authenticate';
import User from '../models/userModel';

export const handleRefreshToken = async (refreshToken: string) => {

}