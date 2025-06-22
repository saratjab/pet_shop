import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios'; 

class BaseClient {
    private client: AxiosInstance;

    constructor(token?: string){
        this.client = axios.create({
            baseURL: 'http:localhost:3000/api',
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}`}),
            },
        });
    }

    public get<T>(url: string, config?: AxiosRequestConfig){
        return this.client.get<T>(url, config);
    }
}