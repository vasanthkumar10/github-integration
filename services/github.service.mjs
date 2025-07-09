import axios from 'axios';

export class GitHubService {
  constructor(token) {
    this.token = token;
    this.headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json'
    };
  }

  async getUserProfile() {
    const res = await axios.get('https://api.github.com/user', {
      headers: this.headers
    });
    return res.data;
  }

  async getUserRepos() {
    const res = await axios.get('https://api.github.com/user/repos', {
      headers: this.headers
    });
    return res.data;
  }

  async getExistingWebhooks(repoFullName) {
    const res = await axios.get(
      `https://api.github.com/repos/${repoFullName}/hooks`,
      { headers: this.headers }
    );
    return res.data;
  }

  async createWebhook(repoFullName, url) {
    const existingHooks = await this.getExistingWebhooks(repoFullName);
    const alreadyExists = existingHooks.some(
      (hook) => hook.config?.url === url
    );

    if (alreadyExists) {
      return { message: 'Webhook already exists for this repository.' };
    }

    const res = await axios.post(
      `https://api.github.com/repos/${repoFullName}/hooks`,
      {
        name: 'web',
        active: true,
        events: ['pull_request'],
        config: {
          url,
          content_type: 'json'
        }
      },
      { headers: this.headers }
    );
    return res.data;
  }

  static async exchangeCodeForToken(code) {
    const tokenRes = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code
      },
      { headers: { Accept: 'application/json' } }
    );
    return tokenRes.data.access_token;
  }
}
