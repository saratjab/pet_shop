import dotenv from 'dotenv';
import path from 'path';

const node_env = process.env.NODE_ENV || 'development';

dotenv.config({
    path: path.resolve(__dirname, `../../.env`),
});

dotenv.config({
    path: path.resolve(__dirname, `../../.env.${node_env}`),
});

const required = (key: string): string => {
    const value = process.env[key];
    if(!value) {
        console.error(`Missing required environment variable: ${key}`);
        process.exit(1);
    }
    return value;
}

export const env = {
    node_env,
    PORT: required('PORT'),
    DATABASE_URL: required('DATABASE_URL'),
    ACCESS_TOKEN_SECRET: required('ACCESS_TOKEN_SECRET'),
    REFRESH_TOKEN_SECRET: required('REFRESH_TOKEN_SECRET'),
};
console.log(env);