import { Response, Request } from 'express';
import  { IUser } from '../models/userModel';
import { saveUser, findAllUsers, findUserById, findUserByUsername, verifyPassword, update } from '../service/userService';

import { generateRefreshToken, generateToken } from '../utils/jwt';
import { handleError } from '../utils/handleErrors';
import { HydratedDocument } from 'mongoose';

export const login = async (req: Request, res: Response): Promise<void> => {
    try{
        const { username, password } = req.body;
        if(!username || !password) {
            throw Error('username and password are requried')
        }
        const user = await findUserByUsername(username);
        await verifyPassword(password, user);

        const token: string = generateToken(user.id);
        const refreshToken = generateRefreshToken(user.id);
        res.status(200).json({
            token: token,
            refreshToken: refreshToken,
            user: {
                username: username,
                role: user.role,
                email: user.email,
                address: user.address
            }
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
        if(!(newUser.role === 'customer' || newUser.role === '')){
            throw Error(`Invalid role. You can only register as a customer.`)
        }
        req.body.role = 'customer';
        const savedUser = await saveUser(newUser);
        res.status(201).json({
            username: savedUser.username,
            role: savedUser.role,
            email: savedUser.email,
            address: savedUser.address
        });   
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
        res.status(201).json({
            username: savedEmp.username,
            role: savedEmp.role,
            email: savedEmp.email,
            address: savedEmp.address
        });   
        
    }catch(err: any){
        const errors = handleError(err);
        res.status(400).json( errors ) ;
    }
}

export const getUsers = async (req: Request, res: Response):Promise<void> => {
    try{
        const users = await findAllUsers(); 
        res.status(200).json(users.map(user => ({
            username: user.username,
            role: user.role,
            email: user.email,
            address: user.address
        })));
    }
    catch(err: any) {
        const errors = handleError(err);
        res.status(404).json( errors );
    } 
} 

export const getUserById = async (req: Request, res: Response):Promise<void> =>{
    try{
        const user = await findUserById(req.params.id);
        res.status(200).json({
            username: user.username,
            role: user.role,
            email: user.email,
            address: user.address,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            
        });
    }
    catch(err: any) {
        const errors = handleError(err);
        res.status(404).json( errors )
    }
} 

export const getUserByUsername = async (req: Request, res: Response):Promise<void> =>{
    try{
        const user = await findUserByUsername(req.params.username);
        res.status(200).json({
            username: user.username,
            role: user.role,
            email: user.email,
            address: user.address
        });
    }
    catch(err: any) {
       const errors = handleError(err);
       res.status(404).json( errors );
    }
} 

export const unActiveUser = async (req: Request, res: Response): Promise<void> => {
    try{
        const user = await findUserByUsername(req.params.username);
        user.isActive = false;
        await saveUser(user);
        res.status(200).json({ message: `${user.username} have been deleted`})
    }catch(err: any){
        const errors = handleError(err);
        res.status(404).json( errors );
    }
} 

export const unActive = async (req: Request, res: Response): Promise<void> => {
    try{
        const user = await findUserById(req.user?.id);
        user.isActive = false;
        await saveUser(user);
        res.status(200).json({ message: 'You delete your account'});
    }catch(err: any){
        const errors = handleError(err);
        res.status(404).json( errors );
    }
} 

export const deleteByAdmin = async (req: Request, res: Response): Promise<void> => {
    try{
        let user: HydratedDocument<IUser>;
        let option: string;
        if(req.originalUrl.includes('id')){
            user = await findUserById(req.params.id);
            option = 'id';
        }else{
            user = await findUserByUsername(req.params.username);
            option = 'username';
        }
        user.isActive = false;
        await user.save();
        res.send(200).json({ message: `${req.params.option} has been deleted`});
    }catch(err: any){
        const errors = handleError(err);
        res.status(400).json( errors );
    }
} 

export const updated = async (req: Request, res: Response): Promise<void> => {
    try{
        let UUser: IUser;
        if(req.originalUrl.includes('role')){
            UUser = await update(await findUserByUsername(req.params.username), req.body);
        }
        else {
            if(req.body.role) throw Error(`You can't change your role`);
            UUser = await update(await findUserById(req.user?.id), req.body);
        }
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

