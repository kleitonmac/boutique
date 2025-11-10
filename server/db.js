import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = 'loja';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

async function connectDB() {
  if (db) return db;
  await client.connect();
  db = client.db(dbName);
  return db;
}

export default connectDB;
