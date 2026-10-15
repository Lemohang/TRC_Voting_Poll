
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum AuditAction {
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DEACTIVATED = 'USER_DEACTIVATED',
  VOTER_REGISTER_IMPORTED = 'VOTER_REGISTER_IMPORTED',
  ELECTION_CREATED = 'ELECTION_CREATED',
  ELECTION_UPDATED = 'ELECTION_UPDATED',
  ELECTION_OPENED = 'ELECTION_OPENED',
  ELECTION_CLOSED = 'ELECTION_CLOSED',
  CANDIDATE_CREATED = 'CANDIDATE_CREATED',
  CANDIDATE_APPROVED = 'CANDIDATE_APPROVED',
  RESULTS_PUBLISHED = 'RESULTS_PUBLISHED',
  ADMIN_LOGIN_SUCCESS = 'ADMIN_LOGIN_SUCCESS',
  ADMIN_LOGIN_FAILED = 'ADMIN_LOGIN_FAILED',
  SETTINGS_UPDATED = 'SETTINGS_UPDATED',
}

@Entity({ name: 'audit_logs' })
@Index('IDX_audit_logs_action', ['action'])
@Index('IDX_audit_logs_created_at', ['createdAt'])
@Index('IDX_audit_logs_actor', ['actorUserId'])
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', nullable: true })
  actorUserId!: string | null;

  @Column({
    type: 'enum',
    enum: AuditAction,
    enumName: 'audit_action_enum',
  })
  action!: AuditAction;

  @Column({ type: 'varchar', length: 100, nullable: true })
  entityType!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  entityId!: string | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: Record<string, unknown> | null;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
