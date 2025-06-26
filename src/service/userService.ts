import bcrypt from 'bcryptjs';
import User, { IUser, UUser } from '../models/userModel';
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
    if(!user.username || typeof user.username !== 'string'){
        throw Error(`username required and should be string`);
    }
    if(user.role && typeof user.role !== 'string'){
        throw Error(`role should be string`);
    }
    if(!user.password || typeof user.password !== 'string'){
        throw Error(`password requried and should be string`);
    }
    if(!user.email || typeof user.email !== 'string'){
        throw Error(`email required and should be string`);
    }
    if(user.address && typeof user.address !== 'string'){
        throw Error(`address should be string`);
    }
    if(user.isActive && typeof user.isActive !== 'boolean'){
        throw Error(`isActive should be boolean`);
    }
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

export const update = async (user: IUser, UUser: UUser): Promise<IUser> => {
    if(UUser.username && typeof UUser.username !== 'string'){
        throw Error(`username should be string`);
    }
    if(UUser.role && typeof UUser.role !== 'string'){
        throw Error(`role should be string`);
    }
    if(UUser.password && typeof UUser.password !== 'string'){
        throw Error(`password should be string`);
    }
    if(UUser.email && typeof UUser.email !== 'string'){
        throw Error(`email should be string`);
    }
    if(UUser.address && typeof UUser.address !== 'string'){
        throw Error(`address should be string`);
    }
    if(UUser.isActive && typeof UUser.isActive !== 'boolean'){
        throw Error(`isActive should be boolean`);
    }
    Object.assign(user, UUser);
    return await user.save();
}
