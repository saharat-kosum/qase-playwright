import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

let client;

export function getMongoClient() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL);
  }
  return client;
}