import mongoose from 'mongoose';
import { MONGO_CONFIG } from './mongo.config.mjs';

const { uri } = MONGO_CONFIG;

export const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
