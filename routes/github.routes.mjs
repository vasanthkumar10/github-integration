import { Router } from 'express';
import * as githubController from '../controllers/github.controller.mjs';

const router = Router();

router.get('/login', githubController.login);
router.get('/oauth/callback', githubController.callback);
router.get('/profile', githubController.getProfile);
router.get('/repos', githubController.getRepos);
router.post('/subscribe', githubController.subscribeRepo);

export const githubRoutes = router;
