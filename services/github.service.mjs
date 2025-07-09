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
    try {
      const res = await axios.get('https://api.github.com/user', {
        headers: this.headers
      });
      return res.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Unauthorized: Invalid or expired token');
      }
      throw error;
    }
  }

  async getUserRepos() {
    try {
      const res = await axios.get('https://api.github.com/user/repos', {
        headers: this.headers
      });
      return res.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Unauthorized: Invalid or expired token');
      }
      throw error;
    }
  }

  async getExistingWebhooks(repoFullName) {
    try {
      const res = await axios.get(
        `https://api.github.com/repos/${repoFullName}/hooks`,
        { headers: this.headers }
      );
      return res.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new Error(`Repository ${repoFullName} not found`);
      }
      if (error.response && error.response.status === 401) {
        throw new Error('Unauthorized: Invalid or expired token');
      }
      throw error;
    }
  }

  async createWebhook(repoFullName, url) {
    try {
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
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new Error(`Repository ${repoFullName} not found`);
      }
      if (error.response && error.response.status === 401) {
        throw new Error('Unauthorized: Invalid or expired token');
      }
      throw error;
    }
  }

  static async exchangeCodeForToken(code) {
    try {
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
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw new Error('Invalid code or client credentials');
      }
      throw error;
    }
  }
}
