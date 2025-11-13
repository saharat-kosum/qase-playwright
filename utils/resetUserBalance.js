import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

export async function resetUserBalance(accountId, balance = 0) {
  const MONGO_URL = process.env.MONGO_URL;
  const DB_NAME = process.env.DB_NAME;

  if (!MONGO_URL) {
    throw new Error('MONGO_URL env variable is required');
  }

  if (!DB_NAME) {
    throw new Error('DB_NAME env variable is required');
  }

  const client = new MongoClient(MONGO_URL);

  try {
    await client.connect();
    const users = client.db(DB_NAME).collection('users');
    await users.updateOne(
      { accountId },
      { $set: { balance, transactions: [] } }
    );

    console.log(`✔ MongoDB reset account: ${accountId}, balance: ${balance}`);
  } finally {
    await client.close();
  }
}