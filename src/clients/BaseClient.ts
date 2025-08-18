import axios from 'axios';

import { localStorage } from '../utils/localStorage';
import { createPetType } from '../types/petTypes';
import { userType } from '../types/userTypes';

type AxiosInstance = ReturnType<typeof axios.create>;
type AxiosRequestConfig = NonNullable<Parameters<typeof axios.get>[1]>;

export class BaseClient {
  private client: AxiosInstance;

  constructor(token?: string) {
    this.client = axios.create({
      baseURL: 'http://localhost:3000/api',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      // withCredentials: true,
    });

    this.client.interceptors.request.use((config) => {
      //* config is a plain JavaScript object that represents the full Axios request before it’s sent.
      const token = localStorage.getItem('token');
      if (!config.headers) {
        config.headers = {};
      }
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const config = error.config;

        if (config.url?.includes('/refresh-token')) {
          return Promise.reject(error);
        }
        if (error.response?.status === 401 && !config._retry) {
          config._retry = true;

          try {
            const response = await this.client.post<{
              accessToken: string;
            }>('/refresh-token');
            const newAccessToken = response.data.accessToken;

            localStorage.setItem('token', newAccessToken);
            config.headers['Authorization'] = `Bearer ${newAccessToken}`;

            return this.client(config);
          } catch (err) {
            console.error('Refresh Token failed');
            return Promise.reject(err);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  public get<T>(url: string, config?: AxiosRequestConfig) {
    return this.client.get<T>(url, config);
  }

  public post<T>(
    url: string,
    data?: createPetType | userType,
    config?: AxiosRequestConfig
  ) {
    return this.client.post<T>(url, data, config);
  }

  public put<T>(
    url: string,
    data: createPetType | userType,
    config?: AxiosRequestConfig
  ) {
    return this.client.put<T>(url, data, config);
  }

  public delete<T>(url: string, config?: AxiosRequestConfig) {
    return this.client.delete<T>(url, config);
  }
}
