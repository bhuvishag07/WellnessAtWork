import 'dotenv/config';
import mongoose from 'mongoose';

export const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI;
  const fallbackUri = process.env.MONGODB_LOCAL_URI || 'mongodb://127.0.0.1:27017/wellnessatwork';

  if (primaryUri) {
    try {
      const conn = await mongoose.connect(primaryUri, {
        serverSelectionTimeoutMS: 3000,
        connectTimeoutMS: 3000
      });
      await conn.connection.db.admin().command({ ping: 1 });
      console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
      return conn;
    } catch (primaryErr) {
      console.warn(`[MongoDB] Primary Atlas connection failed (${primaryErr.message}). Switching to local MongoDB.`);
      await mongoose.disconnect().catch(() => {});
    }
  }

  try {
    const conn = await mongoose.connect(fallbackUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });
    await conn.connection.db.admin().command({ ping: 1 });
    console.log(`[MongoDB] Connected successfully to local database: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    throw error;
  }
};

mongoose.connection.on('error', (err) => {
  console.error(`[MongoDB] Runtime connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Disconnected from database.');
});

mongoose.connection.on('reconnected', () => {
  console.log('[MongoDB] Reconnected to database.');
});
