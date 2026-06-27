import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const client = new MongoClient(process.env.MONGO_URI);

export async function connectDB() {
  await client.connect();
  const db = client.db(); // 'taskApp' from connection string
  console.log("✅ Database connected");
  return db;
}

process.on("SIGINT", async () => {
  await client.close();
  console.log("🛑 MongoDB Client Disconnected");
  process.exit(0);
});
