import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongo: MongoMemoryServer;

beforeAll(async () => {
  try {
    mongo = await MongoMemoryServer.create();

    const uri = mongo.getUri();
    const db = await mongoose.connect(uri);
  } catch (err: any) {
    throw new Error(`Failed to connect to the database: ${err.message}`);
  }
});

afterEach(async () => {
  if (!mongoose.connection.db) {
    throw new Error('Database is not connected yet.');
  }

  const collections = await mongoose.connection.db.collections();
  await Promise.all(collections.map((collection) => collection.deleteMany({})));
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongo) {
    await mongo.stop();
  }
});
