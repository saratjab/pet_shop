import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

//? set up in-memory mongoDB before tests run + clears the data after each test and clean everything up when all tests finish
let mongo: MongoMemoryServer;

beforeAll(async () => {
  //? runs once before all tests
  //   jest.setTimeout(30000); // 30 seconds, to give MongoDB memory server time
  mongo = await MongoMemoryServer.create(); //? creat an in-memory mongoDB instance (no real database is used)
  //* it's fast, temporary, perfect for isolated

  const uri = mongo.getUri(); //? gets the connection string
  await mongoose.connect(uri); //? connect app to this in-memory mongoDB using mongoose
});

afterEach(async () => {
  //? runs after each test to keep tests clean and indepenedent
  if (!mongoose.connection.db) {
    throw new Error('Database is not connected yet.');
  }

  const collections = await mongoose.connection.db.collections(); //? get all collection (tables) in the temporary in-memory DB
  for (const collection of collections) {
    await collection.deleteMany({}); //? delete all data in every collection / to make sure every test starts with a fresh database
  }
});

afterAll(async () => {
  //? runs after all tests finish for cleanup
  await mongoose.disconnect(); //? close the mongoose connection to mongoDB
  if (mongo) {
    await mongo.stop(); //? shut down the in-memory instanc
  }
});
