import { Router } from 'express';
import { handleWebhook } from '../controllers/webhook.controller.mjs';

const router = Router();

router.post('/', handleWebhook);

export const webhookRoutes = router;
