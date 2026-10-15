
import 'dotenv/config';

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const port = Number(process.env.PORT ?? 3001);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be a valid port number');
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: port,
  FRONTEND_URL: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  DATABASE_URL: requiredEnv('DATABASE_URL'),
};
