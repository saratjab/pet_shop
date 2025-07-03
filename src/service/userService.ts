import bcrypt from 'bcryptjs';
import User, { IUser, UUser } from '../models/userModel';
import { HydratedDocument } from 'mongoose';
import { updateType } from '../types/userTypes';

export const findAllUsers = async (): Promise<HydratedDocument<IUser>[]> => {
    const users = await User.find({ isActive: true });
    return users;
}

export const findUserById = async (id: string):Promise<HydratedDocument<IUser>> => {
    const user = await User.findOne({ _id: id, isActive: true });
    if(!user) throw Error('User not found');
    return user;
}

export const findUserByUsername = async (username: string): Promise<HydratedDocument<IUser>> =>{
    const user = await User.findOne({ username: username, isActive: true });
    if(!user) throw Error('User not found');
    return user;
}

export const saveUser = async (user: IUser): Promise<HydratedDocument<IUser>> => {
    const newUser = new User( user );
    const savedUser = await newUser.save();
    if(!savedUser) throw Error(`Error saving user`);
    return savedUser;
}

export const verifyPassword = async (password: string, user: IUser): Promise<boolean> => {
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) throw Error(`Wrong Password`);
    return isMatch;
}

export const update = async (user: IUser, UUser: updateType): Promise<IUser> => {
    Object.assign(user, UUser);
    return await user.save();
}
