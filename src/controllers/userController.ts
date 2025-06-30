import { Response, Request } from 'express';
import  { IUser } from '../models/userModel';
import { saveUser, findAllUsers, findUserById, findUserByUsername, verifyPassword, update } from '../service/userService';
import { generateRefreshToken, generateToken } from '../utils/jwt';
import { handleError } from '../utils/handleErrors';
import { formatUserResponse } from '../utils/format';

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

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try{
        const newUser = req.body;
        req.body.role = 'customer';
        const savedUser = await saveUser(newUser);
        res.status(201).json(formatUserResponse(savedUser));   
    }
    catch(err: any){
        const errors = handleError(err);
        res.status(400).json( errors ) ;
    }
}

export const registerEmployee = async (req: Request, res: Response): Promise<void> => {
    try{
        const newEmp = req.body;
        if(!(newEmp.role === 'employee' || !newEmp.role)){
            throw Error(`Invalid role. As an admin, you can only register employees.`)
        }
        req.body.role = 'employee';
        const savedEmp = await saveUser(newEmp);
        res.status(201).json(formatUserResponse(newEmp));   
        
    }catch(err: any){
        const errors = handleError(err);
        res.status(400).json( errors ) ;
    }
}

export const getUsers = async (req: Request, res: Response):Promise<void> => {
    try{
        const users = await findAllUsers(); 
        res.status(200).json(users.map(user => (formatUserResponse(user))));
    }
    catch(err: any) {
        const errors = handleError(err);
        res.status(404).json( errors );
    } 
} 

export const getUser = async (req: Request, res: Response): Promise<void> => {
    try{
        let user: IUser;
        if(req.originalUrl.includes('/username')){
            user = await findUserByUsername(req.params.username);
        }
        else {
            user = await findUserById(req.params.id);
        }
        res.status(200).json(formatUserResponse(user));
    }catch(err: any){
        const errors = handleError(err);
        res.status(404).json( errors );
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try{
        let user: IUser;

        if(req.originalUrl.includes('id')){
            user = await findUserById(req.params.id);
        }
        else if(req.originalUrl.includes('username')){
            user = await findUserByUsername(req.params.username);
        }
        else{
            user = await findUserById(req.user?.id);
        }
        user.isActive = false;
        await saveUser(user);
        res.status(200).json({ message: `${user.username} have been deleted`});
    }catch(err: any){
        const errors = handleError(err);
        res.status(404).json( errors );
    }
}

export const updated = async (req: Request, res: Response): Promise<void> => {
    try{
        const updatedUser = req.body;
        let user: IUser;
        if(req.originalUrl.includes('role')){
            user = await findUserByUsername(req.params.username);
        }
        else {
            if(updatedUser.role) throw Error(`You can't change your role`);
            user = await findUserById(req.user?.id)
        }
        const UUser = await update(user, updatedUser) ;
        
        res.status(200).json({
            username: UUser.username,
            role: UUser.role,
            email: UUser.email,
            address: UUser.address
        })
    }catch(err: any){
        const errors = handleError(err);
        res.status(500).json( errors );
    }
}