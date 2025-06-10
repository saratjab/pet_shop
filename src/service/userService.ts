import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/userModel';
import { HydratedDocument } from 'mongoose';

export const findAllUsers = async (): Promise<HydratedDocument<IUser>[]> => {
    const users = await User.find({ isActive: true });
    if(users.length === 0) throw Error('No Users found');
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

export const updateUserInfo = async (user: IUser, password: string | undefined, email: string | undefined, address: string | undefined): Promise<IUser> => {
    if(password) user.password = password;
    if(email) user.email = email;
    if(address) user.address = address;

    return await user.save();
}

// export const hashing = async (password: string): Promise<string> => {
//     const hashed = await bcrypt.hash(password, 10);
//     return hashed; //! instead of hashing using this we can use schma.pre('save')
// }