import { localStorage } from '../utils/localStorage';
import { IUser } from '../models/userModel';
import { BaseClient } from './BaseClient';
import { resolveTypeReferenceDirective } from 'typescript';

interface TokenTake {
    token: string,
    refreshToken: string,
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
        const response = await client.post<TokenTake>(`/login`, { username, password });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
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

export const refreshing = async () => {
    try{
        const response = await client.post<{ accessToken: string }>('/refresh-token');
        const accessToken = response.data.accessToken;
        localStorage.setItem('token', accessToken);
        return accessToken;
    }catch(err){
        console.error('Error in refreshing', err);
        throw err;
    }
}

export const logingOut = async () => {
    try{
        const response = await client.post('/logout');
        console.log('Success log out');
        return;
    }
    catch(err){
        console.error('Error in Log Out', err);
        throw err;
    }
}