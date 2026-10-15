
import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ElectionPosition } from './election-position.entity';

export enum ElectionStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  CERTIFIED = 'CERTIFIED',
  CANCELLED = 'CANCELLED',
}

@Entity({ name: 'elections' })
@Index('IDX_elections_status', ['status'])
@Check(
  'CHK_elections_valid_dates',
  '"closesAt" > "opensAt"',
)
export class Election {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 200 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({
    type: 'enum',
    enum: ElectionStatus,
    enumName: 'elections_status_enum',
    default: ElectionStatus.DRAFT,
  })
  status!: ElectionStatus;

  @Column({ type: 'timestamptz', nullable: true })
  opensAt!: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  closesAt!: Date | null;

  @Column({ type: 'boolean', default: false })
  resultsPublished!: boolean;

  @Column({ type: 'uuid', nullable: true })
  createdBy!: string | null;

  @OneToMany(() => ElectionPosition, (position) => position.election)
  positions!: ElectionPosition[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
