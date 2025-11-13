import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

let client;

const openDb = () => {
    if (!client) {
        client = new MongoClient(process.env.MONGO_URL);
    }
    return client;
}

const setBalance = async (accountId, balance) => {
    const DB_NAME = process.env.DB_NAME;
    const client = openDb();
    if (!client.topology || !client.topology.isConnected()) {
        await client.connect();
    }

    const users = client.db(DB_NAME).collection('users');

    await users.updateOne(
        { accountId },
        { $set: { balance } }
    );

    console.log(`✔ MongoDB set balance for account: ${accountId}, balance: ${balance}`);
}

const closeDb = async () => {
    if (client) {
        await client.close();
        client = null;
        console.log('✔ MongoDB connection closed');
    }
}

module.exports = { openDb, setBalance, closeDb };