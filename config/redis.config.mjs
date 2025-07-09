import dotenv from 'dotenv';
dotenv.config();

export const REDIS_CONFIG = {
  redisUrl: process.env.REDIS_URL || 'default_secret'
};
