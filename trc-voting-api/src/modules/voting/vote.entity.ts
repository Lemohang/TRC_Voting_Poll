
import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ballot } from './ballot.entity';
import { Candidate } from '../candidates/candidate.entity';
import { ElectionPosition } from '../elections/election-position.entity';

@Entity({ name: 'votes' })
@Index('IDX_votes_ballot', ['ballotId'])
@Index('IDX_votes_position_candidate', ['positionId', 'candidateId'])
@Index('UQ_votes_ballot_position', ['ballotId', 'positionId'], {
  unique: true,
})
@Check('CHK_votes_selections_positive', '"selections" > 0')
export class Vote {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  ballotId!: string;

  @ManyToOne(() => Ballot, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'ballotId' })
  ballot!: Ballot;

  @Column({ type: 'uuid' })
  positionId!: string;

  @ManyToOne(() => ElectionPosition, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'positionId' })
  position!: ElectionPosition;

  @Column({ type: 'uuid' })
  candidateId!: string;

  @ManyToOne(() => Candidate, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'candidateId' })
  candidate!: Candidate;

  @Column({ type: 'integer', default: 1 })
  selections!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
