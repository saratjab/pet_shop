import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/userModel';
import { HydratedDocument } from 'mongoose';
import {  updateUserType } from '../types/userTypes';
import logger from '../config/logger';

export const findAllUsers = async (pagination: { limit: number, skip: number }): Promise<{ users: HydratedDocument<IUser>[]; total: number}> => {
    const [users, total] = await Promise.all([
        User.find({ isActive: true }).skip(pagination.skip).limit(pagination.limit),
        User.countDocuments({ isActive: true }),
    ]);
    return { users, total };
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
    logger.debug(`Saving new user to the database`);

    const newUser = new User( user );
    const savedUser = await newUser.save();
    if(!savedUser) {
        logger.error(`Failed to save user`);
        throw Error(`Error saving user`);
    }

    logger.debug(`User saved with ID: ${savedUser._id}`);
    return savedUser;
}

export const verifyPassword = async (password: string, user: IUser): Promise<boolean> => {
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) throw Error(`Wrong Password`);
    return isMatch;
}

export const update = async (user: IUser, UUser: updateUserType): Promise<IUser> => {
    Object.assign(user, UUser);
    return await user.save();
}
