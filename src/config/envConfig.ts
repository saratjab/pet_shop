import dotenv from 'dotenv';
import path from 'path';

const node_env = process.env.NODE_ENV || 'development';

dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
});

dotenv.config({
  path: path.resolve(process.cwd(), `.env.${node_env}`),
});

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env = {
  node_env,
  PORT: required('PORT'),
  DATABASE_URL: required('DATABASE_URL'),
  ACCESS_TOKEN_SECRET: required('ACCESS_TOKEN_SECRET'),
  REFRESH_TOKEN_SECRET: required('REFRESH_TOKEN_SECRET'),
};
