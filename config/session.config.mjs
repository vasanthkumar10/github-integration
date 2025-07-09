import dotenv from 'dotenv';
dotenv.config();

export const SESSION_CONFIG = {
  secret: process.env.SESSION_SECRET || 'default_secret',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
};
