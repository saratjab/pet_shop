//! not used yet

import { Db, MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { handleError } from '../utils/handleErrors';
import { errorType } from '../types/errorType';
dotenv.config();

const mongoUrl = process.env.MONGO_URL;
if (!mongoUrl) throw Error('Mongo URL is not defined');

const client = new MongoClient(mongoUrl);

let db: Db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db('PET_SHOP');
  } catch (err: unknown) {
    const errors = handleError(err as errorType);
    console.error('errors', errors);
    process.exit(1);
  }
}

export { connectDB, db };
