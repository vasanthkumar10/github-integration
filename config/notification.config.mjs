import dotenv from 'dotenv';
dotenv.config();

export const NOTIFICATION_CONFIG = {
  fromEmail: process.env.FROM_EMAIL || '',
  toEmail: process.env.TO_EMAIL,
  password: process.env.EMAIL_PASSWORD
};
