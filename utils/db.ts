import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL!;
if (!MONGO_URL) {
  throw new Error("❌ Please define MONGO_URL in .env");
}

// Global cached connection for Next.js hot reloads
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache;
  var sigintListenerAdded: boolean;
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

async function connect() {
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
    console.log("✅ MongoDB connected");
  } catch (error) {
    cached.promise = null;
    throw new Error("❌ Error connecting to MongoDB: " + (error as Error).message);
  }

  // Add SIGINT listener only once
  if (!global.sigintListenerAdded) {
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("💤 MongoDB disconnected on app termination");
      process.exit(0);
    });
    global.sigintListenerAdded = true;
  }

  global.mongooseCache = cached;

  return cached.conn;
}

export default connect;
