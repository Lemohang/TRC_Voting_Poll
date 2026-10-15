
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { env } from './config/env';

const app = express();

app.disable('x-powered-by');

app.use(helmet());

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'TRC Voting API is running',
    timestamp: new Date().toISOString(),
  });
});

export default app;
