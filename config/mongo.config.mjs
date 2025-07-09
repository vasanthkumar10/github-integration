import dotenv from 'dotenv';
dotenv.config();

export const MONGO_CONFIG = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/github-integration'
};
