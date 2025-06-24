import { localStorage } from '../utils/localStorage';
import { IUser } from '../models/userModel';
import { BaseClient } from './BaseClient';

interface TokenTake {
    token: string,
    user: {
        username: string,
        role: string,
        email: string,
        address?: string
    }
}

const client = new BaseClient();

export const loginInfo = async () =>{
    try{
        let username = 'sarat';
        let password = '123';
        const token = await client.post<TokenTake>(`/login`, { username, password });
        localStorage.setItem('token', token.data.token);
    }catch(err){
        console.error('Error in register', err);
        throw err;
    }
}

export const register = async (info: {
    username: string,
    role: string,
    password: string,
    email: string,
    address?: string
}) => {
    try{
        const newUser = await client.post<IUser>('/user', info);
        return newUser.data;
        
    }catch(err){
        console.error('Error in register', err);
        throw err;
    }
}

export const getUserById = async (id: string) => {
    try{
        const user = await client.get<IUser>(`/user/id/${id}`);
        return user.data;

    }catch(err){
        console.error('Error in register', err);
        throw err;
    }
}
