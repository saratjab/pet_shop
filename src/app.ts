// check
import express from 'express';
import mongoose from "mongoose";
import userRoutes from './routes/userRoutes';
import petRoutes from './routes/petRoutes';
import adoptRoutes from './routes/adoptRoutes';
import dotenv from 'dotenv';

dotenv.config();
import cors from 'cors';
import { startTokenCleanupJob } from './utils/tokenClenaup';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', userRoutes);  
app.use('/api', petRoutes);  
app.use('/api', adoptRoutes);  

const mongoUrl = process.env.MONGO_URL;
if(!mongoUrl){
    throw new Error('Mongo Url is not define');
}

mongoose.connect(mongoUrl)
    .then(data => app.listen(3000, () => console.log('Server started')))
    .catch(err => new Error(err));

startTokenCleanupJob();

// // ToDo: know more about thiso 
// const db = mongoose.connection.db;

// const usersCollection = db?.collection('users');
// const petsCollection = db?.collection('pets');
// const adoptsCollection = db?.collection('adopts');
