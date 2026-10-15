
import 'reflect-metadata';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DataSource } from 'typeorm';
import { env } from './env';

import { User } from '../modules/users/users.entity';
import { Election } from '../modules/elections/elections.entity';
import { ElectionPosition } from '../modules/elections/election-position.entity';
import { Candidate } from '../modules/candidates/candidate.entity';
import { ElectionVoter } from '../modules/voting/election-voter.entity';
import { Ballot } from '../modules/voting/ballot.entity';
import { Vote } from '../modules/voting/vote.entity';
import { AuditLog } from '../modules/audit/audit-log.entity';

const caCertificate = readFileSync(
  resolve(process.cwd(), 'certs', 'supabase-ca.crt'),
  'utf8',
);

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: env.DATABASE_URL,
  synchronize: false,
  logging: env.NODE_ENV === 'development',
  entities: [
    User,
    Election,
    ElectionPosition,
    Candidate,
    ElectionVoter,
    Ballot,
    Vote,
    AuditLog,
  ],
  migrations: [resolve(process.cwd(), 'src/migrations/*.ts')],
  subscribers: [],
  ssl: {
    ca: caCertificate,
    rejectUnauthorized: true,
  },
  extra: {
    max: 5,
    connectionTimeoutMillis: 15000,
  },
});
