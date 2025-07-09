import nodemailer from 'nodemailer';
import { NOTIFICATION_CONFIG } from '../config/notification.config.mjs';

const { fromEmail, password } = NOTIFICATION_CONFIG;

export class EmailService {
  static async sendEmail(to, subject, html) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: fromEmail,
          pass: password
        },
        secure: false
      });

      await transporter.sendMail({
        from: fromEmail,
        to,
        subject,
        html
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }
}
