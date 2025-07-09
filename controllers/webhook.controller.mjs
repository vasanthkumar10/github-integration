import { PubSubService } from '../services/pubsub.service.mjs';

export const handleWebhook = async (req, res) => {
  const event = req.headers['x-github-event'];
  const payload = req.body;

  if (event === 'pull_request') {
    await PubSubService.publish('pull_requests', {
      title: payload.pull_request.title,
      user: payload.pull_request.user.login,
      url: payload.pull_request.html_url,
      action: payload.action,
      pr: payload.pull_request,
      repo: payload.repository
    });
  }

  res.status(200).send('Event Received');
};
