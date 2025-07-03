import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes';
import petRoutes from './routes/petRoutes';
import adoptRoutes from './routes/adoptRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);  
app.use('/api/pets', petRoutes);  
app.use('/api/adopts', adoptRoutes);  

export const refresshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
export const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

if(!refresshTokenSecret || !accessTokenSecret) 
    throw Error('JWT secrets are not defined in .env');


const mongoUrl = process.env.MONGO_URL;
if(!mongoUrl)
    throw new Error('Mongo Url is not define');


mongoose.connect(mongoUrl)
    .then(data => app.listen(3000, () => console.log('Server started')))
    .catch(err => new Error(err));
