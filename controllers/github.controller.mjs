import { GitHubService } from '../services/github.service.mjs';
import { User } from '../models/user.mjs';
import { getAccessToken } from '../utils/sessionUtils.mjs';
import { GITHUB_CONFIG } from '../config/github.config.mjs';
import { SESSION_CONFIG } from '../config/session.config.mjs';

const { clientId, redirectUri } = GITHUB_CONFIG;
const { frontendUrl } = SESSION_CONFIG;

export const login = (req, res) => {
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo user&redirect_uri=${redirectUri}`;
  res.redirect(redirectUrl);
};

export const callback = async (req, res) => {
  const { code } = req.query;
  const accessToken = await GitHubService.exchangeCodeForToken(code);
  req.session.token = accessToken;

  const github = new GitHubService(accessToken);
  const profile = await github.getUserProfile();
  const { id, login, email, avatar_url } = profile;

  await User.findOneAndUpdate(
    { githubId: id },
    {
      githubId: id,
      username: login,
      email,
      avatarUrl: avatar_url,
      accessToken
    },
    { upsert: true, new: true }
  );

  res.redirect(`${frontendUrl}/profile`);
};

export const getProfile = async (req, res) => {
  const github = new GitHubService(getAccessToken(req));
  const profile = await github.getUserProfile();
  res.json(profile);
};

export const getRepos = async (req, res) => {
  const github = new GitHubService(getAccessToken(req));
  const repos = await github.getUserRepos();
  res.json(repos);
};

export const subscribeRepo = async (req, res) => {
  const { repoFullName = '' } = req.body;
  const github = new GitHubService(getAccessToken(req));
  const webhookUrl = process.env.WEBHOOK_URL;
  const webhook = await github.createWebhook(repoFullName, webhookUrl);

  const profile = await github.getUserProfile();
  await User.findOneAndUpdate(
    { githubId: profile.id },
    { $addToSet: { subscriptions: repoFullName } }
  );

  res.json({ message: 'Webhook created', webhook });
};
