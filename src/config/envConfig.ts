import dotenv from 'dotenv';
import path from 'path';

const node_env = process.env.NODE_ENV ?? 'development';

dotenv.config({
  path: path.resolve(process.cwd(), `.env.${node_env}`),
});

const required = (key: string): string => {
  if (!(key in process.env)) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  const value = process.env[key];
  if (value === undefined || value === null || value === '') {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env = {
  node_env,
  PORT: required('PORT'),
  MONGO_URL: required('MONGO_URL'),
  ACCESS_TOKEN_SECRET: required('ACCESS_TOKEN_SECRET'),
  REFRESH_TOKEN_SECRET: required('REFRESH_TOKEN_SECRET'),
};
