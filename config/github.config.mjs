import dotenv from 'dotenv';
dotenv.config();

export const GITHUB_CONFIG = {
  clientId: process.env.GITHUB_CLIENT_ID || 'default_client_id',
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  redirectUri: process.env.GITHUB_REDIRECT_URI,
  webhookUrl: process.env.WEBHOOK_URL
};
