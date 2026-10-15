
import 'reflect-metadata';
import 'dotenv/config';

import app from './app';
import { AppDataSource } from './config/database';
import { env } from './config/env';

async function bootstrap(): Promise<void> {
  try {
    await AppDataSource.initialize();
    console.log('Supabase PostgreSQL connected successfully.');

    const server = app.listen(env.PORT, () => {
      console.log(`TRC Voting API running on port ${env.PORT}`);
      console.log(`Health check: http://localhost:${env.PORT}/api/health`);
    });

    const shutdown = async (signal: string): Promise<void> => {
      console.log(`${signal} received. Shutting down...`);

      server.close(async (error) => {
        try {
          if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
          }

          if (error) {
            console.error('Server shutdown error:', error);
            process.exitCode = 1;
            return;
          }

          process.exitCode = 0;
        } catch (shutdownError) {
          console.error('Database shutdown error:', shutdownError);
          process.exitCode = 1;
        }
      });
    };

    process.once('SIGINT', () => void shutdown('SIGINT'));
    process.once('SIGTERM', () => void shutdown('SIGTERM'));
  } catch (error) {
    console.error('Failed to start TRC Voting API:', error);
    process.exitCode = 1;
  }
}

void bootstrap();
