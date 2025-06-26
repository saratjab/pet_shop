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
        if(!newUser.username || typeof newUser.username !== 'string'){
            throw Error(`username required and should be string`);
        }
        if(newUser.role && typeof newUser.role !== 'string'){
            throw Error(`role should be string`);
        }
        if(!newUser.password || typeof newUser.password !== 'string'){
            throw Error(`password requried and should be string`);
        }
        if(!newUser.email || typeof newUser.email !== 'string'){
            throw Error(`email required and should be string`);
        }
        if(newUser.address && typeof newUser.address !== 'string'){
            throw Error(`address should be string`);
        }
        if(newUser.isActive && typeof newUser.isActive !== 'boolean'){
            throw Error(`isActive should be boolean`);
        }
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
        if(!newEmp.username || typeof newEmp.username !== 'string'){
            throw Error(`username required and should be string`);
        }
        if(newEmp.role && typeof newEmp.role !== 'string'){
            throw Error(`role should be string`);
        }
        if(!newEmp.password || typeof newEmp.password !== 'string'){
            throw Error(`password requried and should be string`);
        }
        if(!newEmp.email || typeof newEmp.email !== 'string'){
            throw Error(`email required and should be string`);
        }
        if(newEmp.address && typeof newEmp.address !== 'string'){
            throw Error(`address should be string`);
        }
        if(newEmp.isActive && typeof newEmp.isActive !== 'boolean'){
            throw Error(`isActive should be boolean`);
        }
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
        const user = req.body;
        if(user.username && typeof user.username !== 'string'){
            throw Error(`username should be string`);
        }
        if(user.role && typeof user.role !== 'string'){
            throw Error(`role should be string`);
        }
        if(user.password && typeof user.password !== 'string'){
            throw Error(`password should be string`);
        }
        if(user.email && typeof user.email !== 'string'){
            throw Error(`email should be string`);
        }
        if(user.address && typeof user.address !== 'string'){
            throw Error(`address should be string`);
        }
        if(user.isActive && typeof user.isActive !== 'boolean'){
            throw Error(`isActive should be boolean`);
        }
        let UUser: IUser;
        if(req.originalUrl.includes('role')){
            UUser = await update(await findUserByUsername(req.params.username), user);
        }
        else {
            if(user.role) throw Error(`You can't change your role`);
            UUser = await update(await findUserById(req.user?.id), user);
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

