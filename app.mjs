import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import { githubRoutes } from './routes/github.routes.mjs';
import { webhookRoutes } from './routes/webhook.routes.mjs';
import { connectDB } from './config/db.mjs';
import { SESSION_CONFIG } from './config/session.config.mjs';
import { handleError } from './middlewares/errorhandler.mjs';

dotenv.config();
connectDB();

const app = express();
const { secret } = SESSION_CONFIG;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: true
  })
);

app.use('/api/github', githubRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use((err, req, res, next) => {
  handleError(err, res);
});

export default app;
