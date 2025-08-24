import { localStorage } from '../utils/localStorage';
import { IUser } from '../models/userModel';
import { BaseClient } from './BaseClient';
import { userType } from '../types/userTypes';

interface TokenTake {
  token: string;
  refreshToken: string;
  user: {
    username: string;
    role: string;
    email: string;
    address?: string;
  };
}

const client = new BaseClient();

export const loginInfo = async () => {
  try {
    const username = 'sarat';
    const password = '123';
    const response = await client.post<TokenTake>({
      url: '/login',
      data: { username, password },
    });
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('refreshToken', response.data.refreshToken);
  } catch (err) {
    console.error('Error in register', err);
    throw err;
  }
};

export const register = async (info: userType) => {
  try {
    const newUser = await client.post<IUser>({ url: '/user', data: info });
    return newUser.data;
  } catch (err) {
    console.error('Error in register', err);
    throw err;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await client.get<IUser>(`/user/id/${id}`);
    return user.data;
  } catch (err) {
    console.error('Error in register', err);
    throw err;
  }
};

export const refreshing = async () => {
  try {
    const response = await client.post<{ accessToken: string }>({
      url: '/refresh-token',
    });
    const accessToken = response.data.accessToken;
    localStorage.setItem('token', accessToken);
    return accessToken;
  } catch (err) {
    console.error('Error in refreshing', err);
    throw err;
  }
};

export const logOut = async () => {
  try {
    await client.post({ url: '/logout' });
    console.log('Success log out');
    return;
  } catch (err) {
    console.error('Error in Log Out', err);
    throw err;
  }
};
