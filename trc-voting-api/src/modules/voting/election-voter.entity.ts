
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Election } from '../elections/elections.entity';
import { User } from '../users/users.entity';

@Entity({ name: 'election_voters' })
@Index(
  'UQ_election_voters_election_user',
  ['electionId', 'userId'],
  { unique: true },
)
@Index('IDX_election_voters_election_voted', [
  'electionId',
  'hasVoted',
])
export class ElectionVoter {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  electionId!: string;

  @ManyToOne(() => Election, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'electionId' })
  election!: Election;

  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'boolean', default: false })
  hasVoted!: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  votedAt!: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
