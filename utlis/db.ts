import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL!;
if (!MONGO_URL) {
  throw new Error("❌ Please define MONGO_URL in .env");
}

let cached = (global as any).mongoose || { conn: null, promise: null };

const connect = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URL, {
      maxPoolSize: 5,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      bufferCommands: false,
    }).then(m => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw new Error("❌ Error connecting to Mongoose: " + (error as Error).message);
  }

  (global as any).mongoose = cached;
  return cached.conn;
};

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("💤 MongoDB disconnected on app termination");
  process.exit(0);
});

export default connect;
