import mongoose from 'mongoose';
import { env } from '@/config/env';
import { Logger } from '@/utils/logger';

// Global cache for MongoDB connection in development
// to prevent hot-reload connection exhaustion
let isConnected = false;

export const connectToDatabase = async (): Promise<void> => {
  if (isConnected) {
    Logger.debug('MongoDB is already connected');
    return;
  }

  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    Logger.debug('MongoDB connection established via readyState');
    return;
  }

  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      dbName: env.DATABASE_NAME,
      bufferCommands: false,
    });

    isConnected = conn.connection.readyState === 1;
    Logger.info('MongoDB connected successfully');
  } catch (error) {
    Logger.error('MongoDB connection error', error);
    throw new Error('Failed to connect to MongoDB');
  }
};
