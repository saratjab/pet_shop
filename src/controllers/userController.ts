import { Response, Request } from 'express';
import { handleError } from '../utils/handleErrors';
import { formatUserResponse } from '../utils/format';
import { generateRefreshToken, generateToken } from '../utils/jwt';
import { saveUser, findAllUsers, findUserById, findUserByUsername, verifyPassword, update } from '../service/userService';
import { pagination } from '../types/paginationTypes';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try{
        const newUser = req.body;
        const savedUser = await saveUser(newUser);
        res.status(201).json(formatUserResponse(savedUser));   
    }
    catch(err: any){
        const errors = handleError(err);
        res.status(400).json( errors );
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {
    try{
        const { username, password } = req.body;
        const user = await findUserByUsername(username);
        await verifyPassword(password, user);

        const token: string = generateToken(user.id);
        const refreshToken = generateRefreshToken(user.id);
        res.status(200).json({
            token: token,
            refreshToken: refreshToken,
            user: formatUserResponse(user),
        });
    }
    catch(err: any){
        const errors = handleError(err);
        res.status(400).json( errors );
    }
}

export const registerEmployee = async (req: Request, res: Response): Promise<void> => {
    try{
        const newEmp = req.body;
        const savedEmp = await saveUser(newEmp);
        res.status(201).json(formatUserResponse(savedEmp));   
    }catch(err: any){
        const errors = handleError(err);
        res.status(400).json( errors ) ;
    }
}

export const getUsers = async (req: Request, res: Response):Promise<void> => {
    try{
        const { page = 1, limit = 10} = req.query as pagination;
        const skip = (page - 1) * limit;
        console.log(limit, skip);
        const { users, total } = await findAllUsers({ limit, skip }); 
        console.log(total);
        if(users.length === 0) res.status(200).json({ message: 'No users found'})
        else res.status(200).json({
            data: users.map(user => (formatUserResponse(user))),
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            }
        });
    }
    catch(err: any) {
        const errors = handleError(err);
        res.status(404).json( errors );
    } 
} 

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try{
        const id = req.params.id;
        const user = await findUserById(id);
        res.status(200).json(formatUserResponse(user));
    }catch(err: any){
        const errors = handleError(err);
        res.status(404).json( errors );
    }
}

export const getUserByUsername = async (req: Request, res: Response): Promise<void> => {
    try{
        const username = req.params.username;
        const user = await findUserByUsername(username);
        res.status(200).json(formatUserResponse(user));
    }catch(err: any){
        const errors = handleError(err);
        res.status(404).json( errors );
    }
}

export const updateUserData = async (req: Request, res: Response): Promise<void> => {
    try{
        const updatedData = req.body;
        const id = req.user.id;
        const user = await findUserById(id);

        const updatedUser = await update(user, updatedData);
        res.status(200).json(formatUserResponse(updatedUser));
    }catch(err: any){
        const errors = handleError(err);
        res.status(500).json( errors );
    }
}

export const updateByAdmin = async (req: Request, res: Response): Promise<void> => {
    try{
        const updatedData = req.body;
        const username = req.params.username;
        const user = await findUserByUsername(username);

        const updatedUser = await update(user, updatedData);
        res.status(200).json(formatUserResponse(updatedUser));
    }catch(err: any){
        const errors = handleError(err);
        res.status(500).json( errors );
    }
}

export const deleteUserAccount = async (req: Request, res: Response): Promise<void> => {
    try{
        const id = req.user.id;
        const user = await findUserById(id);
        user.isActive = false;
        await saveUser(user);
        res.status(200).json({ message: `${user.username} have been deleted`});
    }catch(err: any){
        const errors = handleError(err);
        res.status(404).json( errors );
    }
}

export const deleteUserById = async (req: Request, res: Response): Promise<void> => {
    try{
        const id = req.params.id;
        const user = await findUserById(id);
        user.isActive = false;
        await saveUser(user);
        res.status(200).json({ message: `${user.username} have been deleted`});
    }catch(err: any){
        const errors = handleError(err);
        res.status(404).json( errors );
    }
}

export const deleteUserByUsername = async (req: Request, res: Response): Promise<void> => {
    try{
        const username = req.params.username;
        const user = await findUserByUsername(username);
        user.isActive = false;
        await saveUser(user);
        res.status(200).json({ message: `${user.username} have been deleted`});
    }catch(err: any){
        const errors = handleError(err);
        res.status(404).json( errors );
    }
}