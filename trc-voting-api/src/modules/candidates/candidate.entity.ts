
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
import { ElectionPosition } from '../elections/election-position.entity';
import { Election } from '../elections/elections.entity';
import { User } from '../users/users.entity';

@Entity({ name: 'candidates' })
@Index(
  'UQ_candidates_position_user',
  ['positionId', 'userId'],
  { unique: true },
)
@Index('IDX_candidates_position', ['positionId'])
export class Candidate {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  positionId!: string;

  @ManyToOne(() => ElectionPosition, (position) => position.candidates, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'positionId' })
  position!: ElectionPosition;

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

  @Column({ type: 'text', nullable: true })
  manifesto!: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  photoUrl!: string | null;

  @Column({ type: 'boolean', default: true })
  isApproved!: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
