import { getMongoClient } from './mongoClient.js';

export async function resetUserBalance(accountId, balance = 0) {
  const DB_NAME = process.env.DB_NAME;
  const client = getMongoClient();

  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }

  const users = client.db(DB_NAME).collection('users');

  await users.updateOne(
    { accountId },
    { $set: { balance, transactions: [] } }
  );

  console.log(`✔ MongoDB reset account: ${accountId}, balance: ${balance}`);
}