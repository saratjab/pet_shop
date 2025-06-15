//! not used yet 

import { Db, MongoClient } from "mongodb";
import dotenv from 'dotenv';
import { handleError } from "../utils/handleErrors";
dotenv.config();

const mongoUrl = process.env.MONGO_URL;
if(!mongoUrl) throw Error('Mongo URL is not defined');

const client = new MongoClient(mongoUrl);

let db: Db;

async function connectDB(){
    try{
        await client.connect();
        db = client.db('PET_SHOP');
    }catch(err: any){
        const errors = handleError(err);
        console.error('errors', errors);
        process.exit(1);
    }
}

export { connectDB, db };