import { createClient } from 'redis';
import { EmailService } from './email.service.mjs';
import { REDIS_CONFIG } from '../config/redis.config.mjs';
import { NOTIFICATION_CONFIG } from '../config/notification.config.mjs';

const { redisUrl } = REDIS_CONFIG;
const { toEmail } = NOTIFICATION_CONFIG;

const redis = createClient({ url: redisUrl });
await redis.connect();

export class PubSubService {
  static async publish(channel, data) {
    const { repo, pr } = data;
    let subject = `New PR on ${repo.full_name}`;

    if (data.action === 'closed') {
      subject = `PR #${pr.number} closed on ${repo.full_name}`;
    }

    const html = `
      <h3>${data.pr.title}</h3>
      <p>Author: ${pr.user.login}</p>
      <p><a href="${pr.html_url}">View Pull Request</a></p>
    `;

    if (!channel || !data) {
      throw new Error('Channel and data are required to publish a message');
    }

    await EmailService.sendEmail(toEmail, subject, html);
    await redis.publish(channel, JSON.stringify(data));
  }
}
