import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios'; 
import { localStorage } from '../utils/localStorage';
import { config } from 'dotenv';

export class BaseClient {
    private client: AxiosInstance;

    constructor(token?: string){
        this.client = axios.create({
            baseURL: 'http://localhost:3000/api',
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}`}),
            },
            // withCredentials: true,
        });
        this.client.interceptors.request.use(
            (config) => { //* config is a plain JavaScript object that represents the full Axios request before it’s sent.
                const token = localStorage.getItem('token');
                if(token){
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            }
        );
        // this.client.interceptors.response.use(
        //     (response) => response,
        //     async (error) => {
        //         const originalRequest = error.config;
                
        //         if(error.response?.status === 401 && !originalRequest._retry){
        //             originalRequest._retry = true;
                    
        //             const refreshToken = localStorage.getItem('refreshToken');
        //             const res = await axios.post('/api/refresh-token', { token: refreshToken });

        //             const newAccessToken = res.data.accessToken;
        //             localStorage.setItem('token', newAccessToken);

        //             originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        //             return axios(originalRequest);
        //         }
        //         return Promise.reject(error);
        //     }
        // );


    }

    public get<T>(url: string, config?: AxiosRequestConfig){
        return this.client.get<T>(url, config);
    }

    public post<T>(url: string, data: any, config?: AxiosRequestConfig){
        return this.client.post<T>(url, data, config);
    }

    public put<T>(url: string, data: any, config?: AxiosRequestConfig){
        return this.client.put<T>(url, data, config);
    }

    public delete<T>(url: string, config?: AxiosRequestConfig){
        return this.client.delete<T>(url, config);
    }
}